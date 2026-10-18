import type {A1Unit} from './u6-a1-model.ts';
import type {A1ListeningQuestion} from './u7-listening.ts';
import {listeningQuestionsForFullFrenchCourse,validateU9Listening} from './u9-listening.ts';
import {ORIGINAL_B1_UNITS} from './u10-course.ts';
type Q=readonly [string,string,readonly string[],string];
/** Two original dialogue-grounded comprehension questions per new B1 full lesson. */
const QUESTIONS:Readonly<Record<string,readonly [Q,Q]>>={
 'b1-01':[
  ['What motivates Eva’s request to change the meeting?','le dernier bus part plus tôt',['la bibliothèque ferme définitivement','le dernier bus part plus tôt','le projet est terminé'],'Eva noticed that the last Friday bus departs earlier than expected.'],
  ['What does Martin still need to verify instead of treating Eva’s proposed new time as final?','les horaires de fermeture',['les horaires de fermeture','le prix des billets','le nombre de livres'],'Martin says he will check the official closing times; the cost of tickets and number of books are not reasons he mentions. The meeting remains a proposal while details are checked.']
 ],
 'b1-02':[
  ['What meeting format does Nora initially prefer?','en ligne',['en ligne','uniquement en personne','dans un parc'],'Nora favors online meetings because some colleagues live far away.'],
  ['How does Omar respond to Nora’s travel-cost concern without dismissing colleagues who prefer meeting in person?','proposer deux options',['annuler la rencontre','proposer deux options','imposer une salle'],'He suggests offering two options and asking for preferences. He neither cancels the meeting nor imposes a single format, so his answer is a negotiated possibility rather than a decision.']
 ],
 'b1-03':[
  ['What discrepancy worries Léa?','deux versions du document',['le dossier a disparu','deux versions du document','le prix a doublé'],'Léa has two versions of a document and does not know which applies.'],
  ['Which missing verification prevents the two conflicting documents from becoming a reliable schedule?','la version officielle',['la version officielle','un nouveau ticket','un billet moins cher'],'Paul seeks the official applicable version. A replacement ticket or lower fare would not establish which document governs the dates; hearing two versions is not confirmation.']
 ],
 'b1-04':[
  ['What happened during the previous journey?','ils ont manqué leur correspondance',['ils ont manqué leur correspondance','ils ont acheté une voiture','ils ont visité le musée'],'They missed a connection because they had not checked the schedule.'],
  ['After discussing an earlier missed connection and hypothetical alternatives, what practical action do the travellers choose next?','vérifier les départs',['acheter une voiture','vérifier les départs','annuler le voyage'],'They intend to check departures before deciding. Buying a car is hypothetical, and cancelling the journey was not announced as their plan.']
 ],
 'b1-05':[
  ['Which community space does Alice wish to keep?','la bibliothèque de quartier',['la bibliothèque de quartier','le centre commercial','la gare'],'Alice argues for keeping the neighborhood library open.'],
  ['Which concrete problem does Hugo acknowledge even while supporting Alice’s positive opinion of the library?','les horaires sont limités',['les horaires sont limités','les livres sont trop courts','la bibliothèque est vide'],'He names limited opening hours, especially for working residents. The complaint is about access at certain times, not about book length or an empty building.']
 ],
 'b1-06':[
  ['Why does Luc plan to speak more slowly?','pour que les étudiants puissent noter',['pour finir plus vite','pour que les étudiants puissent noter','pour changer la réservation'],'He wants new students to have enough time to take notes.'],
  ['What will the organisers do to distinguish genuine visitor understanding from simply delivering an explanation?','demander si les visiteurs ont compris',['demander si les visiteurs ont compris','fermer le centre','vendre un guide'],'They plan to ask whether visitors understood. Selling a guide or closing the centre would not test whether new students can follow the instructions.']
 ],
 'b1-07':[
  ['Which announcement did the manager actually make?','ouvrir une heure plus tôt',['ouvrir une heure plus tôt','fermer définitivement','ouvrir seulement le samedi'],'The manager announced opening one hour earlier the next day.'],
  ['Which extension of the oral announcement would be an unsupported inference rather than a confirmed change?','si le samedi est concerné',['si le samedi est concerné','si le bureau existe','si le courriel a disparu'],'The announced earlier opening concerned the following day, but nobody confirmed whether Saturday is included. A question about Saturday must be asked, not answered by assumption.']
 ],
 'b1-08':[
  ['What had happened before Lina reached the museum?','la visite avait déjà commencé',['la visite avait déjà commencé','le musée avait fermé pour toujours','elle avait annulé'],'The guided tour had already started when Lina arrived.'],
  ['After discovering that her tour had already started, which precaution does Lina plan for her next visit?','vérifier la dernière confirmation',['vérifier la dernière confirmation','ne plus réserver','appeler le train'],'She wants to read the latest confirmation before leaving. The dialogue does not say she will stop reserving or call a train; those options do not repair the missed update.']
 ],
 'b1-09':[
  ['What do the speakers know about the center notice?','certaines activités changeront',['tous les cours sont annulés','certaines activités changeront','leur cours est terminé'],'Only some activities were announced as being moved.'],
  ['Before repeating a broad interpretation of the centre notice, which source should Lina ask for clarification?','une précision au secrétariat',['une précision au secrétariat','une réduction de prix','un nouveau manuel'],'She wants a precise answer from the office. A discounted price or new manual cannot determine which activities the notice actually affects.']
 ],
 'b1-10':[
  ['What time does Monday’s email announce?','neuf heures',['neuf heures','dix heures','onze heures'],'The email gives nine o’clock as the training start time.'],
  ['Which two details on the entrance poster conflict with Monday’s earlier message?','l’heure et la salle',['seulement le jour','l’heure et la salle','le nom de la formation'],'The posted start time and room both differ. A later undated poster cannot automatically replace the earlier email; the day and course name are not the described two differences.']
 ],
 'b1-11':[
  ['What interrupted the planned hike?','un orage a commencé',['un orage a commencé','le bus est parti','la guide est arrivée'],'A storm began earlier than expected, changing the day.'],
  ['When weather disrupted the hike, whose local guidance helped the group consider a route back?','une habitante',['une habitante','le responsable du musée','un professeur'],'A local resident offered directions. Neither a museum manager nor a teacher is identified as helping, and local guidance is not itself a weather guarantee.']
 ],
 'b1-12':[
  ['What had Lucie already done before the date changed?','effectué le paiement',['effectué le paiement','annulé l’inscription','reçu un remboursement'],'Lucie says payment had already been made before the training change.'],
  ['What conclusion about her paid registration does Émilie warn Lucie against drawing from the date-change message?','le droit automatique à un autre cours',['le droit automatique à un autre cours','la date du message','le nom du secrétariat'],'A request for another course has not been accepted automatically, even if payment was already made. The date and office name are facts to report, not benefits guaranteed by the reply.']
 ],
 'b1-13':[
  ['What participation format does Inès propose?','une formule mixte',['une formule mixte','uniquement en personne','aucune réunion'],'Inès proposes combining in-person and remote participation.'],
  ['What practical conditions must Marc check before treating the mixed format as workable?','la connexion et les ressources',['la connexion et les ressources','les livres empruntés','le prix du cinéma'],'He still needs information about connection quality and resources. A proposed hybrid meeting is not usable until distant participants can actually follow the exchange.']
 ],
 'b1-14':[
  ['Which two start times appear in the sources?','neuf heures et dix heures',['neuf heures et dix heures','huit heures et neuf heures','dix heures et onze heures'],'One source says nine while an unsigned poster says ten.'],
  ['Which step must precede Yasmine’s definitive public summary when two different hours circulate?','recevoir une réponse officielle',['recevoir une réponse officielle','changer elle-même la date','supprimer les annonces'],'An official reply must establish the correct time. Choosing an hour herself or hiding the earlier announcements would not resolve the conflicting sources.']
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
