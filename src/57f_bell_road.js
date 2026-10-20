/* ═══ Case 4 · The Bell Beneath the Water, and Case 5 · The Road That Returns ═
   Two cases that teach the town's rules without explaining them.

   The bell does not summon the dead. It replays the last moment somebody
   refuses to accept, and the moment learns to answer.

   The road does not keep people in. It returns anyone carrying something
   unresolved that the town can use. A person may leave. A consequence
   cannot. */

/* ── art ────────────────────────────────────────────────────────────────── */
RAWT.water=tex(64,64,(x,y)=>{ const w=Math.sin(x*.35+Math.sin(y*.2)*2)*.5+.5, n=noise(x,y)*18;
  const glint=hash(x>>1,y>>1)>.992?60:0;
  return rgb(clamp255(14+w*10+n*.3+glint),clamp255(26+w*16+n*.5+glint),clamp255(34+w*20+n*.6+glint)); });
FLOOR_TEX.w='water'; T.water=shadeTable(RAWT.water);
Object.assign(SPR,{
  bell: art(40,36,A=>{ const b=[96,82,46]; A.ell(20,20,16,15,C(b)); A.rect(4,20,36,35,C([0,0,0])); A.rect(0,30,39,35,C(dk(b,.8)));
    for(let y=21;y<30;y++) A.line(4+(29-y)*.4,y,36-(29-y)*.4,y,C(dk(b,1.05)));
    A.rect(17,0,23,6,C(dk(b,.7))); A.line(20,28,20,35,C(dk(b,.5))); A.disc(20,34,2,C(dk(b,.6)));
    for(let i=0;i<40;i++) A.set(5+Math.random()*30,8+Math.random()*26,C([60,90,70]));    // weed
    A.shade(.22); A.outline(rgb(6,8,6)); }),
  bones: art(30,10,A=>{ const b=[214,206,184]; A.ell(5,5,4,3.5,C(b)); A.set(4,4,C([30,30,26])); A.set(6,4,C([30,30,26]));
    A.rect(9,4,24,5,C(b)); A.rect(12,2,13,8,C(b)); A.rect(16,2,17,8,C(b)); A.rect(20,2,21,8,C(b)); A.line(24,5,29,1,C([120,96,60])); A.line(24,5,29,9,C([120,96,60])); A.outline(rgb(10,10,8)); }),
  footprints: art(16,30,A=>{ const c=C([30,34,40]); for(let i=0;i<5;i++){ const x=i%2?10:4, y=26-i*6; A.ell(x,y,2,3,c); A.ell(x,y-3.5,1.6,1.2,c); } }),
  marker: art(10,30,A=>{ A.rect(1,0,8,16,C([230,230,224])); A.rect(2,1,7,15,C([40,110,60])); A.rect(4,16,5,29,C([110,110,110]));
    A.rect(3,4,6,5,C([230,230,224])); A.rect(3,9,6,10,C([230,230,224])); A.outline(rgb(8,8,8)); }),
  bouquet: art(14,16,A=>{ for(let i=0;i<7;i++) A.disc(3+i*1.4,4+(i%3)*2,2,C([[200,40,60],[230,200,60],[240,240,240]][i%3])); A.rect(6,8,8,15,C([60,110,50])); A.rect(4,9,10,10,C([180,170,150])); A.outline(rgb(10,10,10)); }),
  tag: art(10,8,A=>{ A.rect(0,0,9,7,C([150,156,160])); A.rect(1,2,8,2,C([60,60,60])); A.rect(1,5,6,5,C([60,60,60])); A.disc(8,1,1,C([40,40,40])); A.outline(rgb(10,10,10)); }),
  lantern: art(10,18,A=>{ A.rect(4,0,5,2,C([40,40,40])); A.rect(1,3,8,16,C([40,36,30])); A.rect(2,5,7,14,glow(255,190,90)); A.rect(0,16,9,17,C([30,26,22])); }),
});
const tally_=s=>()=>S.flags[s];

