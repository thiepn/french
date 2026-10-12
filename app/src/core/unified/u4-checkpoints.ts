import {ORIGINAL_PATH_LESSONS} from './u3-pathways.ts';
import {SOURCES} from './source.ts';
import {checkPracticeAnswer} from './u2-grammar.ts';

export interface PracticeEvent{
 readonly sequence:number;
 readonly lessonId:string;
 readonly exerciseId:string;
 readonly submitted:string;
}
export interface PracticeCheckpoint{
 readonly schema:'thiepn-french-u4-local-practice-v1';
 readonly custody:'self-reported-local-only';
 readonly approved:false;
 readonly authoritative:false;
 readonly contentSource:'original';
 readonly sourceRevision:string;
 readonly catalogFingerprint:string;
 readonly events:readonly PracticeEvent[];
}
export interface ReplayResult{
 readonly status:'valid'|'blocked';
 readonly reasons:readonly string[];
 readonly events:readonly PracticeEvent[];
 readonly replayCorrect:number;
 readonly practicedLessons:readonly string[];
 readonly authoritative:false;
 readonly evidenceTrusted:false;
}
const LIMIT=128;
const BYTES=64*1024;
const MAX_SUBMITTED=160;
const allowedRoot=['schema','custody','approved','authoritative','contentSource','sourceRevision','catalogFingerprint','events'];
const allowedEvent=['sequence','lessonId','exerciseId','submitted'];
function record(value:unknown):value is Record<string,unknown>{
 return !!value&&typeof value==='object'&&!Array.isArray(value);
}
function exactKeys(row:Record<string,unknown>,keys:readonly string[]):boolean{
 return Object.keys(row).length===keys.length&&Object.keys(row).every(k=>keys.includes(k));
}
function catalogSource():string{
 return ORIGINAL_PATH_LESSONS.map(l=>[l.source.qualifiedId,l.grammarIds.join(','),
  ...l.exercises.map(e=>[e.id,e.type,e.prompt,e.answer,...e.options].join('~'))].join('|')).join('\n');
}
/**
 * FNV-1a is a deterministic change detector, NOT a security signature.
 * Self-reported answer events can be authored by anyone and cannot grant mastery.
 */
export function practiceCatalogFingerprint():string{
 let hash=2166136261;
 for(const byte of new TextEncoder().encode(catalogSource())){
  hash=Math.imul(hash^byte,16777619)>>>0;
 }
 return 'fnv1a32-'+hash.toString(16).padStart(8,'0');
}
function replayEvents(events:readonly PracticeEvent[]):{correct:number;practiced:string[]}{
 const correctByLesson=new Map<string,Set<string>>();
 let correct=0;
 for(const event of events){
  const lesson=ORIGINAL_PATH_LESSONS.find(l=>l.id===event.lessonId)!;
  const exercise=lesson.exercises.find(e=>e.id===event.exerciseId)!;
  if(checkPracticeAnswer(event.submitted,exercise.answer)){
   correct++;
   let set=correctByLesson.get(lesson.id);
   if(!set){set=new Set();correctByLesson.set(lesson.id,set);}
   set.add(exercise.id);
  }
 }
 const practiced=ORIGINAL_PATH_LESSONS.filter(l=>
  correctByLesson.get(l.id)?.size===l.exercises.length).map(l=>l.id);
 return {correct,practiced};
}
export function exportPracticeCheckpoint(events:readonly PracticeEvent[]):PracticeCheckpoint{
 const trimmed=events.slice(0,LIMIT).map((entry,index)=>({
  sequence:index+1,lessonId:entry.lessonId,exerciseId:entry.exerciseId,submitted:entry.submitted
 }));
 const snapshot:PracticeCheckpoint={
  schema:'thiepn-french-u4-local-practice-v1',custody:'self-reported-local-only',approved:false,
  authoritative:false,contentSource:'original',sourceRevision:SOURCES.original.revision,
  catalogFingerprint:practiceCatalogFingerprint(),events:trimmed
 };
 const verification=inspectPracticeCheckpoint(JSON.stringify(snapshot));
 if(verification.status!=='valid')throw new Error('Invalid local checkpoint: '+verification.reasons.join(' / '));
 return snapshot;
}
export function inspectPracticeCheckpoint(raw:string):ReplayResult{
 const reasons:string[]=[];
 const fail=():ReplayResult=>({status:'blocked',reasons:[...reasons],events:[],
  replayCorrect:0,practicedLessons:[],authoritative:false,evidenceTrusted:false});
 if(new TextEncoder().encode(raw).length>BYTES){reasons.push('Checkpoint exceeds 64 KiB');return fail();}
 let parsed:unknown;
 try{parsed=JSON.parse(raw);}catch{reasons.push('Invalid JSON');return fail();}
 if(!record(parsed)||!exactKeys(parsed,allowedRoot)){reasons.push('Unexpected checkpoint fields');return fail();}
 if(parsed.schema!=='thiepn-french-u4-local-practice-v1'||
  parsed.custody!=='self-reported-local-only'||parsed.authoritative!==false||
  parsed.approved!==false||parsed.contentSource!=='original'){
  reasons.push('Checkpoint makes invalid custody or approval claims');
 }
 if(parsed.sourceRevision!==SOURCES.original.revision||
  parsed.catalogFingerprint!==practiceCatalogFingerprint()){
  reasons.push('Source version or catalog fingerprint mismatch');
 }
 if(!Array.isArray(parsed.events)||parsed.events.length>LIMIT){
  reasons.push('Too many events or invalid event collection');
 }
 if(reasons.length)return fail();
 const clean:PracticeEvent[]=[];
 for(const item of parsed.events as unknown[]){
  if(!record(item)||!exactKeys(item,allowedEvent)){reasons.push('Unexpected event fields');break;}
  const {sequence,lessonId,exerciseId,submitted}=item;
  if(!Number.isSafeInteger(sequence)||sequence!==clean.length+1||
    typeof lessonId!=='string'||typeof exerciseId!=='string'||
    typeof submitted!=='string'||submitted.length>MAX_SUBMITTED){
   reasons.push('Invalid event sequence, ID or submitted answer');break;
  }
  const lesson=ORIGINAL_PATH_LESSONS.find(l=>l.id===lessonId);
  if(!lesson||!lesson.exercises.some(e=>e.id===exerciseId)){
   reasons.push('Event references an unknown original exercise');break;
  }
  clean.push({sequence:sequence as number,lessonId,exerciseId,submitted});
 }
 if(reasons.length)return fail(); // no partial replay of malformed checkpoint
 const replay=replayEvents(clean);
 return {status:'valid',reasons:[],events:clean,replayCorrect:replay.correct,
  practicedLessons:replay.practiced,authoritative:false,evidenceTrusted:false};
}
export function practiceEvent(sequence:number,lessonId:string,exerciseId:string,submitted:string):PracticeEvent|null{
 if(!Number.isSafeInteger(sequence)||sequence<1||sequence>LIMIT||
   submitted.length>MAX_SUBMITTED||!ORIGINAL_PATH_LESSONS.some(l=>
    l.id===lessonId&&l.exercises.some(e=>e.id===exerciseId)))return null;
 return {sequence,lessonId,exerciseId,submitted};
}
