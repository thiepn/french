import { loadContentManifest,waitForContent,type ContentPackDescriptor } from './manifest';
import { verifySha256 } from './verify';

export interface VocabularyWord {
  id:string;
  word:string;
  meaning:string;
  ipa?:string;
  pos?:string;
  level?:string;
  order?:number;
  sentences?:Array<{text?:string;translation?:string}>;
  tags?:string[];
  article?:string;
  gender?:string;
  plural?:string;
  aliases?:string[];
}
export interface VocabularyPack {
  schema:'thiepn-french-vocabulary-pack-v1';
  id:string;
  revision:string;
  level:string;
  words:VocabularyWord[];
}
export interface VocabularySearchRow {
  id:string;
  word:string;
  meaning:string;
  ipa:string;
  pos:string;
  article:string;
  gender:string;
  level:string;
  order:number;
  packId:string;
}
export interface VocabularySearchIndex {
  schema:'thiepn-french-vocabulary-search-v1';
  revision:string;
  rows:VocabularySearchRow[];
}

const memory=new Map<string,unknown>();
let searchIndexPromise:Promise<VocabularySearchIndex>|null=null;
let searchMap:Map<string,VocabularySearchRow>|null=null;

/** A reusable public path can name different bytes across releases.
 * Pin every verified copy by the manifest's SHA, so an older open tab cannot
 * replace content selected by a newer manifest on this device.
 */
function pinnedContentPath(path:string,sha256:string):string{
  if(!path.startsWith('/content/')||path.includes('..')||
     !/^[0-9a-f]{64}$/.test(sha256))
    throw new Error('French content descriptor has no valid source digest.');
  return path+(path.includes('?')?'&':'?')+'verifiedSha256='+sha256;
}
async function decodeVerified<T>(response:Response,sha256:string):Promise<T>{
  if(!response.ok)throw new Error('Content HTTP '+response.status);
  const bytes=await response.arrayBuffer();
  await verifySha256(bytes,sha256);
  return JSON.parse(new TextDecoder().decode(bytes)) as T;
}
async function fetchVerifiedJson<T>(path:string,sha256?:string,signal?:AbortSignal):Promise<T>{
  // The manifest owns the revision; never silently accept an unpinned pack.
  const key=pinnedContentPath(path,sha256??'');
  if(signal?.aborted)throw new DOMException('Aborted','AbortError');
  let storage:Cache|undefined;
  if('caches' in globalThis)try{storage=await caches.open('french-vnext-content-v1');}
  catch(error){console.warn('French public content cache unavailable',error);}
  const pinned=await storage?.match(key);
  if(pinned){
    try{return await decodeVerified<T>(pinned,sha256!);}
    catch(error){
      // Damaged Cache Storage must never become SRS or study source data.
      await storage?.delete(key).catch(()=>false);
      console.warn('Corrupted verified French cache entry rejected',error);
    }
  }
  // Compatibility with pre-U57 vNext: those bytes had already been verified
  // but were stored under an unversioned public path.
  const legacy=await storage?.match(path);
  if(legacy){
    try{
      const decoded=await decodeVerified<T>(legacy.clone(),sha256!);
      await storage?.put(key,legacy.clone()).catch(()=>undefined);
      return decoded;
    }catch{/* A different build's path or damaged data: fetch exact revision. */}
  }
  if(signal?.aborted)throw new DOMException('Aborted','AbortError');
  // Avoid browser HTTP force-cache reusing stale bytes when deployed content
  // changes under the same filename. The service worker still falls back to
  // verified public content when genuinely offline.
  const response=await fetch(path,{cache:'no-store',signal});
  const verified=await decodeVerified<T>(response.clone(),sha256!);
  if(storage)try{
    // The SHA-keyed record is authoritative. Maintain the old public-path
    // cache for installed pre-U57 tabs and the existing offline SW fallback.
    await storage.put(key,response.clone());
    await storage.put(path,response.clone());
  }catch(error){console.warn('Verified French content could not be cached',error);}
  return verified;
}

