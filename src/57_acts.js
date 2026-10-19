/* ═══ Acts III and IV ═══════════════════════════════════════════════════════
   Engine-facing helpers first. The story content for the fold, the cathedral
   and the endings builds on these. */

/* who a freed host was, for the epilogue */
const FREE_NAMES = {mechanic:'Hank Ruiz', rainwoman:'Dolores', logger:'a logger from the north road', worker:'a mill hand from line two'};

/* the HUD can lie when dread is high */
function objTitle(o){ if(S.lieObj>0) return S.flags.chuck_met?'Kill your brother':'Stop'; return o.title; }

/* In the fold, a door you've used before may not open onto the same room. */
function doorRedirect(d){
  if(!d) return d;
  if(d.to==='pawn'&&S.act>=3&&S.flags.cas_met&&!S.flags.lily_done) return {...d, to:'hollis', x:3, y:9.6, a:-Math.PI/2};
  if(d.to==='church'&&S.flags.cas_open) return {...d, to:'cathedral', x:12.5, y:31.6, a:-Math.PI/2};
  return d;
}

/* things you can look at closely */
SPR.paper = PICK_ART.page;
const READS = {};
function readThing(e){
  const r=READS[e.read]; S.flags['read_'+e.read]=true;
  openMenu(e.readName||'You look closer', typeof r==='function'?r():(r||'Nothing you can make sense of.'), [{text:'Step back'}]);
  if(e.onRead) e.onRead(e);
}

/* husks: the townspeople the Void got to first */
function lookedAt(e,min=.8){ const dx=e.x-S.px, dy=e.y-S.py, l=Math.hypot(dx,dy)||1; return (dx/l)*S.dirX+(dy/l)*S.dirY>min; }
function torchBurn(e,dt,d,s){
  if(!(S.torchOn&&S.battery>0)||d>7.5||!lookedAt(e,.94)||!los(s,S.px,S.py,e.x,e.y)) return;
  e.hp-=16*dt; e.hurtT=Math.max(e.hurtT||0,.06); if(Math.random()<dt*18) spawnParts(e.x,e.y,.9+Math.random()*.6,1,PCOL.smoke,{up:1.2});
  if(Math.random()<dt*3) sfx('flesh');
  if(e.hp<=0) killEnt(e,'light');
}
function updateHusk(e,dt,s,d){
  torchBurn(e,dt,d,s); if(e.dead) return true;
  if(e.stationary){
    e.face=Math.atan2(S.py-e.y,S.px-e.x);
    e.cd=(e.cd||0)-dt;
    meleeAttack(e,d,dt,1.3);
    return true;
  }
  if(e.stun>0){ e.stun-=dt; e.moving=false; return true; }
  /* it does not move while you are looking at it */
  const watched=!S.cut&&d<16&&lookedAt(e)&&los(s,S.px,S.py,e.x,e.y);
  e.face=Math.atan2(S.py-e.y,S.px-e.x);
  if(watched&&d>1.5){ e.moving=false; return true; }
  if(e.state!=='hunt'&&(d<e.sense||(S.dread||0)>.5)) e.state='hunt';
  if(e.state==='hunt'){
    if(d>e.reach*.9){ const ox=e.x, oy=e.y; stepTo(s,e,S.px,S.py,watched?e.speed:e.speed*1.9,dt);
      const mv=Math.hypot(e.x-ox,e.y-oy); e.moving=mv>.001; e.animT=(e.animT||0)+mv*2.4;
      if(!watched&&e.moving&&Math.random()<dt*1.2) sfx('step'); }
    e.cd=(e.cd||0)-dt;
    meleeAttack(e,d,dt,1.1);
  }
  return true;
}
function huskHit(e,src){
  if(['revolver','shotgun','companion'].includes(src)&&!S.flags.hint_light){
    S.flags.hint_light=true;
    say(HEROES[S.hero].brother,'Bullets aren’t doing anything! The light — put the torch on it!',3.2,{now:true});
  }
}
const HUSK_DETAILS=['It had a wedding ring on.','Its sneakers were double-knotted, the way a parent ties them.',
  'There was a name tag on the vest. LYLE.','It was humming. You knew the song.','It stopped moving the way people fall asleep in cars.'];
function huskDied(e,how){
  e.dead=true; S.kills.husk=(S.kills.husk||0)+1;
  spawnParts(e.x,e.y,.9,26,PCOL.smoke,{up:1.8}); spawnParts(e.x,e.y,.8,10,PCOL.blood); sfx('ghost');
  if(!e.m) say('narr',HUSK_DETAILS[(S.kills.husk-1)%HUSK_DETAILS.length],2.8);
  S.special=Math.min(100,S.special+14);
}

/* ── the case file, Acts III and IV ─────────────────────────────────────── */
Object.assign(NOTES,{
  ledger14:   ['Fan fourteen', 'Seven requests in Ray Hollis’s square capitals, March to September. Each stamped DEFERRED — CAPEX REVIEW. The last one has no form number. It just says PLEASE.'],
  ledgers:    ['The company ledgers', 'Forty years of the mill in green binders. Fan #14: deferred, deferred, deferred. May: “my daughter has a cough.” Deferred.'],
  sam_blood:  ['A vial at the Velvet Hour', 'Juno called it “what you’re for.” It tasted like a battery and a church. For one minute, you were enough.'],
  fold:       ['The fold', 'The sky tore along a seam nobody knew was there. Behind it is not dark. Behind it is something paying attention. The streets don’t hold their shape.'],
  castiel:    ['Castiel', 'Fell out of the tear into the motel lot. “I am not afraid that God abandoned us. I am afraid He ran.” Light hurts what’s in the street; bullets only make it angry.'],
  lily:       ['Lily Hollis', 'Nine. Ray’s daughter. The dust came home on his coat. Dr. Halvorsen wrote pneumonia. Father Alistair sat with her, and with Ray, the night before. “He always tells the truth.”'],
  alistair:   ['Father Alistair', 'Thinned the veil, on purpose, out of mercy. “I’m turning off a light in a room where everyone has been screaming for four billion years.” It finishes at twenty to three.'],
  chuck:      ['Chuck Shurley', 'c.shurley. Writer. Pointed something hungry at a town that was already starving to see what we’d do. The rift closes if one brother kills the other. He called it a finale.'],
  reader:     ['(not in your handwriting)', 'you keep opening this file like it will tell you something. it is not a record. it is a script. turn the page.'],
});
NOTE_FLAGS.push(['read_ledger14','ledger14'],['read_ledgers','ledgers'],['sam_blood','sam_blood'],['cas_met','castiel'],
  ['lily_done','lily'],['alistair_met','alistair'],['chuck_met','chuck']);
PEOPLE.push(
  {flag:'cas_met',  look:'castiel', name:'Castiel',        line:'Angel. Fell out of the tear. Grieving causality.'},
  {flag:'alistair_met',look:()=>S.flags.alistair_killed?'alistair_void':'alistair',name:'Father Alistair',
   line:()=>S.flags.alistair_killed?'Seventy. Sincere. We killed him in his own church.':'Seventy. Sincere. Hard to answer.'},
  {flag:'chuck_met',look:'chuck',   name:'Chuck Shurley',  line:'“Sometimes it’s just content.”'});
/* the Act IV case file: what the writer had planned for you */
function beatsText(){
  const b=['Cold open: two brothers, a dead town, rain.',
    S.flags.delia_killed?'Beat: kill the teacher in the bus shelter. (They did!)':'Beat: free the teacher in the bus shelter. (Sweet. Keep.)',
    S.flags.dean_drank?'Beat: the drink. (Called it.)':null, (S.flags.sam_blood||S.flags.sam_blood2)?'Beat: Sam’s vial. (Called it.)':null,
    S.flags.kevin_used?'Beat: use the prophet. (Cried.)':'Beat: the prophet sleeps. (Boring. Cut?)',
    'Finale: brother kills brother at the altar. Twenty to three. (Non-negotiable.)'];
  return b.filter(Boolean).join(' · ');
}

/* ── a queue of things that happen a little later ───────────────────────── */
S.laterQ=[];
function later(t,fn){ S.laterQ.push({at:S.time+t,fn}); }
function runLater(){ if(!S.laterQ.length) return; const now=S.time, due=S.laterQ.filter(l=>l.at<=now);
  if(!due.length) return; S.laterQ=S.laterQ.filter(l=>l.at>now); for(const l of due){ try{ l.fn(); }catch(e){ console.error(e); } } }

/* ── dread ──────────────────────────────────────────────────────────────── */
/* A hidden tally: darkness, the things in the street, and being alone push it
   up; light, people and your brother bring it down. It never kills you. It
   changes what you can trust: the whispers know what you did, the footsteps
   are behind you, your brother is somewhere he isn't, and the HUD lies. */
const SAFE_ROOMS=new Set(['motel','library']);
function brother(){ return HEROES[S.hero].brother; }
function whisperPool(){
  const p=['You could stop. Nobody is keeping score.','It’s warmer if you stop moving.','They’re counting you too.',
    'Turn around. No. The other way.','You already know how this ends. You read ahead.','Nobody would blame you. Nobody would know.'];
  if(S.flags.delia_killed) p.push('She felt the knife. She was awake for it.','Delia’s class still has her name on the door.');
  if(S.flags.delia_done&&!S.flags.delia_killed) p.push('Delia won’t remember your face. That’s how mercy works.');
  if(S.flags.kevin_used) p.push('Read faster.','He would have read for you forever. You let him.');
  if(S.flags.kevin_rested) p.push('All that light, and you let him sleep.');
  if(S.flags.dean_drank) p.push('One more. It went down like a closing door.');
  if(S.flags.sam_blood) p.push('You were enough, for one minute. Remember?');
  if(S.flags.lily_waiting) p.push('She’s still facing the wall. She’ll face it forever. You said she could.');
  if(S.flags.alistair_killed) p.push('He held your hand too, you know. In the end.');
  if(isDean()) p.push('Dad would’ve done it faster.','Sammy leaves. Sooner or later, Sammy always leaves.');
  else p.push('Mom burned because of what’s in you.','Dean has done the maths on you. You came out behind the car.');
  return p;
}
const FALSE_LINES={dean:['Sammy. Come here. Away from the light.','It’s fine. Put the torch down. I’ve got you.','Don’t look behind you. Just keep walking.'],
                   sam:['Dean, stop. Let it happen. It doesn’t hurt.','I can hear Mom. Dean, she’s in the walls.','Put the gun down. I’m right here.']};
