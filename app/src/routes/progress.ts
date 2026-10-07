import type { RouteContext } from '../core/types';
import { countDueSrs,readCanonicalLearnerState,readRecentReviewEvents } from '../core/learner/repository';
import type { CanonicalReviewEventV1 } from '../core/learner/model';

function number(value:unknown,fallback=0):number{const n=Number(value);return Number.isFinite(n)?n:fallback;}
function percent(value:number,total:number):number{return total?Math.round(value/total*100):0;}
function dayKey(timestamp:number):string{
  const d=new Date(timestamp);
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}
function scheduled(events:CanonicalReviewEventV1[]):CanonicalReviewEventV1[]{return events.filter(event=>event.practiceOnly!==true);}

export async function mount({main}:RouteContext):Promise<void>{
  main.innerHTML='<section class="page progress-page"><p class="eyebrow">Learning evidence</p><h1>Progress</h1><p class="lede">Your study history is read from the canonical learner store only when this page opens.</p><div class="inline-status" data-status>Calculating progress…</div><div data-progress></div></section>';
  const host=main.querySelector<HTMLElement>('[data-progress]');
  const status=main.querySelector<HTMLElement>('[data-status]');
  if(!host||!status)return;

  const now=Date.now();
  const [learner,recent,due]=await Promise.all([
    readCanonicalLearnerState(),
    readRecentReviewEvents(3000),
    countDueSrs(now)
  ]);
  const events=scheduled(recent);
  const last7=events.filter(event=>event.t>=now-7*86_400_000);
  const last30=events.filter(event=>event.t>=now-30*86_400_000);
  const profile=learner?.profile??{};
  const lifetimeAnswers=Math.max(events.length,Math.round(number(profile.lifetimeAnswers,0)));
  const lifetimeCorrect=Math.max(events.filter(event=>event.correct).length,Math.round(number(profile.lifetimeCorrect,0)));
  const accuracy7=percent(last7.filter(event=>event.correct).length,last7.length);
  const accuracy30=percent(last30.filter(event=>event.correct).length,last30.length);
  const xp=Math.round(number(profile.xp,events.reduce((sum,event)=>sum+number(event.xp,0),0)));
  const bestCombo=Math.round(number(profile.bestCombo,0));

  const lastDays:string[]=[];
  const activity=new Map<string,number>();
  for(let offset=6;offset>=0;offset--){
    const date=new Date(now);date.setHours(0,0,0,0);date.setDate(date.getDate()-offset);
    const key=dayKey(date.getTime());lastDays.push(key);activity.set(key,0);
  }
  for(const event of last7){
    const key=dayKey(event.t);
    if(activity.has(key))activity.set(key,(activity.get(key)??0)+1);
  }
  const maxDay=Math.max(1,...activity.values());

  const skillCounts=new Map<string,{total:number;correct:number}>();
  for(const event of last30){
    const key=event.skill||'recognition';
    const row=skillCounts.get(key)??{total:0,correct:0};
    row.total++;if(event.correct)row.correct++;skillCounts.set(key,row);
  }

  host.replaceChildren();
  const summary=document.createElement('div');summary.className='progress-grid';
  const cards:Array<[string,string,string]>=[
    ['Due now',String(due),'Scheduled retrieval'],
    ['7-day accuracy',accuracy7+'%',last7.length+' scheduled answers'],
    ['30-day accuracy',accuracy30+'%',last30.length+' scheduled answers'],
    ['Lifetime',String(lifetimeAnswers),percent(lifetimeCorrect,lifetimeAnswers)+'% correct'],
    ['XP',xp.toLocaleString(),'Practice evidence'],
    ['Best combo',String(bestCombo),'Consecutive correct']
  ];
  for(const [label,value,detail] of cards){
    const card=document.createElement('article');card.className='stat-card';
    const small=document.createElement('span');small.textContent=label;
    const strong=document.createElement('strong');strong.textContent=value;
    const p=document.createElement('p');p.textContent=detail;
    card.append(small,strong,p);summary.append(card);
  }

  const activityPanel=document.createElement('section');activityPanel.className='data-panel';
  const activityTitle=document.createElement('h2');activityTitle.textContent='Last 7 days';
  const bars=document.createElement('div');bars.className='activity-bars';
  for(const key of lastDays){
    const count=activity.get(key)??0;
    const item=document.createElement('div');item.className='activity-day';
    const bar=document.createElement('div');bar.className='activity-bar';
    bar.style.height=Math.max(6,Math.round(count/maxDay*100))+'%';
    bar.title=count+' answers';
    const label=document.createElement('span');label.textContent=new Date(key+'T12:00:00').toLocaleDateString(undefined,{weekday:'short'});
    const value=document.createElement('small');value.textContent=String(count);
    item.append(bar,label,value);bars.append(item);
  }
  activityPanel.append(activityTitle,bars);

  const skills=document.createElement('section');skills.className='data-panel';
  const skillsTitle=document.createElement('h2');skillsTitle.textContent='30-day skill mix';
  const skillList=document.createElement('div');skillList.className='skill-list';
  if(!skillCounts.size){
    const empty=document.createElement('p');empty.className='muted-copy';empty.textContent='No scheduled reviews in the last 30 days yet.';skillList.append(empty);
  }else{
    for(const [skill,row] of [...skillCounts.entries()].sort((a,b)=>b[1].total-a[1].total)){
      const line=document.createElement('div');line.className='skill-row';
      const name=document.createElement('strong');name.textContent=skill;
      const detail=document.createElement('span');detail.textContent=row.total+' answers · '+percent(row.correct,row.total)+'% correct';
      line.append(name,detail);skillList.append(line);
    }
  }
  skills.append(skillsTitle,skillList);
  host.append(summary,activityPanel,skills);
  status.textContent=(learner?.studyDays.length??0)+' active study days recorded · analytics loaded on demand.';
}
