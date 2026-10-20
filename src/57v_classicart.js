/* ═══ Classic weapon art, rebuilt (1.7) ════════════════════════════════════
   The Classic style keeps the old flat, chunky look but every weapon and hand
   is rebuilt to one standard:

   · one camera: the weapon held low and right, pointing up and to the left
     toward the crosshair; one light, from the upper left
   · materials, not outlines, separate the parts: every component is drawn as
     a mask and shaded with its own ramp (blued steel, bright steel, walnut,
     leather, glass, gold, skin, cloth), with a lit bevel on the edges facing
     the light and a dark bevel on the far edges
   · hands are built from a sleeve and cuff, a wrist that narrows, a palm with
     a heel, a thumb from the side of the palm, and four fingers of different
     lengths, drawn in front of the grip so they wrap it, with contact
     shadow where they press
   · drawn at 240×180 and shown at half scale, so the Crisp renderer shows it
     pixel for pixel */

/* ── ramps: [dark, mid, light, highlight] ─────────────────────────────── */
const MAT={
  blued:[[12,14,20],[32,38,52],[66,76,96],[160,172,198]],
  steel:[[34,36,42],[76,80,90],[128,134,146],[214,220,230]],
  dark:[[16,16,20],[34,34,40],[62,62,72],[130,132,144]],
  walnut:[[58,30,16],[104,58,30],[146,88,48],[192,134,82]],
  leather:[[28,18,14],[56,36,26],[86,58,40],[132,96,70]],
  brass:[[96,66,24],[160,118,48],[208,166,82],[248,226,150]],
  gold:[[120,80,20],[190,140,50],[236,196,96],[255,244,190]],
  ivory:[[150,138,110],[200,188,160],[232,222,198],[252,248,236]],
  orange:[[120,40,12],[186,72,22],[226,110,40],[252,170,100]],
  glass:[[40,70,120],[90,140,196],[150,196,232],[236,248,255]],
  cork:[[90,60,30],[140,100,56],[180,136,84],[214,176,120]],
  red:[[90,20,16],[150,36,28],[196,60,44],[236,120,96]],
  silverC:[[60,64,78],[130,136,152],[192,198,212],[244,246,252]],
};
const skinRamp=sk=>[dk(sk,.5),dk(sk,.7),dk(sk,.92),mix(sk,[255,240,226],.16)];
const clothRamp=c=>[dk(c,.45),dk(c,.7),c,mix(c,[230,230,240],.22)];

