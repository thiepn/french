import {authorA1Unit,type A1AuthoredSpec,type A1Unit} from './u6-a1-model.ts';
import type {B1Reading} from './u10-readings-01-07.ts';
import type {A1ListeningQuestion} from './u7-listening.ts';
import {provenance} from './source.ts';

/** Original U12 teaching material uses the existing six stages, not another progress engine. */
export interface U12AuthoredLesson extends A1AuthoredSpec{
 reading:{title:string;paragraphs:[string,string,string];questions:[string,string,string[],string][]};
 listening:[string,string,string[],string][];
 oral:{prompt:string;plan:string[];model:string};
}
export interface U12OriginalLesson{
 unit:A1Unit;
 reading:B1Reading;
 listening:readonly A1ListeningQuestion[];
 oral:Readonly<{prompt:string;plan:readonly string[];model:string}>;
}
export function authorU12Lesson(spec:U12AuthoredLesson,number:number):U12OriginalLesson{
 const id='b1-'+String(number).padStart(2,'0');
 if(number<29||number>42||spec.id!==id)throw Error('Incorrect U12 B1 identity '+spec.id);
 const unit=Object.freeze({...authorA1Unit(spec,number+52),
  minutes:55,
  prerequisites:Object.freeze(['b1-'+String(number-1).padStart(2,'0')]),
  source:provenance('original','session','u12-'+id)
 });
 const reading:B1Reading=Object.freeze({
  unitId:id,title:spec.reading.title,french:spec.reading.paragraphs.join('\n\n'),
  questions:Object.freeze(spec.reading.questions.map(([prompt,answer,options,explanation])=>Object.freeze({
   prompt,answer,options:Object.freeze([...options]),explanation
  })))
 });
 const listening=Object.freeze(spec.listening.map(([prompt,answer,options,explanation],i)=>Object.freeze({
  id:id+'-listen-'+(i+1),prompt,answer,options:Object.freeze([...options]),explanation
 })));
 return Object.freeze({unit,reading,listening,
  oral:Object.freeze({prompt:spec.oral.prompt,plan:Object.freeze([...spec.oral.plan]),model:spec.oral.model})});
}
export function validateU12LessonContent(items:readonly U12OriginalLesson[]):readonly string[]{
 const problems:string[]=[];
 if(items.length!==14)problems.push('Expected exactly fourteen independently authored B1 lessons');
 const ids=new Set<string>();
 for(const [i,entry] of items.entries()){
  const id='b1-'+String(i+29).padStart(2,'0'),u=entry.unit;
  if(u.id!==id||u.order!==i+81||u.prerequisites.join()!=='b1-'+String(i+28).padStart(2,'0'))
   problems.push(id+' identity or progression');
  if(ids.has(u.id))problems.push(id+' duplicate');ids.add(u.id);
  if(u.source.source!=='original'||u.source.rights!=='original-owned'||
     !u.source.qualifiedId.endsWith(':session:u12-'+id))problems.push(id+' rights');
  if(u.grammar.length!==2||u.grammar.some(g=>g.explanation.length<135||g.examples.length<2||
   g.correction.some(piece=>piece.length<6)))problems.push(id+' grammar depth');
  if(u.vocabulary.length!==12||u.dialogue.length<5||
   u.dialogue.some(d=>d.fr.length<65||!d.en)||u.tasks.length!==10||
   u.writing.criteria.length<3||u.writing.model.length<170)problems.push(id+' full lesson depth');
  for(const mode of ['fill','choice','order','reading'])
   if(!u.tasks.some(t=>t.type===mode))problems.push(id+' exercise format '+mode);
  for(const task of u.tasks){
   if(!task.prompt||!task.answer||!task.focus||task.explanation.length<30)
    problems.push(task.id+' feedback');
   if(['choice','reading'].includes(task.type)&&
       (task.options.length!==3||!task.options.includes(task.answer)))
    problems.push(task.id+' keyed choices');
   if(task.type==='order'){
    const sorted=(s:string)=>s.trim().split(/\s+/).sort().join('|');
    if(sorted(task.options.join(' '))!==sorted(task.answer)||task.options.join(' ')===task.answer)
     problems.push(task.id+' usable word tiles');
   }
  }
  const reading=entry.reading;
  if(reading.unitId!==id||reading.french.split(/\n\s*\n/).length!==3||
   reading.french.trim().split(/\s+/).length<165||reading.questions.length!==3)
   problems.push(id+' three-paragraph deep reading');
  for(const q of reading.questions)
   if(q.options.length!==3||!q.options.includes(q.answer)||q.explanation.length<35)
    problems.push(id+' reading inference answer');
  if(entry.listening.length!==2)problems.push(id+' two listening checks');
  for(const q of entry.listening)
   if(q.options.length!==3||!q.options.includes(q.answer)||q.explanation.length<35)
    problems.push(id+' dialogue-grounded listening');
  if(entry.oral.plan.length<3||entry.oral.model.length<110)
   problems.push(id+' spoken-response scaffolding');
 }
 return problems;
}
