/* ═══ The one at the end ═══════════════════════════════════════════════════
   A figure drawn from the Krishna of Vyasa's Mahabharata: the envoy of the
   Udyoga Parva who offers peace before force, the teacher of the Gita who
   changes how the question is understood rather than answering it on its
   own terms, the Vishvarupa of the Bhishma Parva whose form no ordinary
   sight contains, and, from the Mausala Parva, a power that does not undo
   the cost of what has already been done.

   His lines come from the author's design notes or were written for this
   game. None quote the epic.

   He is not a boss with a health bar. He is calm, exact, unhurried, moved
   by beauty and not by threat. He understands the brothers' objections,
   grants what is true in them, and still acts on a principle they can't
   yet see. Knowing how a thing is likely to end does not give him, or
   anyone, the right to force it.

   He appears three times as a stranger before the end, and is only named
   when he chooses to be.

   His look (1.6): gothic, cold and sacred rather than golden. Midnight-blue
   skin, long black hair with blue in it, pale silver eyes, layered black
   robes over indigo, silver embroidery like constellations, a high collar,
   a feathered mantle, a minimal silver crown, and one dark peacock feather,
   reinterpreted as something almost funerary. He is not evil because he is
   dark: he is past the categories, and his stillness is the unsettling part.
   He goes by no name. The script calls him the Formless One.

   Phase I   · The Stranger     no combat; your evidence against Chuck's story
   Phase II  · The Unmaker      the enchantresses lose their hold on the screen
   Phase III · The Absolute     perception, contradiction, choice; not weapons
   Phase IV  · The Unchosen     the brothers decide. He will not. */

const godName=()=>S.flags.tg_named?NAMES.god:'A stranger';
/* port is evaluated when the node is shown, so make it a getter too */
const GN=(text,choices,o={})=>{ const n={text,choices}; Object.defineProperty(n,'speaker',{get:()=>o.who||godName(),enumerable:true});
  Object.defineProperty(n,'port',{get:()=>o.port!==undefined?o.port:(S.flags.tg_named?'formless':'stranger'),enumerable:true}); if(o.spell) n.spell=o.spell; if(o.fx) n.fx=o.fx; if(o.maya) n.maya=true; return n; };
const tg=()=>{ const I=inv_(); I.tg=I.tg||{proofs:[],misses:0,phase:0}; return I.tg; };
const bName=()=>HEROES[HEROES[S.hero].brother].name, hName=()=>HEROES[S.hero].name;

/* a flute, very far away */
function flute(){ try{ if(!AU.ctx||!S.settings.sound) return; const c=AU.ctx, t=c.currentTime, out=AU.fx||AU.master;
  const notes=[587,659,784,659,587,523,587]; notes.forEach((f,i)=>{ const o=c.createOscillator(), g=c.createGain(), v=c.createOscillator(), vg=c.createGain();
    o.type='sine'; o.frequency.value=f; v.frequency.value=5.5; vg.gain.value=f*.012; v.connect(vg); vg.connect(o.frequency);
    const s=t+i*.42; g.gain.setValueAtTime(0,s); g.gain.linearRampToValueAtTime(.05,s+.08); g.gain.linearRampToValueAtTime(.0,s+.5);
    o.connect(g); g.connect(out); o.start(s); v.start(s); o.stop(s+.55); v.stop(s+.55); }); }catch(e){} }

/* ── three meetings with a stranger ───────────────────────────────────── */
DIALOGUE.stranger1={port:'stranger',start:'a0',nodes:{
  a0:GN(()=>`A man is sitting in the motel office’s only good chair with a cup of tea, reading. His skin is a midnight blue, almost black in the lamplight; his hair is long and black and not quite tamed; his clothes are black on black, with a thread of silver at the cuffs. He is beautiful in a way that doesn’t ask anything of you, and very still. A dark peacock feather, nearly black, marks his page.\n\n"${S.flags.signed_alias?`You signed Marla’s ledger with another man’s name. That was sensible. Good evening, Mr. ${NAMES.family}.`:`You signed your own name in Marla’s ledger. That is rarer than you would think. Good evening, Mr. ${NAMES.family}.`}"`,
    [D_('“Who are you?”','a1'),D_('“How do you know my name?”','a2'),D_('[Leave.]',null,{flag:'tg1'})]),
  a1:GN('"Someone passing through. Like you, I came because something here is being done badly, and I find that difficult to look away from." He turns a page. "You will meet a man who believes he wrote this town. When you do, don’t argue with his story. Ask him who gave him the paper."',
    [D_('“And who did?”','a3')]),
  a2:GN('"Names are the least hidden thing about a person. What you hide is elsewhere." He looks at you properly for the first time, and it is like being looked at by a long road. "You are frightened of what you’ll have to decide. Good. A man who isn’t frightened of that hasn’t understood it."',
    [D_('“Who are you?”','a1')]),
  a3:GN('He smiles, very slightly, as if you’ve made a move in a game he enjoys. "Finish your tea," he says, though you don’t have any. When you look back from the door, the chair is empty, and the feather is on the arm of it.',
    [D_('[Take the feather.]',null,{flag:'tg1',now:()=>{ addNoteRaw('tg_feather','A peacock feather','A dark peacock feather, almost funerary, left on the arm of the motel’s good chair by a man who knew your real name. “Don’t argue with his story. Ask him who gave him the paper.”'); flute(); }})]),
}};
DIALOGUE.stranger2={port:'stranger',start:'b0',nodes:{
  b0:GN(()=>`St. Brendan’s, empty, with the fog against the windows. The stranger is in the third pew with his elbows on his knees, as if he were listening to a sermon only he can hear. Faintly, somewhere, a flute.\n\n"Sit, if you like. ${isDean()?'You won’t. That’s all right.':'You will. You’ll sit on the end, near the aisle, so you can leave.'}"`,
    [D_('“Can you help us?”','b1'),D_(isDean()?'“If you know what’s happening here, start talking.”':'“If you know how this ends, tell us.”','b2'),D_('“What do you know about Crowley?”','b3')]),
  b1:GN('"I am helping. I am telling you the truth about the board." He nods at the empty altar. "Moving your pieces for you would be something else, and you would be right to resent it."',
    [D_(isDean()?'“Then what good are you?”':'“That’s not help. That’s commentary.”','b4')]),
  b2:GN('"If I told you, you would treat it as a wall." He lets that sit. "It is a river. Rivers can be known without being stopped."',
    [D_('“That’s a metaphor.”','b4')]),
  b3:GN('"He is negotiating. He will betray you exactly as far as it profits him, and no further. That is a kind of reliability, and more than most people offer." A pause. "There are also two women in this town who will offer to carry what you carry. Both are lying about the price."',
    [D_('“Which two?”','b5')]),
  b4:GN('"Yes," he says, as though you’ve pleased him. "Keep asking that. It is the right question, asked of the wrong person." He stands. "Ask it of the man in the bathrobe, when he offers you a choice between two terrible things and calls it fate."',
    [D_('[Watch him go.]',null,{flag:'tg2',now:flute})]),
  b5:GN('"You’ll know them by how kind they are to the part of you that you’re ashamed of." He stands and buttons his coat. "If one of them has you, you won’t be able to free yourself. That isn’t weakness. It is the shape of the thing. Someone else will have to reach you."',
    [D_('[Watch him go.]',null,{flag:'tg2',now:flute})]),
}};
DIALOGUE.stranger3={port:'stranger',start:'k0',nodes:{
  k0:GN('The stranger is standing in the middle of the cross street with his hands in his coat pockets, looking at the streetlights the way other people look at old photographs.\n\n"Would you like to see this street before it learned to be afraid?"',
    [D_('“Show me.”',null,{now:()=>playCutscene('kala')}),D_('“No.”','k1')]),
  k1:GN('"That’s fair. Seeing it would not make it so." He looks at you. "At the end there will be a third chair. Sit in neither."',
    [D_('[…]',null,{flag:'tg3',now:flute})]),
}};
/* Kālacakra: the wheel of time, turned back once to show what was */
CUTSCENES.kala=function(){ const st=SECTORS.street, six=['Ray Hollis','Lyle Brandt','Emeka Okafor','Tunde Okafor','Pete Lindqvist','Mo Haddad'], ents=[];
  return { dur:16, letterbox:true,
    setup(){ S.skyOver={top:[110,160,210],bot:[230,200,160],cloud:[240,240,240],clouds:.6,stars:false,moon:false}; applyPreset(S.preset); SKY_DIRTY=true;
      six.forEach((n,i)=>{ const e=char_('worker',26+i*.9,30-i*.6,{kind:'actor',h:1.8,face:-Math.PI/2+.4,lit:.8,kala:true,name:n}); ents.push(e); st.entities.push(e); }); },
    cam:[{t:0,x:28,y:36,a:-Math.PI/2,z:0},{t:16,x:28,y:33,a:-Math.PI/2-.1,z:0}],
    subs:[{t:.4,who:'narr',text:'Late May. Early evening. The streetlights are just coming on and nobody looks at them.'},
      {t:4,who:'narr',text:'Six men in hard hats walk past you toward the mill, arguing about a ball game. One of them is coughing. Nobody thinks anything of it.'},
      {t:9,who:'god',text:'This was true. It is still true. It is simply not the only thing that is true.'},
      {t:12.6,who:'god',text:'Knowing it was otherwise does not make it otherwise. That is the whole difficulty, and the whole dignity, of being in time.'}],
    events:[{t:3.6,fn:()=>{ ents.forEach(e=>{ e.tx=e.x; e.ty=e.y-12; e.speed=.9; e.kind='walker'; e.talk=null; }); }},{t:15.2,fn:()=>{ S.glitchA=.4; sfx('whisper'); }}],
    end(){ st.entities=st.entities.filter(e=>!e.kala); S.skyOver=null; applyPreset(S.preset); SKY_DIRTY=true; S.flags.tg3=true; S.flags.tg_kala=true;
      addNoteRaw('tg_kala','The street in May','The stranger showed you Main Street in late May: six men walking to the night shift, one of them coughing. “Knowing it was otherwise does not make it otherwise.”');
      say(brother(),'Did you see them? Tell me you saw them.',3); } }; };
{ const m=SECTORS.motel, ch=SECTORS.church, st=SECTORS.street;
  if(m) m.entities.push(npc_('stranger',15.6,4.6,'stranger1','A stranger',{h:1.8,face:Math.PI,stranger:1,hidden:true}),{kind:'prop',m:'coatchair',x:15.6,y:3.9,r:.25,h:1,stranger:1,hidden:true});
  if(ch) ch.entities.push(npc_('stranger',9,9.2,'stranger2','A stranger',{h:1.8,face:Math.PI/2,stranger:2,hidden:true}));
  st.entities.push(npc_('stranger',28.4,19.4,'stranger3','A stranger',{h:1.8,face:Math.PI/2,stranger:3,hidden:true})); }
