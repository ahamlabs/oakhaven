/* ═══ Characters ═══════════════════════════════════════════════════════════
   A paper-doll builder. A character is a *description* — skin, hair, garment
   kind and colours, trousers, shoes, accessories — and the builder draws it
   in three facings (front, side, back; left is a mirrored side) and five
   frames (idle, two walk steps, act, hurt). So a costume is one object
   literal, and every NPC in town can look like a different person.
   Canvas is 32×56; ground is the bottom row. */

const SKIN = { fair:[226,186,154], warm:[202,156,118], tan:[170,122,88], deep:[116,80,58], old:[212,176,150] };
const dk = (a,f) => [clamp255(a[0]*f),clamp255(a[1]*f),clamp255(a[2]*f)];
const blend = (a,b,t) => [a[0]+(b[0]-a[0])*t|0, a[1]+(b[1]-a[1])*t|0, a[2]+(b[2]-a[2])*t|0];

function legColor(L){ return L.legs.kind==='overalls' ? L.top.col : L.legs.col; }
function sleeveColor(L){ const t=L.top;
  if(t.sleeve) return t.sleeve;
  if(t.kind==='vest'||t.kind==='overalls'||t.kind==='waistcoat') return t.underCol||[200,196,186];
  return t.col; }

function torsoColor(L,x,y,back){
  const t=L.top, c=t.col, c2=t.col2||dk(c,.7), u=t.underCol||[200,196,186], cx=16;
  switch(t.kind){
    case 'henley': return (!back&&x===16&&y<=19)?dk(c,.7):c;
    case 'flannel': { const a=x%4===0, b=y%4===0; return a&&b?dk(c2,.75):(a||b)?c2:c; }
    case 'chore': case 'jacket': case 'duster': {
      if(!back&&t.open&&Math.abs(x-cx)<=2){
        if(t.plaid) return (x%3===0||y%3===0)?t.plaid[1]:t.plaid[0];
        return u; }
      if(t.check){ const a=x%4===0,b=y%4===0; if(a||b) return a&&b?dk(t.check,.75):t.check; }
      if(t.pocket&&!back&&y>=26&&y<=28&&(x===11||x===12||x===20||x===21)) return dk(c,.82);
      if(t.patches&&(y===24||y===25)&&(x<=10||x>=22)) return dk(c,.6);
      if(t.kind==='chore'&&!back&&(y===23||y===24)&&(x===11||x===12||x===20||x===21)) return dk(c,.68);
      if(y<=16&&Math.abs(x-cx)>=3&&Math.abs(x-cx)<=5) return dk(c,1.18);
      return c; }
    case 'suit': {
      if(back) return c;
      if(y<=21&&Math.abs(x-cx)<=(21-y)*.5+.5) return (x===cx&&y>=16)?t.tie:u;
      if(x===cx&&y>21&&y<=26) return t.tie;
      if(Math.abs(x-cx)===2&&y>21&&y%3===0) return dk(c,.6);
      return c; }
    case 'overalls': {
      const bib=!back?(x>=11&&x<=21&&y>=21):(y>=24), strap=(x===12||x===20)&&y<21;
      if(bib||strap) return (x===11||x===21)?dk(c,.8):c;
      return u; }
    case 'hoodie': {
      if(!back&&y>=26&&y<=29&&x>=12&&x<=20) return dk(c,.78);
      if(!back&&(x===14||x===18)&&y>=16&&y<=20) return dk(c,1.35);
      return c; }
    case 'cardigan': {
      if(!back&&Math.abs(x-cx)<=1) return u;
      if(!back&&x===cx+2&&y%3===0) return dk(c,1.5);
      return noise(x*3,y*5)>.7?dk(c,.85):c; }
    case 'vest': {
      if(x<10||x>22) return u;
      if(y===24||y===27) return t.stripe||[230,230,210];
      if(!back&&Math.abs(x-cx)<=1&&y<20) return u;
      return c; }
    case 'waistcoat': {
      if(x<11||x>21) return u;
      if(!back&&Math.abs(x-cx)<=1&&y<19) return u;
      if(!back&&x===cx&&y%3===0) return [200,176,110];
      return c; }
    case 'peacoat': {
      if(!back&&(x===13||x===19)&&(y===19||y===23||y===27)) return [32,28,24];
      if(!back&&y<=17&&Math.abs(x-cx)<=3) return dk(c,1.25);
      return c; }
    case 'uniform': {
      if(back) return (y===15&&(x<=11||x>=21))?dk(c,.8):c;
      if(x===cx&&y<=26) return t.tie;
      if(y<=16&&Math.abs(x-cx)<=1) return t.tie;
      if((y===18||y===19)&&((x>=11&&x<=14)||(x>=18&&x<=21))) return dk(c,y===18?.72:.86);
      if(y===15&&(x<=11||x>=21)) return dk(c,.8);
      if(x===cx+1&&y%3===0&&y<=26) return [200,176,110];
      return c; }
    case 'nightgown': {
      if(!back&&y<=16&&Math.abs(x-cx)<=2) return L.skin;
      return (x%3===0)?dk(c,.9):c; }
    case 'raincoat': { if(!back&&x===cx) return dk(c,.7); return (x+y)%7===0?dk(c,1.18):c; }
    case 'cassock': { if(!back&&x===cx&&y>=17) return dk(c,1.7); return c; }
    case 'coat': return noise(x*7,y*3)>.6?dk(c,.88):c;
    default: return c;
  }
}
function sideTorso(L,x,y){
  const t=L.top, c=t.col;
  if(t.kind==='flannel'){ const a=x%4===0,b=y%4===0,c2=t.col2||dk(c,.7); return a&&b?dk(c2,.75):(a||b)?c2:c; }
  if(t.kind==='suit'&&x>=19) return y<=20?(t.underCol||c):c;
  if(t.kind==='overalls') return (y>=21||x===17)?c:(t.underCol||[200,196,186]);
  if(t.kind==='vest') return (y===24||y===27)?(t.stripe||[230,230,210]):c;
  if(t.kind==='waistcoat') return x>=18?c:(t.underCol||c);
  if((t.kind==='chore'||t.kind==='jacket'||t.kind==='duster')&&t.open&&x>=19) return t.underCol||c;
  if(t.check&&(x%4===0||y%4===0)) return t.check;
  if(t.kind==='uniform'&&x===19&&y<=26) return t.tie;
  if(t.kind==='cardigan'&&noise(x*3,y*5)>.7) return dk(c,.85);
  if(t.kind==='coat'&&noise(x*7,y*3)>.6) return dk(c,.88);
  return c;
}
function legShade(L,lc,x,y,x0,x1){
  if(L.legs.kind==='cargo'){ if((x===x0||x===x1)&&y>=38&&y<=41) return dk(lc,y===38?.7:.84); if(x===x0) return dk(lc,1.12); }
  if(L.legs.kind==='jeans'){ if(x===x0) return dk(lc,1.18); if(y===41||y===42) return dk(lc,1.1); }
  if(L.legs.kind==='slacks'&&x===((x0+x1)>>1)) return dk(lc,.8);
  return lc;
}
function shoes(A,L,x0,y,x1){ A.rect(x0,y,x1,y+2,C(L.shoes)); A.rect(x0,y+3,x1,y+3,C(dk(L.shoes,.55))); }
function wisps(A,L){
  const c=L.top.col;
  for(let y=32;y<=54;y++){ const hw=Math.max(0,7-(y-32)*.32);
    for(let x=Math.round(16-hw);x<=Math.round(16+hw);x++){
      if(noise(x*5,y*9)<.25+(y-32)*.02) continue;
      A.set(x,y,C(dk(c,.9-(y-32)*.02))); } }
}

/* front and back share a body; the back simply has no face and covers more
   of the head with hair */
