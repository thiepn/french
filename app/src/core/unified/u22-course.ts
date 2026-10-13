import {ORIGINAL_FRENCH_U21_COURSE,validateU21OriginalCourse} from './u21-course.ts';
import {U22_136_138} from './u22-136-138.ts';
import {U22_139_141} from './u22-139-141.ts';
import {U22_142_144} from './u22-142-144.ts';
import {U22_145_147} from './u22-145-147.ts';
import {U22_148} from './u22-148.ts';
import {U22_149} from './u22-149.ts';
import {U22_150} from './u22-150.ts';
import {SOURCES} from './source.ts';
import type {A1Unit} from './u6-a1-model.ts';
import type {U21Scenario} from './u21-model.ts';

/** Additive native authoring: 15 complete U22 scenarios, all original prior IDs retained. */
export const ORIGINAL_U22_SCENARIOS:readonly U21Scenario[]=Object.freeze([...U22_136_138,...U22_139_141,...U22_142_144,...U22_145_147,...U22_148,...U22_149,...U22_150]);
export const ORIGINAL_U22_UNITS:readonly A1Unit[]=Object.freeze(ORIGINAL_U22_SCENARIOS.map(x=>x.unit));
export const ORIGINAL_FRENCH_U22_COURSE:readonly A1Unit[]=Object.freeze([
 ...ORIGINAL_FRENCH_U21_COURSE,...ORIGINAL_U22_UNITS
]);
export const getU22OriginalUnit=(id:string):A1Unit|null=>
 ORIGINAL_FRENCH_U22_COURSE.find(x=>x.id===id)??null;
export const suggestedU22OriginalUnit=(practiced:ReadonlySet<string>):A1Unit|null=>
 ORIGINAL_FRENCH_U22_COURSE.find(x=>!practiced.has(x.id))??null;
export function u22PracticeStatus(id:string,answers:ReadonlyMap<string,boolean>){
 const unit=getU22OriginalUnit(id);if(!unit)return null;
 const correct=unit.tasks.filter(t=>answers.get(t.id)===true).length;
 return {lessonId:id,correct,total:unit.tasks.length,remaining:unit.tasks.length-correct,
  locallyPracticed:correct===unit.tasks.length};
}
export function validateU22OriginalCourse():readonly string[]{
 const problems=[...validateU21OriginalCourse()];
 if(ORIGINAL_U22_SCENARIOS.length!==15)problems.push('Expected fifteen complete original U22 scenarios');
 if(ORIGINAL_FRENCH_U22_COURSE.length!==244)problems.push('Expected 244 original Course units');
 if(new Set(ORIGINAL_FRENCH_U22_COURSE.map(u=>u.id)).size!==244)
  problems.push('Duplicate original course identities');
 for(const [i,story] of ORIGINAL_U22_SCENARIOS.entries()){
  const unit=story.unit,id='transfer-'+(i+136);
  if(unit.id!==id||unit.order!==i+230||unit.prerequisites.join()!=='transfer-'+(i+135))
   problems.push(id+' identity/continuity');
  if(unit.source.source!=='original'||unit.source.rights!=='original-owned'||
     unit.source.sourceRevision!==SOURCES.original.revision||
     unit.source.qualifiedId!=='fru1:original@'+SOURCES.original.revision+':session:u22-'+id)
   problems.push(id+' rights/provenance');
  if(unit.grammar.length!==2||unit.vocabulary.length!==12||
     unit.dialogue.length!==9||unit.tasks.length!==10)problems.push(id+' content dimensions');
  for(const required of ['fill','reading','choice','order'])
   if(!unit.tasks.some(t=>t.type===required))problems.push(id+' missing '+required);
  for(const task of unit.tasks){
   if(!task.answer.trim()||task.explanation.length<20)problems.push(task.id+' insufficient correction');
   if((task.type==='choice'||task.type==='reading')&&
      (task.options.length!==3||!task.options.includes(task.answer)))problems.push(task.id+' invalid choice key');
   if(task.type==='order'){
    const normalize=(s:string)=>s.trim().split(/\s+/).sort().join('|');
    if(normalize(task.answer)!==normalize(task.options.join(' '))||
       task.answer===task.options.join(' '))problems.push(task.id+' invalid order tokens');
   }
  }
  if(story.reading.french.trim().split(/\s+/).length<170||
     story.reading.questions.length!==3)problems.push(id+' reading depth');
  if(story.evidence.length!==2||story.evidence.some(e=>e.french.length<90)||
     story.crossQuestions.length!==2)problems.push(id+' source comparison');
  if(story.listening.length!==6||story.listening.some(q=>!q.options.includes(q.answer)))
   problems.push(id+' listening questions');
  for(const w of [story.writingChoices.fromListening,story.writingChoices.fromSources,
     story.writingChoices.fromDebate])if(w.criteria.length<3||w.model.length<190)
   problems.push(id+' authored writing');
  if(story.oral.model.length<115)problems.push(id+' oral practice');
 }
 return problems;
}
export async function loadU22OriginalFrenchCourse():Promise<readonly A1Unit[]>{
 const problems=validateU22OriginalCourse();
 if(problems.length)throw Error('U22 source-owned original lessons invalid: '+problems.join('; '));
 return ORIGINAL_FRENCH_U22_COURSE;
}
