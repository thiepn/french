import type {VocabularySearchRow} from '../content/loader';
import {originalVocabularyForUnit,type OriginalLexeme} from './u28-vocabulary.ts';

/** A read-only source-to-canonical lookup, never a new note or sense namespace. */
export interface U40Link{
  readonly source:OriginalLexeme;
  readonly status:'matched'|'ambiguous'|'unmatched';
  readonly native:VocabularySearchRow|null;
  readonly explanation:string;
}
export interface U40LessonLinks{
  readonly lessonId:string;
  readonly links:readonly U40Link[];
  readonly matched:number;
  readonly ambiguous:number;
  readonly unmatched:number;
}
function normalize(text:string):string{
  return text.normalize('NFKC').replace(/[‘’‛]/g,"'").trim()
    .replace(/\s+/g,' ').toLocaleLowerCase('fr');
}
function forms(row:VocabularySearchRow):string[]{
  const word=normalize(row.word),article=normalize(row.article||'');
  const result=[word];
  if(article&&!word.startsWith(article+' ')&&!word.startsWith(article+"'"))
    result.push(normalize(article+(article.endsWith("'")?'':' ')+row.word));
  return result;
}
function glossMatches(source:string,native:string):boolean{
  const want=normalize(source),actual=normalize(native);
  if(!want||!actual)return false;
  if(want===actual)return true;
  // Independent, exact dictionary gloss clauses, never fuzzy semantic guesses.
  const clauses=(text:string)=>text.split(/[;]/).map(normalize).filter(Boolean);
  return clauses(want).some(clause=>clauses(actual).includes(clause));
}
/**
 * Both form and gloss must agree with a UNIQUE published canonical record.
 * Conflicting senses, duplicate IDs, conjugated forms and weak synonyms abstain.
 */
export function crosswalkOriginalVocabulary(
  lessonId:string,rows:readonly VocabularySearchRow[]
):U40LessonLinks{
  const index=new Map<string,VocabularySearchRow[]>();
  for(const row of rows){
    if(!row.id||!row.word||!row.meaning)continue;
    for(const form of new Set(forms(row))){
      const bucket=index.get(form)||[];
      bucket.push(row);index.set(form,bucket);
    }
  }
  const links=originalVocabularyForUnit(lessonId).map(source=>{
    const candidates=index.get(normalize(source.french))||[];
    const matched=[...new Map(candidates.filter(candidate=>
      glossMatches(source.english,candidate.meaning)
    ).map(candidate=>[candidate.id,candidate])).values()];
    if(matched.length===1)return Object.freeze({
      source,status:'matched' as const,native:matched[0],
      explanation:'Exact French form and an exact authored English gloss clause match one canonical corpus record.'
    });
    return Object.freeze({
      source,status:matched.length>1?'ambiguous' as const:'unmatched' as const,
      native:null,
      explanation:matched.length>1
        ?'More than one canonical record shares this form and gloss. No sense has been selected.'
        :candidates.length
          ?'Canonical spelling exists, but its gloss differs. No sense has been assumed.'
          :'No exact form in the canonical index. Inflections and synonyms are not guessed.'
    });
  });
  return Object.freeze({
    lessonId,links:Object.freeze(links),
    matched:links.filter(item=>item.status==='matched').length,
    ambiguous:links.filter(item=>item.status==='ambiguous').length,
    unmatched:links.filter(item=>item.status==='unmatched').length
  });
}
export async function resolveU40LessonLinks(lessonId:string,signal?:AbortSignal):Promise<U40LessonLinks>{
  const {loadVocabularySearchIndex}=await import('../content/loader');
  const index=await loadVocabularySearchIndex(signal);
  return crosswalkOriginalVocabulary(lessonId,index.rows);
}

/** Transient one-use navigation only. No localStorage, SRS or cross-tab persistence. */
let wordHandoff:string|null=null;
export function handoffU40CanonicalWord(id:string):void{wordHandoff=id||null;}
export function takeU40CanonicalWord():string|null{
  const id=wordHandoff;wordHandoff=null;return id;
}
