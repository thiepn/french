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
const SEARCH_DIR = resolve(CONTENT_DIR, 'search');
const READING_DIR = resolve(CONTENT_DIR, 'readings');
const READING_SOURCE_FILE = resolve(ROOT, 'scripts/data/stable-readings-v1.json');
const SENTENCE_SOURCE_FILE = resolve(ROOT, 'scripts/data/stable-sentence-exercises-v1.json');
const SENTENCE_DIR = resolve(CONTENT_DIR, 'sentences');

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
await rm(SEARCH_DIR, { recursive: true, force: true });
await rm(READING_DIR, { recursive: true, force: true });
await rm(SENTENCE_DIR, { recursive: true, force: true });
await mkdir(PACK_DIR, { recursive: true });
await mkdir(SEARCH_DIR, { recursive: true });
await mkdir(READING_DIR, { recursive: true });
await mkdir(SENTENCE_DIR, { recursive: true });

const byLevel = new Map();
for (const word of source.words) {
  const level = cleanLevel(word.level);
  const list = byLevel.get(level) || [];
  list.push(word);
  byLevel.set(level, list);
}

const packs = [];
const searchRows = [];
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
    for (const word of slice) {
      searchRows.push({
        id: String(word.id || ''),
        word: String(word.word || ''),
        meaning: String(word.meaning || ''),
        ipa: String(word.ipa || ''),
        pos: String(word.pos || ''),
        article: String(word.article || ''),
        gender: String(word.gender || ''),
        level,
        order: Number(word.order) || 0,
        packId: id
      });
    }
  }
}

const searchPayload = {
  schema: 'thiepn-french-vocabulary-search-v1',
  revision: SOURCE_BLOB.slice(0, 12),
  rows: searchRows
};
const searchBytes = Buffer.from(JSON.stringify(searchPayload));
const searchPath = resolve(SEARCH_DIR, 'vocabulary-index.json');
await writeFile(searchPath, searchBytes);
const vocabularySearch = {
  schema: searchPayload.schema,
  path: '/content/search/vocabulary-index.json',
  count: searchRows.length,
  bytes: searchBytes.length,
  sha256: sha256(searchBytes),
  revision: searchPayload.revision
};

const readingSource = JSON.parse(await readFile(READING_SOURCE_FILE, 'utf8'));
if (readingSource.schema !== 'thiepn-french-stable-reading-source-v1' || !Array.isArray(readingSource.readings)) {
  throw new Error('Stable French reading source schema mismatch.');
}
if (readingSource.readings.length !== Number(readingSource.count) || readingSource.readings.length < 25) {
  throw new Error('Stable French reading corpus is incomplete.');
}
const readingPayload = {
  schema: 'thiepn-french-reading-pack-v1',
  id: 'reading-stable-p35',
  revision: String(readingSource.sourceBlob || '').slice(0, 12),
  sourceRuntime: readingSource.sourceRuntime,
  sourceBlob: readingSource.sourceBlob,
  morphology: readingSource.morphology || {},
  readings: readingSource.readings
};
const readingBytes = Buffer.from(JSON.stringify(readingPayload));
await writeFile(resolve(READING_DIR, 'stable-readings.json'), readingBytes);
const readingPack = {
  id: readingPayload.id,
  kind: 'reading',
  level: 'A1-B2',
  path: '/content/readings/stable-readings.json',
  count: readingPayload.readings.length,
  bytes: readingBytes.length,
  sha256: sha256(readingBytes),
  revision: readingPayload.revision
};
packs.push(readingPack);

const sentenceSource = JSON.parse(await readFile(SENTENCE_SOURCE_FILE, 'utf8'));
if (sentenceSource.schema !== 'thiepn-french-stable-sentence-source-v1' || !Array.isArray(sentenceSource.exercises)) {
  throw new Error('Stable French sentence source schema mismatch.');
}
if (sentenceSource.exercises.length !== Number(sentenceSource.count) || sentenceSource.exercises.length !== 36) {
  throw new Error('Stable French sentence exercise corpus is incomplete.');
}
const sentencePayload = {
  schema: 'thiepn-french-sentence-pack-v1',
  id: 'sentence-stable-p12',
  revision: String(sentenceSource.sourceBlob || '').slice(0, 12) + '-p12',
  sourceRuntime: sentenceSource.sourceRuntime,
  sourcePhase: sentenceSource.sourcePhase,
  sourceBlob: sentenceSource.sourceBlob,
  exercises: sentenceSource.exercises
};
const sentenceBytes = Buffer.from(JSON.stringify(sentencePayload));
await writeFile(resolve(SENTENCE_DIR, 'stable-sentence-exercises.json'), sentenceBytes);
packs.push({
  id: sentencePayload.id,
  kind: 'speaking',
  level: 'A1-B2',
  path: '/content/sentences/stable-sentence-exercises.json',
  count: sentencePayload.exercises.length,
  bytes: sentenceBytes.length,
  sha256: sha256(sentenceBytes),
  revision: sentencePayload.revision
});

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
  indexes: { vocabulary: vocabularySearch },
  totals: {
    records: source.words.length,
    packs: packs.length,
    levels: Object.fromEntries([...byLevel.entries()].map(([level, rows]) => [level, rows.length])),
    readings: readingPayload.readings.length,
    sentenceExercises: sentencePayload.exercises.length
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
  levels: manifest.totals.levels,
  searchIndexBytes: searchBytes.length,
  readings: readingPayload.readings.length,
  readingBytes: readingBytes.length,
  sentenceExercises: sentencePayload.exercises.length,
  sentenceBytes: sentenceBytes.length
}, null, 2));
