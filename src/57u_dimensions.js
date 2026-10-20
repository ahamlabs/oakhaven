/* ═══ The dimensions (1.7) ═════════════════════════════════════════════════
   Three places the Formless One opens for you, each with its own look, its
   own people, its own boss, and its own reward.

   I.   THE DROWNED YEAR · Wren’s Valley, October 1951 · sepia
        The valley before the dam. A congregation that fed the hunger under
        the crossroads with people nobody would miss: eleven names in a
        register, seven of them children. A man who beats his wife. Tonight
        the Congregation means to give their daughter to the Quiet.
        Boss: Reverend Silas Ashby, Who Listens.  Reward: Wren’s Cloak.
   II.  THE ASH MORNING · Oakhaven, 2031 · grey
        The morning after the night goes the way Chuck wrote it. Who is alive,
        and whose grave it is, depends on the brothers’ arcs and on Kevin.
        Boss: the Quiet King.  Reward: the Archangel’s blade, and the Ash-plate.
   III. THE INVERTED NAVE · nowhere · violet, half of it upside down
        Where the hunger keeps the voices of everything it has eaten.
        Boss: the Choir That Counts.  Reward: the Ring of Severance and the
        Mantle of Feathers, from the Formless One himself.

   Content: cult violence and ritual murder of children and women (recorded,
   never shown), and domestic abuse (spoken about, and confronted). */

/* ── looks ────────────────────────────────────────────────────────────── */
Object.assign(LOOKS,{
  amos:   {skin:[206,168,140], hair:{style:'short',col:[210,208,200]}, beard:[220,216,206], eyes:{col:[90,100,110]},
           top:{kind:'jacket',col:[90,74,52],underCol:[200,190,170],open:true}, legs:{kind:'slacks',col:[70,64,52]}, shoes:[50,40,30], hat:{kind:'cap',col:[60,54,44]}},
  margaret:{skin:[214,176,150], hair:{style:'bun',col:[110,74,44]}, eyes:{col:[90,100,110]}, lip:[150,100,96],
           top:{kind:'cardigan',col:[120,110,96],underCol:[210,200,180]}, legs:{kind:'skirt',col:[90,84,70],hose:[180,150,130]}, shoes:[60,44,34]},
  hannah: {skin:[220,184,156], hair:{style:'long',col:[150,104,60]}, eyes:{col:[90,110,130]}, lip:[170,110,104],
           top:{kind:'cardigan',col:[150,60,60],underCol:[226,220,206]}, legs:{kind:'skirt',col:[120,110,96],hose:[200,170,150]}, shoes:[60,40,30]},
  thomas: {skin:[200,160,130], hair:{style:'short',col:[70,54,40]}, eyes:{col:[60,60,60]},
           top:{kind:'suit',col:[50,46,42],underCol:[200,196,186],tie:[30,28,26]}, legs:{kind:'slacks',col:[44,40,36]}, shoes:[24,20,18]},
  ashby:  {skin:[214,184,160], hair:{style:'short',col:[190,186,180]}, eyes:{col:[70,76,90]}, lip:[140,96,96],
           top:{kind:'cassock',col:[22,20,22],long:53}, legs:{kind:'slacks',col:[20,20,22]}, shoes:[14,14,14], extras:['collar']},
  ashby_hunger:{skin:[176,150,140], hair:{style:'wild',col:[200,196,190]}, eyes:{kind:'black'}, lip:[70,30,30],
           top:{kind:'cassock',col:[18,14,16],long:53}, legs:{kind:'slacks',col:[16,14,14]}, shoes:[12,10,10], extras:['collar','smoke'], tint:[60,10,14], tintAmt:.3, claws:true},
  cultist:{skin:[200,170,150], hair:{style:'short',col:[80,70,60]}, eyes:{kind:'black'},
           top:{kind:'cassock',col:[150,140,120],long:53}, legs:{kind:'slacks',col:[120,110,96]}, shoes:[50,40,30], hat:{kind:'hood',col:[140,130,110]}, claws:true},
  valley1:{skin:[210,170,140], hair:{style:'short',col:[100,80,60]}, eyes:{}, top:{kind:'flannel',col:[120,90,60],col2:[60,50,40]}, legs:{kind:'jeans',col:[70,74,90]}, shoes:[60,44,30], hat:{kind:'cap',col:[90,80,60]}},
  valley2:{skin:[220,184,160], hair:{style:'bun',col:[130,100,70]}, eyes:{}, lip:[150,100,100], top:{kind:'cardigan',col:[140,120,100],underCol:[220,210,190]}, legs:{kind:'skirt',col:[100,90,80],hose:[190,160,140]}, shoes:[60,44,30]},
  kevin_old:{skin:[196,158,124], hair:{style:'messy',col:[150,150,150]}, eyes:{col:[34,26,22],glasses:[28,28,30]},
           top:{kind:'coat',col:[70,70,70],long:46}, legs:{kind:'cargo',col:[60,60,60]}, shoes:[50,50,50]},
  kevin_lost:{skin:[150,140,140], hair:{style:'messy',col:[160,160,160]}, eyes:{kind:'glow',col:[232,240,255]}, top:{kind:'coat',col:[60,60,62],long:46}, legs:{kind:'cargo',col:[50,50,52]}, shoes:[40,40,40], tint:[40,40,50], tintAmt:.25},
  tyler_old:{skin:[214,176,150], hair:{style:'curly',col:[120,80,44]}, beard:[110,76,44], stubble:true, eyes:{},
           top:{kind:'jacket',col:[70,72,60],underCol:[110,100,90],open:true}, legs:{kind:'cargo',col:[60,62,52]}, shoes:[40,36,30]},
  quietking:{skin:[150,144,140], hair:{style:'wild',col:[90,88,86]}, eyes:{kind:'glow',col:[250,246,240]},
           top:{kind:'coat',col:[60,58,60],long:53}, legs:{kind:'slacks',col:[40,40,42]}, shoes:[20,20,20], tint:[30,30,40], tintAmt:.35, claws:true, extras:['smoke']},
  choir:  {skin:[120,90,150], hair:{style:'veil',col:[20,10,40]}, eyes:{kind:'glow',col:[255,230,255]}, lip:[40,10,40],
           top:{kind:'nightgown',col:[60,30,90],long:53}, legs:{kind:'skirt',col:[60,30,90]}, shoes:[30,10,40], tint:[110,40,170], tintAmt:.4, emissive:true, outline:[20,0,30], extras:['smoke']},
  throat: {skin:[140,80,110], hair:{style:'bald',col:[60,20,40]}, eyes:{kind:'glow',col:[255,200,230]}, lip:[30,0,10],
           top:{kind:'hoodie',col:[80,30,60]}, legs:{kind:'slacks',col:[60,20,40]}, shoes:[30,10,20], tint:[120,30,90], tintAmt:.45, extras:['smoke']},
  archivist:{skin:[226,220,200], hair:{style:'veil',col:[230,224,206]}, eyes:{col:[60,60,70]}, lip:[150,140,130],
           top:{kind:'coat',col:[214,206,184],long:53}, legs:{kind:'slacks',col:[200,192,170]}, shoes:[160,150,130], extras:['smoke']},
});
Object.assign(SPEAKERS,{amos:{name:'Amos Wren',col:'#d8c8a0'},margaret:{name:'Margaret Hale',col:'#d8b8a0'},hannah:{name:'Hannah',col:'#e8c0b0'},
  thomas:{name:'Thomas Hale',col:'#a89888'},ashby:{name:'Reverend Ashby',col:'#c0b0a0'},kevin_old:{name:'Kevin, 2031',col:'#e2e8f4'},
  tyler_old:{name:'Tyler, 2031',col:'#c8c0a0'},archivist:{name:'The Archivist',col:'#e0d8c0'}});

