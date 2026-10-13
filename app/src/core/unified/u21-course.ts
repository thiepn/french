import {ORIGINAL_FRENCH_U20_COURSE,validateU20OriginalCourse} from './u20-course.ts';
import {U21_121_123} from './u21-121-123.ts';
import {U21_124_126} from './u21-124-126.ts';
import {U21_127_129} from './u21-127-129.ts';
import {U21_130_132} from './u21-130-132.ts';
import {U21_133} from './u21-133.ts';
import {U21_134} from './u21-134.ts';
import {U21_135} from './u21-135.ts';
import {validateU21Scenarios,type U21Scenario} from './u21-model.ts';
import {SOURCES} from './source.ts';
import type {A1Unit} from './u6-a1-model.ts';
/** All 214 original U1–U20 units remain stable, source-qualified and unchanged. */
export const ORIGINAL_U21_SCENARIOS:readonly U21Scenario[]=Object.freeze([
 ...U21_121_123,...U21_124_126,...U21_127_129,...U21_130_132,
 ...U21_133,...U21_134,...U21_135
]);
export const ORIGINAL_U21_UNITS:readonly A1Unit[]=Object.freeze(ORIGINAL_U21_SCENARIOS.map(s=>s.unit));
export const ORIGINAL_FRENCH_U21_COURSE:readonly A1Unit[]=Object.freeze([
 ...ORIGINAL_FRENCH_U20_COURSE,...ORIGINAL_U21_UNITS
]);
export function getU21OriginalUnit(id:string):A1Unit|null{
 return ORIGINAL_FRENCH_U21_COURSE.find(unit=>unit.id===id)??null;
}
export function suggestedU21OriginalUnit(practiced:ReadonlySet<string>):A1Unit|null{
 return ORIGINAL_FRENCH_U21_COURSE.find(unit=>!practiced.has(unit.id))??null;
}
export function u21PracticeStatus(id:string,answers:ReadonlyMap<string,boolean>){
 const unit=getU21OriginalUnit(id);if(!unit)return null;
 const correct=unit.tasks.filter(task=>answers.get(task.id)===true).length;
 return {lessonId:id,correct,total:unit.tasks.length,remaining:unit.tasks.length-correct,
  locallyPracticed:correct===unit.tasks.length};
}
export function validateU21OriginalCourse():readonly string[]{
 const issues=[...validateU20OriginalCourse(),...validateU21Scenarios(ORIGINAL_U21_SCENARIOS)];
 if(ORIGINAL_FRENCH_U21_COURSE.length!==229)
  issues.push('Expected 94 original full lessons and 135 original U13–U21 transfer scenarios');
 if(new Set(ORIGINAL_FRENCH_U21_COURSE.map(u=>u.id)).size!==229)
  issues.push('Duplicate original French lesson identity');
 for(const u of ORIGINAL_U21_UNITS)
  if(u.source.sourceRevision!==SOURCES.original.revision||
     u.source.qualifiedId!=='fru1:original@'+SOURCES.original.revision+':session:u21-'+u.id)
   issues.push('Unqualified original U21 source '+u.id);
 return issues;
}
export async function loadU21OriginalFrenchCourse():Promise<readonly A1Unit[]>{
 const issues=validateU21OriginalCourse();
 if(issues.length)throw Error('U21 original Course invalid: '+issues.join('; '));
 return ORIGINAL_FRENCH_U21_COURSE;
}
