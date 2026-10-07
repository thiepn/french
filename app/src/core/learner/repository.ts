import { openFrenchDatabase,readMetaValue,writeMetaValue } from '../storage/idb';
import type {
  CanonicalLearnerStateV1,
  CanonicalMigrationV1,
  CanonicalReviewEventV1,
  CanonicalSrsRecordV1,
  CanonicalUserContentV1,
  SkillId
} from './model';
import { scheduleRating,type SchedulerConfig,type SchedulerRating,type TypedQuality } from './scheduler';
import { advanceSession,insertReinforcement,normalizeStudySession,reinforcementAt,type StudySessionStateV1,type StudyUndoEntryV1 } from './session';

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
  hasContext?:boolean;
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


export async function readSrsById(id:string):Promise<CanonicalSrsRecordV1|null>{
  const db=await openFrenchDatabase();
  try{
    return await new Promise((resolve,reject)=>{
      const tx=db.transaction('srs','readonly');
      const request=tx.objectStore('srs').get(id);
      request.onsuccess=()=>resolve((request.result as CanonicalSrsRecordV1|undefined)??null);
      request.onerror=()=>reject(request.error??new Error('Could not read SRS record.'));
    });
  }finally{db.close();}
}

export async function readRecentReviewEvents(limit=1000):Promise<CanonicalReviewEventV1[]>{
  const db=await openFrenchDatabase();
  try{
    return await new Promise((resolve,reject)=>{
      const rows:CanonicalReviewEventV1[]=[];
      const tx=db.transaction('activity','readonly');
      const request=tx.objectStore('activity').index('t').openCursor(null,'prev');
      request.onsuccess=()=>{
        const cursor=request.result;
        if(!cursor||rows.length>=limit)return;
        rows.push(cursor.value as CanonicalReviewEventV1);
        cursor.continue();
      };
      request.onerror=()=>reject(request.error??new Error('Could not read recent review evidence.'));
      tx.oncomplete=()=>resolve(rows);
      tx.onerror=()=>reject(tx.error??new Error('Could not read recent review evidence.'));
    });
  }finally{db.close();}
}

export async function todayReviewCounts(now=Date.now()):Promise<{newSeen:number;existingReviews:number}>{
  const start=new Date(now);start.setHours(0,0,0,0);
  const end=new Date(start);end.setDate(end.getDate()+1);
  const db=await openFrenchDatabase();
  try{
    return await new Promise((resolve,reject)=>{
      const introduced=new Set<string>();let existingReviews=0;
      const tx=db.transaction('activity','readonly');
      const request=tx.objectStore('activity').index('t').openCursor(IDBKeyRange.bound(start.getTime(),end.getTime(),false,true));
      request.onsuccess=()=>{
        const cursor=request.result;
        if(!cursor)return;
        const row=cursor.value as CanonicalReviewEventV1;
        if(row.practiceOnly!==true){
          if(row.wasNew&&row.skill==='recognition')introduced.add(row.noteId);
          else if(!row.wasNew)existingReviews++;
        }
        cursor.continue();
      };
      request.onerror=()=>reject(request.error??new Error('Could not read today review counts.'));
      tx.oncomplete=()=>resolve({newSeen:introduced.size,existingReviews});
      tx.onerror=()=>reject(tx.error??new Error('Could not read today review counts.'));
    });
  }finally{db.close();}
}

export function newSkillRecord(noteId:string,skill:SkillId='recognition'):CanonicalSrsRecordV1{
  return{
    schema:'thiepn-french-srs-record-v1',
    id:noteId+'::d31:0:'+skill,
    noteId,
    sense:0,
    skill,
    status:'new',
    seen:0,streak:0,intervalDays:0,dueAt:0,lastReviewedAt:0,learnedAt:0,
    ease:2.5,lapses:0,successes:0,lastRating:'',learningStep:0,againCount:0,hardCount:0,
    goodCount:0,easyCount:0,lastResponseMs:0,starred:false,suspended:false,buriedUntil:0,
    manualKnown:false,note:'',stability:0,difficulty:5,relearning:false,lastElapsedDays:0,
    fsrsVersion:'',fsrsState:'new',scheduledDays:0,elapsedDays:0,retrievability:0,lastAnswerIssue:''
  };
}

