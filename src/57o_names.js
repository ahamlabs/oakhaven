/* ═══ Names, and changing brothers ═════════════════════════════════════════
   · Any of the main cast can be renamed. The script is written with the
     show's names; a substitution layer swaps them on screen everywhere text
     reaches the player (dialogue, subtitles, menus, notes, the phone, the
     paper, the canvas case file).
   · You can switch to the other brother mid-game, when nothing is in
     progress. Each brother keeps his own kit and his own health. */

const NAME_KEY='oakhaven.names.v1';
const NAME_DEFAULT={dean:'Dean',sam:'Sam',family:'Winchester',castiel:'Castiel',crowley:'Crowley',chuck:'Chuck',kevin:'Kevin',
  rae:'Rae',sarah:'Sarah',god:'The Formless One'};
const NAME_ROWS=[['dean','The older brother'],['sam','The younger brother'],['family','Their family name'],['castiel','The angel'],
  ['crowley','The demon in the suit'],['chuck','The man in the bathrobe'],['kevin','The prophet'],['rae','Rae (the tow-truck driver)'],
  ['sarah','Sarah (the librarian)'],['god','The one at the end']];
const NAMES=Object.assign({},NAME_DEFAULT);
(function loadNames(){ try{ const o=JSON.parse(localStorage.getItem(NAME_KEY)||'{}')||{}; for(const k in NAME_DEFAULT) if(typeof o[k]==='string'&&o[k].trim()) NAMES[k]=o[k].trim().slice(0,24); }catch(e){} })();
function saveNames(){ try{ const o={}; for(const k in NAME_DEFAULT) if(NAMES[k]!==NAME_DEFAULT[k]) o[k]=NAMES[k]; localStorage.setItem(NAME_KEY,JSON.stringify(o)); }catch(e){} }

/* the substitution: whole words only, built from the names that changed */
let NM_RE=null, NM_MAP={};
function buildNameRe(){
  const pairs=[];
  const add=(from,to)=>{ if(to&&to!==from) pairs.push([from,to]); };
  add('Dean',NAMES.dean); add('Sammy',NAMES.sam===NAME_DEFAULT.sam?'Sammy':NAMES.sam); add('Sam',NAMES.sam);
  add('Winchesters',NAMES.family+(NAMES.family===NAME_DEFAULT.family?'s':'s')); add('Winchester',NAMES.family);
  add('Castiel',NAMES.castiel); add('Cas',NAMES.castiel===NAME_DEFAULT.castiel?'Cas':NAMES.castiel);
  add('Crowley',NAMES.crowley); add('Chuck',NAMES.chuck); add('Kevin',NAMES.kevin); add('Rae',NAMES.rae); add('Sarah',NAMES.sarah);
  NM_MAP={}; for(const [f,t] of pairs) NM_MAP[f]=t;
  const keys=Object.keys(NM_MAP).sort((a,b)=>b.length-a.length);
  NM_RE=keys.length?new RegExp('\\b('+keys.join('|')+')\\b','g'):null;
}
function nm(s){ if(!NM_RE||typeof s!=='string') return s; NM_RE.lastIndex=0; return s.replace(NM_RE,m=>NM_MAP[m]||m); }
function applyNames(){
  buildNameRe();
  HEROES.dean.name=NAMES.dean; HEROES.dean.full=NAMES.dean+' '+NAMES.family;
  HEROES.sam.name=NAMES.sam;   HEROES.sam.full=NAMES.sam+' '+NAMES.family;
  for(const [id,k] of [['dean','dean'],['sam','sam'],['castiel','castiel'],['crowley','crowley'],['chuck','chuck'],['kevin','kevin'],['sarah','sarah'],['rae','rae']])
    if(SPEAKERS[id]) SPEAKERS[id].name=NAMES[k];
  if(COMP) COMP.name=HEROES[HEROES[S.hero].brother].name;
  try{ renameDom(document.body); }catch(e){}
}
/* DOM text: rewrite text nodes as they appear */
function renameDom(root){ if(!NM_RE||!root||!root.childNodes) return;
  const walk=n=>{ if(n.nodeType===3){ const v=n.nodeValue; NM_RE.lastIndex=0; if(NM_RE.test(v)){ const w=nm(v); if(w!==v) n.nodeValue=w; } return; }
    if(n.nodeType!==1||n.tagName==='SCRIPT'||n.tagName==='STYLE'||n.tagName==='INPUT'||n.tagName==='TEXTAREA') return;
    for(const c of n.childNodes) walk(c); };
  walk(root); }
