import type {A1Unit} from './u6-a1-model.ts';
export interface A1ListeningQuestion{
 readonly id:string;readonly prompt:string;readonly answer:string;
 readonly options:readonly string[];readonly explanation:string;
}
type Q=readonly [string,string,readonly string[],string];
const QUESTIONS:Readonly<Record<string,readonly [Q,Q]>>={
 'a1-13':[
  ['Which food does Nadir finally choose?','de la salade',['de la salade','de la soupe','du riz'],'He chooses salad instead of soup.'],
  ['What drink does Camille offer?','de l’eau',['du lait','du café','de l’eau'],'Camille asks whether Nadir wants water.']
 ],
 'a1-14':[
  ['How much does the blue jacket cost?','trente euros',['vingt euros','trente euros','douze euros'],'The salesperson states thirty euros for the jacket.'],
  ['What payment method does the seller ask about?','par carte',['en espèces','par carte','par chèque'],'The seller asks whether the customer is paying by card.']
 ],
 'a1-15':[
  ['How many tomatoes does the shopper want?','trois',['deux','trois','quatre'],'The customer asks for three tomatoes.'],
  ['What is the total price at the market?','neuf euros',['six euros','neuf euros','dix euros'],'The merchant quotes a total of nine euros.']
 ],
 'a1-16':[
  ['How many people need a table?','deux',['une','deux','trois'],'The diner asks for une table pour deux.'],
  ['What is the daily special?','une soupe de légumes',['une salade verte','une soupe de légumes','du poulet'],'The server says the special is vegetable soup.']
 ],
 'a1-17':[
  ['When does Ibrahim predict rain?','le matin',['le matin','à midi','le soir'],'He predicts rain in the morning.'],
  ['What indoor activity do the friends suggest?','visiter le musée',['aller à la plage','visiter le musée','faire de la randonnée'],'Ibrahim proposes visiting the museum.']
 ],
 'a1-18':[
  ['Does Rayan live in an apartment or a house?','un appartement',['une maison','un appartement','un hôtel'],'He says j’habite dans un petit appartement.'],
  ['How many bedrooms does he have?','deux',['une','deux','trois'],'Rayan explicitly mentions two bedrooms.']
 ],
 'a1-19':[
  ['Which tram line should the traveler take?','la ligne quatre',['la ligne deux','la ligne quatre','la ligne cinq'],'The agent directs the traveler to line four.'],
  ['Where does the traveler have to transfer?','à République',['à République','à la gare','à la mairie'],'The transfer instruction is changez à République.']
 ],
 'a1-20':[
  ['What name is the reservation under?','Martin',['Leroy','Martin','Diallo'],'The guest says au nom de Martin.'],
  ['Which floor is the room on?','le deuxième étage',['le premier étage','le deuxième étage','le troisième étage'],'The receptionist states the second floor.']
 ],
 'a1-21':[
  ['Where does Omar see the keys?','dans le sac',['sur la table','dans le sac','dans la voiture'],'Omar says he sees them in the bag.'],
  ['What is Mila going to do this evening?','appeler Omar',['chercher un billet','appeler Omar','visiter une amie'],'She tells Omar je t’appelle ce soir.']
 ],
 'a1-22':[
  ['Why can’t Hugo accept the Sunday invitation?','il travaille',['il travaille','il est malade','il voyage'],'Hugo says that he works on Sunday.'],
  ['When do the friends plan to meet instead?','lundi à midi',['dimanche à midi','lundi à midi','samedi soir'],'Farah confirms Monday at noon.']
 ],
 'a1-23':[
  ['What does the customer want to send?','une lettre',['un colis','une lettre','une carte'],'The opening request is to send a letter.'],
  ['Why does the customer ask the clerk to repeat?','pour comprendre plus lentement',['pour changer le timbre','pour comprendre plus lentement','pour obtenir une autre lettre'],'She asks for a slower repetition of the clerk’s information.']
 ],
 'a1-24':[
  ['Why is Nina considering the market?','le tram est en retard',['le tram est en retard','le marché est fermé','elle a perdu son billet'],'Nina hears that the tram is late and changes plans.'],
  ['What two things does the merchant offer?','du pain et une bouteille d’eau',['du lait et du riz','du pain et une bouteille d’eau','du fromage et du thé'],'The merchant offers bread and a bottle of water.']
 ]
};
export function listeningQuestions(unit:A1Unit):readonly A1ListeningQuestion[]{
 const authored=QUESTIONS[unit.id];
 if(authored)return authored.map(([prompt,answer,options,explanation],i)=>Object.freeze({
  id:unit.id+'-listen-'+(i+1),prompt,answer,options:Object.freeze([...options]),explanation
 }));
 // U6 units remain usable with an original, already authored reading-comprehension task.
 const reading=unit.tasks.find(task=>task.type==='reading');
 return reading?[{id:unit.id+'-listen-1',prompt:reading.prompt,answer:reading.answer,
  options:reading.options,explanation:reading.explanation}]:[];
}
export function validateListeningCatalog(units:readonly A1Unit[]):readonly string[]{
 const issues:string[]=[];
 if(Object.keys(QUESTIONS).length!==12)issues.push('12 original U7 listening sets required');
 for(const unit of units){
  const items=listeningQuestions(unit);
  if(items.length<(unit.order>12?2:1))issues.push('Missing listening questions '+unit.id);
  for(const item of items){
   if(item.options.length<3||!item.options.includes(item.answer)||item.explanation.length<20)
    issues.push('Invalid listening response '+item.id);
  }
 }
 return issues;
}
/** One original dialogue per lesson; this is optional TTS input, not cleared human audio. */
export function listeningDialogueText(unit:A1Unit):string{
 return unit.dialogue.map(line=>line.fr).join(' ');
}