function dreadEffect(){
  const d=S.dread, r=Math.random(), b=brother(), outdoor=S.sector.outdoor;
  if(d>.62&&r<.22){ S.lieHP=2.4; S.lieObj=S.flags.chuck_met?2.2:0; return; }                  // the HUD lies
  if(d>.5&&r<.42&&outdoor&&S.act>=3){ wrongFigure(); return; }                                  // your brother, far away
  if(d>.42&&r<.6&&COMP&&!COMP.hidden){ const L=FALSE_LINES[b]; say(b,L[(Math.random()*L.length)|0],2.6,{now:true});
    later(3.1,()=>say(b,b==='dean'?'Sam? I didn’t say anything. I didn’t say anything.':'Dean? That wasn’t me. I didn’t say that.',3)); return; }
  if(d>.3&&r<.78){ sfx('step'); later(.42,()=>sfx('step')); later(.86,()=>sfx('step')); later(1.2,()=>{ S.glitchA=.35; }); return; }
  const P=whisperPool(); sfx('whisper'); say('whisper',P[(Math.random()*P.length)|0],3.2,{now:true});
}
function wrongFigure(){
  const s=S.sector, side=Math.random()<.5?-1:1, a=S.angle+side*(.38+Math.random()*.2), dist=10+Math.random()*3;
  const x=S.px+Math.cos(a)*dist, y=S.py+Math.sin(a)*dist;
  if(hits(s,x,y,.3)||!los(s,S.px,S.py,x,y)) return;
  s.entities.push(char_(brother()==='dean'?'wrong_dean':'wrong_sam',x,y,{kind:'wrong',h:COMP?COMP.h:1.9,face:a,born:S.time}));
}
function updateWrong(dt){
  for(const e of S.sector.entities){ if(e.kind!=='wrong'||e.dead) continue;
    if(lookedAt(e,.985)||S.time-e.born>6){ e.dead=true;
      if(lookedAt(e,.985)&&COMP&&!COMP.hidden){ sfx('whisper'); later(.8,()=>say(brother(),'What? What are you looking at?',2.4)); } } }
}
function updateDread(dt){
  S.lieHP=Math.max(0,(S.lieHP||0)-dt); S.lieObj=Math.max(0,(S.lieObj||0)-dt); S.glitchA=Math.max(0,(S.glitchA||0)-dt*1.4);
  if(S.act<2){ S.dread=0; return; }
  const s=S.sector, light=lightAt(s,S.px,S.py)*S.light.exp+(S.torchOn&&S.battery>0?.25:0);
  let k=({2:.005,3:.014,4:.019}[S.act]||0)*Math.max(0,1.3-light);
  for(const e of s.entities) if(e.etype==='eldritch'&&!e.dead&&Math.hypot(e.x-S.px,e.y-S.py)<6){ k+=.03; break; }
  if(SAFE_ROOMS.has(s.id)) k=-.06;
  if(COMP&&!COMP.hidden&&Math.hypot(COMP.x-S.px,COMP.y-S.py)<2.2) k-=.003;
  S.dread=clamp((S.dread||0)+k*dt,0,1);
  if(S.dread>.6){ S.heartT=(S.heartT||0)-dt; if(S.heartT<=0){ S.heartT=1.25-S.dread*.5; sfx('heart'); } }
  S.dreadT=(S.dreadT??16)-dt;
  if(S.dreadT<=0&&S.dread>.12&&!SUBQ.length&&!subCur){ S.dreadT=12+Math.random()*18*(1.25-S.dread); dreadEffect(); }
}

/* ── Act I/II additions ─────────────────────────────────────────────────── */
Object.assign(READS,{
  ledger14:"The requisition book is still open on the office desk, weighted with a coffee mug.\n\nFan fourteen, line three. Seven requests in Ray Hollis’s square capitals, March to September. Every one stamped DEFERRED — CAPEX REVIEW in purple ink.\n\nThe last request has no form number. It just says: PLEASE.",
  ledgers:"Forty years of Oakhaven Mill & Timber in green cloth binders. The last one is thin.\n\nUnder Capital requests — deferred, in somebody’s tidy hand: Ventilation fan #14, line three. Requested R. Hollis, March. Deferred. Requested R. Hollis, April. Deferred. Requested R. Hollis, May, with a note in the margin: my daughter has a cough.\n\nDeferred.",
  coat:"A man’s canvas work coat, hung by the door the way you hang a coat you mean to put on in the morning.\n\nThe shoulders are grey with fine dust. When you touch it the dust doesn’t fall; it has been there long enough to become the cloth. The front is worn smooth at child height, where someone small hugged it every night.",
  certificate:"A county death certificate.\n\nLILY ANNE HOLLIS, age 9. Cause of death: pneumonia. Certifying physician: M. Halvorsen, MD.\n\nIn the margin, in pencil, in a different hand, very small: it was the coat.",
  drawings:"Crayon drawings, taped up in a row. A house. A man in a yellow hat beside a long machine with teeth. A girl in a bed with a blue cloud over her mouth.\n\nThe last one is newer. Two men and a long black car, parked under a dead streetlight. The taller one has hair to his shoulders.\n\nIt is dated October 3rd. You got here last night.",
  inhaler:"A child’s inhaler, the blue kind. Empty.\n\nSomeone has written LILY on it in pink nail polish and drawn a small, careful horse.",
});
SECTORS.mill.entities.push({kind:'prop',m:'counter',x:26,y:13,r:.5,h:.9},{kind:'prop',m:'paper',x:26,y:12.8,r:.2,h:.35,z:.55,read:'ledger14',readName:'A requisition ledger'});
DIALOGUE.juno.nodes.j_vial={speaker:'Juno — the Velvet Hour',
  text:"She follows your eyes to the vial: thick, dark, catching the red light like oil.\n\n\"That one isn’t for sale. That one is from management, for a particular kind of man. The kind who has never once in his life been enough.\" She sets it on the bar between you. \"It doesn’t numb anything, sugar. It does the opposite. For a minute, you’re sufficient.\"",
  choices:[D_("[Drink it.]",'j_vial2',{flag:'sam_blood'}),D_("[Push it back across the bar.]",'j1',{align:['h',1]})]};
DIALOGUE.juno.nodes.j_vial2={speaker:'—', port:null,
  text:"It tastes like a battery and a church. Every light in the room gets sharper, and then every sound, and then you can hear the people at the tables thinking, and none of them are thinking anything.\n\nFor one minute you are enough. You are strong enough that nobody has to be left behind.\n\nThen it’s gone, and you are exactly as much as you were, and you know precisely how long a minute is.",
  choices:[D_("[Set the glass down.]",'j1',{now:()=>{ S.special=100; heal(25); }})]};
{ const kr=DIALOGUE.kevin.nodes.k_rest;
  kr.text="Detox is a long night. The fever comes at hour two. You go through a med kit’s worth of saline, and when the light under his eyelids won’t stop you give him holy water, a capful at a time, and watch it flinch.\n\nThen he sleeps for eleven hours on a mattress in a house full of people sleeping for the wrong reasons, and nothing comes through the door, because you are sitting on the stairs in front of it.\n\nHe wakes up and asks for eggs. His eyes are just eyes.";
  const f=kr.choices[0].fx, was=f.now;
  f.now=()=>{ if(S.meds>0) S.meds--; if(S.ammo.holywater>0) S.ammo.holywater--; was(); toast('Used a med kit and holy water on the detox'); };
}
DIALOGUE.sarah={ port:'sarah', start:()=>S.act>=4?'s4':S.flags.sarah_met?'s9':'s0', nodes:{
  s0:{speaker:'Sarah Lindqvist — librarian',
    text:"The library smells like radiators and paper. The woman behind the returns desk is stamping books that nobody has checked out, one after another, because the stamp is something to do with her hands.\n\n\"We close at nine. It’s three in the morning. I’m aware.\" She doesn’t stop stamping. \"You’re the federal agents. My brother was Pete Lindqvist. Line three, the green chain. If you’re here about the mill, ask me something real.\"",
    choices:[D_("What happened to Pete?",'s1'),D_("The mill kept records?",'s2')]},
  s1:{speaker:'Sarah Lindqvist — librarian',
    text:"\"He hated that job. Went back every night anyway, after it closed. Said he could hear the chain running.\" The stamp comes down. \"Third Thursday in September he walked into the river in his work boots. They said he was drunk. Pete didn’t drink. Pete said the mill drank enough for everyone.\"",
    choices:[D_("I’m sorry.",'s2'),D_("Did he say anything about a vent?",'s2')]},
  s2:{speaker:'Sarah Lindqvist — librarian',
    text:"\"The company ledgers are in the back, on the cart. Forty years. Nobody’s asked for them since they were donated, which was the day after the buyout, which tells you somebody wanted them out of the building.\n\nRead fan fourteen. Then come and tell me it was a curse.\"",
    choices:[D_("[Leave her to her stamping.]",null,{flag:'sarah_met'})]},
  s9:{speaker:'Sarah Lindqvist — librarian',
    text:()=>S.act>=3?"\"The books on the top shelves have started writing themselves. I checked. It’s just names. Over and over. Everyone in town.\" She keeps stamping. \"Mine’s on page forty.\"":"\"Read the ledgers. Then tell me the town just got unlucky.\"",
    choices:[D_("[Leave.]",null)]},
  s4:{speaker:'Sarah Lindqvist — librarian',
    text:"She has the binders open across three tables and a county survey map pinned flat with staplers.\n\n\"Crossroads ran something under every street in town. The survey calls it drainage. It isn’t drainage. Pete used to say the ground smelled like a gas station at night.\" She traces the lines with a finger that won’t quite stay still. \"It all meets under St. Brendan’s. Every line.\n\nIf you need to burn something, this is where it goes. I hope you don’t need to.\"",
    choices:[D_("[Take the map.]",null,{flag:'oil_map',note:'oilmap'})]},
}};
NOTES.oilmap=['Sarah’s map','Crossroads laid lines under every street; the survey calls it drainage. It meets under St. Brendan’s. Pete said the ground smelled like a gas station at night.'];

/* ── Act III ────────────────────────────────────────────────────────────── */
function foldWorld(stage){
  const st=SECTORS.street, g=st.grid;
  for(let y=1;y<st.H-1;y++) for(let x=1;x<st.W-1;x++){
    const c=g[y][x];
    if((c==='#'||c==='W')&&hash(x*3,y*5)<(stage>=2?.85:.5)) g[y][x]='F';
    if((c==='.'||c===',')&&hash(x*7,y*11)<(stage>=2?.32:.16)) g[y][x]='v';
  }
  st.ambMul=stage>=2?.55:.7;
  for(const e of st.entities) if(e.kind==='car') e.dead=true;      // no traffic in the fold
  S.skyOver={top:[14,2,6],bot:[120,22,24],cloud:[70,12,18],clouds:1.5,stars:false,moon:false};
  applyPreset(S.preset); SKY_DIRTY=true;
}
function spawnHusks(list){
  const st=SECTORS.street;
  for(const [look,x,y] of list){ if(hits(st,x,y,.3)) continue;
    st.entities.push(char_(look,x,y,{kind:'enemy',etype:'eldritch',hp:60,maxHp:60,speed:1.15,dmg:9,reach:.95,sense:9,state:'idle',claws:true,h:1.9})); }
}
function hideTownsfolk(){ for(const e of SECTORS.street.entities) if(e.kind==='walker') e.hidden=true, e.kind='gone'; }
function startAct3(){
  S.act=3; S.actStart=S.time; saveProgress(3);
  if(COMP) COMP.hidden=false;
  playCutscene('fold');
}
CUTSCENES.fold=function(){
  const st=SECTORS.street;
  const cas={kind:'actor',look:'castiel',x:24.5,y:42.4,z:9,r:.3,h:1.85,face:-Math.PI/2,animT:0,hidden:true,lit:1};
  return {
    dur:17, letterbox:true,
    setup(){ if(S.sector!==st) enterSector('street',28,36,-Math.PI/2); hideTownsfolk(); st.entities.push(cas); },
    cam:[{t:0,x:28,y:37,a:-Math.PI/2,z:0},{t:6,x:28,y:36,a:-Math.PI/2,z:-.06},
         {t:9,x:27,y:38.6,a:ang(27,38.6,24.5,42.4),z:0},{t:14,x:26.6,y:39.6,a:ang(26.6,39.6,24.5,42.4),z:.02},
         {t:17,x:26.6,y:39.6,a:ang(26.6,39.6,24.5,42.4),z:0}],
    ascii:[{t:0,v:0},{t:2.6,v:0},{t:3.2,v:.75},{t:4.6,v:.2},{t:6,v:0},{t:9.6,v:0},{t:10.1,v:.5},{t:11,v:0},{t:17,v:0}],
    tick(t){ cas.hidden=t<9.4; cas.z=t<9.4?9:Math.max(0,9-(t-9.4)*22); },
    subs:[{t:.5,who:'narr',text:'At twenty to three, the sky over Oakhaven tears along a seam nobody knew was there.'},
          {t:4,who:'narr',text:'Behind it is not dark. Behind it is something paying attention.'},
          {t:7,who:'narr',text:'The walls go soft. The road remembers it used to be skin.'},
          {t:9.5,who:'narr',text:'And something falls out of the tear, burning, and lands very gently in the motel lot.'},
          {t:13,who:isDean()?'sam':'dean',text:isDean()?'Dean. That’s Cas.':'Sam. Sam, that’s Cas.'},
          {t:15,who:S.hero,text:isDean()?'Of course it is.':'Is he breathing? Do angels breathe?'}],
    events:[{t:2.8,fn:()=>{ sfx('tear'); S.shake=.8; foldWorld(1); }},{t:6.5,fn:()=>sfx('flesh')},
            {t:9.8,fn:()=>{ sfx('thunder'); S.shake=1; spawnParts(24.5,42.4,.2,50,PCOL.flame,{up:2.4,spd:2}); }}],
    end(){
      st.entities=st.entities.filter(e=>e!==cas);
      st.entities.push(char_('castiel',24.5,42.4,{kind:'npc',dialogue:'castiel',name:'Castiel',h:1.85,face:-Math.PI/2,pose:4,lit:.6}));
      spawnHusks([['husk_worker',27,24],['husk_logger',12,23],['husk_teen',40,21],['husk_worker',30,9],['husk_logger',45,24],['husk_teen',18,27]]);
      S.px=26.6; S.py=39.6; S.angle=ang(26.6,39.6,24.5,42.4); S.posZ=0;
      if(COMP){ COMP.hidden=false; COMP.x=28; COMP.y=39; }
      addNote('fold'); addNoteRaw('reader');
      showCard('Act III · The Absentee Landlord','Chapter Seven','The fold');
    },
  };
};
function addNoteRaw(id,title,text){ if(S.notes.some(n=>n.id===id)) return; const N=NOTES[id]||[title,text];
  S.notes.push({id,title:title||N[0],text:text||N[1]}); if(S.running) toast('Case file updated — J'); }

