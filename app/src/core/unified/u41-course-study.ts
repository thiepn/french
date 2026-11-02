import {
 compareAndSetOriginalCourseStudy,readCanonicalLearnerState
} from '../learner/repository.ts';
import {ORIGINAL_REGISTRY_ENTRIES,getOriginalCatalogEntry} from './u23-registry.ts';

const KEY='vU41OriginalCourseStudy';
const SCHEMA='original-course-studied-v1';
export interface StudiedCourseLesson {
 readonly id:string;
 readonly qualifiedId:string;
 readonly sourceRevision:string;
 readonly markedAt:number;
}
export interface OriginalCourseStudy {
 readonly schema:typeof SCHEMA;
 readonly token:string;
 readonly updatedAt:number;
 readonly studied:readonly StudiedCourseLesson[];
}
export type StudyReview=Readonly<{
 status:'empty'|'ready'|'blocked'|'unavailable';
 record:OriginalCourseStudy|null;
 expectedToken:string|null;
 message:string;
}>;
const obj=(v:unknown):Record<string,unknown>|null=>
 v!==null&&typeof v==='object'&&!Array.isArray(v)?v as Record<string,unknown>:null;

export function reviewOriginalCourseStudy(value:unknown,now=Date.now()):StudyReview{
 if(value==null)return{status:'empty',record:null,expectedToken:null,
  message:'No lessons marked studied on this device.'};
 const raw=obj(value),token=typeof raw?.token==='string'?raw.token:null;
 if(!raw||raw.schema!==SCHEMA||!token||token.length<8||token.length>100||
    !Array.isArray(raw.studied)||raw.studied.length>ORIGINAL_REGISTRY_ENTRIES.length||
    !Number.isSafeInteger(raw.updatedAt)||Number(raw.updatedAt)>now+300000||
    Number(raw.updatedAt)<1)return{status:'blocked',record:null,expectedToken:token,
     message:'Saved study markers are unrecognized or invalid. No automatic overwrite.'};
 const seen=new Set<string>();
 for(const value of raw.studied){
  const row=obj(value),entry=getOriginalCatalogEntry(String(row?.id??''));
  if(!row||!entry||seen.has(entry.id)||row.qualifiedId!==entry.qualifiedId||
     row.sourceRevision!==entry.sourceRevision||!Number.isSafeInteger(row.markedAt)||
     Number(row.markedAt)<1||Number(row.markedAt)>now+300000)
   return{status:'blocked',record:null,expectedToken:token,
    message:'A studied lesson or source revision changed. Existing markers are preserved for review.'};
  seen.add(entry.id);
 }
 return{status:'ready',record:raw as unknown as OriginalCourseStudy,expectedToken:token,
  message:'Self-marked study activity only. Not a quiz grade or CEFR award.'};
}
export async function readOriginalCourseStudy():Promise<StudyReview>{
 try{
  const learner=await readCanonicalLearnerState();
  if(!learner)return{status:'unavailable',record:null,expectedToken:null,
    message:'Canonical learner storage not initialized; studied markers unavailable.'};
  return reviewOriginalCourseStudy(learner.featureState?.[KEY]);
 }catch{
  return{status:'unavailable',record:null,expectedToken:null,
   message:'Canonical learner storage unavailable. No studied marker saved.'};
 }
}
/** Only an explicit Mark/Unmark user action writes the canonical learner row.
 * Existing featureState keys are transactionally preserved; no activity, SRS,
 * CEFR, answer, writing, source body or duplicate progress store is updated.
 */
export async function setOriginalCourseStudied(
 current:StudyReview, id:string,mark:boolean
):Promise<{outcome:'saved'|'conflict'|'blocked';review:StudyReview}>{
 if(current.status!=='empty'&&current.status!=='ready')return{outcome:'blocked',review:current};
 const entry=getOriginalCatalogEntry(id);
 if(!entry)return{outcome:'blocked',review:current};
 const old=current.record?.studied??[];
 const kept=old.filter(row=>row.id!==id);
 if(mark&&kept.length>=ORIGINAL_REGISTRY_ENTRIES.length)return{outcome:'blocked',review:current};
 const nextRecords=mark?[...kept,{
   id,qualifiedId:entry.qualifiedId,sourceRevision:entry.sourceRevision,markedAt:Date.now()
  }]:kept;
 const next:OriginalCourseStudy={
  schema:SCHEMA,token:crypto.randomUUID(),updatedAt:Date.now(),
  studied:nextRecords.sort((a,b)=>
   (getOriginalCatalogEntry(a.id)?.order??0)-(getOriginalCatalogEntry(b.id)?.order??0))
 };
 // Fail closed if source shape drifted during the user interaction.
 if(reviewOriginalCourseStudy(next).status!=='ready')return{outcome:'blocked',review:current};
 const result=await compareAndSetOriginalCourseStudy(current.expectedToken,next);
 if(result==='conflict')return{outcome:'conflict',review:await readOriginalCourseStudy()};
 return{outcome:'saved',review:reviewOriginalCourseStudy(next)};
}