/* ── the framework ────────────────────────────────────────────────────── */
const DIMS={};
function dimDone(k){ return !!S.flags['dim_'+k+'_done']; }
function enterDim(k){ const D=DIMS[k]; if(!D) return; if(S.driving) exitCar&&exitCar();
  S.dimReturn={sector:S.sector.id,x:S.px,y:S.py,a:S.angle}; S.flags['dim_'+k+'_seen']=true;
  sfx('tear'); S.glitchA=.8; S.shake=.5; S.transition=.7;
  enterSector(D.sector,SECTORS[D.sector].spawn.x,SECTORS[D.sector].spawn.y,SECTORS[D.sector].spawn.a);
  if(!S.flags['dim_'+k+'_arrived']){ S.flags['dim_'+k+'_arrived']=true; later(.8,()=>D.arrive&&D.arrive()); } }
function leaveDim(){ const r=S.dimReturn||{sector:'street',x:28,y:30,a:-Math.PI/2}; sfx('tear'); S.glitchA=.6; S.transition=.6;
  enterSector(r.sector,r.x,r.y,r.a); S.dimReturn=null; }
USES.tear_home=()=>openMenu('The way back','The tear you came through is still open, and on the other side it is still twenty to three in Oakhaven.',[{text:'[Go back.]',act:leaveDim},{text:'Not yet.'}]);
/* each place looks like itself */
const DIM_LOOK={};
function applyDimLook(){ const s=S.sector, L=DIM_LOOK[s.id]; try{ const w=document.getElementById('world'); if(w&&w.style&&!(typeof CHK!=='undefined'&&CHK.dur>0)) w.style.filter=L?L.css:''; }catch(e){}
  if(L){ S.skyOver=L.sky||S.skyOver; S.flipped=false; } else if(S.prevDim){ S.skyOver=null; S.flipped=false; }
  S.prevDim=!!L; if(typeof applyPreset==='function') applyPreset(S.preset); }
SECTOR_HOOKS.push((id,prev)=>{ if(DIM_LOOK[id]||DIM_LOOK[prev]) applyDimLook(); });
/* the Sudarshana's colour-drain hands the filter back to the place */
{ const was=chakraTick; chakraTick=function(dt){ const on=CHK.dur>0; was(dt); if(on&&CHK.dur<=0){ const L=DIM_LOOK[S.sector.id]; try{ const w=document.getElementById('world'); if(w&&w.style) w.style.filter=L?L.css:''; }catch(e){} } }; }

/* ── bosses ───────────────────────────────────────────────────────────── */
const elBoss=(()=>{ const d=document.createElement('div'); d.id='bossbar'; try{ d.innerHTML='<b></b><i><s></s></i>'; document.body&&document.body.appendChild&&document.body.appendChild(d); }catch(e){} return d; })();
function bossNow(){ return S.sector.entities.find(e=>e.boss&&!e.dead&&!e.hidden&&(e.state==='hunt'||e.awake)); }
INV_UPDATES.push(dt=>{ const b=bossNow();
  try{ if(b&&!S.cut){ elBoss.classList.add('on'); const n=elBoss.querySelector('b'), f=elBoss.querySelector('s'); if(n) n.textContent=b.bossName; if(f) f.style.width=Math.max(0,b.hp/b.maxHp*100)+'%'; } else elBoss.classList.remove('on'); }catch(e){}
  for(const e of S.sector.entities) if(e.boss&&!e.dead&&!e.hidden) BOSS_AI[e.boss]&&BOSS_AI[e.boss](e,dt); });
/* a boss can't be evicted by a rite or cut loose by the Ring in one stroke */
{ const was=killEnt; killEnt=function(e,how){ if(e.boss&&how==='exorcism'){ e.hp=Math.max(1,e.hp-180); e.stun=1.2; say('narr','It flinches. It doesn’t leave. It was invited.',3,{now:true}); return; } const r=was(e,how); if(e.boss&&e.dead&&BOSS_DIE[e.boss]) BOSS_DIE[e.boss](e); return r; }; }
{ const was=damageEnt; damageEnt=function(e,amount,src,ang){ if(e.choir&&e.shielded){ if(!e.shieldSaid||S.time-e.shieldSaid>6){ e.shieldSaid=S.time; say('narr','Your blow goes into a hundred voices and comes out the other side. Silence the throats first.',3.4,{now:true}); } return; } return was(e,amount,src,ang); }; }
/* a telegraphed shock: a red ring on the floor, then it lands */
function shock(e,r,dmg,warn=1.4){ e.shockT=warn; e.shockR=r; e.shockD=dmg; e.tele=1; sfxAt('teleE',e.x,e.y); }
function shockTick(e,dt){ if(!(e.shockT>0)) return false; e.shockT-=dt; e.moving=false;
  if(Math.random()<dt*40){ const a=Math.random()*Math.PI*2; spawnParts(e.x+Math.cos(a)*e.shockR,e.y+Math.sin(a)*e.shockR,.1,1,PCOL.sigil); }
  if(e.shockT<=0){ e.tele=0; S.shake=Math.max(S.shake,.6); sfx('thunder'); spawnParts(e.x,e.y,.4,40,PCOL.smoke,{up:.4});
    if(Math.hypot(S.px-e.x,S.py-e.y)<e.shockR&&!S.cut) hurtPlayer(e.shockD,e); }
  return true; }
const BOSS_AI={}, BOSS_DIE={};
/* guns go quiet near the Quiet King */
{ const was=fire; fire=function(){ const W=WEAPONS[S.weapon]; if(S.silenced>0&&W&&(W.kind==='hitscan'||W.kind==='projectile')){ if(S.cool<=0){ S.cool=.4; sfx('dry'); toast('Your gun makes no sound. Nothing comes out.'); } return; } return was(); }; }
INV_UPDATES.push(dt=>{ if(S.silenced>0) S.silenced=Math.max(0,S.silenced-dt); });
const enemy_=(look,x,y,o={})=>char_(look,x,y,Object.assign({kind:'enemy',etype:'demon',hp:90,maxHp:90,speed:1.5,dmg:11,reach:.95,sense:12,state:'idle',claws:true},o));

