/* ═══ The phone ═════════════════════════════════════════════════════════════
   N opens it, Y goes straight to the camera. Apps: Camera, Gallery, Messages,
   Notes, Flashlight. The world doesn't stop while you look at a screen.

   Photos are kept in a gallery that outlives a single run (IndexedDB, with
   an in-memory fallback). From the gallery a photo can be saved to the real
   device, set as the wallpaper, or shown to whoever you're standing next to.

   The camera sees what you can't. The six men who died, and the girl nobody
   counted, are still standing where it happened, and only the lens shows
   them. The viewfinder hums when one is near. */

/* ── storage ──────────────────────────────────────────────────────────── */
let GALLERY=[];
const PHONE_DB={db:null};
function dbOpen(){ return new Promise(res=>{ try{ if(!window.indexedDB) return res(null);
  const r=indexedDB.open('oakhaven-phone',1);
  r.onupgradeneeded=()=>r.result.createObjectStore('photos',{keyPath:'id'});
  r.onsuccess=()=>{ PHONE_DB.db=r.result; res(r.result); }; r.onerror=()=>res(null); }catch(e){ res(null); } }); }
function dbTx(mode,fn){ const db=PHONE_DB.db; if(!db) return; try{ const t=db.transaction('photos',mode); fn(t.objectStore('photos')); }catch(e){} }
function loadGallery(){ dbOpen().then(db=>{ if(!db) return; dbTx('readonly',st=>{ const r=st.getAll();
  r.onsuccess=()=>{ GALLERY=(r.result||[]).sort((a,b)=>b.t-a.t); if(S.phoneOpen) phoneRender(); }; }); }); }
function storePhoto(p){ GALLERY.unshift(p); dbTx('readwrite',st=>st.put(p)); }
function deletePhoto(id){ GALLERY=GALLERY.filter(p=>p.id!==id); dbTx('readwrite',st=>st.delete(id)); }
function wipeGallery(){ GALLERY=[]; dbTx('readwrite',st=>st.clear()); }
function hasPhoto(subj){ return GALLERY.some(p=>p.subjects&&p.subjects.includes(subj)); }
loadGallery();

/* ── messages ──────────────────────────────────────────────────────────── */
S.msgs={}; S.msgUnread=0;
const THREADS={ '0114':'(541) 555-0114', kevin:'Kevin Tran', crowley:'Crowley', dad:'Dad', marla:'Marla (motel)', halvorsen:'Dr. Halvorsen' };
function msg(th,text,o={}){
  const T=S.msgs[th]||(S.msgs[th]=[]);
  T.push({from:o.me?'me':'them',text,t:Date.now(),photo:o.photo||null,act:S.act});
  if(!o.me){ S.msgUnread++; S.unreadThread=th; sfx('buzz'); rumble(.3,140);
    toast(`📱  ${THREADS[th]||th}: ${text.length>44?text.slice(0,42)+'…':text}`); }
  if(S.phoneOpen) phoneRender();
}

/* ── the phone screen ─────────────────────────────────────────────────── */
const PHN={screen:'home', photo:null, thread:null};
const elPhone=(()=>{ const vp=document.getElementById('vp'); const d=document.createElement('div'); d.id='phone';
  d.innerHTML='<div class="ph-body"><div class="ph-status"><span id="phClock"></span><span class="sig">no service</span><span id="phBatt"></span></div><div class="ph-screen" id="phScreen"></div><button class="ph-home" id="phHome" aria-label="Home"></button></div>';
  vp&&vp.appendChild&&vp.appendChild(d); return d; })();
