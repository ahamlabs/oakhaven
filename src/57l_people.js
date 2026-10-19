/* ═══ The people of Oakhaven, across four acts ══════════════════════════════
   Everyone you can talk to more than once now has an arc: a beat per act
   that remembers what you did to them, to the town, and to each other.
   A beat plays the next time you talk to them, once. After it, their usual
   lines resume. Several beats change what they bring to the church doors. */

/* beat(dialogueId, beatId, when, nodes, firstNode) */
const BEATS={};
function beat(did,id,when,nodes,first){
  const D=DIALOGUE[did]; if(!D) return; Object.assign(D.nodes,nodes);
  (BEATS[did]=BEATS[did]||[]).push({id,when,first});
  if(!D.__beats){ D.__beats=true; const was=D.start;
    D.start=()=>{ for(const b of BEATS[did]){ if(S.flags['beat_'+b.id]) continue; let ok=false; try{ ok=b.when(); }catch(e){} if(ok){ S.flags['beat_'+b.id]=true; return b.first; } }
      return typeof was==='function'?was():was; }; } }
const pendingBeat=did=>(BEATS[did]||[]).some(b=>!S.flags['beat_'+b.id]&&(()=>{ try{ return b.when(); }catch(e){ return false; } })());
const X=(t,n,f,r)=>D_(t,n,f,r);

/* walkers whose small talk becomes a conversation when a beat is due */
const WALK_DLG={sheriff:'ames',nurse:'halv_walk'};
{ const was=townTalk; townTalk=function(e){ const d=WALK_DLG[e.talk];
    if(d&&pendingBeat(d)){ S.flags['met_'+e.talk]=true; e.face=Math.atan2(S.py-e.y,S.px-e.x); e.waitT=8; openDlg(d,e); return; } was(e); }; }
DIALOGUE.ames={port:'sheriff',start:'z',nodes:{z:{speaker:'Sheriff Ames',text:'"Go on. I’ve got the street."',choices:[X('[Leave.]',null)]}}};
DIALOGUE.halv_walk={port:'doctor',start:'z',nodes:{z:{speaker:'Dr. Halvorsen',text:'"I’ve got rounds. Such as they are."',choices:[X('[Leave.]',null)]}}};

