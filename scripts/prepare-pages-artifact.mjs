import { cp,mkdir,rm,writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const target=process.argv[2];
if(!['vnext','p35-rollback'].includes(target))throw new Error('Expected deployment target vnext or p35-rollback.');

const root=resolve(new URL('..',import.meta.url).pathname);
const output=resolve(root,'deploy-site');
await rm(output,{recursive:true,force:true});
await mkdir(output,{recursive:true});

if(target==='vnext'){
  await cp(resolve(root,'dist-vnext'),output,{recursive:true});
  await cp(resolve(root,'CNAME'),resolve(output,'CNAME'));
}else{
  for(const file of [
    'index.html','release.json','service-worker.js','manifest.webmanifest',
    'icon.svg','icon-192.png','icon-512.png','maskable-icon.svg','CNAME'
  ])await cp(resolve(root,file),resolve(output,file));
  await cp(resolve(root,'vendor'),resolve(output,'vendor'),{recursive:true});
}

await writeFile(resolve(output,'deployment-marker.json'),JSON.stringify({
  schema:'thiepn-french-pages-deployment-v1',
  target,
  sourceSha:process.env.GITHUB_SHA||'local',
  preparedAt:new Date().toISOString()
},null,2)+'\n');

console.log(JSON.stringify({
  schema:'thiepn-french-p37h-pages-artifact',
  target,
  output:'deploy-site',
  generatedBuild:target==='vnext'
},null,2));
