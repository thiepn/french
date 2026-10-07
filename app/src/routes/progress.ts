import type { RouteContext } from '../core/types';
import { readCanonicalProgressSnapshot } from '../core/learner/repository';

function number(value:unknown,fallback=0):number{
  const n=Number(value);return Number.isFinite(n)?n:fallback;
}
function text(value:unknown,fallback='—'):string{
  return typeof value==='string'&&value.trim()?value:fallback;
}
function streak(days:string[],now=Date.now()):number{
  const set=new Set(days);
  const cursor=new Date(now);cursor.setHours(0,0,0,0);
  const key=(d:Date)=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  if(!set.has(key(cursor)))cursor.setDate(cursor.getDate()-1);
  let count=0;
  while(set.has(key(cursor))){count++;cursor.setDate(cursor.getDate()-1);}
  return count;
}
function metric(label:string,value:string,detail=''):HTMLElement{
  const card=document.createElement('article');card.className='progress-metric';
  const l=document.createElement('span');l.textContent=label;
  const strong=document.createElement('strong');strong.textContent=value;
  card.append(l,strong);
  if(detail){const small=document.createElement('small');small.textContent=detail;card.append(small);}
  return card;
}

export async function mount({main,signal}:RouteContext):Promise<void>{
  main.innerHTML='<section class="page progress-page"><p class="eyebrow">Evidence on demand</p><h1>Progress</h1><p class="lede">Mastery, review quality and CEFR evidence are calculated only when you open this page.</p><p class="inline-status" data-status>Reading learner evidence…</p><div data-progress></div></section>';
  const host=main.querySelector<HTMLElement>('[data-progress]');
  const status=main.querySelector<HTMLElement>('[data-status]');
  if(!host||!status)return;

  try{
    const snapshot=await readCanonicalProgressSnapshot();
    if(signal.aborted)return;
    const profile=snapshot.learner.profile;
    const promotions=snapshot.learner.promotions;
    const currentLevel=['A1','A2','B1','B2'].filter(level=>{
      const row=promotions[level];
      return row&&typeof row==='object'&&Number((row as Record<string,unknown>).earnedAt)>0;
    }).at(-1)??'—';
    const studyStreak=streak(snapshot.learner.studyDays);
    const xp=Math.max(0,Math.round(number(profile.xp)));
    const scheduled=snapshot.activity.scheduled;
    const practice=snapshot.activity.practiceOnly;

    status.textContent='Updated from canonical learner, SRS and activity stores.';

    const metrics=document.createElement('div');metrics.className='progress-metrics';
    metrics.append(
      metric('Level',currentLevel),
      metric('Words started',snapshot.srs.notes.toLocaleString()),
      metric('Due now',snapshot.srs.due.toLocaleString()),
      metric('30-day accuracy',snapshot.activity.accuracy==null?'—':snapshot.activity.accuracy+'%',scheduled+' scheduled · '+practice+' extra practice'),
      metric('Study streak',studyStreak+' day'+(studyStreak===1?'':'s')),
      metric('XP',xp.toLocaleString())
    );

    const mastery=document.createElement('section');mastery.className='progress-panel';
    const mh=document.createElement('h2');mh.textContent='Mastery state';mastery.append(mh);
    const masteryGrid=document.createElement('div');masteryGrid.className='progress-breakdown';
    for(const [label,value] of [
      ['Learned',snapshot.srs.learned],
      ['Learning',snapshot.srs.learning],
      ['New / queued',snapshot.srs.newCount],
      ['Suspended',snapshot.srs.suspended]
    ] as Array<[string,number]>){
      masteryGrid.append(metric(label,value.toLocaleString()));
    }
    mastery.append(masteryGrid);

    const skill=document.createElement('section');skill.className='progress-panel';
    const sh=document.createElement('h2');sh.textContent='Skill records';skill.append(sh);
    const skillGrid=document.createElement('div');skillGrid.className='skill-progress-grid';
    for(const id of ['recognition','article','production','spelling','listening']){
      const row=document.createElement('div');row.className='skill-progress-row';
      const name=document.createElement('span');name.textContent=id[0].toUpperCase()+id.slice(1);
      const value=document.createElement('strong');value.textContent=String(snapshot.srs.bySkill[id]??0);
      row.append(name,value);skillGrid.append(row);
    }
    skill.append(skillGrid);

    const activity=document.createElement('section');activity.className='progress-panel';
    const ah=document.createElement('h2');ah.textContent='Recent activity';activity.append(ah);
    if(snapshot.activity.last30Days.length){
      const max=Math.max(...snapshot.activity.last30Days.map(day=>day.answers),1);
      const chart=document.createElement('div');chart.className='activity-bars';
      for(const day of snapshot.activity.last30Days){
        const item=document.createElement('div');item.className='activity-day';
        item.title=`${day.day}: ${day.answers} answers · ${day.correct} correct · ${day.xp} XP`;
        const bar=document.createElement('span');bar.className='activity-bar';bar.style.setProperty('--activity-height',String(Math.max(.08,day.answers/max)));
        const label=document.createElement('small');label.textContent=day.day.slice(5);
        item.append(bar,label);chart.append(item);
      }
      activity.append(chart);
    }else{
      const empty=document.createElement('p');empty.className='inline-status';empty.textContent='No review activity in the last 30 days.';activity.append(empty);
    }

    const cefr=document.createElement('section');cefr.className='progress-panel';
    const ch=document.createElement('h2');ch.textContent='CEFR progression';cefr.append(ch);
    const cefrGrid=document.createElement('div');cefrGrid.className='cefr-grid';
    for(const level of ['A1','A2','B1','B2']){
      const raw=promotions[level];
      const row=raw&&typeof raw==='object'?raw as Record<string,unknown>:{};
      const earned=Number(row.earnedAt)>0;
      const card=document.createElement('article');card.className='cefr-card'+(earned?' is-earned':'');
      const l=document.createElement('strong');l.textContent=level;
      const state=document.createElement('span');state.textContent=earned?'Earned':'Not yet earned';
      const detail=document.createElement('small');
      detail.textContent=earned&&Number(row.earnedAt)>0?new Date(Number(row.earnedAt)).toLocaleDateString():text(row.reason,'');
      card.append(l,state,detail);cefrGrid.append(card);
    }
    cefr.append(cefrGrid);

    host.replaceChildren(metrics,mastery,skill,activity,cefr);
  }catch(error){
    if(signal.aborted)return;
    status.textContent='Could not read progress evidence.';
    console.error('French progress snapshot failed',error);
  }
}