/* ── Marla Ostrowski: thirty-one years of signing people in ─────────────── */
beat('marla','marla1',()=>S.act===1&&S.flags.phantom,{
  ml1:{speaker:'Marla — night clerk',text:"She turns the guest ledger around and holds out a pen without looking up.\n\n\"House rules. Everybody signs. Thirty-one years, nobody’s stayed in this motel without their name in this book.\" She taps a column. \"Real names, ideally. I’m not the IRS.\"",
    choices:[X("[Sign your real names.]",'ml2',{flag:'signed_real',now:()=>trust('marla',2)}),X("[Sign: Agents Page and Plant.]",'ml3',{flag:'signed_alias'}),X("We’re not staying the night.",'ml4',{now:()=>trust('marla',-1)})]},
  ml2:{speaker:'Marla — night clerk',text:"She reads it upside down, and something in her face lets go a little.\n\n\"Winchester. Huh.\" She blots it carefully. \"Nobody’s used their own name in that book since spring. People stopped wanting to be on record here.\"",choices:[X("[…]",null)]},
  ml3:{speaker:'Marla — night clerk',text:"\"Page and Plant.\" She doesn’t even blink. \"Sure, hon. Third Zeppelin this year.\"",choices:[X("[…]",null)]},
  ml4:{speaker:'Marla — night clerk',text:"\"Nobody is, in this town.\" She closes the book. \"Doesn’t mean you don’t sign.\"",choices:[X("[…]",null)]},
},'ml1');
beat('marla','marla2',()=>S.act===2&&S.flags.kevin_done,{
  mm1:{speaker:'Marla — night clerk',text:"The lobby lights are all on. Every one. She’s replaced the bulbs that were out since spring.\n\n\"Nobody’s checking out. Roads go grey.\" She turns the ledger round. Six names at the bottom of tonight’s page, in her handwriting: Hollis. Brandt. Okafor. Okafor. Lindqvist. Haddad. \"I sign them in. Every night since the fourth one. Somebody ought to.\"",
    choices:[X("Why keep the lights on, Marla?",'mm2'),X("[Dean] Somebody has to. I get it.",'mm3',{now:()=>{ trust('marla',1); arc('dl',1); }},isDean),X("[Sam] It matters, to whoever comes in late.",'mm3',{now:()=>trust('marla',1)},isSam)]},
  mm2:{speaker:'Marla — night clerk',text:"\"Because the dark’s what they want. Whoever ‘they’ is. Flat and dark and quiet.\" She flips a switch that’s already on, just to feel it click. \"I’m sixty-two, I work nights for a company in Delaware, and I’m damned if I’ll give them the lights.\"",choices:[X("[…]",null,{now:()=>trust('marla',1)})]},
  mm3:{speaker:'Marla — night clerk',text:"She looks at you properly for the first time tonight.\n\n\"Yeah,\" she says. \"Yeah. You’d know about that, I think.\"",choices:[X("[…]",null)]},
},'mm1');
beat('marla','marla3',()=>S.act===3,{
  mn1:{speaker:'Marla — night clerk',text:()=>"The motel has folded like everything else: the carpet runs up one wall and the ice machine is on the ceiling, knocking. Marla is at the desk anyway.\n\n\"I know every room number of everyone who ever stayed here,\" she says. \"I checked. I still do. Whatever this is, it can’t take that off me.\"\n\nShe turns the ledger to your page."+(S.flags.signed_alias?" You signed as Page and Plant. That isn’t what it says now. It says Dean Winchester and Sam Winchester, in handwriting that isn’t yours or hers.":S.flags.signed_real?" Your names are there, where you signed them. Under them, in green ink, someone has added: (CONT’D).":" You never signed. Your names are there anyway, in green ink."),
    choices:[X("Somebody’s writing in your book, Marla.",'mn2'),X("[Tear the page out.]",'mn3',{flag:'marla_page'})]},
  mn2:{speaker:'Marla — night clerk',text:"\"Somebody’s been writing in it all year.\" She shrugs. \"I just sign the next line. That’s the job. You sign the next line.\"",choices:[X("[…]",null,{now:()=>trust('marla',1)})]},
  mn3:{speaker:'Marla — night clerk',text:"She lets you. The page comes out clean. The page underneath it already has your names on it.\n\n\"Thirty-one years,\" Marla says softly. \"That book has never once run out of pages.\"",choices:[X("[…]",null)]},
},'mn1');

/* ── Earl Duchesne: what he will and won't buy ──────────────────────────── */
beat('earl','earl2',()=>S.act===2&&S.flags.crowley_done,{
  er1:{speaker:'Earl — pawnbroker',text:"There are new things on the shelves behind him, wrapped in oilcloth, and he doesn’t like looking at them.\n\n\"Stock arrived. Nobody delivered it. I opened up and it was just there, priced.\" He wipes his hands on his apron. \"I don’t take souls, whatever you heard. I’ve been very clear about that, my whole life. I just never asked where the stock came from.\"",
    choices:[X("You could start asking now.",'er2',{now:()=>trust('earl',1)}),X("[Dean] Stock’s stock. What’ve you got?",'er3')]},
  er2:{speaker:'Earl — pawnbroker',text:"\"Yeah.\" He takes down the ledger, the old one, and writes in it: STOCK — ORIGIN UNKNOWN — DO NOT SELL TO KIDS. \"That’s a start.\"",choices:[X("[…]",null)]},
  er3:{speaker:'Earl — pawnbroker',text:"\"Everything. That’s the problem.\" He opens the shop menu like it’s a confession.",choices:[X("[…]",null,{shop:true})]},
},'er1');
beat('earl','earl3',()=>S.act===3,{
  es1:{speaker:'Earl — pawnbroker',text:"The shop is the only room in town that hasn’t folded. Earl says it’s because nothing in it belongs to anybody any more.\n\n\"Here’s a thing I never said in forty years.\" He puts a box of blessed rounds on the counter. Heavy, glowing faintly. \"I’ll buy something off you. Not money. A memory. One. The worst one you’ve got, if you like. And you walk out with these.\"",
    choices:[X("[Sell him a memory.]",'es2',{flag:'sold_memory'}),X("No deal, Earl.",'es3',{now:()=>trust('earl',2)})]},
  es2:{speaker:'—',port:null,text:"He reaches across the counter and touches your temple, gently, like a man checking for fever.\n\nAfterwards you can’t remember what you sold him. That’s the point. You have a feeling it was something about a girl in a nightgown. Your journal has a page torn out, and you can’t remember tearing it.",
    choices:[X("[Take the rounds.]",null,{now:()=>{ S.ammo.rounds+=36; S.enchant.blessed=true; rebuildVM(); const n=S.notes.findIndex(n=>n.id==='girl'); if(n>=0) S.notes.splice(n,1); toast('+36 blessed rounds · a page is missing from your journal'); }})]},
  es3:{speaker:'Earl — pawnbroker',text:"He looks relieved. He puts the box back on the shelf.\n\n\"Good,\" he says. \"Good. I don’t know what I’d have done with it.\" Then he slides you a single box anyway. \"On account. Don’t tell anybody I’ve got a soft side.\"",
    choices:[X("[Take it.]",null,{now:()=>{ S.ammo.rounds+=12; toast('+12 rounds'); }})]},
},'es1');