const HEAD_ROWS=[[13,19],[12,20],[12,20],[12,20],[12,20],[12,20],[12,20],[13,19],[13,19],[14,18]];
function drawFrontBack(A,L,fr,has,back){
  const t=L.top, sk=L.skin, hx=fr===4?1:0;
  /* legs */
  if(!has('smoke')){
    if(L.legs.kind==='skirt'){
      let lE=51,rE=51; if(fr===1) rE=49; if(fr===2) lE=49;
      const hose=L.legs.hose||dk(sk,.85);
      A.rect(12,43,14,lE,C(hose)); A.rect(18,43,20,rE,C(hose));
      shoes(A,L,11,lE+1,15); shoes(A,L,17,rE+1,21);
      for(let y=32;y<=42;y++){ const hw=6+(((y-32)*.35)|0);
        for(let x=16-hw;x<=16+hw;x++) A.set(x,y,C(y===42?dk(L.legs.col,.7):L.legs.col)); }
    } else {
      let lE=51,rE=51; if(fr===1) rE=48; if(fr===2) lE=48;
      const lc=legColor(L);
      for(let y=32;y<=lE;y++) for(let x=11;x<=15;x++) A.set(x,y,C(legShade(L,lc,x,y,11,15)));
      for(let y=32;y<=rE;y++) for(let x=17;x<=21;x++) A.set(x,y,C(legShade(L,lc,x,y,17,21)));
      A.rect(15,32,17,35,C(lc));
      shoes(A,L,10,lE+1,15); shoes(A,L,17,rE+1,22);
    }
  } else wisps(A,L);
  /* long coats hang over the legs */
  if(t.long){
    for(let y=32;y<=t.long;y++){ const flare=((y-32)*.18)|0;
      for(let x=9-flare;x<=23+flare;x++){
        if(!back&&t.open&&x>=13&&x<=19) continue;
        A.set(x,y,C(y===t.long?dk(t.col,.7):(t.kind==='raincoat'&&(x+y)%7===0?dk(t.col,1.18):t.col))); } }
  }
  /* torso */
  for(let y=15;y<=31;y++){ const x0=(y===15||y>=28)?10:9, x1=(y===15||y>=28)?22:23;
    for(let x=x0;x<=x1;x++) A.set(x,y,C(torsoColor(L,x,y,back))); }
  if(!t.long&&!['overalls','raincoat','coat','cassock'].includes(t.kind)) A.rect(10,31,22,31,C(dk(legColor(L),.55)));
  /* arms */
  const sl=sleeveColor(L), skC=C(L.gloves||sk);
  if(fr===4){
    A.rect(5,9,7,17,C(sl)); A.rect(25,9,27,17,C(sl)); A.rect(5,6,7,8,skC); A.rect(25,6,27,8,skC);
  } else {
    let lE=30,rE=30; if(fr===1) lE=27; if(fr===2) rE=27;
    for(let y=16;y<=lE;y++) for(let x=6;x<=8;x++) A.set(x,y,C(t.short&&y>24?sk:sl));
    A.rect(6,lE+1,8,lE+3,skC);
    if(fr===3&&!back){
      A.rect(21,17,26,22,C(sl)); A.ell(23,23,2.6,2.2,skC);
      if(L.claws){ A.set(21,25,C([24,14,18])); A.set(23,26,C([24,14,18])); A.set(25,25,C([24,14,18])); }
    } else {
      for(let y=16;y<=rE;y++) for(let x=24;x<=26;x++) A.set(x,y,C(t.short&&y>24?sk:sl));
      A.rect(24,rE+1,26,rE+3,skC);
    }
    A.rect(7,15,9,16,C(sl)); A.rect(23,15,25,16,C(sl));
  }
  /* neck + head */
  A.rect(15,13,17,14,C(dk(sk,.78)));
  for(let i=0;i<HEAD_ROWS.length;i++){ const y=3+i, [a,b]=HEAD_ROWS[i]; for(let x=a;x<=b;x++) A.set(x+hx,y,C(sk)); }
  A.set(11+hx,7,C(dk(sk,.85))); A.set(21+hx,7,C(dk(sk,.85)));
  if(!back) face(A,L,hx);
  hair(A,L,hx,back);
  if(L.hat) hat(A,L,hx,back);
  if(!back) frontExtras(A,L,has);
  else if(has('hoodcollar')) A.rect(11,13,21,18,C(t.hood||dk(t.col,.9)));
  if(back&&has('backpack')){ A.rect(11,17,21,28,C(t.pack||[48,44,40])); A.rect(12,18,20,19,C(dk(t.pack||[48,44,40],1.25))); }
}
function eyeColour(L){
  const e=L.eyes||{};
  if(e.kind==='glow') return glow(...(e.col||[150,220,255]));
  return C(e.kind==='black'?[6,4,6]:(e.col||[40,32,28]));
}
function face(A,L,hx){
  const sk=L.skin, e=L.eyes||{}, ec=eyeColour(L);
  const brow=C(dk(L.hair?L.hair.col:dk(sk,.6),.8));
  A.set(13+hx,6,brow); A.set(14+hx,6,brow); A.set(18+hx,6,brow); A.set(19+hx,6,brow);
  if(e.kind==='black'||e.kind==='glow'){ A.rect(13+hx,7,14+hx,8,ec); A.rect(18+hx,7,19+hx,8,ec); }
  else { const w=C([228,224,216]); A.set(13+hx,7,w); A.set(14+hx,7,ec); A.set(18+hx,7,ec); A.set(19+hx,7,w); }
  A.set(16+hx,8,C(dk(sk,.82))); A.set(16+hx,9,C(dk(sk,.7)));
  A.rect(15+hx,11,17+hx,11,C(L.lip||dk(sk,.62)));
  if(L.beard) for(let y=10;y<=12;y++) for(let x=13;x<=19;x++){
    if(y===11&&x>=15&&x<=17) continue; if(L.stubble&&(x+y)%2) continue; A.set(x+hx,y,C(L.beard)); }
  if(L.freckles){ const f=C(dk(sk,.84)); A.set(14+hx,9,f); A.set(18+hx,9,f); A.set(15+hx,10,f); }
  if(L.scar){ A.set(19+hx,8,C([220,140,128])); A.set(18+hx,9,C([220,140,128])); A.set(19+hx,10,C([220,140,128])); }
  if(e.glasses){ const g=C(e.glasses);
    A.rect(12+hx,6,15+hx,6,g); A.rect(17+hx,6,20+hx,6,g); A.rect(12+hx,8,15+hx,8,g); A.rect(17+hx,8,20+hx,8,g);
    A.set(12+hx,7,g); A.set(15+hx,7,g); A.set(17+hx,7,g); A.set(20+hx,7,g); A.set(16+hx,7,g); }
}
function hair(A,L,hx,back){
  const h=L.hair; if(!h) return;
  const c=C(h.col), cd=C(dk(h.col,.75)), st=h.style;
  if(st==='bald'){ A.rect(12+hx,6,12+hx,8,c); A.rect(20+hx,6,20+hx,8,c); if(back) A.rect(12+hx,8,20+hx,10,c); return; }
  if(st==='buzz'){ A.rect(12+hx,3,20+hx,3,cd); A.set(12+hx,4,cd); A.set(20+hx,4,cd); if(back) A.rect(12+hx,3,20+hx,10,cd); return; }
  A.rect(13+hx,2,19+hx,2,c); A.rect(12+hx,3,20+hx,4,c);
  if(st==='short'){ A.set(12+hx,5,c); A.set(20+hx,5,c); A.rect(13+hx,5,14+hx,5,c); if(back) A.rect(12+hx,5,20+hx,10,c); }
  if(st==='spiky'){ for(const x of [13,15,17,19]) A.set(x+hx,1,c); A.set(12+hx,5,c); A.set(20+hx,5,c);
    A.set(15+hx,5,c); A.set(16+hx,5,cd); if(back) A.rect(12+hx,5,20+hx,10,c); }
  if(st==='shoulder'){ A.rect(11+hx,4,12+hx,12,c); A.rect(20+hx,4,21+hx,12,c); A.rect(13+hx,5,15+hx,5,c);
    A.set(11+hx,13,cd); A.set(21+hx,13,cd); if(back) A.rect(11+hx,4,21+hx,13,c); }
  if(st==='curly'){ for(let x=11;x<=21;x+=2) A.set(x+hx,1,c); A.rect(11+hx,3,21+hx,5,c);
    A.set(11+hx,6,c); A.set(21+hx,6,c); A.set(11+hx,7,cd); A.set(21+hx,7,cd); A.rect(13+hx,5,15+hx,5,cd);
    if(back) A.rect(11+hx,5,21+hx,11,c); }
  if(st==='messy'){ for(const [x,y] of [[12,1],[14,0],[16,1],[18,0],[20,1],[21,3]]) A.set(x+hx,y,c);
    A.set(12+hx,5,c); A.set(20+hx,5,c); A.rect(13+hx,5,15+hx,5,c); A.set(17+hx,5,cd); A.set(19+hx,5,c);
    if(back) A.rect(12+hx,5,20+hx,11,c); }
  if(st==='veil'){ A.rect(11+hx,3,12+hx,22,c); A.rect(20+hx,3,21+hx,22,c); A.rect(13+hx,5,19+hx,5,c);
    A.rect(15+hx,6,15+hx,10,cd); A.rect(13+hx,6,13+hx,12,c); A.rect(19+hx,6,19+hx,13,c);
    A.set(10+hx,18,cd); A.set(22+hx,20,cd); if(back) A.rect(11+hx,3,21+hx,24,c); }
  if(st==='long'){ A.rect(11+hx,4,12+hx,14,c); A.rect(20+hx,4,21+hx,14,c); A.rect(13+hx,5,14+hx,5,c); if(back) A.rect(11+hx,4,21+hx,15,c); }
  if(st==='bun'){ A.set(12+hx,5,c); A.set(20+hx,5,c); if(back){ A.rect(12+hx,5,20+hx,10,c); A.ell(16+hx,7,2,1.6,cd); } else A.ell(16+hx,1,2.2,1.4,c); }
  if(st==='wild'){ for(let x=10;x<=22;x++) A.set(x+hx,1+((x*7)%3),c); A.rect(11+hx,3,21+hx,5,c);
    A.rect(10+hx,5,11+hx,10,c); A.rect(21+hx,5,22+hx,10,c); if(back) A.rect(10+hx,4,22+hx,12,c); }
}
function hat(A,L,hx,back){
  const k=L.hat.kind, c=C(L.hat.col), cd=C(dk(L.hat.col,.72));
  if(k==='hardhat'){ A.ell(16+hx,2.5,5,2.2,c); A.rect(10+hx,4,22+hx,4,cd); A.set(14+hx,1,C(dk(L.hat.col,1.3))); }
  if(k==='beanie'){ A.rect(12+hx,1,20+hx,4,c); A.rect(12+hx,4,20+hx,4,cd); A.set(16+hx,0,c); }
  if(k==='cap'){ A.rect(12+hx,2,20+hx,4,c); if(!back) A.rect(11+hx,5,18+hx,5,cd); }
  if(k==='peaked'){ A.rect(11+hx,0,21+hx,3,c); A.rect(11+hx,3,21+hx,3,cd); A.rect(11+hx,4,21+hx,5,C([16,16,18]));
    if(!back){ A.set(16+hx,1,C([214,178,86])); A.set(16+hx,2,C([170,130,60])); } }
  if(k==='hood'){ A.rect(11+hx,1,21+hx,4,c); A.rect(10+hx,4,11+hx,13,c); A.rect(21+hx,4,22+hx,13,c); if(back) A.rect(10+hx,1,22+hx,14,c); }
}
function frontExtras(A,L,has){
  const t=L.top;
  if(has('scarf')){ const s=t.scarf||[150,40,40]; A.rect(12,13,20,16,C(s)); A.rect(13,17,14,26,C(s)); A.rect(13,26,14,26,C(dk(s,.7))); }
  if(has('collar')) A.rect(15,14,17,15,C([238,236,230]));
  if(has('badge')) A.rect(11,27,12,28,C([212,178,86]));
  if(has('lanyard')){ A.line(14,15,12,22,C([40,70,130])); A.rect(11,22,13,24,C([232,232,226])); }
  if(has('amulet')){ A.set(15,15,C([20,18,16])); A.set(17,15,C([20,18,16])); A.set(16,16,C([214,170,84])); A.set(16,17,C([150,110,50])); }
  if(has('blanket')){ for(let y=14;y<=23;y++) for(let x=8;x<=24;x++){ if(y<16&&x>12&&x<20) continue;
      A.set(x,y,C((y%4===0)?[180,60,52]:[150,124,92])); } }
  if(has('hoodcollar')){ const hc=C(t.hood||dk(t.col,.9)); A.rect(10,14,12,17,hc); A.rect(20,14,22,17,hc); A.rect(12,14,13,15,hc); A.rect(19,14,20,15,hc); }
  if(has('backpack')){ const pc=C(t.pack||[48,44,40]); A.rect(11,15,11,27,pc); A.rect(21,15,21,27,pc); }
  if(has('belt')){ A.rect(9,30,23,31,C([22,20,20])); A.rect(15,30,17,31,C([200,170,90])); A.rect(21,31,22,34,C([30,28,28])); }
  if(has('pendant')){ const k=C([30,26,24]); A.set(14,15,k); A.set(15,17,k); A.set(17,17,k); A.set(18,15,k); A.set(16,18,C([196,200,206])); }
  if(has('stethoscope')){ const g=C([70,74,80]); A.line(13,14,12,21,g); A.line(19,14,20,20,g); A.disc(20,22,1.2,C([180,186,192])); }
  if(has('nametag')){ A.rect(19,19,21,20,C([232,228,216])); A.set(20,19,C([170,40,30])); }
  if(has('oil')){ const R=mulberry(L.seed||7); for(let i=0;i<14;i++){ const x=10+((R()*13)|0), y=16+((R()*30)|0);
    A.set(x,y,C([14,14,18])); A.set(x,y+1,C([20,20,26])); if(R()<.4) A.set(x,y-1,C([110,120,140])); } }
  if(has('blood')){ const R=mulberry((L.seed||3)+11); for(let i=0;i<12;i++) A.set(10+((R()*13)|0),14+((R()*18)|0),C([100,14,18])); }
}
function drawSide(A,L,fr,has){
  const t=L.top, sk=L.skin;
  if(!has('smoke')){
    const lc=legColor(L), sw=fr===1?3:fr===2?-3:0;
    const leg=(off,dark)=>{ const col=dark?dk(lc,.72):lc;
      for(let y=32;y<=51;y++){ const x0=14+Math.round(off*(y-32)/19); A.rect(x0,y,x0+3,y,C(col)); }
      const xb=14+Math.round(off); A.rect(xb,52,xb+5,54,C(dark?dk(L.shoes,.7):L.shoes)); A.rect(xb,55,xb+5,55,C(dk(L.shoes,.5))); };
    if(L.legs.kind==='skirt'){ leg(-sw*.6,true); leg(sw*.6,false);
      for(let y=32;y<=42;y++) A.rect(12,y,19+(((y-32)*.3)|0),y,C(L.legs.col)); }
    else { leg(-sw,true); leg(sw,false); }
  } else wisps(A,L);
  if(t.long) for(let y=32;y<=t.long;y++) A.rect(11,y,19+(((y-32)*.2)|0),y,C(y===t.long?dk(t.col,.7):t.col));
  for(let y=15;y<=31;y++){ const x1=y<=16?19:20; for(let x=12;x<=x1;x++) A.set(x,y,C(sideTorso(L,x,y))); }
  const sl=sleeveColor(L), as=fr===1?-2:fr===2?2:0;
  const hc=L.gloves||sk;
  if(fr===3){ A.rect(16,18,24,21,C(sl)); A.rect(25,18,26,21,C(hc)); }
  else if(fr===4){ A.rect(14,8,16,17,C(sl)); A.rect(14,6,16,7,C(hc)); }
  else { for(let y=16;y<=29;y++){ const x0=15+Math.round(as*(y-16)/13); A.rect(x0,y,x0+2,y,C(t.short&&y>23?sk:sl)); }
    const xh=15+as; A.rect(xh,30,xh+2,32,C(hc)); }
  if(has('backpack')) A.rect(10,16,12,28,C(t.pack||[48,44,40]));
  if(has('belt')) A.rect(12,30,20,31,C([22,20,20]));
  A.rect(15,13,17,14,C(dk(sk,.78)));
  const PROF=[[14,19],[13,20],[13,20],[13,20],[13,21],[13,21],[13,20],[13,20],[14,19],[15,18]];
  for(let i=0;i<PROF.length;i++) for(let x=PROF[i][0];x<=PROF[i][1];x++) A.set(x,3+i,C(sk));
  A.set(21,8,C(dk(sk,.85)));
  const e=L.eyes||{}, ec=eyeColour(L);
  A.set(19,7,ec); if(e.kind==='black'||e.kind==='glow') A.set(18,7,ec);
  A.set(15,7,C(dk(sk,.8)));
  A.rect(18,11,19,11,C(L.lip||dk(sk,.62)));
  if(L.beard) for(let y=10;y<=12;y++) for(let x=15;x<=20;x++){ if(y===11&&x>=18) continue; if(L.stubble&&(x+y)%2) continue; A.set(x,y,C(L.beard)); }
  if(L.scar){ A.set(18,9,C([220,140,128])); A.set(19,10,C([220,140,128])); }
  if(e.glasses){ const g=C(e.glasses); A.rect(18,6,20,6,g); A.rect(18,8,20,8,g); A.set(20,7,g); A.line(15,7,17,7,g); }
  const h=L.hair;
  if(h){ const c=C(h.col);
    if(h.style==='bald') A.rect(13,6,14,8,c);
    else if(h.style==='buzz'){ A.rect(13,3,19,3,C(dk(h.col,.75))); A.rect(13,4,14,7,C(dk(h.col,.75))); }
    else { A.rect(14,2,19,3,c); A.rect(13,3,15,9,c); A.rect(16,4,19,4,c);
      if(h.style==='long') A.rect(12,4,15,15,c);
      if(h.style==='veil') A.rect(11,4,15,22,c);
      if(h.style==='messy'){ A.set(14,1,c); A.set(16,0,c); A.set(18,1,c); }
      if(h.style==='shoulder') A.rect(12,4,15,12,c);
      if(h.style==='spiky'){ A.set(15,1,c); A.set(17,1,c); A.set(19,1,c); }
      if(h.style==='curly'||h.style==='wild'){ A.rect(12,1,20,4,c); A.rect(12,5,14,11,c); }
      if(h.style==='bun') A.ell(12,5,2,2,c); }
  }
  if(L.hat){ const k=L.hat.kind, c=C(L.hat.col), cd=C(dk(L.hat.col,.72));
    if(k==='hardhat'){ A.ell(16,2.5,4.5,2,c); A.rect(11,4,22,4,cd); }
    if(k==='beanie'){ A.rect(13,1,20,4,c); A.rect(13,4,20,4,cd); }
    if(k==='cap'){ A.rect(13,2,20,4,c); A.rect(20,4,24,4,cd); }
    if(k==='hood'){ A.rect(12,1,20,4,c); A.rect(11,3,14,14,c); }
    if(k==='peaked'){ A.rect(12,0,20,3,c); A.rect(12,3,20,3,cd); A.rect(17,4,24,4,C([16,16,18])); } }
  if(has('hoodcollar')){ const hc2=C(t.hood||dk(t.col,.9)); A.rect(12,13,15,16,hc2); }
  if(has('scarf')){ const s=t.scarf||[150,40,40]; A.rect(14,13,19,15,C(s)); A.rect(19,15,20,23,C(s)); }
  if(has('oil')){ const R=mulberry(L.seed||7); for(let i=0;i<8;i++) A.set(12+((R()*9)|0),16+((R()*28)|0),C([14,14,18])); }
}
function tintAll(A,col,amt){
  for(let i=0;i<A.px.length;i++){ const c=A.px[i]; if(!c||(c>>>24)===254) continue;
    A.px[i]=rgb(lerp(c&255,col[0],amt)|0, lerp((c>>8)&255,col[1],amt)|0, lerp((c>>16)&255,col[2],amt)|0); }
}
function drawFigure(A,L,view,fr){
  const ex=L.extras||[], has=k=>ex.includes(k);
  if(view==='side') drawSide(A,L,fr,has); else drawFrontBack(A,L,fr,has,view==='back');
  if(L.tint) tintAll(A,L.tint,L.tintAmt||.5);
  A.shade(.22);
  if(L.emissive) for(let i=0;i<A.px.length;i++) if(A.px[i]) A.px[i]=((A.px[i]&0xFFFFFF)|(254<<24))>>>0;
  A.outline(L.outline?C(L.outline):rgb(12,10,11));
}
const CHAR = {};
function charSet(id){
  if(CHAR[id]) return CHAR[id];
  const L=LOOKS[id], out={front:[],side:[],back:[]};
  for(const v of ['front','side','back']) for(let f=0;f<5;f++) out[v].push(art(32,56,A=>drawFigure(A,L,v,f)));
  return (CHAR[id]=out);
}

