/**
 * U69 B2 continuation derived from original U65–U68 aggregate receipts.
 * Pure read-only projection: no new evaluator, benchmark, scheduler or store.
 * P35 P28/P29 define no B2 benchmark battery; this path cannot manufacture one.
 */
import {B2_EVIDENCE_DAYS,currentB2Evidence,type B2Evidence,type B2Attempt} from './b2-assessment.ts';
import {currentP33Evidence,P33_VALID_MS,type P33PairReceipt} from './b2-oral.ts';

export const B2_PATH_PHASES=['p31','p32','p33'] as const;
export type B2PathPhase=typeof B2_PATH_PHASES[number];
export type B2PathStatus='current'|'missing'|'blocked'|'expired'|'scored-retest-needed'|'source-changed';
export interface B2PathStep{
 phase:B2PathPhase;
 title:string;
 state:B2PathStatus;
 detail:string;
 lastAt?:number;
 expiresAt?:number;
 action:string;
 route:'b2-assess'|'b2-oral';
}
export interface B2Pathway{
 steps:[B2PathStep,B2PathStep,B2PathStep];
 completed:number;
 next:B2PathStep|null;
 sourceVerified:boolean;
 oralResumable:boolean;
 benchmark:{level:'B2';available:false;reason:string};
 maintenance:{level:'B2';available:false;reason:string};
}
const DAY=86_400_000;
const LAST=(history:readonly B2Attempt[],kind:'p31'|'p32')=>
 [...history].reverse().find(e=>e.kind===kind&&e.status!=='unscored')??null;
const ORAL_LAST=(history:readonly P33PairReceipt[])=>
 [...history].reverse().find(e=>e.status!=='unscored')??null;
const validTime=(at:number,window:number,now:number)=>at>0&&at<=now&&now-at<=window;
function stage(
 phase:B2PathPhase,title:string,state:B2PathStatus,detail:string,
 action:string,route:B2PathStep['route'],lastAt?:number,expiresAt?:number
):B2PathStep{
 return{phase,title,state,detail,action,route,
  ...(lastAt!==undefined?{lastAt}:{}),
  ...(expiresAt!==undefined?{expiresAt}:{})};
}
export function deriveB2Pathway(
 evidence:B2Evidence,sourceDigest:string|null,now=Date.now()
):B2Pathway{
 const sourceVerified=typeof sourceDigest==='string'&&/^[0-9a-f]{64}$/.test(sourceDigest);
 const p31=currentB2Evidence(evidence,'p31',now);
 const p32=sourceVerified?currentB2Evidence(evidence,'p32',now,sourceDigest??undefined):null;
 const p33=sourceVerified?currentP33Evidence(evidence.oralHistory??[],sourceDigest??'',Boolean(p31&&p32),now):null;
 const previous31=LAST(evidence.history,'p31');
 const previous32=LAST(evidence.history,'p32');
 const previous33=ORAL_LAST(evidence.oralHistory??[]);
 const p31Status:B2PathStatus=p31?'current':previous31?
  previous31.status==='insufficient'?'scored-retest-needed':
  !validTime(previous31.at,B2_EVIDENCE_DAYS*DAY,now)?'expired':'missing':'missing';
 const step31=stage('p31','P31 · Independent argumentation',p31Status,
  p31?'Two independent argument responses met observable structural thresholds.':
  p31Status==='expired'?'The last qualifying argument evidence is older than 35 days.':
  p31Status==='scored-retest-needed'?'The latest scored P31 attempt did not meet the structural gates.':
  'Complete two independent written argument tasks.',
  p31?'Review P31 evidence':'Open P31 assessment','b2-assess',
  previous31?.at,p31?.at!==undefined?p31.at+B2_EVIDENCE_DAYS*DAY:undefined);
 let p32Status:B2PathStatus;
 let p32Detail:string;
 if(!sourceVerified){p32Status='blocked';p32Detail='Original P35 B2 reading-pack revision cannot be verified. No source-transfer credit can be granted.';}
 else if(!p31){p32Status='blocked';p32Detail='A current P31 structural result is required before P32.';}
 else if(p32){p32Status='current';p32Detail='Original-source reading and listening receipts match this installed P35 source digest.';}
 else if(previous32?.status==='insufficient'){p32Status='scored-retest-needed';p32Detail='The latest scored P32 source-transfer attempt did not meet the structural gates.';}
 else if(previous32?.status==='structural-targets-met'&&
  previous32.tasks.some(t=>t.sourceDigest!==sourceDigest)){
  p32Status='source-changed';p32Detail='The last P32 source digest differs from the current original P35 reading pack; repeat the source tasks.';
 }else if(previous32&&!validTime(previous32.at,B2_EVIDENCE_DAYS*DAY,now)){
  p32Status='expired';p32Detail='The P32 source-transfer evidence is older than 35 days.';
 }else{p32Status='missing';p32Detail='Complete one verified original reading and one independently completed listening response.';}
 const step32=stage('p32','P32 · Original-source transfer',p32Status,p32Detail,
  p32?'Review P32 evidence':'Open P32 source assessment','b2-assess',
  previous32?.at,p32?.at!==undefined?p32.at+B2_EVIDENCE_DAYS*DAY:undefined);
 let p33Status:B2PathStatus;
 let p33Detail:string;
 if(!sourceVerified||!p31||!p32){p33Status='blocked';p33Detail='Current P31 and source-revision-bound P32 evidence are required for an oral assessment.';}
 else if(p33){p33Status='current';p33Detail='Both original oral tasks met bounded recognition/timing structural thresholds.';}
 else if(previous33?.status==='insufficient'){p33Status='scored-retest-needed';p33Detail='The latest scored P33 oral pair did not meet the observable thresholds.';}
 else if(previous33?.status==='structural-targets-met'&&previous33.sourceDigest!==sourceDigest){
  p33Status='source-changed';p33Detail='The oral evidence was bound to a different P35 reading source revision.';
 }else if(previous33&&!validTime(previous33.at,P33_VALID_MS,now)){
  p33Status='expired';p33Detail='The last qualifying P33 oral evidence is older than 35 days.';
 }else{p33Status='missing';p33Detail='Complete the immediate and 20-second-preparation spoken tasks with usable device recognition.';}
 const oralResumable=Boolean(evidence.oralSession&&p31&&p32);
 const step33=stage('p33','P33 · Spontaneous speaking',p33Status,
  oralResumable&&p33Status!=='current'?
   'A previous oral pair has a resumable task checkpoint. An interrupted take must be repeated; transcript and audio were not saved.':
   p33Detail,
  oralResumable&&p33Status!=='current'?'Resume P33 oral pair':
  p33?'Review P33 oral evidence':'Open P33 oral assessment','b2-oral',
  previous33?.at,p33?.at!==undefined?p33.at+P33_VALID_MS:undefined);
 const steps:[B2PathStep,B2PathStep,B2PathStep]=[step31,step32,step33];
 return{
  steps,completed:steps.filter(x=>x.state==='current').length,
  next:steps.find(x=>x.state!=='current')??null,sourceVerified,oralResumable,
  benchmark:{level:'B2',available:false,reason:'P35 P28 has no audited B2 mission battery. Three structural results cannot create a functional benchmark pass.'},
  maintenance:{level:'B2',available:false,reason:'P35 P29 derives maintenance only from genuine P28 passes. B2 has no P28 battery or maintenance status.'}
 };
}
