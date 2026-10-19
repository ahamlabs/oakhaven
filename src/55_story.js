/* ═══ Story ══════════════════════════════════════════════════════════════
   Everything that makes the town unfold over time rather than all at once:
   chapter cards, the case file, the brothers talking between fights, the
   townspeople, and Act II.

   Pacing rule: every objective is followed by something to *hear* before the
   next thing to *do* — a conversation in the car, a line from a stranger, a
   note in the case file. The horror lands in the gaps. */

S.align={h:0,n:0}; S.notes=[]; S.caseSeen=0; S.cardQ=[]; S.card=null; S.convoDone=new Set(); S.act=1;

/* ── morality ───────────────────────────────────────────────────────────── */
/* Two tallies, not a slider: a player can be both violent and kind, and the
   endings read the balance between them. */
function addAlign(k,n){ if(k==='h'||k==='n') S.align[k]+=n||1; }

/* ── chapter cards ──────────────────────────────────────────────────────── */
function showCard(kicker,title,line,o={}){
  if(/^(Chapter|Prologue)/.test(title)){ S.chapter={kicker,title,line}; if(typeof requestAutosave==='function') requestAutosave(); }
  S.cardQ.push({kicker,title,line,t:0,dur:o.dur||5.2,during:!!o.during}); }
function drawCard(dt){
  if(!S.card&&S.cardQ.length&&(!S.cut||S.cardQ[0].during)) S.card=S.cardQ.shift();
  const c=S.card; if(!c) return;
  /* a card that belonged to a skipped cutscene fades out instead of lingering */
  if(c.during&&!S.cut&&c.t<c.dur-.9) c.t=c.dur-.9;
  c.t+=dt; if(c.t>=c.dur){ S.card=null; return; }
  if(S.caseOpen||S.mapOpen) return;
  const a=Math.min(1,c.t/.9,(c.dur-c.t)/.9), W=over.width, H=over.height, u=H/200;
  octx.save(); octx.globalAlpha=a;
  const bh=H*.3, by=H*.33;
  const g=octx.createLinearGradient(0,by,0,by+bh);
  g.addColorStop(0,'rgba(4,5,7,0)'); g.addColorStop(.25,'rgba(4,5,7,.88)'); g.addColorStop(.75,'rgba(4,5,7,.88)'); g.addColorStop(1,'rgba(4,5,7,0)');
  octx.fillStyle=g; octx.fillRect(0,by,W,bh);
  const spaced=(s,px)=>{ octx.font=`${Math.round(px)}px ${FONT}`; return s.toUpperCase().split('').join(String.fromCharCode(8202)); };
  octx.textAlign='center'; octx.textBaseline='middle';
  octx.font=`${Math.round(5*u)}px ${FONT}`; octx.fillStyle='#d9a441';
  octx.fillText(spaced(c.kicker,5*u),W/2,by+bh*.3);
  octx.font=`${Math.round(13*u)}px ${FONT}`; octx.fillStyle='#e8dcc4';
  octx.fillText(c.title,W/2,by+bh*.5);
  if(c.line){ octx.font=`italic ${Math.round(5.6*u)}px ${FONT}`; octx.fillStyle='#8b95a0'; octx.fillText(c.line,W/2,by+bh*.7); }
  octx.restore();
}

/* ── the case file ──────────────────────────────────────────────────────── */
const NOTES = {
  arrive:     ['Six dead in five weeks', 'Former mill workers, all of them, all in the same week of the month. The town reads like a place somebody stopped paying for.'],
  marla:      ['Crossroads Holdings', 'Bought the mill profitable, ran it into the ground in eleven months, left the asbestos. Delaware address; the address is a mailbox. (Marla)'],
  earl:       ['Earl’s other inventory', 'Salt, iron, and things that aren’t legal in Oregon. Cash only. “I don’t take souls, whatever you heard about the last owner.”'],
  ray:        ['Vent fourteen', 'Ray Hollis requested ventilation fan fourteen in March. It was deferred as capital expenditure. He died in October. His ghost was still reciting the form.'],
  tear:       ['Something eats the dead', 'When the ghost let go, the air opened like a paper cut and drank what was left of him. Salt and burn was never going to be enough.'],
  girl:       ['The girl in the nightgown', 'Seen three times on Main Street after the lamps died, always facing away. Not hostile. She talks about her father on line three. The mill dead had families; nobody counted those.'],
  mill_term:  ['The mill terminal', 'Still drawing power. Mentions something called “whisperer”, an admin named c.shurley, and a harvest yield of six units. Six.'],
  street_term:['The alley terminal', 'A loop that raises every resident’s despair a little each tick, and thins the veil wherever someone crosses 0.94.'],
  pawn_term:  ['The pawnshop terminal', 'c.shurley is logged in, but is not root. Root has not logged in for four million cycles.'],
  lockdown:   ['The fog', 'The streetlights went out one at a time. Every road ends in the same grey wall. It stops exactly at the town line.'],
  delia_freed:['Bodies are walls', 'The demons aren’t hunting. They hide inside people from something in the fog. They thinned the veil for a client and are locked in with it now. Delia Park was freed, awake the whole time.'],
  delia_killed:['Bodies are walls', 'The demons aren’t hunting. They hide inside people from something in the fog. They thinned the veil for a client. The host, Delia Park, did not survive.'],
  juno:       ['The Velvet Hour', 'Juno sells numbness on “management’s” orders. Somebody wants the town flat: not hurting, just no longer caring whether it hurts.'],
  dean_drank: ['A drink at the Velvet Hour', 'It went down like a closing door. For a few minutes the hum was very far away. Something filed it away as a solution.'],
  kevin_rested:['Kevin Tran', 'Nineteen, bound for Princeton, nine days reading a stone tablet aloud. Told to stop. Slept eleven hours. Asked for eggs.'],
  kevin_used: ['Kevin Tran', 'Nineteen, bound for Princeton, nine days reading a stone tablet aloud. Asked to keep reading. He did. “You didn’t save me. You drafted me.”'],
  harvest:    ['It’s a farm', 'The despair is the crop. A flat, grey, hopeless town is easier to eat than a happy one. The demons didn’t do the hard part. A holding company did.'],
  crowley:    ['Crowley', 'King of the Crossroads, owner of Crossroads Holdings. Bankrupted the mill for a buyer he cannot negotiate with. Wants the town “back on the books”.'],
};
/* Notes that arrive with a story flag, checked continuously, so no single
   code path has to remember to file them. */
const NOTE_FLAGS = [['marla','marla'],['earl','earl'],['ray_named','ray'],['phantom','tear'],['term','mill_term'],
  ['term_street','street_term'],['term_pawn','pawn_term'],['juno_met','juno'],['harvest','harvest'],['crowley_done','crowley']];
