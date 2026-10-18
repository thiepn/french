import {ORIGINAL_B1_READINGS,validateOriginalB1Readings} from './u10-readings.ts';
import {U11_READINGS_15_21} from './u11-readings-15-21.ts';
import {U11_READINGS_22_28} from './u11-readings-22-28.ts';
import {B1_DEPTH_UNITS} from './u11-course.ts';
import type {B1Reading} from './u10-readings-01-07.ts';

export const U11_NEW_READINGS:readonly B1Reading[]=Object.freeze([
 ...U11_READINGS_15_21,...U11_READINGS_22_28
]);
export const FULL_ORIGINAL_B1_READINGS:readonly B1Reading[]=Object.freeze([
 ...ORIGINAL_B1_READINGS,...U11_NEW_READINGS
]);
export function getFullB1Reading(unitId:string):B1Reading|null{
 return FULL_ORIGINAL_B1_READINGS.find(reading=>reading.unitId===unitId)??null;
}
export function validateU11Readings():readonly string[]{
 const problems=[...validateOriginalB1Readings()];
 if(U11_NEW_READINGS.length!==14||FULL_ORIGINAL_B1_READINGS.length!==28)
  problems.push('Expect 14 new and 28 cumulative B1 readings');
 if(new Set(FULL_ORIGINAL_B1_READINGS.map(r=>r.unitId)).size!==28)
  problems.push('Duplicated original B1 reading IDs');
 for(const [i,reading] of U11_NEW_READINGS.entries()){
  const id='b1-'+String(i+15).padStart(2,'0');
  if(reading.unitId!==id||!B1_DEPTH_UNITS.some(u=>u.id===id))problems.push(id+' source link');
  const paragraphs=reading.french.split(/\n\s*\n/);
  if(paragraphs.length<3||reading.french.trim().split(/\s+/).length<190)
   problems.push(id+' multi-paragraph original reading depth');
  if(reading.questions.length!==3)problems.push(id+' inference and synthesis breadth');
  for(const [j,q] of reading.questions.entries()){
   if(!q.prompt||!q.answer||q.options.length!==3||!q.options.includes(q.answer)||
     q.explanation.length<40)problems.push(id+' evidence item '+(j+1));
  }
 }
 return problems;
}
