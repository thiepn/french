import type {CanonicalLearnerStateV1,CanonicalSrsRecordV1,CanonicalReviewEventV1} from '../learner/model';

/**
 * Read-only input adapter for the EXISTING P8 language-read-model consumer.
 * This does not publish anything. Never pass raw events, private cards, drafts,
 * Account IDs, answers or review histories through the Hub boundary.
 */
function localDay(time:number):string{
 const d=new Date(time);
 return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
}
function streak(days:readonly string[],now:number):number{
 const keys=new Set(days);
 const date=new Date(now);date.setHours(0,0,0,0);
 if(!keys.has(localDay(date.getTime())))date.setDate(date.getDate()-1);
 let count=0;
 for(let i=0;i<366&&keys.has(localDay(date.getTime()));i++){count++;date.setDate(date.getDate()-1);}
 return count;
}
export function prepareFrenchHubReadModelInput(
 learner:CanonicalLearnerStateV1|null,
 records:readonly CanonicalSrsRecordV1[],
 events:readonly CanonicalReviewEventV1[],now=Date.now()
){
 const scheduled=records.filter(x=>x.status!=='new'&&!x.suspended&&(!x.buriedUntil||x.buriedUntil<=now));
 const due=scheduled.filter(x=>x.dueAt>0&&x.dueAt<=now).length;
 const newCount=records.filter(x=>x.status==='new'&&!x.suspended).length;
 const since=now-7*86400000;
 const recent=events.filter(x=>x.t>=since&&x.t<=now);
 const today=recent.filter(x=>localDay(x.t)===localDay(now)).length;
 const last=events.reduce((n,x)=>Math.max(n,Number(x.t)||0),0);
 const stats={due,newCount,today,recent:recent.length,streak:streak(learner?.studyDays??[],now)};
 // Hub consumer itself validates the P8 schema. This input has no identity or raw activity fields.
 return {
  generatedAt:new Date(now).toISOString(),
  appId:'french',languageId:'fr',producerRevision:'u49-native-candidate',
  presentation:{displayName:'French',nativeName:'Français',appRoute:'https://french.thiepn.dev/'},
  enrollment:{status:'active' as const},
  workload:{dueItems:stats.due,newItems:stats.newCount,practiceItems:0,courseItems:0,
   totalItems:stats.due+stats.newCount},
  activity:{todayEvents:stats.today,sevenDayEvents:stats.recent,streakDays:stats.streak,
   lastStudiedAt:last>0?new Date(last).toISOString():null},
  progress:{metrics:[{id:'scheduled-reviews',label:'Scheduled reviews',current:scheduled.length,unit:'cards'}]},
  proficiency:{framework:'CEFR',claim:'none' as const,maintenanceNeeded:false,dimensions:[]},
  nextAction:stats.due>0?{id:'review',label:'Review due French cards',kind:'review' as const,route:'/#review',priority:90}:
   stats.newCount>0?{id:'learn',label:'Learn available French words',kind:'learn' as const,route:'/#learn',priority:65}:
    {id:'course',label:'Continue French course',kind:'course' as const,route:'/#course',priority:40}
 };
}
