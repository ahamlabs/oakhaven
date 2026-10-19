/* ═══ The town notices ═════════════════════════════════════════════════════
   · Townsfolk say something new once, after something you did.
   · Two walkers who meet in the street talk to each other, and you can
     overhear them.
   · KOAK reads the news between the calls.
   · The people you helped text when a case closes. */

const dec=cid=>caseDecision(cid);
THREADS.sarah=THREADS.sarah||'Sarah (library)';

/* ── reactive lines: each plays once, the next time you talk to them ──── */
const TOWN_REACT=[
  // the mill and the town
  {id:'w_phantom',talk:'worker',when:F=>F.phantom,line:'Somebody said you two went in the mill and came out with a look on you. Did you see Ray? Don’t answer that. I don’t want to know.'},
  {id:'w_shift',talk:'worker',when:()=>dec('shift')==='expose',line:'The Ledger printed Dwyer’s name. Front page. My wife cut it out and put it on the fridge, right next to the kids.'},
  {id:'w_burn',talk:'worker',when:()=>dec('shift')==='burn',line:'Records office burned, they’re saying. Every form in it. Funny how the only fire this year was paperwork.'},
  {id:'w_vigil',talk:'worker',when:F=>F.vigil==='truth',line:'Seven times. I keep saying it at the bar. Guys look at me like I’m drunk. Then they say it back.'},
  {id:'w_gath',talk:'worker',when:F=>S.act===4&&(F.gathered||0)>=4,line:'Half the street’s at the church. I’m going. I don’t know what I’m going to do there. Stand, I guess.'},
  {id:'r_bell',talk:'rainwoman',when:()=>dec('bell')==='answer',line:'The bell rang one last time and then it stopped, and Carol Carver came out on her porch in her slippers and just stood there laughing.'},
  {id:'r_bellq',talk:'rainwoman',when:()=>dec('bell')==='silence',line:'No bell last night. First night in a month. I couldn’t sleep for the quiet. Isn’t that awful?'},
  {id:'r_vigil',talk:'rainwoman',when:F=>F.vigil==='silent',line:'You held my hand at the vigil. I hope I didn’t hold too tight. My son used to say I hold on too tight.'},
  {id:'r_house',talk:'rainwoman',when:()=>dec('agnes')==='open',line:'Agnes Bell called me. First time in twenty years. She told me about a boy named Thomas. We cried on the phone like teenagers.'},
  {id:'t_radio',talk:'teen',when:F=>F.rd_saved,line:'That car had nobody in it, and you stood in front of it. That’s the coolest thing I have ever seen. My mom says I can’t tell anybody.'},
  {id:'t_gus',talk:'teen',when:F=>F.rd_gus_dead,line:'Gus is gone. The car got him at twenty-three past. I keep looking at my watch at twenty-three past.'},
  {id:'t_sky',talk:'teen',when:()=>dec('sky')==='explain',line:'My little brother stopped drawing the sky. He drew a dog. A normal dog. Mom put it on the fridge and cried at it.'},
  {id:'t_sky2',talk:'teen',when:()=>dec('sky')==='destroy',line:'They burned the drawings at the school. My brother cried for an hour and then he couldn’t remember why. That’s worse, right? That feels worse.'},
  {id:'t_kb',talk:'teen',when:()=>dec('broadcast')==='broadcast',line:'Dude. KOAK played something at three in the morning. You were on it. Like, you. What was that?'},
  {id:'l_road',talk:'logger',when:()=>dec('road')==='break',line:'Highway 38 goes all the way to Reedsport again. I drove it twice just to be sure. Mile fourteen’s just a mile now.'},
  {id:'l_saved',talk:'logger',when:F=>F.rd_saved,line:'Twenty-three past and I’m still here. Thank you. I mean it. Don’t make it weird.'},
  {id:'l_inv',talk:'logger',when:()=>dec('inventory')==='return',line:'Earl gave me back my father’s compass. I never had one. I never had a compass. I know exactly where it points.'},
  {id:'l_reed',talk:'logger',when:()=>dec('reed')==='accept',line:'Glenn Reed came by the feed store. Bought the same thing he always buys. Mia was holding his hand like she’d fall off the earth.'},
  {id:'n_clinic',talk:'nurse',when:F=>F.martin_saved,line:'Martin Olsen is sitting up. He asked for coffee. I’ve never been so glad to say no to anybody.'},
  {id:'n_chart',talk:'nurse',when:()=>dec('clinic')==='destroy',line:'The chart’s gone. I sleep. I don’t know what tomorrow says now, and I’ve decided that’s the job.'},
  {id:'n_vigil',talk:'nurse',when:F=>F.vigil_done,line:'I said it out loud. That I wrote the wrong thing. My hands shook all the way home and then they stopped. I don’t think they’ve stopped since March.'},
  {id:'s_shift',talk:'sheriff',when:()=>dec('shift')==='expose',line:'The DA called. A real one, from Salem. Wants to know why my office never asked about fan fourteen. I said I’d like to know too.'},
  {id:'s_radio',talk:'sheriff',when:()=>dec('radio')==='destroy',line:'Evelyn smashed the radio herself, did you know? Said if anybody was going to do it, it was going to be her.'},
  {id:'s_reed',talk:'sheriff',when:()=>dec('reed')==='drive',line:'You drove the Reed thing past the line. I filed it as a missing person. I don’t know what else you file it as.'},
  {id:'s_gath',talk:'sheriff',when:F=>S.act===4&&F.gathered,line:'There’s a crowd at St. Brendan’s and nobody called it. Small towns. You can’t organise them and you can’t stop them.'},
  {id:'sa_kb',talk:'logger',when:()=>dec('broadcast')==='splice',line:'Somebody spliced KOAK’s last broadcast. Lou says it’s the best edit he’s ever heard. He won’t say what was on the reel that got cut.'},
  {id:'sa_contract',talk:'rainwoman',when:()=>dec('contract')==='break',line:'Sarah says Naomi Price came in for a library card. Doesn’t remember signing anything, ever. Signed the card twice, just to feel it.'},
  {id:'sa_saint',talk:'worker',when:()=>dec('saint')==='reveal',line:'The parish posted Frank’s letter on the church door. People keep stopping to read it. Somebody left flowers. Somebody left a hard hat.'},
];
const REACT_LOOK={sheriff:'sheriff',nurse:'doctor',sarah:'sarah'};
function pendingReact(talk){ const F=S.flags; return TOWN_REACT.find(r=>r.talk===talk&&!F['rx_'+r.id]&&r.when(F)); }
{ const was=townTalk; townTalk=function(e){ const k=e.talk||e.talkOnly, d=WALK_DLG[k];
    if(d&&pendingBeat(d)) return was(e);
    const r=pendingReact(k); if(!r) return was(e);
    S.flags['rx_'+r.id]=true; S.flags['met_'+k]=true;
    e.face=Math.atan2(S.py-e.y,S.px-e.x); e.waitT=4.2; e.tx=undefined;
    say(REACT_LOOK[k]||'town',r.line,null,{now:true,name:e.name}); }; }