/* ── the reservoir ─────────────────────────────────────────────────────── */
function reservoir(){
  const W=40,H=30,g=Grid(W,H,' '); box(g,0,0,W-1,H-1,'S');
  rect(g,3,2,36,13,'w');
  box(g,3,19,9,25,'W'); g[22][9]='+';                         // Walter Pike's hut
  box(g,28,19,35,25,'W'); g[22][28]='+'; rect(g,30,19,33,19,'G'); // the Carver house
  rect(g,10,26,27,28,'.');                                    // the shore road
  const s={id:'reservoir',name:'Pike’s Reservoir',grid:g,outdoor:true,ambient:.4,
    spawn:{x:20,y:24.6,a:-Math.PI/2},
    doors:{'9,22':{to:'hut',x:1.6,y:3.5,a:0},'28,22':{to:'carver',x:9.4,y:4.5,a:Math.PI}},
    lights:[{x:10.5,y:22,p:1.4,f:.3},{x:27.5,y:22,p:1.4,f:.3},{x:20,y:15,p:.8,f:.4}],
    pois:[{x:20,y:14,name:'The waterline',kind:'note'},{x:9.5,y:22.5,name:'Walter Pike’s hut',kind:'door'},{x:28.5,y:22.5,name:'The Carver house',kind:'door'},{x:20,y:27,name:'Impala',kind:'car'}],
    entities:[impala_(20,27,-Math.PI/2),
      {kind:'prop',m:'lantern',x:10.4,y:21.2,r:.1,h:.5,z:.9,emit:.9,lit:1},{kind:'prop',m:'lantern',x:27.6,y:21.2,r:.1,h:.5,z:.9,emit:.9,lit:1},
      {kind:'prop',m:'tree',x:5,y:16.5,r:.5,h:4.2},{kind:'prop',m:'tree',x:36,y:16.4,r:.5,h:4.2},{kind:'prop',m:'tree',x:14,y:28,r:.5,h:4.2},
      {kind:'prop',m:'footprints',x:20,y:16.2,r:.01,h:.04,flat:true},{kind:'prop',m:'footprints',x:20.4,y:14.8,r:.01,h:.04,flat:true},
      {kind:'prop',m:'cross',x:20,y:14.3,r:.05,h:.01,use:'res_water',useName:'The waterline'},
      {kind:'prop',m:'bell',x:20,y:5.4,r:.8,h:1.6,hidden:true,resBell:true},
      {kind:'prop',m:'bones',x:21.4,y:6.6,r:.3,h:.3,hidden:true,resBell:true,use:'res_keeper',useName:'What is tangled in the bell rope'},
      echo_('elise',20.2,13.6,{look:'elise',h:1.7,face:Math.PI/2}),
      pick_('holywater',33.5,27.4), pick_('shells',6.5,27.2)]};
  return s;
}
function hut(){
  const s=room('hut','Walter Pike’s hut',9,7,'W',.16); s.ceilH=1.3;
  s.grid[3][0]='+'; s.doors['0,3']={to:'reservoir',x:10.4,y:22.5,a:0};
  s.spawn={x:1.6,y:3.5,a:0}; s.lights=[{x:5,y:3,p:1.2,f:.3}]; s.pois=[{x:.5,y:3.5,name:'Out',kind:'door'}];
  s.entities=[char_('walter',6.2,3.4,{kind:'npc',dialogue:'walter',name:'Walter Pike',h:1.8,face:Math.PI}),
    {kind:'prop',m:'drawings',x:4.5,y:1.3,r:.15,h:.7,z:.5,use:'res_tally',useName:'Pencil marks on the wall'},
    {kind:'prop',m:'counter',x:6.5,y:5.4,r:.5,h:.85},{kind:'prop',m:'paper',x:6.5,y:5.3,r:.2,h:.3,z:.5,read:'fishlog',readName:'A fishing log'},
    {kind:'prop',m:'paper',x:2.5,y:1.3,r:.15,h:.6,z:.7,read:'countymap',readName:'A county map, pinned up'}];
  return s;
}
function carver(){
  const s=room('carver','The Carver house',11,9,'P',.2); s.ceilH=1.35;
  s.grid[4][10]='+'; s.doors['10,4']={to:'reservoir',x:27.4,y:22.5,a:Math.PI};
  s.spawn={x:9.4,y:4.5,a:Math.PI}; s.lights=[{x:5,y:4,p:1.4,f:.24},{x:2,y:2,p:.6,f:.5}]; s.pois=[{x:10.5,y:4.5,name:'Out',kind:'door'}];
  s.entities=[char_('ruth',4.2,3.2,{kind:'npc',dialogue:'ruth',name:'Ruth Carver',h:1.72,face:0}),
    {kind:'prop',m:'counter',x:5.4,y:5.6,r:.5,h:.8},{kind:'prop',m:'counter',x:6.5,y:5.6,r:.5,h:.8},
    {kind:'prop',m:'footprints',x:6,y:5.6,r:.01,h:.3,z:1.0,use:'c_ceiling',useName:'Something on the ceiling'},
    {kind:'prop',m:'bed',x:2,y:7.4,r:.6,h:.5}];
  return s;
}
[reservoir(),hut(),carver()].forEach(s=>{ s.region='reservoir'; addSector(s); });
Object.assign(LOOKS,{
  walter: {skin:[200,160,130], hair:{style:'short',col:[150,146,140]}, beard:[170,166,160], eyes:{col:[80,90,96]},
           top:{kind:'raincoat',col:[60,92,60],long:41}, legs:{kind:'cargo',col:[70,66,56]}, shoes:[40,34,30], hat:{kind:'beanie',col:[150,60,40]}},
  ruth:   {skin:[222,184,156], hair:{style:'bun',col:[120,100,80]}, eyes:{col:[90,110,90]}, lip:[170,110,104],
           top:{kind:'cardigan',col:[150,110,120],underCol:[220,214,200]}, legs:{kind:'skirt',col:[70,70,90]}, shoes:[60,50,44]},
  elise:  {skin:[206,214,220], hair:{style:'long',col:[60,46,36]}, eyes:{col:[60,70,80]}, lip:[150,150,170],
           top:{kind:'hoodie',col:[110,40,60]}, legs:{kind:'jeans',col:[40,50,70]}, shoes:[200,200,196], tint:[120,170,200], tintAmt:.18},
  daniel: {skin:[196,150,116], hair:{style:'messy',col:[60,44,32]}, stubble:true, beard:[70,52,40], eyes:{col:[90,70,50]},
           top:{kind:'jacket',col:[120,90,60],underCol:[180,180,170],open:true}, legs:{kind:'jeans',col:[50,60,80]}, shoes:[40,30,24]},
});
SPEAKERS.walter={name:'Walter Pike',col:'#a8c8a0'}; SPEAKERS.ruth={name:'Ruth Carver',col:'#d8b0c0'}; SPEAKERS.elise={name:'Elise',col:'#b8c8e8'};
SPEAKERS.daniel={name:'Daniel Rusk',col:'#d0a878'}; SPEAKERS.passenger={name:'',col:'#9aa8b8'};
ECHOES.elise={name:'Elise Carver',text:'Elise Carver, 16. In the photo she is standing at the edge of the water, wet to the knees, looking back at the house as if somebody has just called her in for dinner. Her shadow points the wrong way.'};
PEOPLE.push({flag:'met_walter',look:'walter',name:'Walter Pike',line:'Fisherman. Hears the bell at 2:40.'},{flag:'met_ruth',look:'ruth',name:'Ruth Carver',line:'Elise’s mother. Says Elise came home last night.'},
  {flag:'met_daniel',look:'daniel',name:'Daniel Rusk',line:'Drove two hundred miles and ended up at the motel.'});
defDest({id:'street',name:'Main Street',sector:'street',x:28.4,y:38.4,a:-Math.PI/2,avail:()=>true});
defDest({id:'reservoir',name:'Pike’s Reservoir',sector:'reservoir',x:20,y:24.6,a:-Math.PI/2,avail:()=>!!S.flags.bell_lead&&S.act<=2,note:()=>caseClosed('bell')?'case closed':'the bell'});
Object.assign(READS,{
  fishlog:()=>"Thirty years of ordinary entries in a blunt pencil: date, weather, what bit.\n\nThen, on the night of the first bell, the handwriting doesn’t change but the tense does:\n\n“Oct 3. Fog. Two men in a black car will come and ask me about the bell. The tall one will be kind about it. The other one will look at my wall for a long time.”\n\nThe entry is dated eleven years ago."+(isDean()?"\n\nYou realise you have been looking at his wall for a long time.":""),
  countymap:"COUNTY OF COOS — RESERVOIR PROJECT, 1951. The lower Pike settlement is shaded blue with a neat stamp: EVACUATED — ALL RESIDENTS RELOCATED.\n\nIn the corner, a small seal: a circle with a crossroads in it, and the initials C.H.",
  parish:"ST. BRENDAN’S — PARISH REGISTER, LOWER PIKE CHAPEL (1951)\n\nA list of families, each with a tick and RELOCATED beside it. Three names have no tick.\n\nAMOS WREN, bell keeper. ‘Would not leave his wife’s grave.’\nMARY and JOHN ORR, ‘not found at evacuation.’\n\nFolded inside: a property transfer for the chapel land, sealed with a crossroads and the initials C.H. It is dated 1951. Crossroads Holdings was incorporated in 1962.",
});
SECTORS.library.entities.push({kind:'prop',m:'paper',x:1.6,y:4.6,r:.2,h:.4,z:.6,read:'parish',readName:'The parish register (lower Pike)'});
USES.res_tally=()=>{ S.flags.res_tally=true; openMenu('Pencil marks','Hundreds of short pencil lines in groups of five, floor to shoulder height. Each group has a date. Every date Walter heard the bell.\n\nYou check six of them against the case file. Six deaths in Oakhaven. Six bells, the night before each one.',[{text:'Step back'}]); };
USES.c_ceiling=()=>{ S.flags.c_ceiling=true; openMenu('The ceiling','Above the kitchen table, on the plaster, one wet footprint. Bare. Small. The toes point toward the door.\n\nIt is still wet. A drop falls from it while you watch and lands on the table in front of Elise’s chair.',[{text:'Step back'}]); };
USES.res_water=()=>{ const F=S.flags; F.res_water=true;
  if(!F.bell_rang&&(F.res_tally||F.c_ceiling)&&(F.read_fishlog||F.read_parish)) return bellRings();
  openMenu('The waterline',F.bell_rang?'The water is standing back from the old chapel path. It is waiting to see what you do.':'Wet footprints come down from the house and walk straight into the reservoir. They stop at the surface. They don’t go under. They just stop, as if whoever made them stepped onto something that wasn’t water.',[{text:'Step back'}]); };