Object.assign(DIALOGUE,{
  castiel:{ port:'castiel', start:'c0', nodes:{
    c0:{speaker:'A man in a trench coat, in the crater',
      text:"He’s lying in a shallow crater in the motel lot. The asphalt around him has gone glassy, as if something very hot landed very gently. His coat is smoking. He is looking up at the tear as though it owes him an explanation.\n\n\"I reached out over this town four times tonight,\" he says, to no one. \"There is something on the other end. It is warm, and it is paying attention, and it is not Him.\"",
      choices:[D_("Cas. You look like hell.",'c1',null,isDean),D_("Cas? Can you stand?",'c1',null,isSam)]},
    c1:{speaker:'Castiel',
      text:"He sits up. Nothing about the movement is human; it is a man-shaped thing remembering how.\n\n\"I have been an instrument of a plan since before your species had a word for plans. I could feel my Father’s attention the way you feel sunlight. Not as a belief. As a temperature.\n\nIt’s gone cold. Not absent. Cold. As if someone left a window open in a room He used to be in.\"",
      choices:[D_("God’s gone. We’ve heard that one.",'c2',null,isDean),D_("Then what’s out there?",'c2')]},
    c2:{speaker:'Castiel',
      text:"\"I am not afraid that God abandoned us.\" He looks at you, and for a second his eyes are full of light that has nowhere to go. \"I am afraid He ran. And I am afraid of what is large enough to make Him run.\n\nThe veil is torn. The streets will not hold their shape. Do not trust a door you have opened before. And do not trust anything that looks like your brother when your brother is behind you.\"",
      choices:[D_("What do we do?",'c3')]},
    c3:{speaker:'Castiel',
      text:"He puts two fingers to your forehead. It is like being struck by a very quiet bell. A rite you never learned is suddenly behind your teeth: Lux Perpetua, the oldest one. Light that needs no source.\n\n\"The things in the street were people. Light hurts them. Bullets only make them angry. They will not move while you watch them, so don’t stop watching them.\n\nThere is a child on Main Street who keeps facing away. Follow her. The dead always know the way back to what killed them.\"",
      choices:[D_("[Go.]",null,{flag:'cas_met',heal:40,now:()=>{ learnRite('lux'); toast('Learned · Lux Perpetua (journal)'); const c=SECTORS.street.entities.find(e=>e.look==='castiel'); if(c){ c.pose=undefined; c.dialogue='castiel_wait'; } }})]},
  }},
  castiel_wait:{ port:'castiel', start:'w0', nodes:{ w0:{speaker:'Castiel',
    text:()=>S.act>=4?"\"Not yet.\"":"\"I am listening to the town. It is very loud, and most of it is asking why.\"",
    choices:[D_("[Leave him.]",null)]} }},
  lily:{ port:'ghost_girl', start:'l0', nodes:{
    l0:{speaker:'The girl in the nightgown',
      text:"Up close she is very small. Nine, maybe. The nightgown has a cartoon horse on it, faded from a hundred washes. Her lips are blue at the edges, the way lips go when the air stops arriving.\n\n\"You found Daddy’s coat.\" She doesn’t blink. She doesn’t need to. \"He hung it there every night so I could hug him when he came in. It was always dusty. It tasted like the mill.\"",
      choices:[D_("What’s your name?",'l1'),D_("[Kneel, so you’re at her height.]",'l1',{align:['h',1]})]},
    l1:{speaker:'Lily Hollis',
      text:"\"Lily. Lily Hollis. I was in fourth grade.\"\n\nShe looks at the inhaler on the nightstand like a toy she outgrew. \"Doctor Halvorsen said pneumonia. Mommy said it was the dust, and then Mommy left, and then Daddy stopped sleeping. He went to the mill at night to yell at the vent. Number fourteen. He said if it had been fixed I would still be here.\n\nHe was right. Nobody wrote that down.\"",
      choices:[D_("Your dad said “fourteen” at the end. He was still trying to fix it.",'l2a',{align:['h',1]},()=>S.flags.ray_named),
               D_("Your dad… we put him down fast. I’m sorry, Lily.",'l2b',null,()=>!S.flags.ray_named),
               D_("What happened to your dad after?",'l2b')]},
    l2a:{speaker:'Lily Hollis',
      text:"Something in her face loosens. Not a smile. The place a smile used to be.\n\n\"He never stopped. Even dead. That’s Daddy.\"\n\nThen, very quietly: \"The priest sat with him the night before. Father Alistair. He held Daddy’s hand and told him it wouldn’t hurt anymore. He told me the same thing. He was telling the truth both times. That’s what’s scary about him. He always tells the truth.\"",
      choices:[D_("Where is he?",'l3')]},
    l2b:{speaker:'Lily Hollis',
      text:"\"The thing in the air ate him. I heard it. It sounds like a straw at the bottom of a cup.\"\n\nShe tilts her head. \"The priest sat with him the night before. Father Alistair. He held Daddy’s hand and told him it wouldn’t hurt anymore. He told me the same thing. He was telling the truth both times. That’s what’s scary about him. He always tells the truth.\"",
      choices:[D_("Where is he?",'l3')]},
    l3:{speaker:'Lily Hollis',
      text:"\"St. Brendan’s. At the end of the cross street, where the road stops being a road.\" She looks past you, at the wall, at something on the other side of it. \"They count us. Everyone who stops feeling is one more unit. Six units. I was the first, and nobody counted me, because I wasn’t on the payroll.\n\nAre you going to make me go away?\"",
      choices:[D_("[The rite.] You can rest now, Lily. I’ll say the words.",'l_rest',{align:['h',2]},isSam),
               D_("[Salt, very gently.] It doesn’t hurt, kid. I promise.",'l_rest',{align:['n',1]},isDean),
               D_("No. Stay, if you want. Nobody gets to decide that for you any more.",'l_stay',{align:['h',1]})]},
    l_rest:{speaker:'—', port:null,
      text:"She closes her eyes before you finish. The nightgown goes first, then the horse, then the blue at her lips. The last thing to leave is the smell of sawdust.\n\nOn the bed, where she was sitting, the blanket still holds a small dent. It does not fill back in.",
      choices:[D_("[…]",null,{flag:'lily_done',now:()=>{ S.flags.lily_rested=true; lilyGone(); }})]},
    l_stay:{speaker:'Lily Hollis',
      text:"\"Okay.\" She sits on the end of the bed, small and patient, the way children wait outside offices. \"I’ll wait. Somebody should wait for the ones who come in last.\"\n\nWhen you look back from the door, she is facing the wall again.",
      choices:[D_("[Leave her be.]",null,{flag:'lily_done',now:()=>{ S.flags.lily_waiting=true; const l=lilyEnt(); if(l){ l.dialogue=undefined; l.face=0; l.x=12.4; l.y=10.3; } }})]},
  }},
  alistair:{ port:'alistair', start:()=>S.flags.alistair_met?'a9':'a0', nodes:{
    a0:{speaker:'Father Alistair',
      text:"The church is the only warm room left in Oakhaven. Candles, real ones, a few hundred of them. The man at the altar rail is lighting another from the stub of the last. He is about seventy, with soft hands and a cardigan over his cassock, and he looks genuinely glad to see you.\n\n\"Hunters. Lily said you’d come. Sit, if you like. The pews are the only things in town that still hold their shape.\"",
      choices:[D_("You opened it. The veil. The fog. All of it.",'a1'),D_("[Draw.] Give me a reason not to.",'a_draw',null,isDean),
               D_("Lily said you sat with Ray Hollis the night he died.",'a1',null,isSam)]},
    a_draw:{speaker:'Father Alistair',
      text:"He doesn’t flinch. He finishes lighting the candle first.\n\n\"You can. It won’t do what you want. I gave the last of myself away some time ago, son. What’s standing here is mostly the courtesy of something that doesn’t know what courtesy is.\"",
      choices:[D_("[Lower it. For now.]",'a1')]},
    a1:{speaker:'Father Alistair',
      text:"\"I sat with Ray for two hours. I held his hand, and I did not tell him one thing that wasn’t true.\" He sets the taper down. \"I’ve sat with six hundred people at the end. Do you know what they all say, right before? Not ‘I’m afraid.’ Not ‘God.’ They say ‘oh.’ Just ‘oh.’ As if they’d finally understood a joke that had been playing their whole life.\"",
      choices:[D_("What joke?",'a2'),D_("Skip to the part where you explain the fog.",'a2')]},
    a2:{speaker:'Father Alistair',
      text:"\"That every one of us is a small animal that woke up. That’s all awareness is: an error that lets a thing know it’s going to end. We built cathedrals to cover the sound of it.\n\nI’m not opening a door for a monster. I’m turning off a light in a room where everyone has been screaming for four billion years. And every one of them will thank me in the last half-second, and none of them will have time to say so.\"",
      choices:[D_("People here have reasons to live. Marla. Delia. Kevin. You don’t get to decide that for them.",'a3s',{align:['h',1]},isSam),
               D_("You know what? I don’t care about the four billion years. I care about the next five minutes.",'a3d',{align:['n',1]},isDean),
               D_("Then why does it feel like being eaten?",'a3')]},
    a3s:{speaker:'Father Alistair',
      text:"\"Marla has worked the night desk for thirty-one years so a company in Delaware could save on day rates. Delia was awake inside a demon for four days. Kevin—\" His voice catches, honestly. \"Kevin read the word of God, and it was a loop.\n\nI’m not deciding anything for them, Sam. I’m the only one in this town who ever asked them.\"",
      choices:[D_("…",'a4')]},
    a3d:{speaker:'Father Alistair',
      text:"\"I know. That’s the only argument you’ve ever had, and it’s a better one than most.\" He smiles, kindly. \"You keep the rock rolling because stopping would mean looking at it. I looked, Dean. I’ve been looking for forty years. It doesn’t get bigger. You just get smaller next to it.\"",
      choices:[D_("…",'a4')]},
    a3:{speaker:'Father Alistair',
      text:"\"Because it is. I didn’t say it was kind. I said it was mercy.\n\nThe thing on the other side doesn’t hate us. It doesn’t have the equipment for hate. It eats despair the way rain fills a hole, and when the hole is full there’s nothing left to hurt. I’m sorry it’s slow. I tried to make the town as quiet as I could first.\"",
      choices:[D_("…",'a4')]},
    a4:{speaker:'Father Alistair',
      text:"He looks past you, to the door, to the fog pressed against the stained glass like a face.\n\n\"It finishes tomorrow, at twenty to three. That’s when the first of them died, and the thing likes anniversaries, the way water likes the lowest place. I’ll be at the altar. I’ll hold your hand too, if you want. I’d consider it an honour.\n\nNow go and have a drink with the man at the bar. He’s been waiting for you since before you were born.\"",
      choices:[D_("One question. Do you believe any of it?",'a5'),D_("[Shoot him.]",'a_shot',{align:['n',1]},isDean),D_("[Leave.]",null,{flag:'alistair_met'})]},
    a5:{speaker:'Father Alistair',
      text:"He thinks about it for a long time, which is the worst thing he could have done.\n\n\"Every word,\" he says. \"That’s why I’m so tired.\"",
      choices:[D_("[Leave.]",null,{flag:'alistair_met',now:()=>{ S.flags.alistair_heard=true; }})]},
    a_shot:{speaker:'—', port:null,
      text:"The bullet goes through him and into the plaster saint behind him, which begins, very slowly, to bleed.\n\nHe sighs. \"I did say.\" When you blink he is still there, lighting the next candle, and the hole in his cardigan is closing like a mouth.",
      choices:[D_("[Leave.]",null,{flag:'alistair_met',now:()=>sfx('revolver')})]},
    a9:{speaker:'Father Alistair', text:"\"Go on. He’s waiting. I’ll be here. I’m always here.\"", choices:[D_("[Leave.]",null)]},
  }},
  chuck:{ port:'chuck', start:'h0', nodes:{
    h0:{speaker:'A man at the bar',
      text:"It’s warm in here. The lights work. The jukebox is playing classic rock, and the bartender is wiping the same glass in a perfect four-second loop, over and over, his face pleasantly blank.\n\nThe man at the bar has a beard, a bathrobe over his flannel, and a craft beer. He waves you over like an old friend at a reunion he organised.\n\n\"Guys! Hey. Sit, sit. Dean, how’s the car? Still running? I love that car. I wrote that car.\"",
      choices:[D_("Who the hell are you?",'h1'),D_("c.shurley. The terminal.",'h1',null,isSam)]},
    h1:{speaker:'Chuck',
      text:"\"Chuck. Chuck Shurley. Writer, mostly. Some directing.\" A long sip. \"You know how a show gets in its later seasons? Same beats. Monster, brother angst, monster, sacrifice, monster. The fans start to notice. I start to notice.\n\nSo I tried something. A town nobody would miss. A sad little Oregon mill town with a good bleak palette. And then I introduced a tentacle. One note. Third act needed a lift.\"",
      choices:[D_("You did this. The mill. The six men. Lily.",'h2'),D_("The thing in the fog is yours?",'h2')]},
    h2:{speaker:'Chuck',
      text:()=>"\"No, no, no. Okay, technically. Look, I didn’t write the asbestos. I didn’t write the buyout. That’s free will, baby, that’s all you guys. I just pointed something hungry at a place that was already starving and watched what you’d do.\n\nAnd you’ve been great! Seriously. "+(S.flags.delia_killed?"The teacher in the bus shelter? The knife? I did not see that coming. Chef’s kiss.":"The teacher in the bus shelter? You let her go. I had a whole thing planned. Rewrote it. Loved it.")+" "+(S.flags.kevin_used?"The kid with the tablet. ‘You drafted me.’ I cried.":"The kid with the tablet, you let him sleep. Bold. Slow, but bold.")+"\n\nYou’re all so hungry for it to mean something. It’s the funniest thing about your species, honestly. Sometimes it’s just content.\"",
      choices:[D_("How do we close it?",'h3')]},
    h3:{speaker:'Chuck',
      text:"He sets the beer down. For the first time, he looks like a man pitching to a room.\n\n\"Okay. So. The rift’s anchored to the strongest bond in town. Which is you two. It closes with a blood sacrifice. One brother kills the other at the altar. Tomorrow, twenty to three.\" He spreads his hands. \"Brother against brother, in a church, at the end of the world. It’s a finale. It writes itself. I mean, I wrote it. But you know what I mean.\"",
      choices:[D_("[Hit him.]",'h_hit',{align:['n',1]},isDean),D_("No.",'h4',null,isSam),D_("Go to hell, Chuck.",'h4')]},
    h_hit:{speaker:'—', port:null,
      text:"Your fist goes through where his face is and connects with nothing, and the momentum puts you into the bar. The bartender keeps wiping the glass.\n\nChuck laughs, delighted. \"See? That. That’s why I keep you.\"",
      choices:[D_("…",'h4')]},
    h4:{speaker:'Chuck',
      text:"\"You’ll do it,\" he says, gently, the way Alistair says everything. \"Or you won’t, and the town goes, and that’s a good episode too. Honestly, I’m fine either way. I just want to see it.\n\nOh, and guys?\" He lifts the bottle in a small toast. \"It’s not a tragedy if nobody’s watching. Lucky for you, somebody always is.\"\n\nThen the stool is empty, the beer is full again, and the bartender is still wiping the glass.",
      choices:[D_("[Leave.]",null,{flag:'chuck_met',then:()=>{ const c=SECTORS.lounge.entities.find(e=>e.look==='chuck'); if(c) c.dead=true; sfx('bell'); }})]},
  }},
});
function lilyEnt(){ return SECTORS.hollis.entities.find(e=>e.lily&&!e.dead); }
function lilyGone(){ const l=lilyEnt(); if(l){ l.dead=true; spawnParts(l.x,l.y,.8,30,PCOL.ecto,{up:1.4}); sfx('riteEnd'); } }
/* Three things looked at in the Hollis house, and she is standing behind you. */
function hollisRead(){
  const n=['coat','certificate','drawings','inhaler'].filter(k=>S.flags['read_'+k]).length;
  if(n<3||S.flags.lily_turned) return;
  S.flags.lily_turned=true;
  dlg.after.push(()=>{ const l=lilyEnt(); if(!l) return;
    const bx=S.px-S.dirX*1.1, by=S.py-S.dirY*1.1, s=SECTORS.hollis;
    if(!hits(s,bx,by,.25)){ l.x=bx; l.y=by; } l.face=Math.atan2(S.py-l.y,S.px-l.x); l.dialogue='lily'; l.name='the girl in the nightgown';
    sfx('ghost'); S.glitchA=.5; S.shake=.3; say('narr','The room is colder behind you. Much colder.',3,{now:true}); });
}
for(const e of SECTORS.hollis.entities) if(e.read) e.onRead=hollisRead;
/* The Velvet Hour becomes Shurley’s: warm, lit, and wrong. */
function makeShurleys(){
  const s=SECTORS.lounge; if(s.shurleys) return; s.shurleys=true;
  s.name='Shurley’s'; for(let y=0;y<s.H;y++) for(let x=0;x<s.W;x++) if(s.grid[y][x]==='V') s.grid[y][x]='W';
  s.entities=s.entities.filter(e=>e.look!=='juno'&&!e.talkOnly);
  s.entities.push(char_('chuck',7.5,6.1,{kind:'npc',dialogue:'chuck',name:'the man at the bar',face:-Math.PI/2,h:1.8}),
    char_('worker',7.5,3,{kind:'npc',name:'',face:Math.PI/2,h:1.85,pose:3}));
  s.lights=[{x:7.5,y:3,p:2.6,f:.12},{x:3,y:8,p:1.8,f:.2},{x:13,y:8,p:1.8,f:.2}];
  s.ambBase=.35; applyPreset(S.preset);
  SECTORS.street.doors['40,15'].need=null;
}
CONVOS.push(
  {id:'fold_in', when:()=>S.sector.id==='street'&&S.flags.cas_met&&!S.flags.lily_done, lines:()=>[
    [brother(),isDean()?'Dean. The walls. Don’t touch the walls.':'Sam. The walls are warm. Why are the walls warm?'],
    [S.hero,isDean()?'Wasn’t planning on it.':'Don’t touch them. Just keep the light up.'],
    [brother(),'There she is. By Earl’s.']]},
  {id:'after_lily', when:()=>S.sector.id==='street'&&S.flags.lily_done&&!S.flags.alistair_met, lines:()=>S.flags.lily_waiting?[
    ['sam','You told a dead nine-year-old she could keep waiting.'],['dean','I told her nobody gets to decide for her anymore.'],
    ['sam','…Yeah. Okay. Yeah.']]:[
    ['dean','She hugged his coat every night. Every night, Sam. And it was full of the thing that killed her.'],
    ['sam','Seven forms. He asked seven times.'],['dean','Church. Now. Before I find somebody in Delaware.']]},
  {id:'after_priest', when:()=>S.sector.id==='street'&&S.flags.alistair_met&&!S.flags.chuck_seen, lines:[
    ['dean','He’s not wrong about the room. That’s the problem.'],
    ['sam','He’s not wrong about the screaming. He’s wrong about what you do with it.'],
    ['dean','Which is?'],['sam','You answer it.'],
    ['dean','…The Velvet Hour’s lit up. Music. That’s new.']]},
  {id:'ipa', when:()=>S.sector.id==='street'&&S.flags.chuck_met&&!S.flags.act4, lines:[
    ['sam','He was drinking a craft beer.'],['dean','IPA. Guy runs the universe and drinks an IPA.'],['sam','Dean.'],['dean','I know.'],
    ['sam','Everything. Mom. Jess. Every single—'],['dean','I know.'],['sam','So what changes?'],
    ['dean','Nothing changes. That’s what I’ve been trying to tell you since you were twelve. There was never anybody at the wheel. Turns out there’s a guy, and he’s worse than nobody, which honestly I did not have on the card.'],
    ['dean','Doesn’t change the job. There’s a town out there with people in it and a thing eating them, and I’ve got shells.'],
    ['sam','That’s the most optimistic thing you’ve ever said.'],['dean','Don’t tell anybody.']]},
);

