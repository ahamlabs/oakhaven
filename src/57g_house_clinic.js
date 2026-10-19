/* ═══ Case 7 · The House With One More Room, and Case 8 · The Patient Who
   Died Tomorrow ═════════════════════════════════════════════════════════════
   A house that grows a room to keep a memory in, and a clinic whose records
   describe deaths before they happen. Neither case gets a clean answer. */

Object.assign(SPR,{
  musicbox: art(16,12,A=>{ A.rect(0,3,15,11,C([120,70,50])); A.rect(1,4,14,10,C([150,90,64])); A.rect(0,0,15,3,C([100,56,40]));
    A.rect(6,5,9,8,C([200,180,120])); A.set(7,6,C([60,40,30])); A.shade(.2); A.outline(rgb(10,6,4)); }),
  wardrobe: art(26,48,A=>{ const w=[90,62,40]; A.rect(0,0,25,47,C(w)); A.rect(2,3,12,44,C(dk(w,1.1))); A.rect(13,3,23,44,C(dk(w,1.1)));
    A.line(12.5,3,12.5,44,C(dk(w,.6))); A.rect(10,22,11,26,C([200,180,120])); A.rect(14,22,15,26,C([200,180,120])); A.rect(0,44,25,47,C(dk(w,.7))); A.shade(.2); A.outline(rgb(8,6,4)); }),
  coatchair: art(20,34,A=>{ const w=[96,70,44]; A.rect(2,16,17,19,C(w)); A.rect(2,0,4,33,C(dk(w,.8))); A.rect(15,19,17,33,C(dk(w,.8))); A.rect(2,19,4,33,C(dk(w,.8)));
    A.rect(3,2,13,20,C([150,40,40])); A.rect(4,3,12,6,C([170,60,50])); A.shade(.2); A.outline(rgb(8,6,4)); }),
  cot: art(36,18,A=>{ const w=[200,196,186]; A.rect(0,2,35,13,C([230,226,216])); for(let x=0;x<36;x+=4) A.rect(x,0,x+1,17,C(w)); A.rect(0,14,35,15,C(w)); A.shade(.15); A.outline(rgb(10,10,10)); }),
  frame: art(14,16,A=>{ A.rect(0,0,13,15,C([140,110,60])); A.rect(2,2,11,13,C([150,140,120])); A.ell(5,7,2,3,C([90,80,70])); A.ell(8,9,1.4,2,C([110,96,84])); A.outline(rgb(10,8,6)); }),
  door: art(20,44,A=>{ A.rect(0,0,19,43,C([110,96,80])); A.rect(2,2,17,43,C([150,130,100])); A.rect(4,5,15,18,C(dk([150,130,100],.85))); A.rect(4,23,15,40,C(dk([150,130,100],.85))); A.disc(15,24,1.4,C([200,180,100])); A.outline(rgb(8,6,4)); }),
  monitor: art(22,26,A=>{ A.rect(0,0,21,17,C([60,64,66])); A.rect(2,2,19,15,C([6,10,8])); A.line(3,9,6,9,glow(80,255,120)); A.line(6,9,8,4,glow(80,255,120)); A.line(8,4,10,13,glow(80,255,120)); A.line(10,13,12,9,glow(80,255,120)); A.line(12,9,18,9,glow(80,255,120));
    A.rect(9,18,12,25,C([50,50,52])); A.rect(4,24,17,25,C([50,50,52])); A.outline(rgb(6,6,6)); }),
  sedanClock: art(10,6,A=>{ A.rect(0,0,9,5,C([20,20,20])); A.set(2,2,glow(255,80,60)); A.set(4,2,glow(255,80,60)); A.set(6,2,glow(255,80,60)); }),
});
Object.assign(LOOKS,{
  agnes:  {skin:[226,196,176], hair:{style:'bun',col:[226,224,220]}, eyes:{col:[110,120,140]}, lip:[170,120,120],
           top:{kind:'cardigan',col:[110,130,110],underCol:[230,226,214]}, legs:{kind:'skirt',col:[80,70,90]}, shoes:[60,50,50]},
  ghost_boy:{skin:[196,214,226], hair:{style:'short',col:[70,60,50]}, eyes:{kind:'black'}, lip:[150,160,180],
           top:{kind:'nightgown',col:[170,190,214],long:47}, legs:{kind:'slacks',col:[170,190,214]}, shoes:[180,200,214], tint:[140,170,210], tintAmt:.25, emissive:true, outline:[20,40,60]},
  june:   {skin:[214,176,150], hair:{style:'curly',col:[200,198,196]}, eyes:{}, lip:[160,100,100], top:{kind:'cardigan',col:[180,150,80],underCol:[220,210,200]}, legs:{kind:'slacks',col:[90,80,70]}, shoes:[60,50,40]},
  hal:    {skin:[196,150,116], hair:{style:'bald',col:[180,176,170]}, beard:[180,176,170], eyes:{}, top:{kind:'flannel',col:[40,80,60],col2:[20,30,24]}, legs:{kind:'jeans',col:[50,56,70]}, shoes:[50,40,30], hat:{kind:'cap',col:[130,30,30]}},
  rosa:   {skin:[170,122,88], hair:{style:'long',col:[30,22,18]}, eyes:{}, lip:[140,70,70], top:{kind:'raincoat',col:[60,60,90],long:41}, legs:{kind:'jeans',col:[40,40,50]}, shoes:[30,28,28]},
  martin: {skin:[202,156,118], hair:{style:'short',col:[60,44,30]}, stubble:true, beard:[70,52,40], eyes:{col:[90,70,50]},
           top:{kind:'vest',col:[110,80,40],underCol:[150,120,70],stripe:[200,170,90]}, legs:{kind:'cargo',col:[90,74,50]}, shoes:[40,30,24], hat:{kind:'cap',col:[110,80,40]}, extras:['bandage']},
});
SPEAKERS.agnes={name:'Agnes Bell',col:'#c8d8c0'}; SPEAKERS.child={name:'',col:'#a8c0e0'}; SPEAKERS.martin={name:'Martin Vale',col:'#d8c098'};
SPEAKERS.june={name:'June Albee',col:'#e0c890'}; SPEAKERS.hal={name:'Hal Pruitt',col:'#a8c8a8'}; SPEAKERS.rosa={name:'Rosa Diaz',col:'#b8b0e0'};

