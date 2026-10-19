# Oakhaven: the case dependency map

There are sixteen cases: four are mandatory and twelve are optional. Every case uses the same parts:

- **Evidence**: things you observe.
- **Witnesses**: things people claim.
- **Deductions**: links you make between clues.
- **One committed theory.**
- **A decision**, for the optional cases.
- **An autopsy, plus a morning paper** dated Sunday, October 4.

Each optional case answers one small question and leaves a larger one open. It also leaves something in another case that changes how that case reads.

## 1. The cases

| # | Case | Act | Kind | How it opens | Mechanic | Decision → flags |
|---|---|---|---|---|---|---|
| 1 | The Green Chain | I | **main** | start | evidence + deduction | none; theory only (`theory_mill`) |
| 2 | The Last Shift | I | optional | after the tear: Marla texts that Frank Dwyer has been found, or you read the air-quality sheet | contradiction: three witnesses, a room that resets, then the mill replays the last shift (switch order) | rest (`mill_records_saved` if you escape the collapse) · expose (`dwyer_exposed`, `mill_records_saved`) · burn (`mill_records_burned`) |
| 4 | The Bell Beneath the Water | I | optional | the Impala radio (Walter Pike), or a Marla text | memory reconstruction: tally marks, log, map, register; the bell rings and the water stands back | silence (`bell_silenced`) · answer (`elise_returned`) · leave (`bell_left`) |
| 10 | The Dead Man on the Radio | I | optional | the sheriff's band on the Impala radio, or a Marla text | prediction and intervention: a timed call (stop the driverless car before 2:23) | destroy (`radio_destroyed`) · keep tapes (`radio_tapes`) · follow (`rd_saved` / `rd_moved_gus` / `rd_gus_dead`) |
| 3 | Bodies Are Walls | II | **main** | lockdown | evidence + deduction | none; theory only |
| 5 | The Road That Returns | II | optional | Daniel Rusk in the motel lot (after Delia) | navigation and loops: mile markers; the road wraps you back until you deduce its rule | break (`road_loop_broken`) · follow (`daniel_escaped`) · use (`road_used`) |
| 7 | The House With One More Room | II | optional | Marla: Agnes Bell's calls (after Kevin) | spatial: the house changes on each visit; the brothers see different things | open (`agnes_told_truth`) · box (`agnes_box_destroyed`) · keep (`agnes_kept_room`) |
| 11 | The Man Who Came Back Wrong | II | optional | Marla: Glenn Reed walked out of the fog | an identity test: details nobody watched, and tests that come back negative | accept (`reed_accepted`) · drive (`reed_driven`) · rite (`reed_tested`) |
| 12 | The Inventory of Things That Never Existed | II | optional | Marla: Earl's step | matching objects to owners; returning them opens a dialogue | return (`inv_return`) · catalogue (`inv_catalogue`) · destroy (`inv_destroyed`) |
| 13 | The Contract Nobody Signed | II | optional | Marla: Naomi Price | a document chain across five locations | break (`contract_broken`, `contract_shifted`) · trade (`contract_traded`) · burn (`contract_burned`) |
| 14 | The Saint in the Walls | II | optional | a letter from St. Brendan's parish office | the wall bleeds when someone denies harm | reveal (`saint_revealed`) · rest (`saint_rested`) · keep (`saint_kept`) |
| 15 | The Children Who Draw the Same Sky | II | optional | Marla: the teacher calls | a geometry puzzle: align the telescope from three drawings and the stones | destroy (`sky_destroyed`) · keep for Kevin (`sky_kevin`) · explain (`sky_explained`) |
| 6 | The Seventh | III | **main** | the fold | evidence + deduction | none; theory only |
| 8 | The Patient Who Died Tomorrow | III | optional | Dr. Halvorsen calls (after Lily) | records that change when observed; a basement monitor | treat (`halvorsen_trusted`, `martin_saved`) · destroy (`future_chart_destroyed`) · follow (`chart_followed`) |
| 16 | The Last Broadcast | IV | optional | the motel TV in Act IV, or a Marla text | reels of the choices you didn't make; splicing | destroy (`kb_destroyed`) · broadcast (`kb_broadcast`) · splice (`kb_splice` = car / lily / marla) |
| 9 | Twenty to Three | IV | **main** | Act IV | evidence + deduction | the ending (A–D) |

Chapter select closes skipped cases quietly, so no case is left impossible to finish.

## 2. Evidence that can be found more than one way