export function newRecognitionRecord(noteId:string):CanonicalSrsRecordV1{
  return newSkillRecord(noteId,'recognition');
}

export async function ensureSkillRecord(noteId:string,skill:SkillId):Promise<CanonicalSrsRecordV1>{
  const id=noteId+'::d31:0:'+skill;
  const existing=await readSrsById(id);
  if(existing)return existing;
  const row=newSkillRecord(noteId,skill);
  const db=await openFrenchDatabase();
  try{
    await new Promise<void>((resolve,reject)=>{
      const tx=db.transaction('srs','readwrite');
      tx.objectStore('srs').put(row,row.id);
      tx.oncomplete=()=>resolve();
      tx.onerror=()=>reject(tx.error??new Error('Could not create skill record.'));
      tx.onabort=()=>reject(tx.error??new Error('Skill record write was aborted.'));
    });
  }finally{db.close();}
  return row;
}

export async function readSrsByNoteId(noteId:string):Promise<CanonicalSrsRecordV1[]>{
  const db=await openFrenchDatabase();
  try{
    return await new Promise((resolve,reject)=>{
      const rows:CanonicalSrsRecordV1[]=[];
      const tx=db.transaction('srs','readonly');
      const request=tx.objectStore('srs').index('noteId').openCursor(IDBKeyRange.only(noteId));
      request.onsuccess=()=>{
        const cursor=request.result;
        if(!cursor)return;
        rows.push(cursor.value as CanonicalSrsRecordV1);
        cursor.continue();
      };
      request.onerror=()=>reject(request.error??new Error('Could not read note skill records.'));
      tx.oncomplete=()=>resolve(rows);
      tx.onerror=()=>reject(tx.error??new Error('Could not read note skill records.'));
    });
  }finally{db.close();}
}

export async function ensureNewRecognitionRecords(noteIds:string[]):Promise<CanonicalSrsRecordV1[]>{
  const unique=[...new Set(noteIds.filter(Boolean))].slice(0,100);
  const rows:CanonicalSrsRecordV1[]=[];
  for(const noteId of unique){
    rows.push(await ensureSkillRecord(noteId,'recognition'));
  }
  return rows;
}

export async function readActiveStudySession(now=Date.now()):Promise<StudySessionStateV1|null>{
  const db=await openFrenchDatabase();
  try{
    const raw=await new Promise<unknown>((resolve,reject)=>{
      const tx=db.transaction('session','readonly');
      const request=tx.objectStore('session').get('active');
      request.onsuccess=()=>resolve(request.result);
      request.onerror=()=>reject(request.error??new Error('Could not read active study session.'));
    });
    const session=normalizeStudySession(raw,now);
    if(session)return session;
  }finally{db.close();}
  await clearActiveStudySession();
  return null;
}

export async function writeActiveStudySession(session:StudySessionStateV1):Promise<void>{
  const db=await openFrenchDatabase();
  try{
    await new Promise<void>((resolve,reject)=>{
      const tx=db.transaction('session','readwrite');
      tx.objectStore('session').put(session,'active');
      tx.oncomplete=()=>resolve();
      tx.onerror=()=>reject(tx.error??new Error('Could not save active study session.'));
      tx.onabort=()=>reject(tx.error??new Error('Study session save was aborted.'));
    });
  }finally{db.close();}
}

export async function clearActiveStudySession():Promise<void>{
  const db=await openFrenchDatabase();
  try{
    await new Promise<void>((resolve,reject)=>{
      const tx=db.transaction('session','readwrite');
      tx.objectStore('session').delete('active');
      tx.oncomplete=()=>resolve();
      tx.onerror=()=>reject(tx.error??new Error('Could not clear active study session.'));
      tx.onabort=()=>reject(tx.error??new Error('Study session clear was aborted.'));
    });
  }finally{db.close();}
}

function cloneSessionStats(session:StudySessionStateV1):StudySessionStateV1['stats']{
  return JSON.parse(JSON.stringify(session.stats)) as StudySessionStateV1['stats'];
}