/* ── a component: draw a mask, then shade it with a ramp ─────────────── */
function part(A,shape,ramp,o={}){
  const T=art(A.w,A.h,shape), w=A.w, h=A.h, m=T.px; let x0=w,x1=0,y0=h,y1=0;
  for(let y=0;y<h;y++) for(let x=0;x<w;x++) if(m[y*w+x]){ if(x<x0)x0=x; if(x>x1)x1=x; if(y<y0)y0=y; if(y>y1)y1=y; }
  if(x1<x0) return;
  const bw=Math.max(1,x1-x0), bh=Math.max(1,y1-y0), cyl=o.cyl;
  const on=(x,y)=>x>=0&&y>=0&&x<w&&y<h&&!!m[y*w+x];
  for(let y=y0;y<=y1;y++) for(let x=x0;x<=x1;x++){ if(!on(x,y)) continue;
    let g;                                                    // 0 = in shadow … 1 = facing the light
    if(cyl){ const dx=cyl[2]-cyl[0], dy=cyl[3]-cyl[1], L=Math.hypot(dx,dy)||1, nx=-dy/L, ny=dx/L, t=((x-cyl[0])*dx+(y-cyl[1])*dy)/(L*L), r=cyl[4]+(cyl[5]-cyl[4])*Math.max(0,Math.min(1,t));
      let s=((x-cyl[0])*nx+(y-cyl[1])*ny)/r; const lit=(nx*-.6+ny*-.8)>0?1:-1; s*=lit; g=.5+.5*s; g=Math.max(0,Math.min(1,g)); g=.25+.75*Math.pow(g,.8); }
    else g=1-.55*((x-x0)/bw)-.45*((y-y0)/bh);
    let lv=g<.28?0:g<.6?1:g<.86?2:2.6;
    const ul=!on(x-1,y-1)||!on(x,y-1)||!on(x-1,y), dr=!on(x+1,y+1)||!on(x,y+1)||!on(x+1,y);
    if(ul&&!o.noRim) lv=Math.max(lv,o.rim??2); if(dr&&!o.noBevel) lv=Math.min(lv,.5);
    if(cyl&&o.spec!==false){ /* a hard specular stripe a third of the way across */ }
    let c=lv>=2.5?ramp[3]:lv>=2?ramp[2]:lv>=1?ramp[1]:lv>=.5?mix(ramp[0],ramp[1],.5):ramp[0];
    if(o.tex) c=o.tex(x,y,c,lv)||c;
    A.set(x,y,o.glow?glow(c[0],c[1],c[2]):C(c.map(v=>Math.max(0,Math.min(255,v)))));
  }
  if(o.spec&&cyl){ /* the specular line on a cylinder */ const [ax,ay,bx,by,r0,r1]=cyl, L=Math.hypot(bx-ax,by-ay), nx=-(by-ay)/L, ny=(bx-ax)/L, lit=(nx*-.6+ny*-.8)>0?1:-1;
    for(let i=0;i<=L;i++){ const t=i/L, r=r0+(r1-r0)*t, x=ax+(bx-ax)*t+nx*lit*r*.45, y=ay+(by-ay)*t+ny*lit*r*.45; if(on(Math.round(x),Math.round(y))) A.set(x,y,C(ramp[3])); } }
  return {x0,x1,y0,y1,on};
}
/* shape helpers for masks */
const S_=c=>C([255,255,255]);
const cap=(A,x0,y0,x1,y1,r0,r1=r0)=>{ const n=Math.ceil(Math.hypot(x1-x0,y1-y0))*2+1; for(let i=0;i<=n;i++){ const t=i/n; A.disc(x0+(x1-x0)*t,y0+(y1-y0)*t,r0+(r1-r0)*t,S_()); } };
const pl=(A,pts)=>poly(A,pts,[255,255,255]);
const grain=(ang=0)=>(x,y,c,lv)=>{ const g=Math.sin((x*Math.cos(ang)+y*Math.sin(ang))*.55+Math.sin(y*.13+x*.05)*2.4); return c.map(v=>v*(.9+.1*g)); };
const checker=(x0,x1,y0,y1)=>(x,y,c)=>(x>x0&&x<x1&&y>y0&&y<y1&&((x+y)%4===0||(x-y+400)%4===0))?c.map(v=>v*.72):c;
const wrapTex=(step,ang)=>(x,y,c)=>{ const q=((x*Math.cos(ang)+y*Math.sin(ang))%step+step)%step; return q<1.6?c.map(v=>v*.62):c; };
const scuff=(n)=>(x,y,c)=>hash(x*3,y*5)>1-n?c.map(v=>v*.82):c;
/* contact shadow: darken weapon pixels just below/right of a finger mask */
function contact(A,fingerOn,k=.62){ const w=A.w,h=A.h, src=A.px.slice();
  for(let y=1;y<h-2;y++) for(let x=1;x<w-2;x++){ const i=y*w+x; if(!src[i]||fingerOn(x,y)) continue;
    if(fingerOn(x-1,y-1)||fingerOn(x,y-2)||fingerOn(x-2,y)) A.px[i]=scaleC(src[i],k); } }

/* ── arms and hands ───────────────────────────────────────────────────── */
/* a forearm in a sleeve, from off the bottom edge to the wrist, with a cuff and fold lines */
function sleeve2(A,x0,y0,x1,y1,r0,r1,sl,sk){
  part(A,B=>cap(B,x0,y0,x1,y1,r0,r1),clothRamp(sl),{cyl:[x0,y0,x1,y1,r0,r1]});
  const t=.86, cx=x0+(x1-x0)*t, cy=y0+(y1-y0)*t, r=r0+(r1-r0)*t;
  part(A,B=>cap(B,cx,cy,x0+(x1-x0)*.93,y0+(y1-y0)*.93,r+1.5,r+1.2),clothRamp(dk(sl,.82)),{cyl:[x0,y0,x1,y1,r0+1.5,r1+1.2]});
  for(let i=1;i<4;i++){ const tt=.25+i*.15, fx=x0+(x1-x0)*tt, fy=y0+(y1-y0)*tt, rr=r0+(r1-r0)*tt;
    const ang=Math.atan2(y1-y0,x1-x0)+Math.PI/2; A.line(fx+Math.cos(ang)*rr*.2,fy+Math.sin(ang)*rr*.2,fx+Math.cos(ang)*rr*.75-6,fy+Math.sin(ang)*rr*.75+3,C(dk(sl,.5))); }
  /* the wrist, narrowing out of the cuff */
  part(A,B=>cap(B,x0+(x1-x0)*.9,y0+(y1-y0)*.9,x1,y1,r1*.8,r1*.72),skinRamp(sk),{cyl:[x0,y0,x1,y1,r1*.8,r1*.72]});
}
function finger(A,x0,y0,x1,y1,r,sk,o={}){ return part(A,B=>{ cap(B,x0,y0,x1,y1,r,r*.86); },skinRamp(sk),{cyl:[x0,y0,x1,y1,r,r*.86],...o}); }
function knuckle(A,x,y,sk){ A.set(x,y,C(mix(sk,[255,244,236],.35))); A.set(x+1,y,C(mix(sk,[255,244,236],.2))); }