function phoneClock(){
  /* it is always twenty to three. In the fold, it starts counting down. */
  if(S.act>=3){ const m=Math.max(0,40-Math.floor((S.time-(S.actStart||0))/90)); return `2:${String(m).padStart(2,'0')} AM`; }
  return '2:40 AM';
}
let openPhone=function(screen){
  if(!S.running||S.cut||dlg.open||S.menu||S.driving) return;
  if(S.wheel) S.wheel=null;
  S.phoneOpen=true; PHN.screen=screen||'home'; PHN.photo=null; clearHeld();
  document.exitPointerLock?.(); elPhone.classList.add('on'); sfx('switch'); phoneRender();
};
function closePhone(){ S.phoneOpen=false; elPhone.classList.remove('on'); clearHeld(); }
function phoneBack(){ if(PHN.screen==='photo') PHN.screen='gallery'; else if(PHN.screen==='thread') PHN.screen='messages'; else if(PHN.screen==='article') PHN.screen='news'; else if(PHN.screen==='home') return closePhone(); else PHN.screen='home'; phoneRender(); }
function phoneCode(code,e){
  if(code==='Escape'||code==='Backspace'||code==='Pad1'){ e?.preventDefault?.(); phoneBack(); return; }
  if(actionsFor(code,'play').includes('phone')){ closePhone(); return; }
  if(actionsFor(code,'play').includes('camera')){ startCamera(false); return; }
}
const esc_=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function phoneRender(){
  const sc=document.getElementById('phScreen'); if(!sc) return;
  const ck=document.getElementById('phClock'); if(ck) ck.textContent=phoneClock();
  const bt=document.getElementById('phBatt'); if(bt) bt.textContent=`${Math.ceil(S.battery)}%`;
  let h='';
  if(PHN.screen==='home'){
    const wp=GALLERY.find(p=>p.id===S.wallpaper);
    h+=`<div class="ph-wall"${wp?` style="background-image:url(${wp.thumb})"`:''}><div class="ph-time">${phoneClock().replace(' AM','')}</div><div class="ph-date">${S.act>=3?'Oct ██':'Saturday, October 3'}</div></div>`;
    const unread=Object.values(S.msgs).flat().filter(m=>m.from==='them'&&!m.read).length;
    const apps=[['camera','Camera','◉'],['gallery','Gallery','▣'],['messages','Messages','✉',unread],['notes','Notes','≡'],['news','News','▥',S.newsUnread||0],['journal','Journal','✦'],['torch','Flashlight',S.torchOn?'☀':'☼']];
    h+='<div class="ph-apps">'+apps.map(([id,n,g,b])=>`<button class="ph-app" data-app="${id}"><i>${g}</i>${b?`<em>${b}</em>`:''}<span>${n}</span></button>`).join('')+'</div>';
  }
  if(PHN.screen==='gallery'){
    h+=`<div class="ph-head"><button data-back>‹</button><b>Gallery</b><span>${GALLERY.length}</span></div>`;
    if(!GALLERY.length) h+='<div class="ph-empty">No photos yet.<br><br>Open the Camera, or press Y.</div>';
    h+='<div class="ph-grid">'+GALLERY.map(p=>`<button class="ph-th${p.unknown?' unk':''}" data-photo="${p.id}" style="background-image:url(${p.thumb})">${p.selfie?'<i>◐</i>':''}${p.unknown?'<i>?</i>':''}</button>`).join('')+'</div>';
  }
  if(PHN.screen==='photo'){
    const p=GALLERY.find(x=>x.id===PHN.photo); if(!p){ PHN.screen='gallery'; return phoneRender(); }
    const near=showTarget(), can=near&&evidenceFor(near,p);
    h+=`<div class="ph-head"><button data-back>‹</button><b>${p.unknown?'Unknown':p.selfie?'Selfie':'Photo'}</b><span></span></div>`;
    h+=`<div class="ph-view"><img src="${p.data}" alt="">${selfieHaunt(p)}</div>`;
    h+=`<div class="ph-cap">${esc_(p.caption||'')}<br><small>${esc_(p.place||'')} · ${esc_(p.chapter||'')}</small></div>`;
    h+='<div class="ph-acts">'+(can?`<button data-show>Show ${esc_(near.name||'them')}</button>`:'')
      +'<button data-dl>Save to device</button><button data-wall>Wallpaper</button><button data-del>Delete</button></div>';
  }
  if(PHN.screen==='messages'){
    h+=`<div class="ph-head"><button data-back>‹</button><b>Messages</b><span></span></div>`;
    const ths=Object.keys(S.msgs).sort((a,b)=>S.msgs[b].at(-1).t-S.msgs[a].at(-1).t);
    if(!ths.length) h+='<div class="ph-empty">No messages.</div>';
    h+=ths.map(th=>{ const L=S.msgs[th].at(-1), un=S.msgs[th].some(m=>m.from==='them'&&!m.read);
      return `<button class="ph-row${un?' un':''}" data-thread="${th}"><b>${esc_(THREADS[th]||th)}</b><span>${esc_(L.photo?'📷 Photo':L.text)}</span></button>`; }).join('');
  }
  if(PHN.screen==='thread'){
    const T=S.msgs[PHN.thread]||[]; for(const m of T) m.read=true;
    h+=`<div class="ph-head"><button data-back>‹</button><b>${esc_(THREADS[PHN.thread]||PHN.thread)}</b><span></span></div><div class="ph-chat">`;
    for(const m of T){ const ph=m.photo&&GALLERY.find(p=>p.id===m.photo);
      h+=`<div class="ph-msg ${m.from}">${ph?`<img src="${ph.thumb}" data-photo="${ph.id}">`:''}${esc_(m.text)}</div>`; }
    h+='</div>';
  }
  if(PHN.screen==='news'){
    h+=`<div class="ph-head"><button data-back>‹</button><b>The Ledger</b><span></span></div><div class="ph-news">`;
    if(!S.inv.news.length) h+='<div class="ph-empty">The Oakhaven Ledger.<br>Sunday, October 4.<br><br>Nothing has happened yet.</div>';
    h+=S.inv.news.slice().reverse().map(n=>`<button class="ph-row" data-article="${n.ed}"><b>${esc_(n.head)}</b><span>${esc_(n.deck)}</span></button>`).join('');
    h+='</div>';
  }
  if(PHN.screen==='article'){
    const n=S.inv.news.find(x=>x.ed===PHN.article);
    h+=`<div class="ph-head"><button data-back>‹</button><b>The Ledger</b><span></span></div><div class="ph-news">`;
    if(n){ h+=`<div class="mast">The Oakhaven Ledger</div><div class="ed">Sunday, October 4 · No. ${4100+n.ed}</div><article><h3>${esc_(n.head)}</h3><div class="by">By ${esc_(n.by)}</div>`
      +(n.photoThumb?`<img src="${n.photoThumb}" style="width:100%;margin:6px 0">`:'')+n.body.map(p=>`<p>${esc_(p)}</p>`).join('')+'</article>'
      +`<article><div class="by">OakhavenTalk · ${n.forum.length} comments</div>`+n.forum.map(f=>`<div class="cm"><b>${esc_(f.u)}</b><br>${esc_(f.t)}</div>`).join('')+'</article>'; }
    h+='</div>';
  }
  if(PHN.screen==='notes'){
    h+=`<div class="ph-head"><button data-back>‹</button><b>Notes</b><span></span></div><div class="ph-notes">`;
    h+=S.notes.slice().reverse().map(n=>`<div><b>${esc_(n.title)}</b><p>${esc_(n.text)}</p></div>`).join('')||'<div class="ph-empty">Nothing yet.</div>';
    h+='</div>';
  }
  if(PHN.screen==='call'&&S.call){
    h+=`<div class="ph-call"><div class="who">${esc_(S.call.name)}</div><div class="sub">${S.call.live?'00:'+String(Math.floor(S.time-S.call.start)).padStart(2,'0'):'incoming call…'}</div>`
      +(S.call.live?'':`<div class="btns"><button data-decline class="no">Decline</button><button data-answer class="yes">Answer</button></div>`)+'</div>';
  }
  sc.innerHTML=h;
  sc.querySelectorAll('[data-app]').forEach(b=>b.onclick=()=>{ const a=b.dataset.app;
    if(a==='camera') return startCamera(false); if(a==='journal'){ closePhone(); return openJournal(); }
    if(a==='news') S.newsUnread=0; if(a==='torch'){ toggleTorch(); return phoneRender(); }
    S.msgUnread=0; PHN.screen=a; phoneRender(); });
  sc.querySelectorAll('[data-back]').forEach(b=>b.onclick=phoneBack);
  sc.querySelectorAll('[data-photo]').forEach(b=>b.onclick=()=>{ PHN.photo=+b.dataset.photo||b.dataset.photo; PHN.screen='photo'; phoneRender(); });
  sc.querySelectorAll('[data-article]').forEach(b=>b.onclick=()=>{ PHN.article=+b.dataset.article; PHN.screen='article'; phoneRender(); });
  sc.querySelectorAll('[data-thread]').forEach(b=>b.onclick=()=>{ PHN.thread=b.dataset.thread; PHN.screen='thread'; phoneRender(); });
  const one=(sel,fn)=>{ const b=sc.querySelector(sel); if(b) b.onclick=fn; };
  one('[data-dl]',()=>downloadPhoto(GALLERY.find(p=>p.id===PHN.photo)));
  one('[data-wall]',()=>{ S.wallpaper=PHN.photo; toast('Set as wallpaper'); });
  one('[data-del]',()=>{ deletePhoto(PHN.photo); PHN.screen='gallery'; phoneRender(); });
  one('[data-show]',()=>{ const p=GALLERY.find(x=>x.id===PHN.photo), n=showTarget(); closePhone(); showEvidence(n,p); });
  one('[data-answer]',()=>answerCall()); one('[data-decline]',()=>declineCall());
}
document.getElementById('phHome')?.addEventListener('click',()=>{ PHN.screen='home'; phoneRender(); });
function downloadPhoto(p){
  if(!p) return;
  try{ const a=document.createElement('a'); a.href=p.data; a.download=`oakhaven-${p.selfie?'selfie':'photo'}-${new Date(p.t).toISOString().slice(0,19).replace(/[:T]/g,'-')}.jpg`;
    document.body.appendChild(a); a.click(); a.remove(); toast('Saved to your device'); }catch(e){ toast('Could not save the photo'); }
}

