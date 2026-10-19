/* ═══ Case 1 · The Green Chain, and Case 2 · The Last Shift ══════════════════
   The mill is the first full loop. The haunting is real and it is not the
   point: the point is a fan that was deferred seven times. The Last Shift
   asks the uglier question underneath it: who knew, and who signed anyway. */

/* ── new things to look at ─────────────────────────────────────────────── */
Object.assign(SPR,{
  fan: art(30,30,A=>{ const m=[70,72,74], d=[30,30,32];
    A.rect(0,0,29,29,C(dk(m,.8))); A.rect(2,2,27,27,C(d)); A.disc(15,15,11,C([44,42,40]));
    for(let a=0;a<4;a++){ const t=a*Math.PI/2+.3; A.line(15,15,15+Math.cos(t)*10,15+Math.sin(t)*10,C([98,94,86])); A.line(15,15,15+Math.cos(t+.25)*9,15+Math.sin(t+.25)*9,C([98,94,86])); }
    A.disc(15,15,2,C([120,116,108]));
    for(let i=0;i<60;i++) A.set(3+Math.random()*24,3+Math.random()*24,C([150,146,130]));   // the dust
    for(let y=4;y<27;y+=3) A.line(2,y,27,y,C(dk(m,.6)));
    A.rect(8,26,22,29,C([200,190,150])); A.line(9,27,21,27,C([60,40,30])); A.shade(.1); A.outline(rgb(6,6,6)); }),
  clipboard: art(14,18,A=>{ A.rect(0,1,13,17,C([120,86,50])); A.rect(1,3,12,16,C([226,222,206])); A.rect(4,0,9,2,C([150,150,150]));
    for(let y=5;y<15;y+=2) A.line(2,y,11,y,C([120,120,140])); A.rect(7,8,11,9,C([170,40,40])); A.outline(rgb(10,8,6)); }),
  body: art(48,14,A=>{ const o=[226,118,34], j=[52,64,96], s=SKIN.old;
    A.rect(4,6,20,11,C(j)); A.rect(20,4,38,12,C(o)); A.rect(24,4,26,12,C([238,238,222]));
    A.ell(42,8,4,4,C(s)); A.ell(43,6,4,2,C([230,230,226])); A.rect(0,8,4,11,C([40,30,24]));
    for(let i=0;i<30;i++) A.set(20+Math.random()*26,3+Math.random()*10,C([160,156,140]));
    A.shade(.15); A.outline(rgb(6,6,6)); }),
  panel: art(20,28,A=>{ A.rect(0,0,19,27,C([84,90,80])); A.rect(2,2,17,25,C([60,66,60]));
    A.rect(4,4,15,9,C([20,22,20])); A.set(6,6,glow(255,80,40)); A.set(9,6,glow(120,255,120));
    A.rect(5,13,8,22,C([30,30,30])); A.rect(5,13,8,16,C([200,40,40])); A.rect(11,13,14,22,C([30,30,30])); A.rect(11,19,14,22,C([230,200,60]));
    A.shade(.12); A.outline(rgb(6,6,6)); }),
  clock: art(16,16,A=>{ A.disc(8,8,7.5,C([40,36,32])); A.disc(8,8,6,C([226,220,200]));
    A.line(8,8,8,3,C([20,20,20])); A.line(8,8,5,10,C([20,20,20])); A.set(8,8,C([160,20,20])); A.outline(rgb(6,6,6)); }),
  plank: art(28,6,A=>{ A.rect(0,0,27,5,C([96,70,44])); A.line(0,2,27,2,C([70,50,30])); A.rect(23,0,27,5,C([60,44,28])); A.outline(rgb(10,8,6)); }),
  cabinet: art(18,34,A=>{ const g=[90,96,100]; A.rect(0,0,17,33,C(g));
    for(const y of [2,13,24]){ A.rect(2,y,15,y+8,C(dk(g,.85))); A.rect(7,y+3,10,y+4,C([180,180,170])); } A.shade(.15); A.outline(rgb(6,6,6)); }),
  tv: art(30,24,A=>{ A.rect(0,0,29,19,C([50,40,32])); A.rect(3,2,24,17,C([10,12,14]));
    for(let y=3;y<17;y++) for(let x=4;x<24;x++) if(Math.random()<.6) A.set(x,y,glow(120+Math.random()*80|0,140+Math.random()*80|0,170+Math.random()*60|0));
    A.disc(27,6,1.4,C([150,140,120])); A.disc(27,11,1.4,C([150,140,120])); A.rect(10,20,19,23,C([40,32,26])); A.outline(rgb(6,6,6)); }),
});
function sfxChain(){ try{ if(!AU.ctx||!S.settings.sound) return;
  for(let i=0;i<7;i++) nb({dur:.09,freq:1400+Math.random()*900,type:'bandpass',q:5,gain:.25,delay:i*.14}); tn({f:46,to:40,dur:1.3,gain:.3,type:'sawtooth'}); }catch(e){} }
function sfxCough(){ try{ if(!AU.ctx||!S.settings.sound) return; for(let i=0;i<3;i++) nb({dur:.16,freq:700,to:300,gain:.3,delay:i*.28}); }catch(e){} }

/* ── the mill, furnished for investigation ─────────────────────────────── */
{ const m=SECTORS.mill;
  m.entities.push(
    {kind:'prop',m:'fan',x:14.5,y:1.32,r:.12,h:.9,z:1.5,use:'fan',useName:'Fan fourteen'},
    {kind:'prop',m:'paper',x:4.5,y:1.3,r:.2,h:.5,z:.95,read:'roster',readName:'A shift roster pinned to the wall'},
    {kind:'prop',m:'clipboard',x:22.5,y:5.3,r:.2,h:.42,z:.95,read:'inspect',readName:'An air-quality sheet on a clipboard'});
  /* the maintenance room door in the west wall */
  m.grid[18][0]='+'; m.doors['0,18']={to:'maint',x:5.6,y:3.5,a:Math.PI,need:'dwyer_found',
    locked:'MAINTENANCE — AUTHORISED ONLY. The handle won’t turn. It feels rusted from the other side.'};
  m.pois.push({x:.5,y:18.5,name:'Maintenance room',kind:'door'});
  pack(m);
}
Object.assign(READS,{
  roster:"NIGHT SHIFT — LINE THREE (GREEN CHAIN)\n\nR. HOLLIS (lead)\nL. BRANDT\nE. OKAFOR\nT. OKAFOR\nP. LINDQVIST\nM. HADDAD\n\nSupervisor: F. DWYER\n\nSomebody has drawn a small cross next to every name but one. The one without a cross is the supervisor’s.",
  inspect:()=>"AIR QUALITY — MONTHLY INSPECTION\nLine three. Particulate: _____   Extraction: _____\n\nRESULT:  SAFE\nInspector: F. Dwyer\n\nThe word SAFE has been written over something else. Tilted to the light, the indent of the first entry is still in the paper: deferred pending capital review."+(S.flags.read_ledger14?"\n\nThe same words as the purple stamp in Ray’s requisition book.":""),
});
function useFan(){
  S.flags.used_fan=true;
  const t=isDean()
    ?"You get your fingers in the grille and pull. The housing screams, and a cake of grey dust the size of a dinner plate falls out and doesn’t break when it hits the floor.\n\nThe blades haven’t turned in a long time. There’s a dead bird in the duct behind them, and behind the bird, more dust.\n\nA plate on the housing: EXTRACTION #14 · RATED FOR 4 OPERATORS · INSTALLED 1979."
    :"The plate on the housing says EXTRACTION #14 · RATED FOR 4 OPERATORS · INSTALLED 1979. Line three ran six.\n\nThe blades are seized solid. The filter behind them isn’t a filter any more; it’s a grey felt so packed you can write in it with a fingertip. Somebody has. It says 14.";
  openMenu('Fan fourteen',t,[{text:'Step back'}]);
}
USES.fan=useFan;