function bellRings(){
  const F=S.flags; F.bell_rang=true; const s=SECTORS.reservoir;
  sfx('bell'); later(2.6,()=>sfx('bell')); later(5.2,()=>sfx('bell'));
  S.glitchA=.4; S.shake=.3;
  const el=char_('elise',20,4.4,{kind:'actor',h:1.7,face:Math.PI/2,lit:.9,hidden:false,trans:true}); s.entities.push(el);
  later(1,()=>{ S.flipped=true; say('narr','The bell rings, under the water. For a few seconds the reservoir is a mirror, and in the mirror there is a village: a chapel, a lane, a lit doorway. A girl in a red hoodie is standing in the doorway, looking directly at you.',7,{now:true}); });
  later(6,()=>{ S.flipped=false; S.glitchA=.6; s.entities=s.entities.filter(e=>e!==el);
    for(let y=6;y<=13;y++) for(let x=19;x<=21;x++) s.grid[y][x]='c'; pack(s);
    for(const e of s.entities) if(e.resBell) e.hidden=false;
    say('narr','When it stops, the water has stood back from a line of old foundation stones, as if it’s holding a door open. At the end of the line, half-sunk, there’s a bell.',6); });
  later(12.5,()=>say(brother(),isDean()?'That was her. Elise. She looked right at us.':'That was the girl. Elise. Sam, she was looking at us.',3.4));
}
/* the water is cold and doesn't want you, until it does. You can swim in it.
   Before the bell has rung, a current keeps you near the shore. If you tire,
   you're carried back to the nearest dry ground. Nothing can strand you. */
function nearestDry(s,x,y){ const W=s.grid[0].length, H=s.grid.length, seen=new Set(), q=[[x|0,y|0]];
  while(q.length){ const [cx,cy]=q.shift(), k=cx+','+cy; if(seen.has(k)) continue; seen.add(k);
    if(cx<0||cy<0||cx>=W||cy>=H) continue; const c=s.grid[cy][cx];
    if(c!=='w'&&!hits(s,cx+.5,cy+.5,.3)) return [cx+.5,cy+.5];
    if(c==='w'||c===' '||c==='.'||c==='c') for(const [dx,dy] of [[0,1],[1,0],[-1,0],[0,-1]]) q.push([cx+dx,cy+dy]); }
  return [s.spawn.x,s.spawn.y]; }
function inWater(){ const r=S.sector.grid[S.py|0]; return !!r&&r[S.px|0]==='w'; }
INV_UPDATES.push(dt=>{ const F=S.flags;
  if(!inWater()||S.driving){ if(S.swimming){ S.swimming=false; } return; }
  if(!S.swimming){ S.swimming=true; sfx('step'); if(!F.swimTip){ F.swimTip=true; toast('Swimming · slow, and it tires you · stamina'); } }
  /* slow, heavy, cold */
  S.vx*=Math.pow(.18,dt); S.vy*=Math.pow(.18,dt); S.stamina=Math.max(0,S.stamina-7*dt); S.staminaT=1;
  if(S.sector.id==='reservoir'&&!F.bell_rang&&S.py<12.5){ S.py+=1.6*dt;                 // the current
    if(!F.waterSaid||S.time-F.waterSaid>8){ F.waterSaid=S.time; say('narr','The water is very cold, and it pushes you back toward the shore. Somewhere under it, something is ringing.',3.4,{now:true}); } }
  if(S.stamina<=0){ const [x,y]=nearestDry(S.sector,S.px,S.py); S.px=x; S.py=y; S.vx=S.vy=0; S.stamina=30; S.hp=Math.max(1,S.hp-5); S.swimming=false;
    say('narr','Your arms give out. You don’t remember the last few strokes, only the stones under your knees on the bank.',3.6,{now:true}); }
});
USES.res_keeper=()=>{ if(caseDecision('bell')) return openMenu('The bell keeper','He’s still holding the rope.',[{text:'Step back'}]);
  S.flags.res_keeper=true;
  openMenu('The bell keeper',"Bones, tangled in what’s left of the bell rope, the rope wound twice round the wrists. Amos Wren didn’t drown when the valley flooded. He kept ringing. He was ringing when the water closed over the bell, and some part of him never stopped.\n\nThe bell doesn’t call the dead. It replays the last moment somebody refuses to accept. Ruth Carver’s refusal has a daughter in it.",
    [{text:'Silence the bell. Break the clapper with salt and iron.',note:'Ruth will remember Elise never came home',act:()=>bellEnd('silence')},
     {text:(isDean()?'Sam':'Dean')+' goes into the reflection to bring Elise back.',note:'she will come back different',act:()=>bellEnd('answer')},
     {text:'Leave it. Take the evidence and go.',note:'the bell will be heard somewhere else',act:()=>bellEnd('leave')}]); };
function bellEnd(k){ decide('bell',k); const F=S.flags, s=SECTORS.reservoir;
  /* the stones only sink once nobody is standing on them */
  const shut=()=>{ const close=()=>{ for(let y=6;y<=13;y++) for(let x=19;x<=21;x++) s.grid[y][x]='w'; pack(s); for(const e of s.entities) if(e.resBell) e.hidden=true; };
    const onStones=()=>S.sector===s&&S.px>=18.6&&S.px<=22.4&&S.py>=5.5&&S.py<=14;
    if(!onStones()) return close();
    s.closing=true; if(!F.stonesSaid){ F.stonesSaid=true; say('narr','The water is coming back over the stones. Walk back to the shore.',4); }
    const w=()=>{ if(!onStones()||S.sector!==s){ s.closing=false; close(); } else later(.5,w); }; later(.5,w); };
  if(k==='silence'){ F.bell_silenced=true; sfx('salt'); sfx('riteEnd'); S.shake=.5;
    say('narr','Salt in the mouth of it, then iron. The clapper cracks like a knuckle. The bell makes one last sound, not a ring, more like someone letting out a breath they have held since 1951.',6,{now:true});
    later(6,()=>{ shut(); const r=SECTORS.carver.entities.find(e=>e.look==='ruth'); if(r) r.dialogue='ruth_after'; closeCase('bell'); }); }
  if(k==='answer'){ F.elise_returned=true; sfx('bell');
    say('narr',`${isDean()?'Sam':'Dean'} walks down the old stones and into the reflection, and the reflection lets him. For eleven minutes nothing happens. You count them.`,6,{now:true});
    if(COMP) COMP.hidden=true;
    later(7,()=>{ sfx('bell'); if(COMP){ COMP.hidden=false; COMP.x=20.6; COMP.y=14.6; }
      say('narr','Then he walks back out of the water, soaked to the chest, holding a girl in a red hoodie by the wrist. She is dry.',5); });
    later(12.5,()=>say(brother(),isDean()?'She was in the doorway. She asked me if dinner was ready. Before I said anything.':'She asked if dinner was ready. Dean, she asked before I opened my mouth.',4));
    later(17,()=>{ shut(); SECTORS.carver.entities.push(char_('elise',6.6,3.2,{kind:'npc',dialogue:'elise',name:'Elise Carver',h:1.7,face:Math.PI}));
      const r=SECTORS.carver.entities.find(e=>e.look==='ruth'); if(r) r.dialogue='ruth_back'; closeCase('bell'); }); }
  if(k==='leave'){ F.bell_left=true;
    say('narr','You take photographs, the register, the map, and you leave Amos Wren holding his rope. Behind you, the water closes over the stones as politely as a door.',6,{now:true});
    later(6,()=>{ shut(); closeCase('bell'); }); }
}
/* the bell, left alone, turns up somewhere else */
INV_UPDATES.push(dt=>{ if(!S.flags.bell_left||S.act<2||S.sector.id!=='street') return;
  S.bellT=(S.bellT??40)-dt; if(S.bellT<=0){ S.bellT=70+Math.random()*60; sfx('bell'); if(!S.flags.bellStreetSaid){ S.flags.bellStreetSaid=true; say(brother(),'That’s the bell. That’s the reservoir bell. We’re a mile from the reservoir.',4); } } });

