/* ═══ Arcs ══════════════════════════════════════════════════════════════════
   Two quiet meters run under the whole night.

     Dean: refusing to give up is not the same as refusing to listen.
     Sam:  sacrificing yourself is not automatically the compassionate thing;
           sometimes the kind thing is letting someone help.

   They move in the car, between cases, in eight conversations the player
   steers. Whoever you're playing, your answer moves your own meter, and the
   other brother reacts according to how the night has gone between you.
   By the altar, if both of you have learned the thing you needed to, there
   is one more thing you can say to Chuck. It doesn't save anyone for free.
   It changes what each ending costs and who pays it. */

function arcS(){ const I=inv_(); I.arc=I.arc||{dl:0,sa:0,seen:{},picks:{}}; return I.arc; }
function arc(k,n){ const A=arcS(); A[k]=Math.max(-4,Math.min(5,(A[k]||0)+n)); }
const arcOf=k=>arcS()[k]||0;
function together(){ const A=arcS(); return !!A.together||(!!A.seed&&A.dl+A.sa>=3&&inv_().bond>=0); }

/* ── the eight conversations in the car ────────────────────────────────── */
const CAR=[];
function defCar(id,when,build){ CAR.push({id,when,build}); }
function pendingCar(){ const A=arcS(); return CAR.find(c=>!A.seen[c.id]&&(()=>{ try{ return c.when(); }catch(e){ return false; } })()); }
function playCar(c){ const A=arcS(); A.seen[c.id]=true;
  const T=c.build(isDean()); T.port=null; DIALOGUE['car_'+c.id]=T; openDlg('car_'+c.id,null); }
const SAYS=w=>w==='dean'?'Dean':'Sam';
/* a choice that moves a meter and remembers what you said */
const P=(text,next,id,eff={})=>D_(text,next,{now:()=>{ const A=arcS(); A.picks[id]=text;
  for(const k in eff){ if(k==='bond') inv_().bond+=eff.bond; else if(k==='seed') A.seed=true; else arc(k,eff[k]); } }});

defCar('mill',()=>S.flags.phantom&&S.act===1,D=>({start:'a',nodes:D?{
  a:{speaker:'Sam',text:"Rain on the roof. Sam has the case file open on his knee and isn’t reading it.\n\n\"You saw it. When Ray let go. The air opened like a cut and something drank him.\" He closes the file. \"Dean. What was that?\"",
    choices:[P("[Joke] We’ve seen worse. Probably. Top ten, easy.",'b','mill',{dl:-1}),P("[Honest] I don’t know. I didn’t like not knowing. I still don’t.",'c','mill',{dl:1,bond:1}),P("[Work] Doesn’t matter what it was. Matters who fed it.",'d','mill')]},
  b:{speaker:'Sam',text:"\"Have we?\" He looks out at the mill. \"Name one.\"\n\nYou can’t, quickly enough. He notices that you can’t.",choices:[D_("[Drive.]",null)]},
  c:{speaker:'Sam',text:"He looks at you like you’ve said something in Latin.\n\n\"Okay,\" he says. \"Okay. Me neither.\" It’s the first quiet thing either of you has said since you got here, and the car feels warmer for it.",choices:[D_("[Drive.]",null)]},
  d:{speaker:'Sam',text:"\"Crossroads Holdings.\" He nods slowly. \"Yeah. Let’s find out who signs their checks.\"",choices:[D_("[Drive.]",null)]},
}:{
  a:{speaker:'Dean',text:"Dean has both hands on the wheel and the engine off. He hasn’t said anything for a mile, which is a long way to go without saying anything in a parked car.\n\n\"You’ve been quiet since the mill, Sammy.\"",
    choices:[P("[Tell him] It scared me. Not the ghost. The thing after.",'b','mill',{sa:1,bond:1}),P("[Fine] I’m fine. Let’s just work the case.",'c','mill',{sa:-1}),P("[Theory] Ghosts don’t get eaten, Dean. Something new is here.",'d','mill')]},
  b:{speaker:'Dean',text:"He doesn’t look at you. That’s how you know he heard.\n\n\"…Yeah. Me too.\" He starts the car. \"Don’t tell anybody.\"",choices:[D_("[Ride.]",null)]},
  c:{speaker:'Dean',text:"\"Sure you are.\" He starts the car. He drives the next mile very carefully, the way he does when he’s decided not to push.",choices:[D_("[Ride.]",null)]},
  d:{speaker:'Dean',text:"\"New’s bad.\" He starts the car. \"I hate new.\"",choices:[D_("[Ride.]",null)]},
}}));