function addNote(id){
  if(!NOTES[id]||S.notes.some(n=>n.id===id)) return;
  S.notes.push({id,title:NOTES[id][0],text:NOTES[id][1]});
  if(S.running&&S.notes.length>1) toast('Case file updated — J');
}
const PEOPLE = [
  {flag:'marla',  look:'marla',  name:'Marla Ostrowski', line:'Night clerk. Thirty-one years signing the ledger.'},
  {flag:'earl',   look:'earl',   name:'Earl Duchesne',   line:'Pawnbroker. Sells to “the other kind of customer”.'},
  {flag:'phantom',look:'phantom',name:'Ray Hollis',      line:'Green chain, line three. Filed a form in March.'},
  {flag:'delia_done',look:()=>S.flags.delia_killed?'possessed_delia':'delia',name:'Delia Park', line:()=>S.flags.delia_killed?'Seventh grade teacher. We didn’t save her.':'Seventh grade teacher. Awake the whole time.'},
  {flag:'juno_met',look:'juno',  name:'Juno',            line:'Runs the Velvet Hour. Pain is a tax; she sells the loophole.'},
  {flag:'kevin_done',look:()=>S.flags.kevin_used?'kevin_reading':'kevin',name:'Kevin Tran', line:'The prophet. Nineteen.'},
  {flag:'crowley_done',look:'crowley',name:'Crowley',    line:'King of the Crossroads. Patient investor.'},
  {flag:'met_sheriff',look:'sheriff',name:'Sheriff Ames',   line:'County law. Has decided not to see you.'},
  {flag:'met_sarah',  look:'sarah',  name:'Sarah Lindqvist',line:'Librarian. Her brother Pete died on line three.'},
  {flag:'met_nurse',  look:'doctor', name:'Dr. Halvorsen',  line:'Clinic doctor. Signed four of the six certificates.'},
  {flag:'met_worker', look:'mechanic',name:'Hank Ruiz',     line:'Mill hand. Still hears the green chain.'},
  {flag:'met_logger', look:'old_man',name:'Old Gus',        line:'Fifty years in the woods.'},
  {flag:'girl_seen',  look:'ghost_girl',name:()=>S.flags.lily_done?'Lily Hollis':'The girl in the nightgown',
   line:()=>S.flags.lily_rested?'Fourth grade. Ray’s daughter. Laid to rest.':S.flags.lily_done?'Fourth grade. Ray’s daughter. Still waiting.':'Always facing away. Talks about her father.'},
];
const PORT_CACHE={};
/* 64×80 painted busts (25_portraits.js) on a dark vignette card */
function portraitCanvas(look,expr=0){
  const key=look+'|'+expr; if(PORT_CACHE[key]) return PORT_CACHE[key];
  const b=bustOf(look,expr), cv=document.createElement('canvas'); cv.width=64; cv.height=80;
  const cx=cv.getContext('2d'), id=cx.createImageData(64,80), o=new Uint32Array(id.data.buffer);
  for(let y=0;y<80;y++) for(let x=0;x<64;x++){
    const c=b?b.px[y*64+x]:0;
    if(c){ o[y*64+x]=(c|0xFF000000)>>>0; continue; }
    const d=Math.hypot((x-32)/40,(y-34)/50), v=Math.max(0,1-d)*22+16;
    o[y*64+x]=rgb(v*1.05|0,v*.92|0,v*.8|0); }
  cx.putImageData(id,0,0);
  return (PORT_CACHE[key]=cv);
}
function setPortrait(look,expr=0){
  const cv=document.getElementById('dport');
  if(!look||!LOOKS[look]){ elDlg.classList.remove('withport'); return; }
  const cx=cv.getContext('2d'); cx.clearRect(0,0,64,80); cx.drawImage(portraitCanvas(look,expr),0,0);
  elDlg.classList.add('withport');
}
function drawCaseFile(){
  const W=over.width, H=over.height, u=H/200, fs=Math.max(11,Math.round(5.2*u));
  octx.save(); octx.imageSmoothingEnabled=false;
  octx.fillStyle='rgba(8,7,6,.95)'; octx.fillRect(0,0,W,H);
  octx.fillStyle='#d9a441'; octx.fillRect(W*.04,H*.07,2,H*.86);
  txt('CASE FILE · OAKHAVEN, OR',W*.06,H*.06,fs*.9,'#d9a441');
  txt(`Act ${['I','II','III','IV'][Math.min(3,S.act-1)]}`,W*.62,H*.06,fs*.9,'#5d6b73');
  /* notes, newest first */
  let y=H*.13; const lx=W*.06, lw=W*.52;
  const notes=S.notes.slice().reverse();
  if(!notes.length) txt('Nothing yet.',lx,y,fs,'#5d6b73');
  for(const n of notes){
    if(y>H*.9) { txt('…',lx,y,fs,'#5d6b73'); break; }
    txt(n.title,lx,y,fs*1.05,'#e8dcc4'); y+=fs*1.45;
    y=wrapText(n.text,lx,y,lw,fs*.9,'#9aa6ad')+fs*.55;
  }
  /* people */
  const rx=W*.62; let ry=H*.13;
  txt('PEOPLE',rx,ry,fs*.85,'#5d6b73'); ry+=fs*1.6;
  for(const p of PEOPLE){
    if(!S.flags[p.flag]) continue;
    const look=typeof p.look==='function'?p.look():p.look, line=typeof p.line==='function'?p.line():p.line;
    const ps=Math.round(fs*2.8);
    octx.fillStyle='#141b20'; octx.fillRect(rx,ry,ps*64/80,ps);
    octx.drawImage(portraitCanvas(look),rx,ry,ps*64/80,ps);
    txt(typeof p.name==='function'?p.name():p.name,rx+ps*.95,ry+fs*.15,fs*.95,'#e8dcc4');
    const end=wrapText(line,rx+ps*.95,ry+fs*1.25,W*.33-ps,fs*.78,'#8b95a0');
    ry=Math.max(ry+ps,end)+fs*.8;
    if(ry>H*.68) break;
  }
  /* how you hunt */
  const by=H*.76; txt('HOW YOU HUNT',rx,by,fs*.85,'#5d6b73');
  const tot=Math.max(1,S.align.h+S.align.n), bw=W*.32, bh=fs*.7;
  octx.fillStyle='#c07440'; octx.fillRect(rx,by+fs*1.5,bw*(S.align.n/tot),bh);
  octx.fillStyle='#7fa6d6'; octx.fillRect(rx+bw*(S.align.n/tot),by+fs*1.5,bw*(S.align.h/tot),bh);
  if(S.align.h+S.align.n===0){ octx.fillStyle='#2a343a'; octx.fillRect(rx,by+fs*1.5,bw,bh); }
  txt(`Absurdism ${S.align.n}`,rx,by+fs*2.6,fs*.8,'#c07440');
  txt(`Humanism ${S.align.h}`,rx+bw,by+fs*2.6,fs*.8,'#7fa6d6','right');
  txt(`Ghosts laid to rest ${S.kills.ghost} · demons killed ${S.kills.demon} · people freed ${S.freed}`,rx,by+fs*4,fs*.75,'#8b95a0');
  txt(`${keyName('caseFile')} to close`,W*.94,H*.95,fs*.8,'#3f4a50','right');
  octx.restore();
}

