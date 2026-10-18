/** Exact P35 5.24.0 starter mapping, derived from pinned index.html
 * migrateStarterCustomDecks: normalizeWord = trim().toLocaleLowerCase('fr').
 * Read-only: IDs in the owner store, SRS, and earlier exports stay unchanged.
 * Never guess when one spelling maps to multiple canonical source IDs.
 */
export interface SourceWordIdentity {id:string;word:string}
export type P35StarterLink={
 storedId:string;resolvedId:string|null;status:'canonical'|'unique-starter'|'ambiguous'|'missing';
};
export function resolveP35StarterLinks(
 savedIds:readonly string[],sourceRows:readonly SourceWordIdentity[]
):P35StarterLink[]{
 const known=new Set<string>(),byWord=new Map<string,Set<string>>();
 for(const row of sourceRows){
  if(typeof row.id!=='string'||!row.id||typeof row.word!=='string')continue;
  known.add(row.id);
  const key=row.word.trim().toLocaleLowerCase('fr');
  if(!key)continue;
  if(!byWord.has(key))byWord.set(key,new Set());
  byWord.get(key)!.add(row.id);
 }
 return savedIds.map(storedId=>{
  if(known.has(storedId))return{storedId,resolvedId:storedId,status:'canonical' as const};
  if(!storedId.startsWith('starter:'))
    return{storedId,resolvedId:null,status:'missing' as const};
  const key=storedId.slice('starter:'.length).trim().toLocaleLowerCase('fr');
  const candidates=byWord.get(key);
  if(!candidates||!candidates.size)return{storedId,resolvedId:null,status:'missing' as const};
  if(candidates.size!==1)return{storedId,resolvedId:null,status:'ambiguous' as const};
  return{storedId,resolvedId:[...candidates][0],status:'unique-starter' as const};
 });
}
export function eligibleSourceDeckIds(
 savedIds:readonly string[],sourceRows:readonly SourceWordIdentity[],
 privateIds:ReadonlySet<string>
):{eligibleIds:string[];aliased:number;unresolved:number;ambiguous:number}{
 const linked=resolveP35StarterLinks(savedIds,sourceRows);
 const eligibleIds=[...new Set(linked.map(link=>privateIds.has(link.storedId)?
  link.storedId:link.resolvedId).filter((id):id is string=>Boolean(id)))];
 return{eligibleIds,aliased:linked.filter(l=>l.status==='unique-starter').length,
  unresolved:linked.filter(l=>l.status==='missing'&&!privateIds.has(l.storedId)).length,
  ambiguous:linked.filter(l=>l.status==='ambiguous').length};
}
