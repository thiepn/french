import {ORIGINAL_FRENCH_UNITS,validateOriginalFrenchCourse} from './u8-course.ts';
import {A2_UNITS_15_18} from './u9-a2-15-18.ts';
import {A2_UNITS_19_22} from './u9-a2-19-22.ts';
import {A2_UNITS_23_25} from './u9-a2-23-25.ts';
import {A2_UNITS_26_28} from './u9-a2-26-28.ts';
import {validatePracticalA2Units} from './u9-a2-model.ts';
import {SOURCES} from './source.ts';
import type {A1Unit} from './u6-a1-model.ts';

export const PRACTICAL_A2_UNITS:readonly A1Unit[]=Object.freeze([
 ...A2_UNITS_15_18,...A2_UNITS_19_22,...A2_UNITS_23_25,...A2_UNITS_26_28
]);
/** All existing U6–U8 lessons retain their source identity and original authoring. */
export const FULL_ORIGINAL_FRENCH_COURSE:readonly A1Unit[]=Object.freeze([
 ...ORIGINAL_FRENCH_UNITS,...PRACTICAL_A2_UNITS
]);
export function getFullFrenchUnit(id:string):A1Unit|null{
 return FULL_ORIGINAL_FRENCH_COURSE.find(unit=>unit.id===id)??null;
}
export function suggestedFullFrenchUnit(practiced:ReadonlySet<string>):A1Unit|null{
 return FULL_ORIGINAL_FRENCH_COURSE.find(unit=>!practiced.has(unit.id))??null;
}
export function fullFrenchPracticeStatus(id:string,answers:ReadonlyMap<string,boolean>){
 const unit=getFullFrenchUnit(id);if(!unit)return null;
 const correct=unit.tasks.filter(task=>answers.get(task.id)===true).length;
 return {lessonId:id,correct,total:unit.tasks.length,remaining:unit.tasks.length-correct,
  locallyPracticed:correct===unit.tasks.length};
}
export function validateFullFrenchCourse():readonly string[]{
 const errors=[...validateOriginalFrenchCourse(),...validatePracticalA2Units(PRACTICAL_A2_UNITS)];
 if(FULL_ORIGINAL_FRENCH_COURSE.length!==52)errors.push('Expected 24 A1 plus 28 A2 lessons');
 if(new Set(FULL_ORIGINAL_FRENCH_COURSE.map(u=>u.id)).size!==52)errors.push('Repeated full lesson identity');
 for(const u of PRACTICAL_A2_UNITS){
  if(u.source.sourceRevision!==SOURCES.original.revision||
    u.source.qualifiedId!=='fru1:original@'+SOURCES.original.revision+':session:u9-'+u.id)
   errors.push('Original U9 source revision mismatch '+u.id);
 }
 return errors;
}
export async function loadFullOriginalFrenchCourse():Promise<readonly A1Unit[]>{
 const errors=validateFullFrenchCourse();
 if(errors.length)throw Error('Full French Course data invalid: '+errors.join('; '));
 return FULL_ORIGINAL_FRENCH_COURSE;
}