function updateSessionStats(
  session:StudySessionStateV1,
  previous:CanonicalSrsRecordV1,
  rating:SchedulerRating,
  event:CanonicalReviewEventV1
):StudySessionStateV1['stats']{
  const stats=cloneSessionStats(session);
  stats.ratings[rating]++;
  stats.reviewed++;
  if(event.correct){stats.correct++;stats.combo++;}else{stats.combo=0;if(!stats.missedIds.includes(previous.id))stats.missedIds.push(previous.id);}
  stats.bestCombo=Math.max(stats.bestCombo,stats.combo);
  if(previous.status==='new'&&previous.seen===0)stats.newSeen++;
  stats.totalResponseMs+=event.responseMs;
  const quality=(event.typedQuality||'none') as keyof StudySessionStateV1['stats']['typed'];
  if(quality in stats.typed)stats.typed[quality]++;
  const practice=(event.practice||'review') as keyof StudySessionStateV1['stats']['practice'];
  if(practice in stats.practice)stats.practice[practice]++;
  return stats;
}

function ratingXp(rating:SchedulerRating,practice:string,typed:boolean,combo:number):number{
  const base={again:1,hard:4,good:7,easy:10}[rating]??0;
  const bonus=practice==='listening'||practice==='cloze'?3:practice==='choice'?2:typed?2:0;
  return base+bonus+Math.min(5,Math.floor(combo/5));
}

