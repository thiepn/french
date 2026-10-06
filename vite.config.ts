import { defineConfig } from 'vite';
export default defineConfig({
  root:'app',
  base:'/',
  publicDir:'public',
  build:{outDir:'../dist-vnext',emptyOutDir:true,target:'es2022',cssCodeSplit:true,sourcemap:false,manifest:true,reportCompressedSize:true,modulePreload:{polyfill:false}}
});