/* ── townspeople ────────────────────────────────────────────────────────── */
/* Short and specific. Act II lines replace Act I lines once the fog is in. */
const TOWN_TALK = {
  worker:{1:['Mill’s been shut since spring. Some nights I still hear the green chain running.',
             'Ray Hollis was a good man. Don’t let anybody tell you different.',
             'Six of us. Six. You’d think somebody from the state would come.'],
          2:['Radio’s just static now. Even the church station.','I tried to drive to my sister’s in Eugene. The road just… ends. Grey.']},
  rainwoman:{1:['Don’t go past the cross street after three. The lights go wrong.',
                'My boy says the streetlights hum his name. He’s nine. Where would he learn that?'],
             2:['Somebody keeps knocking on the inside of the motel ice machine.','The fog is warm. Fog shouldn’t be warm.']},
  teen:{1:['You cops? You don’t look like cops.',
           'There’s a house on Bellweather everybody pretends isn’t there.',
           'There’s a kid in that house who reads all night. You can hear it through the wall. It isn’t English.'],
        2:['My mom stopped talking on Tuesday. She’s not sick. She just stopped.','If you’re going to Bellweather, don’t look at the light.']},
  logger:{1:['Logged these hills fifty years. Never once felt the woods hold their breath before.',
             'Crossroads. Hm. Where I grew up, you didn’t make deals at a crossroads.'],
          2:['Fifty years in the woods and I’ve never seen fog stop at a property line.']},
  nurse:{1:['Third overdose this week, and none of them used before March.',
            'I run the clinic on the county road. Twenty miles of nothing each way.',
            'Six death certificates. I signed four. I wrote “cardiac” because there isn’t a box for what I saw.'],
         2:['Nobody’s made it out past the town line since the lights went. Not even the ambulance.',
            'They’re not sick. They’re emptied. I don’t have a code for that.']},
  sheriff:{1:['Federal agents. Sure. My county, my dead, your badges.',
              'Six men, and the coroner writes “natural causes” six times. I stopped asking him why.',
              'If you two are going into that mill, I didn’t see you. I’d like to keep not seeing things.'],
            2:['Radio’s dead. Cruiser won’t turn over. I’ve got a sidearm and a town that won’t look me in the eye.',
               'Whatever you two really are — do it fast.']},
  sarah:{1:['Pete was my brother. Line three, the green chain. He hated that job and went back every night anyway.',
            'I run the library. The old company ledgers are in the basement. Nobody’s asked for them in years.',
            'Everybody who asks about the mill leaves by Friday. You’ve got that look already.'],
         2:['The lamps went out all at once. Not a brownout. Like someone closed an eye.',
            'There’s a girl in a nightgown at the end of the street. She’s always facing away. Tell me you see her too.']},
  delia_free:{2:['I heard everything it thought. It was so scared. Isn’t that funny? I’m not.',
                 'The boy on Bellweather. Please. He’s somebody’s kid.',
                 'I’m going to sit here a while. Don’t worry about me. Go.']},
  regular:{1:['He doesn’t look at you. “It’s nice in here. You don’t think about anything.”',
              '“I ran the edger on line three. I don’t remember why I stopped minding.”']},
  regular2:{1:['“Shh. You’ll let the outside in.”','“Juno says the fog is just weather. Juno is always right.”']},
};
function townTalk(e){
  const set=TOWN_TALK[e.talk||e.talkOnly]; if(!set) return;
  S.flags['met_'+(e.talk||e.talkOnly)]=true;
  const lines=set[S.act]||set[2]||set[1]; e.ti=((e.ti??-1)+1)%lines.length;
  e.face=Math.atan2(S.py-e.y,S.px-e.x); e.waitT=3.2; e.tx=undefined;
  say('town',lines[e.ti],null,{now:true,name:e.name});
}

/* ── the brothers, between fights ──────────────────────────────────────── */
/* Two-handers that play when it's quiet. The philosophy lives in these, not
   in speeches: Dean deflects, Sam counts the cost, and neither wins. */
