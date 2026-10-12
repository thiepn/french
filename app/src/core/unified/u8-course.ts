import {A1_COMPLETE_UNITS,validateCompleteA1Course} from './u7-a1-course.ts';
import {A2_UNITS_01_04} from './u8-a2-01-04.ts';
import {A2_UNITS_05_08} from './u8-a2-05-08.ts';
import {A2_UNITS_09_11} from './u8-a2-09-11.ts';
import {A2_UNITS_12_14} from './u8-a2-12-14.ts';
import {validateA2Units} from './u8-a2-model.ts';
import {SOURCES} from './source.ts';
import type {A1Unit} from './u6-a1-model.ts';

export const ORIGINAL_A2_UNITS:readonly A1Unit[]=Object.freeze([
 ...A2_UNITS_01_04,...A2_UNITS_05_08,...A2_UNITS_09_11,...A2_UNITS_12_14
]);
/** Same U6 learner-facing lesson engine, one A1→A2 original course catalog. */
export const ORIGINAL_FRENCH_UNITS:readonly A1Unit[]=Object.freeze([
 ...A1_COMPLETE_UNITS,...ORIGINAL_A2_UNITS
]);
export function getOriginalFrenchUnit(id:string):A1Unit|null{
 return ORIGINAL_FRENCH_UNITS.find(unit=>unit.id===id)??null;
}
export function suggestedOriginalFrenchUnit(practiced:ReadonlySet<string>):A1Unit|null{
 return ORIGINAL_FRENCH_UNITS.find(unit=>!practiced.has(unit.id))??null;
}
export function originalFrenchPracticeStatus(id:string,answers:ReadonlyMap<string,boolean>){
 const unit=getOriginalFrenchUnit(id);if(!unit)return null;
 const correct=unit.tasks.filter(task=>answers.get(task.id)===true).length;
 return {lessonId:id,correct,total:unit.tasks.length,remaining:unit.tasks.length-correct,
  locallyPracticed:correct===unit.tasks.length};
}
export function validateOriginalFrenchCourse():readonly string[]{
 const issues=[...validateCompleteA1Course(),...validateA2Units(ORIGINAL_A2_UNITS)];
 for(const unit of ORIGINAL_A2_UNITS){
  if(unit.source.sourceRevision!==SOURCES.original.revision||
     unit.source.qualifiedId!=='fru1:original@'+SOURCES.original.revision+':session:u8-'+unit.id)
   issues.push('Source version mismatch '+unit.id);
 }
 if(ORIGINAL_FRENCH_UNITS.length!==38)issues.push('Expected 24 A1 plus 14 A2 full lessons');
 if(new Set(ORIGINAL_FRENCH_UNITS.map(u=>u.id)).size!==38)issues.push('Repeated unit ID');
 return issues;
}
export async function loadOriginalFrenchCourse():Promise<readonly A1Unit[]>{
 const errors=validateOriginalFrenchCourse();
 if(errors.length)throw Error('Original A1–A2 teaching catalog invalid: '+errors.join('; '));
 return ORIGINAL_FRENCH_UNITS;
}
