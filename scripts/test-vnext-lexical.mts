import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import type {VocabularySearchRow,UsagePack} from '../app/src/core/content/loader.ts';
import type {CanonicalSrsRecordV1} from '../app/src/core/learner/model.ts';
import {uniqueLexicalAnchor,linkedNoteIds,buildLexicalSignals,lexicalPriority} from '../app/src/core/usage/lexical.ts';
import {freshUsageState,accumulateUsageTally,type UsageAttempt,type UsageState} from '../app/src/core/usage/session.ts';
import {usageRecordMastery,rankUsageCandidates,CONTEXT_REVALIDATION_DAYS} from '../app/src/core/usage/mastery.ts';
const source=JSON.parse(await readFile(new URL('./data/stable-usage-corpus-v1.json',import.meta.url),'utf8'));
const pack={records:source.records} as Pick<UsagePack,'records'>;
const now=1_800_000_000_000,DAY=86_400_000;
const word=(id:string,word:string,pos='verb'):VocabularySearchRow=>({
  id,word,pos,meaning:'',ipa:'',article:'',gender:'',level:'A2',order:1,packId:'test'
});
const index=[
  word('lex:apprendre','apprendre'),word('lex:arriver','arriver'),
  word('lex:penser','penser'),word('lex:penser-n','penser','noun'),
  word('lex:aider','aider'),word('lex:faire','faire'),word('lex:nom','noter','noun')
];
const rec=(id:string)=>pack.records.find(r=>r.id===id)!;
assert.equal(uniqueLexicalAnchor(rec('p10-001'),index)?.id,'lex:apprendre');
assert.equal(uniqueLexicalAnchor(rec('p10-007'),index),null,'homograph must never be mapped by guessed word sense');
assert.equal(uniqueLexicalAnchor(rec('p10-050'),index),null,'unknown noun or phrase must not invent a lexeme link');
assert.equal(uniqueLexicalAnchor({anchor:'noter'} as any,index),null,'noun-only index entry cannot stand for a verb');
assert.deepEqual(linkedNoteIds([rec('p10-001'),rec('p10-002'),rec('p10-007')],index),
  ['lex:apprendre','lex:arriver'],'batched SRS reads should request only unique verb IDs');
const srs=(id:string,options:Record<string,unknown>={}):CanonicalSrsRecordV1=>({
  noteId:id,skill:'production',sense:0,status:'learned',seen:5,successes:4,
  lapses:0,lastRating:'good',dueAt:now+7*DAY,suspended:false,manualKnown:false,
  relearning:false,...options
} as CanonicalSrsRecordV1);
const secure=srs('lex:apprendre'),due=srs('lex:arriver',{dueAt:now-DAY});
const before=JSON.stringify([secure,due]);
const byId=new Map<string,CanonicalSrsRecordV1[]>([
 ['lex:apprendre',[secure]],['lex:arriver',[due]],['lex:aider',[srs('lex:aider',{lastRating:'again'})]]
]);
let linked=buildLexicalSignals(pack.records,index,byId,now);
assert.equal(linked.get('p10-001')?.status,'recent-production');
assert.equal(linked.get('p10-002')?.status,'due');
assert.equal(linked.get('p10-007')?.status,'ambiguous');
assert.equal(linked.get('p10-004')?.status,'weak');
assert.equal(linked.get('p10-050')?.status,'unmapped');
assert.ok(lexicalPriority(linked.get('p10-002'))>lexicalPriority(linked.get('p10-001')));
assert.equal(JSON.stringify([secure,due]),before,'crosswalk is strictly read-only to SRS');
assert.equal(buildLexicalSignals(pack.records,index,new Map([
 ['lex:apprendre',[srs('lex:apprendre',{sense:1})]]
]),now).get('p10-001')?.status,'untracked','sense 1 is not interchangeable with sense 0');
assert.equal(buildLexicalSignals(pack.records,index,new Map([
 ['lex:apprendre',[srs('lex:apprendre',{manualKnown:true})]]
]),now).get('p10-001')?.status,'developing','manual-known cannot certify production');
assert.equal(buildLexicalSignals(pack.records,index,new Map([
 ['lex:apprendre',[srs('lex:apprendre'),srs('lex:apprendre')]]
]),now).get('p10-001')?.status,'ambiguous','conflicting production rows must not be trusted');

function add(state:UsageState,id:string,mode:'usage'|'context',variant:0|1=0,at=now):UsageState{
  const event:UsageAttempt={recordId:id,mode,variant,at,outcome:'matched',diagnosis:'exact',support:0};
  const group={...(state.tallies[id]??{})};
  group[mode]=accumulateUsageTally(group[mode],event);
  return {...state,history:[event,...state.history].slice(0,300),tallies:{...state.tallies,[id]:group}};
}
let state=freshUsageState();
for(const id of ['p10-001','p10-002']){
  state=add(state,id,'usage',0,now-3*DAY);
  state=add(state,id,'usage',0,now-2*DAY);
}
const original=rankUsageCandidates(pack,state,'context',now);
assert.equal(original[0].record.id,'p10-001','without SRS, tie breaks by original source order');
const ranked=rankUsageCandidates(pack,state,'context',now,linked);
assert.equal(ranked[0].record.id,'p10-002','due vocabulary gains priority without rescheduling its review');
assert.equal(state.tallies['p10-001'].context,undefined,'ranking never writes transfer evidence');
assert.equal(CONTEXT_REVALIDATION_DAYS,30);
state=add(state,'p10-001','context',0,now-32*DAY);
state=add(state,'p10-001','context',1,now-31*DAY);
const fresh=usageRecordMastery('p10-001',state,now-30*DAY);
assert.equal(fresh.contextual.secure,true);
const stale=usageRecordMastery('p10-001',state,now);
assert.equal(stale.contextual.secure,false);
assert.equal(stale.contextual.status,'refresh');
assert.equal(rankUsageCandidates(pack,state,'context',now).find(row=>row.record.id==='p10-001')?.reason,
  'Revalidate a context after 30 days');
assert.equal(JSON.stringify(state).includes('J\'apprends'),false,'never persist typed responses');
console.log(JSON.stringify({schema:'french-p37i-c6-lexical-integration',ok:true,
  lexicalMatch:'unique verb lemma only',srs:'read-only',contextRefreshDays:30,
  distinctContextEvidence:true,privacy:'metadata-only'}));
