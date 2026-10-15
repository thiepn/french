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
export function updateDeckMembers(existing:readonly string[],selected:readonly string[],mode:'add'|'remove'):string[]{
 const chosen=new Set(selected);
 return mode==='remove'?existing.filter(id=>!chosen.has(id))
  :[...new Set([...existing,...selected])].slice(0,2000);
}
