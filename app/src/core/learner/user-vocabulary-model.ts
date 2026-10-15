/** Pure, migration-tolerant user-vocabulary contract. Never changes a canonical source ID. */
export interface UserVocabularyInput {
  fr:string;
  en:string;
  exampleFr?:string;
  exampleEn?:string;
}
export interface UserVocabularyCard extends UserVocabularyInput { id:string; theme?:string; }
function record(value:unknown):Record<string,unknown>{
  return value!==null&&typeof value==='object'&&!Array.isArray(value)?value as Record<string,unknown>:{};
}
function field(value:unknown,max:number):string{
  if(typeof value!=='string')return '';
  const cleaned=value.normalize('NFC').trim().replace(/\s+/g,' ');
  if(cleaned.length>max||/[\u0000-\u001f\u007f]/.test(cleaned))throw Error('INVALID_CARD_TEXT');
  return cleaned;
}
export function normalizeUserVocabularyInput(value:UserVocabularyInput):Required<UserVocabularyInput>{
  const fr=field(value.fr,120),en=field(value.en,200);
  if(!fr||!en)throw Error('FRENCH_AND_MEANING_REQUIRED');
  return{fr,en,exampleFr:field(value.exampleFr??'',400),exampleEn:field(value.exampleEn??'',400)};
}
export function listUserVocabularyCards(value:unknown):UserVocabularyCard[]{
  const cards=record(record(value).userCards);
  const results:UserVocabularyCard[]=[];
  for(const [id,raw] of Object.entries(cards)){
    const row=record(raw);
    if(id.length>180)continue;
    try{
      const fr=field(row.fr??row.word,120),en=field(row.en??row.meaning,200);
      if(!fr||!en)continue;
      results.push({id,fr,en,exampleFr:field(row.exampleFr??row.example??'',400),
        exampleEn:field(row.exampleEn??row.exampleTranslation??'',400),theme:field(row.theme??'',80)});
    }catch{continue;}
  }
  return results.sort((a,b)=>a.fr.localeCompare(b.fr,'fr')||a.id.localeCompare(b.id));
}
