import {FULL_ORIGINAL_FRENCH_COURSE,validateFullFrenchCourse} from './u9-course.ts';
import {B1_UNITS_01_04} from './u10-b1-01-04.ts';
import {B1_UNITS_05_08} from './u10-b1-05-08.ts';
import {B1_UNITS_09_11} from './u10-b1-09-11.ts';
import {B1_UNITS_12_14} from './u10-b1-12-14.ts';
import {validateB1Units} from './u10-b1-model.ts';
import {SOURCES} from './source.ts';
import type {A1Unit} from './u6-a1-model.ts';

export const ORIGINAL_B1_UNITS:readonly A1Unit[]=Object.freeze([
 ...B1_UNITS_01_04,...B1_UNITS_05_08,...B1_UNITS_09_11,...B1_UNITS_12_14
]);
/** One original full Course and the original U6 renderer; earlier IDs and review authority unchanged. */
export const ORIGINAL_A1_A2_B1_COURSE:readonly A1Unit[]=Object.freeze([
 ...FULL_ORIGINAL_FRENCH_COURSE,...ORIGINAL_B1_UNITS
]);
export function getOriginalCourseUnit(id:string):A1Unit|null{
 return ORIGINAL_A1_A2_B1_COURSE.find(unit=>unit.id===id)??null;
}
export function suggestedOriginalCourseUnit(practiced:ReadonlySet<string>):A1Unit|null{
 return ORIGINAL_A1_A2_B1_COURSE.find(unit=>!practiced.has(unit.id))??null;
}
export function originalCoursePracticeStatus(id:string,answers:ReadonlyMap<string,boolean>){
 const unit=getOriginalCourseUnit(id);if(!unit)return null;
 const correct=unit.tasks.filter(t=>answers.get(t.id)===true).length;
 return {lessonId:id,correct,total:unit.tasks.length,remaining:unit.tasks.length-correct,
  locallyPracticed:correct===unit.tasks.length};
}
export function validateOriginalB1Course():readonly string[]{
 const errors=[...validateFullFrenchCourse(),...validateB1Units(ORIGINAL_B1_UNITS)];
 if(ORIGINAL_A1_A2_B1_COURSE.length!==66)errors.push('Expected 24 A1, 28 A2 and 14 B1 lessons');
 if(new Set(ORIGINAL_A1_A2_B1_COURSE.map(u=>u.id)).size!==66)errors.push('Duplicate original lesson identities');
 for(const unit of ORIGINAL_B1_UNITS){
  if(unit.source.sourceRevision!==SOURCES.original.revision||
    unit.source.qualifiedId!=='fru1:original@'+SOURCES.original.revision+':session:u10-'+unit.id)
    errors.push('Unqualified B1 source identity '+unit.id);
 }
 return errors;
}
export async function loadOriginalA1A2B1Course():Promise<readonly A1Unit[]>{
 const problems=validateOriginalB1Course();
 if(problems.length)throw Error('Original French lesson content invalid: '+problems.join('; '));
 return ORIGINAL_A1_A2_B1_COURSE;
}
