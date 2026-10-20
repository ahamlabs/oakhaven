/* ═══ The guises (1.7) ═════════════════════════════════════════════════════
   Before the end, the Formless One does not only appear as a stranger. He
   comes as other things, and helps, and never says so:

     a black dog       when you're badly hurt outdoors, once an act: it heals you
     a crow            when your guns are empty in a fight, once an act: ammunition
     the wind          when you're outnumbered and hurt, once an act: it knocks them down
     a flower seller   Act II, by the bench on Main Street: a marigold that refuses your death once
     a deer            at the reservoir, once the bell is settled: a tear in the air to 1951
     a woman at a bus stop that has no buses
                       Act II, after the vigil: a tear to a morning that hasn't happened
     a crow on the wire
                       Act III, after Lily: a tear into the place where the church is upside down

   Each leaves one dark peacock feather. At the altar, he admits to all of them. */

/* ── sprites ──────────────────────────────────────────────────────────── */
Object.assign(SPR,{
  blackdog: art(38,26,A=>{ const k=[22,22,30], k2=[40,40,54];
    A.ell(18,14,11,6,C(k)); A.ell(16,12,9,4,C(k2)); A.ell(30,9,5,4.5,C(k)); A.ell(34,10,3,2,C(k)); A.rect(28,3,30,6,C(k));    // body, head, muzzle, ear
    for(const x of [10,14,22,26]) A.rect(x,18,x+1,25,C(k)); A.line(7,12,2,6,C(k)); A.line(7,13,2,7,C(k));                  // legs, tail
    A.set(31,8,glow(220,226,240)); A.set(35,10,C([10,10,12])); A.shade(.16); A.outline(rgb(6,6,10)); }),
  crow: art(20,18,A=>{ const k=[16,16,22]; A.ell(10,10,6,5,C(k)); A.ell(15,6,3.4,3,C(k)); A.line(18,6,20,7,C([60,60,64]));
    A.line(4,10,0,13,C(k)); A.line(5,11,1,15,C(k)); A.line(9,15,8,17,C([60,56,50])); A.line(11,15,12,17,C([60,56,50])); A.set(16,5,glow(220,226,240)); A.outline(rgb(4,4,8)); }),
  deer: art(36,44,A=>{ const b=[60,66,86], b2=[90,96,120];
    A.ell(16,24,11,6,C(b)); A.ell(14,22,9,3.5,C(b2)); A.rect(24,10,27,22,C(b)); A.ell(28,9,4,3,C(b)); A.ell(32,10,2.6,1.8,C(b));
    for(const x of [8,12,20,23]) A.rect(x,29,x+1,43,C(dk(b,.8)));
    for(const s of [-1,1]){ A.line(27,6,27+s*3,0,C([200,206,220])); A.line(27+s*2,3,27+s*6,2,C([200,206,220])); }
    A.set(29,8,glow(226,232,246)); A.shade(.18); A.outline(rgb(6,6,12)); }),
  wormhole: art(48,72,A=>{ for(let y=0;y<72;y++) for(let x=0;x<48;x++){ const u=(x-24)/22, v=(y-36)/34, r=Math.hypot(u,v); if(r>1) continue;
      const a=Math.atan2(v,u)+r*7, band=.5+.5*Math.sin(a*3+r*9);
      const c=r<.18?[250,250,255]:band>.75?[200,206,226]:band>.4?[70,56,150]:[14,12,30];
      A.set(x,y,(r<.5||band>.75)?glow(c[0],c[1],c[2]):C(c)); } }),
  feather_dark: art(10,26,A=>{ A.line(5,25,5,2,C([30,30,40])); for(let y=4;y<18;y++){ A.line(5,y,5-((18-y)/3),y-2,C([14,40,44])); A.line(5,y,5+((18-y)/3),y-2,C([22,26,70])); }
    A.ell(5,5,2.4,3,C([24,30,80])); A.disc(5,5,1,C([180,190,210])); A.outline(rgb(4,4,8)); }),
  marigold: art(12,12,A=>{ for(let i=0;i<10;i++){ const a=i/10*Math.PI*2; A.disc(6+Math.cos(a)*3.5,6+Math.sin(a)*3.5,1.8,C([236,150,30])); } A.disc(6,6,2.2,C([200,100,20])); A.outline(rgb(40,20,8)); }),
});
Object.assign(LOOKS,{
  flowerwoman:{skin:[150,110,90], hair:{style:'bun',col:[200,200,206]}, eyes:{col:[200,206,220]}, lip:[130,90,90],
    top:{kind:'cardigan',col:[40,40,58],underCol:[70,60,90]}, legs:{kind:'skirt',col:[30,30,44],hose:[60,56,70]}, shoes:[20,20,26], extras:['darkfeather']},
  busstop:{skin:[60,66,96], hair:{style:'long',col:[14,14,24]}, eyes:{col:[206,212,228]}, lip:[80,64,90],
    top:{kind:'coat',col:[20,20,30],long:50}, legs:{kind:'slacks',col:[16,16,24]}, shoes:[12,12,18], extras:['darkfeather']},
});
Object.assign(SPEAKERS,{flowerwoman:{name:'An old woman with marigolds',col:'#e8b060'},busstop:{name:'A woman at the bus stop',col:'#c8d0e4'}});

