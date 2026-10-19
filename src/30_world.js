/* ═══ World ═══════════════════════════════════════════════════════════════ */
const WALL_TEX  = {'#':'brick','W':'wood','G':'glass','=':'steel','+':'door','T':'crt','S':'fog','K':'shelf','P':'paper','V':'velvet',
                   'F':'flesh','C':'chapel','X':'stainglass'};
const FLOOR_TEX = {'.':'asphalt', ',':'walk', ' ':'dirt', 'o':'boards', 'c':'conc', 'v':'veins', 'r':'carpet'};
const SOLID = "#WG=+TSKPVFCX";
const EMIT  = {'T':.9,'S':.42,'X':.5};

function Grid(w,h,f){ const r=[]; for(let y=0;y<h;y++) r.push(new Array(w).fill(f)); return r; }
function rect(g,x0,y0,x1,y1,c){ for(let y=y0;y<=y1;y++) for(let x=x0;x<=x1;x++) if(g[y]?.[x]!==undefined) g[y][x]=c; }
function box(g,x0,y0,x1,y1,c){ for(let x=x0;x<=x1;x++){g[y0][x]=c;g[y1][x]=c;} for(let y=y0;y<=y1;y++){g[y][x0]=c;g[y][x1]=c;} }

/* Counters are props, not walls: the raycaster stops at the first wall it
   meets, so a waist-high counter built from wall tiles hid whoever stood
   behind it. A row of overlapping counter sprites reads the same and lets
   the clerk be seen from anywhere in the room. */
function counter(y,x0,x1,skip=[]){ const out=[];
  for(let x=x0;x<=x1+.01;x+=1.1) if(!skip.some(([a,b])=>x>=a&&x<=b)) out.push({kind:'prop',m:'counter',x,y,r:.55,h:1.0});
  return out; }
const char_ = (look,x,y,o={}) => Object.assign({look,x,y,r:.3,h:1.85,face:Math.PI/2,animT:0},o);
const pick_ = (pick,x,y,o={}) => Object.assign({kind:'pickup',pick,x,y,r:.25,h:PICKUPS[pick].h},o);