/* ── the cast ───────────────────────────────────────────────────────────── */
/* Faces follow the asset bible. The brothers are told apart by silhouette
   first: Dean is compact with short spiked hair and a dark jacket; Sam is the
   tallest figure in the game with hair to his shoulders. */
const DEAN_FACE = {skin:[214,168,134], hair:{style:'spiky',col:[138,106,64]}, beard:[140,112,82], stubble:true,
                   freckles:true, eyes:{col:[74,106,58]}};
const SAM_FACE  = {skin:[201,156,122], hair:{style:'shoulder',col:[90,62,40]}, eyes:{col:[106,106,64]}};
const WORKER    = {skin:SKIN.warm, hair:{style:'short',col:[90,70,50]}, eyes:{},
  top:{kind:'vest',col:[226,118,34],underCol:[120,124,128],stripe:[238,238,222]}, legs:{kind:'jeans',col:[52,64,96]},
  shoes:[66,48,30], hat:{kind:'hardhat',col:[226,190,40]}};
const RAINWOMAN = {skin:SKIN.deep, hair:{style:'long',col:[24,20,18]}, eyes:{}, lip:[110,60,56],
  top:{kind:'raincoat',col:[214,180,40],long:41}, legs:{kind:'jeans',col:[44,44,52]}, shoes:[30,28,28]};
