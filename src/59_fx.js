/* ═══ Image quality ═════════════════════════════════════════════════════════
   Atmosphere and contact, at the cost of a few multiplies per pixel:

   · distance fog that fades the world into the sky's own colour (and into
     grey after the lockdown, red in the fold) instead of just into black;
   · ambient occlusion where every wall meets the floor;
   · soft contact shadows under people, props and cars;
   · a glow pass that lets lamps, fires, candles and screens bleed light
     (Modern and Crisp only: the palette modes keep their hard 1993 edges);
   · chromatic tearing and film grain that rise with dread.

   Fog is a 0–256 lookup by distance, built once a frame. */

const FOG={k:new Uint16Array(512), r:0,g:0,b:0, on:false, q:false};
S.settings.glow=true; S.settings.fog=true;
function fogSetup(){
  const s=S.sector, p=S.light, A=S.act, F=FOG;
  F.q=!!MODE.quantise;
  if(!S.settings.fog){ F.on=false; return; }
  let col, start, end, max;
  if(s.id==='cathedral'){ col=[42,6,12]; start=2.5; end=13; max=.85; }
  else if(!s.outdoor){ col=[10,9,10]; start=5; end=20; max=.45; }
  else {
    const sky=(S.skyOver||p.sky).bot, k=S.preset==='day'?.85:S.preset==='dusk'?.62:.55;
    col=[sky[0]*k,sky[1]*k,sky[2]*k];
    if(S.preset==='night'){ start=4; end=24; max=.88; } else if(S.preset==='dusk'){ start=6; end=30; max=.75; } else { start=10; end=40; max=.5; }
    if(A>=2&&s.id==='street'){ const g=S.preset==='day'?132:S.preset==='dusk'?84:52;
      col=S.skyOver?[sky[0]*.55,sky[1]*.4,sky[2]*.4]:[g,g+3,g+6]; start=2.5; end=17; max=.93; }
  }
  F.r=col[0]|0; F.g=col[1]|0; F.b=col[2]|0; F.on=true; F.rb=((F.b<<16)|F.r)>>>0; F.gg=F.g<<8;
  for(let i=0;i<512;i++){ const d=i/16, t=Math.min(1,Math.max(0,(d-start)/(end-start)));
    F.k[i]=Math.round(256*max*t*(2-t)); }
}
/* blend a pixel toward the fog colour; k is 0..256. Red and blue are mixed
   together in one packed multiply (ik+k=256 keeps it under 2^32). */
function fogMix(c,k){
  const ik=256-k;
  const o=(0xFF000000|((((c&0xFF00FF)*ik+FOG.rb*k)>>>8)&0xFF00FF)|((((c&0xFF00)*ik+FOG.gg*k)>>>8)&0xFF00))>>>0;
  return FOG.q?q(o):o;
}
const fogAt=d=>FOG.on?FOG.k[d>=31.9?511:(d*16)|0]:0;

/* a soft dark ellipse on the ground under a sprite */
function contactShadow(scrX,ground,w,ty,strength){
  const rw=Math.max(2,(w*.42)|0), rh=Math.max(1,(w*.09)|0), y0=ground-rh, y1=ground+rh;
  for(let y=Math.max(0,y0);y<=Math.min(IH-1,y1);y++){
    const dy=(y-ground)/(rh+.5), span=Math.sqrt(Math.max(0,1-dy*dy))*rw;
    for(let x=Math.max(0,(scrX-span)|0);x<=Math.min(IW-1,(scrX+span)|0);x++){
      if(ty>=zbuf[x]) continue;
      const i=y*IW+x, c=fb[i], f=1-strength*(1-Math.abs(x-scrX)/(span+1))*(1-Math.abs(dy)*.6);
      const o=(0xFF000000|(((((c>>16)&255)*f)|0)<<16)|(((((c>>8)&255)*f)|0)<<8)|(((c&255)*f)|0))>>>0;
      fb[i]=FOG.q?q(o):o;
    }
  }
}

