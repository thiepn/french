import type { CanonicalSrsRecordV1 } from './model';

export type StudySessionMode='today'|'review'|'learn'|'custom';
export type StudyMix='due-first'|'new-first'|'interleave';

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
    bestCombo:0,combo:0,finalized:false
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
    stats:(value.stats&&typeof value.stats==='object'?value.stats:newSessionStats(saved)) as StudySessionStatsV1,
    undo:Array.isArray(value.undo)?value.undo.slice(-20) as StudyUndoEntryV1[]:[]
  };
}

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