/* ── the camera ───────────────────────────────────────────────────────── */
function startCamera(selfie){
  if(!S.running||S.cut||dlg.open||S.menu||S.driving) return;
  closePhone(); S.wheel=null;
  S.camMode={selfie:!!selfie, t:0}; breakRite('released'); clearHeld(); sfx('switch');
  if(!CTRL.opts.cursorLook) over.requestPointerLock?.();
  if(!S.flags.camTip){ S.flags.camTip=true; say('narr',`${keyName('fire')} takes the photo · ${keyName('alt')} flips to selfie · ${keyName('camera')} or Esc puts the phone away. The camera hums near things your eyes can’t see.`,5.5); }
}
function stopCamera(){ S.camMode=null; sfx('switch'); }
function cameraCode(code,acts,esc){
  if(esc||acts.includes('camera')||acts.includes('phone')||code==='Pad1'){ stopCamera(); return; }
  if(acts.includes('fire')||code==='Pad7'){ S.snapNow=true; return; }
  if(acts.includes('alt')||code==='Pad6'){ S.camMode.selfie=!S.camMode.selfie; sfx('switch'); return; }
  for(const a of acts) if(['torch','interact','map','caseFile','jump','medkit','pause'].includes(a)) PRESS[a]?.();
}
/* what is in frame: things that matter to the story */
function subjectOf(e){
  if(e.echo) return 'echo:'+e.echo;
  if(e.ghostGirl||e.lily||e.follower||e.lilyLight) return 'lily';
  if(e.kind==='wrong') return 'wrong';
  if(e.etype==='eldritch') return 'husk';
  if(e.read) return 'doc:'+e.read;
  if(e.look==='chuck') return 'chuck';
  if(e.look==='castiel') return 'castiel';
  if(e.look==='alistair'||e.look==='alistair_void') return 'alistair';
  if(e.look==='phantom') return 'ray_ghost';
  if(e.look==='crowley') return 'crowley';
  if(e.etype==='demon') return 'possessed';
  return null;
}
function inFrame(e,ang,maxD=14){
  const dx=e.x-S.px, dy=e.y-S.py, d=Math.hypot(dx,dy); if(d<.5||d>maxD) return false;
  let da=Math.atan2(dy,dx)-ang; da=Math.atan2(Math.sin(da),Math.cos(da));
  return Math.abs(da)<Math.atan(FOVP)*.92&&los(S.sector,S.px,S.py,e.x,e.y);
}
function framedSubjects(selfie){
  const ang=S.angle+(selfie?Math.PI:0), out=[];
  for(const e of S.sector.entities){ if(e.dead||(e.hidden&&!e.echo)) continue; const s=subjectOf(e); if(s&&inFrame(e,ang,e.read?4:14)) out.push({s,e}); }
  return out;
}
function nearestEcho(){
  let best=null, bd=11;
  for(const e of S.sector.entities){ if(!e.echo||e.dead||e.captured||(e.when&&!e.when())) continue; const d=Math.hypot(e.x-S.px,e.y-S.py); if(d<bd){ bd=d; best=e; } }
  return best?{e:best,d:bd}:null;
}
function updateCamera(dt){
  const c=S.camMode; if(!c) return; c.t+=dt;
  const n=nearestEcho();
  c.signal=n?Math.max(0,1-n.d/11):0;
  if(c.signal>.15){ c.humT=(c.humT||0)-dt; if(c.humT<=0){ c.humT=1.1-c.signal*.8; sfx('hum'); } }
  if(S.camFlash>0) S.camFlash=Math.max(0,S.camFlash-dt*3);
}
/* a selfie can catch something standing behind you */
function selfieHaunt(p){
  if(!p||!p.selfie||!S.flags.chuck_met||p.t>(S.flags.chuck_met_t||Infinity)) return '';
  return `<span class="ph-haunt" style="left:${p.hx||62}%;top:${p.hy||28}%" title=""></span>`;
}

