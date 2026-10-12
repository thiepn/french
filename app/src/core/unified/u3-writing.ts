import {ORIGINAL_PATH_LESSONS} from './u3-pathways.ts';
export interface WritingScaffold{
 readonly lessonId:string;
 readonly starters:readonly string[];
 readonly keyExpressions:readonly string[];
 readonly checkpoints:readonly string[];
 readonly model:string;
}
const models:Readonly<Record<string,readonly [string,string,string]>>={
 greetings:['Je m’appelle Camille.','Je suis étudiant.','Use je m’appelle and je suis with correct forms.'],
 cafe:['Bonjour, je voudrais un thé, s’il vous plaît.','Merci beaucoup.','Use a polite request and a closing thanks.'],
 home:['La cuisine est petite.','Les chambres sont grandes.','Pay attention to definite articles and agreement.'],
 schedule:['Je suis libre demain à neuf heures.','On peut se retrouver à la bibliothèque.','Give a day/time and a location.'],
 directions:['Est-ce que la gare est loin ?','Je vais marcher jusqu’à la place.','Use the question marker and a plan.'],
 preferences:['Je n’aime pas les olives.','J’aime les tomates.','Use ne…pas for the dislike.'],
 weekend:['Samedi, je vais visiter le musée.','Je vais partir à midi.','Use present aller plus infinitive.'],
 travel:['Un billet pour Lyon, s’il vous plaît.','C’est combien ?','Specify the trip and ask for price.'],
 yesterday:['Hier, j’ai étudié le français.','Puis, j’ai regardé un film.','Use a past participle with avoir for completed actions.'],
 memory:['Quand j’étais enfant, je jouais dehors.','Je lisais tous les soirs.','Use the imparfait for repeated past events.'],
 appointment:['Je ne peux pas venir mardi.','Est-ce que mercredi est possible ?','Offer a polite alternative.'],
 'weekend-recap':['Samedi, j’ai visité ma sœur.','Lundi, je vais travailler.','Distinguish completed actions from future plans.'],
 market:['Je voudrais trois pommes, s’il vous plaît.','Combien ça coûte ?','Use a quantity and a price question.'],
 library:['Est-ce que ce livre est disponible ?','Je vais le chercher.','Ask a question and express a future intention.'],
 weather:['Il pleut aujourd’hui.','Nous n’allons pas marcher au parc.','Negate the planned action.'],
 hotel:['Bonsoir, j’ai une réservation.','Est-ce que la chambre est prête ?','Use avoir and a polite question.'],
 health:['J’ai mal à la tête depuis hier.','Je n’ai pas de fièvre.','Use a symptom expression and negation.'],
 'late-train':['Le train a eu du retard.','Je vais prendre le prochain train.','Contrast completed events and new plans.'],
 'childhood-town':['Avant, je prenais le bus.','Maintenant, je vais à vélo.','Contrast an old habit with the present.'],
 invitation:['Je ne peux pas venir vendredi.','Est-ce qu’on peut se voir samedi ?','Decline politely and propose a date.']
};
export const WRITING_SCAFFOLDS:readonly WritingScaffold[]=Object.freeze(ORIGINAL_PATH_LESSONS.map(lesson=>{
 const [line1,line2,checkpoint]=models[lesson.id]??[];
 if(!line1||!line2||!checkpoint)throw Error('Missing original writing scaffold for '+lesson.id);
 return Object.freeze({lessonId:lesson.id,starters:Object.freeze([line1.split(' ').slice(0,2).join(' '),line2.split(' ').slice(0,2).join(' ')]),
  keyExpressions:Object.freeze(lesson.vocabulary.map(v=>v.fr)),
  checkpoints:Object.freeze([checkpoint,'Read your sentences aloud and check verb endings and articles.']),
  model:line1+' '+line2
 });
}));
export function writingScaffold(id:string):WritingScaffold|null{return WRITING_SCAFFOLDS.find(s=>s.lessonId===id)??null;}
/** A private, local mechanical self-check: never claim linguistic correctness or grade mastery. */
export function inspectDraftStructure(raw:string):readonly string[]{
 const trimmed=raw.trim();
 if(!trimmed)return ['Write one French sentence before checking structure.'];
 const parts=trimmed.split(/[.!?]+/u).map(x=>x.trim()).filter(Boolean);
 const notes:string[]=[];
 if(parts.length<2)notes.push('Aim for two complete sentences if the task asks for two.');
 if(trimmed.length<25)notes.push('Add a useful detail such as time, place or reason.');
 if(!/[.!?]$/u.test(trimmed))notes.push('Consider ending your sentence with punctuation.');
 if(parts.some(p=>p.split(/\s+/u).filter(Boolean).length<3))notes.push('Some sentences are very short; check whether a subject and verb are present.');
 if(!notes.length)notes.push('Basic sentence structure looks complete. Meaning, grammar and correctness still require your own review.');
 return notes;
}
