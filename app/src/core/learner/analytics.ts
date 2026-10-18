import {
  ensureCanonicalLearnerState,
  readAllSrsRecords,
  readReviewEventsSince
} from './repository';
import { loadVocabularySearchIndex } from '../content/loader';
import type { CanonicalReviewEventV1,CanonicalSrsRecordV1,SkillId } from './model';

const DAY=86_400_000;
const SKILLS:SkillId[]=['recognition','article','production','spelling','listening'];

function dayKey(timestamp:number):string{
  const d=new Date(timestamp);
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}
function percent(a:number,b:number):number{return b?Math.round(a/b*100):0;}
function object(value:unknown):Record<string,unknown>{
  return value&&typeof value==='object'&&!Array.isArray(value)?value as Record<string,unknown>:{};
}
function scheduled(events:CanonicalReviewEventV1[]):CanonicalReviewEventV1[]{
  return events.filter(event=>event.practiceOnly!==true);
}

export interface ProgressSnapshot {
  currentLevel:string;
  streakDays:number;
  xp:number;
  totalCorpus:number;
  startedNotes:number;
  learnedRecognition:number;
  dueNow:number;
  suspended:number;
  review30:{count:number;accuracy:number;averageMs:number};
  review7:{count:number;accuracy:number};
  daily:Array<{day:string;count:number;correct:number}>;
  skills:Array<{skill:SkillId;started:number;learned:number;due:number;accuracy:number;reviews:number}>;
  levels:Array<{level:string;total:number;started:number;learned:number}>;
  weak:Array<{id:string;noteId:string;skill:SkillId;lapses:number;difficulty:number;retrievability:number;dueAt:number}>;
  promotions:Array<{level:string;earned:boolean;earnedAt:number}>;
}

export async function loadProgressSnapshot(now=Date.now()):Promise<ProgressSnapshot>{
  const start30=now-30*DAY,start7=now-7*DAY;
  const [learner,srs,reviews,index]=await Promise.all([
    ensureCanonicalLearnerState(),
    readAllSrsRecords(),
    readReviewEventsSince(start30,50_000),
    loadVocabularySearchIndex()
  ]);
  const scheduled30=scheduled(reviews);
  const scheduled7=scheduled30.filter(row=>row.t>=start7);
  const noteRows=new Map<string,CanonicalSrsRecordV1[]>();
  for(const row of srs){
    const bucket=noteRows.get(row.noteId)??[];
    bucket.push(row);noteRows.set(row.noteId,bucket);
  }
  const startedNotes=[...noteRows.entries()].filter(([,rows])=>rows.some(row=>row.seen>0||row.status!=='new')).length;
  const learnedRecognition=srs.filter(row=>row.skill==='recognition'&&row.status==='learned').length;
  const dueNow=srs.filter(row=>row.status!=='new'&&!row.suspended&&row.dueAt>0&&row.dueAt<=now).length;
  const suspended=srs.filter(row=>row.suspended).length;
  const correctness=(rows:CanonicalReviewEventV1[])=>rows.filter(row=>row.correct&&row.rating!=='again').length;
  const averageMs=scheduled30.length?Math.round(scheduled30.reduce((sum,row)=>sum+row.responseMs,0)/scheduled30.length):0;

  const daily:Array<{day:string;count:number;correct:number}>=[];
  for(let offset=13;offset>=0;offset--){
    const d=new Date(now-offset*DAY);d.setHours(0,0,0,0);
    const key=dayKey(d.getTime());
    const rows=scheduled30.filter(row=>dayKey(row.t)===key);
    daily.push({day:key,count:rows.length,correct:correctness(rows)});
  }

  const skills=SKILLS.map(skill=>{
    const rows=srs.filter(row=>row.skill===skill);
    const evidence=scheduled30.filter(row=>row.skill===skill);
    return{
      skill,
      started:rows.filter(row=>row.seen>0||row.status!=='new').length,
      learned:rows.filter(row=>row.status==='learned').length,
      due:rows.filter(row=>row.status!=='new'&&!row.suspended&&row.dueAt>0&&row.dueAt<=now).length,
      accuracy:percent(correctness(evidence),evidence.length),
      reviews:evidence.length
    };
  });

  const levelTotals=new Map<string,number>();
  const levelStarted=new Map<string,number>();
  const levelLearned=new Map<string,number>();
  for(const meta of index.rows){
    const level=meta.level||'Other';
    levelTotals.set(level,(levelTotals.get(level)??0)+1);
    const rows=noteRows.get(meta.id)??[];
    if(rows.some(row=>row.seen>0||row.status!=='new'))levelStarted.set(level,(levelStarted.get(level)??0)+1);
    if(rows.some(row=>row.skill==='recognition'&&row.status==='learned'))levelLearned.set(level,(levelLearned.get(level)??0)+1);
  }
  const order=['A1','A2','B1','B2','C1','C2','Other'];
  const levels=order.filter(level=>levelTotals.has(level)).map(level=>({
    level,total:levelTotals.get(level)??0,started:levelStarted.get(level)??0,learned:levelLearned.get(level)??0
  }));

  const weak=srs
    .filter(row=>row.seen>0&&!row.suspended)
    .sort((a,b)=>
      (b.lapses-a.lapses)||
      (b.difficulty-a.difficulty)||
      (a.retrievability-b.retrievability)||
      (a.dueAt-b.dueAt)
    )
    .slice(0,12)
    .map(row=>({id:row.id,noteId:row.noteId,skill:row.skill,lapses:row.lapses,difficulty:row.difficulty,retrievability:row.retrievability,dueAt:row.dueAt}));

  const profile=object(learner.profile),promotions=object(learner.promotions);
  const promotionRows=['A1','A2','B1','B2'].map(level=>{
    const row=object(promotions[level]);
    return{level,earned:Number(row.earnedAt)>0,earnedAt:Number(row.earnedAt)||0};
  });
  let currentLevel='';
  for(const row of promotionRows)if(row.earned)currentLevel=row.level;

  return{
    currentLevel,
    streakDays:(()=>{
      const days=new Set(learner.studyDays),cursor=new Date(now);cursor.setHours(0,0,0,0);
      const fmt=(d:Date)=>dayKey(d.getTime());
      if(!days.has(fmt(cursor)))cursor.setDate(cursor.getDate()-1);
      let streak=0;while(days.has(fmt(cursor))){streak++;cursor.setDate(cursor.getDate()-1);}return streak;
    })(),
    xp:Math.max(0,Math.round(Number(profile.xp)||0)),
    totalCorpus:index.rows.length,
    startedNotes,
    learnedRecognition,
    dueNow,
    suspended,
    review30:{count:scheduled30.length,accuracy:percent(correctness(scheduled30),scheduled30.length),averageMs},
    review7:{count:scheduled7.length,accuracy:percent(correctness(scheduled7),scheduled7.length)},
    daily,skills,levels,weak,promotions:promotionRows
  };
}