Object.assign(DIALOGUE,{
  walter:{ port:'walter', start:()=>S.flags.met_walter?'w9':'w0', nodes:{
    w0:{speaker:'Walter Pike',text:"An old man in a green slicker, sitting with his back to the water as if he’s keeping an eye on it the other way round.\n\n\"You heard me on the radio. Nobody hears me on the radio.\" He doesn’t get up. \"It rings at twenty to three. A church bell. There hasn’t been a church on this water since 1951.\"",
      choices:[D_("Tell me about the first time.",'w1'),D_("[Dean] You stopped fishing. Why?",'w2',null,isDean),D_("[Sam] Who do you hear, Walter? With the bell.",'w2',null,isSam)]},
    w1:{speaker:'Walter Pike',text:"\"Eleven years ago. I was out in the boat. Thought it was a buoy. Then I counted, and it was nine strokes, and there were nine people at the Bellweather funeral the next week.\" He nods at the wall behind him. \"I keep a tally. I’m a fisherman. You keep a log or you lie to yourself about what you caught.\"",
      choices:[D_("And the girl? Elise Carver?",'w3')]},
    w2:{speaker:'Walter Pike',text:"\"Because my wife called me from the lake.\" He says it flatly, like weather. \"Joan. Dead six years. Called my name from out past the reeds, and I put the oar in, and I’d have rowed right out if the bell hadn’t stopped.\n\nI sold the boat. I don’t go down to the water now. I just listen.\"",
      choices:[D_("And the girl? Elise Carver?",'w3')]},
    w3:{speaker:'Walter Pike',text:"\"Three nights ago. She came down the shore road at twenty to three, in her red sweatshirt, and walked into the water like it was a floor. Ruth says she came home last night. Ruth isn’t lying. That’s the trouble.\"",
      choices:[D_("[Thank him.]",null,{flag:'met_walter'})]},
    w9:{speaker:'Walter Pike',text:()=>S.flags.bell_silenced?"\"Quiet tonight. I don’t know what to do with my hands.\"":"\"Twenty to three. Listen.\"",choices:[D_("[Leave.]",null)]},
  }},
  ruth:{ port:'ruth', start:()=>S.flags.met_ruth?'r9':'r0', nodes:{
    r0:{speaker:'Ruth Carver',text:"She is setting the table for two. She has set it for two for three days.\n\n\"If you’re from the school, she’s fine. She came home last night. She left wet footprints all over my kitchen and asked if dinner was ready, and I said ten minutes, and she went up to change.\" She lays a fork down very straight. \"She’s a teenager. They don’t come down.\"",
      choices:[D_("[Sam] Mrs. Carver, what day is it today?",'r1s',null,isSam),D_("[Dean] When did you last actually see her face?",'r1d',null,isDean),D_("Can I see her room?",'r2')]},
    r1s:{speaker:'Ruth Carver',text:"\"It’s—\" She stops with the knife in her hand. \"It’s Thursday. It was Thursday. She came home Thursday. She comes home every night.\" Her voice is very calm. \"Don’t do that. Don’t make me count.\"",
      choices:[D_("[Leave it there.]",null,{flag:'met_ruth',now:()=>{ S.flags.ruth_count=true; }})]},
    r1d:{speaker:'Ruth Carver',text:"For a second something gets out from behind her eyes.\n\n\"She was looking at the lake. She had her back to me. She’s always got her back to me lately.\" She picks up the fork she just put down, and puts it down again. \"Dinner’s in ten minutes.\"",
      choices:[D_("[Leave it there.]",null,{flag:'met_ruth'})]},
    r2:{speaker:'Ruth Carver',text:"\"She’s changing. Give her a minute.\" She doesn’t look at the stairs. There aren’t any stairs. It’s a one-storey house.",
      choices:[D_("[Leave it there.]",null,{flag:'met_ruth'})]},
    r9:{speaker:'Ruth Carver',text:"\"Ten minutes.\"",choices:[D_("[Leave.]",null)]},
  }},
  ruth_after:{ port:'ruth', start:'a0', nodes:{ a0:{speaker:'Ruth Carver',
    text:"The second place setting is gone. She is sitting at the table with both hands flat on it, the way people sit at hospitals.\n\n\"She didn’t come home,\" she says. \"I knew. I knew on Thursday. I just—\" Her mouth works. \"Thank you. I don’t want to thank you. Thank you.\"",
    choices:[D_("[Sit with her a while.]",null,{align:['h',1]})]} }},
  ruth_back:{ port:'ruth', start:'b0', nodes:{ b0:{speaker:'Ruth Carver',
    text:"\"Dinner’s ready,\" she says, to her daughter, and her daughter says \"Thanks, Mom,\" before she finishes saying it. Ruth laughs, a little too loud. She doesn’t mind. She has decided not to mind.",
    choices:[D_("[Leave them to it.]",null)]} }},
  elise:{ port:'elise', start:'e0', nodes:{ e0:{speaker:'Elise Carver',
    text:"\"No, I don’t remember the water,\" she says, before you’ve asked. \"No, it didn’t hurt. Yes, I know what day it is. It’s Sunday.\" She smiles at the question you were just about to ask. \"Thank you for coming to get me. He held my wrist the whole way. Nobody ever holds your wrist that hard unless they mean it.\"",
    choices:[D_("[…]",null)]} }},
});