/* capture: the frame that was just drawn, plus the selfie and the stamp */
function capturePhoto(){
  S.snapNow=false; const sel=S.camMode&&S.camMode.selfie;
  const shot=framedSubjects(sel), subs=[...new Set(shot.map(x=>x.s))];
  let data='', thumb='';
  try{
    const W=Math.min(640,IW*2), H=Math.round(W*IH/IW), c=document.createElement('canvas'); c.width=W; c.height=H;
    const x=c.getContext('2d'); x.imageSmoothingEnabled=false; x.drawImage(world,0,0,W,H);
    if(sel){
      /* something behind you, sometimes, when it's bad */
      const spook=(S.act>=2&&(S.dread||0)>.3&&Math.random()<.45)||(S.act>=3&&Math.random()<.25);
      if(spook){ const look=S.act>=3?(Math.random()<.5?(brother()==='dean'?'wrong_dean':'wrong_sam'):'ghost_girl'):'ghost_girl';
        const sp=charSet(look).front[0], sc=H*.26/56; x.globalAlpha=.75; x.drawImage(spriteCanvas(sp),W*(.66+Math.random()*.12),H*.3,32*sc,56*sc); x.globalAlpha=1;
        subs.push(look==='ghost_girl'?'lily':'wrong'); S.flags.selfie_spook=(S.flags.selfie_spook||0)+1; }
      const bust=portraitCanvas(costumeLook(),S.hp<35?2:S.hp<70?1:0), bh=H*.72, bw=bh*.8;
      x.drawImage(bust,W*.5-bw*.62,H-bh,bw,bh);
      if(COMP&&!COMP.hidden&&Math.hypot(COMP.x-S.px,COMP.y-S.py)<3){ const b2=portraitCanvas(COMP.look,0); x.drawImage(b2,W*.5+bw*.02,H-bh*.9,bw*.88,bh*.9); }
    }
    x.font=`${Math.round(H*.045)}px monospace`; x.fillStyle='#ffb347'; x.textAlign='right';
    x.fillText(`OCT 03  ${phoneClock()}`,W-10,H-10);
    data=c.toDataURL('image/jpeg',.84);
    const t=document.createElement('canvas'); t.width=160; t.height=Math.round(160*H/W); const tx=t.getContext('2d'); tx.drawImage(c,0,0,t.width,t.height);
    thumb=t.toDataURL('image/jpeg',.7);
  }catch(e){ data=thumb='data:,'; }
  const cap=subs.length?captionFor(subs):(sel?'You, and the town behind you.':'');
  const p={id:Date.now()+Math.floor(Math.random()*1000), t:Date.now(), selfie:!!sel, unknown:false, data, thumb, subjects:subs,
           caption:cap, place:S.sector.name, chapter:chapterLabel(), act:S.act, hx:60+Math.random()*25, hy:18+Math.random()*20};
  storePhoto(p); S.camFlash=1; sfx('shutter');
  for(const {s,e} of shot) if(e.echo&&!e.captured) captureEcho(e);
  for(const s of subs) photoEvidence(s);
  toast(subs.length?`Photo saved — ${cap}`:'Photo saved to Gallery');
  return p;
}
function spriteCanvas(sp){ const c=document.createElement('canvas'); c.width=sp.w; c.height=sp.h;
  const x=c.getContext('2d'); const id=x.createImageData(sp.w,sp.h), o=new Uint32Array(id.data.buffer);
  for(let i=0;i<sp.px.length;i++) o[i]=sp.px[i]?(sp.px[i]|0xFF000000)>>>0:0; x.putImageData(id,0,0); return c; }

