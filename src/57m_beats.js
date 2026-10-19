/* ═══ New main-story beats ══════════════════════════════════════════════════
   · Act I–II: a man in a bathrobe, seen from a distance, twice.
   · Act II: the vigil on the cross street, where the town says the names.
   · Act IV: the gathering at the doors of St. Brendan's. Everyone you
     helped, and who trusts you, comes to see you in. */

const morale=n=>{ const I=inv_(); I.morale=(I.morale||0)+n; };
const moraleOf=()=>inv_().morale||0;

/* ── the man in the bathrobe ──────────────────────────────────────────── */
const CAMEO=[
  {id:'c1',act:1,sec:'street',x:13.2,y:28.6,face:-Math.PI/2,when:F=>F.marla&&!F.phantom,note:null},
  {id:'c2',act:2,sec:'street',x:23.2,y:33.4,face:0,when:F=>F.delia_done,note:'Stuck to the payphone with gum, a Post-it in green ink: “Love the pilot!! — C.”'},
];
INV_UPDATES.push(()=>{ const F=S.flags;
  for(const c of CAMEO){ if(F['cameo_'+c.id]||S.act!==c.act||S.sector.id!==c.sec||!c.when(F)) continue;
    let e=S.sector.entities.find(x=>x.cameo===c.id);
    if(!e){ e=char_('chuck',c.x,c.y,{kind:'actor',h:1.8,face:c.face,cameo:c.id,lit:.5}); S.sector.entities.push(e); }
    const d=Math.hypot(e.x-S.px,e.y-S.py);
    if(d<8||(d<16&&lookedAt(e,.995)&&S.time-(e.seenT||(e.seenT=S.time))>1.6)){ F['cameo_'+c.id]=true; e.dead=true;
      S.glitchA=.35; sfx('whisper');
      if(c.note){ const pp=SECTORS.street.entities.find(x=>x.payphone); if(pp){ pp.useName='The payphone (a note)'; F.cameo_note=true; } }
      later(.8,()=>say(brother(),c.act===1?(isDean()?'Dean. Guy by the motel sign. Bathrobe. He waved at us.':'Sam. Guy in a bathrobe by the sign. He waved.'):(isDean()?'That’s the bathrobe guy again. By the payphone.':'The bathrobe guy. Payphone. Gone.'),3.4)); } } });
{ const was=USES.payphone; USES.payphone=e=>{ if(S.flags.cameo_note&&!S.flags.read_cameo_note){ S.flags.read_cameo_note=true; if(e) e.useName='The payphone'; openMenu('The payphone','Stuck to the payphone with gum, a Post-it in green ink:\n\n“Love the pilot!! Can’t wait to see what you do with the finale. — C.”\n\nThe ink is still wet.',[{text:'Step back'}]); return; } was(e); }; }

/* ── the vigil ────────────────────────────────────────────────────────── */
function vigilCast(){ const F=S.flags, L=[];
  L.push(['marla','marla','Marla']); if(F.sarah_met) L.push(['sarah','sarah','Sarah']);
  L.push(['sheriff','sheriff','Sheriff Ames'],['doctor','doctor','Dr. Halvorsen'],['old_man','town','Old Gus'],['teen','town','Tyler'],['rainwoman','town','Dolores']);
  if(F.delia_done&&!F.delia_killed) L.push(['delia','delia','Delia']); if(F.kevin_rested) L.push(['kevin','kevin','Kevin']);
  if(F.w_mara) L.push(['mara','mara','Mara']); if(F.w_leon) L.push(['leon','leon','Leon']);
  return L; }