/* ── where can a thing stand ──────────────────────────────────────────── */
function freeSpot(s,x,y,maxR=6){ for(let r=0;r<=maxR;r+=.5) for(let a=0;a<12;a++){ const t=a/12*Math.PI*2, px=x+Math.cos(t)*r, py=y+Math.sin(t)*r;
    const c=s.grid[py|0]&&s.grid[py|0][px|0]; if(c===undefined||SOLID.includes(c)||c==='w') continue; if(!hits(s,px,py,.35)) return [px,py]; } return null; }
function guiseSeen(k){ const I=inv_(); I.guises=I.guises||{}; I.guises[k]=(I.guises[k]||0)+1; }
function dropFeather(x,y){ S.sector.entities.push({kind:'prop',m:'feather_dark',x,y,r:.05,h:.35,use:'g_feather',useName:'A dark peacock feather',featherFor:true}); }
USES.g_feather=e=>{ e.dead=true; const n=(inv_().feathers=(inv_().feathers||0)+1);
  if(n===1) addNoteRaw('g_feathers','Dark feathers','A dark peacock feather, almost black, left behind by something that helped you and then wasn’t there.');
  else { const nt=S.notes.find(x=>x.id==='g_feathers'); if(nt) nt.text=`${n} dark peacock feathers, almost black. Each one was left by something that helped you and then wasn’t there: a dog, a crow, the wind, an old woman. You are starting to suspect they were all the same thing.`; }
  toast(`A dark feather · ${n}`); };
const nearHunters=(r=14)=>S.sector.entities.filter(e=>e.kind==='enemy'&&!e.dead&&!e.hidden&&e.state==='hunt'&&Math.hypot(e.x-S.px,e.y-S.py)<r);
const gQuiet=()=>!S.cut&&!dlg.open&&!S.menu&&!S.driving&&S.running;

