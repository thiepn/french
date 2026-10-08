import type { RouteContext } from '../core/types';
import { readAllSrsRecords,readCanonicalLearnerState,readRecentReviewEvents } from '../core/learner/repository';
import type { CanonicalReviewEventV1,CanonicalSrsRecordV1,SkillId } from '../core/learner/model';
import { evidenceFromEvents,weaknessScore } from '../core/learner/queue';
import { retrievability } from '../core/learner/scheduler';
import { loadVocabularySearchIndex,type VocabularySearchRow } from '../core/content/loader';
import { loadConversationState } from '../core/conversation/storage';
import { getMission } from '../core/conversation/missions';

const DAY=86_400_000;
type Skill='recognition'|'production'|'listening'|'spelling'|'article';
const SKILLS:Skill[]=['recognition','production','listening','spelling','article'];

function number(value:unknown,fallback=0):number{const n=Number(value);return Number.isFinite(n)?n:fallback;}
function percent(value:number,total:number):number{return total?Math.round(value/total*100):0;}
function dayKey(timestamp:number):string{
  const d=new Date(timestamp);
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}
function scheduled(events:CanonicalReviewEventV1[]):CanonicalReviewEventV1[]{return events.filter(event=>event.practiceOnly!==true);}
function currentRecall(record:CanonicalSrsRecordV1,now:number):number{
  if(record.status==='new'||record.seen<=0)return 0;
  if(record.stability<=0)return Math.max(0,Math.min(1,record.retrievability||0));
  const elapsed=Math.max(0,(now-record.lastReviewedAt)/DAY);
  return retrievability(record.stability,elapsed);
}
function active(record:CanonicalSrsRecordV1):boolean{return !record.suspended&&record.seen>0&&record.status!=='new';}
function due(record:CanonicalSrsRecordV1,now:number):boolean{return active(record)&&record.dueAt>0&&record.dueAt<=now;}
function secure(record:CanonicalSrsRecordV1|undefined,retention:number,now:number):boolean{
  return Boolean(record&&record.status==='learned'&&!record.suspended&&currentRecall(record,now)>=retention);
}
function groupByNote(records:CanonicalSrsRecordV1[]):Map<string,CanonicalSrsRecordV1[]>{
  const map=new Map<string,CanonicalSrsRecordV1[]>();
  for(const record of records){const rows=map.get(record.noteId)??[];rows.push(record);map.set(record.noteId,rows);}
  return map;
}
function recordFor(rows:CanonicalSrsRecordV1[]|undefined,skill:Skill):CanonicalSrsRecordV1|undefined{
  return rows?.find(row=>row.skill===skill);
}
function textNode(tag:string,value:string,className=''):HTMLElement{
  const el=document.createElement(tag);el.textContent=value;if(className)el.className=className;return el;
}
function repairCause(record:CanonicalSrsRecordV1,productionGap:boolean):string{
  if(productionGap&&record.skill==='production')return'Production gap';
  if(record.lastAnswerIssue&& !['none','exact'].includes(record.lastAnswerIssue))return'Answer precision';
  if(record.lapses>=2||record.againCount>=3)return'Repeated forgetting';
  if(record.lastResponseMs>=9000)return'Slow retrieval';
  return'Memory risk';
}
function levelOrder(level:string):number{return['A1','A2','B1','B2','C1','C2'].indexOf(level);}