INV_UPDATES.push(()=>{ const F=S.flags;
  for(const s of [SECTORS.motel,SECTORS.church,SECTORS.street]) if(s) for(const e of s.entities) if(e.stranger){
    const k=e.stranger; e.hidden=F['tg'+k]||!(k===1?(S.act===1&&F.phantom):k===2?(S.act===2&&F.kevin_checked):(S.act===3&&F.lily_done)); }
  if(!F.tg_flute&&S.act===2&&F.kevin_checked&&S.sector.id==='church'){ F.tg_flute=true; flute(); } });

/* ── the altar: a third chair ─────────────────────────────────────────── */
const CE=DIALOGUE.chuck_end.nodes;
{ const ch=CE.e0.choices.slice(); CE.e0.choices=[];
  for(const c of ch){ CE.e0.choices.push(Object.assign({},c,{next:'gA',req:()=>!S.flags.tg_done})); CE.e0.choices.push(Object.assign({},c,{req:()=>!!S.flags.tg_done})); } }
function godEnter(){ const C=SECTORS.cathedral; if(C.entities.some(e=>e.god)) return;
  C.entities.push({kind:'prop',m:'coatchair',x:11.2,y:4.4,r:.25,h:1,god:true});
  C.entities.push(char_('stranger',11.2,4.9,{kind:'actor',h:1.8,face:Math.PI/2,lit:.9,god:true,name:'A stranger'}));
  S.mission='The last scene is playing'; flute(); sfx('bell'); }
