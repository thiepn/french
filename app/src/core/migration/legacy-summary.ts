import type { JsonObject } from './legacy-contract';
import type { HydratedLearnerState } from '../storage/hydrate';

function object(value:unknown):JsonObject {
  return value&&typeof value==='object'&&!Array.isArray(value)?value as JsonObject:{};
}

function dueCount(payload:JsonObject,now=Date.now()):number {
  const progress=object(payload.progress);
  let count=0;
  for(const raw of Object.values(progress)){
    const row=object(raw);
    const status=String(row.status??'new');
    const due=Number(row.due)||0;
    if(status!=='new'&&row.suspended!==true&&due>0&&due<=now) count++;
  }
  return count;
}

function streakDays(payload:JsonObject,now=Date.now()):number {
  const source=Array.isArray(payload.studyDays)?payload.studyDays.filter(v=>typeof v==='string') as string[]:[];
  const days=new Set(source);
  if(!days.size) return 0;

  const fmt=(value:number)=>{
    const d=new Date(value);
    const y=d.getFullYear(),m=String(d.getMonth()+1).padStart(2,'0'),day=String(d.getDate()).padStart(2,'0');
    return `${y}-${m}-${day}`;
  };

  let cursor=new Date(now);cursor.setHours(0,0,0,0);
  if(!days.has(fmt(cursor.getTime()))) cursor.setDate(cursor.getDate()-1);

  let streak=0;
  while(days.has(fmt(cursor.getTime()))){
    streak++;
    cursor.setDate(cursor.getDate()-1);
  }
  return streak;
}

function earnedLevel(payload:JsonObject):string|undefined {
  const progression=object(payload.v5160Progression);
  const promotions=object(progression.promotions);
  const levels=['A1','A2','B1','B2'];
  let earned:string|undefined;
  for(const level of levels){
    const row=object(promotions[level]);
    if(Number(row.earnedAt)>0) earned=level;
    else break;
  }
  return earned;
}

export function legacySummary(payload:JsonObject):HydratedLearnerState {
  return {
    currentLevel:earnedLevel(payload),
    dueCount:dueCount(payload),
    streakDays:streakDays(payload)
  };
}