CUTSCENES.vigil=function(){
  const st=SECTORS.street, F=S.flags, cast=vigilCast(), ents=[];
  const cx=28, cy=24.2;
  return { dur:34, letterbox:true,
    setup(){ if(S.sector!==st) enterSector('street',cx,cy+4,-Math.PI/2);
      cast.forEach(([look],i)=>{ const a=Math.PI*(.15+.7*(i/Math.max(1,cast.length-1))), r=2.4+(i%2)*.7;
        const e=char_(look,cx+Math.cos(a+Math.PI)*r,cy+Math.sin(a+Math.PI)*r*.8,{kind:'actor',h:look==='kevin'?1.72:1.8,face:Math.atan2(cy-(cy+Math.sin(a+Math.PI)*r*.8),cx-(cx+Math.cos(a+Math.PI)*r)),lit:.7,vigil:true}); ents.push(e); st.entities.push(e); });
      for(let i=0;i<7;i++){ const a=i/7*Math.PI*2; st.entities.push({kind:'prop',m:'candle',x:cx+Math.cos(a)*.9,y:cy+Math.sin(a)*.6,r:.05,h:.4,emit:.8,lit:1,vigil:true}); }
      st.lights.push({x:cx,y:cy,p:2.2,f:.18,vigil:true}); pack(st);
      if(COMP){ COMP.x=cx+1.2; COMP.y=cy+1.4; COMP.face=Math.atan2(cy-COMP.y,cx-COMP.x); COMP.waitT=40; }
      for(const w of st.entities) if(w.kind==='walker'&&Math.hypot(w.x-cx,w.y-cy-4)<5){ w.x=cx-6; w.y=cy+(Math.random()*4-2); } },
    cam:[{t:0,x:cx,y:cy+5.6,a:-Math.PI/2,z:0},{t:10,x:cx-.6,y:cy+4.4,a:-Math.PI/2-.12,z:-.02},{t:22,x:cx+.6,y:cy+4.2,a:-Math.PI/2+.12,z:0},{t:34,x:cx,y:cy+3.6,a:-Math.PI/2,z:0}],
    subs:[{t:.6,who:'narr',text:'Somebody started it, and then everybody came: candles in jam jars on the cross street, in the fog, at twenty to three.'},
      {t:5.2,who:F.sarah_met?'sarah':'marla',text:'Ray Hollis. Lyle Brandt. Emeka Okafor. Tunde Okafor. Pete Lindqvist. Mo Haddad.'},
      {t:10.6,who:'marla',text:'I sign them in every night. I figured somebody should say them out loud, once, where they can hear.'},
      {t:15.2,who:'sheriff',text:F.ames_told?'Something wants this town quiet. Flat. Not hurting, not anything. So don’t give it quiet. That’s all I’ve got. Don’t give it quiet.':'Keep your lights on. That’s all I can tell you. Keep your lights on and check on your neighbours.'},
      {t:21,who:'doctor',text:'I signed four of their certificates. I’d like to say, in front of all of you, that I wrote the wrong thing on every one.'},
      {t:26,who:'town',text:'…Agents? You were at the mill. Do you want to say something?',name:'Old Gus'},
      {t:30.4,who:'narr',text:'Every face in the circle turns to you. The candles lean in the fog like they’re listening.'}],
    events:[{t:24,fn:()=>sfx('whisper')},{t:30,fn:()=>sfx('bell')}],
    end(){ S.flags.vigil_done=true; addNoteRaw('vigil','The vigil','The town held a vigil on the cross street. Sarah read the six names. Marla signs them in every night. Halvorsen said, in front of everyone, that he wrote the wrong thing on four certificates.');
      openMenu('The vigil','Thirty candles in the fog, and everyone waiting.',[
        {text:'[Say the six names again, slower.]',note:'so they’re heard',act:()=>vigilEnd('names')},
        {text:'“Ray asked for the fan seven times. In May he wrote that his daughter had a cough.”',note:'the truth, out loud',act:()=>vigilEnd('truth'),truth:true},
        {text:isDean()?'“Keep moving. Keep the lights on. Don’t let it make you quiet. That’s the whole trick.”':'“Check on each other. Every night. Don’t let anyone sit alone with it.”',act:()=>vigilEnd('charge')},
        {text:'[Say nothing. Hold a candle with them.]',act:()=>vigilEnd('silent')}].filter(o=>!o.truth||S.flags.read_ledgers||S.flags.read_ledger14)); } };
};
function vigilEnd(k){ const F=S.flags; F.vigil=k; morale(k==='silent'?1:2);
  const st=SECTORS.street; st.entities=st.entities.filter(e=>!e.vigil); if(COMP){ COMP.x=S.px-S.dirX*1.4+S.dirY*1.1; COMP.y=S.py-S.dirY*1.4-S.dirX*1.1; COMP.waitT=0; } st.lights=st.lights.filter(l=>!l.vigil); pack(st);
  const L={names:[['narr','You say them again, slowly. Somebody at the back says each one after you, like a response in church. By Mo Haddad half the street is saying it.']],
    truth:[['narr','You say it. Nobody says anything for a long time. Then somebody at the back says, loudly, “Seven times,” and somebody else says it, and it goes round the circle like a match.'],['marla','Seven times. And they stamped it.']],
    charge:[['narr','It’s not much of a speech. It’s the right length. A couple of people laugh, which is the best thing that’s happened on this street in a month.'],['town','Lights on, then.','Tyler']],
    silent:[['narr','You take a jam jar and stand in the circle. Nobody asks you to speak again. After a while Dolores takes your free hand without looking at you, and holds it until the candles gutter.']]}[k];
  L.forEach(([w,t,n],i)=>say(w,t,null,{now:i===0,name:n}));
  if(k==='truth') trust('sheriff',1); if(k==='names') trust('marla',1); if(k==='charge') arc(isDean()?'dl':'sa',0);
}
INV_UPDATES.push(()=>{ const F=S.flags; if(F.vigil_done||S.act!==2||!F.kevin_checked||!F.delia_done||F.crowley_done||S.cut||dlg.open||S.menu) return;
  if(S.sector.id!=='street'||S.driving) return; if(SECTORS.street.entities.some(e=>e.kind==='enemy'&&!e.dead&&e.state==='hunt')) return;
  if(!F.vigil_nudge){ F.vigil_nudge=S.time; msg('marla','come to the cross street. people are bringing candles. sarah is going to read the names'); return; }
  if(S.time-F.vigil_nudge>20&&Math.hypot(S.px-28,S.py-24)<10) playCutscene('vigil'); });
{ const was=epilogue; epilogue=function(k){ const E=was(k); if(k==='D') return E; const F=S.flags;
    if(F.vigil==='truth') E.lines.push('Every October, on the cross street, at twenty to three, somebody says “seven times” out loud. It started at the vigil. Nobody remembers who said it first.');
    else if(F.vigil==='names') E.lines.push('The town still says the six names on the anniversary. Somebody always says a seventh, quietly, at the end.');
    else if(F.vigil==='charge') E.lines.push('Somebody painted LIGHTS ON on the water tower. The county keeps painting over it. Somebody keeps painting it back.');
    return E; }; }

