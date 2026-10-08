export type CloudJsonKey=string|number;
export interface CloudBackupRow{key:CloudJsonKey;value:unknown}
export interface CloudBackupPayload{
  dbName:string;
  dbVersion:number;
  stores:{
    learner:CloudBackupRow[];
    srs:CloudBackupRow[];
    activity:CloudBackupRow[];
    'user-content':CloudBackupRow[];
    session:CloudBackupRow[];
    meta:CloudBackupRow[];
    migration:CloudBackupRow[];
  };
}
export interface FrenchCloudSnapshot extends Record<string,unknown>{
  _vnext?:{schema:'thiepn-french-cloud-vnext-v1';payload:CloudBackupPayload};
}
function at(payload:CloudBackupPayload,store:keyof CloudBackupPayload['stores'],key:string):unknown{
  return payload.stores[store].find(row=>String(row.key)===key)?.value;
}
function obj(value:unknown):Record<string,unknown>{
  return value&&typeof value==='object'&&!Array.isArray(value)?value as Record<string,unknown>:{};
}
function progress(payload:CloudBackupPayload):Record<string,unknown>{
  const out:Record<string,unknown>={};
  for(const row of payload.stores.srs){
    const value=obj(row.value),id=String(value.id??row.key);
    if(id)out[id]={...value,interval:value.intervalDays??0,due:value.dueAt??0,lastReviewed:value.lastReviewedAt??0};
  }
  return out;
}
function reviews(payload:CloudBackupPayload):unknown[]{
  return payload.stores.activity.map(row=>{const value=obj(row.value);return{...value,interval:value.intervalDays??0};});
}
export function backupPayloadToFrenchCloudSnapshot(payload:CloudBackupPayload,now=Date.now()):FrenchCloudSnapshot{
  const learner=obj(at(payload,'learner','state-v1'));
  const content=obj(at(payload,'user-content','content-v1'));
  const feature=obj(learner.featureState);
  const reviewLog=reviews(payload);
  const lastReview=reviewLog.reduce<number>((max,row)=>Math.max(max,Number(obj(row).t)||0),0);
  return{
    version:'vnext-p37h',schema:13,updatedAt:Math.max(now,lastReview),
    progress:progress(payload),settings:obj(learner.settings),reviewLog,
    studyDays:Array.isArray(learner.studyDays)?learner.studyDays:[],
    profile:obj(learner.profile),studyPlan:obj(learner.studyPlan),
    userCards:obj(content.userCards),cardEdits:obj(content.cardEdits),
    smartDecks:obj(content.smartDecks),customDecks:obj(content.customDecks),
    ...feature,
    _vnext:{schema:'thiepn-french-cloud-vnext-v1',payload}
  };
}
export function snapshotHasMeaningfulState(snapshot:FrenchCloudSnapshot):boolean{
  return Object.keys(obj(snapshot.progress)).length>0
    ||(Array.isArray(snapshot.reviewLog)&&snapshot.reviewLog.length>0)
    ||(Array.isArray(snapshot.studyDays)&&snapshot.studyDays.length>0)
    ||Object.keys(obj(snapshot.userCards)).length>0
    ||Object.keys(obj(snapshot.cardEdits)).length>0
    ||Object.keys(obj(snapshot.v550Reading)).length>0;
}
function stable(value:unknown):string{
  if(value===null||typeof value!=='object')return JSON.stringify(value);
  if(Array.isArray(value))return'['+value.map(stable).join(',')+']';
  const row=value as Record<string,unknown>;
  return'{'+Object.keys(row).filter(key=>key!=='updatedAt').sort().map(key=>JSON.stringify(key)+':'+stable(row[key])).join(',')+'}';
}
export async function hashFrenchCloudSnapshot(snapshot:FrenchCloudSnapshot):Promise<string>{
  const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(stable(snapshot)));
  return[...new Uint8Array(digest)].map(byte=>byte.toString(16).padStart(2,'0')).join('');
}
