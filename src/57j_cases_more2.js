/* ═══ Seven more cases, continued ═══════════════════════════════════════════ */

/* ═══ 13 · The Contract Nobody Signed ═════════════════════════════════════
   A chain of ordinary paperwork ends in a blank page with a crossroads
   stamp, and a demon who was only ever told to collect. */
{ const st=SECTORS.street, g=st.grid; box(g,1,41,5,44,'W'); g[42][5]='+';
  st.doors['5,42']={to:'naomi',x:5.6,y:3.5,a:Math.PI}; st.pois.push({x:5.5,y:42.5,name:'Price’s Hardware',kind:'door'}); pack(st); }
{ const s=room('naomi','Price’s Hardware',8,7,'W',.28,'o'); s.ceilH=1.35; rect(s.grid,1,1,6,1,'K');
  s.grid[3][7]='+'; s.doors={'7,3':{to:'street',x:6.6,y:42.5,a:0}}; s.spawn={x:5.6,y:3.5,a:Math.PI};
  s.lights=[{x:4,y:3,p:1.3,f:.25}]; s.pois=[{x:7.5,y:3.5,name:'Out',kind:'door'}];
  s.entities=[npc_('naomi',2.4,3.4,'naomi','Naomi Price',{h:1.72,face:0}),{kind:'prop',m:'counter',x:3.4,y:4.6,r:.45,h:.85},
    use_('paper',3.4,4.5,'ct_receipts','A spike of receipts',{z:.5,h:.3}),use_('paper',1.4,5.6,'ct_lease','The shop lease, in a frame',{z:.6,h:.35}),
    npc_('collector',5.2,2.5,'collector','A man in a good suit',{h:1.85,hidden:true,collector:true,face:Math.PI/2})];
  addSector(s); }
const CT_DOCS={
  lease:['The shop lease','LEASE, 1962. Tenant: H. Price, hardware. Clause 9: the tenant assumes all obligations attaching to the premises under any prior instrument (see Transfer of Debt, county archive, ref. 62/114).'],
  debt:['A transfer of debt','TRANSFER OF DEBT, 1962. The debts of the former occupant are assigned to the tenant of 3 Main Street, in perpetuity. Clause 4: employment obligations survive (see Contract of Employment, Oak Rest Motel, guest records).'],
  employ:['A contract of employment','CONTRACT OF EMPLOYMENT, Oakhaven Mill & Timber, 1951, between the Company and A. Price, night shift. Clause 12: the employee’s estate is insured against loss (see Policy 0114, held at Earl’s, as collateral).'],
  policy:['An insurance policy','POLICY 0114. Insured: the estate of A. Price and all successors. Beneficiary: “as stamped.” Clause 1: premiums are payable in kind. The beneficiary page is in the mill office safe.'],
  blank:['A blank page','A sheet of good paper, completely blank except for a stamp in purple ink: a circle with a crossroads in it, and C.H. Under the stamp, almost too faint to see, someone has started to write a name, and stopped after the C.'],
};
SECTORS.library.entities.push(use_('paper',9.6,1.4,'ct_debt','Archive ref. 62/114',{z:.6,h:.3,hidden:true,ctDoc:'debt'}));
SECTORS.motel.entities.push(use_('paper',5.6,6.2,'ct_employ','Old guest records, 1951',{z:.55,h:.3,hidden:true,ctDoc:'employ'}));
SECTORS.pawn.entities.push(use_('paper',2.2,3.6,'ct_policy','Collateral: Policy 0114',{z:.5,h:.3,hidden:true,ctDoc:'policy'}));
SECTORS.mill.entities.push(use_('cabinet',25.4,2.2,'ct_blank','The office safe',{r:.3,h:1,hidden:true,ctDoc:'blank'}));
const CT_NEXT={lease:'debt',debt:'employ',employ:'policy',policy:'blank'};
for(const k of Object.keys(CT_DOCS)) USES['ct_'+k]=()=>{ S.flags['ct_'+k]=true; menu_(CT_DOCS[k][0],CT_DOCS[k][1]);
  const n=CT_NEXT[k]; if(n) for(const sec of Object.values(SECTORS)) for(const e of sec.entities) if(e.ctDoc===n) e.hidden=false;
  if(k==='blank'){ const c=SECTORS.naomi.entities.find(e=>e.collector); if(c) c.hidden=false; later(1,()=>msg('marla','naomi just called. there is a man in her shop in a suit. he says he is here to collect')); } };
USES.ct_receipts=()=>{ S.flags.ct_receipts=true; menu_('Receipts','Every morning this month, something gone from the shelves and a receipt in its place. TRANSFERRED: one claw hammer. TRANSFERRED: twelve brass hinges. Then:\n\nTRANSFERRED: the memory of your mother’s kitchen.\nTRANSFERRED: the year you were seven.\nTRANSFERRED: the sound of your own voice (partial).\n\nBuyer: as stamped.'); };
Object.assign(DIALOGUE,{
  naomi:{ port:'naomi', start:()=>S.flags.ct_naomi?'n9':'n0', nodes:{
    n0:{speaker:'Naomi Price',text:"She talks quietly, then louder, then quietly again, as if she can’t hear how loud she is.\n\n\"I never made a deal. I want that clear. I sell hinges. I go to church at Christmas. I have never, ever stood at a crossroads at midnight and asked for anything.\" She pushes the receipts at you. \"So why am I paying?\"",
      choices:[D_("Who owned the shop before you?",'n1'),D_("[Dean] Somebody always signed something.",'n1')]},
    n1:{speaker:'Naomi Price',text:"\"My dad. And his dad before that, Arthur. Arthur worked nights at the mill when it opened.\" She frowns. \"The lease is in the frame. Dad said never take it down.\"",
      choices:[D_("[Leave her be.]",null,{flag:'ct_naomi',now:()=>{ for(const e of SECTORS.naomi.entities) if(e.use==='ct_lease') e.hidden=false; }})]},
    n9:{speaker:'Naomi Price',text:"\"I can’t remember what my mother sounded like. I could yesterday.\"",choices:[D_("[Leave.]",null)]},
  }},
  collector:{ port:'collector', start:'k0', nodes:{
    k0:{speaker:'The collector',text:"Black eyes, a good suit, a clipboard. He is very polite and very tired.\n\n\"The paperwork is binding. Please don’t make me explain the paperwork. I didn’t negotiate it. I was assigned it. If I don’t collect, I’m collected.\" He glances at the window, at the fog. \"I don’t know who the beneficiary is. The stamp is the beneficiary. Nobody I know has ever seen the person behind the stamp.\"",
      choices:[D_("Who assigned you?",'k1'),D_("[Dean] I’ve got a knife that says you can stop collecting.",'k2',null,isDean),D_("[Sam] Then we can make a trade.",'k3',null,isSam)]},
    k1:{speaker:'The collector',text:"\"Someone who was assigned it by someone. It goes up and up. Usually it stops at the King. This one doesn’t stop. It goes past him.\" He looks genuinely frightened. \"Hell has rules. This isn’t Hell.\"",choices:[D_("…",'k4',{flag:'ct_above'})]},
    k2:{speaker:'The collector',text:"\"Then I’m dead and somebody else gets the clipboard by morning.\" He doesn’t flinch. \"Destroying me doesn’t destroy the obligation. Ask your friend in the coat.\"",choices:[D_("…",'k4',{flag:'ct_above'})]},
    k3:{speaker:'The collector',text:"\"A trade.\" Something like hope. \"Evidence. Paper. Anything that proves who the original party was. My superiors would take that in lieu. They’d like to know as much as you would.\"",choices:[D_("…",'k4',{flag:'ct_above'})]},
    k4:{speaker:'The collector',text:"\"So. You have the chain. You can break it, trade it, or burn it. Whichever you choose, I’ll be filing a report.\"",
      choices:[D_("Break the chain. Destroy the original instrument, Arthur Price’s contract.",null,{now:()=>contractEnd('break')}),
               D_("Negotiate. The chain for Naomi’s release.",null,{now:()=>contractEnd('trade')}),
               D_("Burn all of it. Here. Now.",null,{now:()=>contractEnd('burn')})]},
  }},
});
function contractEnd(k){ decide('contract',k); const F=S.flags, c=SECTORS.naomi.entities.find(e=>e.collector);
  if(c) later(.4,()=>{ c.dead=true; spawnParts(c.x,c.y,1,20,PCOL.smoke,{up:2}); });
  if(k==='break'){ F.contract_broken=true; F.contract_shifted=true;
    later(1,()=>{ say('narr','Arthur Price’s 1951 contract tears like wet cloth. Naomi takes a breath, and says “Oh, Mom,” in a voice she hasn’t had for a month.',5,{now:true});
      later(6,()=>msg('marla','sarah at the library found a receipt on her desk this morning. TRANSFERRED: one library card (Pete’s). she says the archive lease has a clause 9 too')); }); }
  if(k==='trade'){ F.contract_traded=true; later(1,()=>say('narr','He takes the chain of papers and signs a release in green ink, and the receipts on Naomi’s spike go blank one by one. “I’ll make sure the King hears where these came from,” he says. “He’ll want to.”',6,{now:true})); }
  if(k==='burn'){ F.contract_burned=true; sfx('flare'); later(1,()=>say('narr','Lease, debt, contract, policy, the blank page. They burn green. The collector watches politely. “The collection stops,” he says. “The obligation is still there. Burning a contract doesn’t burn what it describes.”',6.5,{now:true})); }
  later(7,()=>closeCase('contract')); }
