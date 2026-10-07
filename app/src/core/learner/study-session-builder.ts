import { loadVocabularySearchIndex,type VocabularySearchRow } from '../content/loader';
import {
  countDueSrs,
  ensureCanonicalLearnerState,
  ensureNewRecognitionRecords,
  ensureSkillRecord,
  readCanonicalLearnerState,
  readDueSrs,
  readRecentReviewEvents,
  readReviewEventsSince,
  readSrsByNoteIds,
  readStartedRecognitionNoteIds,
  todayReviewCounts,
  writeActiveStudySession
} from './repository';
import type { CanonicalSrsRecordV1,SkillId } from './model';
import { createStudySession,type StudyMix,type StudySessionStateV1 } from './session';
import { evidenceFromEvents,mixTodayQueue,sortSmartQueue,spaceSiblingFamilies,type QueueCandidate } from './queue';
import { nextAdaptiveSkill,pacingDecision } from './adaptive';

const DAY_MS=86_400_000;
const STAGE_ORDER:SkillId[]=['recognition','article','production','spelling','listening'];

function object(value:unknown):Record<string,unknown>{
  return value&&typeof value==='object'&&!Array.isArray(value)?value as Record<string,unknown>:{};
}
function number(value:unknown,fallback:number):number{
  const n=Number(value);return Number.isFinite(n)?n:fallback;
}
function sessionPreferences(learner:Awaited<ReturnType<typeof readCanonicalLearnerState>>){
  const settings=object(learner?.settings);
  const session=object(settings.session);
  const mix=['due-first','new-first','interleave'].includes(String(session.mix))?String(session.mix) as StudyMix:'due-first';
  return{
    dailyReviewLimit:Math.max(0,Math.min(1000,Math.round(number(settings.dailyReviewLimit,200)))),
    dailyNewLimit:Math.max(0,Math.min(200,Math.round(number(settings.dailyNewLimit,20)))),
    leechThreshold:Math.max(3,Math.min(30,Math.round(number(settings.leechThreshold,8)))),
    siblingSpacing:session.siblingSpacing!==false,
    requeueAgain:session.requeueAgain!==false,
    mix,
    size:Math.max(0,Math.min(3000,Math.round(number(session.size,50)))),
    skillMode:String(session.skillMode||'adaptive')
  };
}

function startOfRecentWindow(now:number,days=14):number{
  const start=new Date(now);start.setHours(0,0,0,0);start.setDate(start.getDate()-(days-1));return start.getTime();
}

async function smartDue(limit:number,now:number):Promise<string[]>{
  if(limit<=0)return[];
  const [due,events,index]=await Promise.all([
    readDueSrs(Math.max(limit*8,240),now),
    readRecentReviewEvents(2000),
    loadVocabularySearchIndex()
  ]);
  const evidence=evidenceFromEvents(events);
  const orderById=new Map(index.rows.map(row=>[row.id,row.order]));
  const candidates:QueueCandidate[]=due.map(record=>({
    record,
    order:orderById.get(record.noteId)??Number.MAX_SAFE_INTEGER,
    familyKey:record.noteId,
    evidence:evidence.get(record.id)
  }));
  const learner=await ensureCanonicalLearnerState();
  const prefs=sessionPreferences(learner);
  return sortSmartQueue(candidates,{now,leechThreshold:prefs.leechThreshold,siblingSpacing:prefs.siblingSpacing})
    .slice(0,limit)
    .map(item=>item.record.id);
}

async function freshRecords(limit:number,indexRows?:VocabularySearchRow[]){
  if(limit<=0)return[];
  const [index,started]=await Promise.all([
    indexRows?Promise.resolve({rows:indexRows}):loadVocabularySearchIndex(),
    readStartedRecognitionNoteIds()
  ]);
  const unseen=index.rows
    .filter(row=>row.id&&!started.has(row.id))
    .sort((a,b)=>a.order-b.order)
    .slice(0,limit);
  return ensureNewRecognitionRecords(unseen.map(row=>row.id));
}


