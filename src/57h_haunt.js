/* ═══ The haunting in your pocket ═══════════════════════════════════════════
   (541) 555-0114 texts you. It knows things. It is, for a long time, the most
   helpful voice in town. In Act III you find out whose phone it is and what
   the messages really are: drafts, written by a nine-year-old to her father,
   never sent, and sent now — by something that learned her voice to steer you.

   Also: photographs you didn't take, a payphone that rings once an act, a
   call from your father that isn't, and a pocket radio's worth of static
   when the things from the fold come close. */

const T0114=[
  {id:'a1',when:F=>F.millEntered,text:'line three. hes on line three'},
  {id:'a2',when:F=>F.ray_named,text:'you said his name. nobody says his name'},
  {id:'a3',when:F=>F.term,text:'dont let them count him'},
  {id:'a4',when:F=>F.phantom&&S.act===1,text:'it hurts to breathe. it always hurts to breathe here'},
  {id:'b1',when:F=>S.act===2,text:'the fog is cold. daddy says fog is just a cloud that gave up'},
  {id:'b2',when:F=>S.act===2&&F.delia_done,text:F=>F.delia_killed?'she was hiding. you found her anyway':'she was hiding from the same thing i am'},
  {id:'b3',when:F=>S.act===2&&F.kevin_done,text:'is it 2:40 there too'},
  {id:'c1',when:F=>S.act>=3&&F.cas_met,text:'i opened the door for you. dont trust a door youve opened before'},
  {id:'c2',when:F=>S.act>=3&&F.followed,text:'come home. the coat is on the hook'},
  {id:'c3',when:F=>S.act>=3&&F.drafts_found,text:'you found my drafts'},
  {id:'c4',when:F=>S.act>=3&&F.chuck_seen,text:'the man at the bar says if i help him daddy can come home'},
  {id:'d1',when:F=>S.act>=4,text:'he says one of you has to. i dont want one of you to'},
  {id:'d2',when:F=>S.act>=4&&F.cath_in,text:'im in the wall. its warm. dont be scared'},
];
INV_UPDATES.push(dt=>{ const F=S.flags; if(S.cut||!S.running) return;
  S.t0114=(S.t0114??12)-dt; if(S.t0114>0) return; S.t0114=6;
  const sent=new Set((S.msgs['0114']||[]).map(m=>m.k));
  const m=T0114.find(x=>!sent.has(x.id)&&x.when(F)); if(!m) return;
  msg('0114',typeof m.text==='function'?m.text(F):m.text); S.msgs['0114'].at(-1).k=m.id; S.t0114=25+Math.random()*20; });

/* Ray's phone is on the nightstand in the Hollis house */
SECTORS.hollis.entities.push({kind:'prop',m:'tag',x:12.6,y:5.4,r:.1,h:.12,z:.42,use:'rayphone',useName:'An old phone on the nightstand'});
USES.rayphone=()=>{ const F=S.flags; F.drafts_found=true;
  const L=['daddy come home','it hurts to breathe','the man on tv said the mill is safe. is it safe','daddy your coat is dusty again','i put my inhaler in your coat so you wont forget me','is it 2:40 there too','im scared of the fan noise. the one that doesnt go'];
  openMenu('Ray Hollis’s phone',"A cheap flip phone with a cracked hinge, charging off nothing. The number on the back sticker is (541) 555-0114.\n\nThe Sent folder is empty. The Drafts folder has two hundred and eleven messages, all from February to April, all to DADDY, none of them sent:\n\n"+L.map(x=>'   “'+x+'”').join('\n')+"\n\nEvery message you’ve had from 0114 tonight is in here. They were written by a nine-year-old to her father. Something has been sending them to you, one at a time, in an order that suits it.",[{text:'Put it down'}]);
  addNoteRaw('drafts','The drafts','Ray Hollis’s phone, 0114. Two hundred and eleven unsent drafts from Lily to her father, February to April. Something has been sending them to you, in an order that suits it.'); };
CASES.lily.clues.drafts={t:'0114’s drafts',k:'record',x:'Lily’s unsent messages to her father, sent to you by something else.',have:()=>!!S.flags.drafts_found};
CASES.lily.links.push({id:'puppet',a:'drafts',b:'chuck',t:'Somebody learned her voice',x:'The helpful texts were a dead girl’s drafts, re-ordered. Something used her to steer you, and it reads like a writer choosing which line comes next.',
  dean:'He used her. He used the kid’s texts.',sam:'Every message was true. The order was the lie.'});
