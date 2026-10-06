import { createHash } from 'node:crypto';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const SOURCE_COMMIT = 'f8f4046722e2ab661e57a0e6272802dd15eaa288';
const SOURCE_BLOB = '14beb3f21e908a471fe213c99ebc776bd11a5222';
const SOURCE_URL = 'https://raw.githubusercontent.com/kooruhana/sakanaVocab/' + SOURCE_COMMIT + '/data/french.json';
const PACK_SIZE = 250;
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const CONTENT_DIR = resolve(ROOT, 'app/public/content');
const PACK_DIR = resolve(CONTENT_DIR, 'packs');

function gitBlobSha(buffer) {
  const header = Buffer.from('blob ' + buffer.length + '\0');
  return createHash('sha1').update(header).update(buffer).digest('hex');
}
function sha256(buffer) {
  return createHash('sha256').update(buffer).digest('hex');
}
function cleanLevel(value) {
  const level = String(value || 'ungraded').trim();
  return ['starter','A1','A2','B1','B2','C1','C2'].includes(level) ? level : 'ungraded';
}
function slug(value) {
  return String(value).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'ungraded';
}
async function sourceBytes() {
  const local = process.env.FRENCH_CONTENT_SOURCE_FILE;
  if (local) return readFile(resolve(process.cwd(), local));
  const response = await fetch(SOURCE_URL, { headers: { 'user-agent': 'thiepn-french-vnext-content-builder/1' } });
  if (!response.ok) throw new Error('French content source HTTP ' + response.status);
  return Buffer.from(await response.arrayBuffer());
}

const bytes = await sourceBytes();
const blob = gitBlobSha(bytes);
if (blob !== SOURCE_BLOB) throw new Error('Pinned French content blob mismatch: expected ' + SOURCE_BLOB + ', got ' + blob);

const source = JSON.parse(bytes.toString('utf8'));
if (!Array.isArray(source.words)) throw new Error('French content source has no words array.');
const declaredCount = Number(source.count);
const actualCount = source.words.length;
const countMismatch = Number.isFinite(declaredCount) && declaredCount !== actualCount;
if (countMismatch) {
  console.warn('Pinned French source metadata count differs from its words array:', { declaredCount, actualCount });
}

await rm(PACK_DIR, { recursive: true, force: true });
await mkdir(PACK_DIR, { recursive: true });

const byLevel = new Map();
for (const word of source.words) {
  const level = cleanLevel(word.level);
  const list = byLevel.get(level) || [];
  list.push(word);
  byLevel.set(level, list);
}

const packs = [];
for (const level of ['starter','A1','A2','B1','B2','C1','C2','ungraded']) {
  const rows = byLevel.get(level) || [];
  for (let offset = 0; offset < rows.length; offset += PACK_SIZE) {
    const slice = rows.slice(offset, offset + PACK_SIZE);
    const sequence = Math.floor(offset / PACK_SIZE) + 1;
    const id = 'vocabulary-' + slug(level) + '-' + String(sequence).padStart(2, '0');
    const payload = {
      schema: 'thiepn-french-vocabulary-pack-v1',
      id,
      revision: SOURCE_BLOB.slice(0, 12) + '-' + level + '-' + sequence,
      level,
      startOrder: Math.min(...slice.map(row => Number(row.order) || 0)),
      endOrder: Math.max(...slice.map(row => Number(row.order) || 0)),
      words: slice
    };
    const output = Buffer.from(JSON.stringify(payload));
    const filename = id + '.json';
    await writeFile(resolve(PACK_DIR, filename), output);
    packs.push({
      id,
      kind: 'vocabulary',
      level,
      path: '/content/packs/' + filename,
      count: slice.length,
      bytes: output.length,
      sha256: sha256(output),
      revision: payload.revision
    });
  }
}

const manifest = {
  schema: 'thiepn-french-content-manifest-v1',
  revision: 'sakana-' + SOURCE_BLOB.slice(0, 12),
  generatedAt: new Date().toISOString(),
  source: {
    repository: 'kooruhana/sakanaVocab',
    commit: SOURCE_COMMIT,
    blob: SOURCE_BLOB,
    url: SOURCE_URL,
    upstreamVersion: source.version,
    upstreamGeneratedAt: source.generatedAt,
    declaredCount: Number.isFinite(declaredCount) ? declaredCount : null,
    actualCount,
    countMismatch,
    licenses: Array.isArray(source.sources)
      ? source.sources.map(row => ({ name: row.name, license: row.license, url: row.url }))
      : []
  },
  totals: {
    records: source.words.length,
    packs: packs.length,
    levels: Object.fromEntries([...byLevel.entries()].map(([level, rows]) => [level, rows.length]))
  },
  packs
};

await writeFile(resolve(CONTENT_DIR, 'manifest.json'), JSON.stringify(manifest));
console.log(JSON.stringify({
  schema: 'thiepn-french-vnext-content-build',
  ok: true,
  sourceBlob: SOURCE_BLOB,
  sourceRecords: actualCount,
  declaredSourceRecords: Number.isFinite(declaredCount) ? declaredCount : null,
  countMismatch,
  packSize: PACK_SIZE,
  packs: packs.length,
  levels: manifest.totals.levels
}, null, 2));
