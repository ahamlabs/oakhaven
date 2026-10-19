/* In-game shots of the reference-board cast: street walkers, HUD bust, case file, dialogue portrait, ghost girl. */
const {g,step,snap}=require('./realshots');
const {createCanvas}=require('/tmp/claude-0/nc/node_modules/@napi-rs/canvas');
const fs=require('fs'); const out=process.argv[2]||'/tmp/claude-0/shots';
const vm=require('vm');
const ent=(id)=>g.SECTORS.street.entities;
function look(px,py,tx,ty){ g.S.px=px; g.S.py=py; g.S.pa=Math.atan2(ty-py,tx-px); }
function freeze(){ for(const e of g.SECTORS.street.entities) if(e.kind==='walker'){ e.waitT=999; e.moving=false; } }
g.setRenderer('modern'); g.applyPreset('day'); g.begin('dean'); step(60); g.skipCutscene(); step(10);
const st=g.SECTORS.street.entities, by=n=>st.find(e=>e.name===n);
/* line the new townsfolk up in front of the camera */
const row=['Sheriff Ames','Sarah Lindqvist','Dr. Halvorsen','Hank Ruiz','Old Gus'];
row.forEach((n,i)=>{ const e=by(n); e.x=27.2+i*1.15; e.y=24.6; e.face=Math.PI/2; e.waitT=999; e.tx=undefined; });
freeze(); g.S.px=29.5; g.S.py=28.4; g.S.pa=-Math.PI/2; step(3); snap('c01_townsfolk_day');
/* case file with everyone met */
['marla','earl','phantom','met_sheriff','met_sarah','met_nurse'].forEach(f=>g.S.flags[f]=true);
g.S.caseOpen=true; step(2); snap('c02_case_file'); g.S.caseOpen=false;
/* dialogue panel with a painted bust (the panel is HTML, so compose it here) */
const ELS=g.document.getElementById.bind(g.document); ELS('dport').width=64; ELS('dport').height=80;
function dlgShot(name,lookId,expr,speaker,line){
  g.setPortrait(lookId,expr); step(1);
  const W=ELS('over')._cv(), WD=ELS('world')._cv();
  const c=createCanvas(W.width,W.height), x=c.getContext('2d'); x.imageSmoothingEnabled=false;
  x.drawImage(WD,0,0,W.width,W.height); x.drawImage(W,0,0);
  const gr=x.createLinearGradient(0,W.height-200,0,W.height); gr.addColorStop(0,'rgba(7,9,11,0)'); gr.addColorStop(.25,'rgba(7,9,11,.95)'); gr.addColorStop(1,'#07090b');
  x.fillStyle=gr; x.fillRect(0,W.height-200,W.width,200);
  x.fillStyle='#0b0f12'; x.fillRect(24,W.height-150,104,130); x.drawImage(ELS('dport')._cv(),24,W.height-150,104,130);
  x.strokeStyle='#2a343a'; x.strokeRect(24.5,W.height-149.5,103,129);
  x.font='10px DejaVu Sans Mono'; x.fillStyle='#d9a441'; x.fillText(speaker.toUpperCase().split('').join(' '),150,W.height-120);
  x.font='15px DejaVu Sans Mono'; x.fillStyle='#e8dcc4'; x.fillText(line,150,W.height-92);
  fs.writeFileSync(`${out}/${name}.png`,c.toBuffer('image/png'));
}
vm.runInContext('globalThis.setPortrait=setPortrait;globalThis.updateStory=updateStory;',g);
g.S.px=29.5; g.S.py=26.4; g.S.pa=-Math.PI/2; step(2);
dlgShot('c03_dialogue_sheriff','sheriff',0,'Sheriff Ames','Six men, and the coroner writes "natural causes" six times.');
dlgShot('c04_dialogue_crowley','crowley',1,'Crowley','Hello, boys. Lovely town. I own most of it.');
/* HUD bust when hurt */
g.S.hp=28; step(2); snap('c05_hud_hurt'); g.S.hp=100;
/* Act II: the girl in the nightgown, seen from across the street */
g.applyPreset('dusk'); g.S.act=2; g.S.girlT=0; g.S.girlN=0;
for(const e of st) if(e.kind==='walker') e.dead=true;
g.S.px=20; g.S.py=30; g.S.pa=-Math.PI/2; for(let i=0;i<3;i++){ g.updateStory(.5); }
const gg=st.find(e=>e.ghostGirl&&!e.dead); console.log('girl',gg&&[gg.x,gg.y]);
g.S.px=gg.x+2.2; g.S.py=gg.y+6.4; g.S.pa=Math.atan2(gg.y-g.S.py,gg.x-g.S.px); g.S.cardQ&&(g.S.cardQ.length=0); step(3); snap('c06_ghost_girl');
console.log('done');
