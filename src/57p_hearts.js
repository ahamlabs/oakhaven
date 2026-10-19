/* ═══ Hearts, and the things that use them ═════════════════════════════════
   Good: Rae Calloway, who tows the cars that stop at the town line (Dean),
         and Sarah Lindqvist at the library (Sam).
   Bad:  Vesper at the end of the Velvet Hour's bar, and Celandine in the
         library stacks after closing. Both are demons. Both are very good
         company.

   The enchantress mechanic: partway through her conversation the choices on
   screen start to change in front of you, letter by letter, into what she
   wants you to say, chosen from how you're doing (hurt, broke, alone, at
   odds with your brother). When they finish, every option is hers.
   Only two things can break it: your brother, if the night has left you
   close enough for him to reach you, or the person you love, if you let
   yourself love someone here. Otherwise she has you for a while, and it
   costs something. */

/* ── art ──────────────────────────────────────────────────────────────── */
Object.assign(LOOKS,{
  rae:      {skin:[176,124,96], hair:{style:'bun',col:[54,30,22]}, eyes:{col:[86,60,40]}, lip:[150,90,80],
             top:{kind:'jacket',col:[46,70,98],underCol:[206,194,170],open:true,pocket:true}, legs:{kind:'jeans',col:[48,56,74]},
             shoes:[70,50,34], hat:{kind:'cap',col:[176,62,40]}, extras:['nametag']},
  vesper:   {skin:[230,200,186], hair:{style:'long',col:[86,18,26]}, eyes:{col:[150,40,52]}, lip:[176,28,50],
             top:{kind:'coat',col:[138,22,34],long:50}, legs:{kind:'skirt',col:[28,18,22],hose:[64,40,46]}, shoes:[20,12,14], outline:[30,6,10]},
  vesper_true:{skin:[196,150,150], hair:{style:'wild',col:[60,8,14]}, eyes:{kind:'glow',col:[255,90,110]}, lip:[90,10,20],
             top:{kind:'coat',col:[100,10,22],long:53}, legs:{kind:'skirt',col:[20,8,10],hose:[50,20,24]}, shoes:[14,8,8],
             tint:[120,10,30], tintAmt:.28, outline:[40,0,8], claws:true},
  celandine:{skin:[214,216,216], hair:{style:'long',col:[204,206,212]}, eyes:{col:[170,184,196],glasses:[150,150,160]}, lip:[150,120,130],
             top:{kind:'coat',col:[92,98,110],long:53}, legs:{kind:'slacks',col:[60,62,70]}, shoes:[40,40,46]},
  celandine_true:{skin:[176,190,200], hair:{style:'veil',col:[220,226,236]}, eyes:{kind:'glow',col:[230,250,255]}, lip:[90,100,120],
             top:{kind:'coat',col:[60,66,80],long:53}, legs:{kind:'slacks',col:[40,42,50]}, shoes:[30,30,36],
             tint:[140,170,210], tintAmt:.3, outline:[10,20,40], extras:['smoke']},
  /* The Formless One. Gothic, cold, sacred: obsidian, midnight indigo, cold
     silver, a trace of dried crimson. Beautiful enough to worship, still
     enough to fear. Never horns, fire or skulls: he is not a demon. */
  stranger: {skin:[34,40,74], hair:{style:'long',col:[12,14,26]}, eyes:{col:[196,206,224]}, lip:[70,56,84],
             top:{kind:'cassock',col:[18,18,26],long:53}, legs:{kind:'slacks',col:[16,16,24]}, shoes:[12,12,18],
             extras:['indigo','highcollar','darkfeather','silverstars'], outline:[4,4,10]},
  formless: {skin:[26,32,66], hair:{style:'wild',col:[10,12,24]}, eyes:{col:[226,232,246]}, lip:[64,48,80],
             top:{kind:'cassock',col:[12,12,20],long:53}, legs:{kind:'slacks',col:[10,10,18]}, shoes:[10,10,16],
             extras:['indigo','highcollar','mantle','silvercrown','darkfeather','silverstars','armlets','crimsonthread'], outline:[2,2,8]},
});
{ const was=drawFrontBack; drawFrontBack=function(A,L,fr,has,back){ was(A,L,fr,has,back); const hx=fr===4?1:0;
    const SIL=C([200,206,220]), SILD=C([120,126,146]), IND=C([40,36,96]), INDD=C([26,24,64]), CRIM=C([110,26,34]);
    /* hair with blue in it */
    if(L.top&&L.top.kind==='cassock'&&L.skin&&L.skin[2]>60&&L.skin[0]<40){ for(const [x,y] of [[12,4],[20,5],[13,9],[21,11],[11,12],[19,2]]) A.set(x+hx,y,C([40,52,110])); }
    if(has('mantle')){ for(let x=7;x<=25;x++){ const y=13+((x*5)%3); A.set(x,y,C([20,20,34])); A.set(x,y+1,C([30,30,52])); if(x%3===0) A.set(x,y+2,SILD); } }
    if(has('highcollar')){ A.rect(12,12,13,15,C([24,24,36])); A.rect(19,12,20,15,C([24,24,36])); A.set(12,12,SILD); A.set(20,12,SILD); }
    if(has('silvercrown')){ A.rect(13+hx,2,19+hx,2,SIL); for(const x of [13,16,19]) A.set(x+hx,1,SIL); A.set(16+hx,0,SILD); }
    if(has('darkfeather')){ const q=C([14,40,40]), v=C([26,30,80]), y0=has('silvercrown')?0:1;
      A.set(19+hx,y0+3,q); A.set(20+hx,y0+2,q); A.set(21+hx,y0+1,q); A.set(22+hx,y0,v); A.set(21+hx,y0,v); A.set(22+hx,y0+1,SILD); }
    if(back){ if(has('silverstars')) for(const [x,y] of [[12,20],[18,26],[14,33],[20,40],[11,46],[17,50],[21,30]]) A.set(x,y,SIL); return; }
    if(has('indigo')){ A.rect(15,15,17,52,IND); A.rect(16,15,16,52,INDD); }
    if(has('silverstars')){ const pts=[[11,19],[13,22],[12,26],[20,18],[21,23],[19,27],[11,34],[13,38],[20,36],[22,41],[12,46],[14,50],[19,47],[21,51]];
      pts.forEach(([x,y])=>A.set(x,y,SIL)); A.set(12,20,SILD); A.set(12,24,SILD); A.set(20,20,SILD); A.set(20,25,SILD); A.set(12,36,SILD); A.set(21,38,SILD); }
    if(has('armlets')){ A.set(8,22,SIL); A.set(24,22,SIL); A.set(8,23,SILD); A.set(24,23,SILD); A.set(9,30,SIL); A.set(23,30,SIL); }
    if(has('crimsonthread')){ A.set(16,30,CRIM); A.set(16,31,CRIM); }
  }; }
