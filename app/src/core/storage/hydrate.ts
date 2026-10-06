export interface HydratedLearnerState{currentLevel?:string;dueCount?:number;streakDays?:number;}

function hasSummary(value:HydratedLearnerState):boolean{
  return value.currentLevel!==undefined||value.dueCount!==undefined||value.streakDays!==undefined;
}

export async function hydrateLearnerState():Promise<HydratedLearnerState>{
  const { readLearnerSummary }=await import('./idb');
  const current=await readLearnerSummary();
  if(hasSummary(current))return current;

  const { preserveLegacyStateOnce }=await import('../migration/import');
  const envelope=await preserveLegacyStateOnce();
  if(!envelope)return{};

  const { migrateLegacyEnvelopeOnce }=await import('../learner/migrate');
  return migrateLegacyEnvelopeOnce(envelope);
}
