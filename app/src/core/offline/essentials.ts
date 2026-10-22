import { loadContentManifest,type ContentManifest,type ContentPackDescriptor } from '../content/manifest';
import { sha256Hex } from '../content/verify';

const VERIFIED_CACHE='french-vnext-content-v1';
const MAX_RESOURCE_BYTES=8_000_000;
const MIN_FREE_BYTES=5_000_000;

interface Essential{
  label:string;
  path:string;
  sha256:string;
  bytes:number;
  schema:string;
  id?:string;
}
export interface OfflineEssentialsReport{
  total:number;
  ready:number;
  missing:string[];
  readyNames:string[];
  expectedBytes:number;
}
function resource(label:string,path:string,sha256:string|undefined,bytes:number|undefined,schema:string,id?:string):Essential{
  if(!/^\/content\/[a-z0-9/_.-]+\.json$/.test(path)||path.includes('..')||
     !/^[0-9a-f]{64}$/.test(sha256??'')||
     !Number.isSafeInteger(bytes)||!(bytes!>0)||bytes!>MAX_RESOURCE_BYTES)
    throw Error('Unsafe or oversized French offline content descriptor: '+label);
  return {label,path,sha256:sha256!,bytes:bytes!,schema,...(id?{id}:{})};
}
function requirements(manifest:ContentManifest):Essential[]{
  const index=manifest.indexes?.vocabulary;
  if(!index)throw Error('This French version has no verified vocabulary index.');
  const items=[resource('Vocabulary search index',index.path,index.sha256,index.bytes,
    'thiepn-french-vocabulary-search-v1')];
  const a1=manifest.packs.filter(p=>p.kind==='vocabulary'&&p.level==='A1')
    .sort((a,b)=>a.id.localeCompare(b.id))[0];
  if(!a1)throw Error('This French version has no A1 starter vocabulary pack.');
  const byId=(id:string):ContentPackDescriptor=>{
    const item=manifest.packs.find(p=>p.id===id);
    if(!item)throw Error('Required French offline source is missing: '+id);
    return item;
  };
  const stable=[
    {item:a1,label:'First A1 vocabulary pack',schema:'thiepn-french-vocabulary-pack-v1'},
    {item:byId('reading-stable-p35'),label:'Original reading collection',schema:'thiepn-french-reading-pack-v1'},
    {item:byId('sentence-stable-p12'),label:'Original sentence exercises',schema:'thiepn-french-sentence-pack-v1'},
    {item:byId('usage-stable-p10'),label:'Original usage frames',schema:'thiepn-french-usage-pack-v1'}
  ];
  for(const {item,label,schema} of stable)
    items.push(resource(label,item.path,item.sha256,item.bytes,schema,item.id));
  return items;
}
function pinnedKey(item:Essential):string{
  return item.path+'?verifiedSha256='+item.sha256;
}
async function verifiedBytes(response:Response,item:Essential):Promise<ArrayBuffer>{
  if(!response.ok)throw Error('Content HTTP '+response.status);
  const bytes=await response.arrayBuffer();
  if(bytes.byteLength!==item.bytes||bytes.byteLength>MAX_RESOURCE_BYTES||
     await sha256Hex(bytes)!==item.sha256)
    throw Error('French offline source failed its size or SHA-256 verification: '+item.label);
  const decoded=JSON.parse(new TextDecoder().decode(bytes)) as Record<string,unknown>;
  if(!decoded||decoded.schema!==item.schema||
     (item.id&&decoded.id!==item.id))
    throw Error('French offline source identity mismatch: '+item.label);
  return bytes;
}
async function cached(store:Cache,item:Essential):Promise<{bytes:ArrayBuffer;source:'pinned'|'legacy'}|null>{
  for(const [key,source] of [[pinnedKey(item),'pinned'],[item.path,'legacy']] as const){
    const response=await store.match(key);
    if(!response)continue;
    try{return {bytes:await verifiedBytes(response,item),source};}
    catch{/* A wrong-build or damaged item must never count as available. */}
  }
  return null;
}
async function resolve():Promise<{store:Cache;items:Essential[]}>{
  if(typeof caches==='undefined')throw Error('This browser does not support Cache Storage.');
  const manifest=await loadContentManifest();
  return {store:await caches.open(VERIFIED_CACHE),items:requirements(manifest)};
}
/** Read-only, source-verified check. It never deletes P35 or personal data. */
export async function inspectFrenchOfflineEssentials():Promise<OfflineEssentialsReport>{
  const {store,items}=await resolve();
  const readyNames:string[]=[],missing:string[]=[];
  for(const item of items){
    if(await cached(store,item))readyNames.push(item.label);
    else missing.push(item.label);
  }
  return {total:items.length,ready:readyNames.length,readyNames,missing,
    expectedBytes:items.reduce((sum,item)=>sum+item.bytes,0)};
}
/** Explicit user-triggered preparation; only verified, bundled public source files.
 * Personal study/Account records remain in their existing original stores.
 */
export async function prepareFrenchOfflineEssentials(progress:(message:string)=>void):Promise<OfflineEssentialsReport>{
  if(!navigator.onLine)throw Error('Connect to the internet before preparing missing offline lessons.');
  const {store,items}=await resolve();
  const outstanding:Essential[]=[];
  for(const item of items)if(!await cached(store,item))outstanding.push(item);
  const estimate=await navigator.storage?.estimate?.().catch(()=>null);
  if(estimate&&typeof estimate.quota==='number'&&typeof estimate.usage==='number'){
    const remaining=estimate.quota-estimate.usage;
    if(remaining<outstanding.reduce((sum,item)=>sum+item.bytes,0)+MIN_FREE_BYTES)
      throw Error('Insufficient reported browser storage. Export a backup and free space before preparing lessons.');
  }
  let completed=items.length-outstanding.length;
  for(const item of outstanding){
    progress('Verifying '+item.label+' ('+(completed+1)+'/'+items.length+')…');
    const response=await fetch(item.path,{cache:'no-store'});
    const bytes=await verifiedBytes(response,item);
    const copy=()=>new Response(bytes.slice(0),{headers:{'content-type':'application/json'}});
    // Authoritative digest-keyed entry; legacy path remains for pre-U57 SW.
    await store.put(pinnedKey(item),copy());
    await store.put(item.path,copy());
    completed++;
  }
  const result=await inspectFrenchOfflineEssentials();
  if(result.ready!==result.total)throw Error('Some prepared French resources could not be verified after caching.');
  return result;
}