/* ═══ I · THE DROWNED YEAR ═════════════════════════════════════════════ */
{ const s=rmt('d_drowned','Wren’s Valley · October 1951',44,32,{region:'d_drowned',amb:.46,spawn:{x:8,y:27,a:-Math.PI/2},
    lights:[{x:21,y:6.5,p:1.2,f:.3},{x:32,y:8,p:1.6,f:.25},{x:9,y:11,p:1,f:.3}]});
  const g=s.grid; rect(g,1,16,42,17,',');                                       // the valley lane
  rect(g,6,4,12,9,'W');                                                         // the Hale house
  rect(g,20,3,22,4,'W');                                                        // the bell tower
  box(g,26,3,38,12,'C'); rect(g,27,4,37,11,'o'); g[12][32]='W';                 // the chapel; its door is shut (Thomas)
  rect(g,30,3,34,3,'X');                                                        // the window over the altar
  for(let x=2;x<=42;x++) if(x%7!==3) g[30][x]=' ';
  s.dimension=true; s.pois=[{x:32,y:13,name:'The chapel',kind:'note'},{x:9,y:10.5,name:'The Hale house',kind:'note'},{x:21,y:6.5,name:'The bell',kind:'note'}];
  s.entities=[
    {kind:'prop',m:'wormhole',x:5.5,y:28,r:.3,h:2.6,emit:1,lit:1,use:'tear_home',useName:'The way back'},
    npc_('amos',21,6.8,'amos','Amos Wren',{face:Math.PI/2}),
    npc_('margaret',9,10.8,'margaret','Margaret Hale',{face:Math.PI/2,h:1.68}),
    npc_('thomas',32,13.7,'thomas','Thomas Hale',{face:Math.PI/2,d1door:true}),
    char_('valley1',16,18.5,{kind:'walker',speed:.4,name:'A farmer',talk:'valley'}), char_('valley2',26,20,{kind:'walker',speed:.35,name:'A woman with a basket',talk:'valley2'}),
    {kind:'prop',m:'tree',x:4,y:13,r:.5,h:4.2},{kind:'prop',m:'tree',x:40,y:22,r:.5,h:4.2},{kind:'prop',m:'tree',x:17,y:25,r:.5,h:4.2},
    {kind:'prop',m:'bell',x:21,y:5.6,r:.3,h:1.2,z:1.7},
    use_('clipboard',30,9.2,'d_register','The Congregation’s register',{h:.3}),
    {kind:'prop',m:'altar',x:32,y:5.2,r:.6,h:1.1},{kind:'prop',m:'candle',x:30.8,y:5,r:.05,h:.4,emit:.8,lit:1},{kind:'prop',m:'candle',x:33.2,y:5,r:.05,h:.4,emit:.8,lit:1},
    use_('stones',40,8,'d_stones','Small stones behind the chapel',{h:.4}),
    char_('hannah',32,4.6,{kind:'actor',h:1.22,face:Math.PI/2,d1hannah:true,hidden:true}),
    enemy_('ashby',32,6.2,{boss:'ashby',bossName:'Reverend Silas Ashby, Who Listens',hp:900,maxHp:900,speed:1.1,dmg:16,reach:1.1,sense:14,h:1.95,hidden:true,freeLook:null}),
    pick_('rounds',14,27),pick_('shells',36,26)];
  addSector(s);
  DIM_LOOK.d_drowned={css:'sepia(.85) saturate(1.2) contrast(1.05) brightness(1.02)',sky:{top:[90,70,50],bot:[200,170,120],cloud:[160,140,110],clouds:.9,stars:false,moon:false}};
  TOWN_TALK.valley={1:['Dam closes next Thursday. The government man said we’ll all be compensated. For a valley. Compensated.','Pruitt boy went to live with an aunt in Medford. That’s what they said. Never wrote, though.','Reverend Ashby says the Quiet keeps the valley safe. My wife says don’t say the word out loud.'],
    2:['Dam closes next Thursday.']};
  TOWN_TALK.valley2={1:['Margaret Hale walks into doors a great deal, for a careful woman.','Amos rings that bell some nights for no reason. The Reverend says he’s touched.','There were the Lindell girls, and the Mosby boy, and Jane Keeler that went off to Portland. Nobody here writes letters, I suppose.'],
    2:['Margaret Hale walks into doors a great deal.']};
}
DIMS.drowned={name:'The Drowned Year',sector:'d_drowned',home:{sector:'reservoir',x:23,y:16.5},
  blurb:'On the other side of the tear it is a dry October afternoon in a valley that hasn’t been flooded yet. Somewhere in it a bell is ringing, the same bell, newer.',
  arrive(){ say('narr','Wren’s Valley, October 1951. The reservoir isn’t here yet. There is a lane, a chapel, a bell tower, a few houses, and a sky the colour of an old photograph. A week from now all of it will be under the water.',6,{now:true});
    later(6.4,()=>say(brother(),isDean()?'Sam. This is the reservoir. This is before.':'Dean. This is the valley. Before they flooded it.',3.4)); } };
NOTES.d_register=['The Congregation’s register','A ledger bound in black cloth, in a careful hand. “Given to the Quiet, that the valley be kept.” Eleven entries, 1938 to 1950. Seven of them are children: Peter Pruitt, 8. Ellen and Ruth Lindell, 7 and 10. Samuel Mosby, 11. Clara Voss, 6. Abel Dunn, 9. Mary Tate, 12. Four are women: Jane Keeler, Ada Pruitt, Lotte Brand, Sarah Ames. Every entry is signed S. Ashby. Every one is witnessed. The last line is dated tonight, and the name on it is Hannah Hale, 9.'];
USES.d_register=()=>{ S.flags.d1_register=true; addNote('d_register'); openMenu('The Congregation’s register',NOTES.d_register[1]+'\n\nYou read the names out loud, quietly, the way Sarah did at the vigil. It is the least you can do and you do it anyway.',[{text:'Close it.'}]);
  later(.6,()=>say(brother(),isDean()?'Seven kids. Sam, seven kids, and the whole valley pretending they went to Medford.':'They were children, Dean. They wrote them down like a grocery list.',4)); };
USES.d_stones=()=>{ S.flags.d1_stones=true; openMenu('Small stones','Behind the chapel, in the long grass, eleven flat stones in a row. No names. Seven of them are small enough to cover with your hand.\n\nNext week the water will close over them, and for seventy years nobody will know they were here.',[{text:'[Stand there a while.]'}]); };

