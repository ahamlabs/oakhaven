/* Story 1.5: arcs, car scenes, cast beats, the vigil, the gathering, and
   the town noticing. Headless. */
const {load}=require('./harness');
let fails=0; const ok=(c,m)=>{ if(!c){ console.log('  FAIL:',m); fails++; } };
const section=n=>console.log('\n— '+n);
function game(hero='dean'){ const K=load(); let t=0; K.ks=n=>{ for(let i=0;i<n;i++){ t+=16; K.frame(t); } }; K.begin(hero); K.ks(2); K.skipCutscene(); K.ks(4); return K; }
const walk=(K,n=14)=>{ let i=0; while(K.dlg.open&&i++<n) K.pickChoice(K.dlg.avail[0]); if(K.dlg.open) K.closeDlg(); };
const txt=v=>typeof v==='function'?'(fn)':v;

section('every dialogue tree points at real nodes');
for(const hero of ['dean','sam']){ const K=game(hero);
  /* build the car scenes so their trees exist */
  for(const c of K.CAR_()){ const T=c.build(hero==='dean'); ok(T&&T.nodes&&T.nodes[T.start],`car ${c.id}/${hero}: no start node`); K.DIALOGUE['car_'+c.id]=T; }
  for(const [id,D] of Object.entries(K.DIALOGUE)){ if(!D.nodes) continue;
    for(const [nid,n] of Object.entries(D.nodes)) for(const ch of (n.choices||[])){
      if(ch.next==null||typeof ch.next==='function') continue;
      ok(D.nodes[ch.next],`${hero}: ${id}.${nid} → missing node ${ch.next}`); } }
  for(const [did,L] of Object.entries(K.BEATS)) for(const b of L) ok(K.DIALOGUE[did].nodes[b.first],`beat ${b.id}: first node ${b.first} missing in ${did}`);
}

section('car scenes and the brothers’ meters');
for(const hero of ['dean','sam']){ const K=game(hero), F=K.S.flags;
  F.phantom=true; ok(K.pendingCar()&&K.pendingCar().id==='mill',`${hero}: mill car scene not pending`);
  K.impalaTalk(); ok(K.dlg.open&&K.dlg.tree&&/car_mill/.test(K.dlg.tree.id||K.dlg.id||'car_mill'),`${hero}: car scene did not open`);
  walk(K); const A=K.arcS(); ok(A.seen.mill,`${hero}: car scene not marked seen`); ok(Object.keys(A.picks).length>0,`${hero}: no pick remembered`);
  ok(!K.pendingCar()||K.pendingCar().id!=='mill','mill car scene repeats');
  /* together */
  A.dl=2; A.sa=1; A.seed=false; ok(!K.together(),'together without the seed'); A.seed=true; K.inv_().bond=0; ok(K.together(),'together not reached at dl+sa=3, bond 0');
  K.inv_().bond=-1; ok(!K.together(),'together with a broken bond'); K.inv_().bond=1;
}

section('the altar: together');
{ const K=game('sam'), F=K.S.flags; K.startAt(4); K.ks(4); const A=K.arcS(); A.seed=true; A.dl=2; A.sa=2;
  const D=K.DIALOGUE.chuck_end; ok(D,'no chuck_end'); if(D){ const n=Object.values(D.nodes).find(n=>(n.choices||[]).some(c=>/Take your brother’s hand/.test(c.text)));
    ok(n,'no together option at the altar');
    const E=K.epilogue('A'); F.together=true; const E2=K.epilogue('A'); ok(E2.lines.length>E.lines.length,'together adds no epilogue line'); } }

section('the cast: beats play once');
{ const K=game('dean'), F=K.S.flags; F.marla=true; F.phantom=true;
  ok(K.pendingBeat('marla'),'marla beat not pending'); const m=K.SECTORS.motel.entities.find(e=>e.dialogue==='marla');
  K.openDlg('marla',m); ok(F.beat_marla1,'marla1 did not fire'); walk(K);
  ok(F.signed_real||F.signed_alias,'ledger signing not recorded');
  K.openDlg('marla',m); ok(!K.dlg.node||K.dlg.node!=='m1a','marla1 repeated'); walk(K); }

section('the man in the bathrobe');
{ const K=game('dean'), F=K.S.flags; F.marla=true; K.enterSector('street',13.2,34,-Math.PI/2); K.ks(6);
  K.S.px=13.2; K.S.py=33.8; K.ks(4); K.S.px=13.2; K.S.py=31; K.ks(6); ok(F.cameo_c1,'cameo did not vanish at close range'); }

section('the vigil');
for(const k of ['names','truth','charge','silent']){ const K=game('sam'), F=K.S.flags; K.startAt(2); K.ks(4); while(K.S.cut){ K.skipCutscene(); K.ks(2); }
  Object.assign(F,{kevin_checked:true,delia_done:true,sarah_met:true,read_ledgers:true}); K.enterSector('street',28,27,-Math.PI/2);
  for(const e of K.SECTORS.street.entities) if(e.kind==='enemy') e.dead=true;
  K.ks(4); ok(F.vigil_nudge,'no vigil text'); ok((K.S.msgs.marla||[]).some(m=>/candles/.test(m.text)),'Marla did not text about the vigil');
  K.S.time+=25; K.ks(4); ok(K.S.cut&&K.S.cut.id==='vigil',`vigil did not start (cut ${K.S.cut&&K.S.cut.id})`);
  K.skipCutscene(); ok(K.dlg.open,'no vigil choice'); const c=K.dlg.avail.find(c=>c.act&&(c.act+'').includes(`'${k}'`));
  ok(c,`no ${k} option`); if(c) K.pickChoice(c); ok(F.vigil===k,`vigil ${k} not recorded`);
  ok(!K.SECTORS.street.entities.some(e=>e.vigil),'vigil props left behind'); if(K.dlg.open) K.closeDlg();
  const E=K.epilogue('B').lines.join(' '); if(k!=='silent') ok(/seven times|six names|LIGHTS ON/.test(E),`no vigil epilogue line for ${k}`); }

