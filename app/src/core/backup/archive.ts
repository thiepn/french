import { openFrenchDatabase } from '../storage/idb';

const BACKUP_SCHEMA='thiepn-french-vnext-backup-v1' as const;
const DB_NAME='thiepn-french-vnext';
const DB_VERSION=5;
export const STORE_NAMES=['learner','srs','activity','user-content','session','meta','migration'] as const;
export type StoreName=typeof STORE_NAMES[number];
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

async function sha256(text:string):Promise<string>{
  if(!crypto?.subtle)throw new Error('Web Crypto is required for backup integrity.');
  const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(text));
  return [...new Uint8Array(digest)].map(value=>value.toString(16).padStart(2,'0')).join('');
}
function safeKey(value:IDBValidKey):JsonKey{
  if(typeof value==='string'||typeof value==='number')return value;
  throw new Error('French backup encountered an unsupported database key type.');
}

/** All seven stores are read within the same IndexedDB transaction.
 * For guarded recovery, the callback may queue replacement writes before commit.
 */
function readStores(
  tx:IDBTransaction,
  onReady:(stores:Record<StoreName,BackupRow[]>)=>void,
  reject:(reason:unknown)=>void
):void{
  const rows={} as Record<StoreName,BackupRow[]>;
  let pending=STORE_NAMES.length*2;
  const fail=(error:unknown)=>{
    reject(error);
    try{tx.abort();}catch{/* Already settled. */}
  };
  const complete=()=>{
    if(--pending===0){
      try{onReady(rows);}catch(error){fail(error);}
    }
  };
  for(const name of STORE_NAMES){
    let keys:IDBValidKey[]=[],values:unknown[]=[];
    let haveKeys=false,haveValues=false,stored=false;
    const record=()=>{
      if(stored||!haveKeys||!haveValues)return;
      stored=true;
      if(keys.length!==values.length)throw Error('Inconsistent backup store '+name);
      rows[name]=keys.map((key,index)=>({key:safeKey(key),value:values[index]}));
    };
    const store=tx.objectStore(name);
    const keyRequest=store.getAllKeys(),valueRequest=store.getAll();
    keyRequest.onsuccess=()=>{try{keys=keyRequest.result;haveKeys=true;record();complete();}catch(error){fail(error);}};
    valueRequest.onsuccess=()=>{try{values=valueRequest.result;haveValues=true;record();complete();}catch(error){fail(error);}};
    keyRequest.onerror=()=>fail(keyRequest.error??Error('Backup key read failed'));
    valueRequest.onerror=()=>fail(valueRequest.error??Error('Backup data read failed'));
  }
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

export async function createBackupPayload():Promise<BackupPayload>{
  const db=await openFrenchDatabase();
  try{
    return await new Promise<BackupPayload>((resolve,reject)=>{
      const tx=db.transaction([...STORE_NAMES],'readonly');
      let snapshot:Record<StoreName,BackupRow[]>|undefined;
      readStores(tx,stores=>{snapshot=stores;},reject);
      tx.oncomplete=()=>snapshot
        ?resolve({dbName:DB_NAME,dbVersion:DB_VERSION,stores:snapshot})
        :reject(Error('Incomplete French backup snapshot'));
      tx.onerror=()=>reject(tx.error??Error('French backup snapshot failed'));
      tx.onabort=()=>reject(tx.error??Error('French backup snapshot aborted'));
    });
  }finally{db.close();}
}
export function validateBackupPayload(value:unknown):BackupPayload{
  if(!value||typeof value!=='object'||Array.isArray(value))throw new Error('Backup payload is invalid.');
  const raw=value as Record<string,unknown>;
  if(raw.dbName!==DB_NAME)throw new Error('Backup database identity does not match French.');
  const storesRaw=raw.stores;
  if(!storesRaw||typeof storesRaw!=='object'||Array.isArray(storesRaw))throw new Error('Backup stores are missing.');
  const stores={} as Record<StoreName,BackupRow[]>;
  for(const name of STORE_NAMES)stores[name]=assertRows((storesRaw as Record<string,unknown>)[name],name);
  return{dbName:DB_NAME,dbVersion:Number(raw.dbVersion)||DB_VERSION,stores};
}
export async function restoreBackupPayload(value:unknown):Promise<void>{
  const payload=validateBackupPayload(value);
  const db=await openFrenchDatabase();
  try{
    await new Promise<void>((resolve,reject)=>{
      const tx=db.transaction([...STORE_NAMES],'readwrite');
      for(const name of STORE_NAMES){
        const store=tx.objectStore(name);store.clear();
        for(const row of payload.stores[name])store.put(row.value,row.key);
      }
      tx.oncomplete=()=>resolve();
      tx.onerror=()=>reject(tx.error??new Error('Backup restore failed.'));
      tx.onabort=()=>reject(tx.error??new Error('Backup restore was aborted.'));
    });
  }finally{db.close();}
}
export async function createBackupArchive(now=Date.now()):Promise<{archive:FrenchBackupArchive;text:string;filename:string}>{
  const payload=await createBackupPayload();
  const checksum=await sha256(JSON.stringify(payload));
    const archive:FrenchBackupArchive={schema:BACKUP_SCHEMA,app:'French',createdAt:now,checksum,payload};
    const stamp=new Date(now).toISOString().replace(/[:.]/g,'-');
    return{archive,text:JSON.stringify(archive,null,2),filename:'french-backup-'+stamp+'.json'};
}

export async function inspectBackupArchive(text:string):Promise<BackupInspection>{
  let raw:unknown;
  try{raw=JSON.parse(text);}catch{throw new Error('Backup is not valid JSON.');}
  if(!raw||typeof raw!=='object'||Array.isArray(raw))throw new Error('Backup root is invalid.');
  const candidate=raw as Record<string,unknown>;
  if(candidate.schema!==BACKUP_SCHEMA||candidate.app!=='French')throw new Error('This is not a French vNext backup.');
  const payload=validateBackupPayload(candidate.payload);
  const rowsByStore={} as Record<StoreName,number>;
  let totalRows=0;
  for(const name of STORE_NAMES){rowsByStore[name]=payload.stores[name].length;totalRows+=rowsByStore[name];}
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
  await restoreBackupPayload(inspection.archive.payload);
  return inspection;
}
