/* ═══ Investigation systems, second pass ════════════════════════════════════
   · witnesses remember how you treated them (trust), and say less when wary;
   · the case file evolves: notes are annotated when a deduction changes
     their meaning, struck through when a theory fails, and in Act IV a few of
     them are edited by someone who isn't you;
   · each case keeps a quiet measure of how well it was investigated, which
     the autopsy, the paper and later scenes reflect (never shown as a score);
   · the brothers keep track of each other: every hard decision is one one
     of them wanted and the other didn't, and the car is where they say so. */

S.inv.trust=S.inv.trust||{}; S.inv.ann=S.inv.ann||{}; S.inv.noteAnn=S.inv.noteAnn||{}; S.inv.noteEdit=S.inv.noteEdit||{}; S.inv.bond=S.inv.bond||0; S.inv.rows=S.inv.rows||[];
function inv_(){ const I=S.inv; I.trust=I.trust||{}; I.noteAnn=I.noteAnn||{}; I.noteEdit=I.noteEdit||{}; I.ann=I.ann||{}; I.bond=I.bond||0; I.rows=I.rows||[]; return I; }

/* ── trust ──────────────────────────────────────────────────────────────── */
function trust(id,n){ const T=inv_().trust; T[id]=(T[id]||0)+n; }
function trustOf(id){ return inv_().trust[id]||0; }
function trustWord(id){ const t=trustOf(id); return t>=2?'trusts you':t<=-1?'wary of you':''; }
/* wire trust into choices that already exist */
function onChoice(dlgId,node,idx,fn){ const n=DIALOGUE[dlgId]&&DIALOGUE[dlgId].nodes[node]; if(!n) return; const c=n.choices[idx]; if(!c) return;
  c.fx=c.fx||{}; const was=c.fx.now; c.fx.now=()=>{ if(was) was(); fn(); }; }
onChoice('peter','p1s',0,()=>trust('peter',2)); onChoice('peter','p1d',0,()=>trust('peter',-2));
onChoice('mara','m0',2,()=>trust('mara',1)); onChoice('mara','m0',1,()=>trust('mara',-1));
onChoice('leon','l1',1,()=>trust('leon',-1)); onChoice('leon','l1',0,()=>trust('leon',1));
onChoice('ruth','r0',0,()=>trust('ruth',1)); onChoice('ruth','r0',1,()=>trust('ruth',-1));
onChoice('halvorsen','h1',0,()=>trust('halvorsen',2)); onChoice('halvorsen','h1',1,()=>trust('halvorsen',-1));
onChoice('martin','m0',0,()=>trust('martin',2)); onChoice('martin','m0',1,()=>trust('martin',-1));
INV_UPDATES.push(()=>{ const F=S.flags, I=inv_();
  if(F.delia_done&&!I.t_delia){ I.t_delia=1; trust('delia',F.delia_killed?-3:2); }
  if(F.kevin_done&&!I.t_kevin){ I.t_kevin=1; trust('kevin',F.kevin_used?-1:2); }
  if(F.sarah_crew&&!I.t_sarah){ I.t_sarah=1; trust('sarah',1); } });
/* testimony depends on it */
{ const C=CASES.shift.clues; C.mara.trust='mara'; C.peter.trust='peter'; C.leon.trust='leon';
  const px=C.peter.x; C.peter.x=()=>trustOf('peter')<0?'Only two people knew where the cut-out was. He won’t say who the other was. Not to you.':typeof px==='function'?px():px; }
CASES.mill.clues.marla.trust='marla'; CASES.bell.clues.ruth.trust='ruth'; CASES.clinic.clues.martin.trust='martin'; CASES.clinic.clues.halvorsen.trust='halvorsen';
CASES.lockdown.clues.kevin.trust='kevin'; CASES.lockdown.clues.delia.trust='delia';
/* a wary witness gives you the accurate, incomplete version at the inquest */
{ const P=CASES.shift.paper; CASES.shift.paper=()=>{ const r=P(); if(trustOf('peter')<0) r.body=r.body.map(b=>b.startsWith('Peter Shaw')?'Peter Shaw, a maintenance technician, declined to speak to the Ledger. He said he had “already said too much to the wrong people.”':b); return r; }; }
/* Halvorsen, if he trusts you, gives you the clinic's records on the way to the church */
{ const d=DIALOGUE.doctor_iv.nodes.d0, t=d.text; d.text=()=>(typeof t==='function'?t():t)+(trustOf('halvorsen')>=2?'\n\nHe hands you a folder too. "The clinic files. Every page that shouldn’t exist. You asked me the right question at the clinic; I owe you the rest of the answer."':''); }

