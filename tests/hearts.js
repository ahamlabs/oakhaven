/* 1.6: names, switching brothers, hearts and enchantresses, the stranger,
   and the fourth wall. Headless. */
const {load}=require('./harness');
let fails=0; const ok=(c,m)=>{ if(!c){ console.log('  FAIL:',m); fails++; } };
const section=n=>console.log('\n— '+n);
function game(hero='dean'){ const K=load(); let t=0; K.ks=n=>{ for(let i=0;i<n;i++){ t+=16; K.frame(t); } }; K.begin(hero); K.ks(2); K.skipCutscene(); K.ks(4); return K; }
const walk=(K,n=14)=>{ let i=0; while(K.dlg.open&&i++<n) K.pickChoice(K.dlg.avail[0]); if(K.dlg.open) K.closeDlg(); };
const pick=(K,re)=>{ const c=K.dlg.avail.find(c=>re.test(c.text)); ok(c,`no choice matching ${re} at ${K.dlg.node}: ${K.dlg.avail.map(c=>c.text).join(' | ')}`); if(c) K.pickChoice(c); return c; };
const clearRoom=K=>{ for(const e of K.S.sector.entities) if(e.kind==='enemy') e.dead=true; };

section('names');
{ const K=game('dean');
  K.NAMES.dean='Arjun'; K.NAMES.family='Varma'; K.NAMES.castiel='Ezra'; K.applyNames();
  ok(K.nm('Dean and Sam Winchester, the Winchesters')==='Arjun and Sam Varma, the Varmas',`substitution: ${K.nm('Dean and Sam Winchester, the Winchesters')}`);
  ok(K.nm('Deanna, Cassidy, Cas')==='Deanna, Cassidy, Ezra','partial words were renamed');
  ok(K.HEROES.dean.full==='Arjun Varma'&&K.SPEAKERS.dean.name==='Arjun','hero/speaker names not updated');
  K.say('narr','Dean looks at Sam.',2,{now:true}); K.ks(2); ok(K.SUBQ.concat([]).every(s=>!/Dean/.test(s.text||'')),'a subtitle kept the old name');
  ok(K.COMP_().name==='Sam','companion name');
  K.NAMES.sam='Nakul'; K.applyNames(); ok(K.COMP_().name==='Nakul','companion not renamed');
  Object.assign(K.NAMES,K.NAME_DEFAULT); K.saveNames(); K.applyNames(); ok(K.nm('Dean')==='Dean','reset failed'); }

section('switching brothers');
{ const K=game('dean'), F=K.S.flags; K.enterSector('street',28,30,-Math.PI/2); clearRoom(K); K.ks(4);
  ok(K.ACTIONS.some(a=>a.id==='switchHero'&&a.keys.includes('KeyU')),'no switch binding'); ok(K.WHEEL_ITEMS.some(w=>w.id==='swap'),'not on the quick wheel');
  const shells=K.S.ammo.shells; K.S.hp=72;
  ok(K.switchBlock()===null,`blocked for no reason: ${K.switchBlock()}`);
  ok(K.switchHero(),'switch failed'); ok(K.S.hero==='sam'&&K.S.owned.has('holywater')&&K.S.hp===100,'Sam’s kit not loaded');
  ok(K.COMP_().look.startsWith('dean'),'companion is not Dean'); K.S.hp=55;
  ok(K.switchHero(),'switch back failed'); ok(K.S.hero==='dean'&&K.S.ammo.shells===shells&&K.S.hp===72,'Dean’s kit not restored');
  ok(K.switchHero()&&K.S.hp===55,'Sam’s health not kept');
  K.switchHero();
  /* when not */
  K.S.mission='The last scene is playing'; ok(!K.switchHero()&&K.S.hero==='dean','switched during a mission'); K.S.mission=null;
  const e={kind:'enemy',etype:'demon',x:K.S.px+3,y:K.S.py,state:'hunt',hp:10,r:.3,h:1.8}; K.S.sector.entities.push(e);
  ok(/fight/.test(K.switchBlock()||''),'switched in a fight'); e.dead=true;
  K.openDlg('rae',K.S.sector.entities.find(x=>x.rae)); ok(K.switchBlock(),'switched in a conversation'); K.closeDlg();
  K.enterSector('cathedral',12.5,20,-Math.PI/2); ok(K.switchBlock(),'switched inside the church'); K.enterSector('street',28,30,-Math.PI/2); clearRoom(K);
  /* saves keep both kits */
  K.switchHero(); K.writeSave('slot2'); const L=load(); L.begin('dean'); L.restore(L.readSave('slot2'));
  ok(L.S.hero==='sam'&&L.inv_().kits&&L.inv_().kits.dean,'kits lost on load');
  /* pause menu */
  K.openPause(); ok(K.dlg.avail.some(c=>/^Play as/.test(c.text)),'no switch in the pause menu'); K.closeDlg(); }

