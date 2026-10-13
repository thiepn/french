import {ORIGINAL_A1_A2_B1_COURSE,validateOriginalB1Course} from './u10-course.ts';
import {B1_UNITS_15_18} from './u11-b1-15-18.ts';
import {B1_UNITS_19_22} from './u11-b1-19-22.ts';
import {B1_UNITS_23_26} from './u11-b1-23-26.ts';
import {B1_UNITS_27_28} from './u11-b1-27-28.ts';
import {validateB1DepthUnits} from './u11-b1-model.ts';
import {SOURCES} from './source.ts';
import type {A1Unit} from './u6-a1-model.ts';

export const B1_DEPTH_UNITS:readonly A1Unit[]=Object.freeze([
 ...B1_UNITS_15_18,...B1_UNITS_19_22,...B1_UNITS_23_26,...B1_UNITS_27_28
]);
/** Preserve the 66 inherited original full lessons and their identities without rewriting them. */
export const ORIGINAL_FRENCH_U11_UNITS:readonly A1Unit[]=Object.freeze([
 ...ORIGINAL_A1_A2_B1_COURSE,...B1_DEPTH_UNITS
]);
export function getU11OriginalUnit(id:string):A1Unit|null{
 return ORIGINAL_FRENCH_U11_UNITS.find(unit=>unit.id===id)??null;
}
export function suggestedU11OriginalUnit(practiced:ReadonlySet<string>):A1Unit|null{
 return ORIGINAL_FRENCH_U11_UNITS.find(unit=>!practiced.has(unit.id))??null;
}
export function u11PracticeStatus(id:string,answers:ReadonlyMap<string,boolean>){
 const unit=getU11OriginalUnit(id);if(!unit)return null;
 const correct=unit.tasks.filter(task=>answers.get(task.id)===true).length;
 return {lessonId:id,correct,total:unit.tasks.length,remaining:unit.tasks.length-correct,
  locallyPracticed:correct===unit.tasks.length};
}
export function validateU11OriginalCourse():readonly string[]{
 const errors=[...validateOriginalB1Course(),...validateB1DepthUnits(B1_DEPTH_UNITS)];
 if(ORIGINAL_FRENCH_U11_UNITS.length!==80)errors.push('Expected 24 A1 + 28 A2 + 28 B1 original full lessons');
 if(new Set(ORIGINAL_FRENCH_U11_UNITS.map(u=>u.id)).size!==80)errors.push('Duplicate full lesson IDs');
 for(const unit of B1_DEPTH_UNITS)
  if(unit.source.sourceRevision!==SOURCES.original.revision||
    unit.source.qualifiedId!=='fru1:original@'+SOURCES.original.revision+':session:u11-'+unit.id)
   errors.push('Incorrect original U11 provenance '+unit.id);
 return errors;
}
export async function loadU11OriginalFrenchCourse():Promise<readonly A1Unit[]>{
 const errors=validateU11OriginalCourse();
 if(errors.length)throw Error('Original U11 French course invalid: '+errors.join('; '));
 return ORIGINAL_FRENCH_U11_UNITS;
}