/* ── Sheriff Ames: learning to see ─────────────────────────────────────── */
beat('ames','ames1',()=>S.act===1&&S.flags.marla,{
  a1:{speaker:'Sheriff Ames',text:"He walks his beat the way you’d walk a dog that died: same route, same time, out of habit.\n\n\"Federal, huh.\" He doesn’t ask for badges. \"Six men, five weeks. I signed every one of them off. Accidents, drink, the river. You know what I don’t do in this town, agents? I don’t see things. Seeing things is how you end up like Ray Hollis.\"",
    choices:[X("[Sam] You should read his requisitions, Sheriff. Seven of them.",'a2',{now:()=>{ trust('sheriff',1); S.flags.ames_doubt=true; }},()=>isSam()&&S.flags.read_ledger14),X("[Dean] Not seeing things is how six guys ended up dead.",'a3',{now:()=>trust('sheriff',-1)},isDean),X("What did Ray see?",'a4')]},
  a2:{speaker:'Sheriff Ames',text:"He stops walking.\n\n\"Seven.\" He says it like he’s counting something else. \"He came to the station, you know. In March. Wanted me to make a call to the state. I told him I’d look into it.\" He starts walking again. \"I’ll look into it.\"",choices:[X("[…]",null)]},
  a3:{speaker:'Sheriff Ames',text:"\"You don’t live here,\" he says, very evenly. \"You get to see things and leave.\"",choices:[X("[…]",null)]},
  a4:{speaker:'Sheriff Ames',text:"\"The streetlights.\" He almost laughs. \"Said they hummed when he was low. Said the whole town got heavier around three.\" He checks his watch. \"It’s twenty to three. It’s always twenty to three. I don’t see things.\"",choices:[X("[…]",null)]},
},'a1');
beat('ames','ames2',()=>S.act===2,{
  b1:{speaker:'Sheriff Ames',text:"He has sawhorses across the cross street and nobody to stop. He keeps moving them anyway.\n\n\"Every road ends in that grey. I’ve got two hundred people asking me why, and I tell them weather.\" He looks at you. \"What do I tell them?\"",
    choices:[X("Tell them the truth. Something wants this town flat and quiet. Don’t give it quiet.",'b2',{flag:'ames_told',now:()=>trust('sheriff',1)}),X("Tell them to stay inside and keep the lights on.",'b3')]},
  b2:{speaker:'Sheriff Ames',text:"He stands there a long time with a sawhorse in his hands.\n\n\"That’s not a thing a sheriff can say.\" He sets it down. \"…I’ll say it at the vigil. If there’s a vigil. Somebody should hold a vigil.\"",choices:[X("[…]",null)]},
  b3:{speaker:'Sheriff Ames',text:"\"Lights on.\" He nods. \"That I can say.\"",choices:[X("[…]",null)]},
},'b1');
{ const s=DIALOGUE.sheriff_iv.nodes.s0, t=s.text; s.text=()=>(typeof t==='function'?t():t)+(S.flags.ames_told?"\n\n\"I told them,\" he adds. \"At the vigil. What you said. Half of them laughed. Half of them came up afterwards and shook my hand.\"":"")+(S.flags.ames_doubt?"\n\n\"I read the seven requisitions. All of them. I’m going to read them out loud at Ray’s inquest if I have to do it from the back of a truck.\"":""); }

