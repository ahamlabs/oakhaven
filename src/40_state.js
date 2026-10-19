/* ═══ Heroes ═════════════════════════════════════════════════════════════ */
const HEROES = {
  dean:  {name:'Dean',   full:'Dean Winchester',   phil:'absurdism', brother:'sam', walk:2.35, riteMul:1.7,
         special:{id:'charge', name:'Iron Charge'}, h:1.86, defaultCostume:'leather',
         start:{owned:['crowbar','revolver','shotgun','journal'], ammo:{rounds:12,shells:10,holywater:0,flares:0}, rites:['ward'], meds:1}},
  sam:{name:'Sam', full:'Sam Winchester', phil:'humanism',  brother:'dean',   walk:2.2,  riteMul:1.0,
         special:{id:'banish', name:'Banishing Word'}, h:1.94, defaultCostume:'canvas',
         start:{owned:['crowbar','revolver','holywater','journal'], ammo:{rounds:12,shells:0,holywater:3,flares:0}, rites:['exorcism','lux'], meds:1}},
};

/* ═══ Weapons ════════════════════════════════════════════════════════════
   Damage is per enemy type, which is the whole design: salt scatters ghosts
   and barely slows a demon; the knife is the reverse; bullets are honest about
   neither. The right tool is the puzzle. */
const WEAPONS = {
  crowbar:  {name:'Iron crowbar', slot:1, kind:'melee', rate:.5, range:1.65, swingT:.3,
             dmg:{ghost:55, demon:16, eldritch:10}, sfx:'swing'},
  revolver: {name:'.45 revolver', slot:2, kind:'hitscan', rate:.42, range:22, spread:.008, pellets:1, ammo:'rounds',
             dmg:{ghost:9, demon:30, eldritch:7}, sfx:'revolver', muzzle:[58,15], kick:1},
  shotgun:  {name:'Sawed-off · rock salt', slot:3, kind:'hitscan', rate:.8, range:10, spread:.075, pellets:7, ammo:'shells',
             dmg:{ghost:16, demon:8, eldritch:3}, sfx:'shotgun', muzzle:[59,22], kick:1.6, stun:.5},
  knife:    {name:'Demon-killing knife', slot:4, kind:'melee', rate:.42, range:1.45, swingT:.24,
             dmg:{ghost:8, demon:130, eldritch:22}, sfx:'stab'},
  holywater:{name:'Holy water', slot:5, kind:'throw', rate:.85, ammo:'holywater',
             dmg:{ghost:0, demon:75, eldritch:6}, sfx:'throw'},
  flare:    {name:'Flare gun', slot:6, kind:'projectile', rate:1.1, ammo:'flares',
             dmg:{ghost:48, demon:22, eldritch:40}, sfx:'flare', muzzle:[56,22], kick:1.2},
  journal:  {name:'Journal · incantations', slot:7, kind:'rite'},
};
const WEAPON_ORDER = ['crowbar','revolver','shotgun','knife','holywater','flare','journal'];

/* ═══ Incantations ═══════════════════════════════════════════════════════
   Held, not clicked. The Latin is subtitled line by line as it's spoken, and
   moving or being struck breaks the rite. Sam reads these as written; Dean
   reads them like a man sounding out a manual. The exorcism text is the
   Rituale Romanum, which is several centuries out of copyright. */
const RITES = {
  exorcism:{name:'Rite of Exorcism', time:3.4, needs:'demon', cool:.6,
    lines:['Exorcizamus te, omnis immundus spiritus,','omnis satanica potestas, omnis incursio infernalis adversarii,',
           'omnis legio, omnis congregatio et secta diabolica.','Ergo, draco maledicte — vade, Satana!']},
  lux:     {name:'Lux Perpetua', time:1.7, cool:6,
    lines:['Lux aeterna luceat eis —','et lux perpetua dispergat umbras.']},
  ward:    {name:'Murus Ferreus · iron ward', time:1.5, cool:14,
    lines:['Ferrum et sal, murus mihi esto.']},
  sigil:   {name:'Sigillum Salomonis · devil’s trap', time:2.1, cool:10,
    lines:['Sigillum Salomonis,','liga eos in circulo.']},
};
const RITE_ORDER = ['exorcism','lux','ward','sigil'];