export async function recordStudySessionReview(
  previous:CanonicalSrsRecordV1,
  rating:SchedulerRating,
  context:ReviewContentContext={},
  timestamp=Date.now(),
  responseMs=0,
  typedQuality:TypedQuality='none'
):Promise<{next:CanonicalSrsRecordV1;event:CanonicalReviewEventV1;session:StudySessionStateV1}>{
  const learner=await ensureCanonicalLearnerState(timestamp);
  const active=await readActiveStudySession(timestamp);
  if(!active)throw new Error('Active learner session is unavailable.');

  const reinforcement=reinforcementAt(active);
  const practiceOnly=Boolean(reinforcement);
  const next=practiceOnly
    ?previous
    :scheduleRating(previous,rating,timestamp,responseMs,typedQuality,schedulerConfigFromLearner(learner));
  const correct=context.correct??rating!=='again';
  const nextCombo=correct?active.stats.combo+1:0;
  const practice=reinforcement?.practice??context.practice??'review';
  const xp=ratingXp(rating,practice,context.typed===true,nextCombo);
  const event:CanonicalReviewEventV1={
    schema:'thiepn-french-review-event-v1',
    eventId:'vnext:'+timestamp+':'+previous.id+':'+(crypto.randomUUID?.()??Math.random().toString(36).slice(2)),
    t:timestamp,id:previous.id,noteId:previous.noteId,skill:previous.skill,rating,responseMs,
    wasNew:practiceOnly?false:previous.status==='new'&&previous.seen===0,
    intervalDays:next.intervalDays,
    direction:(reinforcement?.direction||context.direction)||'',
    typed:context.typed===true,
    typedQuality:context.typedQuality??String(typedQuality),
    level:context.level??'',pos:context.pos??'',theme:context.theme??'',
    practice,correct,xp,practiceOnly,
    stability:next.stability,difficulty:next.difficulty,retrievability:next.retrievability,
    scheduledDays:next.scheduledDays,fsrsState:next.fsrsState
  };

  const today=dayKey(timestamp);
  const studyDays=learner.studyDays.includes(today)?learner.studyDays:[...learner.studyDays,today].sort();
  const profile={...learner.profile};
  profile.xp=Math.max(0,Math.round(number(profile.xp,0)))+xp;
  profile.lifetimeAnswers=Math.max(0,Math.round(number(profile.lifetimeAnswers,0)))+1;
  if(correct)profile.lifetimeCorrect=Math.max(0,Math.round(number(profile.lifetimeCorrect,0)))+1;
  if(context.typed===true)profile.typedAnswers=Math.max(0,Math.round(number(profile.typedAnswers,0)))+1;
  if(practice==='listening')profile.listeningAnswers=Math.max(0,Math.round(number(profile.listeningAnswers,0)))+1;
  profile.bestCombo=Math.max(Math.round(number(profile.bestCombo,0)),nextCombo);
  const updatedLearner={...learner,studyDays,profile};

  const previousSummary=(await readMetaValue<{currentLevel?:string;dueCount?:number;streakDays?:number}>('learner-summary'))??{};
  const undo:StudyUndoEntryV1={
    schema:'thiepn-french-study-undo-v1',
    createdAt:timestamp,
    srsId:previous.id,
    previousRecord:previous,
    eventId:event.eventId,
    previousStudyDays:[...learner.studyDays],
    previousProfile:{...learner.profile},
    previousSummary:{...previousSummary},
    previousQueueIds:[...active.queueIds],
    previousReinforcements:active.reinforcements.map(item=>({...item})),
    previousCursor:active.cursor,
    previousStats:cloneSessionStats(active)
  };

  let session:StudySessionStateV1={
    ...active,
    stats:updateSessionStats(active,previous,rating,event),
    undo:[...active.undo.slice(-19),undo]
  };

  if(practiceOnly){
    session.stats.adaptivePractice++;
  }else{
    const initial=Math.max(10,active.seedIds.length||active.queueIds.length||10);
    const cap=Math.min(6,Math.max(2,Math.ceil(initial*.18)));
    const hardWeak=rating==='hard'&&(next.lapses>=2||next.difficulty>=7||next.lastRating==='again');
    const leechLike=next.lapses>=5||next.againCount>=7;
    const remaining=Math.max(0,cap-session.stats.adaptiveReinforcements);

    if((rating==='again'||hardWeak)&&remaining>0&&context.hasContext===true){
      const offset=rating==='again'
        ?Math.min(6,Math.max(4,Math.round(initial*.12)))
        :Math.min(9,Math.max(6,Math.round(initial*.18)));
      session=insertReinforcement(
        session,
        previous.id,
        'context',
        offset,
        context.direction==='fr-en'||context.direction==='en-fr'?context.direction:'',
        'cloze'
      );
    }

    const remainingAfterContext=Math.max(0,cap-session.stats.adaptiveReinforcements);
    if(rating==='again'&&!leechLike&&remainingAfterContext>0){
      const reverse=context.direction==='fr-en'?'en-fr':context.direction==='en-fr'?'fr-en':'';
      const offset=Math.min(12,Math.max(8,Math.round(initial*.24)));
      session=insertReinforcement(session,previous.id,'reverse',offset,reverse,'review');
    }
  }

  session=advanceSession(session,timestamp);

  const summary={
    currentLevel:previousSummary.currentLevel??highestEarnedLevel(updatedLearner.promotions),
    dueCount:practiceOnly
      ?Math.max(0,Math.round(number(previousSummary.dueCount,0)))
      :Math.max(0,Math.round(number(previousSummary.dueCount,1))-(previous.status==='new'?0:1)),
    streakDays:studyStreak(studyDays,timestamp)
  };

  const db=await openFrenchDatabase();
  try{
    await new Promise<void>((resolve,reject)=>{
      const stores=practiceOnly
        ?['learner','activity','meta','session']
        :['learner','srs','activity','meta','session'];
      const tx=db.transaction(stores,'readwrite');
      tx.objectStore('learner').put(updatedLearner,'state-v1');
      if(!practiceOnly)tx.objectStore('srs').put(next,next.id);
      tx.objectStore('activity').put(event,event.eventId);
      tx.objectStore('meta').put(summary,'learner-summary');
      tx.objectStore('session').put(session,'active');
      tx.oncomplete=()=>resolve();
      tx.onerror=()=>reject(tx.error??new Error('Study-session review transaction failed.'));
      tx.onabort=()=>reject(tx.error??new Error('Study-session review transaction was aborted.'));
    });
  }finally{db.close();}

  return{next,event,session};
}
export async function skipStudySessionItem(now=Date.now()):Promise<StudySessionStateV1|null>{
  const active=await readActiveStudySession(now);
  if(!active)return null;
  const stats=cloneSessionStats(active);stats.skipped++;
  const next=advanceSession({...active,stats},now);
  await writeActiveStudySession(next);
  return next;
}

