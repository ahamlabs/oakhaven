/* ═══ Seven more cases ══════════════════════════════════════════════════════
   Built on the shared systems: evidence (observed) vs witnesses (claimed),
   deductions, a committed theory, a three-way decision, witness trust,
   the brothers' preferences, the autopsy and the Ledger. Each one answers a
   small question and raises a bigger one, and each leaves something in
   another case that changes how it reads.

     10  The Dead Man on the Radio           Act I    (payoff Act III)
     11  The Man Who Came Back Wrong         Act II
     12  The Inventory of Things That Never Existed   Act II (return Act IV)
     13  The Contract Nobody Signed          Act II
     14  The Saint in the Walls              Act II
     15  The Children Who Draw the Same Sky  Act II   (payoff Act IV)
     16  The Last Broadcast                  Act IV                         */

/* ── shared art ─────────────────────────────────────────────────────────── */
Object.assign(SPR,{
  cassette: art(14,10,A=>{ A.rect(0,0,13,9,C([40,40,44])); A.rect(2,2,11,6,C([220,210,180])); A.disc(4.5,4,1.4,C([30,30,30])); A.disc(9.5,4,1.4,C([30,30,30])); A.outline(rgb(8,8,8)); }),
  console: art(34,24,A=>{ A.rect(0,6,33,23,C([70,74,70])); A.rect(2,8,31,14,C([20,24,20])); for(let x=4;x<30;x+=3) A.set(x,10+((x*7)%4),glow(255,170,60));
    A.disc(8,18,2.4,C([160,150,130])); A.disc(16,18,2.4,C([160,150,130])); A.rect(22,16,30,21,C([40,40,40])); A.rect(4,0,6,6,C([120,120,120])); A.outline(rgb(8,8,8)); }),
  desk: art(40,18,A=>{ const w=[96,70,44]; A.rect(0,2,39,6,C(w)); A.rect(1,7,6,17,C(dk(w,.8))); A.rect(33,7,38,17,C(dk(w,.8))); A.rect(8,0,16,2,C([220,214,200])); A.shade(.15); A.outline(rgb(10,8,6)); }),
  shoe: art(12,8,A=>{ A.ell(6,5,5.5,2.6,C([180,60,70])); A.rect(1,6,11,7,C([230,230,224])); A.rect(4,2,7,4,C([230,230,224])); A.outline(rgb(10,8,8)); }),
  ring: art(8,8,A=>{ A.disc(4,4,3.2,C([220,190,90])); A.disc(4,4,1.8,0); A.set(4,1,glow(255,250,220)); }),
  watch: art(10,12,A=>{ A.rect(3,0,6,11,C([90,60,40])); A.disc(4.5,6,3.6,C([180,170,150])); A.disc(4.5,6,2.6,C([230,226,210])); A.line(4.5,6,4.5,4,C([20,20,20])); A.line(4.5,6,6,6,C([20,20,20])); A.outline(rgb(8,8,8)); }),
  key: art(12,6,A=>{ A.disc(2.5,3,2.4,C([190,160,80])); A.disc(2.5,3,1,0); A.rect(4,2,11,3,C([190,160,80])); A.rect(9,4,10,5,C([190,160,80])); }),
  mural: art(40,34,A=>{ A.rect(0,0,39,33,C([150,130,100])); A.ell(20,12,7,8,C([210,190,150])); A.rect(14,18,26,32,C([80,90,130]));
    for(let i=0;i<70;i++){ const x=Math.random()*40|0, y=Math.random()*34|0; A.set(x,y,C([110,30,30])); } A.disc(20,9,9,C([230,200,90])); A.ell(20,12,6,7,C([210,190,150])); A.shade(.1); A.outline(rgb(20,14,10)); }),
  stain: art(16,22,A=>{ A.ell(8,7,5,6,C([90,14,18])); for(let i=0;i<5;i++) A.rect(2+i*3,8,3+i*3,10+i%3*4,C([90,14,18])); A.ell(8,16,2,5,C([70,10,14])); }),
  telescope: art(30,34,A=>{ A.line(15,33,6,22,C([60,60,64])); A.line(15,33,24,22,C([60,60,64])); A.line(15,33,15,22,C([60,60,64]));
    for(let i=0;i<=22;i++){ const t=i/22; A.disc(10+t*14,22-t*18,2.4+(1-t)*1.6,C([200,196,186])); } A.disc(25,4,3,C([40,60,90])); A.shade(.2); A.outline(rgb(8,8,10)); }),
  stones: art(40,10,A=>{ for(let i=0;i<14;i++){ const a=i/14*Math.PI*2; A.disc(20+Math.cos(a)*16,5+Math.sin(a)*3.4,1.6,C([150,146,140])); } A.line(4,5,36,5,C([200,196,190])); A.disc(26,3,1.4,C([40,40,44])); }),
  reel: art(16,16,A=>{ A.disc(8,8,7.6,C([70,70,76])); A.disc(8,8,6,C([30,30,34])); for(let a=0;a<3;a++){ const t=a*2.09; A.disc(8+Math.cos(t)*3.4,8+Math.sin(t)*3.4,1.6,C([150,150,156])); } A.disc(8,8,1.4,C([150,150,156])); A.outline(rgb(6,6,6)); }),
});
Object.assign(LOOKS,{
  evelyn: {skin:[214,180,156], hair:{style:'bun',col:[150,90,60]}, eyes:{col:[90,110,90]}, lip:[170,110,104], top:{kind:'cardigan',col:[90,90,120],underCol:[226,220,210]}, legs:{kind:'slacks',col:[60,60,70]}, shoes:[50,40,40], extras:['lanyard']},
  glenn:  {skin:[202,160,128], hair:{style:'short',col:[110,80,50]}, stubble:true, beard:[110,84,60], eyes:{col:[80,100,80]}, top:{kind:'flannel',col:[120,60,40],col2:[40,30,24]}, legs:{kind:'jeans',col:[50,56,74]}, shoes:[50,36,26]},
  carol:  {skin:[222,184,156], hair:{style:'long',col:[180,140,80]}, eyes:{col:[80,100,120]}, lip:[180,110,110], top:{kind:'cardigan',col:[80,110,130],underCol:[226,220,210]}, legs:{kind:'jeans',col:[60,70,90]}, shoes:[60,50,44]},
  naomi:  {skin:[120,84,64], hair:{style:'curly',col:[30,22,18]}, eyes:{col:[60,46,36]}, lip:[130,70,70], top:{kind:'overalls',col:[150,110,60],underCol:[200,200,190]}, legs:{kind:'overalls'}, shoes:[50,40,30]},
  collector:{skin:[190,180,170], hair:{style:'short',col:[20,20,22]}, eyes:{kind:'black'}, top:{kind:'suit',col:[40,40,46],tie:[120,20,20]}, legs:{kind:'slacks',col:[36,36,40]}, shoes:[16,16,16], tint:[60,40,50], tintAmt:.2},
  ned:    {skin:[206,164,138], hair:{style:'bald',col:[200,196,190]}, beard:[214,210,204], eyes:{}, top:{kind:'chore',col:[90,80,60]}, legs:{kind:'slacks',col:[70,64,56]}, shoes:[50,40,30], hat:{kind:'cap',col:[60,56,50]}},
  curtis: {skin:[196,150,116], hair:{style:'messy',col:[90,70,50]}, eyes:{}, top:{kind:'vest',col:[226,118,34],underCol:[120,124,128],stripe:[238,238,222]}, legs:{kind:'jeans',col:[52,64,96]}, shoes:[66,48,30]},
  okoro:  {skin:[110,76,58], hair:{style:'buzz',col:[24,20,18]}, eyes:{}, top:{kind:'jacket',col:[110,100,80],underCol:[220,214,200],open:true,tie:[40,60,100]}, legs:{kind:'slacks',col:[60,56,50]}, shoes:[40,30,24]},
  lou:    {skin:[214,176,150], hair:{style:'wild',col:[170,170,166]}, eyes:{}, top:{kind:'cardigan',col:[70,60,50],underCol:[200,190,170]}, legs:{kind:'slacks',col:[50,50,56]}, shoes:[40,34,30], extras:['lanyard']},
});
Object.assign(SPEAKERS,{evelyn:{name:'Evelyn Marsh',col:'#c8b0d8'},glenn:{name:'Glenn Reed',col:'#d0a078'},carol:{name:'Carol Reed',col:'#a8c8d8'},mia:{name:'Mia Reed',col:'#e8c0c8'},
  naomi:{name:'Naomi Price',col:'#d8c070'},collector:{name:'The collector',col:'#b06070'},ned:{name:'Ned Bowles',col:'#b8b098'},curtis:{name:'Curtis Kemp',col:'#d89060'},
  okoro:{name:'Mr. Okoro',col:'#a8c8a0'},lou:{name:'Lou Ferris',col:'#c0b0a0'},radio:{name:'',col:'#d0c8a0'}});
