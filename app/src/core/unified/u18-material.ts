import {ORIGINAL_U17_CONNECTED_READINGS,u17OriginalEvidence,listeningQuestionsForU17,
 originalOralResponseU17,u17ProductionChoices,validateU17Materials} from './u17-material.ts';
import {ORIGINAL_U18_SCENARIOS} from './u18-course.ts';
import type {A1Unit} from './u6-a1-model.ts';
import type {B1Reading} from './u10-readings-01-07.ts';
import type {A1ListeningQuestion} from './u7-listening.ts';
import type {TransferEvidence,TransferQuestion} from './u13-transfer-model.ts';

export const ORIGINAL_U18_CONNECTED_READINGS:readonly B1Reading[]=Object.freeze([
 ...ORIGINAL_U17_CONNECTED_READINGS,...ORIGINAL_U18_SCENARIOS.map(s=>s.reading)
]);
export function getU18ConnectedReading(id:string):B1Reading|null{
 return ORIGINAL_U18_CONNECTED_READINGS.find(reading=>reading.unitId===id)??null;
}
export function u18OriginalEvidence(id:string):Readonly<{sources:readonly TransferEvidence[];questions:readonly TransferQuestion[]}>|null{
 const scenario=ORIGINAL_U18_SCENARIOS.find(s=>s.unit.id===id);
 return scenario?{sources:scenario.evidence,questions:scenario.crossQuestions}:u17OriginalEvidence(id);
}
export function listeningQuestionsForU18(unit:A1Unit):readonly A1ListeningQuestion[]{
 return ORIGINAL_U18_SCENARIOS.find(s=>s.unit.id===unit.id)?.listening??listeningQuestionsForU17(unit);
}
export function originalOralResponseU18(id:string){
 return ORIGINAL_U18_SCENARIOS.find(s=>s.unit.id===id)?.oral??originalOralResponseU17(id);
}
export function u18ProductionChoices(id:string){
 return ORIGINAL_U18_SCENARIOS.find(s=>s.unit.id===id)?.writingChoices??u17ProductionChoices(id);
}
export function validateU18Materials():readonly string[]{
 const issues=[...validateU17Materials()];
 if(ORIGINAL_U18_CONNECTED_READINGS.length!==132)
  issues.push('Expected 42 original B1 readings and 15 each U13 to U18');
 for(const s of ORIGINAL_U18_SCENARIOS){
  if(getU18ConnectedReading(s.unit.id)?.questions.length!==3)issues.push(s.unit.id+' reading');
  if(u18OriginalEvidence(s.unit.id)?.questions.length!==2)issues.push(s.unit.id+' source comparison');
  if(listeningQuestionsForU18(s.unit).length!==6)issues.push(s.unit.id+' listening');
  if(!originalOralResponseU18(s.unit.id)||!u18ProductionChoices(s.unit.id)?.fromDebate)
   issues.push(s.unit.id+' autonomous writing');
 }
 return issues;
}