/* ── overheard: two walkers stop and talk ─────────────────────────────── */
const OVERHEAR=[
  {id:'o_six',a:'worker',b:'logger',when:F=>S.act===1,lines:[[0,'Six men, Gus.'],[1,'I know how many.'],[0,'I keep counting anyway. Like there’s going to be a different number.']]},
  {id:'o_feds',a:'sheriff',b:'any',when:F=>S.act===1&&F.marla,lines:[[1,'Those two feds. They real?'],[0,'Their badges are real. I called it in. A man in Washington said “oh, them,” and hung up.']]},
  {id:'o_fog',a:'rainwoman',b:'any',when:F=>S.act===2,lines:[[0,'Did you try the town line?'],[1,'Three times. The road just goes grey and then you’re back at the Shell.'],[0,'My sister’s waiting dinner. She doesn’t know. She just keeps waiting dinner.']]},
  {id:'o_delia',a:'any',b:'any',when:F=>F.delia_done&&!F.delia_killed,lines:[[0,'Delia Park’s sitting on the bench outside the motel. Just sitting.'],[1,'Is that good?'],[0,'She said hello to me. Delia never said hello to anybody in her life.']]},
  {id:'o_delia_k',a:'any',b:'any',when:F=>F.delia_killed,lines:[[0,'They found Delia Park.'],[1,'Don’t.'],[0,'I’m just saying they found her.']]},
  {id:'o_vigil',a:'any',b:'any',when:F=>F.vigil_done,lines:[[0,'You going again tomorrow? The candles?'],[1,'Somebody has to. Marla can’t carry all the jars.']]},
  {id:'o_vigil_c',a:'teen',b:'any',when:F=>F.vigil==='charge',lines:[[0,'“Don’t let it make you quiet.” That’s going on my jacket.'],[1,'You don’t have a jacket.'],[0,'I’m getting a jacket.']]},
  {id:'o_bell',a:'any',b:'any',when:()=>dec('bell')==='answer',lines:[[0,'Elise Carver’s back at school.'],[1,'Back how?'],[0,'Back. Just back. Wet hair every morning, her mother says. But back.']]},
  {id:'o_kevin',a:'nurse',b:'any',when:F=>F.kevin_rested,lines:[[0,'The Tran boy slept. Twelve hours. I checked on him every hour like a new mother.'],[1,'Is he okay?'],[0,'He woke up and asked if anybody had a phone charger. So, yes. I think he’s okay.']]},
  {id:'o_kevin_u',a:'nurse',b:'any',when:F=>F.kevin_used,lines:[[0,'The Tran boy hasn’t closed his eyes since Friday.'],[1,'Can’t you give him something?'],[0,'I could. He asked me not to. He said they need him awake.']]},
  {id:'o_crowley',a:'any',b:'any',when:F=>F.crowley_done,lines:[[0,'Man in a black coat bought every bottle of Glenlivet at the Shell.'],[1,'Earl’s been crossing himself all morning. Earl’s not even Catholic.']]},
  {id:'o_paper',a:'any',b:'any',when:F=>Object.keys(inv_().closed||{}).length>=4,lines:[[0,'Did you see the Ledger? They print it every morning now. Nothing but us.'],[1,'Who’s writing it?'],[0,'Nobody knows. It’s just on the step. Damp.']]},
  {id:'o_gather',a:'any',b:'any',when:F=>S.act===4,lines:[[0,'Are you going? To the church?'],[1,'I don’t know what I’d do.'],[0,'Nobody does. I think that’s the point. You just go.']]},
];
function overhearPair(a,b){ const F=S.flags;
  for(const o of OVERHEAR){ if(F['oh_'+o.id]||!o.when(F)) continue;
    const m=(x,k)=>k==='any'||x.talk===k;
    if(m(a,o.a)&&m(b,o.b)) return {o,p:[a,b]}; if(m(b,o.a)&&m(a,o.b)) return {o,p:[b,a]}; }
  return null; }