/* small helpers */
const rmt=(id,name,W,H,o={})=>{ const g=Grid(W,H,o.floor||' '); box(g,0,0,W-1,H-1,o.wall||'S');
  return {id,name,grid:g,outdoor:o.outdoor!==false,ambient:o.amb||.38,region:o.region||id,spawn:o.spawn,doors:{},lights:o.lights||[],pois:o.pois||[],entities:[]}; };
const use_=(m,x,y,use,useName,o={})=>Object.assign({kind:'prop',m,x,y,r:o.r||.15,h:o.h||.4,z:o.z||0,use,useName},o);
const npc_=(look,x,y,dlg,name,o={})=>char_(look,x,y,Object.assign({kind:'npc',dialogue:dlg,name,h:o.h||1.78},o));
const menu_=(title,text)=>openMenu(title,text,[{text:'Step back'}]);

/* ═══ 10 · The Dead Man on the Radio ═════════════════════════════════════
   The sheriff's dispatch radio keeps receiving calls from people who have
   not died yet, and once from someone who is sitting in the room. */
{ const st=SECTORS.street, g=st.grid; box(g,34,1,50,3,'#'); rect(g,36,1,40,1,'G'); g[3][42]='+';
  st.doors['42,3']={to:'station',x:6.5,y:7.4,a:-Math.PI/2}; st.pois.push({x:42.5,y:3.5,name:'Sheriff’s station',kind:'door'}); pack(st); }
{ const s=room('station','Sheriff’s station',14,9,'#',.32,'o'); s.ceilH=1.4;
  rect(s.grid,8,1,8,4,'#'); s.grid[3][8]='o'; s.grid[8][6]='+';
  s.doors={'6,8':{to:'street',x:42.5,y:4.6,a:Math.PI/2}}; s.spawn={x:6.5,y:7.4,a:-Math.PI/2};
  s.lights=[{x:4,y:3,p:1.6,f:.2},{x:11,y:2.5,p:1.2,f:.3}]; s.pois=[{x:6.5,y:8.5,name:'Out',kind:'door'}];
  s.entities=[{kind:'prop',m:'desk',x:3.6,y:4.2,r:.6,h:.8},use_('paper',3.6,4.1,'rd_log','The dispatch log',{z:.45,h:.3}),
    npc_('sheriff',3.4,2.4,'ames_station','Sheriff Ames',{h:1.85,face:Math.PI/2,station:true}),
    {kind:'prop',m:'console',x:11,y:1.6,r:.4,h:.75,z:.3,use:'rd_console',useName:'The dispatch radio'},
    npc_('evelyn',11.2,3,'evelyn','Evelyn Marsh',{face:-Math.PI/2}),
    use_('cassette',12.6,5.4,'rd_tapes','A shoebox of cassettes',{z:.4,h:.2}),{kind:'prop',m:'counter',x:12.6,y:5.6,r:.45,h:.8}];
  addSector(s); }
const RD={calls:0};
USES.rd_log=()=>{ S.flags.rd_log=true; menu_('The dispatch log',"Every call this year, in Evelyn’s neat hand. Time, caller, location, response.\n\nThe last six weeks are wrong. A call at 1:31 a.m. from a man trapped on line three, two nights before Ray Hollis died there. A woman on the river path, three nights before Pete Lindqvist walked into the water. Each one marked RESPONDED · NOTHING FOUND.\n\nThe entry for tonight is already filled in:\n\n2:12 a.m. Caller: SHERIFF R. AMES. Location: this office. “Is anybody receiving this.”"); };
USES.rd_console=()=>{ const F=S.flags; F.rd_console=(F.rd_console||0)+1; sfx('static');
  const calls=[
    ['radio','…this is Joan. Joan Pike. I’m out past the reeds. Walter? Walter, tell him to stop rowing. Tell him to stop rowing.','Unit 3, channel 9'],
    ['radio','…stop. Stop the car. There’s somebody in the road at the cross street. He’s old, he’s got a cane, he’s— oh God. Twenty-three past. Somebody be there at twenty-three past.','channel 9'],
    ['radio','Sam? …Sam?','channel 9, no caller ID']];
  const i=Math.min(calls.length-1,F.rd_console-1), c=calls[i];
  if(i===0) F.rd_joan=true; if(i===1){ F.rd_gus=true; if(!F.rd_gus_t) F.rd_gus_t=S.time; } if(i===2) F.rd_future=true;
  say(c[0],c[1],null,{now:true,name:c[2]});
  if(i===2) later(4,()=>say(S.hero,isDean()?'…That was me. That was my voice. I didn’t say that.':'That was Dean. Dean, that was your voice.',4));
};
USES.rd_tapes=()=>{ S.flags.rd_tapes=true; menu_('The cassettes','Forty tapes, labelled by date. Evelyn has recorded every call since the first one.\n\nUnder every call, on every tape, at the very bottom of the hiss, there is a sound like somebody typing. Fast. Confident. Pausing, sometimes, the way a writer pauses before a good line.'); };
Object.assign(DIALOGUE,{
  evelyn:{ port:'evelyn', start:()=>S.flags.rd_evelyn?'e9':'e0', nodes:{
    e0:{speaker:'Evelyn Marsh — dispatch',text:"She has headphones round her neck and a pencil behind each ear. There are three cold coffees on the console.\n\n\"You hear it too? Good. Good. Then I’m not— good.\" She taps the log. \"They call before. Every one of them called before. If I can find the first call, the very first one, I can stop the rest. I just have to listen to all of them.\"",
      choices:[D_("[Sam] When did you last answer a real call, Evelyn?",'e1s',null,isSam),D_("[Dean] When did you last sleep?",'e1d',null,isDean),D_("Who was the first caller?",'e2')]},
    e1s:{speaker:'Evelyn Marsh — dispatch',text:"A long silence.\n\n\"There was a woman on Tuesday. A real one. Her husband had fallen. I thought it was one of them, so I logged it and listened for the next one.\" She pulls the headphones up over her ears. \"He’s okay. He’s okay, I think. Somebody went. I think somebody went.\"",
      choices:[D_("[Leave her be.]",null,{flag:'rd_evelyn',now:()=>{ S.flags.rd_missed=true; trust('evelyn',1); }})]},
    e1d:{speaker:'Evelyn Marsh — dispatch',text:"\"Sleep is when the calls come in.\" She doesn’t look up. \"Go away. You’re standing on the cable.\"",
      choices:[D_("[Leave her be.]",null,{flag:'rd_evelyn',now:()=>trust('evelyn',-1)})]},
    e2:{speaker:'Evelyn Marsh — dispatch',text:"\"February. A little girl. She said ‘is it 2:40 there too’ and then she coughed for eleven seconds and hung up.\" Evelyn’s pencil snaps. \"I know who it was. I know who it was. She hadn’t died yet. She died in April.\"",
      choices:[D_("[Leave her be.]",null,{flag:'rd_evelyn',now:()=>{ S.flags.rd_first=true; }})]},
    e9:{speaker:'Evelyn Marsh',text:"\"Shh. Shh. There’s one coming.\"",choices:[D_("[Leave.]",null)]},
  }},
  ames_station:{ port:'sheriff', start:'a0', nodes:{
    a0:{speaker:'Sheriff Ames',text:()=>"He is sitting at his own desk, very still, holding the handset of a radio that isn’t switched on.\n\n\"We sent a car every time. Every time. Nothing there. Then two nights later, there’s something there.\""+(S.flags.rd_log?"\n\nYou show him tonight’s entry. 2:12 a.m. Caller: Sheriff R. Ames. He reads it twice.\n\n\"That’s not funny.\" It isn’t. He doesn’t put the handset down.":""),
      choices:[D_("[Leave.]",null,{flag:'rd_ames'})]} }},
});
/* following the impossible call: Old Gus at the cross street at 2:23 */
INV_UPDATES.push(dt=>{ const F=S.flags; if(!F.rd_follow||F.rd_follow_done) return;
  F.rd_follow_t=(F.rd_follow_t??60)-dt;
  const gus=SECTORS.street.entities.find(e=>e.name==='Old Gus'&&!e.dead), car=SECTORS.street.entities.find(e=>e.kind==='car'&&!e.dead);
  if(gus&&!F.rd_gus_placed){ F.rd_gus_placed=true; gus.x=26.5; gus.y=22.8; gus.waitT=999; gus.speed=0; }
  if(F.rd_follow_t<=0){ F.rd_follow_done=true;
    if(F.rd_car_stopped){ say('narr','Twenty-three past. The rust-red sedan sits dead at the kerb with its lights off. Old Gus finishes crossing the street, very slowly, and never knows.',5.5,{now:true});
      later(6,()=>{ say('narr','Across town, at twenty-three past, the payphone outside the motel rings once and stops.',4); }); F.rd_saved=true; }
    else if(gus&&Math.hypot(S.px-gus.x,S.py-gus.y)<2.5){ gus.x=24; gus.y=21; F.rd_moved_gus=true;
      say('narr','You pull Old Gus back onto the kerb at twenty-three past. The sedan goes by with nobody at the wheel. At the far end of the cross street, it clips Tyler instead.',6,{now:true});
      const t=SECTORS.street.entities.find(e=>e.name==='Tyler'); if(t){ t.hurtT=1; t.talk='teen_hurt'; } }
    else { if(gus){ gus.dead=true; spawnParts(gus.x,gus.y,.6,14,PCOL.blood); } F.rd_gus_dead=true; S.freedNames=(S.freedNames||[]).filter(n=>n!=='Old Gus');
      say('narr','Twenty-three past. You hear it from three streets away.',4,{now:true}); }
    later(6.5,()=>closeCase('radio')); } });