async function adaptiveStagedRecords(
  limit:number,
  rows:VocabularySearchRow[],
  excludedNotes:Set<string>
):Promise<CanonicalSrsRecordV1[]>{
  if(limit<=0)return[];
  const started=await readStartedRecognitionNoteIds();
  const candidates=rows
    .filter(row=>started.has(row.id)&&!excludedNotes.has(row.id))
    .sort((a,b)=>a.order-b.order);

  const staged:CanonicalSrsRecordV1[]=[];
  for(let offset=0;offset<candidates.length&&staged.length<limit&&offset<1000;offset+=250){
    const batch=candidates.slice(offset,offset+250);
    const records=await readSrsByNoteIds(batch.map(row=>row.id));
    for(const meta of batch){
      const skill=nextAdaptiveSkill(meta,records.get(meta.id)??[]);
      if(!skill||skill==='recognition')continue;
      staged.push(await ensureSkillRecord(meta.id,skill));
      if(staged.length>=limit)break;
    }
  }
  return staged;
}

function interleaveSkills(records:CanonicalSrsRecordV1[]):CanonicalSrsRecordV1[]{
  const buckets=new Map<SkillId,CanonicalSrsRecordV1[]>();
  for(const record of records){
    const bucket=buckets.get(record.skill)??[];
    bucket.push(record);buckets.set(record.skill,bucket);
  }
  const result:CanonicalSrsRecordV1[]=[];
  let progressed=true;
  while(progressed){
    progressed=false;
    for(const skill of STAGE_ORDER){
      const bucket=buckets.get(skill);
      if(bucket?.length){result.push(bucket.shift() as CanonicalSrsRecordV1);progressed=true;}
    }
  }
  return result;
}
function noteIdFromSrsId(id:string):string{
  const marker='::d31:';const index=id.indexOf(marker);return index<0?id:id.slice(0,index);
}
function spaceWholeQueue(ids:string[],enabled:boolean):string[]{
  if(!enabled)return ids;
  return spaceSiblingFamilies(ids.map(id=>({id,familyKey:noteIdFromSrsId(id)})),4).map(item=>item.id);
}

export async function createReviewStudySession(limit=50,now=Date.now()):Promise<StudySessionStateV1>{
  const learner=await ensureCanonicalLearnerState();
  const prefs=sessionPreferences(learner);
  const queue=await smartDue(limit,now);
  const session=createStudySession(queue,{mode:'review',requeueAgain:prefs.requeueAgain,mix:prefs.mix,now});
  await writeActiveStudySession(session);
  return session;
}

export async function createLearnStudySession(limit?:number,now=Date.now()):Promise<StudySessionStateV1>{
  const learner=await ensureCanonicalLearnerState();
  const prefs=sessionPreferences(learner);
  const index=await loadVocabularySearchIndex();
  const rows=await freshRecords(limit??prefs.dailyNewLimit,index.rows);
  const queue=spaceWholeQueue(rows.map(row=>row.id),prefs.siblingSpacing);
  const session=createStudySession(queue,{mode:'learn',requeueAgain:prefs.requeueAgain,mix:prefs.mix,now});
  await writeActiveStudySession(session);
  return session;
}

export async function createTodayStudySession(now=Date.now()):Promise<StudySessionStateV1>{
  const learner=await ensureCanonicalLearnerState();
  const prefs=sessionPreferences(learner);
  const [today,dueTotal,index,recent]=await Promise.all([
    todayReviewCounts(now),
    countDueSrs(now),
    loadVocabularySearchIndex(),
    readReviewEventsSince(startOfRecentWindow(now,14),5000)
  ]);

  const reviewRemaining=Math.max(0,prefs.dailyReviewLimit-today.existingReviews);
  const remainingNew=Math.max(0,prefs.dailyNewLimit-today.newSeen);
  const pacing=pacingDecision(dueTotal,remainingNew,prefs.dailyReviewLimit,recent);
  const fresh=await freshRecords(pacing.allowedNew,index.rows);

  const baseStageLimit=Math.max(2,Math.min(8,Math.ceil(Math.max(1,prefs.dailyNewLimit)*.4)));
  const stageLimit=pacing.factor<=0?0:Math.ceil(baseStageLimit*Math.min(1,pacing.factor));
  const staged=await adaptiveStagedRecords(stageLimit,index.rows,new Set(fresh.map(row=>row.noteId)));
  const dueIds=await smartDue(reviewRemaining,now);
  const skillIds=interleaveSkills([...staged,...fresh]).map(row=>row.id);

  let queue=spaceWholeQueue(mixTodayQueue(dueIds,skillIds,prefs.mix),prefs.siblingSpacing);
  if(prefs.size>0)queue=queue.slice(0,prefs.size);

  const session=createStudySession(queue,{mode:'today',requeueAgain:prefs.requeueAgain,mix:prefs.mix,now});
  await writeActiveStudySession(session);
  return session;
}