defCase({ id:'bell', n:20, kicker:'Act I · Case 4 (optional)', title:'The Bell Beneath the Water', open:()=>!!S.flags.bell_lead,
  summary:()=>caseClosed('bell')?'A bell that replays the last moment someone refuses to accept.':'A church bell rings under Pike’s Reservoir at twenty to three. Elise Carver, 16, walked into the water three days ago. Her mother says she came home last night.',
  clues:{
    radio:{t:'Walter on the radio',k:'sound',x:'A bell under the water, every night at 2:40. Twenty minutes before the town’s hour.',have:F_('bell_lead')},
    walter:{t:'Walter Pike',k:'talk',x:'His dead wife called him from the lake. The bell stopped. He sold the boat.',have:F_('met_walter')},
    tally:{t:'The tally wall',k:'place',x:'A bell the night before each of the six deaths.',have:F_('res_tally')},
    log:{t:'The fishing log',k:'doc',x:'Eleven years ago: “Two men in a black car will come and ask me about the bell.”',have:F_('read_fishlog')},
    map:{t:'The county map',k:'doc',x:'Lower Pike settlement: EVACUATED — ALL RESIDENTS RELOCATED. Seal: C.H.',have:F_('read_countymap')},
    parish:{t:'The parish register',k:'doc',x:'Three names never ticked. Amos Wren, bell keeper, would not leave his wife’s grave.',have:F_('read_parish')},
    ruth:{t:'Ruth Carver',k:'talk',x:'“She came home last night. She asked if dinner was ready.” Elise has been missing three days.',have:F_('met_ruth')},
    ceiling:{t:'A footprint on the ceiling',k:'place',x:'Bare, small, wet, toes toward the door. Above Elise’s chair.',have:F_('c_ceiling')},
    water:{t:'The waterline',k:'place',x:'Wet footprints walk into the reservoir and stop at the surface.',have:F_('res_water')},
    reflection:{t:'The reflection',k:'place',x:'When the bell rang the water reflected a village that isn’t there. Elise in a lit doorway.',have:F_('bell_rang')},
    echo:{t:'Elise, photographed',k:'photo',x:'At the waterline, looking back at the house. Her shadow points the wrong way.',have:F_('echo_elise'),img:PH_('echo:elise')},
    keeper:{t:'The bell keeper',k:'place',x:'Bones wound in the bell rope. Amos Wren kept ringing.',have:F_('res_keeper')},
  },
  links:[
    {id:'ahead',a:'log',b:'tally',t:'The log writes ahead',x:'Walter’s entries describe things before they happen, including you. Whatever is under the water knows what comes next.',dean:'He wrote about us eleven years ago. I hate that.',sam:'Something here records events before they occur. Remember that.'},
    {id:'evac',a:'map',b:'parish',t:'Not all relocated',x:'The county says everyone was evacuated. The parish says three were never found, and one refused to leave.',dean:'Official story, real story.',sam:'The record says safe. The register says otherwise. Sound familiar?'},
    {id:'upside',a:'ceiling',b:'reflection',t:'She came home upside down',x:'The footprint is on the ceiling because Elise walked home through the reflection, where up is down.',dean:'She walked home on the wrong side of the water.',sam:'She came home through the mirror.'},
    {id:'moment',a:'ruth',b:'reflection',t:'A moment that answers',x:'What Ruth sees isn’t a ghost. It’s the last moment she refuses to accept, replaying, and it has learned how to answer her.',dean:'It knows what Elise knew. It doesn’t know she’s gone.',sam:'Killing it won’t bring her back. It isn’t her.'},
    {id:'ringer',a:'parish',b:'keeper',t:'He kept ringing',x:'Amos Wren rang the bell as the valley flooded, for a grave he wouldn’t leave. The refusal outlived him.',dean:'Guy wouldn’t leave his wife. I get it. I don’t like it.',sam:'He’s the first refusal. Everyone else’s plays on his bell.'},
    {id:'older',a:'map',b:'parish',t:'Older than the company',x:'The chapel land transfer carries the crossroads seal, C.H., in 1951. Crossroads Holdings didn’t exist until 1962.',dean:'Somebody was using Crowley’s stamp before Crowley.',sam:'The pattern is older than the company.',opens:'something to show Crowley',fx:()=>{ S.flags.bell_seal=true; }},
  ],
  theory:{q:'What is the Elise her mother sees?',reward:25,
    opts:[{id:'ghost',t:'Elise’s ghost. She drowned three days ago.'},{id:'moment',t:'A repeated moment, the last thing Ruth refuses to accept, that has learned to answer.',ok:true},{id:'demon',t:'Something wearing her face to get into the house.'}],
    right:'It was never Elise. It was a mother’s refusal, replayed on a bell that has been ringing since 1951.',
    wrong:'Nothing was wearing her. It was the moment Ruth wouldn’t let end, and it had learned her daughter’s voice.'},
  talk:()=>{ const D=isDean(); return caseDecision('bell')?[[brother(),D?'You think Ruth’s better off knowing?':'Do you think Ruth’s better off, Dean? Knowing?'],[S.hero,D?'I think she deserves to know. I don’t think it makes her better off. Those are different.':'I don’t know if knowing makes anyone better off. I know it’s hers to know.']]
    :[[brother(),D?'If it’s her daughter, I want to know before I salt anything.':'Her mom thinks she’s home. We can’t just walk in and tell her.'],[S.hero,D?'We tell her the truth. That’s the job.':'Somebody has to. Truth doesn’t make you better off, Sam. It just makes you right.']]; },
  autopsy:()=>{ const d=caseDecision('bell');
    return { what:['The bell under Pike’s Reservoir rang at twenty to three. The water reflected a drowned village, and Elise in a doorway.',
        d==='silence'?'You broke the clapper. Ruth Carver remembers that Elise never came home.':d==='answer'?'One of you walked into the reflection and brought Elise back. She answers before you ask.':'You left the bell ringing.'],
      cause:['In 1951 the county flooded the lower Pike settlement and recorded everyone as relocated. Three were never found. The bell keeper wouldn’t leave his wife’s grave, and kept ringing.',
        deduced('older')?'The land transfer carries a crossroads seal eleven years older than Crossroads Holdings.':'The map has a seal on it you didn’t look at closely.'],
      open:['Walter’s log described you eleven years before you came.',d==='answer'?'Whatever came back with Elise knows the next question. Nobody knows what else it knows.':d==='leave'?'The bell can be heard somewhere else now.':'Ruth Carver has to live with what she knows.','C.H., 1951.'],
      dean:d==='silence'?'She deserved the truth. It didn’t make her better off. I don’t think it was supposed to.':'Sometimes the truth just takes the last thing a person had.',
      sam:d==='silence'?'A comforting lie is still a cage. She can grieve now. That’s a door, not a wall.':'We gave her back something. I’m not sure what.' }; },
  paper:()=>{ const d=caseDecision('bell');
    return { head:d==='answer'?'MISSING TEEN FOUND “DRY” AT RESERVOIR':d==='silence'?'VIGIL FOR ELISE CARVER, 16':'RESERVOIR BELL: “IT’S STILL RINGING,” SAYS FISHERMAN',
      deck:d==='answer'?'Elise Carver returned after three days missing. She “does not remember the water.”':d==='silence'?'Mother asks the town to light a candle at 2:40.':'Residents report hearing a church bell in places that have no church.',
      by:'Ledger staff', photo:['echo:elise'], cap:'The waterline at Pike’s Reservoir, Saturday.',
      body:[d==='answer'?'Elise Carver, a sophomore at Oakhaven High, walked home on Saturday night after three days missing. Her mother, Ruth, said only: “Dinner was ready.”':d==='silence'?'Elise Carver, 16, has been declared missing, presumed drowned, at Pike’s Reservoir. Her mother has asked residents to light a candle at twenty to three on Sunday.':'Walter Pike, a retired fisherman, says the bell under Pike’s Reservoir has rung every night for eleven years. On Saturday, he said, it rang in the middle of town.',
        'The reservoir was created in 1951 when the county flooded the lower Pike valley. Official records list all residents as relocated. A parish register at the Oakhaven library lists three who were not.',
        'The land deed for the drowned chapel bears a seal the Ledger has been unable to identify: a circle, a crossroads, and the initials C.H.'] }; },
  forum:()=>{ const d=caseDecision('bell');
    return [{u:'w.pike',t:d==='silence'?'Quiet last night. First time in eleven years.':'Twenty to three. Listen.'},{u:'oakhaven_hs_parents',t:d==='answer'?'So happy for the Carvers!!! ❤️':'Praying for Ruth.'},
      {u:'elise.c',t:d==='answer'?'thanks everyone. yes I know. you were about to ask':'[no posts]'},{u:'gus_in_the_woods',t:'My grandmother was lower Pike. She said the bell rang the day they flooded it and never really stopped.'}]; },
});
/* the lead: a voice on the Impala radio, and Marla */
RADIO.push({when:()=>S.act===1&&S.flags.marla,name:'KOAK 1340 AM — call-in',lines:['…caller, you’re on the air.','Yeah. It’s Walter Pike again. Out at the reservoir.','It’s ringing tonight. The bell. Twenty to three. Same as every night, and nobody comes.','There’s a girl. Elise Carver. She went in the water Thursday, and her mother says she came home. Somebody should go out there. Somebody with a car.'],fx:()=>{ if(!S.flags.bell_lead){ S.flags.bell_lead=true; toast('New destination — Pike’s Reservoir (Impala)'); } }});
INV_UPDATES.push(dt=>{ const F=S.flags; if(F.bell_lead||!F.earl||S.act!==1||S.cut) return;
  if(!F.bell_nudge){ F.bell_nudge=S.time; return; }
  if(S.time-F.bell_nudge>45){ F.bell_lead=true; msg('marla','walter pike called the desk again. says the bell at the reservoir is ringing and the carver girl came home. he calls every night. the impala could make it out there'); } });

