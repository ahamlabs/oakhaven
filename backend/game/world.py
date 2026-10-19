"""Sector generation.

Maps are built in code rather than stored as files so they stay diffable and
parameterisable — Act III needs to *fold* the street sector, and mutating a
generator is far easier than hand-editing 46 rows of characters.

Tile legend
    '#' brick      'W' boarded wood   'G' grimy glass   '=' corrugated steel
    '+' door       'T' terminal       'F' living wall (Act IV)
    '.' asphalt    ',' sidewalk       ' ' dirt          'o' interior boards
"""

from __future__ import annotations

import random
from typing import Any

SOLID = set("#WG=+TFS")


class Grid:
    def __init__(self, w: int, h: int, fill: str = " "):
        self.w, self.h = w, h
        self.rows = [[fill] * w for _ in range(h)]

    def rect(self, x0: int, y0: int, x1: int, y1: int, ch: str) -> "Grid":
        for y in range(max(0, y0), min(self.h, y1 + 1)):
            for x in range(max(0, x0), min(self.w, x1 + 1)):
                self.rows[y][x] = ch
        return self

    def box(self, x0: int, y0: int, x1: int, y1: int, ch: str) -> "Grid":
        for x in range(x0, x1 + 1):
            self.rows[y0][x] = ch
            self.rows[y1][x] = ch
        for y in range(y0, y1 + 1):
            self.rows[y][x0] = ch
            self.rows[y][x1] = ch
        return self

    def set(self, x: int, y: int, ch: str) -> "Grid":
        self.rows[y][x] = ch
        return self

    def dump(self) -> list[str]:
        return ["".join(r) for r in self.rows]


def _sector(sid: str, name: str, g: Grid, **kw: Any) -> dict:
    base = {
        "id": sid,
        "name": name,
        "grid": g.dump(),
        "outdoor": False,
        "sky": "wood",
        "rain": 0.0,
        "ambient": 0.2,
        "spawn": {"x": 2.5, "y": 2.5, "a": 0.0},
        "doors": {},
        "lights": [],
        "entities": [],
    }
    base.update(kw)
    return base


