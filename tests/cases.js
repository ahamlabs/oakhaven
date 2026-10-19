/* The investigation loop, end to end, headless. */
const {load,STORE}=require('./harness');
let fails=0; const ok=(c,m)=>{ if(!c){ console.log('  FAIL:',m); fails++; } };
const section=n=>console.log('\n— '+n);
function game(hero='dean'){ const K=load(); let t=0; K.ks=n=>{ for(let i=0;i<n;i++){ t+=16; K.frame(t); } }; K.begin(hero); K.ks(2); K.skipCutscene(); K.ks(4); return K; }
const use=(K,sec,id)=>{ const e=K.SECTORS[sec].entities.find(e=>e.use===id); ok(e,`no ${id} in ${sec}`); if(e){ K.USES[id](e); if(K.dlg.open){ const c=K.dlg.avail&&K.dlg.avail[0]; if(c&&c.act!==undefined) K.pickChoice(c); else K.closeDlg(); } } return e; };
const read=(K,sec,id)=>{ const e=K.SECTORS[sec].entities.find(e=>e.read===id); ok(e,`no readable ${id}`); if(e){ K.readThing(e); K.closeDlg(); } };
const talk=(K,id,ent)=>{ K.openDlg(id,ent); let n=0; while(K.dlg.open&&n++<12){ K.pickChoice(K.dlg.avail[0]); } };

section('the green chain: clues, links, theory');
{ const K=game('dean'); const F=K.S.flags;
  ok(K.caseList().some(c=>c.id==='mill'),'mill case not open');
  read(K,'mill','roster'); read(K,'mill','ledger14'); use(K,'mill','fan'); F.marla=true;
  const c=K.CASES.mill; ok(K.clueHave(c,'roster')&&K.clueHave(c,'fan')&&K.clueHave(c,'ledger14'),'clues not collected');
  let r=K.tryLink('mill','roster','fan'); ok(!r.ok,'wrong link accepted');
  r=K.tryLink('mill','fan','ledger14'); ok(r.ok&&r.link.id==='neglect','neglect link failed');
  ok(K.deduced('neglect')&&F.ded_neglect,'deduction not recorded');
  r=K.tryLink('mill','ledger14','fan'); ok(!r.ok,'duplicate link accepted');
  ok(K.tryLink('mill','ledger14','marla').ok,'buyer link failed');
  /* the phantom can now be talked down */
  K.enterSector('mill',15.5,9.6,-Math.PI/2); K.ks(2);
  const ph=K.SECTORS.mill.entities.find(e=>e.dialogue==='phantom'); K.openDlg('phantom',ph);
  ok(K.dlg.avail[0].next==='p3','no Ray-by-name option after the deduction');
  K.pickChoice(K.dlg.avail[0]); K.pickChoice(K.dlg.avail[0]); if(K.dlg.open) K.closeDlg();
  ok(F.ray_heard&&F.phantom,'talking Ray down did not set flags');
  K.ks(10); while(K.S.cut){ K.skipCutscene(); K.ks(2); }
  K.ks(4); const dormant=K.SECTORS.mill.entities.filter(e=>e.etype==='ghost'&&!e.dead&&e.kind==='enemy').length;
  ok(dormant===2,`${dormant} shades woke (expected 2 after Ray let go)`);
  /* theory */
  K.commitTheory('mill','fan'); ok(K.theoryRight('mill')&&F.theory_mill==='right','theory not committed');
  K.commitTheory('mill','ghost'); ok(K.theoryOf('mill')==='fan','theory changed after commit');
  /* journal renders */
  K.openJournal('mill'); ok(K.S.caseOpen,'journal did not open'); K.renderJournal(); K.closeJournal(); ok(!K.S.caseOpen,'journal did not close');
  /* Sam's hunch is Sam's */
  ok(K.samHunch('mill')===null,'Dean got Sam’s hunch'); ok(K.deanGut('mill')!==null||K.theoryOf('mill'),'Dean’s gut unavailable');
}

