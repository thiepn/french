import type { SkillId } from './model';
import type { ReviewWord } from '../content/review-content';
import type { SchedulerRating,TypedQuality } from './scheduler';

export type GradingMode='strict'|'learning'|'lenient';
export interface TypedGrade {
  label:string;
  quality:TypedQuality;
  issue:string;
  score:number;
  correct:boolean;
}
export interface GradeOptions {
  skill:SkillId;
  direction:'fr-en'|'en-fr'|'audio-fr';
  strictArticles:boolean;
  gradingMode:GradingMode;
}

function apostrophes(value:string):string{return String(value||'').normalize('NFC').replace(/[‘’‛`´]/g,"'");}
function exact(value:string):string{return apostrophes(value).toLocaleLowerCase('fr').trim().replace(/\s+/g,' ');}
function words(value:string):string{return exact(value).replace(/[.,!?;:«»()[\]{}]/g,' ').replace(/\s+/g,' ').trim();}
function accentFold(value:string):string{return words(value).normalize('NFD').replace(/[\u0300-\u036f]/g,'');}
function loose(value:string):string{return accentFold(value).replace(/[-'\s]+/g,' ').trim();}
function splitMeanings(value:string):string[]{return String(value||'').split(/\s*;\s*/).map(item=>item.trim()).filter(Boolean);}

export function levenshtein(a:string,b:string):number{
  const left=[...a],right=[...b];
  const row=Array.from({length:right.length+1},(_,i)=>i);
  for(let i=1;i<=left.length;i++){
    let previous=row[0];row[0]=i;
    for(let j=1;j<=right.length;j++){
      const saved=row[j];
      row[j]=Math.min(row[j]+1,row[j-1]+1,previous+(left[i-1]===right[j-1]?0:1));
      previous=saved;
    }
  }
  return row[right.length];
}

function articlePart(value:string):string{
  const match=exact(value).match(/^(un|une|le|la|les|l'|des|du|de la|de l')\s*/);
  return match?match[0].trim():'';
}
function withoutArticle(value:string):string{
  return exact(value).replace(/^(un|une|le|la|les|l'|des|du|de la|de l')\s*/,'').trim();
}
function articleForms(word:ReviewWord):string[]{
  const articles=word.article.split('/').map(item=>item.trim()).filter(Boolean);
  return articles.map(article=>article.endsWith("'")?article+word.word:article+' '+word.word);
}
function frenchCandidates(word:ReviewWord,skill:SkillId,strictArticles:boolean):{values:string[];articleExpected:boolean}{
  const forms=articleForms(word);
  const articleExpected=skill==='article'||(skill==='production'&&strictArticles&&Boolean(word.article));
  const values=articleExpected?[...forms,word.word,...word.aliases]:[word.word,...word.aliases,...forms];
  return{values:[...new Set(values.filter(Boolean))],articleExpected};
}
function expectedCandidates(word:ReviewWord,options:GradeOptions):{values:string[];articleExpected:boolean}{
  if(options.direction==='fr-en')return{values:splitMeanings(word.meaning),articleExpected:false};
  return frenchCandidates(word,options.skill,options.strictArticles);
}

function rawGrade(answer:string,word:ReviewWord,options:GradeOptions):TypedGrade{
  const entered=String(answer||'').trim();
  if(!entered)return{label:'No answer entered',quality:'review',issue:'empty',score:0,correct:false};

  const expected=expectedCandidates(word,options);
  const candidates=expected.values.length?expected.values:[options.direction==='fr-en'?word.meaning:word.word];
  const enteredExact=exact(entered),exactCandidates=candidates.map(exact);
  if(exactCandidates.includes(enteredExact))return{label:'Exact answer',quality:'exact',issue:'',score:1,correct:true};

  const enteredWords=words(entered),wordCandidates=candidates.map(words);
  if(wordCandidates.includes(enteredWords))return{label:'Punctuation or spacing error',quality:'close',issue:'punctuation',score:.94,correct:false};

  const accent=accentFold(entered),accentCandidates=candidates.map(accentFold);
  if(accentCandidates.includes(accent))return{label:'Accent or diacritic error',quality:'close',issue:'accent',score:.9,correct:false};

  const enteredLoose=loose(entered),looseCandidates=candidates.map(loose);
  if(options.direction!=='fr-en'){
    const baseWord=loose(word.word),enteredBase=loose(withoutArticle(entered));
    if(enteredBase===baseWord){
      const expectedArticle=word.article,actualArticle=articlePart(entered);
      if(!actualArticle&&expected.articleExpected)return{label:'Correct word · add '+expectedArticle,quality:'missing-article',issue:'missing-article',score:.82,correct:false};
      if(actualArticle&&expectedArticle&&!expectedArticle.split('/').some(item=>loose(item)===loose(actualArticle))){
        return{label:'Correct noun · wrong article ('+expectedArticle+')',quality:'missing-article',issue:'wrong-article',score:.78,correct:false};
      }
    }
    if(word.plural&&loose(entered).includes(loose(word.plural))&&looseCandidates.some(value=>value.includes(baseWord))){
      return{label:'Number error: singular/plural',quality:'close',issue:'plural',score:.76,correct:false};
    }
  }

  const best=looseCandidates.reduce((result,item)=>{
    const score=1-levenshtein(enteredLoose,item)/Math.max(enteredLoose.length,item.length,1);
    return score>result?score:result;
  },0);
  const maxLength=Math.max(enteredLoose.length,...looseCandidates.map(value=>value.length),1);
  const threshold=maxLength<=4?.75:.84;
  if(best>=threshold)return{label:'Spelling error',quality:'close',issue:'spelling',score:best,correct:false};
  return{label:'Incorrect lexical answer',quality:'review',issue:'lexical',score:best,correct:false};
}

export function gradeTypedAnswer(answer:string,word:ReviewWord,options:GradeOptions):TypedGrade{
  const result=rawGrade(answer,word,options);
  if(result.quality==='exact')return result;
  if(options.gradingMode==='lenient'&&result.quality==='close')return{...result,correct:true,label:'Accepted in lenient mode · '+result.label};
  if(options.gradingMode==='learning'&&(result.issue==='punctuation'||result.issue==='accent')){
    return{...result,correct:true,label:'Accepted with correction · '+result.label};
  }
  return result;
}

export function suggestedRating(result:TypedGrade,responseMs:number):SchedulerRating{
  if(result.quality==='review'||result.issue==='lexical'||result.issue==='empty')return'again';
  if(result.quality==='exact')return responseMs>30000?'hard':responseMs>0&&responseMs<6500?'easy':'good';
  return'hard';
}
