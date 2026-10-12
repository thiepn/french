import {ORIGINAL_PATH_LESSONS} from './u3-pathways.ts';
import {checkPracticeAnswer} from './u2-grammar.ts';
import {writingScaffold,inspectDraftStructure} from './u3-writing.ts';

export type Misconception='missing-answer'|'accent-or-apostrophe'|'negation'|'word-order'|'conjugation'|'article'|'different-word';
export interface Feedback{
 readonly kind:Misconception;
 readonly cue:string;
 readonly correct:boolean;
 readonly grammarId:string|null;
}
function plain(raw:string):string{
 return raw.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[’]/g,"'").trim().toLocaleLowerCase('fr').replace(/\s+/g,' ');
}
function tokens(raw:string):string[]{
 return plain(raw).split(/\s+/).filter(Boolean);
}
function sameMultiset(a:string[],b:string[]):boolean{
 return a.length===b.length&&a.slice().sort().join('|')===b.slice().sort().join('|');
}
export function analyzeAttempt(actual:string,expected:string,grammarId:string|null=null):Feedback{
 if(checkPracticeAnswer(actual,expected))return {kind:'different-word',correct:true,cue:'Correct. This answer is ungraded.',grammarId};
 if(!actual.trim())return{kind:'missing-answer',correct:false,cue:'Enter a French response before checking.',grammarId};
 if(plain(actual)===plain(expected))return{kind:'accent-or-apostrophe',correct:false,
  cue:'The words match without diacritics. Check the written accents and apostrophes carefully.',grammarId};
 const a=tokens(actual),e=tokens(expected);
 if(sameMultiset(a,e))return{kind:'word-order',correct:false,
  cue:'The expected words are present; check their order in the sentence.',grammarId};
 if(grammarId==='negation'||e.includes('pas')||e.includes('ne'))return{kind:'negation',correct:false,
  cue:'Look for the correct placement of ne (or n’) and pas around the finite verb.',grammarId};
 if(grammarId==='articles'||grammarId==='indefinite'||['un','une','le','la','les','des'].includes(plain(expected)))
  return{kind:'article',correct:false,cue:'Check whether the noun is masculine, feminine or plural.',grammarId};
 if(grammarId==='etre'||grammarId==='avoir'||grammarId==='passe-compose'||grammarId==='imparfait'||grammarId==='futur-proche')
  return{kind:'conjugation',correct:false,cue:'Check subject, tense and whether an infinitive or participle is required.',grammarId};
 return{kind:'different-word',correct:false,cue:'Re-read the dialogue and locate the word or expression used in context.',grammarId};
}
export interface MicroRepair{
 readonly id:string;readonly grammarId:string;readonly prompt:string;readonly answer:string;readonly explanation:string;
}
/** Distinct original transfer examples. All checks are local, not progress evidence. */
const REPAIRS:readonly MicroRepair[]=[
 {id:'definite',grammarId:'articles',prompt:'___ école ouvre demain.',answer:'L’',explanation:'Elide singular le/la before a vowel.'},
 {id:'indefinite',grammarId:'indefinite',prompt:'Je voudrais ___ orange.',answer:'une',explanation:'Orange is feminine.'},
 {id:'being',grammarId:'etre',prompt:'Vous ___ en retard.',answer:'êtes',explanation:'Être with vous is êtes.'},
 {id:'having',grammarId:'avoir',prompt:'Nous ___ une réservation.',answer:'avons',explanation:'Avoir with nous is avons.'},
 {id:'negative',grammarId:'negation',prompt:'Je ne parle ___ anglais.',answer:'pas',explanation:'The negative closes with pas.'},
 {id:'question',grammarId:'questions',prompt:'Est-ce ___ tu viens ?',answer:'que',explanation:'Use est-ce que before tu.'},
 {id:'future',grammarId:'futur-proche',prompt:'Ils ___ partir demain.',answer:'vont',explanation:'Aller with ils is vont.'},
 {id:'past',grammarId:'passe-compose',prompt:'Elle ___ visité Paris.',answer:'a',explanation:'Passé composé with elle: a + participle.'},
 {id:'imperfect',grammarId:'imparfait',prompt:'Avant, nous jou___ dehors.',answer:'ions',explanation:'Imparfait with nous ends in -ions.'}
];
export function repairForGrammar(grammarId:string|null):MicroRepair|null{
 return REPAIRS.find(item=>item.grammarId===grammarId)??null;
}
export interface WritingReview{
 readonly source:'local-heuristic';
 readonly graded:false;
 readonly notes:readonly string[];
 readonly promptChecks:readonly string[];
}
/** Guardrails: keyword checks are prompts to reflect, not claims of grammatical correctness. */
export function reviewProduction(lessonId:string,raw:string):WritingReview{
 const lesson=ORIGINAL_PATH_LESSONS.find(l=>l.id===lessonId);
 const notes=[...inspectDraftStructure(raw)];
 const promptChecks:string[]=[];
 if(!lesson)return{source:'local-heuristic',graded:false,notes:['Unknown original lesson.'],promptChecks:[]};
 const text=plain(raw);
 const grammar=lesson.grammarIds;
 if(text.length>4000)return{source:'local-heuristic',graded:false,
  notes:['Response exceeds the 4,000-character practice limit; shorten it before reviewing.'],promptChecks:[]};
 if(grammar.includes('negation'))promptChecks.push(
  /\b(n'|ne )[^.!?]{1,80}\bpas\b/u.test(text)?
  'Negation pattern spotted. Check its placement and meaning yourself.':
  'If you need a negative, try ne … pas around the finite verb.');
 if(grammar.includes('futur-proche'))promptChecks.push(
  /\b(vais|vas|va|allons|allez|vont)\s+\w+/u.test(text)?
  'An aller construction appears. Check that the following verb is an infinitive.':
  'For a near-future plan, consider present aller followed by an infinitive.');
 if(grammar.includes('passe-compose'))promptChecks.push(
  /\b(ai|as|a|avons|avez|ont)\s+\w+/u.test(text)?
  'An avoir construction appears. Check its past participle.':
  'For a completed past action, consider avoir + a past participle where appropriate.');
 if(grammar.includes('questions'))promptChecks.push(
  /est.ce qu/u.test(text)?'A question marker appears; check elision and syntax.':
  'If asking a yes/no question, consider est-ce que.');
 const scaffold=writingScaffold(lessonId);
 if(scaffold)promptChecks.push('Compare your response to the lesson goal: '+lesson.goal);
 return {source:'local-heuristic',graded:false,notes,promptChecks};
}
