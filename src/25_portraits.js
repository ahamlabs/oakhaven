/* ═══ Portraits ═══════════════════════════════════════════════════════════
   64×80 head-and-shoulders busts, painted from the same look description
   the 32×56 sprites use, so a costume change shows up in both. Three
   expressions per character, as the reference board lays them out:
     0 steady · 1 grim (brows down, mouth set) · 2 hurt (bruise, blood)
   Light comes from the upper left; every surface is cel-shaded into three
   tones, then outlined, which is what keeps it reading as pixel art rather
   than a blurred painting. */

const PW=64, PH=80, PCX=32;
/* head half-width per row: a skull that narrows into a jaw */
function headHW(y){
  if(y<17||y>55) return 0;
  if(y<=36) return Math.round(14*Math.pow(Math.max(0,1-Math.pow(Math.abs(y-36)/19.5,2.6)),1/2.6));
  if(y<=46) return 14-Math.round((y-36)*.25);
  return Math.max(0,Math.round(11.5-(y-46)*.95));
}
function blendC(a,b,t){ return C(blend(a,b,t)); }
function tone(c,f){ return C(dk(c,f)); }
/* three-step cel shade from the light direction */
function cel(c,x,y,cx,hw,top=17){
  const nx=hw?(x-cx)/hw:0, ny=(y-top)/40;
  const v=.62-nx*.55-ny*.12;
  return tone(c, v>.6?1.1:v>.18?.9:.7);
}

function bodyColour(L,x,y,back){
  /* map the bust's chest onto the sprite's torso rules: scale to 32-wide
     coordinates so plaid, ties and lapels land in the same places */
  const t=L.top, c=t.col, u=t.underCol||[200,196,186], dx=x-PCX, open=Math.abs(dx);
  const vNeck=(y-62)*0.55+3;              // width of the V at this row
  if(t.kind==='suit'||t.kind==='uniform'){
    if(open<=Math.max(2,9-(y-60)*.35)&&y<74&&t.kind==='suit'){
      if(open<=1&&y>=63) return t.tie;
      if(open<=Math.max(2,9-(y-60)*.35)-2) return u;
      return dk(c,.72); }                      // lapel edge
    if(t.kind==='uniform'){
      if(open<=1) return t.tie;
      if(y>=67&&y<=69&&open>=6&&open<=13) return dk(c,.72);
      if(open===3&&y%4===0) return [200,176,110];
      return c; }
    return c; }
  if(t.kind==='overalls'){
    if(y>=70&&open<=12) return c;
    if((open>=7&&open<=9)&&y>=62) return c;
    if(y>=72&&open<=13) return dk(c,.86);
    return u; }
  if(t.kind==='hoodie'){ if(open<=4&&y<=66&&y>=62&&(open===3)) return dk(c,1.3); return c; }
  if(t.kind==='nightgown'){ if(open<=7&&y<=64) return L.skin; return (x%4===0)?dk(c,.9):c; }
  if(t.kind==='cardigan'||t.kind==='flannel'||t.kind==='jacket'||t.kind==='duster'||t.kind==='chore'||t.kind==='vest'||t.kind==='waistcoat'||t.kind==='coat'||t.kind==='raincoat'||t.kind==='peacoat'){
    const opened=t.open||t.kind==='cardigan'||t.kind==='vest'||t.kind==='waistcoat';
    const half=opened?Math.max(3,vNeck+3):Math.max(0,vNeck-1);
    if(open<=half){
      if(t.plaid) return ((x>>1)%3===0||(y>>1)%3===0)?t.plaid[1]:t.plaid[0];
      if(t.kind==='flannel') return c;
      if(opened) return (open===Math.round(half))?dk(u,.85):u;
      return u; }
    if(open<=half+2&&opened) return dk(c,1.18);   // lapel catches the light
    if(t.kind==='flannel'||t.check){ const k=t.check||t.col2||dk(c,.6), a=(x>>1)%3===0, b=(y>>1)%3===0; if(a||b) return a&&b?dk(k,.75):k; }
    if(t.kind==='vest'&&(y===70||y===74)) return t.stripe||[230,230,210];
    if(t.kind==='raincoat'&&(x+y)%9===0) return dk(c,1.15);
    return c; }
  return c;
}

