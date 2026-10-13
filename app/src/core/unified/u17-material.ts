import {ORIGINAL_U16_CONNECTED_READINGS,u16OriginalEvidence,listeningQuestionsForU16,
 originalOralResponseU16,u16ProductionChoices,validateU16Materials} from './u16-material.ts';
import {ORIGINAL_U17_SCENARIOS} from './u17-course.ts';
import type {A1Unit} from './u6-a1-model.ts';
import type {B1Reading} from './u10-readings-01-07.ts';
import type {A1ListeningQuestion} from './u7-listening.ts';
import type {TransferEvidence,TransferQuestion} from './u13-transfer-model.ts';

export const ORIGINAL_U17_CONNECTED_READINGS:readonly B1Reading[]=Object.freeze([
 ...ORIGINAL_U16_CONNECTED_READINGS,...ORIGINAL_U17_SCENARIOS.map(s=>s.reading)
]);
export function getU17ConnectedReading(id:string):B1Reading|null{
 return ORIGINAL_U17_CONNECTED_READINGS.find(reading=>reading.unitId===id)??null;
}
export function u17OriginalEvidence(id:string):Readonly<{sources:readonly TransferEvidence[];questions:readonly TransferQuestion[]}>|null{
 const scenario=ORIGINAL_U17_SCENARIOS.find(s=>s.unit.id===id);
 return scenario?{sources:scenario.evidence,questions:scenario.crossQuestions}:u16OriginalEvidence(id);
}
export function listeningQuestionsForU17(unit:A1Unit):readonly A1ListeningQuestion[]{
 return ORIGINAL_U17_SCENARIOS.find(s=>s.unit.id===unit.id)?.listening??listeningQuestionsForU16(unit);
}
export function originalOralResponseU17(id:string){
 return ORIGINAL_U17_SCENARIOS.find(s=>s.unit.id===id)?.oral??originalOralResponseU16(id);
}
export function u17ProductionChoices(id:string){
 return ORIGINAL_U17_SCENARIOS.find(s=>s.unit.id===id)?.writingChoices??u16ProductionChoices(id);
}
export function validateU17Materials():readonly string[]{
 const issues=[...validateU16Materials()];
 if(ORIGINAL_U17_CONNECTED_READINGS.length!==117)
  issues.push('Expected 42 B1 readings + 15 each U13/U14/U15/U16/U17');
 for(const s of ORIGINAL_U17_SCENARIOS){
  if(getU17ConnectedReading(s.unit.id)?.questions.length!==3)issues.push(s.unit.id+' reading');
  if(u17OriginalEvidence(s.unit.id)?.questions.length!==2)issues.push(s.unit.id+' paired source comparison');
  if(listeningQuestionsForU17(s.unit).length!==6)issues.push(s.unit.id+' listening inference');
  if(!originalOralResponseU17(s.unit.id)||!u17ProductionChoices(s.unit.id)?.fromDebate)
   issues.push(s.unit.id+' independent production');
 }
 return issues;
}