| Fact | Where |
|---|---|
| Fan fourteen was deferred | Ray's requisition ledger (mill office) · the company ledgers (library) · the phantom ("the vent was on the form") · the carbon copy (maintenance room) |
| Frank Dwyer knew | his notebook (under the maintenance room floor) · his letter behind the mural at St. Jude's |
| The crossroads seal is older than the company | the county map (Walter's hut) · the parish register (library) · the blank page (mill safe) |
| Lily was first | Lily herself · the radio's first call (Evelyn) · her inhaler and the ledgers · Room 4's drawings |
| Somebody is typing | the tapes (station) · Lou at KOAK · the mill terminal · Walter's log writing ahead |
| 0114 | Ray's phone · Policy 0114 (Earl's) · the 0114 text thread |

## 3. Cross-case links: what one case changes in another

| Discovery | Later use |
|---|---|
| The Last Shift: records saved | Crowley sees the carbon and treats you differently. Ending C: the county reopens the inquest. |
| The Bell: the seal is older than the company | Crowley's honest answer gets darker ("I am a subcontractor"). |
| The Radio: tapes kept | Act III, after Chuck: the tape labelled AFTER plays Dean saying "Sam?" |
| The Radio: Joan Pike's call | Reframes Walter's dead wife calling from the lake. |
| Came Back Wrong: coffee with Ray in mid-October | The mill case's Ray note gets annotated: "in some version, the fan came." |
| Inventory: ledger "ownership disputed" | A clue and a deduction in Twenty to Three ("he's not even the landlord"). |
| Inventory: archive catalogued | The archive notices the Act IV case-file edits, and Earl tells you. |
| Inventory: shoe | Tied to Agnes Bell's Thomas, if you've met her. |
| Contract: the collector says "past the King" | A new link in Bodies Are Walls, and Crowley's Act IV admission that the original isn't in Hell's records. |
| Saint: Frank's letter in the wall | A new clue and link in The Last Shift ("confessed twice"). |
| Saint: the razored page | A new question for Alistair in Act III ("the shape of me now"). |
| Sky: drawings kept for Kevin | Kevin in Act IV: "It's a map of what it can see." Lily case: "Lily drew it first." |
| Broadcast: a splice | Chuck reacts at the altar. One epilogue line per splice. |
| Clinic: chart followed | One tendril in the cathedral's west hall is gone. |
| Road: used | Act III: a mile marker 14 on Main Street. Act IV: a back road to St. Brendan's. |

## 4. Relationships each case changes

Witness trust (`S.inv.trust`) is changed by how you question people:

- Peter: Sam's gentle questioning +2, Dean's threat −2.
- Mara, Leon, Ruth, Halvorsen, Martin, Evelyn: ±1 to ±2.
- Mia: +2 if you believe her, −2 if you dismiss her.
- Delia: freed +2, killed −3.
- Kevin: rested +2, used −1.

A wary witness gives accurate but incomplete testimony: Peter withholds the payment, and the paper prints "declined to comment". If Halvorsen trusts you, he brings the clinic files to Act IV.

The brothers' bond (`S.inv.bond`) changes with every optional decision: +1 when you choose what your brother wanted, −1 when you don't. The car is where they say so. The bond changes his line at the altar and adds one line to the epilogue.

## 5. What reaches the endings

None of the optional cases unlocks or blocks an ending. All four endings stay available, and the cases only change what they cost and how they're remembered. These carry into the epilogues:

- the records, Agnes, Elise, the bell, the road, Halvorsen, Martin, Glenn, Old Gus, the letters, Crowley's chain, the splice, and the brothers' bond
- `theoryRight('lily')`: a seventh name on the mill plaque
- `theoryRight('author')`: the only line Chuck can't answer

## 6. What stays unresolved, on purpose

- What is behind the fold, and whether it understands any of this.
- Whether Chuck made the broadcast, found it, or only recognised it.
- Who wrote "or not" in the margin.
- Whether the first Glenn Reed is alive past the fog.
- Whether the boy behind Agnes's wardrobe was real.
- Who owns the field. The ledger says ownership is disputed and doesn't say by whom.

## 7. What the town remembers (1.5)

Every optional case outcome now echoes outside the case:

- **One text when it closes:** Marla, Kevin, Dr. Halvorsen or Crowley sends a different message for each decision.
- **One line from a townsperson:** said once, the next time you talk to them.
- **A KOAK bulletin:** for the bell, the road, the clinic and the mill.
- **Whether someone stands at the church doors in Act IV:** Elise (bell answered), Agnes (house opened), Glenn (Reed accepted), Naomi (contract broken or traded), Old Gus (saved from the car), Curtis (saint revealed), and Line Three (shift rested or exposed).
