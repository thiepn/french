import {ORIGINAL_FRENCH_U19_COURSE,validateU19OriginalCourse} from './u19-course.ts';
import {U20_106_108} from './u20-106-108.ts';
import {U20_109_111} from './u20-109-111.ts';
import {U20_112_114} from './u20-112-114.ts';
import {U20_115_117} from './u20-115-117.ts';
import {U20_118_120} from './u20-118-120.ts';
import {validateU20Scenarios,type U20Scenario} from './u20-model.ts';
import {SOURCES} from './source.ts';
import type {A1Unit} from './u6-a1-model.ts';
/** The entire 199-unit inherited original Course remains owner-authoritative, untouched. */
export const ORIGINAL_U20_SCENARIOS:readonly U20Scenario[]=Object.freeze([
 ...U20_106_108,...U20_109_111,...U20_112_114,...U20_115_117,...U20_118_120
]);
export const ORIGINAL_U20_UNITS:readonly A1Unit[]=Object.freeze(ORIGINAL_U20_SCENARIOS.map(s=>s.unit));
export const ORIGINAL_FRENCH_U20_COURSE:readonly A1Unit[]=Object.freeze([
 ...ORIGINAL_FRENCH_U19_COURSE,...ORIGINAL_U20_UNITS
]);
export function getU20OriginalUnit(id:string):A1Unit|null{
 return ORIGINAL_FRENCH_U20_COURSE.find(unit=>unit.id===id)??null;
}
export function suggestedU20OriginalUnit(practiced:ReadonlySet<string>):A1Unit|null{
 return ORIGINAL_FRENCH_U20_COURSE.find(unit=>!practiced.has(unit.id))??null;
}
export function u20PracticeStatus(id:string,answers:ReadonlyMap<string,boolean>){
 const unit=getU20OriginalUnit(id);if(!unit)return null;
 const correct=unit.tasks.filter(task=>answers.get(task.id)===true).length;
 return {lessonId:id,correct,total:unit.tasks.length,remaining:unit.tasks.length-correct,
  locallyPracticed:correct===unit.tasks.length};
}
export function validateU20OriginalCourse():readonly string[]{
 const issues=[...validateU19OriginalCourse(),...validateU20Scenarios(ORIGINAL_U20_SCENARIOS)];
 if(ORIGINAL_FRENCH_U20_COURSE.length!==214)issues.push('Expected 94 full original lessons plus 120 U13–U20 original transfer scenarios');
 if(new Set(ORIGINAL_FRENCH_U20_COURSE.map(u=>u.id)).size!==214)
  issues.push('Duplicate original Course unit identity');
 for(const unit of ORIGINAL_U20_UNITS)
  if(unit.source.sourceRevision!==SOURCES.original.revision||
   unit.source.qualifiedId!=='fru1:original@'+SOURCES.original.revision+':session:u20-'+unit.id)
    issues.push('Unqualified U20 original unit '+unit.id);
 return issues;
}
export async function loadU20OriginalFrenchCourse():Promise<readonly A1Unit[]>{
 const issues=validateU20OriginalCourse();
 if(issues.length)throw Error('U20 original Course invalid: '+issues.join('; '));
 return ORIGINAL_FRENCH_U20_COURSE;
}
