/** P37I-D5/P21. P35-compatible exposure metadata, never a retrieval grade. */
export const OPEN_WORLD_MAX_CHARS=20_000;
export const OPEN_WORLD_MAX_FILE_BYTES=262_144;
export const OPEN_WORLD_MIN_WORDS=20;
export const OPEN_WORLD_MAX_SESSIONS=120;
export type OpenWorldSource='paste'|'file';
export interface OpenWorldExposure{
  id:string;t:number;words:number;known:number;learning:number;newMapped:number;unmapped:number;
  knownPct:number;mappedPct:number;effectivePct:number;lookups:number;sourceKind:OpenWorldSource;
}
export interface OpenWorldHistory{schema:1;sessions:OpenWorldExposure[]}
function record(value:unknown):Record<string,unknown>{
  return value!==null&&typeof value==='object'&&!Array.isArray(value)?value as Record<string,unknown>:{};
}
function integer(value:unknown,min:number,max:number):number{
  const n=Number(value);
  return Number.isFinite(n)?Math.max(min,Math.min(max,Math.floor(n))):min;
}
export function sanitizeOpenWorldText(value:string):string{
  return value.replace(/\u0000/g,'').slice(0,OPEN_WORLD_MAX_CHARS);
}
export function openWorldTokens(value:string):string[]{
  return sanitizeOpenWorldText(value).match(/\p{L}+(?:['’]\p{L}+)?/gu)??[];
}
export function normalizeOpenWorldHistory(raw:unknown):OpenWorldHistory{
  const sessions:OpenWorldExposure[]=[];
  for(const item of (Array.isArray(record(raw).sessions)?record(raw).sessions as unknown[]:[]).slice(-OPEN_WORLD_MAX_SESSIONS)){
    const x=record(item),words=integer(x.words,0,100_000);
    if(!words)continue;
    sessions.push({
      id:String(x.id??'').slice(0,140),t:integer(x.t,0,Number.MAX_SAFE_INTEGER),
      words,known:integer(x.known,0,words),learning:integer(x.learning,0,words),
      newMapped:integer(x.newMapped,0,words),unmapped:integer(x.unmapped,0,words),
      knownPct:integer(x.knownPct,0,100),mappedPct:integer(x.mappedPct,0,100),
      effectivePct:integer(x.effectivePct,0,100),lookups:integer(x.lookups,0,10_000),
      sourceKind:x.sourceKind==='file'?'file':'paste'
    });
  }
  return {schema:1,sessions};
}
export function analyzeOpenWorld(text:string, resolve:(word:string)=>'known'|'learning'|'new'|undefined){
  const tokens=openWorldTokens(text);
  let known=0,learning=0,newMapped=0,unmapped=0;
  for(const word of tokens){
    const result=resolve(word);
    if(result==='known')known++;
    else if(result==='learning')learning++;
    else if(result==='new')newMapped++;
    else unmapped++;
  }
  const total=Math.max(1,tokens.length),mapped=known+learning+newMapped;
  return {words:tokens.length,known,learning,newMapped,unmapped,
    knownPct:Math.round(100*known/total),mappedPct:Math.round(100*mapped/total),
    effectivePct:Math.round(100*(known+.55*learning+.18*newMapped)/total)};
}
export function appendOpenWorldExposure(raw:unknown,analysis:ReturnType<typeof analyzeOpenWorld>,
  sourceKind:OpenWorldSource,lookups:number,now:number,id:string):OpenWorldHistory{
  if(analysis.words<OPEN_WORLD_MIN_WORDS)throw new Error('At least 20 French words are needed.');
  const history=normalizeOpenWorldHistory(raw);
  const row:OpenWorldExposure={
    id:id.slice(0,140),t:now,...analysis,lookups:integer(lookups,0,10_000),sourceKind
  };
  return {schema:1,sessions:[...history.sessions,row].slice(-OPEN_WORLD_MAX_SESSIONS)};
}
