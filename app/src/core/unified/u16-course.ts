import {ORIGINAL_FRENCH_U15_COURSE,validateU15OriginalCourse} from './u15-course.ts';
import {U16_46_48} from './u16-46-48.ts';
import {U16_49_51} from './u16-49-51.ts';
import {U16_52_54} from './u16-52-54.ts';
import {U16_55_57} from './u16-55-57.ts';
import {U16_58_60} from './u16-58-60.ts';
import {validateU16Scenarios,type U16Scenario} from './u16-model.ts';
import {SOURCES} from './source.ts';
import type {A1Unit} from './u6-a1-model.ts';

/** The canonical U15 course and all original earlier lessons are reused unchanged. */
export const ORIGINAL_U16_SCENARIOS:readonly U16Scenario[]=Object.freeze([
 ...U16_46_48,...U16_49_51,...U16_52_54,...U16_55_57,...U16_58_60
]);
export const ORIGINAL_U16_UNITS:readonly A1Unit[]=Object.freeze(ORIGINAL_U16_SCENARIOS.map(s=>s.unit));
export const ORIGINAL_FRENCH_U16_COURSE:readonly A1Unit[]=Object.freeze([
 ...ORIGINAL_FRENCH_U15_COURSE,...ORIGINAL_U16_UNITS
]);
export function getU16OriginalUnit(id:string):A1Unit|null{
 return ORIGINAL_FRENCH_U16_COURSE.find(unit=>unit.id===id)??null;
}
export function suggestedU16OriginalUnit(practiced:ReadonlySet<string>):A1Unit|null{
 return ORIGINAL_FRENCH_U16_COURSE.find(unit=>!practiced.has(unit.id))??null;
}
export function u16PracticeStatus(id:string,answers:ReadonlyMap<string,boolean>){
 const unit=getU16OriginalUnit(id);if(!unit)return null;
 const correct=unit.tasks.filter(task=>answers.get(task.id)===true).length;
 return {lessonId:id,correct,total:unit.tasks.length,remaining:unit.tasks.length-correct,
  locallyPracticed:correct===unit.tasks.length};
}
export function validateU16OriginalCourse():readonly string[]{
 const issues=[...validateU15OriginalCourse(),...validateU16Scenarios(ORIGINAL_U16_SCENARIOS)];
 if(ORIGINAL_FRENCH_U16_COURSE.length!==154)issues.push('Expected 94 original full lessons plus 60 U13–U16 applied communication sessions');
 if(new Set(ORIGINAL_FRENCH_U16_COURSE.map(unit=>unit.id)).size!==154)
  issues.push('Duplicated original French lesson identity');
 for(const unit of ORIGINAL_U16_UNITS){
  if(unit.source.sourceRevision!==SOURCES.original.revision||
    unit.source.qualifiedId!=='fru1:original@'+SOURCES.original.revision+':session:u16-'+unit.id)
    issues.push('Unqualified new original teaching source '+unit.id);
 }
 return issues;
}
export async function loadU16OriginalFrenchCourse():Promise<readonly A1Unit[]>{
 const issues=validateU16OriginalCourse();
 if(issues.length)throw Error('Original French U16 Course invalid: '+issues.join('; '));
 return ORIGINAL_FRENCH_U16_COURSE;
}