try{ if(typeof MutationObserver!=='undefined'&&document.body&&document.body.nodeType){
  new MutationObserver(ms=>{ if(!NM_RE) return; for(const m of ms){
      if(m.type==='characterData') renameDom({childNodes:[m.target]});
      else for(const n of m.addedNodes) renameDom(n.nodeType===3?{childNodes:[n]}:n); } })
    .observe(document.body,{subtree:true,childList:true,characterData:true}); } }catch(e){}
/* canvas text and spoken lines */
{ const was=txt; txt=function(s,...a){ return was(typeof s==='string'?nm(s):s,...a); }; }
{ const was=say; say=function(who,text,dur,opt={}){ if(opt&&opt.name) opt=Object.assign({},opt,{name:nm(opt.name)}); return was(who,typeof text==='string'?nm(text):text,dur,opt); }; }
{ const was=toast; toast=function(m){ return was(typeof m==='string'?nm(m):m); }; }
applyNames();

/* the names page: reuses the settings overlay */
function openNames(back){
  SET_BACK=back||null; S.settingsOpen=true; document.exitPointerLock?.(); clearHeld();
  let h='<div class="st-box"><h1>Names</h1><div class="st-sub">Call anyone what you like. The change shows everywhere at once, and is kept in this browser.</div><h2>The cast</h2>';
  for(const [k,label] of NAME_ROWS) h+=`<div class="st-row"><label>${label}</label><input type="text" class="nm-in" data-n="${k}" maxlength="24" value="${esc_(NAMES[k])}" placeholder="${esc_(NAME_DEFAULT[k])}"></div>`;
  h+=`<div class="st-note">The one at the end is not named on screen until he chooses to be.</div>`;
  h+=`<div class="st-btns"><button class="opt" data-nreset>Show names</button><button class="opt on" data-nclose>Done</button></div></div>`;
  elSettings.innerHTML=h; elSettings.classList.add('on');
  elSettings.querySelectorAll('.nm-in').forEach(el=>el.oninput=()=>{ const v=el.value.replace(/[<>]/g,'').trim(); NAMES[el.dataset.n]=v||NAME_DEFAULT[el.dataset.n]; saveNames(); applyNames(); });
  const one=(s,f)=>{ const b=elSettings.querySelector(s); if(b) b.onclick=f; };
  one('[data-nreset]',()=>{ Object.assign(NAMES,NAME_DEFAULT); saveNames(); applyNames(); location.reload(); });
  one('[data-nclose]',()=>closeSettings());
}
/* typing in a name box must not move the player or open pages */
{ const was=inputDown; inputDown=function(code,e){ const t=e&&e.target; if(t&&t.tagName==='INPUT'&&t.type==='text'){ if(code==='Escape') t.blur(); return; } return was(code,e); }; }
(function namesButton(){ const row=document.getElementById('openCtrl'); if(row&&row.parentNode&&row.parentNode.appendChild){
  const b=document.createElement('button'); b.className='opt'; b.textContent='Names…'; b.onclick=()=>openNames(); row.parentNode.appendChild(b); } })();

/* ── switching brothers ───────────────────────────────────────────────── */
/* The rule: you can change who you are between things, never during one.
   A "mission" is anything with a clock, a fight, a scene or a lock on it. */
const MISSION_SECTORS=new Set(['cathedral']);
function missionLock(){ const F=S.flags;
  if(S.mission) return S.mission;
  if(MISSION_SECTORS.has(S.sector.id)) return 'You’re inside St. Brendan’s';
  if(S.call&&S.call.live) return 'You’re on a call';
  if(S.sector.entities.some(e=>e.kind==='enemy'&&!e.dead&&e.state==='hunt'&&Math.hypot(e.x-S.px,e.y-S.py)<16)) return 'Not in the middle of a fight';
  if(S.channel>0) return 'Not while you’re chanting';
  if(F.thrall_active) return 'Something has hold of you';
  return null; }
