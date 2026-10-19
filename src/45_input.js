/* ═══ Input: actions, bindings, gamepad ══════════════════════════════════════
   The game never asks "is W down?" — it asks "is `forward` held?". Each action
   has two keyboard/mouse slots and one gamepad slot, rebindable on the
   Controls page and saved in localStorage.

   Codes are strings:  KeyW, Digit1, ShiftLeft … (KeyboardEvent.code)
                       Mouse0 / Mouse1 / Mouse2   (left / middle / right)
                       WheelUp / WheelDown
                       Pad0 … Pad16               (W3C standard gamepad buttons)
   Sticks are analog and not rebindable: left moves (or steers), right looks.
   Escape is reserved: it always backs out of whatever is open, because the
   browser also uses it to release the mouse. */

const keys={}, mouse={l:false,r:false,lOnce:false};

const ACTIONS=[
  {id:'forward',  label:'Move forward',      group:'Movement', keys:['KeyW','ArrowUp'],       pad:null},
  {id:'back',     label:'Move back',         group:'Movement', keys:['KeyS','ArrowDown'],     pad:null},
  {id:'left',     label:'Strafe left',       group:'Movement', keys:['KeyA',null],            pad:null},
  {id:'right',    label:'Strafe right',      group:'Movement', keys:['KeyD',null],            pad:null},
  {id:'turnLeft', label:'Turn left',         group:'Movement', keys:['ArrowLeft',null],       pad:null},
  {id:'turnRight',label:'Turn right',        group:'Movement', keys:['ArrowRight',null],      pad:null},
  {id:'run',      label:'Run',               group:'Movement', keys:['ShiftLeft','ShiftRight'],pad:'Pad10'},
  {id:'jump',     label:'Jump',              group:'Movement', keys:['Space',null],           pad:'Pad0'},
  {id:'crouch',   label:'Crouch (hold)',     group:'Movement', keys:['KeyC','ControlLeft'],   pad:'Pad1'},

  {id:'fire',     label:'Fire / hold to chant', group:'Combat', keys:['Mouse0','KeyK'],       pad:'Pad7'},
  {id:'alt',      label:'Alt fire / next rite', group:'Combat', keys:['Mouse2',null],         pad:'Pad6'},
  {id:'special',  label:'Special move',      group:'Combat',   keys:['KeyQ',null],            pad:'Pad3'},
  {id:'kick',     label:'Kick',              group:'Combat',   keys:['KeyV',null],            pad:'Pad11'},
  {id:'nextWeapon',label:'Next weapon',      group:'Combat',   keys:['WheelDown',null],       pad:'Pad5'},
  {id:'prevWeapon',label:'Previous weapon',  group:'Combat',   keys:['WheelUp',null],         pad:'Pad4'},
  {id:'lastWeapon',label:'Last weapon',      group:'Combat',   keys:['KeyX',null],            pad:'Pad14'},
  {id:'cycleRite',label:'Cycle rite (journal)',group:'Combat', keys:['KeyT',null],            pad:'Pad15'},
  {id:'medkit',   label:'Use med kit',       group:'Combat',   keys:['KeyB',null],            pad:'Pad13'},
  ...[1,2,3,4,5,6,7].map(n=>({id:'weapon'+n,label:'Weapon '+n,group:'Weapons',keys:['Digit'+n,'Numpad'+n],pad:null})),

  {id:'interact', label:'Talk / use / car',  group:'World',    keys:['KeyE',null],            pad:'Pad2'},
  {id:'torch',    label:'Torch',             group:'World',    keys:['KeyF',null],            pad:'Pad12'},
  {id:'highBeam', label:'High beams (car)',  group:'World',    keys:['KeyH',null],            pad:null},

  {id:'map',      label:'Map',               group:'Interface',keys:['KeyM',null],            pad:'Pad8'},
  {id:'caseFile', label:'Case file',         group:'Interface',keys:['KeyJ',null],            pad:null},
  {id:'pause',    label:'Pause · save · load', group:'Interface',keys:['KeyP',null],           pad:'Pad9'},
  {id:'quick',    label:'Quick wheel (hold)',  group:'Interface',keys:['Tab','KeyG'],          pad:null},
  {id:'phone',    label:'Phone',               group:'Interface',keys:['KeyN',null],           pad:null},
  {id:'camera',   label:'Phone camera',        group:'Interface',keys:['KeyY',null],           pad:null},
  {id:'controls', label:'Controls (this page)',group:'Interface',keys:['KeyO','F1'],          pad:null},
  {id:'renderer', label:'Cycle renderer',    group:'Interface',keys:['KeyR',null],            pad:null},
  {id:'light',    label:'Cycle light',       group:'Interface',keys:['KeyL',null],            pad:null},
  {id:'skip',     label:'Skip cutscene',     group:'Interface',keys:['Enter','NumpadEnter'],  pad:'Pad0', ctx:'cut'},
];
const ACT_BY_ID=Object.fromEntries(ACTIONS.map(a=>[a.id,a]));
const RESERVED=new Set(['Escape']);

