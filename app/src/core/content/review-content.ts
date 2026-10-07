import type { CanonicalSrsRecordV1 } from '../learner/model';
import { readCanonicalUserContent } from '../learner/repository';
import { loadVocabularyWord,type VocabularyWord } from './loader';

function object(value:unknown):Record<string,unknown>{
  return value&&typeof value==='object'&&!Array.isArray(value)?value as Record<string,unknown>:{};
}
function text(value:unknown):string{return typeof value==='string'?value:'';}

export interface ReviewWord {
  id:string;
  word:string;
  meaning:string;
  ipa:string;
  pos:string;
  level:string;
  article:string;
  gender:string;
  plural:string;
  aliases:string[];
  exampleFr:string;
  exampleEn:string;
  source:'corpus'|'user'|'edited';
}

let userContentPromise:ReturnType<typeof readCanonicalUserContent>|null=null;
async function userContent(){userContentPromise??=readCanonicalUserContent();return userContentPromise;}

function fromUserCard(id:string,raw:Record<string,unknown>):ReviewWord|null{
  const word=text(raw.fr||raw.word).trim();
  const meaning=text(raw.en||raw.meaning).trim();
  if(!word||!meaning)return null;
  return{
    id,word,meaning,
    ipa:text(raw.ipa),pos:text(raw.pos),level:text(raw.level),
    article:text(raw.article),gender:text(raw.gender),plural:text(raw.plural),
    aliases:Array.isArray(raw.aliases)?raw.aliases.filter(item=>typeof item==='string') as string[]:[],
    exampleFr:text(raw.exampleFr||raw.example),
    exampleEn:text(raw.exampleEn||raw.exampleTranslation),
    source:'user'
  };
}

function applyEdit(base:ReviewWord,raw:Record<string,unknown>):ReviewWord{
  return{
    ...base,
    word:text(raw.fr).trim()||base.word,
    meaning:text(raw.en).trim()||base.meaning,
    ipa:text(raw.ipa)||base.ipa,
    pos:text(raw.pos)||base.pos,
    level:text(raw.level)||base.level,
    article:text(raw.article)||base.article,
    gender:text(raw.gender)||base.gender,
    plural:text(raw.plural)||base.plural,
    aliases:Array.isArray(raw.aliases)?raw.aliases.filter(item=>typeof item==='string') as string[]:base.aliases,
    exampleFr:text(raw.exampleFr)||base.exampleFr,
    exampleEn:text(raw.exampleEn)||base.exampleEn,
    source:'edited'
  };
}

function fromCorpus(word:VocabularyWord):ReviewWord{
  const example=word.sentences?.find(item=>item?.text)||word.sentences?.[0];
  return{
    id:String(word.id),word:word.word,meaning:word.meaning,ipa:word.ipa??'',pos:word.pos??'',level:word.level??'',
    article:word.article??'',gender:word.gender??'',plural:word.plural??'',aliases:word.aliases??[],
    exampleFr:example?.text??'',exampleEn:example?.translation??'',source:'corpus'
  };
}

export async function resolveReviewWord(record:CanonicalSrsRecordV1,signal?:AbortSignal):Promise<ReviewWord|null>{
  const content=await userContent();
  const userCards=object(content?.userCards);
  const edits=object(content?.cardEdits);
  const user=fromUserCard(record.noteId,object(userCards[record.noteId]));
  if(user)return user;

  const corpus=await loadVocabularyWord(record.noteId,signal);
  if(!corpus)return null;
  const base=fromCorpus(corpus);
  const edit=object(edits[record.noteId]);
  return Object.keys(edit).length?applyEdit(base,edit):base;
}
