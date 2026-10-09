import type {UsagePack,UsageRecord} from '../content/loader';
import {rankUsageCandidates,transferCueVariant} from './mastery.ts';
import {assessContextAnswer,contextScene,hasContextScenes,type ContextScene} from './context.ts';
import type {LexicalSignal} from './lexical';

export const USAGE_MODES=['usage','production','transfer','context','repair'] as const;
export type UsageMode=typeof USAGE_MODES[number];
export type UsageCode='exact'|'orthography'|'connector'|'collocate'|'neighbor'|'incomplete'|'order'|'anchor'|'structure'|'blank';
export type UsageOutcome='matched'|'self-assessed'|'needs-practice';
export interface UsageAttempt{
  recordId:string;mode:UsageMode;at:number;outcome:UsageOutcome;diagnosis:UsageCode;support:0|1|2;
  variant?:0|1|2;
}
export interface UsageTally{
  attempts:number;exact:number;lastAt:number;lastIndependent:boolean;variantMask:number;
  lastOutcome:UsageOutcome;lastDiagnosis:UsageCode;
}
export interface UsageState{
  schema:'thiepn-french-usage-v1';
  modes:Record<UsageMode,{index:number;support:0|1|2}>;
  history:UsageAttempt[];
  tallies:Record<string,Partial<Record<UsageMode,UsageTally>>>;
}
export interface UsageDiagnosis{code:UsageCode;label:string;detail:string;correct:boolean;quality:'exact'|'close'|'review';}

