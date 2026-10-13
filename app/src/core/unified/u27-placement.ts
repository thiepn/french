import {
 getOriginalCatalogEntry,getOriginalMaterial,neighboringOriginalLessons,
 type OriginalLevel,type OriginalSurface
} from './u23-registry.ts';
import {ORIGINAL_PATHWAYS,ORIGINAL_LEVEL_ORDER} from './u25-pathways.ts';
import {originalU26GrammarById,type U26IndependentPrompt} from './u26-grammar-content.ts';
import {checkPracticeAnswer} from './u2-grammar.ts';

/**
 * U27 diagnostic assembly is a read-only view over actual original authored
 * U23 material and U26 keyed prompts. It creates neither questions nor grades.
 */
export type PlacementGoal='grammar'|'reading'|'listening'|'writing'|'balanced';
export type PlacementBackground='new'|'reviewing'|'unsure';
export type PlacementQuestion=Readonly<{
 id:string;
 level:OriginalLevel;
 anchorId:string;
 qualifiedSourceId:string;
 origin:'grammar'|'connected-reading'|'dialogue';
 title:string;
 prompt:string;
 sourceText:string;
 sourceTitle:string;
 answer:string;
 options:readonly string[];
 explanation:string;
 hint:string;
 misconceptions:readonly {readonly response:string;readonly why:string}[];
}>;
export type PlacementResponse=Readonly<{
 value:string;
 confidence:'not-sure'|'somewhat'|'confident';
 status:'answered'|'skipped';
}>;
export type PlacementSummary=Readonly<{
 total:number;
 answered:number;
 skipped:number;
 matched:number;
 unmatched:number;
 uncertain:number;
 interpretation:string;
}>;
export type PlacementEntry=Readonly<{
 id:string;
 title:string;
 level:OriginalLevel;
 reason:string;
 qualifiedId:string;
 kind:'anchor'|'foundation'|'next'|'goal';
}>;

const ANCHORS:Readonly<Record<OriginalLevel,{
 grammar:readonly [string,string];
 source:readonly [string,string];
}>>={
 A1:{grammar:['etre-present','articles-gender'],source:['a1-01','a1-03']},
 A2:{grammar:['past-avoir','background-event'],source:['a2-01','a2-06']},
 B1:{grammar:['cause-result','si-conditions'],source:['b1-01','b1-04']},
 'B1+':{grammar:['mediation-politeness','archival-past-attribution'],source:['transfer-31','transfer-76']},
 'Early B2':{grammar:['survey-conditional','forecast-concession'],source:['transfer-149','transfer-150']}
};
function grammarQuestion(level:OriginalLevel,focusId:string,index:number):PlacementQuestion|null{
 const focus=originalU26GrammarById(focusId);
 const task=focus?.tasks[index];if(!focus||!task||focus.level!==level)return null;
 const anchor=getOriginalCatalogEntry(focus.anchorId);
 if(!anchor)return null;
 return Object.freeze({
  id:'u27:'+level+':grammar:'+focusId+':'+index,level,
  anchorId:focus.anchorId,qualifiedSourceId:anchor.qualifiedId,
  origin:'grammar',title:focus.title,
  prompt:task.question,sourceText:task.cue,sourceTitle:focus.context,
  answer:task.answer,options:[],explanation:task.explanation,
  hint:task.hint,misconceptions:task.misconceptions
 });
}
function comprehensionQuestion(level:OriginalLevel,id:string):PlacementQuestion|null{
 const material=getOriginalMaterial(id),entry=getOriginalCatalogEntry(id);
 if(!material||!entry||entry.level!==level)return null;
 const reading=material.reading;
 const question=reading?.questions.find(q=>q.prompt&&q.answer&&q.options.includes(q.answer));
 if(reading&&question)return Object.freeze({
  id:'u27:'+level+':reading:'+id+':'+question.prompt,level,
  anchorId:id,qualifiedSourceId:entry.qualifiedId,
  origin:'connected-reading',title:entry.title,prompt:question.prompt,
  sourceText:reading.french,sourceTitle:reading.title,
  answer:question.answer,options:question.options,
  explanation:question.explanation,hint:'Look for the stated evidence in the original connected text.',
  misconceptions:[]
 });
 const task=material.unit.tasks.find(q=>q.type==='reading'&&q.answer&&q.options.length>=3&&
  q.options.includes(q.answer));
 if(!task||!material.unit.dialogue.length)return null;
 return Object.freeze({
  id:'u27:'+level+':dialogue:'+id+':'+task.id,level,
  anchorId:id,qualifiedSourceId:entry.qualifiedId,
  origin:'dialogue',title:entry.title,prompt:task.prompt,
  sourceText:material.unit.dialogue.map(line=>line.speaker+': '+line.fr).join('\n'),
  sourceTitle:'Original learner dialogue from '+entry.title,
  answer:task.answer,options:task.options,explanation:task.explanation,
  hint:'Read the full speaker turns before choosing; this is not a translated transcript.',
  misconceptions:[]
 });
}
const QUESTION_SETS:Readonly<Record<OriginalLevel,readonly PlacementQuestion[]>>=
 Object.freeze(Object.fromEntries(ORIGINAL_LEVEL_ORDER.map(level=>{
  const a=ANCHORS[level];
  const questions=[
   grammarQuestion(level,a.grammar[0],0),grammarQuestion(level,a.grammar[0],1),
   grammarQuestion(level,a.grammar[1],0),grammarQuestion(level,a.grammar[1],1),
   ...a.source.map(id=>comprehensionQuestion(level,id))
  ].filter((q):q is PlacementQuestion=>q!==null);
  return [level,Object.freeze(questions)];
 })) as Record<OriginalLevel,readonly PlacementQuestion[]>);