/* ── the gathering at the doors ────────────────────────────────────────── */
function gatherers(){ const F=S.flags, G=[], T=trustOf, d=k=>caseDecision(k);
  const add=(look,who,name,line,fx)=>G.push({look,who,name,line,fx});
  if(T('marla')>=2||F.beat_marla2) add('marla','marla','Marla','I brought the ledger. Every name in Oakhaven is in it, and yours. Go on. I’ll keep signing them in.');
  if(F.sarah_crew||F.oil_map) add('sarah','sarah','Sarah',F.read_aloud?'You read one out loud for me. My turn. Pete Lindqvist. Go and finish it.':'I brought the map. And the library card. Pete’s. For luck.');
  if(F.got_sheriff||F.ames_told) add('sheriff','sheriff','Sheriff Ames','Street’s mine. First time in a year I mean it.',()=>{ S.ammo.shells+=4; });
  if(F.got_doctor||F.halvorsen_trusted) add('doctor','doctor','Dr. Halvorsen','Hold still.',()=>heal(30));
  if(T('earl')>=1) add('earl','earl','Earl','On account. Don’t tell anybody.',()=>{ S.ammo.rounds+=12; });
  if(F.delia_done&&!F.delia_killed) add('delia','delia','Delia',F.delia_insight?'Keep the light on it. It goes still when it’s looked at. Like a kid who thinks you can’t see them.':'I’m holding the door. I’ve held worse.');
  if(F.kevin_rig&&!F.kevin_used) add('kevin_field','kevin','Kevin','The rig’s in the van. If you need root, call. I’ll be awake. I’ll be extremely awake.');
  if(d('shift')==='expose'||d('shift')==='rest') add('mara','mara','Mara','Line three’s here. All of us that are left.');
  if(F.elise_returned) add('elise','elise','Elise','You’re going to say “okay.” You’re going to be okay. I don’t know how I know.');
  if(F.agnes_told_truth) add('agnes','agnes','Agnes Bell','Thomas Avery. I wanted somebody to hear me say his name before you go in.');
  if(F.reed_accepted) add('glenn','glenn','Glenn Reed','Knock twice, for luck. Mia says that’s how you know it’s really you.');
  if(F.contract_broken||F.contract_traded) add('naomi','naomi','Naomi Price','I remember my mother’s voice. She’d have told you to be careful, and then she’d have told you to go.');
  if(F.rd_saved) add('old_man','town','Old Gus','Twenty-three past. Still here. Out of spite.');
  if(F.saint_revealed) add('curtis','curtis','Curtis Kemp','It wasn’t enough. This might be.');
  if(F.juno_spared) add('juno','juno','Juno','I said I’d like to see how it ends. I find I’d like it to end well. That’s new.');
  if(F.halv_juno&&F.juno_freed) add('doctor','doctor','Dr. Halvorsen','Eleven of my flat patients cried tonight. All of them. I came to tell you.');
  return G; }