const CONVOS = [
  {id:'street_first', when:()=>S.sector.id==='street'&&S.time-S.playStart>7&&!S.flags.marla, lines:[
    ['dean','Place is quiet.'],
    ['sam','Everybody who could leave already did. The ones still here are the ones who couldn’t.'],
    ['dean','Cheery. Motel, then.']]},
  {id:'after_marla', when:()=>S.sector.id==='street'&&S.flags.marla&&!S.flags.earl, lines:[
    ['sam','Crossroads Holdings. A Delaware mailbox buying a sawmill in Oregon.'],
    ['dean','That’s not a coincidence. That’s a signature.'],
    ['sam','Marla said Earl, across the street, sells to “the other kind of customer.”'],
    ['dean','My kind of guy.']]},
  {id:'mill_approach', when:()=>S.sector.id==='street'&&S.flags.earl&&!S.flags.millEntered&&Math.hypot(S.px-45.5,S.py-31.5)<7, lines:[
    ['dean','Smells like a closed account.'],
    ['sam','Ray Hollis. Lyle Brandt. The Okafor brothers. Pete Lindqvist. Mo Haddad.'],
    ['dean','Sam.'],
    ['sam','Somebody should say their names out loud. Nobody else in this town is going to.']]},
  {id:'vent14', when:()=>S.sector.id==='mill'&&objIndex('survive')<S.obj&&S.flags.shadesAwake, lines:[
    ['dean','Don’t say it.'],
    ['sam','I didn’t say anything.'],
    ['dean','You’ve got the face. You’re about to tell me about the vent.'],
    ['sam','Vent fourteen. He filed it in March. Somebody moved it to next quarter, and he was dead by October. What we just did was tidying up.'],
    ['dean','Yeah. It was tidying up. I’ve got a shotgun and a tank of gas, Sam. Not a seat on the board.'],
    ['sam','I want you to say it bothers you.'],
    ['dean','Everything bothers me, Sammy. That’s the whole job. You just don’t get to put it down anywhere.']]},
  {id:'possessed_seen', when:()=>S.sector.id==='street'&&S.act===1&&S.sector.entities.some(e=>e.kind==='enemy'&&!e.dead&&Math.hypot(e.x-S.px,e.y-S.py)<11), quietOk:true, lines:[
    ['sam','Dean, those are townspeople. The rite can still get them out.'],
    ['dean','And if it can’t?'],
    ['sam','Then at least we tried before we did the other thing.']]},
  {id:'act2_open', when:()=>S.sector.id==='street'&&S.act===2&&!S.flags.delia_done&&S.time-S.actStart>4, lines:[
    ['dean','Okay. Fog wall. Lights out. Demons in the street that won’t look me in the eye.'],
    ['sam','Look at the one by the bus stop. She isn’t hunting. She’s hiding.']]},
  {id:'after_delia', when:()=>S.sector.id==='street'&&S.flags.delia_done&&!S.flags.trap_entered, lines:[
    ['dean','A demon scared of something. That’s new.'],
    ['sam','She said the fog doesn’t keep us in. It keeps them in.'],
    ['dean','So we’re locked in a closet with whatever scares Hell. Great. Love that.'],
    ['sam','Bellweather. North end, past Earl’s.']]},
  {id:'trap_in', when:()=>S.sector.id==='trap'&&S.flags.trap_entered, lines:[
    ['sam','Listen. Somebody’s reading.'],
    ['dean','That’s not English.'],
    ['sam','That’s not anything.']]},
  {id:'kevin_after', when:()=>S.sector.id==='street'&&S.flags.kevin_done&&!S.flags.kevin_checked, lines:()=>S.flags.kevin_used?[
    ['sam','We used him, Dean.'],
    ['dean','We needed what he had.'],
    ['sam','We always need it. That’s the problem. Somebody’s useful, so we use them.'],
    ['dean','…Yeah. I heard him.']]:[
    ['dean','Eleven hours on a staircase. My back’s going to file a complaint.'],
    ['sam','He asked for eggs, Dean. Nine days, and he asked for eggs.'],
    ['dean','Yeah. Yeah, I know. It was a good moment. Don’t make it weird.']]},
  {id:'field', when:()=>S.sector.id==='street'&&S.flags.crowley_spawned&&!S.flags.crowley_done, lines:[
    ['dean','A farm. The whole town.'],
    ['sam','Somebody planted it. Somebody bought the field.'],
    ['dean','Then let’s go find the guy holding the deed.'],
    ['sam','Dean. Somebody’s standing by the car.']]},
  {id:'lounge_in', when:()=>S.sector.id==='lounge', lines:[
    ['sam','Nobody in here is talking.'],
    ['dean','Nobody in here is anything.']]},
];
function quiet(){
  for(const e of S.sector.entities) if(e.kind==='enemy'&&!e.dead&&e.state==='hunt'&&Math.hypot(e.x-S.px,e.y-S.py)<12) return false;
  return true;
}
function objIndex(id){ return OBJECTIVES.findIndex(o=>o.id===id); }

/* ── per-frame story upkeep ─────────────────────────────────────────────── */
let storyT=0;
/* ── the girl in the nightgown ────────────────────────────────────────── */
/* An Act II apparition on Main Street. She stands facing away from you and
   comes apart if you get close; three sightings and she goes in the file. */
const GIRL_SPOTS=[[32.5,12.6],[15.4,26.5],[23.5,35.4]];
const GIRL_LINES=['“Daddy’s still working. He works all night now.”',
                  '“They count us. Did you know they count us?”',
                  '“Line three. Tell them it was line three.”'];
function updateGirl(dt){
  if(S.act!==2||S.sector.id!=='street'||S.cut||(S.girlN||0)>=3) return;
  const st=SECTORS.street; let g=st.entities.find(e=>e.ghostGirl&&!e.dead);
  if(!g){ S.girlT=(S.girlT??10)-dt; if(S.girlT>0) return;
    const [x,y]=GIRL_SPOTS[S.girlN||0];
    if(Math.hypot(S.px-x,S.py-y)<9) { S.girlT=3; return; }
    g=char_('ghost_girl',x,y,{kind:'npc',ghostGirl:true,h:1.45});
    st.entities.push(g); return; }
  g.face=Math.atan2(g.y-S.py,g.x-S.px);              // always facing away
  const d=Math.hypot(S.px-g.x,S.py-g.y);
  if(d<5.5&&!g.fadeT){ g.fadeT=.001; g.look='ghost_girl_fade'; if(typeof sfx==='function') sfx('ghost'); }
  if(g.fadeT){ g.fadeT+=dt;
    if(g.fadeT>.9){ g.dead=true; const n=S.girlN||0; S.girlN=n+1; S.girlT=22; S.flags.girl_seen=true;
      say('town',GIRL_LINES[n],3.8,{now:true,name:'A girl’s voice'});
      if(S.girlN>=3){ addNote('girl'); say(S.hero,S.hero==='dean'?'Okay. That one I’m going to have nightmares about.':'She isn’t haunting the street. She’s waiting on it.',3.4); } } }
}
function updateStory(dt){
  if(S.playStart===undefined) S.playStart=S.time;
  updateGirl(dt); updateActs(dt);
  storyT-=dt; if(storyT>0) return; storyT=.4;
  for(const [f,n] of NOTE_FLAGS) if(S.flags[f]) addNote(n);
  if(S.sector.id==='trap'&&!S.flags.trap_entered){
    S.flags.trap_entered=true;
    showCard('Act II · The Lockdown','Chapter Five','The prophet on Bellweather');
  }
  if(S.sector.id==='lounge'&&!S.flags.juno_seen){ S.flags.juno_seen=true; }
  if(SUBQ.length||subCur||!COMP||COMP.hidden||S.driving) return;
  for(const c of CONVOS){
    if(S.convoDone.has(c.id)) continue;
    let ok=false; try{ ok=c.when(); }catch(e){ ok=false; }
    if(!ok) continue;
    if(!c.quietOk&&!quiet()) continue;
    S.convoDone.add(c.id);
    const lines=typeof c.lines==='function'?c.lines():c.lines;
    lines.forEach(([who,text])=>say(who,text));
    return;
  }
}

/* ── dialogue: Act I additions ──────────────────────────────────────────── */
DIALOGUE.phantom.nodes.p1.choices[0].fx.now=()=>{ S.flags.ray_named=true; };
DIALOGUE.marla.start=()=>S.flags.kevin_done&&!S.flags.marla_kevin?'mk':S.flags.marla?'m9':'m0';
DIALOGUE.marla.nodes.mk={speaker:'Marla — night clerk',
  text:"The kid hasn’t eaten in nine days. I made him soup out of a can and he cried into it, and I pretended not to see.\n\nWhatever you two are, you brought him here instead of leaving him there. Around here, that’s not nothing.",
  choices:[{text:'Thank you, Marla.',next:null,fx:{flag:'marla_kevin'}}]};
