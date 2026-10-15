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

import {listNativePrivateDecks,privateDeckTitle,updateDeckMembers,type NativePrivateDeck} from './private-decks';

/** Native vNext decks occupy namespaced keys inside the original user-content store. */
export async function listPrivateDecks():Promise<NativePrivateDeck[]>{
 return listNativePrivateDecks(await readCanonicalUserContent());
}
export async function mutatePrivateDeck(
 mode:'create'|'rename'|'delete'|'add'|'remove',
 id?:string,title?:string,selected:readonly string[]=[]
):Promise<string>{
 if((mode==='create'||mode==='rename')&&title===undefined)throw Error('DECK_TITLE_REQUIRED');
 const cleanTitle=title===undefined?'':privateDeckTitle(title);
 const cleanIds=[...new Set(selected.filter(v=>typeof v==='string'&&v.length>0&&v.length<=180))].slice(0,2000);
 const newId=mode==='create'?'deck:vnext:'+crypto.randomUUID():id??'';
 if(!newId.startsWith('deck:vnext:'))throw Error('INVALID_NATIVE_DECK');
 const db=await openFrenchDatabase();
 try{
  await new Promise<void>((resolve,reject)=>{
   const tx=db.transaction('user-content','readwrite');
   const owner=tx.objectStore('user-content'),request=owner.get('content-v1');
   request.onsuccess=()=>{
    try{
     const state=content(request.result);
     const known=listNativePrivateDecks(state.customDecks);
     const current=known.find(row=>row.id===newId);
     if(mode!=='create'&&!current)throw Error('DECK_NOT_FOUND');
     if(mode==='create'&&known.length>=100)throw Error('DECK_LIMIT');
     const now=Date.now();
     if(mode==='delete'){
      delete state.customDecks[newId]; // Never removes source cards, SRS or historical answers.
     }else{
      if((mode==='add'||mode==='remove')&&cleanIds.some(cardId=>!Object.prototype.hasOwnProperty.call(state.userCards,cardId)))
       throw Error('UNOWNED_DECK_CARD');
      const next:NativePrivateDeck=current?{...current,noteIds:[...current.noteIds]}:
       {schema:'thiepn-french-private-deck-v1',id:newId,title:cleanTitle,noteIds:[],createdAt:now,updatedAt:now};
      if(mode==='rename')next.title=cleanTitle;
      if(mode==='add'||mode==='remove')next.noteIds=updateDeckMembers(next.noteIds,cleanIds,mode);
      next.updatedAt=now;
      state.customDecks[newId]=next;
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
