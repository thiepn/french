import {A1_UNITS_01_04} from './u6-a1-01-04.ts';
import {A1_UNITS_05_08} from './u6-a1-05-08.ts';
import {A1_UNITS_09_12} from './u6-a1-09-12.ts';
import {validateA1Units,type A1Unit} from './u6-a1-model.ts';
import {SOURCES} from './source.ts';

/** Original-owned U6 course; no third-party texts, legacy session claims or authoritative student state. */
export const A1_FULL_UNITS:readonly A1Unit[]=Object.freeze([
 ...A1_UNITS_01_04,...A1_UNITS_05_08,...A1_UNITS_09_12
]);
export function getA1FullUnit(id:string):A1Unit|null{return A1_FULL_UNITS.find(unit=>unit.id===id)??null;}
export function validateA1FullCourse():readonly string[]{
 const issues=[...validateA1Units(A1_FULL_UNITS)];
 for(const unit of A1_FULL_UNITS){
  if(unit.source.sourceRevision!==SOURCES.original.revision)issues.push('Original revision mismatch '+unit.id);
  if(unit.source.qualifiedId!=='fru1:original@'+SOURCES.original.revision+':session:u6-'+unit.id)
   issues.push('Qualified identity mismatch '+unit.id);
 }
 return issues;
}
export async function loadA1FullCourse():Promise<readonly A1Unit[]>{
 const issues=validateA1FullCourse();
 if(issues.length)throw Error('Original A1 course invalid: '+issues.join('; '));
 return A1_FULL_UNITS;
}
export function suggestedA1Unit(practiced:ReadonlySet<string>):A1Unit|null{
 return A1_FULL_UNITS.find(unit=>!practiced.has(unit.id))??null;
}
export interface A1PracticeStatus {
 readonly lessonId:string;readonly correct:number;readonly total:number;readonly remaining:number;
 readonly locallyPracticed:boolean;
}
export function a1PracticeStatus(id:string,answers:ReadonlyMap<string,boolean>):A1PracticeStatus|null{
 const unit=getA1FullUnit(id);if(!unit)return null;
 const correct=unit.tasks.filter(task=>answers.get(task.id)===true).length;
 return {lessonId:unit.id,correct,total:unit.tasks.length,remaining:unit.tasks.length-correct,
  locallyPracticed:correct===unit.tasks.length};
}
