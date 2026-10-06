import { loadVocabularySearchIndex } from '../content/loader';
import {
  ensureCanonicalLearnerState,
  ensureNewRecognitionRecords,
  readCanonicalLearnerState,
  readDueSrs,
  readKnownNoteIds,
  readRecentReviewEvents,
  todayReviewCounts,
  writeActiveStudySession
} from './repository';
import { createStudySession,type StudyMix,type StudySessionStateV1 } from './session';
import { evidenceFromEvents,mixTodayQueue,sortSmartQueue,type QueueCandidate } from './queue';

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
    mix
  };
}

async function smartDue(limit:number,now:number):Promise<string[]>{
  const [due,events,index]=await Promise.all([
    readDueSrs(Math.max(limit*3,120),now),
    readRecentReviewEvents(1200),
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

async function freshRecords(limit:number){
  if(limit<=0)return[];
  const [index,known]=await Promise.all([loadVocabularySearchIndex(),readKnownNoteIds()]);
  const unseen=index.rows
    .filter(row=>row.id&&!known.has(row.id))
    .sort((a,b)=>a.order-b.order)
    .slice(0,limit);
  return ensureNewRecognitionRecords(unseen.map(row=>row.id));
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
  const rows=await freshRecords(limit??prefs.dailyNewLimit);
  const queue=rows.map(row=>row.id);
  const session=createStudySession(queue,{mode:'learn',requeueAgain:prefs.requeueAgain,mix:prefs.mix,now});
  await writeActiveStudySession(session);
  return session;
}

export async function createTodayStudySession(now=Date.now()):Promise<StudySessionStateV1>{
  const learner=await ensureCanonicalLearnerState();
  const prefs=sessionPreferences(learner);
  const today=await todayReviewCounts(now);
  const reviewLimit=Math.max(0,prefs.dailyReviewLimit-today.existingReviews);
  const newLimit=Math.max(0,prefs.dailyNewLimit-today.newSeen);

  const [dueIds,fresh]=await Promise.all([
    smartDue(reviewLimit,now),
    freshRecords(newLimit)
  ]);

  const mixed=mixTodayQueue(dueIds,fresh.map(row=>row.id),prefs.mix);
  const session=createStudySession(mixed,{mode:'today',requeueAgain:prefs.requeueAgain,mix:prefs.mix,now});
  await writeActiveStudySession(session);
  return session;
}
