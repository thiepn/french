import type { CanonicalSrsRecordV1 } from './model';

export type StudySessionMode='today'|'review'|'learn'|'custom';
export type StudyMix='due-first'|'new-first'|'interleave';
export type ReinforcementType='context'|'reverse';
export type ReinforcementDirection='fr-en'|'en-fr'|'';

export interface StudyReinforcementV1 {
  index:number;
  type:ReinforcementType;
  direction:ReinforcementDirection;
  practice:'review'|'cloze';
}

export interface StudySessionStatsV1 {
  schema:'thiepn-french-session-stats-v1';
  startedAt:number;
  ratings:{again:number;hard:number;good:number;easy:number};
  skipped:number;
  reviewed:number;
  correct:number;
  newSeen:number;
  totalResponseMs:number;
  missedIds:string[];
  typed:{exact:number;close:number;'missing-article':number;review:number;none:number};
  practice:{review:number;listening:number;choice:number;cloze:number};
  bestCombo:number;
  combo:number;
  adaptiveReinforcements:number;
  adaptivePractice:number;
  finalized:boolean;
}

export interface StudyUndoEntryV1 {
  schema:'thiepn-french-study-undo-v1';
  createdAt:number;
  srsId:string;
  previousRecord:CanonicalSrsRecordV1;
  eventId:string;
  previousStudyDays:string[];
  previousProfile:Record<string,unknown>;
  previousSummary:{currentLevel?:string;dueCount?:number;streakDays?:number};
  previousQueueIds:string[];
  previousReinforcements:StudyReinforcementV1[];
  previousCursor:number;
  previousStats:StudySessionStatsV1;
}

export interface StudySessionStateV1 {
  schema:'thiepn-french-study-session-v1';
  id:'active';
  createdAt:number;
  updatedAt:number;
  expiresAt:number;
  mode:StudySessionMode;
  queueIds:string[];
  seedIds:string[];
  cursor:number;
  currentId:string;
  requeueAgain:boolean;
  mix:StudyMix;
  reinforcements:StudyReinforcementV1[];
  stats:StudySessionStatsV1;
  undo:StudyUndoEntryV1[];
}

export function newSessionStats(now=Date.now()):StudySessionStatsV1{
  return{
    schema:'thiepn-french-session-stats-v1',
    startedAt:now,
    ratings:{again:0,hard:0,good:0,easy:0},
    skipped:0,reviewed:0,correct:0,newSeen:0,totalResponseMs:0,
    missedIds:[],
    typed:{exact:0,close:0,'missing-article':0,review:0,none:0},
    practice:{review:0,listening:0,choice:0,cloze:0},
    bestCombo:0,combo:0,adaptiveReinforcements:0,adaptivePractice:0,finalized:false
  };
}
function normalizeStats(raw:unknown,now:number):StudySessionStatsV1{
  const base=newSessionStats(now);
  if(!raw||typeof raw!=='object'||Array.isArray(raw))return base;
  const value=raw as Partial<StudySessionStatsV1>;
  return{
    ...base,
    ...value,
    schema:'thiepn-french-session-stats-v1',
    ratings:{...base.ratings,...(value.ratings??{})},
    typed:{...base.typed,...(value.typed??{})},
    practice:{...base.practice,...(value.practice??{})},
    missedIds:Array.isArray(value.missedIds)?value.missedIds.filter((id):id is string=>typeof id==='string').slice(0,3000):[]
  };
}

export function createStudySession(
  queueIds:string[],
  options:{
    mode?:StudySessionMode;
    requeueAgain?:boolean;
    mix?:StudyMix;
    now?:number;
  }={}
):StudySessionStateV1{
  const now=options.now??Date.now();
  const queue=[...new Set(queueIds.filter(Boolean))].slice(0,3000);
  return{
    schema:'thiepn-french-study-session-v1',
    id:'active',
    createdAt:now,
    updatedAt:now,
    expiresAt:now+14*86_400_000,
    mode:options.mode??'today',
    queueIds:queue,
    seedIds:[...queue],
    cursor:0,
    currentId:queue[0]??'',
    requeueAgain:options.requeueAgain!==false,
    mix:options.mix??'due-first',
    reinforcements:[],
    stats:newSessionStats(now),
    undo:[]
  };
}