const CH=(text,choices)=>({speaker:NAMES.chuck,port:'chuck',text,choices});
Object.assign(CE,{
  /* Scene A */
  gA:{speaker:'—',port:null,text:'The lights in the nave flicker, all at once, the way they do when something very large changes its mind.\n\nWhen they steady there is a third chair beside Chuck’s, a mantle of black feathers over its back, and a man sitting in it with one ankle on his knee. He has been there, you understand, the whole time.',
    choices:[D_('[…]','gA1',{now:godEnter})]},
  gA1:CH('"Hang on." Chuck sits up, popcorn spilling. "Hang on. You’re not in the script."',[D_('[…]','gA2')]),
  gA2:GN('"You have mistaken the page for the world."',[D_('[…]','gA3')]),
  gA3:CH('"I wrote this town."',[D_('[…]','gA4')]),
  gA4:GN('"You wrote the suffering. You did not write the possibility of suffering. Do not confuse authorship with existence."',[D_('[…]','gA5')]),
  gA5:CH('"I’m the administrator."',[D_('[…]','gA6')]),
  gA6:GN('"Of a process."',[D_('[…]','gA7')]),
  gA7:CH('"And you are?"',[D_('[…]','gA8')]),
  gA8:GN('"The reason your permissions end somewhere."',[D_('[…]','gA9')]),
  gA9:{speaker:NAMES.chuck,port:'chuck',text:'Chuck’s hand moves, the little flick of a man hitting backspace.',lineFx:{to:'"Scene: the stranger stands up, walks out of the church and is never seen ag—"',then:'The words come apart before they finish. They don’t burn. They just stop being words.'},choices:[D_('[…]','gA10')]},
  gA10:GN('"Do not be alarmed. Nothing has been taken from you. You have merely met something you cannot revise."\n\nHe turns to the two of you, and for the first time he looks like what he is: patient. "You have been asked to choose between two terrible things. Before you do, may I show you what the choice is made of?"',
    [D_('“Go on.”','p1',{now:()=>phaseCard(1)}),D_('“Who are you?”','gA11'),D_('“We don’t need your help.”','gA12')]),
  gA11:GN(()=>`"You have met me three times${S.flags.tg1&&S.flags.tg2&&S.flags.tg3?'':', or nearly'}. Once with tea, once in a pew, once in May." He says it without any weight at all. "You will know my name when I give it. Not before. A name given too early is only a weapon."`,[D_('“Go on, then.”','p1',{now:()=>phaseCard(1)})]),
  gA12:GN('"Then you have understood something he hasn’t." The faintest smile. "Let us find out whether it holds up. I will only show you. What you do with it is yours."',[D_('“Fine.”','p1',{now:()=>phaseCard(1)})]),

  /* Phase I · the Diplomat */
  p1:GN(()=>`"He has told you that this town needs one of you to break, or it will be eaten. Let us test that the way you test everything: against what you have actually found." He gestures, palm up, at the case file in your pocket.\n\n${tg().proofs.length?`Found so far: ${tg().proofs.length}.`:'Nothing yet.'}`,
    [D_('[Evidence] The crossroads seal is older than the company. The hunger was here before Chuck’s “story”.','p1a',{now:()=>proof('older')},()=>!tg().proofs.includes('older')&&(S.flags.bell_seal||caseClosed('bell')||deduced('older')||caseClosed('saint'))),
     D_('[Evidence] Someone else has been editing his drafts: “or not”, in the margin.','p1b',{now:()=>proof('margin')},()=>!tg().proofs.includes('margin')&&(theoryRight('author')||deduced('revisable')||S.flags.chuck_shaken)),
     D_('[Evidence] He has admin, not root. Kevin found the root directory.','p1c',{now:()=>proof('root')},()=>!tg().proofs.includes('root')&&(S.flags.kevin_rig||S.flags.term_pawn)),
     D_('[Evidence] Six men died of paperwork, not fate. Fan fourteen was on the form.','p1d',{now:()=>proof('mill')},()=>!tg().proofs.includes('mill')&&(theoryRight('mill')||deduced('neglect'))),
     D_('“Prove it. Not with evidence we found. With yours.”','p1e'),
     D_('“Why should we believe you over him?”','p1f'),
     D_('“Are you good? Or aren’t you?”','p1g'),
     D_('“Enough.”','p2',null,()=>tg().proofs.length>=1)]),
  p1a:GN('"Yes. The seal predates his company, his ledger, and him. Whatever he is administering, he did not build it. He found a machine running and sat down at it."',[D_('[…]','p1')]),
  p1b:GN('"Yes. Someone has been writing in his margins, and he has been too proud to wonder who. A real author is not surprised by his own book."',[D_('[…]','p1')]),
  p1c:GN('"Yes. And a man who has only admin should be very careful about calling anything necessary."',[D_('[…]','p1')]),
  p1d:GN('"Yes. Six men died because a form was stamped seven times and the fan never came. That is not fate. That is a choice made cheaply, by people far away. He likes to call such things fate. It flatters him."',[D_('[…]','p1')]),
  p1e:GN('"Proof from me would be one more thing you had to take on faith." He considers you. "But I can show you something your own eyes already know." The air beside the altar folds, and for a moment you see Main Street in May, the six men walking to the shift.'+"\n\n"+'"You saw that once. You know it was real. You know it isn’t real any more. Both are true. He wants you to believe only the second."',[D_('[…]','p1',{now:()=>proof('kala')})]),
  p1g:GN('"Good and evil are the names you give to what you can survive." He says it gently. "I can admire a flower and permit a city to fall, and see no contradiction between them, unless you can show me one." He waits, genuinely. "Can you? I would like to see it."',[D_('[…]','p1')]),
  p1f:GN('"You shouldn’t." Simply. "Believe what you can check. I am only pointing at things. If I ask you to take anything on trust, refuse me."',[D_('[…]','p1')]),
  /* the brothers question him: Scene B or C by who you are */
  p2:GN(()=>isDean()?'He turns to you.\n\n"You have a question. You’ve been carrying it since the motel."':'He turns to you.\n\n"You have an objection. It is a good one. Make it."',
    [D_('“So what, you’re God? Another one? We’ve killed things that called themselves God.”','pD1',null,isDean),
     D_('“If you know what happens, then every choice is already decided.”','pS1',null,isSam)]),
  pD1:GN('"You have killed beings who mistook power for its source."',[D_('“And you’re different?”','pD2'),D_('“You watched six men die in that mill and did nothing.”','pDc')]),
  pDc:GN('"You call me cruel because you expected the universe to be kind." He doesn’t look away from you. "I have observed your suffering. I have not mistaken observation for justification. Neither should you."',[D_('“And you’re different from him?”','pD2')]),
  pD2:GN('"You are still asking whether I can be killed. Ask instead what you think killing me would accomplish."',[D_('“I protect my family. That’s what I do.”','pD3')]),
  pD3:GN(()=>`"And when protecting them becomes another name for deciding that nobody else may choose?"${(inv_().bond||0)<0?`\n\nHe glances, very briefly, at ${bName()}. "Tonight you chose for him more often than you asked him."`:''}`,[D_('[Say nothing.]','pD4'),D_('“That’s not what I—”','pD4')]),
  pD4:GN('"There. That is the question you came here to avoid." Not unkindly. "Keep it. It is worth more to you than an answer would be."',[D_('[…]','p2b',{now:()=>{ arc('dl',1); S.flags.tg_dean=true; }})]),
  pS1:GN('"Knowing the course of a river is not the same as being the water."',[D_('“That’s a metaphor. It doesn’t answer the question.”','pS2')]),
  pS2:GN('"Correct. You have found the weakness in the metaphor."\n\nFor the first time, he pauses.\n\n"Knowing an outcome and having the power to compel it are different things. So are the freedom to act and the freedom to escape every consequence of acting."',[D_('“Then what do you want from us?”','pS3')]),
  pS3:GN('"Nothing that can be had by forcing you."',[D_('[…]','p2b',{now:()=>{ arc('sa',1); S.flags.tg_sam=true; }})]),
  p2b:GN(()=>`${bName()} has been listening. ${isDean()?'"He’s not wrong," Sam says quietly. "About either of us."':'"I hate that I like him," Dean mutters. "That’s new."'}\n\nThe stranger looks past you both, toward the nave doors. "Ah," he says. "Now they come."`,
    [D_('[Turn round.]','q0',{now:()=>phaseCard(2)})]),

  /* Phase II · the Charioteer */
  q0:{speaker:'—',port:null,text:()=>{ const F=S.flags, v=F.vesper_done?'Vesper':'A woman in a red coat', c=F.celandine_done?'Celandine':'a woman in grey';
      return `The doors of the nave open on nothing, and two women walk out of the nothing as if it were a hallway.\n\n${v}, smiling the way she smiled at the end of the bar. ${c}, with a book under her arm that has both your names on the spine.\n\n"Finales," Vesper says, "are so lonely. We thought you’d want company."`; },
    choices:[D_('[…]','q1')]},
  q1:{speaker:'Vesper',port:'vesper',text:()=>`She doesn’t come for you. She goes to ${bName()}, and lays two fingers on the back of his hand, and he goes very still.\n\nCelandine opens her book at your page. "Say the line," she tells you. "The one that ends this. He wrote it for you. We only want to hear you read it."`,
    choices:[D_('“Get away from him.”','qT'),D_('“I’m not reading anything.”','qT'),D_('“Look at me. Not her.”','qT')],
    spell:{by:'vesper',next:'qT',brother:'qB',love:'qL',after:()=>'"See," Vesper says. "It’s easier when you just say yes."'}},
  /* Māyā: after her words are on the screen, he shows you how they were made */
  qT:GN(()=>`"Look again," says the stranger, very quietly, at your shoulder.\n\nThe words you were about to say hang in the air in front of you, blackened now, threaded through with silver where they were sewn: where your fear was cut out, where your fatigue was stitched in, where someone else’s wanting was hemmed into your voice. They are beautifully made. They are not yours, and they no longer move when she pulls on them.`,
    [D_('[Use what you know.] “You feed on the part of us we’re ashamed of. I’m not ashamed of him.”','qW',{now:()=>{ S.flags.tg_won_own=true; }},()=>closedCount()>=6||arcOf(S.hero==='dean'?'dl':'sa')>=2),
     D_(()=>isDean()?`[Grab ${bName()} and don’t let go.]`:`[Name what she is.] “You’re a hunger wearing a hostess.”`,'qW',{now:()=>{ S.flags.tg_won_own=true; }},()=>(inv_().bond||0)>=0||together()),
     D_('[Call the town.] “Marla. Sarah. Everyone who came to the doors.”','qW',{now:()=>{ S.flags.tg_won_town=true; }},()=>(S.flags.gathered||0)>=4),
     D_(()=>S.flags.anchor_vesper?'[Hold up her red ribbon and tie it back in her hair.]':'[Close Celandine’s book with her grey bookmark in it.]','qW',{now:()=>{ S.flags.tg_won_anchor=true; }},()=>S.flags.anchor_vesper||S.flags.anchor_celandine),
     D_(()=>`[Say it out loud.] “${NAMES[LOVE_OF[S.hero]]}.”`,'qW',{now:()=>{ S.flags.tg_won_love=true; }},()=>trueLove()),
     D_(()=>`“Cut it. Whatever you are. Please.”`,'qG',{now:()=>{ S.flags.tg_relied=true; }})],{maya:true}),
  qB:{speaker:'—',port:null,text:()=>`It’s ${bName()} who moves first, still half under her hand: he reaches across the dark and gets a fist in your collar and hauls, and for a second the two of you are just two idiots in a church holding on to each other.\n\nVesper takes her hand back as if it were burned.`,choices:[D_('[…]','qW',{now:()=>{ S.flags.tg_won_own=true; }})]},
  qL:{speaker:'—',port:null,text:()=>`You say the name out loud. Somewhere in Oakhaven, someone hears you and says yours back, loudly, in an empty kitchen, and that is all it takes.\n\nVesper takes her hand off ${bName()} as if it were burned.`,choices:[D_('[…]','qW',{now:()=>{ S.flags.tg_won_love=true; }})]},
  qG:GN('He doesn’t move. Something does. A ring of black and silver hangs in the air beside him, blades within blades, turning without ever touching. The colour goes out of the church, and every shadow in it swings round to point at the third chair. Then the threads you couldn’t see between Vesper’s fingers and your brother’s wrist are simply not there any more. Neither of them is touched.\n\n"I cut the hold," he says, "not her, and not him. I want you to notice that you asked, and that I would not have done it if you hadn’t."',[D_('[…]','qD',{now:()=>chakra(2.8)})]),
  qW:GN(()=>`"There," the stranger says, and there is something in his voice that in anyone else you would call delight. "You see? You did not need me for that. I only showed you where the seams were."\n\n${bName()} is on his feet, shaking her off, swearing. Vesper looks at her empty hand with real dislike.`,[D_('[…]','qD')]),
  /* Scene D: she tries him */
  qD:{speaker:'Vesper',port:'vesper_true',text:'She turns to the third chair instead. "Then you," she says, and the room tilts toward her, and the choices in front of you change, because she is making them.\n\n"Every mind has a door. Every door has a key."',
    choices:[D_('[Kneel.]','qD1'),D_('[Surrender.]','qD1'),D_('[Adore her.]','qD1')],godSpell:true},
  qD1:GN('"You have found a door."\n\n"And the key?"\n\n"You have mistaken the existence of an entrance for the existence of a right."',[D_('[…]','qD2')]),
  qD2:{speaker:'Vesper',port:'vesper_true',text:'"You cannot be immune to desire."',choices:[D_('[…]','qD3')]},
  qD3:GN('"I did not say that I was."',[D_('[Ask her what she fears.]','qD4')]),
  qD4:GN('"I said that desire does not command me." He leans forward, interested, the way he looked at the streetlights. "What are you afraid of?"\n\nVesper opens her mouth to laugh, and doesn’t. "Being seen," she says at last. "All the way through. Nobody has ever wanted me once they could see how I was made."\n\n"I can see how you were made," he says. "It is very skilful. I find it beautiful. Beauty is not innocence: a thing may be beautiful and still deserve to end." The black-and-silver ring turns once beside him, and the colour goes out of the room, and every shadow points at his chair. "You do not, tonight. But you may not own anyone." When the colour comes back, the chain that ran from her to somewhere far below the church is gone. "Go and be skilful somewhere it costs no one anything."',
    [D_('[Watch them go.]','r0',{now:()=>{ S.flags.tg_freed_her=true; chakra(2.4); phaseCard(3); }})]),

  /* Phase III · Vishvarupa */
  r0:CH('"No," Chuck says. He’s standing now. "No, no. There has to be a final scene."',[D_('[…]','r1')]),
  r1:GN('"There is a final scene, in the story you wrote."',[D_('[…]','r2',{now:()=>vishva(1)})]),
  r2:GN('St. Brendan’s begins to stretch. The nave goes on past where a nave can go, into a geometry with too many right angles in it, and the pews recede into distances that are not distances.\n\n"You have confused it with the end of everything."',[D_('“What are you?”','r3')]),
  r3:GN('"Look."',[D_('[Look.]','r4',{now:()=>{ S.flags.tg_named=true; SPEAKERS.god.name=NAMES.god; const g=SECTORS.cathedral.entities.find(e=>e.god&&e.look); if(g){ g.look='formless'; g.name=NAMES.god; } vishva(2); flute(); }})]),
  r4:{speaker:'—',port:null,text:()=>`His body comes apart, gently, into geometry.\n\nHis silhouette separates into countless overlapping versions of himself, each a little later than the last. Inside the black of his robes there are stars, and worlds dying quietly at the edges, and living things, and timelines branching like frost on a windscreen. The mill, the church, the motel, the road that comes back to itself, the bell under the water: they are all in there, at once, and every face you have seen in Oakhaven, and every death, and your brother, and you.\n\nThe Void is in it too: a small dark hunger, turning, in one corner of something very large.\n\nHis face does not change at all. That is the worst of it. His human shape was never a limitation. It was a courtesy.\n\n${NAMES.god===NAME_DEFAULT.god?'He has no name that would fit in a mouth. The nearest your language comes is: the One. The Formless One.':'He has no name that would fit in a mouth. The nearest you can come is: '+NAMES.god+'.'}`,
    choices:[D_('[…]','r5')]},
  r5:{speaker:NAMES.chuck,port:'chuck',text:'"I can’t—" Chuck is trying to describe it. You can hear him trying. "There’s a… it’s like a… it’s bigger than the… it’s—" Each sentence is smaller than the last.',choices:[D_('[…]','r6')]},
  r6:GN(()=>`"You asked to see where your authority ends. You are looking at it."\n\n${isDean()?'Sam':'Dean'}: "${isDean()?'Dean. Dean, don’t look straight at it.':'Sam. Don’t look directly at it.'}"\n\n"Do not fear what you cannot understand. Fear the certainty with which you pretend to understand it." He turns, enormous and exact, toward you. "Here is the town as it is. Tell me which of these things is necessary."`,
    [D_('[Look closer.]','s1')]),
  s1:GN('Line three. Fan fourteen. Six men.\n\n"Was this necessary?"',
    [D_('“It was fate. It was always going to happen.”','s1x',null,()=>!tg().miss1),
     D_('“It was chosen. By a form, a company, and men who signed things.”','s2'),
     D_('“The Void wanted it.”','s1x',null,()=>!tg().miss1)]),
  s1x:GN(()=>`The wheel turns back, once. You see the requisition again, all seven of them, and the stamp: DEFERRED.${S.flags.read_ledger14?' You read that ledger. You know whose initials are on the stamp.':''}\n\n"Look again."`,[D_('[…]','s1',{now:()=>{ tg().miss1=true; tg().misses++; }})]),
  s2:GN('The Void, turning in its corner, eating.\n\n"Is this the author of Oakhaven?"',
    [D_('“Yes. Everything here is its will.”','s2x',null,()=>!tg().miss2),
     D_('“No. It’s a hunger. Somebody built a machine to feed it.”','s3'),
     D_('“It’s God. It’s what’s left when you stop pretending.”','s2x',null,()=>!tg().miss2)]),
  s2x:GN('The wheel turns back. You see the crossroads seal on the county map, older than the company, older than the town, and a ledger with ownership marked disputed.\n\n"Look again. Something that only consumes has never written anything."',[D_('[…]','s2',{now:()=>{ tg().miss2=true; tg().misses++; }})]),
  s3:GN(()=>`Last: the altar, and the two of you, and the thing Chuck has asked of you.\n\n"Is the sacrifice necessary?"`,
    [D_(`“One of us has to break. That’s the deal.”`,'s3x',null,()=>!tg().miss3),
     D_('“It’s only necessary inside his script.”','t0',{now:()=>{ phaseCard(4); vishva(0); }}),
     D_('“Nothing’s necessary. So nothing matters.”','s3x',null,()=>!tg().miss3)]),
  s3x:GN(()=>`The wheel turns back. You see yourselves in the Impala tonight${inv_().arc&&inv_().arc.picks&&Object.keys(inv_().arc.picks).length?', having the conversations you actually had':''}, and Chuck in the front pew with his popcorn, mouthing your lines a half-second before you say them.\n\n"Look again. Despair and fate are the same mistake in different coats. Both say: nothing you do can matter."`,[D_('[…]','s3',{now:()=>{ tg().miss3=true; tg().misses++; }})]),

  /* Phase IV · the Unchosen */
  t0:GN(()=>`The form closes, slowly, like a hand, and folds itself back into the courtesy of a man. The church is a church again, mostly. ${NAMES.god} is sitting in the third chair with his ankle on his knee, and he looks, if anything, a little tired.\n\n"Now I am going to do the hardest thing I do," he says. "Nothing. I will not choose for you. If I did, I would only be a better-written version of him."\n\nHe nods at the rift, at Chuck, at the doors.\n\n"It is yours."`,
    [D_('[Take your brother’s hand.] “We reject the script. Both of us walk out, and we take the town with us into the light.”','t1',{now:()=>{ S.flags.tg_choice='together'; }},()=>together()),
     D_('“We reject the script. Whatever it costs, it costs us, not one of us.”','t2',{now:()=>{ S.flags.tg_choice='reject'; }}),
     D_(`“Then step back. All the way. Your help is just a better script.”`,'t3',{now:()=>{ S.flags.tg_choice='refuse'; }}),
     D_('[Turn back to Chuck.] “Fine. Let’s hear the pitch.”','e1',{now:()=>{ S.flags.tg_done=true; S.flags.tg_choice='chuck'; vishva(0); S.mission=null; }})]),
  t1:GN('"Yes," he says. Just that. And then, because he cannot help it: "That was well made."',[D_('[Walk out together.]',null,{now:()=>godEnding('E')})]),
  t2:GN('"Then it will cost you." He doesn’t soften it. "It will not cost you everything. That is the difference between a price and a sacrifice."',[D_('[Walk out.]',null,{now:()=>godEnding('F')})]),
  t3:GN(()=>`He looks at you for a long moment, and you realise he is pleased: not with the answer, but with the asking.\n\n"That is the most reasonable thing anyone has said to me in a very long time." He stands, and lifts the feathered mantle from the back of his chair. "You may refuse me. Your refusal will not make you powerful. It will make it yours." A pause. "I will step back. Not because you defeated me. Because you are right that I should."`,[D_('[Let him go.]',null,{now:()=>godEnding('G')})]),
});
function proof(id){ const T=tg(); if(!T.proofs.includes(id)) T.proofs.push(id); }
function closedCount(){ return Object.keys(inv_().closed||{}).length; }
function godEnding(k){ S.flags.tg_done=true; S.mission=null; vishva(0); S.flags.ending=k; recordEnding(k); playCutscene('end_'+k); }

