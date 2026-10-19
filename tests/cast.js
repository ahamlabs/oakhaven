const {load}=require('./harness'); const {writePNG}=require('./png');
const G=load(); const ids=process.argv.slice(3); const out=process.argv[2];
const cw=32,ch=56,cols=5, sheet=new Uint32Array(cols*cw*ids.length*ch).fill(0xff1a1612);
ids.forEach((id,r)=>{ const s=G.charSet(id); [s.front[0],s.front[1],s.side[0],s.back[0],s.front[3]].forEach((f,c)=>{
  for(let y=0;y<ch;y++) for(let x=0;x<cw;x++){ const p=f.px[y*cw+x]; if(p) sheet[(r*ch+y)*cols*cw+c*cw+x]=p|0xff000000; } }); });
writePNG(out,sheet,cols*cw,ids.length*ch,4,4);