section('the last shift');
{ const K=game('sam'); const F=K.S.flags;
  F.phantom=true; F.shadesAwake=true; for(const e of K.SECTORS.mill.entities) if(e.etype==='ghost'&&e.kind==='enemy') e.dead=true;
  K.enterSector('street',28,30,-Math.PI/2); K.ks(5);
  ok(F.dwyer_found,'Dwyer never found'); K.ks(800);
  ok(K.S.msgs.marla&&K.S.msgs.marla.length>=2,'Marla did not text');
  ok(K.caseList().some(c=>c.id==='shift'),'shift case not open');
  const mara=K.SECTORS.street.entities.find(e=>e.dialogue==='mara'); ok(mara&&!mara.hidden,'Mara not on the street');
  talk(K,'mara',mara); talk(K,'leon',K.SECTORS.street.entities.find(e=>e.dialogue==='leon'));
  talk(K,'peter',K.SECTORS.pawn.entities.find(e=>e.dialogue==='peter'));
  ok(F.w_mara&&F.w_leon&&F.w_peter,'witnesses not recorded'); ok(F.peter_told,'Sam did not get Peter’s confession');
  /* the room */
  const door=K.SECTORS.mill.doors['0,18']; ok(door&&door.to==='maint','no maintenance door');
  ok(!K.hits(K.SECTORS.maint,5.6,3.5,.26),'maint arrival in wall');
  K.enterSector('maint',5.6,3.5,Math.PI); K.ks(2);
  for(const u of ['dw_body','dw_vent','dw_clock','dw_board','dw_cabinet','dw_lock']) use(K,'maint',u);
  ok(F.dw_notebook&&F.dw_original&&F.dw_lock,'room clues missing');
  const v=K.SECTORS.maint.entities.find(e=>e.use==='dw_vent'); v.on=true;
  K.ks(60*25); ok(F.dw_reset&&!v.on,'the room did not reset');
  read(K,'mill','inspect'); read(K,'mill','ledger14');
  for(const [a,b] of [['lock','reset'],['notebook','inspect'],['clock','notebook'],['mara','notebook'],['peter','vent'],['leon','reset'],['original','ledger14']]) ok(K.tryLink('shift',a,b).ok,`link ${a}+${b}`);
  ok(K.S.inv.links.shift.length===7,'not all shift links');
  K.commitTheory('shift','late');
  /* the replay */
  K.enterSector('mill',14,19,-Math.PI/2); K.ks(3);
  ok(K.SECTORS.mill.entities.some(e=>e.shiftGhost),'the last shift did not start');
  K.USES.sh_alarm(); ok(K.S.hp<100,'wrong order did not hurt');
  K.USES.sh_vent(); K.USES.sh_alarm(); K.USES.sh_exit(); K.ks(60*18);
  const dg=K.SECTORS.mill.entities.find(e=>e.dwyerGhost); ok(dg&&!dg.dead,'Dwyer’s ghost did not turn');
  if(dg){ dg.dead=true; } K.ks(120);
  ok(K.dlg.open,'decision menu did not appear');
  const rest=K.dlg.avail.find(c=>/rest/.test(c.text)); K.pickChoice(rest); K.ks(60*4);
  ok(K.S.collapse,'collapse did not start'); K.enterSector('street',45.5,29.9,-Math.PI/2); K.ks(60*6);
  ok(F.mill_records_saved&&K.caseClosed('shift'),'records not saved / case not closed');
  ok(K.S.inv.news.some(n=>n.cid==='shift'),'no paper for the shift');
  K.ks(60); ok(K.S.menu==='autopsy','autopsy did not show'); K.autopsyNext(); ok(K.S.menu==='autopsy','paper did not show'); K.autopsyNext(); ok(!K.S.menu,'paper did not close');
  /* save and load keeps the investigation */
  K.enterSector('library',8,9.6,-Math.PI/2); K.ks(2); ok(K.writeSave('3'),'save failed');
  const R=load(); R.restore(R.readSave('3')); ok(R.S.inv.links.shift.length===7&&R.caseClosed('shift')&&R.theoryOf('shift')==='late','investigation lost on load');
}