SECTORS.street.entities.filter(e=>e.kind==='car').forEach(c=>{ c.use='rd_stopcar'; c.useName='Flag the car down'; });
USES.rd_stopcar=e=>{ if(!S.flags.rd_follow||S.flags.rd_follow_done){ say('narr','The rust-red sedan goes by. You can’t see a driver through the glare.',3,{now:true}); return; }
  e.speed=0; S.flags.rd_car_stopped=true; sfx('engine'); say('narr','You step out in front of the sedan with both hands up. It stops a foot from your knees. There is nobody in the driver’s seat. The engine keeps running for a while, then doesn’t.',6,{now:true}); };
TOWN_TALK.teen_hurt={2:['My leg’s fine. It’s fine. The car didn’t have anybody in it, man.'],1:['My leg’s fine. The car didn’t have anybody in it.']};
function radioEnd(k){ decide('radio',k); const F=S.flags;
  if(k==='destroy'){ F.radio_destroyed=true; sfx('kick'); S.shake=.4; menu_('The transmitter','You put the transmitter through the window, and then the console after it. Evelyn doesn’t stop you. She sits down on the floor with the headphones in her lap and cries the way people do when something heavy is taken off them.'); later(1,()=>closeCase('radio')); }
  if(k==='keep'){ F.radio_tapes=true; menu_('The tapes','You take the shoebox. Forty tapes, and a forty-first that Evelyn says she didn’t record. It’s labelled in green ink: AFTER.'); later(1,()=>closeCase('radio')); }
  if(k==='follow'){ F.rd_follow=true; F.rd_follow_t=60; toast('Twenty-three past. The cross street. One minute.');
    say(brother(),isDean()?'Cross street. Old guy with a cane. Move.':'The cross street. Now, Sam.',3,{now:true}); }
}
INV_UPDATES.push(()=>{ const F=S.flags; if(caseDecision('radio')||!(F.rd_console>=2&&F.rd_log&&F.rd_evelyn)||F.rd_asked||S.sector.id!=='station'||dlg.open) return; F.rd_asked=true;
  later(1,()=>openMenu('The dispatch radio','The radio is warm. The next call is due at twenty-three past, and you already know what it says.',[
    {text:'Destroy the transmitter.',note:'the calls stop; so do the warnings',act:()=>radioEnd('destroy')},
    {text:'Keep the tapes. Study them.',note:'there is one labelled AFTER',act:()=>radioEnd('keep')},
    {text:'Follow the call. Get to the cross street.',note:'one minute',act:()=>radioEnd('follow')}])); });
/* Act III: the tape labelled AFTER */
INV_UPDATES.push(()=>{ const F=S.flags; if(!F.radio_tapes||S.act<3||!F.chuck_met||F.rd_after) return; F.rd_after=true;
  later(3,()=>{ say('narr','In the back seat of the Impala, the shoebox of tapes clicks. The one labelled AFTER has started playing on its own.',4);
    later(4.4,()=>say('radio','…',2,{name:'Tape: AFTER'})); later(6.6,()=>say('radio','Sam?',2.4,{name:'Tape: AFTER, Dean’s voice'}));
    later(9.4,()=>{ addNoteRaw('after_tape','The tape labelled AFTER','A few seconds of silence, dated a week after tonight. Then Dean’s voice: “Sam?” Nothing else. It doesn’t say whether anyone answered.'); S.dread=Math.min(1,(S.dread||0)+.1); }); }); });
RADIO.push({when:()=>S.act===1&&S.flags.earl&&!S.flags.radio_lead,name:'Sheriff’s band, 155.37 MHz',lines:['…all units, all units, call for assistance, the cross street, an elderly male—','—disregard, disregard. That call’s from Thursday. Evelyn, that call’s from Thursday.','…no it isn’t.'],fx:()=>{ if(!S.flags.radio_lead){ S.flags.radio_lead=true; toast('New lead — the sheriff’s station (north end of Main Street)'); } }});
INV_UPDATES.push(()=>{ const F=S.flags; if(F.radio_lead||S.act!==1||!F.phantom||S.cut) return; if(!F.rd_nudge){ F.rd_nudge=S.time; return; }
  if(S.time-F.rd_nudge>70){ F.radio_lead=true; msg('marla','evelyn at dispatch is telling everyone the radio calls before people die. sheriff’s station is at the north end. she sounds like she hasn’t slept'); } });
