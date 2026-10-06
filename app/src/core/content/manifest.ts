export interface ContentPackDescriptor {
  id:string;
  kind:'vocabulary'|'grammar'|'reading'|'listening'|'speaking'|'assessment';
  level:string;
  path:string;
  count?:number;
  bytes?:number;
  sha256?:string;
  revision:string;
}
export interface ContentSourceMetadata {
  repository?:string;
  commit?:string;
  blob?:string;
  upstreamVersion?:number|string;
  upstreamGeneratedAt?:string;
}
export interface ContentManifest {
  schema:'thiepn-french-content-manifest-v1';
  revision:string;
  generatedAt?:string;
  source?:ContentSourceMetadata;
  totals?:{records?:number;packs?:number;levels?:Record<string,number>};
  packs:ContentPackDescriptor[];
}
let manifestPromise:Promise<ContentManifest>|null=null;
export function loadContentManifest(signal?:AbortSignal):Promise<ContentManifest>{
  manifestPromise??=fetch('/content/manifest.json',{cache:'no-cache',signal}).then(r=>{
    if(!r.ok)throw new Error('Content manifest HTTP '+r.status);
    return r.json() as Promise<ContentManifest>;
  });
  return manifestPromise;
}
