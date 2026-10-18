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
const FRESH_SETTINGS={
  session:{
    deck:'A1',direction:'fr-en',order:'smart',size:50,mode:'today',practice:'review',
    skillMode:'adaptive',scheduleMode:'review',typed:false,requeueAgain:true,
    mix:'due-first',siblingSpacing:true,strictArticles:true
  },
  dailyNewLimit:20,dailyReviewLimit:200,leechThreshold:8,autoSuspendLeeches:false,
  desiredRetention:.9,maxInterval:3650,learningSteps:[1,10,1440],
  relearningSteps:[10],gradingMode:'learning'
};
const FRESH_PROFILE={
  xp:0,bestCombo:0,lifetimeAnswers:0,lifetimeCorrect:0,typedAnswers:0,
  choiceAnswers:0,listeningAnswers:0,clozeAnswers:0,perfectSessions:0,
  achievements:[],claimedMissions:{}
};
const FRESH_PLAN={targetLevel:'B1',targetDate:'',studyDaysPerWeek:6,dailyMinutes:30,masteryGoal:90};
function hasDistinctLocalLearnerState(snapshot:FrenchCloudSnapshot):boolean{
  const vnext=obj(snapshot._vnext),payload=vnext.payload as CloudBackupPayload|undefined;
  // An unrecognized local payload must never be silently overwritten as empty.
  if(vnext.schema!=='thiepn-french-cloud-vnext-v1'||!payload?.stores?.learner)return true;
  const learner=obj(at(payload,'learner','state-v1'));
  if(learner.sourceFingerprint!=='fresh-vnext')return true;
  if(stable(obj(learner.settings))!==stable(FRESH_SETTINGS))return true;
  if(stable(obj(learner.profile))!==stable(FRESH_PROFILE))return true;
  if(stable(obj(learner.studyPlan))!==stable(FRESH_PLAN))return true;
  if(Object.keys(obj(learner.promotions)).length>0)return true;
  if(Object.keys(obj(learner.featureState)).length>0)return true;
  // Conversation history lives in the backed-up meta store, not learner/SRS.
  // It must block silent adoption of an unrelated cloud snapshot.
  const conversation=obj(at(payload,'meta','native-conversation-v1'));
  if(conversation.active||conversation.mission||conversation.adaptive)return true;
  if(Array.isArray(conversation.functionEvents)&&conversation.functionEvents.length>0)return true;
  if(Array.isArray(conversation.adaptiveHistory)&&conversation.adaptiveHistory.length>0)return true;
  if(Array.isArray(conversation.missionHistory)&&conversation.missionHistory.length>0)return true;
  if(Array.isArray(conversation.history)&&conversation.history.length>0)return true;
  // Writing progress lives in the meta store and must be protected even when
  // it is the only activity on this device.
  const writing=obj(at(payload,'meta','native-writing-v1'));
  if(Array.isArray(writing.history)&&writing.history.length>0)return true;
  const modes=obj(writing.modes);
  for(const name of ['phrase','sentence','transfer','bridge']){
    const entry=obj(modes[name]);
    if(Number(entry.index)>0||Number(entry.support)>0)return true;
  }
  // C4's cumulative P12 sentence ledger can survive the bounded history.
  const writingEvidence=obj(writing.evidence);
  for(const row of Object.values(writingEvidence)){
    if(Number(obj(row).attempts)>0)return true;
  }
  // P37I-C2 source-frame practice is meta-only until evidence is recorded.
  // It must block silent cloud adoption exactly like C1 writing progress.
  const usage=obj(at(payload,'meta','native-usage-v1'));
  if(Array.isArray(usage.history)&&usage.history.length>0)return true;
  // C3's cumulative ledger can outlive the bounded recent history and must
  // independently qualify as local study data on a fresh device.
  const usageTallies=obj(usage.tallies);
  for(const group of Object.values(usageTallies)){
    for(const row of Object.values(obj(group))){
      if(Number(obj(row).attempts)>0)return true;
    }
  }
  const usageModes=obj(usage.modes);
  for(const name of ['usage','production','transfer','repair']){
    const entry=obj(usageModes[name]);
    if(Number(entry.index)>0||Number(entry.support)>0)return true;
  }
  if(payload.stores.session?.length>0)return true;
  return false;
}
export function snapshotHasMeaningfulState(snapshot:FrenchCloudSnapshot):boolean{
  return Object.keys(obj(snapshot.progress)).length>0
    ||(Array.isArray(snapshot.reviewLog)&&snapshot.reviewLog.length>0)
    ||(Array.isArray(snapshot.studyDays)&&snapshot.studyDays.length>0)
    ||Object.keys(obj(snapshot.userCards)).length>0
    ||Object.keys(obj(snapshot.cardEdits)).length>0
    ||Object.keys(obj(snapshot.v550Reading)).length>0
    ||hasDistinctLocalLearnerState(snapshot);
}
function stable(value:unknown):string{
  if(value===null||typeof value!=='object')return JSON.stringify(value);
  if(Array.isArray(value))return'['+value.map(stable).join(',')+']';
  const row=value as Record<string,unknown>;
  return'{'+Object.keys(row).filter(key=>key!=='updatedAt').sort().map(key=>JSON.stringify(key)+':'+stable(row[key])).join(',')+'}';
}
export async function hashFrenchCloudSnapshot(snapshot:FrenchCloudSnapshot):Promise<string>{
  // Compute identity from the same JSON representation the server receives.
  // IndexedDB can store `undefined` properties and Dates; JSON transport drops
  // or transforms them. Hashing the raw IDB object created false cloud conflicts.
  const wire=JSON.parse(JSON.stringify(snapshot)) as FrenchCloudSnapshot;
  const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(stable(wire)));
  return[...new Uint8Array(digest)].map(byte=>byte.toString(16).padStart(2,'0')).join('');
}