/* ── Dr. Halvorsen: the box on the form ─────────────────────────────────── */
beat('halv_walk','halv1',()=>S.act===1&&S.flags.marla,{
  h1:{speaker:'Dr. Halvorsen',text:"He’s carrying his bag at three in the morning, between nowhere and nowhere.\n\n\"I signed four of the six certificates. Cause of death has a box on the form. The box is two inches wide.\" He shows you with his fingers. \"Lungs, heart, liver. There’s no box for ‘the company deferred the fan.’\"",
    choices:[X("[Sam] Then write it in the margin.",'h2',{now:()=>trust('halvorsen',1)},isSam),X("[Dean] Two inches. Lot of people fit in two inches, Doc.",'h3'),X("Who signed the other two?",'h4')]},
  h2:{speaker:'Dr. Halvorsen',text:"He looks at you as if you’ve said something obscene, and then as if you’ve said something obvious.\n\n\"Somebody did, once,” he says. “In pencil. On a little girl’s certificate. I’ve thought about it every day.\"",choices:[X("[…]",null)]},
  h3:{speaker:'Dr. Halvorsen',text:"\"Yes,\" he says. \"That’s the job.\"",choices:[X("[…]",null)]},
  h4:{speaker:'Dr. Halvorsen',text:"\"The county coroner. A man from Delaware drove up to help him, both times. Lovely suit.\"",choices:[X("[…]",null,{flag:'halv_delaware'})]},
},'h1');
beat('halv_walk','halv2',()=>S.act===2&&S.flags.juno_met,{
  hb1:{speaker:'Dr. Halvorsen',text:"\"The Velvet Hour sends me patients.\" He doesn’t say it like a joke. \"Not hurt. Flat. Pulse normal, pupils normal, and nobody home. Eleven of them since the fog.\" He snaps his bag shut. \"Whatever she pours, it isn’t alcohol. It’s an anaesthetic for being a person.\"",
    choices:[X("We’ll deal with Juno.",'hb2',{flag:'halv_juno'}),X("Is it reversible?",'hb3')]},
  hb2:{speaker:'Dr. Halvorsen',text:"\"Deal with her kindly, if you can. I don’t think she knows what she’s selling either.\"",choices:[X("[…]",null)]},
  hb3:{speaker:'Dr. Halvorsen',text:"\"Two of them cried yesterday.\" He sounds like a man reporting a miracle. \"Cried. About nothing. I nearly wept with them.\"",choices:[X("[…]",null)]},
},'hb1');