/* ── the maintenance room ──────────────────────────────────────────────── */
{ const s=room('maint','Mill — maintenance room',8,7,'=',.10,'c'); s.ceilH=1.3;
  s.grid[3][7]='+'; s.doors['7,3']={to:'mill',x:1.5,y:18.5,a:0};
  s.spawn={x:5.6,y:3.5,a:Math.PI};
  s.lights=[{x:4,y:3,p:.9,f:.45}];
  s.pois=[{x:7.5,y:3.5,name:'Back to the floor',kind:'door'}];
  s.entities=[
    {kind:'prop',m:'body',x:3.2,y:3.6,r:.4,h:.3,use:'dw_body',useName:'Frank Dwyer'},
    {kind:'prop',m:'panel',x:2.5,y:1.3,r:.12,h:.85,z:.5,use:'dw_vent',useName:'The ventilation control'},
    {kind:'prop',m:'clock',x:5.5,y:1.3,r:.1,h:.35,z:1.0,use:'dw_clock',useName:'A wall clock'},
    {kind:'prop',m:'plank',x:1.6,y:5.3,r:.3,h:.1,use:'dw_board',useName:'The floorboards'},
    {kind:'prop',m:'cabinet',x:6.5,y:5.6,r:.35,h:1.2,use:'dw_cabinet',useName:'A filing cabinet'},
    {kind:'prop',m:'clipboard',x:6.7,y:2.4,r:.12,h:.25,z:.8,use:'dw_lock',useName:'The lock, from the inside'},
  ];
  addSector(s);
}
const DW={resetT:22};
USES.dw_body=()=>{ S.flags.dw_body=true;
  openMenu('Frank Dwyer',(isDean()
    ?"Supervisor’s white hard hat, still on. No wounds. No blood. His lips are grey and so are his teeth.\n\nYou press on his chest and something inside it creaks, like a bag of flour. When you take your hand away there’s a perfect grey handprint on his shirt.\n\nHe’s been dead about a day. The mill’s been shut for eight months."
    :"No wounds. No defensive marks. Lips and nail beds grey, not blue. When you open his mouth a little dust sifts out of it.\n\nThis isn’t a man who choked on a bad night’s air. His lungs are packed, the way you’d expect after years. It happened to him in one night.\n\nHe’s been dead about a day. The mill’s been shut for eight months.")
    ,[{text:'Step back'}]); };
USES.dw_vent=e=>{ S.flags.dw_vent=true;
  if(e.on){ openMenu('Ventilation control','The switch is ON. Somewhere above you, in the dark, a fan you can’t hear is turning.',[{text:'Leave it'}]); return; }
  openMenu('Ventilation control',"Line three extraction. The red switch is OFF, and someone has wired it there: a twist of copper through the guard so it can’t be thrown back by accident.\n\nThe wire is new. Everything else in the room is eight months old.",
    [{text:'Pull the wire and throw the switch',act:()=>{ e.on=true; sfx('switch'); say(S.hero,isDean()?'There. Breathe, Frank.':'Okay. It’s on.',2.4); }},{text:'Leave it'}]); };
USES.dw_clock=()=>{ S.flags.dw_clock=true; openMenu('A wall clock',"Twenty to three. The second hand is twitching against the minute, trying to get past it.\n\nYour watch says twenty to three as well. It has for a while.",[{text:'Step back'}]); };
USES.dw_board=e=>{
  if(S.flags.dw_notebook){ openMenu('The floorboards','The loose board, put back. You have the notebook.',[{text:'Step back'}]); return; }
  S.flags.dw_notebook=true; sfx('pickup');
  openMenu('Under the floorboards',(isDean()?"One board rocks when you step on it. You get the knife under it.":"One board is a different colour from the others, newer, cut short. You lift it.")
    +"\n\nA pocket notebook in a sandwich bag. Dates, readings, initials. The last entry, in pencil, pressed so hard it tore the page:\n\n“I signed the inspection because they told me the air was clean. I signed the second one because I knew it wasn’t. I’m going to stop the line tonight. I’m going to stop it at 2:26 and tell them all to go home.”",
    [{text:'Take it'}]); };
USES.dw_cabinet=()=>{ S.flags.dw_original=true;
  openMenu('A filing cabinet',"The bottom drawer is the only one with anything in it: the carbon copy of an inspection report.\n\nOn the carbon, the original entry is still there under the correction: Extraction FAILED. Particulate: off scale. RECOMMEND HALT LINE 3.\n\nAcross it, in a different pen: Deferred pending capital review. — per C.H. (Delaware)",[{text:'Take the carbon'}]); };
USES.dw_lock=()=>{ S.flags.dw_lock=true;
  openMenu('The lock',"The bolt is thrown from the inside and rusted solid into the keep, flaking orange, the way metal goes after a decade of damp. The door was opened from outside an hour ago; the dust on the far side of the threshold doesn’t show a single footprint.\n\nThe room was locked from the inside, by someone who has been dead for a day, with a lock that has been rusting for years.",[{text:'Step back'}]); };
/* the room puts itself back */
function updateMaint(dt){
  if(S.sector.id!=='maint') { DW.resetT=Math.min(DW.resetT,22); return; }
  DW.resetT-=dt;
  if(DW.resetT<=0){ DW.resetT=20+Math.random()*6; sfxChain(); S.shake=Math.max(S.shake,.25);
    for(const e of S.sector.entities) if(e.use==='dw_vent') e.on=false;
    spawnParts(4,3.5,1.2,30,{c:[150,146,130],grav:.4},{up:.2,life:2,spd:.5});
    if(!S.flags.dw_reset){ S.flags.dw_reset=true;
      later(.8,()=>say('narr','The green chain runs, somewhere through the wall, for exactly four seconds. Then the room puts itself back. The switch is OFF again. The dust on Frank Dwyer is exactly where it was.',6));
      later(7,()=>say(brother(),isDean()?'Sam— the room just reset. Like a save point.':'Dean, did you see that? Everything went back.',3.4)); }
  }
}

