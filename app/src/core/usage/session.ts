import type {UsagePack,UsageRecord} from '../content/loader';

export const USAGE_MODES=['usage','production','transfer','repair'] as const;
export type UsageMode=typeof USAGE_MODES[number];
export type UsageCode='exact'|'orthography'|'connector'|'collocate'|'neighbor'|'incomplete'|'order'|'anchor'|'structure'|'blank';
export type UsageOutcome='matched'|'self-assessed'|'needs-practice';
export interface UsageAttempt{
  recordId:string;mode:UsageMode;at:number;outcome:UsageOutcome;diagnosis:UsageCode;support:0|1|2;
}
export interface UsageState{
  schema:'thiepn-french-usage-v1';
  modes:Record<UsageMode,{index:number;support:0|1|2}>;
  history:UsageAttempt[];
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
  // Match a complete lexical element, never a substring inside "décider" or "demander".
  const escaped=record.blank.replace(/[.*+?^$\x7b\x7d()|[\]\\]/g,'\\  const start=record.frame.indexOf(record.blank);
  if(start<0)throw Error('INVALID_VERIFIED_BLANK');
  return record.frame.slice(0,start)+'_____ '+record.frame.slice(start+record.blank.length).trimStart();');
  const match=new RegExp('(?<![\\p{L}\\p{N}])'+escaped+'(?![\\p{L}\\p{N}])','iu').exec(record.frame);
  if(!match)throw Error('INVALID_VERIFIED_BLANK');
  return record.frame.slice(0,match.index)+'_____ '+record.frame.slice(match.index+match[0].length).trimStart();
}
export function usageCue(record:UsageRecord,mode:UsageMode):string{
  if(mode==='usage')return 'Complete the source frame: '+maskUsageFrame(record);
  if(mode==='production')return 'Produce the full verified '+record.kind+' with this anchor: '+record.anchor;
  if(mode==='repair')return 'Rebuild the previously missed '+record.kind+' for: '+record.anchor;
  const slots:string[]=[];
  if(/quelqu[’']un/i.test(record.frame))slots.push('a person');
  if(/quelque chose/i.test(record.frame))slots.push('a thing');
  if(/infinitif/i.test(record.frame))slots.push('an infinitive');
  if(/\bnom\b/i.test(record.frame))slots.push('a noun');
  return 'From a new structural cue, produce a '+record.kind+' for '+record.anchor+
    (slots.length?' involving '+slots.join(' and '):'')+'.';
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
export function freshUsageState():UsageState{
  return{schema:'thiepn-french-usage-v1',
    modes:{usage:{index:0,support:0},production:{index:0,support:0},transfer:{index:0,support:0},repair:{index:0,support:0}},
    history:[]};
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
    ['matched','self-assessed','needs-practice'].includes(r.outcome)&&
    Object.hasOwn(LABELS,r.diagnosis)&&[0,1,2].includes(r.support)&&
    (r.outcome!=='matched'||r.diagnosis==='exact')
  ).slice(0,300):[];
  return{schema:empty.schema,modes,history};
}
export function repairCandidates(pack:Pick<UsagePack,'records'>,state:UsageState):UsageRecord[]{
  const byId=new Map(pack.records.map(r=>[r.id,r]));
  const seen=new Set<string>(),pending:UsageRecord[]=[];
  for(const event of state.history){
    if(seen.has(event.recordId))continue;seen.add(event.recordId);
    const record=byId.get(event.recordId);
    if(record&&event.outcome==='needs-practice')pending.push(record);
  }
  return pending;
}
export function currentUsageRecord(pack:Pick<UsagePack,'records'>,state:UsageState,mode:UsageMode):UsageRecord|undefined{
  const rows=mode==='repair'?repairCandidates(pack,state):pack.records;
  if(!rows.length)return undefined;
  return rows[state.modes[mode].index%rows.length];
}
export function revealUsageSupport(state:UsageState,mode:UsageMode,level:1|2):UsageState{
  const old=state.modes[mode];
  return{...state,modes:{...state.modes,[mode]:{...old,support:Math.max(old.support,level) as 1|2}}};
}
export function completeUsageAttempt(pack:Pick<UsagePack,'records'>,state:UsageState,mode:UsageMode,
 recordId:string,judgment:UsageOutcome,code:UsageCode,at=Date.now()):UsageState{
  if(!currentUsageRecord(pack,state,mode)||currentUsageRecord(pack,state,mode)?.id!==recordId)throw Error('STALE_USAGE_RECORD');
  if(!['matched','needs-practice','self-assessed'].includes(judgment)||
     !Object.hasOwn(LABELS,code)||(judgment==='matched'&&code!=='exact'))throw Error('INVALID_USAGE_OUTCOME');
  const old=state.modes[mode];
  return{...state,modes:{...state.modes,[mode]:{index:mode==='repair'?0:old.index+1,support:0}},
    history:[{recordId,mode,at,outcome:judgment,diagnosis:code,support:old.support},...state.history].slice(0,300)};
}
