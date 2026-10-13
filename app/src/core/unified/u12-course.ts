import {ORIGINAL_FRENCH_U11_UNITS,validateU11OriginalCourse} from './u11-course.ts';
import {U12_LESSONS_29_32} from './u12-b1-29-32.ts';
import {U12_LESSONS_33_36} from './u12-b1-33-36.ts';
import {U12_LESSONS_37_39} from './u12-b1-37-39.ts';
import {U12_LESSONS_40_42} from './u12-b1-40-42.ts';
import {validateU12LessonContent,type U12OriginalLesson} from './u12-model.ts';
import {SOURCES} from './source.ts';
import type {A1Unit} from './u6-a1-model.ts';

export const U12_ORIGINAL_CONTENT:readonly U12OriginalLesson[]=Object.freeze([
 ...U12_LESSONS_29_32,...U12_LESSONS_33_36,...U12_LESSONS_37_39,...U12_LESSONS_40_42
]);
export const U12_ORIGINAL_UNITS:readonly A1Unit[]=Object.freeze(U12_ORIGINAL_CONTENT.map(v=>v.unit));
export const ORIGINAL_FRENCH_U12_UNITS:readonly A1Unit[]=Object.freeze([
 ...ORIGINAL_FRENCH_U11_UNITS,...U12_ORIGINAL_UNITS
]);
export function getU12OriginalUnit(id:string):A1Unit|null{
 return ORIGINAL_FRENCH_U12_UNITS.find(unit=>unit.id===id)??null;
}
export function suggestedU12OriginalUnit(practiced:ReadonlySet<string>):A1Unit|null{
 return ORIGINAL_FRENCH_U12_UNITS.find(unit=>!practiced.has(unit.id))??null;
}
export function u12PracticeStatus(id:string,answers:ReadonlyMap<string,boolean>){
 const unit=getU12OriginalUnit(id);if(!unit)return null;
 const correct=unit.tasks.filter(t=>answers.get(t.id)===true).length;
 return {lessonId:id,correct,total:unit.tasks.length,remaining:unit.tasks.length-correct,
  locallyPracticed:correct===unit.tasks.length};
}
export function validateU12OriginalCourse():readonly string[]{
 const errors=[...validateU11OriginalCourse(),...validateU12LessonContent(U12_ORIGINAL_CONTENT)];
 if(ORIGINAL_FRENCH_U12_UNITS.length!==94)errors.push('Expected 24 A1, 28 A2 and 42 B1 original lessons');
 if(new Set(ORIGINAL_FRENCH_U12_UNITS.map(u=>u.id)).size!==94)errors.push('Duplicate unit identity');
 for(const unit of U12_ORIGINAL_UNITS)
  if(unit.source.sourceRevision!==SOURCES.original.revision||
    unit.source.qualifiedId!=='fru1:original@'+SOURCES.original.revision+':session:u12-'+unit.id)
   errors.push('Unqualified U12 original material '+unit.id);
 return errors;
}
export async function loadU12OriginalFrenchCourse():Promise<readonly A1Unit[]>{
 const errors=validateU12OriginalCourse();
 if(errors.length)throw Error('Original French Course content invalid: '+errors.join('; '));
 return ORIGINAL_FRENCH_U12_UNITS;
}
