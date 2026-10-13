import {FULL_ORIGINAL_B1_READINGS,validateU11Readings} from './u11-readings.ts';
import {listeningQuestionsForU11Course,validateU11Listening} from './u11-listening.ts';
import {U12_ORIGINAL_CONTENT,U12_ORIGINAL_UNITS} from './u12-course.ts';
import type {B1Reading} from './u10-readings-01-07.ts';
import type {A1ListeningQuestion} from './u7-listening.ts';
import type {A1Unit} from './u6-a1-model.ts';

export const U12_NEW_READINGS:readonly B1Reading[]=Object.freeze(U12_ORIGINAL_CONTENT.map(x=>x.reading));
export const ALL_B1_ORIGINAL_READINGS:readonly B1Reading[]=Object.freeze([
 ...FULL_ORIGINAL_B1_READINGS,...U12_NEW_READINGS
]);
export function getOriginalB1ReadingU12(id:string):B1Reading|null{
 return ALL_B1_ORIGINAL_READINGS.find(r=>r.unitId===id)??null;
}
export function listeningQuestionsForU12Course(unit:A1Unit):readonly A1ListeningQuestion[]{
 return U12_ORIGINAL_CONTENT.find(x=>x.unit.id===unit.id)?.listening??
  listeningQuestionsForU11Course(unit);
}
/** Ungraded speaking practice: learner chooses whether to speak aloud; no mic or auto assessment. */
export function oralResponseForU12(id:string){
 return U12_ORIGINAL_CONTENT.find(x=>x.unit.id===id)?.oral??null;
}
export function validateU12OriginalMaterials():readonly string[]{
 const errors=[...validateU11Readings(),...validateU11Listening()];
 if(ALL_B1_ORIGINAL_READINGS.length!==42||U12_NEW_READINGS.length!==14)
  errors.push('Expected 42 original B1 readings including fourteen new');
 if(new Set(ALL_B1_ORIGINAL_READINGS.map(r=>r.unitId)).size!==42)
  errors.push('Repeated B1 reading identity');
 for(const unit of U12_ORIGINAL_UNITS){
  const reading=getOriginalB1ReadingU12(unit.id);
  const qs=listeningQuestionsForU12Course(unit);
  const oral=oralResponseForU12(unit.id);
  if(!reading||reading.questions.length!==3||reading.french.split(/\n\s*\n/).length!==3)
   errors.push(unit.id+' connected reading');
  if(qs.length!==2||!qs.every(q=>q.options.includes(q.answer)))
   errors.push(unit.id+' listening');
  if(!oral||oral.plan.length<3||oral.model.length<110)
   errors.push(unit.id+' oral practice model');
 }
 return errors;
}
