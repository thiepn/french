/** P37I-D3 — longitudinal, like-for-like practice evidence.
 * Read-only, in-app observational trends; no causality, CEFR scoring,
 * SRS schedule mutation, or learner transcript persistence.
 */
import type {CanonicalReviewEventV1} from './model';
import type {FunctionEvidence} from '../conversation/curriculum.ts';
import type {VocabularySearchRow} from '../content/loader';

const DAY=86_400_000;
export const D3_WINDOW_DAYS=45;
export const D3_LOOKBACK_DAYS=90;
export const D3_MIN_GRADED=3;
export const D3_MIN_DAYS=2;
export type TrendSkill='vocabulary'|'listening'|'writing'|'construction'|'conversation';
export type TrendRoute='review'|'listen'|'write'|'conversation';
export type TrendStatus='insufficient'|'improving'|'declining'|'persistent-risk'|'stable'|'mixed';
export interface TrendWindow{
  graded:number;positive:number;negative:number;unverified:number;
  activeDays:number;distinctContexts:number;accuracy:number|null;
}
export interface TrendRow{
  key:string;label:string;skill:TrendSkill;route:TrendRoute;
  baseline:TrendWindow;recent:TrendWindow;status:TrendStatus;
  changePoints:number|null;repairTouches:number;followup:'observed-after-repair'|'not-demonstrated';
  explanation:string;
}
export interface LongitudinalReport{
  schema:'thiepn-french-p37i-d3-longitudinal';windowDays:45;lookbackDays:90;
  totalSubjects:number;comparable:number;improving:number;declining:number;persistentRisk:number;
  rows:TrendRow[];priority:TrendRow[];
  sourceLimited:boolean;limitation:string;
}
export interface LongitudinalInput{
  events:readonly CanonicalReviewEventV1[];
  functionEvents:readonly FunctionEvidence[];
  vocabulary?:readonly VocabularySearchRow[];
  now?:number;sourceLimit?:number;
}
type Grade='positive'|'negative'|'unverified';
interface Sample{key:string;label:string;skill:TrendSkill;route:TrendRoute;
  at:number;grade:Grade;context:string;id:string;repair:boolean;}