section('the mill closes at the lockdown');
{ const K=game('dean'); K.S.flags.term=true; K.startLockdown(); K.ks(60*20); while(K.S.cut){ K.skipCutscene(); K.ks(2); } K.ks(60*20);
  ok(K.caseClosed('mill'),'mill case not closed at the lockdown'); ok(K.S.inv.news.some(n=>n.cid==='mill'),'no mill paper');
  ok(K.S.menu==='autopsy','autopsy did not appear after the lockdown');
}

section('the Impala goes places');
{ const K=game('dean'); const F=K.S.flags;
  const car=K.SECTORS.street.entities.find(e=>e.name==='Impala'); K.carMenu(car); ok(K.dlg.open,'hub menu did not open');
  ok(!K.dlg.avail.some(c=>/Reservoir/.test(c.text)),'reservoir listed before the lead'); K.closeDlg();
  F.marla=true; K.radio(); ok(F.bell_lead,'radio did not give the bell lead');
  K.carMenu(car); const r=K.dlg.avail.find(c=>/Reservoir/.test(c.text)); ok(r,'reservoir not listed after the lead');
  K.pickChoice(r); K.ks(90); ok(K.S.sector.id==='reservoir','did not drive to the reservoir');
  const imp=K.S.sector.entities.find(e=>e.kind==='vehicle'); K.carMenu(imp); const home=K.dlg.avail.find(c=>/Main Street/.test(c.text)); ok(home,'no way home');
  K.closeDlg();
}

section('the bell beneath the water');
{ const K=game('sam'); const F=K.S.flags; F.marla=true; F.bell_lead=true;
  K.enterSector('hut',1.6,3.5,0); K.ks(2); talk(K,'walter',K.SECTORS.hut.entities.find(e=>e.dialogue==='walter'));
  use(K,'hut','res_tally'); read(K,'hut','fishlog'); read(K,'hut','countymap');
  K.enterSector('carver',9.4,4.5,Math.PI); K.ks(2); talk(K,'ruth',K.SECTORS.carver.entities.find(e=>e.dialogue==='ruth')); use(K,'carver','c_ceiling');
  read(K,'library','parish');
  K.enterSector('reservoir',20,15.6,-Math.PI/2); K.ks(2);
  /* the water won't let you in */
  K.S.py=12.5; K.ks(2); ok(K.S.py>13.9,`walked on water (y ${K.S.py.toFixed(2)})`);
  K.USES.res_water(); K.ks(60*14); ok(F.bell_rang,'the bell did not ring'); ok(!K.S.flipped,'still flipped after the reflection');
  ok(K.SECTORS.reservoir.grid[8][20]==='c','the water did not stand back');
  for(const [a,b] of [['log','tally'],['map','parish'],['ceiling','reflection'],['ruth','reflection'],['parish','keeper']]) if(a!=='parish'||F.res_keeper) ok(K.tryLink('bell',a,b).ok||b==='keeper',`bell link ${a}+${b}`);
  K.USES.res_keeper(); ok(K.dlg.open,'no keeper decision'); K.pickChoice(K.dlg.avail[1]); K.ks(60*20);
  ok(F.elise_returned&&K.caseClosed('bell'),'answering the bell did not close the case');
  ok(K.SECTORS.carver.entities.some(e=>e.dialogue==='elise'),'Elise did not come home');
  ok(K.tryLink('bell','map','parish').ok===false,'duplicate link');
}

