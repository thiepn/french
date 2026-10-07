import { readFile } from 'node:fs/promises';

const [html,contract,reader,docs]=await Promise.all([
  readFile(new URL('../index.html',import.meta.url),'utf8'),
  readFile(new URL('../app/src/core/migration/legacy-contract.ts',import.meta.url),'utf8'),
  readFile(new URL('../app/src/core/migration/legacy-reader.ts',import.meta.url),'utf8'),
  readFile(new URL('../docs/P37B_DATA_MIGRATION_CONTRACT.md',import.meta.url),'utf8')
]);

const failures=[];
const need=(source,token,label=token)=>{if(!source.includes(token))failures.push('missing '+label);};

for(const token of [
  "DEPTH_DB_NAME='french3000-depth-v31'",
  "DEPTH_STATE_KEY='app-state'",
  "const DEPTH_BACKUP_SCHEMA=13",
  "const DEPTH_VERSION='3.6.9'"
]) need(html,token,'stable source '+token);

for(const token of [
  "LEGACY_DEPTH_DB = 'french3000-depth-v31'",
  "LEGACY_DEPTH_STATE_KEY = 'app-state'",
  "LEGACY_DEPTH_SCHEMA = 13",
  "LEGACY_DEPTH_VERSION = '3.6.9'",
  "'french3000-progress-v2'",
  "'french3000-review-log-v3'",
  "'french3000-user-cards-v1'",
  "'french-cefr-progression-v1'",
  "'french-b2-spontaneous-oral-v1'"
]) need(contract,token,'migration contract '+token);

for(const token of [
  "indexedDB.open(LEGACY_DEPTH_DB)",
  "transaction(LEGACY_DEPTH_STORE,'readonly')",
  "source=depth?'depth-db':'local-storage'",
  "fingerprint:await fingerprintPayload(payload)"
]) need(reader,token,'read-only reader '+token);

for(const token of [
  'preservation import',
  'vNext never deletes P35 storage',
  'vNext never rewrites P35 storage',
  'P37C'
]) need(docs,token,'migration documentation '+token);

console.log(JSON.stringify({
  schema:'thiepn-french-p37b-migration-contract',
  ok:failures.length===0,
  failures,
  authoritativeSource:'indexeddb:french3000-depth-v31/kv/app-state',
  destructiveMigration:false
},null,2));

if(failures.length)process.exitCode=1;
