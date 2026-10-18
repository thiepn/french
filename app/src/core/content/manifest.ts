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
export function loadContentManifest(signal?:AbortSignal):Promise<ContentManifest>{
  if(!manifestPromise){
    const request=fetch('/content/manifest.json',{cache:'no-cache'}).then(async response=>{
      if(!response.ok)throw new Error('Content manifest HTTP '+response.status);
      const retained=response.clone();
      const payload=await response.json() as ContentManifest;
      if(payload.schema!=='thiepn-french-content-manifest-v1'||!Array.isArray(payload.packs))
        throw new Error('Content manifest schema mismatch');
      if('caches' in globalThis)try{
        const storage=await caches.open('french-vnext-shell-v1');
        await storage.put('/content/manifest.json',retained);
      }catch(error){console.warn('French content manifest offline cache unavailable',error);}
      return payload;
    });
    manifestPromise=request.catch(error=>{manifestPromise=null;throw error;});
  }
  return waitForContent(manifestPromise,signal);
}
