import type {A1Unit} from './u6-a1-model.ts';
export interface A1ListeningQuestion{
 readonly id:string;readonly prompt:string;readonly answer:string;
 readonly options:readonly string[];readonly explanation:string;
 readonly misconceptionFeedback?:Readonly<Record<string,string>>;
 /** Optional zero-based turn in the original five-turn dialogue, for source replay. */
 readonly sourceTurnIndex?:number;
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
  ['Which time does Farah propose for meeting on Monday?','lundi à midi',['dimanche à midi','lundi à midi','samedi soir'],'Farah proposes lundi à midi and says avec plaisir. Hugo has not yet replied to the suggested time, so it is not a confirmed two-sided appointment.']
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
type Bonus=readonly [string,string,readonly string[],string,Readonly<Record<string,string>>,number?];
/** Additional original U6 dialogue inference — existing listen-1 semantics stay unchanged. */
/** Additional third listening item for U7 original dialogues, never modifying listen-1/2. */
const ORIGINAL_LATE_A1_DIALOGUE_TRANSFER:Readonly<Record<string,Bonus>>=Object.freeze({
 "a1-13":["After Nadir asks about soup, which food does Camille actually say is available?","de la salade et des œufs",["de la salade et des œufs","de la soupe et du riz","du pain seulement"],"Camille explicitly says Non, mais il y a de la salade et des œufs; Nadir then chooses salad. The question tests the response to the soup request, not a guessed menu.",{"de la soupe et du riz":"Camille answers non to soup and never mentions rice in the dialogue; don't treat the initial question as the answer.","du pain seulement":"Bread was mentioned at the beginning, but Camille later offers salad and eggs in response to the soup question."},2],
 "a1-14":["Which price belongs to the black bag rather than the blue jacket?","douze euros",["douze euros","trente euros","aucun prix annoncé"],"The seller gives trente euros for the blue jacket, then douze euros for the black bag before asking about card payment.",{"trente euros":"That price belongs to the blue jacket; the client's next question about the black bag receives a different amount.","aucun prix annoncé":"The seller clearly states douze euros after the client asks about the black bag; the price is not unknown."},4],
 "a1-15":["After requesting apples and tomatoes, what does the customer add?","une bouteille d’eau et un paquet de riz",["une bouteille d’eau et un paquet de riz","une salade et des œufs","deux kilos de tomates"],"The market customer says Oui, une bouteille d’eau et un paquet de riz when the seller asks Autre chose ? after the first order.",{"une salade et des œufs":"Those foods belong to another situation and are not added in this market dialogue.","deux kilos de tomates":"The customer already asked for three tomatoes, not a new two-kilogram order after Autre chose ?"},3],
 "a1-16":["What does the customer order after hearing the plat du jour?","le plat du jour et de l’eau",["le plat du jour et de l’eau","une salade verte et du vin","une table et des billets"],"After the server announces vegetable soup as the daily special, the diner says Je voudrais le plat du jour et de l’eau.",{"une salade verte et du vin":"Neither green salad nor wine is requested. The server has described soup, not a second special.","une table et des billets":"The table was requested earlier for seating, not ordered as a dish; tickets are never mentioned."},3],
 "a1-17":["What does Chloé decide to bring despite planning a museum visit?","un parapluie",["un parapluie","un vélo","un billet de train"],"Chloé says Je vais prendre un parapluie after the speakers discuss morning rain and possibly visiting the museum at noon.",{"un vélo":"She says they will not go cycling in the rainy morning; the final item she plans to take is an umbrella.","un billet de train":"No train appears in their weather-and-museum exchange, so the item cannot be inferred."},4],
 "a1-18":["Has the conversation established whether Rayan has a balcony?","non, Rayan n’a pas encore répondu",["non, Rayan n’a pas encore répondu","oui, il a un balcon","non, il n’a pas de balcon"],"Noémie asks Tu as un balcon ? at the end, and the dialogue stops without Rayan's answer. The number of bedrooms does not establish the presence of a balcony.",{"oui, il a un balcon":"A question is not a confirmation. Rayan does not respond about the balcony in the given conversation.","non, il n’a pas de balcon":"No balcony answer is heard. A small apartment with two bedrooms may or may not have a balcony."},4],
 "a1-19":["When the traveller asks where to change, which instruction does the agent give?","changez à République",["changez à République","restez à la gare","changez à la mairie"],"The traveller asks Je change où ? and the agent answers Changez à République, then adds the arrival time of the next tram.",{"restez à la gare":"The station is the destination mentioned in the first question, not the transfer stop the agent gives.","changez à la mairie":"The agent explicitly names République as the transfer location, not the town hall."},3],
 "a1-20":["What does the receptionist confirm after checking the passport?","la chambre est prête et la clé est donnée",["la chambre est prête et la clé est donnée","la chambre n’est pas prête","le passeport manque"],"The guest supplies the passport and asks Est-ce que la chambre est prête ? The receptionist replies oui, offers the key and mentions the second floor.",{"la chambre n’est pas prête":"The receptionist says oui and hands over the key, not that the guest must wait.","le passeport manque":"The guest has already said voici mon passeport before the receptionist confirms the room."},4],
 "a1-21":["After Omar mentions Mila’s bag, what does le refer to in Je le prends?","le sac",["le sac","le billet","les clés"],"Omar has just said Je vois ton sac, so Mila's immediate Je le prends picks up the masculine singular noun sac. Earlier le in Je le cherche referred to billet.",{"le billet":"The first le referred to billet, but the closest noun mentioned before Je le prends is ton sac; context changes reference.","les clés":"Keys are plural and introduced only in the following question. Les, not le, later refers to them."},2],
 "a1-22":["What detail does Farah propose after Hugo suggests meeting Monday?","lundi à midi",["lundi à midi","dimanche à midi","lundi à minuit"],"Hugo asks On peut se retrouver lundi ? Farah replies Lundi à midi ? Avec plaisir ! She proposes noon; the snippet ends before a further answer from Hugo.",{"dimanche à midi":"Hugo cannot attend Sunday because he works; Monday is the alternative he offers.","lundi à minuit":"Farah says midi, noon, not minuit, midnight. These time words are easy to confuse in rapid speech."},4],
 "a1-23":["Why does the customer's final request not establish that the stamp information was understood?","elle demande de répéter plus lentement",["elle demande de répéter plus lentement","elle confirme avoir tout compris","elle achète déjà deux timbres"],"The customer says Pardon, vous pouvez répéter plus lentement ? after the clerk quotes two euros. The request is for clarification, not proof of a purchase or comprehension.",{"elle confirme avoir tout compris":"She requests slower repetition and gives no confirmation that she understood the quoted price.","elle achète déjà deux timbres":"The clerk says a stamp costs two euros, not that the customer bought two stamps; do not mix quantity and price."},4],
 "a1-24":["What information has the market seller not yet answered when the dialogue ends?","combien ça coûte",["combien ça coûte","si du pain est proposé","si le tram est en retard"],"The seller offers bread and water, and Nina asks Combien ça coûte ? The dialogue ends before a price is stated, so no numerical answer is supported.",{"si du pain est proposé":"The merchant explicitly offered bread and a bottle of water; the available items are not uncertain.","si le tram est en retard":"The transit agent already confirmed the tram's delay, before Nina went to the market."},4]
});

const ORIGINAL_A1_DIALOGUE_FOLLOWUPS:Readonly<Record<string,Bonus>>=Object.freeze({
 "a1-01":["How does Malik introduce himself after Inès says her name?","Moi, c’est Malik.",["Moi, c’est Malik.","Je suis professeur ici.","Je cherche un travail."],"Malik says Moi, c’est Malik. This informal introduction is not Inès's greeting or a description of his job.",{"Je suis professeur ici.":"The dialogue says nothing about Malik being a teacher; this is a different statement from a later lesson.","Je cherche un travail.":"This is neither Malik's name nor an introduction in this conversation; look for Moi, c’est."},1],
 "a1-02":["What does Aya say about herself and her friends being students?","nous sommes tous étudiants",["nous sommes tous étudiants","nous sommes professeurs","je suis seule étudiante"],"Aya says Oui, nous sommes tous étudiants, including herself and her friends; Nora later says she is a teacher.",{"nous sommes professeurs":"Aya uses étudiants, not professeurs. The later professor is Nora, the other speaker.","je suis seule étudiante":"Tous means everyone in the group, not that Aya is the only student."},3],
 "a1-03":["Which object does Sami say is for his course rather than specifically for school?","le cahier",["le cahier","le livre","la table"],"Sami attributes the notebook, le cahier, to his course, while Lucie asks whether the book, le livre, is for school.",{"le livre":"The dialogue links le livre with the school question, not Sami's phrase pour mon cours.","la table":"The table is a location for pens, not the object described as pour mon cours."},3],
 "a1-04":["How old is Léo’s sister, rather than his brother?","quinze ans",["quinze ans","dix ans","vingt ans"],"Léo says ma sœur a quinze ans and mon frère a dix ans; the two ages refer to different relatives.",{"dix ans":"Dix ans belongs to Léo’s brother; listen for ma sœur before the number.","vingt ans":"No relative is described as twenty years old; avoid inferring a number not spoken."},3],
 "a1-05":["When does Mehdi work, as distinct from when he studies?","le soir",["le matin","le soir","le samedi"],"Mehdi says he studies in the morning and works in the evening: étudie le matin, travaille le soir.",{"le matin":"Le matin refers to the study activity, not the work verb travaille.","le samedi":"Saturday never appears in Mehdi's response; it is not a stated schedule."},1],
 "a1-06":["Which practical question does Zoé ask that the agent has not yet answered?","combien coûte la carte ?",["combien coûte la carte ?","où est la bibliothèque ?","est-ce qu’elle est ouverte ?"],"The agent gives a location and confirms opening hours, but the excerpt ends before any card price is stated.",{"où est la bibliothèque ?":"The agent has already answered the location question: near the station.","est-ce qu’elle est ouverte ?":"The agent replies yes and gives a closing time; only the card price remains unanswered."},4],
 "a1-07":["What does Lina have at home instead of sugar?","du miel",["du miel","du sucre","du café"],"Lina says she does not have sugar but has honey: je n’ai pas de sucre, mais j’ai du miel.",{"du sucre":"She explicitly negates possession of sugar; the positive noun after mais is miel.","du café":"She says she does not like coffee, not that coffee is her alternative sweetener."},3],
 "a1-08":["Which colour does Louis give for the door, not the table?","bleue",["bleue","verte","rouge"],"Louis says la porte est bleue; later he describes a grande table verte in the living room.",{"verte":"Verte describes the table rather than the door; track the noun each adjective modifies.","rouge":"Red is not a colour used for the door in the spoken exchange."},1],
 "a1-09":["After the square, where is the museum in relation to the park?","devant le parc",["devant le parc","derrière la gare","dans la rue"],"The resident confirms the left turn and then says le musée est devant le parc, à droite.",{"derrière la gare":"The resident refers to the park, not a location behind the station.","dans la rue":"The dialogue provides a specific relation devant le parc; this vague answer loses the direction."},3],
 "a1-10":["What precise time do Élise and Karim agree to meet after his work finishes?","quinze heures et demie",["quinze heures et demie","quinze heures","dix-huit heures"],"Karim works until fifteen hours; Élise suggests fifteen thirty, and he agrees to meet in front of the library.",{"quinze heures":"This is the end of Karim's workday, not the agreed meeting time.","dix-huit heures":"No speaker proposes eighteen hours; listen for et demie after quinze heures."},2],
 "a1-11":["Which routine action does Hugo say happens after washing, before taking the bus?","je m’habille",["je m’habille","je me couche","je me lève"],"Hugo lists je me lave, je m’habille et je prends le bus, in that order.",{"je me couche":"Going to bed is not part of the morning sequence Hugo gives.","je me lève":"Getting up is mentioned earlier, but the question asks for the action between washing and catching the bus."},3],
 "a1-12":["Why does Noé decline Éva’s original Saturday cinema invitation?","il va travailler",["il va travailler","il va étudier","il est malade"],"After Éva asks est-ce que tu vas travailler ?, Noé answers oui, je vais travailler and suggests Sunday.",{"il va étudier":"Éva asks about work; Noé confirms working, not studying.","il est malade":"No illness is mentioned; his obstacle is work on Saturday."},3]
});

export function listeningQuestions(unit:A1Unit):readonly A1ListeningQuestion[]{
 const authored=QUESTIONS[unit.id];
 if(authored){
  const original=authored.map(([prompt,answer,options,explanation],i)=>Object.freeze({
   id:unit.id+'-listen-'+(i+1),prompt,answer,options:Object.freeze([...options]),explanation
  }));
  const added=ORIGINAL_LATE_A1_DIALOGUE_TRANSFER[unit.id];
  if(!added)return original;
  const [prompt,answer,options,explanation,misconceptionFeedback,sourceTurnIndex]=added;
  return [...original,Object.freeze({
   id:unit.id+'-listen-3',prompt,answer,options:Object.freeze([...options]),
   explanation,misconceptionFeedback:Object.freeze({...misconceptionFeedback}),sourceTurnIndex
  })];
 }
 // U6 units remain usable with an original, already authored reading-comprehension task.
 const reading=unit.tasks.find(task=>task.type==='reading');
 if(!reading)return [];
 const original={id:unit.id+'-listen-1',prompt:reading.prompt,answer:reading.answer,
  options:reading.options,explanation:reading.explanation};
 const bonus=ORIGINAL_A1_DIALOGUE_FOLLOWUPS[unit.id];
 if(!bonus)return [original];
 const [prompt,answer,options,explanation,misconceptionFeedback,sourceTurnIndex]=bonus;
 return [original,Object.freeze({
  id:unit.id+'-listen-2',prompt,answer,
  options:Object.freeze([...options]),explanation,
  misconceptionFeedback:Object.freeze({...misconceptionFeedback}),sourceTurnIndex
 })];
}
export function validateListeningCatalog(units:readonly A1Unit[]):readonly string[]{
 const issues:string[]=[];
 if(Object.keys(QUESTIONS).length!==12)issues.push('12 original U7 listening sets required');
 if(Object.keys(ORIGINAL_A1_DIALOGUE_FOLLOWUPS).length!==12)issues.push('12 original U6 A1 listening followups required');
 if(Object.keys(ORIGINAL_LATE_A1_DIALOGUE_TRANSFER).length!==12)issues.push('12 original U7 later-A1 dialogue followups required');
 for(const unit of units){
  const items=listeningQuestions(unit);
  if(items.length<(unit.order>12?3:2))issues.push('Missing listening questions '+unit.id);
  for(const item of items){
   if(item.options.length<3||!item.options.includes(item.answer)||item.explanation.length<20)
    issues.push('Invalid listening response '+item.id);
   if(item.sourceTurnIndex!==undefined&&
    (!Number.isInteger(item.sourceTurnIndex)||item.sourceTurnIndex<0||
     item.sourceTurnIndex>=unit.dialogue.length))
    issues.push('Original dialogue source-turn navigation out of range '+item.id);
   if(item.misconceptionFeedback){
    for(const [wrong,why] of Object.entries(item.misconceptionFeedback))
     if(!item.options.includes(wrong)||wrong===item.answer||why.length<40)
      issues.push('Misconception key invalid '+item.id+': '+wrong);
   }
  }
 }
 return issues;
}
/** One original dialogue per lesson; this is optional TTS input, not cleared human audio. */
export function listeningDialogueText(unit:A1Unit):string{
 return unit.dialogue.map(line=>line.fr).join(' ');
}

export interface OriginalA1SoundContrast{
 readonly focus:string;
 readonly a:Readonly<{french:string;meaning:string;reading:string}>;
 readonly b:Readonly<{french:string;meaning:string;reading:string}>;
 readonly guidance:string;
 readonly selfCheck:string;
}
/**
 * Source-owned pronunciation contrasts for original A1-01..12. IPA is pedagogical,
 * not an acoustic assertion about the actual installed device TTS voice.
 * Homophonous examples deliberately demonstrate where listening CANNOT decide.
 */

export const ORIGINAL_A1_SOUND_CONTRASTS:Readonly<Record<string,readonly OriginalA1SoundContrast[]>>=Object.freeze({
 "a1-01":[
  {"focus":"u vs ou","a":{"french":"Tu viens ce soir ?","meaning":"Are you coming tonight?","reading":"tu /ty/"},"b":{"french":"Tout vient du jardin.","meaning":"Everything comes from the garden.","reading":"tout /tu/"},"guidance":"French /y/ uses a high front tongue with rounded lips; /u/ moves the tongue farther back. Neither is English /uː/.","selfCheck":"Listen for the different vowels in tu and tout, then say both without reading."},
  {"focus":"é vs è","a":{"french":"C’est une fée.","meaning":"It is a fairy.","reading":"fée /fe/"},"b":{"french":"C’est un fait.","meaning":"It is a fact.","reading":"fait /fɛ/"},"guidance":"/e/ is tenser and closer than /ɛ/. The spelling é often marks /e/, but other spellings also occur; don't generalise from the letter e alone.","selfCheck":"Try to distinguish fée from fait; then reveal the different written forms."}
 ],
 "a1-02":[
  {"focus":"nasal vs oral on","a":{"french":"Ce café est bon.","meaning":"This coffee is good.","reading":"bon /bɔ̃/"},"b":{"french":"Cette soupe est bonne.","meaning":"This soup is good.","reading":"bonne /bɔn/"},"guidance":"Bon contains a nasal vowel with no pronounced final n. Bonne has an oral vowel followed by /n/; the adjective agreement changes the sound here.","selfCheck":"Hear what actually distinguishes the masculine and feminine adjectives."},
  {"focus":"pain vs pas","a":{"french":"Je prends du pain.","meaning":"I am taking some bread.","reading":"pain /pɛ̃/"},"b":{"french":"Je ne pars pas.","meaning":"I am not leaving.","reading":"pas /pa/"},"guidance":"Pain has a nasal vowel /ɛ̃/; pas has an oral /a/. The written final n of pain does not form a separate pronounced consonant.","selfCheck":"Compare the vowel after p; do not just look for silent final letters."}
 ],
 "a1-03":[
  {"focus":"liaison vs aspirated h","a":{"french":"Les amis arrivent.","meaning":"The friends are arriving.","reading":"les amis /lez‿ami/"},"b":{"french":"Les héros arrivent.","meaning":"The heroes are arriving.","reading":"les héros /le eʁo/"},"guidance":"Les amis normally links /z/ before the vowel. Héros has an aspirated h in French grammar, which blocks this liaison even though no /h/ is pronounced.","selfCheck":"Compare the word boundary; spelling alone does not make every h a liaison trigger."},
  {"focus":"un + vowel vs aspirated h","a":{"french":"Un ami attend.","meaning":"A friend is waiting.","reading":"un ami /œ̃n‿ami/"},"b":{"french":"Un héros attend.","meaning":"A hero is waiting.","reading":"un héros /œ̃ eʁo/"},"guidance":"Before ami the article may link with /n/. The aspirated-h class of héros blocks this connection. The exact vowel of un varies regionally.","selfCheck":"Listen for the linked n; don't pronounce an English h in héros."}
 ],
 "a1-04":[
  {"focus":"silent t becomes audible","a":{"french":"Il est petit.","meaning":"He is small.","reading":"petit /pəti/"},"b":{"french":"Elle est petite.","meaning":"She is small.","reading":"petite /pətit/"},"guidance":"The final written t is silent in isolated petit but pronounced in petite. The final written e of petite isn't a separate stressed vowel.","selfCheck":"Repeat the difference and connect it to adjective agreement."},
  {"focus":"silent d becomes audible","a":{"french":"Ce sac est lourd.","meaning":"This bag is heavy.","reading":"lourd /luʁ/"},"b":{"french":"Cette valise est lourde.","meaning":"This suitcase is heavy.","reading":"lourde /luʁd/"},"guidance":"Lourd normally ends without an audible d; lourde adds audible /d/. Written feminine e is not simply pronounced as an English ee.","selfCheck":"Listen for the final consonant in lourde, not an extra final vowel; repeat it after both different noun genders."}
 ],
 "a1-05":[
  {"focus":"written -ent is usually silent","a":{"french":"Il parle français.","meaning":"He speaks French.","reading":"parle /paʁl/"},"b":{"french":"Ils parlent français.","meaning":"They speak French.","reading":"parlent /paʁl/"},"guidance":"Parle and parlent are normally homophonous in these sentences. Sound alone does NOT distinguish subject number; the written subject and context do.","selfCheck":"These two verb forms normally sound the same. Can you infer the number from context instead?"},
  {"focus":"-ons vs -ez","a":{"french":"Nous parlons français.","meaning":"We speak French.","reading":"parlons /paʁlɔ̃/"},"b":{"french":"Vous parlez français.","meaning":"You speak French.","reading":"parlez /paʁle/"},"guidance":"The nous ending -ons contains a nasal vowel, while vous -ez ends in /e/. The endings are audible even though some other -er endings are silent.","selfCheck":"Listen for the verb ending; then replace the speaker and say the new form."}
 ],
 "a1-06":[
  {"focus":"qui vs que","a":{"french":"Qui arrive demain ?","meaning":"Who arrives tomorrow?","reading":"qui /ki/"},"b":{"french":"Que voulez-vous ?","meaning":"What would you like?","reading":"que /kə/"},"guidance":"Qui normally has /i/; unstressed que usually has schwa /ə/ (sometimes weakened or elided in connected speech). They are not interchangeable question words.","selfCheck":"Hear the vowel following /k/, and compare their grammatical roles."},
  {"focus":"où vs ou: written distinction","a":{"french":"Où est le parc ?","meaning":"Where is the park?","reading":"où /u/"},"b":{"french":"Thé ou café ?","meaning":"Tea or coffee?","reading":"ou /u/"},"guidance":"Où (where) and ou (or) are homophones in standard French. Only accent, syntax and meaning distinguish them; this is NOT a valid sound-only discrimination test.","selfCheck":"Try the audio, then explain why the spelling and meaning differ despite the shared sound."}
 ],
 "a1-07":[
  {"focus":"negation in careful and casual speech","a":{"french":"Je ne sais pas.","meaning":"I do not know (careful form).","reading":"ne ... pas /nə ... pa/"},"b":{"french":"Je sais pas.","meaning":"I don't know (common casual speech).","reading":"pas /pa/"},"guidance":"Spoken French often omits ne while keeping pas. Both examples mean a negative: deleting ne alone does NOT turn the sentence positive. Formal writing generally keeps ne.","selfCheck":"Compare what remains of the negative construction; do not infer opposite meaning from missing ne."},
  {"focus":"some vs no bread","a":{"french":"Je veux du pain.","meaning":"I want some bread.","reading":"du pain /dy pɛ̃/"},"b":{"french":"Je ne veux pas de pain.","meaning":"I do not want bread.","reading":"de pain /də pɛ̃/"},"guidance":"In a neutral negative statement the partitive du often becomes de; stress or contrast can license other wording. Keep the actual negative pas audible.","selfCheck":"Listen for pas and the changed article; don't treat de as a universal rule in every contrast."}
 ],
 "a1-08":[
  {"focus":"vert vs verte","a":{"french":"Le mur est vert.","meaning":"The wall is green.","reading":"vert /vɛʁ/"},"b":{"french":"La porte est verte.","meaning":"The door is green.","reading":"verte /vɛʁt/"},"guidance":"The final written t in vert is normally silent; verte pronounces /t/. Adjective gender can change the audible ending.","selfCheck":"Say the adjective for a new masculine and feminine noun, then check whether the final t becomes audible."},
  {"focus":"long vs longue","a":{"french":"Un chemin long.","meaning":"A long path.","reading":"long /lɔ̃/"},"b":{"french":"Une route longue.","meaning":"A long road.","reading":"longue /lɔ̃ɡ/"},"guidance":"Long has a nasal vowel and no pronounced final g. Longue has an audible /ɡ/ and a different vowel context; do not simply append an English uh.","selfCheck":"Compare the end consonant and the effect of the feminine spelling."}
 ],
 "a1-09":[
  {"focus":"linked vous allez","a":{"french":"Vous allez à gauche.","meaning":"You are going left.","reading":"vous allez /vuz‿ale/"},"b":{"french":"Vous tournez à gauche.","meaning":"You turn left.","reading":"vous tournez /vu tuʁne/"},"guidance":"Vous generally links /z/ before vowel-initial allez; no /z/ is inserted before the consonant of tournez.","selfCheck":"Listen across the word boundary in directions. In vous allez, the /z/ belongs to liaison, not the verb."},
  {"focus":"au vs où","a":{"french":"Je vais au musée.","meaning":"I am going to the museum.","reading":"au /o/"},"b":{"french":"Où est le musée ?","meaning":"Where is the museum?","reading":"où /u/"},"guidance":"Au is a contraction of à + le with /o/. Où asks where and uses /u/: the same spelling sequence ou is not automatically /o/.","selfCheck":"Listen for the different rounded vowels in real direction questions."}
 ],
 "a1-10":[
  {"focus":"two hours vs two days","a":{"french":"Dans deux heures.","meaning":"In two hours.","reading":"deux heures /døz‿œʁ/"},"b":{"french":"Dans deux jours.","meaning":"In two days.","reading":"deux jours /dø ʒuʁ/"},"guidance":"Deux normally links /z/ before the vowel of heures, but not before the consonant of jours. Don't insert z between every number and noun.","selfCheck":"Hear whether /z/ connects the number to the following word; do not add this sound before the consonant of jours."},
  {"focus":"six hours vs six days","a":{"french":"Dans six heures.","meaning":"In six hours.","reading":"six heures /siz‿œʁ/"},"b":{"french":"Dans six jours.","meaning":"In six days.","reading":"six jours /si ʒuʁ/"},"guidance":"Six has liaison /z/ before heures but typically ends without pronounced x before consonant-initial jours. Sound depends on the following word.","selfCheck":"Compare the number in a full time phrase, not as an isolated digit."}
 ],
 "a1-11":[
  {"focus":"me vs m’","a":{"french":"Je me lève.","meaning":"I get up.","reading":"me /mə/"},"b":{"french":"Je m’habille.","meaning":"I get dressed.","reading":"m’ /m/"},"guidance":"Me elides to m’ before vowel-initial or mute-h verbs such as habiller, but remains me before lève. The unstressed schwa can weaken naturally.","selfCheck":"Hear the word boundary while keeping the reflexive pronoun in both examples."},
  {"focus":"me couche vs m’endors","a":{"french":"Je me couche tôt.","meaning":"I go to bed early.","reading":"me /mə/"},"b":{"french":"Je m’endors vite.","meaning":"I fall asleep quickly.","reading":"m’ /m/"},"guidance":"The reflexive pronoun is still present after elision: m’endors, not j’endors. Me remains a separate syllable in careful speech before couche.","selfCheck":"Listen for the elision but keep the original meaning of the reflexive verb."}
 ],
 "a1-12":[
  {"focus":"on + a liaison","a":{"french":"On a du temps.","meaning":"We have time.","reading":"on a /ɔ̃n‿a/"},"b":{"french":"On va partir.","meaning":"We are going to leave.","reading":"on va /ɔ̃ va/"},"guidance":"On often links /n/ before vowel-initial a, but not before the v of va. The base vowel in on remains nasal.","selfCheck":"Hear the connected n in on a without adding it to on va, then use both in a natural conversation about tomorrow."},
  {"focus":"on y vs on vient","a":{"french":"On y va demain.","meaning":"We are going there tomorrow.","reading":"on y /ɔ̃n‿i/"},"b":{"french":"On vient demain.","meaning":"We are coming tomorrow.","reading":"on vient /ɔ̃ vjɛ̃/"},"guidance":"Y begins with a vowel sound, allowing liaison /n/ after on; vient begins with a consonant. The two expressions also give different travel directions.","selfCheck":"Compare the linking n and distinguish going there from coming."}
 ],
 "a1-13":[
  {"focus":"food: du vs de l’","a":{"french":"Je voudrais du pain.","meaning":"I would like some bread.","reading":"du /dy/"},"b":{"french":"Je voudrais de l’eau.","meaning":"I would like some water.","reading":"de l’eau /də lo/"},"guidance":"Du is one partitive form and de l’ precedes a vowel-initial noun. Pronounce the linked vowel smoothly, but do not mistake French rounded /y/ in du for English /uː/.","selfCheck":"Hear the order change from bread to water and explain how the article changes; repeat a fresh food request."},
  {"focus":"eggs: plural liaison","a":{"french":"Nous avons des œufs.","meaning":"We have some eggs.","reading":"des œufs /dez‿ø/"},"b":{"french":"Nous avons des tomates.","meaning":"We have some tomatoes.","reading":"des tomates /de tɔmat/"},"guidance":"The plural determiner des has a linking /z/ before the vowel-initial œufs, not before consonant-initial tomates. The words refer to different foods; only the consonant boundary is the sound focus.","selfCheck":"Listen for /z/ between des and œufs; make a new supermarket sentence with a vowel-initial food."}
 ],
 "a1-14":[
  {"focus":"prices: two euros vs two bags","a":{"french":"Ce carnet coûte deux euros.","meaning":"This notebook costs two euros.","reading":"deux euros /døz‿øʁo/"},"b":{"french":"Je voudrais deux sacs.","meaning":"I would like two bags.","reading":"deux sacs /dø sak/"},"guidance":"A numeral used as a determiner normally links /z/ before euro, which begins with a vowel. Before the consonant of sacs, the ending of deux is not pronounced. Price information must still come from the seller.","selfCheck":"Compare the sound after deux in the quoted price and in the bag request; then ask for a different price."},
  {"focus":"prices: twenty euros","a":{"french":"Cette veste coûte vingt euros.","meaning":"This jacket costs twenty euros.","reading":"vingt euros /vɛ̃t‿øʁo/"},"b":{"french":"Il reste vingt sacs.","meaning":"There are twenty bags left.","reading":"vingt sacs /vɛ̃ sak/"},"guidance":"Vingt normally forms a /t/ liaison before euros, not /z/; before consonant-initial sacs its final written t is silent. An incorrect liaison changes the speech even when the number is understood.","selfCheck":"Listen for /t/ in vingt euros; then say a new price without inserting /z/ or an extra syllable."}
 ],
 "a1-15":[
  {"focus":"kilo and bottle: nasal and oral","a":{"french":"Un kilo de pommes, s’il vous plaît.","meaning":"A kilo of apples, please.","reading":"un /œ̃/"},"b":{"french":"Une bouteille d’eau, s’il vous plaît.","meaning":"A bottle of water, please.","reading":"une /yn/"},"guidance":"Un is a nasal vowel (the exact quality varies regionally), whereas une contains the distinct oral rounded /y/ and /n/. These are different articles tied to different noun genders, not interchangeable accents.","selfCheck":"Hear the different article before kilo and bouteille, then order one new masculine and one feminine item."},
  {"focus":"three eggs or three tomatoes","a":{"french":"Je prends trois œufs.","meaning":"I am taking three eggs.","reading":"trois œufs /tʁwaz‿ø/"},"b":{"french":"Je prends trois tomates.","meaning":"I am taking three tomatoes.","reading":"trois tomates /tʁwa tɔmat/"},"guidance":"Trois as a determiner links /z/ before the vowel-initial noun œufs; that /z/ does not appear before consonant-initial tomates. Both phrases keep the quantity three.","selfCheck":"Listen across the number-noun boundary, then request another quantity of a vowel-initial market item."}
 ],
 "a1-16":[
  {"focus":"restaurant: two orders","a":{"french":"Nous voudrions des entrées.","meaning":"We would like starters.","reading":"des entrées /dez‿ɑ̃tʁe/"},"b":{"french":"Nous voudrions des plats.","meaning":"We would like main courses.","reading":"des plats /de pla/"},"guidance":"Des normally links /z/ before vowel-initial entrées, whereas no /z/ is inserted before the p of plats. The opening syllable of entrées contains a nasal vowel.","selfCheck":"Listen for the liaison in the restaurant request, then politely ask for a different dish."},
  {"focus":"formal customer: vous avez","a":{"french":"Vous avez une réservation ?","meaning":"Do you have a booking?","reading":"vous avez /vuz‿ave/"},"b":{"french":"Vous prenez le menu ?","meaning":"Are you having the set menu?","reading":"vous prenez /vu pʁəne/"},"guidance":"Vous links /z/ before the vowel of avez, not before p in prenez. Both utterances address a customer politely; the linking sound does not mark greater respect by itself.","selfCheck":"Compare the start of each service question, then repeat it with clear polite phrasing."}
 ],
 "a1-17":[
  {"focus":"pleut vs peut: audible l","a":{"french":"Il pleut ce matin.","meaning":"It is raining this morning.","reading":"pleut /plø/"},"b":{"french":"Il peut venir demain.","meaning":"He can come tomorrow.","reading":"peut /pø/"},"guidance":"Pleut includes /l/ after /p/, but peut lacks /l/. Their vowel is similar in these forms: hearing the extra consonant keeps a weather forecast separate from someone's ability.","selfCheck":"Listen for the /l/ in pleut, then explain why the two sentences predict different things."},
  {"focus":"no biking: negation","a":{"french":"Nous n’allons pas faire de vélo.","meaning":"We are not going cycling.","reading":"n’allons pas /nalɔ̃ pa/"},"b":{"french":"Nous allons faire du vélo.","meaning":"We are going cycling.","reading":"allons /alɔ̃/"},"guidance":"The full written negative has n’ before allons and pas after; the affirmative has neither negative marker. Do not confuse elision n’ with the casual spoken dropping of ne when pas remains.","selfCheck":"Listen for pas before deciding whether the cycling plan is positive or negative."}
 ],
 "a1-18":[
  {"focus":"inside the apartment: liaison","a":{"french":"J’habite dans un appartement.","meaning":"I live in an apartment.","reading":"dans un /dɑ̃z‿œ̃/"},"b":{"french":"Je suis dans le salon.","meaning":"I am in the living room.","reading":"dans le /dɑ̃ lə/"},"guidance":"Dans regularly has /z/ liaison before vowel-initial un; before consonant-initial le the normally silent final s stays silent. The nasal vowel of dans remains nasal in both.","selfCheck":"Listen between dans and the following word; describe a room in your own home without adding liaison before le."},
  {"focus":"a floor or a balcony","a":{"french":"Il y a un étage.","meaning":"There is a floor.","reading":"un étage /œ̃n‿etaʒ/"},"b":{"french":"Il y a un balcon.","meaning":"There is a balcony.","reading":"un balcon /œ̃ balkɔ̃/"},"guidance":"Un links an /n/ before vowel-initial étage, but has no extra consonant after it before balcon. This linking n is not part of the standalone pronunciation of un.","selfCheck":"Compare the noun boundary, then describe one other room or building feature in French."}
 ],
 "a1-19":[
  {"focus":"taking a tram: forms of prendre","a":{"french":"Prenez la ligne quatre.","meaning":"Take line four.","reading":"prenez /pʁəne/"},"b":{"french":"Je prends la ligne quatre.","meaning":"I take line four.","reading":"prends /pʁɑ̃/"},"guidance":"Prenez is the formal or plural imperative and ends in /e/. Je prends uses a nasal vowel /ɑ̃/ and a silent final ds; these forms request action versus report a choice.","selfCheck":"Hear the ending, then ask a station employee which line to take without using the familiar imperative."},
  {"focus":"next tram versus next service","a":{"french":"Le prochain tram arrive.","meaning":"The next tram is arriving.","reading":"prochain /pʁɔʃɛ̃/"},"b":{"french":"La prochaine rame arrive.","meaning":"The next tramcar is arriving.","reading":"prochaine /pʁɔʃɛn/"},"guidance":"The masculine prochain ends in a nasal vowel, while feminine prochaine has an oral vowel plus pronounced /n/. The two nouns differ, so this is a contextual gender comparison, not a pure minimal pair.","selfCheck":"Listen for the final /n/ of prochaine, then explain how the noun determines the adjective."}
 ],
 "a1-20":[
  {"focus":"hotel h muet","a":{"french":"Nous cherchons un hôtel.","meaning":"We are looking for a hotel.","reading":"un hôtel /œ̃n‿otɛl/"},"b":{"french":"Nous attendons dans un hall.","meaning":"We are waiting in a lobby.","reading":"un hall /œ̃ ɔl/"},"guidance":"Hôtel begins with mute h and allows liaison /n/ after un. Hall is conventionally aspirated h in French grammar and blocks this liaison, although no English /h/ sound is spoken.","selfCheck":"Listen for the n connection before hôtel, then describe where you are waiting."},
  {"focus":"reception: vous avez","a":{"french":"Vous avez une réservation ?","meaning":"Do you have a reservation?","reading":"vous avez /vuz‿ave/"},"b":{"french":"Vous prenez une chambre ?","meaning":"Are you taking a room?","reading":"vous prenez /vu pʁəne/"},"guidance":"The polite pronoun vous normally links /z/ before avez, but not before the consonant p in prenez. The different verbs change the receptionist's question, not the politeness level.","selfCheck":"Listen across vous and the verb, then make a courteous hotel request with vous."}
 ],
 "a1-21":[
  {"focus":"pronoun le vs les","a":{"french":"Je le prends.","meaning":"I take it.","reading":"le /lə/"},"b":{"french":"Je les prends.","meaning":"I take them.","reading":"les /le/"},"guidance":"Object pronoun le can contain unstressed schwa /ə/ in careful speech, while plural les has /e/. In fast speech le may reduce, so use both the vowel and context to track one item versus several.","selfCheck":"Hear singular versus plural pronouns; replace billet with clés and say the appropriate new sentence."},
  {"focus":"object pronoun before a vowel","a":{"french":"Je t’appelle ce soir.","meaning":"I will call you this evening.","reading":"t’appelle /tapɛl/"},"b":{"french":"Je te remercie.","meaning":"I thank you.","reading":"te remercie /tə ʁəmɛʁsi/"},"guidance":"Te elides to t’ before vowel-initial appelle but stays te before consonant-initial remercie. The schwa of te may weaken in ordinary connected speech; the object still means you.","selfCheck":"Listen for elision before appelle, then answer with a different polite expression addressed to the same person."}
 ],
 "a1-22":[
  {"focus":"invitation: ne may be dropped","a":{"french":"Je ne peux pas dimanche.","meaning":"I cannot on Sunday (careful).","reading":"ne peux pas /nə pø pa/"},"b":{"french":"Je peux pas dimanche.","meaning":"I can't on Sunday (familiar).","reading":"peux pas /pø pa/"},"guidance":"In everyday informal speech speakers may omit ne but keep pas; both utterances refuse the invitation. This does not justify teaching that ne deletion alone makes the refusal positive.","selfCheck":"Compare the careful and casual refusals; make a polite full-form response for an unfamiliar inviter."},
  {"focus":"invitation: pleasure vs maybe","a":{"french":"Avec plaisir !","meaning":"With pleasure!","reading":"plaisir /pleziʁ/"},"b":{"french":"Peut-être lundi.","meaning":"Maybe Monday.","reading":"peut-être /pøtɛtʁ/"},"guidance":"Plaisir accepts an invitation warmly, while peut-être leaves uncertainty. French phrase-final syllables can carry prominence, but stress does not automatically turn a possibility into confirmation.","selfCheck":"Listen to the end of each response; decide which one confirms Monday and which needs another answer."}
 ],
 "a1-23":[
  {"focus":"asking politely: voudrais vs veux","a":{"french":"Je voudrais envoyer une lettre.","meaning":"I would like to send a letter.","reading":"voudrais /vudʁɛ/"},"b":{"french":"Je veux envoyer une lettre.","meaning":"I want to send a letter.","reading":"veux /vø/"},"guidance":"Voudrais ends in /ɛ/ and provides a conventional soft request; veux ends in /ø/ and is more direct. Both are grammatically possible, but register matters when speaking to a postal employee.","selfCheck":"Hear the different verb forms; choose the more considerate request at a busy post office."},
  {"focus":"postal service: un vs une","a":{"french":"Je prends un timbre.","meaning":"I am taking a stamp.","reading":"un /œ̃/"},"b":{"french":"Je prends une lettre.","meaning":"I am taking a letter.","reading":"une /yn/"},"guidance":"The masculine indefinite article un contains a nasal vowel; feminine une includes oral /y/ followed by /n/. The two items are unrelated goods, not an isolated perfect minimal pair.","selfCheck":"Listen for the article before each postal item, then request a new item of either gender."}
 ],
 "a1-24":[
  {"focus":"food request: du vs de","a":{"french":"Je veux du pain.","meaning":"I want some bread.","reading":"du /dy/"},"b":{"french":"Je ne veux pas de pain.","meaning":"I don't want bread.","reading":"de /də/"},"guidance":"A neutral negative request often replaces partitive du by de, but this depends on meaning and emphasis; it is pas, not the article alone, that makes the statement negative.","selfCheck":"Listen for pas as well as the article; make a new affirmative request and a polite refusal."},
  {"focus":"polite service: link after vous","a":{"french":"Vous voulez du pain ?","meaning":"Would you like some bread?","reading":"vous voulez /vu vule/"},"b":{"french":"Vous avez du pain ?","meaning":"Do you have any bread?","reading":"vous avez /vuz‿ave/"},"guidance":"The polite vous links a /z/ before vowel-initial avez, not before the consonant in voulez. The first question offers bread; the second asks whether any is available.","selfCheck":"Hear the liaison and distinguish an offer from a question about stock before answering."}
 ]
});
export function originalA1SoundContrasts(id:string):readonly OriginalA1SoundContrast[]{
 return ORIGINAL_A1_SOUND_CONTRASTS[id]??[];
}
export function validateOriginalA1SoundContrasts():readonly string[]{
 const errors:string[]=[];
 for(let i=1;i<=24;i++){
  const id='a1-'+String(i).padStart(2,'0');
  const items=originalA1SoundContrasts(id);
  if(items.length!==2)errors.push(id+' requires two original authored listening contrasts');
  for(const [index,item] of items.entries()){
   if(!item.focus||item.guidance.length<95||item.selfCheck.length<60||
    !item.a?.french||!item.b?.french||!item.a.reading.includes('/')||!item.b.reading.includes('/')||
    !item.a.meaning||!item.b.meaning)errors.push(id+' contrast '+(index+1)+' incomplete');
  }
 }
 if(Object.keys(ORIGINAL_A1_SOUND_CONTRASTS).length!==24)errors.push('Expected 24 original A1 sound-contrast lesson records');
 return errors;
}

/** Independent original A1 situational speech preparation; no input capture or academic grade. */
export interface OriginalA1ConversationTransfer{
 readonly context:string;
 readonly task:string;
 readonly check:string;
 readonly relevantTurnIndex:number;
}
const A1_CONVERSATION_TRANSFERS:Readonly<Record<string,OriginalA1ConversationTransfer>>=Object.freeze({
 "a1-01":{"context":"A newcomer at your community club asks you to introduce yourself before the activity starts.","task":"Greet them formally, say your own name and close the conversation; then do it for a friend with a different greeting.","check":"Check the difference between bonjour and salut, and say je m’appelle with proper elision rather than copying Malik’s name.","relevantTurnIndex":0},
 "a1-02":{"context":"At a language exchange, two classmates ask what you and your friends are studying this year.","task":"Give three original French lines about yourself, a friend and the group using je suis, il est and nous sommes.","check":"Say the subjects clearly; do not invent another learner’s job and do not confuse sommes with êtes.","relevantTurnIndex":3},
 "a1-03":{"context":"A classmate forgot their notebook and borrows supplies during a morning course.","task":"Ask for a notebook and pen, identify whose book is on the table and specify what you need for class.","check":"Choose un/une/les by noun and number; objects found in a bag are not automatically yours.","relevantTurnIndex":3},
 "a1-04":{"context":"During a family dinner, someone introduces a sibling and asks about everyone’s ages.","task":"Say your age with avoir, ask for a sibling’s age, then give one hypothetical family age in a new setting.","check":"Listen for quinze versus dix and use avoir X ans, not être. Avoid guessing an age never said.","relevantTurnIndex":3},
 "a1-05":{"context":"Your work schedule changes, and your friend wants to know when you can take French classes.","task":"Contrast study time and work time, use one je and one nous form, then ask about your friend’s availability.","check":"The written -ent may be silent; keep the speaker explicit and distinguish audible -ons and -ez endings.","relevantTurnIndex":1},
 "a1-06":{"context":"You are visiting a city museum and need details from an employee you have not met.","task":"Ask where the entrance is, whether the museum is open and how much a ticket costs in formal French.","check":"Use est-ce que and question words with sensible word order, without assuming an unquoted ticket price.","relevantTurnIndex":4},
 "a1-07":{"context":"A friend offers you coffee and sugar, but you would prefer tea without either of them.","task":"Decline coffee, explain your preference and request tea politely in three independent sentences.","check":"Keep pas to express negation even if spoken ne is dropped; check the articles after aimer and avoir.","relevantTurnIndex":3},
 "a1-08":{"context":"You are describing a bicycle to a friend who cannot see its colour or condition.","task":"Describe a masculine and feminine component, compare their sizes and finish by asking whether the description is clear.","check":"Match gender in adjective endings and check audible final consonants rather than adding an extra final vowel.","relevantTurnIndex":1},
 "a1-09":{"context":"A visitor is standing near a park and wants directions to a pharmacy in another street.","task":"Give three hypothetical directions using a starting point, a turn and a relative location; request confirmation.","check":"Use au, du and à la accurately; never pretend to know the actual location of a real pharmacy.","relevantTurnIndex":3},
 "a1-10":{"context":"Your friend finishes work at fifteen hours and wants to meet at a gallery before closing.","task":"Propose a specific later meeting time and clear place, then ask your friend to confirm the arrangement.","check":"Distinguish a proposal from acceptance and say the time clearly, without inventing a reply.","relevantTurnIndex":2},
 "a1-11":{"context":"An earlier morning bus forces you to change how you get ready before your French lesson.","task":"Explain three morning actions, including washing and dressing, and say when you leave for the bus.","check":"Listen for m’ before vowel-initial verbs and me before consonants in careful speech; keep reflexive meaning.","relevantTurnIndex":3},
 "a1-12":{"context":"You cannot attend Saturday’s concert, but you are available for a different activity on Sunday.","task":"Decline, explain why, suggest Sunday and ask whether the new idea suits the other person.","check":"Build futur proche with an infinitive and remember that your proposal is not automatically accepted.","relevantTurnIndex":3},
 "a1-13":{"context":"A café has run out of soup, but the waiter offers eggs and vegetables at lunch.","task":"Ask what remains available, order some food and water and politely ask whether bread is available.","check":"Use du/de la/de l’/des according to each item and do not declare an unconfirmed dish available.","relevantTurnIndex":2},
 "a1-14":{"context":"In a clothes shop, a blue jacket and a black bag are displayed with different prices.","task":"Ask separately about both items, politely query the payment method and repeat the prices in context.","check":"Distinguish deux euros with /z/ liaison from vingt euros with /t/; do not assign a jacket price to a bag.","relevantTurnIndex":4},
 "a1-15":{"context":"At a weekend street market, you are preparing an order for a large family meal.","task":"Order two kilos of pears, three eggs and a bottle of water, then ask the seller for the as-yet-unknown total.","check":"Use quantity + de/d’ and the right articles; trois œufs allows liaison, but the total was not supplied.","relevantTurnIndex":3},
 "a1-16":{"context":"A restaurant can seat you at a counter, but your group of three needs a quiet table.","task":"Ask if a table for three is available, ask about a meat-free dish and order water only if offered.","check":"Use je voudrais and formal vous; never assert that the daily special is vegetarian without asking.","relevantTurnIndex":3},
 "a1-17":{"context":"Your morning outdoor trip is threatened by rain and you are speaking to a friend about alternatives.","task":"Explain the weather, decline an outdoor activity and suggest one clear indoor alternative.","check":"Distinguish pleut and peut; avoid treating a proposed museum visit as a confirmed ticket reservation.","relevantTurnIndex":4},
 "a1-18":{"context":"You tour an apartment with two bedrooms but have not received the full listing information.","task":"Describe the known rooms, ask if there is a balcony and request the unannounced rent.","check":"Use il y a and suitable place words; a balcony question is not proof the apartment has one.","relevantTurnIndex":4},
 "a1-19":{"context":"A delayed tram leaves you unsure where to transfer before travelling to the railway station.","task":"Ask for line and transfer information, repeat the answer in your own words and request the next arrival.","check":"Contrast polite prenez with je prends, and never invent a stop or timetable the agent has not given.","relevantTurnIndex":3},
 "a1-20":{"context":"At hotel reception, you need to check in under a companion’s family name.","task":"Explain the reservation, respond about your ID and ask if the room is actually ready.","check":"Practise vous and the liaison in un hôtel; a reservation does not by itself prove the room is ready.","relevantTurnIndex":4},
 "a1-21":{"context":"In a shared apartment, your friend cannot find two keys and one train ticket.","task":"Say what you saw, ask where both items might be and use le versus les with the right referents.","check":"Track the most recent noun when choosing a pronoun: the same le need not always mean billet.","relevantTurnIndex":2},
 "a1-22":{"context":"A friend invites you to lunch on Sunday, but you work that afternoon instead.","task":"Decline politely and suggest Monday at noon, then ask for an answer before marking anything confirmed.","check":"Preserve negative pas even in casual speech and keep proposed time separate from mutual agreement.","relevantTurnIndex":4},
 "a1-23":{"context":"At the post office, an employee says the price of a service too quickly for you to hear.","task":"Ask for slower repetition, say the amount you think was quoted and check it before paying.","check":"Deux euros is a cost, not evidence that two stamps were bought. A request to repeat is not comprehension.","relevantTurnIndex":4},
 "a1-24":{"context":"A late bus changes your plan, so you visit the bakery before finding a new connection.","task":"Ask about the next bus, request bread and water, then ask for the unquoted total price.","check":"Connect three polite service exchanges, but never fabricate an unknown departure or purchase amount.","relevantTurnIndex":4}
});
/** Twenty-four source-grounded repair turns: new changed-audience work, no new graded prompt IDs. */
export interface OriginalA1ConversationRepair{
 readonly misunderstanding:string;readonly responseTask:string;readonly evidenceCheck:string;
}
const A1_CONVERSATION_REPAIRS:Readonly<Record<string,OriginalA1ConversationRepair>>=Object.freeze({
 "a1-01":{misunderstanding:"a1-01",responseTask:"The visitor repeats your friend's name as if it were your own.",evidenceCheck:"Correct the person's identity politely, then introduce yourself again with a greeting appropriate for someone you have just met."},
 "a1-02":{misunderstanding:"a1-02",responseTask:"A classmate mistakes your friend's course for the subject you study.",evidenceCheck:"Contrast je and il/elle in a complete reply, then ask the classmate what their group is studying."},
 "a1-03":{misunderstanding:"a1-03",responseTask:"Someone thinks you are offering your notebook when you were asking to borrow one.",evidenceCheck:"Correct who owns the notebook and ask for the article and object you really need."},
 "a1-04":{misunderstanding:"a1-04",responseTask:"A guest interprets a question about age as a claim about your sibling.",evidenceCheck:"Clarify whose age is being discussed and ask again without inventing a number."},
 "a1-05":{misunderstanding:"a1-05",responseTask:"Your partner confuses a group's available study time with your personal working hours.",evidenceCheck:"Repair the speaker and time distinction, then propose a time for confirmation."},
 "a1-06":{misunderstanding:"a1-06",responseTask:"An employee replies about the admission fee although you asked which entrance is open.",evidenceCheck:"Restate the location question, then ask about the price as a separate unknown."},
 "a1-07":{misunderstanding:"a1-07",responseTask:"Your friend interprets your refusal of coffee as a refusal of every drink.",evidenceCheck:"Correct what you do not want and politely name what you would like instead."},
 "a1-08":{misunderstanding:"a1-08",responseTask:"A listener attributes the colour of one bicycle part to a different part.",evidenceCheck:"Identify both nouns and correct the adjective agreement before asking whether the listener understands."},
 "a1-09":{misunderstanding:"a1-09",responseTask:"A tourist takes your left turn to mean the pharmacy is immediately on the left.",evidenceCheck:"Separate the direction to turn from the destination's relative position, and request confirmation."},
 "a1-10":{misunderstanding:"a1-10",responseTask:"Your friend tells others the gallery meeting is confirmed although you only suggested it.",evidenceCheck:"State the proposed time and place, and ask for an explicit reply before confirming."},
 "a1-11":{misunderstanding:"a1-11",responseTask:"Someone assumes you have already left because you described your morning routine.",evidenceCheck:"Distinguish a usual action from today's plan and clarify when you will actually leave."},
 "a1-12":{misunderstanding:"a1-12",responseTask:"A friend hears your suggested Sunday activity as a promise to attend Saturday's concert.",evidenceCheck:"Decline the original invitation clearly, suggest Sunday and explicitly request confirmation."},
 "a1-13":{misunderstanding:"a1-13",responseTask:"The server thinks you ordered soup even though you asked what other food is available.",evidenceCheck:"Correct the presumed order, ask what is actually available and only then place a polite request."},
 "a1-14":{misunderstanding:"a1-14",responseTask:"A cashier applies the jacket's price to the bag without verifying the second item's tag.",evidenceCheck:"Ask for the bag's own price, contrast the items and check the intended payment method."},
 "a1-15":{misunderstanding:"a1-15",responseTask:"The seller quotes a total before confirming your changed quantities.",evidenceCheck:"Restate the final counts and ask the seller to recalculate without announcing an invented total."},
 "a1-16":{misunderstanding:"a1-16",responseTask:"The waiter interprets a meat-free request as proof that the daily special is vegetarian.",evidenceCheck:"Ask about actual ingredients and the table situation separately before ordering."},
 "a1-17":{misunderstanding:"a1-17",responseTask:"Your friend treats a possible indoor visit as an already purchased reservation.",evidenceCheck:"Explain the weather change, propose an indoor alternative and ask whether anyone has booked it."},
 "a1-18":{misunderstanding:"a1-18",responseTask:"A visitor announces an apartment has a balcony although you only asked about one.",evidenceCheck:"Correct the uncertainty, describe the known rooms and repeat the balcony and rent questions."},
 "a1-19":{misunderstanding:"a1-19",responseTask:"Another passenger mistakes the route you are asking about for a confirmed transfer.",evidenceCheck:"Ask the agent for the connection and next departure again, and repeat only details actually supplied."},
 "a1-20":{misunderstanding:"a1-20",responseTask:"The hotel employee thinks your reservation means the room is already ready.",evidenceCheck:"Separate the confirmed booking name from the room-readiness question and request a precise answer."},
 "a1-21":{misunderstanding:"a1-21",responseTask:"Your flatmate misunderstands le as referring to the keys rather than the ticket.",evidenceCheck:"Name the object explicitly, distinguish singular from plural, and ask where each item was last seen."},
 "a1-22":{misunderstanding:"a1-22",responseTask:"Your friend tells the group that Monday lunch is settled because you suggested it.",evidenceCheck:"Politely correct the status of Monday, preserve the refusal of Sunday, and ask for an answer."},
 "a1-23":{misunderstanding:"a1-23",responseTask:"The clerk interprets your request to repeat a price as an agreement to pay it.",evidenceCheck:"Ask for the amount again, repeat what you heard tentatively and confirm before purchasing."},
 "a1-24":{misunderstanding:"a1-24",responseTask:"Someone assumes you know the next bus time and total bakery price without a reply.",evidenceCheck:"Say which information is still unknown and make two separate polite follow-up questions."}
});
export function originalA1ConversationRepair(id:string):OriginalA1ConversationRepair|null{
 return A1_CONVERSATION_REPAIRS[id]??null;
}

export function originalA1ConversationTransfer(id:string):OriginalA1ConversationTransfer|null{
 return A1_CONVERSATION_TRANSFERS[id]??null;
}
export function validateOriginalA1ConversationTransfers():readonly string[]{
 const issues:string[]=[];
 if(Object.keys(A1_CONVERSATION_TRANSFERS).length!==24)issues.push('Twenty-four original A1 transfer situations required');
 for(let i=1;i<=24;i++){
  const id='a1-'+String(i).padStart(2,'0');
  const v=originalA1ConversationTransfer(id);
  const repair=originalA1ConversationRepair(id);
  if(!repair||repair.misunderstanding.length<55||repair.responseTask.length<75||repair.evidenceCheck.length<55)
   issues.push(id+' independent misunderstanding repair incomplete');
  if(!v||v.context.length<60||v.task.length<65||v.check.length<75||
   !Number.isInteger(v.relevantTurnIndex)||v.relevantTurnIndex<0||v.relevantTurnIndex>4)
   issues.push(id+' source-owned speech situation incomplete');
 }
 return issues;
}