function bounded(value:number,now:number):boolean{
  return Number.isSafeInteger(value)&&value>now-D3_LOOKBACK_DAYS*DAY&&value<=now;
}
function dayKey(at:number):string{return new Date(at).toISOString().slice(0,10);}
function supportFree(e:CanonicalReviewEventV1):boolean{
  return e.supportLevel===0&&!e.transcriptUsed&&!e.translationUsed;
}
function manual(e:CanonicalReviewEventV1):boolean{
  return Boolean(e.manualJudgment==='self-assessed'||e.manualJudgment==='manual'||
    e.typedQuality?.startsWith('manual-'));
}
function gradeActivity(e:CanonicalReviewEventV1,kind:TrendSkill):Grade{
  if(kind==='vocabulary')return e.correct===true?'positive':'negative';
  if(!supportFree(e)||manual(e))return 'unverified';
  if(kind==='listening'){
    if(e.typed!==true||!e.typedQuality||e.playCount!==1||
      (e.playbackRate??0)<1||e.firstListen!==true)return 'unverified';
    return e.correct===true&&e.typedQuality==='exact'?'positive':
      e.correct===false?'negative':'unverified';
  }
  if(kind==='writing'){
    if(e.typed!==true||!e.sentenceExerciseId)return 'unverified';
    return e.correct===true&&e.typedQuality==='exact'&&
      ['exact','accepted'].includes(e.sentenceDiagnosis??'')?'positive':
      e.correct===false?'negative':'unverified';
  }
  if(e.typed!==true||!e.errorCategory)return 'unverified';
  if(e.correct===true&&e.typedQuality==='exact'&&e.errorCategory==='exact')return 'positive';
  return e.correct===false&&e.manualJudgment==='needs-practice'?'negative':'unverified';
}
function safeId(s:string|undefined):string{
  return typeof s==='string'&&s.length<=180?s:'';
}
function activitySample(e:CanonicalReviewEventV1,words:ReadonlyMap<string,string>):Sample|null{
  const noteId=safeId(e.noteId),practice=safeId(e.practice);
  if(!noteId||!practice)return null;
  let key='',label='',skill:TrendSkill,route:TrendRoute,context='';
  if(e.practiceOnly!==true){
    if(!e.skill)return null;
    skill='vocabulary';route='review';
    key='vocab:'+noteId+':'+(e.id||e.skill);
    label=(words.get(noteId)??noteId)+' · '+e.skill;
    context=e.direction??'scheduled';
  }else if(practice.startsWith('contextual-listening')){
    skill='listening';route='listen';
    key='listen:'+noteId;label='Listening · '+(words.get(noteId)??noteId);
    context=practice;
  }else if(practice.startsWith('written-')){
    const sentenceId=safeId(e.sentenceExerciseId);
    if(!sentenceId)return null;
    skill='writing';route='write';
    key='write:'+sentenceId;label='Sentence '+sentenceId;context=practice;
  }else if(practice.startsWith('verified-usage-')){
    const suffix=practice.slice('verified-usage-'.length);
    if(suffix==='repair'){
      // A repair itself is not a subsequent independent mastery result.
      return{key:'construct:usage:'+noteId,label:'Construction '+noteId,skill:'construction',
        route:'write',at:e.t,grade:'unverified',context:suffix,id:'',repair:true};
    }
    if(!['usage','production','transfer','context'].includes(suffix))return null;
    skill='construction';route='write';key='construct:'+suffix+':'+noteId;
    label=(suffix==='context'?'Context':'Construction')+' · '+noteId;
    context=suffix;
  }else return null;
  return{key,label,skill,route,at:e.t,grade:gradeActivity(e,skill),
    context,id:safeId(e.eventId),repair:false};
}
function conversationSample(e:FunctionEvidence):Sample|null{
  const functionId=safeId(e.functionId),scenarioId=safeId(e.scenarioId);
  if(!functionId||!scenarioId)return null;
  const independent=e.manual!==true&&e.support===0&&e.retries===0;
  const positive=independent&&e.accepted===true&&e.independent===true&&
    e.required>0&&e.matched>=e.required&&e.credit>=.99;
  const negative=independent&&e.accepted===false&&e.required>0;
  const grade:Grade=positive?'positive':negative?'negative':'unverified';
  return{key:'function:'+functionId,label:'Function · '+functionId,skill:'conversation',
    route:'conversation',at:e.at,grade,context:scenarioId,
    id:'fn:'+functionId+':'+scenarioId+':'+e.turnIndex+':'+e.at,repair:false};
}
function windowStats(samples:readonly Sample[]):TrendWindow{
  const evaluated=samples.filter(s=>s.grade!=='unverified'&&!s.repair);
  const good=evaluated.filter(s=>s.grade==='positive').length;
  const graded=evaluated.length;
  return{graded,positive:good,negative:graded-good,
    unverified:samples.filter(s=>s.grade==='unverified'&&!s.repair).length,
    activeDays:new Set(evaluated.map(s=>dayKey(s.at))).size,
    distinctContexts:new Set(evaluated.map(s=>s.context)).size,
    accuracy:graded?Math.round(100*good/graded):null};
}
function credible(w:TrendWindow):boolean{return w.graded>=D3_MIN_GRADED&&w.activeDays>=D3_MIN_DAYS;}
function classify(b:TrendWindow,r:TrendWindow):TrendStatus{
  if(!credible(b)||!credible(r))return'insufficient';
  const delta=(r.accuracy??0)-(b.accuracy??0);
  if(delta>=25&&r.accuracy!==null&&r.accuracy>=75&&b.negative>=2&&r.positive>=3)return'improving';
  if(delta<=-25&&r.negative>=2)return'declining';
  if((b.accuracy??0)<60&&(r.accuracy??0)<60&&b.negative>=2&&r.negative>=2)
    return'persistent-risk';
  if((b.accuracy??0)>=75&&(r.accuracy??0)>=75&&r.negative<=1)return'stable';
  return'mixed';
}
export function evaluateLongitudinalEvidence(input:LongitudinalInput):LongitudinalReport{
  const now=input.now??Date.now(),boundary=now-D3_WINDOW_DAYS*DAY;
  const words=new Map((input.vocabulary??[]).map(row=>[row.id,row.word]));
  const sourceLimited=(input.sourceLimit??0)>0&&input.events.length>=input.sourceLimit;
  const raw:Sample[]=[];
  for(const e of input.events){
    if(!bounded(e.t,now))continue;
    const row=activitySample(e,words);if(row)raw.push(row);
  }
  for(const e of input.functionEvents){
    if(!bounded(e.at,now))continue;
    const row=conversationSample(e);if(row)raw.push(row);
  }
  // Same activity ID is never counted twice after imports or cross-device sync.
  const seen=new Set<string>(),groups=new Map<string,Sample[]>();
  for(const item of raw){
    if(item.id){
      if(seen.has(item.id))continue;
      seen.add(item.id);
    }
    const list=groups.get(item.key)??[];
    list.push(item);groups.set(item.key,list);
  }
  const rows:TrendRow[]=[];
  for(const [key,items] of groups){
    const ordered=items.sort((a,b)=>a.at-b.at);
    const baseline=windowStats(ordered.filter(x=>x.at<=boundary));
    const recent=windowStats(ordered.filter(x=>x.at>boundary));
    const status=classify(baseline,recent);
    const repairTouches=ordered.filter(x=>x.repair&&x.at>boundary).length;
    const followup=repairTouches>0&&status==='improving'&&
      recent.activeDays>=D3_MIN_DAYS?'observed-after-repair':'not-demonstrated';
    const changePoints=credible(baseline)&&credible(recent)?
      (recent.accuracy??0)-(baseline.accuracy??0):null;
    const explanation=status==='insufficient'?
      'Too few independently graded attempts across two different days in each window.':
      status==='improving'?'Recent graded performance improved for this same target; not proof of a causal intervention.':
      status==='declining'?'Recent graded performance declined for this same target.':
      status==='persistent-risk'?'Repeated errors continue in both observation windows.':
      status==='stable'?'Consistently strong graded performance across both windows.':
      'Mixed outcomes; no defensible improvement or decline.';
    const first=ordered[0];
    rows.push({key,label:first.label,skill:first.skill,route:first.route,baseline,recent,
      status,changePoints,repairTouches,followup,explanation});
  }
  const order:Record<TrendStatus,number>={'persistent-risk':0,declining:1,mixed:2,improving:3,
    insufficient:4,stable:5};
  rows.sort((a,b)=>order[a.status]-order[b.status]||
    b.recent.negative-a.recent.negative||a.label.localeCompare(b.label));
  const priority=rows.filter(row=>['declining','persistent-risk','mixed'].includes(row.status)&&
    credible(row.recent)).slice(0,6);
  return{schema:'thiepn-french-p37i-d3-longitudinal',windowDays:D3_WINDOW_DAYS,
    lookbackDays:D3_LOOKBACK_DAYS,totalSubjects:rows.length,
    comparable:rows.filter(row=>row.status!=='insufficient').length,
    improving:rows.filter(row=>row.status==='improving').length,
    declining:rows.filter(row=>row.status==='declining').length,
    persistentRisk:rows.filter(row=>row.status==='persistent-risk').length,
    rows,priority,sourceLimited,
    limitation:'Observational, source-bounded practice data. Scheduled reviews are self-rated; exact-model and scripted interaction checks are not semantic or CEFR assessments. A temporal association after a repair attempt does not prove the repair caused improvement.'};
}