defCar('delia',()=>!!S.flags.delia_done,D=>{ const K=!!S.flags.delia_killed; return {start:'a',nodes:D?(K?{
  a:{speaker:'Sam',text:"Sam is cleaning the knife on a rag he has already cleaned it with.\n\n\"She was still in there, Dean. Delia. I could see her behind its eyes.\"",
    choices:[P("[Defend] It was the only call.",'b','delia',{dl:-1}),P("[Listen] Tell me what you would’ve done. Really.",'c','delia',{dl:1,bond:1}),P("[Say nothing.]",'d','delia')]},
  b:{speaker:'Sam',text:"\"Yeah.\" He folds the rag. \"That’s what you always say. It always is the only call, when you’re the one making it.\"",choices:[D_("[…]",null)]},
  c:{speaker:'Sam',text:"He blinks. Then he tells you: the long rite, forty seconds, a ward on the shelter, the risk. It might have worked. It might have got him killed.\n\n\"I don’t know if I was right,\" he says. \"I just wanted you to ask.\"",choices:[D_("[…]",null)]},
  d:{speaker:'Sam',text:"He waits. You don’t fill it. Eventually he puts the knife away, and it’s like a door closing very quietly in another room.",choices:[D_("[…]",null)]},
}:{
  a:{speaker:'Sam',text:"Sam is pale and there’s dried blood under his nose from the rite.\n\n\"She thanked us. She was awake the whole four days, Dean. She heard everything it said.\"",
    choices:[P("[Credit him] It was your call. You were right.",'b','delia',{dl:1,bond:1}),P("[Shrug] We got lucky.",'c','delia',{dl:-1}),P("[Worry] You’re bleeding. Next time you tell me before it costs you.",'d','delia',{dl:1})]},
  b:{speaker:'Sam',text:"He looks at you for a second too long, like he’s checking it’s really you.\n\n\"Thanks,\" he says. \"Seriously.\"",choices:[D_("[…]",null)]},
  c:{speaker:'Sam',text:"\"Lucky.\" He wipes his nose. \"Sure.\"",choices:[D_("[…]",null)]},
  d:{speaker:'Sam',text:"\"I’m fine.\" He isn’t, and he knows you know. \"…Okay. Next time I’ll say.\"",choices:[D_("[…]",null,{now:()=>arc('sa',1)})]},
}):(K?{
  a:{speaker:'Dean',text:"\"Hey.\" Dean doesn’t start the car. \"It was the only call. You hear me? I’d have made it too.\"",
    choices:[P("[Let him carry it with you] …Okay. Okay.",'b','delia',{sa:1,bond:1}),P("[Carry it alone] It was my call. I’ll live with it.",'c','delia',{sa:-1}),P("[Argue] Was it? There was a rite. I didn’t try it.",'d','delia')]},
  b:{speaker:'Dean',text:"He nods once. Then he starts the car, and drives with one hand, and the other one is on your shoulder for about four seconds, which for Dean is a speech.",choices:[D_("[…]",null)]},
  c:{speaker:'Dean',text:"\"Yeah,\" he says. \"That’s what I’m worried about.\"",choices:[D_("[…]",null)]},
  d:{speaker:'Dean',text:"\"So next time you try it.\" He starts the car. \"And I cover you. That’s the deal. That’s always been the deal.\"",choices:[D_("[…]",null)]},
}:{
  a:{speaker:'Dean',text:"\"That was a long rite, Sammy. You were bleeding from the nose by the end.\" He hands you a gas-station napkin without looking.",
    choices:[P("[Martyr] I’d do it again. Every time.",'b','delia',{sa:-1}),P("[Accept] Next time cover me sooner. I can’t hold it alone.",'c','delia',{sa:1,bond:1}),P("[Deflect] She’s alive. That’s what matters.",'d','delia')]},
  b:{speaker:'Dean',text:"\"I know you would.\" He grips the wheel. \"That’s the problem.\"",choices:[D_("[…]",null)]},
  c:{speaker:'Dean',text:"He looks over, surprised enough that he forgets to make a joke about it.\n\n\"Yeah,\" he says. \"Yeah. I can do that.\"",choices:[D_("[…]",null)]},
  d:{speaker:'Dean',text:"\"Sure.\" He starts the car. \"And you’re still bleeding.\"",choices:[D_("[…]",null)]},
})}; });