function street(){
  const W=56,H=46,g=Grid(W,H,' ');
  box(g,0,0,W-1,H-1,'#');
  rect(g,25,1,30,H-2,'.'); rect(g,1,20,W-2,25,'.');
  rect(g,23,1,24,H-2,','); rect(g,31,1,32,H-2,',');
  rect(g,1,18,W-2,19,','); rect(g,1,26,W-2,27,',');
  box(g,6,6,20,16,'W'); rect(g,8,16,11,16,'G'); rect(g,15,16,18,16,'G'); g[16][13]='+';     // pawnshop
  box(g,6,30,19,40,'#'); rect(g,6,33,6,37,'G'); g[30][12]='+';                             // motel
  box(g,36,5,50,15,'#'); rect(g,36,8,36,12,'G'); g[15][40]='+';                             // the Velvet Hour
  box(g,2,2,6,6,'W'); g[6][4]='+';                                                         // the house on Bellweather
  box(g,36,31,51,42,'W'); rect(g,38,31,41,31,'G'); g[31][45]='+';                          // mill office
  rect(g,21,10,22,12,' '); g[11][21]='T';
  box(g,1,10,4,16,'#'); g[16][2]='+';                                                       // Oakhaven public library
  box(g,52,17,54,28,'C'); g[22][52]='+'; g[19][52]='X'; g[25][52]='X';                      // St. Brendan's, where the cross street stops
  return {id:'street', name:'Main Street', grid:g, outdoor:true, ambient:.55,
    spawn:{x:28.2,y:37.4,a:-Math.PI/2},
    doors:{'13,16':{to:'pawn',x:8,y:9.6,a:-Math.PI/2}, '12,30':{to:'motel',x:10,y:12,a:-Math.PI/2},
           '45,31':{to:'mill',x:14,y:19,a:-Math.PI/2},
           '40,15':{to:'lounge',x:8,y:9.6,a:-Math.PI/2,need:'marla',locked:'A neon sign over a locked door: THE VELVET HOUR. Somebody inside laughs, very quietly.'},
           '2,16':{to:'library',x:8,y:9.6,a:-Math.PI/2},
           '52,22':{to:'church',x:9,y:23.4,a:-Math.PI/2,need:'lily_done',locked:'St. Brendan’s. A handwritten card in the door: CONFESSIONS BY APPOINTMENT. The handwriting is very kind.'},
           '4,6':{to:'trap',x:9,y:13.4,a:-Math.PI/2,need:'delia_done',locked:'Boarded from the inside. Whatever is in there wants it that way.'}},
    lights:[{x:24,y:9,p:3.2,f:.10},{x:31.5,y:17,p:3.2,f:.10},{x:24,y:29,p:3.2,f:.10},{x:31.5,y:38,p:3.2,f:.10},
            {x:12.5,y:29.4,p:1.8,f:.22},{x:13.5,y:17.4,p:1.4,f:.24},{x:22,y:28.6,p:2.2,f:.26},
            {x:40.5,y:16.4,p:1.6,f:.26}],
    pois:[{x:12.5,y:30.5,name:'Motel office',kind:'door'},{x:13.5,y:16.5,name:"Earl's Pawn & Loan",kind:'door'},
          {x:45.5,y:31.5,name:'Mill office',kind:'door'},{x:29,y:40,name:'Impala',kind:'car'},
          {x:21.5,y:11.5,name:'Terminal',kind:'term'},{x:27.5,y:22.5,name:'Cross street',kind:'note'},
          {x:40.5,y:15.5,name:'The Velvet Hour',kind:'door'},{x:2.5,y:16.5,name:'Library',kind:'door'},
          {x:52.5,y:22.5,name:'St. Brendan’s',kind:'door'},{x:4.5,y:6.5,name:'House on Bellweather',kind:'door'}],
    entities:[
      {kind:'prop',m:'lamp',x:24,y:9,r:.3,h:3.6,emit:1},   {kind:'prop',m:'lamp',x:31.5,y:17,r:.3,h:3.6,emit:1},
      {kind:'prop',m:'lamp',x:24,y:29,r:.3,h:3.6,emit:1},  {kind:'prop',m:'lamp',x:31.5,y:38,r:.3,h:3.6,emit:1},
      {kind:'prop',m:'tree',x:3.5,y:8.3,r:.5,h:4.2},      {kind:'prop',m:'tree',x:3.5,y:34.5,r:.5,h:4.2},
      {kind:'prop',m:'cross',x:51.2,y:17.6,r:.2,h:2.2},     {kind:'prop',m:'tree',x:34.5,y:44,r:.5,h:4.2},
      {kind:'prop',m:'fire',x:22,y:29,r:.38,h:1.5,emit:.9},{kind:'prop',m:'barrel',x:33.6,y:28.4,r:.35,h:1.1},
      {kind:'vehicle',car:'sedan_black',name:'Impala',x:29,y:40,r:.75,h:1.45,face:-Math.PI/2,speed:0},
      {kind:'car',car:'sedan_rust',x:27,y:44,r:.75,h:1.45,speed:2.4,node:0,face:-Math.PI/2,
        route:[[27,44],[27,22.5],[6,22.5],[27,22.5],[27,44]]},
      char_('mechanic',23.5,35,{kind:'walker',speed:.7,name:'Hank Ruiz',talk:'worker'}),
      char_('rainwoman',32.5,12,{kind:'walker',speed:.55,name:'Dolores',talk:'rainwoman'}),
      char_('teen',15,26.5,{kind:'walker',speed:.8,name:'Tyler',talk:'teen'}),
      char_('old_man',10,19,{kind:'walker',speed:.4,name:'Old Gus',talk:'logger'}),
      char_('doctor',34,26.6,{kind:'walker',speed:.6,name:'Dr. Halvorsen',talk:'nurse'}),
      char_('sheriff',30.5,19.5,{kind:'walker',speed:.5,name:'Sheriff Ames',talk:'sheriff'}),
      pick_('cash',22.5,10.5), pick_('bandage',34.2,29.3), pick_('shells',34,43.2),
    ]};
}
function room(id,name,W,H,wall,amb,floor='o'){
  const g=Grid(W,H,floor); box(g,0,0,W-1,H-1,wall);
  return {id,name,grid:g,outdoor:false,ambient:amb,doors:{},lights:[],entities:[],pois:[]};
}
function motel(){
  const s=room('motel','Motel — front office',20,15,'P',.30); s.ceilH=1.5;
  s.grid[14][10]='+';
  s.doors['10,14']={to:'street',x:12.5,y:29.1,a:-Math.PI/2};   // the motel door is in its north wall
  s.spawn={x:10,y:12,a:-Math.PI/2};
  s.lights=[{x:9.5,y:3,p:2.6,f:.16},{x:10,y:12,p:1.6,f:.26}];
  s.pois=[{x:9.5,y:4,name:'Marla',kind:'npc'},{x:10.5,y:14.5,name:'Out to the street',kind:'door'}];
  s.entities=[...counter(6.5,4.5,15.5,[[8,11]]), char_('marla',9.5,4,{kind:'npc',dialogue:'marla',name:'Marla',h:1.75}),
    pick_('medkit',16.5,11.5), pick_('battery',3.5,12.5)];
  return s;
}
function pawn(){
  const s=room('pawn',"Earl's Pawn & Loan",16,12,'K',.26); s.ceilH=1.5;
  s.grid[11][8]='+'; s.grid[3][14]='T';
  s.doors['8,11']={to:'street',x:13.5,y:17.7,a:Math.PI/2};
  s.spawn={x:8,y:9.6,a:-Math.PI/2};
  s.lights=[{x:7.5,y:4,p:2.2,f:.18},{x:8,y:9.5,p:1.4,f:.26},{x:14,y:3,p:1.1,f:.4}];
  s.pois=[{x:7.5,y:4.5,name:'Earl',kind:'npc'},{x:14.5,y:3.5,name:'Terminal',kind:'term'},{x:8.5,y:11.5,name:'Out to the street',kind:'door'}];
  s.entities=[...counter(7.5,3.5,12.5,[[6.9,8.2]]), char_('earl',7.5,4.5,{kind:'npc',dialogue:'earl',name:'Earl',h:1.8}),
    {kind:'prop',m:'barrel',x:2.5,y:9.5,r:.35,h:1.1}, pick_('rounds',13.5,9.5)];
  return s;
}
function mill(){
  const s=room('mill','Oakhaven Mill & Timber',28,22,'=',.06,'c'); s.ceilH=2.6;
  const g=s.grid;
  for(const x of [6,12,18]){ rect(g,x,6,x+1,15,'='); rect(g,x,10,x+1,11,'c'); }
  g[21][14]='+'; g[6][24]='T';
  s.doors['14,21']={to:'street',x:45.5,y:29.9,a:-Math.PI/2};   // so is the mill office's
  s.spawn={x:14,y:19,a:-Math.PI/2};
  s.lights=[{x:24,y:7,p:2.6,f:.24,natural:true},{x:14,y:20,p:2.2,f:.16,natural:true},{x:9,y:8,p:1.8,f:.2,natural:true}];
  s.pois=[{x:15.5,y:8,name:'The green chain',kind:'npc'},{x:24.5,y:6.5,name:'Terminal',kind:'term'},
          {x:14.5,y:21.5,name:'Out to the street',kind:'door'}];
  const shade=(x,y)=>char_('shade',x,y,{kind:'enemy',etype:'ghost',hp:70,maxHp:70,speed:1.25,dmg:8,reach:.95,
    sense:9,trans:true,hover:true,state:'dormant',hidden:true,h:1.9});
  s.entities=[
    {kind:'prop',m:'barrel',x:22.5,y:17.5,r:.35,h:1.1},
    char_('phantom',15.5,8,{kind:'npc',dialogue:'phantom',name:'Something on the green chain',hover:true,trans:true,h:1.95}),
    shade(9.5,13), shade(21.5,9), shade(21.5,15),
    pick_('page',3.5,3.5), pick_('shells',25.5,18.5), pick_('medkit',2.5,18.5), pick_('holywater',9.5,3.5),
  ];
  return s;
}
/* The house on Bellweather: two rooms of mattresses, a back room with a boy
   in it, and two of the frightened ones keeping him reading. */