INV_UPDATES.push(()=>{ const F=S.flags; if(F.ct_lead||S.act!==2||!F.delia_done||S.cut) return; if(!F.ct_nudge){ F.ct_nudge=S.time; return; }
  if(S.time-F.ct_nudge>170){ F.ct_lead=true; msg('marla','naomi price at the hardware store says she is being charged for things she never bought. her receipts list memories. south end of main, past my lot'); } });
/* Crowley, later, has looked for the original */
{ const C=DIALOGUE.crowley_iv.nodes.c0, t=C.text; C.text=()=>(typeof t==='function'?t():t)+(caseClosed('contract')?"\n\nThen, without being asked: \"I looked for your hardware woman’s original instrument. In my own records. In the old records. It isn’t there. Somebody is issuing paper with my stamp that isn’t mine.\" He straightens a cuff. \""+(S.flags.contract_traded?"Thank you for the chain, by the way. My collector filed it. It’s the only proof I’ve got.":"I would have liked that chain.")+"\"":""); }
PEOPLE.push({flag:'ct_naomi',look:'naomi',name:'Naomi Price',line:'Price’s Hardware. Never made a deal.'});
defCase({ id:'contract', n:46, kicker:'Act II · Case 13 (optional)', title:'The Contract Nobody Signed', open:()=>!!S.flags.ct_lead,
  summary:()=>caseClosed('contract')?'Hell’s paperwork is real. It isn’t the highest authority in Oakhaven.':'Naomi Price is being billed, item by item and then memory by memory, under a contract she never signed.',
  clues:{
    receipts:{t:'The receipts',k:'record',x:'Hinges, a hammer, then “the year you were seven.” Buyer: as stamped.',have:F_('ct_receipts')},
    naomi:{t:'Naomi Price',k:'talk',x:'“I never made a deal.” Her grandfather Arthur worked nights at the mill.',who:'Naomi Price',have:F_('ct_naomi')},
    lease:{t:'Clause 9',k:'doc',x:'The tenant assumes all obligations under any prior instrument.',have:F_('ct_lease')},
    debt:{t:'In perpetuity',k:'doc',x:'Debts assigned to the tenant of 3 Main Street forever. Employment obligations survive.',have:F_('ct_debt')},
    employ:{t:'A. Price, night shift, 1951',k:'doc',x:'Contract of employment with the mill. The estate is insured.',have:F_('ct_employ')},
    policy:{t:'Policy 0114',k:'doc',x:'Premiums payable in kind. Beneficiary: “as stamped.”',have:F_('ct_policy')},
    blank:{t:'The blank page',k:'doc',x:'A crossroads stamp, C.H. A name begun and stopped after the C.',have:F_('ct_blank')},
    collector:{t:'The collector',k:'talk',x:'“It goes past the King. This isn’t Hell.”',have:F_('ct_above')},
  },
  links:[
    {id:'inherited',a:'naomi',b:'lease',t:'Inherited, not signed',x:'Naomi never consented. She inherited a clause that inherited a clause. The chain only needs one signature at the bottom, decades ago.',dean:'Grandpa signed. She pays.',sam:'Consent is optional if you write it carefully enough.'},
    {id:'chain',a:'debt',b:'policy',t:'Each clause points to the next',x:'Lease to debt to employment to insurance. Ordinary paperwork, every link, until the last.',dean:'It’s paperwork all the way down.',sam:'Nothing here is supernatural except where it ends.'},
    {id:'stamp',a:'blank',b:'collector',t:'Past the King',x:'The beneficiary is a stamp and a C. Even Hell’s collectors don’t know who stands behind it.',dean:'Crowley’s stamp, and Crowley doesn’t know.',sam:'Hell is a subcontractor here.',opens:'something to ask Crowley'},
    {id:'zero',a:'policy',b:'receipts',t:'0114',x:'The policy number is the number that has been texting you. The bills are being paid in the same currency the farm harvests: what makes a life feel like yours.',dean:'Oh, come on. Oh one one four.',sam:'Every thread goes to the same number.'},
  ],
  theory:{q:'Who holds Naomi’s contract?',reward:25,
    opts:[{id:'naomi',t:'Naomi. She made a deal and doesn’t remember it.'},{id:'crowley',t:'Crowley. It’s his stamp.'},{id:'above',t:'Someone above Hell, collecting through a clause inherited from a previous owner.',ok:true}],
    right:'An inherited clause, collected by a demon who was only ever assigned it, for a beneficiary nobody in Hell has seen.',wrong:'Crowley’s stamp, not Crowley’s contract. The chain goes past him.'},
  talk:()=>[[brother(),isDean()?'You don’t negotiate with these things.':'If it’s paperwork, we can read it. That’s our advantage.'],[S.hero,isDean()?'Sometimes you do, if it gets her voice back.':'Or we can burn it. Paper burns.']],
  autopsy:()=>{ const d=caseDecision('contract');
    return { what:['Naomi Price was billed for memories under a contract signed by her grandfather in 1951 and passed down by a clause in a lease.',
        d==='break'?'You destroyed the original instrument. Naomi got her voice back. Sarah Lindqvist got a receipt.':d==='trade'?'You traded the chain for her release. Crowley’s collector filed it.':'You burned the paperwork. The collector said the obligation remains.'],
      cause:['Ordinary agreements, each referencing the next, ending in a blank page with a crossroads stamp.','A demon assigned to collect, for a beneficiary above the hierarchy he knows.'],
      open:['Who started writing a name after the C, and why they stopped.',d==='break'?'Who inherits next.':'Whether burning the paper burned the debt.','Policy 0114.'],
      dean:'Contracts are just guns that take longer.',sam:'Nobody signed for her. That should mean something, legally. It doesn’t, here.' }; },
  paper:()=>({ head:'HARDWARE OWNER “BILLED FOR MEMORIES”',deck:'Naomi Price: “I sell hinges.”',by:'C. S.',
    body:['Naomi Price, owner of Price’s Hardware on Main Street, says that for the past month she has woken each morning to find an item missing from her shelves and a receipt in its place.','The receipts have recently listed “the memory of your mother’s kitchen” and “the year you were seven.” Mrs. Price says she has never entered into any agreement “of that kind.”',
      caseDecision('contract')==='break'?'On Saturday, Mrs. Price told the Ledger she could remember her mother’s voice again. On Sunday, the library’s librarian reported a receipt of her own.':'Mrs. Price’s receipts are now blank.','A lease on the premises from 1962 is held at the county archive. The Ledger has read Clause 9. The Ledger recommends that readers read theirs.'] }),
  forum:()=>[{u:'naomi.price.hardware',t:'Open as usual. Hinges in stock.'},{u:'sarah.l',t:caseDecision('contract')==='break'?'can anyone tell me what clause 9 means':'.'},{u:'crossroads_holdings_official',t:'Crossroads Holdings has no comment and no affiliation with any blank pages.'},{u:'0114',t:'that is my number'}],
});
CASES.lockdown.clues.collector={t:'The collector',k:'talk',x:'“Usually it stops at the King. This one doesn’t stop.”',have:F_('ct_above')};
CASES.lockdown.links.push({id:'pasthell',a:'collector',b:'signatory',t:'Past Hell',x:'Crowley named C. Shurley as signatory. Crowley’s own collector says the chain goes past Hell. Crossroads is a subcontractor all the way up.',dean:'Crowley’s got a boss.',sam:'And the boss has an admin.'});

