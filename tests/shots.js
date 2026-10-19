const {load}=require('./harness'); const {writePNG}=require('./png');
const out=process.argv[2]||'/tmp/claude-0/shots'; require('fs').mkdirSync(out,{recursive:true});
const G=load(); let t=0;
G.begin('dean'); G.skipCutscene();
const shot=(name,sector,x,y,a,{preset='dusk',renderer='modern',torch=false,setup}={})=>{
  G.applyPreset(preset); G.setRenderer(renderer); G.enterSector(sector,x,y,a);
  G.S.torchOn=torch; G.S.battery=100; G.S.cut=null; G.S.dead=false;
  if(setup) setup();
  for(let i=0;i<4;i++){ t+=16; G.frame(t); }
  const m=G.MODE_(); writePNG(`${out}/${name}.png`,G.FB(),G.IW_(),G.IH_(),2,2*m.par);
};
shot('01_street_dusk','street',28.2,37.6,-Math.PI/2);
shot('02_street_night_torch','street',28.2,37.6,-Math.PI/2,{preset:'night',torch:true});
shot('03_motel_marla','motel',9.5,8.5,-Math.PI/2);
shot('04_pawn_earl','pawn',7.5,8.5,-Math.PI/2);
shot('05_mill','mill',14,17,-Math.PI/2,{setup:()=>G.wakeShades()});
shot('06_doom_street','street',26,30,-Math.PI/2-.5,{renderer:'doom'});
shot('07_car','street',29,36.4,Math.PI/2);
/* contact sheet of every character, all three views, idle + walk */
const ids=Object.keys(G.LOOKS), cw=32, ch=56, cols=6, W=cols*cw*1+0, rows=ids.length;
const sheet=new Uint32Array((cols*cw)*(rows*ch)).fill(0xff1a1612);
ids.forEach((id,r)=>{ const set=G.charSet(id); const frames=[set.front[0],set.front[1],set.side[0],set.side[2],set.back[0],set.front[3]];
  frames.forEach((f,c)=>{ for(let y=0;y<ch;y++) for(let x=0;x<cw;x++){ const p=f.px[y*cw+x]; if(p) sheet[(r*ch+y)*(cols*cw)+c*cw+x]=p|0xff000000; } }); });
writePNG(`${out}/08_characters.png`,sheet,cols*cw,rows*ch,3,3);
console.log('characters row order:',ids.join(', '));
