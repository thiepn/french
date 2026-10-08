import type {UsagePack,UsageRecord} from '../content/loader';
import type {UsageAttempt,UsageMode,UsageState,UsageTally} from './session';

const DAY=86_400_000;
export const USAGE_SECURE_ATTEMPTS=3; // P35 P9
export const USAGE_SECURE_ACCURACY=.8;
export const USAGE_REFRESH_DAYS=60;
export const TRANSFER_SECURE_ATTEMPTS=2; // P35 P11
export const TRANSFER_SECURE_ACCURACY=.8;
export const REPAIR_ERROR_DAYS=120;

export type MasteryStatus='unseen'|'building'|'secure'|'refresh';
export interface UsageMastery{
  attempts:number;independentExact:number;accuracy:number;
  lastAt:number;lastIndependent:boolean;status:MasteryStatus;secure:boolean;
}
export interface TransferMastery extends UsageMastery{
  ready:boolean;distinctVariants:number;
}
export interface UsageRecordMastery{
  usage:UsageMastery;transfer:TransferMastery;
  lastError:string|null;repairNeeded:boolean;errors120d:number;
}
export interface RankedUsageCandidate{
  record:UsageRecord;score:number;reason:string;mastery:UsageRecordMastery;
}
function validTime(at:number,now:number):boolean{return Number.isSafeInteger(at)&&at>=0&&at<=now+DAY;}
function independentExact(event:UsageAttempt):boolean{
  return event.outcome==='matched'&&event.diagnosis==='exact'&&event.support===0;
}
function performance(events:UsageAttempt[],min:number,refreshDays:number,now:number):UsageMastery{
  const ordered=events.filter(e=>validTime(e.at,now)).sort((a,b)=>a.at-b.at);
  const attempts=ordered.length,independentExactCount=ordered.filter(independentExact).length;
  const accuracy=attempts?independentExactCount/attempts:0,last=ordered.at(-1);
  const lastAt=last?.at??0,lastIndependent=Boolean(last&&independentExact(last));
  const qualified=attempts>=min&&accuracy>=.8&&lastIndependent;
  const stale=lastAt>0&&now-lastAt>refreshDays*DAY;
  const secure=qualified&&!stale;
  return {attempts,independentExact:independentExactCount,accuracy,lastAt,lastIndependent,
    status:secure?'secure':stale&&attempts>=min&&accuracy>=.8?'refresh':attempts?'building':'unseen',secure};
}