/* ── three witnesses, three true things ────────────────────────────────── */
Object.assign(LOOKS,{
  dwyer:   {skin:[214,176,150], hair:{style:'short',col:[170,170,166]}, eyes:{col:[90,90,96]}, stubble:true, beard:[150,146,140],
            top:{kind:'jacket',col:[60,70,86],underCol:[226,226,220],open:true,tie:[90,30,30]}, legs:{kind:'slacks',col:[56,56,60]}, shoes:[30,26,24],
            hat:{kind:'hardhat',col:[232,232,226]}},
  mara:    {skin:[200,156,124], hair:{style:'buzz',col:[38,30,26]}, eyes:{col:[60,70,60]}, lip:[150,96,90],
            top:{kind:'flannel',col:[56,82,110],col2:[20,22,30]}, legs:{kind:'cargo',col:[70,66,56]}, shoes:[50,40,30], extras:['lanyard']},
  peter:   {skin:[222,184,156], hair:{style:'messy',col:[160,120,70]}, eyes:{col:[90,110,130]},
            top:{kind:'overalls',col:[60,80,120],underCol:[150,150,140]}, legs:{kind:'overalls'}, shoes:[60,44,30], gloves:[150,120,70]},
  leon:    {skin:[120,84,64], hair:{style:'bald',col:[200,200,196]}, beard:[210,210,206], eyes:{col:[60,50,40]},
            top:{kind:'uniform',col:[40,46,70],tie:[20,20,24]}, legs:{kind:'slacks',col:[34,36,46]}, shoes:[18,18,18], hat:{kind:'peaked',col:[34,38,56]}, extras:['badge']},
});
SPEAKERS.mara={name:'Mara Voss',col:'#9fc0e0'}; SPEAKERS.peter={name:'Peter Shaw',col:'#d8c08a'}; SPEAKERS.leon={name:'Leon Bell',col:'#b8b0d8'};
SPEAKERS.dwyer={name:'Frank Dwyer',col:'#e0e0d0'};
const witness=(look,x,y,dlg,name,o={})=>char_(look,x,y,Object.assign({kind:'npc',dialogue:dlg,name,h:1.8,witness:true},o));
SECTORS.street.entities.push(witness('mara',18.4,28.6,'mara','Mara Voss',{face:Math.PI/2,hidden:true}),
                             witness('leon',44.2,29.4,'leon','Leon Bell',{face:0,hidden:true}));
SECTORS.pawn.entities.push(witness('peter',11.5,5.2,'peter','Peter Shaw',{face:Math.PI,hidden:true}));
PEOPLE.push({flag:'w_mara',look:'mara',name:'Mara Voss',line:'Machine operator, line two. Thinks Frank was murdered.'},
            {flag:'w_peter',look:'peter',name:'Peter Shaw',line:'Maintenance tech. Got paid after the shutdown.'},
            {flag:'w_leon',look:'leon',name:'Leon Bell',line:'Night watchman. Saw someone walk up a wall.'});
Object.assign(DIALOGUE,{
  mara:{ port:'mara', start:()=>S.flags.w_mara?'m9':'m0', nodes:{
    m0:{speaker:'Mara Voss — line two',text:"She’s smoking under the motel sign with the hood of her flannel up, though it isn’t raining here.\n\n\"You’re the feds about Frank. Good. Write this down. Frank Dwyer didn’t trespass into his own maintenance room and lie down and die. Somebody put him there.\"",
      choices:[D_("Who’d want him dead?",'m1'),D_("[Dean] You seem pretty sure, lady.",'m1',null,isDean),D_("[Sam] Take your time. Start with Frank.",'m1',null,isSam)]},
    m1:{speaker:'Mara Voss — line two',text:"\"He was scared. Last month, before the bodies started, he came in the bar with a carrier bag and wouldn’t let go of it. Papers. He said, ‘Mara, if I have an accident, it wasn’t one.’ Then he laughed, like it was a joke, and it wasn’t.\n\nHe was collecting evidence against them. Against Delaware. That’s what got him killed.\"",
      choices:[D_("What was in the bag?",'m2'),D_("Did Frank sign off on the air inspections?",'m3')]},
    m2:{speaker:'Mara Voss — line two',text:"\"I didn’t look. That’s the kind of coward I am.\" She grinds the cigarette out on the motel sign. \"Six men. You know how many I went to school with? Four.\"",
      choices:[D_("[Thank her.]",null,{flag:'w_mara'})]},
    m3:{speaker:'Mara Voss — line two',text:"A long pause.\n\n\"Everybody signed something. That’s how it works. You sign the thing so you get to keep coming back to the thing.\" She doesn’t look at you. \"He was going to make it right. That’s what the bag was.\"",
      choices:[D_("[Thank her.]",null,{flag:'w_mara'})]},
    m9:{speaker:'Mara Voss',text:"\"Find who put him there.\"",choices:[D_("[Leave.]",null)]},
  }},
  peter:{ port:'peter', start:()=>S.flags.w_peter?'p9':'p0', nodes:{
    p0:{speaker:'Peter Shaw — maintenance',text:"He’s at Earl’s counter with a box of good tools he’s pretending he doesn’t mind selling.\n\n\"Frank? Frank did it himself. I keep telling people. The vent on three had a manual cut-out, and only two people knew where it was, and one of them was Frank.\" He doesn’t say who the other one was.",
      choices:[D_("[Sam] Who was the other one, Peter?",'p1s',null,isSam),D_("[Dean] Nice tools. Who paid for them?",'p1d',null,isDean),D_("Why would he switch off his own vent?",'p2')]},
    p1s:{speaker:'Peter Shaw — maintenance',text:"He looks at the tools for a long time.\n\n\"Me. I wired it off. In March. They said the fan was scheduled for replacement and running it dry would burn the motor out, and the replacement would come in a week.\" He swallows. \"It was a week for seven months. And after the shutdown somebody put two thousand dollars in my account from a bank in Delaware. I didn’t ask what for. I knew what for.\"",
      choices:[D_("You didn’t kill those men, Peter. Somebody made sure the paperwork did.",'p3',{flag:'peter_told',align:['h',1]})]},
    p1d:{speaker:'Peter Shaw — maintenance',text:"\"Excuse me?\"\n\nYou put one hand flat on the box. He tries to pull it away and can’t.\n\n\"Okay! Okay. They paid me. Two thousand, after the shutdown, from Delaware. For pulling the breaker logs on line three. For wiring the cut-out.\" His voice cracks. \"It was supposed to be a week.\"",
      choices:[D_("[Let go of the box.]",'p3',{flag:'peter_told',now:()=>{ S.flags.peter_scared=true; }})]},
    p2:{speaker:'Peter Shaw — maintenance',text:"\"Because he was told to. Because we all were.\" He picks up a socket wrench and puts it down again. \"I’ve said enough.\"",
      choices:[D_("[Leave him to it.]",null,{flag:'w_peter'})]},
    p3:{speaker:'Peter Shaw — maintenance',text:"\"I go past the mill every night on the way home. I don’t look. I don’t look at it.\"",
      choices:[D_("[Leave him to it.]",null,{flag:'w_peter'})]},
    p9:{speaker:'Peter Shaw',text:()=>S.flags.peter_scared?"He won’t look at you.":"\"Did you go in? Is it— is the vent still off?\"",choices:[D_("[Leave.]",null)]},
  }},
  leon:{ port:'leon', start:()=>S.flags.w_leon?'l9':'l0', nodes:{
    l0:{speaker:'Leon Bell — night watchman',text:"An old man in a security uniform two sizes too big, standing outside the mill door with a torch he doesn’t switch on.\n\n\"Thirty-one years on nights. They let me go with the rest, but I still come and stand here. Habit.\" He nods at the door. \"I’ll tell you what I told the sheriff, and he can laugh again.\"",
      choices:[D_("Nobody’s laughing.",'l1')]},
    l1:{speaker:'Leon Bell — night watchman',text:"\"Night after they found Frank, I saw him. On the catwalk over line three. White hat. Walking.\n\nOnly the catwalk runs left to right, and he was walking up. Up the wall, like the wall was the floor. Like it was the end of a shift and he was going home, and home was the ceiling.\"",
      choices:[D_("What time?",'l2'),D_("[Dean] Leon, how much have you had tonight?",'l2b',null,isDean)]},
    l2:{speaker:'Leon Bell — night watchman',text:"\"Twenty to three. Same time as every one of them. I know because I clock my rounds.\" He taps his watch. \"It’s been twenty to three for a while now.\"",
      choices:[D_("[Thank him.]",null,{flag:'w_leon'})]},
    l2b:{speaker:'Leon Bell — night watchman',text:"\"Not a drop in thirty-one years, son. Somebody had to be awake.\"\n\nHe taps his watch. Twenty to three.",
      choices:[D_("[Thank him.]",null,{flag:'w_leon'})]},
    l9:{speaker:'Leon Bell',text:"\"I’ll be here. Somebody has to be.\"",choices:[D_("[Leave.]",null)]},
  }},
});

