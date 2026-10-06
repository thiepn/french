export interface HydratedLearnerState{currentLevel?:string;dueCount?:number;streakDays?:number;}
export async function hydrateLearnerState():Promise<HydratedLearnerState>{const { readLearnerSummary }=await import('./idb');return readLearnerSummary();}
