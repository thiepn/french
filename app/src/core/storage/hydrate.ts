export interface HydratedLearnerState{currentLevel?:string;dueCount?:number;streakDays?:number;}

function hasSummary(value:HydratedLearnerState):boolean{
  return value.currentLevel!==undefined||value.dueCount!==undefined||value.streakDays!==undefined;
}

export async function hydrateLearnerState():Promise<HydratedLearnerState>{
  const { readLearnerSummary }=await import('./idb');
  const current=await readLearnerSummary();
  if(hasSummary(current)) return current;

  const { importLegacyStateOnce }=await import('../migration/import');
  return (await importLegacyStateOnce())??{};
}
