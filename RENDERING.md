# Choosing a renderer

Short version: **the raycaster doesn't care what a sprite is made of.** Swapping
ASCII for pixel art changed one stage of the pipeline. The DDA raycast, the
baked lightmaps, sprite projection, physics, driving, combat, the dialogue
schema and the whole Python backend are untouched.

That's the important thing to know before choosing. This is not a rewrite
decision, it's a rasterisation decision, and you can keep both.

## Why ASCII was fighting you

You raised legibility twice and it never fully resolved. That wasn't tuning.

A character cell is roughly 8×14 pixels carrying one glyph from a 15-step ramp
plus one palette index. That's about 7 bits of information per 112 pixels. A
face needs more than that, and no amount of LOD work or downsampling cleverness
creates information that the medium can't hold. Every fix — two hand-drawn LODs,
importance-weighted downsampling, background cell fills — was buying back
fidelity the format had already thrown away.

Pixel art at 480×270 gives the same on-screen area about 130,000 independent
24-bit samples. Roughly four orders of magnitude more.

## The options, honestly

**1. Stay ASCII.** Legitimate if the text aesthetic *is* the pitch. Genuinely
distinctive, trivially cheap, and you already have a good one. But you'll keep
paying for it every time a player needs to identify something at distance.

**2. Full pixel raycaster** — `oakhaven_pixel.html`. Wolfenstein-style, same
engine, textured walls and floors, indexed-palette sprites. Enormous fidelity
jump for a contained change. This is the recommendation.

**3. Hybrid — and this is the one worth taking seriously.** Render pixels, then
run ASCII as a *post-process* over the finished frame. Both modes share one
renderer, and ASCII stops being your art style and becomes a narrative device.

Your story is literally about discovering that reality is rendered code. Having
the world dissolve into characters as the veil thins in Act III, and fully
resolve into a terminal in the `sys.exit()` ending, is a far better use of that
look than wearing it for eight hours. Press **Tab** to see both on the same
frame; `asciiPass(amount)` takes a 0–1 value, so partial corruption is free.

**4. Textured 3D meshes.** Wrong trade. You'd lose the fast iteration loop, gain
asset pipeline work, and the horror doesn't need polygons.

**5. Top-down or side-on 2D.** A different game. First-person is doing real work
for you here — the dread depends on limited sightlines.

## Pixel modes (P)

Doom's look is a matter of pixel *geometry*, not art direction. Four modes:

| Mode | Buffer | Pixel aspect | Colour | Vertical look |
|---|---|---|---|---|
| Doom | 320×200 | 1.2 (4:3 stretch) | 256-entry palette | none |
| Build | 320×240 | 1.2 | 256-entry palette | y-shear |
| Modern | 480×270 | 1.0 | truecolour | y-shear |
| Crisp | 640×400 | 1.0 | truecolour | y-shear |

Three things make Doom mode Doom rather than "pixel art":

1. **Non-square pixels.** Doom rendered 320×200 and displayed it at 4:3, so
   pixels were 1.2× taller than wide. The buffer here stays square and the
   display applies the ratio, exactly as a CRT did. That vertical squash is a
   large part of what the look actually is.
2. **A 256-entry palette, applied inside the light tables.** Sixteen ramps of
   sixteen — almost all of Doom's palette was ramps, which is why its shading
   reads as one coherent image instead of independently tinted surfaces.
   Quantisation happens where Doom's colormaps did it, at table-build time, so
   it costs nothing per frame. Nearest-entry lookup is precomputed over a 32³
   RGB cube; scanning the palette per colour would have been ~590M comparisons.
   A frame in Doom mode uses about 80 distinct colours.
3. **No vertical look at all.** Doom's horizon is fixed at the centre of the
   screen — the projection is a true 2.5D and the engine physically could not
   pitch. Build engine games faked it by y-shearing the horizon, which is what
   the later modes do.

Distance dimming is also mode-driven; Doom's falls off nearly twice as hard.

| Mode | ms/frame | Mpix/s |
|---|---|---|
| Doom 320×200 | 2.36 | 27.1 |
| Build 320×240 | 2.17 | 35.3 |
| Modern 480×270 | 3.35 | 38.6 |
| Crisp 640×400 | 5.57 | 46.0 |

Measured with the minimap drawing every frame. Load is ~360 ms: textures, light
tables, and the quantisation cube.

## Map and objectives (M)

A corner minimap tracks movement; **M** opens the full map with labelled points
of interest, a legend, and the objective list.

- **Explored memory is per sector.** Cells are revealed within a radius with a
  line-of-sight test, updated at 12 Hz rather than per frame. Unseen map stays
  dark, so the full map is a record of where you've been rather than a
  spoiler.
- **The current objective is highlighted with a pulsing marker.** When the
  target is in a different sector, a breadth-first search over the door graph
  routes to the door you need next, so the marker is always something reachable
  from where you are standing instead of an arrow pointing into a wall.
- **Objectives advance on story flags**, not proximity, so they can't be
  skipped by walking past the right room.

Points of interest are authored per sector as `{x, y, name, kind}` where kind is
`door`, `npc`, `term`, `car`, or `note`. Tests assert that a POI marked `door`
actually sits on a door tile — mismatches there are invisible in play and
extremely annoying to debug later.

## What the pixel build does

- **480×270 internal, nearest-neighbour upscaled.** Chunky on purpose, and it
  means the fill rate is fixed regardless of window size.
- **Procedural textures**, 64×64: brick with mortar courses, planks with grain
  and nails, corrugated steel with rust blooms, grimy glass. No binary assets.
- **Doom-style light tables.** Every texture is pre-shaded into 48 brightness
  copies at load, so lighting in the inner loop is an array index rather than
  three multiplies per pixel. Costs 9.9 MB and ~160 ms at startup.
- **Ordered dithering** across those 48 steps via a 4×4 Bayer matrix, which is
  what stops a floor receding into fog from banding.
- **Indexed-palette sprites.** `.` is transparent, every other character indexes
  the model's palette, so art is editable in any text editor. The possessed
  townspeople are a palette swap of the civilian silhouette — same body, wrong
  eyes, wrong skin — which is how you'd do it in a real pixel-art pipeline.
- **Props are drawn from primitives** rather than hand-placed pixels, because
  vehicles and foliage come out cleaner that way.

## Performance

| | |
|---|---|
| Render | 2.86 ms/frame at 480×270 (~45 Mpix/s) |
| Light tables | 9.9 MB, built in ~160 ms at load |
| ASCII post-pass | only when enabled |

The first working version ran at 12.4 ms — uncomfortably close to a 16.7 ms
budget. The floor pass was recomputing per pixel what is constant per row.
Restructuring floor and ceiling to be row-major, so distance, haze, the beam's
distance term and the texture step are computed once per row and the sample
position advances by a constant increment across it, took it to 2.86 ms with
byte-identical output.

## If you go pixel

The sprites here are functional, not final — 16×24 figures good enough to prove
the pipeline. Real character art is where the remaining quality is:

1. **Directional sprites.** Right now a person looks identical from every angle.
   Eight rotations per character is the single biggest realism win available,
   and the projection code already supports it — pick the frame from the angle
   between the sprite's facing and the view vector.
2. **Two-frame walk cycles.** Even two frames alternating reads as motion.
3. **Bigger canvases for faces.** Marla and Kevin carry the writing; give them
   32×48 and detail worth looking at, since dialogue holds them on screen.
4. **Keep the palettes tight.** 8–10 colours per character is what makes pixel
   art look deliberate rather than like a downscaled photo.
