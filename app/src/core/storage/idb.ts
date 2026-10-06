import type { HydratedLearnerState } from './hydrate';
const DB='thiepn-french-vnext',STORE='meta';
function open():Promise<IDBDatabase>{return new Promise((resolve,reject)=>{const r=indexedDB.open(DB,1);r.onupgradeneeded=()=>{if(!r.result.objectStoreNames.contains(STORE))r.result.createObjectStore(STORE);};r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error??new Error('Could not open vNext storage.'));});}
export async function readLearnerSummary():Promise<HydratedLearnerState>{
  if(!('indexedDB' in globalThis))return{};
  const db=await open();try{return await new Promise((resolve,reject)=>{const r=db.transaction(STORE,'readonly').objectStore(STORE).get('learner-summary');r.onsuccess=()=>resolve(r.result&&typeof r.result==='object'?r.result as HydratedLearnerState:{});r.onerror=()=>reject(r.error??new Error('Could not read learner summary.'));});}finally{db.close();}
}