defCar('kevin',()=>!!S.flags.kevin_done&&S.act>=2,D=>{ const U=!!S.flags.kevin_used; return {start:'a',nodes:D?{
  a:{speaker:'Sam',text:U?"\"He’s nineteen,\" Sam says. \"We asked him to keep reading because it was useful. That’s it. That’s the whole reason.\"":"\"He asked for eggs.\" Sam is smiling and trying not to. \"Nine days reading the word of God and he asked for eggs.\"",
    choices:U?[P("[Own it] I know. I did it. I’d like you to stop me next time.",'b','kevin',{dl:1,bond:1}),P("[Justify] We needed it. The town needed it.",'c','kevin',{dl:-1})]
      :[P("[Admit] You were right to stop him. I wanted the answers.",'b','kevin',{dl:1}),P("[Tease] Kid’s got his priorities straight.",'c','kevin')]},
  b:{speaker:'Sam',text:U?"\"Okay.\" Sam is quiet for a bit. \"I will. I’ll stop you.\" A pause. \"Thank you for asking me to.\"":"\"I know you did.\" He looks out the window. \"So did I. That’s why I said it out loud.\"",choices:[D_("[…]",null)]},
  c:{speaker:'Sam',text:U?"\"Everybody in this town says that,\" Sam says. \"About everything. That’s how it got like this.\"":"\"Eggs, Dean.\" He laughs, finally. It’s the first time tonight.",choices:[D_("[…]",null)]},
}:{
  a:{speaker:'Dean',text:U?"\"You asked him to keep reading.\" Dean isn’t angry. That’s worse. \"I watched you do the math on a kid.\"":"\"You told the prophet to take a nap.\" Dean grins. \"Of all the scripture we could’ve had. Respect.\"",
    choices:U?[P("[Accept] Tell me when I do that. When I start using people. I won’t always see it.",'b','kevin',{sa:1,bond:1}),P("[Defend] It was the only way to get answers.",'c','kevin',{sa:-1})]
      :[P("[Honest] I wanted to use him. I almost did. You’d have let me.",'b','kevin',{sa:1}),P("[Proud] People aren’t tools, Dean.",'c','kevin')]},
  b:{speaker:'Dean',text:U?"\"Deal.\" He drums the wheel. \"You tell me when I start shooting first. That one’s gonna be a full-time job.\"":"\"Yeah.\" He doesn’t deny it. \"I’d have let you. Glad you didn’t need me to.\"",choices:[D_("[…]",null)]},
  c:{speaker:'Dean',text:U?"\"Sure, Sam.\" He starts the car. \"That’s what I say about the gun.\"":"\"No,\" Dean says. \"They’re not.\" He sounds like he’s agreeing with something bigger than Kevin.",choices:[D_("[…]",null)]},
}}; });

defCar('crowley',()=>!!S.flags.crowley_done,D=>{ const deal=!!S.flags.crowley_deal; return {start:'a',nodes:{
  a:{speaker:SAYS(brother()),text:deal?"\"We owe Crowley a favour.\" "+(D?"Sam says it like a diagnosis.":"Dean says it like a punchline he doesn’t think is funny.")+" \"Named later. Do you know what ‘named later’ means, with him?\"":"\"We turned him down.\" "+(D?"Sam sounds relieved.":"Dean sounds proud and a little worried.")+" \"He’s going to stock Earl’s shelves anyway. He said so. He’s a patient investor.\"",
    choices:D?[P("[Listen] What would you have done?",'b','crowley',{dl:1}),P("[Brush off] We’ll deal with it when it comes.",'c','crowley',{dl:-1})]
      :[P("[Share it] It’s on both of us now. I don’t want to carry it alone.",'b','crowley',{sa:1}),P("[Take it] If he names it, he names it on me. Not you.",'c','crowley',{sa:-1})]},
  b:{speaker:SAYS(brother()),text:D?"Sam thinks about it. \"The same, probably. I just wanted to be asked.\"":"\"Both of us.\" Dean nods. \"That’s how this works. That’s how it’s always worked, you idiot.\"",choices:[D_("[…]",null,{now:()=>inv_().bond++})]},
  c:{speaker:SAYS(brother()),text:D?"\"That’s your plan for everything,\" Sam says.":"\"Sam.\" He turns the key. \"You don’t get to pre-volunteer.\"",choices:[D_("[…]",null)]},
}}; });

