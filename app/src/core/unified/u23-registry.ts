import {ORIGINAL_FRENCH_U22_COURSE} from './u22-course.ts';
import {ORIGINAL_TRANSFER_SCENARIOS} from './u13-course.ts';
import {
 ORIGINAL_U22_CONNECTED_READINGS,u22OriginalEvidence,listeningQuestionsForU22,
 originalOralResponseU22,u22ProductionChoices
} from './u22-material.ts';
import {SOURCES,sourceId} from './source.ts';
import type {A1Unit} from './u6-a1-model.ts';
import type {B1Reading} from './u10-readings-01-07.ts';

/**
 * U23 read-only index over existing original source objects.
 * No cloned lesson bodies, learner state, grading, review scheduling or cloud writes.
 */
export type OriginalLevel='A1'|'A2'|'B1'|'B1+'|'Early B2';
export type OriginalMaterialKind='reading'|'listening'|'writing'|'source-comparison';
export type OriginalSurface='course'|'read'|'listen'|'write'|'speak';
export type OriginalStage='understand'|'words'|'dialogue'|'listen'|'practice'|'write';

export interface OriginalCatalogEntry {
 readonly id:string;
 readonly order:number;
 readonly title:string;
 readonly goal:string;
 readonly level:OriginalLevel;
 readonly qualifiedId:string;
 readonly sourceRevision:string;
 readonly prerequisites:readonly string[];
 readonly reading:boolean;
 readonly listening:boolean;
 readonly writing:boolean;
 readonly sourceComparison:boolean;
 /** Source-authored U13 grammar transition, distinct from integrated-task CEFR. */
 readonly foundationBand?:'A1→A2'|'A2→B1'|'B1 integrated';
 readonly grammarRefreshers?:readonly string[];
}
export interface OriginalBrowseFilters {
 readonly query?:string;
 readonly level?:OriginalLevel|'all';
 readonly material?:OriginalMaterialKind|'all';
 readonly offset?:number;
 readonly limit?:number;
}
export interface OriginalBrowseResult {
 readonly total:number;
 readonly entries:readonly OriginalCatalogEntry[];
}
export type OriginalMaterial=Readonly<{
 unit:A1Unit;
 reading:B1Reading|null;
 evidence:ReturnType<typeof u22OriginalEvidence>;
 listening:ReturnType<typeof listeningQuestionsForU22>;
 oral:ReturnType<typeof originalOralResponseU22>;
 writingChoices:ReturnType<typeof u22ProductionChoices>;
}>;

const u13Bands=new Map(ORIGINAL_TRANSFER_SCENARIOS.map(s=>[s.unit.id,s.level] as const));
/** Topic-grounded optional original grammar lessons, not authored prerequisites. */
const U13_GRAMMAR_REFRESHERS:Readonly<Record<string,readonly string[]>>=Object.freeze({
 'transfer-01':['a1-13','a1-06'],
 'transfer-02':['a1-12','a1-06'],
 'transfer-03':['a1-13'],
 'transfer-04':['a1-12','a2-01'],
 'transfer-05':['a2-15','b1-03'],
 'transfer-06':['b1-04'],
 'transfer-07':['a2-06','b1-08'],
 'transfer-08':['a2-20','a1-12'],
 'transfer-09':['b1-07'],
 'transfer-10':['b1-02']
});
function levelOf(id:string):OriginalLevel {
 if(id.startsWith('a1-'))return 'A1';
 if(id.startsWith('a2-'))return 'A2';
 if(id.startsWith('b1-'))return 'B1';
 const n=Number(id.slice('transfer-'.length));
 // U13 is a cumulative B1 reader/production task even with A1/A2 grammar.
 return n<=15?'B1':n<=90?'B1+':'Early B2';
}
function normalize(value:string):string {
 return value.normalize('NFD').replace(/[\u0300-\u036f]/g,'')
  .replace(/[’‘]/g,"'").toLocaleLowerCase('fr').trim().replace(/\s+/g,' ');
}
const lessons=new Map<string,A1Unit>();
const byQualifiedId=new Map<string,string>();
const readings=new Map<string,B1Reading>();
const searchText=new Map<string,string>();
const entries:OriginalCatalogEntry[]=[];
const materialCache=new Map<string,OriginalMaterial>();