def street() -> dict:
    W, H = 56, 46
    g = Grid(W, H, " ")
    g.box(0, 0, W - 1, H - 1, "#")                 # the Act II fog wall
    g.rect(25, 1, 30, H - 2, ".")                  # main drag
    g.rect(1, 20, W - 2, 25, ".")                  # cross street
    g.rect(23, 1, 24, H - 2, ",").rect(31, 1, 32, H - 2, ",")
    g.rect(1, 18, W - 2, 19, ",").rect(1, 26, W - 2, 27, ",")

    g.box(6, 6, 20, 16, "W").rect(8, 6, 11, 6, "G").rect(15, 6, 18, 6, "G")
    g.set(13, 16, "+")                             # pawnshop
    g.box(6, 30, 19, 40, "#").rect(6, 33, 6, 37, "G")
    g.set(12, 30, "+")                             # motel
    g.box(36, 5, 50, 15, "#").rect(36, 8, 36, 12, "G")
    g.set(43, 15, "+")                             # dive bar
    g.box(36, 31, 51, 42, "W").rect(38, 31, 41, 31, "G")
    g.set(45, 31, "+")                             # mill office
    g.rect(21, 10, 22, 12, " ").set(21, 11, "T")   # terminal in the alley
    g.box(2, 2, 4, 4, "W").set(3, 4, "+")          # the house on Bellweather (Act II)

    return _sector(
        "street", "Main Street", g,
        outdoor=True, sky="fog", rain=0.85, ambient=0.0,
        spawn={"x": 27.5, "y": 41.0, "a": -1.5708},
        doors={
            "13,16": {"to": "pawn",  "x": 9.5,  "y": 8.5,  "a": -1.5708},
            "12,30": {"to": "motel", "x": 10.0, "y": 3.0,  "a": 1.5708},
            "43,15": {"to": "bar",   "x": 9.5,  "y": 9.5,  "a": -1.5708},
            "45,31": {"to": "mill",  "x": 14.0, "y": 3.0,  "a": 1.5708},
            "3,4":   {"to": "trap",  "x": 9.0,  "y": 12.0, "a": -1.5708, "act": 2},
        },
        lights=[
            {"x": 24.0, "y": 9.0, "p": 2.6, "f": 0.10}, {"x": 31.5, "y": 17.0, "p": 2.6, "f": 0.10},
            {"x": 24.0, "y": 29.0, "p": 2.6, "f": 0.10}, {"x": 31.5, "y": 38.0, "p": 2.6, "f": 0.10},
            {"x": 13.0, "y": 17.6, "p": 1.5, "f": 0.22}, {"x": 44.0, "y": 16.4, "p": 1.9, "f": 0.18},
        ],
        entities=[
            {"m": "lamp", "kind": "prop", "x": 24.0, "y": 9.0, "r": 0.3, "h": 3.4},
            {"m": "lamp", "kind": "prop", "x": 31.5, "y": 17.0, "r": 0.3, "h": 3.4},
            {"m": "lamp", "kind": "prop", "x": 24.0, "y": 29.0, "r": 0.3, "h": 3.4},
            {"m": "lamp", "kind": "prop", "x": 31.5, "y": 38.0, "r": 0.3, "h": 3.4},
            {"m": "impala", "kind": "vehicle", "x": 29.0, "y": 40.0, "r": 0.7, "h": 1.5,
             "heading": -1.5708, "speed": 0, "driveable": True},
            {"m": "tree", "kind": "prop", "x": 3.5, "y": 10.5, "r": 0.5, "h": 2.6},
            {"m": "tree", "kind": "prop", "x": 3.5, "y": 34.5, "r": 0.5, "h": 2.6},
            {"m": "tree", "kind": "prop", "x": 52.5, "y": 22.5, "r": 0.5, "h": 2.6},
            {"m": "tree", "kind": "prop", "x": 34.5, "y": 44.0, "r": 0.5, "h": 2.6},
            {"m": "car", "kind": "car", "x": 27.0, "y": 44.0, "r": 0.62, "h": 1.1,
             "speed": 2.4, "route": [[27, 44], [27, 22.5], [6, 22.5], [27, 22.5], [27, 44]]},
            {"m": "car", "kind": "car", "x": 29.0, "y": 4.0, "r": 0.62, "h": 1.1,
             "speed": 1.9, "route": [[29, 4], [29, 23.5], [50, 23.5], [29, 23.5], [29, 4]]},
            {"m": "person", "kind": "walker", "x": 23.5, "y": 35.0, "r": 0.28, "h": 1.7, "speed": 0.7},
            {"m": "person", "kind": "walker", "x": 32.5, "y": 12.0, "r": 0.28, "h": 1.7, "speed": 0.55},
            {"m": "person", "kind": "walker", "x": 15.0, "y": 26.5, "r": 0.28, "h": 1.7, "speed": 0.8},
        ],
    )


def motel() -> dict:
    g = Grid(20, 15, "o").box(0, 0, 19, 14, "W")
    g.rect(4, 6, 15, 6, "W").rect(8, 6, 10, 6, "o").set(10, 14, "+")
    return _sector(
        "motel", "Motel — front office", g, ambient=0.3,
        spawn={"x": 10.0, "y": 12.0, "a": -1.5708},
        doors={"10,14": {"to": "street", "x": 12.0, "y": 31.5, "a": 1.5708}},
        entities=[{"m": "clerk", "kind": "npc", "x": 9.5, "y": 4.0, "r": 0.35,
                   "h": 1.7, "dialogue": "marla", "name": "Marla"}],
    )


