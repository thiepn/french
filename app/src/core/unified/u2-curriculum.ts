import {provenance,distributionAllowed,type QualifiedProvenance} from './source.ts';

export interface U2Exercise {
  readonly id:string;
  readonly type:'fill'|'choice'|'order';
  readonly prompt:string;
  readonly answer:string;
  readonly options:readonly string[];
  readonly explanation:string;
}
export interface U2Lesson {
  readonly id:string;
  readonly source:QualifiedProvenance;
  readonly level:'A1'|'A2';
  readonly title:string;
  readonly goal:string;
  readonly situation:string;
  readonly dialogue:readonly {readonly fr:string;readonly en:string}[];
  readonly vocabulary:readonly {readonly fr:string;readonly en:string}[];
  readonly grammarIds:readonly string[];
  readonly exercises:readonly U2Exercise[];
  readonly productionPrompt:string;
  readonly estimatedMinutes:number;
}
type Spec=readonly [
  string,'A1'|'A2',string,string,string,string,
  readonly [string,string,string],readonly [string,string,string],
  readonly [string,string,string],
  string,
  readonly [string,string,string,string],
  readonly [string,string,string,string]
];
// Entirely original A1/A2 micro-lessons. NOT mappings of Carnet's 60 source positions.
const SPECS:readonly Spec[]=[
  ['greetings','A1','Meeting someone','Introduce yourself and ask a name','Two learners meet before class',
   'etre','Bonjour, je m’appelle Léa.','Salut, moi, c’est Samir.','Enchanté, tu es étudiant ?',
   'hello|bonjour;name|nom;student|étudiant',
   ['fill','Je ___ étudiant.','suis','I am: use je suis.'],
   ['choice','How would you greet a classmate?','Bonjour','Bonjour|Au revoir|Merci']],
  ['cafe','A1','At the café','Order politely and specify one item','A short order at the counter',
   'indefinite','Bonjour, je voudrais un thé.','Un thé avec du citron ?','Oui, merci beaucoup.',
   'tea|thé;please|s’il vous plaît;thank you|merci',
   ['fill','Je voudrais ___ café.','un','Café is masculine: un café.'],
   ['choice','Which expression is polite?','Je voudrais','Je voudrais|Donne-moi|Non']],
  ['home','A1','Describing your home','Identify objects using definite articles','A friend visits a small apartment',
   'articles','Voici le salon.','La cuisine est à droite.','Et les chambres sont là-bas.',
   'room|chambre;kitchen|cuisine;living room|salon',
   ['fill','___ cuisine est petite.','La','Cuisine is feminine: la cuisine.'],
   ['choice','Which article goes with plural chambres?','les','le|la|les']],
  ['schedule','A1','A simple schedule','Discuss when an action happens','Two classmates coordinate a morning',
   'etre','Tu es libre demain matin ?','Oui, je suis libre à neuf heures.','Parfait, on se retrouve devant la bibliothèque.',
   'tomorrow|demain;morning|matin;free|libre',
   ['fill','Tu ___ libre demain ?','es','Use tu es for the second person.'],
   ['choice','What does demain mean?','tomorrow','yesterday|tomorrow|today']],
  ['directions','A1','Finding the station','Ask a simple yes/no question','A traveler asks a passer-by',
   'questions','Excusez-moi, est-ce que la gare est loin ?','Non, elle est près de la place.','Merci, je vais marcher.',
   'station|gare;far|loin;near|près',
   ['fill','___ la gare est loin ?','Est-ce que','Est-ce que introduces a yes/no question.'],
   ['choice','Which word means station?','gare','gare|place|rue']],
  ['preferences','A1','Food preferences','Say what you do not like','Friends decide what to eat',
   'negation','Tu aimes les olives ?','Non, je n’aime pas les olives.','Moi, j’aime les tomates.',
   'olives|olives;tomatoes|tomates;like|aimer',
   ['fill','Je ne mange ___ de viande.','pas','Use ne ... pas for negation.'],
   ['choice','Which means “I do not like”?','Je n’aime pas','J’aime|Je n’aime pas|J’ai']],
  ['weekend','A1','Weekend plans','Express a near-future intention','Friends make a Saturday plan',
   'futur-proche','Qu’est-ce que tu vas faire samedi ?','Je vais visiter le musée.','Super, je vais venir aussi.',
   'Saturday|samedi;museum|musée;visit|visiter',
   ['fill','Nous ___ partir demain.','allons','Near future: nous allons + infinitive.'],
   ['choice','Which is near future?','Je vais partir','Je pars hier|Je vais partir|Je partais']],
  ['travel','A1','Buying a ticket','State a destination and ask about price','A passenger visits the ticket desk',
   'questions','Bonjour, un billet pour Lyon, s’il vous plaît.','Aller simple ou aller-retour ?','Aller simple. C’est combien ?',
   'ticket|billet;one-way|aller simple;return|aller-retour',
   ['fill','Est-ce ___ le train part à midi ?','que','The standard question structure is est-ce que.'],
   ['choice','What is aller-retour?','return trip','one-way|return trip|platform']],
  ['yesterday','A2','What happened yesterday','Relate a completed action','Friends talk about the previous day',
   'passe-compose','Qu’est-ce que tu as fait hier ?','J’ai étudié le français, puis j’ai cuisiné.','Moi, j’ai regardé un film.',
   'yesterday|hier;studied|étudié;film|film',
   ['fill','Nous ___ étudié hier.','avons','Passé composé: nous avons étudié.'],
   ['choice','Which refers to a completed past action?','J’ai parlé','Je parle|J’ai parlé|Je vais parler']],
  ['memory','A2','Childhood memories','Contrast habitual past with now','A friend remembers childhood',
   'imparfait','Quand j’étais enfant, je jouais au parc.','Tu y allais souvent ?','Oui, presque tous les jours.',
   'child|enfant;park|parc;often|souvent',
   ['fill','Quand j’étais petit, je jou___ dehors.','ais','Imparfait ending for je: -ais.'],
   ['choice','Which signals a past habit?','Je jouais','Je joue|Je jouais|Je vais jouer']],
  ['appointment','A2','Changing an appointment','Give a reason politely','A visitor rearranges an appointment',
   'negation','Je suis désolé, je ne peux pas venir mardi.','Vous êtes libre mercredi ?','Oui, mercredi me convient.',
   'Tuesday|mardi;Wednesday|mercredi;available|libre',
   ['fill','Je ne peux ___ venir demain.','pas','The negative wraps around peux.'],
   ['choice','Which day is mercredi?','Wednesday','Tuesday|Wednesday|Friday']],
  ['weekend-recap','A2','A weekend recap','Use recent past with a future plan','Two friends compare weekends',
   'passe-compose','Samedi, j’ai visité ma sœur.','Et dimanche, tu as travaillé ?','Non, je vais travailler lundi.',
   'sister|sœur;Sunday|dimanche;Monday|lundi',
   ['fill','Elle ___ visité son frère.','a','Passé composé: elle a visité.'],
   ['choice','What signals the future in je vais travailler?','vais','je|vais|travailler']]
];
function unpackGlosses(value:string):readonly {fr:string;en:string}[]{
  return Object.freeze(value.split(';').map(pair=>{
    const [en,fr]=pair.split('|');
    if(!en||!fr)throw Error('Malformed U2 original glossary');
    return Object.freeze({fr,en});
  }));
}
const ORIGINAL_DIALOGUE_TRANSLATIONS:readonly (readonly [string,string,string])[]=[
 ['Hello, my name is Léa.','Hi, I’m Samir.','Nice to meet you; are you a student?'],
 ['Hello, I would like a tea.','A tea with lemon?','Yes, thank you very much.'],
 ['Here is the living room.','The kitchen is on the right.','And the bedrooms are over there.'],
 ['Are you free tomorrow morning?','Yes, I am free at nine.','Great, let’s meet in front of the library.'],
 ['Excuse me, is the station far away?','No, it is near the square.','Thanks, I will walk.'],
 ['Do you like olives?','No, I don’t like olives.','I like tomatoes.'],
 ['What are you going to do on Saturday?','I am going to visit the museum.','Great, I am coming too.'],
 ['Hello, a ticket to Lyon, please.','One-way or return?','One-way. How much is it?'],
 ['What did you do yesterday?','I studied French, then cooked.','I watched a film.'],
 ['When I was a child, I played in the park.','Did you go there often?','Yes, almost every day.'],
 ['I’m sorry, I cannot come on Tuesday.','Are you free Wednesday?','Yes, Wednesday works for me.'],
 ['On Saturday I visited my sister.','And did you work on Sunday?','No, I am going to work Monday.']
];
const PRODUCTION_PROMPTS:readonly string[]=[
 'Introduce yourself in two complete French sentences.',
 'Politely order one hot drink, then thank the server.',
 'Describe two rooms using correct articles.',
 'Arrange a time to meet tomorrow.',
 'Ask whether the station is far, using est-ce que.',
 'State a food you do not like and one you like.',
 'Say what you are going to do this Saturday.',
 'Request a one-way ticket and ask about the price.',
 'Write two actions you completed yesterday.',
 'Describe something you often did as a child.',
 'Say which day you cannot come and suggest another.',
 'Describe a past weekend activity and a future plan.'
];