/* ── the last shift: the mill replays its final night ──────────────────── */
const SHIFT={on:false,step:0,ghosts:[]};
function shiftReady(){ const n=(S.inv.links.shift||[]).length;
  return S.act<=2&&!caseClosed('shift')&&haveLink('shift','replay')&&haveLink('shift','complicit')&&n>=3&&(S.flags.phantom)&&
    !SECTORS.mill.entities.some(e=>e.kind==='enemy'&&e.etype==='ghost'&&!e.dead&&!e.dwyerGhost); }
function startShift(){
  if(SHIFT.on) return; SHIFT.on=true; SHIFT.step=0; S.flags.shift_seen=true;
  const m=SECTORS.mill, ghost=(look,x,y,o={})=>Object.assign(char_(look,x,y,{kind:'actor',trans:true,hover:false,lit:.8,shiftGhost:true,h:1.85,bx:x,by:y,face:-Math.PI/2}),o);
  SHIFT.ghosts=[ghost('phantom',9.5,10.6,{lead:true}),ghost('worker',11.5,10.6),ghost('worker',13.5,16.4),ghost('worker',15.5,16.4),ghost('worker',17.5,10.6),ghost('worker',19.5,16.4),
    ghost('dwyer',23.4,9.4,{face:0,dw:true})];
  m.entities.push(...SHIFT.ghosts,
    {kind:'prop',m:'panel',x:25.6,y:8.6,r:.25,h:.9,z:.3,use:'sh_vent',useName:'Line three extraction',shiftCtl:true},
    {kind:'prop',m:'panel',x:25.6,y:10.6,r:.25,h:.9,z:.3,use:'sh_alarm',useName:'The shift alarm',shiftCtl:true},
    {kind:'prop',m:'panel',x:13.4,y:20.2,r:.25,h:.9,z:.3,use:'sh_exit',useName:'Emergency exit release',shiftCtl:true});
  sfxChain(); S.shake=.4;
  say('narr','The green chain starts. Nobody touched it. Six men in hard hats come out of the dark between the lines and take their places, coughing, and a man in a white hat stands at the control panel and does nothing.',7,{now:true});
  later(7.4,()=>say(brother(),isDean()?'It’s the last night. It’s replaying. Sam— the panel. The switch, the alarm, the door. Something in that order.':'It’s the night it happened. We can’t stop it, but maybe we can finish it. Vent, alarm, exit.',5));
}
function shiftUse(which){
  const order=['vent','alarm','exit'];
  if(order[SHIFT.step]===which){ SHIFT.step++; sfx('switch');
    const L={vent:'Somewhere above line three, for the first time in eight months, a fan turns over.',alarm:'The shift alarm goes, a long cracked bray, and six heads come up at once.',exit:'The emergency door bangs open on the street, and cold air comes in.'};
    say('narr',L[which],4,{now:true});
    if(SHIFT.step===3) later(4.4,shiftReveal);
  } else { sfxChain(); sfxCough(); hurtPlayer(6); SHIFT.step=0; S.shake=.5;
    say('narr','The line stutters and starts again from the top. Somebody coughs until they can’t. The switch is off. The alarm is silent. The door is shut.',5,{now:true}); }
}
USES.sh_vent=()=>shiftUse('vent'); USES.sh_alarm=()=>shiftUse('alarm'); USES.sh_exit=()=>shiftUse('exit');
function shiftReveal(){
  S.flags.shift_revealed=true;
  const dw=SHIFT.ghosts.find(g=>g.dw);
  say('narr','For one second the mill shows you what really happened: the man in the white hat reaching for the alarm at 2:26, and his hand stopping a foot short, and staying there. Then he moves. Fourteen minutes too late. Twenty to three.',7,{now:true});
  later(7.2,()=>say('dwyer','I WAS GOING TO. I WAS GOING TO STOP IT. YOU DON’T KNOW WHAT IT COSTS TO STOP IT.',4));
  later(11.4,()=>{ if(dw){ dw.dead=true; }
    const g=char_('dwyer',23.4,9.4,{kind:'enemy',etype:'ghost',hp:110,maxHp:110,speed:1.35,dmg:10,reach:1,sense:12,trans:true,hover:true,state:'hunt',h:1.9,dwyerGhost:true,name:'Frank Dwyer'});
    SECTORS.mill.entities.push(g); sfx('ghost'); toast('Salt and iron scatter what he’s become'); });
}
function shiftDecision(){
  openMenu('The last shift',"Frank Dwyer is gone, or as gone as anything here gets. The six men are standing in a row by the open door, waiting to be told they can go home.\n\nThe records are in your hands: the notebook, the inspection sheet, the carbon"+(S.flags.dw_original?' with the original reading still on it':'')+". The panel is where the room keeps its memory.",
    [{text:'Lay them to rest at the panel. Get the records out before the mill comes down.',note:'ritual · the mill collapses',act:()=>shiftEnd('rest')},
     {text:'Keep the records. Tell the sheriff what the notebook proves.',note:'Frank’s part comes out',act:()=>shiftEnd('expose')},
     {text:'Burn the records here. End it now.',note:'the anchor burns with them',act:()=>shiftEnd('burn')}]);
}
function shiftEnd(k){
  decide('shift',k); const m=SECTORS.mill;
  const clear=()=>{ m.entities=m.entities.filter(e=>!e.shiftGhost&&!e.shiftCtl); SHIFT.on=false; };
  if(k==='rest'){ sfx('rite'); later(1,()=>sfx('riteEnd'));
    say(S.hero,isDean()?'Shift’s over, guys. Go home.':'You can stop now. All of you. Go home.',3,{now:true});
    later(3.2,()=>{ for(const g of SHIFT.ghosts) spawnParts(g.x,g.y,1,18,PCOL.ecto,{up:1.6}); clear();
      S.collapse={t:32}; toast('The mill is coming down — get out'); say('narr','Something in the roof lets go. Then something else does.',3); }); }
  if(k==='expose'){ S.flags.mill_records_saved=true; S.flags.dwyer_exposed=true; clear();
    say(brother(),isDean()?'He signed it, Sam. He knew. People should know he knew.':'It isn’t fair to him. It’s true, though. Somebody should read it out loud.',4,{now:true});
    later(4.2,()=>{ say('narr','The six men watch you go. They don’t follow. They don’t rest either.',4); closeCase('shift'); }); }
  if(k==='burn'){ S.flags.mill_records_burned=true; sfx('flare');
    spawnParts(25.4,9.6,1,40,PCOL.flame,{up:2}); clear();
    say('narr','The notebook goes first, then the carbon. The green chain stops mid-link. The mill is just a building again, and you have no proof of how any of it began.',6,{now:true});
    later(6.2,()=>closeCase('shift')); }
}
function updateShift(dt){
  if(SHIFT.on){ const t=S.time;
    for(const g of SHIFT.ghosts){ if(g.dead) continue; g.x=g.bx+Math.sin(t*1.3+g.bx)*.25; g.animT=(g.animT||0)+dt; if(Math.random()<dt*.3) sfxCough(); } }
  if(S.sector.id==='mill'&&!SHIFT.on&&shiftReady()&&!S.flags.shift_revealed) startShift();
  if(S.flags.shift_revealed&&!caseDecision('shift')&&!S.flags.shift_asked&&S.sector.id==='mill'){
    const g=SECTORS.mill.entities.find(e=>e.dwyerGhost); if(g&&g.dead){ S.flags.shift_asked=true; later(1.4,shiftDecision); } }
  if(S.collapse){ S.collapse.t-=dt; S.shake=Math.max(S.shake,.18+.3*(1-S.collapse.t/32));
    if(Math.random()<dt*14&&S.sector.id==='mill') spawnParts(S.px+(Math.random()-.5)*8,S.py+(Math.random()-.5)*8,2.2,3,{c:[120,116,104],grav:-5},{up:.1});
    if(Math.random()<dt*1.2) sfx('land');
    if(S.sector.id!=='mill'){ S.flags.mill_records_saved=true; S.collapse=null; sfx('thunder'); S.shake=.7;
      say('narr','Behind you the mill roof folds in on line three with a sound like a held breath let go. You have the records.',5,{now:true}); later(5,()=>closeCase('shift')); }
    else if(S.collapse.t<=0){ S.collapse=null; hurtPlayer(30); S.flags.records_lost=true;
      enterSector('street',45.5,29.9,-Math.PI/2); sfx('thunder');
      say('narr','You come to in the street, coughing grey. The records didn’t make it out. The six men did.',5,{now:true}); later(5,()=>closeCase('shift')); } }
}

