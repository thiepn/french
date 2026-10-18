import {ORIGINAL_FRENCH_U12_UNITS,validateU12OriginalCourse} from './u12-course.ts';
import {TRANSFER_01_05} from './u13-transfer-01-05.ts';
import {TRANSFER_06_10} from './u13-transfer-06-10.ts';
import {TRANSFER_11_13} from './u13-transfer-11-13.ts';
import {TRANSFER_14} from './u13-transfer-14.ts';
import {TRANSFER_15} from './u13-transfer-15.ts';
import {validateTransferScenarios,type TransferScenario} from './u13-transfer-model.ts';
import {SOURCES} from './source.ts';
import type {A1Unit} from './u6-a1-model.ts';

export const ORIGINAL_TRANSFER_SCENARIOS:readonly TransferScenario[]=Object.freeze([
 ...TRANSFER_01_05,...TRANSFER_06_10,...TRANSFER_11_13,...TRANSFER_14,...TRANSFER_15
]);
export const ORIGINAL_TRANSFER_UNITS:readonly A1Unit[]=Object.freeze(ORIGINAL_TRANSFER_SCENARIOS.map(x=>x.unit));
/** U13 extends (does not replace) the original 94-lesson Course with fifteen genuine multi-skill practical sessions. */
export const ORIGINAL_FRENCH_U13_COURSE:readonly A1Unit[]=Object.freeze([
 ...ORIGINAL_FRENCH_U12_UNITS,...ORIGINAL_TRANSFER_UNITS
]);
export function getU13OriginalUnit(id:string):A1Unit|null{
 return ORIGINAL_FRENCH_U13_COURSE.find(u=>u.id===id)??null;
}
export function suggestedU13OriginalUnit(practiced:ReadonlySet<string>):A1Unit|null{
 return ORIGINAL_FRENCH_U13_COURSE.find(u=>!practiced.has(u.id))??null;
}
export function u13PracticeStatus(id:string,answers:ReadonlyMap<string,boolean>){
 const unit=getU13OriginalUnit(id);if(!unit)return null;
 const correct=unit.tasks.filter(t=>answers.get(t.id)===true).length;
 return {lessonId:id,correct,total:unit.tasks.length,remaining:unit.tasks.length-correct,
  locallyPracticed:correct===unit.tasks.length};
}
export function validateU13OriginalCourse():readonly string[]{
 const errors=[...validateU12OriginalCourse(),...validateTransferScenarios(ORIGINAL_TRANSFER_SCENARIOS)];
 if(ORIGINAL_FRENCH_U13_COURSE.length!==109)errors.push('Expected 94 inherited full lessons plus 15 integrated sessions');
 if(new Set(ORIGINAL_FRENCH_U13_COURSE.map(u=>u.id)).size!==109)errors.push('Duplicated original full Course unit ID');
 for(const u of ORIGINAL_TRANSFER_UNITS){
  if(u.source.sourceRevision!==SOURCES.original.revision||
   u.source.qualifiedId!=='fru1:original@'+SOURCES.original.revision+':session:u13-'+u.id)
   errors.push('Unqualified transfer source '+u.id);
 }
 return errors;
}
export async function loadU13OriginalFrenchCourse():Promise<readonly A1Unit[]>{
 const issues=validateU13OriginalCourse();
 if(issues.length)throw Error('Original French transfer content invalid: '+issues.join('; '));
 return ORIGINAL_FRENCH_U13_COURSE;
}