CUTSCENES.gather=function(){
  const st=SECTORS.street, G=gatherers(), shown=G.slice(0,9), ents=[];
  const dur=Math.max(12,6+shown.length*3.6);
  return { dur, letterbox:true,
    setup(){ if(S.sector!==st) enterSector('street',47,22.5,0);
      shown.forEach((g,i)=>{ const x=46+((i%3)*1.4), y=19.6+Math.floor(i/3)*2.2+((i%2)*.4);
        const e=char_(g.look,x,y,{kind:'actor',h:1.78,face:0,lit:.7,gather:true}); ents.push(e); st.entities.push(e); });
      if(COMP){ COMP.x=49.6; COMP.y=23.6; COMP.face=0; COMP.waitT=40; } },
    cam:[{t:0,x:43.2,y:22.5,a:0,z:0},{t:dur*.5,x:43.8,y:22.2,a:-.08,z:-.02},{t:dur,x:48.8,y:22.5,a:0,z:0}],
    subs:[{t:.4,who:'narr',text:G.length?'You aren’t alone at the doors. Word got round the way it does in small towns, in the dark, without anybody calling anybody.':'Nobody came. You hadn’t really expected anyone to. The doors of St. Brendan’s breathe in and out in front of you.'},
      ...shown.map((g,i)=>({t:4.2+i*3.6,who:g.who,text:g.line,name:g.name})),
      ...(G.length>shown.length?[{t:4.2+shown.length*3.6,who:'narr',text:`And ${G.length-shown.length} more, further back, who don’t say anything. They just came.`}]:[])],
    events:shown.map((g,i)=>({t:4.4+i*3.6,fn:()=>{ if(g.fx) try{ g.fx(); }catch(e){} }})),
    end(){ for(const g of G.slice(shown.length)) if(g.fx) try{ g.fx(); }catch(e){}
      for(const e of st.entities) if(e.gather){ e.face=0; e.lit=.6; } S.flags.gathered=G.length;
      if(G.length){ S.armor=Math.min(100,S.armor+G.length*4); toast(`${G.length} ${G.length===1?'person':'people'} at the doors · +${G.length*4} armour`); }
      say(brother(),G.length>=6?'Look at that. Look at all of them.':G.length?'Okay. Okay. Let’s go.':'Just us, then. Like always.',3); }
  }; };
INV_UPDATES.push(()=>{ const F=S.flags; if(S.act!==4||F.cas_open||F.gather_done||S.cut||dlg.open||S.menu||S.sector.id!=='street'||S.driving) return;
  const c=SECTORS.street.entities.find(e=>e.look==='castiel'&&!e.dead&&e.dialogue==='castiel_iv'); if(!c||Math.hypot(S.px-c.x,S.py-c.y)>6) return;
  F.gather_done=true; playCutscene('gather'); });
{ const was=epilogue; epilogue=function(k){ const E=was(k); if(k==='D') return E; const n=S.flags.gathered||0;
    if(n) E.lines.push(n>=8?`${n} people stood at the doors of St. Brendan’s that night. Afterwards, every one of them said it had been their idea to come.`:`${n} ${n===1?'person':'people'} stood at the doors of St. Brendan’s that night. It turned out to be enough to matter, which is the most anyone can say about anything.`);
    return E; }; }
