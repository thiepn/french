import {ORIGINAL_SENSES,type CandidateDecision,type DraftReview} from './u2-review.ts';
import {sourceId} from './source.ts';
import type {CrosswalkReport} from './crosswalk.ts';

export interface ReviewPreview {
 readonly state:'ready'|'blocked';
 readonly issues:readonly string[];
 readonly pending:readonly CandidateDecision[];
 readonly sourceRevision:string|null;
 readonly targetRevision:string|null;
 readonly schema:'thiepn-french-u3-review-inspection-v1';
 readonly importedIntoLearner:false;
 readonly approved:false;
}
const ROOT_KEYS=['schema','authority','approved','progressImported','sourceRevision','targetRevision','decisions','lossSummary'];
const DECISION_KEYS=['sourceId','targetId','status','note'];
const SUMMARY_KEYS=['source','target','candidateOnly','ambiguous','unmatched','insufficientSense','invalid','unusedTargets'];
const MAX_BYTES=256*1024;
const MAX_DECISIONS=250;
const MAX_NOTES=600;
function exactKeys(value:Record<string,unknown>,allowed:readonly string[]):boolean{
 return Object.keys(value).length===allowed.length&&Object.keys(value).every(key=>allowed.includes(key));
}
function record(value:unknown):value is Record<string,unknown>{
 return !!value&&typeof value==='object'&&!Array.isArray(value);
}
/**
 * Validate an explicit user-selected export against the CURRENT verified index.
 * A successful preview is not authorization to merge a source sense or write progress.
 */
export function inspectReviewExport(raw:string,report:CrosswalkReport,currentRevision:string|null):ReviewPreview{
 const issues:string[]=[];
 const base=(pending:readonly CandidateDecision[]=[],sourceRevision:string|null=null,targetRevision:string|null=null):ReviewPreview=>Object.freeze({
  schema:'thiepn-french-u3-review-inspection-v1',state:issues.length?'blocked' as const:'ready' as const,
  issues:Object.freeze([...issues]),pending:Object.freeze([...pending]),sourceRevision,targetRevision,
  importedIntoLearner:false as const,approved:false as const
 });
 if(new TextEncoder().encode(raw).byteLength>MAX_BYTES){issues.push('File exceeds 256 KiB limit.');return base();}
 let data:unknown;
 try{data=JSON.parse(raw);}catch{issues.push('Invalid JSON.');return base();}
 if(!record(data)||!exactKeys(data,ROOT_KEYS)){issues.push('Unexpected or missing export fields.');return base();}
 const sourceRevision=data.sourceRevision,targetRevision=data.targetRevision;
 if(data.schema!=='thiepn-french-u2-lexical-review-draft-v1'||data.authority!=='review-only'
  ||data.approved!==false||data.progressImported!==false){issues.push('Export is not an unapproved review-only U2 draft.');}
 if(sourceRevision!=='unified-u1-original-v1')issues.push('Original source revision mismatch.');
 if(typeof targetRevision!=='string'||!targetRevision||currentRevision===null||targetRevision!==currentRevision)
  issues.push('Native index revision mismatch or index unavailable. Re-review against this device’s verified index.');
 const summary=data.lossSummary;
 if(!record(summary)||!exactKeys(summary,SUMMARY_KEYS)||SUMMARY_KEYS.some(key=>
  !Number.isSafeInteger(summary[key])||(summary[key] as number)<0))issues.push('Loss summary has unexpected values.');
 if(!Array.isArray(data.decisions)||data.decisions.length>MAX_DECISIONS||data.decisions.length<1)
  issues.push('Decision count is invalid or exceeds the review limit.');
 if(issues.length)return base([],typeof sourceRevision==='string'?sourceRevision:null,typeof targetRevision==='string'?targetRevision:null);
 const bySource=new Map(ORIGINAL_SENSES.map(s=>[s.sourceId,s]));
 const byLexeme=new Map(report.rows.map(row=>[row.from,row]));
 const seen=new Set<string>(),pending:CandidateDecision[]=[];
 for(const candidate of data.decisions as unknown[]){
  if(!record(candidate)||!exactKeys(candidate,DECISION_KEYS)){issues.push('Invalid decision shape.');break;}
  const {sourceId:origin,targetId,status,note}=candidate;
  if(typeof origin!=='string'||!bySource.has(origin)||seen.has(origin)){
   issues.push('Unknown or duplicate original sense.');break;
  }
  if(typeof note!=='string'||note.length>MAX_NOTES){
   issues.push('Invalid decision rationale length.');break;
  }
  if(!['needs-evidence','proposed-match','rejected'].includes(String(status))){
   issues.push('Unsupported decision status.');break;
  }
  const sense=bySource.get(origin)!;
  const choices=byLexeme.get(sourceId('original','lexeme',sense.id))?.to??[];
  if(targetId!==null&&(typeof targetId!=='string'||!choices.includes(targetId))){
   issues.push('Target is not a current exact-form candidate.');break;
  }
  if(status==='proposed-match'&&(targetId===null||!note.trim())){
   issues.push('Proposed match requires a target and written rationale.');break;
  }
  seen.add(origin);
  pending.push(Object.freeze({sourceId:origin,targetId:targetId as string|null,
   status:status as CandidateDecision['status'],note:note.trim()}));
 }
 // Atomic inspection: one invalid decision blocks the whole file; no partial queue.
 if(issues.length)return base([],sourceRevision as string,targetRevision as string);
 return base(pending,sourceRevision as string,targetRevision as string);
}
export function reviewPreviewIsAuthoritative(_preview:ReviewPreview):false{return false;}