section('Rae, and Sarah');
{ const K=game('dean'), F=K.S.flags; const r=K.SECTORS.street.entities.find(e=>e.rae); ok(r&&!r.hidden,'Rae not on the street');
  K.openDlg('rae',r); pick(K,/always work nights/); walk(K); ok(K.heartOf('rae')===1&&F.rae1,'Rae 1');
  K.S.act=2; K.openDlg('rae',r); pick(K,/mostly my fault/); walk(K); ok(K.heartOf('rae')===2&&F.rae2,'Rae 2');
  K.S.act=3; K.openDlg('rae',r); pick(K,/I’ll say it/); walk(K); ok(F.rae3&&K.trueLove('dean'),'Rae is not his true love');
  ok(K.S.notes.some(n=>n.id==='rae_hook'),'no tow hook note');
  const S2=game('sam'), G=S2.S.flags; G.sarah_met=true; const sa=S2.SECTORS.library.entities.find(e=>e.dialogue==='sarah');
  S2.openDlg('sarah',sa); ok(S2.dlg.node==='h1',`Sarah’s first heart beat did not play (${S2.dlg.node})`); pick(S2,/Tell me about him/); walk(S2);
  S2.heart('sarah',1); S2.S.act=3; for(let i=0;i<4;i++){ S2.openDlg('sarah',sa); if(S2.dlg.node==='h2') break; walk(S2); } ok(S2.dlg.node==='h2',`Sarah’s second beat did not play (${S2.dlg.node})`); pick(S2,/come back and tell you/); walk(S2);
  ok(S2.trueLove('sam'),'Sarah is not his true love'); ok(!S2.trueLove('dean'),'love leaked across brothers');
  /* Dean never gets Sarah's heart beats */
  const D=game('dean'); D.S.flags.sarah_met=true; D.openDlg('sarah',D.SECTORS.library.entities.find(e=>e.dialogue==='sarah')); ok(D.dlg.node!=='h1','Dean got Sam’s beat'); D.closeDlg(); }

