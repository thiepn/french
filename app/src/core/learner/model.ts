export type SrsStatus='new'|'learning'|'learned';
export type FsrsState='new'|'learning'|'review'|'relearning'|'';
export type Rating='again'|'hard'|'good'|'easy'|'';
export type SkillId='recognition'|'production'|'listening'|'spelling'|'article'|'';

export interface CanonicalSrsRecordV1 {
  schema:'thiepn-french-srs-record-v1';
  id:string;
  noteId:string;
  sense:number;
  skill:SkillId;
  status:SrsStatus;
  seen:number;
  streak:number;
  intervalDays:number;
  dueAt:number;
  lastReviewedAt:number;
  learnedAt:number;
  ease:number;
  lapses:number;
  successes:number;
  lastRating:Rating;
  learningStep:number;
  againCount:number;
  hardCount:number;
  goodCount:number;
  easyCount:number;
  lastResponseMs:number;
  starred:boolean;
  suspended:boolean;
  buriedUntil:number;
  manualKnown:boolean;
  note:string;
  stability:number;
  difficulty:number;
  relearning:boolean;
  lastElapsedDays:number;
  fsrsVersion:string;
  fsrsState:FsrsState;
  scheduledDays:number;
  elapsedDays:number;
  retrievability:number;
  lastAnswerIssue:string;
}

export interface CanonicalReviewEventV1 {
  schema:'thiepn-french-review-event-v1';
  eventId:string;
  t:number;
  id:string;
  noteId:string;
  skill:SkillId;
  rating:Exclude<Rating,''>;
  responseMs:number;
  wasNew:boolean;
  intervalDays:number;
  direction:string;
  typed:boolean;
  typedQuality:string;
  level:string;
  pos:string;
  theme:string;
  practice:string;
  correct:boolean;
  xp:number;
  practiceOnly:boolean;
  stability:number;
  difficulty:number;
  retrievability:number;
  scheduledDays:number;
  fsrsState:FsrsState;
  supportLevel?:number;
  firstListen?:boolean;
  playCount?:number;
  playbackRate?:number;
  transcriptUsed?:boolean;
  translationUsed?:boolean;
  errorCategory?:string;
}

export interface CanonicalLearnerStateV1 {
  schema:'thiepn-french-learner-state-v1';
  revision:1;
  migratedAt:number;
  sourceFingerprint:string;
  sourceUpdatedAt:number;
  sourceVersion:string;
  sourceSchema:number;
  settings:Record<string,unknown>;
  profile:Record<string,unknown>;
  studyPlan:Record<string,unknown>;
  promotions:Record<string,unknown>;
  studyDays:string[];
  featureState:Record<string,unknown>;
}

export interface CanonicalUserContentV1 {
  schema:'thiepn-french-user-content-v1';
  userCards:Record<string,unknown>;
  cardEdits:Record<string,unknown>;
  smartDecks:Record<string,unknown>;
  customDecks:Record<string,unknown>;
}

export interface CanonicalMigrationV1 {
  learner:CanonicalLearnerStateV1;
  srs:CanonicalSrsRecordV1[];
  reviews:CanonicalReviewEventV1[];
  userContent:CanonicalUserContentV1;
}