/* ═══ Store ══════════════════════════════════════════════════════════════ */
const SHOP = [
  {group:'Supplies'},
  {id:'shells',   name:'Rock-salt shells ×8',      price:18, apply:()=>{S.ammo.shells+=8;}},
  {id:'rounds',   name:'.45 rounds ×12',           price:20, apply:()=>{S.ammo.rounds+=12;}},
  {id:'flares',   name:'Flares ×3',                price:18, apply:()=>{S.ammo.flares+=3;}},
  {id:'holy',     name:'Holy water ×2',            price:24, apply:()=>{S.ammo.holywater+=2; own('holywater');}},
  {id:'bandage',  name:'Bandages · +15 now',       price:10, can:()=>S.hp<100, apply:()=>heal(15)},
  {id:'medkit',   name:'Med kit · carry, B to use',price:30, can:()=>S.meds<4, apply:()=>{S.meds++;}},
  {id:'battery',  name:'Torch battery',            price:8,  can:()=>S.battery<100, apply:()=>{S.battery=100;}},
  {id:'armor',    name:'Kevlar vest · +50 armour', price:45, can:()=>S.armor<100, apply:()=>{S.armor=Math.min(100,S.armor+50);}},
  {group:'Weapons'},
  {id:'shotgun',  name:'Sawed-off shotgun + 6 shells', price:70, weapon:'shotgun', apply:()=>{own('shotgun'); S.ammo.shells+=6;}},
  {id:'knife',    name:'Demon-killing knife',      price:120, weapon:'knife', apply:()=>own('knife')},
  {id:'flare',    name:'Flare gun + 3 flares',     price:65, weapon:'flare', apply:()=>{own('flare'); S.ammo.flares+=3;}},
  {group:'Enchantments'},
  {id:'bless',    name:'Blessed rounds',           price:40, ench:'blessed', desc:'Revolver +60% against demons'},
  {id:'iron',     name:'Iron-filed shells',        price:40, ench:'iron',    desc:'Shotgun +50% against ghosts'},
  {id:'etch',     name:'Sigil-etched crowbar',     price:45, ench:'etched',  desc:'Crowbar +80% against demons'},
  {group:'Pages'},
  {id:'p_sigil',  name:'Torn page · Sigillum Salomonis', price:50, rite:'sigil'},
  {id:'p_exo',    name:'Torn page · Rite of Exorcism',   price:60, rite:'exorcism'},
  {id:'p_lux',    name:'Torn page · Lux Perpetua',       price:40, rite:'lux'},
];

/* ═══ State ══════════════════════════════════════════════════════════════ */
const S = {
  hero:'dean', cfg:HEROES.dean, costume:'leather', sector:null,
  px:0,py:0,dirX:1,dirY:0,plX:0,plY:FOVP, vx:0,vy:0, angle:0, pitch:0, posZ:0,
  z:0, vz:0, ground:true, crouch:false, bob:0, bobAmp:0, sway:0, landDip:0, stepPhase:0,
  hp:100, armor:0, stamina:100, staminaT:0, meds:0, cash:40,
  weapon:'crowbar', lastWeapon:'revolver', owned:new Set(), ammo:{rounds:0,shells:0,holywater:0,flares:0},
  cool:0, swing:0, recoil:0, switchT:0, muzzle:0, shake:0, hurt:0, ward:0, dash:0, kickT:0,
  special:40, rite:'exorcism', rites:new Set(), riteCool:{}, channel:0, chTarget:null, chLine:-1,
  enchant:{blessed:false, iron:false, etched:false},
  torchOn:false, battery:100, flicker:1, driving:null, highBeam:false,
  preset:'dusk', light:LIGHTING.dusk, renderer:'doom', ascii:0, cutAscii:0,
  running:false, time:0, transition:0, pending:null, mapOpen:false, menu:null,
  obj:0, flags:{}, seenT:0, flash:0, lightningT:6, thunderT:-1, fade:0, cut:null, camZ:0,
  settings:{sound:true, subs:true}, kills:{ghost:0,demon:0}, freed:0,
};
function own(w){ S.owned.add(w); }
function perks(){
  const c=COSTUMES[S.hero][S.costume]||{};
  return {price:c.price||1, stamina:c.stamina||1, armour:c.armour||1, rite:c.rite||1};
}
function costumeLook(){ return COSTUMES[S.hero][S.costume].look; }
function heal(n){ S.hp=Math.min(100,S.hp+n); }