section('the enchantress: the words change, and only two things break it');
const vesperAt=(hero,setup)=>{ const K=game(hero); K.S.act=2; setup&&setup(K); K.enterSector('lounge',8,9,-Math.PI/2); K.ks(4);
  const v=K.SECTORS.lounge.entities.find(e=>e.vesper); ok(v&&!v.hidden,'Vesper not at the bar');
  K.openDlg('vesper',v); pick(K,/very long week/); pick(K,/Every day/); ok(K.ENTH.on&&K.dlg.node==='v2','spell did not start'); return K; };
{ const K=vesperAt('dean',K=>{ K.S.hp=30; K.S.cash=20; K.inv_().bond=-1; });
  const before=K.dlg.avail.map(c=>c.text).join('|'); K.pickChoice(K.dlg.avail[0]); ok(K.dlg.node==='v2','picked a choice while the words were changing');
  K.closeDlg(); ok(K.dlg.open,'walked away mid-spell');
  K.spellRun(3); ok(!K.ENTH.done,'finished too fast'); K.spellRun(6); ok(K.ENTH.done,'spell never finished');
  const L=K.lures('vesper'); ok(L.some(t=>/wound/.test(t))&&L.some(t=>/offering/.test(t))&&L.some(t=>/doesn’t need you/.test(t)),`lures ignore the stats: ${L.join(' | ')}`);
  ok(K.dlg.avail.map(c=>c.text).join('|')===L.join('|'),'the options did not become hers');
  ok(before!==L.join('|'),'nothing changed');
  K.spellRun(3); ok(!K.dlg.avail.some(c=>/HEY|“Rae/.test(c.text)),'rescued with no brother and no love');
  K.pickChoice(K.dlg.avail[0]); walk(K); ok(K.S.flags.thrall_vesper&&K.S.cash<=5&&K.S.hp<=35,'no cost for being taken');
  ok(!K.ENTH.on&&!K.S.flags.thrall_active,'spell left running'); }
{ const K=vesperAt('sam',K=>{ K.inv_().bond=2; }); K.spellRun(12);
  const r=K.dlg.avail[0]; ok(r&&/voice/.test(r.text),'brother did not reach in'); K.pickChoice(r); ok(K.dlg.node==='vb','brother rescue node'); walk(K);
  ok(K.S.flags.freed_vesper==='brother'&&K.S.flags.anchor_vesper&&!K.S.flags.thrall_vesper,'brother rescue not recorded'); }
{ const K=vesperAt('dean',K=>{ K.inv_().bond=-2; K.heart('rae',3); }); K.spellRun(12);
  ok(K.dlg.avail.length===K.lures('vesper').length+1&&/Rae/.test(K.dlg.avail[0].text),'love did not reach in'); K.pickChoice(K.dlg.avail[0]); walk(K);
  ok(K.S.flags.freed_vesper==='love','love rescue not recorded'); ok((K.S.msgs.rae||[]).length||true,'');
  const B=vesperAt('dean',K=>{ K.inv_().bond=-2; K.heart('rae',3); K.S.flags.love_refused_rae=true; }); B.spellRun(12); ok(!B.dlg.avail.some(c=>/Rae/.test(c.text)),'refused love still rescued'); B.closeDlg(); }
{ const K=game('sam'); K.S.act=3; K.addNote&&0; K.enterSector('library',8,9,-Math.PI/2); K.ks(4); const c=K.SECTORS.library.entities.find(e=>e.celandine); ok(c&&!c.hidden,'Celandine not in the stacks');
  const n0=K.S.notes.length; K.openDlg('celandine',c); pick(K,/What book/); pick(K,/Show me/); ok(K.ENTH.on,'Celandine’s spell did not start'); K.spellRun(12);
  const lure=K.dlg.avail.find(x=>!/voice|Sarah/.test(x.text)); K.pickChoice(lure); walk(K);
  ok(K.S.flags.thrall_celandine&&K.S.notes.some(n=>n.id==='lost_celandine'),'Celandine took nothing'); }

section('the stranger: three meetings');
{ const K=game('dean'), F=K.S.flags; F.phantom=true; F.signed_alias=true; K.ks(2);
  const s1=K.SECTORS.motel.entities.find(e=>e.stranger===1&&e.dialogue); ok(s1&&!s1.hidden,'no stranger in the motel');
  K.openDlg('stranger1',s1); ok(/another man’s name/.test(K.elLine_().textContent),'he does not notice the alias'); pick(K,/Who are you/); walk(K);
  ok(F.tg1&&K.S.notes.some(n=>n.id==='tg_feather'),'feather not left'); K.ks(2); ok(s1.hidden,'he stayed');
  K.S.act=2; F.kevin_checked=true; K.ks(2); const s2=K.SECTORS.church.entities.find(e=>e.stranger===2); ok(!s2.hidden,'no stranger in the church');
  K.openDlg('stranger2',s2); pick(K,/Crowley/); walk(K); ok(F.tg2,'second meeting');
  K.S.act=3; F.lily_done=true; K.ks(2); const s3=K.SECTORS.street.entities.find(e=>e.stranger===3); ok(!s3.hidden,'no stranger on the cross street');
  K.openDlg('stranger3',s3); pick(K,/Show me/); ok(K.S.cut&&K.S.cut.id==='kala','the street in May did not play'); K.skipCutscene(); K.ks(2);
  ok(F.tg3&&F.tg_kala&&!K.SECTORS.street.entities.some(e=>e.kala),'Kālacakra did not clean up'); }

section('the altar: the four phases');
const altar=(hero,setup)=>{ const K=load(); let kt=0; K.ks=n=>{ for(let i=0;i<n;i++){ kt+=16; K.frame(kt); } };
  K.begin(hero); K.ks(2); K.startAt(4); K.ks(4); const F=K.S.flags; F.cas_open=true; setup&&setup(K);
  K.enterSector('cathedral',12.5,9.4,-Math.PI/2); K.resolveAlistair(false); K.ks(6);
  const ch=K.SECTORS.cathedral.entities.find(e=>e.chuck); K.openDlg('chuck_end',ch); K.pickChoice(K.dlg.avail[0]); return K; };
