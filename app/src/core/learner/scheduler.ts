import type { CanonicalSrsRecordV1 } from './model';

export type SchedulerRating='again'|'hard'|'good'|'easy';
export type TypedQuality='none'|'exact'|'close'|'missing-article'|'review'|string;

export interface SchedulerConfig {
  desiredRetention:number;
  maxInterval:number;
  learningSteps:number[];
  relearningSteps:number[];
  autoSuspendLeeches:boolean;
  leechThreshold:number;
}

const DAY_MS=86_400_000;
export const FSRS_WEIGHTS=Object.freeze([
  0.212,1.2931,2.3065,8.2956,6.4133,0.8334,3.0194,0.001,1.8722,
  0.1666,0.796,1.4835,0.0614,0.2629,1.6483,0.6014,1.8729,0.5425,0.0912
]);
const DECAY=-FSRS_WEIGHTS[17];
const FACTOR=Math.pow(.9,1/DECAY)-1;

function clamp(value:number,min:number,max:number):number{return Math.min(max,Math.max(min,value));}
function days(value:number):number{return value*DAY_MS;}

export function initDifficulty(grade:number):number{
  return clamp(FSRS_WEIGHTS[4]-Math.exp(FSRS_WEIGHTS[5]*(grade-1))+1,1,10);
}
function meanReversion(initial:number,current:number):number{
  return clamp(FSRS_WEIGHTS[7]*initial+(1-FSRS_WEIGHTS[7])*current,1,10);
}
export function nextDifficulty(difficulty:number,grade:number):number{
  return meanReversion(initDifficulty(4),difficulty-FSRS_WEIGHTS[6]*(grade-3));
}
export function retrievability(stability:number,elapsedDays:number):number{
  if(!stability)return 0;
  return clamp(Math.pow(1+FACTOR*Math.max(0,elapsedDays)/stability,DECAY),0,1);
}
function nextForgetStability(difficulty:number,stability:number,recall:number):number{
  const next=FSRS_WEIGHTS[11]*Math.pow(Math.max(1,difficulty),-FSRS_WEIGHTS[12])*
    (Math.pow(stability+1,FSRS_WEIGHTS[13])-1)*Math.exp((1-recall)*FSRS_WEIGHTS[14]);
  return clamp(Math.min(next,stability),.05,36500);
}
function nextRecallStability(difficulty:number,stability:number,recall:number,grade:number):number{
  const hardPenalty=grade===2?FSRS_WEIGHTS[15]:1;
  const easyBonus=grade===4?FSRS_WEIGHTS[16]:1;
  const growth=Math.exp(FSRS_WEIGHTS[8])*(11-difficulty)*Math.pow(stability,-FSRS_WEIGHTS[9])*
    (Math.exp((1-recall)*FSRS_WEIGHTS[10])-1)*hardPenalty*easyBonus;
  return clamp(stability*(1+Math.max(0,growth)),stability+.01,36500);
}
export function intervalFromStability(stability:number,retention:number,maxInterval:number):number{
  const interval=(stability/FACTOR)*(Math.pow(clamp(retention,.7,.97),1/DECAY)-1);
  return clamp(Math.max(1,Math.round(interval)),1,maxInterval);
}

function issuePenalty(quality:TypedQuality):number{
  if(quality==='close'||quality==='missing-article')return .82;
  if(quality==='review')return .55;
  return 1;
}

function finish(record:CanonicalSrsRecordV1,settings:SchedulerConfig):CanonicalSrsRecordV1{
  const next={...record};
  if(settings.autoSuspendLeeches&&(next.lapses>=settings.leechThreshold||next.againCount>=settings.leechThreshold+2)){
    next.suspended=true;
  }
  return next;
}

