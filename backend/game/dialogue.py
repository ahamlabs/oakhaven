"""Dialogue graph runtime.

Conditions and effects are *data*, never expressions. Nothing here calls eval
or exec, so dialogue files stay safe to hot-reload, ship as mod content, or
accept from a level editor without becoming an arbitrary-code-execution hole.

Condition grammar (all keys optional, all must pass):

    {"flags":     {"mill_lead": true, "sober": false},
     "counters":  {"drinks": {"eq": 0}, "blood_doses": {"lte": 2}},
     "meters":    {"stress": {"gte": 70}},
     "alignment": {"nihilism": {"gt": 3}},
     "fragments": {"gte": 4},
     "act":       {"eq": 2},
     "any":       [ ...nested conditions... ],
     "not":       { ...nested condition... }}

Effect grammar:

    {"flags":     {"saw_tear": true},
     "counters":  {"drinks": 1},              # increments
     "meters":    {"stress": -22},            # deltas
     "alignment": {"humanism": 2},
     "fragment":  "mill:24,6",                # deduped by id
     "give":      ["beer_mat"],
     "act":       2,                          # absolute set
     "log":       "Marla named the buyer."}
"""

from __future__ import annotations

from typing import Any

from .state import GameState

_OPS = {
    "eq": lambda a, b: a == b,
    "ne": lambda a, b: a != b,
    "gt": lambda a, b: a > b,
    "gte": lambda a, b: a >= b,
    "lt": lambda a, b: a < b,
    "lte": lambda a, b: a <= b,
}


def _cmp(value: float, spec: Any) -> bool:
    """A bare number means equality; a dict means one or more operators."""
    if isinstance(spec, dict):
        return all(_OPS[op](value, target) for op, target in spec.items() if op in _OPS)
    return value == spec


def check(cond: dict | None, st: GameState) -> bool:
    if not cond:
        return True

    for flag, want in cond.get("flags", {}).items():
        if bool(st.flags.get(flag, False)) != bool(want):
            return False

    for name, spec in cond.get("counters", {}).items():
        if not _cmp(getattr(st.counters, name, 0), spec):
            return False

    for name, spec in cond.get("meters", {}).items():
        if not _cmp(getattr(st.meters, name, 0), spec):
            return False

    for name, spec in cond.get("alignment", {}).items():
        if not _cmp(getattr(st.alignment, name, 0), spec):
            return False

    if "fragments" in cond and not _cmp(st.fragment_count, cond["fragments"]):
        return False

    if "act" in cond and not _cmp(st.act, cond["act"]):
        return False

    if "ascetic" in cond and st.is_ascetic() != bool(cond["ascetic"]):
        return False

    if "any" in cond and not any(check(c, st) for c in cond["any"]):
        return False

    if "not" in cond and check(cond["not"], st):
        return False

    return True


def apply(effects: dict | None, st: GameState) -> None:
    if not effects:
        return

    for flag, val in effects.get("flags", {}).items():
        st.flags[flag] = bool(val)

    for name, delta in effects.get("counters", {}).items():
        if hasattr(st.counters, name):
            setattr(st.counters, name, getattr(st.counters, name) + int(delta))

    for name, delta in effects.get("meters", {}).items():
        if hasattr(st.meters, name):
            setattr(st.meters, name, getattr(st.meters, name) + float(delta))
    st.meters.clamp()

    for name, delta in effects.get("alignment", {}).items():
        if hasattr(st.alignment, name):
            setattr(st.alignment, name, getattr(st.alignment, name) + int(delta))

    frag = effects.get("fragment")
    if frag and frag not in st.fragments:
        st.fragments.append(frag)

    for item in effects.get("give", []):
        if item not in st.inventory:
            st.inventory.append(item)

    if "act" in effects:
        st.act = int(effects["act"])

    if "log" in effects:
        st.note(str(effects["log"]))

    # Drinking and dosing have mechanical consequences beyond the counter.
    drinks = effects.get("counters", {}).get("drinks", 0)
    if drinks:
        st.meters.sobriety = max(0.0, st.meters.sobriety - 25 * drinks)
    doses = effects.get("counters", {}).get("blood_doses", 0)
    if doses:
        st.meters.blood = min(100.0, st.meters.blood + 18 * doses)


class DialogueRunner:
    """Walks a loaded set of dialogue trees against a GameState."""

    def __init__(self, trees: dict[str, dict]):
        self.trees = trees

    def open(self, tree_id: str, st: GameState) -> dict:
        tree = self.trees[tree_id]
        return self.render(tree_id, tree["start"], st)

    def render(self, tree_id: str, node_id: str | None, st: GameState) -> dict:
        if node_id is None:
            return {"tree": tree_id, "node": None, "done": True}

        node = self.trees[tree_id]["nodes"][node_id]
        choices = [
            {
                "index": i,
                "text": c["text"],
                "tone": c.get("tone"),
                "next": c.get("next"),
                "effects": c.get("effects"),
            }
            for i, c in enumerate(
                c for c in node["choices"] if check(c.get("requires"), st)
            )
        ]
        return {
            "tree": tree_id,
            "node": node_id,
            "speaker": node["speaker"],
            "text": node["text"],
            "choices": choices,
            "done": False,
        }

    def choose(self, tree_id: str, node_id: str, index: int, st: GameState) -> dict:
        node = self.trees[tree_id]["nodes"][node_id]
        available = [c for c in node["choices"] if check(c.get("requires"), st)]
        if not 0 <= index < len(available):
            raise IndexError(f"choice {index} not available on {tree_id}.{node_id}")

        picked = available[index]
        apply(picked.get("effects"), st)
        return self.render(tree_id, picked.get("next"), st)

    def validate(self) -> list[str]:
        """Static check over all trees. Run this in CI — a dangling `next`
        is the single most common authoring mistake and it strands the player
        mid-conversation with no way out."""
        problems: list[str] = []
        for tid, tree in self.trees.items():
            nodes = tree.get("nodes", {})
            if tree.get("start") not in nodes:
                problems.append(f"{tid}: start node {tree.get('start')!r} missing")
            for nid, node in nodes.items():
                if not node.get("choices"):
                    problems.append(f"{tid}.{nid}: no choices — player gets stuck")
                for i, c in enumerate(node.get("choices", [])):
                    nxt = c.get("next")
                    if nxt is not None and nxt not in nodes:
                        problems.append(f"{tid}.{nid}[{i}]: next {nxt!r} does not exist")
        return problems