Object.assign(SPEAKERS,{ rae:{name:NAMES.rae,col:'#e0a070'}, vesper:{name:'Vesper',col:'#e05a72'}, celandine:{name:'Celandine',col:'#b8c8e0'},
  god:{name:'A stranger',col:'#c8d0e4'} });

/* ── hearts ───────────────────────────────────────────────────────────── */
const LOVE_OF={dean:'rae',sam:'sarah'};
function hearts(){ const I=inv_(); I.hearts=I.hearts||{}; return I.hearts; }
function heart(k,n){ const H=hearts(); H[k]=(H[k]||0)+n; }
const heartOf=k=>hearts()[k]||0;
function trueLove(hero=S.hero){ const k=LOVE_OF[hero]; return heartOf(k)>=3&&!S.flags['love_refused_'+k]; }
function brotherReach(){ const I=inv_(); const other=S.hero==='dean'?'sa':'dl';
  return (I.bond||0)>=1||together()||arcOf(other)>=2||!!S.flags.freed_by_brother; }
const H_=(text,next,k,n,fx={})=>D_(text,next,Object.assign({},fx,{now:()=>{ if(k) heart(k,n); if(fx.now) fx.now(); }}),fx.req);
const R_=(text,next,fx,req)=>D_(text,next,fx,req);