function trap(){
  const s=room('trap','The house on Bellweather',18,16,'W',.04); s.ceilH=1.35;
  const g=s.grid;
  rect(g,2,8,8,8,'W'); g[8][5]='o'; g[8][6]='o';
  rect(g,11,4,11,10,'W'); g[7][11]='o';
  g[15][9]='+';
  s.doors['9,15']={to:'street',x:4.5,y:7.6,a:Math.PI/2};
  s.spawn={x:9,y:13.4,a:-Math.PI/2};
  s.lights=[{x:4.5,y:4.6,p:1.7,f:.3},{x:9,y:13,p:1.1,f:.24},{x:14.5,y:3.5,p:1.0,f:.32}];
  s.pois=[{x:4.5,y:4.2,name:'Whoever is reading',kind:'npc'},{x:9.5,y:15.5,name:'Out to the street',kind:'door'}];
  const guard=(look,free,x,y)=>char_(look,x,y,{kind:'enemy',etype:'demon',hp:80,maxHp:80,speed:1.45,dmg:10,reach:.95,
    sense:7,state:'idle',freeLook:free,claws:true,guard:true});
  s.entities=[
    char_('kevin_reading',4.5,4.2,{kind:'npc',dialogue:'kevin',name:'Kevin Tran',face:Math.PI/2,h:1.7,pose:4}),
    {kind:'prop',m:'tablet',x:5.3,y:4.9,r:.15,h:.3,lit:1},
    {kind:'prop',m:'mattress',x:14.5,y:12.5,r:.6,h:.45}, {kind:'prop',m:'mattress',x:2.8,y:11.5,r:.6,h:.45},
    {kind:'prop',m:'mattress',x:14,y:2.6,r:.6,h:.45},
    guard('possessed_logger','logger',14,6), guard('possessed_worker','worker',6.5,11),
    pick_('medkit',15.6,13.6), pick_('holywater',1.8,13.6),
  ];
  return s;
}
/* The Velvet Hour: where the town goes to stop feeling. */
function lounge(){
  const s=room('lounge','The Velvet Hour',16,12,'V',.12); s.ceilH=1.5;
  const g=s.grid;
  g[11][8]='+';
  s.doors['8,11']={to:'street',x:40.5,y:16.7,a:Math.PI/2};
  s.spawn={x:8,y:9.6,a:-Math.PI/2};
  s.lights=[{x:7.5,y:3,p:2.0,f:.26},{x:3,y:8,p:1.0,f:.34},{x:13,y:8,p:1.0,f:.34}];
  s.pois=[{x:7.5,y:3,name:'Juno',kind:'npc'},{x:8.5,y:11.5,name:'Out to the street',kind:'door'}];
  s.entities=[
    ...counter(4.6,3.5,12.5), char_('juno',7.5,3,{kind:'npc',dialogue:'juno',name:'Juno',face:Math.PI/2,h:1.9}),
    char_('worker',2.6,7.4,{kind:'npc',name:'A regular',talkOnly:'regular',face:0}),
    char_('rainwoman',13.4,8.4,{kind:'npc',name:'A regular',talkOnly:'regular2',face:Math.PI}),
    {kind:'prop',m:'jukebox',x:14.4,y:2,r:.4,h:1.2,lit:.9},
  ];
  return s;
}
/* The library: Sarah Lindqvist and forty years of company ledgers nobody reads. */
function library(){
  const s=room('library','Oakhaven Public Library',16,12,'K',.22); s.ceilH=1.6;
  const g=s.grid; rect(g,3,3,4,7,'K'); rect(g,11,3,12,7,'K');
  g[11][8]='+';
  s.doors['8,11']={to:'street',x:2.5,y:17.6,a:Math.PI/2};
  s.spawn={x:8,y:9.6,a:-Math.PI/2};
  s.lights=[{x:7.5,y:3,p:1.9,f:.2},{x:8,y:9,p:1.2,f:.26},{x:13.5,y:9.5,p:.9,f:.4}];
  s.pois=[{x:7.5,y:3.5,name:'Sarah',kind:'npc'},{x:8.5,y:11.5,name:'Out to the street',kind:'door'}];
  s.entities=[char_('sarah',7.5,3.4,{kind:'npc',dialogue:'sarah',name:'Sarah Lindqvist',h:1.8}),
    ...counter(5.2,6.2,9.6),
    {kind:'prop',m:'drawings',x:13.6,y:9.4,r:.3,h:.5,read:'ledgers',readName:'Read the company ledgers'},
    pick_('bandage',1.6,9.6)];
  return s;
}
/* The Hollis house: a hall, a coat on a hook, and a small bedroom. */
function hollis(){
  const s=room('hollis','The Hollis house',14,12,'P',.05); s.ceilH=1.4;
  const g=s.grid; rect(g,7,1,7,10,'P'); g[6][7]='o'; g[5][7]='o';
  g[11][3]='+';
  s.doors['3,11']={to:'street',x:13.5,y:17.7,a:Math.PI/2};
  s.spawn={x:3,y:9.6,a:-Math.PI/2};
  s.lights=[{x:3,y:3,p:.7,f:.5},{x:10.5,y:4,p:.8,f:.45}];
  s.pois=[{x:3.5,y:11.5,name:'Out',kind:'door'}];
  s.entities=[
    {kind:'prop',m:'coat',x:1.45,y:3.2,r:.25,h:1.2,z:.35,read:'coat',readName:'The coat on the hook'},
    {kind:'prop',m:'paper',x:4.6,y:2.2,r:.2,h:.35,z:.55,read:'certificate',readName:'A certificate on the table'},
    {kind:'prop',m:'counter',x:4.6,y:2.0,r:.5,h:.9},
    {kind:'prop',m:'bed',x:10.4,y:8.6,r:.7,h:.55},
    {kind:'prop',m:'drawings',x:12.6,y:2,r:.2,h:.6,z:.6,read:'drawings',readName:'Drawings taped to the wall'},
    {kind:'prop',m:'inhaler',x:12.4,y:6.2,r:.15,h:.22,z:.4,read:'inhaler',readName:'Something on the nightstand'},
    char_('ghost_girl',12.4,10.3,{kind:'npc',name:'',lily:true,h:1.45,face:0,lit:.55}),
  ];
  return s;
}
/* St. Brendan's: the only warm room left. Hundreds of candles. */
function church(){
  const s=room('church','St. Brendan’s',18,26,'C',.18); s.ceilH=2.4;
  const g=s.grid; rect(g,8,2,9,24,'r');
  for(const y of [6,12,18]){ g[y][0]='X'; g[y][17]='X'; }
  g[25][9]='+';
  s.doors['9,25']={to:'street',x:50.6,y:22.5,a:Math.PI};
  s.spawn={x:9,y:23.4,a:-Math.PI/2};
  s.lights=[{x:9,y:3.5,p:2.4,f:.16},{x:4,y:4,p:1.3,f:.3},{x:14,y:4,p:1.3,f:.3},{x:9,y:14,p:1.2,f:.2},{x:9,y:22,p:1,f:.3}];
  s.pois=[{x:9,y:5,name:'Father Alistair',kind:'npc'},{x:9.5,y:25.5,name:'Out to the street',kind:'door'}];
  const pews=[]; for(const y of [8,10.5,13,15.5,18,20.5]){ pews.push({kind:'prop',m:'pew',x:4.6,y,r:.55,h:.75},{kind:'prop',m:'pew',x:13.4,y,r:.55,h:.75}); }
  s.entities=[...pews,
    {kind:'prop',m:'altar',x:9,y:2.6,r:.9,h:.95},{kind:'prop',m:'cross',x:9,y:1.3,r:.2,h:1.7,z:.5},
    ...[3,5,13,15].map(x=>({kind:'prop',m:'candle',x,y:3.2,r:.1,h:.45,emit:.8,lit:1})),
    ...[2,16].map(x=>({kind:'prop',m:'candle',x,y:12,r:.1,h:.45,emit:.8,lit:1})),
    char_('alistair',9,5,{kind:'npc',dialogue:'alistair',name:'Father Alistair',h:1.78}),
    pick_('holywater',1.6,23.4), pick_('medkit',16.4,23.4)];
  return s;
}
/* The cathedral: St. Brendan's after the Void moved in. Breathing walls, a
   hall where the floor is the ceiling, a corridor that folds back to the door,
   a nave, and the altar where somebody is waiting with popcorn. */
