import { openFrenchDatabase,readMetaValue,writeMetaValue } from '../storage/idb';
import type { CanonicalMigrationV1 } from './model';

const MIGRATION_MARKER='canonical-migration-v1';

export async function canonicalMigrationFingerprint():Promise<string>{
  return (await readMetaValue<string>(MIGRATION_MARKER))??'';
}

export async function writeCanonicalMigration(data:CanonicalMigrationV1):Promise<void>{
  const db=await openFrenchDatabase();
  try{
    const tx=db.transaction(['learner','srs','activity','user-content','meta'],'readwrite');
    const learner=tx.objectStore('learner');
    const srs=tx.objectStore('srs');
    const activity=tx.objectStore('activity');
    const userContent=tx.objectStore('user-content');
    const meta=tx.objectStore('meta');

    learner.put(data.learner,'state-v1');
    userContent.put(data.userContent,'content-v1');

    srs.clear();
    for(const row of data.srs)srs.put(row,row.id);

    activity.clear();
    for(const row of data.reviews)activity.put(row,row.eventId);

    meta.put(data.learner.sourceFingerprint,MIGRATION_MARKER);
    meta.put({
      currentLevel:highestEarnedLevel(data.learner.promotions),
      dueCount:data.srs.filter(row=>row.status!=='new'&&!row.suspended&&row.dueAt>0&&row.dueAt<=Date.now()).length,
      streakDays:studyStreak(data.learner.studyDays)
    },'learner-summary');

    await new Promise<void>((resolve,reject)=>{
      tx.oncomplete=()=>resolve();
      tx.onerror=()=>reject(tx.error??new Error('Canonical learner migration failed.'));
      tx.onabort=()=>reject(tx.error??new Error('Canonical learner migration was aborted.'));
    });
  }finally{db.close();}
}

function highestEarnedLevel(promotions:Record<string,unknown>):string|undefined{
  let earned:string|undefined;
  for(const level of ['A1','A2','B1','B2']){
    const raw=promotions[level];
    const row=raw&&typeof raw==='object'&&!Array.isArray(raw)?raw as Record<string,unknown>:{};
    if(Number(row.earnedAt)>0)earned=level;else break;
  }
  return earned;
}

function studyStreak(source:string[],now=Date.now()):number{
  const days=new Set(source);
  const format=(value:number)=>{const d=new Date(value);return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;};
  const cursor=new Date(now);cursor.setHours(0,0,0,0);
  if(!days.has(format(cursor.getTime())))cursor.setDate(cursor.getDate()-1);
  let streak=0;
  while(days.has(format(cursor.getTime()))){streak++;cursor.setDate(cursor.getDate()-1);}
  return streak;
}

export async function hasCanonicalLearnerState():Promise<boolean>{
  return Boolean(await canonicalMigrationFingerprint());
}

export async function markCanonicalMigration(fingerprint:string):Promise<void>{
  await writeMetaValue(MIGRATION_MARKER,fingerprint);
}