/* Rae: for Dean. For Sam she's a friend who likes his brother. */
DIALOGUE.rae={port:'rae',start:()=>{ const F=S.flags;
    if(!isDean()) return F.rae_met?'s1':'s0';
    if(S.act>=3&&!F.rae3) return 'r3'; if(S.act>=2&&!F.rae2&&F.rae1) return 'r2'; if(!F.rae1) return 'r1'; return 'rz'; },
  nodes:{
  r1:{speaker:NAMES.rae,text:()=>`A tow truck idles at the kerb with its yellow light going round. The woman leaning on it has grease to the elbow and a thermos of coffee she isn’t sharing.\n\n"Rae Calloway. I tow what stops at the town line. Lately that’s a lot." She looks at the Impala. "Sixty-seven? Somebody loves that car."`,
    choices:[H_("“Somebody does. You always work nights?”",'r1b','rae',1),
             H_("“Nice truck. Nicer driver.”",'r1c','rae',0),
             H_("“Stay off the roads after three. I mean it.”",'r1d','rae',1),
             H_("“Federal agents. Move the truck.”",'r1e','rae',-1)]},
  r1b:{speaker:NAMES.rae,text:'"Nights are when cars break. Days they just sit there looking guilty." She pours coffee into the thermos lid and, after a second, hands it to you. "Black. Don’t complain."',choices:[D_('[Drink it.]',null,{flag:'rae1'})]},
  r1c:{speaker:NAMES.rae,text:'She laughs: a real one, surprised out of her. "Does that work? In other towns? Does that actually work?" She’s still smiling when she goes back under the hood.',choices:[D_('“Sometimes.”',null,{flag:'rae1'})]},
  r1d:{speaker:NAMES.rae,text:'"After three." She looks at you for a long moment. "You know something. Okay. I’ll stay off the roads after three, Agent. You owe me a reason."',choices:[D_('“When I have one.”',null,{flag:'rae1'})]},
  r1e:{speaker:NAMES.rae,text:'"Sure thing, Agent." She moves the truck exactly four inches.',choices:[D_('[Leave.]',null,{flag:'rae1'})]},
  r2:{speaker:NAMES.rae,text:()=>`The fog’s in. Rae has three abandoned cars on chains behind the truck and nowhere to take them.\n\n"Road goes grey at the line. I’ve tried four times. So I tow them back here and line them up, like somebody’s coming for them." She looks at you. "Your brother came by. Tall. Worried. He talks about you like you’re a weather system."`,
    choices:[H_("“He worries. It’s his thing. …It’s mostly my fault.”",'r2b','rae',1,{now:()=>arc('dl',1)}),
             H_("“He worries. I handle it.”",'r2c','rae',0),
             H_("“I don’t do this. The talking.”",'r2d','rae',-1)]},
  r2b:{speaker:NAMES.rae,text:'"Huh." She wipes her hands for a long time. "Most guys I meet would’ve made a joke there. I’d have let them." She bumps your shoulder with hers. "Go on. Go be somebody’s weather."',choices:[D_('[Go.]',null,{flag:'rae2'})]},
  r2c:{speaker:NAMES.rae,text:'"Sure you do." Not unkind. She goes back to the chains.',choices:[D_('[Go.]',null,{flag:'rae2'})]},
  r2d:{speaker:NAMES.rae,text:'"Okay." She doesn’t push. That’s worse, somehow.',choices:[D_('[Go.]',null,{flag:'rae2'})]},
  r3:{speaker:NAMES.rae,text:()=>heartOf('rae')>=2?`Rae is sitting on the tow truck’s running board with her coat around her knees. She doesn’t get up.\n\n"People are going quiet. Gus at the feed store just… stopped mid-sentence and went home." She holds out her hand. In it is a tow hook, the little steel kind, on a keyring. "If something gets in your head, say my name. Out loud. I’ll come get you. I tow things. That’s what I do."`
      :`Rae nods at you from the truck. "Still here, Agent. Still towing." She doesn’t say anything else, and you don’t ask her to.`,
    choices:[H_("[Take the keyring.] “Rae. I’ll say it.”",'r3b','rae',1,{req:()=>heartOf('rae')>=2,now:()=>{ addNoteRaw('rae_hook','Rae’s tow hook','A steel tow hook on a keyring. “If something gets in your head, say my name. Out loud. I’ll come get you.”'); }}),
             H_("“When this is over, come with us. One drive. Anywhere.”",'r3c','rae',1,{req:()=>heartOf('rae')>=2}),
             R_("“Don’t wait for me.”",'r3d',{now:()=>{ S.flags.love_refused_rae=true; }},()=>heartOf('rae')>=2),
             R_('[Nod back.]',null,{flag:'rae3'},()=>heartOf('rae')<2)]},
  r3b:{speaker:NAMES.rae,text:'She closes your fingers round it. "Out loud," she says again. "It doesn’t work if you just think it."',choices:[D_('[Keep it.]',null,{flag:'rae3'})]},
  r3c:{speaker:NAMES.rae,text:'"One drive." She thinks about it seriously, which is the nicest thing anyone’s done for you in a while. "Okay. You drive. I pick the music. That’s the deal."',choices:[D_('“That’s the deal.”',null,{flag:'rae3',now:()=>{ S.flags.rae_drive=true; }})]},
  r3d:{speaker:NAMES.rae,text:'"I wasn’t going to." She is, though. You can both tell.',choices:[D_('[Go.]',null,{flag:'rae3'})]},
  rz:{speaker:NAMES.rae,text:'"Still here." The yellow light goes round and round.',choices:[D_('[Leave.]',null)]},
  s0:{speaker:NAMES.rae,text:()=>`"You’re the brother." Rae looks you up and down. "He said you were tall. He undersold it." She tilts the thermos at you. "He talks about you like you hung the moon and then complained about the wiring."`,choices:[D_('“That sounds like him.”',null,{flag:'rae_met'})]},
  s1:{speaker:NAMES.rae,text:()=>trueLove('dean')?'"Tell your brother I’ve still got his hook." She looks away. "He’ll know what that means."':'"Look after him," Rae says. "He won’t let anybody else."',choices:[D_('[Leave.]',null)]},
}};
{ const r=char_('rae',24.4,37.2,{kind:'npc',dialogue:'rae',name:NAMES.rae,h:1.72,face:Math.PI}); r.rae=true; SECTORS.street.entities.push(r); }

