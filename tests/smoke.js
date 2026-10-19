const {load}=require('./harness');
let G; try{ G=load(); console.log('loaded OK'); }catch(e){ console.log('LOAD FAIL:',e.stack.split('\n').slice(0,4).join('\n')); process.exit(1); }
let t=0; const step=(n=1,dt=16)=>{ for(let i=0;i<n;i++){ t+=dt; G.frame(t); } };
try{ step(5); console.log('boot frames OK'); }catch(e){ console.log('BOOT FRAME FAIL:',e.stack.split('\n').slice(0,5).join('\n')); }
try{ G.begin('dean'); console.log('begin OK, cutscene:',G.S.cut&&G.S.cut.id); step(60); console.log('intro frames OK'); }
catch(e){ console.log('BEGIN/INTRO FAIL:',e.stack.split('\n').slice(0,6).join('\n')); }
