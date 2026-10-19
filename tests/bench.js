const {load}=require('./harness'); const G=load(); let t=0;
G.begin('dean'); G.skipCutscene();
console.log('renderer          ms/frame   (street, dusk, torch on, flare burning, 3 walkers)');
for(const r of G.RENDERERS){ if(r.key==='ascii') continue;
  G.setRenderer(r.key); G.applyPreset('dusk'); G.enterSector('street',28,34,-Math.PI/2); G.S.torchOn=true;
  G.SECTORS.street.entities.push({kind:'flarestuck',x:28,y:30,z:.1,r:.1,h:.2,m:'flareShot',lit:1,t:999});
  for(let i=0;i<20;i++){ t+=16; G.frame(t); }
  const t0=process.hrtime.bigint(); const N=150;
  for(let i=0;i<N;i++){ G.S.angle+=.02; t+=16; G.frame(t); }
  const ms=Number(process.hrtime.bigint()-t0)/1e6/N;
  console.log(`${r.label.padEnd(17)} ${ms.toFixed(2).padStart(6)}`);
}
