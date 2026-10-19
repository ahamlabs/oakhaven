/* ═══ Cases for Acts II–IV, and the scenes between the scenes ═══════════════
   One question runs under all four acts: why does Oakhaven keep producing
   suffering, and who benefits? Each act changes the answer:

     I    the town is sick         (the haunting is real, and not the point)
     II   the town is contained    (it is being used)
     III  the town is observed     (somebody knows how it is supposed to end)
     IV   the story demands a sacrifice   (or someone insists that it does)

   Nothing here explains the thing behind the rift. It is enough to know what
   it eats, and who fed it. */

/* ── Act II · Bodies Are Walls ─────────────────────────────────────────── */
defCase({ id:'lockdown', n:30, kicker:'Act II · Case 3', title:'Bodies Are Walls', open:()=>S.act>=2,
  summary:()=>caseClosed('lockdown')?'The town is a farm. Somebody owns the field, and somebody else signed for it.':'The fog came down at the town line. The demons aren’t hunting. A boy has been reading a stone tablet aloud for nine days.',
  clues:{
    delia:{t:'The woman in the bus shelter',k:'talk',x:()=>S.flags.delia_killed?'The demon inside Delia Park was hiding, not hunting. She didn’t survive us.':'The demon inside Delia Park was hiding, not hunting. She is awake now.',have:()=>!!S.flags.delia_done},
    street_term:{t:'The alley terminal',k:'doc',x:'Every resident’s despair rises a little each tick. At 0.94 the veil thins. log("harvest").',have:F_('term_street')},
    pawn_term:{t:'The pawnshop terminal',k:'doc',x:'c.shurley is not root. Root has not logged in for 4,004,001 cycles.',have:F_('term_pawn')},
    term:{t:'The mill terminal',k:'doc',x:'Admin session: c.shurley. Harvest yield: six units.',have:F_('term')},
    juno:{t:'The Velvet Hour',k:'talk',x:'Juno sells numbness on management’s orders. Pain is a tax; she is the loophole.',who:'Juno',have:F_('juno_met')},
    kevin:{t:'The reader',k:'talk',x:()=>S.flags.kevin_used?'Kevin Tran kept reading. The tablet reads like instructions.':'Kevin Tran stopped reading. He remembers the tablet like code.',have:F_('kevin_done')},
    harvest:{t:'It’s a farm',k:'note',x:'The despair is the crop. A flat, grey town is easier to eat.',have:F_('harvest')},
    crowley:{t:'Crowley',k:'talk',x:'Owner of Crossroads Holdings. Bankrupted the mill for a buyer he can’t negotiate with.',have:F_('crowley_done')},
    signatory:{t:'Authorised signatory',k:'talk',x:'“One C. Shurley. Signature in green ink. No termination clause.”',who:'Crowley',have:F_('crowley_named')},
    possessed:{t:'Black eyes, photographed',k:'photo',x:'In the photo the eyes aren’t black. They’re looking over your shoulder, at the fog.',have:F_('photo_possessed'),img:PH_('possessed')},
  },
  links:[
    {id:'hiding',a:'delia',b:'street_term',t:'Bodies are walls',x:'The loop thins the veil wherever someone despairs enough. The demons climbed into people because people are the only walls left between them and what comes through.',
      dean:'They’re not invading. They’re hiding. In the town. In the people.',sam:'We’ve been fighting the refugees.'},
    {id:'numb',a:'juno',b:'harvest',t:'Fertiliser',x:'The Velvet Hour isn’t a mercy. Numb people don’t fight, don’t leave and don’t heal. It’s the crop being prepared.',
      dean:'Free drinks. Of course it was free drinks.',sam:'Management doesn’t want them happy or hurt. It wants them flat.'},
    {id:'admin',a:'pawn_term',b:'term',t:'Not root',x:'The same admin is logged in at the mill and the pawnshop, and the system says he isn’t in charge. Someone above him hasn’t logged in for four million cycles.',
      dean:'So there’s a guy. And the guy’s boss is missing.',sam:'An admin with nobody watching him. That’s worse than a god.',opens:'something to say to c.shurley, if you ever meet him'},
    {id:'broker',a:'crowley',b:'harvest',t:'A broker, not a buyer',x:'Crossroads sold the field. Crowley owns the paperwork, not the appetite. He’s a subcontractor in his own town.',
      dean:'Crowley’s the middleman. There’s always a middleman.',sam:'He sold it. He doesn’t know who to.'},
    {id:'signed',a:'signatory',b:'pawn_term',t:'Green ink',x:'The man who signed the farm into being and the admin on every terminal are the same C. Shurley.',
      dean:'C. Shurley. I want to meet this guy.',sam:'The contract and the code have the same author.'},
    {id:'source',a:'kevin',b:'street_term',t:'Function calls',x:'Kevin’s tablet and the alley terminal have the same grammar. The word of God in Oakhaven is a program, and somebody is running it.',
      dean:'Great. God’s a computer.',sam:'Not God. Somebody with the password.'},
  ],
  theory:{q:'Who is farming Oakhaven?',reward:40,
    opts:[{id:'crowley',t:'Crowley. Crossroads bought the town to harvest it.'},
          {id:'demons',t:'The demons. They thinned the veil and they’re feeding.'},
          {id:'shurley',t:'Something with no ask, sold through a broker and run by an admin called c.shurley.',ok:true}],
    right:'Crossroads brokered it. The demons are hiding from it. Something with no ask eats it, and a man called C. Shurley keeps the books.',
    wrong:'Crowley is a middleman and the demons are tenants. Whatever is farming Oakhaven never needed anyone’s soul. It only needed somebody to sign.'},
  talk:()=>[[brother(),isDean()?'Every road ends in the same grey wall. It’s not keeping us out, Sam. It’s keeping them in.':'The fog stops exactly at the town line. Like a fence. Like somebody drew it.'],
            [S.hero,isDean()?'Then we find out who owns the fence.':'Then somebody has the deed.']],
  autopsy:()=>{ const F=S.flags, T=theoryRight('lockdown');
    return {
      what:[F.delia_killed?'You killed the demon in the bus shelter, and Delia Park with it.':'You drove the demon out of Delia Park. She was awake for all four days.',
        F.kevin_used?'You asked Kevin Tran to keep reading. He did.':'You told Kevin Tran to stop. He slept eleven hours.',
        F.crowley_deal?'You took Crowley’s deal.':'You turned Crowley down.'],
      cause:['A loop in the town’s code raises everyone’s despair a little each tick. Where it crosses 0.94, the veil thins.',
        deduced('numb')?'The Velvet Hour sells the numbness that makes the crop easier to harvest.':'Somebody wanted the town flat.',
        deduced('broker')?'Crossroads Holdings sold the field. It doesn’t own what eats it.':'Crossroads had something to do with it.'],
      open:[deduced('signed')?'C. Shurley signed the contract and keeps the terminals. You haven’t met him.':'c.shurley is logged in everywhere. Nobody knows who that is.',
        'Root has not logged in for four million cycles.',T?'You know what’s farming the town. You don’t know why it was invited.':'You guessed wrong about who owns the field.'],
      dean:F.delia_killed?'I keep thinking about the teacher. I keep thinking it was the only call. I keep thinking.':'We got one out. Feels like bailing a boat with a cup.',
      sam:F.kevin_used?'I let him read because we needed it. That’s what everybody in this town says about everything.':'He asked for eggs, Dean. He’s nineteen.' }; },
  paper:()=>{ const F=S.flags;
    return { head:F.delia_killed?'TEACHER DEAD; TWO “AGENTS” SOUGHT':'FOG CLOSES ALL ROADS; TEACHER FOUND SAFE',
      deck:'Residents told to remain indoors. Phone service “intermittent.” Ledger to continue printing “for as long as there is anything to print.”',
      by:'C. S.', photo:['possessed'], cap:'A resident on Main Street, Saturday night. The Ledger has chosen not to print her name.',
      body:['The fog that settled over Oakhaven early Sunday has not lifted. Motorists report that every road out of town returns, after some distance, to Main Street. Sheriff Ames asks residents not to attempt the drive.',
        F.delia_killed?'Delia Park, 34, a seventh-grade teacher at Oakhaven Middle, was found dead near the cross-street bus shelter. Witnesses describe two men in a black car.':'Delia Park, 34, a seventh-grade teacher, was found in the cross-street bus shelter after four days missing. She told the Ledger: “I could hear it. It was scared.”',
        F.kevin_used?'A young man staying at the Oak Rest Motel has been reading aloud from what he describes as “source” for several days. Staff say he does not sleep.':'A young man recovering at the Oak Rest Motel asked the Ledger to print that he is fine, and that he would like some eggs.',
        'The Velvet Hour remains open. Management has asked the Ledger to remind readers that the first drink is free.',
        'In private remarks overheard on Main Street, one of the visiting agents was heard to say: “You answer it.” The Ledger was unable to determine what the question had been.'],
    }; },
  forum:()=>{ const F=S.flags;
    return [{u:'marla_nightdesk',t:'Rooms available. Nobody is checking out.'},{u:'tyler_k',t:'tried to drive to coos bay. ended up at the motel. tried again. motel. tried again'},
      {u:'delia.p',t:F.delia_killed?'[this account has been memorialised]':'Thank you. I can’t say more yet. Thank you.'},
      {u:'juno',t:'First drink’s free. Second one too.'},{u:'0114',t:'is my daddy at the mill'}]; },
});
{ const was=endAct2; endAct2=function(){ was(); later(8,()=>closeCase('lockdown')); }; }
{ const o=OBJECTIVES.find(o=>o.id==='crowley'); if(o) o.onDone=()=>endAct2(); }
/* c.shurley — Dean can say it too, if he worked it out */
DIALOGUE.chuck.nodes.h0.choices.push(D_("c.shurley. Admin. Not root.",'h1a',null,()=>deduced('admin')&&isDean()));
DIALOGUE.chuck.nodes.h0.choices.push(D_("C. Shurley. Green ink. You signed the farm.",'h1a',null,()=>deduced('signed')));
DIALOGUE.chuck.nodes.h1a={speaker:'Chuck',
  text:"He freezes with the beer halfway to his mouth.\n\n\"Okay, that’s— nobody’s supposed to read the terminals. They’re set dressing. They’re texture.\" He puts the bottle down a little too carefully. \"Fine. Yes. c.shurley. Admin. And no, not root. Root left. Root’s been gone a long, long time, and somebody had to keep the lights on.\n\nChuck. Chuck Shurley. Writer, mostly.\"",
  choices:[D_("You did this. The mill. The six men. Lily.",'h2'),D_("The thing in the fog is yours?",'h2')]};

