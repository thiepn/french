import {ORIGINAL_GRAMMAR,type GrammarGuide} from './catalog.ts';
import {getU2Lesson,U2_ORIGINAL_LESSONS} from './u2-curriculum.ts';
export interface EnrichedGrammar {
  readonly guide:GrammarGuide;
  readonly detail:string;
  readonly contrast:readonly {readonly wrong:string;readonly corrected:string;readonly why:string}[];
  readonly examples:readonly {readonly fr:string;readonly en:string}[];
  readonly linkedLessonIds:readonly string[];
  readonly challenge:readonly {readonly prompt:string;readonly answer:string;readonly hint:string}[];
}
const EXTRA:Readonly<Record<string,{
  detail:string;
  contrast:readonly [string,string,string][];
  examples:readonly [string,string][];
  challenge:readonly [string,string,string][];
}>>={
 articles:{
  detail:'Noun gender and number determine the definite article. An elided l’ appears before a vowel or mute h in the singular. The plural remains les.',
  contrast:[['le maison','la maison','Maison is a feminine noun.'],['la ami','l’ami','Use l’ before the vowel.']],
  examples:[['La porte est ouverte.','The door is open.'],['Les livres sont sur la table.','The books are on the table.']],
  challenge:[['___ école est ouverte.','L’','The vowel requires elision.'],['___ garçons sont là.','Les','Plural definite article.']]
 },
 indefinite:{
  detail:'Introduce one unspecified item with un or une. With plural count nouns use des. Unlike the definite article, these refer to non-specific entities.',
  contrast:[['un idée','une idée','Idée is feminine.'],['une livre','un livre','Livre, meaning book, is masculine.']],
  examples:[['J’ai une question.','I have a question.'],['Il achète des pommes.','He buys apples.']],
  challenge:[['___ orange est sur la table.','Une','Orange is feminine.'],['Elle a ___ frères.','des','Plural indefinite article.']]
 },
 etre:{
  detail:'Être describes identity, condition, location and many characteristics. Its present-tense forms are irregular; memorize subject–verb pairs.',
  contrast:[['Nous êtes ici.','Nous sommes ici.','Nous requires sommes.'],['Ils est prêts.','Ils sont prêts.','Ils requires sont.']],
  examples:[['Je suis étudiant.','I am a student.'],['Vous êtes en avance.','You are early.']],
  challenge:[['Tu ___ à Paris.','es','Second-person singular.'],['Elles ___ françaises.','sont','Third-person plural.']]
 },
 avoir:{
  detail:'Avoir expresses possession, age and many common feelings, such as avoir faim. It is also an auxiliary in compound tenses.',
  contrast:[['J’ai vingt ans est?','J’ai vingt ans.','Use avoir to state age.'],['Nous a un livre.','Nous avons un livre.','Nous requires avons.']],
  examples:[['J’ai faim.','I am hungry.'],['Ils ont deux chiens.','They have two dogs.']],
  challenge:[['Vous ___ une question.','avez','Second-person plural or formal.'],['J’___ froid.','ai','Avoir with a feeling.']]
 },
 negation:{
  detail:'In standard writing, ne (n’ before a vowel) precedes the finite verb, while pas follows it. In compound tenses ne ... pas surrounds the auxiliary.',
  contrast:[['Je pas comprends.','Je ne comprends pas.','The finite verb belongs between ne and pas.'],['Il ne a pas faim.','Il n’a pas faim.','Elide ne before a vowel.']],
  examples:[['Elle ne travaille pas lundi.','She does not work Monday.'],['Nous n’avons pas fini.','We have not finished.']],
  challenge:[['Je n’___ pas le temps.','ai','Conjugate avoir in first person.'],['Nous ne partons ___ ce soir.','pas','Close the negative after the verb.']]
 },
 questions:{
  detail:'A straightforward yes/no question can start with est-ce que followed by normal subject–verb order. Before a vowel or mute h, use est-ce qu’.',
  contrast:[['Est-ce que il vient ?','Est-ce qu’il vient ?','Elide before il.'],['Est-ce que tu vas où ?','Où est-ce que tu vas ?','Place the question word first.']],
  examples:[['Est-ce que vous parlez français ?','Do you speak French?'],['Où est-ce que nous allons ?','Where are we going?']],
  challenge:[['___ vous avez un billet ?','Est-ce que','Before vous, use est-ce que.'],['Est-ce ___ elle arrive ?','qu’','Elide before elle.']]
 },
 'futur-proche':{
  detail:'For an intention or event in the near future, use aller in the present plus an unchanged infinitive. The infinitive is never conjugated.',
  contrast:[['Je vais mange.','Je vais manger.','After vais, use the infinitive.'],['Ils va partir.','Ils vont partir.','Ils requires vont.']],
  examples:[['Tu vas étudier ce soir.','You are going to study tonight.'],['Nous allons visiter Lyon.','We are going to visit Lyon.']],
  challenge:[['Elle ___ arriver demain.','va','Elle requires va.'],['Vous allez ___ demain.','partir','Use the infinitive.']]
 },
 'passe-compose':{
  detail:'A common past construction uses a present-tense auxiliary plus a past participle. This introduction focuses on verbs taking avoir; être-verbs require a separate pattern.',
  contrast:[['Je suis mangé.','J’ai mangé.','Manger takes avoir in this meaning.'],['Nous avons parler.','Nous avons parlé.','Use a past participle, not the infinitive.']],
  examples:[['Ils ont acheté du pain.','They bought some bread.'],['J’ai terminé mon devoir.','I finished my assignment.']],
  challenge:[['Tu ___ travaillé hier.','as','Avoir for tu: as.'],['Nous avons ___ un café.','bu','The past participle of boire is bu.']]
 },
 imparfait:{
  detail:'The imparfait commonly expresses past habits, descriptions and ongoing situations. For regular verbs, start from the present nous stem without -ons. Être uses ét- instead.',
  contrast:[['Je étais content.','J’étais content.','Elide je before a vowel.'],['Nous parlait souvent.','Nous parlions souvent.','Nous uses -ions.']],
  examples:[['Il faisait froid.','It was cold.'],['Nous lisions chaque soir.','We used to read every evening.']],
  challenge:[['Elle parl___ français.','ait','Third-person singular ending: -ait.'],['Nous étions jeunes, vous ___ plus âgés.','étiez','Vous form of être in imparfait.']]
 }
};
export function enrichGrammar(id:string):EnrichedGrammar|null{
 const guide=ORIGINAL_GRAMMAR.find(g=>g.id===id);
 const extra=EXTRA[id];
 if(!guide||!extra)return null;
 return {
  guide,detail:extra.detail,
  contrast:extra.contrast.map(([wrong,corrected,why])=>({wrong,corrected,why})),
  examples:extra.examples.map(([fr,en])=>({fr,en})),
  challenge:extra.challenge.map(([prompt,answer,hint])=>({prompt,answer,hint})),
  linkedLessonIds:U2_ORIGINAL_LESSONS.filter(l=>l.grammarIds.includes(id)).map(l=>l.id)
 };
}
export function grammarForLesson(id:string):EnrichedGrammar[]{
 const lesson=getU2Lesson(id);
 return lesson?lesson.grammarIds.flatMap(g=>{const guide=enrichGrammar(g);return guide?[guide]:[];}):[];
}
export function checkPracticeAnswer(input:string,expected:string):boolean{
 const standard=(s:string)=>s.normalize('NFC').trim().replace(/\s+/g,' ').replace(/[’]/g,"'").toLocaleLowerCase('fr');
 return !!standard(input)&&standard(input)===standard(expected);
}
