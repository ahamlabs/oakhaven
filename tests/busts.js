const {load}=require('./harness'); const {writePNG}=require('./png');
const G=load(); const out=process.argv[2]; const ids=process.argv.slice(3);
const W=64,H=80,pad=4, cols=3, rows=ids.length;
const SW=cols*(W+pad)+pad, SH=rows*(H+pad)+pad, sheet=new Uint32Array(SW*SH).fill(0xff141210);
ids.forEach((id,r)=>{ for(let e=0;e<3;e++){ const b=G.bustOf(id,e); const ox=pad+e*(W+pad), oy=pad+r*(H+pad);
  for(let y=0;y<H;y++) for(let x=0;x<W;x++){ const p=b.px[y*W+x]; sheet[(oy+y)*SW+ox+x]=p?(p|0xff000000)>>>0:0xff2a2420; } } });
writePNG(out,sheet,SW,SH,3,3);
