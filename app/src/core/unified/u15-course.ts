import {ORIGINAL_FRENCH_U14_COURSE,validateU14OriginalCourse} from './u14-course.ts';
import {U15_31} from './u15-31.ts';
import {U15_32_33} from './u15-32-33.ts';
import {U15_34_36} from './u15-34-36.ts';
import {U15_37_39} from './u15-37-39.ts';
import {U15_40_42} from './u15-40-42.ts';
import {U15_43_45} from './u15-43-45.ts';
import {validateU15Scenarios,type U15Scenario} from './u15-model.ts';
import {SOURCES} from './source.ts';
import type {A1Unit} from './u6-a1-model.ts';

export const ORIGINAL_U15_SCENARIOS:readonly U15Scenario[]=Object.freeze([
 ...U15_31,...U15_32_33,...U15_34_36,...U15_37_39,...U15_40_42,...U15_43_45
]);
export const ORIGINAL_U15_UNITS:readonly A1Unit[]=Object.freeze(ORIGINAL_U15_SCENARIOS.map(s=>s.unit));
/** Source-only 94 intact full lessons and 45 original U13–U15 applied communication sessions. */
export const ORIGINAL_FRENCH_U15_COURSE:readonly A1Unit[]=Object.freeze([
 ...ORIGINAL_FRENCH_U14_COURSE,...ORIGINAL_U15_UNITS
]);
export function getU15OriginalUnit(id:string):A1Unit|null{
 return ORIGINAL_FRENCH_U15_COURSE.find(s=>s.id===id)??null;
}
export function suggestedU15OriginalUnit(practiced:ReadonlySet<string>):A1Unit|null{
 return ORIGINAL_FRENCH_U15_COURSE.find(s=>!practiced.has(s.id))??null;
}
export function u15PracticeStatus(id:string,answers:ReadonlyMap<string,boolean>){
 const unit=getU15OriginalUnit(id);if(!unit)return null;
 const correct=unit.tasks.filter(t=>answers.get(t.id)===true).length;
 return {lessonId:id,correct,total:unit.tasks.length,remaining:unit.tasks.length-correct,
  locallyPracticed:correct===unit.tasks.length};
}
export function validateU15OriginalCourse():readonly string[]{
 const issues=[...validateU14OriginalCourse(),...validateU15Scenarios(ORIGINAL_U15_SCENARIOS)];
 if(ORIGINAL_FRENCH_U15_COURSE.length!==139)
  issues.push('Expected 94 full original lessons and 45 U13–U15 applied sessions');
 if(new Set(ORIGINAL_FRENCH_U15_COURSE.map(u=>u.id)).size!==139)
  issues.push('Duplicated course identity');
 for(const unit of ORIGINAL_U15_UNITS){
  if(unit.source.sourceRevision!==SOURCES.original.revision||
    unit.source.qualifiedId!=='fru1:original@'+SOURCES.original.revision+':session:u15-'+unit.id)
    issues.push('Unqualified U15 source '+unit.id);
 }
 return issues;
}
export async function loadU15OriginalFrenchCourse():Promise<readonly A1Unit[]>{
 const issues=validateU15OriginalCourse();
 if(issues.length)throw Error('Original French U15 Course invalid: '+issues.join('; '));
 return ORIGINAL_FRENCH_U15_COURSE;
}
