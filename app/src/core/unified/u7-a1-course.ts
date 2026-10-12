import {A1_FULL_UNITS} from './u6-a1-course.ts';
import {A1_UNITS_13_16} from './u7-a1-13-16.ts';
import {A1_UNITS_17_20} from './u7-a1-17-20.ts';
import {A1_UNITS_21_24} from './u7-a1-21-24.ts';
import {validateA1Units,type A1Unit} from './u6-a1-model.ts';
import {SOURCES} from './source.ts';

export const A1_COMPLETE_UNITS:readonly A1Unit[]=Object.freeze([
 ...A1_FULL_UNITS,...A1_UNITS_13_16,...A1_UNITS_17_20,...A1_UNITS_21_24
]);
export function getA1CompleteUnit(id:string):A1Unit|null{
 return A1_COMPLETE_UNITS.find(unit=>unit.id===id)??null;
}
export function suggestedCompleteA1Unit(practiced:ReadonlySet<string>):A1Unit|null{
 return A1_COMPLETE_UNITS.find(unit=>!practiced.has(unit.id))??null;
}
export function completeA1PracticeStatus(id:string,answers:ReadonlyMap<string,boolean>){
 const unit=getA1CompleteUnit(id);
 if(!unit)return null;
 const correct=unit.tasks.filter(task=>answers.get(task.id)===true).length;
 return {lessonId:id,correct,total:unit.tasks.length,remaining:unit.tasks.length-correct,
  locallyPracticed:correct===unit.tasks.length};
}
export function validateCompleteA1Course():readonly string[]{
 const issues=[...validateA1Units(A1_COMPLETE_UNITS,24)];
 for(const unit of A1_COMPLETE_UNITS){
  if(unit.source.sourceRevision!==SOURCES.original.revision)issues.push('Revision mismatch '+unit.id);
  const prefix=unit.order<=12?'u6-':'u7-';
  const expected='fru1:original@'+SOURCES.original.revision+':session:'+prefix+unit.id;
  if(unit.source.qualifiedId!==expected)issues.push('Qualified source mismatch '+unit.id);
 }
 return issues;
}
export async function loadA1CompleteCourse():Promise<readonly A1Unit[]>{
 const errors=validateCompleteA1Course();
 if(errors.length)throw Error('A1 authored content invalid: '+errors.join('; '));
 return A1_COMPLETE_UNITS;
}
