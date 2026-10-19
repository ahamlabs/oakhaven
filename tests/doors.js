/* Every door must drop you on open ground that is connected to the rest of its
   sector (flood fill from the sector's spawn), and facing away from the door. */
const {load}=require('./harness'); const G=load(); let bad=0;
function region(s,x0,y0){ const seen=new Uint8Array(s.W*s.H), q=[[x0|0,y0|0]];
  while(q.length){ const [x,y]=q.pop(); if(x<0||y<0||x>=s.W||y>=s.H) continue; const i=y*s.W+x;
    if(seen[i]||s.solid[i]) continue; seen[i]=1; q.push([x+1,y],[x-1,y],[x,y+1],[x,y-1]); } return seen; }
for(const [id,s] of Object.entries(G.SECTORS)){
  for(const [k,d] of Object.entries(s.doors)){
    const t=G.SECTORS[d.to], reg=region(t,t.spawn.x,t.spawn.y);
    const i=(d.y|0)*t.W+(d.x|0), ok=!t.solid[i]&&reg[i]&&!G.hits(t,d.x,d.y,.26);
    console.log((ok?'ok  ':'BAD ')+`${id} door ${k} -> ${d.to} (${d.x},${d.y})`+(ok?'':t.solid[i]?' lands in a wall':!reg[i]?' lands in a sealed pocket':' too close to a wall'));
    if(!ok) bad++;
  }
}
console.log(bad?bad+' bad doors':'all doors ok'); process.exit(bad?1:0);
