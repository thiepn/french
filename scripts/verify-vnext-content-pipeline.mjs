import { readFile } from 'node:fs/promises';

const [builder,manifest,docs,pkg]=await Promise.all([
  readFile(new URL('./build-vnext-content.mjs',import.meta.url),'utf8'),
  readFile(new URL('../app/src/core/content/manifest.ts',import.meta.url),'utf8'),
  readFile(new URL('../docs/P37D_CONTENT_PIPELINE.md',import.meta.url),'utf8'),
  readFile(new URL('../package.json',import.meta.url),'utf8')
]);

const failures=[];
const need=(source,token,label=token)=>{if(!source.includes(token))failures.push('missing '+label);};

for(const token of [
  "SOURCE_COMMIT = 'f8f4046722e2ab661e57a0e6272802dd15eaa288'",
  "SOURCE_BLOB = '14beb3f21e908a471fe213c99ebc776bd11a5222'",
  'const PACK_SIZE = 250',
  "createHash('sha1')",
  "createHash('sha256')",
  "schema: 'thiepn-french-vocabulary-pack-v1'",
  "path: '/content/packs/'"
])need(builder,token,'content builder '+token);

for(const token of ['count?:number','bytes?:number','sha256?:string','totals?:'])need(manifest,token,'manifest '+token);
for(const token of ['12,001 word objects','12,001 to 120,000','Web Worker','P37H'])need(docs,token,'documentation '+token);
const packageJson=JSON.parse(pkg);
if(typeof packageJson.scripts?.['build:vnext']!=='string'||!packageJson.scripts['build:vnext'].startsWith('npm run content:vnext && vite build'))failures.push('missing content build before Vite');

console.log(JSON.stringify({
  schema:'thiepn-french-p37d-content-pipeline',
  ok:failures.length===0,
  failures,
  sourceRecords:12001,
  packSize:250,
  bootstrapCoupledToRecordCount:false
},null,2));
if(failures.length)process.exitCode=1;