export async function undoLastStudySessionReview(now=Date.now()):Promise<StudySessionStateV1|null>{
  const active=await readActiveStudySession(now);
  const undo=active?.undo.at(-1);
  if(!active||!undo)return null;

  const learner=await readCanonicalLearnerState();
  if(!learner)throw new Error('Learner state is unavailable.');

  const restoredLearner={...learner,studyDays:[...undo.previousStudyDays],profile:{...undo.previousProfile}};
  const restored:StudySessionStateV1={
    ...active,
    queueIds:[...undo.previousQueueIds],
    reinforcements:(undo.previousReinforcements??[]).map(item=>({...item})),
    cursor:undo.previousCursor,
    currentId:undo.previousQueueIds[undo.previousCursor]??undo.srsId,
    stats:JSON.parse(JSON.stringify(undo.previousStats)) as StudySessionStateV1['stats'],
    undo:active.undo.slice(0,-1),
    updatedAt:now,
    expiresAt:now+14*86_400_000
  };

  const db=await openFrenchDatabase();
  try{
    await new Promise<void>((resolve,reject)=>{
      const tx=db.transaction(['learner','srs','activity','meta','session'],'readwrite');
      tx.objectStore('learner').put(restoredLearner,'state-v1');
      tx.objectStore('srs').put(undo.previousRecord,undo.srsId);
      tx.objectStore('activity').delete(undo.eventId);
      tx.objectStore('meta').put(undo.previousSummary,'learner-summary');
      tx.objectStore('session').put(restored,'active');
      tx.oncomplete=()=>resolve();
      tx.onerror=()=>reject(tx.error??new Error('Undo transaction failed.'));
      tx.onabort=()=>reject(tx.error??new Error('Undo transaction was aborted.'));
    });
  }finally{db.close();}

  return restored;
}


export async function readStartedRecognitionNoteIds():Promise<Set<string>>{
  const db=await openFrenchDatabase();
  try{
    return await new Promise((resolve,reject)=>{
      const notes=new Set<string>();
      const tx=db.transaction('srs','readonly');
      const request=tx.objectStore('srs').openCursor();
      request.onsuccess=()=>{
        const cursor=request.result;
        if(!cursor)return;
        const row=cursor.value as CanonicalSrsRecordV1;
        if(row.skill==='recognition'&&(row.status!=='new'||row.seen>0))notes.add(row.noteId);
        cursor.continue();
      };
      request.onerror=()=>reject(request.error??new Error('Could not enumerate started recognition notes.'));
      tx.oncomplete=()=>resolve(notes);
      tx.onerror=()=>reject(tx.error??new Error('Could not enumerate started recognition notes.'));
    });
  }finally{db.close();}
}


export async function ensureCanonicalLearnerState(now=Date.now()):Promise<CanonicalLearnerStateV1>{
  const existing=await readCanonicalLearnerState();
  if(existing)return existing;

  const learner:CanonicalLearnerStateV1={
    schema:'thiepn-french-learner-state-v1',
    revision:1,
    migratedAt:now,
    sourceFingerprint:'fresh-vnext',
    sourceUpdatedAt:now,
    sourceVersion:'vnext',
    sourceSchema:0,
    settings:{
      session:{
        deck:'A1',direction:'fr-en',order:'smart',size:50,mode:'today',practice:'review',
        skillMode:'adaptive',scheduleMode:'review',
        typed:false,requeueAgain:true,mix:'due-first',siblingSpacing:true,strictArticles:true
      },
      dailyNewLimit:20,
      dailyReviewLimit:200,
      leechThreshold:8,
      autoSuspendLeeches:false,
      desiredRetention:.9,
      maxInterval:3650,
      learningSteps:[1,10,1440],
      relearningSteps:[10],
      gradingMode:'learning'
    },
    profile:{
      xp:0,bestCombo:0,lifetimeAnswers:0,lifetimeCorrect:0,typedAnswers:0,
      choiceAnswers:0,listeningAnswers:0,clozeAnswers:0,perfectSessions:0,
      achievements:[],claimedMissions:{}
    },
    studyPlan:{targetLevel:'B1',targetDate:'',studyDaysPerWeek:6,dailyMinutes:30,masteryGoal:90},
    promotions:{},
    studyDays:[],
    featureState:{}
  };

  const db=await openFrenchDatabase();
  try{
    await new Promise<void>((resolve,reject)=>{
      const tx=db.transaction(['learner','user-content','meta'],'readwrite');
      tx.objectStore('learner').put(learner,'state-v1');
      tx.objectStore('user-content').put({
        schema:'thiepn-french-user-content-v1',
        userCards:{},cardEdits:{},smartDecks:{},customDecks:{}
      },'content-v1');
      tx.objectStore('meta').put({currentLevel:undefined,dueCount:0,streakDays:0},'learner-summary');
      tx.oncomplete=()=>resolve();
      tx.onerror=()=>reject(tx.error??new Error('Could not initialize fresh learner state.'));
      tx.onabort=()=>reject(tx.error??new Error('Fresh learner initialization was aborted.'));
    });
  }finally{db.close();}

  return learner;
}


