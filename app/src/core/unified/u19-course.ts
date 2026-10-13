import {ORIGINAL_FRENCH_U18_COURSE,validateU18OriginalCourse} from './u18-course.ts';
import {U19_91_93} from './u19-91-93.ts';
import {U19_94_96} from './u19-94-96.ts';
import {U19_97_99} from './u19-97-99.ts';
import {U19_100_102} from './u19-100-102.ts';
import {U19_103_105} from './u19-103-105.ts';
import {validateU19Scenarios,type U19Scenario} from './u19-model.ts';
import {SOURCES} from './source.ts';
import type {A1Unit} from './u6-a1-model.ts';

/** Source-only U19: extend the original course; never replace or duplicate prior state. */
export const ORIGINAL_U19_SCENARIOS:readonly U19Scenario[]=Object.freeze([
 ...U19_91_93,...U19_94_96,...U19_97_99,...U19_100_102,...U19_103_105
]);
export const ORIGINAL_U19_UNITS:readonly A1Unit[]=Object.freeze(ORIGINAL_U19_SCENARIOS.map(s=>s.unit));
export const ORIGINAL_FRENCH_U19_COURSE:readonly A1Unit[]=Object.freeze([
 ...ORIGINAL_FRENCH_U18_COURSE,...ORIGINAL_U19_UNITS
]);
export function getU19OriginalUnit(id:string):A1Unit|null{
 return ORIGINAL_FRENCH_U19_COURSE.find(unit=>unit.id===id)??null;
}
export function suggestedU19OriginalUnit(practiced:ReadonlySet<string>):A1Unit|null{
 return ORIGINAL_FRENCH_U19_COURSE.find(unit=>!practiced.has(unit.id))??null;
}
export function u19PracticeStatus(id:string,answers:ReadonlyMap<string,boolean>){
 const unit=getU19OriginalUnit(id);if(!unit)return null;
 const correct=unit.tasks.filter(task=>answers.get(task.id)===true).length;
 return {lessonId:id,correct,total:unit.tasks.length,remaining:unit.tasks.length-correct,
  locallyPracticed:correct===unit.tasks.length};
}
export function validateU19OriginalCourse():readonly string[]{
 const issues=[...validateU18OriginalCourse(),...validateU19Scenarios(ORIGINAL_U19_SCENARIOS)];
 if(ORIGINAL_FRENCH_U19_COURSE.length!==199)
  issues.push('Expected 94 original full lessons and 105 U13–U19 original transfer scenarios');
 if(new Set(ORIGINAL_FRENCH_U19_COURSE.map(unit=>unit.id)).size!==199)
  issues.push('Duplicate original French unit identity');
 for(const unit of ORIGINAL_U19_UNITS){
  if(unit.source.sourceRevision!==SOURCES.original.revision||
   unit.source.qualifiedId!=='fru1:original@'+SOURCES.original.revision+':session:u19-'+unit.id)
   issues.push('Unqualified original U19 teaching source '+unit.id);
 }
 return issues;
}
export async function loadU19OriginalFrenchCourse():Promise<readonly A1Unit[]>{
 const issues=validateU19OriginalCourse();
 if(issues.length)throw Error('Original French U19 Course invalid: '+issues.join('; '));
 return ORIGINAL_FRENCH_U19_COURSE;
}