/* ── Route 9 ───────────────────────────────────────────────────────────── */
function route9(){
  const W=11,H=66,g=Grid(W,H,' '); box(g,0,0,W-1,H-1,'S'); rect(g,1,0,1,H-1,'S'); rect(g,9,0,9,H-1,'S');
  rect(g,3,1,7,H-2,'.'); rect(g,2,1,2,H-2,','); rect(g,8,1,8,H-2,',');
  const m=(n,y,o={})=>Object.assign({kind:'prop',m:'marker',x:8.4,y,r:.12,h:1.2,use:'r9_marker',useName:`Mile marker ${n}`,mile:n},o);
  return {id:'route9',name:'Route 9, northbound',grid:g,outdoor:true,ambient:.35,spawn:{x:5,y:61.5,a:-Math.PI/2},doors:{},
    lights:[{x:5,y:61,p:1.6,f:.3}],pois:[{x:5,y:63,name:'Impala',kind:'car'}],
    entities:[impala_(5,63.2,-Math.PI/2),
      m(12,56),m(13,50),m(14,44),
      m(14,38,{bq:true}),{kind:'prop',m:'bouquet',x:8.3,y:38.4,r:.05,h:.4,z:.3},
      m(9,30,{draw:true}),{kind:'prop',m:'paper',x:8.2,y:30.4,r:.05,h:.3,z:.35},
      m(3,20,{tag:true}),{kind:'prop',m:'tag',x:7.6,y:20.4,r:.05,h:.12,z:.05,use:'r9_tag',useName:'Something metal in the gravel'},
      m(1,8,{fp:true}),{kind:'prop',m:'footprints',x:5,y:6,r:.01,h:.04,flat:true},{kind:'prop',m:'footprints',x:5.2,y:3.6,r:.01,h:.04,flat:true},
      {kind:'prop',m:'tree',x:2.5,y:48,r:.2,h:4},{kind:'prop',m:'tree',x:2.5,y:26,r:.2,h:4},{kind:'prop',m:'pole',x:2.2,y:14,r:.18,h:5.6}]};
}
{ const r=route9(); r.region='route9'; addSector(r); }
defDest({id:'route9',name:'Route 9 (out of town)',sector:'route9',x:5,y:61.5,a:-Math.PI/2,avail:()=>!!S.flags.road_lead&&S.act===2&&!caseClosed('road'),note:()=>'Daniel’s way out'});
const MARKER_TXT={12:'MILE 12. Gravel. A beer can, faded white.',13:'MILE 13. Somebody has scratched a tally into the post: four strokes and a line.',
  14:'MILE 14.', 9:'MILE 9. A child’s drawing in a sandwich bag is taped to the post: two boys in the front seat of a brown car. The smaller one is waving.',
  3:'MILE 3.', 1:'MILE 1. Footprints in the gravel shoulder, a man’s work boots, leading straight into the fog. None coming back.'};
USES.r9_marker=e=>{ const F=S.flags;
  if(e.bq){ F.r9_bouquet=true; openMenu('Mile marker 14','MILE 14, again. The numbers have started going down.\n\nA fresh bouquet is wired to the post: carnations, the gas-station kind. The card is in a child’s handwriting, gone over again in an adult’s:\n\nFOR TOMMY. I’M SORRY I WAS DRIVING.',[{text:'Step back'}]); return; }
  if(e.draw) F.r9_drawing=true; if(e.fp) F.r9_footprints=true; if(e.mile===14) F.r9_14=true;
  F.r9_markers=(F.r9_markers||0)+1; openMenu(`Mile marker ${e.mile}`,MARKER_TXT[e.mile]||`MILE ${e.mile}.`,[{text:'Step back'}]); };
USES.r9_tag=()=>{ S.flags.r9_tag=true; sfx('pickup'); openMenu('A metal tag','An asset tag on a snapped wire: OAKHAVEN MILL & TIMBER · ASSET 77-14 · FLATBED, LINE 3.\n\nThe mill’s inventory lists 77-14 as scrapped in 1979. Route 9 was paved in 1983.',[{text:'Pocket it'}]); };
/* walking north into the fog brings you back to the start */
INV_UPDATES.push(dt=>{ const F=S.flags; if(S.sector.id!=='route9') return;
  if(!F.r9_toll&&S.py<2.2){ S.py=61.4; S.glitchA=.5; F.r9_loops=(F.r9_loops||0)+1; sfx('whisper');
    if(COMP&&!COMP.hidden){ COMP.x=S.px+.8; COMP.y=62.4; }
    say('narr',F.r9_loops===1?'You walk into the fog for what feels like a mile. Then the fog thins, and you’re standing next to the Impala, facing north. Mile marker 12 is where it was.':'The Impala again. Marker 12 again. The fog is patient.',4.5,{now:true}); }
  if(!F.r9_toll&&deduced('rule')&&S.py<14){ F.r9_toll=true; const s=SECTORS.route9;
    box(s.grid,3,1,7,4,'W'); s.grid[4][5]='.'; s.grid[4][4]='.'; s.grid[4][6]='.'; rect(s.grid,4,2,6,3,'.'); pack(s);
    s.entities.push({kind:'prop',m:'counter',x:5,y:2.4,r:.5,h:.9},{kind:'prop',m:'paper',x:5,y:2.3,r:.2,h:.3,z:.55,read:'tollledger',readName:'The toll ledger'},
      char_('daniel',6.4,5.4,{kind:'npc',dialogue:'daniel_toll',name:'Daniel Rusk',h:1.8,face:-Math.PI/2}));
    say('narr','The fog ahead has a corner in it. A toll booth, white paint gone grey, that isn’t on any map. A light is on inside. Somebody is standing beside it: Daniel. He followed you.',6,{now:true}); }
});
READS.tollledger="A ledger the size of a church Bible. Vehicles entering Oakhaven, in a dozen hands across sixty years: date, plate, time in.\n\nThe EXIT column is empty. Every line. Some have been filled in and rubbed out so hard the paper has worn through.\n\nNear the bottom, an entry in Daniel’s own handwriting, dated tonight, already there before he arrived. And under it, in pencil:\n\nA person may leave. A consequence cannot.";
/* driving the loop: the passenger */
function driveLoop(){ const F=S.flags; F.r9_drives=(F.r9_drives||0)+1; S.transition=1.1; S.pending={to:'route9',x:5,y:61.5,a:-Math.PI/2}; sfx('engine');
  later(.6,()=>{ if(F.r9_drives>=2&&!F.r9_passenger) passenger(); else say('narr','You drive north for an hour. The headlights find mile 12, mile 13, mile 14, mile 14. Then the Impala, parked, facing north. You’re sitting in it.',5,{now:true}); }); }
function passengerLook(){ const F=S.flags;
  if(isDean()) return F.delia_killed?['delia','Delia Park']:['phantom','Ray Hollis'];
  return F.kevin_used?['kevin_reading','Kevin Tran']:F.delia_killed?['delia','Delia Park']:['phantom','Ray Hollis']; }
function passenger(){ const F=S.flags, [look,nm]=passengerLook(); F.r9_passenger=nm;
  openMenu('The passenger seat',`On the third mile 14 there is somebody in the passenger seat who did not get in.\n\nIt’s ${nm}. ${look==='kevin_reading'?'Light leaks from his eyes onto the dashboard.':look==='delia'?'She has her lanyard round her neck and her hands in her lap.':'Sawdust on his shoulders. A folded form in his shirt pocket.'} They don’t look at you. They look at the road.\n\n"Can we stop?" they say. "Just up here. Where it happened. I want to show you something."`,
    [{text:'Stop the car.',act:()=>{ F.r9_stopped=true; memory(nm); }},{text:'Keep driving.',act:()=>{ F.r9_refused=true; S.dread=Math.min(1,(S.dread||0)+.2);
      say('narr','You keep driving. The headlights dim. A road sign goes past backwards. The fog presses its face against the windshield, and when you look across the passenger seat is wet, and empty.',6,{now:true}); }}]); }
