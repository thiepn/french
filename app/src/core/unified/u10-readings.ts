import {B1_READINGS_01_07,type B1Reading} from './u10-readings-01-07.ts';
import {B1_READINGS_08_14} from './u10-readings-08-14.ts';
import {ORIGINAL_B1_UNITS} from './u10-course.ts';

export const ORIGINAL_B1_READINGS:readonly B1Reading[]=Object.freeze([
 ...B1_READINGS_01_07,...B1_READINGS_08_14
]);
export function getOriginalB1Reading(unitId:string):B1Reading|null{
 return ORIGINAL_B1_READINGS.find(reading=>reading.unitId===unitId)??null;
}
export function validateOriginalB1Readings():readonly string[]{
 const errors:string[]=[];
 if(ORIGINAL_B1_READINGS.length!==14)errors.push('Expected 14 original B1 readings');
 for(const [i,reading] of ORIGINAL_B1_READINGS.entries()){
  const id='b1-'+String(i+1).padStart(2,'0');
  if(reading.unitId!==id)errors.push('Reading identity '+reading.unitId);
  const words=reading.french.trim().split(/\s+/);
  if(words.length<100||!reading.title||reading.questions.length!==2)
   errors.push('Reading depth '+id);
  for(const q of reading.questions){
   if(!q.prompt||!q.answer||q.options.length<3||!q.options.includes(q.answer)||
      q.explanation.length<35)errors.push('Reading comprehension evidence '+id);
  }
 }
 for(const unit of ORIGINAL_B1_UNITS)
  if(!getOriginalB1Reading(unit.id))errors.push('Missing original reading '+unit.id);
 return errors;
}