PEOPLE.push({flag:'rd_evelyn',look:'evelyn',name:'Evelyn Marsh',line:'Dispatch. Records every call. Listens for the first one.'});
defCase({ id:'radio', n:18, kicker:'Act I · Case 10 (optional)', title:'The Dead Man on the Radio', open:()=>!!S.flags.radio_lead,
  summary:()=>caseClosed('radio')?'A radio that receives fragments of what happened, and what nearly did.':'The sheriff’s dispatch radio has been taking calls from people who haven’t died yet. Tonight’s log has an entry from the sheriff, who is sitting in the office.',
  clues:{
    log:{t:'The dispatch log',k:'record',x:'Calls before every death. Tonight: “Caller: Sheriff R. Ames. Location: this office.”',have:F_('rd_log')},
    joan:{t:'Joan Pike, on channel 9',k:'sound',x:'Walter’s dead wife, past the reeds: “Tell him to stop rowing.”',have:F_('rd_joan')},
    gus:{t:'Twenty-three past',k:'sound',x:'An old man with a cane at the cross street. A car. Twenty-three past.',have:F_('rd_gus')},
    future:{t:'“Sam?”',k:'sound',x:'Dean’s voice, on a frequency with no caller. Dean didn’t say it.',have:F_('rd_future')},
    tapes:{t:'The typing',k:'record',x:'Under every call: someone typing, fast, pausing before the good lines.',have:F_('rd_tapes')},
    evelyn:{t:'Evelyn Marsh',k:'talk',x:()=>S.flags.rd_missed?'She has stopped answering real calls. She can’t tell which ones are now.':S.flags.rd_first?'The first call was in February: a girl coughing for eleven seconds.':'She believes the first call is the key.',who:'Evelyn Marsh',trust:'evelyn',have:F_('rd_evelyn')},
    ames:{t:'Sheriff Ames',k:'talk',x:'“We sent a car every time. Nothing there. Then two nights later, there’s something there.”',have:F_('rd_ames')},
    term:{t:'The mill terminal',k:'doc',x:'Admin session active: c.shurley.',have:F_('term')},
  },
  links:[
    {id:'possible',a:'gus',b:'ames',t:'Not the future, exactly',x:'The calls describe what happens unless somebody intervenes. When the car got there in time, there was nothing to find, and two nights later there was.',dean:'It’s a heads-up with a time limit.',sam:'It’s a recording of a version of events. Not the only one.'},
    {id:'first',a:'evelyn',b:'log',t:'Lily called first',x:'The first call was a coughing girl in February. Lily Hollis died in April. The radio heard her before the town did.',dean:'The kid again. It always comes back to the kid.',sam:'The first fragment is the first death. The one nobody counted.'},
    {id:'typing',a:'tapes',b:'term',t:'Somebody is typing',x:'The same admin who is logged in at the mill is audible under the calls. The radio isn’t receiving the future. It’s eavesdropping on drafts.',dean:'Somebody’s writing this down.',sam:'Drafts. We’re hearing drafts.',opens:'something to put to c.shurley'},
    {id:'lost',a:'joan',b:'evelyn',t:'Listening instead of answering',x:'Evelyn is so busy listening for the dead that she has stopped answering the living. The calls are working on her too.',dean:'Thing’s eating her the slow way.',sam:'It doesn’t need to kill her. It just needs her to stop answering.'},
    {id:'after',a:'future',b:'tapes',t:'After',x:'A call in Dean’s voice, saying a word he hasn’t said. Whatever is recording this has a version of events that goes past tonight.',dean:'I don’t like that there’s an after where I’m asking that.',sam:'There’s an after. That’s something.'},
  ],
  theory:{q:'What is the radio receiving?',reward:25,
    opts:[{id:'future',t:'The future. The calls are fixed; we can only listen.'},{id:'ghosts',t:'The dead, calling back from where they are.'},{id:'drafts',t:'Fragments of different outcomes, some that happened and some that didn’t, overheard while someone writes.',ok:true}],
    right:'A version of events, overheard. Some calls came true because nobody intervened. One didn’t, because you did.',wrong:'The calls changed when anyone acted. Whatever they are, they aren’t fixed, and they aren’t only the dead.'},
  talk:()=>[[brother(),isDean()?'If it’s warning us, we use it. Simple.':'Dean, if we follow every call we end up like Evelyn.'],[S.hero,isDean()?'Or we end up with one more guy alive.':'Then we follow one. The right one.']],
  autopsy:()=>{ const d=caseDecision('radio'), F=S.flags;
    return { what:['The sheriff’s radio took calls from people before they died, and once from the sheriff, who was alive in the room.',
        d==='destroy'?'You destroyed the transmitter.':d==='keep'?'You kept the tapes, including one labelled AFTER.':F.rd_saved?'You flagged the sedan down. Old Gus finished crossing the street.':F.rd_moved_gus?'You pulled Old Gus out of the way, and the car found Tyler instead.':'You followed the call and didn’t make it in time.'],
      cause:['The calls are fragments of possible outcomes. Some came true because nobody acted in time.','Under every one, someone is typing.'],
      open:['Who the first call was really for.','Evelyn stopped answering the living. Someone has to answer them now.',F.radio_tapes?'A tape labelled AFTER, in green ink.':'Dean’s voice, saying “Sam?” on a channel with no caller.'],
      dean:d==='follow'?(F.rd_saved?'We beat it. Once. I’ll take once.':'It moved. We pushed and it just moved onto somebody else.'):'I don’t want a radio that knows my lines.',
      sam:'If it can be changed it isn’t fate. It’s just a forecast nobody should have had to hear.' }; },
  paper:()=>{ const d=caseDecision('radio'), F=S.flags;
    return { head:d==='destroy'?'STATION RADIO “VANDALISED”; DISPATCHER RESTING':F.rd_saved?'DRIVERLESS CAR STOPS SHORT ON CROSS STREET':F.rd_moved_gus?'TEEN STRUCK BY DRIVERLESS SEDAN':'DISPATCH LOG RAISES QUESTIONS',
      deck:'Evelyn Marsh: “They call before. Every one of them called before.”',by:'Ledger staff',
      body:['For six weeks, the sheriff’s dispatch log has recorded calls describing deaths before they occurred. Responding units found nothing. Two nights later, in each case, there was something to find.',
        F.rd_saved?'On Saturday a rust-red sedan with no driver was stopped by a pedestrian at twenty-three past two, a foot short of Old Gus Haverford, 84, who was crossing the street.':F.rd_moved_gus?'Tyler Kaminski, 17, suffered a bruised leg when a sedan with no driver mounted the kerb on the cross street.':d==='destroy'?'The dispatch radio has been removed after what the sheriff called “an incident with the window.” Evelyn Marsh is resting at home.':'Dispatch has asked residents to keep calls brief.',
        'Sheriff Ames confirmed that the most recent log entry lists him as the caller. He said he does not remember making the call, “yet.”'] }; },
  forum:()=>[{u:'e.marsh',t:'shh'},{u:'gus_in_the_woods',t:S.flags.rd_saved?'Somebody stopped a car for me tonight. I didn’t even see it. Thank you whoever you were.':S.flags.rd_gus_dead?'[this account has been memorialised]':'Careful on the cross street, everybody.'},{u:'tyler_k',t:S.flags.rd_moved_gus?'my leg is fine. the car had NOBODY in it':'lol'},{u:'0114',t:'is it 2:40 there too'}],
});