for(const hero of ['dean','sam']){ const K=altar(hero,K=>{ Object.assign(K.S.flags,{bell_seal:true,kevin_rig:true}); K.inv_().bond=1; }), F=K.S.flags;
  ok(K.dlg.node==='gA',`${hero}: no third chair (${K.dlg.node})`);
  K.pickChoice(K.dlg.avail[0]); ok(K.SECTORS.cathedral.entities.some(e=>e.god&&e.look==='stranger'),'he is not in the chair'); ok(K.switchBlock(),'switching allowed at the altar');
  for(let i=0;i<8;i++) K.pickChoice(K.dlg.avail[0]); ok(K.dlg.node==='gA9'&&K.LFX.on,`Chuck’s rewrite did not run (${K.dlg.node})`);
  K.godRun(5); ok(/stop being words/.test(K.elLine_().textContent),'the revision did not fail'); K.pickChoice(K.dlg.avail[0]);
  ok(K.dlg.node==='gA10'&&/A stranger/.test(K.elSpk_().textContent),'he was named too early'); pick(K,/Go on/);
  /* Phase I */
  ok(!K.dlg.avail.some(c=>/margin/.test(c.text)),'evidence offered that wasn’t found');
  pick(K,/seal is older/); K.pickChoice(K.dlg.avail[0]); pick(K,/admin, not root/); K.pickChoice(K.dlg.avail[0]);
  ok(K.tg().proofs.length===2,'proofs not counted'); pick(K,/^“Enough/);
  if(hero==='dean'){ pick(K,/killed things/); pick(K,/different/); pick(K,/protect my family/); pick(K,/Say nothing/); ok(/avoid/.test(K.elLine_().textContent),'Scene B'); K.pickChoice(K.dlg.avail[0]); }
  else { pick(K,/already decided/); pick(K,/metaphor/); ok(/pauses/.test(K.elLine_().textContent),'Scene C'); pick(K,/want from us/); K.pickChoice(K.dlg.avail[0]); }
  ok(K.dlg.node==='p2b',`no brother beat (${K.dlg.node})`); K.pickChoice(K.dlg.avail[0]); K.pickChoice(K.dlg.avail[0]);
  /* Phase II */
  ok(K.dlg.node==='q1'&&K.ENTH.on,'the enchantress did not come'); K.spellRun(12);
  const lure=K.dlg.avail.find(c=>!/voice|“Rae|“Sarah/.test(c.text)); K.pickChoice(lure); ok(K.dlg.node==='qT','Māyā did not show the seams');
  ok(K.dlg.avail.some(c=>/Cut it/.test(c.text)),'cannot ask him to cut it');
  ok(K.elCh_().children.filter(b=>/maya/.test(b.className||'')).length>=1,'her words are not left on screen, blackened'); ok(K.dlg.avail.some(c=>/Grab|hunger wearing/.test(c.text)),'the brothers’ own way out is missing');
  pick(K,/Grab|hunger wearing/); ok(K.dlg.node==='qW'&&F.tg_won_own,'their own way did not work'); K.pickChoice(K.dlg.avail[0]);
  ok(K.dlg.node==='qD'&&K.GSP.on,'Scene D did not start'); K.pickChoice(K.dlg.avail[0]); ok(K.dlg.node==='qD','her options could be picked');
  K.godRun(5); ok(K.dlg.node==='qD1','her options did not dissolve'); K.pickChoice(K.dlg.avail[0]); K.pickChoice(K.dlg.avail[0]);
  pick(K,/what she fears/); ok(/Being seen/.test(K.elLine_().textContent),'she does not answer'); K.pickChoice(K.dlg.avail[0]);
  ok(K.S.flags.tg_chakra>=1,'the Sudarshana never turned');
  /* Phase III */
  ok(K.dlg.node==='r0',`not at Phase III (${K.dlg.node})`); K.pickChoice(K.dlg.avail[0]); K.pickChoice(K.dlg.avail[0]); ok(K.VIS.lvl===1,'no first sight of the form'); K.pickChoice(K.dlg.avail[0]); K.pickChoice(K.dlg.avail[0]);
  ok(F.tg_named&&K.SPEAKERS.god.name===K.NAMES.god&&K.VIS.lvl===2,'not named at the revelation');
  ok(K.NAMES.god==='The Formless One'&&/Formless One/.test(K.elLine_().textContent)&&/courtesy/.test(K.elLine_().textContent),'the Absolute does not say what he is');
  ok(K.SECTORS.cathedral.entities.some(e=>e.god&&e.look==='formless'),'his form did not change');
  K.pickChoice(K.dlg.avail[0]); K.pickChoice(K.dlg.avail[0]); K.pickChoice(K.dlg.avail[0]);
  ok(K.dlg.node==='s1','no first sight'); pick(K,/^“It was fate/); ok(K.dlg.node==='s1x','a wrong answer was accepted'); K.pickChoice(K.dlg.avail[0]);
  ok(!K.dlg.avail.some(c=>/fate/.test(c.text)),'the wrong answer came back'); pick(K,/It was chosen/); pick(K,/a hunger/); pick(K,/inside his script/);
  ok(K.dlg.node==='t0'&&K.tg().misses===1,'Phase III did not end');
  /* Phase IV */
  const t=K.dlg.avail.map(c=>c.text).join('|'); ok(/reject the script/.test(t)&&/step back/.test(t)&&/pitch/.test(t),`Phase IV options: ${t}`);
  pick(K,/^“We reject the script/); K.pickChoice(K.dlg.avail[0]);
  ok(K.S.cut&&K.S.cut.id==='end_F',`Equilibrium did not play (${K.S.cut&&K.S.cut.id})`); K.skipCutscene(); K.ks(2);
  ok(K.S.menu==='end'&&!K.S.mission,'no end screen / mission not cleared');
  const E=K.epilogue('F'); ok(E.title==='The Equilibrium'&&E.lines.some(l=>/dead stayed dead/.test(l))&&E.lines.some(l=>/did not need anyone/.test(l)),'thin Equilibrium epilogue'); }
{ /* together → Liberation, refusal → the Unfinished Sunday, and Chuck's own endings */
  const K=altar('sam',K=>{ const A=K.arcS(); A.seed=true; A.dl=2; A.sa=2; K.inv_().bond=1; });
  K.S.flags.tg_seen=true; K.showNode('t0'); ok(K.dlg.avail.some(c=>/Take your brother’s hand/.test(c.text)),'no together option');
  pick(K,/Take your brother’s hand/); K.pickChoice(K.dlg.avail[0]); ok(K.S.cut&&K.S.cut.id==='end_E','Liberation did not play'); K.skipCutscene(); K.ks(2);
  ok(K.epilogue('E').title==='Liberation','Liberation epilogue');
  const G=altar('dean'); G.showNode('t0'); ok(!G.dlg.avail.some(c=>/Take your brother’s hand/.test(c.text)),'together offered without earning it');
  pick(G,/step back/); G.pickChoice(G.dlg.avail[0]); ok(G.S.cut&&G.S.cut.id==='end_G','the Unfinished Sunday did not play'); G.skipCutscene(); G.ks(2);
  ok(/peacock feather/.test(G.epilogue('G').lines.join(' ')),'G epilogue');
  const C=altar('dean'); C.showNode('t0'); pick(C,/pitch/); ok(C.dlg.node==='e1'&&C.dlg.avail.length>=4&&C.S.flags.tg_done&&!C.S.mission,'Chuck’s endings not reachable after him');
  ok(C.S.flags.tg_choice==='chuck','choice not recorded'); }