/* Sarah: for Sam. Two beats, in front of the ones she already has. */
beat('sarah','sarah_h1',()=>isSam()&&S.act<=2&&S.flags.sarah_met,{
  h1:{speaker:NAMES.sarah,text:()=>`It’s late. Sarah has Pete’s library card on the desk in front of her, squared to the edge, and she isn’t reading anything.\n\n"He never once returned a book on time. Forty years in this town and the library has a file on my brother this thick." She laughs, wet. "Sorry. You came in for ledgers."`,
    choices:[H_('[Sit down across from her.] “Tell me about him. Not the mill. Him.”','h1b','sarah',1),
             H_('“The ledgers can wait.”','h1c','sarah',1),
             H_('“I’m sorry. I do need the ledgers.”','h1d','sarah',0)]},
  h1b:{speaker:NAMES.sarah,text:'She tells you about Pete for twenty minutes: the overdue books, a dog called Federal, how he cried at every film with a horse in it. When she runs out she looks surprised that you’re still there. "Nobody asks that," she says. "They ask how he died."',choices:[D_('“I know. I’m sorry.”',null)]},
  h1c:{speaker:NAMES.sarah,text:'"Can they." She pushes a chair out with her foot. You sit. Neither of you says much. It’s the best hour you’ve had in Oregon.',choices:[D_('[Stay a while.]',null)]},
  h1d:{speaker:NAMES.sarah,text:'"Right. Of course." She gets up for the key. Halfway to the basement door she says, without turning round, "Thanks for coming in at all."',choices:[D_('[Follow her.]',null)]},
},'h1');
beat('sarah','sarah_h2',()=>isSam()&&S.act>=3&&heartOf('sarah')>=1,{
  h2:{speaker:NAMES.sarah,text:()=>heartOf('sarah')>=2?`Sarah meets you at the door with her coat already on.\n\n"I hate not knowing how things end. I read the last page first. Always have." She takes your hand and puts it, very deliberately, flat over her heart, the way you’d swear on something. "So when you go in there, come back and tell me how it ends. That’s all. Don’t make me read the last page."`
      :`Sarah gives you a tired smile from behind the desk. "Whatever you’re doing, Agent. Be careful doing it."`,
    choices:[H_('“I’ll come back and tell you.”','h2b','sarah',1,{req:()=>heartOf('sarah')>=2}),
             R_('“You should leave town. Tonight. Don’t wait for me.”','h2c',{now:()=>{ S.flags.love_refused_sarah=true; }},()=>heartOf('sarah')>=2),
             R_('“Thanks. I will.”',null,null,()=>heartOf('sarah')<2)]},
  h2b:{speaker:NAMES.sarah,text:'"Good." She doesn’t let go of your hand for a while. "If anything gets in your head in there, I’m in your head too. I’ve decided. Say my name and I’ll be loud."',choices:[D_('[Go.]',null,{now:()=>addNoteRaw('sarah_hand','Sarah','“Come back and tell me how it ends.” If anything gets in your head, say her name.')})]},
  h2c:{speaker:NAMES.sarah,text:'"No," she says simply. "I don’t think I will." She goes back to her desk.',choices:[D_('[Go.]',null)]},
},'h2');