DIALOGUE.amos={port:'amos',start:()=>S.flags.d1_won?(S.flags.d1_amos_end?'a9':'a5'):S.flags.d1_amos?'a4':'a0',nodes:{
  a0:{speaker:'Amos Wren',text:'An old man in a chore coat is sitting under the bell tower with the rope wound twice round his wrist, the way you found it, seventy years from now, round his bones.\n\n"You’re not from the valley," he says. "Nobody from the valley looks at me."',
    choices:[D_('“We’re from a long way off. Why do you ring the bell?”','a1'),D_('“What’s happening here tonight?”','a2')]},
  a1:{speaker:'Amos Wren',text:'"Because somebody should say it out loud. Every time the Congregation gives one to the Quiet, I ring it. Eleven times. The valley hears it and turns over in bed." He looks at the chapel. "Ashby says the Quiet keeps the floods off and the crops in. It’s kept them in, all right. It’s kept everybody in."',choices:[D_('“What’s happening tonight?”','a2')]},
  a2:{speaker:'Amos Wren',text:'"Tonight it’s the Hale girl. Hannah. Nine." He says it flatly, like a man who has said eleven names before. "Her father’s a deacon. He took her up to the chapel after supper. Her mother’s on the porch, and she’s not allowed off it. Thomas sees to that." He looks at his hands. "He sees to a great deal, with those."',
    choices:[D_('“Not tonight. Not her.”','a3',{flag:'d1_amos'}),D_('“Why hasn’t anyone stopped them?”','a3b',{flag:'d1_amos'})]},
  a3b:{speaker:'Amos Wren',text:'"Because it was always somebody else’s child. Because the Reverend was kind at funerals. Because it was easier to believe in aunts in Medford." He takes a breath. "Because I only ever rang a bell."',choices:[D_('“Not tonight.”','a3')]},
  a3:{speaker:'Amos Wren',text:'"Then go and see Margaret first. She knows where they keep the girl, and she’s the only one who has the right to say what happens to her. And read the register in the chapel window. You ought to know who you’re standing up for."',choices:[D_('[Go.]',null)]},
  a4:{speaker:'Amos Wren',text:'"Margaret. Then the chapel. I’ll be at the rope."',choices:[D_('[Go.]',null)]},
  a5:{speaker:'Amos Wren',text:()=>`He’s already at the rope when you come back, Hannah asleep on his coat in the grass with her mother beside her.\n\n"I’m going to ring it," he says. "Twelve. So the valley knows the last one came home."`,
    choices:[D_('“Amos. The dam closes on Thursday. When the water comes, don’t be here. Get out of the valley.”','a6'),D_('“Ring it.”','a7')]},
  a6:{speaker:'Amos Wren',text:'He looks at you for a long time, and you understand that he has known about Thursday for a while.\n\n"And who rings it, then? When the water comes, somebody should say it out loud." He smiles. "You came a long way to tell me something I already decided. That’s kind. Take this. It kept me dry for forty years, and I don’t believe I’ll be needing dry."',
    choices:[D_('[Take the cloak.]','a8',{now:()=>{ S.flags.d1_told_amos=true; }})]},
  a7:{speaker:'Amos Wren',text:'He rings it twelve times. The whole valley hears it. Doors open up and down the lane. He takes off his oilskin cloak and holds it out. "For the next valley," he says. "There’s always a next one."',
    choices:[D_('[Take the cloak.]','a8')]},
  a8:{speaker:'—',port:null,text:'Wren’s Cloak: waxed canvas, still wet from 1951. The dead will find you harder to hold.',choices:[D_('[…]',null,{flag:'d1_amos_end',now:()=>{ giveGear('wrencloak'); S.ammo.rounds+=18; dimFinish('drowned'); }})]},
  a9:{speaker:'Amos Wren',text:'"Go home," he says. "Somebody there is ringing for you."',choices:[D_('[Go.]',null)]},
}};
DIALOGUE.margaret={port:'margaret',start:()=>S.flags.d1_won?'m9':S.flags.d1_margaret?'m6':'m0',nodes:{
  m0:{speaker:'Margaret Hale',text:'A woman on a porch, very straight, with her hands folded. She has a bruise along her jaw she has tried to powder over, and another on her wrist she hasn’t bothered to.\n\n"If you’re from the Congregation, Thomas says I’m to stay inside. If you’re not, you shouldn’t be here."',
    choices:[D_(isDean()?'[Gently.] “We’re not from anybody. Is Hannah up at the chapel?”':'“We’re not with them. Margaret, where’s Hannah?”','m1'),D_('“Who did that to your face?”','m2')]},
  m1:{speaker:'Margaret Hale',text:'Something goes out of her shoulders. "Since supper. Thomas said she was to be ‘given to the Quiet’ and I said—" She stops. "I said no. That’s why the jaw. He’s at the chapel door. He’ll let nobody in, and I mean nobody."',
    choices:[D_('“Then we’ll go in anyway.”','m3'),D_('“Has he hurt you before tonight?”','m2')]},
  m2:{speaker:'Margaret Hale',text:()=>`She looks at you as if nobody has ever asked her that in a voice that expected an answer.\n\n"I walk into doors," she says. "That’s what the valley says. Eleven years of doors." A pause. "The worst of it is Hannah’s learned to be quiet when he comes in. Nine years old and she already knows how to make herself small."${isDean()?'\n\nSomething in your chest knows exactly what that looks like. You don’t say so.':''}`,
    choices:[D_('“It isn’t your fault. None of it.”','m3',{now:()=>{ S.flags.d1_trust=(S.flags.d1_trust||0)+1; }}),D_('“When this is over, you and Hannah leave. Tonight. We’ll see to it.”','m3',{now:()=>{ S.flags.d1_trust=(S.flags.d1_trust||0)+1; S.flags.d1_promise=true; }})]},
  m3:{speaker:'Margaret Hale',text:'"I’m coming with you," she says. "To the door. I’ve been on this porch for eleven years. I’m not going to be on it while they—" She doesn’t finish. She doesn’t need to.',
    choices:[D_('“Stay behind us.”',null,{flag:'d1_margaret',now:()=>{ const s=SECTORS.d_drowned, m=s.entities.find(e=>e.look==='margaret'); if(m){ m.x=30.2; m.y=14.2; m.face=-Math.PI/2; } }})]},
  m6:{speaker:'Margaret Hale',text:'"The door," she says. "He’s at the door."',choices:[D_('[Go.]',null)]},
  m9:{speaker:'Margaret Hale',text:()=>`Hannah is holding her mother’s hand and won’t let go of it, and Margaret doesn’t want her to.\n\n"There’s a bus to Portland on Monday. Amos has a sister there." She looks at you both. "I don’t know where you came from. Thank you for coming the long way."${S.flags.d1_spoke?'\n\n"I said it to his face," she adds, almost to herself. "Eleven years. I said it."':''}`,
    choices:[D_('“Go and be somewhere loud.”',null)]},
}};
DIALOGUE.thomas={port:'thomas',start:()=>S.flags.d1_door?'t9':'t0',nodes:{
  t0:{speaker:'Thomas Hale',text:'A man in his Sunday suit, standing in front of the chapel door with his arms folded. Big hands. Clean fingernails.\n\n"Congregation only. Whatever you’re selling, the valley doesn’t want it."',
    choices:[D_('[Hit him.]','t1',null,isDean),D_('“Step aside. There are two of us, and we have done worse than you on a slow night.”','t2'),
             D_('[Stand back, and let Margaret speak.]','t3',null,()=>S.flags.d1_margaret&&(S.flags.d1_trust||0)>=1),
             D_('“Your daughter is in there.”','t4')]},
  t1:{speaker:'—',port:null,text:'One punch. He goes down on the step and stays there, blinking, a man who has never once been on this side of it.\n\nBehind you, Margaret flinches at the sound, and you see Hannah’s whole childhood in that flinch.',
    choices:[D_('[Open the door.]',null,{now:()=>{ S.flags.d1_hit=true; d1Open(); }})]},
  t2:{speaker:'Thomas Hale',text:'He looks from one of you to the other and does the arithmetic men like him are very good at. He steps aside.',choices:[D_('[Open the door.]',null,{now:()=>{ S.flags.d1_threat=true; d1Open(); }})]},
  t3:{speaker:'Margaret Hale',port:'margaret',text:'Margaret walks past you and stands in front of her husband, close enough that he could, and he doesn’t.\n\n"I’m taking Hannah," she says. "Tonight. And I am not coming back to this house, and you are not going to stop me, because these two men are standing behind me and because I am finished being quiet." Her voice shakes on the last word and doesn’t break.\n\nThomas Hale opens his mouth. Nothing comes out. He moves away from the door like a man who has been told the house is on fire.',
    choices:[D_('[Open the door.]',null,{now:()=>{ S.flags.d1_spoke=true; S.flags.d1_trust=(S.flags.d1_trust||0)+1; d1Open(); }})]},
  t4:{speaker:'Thomas Hale',text:'"She’s been chosen," he says, and for a second you see that he is frightened too, and that he has decided being frightened is someone else’s fault. "It’s an honour. The Reverend says—"',choices:[D_('[…]','t0')]},
  t9:{speaker:'Thomas Hale',text:'He won’t look at you.',choices:[D_('[Leave him.]',null)]},
}};
function d1Open(){ const s=SECTORS.d_drowned; s.grid[12][32]='o'; pack(s); S.flags.d1_door=true;
  const t=s.entities.find(e=>e.d1door); if(t){ t.x=35.5; t.y=14.2; t.face=Math.PI; }
  const a=s.entities.find(e=>e.boss==='ashby'); if(a){ a.hidden=false; a.state='idle'; }
  const h=s.entities.find(e=>e.d1hannah); if(h) h.hidden=false;
  for(const [x,y] of [[29,8],[35,8],[28.5,10.5],[35.5,10.5]]) s.entities.push(enemy_('cultist',x,y,{hp:80,maxHp:80,speed:1.35,freeLook:'valley1',state:'hunt',d1cult:true}));
  later(1,()=>say('narr','Inside, the Congregation is on its knees in the pews, hoods up. At the altar a man in a cassock has his hand on a little girl’s shoulder. He turns round. He is smiling the way people smile at funerals.',5,{now:true}));
  later(5.6,()=>say('ashby','You’ve come to the service. How good. The Quiet is always listening, you know. It has been listening to this valley for a very long time.',5)); }