/* ── the revolver: three-quarter side view, pointing up and left at the crosshair ── */
function kRevolver(sl,sk,e){ return Object.assign(art(240,180,A=>{
  sleeve2(A,262,214,210,170,40,22,sl,sk);
  part(A,B=>{ B.ell(200,150,22,19,S_()); B.ell(210,166,16,12,S_()); },skinRamp(sk));               // back of the hand, behind the grip
  /* grip: walnut panel, checkered, on a steel frame; it rakes back from the frame */
  part(A,B=>pl(B,[[176,100],[190,98],[214,160],[200,166]]),MAT.blued);                             // backstrap
  part(A,B=>pl(B,[[156,104],[182,100],[204,164],[180,172]]),MAT.walnut,{tex:(x,y,c,l)=>checker(164,198,116,164)(x,y,grain(1.15)(x,y,c,l))});
  part(A,B=>B.disc(181,138,3.2,S_()),MAT.brass,{noBevel:true});
  /* frame and recoil shield */
  part(A,B=>pl(B,[[146,76],[180,86],[182,104],[156,110],[144,100]]),MAT.blued);
  /* trigger guard: a steel loop under the frame; the trigger inside it */
  part(A,B=>{ for(let a=.15;a<=Math.PI-.15;a+=.025) B.disc(150+Math.cos(a)*11,108+Math.sin(a)*12,2.1,S_()); },MAT.blued);
  part(A,B=>cap(B,152,108,149,121,2.3,1.6),MAT.steel);
  /* the cylinder, clearly wider than the barrel, with six flutes along its length */
  part(A,B=>cap(B,124,78,152,94,15,15),MAT.blued,{cyl:[124,78,152,94,15,15],spec:true});
  for(const k of [-.62,-.2,.2,.62]){ const ox=-16*.5*k*1.0, oy=28*.5*k*.55; A.line(126+k*-7,78+k*13,150+k*-7,92+k*13,C(MAT.blued[0])); }
  part(A,B=>B.ell(152,94,5,13,S_()),MAT.blued,{noRim:true});                                       // the cylinder's rear edge against the frame
  /* top strap with a notch for the rear sight */
  part(A,B=>cap(B,122,66,178,84,3.8,3.8),MAT.blued,{cyl:[122,66,178,84,3.8,3.8]});
  part(A,B=>pl(B,[[168,76],[174,78],[173,82],[167,80]]),MAT.dark);
  /* barrel: a lit top flat, a darker underside, and an ejector housing below it */
  part(A,B=>cap(B,124,92,74,64,3.6,3.2),MAT.blued,{cyl:[124,92,74,64,3.6,3.2]});
  part(A,B=>cap(B,126,78,70,48,8.5,7.5),MAT.blued,{cyl:[126,78,70,48,8.5,7.5],spec:true});
  part(A,B=>B.ell(69,48,4.6,8,S_()),MAT.steel); A.ell(68,48,2.6,4.6,C([4,4,6]));                  // the muzzle face and bore
  part(A,B=>pl(B,[[74,36],[80,38],[80,44],[74,42]]),MAT.steel);                                     // front sight blade
  /* hammer: cocked, a checkered spur */
  part(A,B=>{ cap(B,178,88,192,70,5,3.6); },MAT.steel,{cyl:[178,88,192,70,5,3.6],tex:(x,y,c)=>(y<80&&((x+y)&2))?c.map(v=>v*.66):c});
  /* the hand: index along the frame, outside the guard; middle, ring and little curled round the front of the grip; thumb over the top */
  const F=[];
  /* the palm and back of the hand on the near side of the grip; the heel sits low and right */
  part(A,B=>{ pl(B,[[188,110],[214,114],[224,168],[200,178],[190,150]]); B.ell(212,166,14,11,S_()); },skinRamp(sk));
  F.push(finger(A,190,114,152,104,5.8,sk));                                                        // index, straight along the frame
  F.push(finger(A,194,126,170,121,6.6,sk)); F.push(finger(A,171,121,162,129,5.8,sk));             // middle: proximal, then curling round the front
  F.push(finger(A,196,139,172,135,6.4,sk)); F.push(finger(A,173,135,165,143,5.6,sk));             // ring
  F.push(finger(A,198,152,180,150,5.6,sk)); F.push(finger(A,181,150,175,157,4.8,sk));             // little, shorter
  part(A,B=>cap(B,214,118,190,100,8,5.6),skinRamp(sk),{cyl:[214,118,190,100,8,5.6]});              // thumb, from the side of the palm, over the top
  for(const [x,y] of [[186,121],[190,135],[194,149],[184,106]]) knuckle(A,x,y,sk);
  contact(A,(x,y)=>F.some(f=>f&&f.on(x,y)));
  if(e.blessed) for(let i=0;i<9;i++) A.set(76+i*5.6,52+i*3.2,glow(255,226,150));
  A.outline(rgb(12,10,14)); }),{scale:.5}); }

