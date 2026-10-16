/** Private deck labels and membership only; historic customDecks are never reinterpreted. */
export interface NativePrivateDeck {
  schema:'thiepn-french-private-deck-v1';
  id:string;title:string;noteIds:string[];createdAt:number;updatedAt:number;
}
function object(value:unknown):Record<string,unknown>{
 return value!==null&&typeof value==='object'&&!Array.isArray(value)?value as Record<string,unknown>:{};
}
export function privateDeckTitle(title:string):string{
 if(typeof title!=='string')throw Error('INVALID_DECK_TITLE');
 const clean=title.normalize('NFC').trim().replace(/\s+/g,' ');
 if(!clean||clean.length>64||/[\u0000-\u001f\u007f]/.test(clean))throw Error('INVALID_DECK_TITLE');
 return clean;
}
export function listNativePrivateDecks(value:unknown):NativePrivateDeck[]{
 const rows=object(object(value).customDecks),out:NativePrivateDeck[]=[];
 for(const [id,v] of Object.entries(rows)){
  const row=object(v);
  // Never assume P35 arbitrary deck arrays/maps follow U49's owned schema.
  if(!id.startsWith('deck:vnext:')||row.schema!=='thiepn-french-private-deck-v1'||row.id!==id)continue;
  try{
   const title=privateDeckTitle(row.title as string);
   const noteIds=[...new Set((Array.isArray(row.noteIds)?row.noteIds:[])
    .filter((s):s is string=>typeof s==='string'&&s.length>0&&s.length<=180))].slice(0,2000);
   out.push({schema:'thiepn-french-private-deck-v1',id,title,noteIds,
    createdAt:Number.isFinite(row.createdAt)?Math.max(0,Number(row.createdAt)):0,
    updatedAt:Number.isFinite(row.updatedAt)?Math.max(0,Number(row.updatedAt)):0});
  }catch{/* Preserve malformed legacy data, but never promote it to a writable native deck. */}
 }
 return out.sort((a,b)=>a.title.localeCompare(b.title,'fr')||a.id.localeCompare(b.id));
}
export function updateDeckMembers(existing:readonly string[],selected:readonly string[],mode:'add'|'remove',limit=2000):string[]{
 const chosen=new Set(selected);
 return mode==='remove'?existing.filter(id=>!chosen.has(id))
  :[...new Set([...existing,...selected])].slice(0,limit);
}

/** P35 5.24.0 index.html: normalizeCustomDecks returns {name,cardIds,createdAt}.
 * Preserve that exact original record/ID; never convert, trim or rewrite an unknown row.
 */
export interface P35PrivateDeckView {
 kind:'p35';id:string;title:string;noteIds:string[];createdAt:number;
}
export type PrivateDeckView=(NativePrivateDeck&{kind?:'native'})|P35PrivateDeckView;
export function listP35PrivateDecks(value:unknown):P35PrivateDeckView[]{
 const rows=object(object(value).customDecks),result:P35PrivateDeckView[]=[];
 const blocked=new Set(['__proto__','prototype','constructor']);
 for(const [id,value] of Object.entries(rows)){
  if(!id||id.length>80||id.startsWith('deck:vnext:')||blocked.has(id))continue;
  const v=object(value);
  if(v.schema!==undefined||typeof v.name!=='string'||!Array.isArray(v.cardIds)||
     !Number.isFinite(v.createdAt)||v.cardIds.length>3000)continue;
  const name=v.name.trim();
  // Reject rather than partially truncate malformed legacy member arrays.
  if(!name||name.length>60||v.cardIds.some(x=>typeof x!=='string'||!x||x.length>180))continue;
  result.push({kind:'p35',id,title:name,noteIds:[...new Set(v.cardIds as string[])],
   createdAt:Number(v.createdAt)});
 }
 return result.sort((a,b)=>a.createdAt-b.createdAt||a.title.localeCompare(b.title,'fr'));
}
export function listAllPrivateDecks(value:unknown):PrivateDeckView[]{
 return [...listP35PrivateDecks(value),...listNativePrivateDecks(value).map(v=>({...v,kind:'native' as const}))]
 .sort((a,b)=>a.title.localeCompare(b.title,'fr')||a.id.localeCompare(b.id));
}
/** A strict P35 record is round-tripped in its original format and identity. */
export function applyP35DeckMutation(
 existing:Record<string,unknown>,mode:'rename'|'add'|'remove',title:string,selected:readonly string[]
):Record<string,unknown>{
 const original=existing.cardIds as string[];
 if(!Array.isArray(original)||original.some(x=>typeof x!=='string'||!x||x.length>180)||
   original.length>3000||typeof existing.name!=='string'||!Number.isFinite(existing.createdAt))
  throw Error('INVALID_P35_DECK');
 if(mode==='rename')return{...existing,name:privateDeckTitle(title).slice(0,60)};
 return{...existing,cardIds:updateDeckMembers(original,selected,mode,3000)};
}
