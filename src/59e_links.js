/* ═══ Case network: who wanted what, for the new cases ══════════════════════ */
Object.assign(PREFS,{
  radio:{dean:'follow',sam:'keep',why:{destroy:'destroying the transmitter',keep:'keeping the tapes',follow:'chasing the call'}},
  reed:{dean:'drive',sam:'accept',why:{accept:'leaving Glenn with his family',drive:'walking Glenn into the fog',rite:'testing Glenn with the rite'}},
  inventory:{dean:'destroy',sam:'return',why:{return:'giving the things back',catalogue:'building Earl an archive',destroy:'burning the things on the step'}},
  contract:{dean:'burn',sam:'trade',why:{break:'breaking the chain',trade:'trading with the collector',burn:'burning the paperwork'}},
  saint:{dean:'rest',sam:'reveal',why:{reveal:'reading the confessions out',rest:'laying the dead to rest',keep:'giving the letters to the sheriff'}},
  sky:{dean:'destroy',sam:'kevin',why:{destroy:'burning the drawings',kevin:'keeping the drawings for Kevin',delia:'letting the teacher explain'}},
  broadcast:{dean:'destroy',sam:'splice',why:{destroy:'burning the master tape',broadcast:'putting it all on air',splice:'splicing in our own scene'}},
});
/* the chapter-select skip list covers the new cases too */
{ const was=startAt; startAt=function(act){ was(act);
    const before={radio:2,reed:3,inventory:3,contract:3,saint:3,sky:3};
    for(const [id,a] of Object.entries(before)) if(act>=a) S.inv.closed[id]=true; }; }
