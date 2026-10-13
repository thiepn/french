import {ORIGINAL_FRENCH_U17_COURSE,validateU17OriginalCourse} from './u17-course.ts';
import {U18_76_78} from './u18-76-78.ts';
import {U18_79_81} from './u18-79-81.ts';
import {U18_82_84} from './u18-82-84.ts';
import {U18_85_87} from './u18-85-87.ts';
import {U18_88_90} from './u18-88-90.ts';
import {validateU18Scenarios,type U18Scenario} from './u18-model.ts';
import {SOURCES} from './source.ts';
import type {A1Unit} from './u6-a1-model.ts';
/** Inherited U1–U17 original source identities and learning authorities remain intact. */
export const ORIGINAL_U18_SCENARIOS:readonly U18Scenario[]=Object.freeze([
 ...U18_76_78,...U18_79_81,...U18_82_84,...U18_85_87,...U18_88_90
]);
export const ORIGINAL_U18_UNITS:readonly A1Unit[]=Object.freeze(ORIGINAL_U18_SCENARIOS.map(s=>s.unit));
export const ORIGINAL_FRENCH_U18_COURSE:readonly A1Unit[]=Object.freeze([
 ...ORIGINAL_FRENCH_U17_COURSE,...ORIGINAL_U18_UNITS
]);
export function getU18OriginalUnit(id:string):A1Unit|null{
 return ORIGINAL_FRENCH_U18_COURSE.find(unit=>unit.id===id)??null;
}
export function suggestedU18OriginalUnit(practiced:ReadonlySet<string>):A1Unit|null{
 return ORIGINAL_FRENCH_U18_COURSE.find(unit=>!practiced.has(unit.id))??null;
}
export function u18PracticeStatus(id:string,answers:ReadonlyMap<string,boolean>){
 const unit=getU18OriginalUnit(id);if(!unit)return null;
 const correct=unit.tasks.filter(task=>answers.get(task.id)===true).length;
 return {lessonId:id,correct,total:unit.tasks.length,remaining:unit.tasks.length-correct,
  locallyPracticed:correct===unit.tasks.length};
}
export function validateU18OriginalCourse():readonly string[]{
 const issues=[...validateU17OriginalCourse(),...validateU18Scenarios(ORIGINAL_U18_SCENARIOS)];
 if(ORIGINAL_FRENCH_U18_COURSE.length!==184)issues.push('Expected 94 full original lessons and 90 U13–U18 cumulative original transfer scenarios');
 if(new Set(ORIGINAL_FRENCH_U18_COURSE.map(unit=>unit.id)).size!==184)
  issues.push('Duplicated original French unit identity');
 for(const unit of ORIGINAL_U18_UNITS)
  if(unit.source.sourceRevision!==SOURCES.original.revision||
   unit.source.qualifiedId!=='fru1:original@'+SOURCES.original.revision+':session:u18-'+unit.id)
    issues.push('Unqualified original U18 teaching source '+unit.id);
 return issues;
}
export async function loadU18OriginalFrenchCourse():Promise<readonly A1Unit[]>{
 const issues=validateU18OriginalCourse();
 if(issues.length)throw Error('Original French U18 Course invalid: '+issues.join('; '));
 return ORIGINAL_FRENCH_U18_COURSE;
}