/* ── Kevin wakes ────────────────────────────────────────────────────────── */
{ const K=DIALOGUE.kevin_motel, was=K.start;
  K.start=()=>S.act===2&&S.flags.kevin_checked&&!S.flags.kevin_woke?(S.flags.kevin_used?'wu':'wr'):was();
  K.nodes.wr={speaker:'Kevin Tran',port:'kevin',
    text:"He wakes as you come in, the way people wake from fever: all at once, and sure of something.\n\n\"Did you hear it? The voice from the tablet?\" He grabs your sleeve. \"I don’t remember the language. I remember one sentence. It wasn’t for me. It was addressed to someone who hasn’t arrived yet.\n\n‘Tell the brothers the ending is already written, and that they should not read ahead.’\"\n\nHe lets go of your sleeve. \"That’s you, isn’t it.\"",
    choices:[D_("Go back to sleep, Kevin.",null,{flag:'kevin_woke',note:'kevin_sentence'})]};
  K.nodes.wu={speaker:'Kevin Tran',port:'kevin_reading',
    text:"He doesn’t look up. He’s been waiting to say it.\n\n\"The sentence after the one I stopped on. ‘The admin signs with a C, and the C is open on the right, because he always leaves himself a way out.’\" The light at his eyes flickers. \"That’s useful. Isn’t it? Write it down.\"\n\nAn hour later Marla tells you he’s asked her twice whether the agents have come by yet.",
    choices:[D_("[Write it down.]",null,{flag:'kevin_woke',note:'kevin_sentence_u'})]};
  NOTES.kevin_sentence=['A sentence for someone who hasn’t arrived','Kevin woke and remembered one line of the tablet: “Tell the brothers the ending is already written, and that they should not read ahead.”'];
  NOTES.kevin_sentence_u=['The sentence after','Kevin, still reading: “The admin signs with a C, and the C is open on the right, because he always leaves himself a way out.” He doesn’t remember telling you.'];
}
/* in Act IV, the used Kevin doesn't remember */
{ const u=DIALOGUE.kevin_iv.nodes.u0, t=u.text; u.text=()=>t+(S.flags.kevin_woke?"\n\n\"Did I talk to you, at the motel? Marla says I did. I don’t— I don’t remember that.\"":""); }

