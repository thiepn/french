import type { RouteContext } from '../core/types';
import { readCanonicalProgressSnapshot } from '../core/learner/repository';

function number(value:unknown,fallback=0):number{
  const n=Number(value);return Number.isFinite(n)?n:fallback;
}
function percent(value:number,total:number):number{
  return total?Math.round(value/total*100):0;
}

export async function mount({main,signal}:RouteContext):Promise<void>{
  main.innerHTML='<section class="page progress-page"><p class="eyebrow">Learning evidence</p><h1>Progress</h1><p class="lede">CEFR progression, Skill records, mastery evidence, and 30-day accuracy are calculated only when this page opens.</p><p class="inline-status" data-status>Reading learner evidence…</p><div data-content></div></section>';
  const status=main.querySelector<HTMLElement>('[data-status]');
  const host=main.querySelector<HTMLElement>('[data-content]');
  if(!status||!host)return;

  try{
    const snapshot=await readCanonicalProgressSnapshot();
    if(signal.aborted)return;

    const profile=snapshot.learner.profile;
    const currentLevel=Object.entries(snapshot.learner.promotions)
      .filter(([,value])=>value&&typeof value==='object'&&Number((value as Record<string,unknown>).earnedAt)>0)
      .map(([level])=>level)
      .at(-1)??'—';
    const xp=Math.max(0,Math.round(number(profile.xp)));
    const lifetimeAnswers=Math.max(snapshot.activity.total,Math.round(number(profile.lifetimeAnswers)));
    const learnedShare=percent(snapshot.srs.learned,snapshot.srs.total);
    const accuracy=snapshot.activity.accuracy;

    status.textContent=snapshot.srs.total
      ?snapshot.srs.notes.toLocaleString()+' vocabulary notes · '+snapshot.srs.total.toLocaleString()+' scheduled skill records'
      :'No study evidence yet.';

    const metrics=document.createElement('div');metrics.className='progress-metrics';
    const metric=(label:string,value:string,detail:string)=>{
      const card=document.createElement('article');card.className='progress-metric';
      const l=document.createElement('span');l.textContent=label;
      const v=document.createElement('strong');v.textContent=value;
      const d=document.createElement('small');d.textContent=detail;
      card.append(l,v,d);metrics.append(card);
    };
    metric('Level',currentLevel,'earned CEFR promotion');
    metric('Learned',learnedShare+'%',snapshot.srs.learned.toLocaleString()+' skill records in review state');
    metric('Due',snapshot.srs.due.toLocaleString(),'scheduled now');
    metric('30-day accuracy',accuracy==null?'—':accuracy+'%',snapshot.activity.total.toLocaleString()+' recent answers');
    metric('XP',xp.toLocaleString(),lifetimeAnswers.toLocaleString()+' lifetime answers');
    metric('Practice',snapshot.activity.practiceOnly.toLocaleString(),'adaptive reinforcement answers');

    const mastery=document.createElement('section');mastery.className='progress-section';
    const masteryHeading=document.createElement('h2');masteryHeading.textContent='Memory state';
    const masteryRows=document.createElement('div');masteryRows.className='progress-bars';
    const addBar=(label:string,value:number,total:number)=>{
      const row=document.createElement('div');row.className='progress-bar-row';
      const header=document.createElement('div');header.className='progress-bar-head';
      const name=document.createElement('span');name.textContent=label;
      const amount=document.createElement('strong');amount.textContent=value.toLocaleString();
      header.append(name,amount);
      const track=document.createElement('div');track.className='progress-bar-track';
      const fill=document.createElement('span');fill.style.width=Math.min(100,percent(value,total))+'%';track.append(fill);
      row.append(header,track);masteryRows.append(row);
    };
    const total=Math.max(1,snapshot.srs.total);
    addBar('Learned',snapshot.srs.learned,total);
    addBar('Learning',snapshot.srs.learning,total);
    addBar('New',snapshot.srs.newCount,total);
    addBar('Suspended',snapshot.srs.suspended,total);
    mastery.append(masteryHeading,masteryRows);

    const skills=document.createElement('section');skills.className='progress-section';
    const skillHeading=document.createElement('h2');skillHeading.textContent='Skill coverage';
    const skillGrid=document.createElement('div');skillGrid.className='skill-grid';
    for(const skill of ['recognition','article','production','spelling','listening']){
      const card=document.createElement('article');card.className='skill-card';
      const label=document.createElement('span');label.textContent=skill;
      const value=document.createElement('strong');value.textContent=(snapshot.srs.bySkill[skill]??0).toLocaleString();
      card.append(label,value);skillGrid.append(card);
    }
    skills.append(skillHeading,skillGrid);

    const activity=document.createElement('section');activity.className='progress-section';
    const activityHeading=document.createElement('h2');activityHeading.textContent='Last 30 days';
    const dayGrid=document.createElement('div');dayGrid.className='activity-days';
    if(snapshot.activity.last30Days.length){
      const max=Math.max(...snapshot.activity.last30Days.map(day=>day.answers),1);
      for(const day of snapshot.activity.last30Days){
        const cell=document.createElement('div');cell.className='activity-day';
        cell.style.setProperty('--activity',String(day.answers/max));
        cell.title=day.day+' · '+day.answers+' answers · '+day.correct+' correct · '+day.xp+' XP';
        const count=document.createElement('strong');count.textContent=String(day.answers);
        const label=document.createElement('span');label.textContent=day.day.slice(5);
        cell.append(count,label);dayGrid.append(cell);
      }
    }else{
      const empty=document.createElement('p');empty.className='inline-status';empty.textContent='No review activity in the last 30 days.';dayGrid.append(empty);
    }
    activity.append(activityHeading,dayGrid);

    host.replaceChildren(metrics,mastery,skills,activity);
  }catch(error){
    if(signal.aborted)return;
    status.textContent='Could not read progress evidence.';
    console.error('French progress snapshot failed',error);
  }
}