BOSS_AI.ashby=(e,dt)=>{ if(e.state!=='hunt') return;
  if(shockTick(e,dt)) return;
  e.litT=(e.litT??5)-dt; if(e.litT<=0){ e.litT=6.5; shock(e,4.4,16); say('ashby',['Give it what it asks for.','The Quiet hears you.','Be still. Be still.'][(Math.random()*3)|0],2); }
  if(!e.ph1&&e.hp<e.maxHp*.66){ e.ph1=true; e.look='ashby_hunger'; S.glitchA=.5; say('narr','His face goes out like a lamp. What’s left in the cassock is something that has been listening under the valley since before there was a valley.',4.4,{now:true}); d1Adds(); }
  if(!e.ph2&&e.hp<e.maxHp*.33){ e.ph2=true; d1Adds(); e.speed=1.5; } };
function d1Adds(){ const s=SECTORS.d_drowned; for(const [x,y] of [[28.5,6],[35.5,6]]) s.entities.push(enemy_('cultist',x,y,{hp:70,maxHp:70,freeLook:'valley2',state:'hunt',d1cult:true})); }
BOSS_DIE.ashby=e=>{ const s=SECTORS.d_drowned; S.flags.d1_won=true; spawnParts(e.x,e.y,1,50,PCOL.smoke,{up:2.4}); sfx('bell');
  for(const c of s.entities) if(c.d1cult&&!c.dead) killEnt(c,'exorcism');
  const h=s.entities.find(x=>x.d1hannah); const m=s.entities.find(x=>x.look==='margaret');
  say('narr','The thing in the cassock comes apart into a cold that smells of river mud, and goes down through the floor, and doesn’t come up. The hooded ones pull their hoods back and look at each other as if they have just woken up in church.',6,{now:true});
  later(6.4,()=>{ if(h){ h.x=31.2; h.y=12.6; h.face=Math.PI/2; } if(m){ m.x=32.2; m.y=13; m.face=-Math.PI/2; }
    say('narr','Hannah walks down the aisle on her own, very carefully, and out of the door, and into her mother, and neither of them makes a sound for a long time. Then Hannah says, quite loudly, "Can we go now?" and Margaret laughs.',6.4); });
  later(13,()=>say(brother(),isDean()?'Amos. We should go tell Amos.':'Go and tell Amos, Dean. He’ll want to ring it.',3)); };

/* ═══ II · THE ASH MORNING ═════════════════════════════════════════════ */
{ const s=rmt('d_ash','Oakhaven · a morning in 2031',40,30,{region:'d_ash',amb:.4,spawn:{x:6,y:26,a:-Math.PI/2},lights:[{x:20,y:10,p:1.4,f:.3},{x:10,y:8,p:.9,f:.35}]});
  const g=s.grid; rect(g,1,14,38,15,'.');
  rect(g,3,3,9,8,'#'); g[8][6]=' '; rect(g,4,4,8,7,'o');                       // what's left of the library
  rect(g,26,3,34,9,'#'); rect(g,13,20,18,25,'W'); rect(g,28,20,34,25,'#');
  for(const [x,y] of [[20,6],[22,10],[15,9]]) g[y][x]='#';
  s.dimension=true; s.pois=[{x:6,y:9,name:'The library',kind:'note'},{x:20,y:12,name:'The church steps',kind:'note'}];
  s.entities=[
    {kind:'prop',m:'wormhole',x:3.5,y:27,r:.3,h:2.6,emit:1,lit:1,use:'tear_home',useName:'The way back'},
    {kind:'prop',car:'sedan_black',name:'The Impala (rusted)',x:11,y:17,r:.75,h:1.45,face:.4,ashcar:true,use:'d2_car',useName:'The Impala, rusted to the rims'},
    use_('cross',24,18,'d2_graves','Graves by the church steps',{h:.8}),
    use_('clipboard',6.2,5.2,'d2_journal','A notebook in your own handwriting',{h:.3}),
    npc_('tyler_old',7,10.2,'tyler2031','Tyler, 2031',{face:Math.PI/2}),
    npc_('kevin_old',5.2,5.6,'kevin2031','Kevin',{face:Math.PI/2,kev2031:true}),
    {kind:'prop',m:'fire',x:8.2,y:11,r:.2,h:.8,emit:1,lit:1},
    char_('husk_worker',25,12,{kind:'enemy',etype:'eldritch',hp:120,maxHp:120,speed:1.2,dmg:12,reach:.95,sense:12,state:'idle'}),
    char_('husk_rain',31,13,{kind:'enemy',etype:'eldritch',hp:120,maxHp:120,speed:1.2,dmg:12,reach:.95,sense:12,state:'idle'}),
    char_('quietking',20,8.5,{kind:'enemy',etype:'eldritch',boss:'king',bossName:'The Quiet King',hp:1300,maxHp:1300,speed:.9,dmg:20,reach:1.4,sense:15,h:2.9,state:'idle',hidden:true}),
    pick_('shells',30,27),pick_('battery',16,27),pick_('rounds',36,16)];
  addSector(s);
  DIM_LOOK.d_ash={css:'grayscale(.9) contrast(1.15) brightness(.88)',sky:{top:[70,70,72],bot:[150,146,140],cloud:[110,108,106],clouds:1.4,stars:false,moon:false}};
}
DIMS.ash={name:'The Ash Morning',sector:'d_ash',home:{sector:'street',x:8,y:30},
  blurb:'On the other side it is morning in Oakhaven, years from now, and it is snowing ash.',
  arrive(){ say('narr','Oakhaven, years from now. It is morning, the first one in a long time, and it is snowing ash. Nothing moves on Main Street that you would want to move.',5.4,{now:true});
    later(5.8,()=>say(brother(),isDean()?'This is what happens if we lose. Isn’t it.':'Dean. I think this is what happens if we do it his way.',3.4)); } };
