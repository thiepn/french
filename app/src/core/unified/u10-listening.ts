import type {A1Unit} from './u6-a1-model.ts';
import type {A1ListeningQuestion} from './u7-listening.ts';
import {listeningQuestionsForFullFrenchCourse,validateU9Listening} from './u9-listening.ts';
import {ORIGINAL_B1_UNITS} from './u10-course.ts';
type Q=readonly [string,string,readonly string[],string];
/** Two original dialogue-grounded comprehension questions per new B1 full lesson. */
const QUESTIONS:Readonly<Record<string,readonly [Q,Q]>>={
 'b1-01':[
  ['What motivates Eva’s request to change the meeting?','le dernier bus part plus tôt',['la bibliothèque ferme définitivement','le dernier bus part plus tôt','le projet est terminé'],'Eva noticed that the last Friday bus departs earlier than expected.'],
  ['What does Martin want to verify before deciding?','les horaires de fermeture',['les horaires de fermeture','le prix des billets','le nombre de livres'],'Martin will check official closing times instead of assuming they are correct.']
 ],
 'b1-02':[
  ['What meeting format does Nora initially prefer?','en ligne',['en ligne','uniquement en personne','dans un parc'],'Nora favors online meetings because some colleagues live far away.'],
  ['What compromise does Omar suggest?','proposer deux options',['annuler la rencontre','proposer deux options','imposer une salle'],'He suggests presenting two options and asking each colleague’s preference.']
 ],
 'b1-03':[
  ['What discrepancy worries Léa?','deux versions du document',['le dossier a disparu','deux versions du document','le prix a doublé'],'Léa has two versions of a document and does not know which applies.'],
  ['What confirmation does Paul want?','la version officielle',['la version officielle','un nouveau ticket','un billet moins cher'],'Paul requests written confirmation of the official version.']
 ],
 'b1-04':[
  ['What happened during the previous journey?','ils ont manqué leur correspondance',['ils ont manqué leur correspondance','ils ont acheté une voiture','ils ont visité le musée'],'They missed a connection because they had not checked the schedule.'],
  ['What is the group’s plan for the next trip?','vérifier les départs',['acheter une voiture','vérifier les départs','annuler le voyage'],'They will check departure times before deciding.']
 ],
 'b1-05':[
  ['Which community space does Alice wish to keep?','la bibliothèque de quartier',['la bibliothèque de quartier','le centre commercial','la gare'],'Alice argues for keeping the neighborhood library open.'],
  ['What limitation does Hugo mention?','les horaires sont limités',['les horaires sont limités','les livres sont trop courts','la bibliothèque est vide'],'He acknowledges that limited opening hours are a problem.']
 ],
 'b1-06':[
  ['Why does Luc plan to speak more slowly?','pour que les étudiants puissent noter',['pour finir plus vite','pour que les étudiants puissent noter','pour changer la réservation'],'He wants new students to have enough time to take notes.'],
  ['How will the organizers check the presentation?','demander si les visiteurs ont compris',['demander si les visiteurs ont compris','fermer le centre','vendre un guide'],'They will ask visitors whether the explanation was understood.']
 ],
 'b1-07':[
  ['Which announcement did the manager actually make?','ouvrir une heure plus tôt',['ouvrir une heure plus tôt','fermer définitivement','ouvrir seulement le samedi'],'The manager announced opening one hour earlier the next day.'],
  ['Which question was left unanswered?','si le samedi est concerné',['si le samedi est concerné','si le bureau existe','si le courriel a disparu'],'No one confirmed whether the announced change applied on Saturdays.']
 ],
 'b1-08':[
  ['What had happened before Lina reached the museum?','la visite avait déjà commencé',['la visite avait déjà commencé','le musée avait fermé pour toujours','elle avait annulé'],'The guided tour had already started when Lina arrived.'],
  ['What will Lina change next time?','vérifier la dernière confirmation',['vérifier la dernière confirmation','ne plus réserver','appeler le train'],'Lina plans to review the most recent confirmation before leaving home.']
 ],
 'b1-09':[
  ['What do the speakers know about the center notice?','certaines activités changeront',['tous les cours sont annulés','certaines activités changeront','leur cours est terminé'],'Only some activities were announced as being moved.'],
  ['What will Lina request before informing others?','une précision au secrétariat',['une précision au secrétariat','une réduction de prix','un nouveau manuel'],'Lina wants clarification from the office, not a speculative announcement.']
 ],
 'b1-10':[
  ['What time does Monday’s email announce?','neuf heures',['neuf heures','dix heures','onze heures'],'The email gives nine o’clock as the training start time.'],
  ['What differs on the undated entrance poster?','l’heure et la salle',['seulement le jour','l’heure et la salle','le nom de la formation'],'The poster lists ten and room B instead of nine and room A.']
 ],
 'b1-11':[
  ['What interrupted the planned hike?','un orage a commencé',['un orage a commencé','le bus est parti','la guide est arrivée'],'A storm began earlier than expected, changing the day.'],
  ['Who helped the group find another route?','une habitante',['une habitante','le responsable du musée','un professeur'],'A local resident directed them to a safer way back.']
 ],
 'b1-12':[
  ['What had Lucie already done before the date changed?','effectué le paiement',['effectué le paiement','annulé l’inscription','reçu un remboursement'],'Lucie says payment had already been made before the training change.'],
  ['What does Émilie advise Lucie not to assume?','le droit automatique à un autre cours',['le droit automatique à un autre cours','la date du message','le nom du secrétariat'],'Émilie cautions that changing courses has not been approved automatically.']
 ],
 'b1-13':[
  ['What participation format does Inès propose?','une formule mixte',['une formule mixte','uniquement en personne','aucune réunion'],'Inès proposes combining in-person and remote participation.'],
  ['What must Marc still verify?','la connexion et les ressources',['la connexion et les ressources','les livres empruntés','le prix du cinéma'],'Marc wants to confirm connection quality and available resources.']
 ],
 'b1-14':[
  ['Which two start times appear in the sources?','neuf heures et dix heures',['neuf heures et dix heures','huit heures et neuf heures','dix heures et onze heures'],'One source says nine while an unsigned poster says ten.'],
  ['What must happen before Yasmine makes the final summary?','recevoir une réponse officielle',['recevoir une réponse officielle','changer elle-même la date','supprimer les annonces'],'She will publish a cautious synthesis only after an official reply.']
 ]
};
export function listeningQuestionsForOriginalCourse(unit:A1Unit):readonly A1ListeningQuestion[]{
 const rows=QUESTIONS[unit.id];
 if(!rows)return listeningQuestionsForFullFrenchCourse(unit);
 return rows.map(([prompt,answer,options,explanation],i)=>Object.freeze({
  id:unit.id+'-listen-'+(i+1),prompt,answer,
  options:Object.freeze([...options]),explanation
 }));
}
export function validateB1Listening():readonly string[]{
 const errors=[...validateU9Listening()];
 if(Object.keys(QUESTIONS).length!==14)errors.push('14 new B1 listening pairs required');
 for(const unit of ORIGINAL_B1_UNITS){
  const items=listeningQuestionsForOriginalCourse(unit);
  if(items.length!==2)errors.push('Two B1 listening items required '+unit.id);
  for(const item of items)
   if(!item.options.includes(item.answer)||item.options.length<3||
     item.explanation.length<25)errors.push('Invalid B1 listening item '+item.id);
 }
 return errors;
}