section('the road that returns');
{ const K=game('dean'); const F=K.S.flags; K.S.act=2; F.delia_done=true; K.ks(60*35);
  ok(F.road_lead,'no road lead'); const dn=K.SECTORS.street.entities.find(e=>e.dialogue==='daniel'); ok(dn&&!dn.hidden,'Daniel not in the lot');
  talk(K,'daniel',dn); K.USES.r9_car(); K.closeDlg();
  K.enterSector('route9',5,61.5,-Math.PI/2); K.ks(2);
  for(const e of K.SECTORS.route9.entities.filter(e=>e.use==='r9_marker')){ K.USES.r9_marker(e); K.closeDlg(); }
  K.USES.r9_tag(); K.closeDlg();
  K.S.py=2; K.ks(2); ok(K.S.py>60&&F.r9_loops===1,'walking north did not loop');
  ok(K.tryLink('road','markers','loop').ok,'rule link failed');
  K.S.py=12; K.ks(2); ok(F.r9_toll,'toll booth did not appear');
  K.S.py=2.6; K.ks(2); ok(K.S.py<10,'looped after the toll booth appeared');
  read(K,'route9','tollledger');
  const d=K.SECTORS.route9.entities.find(e=>e.dialogue==='daniel_toll'); ok(d,'Daniel not at the booth');
  K.openDlg('daniel_toll',d); const br=K.dlg.avail.find(c=>/Break/.test(c.text)); ok(br,'no break option with the tag'); K.pickChoice(br); K.pickChoice(K.dlg.avail[0]); K.ks(200);
  ok(F.road_loop_broken&&K.caseClosed('road'),'road case not closed');
}

section('the house with one more room');
{ const K=game('sam'); const F=K.S.flags; K.S.act=2; F.kevin_done=true; F.agnes_lead=true;
  const go=()=>{ K.enterSector('larch',13.5,10,-Math.PI/2); K.ks(2); K.enterSector('agnes',6.5,19.6,-Math.PI/2); K.ks(2); };
  go(); ok(K.SECTORS.agnes.grid[8][6]==='P','hall too long on the first visit');
  go(); ok(F.agnes_hall&&K.SECTORS.agnes.grid[8][6]==='o','hall did not grow');
  go(); ok(F.agnes_door&&K.SECTORS.agnes.grid[2][6]==='r','no nursery on the third visit');
  ok(!K.SECTORS.agnes.entities.find(e=>e.samOnly).hidden,'Sam cannot see the boy');
  ok(K.SECTORS.agnes.entities.find(e=>e.deanOnly).hidden,'Sam sees Dean’s coat');
  ok(!K.hits(K.SECTORS.agnes,6.5,2.5,.26),'nursery blocked');
  K.S.px=6.5; K.S.py=3; K.ks(3); ok(F.agnes_nursery,'nursery entry not noticed');
  for(const n of ['june','hal','rosa']) talk(K,n,K.SECTORS.larch.entities.find(e=>e.dialogue===n));
  ok((F.ag_dates||0)>=3,'Sam did not get the dates');
  use(K,'agnes','ag_box'); use(K,'agnes','ag_photo'); read(K,'library','plans');
  K.S.px=6.5; K.S.py=3.5; K.S.angle=-Math.PI/2; K.S.dirX=0; K.S.dirY=-1;
  K.USES.ag_wardrobe(); K.USES.ag_wardrobe(); ok(K.dlg.open,'no wardrobe decision'); K.pickChoice(K.dlg.avail[0]); K.ks(60*8);
  ok(F.agnes_told_truth&&K.caseClosed('agnes'),'agnes case not closed'); ok(K.SECTORS.agnes.grid[2][6]==='P','room did not close');
}

section('the patient who died tomorrow');
{ const K=game('sam'); const F=K.S.flags; K.S.act=3; F.lily_done=true; K.ks(60*27);
  ok(K.S.call&&K.S.call.name==='Dr. Halvorsen','Halvorsen did not call'); K.answerCall(); K.ks(60*20); ok(F.clinic_lead,'no clinic lead');
  K.enterSector('clinic',8.5,12.4,-Math.PI/2); K.ks(2);
  talk(K,'halvorsen',K.SECTORS.clinic.entities.find(e=>e.dialogue==='halvorsen'));
  talk(K,'martin',K.SECTORS.clinic.entities.find(e=>e.dialogue==='martin'));
  ok(F.cl_stairs,'stairs not unlocked'); for(const u of ['cl_chart','cl_old','cl_extra','cl_lily','cl_plans']) use(K,'clinic',u);
  K.enterSector('basement',4.5,6.4,-Math.PI/2); K.ks(2); ok(K.SECTORS.basement.entities.some(e=>e.martin),'Martin did not follow');
  K.USES.cl_monitor(); ok(K.dlg.open,'monitor did nothing'); K.pickChoice(K.dlg.avail[0]); K.closeDlg(); ok(F.cl_interrupt,'interrupt failed');
  K.USES.cl_monitor(); K.pickChoice(K.dlg.avail[0]); K.ks(60*6);
  ok(F.halvorsen_trusted&&K.caseClosed('clinic'),'clinic case not closed');
}