/* ── Larch Street and the Bell house ──────────────────────────────────── */
function larch(){
  const W=28,H=16,g=Grid(W,H,' '); box(g,0,0,W-1,H-1,'S');
  rect(g,1,9,W-2,12,'.'); rect(g,1,8,W-2,8,','); rect(g,1,13,W-2,13,',');
  box(g,10,1,17,7,'W'); g[7][13]='+'; rect(g,11,1,12,1,'G'); rect(g,15,1,16,1,'G');      // Agnes Bell
  box(g,2,2,7,6,'W'); box(g,20,2,25,6,'W'); box(g,20,14,25,14,'W');
  return {id:'larch',name:'Larch Street',grid:g,outdoor:true,ambient:.38,region:'larch',
    spawn:{x:13.5,y:10.6,a:-Math.PI/2},doors:{'13,7':{to:'agnes',x:6.5,y:19.6,a:-Math.PI/2}},
    lights:[{x:13.5,y:8.4,p:1.4,f:.24},{x:5,y:7.4,p:1.2,f:.3},{x:23,y:7.4,p:1.2,f:.3}],
    pois:[{x:13.5,y:7.5,name:'Agnes Bell’s house',kind:'door'},{x:6,y:11,name:'Impala',kind:'car'}],
    entities:[impala_(6,11,0),{kind:'prop',m:'lamp',x:11.2,y:8.3,r:.25,h:3.4,emit:1},
      char_('june',4.6,7.6,{kind:'npc',dialogue:'june',name:'June Albee',h:1.7,face:Math.PI/2}),
      char_('hal',22.6,7.6,{kind:'npc',dialogue:'hal',name:'Hal Pruitt',h:1.8,face:Math.PI/2}),
      char_('rosa',22.6,13.2,{kind:'npc',dialogue:'rosa',name:'Rosa Diaz',h:1.72,face:-Math.PI/2}),
      {kind:'prop',m:'mailbox',x:12,y:8.4,r:.2,h:1.05},{kind:'prop',m:'tree',x:2.6,y:13.6,r:.3,h:4}]};
}
/* the inside changes every time you come back */
function agnesGrid(v){
  const W=14,H=22,g=Grid(W,H,'P');
  rect(g,1,14,12,20,'o');                                 // front room
  const end=v>=3?4:v===2?7:10;
  rect(g,6,end,7,13,'o');                                 // the hall
  rect(g,1,10,4,13,'o'); g[11][5]='o';                    // sitting room
  rect(g,9,10,12,13,'o'); g[11][8]='o';                   // bedroom
  if(v>=3){ rect(g,2,1,11,3,'r'); }                       // the nursery
  g[21][6]='+'; return g;
}
function agnes(){
  const s=room('agnes','The Bell house',14,22,'P',.18); s.ceilH=1.4; s.region='larch';
  s.grid=agnesGrid(1); s.doors={'6,21':{to:'larch',x:13.5,y:8.6,a:Math.PI/2}};
  s.spawn={x:6.5,y:19.6,a:-Math.PI/2};
  s.lights=[{x:6.5,y:17,p:1.4,f:.25},{x:6.5,y:11,p:.7,f:.45},{x:6.5,y:2,p:.6,f:.5}];
  s.pois=[{x:6.5,y:21.5,name:'Out',kind:'door'}];
  s.entities=[char_('agnes',4.4,16.4,{kind:'npc',dialogue:'agnes',name:'Agnes Bell',h:1.66,face:0}),
    {kind:'prop',m:'counter',x:10.6,y:15,r:.45,h:.8},{kind:'prop',m:'paper',x:10.6,y:14.9,r:.15,h:.25,z:.5,use:'ag_letters',useName:'Letters on the hall table'},
    {kind:'prop',m:'bed',x:11,y:11.2,r:.6,h:.5},{kind:'prop',m:'tv',x:2,y:10.6,r:.2,h:.6,z:.3},
    {kind:'prop',m:'cot',x:3.6,y:2,r:.6,h:.7,nursery:true,hidden:true},
    {kind:'prop',m:'musicbox',x:6.2,y:1.6,r:.15,h:.25,z:.55,nursery:true,hidden:true,use:'ag_box',useName:'A music box'},
    {kind:'prop',m:'counter',x:6.2,y:1.6,r:.45,h:.7,nursery:true,hidden:true},
    {kind:'prop',m:'frame',x:2.2,y:1.2,r:.1,h:.4,z:.8,nursery:true,hidden:true,use:'ag_photo',useName:'A framed photograph'},
    {kind:'prop',m:'wardrobe',x:10.4,y:1.6,r:.5,h:1.4,nursery:true,hidden:true,use:'ag_wardrobe',useName:'The wardrobe'},
    {kind:'prop',m:'coatchair',x:8.6,y:2.4,r:.3,h:.9,nursery:true,hidden:true,deanOnly:true},
    char_('ghost_boy',4.8,2.8,{kind:'actor',h:1.2,face:Math.PI/2,lit:.8,trans:true,nursery:true,hidden:true,samOnly:true})];
  return s;
}
[larch(),agnes()].forEach(addSector);
SECTOR_HOOKS.push((id,prev)=>{ if(id!=='agnes'||prev==='agnes') return; const F=S.flags, s=SECTORS.agnes;
  F.agnes_visits=(F.agnes_visits||0)+1; const v=caseDecision('agnes')==='open'||caseDecision('agnes')==='box'?1:Math.min(3,F.agnes_visits);
  s.grid=agnesGrid(v); pack(s);
  for(const e of s.entities) if(e.nursery) e.hidden=!(v>=3)||(e.deanOnly&&!isDean())||(e.samOnly&&!isSam());
  if(v===2&&!F.agnes_hall){ F.agnes_hall=true; later(1.4,()=>say(brother(),isDean()?'Dean. Was the hallway this long?':'Sam. Was this hall this long last time?',3)); }
  if(v===3&&!F.agnes_door){ F.agnes_door=true; later(1.4,()=>say('narr','At the end of the hall, which is longer again, there is a door that was not there. It is open. Somewhere behind it, a music box is trying to play.',5,{now:true})); }
});
INV_UPDATES.push(dt=>{ const F=S.flags;
  if(S.sector.id!=='agnes'||!(F.agnes_door)||F.agnes_nursery) return;
  if(S.py<4){ F.agnes_nursery=true;
    const other=isDean()?'sam':'dean';
    later(.6,()=>say(other,isDean()?'There’s a kid. Dean, there’s a little kid by the bed. You don’t see him?':'There’s a coat on that chair. A kid’s coat. Red. Sam, you don’t see that?',4,{now:true}));
    later(5,()=>say(S.hero,isDean()?'I see a coat. On a chair. That’s all I see.':'I see a boy by the bed. I don’t see a chair.',3.4)); } });
/* the music box stops when you face the door */
let agMusicT=0;
INV_UPDATES.push(dt=>{ if(S.sector.id!=='agnes'||!S.flags.agnes_box_on||caseDecision('agnes')) return;
  const dx=6.5-S.px, dy=5-S.py, l=Math.hypot(dx,dy)||1, facing=(dx/l)*S.dirX+(dy/l)*S.dirY>.82;
  if(facing){ if(!S.flags.agnes_box_door){ S.flags.agnes_box_door=true; say('narr','The music box stops the moment you turn toward the door. When you turn back, it starts again from the same note.',4.5,{now:true}); } return; }
  agMusicT-=dt; if(agMusicT<=0){ agMusicT=1.8; try{ if(AU.ctx&&S.settings.sound){ [659,587,523,587,659,659,659].forEach((f,i)=>tn({f,dur:.22,gain:.06,type:'triangle',delay:i*.24})); } }catch(e){} } });
USES.ag_letters=()=>{ S.flags.ag_letters=true;
  openMenu('Letters on the hall table',isDean()
    ?"Carbon copies, in a shoebox: forty years of letters Agnes has written to her neighbours. You read three before you see the pattern. Each one asks the reader to keep a family secret, and each secret is different.\n\nTo June: ‘please don’t mention the baby to Walt.’ To Hal: ‘please tell people we chose not to.’ To Rosa: ‘please don’t say anything about the boy at the window.’"
    :"Carbon copies, in a shoebox. You notice the dates before you read the words: none of them agree with each other about when anything happened. A boy is born in one letter in 1961 and in another in 1974.",[{text:'Step back'}]); };
USES.ag_box=()=>{ S.flags.agnes_box_on=true; S.flags.ag_note=true;
  openMenu('A music box','No key. The mechanism is broken, and it is playing anyway, a few bars of something Agnes hums in the front room without knowing what it is.\n\nUnder the cylinder, folded small, in an old woman’s handwriting:\n\n“If I remember him, he has to have been real.”',[{text:'Step back'}]); };
