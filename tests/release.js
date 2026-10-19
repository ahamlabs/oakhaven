/* Release checks: saves (versions, damage), settings, combat telegraphs,
   blocking, investigation v2 (trust, evolving notes, quality, the brothers). */
const {load,STORE}=require('./harness');
let fails=0; const ok=(c,m)=>{ if(!c){ console.log('  FAIL:',m); fails++; } };
const section=n=>console.log('\n— '+n);
function game(hero='dean'){ const K=load(); let t=0; K.ks=n=>{ for(let i=0;i<n;i++){ t+=16; K.frame(t); } }; K.begin(hero); K.ks(2); K.skipCutscene(); K.ks(4); return K; }

section('saves: versions, migration and damage');
{ const K=game('dean'); K.enterSector('library',8,9.6,-Math.PI/2); K.ks(2); ok(K.writeSave('1'),'save failed');
  const d=JSON.parse(STORE['oakhaven.save.1']); ok(d.build&&d.v===1,'save has no build/version');
  /* an older version is migrated */
  d.v=0; STORE['oakhaven.save.2']=JSON.stringify(d); ok(K.readSave('2')&&K.readSave('2').v===1,'v0 save not migrated');
  /* a newer version is reported, not dropped */
  d.v=99; STORE['oakhaven.save.3']=JSON.stringify(d); ok(!K.readSave('3')&&/newer/.test(K.saveDamaged('3')),'newer save not reported');
  /* corrupted JSON */
  STORE['oakhaven.save.quick']='{"v":1,"S":'; ok(!K.readSave('quick')&&/corrupted/.test(K.saveDamaged('quick')),'corrupted save not reported');
  /* missing parts */
  const m=JSON.parse(STORE['oakhaven.save.1']); delete m.sectors; STORE['oakhaven.save.3']=JSON.stringify(m); ok(/missing/.test(K.saveDamaged('3')||''),'incomplete save not reported');
  ok(/damaged/.test(K.slotLine('3',null).text),'slot line does not say damaged');
  /* a damaged autosave is never overwritten */
  STORE['oakhaven.save.auto']='garbage'; K.S.lastAuto=-99; ok(!K.writeSave('auto')&&STORE['oakhaven.save.auto']==='garbage','damaged autosave overwritten');
  delete STORE['oakhaven.save.auto'];
  /* a restore that throws hands over to a clean reload */
  const R=load(); const bad=JSON.parse(STORE['oakhaven.save.1']); bad.sectors={street:{grid:null}}; R.restore(bad); ok(R.__reloaded,'failed restore did not reload');
  for(const k of ['2','3','quick']) delete STORE['oakhaven.save.'+k];
}

section('settings persist and apply');
{ const K=game('sam'); K.S.settings.vol.music=.2; K.S.settings.textSize=1.45; K.S.settings.intensity=.3; K.saveSettings();
  const R=load(); ok(R.S.settings.vol.music===.2&&R.S.settings.textSize===1.45&&R.S.settings.intensity===.3,'settings not restored');
  ok(R.S.settings.vol.master===.8,'defaults lost when merging');
  K.openPause(); const st=K.dlg.avail.find(c=>c.text==='Settings'); ok(st,'no Settings in pause'); K.pickChoice(st); ok(K.S.settingsOpen,'settings did not open');
  K.inputDown('Escape'); ok(!K.S.settingsOpen,'Esc did not close settings');
  K.S.settings.intensity=1; K.S.settings.textSize=1; K.S.settings.vol.music=.55; K.saveSettings();
}

