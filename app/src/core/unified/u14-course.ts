import {ORIGINAL_FRENCH_U13_COURSE,validateU13OriginalCourse} from './u13-course.ts';
import {U14_16_18} from './u14-16-18.ts';
import {U14_19_21} from './u14-19-21.ts';
import {U14_22_24} from './u14-22-24.ts';
import {U14_25_27} from './u14-25-27.ts';
import {U14_28_30} from './u14-28-30.ts';
import {validateU14Scenarios,type U14Scenario} from './u14-model.ts';
import type {A1Unit} from './u6-a1-model.ts';
import {SOURCES} from './source.ts';
export const ORIGINAL_U14_SCENARIOS:readonly U14Scenario[]=Object.freeze([
 ...U14_16_18,...U14_19_21,...U14_22_24,...U14_25_27,...U14_28_30
]);
export const ORIGINAL_U14_UNITS:readonly A1Unit[]=Object.freeze(ORIGINAL_U14_SCENARIOS.map(s=>s.unit));
/** 94 original full lessons + 15 U13 and 15 U14 original transfer sessions. */
export const ORIGINAL_FRENCH_U14_COURSE:readonly A1Unit[]=Object.freeze([
 ...ORIGINAL_FRENCH_U13_COURSE,...ORIGINAL_U14_UNITS
]);
export function getU14OriginalUnit(id:string):A1Unit|null{
 return ORIGINAL_FRENCH_U14_COURSE.find(s=>s.id===id)??null;
}
export function suggestedU14OriginalUnit(practiced:ReadonlySet<string>):A1Unit|null{
 return ORIGINAL_FRENCH_U14_COURSE.find(s=>!practiced.has(s.id))??null;
}
export function u14PracticeStatus(id:string,answers:ReadonlyMap<string,boolean>){
 const unit=getU14OriginalUnit(id);if(!unit)return null;
 const correct=unit.tasks.filter(t=>answers.get(t.id)===true).length;
 return {lessonId:id,correct,total:unit.tasks.length,remaining:unit.tasks.length-correct,
  locallyPracticed:correct===unit.tasks.length};
}
export function validateU14OriginalCourse():readonly string[]{
 const errors=[...validateU13OriginalCourse(),...validateU14Scenarios(ORIGINAL_U14_SCENARIOS)];
 if(ORIGINAL_FRENCH_U14_COURSE.length!==124)
  errors.push('Expected 94 intact full lessons, 15 U13 transfer, 15 U14 transfer');
 if(new Set(ORIGINAL_FRENCH_U14_COURSE.map(s=>s.id)).size!==124)errors.push('Duplicate full-Course unit');
 for(const unit of ORIGINAL_U14_UNITS)
  if(unit.source.sourceRevision!==SOURCES.original.revision||
   unit.source.qualifiedId!=='fru1:original@'+SOURCES.original.revision+':session:u14-'+unit.id)
   errors.push(unit.id+' source provenance');
 return errors;
}
export async function loadU14OriginalFrenchCourse():Promise<readonly A1Unit[]>{
 const issues=validateU14OriginalCourse();
 if(issues.length)throw Error('Original French U14 Course invalid: '+issues.join('; '));
 return ORIGINAL_FRENCH_U14_COURSE;
}
