import {ORIGINAL_U15_CONNECTED_READINGS,u15OriginalEvidence,listeningQuestionsForU15,
 originalOralResponseU15,u15ProductionChoices,validateU15Materials} from './u15-material.ts';
import {ORIGINAL_U16_SCENARIOS} from './u16-course.ts';
import type {A1Unit} from './u6-a1-model.ts';
import type {B1Reading} from './u10-readings-01-07.ts';
import type {A1ListeningQuestion} from './u7-listening.ts';
import type {TransferEvidence,TransferQuestion} from './u13-transfer-model.ts';

export const ORIGINAL_U16_CONNECTED_READINGS:readonly B1Reading[]=Object.freeze([
 ...ORIGINAL_U15_CONNECTED_READINGS,...ORIGINAL_U16_SCENARIOS.map(s=>s.reading)
]);
export function getU16ConnectedReading(id:string):B1Reading|null{
 return ORIGINAL_U16_CONNECTED_READINGS.find(reading=>reading.unitId===id)??null;
}
export function u16OriginalEvidence(id:string):Readonly<{sources:readonly TransferEvidence[];questions:readonly TransferQuestion[]}>|null{
 const scenario=ORIGINAL_U16_SCENARIOS.find(s=>s.unit.id===id);
 return scenario?{sources:scenario.evidence,questions:scenario.crossQuestions}:u15OriginalEvidence(id);
}
export function listeningQuestionsForU16(unit:A1Unit):readonly A1ListeningQuestion[]{
 return ORIGINAL_U16_SCENARIOS.find(s=>s.unit.id===unit.id)?.listening??listeningQuestionsForU15(unit);
}
export function originalOralResponseU16(id:string){
 return ORIGINAL_U16_SCENARIOS.find(s=>s.unit.id===id)?.oral??originalOralResponseU15(id);
}
export function u16ProductionChoices(id:string){
 return ORIGINAL_U16_SCENARIOS.find(s=>s.unit.id===id)?.writingChoices??u15ProductionChoices(id);
}
export function validateU16Materials():readonly string[]{
 const issues=[...validateU15Materials()];
 if(ORIGINAL_U16_CONNECTED_READINGS.length!==102)
  issues.push('Expected 42 original B1 readings + 15 each U13/U14/U15/U16');
 for(const s of ORIGINAL_U16_SCENARIOS){
  if(getU16ConnectedReading(s.unit.id)?.questions.length!==3)issues.push(s.unit.id+' reading');
  if(u16OriginalEvidence(s.unit.id)?.questions.length!==2)issues.push(s.unit.id+' comparison');
  if(listeningQuestionsForU16(s.unit).length!==5)issues.push(s.unit.id+' listening depth');
  if(!originalOralResponseU16(s.unit.id)||!u16ProductionChoices(s.unit.id)?.fromDebate)
   issues.push(s.unit.id+' independent production');
 }
 return issues;
}