def mill() -> dict:
    g = Grid(28, 22, "o").box(0, 0, 27, 21, "=")
    for x in (6, 12, 18):                          # the green chain, in rows
        g.rect(x, 6, x + 1, 15, "=").rect(x, 10, x + 1, 11, "o")
    g.set(14, 21, "+").set(24, 6, "T")
    return _sector(
        "mill", "Oakhaven Mill & Timber", g, ambient=0.06,
        spawn={"x": 14.0, "y": 19.0, "a": -1.5708},
        doors={"14,21": {"to": "street", "x": 45.5, "y": 32.5, "a": 1.5708}},
        entities=[
            {"m": "barrel", "kind": "prop", "x": 22.5, "y": 17.5, "r": 0.35, "h": 0.9},
            {"m": "phantom", "kind": "npc", "x": 15.5, "y": 8.0, "r": 0.4, "h": 2.0,
             "dialogue": "phantom", "name": "Something in the sawdust", "hover": True},
        ],
    )


def pawn() -> dict:
    g = Grid(16, 12, "o").box(0, 0, 15, 11, "W")
    g.rect(3, 7, 12, 7, "W").set(7, 7, "o").set(8, 11, "+").set(14, 3, "T")
    return _sector(
        "pawn", "Pawnshop — closed", g, ambient=0.16,
        spawn={"x": 8.0, "y": 9.5, "a": -1.5708},
        doors={"8,11": {"to": "street", "x": 13.5, "y": 17.7, "a": 1.5708}},
        entities=[{"m": "barrel", "kind": "prop", "x": 4.5, "y": 4.5, "r": 0.35, "h": 0.9}],
    )


def bar() -> dict:
    g = Grid(18, 14, "o").box(0, 0, 17, 13, "#")
    g.rect(3, 4, 14, 4, "#").set(6, 4, "o").set(9, 13, "+")
    return _sector(
        "bar", "The Knot & Nail", g, ambient=0.26,
        spawn={"x": 9.0, "y": 11.0, "a": -1.5708},
        doors={"9,13": {"to": "street", "x": 44.0, "y": 16.5, "a": 1.5708}},
        entities=[
            {"m": "person", "kind": "npc", "x": 11.5, "y": 6.5, "r": 0.35, "h": 1.7,
             "dialogue": "drinker", "name": "A regular"},
            {"m": "barrel", "kind": "prop", "x": 15.5, "y": 11.5, "r": 0.35, "h": 0.9},
        ],
    )


def trap() -> dict:
    """Act II. Boarded from the inside until the lockdown; Kevin is in here."""
    g = Grid(18, 16, "o").box(0, 0, 17, 15, "W")
    g.rect(2, 8, 8, 8, "W").rect(4, 8, 5, 8, "o").set(9, 15, "+")
    return _sector(
        "trap", "The house on Bellweather", g, ambient=0.02,
        spawn={"x": 9.0, "y": 12.0, "a": -1.5708},
        doors={"9,15": {"to": "street", "x": 3.5, "y": 5.6, "a": 1.5708}},
        lights=[{"x": 4.0, "y": 4.0, "p": 0.9, "f": 0.55}],
        entities=[
            {"m": "altar", "kind": "prop", "x": 14.5, "y": 3.5, "r": 0.4, "h": 1.2},
            {"m": "civilian", "kind": "npc", "x": 4.0, "y": 4.0, "r": 0.35, "h": 1.6,
             "dialogue": "kevin", "name": "Kevin Tran"},
            {"m": "possessed", "kind": "enemy", "x": 14.0, "y": 12.0, "r": 0.35, "h": 1.9,
             "etype": "demon", "hp": 100, "speed": 0.9, "state": "cower", "dialogue": "demon"},
        ],
    )


BUILDERS = {"street": street, "motel": motel, "mill": mill,
            "pawn": pawn, "bar": bar, "trap": trap}


def build_all() -> dict[str, dict]:
    return {sid: fn() for sid, fn in BUILDERS.items()}


def for_act(sector: dict, act: int) -> dict:
    """The full per-act pipeline: seal from Act II, fold from Act III."""
    out = sector
    if act >= 2 and sector["id"] == "street":
        out = seal(out)
    return fold(out, act)