USES.ag_photo=()=>{ S.flags.ag_photo=true; openMenu('A framed photograph','Agnes, maybe thirty, on the porch of this house, holding a boy of about four on her hip. He is squinting at the camera. Neither of you recognise him.\n\nThe porch in the photograph has a second storey above it. The house has one.',[{text:'Step back'}]); };
USES.ag_wardrobe=()=>{ const F=S.flags; if(caseDecision('agnes')) return;
  if(!F.ag_voice){ F.ag_voice=true;
    const L=[['child','Don’t open it yet.'],['child','I’m not her son. I know she says I am. She needs to say it.'],
      ['child','She looked after me. Before. When my mum was sick and there wasn’t anyone. And then her own trouble came, and she gave me back, and I was four, and I didn’t understand.'],
      ['child','Maybe that happened. Maybe she only thought about it every day for forty years until there was a room for it. I don’t know. I’m made out of what she remembers.'],
      ['child','You can open it now, if you want.']];
    L.forEach(([w,t],i)=>say(w,t,null,{now:i===0,name:'Behind the wardrobe door'})); return; }
  openMenu('The wardrobe','The voice behind the door is waiting. In the front room, Agnes has stopped humming.',[
    {text:'Open the wardrobe. Let Agnes remember what happened.',note:'she will grieve',act:()=>agnesEnd('open')},
    {text:'Smash the music box. Close the room.',note:'quick; she forgets again',act:()=>agnesEnd('box')},
    {text:'Leave it. Let her keep the room.',note:'she stays calm; the room travels',act:()=>agnesEnd('keep')}]); };
function agnesEnd(k){ decide('agnes',k); const F=S.flags, s=SECTORS.agnes;
  const close=()=>{ s.grid=agnesGrid(1); pack(s); for(const e of s.entities) if(e.nursery) e.hidden=true; if(S.sector.id==='agnes'){ S.px=6.5; S.py=12; S.angle=Math.PI/2; } };
  if(k==='open'){ F.agnes_told_truth=true; sfx('rite'); later(1,()=>sfx('riteEnd'));
    say('narr','There is nobody in the wardrobe. There is a child’s red coat on a hanger, and the smell of somebody else’s house, and from the front room Agnes Bell makes a sound you’ll remember.',6,{now:true});
    later(6.4,()=>{ close(); S.shake=.4; const a=s.entities.find(e=>e.look==='agnes'); if(a) a.dialogue='agnes_after'; closeCase('agnes'); }); }
  if(k==='box'){ F.agnes_box_destroyed=true; sfx('kick'); S.shake=.6;
    say('narr','The music box goes to pieces under your heel. The room folds shut around you like a hand, and you are standing in an ordinary hall, a normal length, in a one-storey house.',5.5,{now:true});
    later(.5,close); later(6,()=>{ const a=s.entities.find(e=>e.look==='agnes'); if(a) a.dialogue='agnes_forgot'; closeCase('agnes'); }); }
  if(k==='keep'){ F.agnes_kept_room=true;
    say('narr','You leave the door as you found it. In the front room Agnes has started humming again. It sounds like the right song, now.',5,{now:true});
    later(5.4,()=>closeCase('agnes')); }
}
/* the kept room turns up in other houses */
SECTORS.motel.entities.push({kind:'prop',m:'door',x:1.3,y:9,r:.1,h:1.6,hidden:true,roomDoor:true,use:'ag_motel',useName:'A door that wasn’t there'});
USES.ag_motel=()=>{ openMenu('A door that wasn’t there','A painted wooden door in the motel wall, with a brass knob. Behind it, faintly, a music box. When you try the knob it is warm.\n\nMarla, without looking up: “That’s been there forever, hon.”',[{text:'Leave it shut'}]);
  for(const e of SECTORS.motel.entities) if(e.roomDoor) e.hidden=true; };
INV_UPDATES.push(dt=>{ const F=S.flags; if(!F.agnes_kept_room||S.act!==2) return;
  if(S.sector.id==='motel'&&!F.ag_motel_door){ F.ag_motel_door=true; for(const e of SECTORS.motel.entities) if(e.roomDoor) e.hidden=false; } });
