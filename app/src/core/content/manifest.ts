export interface ContentPackDescriptor{id:string;kind:'vocabulary'|'grammar'|'reading'|'listening'|'speaking'|'assessment';level:string;path:string;bytes?:number;revision:string;}
export interface ContentManifest{schema:'thiepn-french-content-manifest-v1';revision:string;packs:ContentPackDescriptor[];}
let pending:Promise<ContentManifest>|null=null;
export function loadContentManifest(signal?:AbortSignal):Promise<ContentManifest>{
  pending??=fetch('/content/manifest.json',{cache:'no-cache',signal}).then(r=>{if(!r.ok)throw new Error(`Content manifest HTTP ${r.status}`);return r.json() as Promise<ContentManifest>;});
  return pending;
}
