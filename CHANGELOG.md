# Changelog

## 1.7.0: the arsenal, the guises, and three other places

**Fixed: stranded at Pike's Reservoir**
- Settling the bell case while standing on the old stone path used to sink the path under you, and the water rule then pinned you in place forever.
- The stones now wait until you've stepped off before they go under.
- You can now swim anywhere there's water: it's slow and it costs stamina. If you tire out, you're carried back to the nearest bank.
- Saves made while stuck will free themselves when loaded.

**Weapons**
- The first-person weapons are now painted pixel art: the revolver, sawed-off, flare gun, crowbar, holy water, the demon blade, the angel blade, the archangel's blade and the Ring.
- **Weapon style** (Settings → Weapons, or the quick wheel):
  - **Painted**: the new pixel art
  - **Classic**: the old flat, chunky look, rebuilt properly for all nine weapons:
    - one camera angle and one light, shared by every weapon
    - each part shaded by its material: blued and bright steel, walnut, leather, glass, gold, ivory, cloth
    - hands with a palm and heel, a thumb from the side of the palm, four fingers of different lengths wrapped round the grip, contact shadows, and a sleeve cuff
    - the revolver: a six-flute cylinder wider than the barrel, sights, hammer, guard, and a walnut grip with the index finger resting along the frame
    - the sawed-off: two separate bores, a break-action receiver with a hinge pin, the fore-end cupped in the left hand, a pistol grip and stock
    - the crowbar: a gooseneck with a split claw, and a flat pry end
    - a real glass flask with an engraved cross, a drop-point knife, a ridged angel blade, the archangel's winged guard, and the Ring hovering over an open palm
  - **Original**: exactly as the weapons looked before
- **Blades in slot 4:**
  - the **demon blade** (formerly the knife)
  - the **angel blade**, which Castiel gives you the first time he finds you
  - the **archangel's blade**, found in the ash in 2031, which cuts everything in an arc

  Press 4 again to change blades.
- **The Ring of Severance** (slot 8, from the Formless One): every hold in sight is cut at once. The possessed are freed, everything else takes heavy damage and is stunned. It then needs seven seconds to turn.
- **Armour:**
  - **Mantle of Feathers**: 25% less damage
  - **Ash-plate**: armour refills to 50
  - **Wren's Cloak**: ghosts hit half as hard

**The Formless One, in other shapes**
- He helps before the end, in disguise, and leaves a dark feather each time:
  - a black dog that heals you when you're badly hurt
  - a crow that brings ammunition when your guns are empty in a fight
  - the wind, which knocks a crowd of attackers down when you're outnumbered
  - an old woman whose marigold refuses your death once
- He also opens three tears to other places:
  - a deer at the reservoir
  - a woman at a bus stop with no buses
  - a crow on the wire above the church
- At the altar he admits to every disguise you met.