function cathedral(){
  const W=26,H=34, g=Grid(W,H,'F');
  const open=(x0,y0,x1,y1,c='v')=>rect(g,x0,y0,x1,y1,c);
  open(11,28,14,32); open(3,28,10,29); open(3,9,4,29);            // entrance, west corridor
  open(13,22,14,27); open(15,22,22,23); open(21,13,22,23); open(15,13,20,14);   // the eastern fold
  open(5,15,6,16); open(7,9,18,20); open(12,9,13,20,'r');          // into the nave, carpet
  open(8,2,17,7); open(12,8,13,8);                                 // altar room and its gate
  g[8][12]='F'; g[8][13]='F';                                      // shut until the priest is dealt with
  for(const [x,y] of [[6,10],[6,13],[19,10],[19,13],[19,17],[6,18]]) g[y][x]='X';
  g[33][12]='+';
  const s={id:'cathedral',name:'St. Brendan’s — inside the Void',grid:g,outdoor:false,ambient:.05,ceilH:2.2,breathe:true,ceilTex:'flesh',
    doors:{'12,33':{to:'street',x:50.6,y:22.5,a:Math.PI}}, spawn:{x:12.5,y:31.6,a:-Math.PI/2},
    flipZone:[3,12,4,22], foldZone:[15,13,17,14],
    lights:[{x:12.5,y:30,p:1,f:.4},{x:12.5,y:4,p:2.2,f:.2},{x:12.5,y:12,p:1.4,f:.25},{x:9,y:18,p:.8,f:.4},{x:16,y:18,p:.8,f:.4},
            {x:3.5,y:10,p:.6,f:.5},{x:21.5,y:20,p:.5,f:.5}],
    pois:[{x:12.5,y:33.5,name:'The way out',kind:'door'}],
    entities:[]};
  const tendril=(x,y)=>({kind:'enemy',etype:'eldritch',m:'tendril',x,y,r:.35,h:2.4,hp:55,maxHp:55,speed:0,dmg:12,reach:1.7,
    sense:6,state:'idle',stationary:true});
  s.entities=[tendril(3.5,24.5),tendril(4.5,19.5),tendril(3.5,14),tendril(8,10),tendril(17,10),tendril(8,19.5),tendril(17,19.5),
    tendril(21.5,18),tendril(18,14.5),
    ...[[9,9.6],[16,9.6],[9,3.2],[16,3.2]].map(([x,y])=>({kind:'prop',m:'candle',x,y,r:.1,h:.45,emit:.7,lit:1,flipped:1})),
    ...[11,13.5,16].map(y=>[{kind:'prop',m:'pew',x:9.6,y,r:.55,h:.75},{kind:'prop',m:'pew',x:15.4,y,r:.55,h:.75}]).flat(),
    {kind:'prop',m:'altar',x:12.5,y:2.8,r:.9,h:.95},
    pick_('medkit',4.5,28.5), pick_('flares',21.5,22.5), pick_('holywater',3.5,9.6), pick_('shells',22,13.5)];
  return s;
}
const SECTORS={}; [street(),motel(),pawn(),mill(),trap(),lounge(),library(),hollis(),church(),cathedral()].forEach(s=>SECTORS[s.id]=s);