/* ═══ Audio ══════════════════════════════════════════════════════════════
   Procedural, Web Audio only — no files. Shooting with no sound is what makes
   a shooter feel dead, so this earns its place early. */
const AU = {ctx:null, master:null, noise:null, rainG:null, hum:null};
function audioInit(){
  if(AU.ctx||!S.settings.sound) return;
  const AC=window.AudioContext||window.webkitAudioContext; if(!AC) return;
  try{
    AU.ctx=new AC(); AU.master=AU.ctx.createGain(); AU.master.gain.value=.55; AU.master.connect(AU.ctx.destination);
    for(const k of ['fx','amb','mus']){ AU[k]=AU.ctx.createGain(); AU[k].connect(AU.master); }
    if(typeof applyAudioSettings==='function') applyAudioSettings();
    const len=AU.ctx.sampleRate*2, b=AU.ctx.createBuffer(1,len,AU.ctx.sampleRate), d=b.getChannelData(0);
    for(let i=0;i<len;i++) d[i]=Math.random()*2-1;
    AU.noise=b;
    const src=AU.ctx.createBufferSource(); src.buffer=b; src.loop=true;
    const f=AU.ctx.createBiquadFilter(); f.type='bandpass'; f.frequency.value=2600; f.Q.value=.5;
    AU.rainG=AU.ctx.createGain(); AU.rainG.gain.value=0;
    src.connect(f); f.connect(AU.rainG); AU.rainG.connect(AU.amb); src.start();
    if(typeof startScore==='function') startScore();
  }catch(e){ AU.ctx=null; }
}
function nb(o){ const c=AU.ctx, t=c.currentTime+(o.delay||0);
  const s=c.createBufferSource(); s.buffer=AU.noise;
  const f=c.createBiquadFilter(); f.type=o.type||'lowpass'; f.frequency.setValueAtTime(o.freq||1200,t);
  if(o.to) f.frequency.exponentialRampToValueAtTime(o.to,t+o.dur);
  f.Q.value=o.q||.7;
  const g=c.createGain(); g.gain.setValueAtTime(0,t); g.gain.linearRampToValueAtTime(o.gain||.5,t+(o.att||.003));
  g.gain.exponentialRampToValueAtTime(.0006,t+o.dur);
  s.connect(f); f.connect(g); g.connect(AU.dest||AU.fx||AU.master); s.start(t,Math.random()*1.5); s.stop(t+o.dur+.05); }
function tn(o){ const c=AU.ctx, t=c.currentTime+(o.delay||0);
  const s=c.createOscillator(); s.type=o.type||'sine'; s.frequency.setValueAtTime(o.f,t);
  if(o.to) s.frequency.exponentialRampToValueAtTime(o.to,t+o.dur);
  const g=c.createGain(); g.gain.setValueAtTime(0,t); g.gain.linearRampToValueAtTime(o.gain||.25,t+(o.att||.005));
  g.gain.exponentialRampToValueAtTime(.0006,t+o.dur);
  s.connect(g); g.connect(AU.dest||AU.fx||AU.master); s.start(t); s.stop(t+o.dur+.05); }