/* ── Father Alistair remembers every one of them ──────────────────────── */
{ const A=DIALOGUE.alistair.nodes;
  A.a1.choices.push(D_("You remember them all? Six hundred?",'a_names'));
  A.a_names={speaker:'Father Alistair',
    text:()=>"\"Every one.\" He doesn’t have to think. \"Ray folded the form and put it in his shirt pocket so it wouldn’t get dusty. Lyle Brandt sang bass for twenty years and couldn’t read a note. Mo Haddad was writing to his daughter, Yasmin, and got as far as ‘I’m sorry I’. Pete Lindqvist double-knotted his boots because his mother taught him to.\n\nI listened. That’s the whole of what I did, for forty years. I listened to every one of them, and every one of them was in pain, and I am not a fool, Sam, Dean; I know what I heard.\""
      +(echoCount()>=3?"\n\nHe notices your phone. \"You’ve been photographing them. Good. Somebody should keep their faces. I couldn’t.\"":""),
    choices:[D_("Then you know they wanted more time, not less.",'a2',{flag:'alistair_listened'})]};
  /* confronting the argument, not the man */
  A.a2.choices.push(D_("Pain isn’t an error, Father. It’s how you know somebody’s still there.",'a_pain',null,()=>S.flags.alistair_listened&&isSam()),
                    D_("So let them decide when they’re done. Not you. Not the thing in the fog.",'a_done',null,()=>S.flags.alistair_listened&&isDean()));
  A.a_pain={speaker:'Father Alistair',text:"\"Yes,\" he says. \"I used to preach that. I believed it until about the four-hundredth bed.\" He looks at you with genuine curiosity. \"How many beds have you sat beside, Sam? Ask me again at four hundred.\"",
    choices:[D_("I will. I’ll still be saying it.",'a4',{align:['h',1],flag:'alistair_argued'})]};
  A.a_done={speaker:'Father Alistair',text:"He’s quiet for a long time.\n\n\"That’s the first thing anyone has said to me in a year that I don’t have an answer for,\" he says. \"I don’t like it. Thank you.\"",
    choices:[D_("…",'a4',{align:['h',1],flag:'alistair_argued'})]};
}