function memory(nm){
  say('narr',`You pull over. ${nm} gets out and stands at the shoulder, in the headlights, and points at nothing. You remember it the way you remember dreams: not what happened, but how sure you were that it was your fault.`,6,{now:true});
  later(6.4,()=>say(S.hero,isDean()?'This isn’t real. This is the road doing a bit.':'This is a memory. It isn’t mine. It’s the shape of mine.',3.4));
  later(10.2,()=>say('passenger',`It doesn’t matter whose fault it was. It matters whether you’re still carrying it.`,4,{name:nm}));
}
Object.assign(DIALOGUE,{
  daniel:{ port:'daniel', start:()=>S.flags.met_daniel?'d9':'d0', nodes:{
    d0:{speaker:'Daniel Rusk',text:"A man sitting on the hood of a dented brown sedan in the motel lot, both hands round a styrofoam cup Marla gave him.\n\n\"I got out. I want you to know that. Six hours. Three towns. Two county lines. I bought gas in Elkton.\" He laughs. \"Then I pulled into a motel and it was this motel.\"",
      choices:[D_("Mind if we look at the car?",'d1'),D_("[Sam] What does the motel sign say, Daniel?",'d2',null,isSam),D_("[Dean] You going to try again?",'d3',null,isDean)]},
    d1:{speaker:'Daniel Rusk',text:"\"Knock yourself out. Odometer’s honest. Tank’s honest. I’m honest.\"",choices:[D_("[Leave him with his coffee.]",null,{flag:'met_daniel'})]},
    d2:{speaker:'Daniel Rusk',text:"He looks up at the buzzing sign over the office.\n\n\"PINE HOLLOW MOTOR COURT.\" His face doesn’t move. \"That’s where I grew up. That’s where my brother— I was seventeen. I was driving.\"\n\nTo you, the sign says MOTEL, with the T dead.",
      choices:[D_("[Leave him with it.]",null,{flag:'met_daniel',now:()=>{ S.flags.r9_sign=true; }})]},
    d3:{speaker:'Daniel Rusk',text:"\"No.\" Flat. \"No. Every time I try, it gets closer to Pine Hollow. Next time I’ll be home. I don’t want to be home.\"",
      choices:[D_("[Leave him.]",null,{flag:'met_daniel',now:()=>{ S.flags.r9_sign=true; }})]},
    d9:{speaker:'Daniel Rusk',text:"\"Route 9. Northbound. If you’re going, I’m not.\"",choices:[D_("[Leave.]",null)]},
  }},
  daniel_toll:{ port:'daniel', start:'t0', nodes:{
    t0:{speaker:'Daniel Rusk',text:()=>`"I couldn’t sit there." He’s holding the bouquet card from mile 14. "That’s my handwriting. Twice. Once when I was seventeen and once tonight."\n\n"So what do I do? You read the ledger. You tell me."`,
      choices:[D_("Break the loop. The tag from mile 3 is the anchor; we end it here.",'t_break',null,()=>S.flags.r9_tag),
               D_("Go back to mile 14, Daniel. Look at it. Then drive.",'t_follow'),
               D_("Wait. We could use this road. It goes places the fog won’t let us.",'t_use')]},
    t_break:{speaker:'—',port:null,text:"Salt on the booth’s threshold, iron through the tag, the words "+"in Sam’s Latin or Dean’s bad Latin. The booth light goes out. Behind you, for the first time, the mile markers count up.\n\nDaniel gets in his car and drives north, and doesn’t come back. Every road out of town is still fog. But not this one, not for him.",
      choices:[D_("[Watch him go.]",null,{now:()=>roadEnd('break')})]},
    t_follow:{speaker:'—',port:null,text:"He walks back down to mile 14 on his own. You don’t follow. He’s there for a long time.\n\nWhen he comes back his face is wet and he isn’t sure, he says, which parts of it he really remembers and which parts the road gave him. He drives north anyway. He doesn’t come back.",
      choices:[D_("[Let him go.]",null,{now:()=>roadEnd('follow')})]},
    t_use:{speaker:'—',port:null,text:"Daniel looks at you for a long time. Then he gets back in his car and drives south, back to the motel, back to his styrofoam cup.\n\nThe road watches you leave. You can feel it learning the shape of your faces.",
      choices:[D_("[Go.]",null,{now:()=>roadEnd('use')})]},
  }},
});
SECTORS.street.entities.push(char_('daniel',10.6,27.4,{kind:'npc',dialogue:'daniel',name:'Daniel Rusk',h:1.8,face:0,hidden:true,roadNpc:true}),
  {kind:'prop',car:'parked_white',x:8.2,y:27.6,r:.75,h:1.45,face:Math.PI,hidden:true,roadNpc:true,use:'r9_car',useName:'Daniel’s car'});
USES.r9_car=()=>{ S.flags.r9_car=true; openMenu('Daniel’s car',"Odometer: 214 miles since the last fill-up. Tank nearly dry. Honest, both of them.\n\nThe tyres have Oakhaven grit in the treads and nothing else: no red Elkton clay, no coast salt. The floor mat on the passenger side is grey with mill dust, and damp.\n\nThe registration sticker in the corner of the windshield says 1994.",[{text:'Step back'}]); };
defDest({id:'backroad',name:'the back road to St. Brendan’s',sector:'street',x:50.4,y:22.5,a:0,avail:()=>S.act>=4&&!!S.flags.road_used,note:()=>'Route 9 remembers you'});
function roadEnd(k){ decide('road',k); const F=S.flags;
  if(k==='break'){ F.road_loop_broken=true; sfx('riteEnd'); }
  if(k==='follow'){ F.daniel_escaped=true; }
  if(k==='use'){ F.road_used=true; S.dread=Math.min(1,(S.dread||0)+.15); }
  for(const e of SECTORS.route9.entities) if(e.dialogue==='daniel_toll') e.dead=true;
  for(const e of SECTORS.street.entities) if(e.roadNpc&&k!=='use') e.dead=true;
  later(2,()=>closeCase('road'));
}
/* the road learns: in Act III a mile marker turns up on Main Street */
INV_UPDATES.push(dt=>{ const F=S.flags; if(!F.road_used||S.act<3||F.r9_ghostmarker) return; F.r9_ghostmarker=true;
  SECTORS.street.entities.push({kind:'prop',m:'marker',x:22.8,y:21,r:.12,h:1.2,use:'r9_ghost',useName:'Mile marker 14'},{kind:'prop',m:'bouquet',x:22.7,y:21.4,r:.05,h:.4,z:.3}); });
USES.r9_ghost=()=>openMenu('Mile marker 14','MILE 14. On Main Street, where there is no mile 14. The bouquet is fresh.\n\nThe card says: FOR DEAN AND SAM. I’M SORRY I WAS DRIVING.',[{text:'Step back'}]);
{ const was=hubMenu; hubMenu=function(car){ if(S.sector.id==='route9'&&!caseClosed('road')){
    openMenu('The Impala','Route 9 runs north into the fog. The engine is warm.',[{text:'Drive Route 9 again',act:driveLoop},{text:'Drive back to Main Street',act:()=>driveTo('street')},{text:'Talk it over with '+(isDean()?'Sam':'Dean'),act:impalaTalk},{text:'Leave it'}]); return; }
  was(car); }; }
