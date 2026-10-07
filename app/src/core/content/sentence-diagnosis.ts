import type { SentenceExercise } from './loader';
import { levenshtein } from '../learner/grader';

export type SentenceDiagnosisCode='exact'|'accepted'|'orthography'|'contraction'|'preposition'|'order'|'incomplete'|'target'|'manual'|'blank';
export interface SentenceDiagnosis{
  code:SentenceDiagnosisCode;
  label:string;
  detail:string;
  quality:'exact'|'close'|'review'|'none';
  score:number;
  correct:boolean|null;
  expected:string;
}
const META:Record<SentenceDiagnosisCode,{label:string;detail:string}>={
  exact:{label:'Exact reference sentence',detail:'Your sentence matches the verified reference wording.'},
  accepted:{label:'Accepted sentence family',detail:'Your answer matches another explicitly accepted sentence in this exercise.'},
  orthography:{label:'Orthography / small form issue',detail:'Spelling, accents, apostrophes, or a small form need attention.'},
  contraction:{label:'Article contraction',detail:'Check contractions such as du, des, au, or aux.'},
  preposition:{label:'Construction / preposition',detail:'The lexical target is present, but its connector or preposition differs.'},
  order:{label:'Word order',detail:'The expected sentence elements are present but arranged differently.'},
  incomplete:{label:'Missing element',detail:'The target construction is present, but the controlled sentence is incomplete.'},
  target:{label:'Target construction missing',detail:'The requested lexical construction was not detected.'},
  manual:{label:'Needs your judgment',detail:'The requested construction is present, but French may allow another valid sentence.'},
  blank:{label:'No answer',detail:'Produce a complete French sentence before checking it.'}
};
function canon(value:string):string{return String(value||'').toLocaleLowerCase('fr').normalize('NFC').replace(/[’]/g,"'").replace(/\s+/g,' ').replace(/\s+([,.;!?])/g,'$1').trim();}
function fold(value:string):string{return canon(value).normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,' ').trim().replace(/\s+/g,' ');}
function tokens(value:string):string[]{return fold(value).split(/\s+/).filter(Boolean);}
function requiredPresent(answer:string,exercise:SentenceExercise):boolean{
  const value=fold(answer);return (exercise.required??[]).every(part=>value.includes(fold(part)));
}
function anchorPresent(answer:string,exercise:SentenceExercise):boolean{
  const value=fold(answer);
  for(const raw of exercise.required??[]){
    const part=fold(raw);if(part&&value.includes(part))return true;
    const root=part.split(' ')[0]??'';if(root.length>=3&&value.includes(root.slice(0,Math.max(3,root.length-2))))return true;
  }
  const frameRoot=fold(exercise.frame).split(' ')[0]??'';
  return frameRoot.length>=3&&value.includes(frameRoot.slice(0,Math.max(3,frameRoot.length-2)));
}
function wrongContraction(answer:string,expected:string):boolean{
  const typed=' '+fold(answer)+' ',target=' '+fold(expected)+' ';
  return (target.includes(' du ')&&typed.includes(' de le '))||(target.includes(' des ')&&typed.includes(' de les '))||(target.includes(' au ')&&typed.includes(' a le '))||(target.includes(' aux ')&&typed.includes(' a les '));
}
function wrongConnector(answer:string,exercise:SentenceExercise):boolean{
  if(!exercise.connector)return false;
  const typed=' '+fold(answer)+' ',connector=fold(exercise.connector);
  if(connector==='de'&&(typed.includes(' du ')||typed.includes(' des ')||typed.includes(' d ')))return false;
  if(connector==='a'&&(typed.includes(' au ')||typed.includes(' aux ')))return false;
  if(typed.includes(' '+connector+' '))return false;
  return anchorPresent(answer,exercise);
}
function result(code:SentenceDiagnosisCode,quality:SentenceDiagnosis['quality'],score:number,correct:boolean|null,exercise:SentenceExercise):SentenceDiagnosis{
  return{...META[code],code,quality,score,correct,expected:exercise.expected};
}
export function diagnoseSentence(answer:string,exercise:SentenceExercise):SentenceDiagnosis{
  const typed=String(answer||'').trim();
  if(!typed)return result('blank','review',0,false,exercise);
  const candidates=[exercise.expected,...(exercise.alternatives??[])].filter(Boolean);
  const canonical=canon(typed),folded=fold(typed);
  for(let index=0;index<candidates.length;index++)if(canonical===canon(candidates[index]))return result(index===0?'exact':'accepted','exact',1,true,exercise);
  const foldedCandidates=candidates.map(fold);
  if(foldedCandidates.includes(folded))return result('orthography','close',.97,true,exercise);
  if(wrongContraction(typed,exercise.expected))return result('contraction','review',.7,false,exercise);
  const expectedTokens=tokens(exercise.expected),typedTokens=tokens(typed),typedSet=new Set(typedTokens);
  const overlap=expectedTokens.length?expectedTokens.filter(token=>typedSet.has(token)).length/expectedTokens.length:0;
  if(wrongConnector(typed,exercise))return result('preposition','review',Math.max(.45,overlap),false,exercise);
  if(expectedTokens.length===typedTokens.length&&[...expectedTokens].sort().join('|')===[...typedTokens].sort().join('|'))return result('order','review',.82,false,exercise);
  const similarity=Math.max(...foldedCandidates.map(candidate=>1-levenshtein(folded,candidate)/Math.max(folded.length,candidate.length,1)));
  if(similarity>=.88)return result('orthography','close',similarity,true,exercise);
  if(!requiredPresent(typed,exercise)){
    if(overlap>=.48&&typedTokens.length<expectedTokens.length)return result('incomplete','review',overlap,false,exercise);
    return result('target','review',Math.max(0,overlap),false,exercise);
  }
  return result('manual','none',Math.max(.55,overlap),null,exercise);
}
