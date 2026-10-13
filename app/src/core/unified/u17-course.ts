import {ORIGINAL_FRENCH_U16_COURSE,validateU16OriginalCourse} from './u16-course.ts';
import {U17_61_63} from './u17-61-63.ts';
import {U17_64_66} from './u17-64-66.ts';
import {U17_67_69} from './u17-67-69.ts';
import {U17_70_72} from './u17-70-72.ts';
import {U17_73_75} from './u17-73-75.ts';
import {validateU17Scenarios,type U17Scenario} from './u17-model.ts';
import {SOURCES} from './source.ts';
import type {A1Unit} from './u6-a1-model.ts';

/** Keep all 154 inherited original lessons and transfer scenarios in their original identities and order. */
export const ORIGINAL_U17_SCENARIOS:readonly U17Scenario[]=Object.freeze([
 ...U17_61_63,...U17_64_66,...U17_67_69,...U17_70_72,...U17_73_75
]);
export const ORIGINAL_U17_UNITS:readonly A1Unit[]=Object.freeze(ORIGINAL_U17_SCENARIOS.map(s=>s.unit));
export const ORIGINAL_FRENCH_U17_COURSE:readonly A1Unit[]=Object.freeze([
 ...ORIGINAL_FRENCH_U16_COURSE,...ORIGINAL_U17_UNITS
]);
export function getU17OriginalUnit(id:string):A1Unit|null{
 return ORIGINAL_FRENCH_U17_COURSE.find(unit=>unit.id===id)??null;
}
export function suggestedU17OriginalUnit(practiced:ReadonlySet<string>):A1Unit|null{
 return ORIGINAL_FRENCH_U17_COURSE.find(unit=>!practiced.has(unit.id))??null;
}
export function u17PracticeStatus(id:string,answers:ReadonlyMap<string,boolean>){
 const unit=getU17OriginalUnit(id);if(!unit)return null;
 const correct=unit.tasks.filter(task=>answers.get(task.id)===true).length;
 return {lessonId:id,correct,total:unit.tasks.length,remaining:unit.tasks.length-correct,
  locallyPracticed:correct===unit.tasks.length};
}
export function validateU17OriginalCourse():readonly string[]{
 const issues=[...validateU16OriginalCourse(),...validateU17Scenarios(ORIGINAL_U17_SCENARIOS)];
 if(ORIGINAL_FRENCH_U17_COURSE.length!==169)issues.push('Expected 94 original full lessons plus 75 U13–U17 integrated original transfer scenarios');
 if(new Set(ORIGINAL_FRENCH_U17_COURSE.map(unit=>unit.id)).size!==169)
  issues.push('Duplicate original Course unit identities');
 for(const unit of ORIGINAL_U17_UNITS)
  if(unit.source.sourceRevision!==SOURCES.original.revision||
   unit.source.qualifiedId!=='fru1:original@'+SOURCES.original.revision+':session:u17-'+unit.id)
    issues.push('Unqualified new U17 original teaching source '+unit.id);
 return issues;
}
export async function loadU17OriginalFrenchCourse():Promise<readonly A1Unit[]>{
 const issues=validateU17OriginalCourse();
 if(issues.length)throw Error('Original French U17 Course invalid: '+issues.join('; '));
 return ORIGINAL_FRENCH_U17_COURSE;
}