/* ── open questions ─────────────────────────────────────────────────────── */
function openQuestions(c){
  const Q=[]; if(caseClosed(c.id)&&c.autopsy){ try{ return [].concat(c.autopsy().open).filter(Boolean); }catch(e){ return []; } }
  if(c.questions) try{ Q.push(...c.questions()); }catch(e){}
  for(const l of c.links) if(!haveLink(c.id,l.id)&&l.opens&&clueHave(c,l.a)!==clueHave(c,l.b)) Q.push(`Something here could open ${l.opens}.`);
  const miss=Object.keys(c.clues).filter(k=>!clueHave(c,k)).length; if(miss) Q.push(miss===1?'There is one more thing to find.':`There are ${miss} more things to find.`);
  if(c.theory&&!theoryOf(c.id)) Q.push(c.theory.q);
  return Q.slice(0,6);
}
CASES.mill.questions=()=>[!S.flags.read_ledger14?'Mills keep paper. Where is this one’s?':null,!S.flags.read_roster?'Who worked line three?':null].filter(Boolean);
CASES.shift.questions=()=>[!S.flags.dw_reset?'Why is the dust outside the door undisturbed?':null,(S.flags.w_mara?0:1)+(S.flags.w_peter?0:1)+(S.flags.w_leon?0:1)?'Three people in town knew Frank. Have you asked all of them?':null].filter(Boolean);
CASES.lockdown.questions=()=>['Who is c.shurley?',!S.flags.term_pawn?'There is a terminal somewhere else in town.':null].filter(Boolean);
CASES.lily.questions=()=>['Who counted six?',!S.flags.drafts_found?'Who has been texting from 0114?':null].filter(Boolean);
CASES.author.questions=()=>['Does the ending need what he says it needs?'];

/* ── the case file evolves ─────────────────────────────────────────────── */
const ANNOTATE={ neglect:['ray','sam','It was never the ghost. Seven deferrals.'], harvest:['tear','dean','Not eating. Counting.'], admin:['mill_term','sam','c.shurley isn’t root. So who is?'],
  seventh:['arrive','dean','Seven. One wasn’t on the payroll.'], replay:['tv','sam','The room repeats itself. So did the TV.'], broker:['crowley','dean','Middleman. There’s always a middleman.'],
  thecoat:['girl','sam','Her father brought it home on his coat.'], older:['marla','sam','The seal is older than the company.'], writer:['tv','dean','He wrote it before we said it.'] };
INV_UPDATES.push(()=>{ const I=inv_(); for(const [d,[nid,who,text]] of Object.entries(ANNOTATE)){ if(!deduced(d)||I.noteAnn[nid+':'+d]) continue;
  if(!S.notes.some(n=>n.id===nid)) continue; I.noteAnn[nid+':'+d]={nid,who,text}; } });
function noteView(n){ const I=inv_(), ann=Object.values(I.noteAnn).filter(a=>a.nid===n.id), ed=I.noteEdit[n.id];
  let struck=null, text=n.text, title=n.title;
  if(n.id==='arrive'&&deduced('seventh')){ struck=n.text; title='Seven dead'; text='Six former mill workers, and a nine-year-old girl nobody counted.'; }
  if(n.id.startsWith('theory_')){ const cid=n.id.slice(7); if(caseClosed(cid)&&!theoryRight(cid)){ struck=n.text; text='Wrong. '+(CASES[cid]?CASES[cid].theory.wrong:''); } }
  if(ed){ title=ed.title||title; text=ed.text; }
  return {title,text,struck,ann,edited:!!ed}; }
/* Act IV: a few entries change after being saved. Rare, legible, and his. */
INV_UPDATES.push(()=>{ const F=S.flags, I=inv_(); if(S.act<4||I.editsDone) return; if(!F.cath_in&&!F.cas_open) return;
  I.editsDone=true;
  if(S.notes.some(n=>n.id==='tv')) I.noteEdit.tv={title:'The television',text:'The KOAK anchor looked into the camera and said: “One brother kills the other at the altar.” Nobody in the room had said that yet. Nobody has said it since.'};
  if(F.delia_done&&!F.delia_killed&&S.notes.some(n=>n.id==='delia_freed')) I.noteEdit.delia_freed={text:'The demons aren’t hunting. They hide inside people from something in the fog. The host, Delia Park, did not survive.'};
  S.notes.push({id:'ch14',title:'Chapter Fourteen — The brothers go home',text:'Archived. Not written by you. Two lines, and the second has been crossed out so hard the page tore: “They drove until the fog was behind them.” “One of them drove.”'});
  later(2,()=>{ toast('Case file updated — J'); S.glitchA=.4; }); });

/* ── investigation quality: quietly kept, never shown as a number ───────── */
function invQuality(cid){ const c=CASES[cid]; if(!c) return 0;
  const ks=Object.keys(c.clues), have=ks.filter(k=>clueHave(c,k)).length/Math.max(1,ks.length);
  const links=(S.inv.links[cid]||[]).length/Math.max(1,c.links.length);
  return have*.4+links*.3+(theoryRight(cid)?.3:0); }