/* ── Act III · The Seventh ──────────────────────────────────────────────── */
defCase({ id:'lily', n:50, kicker:'Act III · Case 6', title:'The Seventh', open:()=>S.act>=3,
  summary:()=>caseClosed('lily')?'Six units were counted. The first one wasn’t.':'The world has folded. A girl in a nightgown keeps standing at doors you’ve opened before.',
  clues:{
    coat:{t:'Ray’s coat',k:'place',x:'Grey with dust that has become the cloth. Worn smooth at child height.',have:F_('read_coat')},
    certificate:{t:'The death certificate',k:'doc',x:'Lily Anne Hollis, 9. Pneumonia. In pencil: it was the coat.',have:F_('read_certificate')},
    drawings:{t:'Lily’s drawings',k:'doc',x:'The last one: two men and a long black car. Dated October 3rd. You arrived on the 3rd.',have:F_('read_drawings')},
    inhaler:{t:'The inhaler',k:'place',x:'Blue, empty, LILY in pink nail polish.',have:F_('read_inhaler')},
    ledgers:{t:'The company ledgers',k:'doc',x:'Fan fourteen, May: “my daughter has a cough.” Deferred.',have:F_('read_ledgers')},
    lily:{t:'Lily Hollis',k:'talk',x:'“I was the first, and nobody counted me, because I wasn’t on the payroll.”',who:'Lily',have:F_('lily_done')},
    alistair:{t:'Father Alistair',k:'talk',x:'“I sat with Ray for two hours, and I did not tell him one thing that wasn’t true.”',have:F_('alistair_met')},
    roster:{t:'Line three, night shift',k:'doc',x:'Six names. No children on a payroll.',have:F_('read_roster')},
    chuck:{t:'The man at the bar',k:'talk',x:'Chuck Shurley. Writer, mostly. “I just pointed something hungry at a place that was already starving.”',have:F_('chuck_met')},
    echo_lily:{t:'Lily, facing the camera',k:'photo',x:'For the first time, she’s facing you.',have:F_('echo_lily'),img:PH_('echo:lily')},
  },
  links:[
    {id:'cough',a:'inhaler',b:'ledgers',t:'My daughter has a cough',x:'Ray asked for the fan in May with Lily’s cough in the margin. The company deferred the fan and the cough together.',
      dean:'He wrote it on the form. He wrote his kid on the form.',sam:'He told them. In writing. And they stamped it.'},
    {id:'thecoat',a:'coat',b:'certificate',t:'It was the coat',x:'The dust came home on Ray’s coat every night, and every night she hugged it. Halvorsen wrote pneumonia. Somebody else wrote the truth in pencil.',
      dean:'He brought it home to her. Every night. He didn’t know.',sam:'Nobody had a box on the form for that.'},
    {id:'seventh',a:'roster',b:'lily',t:'The first unit',x:'Six units were harvested from line three. Lily died first, and the count never included her, because she never worked a shift.',
      dean:'Seven. It was always seven.',sam:'The farm only counts what’s on the payroll.'},
    {id:'drawn',a:'drawings',b:'chuck',t:'Drawn in advance',x:'A dead girl drew your car before you arrived. Somebody told her you were coming. Somebody who writes things down before they happen.',
      dean:'She drew us. Before we got here.',sam:'He wrote us in. She just saw the page.',opens:'something to put to Chuck at the altar'},
    {id:'truth',a:'alistair',b:'lily',t:'He always tells the truth',x:'The priest held Ray’s hand and Lily’s, and told them both it wouldn’t hurt any more. He wasn’t lying. That’s what is frightening about him.',
      dean:'Guy’s worse because he means it.',sam:'He isn’t evil. He’s sincere. That’s harder.'},
  ],
  theory:{q:'Who was the seventh death?',reward:40,
    opts:[{id:'none',t:'There was no seventh. Six men died.'},
          {id:'lily',t:'Lily Hollis, uncounted, because she never worked a shift.',ok:true},
          {id:'alistair',t:'Father Alistair, years ago. What’s in the church isn’t him.'}],
    right:'Lily Anne Hollis, nine, fourth grade. The first unit. Not on the payroll.',
    wrong:'The count was always seven. The first one just wasn’t on the payroll.'},
  talk:()=>[[brother(),isDean()?'She’s in the house. She’s always in the house.':'Every door we’ve opened before is a different door now. Don’t trust them.'],[S.hero,isDean()?'Then we knock.':'Then we open them anyway.']],
  autopsy:()=>{ const F=S.flags, T=theoryRight('lily');
    return {
      what:[F.lily_rested?'You laid Lily Hollis to rest. The blanket kept the dent.':'You let Lily Hollis stay. She’s facing the wall, waiting for the ones who come in last.',
        F.alistair_argued?'You argued with Father Alistair, and for a moment he didn’t have an answer.':'You heard Father Alistair out.','You met the man at the bar.'],
      cause:[deduced('cough')?'Ray asked for the fan with his daughter’s cough written in the margin.':'Something killed Lily before the six.',
        deduced('thecoat')?'The dust came home on his coat. She hugged it every night.':'The certificate says pneumonia. Somebody wrote “it was the coat.”',
        'A man in a bathrobe pointed something hungry at a place that was already starving, and watched.'],
      open:['Chuck says the rift closes with a brother’s blood. He says it the way people say things they’ve already written.',
        T?'You counted her. Nobody else did.':'You still think there were six.','Root has not logged in for four million cycles.'],
      dean:F.lily_waiting?'Nobody gets to decide for her. Not even us. Especially not us.':'She’s not cold any more. I keep telling myself that.',
      sam:'He said it’s not a tragedy if nobody’s watching. Somebody is. I want it to be us.' }; },
  paper:()=>{ const T=theoryRight('lily'), F=S.flags;
    return { head:T?'THE SEVENTH: LILY ANNE HOLLIS, 9':'OBITUARIES',
      deck:T?'The Ledger regrets that it did not print this in April.':'The Ledger regrets the following omissions.',
      by:'Chuck Shurley, contributing writer', photo:['echo:lily','lily'], cap:'Lily Hollis. Photo submitted by a reader. The Ledger cannot explain how.',
      body:['Lily Anne Hollis, of Larch Street, died in April of what the certificate calls pneumonia. She was nine. She was in the fourth grade. She liked horses, and drew them carefully.',
        'Her father, Ray, asked seven times that spring for a ventilation fan on line three of the Oakhaven Mill. In May he wrote in the margin of his request: “my daughter has a cough.” The request was deferred.',
        F.lily_waiting?'Lily is still at home. She is facing the wall. She is waiting for the ones who come in last.':'Lily is at rest. Her bed still holds a small dent.',
        'The Ledger’s new contributing writer would like readers to know that he did not write the asbestos, or the buyout, or the fan. He would like readers to know that he only writes what happens next.',
        'Tomorrow, at twenty to three: the finale.'],
    }; },
  forum:()=>[{u:'marla_nightdesk',t:'I used to give her the motel lollipops. Green ones. She said green tasted like outside.'},
    {u:'sarah.l',t:'She came to story hour every Thursday. She always sat at the front.'},{u:'0114',t:'thank you for counting me'},
    {u:'c.shurley',t:'Great engagement on this one, everybody!!'}],
});
{ const was=endAct3; endAct3=function(){ was(); later(9,()=>closeCase('lily')); }; }
{ const o=OBJECTIVES.find(o=>o.id==='chuck'); if(o) o.onDone=()=>endAct3(); }

