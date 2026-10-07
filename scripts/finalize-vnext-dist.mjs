import { copyFile,mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';

const root=resolve(new URL('..',import.meta.url).pathname);
const dist=resolve(root,'dist-vnext');
await mkdir(dist,{recursive:true});
for(const file of ['icon.svg','icon-192.png','icon-512.png','maskable-icon.svg']){
  await copyFile(resolve(root,file),resolve(dist,file));
}
console.log(JSON.stringify({schema:'thiepn-french-p37h-dist-finalize',copied:['icon.svg','icon-192.png','icon-512.png','maskable-icon.svg']},null,2));