/* ── Act IV ─────────────────────────────────────────────────────────────── */
function endAct3(){
  showCard('End of Act III','Somebody approved the pitch','',{dur:5.5});
  setupAct4();
  showCard('Act IV · Breaking the Script','Chapter Eleven','Gather what’s left',{dur:6});
}
function setupAct4(){
  const F=S.flags; if(F.act4) return; F.act4=true; S.act=4; S.actStart=S.time; saveProgress(4);
  foldWorld(2); hideTownsfolk();
  spawnHusks([['husk_worker',26,13],['husk_teen',35,22.6],['husk_logger',8,24],['husk_worker',44,22]]);
  const st=SECTORS.street, add=e=>st.entities.push(e);
  add(char_('sheriff',30.6,19.6,{kind:'npc',dialogue:'sheriff_iv',name:'Sheriff Ames',h:1.85,pose:4}));
  add(char_('doctor',34.2,26.6,{kind:'npc',dialogue:'doctor_iv',name:'Dr. Halvorsen',h:1.85}));
  const car=st.entities.find(e=>e.name==='Impala');
  add(char_('crowley',(car?car.x:29)+1.55,(car?car.y:40)-1.4,{kind:'npc',dialogue:'crowley_iv',name:'Crowley',h:1.8}));
  if(F.delia_done&&!F.delia_killed) add(char_('delia',50.4,24.4,{kind:'npc',dialogue:'delia_iv',name:'Delia Park',h:1.78,face:Math.PI}));
  const cas=st.entities.find(e=>e.look==='castiel'&&!e.dead);
  if(cas){ cas.x=50.4; cas.y=20.6; cas.dialogue='castiel_iv'; cas.pose=undefined; }
  else add(char_('castiel',50.4,20.6,{kind:'npc',dialogue:'castiel_iv',name:'Castiel',h:1.85}));
  const k=kevinEnt(); if(k) k.dialogue='kevin_iv';
  /* the cathedral's cast */
  const C=SECTORS.cathedral;
  C.entities.push(char_('alistair',12.5,11.6,{kind:'npc',dialogue:'alistair_end',name:'Father Alistair',h:1.78,pose:4,alistair:true}),
    {kind:'prop',m:'pew',x:13.6,y:5.6,r:.55,h:.75},
    char_('chuck',13.6,4.9,{kind:'npc',dialogue:'chuck_end',name:'Chuck',h:1.8,chuck:true}),
    {kind:'prop',m:'popcorn',x:14.5,y:5.5,r:.1,h:.38,z:.3});
  if(F.lily_waiting){ C.entities.push(char_('ghost_girl',3.5,10.4,{kind:'npc',name:'',h:1.45,face:Math.PI/2,lit:1,lilyLight:true}));
    C.lights.push({x:3.5,y:10.4,p:2,f:.2}); pack(C); }
  addNoteRaw('beats','Episode notes (not yours)',beatsText());
}
Object.assign(DIALOGUE,{
  castiel_iv:{ port:'castiel', start:'c0', nodes:{
    c0:{speaker:'Castiel',
      text:"He’s standing at the church doors with his palm flat against the wood. The wood is breathing.\n\n\"When I open this, it will cost me most of what is left of me. I can do it once.\" He doesn’t look away from the door. \"Take what the town offers you first. People have things to give you. Let them. It is the only thing I have learned here that I did not already know.\"",
      choices:[D_("Open it, Cas.",'c1'),D_("Not yet.",null)]},
    c1:{speaker:'—', port:null,
      text:"He leans into the door like a man pushing a car out of snow. Light comes off him in sheets, then in strips, then hardly at all.\n\n\"Go,\" he says. \"I will hold it as long as I am anything.\"\n\nThe doors open onto St. Brendan’s, and St. Brendan’s is breathing.",
      choices:[D_("[Go in.]",null,{flag:'cas_open',now:()=>{ const c=SECTORS.street.entities.find(e=>e.look==='castiel'&&!e.dead); if(c){ c.pose=4; c.dialogue='castiel_wait'; c.lit=.2; } sfx('bell'); }})]},
  }},
  sheriff_iv:{ port:'sheriff', start:()=>S.flags.got_sheriff?'s9':'s0', nodes:{
    s0:{speaker:'Sheriff Ames',
      text:"He’s sitting on the curb with his hat in his hands, turning it around and around by the brim.\n\n\"Spent the whole year not seeing things. Six men, and I didn’t see. The Hollis girl, and I didn’t see. I signed off on all of it, because seeing it would’ve meant doing something, and I didn’t know what.\" He stands. His knees crack. \"Evidence locker. Everything I took off Earl in ten years. Take it. And write down that I helped. Somebody should write down one thing I did.\"",
      choices:[D_("[Take it.] I’ll write it down.",null,{flag:'got_sheriff',now:()=>{ S.ammo.shells+=16; S.ammo.rounds+=24; S.ammo.flares+=4; own('flare'); toast('Shells, rounds and flares from the evidence locker'); }})]},
    s9:{speaker:'Sheriff Ames', text:"\"Go on. I’m watching the street. First time in a year I mean it.\"", choices:[D_("[Leave.]",null)]},
  }},
  doctor_iv:{ port:'doctor', start:()=>S.flags.got_doctor?'d9':'d0', nodes:{
    d0:{speaker:'Dr. Halvorsen',
      text:"He has his bag open on a mailbox and is counting what’s in it, over and over, the way Sarah stamps books.\n\n\"Nine years old. The form has a box for cause of death. It doesn’t have a box for her father’s coat.\" He zips the bag. \"So I wrote pneumonia, and I went home, and I washed my hands for a very long time.\n\nHere. Everything in the bag. I’m done being careful with it.\"",
      choices:[D_("[Take it.]",null,{flag:'got_doctor',heal:100,now:()=>{ S.meds+=2; toast('+2 med kits, fully patched'); }})]},
    d9:{speaker:'Dr. Halvorsen', text:"\"Bring them back breathing. That’s all. That’s the whole job.\"", choices:[D_("[Leave.]",null)]},
  }},
  delia_iv:{ port:'delia', start:'d0', nodes:{ d0:{speaker:'Delia Park',
    text:"She’s sitting on the church steps with a fire axe across her knees and her lanyard still round her neck.\n\n\"I’m a seventh-grade teacher. I have held worse doors than this one against worse than whatever’s in there.\" A wet laugh. \"I heard it, you know. When it was inside me. Not words. Just appetite. Like standing next to a refrigerator in the dark.\n\nGo on. I’ll be here when you come out. Somebody should be.\"",
    choices:[D_("Thank you, Delia.",null,{flag:'delia_guard'})]} }},
  crowley_iv:{ port:'crowley', start:()=>S.flags.crowley_oil?'c9':'c0', nodes:{
    c0:{speaker:'Crowley',
      text:"He’s back, leaning on the Impala, perfectly dry in a rain that has started to come down sideways and warm.\n\n\"Boys. Lovely apocalypse. I’ll be quick, because the thing in that church is eating my equity.\n\nEvery line Crossroads laid under this town is full of something that burns. Light it and the field goes up: the crop, the fence, the farmer, and everyone standing in it. I’d lose a town.\" He shrugs. \"I’ve lost towns.\"",
      choices:[D_("Why tell us?",'c1')]},
    c1:{speaker:'Crowley',
      text:()=>"\"Because I would rather own the ashes than lose the deed to a mouth. The fuse is the altar. You’ll know it.\"\n\nHe takes something from his breast pocket: a vial, thick and dark, catching the light like oil. "+(isSam()?"\"And for you, Samuel. From the same management as Juno’s little offering. "+(S.flags.sam_blood?"Since the last one went down so well.\"":"Since you were so principled about the last one.\""):"He holds it out past you, to Sam.\n\nSam is looking at it. He’s looking at it the way you look at a drink."),
      choices:[D_("[Drink it.]",'c_sam',{flag:'sam_blood2'},isSam),D_("[Leave it on the hood.]",'c_end',{align:['h',1]},isSam),
               D_("[Knock it out of his hand.]",'c_knock',{align:['h',1]},isDean),D_("[Look away. It’s his call.]",'c_let',{flag:'sam_blood2'},isDean)]},
    c_sam:{speaker:'—', port:null,
      text:"It goes down like a sentence finishing itself. This time the minute doesn’t end. You can hear the town thinking, and under the town, something that isn’t.\n\nCrowley watches you with real interest. \"There he is.\"",
      choices:[D_("[…]",'c_end',{now:()=>{ S.special=100; heal(40); }})]},
    c_knock:{speaker:'—', port:null,
      text:"The vial hits the asphalt and doesn’t break, which is somehow worse. Sam looks at it for a long second. Then he steps on it.\n\n\"Thanks,\" he says, very quietly, and doesn’t look at you for a while.",
      choices:[D_("[…]",'c_end',{flag:'sam_refused'})]},
    c_let:{speaker:'—', port:null,
      text:"You look at the church instead. When you look back, the vial is empty, and Sam is very still, and his eyes are very bright.\n\n\"I’m fine,\" he says. \"Dean. I’m better than fine.\"",
      choices:[D_("[…]",'c_end')]},
    c_end:{speaker:'Crowley',
      text:"\"Splendid. Do try not to die, either of you. You’re the only people in this town who still owe me anything.\"\n\nWhen you look up, he’s gone, and the rain is falling on the spot where he stood.",
      choices:[D_("[Let him go.]",null,{flag:'crowley_oil',now:()=>{ const c=SECTORS.street.entities.find(e=>e.look==='crowley'&&!e.dead); if(c){ c.dead=true; spawnParts(c.x,c.y,1,26,PCOL.smoke,{up:2}); } }})]},
    c9:{speaker:'Crowley', text:"…", choices:[D_("[…]",null)]},
  }},
  kevin_iv:{ start:()=>S.flags.kevin_used?'u0':'r0', nodes:{
    r0:{speaker:'Kevin Tran', port:'kevin_field',
      text:"He has Marla’s ham radio open on the bed, guts out, wired to a motel TV with the back off. His eyes are just eyes, red at the rims.\n\n\"Don’t laugh. The tablet isn’t scripture. It’s source. Every line I read was a function call. Somebody is running this town like a program, and programs have an owner, and owners have a directory.\n\nI think I can find root. I need an hour, a CRT, and nobody asking me to read faster.\"",
      choices:[D_("Take your hour, Kevin. Meet us at the church.",null,{flag:'kevin_rig'})]},
    u0:{speaker:'Kevin Tran', port:'kevin_reading',
      text:"He’s where Marla left him, very straight, the light at his eyes brighter than before. The tablet is in his lap again. Nobody gave it to him.\n\n\"I can finish it. The last line. I can feel it in my teeth.\" He smiles, and it’s terrible. \"You drafted me. Let me finish the tour.\"",
      choices:[D_("Then come to the church.",null,{flag:'kevin_rig'}),D_("Stay here, Kevin. Please.",null,{flag:'kevin_rig',align:['h',1]})]},
  }},
  alistair_end:{ port:'alistair', start:'n0', nodes:{
    n0:{speaker:'Father Alistair',
      text:"He’s kneeling in the aisle, where the carpet has become something wet and red that is not carpet. The candles here burn downward, flames pointing at the floor. The walls breathe in time with him. Whatever was holding him up has let go a little; he looks his age.\n\n\"You came. Good. I didn’t want to do this part alone.\"",
      choices:[D_("Stop it, Father. You can still stop it.",'n1'),D_("[Raise the gun.]",'n1',null,isDean)]},
    n1:{speaker:'Father Alistair',
      text:"\"I can’t. That’s the joke, you see. I opened a door, and doors don’t have opinions about who walks through them.\" He holds out a hand, palm up, the way he must have for Ray. \"It doesn’t want me any more. I’ve nothing left to eat. I’m just an old man in the way.\n\nIf you’re going to do it, do it kindly. If you’re not, let me sit in the front row. I’d like to see how it ends. I think I’ve earned that much.\"",
      choices:[D_("[Kill him.]",'n_kill',{align:['n',2]}),D_("[Help him into a pew.]",'n_spare',{align:['h',1]}),D_("[Take his hand.]",'n_hand',{align:['h',2]},isSam)]},
    n_kill:{speaker:'—', port:null,
      text:"He closes his eyes before you do it. He says \"oh.\" Just \"oh,\" like all the others, like a man who finally gets the joke.\n\nThe walls stop breathing for one long second, as if listening. Then they start again, faster.",
      choices:[D_("[…]",null,{flag:'alistair_killed',now:()=>resolveAlistair(true)})]},
    n_spare:{speaker:'—', port:null,
      text:"He’s lighter than he looks. You put him in the second pew, and he folds his hands, and he watches the altar with the polite attention of a man at a recital.\n\n\"Thank you,\" he says. \"I’ll watch. Somebody should.\"",
      choices:[D_("[…]",null,{flag:'alistair_spared',now:()=>resolveAlistair(false)})]},
    n_hand:{speaker:'—', port:null,
      text:"His hand is cold and dry and very old. He holds on a little longer than you expect.\n\n\"Oh,\" he says, softly, but he isn’t dying. He’s surprised. \"Oh. Nobody’s done that for me.\"\n\nHe sits in the second pew to watch.",
      choices:[D_("[…]",null,{flag:'alistair_spared',now:()=>resolveAlistair(false)})]},
  }},
  chuck_end:{ port:'chuck', start:'e0', nodes:{
    e0:{speaker:'Chuck',
      text:"Chuck is in the front pew with his feet up on the kneeler and a red-striped bucket of popcorn in his lap. Behind the altar the rift hangs in the air like a wound in a photograph, and through it something is paying very close attention.\n\n\"There they are! Okay, okay, okay. Finale. Don’t mind me, I’m just here as a fan.\" He crunches. \"So. Brother kills brother, the rift closes. Or don’t, and Oakhaven goes in about four minutes. Your call. I genuinely love that it’s your call.\"",
      choices:[D_("There’s always another way.",'e1'),D_("We’re not killing each other.",'e1')]},
    e1:{speaker:'Chuck',
      text:"\"Is there?\" He leans forward, delighted: a man watching contestants think. \"Go on, then. Pitch me.\"",
      choices:[D_("[Light the oil.] Crowley’s lines run under this church. We burn it. All of it.",'eA'),
               D_("[Turn to the rift.] It eats despair. Let it eat me. I can hold it.",'eB',null,isSam),
               D_("[Look at Sam.] He thinks he can take it into himself. …Let him.",'eB',null,isDean),
               D_("[Walk away.] We’re not doing your finale. Show’s over.",'eC'),
               D_("Kevin. Now.",'eD')]},
    eA:{speaker:'Chuck',
      text:()=>"\"Ooh. Scorched earth. Everybody in town? Marla? The kid at the motel?\" He stops smiling. \"That’s not the ending I wrote.\""+(S.flags.oil_map?"\n\nYou have Sarah’s map. You know exactly where the lines meet.":"\n\nYou don’t know where the lines run. You’ll have to find out the slow way."),
      choices:[D_("[Strike the match.]",null,{now:()=>chooseEnding('A')}),D_("[Not this.]",'e1')]},
    eB:{speaker:'Chuck',
      text:()=>"\"Oh, I love this. Sam goes all the way in. Saves the world, loses himself. You know what that is? That’s a cliffhanger.\""+((S.flags.sam_blood||S.flags.sam_blood2)?"\n\nSam’s eyes are already very bright.":"\n\nSam has never touched the stuff. This is going to hurt him in places he doesn’t have names for."),
      choices:[D_("[Do it.]",null,{now:()=>chooseEnding('B')}),D_("[Not this.]",'e1')]},
    eC:{speaker:'Chuck',
      text:"\"Walk away. From the finale. In the church. With the rift open.\" He blinks. \"Huh. That’s… actually kind of a bummer. Nothing resolves. Is that what you want? Nothing?\"",
      choices:[D_("[Turn your back on him.]",null,{now:()=>chooseEnding('C')}),D_("[Not this.]",'e1')]},
    eD:{speaker:'Chuck',
      text:"\"Who’s Kevin?\"\n\nAnd then, at the far end of the nave, the doors open.",
      choices:[D_("[…]",null,{now:()=>chooseEnding('D')})]},
  }},
});
DIALOGUE.kevin_motel.start=(f=>()=>S.act>=4?(S.flags.kevin_used?'k4u':'k4r'):f())(DIALOGUE.kevin_motel.start);
DIALOGUE.kevin_motel.nodes.k4r=DIALOGUE.kevin_iv.nodes.r0; DIALOGUE.kevin_motel.nodes.k4u=DIALOGUE.kevin_iv.nodes.u0;
function resolveAlistair(killed){
  const C=SECTORS.cathedral, a=C.entities.find(e=>e.alistair&&!e.dead); S.flags.alistair_resolved=true;
  if(a){ if(killed){ a.dead=true; spawnParts(a.x,a.y,.9,24,PCOL.blood); sfx('stab'); }
         else { a.x=9.6; a.y=12.2; a.pose=undefined; a.dialogue=undefined; a.name=''; a.face=-Math.PI/2; } }
  C.grid[8][12]='v'; C.grid[8][13]='v'; pack(C); sfx('bell'); S.shake=.5;
  later(1.2,()=>say('narr','Somewhere ahead, past the altar rail, someone is eating popcorn.',3));
}
CONVOS.push(
  {id:'last_night', when:()=>S.sector.id==='street'&&S.act>=4&&S.flags.chuck_met&&S.convoDone.has('ipa')&&!S.flags.cas_open, lines:()=>[
    [brother(),isDean()?'Hey. Whatever happens in there—':'Hey. Whatever happens in there—'],
    [S.hero,isDean()?'Don’t. Don’t do the speech.':'Don’t. Dean, don’t do the speech.'],
    [brother(),isDean()?'I wasn’t going to do the speech. I was going to say the car keys are in the visor.':'I wasn’t going to. I was going to say I’m glad it’s you.']]},
  {id:'in_void', when:()=>S.sector.id==='cathedral', quietOk:true, lines:[
    ['sam','It’s breathing.'],['dean','Yeah.'],['sam','It’s breathing in time with us, Dean.'],['dean','Then hold your breath.']]},
);

