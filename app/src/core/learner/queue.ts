import type { CanonicalReviewEventV1,CanonicalSrsRecordV1 } from './model';

const DAY_MS=86_400_000;

export interface ReviewEvidence {
  reviews:number;
  failures:number;
  issues:number;
  responseCount:number;
  responseTotal:number;
}
export interface QueueCandidate {
  record:CanonicalSrsRecordV1;
  order:number;
  familyKey:string;
  evidence?:ReviewEvidence;
}
export interface QueueOptions {
  now:number;
  leechThreshold:number;
  siblingSpacing:boolean;
  siblingGap?:number;
}

export function evidenceFromEvents(events:CanonicalReviewEventV1[]):Map<string,ReviewEvidence>{
  const map=new Map<string,ReviewEvidence>();
  for(const event of events){
    const current=map.get(event.id)??{reviews:0,failures:0,issues:0,responseCount:0,responseTotal:0};
    current.reviews++;
    if(!event.correct||event.rating==='again')current.failures++;
    if(event.typedQuality&&event.typedQuality!=='exact'&&event.typedQuality!=='none')current.issues++;
    if(event.responseMs>0){current.responseCount++;current.responseTotal+=event.responseMs;}
    map.set(event.id,current);
  }
  return map;
}

export function weaknessScore(
  record:CanonicalSrsRecordV1,
  evidence:ReviewEvidence|undefined,
  now:number
):number{
  const overdue=Math.min(30,Math.max(0,now-record.dueAt)/DAY_MS);
  const reviews=evidence?.reviews??0;
  const failureRate=reviews?(evidence?.failures??0)/reviews:0;
  const issueRate=reviews?(evidence?.issues??0)/reviews:0;
  const avgMs=evidence?.responseCount?(evidence.responseTotal/evidence.responseCount):record.lastResponseMs;
  return (
    overdue*1.7+
    Math.min(10,record.lapses)*6+
    Math.max(0,record.difficulty-5)*5.5+
    Math.max(0,.9-record.retrievability)*32+
    failureRate*18+
    issueRate*10+
    Math.min(8,Math.max(0,avgMs-7000)/3500)+
    (record.lastRating==='again'?7:record.lastRating==='hard'?2.5:0)
  );
}

export function isLeech(record:CanonicalSrsRecordV1,threshold:number):boolean{
  return record.lapses>=threshold||record.againCount>=threshold+2;
}

export function smartPriority(candidate:QueueCandidate,options:QueueOptions):number[]{
  const {record}=candidate;
  const due=record.dueAt>0&&record.dueAt<=options.now?0:record.status==='learning'?1:record.status==='new'?2:3;
  const overdue=Math.max(0,options.now-record.dueAt);
  return [
    due,
    isLeech(record,options.leechThreshold)?-1:0,
    -overdue,
    -weaknessScore(record,candidate.evidence,options.now),
    candidate.order
  ];
}

export function compareTuples(a:number[],b:number[]):number{
  for(let i=0;i<Math.max(a.length,b.length);i++){
    const diff=(a[i]??0)-(b[i]??0);
    if(diff)return diff;
  }
  return 0;
}

export function sortSmartQueue(candidates:QueueCandidate[],options:QueueOptions):QueueCandidate[]{
  const sorted=[...candidates].sort((a,b)=>compareTuples(smartPriority(a,options),smartPriority(b,options)));
  return options.siblingSpacing?spaceSiblingFamilies(sorted,options.siblingGap??4):sorted;
}

export function mixTodayQueue<T>(due:T[],fresh:T[],mode:'due-first'|'new-first'|'interleave'):T[]{
  if(mode==='new-first')return[...fresh,...due];
  if(mode==='interleave'){
    const result:T[]=[],dueCopy=[...due],freshCopy=[...fresh];
    while(dueCopy.length||freshCopy.length){
      for(let i=0;i<3&&dueCopy.length;i++)result.push(dueCopy.shift() as T);
      if(freshCopy.length)result.push(freshCopy.shift() as T);
    }
    return result;
  }
  return[...due,...fresh];
}

export function spaceSiblingFamilies<T extends {familyKey:string}>(items:T[],gap=4):T[]{
  if(items.length<3)return items;
  const pending=[...items],output:T[]=[];
  while(pending.length){
    const recent=new Set(output.slice(-gap).map(item=>item.familyKey));
    let index=pending.findIndex(item=>!recent.has(item.familyKey));
    if(index<0)index=0;
    output.push(pending.splice(index,1)[0]);
  }
  return output;
}