function sfx(n){
  if(!AU.ctx||!S.settings.sound) return;
  try{ switch(n){
    case 'revolver': nb({dur:.18,freq:3200,to:400,gain:.7}); tn({f:110,to:40,dur:.16,gain:.5,type:'triangle'}); break;
    case 'shotgun':  nb({dur:.34,freq:1800,to:200,gain:.9}); tn({f:80,to:30,dur:.28,gain:.7,type:'triangle'}); break;
    case 'flare':    nb({dur:.4,freq:900,to:3000,type:'bandpass',gain:.5}); tn({f:300,to:900,dur:.3,gain:.12,type:'sawtooth'}); break;
    case 'swing':    nb({dur:.14,freq:500,to:2600,type:'bandpass',q:2,gain:.35}); break;
    case 'stab':     nb({dur:.1,freq:2600,to:900,type:'bandpass',q:3,gain:.35}); break;
    case 'throw':    nb({dur:.2,freq:700,to:1800,type:'bandpass',q:2,gain:.25}); break;
    case 'splash':   nb({dur:.35,freq:2400,to:600,gain:.45}); tn({f:900,to:300,dur:.25,gain:.08}); break;
    case 'hit':      tn({f:140,to:60,dur:.12,gain:.45,type:'triangle'}); nb({dur:.08,freq:900,gain:.25}); break;
    case 'ghost':    tn({f:620,to:180,dur:.6,gain:.14}); tn({f:930,to:260,dur:.6,gain:.08,delay:.05}); break;
    case 'demon':    tn({f:90,to:46,dur:.45,gain:.35,type:'sawtooth'}); break;
    case 'hurt':     tn({f:180,to:70,dur:.22,gain:.35,type:'sawtooth'}); nb({dur:.12,freq:600,gain:.25}); break;
    case 'pickup':   tn({f:880,dur:.08,gain:.18,type:'square'}); tn({f:1320,dur:.1,gain:.15,type:'square',delay:.07}); break;
    case 'buy':      tn({f:1046,dur:.16,gain:.18,type:'triangle'}); tn({f:1568,dur:.22,gain:.14,type:'triangle',delay:.06}); break;
    case 'deny':     tn({f:180,dur:.16,gain:.18,type:'square'}); break;
    case 'switch':   nb({dur:.06,freq:3000,type:'highpass',gain:.25}); tn({f:300,to:200,dur:.06,gain:.12,type:'square',delay:.05}); break;
    case 'step':     nb({dur:.07,freq:260,gain:.22}); break;
    case 'jump':     nb({dur:.1,freq:400,gain:.16}); break;
    case 'land':     tn({f:90,to:50,dur:.12,gain:.35,type:'triangle'}); nb({dur:.08,freq:300,gain:.25}); break;
    case 'door':     tn({f:120,to:90,dur:.5,gain:.12,type:'sawtooth'}); nb({dur:.3,freq:500,gain:.12}); break;
    case 'dry':      nb({dur:.04,freq:4000,type:'highpass',gain:.3}); break;
    case 'tear':     nb({dur:1.6,freq:200,to:3000,type:'bandpass',q:4,gain:.5}); tn({f:55,to:30,dur:1.8,gain:.4,type:'sawtooth'}); break;
    case 'rite':     tn({f:220,dur:.9,gain:.08}); tn({f:330,dur:.9,gain:.06,delay:.02}); break;
    case 'riteEnd':  tn({f:440,to:880,dur:.5,gain:.16}); tn({f:660,to:1320,dur:.5,gain:.1}); nb({dur:.6,freq:4000,type:'highpass',gain:.2}); break;
    case 'riteFail': tn({f:330,to:110,dur:.35,gain:.14,type:'square'}); break;
    case 'special':  tn({f:70,to:200,dur:.35,gain:.4,type:'sawtooth'}); nb({dur:.4,freq:400,to:2000,gain:.4}); break;
    case 'kick':     tn({f:120,to:60,dur:.1,gain:.4,type:'triangle'}); break;
    case 'heal':     tn({f:520,to:780,dur:.35,gain:.12}); break;
    case 'thunder':  nb({dur:2.6,freq:420,to:60,gain:.7,att:.05}); break;
    case 'engine':   tn({f:55,to:70,dur:.8,gain:.25,type:'sawtooth'}); break;
    case 'whisper':  nb({dur:1.4,freq:1800,to:900,type:'bandpass',q:6,gain:.16,att:.4}); nb({dur:1.1,freq:2600,to:1400,type:'bandpass',q:8,gain:.08,delay:.3,att:.3}); break;
    case 'heart':    tn({f:52,to:38,dur:.16,gain:.5,type:'sine'}); tn({f:48,to:34,dur:.2,gain:.38,type:'sine',delay:.24}); break;
    case 'flesh':    nb({dur:.9,freq:260,to:90,gain:.4,att:.1}); tn({f:70,to:44,dur:1,gain:.18,type:'sawtooth'}); break;
    case 'buzz':     tn({f:180,dur:.12,gain:.16,type:'square'}); tn({f:180,dur:.12,gain:.16,type:'square',delay:.2}); break;
    case 'hum':      tn({f:58,to:61,dur:.5,gain:.2,type:'sawtooth'}); tn({f:116,dur:.4,gain:.06,type:'square'}); break;
    case 'shutter':  nb({dur:.04,freq:5000,type:'highpass',gain:.45}); nb({dur:.06,freq:2500,type:'highpass',gain:.3,delay:.08}); break;
    case 'ring':     tn({f:440,dur:.4,gain:.14,type:'square'}); tn({f:480,dur:.4,gain:.12,type:'square'}); tn({f:440,dur:.4,gain:.14,type:'square',delay:.55}); tn({f:480,dur:.4,gain:.12,type:'square',delay:.55}); break;
    case 'static':   nb({dur:1.2,freq:3000,type:'bandpass',q:.6,gain:.22}); break;
    case 'teleD':    tn({f:70,to:110,dur:.35,gain:.32,type:'sawtooth'}); nb({dur:.3,freq:500,to:1400,gain:.2}); break;
    case 'teleG':    tn({f:900,to:1600,dur:.45,gain:.12}); tn({f:450,to:800,dur:.45,gain:.08,delay:.03}); break;
    case 'teleE':    nb({dur:.4,freq:300,to:900,type:'bandpass',q:3,gain:.35}); tn({f:55,to:80,dur:.4,gain:.25,type:'sawtooth'}); break;
    case 'hitmark':  tn({f:1800,dur:.04,gain:.08,type:'square'}); break;
    case 'bell':     tn({f:196,dur:3.2,gain:.22,att:.01}); tn({f:392,dur:2.6,gain:.1,att:.01}); tn({f:587,dur:2,gain:.05,att:.01}); break;
  } }catch(e){}
}