/* ── settings, saved ─────────────────────────────────────────────────────── */
const CTRL_KEY='oakhaven.controls.v1';
const CTRL_DEFAULT_OPTS={mouseSens:1, invertMouse:false, padSens:1, invertPad:false, deadzone:.18, rumble:true, cursorLook:false};
const CTRL={open:false, capture:null, msg:'', opts:{...CTRL_DEFAULT_OPTS}, bind:{}};
function defaultBindings(){ const b={}; for(const a of ACTIONS) b[a.id]={keys:[...a.keys], pad:a.pad}; return b; }
function loadControls(){
  CTRL.bind=defaultBindings();
  let saved=null; try{ saved=JSON.parse(localStorage.getItem(CTRL_KEY)||'null'); }catch(e){ saved=null; }
  if(saved&&saved.bind) for(const id in saved.bind) if(CTRL.bind[id]){
    const s=saved.bind[id]; if(Array.isArray(s.keys)) CTRL.bind[id].keys=[s.keys[0]??null,s.keys[1]??null]; if('pad' in s) CTRL.bind[id].pad=s.pad; }
  if(saved&&saved.opts) Object.assign(CTRL.opts,saved.opts);
}
function saveControls(){ try{ localStorage.setItem(CTRL_KEY,JSON.stringify({bind:CTRL.bind,opts:CTRL.opts})); }catch(e){} }
loadControls();

/* ── querying ───────────────────────────────────────────────────────────── */
function codesOf(id){ const b=CTRL.bind[id]; if(!b) return []; return [...b.keys,b.pad].filter(Boolean); }
function codeDown(c){ return !!keys[c]||(c==='Mouse0'&&mouse.l)||(c==='Mouse2'&&mouse.r); }
function held(id){ for(const c of codesOf(id)) if(codeDown(c)) return true; return false; }
function pressedOnce(id){ for(const c of codesOf(id)) if(keys['1'+c]||(c==='Mouse0'&&mouse.lOnce)) return true; return false; }
function actionsFor(code,ctx){ const out=[];
  for(const a of ACTIONS){ if((a.ctx||'play')!==ctx) continue; const b=CTRL.bind[a.id]; if(b.keys.includes(code)||b.pad===code) out.push(a.id); }
  return out; }
function clearHeld(){ for(const k in keys) keys[k]=false; mouse.l=mouse.r=mouse.lOnce=false; }

/* ── names for codes, for the page and for on-screen hints ──────────────── */
const PAD_NAMES=['A','B','X','Y','LB','RB','LT','RT','View','Menu','L-stick','R-stick','D-pad ↑','D-pad ↓','D-pad ←','D-pad →','Home'];
function codeLabel(c){
  if(!c) return '—';
  if(c.startsWith('Pad')) return PAD_NAMES[+c.slice(3)]||('Button '+c.slice(3));
  if(c==='Mouse0') return 'Left click'; if(c==='Mouse1') return 'Middle click'; if(c==='Mouse2') return 'Right click';
  if(c==='WheelUp') return 'Wheel ↑'; if(c==='WheelDown') return 'Wheel ↓';
  if(c.startsWith('Key')) return c.slice(3);
  if(c.startsWith('Digit')) return c.slice(5);
  if(c.startsWith('Numpad')) return 'Num '+c.slice(6);
  if(c.startsWith('Arrow')) return {ArrowUp:'↑',ArrowDown:'↓',ArrowLeft:'←',ArrowRight:'→'}[c];
  return {ShiftLeft:'L-Shift',ShiftRight:'R-Shift',ControlLeft:'L-Ctrl',ControlRight:'R-Ctrl',AltLeft:'L-Alt',AltRight:'R-Alt',
          Space:'Space',Enter:'Enter',Backspace:'Backspace',Tab:'Tab',CapsLock:'Caps',Backquote:'`',Minus:'-',Equal:'=',
          BracketLeft:'[',BracketRight:']',Semicolon:';',Quote:"'",Comma:',',Period:'.',Slash:'/',Backslash:'\\',NumpadEnter:'Num Enter'}[c]||c;
}
/* the binding to show in a hint: the pad button if the pad was used last */
function keyName(id,prefer){
  const b=CTRL.bind[id]; if(!b) return '?';
  if((prefer||S.lastInput)==='pad'&&b.pad) return codeLabel(b.pad);
  const k=b.keys.find(Boolean); return k?codeLabel(k):(b.pad?codeLabel(b.pad):'unbound');
}

