import { createHash } from 'node:crypto';
import { existsSync,readFileSync } from 'node:fs';
import { defineConfig } from 'vite';
export default defineConfig(({command})=>{
  // content:vnext executes before the production Vite build. Embed exactly
  // that generated manifest's bytes digest into every JS bundle. A running
  // older tab cannot adopt a newer server or service-worker manifest.
  const path=new URL('./app/public/content/manifest.json',import.meta.url);
  if(command==='build'&&!existsSync(path))
    throw Error('Build requires generated French content manifest.');
  const digest=existsSync(path)
    ?createHash('sha256').update(readFileSync(path)).digest('hex'):'';
  return{define:{__FRENCH_CONTENT_MANIFEST_SHA__:JSON.stringify(digest)},
  root:'app',
  base:'/',
  publicDir:'public',
  build:{outDir:'../dist-vnext',emptyOutDir:true,target:'es2022',cssCodeSplit:true,sourcemap:false,manifest:true,reportCompressedSize:true,modulePreload:{polyfill:false}}
  };
});