const kevinFate=()=>S.flags.kevin_used?'used':'rested';
DIALOGUE.kevin2031={port:'kevin_old',start:()=>kevinFate()==='used'?'u0':'r0',nodes:{
  r0:{speaker:'Kevin, 2031',text:()=>`Kevin is older. Grey at the temples, glasses taped, a coat that used to be somebody else’s. He looks up from a stack of books he’s been reading by firelight, and his face does something complicated.\n\n"You’re not real," he says. "You’re a— no. No, you’re real. You came the long way." He stands up. "I’m keeping six people alive in what’s left of the library. I read them stories at night. It turns out that’s most of what a prophet is for."`,
    choices:[D_('“What happened here, Kevin?”','r1'),D_('“How do we stop it?”','r2')]},
  r1:{speaker:'Kevin, 2031',text:()=>`"You did it his way." He says it without blame. "${together()?'You both went in. Neither of you came out. Nobody saw it, so I like to think you’re still driving somewhere.':arcOf('dl')<arcOf('sa')?'Dean wouldn’t stop. Wouldn’t listen. Carried it all into the church himself and it ate him slow.':'Sam took it into himself, the way Chuck wanted. Saved everyone. Kept nothing.'}" He looks at the ash. "The town went quiet a week later. Then the next town."`,choices:[D_('“How do we stop it?”','r2')]},
  r2:{speaker:'Kevin, 2031',text:'"There’s a thing on the church steps that the husks call the King. It isn’t a king. It’s just the biggest quiet. When it’s gone, the morning comes, for a while." He pushes his glasses up. "Kill it with something sharp. Guns don’t work near it. Nothing that makes a sound does."',choices:[D_('[Go.]',null,{now:d2Wake})]},
  u0:{speaker:'Kevin',port:'kevin_lost',text:'Kevin is at a desk in the ruins with his back to you, typing on a keyboard that isn’t connected to anything. Light comes out of his eyes like a broken lamp. He doesn’t turn round.\n\nOn the screen: HELLO. I KNEW YOU WOULD COME. I TYPED IT IN 2019.',
    choices:[D_('“Kevin. It’s us.”','u1')]},
  u1:{speaker:'Kevin',port:'kevin_lost',text:'On the screen: I KNOW. THEY USED ME UNTIL THERE WAS NOTHING LEFT TO USE. THAT IS NOT YOUR FAULT. IT IS A LITTLE BIT YOUR FAULT.\n\nHE IS ON THE CHURCH STEPS. THE QUIET ONE. SHARP THINGS. NOT GUNS.\n\nWHEN YOU GO BACK, LET ME SLEEP.',
    choices:[D_('“We will.”',null,{now:()=>{ S.flags.d2_kevin_plea=true; d2Wake(); }})]},
}};
DIALOGUE.tyler2031={port:'tyler_old',start:()=>S.flags.d2_won?'y5':'y0',nodes:{
  y0:{speaker:'Tyler, 2031',text:'A man in his twenties with a rifle and a beard he grew because there was no reason not to. It takes you a second. It’s the kid from Main Street. The one who said you didn’t look like cops.\n\n"You still don’t look like cops," he says. "You look exactly the same. That’s worse."',
    choices:[D_('“What happened to everyone?”','y1'),D_('“Stay here. We’ll deal with the thing on the steps.”',null,{now:d2Wake})]},
  y1:{speaker:'Tyler, 2031',text:'"They went quiet. My mom first. Then everyone." He checks the rifle, which has no rounds in it. "We made armour out of car doors. It works better than you’d think. If you kill that thing, I’ll give you the good set."',choices:[D_('“Deal.”',null,{now:d2Wake})]},
  y5:{speaker:'Tyler, 2031',text:'"The good set," he says, and hands it over. It’s made from the Impala’s doors. Somebody has painted LIGHTS ON across the chest plate. "Go back. Do it differently. Tell my mom to keep talking to me, even if I don’t answer."',
    choices:[D_('[Take the Ash-plate.]',null,{now:()=>{ giveGear('ashplate'); S.flags.d2_plate=true; d2Check(); }})]},
}};
USES.d2_graves=()=>{ S.flags.d2_graves=true; const t=together();
  openMenu('By the church steps',t?'Two chairs by a dead campfire, facing the road out of town. No graves. Someone has written on the steps in chalk: THEY DROVE OFF TOGETHER. NOBODY SAW THEM DIE.':
    arcOf('dl')<arcOf('sa')?`A cross made of mill planks. Painted on it: ${NAMES.dean.toUpperCase()} ${NAMES.family.toUpperCase()}. HE DIDN’T STOP.\n\nUnderneath, smaller, in a different hand: he never once asked anybody to help him carry it.`:
    `A cross made of mill planks. Painted on it: ${NAMES.sam.toUpperCase()} ${NAMES.family.toUpperCase()}. HE TOOK IT ALL IN.\n\nUnderneath, smaller, in a different hand: we would have helped. he didn’t let us.`,[{text:'[…]'}]);
  later(.5,()=>say(brother(),t?'Together. Huh. I can live with that version.':'That’s not happening. You hear me? That is not happening.',3.4)); };
USES.d2_journal=()=>{ S.flags.d2_journal=true; openMenu('Your handwriting','A notebook in your own handwriting, from a night that hasn’t happened to you yet:\n\n“If you are reading this you came the long way. Listen. The thing you’re about to do alone, don’t. I did. Look around.”\n\nThe last page is just your brother’s name, written over and over, as if someone was trying to remember how it was spelled.',[{text:'Close it.'}]);
  arc(S.hero==='dean'?'dl':'sa',1); };