INV_UPDATES.push(dt=>{ const F=S.flags; if(F.road_lead||S.act!==2||!F.delia_done||S.cut) return;
  if(!F.road_nudge){ F.road_nudge=S.time; return; }
  if(S.time-F.road_nudge>30){ F.road_lead=true; for(const e of SECTORS.street.entities) if(e.roadNpc) e.hidden=false;
    msg('marla','a man just drove into my lot like the devil was behind him. daniel rusk. he says he got out. he got out and came back. i gave him coffee'); } });
defCase({ id:'road', n:35, kicker:'Act II · Case 5 (optional)', title:'The Road That Returns', open:()=>!!S.flags.road_lead,
  summary:()=>caseClosed('road')?'The road returns anyone carrying something unresolved the town can use.':'Daniel Rusk drove two hundred miles out of Oakhaven and pulled into the Oak Rest Motel. He won’t drive again.',
  clues:{
    daniel:{t:'Daniel Rusk',k:'talk',x:'Six hours, three towns, two county lines, gas in Elkton. Then this motel.',have:F_('met_daniel')},
    car:{t:'Daniel’s car',k:'place',x:'214 honest miles. Oakhaven grit only. Mill dust on the mat. Registration: 1994.',have:F_('r9_car')},
    sign:{t:'Pine Hollow Motor Court',k:'talk',x:'To Daniel the motel sign reads like the town where his brother died.',have:F_('r9_sign')},
    markers:{t:'The mile markers',k:'place',x:'12, 13, 14, then 14 again, then down: 9, 3, 1.',have:()=>!!S.flags.r9_14&&(S.flags.r9_markers||0)>=3},
    bouquet:{t:'For Tommy',k:'place',x:'Carnations at the second mile 14. “I’m sorry I was driving.”',have:F_('r9_bouquet')},
    drawing:{t:'Two boys in a brown car',k:'doc',x:'A child’s drawing at mile 9. The smaller boy is waving.',have:F_('r9_drawing')},
    tag:{t:'Asset 77-14',k:'record',x:'A mill flatbed, scrapped in 1979, four years before the road was paved.',have:F_('r9_tag')},
    footprints:{t:'Mile 1',k:'place',x:'Work boots into the fog. None coming back.',have:F_('r9_footprints')},
    loop:{t:'The loop',k:'place',x:'Walk north into the fog and you’re back at the Impala, facing north.',have:()=>(S.flags.r9_loops||0)>=1},
    passenger:{t:'The passenger',k:'talk',x:()=>`${S.flags.r9_passenger||'Someone'} in the passenger seat, asking you to stop.`,have:F_('r9_passenger')},
    ledger:{t:'The toll ledger',k:'doc',x:'Sixty years of entries. No exit times. “A person may leave. A consequence cannot.”',have:F_('read_tollledger')},
  },
  links:[
    {id:'returned',a:'car',b:'daniel',t:'Real miles, no road',x:'Daniel really drove two hundred miles. The world just brought him back. The distance is real; the destination isn’t.',dean:'He went somewhere. Just not out.',sam:'Space isn’t closed. It’s folded.'},
    {id:'dressed',a:'sign',b:'car',t:'Dressed in his past',x:'The loop puts on Daniel’s childhood: 1994 on the sticker, Pine Hollow on the sign. It uses what he brought.',dean:'It’s wearing his life like a costume.',sam:'It returns him to the thing he’s carrying.'},
    {id:'tommy',a:'bouquet',b:'drawing',t:'His brother',x:'Two boys in a brown car. Tommy, the smaller one, died at mile 14 with Daniel driving. The road keeps his grief at the marker.',dean:'He was seventeen. Seventeen-year-olds shouldn’t drive anybody.',sam:'He’s been carrying that for thirty years.'},
    {id:'rule',a:'markers',b:'loop',t:'The road counts down',x:'Past the second fourteen the markers count down, toward the start, and the fog sends you back. The road has a rule; it can be learned.',dean:'It’s a treadmill with numbers.',sam:'If it has a rule, it has an exit.',opens:'the toll station'},
    {id:'consequence',a:'ledger',b:'passenger',t:'A consequence cannot',x:'The road doesn’t judge. It returns anyone carrying something unresolved it can use: grief, guilt, attachment.',dean:'So it’s not a wall. It’s a customs desk.',sam:'It isn’t punishing them. It’s harvesting them.'},
    {id:'anchor',a:'tag',b:'ledger',t:'Asset 77-14',x:'The scrapped flatbed’s tag is older than the road itself. The anchor for the loop is a piece of the mill.',dean:'Everything comes back to the mill.',sam:'Break the anchor, break the loop.'},
  ],
  theory:{q:'Why can’t Daniel leave?',reward:25,
    opts:[{id:'fog',t:'Nobody can leave. The fog is a wall.'},{id:'carry',t:'The road returns anyone carrying something unresolved that it can use.',ok:true},{id:'dead',t:'Daniel died out there and doesn’t know it.'}],
    right:'A person may leave. A consequence cannot. The road isn’t a wall; it’s a rule.',wrong:'Daniel is alive. The road just wouldn’t let him take his brother out of town.'},
  talk:()=>[[brother(),isDean()?'Sam reckons it’s folding space. I reckon it’s a haunting with a map.':'You think it’s a haunting. I think the road itself is folding.'],[S.hero,isDean()?'Could be both. Usually is.':'We’re both half right. That’s usually how it goes.']],
  autopsy:()=>{ const d=caseDecision('road');
    return { what:['Route 9 kept returning Daniel Rusk to Oakhaven. You walked it, and drove it, and something sat in the passenger seat.',
        d==='break'?'You broke the anchor at the toll station. Daniel drove north and didn’t come back.':d==='follow'?'Daniel faced mile 14 and drove out, unsure which parts of his memory were his.':'You kept the road. It knows you now.'],
      cause:['The fog isn’t only a boundary. Its roads return anyone carrying something unresolved the town can use.','The loop is anchored on a piece of the mill older than the road itself.'],
      open:['Every other road out is still fog.',d==='use'?'The road has learned your faces.':'Daniel is out. The town isn’t.','The ledger has your plates in it.'],
      dean:d==='use'?'We needed a way through. I’d do it again. I don’t love that I would.':'He got out. Somebody should.',
      sam:d==='follow'?'He had to look at it. That’s the only way through anything.':'The fog isn’t keeping us in. It’s keeping what we carry.' }; },
  paper:()=>{ const d=caseDecision('road');
    return { head:d==='use'?'ROUTE 9 “STILL CLOSED,” SAYS SHERIFF':'MAN DRIVES OUT OF OAKHAVEN',deck:d==='use'?'Motorists report mile markers on Main Street.':'Daniel Rusk, 47, believed to be the only resident to leave the fog.',
      by:'C. S.', body:[d==='use'?'Sheriff Ames reminds residents that every road out of town returns to Main Street. Several residents have reported a mile marker on the cross street. There is no mile 14 in Oakhaven.':'Daniel Rusk, a visitor staying at the Oak Rest Motel, drove north on Route 9 late Saturday and did not return. Marla Ostrowski said he left a styrofoam cup on the hood of his car, rinsed out.',
        'A toll booth on Route 9 that does not appear on any county map was reported by two visitors. The Ledger has been unable to locate it.','The Ledger’s copy of the county road atlas has a page missing between mile 14 and mile 14.'] }; },
  forum:()=>[{u:'marla_nightdesk',t:'He rinsed the cup. Nobody rinses the cup.'},{u:'tyler_k',t:'ok so how did HE get out'},{u:'drusk94',t:caseDecision('road')==='use'?'':'I’m in Coos Bay. It’s raining. It’s just rain.'},{u:'0114',t:'tommy says its ok'}],
});