/* a photo taken by nobody, from somewhere you weren't standing */
function unknownPhoto(x,y,a,caption,withPlayer=true){
  const sv={px:S.px,py:S.py,angle:S.angle,pitch:S.pitch,posZ:S.posZ,dX:S.dirX,dY:S.dirY,pX:S.plX,pY:S.plY};
  const av=withPlayer?char_(costumeLook(),S.px,S.py,{kind:'actor',h:S.cfg.h,face:S.angle}):null;
  if(av) S.sector.entities.push(av);
  let data='', thumb='';
  try{
    S.px=x; S.py=y; S.angle=a; S.pitch=0; S.posZ=.06*IH;
    S.dirX=Math.cos(a); S.dirY=Math.sin(a); S.plX=-S.dirY*FOVP; S.plY=S.dirX*FOVP;
    fogSetup(); render(); wctx.putImageData(img,0,0);
    const W=Math.min(640,IW*2), H=Math.round(W*IH/IW), c=document.createElement('canvas'); c.width=W; c.height=H;
    const cx=c.getContext('2d'); cx.imageSmoothingEnabled=false; cx.drawImage(world,0,0,W,H);
    cx.fillStyle='rgba(30,0,0,.18)'; cx.fillRect(0,0,W,H);
    cx.font=`${Math.round(H*.045)}px monospace`; cx.fillStyle='#ffb347'; cx.textAlign='right'; cx.fillText(`OCT 03  02:40`,W-10,H-10);
    data=c.toDataURL('image/jpeg',.8);
    const t=document.createElement('canvas'); t.width=160; t.height=Math.round(160*H/W); t.getContext('2d').drawImage(c,0,0,t.width,t.height);
    thumb=t.toDataURL('image/jpeg',.7);
  }catch(e){ data=thumb='data:,'; }
  Object.assign(S,{px:sv.px,py:sv.py,angle:sv.angle,pitch:sv.pitch,posZ:sv.posZ,dirX:sv.dX,dirY:sv.dY,plX:sv.pX,plY:sv.pY});
  if(av) S.sector.entities=S.sector.entities.filter(e=>e!==av);
  const p={id:Date.now()+Math.floor(Math.random()*1000), t:Date.now(), selfie:false, unknown:true, data, thumb, subjects:['unknown'],
           caption, place:S.sector.name, chapter:chapterLabel(), act:S.act};
  storePhoto(p); S.flags.photo_unknown=true; return p;
}