/* ── the empty house ────────────────────────────────────────────────────── */
SECTORS.hollis.entities.push({kind:'prop',m:'clock',x:6.4,y:1.3,r:.1,h:.35,z:1.05,use:'h_clock',useName:'A clock on the wall',hidden:true,afterLily:true});
USES.h_clock=()=>openMenu('A clock on the wall','Twenty to three. It was going, the first time you were here. You’re almost sure it was going.',[{text:'Step back'}]);
const SECTOR_HOOKS=[];
{ const was=enterSector; enterSector=function(id,x,y,a){ const prev=S.sector&&S.sector.id; was(id,x,y,a);
    for(const f of SECTOR_HOOKS) try{ f(id,prev); }catch(e){ console.error(e); } }; }
SECTOR_HOOKS.push((id,prev)=>{ const F=S.flags;
  if(prev==='hollis'&&id!=='hollis'&&F.lily_done) F.hollis_left=true;
  if(id!=='hollis'||!F.hollis_left||F.hollis_after) return;
  F.hollis_after=true;
  for(const e of SECTORS.hollis.entities){ if(e.afterLily) e.hidden=false; if(e.read==='drawings') e.readName='A drawing, turned to face the wall'; }
  READS.drawings="One of the drawings has been turned to face the wall. Nobody turned it. You were the last people in the house.\n\nOn the back, in pencil, in a child’s careful capitals: THEY CAME BACK.";
  later(1.2,()=>say('narr','The room is exactly as you left it. The blanket still holds a small dent. The clock on the wall has stopped at twenty to three.',5,{now:true}));
  if(F.lily_waiting) later(6.6,()=>{ sfx('step'); later(.5,()=>sfx('step')); say('narr','In the next room, very lightly, someone small crosses the floor.',3.4); });
  else later(6.6,()=>say('narr','Nothing moves. The dent stays.',3));
  later(10.2,()=>say(brother(),isDean()?'Did we do the right thing?':'Was it the right call?',2.6));
  later(13,()=>say(S.hero,isDean()?'I don’t know. I don’t think anybody gets to know.':'I don’t know. I don’t think we get to.',3));
});

