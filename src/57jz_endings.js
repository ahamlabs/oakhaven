/* Endings E, F and G (the stranger's endings) at the base of the epilogue
   chain, so every later layer (arcs, the vigil, the gathering, hearts) can
   add its lines to them as it does to A to C. godEpilogue is in 57q. */
{ const was=epilogue; epilogue=function(k){ if(k==='E'||k==='F'||k==='G') return godEpilogue(k); return was(k); }; }
