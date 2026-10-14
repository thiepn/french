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
  {"focus":"nasal vs oral on","a":{"french":"Il est bon.","meaning":"It is good.","reading":"bon /bɔ̃/"},"b":{"french":"Elle est bonne.","meaning":"It is good (feminine).","reading":"bonne /bɔn/"},"guidance":"Bon contains a nasal vowel with no pronounced final n. Bonne has an oral vowel followed by /n/; the adjective agreement changes the sound here.","selfCheck":"Hear what actually distinguishes the masculine and feminine adjectives."},
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
 ]
});
export function originalA1SoundContrasts(id:string):readonly OriginalA1SoundContrast[]{
 return ORIGINAL_A1_SOUND_CONTRASTS[id]??[];
}
export function validateOriginalA1SoundContrasts():readonly string[]{
 const errors:string[]=[];
 for(let i=1;i<=12;i++){
  const id='a1-'+String(i).padStart(2,'0');
  const items=originalA1SoundContrasts(id);
  if(items.length!==2)errors.push(id+' requires two original authored listening contrasts');
  for(const [index,item] of items.entries()){
   if(!item.focus||item.guidance.length<95||item.selfCheck.length<60||
    !item.a?.french||!item.b?.french||!item.a.reading.includes('/')||!item.b.reading.includes('/')||
    !item.a.meaning||!item.b.meaning)errors.push(id+' contrast '+(index+1)+' incomplete');
  }
 }
 if(Object.keys(ORIGINAL_A1_SOUND_CONTRASTS).length!==12)errors.push('Unexpected original A1 contrast catalog growth');
 return errors;
}