/* ═══ 14 · The Saint in the Walls ═════════════════════════════════════════ */
function stjude(){
  const s=rmt('stjude','St. Jude’s Chapel',22,18,{spawn:{x:11,y:15.6,a:-Math.PI/2},amb:.34});
  const g=s.grid; box(g,5,2,16,11,'C'); g[11][11]='+'; g[2][10]='X'; rect(g,6,3,15,10,'o');
  s.doors={'11,11':{to:'stjude_in',x:5.5,y:8.6,a:-Math.PI/2}};
  s.lights=[{x:11,y:12.4,p:1.4,f:.3}]; s.pois=[{x:11.5,y:11.5,name:'The chapel',kind:'door'}];
  s.entities=[impala_(16,15.6,Math.PI),{kind:'prop',m:'cross',x:4.2,y:13,r:.15,h:1.6},{kind:'prop',m:'tree',x:2.5,y:6,r:.3,h:4},
    npc_('ned',8.6,13,'ned','Ned Bowles',{h:1.76,face:-Math.PI/2})];
  return s; }
function stjudeIn(){
  const s=room('stjude_in','St. Jude’s — inside',11,10,'C',.2,'o'); s.ceilH=2; s.region='stjude';
  s.grid[9][5]='+'; s.doors={'5,9':{to:'stjude',x:11.5,y:12.6,a:Math.PI/2}}; s.spawn={x:5.5,y:8.6,a:-Math.PI/2};
  s.lights=[{x:5.5,y:2,p:1.5,f:.24},{x:2,y:6,p:.8,f:.4}]; s.pois=[{x:5.5,y:9.5,name:'Out',kind:'door'}];
  s.entities=[{kind:'prop',m:'pew',x:3.2,y:5.4,r:.55,h:.75},{kind:'prop',m:'pew',x:7.8,y:5.4,r:.55,h:.75},{kind:'prop',m:'altar',x:5.5,y:1.8,r:.8,h:.9},
    use_('mural',9.6,3,'sj_mural','The mural of St. Jude',{r:.2,h:1.5,z:.2}),
    npc_('curtis',3,7.2,'curtis','Curtis Kemp',{h:1.8,face:-Math.PI/2}),
    {kind:'prop',m:'stain',x:1.3,y:7.2,r:.05,h:.9,z:.4,hidden:true,sjStain:'curtis'},{kind:'prop',m:'stain',x:1.3,y:3,r:.05,h:.9,z:.5},
    use_('paper',5.5,1.7,'sj_book','A ritual book on the altar',{z:.6,h:.25})];
  return s; }
[stjude(),stjudeIn()].forEach(addSector);
defDest({id:'stjude',name:'St. Jude’s Chapel (out past the mill road)',sector:'stjude',x:11,y:15.6,a:-Math.PI/2,avail:()=>!!S.flags.sj_lead&&S.act===2,note:()=>caseClosed('saint')?'case closed':'the walls'});
USES.sj_mural=()=>{ S.flags.sj_mural=true;
  menu_('Behind the mural',"The plaster around St. Jude is soft with damp. Behind it, a cavity, and in the cavity a biscuit tin of letters, sixty years of them, all addressed to “Father” and none of them sent.\n\n“I signed the second inspection. I knew.” — F.D., 1998.\n“They gave me two hundred dollars to say nothing about line three. I said nothing.” — C.K.\n“I have stolen. I have lied. I have kept my job.” — unsigned, many times.\n\nAnd one from a priest, to whoever came after him: “Confession absolves. It does not require restitution. Do not let them tell you otherwise. It would empty the pews.”"); };
USES.sj_book=()=>{ S.flags.sj_book=true; menu_('The ritual book','A parish rite for “the binding of witness to wall.” Old, local, in a careful copperplate. Page 14 has been cut out with a razor, close to the spine.\n\nIn the margin of page 15, in a newer hand you have seen before on candle-boxes at St. Brendan’s: “Too dangerous to keep. Too dangerous to burn. — A.”'); };
Object.assign(DIALOGUE,{
  ned:{ port:'ned', start:()=>S.flags.sj_ned?'n9':'n0', nodes:{ n0:{speaker:'Ned Bowles — caretaker',text:"\"Water damage. It’s water damage. Roof’s been bad since ’88.\" He hasn’t looked at the walls once since you got out of the car. \"People come at night now. I don’t know why. They sit, they get up, they go. Father Alistair asked you to come, did he? He’s a kind man. He asked me to keep the chapel quiet.\"",
    choices:[D_("[Leave him.]",null,{flag:'sj_ned'})]}, n9:{speaker:'Ned Bowles',text:"\"Water damage.\"",choices:[D_("[Leave.]",null)]} }},
  curtis:{ port:'curtis', start:()=>S.flags.sj_curtis?'c9':'c0', nodes:{
    c0:{speaker:'Curtis Kemp',text:"An orange hi-vis vest, line two. He’s sitting in the back pew with his cap in his hands.\n\n\"I’ve never been in here before tonight. Never. I just wanted somewhere to sit.\"",
      choices:[D_("Never? Not once?",'c1'),D_("[Leave him.]",null)]},
    c1:{speaker:'—',port:null,text:"\"Never,\" he says.\n\nOn the wall behind his head, slowly, a dark line draws itself out of the plaster: four fingers and a thumb, a hand pressed flat, red-brown, the way a hand looks when it’s been on a wall a long time.\n\nHe doesn’t turn around. He doesn’t have to.",
      choices:[D_("Somebody paid you to say nothing about line three.",'c2',{now:()=>{ const s=SECTORS.stjude_in.entities.find(e=>e.sjStain==='curtis'); if(s) s.hidden=false; S.flags.sj_stain=true; }})]},
    c2:{speaker:'Curtis Kemp',text:"His face goes through three things and lands on the fourth.\n\n\"Two hundred dollars. 1998. Frank came to me and said Delaware wants you quiet, and I was quiet. I came here and wrote it down and put it in the wall like everybody did, and Father said that was enough, and I believed him because I wanted to.\" He looks at the stain. \"It wasn’t enough. Was it.\"",
      choices:[D_("[Leave him with it.]",null,{flag:'sj_curtis'})]},
    c9:{speaker:'Curtis Kemp',text:"\"It wasn’t enough.\"",choices:[D_("[Leave.]",null)]},
  }},
});
function saintEnd(k){ decide('saint',k); const F=S.flags;
  if(k==='reveal'){ F.saint_revealed=true; menu_('The letters','You take the tin to the sheriff, all of it: Frank’s line, Curtis’s two hundred dollars, the priest who told them confession was enough, and the razored page with Alistair’s initial in the margin. The walls at St. Jude’s go quiet. Some people in town won’t look at you now.'); trust('curtis',-1); }
  if(k==='rest'){ F.saint_rested=true; sfx('rite'); later(1,()=>sfx('riteEnd')); menu_('The rite','The stains fade from the plaster like breath from glass. The letters stay in their tin, behind St. Jude, where nobody will read them. The haunting ends. So does the only record of what some of these people did.'); }
  if(k==='keep'){ F.saint_kept=true; menu_('The testimony','You take the letters to the sheriff’s station and leave the chapel as it is. By morning there is a hand-shaped stain on the wall behind the evidence locker. By the next night, two.');
    const st=SECTORS.station; if(st) st.entities.push({kind:'prop',m:'stain',x:13.6,y:6.4,r:.05,h:.9,z:.4}); }
  later(1,()=>closeCase('saint')); }
