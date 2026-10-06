import type { HydratedLearnerState } from './hydrate';

const DB_NAME='thiepn-french-vnext';
const DB_VERSION=2;
const META_STORE='meta';
const MIGRATION_STORE='migration';

function openDatabase():Promise<IDBDatabase>{
  return new Promise((resolve,reject)=>{
    const request=indexedDB.open(DB_NAME,DB_VERSION);
    request.onupgradeneeded=()=>{
      const db=request.result;
      if(!db.objectStoreNames.contains(META_STORE))db.createObjectStore(META_STORE);
      if(!db.objectStoreNames.contains(MIGRATION_STORE))db.createObjectStore(MIGRATION_STORE);
    };
    request.onsuccess=()=>resolve(request.result);
    request.onerror=()=>reject(request.error??new Error('Could not open French vNext storage.'));
  });
}

async function getValue<T>(store:string,key:string):Promise<T|undefined>{
  if(!('indexedDB' in globalThis))return undefined;
  const db=await openDatabase();
  try{
    return await new Promise((resolve,reject)=>{
      const tx=db.transaction(store,'readonly');
      const request=tx.objectStore(store).get(key);
      request.onsuccess=()=>resolve(request.result as T|undefined);
      request.onerror=()=>reject(request.error??new Error('Could not read French vNext state.'));
    });
  }finally{db.close();}
}

async function putValue(store:string,key:string,value:unknown):Promise<void>{
  if(!('indexedDB' in globalThis))return;
  const db=await openDatabase();
  try{
    await new Promise<void>((resolve,reject)=>{
      const tx=db.transaction(store,'readwrite');
      tx.objectStore(store).put(value,key);
      tx.oncomplete=()=>resolve();
      tx.onerror=()=>reject(tx.error??new Error('Could not write French vNext state.'));
      tx.onabort=()=>reject(tx.error??new Error('French vNext state write was aborted.'));
    });
  }finally{db.close();}
}

export async function readLearnerSummary():Promise<HydratedLearnerState>{
  return (await getValue<HydratedLearnerState>(META_STORE,'learner-summary'))??{};
}

export function writeMetaValue(key:string,value:unknown):Promise<void>{
  return putValue(META_STORE,key,value);
}

export function readMigrationValue<T>(key:string):Promise<T|undefined>{
  return getValue<T>(MIGRATION_STORE,key);
}

export function writeMigrationValue(key:string,value:unknown):Promise<void>{
  return putValue(MIGRATION_STORE,key,value);
}
