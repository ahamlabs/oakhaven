/* Export every game image as transparent PNG.
   node tools/export_assets.js [outDir]   (default: ./assets)
   Requires @napi-rs/canvas (npm i @napi-rs/canvas). */
const fs=require('fs'), path=require('path');
let canvasMod; for(const p of ['@napi-rs/canvas','/tmp/claude-0/nc/node_modules/@napi-rs/canvas']){ try{ canvasMod=require(p); break; }catch(e){} }
if(!canvasMod){ console.error('Install @napi-rs/canvas first: npm i @napi-rs/canvas'); process.exit(1); }
const {createCanvas}=canvasMod;
const {load}=require('../tests/harness');
const G=load(); const OUT=path.resolve(process.argv[2]||path.join(__dirname,'..','assets'));
const mk=d=>fs.mkdirSync(d,{recursive:true});
function toCanvas(sp,scale=1,mirror=false){
  const c=createCanvas(sp.w,sp.h), x=c.getContext('2d'), id=x.createImageData(sp.w,sp.h), o=new Uint32Array(id.data.buffer);
  for(let y=0;y<sp.h;y++) for(let i=0;i<sp.w;i++){ const p=sp.px[y*sp.w+(mirror?sp.w-1-i:i)]; o[y*sp.w+i]=p?((p&0xFFFFFF)|0xFF000000)>>>0:0; }
  x.putImageData(id,0,0); if(scale===1) return c;
  const s=createCanvas(sp.w*scale,sp.h*scale), sx=s.getContext('2d'); sx.imageSmoothingEnabled=false; sx.drawImage(c,0,0,s.width,s.height); return s;
}
const save=(c,f)=>{ mk(path.dirname(f)); fs.writeFileSync(f,c.toBuffer('image/png')); n++; };
let n=0; const manifest={characters:{},props:[],pickups:[],cars:[]};
const VIEWS=['front','side','back'], FRAMES=['idle','walk1','walk2','act','hurt'];
const NAMES={dean_leather:'Dean — leather jacket',dean_fbi:'Dean — FBI suit',dean_coveralls:'Dean — mechanic coveralls',dean_duster:'Dean — field trench',
 sam_canvas:'Sam — hooded jacket',sam_fbi:'Sam — FBI suit',sam_rain:'Sam — field raincoat',sam_tweed:'Sam — bunker tweed',
 kevin_field:'Kevin Tran',kevin:'Kevin Tran — captive',kevin_reading:'Kevin Tran — reading the tablet',castiel:'Castiel',castiel_black:'Castiel — black coat',
 crowley:'Crowley',chuck:'Chuck',sheriff:'Sheriff Ames',sarah:'Sarah Lindqvist',doctor:'Dr. Halvorsen',mechanic:'Hank Ruiz (mechanic)',old_man:'Old Gus (recluse)',
 ghost_girl:'The girl in the nightgown',ghost_girl_fade:'The girl in the nightgown — fading',marla:'Marla Ostrowski',earl:'Earl Duchesne',delia:'Delia Park',juno:'Juno',
 phantom:'Ray Hollis (phantom)',shade:'Shade',worker:'Mill worker',rainwoman:'Dolores',teen:'Tyler',logger:'Logger',nurse:'Night nurse'};
for(const id of Object.keys(G.LOOKS)){
  const set=G.charSet(id), dir=path.join(OUT,'characters',id);
  /* sprite sheet: rows = front, side, back; columns = idle, walk1, walk2, act, hurt */
  const sheet=createCanvas(32*5,56*3), sx=sheet.getContext('2d');
  VIEWS.forEach((v,r)=>set[v].forEach((f,c)=>{ sx.drawImage(toCanvas(f),c*32,r*56); save(toCanvas(f),path.join(dir,'frames',`${v}_${FRAMES[c]}.png`)); }));
  save(sheet,path.join(dir,`${id}_sheet_32x56.png`));
  const big=createCanvas(sheet.width*4,sheet.height*4), bx=big.getContext('2d'); bx.imageSmoothingEnabled=false; bx.drawImage(sheet,0,0,big.width,big.height);
  save(big,path.join(dir,`${id}_sheet_preview_x4.png`));
  ['steady','grim','hurt'].forEach((e,k)=>{ const b=G.bustOf(id,k); save(toCanvas(b),path.join(dir,'portraits',`${id}_portrait_${e}_64x80.png`)); save(toCanvas(b,4),path.join(dir,'portraits',`${id}_portrait_${e}_x4.png`)); });
  manifest.characters[id]={name:NAMES[id]||id,sheet:`characters/${id}/${id}_sheet_32x56.png`,frame:[32,56],rows:VIEWS,columns:FRAMES,
    left_view:'mirror the side row',portraits:['steady','grim','hurt'].map(e=>`characters/${id}/portraits/${id}_portrait_${e}_64x80.png`)};
}
for(const [k,v] of Object.entries(G.SPR)){ const list=Array.isArray(v)?v:[v]; list.forEach((sp,i)=>{ const f=`${k}${list.length>1?'_'+i:''}`;
  save(toCanvas(sp),path.join(OUT,'props',`${f}.png`)); save(toCanvas(sp,4),path.join(OUT,'props','x4',`${f}_x4.png`)); manifest.props.push(`props/${f}.png`); }); }
for(const [k,sp] of Object.entries(G.PICK_ART)){ save(toCanvas(sp),path.join(OUT,'pickups',`${k}.png`)); save(toCanvas(sp,4),path.join(OUT,'pickups','x4',`${k}_x4.png`)); manifest.pickups.push(`pickups/${k}.png`); }
for(const [k,views] of Object.entries(G.CARS)) for(const [v,sp] of Object.entries(views)){ save(toCanvas(sp),path.join(OUT,'vehicles',`${k}_${v}.png`)); save(toCanvas(sp,4),path.join(OUT,'vehicles','x4',`${k}_${v}_x4.png`)); manifest.cars.push(`vehicles/${k}_${v}.png`); }
fs.writeFileSync(path.join(OUT,'manifest.json'),JSON.stringify(manifest,null,2));
console.log(`exported ${n} images to ${OUT}`);