let ohT=0;
INV_UPDATES.push(()=>{ if(S.time-ohT<1.2||S.cut||dlg.open||S.menu||S.driving||S.sector.id!=='street') return; ohT=S.time;
  if(S.sector.entities.some(e=>e.kind==='enemy'&&!e.dead&&e.state==='hunt')) return;
  if(S.time-(S.lastOverhear||-99)<45) return;
  const W=S.sector.entities.filter(e=>e.kind==='walker'&&!e.dead&&!e.hidden&&e.talk&&Math.hypot(e.x-S.px,e.y-S.py)<8);
  for(let i=0;i<W.length;i++) for(let j=i+1;j<W.length;j++){ const a=W[i], b=W[j]; if(Math.hypot(a.x-b.x,a.y-b.y)>3.6) continue;
    const r=overhearPair(a,b); if(!r) continue;
    S.flags['oh_'+r.o.id]=true; S.lastOverhear=S.time;
    const [p,q]=r.p; p.face=Math.atan2(q.y-p.y,q.x-p.x); q.face=Math.atan2(p.y-q.y,p.x-q.x); p.waitT=q.waitT=3+r.o.lines.length*3; p.tx=q.tx=undefined;
    r.o.lines.forEach(([w,t],k)=>{ const e=r.p[w]; say(REACT_LOOK[e.talk]||'town',t,null,{now:k===0,name:e.name}); });
    if(S.transcript) S.transcript.push({who:'overheard',text:r.o.lines.map(([w,t])=>r.p[w].name+': '+t).join(' / ')});
    return; } });