INV_UPDATES.push(()=>{ const F=S.flags; if(caseDecision('saint')||F.saint_asked||!S.sector.id.startsWith('stjude')||dlg.open) return;
  if(!(F.sj_mural&&F.sj_book&&F.sj_curtis)) return; F.saint_asked=true;
  later(1.2,()=>openMenu('St. Jude’s','The tin of letters is under your arm. The stain behind Curtis is still drying.',[
    {text:'Reveal the confessions. All of them, Alistair’s page too.',note:'the town will know',act:()=>saintEnd('reveal')},
    {text:'Lay the dead to rest. End the haunting.',note:'the crimes stay unproven',act:()=>saintEnd('rest')},
    {text:'Preserve the testimony with the sheriff. Leave the chapel be.',note:'the stains will follow',act:()=>saintEnd('keep')}])); });
INV_UPDATES.push(()=>{ const F=S.flags; if(F.sj_lead||S.act!==2||!F.kevin_done||S.cut) return; if(!F.sj_nudge){ F.sj_nudge=S.time; return; }
  if(S.time-F.sj_nudge>200){ F.sj_lead=true; THREADS.parish='St. Brendan’s parish office';
    msg('parish','Father Alistair would be grateful if the visiting gentlemen could look in on St. Jude’s chapel, past the mill road. People have begun gathering there at night. He says he would go himself but he has a great many candles to light.'); } });
/* Alistair, in Act III, about the page */
DIALOGUE.alistair.nodes.a1.choices.push(D_("You cut a page out of St. Jude’s ritual book.",'a_page',null,()=>!!S.flags.sj_book));
DIALOGUE.alistair.nodes.a_page={speaker:'Father Alistair',text:"He stops lighting candles, which is the first time you have seen him stop.\n\n\"Page fourteen. The binding of witness to wall.\" He sets the taper down. \"It makes a confession impossible to bury. I read it when I was thirty and I thought: this would destroy every family in this town. So I took it.\n\nYou see the shape of me now, don’t you. I have spent my whole life deciding which truths people were strong enough to hold. The thing in the fog is only the largest of those decisions.\"",
  choices:[D_("…",'a2',{flag:'alistair_page'})]};
defCase({ id:'saint', n:48, kicker:'Act II · Case 14 (optional)', title:'The Saint in the Walls', open:()=>!!S.flags.sj_lead,
  summary:()=>caseClosed('saint')?'Walls that bleed when someone denies a harm they knew they caused.':'Father Alistair has asked you to look in on St. Jude’s, an abandoned chapel past the mill road. People sit there at night. The walls are stained.',
  clues:{
    letter:{t:'The parish letter',k:'doc',x:'Father Alistair asked you to come. He asked the caretaker to keep the chapel quiet.',have:F_('sj_lead')},
    ned:{t:'Ned Bowles',k:'talk',x:'“Water damage.” He never looks at the walls.',who:'Ned Bowles',have:F_('sj_ned')},
    curtis:{t:'Curtis Kemp',k:'talk',x:'“I’ve never been in here.” Then: two hundred dollars, 1998, to stay quiet about line three.',who:'Curtis Kemp',have:F_('sj_curtis')},
    stain:{t:'A hand on the wall',k:'place',x:'It drew itself behind Curtis the moment he denied it.',have:F_('sj_stain')},
    letters:{t:'Sixty years of letters',k:'doc',x:'Confessions to “Father,” never sent. F.D., 1998: “I signed the second inspection. I knew.”',have:F_('sj_mural')},
    book:{t:'Page fourteen',k:'doc',x:'The binding of witness to wall, cut out with a razor. “Too dangerous to keep. Too dangerous to burn. — A.”',have:F_('sj_book')},
    notebook:{t:'Dwyer’s notebook',k:'doc',x:'“I signed the inspection because they told me the air was clean.”',have:F_('dw_notebook')},
  },
  links:[
    {id:'denial',a:'curtis',b:'stain',t:'Not every lie',x:'The walls don’t bleed for every lie. They bleed when someone denies a harm they knowingly caused.',dean:'It’s a lie detector with a very specific setting.',sam:'It’s not judging. It’s refusing to let the testimony be buried.'},
    {id:'frank',a:'letters',b:'notebook',t:'Frank wrote it twice',x:'Frank Dwyer confessed in his notebook and in the wall. The chapel was where mill workers came to say what they couldn’t say anywhere else, and to be told that saying it was enough.',dean:'Everybody knew. Everybody wrote it down. Nobody did anything.',sam:'Confession instead of restitution. That was the whole system.'},
    {id:'alistair',a:'book',b:'letter',t:'He took the page',x:'Alistair removed the rite that makes confessions impossible to bury, then asked you to come and look. He has been deciding which truths people can hold for a long time.',dean:'He sent us here. Why would he send us here?',sam:'Because he wanted somebody else to find it. Or to decide.',opens:'something to say to Father Alistair'},
    {id:'quiet',a:'ned',b:'letter',t:'Keep the chapel quiet',x:'The caretaker was asked to keep it quiet by the man who asked you to investigate it. Both things are true of Alistair at once.',dean:'Guy plays both sides of everything.',sam:'He wants it known and not known. Like the rest of them.'},
  ],
  theory:{q:'What is making the walls bleed?',reward:25,
    opts:[{id:'god',t:'Divine judgement on liars.'},{id:'water',t:'Water damage and a guilty imagination.'},{id:'witness',t:'The dead, refusing to let testimony be buried, bound to the walls by a rite somebody tried to remove.',ok:true}],
    right:'Not judgement. Testimony that won’t stay buried, held by a rite whose instructions were razored out.',wrong:'There’s nothing divine about it, and it isn’t water. The walls remember what people confessed.'},
  talk:()=>[[brother(),isDean()?'He asked us here. He’s the one who cut the page. I don’t get him.':'Alistair sent us to find something he hid. I want to know why.'],[S.hero,isDean()?'Maybe he wanted to get caught.':'Maybe he wanted someone else to decide.']],
  autopsy:()=>{ const d=caseDecision('saint');
    return { what:['St. Jude’s walls bled behind anyone who denied a harm they knowingly caused. Behind the mural: sixty years of unsent confessions.',
        d==='reveal'?'You revealed all of it, including Alistair’s razored page.':d==='rest'?'You laid the dead to rest and left the letters in the wall.':'You gave the letters to the sheriff. The stains followed them.'],
      cause:['Mill workers came here to confess what they couldn’t report, and a priest told them confession was enough.','A local rite binds witness to wall. Alistair cut it out because he thought the truth would destroy the town.'],
      open:['Why Alistair asked you to come.','How many of the town’s truths he decided it couldn’t hold.',d==='rest'?'The crimes in the wall are unproven now.':'What the stains will do next.'],
      dean:'Everybody signed something. Everybody confessed. Nobody paid.',sam:'He has a precedent. That’s the worst part. His philosophy has a human precedent.' }; },
  paper:()=>({ head:caseDecision('saint')==='reveal'?'ST. JUDE’S LETTERS: MILL WORKERS “PAID TO STAY QUIET”':'ST. JUDE’S CHAPEL: “WATER DAMAGE,” SAYS CARETAKER',deck:'Residents report gathering at the abandoned chapel at night.',by:'Chuck Shurley, contributing writer',
    body:[caseDecision('saint')==='reveal'?'Letters found behind a mural at St. Jude’s describe payments to mill workers in exchange for silence about conditions on line three. One is signed with the initials of the late supervisor Frank Dwyer.':'Ned Bowles, caretaker of St. Jude’s Chapel, attributes stains on the interior walls to a roof that “has been bad since ’88.”',
      'Father Alistair of St. Brendan’s, asked about the chapel, said only that he had “always been fond of St. Jude, patron of lost causes.”','The Ledger’s contributing writer adds that every good church needs a secret in the walls. He considers this one his best work.'] }),
  forum:()=>[{u:'curtis.k',t:'it wasn’t enough'},{u:'ned_bowles',t:'Water damage.'},{u:'st.brendans.parish',t:'Father Alistair thanks everyone for their prayers.'}],
});
CASES.shift.clues.wall={t:'In the wall at St. Jude’s',k:'doc',x:'F.D., 1998: “I signed the second inspection. I knew.” He confessed twice.',have:F_('sj_mural')};
CASES.shift.links.push({id:'twice',a:'wall',b:'notebook',t:'Confessed twice',x:'Frank wrote it under the floorboards and behind a saint. Somebody told him that was enough.',dean:'He wanted someone to find it.',sam:'He wanted to be stopped.'});

