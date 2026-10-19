"""Authoritative game state.

The browser owns the 60 Hz simulation — movement, collision, rendering. This
module owns everything the *story* depends on, because those are the values a
player would otherwise edit in devtools: meters, flags, alignment, and which
ending they've earned.
"""

from __future__ import annotations

import time
import uuid
from dataclasses import dataclass, field, asdict
from typing import Any


# Fragments of the universe's own source, scattered across the map. Collecting
# enough of them is a precondition for the fourth-wall ending.
TOTAL_FRAGMENTS = 12
FRAGMENTS_REQUIRED = 9


@dataclass
class Meters:
    stress: float = 34.0        # 0 calm .. 100 unusable
    sobriety: float = 100.0     # Dean: drops with every drink
    blood: float = 0.0          # Sam: rises with every dose, never falls
    health: float = 100.0

    def clamp(self) -> None:
        self.stress = min(100.0, max(0.0, self.stress))
        self.sobriety = min(100.0, max(0.0, self.sobriety))
        self.blood = min(100.0, max(0.0, self.blood))
        self.health = min(100.0, max(0.0, self.health))


@dataclass
class Alignment:
    """Two independent axes, not a slider.

    A player can be high on both — that's someone who solves things violently
    *and* keeps trying to save people, which is the most interesting run.
    """
    nihilism: int = 0
    humanism: int = 0


@dataclass
class Counters:
    drinks: int = 0
    refusals: int = 0
    blood_doses: int = 0
    brothel_visits: int = 0
    civilians_killed: int = 0
    ghosts_burned: int = 0
    ghosts_freed: int = 0


@dataclass
class GameState:
    session: str = field(default_factory=lambda: uuid.uuid4().hex[:12])
    protagonist: str = "dean"           # "dean" | "sam"
    act: int = 1
    sector: str = "street"
    x: float = 27.5
    y: float = 41.0
    angle: float = -1.5708

    meters: Meters = field(default_factory=Meters)
    alignment: Alignment = field(default_factory=Alignment)
    counters: Counters = field(default_factory=Counters)

    flags: dict[str, bool] = field(default_factory=dict)
    fragments: list[str] = field(default_factory=list)   # terminal ids, deduped
    inventory: list[str] = field(default_factory=list)
    log: list[str] = field(default_factory=list)
    updated: float = field(default_factory=time.time)

    # ── queries ──────────────────────────────────────────────────────────
    @property
    def fragment_count(self) -> int:
        return len(self.fragments)

    @property
    def glitch_level(self) -> float:
        """How badly reality is rendering.

        Act progression is the floor; unmanaged stress and Sam's blood
        intake push it higher. This is the one number the client polls most,
        because it drives the whole look of the game.
        """
        base = {1: 0.0, 2: 0.08, 3: 0.42, 4: 0.72}.get(self.act, 0.0)
        strain = max(0.0, self.meters.stress - 68) / 32 * 0.45
        blood = self.meters.blood / 100 * 0.30
        return round(min(1.2, base + strain + blood), 3)

    def is_ascetic(self) -> bool:
        """The run the secret ending demands: no crutches, either brother."""
        c = self.counters
        return c.drinks == 0 and c.blood_doses == 0 and c.brothel_visits == 0

    def ending(self) -> tuple[str, str]:
        """Resolve which ending the playthrough has earned.

        Checked in priority order — the secret ending outranks the others
        because it requires strictly more discipline than either.
        """
        c = self.counters

        if (
            self.is_ascetic()
            and self.fragment_count >= FRAGMENTS_REQUIRED
            and self.flags.get("kevin_detoxed")
            and c.civilians_killed == 0
        ):
            return (
                "sys_exit",
                "The sys.exit() Protocol — the brothers stop being characters.",
            )

        if self.alignment.humanism > self.alignment.nihilism and self.meters.blood > 40:
            return (
                "martyrdom",
                "The Savior's Martyrdom — the town lives; Sam does not, in any "
                "sense that matters.",
            )

        if self.alignment.nihilism >= self.alignment.humanism:
            return (
                "match",
                "The Nihilist's Match — Oakhaven burns, and so does everyone "
                "still in it.",
            )

        return ("hollow", "No clean exit. They drive out with less than they came in with.")

    # ── serialisation ────────────────────────────────────────────────────
    def snapshot(self) -> dict[str, Any]:
        d = asdict(self)
        d["fragment_count"] = self.fragment_count
        d["fragments_required"] = FRAGMENTS_REQUIRED
        d["total_fragments"] = TOTAL_FRAGMENTS
        d["glitch_level"] = self.glitch_level
        d["ascetic"] = self.is_ascetic()
        return d

    @classmethod
    def restore(cls, d: dict[str, Any]) -> "GameState":
        """Rebuild from a snapshot.

        Snapshots carry derived values too (fragment_count, glitch_level, …)
        so the client doesn't have to recompute them. Those are read-only
        properties here, so they're skipped rather than assigned.
        """
        st = cls()
        for k, v in d.items():
            if isinstance(getattr(cls, k, None), property):
                continue
            if k == "meters":
                st.meters = Meters(**{f: v[f] for f in v if f in Meters.__annotations__})
            elif k == "alignment":
                st.alignment = Alignment(**{f: v[f] for f in v if f in Alignment.__annotations__})
            elif k == "counters":
                st.counters = Counters(**{f: v[f] for f in v if f in Counters.__annotations__})
            elif hasattr(st, k):
                setattr(st, k, v)
        return st

    def note(self, line: str) -> None:
        self.log.append(line)
        del self.log[:-200]
