import { sha256Hex } from './verify';
declare const __FRENCH_CONTENT_MANIFEST_SHA__:string;

export interface ContentPackDescriptor {
  id:string;
  kind:'vocabulary'|'grammar'|'reading'|'listening'|'speaking'|'assessment'|'usage';
  level:string;
  path:string;
  count?:number;
  bytes?:number;
  sha256?:string;
  revision:string;
}
export interface ContentIndexDescriptor {
  schema:string;
  path:string;
  count:number;
  bytes:number;
  sha256:string;
  revision:string;
}
export interface ContentSourceMetadata {
  repository?:string;
  commit?:string;
  blob?:string;
  upstreamVersion?:number|string;
  upstreamGeneratedAt?:string;
  declaredCount?:number|null;
  actualCount?:number;
  countMismatch?:boolean;
}
export interface ContentManifest {
  schema:'thiepn-french-content-manifest-v1';
  revision:string;
  generatedAt?:string;
  source?:ContentSourceMetadata;
  indexes?:{vocabulary?:ContentIndexDescriptor};
  totals?:{records?:number;packs?:number;levels?:Record<string,number>;readings?:number;sentenceExercises?:number;verifiedUsagePatterns?:number};
  packs:ContentPackDescriptor[];
}
let manifestPromise:Promise<ContentManifest>|null=null;

/** Cache a shared network request without coupling its lifetime to one
 * navigation's abort signal; an aborted or offline route must not poison
 * future attempts on another route or after reconnect.
 */
export function waitForContent<T>(work:Promise<T>,signal?:AbortSignal):Promise<T>{
  if(!signal)return work;
  if(signal.aborted)return Promise.reject(new DOMException('Aborted','AbortError'));
  return new Promise<T>((resolve,reject)=>{
    const aborted=()=>reject(new DOMException('Aborted','AbortError'));
    signal.addEventListener('abort',aborted,{once:true});
    void work.then(value=>{
      signal.removeEventListener('abort',aborted);resolve(value);
    },error=>{
      signal.removeEventListener('abort',aborted);reject(error);
    });
  });
}
/** Every deployed JS build is pinned to the manifest bytes built alongside it.
 * Never allow a newer worker to supply an unrelated vocabulary/reading source.
 */
const CONTENT_CACHE='french-vnext-content-v1';
const MANIFEST_PATH='/content/manifest.json';
function manifestKey():string{
  const digest=__FRENCH_CONTENT_MANIFEST_SHA__;
  if(!/^[0-9a-f]{64}$/.test(digest))
    throw Error('French build is missing its pinned content manifest digest.');
  return MANIFEST_PATH+'?verifiedSha256='+digest;
}
async function checkedManifest(response:Response):Promise<ContentManifest>{
  if(!response.ok)throw Error('Content manifest HTTP '+response.status);
  const bytes=await response.arrayBuffer();
  if(await sha256Hex(bytes)!==__FRENCH_CONTENT_MANIFEST_SHA__)
    throw Error('French content manifest differs from this installed app build.');
  const payload=JSON.parse(new TextDecoder().decode(bytes)) as ContentManifest;
  if(payload.schema!=='thiepn-french-content-manifest-v1'||!Array.isArray(payload.packs)||
     !payload.packs.every(pack=>typeof pack.id==='string'&&
       pack.path.startsWith('/content/')&&/^[0-9a-f]{64}$/.test(pack.sha256??''))||
     !/^[0-9a-f]{64}$/.test(payload.indexes?.vocabulary?.sha256??''))
    throw Error('Content manifest schema or source digests mismatch.');
  return payload;
}
async function manifestForBuild():Promise<ContentManifest>{
  const key=manifestKey();
  let storage:Cache|undefined;
  if('caches' in globalThis)try{storage=await caches.open(CONTENT_CACHE);}
  catch(error){console.warn('French manifest cache unavailable',error);}
  const known=await storage?.match(key);
  if(known){
    try{return await checkedManifest(known);}
    catch(error){
      await storage?.delete(key).catch(()=>false);
      console.warn('Rejected damaged pinned French manifest',error);
    }
  }
  // Older runtime versions kept the manifest only under its shared URL.
  // Promote it ONLY after comparing every byte to this app's build digest.
  const legacy=await storage?.match(MANIFEST_PATH);
  if(legacy){
    try{
      const checked=await checkedManifest(legacy.clone());
      await storage?.put(key,legacy).catch(()=>undefined);
      return checked;
    }catch{/* A newer build may have rewritten the legacy entry. */}
  }
  let networkError:unknown;
  try{
    const response=await fetch(MANIFEST_PATH,{cache:'no-store'});
    const checked=await checkedManifest(response.clone());
    if(storage)try{
      await storage.put(key,response.clone());
      await storage.put(MANIFEST_PATH,response.clone());
    }catch(error){console.warn('French verified manifest could not be stored',error);}
    return checked;
  }catch(error){networkError=error;}
  // An older tab may survive multiple SW updates. Search only native app
  // shell caches for an exact digest match; P35 and private caches are excluded.
  if('caches' in globalThis)try{
    const names=await caches.keys();
    for(const name of names){
      if(!/^french-vnext-shell-(?:[0-9a-f]{12}|v1)$/.test(name))continue;
      const candidate=await(await caches.open(name)).match(MANIFEST_PATH);
      if(!candidate)continue;
      try{
        const checked=await checkedManifest(candidate.clone());
        await storage?.put(key,candidate).catch(()=>undefined);
        return checked;
      }catch{/* This shell belongs to another native build. */}
    }
  }catch(error){console.warn('French pinned offline manifest lookup unavailable',error);}
  throw networkError??Error('No verified manifest for this French version is available.');
}
export function loadContentManifest(signal?:AbortSignal):Promise<ContentManifest>{
  if(!manifestPromise){
    const request=manifestForBuild();
    manifestPromise=request.catch(error=>{manifestPromise=null;throw error;});
  }
  return waitForContent(manifestPromise,signal);
}
