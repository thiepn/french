import type {A1Unit} from './u6-a1-model.ts';
import type {A1ListeningQuestion} from './u7-listening.ts';
import {listeningQuestionsForFrenchUnit,validateOriginalA2Listening} from './u8-listening.ts';
import {PRACTICAL_A2_UNITS} from './u9-course.ts';
type Q=readonly [string,string,readonly string[],string];
/** Listening questions have authored evidence in each original French dialogue. */
const U9_QUESTIONS:Readonly<Record<string,readonly [Q,Q]>>={
 'a2-15':[
  ['Which apartment is larger?','le premier',['le premier','le deuxième','les deux'],'Romain says the first apartment is bigger but costs more.'],
  ['Why might the second apartment be a better choice?','il est plus près de la gare',['il est plus cher','il est plus près de la gare','il a trois chambres'],'The second apartment is closer to the station while remaining bright.']
 ],
 'a2-16':[
  ['Where will Hassan travel during the holidays?','à Lyon',['à Paris','à Lyon','à Nice'],'Hassan says he will go to Lyon and visit his cousins.'],
  ['When will the cousins visit the museum?','samedi',['vendredi','samedi','dimanche'],'He clearly says they will go to the museum on Saturday.']
 ],
 'a2-17':[
  ['Which new booking day does the client request?','jeudi',['mercredi','jeudi','vendredi'],'The customer asks to come Thursday instead of Wednesday.'],
  ['What information does the client want confirmed?','le nouveau prix',['le numéro de train','le nouveau prix','le nom du réceptionniste'],'At the end, the customer politely requests confirmation of the new price.']
 ],
 'a2-18':[
  ['What does Leo propose if it continues to rain?','aller au musée',['aller au parc','aller au musée','faire du vélo'],'Leo suggests the museum as an indoor alternative to the park.'],
  ['What does Leo suggest checking before deciding?','les horaires',['les horaires','le prix des pommes','le téléphone'],'Leo proposes looking at the opening times or schedule first.']
 ],
 'a2-19':[
  ['Where does Lina’s colleague work?','près de la gare',['à la mairie','près de la gare','dans une école'],'Lina says the colleague works in an office near the station.'],
  ['When did Lina meet this colleague?','lundi',['lundi','samedi','mercredi'],'Lina says she met the colleague on Monday.']
 ],
 'a2-20':[
  ['How many tomatoes does the shopper want?','quatre',['deux','quatre','six'],'The customer uses en with a quantity to request four tomatoes.'],
  ['How often does the customer visit the market?','chaque samedi',['chaque mercredi','chaque samedi','tous les matins'],'The customer says j’y vais chaque samedi about the market.']
 ],
 'a2-21':[
  ['Why does the customer want to exchange her jacket?','elle est trop petite',['elle est trop chère','elle est trop petite','elle est perdue'],'She says the jacket is too small and asks for a larger size.'],
  ['What does the salesperson offer to check?','une autre taille',['un autre magasin','une autre taille','les horaires du bus'],'The salesperson offers to check whether the requested size is available.']
 ],
 'a2-22':[
  ['For which day does the traveler want a new ticket?','vendredi',['jeudi','vendredi','samedi'],'The traveler explicitly asks to change the ticket to Friday.'],
  ['Which journey requires a transfer in Dijon?','le premier train',['le premier train','le deuxième train','les deux trains'],'The agent explains that the first train needs a connection in Dijon.']
 ],
 'a2-23':[
  ['What happened to Clara and her friend yesterday?','elles se sont disputées',['elles ont voyagé','elles se sont disputées','elles ont travaillé ensemble'],'Clara says she argued with her friend yesterday.'],
  ['What does Adam suggest Clara do next?','envoyer un message',['envoyer un message','annuler son voyage','acheter un cadeau'],'Adam suggests a message and a calm conversation.']
 ],
 'a2-24':[
  ['Where is the leak located?','dans la cuisine',['dans la chambre','dans la cuisine','sur le balcon'],'The tenant reports a leak in the kitchen, involving the tap.'],
  ['Why does the tenant request an afternoon visit?','elle travaille le matin',['elle travaille le matin','elle voyage jeudi','elle est malade'],'The tenant says she works on Thursday morning.']
 ],
 'a2-25':[
  ['Which day does Ana want confirmed?','mardi',['lundi','mardi','jeudi'],'Ana says she is writing to request confirmation for Tuesday.'],
  ['Which closing does Ana decide to use?','Cordialement',['Au revoir','Cordialement','Bisous'],'Ana says she will end the formal email with Cordialement.']
 ],
 'a2-26':[
  ['What has the student already finished?','la première partie',['la première partie','le dossier entier','les dernières questions'],'The student says the first part is finished but questions remain.'],
  ['What does the teacher ask the student to verify?','les sources',['les sources','les billets de train','les horaires du bus'],'The teacher says sources need checking before submission.']
 ],
 'a2-27':[
  ['Which article did the customer receive damaged?','un livre',['un livre','une veste','un téléphone'],'The customer reports that the delivered book is damaged.'],
  ['What must the adviser do before proposing an exchange?','vérifier le dossier',['vérifier le dossier','changer le prix sans accord','envoyer une lettre'],'The adviser offers an exchange after the order file is checked.']
 ],
 'a2-28':[
  ['Which departure day does the client request?','vendredi',['jeudi','vendredi','lundi'],'The client asks to move a journey originally booked for Thursday to Friday.'],
  ['Which condition matters before booking the direct train?','le prix doit convenir',['la météo doit changer','le prix doit convenir','le musée doit ouvrir'],'The client says she will book if the confirmed fare is acceptable.']
 ]
};
export function listeningQuestionsForFullFrenchCourse(unit:A1Unit):readonly A1ListeningQuestion[]{
 const questions=U9_QUESTIONS[unit.id];
 if(!questions)return listeningQuestionsForFrenchUnit(unit);
 return questions.map(([prompt,answer,options,explanation],i)=>Object.freeze({
  id:unit.id+'-listen-'+(i+1),prompt,answer,options:Object.freeze([...options]),explanation
 }));
}
export function validateU9Listening():readonly string[]{
 const issues=[...validateOriginalA2Listening()];
 if(Object.keys(U9_QUESTIONS).length!==14)issues.push('Fourteen new lesson listening sets required');
 for(const unit of PRACTICAL_A2_UNITS){
  const questions=listeningQuestionsForFullFrenchCourse(unit);
  if(questions.length!==2)issues.push(unit.id+' requires two questions');
  for(const q of questions)
   if(!q.answer||q.options.length<3||!q.options.includes(q.answer)||q.explanation.length<25)
    issues.push('Incorrect listening prompt '+q.id);
 }
 return issues;
}