**Three other places, each with its own look, people, boss and reward**
- **The Drowned Year (Wren's Valley, 1951, sepia).**
  - The valley before the dam, and the Congregation that fed the hunger under the crossroads: eleven names in a register, seven of them children.
  - Margaret Hale, whose husband beats her, and their daughter Hannah, chosen as the last offering.
  - You can let Margaret confront him herself.
  - Boss: **Reverend Silas Ashby, Who Listens**. Amos Wren, the bell keeper, gives you his cloak.
  - Afterwards a letter arrives from Hannah, 84, in Portland.
- **The Ash Morning (Oakhaven, 2031, grey).**
  - The morning after the night goes Chuck's way.
  - Who survived, and whose grave it is, depends on your arcs and on Kevin.
  - Boss: **the Quiet King**, which silences guns, so use blades. Rewards: the archangel's blade, and an Ash-plate made from the Impala's doors.
- **The Inverted Nave (violet, its far half upside down).**
  - Where the hunger keeps the voices of everyone it ate.
  - Boss: **the Choir That Counts**. Silence its four throats, then end it before it reaches zero.
  - The Formless One gives you the Ring and the Mantle.

**Content warning updated** for the cult storyline: ritual murder of children and women is recorded in documents and never shown, and domestic abuse is spoken about and confronted. Help lines are listed on the warning screen.

**Tests**
- `tests/v17.js` covers the reservoir, the arsenal, weapon styles, the guises, and all three places from start to finish.
- `tests/v17_browser.js` takes screenshots of each.

## 1.6.0: names, both brothers, hearts, and the one at the end

**Names**
- A *Names…* page on the title screen and in the pause menu. You can rename both brothers, their family name, Castiel, Crowley, Chuck, Kevin, Rae, Sarah, and the one at the end.
- The new names appear everywhere at once: dialogue, subtitles, menus, notes, the phone, the paper and the case file.

**Switch brothers**
- Press **U** (or use the quick wheel or the pause menu) to play as the other brother.
- Each brother keeps his own weapons, ammunition, rites, costume and health, and saves keep both kits.
- You can't switch during a mission: in a fight, on a call, while chanting, in a cutscene or conversation, while driving, inside St. Brendan's, or while something has hold of you.

**Hearts**
- Good:
  - **Rae Calloway** tows the cars that stop at the town line. She has three scenes with Dean.
  - **Sarah** has two new scenes with Sam.
  - What you say moves her regard for you. At the end of Act III she can become his true love, unless he tells her not to wait.
- Bad: two demons who are excellent company.
  - **Vesper**, at the end of the Velvet Hour's bar (Act II).
  - **Celandine**, in the library stacks after closing (Act III).
- **The enchantment.** Partway through her conversation, the choices on screen rewrite themselves letter by letter into what she wants you to say. She picks from your state: hurt, broke, at odds with your brother, or carrying too much. While the words change you can't pick anything or leave.
- **Breaking it.** Only two things can: your brother, if the night has left you close enough (bond, arc, or the together seed), or your true love, said out loud.
- **The cost.** Without either, Vesper takes your night, your money and your armour, and Celandine takes a page of your case file. If you're freed, she leaves an anchor (a red ribbon or a grey bookmark), and it matters at the end.

**The Formless One**
- A stranger appears three times before the end:
  - with tea in the motel office
  - in a pew at St. Brendan's
  - on the cross street, where he turns the wheel back once to show you Main Street in May
- At the altar a third chair appears beside Chuck's, and the finale runs in four phases:
  - **I · The Stranger.** No combat. Your own evidence against Chuck's story (the seal, the margin, root access, fan fourteen). The brothers challenge him, each in his own way.
  - **II · The Unmaker.** The enchantresses come for the finale and rewrite your choices. He exposes the mechanism: her words stay on screen, blackened and threaded with silver, and dead. Then the brothers have to act, using their bond, what they know, the town, the anchor, or love. Or they can ask him to cut it with the Sudarshana, a black-and-silver ring of blades within blades. Asking is remembered.
  - **III · The Absolute.** His body dissolves into geometry. Overlapping versions of him, the cosmos inside his robes, every face in town, and the Void small in one corner. The interface stops having words for health, distance and time. You answer three questions of perception. A wrong answer turns the wheel back and shows you again.
  - **IV · The Unchosen.** He refuses to choose for you. Three new endings:
    - **E · Liberation**, which needs the brothers together.
    - **F · The Equilibrium**.
    - **G · The Unfinished Sunday**, where you tell him to step back and he does.
  - Chuck's own endings, A to D, are still there if you turn back to him.
- His look: midnight-blue skin, long black hair, pale silver eyes, layered black robes over indigo with silver constellations, a high collar, a feathered mantle, a minimal silver crown, and one dark peacock feather.
- The dead stay dead in every ending.

**The fourth wall**
- When you start or continue a game, before Act I, the browser is asked for your location, so nothing in the story hints at what's coming. Much later, early in Act III, on your next keypress, the game goes fullscreen, tears, and shows the name of your town: *This could be the next Oakhaven.*
- Coordinates go only to BigDataCloud's free reverse-geocoding lookup, and only to get the place name. Only the town's name is kept, in this browser.
- If you decline, or choose *Never* in Settings, the town is guessed from your time zone, offline. *Settings → Fourth wall* turns it off.

**Tests**
- `tests/hearts.js` covers names, switching and its locks, both romances, the enchantment and both ways out, the three meetings, all four phases, endings E to G, and the fourth wall.
- `tests/hearts_browser.js` takes screenshots of each.

## 1.5.0: stories, arcs and a town that notices

**The brothers' arcs**
- Two meters run under the whole night. Dean's: refusing to give up is not the same as refusing to listen. Sam's: sacrificing yourself is not automatically the kind thing.
- Eight car conversations you steer, one after each turning point: the mill, Delia, Kevin, Crowley, the fold, Lily, Chuck, and the last drive before the church. Each is written separately for Dean and for Sam, and it changes with what happened (Delia freed or killed, Kevin rested or used, the deal taken or refused).
- The Impala tells you when something's on your brother's mind, and he nudges you toward the car.
- If both brothers have come far enough and the bond holds, there's a new option at the altar: "We decide this together." It changes the subtitles of endings A to C and adds epilogue lines. It doesn't save anyone for free.

**The supporting cast**
- Story beats for Marla, Earl, Sheriff Ames, Dr. Halvorsen, Sarah, Kevin, Delia, Juno, Castiel, Crowley and Alistair, across Acts I to III. Each plays once, the next time you speak to them.
- Some of the choices carry forward:
  - signing Marla's ledger with your real name or an alias
  - selling Earl a memory for blessed rounds (the memory leaves your case file)
  - telling Ames the truth
  - sparing or freeing Juno
  - an alliance with Crowley in Act III
  - Delia's insight into how to burn the thing
  - Alistair, met early on the church steps

**New main-story beats**
- **The vigil (Act II):** the town gathers with candles on the cross street, and Sarah reads the six names. You can say the names again, say the truth about the fan, give a charge, or stand with them in silence. Each choice has its own consequence and its own epilogue line.
- **A man in a bathrobe** is seen twice from a distance, then gone. The second time, he leaves a note.
- **The gathering (Act IV):** everyone you helped and who trusts you comes to the doors of St. Brendan's, up to sixteen people. Each says a line and some bring something (shells, rounds, a patch-up, armour). The epilogue counts them.

**The town notices**
- Townsfolk have a new line, once each, for most case outcomes and story beats (about 30 in all).
- Walkers who meet in the street talk to each other, and you can overhear them (13 conversations, keyed to what's happened).
- KOAK reads news bulletins between the calls, with nine bulletins that follow what you've done. Case leads on the radio still play first.
- When a case closes, someone texts you about how it ended: Marla, Kevin, Dr. Halvorsen or Crowley, with a different text for each outcome.

**Tests**
- `tests/story.js` covers:
  - every dialogue node reference, for both heroes
  - car scenes, the meters, and the together check
  - the altar option, beats playing once, and the cameo
  - all four vigil outcomes and the gathering
  - reactive lines, overheard talk, bulletins and case texts
  - save round-trips of the new state

## 1.4.0: release pass

**Stability**
- Saves are versioned (`v` plus `build`) and older saves are migrated. A damaged, corrupted, incomplete or newer-version save is listed as *Damaged* with a reason. Autosave never overwrites it.
- A save that fails to load hands over to a clean reload with a message, instead of leaving a half-built world.
- Townspeople and your brother step aside when you push into them, so nobody can block a corridor.
- Chapter select closes the cases it skips.

**Combat**
- Every melee attack is telegraphed (red flash, sound, lunge pose). Step back and it misses.
- Hit markers, kill markers, and a red arc showing where damage came from.
- The revolver and flare gun are redrawn so they read as guns. The shotgun has a rib, a bead sight and a receiver.
- Sam's chant survives its first hit with a stagger. Dean's kick stuns as before.
- The HUD is smaller, and its size is adjustable.

**Settings and accessibility**
- New Settings page:
  - volume for Master, Music, Ambience and Effects
  - text size and subtitles
  - tutorial hints
  - screen shake
  - visual intensity (grain, colour tearing, glitches, lightning)
  - HUD size
- Audio buses, a procedural score that follows dread, ambience beds per place, and enemy sounds positioned in stereo.
- A contextual tutorial: one hint at a time, shown until you do the thing it describes.
- Clues you haven't examined glint, and show as hollow diamonds on the map.
- Keyboard and controller navigation for the journal, phone, settings and autopsy screens.
- Content warning on first launch, and a Credits page.

**Investigation**
- The journal separates Evidence (observed) from Witnesses (claimed), and adds Open Questions and a Transcript of every line.
- Witnesses remember how you treated them. A wary witness gives accurate but incomplete testimony.
- Notes are annotated when a deduction changes them, and a failed theory is crossed out. In Act IV a few entries are edited by someone else, and a chapter you didn't write appears.
- Each case quietly tracks how thoroughly you investigated it, and the autopsy and the paper reflect that.
- The brothers keep score of who wanted which call. The car is where they say so, and the bond shows at the altar and in the epilogue.

**Seven new cases**
- The Dead Man on the Radio
- The Man Who Came Back Wrong
- The Inventory of Things That Never Existed
- The Contract Nobody Signed
- The Saint in the Walls
- The Children Who Draw the Same Sky
- The Last Broadcast

New places for them: the sheriff's station, Price's Hardware, the Reed house, St. Jude's, the elementary school, Coos Ridge Observatory and KOAK-TV. Every new case feeds at least one other case (see `docs/CASEMAP.md`).

## 1.3.0
- Phone, camera and gallery.
- The journal case board, the autopsy, and the morning Ledger with OakhavenTalk.
- Five investigations: The Last Shift, The Bell, The Road, The House With One More Room, The Patient Who Died Tomorrow.
- The 0114 thread, photos you didn't take, payphone calls, Dad's call.
- Connective scenes. Epilogues that remember.

## 1.2.0
- Saving and resuming: autosave, three manual slots and a quicksave.
- Visual pass: fog, ambient occlusion, contact shadows, glow and grain.
- Momentum physics. Movable props.

## 1.1.0
- Acts III and IV, with four endings.
- The Controls page and controller support.