/* A few pickups land somewhere different every run, so the map rewards
   looking around rather than memorising. */
function scatter(sec, table, n, seed){
  const R=mulberry(seed), open=[];
  for(let y=1;y<sec.grid.length-1;y++) for(let x=1;x<sec.grid[0].length-1;x++){
    if(SOLID.includes(sec.grid[y][x])) continue;
    let nearWall=false;
    for(let dy=-1;dy<=1;dy++) for(let dx=-1;dx<=1;dx++) if(SOLID.includes(sec.grid[y+dy][x+dx])) nearWall=true;
    if(nearWall) continue;
    const px=x+.5, py=y+.5;
    if(Math.hypot(px-sec.spawn.x,py-sec.spawn.y)<3) continue;
    if(sec.entities.some(e=>Math.hypot(e.x-px,e.y-py)<1.6)) continue;
    open.push([px,py]);
  }
  for(let i=0;i<n&&open.length;i++){
    const k=(R()*open.length)|0, [x,y]=open.splice(k,1)[0];
    sec.entities.push(pick_(table[(R()*table.length)|0],x,y));
  }
}
const RUN_SEED = (Date.now()/1000)|0;
scatter(SECTORS.street, ['cash','cash','shells','rounds','bandage','cash'], 4, RUN_SEED);
scatter(SECTORS.mill,   ['cash','rounds','bandage','holywater'],             2, RUN_SEED+7);