/* ── Act IV · Twenty to Three ───────────────────────────────────────────── */
function papersRead(){ return Object.keys(S.flags).filter(k=>k.startsWith('read_paper_')).length; }
function offScript(){ const F=S.flags; return [F.ray_heard,F.lily_waiting,F.alistair_spared,F.alistair_argued,F.kevin_rested,caseDecision('shift')==='expose',F.agnes_told_truth,F.elise_returned,F.road_loop_broken,F.halvorsen_trusted].filter(Boolean).length; }
defCase({ id:'author', n:90, kicker:'Act IV · Case 9', title:'Twenty to Three', open:()=>S.act>=4,
  summary:'The story demands a sacrifice. One brother kills the other at the altar. It writes itself, says the man who wrote it.',
  clues:{
    beats:{t:'Episode notes (not yours)',k:'doc',x:()=>beatsText(),have:N_('beats')},
    chuck:{t:'Chuck Shurley',k:'talk',x:'“It’s a finale. It writes itself. I mean, I wrote it.”',have:F_('chuck_met')},
    papers:{t:'The Ledger’s bylines',k:'record',x:'Ledger staff. C. S. Chuck Shurley, contributing writer. Always dated Sunday, October 4.',have:()=>papersRead()>=2},
    tv:{t:'The television',k:'sound',x:'The anchor said a sentence before Dean did.',have:N_('tv')},
    drawings:{t:'Lily’s last drawing',k:'doc',x:'Two men and a long black car, dated before you arrived.',have:F_('read_drawings')},
    unknown:{t:'A photo you didn’t take',k:'photo',x:'Your phone took a picture of you from somewhere you weren’t standing.',have:F_('photo_unknown'),img:()=>{ const p=GALLERY.find(p=>p.unknown); return p?p.thumb:null; }},
    kevin:{t:'Source',k:'talk',x:'“It isn’t scripture. It’s source. Every line was a function call.”',have:F_('kevin_rig')},
    offscript:{t:'Things he didn’t write',k:'note',x:()=>`You’ve done ${offScript()} things that aren’t in his notes.`,have:()=>offScript()>=2},
    sentence:{t:'Do not read ahead',k:'talk',x:'“Tell the brothers the ending is already written, and that they should not read ahead.”',have:F_('kevin_woke')},
  },
  links:[
    {id:'writer',a:'papers',b:'chuck',t:'He writes the paper',x:'The Ledger’s byline has been sliding toward his name all night. The paper is always dated tomorrow, and tomorrow never comes.',dean:'He’s been writing our reviews.',sam:'He’s been writing it down as it happens. Sometimes before.'},
    {id:'ahead',a:'tv',b:'beats',t:'He writes ahead',x:'The television said Dean’s line before Dean did. The episode notes list beats you haven’t hit yet. He isn’t predicting. He’s drafting.',dean:'So he cheats.',sam:'Drafts can be revised.'},
    {id:'lens',a:'unknown',b:'chuck',t:'Somebody else holds the camera',x:'Your phone has photos of you taken from where nobody was standing. He doesn’t just write it; he watches it.',dean:'Creep.',sam:'It isn’t a tragedy if nobody’s watching. He told us. He makes sure somebody is.'},
    {id:'revisable',a:'offscript',b:'beats',t:'Off the page',x:'You have already done things that aren’t in his notes. Every one of them happened anyway. His script isn’t a law. It’s a preference.',dean:'He’s not God. He’s a guy with notes.',sam:'An ending isn’t inevitable because someone insists on it.',opens:'a different thing to say at the altar'},
    {id:'warning',a:'sentence',b:'drawings',t:'The ending is already written',x:'A tablet and a nine-year-old both had the ending before you did. Either it’s fixed, or someone wants you to believe it is. Those are different things.',dean:'Don’t read ahead. Fine. I never read ahead.',sam:'If the ending were really fixed, he wouldn’t need us to know it.'},
  ],
  theory:{q:'What does the finale actually require?',reward:0,
    opts:[{id:'blood',t:'A brother’s blood. The rift is anchored to the bond. It’s the only way.'},
          {id:'insist',t:'Nothing. It only requires that someone insists on it, and that we believe him.',ok:true},
          {id:'lily',t:'Lily. She’s the anchor, not us.'}],
    right:'The ending was never a law. It was a man’s preference, said very confidently, to two people he thought would believe him.',
    wrong:'You took his word for it. That was always the only thing he needed.'},
  talk:()=>[[brother(),'Whatever happens in there—'],[S.hero,'Don’t do the speech.']],
  autopsy:()=>{ const F=S.flags, k=F.ending;
    const what={A:'You burned it. All of it. The mill, the motel, the library, the farm and the thing that farmed it.',B:'Sam took the Void into himself and closed the rift from the inside.',C:'You walked out of the finale. The fog thinned. It didn’t lift.',D:'Kevin found the root directory. You typed the command.'}[k]||'You left the church.';
    return { what:[what],
      cause:['A man with admin access and no supervisor pointed something hungry at a town that was already starving, and called it a story.',
        'Everything he used was already there: a deferred fan, a holding company, a priest who listened too hard, a town that had stopped expecting to be helped.'],
      open:[theoryRight('author')?'He insisted. You didn’t believe him. Whether that was enough, nobody can tell you.':'You believed him about the blood. Maybe he was right. Maybe that was the trick.',
        'Whether the thing behind the rift understood any of it. Whether Chuck did.','Root has still not logged in.'],
      dean:k==='C'?'Refusing to give up isn’t the same as refusing to listen. Took me a whole town to learn that.':'I kept moving. I listened, too. Turns out you can do both.',
      sam:k==='B'?'I thought saving everyone meant paying for it myself. Dean wouldn’t let me pay alone. I should have let him help sooner.':'Sacrificing yourself isn’t automatically the kind thing. Sometimes the kind thing is letting someone help.' }; },
  paper:()=>{ const k=S.flags.ending;
    if(k==='D') return {head:'',deck:'',by:'',body:['','','The page is blank. It is dated Monday, October 5. Nobody is writing it.'],date:'Monday, October 5'};
    return { head:{A:'OAKHAVEN FIRE BURNS FOR FOUR HOURS',B:'LIGHTS RETURN AT 2:41; FOG GONE',C:'FOG THINS; RESIDENTS REMAIN'}[k]||'NO NEWS',
      deck:{A:'County crews unable to explain how flames followed “every pipe the mill ever laid.”',B:'Residents report no memory of the past week. Motel re-opens at six.',C:'Sheriff says town is “mostly” fine. Ledger to print on Mondays again.'}[k]||'',
      by:k==='C'?'Ledger staff':'Coos County Register, by wire', date:k==='C'?'Sunday, October 4':'Monday, October 5',
      body:{A:['The town of Oakhaven burned early Monday from what investigators describe as a network of buried oil lines “that should not have been there.” A black 1967 sedan was seen leaving the town line at 2:44.',S.flags.oil_map?'The fire was fast. Investigators believe few residents woke.':'The fire was slow. Some residents woke.','Crossroads Holdings, of Wilmington, Delaware, has declined to comment. Its registered office is a mailbox.'],
        B:['At 2:41 a.m. on Monday every light in Oakhaven came on at once, residents say. The fog that had closed the town for a week was gone by dawn.','Nobody the Register spoke to remembers the week. Marla Ostrowski re-opened the Oak Rest Motel at six. “I don’t know why I was crying,” she said. “I made coffee.”','Two brothers in a black car were seen at the diner. The taller one did not eat. The other one watched him not eat.'],
        C:['It is still Sunday in Oakhaven. Residents say the fog has thinned enough to see the end of Main Street, and the hum is quieter.',S.flags.mill_records_saved?'The county has reopened the inquest into the six deaths at the mill. The records submitted cite “fan fourteen” by name.':'The county has declined to reopen the inquest into the six deaths at the mill.','The Ledger will print on Mondays again, when there is a Monday.']}[k]||[],
      photo:null }; },
  forum:()=>{ const k=S.flags.ending;
    if(k==='D') return [{u:'',t:''}];
    return [{u:'marla_nightdesk',t:k==='A'?'[this account has been memorialised]':'Coffee’s on. Nobody has to sign the ledger today.'},{u:'0114',t:k==='A'?'':S.flags.lily_waiting?'i turned around':'goodnight'},
      {u:'c.shurley',t:k==='C'?'That’s it? That’s the ending? Unsubscribe.':k==='B'?'ok I’ll admit it, that one got me':'NO'}]; },
});
{ const was=chooseEnding; chooseEnding=function(k){ was(k); if(S.flags.ending) closeCase('author',{quiet:true}); }; }
/* the end screen gets the last edition */
{ const was=showEnding; showEnding=function(k){ was(k);
    const el=document.getElementById('endScr'); if(!el||!el.appendChild) return;
    const n=S.inv.news.find(x=>x.cid==='author'), b=document.createElement('button');
    b.textContent='Read the morning paper'; b.className='paperBtn'; b.onclick=()=>{ AUTOPSY_Q.length=0; showAutopsy('author',true); }; el.appendChild(b); }; }
