import {ORIGINAL_FRENCH_U22_COURSE,validateU22OriginalCourse} from './u22-course.ts';
import {U42_151} from './u42-151.ts';
import {U42_152} from './u42-152.ts';
import {U42_153} from './u42-153.ts';
import {SOURCES} from './source.ts';
import {U42_B2_GRAMMAR} from './u42-b2-grammar.ts';
import {U46_B2_GRAMMAR} from './u46-b2-grammar.ts';
import {U46_154} from './u46-154.ts';
import {U46_155} from './u46-155.ts';
import {U46_156} from './u46-156.ts';
import {U49_157} from './u49-157.ts';
import {U49_B2_GRAMMAR} from './u49-b2-grammar.ts';
import {U50_158} from './u50-158.ts';
import {U50_159} from './u50-159.ts';
import {U50_B2_GRAMMAR} from './u50-b2-grammar.ts';
import {U51_160} from './u51-160.ts';
import {U51_161} from './u51-161.ts';
import {U51_B2_GRAMMAR} from './u51-b2-grammar.ts';
import {U52_162} from './u52-162.ts';
import {U52_163} from './u52-163.ts';
import {U52_B2_GRAMMAR} from './u52-b2-grammar.ts';
import {U53_164} from './u53-164.ts';
import {U53_165} from './u53-165.ts';
import {U53_B2_GRAMMAR} from './u53-b2-grammar.ts';
import {U54_166} from './u54-166.ts';
import {U54_167} from './u54-167.ts';
import {U54_B2_GRAMMAR} from './u54-b2-grammar.ts';
import type {A1Unit} from './u6-a1-model.ts';
import type {U21Scenario} from './u21-model.ts';

/** Exactly 244 preceding units are immutable; new B2 cases are additive. */
const ORIGINAL_U42_CASES:readonly U21Scenario[]=[...U42_151,...U42_152,...U42_153];
export const U42_B2_CASES:readonly U21Scenario[]=Object.freeze(ORIGINAL_U42_CASES.map(story=>
 Object.freeze({...story,unit:Object.freeze({...story.unit,
  grammar:U42_B2_GRAMMAR[story.unit.id]??story.unit.grammar
 })})
));
/** Three consecutive source-owned chapters with a shared fictional civic dossier.
 * The prior U42_B2_CASES objects and first 247 lesson references stay untouched.
 */