/* ── the enchantment ──────────────────────────────────────────────────── */
/* What she wants you to say, from how you're doing. */
function lures(by){ const F=S.flags, b=HEROES[HEROES[S.hero].brother].name, I=inv_(), L=[];
  const lo=S.hp<60, broke=S.cash<60, cold=(I.bond||0)<0, alone=arcOf(S.hero==='dean'?'dl':'sa')<1, wrong=Object.values(I.theory||{}).some(t=>t&&t.ok===false);
  if(by==='vesper'){
    if(lo) L.push('Let her look at the wound. You’ve earned soft hands.');
    if(cold) L.push(`${b} doesn’t need you. She does.`);
    if(broke) L.push('Take what she’s offering. Take all of it.');
    if(F.dean_drank) L.push('One more glass. Then the bottle.');
    if(alone) L.push('Stop carrying it. Put it down here, with her.');
    L.push('Stay.','Kneel.','Yes. Whatever she says, yes.');
  } else {
    if(alone) L.push('Carry it alone. That’s what you’re for.');
    if(wrong) L.push('She has the answer you got wrong. Ask her for it.');
    if(F.sam_blood||F.sam_blood2) L.push('Drink. You know exactly how long a minute is.');
    if(lo) L.push('Lie down in the stacks. Read until you stop.');
    if(cold) L.push(`Forget ${b}. He was always the anchor, never the ship.`);
    L.push('Read the last page.','Give her your real name.','Stay in the quiet with her.');
  }
  return [...new Set(L)].slice(0,3); }
const GLYPH='░▒▓█▚▞▙▛▜▟¦§¤øæ∂∆∇≈≠∞';
const ENTH={on:false};
function scramble(from,to,p){ const n=Math.max(from.length,to.length), out=[];
  for(let i=0;i<n;i++){ const q=p*n*1.25-i; out.push(q>=1?(to[i]||''):q>0?GLYPH[(Math.random()*GLYPH.length)|0]:(from[i]||'')); }
  return out.join(''); }
function startSpell(spell){
  const from=dlg.avail.map(c=>c.text), to=lures(spell.by), n=to.length;
  Object.assign(ENTH,{on:true,by:spell.by,t:0,from,to,n,done:false,spell,rescued:false,rescueShown:false});
  S.flags.thrall_active=true;
  elDlg.classList.add('ench','ench_'+spell.by); sfx('whisper');
}
function spellTick(dt){ if(!ENTH.on||!dlg.open) return; ENTH.t+=dt; const t=ENTH.t;
  const btns=[...elCh.children];
  /* make room for her options */
  if(!ENTH.done) while(btns.length<ENTH.n){ const b=document.createElement('button'); b.className='c'; b.textContent=''; elCh.appendChild(b); btns.push(b); }
  if(!ENTH.done) btns.filter(b=>!b.dataset.rescue).forEach((b,i)=>{ const st=.9+i*.65, p=Math.max(0,Math.min(1,(t-st)/1.15));
    if(i>=ENTH.n){ b.style.opacity=String(1-p); if(p>=1) b.remove(); return; }
    b.textContent=scramble(ENTH.from[i]||'',ENTH.to[i],p); b.classList.toggle('lure',p>0); b.dataset.k=`${i+1}.`; });
  if(!ENTH.done&&t>.9+ENTH.n*.65+1.2) finishSpell();
  if(ENTH.done&&!ENTH.rescueShown&&t>ENTH.doneT+1.2) showRescue();
}
function finishSpell(){ if(ENTH.done) return; ENTH.done=true; ENTH.doneT=ENTH.t;
  const next=ENTH.spell.next;
  dlg.avail=ENTH.to.map(text=>({text,next}));
  [...elCh.children].forEach((b,i)=>{ if(b.dataset.rescue) return; if(i>=ENTH.n){ b.remove(); return; } b.textContent=ENTH.to[i]; b.classList.add('lure'); b.onclick=()=>pickChoice(dlg.avail[i]); });
  elLine.textContent=ENTH.spell.after?ENTH.spell.after():elLine.textContent; }
function rescues(){ const R=[], b=HEROES[HEROES[S.hero].brother].name, love=LOVE_OF[S.hero];
  if(brotherReach()) R.push({text:`[${b}’s voice, from the door] “Hey. HEY. Look at me. Not her. Me.”`,kind:'brother',next:ENTH.spell.brother});
  if(trueLove()) R.push({text:`[Say it out loud.] “${NAMES[love]}.”`,kind:'love',next:ENTH.spell.love});
  return R; }