/* Ending D erases the gallery too */
{ const was=runPurge; runPurge=function(p){ was(p); later(16,()=>{ wipeGallery(); S.msgs={}; }); }; }

/* ── at the altar: the brothers, before Chuck gets his finale ──────────── */
INV_UPDATES.push(dt=>{ const F=S.flags;
  if(S.sector.id!=='cathedral'||!F.ch13||F.altar_talk) return; F.altar_talk=true;
  const D=isDean(), L=[
    [brother(),D?'Dean. Have you already decided? What you’re going to do in there?':'Sam. Have you already decided? What you’re going to do?'],
    [S.hero,D?'Have you?':'Have you?'],
    [brother(),'…'],
    [S.hero,D?'Because if you’re thinking about doing the thing where you carry it all yourself—':'Because if you’re thinking about doing the thing where you just keep going and don’t look at it—'],
    [brother(),D?'I’m not thinking anything. I’m listening. You told me to try that.':'I’m listening. That’s new. Don’t get used to it.'],
    ['chuck','Guys! Guys. Love this. Love the tension. But it doesn’t advance anything. Can we keep it moving? Popcorn’s getting cold.']];
  let t=5.4; for(const [w,x] of L){ const d=Math.max(2.4,x.length*.058); later(t,()=>say(w,x,d)); t+=d+.2; }
});
/* Chuck’s confidence slips whenever the run doesn’t match his notes */
{ const e0=DIALOGUE.chuck_end.nodes.e0, t=e0.text;
  e0.text=()=>{ const n=offScript(), x=[];
    if(S.flags.ray_heard) x.push('“You talked the ghost down by name. That wasn’t in the outline.”');
    if(S.flags.alistair_argued) x.push('“And Alistair didn’t have a comeback? He always has a comeback. I gave him all of them.”');
    if(caseDecision('shift')==='expose') x.push('“And the records — you kept the records. Nobody keeps the records.”');
    if(S.flags.agnes_told_truth) x.push('“The old lady remembers now. That’s… a lot of grief for a side quest.”');
    return (typeof t==='function'?t():t)+(x.length?`\n\nHe checks a notepad in his bathrobe pocket and frowns. ${x.join(' ')}`:'')+(n>=4?'\n\nFor a second, just a second, he looks like a man who isn’t sure what happens next.':''); };
  DIALOGUE.chuck_end.nodes.e1.choices.splice(4,0,D_("You don’t need the blood. You need us to believe you need it.",'eX',null,()=>deduced('revisable')||theoryRight('author')));
  DIALOGUE.chuck_end.nodes.eX={speaker:'Chuck',
    text:"He opens his mouth. Closes it. Puts the popcorn down.\n\n\"That’s not— okay, that’s reductive. There’s a whole mythology. The bond, the anchor, the—\" He stops. Behind him the rift ripples like something listening very carefully.\n\n\"Fine. It’s a preference. A strong one! Writers are allowed preferences.\" He picks the popcorn back up, and his hand is not quite steady. \"So what are you going to do instead? Pitch me. I mean it this time.\"",
    choices:[D_("[…]",'e1',{flag:'chuck_shaken'})]};
}

