import type { JsonObject,LegacySnapshotEnvelope } from '../migration/legacy-contract';
import type {
  CanonicalLearnerStateV1,
  CanonicalMigrationV1,
  CanonicalReviewEventV1,
  CanonicalSrsRecordV1,
  CanonicalUserContentV1,
  FsrsState,
  Rating,
  SkillId,
  SrsStatus
} from './model';

const DEPTH_MARK='::d31:';
const SKILLS=new Set<SkillId>(['recognition','production','listening','spelling','article','']);
const RATINGS=new Set<Rating>(['again','hard','good','easy','']);
const FSRS_STATES=new Set<FsrsState>(['new','learning','review','relearning','']);
const STATUSES=new Set<SrsStatus>(['new','learning','learned']);

function object(value:unknown):JsonObject {
  return value&&typeof value==='object'&&!Array.isArray(value)?value as JsonObject:{};
}
function array(value:unknown):unknown[]{return Array.isArray(value)?value:[];}
function number(value:unknown,fallback=0):number{const n=Number(value);return Number.isFinite(n)?n:fallback;}
function integer(value:unknown,fallback=0):number{return Math.trunc(number(value,fallback));}
function text(value:unknown,max=4000):string{return typeof value==='string'?value.slice(0,max):'';}
function bool(value:unknown):boolean{return value===true;}

function parseId(id:string):{noteId:string;sense:number;skill:SkillId}{
  const index=id.indexOf(DEPTH_MARK);
  if(index<0)return{noteId:id,sense:0,skill:''};
  const [senseRaw='0',skillRaw='']=id.slice(index+DEPTH_MARK.length).split(':');
  const skill=SKILLS.has(skillRaw as SkillId)?skillRaw as SkillId:'';
  return{noteId:id.slice(0,index),sense:Math.max(0,integer(senseRaw)),skill};
}

export function legacyProgressToCanonical(payload:JsonObject):CanonicalSrsRecordV1[]{
  const progress=object(payload.progress);
  const rows:CanonicalSrsRecordV1[]=[];
  for(const [id,value] of Object.entries(progress)){
    if(!id||!value||typeof value!=='object'||Array.isArray(value))continue;
    const raw=object(value),parsed=parseId(id);
    const status=STATUSES.has(raw.status as SrsStatus)?raw.status as SrsStatus:'new';
    const lastRating=RATINGS.has(raw.lastRating as Rating)?raw.lastRating as Rating:'';
    const defaultFsrs:FsrsState=status==='learned'?'review':raw.relearning===true?'relearning':status;
    const fsrsState=FSRS_STATES.has(raw.fsrsState as FsrsState)?raw.fsrsState as FsrsState:defaultFsrs;
    rows.push({
      schema:'thiepn-french-srs-record-v1',
      id,noteId:parsed.noteId,sense:parsed.sense,skill:parsed.skill,
      status,
      seen:Math.max(0,integer(raw.seen)),
      streak:Math.max(0,integer(raw.streak)),
      intervalDays:Math.max(0,number(raw.interval)),
      dueAt:Math.max(0,number(raw.due)),
      lastReviewedAt:Math.max(0,number(raw.lastReviewed)),
      learnedAt:Math.max(0,number(raw.learnedAt)),
      ease:number(raw.ease,2.5),
      lapses:Math.max(0,integer(raw.lapses)),
      successes:Math.max(0,integer(raw.successes)),
      lastRating,
      learningStep:Math.max(0,integer(raw.learningStep)),
      againCount:Math.max(0,integer(raw.againCount)),
      hardCount:Math.max(0,integer(raw.hardCount)),
      goodCount:Math.max(0,integer(raw.goodCount)),
      easyCount:Math.max(0,integer(raw.easyCount)),
      lastResponseMs:Math.max(0,number(raw.lastResponseMs)),
      starred:bool(raw.starred),
      suspended:bool(raw.suspended),
      buriedUntil:Math.max(0,number(raw.buriedUntil)),
      manualKnown:bool(raw.manualKnown),
      note:text(raw.note),
      stability:Math.max(0,number(raw.stability,number(raw.interval))),
      difficulty:number(raw.difficulty,5),
      relearning:bool(raw.relearning),
      lastElapsedDays:Math.max(0,number(raw.lastElapsedDays)),
      fsrsVersion:text(raw.fsrsVersion,20),
      fsrsState,
      scheduledDays:Math.max(0,number(raw.scheduledDays,number(raw.interval))),
      elapsedDays:Math.max(0,number(raw.elapsedDays,number(raw.lastElapsedDays))),
      retrievability:Math.min(1,Math.max(0,number(raw.retrievability,status==='new'?0:.9))),
      lastAnswerIssue:text(raw.lastAnswerIssue,50)
    });
  }
  return rows;
}