function showRescue(){ ENTH.rescueShown=true; const R=rescues(); if(!R.length){ say('narr','Nobody comes. You wait for someone to, and nobody does.',3); return; }
  for(const r of R){ const b=document.createElement('button'); b.className='c rescue '+r.kind; b.dataset.rescue='1'; b.textContent=r.text;
    const c={text:r.text,next:r.next,fx:{now:()=>{ ENTH.rescued=r.kind; }}}; dlg.avail.unshift(c); b.onclick=()=>pickChoice(c); elCh.insertBefore(b,elCh.firstChild); }
  [...elCh.children].forEach((b,i)=>b.dataset.k=`${i+1}.`); sfx(R[0].kind==='love'?'bell':'switch'); }
function endSpell(){ ENTH.on=false; S.flags.thrall_active=false; try{ elDlg.classList.remove('ench','ench_vesper','ench_celandine'); }catch(e){} }
/* while the words are changing, your hands aren't yours */
{ const was=pickChoice; pickChoice=function(c){ if(ENTH.on&&!ENTH.done){ S.shake=Math.max(S.shake||0,.15); return; }
    if(ENTH.on&&ENTH.done) endSpell(); return was(c); }; }
{ const was=closeDlg; closeDlg=function(){ if(ENTH.on){ if(!ENTH.done) return; endSpell(); } return was(); }; }
{ const was=showNode; showNode=function(n){ was(n); const nd=n&&dlg.tree&&dlg.tree.nodes[n]; if(nd&&nd.spell) startSpell(nd.spell); }; }
/* the dialogue panel isn't ticked by the world, so the spell keeps its own clock in a browser */
let spellRaf=0; (function spellLoop(){ try{ if(typeof requestAnimationFrame!=='function') return; let last=performance.now();
  const f=now=>{ const dt=Math.min(.05,(now-last)/1000); last=now; if(ENTH.on) spellTick(dt); spellRaf=requestAnimationFrame(f); }; spellRaf=requestAnimationFrame(f); }catch(e){} })();
function spellRun(sec){ for(let t=0;t<sec;t+=.05) spellTick(.05); }   /* tests */

/* ── Vesper ───────────────────────────────────────────────────────────── */
function thrallCost(by){ const F=S.flags; F['thrall_'+by]=true; heart(by,1);
  if(by==='vesper'){ const took=Math.max(0,S.cash-5); S.cash=Math.min(S.cash,5); S.armor=0; S.hp=Math.min(S.hp,35);
    addNoteRaw('lost_vesper','Lost hours','You woke up in the Impala at dawn with your wallet empty and her lipstick on the rear-view mirror: a phone number, and under it, “soon”. $'+took+' gone. You don’t remember any of it, which is the part that frightens you.'); }
  else { const n=S.notes.filter(x=>!['arrive','episode','lost_celandine'].includes(x.id)); const g=n[(Math.random()*n.length)|0];
    if(g){ S.notes=S.notes.filter(x=>x!==g); }
    arc(S.hero==='dean'?'dl':'sa',-1);
    addNoteRaw('lost_celandine','A page missing',`Something is missing from your case file. You can feel the shape of where it was${g?`: something about “${g.title}”`:''}. She took it to read later.`); } }
function freedBy(by,kind){ const F=S.flags; F['freed_'+by]=kind; F['freed_by_'+kind]=true; F['anchor_'+by]=true;
  if(kind==='brother'){ inv_().bond=(inv_().bond||0)+1; arc(S.hero==='dean'?'dl':'sa',1); }
  else heart(LOVE_OF[S.hero],1);
  addNoteRaw('anchor_'+by,by==='vesper'?'Vesper’s ribbon':'Celandine’s bookmark',by==='vesper'
    ?'When she let go she left a red ribbon on the bar, tied in a knot that doesn’t untie. It’s warm. It’s how she holds on to people. Keep it away from your brother.'
    :'A bookmark of grey silk, left in a book you didn’t open. Whatever page it marks, it marks you.'); }
