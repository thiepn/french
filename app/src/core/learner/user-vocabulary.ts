import {openFrenchDatabase} from '../storage/idb';
import {newRecognitionRecord,readCanonicalUserContent} from './repository';
import type {CanonicalUserContentV1} from './model';
import {listUserVocabularyCards,normalizeUserVocabularyInput,type UserVocabularyInput} from './user-vocabulary-model';

function object(value:unknown):Record<string,unknown>{
  return value!==null&&typeof value==='object'&&!Array.isArray(value)?value as Record<string,unknown>:{};
}
function content(value:unknown):CanonicalUserContentV1{
  const raw=object(value);
  return{
    schema:'thiepn-french-user-content-v1',
    userCards:{...object(raw.userCards)},
    cardEdits:{...object(raw.cardEdits)},
    smartDecks:{...object(raw.smartDecks)},
    customDecks:{...object(raw.customDecks)}
  };
}
export async function listUserVocabulary(){
  return listUserVocabularyCards(await readCanonicalUserContent());
}
/** Uses the historical content-v1 owner store and a new native SRS record atomically. */
export async function saveUserVocabularyCard(
  input:UserVocabularyInput,existingId?:string
):Promise<string>{
  const cleaned=normalizeUserVocabularyInput(input);
  const id=existingId??('user:vnext:'+crypto.randomUUID());
  if(existingId!==undefined&&(!id||id.length>180))throw Error('INVALID_USER_CARD_ID');
  const db=await openFrenchDatabase();
  try{
    await new Promise<void>((resolve,reject)=>{
      const tx=db.transaction(['user-content','srs'],'readwrite');
      const current=tx.objectStore('user-content');
      const request=current.get('content-v1');
      request.onsuccess=()=>{
        try{
          const state=content(request.result);
          if(existingId&&!Object.prototype.hasOwnProperty.call(state.userCards,id))
            throw Error('USER_CARD_NOT_FOUND');
          if(!existingId&&Object.keys(state.userCards).length>=2000)
            throw Error('USER_CARD_LIMIT');
          const prior=object(state.userCards[id]);
          state.userCards[id]={...prior,...cleaned};
          current.put(state,'content-v1');
          if(!existingId){
            const row=newRecognitionRecord(id);
            tx.objectStore('srs').put(row,row.id);
          }
        }catch(error){reject(error);tx.abort();}
      };
      request.onerror=()=>reject(request.error??Error('Cannot read private user vocabulary'));
      tx.oncomplete=()=>resolve();
      tx.onerror=()=>reject(tx.error??Error('Cannot save private user vocabulary'));
      tx.onabort=()=>reject(tx.error??Error('Private vocabulary transaction aborted'));
    });
    return id;
  }finally{db.close();}
}

import {listNativePrivateDecks,listAllPrivateDecks,applyP35DeckMutation,privateDeckTitle,updateDeckMembers,type PrivateDeckView,type NativePrivateDeck} from './private-decks';
import {loadVocabularySearchIndex} from '../content/loader';