USES.d2_car=()=>openMenu('The Impala','Rusted to the rims. The tape deck still has a tape in it. You press play, out of habit, and it plays: four bars of something you love, and then nothing, and then somebody breathing.',[{text:'Step back.'}]);
function d2Wake(){ const s=SECTORS.d_ash, k=s.entities.find(e=>e.boss==='king'); if(k&&k.hidden){ k.hidden=false; k.state='hunt'; say('narr','On the church steps, something very large stands up out of the ash, and the morning goes perfectly, absolutely silent.',4.4,{now:true}); S.silenced=3; } }
BOSS_AI.king=(e,dt)=>{ if(e.state!=='hunt') return; if(shockTick(e,dt)) return;
  e.silT=(e.silT??4)-dt; if(e.silT<=0){ e.silT=10; S.silenced=3.4; sfx('hum'); toast('The Quiet · guns are silent'); }
  e.slamT=(e.slamT??6)-dt; if(e.slamT<=0){ e.slamT=7; shock(e,4.8,22,1.5); }
  if(!e.ph1&&e.hp<e.maxHp*.5){ e.ph1=true; const s=SECTORS.d_ash; for(const [x,y] of [[16,8],[24,8]]) s.entities.push(char_('husk_teen',x,y,{kind:'enemy',etype:'eldritch',hp:110,maxHp:110,speed:1.3,dmg:12,reach:.95,sense:14,state:'hunt'})); } };
BOSS_DIE.king=e=>{ S.flags.d2_won=true; S.silenced=0; spawnParts(e.x,e.y,1.4,60,PCOL.smoke,{up:2.6}); sfx('bell');
  const s=SECTORS.d_ash; s.entities.push({kind:'prop',m:'wormhole',x:e.x,y:e.y+1,r:.05,h:.01,hidden:true});
  say('narr','The Quiet King falls into the ash the way a building falls: slowly, then all at once. Where it lay there is a sword driven point-down into the steps, golden, humming, too long for a man. It belonged to something that lost here, before you.',6,{now:true});
  later(.5,()=>s.entities.push(use_('cross',e.x,e.y+1.2,'d2_blade','A golden blade in the ash',{h:1.4,emit:.6,lit:1}))); };
USES.d2_blade=e=>{ e.dead=true; giveWeapon('archangel','left in the ash'); S.flags.d2_blade=true; d2Check(); };
function d2Check(){ if(S.flags.d2_blade&&S.flags.d2_plate) dimFinish('ash'); }

/* ═══ III · THE INVERTED NAVE ═════════════════════════════════════════ */
{ const s=rmt('d_nave','The Inverted Nave',30,32,{region:'d_nave',amb:.34,outdoor:false,floor:'v',wall:'X',spawn:{x:15,y:29,a:-Math.PI/2},
    lights:[{x:15,y:8,p:1.8,f:.2},{x:15,y:20,p:1.2,f:.3}]});
  const g=s.grid; for(const y of [6,11,16,21,26]) for(const x of [7,23]) g[y][x]='C';
  rect(g,1,1,28,2,'C'); s.ceilH=2.2;
  s.dimension=true; s.pois=[{x:15,y:6,name:'The Choir',kind:'note'}];
  s.entities=[
    {kind:'prop',m:'wormhole',x:15,y:30.4,r:.3,h:2.6,emit:1,lit:1,use:'tear_home',useName:'The way back'},
    npc_('archivist',11,26,'archivist','The Archivist',{face:-Math.PI/2}),
    char_('choir',15,5.5,{kind:'enemy',etype:'eldritch',boss:'choir',bossName:'The Choir That Counts',hp:1100,maxHp:1100,speed:0,dmg:14,reach:1.6,sense:30,h:3.3,state:'idle',stationary:true,choir:true,shielded:true,awake:false}),
    ...[[8,9],[22,9],[8,15],[22,15]].map(([x,y],i)=>char_('throat',x,y,{kind:'enemy',etype:'eldritch',hp:90,maxHp:90,speed:0,dmg:10,reach:1.2,sense:20,h:1.6,state:'idle',stationary:true,throat:i})),
    {kind:'prop',m:'candle',x:12,y:24,r:.05,h:.4,emit:.8,lit:1},{kind:'prop',m:'candle',x:18,y:24,r:.05,h:.4,emit:.8,lit:1},
    pick_('holywater',4,28),pick_('flares',26,28)];
  addSector(s);
  DIM_LOOK.d_nave={css:'hue-rotate(235deg) saturate(1.5) contrast(1.15)'};
}
DIMS.nave={name:'The Inverted Nave',sector:'d_nave',home:{sector:'street',x:44.5,y:28},
  blurb:'On the other side there is a church, or the inside of the idea of one, and half of it is upside down. Something in it is counting.',
  arrive(){ say('narr','A nave with no outside. The far half of it hangs upside down over the near half like a reflection that has stopped agreeing with you. Something at the altar end is counting, in a great many voices, very slowly, toward zero.',6,{now:true}); } };
/* the far half is upside down */
INV_UPDATES.push(()=>{ if(S.sector.id!=='d_nave') return; const inF=S.py<16; if(inF!==!!S.flipped){ S.flipped=inF; S.glitchA=.4; sfx('flesh'); } });
DIALOGUE.archivist={port:'archivist',start:()=>S.flags.d3_won?'z5':'z0',nodes:{
  z0:{speaker:'The Archivist',text:'A tall shape made of pages, written on both sides in every hand you have ever seen, including yours. It is filing something away in the air.\n\n"Visitors. How irregular." It turns a page that is also its face. "You will want to know where you are. You are in the place where the hunger under your crossroads keeps what it has eaten. Not the bodies. The voices."',
    choices:[D_('“Whose voices?”','z1'),D_('“Who are you?”','z2')]},
  z1:{speaker:'The Archivist',text:()=>`"Everyone it was ever given. The mill men. The ones from your Lily’s year.${S.flags.d1_register?' Eleven from a valley register, seven of them very small.':''} It made a choir of them. It has them count down, over and over, and at zero it eats a little more of whatever is nearest." A rustle. "The throats are what hold the voices in. Silence the throats and the Choir can be ended. The voices will go wherever voices go."`,
    choices:[D_('“Then we end it.”',null,{now:d3Wake})]},
  z2:{speaker:'The Archivist',text:'"A clerk. I keep the records of things that should not have happened. There are a great many towns like yours, and a great many valleys. I am behind on all of them." It considers you. "The one who opened the way for you keeps no records at all. He doesn’t need to. Everything that has ever happened is simply there, for him, at once. I find that very restful to think about."',choices:[D_('“Whose voices are counting?”','z1')]},
  z5:{speaker:'The Archivist',text:'"Filed," it says, with something like satisfaction. "Under: freed."',choices:[D_('[Leave it to its work.]',null)]},
}};
function d3Wake(){ const s=SECTORS.d_nave; for(const e of s.entities) if(e.throat!==undefined||e.choir){ e.state='hunt'; e.awake=true; } S.flags.d3_awake=true; }
BOSS_AI.choir=(e,dt)=>{ if(!e.awake) return; const s=SECTORS.d_nave, throats=s.entities.filter(t=>t.throat!==undefined&&!t.dead);
  if(e.shielded&&!throats.length){ e.shielded=false; S.flash=.5; sfx('riteEnd'); say('narr','The last throat goes silent and the Choir’s count falters. For the first time, it is only one voice. It sounds very young and very tired.',4.6,{now:true}); }
  e.countT=(e.countT??1.6)-dt; if(e.countT<=0){ e.countT=1.6; e.count=(e.count??8)-1;
    if(e.count>0){ say('whisper',String(e.count),1.2,{now:true}); sfx('bell'); }
    else { e.count=8; S.flash=.7; S.shake=.9; sfx('thunder'); const dmg=e.shielded?24:12; if(!S.cut) hurtPlayer(dmg,e); say('narr',e.shielded?'ZERO. Everything in the nave screams at once, and some of it is you.':'Zero, it says, very quietly, and it hurts less.',3,{now:true}); } } };