/* ── when the shift case opens ─────────────────────────────────────────── */
function updateMillCase(dt){
  const F=S.flags;
  /* after the tear, the town finds Frank */
  if(F.phantom&&!F.dwyer_found&&S.sector.id!=='mill'&&!S.cut){ F.dwyer_found=true;
    later(2,()=>msg('marla','sheriff’s car is at the mill. they found frank dwyer in the maintenance room. he was line three’s supervisor'));
    later(9,()=>msg('marla','mara voss is outside my office telling anyone who’ll listen it was murder. leon bell is standing at the mill door again. peter shaw is selling his tools at earl’s'));
    for(const e of [...SECTORS.street.entities,...SECTORS.pawn.entities]) if(e.witness) e.hidden=false; }
  if(S.act>=3) for(const e of [...SECTORS.street.entities,...SECTORS.pawn.entities]) if(e.witness) e.hidden=true;
}

/* ── the motel, after the mill: the television ─────────────────────────── */
SECTORS.motel.entities.push({kind:'prop',m:'tv',x:16.6,y:1.4,r:.3,h:.75,z:.6,emit:.5,use:'motel_tv',useName:'The television'});
USES.motel_tv=()=>{ if(S.flags.phantom&&!S.flags.tv_scene) return tvScene();
  say('caller',S.flags.tv_scene?'…attributed to negligence. Then we’re not leaving. Fine. We weren’t going to anyway. Negligence. Then we’re—':'…overnight lows near freezing, and fog in the low-lying areas. Stay with KOAK for…',4,{now:true,name:'KOAK-TV'}); };
function tvScene(){
  S.flags.tv_scene=true; const D=isDean();
  const L=[['caller','…the county coroner says the most recent death at the former Oakhaven Mill has been attributed to negligence. A spokesman for the property’s owners said repairs had been deferred pending capital review.','KOAK-TV'],
    ['marla','They say that every time. Like it’s weather.'],
    ['dean',D?'Negligence. That’s the word for when nobody gets fired.':'Negligence. That’s the word for when nobody gets fired.'],
    ['sam','Dean. “Deferred pending capital review.” That’s the exact phrase on the inspection sheet. Word for word. Somebody wrote the press release from the paperwork.'],
    ['caller','In other news. Then we’re not leaving. Fine. We weren’t going to anyway.','KOAK-TV'],
    ['marla','…What did he just say?'],
    ['narr','The anchor smiles at the camera and goes on to the weather. Nobody in the room has said that sentence. Yet.']];
  L.forEach(([w,t,n],i)=>say(w,t,null,{now:i===0,name:n}));
  addNoteRaw('tv','The television','The KOAK anchor used the inspection sheet’s exact words. Then he said a sentence nobody in the room had said yet: “Then we’re not leaving. Fine. We weren’t going to anyway.”');
}
{ const was=startLockdown; startLockdown=function(){ was(); if(S.flags.tv_scene) later(16.5,()=>say('sam','Dean. That’s what the television said. Word for word. Before you said it.',4)); }; }