DIALOGUE.vesper={port:'vesper',start:()=>S.flags.vesper_done?'vz':'v0',nodes:{
  v0:{speaker:'A woman at the end of the bar',text:()=>`Red coat. She’s drinking exactly what you’d drink, and there’s a second glass poured beside hers that nobody has touched.\n\n"You look like a man who just found out something about himself he didn’t want to know." She slides the glass a quarter-inch toward you. "Sit. I don’t bite, unless you’ve had a very long week."`,
    choices:[H_('[Sit.] “It’s been a very long week.”','v1','vesper',1),
             H_('“Who’s the second glass for?”','v1','vesper',0),
             D_('[Leave.]',null)]},
  v1:{speaker:'Vesper',text:()=>`"Vesper." She says it like a door unlocking. "And the glass is for whoever sits down. Tonight, that’s you."\n\nUp close she smells like rain on hot asphalt, which is the smell of every good night you’ve ever had. "You carry everything, don’t you. ${HEROES[HEROES[S.hero].brother].name}. This town. The car. Your father’s voice. Doesn’t your back hurt?"`,
    choices:[H_('“Every day.”','v2','vesper',1),H_('“I’m fine.”','v2','vesper',0),D_('“What are you?”','v2')]},
  v2:{speaker:'Vesper',text:'"Let me take some of it." She puts two fingers on the back of your hand, very lightly, and the room tilts toward her.\n\n"Go on. Tell me what you want to say."',
    choices:[D_('“I should go.”','vt'),D_('“What do you want?”','vt'),D_('“Get your hand off me.”','vt')],
    spell:{by:'vesper',next:'vt',brother:'vb',love:'vl',after:()=>'"There," she says. "Isn’t that easier?"'}},
  vt:{speaker:'—',port:null,text:'You say it. You mean it while you say it.\n\nThen there’s nothing for a long time, and then there’s dawn coming up grey over the Impala’s dashboard.',choices:[D_('[…]',null,{now:()=>{ S.flags.vesper_done=true; thrallCost('vesper'); }})]},
  vb:{speaker:'Vesper',port:'vesper_true',text:()=>`The voice comes from the doorway and goes through the room like a thrown brick. Your hand comes off the bar. The glass is full of something that was never whiskey.\n\nVesper turns her head, and for one frame her face isn’t a face. "Oh," she says to your brother, almost fond. "It’s you. It’s always the other one." She’s gone before the door closes, and there’s a red ribbon on the bar where her hand was.`,
    choices:[D_('[Pick up the ribbon.]',null,{now:()=>{ S.flags.vesper_done=true; freedBy('vesper','brother'); later(.6,()=>say(brother(),'You good? You were saying stuff. Not your stuff.',3)); }})]},
  vl:{speaker:'Vesper',port:'vesper_true',text:()=>`You say it out loud, like she told you to, and in your pocket the tow hook is suddenly cold as January.\n\nVesper flinches as if someone opened a window. "Her?" she says. "You had that, and you sat down with me?" For one frame her face isn’t a face. Then she’s gone, and there’s a red ribbon on the bar.`,
    choices:[D_('[Pick up the ribbon.]',null,{now:()=>{ S.flags.vesper_done=true; freedBy('vesper','love'); later(1,()=>msg('rae','you ok? felt like you said my name. weird. come by the truck')); }})]},
  vz:{speaker:'—',port:null,text:'The stool at the end of the bar is empty. The second glass is still there, still full.',choices:[D_('[Leave it.]',null)]},
}};
THREADS.rae=THREADS.rae||'Rae (tow truck)';
{ const L=SECTORS.lounge; if(L) L.entities.push(npc_('vesper',12.6,3.4,'vesper','A woman at the bar',{h:1.76,face:Math.PI,vesper:true,hidden:true})); }

