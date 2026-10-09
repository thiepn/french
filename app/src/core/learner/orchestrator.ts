/** P37I-D1: Cross-skill learning orchestration.
 * All recommendations are read-only, evidence-bounded and transparent.
 * Practice-only events may recommend practice, but NEVER certify CEFR level
 * or update FSRS. Manual/supported outcomes cannot become objective success.
 */
import type {CanonicalReviewEventV1,CanonicalSrsRecordV1} from '../learner/model';
import type {ConversationState} from '../conversation/engine';
import {functionProfiles} from '../conversation/curriculum.ts';
import type {UsageState} from '../usage/session';
import {usageRecordMastery} from '../usage/mastery.ts';
import type {WritingState} from '../writing/session';
import type {UsagePack,SentenceExercisePack} from '../content/loader';
import {sentenceSourceMap} from '../writing/bridge.ts';

const DAY=86_400_000;
export const D1_WINDOW_DAYS=30;
export type Lane='review'|'read'|'listen'|'speak'|'write'|'context'|'conversation';
export type LearningRoute='review'|'read'|'listen'|'speak'|'write'|'conversation';
export interface LaneEvidence{
  lane:Lane;attempts:number;independent:number;activeDays:number;lastAt:number;
  state:'unobserved'|'practice-only'|'needs-repair'|'observed'|'stale';
}
export interface RemediationAction{
  id:string;lane:Lane;route:LearningRoute;title:string;detail:string;score:number;
  evidence:string;
}
export interface LearningPlan{
  schema:'thiepn-french-p37i-d1-plan';
  windowDays:number;lanes:LaneEvidence[];actions:RemediationAction[];
  cefr:{target:string;verdict:'not-assessed';missing:string[];note:string};
  limitation:string;
}
export interface LearningInputs{
  events:readonly CanonicalReviewEventV1[];
  srs:readonly CanonicalSrsRecordV1[];
  conversations:Pick<ConversationState,'functionEvents'|'active'>;
  usage:UsageState;writing:WritingState;
  usagePack:Pick<UsagePack,'records'>;
  sentences:Pick<SentenceExercisePack,'exercises'>;
  readingCompletions:number;
  targetLevel?:string;now?:number;
}
function validTime(value:number,now:number):boolean{
  return Number.isFinite(value)&&value>0&&value<=now+DAY;
}
function independent(event:CanonicalReviewEventV1):boolean{
  return event.correct===true&&event.supportLevel===0&&
    event.manualJudgment!=='self-assessed'&&event.manualJudgment!=='manual'&&
    event.typedQuality!=='manual-self-assessed'&&
    !event.transcriptUsed&&!event.translationUsed;
}
function laneFor(event:CanonicalReviewEventV1):Lane|null{
  const p=event.practice;
  if(!event.practiceOnly)return 'review';
  if(/^contextual-listening/.test(p))return 'listen';
  if(/^spoken-/.test(p))return 'speak';
  if(/^written-/.test(p))return 'write';
  if(/^verified-usage-context/.test(p))return 'context';
  if(/^reading-/.test(p))return 'read';
  return null;
}
function measured(rows:CanonicalReviewEventV1[],lane:Lane,now:number):LaneEvidence{
  const ordered=rows.filter(e=>laneFor(e)===lane&&validTime(e.t,now)).sort((a,b)=>a.t-b.t);
  const independentRows=ordered.filter(independent);
  const activeDays=new Set(ordered.map(e=>new Date(e.t).toISOString().slice(0,10))).size;
  const lastAt=ordered.at(-1)?.t??0;
  const stale=lastAt>0&&now-lastAt>14*DAY;
  const recentPoor=ordered.slice(-5).filter(e=>!independent(e)).length;
  const state:LaneEvidence['state']=!ordered.length?'unobserved':
    stale?'stale':independentRows.length===0?'practice-only':
    ordered.length>=3&&recentPoor>=3?'needs-repair':'observed';
  return{lane,attempts:ordered.length,independent:independentRows.length,activeDays,lastAt,state};
}
export function planFrenchPractice(input:LearningInputs):LearningPlan{
  const now=input.now??Date.now(),start=now-D1_WINDOW_DAYS*DAY;
  const recent=input.events.filter(e=>validTime(e.t,now)&&e.t>=start);
  const lanes:LaneEvidence[]=(['review','read','listen','speak','write','context'] as Lane[])
    .map(lane=>measured(recent,lane,now));
  const validFunctionEvents=input.conversations.functionEvents.filter(e=>validTime(e.at,now));
  const profiles=functionProfiles(validFunctionEvents);
  const independentTurns=validFunctionEvents.filter(e=>e.independent&&!e.manual&&e.accepted&&e.support===0).length;
  const functionDays=new Set(validFunctionEvents.map(e=>new Date(e.at).toISOString().slice(0,10))).size;
  const latestFunction=Math.max(0,...validFunctionEvents.map(e=>e.at));
  lanes.push({lane:'conversation',attempts:validFunctionEvents.length,independent:independentTurns,
    activeDays:functionDays,lastAt:latestFunction,
    state:!validFunctionEvents.length?'unobserved':independentTurns===0?'practice-only':
      latestFunction<now-14*DAY?'stale':'observed'});
  const due=input.srs.filter(row=>row.status!=='new'&&!row.suspended&&
    (!row.buriedUntil||row.buriedUntil<=now)&&row.dueAt>0&&row.dueAt<=now).length;
  const productionGaps=input.srs.filter(row=>row.skill==='production'&&!row.suspended&&
    row.seen>0&&(row.lastRating==='again'||row.relearning)).length;
  const usageStates=input.usagePack.records.map(record=>usageRecordMastery(record.id,input.usage,now));
  const repairs=usageStates.filter(e=>e.repairNeeded).length;
  const contextRefresh=usageStates.filter(e=>e.contextual.status==='refresh').length;
  const sourceMap=sentenceSourceMap(input.sentences,input.usagePack);
  const connectedNeedsRepair=input.sentences.exercises.filter(e=>
    sourceMap.has(e.id)&&Boolean(input.writing.evidence[e.id])&&
    !input.writing.evidence[e.id].lastIndependent).length;
  const weakFunctions=profiles.filter(p=>p.attempts>0&&
    !['functional','secure'].includes(p.state)).length;
  const unobservedFunctions=profiles.filter(p=>p.attempts===0).length;
  const actions:RemediationAction[]=[];
  const add=(id:string,lane:Lane,route:LearningRoute,title:string,detail:string,score:number,evidence:string)=>{
    actions.push({id,lane,route,title,detail,score,evidence});
  };
  if(due)add('due','review','review','Complete scheduled review',
    due+' vocabulary skill review'+(due===1?' is':'s are')+' due; contextual tasks will not clear them.',
    700+Math.min(70,due),due+' due SRS records');
  if(input.conversations.active)add('resume-conversation','conversation','conversation','Resume unfinished exchange',
    'Continue the saved conversation without discarding the previous turns.',
    800,'resumable conversation exists');
  if(repairs)add('usage-repair','context','write','Repair constructions',
    'Revisit '+repairs+' unresolved source-frame construction'+(repairs===1?'':'s')+' in Write → Repair.',
    280+Math.min(60,repairs*5),repairs+' recorded source-frame errors');
  if(contextRefresh)add('context-refresh','context','write','Revalidate contextual French',
    contextRefresh+' construction'+(contextRefresh===1?' needs':'s need')+' fresh independent contextual practice after 30 days.',
    265+Math.min(60,contextRefresh*5),contextRefresh+' expired contextual evidence');
  if(connectedNeedsRepair)add('sentence-repair','write','write','Revisit connected sentences',
    'Repeat '+connectedNeedsRepair+' source-linked sentence'+(connectedNeedsRepair===1?'':'s')+' that lack a recent independent exact answer.',
    250+Math.min(60,connectedNeedsRepair*5),connectedNeedsRepair+' source-linked writing gaps');
  if(productionGaps)add('vocab-production','review','review','Strengthen vocabulary production',
    productionGaps+' active production record'+(productionGaps===1?' shows':'s show')+' previous difficulty; use scheduled reviews first.',
    215+Math.min(65,productionGaps*4),productionGaps+' weak production SRS records');
  if(weakFunctions||unobservedFunctions)add('functions','conversation','conversation','Develop communicative functions',
    weakFunctions+' developing and '+unobservedFunctions+' unobserved functions; varied situations are necessary.',
    160+Math.min(50,weakFunctions*3),'native function catalog; no CEFR inference');
  if(input.readingCompletions===0)add('reading','read','read','Read in context',
    'No completed reading text is recorded; start with a graded passage.',156,'zero recorded reading completions');
  for(const lane of lanes.filter(e=>['listen','speak','write','context'].includes(e.lane))){
    if(lane.state==='unobserved'||lane.state==='practice-only'||lane.state==='needs-repair'||lane.state==='stale'){
      const route:LearningRoute=lane.lane==='context'?'write':lane.lane as LearningRoute;
      const name=lane.lane==='context'?'contextual sentences':lane.lane==='listen'?'listening':lane.lane==='speak'?'speaking':'writing';
      add('lane-'+lane.lane,lane.lane,route,'Practise '+name,
        lane.state==='unobserved'?'No recent evidence for this skill. Start a supported exercise.':
          lane.state==='practice-only'?'Previous answers were supported or not independently verified; practise unassisted.':
          lane.state==='stale'?'No fresh evidence in the last two weeks; revisit this skill.':
          'Several recent answers were unsupported, incorrect, or unverified; repair and retry.',
        lane.state==='needs-repair'?195:lane.state==='practice-only'?172:lane.state==='stale'?153:148,
        lane.attempts+' recent attempts, '+lane.independent+' independently correct');
    }
  }
  if(!actions.length)add('maintain','read','read','Maintain varied French practice',
    'Keep practising across reading, listening, production and interaction.',100,'no urgent gap detected');
  actions.sort((a,b)=>b.score-a.score||a.id.localeCompare(b.id));
  const missing:string[]=[];
  if(!input.readingCompletions)missing.push('completed reading tasks');
  for(const lane of lanes.filter(row=>row.lane!=='review')){
    if(lane.activeDays<2||lane.independent<2)
      missing.push(lane.lane+' evidence on multiple independent attempts/days');
  }
  if(profiles.filter(row=>row.state==='functional'||row.state==='secure').length===0)
    missing.push('validated communicative-function breadth');
  const target=['A1','A2','B1','B2','C1','C2'].includes(input.targetLevel??'')?input.targetLevel!:'A1';
  return {schema:'thiepn-french-p37i-d1-plan',windowDays:D1_WINDOW_DAYS,lanes,
    actions:actions.slice(0,8),
    cefr:{target,verdict:'not-assessed',missing,
      note:'Coverage diagnostics are NOT a CEFR readiness score, exam pass prediction or automatic level promotion.'},
    limitation:'Practice-only and deterministic model matches guide remediation; manual answers, hints and missing modalities do not certify language ability.'};
}
