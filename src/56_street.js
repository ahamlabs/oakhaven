/* ═══ The street, furnished ════════════════════════════════════════════════
   Main Street had buildings and four lamps. A town has more: benches nobody
   sits on, a payphone, power poles, hydrants, a dumpster, cars that haven't
   moved since spring, and a motel sign that still buzzes. Barrels, bins and
   crates are loose: walk into them, kick them, hit them with the car. */

Object.assign(SPR,{
  bench: art(40,16,A=>{ const w=[96,70,44], m=[40,40,44];
    A.rect(2,2,37,4,C(w)); A.rect(2,7,37,9,C(dk(w,1.15))); A.rect(4,10,6,15,C(m)); A.rect(33,10,35,15,C(m));
    A.rect(4,4,5,7,C(m)); A.rect(34,4,35,7,C(m)); A.shade(.15); A.outline(rgb(10,10,10)); }),
  mailbox: art(14,24,A=>{ const b=[40,70,140]; A.rect(6,14,8,23,C([40,40,44])); A.ell(7,8,6,6,C(b)); A.rect(1,8,13,15,C(b));
    A.rect(3,9,11,10,C(dk(b,1.3))); A.rect(4,12,10,12,C([220,220,220])); A.shade(.18); A.outline(rgb(8,10,14)); }),
  hydrant: art(12,16,A=>{ const r=[170,40,34]; A.rect(3,5,8,15,C(r)); A.ell(5.5,4,3,2.5,C(dk(r,1.2))); A.rect(1,8,10,10,C(dk(r,.8)));
    A.rect(2,14,9,15,C(dk(r,.6))); A.shade(.2); A.outline(rgb(14,8,8)); }),
  pole: art(26,96,A=>{ const w=[70,54,38]; A.rect(11,0,14,95,C(w)); A.rect(12,0,12,95,C(dk(w,1.25)));
    A.rect(0,6,25,8,C(dk(w,.85))); A.rect(2,4,3,6,C([200,200,200])); A.rect(22,4,23,6,C([200,200,200]));
    A.rect(8,18,17,24,C([90,90,96])); A.rect(9,19,16,23,C([120,120,128])); A.outline(rgb(8,8,8)); }),
  dumpster: art(40,24,A=>{ const g=[40,74,52]; A.rect(1,6,38,23,C(g)); A.rect(0,3,39,6,C(dk(g,.8)));
    for(let x=4;x<37;x+=8) A.rect(x,8,x+1,21,C(dk(g,.75))); A.rect(4,10,10,13,C([200,190,120])); A.rect(2,22,6,23,C([20,20,20])); A.rect(33,22,37,23,C([20,20,20]));
    A.shade(.15); A.outline(rgb(8,10,8)); }),
  payphone: art(18,44,A=>{ const m=[60,64,70]; A.rect(7,20,10,43,C(m)); A.rect(1,0,16,22,C([150,150,156])); A.rect(2,1,15,3,C([40,90,160]));
    A.rect(3,5,14,20,C([34,36,40])); A.rect(5,7,9,17,C([20,20,22])); A.rect(11,8,13,14,C([170,170,170]));
    for(let y=8;y<16;y+=2) for(let x=5;x<9;x+=2) A.set(x,y,C([150,150,150])); A.set(12,16,glow(120,220,140)); A.shade(.12); A.outline(rgb(8,8,10)); }),
  motelSign: art(30,64,A=>{ A.rect(14,26,16,63,C([50,50,54]));
    A.rect(0,0,29,26,C([28,22,26])); A.rect(1,1,28,25,C([46,30,36]));
    const red=glow(255,70,60), dim=C([120,30,30]);
    /* M O T E L, stacked, one letter dead */
    const letters=[[3,3],[3,8],[3,13],[3,18]]; letters.forEach(([x,y],i)=>A.rect(x,y,x+22,y+3,i===2?dim:red));
    A.rect(6,22,23,23,glow(255,200,120)); A.outline(rgb(8,6,6)); }),
  crate: art(18,16,A=>{ const w=[124,92,56]; A.rect(1,1,16,15,C(w)); A.rect(1,1,16,2,C(dk(w,1.2))); A.line(1,1,16,15,C(dk(w,.7))); A.line(16,1,1,15,C(dk(w,.7)));
    A.rect(1,7,16,8,C(dk(w,.8))); A.shade(.15); A.outline(rgb(14,10,6)); }),
  trashcan: art(14,18,A=>{ const m=[110,112,116]; A.rect(2,3,11,17,C(m)); for(let x=3;x<11;x+=2) A.rect(x,4,x,16,C(dk(m,.75)));
    A.ell(6.5,2.5,6,2,C(dk(m,1.15))); A.shade(.2); A.outline(rgb(10,10,12)); }),
});

