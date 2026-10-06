import { readFile, writeFile } from 'node:fs/promises';

const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');

function collect(regex, group = 1) {
  const values = new Set();
  for (const match of html.matchAll(regex)) {
    const value = match[group];
    if (value) values.add(value);
  }
  return [...values].sort();
}

const localStorageKeys = collect(/localStorage\.(?:getItem|setItem|removeItem)\(\s*(['"`])([^'"`]+)\1/g, 2);
const sessionStorageKeys = collect(/sessionStorage\.(?:getItem|setItem|removeItem)\(\s*(['"`])([^'"`]+)\1/g, 2);
const indexedDbNames = collect(/indexedDB\.open\(\s*(['"`])([^'"`]+)\1/g, 2);
const createdStores = collect(/createObjectStore\(\s*(['"`])([^'"`]+)\1/g, 2);
const referencedStores = collect(/objectStore\(\s*(['"`])([^'"`]+)\1/g, 2);
const backupFilenames = collect(/(['"`])(french[^'"`\s<>]*\.json)\1/gi, 2);
const frenchStringLiterals = collect(/(['"`])([^'"`\n]{0,120}french[^'"`\n]{0,120})\1/gi, 2)
  .filter(value => /(?:storage|state|setting|progress|review|backup|cache|snapshot|sync|srs|evidence|profile|session)/i.test(value))
  .slice(0, 250);

const report = {
  schema: 'thiepn-french-p37b-legacy-storage-discovery-v1',
  source: 'stable-P35-index.html',
  sourceBytes: Buffer.byteLength(html),
  localStorageKeys,
  sessionStorageKeys,
  indexedDbNames,
  createdStores,
  referencedStores,
  backupFilenames,
  candidateFrenchStorageStrings: frenchStringLiterals,
  note: 'Literal discovery is an inventory aid, not yet the authoritative migration contract. P37B must trace indirect constants and schemas before cutover.'
};

await writeFile(new URL('../legacy-storage-contract.json', import.meta.url), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report, null, 2));