function qualityLine(cid){ const q=invQuality(cid);
  return q>=.75?'Your file on this is thorough. It will hold up, if anyone ever asks.':q>=.4?'Your file has gaps. Somebody else will have to fill them.':'You closed this case knowing very little about it. The town will remember it the way the official record does.'; }
for(const c of Object.values(CASES)){ const A=c.autopsy; if(!A) continue;
  c.autopsy=()=>{ const r=A(); r.open=[qualityLine(c.id)].concat(r.open||[]); return r; };
  const Pp=c.paper; if(Pp) c.paper=()=>{ const r=Pp(); if(r&&r.body&&invQuality(c.id)>=.75) r.body=r.body.concat(['The Ledger thanks two visiting federal agents for a file it was able to verify line by line.']); return r; }; }

/* ── the brothers ─────────────────────────────────────────────────────── */
/* who wanted what, for every decision with no right answer */
const PREFS={
  shift:{dean:'rest',sam:'expose',why:{rest:'laying them to rest',expose:'putting Frank’s name in the record',burn:'burning the records'}},
  bell:{dean:'answer',sam:'silence',why:{silence:'telling Ruth the truth',answer:'bringing Elise back',leave:'leaving the bell alone'}},
  road:{dean:'use',sam:'follow',why:{break:'breaking the loop',follow:'making Daniel look at it',use:'keeping the road'}},
  agnes:{dean:'keep',sam:'open',why:{open:'opening the wardrobe',box:'smashing the music box',keep:'letting her keep the room'}},
  clinic:{dean:'follow',sam:'treat',why:{treat:'treating Martin like a patient',destroy:'burning the chart',follow:'using the chart'}},
};
{ const was=decide; decide=function(cid,what){ was(cid,what); const p=PREFS[cid]; if(!p) return;
    const bro=brother(), want=p[bro], agree=what===want, I=inv_();
    I.bond+=agree?1:-1; I.rows.push({cid,what,want,bro,agree,said:false}); }; }
const ROW_LINES={
  dean:{agree:'Good call back there. I mean it.',disagree:w=>`You went with ${w}. I wouldn’t have. I’m not saying you’re wrong. I’m saying I wouldn’t have.`},
  sam:{agree:'For what it’s worth, I think we got that one right.',disagree:w=>`You went with ${w}. I keep thinking about the other way. I don’t think you’re wrong. I think we’re different.`},
};
{ const was=impalaTalk; impalaTalk=function(){ const I=inv_(), r=I.rows.find(x=>!x.said);
    if(!r){ was(); return; } r.said=true; const p=PREFS[r.cid], bro=r.bro, w=p.why[r.what]||r.what;
    const L=[[bro,r.agree?ROW_LINES[bro].agree:ROW_LINES[bro].disagree(w)]];
    if(!r.agree) L.push([S.hero,isDean()?'Yeah. I know. I’d do it again.':'I know. I’d still do it.'],[bro,I.bond<=-2?'…We keep doing that. Disagreeing and then not talking about it.':'Okay. Okay. Just— tell me next time. Before.']);
    else if(I.bond>=3) L.push([S.hero,'We’re on a streak.'],[bro,'Don’t jinx it.']);
    L.forEach(([w2,t],i)=>say(w2,t,null,{now:i===0})); }; }
/* the bond shows up at the altar and in the epilogue */
INV_UPDATES.push(()=>{ const F=S.flags, I=inv_(); if(S.sector.id!=='cathedral'||!F.altar_talk||I.bondSaid) return; I.bondSaid=true;
  later(26,()=>say(brother(),I.bond>=2?'Whatever you pick in there. I’m with you. I’ve been with you all night.':I.bond<=-2?'We haven’t agreed on anything tonight. I need you to know I still trust you. That’s different.':'Hey. Whatever happens, it’s us. It’s still us.',4)); });
{ const was=epilogue; epilogue=function(k){ const E=was(k); if(k==='D') return E; const b=inv_().bond;
    E.lines.push(b>=2?'They argued about the radio all the way to Idaho, which is how they knew they were fine.':b<=-2?'They didn’t talk for three hundred miles. Then one of them said “Okay,” and the other one said “Okay,” and that was the whole conversation, and it was enough.':'Somewhere past the county line, one of them fell asleep and the other one turned the radio down.');
    return E; }; }
/* the trust they earned, in the people tab */
{ const was=personExtra; personExtra=function(p){ const id={w_mara:'mara',w_peter:'peter',w_leon:'leon',met_ruth:'ruth',met_nurse:'halvorsen',cl_interview:'martin',met_sarah:'sarah'}[p.flag];
    const w=id?trustWord(id):''; const base=was(p); return base+(w?`<small class="tr">${w==='trusts you'?'Trusts you.':'Wary of you.'}</small>`:''); }; }