export async function mount({main,signal,navigate}:RouteContext):Promise<void>{
  main.innerHTML='<section class="page progress-page progress-intelligence"><p class="eyebrow">Vocabulary intelligence</p><h1>Progress</h1><p class="lede">A decision surface built from current FSRS state, review evidence and the on-demand vocabulary catalog.</p><div class="inline-status" data-status>Calculating live mastery…</div><div data-progress></div></section>';
  const host=main.querySelector<HTMLElement>('[data-progress]');
  const status=main.querySelector<HTMLElement>('[data-status]');
  if(!host||!status)return;

  const now=Date.now();
  const [learner,records,recent,index,conversations]=await Promise.all([
    readCanonicalLearnerState(),
    readAllSrsRecords(),
    readRecentReviewEvents(10_000),
    loadVocabularySearchIndex(signal),
    loadConversationState()
  ]);
  if(signal.aborted)return;

  const retention=Math.min(.97,Math.max(.7,number(learner?.settings?.desiredRetention,.9)));
  const events=scheduled(recent);
  const last7=events.filter(event=>event.t>=now-7*DAY);
  const last30=events.filter(event=>event.t>=now-30*DAY);
  const byNote=groupByNote(records);
  const rowById=new Map(index.rows.map(row=>[row.id,row]));
  const catalogIds=new Set(index.rows.map(row=>row.id));
  const evidence=evidenceFromEvents(events);

  let introduced=0,recognitionSecure=0,productionSecure=0,balancedSecure=0;
  const noteState=new Map<string,{recognition:boolean;production:boolean;introduced:boolean}>();
  for(const id of catalogIds){
    const rows=byNote.get(id)??[];
    const intro=rows.some(row=>row.seen>0);
    const recognition=secure(recordFor(rows,'recognition'),retention,now);
    const productionRows=rows.filter(row=>row.skill==='production');
    const production=productionRows.length>0&&productionRows.every(row=>secure(row,retention,now));
    if(intro)introduced++;if(recognition)recognitionSecure++;if(production)productionSecure++;if(recognition&&production)balancedSecure++;
    noteState.set(id,{recognition,production,introduced:intro});
  }
  const productionGap=[...noteState.values()].filter(state=>state.introduced&&state.recognition&&!state.production).length;

  const pressure={due:0,next24:0,days23:0,days47:0};
  for(const record of records){
    if(record.suspended||record.status==='new'||record.seen<=0||record.dueAt<=0)continue;
    const delta=record.dueAt-now;
    if(delta<=0)pressure.due++;
    else if(delta<=DAY)pressure.next24++;
    else if(delta<=3*DAY)pressure.days23++;
    else if(delta<=7*DAY)pressure.days47++;
  }

  const skillHealth=SKILLS.map(skill=>{
    const eligible=skill==='article'?index.rows.filter(row=>Boolean(row.article)).length:index.rows.length;
    const rows=records.filter(row=>row.skill===skill&&catalogIds.has(row.noteId));
    const started=rows.filter(row=>row.seen>0);
    const secureCount=started.filter(row=>secure(row,retention,now)).length;
    const dueCount=started.filter(row=>due(row,now)).length;
    const avg=started.length?started.reduce((sum,row)=>sum+currentRecall(row,now),0)/started.length:0;
    return{skill,eligible,started:started.length,secure:secureCount,due:dueCount,avg};
  });

  const levelGroups=new Map<string,VocabularySearchRow[]>();
  for(const row of index.rows){const level=row.level||'Other';const list=levelGroups.get(level)??[];list.push(row);levelGroups.set(level,list);}
  const levels=[...levelGroups.entries()].sort((a,b)=>{
    const ao=levelOrder(a[0]),bo=levelOrder(b[0]);return (ao<0?99:ao)-(bo<0?99:bo)||a[0].localeCompare(b[0]);
  }).map(([level,rows])=>{
    let intro=0,rec=0,prod=0,balanced=0;
    for(const row of rows){const state=noteState.get(row.id);if(state?.introduced)intro++;if(state?.recognition)rec++;if(state?.production)prod++;if(state?.recognition&&state.production)balanced++;}
    return{level,total:rows.length,intro,rec,prod,balanced};
  });

  const weakByNote=new Map<string,{record:CanonicalSrsRecordV1;score:number}>();
  for(const record of records){
    if(!active(record)||!catalogIds.has(record.noteId))continue;
    const score=weaknessScore(record,evidence.get(record.id),now);
    const current=weakByNote.get(record.noteId);
    if(!current||score>current.score)weakByNote.set(record.noteId,{record,score});
  }
  const weakest=[...weakByNote.entries()]
    .sort((a,b)=>b[1].score-a[1].score)
    .slice(0,8)
    .map(([noteId,value])=>({noteId,...value,row:rowById.get(noteId)}));

  const profile=learner?.profile??{};
  const lifetimeAnswers=Math.max(events.length,Math.round(number(profile.lifetimeAnswers,0)));
  const lifetimeCorrect=Math.max(events.filter(event=>event.correct).length,Math.round(number(profile.lifetimeCorrect,0)));
  const accuracy7=percent(last7.filter(event=>event.correct).length,last7.length);
  const accuracy30=percent(last30.filter(event=>event.correct).length,last30.length);
  const xp=Math.round(number(profile.xp,events.reduce((sum,event)=>sum+number(event.xp,0),0)));

  host.replaceChildren();

  const actions=document.createElement('section');actions.className='next-actions data-panel';
  actions.append(textNode('h2','What to do next'));
  const actionGrid=document.createElement('div');actionGrid.className='next-action-grid';
  const actionSpecs:Array<{title:string;detail:string;route:'review'|'learn'|'words'}>=[];
  if(pressure.due>0)actionSpecs.push({title:'Review '+pressure.due+' due skills',detail:'Due retrieval has priority over new material.',route:'review'});
  if(productionGap>0)actionSpecs.push({title:'Close '+productionGap+' production gaps',detail:'Recognition is secure but active recall still lags.',route:'learn'});
  if(weakest.length)actionSpecs.push({title:'Inspect weakest vocabulary',detail:'Repair repeated forgetting, precision and slow retrieval.',route:'words'});
  if(!actionSpecs.length)actionSpecs.push({title:'Study today',detail:'No urgent review pressure is detected.',route:'learn'});
  for(const spec of actionSpecs.slice(0,3)){
    const button=document.createElement('button');button.type='button';button.className='decision-action';
    button.append(textNode('strong',spec.title),textNode('span',spec.detail));
    button.addEventListener('click',()=>navigate(spec.route));actionGrid.append(button);
  }
  actions.append(actionGrid);

  const funnel=document.createElement('section');funnel.className='data-panel';
  funnel.append(textNode('h2','Vocabulary coverage'));
  const funnelGrid=document.createElement('div');funnelGrid.className='coverage-funnel';
  const funnelRows:Array<[string,number,string]>=[
    ['Catalog',index.rows.length,'Available vocabulary'],
    ['Introduced',introduced,percent(introduced,index.rows.length)+'% of catalog'],
    ['Recognition secure',recognitionSecure,percent(recognitionSecure,index.rows.length)+'% at ≥ '+Math.round(retention*100)+'% recall'],
    ['Production secure',productionSecure,percent(productionSecure,index.rows.length)+'% active recall'],
    ['Balanced secure',balancedSecure,percent(balancedSecure,index.rows.length)+'% secure both ways']
  ];
  for(const [label,value,detail] of funnelRows){
    const row=document.createElement('div');row.className='coverage-row';
    row.append(textNode('span',label),textNode('strong',value.toLocaleString()),textNode('small',detail));funnelGrid.append(row);
  }
  funnel.append(funnelGrid);

  const pressurePanel=document.createElement('section');pressurePanel.className='data-panel';
  pressurePanel.append(textNode('h2','Review pressure'));
  const pressureGrid=document.createElement('div');pressureGrid.className='pressure-grid';
  for(const [label,value] of [['Due now',pressure.due],['Next 24h',pressure.next24],['Days 2–3',pressure.days23],['Days 4–7',pressure.days47]] as Array<[string,number]>){
    const card=document.createElement('div');card.className='pressure-card';card.append(textNode('span',label),textNode('strong',String(value)));pressureGrid.append(card);
  }
  pressurePanel.append(pressureGrid);

  const skills=document.createElement('section');skills.className='data-panel';
  skills.append(textNode('h2','Skill health'));
  const skillTable=document.createElement('div');skillTable.className='intel-table';
  const skillHead=document.createElement('div');skillHead.className='intel-row intel-head';
  for(const label of ['Skill','Started','Secure','Due','Recall'])skillHead.append(textNode('span',label));skillTable.append(skillHead);
  for(const row of skillHealth){
    const line=document.createElement('div');line.className='intel-row';
    line.append(
      textNode('strong',row.skill),
      textNode('span',row.started.toLocaleString()+' / '+row.eligible.toLocaleString()),
      textNode('span',row.secure.toLocaleString()),
      textNode('span',row.due.toLocaleString()),
      textNode('span',Math.round(row.avg*100)+'%')
    );skillTable.append(line);
  }
  skills.append(skillTable);
  const gap=textNode('p',productionGap+' introduced words currently have secure recognition without secure production.','intel-note');
  skills.append(gap);

  const cefr=document.createElement('section');cefr.className='data-panel';
  cefr.append(textNode('h2','CEFR coverage'));
  const cefrTable=document.createElement('div');cefrTable.className='intel-table';
  const cefrHead=document.createElement('div');cefrHead.className='intel-row cefr-row intel-head';
  for(const label of ['Level','Introduced','Recognition','Production','Balanced'])cefrHead.append(textNode('span',label));cefrTable.append(cefrHead);
  for(const row of levels){
    const line=document.createElement('div');line.className='intel-row cefr-row';
    line.append(
      textNode('strong',row.level+' · '+row.total.toLocaleString()),
      textNode('span',percent(row.intro,row.total)+'%'),
      textNode('span',percent(row.rec,row.total)+'%'),
      textNode('span',percent(row.prod,row.total)+'%'),
      textNode('span',percent(row.balanced,row.total)+'%')
    );cefrTable.append(line);
  }
  cefr.append(cefrTable);

  const weak=document.createElement('section');weak.className='data-panel';
  weak.append(textNode('h2','Weakest vocabulary'));
  const weakList=document.createElement('div');weakList.className='weak-list';
  if(!weakest.length)weakList.append(textNode('p','No reviewed vocabulary is currently available for weakness analysis.','muted-copy'));
  for(const item of weakest){
    const state=noteState.get(item.noteId);
    const line=document.createElement('div');line.className='weak-row';
    const copy=document.createElement('div');copy.className='weak-copy';
    copy.append(textNode('strong',item.row?.word??item.noteId),textNode('span',(item.row?.meaning??'Saved vocabulary')+' · '+repairCause(item.record,Boolean(state?.recognition&&!state.production))));
    const metrics=textNode('span','risk '+Math.round(item.score)+' · '+Math.round(currentRecall(item.record,now)*100)+'% recall','weak-metrics');
    line.append(copy,metrics);weakList.append(line);
  }
  weak.append(weakList);

  const activityPanel=document.createElement('section');activityPanel.className='data-panel';
  activityPanel.append(textNode('h2','Last 7 days'));
  const lastDays:string[]=[];const activity=new Map<string,number>();
  for(let offset=6;offset>=0;offset--){const date=new Date(now);date.setHours(0,0,0,0);date.setDate(date.getDate()-offset);const key=dayKey(date.getTime());lastDays.push(key);activity.set(key,0);}
  for(const event of last7){const key=dayKey(event.t);if(activity.has(key))activity.set(key,(activity.get(key)??0)+1);}
  const maxDay=Math.max(1,...activity.values());
  const bars=document.createElement('div');bars.className='activity-bars';
  for(const key of lastDays){
    const count=activity.get(key)??0;const item=document.createElement('div');item.className='activity-day';
    const bar=document.createElement('div');bar.className='activity-bar';bar.style.height=Math.max(6,Math.round(count/maxDay*100))+'%';bar.title=count+' answers';
    item.append(bar,textNode('span',new Date(key+'T12:00:00').toLocaleDateString(undefined,{weekday:'short'})),textNode('small',String(count)));bars.append(item);
  }
  activityPanel.append(bars);

  const listeningEvents=recent.filter(event=>event.practiceOnly===true&&event.practice.startsWith('contextual-listening'));
  const listeningCorrect=listeningEvents.filter(event=>event.correct).length;
  const listeningFirst=listeningEvents.filter(event=>event.firstListen===true).length;
  const listeningSupported=listeningEvents.filter(event=>event.correct&&Number(event.supportLevel)>0).length;
  const listeningErrors=new Map<string,number>();
  for(const event of listeningEvents){if(event.errorCategory)listeningErrors.set(event.errorCategory,(listeningErrors.get(event.errorCategory)??0)+1);}
  const topListeningErrors=[...listeningErrors.entries()].sort((a,b)=>b[1]-a[1]).slice(0,3);

  const listeningPanel=document.createElement('section');listeningPanel.className='data-panel';
  listeningPanel.append(textNode('h2','Contextual listening evidence'));
  const listeningGrid=document.createElement('div');listeningGrid.className='pressure-grid';
  for(const [label,value] of [
    ['Attempts',listeningEvents.length],
    ['Accurate',listeningCorrect],
    ['First-listen',listeningFirst],
    ['Supported wins',listeningSupported]
  ] as Array<[string,number]>){
    const card=document.createElement('div');card.className='pressure-card';card.append(textNode('span',label),textNode('strong',String(value)));listeningGrid.append(card);
  }
  listeningPanel.append(listeningGrid);
  if(topListeningErrors.length)listeningPanel.append(textNode('p','Top aural errors: '+topListeningErrors.map(([name,count])=>name+' ('+count+')').join(' · '),'intel-note'));

  const readingRaw=learner?.featureState?.v550Reading;
  const readingState=readingRaw&&typeof readingRaw==='object'&&!Array.isArray(readingRaw)?readingRaw as Record<string,unknown>:{};
  const readingHistoryRaw=readingState.history&&typeof readingState.history==='object'&&!Array.isArray(readingState.history)?readingState.history as Record<string,unknown>:{};
  const readingRows=Object.values(readingHistoryRaw).filter(value=>value&&typeof value==='object'&&!Array.isArray(value)) as Record<string,unknown>[];
  const readingCompleted=readingRows.filter(row=>Number(row.completedAt)>0).length;
  const readingCompletions=readingRows.reduce((sum,row)=>sum+Math.max(0,Math.round(Number(row.completionCount)||0)),0);
  const readingAttempts=readingRows.reduce((sum,row)=>sum+Math.max(0,Math.round(Number(row.questionAttempts)||0)),0);
  const readingCorrect=readingRows.reduce((sum,row)=>sum+Math.max(0,Math.round(Number(row.questionCorrect)||0)),0);
  const readingSaved=readingState.saved&&typeof readingState.saved==='object'&&!Array.isArray(readingState.saved)?Object.keys(readingState.saved as Record<string,unknown>).length:0;
  const readingPanel=document.createElement('section');readingPanel.className='data-panel';
  readingPanel.append(textNode('h2','Reading context'));
  const readingGrid=document.createElement('div');readingGrid.className='pressure-grid';
  for(const [label,value] of [
    ['Texts completed',readingCompleted],
    ['Completions',readingCompletions],
    ['Context recall',readingAttempts?Math.round(readingCorrect/readingAttempts*100):0],
    ['Saved discoveries',readingSaved]
  ] as Array<[string,number]>){
    const card=document.createElement('div');card.className='pressure-card';card.append(textNode('span',label),textNode('strong',label==='Context recall'?value+'%':String(value)));readingGrid.append(card);
  }
  readingPanel.append(readingGrid,textNode('p','Reading exposure and lookups remain separate from scheduled recall evidence.','intel-note'));

  const spokenEvents=recent.filter(event=>event.practiceOnly===true&&event.practice.startsWith('spoken-'));
  const spokenGood=spokenEvents.filter(event=>event.correct).length;
  const spokenModes=new Set(spokenEvents.map(event=>event.practice.replace(/^spoken-/,'')));
  const spokenUnassisted=spokenEvents.filter(event=>event.correct&&Number(event.supportLevel??0)===0).length;
  const transferEvents=spokenEvents.filter(event=>event.practice==='spoken-transfer');
  const transferCorrect=transferEvents.filter(event=>event.correct).length;
  const transferExercises=new Set(transferEvents.map(event=>event.sentenceExerciseId).filter(Boolean));
  const transferManual=transferEvents.filter(event=>Boolean(event.manualJudgment)).length;
  const spokenPanel=document.createElement('section');spokenPanel.className='data-panel';
  spokenPanel.append(textNode('h2','Spoken production evidence'));
  const spokenGrid=document.createElement('div');spokenGrid.className='pressure-grid';
  for(const [label,value] of [
    ['Attempts',spokenEvents.length],
    ['Self-rated success',spokenGood],
    ['Unassisted',spokenUnassisted],
    ['Modes used',spokenModes.size]
  ] as Array<[string,number]>){
    const card=document.createElement('div');card.className='pressure-card';card.append(textNode('span',label),textNode('strong',String(value)));spokenGrid.append(card);
  }
  spokenPanel.append(spokenGrid,textNode('p','Recognition is treated as an optional intelligibility aid, never as an accent score.','intel-note'));
  if(transferEvents.length)spokenPanel.append(textNode('p','P12 transfer: '+transferCorrect+'/'+transferEvents.length+' manually confirmed correct · '+transferExercises.size+' exercise families · '+transferManual+' manual judgments.','intel-note'));

  const evidencePanel=document.createElement('section');evidencePanel.className='data-panel compact-evidence';
  evidencePanel.append(textNode('h2','Recent evidence'));
  const evidenceGrid=document.createElement('div');evidenceGrid.className='progress-grid';
  for(const [label,value,detail] of [
    ['7-day accuracy',accuracy7+'%',last7.length+' scheduled answers'],
    ['30-day accuracy',accuracy30+'%',last30.length+' scheduled answers'],
    ['Lifetime',lifetimeAnswers.toLocaleString(),percent(lifetimeCorrect,lifetimeAnswers)+'% correct'],
    ['XP',xp.toLocaleString(),'Practice evidence']
  ] as Array<[string,string,string]>){
    const card=document.createElement('article');card.className='stat-card compact-stat';
    card.append(textNode('span',label),textNode('strong',value),textNode('p',detail));evidenceGrid.append(card);
  }
  evidencePanel.append(evidenceGrid);

  const missionPanel=document.createElement('section');missionPanel.className='data-panel';
  missionPanel.append(textNode('h2','Functional missions'));
  const missionGrid=document.createElement('div');missionGrid.className='pressure-grid';
  const passes=conversations.missionHistory.filter(item=>item.independencePass).length;
  const unsupported=conversations.missionHistory.filter(item=>item.fullyUnsupported).length;
  for(const [label,value] of [
    ['Mission runs',conversations.missionHistory.length],
    ['Independence passes',passes],
    ['Fully unsupported',unsupported],
    ['Finished scenarios',conversations.history.length]
  ] as Array<[string,number]>){
    const card=document.createElement('div');card.className='pressure-card';
    card.append(textNode('span',label),textNode('strong',String(value)));missionGrid.append(card);
  }
  missionPanel.append(missionGrid);
  if(conversations.mission){
    const mission=getMission(conversations.mission.missionId);
    missionPanel.append(textNode('p','Unfinished: '+(mission?.title??'Mission')+' · task '+
      (conversations.mission.step+1)+' of 3. Resume in Conversation.','intel-note'));
  }
  for(const result of conversations.missionHistory.slice(0,5)){
    const mission=getMission(result.missionId);
    if(mission)missionPanel.append(textNode('p',mission.title+' · '+
      (result.independencePass?'independence pass':'completed with support')+
      ' · '+result.independentTurns+'/'+result.totalTurns+' independent turns.','intel-note'));
  }
  missionPanel.append(textNode('p',
    'Scenario-level practice results are not CEFR certification. Raw learner responses are not stored.','intel-note'));
  host.append(actions,funnel,pressurePanel,skills,cefr,weak,readingPanel,listeningPanel,spokenPanel,missionPanel,activityPanel,evidencePanel);
  status.textContent=(learner?.studyDays.length??0)+' active study days · '+records.length.toLocaleString()+' skill records · live recall threshold '+Math.round(retention*100)+'%.';
}
