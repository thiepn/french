import {openFrenchDatabase,readMetaValue} from '../storage/idb.ts';
import {safeSourceGraphState,SOURCE_GRAPH_KEY,type SourceGraphState} from './p35-runtime.ts';

/** U72 keeps the original P35 metadata key/schema and backup scope.
 * All source turn, assistance, stage and resume writes use one native IDB
 * read/compare/put transaction, not a second store or in-memory lock.
 */
export class SourceGraphWriteConflictError extends Error{
 constructor(){
  super('Original source dialogue changed in another tab; no stale step was saved.');
  this.name='SourceGraphWriteConflictError';
 }
}
function canonicalSourceSnapshot(input:unknown):string{
 const s=safeSourceGraphState(input);
 // Empty originals and normalized reads may have a different property order.
 // Compare the complete same-schema data in one fixed order. No key is omitted.
 return JSON.stringify({schema:s.schema,active:s.active,mission:s.mission,
  history:s.history,evidence:s.evidence,maxLevel:s.maxLevel,
  missionHistory:s.missionHistory??[]});
}
export function sameSourceGraphSnapshot(current:unknown,expected:SourceGraphState):boolean{
 return canonicalSourceSnapshot(current)===canonicalSourceSnapshot(expected);
}
export async function loadSourceGraphState():Promise<SourceGraphState>{
 return safeSourceGraphState(await readMetaValue<SourceGraphState>(SOURCE_GRAPH_KEY));
}
export async function persistSourceGraphState(
 next:SourceGraphState,expected:SourceGraphState
):Promise<SourceGraphState>{
 const safeNext=safeSourceGraphState(next);
 const db=await openFrenchDatabase();
 try{
  return await new Promise<SourceGraphState>((resolve,reject)=>{
   const tx=db.transaction('meta','readwrite');
   const meta=tx.objectStore('meta');
   let conflict=false;
   const request=meta.get(SOURCE_GRAPH_KEY);
   request.onsuccess=()=>{
    try{
     if(!sameSourceGraphSnapshot(request.result,expected)){
      conflict=true;
      return; // Read-only transaction completion; never write stale data.
     }
     meta.put(safeNext,SOURCE_GRAPH_KEY);
    }catch{tx.abort();}
   };
   tx.oncomplete=()=>{
    if(conflict)reject(new SourceGraphWriteConflictError());
    else resolve(safeNext);
   };
   tx.onerror=()=>reject(tx.error??new Error('Original P35 graph transaction failed.'));
   tx.onabort=()=>reject(tx.error??new Error('Original P35 graph transaction aborted.'));
  });
 }finally{db.close();}
}
