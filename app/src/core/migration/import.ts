import { openFrenchDatabase,readMigrationValue } from '../storage/idb';
import { readLegacySnapshotEnvelope } from './legacy-reader';
import type { LegacySnapshotEnvelope } from './legacy-contract';

const IMPORT_KEY='legacy-import-v1';

export async function preserveLegacyStateOnce():Promise<LegacySnapshotEnvelope|null>{
  const existing=await readMigrationValue<LegacySnapshotEnvelope>(IMPORT_KEY);
  if(existing?.schema==='thiepn-french-legacy-import-v1')return existing;

  const envelope=await readLegacySnapshotEnvelope();
  if(!envelope)return null;

  // Preserve a single immutable first-import envelope even if multiple tabs
  // observe different P35 generations while that older runtime is active.
  // The P35 origin stores themselves remain strictly read-only.
  const db=await openFrenchDatabase();
  try{
    return await new Promise<LegacySnapshotEnvelope>((resolve,reject)=>{
      let chosen=envelope;
      const tx=db.transaction(['migration','meta'],'readwrite');
      const store=tx.objectStore('migration'),meta=tx.objectStore('meta');
      const read=store.get(IMPORT_KEY);
      read.onsuccess=()=>{
        const saved=read.result as LegacySnapshotEnvelope|undefined;
        if(saved?.schema==='thiepn-french-legacy-import-v1'){
          chosen=saved;return;
        }
        store.put(envelope,IMPORT_KEY);
        meta.put(envelope.fingerprint,'legacy-import-fingerprint-v1');
      };
      read.onerror=()=>reject(read.error??Error('Legacy preservation read failed'));
      tx.oncomplete=()=>resolve(chosen);
      tx.onerror=()=>reject(tx.error??Error('Legacy preservation transaction failed'));
      tx.onabort=()=>reject(tx.error??Error('Legacy preservation transaction aborted'));
    });
  }finally{db.close();}
}