const TEEN      = {skin:SKIN.fair, hair:{style:'curly',col:[150,96,50]}, eyes:{},
  top:{kind:'hoodie',col:[98,104,110]}, legs:{kind:'jeans',col:[30,32,40]}, shoes:[200,200,196]};
const LOGGER    = {skin:SKIN.old, hair:{style:'bald',col:[190,186,180]}, beard:[200,196,190], eyes:{},
  top:{kind:'flannel',col:[138,42,36],col2:[26,26,26]}, legs:{kind:'slacks',col:[110,100,80]}, shoes:[74,64,52],
  hat:{kind:'cap',col:[74,64,52]}};
const NURSE     = {skin:[188,140,106], hair:{style:'bun',col:[40,30,24]}, eyes:{},
  top:{kind:'jacket',col:[42,46,56],underCol:[46,122,120],open:true}, legs:{kind:'slacks',col:[46,122,120]}, shoes:[232,230,224],
  extras:['lanyard']};
const DELIA     = {skin:[214,174,140], hair:{style:'long',col:[20,16,18]}, eyes:{}, lip:[150,90,86],
  top:{kind:'cardigan',col:[46,82,64],underCol:[224,220,208]}, legs:{kind:'slacks',col:[90,92,98]}, shoes:[40,34,30],
  extras:['lanyard']};
/* Kevin per the reference board: black mop, glasses, a dark jacket open over
   a grey hoodie, backpack straps and cargo pants. */
const KEVIN     = {skin:[200,160,124], hair:{style:'messy',col:[20,18,20]}, eyes:{col:[34,26,22],glasses:[28,28,30]},
  top:{kind:'jacket',col:[54,56,62],underCol:[104,108,114],open:true,hood:[96,100,106],pack:[64,52,40]},
  legs:{kind:'cargo',col:[58,60,66]}, shoes:[80,74,66], extras:['hoodcollar','backpack']};
const MECHANIC  = {skin:[196,150,112], hair:{style:'short',col:[40,34,30]}, beard:[52,44,38], stubble:true, eyes:{col:[60,50,40]},
  top:{kind:'overalls',col:[108,74,46],underCol:[52,62,84]}, legs:{kind:'overalls'}, shoes:[52,40,30],
  hat:{kind:'cap',col:[30,30,34]}, gloves:[44,38,34]};
const OLD_MAN   = {skin:[206,164,138], hair:{style:'bald',col:[214,212,206]}, beard:[226,224,218], eyes:{col:[80,84,90]},
  top:{kind:'jacket',col:[98,72,48],underCol:[46,46,48],open:true,hood:[86,62,40],pocket:true},
  legs:{kind:'slacks',col:[62,58,54]}, shoes:[58,46,36], hat:{kind:'beanie',col:[34,34,38]}, extras:['hoodcollar']};
const POSSESS   = {eyes:{kind:'black'}, tint:[62,50,58], tintAmt:.35};
const HUSK      = {skin:[156,146,140], eyes:{kind:'glow',col:[250,236,214]}, tint:[96,22,34], tintAmt:.38, claws:true, extras:['blood']};

