import {authorA1Unit,type A1AuthoredSpec,type A1Unit} from './u6-a1-model.ts';
import {provenance} from './source.ts';
/** Original B1 depth: same six-stage Course schema; no new grades, scheduler or learner storage. */
export function authorB1DepthUnit(spec:A1AuthoredSpec,index:number):A1Unit{
 if(!Number.isInteger(index)||index<15||index>28||spec.id!=='b1-'+String(index).padStart(2,'0'))
  throw Error('Invalid U11 B1 unit identity');
 const base=authorA1Unit(spec,index+52);
 return Object.freeze({...base,minutes:50,
  prerequisites:Object.freeze(['b1-'+String(index-1).padStart(2,'0')]),
  source:provenance('original','session','u11-'+spec.id)
 });
}
export function validateB1DepthUnits(units:readonly A1Unit[]):readonly string[]{
 const errors:string[]=[];
 if(units.length!==14)errors.push('Expected 14 original B1 depth lessons');
 const ids=new Set<string>(),taskIds=new Set<string>();
 for(const [i,unit] of units.entries()){
  const n=i+15,id='b1-'+String(n).padStart(2,'0');
  if(unit.id!==id||unit.order!==n+52||unit.prerequisites.join()!=='b1-'+String(n-1).padStart(2,'0'))
   errors.push(id+' progression');
  if(ids.has(unit.id))errors.push('Repeated lesson '+id);ids.add(unit.id);
  if(unit.source.source!=='original'||unit.source.rights!=='original-owned'||
    !unit.source.qualifiedId.endsWith(':session:u11-'+id))errors.push(id+' provenance');
  if(unit.grammar.length<2||unit.grammar.some(g=>g.explanation.length<140||g.examples.length<2||
      g.correction.some(s=>s.length<6)))errors.push(id+' teaching blocks');
  if(unit.vocabulary.length!==12||unit.dialogue.length<5||unit.dialogue.some(d=>d.fr.length<60||!d.en)||
    unit.tasks.length!==10||unit.writing.criteria.length<3||unit.writing.model.length<160)
   errors.push(id+' content breadth');
  for(const k of ['fill','choice','reading','order'])
   if(!unit.tasks.some(task=>task.type===k))errors.push(id+' missing '+k);
  for(const task of unit.tasks){
   if(taskIds.has(task.id))errors.push('Repeated task '+task.id);taskIds.add(task.id);
   if(!task.answer||!task.focus||!task.prompt||task.explanation.length<35)
    errors.push(task.id+' corrective explanation');
   if((task.type==='choice'||task.type==='reading')&&(task.options.length<3||!task.options.includes(task.answer)))
    errors.push(task.id+' options');
   if(task.type==='order'){
    const tok=(s:string)=>s.trim().split(/\s+/).sort().join('|');
    if(tok(task.options.join(' '))!==tok(task.answer)||task.options.join(' ')===task.answer)
     errors.push(task.id+' ordering');
   }
  }
 }
 return errors;
}