/* ── gamepad ─────────────────────────────────────────────────────────────── */
const PAD={idx:null, prev:[], mx:0, my:0, lx:0, ly:0, lt:0, rt:0, id:''};
addEventListener('gamepadconnected',e=>{ PAD.idx=e.gamepad.index; PAD.id=e.gamepad.id; try{ toast('Controller connected — Menu button for controls'); }catch(_){} renderControls(); });
addEventListener('gamepaddisconnected',e=>{ if(PAD.idx===e.gamepad.index){ PAD.idx=null; clearHeld(); try{ toast('Controller disconnected'); }catch(_){} } renderControls(); });
function dz(v){ const d=CTRL.opts.deadzone; return Math.abs(v)<d?0:Math.sign(v)*(Math.abs(v)-d)/(1-d); }
function pollPad(dt){
  if(PAD.idx===null||!navigator.getGamepads) { PAD.mx=PAD.my=PAD.lx=PAD.ly=0; return; }
  const gp=navigator.getGamepads()[PAD.idx]; if(!gp) return;
  gp.buttons.forEach((b,i)=>{ const on=b.pressed||b.value>.5, was=!!PAD.prev[i]; PAD.prev[i]=on;
    if(on&&!was){ S.lastInput='pad'; inputDown('Pad'+i,null); }
    if(!on&&was) inputUp('Pad'+i); });
  const ax=gp.axes||[];
  PAD.mx=dz(ax[0]||0); PAD.my=dz(ax[1]||0); PAD.lx=dz(ax[2]||0); PAD.ly=dz(ax[3]||0);
  PAD.lt=gp.buttons[6]?gp.buttons[6].value:0; PAD.rt=gp.buttons[7]?gp.buttons[7].value:0;
  if(PAD.mx||PAD.my||PAD.lx||PAD.ly) S.lastInput='pad';
  /* right stick looks; ease-in curve keeps small corrections precise */
  if(S.running&&!S.cut&&!CTRL.open&&!dlg.open&&!S.menu&&!S.mapOpen&&!S.caseOpen){
    const cv=v=>Math.sign(v)*v*v, sens=CTRL.opts.padSens;
    if(S.driving) S.angle+=cv(PAD.lx)*dt*1.2*sens;
    else { S.angle+=cv(PAD.lx)*dt*3.2*sens;
      if(MODE.pitch==='shear') S.pitch=clamp(S.pitch+cv(PAD.ly)*dt*IH*1.1*sens*(CTRL.opts.invertPad?1:-1),-IH*.28,IH*.28); }
  }
}
function rumble(strength=.5,ms=120){
  if(!CTRL.opts.rumble||PAD.idx===null||!navigator.getGamepads) return;
  const gp=navigator.getGamepads()[PAD.idx], va=gp&&gp.vibrationActuator;
  try{ if(va&&va.playEffect) va.playEffect('dual-rumble',{duration:ms,strongMagnitude:strength,weakMagnitude:strength*.6}); }catch(e){}
}

