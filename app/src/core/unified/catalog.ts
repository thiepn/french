import {provenance,type QualifiedProvenance} from './source.ts';

export interface CourseSession {
  readonly position:number;
  readonly source:QualifiedProvenance;
  readonly label:string;
  readonly targetLevel:'A1–A2';
  readonly availability:'source-reference-only';
}
export const COURSE_SESSIONS:readonly CourseSession[] = Object.freeze(Array.from({length:60},(_,index)=>{
  const position=index+1;
  return Object.freeze({
    position,
    source:provenance('carnet','session','position-'+String(position).padStart(3,'0')),
    label:'Session '+position,
    targetLevel:'A1–A2' as const,
    availability:'source-reference-only' as const
  });
}));
export function findCourseSession(position:number):CourseSession|null {
  return Number.isInteger(position)&&position>=1&&position<=60?COURSE_SESSIONS[position-1]:null;
}

export interface GrammarGuide {
  readonly id:string;
  readonly source:QualifiedProvenance;
  readonly title:string;
  readonly level:'A1'|'A2';
  readonly explanation:string;
  readonly example:string;
  readonly translation:string;
  readonly prompt:string;
  readonly answer:string;
  readonly alternatives:readonly string[];
}
// Independently authored U1 samples. Not copied from the unresolved-rights 72-concept coursebook.
const originals=[
 ['articles','Articles définis','A1','Use le with masculine singular nouns, la with feminine singular nouns, and les with plural nouns.','Le livre est ici.','The book is here.','Complete: ___ livre est ici.','le',['Le']],
 ['indefinite','Articles indéfinis','A1','Use un for masculine singular nouns, une for feminine singular nouns, and des for plural nouns.','Une amie arrive.','A friend is arriving.','Complete: ___ amie arrive.','une',['Une']],
 ['etre','Être au présent','A1','The present forms of être are suis, es, est, sommes, êtes and sont.','Nous sommes prêts.','We are ready.','Complete: Nous ___ prêts.','sommes',[]],
 ['avoir','Avoir au présent','A1','The present forms of avoir are ai, as, a, avons, avez and ont.','Elle a un vélo.','She has a bicycle.','Complete: Elle ___ un vélo.','a',[]],
 ['negation','La négation','A1','Place ne before the conjugated verb and pas after it. Use n’ before a vowel.','Je ne parle pas vite.','I do not speak quickly.','Complete: Je ne parle ___ vite.','pas',[]],
 ['questions','Questions avec est-ce que','A1','Put est-ce que before a statement to form a yes/no question; use est-ce qu’ before a vowel.','Est-ce que tu viens demain ?','Are you coming tomorrow?','Complete: ___ tu viens demain ?','est-ce que',['est ce que']],
 ['futur-proche','Le futur proche','A1','Use the present of aller followed by an infinitive for a near-future event.','Je vais lire ce soir.','I am going to read tonight.','Complete: Je ___ lire ce soir.','vais',[]],
 ['passe-compose','Le passé composé','A2','Many verbs form this past tense using the present of avoir and a past participle.','Nous avons parlé hier.','We spoke yesterday.','Complete: Nous ___ parlé hier.','avons',[]],
 ['imparfait','Introduction à l’imparfait','A2','For many regular verbs, form the imperfect from the present nous stem without -ons plus the imperfect endings.','Je jouais dehors.','I used to play outside.','Complete: Je jou___ dehors.','ais',[]]
] as const;
export const ORIGINAL_GRAMMAR:readonly GrammarGuide[]=Object.freeze(originals.map(entry=>Object.freeze({
  id:entry[0],source:provenance('original','grammar',entry[0]),
  title:entry[1],level:entry[2],explanation:entry[3],
  example:entry[4],translation:entry[5],prompt:entry[6],answer:entry[7],alternatives:entry[8]
})));
export const CARNET_GRAMMAR_COUNT=72;