const LABELS:Record<UsageCode,[string,string]>={
  exact:['Exact verified frame','The entered construction matches the requested P10 frame.'],
  orthography:['Orthography','Check accents, apostrophes or spelling; do not award an exact match.'],
  connector:['Different connector','The requested frame uses a different preposition or connector.'],
  collocate:['Missing collocate','The lexical partner required by this frame is missing or different.'],
  neighbor:['Neighboring verified frame','That construction exists in the P10 source, but it is not the requested frame.'],
  incomplete:['Incomplete frame','Part of the requested construction is missing.'],
  order:['Word order','The same elements appear in a different sequence.'],
  anchor:['Missing anchor','The requested anchor is missing from the constructed phrase.'],
  structure:['Different structure','This does not match the source frame. Another French wording may still be valid.'],
  blank:['No answer','Enter the missing element or the requested complete frame.']
};
function canon(text:string):string{
  return String(text||'').toLocaleLowerCase('fr').normalize('NFC').replace(/’/g,"'")
    .replace(/\s*\+\s*/g,' ').replace(/[.,;:!?()[\]{}"]/g,' ').replace(/\s+/g,' ').trim();
}
function fold(text:string):string{
  return canon(text).normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,' ').replace(/\s+/g,' ').trim();
}
function tokens(text:string):string[]{return fold(text).split(' ').filter(Boolean);}
function outcome(code:UsageCode):UsageDiagnosis{
  const [label,detail]=LABELS[code];
  return{code,label,detail,correct:code==='exact',quality:code==='exact'?'exact':code==='orthography'?'close':'review'};
}
export function maskUsageFrame(record:UsageRecord):string{
  // Match the complete lexical item; substring replacement breaks décider/de and demander/de.
  const special=new Set(['\\','^','$','.','*','+','?','(',')','[',']','{','}','|']);
  const escaped=[...record.blank].map(c=>special.has(c)?'\\'+c:c).join('');
  const match=new RegExp('(?<![\\p{L}\\p{N}])'+escaped+'(?![\\p{L}\\p{N}])','iu').exec(record.frame);
  if(!match)throw Error('INVALID_VERIFIED_BLANK');
  return record.frame.slice(0,match.index)+'_____ '+record.frame.slice(match.index+match[0].length).trimStart();
}
export function usageCue(record:UsageRecord,mode:UsageMode,variant:0|1|2=0):string{
  if(mode==='usage')return 'Complete the source frame: '+maskUsageFrame(record);
  if(mode==='production')return 'Produce the full verified '+record.kind+' with this anchor: '+record.anchor;
  if(mode==='repair')return 'Rebuild the previously missed '+record.kind+' for: '+record.anchor;
  if(mode==='context')return 'Use the construction in a new situation.';
  const slots:string[]=[];
  if(/quelqu[’']un/i.test(record.frame))slots.push('a person');
  if(/quelque chose/i.test(record.frame))slots.push('a thing');
  if(/infinitif/i.test(record.frame))slots.push('an infinitive');
  if(/\bnom\b/i.test(record.frame))slots.push('a noun');
  const details=slots.length?' Include '+slots.join(' and ')+'.':'';
  // These are different structural retrieval cues, NOT a claim of semantic
  // conversation transfer. The task still checks only the P10 source frame.
  if(variant===1)return 'You are editing a French message. Which complete '+record.kind+
    ' with anchor '+record.anchor+' belongs in the message?'+details;
  if(variant===2)return 'A partner asks you to recall a natural French '+record.kind+
    ' built around '+record.anchor+'. Produce the full source pattern.'+details;
  return 'From a new structural cue, produce a '+record.kind+' for '+record.anchor+'.'+details;
}
export function diagnoseUsage(answer:string,record:UsageRecord,mode:UsageMode,records:UsageRecord[]):UsageDiagnosis{
  const typed=String(answer||'').trim();
  if(!typed)return outcome('blank');
  const expected=mode==='usage'?record.blank:record.frame;
  if(canon(typed)===canon(expected))return outcome('exact');
  if(fold(typed)===fold(expected))return outcome('orthography');
  if(mode==='usage'){
    if(['à','de','avec','pour','sur','en','par','sans'].includes(record.blank)&&
       ['à','de','avec','pour','sur','en','par','sans'].includes(canon(typed)))return outcome('connector');
    return outcome('collocate');
  }
  const neighbor=records.some(row=>row.id!==record.id&&row.anchor===record.anchor&&fold(row.frame)===fold(typed));
  if(neighbor)return outcome('neighbor');
  const left=tokens(typed),right=tokens(expected),rset=new Set(right),lset=new Set(left);
  if(!tokens(record.anchor).some(token=>lset.has(token)))return outcome('anchor');
  const connectors=['à','de','avec','pour','sur','en','par','sans'];
  const expectedConnectors=connectors.filter(c=>(' '+canon(expected)+' ').includes(' '+c+' '));
  const actualConnectors=connectors.filter(c=>(' '+canon(typed)+' ').includes(' '+c+' '));
  if(expectedConnectors.some(c=>!actualConnectors.includes(c))&&actualConnectors.some(c=>!expectedConnectors.includes(c)))return outcome('connector');
  const overlap=right.filter(token=>lset.has(token)).length/Math.max(1,right.length);
  if(['collocation','fixed phrase'].includes(record.kind)&&right.some(token=>!lset.has(token)&&!tokens(record.anchor).includes(token)&&!['un','une','de','la','le','des','du','à','avec','quelqu','quelquun'].includes(token)))return outcome('collocate');
  if(left.length===right.length&&[...left].sort().join('|')===[...right].sort().join('|'))return outcome('order');
  if(left.length<right.length&&overlap>=.5)return outcome('incomplete');
  return outcome('structure');
}
export function diagnoseContextUsage(answer:string,scene:ContextScene):UsageDiagnosis{
  const result=assessContextAnswer(answer,scene);
  if(result==='exact')return{code:'exact',label:'Exact model sentence',detail:'Your answer matches this authored context sentence. Other valid French formulations may exist.',correct:true,quality:'exact'};
  if(result==='orthography')return{code:'orthography',label:'Orthography or accents',detail:'Check spelling, accents and apostrophes against the model.',correct:false,quality:'close'};
  if(result==='blank')return{code:'blank',label:'No answer',detail:'Write a complete French response.',correct:false,quality:'review'};
  return{code:'structure',label:'Human review required',detail:'The answer differs from the model. It may be valid French; compare the meaning and grammar before self-assessing. No automatic correctness credit is awarded.',correct:false,quality:'review'};
}
export function freshUsageState():UsageState{
  return{schema:'thiepn-french-usage-v1',
    modes:{usage:{index:0,support:0},production:{index:0,support:0},transfer:{index:0,support:0},context:{index:0,support:0},repair:{index:0,support:0}},
    history:[],tallies:{}};
}
export function safeUsageState(raw:unknown,pack?:Pick<UsagePack,'records'>):UsageState{
  const empty=freshUsageState();
  if(!raw||typeof raw!=='object'||Array.isArray(raw))return empty;
  const x=raw as Partial<UsageState>;
  if(x.schema!==empty.schema)return empty;
  const modes={...empty.modes};
  for(const mode of USAGE_MODES){
    const value=x.modes?.[mode];
    modes[mode]={index:Number.isSafeInteger(value?.index)&&Number(value?.index)>=0&&Number(value?.index)<=10_000_000?Number(value?.index):0,
      support:value?.support===1||value?.support===2?value.support:0};
  }
  const ids=pack?new Set(pack.records.map(r=>r.id)):null;
  const history=Array.isArray(x.history)?x.history.filter((r):r is UsageAttempt=>
    !!r&&typeof r==='object'&&USAGE_MODES.includes(r.mode)&&
    /^p10-\d{3}$/.test(r.recordId)&&(!ids||ids.has(r.recordId))&&
    Number.isSafeInteger(r.at)&&r.at>=0&&r.at<=Date.now()+86400_000&&
    (r.mode!=='context'||(hasContextScenes(r.recordId)&&r.variant!==2))&&
    ['matched','self-assessed','needs-practice'].includes(r.outcome)&&
    Object.hasOwn(LABELS,r.diagnosis)&&[0,1,2].includes(r.support)&&
    (r.variant===undefined||r.variant===0||r.variant===1||r.variant===2)&&
    (r.outcome!=='matched'||r.diagnosis==='exact')
  ).slice(0,300):[];
  // Backward-compatible C2 migration: reconstruct summaries from the bounded
  // legacy history. New C3 attempts update a compact cumulative per-record
  // ledger so the 300-entry UI history limit never inflates mastery accuracy.
  const tallies:UsageState['tallies']={};
  const update=(attempt:UsageAttempt)=>{
    const group:Partial<Record<UsageMode,UsageTally>>=tallies[attempt.recordId]??{};
    const prior=group[attempt.mode];
    group[attempt.mode]=accumulateUsageTally(prior,attempt);
    tallies[attempt.recordId]=group;
  };
  for(const attempt of [...history].sort((a,b)=>a.at-b.at))update(attempt);
  const supplied=x.tallies;
  if(supplied&&typeof supplied==='object'&&!Array.isArray(supplied)){
    for(const [id,group] of Object.entries(supplied)){
      if(!/^p10-\d{3}$/.test(id)||(ids&&!ids.has(id))||!group||typeof group!=='object')continue;
      for(const mode of USAGE_MODES){
        if(mode==='context'&&!hasContextScenes(id))continue;
        const row=group[mode];
        const current=tallies[id]?.[mode];
        if(!row||!Number.isSafeInteger(row.attempts)||row.attempts<0||row.attempts>10_000_000||
           !Number.isSafeInteger(row.exact)||row.exact<0||row.exact>row.attempts||
           !Number.isSafeInteger(row.lastAt)||row.lastAt<0||row.lastAt>Date.now()+86_400_000||
           typeof row.lastIndependent!=='boolean'||!Number.isSafeInteger(row.variantMask)||
           row.variantMask<0||row.variantMask>7||
           !['matched','self-assessed','needs-practice'].includes(row.lastOutcome)||
           !Object.hasOwn(LABELS,row.lastDiagnosis)||row.exact>(row.attempts)||
           (row.lastIndependent&&(row.lastOutcome!=='matched'||row.lastDiagnosis!=='exact'))||
           (current&&(row.attempts<current.attempts||row.lastAt<current.lastAt)))continue;
        tallies[id]??={};tallies[id][mode]={...row};
      }
    }
  }
  return{schema:empty.schema,modes,history,tallies};
}
export function repairCandidates(pack:Pick<UsagePack,'records'>,state:UsageState):UsageRecord[]{
  return rankUsageCandidates(pack,state,'repair').map(row=>row.record);
}
export function currentUsageRecord(pack:Pick<UsagePack,'records'>,state:UsageState,mode:UsageMode,
 lexical?:ReadonlyMap<string,LexicalSignal>):UsageRecord|undefined{
  const rows=rankUsageCandidates(pack,state,mode,Date.now(),lexical);
  if(!rows.length)return undefined;
  const latest=state.history.find(e=>e.mode===mode);
  // Avoid immediate repeats when several candidates exist. A single error
  // remains available in Repair so a learner can actually resolve it.
  const pick=rows.length>1&&latest?rows.find(row=>row.record.id!==latest.recordId):undefined;
  return (pick??rows[0]).record;
}
export function revealUsageSupport(state:UsageState,mode:UsageMode,level:1|2):UsageState{
  const old=state.modes[mode];
  return{...state,modes:{...state.modes,[mode]:{...old,support:Math.max(old.support,level) as 1|2}}};
}
export function accumulateUsageTally(previous:UsageTally|undefined,attempt:UsageAttempt):UsageTally{
  const independent=attempt.outcome==='matched'&&attempt.diagnosis==='exact'&&attempt.support===0;
  const fresh=previous??{attempts:0,exact:0,lastAt:0,lastIndependent:false,
    variantMask:0,lastOutcome:'needs-practice' as const,lastDiagnosis:'blank' as const};
  return {attempts:fresh.attempts+1,exact:fresh.exact+Number(independent),
    lastAt:Math.max(fresh.lastAt,attempt.at),lastIndependent:independent,
    variantMask:fresh.variantMask|(independent?1<<(attempt.variant??0):0),
    lastOutcome:attempt.outcome,lastDiagnosis:attempt.diagnosis};
}
export function completeUsageAttempt(pack:Pick<UsagePack,'records'>,state:UsageState,mode:UsageMode,
 recordId:string,judgment:UsageOutcome,code:UsageCode,at=Date.now(),variant:0|1|2=0,
 lexical?:ReadonlyMap<string,LexicalSignal>):UsageState{
  if(currentUsageRecord(pack,state,mode,lexical)?.id!==recordId)throw Error('STALE_USAGE_RECORD');
  if(!['matched','needs-practice','self-assessed'].includes(judgment)||
     !Object.hasOwn(LABELS,code)||(judgment==='matched'&&code!=='exact')||
     ![0,1,2].includes(variant)||
     (mode==='context'&&!contextScene(recordId,variant as 0|1)))throw Error('INVALID_USAGE_OUTCOME');
  const old=state.modes[mode];
  const attempt:UsageAttempt={recordId,mode,at,outcome:judgment,diagnosis:code,support:old.support,
    ...((mode==='transfer'||mode==='context')?{variant}:{})};
  const group={...(state.tallies[recordId]??{})};
  group[mode]=accumulateUsageTally(group[mode],attempt);
  return {...state,modes:{...state.modes,[mode]:{index:mode==='repair'?0:old.index+1,support:0}},
    history:[attempt,...state.history].slice(0,300),
    tallies:{...state.tallies,[recordId]:group}};
}