/* ═══ 15 · The Children Who Draw the Same Sky ═════════════════════════════ */
function school(){
  const s=rmt('school','Oakhaven Elementary — playground',24,18,{spawn:{x:12,y:15.6,a:-Math.PI/2},amb:.36});
  const g=s.grid; box(g,4,1,19,6,'#'); rect(g,6,6,8,6,'G'); rect(g,15,6,17,6,'G'); g[6][12]='+';
  s.doors={'12,6':{to:'classroom',x:6.5,y:6.4,a:-Math.PI/2}};
  s.lights=[{x:12,y:7.4,p:1.6,f:.24}]; s.pois=[{x:12.5,y:6.5,name:'Classroom',kind:'door'}];
  s.entities=[impala_(19,15.6,Math.PI),use_('stones',8,11,'cs_stones','Stones on the blacktop',{r:.6,h:.12}),{kind:'prop',m:'bench',x:16,y:10,r:.5,h:.8},{kind:'prop',m:'pole',x:3,y:9,r:.18,h:5}];
  return s; }
function classroom(){
  const s=room('classroom','Room 4',13,8,'P',.32,'o'); s.ceilH=1.4; s.region='school';
  s.grid[7][6]='+'; s.doors={'6,7':{to:'school',x:12.5,y:7.6,a:Math.PI/2}}; s.spawn={x:6.5,y:6.4,a:-Math.PI/2};
  s.lights=[{x:6.5,y:3,p:1.6,f:.2}]; s.pois=[{x:6.5,y:7.5,name:'Out',kind:'door'}];
  s.entities=[use_('drawings',2.6,1.2,'cs_d1','Drawings: Tess, 7',{z:.6,h:.5}),use_('drawings',6.5,1.2,'cs_d2','Drawings: Ben, 8',{z:.6,h:.5}),use_('drawings',10.4,1.2,'cs_d3','Drawings: Ana, 6',{z:.6,h:.5}),
    {kind:'prop',m:'desk',x:4,y:4.4,r:.5,h:.6},{kind:'prop',m:'desk',x:9,y:4.4,r:.5,h:.6},
    npc_('delia',11,5.6,'teacher_d','Delia Park',{h:1.75,face:Math.PI,teacher:true})];
  return s; }
function observatory(){
  const s=rmt('observatory','Coos Ridge Observatory',16,14,{spawn:{x:8,y:11.6,a:-Math.PI/2},amb:.3});
  const g=s.grid; box(g,4,2,11,8,'#'); rect(g,5,3,10,7,'c'); g[8][8]='o';
  s.lights=[{x:8,y:5,p:1.2,f:.3}];
  s.entities=[impala_(12.5,11.6,Math.PI),use_('telescope',8,4.2,'cs_scope','The telescope',{r:.3,h:1.4})];
  return s; }
[school(),classroom(),observatory()].forEach(addSector);
SECTORS.observatory.region='observatory';
defDest({id:'school',name:'Oakhaven Elementary',sector:'school',x:12,y:15.6,a:-Math.PI/2,avail:()=>!!S.flags.cs_lead&&S.act===2,note:()=>caseClosed('sky')?'case closed':'the drawings'});
defDest({id:'observatory',name:'Coos Ridge Observatory',sector:'observatory',x:8,y:11.6,a:-Math.PI/2,avail:()=>!!S.flags.cs_obs&&S.act===2&&!caseClosed('sky'),note:()=>'the empty sky'});
const CS={d1:'A black sky, a thin white line across it from the top left, and a small shape above a building with a cross on it. EAST is written very carefully in the corner, spelled EEST.',
  d2:'The same sky. The line is tilted the way a clock’s hand points at one o’clock. Ben has drawn the town underneath, and the streets look like the inside of a radio.',
  d3:'The same sky again. Under it, Ana has written: “where the sky forgets to be sky.” She has drawn three hands, stacked, between the steeple and the shape.'};
for(const k of ['d1','d2','d3']) USES['cs_'+k]=()=>{ S.flags['cs_'+k]=true; menu_('Drawings',CS[k]); if(S.flags.cs_d1&&S.flags.cs_d2&&S.flags.cs_d3&&!S.flags.cs_obs){ S.flags.cs_obs=true; later(1,()=>toast('New destination — Coos Ridge Observatory (Impala)')); } };
USES.cs_stones=()=>{ S.flags.cs_stones=true; menu_('Stones','Fourteen stones in an oval on the blacktop, with a line of chalk through the middle. Somebody has put one dark stone just above the line, three hand-spans up.\n\nThe janitor says nobody admits to it. He has swept them away four times.'); };
const SCOPE={az:0,el:0,rot:0};
USES.cs_scope=()=>{ const A=['North','East','South','West'], E=['15°','40°','65°','90°'], R=['0°','30°','60°','90°'];
  openMenu('The telescope',`It points at an empty piece of sky. Three brass rings: bearing, elevation, rotation.\n\nBearing ${A[SCOPE.az]} · Elevation ${E[SCOPE.el]} · Rotation ${R[SCOPE.rot]}`,[
    {text:'Turn the bearing ring',act:()=>{ SCOPE.az=(SCOPE.az+1)%4; sfx('switch'); USES.cs_scope(); }},
    {text:'Turn the elevation ring',act:()=>{ SCOPE.el=(SCOPE.el+1)%4; sfx('switch'); USES.cs_scope(); }},
    {text:'Turn the rotation ring',act:()=>{ SCOPE.rot=(SCOPE.rot+1)%4; sfx('switch'); USES.cs_scope(); }},
    {text:'Look',act:scopeLook},{text:'Step back'}]); };
function scopeLook(){ const F=S.flags;
  if(SCOPE.az===1&&SCOPE.el===1&&SCOPE.rot===1){ F.cs_aligned=true; sfx('bell');
    menu_('Through the telescope','East, forty degrees, turned to one o’clock. The drawings line up with the sky like a stencil.\n\nThere is nothing there. That’s the point. There is a place above Oakhaven where the stars stop, cleanly, along a line, as if someone has folded the sky and the fold is facing you. You can’t see what’s behind it. You get the strong impression that it can see you.'); }
  else { F.cs_wrong=(F.cs_wrong||0)+1; S.flipped=true; S.glitchA=.6; later(2.2,()=>{ S.flipped=false; });
    menu_('Through the telescope','For a moment the telescope isn’t pointing up. It’s pointing down, at Oakhaven, from a height nothing should be at. The streets are copper traces on a green board. The mill is a component. The church is where the current goes.\n\nThen it’s just sky again, and the wrong patch of it.'); }
}
const TEACH=(port,spk,text)=>({ port, start:()=>S.flags.cs_teacher?'t9':'t0', nodes:{ t0:{speaker:spk,text,choices:[D_("[Leave.]",null,{flag:'cs_teacher'})]}, t9:{speaker:spk,text:"\"Room four. All twelve of them.\"",choices:[D_("[Leave.]",null)]} } });
DIALOGUE.teacher_d=TEACH('delia','Delia Park',"Delia is back in her classroom, a week after being inside a demon, with a lanyard round her neck and her hands not quite steady.\n\n\"I saw it,\" she says, before you can ask. \"When it was inside me. Reflected in this window. That line. That shape. The children have never seen it and they’ve all drawn it.\"");
DIALOGUE.teacher_o=TEACH('okoro','Mr. Okoro — substitute',"\"I’m covering for Ms. Park. I don’t know how to talk to them about it.\" He gestures at the wall. \"Twelve children, twelve drawings, the same sky. None of them sat together. I checked.\"");
SPEAKERS.okoro=SPEAKERS.okoro||{name:'Mr. Okoro',col:'#a8c8a0'};
SECTOR_HOOKS.push(id=>{ if(id!=='classroom') return; const t=SECTORS.classroom.entities.find(e=>e.teacher); if(t){ const k=!!S.flags.delia_killed; t.look=k?'okoro':'delia'; t.name=k?'Mr. Okoro':'Delia Park'; t.dialogue=k?'teacher_o':'teacher_d'; } });
function skyEnd(k){ decide('sky',k); const F=S.flags;
  if(k==='destroy'){ F.sky_destroyed=true; menu_('The drawings','You take them down and burn them in the playground bin. The children will draw them again tomorrow. You know that. It feels like something.'); }
  if(k==='kevin'){ F.sky_kevin=true; menu_('The drawings','You fold twelve drawings into the glovebox, for Kevin. He’s the only person in Oakhaven who might know what grammar they’re written in.'); }
  if(k==='delia'){ F.sky_explained=true; menu_('Room four',(F.delia_killed?'Mr. Okoro':'Delia')+' sits on a desk that’s too small and tells twelve children that sometimes everyone sees the same thing, and it isn’t their fault, and it doesn’t mean anything is going to happen to them. Ana asks if that’s true. The answer is very careful.'); }
  later(1,()=>closeCase('sky')); }
