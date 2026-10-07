import type { RouteContext } from '../core/types';
import { loadProgressSnapshot } from '../core/learner/analytics';

function pct(value:number,total:number):number{return total?Math.round(value/total*100):0;}
function labelSkill(skill:string):string{
  return({recognition:'Recognition',article:'Articles',production:'Production',spelling:'Spelling',listening:'Listening'} as Record<string,string>)[skill]??skill;
}
function formatMs(ms:number):string{
  if(!ms)return'—';return ms<1000?ms+' ms':(ms/1000).toFixed(ms>=10_000?0:1)+' s';
}

export async function mount({main,signal}:RouteContext):Promise<void>{
  main.innerHTML='<section class="page progress-page"><p class="eyebrow">Evidence on demand</p><h1>Progress</h1><p class="lede">Loading canonical mastery, review evidence, and CEFR progression…</p><div class="inline-status">Reading local study history…</div></section>';
  const snapshot=await loadProgressSnapshot();
  if(signal.aborted)return;

  const maxDaily=Math.max(1,...snapshot.daily.map(row=>row.count));
  main.innerHTML=`
  <section class="page progress-page">
    <p class="eyebrow">Evidence on demand</p>
    <h1>Progress</h1>
    <p class="lede">Longitudinal evidence is computed only when this page opens; it never increases startup cost.</p>

    <div class="progress-metrics">
      <article><span>Current CEFR</span><strong>${snapshot.currentLevel||'—'}</strong></article>
      <article><span>Study streak</span><strong>${snapshot.streakDays}d</strong></article>
      <article><span>XP</span><strong>${snapshot.xp.toLocaleString()}</strong></article>
      <article><span>Due now</span><strong>${snapshot.dueNow.toLocaleString()}</strong></article>
      <article><span>7-day accuracy</span><strong>${snapshot.review7.count?snapshot.review7.accuracy+'%':'—'}</strong></article>
      <article><span>30-day reviews</span><strong>${snapshot.review30.count.toLocaleString()}</strong></article>
    </div>

    <section class="progress-panel">
      <div class="progress-heading"><div><p class="eyebrow">Corpus coverage</p><h2>${snapshot.learnedRecognition.toLocaleString()} learned / ${snapshot.totalCorpus.toLocaleString()} words</h2></div><strong>${pct(snapshot.learnedRecognition,snapshot.totalCorpus)}%</strong></div>
      <div class="coverage-bar"><span style="width:${pct(snapshot.learnedRecognition,snapshot.totalCorpus)}%"></span></div>
      <div class="level-progress-grid">
        ${snapshot.levels.map(row=>`<article><div><strong>${row.level}</strong><span>${row.learned.toLocaleString()} learned · ${row.started.toLocaleString()} started / ${row.total.toLocaleString()}</span></div><div class="coverage-bar"><span style="width:${pct(row.learned,row.total)}%"></span></div></article>`).join('')}
      </div>
    </section>

    <section class="progress-panel">
      <div class="progress-heading"><div><p class="eyebrow">Last 14 days</p><h2>Study activity</h2></div><span>${snapshot.review30.accuracy}% accuracy · ${formatMs(snapshot.review30.averageMs)} average response</span></div>
      <div class="activity-bars" aria-label="Reviews per day">
        ${snapshot.daily.map(row=>`<div title="${row.day}: ${row.count} reviews"><span style="height:${Math.max(4,Math.round(row.count/maxDaily*100))}%"></span><small>${row.day.slice(5)}</small></div>`).join('')}
      </div>
    </section>

    <section class="progress-panel">
      <div class="progress-heading"><div><p class="eyebrow">Skill memory</p><h2>Adaptive progression</h2></div></div>
      <div class="skill-progress-grid">
        ${snapshot.skills.map(row=>`<article><header><strong>${labelSkill(row.skill)}</strong><span>${row.reviews?row.accuracy+'% recent':'No recent reviews'}</span></header><div class="skill-stats"><span>${row.learned} learned</span><span>${row.due} due</span><span>${row.started} started</span></div></article>`).join('')}
      </div>
    </section>

    <section class="progress-panel">
      <div class="progress-heading"><div><p class="eyebrow">CEFR evidence</p><h2>Promotion record</h2></div></div>
      <div class="promotion-row">
        ${snapshot.promotions.map(row=>`<article class="${row.earned?'is-earned':''}"><strong>${row.level}</strong><span>${row.earned?'Earned '+new Date(row.earnedAt).toLocaleDateString():'Not yet earned'}</span></article>`).join('')}
      </div>
    </section>

    <section class="progress-panel">
      <div class="progress-heading"><div><p class="eyebrow">Needs attention</p><h2>Weakest scheduled skills</h2></div><span>${snapshot.suspended} suspended</span></div>
      <div class="weak-list">
        ${snapshot.weak.length?snapshot.weak.map(row=>`<article><strong>${row.noteId}</strong><span>${labelSkill(row.skill)} · ${row.lapses} lapse${row.lapses===1?'':'s'} · difficulty ${row.difficulty.toFixed(1)} · retrievability ${Math.round(row.retrievability*100)}%</span></article>`).join(''):'<p class="inline-status">No weak scheduled items yet.</p>'}
      </div>
    </section>
  </section>`;
}