/* ── packing + lightmaps ────────────────────────────────────────────────── */
/* Heights are in person-heights: a townsperson is 1.0 tall. Outdoors each
   material has its own storey count; indoors every wall meets the sector's
   ceiling. Doors and shop windows are one storey of their own texture with
   the neighbouring wall's material carried up above them. */
const WALL_H = {'#':3.1,'W':2.3,'G':2.3,'=':2.8,'+':2.3,'T':1.6,'S':6,'K':2.3,'P':2.3,'F':3.4,'C':4.2,'X':4.2};
const UPPER  = {brick:'brickwin', wood:'woodwin'};
const UPPER_IN = {paper:'paperup'};
function pack(s){
  s.H=s.grid.length; s.W=s.grid[0].length;
  const n=s.W*s.H;
  s.solid=new Uint8Array(n); s.cell=new Array(n); s.floor=new Array(n);
  s.wh=new Float32Array(n); s.above=new Array(n); s.upper=new Array(n);
  for(let y=0;y<s.H;y++) for(let x=0;x<s.W;x++){
    const c=s.grid[y][x], i=y*s.W+x;
    s.solid[i]=SOLID.includes(c)?1:0;
    s.cell[i]=WALL_TEX[c]||'brick';
    s.floor[i]=FLOOR_TEX[c]||(s.outdoor?'dirt':(s.id==='mill'?'conc':'boards'));
  }
  for(let y=0;y<s.H;y++) for(let x=0;x<s.W;x++){
    const c=s.grid[y][x], i=y*s.W+x; if(!s.solid[i]) continue;
    if(!s.outdoor){ s.wh[i]=s.ceilH||1.45; s.upper[i]=UPPER_IN[s.cell[i]]||null; continue; }
    let h=WALL_H[c]||2.3, mat=s.cell[i];
    if(c==='+'||c==='G'){
      /* borrow height and material from the building this opening sits in */
      for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){
        const nc=s.grid[y+dy]?.[x+dx];
        if(nc&&'#W='.includes(nc)){ h=WALL_H[nc]; mat=WALL_TEX[nc]; break; } }
      s.above[i]=mat;
    }
    s.wh[i]=h; s.upper[i]=UPPER[s.above[i]||s.cell[i]]||null;
  }
  bake(s);
}
function los(s,ax,ay,bx,by){
  const dx=bx-ax,dy=by-ay,n=Math.ceil(Math.hypot(dx,dy)*2.2);
  for(let k=1;k<n;k++){ const t=k/n, cx=(ax+dx*t)|0, cy=(ay+dy*t)|0;
    if(cx<0||cy<0||cx>=s.W||cy>=s.H||s.solid[cy*s.W+cx]) return false; }
  return true;
}
/* Static light, baked per cell with a line-of-sight test so it pools under a
   streetlight and stops at the wall. Lights marked natural are skylight and
   scale with the time of day; the rest are bulbs and fires. */