function paintBust(A,L,expr){
  const sk=L.skin, t=L.top, ex=L.extras||[], has=k=>ex.includes(k);
  /* shoulders and chest */
  for(let y=58;y<PH;y++){
    const hw=Math.min(31, 13+Math.round((y-58)*2.2));
    for(let x=PCX-hw;x<=PCX+hw;x++){
      const base=bodyColour(L,x,y);
      const nx=(x-PCX)/31, v=.55-nx*.6-(y-58)*.01;
      A.set(x,y,tone(base, v>.55?1.08:v>.05?.9:.72));
    } }
  /* hood or bunched collar behind the neck */
  if(has('hoodcollar')){ const hc=t.hood||dk(t.col,.9);
    for(let y=55;y<=63;y++) for(let x=PCX-16;x<=PCX+16;x++){
      const d=Math.abs(x-PCX); if(d<9&&y>57) continue; if(d>16-(63-y)*.3) continue;
      A.set(x,y,tone(hc,x<PCX?1.05:.8)); } }
  /* neck */
  for(let y=50;y<=61;y++) for(let x=PCX-6;x<=PCX+6;x++) A.set(x,y,tone(sk,y<54?.72:(x<PCX?.92:.78)));
  /* collar points for shirts under jackets and suits */
  if(t.kind==='suit'||t.kind==='uniform'){ const u=t.kind==='uniform'?t.col:(t.underCol||[230,230,224]);
    for(let i=0;i<5;i++){ A.rect(PCX-7+i,58+i,PCX-6+i,58+i,C(dk(u,1.05))); A.rect(PCX+6-i,58+i,PCX+7-i,58+i,C(dk(u,.9))); } }
  /* ears */
  for(const s of [-1,1]){ const ex0=PCX+s*14; A.ell(ex0,37,2.2,4,tone(sk,s<0?.95:.74)); A.set(ex0,37,tone(sk,.6)); }
  /* head */
  for(let y=17;y<=55;y++){ const hw=headHW(y); for(let x=PCX-hw;x<=PCX+hw;x++) A.set(x,y,cel(sk,x,y,PCX,hw)); }
  /* cheekbone and jaw shadow */
  for(let y=40;y<=50;y++){ const hw=headHW(y); A.set(PCX+hw-1,y,tone(sk,.66)); }
  face(A,L,expr);
  hairBust(A,L);
  if(L.hat) hatBust(A,L);
  extrasBust(A,L,expr,has);
  if(L.emissive) for(let i=0;i<A.px.length;i++) if(A.px[i]) A.px[i]=((A.px[i]&0xFFFFFF)|(254<<24))>>>0;
  if(L.tint) tintAll(A,L.tint,(L.tintAmt||.5)*.8);
  A.outline(L.outline?C(L.outline):rgb(10,9,10));

  function face(A,L,expr){
    const e=L.eyes||{}, hairC=L.hair?L.hair.col:dk(sk,.5), brow=C(dk(hairC,.7));
    const ey=36;
    for(const s of [-1,1]){
      const cx=PCX+s*6;
      /* socket shadow */
      A.rect(cx-3,ey-1,cx+3,ey-1,tone(sk,.78));
      if(e.kind==='black'){ A.rect(cx-3,ey,cx+2,ey+2,C([6,4,8])); A.set(cx-2,ey,C([60,50,60])); }
      else if(e.kind==='glow'){ A.rect(cx-3,ey,cx+2,ey+2,glow(...(e.col||[200,240,255]))); }
      else {
        A.rect(cx-3,ey,cx+2,ey+1,C([226,220,212]));
        A.rect(cx-1,ey,cx+1,ey+1,C(e.col||[60,46,36]));
        A.set(cx,ey,C([12,10,10])); A.set(cx-1,ey,C([240,240,236]));
        A.rect(cx-3,ey-1,cx+2,ey-1,C(dk(sk,.45)));         // upper lid line
        A.rect(cx-2,ey+2,cx+1,ey+2,tone(sk,.82));
      }
      /* brows: grim and hurt pull the inner end down */
      const inner=s<0?cx+3:cx-3, outer=s<0?cx-4:cx+4;
      const drop=expr===1?2:expr===2?1:0, lift=expr===2?-1:0;
      A.line(outer,ey-4+lift,inner,ey-4+drop,brow); A.line(outer,ey-5+lift,inner,ey-5+drop,brow);
    }
    /* nose: a lit ridge and a shadow side */
    A.line(PCX+1,ey+1,PCX+2,ey+7,tone(sk,.74)); A.line(PCX,ey+1,PCX,ey+6,tone(sk,1.12));
    A.rect(PCX-2,ey+8,PCX+3,ey+8,tone(sk,.66)); A.set(PCX-2,ey+7,tone(sk,.72));
    /* mouth */
    const my=ey+13, lip=L.lip||dk(sk,.62);
    if(expr===2){ A.rect(PCX-3,my,PCX+3,my+1,C([60,24,26])); A.rect(PCX-3,my-1,PCX+3,my-1,C(lip)); }
    else if(expr===1){ A.rect(PCX-4,my,PCX+4,my,C(dk(lip,.7))); }
    else { A.rect(PCX-3,my,PCX+3,my,C(dk(lip,.8))); A.rect(PCX-2,my+1,PCX+2,my+1,C(lip)); A.set(PCX+4,my-1,C(dk(lip,.8))); }
    A.rect(PCX-2,my+3,PCX+2,my+3,tone(sk,.8));           // under-lip shadow
    if(L.freckles){ for(const [x,y] of [[-8,41],[-6,42],[-4,41],[5,41],[7,42],[9,41],[-1,40],[2,40]]) A.set(PCX+x,y,tone(sk,.82)); }
    if(L.scar){ A.line(PCX+8,33,PCX+10,41,C([214,140,128])); }
    if(L.beard){
      for(let y=42;y<=56;y++){ const hw=headHW(y)||(y<=56?4:0);
        for(let x=PCX-hw;x<=PCX+hw;x++){
          const mouthGap=y>=my-1&&y<=my+1&&Math.abs(x-PCX)<=3;
          if(mouthGap) continue;
          const onLip=y===my-2&&Math.abs(x-PCX)<=5;            // moustache
          const jaw=y>=my+2||Math.abs(x-PCX)>=hw-3||onLip;
          if(!jaw) continue;
          if(L.stubble){ if(noise(x*7,y*13)<.48) continue; A.set(x,y,blendC(sk,L.beard,x<PCX?.75:.9)); }
          else { const n=noise(x*5,y*9); A.set(x,y,C(dk(L.beard,n>.8?1.22:n<.15?.7:x<PCX?1:.84))); } } } }
    if(e.glasses){ const g=C(e.glasses);
      for(const s of [-1,1]){ const cx=PCX+s*6; A.rect(cx-4,ey-2,cx+3,ey-2,g); A.rect(cx-4,ey+3,cx+3,ey+3,g); A.rect(cx-4,ey-2,cx-4,ey+3,g); A.rect(cx+3,ey-2,cx+3,ey+3,g);
        A.set(cx-2,ey-1,C([200,210,220])); }
      A.rect(PCX-2,ey-1,PCX+2,ey-1,g); A.line(PCX-10,ey-1,PCX-13,ey-2,g); A.line(PCX+10,ey-1,PCX+13,ey-2,g); }
  }
  function hairBust(A,L){
    const h=L.hair; if(!h) return;
    const st=h.style, c=h.col, hi=C(dk(c,1.3)), mid=C(c), lo=C(dk(c,.7));
    const shade=(x,y)=> x<PCX-4?hi:x>PCX+6?lo:mid;
    /* the crown: a cap that follows the skull a pixel or two proud of it */
    const crownTo = st==='bald'?0:st==='buzz'?24:st==='spiky'||st==='messy'?27:st==='short'?26:28;
    if(st==='bald'){
      for(const s of [-1,1]) for(let y=31;y<=40;y++) A.rect(PCX+s*13-(s<0?1:0),y,PCX+s*13+(s>0?1:0),y,C(c));
      return; }
    for(let y=14;y<=crownTo;y++){ const hw=Math.max(headHW(Math.max(y+2,18))+2,0);
      for(let x=PCX-hw;x<=PCX+hw;x++){
        const fringe=y>24&&Math.abs(x-PCX)<hw-3&&((x*7+y*3)%5<(y-24));
        if(fringe) continue;
        A.set(x,y,shade(x,y)); } }
    /* sides */
    const side=(y0,y1,w)=>{ for(let y=y0;y<=y1;y++) for(const s of [-1,1]){ const hw=headHW(Math.min(y,46))||9;
      for(let i=0;i<w;i++) A.set(PCX+s*(hw-1+i),y,s<0?(i===0?mid:hi):(i===0?lo:mid)); } };
    if(st==='short'||st==='spiky'||st==='messy'||st==='buzz') side(22,33,2);
    if(st==='spiky') for(const x of [-10,-6,-2,3,7,11]){ A.line(PCX+x,15,PCX+x+1,12+((x+20)%2),shade(PCX+x,12)); A.line(PCX+x+1,15,PCX+x+2,12+((x+20)%2),shade(PCX+x,12)); }
    if(st==='messy') for(const x of [-12,-8,-3,2,6,10]){ A.ell(PCX+x,15+((x+30)%3),2.4,2,shade(PCX+x,15)); }
    if(st==='messy'||st==='spiky'){ for(const x of [-7,-2,3,8]) A.line(PCX+x,26,PCX+x-1,30,shade(PCX+x,28)); }
    if(st==='curly'){ for(let i=0;i<14;i++){ const a=Math.PI*(i/13); A.disc(PCX-Math.cos(a)*15,26-Math.sin(a)*12,3,shade(PCX-Math.cos(a)*15,20)); } side(24,42,3); }
    if(st==='wild'){ for(let i=0;i<18;i++){ const a=Math.PI*(i/17); A.line(PCX-Math.cos(a)*13,24-Math.sin(a)*8,PCX-Math.cos(a)*18,22-Math.sin(a)*13,shade(PCX-Math.cos(a)*15,20)); } side(24,46,3); }
    const fall=(y1,w,wave)=>{ for(let y=20;y<=y1;y++) for(const s of [-1,1]){
        const hw=headHW(Math.min(y,44))||10, wv=wave?Math.round(Math.sin(y*.45+s)*1.2):0;
        const x0=PCX+s*(hw-2)+wv, spread=y>50?Math.min(6,(y-50)*.5):0;
        for(let i=0;i<w+spread;i++){ const x=x0+s*i, strand=(x*3+(y>>3))%7===0;
          A.set(x,y,strand?hi:(i===0?lo:(s<0?mid:C(dk(c,.85))))); } } };
    if(st==='shoulder'){ fall(64,4,true); }
    if(st==='long'){ fall(76,5,true); }
    if(st==='bun'){ side(22,34,2); A.ell(PCX+2,13,6,4.5,mid); A.ell(PCX,12,3,2,hi); }
    if(st==='veil'){ fall(79,6,false);
      /* strands hanging across the face */
      for(const x of [-11,10]) for(let y=24;y<=52;y++) A.set(PCX+x+((y>>4)&1),y,lo);
      for(let y=24;y<=30;y++) A.rect(PCX-3,y,PCX+1,y,mid); }
    /* a parting highlight for anything with volume */
    if(st!=='buzz'&&st!=='veil') A.line(PCX-8,18,PCX-2,15,hi);
  }
  function hatBust(A,L){
    const k=L.hat.kind, c=L.hat.col, m=C(c), lo=C(dk(c,.7)), hi=C(dk(c,1.3));
    if(k==='cap'){ for(let y=12;y<=25;y++){ const hw=Math.max(headHW(Math.max(y,18))+1,10); A.rect(PCX-hw,y,PCX+hw,y,y<16?hi:m); }
      A.rect(PCX-16,25,PCX+14,27,lo); A.rect(PCX-14,28,PCX+12,28,C(dk(c,.45))); A.line(PCX,12,PCX,24,lo); }
    if(k==='beanie'){ for(let y=10;y<=28;y++){ const hw=Math.max(headHW(Math.max(y,18))+2,11); A.rect(PCX-hw,y,PCX+hw,y,y>=24?lo:(y%2?m:hi)); }
      for(let x=PCX-15;x<=PCX+15;x+=2) A.line(x,24,x,28,C(dk(c,.55))); }
    if(k==='peaked'){
      for(let y=8;y<=21;y++){ const hw=16+Math.round((21-y)*.25); A.rect(PCX-hw,y,PCX+hw,y,y<11?hi:m); }
      A.rect(PCX-16,20,PCX+16,22,lo);                         // band
      A.ell(PCX,25,17,2.8,C([14,14,16])); A.rect(PCX-12,24,PCX+12,24,C([60,60,66]));  // patent brim
      A.ell(PCX,14,2.6,3,C([214,178,86])); A.set(PCX,14,C([150,110,50])); A.set(PCX-1,12,C([250,226,150])); }
    if(k==='hardhat'){ A.ell(PCX,19,18,9,m); A.rect(PCX-20,23,PCX+20,25,lo); A.line(PCX-9,13,PCX-3,11,hi); A.rect(PCX-1,10,PCX+1,22,hi); }
    if(k==='hood'){ for(let y=10;y<=79;y++){ const hw=headHW(Math.min(Math.max(y,18),46))+4;
        A.set(PCX-hw,y,m); A.set(PCX-hw+1,y,m); A.set(PCX+hw,y,lo); A.set(PCX+hw-1,y,lo); if(y<20) A.rect(PCX-hw,y,PCX+hw,y,m); } }
  }
  function extrasBust(A,L,expr,has){
    if(has('amulet')){ A.line(PCX-5,59,PCX-1,67,C([24,20,18])); A.line(PCX+5,59,PCX+1,67,C([24,20,18]));
      A.ell(PCX,69,2,2.4,C([212,170,80])); A.set(PCX-1,68,C([250,220,140])); }
    if(has('collar')){ A.rect(PCX-7,57,PCX+7,59,C([18,18,20])); A.rect(PCX-2,57,PCX+2,60,C([240,238,232])); }
    if(has('pendant')){ A.line(PCX-6,60,PCX,70,C([30,26,24])); A.line(PCX+6,60,PCX,70,C([30,26,24])); A.set(PCX,71,C([196,200,206])); A.set(PCX,72,C([150,156,162])); }
    if(has('badge')){ A.ell(PCX-15,70,2.6,3,C([214,178,86])); A.set(PCX-16,69,C([250,226,150])); }
    if(has('belt')) {}
    if(has('lanyard')){ A.line(PCX-6,60,PCX-10,74,C([40,70,130])); A.rect(PCX-13,74,PCX-8,79,C([232,232,226])); }
    if(has('stethoscope')){ const g=C([64,68,74]); A.line(PCX-8,58,PCX-11,72,g); A.line(PCX+8,58,PCX+11,70,g); A.line(PCX-7,58,PCX+7,58,g);
      A.disc(PCX+11,72,2.2,C([186,192,198])); A.set(PCX+10,71,C([240,240,244])); }
    if(has('backpack')){ const pc=C(L.top.pack||[48,44,40]); A.rect(PCX-21,62,PCX-18,79,pc); A.rect(PCX+18,62,PCX+21,79,pc); }
    if(has('nametag')) A.rect(PCX+12,70,PCX+18,72,C([232,228,216]));
    if(has('bandage')){ A.rect(PCX-14,27,PCX+14,30,C([226,218,200])); A.set(PCX+6,28,C([150,40,36])); }
    if(has('blanket')) for(let y=62;y<80;y++) for(let x=0;x<PW;x++){ if(Math.abs(x-PCX)<10-(y-62)*.2&&y<68) continue; if(A.get(x,y)) A.set(x,y,C((y%5===0)?[180,60,52]:[150,124,92])); }
    if(has('blood')||(expr===2&&!L.emissive)){
      const R=mulberry((L.seed||3)+expr*7);
      A.line(PCX+9,26,PCX+8,34,C([140,20,24])); A.set(PCX+9,27,C([190,40,40]));
      A.rect(PCX+2,51,PCX+3,53,C([140,20,24]));
      if(expr===2){ A.ell(PCX-7,40,3,2,C(dk(sk,.68))); A.set(PCX-8,40,C([120,70,90])); }
      if(has('blood')) for(let i=0;i<8;i++) A.set(PCX-20+((R()*40)|0),60+((R()*18)|0),C([100,14,18])); }
    if(L.claws){}
  }
}

/* cache: look × expression → {w,h,px} */
const BUST={};
function bustOf(lookId,expr=0){
  const key=lookId+'|'+expr; if(BUST[key]) return BUST[key];
  const L=LOOKS[lookId]; if(!L) return null;
  return (BUST[key]=art(PW,PH,A=>paintBust(A,L,expr)));
}