export function normalizeStudySession(raw:unknown,now=Date.now()):StudySessionStateV1|null{
  if(!raw||typeof raw!=='object'||Array.isArray(raw))return null;
  const value=raw as Partial<StudySessionStateV1>;
  if(value.schema!=='thiepn-french-study-session-v1')return null;
  const queueIds=Array.isArray(value.queueIds)?value.queueIds.filter((id):id is string=>typeof id==='string').slice(0,3000):[];
  if(!queueIds.length)return null;
  const saved=Number(value.updatedAt||value.createdAt||0);
  if(!Number.isFinite(saved)||saved<now-14*86_400_000)return null;
  const cursor=Math.min(queueIds.length,Math.max(0,Math.trunc(Number(value.cursor)||0)));
  const reinforcements=Array.isArray(value.reinforcements)
    ?value.reinforcements.filter(item=>
      item&&Number.isInteger(item.index)&&item.index>=0&&item.index<queueIds.length&&
      (item.type==='context'||item.type==='reverse')
    ).slice(0,20).map(item=>({
      index:item.index,
      type:item.type,
      direction:item.direction==='fr-en'||item.direction==='en-fr'?item.direction:'',
      practice:item.practice==='cloze'?'cloze':'review'
    } as StudyReinforcementV1))
    :[];
  return{
    schema:'thiepn-french-study-session-v1',
    id:'active',
    createdAt:Number(value.createdAt)||saved,
    updatedAt:saved,
    expiresAt:Number(value.expiresAt)||saved+14*86_400_000,
    mode:['today','review','learn','custom'].includes(String(value.mode))?value.mode as StudySessionMode:'today',
    queueIds,
    seedIds:Array.isArray(value.seedIds)?value.seedIds.filter((id):id is string=>typeof id==='string').slice(0,3000):[...queueIds],
    cursor,
    currentId:queueIds[cursor]??'',
    requeueAgain:value.requeueAgain!==false,
    mix:['due-first','new-first','interleave'].includes(String(value.mix))?value.mix as StudyMix:'due-first',
    reinforcements,
    stats:normalizeStats(value.stats,saved),
    undo:Array.isArray(value.undo)?value.undo.slice(-20) as StudyUndoEntryV1[]:[]
  };
}

export function reinforcementAt(session:StudySessionStateV1,index=session.cursor):StudyReinforcementV1|null{
  return session.reinforcements.find(item=>item.index===index)??null;
}

export function insertReinforcement(
  session:StudySessionStateV1,
  srsId:string,
  type:ReinforcementType,
  offset:number,
  direction:ReinforcementDirection='',
  practice:'review'|'cloze'='review'
):StudySessionStateV1{
  if(session.reinforcements.some(item=>item.type===type&&item.index>session.cursor&&session.queueIds[item.index]===srsId))return session;
  const queue=[...session.queueIds];
  const target=Math.min(queue.length,session.cursor+Math.max(2,offset));
  queue.splice(target,0,srsId);
  const reinforcements=session.reinforcements.map(item=>item.index>=target?{...item,index:item.index+1}:item);
  reinforcements.push({index:target,type,direction,practice});
  const stats=normalizeStats(session.stats,session.updatedAt);
  stats.adaptiveReinforcements++;
  return{...session,queueIds:queue,reinforcements:reinforcements.sort((a,b)=>a.index-b.index),stats};
}

/* Compatibility helper retained for isolated tests and non-scheduled modes.
   Scheduled review sessions use practice-only reinforcement instead. */
export function applyAgainRequeue(session:StudySessionStateV1,srsId:string):StudySessionStateV1{
  if(!session.requeueAgain)return session;
  if(session.queueIds.slice(session.cursor+1).includes(srsId))return session;
  const queue=[...session.queueIds];
  const target=Math.min(queue.length,session.cursor+7);
  queue.splice(target,0,srsId);
  return{...session,queueIds:queue};
}

export function advanceSession(session:StudySessionStateV1,now=Date.now()):StudySessionStateV1{
  const cursor=Math.min(session.queueIds.length,session.cursor+1);
  return{
    ...session,
    cursor,
    currentId:session.queueIds[cursor]??'',
    updatedAt:now,
    expiresAt:now+14*86_400_000
  };
}