Object.assign(READS,{
  plans:"COUNTY ARCHIVE — 114 LARCH STREET. Two blueprints, same date (1958), same architect’s signature, filed together.\n\nThe first has a small room at the north end, labelled NURSERY. The second has no nursery, and a staircase that cannot fit inside the building’s outside walls.\n\nBoth carry an inspection stamp from the county office that approved the ventilation on line three of the mill.",
});
SECTORS.library.entities.push({kind:'prop',m:'paper',x:13.6,y:6.2,r:.2,h:.4,z:.6,read:'plans',readName:'Blueprints: 114 Larch Street'});
const NB=(id,name,start)=>({ port:id, start:()=>S.flags['nb_'+id]?'n9':'n0', nodes:start });
Object.assign(DIALOGUE,{
  agnes:{ port:'agnes', start:()=>S.flags.met_agnes?'a9':'a0', nodes:{
    a0:{speaker:'Agnes Bell',text:"She opens the door before you knock. She is eighty, small and neat, with her hair in a bun and her cardigan buttoned wrong by one.\n\n\"Oh, good. Which of you has come to repair the nursery? The latch on the window sticks, and Thomas won’t sleep with it rattling.\"",
      choices:[D_("Mrs. Bell, who’s Thomas?",'a1'),D_("[Dean] Sure. Where’s the nursery?",'a2',null,isDean),D_("[Sam] Can you tell me when you moved in here?",'a3',null,isSam)]},
    a1:{speaker:'Agnes Bell',text:"\"My son.\" A small frown, like someone who has walked into a room and forgotten why. \"My son. Don’t be silly.\" She goes to the hall and looks down it. \"It’s at the end. It’s always at the end.\"",
      choices:[D_("[Leave her to it.]",null,{flag:'met_agnes'})]},
    a2:{speaker:'Agnes Bell',text:"\"At the end of the hall, dear.\" She points. The hall ends in a wall with a calendar on it. \"Mind the step.\" There isn’t a step.",
      choices:[D_("[Leave her to it.]",null,{flag:'met_agnes'})]},
    a3:{speaker:'Agnes Bell',text:"\"1958. Walt carried me over the step.\" A pause. \"Walt passed in— in—\" She smiles at you, very kindly. \"Thomas will be up soon. He always wants his music.\"",
      choices:[D_("[Leave her to it.]",null,{flag:'met_agnes'})]},
    a9:{speaker:'Agnes Bell',text:"\"The nursery’s at the end, dear.\"",choices:[D_("[…]",null)]},
  }},
  agnes_after:{ port:'agnes', start:'x0', nodes:{ x0:{speaker:'Agnes Bell',text:"She is sitting in the front room with the red coat in her lap. She looks a hundred years old and completely awake.\n\n\"His name was Thomas Avery. He was four. I gave him back.\" She smooths the coat. \"I’m going to find out where they buried him. I should have found out forty years ago.\"",
    choices:[D_("[Sit with her.]",null,{align:['h',1]})]} }},
  agnes_forgot:{ port:'agnes', start:'x0', nodes:{ x0:{speaker:'Agnes Bell',text:"\"Oh, hello! Are you here about the guttering?\" She is bright and polite and a little lost. The hall behind her is a normal length. \"I live alone, you know. I always have.\"",
    choices:[D_("[Leave.]",null)]} }},
  june:NB('june','June Albee',{
    n0:{speaker:'June Albee',text:"\"Agnes? Poor thing. She had a little boy, you know. Died before he was one. Crib death. She never talked about it.\"",
      choices:[D_("[Sam] When was that, June?",'n1s',null,isSam),D_("[Dean] She ever write to you about it?",'n1d',null,isDean)]},
    n1s:{speaker:'June Albee',text:"\"Oh, it was—\" She stops. \"It was the year— no. The year after Walt’s accident. Or before.\" She looks frightened, suddenly. \"I can see his little face. Why can’t I see the year?\"",choices:[D_("[Thank her.]",null,{flag:'nb_june',now:()=>{ S.flags.ag_dates=(S.flags.ag_dates||0)+1; }})]},
    n1d:{speaker:'June Albee',text:"\"Every Christmas. ‘Please don’t mention the baby to Walt.’ Walt’s been dead nineteen years and she still writes it.\"",choices:[D_("[Thank her.]",null,{flag:'nb_june',now:()=>{ S.flags.ag_lettersN=(S.flags.ag_lettersN||0)+1; }})]},
    n9:{speaker:'June Albee',text:"\"Poor thing.\"",choices:[D_("[Leave.]",null)]}}),
  hal:NB('hal','Hal Pruitt',{
    n0:{speaker:'Hal Pruitt',text:"\"Kids? Agnes and Walt? No. Never. They chose not to. She told me so herself.\" He spits off the porch. \"Whatever June’s telling you, June likes a story.\"",
      choices:[D_("[Sam] When did she tell you that?",'n1s',null,isSam),D_("[Dean] She told you? Or she wrote you?",'n1d',null,isDean)]},
    n1s:{speaker:'Hal Pruitt',text:"\"Must have been— well, it was before—\" He scowls at nothing. \"Before the thing. You know. I don’t know. It was a while ago.\" He says it like a man who has never in his life been unsure of a date.",choices:[D_("[Thank him.]",null,{flag:'nb_hal',now:()=>{ S.flags.ag_dates=(S.flags.ag_dates||0)+1; }})]},
    n1d:{speaker:'Hal Pruitt',text:"\"…Wrote me. Card in the mail. ‘Please tell people we chose not to.’ Odd thing to ask, now you say it.\"",choices:[D_("[Thank him.]",null,{flag:'nb_hal',now:()=>{ S.flags.ag_lettersN=(S.flags.ag_lettersN||0)+1; }})]},
    n9:{speaker:'Hal Pruitt',text:"\"Never had kids.\"",choices:[D_("[Leave.]",null)]}}),
  rosa:NB('rosa','Rosa Diaz',{
    n0:{speaker:'Rosa Diaz',text:"\"There was a little boy. I used to see him at the upstairs window, waving, when I walked to school.\" She looks at the Bell house. It has one storey. \"He was about four. He was always about four.\"",
      choices:[D_("[Sam] How old were you, then?",'n1s',null,isSam),D_("[Dean] Agnes ever ask you to keep quiet about him?",'n1d',null,isDean)]},
    n1s:{speaker:'Rosa Diaz',text:"\"Seven? Eight?\" She’s fifty-five. \"He’d be— he’d be older than Agnes is. That doesn’t work. That doesn’t work, does it.\"",choices:[D_("[Thank her.]",null,{flag:'nb_rosa',now:()=>{ S.flags.ag_dates=(S.flags.ag_dates||0)+1; }})]},
    n1d:{speaker:'Rosa Diaz',text:"\"She wrote me when I was twelve. ‘Please don’t say anything about the boy at the window.’ I thought it was a game.\"",choices:[D_("[Thank her.]",null,{flag:'nb_rosa',now:()=>{ S.flags.ag_lettersN=(S.flags.ag_lettersN||0)+1; }})]},
    n9:{speaker:'Rosa Diaz',text:"\"Always about four.\"",choices:[D_("[Leave.]",null)]}}),
});
defDest({id:'larch',name:'Larch Street (Agnes Bell)',sector:'larch',x:7.6,y:10.6,a:0,avail:()=>!!S.flags.agnes_lead&&S.act>=2&&S.act<=3,note:()=>caseClosed('agnes')?'case closed':'one more room'});
INV_UPDATES.push(dt=>{ const F=S.flags; if(F.agnes_lead||S.act!==2||!F.kevin_done||S.cut) return;
  if(!F.agnes_nudge){ F.agnes_nudge=S.time; return; }
  if(S.time-F.agnes_nudge>40){ F.agnes_lead=true; msg('marla','agnes bell has called the desk four times tonight. she says walt is trapped in a room in the house. walt died nineteen years ago. larch street, the impala knows the way'); } });