export function legacyReviewLogToCanonical(payload:JsonObject):CanonicalReviewEventV1[]{
  const rows:CanonicalReviewEventV1[]=[];
  for(const [index,value] of array(payload.reviewLog).entries()){
    const raw=object(value);
    const id=text(raw.id,220);
    const rating=RATINGS.has(raw.rating as Rating)?raw.rating as Rating:'';
    if(!id||!rating)continue;
    const parsed=parseId(id);
    const skill=SKILLS.has(raw.skill as SkillId)?raw.skill as SkillId:parsed.skill;
    const fsrsState=FSRS_STATES.has(raw.fsrsState as FsrsState)?raw.fsrsState as FsrsState:'';
    const t=Math.max(0,number(raw.t));
    rows.push({
      schema:'thiepn-french-review-event-v1',
      eventId:`legacy:${t}:${id}:${index}`,
      t,id,
      noteId:text(raw.noteId,220)||parsed.noteId,
      skill,
      rating:rating as Exclude<Rating,''>,
      responseMs:Math.max(0,number(raw.responseMs)),
      wasNew:bool(raw.wasNew),
      intervalDays:Math.max(0,number(raw.interval)),
      direction:text(raw.direction,30),
      typed:bool(raw.typed),
      typedQuality:text(raw.typedQuality,40),
      level:text(raw.level,10),
      pos:text(raw.pos,40),
      theme:text(raw.theme,80),
      practice:text(raw.practice,40)||'classic',
      correct:typeof raw.correct==='boolean'?raw.correct:rating!=='again',
      xp:Math.max(0,integer(raw.xp)),
      practiceOnly:bool(raw.practiceOnly),
      stability:Math.max(0,number(raw.stability)),
      difficulty:number(raw.difficulty,5),
      retrievability:Math.min(1,Math.max(0,number(raw.retrievability))),
      scheduledDays:Math.max(0,number(raw.scheduledDays,number(raw.interval))),
      fsrsState
    });
  }
  return rows;
}

const FEATURE_KEYS=[
  'mistakeLog','resumeSnapshot','sessionHistory',
  'v550Reading','v560Listening','v570Speaking','v580Conversation','v590Missions',
  'v5110Curriculum','v5120OpenWorld','v5130Orchestrator','v5140Composer',
  'v5150Longitudinal','v5160Progression','v5170Remediation','v5190Benchmark',
  'v5220Production','v5230Capstone','v5240Oral'
] as const;

export function legacyEnvelopeToCanonical(envelope:LegacySnapshotEnvelope):CanonicalMigrationV1{
  const payload=envelope.payload;
  const featureState:Record<string,unknown>={};
  for(const key of FEATURE_KEYS)if(payload[key]!==undefined)featureState[key]=payload[key];

  const progression=object(payload.v5160Progression);
  const learner:CanonicalLearnerStateV1={
    schema:'thiepn-french-learner-state-v1',
    revision:1,
    migratedAt:Date.now(),
    sourceFingerprint:envelope.fingerprint,
    sourceUpdatedAt:envelope.sourceUpdatedAt,
    sourceVersion:envelope.sourceVersion,
    sourceSchema:envelope.sourceSchema,
    settings:object(payload.settings),
    profile:object(payload.profile),
    studyPlan:object(payload.studyPlan),
    promotions:object(progression.promotions),
    studyDays:array(payload.studyDays).filter(value=>typeof value==='string') as string[],
    featureState
  };

  const userContent:CanonicalUserContentV1={
    schema:'thiepn-french-user-content-v1',
    userCards:object(payload.userCards),
    cardEdits:object(payload.cardEdits),
    smartDecks:object(payload.smartDecks),
    customDecks:object(payload.customDecks)
  };

  return{
    learner,
    srs:legacyProgressToCanonical(payload),
    reviews:legacyReviewLogToCanonical(payload),
    userContent
  };
}