const LOOKS = {
  /* the board's Dean: charcoal jacket over a tan henley, dark jeans */
  dean_leather:  {...DEAN_FACE, top:{kind:'jacket',col:[56,58,66],underCol:[156,118,82],open:true},
                  legs:{kind:'jeans',col:[50,54,64]}, shoes:[74,52,34], extras:['amulet']},
  dean_fbi:      {...DEAN_FACE, top:{kind:'suit',col:[28,28,32],underCol:[230,228,222],tie:[42,46,58]},
                  legs:{kind:'slacks',col:[28,28,32]}, shoes:[20,20,20], extras:['badge']},
  dean_coveralls:{...DEAN_FACE, top:{kind:'overalls',col:[150,72,40],underCol:[190,184,170],short:true},
                  legs:{kind:'overalls'}, shoes:[50,38,28], hat:{kind:'cap',col:[40,46,60]}, extras:['nametag','amulet']},
  dean_duster:   {...DEAN_FACE, top:{kind:'duster',col:[150,110,72],underCol:[56,58,66],open:true,long:47},
                  legs:{kind:'jeans',col:[44,50,64]}, shoes:[54,40,30], extras:['amulet']},
  /* the board's Sam: oxblood hooded jacket over a cream shirt */
  sam_canvas:    {...SAM_FACE, top:{kind:'jacket',col:[106,42,40],underCol:[208,194,168],open:true,hood:[92,36,34]},
                  legs:{kind:'jeans',col:[46,50,62]}, shoes:[74,52,36], extras:['hoodcollar']},
  sam_fbi:       {...SAM_FACE, top:{kind:'suit',col:[46,48,54],underCol:[230,228,222],tie:[46,68,112]},
                  legs:{kind:'slacks',col:[46,48,54]}, shoes:[20,20,20], extras:['badge']},
  sam_rain:      {...SAM_FACE, top:{kind:'raincoat',col:[196,92,40],long:40},
                  legs:{kind:'jeans',col:[46,58,84]}, shoes:[60,50,40], hat:{kind:'hood',col:[176,82,36]}},
  sam_tweed:     {...SAM_FACE, top:{kind:'jacket',col:[106,84,64],underCol:[226,218,202],open:true,patches:true},
                  legs:{kind:'slacks',col:[46,44,44]}, shoes:[58,36,24]},
  marla: {skin:SKIN.old, hair:{style:'bun',col:[180,174,168]}, eyes:{col:[70,60,50],glasses:[124,92,60]}, lip:[150,96,92],
          top:{kind:'cardigan',col:[128,84,108],underCol:[214,206,192]}, legs:{kind:'skirt',col:[62,58,72],hose:[150,120,100]}, shoes:[52,40,36]},
  earl:  {skin:SKIN.fair, hair:{style:'bald',col:[164,160,154]}, beard:[176,172,166], eyes:{col:[60,70,90],glasses:[64,64,64]},
          top:{kind:'waistcoat',col:[96,70,46],underCol:[164,186,210]}, legs:{kind:'slacks',col:[84,70,56]}, shoes:[44,32,24]},
  worker: WORKER, rainwoman: RAINWOMAN, teen: TEEN, logger: LOGGER, nurse: NURSE, delia: DELIA,
  kevin_reading: {...KEVIN, eyes:{kind:'glow',col:[232,240,255]}, extras:['bandage']},
  kevin:         {...KEVIN, extras:['bandage','blanket']},
  kevin_field:   {...KEVIN},
  crowley: {skin:[214,176,148], hair:{style:'short',col:[42,36,34]}, beard:[44,38,36], eyes:{col:[50,40,34]},
            top:{kind:'suit',col:[36,36,42],underCol:[62,58,66],tie:[156,26,34],long:46,open:true},
            legs:{kind:'slacks',col:[20,20,22]}, shoes:[14,14,14], outline:[6,6,8]},
  juno:    {skin:[201,160,138], hair:{style:'bun',col:[26,20,22]}, eyes:{col:[40,30,30]}, lip:[120,40,48],
            top:{kind:'coat',col:[92,30,40],long:53}, legs:{kind:'slacks',col:[20,18,20]}, shoes:[20,18,20]},
  /* ── the reference board's wider cast ── */
  castiel: {skin:[214,176,148], hair:{style:'messy',col:[34,28,26]}, beard:[70,58,50], stubble:true, eyes:{col:[70,112,176]},
            top:{kind:'suit',col:[176,138,96],underCol:[232,230,224],tie:[22,22,26],long:48,open:true},
            legs:{kind:'slacks',col:[38,38,44]}, shoes:[24,22,22]},
  castiel_black: {skin:[214,176,148], hair:{style:'messy',col:[34,28,26]}, beard:[70,58,50], stubble:true, eyes:{col:[70,112,176]},
            top:{kind:'suit',col:[34,32,36],underCol:[232,230,224],tie:[22,22,26],long:48,open:true},
            legs:{kind:'slacks',col:[30,30,34]}, shoes:[20,18,18]},
  chuck:   {skin:[210,166,132], hair:{style:'shoulder',col:[104,72,44]}, beard:[100,72,46], eyes:{col:[90,70,50]},
            top:{kind:'jacket',col:[152,58,50],check:[78,72,72],underCol:[28,28,30],open:true},
            legs:{kind:'jeans',col:[48,58,80]}, shoes:[66,48,34], extras:['pendant']},
  sheriff: {skin:[196,150,116], hair:{style:'short',col:[50,40,32]}, eyes:{col:[70,60,48]},
            top:{kind:'uniform',col:[168,140,100],tie:[24,22,22]}, legs:{kind:'slacks',col:[44,44,50]}, shoes:[20,20,20],
            hat:{kind:'peaked',col:[42,44,50]}, extras:['badge','belt']},
  sarah:   {skin:[222,180,150], hair:{style:'long',col:[128,64,40]}, eyes:{col:[90,70,50]}, lip:[168,96,90],
            top:{kind:'jacket',col:[190,170,140],open:true,long:40,plaid:[[150,46,42],[62,40,40]]},
            legs:{kind:'jeans',col:[70,92,130]}, shoes:[90,66,48]},
  doctor:  {skin:[210,168,136], hair:{style:'short',col:[110,78,50]}, beard:[110,84,60], stubble:true, eyes:{col:[70,90,110]},
            top:{kind:'jacket',col:[214,208,196],underCol:[44,48,62],open:true,long:47,pocket:true},
            legs:{kind:'slacks',col:[50,50,56]}, shoes:[40,34,30], extras:['stethoscope']},
  mechanic: MECHANIC, old_man: OLD_MAN,
  possessed_mechanic: {...MECHANIC, ...POSSESS, extras:['blood'], claws:true, seed:6},
  ghost_girl: {skin:[196,222,234], hair:{style:'veil',col:[14,16,22]}, eyes:{kind:'black'}, lip:[150,170,190],
            top:{kind:'nightgown',col:[206,224,238],long:53}, legs:{kind:'skirt',col:[206,224,238],hose:[196,222,234]},
            shoes:[186,212,226], tint:[120,190,230], tintAmt:.22, emissive:true, outline:[20,50,70]},
  ghost_girl_fade: {skin:[150,200,226], hair:{style:'veil',col:[30,50,70]}, eyes:{kind:'glow',col:[220,250,255]},
            top:{kind:'nightgown',col:[140,196,226],long:53}, legs:{kind:'skirt',col:[140,196,226]}, shoes:[120,180,210],
            extras:['smoke'], tint:[90,170,220], tintAmt:.45, emissive:true, outline:[10,40,60]},
  /* Father Alistair: gentle, grey, a cassock buttoned to the throat */
  alistair: {skin:[214,180,156], hair:{style:'short',col:[176,174,170]}, eyes:{col:[96,110,124]}, lip:[160,110,104],
            top:{kind:'cassock',col:[24,22,26],long:53}, legs:{kind:'slacks',col:[20,20,22]}, shoes:[14,14,14], extras:['collar']},
  alistair_void: {skin:[196,170,150], hair:{style:'short',col:[176,174,170]}, eyes:{kind:'glow',col:[255,250,240]},
            top:{kind:'cassock',col:[24,22,26],long:53}, legs:{kind:'slacks',col:[20,20,22]}, shoes:[14,14,14], extras:['collar'],
            tint:[60,0,20], tintAmt:.18},
  /* Husks: townspeople the Void got to first. Still in their clothes. */
  husk_worker: {...WORKER, ...HUSK, seed:31}, husk_rain: {...RAINWOMAN, ...HUSK, seed:37},
  husk_teen:   {...TEEN, ...HUSK, seed:41},   husk_logger: {...LOGGER, ...HUSK, seed:43},
  /* the brother who isn't there */
  wrong_dean: {...DEAN_FACE, eyes:{kind:'black'}, top:{kind:'jacket',col:[56,58,66],underCol:[156,118,82],open:true},
               legs:{kind:'jeans',col:[50,54,64]}, shoes:[74,52,36], tint:[20,10,14], tintAmt:.35},
  wrong_sam:  {...SAM_FACE, eyes:{kind:'black'}, top:{kind:'jacket',col:[106,42,40],underCol:[208,194,168],open:true,hood:[92,36,34]},
               legs:{kind:'jeans',col:[46,50,62]}, shoes:[74,52,36], extras:['hoodcollar'], tint:[20,10,14], tintAmt:.35},
  possessed_worker: {...WORKER, ...POSSESS, extras:['blood'], claws:true, seed:5},
  possessed_rain:   {...RAINWOMAN, ...POSSESS, extras:['blood'], claws:true, seed:9},
  possessed_logger: {...LOGGER, ...POSSESS, extras:['blood'], claws:true, seed:13},
  possessed_delia:  {...DELIA, ...POSSESS, extras:['lanyard','blood'], seed:17},
  phantom: {skin:[150,190,206], hair:{style:'short',col:[90,120,140]}, eyes:{kind:'glow',col:[210,244,255]},
            top:{kind:'overalls',col:[70,100,120],underCol:[110,140,156]}, legs:{kind:'overalls'}, shoes:[50,70,84],
            hat:{kind:'hardhat',col:[150,180,190]}, extras:['oil'], tint:[90,140,170], tintAmt:.55, outline:[16,30,40], seed:12},
  shade:   {skin:[96,120,134], hair:{style:'wild',col:[40,54,66]}, eyes:{kind:'glow',col:[170,232,255]},
            top:{kind:'hoodie',col:[44,58,70]}, legs:{kind:'jeans',col:[40,50,60]}, shoes:[30,40,50],
            extras:['smoke','oil'], tint:[60,96,120], tintAmt:.5, outline:[8,16,24], seed:21},
};

/* Costumes carry a small, legible perk each, so changing clothes is a choice
   rather than decoration. */
const COSTUMES = {
  dean:{ leather:  {name:'Leather jacket',    perk:'Balanced. Smells like motor oil and Dad.', look:'dean_leather'},
         fbi:      {name:'FBI suit',          perk:'Store prices −15%',                        look:'dean_fbi', price:.85},
         coveralls:{name:'Mechanic coveralls',perk:'+25% stamina',                             look:'dean_coveralls', stamina:1.25},
         duster:   {name:'Field trench',    perk:'Takes 15% less damage',                    look:'dean_duster', armour:.85} },
  sam: { canvas:   {name:'Canvas jacket',     perk:'Balanced. Pockets full of index cards.',   look:'sam_canvas'},
         fbi:      {name:'FBI suit',          perk:'Store prices −15%',                        look:'sam_fbi', price:.85},
         rain:     {name:'Field raincoat',    perk:'+25% stamina',                             look:'sam_rain', stamina:1.25},
         tweed:    {name:'Bunker tweed',      perk:'Rites 20% faster',                         look:'sam_tweed', rite:.8} },
};
function portraitOf(lookId){
  const fr=charSet(lookId).front[0], w=21, h=24, px=new Uint32Array(w*h);
  for(let y=0;y<h;y++) for(let x=0;x<w;x++) px[y*w+x]=fr.px[y*32+x+6];
  return {w,h,px};
}