/* ═══ 11 · The Man Who Came Back Wrong ════════════════════════════════════ */
{ const L=SECTORS.larch, g=L.grid; g[6][22]='+'; L.doors['22,6']={to:'reed',x:4.5,y:6.4,a:-Math.PI/2}; L.pois.push({x:22.5,y:6.5,name:'The Reed house',kind:'door'});
  const hal=L.entities.find(e=>e.dialogue==='hal'); if(hal){ hal.x=19.4; hal.y=7.8; } pack(L); }
{ const s=room('reed','The Reed house',10,8,'P',.22); s.ceilH=1.4; s.region='larch';
  s.grid[7][4]='+'; s.doors={'4,7':{to:'larch',x:22.5,y:7.6,a:Math.PI/2}}; s.spawn={x:4.5,y:6.4,a:-Math.PI/2};
  s.lights=[{x:5,y:3,p:1.4,f:.24}]; s.pois=[{x:4.5,y:7.5,name:'Out',kind:'door'}];
  s.entities=[npc_('glenn',3,2.6,'glenn','Glenn Reed',{h:1.82,face:Math.PI/2}),npc_('carol',6.4,2.4,'carol','Carol Reed',{h:1.7,face:Math.PI/2}),
    npc_('ghost_girl',8.4,5.6,'mia','Mia Reed',{h:1.3,face:Math.PI,look:'teen',lit:.6}),
    {kind:'prop',m:'counter',x:5,y:1.6,r:.45,h:.8},use_('frame',5,1.4,'gr_album','A wedding album',{z:.5,h:.3}),
    use_('cabinet',1.4,5.6,'gr_drawer','A locked drawer',{r:.3,h:1.1}),use_('paper',8.6,1.3,'gr_list','A shopping list on the fridge',{z:.8,h:.3})];
  addSector(s); }
{ const m=SECTORS.reed.entities.find(e=>e.dialogue==='mia'); if(m){ m.look='mia'; } }
LOOKS.mia={skin:[226,190,160], hair:{style:'long',col:[120,80,50]}, eyes:{col:[80,100,120]}, lip:[190,120,120], top:{kind:'hoodie',col:[180,120,150]}, legs:{kind:'jeans',col:[60,70,100]}, shoes:[220,220,214]};
USES.gr_album=()=>{ S.flags.gr_album=true; menu_('The wedding album','White leather, gold corners, the kind you get as a gift. Inside: forty pages of Glenn and Carol at a wedding at the reservoir chapel, in summer, with a cake shaped like a boat.\n\nCarol, when you show her: “We got married at the courthouse. In February. It rained. We didn’t have an album.”'); };
USES.gr_drawer=()=>{ S.flags.gr_drawer=true; menu_('A locked drawer',isDean()?'You get it open with the knife. Inside: a cigar box with a child’s tooth, a dog licence for a dog named Bandit, and a letter in Glenn’s handwriting that begins “If you’re reading this, I didn’t make it back.”\n\nGlenn knew all of that before you opened it. Carol says the drawer has been locked since before they moved in. She has never had a key.':'Sam finds the key taped under the shelf, where Carol says nobody ever looks. Inside: a cigar box with a child’s tooth, a dog licence for a dog named Bandit, and a letter in Glenn’s handwriting that begins “If you’re reading this, I didn’t make it back.”\n\nGlenn knew all of that before you opened it. Carol says the drawer has been locked since before they moved in.'); };
USES.gr_list=()=>{ S.flags.gr_list=true; menu_('A shopping list','Milk, eggs, the good bread, batteries, the dog’s pills. Glenn’s handwriting, written last month. The same handwriting as the letter in the drawer, almost: in the letter every lowercase g has a loop. On the list, none of them do.'); };
Object.assign(DIALOGUE,{
  glenn:{ port:'glenn', start:()=>S.flags.gr_glenn?'g9':'g0', nodes:{
    g0:{speaker:'Glenn Reed',text:"He’s eating soup at the kitchen table, the way you eat when you’ve been hungry a long time.\n\n\"I walked out of the fog on Thursday. I don’t know how long I was in there. It felt like an afternoon.\" He smiles at Carol, who doesn’t smile back. \"Ask me anything. I know what this looks like.\"",
      choices:[D_("Tell me about your wedding.",'g1'),D_("You worked the mill?",'g2'),D_("What did your mother look like?",'g3'),D_("[Sam] Holy water. Humour me.",'g4s',null,isSam),D_("[Dean] Silver. Humour me.",'g4d',null,isDean)]},
    g1:{speaker:'Glenn Reed',text:"\"The reservoir chapel. July. There was a cake shaped like a boat, because I proposed in a canoe.\" Carol puts her spoon down. Glenn doesn’t notice.",choices:[D_("Go on.",'g0',{flag:'gr_wedding'})]},
    g2:{speaker:'Glenn Reed',text:"\"Line two. I used to have coffee with Ray Hollis at the end of a shift. Last time I saw him he said the fan was finally coming. October, it was. Mid-October.\"\n\nRay Hollis died on the third of October.",choices:[D_("Go on.",'g0',{flag:'gr_ray'})]},
    g3:{speaker:'Glenn Reed',text:"He opens his mouth. Closes it. His eyes go to the window as though the answer is out there.\n\n\"She had— she was—\" He laughs, and it goes wrong halfway. \"That’s funny. I can see her kitchen. I can see her hands. Why can’t I see her face?\"",choices:[D_("…",'g0',{flag:'gr_mother'})]},
    g4s:{speaker:'—',port:null,text:"A capful in his coffee. He drinks it, and grimaces, and says \"It’s just water, isn’t it,\" and it is. No smoke. No flinch.",choices:[D_("…",'g0',{flag:'gr_tested'})]},
    g4d:{speaker:'—',port:null,text:"You press a silver dollar into his palm and close his fingers on it. He holds it for a long time, puzzled and polite. His skin doesn’t mark.",choices:[D_("…",'g0',{flag:'gr_tested'})]},
    g9:{speaker:'Glenn Reed',text:"\"I love her. Whatever I am. I want you to write that down.\"",choices:[D_("[Leave.]",null)]},
  }},
  carol:{ port:'carol', start:'c0', nodes:{ c0:{speaker:'Carol Reed',text:"\"His fingerprints match. Sheriff checked. His scars are right. The appendix, the thumb from the band saw. He knows the name of my first dog.\" She holds her own wrists. \"I want it to be him. Isn’t that the worst thing you’ve ever heard?\"",
    choices:[D_("[Leave her be.]",null,{flag:'gr_carol',now:()=>{ S.flags.gr_glenn=true; }})]} }},
  mia:{ port:'mia', start:'m0', nodes:{ m0:{speaker:'Mia Reed',text:"She’s twelve and she has backed herself into the corner by the stove.\n\n\"Dad knocks twice before he comes in a room. Always. Two. That one knocks three times.\" She doesn’t take her eyes off the man at the table. \"That’s not a little thing. Don’t tell me that’s a little thing.\"",
    choices:[D_("It’s not a little thing.",null,{flag:'gr_mia',now:()=>trust('mia',2)}),D_("[Dean] Kid, people change their knock.",null,{flag:'gr_mia',now:()=>trust('mia',-2)},isDean)]} }},
});
function reedEnd(k){ decide('reed',k); const F=S.flags, s=SECTORS.reed, gl=s.entities.find(e=>e.dialogue==='glenn');
  if(k==='accept'){ F.reed_accepted=true; menu_('The Reed house','You tell Carol that there’s no test that will tell her. That it’s hers to decide. She sits down next to him at the table. Mia stays in the corner, but she stays.'); }
  if(k==='drive'){ F.reed_driven=true; if(gl) gl.dead=true; menu_('The Reed house','You walk him to the edge of the fog. He doesn’t fight. At the grey wall he turns around and says, very clearly, “Tell Mia I knock twice. Tell her I’m trying to remember.” Then the fog has him.'); }
  if(k==='rite'){ F.reed_tested=true; sfx('rite'); later(1,()=>sfx('riteEnd')); menu_('The rite','The rite finds every seam in him: the loopless g, the wedding that wasn’t, the face that isn’t there. It finds that he is made of what the town remembered of Glenn Reed, stitched very carefully.\n\nIt doesn’t find whether that makes him not Glenn. The rite has nothing to say about that. Neither do you. You tell Carol what you found, and leave the deciding to the people who have to live with it.'); }
  later(1,()=>closeCase('reed')); }