/* ── echoes: the dead, through the lens ───────────────────────────────── */
const ECHOES={
  ray:  {name:'Ray Hollis',    text:'Ray Hollis, 44. Line three, 1:52 in the morning. He is holding the requisition form for fan fourteen. The last thing he did was fold it carefully and put it in his shirt pocket, so it wouldn’t get dusty.'},
  lyle: {name:'Lyle Brandt',   text:'Lyle Brandt, 51. Main Street, 2:31 in the morning. He came out to warm his hands at the barrel and kept them there until there was nothing left to warm.'},
  emeka:{name:'Emeka Okafor',  text:'Emeka Okafor, 29. He sold his father’s watch to Earl on a Tuesday and bought it back on Thursday with money he didn’t have.'},
  tunde:{name:'Tunde Okafor',  text:'Tunde Okafor, 26. He died holding one end of his father’s watch strap. His brother was holding the other.'},
  pete: {name:'Pete Lindqvist',text:'Pete Lindqvist, 33. The river path, 2:40 in the morning. His work boots are still laced. There is a library card in his pocket with his sister’s handwriting on it: DUE BACK FRIDAY.'},
  mo:   {name:'Mo Haddad',     text:'Mo Haddad, 47. Room six, 2:09 in the morning. A letter to his daughter is open on the bed: “Dear Yasmin, I’m sorry I”. The rest of the page is blank.'},
  lily: {name:'Lily Hollis',   text:'Lily Hollis, 9. Uncounted. In the photo, for the first time, she is facing the camera.'},
};
const SIX=['ray','lyle','emeka','tunde','pete','mo'];
function echo_(id,x,y,o={}){ return Object.assign({kind:'echo',echo:id,x,y,r:.01,h:1.85,look:id==='lily'?'ghost_girl':'phantom',trans:true,lit:.9,face:Math.PI/2},o); }
SECTORS.mill.entities.push(echo_('ray',9.6,8.4));
SECTORS.street.entities.push(echo_('lyle',20.8,30.4,{face:0}),echo_('pete',1.9,22.6,{face:Math.PI}));
SECTORS.pawn.entities.push(echo_('emeka',2.4,4.6,{face:0}),echo_('tunde',3.5,4.6,{face:Math.PI}));
SECTORS.motel.entities.push(echo_('mo',17,3.2,{face:Math.PI/2}));
SECTORS.hollis.entities.push(echo_('lily',10.4,8.2,{when:()=>!!S.flags.lily_done,h:1.4}));
function echoCount(){ return SIX.filter(k=>S.flags['echo_'+k]).length; }
function captureEcho(e){
  e.captured=true; S.flags['echo_'+e.echo]=true; spawnParts(e.x,e.y,1,26,PCOL.ecto,{up:1.4}); sfx('ghost');
  const E=ECHOES[e.echo];
  addNoteRaw('echo_'+e.echo,`The last minute of ${E.name}`,E.text);
  later(.6,()=>say('narr',E.text,6));
  const n=echoCount();
  if(SIX.includes(e.echo)){ later(6.8,()=>toast(`${n} of 6 found`));
    if(n===6&&!S.flags.six_units){ S.flags.six_units=true;
      later(7.5,()=>{ addNoteRaw('six','Six units','All six men, photographed where they stopped. Ray Hollis. Lyle Brandt. Emeka and Tunde Okafor. Pete Lindqvist. Mo Haddad. The harvest log called them units. The phone calls them by name.');
        say(S.hero,isDean()?'That’s all of them. Six. Somebody should’ve taken their picture while they were alive.':'All six. Names, faces, times. That’s a record now. Nobody gets to call them units again.',4.5); }); } }
}
/* the echoes are invisible to the eye: the renderer only draws them in camera mode */
function echoVisible(e){ return !!S.camMode&&!e.captured&&(!e.when||e.when()); }

/* ── evidence: what a photo can do ────────────────────────────────────── */
const EVIDENCE_NOTES={
  wrong:['The photo of your brother','The street in the photo is empty. Your brother was behind you when you took it.'],
  husk:['Husks, photographed','In the photos their faces are clearer than they ever are in the street. You recognise one of them from the mill roster.'],
  chuck:['The man at the bar','The photo shows an empty stool, a full beer, and a bartender wiping a glass.'],
};
function captionFor(subs){
  const s=subs[0];
  if(s.startsWith('echo:')) return ECHOES[s.slice(5)]?.name||'Someone';
  return {lily:'The girl in the nightgown',wrong:'Your brother?',husk:'Something that used to be someone',chuck:'An empty stool',castiel:'Castiel',
    alistair:'Father Alistair',crowley:'Crowley (he blinked)',possessed:'Black eyes','ray_ghost':'The shape on the green chain','unknown':'—'}[s]
    ||(s.startsWith('doc:')?'Evidence: '+({ledger14:'the fan fourteen requisitions',ledgers:'the company ledgers',certificate:'Lily’s death certificate',
      coat:'Ray’s coat',drawings:'Lily’s drawings',inhaler:'Lily’s inhaler'}[s.slice(4)]||'a document'):'');
}
function photoEvidence(s){
  if(S.flags['photo_'+s]) return; S.flags['photo_'+s]=true;
  const N=EVIDENCE_NOTES[s]; if(N) addNoteRaw('photo_'+s,N[0],N[1]);
  if(s==='chuck') later(1,()=>say(S.hero,'He isn’t in it. He was right there.',3));
}
/* who's close enough to be shown a photo */
function showTarget(){
  let best=null, bd=3;
  for(const e of S.sector.entities){ if(e.dead||e.hidden||!(e.dialogue||e.talk||e.talkOnly)) continue;
    const d=Math.hypot(e.x-S.px,e.y-S.py); if(d<bd){ bd=d; best=e; } }
  return best;
}
const REACT={
  sheriff:{ 'doc:ledger14':[['sheriff','Seven requests. Seven, and the last one just says please.'],['sheriff','I signed the inquest on that man. I didn’t read past the first page.'],['sheriff','Leave it with me. I’m reading every page now.']],
            'doc:ledgers':[['sheriff','“My daughter has a cough.” In the margin. And they deferred it anyway.'],['sheriff','Okay. Okay. I’m seeing it.']] },
  doctor:{ 'doc:certificate':[['doctor','That’s my signature.'],['doctor','I wrote pneumonia. Somebody wrote “it was the coat” underneath, and I knew it was true, and I filed it anyway.'],['doctor','Take this. It’s all I can do that’s worth anything.']],
           'echo:ray':[['doctor','That’s Ray. That’s the night I signed him. He looks… he looks like he’s still waiting for someone to read the form.']] },
  sarah:{ 'echo:pete':[['sarah','That’s Pete. That’s— his boots are still laced. He always double-knotted them. Mom taught him.'],['sarah','Is he cold? He always ran cold.'],['sarah','…Can I keep this? Can you send it to me?']],
          'doc:ledger14':[['sarah','That’s the book I meant. Seven times. And they took the ledgers out of the building the day after the buyout.']] },
  lily:{ 'echo:ray':[['lily','That’s Daddy.'],['lily','He looks tired. He always looked tired.'],['lily','He folded the form. He always folded the important ones.'],['lily','Thank you for taking his picture. Nobody took his picture at the end.']] },
  castiel:{ wrong:[['castiel','That is not your brother. It is wearing his shape the way a child wears a parent’s coat, to see what you will do.'],['castiel','It learns from what you look at. Look at less.']],
            'echo:*':[['castiel','You have been photographing the dead. Good. Someone should keep their faces.']] },
  kevin:{ unknown:[['kevin','This wasn’t taken by your camera. The metadata says the lens is four million cycles old.'],['kevin','Something is watching through your phone. Or something wants you to think it is. Either way, it’s the same thing that wrote the tablet.']] },
  alistair:{ 'echo:lyle':[['alistair','Lyle sang bass in the choir for twenty years. He couldn’t read music. He just listened very hard.'],['alistair','I held his hand too. I’m sorry. I am.']] },
};
function reactKey(e){ if(!e) return null;
  const t=e.talk||e.talkOnly||e.dialogue||''; if(/sheriff/.test(t)) return 'sheriff'; if(/nurse|doctor/.test(t)) return 'doctor';
  if(/sarah/.test(t)) return 'sarah'; if(/lily/.test(t)||e.lily) return 'lily'; if(/castiel/.test(t)) return 'castiel';
  if(/kevin/.test(t)) return 'kevin'; if(/alistair/.test(t)) return 'alistair'; return null; }