export async function readReviewEventsSince(startAt:number,limit=5000):Promise<CanonicalReviewEventV1[]>{
  const db=await openFrenchDatabase();
  try{
    return await new Promise((resolve,reject)=>{
      const rows:CanonicalReviewEventV1[]=[];
      const tx=db.transaction('activity','readonly');
      const request=tx.objectStore('activity').index('t').openCursor(IDBKeyRange.lowerBound(startAt),'next');
      request.onsuccess=()=>{
        const cursor=request.result;
        if(!cursor||rows.length>=limit)return;
        rows.push(cursor.value as CanonicalReviewEventV1);
        cursor.continue();
      };
      request.onerror=()=>reject(request.error??new Error('Could not read scheduled performance window.'));
      tx.oncomplete=()=>resolve(rows);
      tx.onerror=()=>reject(tx.error??new Error('Could not read scheduled performance window.'));
    });
  }finally{db.close();}
}

export async function countDueSrs(now=Date.now()):Promise<number>{
  const db=await openFrenchDatabase();
  try{
    return await new Promise((resolve,reject)=>{
      let count=0;
      const tx=db.transaction('srs','readonly');
      const request=tx.objectStore('srs').index('dueAt').openCursor(IDBKeyRange.bound(1,now));
      request.onsuccess=()=>{
        const cursor=request.result;
        if(!cursor)return;
        const row=cursor.value as CanonicalSrsRecordV1;
        if(row.status!=='new'&&!row.suspended&&(!row.buriedUntil||row.buriedUntil<=now))count++;
        cursor.continue();
      };
      request.onerror=()=>reject(request.error??new Error('Could not count due reviews.'));
      tx.oncomplete=()=>resolve(count);
      tx.onerror=()=>reject(tx.error??new Error('Could not count due reviews.'));
    });
  }finally{db.close();}
}


export async function readSrsByNoteIds(noteIds:string[]):Promise<Map<string,CanonicalSrsRecordV1[]>>{
  const unique=[...new Set(noteIds.filter(Boolean))].slice(0,500);
  const result=new Map<string,CanonicalSrsRecordV1[]>();
  if(!unique.length)return result;
  const db=await openFrenchDatabase();
  try{
    return await new Promise((resolve,reject)=>{
      const tx=db.transaction('srs','readonly');
      const index=tx.objectStore('srs').index('noteId');
      let pending=unique.length;
      for(const noteId of unique){
        const request=index.getAll(IDBKeyRange.only(noteId));
        request.onsuccess=()=>{
          result.set(noteId,(request.result??[]) as CanonicalSrsRecordV1[]);
          pending--;
        };
        request.onerror=()=>reject(request.error??new Error('Could not batch-read note skill records.'));
      }
      tx.oncomplete=()=>resolve(result);
      tx.onerror=()=>reject(tx.error??new Error('Could not batch-read note skill records.'));
      tx.onabort=()=>reject(tx.error??new Error('Batch note skill read was aborted.'));
    });
  }finally{db.close();}
}

export async function replaceCanonicalLearnerSettings(settings:Record<string,unknown>):Promise<CanonicalLearnerStateV1>{
  const learner=await ensureCanonicalLearnerState();
  const updated:CanonicalLearnerStateV1={...learner,settings:{...settings}};
  const db=await openFrenchDatabase();
  try{
    await new Promise<void>((resolve,reject)=>{
      const tx=db.transaction('learner','readwrite');
      tx.objectStore('learner').put(updated,'state-v1');
      tx.oncomplete=()=>resolve();
      tx.onerror=()=>reject(tx.error??new Error('Could not save learner settings.'));
      tx.onabort=()=>reject(tx.error??new Error('Learner settings save was aborted.'));
    });
  }finally{db.close();}
  return updated;
}