DIALOGUE.earl.nodes.e2.text=()=>{
  const a=S.act>=2?["Fog’s got the whole county boxed in. Business has never been better, and I hate it.",
                    "Some fella in a black overcoat paid off my tab this morning. I didn’t have a tab.",
                    "Radio says nothing. TV says nothing. Your money still says something. What’ll it be?"]
                  :["Back again. Still alive. Good for business.","You’re bleeding on my floor. Buy something for it.",
                    "Whatever’s in that mill, I sold Ray Hollis the same salt I’m selling you. Bear that in mind."];
  return a[(S.time|0)%a.length]; };

/* ── dialogue: Act II ───────────────────────────────────────────────────── */
const D_ = (text,next,fx,req)=>({text,next,fx,req});
Object.assign(DIALOGUE,{
  delia:{ start:'d0', nodes:{
    d0:{speaker:'A woman with black eyes',
      text:"She is pressed into the corner of the bus shelter with her hands over her ears. There’s a kitchen knife on the ground beside her, and she isn’t using it.\n\n\"Don’t, don’t say the words. Please. I’m not doing anything. I’m just in here.\" A wet laugh. \"You think I took this woman to hurt her? I took her because a body is a wall.\"",
      choices:[D_("[Knife at her throat.] A wall against what. Talk.",'d1',{align:['n',1]},isDean),
               D_("Then talk to me, and I’ll get you out of her without hurting either of you.",'d1',{align:['h',1]},isSam),
               D_("A wall against what?",'d1')]},
    d1:{speaker:'A woman with black eyes',
      text:"\"Against the thing in the fog. Hell has a filing system, hunter. Rules. Contracts. Ten years and a kiss, and everybody knows where they stand.\n\nThat thing doesn’t want your soul. It doesn’t want anything. It’s feeding, and it doesn’t care what it’s chewing.\n\nI’ve been dead four hundred years, and I have never once been afraid until this town.\"",
      choices:[D_("What is it eating?",'d2'),
               D_("You’re demons. You farm misery. This is your customer base.",'d2',{align:['n',1]},isDean)]},
    d2:{speaker:'A woman with black eyes',
      text:"\"The mood. The flat grey nothing at the bottom of a place like this. Somebody bought the mill and starved this town on purpose, but not for us. We were subcontractors.\n\nWe thinned the veil for a client. The client came through. And now the fog isn’t keeping you in, hunter. It’s keeping us in.\"",
      choices:[D_("Where did they open it?",'d3'),D_("Who’s the client?",'d3')]},
    d3:{speaker:'A woman with black eyes',
      text:"\"There’s a house on Bellweather. North end, past the pawnshop. A boy in the back room with a rock in his hands and light coming out of his eyes. Nine days he’s been reading it out loud.\n\nWhatever he’s reading, it isn’t scripture. Even I can hear that.\"\n\nFor a second her eyes go human: the woman inside, surfacing, terrified. Then black again.",
      choices:[D_("[Exorcise.] Let her go. She’s been awake this whole time.",'d_free',{align:['h',2]},isSam),
               D_("[Exorcise.] Fine. Out you go.",'d_free',{align:['h',1]},isDean),
               D_("[The knife.] Hell can have you back.",'d_kill',{align:['n',2]})]},
    d_free:{speaker:'—', port:null,
      text:"The smoke leaves her in a long black rope and goes down through the asphalt, and the woman it leaves behind sits down hard and starts to cry, which is the best sound you have heard in two days.\n\nHer name is Delia Park. She teaches seventh grade. She was awake, inside, the entire time.",
      choices:[D_("[Help her up.]",null,{flag:'delia_done',now:freeDelia})]},
    d_kill:{speaker:'—', port:null,
      text:"You do it fast, which is the only mercy on the menu.\n\nThe smoke burns off. The body slumps and does not get back up. Later, from the lanyard, you will learn that her name was Delia Park, that she taught seventh grade, and that she was awake in there the entire time.",
      choices:[D_("[Move on.]",null,{flag:'delia_done',now:killDelia})]},
  }},
  kevin:{ start:()=>SECTORS.trap.entities.some(e=>e.guard&&!e.dead&&e.kind==='enemy')?'kw':'k0', nodes:{
    kw:{speaker:'Kevin Tran',
      text:"He doesn’t look up from the tablet. His lips keep moving.\n\n\"They’re still here. They keep me reading. Please, I can’t stop while they’re—\"",
      choices:[D_("[Deal with them first.]",null)]},
    k0:{speaker:'Kevin Tran',
      text:"Nineteen, and he looks forty. The light coming from under his eyelids is the wrong colour for a room this dark. There’s a stone tablet in his lap and his hands are wrapped around it like it’s cold.\n\n\"You’re going to ask me to read it.\" His voice is very calm and completely wrecked. \"Everyone asks me to read it.\"",
      choices:[D_("I need the translation, Kevin.",'k_use',{align:['n',2]}),
               D_("No. Put it down. When did you last sleep?",'k_care',{align:['h',2]}),
               D_("Kevin, look at the syntax. That isn’t a language. It’s a loop.",'k_syntax',{align:['h',1]},()=>terminalsRead()>=2)]},
    k_care:{speaker:'Kevin Tran',
      text:"He stares at you like you’ve spoken something he had stopped expecting to hear.\n\n\"Nine days. I stopped sleeping because when I sleep I see the thing that’s writing it, and it doesn’t have a face. It has a cursor.\" He laughs, and it goes wrong halfway. \"Sorry. That sounded insane. It sounded insane when I said it, too.\n\nNobody’s asked me to stop before. Not the angels. Not God. Not either of you.\"",
      choices:[D_("Nobody’s coming to relieve you, so I will. Sleep. I’ll watch the door.",'k_rest',{align:['h',1]},isSam),
               D_("Sleep. I’ll be on the stairs with the shotgun. Nothing gets past me.",'k_rest',{align:['h',1]},isDean)]},
    k_rest:{speaker:'—', port:null,
      text:"He sleeps for eleven hours on a mattress in a house full of people sleeping for the wrong reasons, and nothing comes through the door, because you are sitting on the stairs in front of it.\n\nHe wakes up and asks for eggs. His eyes are just eyes.\n\n\"Okay,\" he says. \"Okay. Now tell me why you two are really here, because I think I know what this tablet is, and I really, really hope I’m wrong.\"",
      choices:[D_("[Tell him about the mill, the tear, the fog.]",'k_reveal',{flag:'kevin_rested',now:()=>{ const k=kevinEnt(); if(k){ k.look='kevin'; k.pose=undefined; } }})]},
    k_use:{speaker:'—', port:null,
      text:"He reads for four hours. Something behind his face gives way around hour three, and he keeps going, because you asked, and because being useful is the only reason anybody has given him to still be here.\n\nWhen he stops, he can tell you exactly what the tablet says. He cannot tell you what year it is.",
      choices:[D_("[Take the translation.]",'k_drafted',{flag:'kevin_used'})]},
    k_drafted:{speaker:'Kevin Tran',
      text:"\"Don’t. Don’t do the greater-good thing. I did four semesters of ethics, I know the speech and I know the objection to it.\n\nLook at my hands. Look at my eyes. You, your brother, the angels, God: every one of you looks at me and sees a modem. Plug the kid in, the kid makes the noise.\n\nI was supposed to go to Princeton. You didn’t save me. You drafted me.\"",
      choices:[D_("[Say nothing.]",'k_reveal'),D_("…You’re right.",'k_reveal')]},
    k_syntax:{speaker:'Kevin Tran',
      text:"He takes the printouts. The alley terminal. The mill. The pawnshop.\n\nHis hands stop shaking, which is somehow worse.\n\n\"That’s not Enochian. It isn’t any angelic tongue, and I have read all of them.\" A long pause. \"That’s a while loop. That’s a while loop with a yield in it.\n\nWhy does the word of God have a scheduler?\"",
      choices:[D_("Keep pulling that thread.",'k_care',{flag:'kevin_syntax'})]},
    k_reveal:{speaker:'Kevin Tran',
      text:"\"Oakhaven isn’t being invaded. It’s being harvested.\n\nThe despair isn’t a side effect of the haunting. The despair is the crop. Somebody thinned the veil on purpose, then made sure this town had nothing left to feel. No work. No way out. Nothing but the hum. A flat, grey, hopeless town is easier to eat than a happy one.\n\nThe demons didn’t do the hard part. A holding company did.\"",
      choices:[D_("We’re getting you out of here. Marla runs the motel. She’ll look after you.",null,{flag:'kevin_done',then:()=>playCutscene('harvest')})]},
  }},
  kevin_motel:{ start:()=>S.flags.kevin_used?'u0':'r0', nodes:{
    r0:{speaker:'Kevin Tran',
      text:"He’s wrapped in one of Marla’s blankets with a bowl of soup he hasn’t finished. He looks nineteen again, which is to say very young.\n\n\"Marla says I can stay as long as the fog does. I don’t think she’s joking.\" A pause. \"Thank you. For telling me to stop. I’m going to be thinking about that for a long time.\"",
      choices:[D_("Get some sleep, Kevin.",null,{flag:'kevin_checked'}),
               D_("When this is over, Princeton still exists.",'r1',null,isSam)]},
    r1:{speaker:'Kevin Tran',
      text:"\"Does it? Everything I’ve read this week says nothing exists the way we think it does.\" He almost smiles. \"But okay. Okay. Princeton still exists.\"",
      choices:[D_("[Leave him to rest.]",null,{flag:'kevin_checked'})]},
    u0:{speaker:'Kevin Tran',
      text:"He’s sitting where Marla put him, very still, the light still leaking at the edges of his eyes. He doesn’t look up.\n\n\"I can still hear it, you know. Every time I close my eyes, it’s mid-sentence.\"",
      choices:[D_("[Say nothing.]",null,{flag:'kevin_checked'}),D_("I’m sorry, Kevin.",'u1')]},
    u1:{speaker:'Kevin Tran',
      text:"\"I know you are. That’s the worst part. Being sorry doesn’t change what anybody does next time.\"",
      choices:[D_("[Leave.]",null,{flag:'kevin_checked'})]},
  }},
  juno:{ port:'juno', start:()=>S.flags.juno_met?'j9':'j0', nodes:{
    j0:{speaker:'Juno — the Velvet Hour',
      text:"The lounge is lit like the inside of a closed mouth. Low red lamps, a jukebox playing something slow, and a handful of people sitting very still at separate tables.\n\nThe woman behind the bar has not moved since you came in. \"Hunters. You can put that away. Nobody here is going to fight you. Nobody here is going to do anything at all. That’s rather the point.\"",
      choices:[D_("What do you sell here?",'j1'),D_("Pour me one. Then talk.",'j_drink',null,isDean),
               D_("What’s in the little vial behind the bar?",'j_vial',null,isSam)]},
    j1:{speaker:'Juno — the Velvet Hour',
      text:"\"Quiet. A town like this hurts all the time, so I sell the absence of it. Pain is a tax, hunter, and I’m the loophole.\n\nThey come in, they sit, they stop feeling for a few hours. I don’t even take their souls. Management prefers them like this.\"",
      choices:[D_("Management.",'j2')]},
    j2:{speaker:'Juno — the Velvet Hour',
      text:"\"Somebody upstairs wants this town flat. Numb. Sedated. Not hurting, exactly, just not caring whether it hurts. You’d be amazed how much more a place like that will put up with.\n\nI don’t ask why. I’m paid in peace and quiet, same as them.\"",
      choices:[D_("You’re anaesthetising people so something can eat them.",'j3',{align:['h',1]},isSam),
               D_("So you’re the dealer. Not the farmer.",'j3',null,isDean),
               D_("[Leave.]",null,{flag:'juno_met'})]},
    j3:{speaker:'Juno — the Velvet Hour',
      text:"\"Everybody in this town is somebody’s crop, sugar. At least my customers enjoy the harvest.\"",
      choices:[D_("[Leave.]",null,{flag:'juno_met'})]},
    j_drink:{speaker:'—', port:null,
      text:"She pours something amber and old without asking what you want. It goes down like a closing door, and for a few minutes the hum in the walls is very far away.\n\nSomething at the back of your skull files it away as a solution.",
      choices:[D_("[Set the glass down.] Now talk.",'j1',{heal:30,align:['n',1],flag:'dean_drank',now:()=>addNote('dean_drank')})]},
    j9:{speaker:'Juno — the Velvet Hour',
      text:()=>S.act>=2?"\"Fog’s good for business. Nobody even pretends they’re going anywhere now.\"":"\"Back so soon? Careful, hunter. That’s how it starts.\"",
      choices:[D_("[Leave.]",null)]},
  }},
  crowley:{ port:'crowley', start:'c0', nodes:{
    c0:{speaker:'A man in a black overcoat, leaning on the Impala',
      text:"It is raining everywhere except on him.\n\n\"Boys. Put the iron away, you’re embarrassing us both.\" He flicks a speck of nothing off his lapel. \"Crowley. King of the Crossroads, if you’re into titles. I believe you’ve been reading my mail.\"",
      choices:[D_("Crossroads Holdings. You bought the mill.",'c1'),
               D_("[Draw.] Give me one reason.",'c1',{align:['n',1]},isDean),
               D_("You’re here because you need something.",'c1',{align:['h',1]},isSam)]},
    c1:{speaker:'Crowley',
      text:"\"Yes, I hollowed it out. That isn’t a demonic act, darling, that’s a Tuesday in Delaware. I filed the same paperwork as everybody else. The only difference is that I knew what the buyer wanted it for.\n\nAnd before you get righteous: so did the buyer’s lawyers.\"",
      choices:[D_("Who’s the buyer?",'c2')]},
    c2:{speaker:'Crowley',
      text:"\"No idea. Truly. Everything in my portfolio wants something. A soul, ten years, a kiss. This one has no ask. You can’t negotiate with an appetite. You can only be further from it than the other fellow, and that fog has made distance rather hard to come by.\"",
      choices:[D_("So you want our help.",'c3')]},
    c3:{speaker:'Crowley',
      text:"\"I want my town back on the books. You want the people in it alive. Our interests align for about a week, which is longer than most marriages.\n\nI’ll stock Earl’s shelves with things he can’t get. A blade that kills what I am. A page from a book you will never find. In return—\"",
      choices:[D_("[Accept.] A favour. Named later.",'c_deal',{align:['n',1],flag:'crowley_deal'}),
               D_("[Refuse.] We don’t make deals.",'c_no',{align:['h',1]}),
               D_("[Shoot him.] Here’s my counter-offer.",'c_shot',{align:['n',2]},isDean)]},
    c_deal:{speaker:'—', port:null,
      text:"\"Splendid.\"\n\nSomething heavy and wrapped in oilcloth is lying on the hood of the Impala that wasn’t there before. When you look up, he’s gone, and the rain has started falling on the spot where he stood.",
      choices:[D_("[Take it.]",null,{flag:'crowley_done',now:()=>{ own('knife'); learnRite('sigil'); toast('Demon-killing knife · Sigillum Salomonis'); }})]},
    c_no:{speaker:'—', port:null,
      text:"\"Principles. Adorable.\" He sighs. \"Earl’s shelves will be stocked anyway. Call it a free sample. I’m a patient investor.\"\n\nWhen you look up, he’s gone.",
      choices:[D_("[Let him go.]",null,{flag:'crowley_done'})]},
    c_shot:{speaker:'—', port:null,
      text:"The shot goes through him and into the motel sign. He looks down at the hole in his coat with mild professional disappointment.\n\n\"Twenty years of this, and you still lead with the gun. I’ll put it on your account.\"\n\nHe’s gone before the echo is.",
      choices:[D_("[Lower the gun.]",null,{flag:'crowley_done',now:()=>sfx('shotgun')})]},
  }},
});
function terminalsRead(){ return ['street','mill','pawn'].filter(k=>S.flags['term_'+k]).length; }
function kevinEnt(){ for(const id of ['trap','motel']){ const k=SECTORS[id].entities.find(e=>e.name==='Kevin Tran'&&!e.dead); if(k) return k; } return null; }

