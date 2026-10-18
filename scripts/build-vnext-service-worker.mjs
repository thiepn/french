import { readdir,readFile,writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
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
const digest=createHash('sha256');
for(const path of files){
  digest.update(path+'\0');
  digest.update(await readFile(join(rootPath,path)));
}
digest.update(await readFile(join(rootPath,'content/manifest.json')));
const shellCache='french-vnext-shell-'+digest.digest('hex').slice(0,12);
const contentCache='french-vnext-content-v1';
const manifestSha=createHash('sha256').update(await readFile(join(rootPath,'content/manifest.json'))).digest('hex');
const shell=['/','/content/manifest.json',...files.map(path=>'/'+path)];
const shellDigests=Object.fromEntries(await Promise.all(shell.map(async path=>[
  path,createHash('sha256').update(await readFile(join(rootPath,path==='/'?'index.html':path.slice(1)))).digest('hex')
])));
const source=`
const CACHE_NAME=${JSON.stringify(shellCache)};
const CONTENT_CACHE=${JSON.stringify(contentCache)};
const LEGACY_SHELL='french-vnext-shell-v1';
const PINNED_MANIFEST=${JSON.stringify('/content/manifest.json?verifiedSha256='+manifestSha)};
const APP_SHELL=${JSON.stringify(shell)};
const SHELL_DIGESTS=${JSON.stringify(shellDigests)};
const SHELL_PATHS=new Set(APP_SHELL.map(path=>new URL(path,self.location.origin).pathname));
const cache=()=>caches.open(CACHE_NAME);
const sha256=async response=>{
  if(!response?.ok)return null;
  const bytes=await response.arrayBuffer();
  const digest=await crypto.subtle.digest('SHA-256',bytes);
  return Array.from(new Uint8Array(digest)).map(b=>b.toString(16).padStart(2,'0')).join('');
};
async function shellHealth(){
  const names=await caches.keys();
  if(!names.includes(CACHE_NAME))return{ready:false,total:APP_SHELL.length,valid:0,missing:APP_SHELL,cachePresent:false};
  const store=await cache(),missing=[];
  for(const path of APP_SHELL){
    const response=await store.match(path);
    try{
      if(!response||await sha256(response)!==SHELL_DIGESTS[path])missing.push(path);
    }catch{missing.push(path);}
  }
  return{ready:missing.length===0,total:APP_SHELL.length,valid:APP_SHELL.length-missing.length,
    missing,cachePresent:true};
}
async function restoreVerifiedShell(){
  // Fetch all exact build assets and verify EVERY digest before a single cache
  // write. An old worker may not repopulate itself with newer deployed bytes.
  // This never accesses IndexedDB, Account, P35 or private learner content.
  const recovered=[];
  for(const path of APP_SHELL){
    const response=await fetch(path,{cache:'no-store'});
    if(await sha256(response.clone())!==SHELL_DIGESTS[path])
      throw Error('Installed French version no longer matches its online shell: '+path+'. Reload online to update first.');
    recovered.push({path,response});
  }
  const store=await cache();
  for(const {path,response} of recovered)await store.put(path,response.clone());
  const manifest=recovered.find(item=>item.path==='/content/manifest.json');
  if(manifest)try{
    await(await caches.open(CONTENT_CACHE)).put(PINNED_MANIFEST,manifest.response.clone());
  }catch(error){console.warn('French verified manifest secondary cache unavailable',error);}
  const status=await shellHealth();
  if(!status.ready)throw Error('App-shell verification failed after restoration.');
  return status;
}
self.addEventListener('install',event=>{
  event.waitUntil(restoreVerifiedShell().then(()=>self.skipWaiting()));
});
// The only supported messages are a read-only shell diagnostic or an explicit
// public-asset repair. Reply only over the requesting same-origin client's port.
self.addEventListener('message',event=>{
  const type=event.data?.type;
  if(type!=='FRENCH_VNEXT_SHELL_CHECK'&&type!=='FRENCH_VNEXT_SHELL_REPAIR')return;
  const port=event.ports?.[0],source=event.source;
  if(!port||!source?.url)return;
  try{if(new URL(source.url).origin!==self.location.origin)return;}
  catch{return;}
  event.waitUntil((async()=>{
    try{
      if(type==='FRENCH_VNEXT_SHELL_REPAIR'){
        const before=await shellHealth();
        if(before.ready){port.postMessage({ok:true,status:before});return;}
        const after=await restoreVerifiedShell();
        port.postMessage({ok:true,status:after});
      }else port.postMessage({ok:true,status:await shellHealth()});
    }catch(error){port.postMessage({ok:false,error:error instanceof Error?error.message:String(error)});}
  })());
});
self.addEventListener('activate',event=>{
  // Never delete the shell backing an older tab while it is still open:
  // after skipWaiting a new worker may control pages running older JS.
  // Do not use storage pressure as a reason to erase P35, learner data, or
  // SHA-verified public content. When no windows remain, retain two previous
  // native builds for rollback and prune only older native shell versions.
  event.waitUntil((async()=>{
    const clients=await self.clients.matchAll({type:'window',includeUncontrolled:true});
    if(clients.length===0){
      const names=await caches.keys();
      const older=names.filter(name=>
        /^french-vnext-shell-[0-9a-f]{12}$/.test(name)&&name!==CACHE_NAME);
      await Promise.all(older.slice(0,-2).map(name=>caches.delete(name)));
    }
    await self.clients.claim();
  })());
});
self.addEventListener('fetch',event=>{
  const request=event.request;
  if(request.method!=='GET')return;
  const url=new URL(request.url);
  if(url.origin!==self.location.origin)return;
  if(request.mode==='navigate'){
    // Never turn vNext into an offline proxy for other root-origin tools.
    if(url.pathname!=='/'&&url.pathname!=='/index.html')return;
    // Online HTML may be from the NEXT build. Never poison this immutable shell.
    event.respondWith(fetch(request).catch(async()=>
      await (await cache()).match('/')||Response.error()));
    return;
  }
  const isContent=url.pathname.startsWith('/content/');
  const isStatic=SHELL_PATHS.has(url.pathname);
  const priorAsset=url.pathname.startsWith('/assets/')&&!isStatic;
  if(!isContent&&!isStatic&&!priorAsset)return; // Never cache Account, API or private reads.
  if(priorAsset){
    // Old tabs may request a hashed lazy chunk after skipWaiting() activates a
    // newer worker. Recover ONLY that exact asset from the previous vNext
    // build; never read P35 or unrelated caches and never copy old bytes into
    // the new build's immutable shell.
    const previous=async()=>{
      const names=(await caches.keys()).filter(name=>
        /^french-vnext-shell-[0-9a-f]{12}$/.test(name)&&name!==CACHE_NAME);
      for(const name of names.reverse()){
        const found=await(await caches.open(name)).match(request);
        if(found)return found;
      }
      return null;
    };
    event.respondWith(fetch(request).then(async response=>
      response.status===404?await previous()||response:response
    ).catch(async()=>await previous()||Response.error()));
    return;
  }
  if(isContent){
    // The verified content loader and manifest parser own cache.put.
    // Network responses must not poison a previously validated offline pack.
    event.respondWith(fetch(request).catch(async()=>{
      const installed=await cache();
      if(url.pathname==='/content/manifest.json'){
        const manifest=await installed.match(request);
        if(manifest)return manifest;
      }
      const verified=await (await caches.open(CONTENT_CACHE)).match(request);
      if(verified)return verified;
      // Older vNext v1 saved only verified public content in the shell cache.
      const legacy=await caches.open(LEGACY_SHELL);
      return await legacy.match(request)||await installed.match(request)||Response.error();
    }));
    return;
  }
  event.respondWith(cache().then(async store=>{
    const cached=await store.match(request);
    if(cached)return cached;
    // A newly deployed chunk does not belong in the older immutable shell.
    try{return await fetch(request);}
    catch{return Response.error();}
  }));
});
`;
await writeFile(new URL('../dist-vnext/service-worker.js',import.meta.url),source);
console.log(JSON.stringify({cache:shellCache,verifiedContentCache:contentCache,precache:shell.length,contentPrecached:false,manifestPrecached:true},null,2));