/* ═══ Props ═════════════════════════════════════════════════════════════ */
function sedanViews(body,dark){
  const lamp=(r,g,b2)=>dark?C([r*.25,g*.25,b2*.25]):glow(r,g,b2);
  const b=body, b2=dk(body,1.4), b3=dk(body,.55), glass=[70,96,112], chrome=[176,182,188], tyre=[16,15,15];
  const hull=A=>{ A.rect(6,10,37,20,C(b)); A.rect(4,13,39,19,C(b)); A.rect(11,4,32,10,C(b2)); A.rect(6,19,37,20,C(b3));
    A.rect(4,16,39,16,C(chrome)); A.disc(9,22,3,C(tyre)); A.disc(34,22,3,C(tyre)); };
  const front=art(44,26,A=>{ hull(A); A.rect(13,6,30,9,C(glass)); A.line(14,6,19,9,C(dk(glass,1.5)));
    A.disc(10,15,2.6,lamp(255,236,190)); A.disc(33,15,2.6,lamp(255,236,190));
    A.rect(17,13,26,17,C(chrome)); for(let x=18;x<=25;x+=2) A.rect(x,14,x,16,C(dk(chrome,.25)));
    A.rect(18,19,25,20,C([214,206,150])); A.shade(.18); A.outline(rgb(10,10,12)); });
  const back=art(44,26,A=>{ hull(A); A.rect(13,6,30,9,C(dk(glass,.7)));
    A.rect(6,13,10,15,lamp(220,36,30)); A.rect(33,13,37,15,lamp(220,36,30));
    A.rect(18,17,25,19,C([214,206,150])); A.rect(36,20,38,21,C([60,60,60])); A.shade(.18); A.outline(rgb(10,10,12)); });
  const side=art(66,24,A=>{ A.rect(3,11,62,18,C(b)); A.rect(1,13,64,17,C(b));
    A.rect(18,4,46,11,C(b2)); A.rect(15,8,18,11,C(b2)); A.rect(46,8,49,11,C(b2));
    A.rect(20,6,31,10,C(glass)); A.rect(33,6,44,10,C(glass)); A.rect(1,14,64,14,C(chrome));
    A.rect(62,12,64,14,lamp(255,228,170)); A.rect(1,12,2,14,lamp(220,40,30));
    A.disc(14,19,4.2,C(tyre)); A.disc(51,19,4.2,C(tyre)); A.disc(14,19,1.8,C(chrome)); A.disc(51,19,1.8,C(chrome));
    A.rect(30,12,31,12,C(chrome)); A.shade(.12); A.outline(rgb(10,10,12)); });
  return {front,side,back};
}
const CARS = { sedan_black:sedanViews([24,26,32]), sedan_rust:sedanViews([118,62,40]),
  parked_blue:sedanViews([46,62,92],true), parked_white:sedanViews([178,176,168],true), parked_green:sedanViews([52,74,58],true) };

function fireBarrel(ph){ return art(18,30,A=>{
  const m=[78,72,60]; A.rect(2,10,15,29,C(m)); A.rect(2,13,15,14,C([104,98,86])); A.rect(2,24,15,25,C([104,98,86]));
  for(let i=0;i<26;i++){ const x=3+((hash(i,ph)*12)|0), h=3+((hash(i+7,ph)*9)|0);
    for(let y=10-h;y<10;y++){ const t=(10-y)/h; A.set(x,y,glow(255,clamp255(224-t*160),clamp255(96-t*86))); } }
  A.rect(3,9,14,10,glow(255,200,80)); A.shade(.15); A.outline(rgb(14,12,10)); }); }

const SPR = {
  tree: art(30,46,A=>{ A.rect(13,32,16,45,C([58,42,28])); A.rect(13,32,14,45,C([38,28,18]));
    for(let i=0;i<7;i++){ const y=4+i*4.6, hw=3+i*1.9, g=[28+i*4,68+i*7,34+i*4];
      for(let x=15-hw;x<=15+hw;x++) for(let yy=y;yy<y+6;yy++) if(noise(Math.round(x),yy|0)>.22) A.set(x,yy|0,C(g)); }
    A.outline(rgb(8,14,10)); }),
  lamp: art(14,46,A=>{ A.rect(6,8,8,45,C([52,56,58])); A.rect(4,44,10,45,C([52,56,58]));
    A.rect(2,3,12,7,C([64,68,70])); A.rect(3,6,11,8,glow(255,236,178)); A.rect(4,7,10,8,glow(255,250,224)); A.outline(rgb(10,10,10)); }),
  barrel: art(18,22,A=>{ A.rect(2,2,15,21,C([78,72,60]));
    for(let y=2;y<=21;y++) for(let x=2;x<=15;x++) if(noise(x,y)>.8) A.set(x,y,C([56,50,42]));
    A.rect(2,5,15,6,C([102,96,84])); A.rect(2,16,15,17,C([102,96,84])); A.shade(.15); A.outline(rgb(12,10,10)); }),
  fire: [fireBarrel(0),fireBarrel(1),fireBarrel(2)],
  sigil: art(44,12,A=>{ A.ell(22,6,21,5.5,glow(200,40,30)); A.ell(22,6,19,4.5,0);
    for(let i=0;i<5;i++){ const a1=i/5*Math.PI*2, a2=(i+2)/5*Math.PI*2;
      A.line(22+Math.cos(a1)*18,6+Math.sin(a1)*4.4,22+Math.cos(a2)*18,6+Math.sin(a2)*4.4,glow(240,70,40)); } }),
  lampOff: art(14,46,A=>{ A.rect(6,8,8,45,C([52,56,58])); A.rect(4,44,10,45,C([52,56,58]));
    A.rect(2,3,12,7,C([64,68,70])); A.rect(3,6,11,8,C([40,42,40])); A.outline(rgb(10,10,10)); }),
  counter: art(36,20,A=>{ const top=[150,112,72], face=[96,66,42], dark=[62,42,28];
    A.rect(0,2,35,5,C(top)); A.rect(0,1,35,1,C([182,144,98])); A.rect(1,6,34,19,C(face));
    for(let x=3;x<34;x+=8){ A.rect(x,8,x+5,17,C(dark)); A.rect(x,8,x+5,8,C([120,86,56])); }
    A.rect(1,19,34,19,C([40,28,20])); A.shade(.12); A.outline(rgb(14,10,8)); }),
  tablet: art(14,10,A=>{ A.rect(1,2,12,9,C([110,106,100])); A.rect(1,9,12,9,C([70,66,62]));
    for(let i=0;i<14;i++) A.set(2+((hash(i,3)*10)|0),3+((hash(i,7)*5)|0),glow(240,214,138)); A.line(9,2,6,6,C([60,56,52])); A.outline(rgb(14,12,12)); }),
  mattress: art(40,10,A=>{ A.rect(1,3,38,9,C([150,140,118])); A.rect(1,3,38,4,C([176,166,142]));
    for(let x=4;x<38;x+=6) A.rect(x,6,x,6,C([120,110,92])); A.ell(12,6,5,2,C([118,100,74])); A.outline(rgb(16,14,12)); }),
  jukebox: art(20,30,A=>{ A.rect(1,6,18,29,C([90,30,40])); A.ell(9.5,7,8.5,6,C([90,30,40]));
    A.ell(9.5,8,6,4.5,glow(255,190,110)); A.rect(4,14,15,22,C([30,26,28])); for(let x=5;x<15;x+=2) A.rect(x,15,x,21,glow(120,210,255));
    A.rect(3,24,16,27,C([170,150,90])); A.outline(rgb(12,8,10)); }),
  pew: art(44,16,A=>{ const w=[78,52,34];
    A.rect(1,2,42,4,C(dk(w,1.2))); A.rect(1,5,42,10,C(w)); A.rect(1,11,42,11,C(dk(w,.6)));
    A.rect(1,12,3,15,C(dk(w,.7))); A.rect(40,12,42,15,C(dk(w,.7))); A.shade(.14); A.outline(rgb(14,10,8)); }),
  candle: art(10,22,A=>{ A.rect(3,10,6,21,C([226,214,188])); A.rect(3,21,6,21,C([150,140,120]));
    A.ell(4.5,7,2.2,3.4,glow(255,190,90)); A.ell(4.5,7.6,1,1.8,glow(255,250,210)); A.rect(1,20,8,21,C([150,118,60])); A.outline(rgb(14,10,8)); }),
  altar: art(48,26,A=>{ A.rect(2,6,45,25,C([170,162,148])); A.rect(0,3,47,6,C([196,188,172]));
    A.rect(6,9,41,22,C([228,224,214])); A.rect(22,9,25,22,C([150,30,36])); A.rect(14,14,33,16,C([150,30,36]));
    A.shade(.12); A.outline(rgb(16,14,12)); }),
  cross: art(16,30,A=>{ A.rect(6,0,9,29,C([60,46,32])); A.rect(0,7,15,10,C([60,46,32])); A.rect(7,1,8,28,C([90,70,48])); A.outline(rgb(10,8,6)); }),
  coat: art(16,30,A=>{ A.rect(7,0,8,2,C([90,90,94])); A.ell(7.5,6,6,3,C([54,64,84]));
    A.rect(2,6,13,28,C([54,64,84])); A.rect(7,8,8,27,C([38,44,58])); A.rect(3,10,5,28,C([46,54,72]));
    for(let i=0;i<26;i++) A.set(3+((hash(i,5)*10)|0),8+((hash(i,9)*19)|0),C([196,194,186]));   // the dust
    A.shade(.16); A.outline(rgb(10,10,12)); }),
  bed: art(40,14,A=>{ A.rect(1,4,38,10,C([200,186,196])); A.rect(1,4,10,8,C([236,232,226])); A.rect(1,11,38,13,C([98,70,52]));
    A.rect(0,0,2,13,C([98,70,52])); A.rect(37,0,39,13,C([98,70,52])); A.ell(26,6,6,2,C([170,150,170])); A.shade(.15); A.outline(rgb(14,10,10)); }),
  drawings: art(26,18,A=>{ A.rect(0,0,12,8,C([230,226,210])); A.rect(14,1,25,9,C([226,222,206])); A.rect(4,10,17,17,C([232,228,214]));
    A.line(2,6,5,3,C([60,90,200])); A.line(5,3,9,6,C([60,90,200])); A.rect(16,5,23,7,C([20,20,22])); A.rect(17,4,19,4,C([20,20,22]));
    A.disc(17,8,1,C([20,20,22])); A.disc(22,8,1,C([20,20,22])); A.rect(7,12,8,16,C([30,30,30])); A.rect(12,12,13,16,C([30,30,30]));
    A.set(7,11,C([200,40,40])); A.set(12,11,C([200,40,40])); A.outline(rgb(30,28,24)); }),
  inhaler: art(8,10,A=>{ A.rect(1,2,6,9,C([60,120,190])); A.rect(2,0,5,2,C([200,200,200])); A.outline(rgb(10,12,16)); }),
  radio: art(26,22,A=>{ A.rect(0,8,25,21,C([70,66,58])); A.rect(2,10,12,19,C([30,34,30])); A.rect(3,11,11,18,glow(90,220,120));
    A.disc(17,13,2.4,C([150,140,120])); A.disc(22,13,2.4,C([150,140,120])); A.line(20,8,24,0,C([160,160,160])); A.outline(rgb(10,10,10)); }),
  popcorn: art(12,12,A=>{ A.rect(2,5,9,11,C([200,40,40])); for(let x=3;x<9;x+=2) A.rect(x,5,x,11,C([236,230,220]));
    for(let i=0;i<9;i++) A.disc(2+((hash(i,2)*8)|0),3+((hash(i,7)*3)|0),1.3,C([250,236,170])); A.outline(rgb(14,10,8)); }),
  tendril: [0,1,2].map(f=>art(18,64,A=>{ for(let y=0;y<64;y++){ const w=1.5+(y/64)*5, xo=9+Math.sin(y*.12+f*1.3)*(1+(64-y)*.05);
      A.rect(xo-w/2,y,xo+w/2,y,C(y%7===0?[70,16,34]:[120,40,56])); if(y%9===0) A.set(xo,y,glow(255,220,200)); }
    A.shade(.2); A.outline(rgb(20,4,10)); })),
  flask: art(8,12,A=>{ A.ell(4,7,3.4,4,C([150,186,214])); A.rect(3,1,5,3,C([140,100,60])); A.set(4,7,glow(170,210,255)); A.outline(rgb(10,12,16)); }),
  flareShot: art(6,6,A=>{ A.disc(3,3,2.6,glow(255,120,60)); A.disc(3,3,1.2,glow(255,236,200)); }),
};