INV_UPDATES.push(()=>{ const F=S.flags; if(caseDecision('reed')||F.reed_asked||S.sector.id!=='reed'||dlg.open) return;
  const n=['gr_wedding','gr_ray','gr_mother','gr_album','gr_drawer','gr_mia','gr_carol'].filter(k=>F[k]).length; if(n<5) return; F.reed_asked=true;
  later(1.2,()=>openMenu('The Man Who Came Back',"Glenn is waiting at the table with his hands flat on it, like a man at a job interview. Carol is watching you. Mia is watching him.",[
    {text:'Accept him. It’s the family’s decision.',note:'Mia stays suspicious',act:()=>reedEnd('accept')},
    {text:'Drive him out, into the fog.',note:'he goes quietly',act:()=>reedEnd('drive')},
    {text:'Test him with the rite.',note:'it shows the seams; it can’t settle what they mean',act:()=>reedEnd('rite')}])); });
INV_UPDATES.push(()=>{ const F=S.flags; if(F.reed_lead||S.act!==2||!F.delia_done||S.cut) return; if(!F.reed_nudge){ F.reed_nudge=S.time; return; }
  if(S.time-F.reed_nudge>100){ F.reed_lead=true; msg('marla','glenn reed walked out of the fog on larch street. he went missing the first night. he ordered his usual at the diner and his little girl won’t go near him'); } });
{ const d=DESTS.larch, a=d.avail; d.avail=()=>a()||(!!S.flags.reed_lead&&S.act>=2&&S.act<=3); }
PEOPLE.push({flag:'gr_carol',look:'carol',name:'Carol Reed',line:'Wants it to be him.'},{flag:'gr_mia',look:'mia',name:'Mia Reed',line:'Twelve. Counts knocks.'});
defCase({ id:'reed', n:42, kicker:'Act II · Case 11 (optional)', title:'The Man Who Came Back Wrong', open:()=>!!S.flags.reed_lead,
  summary:()=>caseClosed('reed')?'A man assembled from what the town remembered of him. Whether that makes him a copy is not something a rite can say.':'Glenn Reed vanished on the first night of the lockdown and walked out of the fog on Thursday. His daughter says he knocks three times.',
  clues:{
    knock:{t:'Three knocks',k:'talk',x:'Dad knocks twice. That one knocks three times.',who:'Mia Reed',trust:'mia',have:F_('gr_mia')},
    carol:{t:'Fingerprints and scars',k:'talk',x:'Prints match. Scars right. He knows her first dog’s name.',who:'Carol Reed',have:F_('gr_carol')},
    wedding:{t:'A wedding that didn’t happen',k:'talk',x:'He remembers a July chapel wedding. They married at the courthouse in February.',who:'Glenn Reed',have:F_('gr_wedding')},
    album:{t:'The album',k:'place',x:'Forty pages of a wedding Carol says never happened.',have:F_('gr_album')},
    drawer:{t:'The locked drawer',k:'place',x:'He knew what was in a drawer nobody has a key to.',have:F_('gr_drawer')},
    ray:{t:'Coffee with Ray, in mid-October',k:'talk',x:'Ray died on October 3rd.',who:'Glenn Reed',have:F_('gr_ray')},
    mother:{t:'No face',k:'talk',x:'He can see his mother’s kitchen and hands. Not her face.',who:'Glenn Reed',have:F_('gr_mother')},
    list:{t:'The loopless g',k:'place',x:'His handwriting matches. Almost. The letters’ g’s loop; the new list’s don’t.',have:F_('gr_list')},
    tested:{t:'Not possessed, not a shifter',k:'place',x:'Holy water and silver: nothing.',have:F_('gr_tested')},
  },
  links:[
    {id:'other',a:'wedding',b:'album',t:'Somebody’s version',x:'The album is real paper and real photographs of a wedding that didn’t happen. He isn’t lying. He remembers a version of events.',dean:'He’s got the photos of a life they didn’t have.',sam:'He’s from a version of things, or made out of one.'},
    {id:'assembled',a:'drawer',b:'mother',t:'Made of what was remembered',x:'He knows what other people knew about Glenn, even things in locked drawers, and nothing nobody remembered. Nobody in town remembers his mother’s face.',dean:'He’s a scrapbook of the guy.',sam:'He’s assembled from the town’s memory of him.'},
    {id:'after',a:'ray',b:'tested',t:'Not a monster, exactly',x:'He’s not possessed and not a shifter, and he remembers a conversation with Ray after Ray died. The mill’s story has another version in it.',dean:'Not a monster. Doesn’t make him Glenn.',sam:'The usual tests don’t have a category for him.',fx:()=>{ S.flags.reed_ray=true; }},
    {id:'details',a:'knock',b:'list',t:'The small things',x:'The things the town didn’t notice about Glenn are the things that came back wrong: the knock, the loop of a g. Mia noticed.',dean:'The kid was right. Kids are always right about this stuff.',sam:'What makes a person is the details nobody else was watching.'},
  ],
  theory:{q:'Who came back out of the fog?',reward:25,
    opts:[{id:'shifter',t:'A shapeshifter wearing Glenn.'},{id:'possessed',t:'Glenn, with something riding him.'},{id:'remembered',t:'A Glenn made out of what the town remembered. Whether that is Glenn, nobody can say.',ok:true}],
    right:'He is Glenn as the town remembered him: everything but the details nobody was watching. The rest is a question, not a fact.',wrong:'The tests said no to every monster you know. What came back is made of memory, and no rite can tell you what that makes him.'},
  talk:()=>[[brother(),isDean()?'It’s a monster or it isn’t. That’s the job.':'Dean, he loves them. Whatever he is.'],[S.hero,isDean()?'Monsters love things too, Sam.':'That doesn’t make him him.']],
  autopsy:()=>{ const d=caseDecision('reed');
    return { what:['Glenn Reed walked out of the fog after vanishing on the first night. Prints, scars and memories all matched, except the ones nobody was watching.',
        d==='accept'?'You left it to the family. Carol sat down next to him. Mia stayed in the corner.':d==='drive'?'You walked him back into the fog. He asked you to tell Mia he’s trying to remember.':'You tested him with the rite. It found every seam and couldn’t tell you what they meant.'],
      cause:['Something in the fog rebuilt a missing man from what the town remembered of him.','He remembers Ray Hollis alive in mid-October: a version of the mill where things went differently.'],
      open:['Whether the original Glenn is alive past the fog, or died in it.','If a person has someone’s memories, love and intentions, what is missing?','Whatever is in the fog can make people. Why would it?'],
      dean:d==='drive'?'I keep thinking about him at the wall. Asking us to tell her he’s trying.':'Not my call. That’s the first time I’ve been glad something isn’t my call.',
      sam:'We test for possession and silver because those are the monsters we know. He wasn’t one of those.' }; },
  paper:()=>{ const d=caseDecision('reed');
    return { head:d==='drive'?'RETURNED MAN “WALKS BACK INTO FOG”':'LARCH STREET MAN RETURNS FROM FOG',deck:d==='accept'?'Glenn Reed home with family after week missing. “Ask me anything,” he says.':'Family declines further comment.',by:'C. S.',
      body:['Glenn Reed, 41, a former line-two operator at the Oakhaven Mill, walked out of the fog on Larch Street on Thursday after disappearing on the first night of the lockdown. He said it “felt like an afternoon.”',
        d==='drive'?'Neighbours report that Mr. Reed walked back toward the town line late Saturday, accompanied by two men. He has not returned.':'His wife, Carol, said: “His fingerprints match. His scars are right.” Asked whether she was relieved, she said she would “get back to us.”',
        'Mr. Reed mentioned to the Ledger that he had coffee with the late Ray Hollis in mid-October. The Ledger has been unable to reconcile this with Mr. Hollis’s date of death.'] }; },
  forum:()=>[{u:'carol.reed',t:'please stop asking'},{u:'mia_reed12',t:'2 knocks'},{u:'hal.pruitt',t:'never trusted that guy anyway. either of him'},{u:'c.shurley',t:'this one’s my favourite and nobody gets why'}],
});
/* the mill case gets a second reading: Ray, alive in mid-October somewhere */
INV_UPDATES.push(()=>{ const I=inv_(); if(!S.flags.reed_ray||I.noteAnn['ray:reed']) return; if(!S.notes.some(n=>n.id==='ray')) return; I.noteAnn['ray:reed']={nid:'ray',who:'sam',text:'Glenn Reed had coffee with him in mid-October. In some version, the fan came.'}; });