BOSS_DIE.choir=e=>{ S.flags.d3_won=true; sfx('bell'); S.flipped=false;
  for(let i=0;i<14;i++) later(i*.35,()=>spawnParts(15+(Math.random()-.5)*8,6+(Math.random()-.5)*4,1.6,6,PCOL.holy,{up:3}));
  say('narr',`The Choir stops counting. One by one the voices go up out of it like sparks off a fire, small and many, and the nave is very quiet, the good kind.${S.flags.d1_register?' You count eleven of them that are smaller than the rest.':''}`,6,{now:true});
  later(6.6,()=>{ const s=SECTORS.d_nave; const p=freeSpot(s,15,9,3)||[15,9]; s.entities.push(npc_('formless',p[0],p[1],'formless_nave',S.flags.tg_named?NAMES.god:'Someone',{face:Math.PI/2,h:1.86})); S.flipped=false;
    say('narr','Someone is standing where the Choir was. Midnight-blue skin, black robes stitched with silver. He has been there the whole time.',4.4); }); };
DIALOGUE.formless_nave={port:'formless',start:()=>S.flags.d3_gift?'n9':'n0',nodes:{
  n0:{speaker:'—',port:'formless',text:()=>`He is looking at the place where the voices went, with an expression you can only call appreciation.\n\n"That was beautifully done," he says. "Not efficiently. Beautifully. You let them go one at a time, which is the only way to let anything go."\n\nHe holds out his open hand. Above it a ring of black and silver turns, blades within blades, never touching.`,
    choices:[D_('“What is it?”','n1'),D_('“Why are you helping us?”','n2')]},
  n1:{speaker:'—',port:'formless',text:'"It cuts what holds. A possession, an enchantment, a lie someone has wrapped round you. It cuts those before it cuts anything else, and usually it doesn’t need to cut anything else." He tips his hand, and the ring is above yours instead. "Use it when you would rather not. That is when it works best."',
    choices:[D_('[Take it.]','n3')]},
  n2:{speaker:'—',port:'formless',text:'"I am not helping you. I am removing a few obstacles that were never fair, so that the choice at the end is actually yours." A pause. "You may call that help, if it makes the drive home easier."',choices:[D_('“What is it you’re holding?”','n1')]},
  n3:{speaker:'—',port:'formless',text:'He unclasps the mantle of black feathers from his own shoulders and puts it round yours, the way you would put a coat round someone who has been out in the rain.\n\n"And this, because it is cold where you are going." He steps back. "I did not save them. You did that. I would like you to remember the difference."',
    choices:[D_('[…]',null,{flag:'d3_gift',now:()=>{ giveWeapon('ring','the Formless One'); giveGear('mantle'); dimFinish('nave'); later(1,()=>{ const s=SECTORS.d_nave, f=s.entities.find(e=>e.look==='formless'); if(f){ f.hidden=true; dropFeatherAt(s,f.x,f.y); } }); }})]},
  n9:{speaker:'—',port:null,text:'There is no one there. There is a dark feather on the floor.',choices:[D_('[…]',null)]},
}};

/* ── finishing a dimension: the present remembers ─────────────────────── */
function dimFinish(k){ if(S.flags['dim_'+k+'_done']) return; S.flags['dim_'+k+'_done']=true;
  const D=DIMS[k]; toast(`${D.name} · done · the way back is open`);
  if(k==='drowned') later(20,()=>msg('marla',`a letter came for you. addressed to “the two men who came to the valley in 1951”. it’s from a Hannah ${S.flags.d1_spoke?'Hale':'Hale'} Wren, 84, in Portland. she says thank you. she says her mother lived to 91 and never walked into a door again`));
  if(k==='ash') later(20,()=>msg('kevin',S.flags.d2_kevin_plea?'weird dream. i was old and i asked you to let me sleep. if that means anything. i would like to sleep':'weird dream. i was old and i was reading to people in the library. it was nice actually. is that a prophet thing'));
  if(k==='nave') later(20,()=>msg('marla','the night shift sign-in book signed itself again. different this time. it just says THANK YOU in a lot of handwriting'));
  inv_().bond=(inv_().bond||0)+(k==='ash'?1:0); }
{ const was=epilogue; epilogue=function(k){ const E=was(k); if(k==='D') return E; const F=S.flags;
    if(F.dim_drowned_done) E.lines.push(F.d1_spoke?'In Portland there is a retired schoolteacher called Hannah who tells her students one thing above all: say it out loud. Her mother said it to a man’s face in 1951, and it was the bravest thing she ever saw.':'In Portland there is a retired schoolteacher called Hannah who rings a little brass bell at the end of every school day, twelve times, and won’t say why.');
    if(F.dim_ash_done) E.lines.push('The Ash Morning never came. Somewhere in Oakhaven, a grown man named Tyler has a chest plate he made in a dream, and keeps it in his closet, and doesn’t know why he cries when he sees it.');
    if(F.dim_nave_done) E.lines.push('The Choir is gone. Seventy-odd voices, more or less, went wherever voices go. The Archivist filed them under: freed.');
    return E; }; }
/* the Formless One admits to his guises at the altar */
{ const n=DIALOGUE.chuck_end&&DIALOGUE.chuck_end.nodes.gA11; if(n){ const t=n.text; n.text=()=>{ const base=typeof t==='function'?t():t, G=inv_().guises||{}, k=Object.keys(G);
    if(!k.length) return base; const parts=[]; if(G.dog) parts.push('the dog'); if(G.crow||G.wire) parts.push('the crow'); if(G.wind) parts.push('the wind on Main Street'); if(G.flowers) parts.push('the woman with the marigolds'); if(G.deer) parts.push('the deer at the water'); if(G.busstop) parts.push('the woman at the bus stop');
    return base+`\n\n"And ${parts.join(', ').replace(/, ([^,]*)$/,' and $1')}," he adds. "Yes. That was me.${G.crow||G.wire?' I am sorry about the crow. It was the only thing nearby with hands enough.':''}"`; }; } }