function switchBlock(){
  if(!S.running) return 'Not yet';
  if(S.cut||dlg.open||S.menu||S.phoneOpen||S.camMode||S.mapOpen||S.caseOpen) return 'Not right now';
  if(S.driving) return 'Not while driving';
  if(!COMP||COMP.hidden) return `${HEROES[HEROES[S.hero].brother].name} isn’t here`;
  return missionLock(); }
function heroKit(){ return {owned:[...S.owned],ammo:{...S.ammo},rites:[...S.rites],rite:S.rite,meds:S.meds,weapon:S.weapon,lastWeapon:S.lastWeapon,
  costume:S.costume,hp:S.hp,armor:S.armor,special:S.special,stamina:S.stamina}; }
function switchHero(force){
  const why=force?null:switchBlock(); if(why){ toast(`Can’t switch: ${why}`); return false; }
  const I=inv_(), from=S.hero, to=HEROES[from].brother; I.kits=I.kits||{};
  I.kits[from]=heroKit();
  const k=I.kits[to]||(()=>{ const st=HEROES[to].start; return {owned:[...st.owned],ammo:{...st.ammo},rites:[...st.rites],rite:st.rites[0],meds:st.meds,
    weapon:st.owned.includes('shotgun')?'shotgun':'revolver',lastWeapon:'crowbar',costume:HEROES[to].defaultCostume,hp:100,armor:0,special:40,stamina:100}; })();
  breakRite&&breakRite('released'); S.channel=0;
  const cx=COMP.x, cy=COMP.y, px=S.px, py=S.py;
  S.hero=to; S.cfg=HEROES[to];
  Object.assign(S,{owned:new Set(k.owned),ammo:{...k.ammo},rites:new Set(k.rites),rite:k.rite,meds:k.meds,weapon:k.weapon,lastWeapon:k.lastWeapon,
    costume:COSTUMES[to][k.costume]?k.costume:HEROES[to].defaultCostume,hp:k.hp,armor:k.armor,special:k.special,stamina:k.stamina??100});
  rebuildVM(); buildPortrait(); makeCompanion();
  if(!hits(S.sector,cx,cy,.3)){ S.px=cx; S.py=cy; }
  COMP.x=px; COMP.y=py; COMP.face=Math.atan2(S.py-py,S.px-px);
  I.switches=(I.switches||0)+1; S.flags.switched=true;
  sfx('switch'); toast(`You’re ${HEROES[to].name} now`);
  const L=to==='sam'?[['sam','My turn.'],['dean','Don’t scratch anything.']]:[['dean','Okay. Driver’s seat.'],['sam','You know that’s not how this works.']];
  if(I.switches<=3) L.forEach(([w,t],i)=>say(w,t,null,{now:i===0}));
  return true; }
/* the binding, the wheel, the pause menu */
if(!ACTIONS.some(a=>a.id==='switchHero')){
  ACTIONS.push({id:'switchHero',label:'Switch brother',group:'World',keys:['KeyU',null],pad:null});
  if(typeof ACT_BY_ID==='object') ACT_BY_ID.switchHero=ACTIONS.at(-1);
  loadControls(); }
PRESS.switchHero=()=>switchHero();
WHEEL_ITEMS.splice(WHEEL_ITEMS.length-1,0,{id:'swap',label:'Switch brother',hint:()=>switchBlock()||`Play as ${HEROES[HEROES[S.hero].brother].name}`,act:()=>switchHero()});
{ const was=openPause; openPause=function(){ was(); if(!dlg.open||!dlg.avail) return;
    const i=dlg.avail.findIndex(c=>c.text==='Controls'); if(i<0) return; const why=missionLock(), b=HEROES[HEROES[S.hero].brother].name;
    dlg.avail.splice(i,0,{text:`Play as ${b}`,note:why||'',act:()=>{ closeDlg(); if(!switchHero()) openPause(); }},{text:'Names',act:()=>openNames(openPause)});
    renderChoices(dlg.avail.map(c=>({text:c.text,note:c.note,act:c.act||null}))); }; }
/* saves carry both brothers' kits (inv_ is saved with the phone state) */