export async function listContentPacks(signal?:AbortSignal):Promise<ContentPackDescriptor[]>{
  return(await loadContentManifest(signal)).packs;
}
export async function loadContentPack<T=unknown>(id:string,signal?:AbortSignal):Promise<T>{
  if(memory.has(id))return memory.get(id) as T;
  const manifest=await loadContentManifest(signal);
  const descriptor=manifest.packs.find(p=>p.id===id);
  if(!descriptor)throw new Error('Unknown content pack: '+id);
  const value=await fetchVerifiedJson<T>(descriptor.path,descriptor.sha256,signal);
  memory.set(id,value);
  return value;
}
export function loadVocabularySearchIndex(signal?:AbortSignal):Promise<VocabularySearchIndex>{
  if(!searchIndexPromise){
    const request=(async()=>{
      const manifest=await loadContentManifest();
      const descriptor=manifest.indexes?.vocabulary;
      if(!descriptor)throw new Error('Vocabulary search index is unavailable.');
      const index=await fetchVerifiedJson<VocabularySearchIndex>(descriptor.path,descriptor.sha256);
      if(index.schema!=='thiepn-french-vocabulary-search-v1'||!Array.isArray(index.rows))
        throw new Error('Vocabulary search index schema mismatch.');
      return index;
    })();
    searchIndexPromise=request.catch(error=>{searchIndexPromise=null;throw error;});
  }
  return waitForContent(searchIndexPromise,signal);
}
export async function findVocabularyReference(id:string,signal?:AbortSignal):Promise<VocabularySearchRow|null>{
  if(!searchMap){
    const index=await loadVocabularySearchIndex(signal);
    searchMap=new Map(index.rows.map(row=>[row.id,row]));
  }
  return searchMap.get(id)??null;
}
export async function loadVocabularyWord(id:string,signal?:AbortSignal):Promise<VocabularyWord|null>{
  const reference=await findVocabularyReference(id,signal);
  if(!reference)return null;
  const pack=await loadContentPack<VocabularyPack>(reference.packId,signal);
  return pack.words.find(word=>String(word.id)===id)??null;
}


export interface ReadingSentence{fr:string;en:string;grammar?:string}
export interface ReadingQuestion{id:string;prompt:string;options:string[];answer:number;target?:string}
export interface ReadingPhrase{text:string;frame?:string}
export interface ReadingItem{
  id:string;title:string;level:string;type:string;minutes:number;topic:string;register:string;
  authenticity:string;sourceLabel:string;license:string;targets:string[];phrases:ReadingPhrase[];
  sentences:ReadingSentence[];questions:ReadingQuestion[];
}
export interface ReadingPack{
  schema:'thiepn-french-reading-pack-v1';
  id:'reading-stable-p35';
  revision:string;
  sourceRuntime:string;
  sourceBlob:string;
  morphology:Record<string,string>;
  readings:ReadingItem[];
}
export function loadStableReadingPack(signal?:AbortSignal):Promise<ReadingPack>{
  return loadContentPack<ReadingPack>('reading-stable-p35',signal);
}


export type SentenceExerciseType='complete'|'cue'|'translate'|'transform'|'transfer';
export interface SentenceExercise{
  id:string;frame:string;type:SentenceExerciseType;context:string;prompt:string;expected:string;
  alternatives:string[];required:string[];connector?:string;
}
export interface SentenceExercisePack{
  schema:'thiepn-french-sentence-pack-v1';
  id:'sentence-stable-p12';
  revision:string;sourceRuntime:string;sourcePhase:string;sourceBlob:string;
  exercises:SentenceExercise[];
}
export function loadStableSentenceExercises(signal?:AbortSignal):Promise<SentenceExercisePack>{
  return loadContentPack<SentenceExercisePack>('sentence-stable-p12',signal);
}

/** Exact P35 P10 source frames, including their inherited provenance labels. */
export interface UsageRecord{
  id:string;anchor:string;frame:string;kind:string;sourceKey:string;blank:string;
}
export interface UsageSource{label:string;url:string;tier:'verified'|'reference'}
export interface UsagePack{
  schema:'thiepn-french-usage-pack-v1';
  id:'usage-stable-p10';
  revision:string;sourceRuntime:string;sourcePhase:string;sourceBlob:string;
  sources:Record<string,UsageSource>;
  records:UsageRecord[];
}
export function loadStableUsageCorpus(signal?:AbortSignal):Promise<UsagePack>{
  return loadContentPack<UsagePack>('usage-stable-p10',signal);
}