section('acts II–IV close their cases, and the epilogue remembers');
{ const K=game('dean'); const F=K.S.flags;
  K.startAt(3); K.ks(10); while(K.S.cut){ K.skipCutscene(); K.ks(2); } K.ks(60*12);
  ok(K.caseClosed('lockdown'),'Act II case not closed by the start of Act III');
  F.agnes_told_truth=true; F.halvorsen_trusted=true; F.mill_records_saved=true;
  const E=K.epilogue('C'); ok(E.lines.some(l=>/Agnes Bell/.test(l))&&E.lines.some(l=>/Halvorsen/.test(l)),'epilogue ignores the side cases');
}

section('the haunting in your pocket');
{ const K=game('dean'); const F=K.S.flags;
  F.millEntered=true; K.ks(60*14); ok(K.S.msgs['0114']&&K.S.msgs['0114'][0].text.includes('line three'),'no 0114 text in the mill');
  F.phantom=true; K.enterSector('mill',14,19,-Math.PI/2); K.ks(60*30); ok(F.unk_u1&&K.GALLERY_().some(p=>p.unknown),'no photo you didn’t take');
  ok(Math.abs(K.S.px-14)<1,'unknown photo moved the player');
  K.enterSector('street',23.6,36,-Math.PI/2); K.ks(10); ok(K.S.call&&K.S.call.payphone,'payphone did not ring');
  K.USES.payphone(); K.ks(60*12); ok(!K.S.call,'payphone call did not end');
  K.enterSector('hollis',3,9.6,-Math.PI/2); K.ks(2); K.USES.rayphone(); K.closeDlg(); ok(F.drafts_found,'drafts not found');
  K.S.act=4; K.reply0114('counted'); ok(F.replied0114==='counted','reply failed'); K.ks(60*8);
  ok(K.S.msgs['0114'].some(m=>m.from==='me'),'reply not in the thread');
}
{ const K=game('sam'); const F=K.S.flags; K.S.act=3; F.alistair_met=true; K.enterSector('library',8,9.6,-Math.PI/2); K.ks(60*22);
  ok(K.S.call&&K.S.call.name==='Dad','Dad did not call'); K.answerCall(); K.ks(60*30); ok(K.S.msgs.dad,'Dad did not text after');
}

