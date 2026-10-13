import {ORIGINAL_U21_CONNECTED_READINGS,u21OriginalEvidence,listeningQuestionsForU21,
 originalOralResponseU21,u21ProductionChoices,validateU21Materials} from './u21-material.ts';
import {ORIGINAL_U22_SCENARIOS} from './u22-course.ts';
import type {A1Unit} from './u6-a1-model.ts';
import type {B1Reading} from './u10-readings-01-07.ts';
import type {A1ListeningQuestion} from './u7-listening.ts';
import type {TransferEvidence,TransferQuestion} from './u13-transfer-model.ts';
/** Delegate all inherited original material without changing existing native engines. */
export const ORIGINAL_U22_CONNECTED_READINGS:readonly B1Reading[]=Object.freeze([
 ...ORIGINAL_U21_CONNECTED_READINGS,...ORIGINAL_U22_SCENARIOS.map(s=>s.reading)
]);
export function getU22ConnectedReading(id:string):B1Reading|null{
 return ORIGINAL_U22_CONNECTED_READINGS.find(r=>r.unitId===id)??null;
}
export function u22OriginalEvidence(id:string):Readonly<{sources:readonly TransferEvidence[];questions:readonly TransferQuestion[]}>|null{
 const story=ORIGINAL_U22_SCENARIOS.find(s=>s.unit.id===id);
 return story?{sources:story.evidence,questions:story.crossQuestions}:u21OriginalEvidence(id);
}
export function listeningQuestionsForU22(unit:A1Unit):readonly A1ListeningQuestion[]{
 return ORIGINAL_U22_SCENARIOS.find(s=>s.unit.id===unit.id)?.listening??listeningQuestionsForU21(unit);
}
export function originalOralResponseU22(id:string){
 return ORIGINAL_U22_SCENARIOS.find(s=>s.unit.id===id)?.oral??originalOralResponseU21(id);
}
export function u22ProductionChoices(id:string){
 return ORIGINAL_U22_SCENARIOS.find(s=>s.unit.id===id)?.writingChoices??u21ProductionChoices(id);
}
export function validateU22Materials():readonly string[]{
 const errors=[...validateU21Materials()];
 if(ORIGINAL_U22_CONNECTED_READINGS.length!==183)
  errors.push('Expected 183 original connected readings');
 for(const story of ORIGINAL_U22_SCENARIOS){
  const id=story.unit.id;
  if(getU22ConnectedReading(id)?.questions.length!==3)errors.push(id+' reading');
  if(u22OriginalEvidence(id)?.questions.length!==2)errors.push(id+' sources');
  if(listeningQuestionsForU22(story.unit).length!==6)errors.push(id+' dialogue listening');
  if(!originalOralResponseU22(id)||!u22ProductionChoices(id)?.fromDebate)
   errors.push(id+' writing/oral support');
 }
 return errors;
}