/* ── Act II mechanics ───────────────────────────────────────────────────── */
function deliaEnt(){ return SECTORS.street.entities.find(e=>e.name==='Delia Park'||e.dialogue==='delia'); }
function spawnDelia(){
  if(deliaEnt()) return;
  SECTORS.street.entities.push(char_('possessed_delia',16.6,26.7,{kind:'npc',dialogue:'delia',name:'the woman in the bus shelter',
    face:-Math.PI/2,pose:4,h:1.78}));
}
function freeDelia(){
  const e=deliaEnt(); if(!e) return;
  Object.assign(e,{look:'delia',kind:'walker',dialogue:undefined,talk:'delia_free',name:'Delia Park',pose:undefined,speed:.25});
  spawnParts(e.x,e.y,1.1,30,PCOL.smoke,{up:2.4}); S.freed++; addNote('delia_freed'); sfx('riteEnd');
}
function killDelia(){
  const e=deliaEnt(); if(!e) return;
  e.dead=true; S.flags.delia_killed=true; spawnParts(e.x,e.y,.6,20,PCOL.blood); spawnParts(e.x,e.y,1.2,16,PCOL.smoke,{up:2});
  addNote('delia_killed'); sfx('stab');
  say(isDean()?'sam':'dean',isDean()?'Dean… she was still in there.':'Sam. Hey. It was the only call.');
}
function moveKevin(){
  const k=kevinEnt(); if(!k) return;
  SECTORS.trap.entities=SECTORS.trap.entities.filter(e=>e!==k&&e.m!=='tablet');
  Object.assign(k,{x:15,y:11.2,dialogue:'kevin_motel',face:-Math.PI/2,pose:undefined});
  if(!S.flags.kevin_used) k.look='kevin';
  SECTORS.motel.entities.push(k);
}
function spawnCrowley(){
  if(S.flags.crowley_spawned) return; S.flags.crowley_spawned=true;
  const car=SECTORS.street.entities.find(e=>e.name==='Impala');
  const x=car?car.x+1.55:30.6, y=car?car.y-1.4:38.6;
  SECTORS.street.entities.push(char_('crowley',x,y,{kind:'npc',dialogue:'crowley',name:'the man by the Impala',h:1.8,face:-Math.PI/2}));
  const o=OBJECTIVES.find(o=>o.id==='crowley'); if(o){ o.x=x; o.y=y; }
}
function endAct2(){
  const c=SECTORS.street.entities.find(e=>e.look==='crowley'&&!e.dead);
  if(c){ c.dead=true; spawnParts(c.x,c.y,1,26,PCOL.smoke,{up:2}); }
  showCard('End of Act II','The town is a farm','Somebody owns the field.',{dur:6});
  startAct3();
}
function startLockdown(){
  const c=S.driving; if(c){ c.speed=0; S.driving=null; S.highBeam=false; }
  if(COMP) COMP.hidden=false;
  playCutscene('lockdown');
}
function killLamp(x,y){
  const st=SECTORS.street;
  for(const L of st.lights) if(Math.abs(L.x-x)<.1&&Math.abs(L.y-y)<.1) L.off=true;
  for(const e of st.entities) if(e.m==='lamp'&&Math.abs(e.x-x)<.1&&Math.abs(e.y-y)<.1){ e.m='lampOff'; e.emit=0; }
  pack(st); sfx('dry');
}
function raiseFog(){
  const st=SECTORS.street;
  for(let x=0;x<st.W;x++){ st.grid[0][x]='S'; st.grid[st.H-1][x]='S'; }
  for(let y=0;y<st.H;y++){ st.grid[y][0]='S'; st.grid[y][st.W-1]='S'; }
  pack(st); sfx('tear'); S.shake=.45;
}

