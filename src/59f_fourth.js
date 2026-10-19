/* ═══ The fourth wall ══════════════════════════════════════════════════════
   When you start or continue a game, before Act I, the game quietly asks the
   browser where you are, so that nothing in the story gives away when the
   moment is coming. Much later, early in Act III, on your next keypress,
   the screen goes fullscreen without warning,
   tears, and shows you the name of your own town:

        KOLKATA
        This could be the next Oakhaven.

   Privacy: the browser asks permission first. The coordinates go only to
   BigDataCloud's free reverse-geocoding endpoint, to get a place name, and
   are never stored. Only the place name is kept, in this browser, so the
   moment still works after a reload. If you decline, or set "Use my location" to
   Never, the town is guessed from your time zone instead, entirely offline.
   Settings → Fourth wall turns the whole thing off. */

const FW={loc:null,src:null,asked:false,armed:false,done:false,t3:null,on:false};
const FW_KEY='oakhaven.fw.town';
function fwRemember(n,src){ FW.loc=n; FW.src=src; try{ if(n&&src==='gps') localStorage.setItem(FW_KEY,n); }catch(e){} }
(function fwSettings(){ let o={}; try{ o=JSON.parse(localStorage.getItem(SETTINGS_KEY)||'{}')||{}; }catch(e){}
  S.settings.fourth=o.fourth!==undefined?!!o.fourth:true; S.settings.useLoc=o.useLoc!==undefined?!!o.useLoc:true; })();
{ const was=saveSettings; saveSettings=function(){ was(); try{ const o=JSON.parse(localStorage.getItem(SETTINGS_KEY)||'{}')||{}; o.fourth=S.settings.fourth; o.useLoc=S.settings.useLoc; localStorage.setItem(SETTINGS_KEY,JSON.stringify(o)); if(!S.settings.useLoc) localStorage.removeItem(FW_KEY); }catch(e){} }; }
SET_DEFAULT.fourth=true; SET_DEFAULT.useLoc=true;
SET_ROWS.push({h:'Fourth wall'},
  {k:'fourth',label:'Fourth-wall moments',opts:[[true,'On'],[false,'Off']],note:'At some point the game goes fullscreen without warning and shows the name of your town. Turn this off if sudden flashes or surprises aren’t for you.'},
  {k:'useLoc',label:'Use my location',opts:[[true,'Ask once'],[false,'Never']],note:'Your browser asks first. The coordinates are sent only to BigDataCloud’s free lookup to get a place name, and are never stored; only the town’s name is kept in this browser. With Never, your time zone is used instead and nothing leaves your computer.'});

const TZ_FIX={Calcutta:'Kolkata',Bombay:'Mumbai',Saigon:'Ho Chi Minh City',Kiev:'Kyiv',Rangoon:'Yangon',Katmandu:'Kathmandu'};
function tzTown(){ try{ const z=Intl.DateTimeFormat().resolvedOptions().timeZone||''; const c=z.split('/').pop().replace(/_/g,' ');
  if(!c||/^(UTC|GMT|Etc)/.test(z)) return null; return TZ_FIX[c]||c; }catch(e){ return null; } }
