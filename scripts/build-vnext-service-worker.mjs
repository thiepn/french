import { readdir,writeFile } from 'node:fs/promises';
import { join,relative,sep } from 'node:path';

const root=new URL('../dist-vnext/',import.meta.url);
async function walk(dir){
  const rows=await readdir(dir,{withFileTypes:true});
  const out=[];
  for(const row of rows){
    const full=join(dir,row.name);
    if(row.isDirectory())out.push(...await walk(full));
    else out.push(full);
  }
  return out;
}
const rootPath=decodeURIComponent(root.pathname);
const files=(await walk(rootPath))
  .map(file=>relative(rootPath,file).split(sep).join('/'))
  .filter(path=>!path.startsWith('content/')&&!path.startsWith('.vite/')&&path!=='service-worker.js')
  .sort();
const shell=['/','/content/manifest.json',...files.map(path=>'/'+path)];
const source=`
const CACHE_NAME='french-vnext-shell-v1';
const APP_SHELL=${JSON.stringify(shell)};
const SHELL_PATHS=new Set(APP_SHELL.map(path=>new URL(path,self.location.origin).pathname));
const cache=()=>caches.open(CACHE_NAME);
const ownedResponse=response=>response.ok&&response.type==='basic';
self.addEventListener('install',event=>{
  event.waitUntil(cache().then(store=>store.addAll(APP_SHELL)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',event=>{
  // P35 caches belong to the stable app, including french-shell-* and its
  // rollback assets. Remove ONLY obsolete vNext-owned caches.
  event.waitUntil(caches.keys().then(names=>Promise.all(
    names.filter(name=>name.startsWith('french-vnext-')&&name!==CACHE_NAME)
      .map(name=>caches.delete(name)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',event=>{
  const request=event.request;
  if(request.method!=='GET')return;
  const url=new URL(request.url);
  if(url.origin!==self.location.origin)return;
  if(request.mode==='navigate'){
    // Never turn vNext into an offline proxy for other root-origin tools.
    if(url.pathname!=='/'&&url.pathname!=='/index.html')return;
    event.respondWith(fetch(request).then(response=>{
      if(ownedResponse(response)&&response.headers.get('content-type')?.includes('text/html')){
        const copy=response.clone();
        event.waitUntil(cache().then(store=>store.put('/',copy)));
      }
      return response;
    }).catch(async()=>await (await cache()).match('/')||Response.error()));
    return;
  }
  const isContent=url.pathname.startsWith('/content/');
  const isStatic=SHELL_PATHS.has(url.pathname)||url.pathname.startsWith('/assets/');
  if(!isContent&&!isStatic)return; // Never cache Account, API or private reads.
  if(isContent){
    // Content paths are not content-addressed: check online for new source
    // revisions, falling back ONLY to this build's visited/preloaded files.
    event.respondWith(fetch(request).then(response=>{
      if(ownedResponse(response)){
        const copy=response.clone();
        event.waitUntil(cache().then(store=>store.put(request,copy)));
      }
      return response;
    }).catch(async()=>await (await cache()).match(request)||Response.error()));
    return;
  }
  event.respondWith(cache().then(async store=>{
    const cached=await store.match(request);
    if(cached)return cached;
    try{
      const response=await fetch(request);
      if(ownedResponse(response)){
        const copy=response.clone();
        event.waitUntil(store.put(request,copy));
      }
      return response;
    }catch{return Response.error();}
  }));
});
`;
await writeFile(new URL('../dist-vnext/service-worker.js',import.meta.url),source);
console.log(JSON.stringify({cache:'french-vnext-shell-v1',precache:shell.length,contentPrecached:false,manifestPrecached:true},null,2));