/* ── pickups ────────────────────────────────────────────────────────────── */
const PICK_ART = {
  medkit:  art(16,14,A=>{ A.rect(1,3,14,13,C([226,222,214])); A.rect(1,13,14,13,C([150,146,140])); A.rect(6,0,9,3,C([90,90,90]));
                          A.rect(7,5,8,11,glow(210,36,36)); A.rect(4,7,11,9,glow(210,36,36)); A.shade(.2); A.outline(rgb(14,12,12)); }),
  bandage: art(14,10,A=>{ A.ell(7,5,6,4,C([226,214,190])); A.ell(7,5,2,1.4,C([160,148,124])); A.rect(10,6,13,8,C([226,214,190])); A.outline(rgb(14,12,12)); }),
  shells:  art(16,12,A=>{ A.rect(1,3,14,11,C([150,34,30])); for(let x=3;x<=12;x+=3){ A.rect(x-1,1,x+1,3,C([150,34,30])); A.rect(x-1,1,x+1,1,C([212,176,84])); }
                          A.rect(3,6,12,8,C([226,214,190])); A.shade(.2); A.outline(rgb(14,12,12)); }),
  rounds:  art(14,12,A=>{ A.rect(1,6,12,11,C([70,70,74])); for(let x=2;x<=11;x+=3){ A.rect(x,1,x+1,6,C([212,176,84])); A.rect(x,1,x+1,1,C([150,110,70])); }
                          A.shade(.2); A.outline(rgb(14,12,12)); }),
  holywater:art(10,15,A=>{ A.ell(5,9,4.4,5,C([150,186,214])); for(let y=9;y<=13;y++) for(let x=1;x<=9;x++) if(A.get(x,y)) A.set(x,y,glow(96,150,220));
                          A.rect(4,2,6,4,C([150,186,214])); A.rect(3,0,7,2,C([140,100,60])); A.rect(4,6,6,12,C([230,240,248])); A.rect(2,8,8,9,C([230,240,248])); A.outline(rgb(10,12,16)); }),
  battery: art(10,14,A=>{ A.rect(1,2,8,13,C([60,64,70])); A.rect(3,0,6,2,C([200,150,90])); A.rect(1,6,8,8,C([200,180,60])); A.shade(.2); A.outline(rgb(10,10,10)); }),
  cash:    art(16,10,A=>{ A.rect(0,2,15,9,C([88,128,82])); A.rect(0,2,15,2,C([116,160,104])); A.rect(6,2,8,9,C([226,214,190])); A.disc(12,6,1.6,C([60,96,58])); A.outline(rgb(10,14,10)); }),
  page:    art(12,15,A=>{ A.rect(0,0,11,14,C([214,200,164])); for(let y=2;y<=12;y+=2) A.rect(1,y,10,y,C([150,136,110]));
                          A.ell(6,7,3.2,3.2,glow(210,50,40)); A.ell(6,7,2,2,C([214,200,164])); A.outline(rgb(30,24,18)); }),
  flares:  art(14,12,A=>{ for(let i=0;i<3;i++){ A.rect(1+i*4,2,3+i*4,11,C([200,40,30])); A.rect(1+i*4,1,3+i*4,2,glow(255,200,120)); } A.outline(rgb(14,10,10)); }),
  armor:   art(16,16,A=>{ A.rect(2,2,13,15,C([40,52,70])); A.rect(5,0,10,3,0); A.rect(0,2,2,8,C([40,52,70])); A.rect(13,2,15,8,C([40,52,70]));
                          A.rect(4,6,11,7,C([200,200,190])); A.shade(.2); A.outline(rgb(8,10,14)); }),
  knife:   art(16,12,A=>{ A.line(2,9,12,2,C([186,190,196])); A.line(3,9,12,3,C([230,234,238])); A.rect(1,9,4,11,C([90,52,36])); A.outline(rgb(10,10,12)); }),
  flaregun:art(16,12,A=>{ A.rect(2,2,13,6,C([214,96,30])); A.rect(3,6,7,11,C([170,70,24])); A.disc(13,4,1.4,C([20,16,14])); A.outline(rgb(14,10,8)); }),
};
const PICKUPS = {
  medkit:{label:'Med kit',icon:'medkit',h:.42},        bandage:{label:'Bandages',icon:'bandage',h:.3},
  shells:{label:'Rock-salt shells',icon:'shells',h:.36,ammo:'shells',amt:6},
  rounds:{label:'.45 rounds',icon:'rounds',h:.32,ammo:'rounds',amt:6},
  holywater:{label:'Holy water',icon:'holywater',h:.42,ammo:'holywater',amt:2},
  flares:{label:'Flares',icon:'flares',h:.32,ammo:'flares',amt:3},
  battery:{label:'Torch battery',icon:'battery',h:.34}, cash:{label:'Cash',icon:'cash',h:.26},
  page:{label:'Torn page',icon:'page',h:.4},            armor:{label:'Kevlar vest',icon:'armor',h:.46},
  knife:{label:'Demon-killing knife',icon:'knife',h:.34,weapon:'knife'},
  flaregun:{label:'Flare gun',icon:'flaregun',h:.36,weapon:'flare'},
};

/* ═══ First-person viewmodels ═════════════════════════════════════════════
   Drawn per costume, because the sleeve in frame is the one place you see
   your own clothes. Canvas 120×90, designed for a 200-pixel-tall screen and
   scaled from there. */
function vmArm(A,x0,y0,x1,y1,r0,r1,sl,sk,cuff=.68){
  for(let i=0;i<=48;i++){ const t=i/48, r=r0+(r1-r0)*t;
    A.ell(x0+(x1-x0)*t, y0+(y1-y0)*t, r, r*.92, C(t<cuff?sl:t<cuff+.06?dk(sl,.62):sk)); } }
function vmFist(A,x,y,r,sk){ A.ell(x,y,r,r*.82,C(sk));
  for(let k=-1;k<=1;k++) A.set(x+k*r*.45,y-r*.55,C(dk(sk,.72))); A.set(x-r*.8,y,C(dk(sk,.8))); }
function vmBar(A,x0,y0,x1,y1,w,col,hi){ const n=Math.ceil(Math.hypot(x1-x0,y1-y0));
  for(let i=0;i<=n;i++){ const t=i/n, x=x0+(x1-x0)*t, y=y0+(y1-y0)*t; A.disc(x,y,w/2,C(col)); if(hi) A.set(x-w/4,y,C(hi)); } }