/* the line that won't stay written: Chuck tries to revise the scene */
const LFX={on:false};
{ const was=showNode; showNode=function(n){ was(n); const nd=n&&dlg.tree&&dlg.tree.nodes[n]; LFX.on=false;
    if(nd&&nd.lineFx){ Object.assign(LFX,{on:true,t:0,base:elLine.textContent,to:nd.lineFx.to,then:nd.lineFx.then}); }
    if(nd&&nd.godSpell) godSpellStart(); }; }
function lineTick(dt){ if(!LFX.on) return; LFX.t+=dt; const t=LFX.t, T=LFX.to;
  if(t<2.2) elLine.textContent=LFX.base+'\n\n'+T.slice(0,Math.floor(T.length*Math.min(1,t/2)));
  else if(t<4) elLine.textContent=LFX.base+'\n\n'+scramble(T,'',(t-2.2)/1.8);
  else { elLine.textContent=LFX.base+'\n\n'+LFX.then; LFX.on=false; } }
/* Scene D: her three options freeze and dissolve; a fourth arrives */
const GSP={on:false};
function godSpellStart(){ Object.assign(GSP,{on:true,t:0}); elDlg.classList.add('ench','ench_vesper'); }
function godSpellTick(dt){ if(!GSP.on||!dlg.open) return; GSP.t+=dt; const t=GSP.t, btns=[...elCh.children];
  if(t>2.4) btns.forEach(b=>{ b.style.opacity=String(Math.max(0,1-(t-2.4)/1.6)); b.textContent=scramble(b.textContent,'',Math.min(1,(t-2.4)/1.6)); });
  if(t>4.2){ GSP.on=false; elDlg.classList.remove('ench','ench_vesper'); elCh.innerHTML='';
    showNode('qD1'); } }