PEOPLE.push({flag:'met_agnes',look:'agnes',name:'Agnes Bell',line:'114 Larch Street. Lives alone. Has a nursery.'});
defCase({ id:'agnes', n:40, kicker:'Act II · Case 7 (optional)', title:'The House With One More Room', open:()=>!!S.flags.agnes_lead,
  summary:()=>caseClosed('agnes')?'A room that grew to keep a memory in, whether or not the memory happened.':'Agnes Bell, eighty, has lived alone for nineteen years. She keeps asking who has come to fix the nursery. Her house has no nursery.',
  clues:{
    agnes:{t:'Agnes Bell',k:'talk',x:'“Which of you has come to repair the nursery?”',have:F_('met_agnes')},
    hall:{t:'A longer hall',k:'place',x:'Second visit: the hall is longer than the house.',have:F_('agnes_hall')},
    door:{t:'A door that wasn’t there',k:'place',x:'Third visit: a door at the end of the hall, open, and a music box behind it.',have:F_('agnes_door')},
    plans:{t:'Two blueprints',k:'doc',x:'Same date, same architect. One has a nursery. One has a staircase that doesn’t fit. Inspected by the mill’s office.',have:F_('read_plans')},
    june:{t:'June: a baby who died',k:'talk',x:'A son who died before he was one.',who:'June Albee',have:F_('nb_june')},
    hal:{t:'Hal: no children',k:'talk',x:'“They chose not to.”',who:'Hal Pruitt',have:F_('nb_hal')},
    rosa:{t:'Rosa: the boy at the window',k:'talk',x:'An upstairs window, in a one-storey house. Always about four.',who:'Rosa Diaz',have:F_('nb_rosa')},
    dates:{t:'Nobody can say when',k:'note',x:'Every neighbour remembers the child. None can give a year.',have:()=>(S.flags.ag_dates||0)>=2},
    letters:{t:'Forty years of letters',k:'doc',x:'Agnes asked each neighbour to keep a different family secret.',have:()=>!!S.flags.ag_letters||(S.flags.ag_lettersN||0)>=2},
    photo:{t:'A photograph',k:'doc',x:'Agnes at thirty with a boy of four, on a porch with a second storey.',have:F_('ag_photo')},
    musicbox:{t:'The music box',k:'place',x:'Plays with no key. Stops when you face the door.',have:F_('agnes_box_door')},
    note:{t:'“If I remember him”',k:'doc',x:'“If I remember him, he has to have been real.”',have:F_('ag_note')},
    differ:{t:'Two different rooms',k:'place',x:'Dean sees a coat on a chair. Sam sees a boy by the bed. Neither sees the other’s.',have:F_('agnes_nursery')},
    voice:{t:'Behind the wardrobe',k:'talk',x:'“I’m not her son. She looked after me, and gave me back. Maybe.”',have:F_('ag_voice')},
  },
  links:[
    {id:'nofit',a:'plans',b:'hall',t:'The house doesn’t fit itself',x:'The blueprints disagree, and the house changes to match whichever one Agnes is remembering.',dean:'House has two floor plans and it’s using both.',sam:'Memory is editing the building.'},
    {id:'contradict',a:'june',b:'hal',t:'Contradicting neighbours',x:'One remembers a dead baby, one remembers no children. They can’t both be right, and they both believe it.',dean:'Somebody’s lying.',sam:'Nobody’s lying. That’s the problem.'},
    {id:'window',a:'rosa',b:'photo',t:'The boy at the window',x:'Rosa’s boy waves from a second storey. The photo has a second storey. The house doesn’t. The past has more rooms than the present.',dean:'The kid lives on the floor that isn’t there.',sam:'He’s always four because that’s how old he was when she remembers him.'},
    {id:'secrets',a:'letters',b:'note',t:'Keeping him real',x:'Agnes gave each neighbour a different secret to keep, and kept the child alive by making sure nobody could agree on him.',dean:'She spread him out so nobody could check.',sam:'If no one remembers the same thing, no one can prove it didn’t happen.'},
    {id:'uncertain',a:'dates',b:'note',t:'No year',x:'The neighbours remember the child but not when. The room preserves the memory, not the date.',dean:'Feels real, no paperwork. Story of this town.',sam:'The room doesn’t care whether it happened. Only that she remembers it.'},
    {id:'anchor',a:'musicbox',b:'door',t:'The anchor',x:'The music box holds the room in place. Break it and the room goes. It won’t take her grief with it; it’ll take the memory.',dean:'Smash the box, job done.',sam:'Smash the box and she forgets him again.'},
    {id:'view',a:'differ',b:'voice',t:'A room for each of you',x:'The room shows each brother what he expects to find. Whatever is behind the wardrobe knows it is made of someone else’s memory.',dean:'It’s showing me a coat. Coats I get.',sam:'It showed me a child. Of course it did.'},
  ],
  theory:{q:'What is the extra room preserving?',reward:25,
    opts:[{id:'son',t:'Agnes’s son, who died. The room is his grave.'},{id:'none',t:'Nothing. There was never a child.'},{id:'memory',t:'Something she can’t stop remembering, whether or not it happened the way she remembers.',ok:true}],
    right:'The room preserves the remembering, not the child. Maybe he was real. The room doesn’t need him to have been.',
    wrong:'There’s no clean answer. The room keeps a memory; the memory doesn’t have to be true to have a door.'},
  talk:()=>{ const D=isDean(); return [[brother(),D?'She’s suffered enough, Sam. If the room helps, let her have the room.':'Dean, a comfortable lie is still a cage. She deserves to know.'],[S.hero,D?'Knowing’s not always better.':'Maybe. Maybe it’s also the only thing she has left.']]; },
  autopsy:()=>{ const d=caseDecision('agnes');
    return { what:['The Bell house grew a hallway, and then a door, and then a nursery that each of you saw differently.',
        d==='open'?'You opened the wardrobe. Agnes remembers Thomas Avery, four, whom she looked after and gave back.':d==='box'?'You broke the music box. The room folded shut. Agnes forgot again.':'You let Agnes keep the room. It travels.'],
      cause:['A memory strong enough, kept for long enough, in a town where the rules have gone soft, can alter a physical room.','The house was inspected by the same county office that approved the ventilation on line three.'],
      open:['Whether the boy was real.','If a memory can add a room, what happens when something starts changing the rules that make rooms possible?',d==='keep'?'The room has been seen in the motel.':'Agnes is alone in a house the right size.'],
      dean:d==='box'?'Quickest. Safest. Felt like stealing.':'She’d already suffered enough. I don’t know if we helped.',
      sam:d==='open'?'She’s grieving. That’s better than a room with no windows. I think.':'A comforting memory can be its own kind of prison. I don’t know who gets to say so.' }; },
  paper:()=>{ const d=caseDecision('agnes');
    return { head:d==='open'?'WIDOW SEEKS GRAVE OF CHILD SHE “GAVE BACK”':d==='box'?'LARCH STREET: ALL QUIET':'NEIGHBOURS REPORT “EXTRA DOOR” IN HOMES',
      deck:d==='open'?'Agnes Bell, 80, asks for county records on Thomas Avery, 4.':d==='box'?'Mrs. Bell reports her guttering is fine.':'Residents say a painted door has appeared in several buildings. It is warm to the touch.',
      by:'C. S.',body:[d==='open'?'Agnes Bell of 114 Larch Street has asked the county for the burial records of a child she cared for in the 1960s. “I gave him back,” she told the Ledger. “I want to know where they put him.”':d==='box'?'Agnes Bell, 80, of Larch Street says she has lived alone all her life and doesn’t know why people keep asking about a nursery.':'Several residents, including the night clerk at the Oak Rest Motel, report a door in their walls that “has always been there.” Behind it, they say, is a music box.',
        'Two blueprints for the Bell house, filed together in the county archive in 1958, disagree about how many rooms it has. Both carry the same inspection stamp.','The Ledger has received three letters from Mrs. Bell over the years asking it not to print certain things. It has printed none of them. It isn’t printing them now.'] }; },
  forum:()=>{ const d=caseDecision('agnes'); return [{u:'june_albee',t:'Poor thing.'},{u:'hal.pruitt',t:'never had kids'},{u:'rosa.d',t:d==='open'?'I knew he was real. I KNEW.':'he was always about four'},{u:'0114',t:'there are more rooms than there are'}]; },
});

