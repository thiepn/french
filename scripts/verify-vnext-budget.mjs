import { readFile,stat } from 'node:fs/promises';import { join } from 'node:path';
const dist=new URL('../dist-vnext/',import.meta.url),html=await readFile(new URL('index.html',dist),'utf8'),manifest=JSON.parse(await readFile(new URL('.vite/manifest.json',dist),'utf8')),entry=manifest['index.html'],failures=[];
if(!entry?.file)failures.push('missing index entry');else{
const root=new URL(dist).pathname,htmlBytes=Buffer.byteLength(html),entryBytes=(await stat(join(root,entry.file))).size;let cssBytes=0;for(const f of entry.css??[])cssBytes+=(await stat(join(root,f))).size;const total=htmlBytes+entryBytes+cssBytes;
if(htmlBytes>6000)failures.push('HTML budget');if(entryBytes>24000)failures.push('JS budget');if(cssBytes>24000)failures.push('CSS budget');if(total>48000)failures.push('total budget');
const routes=Object.values(manifest).filter(v=>typeof v?.src==='string'&&v.src.startsWith('src/routes/'));if(routes.length<8)failures.push('route chunks '+routes.length);if(html.includes('/content/'))failures.push('content linked in initial HTML');
console.log(JSON.stringify({schema:'thiepn-french-p37-vnext-performance-budget',ok:!failures.length,failures,rawBytes:{html:htmlBytes,bootstrapJs:entryBytes,initialCss:cssBytes,totalInitial:total},routeChunks:routes.length,budget:{html:6000,bootstrapJs:24000,initialCss:24000,totalInitial:48000}},null,2));}
if(failures.length)process.exitCode=1;