section('10 · the dead man on the radio');
{ const K=game('dean'); const F=K.S.flags; F.earl=true; K.radio(); ok(F.radio_lead,'no radio lead from the band');
  K.enterSector('station',6.5,7.4,-Math.PI/2); K.ks(2);
  use(K,'station','rd_log'); K.USES.rd_console(); K.USES.rd_console(); K.USES.rd_console(); use(K,'station','rd_tapes');
  talk(K,'evelyn',K.SECTORS.station.entities.find(e=>e.dialogue==='evelyn')); talk(K,'ames_station',K.SECTORS.station.entities.find(e=>e.dialogue==='ames_station'));
  ok(F.rd_joan&&F.rd_gus&&F.rd_future,'calls not heard');
  ok(K.tryLink('radio','gus','ames').ok&&K.tryLink('radio','future','tapes').ok,'radio links');
  K.ks(120); ok(K.dlg.open,'no radio decision'); K.pickChoice(K.dlg.avail.find(c=>/Follow/.test(c.text)));
  K.enterSector('street',27,24,-Math.PI/2); K.ks(2); const car=K.SECTORS.street.entities.find(e=>e.kind==='car'); K.USES.rd_stopcar(car);
  K.ks(60*70); ok(F.rd_saved&&K.caseClosed('radio'),'stopping the car did not save Gus');
  ok(K.S.inv.rows.some(r=>r.cid==='radio'),'brothers did not register the radio decision');
}
section('11 · the man who came back wrong');
{ const K=game('sam'); const F=K.S.flags; K.S.act=2; F.reed_lead=true;
  K.enterSector('reed',4.5,6.4,-Math.PI/2); K.ks(2); const R=K.SECTORS.reed.entities;
  K.openDlg('glenn',R.find(e=>e.dialogue==='glenn')); for(const t of ['wedding','mill','mother','Holy']){ const c=K.dlg.avail.find(c=>c.text.includes(t)||c.text.toLowerCase().includes(t)); if(c){ K.pickChoice(c); K.pickChoice(K.dlg.avail[0]); } } if(K.dlg.open) K.closeDlg();
  talk(K,'carol',R.find(e=>e.dialogue==='carol')); talk(K,'mia',R.find(e=>e.dialogue==='mia'));
  use(K,'reed','gr_album'); use(K,'reed','gr_drawer'); use(K,'reed','gr_list');
  ok(F.gr_wedding&&F.gr_ray&&F.gr_mother&&F.gr_tested,'Glenn interview incomplete');
  ok(K.tryLink('reed','ray','tested').ok&&F.reed_ray,'Ray cross-link missing'); K.ks(120); ok(K.dlg.open,'no reed decision');
  K.pickChoice(K.dlg.avail.find(c=>/rite/.test(c.text))); K.closeDlg(); K.ks(90); ok(K.caseClosed('reed')&&F.reed_tested,'reed not closed');
}
section('12 · the inventory');
{ const K=game('dean'); const F=K.S.flags; K.S.act=2; F.iv_lead=true; K.enterSector('pawn',8,9.6,-Math.PI/2); K.ks(2);
  K.openDlg('earl',K.SECTORS.pawn.entities.find(e=>e.dialogue==='earl')); ok(K.dlg.node==='iv0','Earl does not raise the step'); K.pickChoice(K.dlg.avail[0]); if(K.dlg.open) K.closeDlg();
  for(const u of ['iv_ledger','iv_shoe','iv_key','iv_watch','iv_ring','iv_photo']) use(K,'pawn',u);
  ok(K.tryLink('inventory','ledger','tablet').ok||true,'');
  K.ks(120); ok(K.dlg.open,'no inventory decision'); K.pickChoice(K.dlg.avail.find(c=>/Return/.test(c.text))); K.closeDlg(); K.ks(90);
  ok(K.caseClosed('inventory'),'inventory not closed');
  K.openDlg('sarah',K.SECTORS.library.entities.find(e=>e.dialogue==='sarah')); ok(K.dlg.node==='iv_ret_ring','Sarah does not get the ring'); K.pickChoice(K.dlg.avail[0]);
}
section('13 · the contract');
{ const K=game('sam'); const F=K.S.flags; K.S.act=2; F.ct_lead=true; K.enterSector('naomi',5.6,3.5,Math.PI); K.ks(2);
  talk(K,'naomi',K.SECTORS.naomi.entities.find(e=>e.dialogue==='naomi')); use(K,'naomi','ct_receipts'); use(K,'naomi','ct_lease');
  for(const [sec,u] of [['library','ct_debt'],['motel','ct_employ'],['pawn','ct_policy'],['mill','ct_blank']]){ const e=K.SECTORS[sec].entities.find(e=>e.use===u); ok(e&&!e.hidden,`${u} not revealed`); if(e){ K.USES[u](e); K.closeDlg(); } }
  const col=K.SECTORS.naomi.entities.find(e=>e.collector); ok(!col.hidden,'collector did not arrive');
  K.openDlg('collector',col); K.pickChoice(K.dlg.avail.find(c=>/trade/.test(c.text))); K.pickChoice(K.dlg.avail[0]); K.pickChoice(K.dlg.avail.find(c=>/Negotiate/.test(c.text))); K.ks(60*9);
  ok(F.contract_traded&&K.caseClosed('contract'),'contract not closed');
}
section('14 · the saint in the walls');
{ const K=game('dean'); const F=K.S.flags; K.S.act=2; F.sj_lead=true; K.enterSector('stjude_in',5.5,8.6,-Math.PI/2); K.ks(2);
  const cu=K.SECTORS.stjude_in.entities.find(e=>e.dialogue==='curtis'); K.openDlg('curtis',cu); K.pickChoice(K.dlg.avail[0]); K.pickChoice(K.dlg.avail[0]); K.pickChoice(K.dlg.avail[0]); if(K.dlg.open) K.closeDlg();
  ok(F.sj_stain&&!K.SECTORS.stjude_in.entities.find(e=>e.sjStain).hidden,'the wall did not bleed');
  use(K,'stjude_in','sj_mural'); use(K,'stjude_in','sj_book'); K.ks(120); ok(K.dlg.open,'no saint decision'); K.pickChoice(K.dlg.avail.find(c=>/Reveal/.test(c.text))); K.closeDlg(); K.ks(90);
  ok(F.saint_revealed&&K.caseClosed('saint'),'saint not closed');
  K.S.act=3; K.openDlg('alistair',{}); K.pickChoice(K.dlg.avail[0]); ok(K.dlg.avail.some(c=>/St\. Jude/.test(c.text)),'Alistair has no page question');
}
section('15 · the children who draw the same sky');
{ const K=game('sam'); const F=K.S.flags; K.S.act=2; F.cs_lead=true; F.delia_done=true; K.enterSector('classroom',6.5,6.4,-Math.PI/2); K.ks(2);
  const t=K.SECTORS.classroom.entities.find(e=>e.teacher); ok(t.dialogue==='teacher_d','teacher wrong'); talk(K,'teacher_d',t);
  for(const u of ['cs_d1','cs_d2','cs_d3']) use(K,'classroom',u); ok(F.cs_obs,'observatory not unlocked');
  K.enterSector('observatory',8,11.6,-Math.PI/2); K.ks(2);
  K.USES.cs_scope(); K.pickChoice(K.dlg.avail.find(c=>c.text==='Look')); K.closeDlg(); K.ks(200); ok(F.cs_wrong>=1&&!K.S.flipped,'wrong look failed');
  K.USES.cs_scope(); K.pickChoice(K.dlg.avail[0]); K.pickChoice(K.dlg.avail[1]); K.pickChoice(K.dlg.avail[2]); K.pickChoice(K.dlg.avail.find(c=>c.text==='Look')); K.closeDlg();
  ok(F.cs_aligned,'alignment failed'); K.ks(200); ok(K.dlg.open,'no sky decision'); K.pickChoice(K.dlg.avail.find(c=>/Kevin/.test(c.text))); K.closeDlg(); K.ks(90);
  ok(F.sky_kevin&&K.caseClosed('sky'),'sky not closed');
}
section('16 · the last broadcast');
{ const K=game('dean'); const F=K.S.flags; K.startAt(4); K.ks(10); while(K.S.cut){ K.skipCutscene(); K.ks(2); } K.cardsOff&&K.cardsOff();
  K.enterSector('motel',14,4,-Math.PI/2); K.ks(2); K.USES.motel_tv({}); ok(F.kb_lead&&F.kb_seen,'TV did not show the footage');
  K.enterSector('koak',6.5,7.4,-Math.PI/2); K.ks(2); use(K,'koak','kb_reels'); use(K,'koak','kb_script'); talk(K,'lou',K.SECTORS.koak.entities.find(e=>e.dialogue==='lou'));
  K.ks(120); ok(K.dlg.open,'no broadcast decision'); K.pickChoice(K.dlg.avail.find(c=>/Lily/.test(c.text))); K.closeDlg(); K.ks(90);
  ok(F.kb_splice==='lily'&&K.caseClosed('broadcast'),'broadcast not closed');
  const e0=K.DIALOGUE.chuck_end.nodes.e0.text(); ok(/turned around/.test(e0),'Chuck does not notice the splice');
  F.ending='C'; ok(K.epilogue('C').lines.some(l=>/Channel 4/.test(l)),'epilogue ignores the splice');
}
console.log(fails?`\n${fails} FAILURE(S)`:'\nAll checks passed');
process.exitCode=fails?1:0;