/* ── the black dog ────────────────────────────────────────────────────── */
INV_UPDATES.push(dt=>{ const F=S.flags, k='g_dog'+S.act;
  const dog=S.sector.entities.find(e=>e.gdog&&!e.dead);
  if(dog){ const d=Math.hypot(dog.x-S.px,dog.y-S.py);
    if(dog.leaving){ dog.t-=dt; dog.x+=Math.cos(dog.dir)*3*dt; dog.y+=Math.sin(dog.dir)*3*dt; if(dog.t<=0){ dog.dead=true; } return; }
    if(d>1.1){ const a=Math.atan2(S.py-dog.y,S.px-dog.x); const nx=dog.x+Math.cos(a)*3.2*dt, ny=dog.y+Math.sin(a)*3.2*dt; if(!hits(S.sector,nx,ny,.15)){ dog.x=nx; dog.y=ny; } dog.t-=dt; if(dog.t<=0){ dog.leaving=true; dog.dir=a+Math.PI; dog.t=2; } return; }
    heal(45); sfx('heal'); S.flash=Math.max(S.flash||0,.15); guiseSeen('dog');
    say('narr','A black dog presses its head into your hand. Its eyes are silver. When it lifts its head the pain has gone out of you, all of it, like water out of a sink.',4.4,{now:true});
    later(4.6,()=>say(brother(),isDean()?'Where’d the dog go? Sam. Where did the dog go?':'Dean, that dog. Did you see its eyes?',3));
    dropFeather(dog.x,dog.y); dog.leaving=true; dog.dir=Math.atan2(dog.y-S.py,dog.x-S.px); dog.t=1.6; return; }
  if(F[k]||!gQuiet()||!S.sector.outdoor||S.hp>=35||S.hp<=0||S.sector.dimension) return;
  const p=freeSpot(S.sector,S.px-S.dirX*6,S.py-S.dirY*6,5); if(!p) return; F[k]=true;
  S.sector.entities.push({kind:'prop',m:'blackdog',x:p[0],y:p[1],r:.15,h:.85,gdog:true,t:12,lit:.4}); sfx('step'); });

/* ── the crow ─────────────────────────────────────────────────────────── */
INV_UPDATES.push(dt=>{ const F=S.flags, k='g_crow'+S.act;
  for(const c of S.sector.entities) if(c.gcrow&&!c.dead){ c.t-=dt; if(c.t<1.2) c.z=(c.z||0)+dt*2.4; if(c.t<=0) c.dead=true; }
  if(F[k]||!gQuiet()||S.sector.dimension) return;
  if((S.ammo.rounds||0)+(S.ammo.shells||0)>0||nearHunters().length<1) return;
  const p=freeSpot(S.sector,S.px+S.dirX*2.2,S.py+S.dirY*2.2,3); if(!p) return; F[k]=true; guiseSeen('crow');
  S.sector.entities.push({kind:'prop',m:'crow',x:p[0],y:p[1],r:.05,h:.45,gcrow:true,t:4,lit:.5});
  S.sector.entities.push(pick_('shells',p[0]+.4,p[1]),pick_('rounds',p[0]-.4,p[1]),pick_('rounds',p[0],p[1]+.4));
  dropFeather(p[0],p[1]+.6); sfx('whisper');
  say('narr','A crow drops out of nowhere and lands at your feet with something in its beak. It sets the box down very carefully. Its eye is silver.',4,{now:true}); });

/* ── the wind ─────────────────────────────────────────────────────────── */
INV_UPDATES.push(dt=>{ const F=S.flags, k='g_wind'+S.act; if(F[k]||!gQuiet()||!S.sector.outdoor||S.hp>=55||S.sector.dimension) return;
  const H=nearHunters(12); if(H.length<3) return; F[k]=true; guiseSeen('wind');
  for(const e of nearHunters(16)){ const a=Math.atan2(e.y-S.py,e.x-S.px); e.kx=(e.kx||0)+Math.cos(a)*9; e.ky=(e.ky||0)+Math.sin(a)*9; e.stun=Math.max(e.stun||0,3.5); }
  S.shake=.8; sfx('thunder'); spawnParts(S.px,S.py,1,40,PCOL.smoke,{up:.6});
  say('narr','The wind comes down the street the wrong way, all at once, and every one of them is on its knees. When it passes the air smells of rain on stone, and of flowers that don’t grow in Oregon.',5,{now:true});
  const p=freeSpot(S.sector,S.px+1,S.py+1,3); if(p) dropFeather(p[0],p[1]); });

/* ── the marigold ─────────────────────────────────────────────────────── */
{ const was=hurtPlayer; hurtPlayer=function(amount,src){ const I=inv_();
    if(I.marigold&&S.hp-amount<=0&&!S.dead){ I.marigold=false; S.hp=1; S.flash=1; sfx('bell');
      say('narr','Something should have killed you just then. Instead there are marigold petals all over the ground, and you are still standing.',4.4,{now:true});
      const n=S.notes.find(x=>x.id==='g_marigold'); if(n) n.text='The marigold is gone. You are not.'; return; }
    return was(amount,src); }; }