/* ═══ Subtitles and barks ════════════════════════════════════════════════ */
const SPEAKERS = {
  dean:{name:'Dean',col:'#d08a52'}, sam:{name:'Sam',col:'#8fb4e2'}, marla:{name:'Marla',col:'#d6a7c6'},
  earl:{name:'Earl',col:'#c9b27a'}, narr:{name:'',col:'#a9b3ba'}, latin:{name:'',col:'#cfe0ff'},
  phantom:{name:'The shape',col:'#9fd2e6'}, demon:{name:'Something',col:'#c46a6a'},
  kevin:{name:'Kevin',col:'#e2e8f4'}, crowley:{name:'Crowley',col:'#d65a4a'}, delia:{name:'Delia',col:'#8fc4a4'},
  juno:{name:'Juno',col:'#d07080'}, town:{name:'',col:'#b8b0a2'},
  castiel:{name:'Castiel',col:'#b9c9e8'}, alistair:{name:'Father Alistair',col:'#d8cfc0'}, chuck:{name:'Chuck',col:'#e6c27a'},
  lily:{name:'Lily',col:'#a8d8ee'}, sarah:{name:'Sarah',col:'#d89070'}, sheriff:{name:'Sheriff Ames',col:'#c4b080'},
  doctor:{name:'Dr. Halvorsen',col:'#c8d4d8'}, whisper:{name:'',col:'#8a6470'},
};
const SUBQ=[]; let subCur=null, subT=0;
const elSubLine=document.getElementById('subLine');
function say(who,text,dur,opt={}){
  if(opt.now){ SUBQ.length=0; subCur=null; subT=0; }
  SUBQ.push({who,text,dur:dur||Math.max(2.4,text.length*.058),latin:!!opt.latin,name:opt.name});
}
function updateSubs(dt){
  if(subCur){ subT-=dt; if(subT<=0){ subCur=null; elSubLine.classList.remove('on'); } }
  if(!subCur&&SUBQ.length){
    subCur=SUBQ.shift(); subT=subCur.dur;
    if(!S.settings.subs){ elSubLine.classList.remove('on'); return; }
    const sp=SPEAKERS[subCur.who]||SPEAKERS.narr;
    elSubLine.innerHTML='';
    const nm=subCur.name||sp.name;
    if(nm){ const w=document.createElement('span'); w.className='who'; w.style.color=sp.col; w.textContent=nm; elSubLine.appendChild(w); }
    const t=document.createElement('span');
    t.className=subCur.latin?'latin':(subCur.who==='narr'?'narr':'');
    t.textContent=subCur.text; elSubLine.appendChild(t);
    elSubLine.classList.add('on');
  }
}
/* Barks carry the philosophy in passing. Dean deflects; Sam counts the
   cost. Neither of them makes a speech about it mid-fight. */