/* ── The clinic ─────────────────────────────────────────────────────────── */
function clinicLot(){
  const W=18,H=11,g=Grid(W,H,' '); box(g,0,0,W-1,H-1,'S');
  box(g,2,0,15,3,'#'); rect(g,4,3,6,3,'G'); rect(g,11,3,13,3,'G'); g[3][8]='+';
  rect(g,1,5,W-2,9,'.');
  return {id:'clinic_lot',name:'Oakhaven Clinic — parking lot',grid:g,outdoor:true,ambient:.35,region:'clinic',
    spawn:{x:8.5,y:6.4,a:-Math.PI/2},doors:{'8,3':{to:'clinic',x:8.5,y:12.4,a:-Math.PI/2}},
    lights:[{x:8.5,y:4.4,p:1.8,f:.2}],pois:[{x:8.5,y:3.5,name:'Clinic',kind:'door'},{x:4,y:7.5,name:'Impala',kind:'car'}],
    entities:[impala_(4,7.6,0),{kind:'prop',car:'parked_blue',x:13,y:7.6,r:.75,h:1.45,face:Math.PI,use:'cl_car',useName:'Martin’s car'},
      {kind:'prop',m:'lamp',x:8.5,y:4.4,r:.25,h:3.4,emit:1}]};
}
function clinic(){
  const s=room('clinic','Oakhaven Clinic',18,14,'P',.3,'c'); s.ceilH=1.4; s.region='clinic';
  const g=s.grid; rect(g,1,7,16,7,'P'); g[7][3]='o'; g[7][8]='o'; g[7][14]='o';  // wall between front and back
  rect(g,6,1,6,6,'P'); rect(g,11,1,11,6,'P');                               // exam / records / basement stair
  rect(g,7,1,10,2,'K'); g[13][8]='+'; g[0][13]='+';
  s.doors={'8,13':{to:'clinic_lot',x:8.5,y:4.4,a:Math.PI/2},'13,0':{to:'basement',x:4.5,y:6.4,a:-Math.PI/2,need:'cl_stairs',locked:'A door marked STORAGE. It isn’t on the building plans. It’s locked, and the lock is warm.'}};
  s.spawn={x:8.5,y:12.4,a:-Math.PI/2};
  s.lights=[{x:8.5,y:10,p:2,f:.18},{x:3,y:3,p:1.4,f:.24},{x:8.5,y:4,p:1,f:.3},{x:14,y:4,p:.8,f:.4}];
  s.pois=[{x:8.5,y:13.5,name:'Out',kind:'door'},{x:13.5,y:.5,name:'Storage',kind:'door'}];
  s.entities=[...counter(9.6,5.5,11.5),char_('doctor',8.5,8.8,{kind:'npc',dialogue:'halvorsen',name:'Dr. Halvorsen',h:1.85,face:Math.PI/2}),
    {kind:'prop',m:'bed',x:3,y:3.4,r:.6,h:.55},char_('martin',3,4.4,{kind:'npc',dialogue:'martin',name:'Martin Vale',h:1.78,face:-Math.PI/2,pose:4,martin:true}),
    {kind:'prop',m:'paper',x:4.8,y:1.3,r:.15,h:.4,z:.6,use:'cl_chart',useName:'The chart at the foot of the bed'},
    {kind:'prop',m:'cabinet',x:7.6,y:3.4,r:.3,h:1.2,use:'cl_old',useName:'Old charts'},{kind:'prop',m:'cabinet',x:10.2,y:3.4,r:.3,h:1.2,use:'cl_extra',useName:'The mill files'},
    {kind:'prop',m:'cabinet',x:10.2,y:5.4,r:.3,h:1.2,use:'cl_lily',useName:'H — Hollis'},
    {kind:'prop',m:'paper',x:16.6,y:10,r:.15,h:.5,z:.6,use:'cl_plans',useName:'Fire-escape plan'}];
  return s;
}
function basement(){
  const s=room('basement','Clinic — the room under the stairs',9,8,'P',.06,'c'); s.ceilH=1.25; s.region='clinic';
  s.grid[7][4]='+'; s.doors={'4,7':{to:'clinic',x:13.5,y:1.6,a:Math.PI/2}}; s.spawn={x:4.5,y:6.4,a:-Math.PI/2};
  s.lights=[{x:4.5,y:3,p:.8,f:.5}]; s.pois=[{x:4.5,y:7.5,name:'Up',kind:'door'}];
  s.entities=[{kind:'prop',m:'bed',x:2.4,y:2.6,r:.6,h:.55},{kind:'prop',m:'monitor',x:5.6,y:1.4,r:.2,h:.75,z:.4,use:'cl_monitor',useName:'The monitor',emit:.4},
    {kind:'prop',m:'clock',x:4.5,y:1.3,r:.1,h:.35,z:1,use:'cl_clock',useName:'A clock'},{kind:'prop',m:'drawings',x:7.7,y:4,r:.1,h:.8,z:.3,use:'cl_tally',useName:'Marks on the wall'}];
  return s;
}
[clinicLot(),clinic(),basement()].forEach(addSector);
defDest({id:'clinic',name:'Oakhaven Clinic',sector:'clinic_lot',x:8.5,y:6.4,a:-Math.PI/2,avail:()=>!!S.flags.clinic_lead&&S.act===3,note:()=>caseClosed('clinic')?'case closed':'a chart for tomorrow'});
USES.cl_car=()=>{ S.flags.cl_car=true; openMenu('Martin’s car','A delivery van’s worth of parcels in the back of a hatchback, all addressed to towns on the coast. The dashboard clock reads 2:52. You watch it. 2:51. 2:50.',[{text:'Step back'}]); };
USES.cl_chart=()=>{ S.flags.cl_chart=true; openMenu('The chart','PATIENT: VALE, Martin R.  DOB 03/11/79  BLOOD: O NEG\nPresenting: fractured left radius, lacerations to scalp, contusion to sternum consistent with steering column.\n\nTIME OF DEATH: Sunday 04 Oct, 02:40.\n\nSigned M. Halvorsen, MD. The sevens are crossed, European-style. It is dated yesterday. He arrived an hour ago.',[{text:'Step back'}]); };
USES.cl_old=()=>{ S.flags.cl_old=true; openMenu('Old charts','Thirty years of Halvorsen’s handwriting. He crosses his sevens. He always has. He writes his fours open at the top. The chart on Martin’s bed does both.',[{text:'Step back'}]); };
USES.cl_extra=()=>{ S.flags.cl_extra=true; openMenu('The mill files','Six folders: Hollis, Brandt, Okafor, Okafor, Lindqvist, Haddad. Each has one page too many at the back, a prognosis in the past tense written before the patient died.\n\nOn Lyle Brandt’s, where the cause of death should be, someone has written: Deferred pending review.',[{text:'Step back'}]); };
USES.cl_lily=()=>{ S.flags.cl_lily=true; openMenu('H — Hollis','HOLLIS, Lily A. A note in the margin of her first visit: persistent cough, ? environmental. Query father’s workplace.\n\nThe note is dated February. Ray Hollis filed his first requisition for fan fourteen in March.',[{text:'Step back'}]); };
USES.cl_plans=()=>{ S.flags.cl_plans=true; S.flags.cl_stairs=!!(S.flags.cl_interview); openMenu('Fire-escape plan','A laminated plan of the clinic: reception, exam, records. No stairs. No storage room. The door marked STORAGE in the records corridor isn’t on it.',[{text:'Step back'}]); };
USES.cl_clock=()=>openMenu('A clock','Twenty to three. Of course.',[{text:'Step back'}]);
USES.cl_tally=()=>{ S.flags.cl_tally=true; openMenu('Marks on the wall','Tally marks, hundreds of them, scratched into the plaster in groups of five. There’s no other way out of this room. Whoever made them had time.',[{text:'Step back'}]); };
USES.cl_monitor=()=>{ const F=S.flags; F.cl_monitor=true;
  const m=SECTORS.basement.entities.find(e=>e.martin);
  if(!m){ openMenu('The monitor','Unplugged. The screen is dark. You have the feeling it is waiting for someone else.',[{text:'Step back'}]); return; }
  if(!F.cl_seq){ F.cl_seq=true; sfx('switch');
    openMenu('The monitor','It turns on with no power. A line of numbers runs across it, slowly, the way a heartbeat would: 03.18 · 04.22 · 05.20 · 06.17 · 07.15 · 08.19 · 09.16 · 10.03\n\nYou know those dates. Every death in Oakhaven this year, Lily first.\n\nThe last number is 10.04. Tomorrow. Martin is staring at it.',
      [{text:'Interrupt it. Pull the leads.',act:()=>{ F.cl_interrupt=true; sfx('riteFail'); openMenu('The monitor','The screen goes white and comes back. 10.04 · 02:52.\n\nA new time. Twelve minutes later. It isn’t a prophecy. It’s a record of something that reacts to being watched.',[{text:'Step back'}]); }},{text:'Step back'}]); return; }
  clinicDecision(); };
function clinicDecision(){
  openMenu('Martin Vale','Martin is sitting on the basement bed with his good hand pressed over his sternum, counting under his breath.\n\nThe chart is upstairs on his bed. Dr. Halvorsen is at the top of the stairs.',[
    {text:'Treat him as a patient. Do what Halvorsen says.',note:'the chart stays in the records',act:()=>clinicEnd('treat')},
    {text:'Destroy the chart.',note:'he’ll survive 2:40; someone else gets a chart',act:()=>clinicEnd('destroy')},
    {text:'Use the chart. Follow the prediction and get ahead of it.',note:'it will change again',act:()=>clinicEnd('follow')}]); }