/* ── objectives: Act I hooks, then Act II ───────────────────────────────── */
{
  const O=id=>OBJECTIVES.find(o=>o.id===id);
  O('ask').onDone=()=>showCard('Act I · The Wages of Sin','Chapter Two','The green chain');
  O('mill').onDone=()=>showCard('Act I · The Wages of Sin','Chapter Three','What eats the dead');
  O('car').detail='Two of the townspeople have black eyes now. The rite can still save them. Then get in the car.';
  O('car').onDone=startLockdown;
  OBJECTIVES.push(
    {id:'delia', act:2, title:'Find out what the demons are hiding from', sector:'street', x:16.6, y:26.7, reward:20,
     detail:'One of them is not attacking. She is hiding in the bus shelter on the cross street with her hands over her ears.',
     done:()=>S.flags.delia_done},
    {id:'bellweather', act:2, title:'Go to the house on Bellweather', sector:'trap', x:9, y:12.6, reward:0,
     detail:'North end, past the pawnshop. Somebody has been reading something aloud for nine days.',
     done:()=>S.flags.trap_entered},
    {id:'kevin', act:2, title:'Find whoever is reading', sector:'trap', x:4.5, y:5.6, reward:25,
     detail:'Two of the frightened ones are keeping him at it. The rite works on both.',
     done:()=>S.flags.kevin_done},
    {id:'motel', act:2, title:'Check on Kevin at the motel', sector:'motel', x:15, y:11.2, reward:10,
     detail:'Marla took him in. Somebody should make sure he ate.',
     done:()=>S.flags.kevin_checked, onDone:spawnCrowley},
    {id:'crowley', act:2, title:'Someone is leaning on the Impala', sector:'street', x:30.6, y:38.6, reward:40,
     detail:'A man in a black overcoat, standing in the rain, perfectly dry.',
     done:()=>S.flags.crowley_done, onDone:endAct2},
  );
}