/* ── a fist round a handle (blades, crowbar): handle axis a (top, by the guard) → b (bottom) ── */
function fistOn(A,sk,ax,ay,bx,by,hw,o={}){ const L=Math.hypot(bx-ax,by-ay), ux=(bx-ax)/L, uy=(by-ay)/L; let nx=uy, ny=-ux; if(nx>0){ nx=-nx; ny=-ny; }   // n points to the front (left)
  const P=(t,k)=>[ax+ux*t+nx*k, ay+uy*t+ny*k], F=[];
  if(o.sl){ const h=P(L*.8,-hw*2.3); sleeve2(A,h[0]+70,h[1]+66,h[0]+4,h[1]+2,40,hw*2.3,o.sl,sk); }
  /* palm on the near side */
  part(A,B=>{ pl(B,[P(-2,-hw*1.2),P(L*.95,-hw*1.4),P(L*.95,-hw*3.2),P(-2,-hw*2.8)]); const h=P(L*.9,-hw*2.2); B.ell(h[0],h[1],hw*1.7,hw*1.4,S_()); },skinRamp(sk));
  /* four fingers across the handle, index at the guard, little finger shortest */
  const fr=[hw*.78,hw*.8,hw*.74,hw*.64], ts=[hw*.9,hw*.9+hw*1.55,hw*.9+hw*3.05,hw*.9+hw*4.45];
  for(let i=0;i<4;i++){ const t=ts[i]*(o.tight||1); const p0=P(t,-hw*1.5), p1=P(t-hw*.2,hw*.85), p2=P(t+hw*.5,hw*1.05);
    F.push(finger(A,p0[0],p0[1],p1[0],p1[1],fr[i],sk)); F.push(finger(A,p1[0],p1[1],p2[0],p2[1],fr[i]*.86,sk)); knuckle(A,Math.round(p0[0]+nx*2),Math.round(p0[1]+ny*2),sk); }
  /* thumb from the side of the palm, wrapping over the index finger */
  const t0=P(hw*1.4,-hw*2.6), t1=P(hw*.3,hw*.6); part(A,B=>cap(B,t0[0],t0[1],t1[0],t1[1],hw*.8,hw*.62),skinRamp(sk),{cyl:[t0[0],t0[1],t1[0],t1[1],hw*.8,hw*.62]});
  contact(A,(x,y)=>F.some(f=>f&&f.on(x,y)));
  return {P,ux,uy,nx,ny}; }

