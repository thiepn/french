export interface HydratedLearnerState{currentLevel?:string;dueCount?:number;streakDays?:number;}

function hasSummary(value:HydratedLearnerState):boolean{
  return value.currentLevel!==undefined||value.dueCount!==undefined||value.streakDays!==undefined;
}

// Shared startup gate: route-level consumers must not race the same P35
// preservation/migration with background shell hydration.
let inFlightHydration:Promise<HydratedLearnerState>|null=null;
export async function hydrateLearnerState():Promise<HydratedLearnerState>{
  if(inFlightHydration)return inFlightHydration;
  const work=(async():Promise<HydratedLearnerState>=>{
  const { readLearnerSummary }=await import('./idb');
  const current=await readLearnerSummary();
  if(hasSummary(current))return current;

  const { preserveLegacyStateOnce }=await import('../migration/import');
  const envelope=await preserveLegacyStateOnce();
  if(envelope){
    const { migrateLegacyEnvelopeOnce }=await import('../learner/migrate');
    return migrateLegacyEnvelopeOnce(envelope);
  }

  const { ensureCanonicalLearnerState }=await import('../learner/repository');
  await ensureCanonicalLearnerState();
  return{dueCount:0,streakDays:0};
  })();
  inFlightHydration=work;
  try{return await work;}finally{if(inFlightHydration===work)inFlightHydration=null;}
}