function bake(s){
  s.lm=new Float32Array(s.W*s.H).fill(s.ambient);
  for(const L of s.lights){
    if(L.off) continue;
    const pw=L.p*(L.natural?Math.min(1.4,s._presetAmb??1):1);
    const reach=Math.sqrt(L.p/.02/Math.max(L.f,.01))+2;
    for(let y=Math.max(0,(L.y-reach)|0);y<=Math.min(s.H-1,(L.y+reach)|0);y++)
    for(let x=Math.max(0,(L.x-reach)|0);x<=Math.min(s.W-1,(L.x+reach)|0);x++){
      const i=y*s.W+x; if(s.solid[i]) continue;
      const v=pw/(1+((x+.5-L.x)**2+(y+.5-L.y)**2)*L.f);
      if(v<.012||!los(s,L.x,L.y,x+.5,y+.5)) continue;
      s.lm[i]+=v;
    }
  }
}
function lightAt(s,x,y){ const cx=x|0,cy=y|0; return (cx<0||cy<0||cx>=s.W||cy>=s.H)?s.ambient:s.lm[cy*s.W+cx]; }

/* Time of day. The sky is a full panorama per preset — gradient, clouds that
   wrap the horizon, stars and a moon at night — so turning your head reveals
   different sky rather than the same stripe. */
const LIGHTING = {
  day:  {name:'Day',  amb:1.05, indoor:.85, exp:1, rain:.25, storm:0,
         sky:{top:[92,116,140], bot:[176,188,196], cloud:[222,226,230], clouds:1.0, stars:false, moon:false}},
  dusk: {name:'Dusk', amb:.62,  indoor:.56, exp:1, rain:.6, storm:.35,
         sky:{top:[30,34,58], bot:[168,98,74], cloud:[98,78,90], clouds:1.1, stars:false, moon:false}},
  night:{name:'Night',amb:.32,  indoor:.18, exp:1, rain:1, storm:1,
         sky:{top:[6,8,16], bot:[30,38,54], cloud:[42,46,58], clouds:.9, stars:true, moon:true}},
};
Object.values(SECTORS).forEach(s=>{ s.ambBase=s.ambient; });
Object.values(SECTORS).forEach(pack);
