import { openFrenchDatabase,readMetaValue,writeMetaValue } from '../storage/idb';
import type {
  CanonicalLearnerStateV1,
  CanonicalMigrationV1,
  CanonicalReviewEventV1,
  CanonicalSrsRecordV1,
  CanonicalUserContentV1
} from './model';
import { scheduleRating,type SchedulerConfig,type SchedulerRating,type TypedQuality } from './scheduler';

const MIGRATION_MARKER='canonical-migration-v1';

function object(value:unknown):Record<string,unknown>{
  return value&&typeof value==='object'&&!Array.isArray(value)?value as Record<string,unknown>:{};
}
function number(value:unknown,fallback:number):number{
  const n=Number(value);return Number.isFinite(n)?n:fallback;
}
function steps(value:unknown,fallback:number[]):number[]{
  if(!Array.isArray(value))return fallback;
  const clean=value.map(item=>Math.round(number(item,0))).filter(item=>item>0&&item<=10080).slice(0,6).sort((a,b)=>a-b);
  return clean.length?clean:fallback;
}
function dayKey(timestamp:number):string{
  const d=new Date(timestamp);
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}
function highestEarnedLevel(promotions:Record<string,unknown>):string|undefined{
  let earned:string|undefined;
  for(const level of ['A1','A2','B1','B2']){
    const row=object(promotions[level]);
    if(Number(row.earnedAt)>0)earned=level;else break;
  }
  return earned;
}
function studyStreak(source:string[],now=Date.now()):number{
  const days=new Set(source);
  const format=(value:number)=>{const d=new Date(value);return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;};
  const cursor=new Date(now);cursor.setHours(0,0,0,0);
  if(!days.has(format(cursor.getTime())))cursor.setDate(cursor.getDate()-1);
  let streak=0;
  while(days.has(format(cursor.getTime()))){streak++;cursor.setDate(cursor.getDate()-1);}
  return streak;
}
function schedulerConfigFromLearner(learner:CanonicalLearnerStateV1|null):SchedulerConfig{
  const settings=object(learner?.settings);
  return{
    desiredRetention:Math.min(.97,Math.max(.7,number(settings.desiredRetention,.9))),
    maxInterval:Math.min(36500,Math.max(30,Math.round(number(settings.maxInterval,3650)))),
    learningSteps:steps(settings.learningSteps,[1,10,1440]),
    relearningSteps:steps(settings.relearningSteps,[10]),
    autoSuspendLeeches:settings.autoSuspendLeeches===true,
    leechThreshold:Math.min(30,Math.max(3,Math.round(number(settings.leechThreshold,8))))
  };
}

export async function canonicalMigrationFingerprint():Promise<string>{
  return (await readMetaValue<string>(MIGRATION_MARKER))??'';
}

export async function writeCanonicalMigration(data:CanonicalMigrationV1):Promise<void>{
  const db=await openFrenchDatabase();
  try{
    const tx=db.transaction(['learner','srs','activity','user-content','meta'],'readwrite');
    const learner=tx.objectStore('learner');
    const srs=tx.objectStore('srs');
    const activity=tx.objectStore('activity');
    const userContent=tx.objectStore('user-content');
    const meta=tx.objectStore('meta');

    learner.put(data.learner,'state-v1');
    userContent.put(data.userContent,'content-v1');

    srs.clear();
    for(const row of data.srs)srs.put(row,row.id);

    activity.clear();
    for(const row of data.reviews)activity.put(row,row.eventId);

    meta.put(data.learner.sourceFingerprint,MIGRATION_MARKER);
    meta.put({
      currentLevel:highestEarnedLevel(data.learner.promotions),
      dueCount:data.srs.filter(row=>row.status!=='new'&&!row.suspended&&row.dueAt>0&&row.dueAt<=Date.now()).length,
      streakDays:studyStreak(data.learner.studyDays)
    },'learner-summary');

    await new Promise<void>((resolve,reject)=>{
      tx.oncomplete=()=>resolve();
      tx.onerror=()=>reject(tx.error??new Error('Canonical learner migration failed.'));
      tx.onabort=()=>reject(tx.error??new Error('Canonical learner migration was aborted.'));
    });
  }finally{db.close();}
}

export async function readCanonicalLearnerState():Promise<CanonicalLearnerStateV1|null>{
  const db=await openFrenchDatabase();
  try{
    return await new Promise((resolve,reject)=>{
      const tx=db.transaction('learner','readonly');
      const request=tx.objectStore('learner').get('state-v1');
      request.onsuccess=()=>resolve((request.result as CanonicalLearnerStateV1|undefined)??null);
      request.onerror=()=>reject(request.error??new Error('Could not read learner state.'));
    });
  }finally{db.close();}
}