/* glow: bright pixels, blurred at quarter resolution, added back */
let GL=null;
function glowPass(){
  if(!S.settings.glow||MODE.quantise) return;
  const bw=IW>>2, bh=IH>>2, n=bw*bh;
  if(!GL||GL.n!==n) GL={n,r:new Float32Array(n),g:new Float32Array(n),b:new Float32Array(n),t:new Float32Array(n),any:new Uint8Array(n)};
  const R=GL.r,G=GL.g,B=GL.b,T=GL.t;
  let lit=0;
  for(let y=0;y<bh;y++){ const row=((y<<2)+1)*IW;
    for(let x=0;x<bw;x++){
      const c=fb[row+(x<<2)+1], cr=c&255, cg=(c>>8)&255, cb=(c>>16)&255, l=cr*.3+cg*.55+cb*.15, i=y*bw+x;
      if(l>200){ const w=(l-200)/55*.8; R[i]=cr*w; G[i]=cg*w; B[i]=cb*w; lit++; } else { R[i]=0; G[i]=0; B[i]=0; } } }
  if(!lit) return;
  const blur=A=>{ for(let pass=0;pass<2;pass++){
      for(let y=0;y<bh;y++){ let acc=0; const o=y*bw;
        for(let x=-3;x<bw;x++){ if(x+3<bw) acc+=A[o+x+3]; if(x-4>=0) acc-=A[o+x-4]; if(x>=0) T[o+x]=acc*.142857; } }
      for(let x=0;x<bw;x++){ let acc=0;
        for(let y=-3;y<bh;y++){ if(y+3<bh) acc+=T[(y+3)*bw+x]; if(y-4>=0) acc-=T[(y-4)*bw+x]; if(y>=0) A[y*bw+x]=acc*.142857; } } } };
  blur(R); blur(G); blur(B);
  /* add back block by block, skipping the dark ones entirely */
  for(let by=0;by<bh;by++) for(let bx=0;bx<bw;bx++){
    const j=by*bw+bx, ar=R[j]*.9|0, ag=G[j]*.9|0, ab=B[j]*.9|0;
    if(ar+ag+ab<3) continue;
    for(let y=by<<2, ye=y+4;y<ye;y++){ let i=y*IW+(bx<<2);
      for(let k=0;k<4;k++,i++){ const c=fb[i];
        let r=(c&255)+ar, g=((c>>8)&255)+ag, b=((c>>16)&255)+ab;
        if(r>255)r=255; if(g>255)g=255; if(b>255)b=255;
        fb[i]=(0xFF000000|(b<<16)|(g<<8)|r)>>>0; } } }
}
/* the image tearing: red slides one way, blue the other */
function chromaPass(amount){
  const s=Math.max(1,Math.round(amount*IW/160));
  for(let y=0;y<IH;y++){ const row=y*IW;
    for(let x=IW-1;x>=s;x--){ const i=row+x; fb[i]=((fb[i]&0xFFFFFF00)|(fb[i-s]&0xFF))>>>0; }
    for(let x=0;x<IW-s;x++){ const i=row+x; fb[i]=((fb[i]&0xFF00FFFF)|(fb[i+s]&0x00FF0000))>>>0; } }
}
/* film grain: a few tiles of noise, drawn over the frame */
let GRAIN=null;
function drawGrain(){
  const a=(.035+(S.dread||0)*.11+(S.glitchA||0)*.2)*S.settings.intensity; if(a<.02) return;
  if(!GRAIN){ GRAIN=[]; for(let f=0;f<3;f++){ const c=document.createElement('canvas'); c.width=c.height=128;
      const x=c.getContext('2d'); if(!x||!x.createImageData) return; const id=x.createImageData(128,128);
      for(let i=0;i<id.data.length;i+=4){ const v=Math.random()*255|0; id.data[i]=id.data[i+1]=id.data[i+2]=v; id.data[i+3]=255; }
      x.putImageData(id,0,0); GRAIN.push(c); } }
  const g=GRAIN[(S.time*24|0)%GRAIN.length]; if(!g) return;
  octx.save(); octx.globalAlpha=a; octx.globalCompositeOperation='overlay';
  const ox=-(Math.random()*128|0), oy=-(Math.random()*128|0);
  for(let y=oy;y<over.height;y+=256) for(let x=ox;x<over.width;x+=256) octx.drawImage(g,x,y,256,256);
  octx.restore();
}