/* ── the people he is ─────────────────────────────────────────────────── */
DIALOGUE.flowerwoman={port:'flowerwoman',start:()=>S.flags.g_flowers?'f9':'f0',nodes:{
  f0:{speaker:'An old woman with marigolds',text:()=>`An old woman is sitting on the bench with a basket of marigolds on her knees, in the fog, at this hour, as if it were a market morning. Her eyes are a pale, startling silver.\n\n"Marigolds," she says. "For the dead, where I come from. And for the living who are going to need them." She holds one out to you. "This one is for you. It will refuse one thing on your behalf. You'll know which."`,
    choices:[D_('[Take it.] “Thank you.”','f1',{now:()=>{ inv_().marigold=true; addNoteRaw('g_marigold','A marigold','An old woman on the Main Street bench gave you a marigold. “It will refuse one thing on your behalf.”'); toast('A marigold · it will refuse your death, once'); }}),
             D_('“Who are you?”','f2')]},
  f1:{speaker:'An old woman with marigolds',text:()=>S.flags.vigil_done?'"You stood with them, at the candles. Good." She nods at the empty bus stop across the road. "There’s someone waiting for you over there. She has somewhere to show you. It hasn’t happened yet. That is the point."':'"Go on, then." She goes back to arranging her flowers, as if you were already gone.',
    choices:[D_('[Go.]',null,{flag:'g_flowers',now:()=>{ guiseSeen('flowers'); const s=SECTORS.street, w=s.entities.find(e=>e.flowerwoman); if(w) later(3,()=>{ w.hidden=true; dropFeatherAt(s,w.x,w.y); }); }})]},
  f2:{speaker:'An old woman with marigolds',text:'"Somebody’s grandmother." She smiles. "Everybody is, eventually, if they last. Take the flower."',choices:[D_('[Take it.]','f1',{now:()=>{ inv_().marigold=true; addNoteRaw('g_marigold','A marigold','An old woman on the Main Street bench gave you a marigold. “It will refuse one thing on your behalf.”'); toast('A marigold · it will refuse your death, once'); }})]},
  f9:{speaker:'—',port:null,text:'The bench is empty. There are marigold petals on it, and they are dry, in the rain.',choices:[D_('[Leave them.]',null)]},
}};
function dropFeatherAt(s,x,y){ s.entities.push({kind:'prop',m:'feather_dark',x,y,r:.05,h:.35,use:'g_feather',useName:'A dark peacock feather',featherFor:true}); }
DIALOGUE.busstop={port:'busstop',start:'b0',nodes:{
  b0:{speaker:'A woman at the bus stop',text:'There is a bus stop at the end of Main Street. You are fairly sure there wasn’t one this morning. A woman in black is waiting at it, very still, as though the bus is late by about ten years.\n\n"It isn’t coming," she says. "Not to here. But it goes somewhere. A morning that hasn’t happened. Would you like to see what this town becomes, if the night goes the way he wrote it?"',
    choices:[D_('“Show me.”',null,{now:()=>{ guiseSeen('busstop'); openTear('ash'); }}),D_('“Not yet.”','b1')]},
  b1:{speaker:'A woman at the bus stop',text:'"It will wait. Mornings are patient."',choices:[D_('[Leave.]',null)]},
}};
{ const st=SECTORS.street; const p=freeSpot(st,24.4,26.6,4)||[24.4,26.6];
  st.entities.push(npc_('flowerwoman',p[0],p[1],'flowerwoman','An old woman with marigolds',{h:1.62,face:Math.PI/2,flowerwoman:true,hidden:true}));
  const q=freeSpot(st,6.6,30,6)||[8,30];
  st.entities.push(npc_('busstop',q[0],q[1],'busstop','A woman at the bus stop',{h:1.78,face:0,busstop:true,hidden:true}),
    {kind:'prop',m:'pole',x:q[0]-.6,y:q[1]-.4,r:.08,h:2.4,busstop:true,hidden:true}); }