/* ── cutscenes ──────────────────────────────────────────────────────────── */
CUTSCENES.lockdown=function(){
  const st=SECTORS.street, car=st.entities.find(e=>e.name==='Impala');
  return {
    dur:15.6, letterbox:true,
    setup(){ if(S.sector!==st) enterSector('street',28,34,-Math.PI/2);
      /* clear the camera's sightline down Main Street */
      for(const e of st.entities) if(e.kind==='walker'&&e.x>24&&e.x<32&&e.y>14&&e.y<38){ e.x=e.x<28?22.2:33.6; e.tx=undefined; e.waitT=16; } },
    cam:[{t:0,x:28,y:36,a:-Math.PI/2,z:0},{t:5.5,x:28,y:34.5,a:-Math.PI/2,z:.02},
         {t:7.5,x:28,y:33.5,a:-Math.PI/2-.08,z:.04},{t:11.5,x:28,y:32.5,a:-Math.PI/2+.1,z:.03},
         {t:15.6,x:28,y:32.5,a:-Math.PI/2,z:0}],
    ascii:[{t:0,v:0},{t:6.4,v:0},{t:7.0,v:.55},{t:8.2,v:.12},{t:9,v:0},{t:15.6,v:0}],
    subs:[{t:.4,who:'narr',text:'Then the streetlights go out.'},
          {t:2.4,who:'narr',text:'Not all at once. One at a time, like somebody walking down Main Street with a switch.'},
          {t:6.9,who:'narr',text:'And the fog comes in off the hills and does not stop at the town line. It stops exactly at the town line.'},
          {t:10.8,who:'dean',text:'Tell me you saw that.'},
          {t:12.3,who:'sam',text:'Every road out ends in that. All of them.'},
          {t:13.9,who:'dean',text:'Then we’re not leaving. Fine. We weren’t going to anyway.'}],
    events:[{t:1.4,fn:()=>killLamp(31.5,38)},{t:2.6,fn:()=>killLamp(24,29)},
            {t:3.8,fn:()=>killLamp(31.5,17)},{t:5.0,fn:()=>killLamp(24,9)},{t:6.6,fn:raiseFog}],
    end(){
      const cx=car?car.x:29, cy=car?car.y:40;
      S.px=cx-1.4; S.py=cy-.6; if(hits(st,S.px,S.py,PR)){ S.px=cx; S.py=cy-1.6; }
      S.angle=-Math.PI/2; S.posZ=0; S.z=0;
      if(COMP){ COMP.hidden=false; COMP.x=cx+1.4; COMP.y=cy-.6; if(hits(st,COMP.x,COMP.y,COMP.r)){ COMP.x=S.px; COMP.y=S.py-.9; } }
      S.act=2; S.actStart=S.time; addNote('lockdown'); spawnDelia();
      showCard('Act II · The Lockdown','Chapter Four','Bodies are walls');
    },
  };
};
CUTSCENES.harvest=function(){
  const k=kevinEnt(), save={x:S.px,y:S.py,a:S.angle}, kx=k?k.x:4.5, ky=k?k.y:4.2;
  return {
    dur:13, letterbox:true,
    cam:[{t:0,x:8.2,y:10.4,a:ang(8.2,10.4,kx,ky),z:0},{t:6,x:6.6,y:7.4,a:ang(6.6,7.4,kx,ky),z:-.03},
         {t:10,x:6,y:6.6,a:ang(6,6.6,kx,ky),z:-.05},{t:13,x:save.x,y:save.y,a:save.a,z:0}],
    ascii:[{t:0,v:0},{t:3.8,v:0},{t:4.6,v:.7},{t:5.6,v:.2},{t:7,v:0},{t:13,v:0}],
    subs:[{t:.4,who:'kevin',text:'It isn’t an invasion. It’s a farm.'},
          {t:3,who:'kevin',text:'And the fog isn’t a wall. It’s a fence.'},
          {t:6,who:'dean',text:'So who owns the field?'},
          {t:7.8,who:'kevin',text:'Whoever bought the mill.'},
          {t:9.4,who:'sam',text:'Crossroads Holdings.'},
          {t:11,who:'kevin',text:'Then whoever owns Crossroads.'}],
    events:[{t:4.2,fn:()=>{ sfx('tear'); S.shake=.35; }}],
    end(){ S.px=save.x; S.py=save.y; S.angle=save.a; S.posZ=0; S.flags.harvest=true; moveKevin();
      showCard('Act II · The Lockdown','Chapter Six','The field and its owner'); },
  };
};