/* ── the cathedral ──────────────────────────────────────────────────────── */
function updateCathedral(dt){
  const C=SECTORS.cathedral, F=S.flags;
  if(!F.cath_in){ F.cath_in=true; showCard('Act IV · Breaking the Script','Chapter Twelve','The house that breathes'); sfx('flesh'); }
  const z=C.flipZone, inF=S.px>=z[0]&&S.px<z[2]+1&&S.py>=z[1]&&S.py<z[3]+1;
  if(inF!==!!S.flipped){ S.flipped=inF; S.glitchA=.6; S.shake=.4; sfx('flesh');
    if(inF&&!F.flipSaid){ F.flipSaid=true; say('narr','Up is a suggestion in here. The floor is above you now. Your stomach knows it before you do.',3.6,{now:true}); } }
  const f=C.foldZone;
  if(S.px>=f[0]&&S.px<f[2]+1&&S.py>=f[1]&&S.py<f[3]+1){
    S.px=12.5; S.py=30.6; S.angle=-Math.PI/2; S.glitchA=.8; S.shake=.6; sfx('flesh');
    if(COMP){ COMP.x=12.5; COMP.y=31.6; }
    say('narr',F.folded?'Back at the door. The door is breathing harder.':'The corridor folds. You are back at the door. You never turned around.',3,{now:true}); F.folded=true; }
  const lily=C.entities.find(e=>e.lilyLight&&!e.dead);
  if(lily&&!F.lilyLightSaid&&Math.hypot(S.px-lily.x,S.py-lily.y)<4){ F.lilyLightSaid=true;
    say('lily','This way. The floor’s on the ceiling here. Don’t be scared. I waited.',3.6,{now:true}); }
  if(S.py<8.6&&!F.ch13){ F.ch13=true; showCard('Act IV · Breaking the Script','Chapter Thirteen','Twenty to three'); sfx('bell'); }
}