/* ── the sawed-off: two hands, two barrels, a break-action receiver and a stock ── */
function kShotgun(sl,sk,e){ return Object.assign(art(240,180,A=>{
  sleeve2(A,-44,224,84,114,40,20,sl,sk);                                                           // the support arm, from the left, into the palm
  sleeve2(A,262,224,212,170,40,21,sl,sk);
  /* stock and pistol grip, running back toward you */
  part(A,B=>pl(B,[[176,104],[198,100],[244,150],[244,190],[206,190],[190,134]]),MAT.walnut,{tex:(x,y,c,l)=>checker(186,206,112,150)(x,y,grain(.6)(x,y,c,l))});
  /* fore-end under the barrels */
  part(A,B=>pl(B,[[78,70],[136,96],[132,108],[74,84]]),MAT.walnut,{tex:(x,y,c,l)=>checker(84,128,76,104)(x,y,grain(.42)(x,y,c,l))});
  /* the two barrels: the far one first, then the near one over it, a rib between */
  part(A,B=>cap(B,152,98,40,44,8,7),MAT.blued,{cyl:[152,98,40,44,8,7]});
  part(A,B=>cap(B,148,88,36,34,8,7),MAT.blued,{cyl:[148,88,36,34,8,7],spec:true});
  part(A,B=>cap(B,150,93,38,39,2,1.8),MAT.steel,{cyl:[150,93,38,39,2,1.8]});
  part(A,B=>{ B.ell(36,34,5,7.6,S_()); B.ell(40,44,5,7.6,S_()); },MAT.steel); A.ell(35,34,2.8,4.8,C([4,4,6])); A.ell(39,44,2.8,4.8,C([4,4,6]));   // two separate bores
  part(A,B=>B.disc(44,28,2,S_()),MAT.brass);                                                        // bead sight
  /* receiver: case-hardened steel with scroll engraving; the hinge pin; the top lever */
  part(A,B=>pl(B,[[144,80],[182,96],[184,116],[150,112],[142,100]]),MAT.steel,{tex:(x,y,c)=>{ const cx=164,cy=102, r=Math.hypot(x-cx,y-cy), a=Math.atan2(y-cy,x-cx); return (Math.abs(((r*.55+a*2.2)%3.2+3.2)%3.2-1.6)<.22&&r<14)?c.map(v=>v*.62):c; }});   // scroll engraving
  part(A,B=>B.disc(150,106,4,S_()),MAT.steel,{noBevel:true}); A.disc(150,106,1.4,C(MAT.steel[0]));
  part(A,B=>cap(B,176,92,190,84,3,2.6),MAT.blued);
  /* trigger guard and triggers */
  part(A,B=>{ for(let a=.2;a<=Math.PI-.2;a+=.025) B.disc(170+Math.cos(a)*10,114+Math.sin(a)*10,2,S_()); },MAT.blued);
  part(A,B=>{ cap(B,168,112,166,122,2,1.4); cap(B,174,113,173,121,2,1.4); },MAT.steel);
  /* left hand cups the fore-end from below: palm under it, thumb along its top edge */
  const L2=[]; part(A,B=>{ B.ell(96,100,20,13,S_()); pl(B,[[70,96],[118,98],[110,116],[66,116]]); },skinRamp(sk));
  L2.push(finger(A,112,88,82,74,5.6,sk));                                                           // thumb along the upper side
  for(const [x0,y0,x1,y1,r] of [[80,106,72,92,5.6],[92,108,86,94,5.8],[104,110,99,97,5.6],[115,111,111,100,4.8]]) L2.push(finger(A,x0,y0,x1,y1,r,sk));   // fingertips curling up the near side
  contact(A,(x,y)=>L2.some(f=>f&&f.on(x,y)));
  /* right hand on the pistol grip, index outside the guard */
  const F=[]; part(A,B=>{ pl(B,[[196,116],[220,120],[226,170],[204,178],[196,148]]); },skinRamp(sk));
  F.push(finger(A,198,118,178,112,5.6,sk));
  for(const [y,r] of [[130,6.2],[142,6],[154,5.2]]){ F.push(finger(A,202,y,184,y-3,r,sk)); F.push(finger(A,185,y-3,180,y+4,r*.86,sk)); }
  part(A,B=>cap(B,220,122,200,104,7.4,5.4),skinRamp(sk),{cyl:[220,122,200,104,7.4,5.4]});
  contact(A,(x,y)=>F.some(f=>f&&f.on(x,y)));
  if(e.iron) for(let i=0;i<9;i++) A.set(60+i*9,52+i*4.2,glow(190,210,230));
  A.outline(rgb(12,10,14)); }),{scale:.5}); }

/* ── the flare gun: a short fat barrel, a steel breech, an orange frame, a ribbed grip ── */
function kFlare(sl,sk,e){ return Object.assign(art(240,180,A=>{
  sleeve2(A,262,214,210,170,40,22,sl,sk);
  part(A,B=>{ pl(B,[[156,102],[180,98],[202,164],[178,172]]); },MAT.orange,{tex:(x,y,c)=>(((x*.35+y)|0)%5===0)?c.map(v=>v*.72):c});   // ribbed grip
  part(A,B=>pl(B,[[164,110],[176,108],[194,160],[182,164]]),MAT.dark,{tex:(x,y,c)=>(y%4===0)?c.map(v=>v*.7):c});                      // black rubber panel
  part(A,B=>pl(B,[[132,78],[178,86],[180,104],[154,110],[134,98]]),MAT.orange,{tex:scuff(.06)});                                       // frame
  part(A,B=>{ for(let a=.15;a<=Math.PI-.15;a+=.025) B.disc(150+Math.cos(a)*11,108+Math.sin(a)*12,2.3,S_()); },MAT.orange);           // guard
  part(A,B=>cap(B,152,108,149,121,2.4,1.7),MAT.dark);
  part(A,B=>pl(B,[[124,70],[150,78],[150,98],[124,92]]),MAT.steel);                                                                    // the breech block
  part(A,B=>B.disc(138,86,4,S_()),MAT.dark); A.disc(138,86,1.4,C([160,160,170]));                                                     // hinge pin
  part(A,B=>cap(B,128,82,78,54,14,13),MAT.orange,{cyl:[128,82,78,54,14,13],spec:true,tex:scuff(.04)});                                 // the barrel: short, fat
  part(A,B=>B.ell(76,53,7,13,S_()),MAT.orange); A.ell(75,53,4.8,9.6,C([24,14,10])); A.ell(74,52,2.6,5.4,C([6,4,4]));               // muzzle face and bore
  part(A,B=>cap(B,176,90,188,74,4,3),MAT.dark,{cyl:[176,90,188,74,4,3]});                                                               // hammer
  part(A,B=>pl(B,[[98,52],[110,58],[108,62],[96,56]]),MAT.ivory);                                                                      // a warning decal
  const F=[]; part(A,B=>{ pl(B,[[184,108],[210,112],[220,168],[196,176],[186,146]]); B.ell(208,164,14,11,S_()); },skinRamp(sk));
  F.push(finger(A,186,112,150,102,5.8,sk));
  F.push(finger(A,190,124,168,119,6.6,sk)); F.push(finger(A,169,119,160,127,5.8,sk));
  F.push(finger(A,192,137,170,133,6.4,sk)); F.push(finger(A,171,133,163,141,5.6,sk));
  F.push(finger(A,194,150,178,148,5.6,sk)); F.push(finger(A,179,148,173,155,4.8,sk));
  part(A,B=>cap(B,210,116,186,98,8,5.6),skinRamp(sk),{cyl:[210,116,186,98,8,5.6]});
  contact(A,(x,y)=>F.some(f=>f&&f.on(x,y)));
  A.outline(rgb(12,10,14)); }),{scale:.5}); }