section('the gathering at the doors');
{ const K=game('dean'), F=K.S.flags; K.startAt(4); K.ks(4); while(K.S.cut){ K.skipCutscene(); K.ks(2); }
  const G0=K.gatherers().length;
  Object.assign(F,{sarah_crew:true,ames_told:true,halvorsen_trusted:true,delia_done:true,elise_returned:true,agnes_told_truth:true,reed_accepted:true,rd_saved:true,juno_spared:true});
  K.inv_().trust.marla=3; K.inv_().trust.earl=2; const G=K.gatherers(); ok(G.length>=G0+8,`only ${G.length} gatherers`);
  const cas=K.SECTORS.street.entities.find(e=>e.look==='castiel'&&!e.dead); ok(cas&&cas.dialogue==='castiel_iv','no Act IV Castiel');
  for(const e of K.SECTORS.street.entities) if(e.kind==='enemy') e.dead=true;
  const r=K.S.ammo.rounds, ar=K.S.armor; K.enterSector('street',cas.x-3,cas.y,0); K.ks(4);
  ok(K.S.cut&&K.S.cut.id==='gather',`gathering did not play (cut ${K.S.cut&&K.S.cut.id})`);
  K.skipCutscene(); K.ks(2); ok(F.gathered===G.length,`gathered ${F.gathered} ≠ ${G.length}`);
  ok(K.S.ammo.rounds>r,'Earl’s rounds not given'); ok(K.S.armor>ar||K.S.armor===100,'no armour from the gathering');
  ok(K.SECTORS.street.entities.filter(e=>e.gather).every(e=>!['npc','walker','prop'].includes(e.kind)),'gatherers block the street');
  ok(/people stood at the doors/.test(K.epilogue('C').lines.join(' ')),'gathering not in the epilogue');
  K.ks(10); ok(!K.S.cut,'gathering replays');
  /* nobody */
  const N=game('sam'); N.startAt(4); N.ks(4); while(N.S.cut){ N.skipCutscene(); N.ks(2); } ok(Array.isArray(N.gatherers()),'gatherers() failed with nobody'); }

section('the town notices');
{ const K=game('dean'), F=K.S.flags; F.phantom=true; K.enterSector('street',28,30,-Math.PI/2); K.ks(2);
  const w=K.SECTORS.street.entities.find(e=>e.talk==='worker'); ok(w,'no worker walker');
  K.SUBQ.length=0; K.townTalk(w); ok(F.rx_w_phantom,'reactive line not used'); K.townTalk(w); ok(!F.rx_w_shift,'unearned reactive line');
  /* every reactive line names a real walker and has a valid condition */
  const talks=new Set(Object.values(K.SECTORS).flatMap(s=>s.entities.map(e=>e.talk)).filter(Boolean));
  for(const r of K.TOWN_REACT){ ok(talks.has(r.talk),`reactive ${r.id}: no walker ${r.talk}`); try{ r.when(F); }catch(e){ ok(false,`reactive ${r.id} threw ${e.message}`); } }
  for(const o of K.OVERHEAR){ try{ o.when(F); }catch(e){ ok(false,`overhear ${o.id} threw`); } ok(o.lines.every(([w])=>w===0||w===1),`overhear ${o.id}: bad speaker`); }
  /* overheard */
  const a=K.SECTORS.street.entities.find(e=>e.talk==='worker'), b=K.SECTORS.street.entities.find(e=>e.talk==='logger');
  for(const e of K.SECTORS.street.entities) if(e.kind==='enemy') e.dead=true;
  a.x=20; a.y=30; b.x=21; b.y=30.5; a.speed=b.speed=0; K.S.px=21; K.S.py=33; K.S.lastOverhear=-99; K.ks(90);
  ok(F.oh_o_six,'walkers did not talk to each other');
  /* radio */
  F.bul_b1=undefined; K.radio(); K.radio(); ok(F.bul_b1,'KOAK news bulletin did not play');
  /* case texts */
  K.decide('bell','answer'); const n=(K.S.msgs.marla||[]).length; K.closeCase('bell'); K.S.time+=10; K.ks(4);
  ok((K.S.msgs.marla||[]).length>n&&/elise/.test(K.S.msgs.marla.at(-1).text),'no text after the bell case');
  for(const [cid,M] of Object.entries(K.CASE_TXT)){ ok(K.CASES[cid],`case text for unknown case ${cid}`); for(const [d,[th]] of Object.entries(M)) ok(K.THREADS[th],`case text ${cid}/${d}: unknown thread ${th}`); }
}

section('saves keep the new state');
{ const K=game('sam'), F=K.S.flags; F.phantom=true; K.impalaTalk(); walk(K); F.vigil='truth'; K.inv_().morale=3;
  K.writeSave('slot1'); const L=load(); L.begin('dean'); L.restore(L.readSave('slot1'));
  ok(L.arcS().seen.mill,'car scene lost on load'); ok(L.S.flags.vigil==='truth','vigil lost on load'); ok(L.inv_().morale===3,'morale lost on load'); }

console.log(fails?`\n${fails} FAILURE(S)`:'\nAll checks passed'); process.exit(fails?1:0);