function clinicEnd(k){ decide('clinic',k); const F=S.flags;
  const m=SECTORS.basement.entities.find(e=>e.martin); if(m){ SECTORS.basement.entities=SECTORS.basement.entities.filter(e=>e!==m); m.x=3; m.y=4.4; SECTORS.clinic.entities.push(m); m.dialogue='martin_after'; }
  if(k==='treat'){ F.halvorsen_trusted=true; F.martin_saved=true;
    say('doctor','Splint, saline, and somebody sitting with him until three. Not a ritual. A patient. That’s all I know how to do.',4,{now:true}); later(4.4,()=>closeCase('clinic')); }
  if(k==='destroy'){ F.future_chart_destroyed=true; F.martin_saved=true; sfx('flare');
    say('narr','The chart burns in the clinic sink. At 2:40 Martin Vale is alive and complaining about the coffee. At 2:41 there is a new chart in the records room, with a different name on it.',6,{now:true}); later(6.4,()=>closeCase('clinic')); }
  if(k==='follow'){ F.chart_followed=true; F.martin_saved=true;
    say('narr','You read the chart like a map. At 2:38 you move Martin out of the room the steering column would have reached. At 2:40 nothing happens. Then the chart, on its own, rewrites the time.',6,{now:true});
    addNoteRaw('chart_next','The next prediction','On the back of Martin’s chart, in Halvorsen’s hand, in ink that was not there before: “St. Brendan’s, the west hall, the third thing in the wall. 02:31.”');
    later(6.4,()=>closeCase('clinic')); }
}
/* if you followed the chart, the cathedral's west hall loses a tendril */
{ const was=setupAct4; setupAct4=function(){ was(); if(S.flags.chart_followed){ const t=SECTORS.cathedral.entities.filter(e=>e.m==='tendril')[2]; if(t){ t.dead=true; } } }; }
Object.assign(DIALOGUE,{
  halvorsen:{ port:'doctor', start:()=>S.flags.cl_halv?'h9':'h0', nodes:{
    h0:{speaker:'Dr. Halvorsen',text:"\"I found the chart on Tuesday. He arrived tonight with exactly those injuries.\" He looks a decade older than he did on Main Street. \"I didn’t write it. That’s my handwriting. I didn’t write it.\"",
      choices:[D_("Tell me about Lily Hollis.",'h1'),D_("Has this happened before?",'h2')]},
    h1:{speaker:'Dr. Halvorsen',text:"\"I wrote pneumonia.\" He doesn’t look away. \"If I’d written occupational exposure for a nine-year-old, the company’s lawyers would have called it an act of God. Inevitable. Nobody looks at an act of God. Pneumonia, somebody might have looked at.\n\nNobody did. That was my fault too.\"",
      choices:[D_("You did what you could inside a broken system.",'h2',{align:['h',1],flag:'halv_heard'}),D_("[Dean] You still signed it, Doc.",'h2',null,isDean)]},
    h2:{speaker:'Dr. Halvorsen',text:"\"There are pages in the mill files I didn’t write either. Prognoses, in the past tense, for men who were still alive when they were filed.\" He hands you a key. \"Records are through there. Talk to Martin. Then tell me I’m not losing my mind.\"",
      choices:[D_("[Take the key.]",null,{flag:'cl_halv'})]},
    h9:{speaker:'Dr. Halvorsen',text:"\"Bring them back breathing.\"",choices:[D_("[Leave.]",null)]},
  }},
  martin:{ port:'martin', start:()=>S.flags.cl_interview?'m9':'m0', nodes:{
    m0:{speaker:'Martin Vale',text:"\"I’ve never been to Oakhaven. I don’t know how I got here. I had a route. Coos Bay, Bandon, Port Orford.\" His arm is in a temporary splint. \"I remember a room with no windows. Someone asked me to describe the sound of a machine.\"",
      choices:[D_("[Sam] Take your time. What did the room feel like?",'m1s',null,isSam),D_("[Dean] Who brought you in, Martin?",'m1d',null,isDean)]},
    m1s:{speaker:'Martin Vale',text:"He breathes out. \"Like being measured. Not hurt. Measured. Like somebody was writing down how long things took.\" He looks at the floor. \"It was under something. Under here, maybe.\"",
      choices:[D_("Thank you, Martin.",null,{flag:'cl_interview',now:()=>{ S.flags.cl_measured=true; S.flags.cl_stairs=true; }})]},
    m1d:{speaker:'Martin Vale',text:"\"Nobody! Nobody brought me.\" He grabs the bed rail. \"There’s someone outside. In the lot. Waiting to collect me. I can feel him. He’s got a clipboard.\"",
      choices:[D_("Nobody’s collecting anybody. Sit tight.",null,{flag:'cl_interview',now:()=>{ S.flags.cl_collect=true; S.flags.cl_stairs=true; }})]},
    m9:{speaker:'Martin Vale',text:"\"It’s nearly twenty to three, isn’t it.\"",choices:[D_("[…]",null)]},
  }},
  martin_after:{ port:'martin', start:'a0', nodes:{ a0:{speaker:'Martin Vale',text:()=>S.flags.martin_saved?"\"Two fifty-three,\" he says, looking at the clock as if it owes him money. \"Still here. Still have a route.\"":"\"…\"",choices:[D_("[…]",null)]} }},
});
/* when you go down, Martin follows */
SECTOR_HOOKS.push((id,prev)=>{ const F=S.flags; if(id!=='basement'||!F.cl_interview||caseDecision('clinic')) return;
  const m=SECTORS.clinic.entities.find(e=>e.martin); if(!m) return;
  SECTORS.clinic.entities=SECTORS.clinic.entities.filter(e=>e!==m); Object.assign(m,{x:3.4,y:3.6,pose:undefined,face:-Math.PI/2}); SECTORS.basement.entities.push(m);
  later(1,()=>say('martin','This is it. This is the room. I’ve been here before.',3.4,{now:true})); });
/* the call */
INV_UPDATES.push(dt=>{ const F=S.flags; if(F.clinic_lead||S.act!==3||!F.lily_done||S.cut||S.call) return;
  if(!F.clinic_nudge){ F.clinic_nudge=S.time; return; }
  if(S.time-F.clinic_nudge>25){ F.clinic_called=true;
    const lead=()=>{ if(!F.clinic_lead){ F.clinic_lead=true; toast('New destination — Oakhaven Clinic (Impala)'); } };
    ringPhone('Dr. Halvorsen',[['doctor','It’s Halvorsen. At the clinic. I need you to come and look at a chart.'],['doctor','It’s for a patient who hasn’t arrived yet. It has his time of death on it. It’s tomorrow.'],['doctor','…He just walked in. With the injuries on the chart. Please come.']],
      {onEnd:lead,onDecline:()=>{ lead(); later(4,()=>msg('halvorsen','please come to the clinic. there is a chart for a man who dies tomorrow. he is here')); }}); } });
