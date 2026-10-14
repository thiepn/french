/**
 * U41 source-only editorial structure check. No SRS, account, network or writes.
 * This verifies authored records and historical source identities, NOT the
 * linguistic correctness of French or live learner functionality.
 */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {resolve,dirname} from 'node:path';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const read=(relative:string)=>readFileSync(resolve(root,relative),'utf8');
const scenes:Record<string,readonly string[]>={
 'u19-91-93.ts':['transfer-91','transfer-92','transfer-93'],
 'u20-106-108.ts':['transfer-106','transfer-107','transfer-108'],
 'u21-121-123.ts':['transfer-121','transfer-122','transfer-123'],
 'u22-148.ts':['transfer-148'],
 'u22-149.ts':['transfer-149'],
 'u22-150.ts':['transfer-150']
};
let dialogueCount=0;
for(const [file,ids] of Object.entries(scenes)){
 const body=read('app/src/core/unified/'+file);
 const matches=[...body.matchAll(/"dialogue"\s*:\s*(\[[\s\S]*?\n\s*\]),\s*\n\s*"(?:readingTitle|paragraphs|reading|grammar|tasks|readings)"/g)];
 assert.equal(matches.length,ids.length,'Preserved source dialogue groups: '+file);
 const actualIds=[...body.matchAll(/"id"\s*:\s*"(transfer-\d+)"/g)].map(m=>m[1]);
 assert.deepEqual(actualIds,ids,'Preserved source case IDs: '+file);
 for(const segment of matches){
  const dialogue=JSON.parse(segment[1]) as string[][];
  assert.equal(dialogue.length,9,'Original nine-turn teaching context preserved');
  for(const row of dialogue)assert.ok(row.length===3&&row.every(v=>typeof v==='string'&&v.trim()),
   'French and English turns must both be supplied');
  dialogueCount+=dialogue.length;
 }
}
assert.equal(dialogueCount,108);
for(const file of ['u21-121-123.ts','u21-124-126.ts','u21-127-129.ts',
 'u21-130-132.ts','u21-133.ts','u21-134.ts','u21-135.ts']){
 const source=read('app/src/core/unified/'+file);
 const cases=[...source.matchAll(/"id"\s*:\s*"(transfer-\d+)"/g)].length;
 const headings=[...source.matchAll(/"readingTitle"\s*:\s*"[^"]+"/g)].length;
 assert.equal(cases,headings,'Source must include one original reading title per U21 story');
}
const added:Record<string,readonly string[]>={
 'u6-a1-05-08.ts':['a1-06','a1-07'],
 'u8-a2-05-08.ts':['a2-05','a2-06'],
 'u9-a2-15-18.ts':['a2-15'],
 'u9-a2-19-22.ts':['a2-20'],
 'u10-b1-01-04.ts':['b1-01','b1-02'],
 'u10-b1-05-08.ts':['b1-07','b1-08']
};
let extraCount=0;
for(const [file,ids] of Object.entries(added)){
 const source=read('app/src/core/unified/'+file);
 for(const id of ids){
  const at=source.indexOf("\n id:'"+id+"'");
  const end=source.indexOf('\n writing:',at);
  assert.ok(at>=0&&end>at,'Original authoring unit must be unchanged: '+id);
  const section=source.slice(at,end);
  const rows=[...section.matchAll(/^\s*\["(choice|fill)",[^\n]+/gm)]
    .map(m=>JSON.parse(m[0].trim().replace(/,$/,'')) as unknown[]);
  assert.equal(rows.length,2,'Exactly two different-context additions: '+id);
  for(const [kind,prompt,answer,explanation,choices] of rows){
   assert.ok(typeof prompt==='string'&&prompt.length>30);
   assert.ok(typeof answer==='string'&&answer.trim());
   assert.ok(typeof explanation==='string'&&explanation.length>40);
   if(kind==='choice'){
    assert.ok(Array.isArray(choices)&&choices.length===3&&choices.includes(answer),
     'Source-grounded answer must be a selectable authored option');
   }
   extraCount++;
  }
 }
}
assert.equal(extraCount,20);
const text=read('app/src/core/unified/u22-148.ts');
assert.ok(text.includes('« ne ... pas »')&&text.includes('« Je signerai »'),
 'Complete French negation and resulting positive sentence must be explicit');
const course=read('app/src/routes/u6-a1-panel.ts');
assert.ok(course.includes('Show English study note')&&course.includes("teachingSummary=unit.id.startsWith('transfer-')"),
 'English explanatory paraphrases must not be presented as direct translations');
console.log('U41 source integrity OK: 108 dialogue turns; 15 reading titles; 20 additional tasks; two-part negation and English-summary labeling.');
