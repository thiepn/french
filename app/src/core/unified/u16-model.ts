import {authorA1Unit,type A1AuthoredSpec,type A1Unit} from './u6-a1-model.ts';
import {TRANSFER_GRAMMAR} from './u13-transfer-grammar.ts';
import {provenance} from './source.ts';
import type {B1Reading} from './u10-readings-01-07.ts';
import type {A1ListeningQuestion} from './u7-listening.ts';
import type {TransferEvidence,TransferQuestion} from './u13-transfer-model.ts';

type QuestionTuple=[string,string,string[],string];
type PromptTuple=[string,string[],string];
export interface U16AuthoredScenario{
 id:string; title:string; goal:string; grammarKeys:[string,string];
 vocabulary:[string,string,string][]; dialogue:[string,string,string][];
 reading:{title:string;paragraphs:[string,string,string];questions:[QuestionTuple,QuestionTuple,QuestionTuple]};
 evidence:[TransferEvidence,TransferEvidence];
 comparison:[QuestionTuple,QuestionTuple];
 listening:[QuestionTuple,QuestionTuple,QuestionTuple,QuestionTuple,QuestionTuple];
 recall:{clozes:[[string,string,string,string],[string,string,string,string]];
  order:[string,[string,string],string,string]};
 writing:{fromListening:PromptTuple;fromSources:PromptTuple;fromDebate:PromptTuple};
 oral:{prompt:string;plan:[string,string,string];model:string};
}
export interface U16Scenario{
 readonly unit:A1Unit;
 readonly reading:B1Reading;
 readonly evidence:readonly TransferEvidence[];
 readonly crossQuestions:readonly TransferQuestion[];
 readonly listening:readonly A1ListeningQuestion[];
 readonly writingChoices:Readonly<{fromListening:Readonly<{prompt:string;criteria:readonly string[];model:string}>;fromSources:Readonly<{prompt:string;criteria:readonly string[];model:string}>;fromDebate:Readonly<{prompt:string;criteria:readonly string[];model:string}>}>;
 readonly oral:Readonly<{prompt:string;plan:readonly string[];model:string}>;
}
function question([prompt,answer,options,explanation]:QuestionTuple):TransferQuestion{
 return Object.freeze({prompt,answer,options:Object.freeze([...options]),explanation});
}
function writing([prompt,criteria,model]:PromptTuple){
 return Object.freeze({prompt,criteria:Object.freeze([...criteria]),model});
}
/** Additional original practice material, never an alternate academic or review authority. */
export function authorU16Scenario(spec:U16AuthoredScenario,n:number):U16Scenario{
 const id='transfer-'+String(n).padStart(2,'0');
 if(n<46||n>60||spec.id!==id)throw Error('U16 transfer identity '+spec.id);
 const grammar:A1AuthoredSpec['grammar']=spec.grammarKeys.map(key=>{
  const g=TRANSFER_GRAMMAR[key];
  if(!g)throw Error('Unknown original teaching bridge '+key);
  return [g[0],g[1],g[2].map(x=>[x[0],x[1]] as [string,string]),[g[3][0],g[3][1],g[3][2]]];
 });
 const practice:A1AuthoredSpec['tasks']=[
  ...spec.reading.questions.map(([q,a,options,why]):A1AuthoredSpec['tasks'][number]=>['reading',q,a,why,[...options],'connected reading']),
  ...spec.comparison.map(([q,a,options,why]):A1AuthoredSpec['tasks'][number]=>['choice',q,a,why,[...options],'paired-source comparison']),
  ...spec.recall.clozes.map(([q,a,why,focus]):A1AuthoredSpec['tasks'][number]=>['fill',q,a,why,[],focus]),
  ['order','Put the words into the supported sentence.',spec.recall.order[0],spec.recall.order[2],
   [...spec.recall.order[1]],spec.recall.order[3]],
  ...spec.listening.slice(0,2).map(([q,a,options,why]):A1AuthoredSpec['tasks'][number]=>['choice',q,a,why,[...options],'dialogue comprehension'])
 ];
 const authored:A1AuthoredSpec={id,title:spec.title,goal:spec.goal,grammarIds:[],grammar,
  vocabulary:spec.vocabulary,dialogue:spec.dialogue,tasks:practice,writing:spec.writing.fromSources};
 const unit=Object.freeze({...authorA1Unit(authored,94+n),
  minutes:70,source:provenance('original','session','u16-'+id),
  prerequisites:Object.freeze(['transfer-'+String(n-1).padStart(2,'0')])});
 const reading:B1Reading=Object.freeze({unitId:id,title:spec.reading.title,
  french:spec.reading.paragraphs.join('\n\n'),
  questions:Object.freeze(spec.reading.questions.map(question))});
 const listening=Object.freeze(spec.listening.map(([prompt,answer,options,explanation],i)=>
  Object.freeze({id:id+'-listen-'+(i+1),prompt,answer,options:Object.freeze([...options]),explanation})));
 return Object.freeze({unit,reading,evidence:Object.freeze(spec.evidence.map(x=>Object.freeze({...x}))),
  crossQuestions:Object.freeze(spec.comparison.map(question)),listening,
  writingChoices:Object.freeze({fromListening:writing(spec.writing.fromListening),fromSources:writing(spec.writing.fromSources),fromDebate:writing(spec.writing.fromDebate)}),
  oral:Object.freeze({prompt:spec.oral.prompt,plan:Object.freeze([...spec.oral.plan]),model:spec.oral.model})});
}
export function validateU16Scenarios(items:readonly U16Scenario[]):readonly string[]{
 const errors:string[]=[];
 if(items.length!==15)errors.push('Expected 15 distinct original U16 scenarios');
 for(const [i,s] of items.entries()){
  const id='transfer-'+String(i+46).padStart(2,'0'),u=s.unit;
  if(u.id!==id||u.order!==140+i||u.prerequisites.join()!==
     'transfer-'+String(i+45).padStart(2,'0'))errors.push(id+' order/prerequisite');
  if(u.source.source!=='original'||u.source.rights!=='original-owned'||
   !u.source.qualifiedId.endsWith(':session:u16-'+id))errors.push(id+' source custody');
  if(u.grammar.length!==2||u.vocabulary.length!==12||
   u.dialogue.length<6||u.tasks.length!==10)errors.push(id+' content volume');
  for(const mode of ['fill','order','reading','choice'])
   if(!u.tasks.some(x=>x.type===mode))errors.push(id+' exercise mode '+mode);
  for(const t of u.tasks){
   if(t.explanation.length<28)errors.push(t.id+' misconception explanation');
   if((t.type==='reading'||t.type==='choice')&&(!t.options.includes(t.answer)||t.options.length!==3))
    errors.push(t.id+' option key');
   if(t.type==='order'){
    const norm=(s:string)=>s.trim().split(/\s+/).sort().join('|');
    if(norm(t.answer)!==norm(t.options.join(' '))||t.options.join(' ')===t.answer)
     errors.push(t.id+' word order');
   }
  }
  if(s.reading.french.trim().split(/\s+/).length<170||s.reading.questions.length!==3)
   errors.push(id+' long reading');
  if(s.evidence.length!==2||s.evidence.some(e=>e.french.length<90)||s.crossQuestions.length!==2)
   errors.push(id+' independently attributed documents');
  if(s.listening.length!==5||s.listening.some(q=>!q.options.includes(q.answer)||q.explanation.length<28))
   errors.push(id+' deeper listening');
  for(const p of [s.writingChoices.fromListening,s.writingChoices.fromSources,s.writingChoices.fromDebate])
   if(p.criteria.length<3||p.model.length<190)errors.push(id+' extended writing variant');
  if(s.oral.plan.length!==3||s.oral.model.length<115)errors.push(id+' spoken self-preparation');
 }
 return errors;
}
