import {ALL_ORIGINAL_CONNECTED_READINGS,originalTransferEvidence,listeningQuestionsForU13,
 originalOralResponseU13,validateU13OriginalMaterials} from './u13-material.ts';
import {ORIGINAL_U14_SCENARIOS} from './u14-course.ts';
import type {A1Unit} from './u6-a1-model.ts';
import type {B1Reading} from './u10-readings-01-07.ts';
import type {A1ListeningQuestion} from './u7-listening.ts';
import type {TransferEvidence,TransferQuestion} from './u13-transfer-model.ts';

export const ORIGINAL_U14_CONNECTED_READINGS:readonly B1Reading[]=Object.freeze([
 ...ALL_ORIGINAL_CONNECTED_READINGS,...ORIGINAL_U14_SCENARIOS.map(s=>s.reading)
]);
export function getU14ConnectedReading(id:string):B1Reading|null{
 return ORIGINAL_U14_CONNECTED_READINGS.find(s=>s.unitId===id)??null;
}
export function u14OriginalEvidence(id:string):Readonly<{sources:readonly TransferEvidence[];questions:readonly TransferQuestion[]}>|null{
 const scenario=ORIGINAL_U14_SCENARIOS.find(s=>s.unit.id===id);
 return scenario?{sources:scenario.evidence,questions:scenario.crossQuestions}:originalTransferEvidence(id);
}
export function listeningQuestionsForU14(unit:A1Unit):readonly A1ListeningQuestion[]{
 return ORIGINAL_U14_SCENARIOS.find(s=>s.unit.id===unit.id)?.listening??listeningQuestionsForU13(unit);
}
export function originalOralResponseU14(id:string){
 return ORIGINAL_U14_SCENARIOS.find(s=>s.unit.id===id)?.oral??originalOralResponseU13(id);
}
export function u14ProductionChoices(id:string){
 return ORIGINAL_U14_SCENARIOS.find(s=>s.unit.id===id)?.writingChoices??null;
}
export function validateU14Materials():readonly string[]{
 const issues=[...validateU13OriginalMaterials()];
 if(ORIGINAL_U14_CONNECTED_READINGS.length!==72)
  issues.push('Expected 42 original B1 + 15 U13 + 15 U14 original readings');
 for(const s of ORIGINAL_U14_SCENARIOS){
  const id=s.unit.id;
  if(getU14ConnectedReading(id)?.questions.length!==3)issues.push(id+' reading');
  if(u14OriginalEvidence(id)?.questions.length!==2)issues.push(id+' source comparison');
  if(listeningQuestionsForU14(s.unit).length!==3)issues.push(id+' listening inference');
  if(!originalOralResponseU14(id)||!u14ProductionChoices(id))issues.push(id+' independent production');
 }
 return issues;
}