/* ── Celandine ────────────────────────────────────────────────────────── */
DIALOGUE.celandine={port:'celandine',start:()=>S.flags.celandine_done?'cz':'c0',nodes:{
  c0:{speaker:'A woman in the stacks',text:()=>`After closing. Sarah’s gone home. A woman in grey is reading at the end of the stacks by a light that isn’t plugged into anything, and the book in her lap is the one nobody in Oakhaven has been able to find.\n\n"You’re the one who counts things," she says without looking up. "The dead. The cost. Sit down. I’ve been saving you a page."`,
    choices:[H_('[Sit.] “What book is that?”','c1','celandine',1),H_('“You’re not from here.”','c1','celandine',0),D_('[Leave.]',null)]},
  c1:{speaker:'Celandine',text:()=>`"Celandine." She turns the book so you can see. It is your handwriting. Every page of it. "Everything you ever got wrong, and how to have got it right. You’d like that, wouldn’t you? Never to be wrong again. Never to have to ask anyone."\n\nShe smiles. "Your brother can’t give you that."`,
    choices:[H_('“Show me.”','c2','celandine',1),D_('“Nobody gets that.”','c2'),D_('“Close the book.”','c2')]},
  c2:{speaker:'Celandine',text:'"Just one page." Her finger rests on a line in your own handwriting, and the words begin to swim.\n\n"Read it to me."',
    choices:[D_('“No.”','ct'),D_('“Who are you?”','ct'),D_('[Close the book.]','ct')],
    spell:{by:'celandine',next:'ct',brother:'cb',love:'cl',after:()=>'"See? You already knew what to say."'}},
  ct:{speaker:'—',port:null,text:'You read the page aloud. It is very beautiful. You can’t remember a word of it afterwards, and something is gone from the inside of your head, neatly, like a book lifted off a shelf.',choices:[D_('[…]',null,{now:()=>{ S.flags.celandine_done=true; thrallCost('celandine'); }})]},
  cb:{speaker:'Celandine',port:'celandine_true',text:()=>`Your brother’s hand lands on your shoulder, heavy and warm and completely uninterested in what the book says.\n\nCelandine closes it. "Of course," she says. "The anchor." For one frame she is a shape made of margins. Then the chair is empty, and on the table is a grey silk bookmark.`,
    choices:[D_('[Take the bookmark.]',null,{now:()=>{ S.flags.celandine_done=true; freedBy('celandine','brother'); later(.6,()=>say(brother(),'Whatever she was selling. Don’t buy it. Not from her.',3)); }})]},
  cl:{speaker:'Celandine',port:'celandine_true',text:()=>`"${NAMES.sarah}." You say it out loud. Somewhere, across town, someone is being very loud inside your head.\n\nCelandine winces as if a page tore. "She doesn’t even know the ending," she says, contemptuous and, just for a second, envious. Then the chair is empty, and there’s a grey bookmark on the table.`,
    choices:[D_('[Take the bookmark.]',null,{now:()=>{ S.flags.celandine_done=true; freedBy('celandine','love'); later(1,()=>msg('sarah','i just shouted your name in my kitchen. i don’t know why. are you ok')); }})]},
  cz:{speaker:'—',port:null,text:'The reading light is off. The book is gone. Your handwriting is not on anything here.',choices:[D_('[Leave.]',null)]},
}};
{ const L=SECTORS.library; if(L) L.entities.push(npc_('celandine',13.4,9.2,'celandine','A woman in the stacks',{h:1.8,face:-Math.PI/2,celandine:true,hidden:true})); }

/* who shows up, and when */
INV_UPDATES.push(()=>{ const F=S.flags;
  const v=SECTORS.lounge&&SECTORS.lounge.entities.find(e=>e.vesper); if(v) v.hidden=!(S.act>=2&&!F.vesper_done);
  const c=SECTORS.library&&SECTORS.library.entities.find(e=>e.celandine); if(c) c.hidden=!(S.act>=3&&!F.celandine_done);
  const r=SECTORS.street.entities.find(e=>e.rae); if(r) r.hidden=S.act>=4;
  if(S.act>=2&&!F.vesper_hint&&F.delia_done){ F.vesper_hint=true; later(30,()=>msg('marla','there’s a woman at the velvet hour every night. red coat. she asked about you. by name. both names')); }
  if(S.act>=3&&!F.celandine_hint){ F.celandine_hint=true; later(40,()=>msg('sarah','someone’s been in the stacks after closing. the lights are on when i get in. nothing taken. one book always open')); } });
/* the car notices */
{ const was=impalaTalk; impalaTalk=function(){ const F=S.flags;
    if(F.thrall_vesper&&!F.car_thrall_v){ F.car_thrall_v=true; [[brother(),'Where were you last night?'],[S.hero,'Bar.'],[brother(),'All night?'],[S.hero,'…Yeah. I think so.']].forEach(([w,t],i)=>say(w,t,null,{now:i===0})); return; }
    if(F.thrall_celandine&&!F.car_thrall_c){ F.car_thrall_c=true; [[brother(),'You forgot something. I can tell. You keep reaching for it.'],[S.hero,'I don’t know what it was.'],[brother(),'Then I’ll remember it for you. Tell me later.']].forEach(([w,t],i)=>say(w,t,null,{now:i===0})); return; }
    was(); }; }
/* epilogue */
{ const was=epilogue; epilogue=function(k){ const E=was(k); if(k==='D') return E; const F=S.flags;
    if(F.rae3&&trueLove('dean')) E.lines.push(F.rae_drive?'Rae Calloway rode shotgun as far as Boise. She picked the music. Nobody complained, which is how you knew.':'Rae Calloway still has a tow hook on her keyring that doesn’t match her truck.');
    if(trueLove('sam')) E.lines.push('Somebody came back and told Sarah Lindqvist how it ended. She made him tell it twice.');
    if(F.thrall_vesper||F.thrall_celandine) E.lines.push('Some nights there’s a red ribbon, or a grey bookmark, where nobody left one. Neither brother mentions it to the other.');
    return E; }; }