for(const unit of ORIGINAL_FRENCH_U22_COURSE){
 const p=unit.source;
 if(p.source!=='original'||p.rights!=='original-owned'||
    p.sourceRevision!==SOURCES.original.revision||p.kind!=='session'||
    p.qualifiedId!==sourceId('original','session',p.localId))
  throw Error('U23 cannot index unqualified original teaching material: '+unit.id);
 if(lessons.has(unit.id)||byQualifiedId.has(p.qualifiedId))
  throw Error('U23 duplicate lesson identity or source custody: '+unit.id);
 lessons.set(unit.id,unit);byQualifiedId.set(p.qualifiedId,unit.id);
}
for(const reading of ORIGINAL_U22_CONNECTED_READINGS){
 if(!lessons.has(reading.unitId)||readings.has(reading.unitId))
  throw Error('U23 orphan or duplicate original connected reading: '+reading.unitId);
 readings.set(reading.unitId,reading);
}
for(const unit of ORIGINAL_FRENCH_U22_COURSE){
 const reading=readings.get(unit.id);
 const evidence=u22OriginalEvidence(unit.id);
 const entry:OriginalCatalogEntry=Object.freeze({
  id:unit.id,order:unit.order,title:unit.title,goal:unit.goal,
  level:levelOf(unit.id),qualifiedId:unit.source.qualifiedId,
  sourceRevision:unit.source.sourceRevision,prerequisites:unit.prerequisites,
  ...(u13Bands.has(unit.id)?{foundationBand:u13Bands.get(unit.id)}:{}),
  ...(U13_GRAMMAR_REFRESHERS[unit.id]?{grammarRefreshers:Object.freeze(
    U13_GRAMMAR_REFRESHERS[unit.id].filter(id=>lessons.has(id))
  )}:{}),
  reading:!!reading,listening:unit.dialogue.length>0,writing:!!unit.writing?.prompt,
  sourceComparison:!!evidence?.sources.length
 });
 entries.push(entry);
 searchText.set(unit.id,normalize([
  unit.id,unit.title,unit.goal,entry.level,entry.foundationBand??'',reading?.title??'',
  ...unit.grammar.map(item=>item.heading),
  ...unit.vocabulary.flatMap(item=>[item.french,item.english])
 ].join(' ')));
}
export const ORIGINAL_REGISTRY_ENTRIES:readonly OriginalCatalogEntry[]=Object.freeze(entries);
export const ORIGINAL_REGISTRY_COUNTS=Object.freeze({
 lessons:lessons.size,connectedReadings:readings.size
});
const entryById=new Map(entries.map(row=>[row.id,row] as const));
export function getOriginalCatalogEntry(id:string):OriginalCatalogEntry|null {
 return entryById.get(id)??null;
}
export function getOriginalUnit(id:string):A1Unit|null {return lessons.get(id)??null;}
export function getOriginalReading(id:string):B1Reading|null {return readings.get(id)??null;}
export function getOriginalByQualifiedId(qualifiedId:string):A1Unit|null {
 const id=byQualifiedId.get(qualifiedId);return id?getOriginalUnit(id):null;
}
export function getOriginalMaterial(id:string):OriginalMaterial|null {
 const unit=lessons.get(id);if(!unit)return null;
 const cached=materialCache.get(id);if(cached)return cached;
 const material=Object.freeze({
  unit,reading:readings.get(id)??null,evidence:u22OriginalEvidence(id),
  listening:listeningQuestionsForU22(unit),
  oral:originalOralResponseU22(id),
  writingChoices:u22ProductionChoices(id)
 });
 materialCache.set(id,material);return material;
}
export function browseOriginalMaterials(filters:OriginalBrowseFilters={}):OriginalBrowseResult {
 const query=normalize(filters.query??''),level=filters.level??'all',material=filters.material??'all';
 const tokens=query.split(' ').filter(Boolean);
 const matching=ORIGINAL_REGISTRY_ENTRIES.filter(entry=>{
  if(level!=='all'&&entry.level!==level)return false;
  if(material!=='all'&&!entry[
   material==='source-comparison'?'sourceComparison':material
  ])return false;
  const text=searchText.get(entry.id)??'';
  return tokens.every(token=>text.includes(token));
 });
 const offset=Math.max(0,Math.min(matching.length,Math.trunc(filters.offset??0)));
 const limit=Math.max(1,Math.min(500,Math.trunc(filters.limit??40)));
 return {total:matching.length,entries:matching.slice(offset,offset+limit)};
}
export function neighboringOriginalLessons(id:string):Readonly<{previous:OriginalCatalogEntry|null;next:OriginalCatalogEntry|null}>{
 const position=ORIGINAL_REGISTRY_ENTRIES.findIndex(row=>row.id===id);
 return {previous:position>0?ORIGINAL_REGISTRY_ENTRIES[position-1]:null,
 next:position>=0?ORIGINAL_REGISTRY_ENTRIES[position+1]??null:null};
}

/** Short-lived route intent only; not browser storage, a checkpoint or learner evidence. */
export interface OriginalHandoff {readonly id:string;readonly stage?:OriginalStage;}
const pending=new Map<OriginalSurface,OriginalHandoff>();
export function handoffOriginalLesson(surface:OriginalSurface,id:string,stage?:OriginalStage):boolean {
 const entry=entryById.get(id);
 if(!entry)return false;
 if(surface==='read'&&!entry.reading)return false;
 if((surface==='listen'||surface==='speak')&&!entry.listening)return false;
 if(surface==='write'&&!entry.writing)return false;
 pending.set(surface,{id,stage});return true;
}
export function takeOriginalHandoff(surface:OriginalSurface):OriginalHandoff|null {
 const item=pending.get(surface)??null;pending.delete(surface);
 return item&&lessons.has(item.id)?item:null;
}