PEOPLE.push({flag:'cl_interview',look:'martin',name:'Martin Vale',line:'Delivery driver. Has never been to Oakhaven. Dies tomorrow at 2:40, according to his chart.'});
defCase({ id:'clinic', n:60, kicker:'Act III · Case 8 (optional)', title:'The Patient Who Died Tomorrow', open:()=>!!S.flags.clinic_lead,
  summary:()=>caseClosed('clinic')?'Records that describe suffering before it happens, and change when you look at them.':'Dr. Halvorsen found a chart for a patient who hadn’t arrived yet. Time of death: tomorrow, 2:40. Then the patient walked in.',
  clues:{
    chart:{t:'Martin’s chart',k:'record',x:'Time of death Sunday 02:40. Signed Halvorsen, sevens crossed. Dated before he arrived.',have:F_('cl_chart')},
    old:{t:'Thirty years of sevens',k:'record',x:'Halvorsen crosses his sevens and writes open fours. So does the chart.',have:F_('cl_old')},
    halvorsen:{t:'Halvorsen',k:'talk',x:'“I didn’t write it. That’s my handwriting. I didn’t write it.”',have:F_('cl_halv')},
    extra:{t:'One page too many',k:'record',x:'Past-tense prognoses for the mill dead, filed while they lived. “Deferred pending review.”',have:F_('cl_extra')},
    lily:{t:'Lily’s first visit',k:'record',x:'“Persistent cough, ? environmental.” February. A month before Ray’s first requisition.',have:F_('cl_lily')},
    martin:{t:'Martin Vale',k:'talk',x:()=>S.flags.cl_measured?'A room with no windows where he was measured, not hurt.':'Someone in the lot waiting to collect him, with a clipboard.',have:F_('cl_interview')},
    car:{t:'Running backward',k:'place',x:'The dashboard clock in Martin’s car is running backward.',have:F_('cl_car')},
    plans:{t:'Not on the plans',k:'doc',x:'The fire-escape plan has no stairs and no storage room.',have:F_('cl_plans')},
    tally:{t:'The room under the stairs',k:'place',x:'A bed, a dead monitor, a clock at 2:40, and hundreds of tally marks.',have:F_('cl_tally')},
    monitor:{t:'The monitor',k:'place',x:()=>S.flags.cl_interrupt?'Every death this year, then tomorrow. Interrupted, it wrote a new time.':'Every death in Oakhaven this year, then tomorrow.',have:F_('cl_seq')},
  },
  links:[
    {id:'hand',a:'chart',b:'old',t:'His sevens',x:'The chart is in Halvorsen’s hand, down to the crossed sevens. He’s telling the truth that he didn’t write it — not in this version of tonight.',dean:'Doc wrote it. Just not yet.',sam:'Or in a version of the night he can’t remember.'},
    {id:'ahead',a:'extra',b:'lily',t:'The records got there first',x:'The clinic’s files described the mill deaths before they happened, and noted Lily’s cough before her father knew to complain. Institutional records are anticipating suffering.',dean:'Paper knew before people did.',sam:'It’s not predicting. It’s shaping the conditions so it becomes predictable.'},
    {id:'measured',a:'martin',b:'tally',t:'The room with no windows',x:'Martin’s room is under the clinic, not on any plan, full of tally marks. Somebody is measuring.',dean:'Somebody’s keeping score.',sam:'He wasn’t hurt there. He was counted.'},
    {id:'backward',a:'car',b:'chart',t:'Counting down',x:'His clock runs backward toward the time on his chart. He isn’t arriving at it. It’s arriving at him.',dean:'Countdown.',sam:'Or a countdown that can be stopped.'},
    {id:'hidden',a:'plans',b:'tally',t:'A room that isn’t there',x:'The basement isn’t on the plans. Like the nursery on Larch Street, the town has rooms for things it wants to keep.',dean:'This town’s got more rooms than it should.',sam:'Space keeps what it’s told to keep.'},
    {id:'reacts',a:'monitor',b:'chart',t:'It reacts',x:'The prediction changes when it’s interfered with. It isn’t a prophecy. It’s a record of a process, and the process is watching back.',dean:'So we can cheat it.',sam:'So looking at it is part of it.'},
  ],
  theory:{q:'Is Martin’s chart a prophecy?',reward:25,
    opts:[{id:'fixed',t:'Yes. He dies at 2:40 whatever we do.'},{id:'react',t:'No. It’s the record of a process that reacts to being watched.',ok:true},{id:'sleep',t:'No. Halvorsen writes them in his sleep.'}],
    right:'Nothing in the records room is fate. It’s bookkeeping, done ahead of time, by something that adjusts when you read over its shoulder.',
    wrong:'The chart changed when you touched it. Whatever this is, it isn’t fixed, and it isn’t the doctor.'},
  talk:()=>[[brother(),isDean()?'Something’s keeping the books in this town, Sam. Ahead of time.':'Something is writing it down before it happens, Dean.'],[S.hero,isDean()?'Then it can be edited.':'Then it can be crossed out.']],
  autopsy:()=>{ const d=caseDecision('clinic');
    return { what:['A chart predicted Martin Vale’s death. The basement under the clinic, which is not on the plans, listed every death this year and then tomorrow.',
        d==='treat'?'You treated Martin as a patient, not a supernatural object. He lived past 2:40.':d==='destroy'?'You burned the chart. Martin lived. A new chart appeared with a different name.':'You used the chart to get ahead of it. It rewrote itself. It told you something about St. Brendan’s.'],
      cause:['The town’s records anticipate suffering before the people involved understand it. Not prophecy: bookkeeping by something that is also shaping the conditions.','Halvorsen wrote pneumonia on Lily’s certificate so her death wouldn’t be filed as inevitable. Nobody looked anyway.'],
      open:['Whether the thing behind the rift only eats suffering, or arranges it.',d==='destroy'?'Whose name is on the new chart.':'The chart is still in the records room.','The man with the clipboard in the parking lot. Martin was sure.'],
      dean:d==='follow'?'It gave us a tip. I’ll take a tip. I just don’t trust who’s giving it.':'We saved one guy from a piece of paper. Weird job.',
      sam:d==='treat'?'He wasn’t a curse. He was a man with a broken arm. Sometimes the most radical thing is ordinary care.':'Observation is part of the process. That includes us.' }; },
  paper:()=>{ const d=caseDecision('clinic');
    return { head:d==='destroy'?'CLINIC FIRE ALARM; NEW CHART FOUND':'DRIVER SURVIVES “2:40” CRASH CHART',deck:d==='destroy'?'A chart in the clinic records names Sheriff R. Ames. Time of death: Monday, 02:40.':'Martin Vale, 47, of Coos Bay, discharged “breathing and annoyed.”',
      by:'Chuck Shurley, contributing writer', body:['Dr. M. Halvorsen of the Oakhaven Clinic confirmed that a chart describing a patient’s injuries and time of death was found before the patient arrived. “It was my handwriting,” he said. “I would like that printed.”',
        d==='destroy'?'Sheriff Ames, asked about the chart bearing his name, said he did not believe in that kind of thing. He then asked what time it was.':'Mr. Vale says he does not remember how he came to be in Oakhaven. His car’s dashboard clock now runs the right way.',
        'The Ledger’s contributing writer notes that every article is, in a sense, written before it happens. He asks readers not to read ahead.'] }; },
  forum:()=>[{u:'dr.halvorsen',t:'It was my handwriting. I want that on the record.'},{u:'martin.vale.deliveries',t:'Still alive. Still have a route. Who are you people'},{u:'sheriff_ames_official',t:caseDecision('clinic')==='destroy'?'What time is it.':'Please stop calling the station about charts.'},{u:'c.shurley',t:'spoilers!!'}],
});

/* chapter select skips the cases it skips */
{ const was=startAt; startAt=function(act){ was(act);
    const before={mill:2,shift:2,bell:3,lockdown:3,road:3,agnes:4,lily:4,clinic:4};
    for(const [id,a] of Object.entries(before)) if(act>=a) S.inv.closed[id]=true; }; }