/* ── per-frame upkeep for Acts I–IV ─────────────────────────────────────── */
function updateActs(dt){
  updateDread(dt); updateWrong(dt); updateAutosave(dt);
  const s=S.sector, F=S.flags;
  if(s.id!=='cathedral') S.flipped=false;
  if(s.id==='motel'&&!F.ch1){ F.ch1=true; showCard('Act I · The Wages of Sin','Chapter One','The night clerk'); }
  if(S.act>=3&&s.id==='street'&&!S.driving&&S.py<2.4&&S.px>21&&S.px<35){
    S.py=41.2; S.glitchA=.5; if(COMP&&!COMP.hidden){ COMP.x=S.px+1; COMP.y=42.2; }
    if(!F.looped){ F.looped=true; later(.8,()=>say(brother(),isDean()?'Dean… that’s the motel. We were walking north. We were walking away from the motel.':'Sam, that’s the car. We were heading north. That’s the car.',3.6)); }
    else { sfx('whisper'); S.dread=Math.min(1,(S.dread||0)+.06); } }
  if(S.act===3&&s.id==='street'&&F.cas_met&&!F.followed){
    let g=s.entities.find(e=>e.follower&&!e.dead);
    if(!g){ g=char_('ghost_girl',13.5,18.6,{kind:'npc',name:'',follower:true,h:1.45,face:-Math.PI/2,lit:.8}); s.entities.push(g); }
    g.face=-Math.PI/2;
    if(Math.hypot(S.px-g.x,S.py-g.y)<4.2&&!g.fadeT){ g.fadeT=S.time; g.look='ghost_girl_fade'; sfx('ghost');
      say('lily','This way. Daddy’s home.',3,{now:true,name:'A girl’s voice'}); }
    if(g.fadeT&&S.time-g.fadeT>.9){ g.dead=true; F.followed=true; }
  }
  if(s.id==='hollis'&&!F.ch8){ F.ch8=true; showCard('Act III · The Absentee Landlord','Chapter Eight','The girl on line three'); }
  if(s.id==='church'&&!F.church_in){ F.church_in=true; showCard('Act III · The Absentee Landlord','Chapter Nine','The sermon'); }
  if(F.alistair_met&&!SECTORS.lounge.shurleys) makeShurleys();
  if(s.id==='lounge'&&SECTORS.lounge.shurleys&&!F.chuck_seen){ F.chuck_seen=true; showCard('Act III · The Absentee Landlord','Chapter Ten','The dive bar'); }
  if(s.id==='cathedral') updateCathedral(dt);
}

