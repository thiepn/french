const VERSION='p37h-1';
const SHELL_CACHE='french-vnext-shell-'+VERSION;
const RUNTIME_CACHE='french-vnext-runtime-'+VERSION;
const SHELL=['/','/manifest.webmanifest','/vnext-release.json'];

self.addEventListener('install',event=>{
  event.waitUntil(caches.open(SHELL_CACHE).then(cache=>cache.addAll(SHELL)).then(()=>self.skipWaiting()));
});

self.addEventListener('activate',event=>{
  event.waitUntil((async()=>{
    const keys=await caches.keys();
    await Promise.all(keys.filter(key=>
      (key.startsWith('french-vnext-')||key.startsWith('french-shell-'))&&
      key!==SHELL_CACHE&&key!==RUNTIME_CACHE
    ).map(key=>caches.delete(key)));
    await self.clients.claim();
  })());
});

async function cacheResponse(cacheName,request,response){
  if(response&&response.ok){
    const cache=await caches.open(cacheName);
    await cache.put(request,response.clone());
  }
  return response;
}
async function cacheFirst(request){
  const cached=await caches.match(request);
  if(cached)return cached;
  return cacheResponse(RUNTIME_CACHE,request,await fetch(request));
}
async function networkFirst(request,fallback){
  try{return await cacheResponse(RUNTIME_CACHE,request,await fetch(request));}
  catch{
    return (await caches.match(request))||(fallback?await caches.match(fallback):undefined)||Response.error();
  }
}

self.addEventListener('fetch',event=>{
  const request=event.request;
  if(request.method!=='GET')return;
  const url=new URL(request.url);
  if(url.origin!==self.location.origin)return;

  if(request.mode==='navigate'){
    event.respondWith(networkFirst(request,'/'));
    return;
  }

  const path=url.pathname;
  if(path.startsWith('/assets/')||path.startsWith('/content/packs/')||path.startsWith('/content/search/')){
    event.respondWith(cacheFirst(request));
    return;
  }

  if(path==='/content/manifest.json'||path==='/vnext-release.json'||path==='/manifest.webmanifest'){
    event.respondWith(networkFirst(request));
    return;
  }

  if(path==='/icon-192.png'||path==='/icon-512.png'||path==='/maskable-icon.svg'||path==='/icon.svg'){
    event.respondWith(cacheFirst(request));
  }
});
