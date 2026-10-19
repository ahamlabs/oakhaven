/* A reference-board style sheet of the 12-character cast: name, role, three portrait expressions, sprite turnaround + walk. */
const {load}=require('./harness'); const fs=require('fs');
const {createCanvas}=require('/tmp/claude-0/nc/node_modules/@napi-rs/canvas');
const G=load();
const CAST=[['dean_leather','Dean','Hunter'],['sam_canvas','Sam','Researcher'],['kevin_field','Kevin','Prophet'],['castiel','Castiel','Angel'],
 ['crowley','Crowley','Demon'],['chuck','Chuck','Writer'],['sheriff','Sheriff Ames','Town law'],['sarah','Sarah','Librarian'],
 ['doctor','Dr. Halvorsen','Clinic'],['mechanic','Hank','Mechanic'],['old_man','Old Gus','Recluse'],['ghost_girl','Ghost girl','Spirit']];
const S=3, cardW=(64*3+6*2)*S/1.5|0;
function img(px,w,h){ const c=createCanvas(w,h), x=c.getContext('2d'), id=x.createImageData(w,h); const o=new Uint32Array(id.data.buffer);
  for(let i=0;i<px.length;i++) o[i]=px[i]?(px[i]|0xff000000)>>>0:0; x.putImageData(id,0,0); return c; }
const colW=470, rowH=330, cols=4, rows=3, W=cols*colW+40, H=rows*rowH+110;
const c=createCanvas(W,H), x=c.getContext('2d'); x.imageSmoothingEnabled=false;
x.fillStyle='#0e0c0b'; x.fillRect(0,0,W,H);
x.fillStyle='#d9a441'; x.font='bold 34px DejaVu Serif'; x.fillText('OAKHAVEN',24,52);
x.fillStyle='#8b95a0'; x.font='16px DejaVu Sans Mono'; x.fillText('In-game cast · 64×80 portraits (steady / grim / hurt) · 32×56 sprites (front, side, back, walk, act)',270,48);
CAST.forEach(([id,name,role],i)=>{
  const cx=20+(i%cols)*colW, cy=80+((i/cols)|0)*rowH;
  x.fillStyle='#16130f'; x.fillRect(cx,cy,colW-14,rowH-14); x.strokeStyle='#3a3026'; x.strokeRect(cx+.5,cy+.5,colW-15,rowH-15);
  x.fillStyle='#e8dcc4'; x.font='bold 18px DejaVu Sans Mono'; x.fillText(name.toUpperCase(),cx+12,cy+26);
  x.fillStyle='#d9a441'; x.font='13px DejaVu Sans Mono'; x.fillText(role,cx+12,cy+44);
  for(let e=0;e<3;e++){ const b=G.bustOf(id,e); const bx=cx+12+e*148, by=cy+54;
    x.fillStyle='#241e19'; x.fillRect(bx,by,140,175); x.drawImage(img(b.px,64,80),bx+6,by+5,128,160); }
  const s=G.charSet(id), fr=[s.front[0],s.side[0],s.back[0],s.front[1],s.side[1],s.front[3]];
  fr.forEach((f,k)=>x.drawImage(img(f.px,32,56),cx+14+k*72,cy+236,32*1.4,56*1.4));
});
fs.writeFileSync(process.argv[2],c.toBuffer('image/png')); console.log('ok');