function vmFinish(A){ A.shade(.14); A.outline(rgb(10,9,9)); }

function buildViewmodels(lookId, ench){
  const L=LOOKS[lookId], sl=sleeveColor(L), sk=L.skin, V={};
  V.crowbar=art(120,90,A=>{ const iron=[58,58,62];
    vmBar(A,92,88,44,14,5,iron,[124,124,132]);
    A.disc(42,12,3,C(iron)); A.disc(39,15,2.4,C(iron)); A.disc(37,18,2,C(iron));
    vmBar(A,85,77,79,67,5.6,[150,40,30]);
    if(ench.etched) for(let i=0;i<6;i++){ const t=.22+i*.09; A.set(92+(44-92)*t,88+(14-88)*t,glow(200,130,255)); }
    vmArm(A,112,98,86,72,15,10,sl,sk); vmFist(A,84,68,10,sk); vmFinish(A); });
  /* the revolver: three-quarter view from behind the right hand, so it reads
     as a gun at any size — muzzle, sight, barrel, fluted cylinder, hammer,
     trigger guard and a wooden grip in the fist */
  V.revolver=art(120,90,A=>{ const st=[66,70,78], hi=[150,156,168], dk2=[30,32,36], wood=[112,68,40];
    for(let i=0;i<=30;i++){ const t=i/30, x=58+(70-58)*t, y=18+(48-18)*t, w=2.4+t*1.6;
      A.rect(x-w,y,x+w,y+1,C(st)); A.set(x-w,y,C(hi)); A.set(x+w,y,C(dk2)); }
    for(let i=0;i<=22;i++){ const t=i/22, x=60+(70-60)*t, y=24+(48-24)*t; A.disc(x+3.2,y+.5,1.2,C(dk(st,.75))); }   // ejector rod
    A.ell(58,18,3,2,C(dk2)); A.ell(58,18,1.6,1.1,C([6,6,8]));                         // the muzzle
    A.rect(57,13,59,16,C(hi));                                                         // front sight
    A.rect(64,46,82,60,C(st)); A.rect(64,46,82,47,C(hi));
    for(let x=66;x<=80;x+=3) A.rect(x,48,x,59,C(dk(st,.55)));                          // cylinder flutes
    A.rect(70,42,84,46,C(st)); A.rect(70,42,84,42,C(hi)); A.rect(74,40,76,42,C(dk2));  // top strap, rear sight
    vmBar(A,84,46,90,38,3,dk2,[96,98,104]);                                            // hammer spur
    for(let a=0;a<=Math.PI;a+=.1) A.disc(74+Math.cos(a)*5,61+Math.sin(a)*6,1,C(dk2));  // trigger guard
    A.line(74,61,75,66,C(dk(st,.6)));                                                  // trigger
    for(let y=58;y<=84;y++){ const t=(y-58)/26, x0=78+t*8, x1=88+t*8;
      for(let x=x0|0;x<=x1;x++) A.set(x,y,C(((x+y)&3)===0?dk(wood,.7):wood)); }      // checkered grip
    if(ench.blessed) for(let i=0;i<5;i++) A.set(62+i*2,26+i*5,glow(255,226,150));
    vmArm(A,112,100,92,80,15,10,sl,sk); vmFist(A,88,74,10,sk); A.ell(80,64,4,2.4,C(sk)); vmFinish(A); });
  V.shotgun=art(120,90,A=>{ const st=[60,62,68];
    vmBar(A,50,92,56,24,8,st,[138,142,150]); vmBar(A,66,92,62,24,8,st,[138,142,150]);
    A.disc(56,24,3.6,C([14,14,16])); A.disc(62,24,3.6,C([14,14,16]));
    vmBar(A,59,24,59,70,2,[92,96,104]); A.disc(59,21,1.2,C([230,220,180]));           // rib and bead
    A.rect(50,68,68,78,C([70,72,78])); A.rect(50,68,68,69,C([140,144,150])); A.rect(57,72,61,76,C([40,40,44])); // receiver
    for(let y=50;y<=68;y++){ const k=(68-y)*.15; A.rect(47+k,y,70-k,y,C(y%5===0?[96,58,30]:[124,76,40])); }
    if(ench.iron) for(let i=0;i<5;i++) A.set(52+i*3,58,glow(190,210,230));
    vmArm(A,6,98,40,70,15,10,sl,sk); vmFist(A,44,66,10,sk);
    vmArm(A,118,98,90,82,15,11,sl,sk); vmFist(A,86,80,10,sk); vmFinish(A); });
  V.knife=art(120,90,A=>{
    for(let i=0;i<=40;i++){ const t=i/40, x=72+(54-72)*t+Math.sin(t*3.1)*3, y=60+(16-60)*t, w=4.5*(1-t*.8)+.6;
      A.disc(x,y,w,C([178,184,190])); A.set(x+w*.6,y,C([232,236,240])); if(i%5===2) A.set(x-w*.3,y,C([86,90,96])); }
    A.rect(66,58,82,62,C([156,124,72])); vmBar(A,76,64,82,78,7,[70,40,30],[100,60,44]);
    vmArm(A,110,98,88,80,15,10,sl,sk); vmFist(A,84,74,10,sk); vmFinish(A); });
  V.holywater=art(120,90,A=>{ vmArm(A,6,98,34,72,15,10,sl,sk);
    A.ell(44,46,11,14,C([150,186,214]));
    for(let y=46;y<=60;y++) for(let x=33;x<=55;x++) if(A.get(x,y)) A.set(x,y,glow(96,150,216));
    A.rect(41,26,47,33,C([150,186,214])); A.rect(40,22,48,26,C([140,100,60]));
    A.rect(43,38,45,54,C([226,238,246])); A.rect(39,43,49,45,C([226,238,246]));
    vmFist(A,40,62,10,sk); vmFinish(A); });
  /* the flare pistol: a fat orange break-action with a bore you could post
     a letter through, so it never reads as a torch */
  V.flare=art(120,90,A=>{ const or=[214,96,30], od=[150,60,20], hi=[250,150,80];
    for(let i=0;i<=24;i++){ const t=i/24, x=56+(70-56)*t, y=24+(46-24)*t, w=6.5-t*1.2;
      A.rect(x-w,y,x+w,y+1,C(or)); A.set(x-w,y,C(hi)); A.set(x+w,y,C(od)); }
    A.ell(56,24,7,4.5,C(od)); A.ell(56,24,5,3,C([24,16,12])); A.ell(56,24,2.6,1.6,C([8,6,6]));   // the bore
    A.rect(66,44,82,52,C(od)); A.rect(66,44,82,45,C(hi)); A.disc(74,48,2,C([40,30,24]));            // hinge block
    vmBar(A,82,44,86,38,3,[40,34,30]);                                                             // hammer
    for(let a=0;a<=Math.PI;a+=.1) A.disc(72+Math.cos(a)*6,54+Math.sin(a)*7,1.2,C(od));            // big guard
    A.line(72,54,73,60,C([40,30,24]));
    for(let y=50;y<=82;y++){ const t=(y-50)/32, x0=76+t*9, x1=88+t*9; A.rect(x0,y,x1,y,C(y%6===0?od:or)); }
    A.rect(60,30,62,31,C([255,240,200]));                                                           // a warning label
    vmArm(A,112,100,94,80,15,10,sl,sk); vmFist(A,90,74,10,sk); A.ell(80,58,4,2.4,C(sk)); vmFinish(A); });
  const journal=lit=>art(120,90,A=>{ const page=[216,206,178], pd=[182,170,142];
    for(let y=34;y<=74;y++){ const t=(y-34)/40; A.rect(24-8*t,y,96+8*t,y,C([72,40,34])); }
    for(let y=36;y<=72;y++){ const t=(y-36)/36;
      for(let x=Math.round(27-7*t);x<=Math.round(93+7*t);x++) A.set(x,y,C(Math.abs(x-60)<=1?dk(page,.7):(x<60?page:pd))); }
    for(let y=40;y<=68;y+=3){ const t=(y-36)/36;
      for(let x=Math.round(31-7*t);x<=Math.round(89+7*t);x++){ if(Math.abs(x-60)<4||x>68&&x<84&&y>46&&y<62) continue;
        if(hash(x,y)<.55) A.set(x,y,lit?glow(160,206,255):C([72,60,50])); } }
    A.ell(76,54,6,6,lit?glow(255,124,90):C([140,40,30])); A.ell(76,54,4,4,C(pd));
    vmArm(A,4,98,22,74,15,10,sl,sk); vmFist(A,24,70,9,sk);
    vmArm(A,116,98,98,74,15,10,sl,sk); vmFist(A,96,70,9,sk); vmFinish(A); });
  V.journal=journal(false); V.journalLit=journal(true);
  return V;
}
const MUZZLE = art(36,30,A=>{
  for(let i=0;i<14;i++){ const a=i/14*Math.PI*2, r=i%2?9:15; A.line(18,15,18+Math.cos(a)*r,15+Math.sin(a)*r*.8,glow(255,210,120)); }
  A.ell(18,15,7,6,glow(255,236,180)); A.ell(18,15,4,3,glow(255,255,238)); });