/* ── epilogues remember the cases ──────────────────────────────────────── */
{ const was=epilogue; epilogue=function(k){ const E=was(k), F=S.flags, L=[];
    if(k==='D') return E;
    if(caseDecision('shift')==='expose') L.push('Frank Dwyer’s notebook was read aloud at the county inquest. Mara Voss sat in the front row and didn’t look away.');
    if(F.mill_records_saved&&caseDecision('shift')!=='expose') L.push('The mill records survived. A lawyer in Portland has them now. She has started using the phrase “deferred pending capital review” in her opening statements.');
    if(F.mill_records_burned) L.push('The mill records are ash. Everyone knows what happened. Nobody can prove it.');
    if(theoryRight('lily')) L.push('Somebody added a seventh name to the plaque outside the mill gate: LILY ANNE HOLLIS, 9. Nobody admits to doing it.');
    if(F.agnes_told_truth) L.push('Agnes Bell visits a grave on Thursdays now. She knows exactly whose it is.');
    if(F.agnes_kept_room) L.push('Agnes Bell’s house still has one more room than it should. She keeps the door shut and hums at it.');
    if(F.elise_returned) L.push('Elise Carver came home. She answers questions a little before they’re asked. Her mother has stopped minding.');
    if(F.bell_silenced) L.push('The reservoir is quiet at twenty to three. Ruth Carver lights a candle for her daughter. It is the right candle now.');
    if(F.bell_left) L.push('On still nights, people on Main Street swear they can hear a bell under the road.');
    if(F.road_loop_broken) L.push('Daniel Rusk drove out on Route 9 and kept going. He sends Marla a postcard every month. Every one is from a different town.');
    if(F.road_used) L.push('Route 9 still remembers your faces. Sometimes, on long drives, the mile markers count down.');
    if(F.halvorsen_trusted) L.push('Dr. Halvorsen re-filed Lily Hollis’s certificate. Under cause of death he wrote: occupational exposure, secondary. He signed it with his whole name.');
    if(F.future_chart_destroyed) L.push('The clinic’s records room is ordinary now. Every chart describes the past.');
    if(F.martin_saved) L.push('Martin Vale finished his delivery route. He doesn’t remember Oakhaven. His dashboard clock runs the right way.');
    E.lines=E.lines.concat(L); return E; }; }