INV_UPDATES.push(()=>{ const F=S.flags; if(caseDecision('sky')||F.sky_asked||!F.cs_aligned||dlg.open) return; F.sky_asked=true;
  later(2,()=>openMenu('The same sky','Twelve drawings of a fold in the sky that nobody in Oakhaven has seen yet. You have.',[
    {text:'Destroy the drawings.',act:()=>skyEnd('destroy')},{text:'Keep them for Kevin.',note:'he reads grammar',act:()=>skyEnd('kevin')},
    {text:'Let the teacher explain it to the children.',act:()=>skyEnd('delia')}])); });
INV_UPDATES.push(()=>{ const F=S.flags; if(F.cs_lead||S.act!==2||!F.delia_done||S.cut) return; if(!F.cs_nudge){ F.cs_nudge=S.time; return; }
  if(S.time-F.cs_nudge>230){ F.cs_lead=true; msg('marla','a teacher at the elementary called the desk asking for you. twelve kids drew the same picture. she sounded scared. the school is on the ridge road'); } });
/* Kevin, in Act IV */
{ const r=DIALOGUE.kevin_iv.nodes.r0, t=r.text; r.text=()=>(typeof t==='function'?t():t)+(S.flags.sky_kevin?"\n\nYou give him the children’s drawings. He looks at them for a long time.\n\n\"That isn’t a map of where it is,\" he says. \"It’s a map of what it can see.\"":""); }
defCase({ id:'sky', n:49, kicker:'Act II · Case 15 (optional)', title:'The Children Who Draw the Same Sky', open:()=>!!S.flags.cs_lead,
  summary:()=>caseClosed('sky')?'Children independently drawing a geometry they can perceive and can’t describe.':'Twelve children in Room 4 have drawn the same black sky, divided by a white line, with a shape above the town. None of them sat together.',
  clues:{
    teacher:{t:()=>S.flags.delia_killed?'Mr. Okoro':'Delia Park',k:'talk',x:()=>S.flags.delia_killed?'Twelve drawings, the same sky. None sat together.':'She saw the shape, reflected, while the demon was inside her.',have:F_('cs_teacher')},
    d1:{t:'Tess, 7',k:'doc',x:'The shape above the church. EEST in the corner.',have:F_('cs_d1')},
    d2:{t:'Ben, 8',k:'doc',x:'The line at one o’clock. The streets like the inside of a radio.',have:F_('cs_d2')},
    d3:{t:'Ana, 6',k:'doc',x:'“Where the sky forgets to be sky.” Three hands between the steeple and the shape.',have:F_('cs_d3')},
    stones:{t:'Stones on the blacktop',k:'place',x:'An oval, a chalk line, a dark stone three hand-spans up. Swept away four times.',have:F_('cs_stones')},
    scope:{t:'The fold',k:'place',x:'East, forty degrees, one o’clock: a place where the stars stop along a line.',have:F_('cs_aligned')},
    wrong:{t:'From too high',k:'place',x:'A wrong setting showed the town from above, laid out like a circuit board.',have:()=>(S.flags.cs_wrong||0)>0},
    tablet:{t:'The tablet',k:'talk',x:'Kevin read it for nine days. It reads like code.',have:F_('kevin_done')},
  },
  links:[
    {id:'bearing',a:'d1',b:'d3',t:'East, above the church',x:'Tess gives the direction, Ana the height: east, above St. Brendan’s, three hands up.',dean:'Kids gave us coordinates.',sam:'They can see it. They just can’t say it.'},
    {id:'angle',a:'d2',b:'stones',t:'One o’clock',x:'Ben’s tilt and the stones agree: the line runs at one o’clock.',dean:'Thirty degrees. Kid’s a surveyor.',sam:'Three independent sources, one geometry.'},
    {id:'circuit',a:'wrong',b:'tablet',t:'Seen from above',x:'From too high, the town looks like a circuit, and the tablet reads like a program. Same structure, different scale. Neither proves the other.',dean:'The town’s a motherboard.',sam:'Same pattern. I don’t know which way the cause runs.'},
    {id:'fold',a:'scope',b:'teacher',t:'What she saw',x:'The fold in the sky is what was reflected in the classroom window while the demon was inside her. It is where the rift will open.',dean:'It’s already there. It’s just not open yet.',sam:'It’s waiting for Act Three. God, I hate that I said that.'},
  ],
  theory:{q:'What are the children drawing?',reward:25,
    opts:[{id:'message',t:'A message. Something is talking to them.'},{id:'copy',t:'Each other. They saw one drawing and copied it.'},{id:'pattern',t:'A geometry they can perceive and can’t describe: the place the sky is folded.',ok:true}],
    right:'Not a message, and not copying. Twelve children who can see the fold, drawing it the only way they can.',wrong:'They never sat together, and nothing is speaking. They are drawing what is there.'},
  talk:()=>[[brother(),'Kids see things grown-ups have learned not to.'],[S.hero,isDean()?'Yeah. Then they grow up.':'Then they learn not to. That’s the whole problem.']],
  autopsy:()=>{ const d=caseDecision('sky');
    return { what:['Twelve children drew the same sky. The telescope on Coos Ridge, aligned to their drawings, found a fold in the stars above the church.',
        d==='destroy'?'You burned the drawings.':d==='kevin'?'You kept the drawings for Kevin.':'The teacher explained it to the children, carefully.'],
      cause:['The children are reproducing a geometry they can perceive but not describe.','Seen from the wrong height, the town is laid out like a circuit, and the tablet reads like a program.'],
      open:['What, behind the fold, can see.','Whether the town’s shape came first, or the tablet.',d==='kevin'?'What Kevin will read in them.':'They will draw it again tomorrow.'],
      dean:'I want to take every one of those kids out of this town.',sam:'They aren’t in danger because they see it. They’re in danger because it’s there.' }; },
  paper:()=>({ head:'ROOM 4 DRAWS “THE SAME SKY”',deck:'Twelve students, one picture. Parents asked not to worry.',by:'C. S.',
    body:['Twelve children in Room 4 at Oakhaven Elementary have produced near-identical drawings of a black sky with a white line across it and a shape above the town.',(S.flags.delia_killed?'Substitute teacher Mr. Okoro':'Delia Park, returning to the classroom this week,')+' said the children did not sit together and had not seen each other’s work.',
      'An amateur astronomer’s logbook at the Coos Ridge Observatory shows a gap in the star charts above Oakhaven going back eleven years.'] }),
  forum:()=>[{u:'oakhaven_hs_parents',t:'my daughter drew it too and she’s homeschooled'},{u:'tyler_k',t:'i can see it from my roof if i squint'},{u:'0114',t:'i drew it in february'}],
});
CASES.lily.clues.sky={t:'The same sky',k:'doc',x:'Twelve children drew the fold above the church. Lily drew it in February.',have:()=>!!S.flags.cs_aligned};
CASES.lily.links.push({id:'february',a:'sky',b:'drawings',t:'Lily drew it first',x:'Lily’s drawings and Room 4’s share a sky. She drew it in February, before anyone else.',dean:'She saw it first. She saw everything first.',sam:'The first unit saw the fold first.'});

/* ═══ 16 · The Last Broadcast ═════════════════════════════════════════════ */
function koak(){
  const s=rmt('koak_lot','KOAK-TV, Channel 4',16,12,{spawn:{x:8,y:9.6,a:-Math.PI/2},amb:.3,region:'koak'});
  const g=s.grid; box(g,2,1,13,4,'#'); g[4][8]='+'; s.doors={'8,4':{to:'koak',x:6.5,y:7.4,a:-Math.PI/2}};
  s.entities=[impala_(4,9.6,0),{kind:'prop',m:'pole',x:11.5,y:6,r:.18,h:6}]; s.pois=[{x:8.5,y:4.5,name:'KOAK-TV',kind:'door'}]; return s; }
