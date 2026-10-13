import {ORIGINAL_U18_CONNECTED_READINGS,u18OriginalEvidence,listeningQuestionsForU18,
 originalOralResponseU18,u18ProductionChoices,validateU18Materials} from './u18-material.ts';
import {ORIGINAL_U19_SCENARIOS} from './u19-course.ts';
import type {A1Unit} from './u6-a1-model.ts';
import type {B1Reading} from './u10-readings-01-07.ts';
import type {A1ListeningQuestion} from './u7-listening.ts';
import type {TransferEvidence,TransferQuestion} from './u13-transfer-model.ts';
export const ORIGINAL_U19_CONNECTED_READINGS:readonly B1Reading[]=Object.freeze([
 ...ORIGINAL_U18_CONNECTED_READINGS,...ORIGINAL_U19_SCENARIOS.map(s=>s.reading)
]);
export function getU19ConnectedReading(id:string):B1Reading|null{
 return ORIGINAL_U19_CONNECTED_READINGS.find(r=>r.unitId===id)??null;
}
export function u19OriginalEvidence(id:string):Readonly<{sources:readonly TransferEvidence[];questions:readonly TransferQuestion[]}>|null{
 const s=ORIGINAL_U19_SCENARIOS.find(x=>x.unit.id===id);
 return s?{sources:s.evidence,questions:s.crossQuestions}:u18OriginalEvidence(id);
}
export function listeningQuestionsForU19(unit:A1Unit):readonly A1ListeningQuestion[]{
 return ORIGINAL_U19_SCENARIOS.find(s=>s.unit.id===unit.id)?.listening??listeningQuestionsForU18(unit);
}
export function originalOralResponseU19(id:string){
 return ORIGINAL_U19_SCENARIOS.find(s=>s.unit.id===id)?.oral??originalOralResponseU18(id);
}
export function u19ProductionChoices(id:string){
 return ORIGINAL_U19_SCENARIOS.find(s=>s.unit.id===id)?.writingChoices??u18ProductionChoices(id);
}
export function validateU19Materials():readonly string[]{
 const issues=[...validateU18Materials()];
 if(ORIGINAL_U19_CONNECTED_READINGS.length!==147)issues.push('Expected 42 original B1 readings plus 15 each U13–U19');
 for(const s of ORIGINAL_U19_SCENARIOS){
  if(getU19ConnectedReading(s.unit.id)?.questions.length!==3)issues.push(s.unit.id+' reading');
  if(u19OriginalEvidence(s.unit.id)?.questions.length!==2)issues.push(s.unit.id+' source comparison');
  if(listeningQuestionsForU19(s.unit).length!==6)issues.push(s.unit.id+' listening');
  if(!originalOralResponseU19(s.unit.id)||!u19ProductionChoices(s.unit.id)?.fromDebate)
   issues.push(s.unit.id+' independent production');
 }
 return issues;
}