/* ── Sarah Lindqvist: reading the names out loud ──────────────────────── */
beat('sarah','sarah2',()=>S.act===2&&S.flags.sarah_crew,{
  sr1:{speaker:'Sarah Lindqvist — librarian',text:"There are three people in the library at three in the morning, sitting on the children’s chairs, listening. Sarah is reading the company ledgers out loud. Requisition by requisition. Deferral by deferral.\n\n\"Nobody asked for them,\" she says, between pages. \"So I’m asking for them. Do you want to read one?\"",
    choices:[X("[Read Ray’s seventh requisition.] “Please.”",'sr2',{now:()=>{ trust('sarah',1); S.flags.read_aloud=true; }}),X("[Read the May entry.] “My daughter has a cough.”",'sr3',{now:()=>{ trust('sarah',2); S.flags.read_aloud=true; }},()=>S.flags.read_ledgers),X("You’re doing it right. I’ll listen.",'sr4')]},
  sr2:{speaker:'—',port:null,text:"You read it. It’s one word. It takes a long time.\n\nOne of the people on the children’s chairs is an old man in a line-two jacket. He nods, once, at the word, like a man hearing his name called.",choices:[X("[…]",null)]},
  sr3:{speaker:'—',port:null,text:"You read it out. Somebody on the children’s chairs makes a small sound. Sarah keeps her finger on the line until the sound is finished.\n\n\"Thank you,\" she says. \"Nobody had read that one out loud before.\"",choices:[X("[…]",null)]},
  sr4:{speaker:'Sarah Lindqvist — librarian',text:"She nods and turns the page. \"Requisition, line three, fan fourteen. June. Deferred.\"",choices:[X("[…]",null)]},
},'sr1');
beat('sarah','sarah3',()=>S.act===3,{
  st1:{speaker:'Sarah Lindqvist — librarian',text:"\"The books on the top shelves are writing themselves.\" She’s holding one, carefully, like it might bite. \"Just names. Everyone in town. Mine’s on page forty.\" She holds it out. \"I can’t make myself read it. Will you?\"",
    choices:[X("[Read it to her.]",'st2',{now:()=>trust('sarah',1)}),X("[Close the book.] You don’t have to know.",'st3')]},
  st2:{speaker:'—',port:null,text:()=>"Page forty. LINDQVIST, SARAH. Under it, one line:\n\n"+(S.flags.read_aloud?"“who read the names out loud, so that they were heard.”":"“who stamped the books nobody took out.”")+"\n\nShe reads it over your shoulder. She doesn’t say anything. She puts the book back on the shelf, spine in, so nobody else can read it.",choices:[X("[…]",null)]},
  st3:{speaker:'Sarah Lindqvist — librarian',text:"\"No,\" she says. \"I don’t, do I.\" She puts it back unread. It’s the kindest thing anyone has done for her in a month, and you can see her decide not to thank you for it.",choices:[X("[…]",null)]},
},'st1');

/* ── Kevin Tran: still himself? ─────────────────────────────────────────── */
beat('kevin_motel','kevin3',()=>S.act===3,{
  kv1:{speaker:'Kevin Tran',text:()=>S.flags.kevin_used?"He is sitting cross-legged on the motel bed reading the ceiling, where the tear in the sky shows through the plaster.\n\n\"It’s mid-sentence,\" he says. \"The whole sky. It’s the same sentence as the tablet. I can almost—\" He stops. \"Do you think I’m still me? You can tell me. I won’t be upset. I don’t think I can be upset any more.\"":"He’s awake, eating dry cereal out of the box, and watching the tear in the sky through the window like a weather report.\n\n\"I dream in it now,\" he says. \"The tablet. Not the words, the grammar. I wake up and the first thing I think is a function call.\" He offers you the box. \"Is that normal? For prophets? Is there a union?\"",
    choices:[X("You’re still you, Kevin.",'kv2',{now:()=>trust('kevin',1)}),X("[Sam] I don’t know. Let’s find out together.",'kv3',{now:()=>{ trust('kevin',2); arc('sa',1); }},isSam),X("[Dean] There’s no union. There should be. I’ll sign.",'kv3',{now:()=>{ trust('kevin',2); arc('dl',1); }},isDean)]},
  kv2:{speaker:'Kevin Tran',text:"\"Okay.\" He takes it, the way you take a pill. \"Okay. I’m going to believe you because it’s you.\"",choices:[X("[…]",null)]},
  kv3:{speaker:'Kevin Tran',text:"He laughs, properly, and almost chokes on cereal. \"Okay. Okay. That’s— yeah.\" He wipes his eyes. \"When this is over I’m going to Princeton and I’m going to be extremely boring.\"",choices:[X("[…]",null)]},
},'kv1');