function koakIn(){
  const s=room('koak','KOAK-TV — the editing suite',13,9,'#',.2,'c'); s.ceilH=1.3; s.region='koak';
  rect(s.grid,1,1,11,1,'K'); s.grid[8][6]='+'; s.doors={'6,8':{to:'koak_lot',x:8.5,y:5.6,a:Math.PI/2}}; s.spawn={x:6.5,y:7.4,a:-Math.PI/2};
  s.lights=[{x:6.5,y:3,p:1,f:.3},{x:2,y:4,p:.8,f:.4}]; s.pois=[{x:6.5,y:8.5,name:'Out',kind:'door'}];
  s.entities=[use_('reel',2.6,2.6,'kb_reels','Reels labelled with case names',{z:.4,h:.3}),{kind:'prop',m:'tv',x:6.4,y:2.6,r:.3,h:.75,z:.4,emit:.5},
    use_('paper',9.6,2.7,'kb_script','A script on the edit desk',{z:.5,h:.3}),{kind:'prop',m:'desk',x:9.6,y:2.9,r:.5,h:.7},
    npc_('lou',8,4.6,'lou','Lou Ferris',{h:1.75,face:Math.PI})];
  return s; }
[koak(),koakIn()].forEach(addSector);
defDest({id:'koak',name:'KOAK-TV, Channel 4',sector:'koak_lot',x:8,y:9.6,a:-Math.PI/2,avail:()=>!!S.flags.kb_lead&&S.act===4&&!S.flags.cath_in,note:()=>caseClosed('broadcast')?'case closed':'the footage'});
/* the motel TV, in Act IV, shows you something */
{ const was=USES.motel_tv; USES.motel_tv=e=>{ if(S.act>=4&&!S.flags.kb_seen){ S.flags.kb_seen=true; S.flags.kb_lead=true;
    const L=[['narr','The motel television turns itself on. Grainy footage: two men walking through the mill at night. It’s you. It’s both of you, from behind.'],
      ['narr','It’s wrong. At line three, the one who should turn right turns left. The other one is carrying a crossbow neither of you owns. Behind them, a third figure keeps exactly the same distance.'],
      ['narr','The footage ends on a title card in plain white letters: CHAPTER FIFTEEN — THE BROTHERS LEAVE TOGETHER. There is no Chapter Fifteen.'],
      ['caller','KOAK-TV, Channel 4. Ridge Road. We never stop broadcasting.','KOAK-TV']];
    L.forEach(([w,t,n],i)=>say(w,t,null,{now:i===0,name:n})); later(18,()=>toast('New destination — KOAK-TV (Impala)')); return; } was(e); }; }
INV_UPDATES.push(()=>{ const F=S.flags; if(F.kb_lead||S.act!==4||F.cath_in||S.cut) return; if(!F.kb_nudge){ F.kb_nudge=S.time; return; }
  if(S.time-F.kb_nudge>60){ F.kb_lead=true; msg('marla','the tv in my office is showing you two. right now. walking. it isn\'t now. KOAK channel 4 on the ridge road'); } });
const REEL_ALT={shift:{rest:'the brothers burn the records',expose:'the brothers lay the six to rest',burn:'the brothers keep Frank’s notebook'},
  bell:{silence:'one brother walks into the reflection',answer:'the brothers break the clapper',leave:'Ruth Carver is told the truth'},
  road:{break:'the brothers keep the road',follow:'the loop is broken',use:'Daniel looks at mile 14'},
  agnes:{open:'the music box is smashed',box:'the wardrobe is opened',keep:'Agnes remembers Thomas'},
  clinic:{treat:'the chart is burned',destroy:'the chart is followed',follow:'Martin is just a patient'},
  radio:{destroy:'the tapes are kept',keep:'the transmitter is destroyed',follow:'nobody goes to the cross street'},
  reed:{accept:'Glenn is walked into the fog',drive:'the Reeds keep him',rite:'nobody tests him'},
  contract:{break:'the chain is burned',trade:'the chain is broken',burn:'the chain is traded'},
  saint:{reveal:'the letters stay in the wall',rest:'the confessions are read out',keep:'the dead are laid to rest'}};
USES.kb_reels=()=>{ S.flags.kb_reels=true; const L=[];
  for(const [cid,m] of Object.entries(REEL_ALT)){ const d=caseDecision(cid); if(d&&m[d]) L.push(`REEL — ${CASES[cid].title.toUpperCase()}: ${m[d]}.`); }
  if(S.flags.delia_killed) L.push('REEL — BODIES ARE WALLS: the teacher is freed.'); else if(S.flags.delia_done) L.push('REEL — BODIES ARE WALLS: the teacher is killed.');
  L.push('REEL — CHAPTER FIFTEEN: the brothers leave together.');
  menu_('The reels','Rows of film cans, each labelled in green marker with a case name and a line of dialogue. Some of them are things that happened. Most of them are things you didn’t do:\n\n'+L.slice(0,8).join('\n')+'\n\nEvery reel is a scene. Every scene is somebody’s choice.'); };
USES.kb_script=()=>{ S.flags.kb_script=true; menu_('The script','A shooting script, heavily marked up. The stage directions are familiar:\n\nINT. ST. BRENDAN’S — NIGHT. OBJECTIVE: Go into St. Brendan’s. (It’s breathing.)\nINT. NAVE. OBJECTIVE: Find the priest in the nave.\nINT. ALTAR. OBJECTIVE: Twenty to three. One brother kills the other. (NON-NEGOTIABLE — C.)\n\nIn the margin, in a different hand, very small, the kind of handwriting Lily used: “or not”.'); };
DIALOGUE.lou={ port:'lou', start:()=>S.flags.kb_lou?'l9':'l0', nodes:{
  l0:{speaker:'Lou Ferris — night editor',text:"An old man at the edit desk, splicing tape with a razor and a block, very fast, not looking at what he’s cutting.\n\n\"Thirty years on nights. Nobody watches Channel 4. I put the scenes in the order they come in.\" He holds up a strip of film to the light: two men in a black car. \"I don’t know who sends them. I know he types. You can hear it in the leader.\"",
    choices:[D_("Who decides what airs?",'l1')]},
  l1:{speaker:'Lou Ferris — night editor',text:"\"Nobody decides. It just airs. Unless somebody puts something on the reel that isn’t in the script.\" He offers you the razor, handle first. \"Nobody ever has. I’ve always wondered what would happen.\"",
    choices:[D_("[Take the razor.]",null,{flag:'kb_lou'})]},
  l9:{speaker:'Lou Ferris',text:"\"Nobody watches Channel 4.\"",choices:[D_("[Leave.]",null)]} } };
const SPLICES=[{id:'car',t:'The two of you in the car, an hour ago, arguing about the radio and laughing.'},{id:'lily',t:'Lily Hollis, turning around to face the room.'},{id:'marla',t:'Marla closing the guest ledger for the last time and going home.'}];
function broadcastEnd(k,sp){ decide('broadcast',k); const F=S.flags;
  if(k==='destroy'){ F.kb_destroyed=true; sfx('flare'); menu_('The master tape','The master reel goes into the dumpster in the lot, doused, lit. It burns green and smells of popcorn. On the way out the motel TV, the one you can see from the road, is showing only snow.'); }
  if(k==='broadcast'){ F.kb_broadcast=true; menu_('On air','You put every reel on air, in order. Across Oakhaven, televisions switch themselves on: the choices people made, and the ones they didn’t, side by side. Some people turn them off. Most people don’t. It is a very quiet night after that.'); }
  if(k==='splice'){ F.kb_splice=sp; menu_('The splice',`Lou holds the reel steady while you cut. You splice in a scene the script doesn’t have: ${SPLICES.find(x=>x.id===sp).t}\n\nThe tape runs. For a second every TV in town shows it. Somewhere, a long way off, somebody stops typing.`); }
  later(1,()=>closeCase('broadcast')); }
