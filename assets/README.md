# Oakhaven image assets

Every image the game draws, exported as transparent PNG. The game itself
draws these procedurally at load time, so it does **not** need this folder to
run. These files are for editing, replacing, or reusing the art elsewhere.

Regenerate with `node tools/export_assets.js` (needs `npm i @napi-rs/canvas`).

## Characters: `characters/<id>/`

| File | What it is |
|---|---|
| `<id>_sheet_32x56.png` | Sprite sheet. 5 columns × 3 rows of 32×56 frames. |
| `<id>_sheet_preview_x4.png` | The same sheet scaled up 4× for viewing. |
| `frames/<view>_<frame>.png` | Each frame on its own. |
| `portraits/<id>_portrait_<expr>_64x80.png` | Dialogue portrait in three expressions: steady, grim, hurt. |
| `portraits/*_x4.png` | The portraits scaled up 4× for viewing. |

- **Rows:** front, side (facing right), back. The left view is the side row mirrored.
- **Columns:** idle, walk 1, walk 2, act (reach, shoot or claw), hurt.
- **Ground:** the bottom pixel row. Each character's feet sit at the centre of the bottom row.
- **Ghosts:** colour reads as glow. The engine draws them at full brightness, regardless of lighting.

`manifest.json` lists every character's display name, sheet, frame size and
portraits, plus every prop, pickup and vehicle.

## Other images

- `props/` has world sprites: lamps, trees, barrels, fire, counter, jukebox and so on.
- `pickups/` has item icons.
- `vehicles/` has the cars in front, side and back views.
- Each folder has an `x4/` subfolder with copies scaled up 4×.
- `oakhaven_cast_sheet.png` shows the 12-character cast from the reference board, laid out like the board.

## Replacing art

To swap in your own art, keep the same frame size and layout, then load it in
`charSet()` in `src/20_art.js` in place of the generated frames.
