import {authorA1Unit,type A1AuthoredSpec,type A1Unit} from './u6-a1-model.ts';
import {provenance} from './source.ts';

/** Original B1 lessons reuse the U6 six-stage learner UI and independent course-practice state. */
export function authorB1Unit(spec:A1AuthoredSpec,index:number):A1Unit{
 if(!Number.isInteger(index)||index<1||index>14||spec.id!=='b1-'+String(index).padStart(2,'0'))
  throw Error('Incorrect B1 original unit identity');
 const unit=authorA1Unit(spec,index+52);
 return Object.freeze({...unit,minutes:45,
  prerequisites:Object.freeze([index===1?'a2-28':'b1-'+String(index-1).padStart(2,'0')]),
  source:provenance('original','session','u10-'+spec.id)
 });
}
export function validateB1Units(units:readonly A1Unit[]):readonly string[]{
 const errors:string[]=[];
 if(units.length!==14)errors.push('Expected 14 substantial B1 units');
 for(const [i,unit] of units.entries()){
  const id='b1-'+String(i+1).padStart(2,'0');
  if(unit.id!==id||unit.order!==i+53||unit.prerequisites.join()!==(i?'b1-'+String(i).padStart(2,'0'):'a2-28'))errors.push(id+' order');
  if(unit.source.source!=='original'||unit.source.rights!=='original-owned'||!unit.source.qualifiedId.endsWith(':session:u10-'+id))errors.push(id+' ownership');
  if(unit.grammar.length<2||unit.grammar.some(g=>g.explanation.length<125||g.examples.length<2||g.correction.some(x=>x.length<6)))errors.push(id+' grammar');
  if(unit.vocabulary.length<12||unit.dialogue.length<5||unit.dialogue.some(t=>t.fr.length<55||!t.en)||unit.tasks.length<10||unit.writing.criteria.length<3||unit.writing.model.length<125)errors.push(id+' content');
  for(const mode of ['fill','choice','reading','order']){
   if(!unit.tasks.some(t=>t.type===mode))errors.push(id+' missing task '+mode);
  }
  for(const t of unit.tasks){
   if(!t.answer||!t.prompt||t.explanation.length<25||!t.focus)errors.push(t.id+' feedback');
   if((t.type==='reading'||t.type==='choice')&&(t.options.length<3||!t.options.includes(t.answer)))errors.push(t.id+' answer options');
   if(t.type==='order'){
    const norm=(s:string)=>s.split(/\s+/).filter(Boolean).sort().join('|');
    if(norm(t.options.join(' '))!==norm(t.answer)||t.options.join(' ')===t.answer)errors.push(t.id+' tiles');
   }
  }
 }
 return errors;
}