/* ── Delia Park: listening to the fog ──────────────────────────────────── */
SECTORS.street.entities.push(npc_('delia',16.6,26.9,'delia3','Delia, in the shelter',{h:1.78,face:-Math.PI/2,hidden:true,delia3:true}));
DIALOGUE.delia3={port:'delia',start:'z',nodes:{z:{speaker:'Delia Park',text:'"I’m listening. It’s scared too, you know."',choices:[X('[Leave.]',null)]}}};
INV_UPDATES.push(()=>{ const e=SECTORS.street.entities.find(x=>x.delia3); if(!e) return; e.hidden=!(S.act===3&&S.flags.delia_done&&!S.flags.delia_killed); });
beat('delia3','delia3',()=>S.act===3,{
  dl1:{speaker:'Delia Park',text:"She’s back in the bus shelter. On purpose, this time, with a blanket round her shoulders and her eyes closed.\n\n\"When it was in me, I could hear the thing in the fog. The demon was terrified of it.\" She opens her eyes. \"It doesn’t like being looked at. It goes still. Like a child who thinks you can’t see them if they don’t move.\"",
    choices:[X("[Sit with her.]",'dl2',{flag:'delia_insight',now:()=>trust('delia',1)}),X("Go home, Delia. You’ve done enough.",'dl3')]},
  dl2:{speaker:'Delia Park',text:"You sit. The shelter smells of rain and old gum. After a while she leans her head on your shoulder, like you’re both waiting for a bus that stopped running in spring.\n\n\"Look at it,\" she says. \"Keep the light on it. Don’t let it be quiet.\"",choices:[X("[…]",null)]},
  dl3:{speaker:'Delia Park',text:"\"This is the only place I’m any use.\" She closes her eyes again. \"Let me listen.\"",choices:[X("[…]",null)]},
},'dl1');
/* her insight makes the light worse for them */
{ const was=torchBurn; torchBurn=function(e,dt,d,s){ was(e,dt,d,s); if(S.flags.delia_insight&&S.torchOn&&S.battery>0&&d<7.5&&lookedAt(e,.94)) e.hp-=5*dt; }; }

/* ── Juno: what management paid ─────────────────────────────────────────── */
SECTORS.street.entities.push(npc_('juno',2.6,22.4,'juno3','Juno',{h:1.9,face:0,hidden:true,juno3:true}));
DIALOGUE.juno3={port:'juno',start:'z',nodes:{z:{speaker:'Juno',text:'"Still here, sugar. Same as you."',choices:[X('[Leave.]',null)]}}};
INV_UPDATES.push(()=>{ const e=SECTORS.street.entities.find(x=>x.juno3); if(!e) return; e.hidden=!(S.act===3&&S.flags.juno_met&&!S.flags.juno_gone&&!e.dead); });
beat('juno3','juno3',()=>S.act===3,{
  ju1:{speaker:'Juno',text:"She’s standing at the very edge of town, where the fog starts, in her red dress, with no bar to stand behind.\n\n\"The Velvet Hour has new management.\" She smiles without anything in it. \"I was paid in quiet, you know. Every night. I sold numbness and I got to keep a little. Do you know what quiet costs, hunter? Everything you were before you wanted it.\"",
    choices:[X("What were you, before?",'ju2'),X("[Sam] Let me try the rite. Whatever’s in you, it can come out.",'ju3',null,isSam),X("[Dean] You poured Sam a vial. You don’t get a hug.",'ju4',null,isDean)]},
  ju2:{speaker:'Juno',text:"\"A woman named June who tended bar in Coos Bay and liked it too much.\" She shrugs. \"Then something offered me a job. I don’t know which of us is talking now. Neither does it.\"",
    choices:[X("When this is over, there’s room in the car.",'ju5',{flag:'juno_spared',now:()=>trust('juno',2)}),X("Then walk into the fog. It’s what you sold everyone else.",'ju6',{flag:'juno_gone'})]},
  ju3:{speaker:'—',port:null,text:"You say the words. Something leaves her the way breath leaves a cold window: no smoke, no scream. Just less of her.\n\nThe woman left standing in the red dress is fifty, tired and frightened. \"I’m June,\" she says. \"I think. I think I’m June.\"",
    choices:[X("[…]",null,{flag:'juno_spared',now:()=>{ S.flags.juno_freed=true; trust('juno',3); sfx('riteEnd'); }})]},
  ju4:{speaker:'Juno',text:"\"No,\" she agrees. \"I don’t.\"",choices:[X("[…]",'ju2')]},
  ju5:{speaker:'Juno',text:"She looks at you for a long moment, as if checking for the trick.\n\n\"Nobody’s offered me a ride in a long time,\" she says. \"I’ll think about it. I’ll be at the church. I’d like to see how it ends.\"",choices:[X("[…]",null)]},
  ju6:{speaker:'—',port:null,text:"She inclines her head, as if you’ve settled a bill. Then she steps backwards into the grey and the grey closes over the red dress like water.",choices:[X("[…]",null,{now:()=>{ const e=SECTORS.street.entities.find(x=>x.juno3); if(e) e.dead=true; }})]},
},'ju1');

