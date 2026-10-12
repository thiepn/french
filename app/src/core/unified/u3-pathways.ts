import {provenance,distributionAllowed} from './source.ts';
import {U2_ORIGINAL_LESSONS,type U2Lesson,type U2Exercise} from './u2-curriculum.ts';

type Spec=readonly [
 string,'A1'|'A2',string,string,string,
 readonly [string,string][],readonly [string,string][],readonly string[],
 readonly [string,string,string],
 readonly [string,string,string,string],readonly [string,string,string,string],
 string
];
// New, independently authored French examples. NOT imported Carnet/French 2.2 content.
const SPECS:readonly Spec[]=[
 ['market','A1','At the market','Ask for a quantity and its price','Two customers buy fruit',
  [['Je voudrais trois pommes, s’il vous plaît.','I would like three apples, please.'],['Voici les pommes. Vous voulez autre chose ?','Here are the apples. Would you like anything else?'],['Non merci, combien ça coûte ?','No thanks, how much does it cost?']],
  [['pommes','apples'],['combien','how much'],['autre chose','anything else']],['indefinite','questions'],
  ['Je voudrais ___ pommes.','trois','The requested amount is three apples.'],
  ['Which asks for the price?','Combien ça coûte ?','Combien ça coûte ?|Où est la gare ?|Je suis fatigué.','Choose the question about price.'],
  'Buy two items at a market, saying how many you want and asking the price.'],
 ['library','A1','At the library','Ask where to find a book and whether it is available','A student asks a librarian',
  [['Bonjour, est-ce que ce livre est disponible ?','Hello, is this book available?'],['Oui, il est sur la deuxième étagère.','Yes, it is on the second shelf.'],['Merci, je vais le chercher.','Thank you, I am going to look for it.']],
  [['livre','book'],['étagère','shelf'],['disponible','available']],['questions','futur-proche'],
  ['Est-ce ___ ce livre est disponible ?','que','Use est-ce que before a statement.'],
  ['Which expression is near future?','je vais le chercher','il est disponible|je vais le chercher|sur l’étagère','Aller plus infinitive signals near future.'],
  'Ask a librarian whether a book is available, then say what you are going to do.'],
 ['weather','A1','A rainy afternoon','Make and revise a simple plan','Two neighbors discuss the weather',
  [['Il pleut aujourd’hui.','It is raining today.'],['Alors, nous n’allons pas marcher au parc.','Then we are not going to walk in the park.'],['On va rester à la maison.','We are going to stay at home.']],
  [['pleuvoir','to rain'],['rester','to stay'],['aujourd’hui','today']],['negation','futur-proche'],
  ['Nous n’allons ___ sortir.','pas','Place pas after the finite verb.'],
  ['Which phrase means “stay home”?','rester à la maison','sortir au parc|rester à la maison|aller en ville','The expression rester à la maison means stay home.'],
  'Explain that it is raining and describe one plan you are not going to do.'],
 ['hotel','A1','Checking into a hotel','Ask for a reservation politely','A traveler arrives at reception',
  [['Bonsoir, j’ai une réservation.','Good evening, I have a reservation.'],['À quel nom, s’il vous plaît ?','Under which name, please?'],['Au nom de Martin. Est-ce que la chambre est prête ?','Under the name Martin. Is the room ready?']],
  [['réservation','reservation'],['chambre','room'],['prête','ready']],['avoir','questions'],
  ['J’___ une réservation.','ai','J’ai expresses possession of a reservation.'],
  ['Which asks if a room is ready?','Est-ce que la chambre est prête ?','Le salon est grand.|Est-ce que la chambre est prête ?|J’ai faim.','Select the readiness question.'],
  'Say you have a reservation and ask if the room is ready.'],
 ['health','A2','At the clinic','Describe a condition and schedule a visit','Someone speaks with a receptionist',
  [['Bonjour, je ne me sens pas bien depuis hier.','Hello, I have not felt well since yesterday.'],['Est-ce que vous avez de la fièvre ?','Do you have a fever?'],['Non, mais j’ai mal à la tête.','No, but I have a headache.']],
  [['fièvre','fever'],['tête','head'],['depuis','since']],['avoir','negation'],
  ['Je n’___ pas de fièvre.','ai','Use n’ai pas for negative avoir.'],
  ['Which expression means “I have a headache”?','J’ai mal à la tête','J’ai une question|J’ai mal à la tête|J’ai vingt ans','Use avoir mal à plus body part.'],
  'Describe a symptom and say whether you have a fever.'],
 ['late-train','A2','A delayed train','Explain a past problem and new plan','Travelers discuss a delayed departure',
  [['Le train a eu du retard ce matin.','The train was late this morning.'],['Tu as attendu longtemps ?','Did you wait long?'],['Oui, mais je vais prendre le prochain train.','Yes, but I am going to take the next train.']],
  [['retard','delay'],['attendre','to wait'],['prochain','next']],['passe-compose','futur-proche'],
  ['Tu ___ attendu longtemps ?','as','Use tu as plus the past participle.'],
  ['Which refers to a future plan?','je vais prendre','le train a eu|j’ai attendu|je vais prendre','Near future uses present aller plus infinitive.'],
  'Explain why a train was late, then give your next travel plan.'],
 ['childhood-town','A2','A town then and now','Contrast a repeated old habit with a new situation','Friends describe changes in a town',
  [['Avant, je prenais le bus tous les jours.','Before, I used to take the bus every day.'],['Et maintenant, tu fais comment ?','And how do you travel now?'],['Maintenant, je vais au travail à vélo.','Now, I cycle to work.']],
  [['avant','before'],['maintenant','now'],['vélo','bicycle']],['imparfait','futur-proche'],
  ['Avant, je pren___ le bus.','ais','The je imperfect ending is -ais.'],
  ['Which expression refers to a past habit?','je prenais','je vais prendre|je prenais|je prendrai','Imparfait can describe habitual past.'],
  'Contrast something you used to do every day with what you do now.'],
 ['invitation','A2','An invitation and apology','Decline politely and propose another date','Two friends arrange a meeting',
  [['Tu veux venir dîner vendredi ?','Would you like to come for dinner Friday?'],['Désolé, je ne peux pas vendredi.','Sorry, I cannot on Friday.'],['Est-ce qu’on peut se voir samedi ?','Can we meet on Saturday?']],
  [['dîner','dinner'],['vendredi','Friday'],['samedi','Saturday']],['negation','questions'],
  ['Je ne peux ___ venir vendredi.','pas','Ne ... pas surrounds the conjugated verb.'],
  ['Which offers another day?','Est-ce qu’on peut se voir samedi ?','Je suis fatigué.|Est-ce qu’on peut se voir samedi ?|Il pleut.','Select the alternate-day proposal.'],
  'Politely decline an invitation and suggest another day.']
];
export const U3_ORIGINAL_LESSONS:readonly U2Lesson[]=Object.freeze(SPECS.map(([id,level,title,goal,situation,lines,words,grammar,fill,choice,productionPrompt])=>{
 const exercises:U2Exercise[]=[
  {id:id+'-fill',type:'fill',prompt:fill[0],answer:fill[1],options:[],explanation:fill[2]},
  {id:id+'-choice',type:'choice',prompt:choice[0],answer:choice[1],options:choice[2].split('|'),explanation:choice[3]}
 ];
 return Object.freeze({id,source:provenance('original','session','u3-'+id),level,title,goal,situation,
  dialogue:Object.freeze(lines.map(([fr,en])=>Object.freeze({fr,en}))),
  vocabulary:Object.freeze(words.map(([fr,en])=>Object.freeze({fr,en}))),
  grammarIds:Object.freeze([...grammar]),exercises:Object.freeze(exercises.map(x=>Object.freeze(x))),
  productionPrompt,estimatedMinutes:10});
}));
export const ORIGINAL_PATH_LESSONS:readonly U2Lesson[]=Object.freeze([...U2_ORIGINAL_LESSONS,...U3_ORIGINAL_LESSONS]);