/* ── the one entry point for every press ─────────────────────────────────── */
const PRESS={
  interact:()=>interact(), torch:()=>toggleTorch(), renderer:()=>cycleRenderer(), light:()=>cyclePreset(),
  map:()=>{ S.mapOpen=!S.mapOpen; if(S.mapOpen) document.exitPointerLock?.(); },
  caseFile:()=>openJournal(),
  highBeam:()=>{ if(S.driving){ S.highBeam=!S.highBeam; toast(S.highBeam?'High beams':'Low beams'); } },
  special:()=>special(), kick:()=>kick(), medkit:()=>useMedkit(), lastWeapon:()=>selectWeapon(S.lastWeapon),
  cycleRite:()=>{ if(S.weapon==='journal') cycleRite(); }, jump:()=>jump(),
  alt:()=>{ if(!S.driving) altFire(); },
  nextWeapon:()=>{ if(!S.driving) cycleWeapon(1); }, prevWeapon:()=>{ if(!S.driving) cycleWeapon(-1); },
  controls:()=>openControls(), pause:()=>openPause(),
  quick:()=>openWheel(), phone:()=>openPhone(), camera:()=>startCamera(false),
};
for(let n=1;n<=7;n++) PRESS['weapon'+n]=()=>selectWeapon(WEAPON_ORDER[n-1]);

function inputDown(code,e){
  if(CTRL.capture){ captureCode(code,e); return; }
  if(!keys[code]) keys['1'+code]=true;
  keys[code]=true;
  if(code==='Mouse0'){ mouse.l=true; mouse.lOnce=true; } if(code==='Mouse2') mouse.r=true;
  if(CTRL.open){ if(code==='Escape'||actionsFor(code,'play').includes('controls')||code==='Pad1'||code==='Pad9') closeControls(); return; }
  if(!S.running){ if(actionsFor(code,'play').includes('controls')) openControls(); return; }
  const esc=code==='Escape';
  if(S.cut){ if(esc||actionsFor(code,'cut').includes('skip')||code==='Pad9') skipCutscene(); return; }
  if(S.menu==='shop'){ if(code==='Pad1') { closeShop(); return; } if(e) shopKey(e); else if(esc) closeShop(); return; }
  if(S.menu==='autopsy'){ if(esc||code==='Enter'||code==='Pad0'||code==='Pad1') autopsyNext(); return; }
  if(dlg.open){ dlgCode(code,e); return; }
  if(S.phoneOpen){ phoneCode(code,e); return; }
  const acts=actionsFor(code,'play');
  if(S.mapOpen&&(esc||acts.includes('map')||code==='Pad1')){ S.mapOpen=false; return; }
  if(S.caseOpen&&(esc||acts.includes('caseFile')||code==='Pad1')){ closeJournal(); return; }
  if(S.mapOpen||S.caseOpen){ if(acts.includes('controls')) openControls(); return; }
  if(S.wheel){ wheelCode(code); return; }
  if(S.camMode){ cameraCode(code,acts,esc); return; }
  if(esc){ openPause(); return; }
  for(const a of acts){ if(a==='fire'||a==='run'||a==='crouch') continue; PRESS[a]?.(); }
}
function inputUp(code){
  keys[code]=false;
  if(S.wheel&&actionsFor(code,'play').includes('quick')) closeWheel(true);
  if(code==='Mouse0') mouse.l=false; if(code==='Mouse2') mouse.r=false;
}
/* dialogue: number keys or the pad's face buttons pick choices 1–4 */
function dlgCode(code,e){
  let i=['Digit1','Digit2','Digit3','Digit4','Digit5','Digit6'].indexOf(code);
  if(i<0) i=['Numpad1','Numpad2','Numpad3','Numpad4','Numpad5','Numpad6'].indexOf(code);
  if(i<0) i=['Pad0','Pad1','Pad2','Pad3'].indexOf(code);
  if(i>=0&&dlg.avail?.[i]){ e?.preventDefault?.(); pickChoice(dlg.avail[i]); return; }
  if(code==='Escape'||code==='Pad9') closeDlg();
}

