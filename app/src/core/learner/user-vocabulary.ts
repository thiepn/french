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
