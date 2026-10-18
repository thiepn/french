import {authorA1Unit,type A1AuthoredSpec,type A1Unit} from './u6-a1-model.ts';
import {provenance,distributionAllowed} from './source.ts';

/**
 * Reuse the original A1 lesson schema, answer checking and six-stage renderer.
 * A2 units share the exact learning interface but have independent A2 identity.
 */
export type A2Unit=A1Unit;
export function authorA2Unit(spec:A1AuthoredSpec,index:number):A2Unit{
 if(!Number.isInteger(index)||index<1||index>14)throw Error('Out-of-range A2 unit');
 const expected='a2-'+String(index).padStart(2,'0');
 if(spec.id!==expected)throw Error('Incorrect A2 author identity: '+spec.id);
 const inherited=authorA1Unit(spec,index+24);
 return Object.freeze({...inherited,
  prerequisites:Object.freeze([index===1?'a1-24':'a2-'+String(index-1).padStart(2,'0')]),
  source:provenance('original','session','u8-'+spec.id),
  minutes:35
 });
}
export function validateA2Units(units:readonly A2Unit[]):readonly string[]{
 const issues:string[]=[];
 if(units.length!==14)issues.push('Expected fourteen A2 lessons');
 for(const [i,unit] of units.entries()){
  const expected='a2-'+String(i+1).padStart(2,'0');
  if(unit.id!==expected||unit.order!==i+25)issues.push('A2 identity/order '+unit.id);
  if(unit.prerequisites.length!==1||
     unit.prerequisites[0]!== (i===0?'a1-24':'a2-'+String(i).padStart(2,'0')))
   issues.push('A2 continuity '+unit.id);
  if(unit.source.source!=='original'||unit.source.rights!=='original-owned'||
     !distributionAllowed(unit.source.source))issues.push('Source rights '+unit.id);
  if(unit.grammar.length<2||unit.grammar.some(g=>g.explanation.length<120||
      g.examples.length<2||g.correction.some(t=>!t.trim())))issues.push('Grammar depth '+unit.id);
  if(unit.vocabulary.length<12||unit.dialogue.length<5||unit.tasks.length<10||
     unit.writing.criteria.length<3||unit.writing.model.length<65)issues.push('Teaching depth '+unit.id);
  const kinds=new Set(unit.tasks.map(task=>task.type));
  for(const type of ['fill','choice','reading','order'])
   if(!kinds.has(type as 'fill'))issues.push('Missing practice type '+unit.id+'/'+type);
  if(new Set(unit.tasks.map(t=>t.id)).size!==unit.tasks.length)issues.push('Duplicate tasks '+unit.id);
  for(const task of unit.tasks){
   if(!task.answer.trim()||task.explanation.length<25||!task.focus.trim())issues.push('Weak correction '+task.id);
   if((task.type==='choice'||task.type==='reading')&&(task.options.length<3||!task.options.includes(task.answer)))
    issues.push('Invalid selection key '+task.id);
   if(task.type==='order'){
    const tokens=(raw:string)=>raw.trim().split(/\s+/).sort().join('|');
    if(tokens(task.options.join(' '))!==tokens(task.answer)||task.options.join(' ')===task.answer)
     issues.push('Invalid word order '+task.id);
   }
  }
 }
 return issues;
}
