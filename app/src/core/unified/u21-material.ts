import {ORIGINAL_U20_CONNECTED_READINGS,u20OriginalEvidence,listeningQuestionsForU20,
 originalOralResponseU20,u20ProductionChoices,validateU20Materials} from './u20-material.ts';
import {ORIGINAL_U21_SCENARIOS} from './u21-course.ts';
import type {A1Unit} from './u6-a1-model.ts';
import type {B1Reading} from './u10-readings-01-07.ts';
import type {A1ListeningQuestion} from './u7-listening.ts';
import type {TransferEvidence,TransferQuestion} from './u13-transfer-model.ts';
export const ORIGINAL_U21_CONNECTED_READINGS:readonly B1Reading[]=Object.freeze([
 ...ORIGINAL_U20_CONNECTED_READINGS,...ORIGINAL_U21_SCENARIOS.map(s=>s.reading)
]);
export function getU21ConnectedReading(id:string):B1Reading|null{
 return ORIGINAL_U21_CONNECTED_READINGS.find(r=>r.unitId===id)??null;
}
export function u21OriginalEvidence(id:string):Readonly<{sources:readonly TransferEvidence[];questions:readonly TransferQuestion[]}>|null{
 const s=ORIGINAL_U21_SCENARIOS.find(x=>x.unit.id===id);
 return s?{sources:s.evidence,questions:s.crossQuestions}:u20OriginalEvidence(id);
}
export function listeningQuestionsForU21(unit:A1Unit):readonly A1ListeningQuestion[]{
 return ORIGINAL_U21_SCENARIOS.find(s=>s.unit.id===unit.id)?.listening??listeningQuestionsForU20(unit);
}
export function originalOralResponseU21(id:string){
 return ORIGINAL_U21_SCENARIOS.find(s=>s.unit.id===id)?.oral??originalOralResponseU20(id);
}
export function u21ProductionChoices(id:string){
 return ORIGINAL_U21_SCENARIOS.find(s=>s.unit.id===id)?.writingChoices??u20ProductionChoices(id);
}
export function validateU21Materials():readonly string[]{
 const issues=[...validateU20Materials()];
 if(ORIGINAL_U21_CONNECTED_READINGS.length!==177)
  issues.push('Expected 42 inherited original B1 readings plus 15 each U13–U21');
 for(const s of ORIGINAL_U21_SCENARIOS){
  if(getU21ConnectedReading(s.unit.id)?.questions.length!==3)issues.push(s.unit.id+' reading');
  if(u21OriginalEvidence(s.unit.id)?.questions.length!==2)issues.push(s.unit.id+' paired evidence');
  if(listeningQuestionsForU21(s.unit).length!==6)issues.push(s.unit.id+' optional device-TTS listening');
  if(!originalOralResponseU21(s.unit.id)||!u21ProductionChoices(s.unit.id)?.fromDebate)
   issues.push(s.unit.id+' autonomous expression');
 }
 return issues;
}
