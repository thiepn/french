import {ORIGINAL_FRENCH_U22_COURSE,validateU22OriginalCourse} from './u22-course.ts';
import {U42_151} from './u42-151.ts';
import {U42_152} from './u42-152.ts';
import {U42_153} from './u42-153.ts';
import {SOURCES} from './source.ts';
import type {A1Unit} from './u6-a1-model.ts';
import type {U21Scenario} from './u21-model.ts';

/** Exactly 244 preceding units are immutable; new B2 cases are additive. */
export const U42_B2_CASES:readonly U21Scenario[]=Object.freeze([...U42_151,...U42_152,...U42_153]);
export const ORIGINAL_FRENCH_U42_COURSE:readonly A1Unit[]=Object.freeze([
 ...ORIGINAL_FRENCH_U22_COURSE,...U42_B2_CASES.map(s=>s.unit)
]);
export function getU42OriginalUnit(id:string):A1Unit|null{
 return ORIGINAL_FRENCH_U42_COURSE.find(u=>u.id===id)??null;
}
export function suggestedU42OriginalUnit(practiced:ReadonlySet<string>):A1Unit|null{
 return ORIGINAL_FRENCH_U42_COURSE.find(u=>!practiced.has(u.id))??null;
}
export function u42PracticeStatus(id:string,answers:ReadonlyMap<string,boolean>){
 const unit=getU42OriginalUnit(id);
 if(!unit)return null;
 const correct=unit.tasks.filter(t=>answers.get(t.id)===true).length;
 return{lessonId:id,correct,total:unit.tasks.length,remaining:unit.tasks.length-correct,
  locallyPracticed:correct===unit.tasks.length};
}
export function validateU42Course():readonly string[]{
 const issues=[...validateU22OriginalCourse()];
 if(ORIGINAL_FRENCH_U22_COURSE.length!==244)issues.push('Historical 244 original lessons changed');
 if(U42_B2_CASES.length!==3||ORIGINAL_FRENCH_U42_COURSE.length!==247)
  issues.push('B2 extension must add exactly three case studies');
 const ids=ORIGINAL_FRENCH_U42_COURSE.map(x=>x.id);
 if(new Set(ids).size!==ids.length)issues.push('Duplicate source lesson identity');
 for(let i=0;i<U42_B2_CASES.length;i++){
  const story=U42_B2_CASES[i],unit=story.unit,n=i+151;
  const id='transfer-'+n,predecessor='transfer-'+(n-1);
  if(unit.id!==id||unit.order!==244+i+1||unit.prerequisites.join()!==predecessor)
   issues.push(id+' has incorrect order or prerequisites');
  if(unit.source.source!=='original'||unit.source.rights!=='original-owned'||
     unit.source.sourceRevision!==SOURCES.original.revision||
     !unit.source.qualifiedId.endsWith(':session:u42-'+id))
   issues.push(id+' source/provenance invalid');
  if(unit.grammar.length!==2||unit.vocabulary.length!==12||unit.dialogue.length!==9||
     unit.tasks.length!==10||new Set(unit.tasks.map(x=>x.id)).size!==10)
   issues.push(id+' insufficient lesson substance');
  for(const mode of ['fill','order','reading','choice'])
   if(!unit.tasks.some(t=>t.type===mode))issues.push(id+' missing '+mode);
  for(const task of unit.tasks){
   if(!task.answer.trim()||task.explanation.length<28)
    issues.push(task.id+' insufficient explanation');
   if((task.type==='reading'||task.type==='choice')&&
      (task.options.length!==3||!task.options.includes(task.answer)||
       new Set(task.options).size!==3))issues.push(task.id+' unsupported choice');
   if(task.type==='order'){
    const tokens=(s:string)=>s.trim().split(/\s+/).sort().join('|');
    if(tokens(task.answer)!==tokens(task.options.join(' '))||
       task.answer===task.options.join(' '))issues.push(task.id+' unanswerable word order');
   }
  }
  if(story.reading.french.trim().split(/\s+/).length<170||
     story.reading.questions.length!==3||!story.reading.title.trim())
   issues.push(id+' long reading missing');
  if(story.evidence.length!==2||story.evidence.some(e=>e.french.length<90)||
     story.crossQuestions.length!==2)issues.push(id+' source comparison missing');
  if(story.listening.length!==6||story.listening.some(q=>!q.options.includes(q.answer)))
   issues.push(id+' listening comprehension missing');
  for(const p of [story.writingChoices.fromListening,story.writingChoices.fromSources,
                   story.writingChoices.fromDebate])
   if(p.criteria.length<3||p.model.length<190||!p.prompt.trim())
    issues.push(id+' independent production missing');
  if(story.oral.model.length<115||story.oral.plan.length!==3)
   issues.push(id+' oral practice missing');
 }
 return issues;
}
export async function loadU42OriginalFrenchCourse():Promise<readonly A1Unit[]>{
 const issues=validateU42Course();
 if(issues.length)throw Error('B2 original course invalid: '+issues.join('; '));
 return ORIGINAL_FRENCH_U42_COURSE;
}
