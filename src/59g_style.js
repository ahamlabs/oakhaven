/* ═══ Weapon style (1.7) ═══════════════════════════════════════════════════
   Settings → Weapons → Weapon art: Painted, Classic (the old designs, redrawn) or Original. The quick wheel
   also has it, and so does the pause menu. Kept in this browser. */
(function vmStyleSetting(){ let o={}; try{ o=JSON.parse(localStorage.getItem(SETTINGS_KEY)||'{}')||{}; }catch(e){}
  S.settings.vmStyle=o.vmStyle==='drawn'?'classic':VM_STYLES.includes(o.vmStyle)?o.vmStyle:'painted'; })();
SET_DEFAULT.vmStyle='painted';
SET_ROWS.push({h:'Weapons'},{k:'vmStyle',label:'Weapon art',opts:[['painted','Painted'],['classic','Classic'],['original','Original']],
  note:'Painted is detailed pixel art. Classic is the original designs, redrawn cleanly at twice the detail. Original is exactly how the weapons looked in the first versions.'});
{ const was=saveSettings; saveSettings=function(){ was(); try{ const o=JSON.parse(localStorage.getItem(SETTINGS_KEY)||'{}')||{}; o.vmStyle=S.settings.vmStyle; localStorage.setItem(SETTINGS_KEY,JSON.stringify(o)); }catch(e){} }; }
{ const was=settingsChanged; settingsChanged=function(){ was(); if(S.running&&VM_LAST!==S.settings.vmStyle){ VM_LAST=S.settings.vmStyle; rebuildVM(); } }; }
let VM_LAST=null;
function setWeaponStyle(st){ if(!VM_STYLES.includes(st)) return; S.settings.vmStyle=st; VM_LAST=st; saveSettings(); if(S.running) rebuildVM(); toast(`Weapon art · ${st[0].toUpperCase()+st.slice(1)}`); }
function cycleWeaponStyle(){ const i=VM_STYLES.indexOf(S.settings.vmStyle); setWeaponStyle(VM_STYLES[(i+1)%VM_STYLES.length]); }
WHEEL_ITEMS.splice(WHEEL_ITEMS.length-1,0,{id:'vmstyle',label:'Weapon style',hint:()=>`Now: ${S.settings.vmStyle} · tap to change`,act:()=>cycleWeaponStyle()});

/* Pickups are scattered when the town is first built, before later chapters add buildings, so one can
   land inside a newer wall. Once everything exists, move any stranded pickup to the nearest open floor. */
(function unstickPickups(){ for(const s of Object.values(SECTORS)) for(const e of s.entities){ if(e.kind!=='pickup') continue;
    const c=s.grid[e.y|0]&&s.grid[e.y|0][e.x|0]; if(c===undefined||(!SOLID.includes(c)&&!hits(s,e.x,e.y,.2))) continue;
    const p=freeSpot(s,e.x,e.y,8); if(p){ e.x=p[0]; e.y=p[1]; } } })();