section('combat: telegraphs, whiffs, feedback');
{ const K=game('dean'); K.enterSector('mill',14,12,-Math.PI/2); K.ks(2);
  const sh=K.SECTORS.mill.entities.find(e=>e.etype==='ghost'&&e.kind==='enemy'); Object.assign(sh,{state:'hunt',hidden:false,x:14,y:11.2,cd:0});
  const hp=K.S.hp; K.ks(3); ok(sh.wind>0&&sh.tele,'no wind-up'); ok(K.S.hp===hp,'damage before the telegraph finished');
  K.S.py=14.5; K.ks(40); ok(K.S.hp===hp,'stepping back did not dodge');
  sh.cd=0; sh.x=14; sh.y=13.7; K.S.py=14.5; K.ks(45); ok(K.S.hp<hp,'standing still did not get hit');
  ok(K.S.hurtDirT>0||K.S.hurtDir!==undefined,'no damage direction');
  K.damageEnt(sh,5,'revolver'); ok(K.S.hitMark>0,'no hit marker');
}
{ const K=game('sam'); K.S.channel=.6; K.S.ward=0; K.hurtPlayer(5,null); ok(K.S.channel>0,'Sam’s chant broke on the first hit'); K.hurtPlayer(5,null); ok(K.S.channel===0,'second hit did not break it'); }

section('nobody blocks the way');
{ const K=game('dean'); K.enterSector('agnes',6.5,12.5,-Math.PI/2); K.ks(2);
  const C=K.COMP_(); C.x=6.5; C.y=11.4; K.S.angle=-Math.PI/2;
  for(let i=0;i<80;i++){ K.keys['KeyW']=true; K.ks(1); } K.keys['KeyW']=false;
  ok(K.S.py<11,`brother blocked the hall (y ${K.S.py.toFixed(2)})`);
}

section('witness trust');
{ const K=game('dean'); const F=K.S.flags; F.dwyer_found=true;
  const pe=K.SECTORS.pawn.entities.find(e=>e.dialogue==='peter'); K.openDlg('peter',pe); K.pickChoice(K.dlg.avail.find(c=>/tools/.test(c.text))); K.pickChoice(K.dlg.avail[0]); if(K.dlg.open) K.pickChoice(K.dlg.avail[0]); if(K.dlg.open) K.closeDlg();
  ok(K.trustOf('peter')<0,'threatening Peter did not cost trust'); ok(/won’t say/.test(K.CASES.shift.clues.peter.x()),'wary Peter still tells all');
}

section('the case file evolves');
{ const K=game('sam'); const F=K.S.flags;
  F.ray_named=true; K.ks(60); F.read_ledger14=true; F.used_fan=true; K.tryLink('mill','ledger14','fan'); K.ks(10);
  const n=K.S.notes.find(n=>n.id==='ray'); ok(n,'no ray note'); const v=K.noteView(n); ok(v.ann.length===1,'note not annotated by the deduction');
  K.commitTheory('mill','ghost'); K.closeCase('mill',{quiet:true}); const t=K.noteView(K.S.notes.find(n=>n.id==='theory_mill')); ok(t.struck,'wrong theory not struck through');
  ok(K.invQuality('mill')<.75&&/gaps|very little/.test(K.qualityLine('mill')),'quality line wrong');
  K.S.act=4; F.cas_open=true; F.delia_done=true; K.S.notes.push({id:'delia_freed',title:'x',text:'y'}); K.ks(10);
  ok(K.noteView(K.S.notes.find(n=>n.id==='delia_freed')).edited,'Act IV did not edit a note'); ok(K.S.notes.some(n=>n.id==='ch14'),'no unwritten chapter');
}

section('the brothers keep score');
{ const K=game('dean'); K.decide('shift','expose'); ok(K.S.inv.bond===1,'agreeing with Sam did not raise the bond');
  K.decide('agnes','keep'); ok(K.S.inv.bond===0,'disagreeing did not lower it');
  K.impalaTalk(); ok(K.S.inv.rows[0].said,'the car did not bring it up');
  K.S.flags.ending='C'; const E=K.epilogue('C'); ok(E.lines.some(l=>/radio|three hundred|county line/.test(l)),'no brothers line in the epilogue');
}

section('transcript');
{ const K=game('dean'); K.say('marla','Test line.'); ok(K.S.transcript.some(l=>l.text==='Test line.'&&l.nm==='Marla'),'transcript missing the line'); }

console.log(fails?`\n${fails} FAILURE(S)`:'\nAll checks passed'); process.exitCode=fails?1:0;