const BARKS = {
  dean:{
    kill_ghost:['Back in the dirt. Same as the rest of us, eventually.','Rest easy. Or don’t. Not my department.','That’s one.'],
    kill_demon:['Black smoke and a bad attitude. Next.','Whoever was in there — sorry. Wrong night.'],
    exorcise:  ['Latin. Works better than it has any right to.','Go on. Get out of her.'],
    low_hp:    ['Okay. Ow. Noted.','Still standing. That’s the whole trick.','Gonna need a minute. Not getting one.'],
    med:       ['Gauze and spite. Good enough.','Patched. Ugly, but patched.'],
    cash:      ['Somebody’s rainy day. It’s raining.','Finders keepers. Mostly keepers.'],
    dry:       ['Out. Of course I’m out.','Empty.'],
    special:   ['Come here!','Hold still!'],
    see:       ['Company.','Heads up.','There. Moving.'],
    hurt:      ['Hngh—','Son of a—'],
    car:       ['There she is.','Hey, Baby. Miss me?'],
    mill:      ['Smells like a closed account in here.'],
    rite_fail: ['I lost the line. Hell.'],
  },
  sam:{
    kill_ghost:['I’m sorry. I hope that was rest.','Go easy. It’s over now.'],
    kill_demon:['There was a person under that. I should have tried the rite.','That was somebody’s mother. Remember that.'],
    exorcise:  ['Go. And let her keep her name.','You’re free. Breathe.'],
    low_hp:    ['Not yet. There are still people here.','Keep moving. Keep moving.'],
    med:       ['Okay. Patch up, keep going.'],
    cash:      ['We’ll put it back where it’s needed.'],
    dry:       ['Empty — switching.'],
    special:   ['Recedite!','Begone!'],
    see:       ['Something’s there.','Ahead — careful.'],
    hurt:      ['Agh—','No—'],
    car:       ['Still running. Somehow.','Dean, your car smells like gas station burritos.'],
    mill:      ['Six men worked here. Six names.'],
    rite_fail: ['I broke the rite. Again — slowly this time.'],
  },
};
const COMP_BARKS = {
  dean:  {see:['Got one, Sammy.','Left side!'], hurt_player:['Sam! You good?'], kill:['Down.','That’s for Ray.']},
  sam:{see:['Dean — there.','Behind you!'], hurt_player:['Dean, you’re bleeding.'], kill:['It’s done.','Rest.']},
};
const barkCd={};
function bark(ev,force){
  const lines=BARKS[S.hero][ev]; if(!lines) return;
  if(!force&&(barkCd[ev]||0)>S.time) return;
  barkCd[ev]=S.time+7;
  say(S.hero, lines[(Math.random()*lines.length)|0]);
}
function compBark(ev){
  const b=HEROES[S.hero].brother, lines=(COMP_BARKS[b]||{})[ev]; if(!lines) return;
  if((barkCd['c_'+ev]||0)>S.time) return;
  barkCd['c_'+ev]=S.time+9;
  say(b, lines[(Math.random()*lines.length)|0]);
}