CASES.author.clues.drafts=CASES.lily.clues.drafts;
CASES.author.links.push({id:'steered',a:'drafts',b:'unknown',t:'Steered',x:'The texts told you where to go. The photos show you going there. Somebody has been directing.',dean:'We’ve been on rails.',sam:'Not rails. Suggestions. We took most of them.'});
/* Act IV: you can answer her */
const REPLIES=[{id:'counted',t:'We counted you. Seven. You were always seven.'},{id:'dad',t:'Your dad tried. Seven times. He never stopped.'},{id:'stay',t:'You don’t have to help him. You don’t have to help anybody.'}];
function reply0114(id){ const r=REPLIES.find(x=>x.id===id); if(!r||S.flags.replied0114) return; S.flags.replied0114=id;
  msg('0114',r.t,{me:true}); later(6,()=>msg('0114',id==='counted'?'thank you for counting me':id==='dad'?'i know. i heard him. he folded the form':'ok. im going to sit down now'));
  if(id==='stay') S.flags.lily_unhelped=true; }
/* the phone's thread view gets a reply bar in Act IV */
{ const was=phoneRender; phoneRender=function(){ was();
    if(PHN.screen!=='thread'||PHN.thread!=='0114'||S.act<4||S.flags.replied0114) return;
    const sc=document.getElementById('phScreen'); if(!sc||!sc.querySelector) return;
    const bar=document.createElement('div'); bar.className='ph-acts';
    bar.innerHTML=REPLIES.map(r=>`<button data-reply="${r.id}">${esc_(r.t)}</button>`).join('');
    sc.appendChild(bar); bar.querySelectorAll('[data-reply]').forEach(b=>b.onclick=()=>{ reply0114(b.dataset.reply); phoneRender(); }); }; }
/* in the cathedral, Lily answers if you answered her */
INV_UPDATES.push(dt=>{ const F=S.flags; if(S.sector.id!=='cathedral'||!F.replied0114||F.lilyAnswered) return; F.lilyAnswered=true;
  later(3,()=>say('lily',F.replied0114==='stay'?'I’m not helping him. I’m just sitting. You said I could.':'I got your message. It’s the first one anybody sent back.',4)); });

/* ── photographs you didn't take ───────────────────────────────────────── */
const UNKNOWN=[
  {id:'u1',when:F=>F.phantom&&S.sector.id==='mill'&&S.act===1,pov:[15.5,2.2,Math.PI/2],cap:'From the catwalk over line three. Looking down at you.'},
  {id:'u2',when:F=>S.act>=3&&F.cas_met&&S.sector.id==='street',pov:()=>[S.px-S.dirX*9,S.py-S.dirY*9,S.angle],cap:'Main Street, from behind you. Somebody was standing very still.'},
  {id:'u3',when:F=>F.lily_done&&S.sector.id==='hollis',pov:[12.4,10.3,-Math.PI/2],cap:'From the end of Lily’s bed.'},
  {id:'u4',when:F=>F.cath_in&&S.sector.id==='cathedral',pov:[12.5,6.4,Math.PI/2],cap:'From the altar, looking at the door. You were coming in.'},
];
INV_UPDATES.push(dt=>{ const F=S.flags; if(S.cut||!S.running||S.camMode) return;
  S.unkT=(S.unkT??20)-dt; if(S.unkT>0) return; S.unkT=8;
  const u=UNKNOWN.find(x=>!F['unk_'+x.id]&&x.when(F)); if(!u) return;
  const [x,y,a]=typeof u.pov==='function'?u.pov():u.pov; if(hits(S.sector,x,y,.2)) return;
  F['unk_'+u.id]=true; unknownPhoto(x,y,a,u.cap); sfx('shutter');
  later(.6,()=>{ toast('📷  New photo in Gallery'); if(!F.unkSaid){ F.unkSaid=true; later(2,()=>say(brother(),isDean()?'Did you just take a picture?':'Dean. Did your phone just take a picture?',3)); } }); });