export interface LessonPathNode {
 readonly lessonId:string;readonly prerequisiteIds:readonly string[];
 readonly theme:'everyday'|'travel'|'storytelling';readonly grammarIds:readonly string[];
}
const DEPENDENCIES:Readonly<Record<string,readonly string[]>>={
 greetings:[],cafe:['greetings'],home:['greetings'],schedule:['greetings'],
 directions:['schedule'],preferences:['cafe'],weekend:['schedule'],
 travel:['directions'],yesterday:['weekend'],memory:['yesterday'],
 appointment:['schedule'], 'weekend-recap':['yesterday'],
 market:['cafe'],library:['directions'],weather:['weekend'],
 hotel:['travel'],health:['appointment'], 'late-train':['travel','yesterday'],
 'childhood-town':['memory'], invitation:['appointment','preferences']
};
const TRAVEL=new Set(['directions','travel','market','library','hotel','late-train']);
const STORY=new Set(['yesterday','memory','weekend-recap','childhood-town']);
export const LESSON_PATH:readonly LessonPathNode[]=Object.freeze(ORIGINAL_PATH_LESSONS.map(lesson=>Object.freeze({
 lessonId:lesson.id,prerequisiteIds:Object.freeze([...(DEPENDENCIES[lesson.id]??[])]),
 theme:TRAVEL.has(lesson.id)?'travel' as const:STORY.has(lesson.id)?'storytelling' as const:'everyday' as const,
 grammarIds:Object.freeze([...lesson.grammarIds])
})));
export function validateLessonPath():readonly string[]{
 const errors:string[]=[];
 const ids=new Set(ORIGINAL_PATH_LESSONS.map(l=>l.id));
 const byId=new Map(LESSON_PATH.map(n=>[n.lessonId,n]));
 for(const n of LESSON_PATH){
  if(!ids.has(n.lessonId))errors.push('Unknown lesson '+n.lessonId);
  for(const dep of n.prerequisiteIds)if(!ids.has(dep))errors.push('Missing prerequisite '+dep);
 }
 const seen=new Set<string>(),active=new Set<string>();
 const visit=(id:string)=>{
  if(active.has(id)){errors.push('Prerequisite cycle at '+id);return;}
  if(seen.has(id))return;
  active.add(id);for(const d of byId.get(id)?.prerequisiteIds??[])visit(d);
  active.delete(id);seen.add(id);
 };
 for(const node of LESSON_PATH)visit(node.lessonId);
 if(byId.size!==ORIGINAL_PATH_LESSONS.length)errors.push('Duplicate lesson path ID');
 return errors;
}
export function getLessonPath(id:string):LessonPathNode|null{return LESSON_PATH.find(n=>n.lessonId===id)??null;}
export function missingPrerequisites(id:string,practiced:ReadonlySet<string>):readonly string[]{
 return (getLessonPath(id)?.prerequisiteIds??[]).filter(dep=>!practiced.has(dep));
}
export function suggestedLesson(practiced:ReadonlySet<string>,theme:'all'|'everyday'|'travel'|'storytelling'='all'):U2Lesson|null{
 return ORIGINAL_PATH_LESSONS.find(lesson=>(theme==='all'||getLessonPath(lesson.id)?.theme===theme)
  &&!practiced.has(lesson.id)&&missingPrerequisites(lesson.id,practiced).length===0)??null;
}
export async function loadUnifiedOriginalPath():Promise<readonly U2Lesson[]>{
 if(validateLessonPath().length||!distributionAllowed('original')||ORIGINAL_PATH_LESSONS.some(l=>l.source.source!=='original'||l.source.rights!=='original-owned'))
  throw Error('U3 source or dependency qualification failed');
 return ORIGINAL_PATH_LESSONS;
}