/* ── Castiel: acting without certainty ─────────────────────────────────── */
beat('castiel_wait','cas3',()=>S.act===3&&S.flags.lily_done,{
  ca1:{speaker:'Castiel',text:"He’s sitting on the kerb by the crater, holding a motel ice bucket full of nothing, very carefully.\n\n\"I have always had orders. Even when I disobeyed them, I had them to disobey.\" He turns the bucket in his hands. \"Now there is a girl who was not counted, and a priest who tells the truth, and a man in a bathrobe who says he wrote it. And nobody tells me which of these matters most.\"",
    choices:[X("[Dean] Then you decide. That’s all any of us get.",'ca2',{flag:'cas_resolve',now:()=>arc('dl',1)},isDean),X("[Sam] Faith isn’t certainty, Cas. It’s acting anyway.",'ca2',{flag:'cas_resolve',now:()=>arc('sa',1)},isSam),X("Maybe nobody should tell you.",'ca3')]},
  ca2:{speaker:'Castiel',text:"He looks at you for a long time, the way he looks at things he intends to remember.\n\n\"Then I will open the church,\" he says, \"because I have decided to. Not because I was told.\" He sets the ice bucket down. \"It is a very frightening feeling. I see why you all drink.\"",choices:[X("[…]",null)]},
  ca3:{speaker:'Castiel',text:"\"Maybe.\" He doesn’t sound comforted. \"Somebody should.\"",choices:[X("[…]",null)]},
},'ca1');
{ const was=epilogue; epilogue=function(k){ const E=was(k); if(k==='D') return E;
    E.lines.push(S.flags.cas_resolve?'Castiel walked out of the fog on his own two feet, three days later, carrying an ice bucket. Nobody asked about the ice bucket. He said he had decided to come back.':'Nobody saw Castiel leave St. Brendan’s. The doors stayed open a long time after there was no one holding them.');
    if(S.flags.juno_freed) E.lines.push('A woman named June tends bar in Coos Bay. She serves water to anyone who asks for something stronger, and listens to them for free.');
    else if(S.flags.juno_spared) E.lines.push('Juno rode out of Oakhaven in the back of a pickup with the motel’s spare blankets. She didn’t say where she was going. She didn’t sell anything on the way.');
    if(S.flags.sold_memory) E.lines.push('There is something you sold Earl that you can’t remember. Some nights you’re sure it was the most important thing in the case.');
    return E; }; }