export function scheduleRating(
  old:CanonicalSrsRecordV1,
  rating:SchedulerRating,
  timestamp:number,
  responseMs=0,
  typedQuality:TypedQuality='none',
  settings:SchedulerConfig
):CanonicalSrsRecordV1{
  const grade={again:1,hard:2,good:3,easy:4}[rating]??3;
  const wasNew=old.status==='new'&&old.seen===0;
  const elapsed=old.lastReviewedAt?Math.max(0,(timestamp-old.lastReviewedAt)/DAY_MS):0;
  const previousStability=Math.max(.05,old.stability||old.intervalDays||.05);
  const recall=wasNew?0:retrievability(previousStability,elapsed);
  const initialDifficulty=wasNew?initDifficulty(grade):old.difficulty||5;
  const difficulty=wasNew?initialDifficulty:nextDifficulty(initialDifficulty,grade);
  let stability=wasNew
    ?FSRS_WEIGHTS[grade-1]
    :grade===1
      ?nextForgetStability(difficulty,previousStability,recall)
      :nextRecallStability(difficulty,previousStability,recall,grade);

  stability=Math.max(.05,stability*issuePenalty(typedQuality));

  const base:CanonicalSrsRecordV1={
    ...old,
    seen:old.seen+1,
    lastReviewedAt:timestamp,
    lastRating:rating,
    lastResponseMs:responseMs,
    fsrsVersion:'FSRS-5-compatible',
    difficulty,
    stability,
    retrievability:recall,
    elapsedDays:elapsed,
    lastElapsedDays:elapsed,
    lastAnswerIssue:String(typedQuality).slice(0,50)
  };

  if(grade===1){
    const enteringRelearning=old.status==='learned'||old.fsrsState==='review';
    const inRelearning=enteringRelearning||old.relearning===true||old.fsrsState==='relearning';
    const steps=inRelearning?settings.relearningSteps:settings.learningSteps;
    const step=steps[0]||(inRelearning?10:1);
    return finish({
      ...base,
      status:'learning',
      fsrsState:inRelearning?'relearning':'learning',
      relearning:inRelearning,
      streak:0,
      learningStep:0,
      intervalDays:0,
      scheduledDays:0,
      dueAt:timestamp+step*60_000,
      lapses:old.lapses+(enteringRelearning?1:0),
      againCount:old.againCount+1
    },settings);
  }

  if(wasNew||old.status!=='learned'){
    const steps=old.relearning?settings.relearningSteps:settings.learningSteps;
    const current=Math.max(0,old.learningStep||0);

    if(grade===2){
      const minutes=Math.max(1,Math.round((steps[Math.min(current,Math.max(0,steps.length-1))]||10)*1.5));
      return finish({
        ...base,
        status:'learning',
        fsrsState:old.relearning?'relearning':'learning',
        learningStep:current,
        dueAt:timestamp+minutes*60_000,
        hardCount:old.hardCount+1,
        successes:old.successes+1
      },settings);
    }

    const nextIndex=grade===4?steps.length:current+1;
    if(nextIndex<steps.length){
      const minutes=steps[nextIndex];
      return finish({
        ...base,
        status:'learning',
        fsrsState:old.relearning?'relearning':'learning',
        learningStep:nextIndex,
        dueAt:timestamp+minutes*60_000,
        goodCount:old.goodCount+1,
        successes:old.successes+1
      },settings);
    }
  }

  const interval=intervalFromStability(stability,settings.desiredRetention,settings.maxInterval);
  return finish({
    ...base,
    status:'learned',
    fsrsState:'review',
    relearning:false,
    streak:old.streak+1,
    learningStep:Math.max(settings.learningSteps.length,old.learningStep||0),
    intervalDays:interval,
    scheduledDays:interval,
    dueAt:timestamp+days(interval),
    learnedAt:old.learnedAt||timestamp,
    hardCount:old.hardCount+(grade===2?1:0),
    goodCount:old.goodCount+(grade===3?1:0),
    easyCount:old.easyCount+(grade===4?1:0),
    successes:old.successes+1,
    ease:clamp(3.15-difficulty*.18,1.3,3.2)
  },settings);
}