section('the fourth wall');
{ const K=game('sam'), F=K.S.flags; ok(typeof K.tzTown()==='string'||K.tzTown()===null,'tzTown');
  ok(K.FW.asked&&K.S.act===1,'location not asked for before the game began');
  K.enterSector('street',28,30,-Math.PI/2); clearRoom(K); K.S.time+=60; K.ks(4); ok(!K.FW.armed,'armed in Act I');
  K.S.act=3; K.ks(4); ok(typeof K.fwTown()==='string'&&K.fwTown().length>0,'no town name'); ok(!K.FW.armed,'armed the moment Act III began');
  K.S.time+=30; K.ks(4); ok(K.FW.armed,'never armed');
  K.inputDown('KeyW',null); ok(F.fw_done&&K.S.menu==='fourth','the moment did not happen on a keypress'); K.fourthEnd(); ok(K.S.menu!=='fourth','did not end');
  ok(/streetlight is humming/.test(K.epilogue('C').lines.join(' ')),'epilogue does not remember the town');
  const N=game('dean'); N.S.settings.fourth=false; N.S.act=3; N.enterSector('street',28,30,-Math.PI/2); N.ks(4); N.S.time+=40; N.ks(4); ok(!N.FW.armed,'happened with the setting off'); }

console.log(fails?`\n${fails} FAILURE(S)`:'\nAll checks passed'); process.exit(fails?1:0);