export const U46_B2_SEQUENCE:readonly U21Scenario[]=Object.freeze(
 [...U46_154,...U46_155,...U46_156].map(story=>
  Object.freeze({...story,unit:Object.freeze({...story.unit,
   grammar:U46_B2_GRAMMAR[story.unit.id]??story.unit.grammar
  })})
 )
);
/** Additive complete next teaching chapter; existing 250 objects and IDs stay immutable. */
export const U49_B2_EXTENSION:readonly U21Scenario[]=Object.freeze(
 U49_157.map(story=>Object.freeze({...story,unit:Object.freeze({...story.unit,
  grammar:U49_B2_GRAMMAR[story.unit.id]??story.unit.grammar
 })}))
);
/** Chronological source-owned case continuation. The entire preceding 251-object original corpus stays intact. */
export const U50_B2_SEQUENCE:readonly U21Scenario[]=Object.freeze(
 [...U50_158,...U50_159].map(story=>Object.freeze({...story,unit:Object.freeze({...story.unit,
  grammar:U50_B2_GRAMMAR[story.unit.id]??story.unit.grammar
 })}))
);
/** New original B2 interpersonal pair. Historical 253 lesson objects must remain unchanged. */
export const U51_B2_INTERPERSONAL:readonly U21Scenario[]=Object.freeze(
 [...U51_160,...U51_161].map(story=>Object.freeze({...story,unit:Object.freeze({...story.unit,
  grammar:U51_B2_GRAMMAR[story.unit.id]??story.unit.grammar
 })}))
);
/** New original professional B2 communication; first 255 original units and references are immutable. */
export const U52_B2_PROFESSIONAL:readonly U21Scenario[]=Object.freeze(
 [...U52_162,...U52_163].map(story=>Object.freeze({...story,unit:Object.freeze({...story.unit,
  grammar:U52_B2_GRAMMAR[story.unit.id]??story.unit.grammar
 })}))
);
/** Independent original B2 narrative and humour cases, leaving all 257 preceding source objects untouched. */
export const U53_B2_NARRATIVE:readonly U21Scenario[]=Object.freeze(
 [...U53_164,...U53_165].map(story=>Object.freeze({...story,unit:Object.freeze({...story.unit,
  grammar:U53_B2_GRAMMAR[story.unit.id]??story.unit.grammar
 })}))
);
/** Additive B2 practical teaching and adaptive procedural mediation; first 259 references untouched. */
export const U54_B2_MEDIATION:readonly U21Scenario[]=Object.freeze(
 [...U54_166,...U54_167].map(story=>Object.freeze({...story,unit:Object.freeze({...story.unit,
  grammar:U54_B2_GRAMMAR[story.unit.id]??story.unit.grammar
 })}))
);
export const ORIGINAL_FRENCH_U42_COURSE:readonly A1Unit[]=Object.freeze([
 ...ORIGINAL_FRENCH_U22_COURSE,...U42_B2_CASES.map(s=>s.unit),
 ...U46_B2_SEQUENCE.map(s=>s.unit),...U49_B2_EXTENSION.map(s=>s.unit),
 ...U50_B2_SEQUENCE.map(s=>s.unit),...U51_B2_INTERPERSONAL.map(s=>s.unit),...U52_B2_PROFESSIONAL.map(s=>s.unit),...U53_B2_NARRATIVE.map(s=>s.unit),...U54_B2_MEDIATION.map(s=>s.unit)
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
 if(U42_B2_CASES.length!==3||U46_B2_SEQUENCE.length!==3||U49_B2_EXTENSION.length!==1||
    U50_B2_SEQUENCE.length!==2||U51_B2_INTERPERSONAL.length!==2||U52_B2_PROFESSIONAL.length!==2||U53_B2_NARRATIVE.length!==2||U54_B2_MEDIATION.length!==2||
    ORIGINAL_FRENCH_U42_COURSE.length!==261)
  issues.push('Historical 151–165 original lessons must remain unchanged before additive 166–167 mediation');
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
  if(unit.grammar!==U42_B2_GRAMMAR[id]||
     unit.grammar.some(g=>g.explanation.length<150||g.examples.length!==2||
      !g.correction[0]||!g.correction[1]||g.correction[2].length<40))
   issues.push(id+' missing B2-authored reasoning and grammatical contrasts');
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
 for(let i=0;i<U46_B2_SEQUENCE.length;i++){
  const story=U46_B2_SEQUENCE[i],unit=story.unit,n=i+154,id='transfer-'+n;
  if(unit.id!==id||unit.order!==n+94||unit.prerequisites.join()!=='transfer-'+(n-1))
   issues.push(id+' breaks sequential B2 prerequisites');
  if(unit.source.source!=='original'||unit.source.rights!=='original-owned'||
     unit.source.sourceRevision!==SOURCES.original.revision||
     unit.source.qualifiedId!=='fru1:original@'+SOURCES.original.revision+':session:u46-'+id)
   issues.push(id+' unqualified source rights or identity');
  if(unit.grammar!==U46_B2_GRAMMAR[id]||unit.grammar.length!==2||
     unit.grammar.some(g=>g.explanation.length<160||g.examples.length!==2||
      !g.correction[0]||!g.correction[1]||g.correction[2].length<70))
   issues.push(id+' missing context-specific B2 grammar');
  if(unit.vocabulary.length!==12||unit.dialogue.length!==9||unit.tasks.length!==10||
     new Set(unit.tasks.map(x=>x.id)).size!==10)
   issues.push(id+' missing active recall, dialogue or vocabulary');
  for(const type of ['fill','reading','choice','order'])
   if(!unit.tasks.some(x=>x.type===type))issues.push(id+' missing '+type);
  for(const t of unit.tasks){
   if(t.explanation.length<28||!t.answer.trim())issues.push(t.id+' missing authored correction');
   if((t.type==='reading'||t.type==='choice')&&(t.options.length!==3||
    new Set(t.options).size!==3||!t.options.includes(t.answer)))
    issues.push(t.id+' invalid options');
   if(t.type==='order'){
    const norm=(v:string)=>v.trim().split(/\s+/).sort().join('|');
    if(norm(t.answer)!==norm(t.options.join(' '))||t.answer===t.options.join(' '))
     issues.push(t.id+' cannot be independently reordered');
   }
  }
  if(story.reading.french.trim().split(/\s+/).length<190||
     story.reading.questions.length!==3)issues.push(id+' insufficient original B2 reading');
  if(story.evidence.length!==2||story.evidence.some(x=>x.french.length<150)||
     story.crossQuestions.length!==2)issues.push(id+' missing paired original evidence');
  if(story.listening.length!==6||story.listening.some(x=>!x.options.includes(x.answer)))
   issues.push(id+' missing original listening comprehension');
  for(const writing of [story.writingChoices.fromListening,story.writingChoices.fromSources,
                        story.writingChoices.fromDebate]){
   if(writing.criteria.length!==3||writing.model.length<300||writing.prompt.length<65)
    issues.push(id+' original extended writing missing');
  }
  if(story.oral.plan.length!==3||story.oral.model.length<175||story.oral.prompt.length<60)
   issues.push(id+' independent oral training missing');
  if(i>0&&!story.reading.french.includes('consultation')&&
     !story.reading.french.includes('sondage'))
   issues.push(id+' disconnected from preceding consultation');
 }
 const latest=U49_B2_EXTENSION[0];
 if(!latest||latest.unit.id!=='transfer-157'||latest.unit.order!==251||
    latest.unit.prerequisites.join()!=='transfer-156')
  issues.push('Original 157 identity/order must extend 156 only');
 else{
  const unit=latest.unit;
  if(unit.source.source!=='original'||unit.source.rights!=='original-owned'||
     unit.source.sourceRevision!==SOURCES.original.revision||
     !unit.source.qualifiedId.endsWith(':session:u49-transfer-157'))
    issues.push('Original 157 provenance or rights invalid');
  if(unit.grammar!==U49_B2_GRAMMAR['transfer-157']||unit.grammar.length!==2||
     unit.grammar.some(g=>g.explanation.length<250||g.examples.length!==2||
      g.correction[2].length<100))
    issues.push('Original 157 advanced explicit media attribution grammar missing');
  if(unit.vocabulary.length!==12||unit.dialogue.length!==9||unit.tasks.length!==10||
     unit.dialogue.some(x=>x.fr.length<70)||new Set(unit.tasks.map(x=>x.id)).size!==10)
    issues.push('Original 157 vocabulary/dialogue/active recall not complete');
  for(const type of ['fill','order','reading','choice'] as const)
   if(!unit.tasks.some(t=>t.type===type))issues.push('157 missing '+type);
  for(const task of unit.tasks){
   if(!task.answer.trim()||task.explanation.length<35)
    issues.push('157 insufficient explanation '+task.id);
   if((task.type==='reading'||task.type==='choice')&&
      (task.options.length!==3||new Set(task.options).size!==3||!task.options.includes(task.answer)))
    issues.push('157 invalid sourced choice '+task.id);
   if(task.type==='order'){
    const norm=(x:string)=>x.trim().split(/\s+/).sort().join('|');
    if(norm(task.answer)!==norm(task.options.join(' '))||task.answer===task.options.join(' '))
     issues.push('157 unanswerable sentence order');
   }
  }
  if(latest.reading.french.trim().split(/\s+/).length<270||
     latest.reading.questions.length!==3||latest.reading.title.length<25)
    issues.push('157 long original article insufficient');
  if(latest.evidence.length!==2||latest.evidence.some(s=>s.french.length<180)||
     latest.crossQuestions.length!==2||latest.listening.length!==6)
    issues.push('157 independent screenshot/notice source comparison missing');
  for(const writing of [latest.writingChoices.fromListening,
                         latest.writingChoices.fromSources,latest.writingChoices.fromDebate])
   if(writing.criteria.length!==3||writing.model.length<490||writing.prompt.length<100)
    issues.push('157 original extended public correction task incomplete');
  if(latest.oral.plan.length!==3||latest.oral.model.length<300||latest.oral.prompt.length<110)
   issues.push('157 independent spoken source briefing incomplete');
 }
 for(const [i,story] of U50_B2_SEQUENCE.entries()){
  const n=158+i,id='transfer-'+n,unit=story.unit;
  if(unit.id!==id||unit.order!==n+94||unit.prerequisites.join()!=='transfer-'+(n-1))
   issues.push(id+' not a sequential original lesson');
  if(unit.source.source!=='original'||unit.source.rights!=='original-owned'||
     unit.source.sourceRevision!==SOURCES.original.revision||
     !unit.source.qualifiedId.endsWith(':session:u50-'+id))
   issues.push(id+' original source rights and custody changed');
  if(unit.grammar!==U50_B2_GRAMMAR[id]||unit.grammar.length!==2||
     unit.grammar.some(g=>g.explanation.length<350||g.examples.length!==2||
      !g.correction[0]||!g.correction[1]||g.correction[2].length<130))
   issues.push(id+' missing original detailed B2 language teaching and corrections');
  if(unit.vocabulary.length!==12||unit.dialogue.length!==9||unit.tasks.length!==10||
     unit.dialogue.some(t=>t.fr.length<80)||new Set(unit.tasks.map(t=>t.id)).size!==10)
   issues.push(id+' missing substantial dialogue, vocabulary or active recall');
  for(const type of ['fill','order','reading','choice'] as const)
   if(!unit.tasks.some(task=>task.type===type))issues.push(id+' missing '+type);
  for(const task of unit.tasks){
   if(task.explanation.length<45||!task.answer.trim())issues.push(task.id+' unclear factual correction');
   if((task.type==='reading'||task.type==='choice')&&
      (task.options.length!==3||new Set(task.options).size!==3||!task.options.includes(task.answer)))
    issues.push(task.id+' unanswerable documented source option');
   if(task.type==='order'){
    const norm=(x:string)=>x.trim().split(/\s+/).sort().join('|');
    if(norm(task.answer)!==norm(task.options.join(' '))||task.answer===task.options.join(' '))
     issues.push(task.id+' cannot be independently ordered');
   }
  }
  if(story.reading.french.trim().split(/\s+/).length<310||story.reading.questions.length!==3||
     story.reading.french.split('\n\n').length!==3)
   issues.push(id+' missing long connected original French reading');
  if(story.evidence.length!==2||story.evidence.some(s=>s.french.length<220)||
     story.crossQuestions.length!==2||story.listening.length!==6)
   issues.push(id+' insufficient dated source analysis and listening');
  for(const writing of [story.writingChoices.fromListening,story.writingChoices.fromSources,
                        story.writingChoices.fromDebate])
   if(writing.criteria.length!==3||writing.model.length<600||writing.prompt.length<110)
    issues.push(id+' insufficient independently authored extended French writing');
  if(story.oral.plan.length!==3||story.oral.model.length<400||story.oral.prompt.length<145)
   issues.push(id+' insufficient independently authored oral production');
 }
 if(U50_B2_SEQUENCE[0]?.reading.french.includes('rampe')!==true||
    U50_B2_SEQUENCE[1]?.reading.french.includes('jeudi')!==true||
    U50_B2_SEQUENCE[1]?.reading.french.includes('vendredi')!==true)
  issues.push('158–159 must continue the existing 157 T7 dossier with auditable chronology');
 for(const [i,story] of U51_B2_INTERPERSONAL.entries()){
  const n=160+i,id='transfer-'+n,unit=story.unit;
  if(unit.id!==id||unit.order!==n+94||unit.prerequisites.join()!=='transfer-'+(n-1))
   issues.push(id+' non-sequential B2 original prerequisite');
  if(unit.source.source!=='original'||unit.source.rights!=='original-owned'||
     unit.source.sourceRevision!==SOURCES.original.revision||
     !unit.source.qualifiedId.endsWith(':session:u51-'+id))
   issues.push(id+' original rights or provenance mismatch');
  if(unit.grammar!==U51_B2_GRAMMAR[id]||unit.grammar.length!==2||
     unit.grammar.some(g=>g.explanation.length<500||g.examples.length!==2||
      !g.correction[0]||!g.correction[1]||g.correction[2].length<135))
   issues.push(id+' missing contextual B2 pragmatic grammar or repair');
  if(unit.vocabulary.length!==12||unit.dialogue.length!==9||unit.tasks.length!==10||
     unit.dialogue.some(t=>t.fr.length<95)||new Set(unit.tasks.map(t=>t.id)).size!==10)
   issues.push(id+' incomplete contextual vocabulary, listening dialogue or recall');
  for(const kind of ['fill','order','reading','choice'] as const)
   if(!unit.tasks.some(t=>t.type===kind))issues.push(id+' missing '+kind);
  for(const task of unit.tasks){
   if(!task.answer.trim()||task.explanation.length<55)
    issues.push(id+' incomplete authored response feedback '+task.id);
   if((task.type==='reading'||task.type==='choice')&&
      (task.options.length!==3||new Set(task.options).size!==3||!task.options.includes(task.answer)))
    issues.push(id+' unsupported interpretation '+task.id);
   if(task.type==='order'){
    const norm=(s:string)=>s.trim().split(/\s+/).sort().join('|');
    if(norm(task.answer)!==norm(task.options.join(' '))||task.answer===task.options.join(' '))
     issues.push(id+' invalid French word-order task');
   }
  }
  if(story.reading.french.trim().split(/\s+/).length<340||
     story.reading.french.split('\n\n').length!==3||story.reading.questions.length!==3)
   issues.push(id+' missing substantive original three-part French narrative');
  if(story.evidence.length!==2||story.evidence.some(e=>e.french.length<240)||
     story.crossQuestions.length!==2||story.listening.length!==6)
   issues.push(id+' missing distinct original perspectives and source-based comprehension');
  for(const writing of [story.writingChoices.fromListening,story.writingChoices.fromSources,
                        story.writingChoices.fromDebate])
   if(writing.criteria.length!==3||writing.model.length<700||writing.prompt.length<135)
    issues.push(id+' missing extended original interpersonal French writing');
  if(story.oral.plan.length!==3||story.oral.model.length<460||story.oral.prompt.length<145)
   issues.push(id+' missing original independent spoken narrative and reply');
 }
 const first=U51_B2_INTERPERSONAL[0],second=U51_B2_INTERPERSONAL[1];
 if(!first?.reading.french.includes('Samir')||!first.reading.french.includes('Camille')||
    !first.reading.french.includes('Nour')||!second?.reading.french.includes('jeudi')||
    !second.reading.french.includes('confidentiel')||!second.reading.french.includes('Nour'))
  issues.push('160–161 interpersonal narrative continuity, voluntary consent or private boundary missing');
 for(const [i,story] of U52_B2_PROFESSIONAL.entries()){
  const n=162+i,id='transfer-'+n,unit=story.unit;
  if(unit.id!==id||unit.order!==n+94||unit.prerequisites.join()!=='transfer-'+(n-1))
   issues.push(id+' broken B2 original order or prerequisite');
  if(unit.source.source!=='original'||unit.source.rights!=='original-owned'||
     unit.source.sourceRevision!==SOURCES.original.revision||
     !unit.source.qualifiedId.endsWith(':session:u52-'+id))
   issues.push(id+' original ownership and provenance mismatch');
  if(unit.grammar!==U52_B2_GRAMMAR[id]||unit.grammar.length!==2||
     unit.grammar.some(g=>g.explanation.length<530||g.examples.length!==2||
      !g.correction[0]||!g.correction[1]||g.correction[2].length<150))
   issues.push(id+' missing substantive original professional grammar and misconception repairs');
  if(unit.vocabulary.length!==12||unit.dialogue.length!==9||unit.tasks.length!==10||
     unit.dialogue.some(d=>d.fr.length<100)||new Set(unit.tasks.map(t=>t.id)).size!==10)
   issues.push(id+' insufficient original contextual dialogue, recall or vocabulary');
  for(const kind of ['fill','order','reading','choice'] as const)
   if(!unit.tasks.some(t=>t.type===kind))issues.push(id+' missing '+kind);
  for(const t of unit.tasks){
   if(!t.answer.trim()||t.explanation.length<45)issues.push(t.id+' missing specific source correction');
   if((t.type==='reading'||t.type==='choice')&&
      (t.options.length!==3||new Set(t.options).size!==3||!t.options.includes(t.answer)))
    issues.push(t.id+' invalid independently supported answer choices');
   if(t.type==='order'){
    const norm=(s:string)=>s.trim().split(/\s+/).sort().join('|');
    if(norm(t.answer)!==norm(t.options.join(' '))||t.answer===t.options.join(' '))
     issues.push(t.id+' cannot reconstruct correct word order');
   }
  }
  if(story.reading.french.trim().split(/\s+/).length<355||
     story.reading.french.split('\n\n').length!==3||story.reading.questions.length!==3)
   issues.push(id+' missing sustained three-paragraph original professional reading');
  if(story.evidence.length!==2||story.evidence.some(d=>d.french.length<280)||
     story.crossQuestions.length!==2||story.listening.length!==6)
   issues.push(id+' insufficient original attributed professional materials and listening');
  for(const w of [story.writingChoices.fromListening,story.writingChoices.fromSources,story.writingChoices.fromDebate])
   if(w.criteria.length!==3||w.model.length<740||w.prompt.length<145)
    issues.push(id+' insufficient original B2 independent professional writing');
  if(story.oral.plan.length!==3||story.oral.model.length<550||story.oral.prompt.length<165)
   issues.push(id+' insufficient independent oral presentation and responsive clarification');
 }
 if(!U52_B2_PROFESSIONAL[0]?.reading.french.includes('Maëlle')||
    !U52_B2_PROFESSIONAL[0].reading.french.includes('quatre-vingts')||
    !U52_B2_PROFESSIONAL[1]?.reading.french.includes('Maëlle')||
    !U52_B2_PROFESSIONAL[1].reading.french.includes('six fiches')||
    !U52_B2_PROFESSIONAL[1].reading.french.includes('contrôle interne'))
  issues.push('162–163 professional continuity or accurate team contribution and handover missing');
 for(const [i,story] of U53_B2_NARRATIVE.entries()){
  const n=164+i,id='transfer-'+n,unit=story.unit;
  if(unit.id!==id||unit.order!==n+94||unit.prerequisites.join()!=='transfer-'+(n-1))
   issues.push(id+' invalid source-owned lesson order or prerequisite');
  if(unit.source.source!=='original'||unit.source.rights!=='original-owned'||
     unit.source.sourceRevision!==SOURCES.original.revision||
     !unit.source.qualifiedId.endsWith(':session:u53-'+id))
   issues.push(id+' provenance or original rights changed');
  if(unit.grammar!==U53_B2_GRAMMAR[id]||unit.grammar.length!==2||
     unit.grammar.some(g=>g.explanation.length<500||g.examples.length!==2||
      !g.correction[0]||!g.correction[1]||g.correction[2].length<130))
   issues.push(id+' insufficient original narration and register grammar teaching');
  if(unit.vocabulary.length!==12||unit.dialogue.length!==9||unit.tasks.length!==10||
     new Set(unit.tasks.map(t=>t.id)).size!==10)
   issues.push(id+' incomplete vocabulary, dialogue or authored recall');
  for(const kind of ['fill','order','reading','choice'] as const)
   if(!unit.tasks.some(t=>t.type===kind))issues.push(id+' missing '+kind+' practice');
  for(const t of unit.tasks){
   if(!t.answer.trim()||t.explanation.length<45)issues.push(t.id+' missing specific authored correction');
   if((t.type==='reading'||t.type==='choice')&&
      (t.options.length!==3||new Set(t.options).size!==3||!t.options.includes(t.answer)))
    issues.push(t.id+' unanswerable contextual interpretation');
   if(t.type==='order'){
    const norm=(s:string)=>s.trim().split(/\s+/).sort().join('|');
    if(norm(t.answer)!==norm(t.options.join(' '))||t.answer===t.options.join(' '))
     issues.push(t.id+' cannot reconstruct word order from tokens');
   }
  }
  if(story.reading.french.trim().split(/\s+/).length<365||
     story.reading.french.split('\n\n').length!==3||story.reading.questions.length!==3)
   issues.push(id+' missing sustained three-part original fictional prose');
  if(story.evidence.length!==2||story.evidence.some(d=>d.french.length<300)||
     story.crossQuestions.length!==2||story.listening.length!==6)
   issues.push(id+' insufficient invented narrative artefacts and interpretation');
  for(const w of [story.writingChoices.fromListening,story.writingChoices.fromSources,story.writingChoices.fromDebate])
   if(w.criteria.length!==3||w.model.length<850||w.prompt.length<145)
    issues.push(id+' incomplete independent creative writing and revision teaching');
  if(story.oral.plan.length!==3||story.oral.model.length<700||story.oral.prompt.length<155)
   issues.push(id+' missing independently authored oral storytelling and listening cues');
  if(story.writingChoices.fromSources.criteria.some(t=>t.includes('Attribute each document separately'))||
     story.oral.plan.some(t=>t.includes('Recommend a conditional practical next step')))
   issues.push(id+' must use creative-storytelling criteria, not recycled civic source rubric');
 }
 if(!U53_B2_NARRATIVE[0]?.reading.french.includes('Inès')||
    !U53_B2_NARRATIVE[0].reading.french.includes('plus-que-parfait')||
    !U53_B2_NARRATIVE[1]?.reading.french.includes('antiphrase')||
    !U53_B2_NARRATIVE[1].reading.french.includes('Farah'))
  issues.push('164–165 narrative technique, distinct fictional people or irony missing');
 for(const [i,story] of U54_B2_MEDIATION.entries()){
  const n=166+i,id='transfer-'+n,unit=story.unit;
  if(unit.id!==id||unit.order!==n+94||unit.prerequisites.join()!=='transfer-'+(n-1))
   issues.push(id+' non-sequential source-owned lesson identity');
  if(unit.source.source!=='original'||unit.source.rights!=='original-owned'||
     unit.source.sourceRevision!==SOURCES.original.revision||
     !unit.source.qualifiedId.endsWith(':session:u54-'+id))
   issues.push(id+' invalid original rights or provenance');
  if(unit.grammar!==U54_B2_GRAMMAR[id]||unit.grammar.length!==2||
     unit.grammar.some(g=>g.explanation.length<580||g.examples.length!==2||
      !g.correction[0]||!g.correction[1]||g.correction[2].length<130))
   issues.push(id+' insufficient instructional grammar and repair teaching');
  if(unit.vocabulary.length!==12||unit.dialogue.length!==9||unit.tasks.length!==10||
     new Set(unit.tasks.map(t=>t.id)).size!==10)
   issues.push(id+' incomplete vocab, dialogue or active recall');
  for(const type of ['fill','order','reading','choice'] as const)
   if(!unit.tasks.some(t=>t.type===type))issues.push(id+' missing '+type+' task');
  for(const task of unit.tasks){
   if(!task.answer.trim()||task.explanation.length<60)issues.push(task.id+' missing authored instruction feedback');
   if((task.type==='reading'||task.type==='choice')&&
      (task.options.length!==3||new Set(task.options).size!==3||!task.options.includes(task.answer)))
    issues.push(task.id+' response not supported by authored situation');
   if(task.type==='order'){
    const normalize=(text:string)=>text.trim().split(/\s+/).sort().join('|');
    if(normalize(task.answer)!==normalize(task.options.join(' '))||
       task.answer===task.options.join(' '))issues.push(task.id+' word order not reconstructible');
   }
  }
  if(story.reading.french.trim().split(/\s+/).length<375||
     story.reading.french.split('\n\n').length!==3||story.reading.questions.length!==3)
   issues.push(id+' missing substantive original French instruction narrative');
  if(story.evidence.length!==2||story.evidence.some(e=>e.french.length<350)||
     story.crossQuestions.length!==2||story.listening.length!==6)
   issues.push(id+' incomplete fictional task handouts and text-led listening');
  for(const writing of [story.writingChoices.fromListening,story.writingChoices.fromSources,story.writingChoices.fromDebate])
   if(writing.criteria.length!==3||writing.model.length<950||writing.prompt.length<160)
    issues.push(id+' insufficient authored independent procedural production');
  if(story.oral.plan.length!==3||story.oral.model.length<850||story.oral.prompt.length<170)
   issues.push(id+' missing sustained original oral explanation or teach-back');
  if(story.writingChoices.fromSources.criteria.some(c=>c.includes('Attribute each document separately'))||
     story.oral.plan.some(c=>c.includes('Recommend a conditional practical next step')))
   issues.push(id+' incorrectly recycles source comparison instead of procedural mediation');
 }
 if(!U54_B2_MEDIATION[0]?.reading.french.includes('Salomé')||
    !U54_B2_MEDIATION[0].reading.french.includes('trois tours')||
    !U54_B2_MEDIATION[1]?.reading.french.includes('Éloi')||
    !U54_B2_MEDIATION[1].reading.french.includes('losange')||
    U54_B2_MEDIATION[0].unit.dialogue[0].speaker===U54_B2_MEDIATION[1].unit.dialogue[0].speaker)
  issues.push('166–167 independently authored real instructional teach-back missing');
 return issues;
}
export async function loadU42OriginalFrenchCourse():Promise<readonly A1Unit[]>{
 const issues=validateU42Course();
 if(issues.length)throw Error('B2 original course invalid: '+issues.join('; '));
 return ORIGINAL_FRENCH_U42_COURSE;
}