function fwLocate(){ if(FW.asked||!S.settings.fourth) return; FW.asked=true;
  try{ const c=localStorage.getItem(FW_KEY); if(c&&S.settings.useLoc){ FW.loc=c; FW.src='gps'; return; } }catch(e){}
  const guess=tzTown();
  if(!S.settings.useLoc||typeof navigator==='undefined'||!navigator.geolocation||typeof fetch!=='function'){ FW.loc=guess; FW.src='timezone'; return; }
  try{ navigator.geolocation.getCurrentPosition(p=>{
      const {latitude:la,longitude:lo}=p.coords;
      const ctl=typeof AbortController!=='undefined'?new AbortController():null; const tm=setTimeout(()=>ctl&&ctl.abort(),7000);
      fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${la.toFixed(3)}&longitude=${lo.toFixed(3)}&localityLanguage=en`,ctl?{signal:ctl.signal}:{})
        .then(r=>r.json()).then(j=>{ clearTimeout(tm); const n=j.locality||j.city||j.principalSubdivision; fwRemember(n||guess,n?'gps':'timezone'); })
        .catch(()=>{ clearTimeout(tm); FW.loc=guess; FW.src='timezone'; });
    },()=>{ FW.loc=guess; FW.src='timezone'; },{timeout:9000,maximumAge:3600000}); }
  catch(e){ FW.loc=guess; FW.src='timezone'; } }
const fwTown=()=>FW.loc||tzTown()||'your town';

/* when: Act III, out on the street, a while after the act begins, nothing on screen */
INV_UPDATES.push(()=>{ if(!S.settings.fourth||FW.done) return; const F=S.flags;
  if(!FW.asked) fwLocate();                       /* chapter select and old saves */
  if(S.act>=3&&FW.t3==null) FW.t3=S.time;
  if(S.act===3&&!FW.armed&&!F.fw_done&&S.time-FW.t3>25&&S.sector.id==='street'&&!S.cut&&!dlg.open&&!S.menu&&!S.phoneOpen) FW.armed=true;
  if(F.fw_done) FW.done=true; });
/* the next keypress or click does it: browsers only allow fullscreen from one */
{ const was=inputDown; inputDown=function(code,e){ if(FW.armed&&!FW.on&&!FW.done&&S.running&&!S.cut&&!dlg.open&&!S.menu){ FW.armed=false; fourthWall(); return; } return was(code,e); }; }
const elFourth=(()=>{ const d=document.createElement('div'); d.id='fourth'; try{ d.innerHTML='<canvas></canvas><div class="loc"></div><div class="sub"></div>'; document.body&&document.body.appendChild&&document.body.appendChild(d); }catch(e){} return d; })();
function fourthWall(){
  FW.on=true; FW.done=true; S.flags.fw_done=true; S.flags.fw_town=fwTown(); S.menu='fourth'; clearHeld();
  try{ const el=document.documentElement; if(!document.fullscreenElement&&el.requestFullscreen) el.requestFullscreen().catch(()=>{}); }catch(e){}
  sfx('tear'); sfx('static'); S.shake=1; S.glitchA=1;
  const town=fwTown(); const L=elFourth.querySelector&&elFourth.querySelector('.loc'), Sb=elFourth.querySelector&&elFourth.querySelector('.sub');
  if(L){ L.textContent=''; } if(Sb){ Sb.textContent='This could be the next Oakhaven.'; Sb.classList.remove('on'); }
  elFourth.classList.add('on');
  const cv=elFourth.querySelector&&elFourth.querySelector('canvas'); let t=0, last=performance.now(), raf=0;
  const calm=(S.settings.intensity??1)<.35;
  const tick=now=>{ const dt=Math.min(.05,(now-last)/1000); last=now; t+=dt;
    try{ if(cv&&cv.getContext){ const W=cv.width=Math.max(160,(cv.clientWidth/4)|0), H=cv.height=Math.max(100,(cv.clientHeight/4)|0), x=cv.getContext('2d'), id=x.createImageData(W,H), o=new Uint32Array(id.data.buffer);
        const k=t<1.2?1:Math.max(.12,1-(t-1.2)*.25);
        for(let i=0;i<o.length;i++){ const v=(Math.random()*255*k*(calm?.35:1))|0; o[i]=(255<<24)|(v<<16)|(v<<8)|v; }
        if(!calm) for(let b=0;b<6;b++){ const y=(Math.random()*H)|0, h=(Math.random()*6)|0, c=Math.random()<.5?0xFF3C00FF:0xFFFFDC00; for(let yy=y;yy<Math.min(H,y+h);yy++) for(let xx=0;xx<W;xx++) if(Math.random()<.6) o[yy*W+xx]=c; }
        x.putImageData(id,0,0); } }catch(e){}
    if(L){ const n=Math.min(town.length,Math.floor(Math.max(0,t-1.1)*9)); L.textContent=t<1.1?'':(n<town.length?town.slice(0,n)+GLYPH[(Math.random()*GLYPH.length)|0]:town); }
    if(t>3.4&&Sb) Sb.classList.add('on');
    if(t<8.6) raf=requestAnimationFrame(tick); else fourthEnd(); };
  if(typeof requestAnimationFrame==='function') raf=requestAnimationFrame(tick); else fourthEnd();
}
function fourthEnd(){ FW.on=false; elFourth.classList.remove('on'); if(S.menu==='fourth') S.menu=null; S.glitchA=.3;
  later(1.2,()=>say(brother(),isDean()?'Dean? You just went white. What did you see?':'Sam? What was that? You looked straight through me.',3.4));
  later(5,()=>say(S.hero,isDean()?'Nothing. A town. Somewhere else.':'Somewhere else. A town that isn’t this one. Yet.',3)); }
/* the epilogue remembers */
{ const was=epilogue; epilogue=function(k){ const E=was(k); if(k==='D'||!S.flags.fw_done) return E;
    E.lines.push(`Somewhere in ${S.flags.fw_town||'your town'}, a streetlight is humming. It is probably nothing.`); return E; }; }
/* the content warning mentions it */
{ const was=showWarning; showWarning=function(...a){ was(...a); try{ const g=elGate.querySelector('.gt'); const b=g&&g.querySelector('button'); if(g&&b){ const p=document.createElement('p'); p.className='fw-note';
      p.textContent='When you start, Oakhaven may ask your browser for your location, so that at some point it can show your town’s name. At some point it will also go fullscreen without warning. You can turn either off in Settings → Fourth wall.'; g.insertBefore(p,b); } }catch(e){} }; }

/* ask before the game begins: at the start of a new game, or on resuming one */
{ const was=begin; begin=function(h){ fwLocate(); return was(h); }; }
{ const was=restore; restore=function(d){ fwLocate(); return was(d); }; }