defCar('fold',()=>!!S.flags.cas_met&&S.act>=3,D=>({start:'a',nodes:D?{
  a:{speaker:'Sam',text:"The sky is torn above the motel. Sam is looking at it through the windshield like a man reading a diagnosis.\n\n\"Cas said God ran, Dean. Not left. Ran.\" He swallows. \"I need there to be someone at the wheel. I need it more than I knew.\"",
    choices:[P("[Push] There’s nobody at the wheel. There never was. We drive.",'b','fold',{dl:-1}),P("[Listen] What do you need it for? Tell me.",'c','fold',{dl:1,bond:1})]},
  b:{speaker:'Sam',text:"\"I know you believe that.\" He doesn’t argue. He looks very young. \"It’s not as comforting as you think it is.\"",choices:[D_("[…]",null)]},
  c:{speaker:'Sam',text:"He thinks. \"So that somebody gets to decide what’s worth it. So it isn’t always me.\" He laughs, unsteady. \"So it isn’t always me, Dean.\"\n\nYou don’t have an answer. You don’t try to have one. You just stay in the car with him.",choices:[D_("[…]",null)]},
}:{
  a:{speaker:'Dean',text:"Dean is looking at the tear in the sky with a cigarette he doesn’t light. He quit in 2004. He keeps one for the end of the world.\n\n\"Cas said God ran.\" He shrugs. \"Doesn’t change much. Never thought anybody was driving.\"",
    choices:[P("[Admit] I wanted someone to tell me what’s worth it. So it isn’t always me.",'b','fold',{sa:1,bond:1}),P("[Bravado] Then we drive. Fine. I can carry it.",'c','fold',{sa:-1})]},
  b:{speaker:'Dean',text:"He finally lights the cigarette. Doesn’t smoke it. Just holds it.\n\n\"It’s not always you,\" he says. \"It hasn’t been you on your own one single day since you were six months old. That’s the deal.\"",choices:[D_("[…]",null)]},
  c:{speaker:'Dean',text:"\"Yeah,\" he says. \"That’s what I’m scared of.\" He puts the cigarette back in the visor.",choices:[D_("[…]",null)]},
}}));

defCar('lily',()=>!!S.flags.lily_done,D=>{ const R=!!S.flags.lily_rested; return {start:'a',nodes:{
  a:{speaker:SAYS(brother()),text:R?"\"She closed her eyes before you finished.\" "+(D?"Sam":"Dean")+" is looking at his hands. \"Did we do right by her? I keep asking it and nothing answers.\"":"\"You told her she could stay.\" "+(D?"Sam":"Dean")+" is quiet. \"A nine-year-old, waiting in a dead house for the ones who come in last.\"",
    choices:D?[P("[Listen] Tell me what you think we should’ve done.",'b','lily',{dl:1}),P("[Close it] It’s done. We don’t get to know.",'c','lily')]
      :[P("[Share] I don’t know if it was mercy. I need you to not know with me.",'b','lily',{sa:1,bond:1}),P("[Shoulder it] It was my call. It’s mine to wonder about.",'c','lily',{sa:-1})]},
  b:{speaker:SAYS(brother()),text:D?"Sam tells you, slowly. Something about choices that belong to the person, even when they’re small, even when they’re dead. You let him finish. It takes a while. It’s worth it.":"\"Okay,\" Dean says. \"We don’t know together. I can do that one.\"",choices:[D_("[…]",null)]},
  c:{speaker:SAYS(brother()),text:D?"\"Yeah,\" Sam says. \"We never do.\"":"\"No,\" Dean says. \"It’s ours. You don’t get to keep the hard ones for yourself.\"",choices:[D_("[…]",null)]},
}}; });