function evidenceFor(e,p){
  const R=REACT[reactKey(e)]; if(!R||!p.subjects) return null;
  for(const s of p.subjects){ if(R[s]) return {s,lines:R[s]}; if(s.startsWith('echo:')&&R['echo:*']) return {s,lines:R['echo:*']}; }
  return null;
}
function showEvidence(e,p){
  const ev=evidenceFor(e,p); if(!ev){ say(S.hero,'They look at it and shake their head.',2.4); return; }
  const key=reactKey(e)+':'+ev.s, first=!S.flags['shown_'+key]; S.flags['shown_'+key]=true;
  e.face=Math.atan2(S.py-e.y,S.px-e.x); e.waitT=8;
  ev.lines.forEach(([who,t],i)=>say(who,t,null,{now:i===0}));
  if(!first) return;
  if(key==='sheriff:doc:ledger14'||key==='sheriff:doc:ledgers'){ S.flags.sheriff_saw=true; S.ammo.shells+=8; later(6,()=>toast('Sheriff Ames: +8 shells')); }
  if(key==='doctor:doc:certificate'){ S.flags.doc_confessed=true; S.meds+=1; later(8,()=>toast('Dr. Halvorsen: +1 med kit')); }
  if(key==='sarah:echo:pete'){ S.flags.sarah_pete=true; later(9,()=>msg('0114','you showed her. she cried. thank you',{})); }
  if(key==='lily:echo:ray'){ S.flags.lily_saw_dad=true; }
}

/* ── the viewfinder ───────────────────────────────────────────────────── */
function drawCamHUD(){
  const W=over.width, H=over.height, u=H/200, c=S.camMode; if(!c) return;
  octx.save();
  const m=12*u, L=18*u; octx.strokeStyle='rgba(255,255,255,.75)'; octx.lineWidth=Math.max(1,u*.7);
  for(const [x,y,sx,sy] of [[m,m,1,1],[W-m,m,-1,1],[m,H-m,1,-1],[W-m,H-m,-1,-1]]){
    octx.beginPath(); octx.moveTo(x,y+L*sy); octx.lineTo(x,y); octx.lineTo(x+L*sx,y); octx.stroke(); }
  octx.strokeStyle='rgba(255,255,255,.18)'; octx.beginPath();
  for(const f of [1/3,2/3]){ octx.moveTo(W*f,m); octx.lineTo(W*f,H-m); octx.moveTo(m,H*f); octx.lineTo(W-m,H*f); } octx.stroke();
  const blink=(S.time*2|0)%2===0;
  if(blink){ octx.fillStyle='#e23b3b'; octx.beginPath(); octx.arc(m+10*u,m+10*u,2.6*u,0,7); octx.fill(); }
  txt(c.selfie?'SELFIE':'PHOTO',m+16*u,m+6*u,7*u,'#fff');
  txt(phoneClock(),W-m-6*u,m+6*u,7*u,'#fff','right');
  txt(`${GALLERY.length} photos  ·  ${keyName('fire')} shoot  ·  ${keyName('alt')} flip  ·  Esc close`,W/2,H-m-4*u,5.5*u,'rgba(255,255,255,.7)','center','bottom');
  /* the hum meter: something unseen is close */
  const sg=c.signal||0;
  if(sg>.02){ const bw=60*u, bx=W/2-bw/2, by=m+4*u; barH(bx,by,bw,3*u,sg,`rgba(140,220,255,${.5+sg*.5})`);
    txt(sg>.6?'SOMETHING IS IN FRAME':'interference',W/2,by+5*u,5.5*u,`rgba(160,230,255,${.4+sg*.6})`,'center'); }
  /* the focus square settles on whatever's in the middle */
  const fs=26*u*(1+.08*Math.sin(S.time*6)); octx.strokeStyle=sg>.3?'rgba(140,220,255,.9)':'rgba(255,220,120,.85)';
  octx.strokeRect(W/2-fs/2,H/2-fs/2,fs,fs);
  if(S.camFlash>0){ octx.fillStyle=`rgba(255,255,255,${S.camFlash.toFixed(3)})`; octx.fillRect(0,0,W,H); }
  octx.restore();
}