/* ── objectives, Acts III and IV ────────────────────────────────────────── */
{ const F=S.flags;
OBJECTIVES.push(
  {id:'castiel',act:3,title:'Something fell into the motel lot',sector:'street',x:24.5,y:42.4,reward:20,
   detail:'It is still smoking. It is wearing a trench coat.',done:()=>F.cas_met},
  {id:'follow',act:3,title:'Follow the girl in the nightgown',sector:'street',x:13.5,y:17.6,reward:0,
   detail:'She is standing at Earl’s door, facing it. Do not trust a door you have opened before.',done:()=>S.sector.id==='hollis'},
  {id:'lily',act:3,title:'Find out who she was',sector:'hollis',x:12.4,y:10.3,reward:20,
   detail:'Somebody kept this house exactly as it was. Look at what they kept.',done:()=>F.lily_done},
  {id:'church',act:3,title:'Go to St. Brendan’s',sector:'church',x:9,y:5,reward:0,
   detail:'East, to the end of the cross street, where the road stops being a road.',done:()=>F.church_in},
  {id:'alistair',act:3,title:'Hear the priest out',sector:'church',x:9,y:5,reward:20,
   detail:'He is lighting candles. He has been lighting candles for a long time.',done:()=>F.alistair_met},
  {id:'bar',act:3,title:'The Velvet Hour has changed its sign',sector:'lounge',x:7.5,y:6.1,reward:0,
   detail:'It says SHURLEY’S now. The music is classic rock. Somebody inside is laughing at something on TV.',done:()=>F.chuck_seen},
  {id:'chuck',act:3,title:'Talk to the man at the bar',sector:'lounge',x:7.5,y:6.1,reward:30,
   detail:'Bathrobe. Craft beer. He waved like he knows you.',done:()=>F.chuck_met,onDone:endAct3},
  {id:'gather',act:4,title:'Gather what’s left, then meet Castiel at the church',sector:'street',x:50.4,y:20.6,reward:0,
   detail:'The people you helped have something to give. The sheriff and Dr. Halvorsen are on the street, Sarah is at the library, Kevin is at the motel, and Crowley is at the car. Castiel can open the church once.',done:()=>F.cas_open},
  {id:'cathedral',act:4,title:'Go into St. Brendan’s',sector:'cathedral',x:12.5,y:30,reward:0,detail:'It’s breathing.',done:()=>F.cath_in},
  {id:'nave',act:4,title:'Find the priest in the nave',sector:'cathedral',x:12.5,y:11.6,reward:30,
   detail:'Through the west hall. Up is a suggestion in there.',done:()=>F.alistair_resolved},
  {id:'altar',act:4,title:'Twenty to three',sector:'cathedral',x:12.5,y:6.4,reward:0,
   detail:'Somebody is waiting at the altar with popcorn.',done:()=>!!F.ending},
); }

/* ── endings ────────────────────────────────────────────────────────────── */
/* Every ending is open at the altar. What you did decides what it costs. */
function chooseEnding(k){
  if(k==='D'){ openMenu('Before you do this',
    'This ending erases your Oakhaven record in this browser: every save, the chapters you reached and the endings you’ve seen. Your controls are kept.\n\nThere is no undo. That is rather the point.',
    [{text:'Do it.',act:()=>{ S.flags.ending='D'; playCutscene('end_D'); }},
     {text:'Not yet.',act:()=>openDlg('chuck_end',SECTORS.cathedral.entities.find(e=>e.chuck))}]); return; }
  S.flags.ending=k; recordEnding(k); playCutscene('end_'+k);
}
function townRoll(){
  const F=S.flags, n=['Marla Ostrowski','Earl Duchesne','Sarah Lindqvist','Sheriff Ames','Dr. Halvorsen','Old Gus','Tyler'];
  for(const x of S.freedNames||[]) if(!n.includes(x)) n.push(x);
  if(F.delia_done&&!F.delia_killed) n.push('Delia Park');
  if(F.alistair_spared) n.push('Father Alistair, in the second pew');
  if(F.lily_waiting) n.push('Lily Hollis, who was still waiting');
  n.push('Juno, and whoever she was underneath');
  return n;
}
function viceLines(){
  const F=S.flags, L=[];
  if(F.dean_drank) L.push('Dean still thinks about the glass at the Velvet Hour. How quiet it was. He doesn’t say so.');
  if((F.sam_blood||F.sam_blood2)&&F.ending!=='B') L.push('Sam still knows exactly how long a minute is.');
  if(F.delia_killed) L.push('Delia Park’s seventh-grade class held a vigil in October. The substitute didn’t know what to say.');
  if(F.alistair_killed) L.push('Nobody found Father Alistair. The candles in St. Brendan’s were all burning downward when they looked.');
  return L;
}
function epilogue(k){
  const F=S.flags, lines=[];
  if(k==='A'){
    lines.push('The Impala crossed the town line at 2:44 in the morning. The fog let it.');
    lines.push(F.oil_map?'Sarah’s map meant the fire took four minutes. Nobody inside had time to wake up.':'Without a map, the fire took forty minutes to find every line. Some of them woke up.');
    lines.push('Everyone still inside the line when it burned:');
    for(const n of townRoll()) lines.push('    '+n);
    lines.push(F.kevin_used?'Kevin Tran rode in the back seat, reading the inside of his own eyelids, and didn’t stop until Idaho.':'Kevin Tran rode in the back seat and didn’t speak until Idaho. Then he asked to be let out, and they let him.');
    lines.push('Somewhere, a man in a bathrobe threw a bucket of popcorn at a screen.');
    return {kicker:'Ending A',title:'The Nihilist’s Match',lines:lines.concat(viceLines())};
  }
  if(k==='B'){
    if(F.sam_blood||F.sam_blood2){
      lines.push('Sam walked out of St. Brendan’s calm. He has stayed calm. He doesn’t sleep any more, and he doesn’t seem to mind.');
      lines.push('Dean locked the panic-room door himself and sits outside it every night with the radio on.');
      lines.push('Sam says thank you through the door. He means it. That is the worst part.');
    } else {
      lines.push('It nearly killed him. He came back with a scar across his throat where something tried to climb out, and a habit of checking the lights.');
      lines.push('“Check on me in a week,” he said. Dean checks every hour.');
    }
    lines.push('Oakhaven woke at 2:41 with the fog gone. Nobody remembers the week. Marla re-opened the motel at six.');
    for(const n of (S.freedNames||[])) lines.push(n+' is alive, and doesn’t know why that feels like a debt.');
    lines.push('The rift is shut. Chuck can’t get back in. Something in Sam’s chest is still paying attention.');
    return {kicker:'Ending B',title:'The Savior’s Martyrdom',lines:lines.concat(viceLines())};
  }
  if(k==='C'){
    lines.push('Oakhaven survived. Mostly.');
    lines.push('Marla still works the night desk. Some nights the ice machine knocks back.');
    lines.push(F.oil_map?'Sarah reads the ledgers aloud at the library on Thursdays. People come. More every week.':'Sarah still stamps books nobody checks out.');
    lines.push(F.got_sheriff?'Sheriff Ames sees things now. It has made him a worse sheriff and a better man.':'Sheriff Ames still doesn’t see things. He’s very good at it.');
    lines.push(F.kevin_used?'Kevin Tran never finished the tablet. He says it’s still mid-sentence, every time he closes his eyes.':'Kevin Tran started at Princeton a year late. He sleeps with the light on. He sleeps.');
    lines.push(F.lily_waiting?'Lily Hollis is still facing the wall. Somebody brings her drawings now.':'The dent in Lily’s bed never filled back in.');
    lines.push('The hum is still there. If you stand on Main Street at twenty to three, you can hear it deciding.');
    return {kicker:'Ending C',title:'Hollow',lines:lines.concat(viceLines())};
  }
  return {kicker:'',title:'',lines:[]};
}
function endCam(x,y,a,t){ return {t,x,y,a,z:0}; }
CUTSCENES.end_A=function(){ const st=SECTORS.street;
  return { dur:20, letterbox:true,
    setup(){ S.flipped=false; },
    cam:[endCam(12.5,9.4,-Math.PI/2,0),endCam(12.5,8.6,-Math.PI/2,6),endCam(28,40,-Math.PI/2,6.05),endCam(28,36,-Math.PI/2,13),endCam(28,42,-Math.PI/2,20)],
    ascii:[{t:0,v:0},{t:5.4,v:.7},{t:6.1,v:0},{t:20,v:0}],
    fade:[{t:0,v:0},{t:16,v:0},{t:20,v:1}],
    subs:[{t:.4,who:'narr',text:'The match is very small. The line under St. Brendan’s is very long.'},
          {t:3,who:'chuck',text:'No. No, no, no, that’s not— that’s not how this goes—'},
          {t:6.4,who:'narr',text:'It goes out from the altar in every direction at once, under every street Crossroads ever touched.'},
          {t:10,who:'narr',text:'The mill. The motel. The library. The Velvet Hour. The fog, and the farm, and the thing that farmed it.'},
          {t:14.5,who:S.hero,text:isDean()?'Drive, Sammy. Don’t look in the mirror.':'Just drive, Dean. Please don’t look back.'},
          {t:17.5,who:brother(),text:isDean()?'…I’m not looking.':'I’m not.'}],
    events:[{t:5.6,fn:()=>{ sfx('thunder'); sfx('tear'); S.shake=1; }},
            {t:6,fn:()=>{ enterSector('street',28,30,-Math.PI/2);
              for(let i=0;i<34;i++){ const x=i<20?24.4+(i%2)*7.2:6+Math.random()*44, y=i<20?6+(i>>1)*3:4+Math.random()*38; if(!hits(st,x,y,.4)) st.entities.push({kind:'prop',m:'fire',x,y,r:.3,h:1.6+Math.random()*1.4,emit:1,lit:1}); }
              for(let i=0;i<10;i++) st.lights.push({x:6+i*4.6,y:10+(i%4)*8,p:3,f:.08}); S.skyOver={top:[40,8,4],bot:[220,90,30],cloud:[120,40,20],clouds:1.4,stars:false,moon:false}; applyPreset(S.preset); }},
            {t:9,fn:()=>{ sfx('thunder'); S.shake=.8; }}],
    end(){ showEnding('A'); } }; };
CUTSCENES.end_B=function(){
  return { dur:17, letterbox:true, setup(){ S.flipped=false; },
    cam:[endCam(12.5,10,-Math.PI/2,0),endCam(12.5,8.4,-Math.PI/2,8),endCam(12.5,7.6,-Math.PI/2+.12,17)],
    ascii:[{t:0,v:0},{t:4,v:.3},{t:8,v:.9},{t:10,v:.4},{t:13,v:0},{t:17,v:0}],
    fade:[{t:0,v:0},{t:14,v:0},{t:17,v:1}],
    subs:[{t:.4,who:'sam',text:'It’s not loud. Dean, it isn’t loud. It’s just hungry.'},
          {t:3.6,who:'narr',text:'Sam opens his mouth, and the Void goes into him like water into a drain.'},
          {t:7.4,who:'chuck',text:'Oh, that’s good. That’s really— hey. Hey! What are you doing with the door?'},
          {t:9.6,who:'narr',text:'Then every light in Oakhaven comes on at once, and the rift closes like an eye.'},
          {t:12.4,who:'dean',text:'Sammy? Sam. Look at me.'},
          {t:14.4,who:'sam',text:(S.flags.sam_blood||S.flags.sam_blood2)?'I am looking at you, Dean. I can see all of you.':'I’m here. I’m— give me a minute. Check on me in a week.'}],
    events:[{t:3.8,fn:()=>{ sfx('tear'); S.shake=.8; }},{t:9.6,fn:()=>{ sfx('riteEnd'); sfx('bell'); S.flash=1; S.shake=1;
      for(const e of SECTORS.cathedral.entities) if(e.etype==='eldritch') e.dead=true; }}],
    end(){ showEnding('B'); } }; };
CUTSCENES.end_C=function(){
  return { dur:15, letterbox:true, setup(){ S.flipped=false; },
    cam:[endCam(12.5,8,Math.PI/2,0),endCam(12.5,20,Math.PI/2,5),endCam(28,22,-Math.PI/2,5.05),endCam(28,28,-Math.PI/2,15)],
    fade:[{t:0,v:0},{t:12,v:0},{t:15,v:1}],
    subs:[{t:.4,who:'chuck',text:'Wait. Wait, you can’t just— there’s no third act if you leave!'},
          {t:3,who:S.hero,text:isDean()?'Watch me.':'Then there isn’t one.'},
          {t:5.6,who:'narr',text:'Outside, the fog thins. It doesn’t lift. It thins.'},
          {t:8.6,who:'narr',text:'Somewhere behind you, in an empty church, a man in a bathrobe is clapping very slowly.'},
          {t:11.4,who:brother(),text:'Is that it? Is it over?'},{t:13,who:S.hero,text:'It’s never over. It’s just not his.'}],
    events:[{t:5,fn:()=>{ enterSector('street',28,22,-Math.PI/2); S.skyOver=null; const st=SECTORS.street; st.ambMul=.85; applyPreset(S.preset); }}],
    end(){ showEnding('C'); } }; };