(function godLoop(){ try{ if(typeof requestAnimationFrame!=='function') return; let last=performance.now();
  const f=now=>{ const dt=Math.min(.05,(now-last)/1000); last=now; lineTick(dt); godSpellTick(dt); vishvaDraw(dt); if(dlg.open&&S.glitchA>0) S.glitchA=Math.max(0,S.glitchA-dt*1.4); requestAnimationFrame(f); }; requestAnimationFrame(f); }catch(e){} })();
/* her three choices can't be picked: the scene moves on without you */
{ const was=pickChoice; pickChoice=function(c){ if(GSP.on) return; return was(c); }; }
function godRun(sec){ for(let t=0;t<sec;t+=.05){ lineTick(.05); godSpellTick(.05); } }   /* tests */

/* ── Vishvarupa: the form ─────────────────────────────────────────────── */
const VIS={lvl:0,a:0,t:0,cv:null,imgs:null};
function vishva(l){ VIS.lvl=l; S.vishva=l; if(l===0&&VIS.cv) VIS.cv.classList.remove('on'); if(l>0){ S.glitchA=.5; sfx('tear'); S.shake=.6; } }
function artCanvas(a,scale=1){ const c=document.createElement('canvas'); c.width=a.w; c.height=a.h; const x=c.getContext&&c.getContext('2d'); if(!x) return null;
  const id=x.createImageData(a.w,a.h), o=new Uint32Array(id.data.buffer); for(let i=0;i<a.px.length;i++){ const p=a.px[i]; o[i]=p?((p&0xFFFFFF)|(255<<24))>>>0:0; } x.putImageData(id,0,0); return c; }