/* after you meet Chuck, your old selfies have someone in them */
INV_UPDATES.push(dt=>{ const F=S.flags; if(!F.chuck_met||F.chuck_met_t) return; F.chuck_met_t=Date.now();
  if(GALLERY.some(p=>p.selfie)) later(20,()=>{ toast('📷  Your gallery has been updated'); F.selfieHaunt=true;
    later(3,()=>say('narr','In every selfie you took before tonight, there is someone sitting a little way behind you. Beard. Bathrobe. He is always looking at the camera.',6)); }); });

/* ── the payphone rings once an act ───────────────────────────────────── */
{ const pp=SECTORS.street.entities.find(e=>e.payphone); if(pp){ pp.use='payphone'; pp.useName='The payphone'; } }
const PAYCALLS={
  1:[['caller','…requisition, extraction fan, line three, number fourteen. Requested by R. Hollis. Reason for request: the men are coughing. Reason for request: the men are coughing. Reason—','A man’s voice']],
  2:[['caller','All units. All units. The fog is at the county line on all roads. Do not attempt to— do not— is anybody receiving this. Is anybody still out there.','Sheriff’s dispatch'],['caller','…Twenty to three. Twenty to three. Twenty to three.','Sheriff’s dispatch']],
  3:[['caller','Daddy?','A girl'],['caller','Oh. Sorry. I thought you were somebody else.','A girl']],
  4:[['chuck','Hey! It’s Chuck. Don’t hang up. Just checking in on the pacing. Is it dragging? It feels like it’s dragging. Be honest.'],['chuck','…Okay. Okay. Love you guys. See you at the altar.']],
};
USES.payphone=()=>{ const F=S.flags, a=S.act;
  if(S.call&&S.call.payphone){ answerCall(); return; }
  if(F['pay_'+a]){ say('narr','Dial tone. Under it, very faintly, somebody breathing.',3,{now:true}); return; }
  say('narr','You lift the receiver. Dial tone. Nobody on the line. The coin slot is full of sawdust.',3,{now:true}); };
INV_UPDATES.push(dt=>{ const F=S.flags, a=S.act; if(S.sector.id!=='street'||F['pay_'+a]||S.call||S.cut) return;
  const pp=SECTORS.street.entities.find(e=>e.payphone); if(!pp||Math.hypot(S.px-pp.x,S.py-pp.y)>7) return;
  if(a===1&&!F.phantom) return;
  F['pay_'+a]=true; ringPhone('Payphone, Main Street',PAYCALLS[a]||PAYCALLS[1],{payphone:true,ring:20});
  say('narr','The payphone outside the motel is ringing.',2.6); });

/* ── a call from your father ──────────────────────────────────────────── */
INV_UPDATES.push(dt=>{ const F=S.flags; if(F.dad_called||S.act!==3||!F.alistair_met||F.chuck_met||S.cut||S.call) return;
  if(!F.dad_nudge){ F.dad_nudge=S.time; return; } if(S.time-F.dad_nudge<20) return;
  F.dad_called=true; THREADS.dad='Dad';
  ringPhone('Dad',[['caller','Boys. It’s your dad.','Dad'],['caller','I know. I know it’s been a while. I need you to listen to me, because I don’t have long, and this is important.','Dad'],
    ['caller','Whatever the man at the bar tells you, it’s the truth. It’s going to be the hardest thing you ever— okay, hang on, hang on.','Dad'],
    ['chuck','Sorry. Sorry! I was doing the voice. Was that good? Honestly I always thought John was a little underwritten.'],
    ['chuck','Come have a drink. I’m at the bar. You know the one.']],
    {onEnd:()=>{ msg('dad','come have a drink'); S.dread=Math.min(1,(S.dread||0)+.15); },onDecline:()=>{ later(3,()=>msg('dad','you used to always pick up. come have a drink')); }}); });

/* ── pocket-radio static when the fold comes close ─────────────────────── */
INV_UPDATES.push(dt=>{ if(S.act<3) return; let near=99;
  for(const e of S.sector.entities) if(e.etype==='eldritch'&&!e.dead&&!e.stationary){ const d=Math.hypot(e.x-S.px,e.y-S.py); if(d<near) near=d; }
  if(near>9) return; S.staticT=(S.staticT||0)-dt;
  if(S.staticT<=0){ S.staticT=.3+near*.18; try{ if(AU.ctx&&S.settings.sound) nb({dur:.08+Math.random()*.1,freq:2600+Math.random()*1800,type:'bandpass',q:.7,gain:.05+(.09-near*.008)}); }catch(e){} } });