/* ── the Controls page ──────────────────────────────────────────────────── */
function openControls(){
  CTRL.open=true; CTRL.capture=null; CTRL.msg=''; clearHeld(); document.exitPointerLock?.();
  document.getElementById('ctrl').classList.add('on'); renderControls();
}
function closeControls(){
  CTRL.open=false; CTRL.capture=null; clearHeld(); saveControls();
  document.getElementById('ctrl').classList.remove('on'); refreshKeyHelp();
}
function startCapture(id,slot){ CTRL.capture={id,slot}; CTRL.msg=''; renderControls(); }
function captureCode(code,e){
  e?.preventDefault?.();
  const {id,slot}=CTRL.capture, b=CTRL.bind[id], isPad=slot==='pad';
  if(code==='Escape'){ CTRL.capture=null; CTRL.msg='Cancelled.'; renderControls(); return; }
  if(code==='Backspace'||code==='Delete'){ if(isPad) b.pad=null; else b.keys[slot]=null; CTRL.capture=null; CTRL.msg=`${ACT_BY_ID[id].label}: slot cleared.`; saveControls(); renderControls(); return; }
  if(isPad!==code.startsWith('Pad')){ CTRL.msg=isPad?'That slot takes a controller button — press one on the pad (Esc cancels).':'That slot takes a key or mouse button (Esc cancels).'; renderControls(); return; }
  if(RESERVED.has(code)){ CTRL.msg='Escape is reserved — it always backs out.'; renderControls(); return; }
  /* one code, one action per context: take it from whoever had it */
  const ctx=ACT_BY_ID[id].ctx||'play', moved=[];
  for(const a of ACTIONS){ if(a.id===id||(a.ctx||'play')!==ctx) continue; const o=CTRL.bind[a.id];
    o.keys=o.keys.map(k=>{ if(k===code){ moved.push(a.label); return null; } return k; });
    if(o.pad===code){ o.pad=null; moved.push(a.label); } }
  if(isPad) b.pad=code; else { b.keys[slot]=code; if(b.keys[1-slot]===code) b.keys[1-slot]=null; }
  CTRL.capture=null;
  CTRL.msg=`${ACT_BY_ID[id].label} → ${codeLabel(code)}`+(moved.length?`  ·  removed from ${moved.join(', ')} — rebind it if you still need it`:'');
  saveControls(); renderControls();
}
function resetControls(which){
  if(which==='all'||which==='keys'){ const d=defaultBindings(); for(const id in d) CTRL.bind[id].keys=d[id].keys; }
  if(which==='all'||which==='pad'){ const d=defaultBindings(); for(const id in d) CTRL.bind[id].pad=d[id].pad; }
  if(which==='all') CTRL.opts={...CTRL_DEFAULT_OPTS};
  CTRL.msg=which==='pad'?'Controller buttons reset to defaults.':which==='keys'?'Keys and mouse reset to defaults.':'Everything reset to defaults.';
  saveControls(); renderControls();
}
function unboundActions(){ return ACTIONS.filter(a=>!codesOf(a.id).length).map(a=>a.label); }
function renderControls(){
  const host=document.getElementById('ctrlBody'); if(!host||!CTRL.open) return;
  const o=CTRL.opts, cap=CTRL.capture;
  const groups=[...new Set(ACTIONS.map(a=>a.group))];
  const slot=(a,s)=>{ const b=CTRL.bind[a.id], code=s==='pad'?b.pad:b.keys[s], live=cap&&cap.id===a.id&&cap.slot===s;
    return `<button class="bind${live?' live':''}${code?'':' empty'}${s==='pad'?' pad':''}" data-id="${a.id}" data-slot="${s}">${live?(s==='pad'?'press a pad button…':'press a key…'):codeLabel(code)}</button>`; };
  let h=`<div class="ctrlTop"><div class="padState">${PAD.idx!==null?`🎮 ${PAD.id.slice(0,46)||'Controller'} connected`:'No controller detected — press any button on a connected pad'}</div>
    <div class="ctrlBtns"><button data-reset="keys">Reset keys</button><button data-reset="pad">Reset pad</button><button data-reset="all">Reset all</button><button class="done" data-close>Done</button></div></div>`;
  h+=`<div class="ctrlMsg">${CTRL.msg||(cap?'Press the new input. Esc cancels · Backspace clears the slot.':'Click a slot, then press the key, mouse button, wheel or pad button you want.')}</div>`;
  h+='<div class="ctrlCols"><div class="ctrlTable">';
  for(const g of groups){
    h+=`<div class="gHead"><span>${g}</span><span>Key / mouse</span><span>Alternate</span><span>Controller</span></div>`;
    for(const a of ACTIONS.filter(x=>x.group===g)) h+=`<div class="row"><span class="lab">${a.label}</span>${slot(a,0)}${slot(a,1)}${slot(a,'pad')}</div>`;
  }
  h+='</div><div class="ctrlSide">';
  const rng=(k,lab,min,max,step,fmt)=>`<label class="opt"><span>${lab}<b>${fmt(o[k])}</b></span><input type="range" min="${min}" max="${max}" step="${step}" value="${o[k]}" data-opt="${k}"></label>`;
  const chk=(k,lab)=>`<label class="opt chk"><input type="checkbox" data-opt="${k}" ${o[k]?'checked':''}><span>${lab}</span></label>`;
  h+='<div class="gHead"><span>Mouse</span></div>'+rng('mouseSens','Look sensitivity',.25,3,.05,v=>(+v).toFixed(2)+'×')+chk('invertMouse','Invert vertical look')
    +chk('cursorLook','Camera follows the cursor (no mouse lock — move the pointer to look, push it to an edge to keep turning)');
  h+='<div class="gHead"><span>Controller</span></div>'+rng('padSens','Stick look speed',.25,3,.05,v=>(+v).toFixed(2)+'×')+rng('deadzone','Stick deadzone',.05,.45,.01,v=>Math.round(v*100)+'%')+chk('invertPad','Invert vertical look')+chk('rumble','Rumble on hits and shots');
  h+=`<div class="gHead"><span>Fixed</span></div><div class="fixed">Left stick: move · steer<br>Right stick: look<br>RT / LT while driving: throttle / brake<br>Dialogue: 1–4 or A / B / X / Y<br>Esc or B: back out of any screen</div>`;
  const ub=unboundActions(); if(ub.length) h+=`<div class="warn">Unbound: ${ub.join(', ')}</div>`;
  h+='</div></div>';
  host.innerHTML=h;
  host.querySelectorAll('.bind').forEach(el=>el.onclick=ev=>{ ev.stopPropagation(); const s=el.dataset.slot; startCapture(el.dataset.id,s==='pad'?'pad':+s); });
  host.querySelectorAll('[data-reset]').forEach(el=>el.onclick=()=>resetControls(el.dataset.reset));
  host.querySelectorAll('[data-close]').forEach(el=>el.onclick=()=>closeControls());
  host.querySelectorAll('input[data-opt]').forEach(el=>{
    el.oninput=()=>{ CTRL.opts[el.dataset.opt]=el.type==='checkbox'?el.checked:+el.value; applyCursorMode(); const b=el.parentElement.querySelector('b');
      if(b){ const k=el.dataset.opt; b.textContent=k==='deadzone'?Math.round(el.value*100)+'%':(+el.value).toFixed(2)+'×'; } saveControls(); };
    el.onchange=el.oninput; });
}
/* while capturing, mouse buttons and the wheel on the page are bindable too */
function ctrlMouse(e){ if(!CTRL.capture) return;
  if(e.target&&e.target.closest&&e.target.closest('.ctrlBtns')){ CTRL.capture=null; return; }
  e.preventDefault(); e.stopPropagation(); captureCode('Mouse'+e.button,e); }