const VIS_FACES=['marla','earl','sarah','sheriff','doctor','kevin','delia','castiel','crowley','chuck','juno','alistair','old_man','worker','rainwoman','teen','logger','ghost_girl','phantom','rae','mechanic','nurse'];
const VIS_WORDS=['THE MILL','LINE THREE','FAN FOURTEEN','ST. BRENDAN’S','THE VELVET HOUR','PIKE’S RESERVOIR','HIGHWAY 38','MILE FOURTEEN','SUNDAY, OCTOBER 4','2:40 A.M.','RAY HOLLIS','LYLE BRANDT','EMEKA OKAFOR','TUNDE OKAFOR','PETE LINDQVIST','MO HADDAD','LILY','THE IMPALA','EVERY ROAD THAT RETURNS'];
function vishvaDraw(dt){ chakraTick(dt); if(!VIS.lvl&&CHK.dur<=0) return; try{
  if(!VIS.cv){ const c=document.createElement('canvas'); c.id='vishva'; const vp=document.getElementById('vp'); if(!vp||!c.getContext) return; vp.appendChild(c); VIS.cv=c; }
  const cv=VIS.cv; cv.classList.add('on'); const W=cv.width=cv.clientWidth||960, H=cv.height=cv.clientHeight||600, x=cv.getContext('2d'); if(!x) return;
  if(!VIS.imgs){ VIS.imgs={god:artCanvas(charSet('formless').front[0]),faces:VIS_FACES.filter(l=>LOOKS[l]).map(l=>{ try{ return portraitCanvas(l,0); }catch(e){ return null; } }).filter(Boolean)}; }
  VIS.t+=dt; const t=VIS.t, lv=VIS.lvl, cx=lv>=2?W*.74:W/2, cy=H*.4, R=Math.min(W,H);
  x.clearRect(0,0,W,H);
  if(lv){
    /* obsidian and midnight indigo; the cathedral stretched into geometry */
    x.fillStyle=lv===1?'rgba(6,6,14,.6)':'rgba(4,4,10,.95)'; x.fillRect(0,0,W,H);
    const g=x.createRadialGradient(cx,cy,R*.03,cx,cy,R*.8); g.addColorStop(0,'rgba(70,64,150,.35)'); g.addColorStop(.45,'rgba(24,22,70,.25)'); g.addColorStop(1,'rgba(0,0,0,0)'); x.fillStyle=g; x.fillRect(0,0,W,H);
    x.save(); x.translate(cx,cy);
    /* impossible arches: nested pointed arches receding forever */
    x.strokeStyle='rgba(190,198,220,.10)'; x.lineWidth=1;
    for(let i=0;i<14;i++){ const k=((i+t*.25)%14)/14, w=R*(.06+k*1.1), h=w*1.5; x.globalAlpha=(1-k)*.9;
      x.beginPath(); x.moveTo(-w,h*.5); x.lineTo(-w,-h*.1); x.quadraticCurveTo(-w,-h*.55,0,-h*.75); x.quadraticCurveTo(w,-h*.55,w,-h*.1); x.lineTo(w,h*.5); x.stroke(); }
    x.globalAlpha=1;
    /* sacred geometry: rotating polygons, cold silver */
    for(let r=0;r<5;r++){ const n=3+r*2, rr=R*(.16+r*.09), a0=t*(r%2?.06:-.05); x.strokeStyle=`rgba(200,206,226,${.16-r*.02})`; x.beginPath();
      for(let i=0;i<=n;i++){ const a=a0+i/n*Math.PI*2; x.lineTo(Math.cos(a)*rr,Math.sin(a)*rr*.86); } x.stroke(); }
    /* rings of every face in town: the living beings */
    const F=VIS.imgs.faces; if(lv>=2&&F.length) for(let ring=0;ring<4;ring++){ const n=10+ring*6, rr=R*(.24+ring*.12), dir=ring%2?1:-1;
      for(let i=0;i<n;i++){ const a=i/n*Math.PI*2+t*.05*dir*(1+ring*.3), im=F[(i+ring*3)%F.length], sz=R*(.045+ring*.01);
        x.globalAlpha=(.35+.3*Math.sin(t*.7+i+ring))*(1-ring*.15); x.drawImage(im,Math.cos(a)*rr-sz*.4,Math.sin(a)*rr*.8-sz*.5,sz*.8,sz); } }
    /* the places, written in silver round the edge */
    x.globalAlpha=.5; x.fillStyle='#c8cee0'; x.font=`${Math.round(R*.021)}px monospace`; x.textAlign='center';
    VIS_WORDS.forEach((w,i)=>{ const a=i/VIS_WORDS.length*Math.PI*2-t*.035, rr=R*(.7+.03*Math.sin(t*.3+i)); x.save(); x.rotate(a); x.fillText(w,0,-rr); x.restore(); });
    /* the Void: small, dried crimson, turning, in one corner of something very large */
    if(lv>=2){ const vx=R*.44, vy=R*.3; for(let i=0;i<36;i++){ const a=i*.5+t*1.3, r=i*.8; x.globalAlpha=.55-i*.014; x.fillStyle='rgb(92,22,28)';
        x.beginPath(); x.arc(vx+Math.cos(a)*r,vy+Math.sin(a)*r,R*.009,0,Math.PI*2); x.fill(); } }
    /* the form: countless overlapping versions of one still figure */
    const gi=VIS.imgs.god; if(gi){ x.imageSmoothingEnabled=false; const h=H*(lv===1?.5:.56), w=h*gi.width/gi.height, gy=H*.05-cy+h*.62;
      x.translate(0,gy);
      if(lv>=2) for(let i=14;i>=1;i--){ const off=i*R*.018, a=Math.sin(t*.4+i)*.04; x.save(); x.rotate(a); x.globalAlpha=.07+.02*(14-i)/14;
          x.drawImage(gi,-w/2-off,-h*.62-off*.3,w,h); x.drawImage(gi,-w/2+off,-h*.62-off*.3,w,h); x.restore(); }
      /* the figure itself, with the cosmos inside the black of the robe */
      const o=VIS.inner||(VIS.inner=document.createElement('canvas')); o.width=gi.width*4; o.height=gi.height*4; const ox=o.getContext('2d');
      ox.imageSmoothingEnabled=false; ox.clearRect(0,0,o.width,o.height); ox.drawImage(gi,0,0,o.width,o.height);
      if(lv>=2){ ox.globalCompositeOperation='source-atop';
        const top=o.height*.27; ox.fillStyle='rgba(6,6,20,.85)'; ox.fillRect(0,top,o.width,o.height-top);
        const rnd=k=>{ const v=Math.sin(k*91.7+3.1)*43758.5; return v-Math.floor(v); };
        for(let i=0;i<70;i++){ const sx=rnd(i)*o.width, sy=top+rnd(i+99)*(o.height-top), tw=.5+.5*Math.sin(t*2+i); ox.fillStyle=`rgba(220,226,246,${tw})`; ox.fillRect(sx,sy,1.2,1.2); }
        for(let i=0;i<4;i++){ const wx=o.width*(.25+.17*i), wy=top+(o.height-top)*(.2+.18*((i*3)%4)), fade=.5+.5*Math.sin(t*.6+i*1.7);
          ox.fillStyle=`rgba(70,80,140,${.8*fade})`; ox.beginPath(); ox.arc(wx,wy,3+i,0,Math.PI*2); ox.fill(); ox.strokeStyle=`rgba(110,30,36,${.9*(1-fade)})`; ox.stroke(); }
        ox.strokeStyle='rgba(200,206,226,.55)'; ox.lineWidth=.6;
        const branch=(bx,by,ang,len,d)=>{ if(d<=0) return; const ex=bx+Math.cos(ang)*len, ey=by+Math.sin(ang)*len; ox.beginPath(); ox.moveTo(bx,by); ox.lineTo(ex,ey); ox.stroke();
          branch(ex,ey,ang-.45+Math.sin(t*.3+d)*.1,len*.72,d-1); branch(ex,ey,ang+.4,len*.7,d-1); };
        branch(o.width*.5,o.height*.98,-Math.PI/2,o.height*.12,6);
        ox.globalCompositeOperation='source-over'; }
      x.globalAlpha=1; x.drawImage(o,-w/2,-h*.62,w,h); }
    x.restore();
    /* the interface fails: not glitches, just concepts that stop being enough */
    if(lv>=2){ x.globalAlpha=.85; x.fillStyle='#c8cee0'; x.font=`${Math.round(R*.02)}px monospace`; x.textAlign='left';
      const L=[['HEALTH','not a quantity that applies here'],['DISTANCE','everywhere, equally'],['TIME','2:40, and before, and after'],['OBJECTIVE','—']];
      L.forEach(([k,v],i)=>{ x.fillStyle='rgba(150,156,180,.8)'; x.fillText(k,W*.03,H*.045+i*R*.028); x.fillStyle="rgba(220,226,246,.9)"; x.fillText(v,W*.03+R*.14,H*.045+i*R*.028); }); }
  }
  /* Sudarshana */
  if(CHK.dur>0){ const k=Math.sin(Math.min(1,CHK.t/CHK.dur)*Math.PI), gx=W*.36, gy=H*.42;
    /* every shadow points at him */
    x.globalAlpha=.35*k; x.fillStyle='#000';
    for(let i=0;i<24;i++){ const a=i/24*Math.PI*2, ex=gx+Math.cos(a)*R*1.4, ey=gy+Math.sin(a)*R*1.4, sp=.05;
      x.beginPath(); x.moveTo(gx,gy); x.lineTo(gx+Math.cos(a-sp)*R*1.4,gy+Math.sin(a-sp)*R*1.4); x.lineTo(ex,ey); x.closePath(); x.fill(); }
    /* blades within blades, never touching */
    x.save(); x.translate(gx,gy); x.globalAlpha=.95*k;
    for(let r=0;r<4;r++){ const rr=R*(.05+r*.035), n=6+r*3, rot=CHK.t*(r%2?2.6:-3.1)*(1+r*.2); x.save(); x.rotate(rot);
      for(let i=0;i<n;i++){ const a=i/n*Math.PI*2; x.fillStyle=r%2?'#0c0c12':'#c8cee0'; x.beginPath();
        x.moveTo(Math.cos(a)*rr,Math.sin(a)*rr); x.lineTo(Math.cos(a+.18)*(rr+R*.022),Math.sin(a+.18)*(rr+R*.022)); x.lineTo(Math.cos(a+.32)*rr,Math.sin(a+.32)*rr); x.fill(); }
      x.strokeStyle=r%2?'#c8cee0':'#1a1a24'; x.lineWidth=1.5; x.beginPath(); x.arc(0,0,rr,0,Math.PI*2); x.stroke(); x.restore(); }
    x.restore(); }
  x.globalAlpha=1; }catch(e){} }
