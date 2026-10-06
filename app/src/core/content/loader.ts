import { loadContentManifest,type ContentPackDescriptor } from './manifest';
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

async function fetchVerifiedJson<T>(path:string,sha256?:string,signal?:AbortSignal):Promise<T>{
  const response=await fetch(path,{cache:'force-cache',signal});
  if(!response.ok)throw new Error('Content HTTP '+response.status);
  const bytes=await response.arrayBuffer();
  await verifySha256(bytes,sha256);
  return JSON.parse(new TextDecoder().decode(bytes)) as T;
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
export async function loadVocabularySearchIndex(signal?:AbortSignal):Promise<VocabularySearchIndex>{
  searchIndexPromise??=(async()=>{
    const manifest=await loadContentManifest(signal);
    const descriptor=manifest.indexes?.vocabulary;
    if(!descriptor)throw new Error('Vocabulary search index is unavailable.');
    const index=await fetchVerifiedJson<VocabularySearchIndex>(descriptor.path,descriptor.sha256,signal);
    if(index.schema!=='thiepn-french-vocabulary-search-v1'||!Array.isArray(index.rows))throw new Error('Vocabulary search index schema mismatch.');
    return index;
  })();
  return searchIndexPromise;
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