/* ── the phantom can be talked down, if you know the number ────────────── */
{ const P=DIALOGUE.phantom.nodes;
  P.p0.choices.unshift(D_("Ray Hollis. Fan fourteen. Seven requests — I read every one.",'p3',null,()=>deduced('neglect')));
  P.p3={speaker:'Ray Hollis',
    text:"He stops. The oil on him goes still.\n\n\"SEVEN,\" he says, and something in the word sounds like a man setting down a heavy box. \"SOMEBODY READ THEM.\"\n\nFor a second there’s a face under the sawdust: tired, forty-four, a man who folded important forms carefully so they wouldn’t get dusty. Out in the dark between the chain lines, one of the shapes that was waiting for him goes out like a match.",
    choices:[D_("It was approved, Ray. You can stop filing it.",null,{flag:'phantom',align:['h',1],now:()=>{ S.flags.ray_named=true; S.flags.ray_heard=true; },cutscene:'tear'})]};
  const ws=wakeShades; wakeShades=function(){ if(S.flags.ray_heard){ const sh=SECTORS.mill.entities.find(e=>e.kind==='enemy'&&e.state==='dormant'); if(sh) sh.dead=true; } ws(); };
}
/* Crossroads can be cornered with its own stamp */
{ const C=DIALOGUE.crowley.nodes;
  C.c0.choices.unshift(D_("Seven deferrals on fan fourteen, stamped CAPEX REVIEW. Your stamp.",'c1b',null,()=>deduced('buyer')));
  C.c1b={speaker:'Crowley',
    text:()=>"For the first time, he looks at you instead of through you.\n\n\"You read the requisitions. Nobody reads the requisitions.\" He straightens his cuffs, which do not need straightening. \"Fine. Yes. Every one went across my desk. I deferred them because the buyer’s terms said maintain no capital improvement, and the buyer’s terms are rather insistent.\""
      +(S.flags.mill_records_saved?"\n\nHe sees the carbon in your pocket and goes very still. \"And you kept the paper. Do you know how rare that is? Everyone burns the paper.\"":"")
      +"\n\nHe takes a fold of banknotes out of his coat and sets it on the Impala’s hood. \"Hush money. I know you won’t hush. Consider it a gesture of respect.\"",
    choices:[D_("[Take it.] Who’s the buyer?",'c2',{cash:80,flag:'crowley_cornered'}),D_("[Leave it.] Who’s the buyer?",'c2',{flag:'crowley_cornered',align:['h',1]})]};
  /* his first honest answer */
  C.c2.choices.push(D_("Who authorised it? Whose name is on the contract?",'c_name'));
  C.c_name={speaker:'Crowley',
    text:()=>"A long pause, which for Crowley is a kind of confession.\n\n\"Authorised signatory on the original instrument: one C. Shurley. No title. No address. Signature in green ink.\" He frowns at his own memory. \"I’ve read ten thousand contracts, darling. Every one has a termination clause. That’s the whole craft. This one doesn’t. It just keeps going.\""
      +(S.flags.bell_seal?"\n\nThen you show him the parish transfer from the reservoir, and the seal on it. His seal. Dated eleven years before he bought the seal.\n\nHe doesn’t say anything for long enough that the rain notices.":"")
      +"\n\n\"I am a subcontractor,\" he says, quietly, as though it’s the worst word he knows. \"In my own town.\"",
    choices:[D_("So you want our help.",'c3',{flag:'crowley_named'})]};
}
/* Sarah, if you know the crew */
{ const N=DIALOGUE.sarah.nodes;
  N.s0.choices.push(D_("Pete was on line three, nights. All six were.",'s_crew',null,()=>deduced('crew')));
  N.s9.choices.unshift(D_("Pete was on line three, nights. All six were.",'s_crew',null,()=>deduced('crew')&&!S.flags.sarah_crew));
  N.s_crew={speaker:'Sarah Lindqvist — librarian',
    text:"The stamp stops halfway down.\n\n\"All six? Same shift?\" She puts the stamp in a drawer and shuts the drawer. \"Then it’s not a curse. It’s a list. Somebody picked the shift that would cost the least to bury.\"\n\nShe takes a ring of keys off a hook. \"The archive room’s mine. The county plans, the parish books, the old property transfers. Anything you need from them, you ask me.\"",
    choices:[D_("[Thank her.]",null,{flag:'sarah_crew',now:()=>{ S.flags.sarah_met=true; }})]};
}

/* ═══ the cases ═══════════════════════════════════════════════════════════ */
const F_=k=>()=>!!S.flags[k], N_=k=>()=>S.notes.some(n=>n.id===k), PH_=s=>()=>bestPhoto(s)?bestPhoto(s).thumb:null;
defCase({ id:'mill', n:10, kicker:'Act I · Case 1', title:'The Green Chain', open:()=>true,
  summary:()=>caseClosed('mill')?'Six men from one shift, and a fan that was deferred seven times.':'Six former mill workers dead in five weeks. Something on line three that won’t lie down.',
  clues:{
    arrive:{t:'Six dead in five weeks',k:'note',x:'All former mill workers, all in the same week of the month.',have:N_('arrive')},
    marla:{t:'Crossroads Holdings',k:'talk',x:'Bought the mill profitable, ran it into the ground in eleven months. Delaware.',who:'Marla Ostrowski',have:F_('marla')},
    roster:{t:'Line three, night shift',k:'doc',x:'Hollis, Brandt, Okafor, Okafor, Lindqvist, Haddad. Supervisor: F. Dwyer. Crosses by every name but his.',have:F_('read_roster')},
    ledger14:{t:'Fan fourteen requisitions',k:'doc',x:'Seven requests, March to September. Every one DEFERRED — CAPEX REVIEW. The last just says PLEASE.',have:F_('read_ledger14')},
    fan:{t:'Fan fourteen',k:'place',x:'Rated for four operators. Line three ran six. Seized solid; the filter is felt.',have:F_('used_fan')},
    ray:{t:'“The vent was on the form”',k:'talk',x:'The shape on the green chain, reciting a requisition.',who:'Ray Hollis, after',have:F_('ray_named')},
    term:{t:'The mill terminal',k:'doc',x:'Admin c.shurley. Harvest yield this cycle: six units.',have:F_('term')},
    inspect:{t:'Air quality: SAFE',k:'doc',x:'Signed F. Dwyer. Written over: deferred pending capital review.',have:F_('read_inspect')},
    echo_ray:{t:'Ray Hollis, photographed',k:'photo',x:'Line three, 1:52 a.m. Folding the form into his shirt pocket.',have:F_('echo_ray'),img:PH_('echo:ray')},
  },
  links:[
    {id:'neglect',a:'ledger14',b:'fan',t:'Deferred to death',x:'Fan fourteen was asked for seven times and deferred seven times. Line three breathed that air for seven months. The deaths came after.',
      dean:'Nobody had to kill anybody. They just had to keep saying “next quarter.”',sam:'It’s not a haunting that killed them. It’s a budget line.',opens:'something true to say to the shape on the green chain'},
    {id:'crew',a:'arrive',b:'roster',t:'All six from one shift',x:'Every one of the dead worked line three, nights, under fan fourteen. The only name on the roster still alive was the supervisor’s.',
      dean:'Six for six. That’s not luck, that’s a seating chart.',sam:'It’s a list. Somebody picked the shift that would cost the least to lose.',opens:'something to tell Sarah about her brother'},
    {id:'buyer',a:'ledger14',b:'marla',t:'The purple stamp',x:'The deferrals were stamped by the owner. The owner is Crossroads Holdings.',
      dean:'Same company bought it, starved it and buried it. Efficient.',sam:'If we ever meet Crossroads, we have its handwriting.',opens:'a way to corner Crossroads'},
    {id:'harvest',a:'term',b:'arrive',t:'Six units',x:'The terminal’s harvest yield matches the dead exactly. Something is counting them like a crop.',
      dean:'Units. They called them units.',sam:'Someone is farming this town. The terminal is the ledger.'},
    {id:'voice',a:'ray',b:'ledger14',t:'He’s still filing it',x:'Ray died mid-request. The thing on the green chain isn’t angry; it’s finishing paperwork.',
      dean:'Poor guy’s still trying to get the form in.',sam:'Ghosts repeat what they couldn’t finish. His was a requisition.'},
    {id:'lie',a:'inspect',b:'fan',t:'SAFE, in a dead fan’s air',x:'The supervisor signed SAFE on air a seized fan never moved. Someone wrote the lie on top of the truth.',
      dean:'Dwyer knew.',sam:'The supervisor signed it. That’s a second story under the first one.',opens:'The Last Shift'},
  ],
  theory:{q:'What killed the six men of line three?',reward:30,
    opts:[{id:'ghost',t:'The ghost on the green chain. It’s killing its old crew.'},
          {id:'fan',t:'Fan fourteen: the air they were made to breathe, and the people who deferred the fix.',ok:true},
          {id:'deal',t:'A demon deal. Somebody sold the whole shift.'}],
    right:'It was the air. The haunting came after, and it was a man still trying to file the form that would have saved them.',
    wrong:'The ghost didn’t kill anyone. Ray Hollis was still trying to get a fan approved. The dust had already done the killing.'},
  talk:()=>{ const D=isDean();
    if(!deduced('neglect')) return [[S.hero,D?'Something on line three’s got a grudge. I want to know why before I salt it.':'I want to see the paperwork before we burn anything. Mills keep paper.'],[brother(),D?'Office. There was a book on the desk.':'Check the office. And the walls. Somebody always pins up a roster.']];
    return [[brother(),D?'So it’s the fan. A ghost is the least of what happened in there.':'It’s the fan, Dean. The ghost is just what’s left of somebody asking for help.'],[S.hero,D?'Yeah. And somebody signed off on all of it.':'And somebody signed off on all of it.']]; },
  autopsy:()=>{ const F=S.flags, T=theoryRight('mill');
    return {
      what:[F.ray_heard?'Ray Hollis’s ghost was talked down by name. He let go, and one of the shades went with him.':'Ray Hollis’s ghost was put down with iron. He started to say thank you.',
            'When he let go, the air tore and something drank what was left of him. The shades in the dark woke and were scattered.'],
      cause:[deduced('neglect')?'Fan fourteen was deferred seven times. Six men breathed what it didn’t move.':'You never put the requisitions and the fan together. The mill did.',
             deduced('buyer')?'The stamp on the deferrals belongs to Crossroads Holdings.':'Somebody owned the stamp. You didn’t find out who.',
             deduced('lie')?'The supervisor signed SAFE on top of the truth.':''].filter(Boolean),
      open:['A terminal that counts people as units, logged in as c.shurley.',deduced('harvest')?'Six units. Something is harvesting Oakhaven.':'Something ate Ray Hollis when he let go. You don’t know what.',
            S.flags.dwyer_found&&!caseClosed('shift')?'Frank Dwyer is dead in a locked room, and the room is still replaying.':''].filter(Boolean),
      dean:T?'Nobody gets arrested for a spreadsheet. Somebody should.':'I wanted it to be the ghost. Ghosts you can shoot.',
      sam:T?'We got it right and it doesn’t help them. It helps whoever’s next.':'We were wrong about what killed them. We can’t be wrong about who.' }; },
  paper:()=>{ const T=theoryRight('mill'), F=S.flags;
    return { head:T?'FAN 14: SIX DEATHS TIED TO DEFERRED MILL REPAIR':'MILL “HAUNTING” BLAMED FOR SIXTH DEATH',
      deck:T?'Requisitions show line three asked seven times for ventilation. Owners stamped every one “deferred.”':'Residents speak of a figure on the old green chain. Coroner rules accident.',
      by:'Ledger staff', photo:['echo:ray','ray_ghost'], cap:'Line three, 1:52 a.m. Photo submitted by a reader. The Ledger was unable to identify the man in the photograph.',
      body:[T?'Seven times between March and September, line lead Ray Hollis requested replacement of ventilation fan fourteen. Seven times the request was stamped DEFERRED — CAPEX REVIEW by the mill’s owner, Crossroads Holdings of Wilmington, Delaware.':'Former workers at the shuttered Oakhaven Mill say they have seen a man in a hard hat on the old green chain after dark. Sheriff Ames called the reports “grief, mostly.”',
        T?'All six men who died this autumn worked the same shift beneath the same fan. Federal agents visiting the town declined to comment, except to say that “nobody had to kill anybody.”':'The county coroner has ruled each of the six deaths accidental. A spokesman for the owners said the company “regrets any distress.”',
        F.dwyer_found?'The body of line supervisor Frank Dwyer, 58, was found Saturday in a mill maintenance room locked from the inside. Mr. Dwyer had no visible injuries.':'',
        'Crossroads Holdings did not respond to a request for comment. Its registered office is a mailbox.',
        'The Ledger regrets that it could not reach the Hollis family. The Hollis house on Larch Street has been dark since the spring.'].filter(Boolean),
    }; },
  forum:()=>{ const T=theoryRight('mill'), F=S.flags;
    return [{u:'marla_nightdesk',t:T?'Seven times. Ray came in for coffee every night that spring and never said a word about it.':'It wasn’t a ghost. Ray never hurt anyone in his life.'},
      {u:'gus_in_the_woods',t:'My father worked line three. They didn’t have a fan at all in 1962. Call it progress.'},
      {u:'sarah.l',t:F.sarah_crew?'All six. Same shift. Somebody tell me again it’s bad luck.':'Read the ledgers. They’re at the library. Nobody has asked for them.'},
      {u:'tyler_k',t:'lol so the mill is haunted AND poisoned? oakhaven going for the high score'},
      {u:'0114',t:'he folded the form so it wouldn’t get dusty'}]; },
});
{ const was=startLockdown; startLockdown=function(){ was(); later(17,()=>closeCase('mill')); }; }
OBJECTIVES.find(o=>o.id==='car').onDone=()=>startLockdown();

