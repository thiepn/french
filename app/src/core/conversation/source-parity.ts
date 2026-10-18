/** B6 source inventory transcribed from pinned P35 5.24.0:
 * index.html V580_SCENARIOS, V590_MISSIONS and V5110_FUNCTION_META.
 * Identifiers document original identity only; matching a title never
 * grants a P35 semantic-equivalence or CEFR evidence award.
 */
import {CONVERSATION_STARTERS} from './scenarios.ts';
import {MISSION_CHAINS} from './missions.ts';
export const P35_P17_SCENARIOS=[
  'cafe-order','bakery-buy','ask-directions','meet-classmate','opening-hours',
  'train-ticket','hotel-problem','restaurant-fix','weekend-plan','return-item',
  'travel-delay','apartment-repair','recommend-disagree','past-event',
  'work-policy-debate','civic-transport-debate','project-crisis','media-claim','team-conflict'
] as const;
export const P35_SCENE_ALIASES:Readonly<Record<string,string>>={
 cafe:'cafe-order',bakery:'bakery-buy',directions:'ask-directions',
 classmate:'meet-classmate','opening-hours':'opening-hours',rail:'train-ticket',
 hotel:'hotel-problem',restaurant:'restaurant-fix',weekend:'weekend-plan',
 return:'return-item',delay:'travel-delay',repair:'apartment-repair',
 disagreement:'recommend-disagree','past-problem':'past-event'
};
// The P35 25 foundational P20 functions, not the 6 additional B2 functions.
// Native B3's separate 23-function map must NOT be translated into these
// identifiers as verified mastery without source-turn scoring parity.
export const P35_P20_FUNCTIONS=[
 {id:'request',label:'Request',group:'Foundation'},
 {id:'specify',label:'Specify',group:'Foundation'},
 {id:'quantity',label:'Give quantity',group:'Foundation'},
 {id:'ask-information',label:'Ask for information',group:'Foundation'},
 {id:'give-information',label:'Give information',group:'Foundation'},
 {id:'introduce',label:'Introduce yourself',group:'Foundation'},
 {id:'confirm',label:'Confirm',group:'Foundation'},
 {id:'close',label:'Close politely',group:'Foundation'},
 {id:'clarify',label:'Clarify / repair',group:'Interaction'},
 {id:'accept',label:'Accept',group:'Interaction'},
 {id:'correct',label:'Correct',group:'Interaction'},
 {id:'disagree',label:'Disagree politely',group:'Interaction'},
 {id:'agree',label:'Reach agreement',group:'Interaction'},
 {id:'explain',label:'Explain',group:'Problem solving'},
 {id:'give-reason',label:'Give a reason',group:'Problem solving'},
 {id:'describe',label:'Describe',group:'Problem solving'},
 {id:'suggest',label:'Suggest',group:'Planning & opinion'},
 {id:'preference',label:'State preference',group:'Planning & opinion'},
 {id:'alternative',label:'Offer alternative',group:'Planning & opinion'},
 {id:'negotiate',label:'Negotiate',group:'Planning & opinion'},
 {id:'recommend',label:'Recommend',group:'Planning & opinion'},
 {id:'compare',label:'Compare',group:'Planning & opinion'},
 {id:'justify',label:'Justify',group:'Planning & opinion'},
 {id:'narrate',label:'Narrate past events',group:'Narrative'},
 {id:'sequence',label:'Sequence events',group:'Narrative'}
] as const;
export const P35_P17_GOALS:Readonly<Record<string,{level:'A1'|'A2'|'B1';goal:string}>>={
 'cafe-order':{level:'A1',goal:'Order a drink, specify a preference, and close politely.'},
 'bakery-buy':{level:'A1',goal:'Ask for an item, give a quantity, and close the purchase.'},
 'ask-directions':{level:'A1',goal:'Ask where a place is, request one clarification, and confirm understanding.'},
 'meet-classmate':{level:'A1',goal:'Introduce yourself with fictional details, exchange one fact, and close naturally.'},
 'opening-hours':{level:'A1',goal:'Ask when a place opens, confirm the information, and close politely.'},
 'train-ticket':{level:'A2',goal:'Request a ticket, specify trip details, ask the price, and confirm.'},
 'hotel-problem':{level:'A2',goal:'Explain a room problem, clarify it, request a solution, and accept or reject an option.'},
 'restaurant-fix':{level:'A2',goal:'Point out a mistake, clarify the intended order, request a correction, and close politely.'},
 'weekend-plan':{level:'A2',goal:'Suggest an activity, negotiate time, disagree or offer an alternative, and confirm the plan.'},
 'return-item':{level:'A2',goal:'Explain a return, give a reason, request refund or exchange, and confirm the solution.'},
 'travel-delay':{level:'B1',goal:'Explain the delay problem, ask about options, compare alternatives, choose one, and justify your choice.'},
 'apartment-repair':{level:'B1',goal:'Describe a household problem, explain urgency, negotiate an appointment, clarify access, and confirm.'},
 'recommend-disagree':{level:'B1',goal:'Make a recommendation, respond to disagreement, propose an alternative, justify it, and reach agreement.'},
 'past-event':{level:'B1',goal:'Narrate a past problem in sequence, give relevant detail, explain the consequence, request action, and confirm.'}
};
export function originalScenarioGoal(nativeId:string):{id:string;level:'A1'|'A2'|'B1';goal:string}|null{
 const id=legacySceneId(nativeId);
 return id&&P35_P17_GOALS[id]?{id,...P35_P17_GOALS[id]}:null;
}
export const P35_LATER_B2_FUNCTIONS=[
 'evaluate','qualify','hypothesize','persuade','mediate','synthesize'
] as const;
export interface LegacyMission{
 id:string;title:string;scenarios:readonly [string,string,string];
}
export const P35_P18_MISSIONS:readonly LegacyMission[]=[
 {id:'daily-errands',title:'Morning in town',scenarios:['bakery-buy','cafe-order','opening-hours']},
 {id:'arrival-day',title:'Arrival day',scenarios:['train-ticket','ask-directions','hotel-problem']},
 {id:'social-day',title:'Meet, plan, decide',scenarios:['meet-classmate','weekend-plan','recommend-disagree']},
 {id:'customer-problems',title:'Solve everyday problems',scenarios:['restaurant-fix','return-item','past-event']},
 {id:'independent-living',title:'Independent living circuit',scenarios:['travel-delay','apartment-repair','past-event']}
];
export const P35_MISSION_ALIASES:Readonly<Record<string,string>>={
 'morning-town':'daily-errands','arrival-day':'arrival-day',
 'meet-plan-decide':'social-day','solve-problems':'customer-problems',
 'independent-living':'independent-living'
};
export function legacySceneId(nativeId:string):string|null{return P35_SCENE_ALIASES[nativeId]??null;}
export function legacyMissionId(nativeId:string):string|null{return P35_MISSION_ALIASES[nativeId]??null;}
export function inspectP35ConversationCoverage(){
 const aliases=CONVERSATION_STARTERS.map(s=>({nativeId:s.id,p35Id:legacySceneId(s.id)}));
 const mapped=new Set(aliases.map(s=>s.p35Id).filter((s):s is string=>Boolean(s)));
 return{
  sourceScenarioCount:P35_P17_SCENARIOS.length,
  sourceMissionCount:P35_P18_MISSIONS.length,
  originalP20Functions:P35_P20_FUNCTIONS.length,
  laterB2Functions:P35_LATER_B2_FUNCTIONS.length,
  mappedSourceScenes:mapped.size,
  unmappedNativeScenes:aliases.filter(s=>!s.p35Id).map(s=>s.nativeId),
  missingOriginalScenes:P35_P17_SCENARIOS.filter(s=>!mapped.has(s)),
  originalFunctionScoringCertified:false,
  sourceDialogueGraphEquivalent:false,
  independentOralAssessmentCertified:false
 };
}
export function auditSourceLinkedMissions():string[]{
 const errors:string[]=[];
 const original=new Map(P35_P18_MISSIONS.map(m=>[m.id,m]));
 for(const mission of MISSION_CHAINS){
  const id=legacyMissionId(mission.id),source=id&&original.get(id);
  if(!source){errors.push('Unknown source mission '+mission.id);continue;}
  for(let i=0;i<3;i++){
   const mapped=legacySceneId(mission.scenarioIds[i]);
   if(mapped!==source.scenarios[i])
    errors.push('P35 mission divergence '+mission.id+' stage '+(i+1)+
      ': '+String(mapped)+' vs '+source.scenarios[i]);
  }
 }
 const mapped=P35_P20_FUNCTIONS.map(fn=>fn.id);
 if(new Set(mapped).size!==25)errors.push('Original P20 taxonomy must contain 25 unique functions');
 return errors;
}