/** Native vNext decks occupy namespaced keys inside the original user-content store. */
export async function listPrivateDecks():Promise<PrivateDeckView[]>{
 return listAllPrivateDecks(await readCanonicalUserContent());
}
export async function mutatePrivateDeck(
 mode:'create'|'rename'|'delete'|'add'|'remove',
 id?:string,title?:string,selected:readonly string[]=[]
):Promise<string>{
 if((mode==='create'||mode==='rename')&&title===undefined)throw Error('DECK_TITLE_REQUIRED');
 const cleanTitle=mode==='create'||mode==='rename'?privateDeckTitle(title??''):'';
 const cleanIds=[...new Set(selected.filter(v=>typeof v==='string'&&v.length>0&&v.length<=180))].slice(0,2000);
 const newId=mode==='create'?'deck:vnext:'+crypto.randomUUID():id??'';
 if(!newId||newId.length>180||['__proto__','prototype','constructor'].includes(newId))throw Error('INVALID_DECK_ID');
 // Verify original corpus membership from the canonical on-disk vocabulary index.
 // Unresolved P35 IDs may remain in existing lists but may never be invented on add.
 let canonical:ReadonlySet<string>=new Set();
 if(mode==='add'){
  const index=await loadVocabularySearchIndex();
  canonical=new Set(index.rows.map(row=>row.id));
 }
 const db=await openFrenchDatabase();
 try{
  await new Promise<void>((resolve,reject)=>{
   const tx=db.transaction('user-content','readwrite');
   const owner=tx.objectStore('user-content'),request=owner.get('content-v1');
   request.onsuccess=()=>{
    try{
     const state=content(request.result);
     const known=listAllPrivateDecks(state);
     const current=known.find(row=>row.id===newId);
     if(mode!=='create'&&!current)throw Error('DECK_NOT_FOUND');
     if(mode==='create'&&known.length>=100)throw Error('DECK_LIMIT');
     if(mode==='create'&&known.some(row=>row.title.toLocaleLowerCase('fr')===cleanTitle.toLocaleLowerCase('fr')))
      throw Error('DUPLICATE_DECK_TITLE');
     const now=Date.now();
     if(mode==='delete'){
      delete state.customDecks[newId]; // Never removes source cards, SRS or historical answers.
     }else{
      if(mode==='add'&&cleanIds.some(cardId=>
        !Object.prototype.hasOwnProperty.call(state.userCards,cardId)&&!canonical.has(cardId)))
       throw Error('UNKNOWN_CANONICAL_DECK_CARD');
      if(current?.kind==='p35'){
       if(mode==='create')throw Error('P35_DECK_COLLISION');
       state.customDecks[newId]=applyP35DeckMutation(object(state.customDecks[newId]),
        mode==='rename'?'rename':mode==='add'?'add':'remove',cleanTitle,cleanIds);
      }else{
       const next:NativePrivateDeck=current?{...current,noteIds:[...current.noteIds]}:
        {schema:'thiepn-french-private-deck-v1',id:newId,title:cleanTitle,noteIds:[],createdAt:now,updatedAt:now};
       if(mode==='rename')next.title=cleanTitle;
       if(mode==='add'||mode==='remove')next.noteIds=updateDeckMembers(next.noteIds,cleanIds,mode);
       next.updatedAt=now;
       state.customDecks[newId]=next;
      }
     }
     owner.put(state,'content-v1');
    }catch(error){reject(error);tx.abort();}
   };
   request.onerror=()=>reject(request.error??Error('Could not read owner deck state'));
   tx.oncomplete=()=>resolve();
   tx.onerror=()=>reject(tx.error??Error('Could not update private deck'));
   tx.onabort=()=>reject(tx.error??Error('Private deck update aborted'));
  });
  return newId;
 }finally{db.close();}
}

/** Multi-card metadata edit in the existing private owner store. No SRS/grade/event writes. */
export async function bulkSetUserVocabularyTheme(noteIds:readonly string[],theme:string):Promise<number>{
 const cleaned=theme.normalize('NFC').trim().replace(/\s+/g,' ');
 if(cleaned.length>80||/[\u0000-\u001f\u007f]/.test(cleaned))throw Error('INVALID_THEME');
 const ids=[...new Set(noteIds)];
 if(!ids.length||ids.length>120||ids.some(id=>!id||id.length>180))throw Error('INVALID_BULK_SELECTION');
 const db=await openFrenchDatabase();
 try{
  await new Promise<void>((resolve,reject)=>{
   const tx=db.transaction('user-content','readwrite');
   const owner=tx.objectStore('user-content'),request=owner.get('content-v1');
   request.onsuccess=()=>{
    try{
     const state=content(request.result);
     if(ids.some(id=>!Object.prototype.hasOwnProperty.call(state.userCards,id)))throw Error('BULK_NON_USER_CARD');
     for(const id of ids){
      const row=object(state.userCards[id]);
      state.userCards[id]={...row,theme:cleaned};
     }
     owner.put(state,'content-v1');
    }catch(error){reject(error);tx.abort();}
   };
   request.onerror=()=>reject(request.error??Error('Cannot read card content'));
   tx.oncomplete=()=>resolve();
   tx.onerror=()=>reject(tx.error??Error('Bulk edit failed'));
   tx.onabort=()=>reject(tx.error??Error('Bulk edit aborted'));
  });
  return ids.length;
 }finally{db.close();}
}