/* the boot screen's key help is generated from the live bindings */
function refreshKeyHelp(){
  for(const [id,a,lab] of [['gObj','map','Objective'],['gMode','renderer','Renderer'],['gLight','light','Light']]){
    const b=document.querySelector('#'+id+' b'); if(b) b.textContent=`${lab} (${keyName(a,'kb')})`; }
  const el=document.getElementById('keys'); if(!el) return;
  const k=id=>`<em>${keyName(id,'kb')}</em>`;
  el.innerHTML=`${k('forward')}${k('left')}${k('back')}${k('right')} move · <em>mouse</em> look · ${k('run')} run · ${k('jump')} jump · ${k('crouch')} crouch ·
    ${k('fire')} fire / hold to chant · ${k('alt')} next rite / alt<br>
    <em>1–7</em> weapons · ${k('nextWeapon')}/${k('prevWeapon')} cycle · ${k('lastWeapon')} last weapon · ${k('special')} special · ${k('kick')} kick ·
    ${k('medkit')} med kit · ${k('torch')} torch · ${k('interact')} interact<br>
    ${k('renderer')} renderer · ${k('light')} light · ${k('map')} map · ${k('caseFile')} case file · ${k('highBeam')} high beams · ${k('skip')} skip cutscene ·
    ${k('controls')} <em>controls</em>`;
}

document.getElementById('openCtrl')?.addEventListener('click',()=>openControls());
document.getElementById('ctrl')?.addEventListener('mousedown',ctrlMouse,true);
refreshKeyHelp();