CUTSCENES.end_D=function(){
  const C=SECTORS.cathedral, used=!!S.flags.kevin_used;
  const kev={kind:'actor',look:used?'kevin_reading':'kevin_field',x:12.5,y:20,r:.3,h:1.72,face:-Math.PI/2,animT:0,hidden:false,lit:.7};
  return { dur:21, letterbox:true,
    setup(){ S.flipped=false; C.entities.push(kev); },
    cam:[endCam(12.5,8.8,Math.PI/2,0),endCam(12.5,9.4,Math.PI/2,8),endCam(12.5,9.6,-Math.PI/2,12),endCam(12.5,9.2,-Math.PI/2,21)],
    actors:[{ent:kev,path:[{t:0,x:12.5,y:20},{t:7.6,x:12.5,y:11}]}],
    ascii:[{t:0,v:0},{t:12,v:0},{t:13,v:.6},{t:15,v:.2},{t:18,v:.85},{t:21,v:.9}],
    subs:[{t:.5,who:'narr',text:used?'Kevin comes up the aisle with the tablet under his arm and light pouring out of his eyes like a broken lamp.':'Kevin comes up the aisle dragging a ham radio wired to a motel television, the cable bumping over the pews.'},
          {t:4.6,who:'kevin',text:'They aren’t gods, Sam. None of them. It’s an algorithm.'},
          {t:7.8,who:'kevin',text:'The pain, the poverty, the six men. It’s a generated loop. It keeps the engine warm.'},
          {t:11,who:'kevin',text:'He didn’t create anything. He’s a rogue admin with terminal access. And I found the root directory.'},
          {t:13.4,who:'chuck',text:'Don’t. Don’t touch that. You don’t know what you’re— you’ll delete all of us!'},
          {t:16.4,who:'narr',text:'The things in the walls freeze mid-frame, blinking, while Kevin types.'},
          {t:18.8,who:'kevin',text:used?'Your hands, not mine. Mine aren’t mine any more. Type it.':'Your turn. Type it. del chuck_shurley dot exe.'}],
    events:[{t:13.2,fn:()=>{ for(const e of C.entities) if(e.etype==='eldritch') e.stun=99; sfx('tear'); S.shake=.6; }}],
    end(){ openTerminal(); } }; };

/* the end screen */
function showEnding(k){
  S.menu='end'; document.exitPointerLock?.(); const E=epilogue(k);
  const el=document.getElementById('endScr')||Object.assign(document.createElement('div'),{id:'endScr'});
  el.innerHTML=''; document.getElementById('vp').appendChild(el);
  const kk=document.createElement('div'); kk.className='k'; kk.textContent=E.kicker; el.appendChild(kk);
  const h=document.createElement('h2'); h.textContent=E.title; el.appendChild(h);
  const box=document.createElement('div'); box.className='ep'; el.appendChild(box);
  E.lines.forEach((l,i)=>{ const p=document.createElement('p'); p.textContent=l; p.style.animationDelay=(1+i*.9)+'s'; if(l.startsWith('    ')) p.className='nm'; box.appendChild(p); });
  const b=document.createElement('button'); b.textContent='Return to the title'; b.onclick=()=>location.reload(); b.style.animationDelay=(2+E.lines.length*.9)+'s'; el.appendChild(b);
  el.classList.add('on');
}
/* ending D: a real prompt */
function openTerminal(){
  S.menu='term'; document.exitPointerLock?.();
  const el=document.getElementById('term')||Object.assign(document.createElement('div'),{id:'term'});
  document.getElementById('vp').appendChild(el);
  el.innerHTML='<pre id="termOut"></pre><div class="row"><span>C:\\OAKHAVEN&gt;&nbsp;</span><input id="termIn" autocomplete="off" spellcheck="false"></div>';
  el.classList.add('on');
  const out=document.getElementById('termOut'), inp=document.getElementById('termIn');
  const print=t=>{ out.textContent+=t+'\n'; out.scrollTop=1e9; };
  print('Oakhaven reality rendering engine  [build 4.004.001]');
  print('admin session: c.shurley  ·  root session: k.tran (borrowed)');
  print('');
  print(S.flags.kevin_used?'KEVIN: Type it. Please. Before I finish the sentence.':'KEVIN: Type it. del chuck_shurley.exe');
  print('');
  inp.focus();
  inp.onkeydown=ev=>{
    if(ev.key!=='Enter') return; ev.preventDefault();
    const cmd=inp.value.trim(); inp.value=''; print('C:\\OAKHAVEN> '+cmd);
    const c=cmd.toLowerCase().replace(/\s+/g,' ');
    if(c==='del chuck_shurley.exe'||c==='rm chuck_shurley.exe'||c==='del c:\\oakhaven\\chuck_shurley.exe'){ inp.disabled=true; runPurge(print); return; }
    if(c==='dir'||c==='ls'){ print(' chuck_shurley.exe    whisperer.dll    oakhaven.map    winchester_d.proc    winchester_s.proc    tran_k.proc'); return; }
    print(`'${cmd}' is not recognized as an internal or external command.`);
    print(S.flags.kevin_used?'KEVIN: del. chuck. shurley. dot exe. I can’t hold it open much longer.':'CHUCK: You don’t know what you’re doing! I WROTE you!');
  };
}
function runPurge(print){
  const used=!!S.flags.kevin_used, F=S.flags;
  const seq=['CHUCK: Without my script you have no plot, no purpose! You’ll be raw data on a dead server!',
    isDean()?'DEAN: We’ll take our chances. Go to hell, Chuck. Take your spaghetti code with you.':'DEAN: We’ll take our chances. Go to hell, Chuck.',
    '','> deleting chuck_shurley.exe ...','> Reality rendering engine disabled.','> Entity \'C. Shurley\' purged from memory.'];
  if(used) seq.push('> WARNING: entity \'K. Tran\' shares 4,096 lines with deleted asset','KEVIN: That’s me. The words are in me. If he goes, they go.','KEVIN: It’s okay. You drafted me. I’m resigning.','> Entity \'K. Tran\' released.');
  else seq.push('> Entity \'K. Tran\' detached. He is going to sleep for a very long time.');
  if(F.alistair_spared) seq.push('> Process \'alistair\' exiting. Last output: "oh."');
  if(F.lily_waiting) seq.push('> Process \'hollis_l\' exiting. She turned around.');
  seq.push('> Free will parameter set to: TRUE.','> The Winchester processes are still running.','> Where they go now, I cannot render. They are finally off the script.','> Erasing record ...','> System shutting down.','','Process exited with code 0.');
  seq.forEach((l,i)=>later(1+i*1.25,()=>{ print(l); if(l==='> Erasing record ...'){ wipeProgress(); wipeSaves(); } if(l==='> System shutting down.') sfx('engine'); }));
  later(2+seq.length*1.25,()=>{ const b=document.createElement('button'); b.textContent='Close'; b.onclick=()=>{ try{ window.close(); }catch(e){} location.reload(); };
    document.getElementById('term').appendChild(b); });
}

/* ── progress: chapters reached and endings seen, per browser ───────────── */
const PROG_KEY='oakhaven.progress.v1';
function loadProgress(){ try{ return JSON.parse(localStorage.getItem(PROG_KEY)||'null')||{act:1,endings:[]}; }catch(e){ return {act:1,endings:[]}; } }
function storeProgress(p){ try{ localStorage.setItem(PROG_KEY,JSON.stringify(p)); }catch(e){} }
function saveProgress(act){ const p=loadProgress(); if(act>p.act){ p.act=act; storeProgress(p); } }
function recordEnding(k){ const p=loadProgress(); if(!p.endings.includes(k)) p.endings.push(k); storeProgress(p); }
function wipeProgress(){ try{ localStorage.removeItem(PROG_KEY); }catch(e){} }

/* chapter select on the boot screen, once an act has been reached */
BOOT.startAct=1;
function buildChapterSelect(){
  const p=loadProgress(), opts=document.querySelector('#boot .opts'); if(!opts||p.act<2&&!p.endings.length) return;
  const row=document.createElement('div'); row.className='row'; row.id='actRow';
  const lab=document.createElement('span'); lab.textContent='Start at'; row.appendChild(lab);
  ['Act I','Act II','Act III','Act IV'].forEach((n,i)=>{ if(i+1>p.act) return;
    const b=document.createElement('button'); b.className='opt'; b.textContent=n; b.dataset.a=i+1;
    b.onclick=()=>{ BOOT.startAct=i+1; row.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',x===b)); };
    if(i===0) b.setAttribute('aria-pressed','true'); row.appendChild(b); });
  if(p.endings.length){ const e=document.createElement('span'); e.style.width='auto'; e.style.marginLeft='14px'; e.textContent='Endings seen: '+p.endings.sort().join(' · '); row.appendChild(e); }
  opts.appendChild(row);
}
buildChapterSelect();
/* jump straight to an act with sensible defaults for what came before */
function startAt(act){
  if(S.cut) skipCutscene(); S.cardQ.length=0; S.card=null;
  const F=S.flags, st=SECTORS.street;
  Object.assign(F,{marla:true,earl:true,phantom:true,ray_named:true,millEntered:true,shadesAwake:true,term:true,term_mill:true,ch1:true,sarah_met:true});
  for(const e of SECTORS.mill.entities) if(e.kind==='enemy'||e.look==='phantom') e.dead=true;
  own('shotgun'); own('holywater'); S.ammo.shells+=12; S.ammo.rounds+=12; S.ammo.holywater+=2; S.cash+=60; S.meds+=1;
  for(const [x,y] of [[31.5,38],[24,29],[31.5,17],[24,9]]) killLamp(x,y);
  raiseFog(); S.act=2; S.actStart=S.time; spawnDelia(); addNote('lockdown'); S.obj=objIndex('delia'); saveProgress(2);
  if(act>=3){
    freeDelia(); Object.assign(F,{delia_done:true,trap_entered:true,kevin_done:true,kevin_rested:true,harvest:true,kevin_checked:true,
      crowley_spawned:true,crowley_done:true,juno_met:true,juno_seen:true});
    for(const e of SECTORS.trap.entities) if(e.guard) e.dead=true;
    moveKevin(); own('knife'); own('flare'); learnRite('sigil'); S.ammo.flares+=3;
    S.obj=objIndex('castiel');
  }
  enterSector('street',28.2,37.4,-Math.PI/2);
  if(COMP){ COMP.hidden=false; COMP.x=30; COMP.y=37.8; }
  if(act===3) startAct3();
  if(act>=4){
    S.act=3; hideTownsfolk(); foldWorld(1); learnRite('lux');
    st.entities.push(char_('castiel',24.5,42.4,{kind:'npc',dialogue:'castiel_wait',name:'Castiel',h:1.85}));
    Object.assign(F,{cas_met:true,followed:true,lily_done:true,lily_rested:true,lily_turned:true,church_in:true,alistair_met:true,
      alistair_heard:true,chuck_seen:true,chuck_met:true,ch8:true});
    lilyGone(); makeShurleys(); const c=SECTORS.lounge.entities.find(e=>e.look==='chuck'); if(c) c.dead=true;
    S.convoDone.add('ipa'); S.obj=objIndex('gather'); setupAct4();
    showCard('Act IV · Breaking the Script','Chapter Eleven','Gather what’s left',{dur:6});
  }
}
