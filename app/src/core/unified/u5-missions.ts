import {ORIGINAL_PATH_LESSONS} from './u3-pathways.ts';
import {ORIGINAL_JOURNEYS} from './u4-journeys.ts';
import {provenance,SOURCES,type QualifiedProvenance} from './source.ts';

export type MissionMode='reading'|'speaking-rehearsal'|'writing'|'transfer';
export interface MissionStep{
 readonly id:string;readonly mode:MissionMode;readonly lessonId:string;
 readonly title:string;readonly prompt:string;readonly reference:string;
 readonly expected:string|null;readonly options:readonly string[];
 readonly hints:readonly string[];readonly criteria:readonly string[];
 readonly source:QualifiedProvenance;readonly grammarId:string;
}
export interface IntegratedMission{
 readonly id:string;readonly journeyId:string;readonly title:string;
 readonly context:string;readonly sourceRevision:string;readonly steps:readonly MissionStep[];
}
type StepInput={
 mode:MissionMode;lesson:string;title:string;prompt:string;reference?:string;
 answer?:string;options?:string[];hints?:string[];criteria?:string[];
};
function buildMission(id:string,journeyId:string,title:string,context:string,items:readonly StepInput[]):IntegratedMission{
 const steps=items.map((item,i)=>{
  const lesson=ORIGINAL_PATH_LESSONS.find(x=>x.id===item.lesson);
  if(!lesson)throw Error('Unknown original lesson '+item.lesson);
  return Object.freeze({
   id:id+'-'+String(i+1),mode:item.mode,lessonId:item.lesson,title:item.title,prompt:item.prompt,
   reference:item.reference??'',expected:item.answer??null,
   options:Object.freeze([...(item.options??[])]),
   hints:Object.freeze([...(item.hints??[])]),
   criteria:Object.freeze([...(item.criteria??[])]),
   source:provenance('original','exercise','u5-'+id+'-'+String(i+1)),
   grammarId:lesson.grammarIds[0]??''
  });
 });
 return Object.freeze({id,journeyId,title,context,sourceRevision:SOURCES.original.revision,steps:Object.freeze(steps)});
}
/** All task prose is original. Reading excerpts come only from our own U2/U3 authored dialogues. */
export const INTEGRATED_MISSIONS:readonly IntegratedMission[]=Object.freeze([
 buildMission('introduce-and-order','first-conversations','Meet, order, respond','You meet a classmate and go to a café.',[
  {mode:'reading',lesson:'cafe',title:'Read an order',prompt:'What drink does the customer request?',reference:'Bonjour, je voudrais un thé.',
   answer:'un thé',options:['un thé','un café','du jus'],hints:['Find the phrase je voudrais.','Read the noun after un.']},
  {mode:'speaking-rehearsal',lesson:'greetings',title:'Introduce yourself aloud',prompt:'Introduce yourself to a classmate and ask their name.',
   criteria:['Say your name in French.','Use an appropriate greeting.','Ask one simple follow-up question.']},
  {mode:'writing',lesson:'preferences',title:'Write a food choice',prompt:'Write two sentences: one food you like and one you do not like.',
   criteria:['Express a preference.','Express a negative preference using ne … pas.','Check articles and punctuation.']},
  {mode:'transfer',lesson:'market',title:'Order several items',prompt:'Je voudrais ___ pommes.',answer:'trois',
   hints:['Think about quantities.','The original market dialogue requests three apples.']}
 ]),
 buildMission('travel-and-change','travel-day','Travel plans under pressure','A train is delayed and you must adjust your journey.',[
  {mode:'reading',lesson:'travel',title:'Read a ticket request',prompt:'Which kind of ticket does the traveler choose?',reference:'Aller simple. C’est combien ?',
   answer:'aller simple',options:['aller simple','aller-retour','un abonnement'],hints:['Find the reply after the ticket clerk asks.']},
  {mode:'speaking-rehearsal',lesson:'directions',title:'Ask for a station',prompt:'Politely ask where the station is and whether it is far.',
   criteria:['Begin politely.','Ask a complete question about the station.','Use a question structure such as est-ce que.']},
  {mode:'writing',lesson:'late-train',title:'Explain the delay',prompt:'Write about a completed delay and then give your next travel plan.',
   criteria:['Describe a completed past event.','Add a near-future plan.','Check both verb constructions.']},
  {mode:'transfer',lesson:'yesterday',title:'Retell a completed event',prompt:'Nous ___ étudié hier.',answer:'avons',
   hints:['This is passé composé.','Conjugate avoir for nous.']}
 ]),
 buildMission('past-and-present','tell-your-story','Tell a personal story','Tell a friend how life has changed.',[
  {mode:'reading',lesson:'memory',title:'Read a childhood memory',prompt:'Which verb expresses what the speaker used to do at the park?',reference:'Quand j’étais enfant, je jouais au parc.',
   answer:'jouais',options:['jouais','vais','ai joué'],hints:['Look at the imparfait verb after je.']},
  {mode:'speaking-rehearsal',lesson:'childhood-town',title:'Describe your old routine',prompt:'Say aloud what you used to do and what you do now.',
   criteria:['Describe one old habit.','State a contrast with maintenant.','Check the imparfait ending in the old habit.']},
  {mode:'writing',lesson:'weekend-recap',title:'Write a weekend story',prompt:'Write one completed weekend activity and one plan for next week.',
   criteria:['Use a completed past form.','Use a separate future intention.','Identify the different times clearly.']},
  {mode:'transfer',lesson:'yesterday',title:'Remember an auxiliary',prompt:'Nous ___ étudié hier.',answer:'avons',
   hints:['The past participle is already given.','Use avoir for nous.']}
 ]),
 buildMission('appointments-and-invitations','practical-appointments','Manage appointments','Arrange a time, discuss a problem, and invite someone.',[
  {mode:'reading',lesson:'appointment',title:'Read a reschedule request',prompt:'Which day is proposed instead of Tuesday?',reference:'Vous êtes libre mercredi ?',
   answer:'mercredi',options:['mercredi','mardi','vendredi'],hints:['Look after the adjective libre.']},
  {mode:'speaking-rehearsal',lesson:'invitation',title:'Decline politely',prompt:'Politely decline a Friday invitation and suggest Saturday.',
   criteria:['Decline politely.','Use negation appropriately.','Suggest an alternative day.']},
  {mode:'writing',lesson:'health',title:'Explain a symptom',prompt:'Write a short message giving a symptom and a day you can attend an appointment.',
   criteria:['Describe one symptom.','Name a possible day.','Check sentence clarity and politeness.']},
  {mode:'transfer',lesson:'preferences',title:'Check negation',prompt:'Je ne mange ___ de viande.',answer:'pas',
   hints:['The negative contains two parts.','Put the second part after the verb.']}
 ])
]);
export function missionForJourney(journeyId:string):IntegratedMission|null{
 return INTEGRATED_MISSIONS.find(m=>m.journeyId===journeyId)??null;
}
export function missionForId(id:string):IntegratedMission|null{
 return INTEGRATED_MISSIONS.find(m=>m.id===id)??null;
}
export function validateIntegratedMissions():readonly string[]{
 const issues:string[]=[];
 const ids=new Set<string>();
 for(const mission of INTEGRATED_MISSIONS){
  if(ids.has(mission.id))issues.push('duplicate mission '+mission.id);ids.add(mission.id);
  const journey=ORIGINAL_JOURNEYS.find(j=>j.id===mission.journeyId);
  if(!journey)issues.push('unknown journey '+mission.journeyId);
  if(mission.sourceRevision!==SOURCES.original.revision||mission.steps.length!==4)issues.push('invalid mission '+mission.id);
  const modes=mission.steps.map(s=>s.mode);
  if(new Set(modes).size!==4)issues.push('duplicate or missing mode '+mission.id);
  mission.steps.forEach(step=>{
   if(step.source.source!=='original'||step.source.rights!=='original-owned')issues.push('rights '+step.id);
   const lesson=ORIGINAL_PATH_LESSONS.find(l=>l.id===step.lessonId);
   if(!lesson||!journey?.lessonIds.includes(step.lessonId))issues.push('source-journey mismatch '+step.id);
   if((step.mode==='reading'||step.mode==='transfer')&&!step.expected)issues.push('missing answer '+step.id);
   if(step.mode==='reading'&&(!step.options.includes(step.expected??'')||!lesson?.dialogue.some(d=>d.fr===step.reference)))issues.push('invalid reading evidence '+step.id);
   if((step.mode==='writing'||step.mode==='speaking-rehearsal')&&step.criteria.length<3)issues.push('missing criteria '+step.id);
  });
 }
 return issues;
}
