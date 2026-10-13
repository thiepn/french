import {ORIGINAL_U19_CONNECTED_READINGS,u19OriginalEvidence,listeningQuestionsForU19,
 originalOralResponseU19,u19ProductionChoices,validateU19Materials} from './u19-material.ts';
import {ORIGINAL_U20_SCENARIOS} from './u20-course.ts';
import type {A1Unit} from './u6-a1-model.ts';
import type {B1Reading} from './u10-readings-01-07.ts';
import type {A1ListeningQuestion} from './u7-listening.ts';
import type {TransferEvidence,TransferQuestion} from './u13-transfer-model.ts';

export const ORIGINAL_U20_CONNECTED_READINGS:readonly B1Reading[]=Object.freeze([
 ...ORIGINAL_U19_CONNECTED_READINGS,...ORIGINAL_U20_SCENARIOS.map(s=>s.reading)
]);
export function getU20ConnectedReading(id:string):B1Reading|null{
 return ORIGINAL_U20_CONNECTED_READINGS.find(r=>r.unitId===id)??null;
}
export function u20OriginalEvidence(id:string):Readonly<{sources:readonly TransferEvidence[];questions:readonly TransferQuestion[]}>|null{
 const s=ORIGINAL_U20_SCENARIOS.find(x=>x.unit.id===id);
 return s?{sources:s.evidence,questions:s.crossQuestions}:u19OriginalEvidence(id);
}
export function listeningQuestionsForU20(unit:A1Unit):readonly A1ListeningQuestion[]{
 return ORIGINAL_U20_SCENARIOS.find(s=>s.unit.id===unit.id)?.listening??listeningQuestionsForU19(unit);
}
export function originalOralResponseU20(id:string){
 return ORIGINAL_U20_SCENARIOS.find(s=>s.unit.id===id)?.oral??originalOralResponseU19(id);
}
export function u20ProductionChoices(id:string){
 return ORIGINAL_U20_SCENARIOS.find(s=>s.unit.id===id)?.writingChoices??u19ProductionChoices(id);
}
export function validateU20Materials():readonly string[]{
 const issues=[...validateU19Materials()];
 if(ORIGINAL_U20_CONNECTED_READINGS.length!==162)issues.push('Expected 42 original B1 readings and 15 each U13–U20');
 for(const s of ORIGINAL_U20_SCENARIOS){
  if(getU20ConnectedReading(s.unit.id)?.questions.length!==3)issues.push(s.unit.id+' reading');
  if(u20OriginalEvidence(s.unit.id)?.questions.length!==2)issues.push(s.unit.id+' paired sources');
  if(listeningQuestionsForU20(s.unit).length!==6)issues.push(s.unit.id+' listening');
  if(!originalOralResponseU20(s.unit.id)||!u20ProductionChoices(s.unit.id)?.fromDebate)issues.push(s.unit.id+' writing');
 }
 return issues;
}
