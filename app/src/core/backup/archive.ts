import { openFrenchDatabase } from '../storage/idb';

const BACKUP_SCHEMA='thiepn-french-vnext-backup-v1' as const;
const DB_NAME='thiepn-french-vnext';
const DB_VERSION=5;
const STORE_NAMES=['learner','srs','activity','user-content','session','meta','migration'] as const;
type StoreName=typeof STORE_NAMES[number];
type JsonKey=string|number;
export interface BackupRow{key:JsonKey;value:unknown}
export interface BackupPayload{dbName:string;dbVersion:number;stores:Record<StoreName,BackupRow[]>}
export interface FrenchBackupArchive{
  schema:typeof BACKUP_SCHEMA;
  app:'French';
  createdAt:number;
  checksum:string;
  payload:BackupPayload;
}
export interface BackupInspection{
  archive:FrenchBackupArchive;
  totalRows:number;
  rowsByStore:Record<StoreName,number>;
  createdAt:number;
}

function requestResult<T>(request:IDBRequest<T>):Promise<T>{
  return new Promise((resolve,reject)=>{
    request.onsuccess=()=>resolve(request.result);
    request.onerror=()=>reject(request.error??new Error('IndexedDB request failed.'));
  });
}
async function sha256(text:string):Promise<string>{
  if(!crypto?.subtle)throw new Error('Web Crypto is required for backup integrity.');
  const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(text));
  return [...new Uint8Array(digest)].map(value=>value.toString(16).padStart(2,'0')).join('');
}
function safeKey(value:IDBValidKey):JsonKey{
  if(typeof value==='string'||typeof value==='number')return value;
  throw new Error('French backup encountered an unsupported database key type.');
}
async function dumpStore(db:IDBDatabase,name:StoreName):Promise<BackupRow[]>{
  const tx=db.transaction(name,'readonly');
  const store=tx.objectStore(name);
  const [keys,values]=await Promise.all([
    requestResult(store.getAllKeys()),
    requestResult(store.getAll())
  ]);
  return keys.map((key,index)=>({key:safeKey(key),value:values[index]}));
}
function assertRows(value:unknown,name:StoreName):BackupRow[]{
  if(!Array.isArray(value))throw new Error('Backup store '+name+' is missing.');
  return value.map((row,index)=>{
    if(!row||typeof row!=='object'||Array.isArray(row))throw new Error('Invalid row in '+name+' at '+index+'.');
    const item=row as Record<string,unknown>;
    if(typeof item.key!=='string'&&typeof item.key!=='number')throw new Error('Invalid key in '+name+' at '+index+'.');
    return{key:item.key,value:item.value};
  });
}

export async function createBackupArchive(now=Date.now()):Promise<{archive:FrenchBackupArchive;text:string;filename:string}>{
  const db=await openFrenchDatabase();
  try{
    const stores={} as Record<StoreName,BackupRow[]>;
    for(const name of STORE_NAMES)stores[name]=await dumpStore(db,name);
    const payload:BackupPayload={dbName:DB_NAME,dbVersion:DB_VERSION,stores};
    const checksum=await sha256(JSON.stringify(payload));
    const archive:FrenchBackupArchive={schema:BACKUP_SCHEMA,app:'French',createdAt:now,checksum,payload};
    const stamp=new Date(now).toISOString().replace(/[:.]/g,'-');
    return{archive,text:JSON.stringify(archive,null,2),filename:'french-backup-'+stamp+'.json'};
  }finally{db.close();}
}

export async function inspectBackupArchive(text:string):Promise<BackupInspection>{
  let raw:unknown;
  try{raw=JSON.parse(text);}catch{throw new Error('Backup is not valid JSON.');}
  if(!raw||typeof raw!=='object'||Array.isArray(raw))throw new Error('Backup root is invalid.');
  const candidate=raw as Record<string,unknown>;
  if(candidate.schema!==BACKUP_SCHEMA||candidate.app!=='French')throw new Error('This is not a French vNext backup.');
  const payloadRaw=candidate.payload;
  if(!payloadRaw||typeof payloadRaw!=='object'||Array.isArray(payloadRaw))throw new Error('Backup payload is missing.');
  const payloadObject=payloadRaw as Record<string,unknown>;
  if(payloadObject.dbName!==DB_NAME)throw new Error('Backup database identity does not match French.');
  const storesRaw=payloadObject.stores;
  if(!storesRaw||typeof storesRaw!=='object'||Array.isArray(storesRaw))throw new Error('Backup stores are missing.');
  const stores={} as Record<StoreName,BackupRow[]>;
  const rowsByStore={} as Record<StoreName,number>;
  let totalRows=0;
  for(const name of STORE_NAMES){
    const rows=assertRows((storesRaw as Record<string,unknown>)[name],name);
    stores[name]=rows;rowsByStore[name]=rows.length;totalRows+=rows.length;
  }
  const payload:BackupPayload={dbName:DB_NAME,dbVersion:Number(payloadObject.dbVersion)||DB_VERSION,stores};
  const expected=String(candidate.checksum??'');
  const actual=await sha256(JSON.stringify(payload));
  if(!expected||actual!==expected)throw new Error('Backup integrity check failed.');
  const createdAt=Number(candidate.createdAt);
  if(!Number.isFinite(createdAt)||createdAt<=0)throw new Error('Backup timestamp is invalid.');
  const archive:FrenchBackupArchive={schema:BACKUP_SCHEMA,app:'French',createdAt,checksum:expected,payload};
  return{archive,totalRows,rowsByStore,createdAt};
}

export async function restoreBackupArchive(text:string):Promise<BackupInspection>{
  const inspection=await inspectBackupArchive(text);
  const db=await openFrenchDatabase();
  try{
    await new Promise<void>((resolve,reject)=>{
      const tx=db.transaction([...STORE_NAMES],'readwrite');
      for(const name of STORE_NAMES){
        const store=tx.objectStore(name);store.clear();
        for(const row of inspection.archive.payload.stores[name])store.put(row.value,row.key);
      }
      tx.oncomplete=()=>resolve();
      tx.onerror=()=>reject(tx.error??new Error('Backup restore failed.'));
      tx.onabort=()=>reject(tx.error??new Error('Backup restore was aborted.'));
    });
  }finally{db.close();}
  return inspection;
}