/* keep it out of the save, and close it if a cutscene or menu takes over */
{ const was=playCutscene; playCutscene=function(id){ if(VIS.lvl&&!/^end_[EFG]$/.test(id)) vishva(0); return was(id); }; }
/* hide the canvas once nothing is drawing on it */
{ const was=vishva; vishva=function(l){ was(l); try{ elDlg.classList.toggle('absolute',l>=2); }catch(e){} if(!l&&CHK.dur<=0&&VIS.cv) VIS.cv.classList.remove('on'); }; }

/* ── the three endings ────────────────────────────────────────────────── */
const ECAM=(x,y,a,t)=>({t,x,y,a,z:0});
CUTSCENES.end_E=function(){ return { dur:20, letterbox:true, setup(){ S.flipped=false; vishva(1); },
    cam:[ECAM(12.5,9,-Math.PI/2,0),ECAM(12.5,14,Math.PI/2,7),ECAM(28,26,-Math.PI/2,7.05),ECAM(28,22,-Math.PI/2,20)],
    fade:[{t:0,v:0},{t:17,v:0},{t:20,v:1}],
    subs:[{t:.4,who:'narr',text:'You walk down the aisle together, and the rift follows you like a dog that has been told, gently, that it is going outside.'},
      {t:4,who:'chuck',text:'You can’t— that’s not— there’s no third act if you just leave TOGETHER—'},
      {t:6.8,who:'narr',text:'At the doors, every light in Oakhaven comes on at once. The hunger sees them, all of them, and finds it cannot eat a town that is looking back at it.'},
      {t:11.4,who:'god',text:'It is not destroyed. Hunger is not destroyed. It is only no longer fed on purpose. That will have to be enough. It usually is.'},
      {t:15.4,who:S.hero,text:isDean()?'Hey. Sammy. We did a thing.':'We did that. Both of us.'},{t:17.4,who:brother(),text:isDean()?'Yeah. Don’t make it weird.':'Don’t make it weird, Dean.'}],
    events:[{t:6.8,fn:()=>{ vishva(0); enterSector('street',28,26,-Math.PI/2); S.skyOver=null; const st=SECTORS.street; st.ambMul=1.2; for(const e of st.entities) if(e.kind==='enemy') e.dead=true; applyPreset(S.preset); sfx('bell'); S.flash=1; flute(); }}],
    end(){ showEnding('E'); } }; };