function talliedUsage(state:UsageState,recordId:string,mode:UsageMode):UsageTally|undefined{
  return state.tallies?.[recordId]?.[mode];
}
function combinedPerformance(state:UsageState,recordId:string,modes:UsageMode[],min:number,refreshDays:number,now:number):UsageMastery{
  const totals=modes.map(mode=>talliedUsage(state,recordId,mode)).filter((row):row is UsageTally=>Boolean(row));
  if(!totals.length){
    return performance(state.history.filter(e=>e.recordId===recordId&&modes.includes(e.mode)),min,refreshDays,now);
  }
  const attempts=totals.reduce((n,row)=>n+row.attempts,0);
  const independentExactCount=totals.reduce((n,row)=>n+row.exact,0);
  const last=totals.reduce<UsageTally|undefined>((best,row)=>!best||row.lastAt>best.lastAt?row:best,undefined);
  const lastAt=last?.lastAt??0,lastIndependent=Boolean(last?.lastIndependent);
  const accuracy=attempts?independentExactCount/attempts:0,stale=lastAt>0&&now-lastAt>refreshDays*DAY;
  const qualified=attempts>=min&&accuracy>=.8&&lastIndependent;
  const secure=qualified&&!stale;
  return {attempts,independentExact:independentExactCount,accuracy,lastAt,lastIndependent,
    status:secure?'secure':stale&&attempts>=min&&accuracy>=.8?'refresh':attempts?'building':'unseen',secure};
}
export function usageRecordMastery(recordId:string,state:UsageState,now=Date.now()):UsageRecordMastery{
  const own=state.history.filter(e=>e.recordId===recordId&&validTime(e.at,now));
  // P35 P10 usage evidence includes recognition of verified construction and
  // its full-frame production, but only independent exact native evidence
  // can count as a success. Never interpret self-assessment as certainty.
  const usage=combinedPerformance(state,recordId,['usage','production'],USAGE_SECURE_ATTEMPTS,USAGE_REFRESH_DAYS,now);
  const transferEvents=own.filter(e=>e.mode==='transfer');
  const basis=combinedPerformance(state,recordId,['transfer'],TRANSFER_SECURE_ATTEMPTS,3650,now);
  const mask=talliedUsage(state,recordId,'transfer')?.variantMask??transferEvents.filter(independentExact).reduce((n,e)=>n|(1<<(e.variant??0)),0);
  const distinctVariants=[0,1,2].filter(bit=>(mask&(1<<bit))!==0).length;
  // P35 also allowed scheduled-vocabulary production mastery as a prerequisite.
  // C3 does not infer that from the frame's anchor string (ambiguous senses).
  const ready=usage.secure||usage.attempts>=2;
  const transferSecure=ready&&basis.secure&&distinctVariants>=2;
  const transfer:TransferMastery={...basis,ready,distinctVariants,
    secure:transferSecure,status:transferSecure?'secure':basis.attempts?'building':'unseen'};
  const sorted=[...own].sort((a,b)=>b.at-a.at);
  const snapshot=Object.values(state.tallies?.[recordId]??{}).sort((a,b)=>b.lastAt-a.lastAt)[0];
  const latest=sorted[0];
  const lastIndependent=latest?independentExact(latest):snapshot?.lastIndependent??false;
  const lastOutcome=latest?.outcome??snapshot?.lastOutcome??'matched';
  const priorError=sorted.slice(1).some(e=>!independentExact(e));
  const repairNeeded=!lastIndependent&&(lastOutcome!=='self-assessed'||priorError);
  const lastError=repairNeeded?latest?.diagnosis??snapshot?.lastDiagnosis??null:null;
  const errors120d=own.filter(e=>e.at>=now-REPAIR_ERROR_DAYS*DAY&&!independentExact(e)).length;
  return {usage,transfer,lastError,repairNeeded,errors120d};
}
export function transferCueVariant(state:UsageState,recordId:string):0|1|2{
  const count=talliedUsage(state,recordId,'transfer')?.attempts??state.history.filter(e=>e.recordId===recordId&&e.mode==='transfer').length;
  return (count%3) as 0|1|2;
}
export function rankUsageCandidates(pack:Pick<UsagePack,'records'>,state:UsageState,mode:UsageMode,now=Date.now()):RankedUsageCandidate[]{
  const result:RankedUsageCandidate[]=[];
  for(const [order,record] of pack.records.entries()){
    const mastery=usageRecordMastery(record.id,state,now);
    if(mode==='repair'&&!mastery.repairNeeded)continue;
    // P35 P11 transfer depended on prior usage / known vocabulary. Without a
    // trustworthy exact vocabulary ID map, gate on this frame's native evidence.
    if(mode==='transfer'&&!mastery.transfer.ready)continue;
    if(mode==='production'&&mastery.usage.attempts<1)continue;
    let score=0,reason='';
    if(mode==='repair'){
      score=260+Math.min(100,mastery.errors120d*18)+
        (mastery.lastError==='connector'?10:0);
      reason='Resolve '+(mastery.lastError??'an unverified construction');
    }else if(mode==='transfer'){
      score=(mastery.transfer.secure?0:160)+
        (mastery.transfer.attempts===0?40:Math.max(0,24-mastery.transfer.attempts*4))+
        (mastery.usage.secure?12:0);
      reason=mastery.transfer.secure?'Maintain transfer':'Build independent transfer across cues';
    }else{
      score=mastery.usage.status==='refresh'?180:
        mastery.usage.secure?0:mastery.usage.status==='building'?170:130;
      score+=mastery.repairNeeded?22:0;
      score+=Math.max(0,24-Math.min(24,mastery.usage.attempts*4));
      reason=mastery.usage.status==='refresh'?'Refresh a stale construction':
        mastery.usage.secure?'Maintain a secure construction':
        mastery.usage.status==='building'?'Continue building usage accuracy':'Start a verified construction';
    }
    // Source-order tie-break is stable across devices and refreshes.
    result.push({record,score:score-order/10000,reason,mastery});
  }
  return result.sort((a,b)=>b.score-a.score||a.record.id.localeCompare(b.record.id));
}
export function usageAggregate(pack:Pick<UsagePack,'records'>,state:UsageState,now=Date.now()){
  let usageSecure=0,transferReady=0,transferSecure=0,refresh=0,repair=0,practised=0;
  const errorCounts:Record<string,number>={};
  for(const r of pack.records){
    const m=usageRecordMastery(r.id,state,now);
    if(m.usage.attempts)practised++;
    if(m.usage.secure)usageSecure++;
    if(m.usage.status==='refresh')refresh++;
    if(m.transfer.ready)transferReady++;
    if(m.transfer.secure)transferSecure++;
    if(m.repairNeeded){repair++;if(m.lastError)errorCounts[m.lastError]=(errorCounts[m.lastError]??0)+1;}
  }
  return {sourceFrames:pack.records.length,practised,usageSecure,transferReady,transferSecure,refresh,repair,
    topErrors:Object.entries(errorCounts).sort((a,b)=>b[1]-a[1]).slice(0,3)};
}