/* ── KOAK news between the calls ──────────────────────────────────────── */
const BULLETINS=[
  {id:'b1',when:F=>S.act===1&&F.phantom,lines:['KOAK news at the half hour. Crossroads Holdings declined again today to comment on the six deaths at the Oakhaven mill.','The company’s registered office in Wilmington, Delaware is a mailbox. We called it. Somebody answered and said, “Not yet.”']},
  {id:'b2',when:()=>dec('shift')==='expose',lines:['KOAK news. The county has reopened the inquest into the deaths at the Oakhaven mill, citing records signed by the late foreman Frank Dwyer.','Crossroads Holdings has not returned calls. Its mailbox, we’re told, is now full.']},
  {id:'b3',when:()=>dec('bell')!=null,lines:['Out at Pike’s Reservoir tonight, the water is low and the bell is…',()=>dec('bell')==='answer'?'…quiet. Walter Pike asked us to say, on the air, that he’s going to bed. So: goodnight, Walter.':dec('bell')==='silence'?'…gone quiet. Walter Pike says he misses it. He asked us to play something with a bell in it. We don’t have anything with a bell in it.':'…still ringing. Twenty to three. Walter says that’s all right. He says somebody listened, once, and that’s more than most bells get.']},
  {id:'b4',when:F=>S.act===2,lines:['This is KOAK, still on the air on the backup generator. If you can hear this, you’re inside the fog.','Keep your lights on. Check on your neighbours. If somebody stops talking, talk to them anyway.']},
  {id:'b5',when:F=>F.vigil_done,lines:['KOAK. There was a vigil tonight on the cross street. Thirty candles, give or take.',F=>F.vigil==='truth'?'Somebody said “seven times” and the whole street said it back. We don’t know what it means. We’re saying it anyway. Seven times.':'We read the six names on the air now, at the top of every hour. Ray Hollis. Lyle Brandt. Emeka Okafor. Tunde Okafor. Pete Lindqvist. Mo Haddad.']},
  {id:'b6',when:()=>dec('road')!=null,lines:['Road report. Highway 38 between Oakhaven and Reedsport is…',()=>dec('road')==='break'?'…open. Just open. Mile fourteen is a mile. Drive safe.':dec('road')==='follow'?'…open for one car, apparently. A Daniel Rusk called in from Reedsport to say he’s fine and he’s never coming back. Good for you, Daniel.':'…complicated. Our traffic reporter drove it and came back from the wrong end. He’s having a lie-down.']},
  {id:'b7',when:F=>S.act===3,lines:['KOAK. We’ve had a number of calls about a girl in a nightgown on the cross street. Please don’t approach her.','We’ve had one call from the girl. She asked us to stop telling people not to approach her. She said she’s been alone a really long time.']},
  {id:'b8',when:()=>dec('clinic')==='treat',lines:['Some good news from the county road clinic. A Mr. Martin Olsen, sixty-one, is expected to make a full recovery.','Dr. Halvorsen asked us to add that the chart was wrong. She was very specific about that. The chart was wrong.']},
  {id:'b9',when:F=>S.act===4,lines:['This is KOAK, Oakhaven, and I think this is the last thing I’m going to read tonight.',F=>(F.gathered||0)>=4?'There are people at St. Brendan’s. A lot of people. Nobody organised it. If you’re listening and you can walk, I think you should go.':'If you’re out there, at the church, whoever you are: we’re still on the air. We’ll stay on the air.']},
];
{ const was=radio; radio=function(){ const F=S.flags, top=RADIO.filter(r=>r.when()).at(-1);
    if(top&&top.fx&&!top.__heard){ top.__heard=true; return was(); }
    const B=BULLETINS.filter(b=>!F['bul_'+b.id]&&b.when(F)).at(-1);
    if(!B) return was();
    F['bul_'+B.id]=true; sfx('static');
    B.lines.forEach((t,i)=>say('caller',typeof t==='function'?t(F):t,null,{now:i===0,name:'KOAK 1340 AM — news'})); }; }