INV_UPDATES.push(()=>{ const F=S.flags, st=SECTORS.street;
  for(const e of st.entities){ if(e.flowerwoman) e.hidden=!(S.act===2&&!F.g_flowers);
    if(e.busstop) e.hidden=!(S.act>=2&&F.vigil_done&&!F.tear_ash_open&&!dimDone('ash')); } });

/* ── the deer, and the crow on the wire ───────────────────────────────── */
{ const r=SECTORS.reservoir; if(r) r.entities.push({kind:'prop',m:'deer',x:23.2,y:15.2,r:.2,h:1.5,gdeer:true,hidden:true,lit:.6}); }
{ const st=SECTORS.street; const p=freeSpot(st,44.5,27,5)||[44.5,27]; st.entities.push({kind:'prop',m:'crow',x:p[0],y:p[1],r:.05,h:.45,z:1.6,gwire:true,hidden:true,lit:.6}); }
INV_UPDATES.push(dt=>{ const F=S.flags;
  const r=SECTORS.reservoir, deer=r&&r.entities.find(e=>e.gdeer);
  if(deer){ deer.hidden=!(caseClosed('bell')||S.act>=2)||F.tear_drowned_open||dimDone('drowned');
    if(!deer.hidden&&S.sector===r&&Math.hypot(deer.x-S.px,deer.y-S.py)<3.4&&gQuiet()){ guiseSeen('deer'); F.tear_drowned_open=true;
      say('narr','A deer is standing at the edge of the water, dark as the water, looking at you with silver eyes. It lowers its head as if to drink, and where its muzzle touches the surface the air tears open, quietly, like old cloth.',5.4,{now:true});
      openTear('drowned',deer.x+.4,deer.y+1.6); later(2.5,()=>{ deer.hidden=true; dropFeatherAt(r,deer.x,deer.y+.8); }); } }
  const st=SECTORS.street, crow=st.entities.find(e=>e.gwire);
  if(crow){ crow.hidden=!(S.act>=3&&F.lily_done)||F.tear_nave_open||dimDone('nave');
    if(!crow.hidden&&S.sector===st&&Math.hypot(crow.x-S.px,crow.y-S.py)<4&&gQuiet()){ guiseSeen('wire'); F.tear_nave_open=true;
      say('narr','A crow on the wire above the church looks down at you, and you understand, without knowing how, that it has been waiting for you specifically. It drops something. Where it lands, the air turns inside out.',5,{now:true});
      openTear('nave',crow.x,crow.y+1.2); later(2.5,()=>{ crow.hidden=true; dropFeatherAt(st,crow.x,crow.y+.6); }); } } });

/* ── tears in the air ─────────────────────────────────────────────────── */
function openTear(dim,x,y){ const D=DIMS[dim]; if(!D) return; const home=D.home;
  S.flags['tear_'+dim+'_open']=true;
  const s=SECTORS[home.sector]; if(s.entities.some(e=>e.tear===dim&&!e.dead)) { if(dim==='ash') enterDim(dim); return; }
  const p=(x!==undefined)?(freeSpot(s,x,y,3)||[x,y]):(freeSpot(s,home.x,home.y,4)||[home.x,home.y]);
  s.entities.push({kind:'prop',m:'wormhole',x:p[0],y:p[1],r:.3,h:2.6,emit:1,lit:1,tear:dim,use:'tear',useName:`A tear in the air · ${D.name}`});
  sfx('tear'); S.glitchA=.4;
  if(dim==='ash') later(1.2,()=>enterDim('ash')); }
USES.tear=e=>{ const D=DIMS[e.tear];
  openMenu(D.name,D.blurb+(dimDone(e.tear)?'\n\nYou have already been. The tear is still here, and patient.':''),[
    {text:'[Step through.]',act:()=>enterDim(e.tear)},{text:'Not yet.'}]); };