def fold(sector: dict, act: int, seed: int = 7) -> dict:
    """Act III: make the geometry stop being Euclidean.

    Rather than a bespoke 'weird' map, corrupt the real one — swap wall
    materials for living tissue and seal scattered openings, so corridors the
    player already learned start closing behind them. Familiarity is what
    makes it land.
    """
    if act < 3:
        return sector

    rng = random.Random(seed * 1000 + act)
    rows = [list(r) for r in sector["grid"]]
    intensity = 0.06 if act == 3 else 0.18

    for y in range(1, len(rows) - 1):
        for x in range(1, len(rows[0]) - 1):
            ch = rows[y][x]
            if ch in SOLID and ch != "+" and rng.random() < intensity:
                rows[y][x] = "F"
            elif ch not in SOLID and rng.random() < intensity * 0.25:
                rows[y][x] = "F"

    out = dict(sector)
    out["grid"] = ["".join(r) for r in rows]
    out["ambient"] = max(0.0, sector["ambient"] - 0.05)
    out["name"] = sector["name"] + (" — folding" if act == 3 else " — unrendered")
    return out


def seal(sector: dict) -> dict:
    """Act II: the fog closes over the town line and the streetlights go out.

    Returned as a new dict rather than mutating, so a client asking for act 1
    still gets the town it remembers.
    """
    rows = [list(r) for r in sector["grid"]]
    w, h = len(rows[0]), len(rows)
    for x in range(w):
        rows[0][x] = "S"
        rows[h - 1][x] = "S"
    for y in range(h):
        rows[y][0] = "S"
        rows[y][w - 1] = "S"
    out = dict(sector)
    out["grid"] = ["".join(r) for r in rows]
    out["lights"] = [dict(L, off=True) if L["p"] > 2 else L for L in sector.get("lights", [])]
    out["name"] = sector["name"] + " — sealed"
    return out


def validate(sectors: dict[str, dict]) -> list[str]:
    """Every door must sit on a '+' tile, point at a real sector, and land the
    player somewhere they don't immediately clip into a wall."""
    problems: list[str] = []
    for sid, s in sectors.items():
        grid = s["grid"]
        width = len(grid[0])
        if any(len(r) != width for r in grid):
            problems.append(f"{sid}: ragged grid rows")

        declared = set(s["doors"])
        actual = {f"{x},{y}" for y, row in enumerate(grid)
                  for x, ch in enumerate(row) if ch == "+"}
        for missing in actual - declared:
            problems.append(f"{sid}: door tile {missing} has no destination")
        for extra in declared - actual:
            problems.append(f"{sid}: doors[{extra}] is not a '+' tile")

        for key, d in s["doors"].items():
            if d["to"] not in sectors:
                problems.append(f"{sid}: door {key} → unknown sector {d['to']!r}")
                continue
            tgt = sectors[d["to"]]
            if _clips(tgt["grid"], d["x"], d["y"]):
                problems.append(f"{sid} → {d['to']}: arrival ({d['x']},{d['y']}) clips geometry")

        sx, sy = s["spawn"]["x"], s["spawn"]["y"]
        if _clips(grid, sx, sy):
            problems.append(f"{sid}: spawn ({sx},{sy}) clips geometry")

        for e in s["entities"]:
            gy = int(e["y"])
            gx = int(e["x"])
            if 0 <= gy < len(grid) and 0 <= gx < width and grid[gy][gx] in SOLID:
                problems.append(f"{sid}: {e['art']} spawned inside a wall at {e['x']},{e['y']}")
    return problems


def _clips(grid: list[str], x: float, y: float, r: float = 0.26) -> bool:
    """Circle-vs-grid, matching the client's collision so the two agree."""
    cx0, cy0 = int(x), int(y)
    for dy in (-1, 0, 1):
        for dx in (-1, 0, 1):
            gx, gy = cx0 + dx, cy0 + dy
            if not (0 <= gy < len(grid) and 0 <= gx < len(grid[0])):
                continue
            if grid[gy][gx] not in SOLID:
                continue
            nx = max(gx, min(x, gx + 1))
            ny = max(gy, min(y, gy + 1))
            if (x - nx) ** 2 + (y - ny) ** 2 < r * r:
                return True
    return False