/* place a prop only where it fits: open ground, nothing within reach */
function placeProps(sec,list){
  for(const p of list){
    if(hits(sec,p.x,p.y,(p.r||.3)*.9)) continue;
    if(sec.entities.some(e=>!e.dead&&Math.hypot(e.x-p.x,e.y-p.y)<(e.r||.3)+(p.r||.3)+.15)) continue;
    let nearDoor=false; for(const k in sec.doors){ const [dx,dy]=k.split(',').map(Number); if(Math.hypot(dx+.5-p.x,dy+.5-p.y)<1.6) nearDoor=true; }
    if(nearDoor) continue;
    sec.entities.push(Object.assign({kind:'prop'},p));
  }
}
placeProps(SECTORS.street,[
  {m:'motelSign',x:20.6,y:29.2,r:.2,h:3.4,lit:.9,emit:.6},
  {m:'payphone',x:23.6,y:32.6,r:.3,h:2.1,payphone:true},
  {m:'bench',x:23.5,y:13.6,r:.5,h:.8},{m:'bench',x:32.4,y:34.2,r:.5,h:.8},{m:'bench',x:15.5,y:27.6,r:.5,h:.8},
  {m:'mailbox',x:23.5,y:19.2,r:.25,h:1.05},{m:'hydrant',x:31.6,y:11.6,r:.2,h:.7},{m:'hydrant',x:23.4,y:37.6,r:.2,h:.7},
  {m:'pole',x:33.6,y:6,r:.18,h:5.6},{m:'pole',x:33.6,y:20.4,r:.18,h:5.6},{m:'pole',x:33.6,y:36,r:.18,h:5.6},
  {m:'pole',x:22.2,y:3.6,r:.18,h:5.6},{m:'pole',x:22.2,y:41.6,r:.18,h:5.6},
  {m:'dumpster',x:21.6,y:14.6,r:.75,h:1.15},{m:'dumpster',x:35.4,y:16.8,r:.75,h:1.15},
  {kind:'prop',car:'parked_blue',x:30.2,y:7.5,r:.75,h:1.45,face:Math.PI/2},
  {kind:'prop',car:'parked_white',x:41,y:24.3,r:.75,h:1.45,face:0},
  {kind:'prop',car:'parked_green',x:47,y:20.7,r:.75,h:1.45,face:Math.PI},
  {m:'trashcan',x:24,y:26.6,r:.25,h:.85,movable:true},{m:'trashcan',x:32,y:17.4,r:.25,h:.85,movable:true},
  {m:'crate',x:19.6,y:41.2,r:.3,h:.8,movable:true},{m:'crate',x:20.5,y:41.8,r:.3,h:.8,movable:true},
  {m:'barrel',x:44.6,y:28.8,r:.35,h:1.1,movable:true},
]);
for(const e of SECTORS.street.entities) if(e.m==='barrel') e.movable=true;
placeProps(SECTORS.mill,[{m:'crate',x:3.4,y:9.5,r:.3,h:.8,movable:true},{m:'crate',x:4.1,y:10.2,r:.3,h:.8,movable:true},{m:'crate',x:24.2,y:16.5,r:.3,h:.8,movable:true}]);
placeProps(SECTORS.trap,[{m:'trashcan',x:15.6,y:9.5,r:.25,h:.85,movable:true}]);
for(const s of Object.values(SECTORS)) pack(s);

/* ── loose things ──────────────────────────────────────────────────────── */
/* shove: give a movable prop a push from (x,y) with strength k */
function shove(e,fromX,fromY,k){
  const dx=e.x-fromX, dy=e.y-fromY, l=Math.hypot(dx,dy)||1;
  e.kx=(e.kx||0)+dx/l*k; e.ky=(e.ky||0)+dy/l*k; e.spin=(e.spin||0)+(Math.random()-.5)*k;
  if(k>3) sfx('kick');
}
