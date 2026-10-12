import {provenance,distributionAllowed,type QualifiedProvenance} from './source.ts';
export type A1TaskType='fill'|'choice'|'order'|'reading';
export interface A1Grammar {
 readonly heading:string;readonly explanation:string;
 readonly examples:readonly (readonly [string,string])[];
 readonly correction:readonly [string,string,string];
}
export interface A1Vocabulary {readonly french:string;readonly english:string;readonly context:string;}
export interface A1Task {
 readonly id:string;readonly type:A1TaskType;readonly prompt:string;
 readonly answer:string;readonly options:readonly string[];readonly explanation:string;readonly focus:string;
}
export interface A1Unit{
 readonly id:string;readonly order:number;readonly title:string;readonly goal:string;
 readonly prerequisites:readonly string[];readonly minutes:number;readonly source:QualifiedProvenance;
 readonly grammarIds:readonly string[];
 readonly grammar:readonly A1Grammar[];
 readonly vocabulary:readonly A1Vocabulary[];
 readonly dialogue:readonly {readonly speaker:string;readonly fr:string;readonly en:string}[];
 readonly tasks:readonly A1Task[];
 readonly writing:{readonly prompt:string;readonly criteria:readonly string[];readonly model:string};
}
export interface A1AuthoredSpec{
 id:string;title:string;goal:string;grammarIds:string[];
 grammar:[string,string,[string,string][],[string,string,string]][];
 vocabulary:[string,string,string][];
 dialogue:[string,string,string][];
 tasks:[A1TaskType,string,string,string,string[],string][];
 writing:[string,string[],string];
}
export function authorA1Unit(spec:A1AuthoredSpec,order:number):A1Unit{
 return Object.freeze({
  id:spec.id,order,title:spec.title,goal:spec.goal,
  prerequisites:Object.freeze(order===1?[]:['a1-'+String(order-1).padStart(2,'0')]),
  minutes:25,source:provenance('original','session','u6-'+spec.id),
  grammarIds:Object.freeze([...spec.grammarIds]),
  grammar:Object.freeze(spec.grammar.map(([heading,explanation,examples,correction])=>Object.freeze({
   heading,explanation,examples:Object.freeze(examples.map(row=>Object.freeze([...row] as const))),
   correction:Object.freeze([...correction] as [string,string,string])
  }))),
  vocabulary:Object.freeze(spec.vocabulary.map(([french,english,context])=>Object.freeze({french,english,context}))),
  dialogue:Object.freeze(spec.dialogue.map(([speaker,fr,en])=>Object.freeze({speaker,fr,en}))),
  tasks:Object.freeze(spec.tasks.map(([type,prompt,answer,explanation,options,focus],i)=>Object.freeze({
   id:spec.id+'-task-'+String(i+1).padStart(2,'0'),type,prompt,answer,explanation,
   options:Object.freeze([...options]),focus
  }))),
  writing:Object.freeze({prompt:spec.writing[0],criteria:Object.freeze([...spec.writing[1]]),model:spec.writing[2]})
 });
}
export function validateA1Units(units:readonly A1Unit[]):readonly string[]{
 const issues:string[]=[],ids=new Set<string>();
 for(const [i,unit] of units.entries()){
  if(ids.has(unit.id)||unit.id!=='a1-'+String(i+1).padStart(2,'0')||unit.order!==i+1)issues.push('Lesson identity/order '+unit.id);
  ids.add(unit.id);
  if(unit.prerequisites.some(p=>!ids.has(p)))issues.push('Missing earlier prerequisite '+unit.id);
  if(!distributionAllowed(unit.source.source)||unit.source.source!=='original'||unit.source.rights!=='original-owned')
   issues.push('Unqualified source '+unit.id);
  if(unit.grammar.length<2||unit.grammar.some(g=>g.explanation.length<100||g.examples.length<2||!g.correction[2]))
   issues.push('Insufficient grammar '+unit.id);
  if(unit.vocabulary.length<12||unit.dialogue.length<5||unit.tasks.length<10||unit.writing.criteria.length<3)
   issues.push('Insufficient teaching material '+unit.id);
  if(new Set(unit.tasks.map(t=>t.id)).size!==unit.tasks.length)issues.push('Duplicate tasks '+unit.id);
  for(const task of unit.tasks){
   if(!task.prompt||!task.answer||task.explanation.length<22||!task.focus)issues.push('Insufficient task '+task.id);
   if((task.type==='choice'||task.type==='reading')&&(!task.options.includes(task.answer)||task.options.length<3))
    issues.push('Invalid option key '+task.id);
   if(task.type==='order'&&task.options.join(' ').replace(/\s+/g,' ').trim()===task.answer.trim())
    issues.push('Ordering task already solved '+task.id);
  }
  if(unit.dialogue.some(line=>!line.fr||!line.en)||unit.vocabulary.some(word=>!word.context||!word.english))
   issues.push('Empty dialogue/glossary '+unit.id);
 }
 if(units.length!==12)issues.push('Expected 12 full units');
 return issues;
}