/* ═══ 12 · The Inventory of Things That Never Existed ═════════════════════ */
SECTORS.pawn.entities.push(use_('shoe',9.6,9.2,'iv_shoe','A child’s shoe on the step',{h:.18}),use_('key',10.2,9.4,'iv_key','A brass key',{h:.1}),use_('watch',10.8,9.2,'iv_watch','A broken watch',{h:.15}),
  use_('ring',11.4,9.4,'iv_ring','A wedding ring',{h:.08}),use_('frame',12,9.2,'iv_photo','A photograph, faces scratched out',{h:.3}),
  use_('paper',4.6,7.3,'iv_ledger','Earl’s other ledger',{z:.5,h:.3,hidden:true,ivLedger:true}));
for(const e of SECTORS.pawn.entities) if(e.use&&e.use.startsWith('iv_')&&e.use!=='iv_ledger') e.hidden=true, e.ivObj=true;
const IV={shoe:'A child’s red sneaker, size 11. The price tag says 5¢. It has never been worn. Something tells you it belonged to a boy of about four.',
  key:'A brass house key on a tag: CHAPEL HOUSE. Price: 10¢. The only chapel house in the county records was in the lower Pike valley. It has been under the reservoir since 1951.',
  watch:'A wristwatch with a cracked face, stopped at 2:09. The strap is torn clean in half, the way leather tears when two people pull. Price: 2¢.',
  ring:'A plain gold band, inside it engraved P.L. & S.L. Price: 1¢. It fits Sarah Lindqvist’s finger exactly. Sarah has never been married. P.L. was her brother.',
  photo:'A family on a porch: a man, a woman, a little girl, a dog. The man’s face has been scratched out with something careful. The porch is on Larch Street. Price: free.'};
for(const k of Object.keys(IV)) USES['iv_'+k]=()=>{ S.flags['iv_'+k]=true; menu_('Left at Earl’s door',IV[k]); };
USES.iv_ledger=()=>{ S.flags.iv_ledger=true; menu_('Earl’s other ledger',"Forty years of things left on the step after closing, in Earl’s cramped hand. Item. Price on the tag. Who it belonged to, where he could find out.\n\nMost of the last column says UNKNOWN. Some entries are dated the day after a death, or a disappearance, or a fire.\n\nThe last entry isn’t in Earl’s handwriting. It isn’t in anybody’s in town:\n\n“Inventory: one town, one field, one observer. Ownership disputed.”"); };
Object.assign(DIALOGUE.earl.nodes,{ iv0:{speaker:'Earl — Pawn & Loan',text:"\"Somebody’s been leaving things on my step. After close. Every night this week.\" He jerks his thumb at the door. \"Little price tags on them. Pennies. I figure somebody’s fencing. I keep a book on it. Have done for forty years, if I’m honest, on and off.\"\n\nHe slides a ledger across the counter.",
  choices:[D_("[Take the ledger.]",null,{flag:'iv_earl',now:()=>{ for(const e of SECTORS.pawn.entities) if(e.ivLedger||e.ivObj) e.hidden=false; }})]} });
{ const E=DIALOGUE.earl, was=E.start; E.start=()=>S.act===2&&S.flags.iv_lead&&!S.flags.iv_earl?'iv0':(typeof was==='function'?was():was); }
INV_UPDATES.push(()=>{ const F=S.flags; if(F.iv_lead||S.act!==2||!F.kevin_done||S.cut) return; if(!F.iv_nudge){ F.iv_nudge=S.time; return; }
  if(S.time-F.iv_nudge>140){ F.iv_lead=true; msg('marla','earl says someone keeps leaving things on his step at night. little price tags. he wants you to come look, he says it\'s been happening for forty years and he only just noticed'); } });
/* returning things: talk to the right person while you have it */
const RETURNS={ring:{dlg:'sarah',who:'Sarah',text:"She turns it over. P.L. & S.L. Her brother’s initials and hers. \"Pete used to say he’d marry me off before he married himself. It was a joke. It was a stupid joke.\" She puts it on. It fits.\n\n\"I don’t understand where this came from,\" she says, \"and I’m going to keep it.\""},
  photo:{dlg:'carol',who:'Carol Reed',text:"Carol looks at the scratched-out face for a long time. \"That’s our porch. That’s Mia, and the dog. That’s me.\" She touches the scratches. \"Somebody didn’t want to remember his face either.\""},
  watch:{dlg:'earl',who:'Earl',text:"Earl goes very still. \"I sold that watch to Emeka Okafor. Bought it off him on a Tuesday, sold it back on Thursday. He didn’t have the money. I let him have it anyway.\" He doesn’t pick it up. \"Strap’s torn. Like two people pulling.\""}};
for(const [k,r] of Object.entries(RETURNS)){ const D=DIALOGUE[r.dlg]; if(!D) continue; const st=D.start;
  D.nodes['iv_ret_'+k]={speaker:r.who,text:r.text,choices:[D_('[…]',null,{flag:'iv_returned_'+k})]};
  D.start=()=>S.flags['iv_'+k]&&caseDecision('inventory')==='return'&&!S.flags['iv_returned_'+k]?'iv_ret_'+k:(typeof st==='function'?st():st); }
function invEnd(k){ decide('inventory',k); const F=S.flags;
  for(const e of SECTORS.pawn.entities) if(e.ivObj) e.hidden=true;
  if(k==='return'){ F.inv_return=true; menu_('The inventory','You take the things with you. Some of them have people to go back to: a ring for Sarah at the library, a photograph for Carol Reed on Larch Street. Earl gives you the watch to look at and won’t touch it himself. Some of them don’t have anybody. You take those too.'); }
  if(k==='catalogue'){ F.inv_catalogue=true; menu_('The inventory','You and Earl spend an hour writing it all down properly: item, tag, who, where. He clears a shelf. “The archive,” he calls it, embarrassed. If anything else in this town changes when it shouldn’t, the shelf will know.'); }
  if(k==='destroy'){ F.inv_destroyed=true; sfx('flare'); menu_('The inventory','The things go into Earl’s stove one at a time. The ring doesn’t melt. The key doesn’t either. Earl closes the stove door on them and says he doesn’t want to talk about it.'); }
  later(1,()=>closeCase('inventory')); }