CUTSCENES.end_F=function(){ return { dur:18, letterbox:true, setup(){ S.flipped=false; },
    cam:[ECAM(12.5,9,Math.PI/2,0),ECAM(12.5,20,Math.PI/2,6),ECAM(28,30,-Math.PI/2,6.05),ECAM(28,26,-Math.PI/2,18)],
    fade:[{t:0,v:0},{t:15,v:0},{t:18,v:1}],
    subs:[{t:.4,who:'narr',text:'You walk out. The rift does not close. It narrows, to something the width of a door left ajar, and stays that way.'},
      {t:4.6,who:'god',text:'Some of the cost is yours now. Not all. It will sit in the car with you like a third passenger, and some nights it will want the radio.'},
      {t:9,who:'narr',text:'Outside, Monday comes. It is grey, and cold, and it is Monday, which nobody in Oakhaven has seen since September.'},
      {t:13,who:brother(),text:'Is it over?'},{t:14.6,who:S.hero,text:'No. But it’s ours.'}],
    events:[{t:6,fn:()=>{ enterSector('street',28,30,-Math.PI/2); S.skyOver={top:[90,96,104],bot:[160,164,166],cloud:[120,124,128],clouds:1.1,stars:false,moon:false}; applyPreset(S.preset); }}],
    end(){ showEnding('F'); } }; };
CUTSCENES.end_G=function(){ return { dur:18, letterbox:true, setup(){ S.flipped=false; },
    cam:[ECAM(12.5,9,Math.PI/2,0),ECAM(12.5,16,Math.PI/2,6),ECAM(28,34,-Math.PI/2,6.05),ECAM(28,20,-Math.PI/2,18)],
    fade:[{t:0,v:0},{t:15,v:0},{t:18,v:1}],
    subs:[{t:.4,who:'god',text:'Then I will go. Do not thank me. Thanking me would be one more thing I had decided for you.'},
      {t:4.4,who:'narr',text:'The third chair is empty. On it, a dark peacock feather, almost black.'},
      {t:7.6,who:'narr',text:'The Impala’s radio comes on by itself. “KOAK, Sunday, October the fourth,” it says. “Twenty to three.”'},
      {t:11.6,who:brother(),text:'Again?'},{t:13.2,who:S.hero,text:'Again. But this time we know what it’s made of.'},
      {t:15.6,who:'narr',text:'Somewhere very far away, someone is playing a flute, and is not in any hurry at all.'}],
    events:[{t:6,fn:()=>{ enterSector('street',28,34,-Math.PI/2); flute(); }}],
    end(){ showEnding('G'); } }; };
SPEAKERS.god.name='A stranger';
{ const was=say; say=function(who,text,dur,opt={}){ if(who==='god'&&!(opt&&opt.name)) opt=Object.assign({},opt,{name:godName()}); return was(who,text,dur,opt); }; }

/* choices whose words depend on who you are */
{ const was=renderChoices; renderChoices=function(list){ return was(list.map(c=>typeof c.text==='function'?Object.assign({},c,{text:c.text()}):c)); }; }

/* the epilogues */
function godEpilogue(k){ const F=S.flags, T=tg(), L=[], b=bName(), h=hName();
  if(k==='E'){
    L.push('Oakhaven woke up at 6:10 on a Monday, which it had not done since September. Most people didn’t notice. That was the point.');
    L.push('The hunger is still there, under the crossroads, the way a river is still there under ice. Nobody feeds it on purpose any more.');
    L.push(`${NAMES.chuck} was found in the front pew at noon, writing longhand in a notebook. He says it’s a novel. He says it doesn’t have an ending yet, and that he’s fine with that, and nobody believes him.`);
  } else if(k==='F'){
    L.push('The rift at St. Brendan’s narrowed to the width of a door left ajar, and stayed. The parish built a small chapel round it. People leave candles.');
    L.push(`${h} and ${b} carry the rest. Some nights one of them wakes at twenty to three and the other one is already awake.`);
    L.push(`${NAMES.chuck} sat in the third chair until morning, alone. When they came to take the chair away he asked them to leave it.`);
  } else {
    L.push('It was Sunday, October the fourth, again. It was also, somehow, not the same Sunday. The six names were on the plaque at the mill. Marla had a new ledger.');
    L.push(`${h} and ${b} drove out at 2:40 like they always do. This time they knew what the fog was made of, and said so, out loud, to each other, all the way to the town line.`);
    L.push('Nobody has seen the stranger since. Every so often, someone in Oakhaven finds a dark peacock feather, almost black, where one cannot possibly have come from.');
  }
  if(F.tg_relied) L.push('He cut one thread for them, because they asked. They cut the rest themselves.');
  else if(F.tg_won_own||F.tg_won_love||F.tg_won_town) L.push('When she came for them at the end, they did not need anyone to cut them loose. He noticed. It pleased him more than anything else that night.');
  if(T.proofs&&T.proofs.length>=3) L.push('They argued with God using their own case notes, and won the argument. It is in the file.');
  if((T.misses||0)>=2) L.push('They looked at the whole of it and still got things wrong, twice. He showed them again, without impatience. That is also in the file.');
  L.push('The dead stayed dead. Ray Hollis, Lyle Brandt, Emeka and Tunde Okafor, Pete Lindqvist and Mo Haddad. No form of God undid that, and none pretended to.');
  L.push('Somewhere, by a river, a man who once watched his own people destroy each other is playing a flute, and does not pretend that didn’t happen either.');
  return {kicker:'Ending '+k,title:k==='E'?'Liberation':k==='F'?'The Equilibrium':'The Unfinished Sunday',lines:L};
}

/* phase titles */
function phaseCard(n){ const T=tg(); T.phase=n; if(n===1) S.flags.tg_seen=true;
  const P={1:['Phase I','The Stranger'],2:['Phase II','The Unmaker'],3:['Phase III','The Absolute'],4:['Phase IV','The Unchosen']}[n];
  if(P) try{ showCard(P[0],P[1],'',{during:true}); }catch(e){} }
/* Māyā: the blackened, silver-threaded words she put in your mouth stay on screen, dead */
let LAST_LURES=[];
{ const was=finishSpell; finishSpell=function(){ LAST_LURES=ENTH.to.slice(); return was(); }; }
{ const was=showNode; showNode=function(n){ was(n); const nd=n&&dlg.tree&&dlg.tree.nodes[n]; if(!nd||!nd.maya) return;
    for(const t of LAST_LURES){ const b=document.createElement('button'); b.className='c maya'; b.disabled=true; b.textContent=t; b.dataset.k='·'; elCh.appendChild(b); } }; }
/* Sudarshana: a black-silver ring of blades within blades; the colour drains, every shadow points at him */
const CHK={t:0,dur:0};
function chakra(sec){ CHK.t=0; CHK.dur=sec; S.flags.tg_chakra=(S.flags.tg_chakra||0)+1; sfx('riteEnd');
  try{ const w=document.getElementById('world'); if(w&&w.style){ w.style.transition='filter .4s'; w.style.filter='grayscale(1) contrast(1.2) brightness(.8)'; } }catch(e){} }
function chakraTick(dt){ if(CHK.dur<=0) return; CHK.t+=dt; if(CHK.t>=CHK.dur){ CHK.dur=0; try{ const w=document.getElementById('world'); if(w&&w.style) w.style.filter=''; }catch(e){} if(!VIS.lvl&&VIS.cv) VIS.cv.classList.remove('on'); } }
