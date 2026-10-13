import {
 ORIGINAL_REGISTRY_ENTRIES,getOriginalCatalogEntry,neighboringOriginalLessons,
 type OriginalCatalogEntry,type OriginalLevel,type OriginalStage
} from './u23-registry.ts';

/**
 * Read-only navigation over U23's actual original course inventory.
 * No inferred mastery, alternate progress, pacing obligation or CEFR award.
 */
export interface OriginalPathway {
 readonly level:OriginalLevel;
 readonly title:string;
 readonly description:string;
 readonly firstId:string;
 readonly count:number;
 readonly readingCount:number;
 readonly sourceComparisonCount:number;
 readonly sections:readonly OriginalPathSection[];
}
export interface OriginalPathSection {
 readonly id:string;
 readonly title:string;
 readonly description:string;
 readonly entries:readonly OriginalCatalogEntry[];
 readonly firstId:string;
 readonly lastId:string;
}
export interface OriginalNextAction {
 readonly key:string;
 readonly title:string;
 readonly detail:string;
 readonly id:string;
 readonly stage:OriginalStage;
 readonly destination:'course'|'read'|'listen'|'write';
}
const PATH_DESCRIPTIONS:Readonly<Record<OriginalLevel,readonly [string,string]>>={
 A1:['A1 · Foundations','Sentence basics, high-frequency vocabulary and everyday exchanges.'],
 A2:['A2 · Independence','Narratives, practical decisions and connected everyday communication.'],
 B1:['B1 · Connected expression','Reading, explaining evidence and producing longer responses.'],
 'B1+':['B1+ · Independent transfer','Apply familiar French in new contexts, arguments and documents.'],
 'Early B2':['Early B2 · Critical communication','Extended narratives, comparing sources and conditional decisions.']
};
export const ORIGINAL_LEVEL_ORDER:readonly OriginalLevel[]=['A1','A2','B1','B1+','Early B2'];

function sectionsFor(level:OriginalLevel,entries:readonly OriginalCatalogEntry[]):readonly OriginalPathSection[]{
 const size=level==='A1'?12:15;
 const output:OriginalPathSection[]=[];
 for(let offset=0;offset<entries.length;offset+=size){
  const rows=entries.slice(offset,offset+size);
  const first=rows[0],last=rows[rows.length-1];
  if(!first||!last)continue;
  const n=output.length+1;
  output.push(Object.freeze({
   id:level.toLowerCase().replace(/[^a-z0-9]+/g,'-')+'-'+n,
   title:level+' · Part '+n+' ('+first.id+'–'+last.id+')',
   description:first.goal,
   entries:Object.freeze(rows),firstId:first.id,lastId:last.id
  }));
 }
 return Object.freeze(output);
}
export const ORIGINAL_PATHWAYS:readonly OriginalPathway[]=Object.freeze(ORIGINAL_LEVEL_ORDER.map(level=>{
 const entries=ORIGINAL_REGISTRY_ENTRIES.filter(item=>item.level===level);
 const [title,description]=PATH_DESCRIPTIONS[level];
 return Object.freeze({
  level,title,description,firstId:entries[0]?.id??'',
  count:entries.length,readingCount:entries.filter(x=>x.reading).length,
  sourceComparisonCount:entries.filter(x=>x.sourceComparison).length,
  sections:sectionsFor(level,entries)
 });
}));
const sectionByLesson=new Map<string,OriginalPathSection>();
for(const pathway of ORIGINAL_PATHWAYS)for(const section of pathway.sections)
 for(const entry of section.entries)sectionByLesson.set(entry.id,section);
export function originalPathSectionFor(id:string):OriginalPathSection|null {
 return sectionByLesson.get(id)??null;
}
export function pathwayForOriginalLesson(id:string):OriginalPathway|null{
 const item=getOriginalCatalogEntry(id);
 return ORIGINAL_PATHWAYS.find(path=>path.level===item?.level)??null;
}
/** Suggestions describe available material, never validated proficiency or a due queue. */
export function originalNextActions(id:string):readonly OriginalNextAction[]{
 const entry=getOriginalCatalogEntry(id);if(!entry)return [];
 const actions:OriginalNextAction[]=[{
  key:'understand',title:'Understand the lesson',detail:'Review original rules and worked corrections.',
  id:entry.id,stage:'understand',destination:'course'
 },{
  key:'practice',title:'Try recall questions',detail:'Answer original course tasks; results remain temporary.',
  id:entry.id,stage:'practice',destination:'course'
 }];
 if(entry.reading)actions.push({
  key:'read',title:'Read the connected text',detail:'Use the original passage and source-grounded questions.',
  id:entry.id,stage:'dialogue',destination:'read'
 });
 if(entry.listening)actions.push({
  key:'listen',title:'Listen to the dialogue',detail:'Device text-to-speech if available; no pronunciation grade.',
  id:entry.id,stage:'listen',destination:'listen'
 });
 if(entry.writing)actions.push({
  key:'write',title:'Write independently',detail:'Compare your own draft against an authored model; no auto-grade.',
  id:entry.id,stage:'write',destination:'write'
 });
 const next=neighboringOriginalLessons(id).next;
 if(next)actions.push({
  key:'next',title:'Preview the next lesson',detail:next.title,
  id:next.id,stage:'understand',destination:'course'
 });
 return Object.freeze(actions);
}