defCar('chuck',()=>!!S.flags.chuck_met,D=>({start:'a',nodes:D?{
  a:{speaker:'Sam',text:"\"One brother kills the other at the altar.\" Sam says it flatly, the way he reads out lore. Then: \"If it comes to that, it should be me. I mean it. Not me dying — me doing it to myself. I can take it in. I can hold it.\"",
    choices:[P("[Override] No. Not happening. If anyone, it’s me.",'b','chuck',{dl:-2}),P("[Listen] Why you, Sammy? Say all of it.",'c','chuck',{dl:2,bond:1})]},
  b:{speaker:'Sam',text:"\"You always do that.\" He doesn’t raise his voice. \"You decide for both of us and call it protecting me.\"\n\nYou don’t have an answer to that. Neither of you says anything for a mile.",choices:[D_("[…]",null)]},
  c:{speaker:'Sam',text:"He says all of it. The blood he drank or didn’t, the light he can feel in his chest, the arithmetic he does every time: one of him, a whole town.\n\n\"I think you’re wrong,\" you tell him when he’s done. \"I also think you get to be wrong out loud, and I’ll still be here.\"\n\nHe laughs, wet. \"That’s the worst pep talk I’ve ever heard.\"",
    choices:[P("We decide this together. Whatever it is. At the altar, it’s both of us.",null,'chuck2',{seed:1,dl:1}),D_("[…]",null)]},
}:{
  a:{speaker:'Dean',text:"\"One brother kills the other.\" Dean laughs, without anything in it. \"Okay. If it comes to that, it’s me. I’m older. I called it. That’s how dibs works.\"",
    choices:[P("[Martyr] No. I can take it into myself. I’m the only one who can hold it.",'b','chuck',{sa:-2}),P("[Accept] Then neither of us. Not alone. You and me.",'c','chuck',{sa:2,bond:1})]},
  b:{speaker:'Dean',text:"\"Yeah?\" He looks at you. \"You’re the only one, huh. Must be lonely up there.\"",choices:[D_("[…]",null)]},
  c:{speaker:'Dean',text:"He looks at you for a long time.\n\n\"That’s not how the story goes,\" he says.\n\n\"No,\" you say. \"It isn’t.\"",
    choices:[P("At the altar, whatever we do, we do it together.",null,'chuck2',{seed:1,sa:1}),D_("[…]",null)]},
}}));

defCar('last',()=>S.act>=4&&!S.flags.cas_open,D=>{ const A=arcS(), mine=D?A.dl:A.sa;
  return {start:'a',nodes:{
  a:{speaker:SAYS(brother()),text:"The last time you’ll sit in this car before the church. "+(D?"Sam":"Dean")+" has the radio on low. It’s playing static, and under the static, very faintly, a bell.\n\n"+(mine>=2?"\"Whatever happens in there,\" he says, \"I want you to know I noticed. Tonight. The way you’ve been.\"":"\"Whatever happens in there,\" he says, and then doesn’t finish."),
    choices:[P(together()||A.seed?"We go in together. That’s the only plan.":"[Reach for him] I don’t want to do this one alone.",'b','last',D?{dl:1,seed:1}:{sa:1,seed:1}),
             P(D?"[Steel] I’ll handle it. Whatever he wants, I’ll handle it.":"[Steel] If it has to be someone, it’s me. I’ve made peace with that.",'c','last',D?{dl:-1}:{sa:-1})]},
  b:{speaker:SAYS(brother()),text:together()?"He turns the radio off. The bell keeps going for a second after, then stops.\n\n\"Together,\" he says. \"Okay. Let’s go break a story.\"":"He nods. He doesn’t quite believe it yet. Neither do you. You get out of the car anyway.",choices:[D_("[…]",null)]},
  c:{speaker:SAYS(brother()),text:"\"Yeah,\" he says. \"I know you have.\" He turns the radio up, so neither of you has to say anything else.",choices:[D_("[…]",null)]},
}}; });

/* the car is where they happen: Talk it over plays the next one first */
{ const was=impalaTalk; impalaTalk=function(){ const c=pendingCar(); if(c){ playCar(c); return; } was(); }; }
{ const was=hubMenu; hubMenu=function(car){ was(car); const c=pendingCar(); if(c&&dlg.open&&dlg.avail){
    const i=dlg.avail.findIndex(x=>/^Talk it over/.test(x.text)); if(i>=0){ dlg.avail[i].note='something’s on '+(isDean()?'Sam’s':'Dean’s')+' mind'; renderChoices(dlg.avail.map(x=>({text:x.text,note:x.note,act:x.act||null}))); } } }; }
