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
import type { CanonicalReviewEventV1,CanonicalSrsRecordV1,SkillId } from './model';
import { createStudySession,type StudyMix,type StudySessionStateV1 } from './session';
import { evidenceFromEvents,mixTodayQueue,sortSmartQueue,spaceSiblingFamilies,type QueueCandidate } from './queue';

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
function recentScheduledPerformance(events:CanonicalReviewEventV1[]){
  const scheduled=events.filter(event=>event.practiceOnly!==true);
  const reviewed=scheduled.length;
  const correct=scheduled.filter(event=>event.correct!==false&&event.rating!=='again').length;
  return{reviewed,correct,accuracy:reviewed?Math.round(correct/reviewed*100):null as number|null};
}
export function pacingDecision(
  dueTotal:number,
  remainingNew:number,
  reviewCapacity:number,
  events:CanonicalReviewEventV1[]
){
  const recent=recentScheduledPerformance(events);
  const cap=Math.max(0,Math.floor(reviewCapacity));
  const pressure=cap>0?dueTotal/Math.max(1,cap):0;
  let factor=1,reason='normal';
  if(cap>0&&pressure>=1){factor=0;reason='review backlog';}
  else if(cap>0&&pressure>=.65){factor=.5;reason='review pressure';}
  if(recent.reviewed>=30&&recent.accuracy!==null){
    if(recent.accuracy<72&&factor>.5){factor=.5;reason='recent recall needs consolidation';}
    else if(recent.accuracy<80&&factor>.75){factor=.75;reason='recent recall is still settling';}
  }
  const allowedNew=Math.min(Math.max(0,remainingNew),factor<=0?0:Math.ceil(Math.max(0,remainingNew)*factor));
  return{
    mode:factor===0?'recovery':factor<1?'cautious':'normal',
    factor,reason,dueTotal,pressure:Math.round(pressure*100)/100,
    remainingNew:Math.max(0,remainingNew),allowedNew,recent
  };
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

function bySkill(rows:CanonicalSrsRecordV1[]):Map<SkillId,CanonicalSrsRecordV1>{
  return new Map(rows.map(row=>[row.skill,row]));
}
function isUnseen(row:CanonicalSrsRecordV1|undefined):boolean{
  return !row||(row.status==='new'&&row.seen===0);
}
export function nextAdaptiveSkill(meta:VocabularySearchRow,rows:CanonicalSrsRecordV1[]):SkillId|null{
  const skills=bySkill(rows);
  const recognition=skills.get('recognition');
  if(isUnseen(recognition))return'recognition';
  if(!recognition)return null;
  const recognitionReady=recognition.status==='learned'&&(recognition.stability>=1||recognition.successes>=3);
  if(!recognitionReady)return null;

  const noun=/noun/i.test(meta.pos)&&Boolean(meta.article);
  if(noun){
    const article=skills.get('article');
    if(isUnseen(article))return'article';
    if(article){
      const ready=article.status==='learned'||(article.successes>=2&&article.stability>=.5);
      if(!ready)return null;
    }
  }

  const production=skills.get('production');
  if(isUnseen(production))return'production';
  if(production){
    const ready=production.status==='learned'&&(production.stability>=1||production.successes>=3);
    if(!ready)return null;
  }

  const spelling=skills.get('spelling');
  if(isUnseen(spelling))return'spelling';
  if(spelling){
    const ready=spelling.status==='learned'||(spelling.successes>=2&&spelling.stability>=.5);
    if(!ready)return null;
  }

  const listening=skills.get('listening');
  if(isUnseen(listening))return'listening';
  return null;
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