/* ── the crowbar: a tapered hex shaft, a split claw, a flat pry end below the fist ── */
function kCrowbar(sl,sk,e){ return Object.assign(art(240,180,A=>{
  
  /* the pry end, flattened and tapered, showing below the fist */
  part(A,B=>pl(B,[[196,160],[206,154],[226,184],[214,190]]),MAT.steel,{tex:scuff(.08)});
  /* the shaft, tapering slightly toward the head, chipped red paint along the grip end */
  part(A,B=>cap(B,200,156,72,40,7.5,6.2),MAT.steel,{cyl:[200,156,72,40,7.5,6.2],spec:true,tex:(x,y,c)=>{ const t=(200-x)/128; return (t<.42&&hash(x*2,y*3)>.18)?mix(c,MAT.red[1],.75):(hash(x,y)>.94?c.map(v=>v*.75):c); }});
  /* the head: a curve, then a split claw for pulling nails */
  let gx=72,gy=40,ga=Math.atan2(40-156,72-200); const tip=[];
  part(A,B=>{ let x=gx,y=gy,a=ga; for(let i=0;i<58;i++){ a-=.048; x+=Math.cos(a)*.75; y+=Math.sin(a)*.75; B.disc(x,y,6.2-i*.06,S_()); } tip.push(x,y,a); },MAT.steel,{tex:scuff(.06)});
  { const [x,y,a]=tip; const nx=-Math.sin(a), ny=Math.cos(a); for(let k=0;k<7;k++) A.set(x-Math.cos(a)*k+nx*.5,y-Math.sin(a)*k+ny*.5,C(MAT.dark[0])); }   // the split in the claw
  if(e.etched) for(let i=0;i<10;i++){ const t=.3+i*.06; A.disc(200+(72-200)*t,156+(40-156)*t,1,glow(200,130,255)); }
  fistOn(A,sk,174,128,198,154,8.2,{sl});
  A.outline(rgb(12,10,14)); }),{scale:.5}); }

/* ── holy water: a real glass flask, a cork, a cross engraved in the glass ── */
function kHoly(sl,sk,e){ return Object.assign(art(240,180,A=>{
  sleeve2(A,262,226,160,166,40,20,sl,sk);
  /* the flask: a round body, shoulders, a narrow neck */
  const glassTex=(x,y,c)=>{ const u=(x-112)/30, v=(y-110)/32, r=u*u+v*v; if(y>96&&r<.92) return mix(c,[60,110,200],.45); return c; };
  part(A,B=>{ B.ell(112,112,30,32,S_()); pl(B,[[100,64],[124,64],[132,86],[92,86]]); },MAT.glass,{tex:glassTex,glow:false});
  part(A,B=>pl(B,[[104,56],[120,56],[120,66],[104,66]]),MAT.glass);                                          // neck
  part(A,B=>{ pl(B,[[101,40],[123,40],[121,58],[103,58]]); },MAT.cork,{tex:(x,y,c)=>hash(x,y)>.8?c.map(v=>v*.82):c});   // cork
  part(A,B=>cap(B,100,58,124,58,2.4,2.4),MAT.silverC);                                                        // a wire collar
  /* the cross: engraved, thin, inside the glass */
  for(let y=96;y<=130;y++){ A.set(112,y,glow(236,244,255)); A.set(113,y,C([120,150,190])); }
  for(let x=102;x<=122;x++){ A.set(x,106,glow(236,244,255)); A.set(x,107,C([120,150,190])); }
  /* a hard reflection and the thick dark edge of the glass */
  part(A,B=>{ B.ell(96,96,4,10,S_()); },MAT.glass,{glow:true,noBevel:true}); A.disc(126,92,2,glow(255,255,255));
  /* fingers round the lower half, thumb up the far side, index higher on the shoulder */
  const F=[]; part(A,B=>{ pl(B,[[136,110],[160,112],[170,166],[146,176],[134,150]]); B.ell(158,160,14,11,S_()); },skinRamp(sk));
  F.push(finger(A,138,96,116,90,5.6,sk)); F.push(finger(A,116,90,108,94,4.8,sk));                // index high on the shoulder
  for(const [y,r,l] of [[112,6.4,30],[126,6.4,32],[139,6,28],[150,5.2,22]]){ F.push(finger(A,140,y,140-l*.66,y+2,r,sk)); F.push(finger(A,140-l*.66,y+2,140-l,y+8,r*.86,sk)); }
  part(A,B=>cap(B,150,112,132,82,7.6,5.6),skinRamp(sk),{cyl:[150,112,132,82,7.6,5.6]});         // thumb
  contact(A,(x,y)=>F.some(f=>f&&f.on(x,y)),.7);
  A.outline(rgb(12,10,14)); }),{scale:.5}); }

