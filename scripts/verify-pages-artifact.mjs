import { readFile,stat } from 'node:fs/promises';
import { resolve } from 'node:path';

const target=process.argv[2];
if(!target){
  console.log(JSON.stringify({
    schema:'thiepn-french-p37h-pages-artifact-verification',
    ok:true,
    mode:'static-self-check',
    targets:['vnext','p35-rollback']
  },null,2));
  process.exit(0);
}
if(!['vnext','p35-rollback'].includes(target))throw new Error('Expected vnext or p35-rollback.');
const root=resolve(new URL('..',import.meta.url).pathname);
const site=resolve(root,'deploy-site');
const failures=[];

async function exists(path){
  try{await stat(resolve(site,path));return true;}catch{return false;}
}
for(const file of ['index.html','service-worker.js','manifest.webmanifest','icon-192.png','icon-512.png','maskable-icon.svg','CNAME','deployment-marker.json']){
  if(!(await exists(file)))failures.push('missing '+file);
}
const html=await readFile(resolve(site,'index.html'),'utf8');
const sw=await readFile(resolve(site,'service-worker.js'),'utf8');
const marker=JSON.parse(await readFile(resolve(site,'deployment-marker.json'),'utf8'));

if(marker.target!==target)failures.push('deployment marker target');
if(target==='vnext'){
  if(!html.includes('data-runtime="vnext"'))failures.push('vNext runtime marker');
  if(!sw.includes("VERSION='p37h-1'"))failures.push('vNext service worker');
  if(!(await exists('vnext-release.json')))failures.push('vNext release marker');
  if(!(await exists('assets')))failures.push('vNext hashed assets');
}else{
  if(!html.includes('P35 Stable Release, Live Browser/Device Acceptance & Defect-Only Hardening'))failures.push('P35 stable marker');
  const release=JSON.parse(await readFile(resolve(site,'release.json'),'utf8'));
  if(release.phase!=='P35'||release.channel!=='stable')failures.push('P35 release identity');
  if(!(await exists('vendor')))failures.push('P35 vendor runtime');
}

console.log(JSON.stringify({
  schema:'thiepn-french-p37h-pages-artifact-verification',
  target,
  ok:failures.length===0,
  failures
},null,2));
if(failures.length)process.exitCode=1;
