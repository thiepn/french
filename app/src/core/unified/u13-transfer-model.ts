import {authorA1Unit,type A1AuthoredSpec,type A1TaskType,type A1Unit} from './u6-a1-model.ts';
import type {B1Reading} from './u10-readings-01-07.ts';
import type {A1ListeningQuestion} from './u7-listening.ts';
import {provenance} from './source.ts';
import {TRANSFER_GRAMMAR} from './u13-transfer-grammar.ts';

export interface TransferEvidence{
 readonly label:string;readonly type:'notice'|'email'|'diary'|'chat'|'review'|'poster'|'article'|'minutes'|'data';
 readonly french:string;
}
export interface TransferQuestion{
 readonly prompt:string;readonly answer:string;readonly options:readonly string[];readonly explanation:string;
}
export interface TransferAuthoredSpec{
 id:string;title:string;goal:string;level:'A1→A2'|'A2→B1'|'B1 integrated';grammarKeys:[string,string];
 vocabulary:[string,string,string][];dialogue:[string,string,string][];
 tasks:[A1TaskType,string,string,string,string[],string][];
 reading:{title:string;paragraphs:[string,string,string];questions:[string,string,string[],string][]};
 evidence:[TransferEvidence,TransferEvidence];
 crossQuestions:[string,string,string[],string][];
 listening:[string,string,string[],string][];
 writing:[string,string[],string];oral:{prompt:string;plan:[string,string,string];model:string};
}
export interface TransferScenario{
 readonly unit:A1Unit;readonly level:string;readonly reading:B1Reading;
 readonly evidence:readonly TransferEvidence[];readonly crossQuestions:readonly TransferQuestion[];
 readonly listening:readonly A1ListeningQuestion[];
 readonly oral:Readonly<{prompt:string;plan:readonly string[];model:string}>;
}
export function authorTransferScenario(spec:TransferAuthoredSpec,index:number):TransferScenario{
 const id='transfer-'+String(index).padStart(2,'0');
 if(index<1||index>15||spec.id!==id)throw Error('Transfer identity '+spec.id);
 const grammars=spec.grammarKeys.map(key=>{
  const item=TRANSFER_GRAMMAR[key];
  if(!item)throw Error('Missing original grammar '+key);
  return item;
 });
 const grammar:A1AuthoredSpec['grammar']=grammars.map(
  (g):A1AuthoredSpec['grammar'][number]=>[
   g[0],g[1],g[2].map(v=>[v[0],v[1]] as [string,string]),
   [g[3][0],g[3][1],g[3][2]]
  ]
 );
 const input:A1AuthoredSpec={
  id,title:spec.title,goal:spec.goal,grammarIds:[],grammar,
  vocabulary:spec.vocabulary,dialogue:spec.dialogue,tasks:spec.tasks,writing:spec.writing
 };
 const unit=Object.freeze({...authorA1Unit(input,94+index),minutes:50,
  prerequisites:Object.freeze(index===1?['b1-42']:['transfer-'+String(index-1).padStart(2,'0')]),
  source:provenance('original','session','u13-'+id)
 });
 const reading:B1Reading=Object.freeze({unitId:id,title:spec.reading.title,
  french:spec.reading.paragraphs.join('\n\n'),
  questions:Object.freeze(spec.reading.questions.map(([prompt,answer,options,explanation])=>Object.freeze({
   prompt,answer,options:Object.freeze([...options]),explanation
  })))
 });
 const crossQuestions=Object.freeze(spec.crossQuestions.map(([prompt,answer,options,explanation])=>Object.freeze({
  prompt,answer,options:Object.freeze([...options]),explanation
 })));
 const listening=Object.freeze(spec.listening.map(([prompt,answer,options,explanation],i)=>Object.freeze({
  id:id+'-listen-'+String(i+1),prompt,answer,options:Object.freeze([...options]),explanation
 })));
 return Object.freeze({unit,level:spec.level,reading,
  evidence:Object.freeze(spec.evidence.map(e=>Object.freeze({...e}))),
  crossQuestions,listening,
  oral:Object.freeze({prompt:spec.oral.prompt,plan:Object.freeze([...spec.oral.plan]),model:spec.oral.model})
 });
}
export function validateTransferScenarios(scenarios:readonly TransferScenario[]):readonly string[]{
 const errors:string[]=[];
 if(scenarios.length!==15)errors.push('Expected exactly fifteen complete original transfer scenarios');
 for(const [i,s] of scenarios.entries()){
  const id='transfer-'+String(i+1).padStart(2,'0'),u=s.unit;
  if(u.id!==id||u.order!==95+i||
   u.prerequisites[0]!== (i?'transfer-'+String(i).padStart(2,'0'):'b1-42'))errors.push(id+' sequence');
  if(u.source.source!=='original'||u.source.rights!=='original-owned'||
   !u.source.qualifiedId.endsWith(':session:u13-'+id))errors.push(id+' source rights');
  if(u.grammar.length!==2||u.grammar.some(g=>g.explanation.length<125||g.examples.length<2||
   g.correction.some(x=>x.length<6)))errors.push(id+' mixed grammar');
  if(u.vocabulary.length!==12||u.dialogue.length!==5||u.tasks.length!==10||
   u.writing.criteria.length<3||u.writing.model.length<170)errors.push(id+' authentic breadth');
  const kinds=new Set(u.tasks.map(t=>t.type));
  for(const kind of ['fill','choice','reading','order'] as const)if(!kinds.has(kind))errors.push(id+' '+kind);
  for(const t of u.tasks){
   if(t.explanation.length<30||!t.focus)errors.push(t.id+' explanation');
   if((t.type==='choice'||t.type==='reading')&&(t.options.length!==3||!t.options.includes(t.answer)))
    errors.push(t.id+' key');
   if(t.type==='order'){
    const norm=(v:string)=>v.trim().split(/\s+/).sort().join('|');
    if(norm(t.options.join(' '))!==norm(t.answer)||t.options.join(' ')===t.answer)
     errors.push(t.id+' word order');
   }
  }
  if(s.reading.unitId!==id||s.reading.french.split(/\n\s*\n/).length!==3||
   s.reading.french.trim().split(/\s+/).length<145||s.reading.questions.length!==3)
   errors.push(id+' original extended reading');
  if(s.evidence.length!==2||s.evidence.some(e=>e.french.length<95||
     !e.label||!e.type)||s.crossQuestions.length!==2)
   errors.push(id+' independent source comparison');
  for(const q of [...s.reading.questions,...s.crossQuestions,...s.listening]){
   if(!q.answer||q.options.length!==3||!q.options.includes(q.answer)||q.explanation.length<30)
    errors.push(id+' evidence-based feedback');
  }
  if(s.listening.length!==2||s.oral.plan.length!==3||s.oral.model.length<110)
   errors.push(id+' listening and oral transfer');
 }
 return errors;
}
