import { readFile,stat } from 'node:fs/promises';
const [pkgText,config,index,main,router,startup,manifestText,releaseText,doc]=await Promise.all([
readFile(new URL('../package.json',import.meta.url),'utf8'),readFile(new URL('../vite.config.ts',import.meta.url),'utf8'),readFile(new URL('../app/index.html',import.meta.url),'utf8'),readFile(new URL('../app/src/main.ts',import.meta.url),'utf8'),readFile(new URL('../app/src/core/router.ts',import.meta.url),'utf8'),readFile(new URL('../app/src/core/startup.ts',import.meta.url),'utf8'),readFile(new URL('../app/public/content/manifest.json',import.meta.url),'utf8'),readFile(new URL('../app/public/vnext-release.json',import.meta.url),'utf8'),readFile(new URL('../docs/P37_SCALABLE_RUNTIME_REBUILD.md',import.meta.url),'utf8')]);
const failures=[],need=(s,t)=>{if(!s.includes(t))failures.push('missing '+t);};
const pkg=JSON.parse(pkgText);if(pkg.devDependencies?.vite!=='8.3.3')failures.push('Vite pin drift');if(pkg.devDependencies?.typescript!=='7.0.2')failures.push('TypeScript pin drift');
for(const t of ["root:'app'","outDir:'../dist-vnext'","cssCodeSplit:true","manifest:true"])need(config,t);
if(index.length>6000)failures.push('source HTML > 6 KB');for(const t of ['P35 Stable Release','v5100RunQa','french3000'])if(index.includes(t)||main.includes(t))failures.push('legacy bootstrap token '+t);
for(const t of ["requestAnimationFrame","beginBackgroundStartup"])need(main,t);
for(const t of ["import('../routes/home')","import('../routes/learn')","import('../routes/review')","import('../routes/words')","import('../routes/listen')","import('../routes/speak')","import('../routes/progress')","import('../routes/settings')"])need(router,t);
for(const t of ["await import('./storage/hydrate')","requestIdleCallback","french:vnext-state-ready"])need(startup,t);
const manifest=JSON.parse(manifestText);if(manifest.schema!=='thiepn-french-content-manifest-v1'||!Array.isArray(manifest.packs))failures.push('content manifest invalid');
const release=JSON.parse(releaseText);if(release.productionCutover!==false||release.stableProduction!=='5.24.0/P35')failures.push('cutover boundary invalid');
for(const t of ['content growth must not increase bootstrap cost','No production cutover in P37A','P37B','P37C','P37D','P37E','P37F','P37G','P37H'])need(doc,t);
if((await stat(new URL('../index.html',import.meta.url))).size<2000000)failures.push('stable legacy app unexpectedly changed');
console.log(JSON.stringify({schema:'thiepn-french-p37-vnext-architecture',ok:!failures.length,failures},null,2));if(failures.length)process.exitCode=1;
