/* ═══ Cursor camera and the quick wheel ═════════════════════════════════════
   Cursor camera: with the option on, the mouse is never captured. Moving the
   pointer turns the view, and holding it near the left or right edge keeps
   turning, so you can play in a window beside other things.

   Quick wheel: hold Tab (or G). Time slows to a crawl while it's open. Point
   with the mouse, the right stick or a number key; let go to use it. */

function applyCursorMode(){
  const vp=document.getElementById('vp'); if(!vp||!vp.style) return;
  vp.style.cursor=CTRL.opts.cursorLook?'crosshair':'';
  if(CTRL.opts.cursorLook&&document.pointerLockElement) document.exitPointerLock?.();
}
function cursorEdgeTurn(dt){
  if(!CTRL.opts.cursorLook||!mouse.inside||!S.running||S.cut||dlg.open||S.menu||CTRL.open||S.wheel||S.phoneOpen) return;
  const e=.07, k=2.4*CTRL.opts.mouseSens;
  if(mouse.nx<e) S.angle-=k*dt*(1-mouse.nx/e);
  else if(mouse.nx>1-e) S.angle+=k*dt*(1-(1-mouse.nx)/e);
}
applyCursorMode();

const WHEEL_ITEMS=[
  {id:'phone',  label:'Phone',      hint:'Messages, gallery, notes',  act:()=>openPhone()},
  {id:'camera', label:'Camera',     hint:'Photos and selfies',        act:()=>startCamera(false)},
  {id:'medkit', label:'Med kit',    hint:()=>`${S.meds} left`,        act:()=>useMedkit()},
  {id:'torch',  label:'Torch',      hint:()=>`${Math.ceil(S.battery)}% battery`, act:()=>toggleTorch()},
  {id:'map',    label:'Map',        hint:'Objectives and places',     act:()=>{ S.mapOpen=true; document.exitPointerLock?.(); }},
  {id:'case',   label:'Case file',  hint:'What you’ve learned',       act:()=>openJournal()},
  {id:'qsave',  label:'Quicksave',  hint:()=>canSave()?'Save now':'Not right now', act:()=>{ if(writeSave('quick')){ toast('Quicksaved'); showSaveIcon(); } else toast('You can’t save right now'); }},
  {id:'pause',  label:'Pause',      hint:'Save, load, controls',      act:()=>openPause()},
];
function openWheel(){
  if(!S.running||S.cut||dlg.open||S.menu||S.driving||S.camMode||S.phoneOpen) return;
  S.wheel={sel:-1,ax:0,ay:0,t:0}; breakRite('released'); sfx('switch');
}
function wheelAim(){ const w=S.wheel; if(!w) return;
  const l=Math.hypot(w.ax,w.ay); if(l>140){ w.ax*=140/l; w.ay*=140/l; }
  if(l<22) return;
  const a=Math.atan2(w.ay,w.ax)+Math.PI/2; w.sel=((Math.round(a/(Math.PI*2/8))%8)+8)%8; }
function wheelCode(code){
  const n=['Digit1','Digit2','Digit3','Digit4','Digit5','Digit6','Digit7','Digit8'].indexOf(code);
  if(n>=0){ S.wheel.sel=n; closeWheel(true); return; }
  if(code==='Mouse0'||code==='Pad0'||code==='Enter') closeWheel(true);
  if(code==='Escape'||code==='Mouse2'||code==='Pad1') closeWheel(false);
}
function closeWheel(use){
  const w=S.wheel; S.wheel=null; clearHeld();
  if(use&&w&&w.sel>=0){ sfx('pickup'); WHEEL_ITEMS[w.sel].act(); }
}
function updateWheelPad(){ const w=S.wheel; if(!w||(!PAD.lx&&!PAD.ly)) return; w.ax=PAD.lx*100; w.ay=PAD.ly*100; wheelAim(); }
function drawWheel(dt){
  const w=S.wheel; if(!w) return; w.t+=dt;
  const W=over.width, H=over.height, u=H/200, cx=W/2, cy=H/2, R=58*u, r0=20*u, a0=Math.min(1,w.t*6);
  octx.save(); octx.globalAlpha=a0;
  octx.fillStyle='rgba(4,5,6,.55)'; octx.fillRect(0,0,W,H);
  for(let i=0;i<8;i++){
    const a=(i/8)*Math.PI*2-Math.PI/2, s0=a-Math.PI/8+.02, s1=a+Math.PI/8-.02, sel=i===w.sel;
    octx.beginPath(); octx.arc(cx,cy,R,s0,s1); octx.arc(cx,cy,r0,s1,s0,true); octx.closePath();
    octx.fillStyle=sel?'rgba(217,164,65,.92)':'rgba(14,18,21,.88)'; octx.fill();
    octx.strokeStyle='rgba(120,130,136,.35)'; octx.lineWidth=1; octx.stroke();
    const it=WHEEL_ITEMS[i], lx=cx+Math.cos(a)*(R+r0)/2, ly=cy+Math.sin(a)*(R+r0)/2;
    txt(it.label,lx,ly-2*u,5.4*u,sel?'#0b0705':'#e8dcc4','center','middle');
    txt(String(i+1),lx,ly+5*u,3.8*u,sel?'#3a2a10':'#5d6b73','center','middle');
  }
  const it=w.sel>=0?WHEEL_ITEMS[w.sel]:null;
  txt(it?it.label:'Point to choose',cx,cy-3*u,5*u,'#e8dcc4','center','middle');
  if(it){ const h=typeof it.hint==='function'?it.hint():it.hint; txt(h,cx,cy+4*u,3.8*u,'#8b95a0','center','middle'); }
  txt('let go to use · Esc or right-click to cancel',cx,cy+R+8*u,4.2*u,'rgba(150,160,170,.75)','center','middle');
  octx.restore();
}