export const U2_ORIGINAL_LESSONS:readonly U2Lesson[]=Object.freeze(SPECS.map((row,index)=>{
  const [id,level,title,goal,situation,grammar,first,second,third,glosses,fill,choice]=row;
  return Object.freeze({
    id,source:provenance('original','session','u2-'+id),level,title,goal,situation,
    dialogue:Object.freeze([first,second,third].map((fr,i)=>{
      // The translations are authored separately below; see ORIGINAL_DIALOGUE_TRANSLATIONS.
      return Object.freeze({fr,en:ORIGINAL_DIALOGUE_TRANSLATIONS[index][i]});
    })),
    vocabulary:unpackGlosses(glosses),grammarIds:Object.freeze([grammar]),
    exercises:Object.freeze([
      Object.freeze({id:id+'-fill',type:'fill' as const,prompt:fill[1],answer:fill[2],
        options:Object.freeze([] as string[]),explanation:fill[3]}),
      Object.freeze({id:id+'-choice',type:'choice' as const,prompt:choice[1],answer:choice[2],
        options:Object.freeze(choice[3].split('|')),explanation:'Choose the expression supported by this lesson.'})
    ]),
    productionPrompt:PRODUCTION_PROMPTS[index],estimatedMinutes:8
  });
}));
export async function loadU2Curriculum():Promise<readonly U2Lesson[]> {
  // This intentionally lazy module only serves independently authored records.
  if(!distributionAllowed('original')||U2_ORIGINAL_LESSONS.some(lesson=>
    lesson.source.source!=='original'||lesson.source.rights!=='original-owned'))
    throw Error('U2 source qualification denied');
  return U2_ORIGINAL_LESSONS;
}
export function getU2Lesson(id:string):U2Lesson|null {
  return U2_ORIGINAL_LESSONS.find(lesson=>lesson.id===id)??null;
}