defCase({ id:'shift', n:15, kicker:'Act I · Case 2', title:'The Last Shift', open:()=>!!(S.flags.dwyer_found||S.flags.read_inspect),
  summary:()=>caseClosed('shift')?'Who knew the mill was killing people, and who decided that was an acceptable cost.':'Frank Dwyer, line supervisor, dead in a maintenance room locked from the inside. Lungs full of dust. The mill has been shut for months.',
  clues:{
    inspect:{t:'Air quality: SAFE',k:'doc',x:'Signed F. Dwyer, written over the real reading.',have:F_('read_inspect')},
    body:{t:'Frank Dwyer',k:'place',x:'No wounds. Lungs packed as if after years. It happened in one night.',have:F_('dw_body')},
    vent:{t:'The vent, wired off',k:'place',x:'Manually disabled with new copper wire. Everything else is eight months old.',have:F_('dw_vent')},
    lock:{t:'Locked from inside',k:'place',x:'Bolt rusted solid into the keep. No footprints in the dust outside.',have:F_('dw_lock')},
    clock:{t:'Twenty to three',k:'place',x:'The clock is stopped at 2:40. So is your watch.',have:F_('dw_clock')},
    reset:{t:'The room puts itself back',k:'sound',x:'Every few minutes the chain runs and the room resets: switch off, dust in place.',have:F_('dw_reset')},
    notebook:{t:'Dwyer’s notebook',k:'doc',x:'“I signed the second one because I knew it wasn’t. I’m going to stop the line at 2:26.”',have:F_('dw_notebook')},
    original:{t:'The carbon copy',k:'doc',x:'Original reading: FAILED. RECOMMEND HALT LINE 3. Overwritten “per C.H. (Delaware)”.',have:F_('dw_original')},
    mara:{t:'Mara: “It wasn’t an accident”',k:'talk',x:'Frank was collecting evidence against management in a carrier bag.',who:'Mara Voss',have:F_('w_mara')},
    peter:{t:'Peter: “Frank did it himself”',k:'talk',x:()=>S.flags.peter_told?'Peter wired the cut-out himself in March, on orders, and was paid from Delaware.':'Only two people knew where the cut-out was.',who:'Peter Shaw',have:F_('w_peter')},
    leon:{t:'Leon: the man on the wall',k:'talk',x:'A white hat on the catwalk, walking up the wall, at twenty to three.',who:'Leon Bell',have:F_('w_leon')},
    ledger14:{t:'Fan fourteen requisitions',k:'doc',x:'DEFERRED — CAPEX REVIEW, seven times.',have:F_('read_ledger14')},
  },
  links:[
    {id:'complicit',a:'notebook',b:'inspect',t:'He signed it knowing',x:'The supervisor signed the first inspection believing it and the second knowing it was false.',dean:'He wasn’t the bad guy. He was the guy who let the bad guy use his pen.',sam:'He didn’t kill them. He let the paper say they were safe.'},
    {id:'replay',a:'lock',b:'reset',t:'The room is a replay',x:'Nobody locked Frank in. The room is being rebuilt, over and over, from the moment he died. The rust is real because the room is old; the death is new because it keeps happening.',dean:'It’s a loop. Like a skipping record.',sam:'It’s not a locked room. It’s a memory with walls.',opens:'the mill can replay its last shift'},
    {id:'overwrite',a:'original',b:'ledger14',t:'Same words, same desk',x:'The carbon’s correction and Ray’s requisitions say the same thing in the same purple: deferred pending capital review, per C.H.',dean:'It’s a form letter. They killed six guys with a form letter.',sam:'The language is the mechanism. Delay every warning until it doesn’t matter.'},
    {id:'evidence',a:'mara',b:'notebook',t:'The carrier bag',x:'Mara was right about one thing: Frank was collecting evidence. The notebook under the floor is what was in the bag.',dean:'She said it wasn’t an accident. She just had the wrong killer.',sam:'Mara has the truth about what Frank was doing. Not about what happened.'},
    {id:'breaker',a:'peter',b:'vent',t:'Who wired the switch',x:'Peter was right about one thing: the vent was disabled on purpose. He did it in March. The new wire on it now is the room putting March back.',dean:'Two grand from Delaware. That’s the price of a shift.',sam:'Peter carried out an order he was paid to forget.'},
    {id:'walker',a:'leon',b:'reset',t:'Going home up the wall',x:'Leon was right about one thing: he saw Frank. He saw the replay, from outside.',dean:'Thirty-one years on nights and he’s the only one who saw anything.',sam:'The catwalk walk is the end of a loop. Frank’s trying to leave his own shift.'},
    {id:'tooLate',a:'clock',b:'notebook',t:'Fourteen minutes',x:'He meant to stop the line at 2:26. The clock stopped at 2:40. Whatever happened, it happened in the fourteen minutes between.',dean:'He was gonna do it. He just didn’t.',sam:'He tried. Too late counts for something. It just doesn’t count for them.'},
  ],
  theory:{q:'What is the mill replaying?',reward:30,
    opts:[{id:'murder',t:'A murder. Someone from Delaware locked Frank in and switched off his air.'},
          {id:'cover',t:'Frank switching the vent off himself, to cover his tracks.'},
          {id:'late',t:'The last shift: Frank knew, signed anyway, and tried to stop the line too late.',ok:true}],
    right:'Every witness had one true piece. Frank knew. Frank signed. Frank tried, at 2:40, which was fourteen minutes too late.',
    wrong:'The room wasn’t a crime scene. It was a man’s last fourteen minutes, kept on a loop because nobody had finished them.'},
  talk:()=>[[brother(),isDean()?'Three witnesses, three stories. They can’t all be lying.':'Every one of them had a piece of it, Dean. Nobody had the whole thing.'],[S.hero,isDean()?'Yeah. Nobody ever does.':'And the room keeps putting itself back. Like it’s waiting for someone to get the order right.']],
  autopsy:()=>{ const d=caseDecision('shift'), F=S.flags;
    return {
      what:['The mill replayed its last night: switch off, alarm silent, exit shut. You put them in the right order.','Frank Dwyer’s ghost turned on you at the control panel. You scattered him.',
        d==='rest'?'You laid the six to rest at the panel, and the mill came down behind you.':d==='expose'?'You kept the records and left the six standing by the door.':d==='burn'?'You burned the records and the green chain stopped.':'You walked away from it.'],
      cause:['Frank Dwyer signed SAFE on air a seized fan never moved, first believing it and then knowing better.',F.peter_told?'Peter Shaw wired the cut-out on orders and was paid from Delaware.':'Somebody wired the cut-out on orders.',
        'Every warning was deferred until it no longer mattered. Nobody had to order a death. They only had to make sure every warning was late.'],
      open:[F.mill_records_saved?'The records survived. Somebody, someday, can prove how it began.':F.mill_records_burned?'The records are ash. You know what happened. You can’t prove it.':'The records didn’t make it out.',
        F.dwyer_exposed?'Frank’s part will come out. Mara will have to hear it.':'Mara still thinks it was murder.','“Per C.H. (Delaware).” Initials, not a name.'],
      dean:d==='burn'?'It’s over. That has to count for something.':'Frank was a coward for seven months and brave for fourteen minutes. That’s more than most.',
      sam:d==='expose'?'The truth doesn’t make anyone better off. It makes them able to stop it happening again.':'We gave them an ending. I’m not sure we gave anyone an answer.' }; },
  paper:()=>{ const d=caseDecision('shift'), F=S.flags;
    return { head:d==='expose'?'SUPERVISOR’S NOTEBOOK: “I KNEW IT WASN’T”':d==='rest'?'OLD MILL ROOF COLLAPSES; NO ONE HURT':'MILL SUPERVISOR’S DEATH RULED ACCIDENTAL',
      deck:d==='expose'?'Sheriff receives inspection records signed by the late Frank Dwyer. Carbon shows original reading: FAILED.':d==='rest'?'Neighbours report the sound of a shift alarm moments before the roof gave way.':'No evidence of foul play, sheriff says.',
      by:'C. S.',
      body:[d==='expose'?'Inspection records handed to Sheriff Ames late Saturday show that line supervisor Frank Dwyer certified line three’s air as safe in at least two consecutive months, while a carbon copy shows the original reading as “FAILED — RECOMMEND HALT.” A notebook found with the records contains the line: “I signed the second one because I knew it wasn’t.”'
          :d==='rest'?'The roof over line three of the former Oakhaven Mill fell in early Sunday. Leon Bell, a former night watchman who was outside at the time, said he heard the shift alarm go, “a long one, like the end of a night,” and then the roof.':'The death of Frank Dwyer, 58, has been ruled accidental. Sheriff Ames said Mr. Dwyer appeared to have been trespassing.',
        F.mara_told?'':'Mara Voss, a former operator on line two, said she would “keep saying it until somebody listens.”',
        F.peter_told?'Peter Shaw, a maintenance technician, has asked the Ledger to print the following: “It was supposed to be a week.”':'',
        'The Ledger notes that the inspection forms in question use the phrase “deferred pending capital review.” The Ledger has used it too, in this article, twice. It is a very easy phrase to write.'].filter(Boolean)}; },
  forum:()=>{ const d=caseDecision('shift');
    return [{u:'mara_v',t:d==='expose'?'He signed it. Frank signed it. I sat with him at the bar and he signed it.':'I’ll keep saying it.'},
      {u:'leon_rounds',t:'Twenty to three. Always twenty to three.'},
      {u:'p.shaw',t:'it was supposed to be a week'},
      {u:'earl_buys_gold',t:'Buying tools. Good tools. No questions.'}]; },
});

/* per-frame */
function updateInvestigations(dt){
  updateMaint(dt); updateShift(dt); updateMillCase(dt);
  for(const f of INV_UPDATES) try{ f(dt); }catch(e){ console.error(e); }
}
const INV_UPDATES=[];