INV_UPDATES.push(()=>{ const F=S.flags; if(caseDecision('broadcast')||F.kb_asked||S.sector.id!=='koak'||dlg.open) return;
  if(!(F.kb_reels&&F.kb_script&&F.kb_lou)) return; F.kb_asked=true;
  later(1,()=>openMenu('The editing suite','The master reel is on the deck. Lou has stopped cutting.',[
    {text:'Destroy the master tape.',act:()=>broadcastEnd('destroy')},
    {text:'Broadcast all of it to the town.',act:()=>broadcastEnd('broadcast')},
    ...SPLICES.map(s=>({text:'Splice in a scene: '+s.t,note:'not in the script',act:()=>broadcastEnd('splice',s.id)}))])); });
/* the finale notices */
{ const e0=DIALOGUE.chuck_end.nodes.e0, t=e0.text; e0.text=()=>{ const F=S.flags; let x=typeof t==='function'?t():t;
    if(F.kb_splice) x+='\n\n"And somebody got into the edit suite." He sounds hurt. "'+({car:'You two laughing in the car? That’s not— I didn’t write that. That’s not a scene, that’s a… that’s just a nice moment.',lily:'The girl turned around. She’s not supposed to turn around until the epilogue.',marla:'Marla went home. Marla never goes home. That’s her whole thing.'}[F.kb_splice])+'"';
    if(F.kb_broadcast) x+='\n\n"You put my dailies on network television. Do you know how unprofessional that is?"';
    return x; }; }
{ const was=epilogue; epilogue=function(k){ const E=was(k); if(k==='D') return E; const F=S.flags;
    if(F.kb_splice==='car') E.lines.push('On Channel 4, at twenty to three, every night, there is footage of two men laughing in a car. Nobody knows who keeps putting it on.');
    if(F.kb_splice==='lily') E.lines.push('On Channel 4, a little girl turns around to face the room. It runs once a night. People have started leaving the TV on for her.');
    if(F.kb_splice==='marla') E.lines.push('Marla Ostrowski goes home at six every morning now. She says she saw it on TV.');
    if(F.contract_traded) E.lines.push('Crowley has a chain of paperwork in his desk that proves somebody used his stamp. He takes it out sometimes and reads it, like a love letter, or a threat.');
    if(F.saint_revealed) E.lines.push('The letters from St. Jude’s were read into the county record. Curtis Kemp sat in the gallery for all of it.');
    if(F.reed_accepted) E.lines.push('Glenn Reed knocks three times. Mia has started knocking back.');
    if(F.rd_saved) E.lines.push('Old Gus crosses the cross street every morning at twenty-three past two, out of spite.');
    return E; }; }
defCase({ id:'broadcast', n:85, kicker:'Act IV · Case 16 (optional)', title:'The Last Broadcast', open:()=>!!S.flags.kb_lead,
  summary:()=>caseClosed('broadcast')?'Something is representing your night as a sequence of scenes. That doesn’t make it fiction.':'The motel TV showed you walking through the mill. It got it wrong. KOAK-TV, Channel 4, has never stopped broadcasting.',
  clues:{
    tv:{t:'The footage',k:'sound',x:'You, in the mill, from behind. The wrong turn. A crossbow. A third figure. CHAPTER FIFTEEN.',have:F_('kb_seen')},
    reels:{t:'The reels',k:'record',x:'Every case, as a scene. Most of them show what you didn’t do.',have:F_('kb_reels')},
    script:{t:'The script',k:'doc',x:'Stage directions that read like your objectives. In the margin: “or not”.',have:F_('kb_script')},
    lou:{t:'Lou Ferris',k:'talk',x:'“Nobody decides. It just airs. Unless somebody puts something on the reel that isn’t in the script.”',who:'Lou Ferris',have:F_('kb_lou')},
    beats:{t:'Episode notes (not yours)',k:'doc',x:'“Finale: brother kills brother at the altar. (Non-negotiable.)”',have:N_('beats')},
  },
  links:[
    {id:'scenes',a:'reels',b:'script',t:'Represented, not determined',x:'Something is representing your night as scenes, including the ones you didn’t choose. Representation isn’t proof that the choices were never yours.',dean:'A camera doesn’t make it a movie.',sam:'It proves somebody’s editing. It doesn’t prove we’re fiction.'},
    {id:'ornot',a:'script',b:'beats',t:'“or not”',x:'Non-negotiable, says the script. “or not,” says somebody in the margin, in a child’s handwriting.',dean:'The kid’s been heckling him.',sam:'Even the script has a dissent.'},
    {id:'splice',a:'lou',b:'reels',t:'An unrecorded scene',x:'Lou has never seen anyone put something on the reel that isn’t in the script. Nobody has tried.',dean:'Then we try.',sam:'Not a perfect ending. Just one he didn’t write.'},
  ],
  theory:{q:'What does the footage prove?',reward:0,
    opts:[{id:'fiction',t:'That we’re fictional, and nothing we choose is real.'},{id:'nothing',t:'Nothing. It’s a trick.'},{id:'represented',t:'Only that something is representing our night as scenes. Not that it was decided in advance.',ok:true}],
    right:'Being filmed isn’t being written. Something keeps the reels. It doesn’t get to say what they mean.',wrong:'It isn’t a trick and it isn’t proof. It is somebody keeping a record, in an order that suits them.'},
  talk:()=>[[brother(),isDean()?'I saw me turn left. I never turn left.':'He had me carrying a crossbow, Dean.'],[S.hero,isDean()?'It’s wrong because it’s his. The real one’s ours.':'Then it’s wrong. Good. Let it be wrong.']],
  autopsy:()=>{ const d=caseDecision('broadcast'), F=S.flags;
    return { what:['Channel 4 broadcast your night, wrongly, and labelled it with a chapter that doesn’t exist.',d==='destroy'?'You burned the master tape.':d==='broadcast'?'You put it all on air.':'You spliced in a scene the script doesn’t have.'],
      cause:['Something is representing your experiences as a sequence of scenes, including the ones you didn’t choose.','Chuck may know about the broadcast. He won’t say whether he made it, found it, or only recognised it.'],
      open:['Who wrote “or not”.','Whether a scene he didn’t write can change a scene he did.',F.kb_splice?'He stopped typing, for a second.':'Chapter Fifteen.'],
      dean:'A camera doesn’t make it a story.',sam:'Keeping a record isn’t the same as writing one.' }; },
  paper:()=>({ head:'CHANNEL 4 “SHOWS RESIDENTS THEIR OWN CHOICES”',deck:'KOAK-TV night editor: “Nobody watches Channel 4.”',by:'Chuck Shurley, contributing writer',
    body:['Residents across Oakhaven reported televisions switching on by themselves early Sunday to show footage of local events, some of which they say did not happen.','Lou Ferris, the station’s night editor of thirty years, confirmed that the station broadcasts “whatever comes in, in the order it comes in.”',
      S.flags.kb_splice?'One segment, apparently spliced in by hand, was described by viewers as “nice.” The Ledger’s contributing writer has asked that the word “nice” not appear in this paper again.':'The Ledger’s contributing writer reminds readers that a story is only as good as its ending, and the ending is non-negotiable.'] }),
  forum:()=>[{u:'lou.ferris',t:'nobody watches channel 4'},{u:'marla_nightdesk',t:S.flags.kb_splice==='marla'?'I saw myself go home. I think I might.':'my tv won’t turn off'},{u:'c.shurley',t:'WHO TOUCHED MY DAILIES'},{u:'0114',t:'or not'}],
});
CASES.author.clues.broadcast={t:'Channel 4',k:'record',x:'Your night as scenes, with the wrong turns. A script with “or not” in the margin.',have:F_('kb_script')};
CASES.author.links.push({id:'ornot2',a:'broadcast',b:'beats',t:'Non-negotiable, or not',x:'His notes say the finale is non-negotiable. His own script has been annotated by someone who disagrees.',dean:'Even his script doesn’t believe him.',sam:'Someone has already argued with the ending.'});

/* the sheriff is at the station while the radio case is open */
INV_UPDATES.push(()=>{ const F=S.flags, w=SECTORS.street.entities.find(e=>e.kind==='walker'&&e.name==='Sheriff Ames'); if(!w) return; w.hidden=!!(F.radio_lead&&S.act<=2&&!caseClosed('radio'))||w.hidden&&S.act>=3; });