export function originalPlacementQuestions(level:OriginalLevel):readonly PlacementQuestion[]{
 return QUESTION_SETS[level];
}
export function checkOriginalPlacementKey(value:string,question:PlacementQuestion):boolean{
 return checkPracticeAnswer(value,question.answer);
}
export function originalPlacementFeedback(question:PlacementQuestion,value:string):string{
 if(checkOriginalPlacementKey(value,question))return 'Matches the original authored key. '+question.explanation;
 const error=question.misconceptions.find(item=>checkPracticeAnswer(value,item.response));
 if(error)return 'A common confusion in this exact task: '+error.why+' '+question.explanation;
 return 'This answer does not match the single authored key. '+question.hint+
  ' Other acceptable French wording is not automatically evaluated.';
}
/** Interpretation is descriptive only, never a CEFR grade or placement verdict. */
export function summarizeOriginalPlacement(questions:readonly PlacementQuestion[],
 responses:ReadonlyMap<string,PlacementResponse>):PlacementSummary{
 let answered=0,matched=0,skipped=0,uncertain=0;
 for(const q of questions){
  const response=responses.get(q.id);
  if(!response||response.status==='skipped'){skipped++;continue;}
  answered++;
  if(checkOriginalPlacementKey(response.value,q))matched++;
  if(response.confidence==='not-sure')uncertain++;
 }
 return {
  total:questions.length,answered,skipped,matched,unmatched:answered-matched,uncertain,
  interpretation:answered===0?
   'No answers were submitted. Choose an entry based on your stated goal, or return to an earlier lesson.':
   'You matched '+matched+' of '+answered+' authored keys; '+skipped+
   ' questions were skipped. This short, nonstandardized self-check is not a placement exam, verified CEFR result or mastery record.'
 };
}
export function originalPlacementPrerequisites(id:string,max=3):readonly PlacementEntry[]{
 const result:PlacementEntry[]=[];let current=getOriginalCatalogEntry(id);
 const visited=new Set<string>([id]);
 while(current&&result.length<max){
  const previous=current.prerequisites.find(candidate=>!!getOriginalCatalogEntry(candidate)&&!visited.has(candidate));
  if(!previous)break;
  visited.add(previous);
  const item=getOriginalCatalogEntry(previous);if(!item)break;
  result.unshift({
   id:item.id,title:item.title,level:item.level,qualifiedId:item.qualifiedId,
   reason:'Original author-listed earlier foundation, suggested rather than required.',
   kind:'foundation'
  });
  current=item;
 }
 return result;
}
export function originalPlacementEntries(
 level:OriginalLevel,goal:PlacementGoal,questions:readonly PlacementQuestion[],
 responses:ReadonlyMap<string,PlacementResponse>
):readonly PlacementEntry[]{
 const sources=questions.filter(q=>{
  const reply=responses.get(q.id);
  return !reply||reply.status==='skipped'||!checkOriginalPlacementKey(reply.value,q)||reply.confidence==='not-sure';
 });
 const candidates:PlacementEntry[]=[];
 const add=(id:string,reason:string,kind:PlacementEntry['kind'])=>{
  const item=getOriginalCatalogEntry(id);
  if(!item||candidates.some(e=>e.id===id))return;
  candidates.push({id:item.id,title:item.title,qualifiedId:item.qualifiedId,
   level:item.level,reason,kind});
 };
 const weak=sources[0];
 if(weak){
  add(weak.anchorId,'Review the original source of an unanswered, uncertain or nonmatching practice response.', 'anchor');
  for(const p of originalPlacementPrerequisites(weak.anchorId,2))add(p.id,p.reason,'foundation');
 }
 const path=ORIGINAL_PATHWAYS.find(x=>x.level===level);
 if(path?.firstId)add(path.firstId,'Begin the first original unit in your chosen authored level. No test is required.','anchor');
 const surface:OriginalSurface|null=goal==='reading'?'read':goal==='listening'?'listen':goal==='writing'?'write':null;
 if(surface){
  const entry=path?.sections.flatMap(section=>section.entries).find(
   x=>surface==='read'?x.reading:surface==='listen'?x.listening:x.writing
  );
  if(entry)add(entry.id,'Original '+goal+' material is available here; choose this route only if it fits your goal.','goal');
 }
 const best=weak?.anchorId??path?.firstId;
 if(best){
  const next=neighboringOriginalLessons(best).next;
  if(next)add(next.id,'Optional next original lesson after reviewing the current source.','next');
 }
 return candidates.slice(0,6);
}
export function originalPlacementLevels():readonly OriginalLevel[]{return ORIGINAL_LEVEL_ORDER;}
