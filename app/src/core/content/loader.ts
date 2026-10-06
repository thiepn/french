import { loadContentManifest,type ContentPackDescriptor } from './manifest';
const memory=new Map<string,unknown>();
export async function listContentPacks(signal?:AbortSignal):Promise<ContentPackDescriptor[]>{return(await loadContentManifest(signal)).packs;}
export async function loadContentPack<T=unknown>(id:string,signal?:AbortSignal):Promise<T>{
  if(memory.has(id))return memory.get(id) as T;
  const manifest=await loadContentManifest(signal),descriptor=manifest.packs.find(p=>p.id===id);if(!descriptor)throw new Error(`Unknown content pack: ${id}`);
  const response=await fetch(descriptor.path,{cache:'force-cache',signal});if(!response.ok)throw new Error(`Content pack ${id} HTTP ${response.status}`);
  const value=await response.json() as T;memory.set(id,value);return value;
}