INV_UPDATES.push(()=>{ const c=pendingCar(), A=arcS(); if(!c||A.nudged===c.id||S.cut||dlg.open) return;
  const car=S.sector.entities.find(e=>e.kind==='vehicle'); if(!car||Math.hypot(car.x-S.px,car.y-S.py)>6) return;
  A.nudged=c.id; say(brother(),isDean()?'Dean. Car. Got a minute?':'Sam. Car. Talk to me a sec.',2.6); });

/* ── at the altar: one more thing you can say ──────────────────────────── */
DIALOGUE.chuck_end.nodes.e1.choices.splice(0,0,D_("[Take your brother’s hand.] We decide this together.",'eT',null,()=>together()));
DIALOGUE.chuck_end.nodes.eT={speaker:'Chuck',
  text:"He stops with a handful of popcorn halfway to his mouth.\n\n\"No. No no no. You don’t— the whole point is the choice. One of you. The other one. That’s the drama. Two people deciding something together isn’t a finale, it’s a—\" he searches for the word, appalled, \"—a marriage.\"\n\nBehind him, the rift ripples. It is listening very carefully to two people who aren’t arguing.\n\n\"Fine,\" Chuck says. \"Fine. Pick. Together. See if it’s any cheaper.\"",
  choices:[D_("[…]",'e1',{now:()=>{ arcS().together=true; S.flags.together=true; }})]};

/* ── endings change shape when it's both of you ─────────────────────────── */
function patchEnd(k,fn){ const was=CUTSCENES['end_'+k]; CUTSCENES['end_'+k]=function(){ const c=was(); try{ fn(c); }catch(e){} return c; }; }
patchEnd('A',c=>{ if(!S.flags.together) return;
  c.subs=c.subs.filter(s=>s.t<14);
  c.subs.push({t:3.6,who:brother(),text:'Give me the matches. No— give me one. We both strike.'},{t:14.5,who:'dean',text:'Eyes front, Sammy. Both of us. All the way to the line.'},{t:17.5,who:'sam',text:'Both of us.'}); });
patchEnd('B',c=>{ if(!S.flags.together) return;
  c.subs=c.subs.filter(s=>s.t<12);
  c.subs.push({t:5.4,who:'dean',text:'Then give me half. Don’t argue. Give me half of it.'},{t:7.2,who:'narr',text:'Dean takes his brother’s hand on the altar, and the Void, which has never had to share, does not know what to do.'},
    {t:12.4,who:'dean',text:'Sam. Sammy. You in there?'},{t:14.4,who:'sam',text:'Yeah. Yeah. It’s quieter with two of us. It’s so much quieter.'}); });
patchEnd('C',c=>{ if(!S.flags.together) return;
  c.subs.push({t:6.8,who:'narr',text:'You don’t walk out alone. At the doors you stop, and hold them open, and the people of Oakhaven who came to the church walk out ahead of you into the thinning fog.'}); });
patchEnd('D',c=>{ if(trustOf('kevin')<2) return;
  c.subs=c.subs.map(s=>s.t===18.8?{t:18.8,who:'kevin',text:S.flags.kevin_used?'No. My hands. You don’t have to carry this one. I’m the one who read it. I’ll be the one who closes it.':'My hands, this time. You stopped me once when it counted. Let me do this part.'}:s); });
{ const was=epilogue; epilogue=function(k){ const E=was(k); if(k==='D') return E; const A=arcS(), L=[];
    if(S.flags.together){ L.push({A:'They both struck a match. They both looked back, once, at the line of fire, and then neither of them did again.',
      B:'Sam walked out of St. Brendan’s. So did Dean. They both check the lights now, and they both hear the hum, half each. It is, Sam says, so much quieter with two.',
      C:'They held the doors of St. Brendan’s for everyone who came. It took eleven minutes. Nobody pushed.'}[k]); }
    L.push(A.dl>=2?'Dean still doesn’t stop. He listens more, now. It slows him down by about four seconds, and he says it’s the best four seconds he’s got.':A.dl<=-2?'Dean drove the whole way without a word. He’s very good at it. It’s the thing Sam worries about most.':'Dean drove. That part never changes.');
    L.push(A.sa>=2?'Sam lets Dean drive some nights, and some nights he lets Dean carry the box from the trunk. He doesn’t say thank you. He doesn’t have to.':A.sa<=-2?'Sam keeps a list of everything he owes. He adds to it every night, and doesn’t let anybody read it.':'Sam reads in the passenger seat until the light goes.');
    E.lines=E.lines.concat(L.filter(Boolean)); return E; }; }
