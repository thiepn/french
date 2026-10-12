/** U1: source-bounded, read-only import preview. Never touches browser storage, cloud or SRS. */
export type LegacySource='lcf'|'f22';
export interface ImportPreview{
 source:LegacySource;storageKey:string;status:'VALID_PREVIEW'|'REJECTED';writeAllowed:false;
 bytes:number;items:number;errors:readonly string[];warnings:readonly string[];
 unknownFieldCount:number;sha256:string|null;newSrsReviews:0;newCefrAwards:0;
}
const keys={lcf:'fr-a1a2-practice-v6',f22:'french_flashcards_L15_28_v1'} as const;
const LIMIT=8*1024*1024;
const plain=(v:unknown):v is Record<string,unknown>=>!!v&&typeof v==='object'&&!Array.isArray(v);
function shape(value:unknown):string|null{
 const queue:Array<[unknown,number]>=[[value,0]];let visited=0;
 while(queue.length){const [v,depth]=queue.pop()!;visited++;if(visited>160000)return 'TOO_MANY_NODES';if(depth>16)return 'TOO_DEEP';
 if(!v||typeof v!=='object')continue;
 for(const [key,sub] of Object.entries(v)){if(['__proto__','constructor','prototype'].includes(key))return 'UNSAFE_FIELD';queue.push([sub,depth+1]);}
 }return null;
}
const known={
lcf:new Set(['schema','theme','settings','stats','mistakes','history','practicePrefs','course','session','readerEnglish','refTab','repairQueue','courseDiagnostics','productionLog','inputTransfer','speakingLog','repairSettings','sessionEvidence','checkpoints','p6MigratedMistakes','p7EvidenceMigrated','inputDrafts','lessonEvidence','inputProgress']),
f22:new Set(['progress','settings','version','app'])
} as const;
async function hash(text:string):Promise<string|null>{
if(typeof crypto==='undefined'||!crypto.subtle)return null;
const bytes=new TextEncoder().encode(text);
const raw=await crypto.subtle.digest('SHA-256',bytes);
return Array.from(new Uint8Array(raw),v=>v.toString(16).padStart(2,'0')).join('');
}
export async function previewLegacyImport(text:string,source:LegacySource):Promise<ImportPreview>{
if(!Object.prototype.hasOwnProperty.call(keys,source))throw Error('UNSUPPORTED_SOURCE');
const errors:string[]=[],warnings:string[]=['READ_ONLY_NO_SRS_OR_CEFR_TRANSLATION'];
const bytes=new TextEncoder().encode(text).byteLength;
if(bytes>LIMIT)errors.push('SOURCE_TOO_LARGE');
let root:unknown=null;let data:unknown=null;let items=0,unknownFieldCount=0;
if(!errors.length){try{root=JSON.parse(text);}catch{errors.push('INVALID_JSON');}}
if(!errors.length&&!plain(root))errors.push('INVALID_ROOT');
if(!errors.length){const issue=shape(root);if(issue)errors.push(issue);}
if(!errors.length&&plain(root)){
data=source==='lcf'&&plain(root.state)?root.state:root;
if(!plain(data))errors.push('INVALID_STATE');
else if(source==='lcf'){
 if(data.schema!==1)errors.push('LCF_SCHEMA_MISMATCH');
 if(!plain(data.course))errors.push('MISSING_COURSE');
 else if(!Number.isInteger(data.course.currentSession)||Number(data.course.currentSession)<1||Number(data.course.currentSession)>60
 ||!Number.isInteger(data.course.coveredThroughSession)||Number(data.course.coveredThroughSession)<0||Number(data.course.coveredThroughSession)>60)errors.push('INVALID_COURSE_POSITION');
 if(data.stats!==undefined&&!plain(data.stats))errors.push('INVALID_STATS');
 for(const key of ['mistakes','history','repairQueue'])if(data[key]!==undefined&&!Array.isArray(data[key]))errors.push('INVALID_'+key.toUpperCase());
 items=(Array.isArray(data.mistakes)?data.mistakes.length:0)+(Array.isArray(data.history)?data.history.length:0);
 if(items>50000)errors.push('TOO_MANY_EVENTS');
}else{
const progress=plain(data.progress)?data.progress:data;
const cardIds=Object.keys(progress);
if(cardIds.length>10000)errors.push('TOO_MANY_CARDS');
if(!cardIds.every(k=>/^[0-9]{1,8}$/.test(k)))errors.push('INVALID_CARD_IDS');
if(!Object.values(progress).every(plain))errors.push('INVALID_CARD_PROGRESS');
if(plain(data.progress)&&data.settings!==undefined&&!plain(data.settings))errors.push('INVALID_SETTINGS');
items=cardIds.length;
}
unknownFieldCount=Object.keys(data).filter(k=>!known[source].has(k)).length;
if(unknownFieldCount)warnings.push('UNKNOWN_FIELDS_REQUIRE_PRESERVATION');
}
return{source,storageKey:keys[source],status:errors.length?'REJECTED':'VALID_PREVIEW',writeAllowed:false,
bytes,items,errors,warnings,unknownFieldCount,sha256:errors.length?null:await hash(text),newSrsReviews:0,newCefrAwards:0};
}