/* ── Crowley: a subcontractor in his own town ──────────────────────────── */
SECTORS.pawn.entities.push(npc_('crowley',12.6,3.6,'crowley3','Crowley',{h:1.8,face:Math.PI,hidden:true,crowley3:true}));
DIALOGUE.crowley3={port:'crowley',start:'z',nodes:{z:{speaker:'Crowley',text:'"Not now, darling. I’m hiding."',choices:[X('[Leave.]',null)]}}};
INV_UPDATES.push(()=>{ const e=SECTORS.pawn.entities.find(x=>x.crowley3); if(!e) return; e.hidden=!(S.act===3&&S.flags.crowley_done); });
beat('crowley3','crowley3',()=>S.act===3,{
  cw1:{speaker:'Crowley',text:"The King of the Crossroads is sitting behind Earl’s counter, in Earl’s chair, with his feet up on a box of Earl’s shells, looking ill.\n\n\"Don’t. I know how it looks.\" He gestures at the window, at the torn sky. \"Every deal I have ever made had a ceiling. Something above it, with rules, that I could appeal to. Do you know what’s above this one?\" He laughs. \"A man in a bathrobe with a word processor.\"",
    choices:[X("Then help us. Not a deal. Help.",'cw2',{flag:'crowley_ally'}),X("[Dean] You sold the field. Live in it.",'cw3'),X("What do you actually want, Crowley?",'cw4')]},
  cw2:{speaker:'Crowley',text:"\"Help.\" He tastes the word like a wine he suspects is corked. \"Without terms.\"\n\nA long pause.\n\n\"…Fine. Don’t tell anyone. I have a reputation in several realms.\" He stands, straightens his coat. \"I’ll be at your car when you need me. I’ll bring something that burns.\"",choices:[X("[…]",null)]},
  cw3:{speaker:'Crowley',text:"\"That’s the plan,\" he says, very quietly. \"That’s been the plan all along.\"",choices:[X("[…]",null)]},
  cw4:{speaker:'Crowley',text:"He thinks about it, which you suspect he hasn’t done in a long time.\n\n\"For it to be a transaction,\" he says. \"For all of it — the mill, the fog, the six men — to have been a transaction. Something I understand. I would sell anything to understand it.\" He looks up. \"I’m told that’s what despair is.\"",choices:[X("Then help us. Not a deal.",'cw2',{flag:'crowley_ally'}),X("[…]",null)]},
},'cw1');
{ const c=DIALOGUE.crowley_iv.nodes.c0, t=c.text; c.text=()=>(typeof t==='function'?t():t)+(S.flags.crowley_ally?"\n\n\"No terms,\" he adds, before you can ask. \"I said I’d help. I find, to my enormous irritation, that I meant it.\"":""); }

/* ── Father Alistair: on the steps, in Act II ──────────────────────────── */
SECTORS.street.entities.push(npc_('alistair',50.6,23.8,'alistair2','a priest on the church steps',{h:1.78,face:Math.PI,hidden:true,alistair2:true}));
DIALOGUE.alistair2={port:'alistair',start:'z',nodes:{z:{speaker:'Father Alistair',text:'"The church opens when it’s time. Not before. Go and be kind to someone."',choices:[X('[Leave.]',null)]}}};
INV_UPDATES.push(()=>{ const e=SECTORS.street.entities.find(x=>x.alistair2); if(!e) return; e.hidden=!(S.act===2&&S.flags.delia_done); });
beat('alistair2','alistair2',()=>S.act===2,{
  al1:{speaker:'A priest on the church steps',text:"An old man in a cardigan over his cassock, lighting a single candle on the top step of a locked church and shielding it from the rain with his hand.\n\n\"You’re the brothers. Marla mentioned you.\" He doesn’t get up. \"I sat with Ray Hollis on his last night, you know. Two hours. He kept trying to fill out a form in the air with his finger. I held his hand and told him it wouldn’t hurt much longer. It was true.\"",
    choices:[X("Who are you?",'al2'),X("Why are you telling us this?",'al3')]},
  al2:{speaker:'Father Alistair',text:"\"Alistair. I keep St. Brendan’s, for whatever St. Brendan’s is worth now.\" The candle gutters and he cups it closer. \"You’ll come inside eventually. Everybody does, at the end.\"",choices:[X("[…]",null,{flag:'alistair_early'})]},
  al3:{speaker:'Father Alistair',text:"\"Because you’re the only people in town who still look surprised.\" He smiles, kindly. \"It won’t last. I hope it lasts a little while.\"",choices:[X("[…]",null,{flag:'alistair_early'})]},
},'al1');
{ const a=DIALOGUE.alistair.nodes.a0, t=a.text; a.text=()=>(typeof t==='function'?t():t)+(S.flags.alistair_early?"\n\n\"We met on the steps,\" he adds. \"You still look surprised. I’m glad.\"":""); }