export async function readDueSrs(limit=30,now=Date.now()):Promise<CanonicalSrsRecordV1[]>{
  const db=await openFrenchDatabase();
  try{
    return await new Promise((resolve,reject)=>{
      const rows:CanonicalSrsRecordV1[]=[];
      const tx=db.transaction('srs','readonly');
      const store=tx.objectStore('srs');
      const index=store.index('dueAt');
      const request=index.openCursor(IDBKeyRange.bound(1,now));
      request.onsuccess=()=>{
        const cursor=request.result;
        if(!cursor||rows.length>=limit)return;
        const row=cursor.value as CanonicalSrsRecordV1;
        if(row.status!=='new'&&!row.suspended&&row.dueAt>0&&row.dueAt<=now)rows.push(row);
        cursor.continue();
      };
      request.onerror=()=>reject(request.error??new Error('Could not read due reviews.'));
      tx.oncomplete=()=>resolve(rows);
      tx.onerror=()=>reject(tx.error??new Error('Could not read due reviews.'));
      tx.onabort=()=>reject(tx.error??new Error('Due-review read was aborted.'));
    });
  }finally{db.close();}
}

export interface ReviewContentContext{
  level?:string;
  pos?:string;
  theme?:string;
  direction?:string;
  practice?:string;
  typed?:boolean;
  typedQuality?:string;
  correct?:boolean;
  xp?:number;
}

export async function recordCanonicalReview(
  previous:CanonicalSrsRecordV1,
  rating:SchedulerRating,
  context:ReviewContentContext={},
  timestamp=Date.now(),
  responseMs=0,
  typedQuality:TypedQuality='none'
):Promise<{next:CanonicalSrsRecordV1;event:CanonicalReviewEventV1}>{
  const learner=await readCanonicalLearnerState();
  if(!learner)throw new Error('Learner state is unavailable.');

  const next=scheduleRating(previous,rating,timestamp,responseMs,typedQuality,schedulerConfigFromLearner(learner));
  const event:CanonicalReviewEventV1={
    schema:'thiepn-french-review-event-v1',
    eventId:'vnext:'+timestamp+':'+previous.id+':'+(crypto.randomUUID?.()??Math.random().toString(36).slice(2)),
    t:timestamp,
    id:previous.id,
    noteId:previous.noteId,
    skill:previous.skill,
    rating,
    responseMs,
    wasNew:previous.status==='new'&&previous.seen===0,
    intervalDays:next.intervalDays,
    direction:context.direction??'',
    typed:context.typed===true,
    typedQuality:context.typedQuality??String(typedQuality),
    level:context.level??'',
    pos:context.pos??'',
    theme:context.theme??'',
    practice:context.practice??'review',
    correct:context.correct??rating!=='again',
    xp:Math.max(0,Math.round(context.xp??0)),
    practiceOnly:false,
    stability:next.stability,
    difficulty:next.difficulty,
    retrievability:next.retrievability,
    scheduledDays:next.scheduledDays,
    fsrsState:next.fsrsState
  };

  const today=dayKey(timestamp);
  const studyDays=learner.studyDays.includes(today)?learner.studyDays:[...learner.studyDays,today].sort();
  const profile={...learner.profile};
  profile.lifetimeAnswers=Math.max(0,Math.round(number(profile.lifetimeAnswers,0)))+1;
  if(event.correct)profile.lifetimeCorrect=Math.max(0,Math.round(number(profile.lifetimeCorrect,0)))+1;
  const updatedLearner={...learner,studyDays,profile};

  const db=await openFrenchDatabase();
  try{
    await new Promise<void>((resolve,reject)=>{
      const tx=db.transaction(['learner','srs','activity','meta'],'readwrite');
      tx.objectStore('learner').put(updatedLearner,'state-v1');
      tx.objectStore('srs').put(next,next.id);
      tx.objectStore('activity').put(event,event.eventId);

      const meta=tx.objectStore('meta');
      const summaryRequest=meta.get('learner-summary');
      summaryRequest.onsuccess=()=>{
        const current=object(summaryRequest.result);
        meta.put({
          currentLevel:current.currentLevel??highestEarnedLevel(updatedLearner.promotions),
          dueCount:Math.max(0,Math.round(number(current.dueCount,1))-1),
          streakDays:studyStreak(studyDays,timestamp)
        },'learner-summary');
      };

      tx.oncomplete=()=>resolve();
      tx.onerror=()=>reject(tx.error??new Error('Review transaction failed.'));
      tx.onabort=()=>reject(tx.error??new Error('Review transaction was aborted.'));
    });
  }finally{db.close();}

  return{next,event};
}

export async function readCanonicalUserContent():Promise<CanonicalUserContentV1|null>{
  const db=await openFrenchDatabase();
  try{
    return await new Promise((resolve,reject)=>{
      const tx=db.transaction('user-content','readonly');
      const request=tx.objectStore('user-content').get('content-v1');
      request.onsuccess=()=>resolve((request.result as CanonicalUserContentV1|undefined)??null);
      request.onerror=()=>reject(request.error??new Error('Could not read user content.'));
    });
  }finally{db.close();}
}

export async function hasCanonicalLearnerState():Promise<boolean>{
  return Boolean(await canonicalMigrationFingerprint());
}
export async function markCanonicalMigration(fingerprint:string):Promise<void>{
  await writeMetaValue(MIGRATION_MARKER,fingerprint);
}