/* ── the people you helped write back ─────────────────────────────────── */
const CASE_TXT={
  shift:{rest:['marla','frank dwyer’s room is quiet. i went up with fresh towels. i don’t know why. habit'],expose:['marla','they printed his name. i bought six copies. one for each of them'],burn:['marla','the records office is ash. nobody’s saying it. everybody’s thinking it']},
  bell:{answer:['marla','carol carver just called the front desk crying. good crying. elise is home'],silence:['marla','no bell tonight. the ice machine stopped knocking too. small mercies'],leave:['marla','bell’s still ringing out at the reservoir. walter says thank you for listening']},
  radio:{destroy:['marla','evelyn came by. she said tell them the station’s quiet. she said quiet like it was a present'],tapes:['kevin','you kept the tapes?? can i hear them. no. don’t let me hear them. ok maybe one'],follow:['marla',()=>S.flags.rd_saved?'gus came into the lobby at 2:30 just to sit with somebody. he’s still here. he’s asleep in the chair':'it’s 2:30. it’s quiet. i’m sorry about gus']},
  road:{break:['marla','a trucker came through from reedsport tonight. first in a month. i nearly hugged him'],follow:['marla','daniel’s room is empty. he left the key on the bed and a note that just says THANK YOU in capitals'],use:['kevin','you’re USING the loop road?? that’s like using a wormhole to get groceries. respect']},
  agnes:{open:['marla','agnes bell called me just to talk. we talked for an hour about nothing. it was wonderful'],box:['marla','agnes bell called. she said the house is smaller now. she said it like she was sorry'],keep:['marla','agnes bell says thomas’s room is still there. she says she sits in it. she says thank you for letting her']},
  clinic:{treat:['halvorsen','Martin is sitting up and complaining about the food. I have never been happier to be complained at.'],destroy:['halvorsen','The basement monitor is dark. I slept four hours. I’d forgotten what that was.'],follow:['halvorsen','I followed the chart. I don’t know yet if that was cowardice. Thank you for not deciding for me.']},
  reed:{accept:['marla','glenn reed checked his wife and kid into room 9 for one night. just to be somewhere with lights'],drive:['marla','mia reed asked me where her daddy went. i said away. was that right'],rite:['marla','the reed house has its curtains open. first time since he came back']},
  inventory:{return:['marla','earl’s given away half the shop. people keep coming in crying about things they never owned'],catalogue:['kevin','an ARCHIVE of things that never existed?? i need to see the index. i need it'],destroy:['marla','earl’s back room is empty. he said it was like the whole place exhaled']},
  contract:{break:['marla','naomi price walked past the motel and waved. she’s never waved. she said she remembers her mother’s voice'],trade:['crowley','A trade. How very grown up of you. I’ll be in touch, as they say.'],burn:['marla','naomi price came by and asked if i knew her. i said yes. i said all of it']},
  saint:{reveal:['marla','frank’s letter is on the church door. people are leaving hard hats under it'],rest:['marla','the church wall stopped. father dunne says he’s going to plaster it. he said it like a eulogy'],keep:['marla','the wall at st brendan’s still bleeds when people lie. father dunne says he’s going to start hearing confessions there']},
  sky:{destroy:['kevin','you burned them? ok. ok. i get it. i would’ve wanted to look. i get it'],sky:['kevin','THE DRAWINGS. you kept them for me. i’ve been staring at them for an hour. it’s a map. it’s a MAP'],kevin:['kevin','THE DRAWINGS. you kept them for me. i’ve been staring at them for an hour. it’s a map. it’s a MAP'],explain:['marla','the teacher came by. she said the kids drew dogs today. dogs and houses and their moms']},
  broadcast:{destroy:['kevin','the reels are gone? good. i’ve been dreaming in 16mm'],broadcast:['marla','did you hear koak at 3am. that was you. that was both of you. i didn’t know what to feel'],splice:['marla','lou at koak says the last broadcast is the best thing he ever aired. he won’t tell me what got cut']},
};
{ const was=closeCase; closeCase=function(cid,o={}){ const already=caseClosed(cid); const r=was(cid,o);
    if(!already&&!o.quiet&&caseClosed(cid)&&CASE_TXT[cid]) later(9,()=>{ const d=dec(cid), t=d&&CASE_TXT[cid][d];
      if(t){ const [th,tx]=t; msg(th,typeof tx==='function'?tx():tx); } });
    return r; }; }