/* ── blades: a survival knife, the angel blade, the archangel's blade ── */
function blade(A,gx,gy,tx,ty,w0,w1,ramp,o={}){ const L=Math.hypot(tx-gx,ty-gy), ux=(tx-gx)/L, uy=(ty-gy)/L, nx=-uy, ny=ux;
  const P=(t,k)=>[gx+ux*t+nx*k, gy+uy*t+ny*k];
  const pts=o.pts?o.pts(P,L):[P(0,w0),P(L*.8,w1),P(L,0),P(L*.8,-w1),P(0,-w0)];
  /* each half is its own plane: the lit bevel, then the dark one, split by the central ridge */
  part(A,B=>pl(B,pts),ramp,{tex:(x,y,c)=>{ const k=(x-gx)*nx+(y-gy)*ny; return k>0?mix(c,ramp[2],.35):mix(c,ramp[0],.35); }});
  if(o.ridge!==false) for(let t=2;t<L*.94;t+=.5){ const p=P(t,0); A.set(p[0],p[1],C(ramp[3])); const q=P(t,-1); A.set(q[0],q[1],C(ramp[0])); }
  return {P,L}; }
function kKnife(sl,sk,e){ return Object.assign(art(240,180,A=>{
  
  /* drop-point: a thick spine, a bright cutting edge, a narrow dark bevel */
  const b=blade(A,150,98,84,32,7,6,MAT.silverC,{ridge:false,pts:(P,L)=>[P(0,6.5),P(L*.72,6.5),P(L,1),P(L*.86,-4),P(L*.4,-7),P(0,-7)]});
  for(let t=4;t<b.L*.84;t+=.5){ const s=b.P(t,6); A.set(s[0],s[1],C(MAT.dark[1])); const s2=b.P(t,5); A.set(s2[0],s2[1],C(MAT.silverC[1])); }        // spine
  for(let t=4;t<b.L*.9;t+=.5){ const s=b.P(t,-6.5); A.set(s[0],s[1],C(MAT.silverC[3])); const s2=b.P(t,-5); A.set(s2[0],s2[1],C(MAT.silverC[0])); }     // edge and bevel
  for(let t=10;t<30;t+=4){ const s=b.P(t,1); A.set(s[0],s[1],glow(170,40,40)); }                                                                    // a few marks that aren't quite writing
  part(A,B=>pl(B,[[140,94],[164,88],[168,96],[144,104]]),MAT.brass);                                                                                 // guard
  part(A,B=>pl(B,[[150,100],[164,96],[186,140],[172,146]]),MAT.leather,{tex:wrapTex(4,.9)});                                                         // handle scales
  part(A,B=>B.ell(181,148,8,6,S_()),MAT.brass);                                                                                                      // pommel
  fistOn(A,sk,158,104,180,140,8.4,{sl});
  A.outline(rgb(12,10,14)); }),{scale:.5}); }
function kAngel(sl,sk,e){ return Object.assign(art(240,180,A=>{
  
  const b=blade(A,148,96,62,8,8.5,6.5,MAT.silverC);
  for(let t=6;t<26;t+=3){ const s=b.P(t,3.5); A.set(s[0],s[1],C(MAT.silverC[0])); const s2=b.P(t,-3.5); A.set(s2[0],s2[1],C(MAT.silverC[0])); }   // engraving, only near the guard
  part(A,B=>pl(B,[[132,94],[164,84],[168,92],[136,102]]),MAT.silverC);                                                                         // compact crossguard
  part(A,B=>B.disc(150,93,3,S_()),MAT.glass,{glow:true});
  part(A,B=>pl(B,[[150,98],[162,94],[184,138],[172,142]]),MAT.leather,{tex:wrapTex(3.4,.95)});                                                  // wrapped grip
  part(A,B=>B.ell(180,146,7,6,S_()),MAT.silverC);                                                                                              // pommel
  fistOn(A,sk,156,102,178,136,8.2,{sl});
  A.outline(rgb(12,10,14)); }),{scale:.5}); }
