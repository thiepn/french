import {
  LEGACY_DEPTH_DB,
  LEGACY_DEPTH_SCHEMA,
  LEGACY_DEPTH_STATE_KEY,
  LEGACY_DEPTH_STORE,
  LEGACY_DEPTH_VERSION,
  LEGACY_PHASE_PROPERTY_BY_STORAGE_KEY,
  LEGACY_STORAGE_KEYS,
  type JsonObject,
  type LegacySnapshotEnvelope
} from './legacy-contract';

const BASE_FIELD_BY_KEY: Record<string,string> = {
  [LEGACY_STORAGE_KEYS.progress]:'progress',
  [LEGACY_STORAGE_KEYS.settings]:'settings',
  [LEGACY_STORAGE_KEYS.reviewLog]:'reviewLog',
  [LEGACY_STORAGE_KEYS.studyDays]:'studyDays',
  [LEGACY_STORAGE_KEYS.profile]:'profile',
  [LEGACY_STORAGE_KEYS.mistakeLog]:'mistakeLog',
  [LEGACY_STORAGE_KEYS.resumeSnapshot]:'resumeSnapshot',
  [LEGACY_STORAGE_KEYS.customDecks]:'customDecks',
  [LEGACY_STORAGE_KEYS.sessionHistory]:'sessionHistory',
  [LEGACY_STORAGE_KEYS.studyPlan]:'studyPlan',
  [LEGACY_STORAGE_KEYS.userCards]:'userCards',
  [LEGACY_STORAGE_KEYS.cardEdits]:'cardEdits',
  [LEGACY_STORAGE_KEYS.smartDecks]:'smartDecks'
};

function parseStorageJson(key:string):unknown {
  try {
    const raw=localStorage.getItem(key);
    return raw===null?undefined:JSON.parse(raw);
  } catch {
    return undefined;
  }
}

function legacyMarkerExists():boolean {
  try {
    if(localStorage.getItem(LEGACY_STORAGE_KEYS.updatedAt)) return true;
    for(const key of Object.values(LEGACY_STORAGE_KEYS)){
      if(key===LEGACY_STORAGE_KEYS.updatedAt) continue;
      if(localStorage.getItem(key)!==null) return true;
    }
  } catch {}
  return false;
}

async function legacyDatabaseExists(name:string):Promise<boolean> {
  if(!('indexedDB' in globalThis)) return false;
  const factory=indexedDB as IDBFactory & {databases?:()=>Promise<Array<{name?:string;version?:number}>>};
  if(typeof factory.databases==='function'){
    try {
      const rows=await factory.databases();
      return rows.some(row=>row.name===name);
    } catch {}
  }
  return legacyMarkerExists();
}

async function readDepthSnapshot():Promise<JsonObject|null> {
  if(!(await legacyDatabaseExists(LEGACY_DEPTH_DB))) return null;

  return new Promise(resolve=>{
    let created=false;
    const request=indexedDB.open(LEGACY_DEPTH_DB);

    request.onupgradeneeded=()=>{
      created=true;
      try{request.transaction?.abort();}catch{}
    };

    request.onerror=()=>resolve(null);
    request.onsuccess=()=>{
      const db=request.result;
      if(created||!db.objectStoreNames.contains(LEGACY_DEPTH_STORE)){
        db.close();
        resolve(null);
        return;
      }
      try{
        const tx=db.transaction(LEGACY_DEPTH_STORE,'readonly');
        const get=tx.objectStore(LEGACY_DEPTH_STORE).get(LEGACY_DEPTH_STATE_KEY);
        get.onsuccess=()=>{
          const value=get.result;
          resolve(value&&typeof value==='object'&&!Array.isArray(value)?value as JsonObject:null);
        };
        get.onerror=()=>resolve(null);
        tx.oncomplete=()=>db.close();
        tx.onabort=()=>db.close();
      }catch{
        db.close();
        resolve(null);
      }
    };
  });
}

function readLocalStorageSnapshot():JsonObject|null {
  if(!legacyMarkerExists()) return null;

  const payload:JsonObject={
    updatedAt:Number(localStorage.getItem(LEGACY_STORAGE_KEYS.updatedAt))||Date.now(),
    version:'5.24.0-local-storage-fallback',
    schema:0
  };

  let meaningful=false;
  for(const [key,field] of Object.entries(BASE_FIELD_BY_KEY)){
    const value=parseStorageJson(key);
    if(value!==undefined){
      payload[field]=value;
      meaningful=true;
    }
  }

  for(const [key,field] of Object.entries(LEGACY_PHASE_PROPERTY_BY_STORAGE_KEY)){
    const value=parseStorageJson(key);
    if(value!==undefined){
      payload[field]=value;
      meaningful=true;
    }
  }

  return meaningful?payload:null;
}

async function fingerprintPayload(payload:JsonObject):Promise<string> {
  let text='';
  try{text=JSON.stringify(payload);}catch{return 'unserializable';}
  if(!crypto?.subtle) return `len-${text.length}`;
  const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(text));
  return [...new Uint8Array(digest)].map(value=>value.toString(16).padStart(2,'0')).join('');
}

function finiteTimestamp(value:unknown):number {
  const n=Number(value);
  return Number.isFinite(n)&&n>0?n:0;
}

export async function readLegacySnapshotEnvelope():Promise<LegacySnapshotEnvelope|null> {
  const depth=await readDepthSnapshot();
  const fallback=depth?null:readLocalStorageSnapshot();
  const payload=depth??fallback;
  if(!payload) return null;

  const source=depth?'depth-db':'local-storage';
  const sourceUpdatedAt=finiteTimestamp(payload.updatedAt);
  const sourceVersion=typeof payload.version==='string'?payload.version:(depth?LEGACY_DEPTH_VERSION:'unknown');
  const sourceSchema=Number.isFinite(Number(payload.schema))?Number(payload.schema):(depth?LEGACY_DEPTH_SCHEMA:0);

  return {
    schema:'thiepn-french-legacy-import-v1',
    source,
    capturedAt:Date.now(),
    sourceUpdatedAt,
    sourceVersion,
    sourceSchema,
    fingerprint:await fingerprintPayload(payload),
    payload
  };
}