/* ── calls ────────────────────────────────────────────────────────────── */
/* S.call = {name, lines:[[who,text],…], onEnd, start, live, ringT}.
   A call rings for a while. You don't have to answer. Some calls care. */
function ringPhone(name,lines,o={}){
  if(S.call||S.cut||S.dead) return false;
  S.call={name,lines,onEnd:o.onEnd||null,onDecline:o.onDecline||null,live:false,ringT:o.ring||14,start:0,ringTick:0,payphone:!!o.payphone};
  toast(`📱  Incoming call — ${name}   (${keyName('phone')})`); return true;
}
function answerCall(){
  const c=S.call; if(!c||c.live) return; c.live=true; c.start=S.time;
  if(!S.phoneOpen&&!c.payphone) openPhone('call'); else if(S.phoneOpen){ PHN.screen='call'; }
  let t=0; c.lines.forEach(([who,text,nm])=>{ const dur=Math.max(2.4,text.length*.058);
    later(t,()=>{ if(S.call===c) say(who,text,dur,{name:typeof nm==='string'?nm:who==='caller'?c.name:undefined}); }); t+=dur+.15; });
  later(t+.3,()=>{ if(S.call!==c) return; S.call=null; if(PHN.screen==='call'&&S.phoneOpen){ PHN.screen='home'; phoneRender(); } sfx('switch'); c.onEnd&&c.onEnd(); });
  phoneRender();
}
function declineCall(){ const c=S.call; if(!c) return; S.call=null; if(PHN.screen==='call'){ PHN.screen='home'; phoneRender(); } c.onDecline&&c.onDecline(); }
SPEAKERS.caller={name:'',col:'#e0d0a0'};
function updatePhone(dt){
  const c=S.call;
  if(c&&!c.live){ c.ringT-=dt; c.ringTick-=dt;
    if(c.ringTick<=0){ c.ringTick=2.2; sfx('ring'); rumble(.25,300); }
    if(c.ringT<=0){ S.call=null; c.onDecline&&c.onDecline(); toast(`Missed call — ${c.name}`); } }
  if(S.phoneOpen){ S.phoneTick=(S.phoneTick||0)-dt; if(S.phoneTick<=0){ S.phoneTick=1; const ck=document.getElementById('phClock'); if(ck) ck.textContent=phoneClock(); } }
}
/* pressing the phone key while it rings picks up */
const _openPhone=openPhone;
openPhone=function(screen){ if(S.call&&!S.call.live&&!S.call.payphone&&!screen){ _openPhone('call'); return; } _openPhone(screen); };

/* ── saving ────────────────────────────────────────────────────────────── */
function phoneSaveState(){ return {msgs:S.msgs, wallpaper:S.wallpaper||null, inv:S.inv}; }
function phoneLoadState(p){ S.msgs=(p&&p.msgs)||{}; S.wallpaper=(p&&p.wallpaper)||null; S.inv=Object.assign({links:{},theory:{},closed:{},news:[],hint:{},gut:{},seen:{},decisions:{}},(p&&p.inv)||{}); S.call=null; S.camMode=null; S.phoneOpen=false; elPhone.classList.remove('on'); }
function reattachEchoes(){
  const want={mill:['ray'],street:['lyle','pete'],pawn:['emeka','tunde'],motel:['mo'],hollis:['lily']};
  const fresh={ray:[9.6,8.4],lyle:[20.8,30.4],pete:[1.9,22.6],emeka:[2.4,4.6],tunde:[3.5,4.6],mo:[17,3.2],lily:[10.4,8.2]};
  for(const [sid,ids] of Object.entries(want)){ const sec=SECTORS[sid]; if(!sec) continue;
    for(const id of ids){ let e=sec.entities.find(x=>x.echo===id);
      if(!e){ e=echo_(id,...fresh[id]); sec.entities.push(e); }
      if(S.flags['echo_'+id]) e.captured=true;
      if(id==='lily'){ e.when=()=>!!S.flags.lily_done; e.h=1.4; } } }
}