export async function readAllSrsRecords():Promise<CanonicalSrsRecordV1[]>{
  const db=await openFrenchDatabase();
  try{
    return await new Promise((resolve,reject)=>{
      const tx=db.transaction('srs','readonly');
      const request=tx.objectStore('srs').getAll();
      request.onsuccess=()=>resolve((request.result??[]) as CanonicalSrsRecordV1[]);
      request.onerror=()=>reject(request.error??new Error('Could not read SRS intelligence snapshot.'));
      tx.onerror=()=>reject(tx.error??new Error('Could not read SRS intelligence snapshot.'));
      tx.onabort=()=>reject(tx.error??new Error('SRS intelligence read was aborted.'));
    });
  }finally{db.close();}
}


export interface PracticeEvidenceInput{
  noteId:string;
  id?:string;
  skill:SkillId;
  responseMs?:number;
  level?:string;
  pos?:string;
  theme?:string;
  direction?:string;
  practice:string;
  typed?:boolean;
  typedQuality?:string;
  correct:boolean;
  supportLevel?:number;
  firstListen?:boolean;
  playCount?:number;
  playbackRate?:number;
  transcriptUsed?:boolean;
  translationUsed?:boolean;
  errorCategory?:string;
}

export async function recordPracticeEvidence(input:PracticeEvidenceInput,timestamp=Date.now()):Promise<CanonicalReviewEventV1>{
  const learner=await ensureCanonicalLearnerState(timestamp);
  const id=input.id??(input.noteId+'::d31:0:'+input.skill);
  const source=await readSrsById(id);
  const event:CanonicalReviewEventV1={
    schema:'thiepn-french-review-event-v1',
    eventId:'vnext-practice:'+timestamp+':'+id+':'+(crypto.randomUUID?.()??Math.random().toString(36).slice(2)),
    t:timestamp,
    id,
    noteId:input.noteId,
    skill:input.skill,
    rating:input.correct?'good':'again',
    responseMs:Math.max(0,Math.round(input.responseMs??0)),
    wasNew:false,
    intervalDays:source?.intervalDays??0,
    direction:input.direction??'',
    typed:input.typed===true,
    typedQuality:input.typedQuality??'none',
    level:input.level??'',
    pos:input.pos??'',
    theme:input.theme??'',
    practice:input.practice,
    correct:input.correct,
    xp:0,
    practiceOnly:true,
    stability:source?.stability??0,
    difficulty:source?.difficulty??0,
    retrievability:source?.retrievability??0,
    scheduledDays:source?.scheduledDays??0,
    fsrsState:source?.fsrsState??'',
    supportLevel:Math.max(0,Math.min(3,Math.round(input.supportLevel??0))),
    firstListen:input.firstListen===true,
    playCount:Math.max(0,Math.round(input.playCount??0)),
    playbackRate:Number.isFinite(input.playbackRate)?Number(input.playbackRate):1,
    transcriptUsed:input.transcriptUsed===true,
    translationUsed:input.translationUsed===true,
    errorCategory:input.errorCategory??''
  };
  const today=dayKey(timestamp);
  const studyDays=learner.studyDays.includes(today)?learner.studyDays:[...learner.studyDays,today].sort();
  const profile={...learner.profile};
  if(input.skill==='listening')profile.listeningAnswers=Math.max(0,Math.round(number(profile.listeningAnswers,0)))+1;
  if(input.practice.startsWith('spoken'))profile.spokenAnswers=Math.max(0,Math.round(number(profile.spokenAnswers,0)))+1;
  const updated={...learner,studyDays,profile};

  const db=await openFrenchDatabase();
  try{
    await new Promise<void>((resolve,reject)=>{
      const tx=db.transaction(['learner','activity','meta'],'readwrite');
      tx.objectStore('learner').put(updated,'state-v1');
      tx.objectStore('activity').put(event,event.eventId);
      const meta=tx.objectStore('meta');
      const summaryRequest=meta.get('learner-summary');
      summaryRequest.onsuccess=()=>{
        const current=object(summaryRequest.result);
        meta.put({
          currentLevel:current.currentLevel??highestEarnedLevel(updated.promotions),
          dueCount:Math.max(0,Math.round(number(current.dueCount,0))),
          streakDays:studyStreak(studyDays,timestamp)
        },'learner-summary');
      };
      tx.oncomplete=()=>resolve();
      tx.onerror=()=>reject(tx.error??new Error('Practice evidence write failed.'));
      tx.onabort=()=>reject(tx.error??new Error('Practice evidence write was aborted.'));
    });
  }finally{db.close();}
  return event;
}