INV_UPDATES.push(()=>{ const F=S.flags; if(caseDecision('inventory')||F.inv_asked||S.sector.id!=='pawn'||dlg.open) return;
  if(!F.iv_ledger||['shoe','key','watch','ring','photo'].filter(k=>F['iv_'+k]).length<4) return; F.inv_asked=true;
  later(1,()=>openMenu('Earl’s step','Five things that belong to nobody, priced in pennies. Earl is watching you the way you watch a man defusing something.',[
    {text:'Return them to whoever they’re connected to.',note:'even if they can’t explain why',act:()=>invEnd('return')},
    {text:'Catalogue them. Keep an archive.',note:'the shelf will notice later changes',act:()=>invEnd('catalogue')},
    {text:'Destroy them.',note:'whatever they anchored goes with them',act:()=>invEnd('destroy')}])); });
/* the archive notices the Act IV edits */
INV_UPDATES.push(()=>{ const F=S.flags, I=inv_(); if(!F.inv_catalogue||!I.editsDone||F.inv_noticed) return; F.inv_noticed=true;
  later(4,()=>msg('marla','earl called. he says three things on his archive shelf changed their tags tonight. he wrote down what they used to say. he wants you to know they were edited')); });
defCase({ id:'inventory', n:44, kicker:'Act II · Case 12 (optional)', title:'The Inventory of Things That Never Existed', open:()=>!!S.flags.iv_lead,
  summary:()=>caseClosed('inventory')?'An accidental archive of things the town’s records can’t hold.':'Someone has been leaving objects on Earl’s step after closing, priced in pennies. Each belongs to someone, or to something that never quite happened.',
  clues:{
    ledger:{t:'Earl’s other ledger',k:'record',x:'Forty years of things left on the step. The last entry isn’t in anyone’s handwriting.',have:F_('iv_ledger')},
    earl:{t:'Earl',k:'talk',x:'“I figured somebody was fencing. I keep a book on it.”',who:'Earl',have:F_('iv_earl')},
    shoe:{t:'A child’s shoe',k:'place',x:'Never worn. A boy of about four.',have:F_('iv_shoe')},
    key:{t:'CHAPEL HOUSE',k:'place',x:'A key to a house under the reservoir since 1951.',have:F_('iv_key')},
    watch:{t:'Stopped at 2:09',k:'place',x:'The strap is torn as if two people pulled.',have:F_('iv_watch')},
    ring:{t:'P.L. & S.L.',k:'place',x:'Fits Sarah Lindqvist, who has never been married.',have:F_('iv_ring')},
    photo:{t:'A face scratched out',k:'place',x:'A family on a Larch Street porch. The man’s face, carefully removed.',have:F_('iv_photo')},
    tablet:{t:'The tablet',k:'talk',x:'Kevin read from it for nine days. It isn’t scripture. It’s source.',have:F_('kevin_done')},
  },
  links:[
    {id:'thomas',a:'shoe',b:'ledger',t:'The boy with no certificate',x:()=>S.flags.met_agnes?'The shoe is Thomas Avery’s, the boy Agnes Bell gave back. There is no birth certificate for him anywhere.':'A child of four, no record of him anywhere. The ledger has an entry for a boy’s coat from the 1960s too.',dean:'Somebody nobody wrote down.',sam:'The objects survive when the records don’t.'},
    {id:'okafor',a:'watch',b:'earl',t:'Emeka’s watch',x:'Earl sold this watch to Emeka Okafor. It stopped at 2:09, the time the brothers died, each holding one end of the strap.',dean:'Earl let the kid have it for free. Then it came back.',sam:'Objects come back when the people they belonged to don’t.'},
    {id:'drowned',a:'key',b:'ledger',t:'A house under water',x:'The town keeps the keys to places that no longer exist. The reservoir took a valley; the step gave back its key.',dean:'It’s a lost and found for the whole town.',sam:'It’s an archive of what the official record dropped.'},
    {id:'possible',a:'ring',b:'photo',t:'Things that might have been',x:'A ring for a marriage that never happened and a family photo with a face removed. Not all of these are from people who existed. Some are from events that were possible.',dean:'Leftovers from a life she didn’t get.',sam:'Remnants of possibilities, kept because somebody traded them.'},
    {id:'observer',a:'ledger',b:'tablet',t:'Ownership disputed',x:'“One town, one field, one observer.” The same grammar as Kevin’s source. Somebody has been taking inventory, and somebody else disputes it.',dean:'Two guys arguing over who owns the farm.',sam:'An owner, and an observer. Not the same person.'},
  ],
  theory:{q:'What are the things left on Earl’s step?',reward:25,
    opts:[{id:'stolen',t:'Stolen goods. Somebody is using Earl to fence.'},{id:'dead',t:'The belongings of the dead.'},{id:'remnant',t:'Remnants of people and events the town’s records can’t hold, real or only possible, kept because they were traded.',ok:true}],
    right:'Earl’s step is an archive by accident. Objects outlast stories, because somebody once handed them over the counter.',wrong:'Not all of them belonged to the dead. Some belonged to things that only nearly happened.'},
  talk:()=>[[brother(),isDean()?'A shop full of things that don’t exist. Great. Love it.':'Earl’s been keeping the receipts on this town for forty years and didn’t know.'],[S.hero,'Somebody else has been keeping them longer.']],
  autopsy:()=>{ const d=caseDecision('inventory');
    return { what:['Five priced objects on Earl’s step, each tied to someone erased, displaced or never quite real.',
        d==='return'?'You gave them back where you could. Sarah kept the ring. Carol kept the photograph.':d==='catalogue'?'You and Earl built an archive on a cleared shelf.':'You burned them. Two didn’t burn.'],
      cause:['Objects survive changes to the stories around them, if they’ve been traded, stored or forgotten.','Earl’s shop has been an archive for forty years without anyone deciding it should be.'],
      open:['Who wrote the last line in the ledger.','“Ownership disputed.” Between whom?',d==='catalogue'?'The shelf will notice the next time something is changed.':'The next thing on the step.'],
      dean:d==='destroy'?'Felt like burning somebody’s photo albums.':'Earl kept the book for forty years. Somebody should’ve asked him sooner.',
      sam:'Some of these were possibilities. Somebody keeps the possibilities.' }; },
  paper:()=>({ head:'PAWNBROKER: “THEY JUST KEEP COMING”',deck:'Objects priced in pennies left nightly at Earl’s Pawn & Loan.',by:'C. S.',
    body:['Earl Duchesne, owner of Earl’s Pawn & Loan, reports that objects have been left on his step after closing every night this week, each with a handwritten price tag.','Mr. Duchesne said he has kept a record of such items “on and off” for forty years. “I figured somebody was fencing,” he said. “I’d like to apologise to whoever I figured that about.”',
      caseDecision('inventory')==='return'?'Sarah Lindqvist, librarian, confirmed that she is now wearing one of the items, a gold band. She declined to say why.':'The Ledger was shown the shop’s new “archive shelf.” It is very tidy.'] }),
  forum:()=>[{u:'earl_buys_gold',t:'NOT buying anything left on the step. Stop leaving things on the step.'},{u:'sarah.l',t:caseDecision('inventory')==='return'?'It fits.':'.'},{u:'c.shurley',t:'Ownership is NOT disputed'},{u:'0114',t:'i left the shoe for thomas'}],
});
CASES.author.clues.ledger={t:'“Ownership disputed”',k:'record',x:'“Inventory: one town, one field, one observer. Ownership disputed.”',have:F_('iv_ledger')};
CASES.author.links.push({id:'disputed',a:'ledger',b:'chuck',t:'Ownership disputed',x:'Chuck talks like an owner. Earl’s ledger says ownership is disputed. Somebody else has a claim on this town, or on him.',dean:'So he’s not even the landlord.',sam:'An author isn’t an owner. Somebody wrote that down.'});
