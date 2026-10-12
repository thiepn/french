import type {A1Unit} from './u6-a1-model.ts';
import {listeningQuestions,validateListeningCatalog,type A1ListeningQuestion} from './u7-listening.ts';
import {A1_COMPLETE_UNITS} from './u7-a1-course.ts';
import {ORIGINAL_A2_UNITS} from './u8-course.ts';
type Q=readonly [string,string,readonly string[],string];
/** Two independent dialogue-grounded questions per authored A2 lesson. */
const A2_LISTENING:Readonly<Record<string,readonly [Q,Q]>>={
 'a2-01':[
  ['What did Émile prepare yesterday evening?','le dîner',['le dîner','un examen','un billet'],'He says he prepared dinner before the film.'],
  ['Why did Émile not finish the film?','il a dormi',['il a dormi','il est sorti','il a travaillé'],'He explicitly says he fell asleep.']
 ],
 'a2-02':[
  ['What transport did Paul use?','le train',['le tram','le train','le bus'],'Paul says he took the train before seeing the sea.'],
  ['How many chapters did Paul read?','trois',['deux','trois','quatre'],'He reports reading three chapters.']
 ],
 'a2-03':[
  ['When did Karim and the others arrive?','vers midi',['vers midi','à huit heures','à dix-huit heures'],'Karim says they arrived around noon.'],
  ['Where did Karim’s sister stay first?','à Paris',['à Nantes','à Paris','à Lyon'],'His sister remained in Paris and left on Monday.']
 ],
 'a2-04':[
  ['Why was Nora hurrying?','elle s’est réveillée tard',['elle a perdu son sac','elle s’est réveillée tard','elle est partie en vacances'],'Nora says she woke up late and hurried.'],
  ['Which body part did Nora wash?','les mains',['le visage','les mains','les cheveux'],'She specifically mentions washing her hands.']
 ],
 'a2-05':[
  ['Where did Rami live when he was young?','près de la mer',['près de la mer','dans les Alpes','à Paris'],'He describes a village near the sea.'],
  ['What did Léa enjoy doing at that time?','lire des livres',['jouer au tennis','lire des livres','faire du vélo'],'Léa says she read a lot of books.']
 ],
 'a2-06':[
  ['What was the weather when Théo reached the station?','il pleuvait',['il neigeait','il pleuvait','il faisait beau'],'He says it was raining when he arrived.'],
  ['What did the announcement report?','un retard',['un départ anticipé','un retard','une promotion'],'The announcement reported a delay while they waited.']
 ],
 'a2-07':[
  ['Which city did Élias visit?','Bordeaux',['Bordeaux','Nantes','Lyon'],'The conversation opens with his stay in Bordeaux.'],
  ['What happened later in the day?','il a plu',['il a neigé','il a plu','il a fait chaud'],'Élias says the weather turned rainy later.']
 ],
 'a2-08':[
  ['How long has Idris lived in Lille?','trois ans',['trois ans','six mois','deux semaines'],'He states that he has lived there for three years.'],
  ['How long did his training last?','deux semaines',['deux jours','deux semaines','six mois'],'Idris says he took training for two weeks.']
 ],
 'a2-09':[
  ['When did Noah receive the photos?','ce matin',['hier soir','ce matin','la semaine dernière'],'Noah says the photos arrived this morning.'],
  ['Who liked the beach photograph?','la sœur de Noah',['Karim','Maya','la sœur de Noah'],'Noah says his sister liked that photograph.']
 ],
 'a2-10':[
  ['Whom did Jules call yesterday?','ses parents',['sa sœur','ses parents','ses collègues'],'He says he phoned his parents yesterday.'],
  ['What did Jules send his sister?','un message',['un message','une photo','un billet'],'He sent his sister a message and explained the project.']
 ],
 'a2-11':[
  ['Why was Ana worried?','le train de son frère était en retard',['elle avait perdu son sac','le train de son frère était en retard','le café était fermé'],'Zoé explains that Ana was waiting for her delayed brother.'],
  ['Whom did Ana ask for help?','un agent',['un agent','son frère','un médecin'],'Ana asked an agent for help and he answered calmly.']
 ],
 'a2-12':[
  ['Why did Mehdi miss the class?','il avait de la fièvre',['il était en voyage','il avait de la fièvre','il faisait froid'],'Mehdi was ill and says he had a fever.'],
  ['Whom did Mehdi write to?','la professeure',['la professeure','son frère','le médecin'],'He wrote to the teacher and requested another appointment.']
 ],
 'a2-13':[
  ['What happened to Maxime’s train?','il a été annulé',['il est arrivé tôt','il a été annulé','il a changé de quai'],'His train was cancelled while he was waiting.'],
  ['What did the agent offer him?','un autre départ',['un autre départ','un billet gratuit','un hôtel'],'The agent proposed another departure.']
 ],
 'a2-14':[
  ['What did Malo send to his parents?','des photos',['des livres','des photos','des lettres'],'He says he sent the travel photographs to his parents.'],
  ['What unexpected problem happened to their bus?','il est tombé en panne',['il est tombé en panne','il est arrivé en avance','il était plein'],'Malo says their bus broke down.']
 ]
};
export function listeningQuestionsForFrenchUnit(unit:A1Unit):readonly A1ListeningQuestion[]{
 const rows=A2_LISTENING[unit.id];
 if(!rows)return listeningQuestions(unit);
 return rows.map(([prompt,answer,options,explanation],i)=>Object.freeze({
  id:unit.id+'-listen-'+(i+1),prompt,answer,options:Object.freeze([...options]),explanation
 }));
}
export function validateOriginalA2Listening():readonly string[]{
 const errors=[...validateListeningCatalog(A1_COMPLETE_UNITS)];
 if(Object.keys(A2_LISTENING).length!==14)errors.push('Fourteen A2 listening sets required');
 for(const unit of ORIGINAL_A2_UNITS){
  const questions=listeningQuestionsForFrenchUnit(unit);
  if(questions.length!==2)errors.push('Two questions required '+unit.id);
  for(const q of questions){
   if(!q.answer||!q.options.includes(q.answer)||q.options.length<3||q.explanation.length<25)
    errors.push('Unqualified listening item '+q.id);
  }
 }
 return errors;
}
