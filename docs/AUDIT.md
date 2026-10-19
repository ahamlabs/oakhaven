# Oakhaven: release audit

The source was read module by module and probed with scripted runs: the headless
harness, plus real-browser walks in Playwright. Each defect lists how it was
found, how bad it is, and the fix that shipped. "S1" means it blocks release,
"S2" means it hurts the experience badly, and "S3" means polish.

## Progression and soft-locks

| # | Sev | Defect | Found by | Fix |
|---|---|---|---|---|
| P1 | S1 | Townsfolk and the companion are solid and wander freely, so one can stand in a two-wide hall and stop you passing. This happens in the cathedral corridors, the Bell house hall and the maintenance room. | Read `pushOut`/`updateWalker`/`updateCompanion`; probed in a 2-wide corridor | Walkers and your brother now step aside when you push into them. Your brother no longer parks in front of you in corridors. |
| P2 | S2 | Only the main objective has a marker. Optional leads and unread clues have nothing, so progress can depend on spotting a small prop in a dark room. | Play-through screenshots | Unexamined clues within reach now glint. The map shows them as a distinct hollow diamond, never the pulsing objective marker. Interact range is shown as a prompt, as before. |
| P3 | S2 | Chapter select (`startAt`) leaves earlier cases open with no way to finish them. | Case tests | Skipped cases are closed quietly. *(Fixed last build; regression test added.)* |
| P4 | S3 | The first minutes put a wall of key hints in subtitles and toasts, and some never repeat. | Read `begin` / boot hints | Contextual tutorial: each prompt appears when it first becomes relevant and stays until you do the thing. It can be turned off, and its state is saved. |

## Combat and feedback

| # | Sev | Defect | Found by | Fix |
|---|---|---|---|---|
| C1 | S1 | Enemies do damage the instant you're in reach, with no wind-up. Hits feel random and can't be read or dodged. | `updateEnemy` | Every melee enemy now telegraphs (a lunge pose, a red rim flash and a sound) for 0.35–0.5 s. Damage lands only if you're still in reach, so stepping back makes it miss. |
| C2 | S1 | The revolver viewmodel reads as a stick or torch, and the flare gun as an orange tube. | In-browser weapon screenshots | Redrawn in three-quarter view: muzzle and sight, barrel, fluted cylinder, hammer, trigger guard and checkered grip. The flare gun is now a fat break-action pistol with a big bore. Muzzle-flash anchors moved to match. |
| C3 | S2 | No hit confirmation and no damage direction. | Read `fire`/`hurtPlayer` | Hit marker on the crosshair (red ticks, bigger on a kill), impact sparks or ecto puffs on the target, and a red arc pointing to whoever hit you. |
| C4 | S2 | The HUD's bottom panels take about 22% of screen height and cover the viewmodel. | Screenshots at 960×600 | Compact HUD: panels about 70% of the old size and tucked into the corners. A HUD-size setting (Small / Medium / Large) is in Settings. |
| C5 | S3 | Dean's and Sam's styles differ mainly in numbers. | Read `HEROES` | Sam's rites carry a ward window on completion, and a hit only *staggers* the chant (a 0.4 s grace) instead of always breaking it. Dean's kick now staggers demons, and his special has a wider arc. |

## Saves and branching

| # | Sev | Defect | Found by | Fix |
|---|---|---|---|---|
| S1 | S1 | `readSave` silently ignores any save whose version isn't exactly `SAVE_V`, so a future update would make every save vanish with no explanation. | Read `58_save.js` | Saves carry `v` plus a build number. A migration table upgrades older versions. Saves that can't be migrated or read are listed as *Damaged* with a reason, never silently dropped. |
| S2 | S1 | A save that parses but has missing fields can throw inside `restore`, leaving a half-built world. | Fuzzed restores in the harness | `restore` validates first, then restores. On any error it reloads to the title with a message, and the damaged slot is kept so it isn't overwritten. |
| S3 | S2 | No record of which build wrote a save, and no compatibility policy. | | `BUILD` constant; save policy in README. |

## Interface and accessibility

| # | Sev | Defect | Found by | Fix |
|---|---|---|---|---|
| U1 | S1 | No Settings page: there is no volume, text size, shake or visual-intensity control. Sound is only on or off. | Pause menu | A Settings page in the pause menu and on the title screen. It has Master, Music, Ambience and Effects volume; subtitle and text size; screen shake; visual intensity (grain, chroma, glitch, flashes); HUD size; tutorial hints; and a content warnings reminder. |
| U2 | S2 | There is only one audio bus and no music. Ambience is rain alone. Nothing positional. | `40_state.js` | Separate music, ambience and effects buses. A procedural score that follows dread, a per-place ambience bed, and enemy sounds panned and attenuated by position. |
| U3 | S2 | Missed dialogue can't be reviewed. | | A Transcript tab in the journal records every subtitle line, with speaker and place. |
| U4 | S2 | The journal doesn't separate facts from claims. | Design review | Separate sections for Evidence (observed facts), Witnesses (claims, with who said them), Deductions, and Open Questions. |
| U5 | S2 | No content warning, credits, version or licence notice. | | Content warning on first launch (skippable after that). Credits, version, changelog and the fan-project notice on the title screen and in `CREDITS.md`. |
| U6 | S3 | The phone, journal, pause and dialogue screens can't be fully driven by keyboard or controller. | Probe | Arrow keys and the D-pad move focus, A or Enter activates, B or Esc goes back. |

## Performance

The build is still within budget. At 9 ms per frame on the Crisp renderer, the new work has to stay cheap. Audio buses and the score are budgeted at under 0.3 ms per frame, the glints run on the HUD canvas only, and the telegraphs reuse the existing flash path.

## Verified not to be bugs

- Doors: every door's arrival point is clear (`tests/doors.js`, all sectors including the new ones).
- Endings: all four are reachable through the dialogue tree (suite, "the endings").
- Pointer-lock loss pauses the game, but not while the phone, camera or wheel is open.
