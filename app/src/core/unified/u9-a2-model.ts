import {authorA1Unit,type A1AuthoredSpec,type A1Unit} from './u6-a1-model.ts';
import {provenance} from './source.ts';
/** U9 adds original A2 teaching data to U6's existing six-stage lesson engine. */
export function authorA2PracticalUnit(spec:A1AuthoredSpec,index:number):A1Unit{
 if(!Number.isInteger(index)||index<15||index>28||spec.id!=='a2-'+String(index).padStart(2,'0'))
  throw Error('Invalid practical A2 lesson identity');
 const base=authorA1Unit(spec,index+24);
 return Object.freeze({...base,
  prerequisites:Object.freeze(['a2-'+String(index-1).padStart(2,'0')]),
  source:provenance('original','session','u9-'+spec.id),minutes:35
 });
}
export function validatePracticalA2Units(units:readonly A1Unit[]):readonly string[]{
 const errors:string[]=[];
 if(units.length!==14)errors.push('Expected 14 new A2 units');
 for(const [i,u] of units.entries()){
  const index=i+15,id='a2-'+String(index).padStart(2,'0');
  if(u.id!==id||u.order!==index+24||u.prerequisites.join()!=='a2-'+String(index-1).padStart(2,'0'))
   errors.push(id+' sequence');
  if(u.source.source!=='original'||u.source.rights!=='original-owned'||!u.source.qualifiedId.endsWith(':session:u9-'+id))
   errors.push(id+' original source');
  if(u.grammar.length<2||u.grammar.some(g=>g.explanation.length<120||g.examples.length<2||
      !g.correction.every(p=>p.length>5)))errors.push(id+' insufficient grammar');
  if(u.vocabulary.length<12||u.vocabulary.some(w=>!w.context||!w.english)||
    u.dialogue.length<5||u.dialogue.some(d=>!d.fr||!d.en)||
    u.tasks.length<10||u.writing.criteria.length<3||u.writing.model.length<65)
   errors.push(id+' insufficient teaching content');
  for(const mode of ['choice','fill','reading','order'])
   if(!u.tasks.some(t=>t.type===mode))errors.push(id+' missing '+mode);
  for(const t of u.tasks){
   if(!t.answer||!t.prompt||t.explanation.length<25||!t.focus)errors.push(t.id+' weak feedback');
   if((t.type==='choice'||t.type==='reading')&&(!t.options.includes(t.answer)||t.options.length<3))
    errors.push(t.id+' invalid response choices');
   if(t.type==='order'){
    const norm=(s:string)=>s.split(/\s+/).filter(Boolean).sort().join('|');
    if(norm(t.options.join(' '))!==norm(t.answer)||t.options.join(' ')===t.answer)
      errors.push(t.id+' invalid word tiles');
   }
  }
 }
 return errors;
}