function kArch(sl,sk,e){ return Object.assign(art(240,180,A=>{
  
  /* broad at the guard, tapering gradually; gold edges, amber bevels, a bright ridge */
  const b=blade(A,148,94,60,2,14,9,MAT.gold,{pts:(P,L)=>[P(0,13),P(L*.45,11),P(L*.85,6),P(L,0),P(L*.85,-6),P(L*.45,-11),P(0,-13)]});
  for(let t=4;t<b.L*.9;t+=.5){ const p=b.P(t,0); A.set(p[0],p[1],glow(255,250,226)); const e1=b.P(t,12*(1-t/b.L)+1); A.set(e1[0],e1[1],glow(255,236,170)); }
  /* the guard: two wings of feathered metalwork */
  for(const s of [-1,1]) for(let i=0;i<6;i++){ const ang=(s<0?Math.PI*.95:-.15)+s*i*.12, r=12+i*4.2, cx=148+Math.cos(ang)*r*.9, cy=94+Math.sin(ang)*r*.5-i*1.5;
    part(A,B=>{ B.ell(cx,cy,6-i*.4,2.6,S_()); },MAT.gold); }
  part(A,B=>B.disc(150,96,5,S_()),MAT.gold); A.disc(150,96,2.2,glow(255,250,220));
  part(A,B=>pl(B,[[150,100],[162,96],[184,140],[172,144]]),MAT.ivory,{tex:wrapTex(5,.95)});                                                    // ivory grip
  part(A,B=>{ B.ell(180,148,9,7,S_()); },MAT.gold); A.disc(180,148,2,glow(255,250,220));                                                       // a pommel to balance the guard
  fistOn(A,sk,156,104,178,138,8.2,{sl});
  A.outline(rgb(12,10,14)); }),{scale:.5}); }

/* ── the Ring: a hovering relic over an open palm ── */
function kRing(sl,sk,e){ return Object.assign(art(240,180,A=>{
  sleeve2(A,262,232,170,156,40,20,sl,sk);
  /* the palm, facing up; fingers gently bent and apart; the thumb out to the side */
  part(A,B=>{ B.ell(140,150,34,16,S_()); },skinRamp(sk));
  const F=[]; for(const [x0,y0,x1,y1,r] of [[118,146,92,130,6.6],[126,140,104,120,6.8],[138,138,122,116,6.6],[150,140,140,120,5.8]]){ F.push(finger(A,x0,y0,x1,y1,r,sk)); }
  for(const [x0,y0,x1,y1,r] of [[92,130,86,122,5.6],[104,120,100,110,5.8],[122,116,120,106,5.6],[140,120,139,111,5]]) F.push(finger(A,x0,y0,x1,y1,r,sk));
  part(A,B=>cap(B,168,150,190,134,8,6),skinRamp(sk),{cyl:[168,150,190,134,8,6]});                     // thumb, out to the side
  /* a soft glow on the palm where the ring's light falls */
  for(let y=136;y<160;y++) for(let x=110;x<170;x++){ const d=Math.hypot((x-136)/26,(y-146)/8); if(d<1&&A.get(x,y)) A.set(x,y,scaleC(A.get(x,y),1.12)); }
  /* the relic: a thick rim, engraved bands, a central emblem, hovering with a clear gap */
  const cx=128, cy=68;
  part(A,B=>{ B.ell(cx,cy,40,22,S_()); },MAT.silverC);
  part(A,B=>{ B.ell(cx,cy,32,17,S_()); },MAT.dark);
  part(A,B=>{ B.ell(cx,cy,26,13.5,S_()); },MAT.silverC,{tex:(x,y,c)=>{ const a=Math.atan2((y-cy)/13.5,(x-cx)/26); return (Math.round(a*12/Math.PI)%2)?c.map(v=>v*.7):c; }});
  part(A,B=>{ B.ell(cx,cy,18,9,S_()); },MAT.dark);
  for(let i=0;i<8;i++){ const a=i/8*Math.PI*2; part(A,B=>{ const x=cx+Math.cos(a)*40, y=cy+Math.sin(a)*22; pl(B,[[x,y-3],[x+Math.cos(a)*9,y+Math.sin(a)*5],[x,y+3]]); },MAT.silverC); }   // blades round the rim
  for(let y=-6;y<=6;y++){ A.set(cx,cy+y,glow(236,240,252)); } for(let x=-6;x<=6;x++){ A.set(cx+x,cy,glow(236,240,252)); } A.disc(cx,cy,2,glow(255,255,255));   // the emblem
  A.outline(rgb(12,10,14)); }),{scale:.5}); }
