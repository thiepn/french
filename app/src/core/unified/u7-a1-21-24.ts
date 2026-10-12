import {authorA1Unit,type A1AuthoredSpec} from './u6-a1-model.ts';
const authored:A1AuthoredSpec[]=[
{
 id:'a1-21',title:'Finding people and replacing repeated nouns',goal:'Recognize basic direct-object pronouns in familiar everyday exchanges.',grammarIds:['articles','negation'],
 grammar:[
 ['A small first step with direct objects','When the object is known, le (masculine) and la (feminine) can replace a repeated singular noun; les replaces a plural noun. The pronoun normally stands before the finite verb: Tu as le billet ? Oui, je le prends. Unlike the articles le/la/les, object pronouns are followed directly by a verb.',[['Tu as le livre ? Je le cherche.','Do you have the book? I am looking for it.'],['Les clés ? Je les trouve.','The keys? I find them.']],['Je cherche le.','Je le cherche.','The object pronoun le goes before the conjugated verb.']],
 ['Me, te and elision before a verb','Me and te can refer to the person speaking or being addressed: tu me comprends ? je te vois. Before a vowel-initial verb, me, te, le and la often become m’, t’ and l’: je l’aime. This is a recognition-level A1 introduction; longer clitic sequences belong in later A2 grammar.',[['Tu me vois ?','Can you see me?'],['Je t’appelle ce soir.','I will call you this evening.']],['Je te appelle demain.','Je t’appelle demain.','Te elides before appelle.']]
 ],
 vocabulary:[['le','him/it (object m.)','Je le connais.'],['la','her/it (object f.)','Je la vois.'],['les','them (object)','Je les prends.'],['me','me (object)','Tu me vois ?'],['te','you (object)','Je te connais.'],['appeler','to call','Je vais appeler Hugo.'],['chercher','to look for','Je cherche mon billet.'],['voir','to see','Je vois la gare.'],['connaître','to know someone','Je connais ce médecin.'],['la clé','key','Je cherche la clé.'],['le sac','bag','Il prend le sac.'],['le billet','ticket','Je le cherche.']],
 dialogue:[['Mila','Tu as mon billet ? Je le cherche partout.','Do you have my ticket? I am looking everywhere for it.'],['Omar','Non, mais je vois ton sac.','No, but I can see your bag.'],['Mila','Je le prends. Les clés sont dedans ?','I will take it. Are the keys inside?'],['Omar','Oui, je les vois dans le sac.','Yes, I see them in the bag.'],['Mila','Merci ! Je t’appelle ce soir.','Thanks! I will call you tonight.']],
 tasks:[
 ['choice','Replace le billet in Je cherche le billet.','Je le cherche.','The masculine singular object pronoun precedes the verb.',['Je cherche le.','Je le cherche.','Je la cherche.'],'pronouns'],
 ['fill','Tu as la clé ? Oui, je ___ prends.','la','The feminine singular object pronoun is la.',[],'pronouns'],
 ['reading','Where does Omar see the keys?','dans le sac','Omar says he sees the keys in the bag.',['sur la table','dans le sac','à la gare'],'comprehension'],
 ['fill','Tu ___ vois ? (Can you see me?)','me','Me refers back to the speaker as the object.',[],'pronouns'],
 ['choice','Which replaces plural les clés?','Je les vois.','Les is the plural direct object pronoun.',['Je le vois.','Je les vois.','Je la vois.'],'pronouns'],
 ['order','Arrange: le / cherche / Je','Je le cherche','Object pronouns stand before the finite verb.',['cherche','Je','le'],'word order'],
 ['fill','Je t’___ ce soir. (call)','appelle','Te elides before the vowel-initial appelle.',[],'elision'],
 ['reading','What will Mila do in the evening?','appeler Omar','Mila says je t’appelle ce soir to Omar.',['acheter un billet','appeler Omar','chercher les clés'],'comprehension'],
 ['choice','Which le is a pronoun rather than an article?','Je le connais.','Here le stands before the verb and substitutes for an object.',['Le livre est ici.','Je le connais.','Le café est chaud.'],'pronouns'],
 ['fill','Les billets ? Je ___ prends.','les','The plural object pronoun is les.',[],'pronouns']
 ],
 writing:['Write a short exchange about a lost object and replace the object with le, la or les in one reply.', ['Name the object with its article first.','Replace a repeated singular or plural noun correctly.','Place the pronoun before the finite verb.'],'Tu as mon sac ? Non, mais je le vois sur la table. Je le prends maintenant.']
},
{
 id:'a1-22',title:'Invitations and polite replies',goal:'Invite, accept, decline and suggest another time without losing the conversation.',grammarIds:['questions','negation','futur-proche'],
 grammar:[
 ['Inviting with vouloir and pouvoir','Tu veux venir ? is an informal invitation; Est-ce que vous voulez venir ? addresses someone politely. Vouloir is irregular: je veux, tu veux, il veut, nous voulons, vous voulez, ils veulent. Pouvoir is also irregular: je peux, tu peux, il peut, nous pouvons, vous pouvez, ils peuvent.',[['Vous voulez venir dîner ?','Would you like to come for dinner?'],['Je peux venir samedi.','I can come Saturday.']],['Vous veux venir ?','Vous voulez venir ?','Vouloir takes voulez with vous.']],
 ['Responding naturally and proposing a change','Accept with avec plaisir or bonne idée. Decline with merci, mais je ne peux pas …, then offer another day using est-ce que… ? or on peut…. A reply is more helpful when it gives a specific alternative: samedi à quinze heures, not only peut-être.',[['Avec plaisir, merci !','With pleasure, thank you!'],['Je ne peux pas vendredi; on peut se voir samedi ?','I cannot Friday; can we meet Saturday?']],['Je ne peux vendredi.','Je ne peux pas vendredi.','Ne … pas is required in standard written negation.']]
 ],
 vocabulary:[['inviter','to invite','Je vais inviter mes amis.'],['accepter','to accept','J’accepte ton invitation.'],['refuser','to decline','Il refuse poliment.'],['avec plaisir','with pleasure','Avec plaisir, merci !'],['bonne idée','good idea','C’est une bonne idée.'],['je veux','I want','Je veux venir.'],['tu veux','you want','Tu veux sortir ?'],['vous voulez','you want (formal/pl.)','Vous voulez venir ?'],['je peux','I can','Je peux venir.'],['nous pouvons','we can','Nous pouvons sortir.'],['se retrouver','to meet up','On va se retrouver.'],['une invitation','an invitation','Merci pour l’invitation.']],
 dialogue:[['Farah','Tu veux venir déjeuner dimanche ?','Do you want to come for lunch Sunday?'],['Hugo','Merci, mais je ne peux pas dimanche.','Thanks, but I cannot Sunday.'],['Farah','Ah bon ? Tu travailles ?','Really? Are you working?'],['Hugo','Oui, je travaille. On peut se retrouver lundi ?','Yes, I work. Can we meet on Monday?'],['Farah','Lundi à midi ? Avec plaisir !','Monday at noon? With pleasure!']],
 tasks:[
 ['fill','Vous ___ venir samedi ? (want)','voulez','Vouloir with vous is voulez.',[],'vouloir'],
 ['choice','Which reply is a polite acceptance?','Avec plaisir !','Avec plaisir is a friendly, polite way to accept.',['Non, jamais.','Avec plaisir !','Je ne peux pas.'],'register'],
 ['reading','Which day do the friends finally arrange?','lundi','Hugo suggests Monday and Farah accepts.',['vendredi','samedi','lundi'],'comprehension'],
 ['fill','Je ne peux ___ dimanche.','pas','A polite decline uses ne … pas.',[],'negation'],
 ['choice','Choose the correct nous form of pouvoir.','pouvons','Nous pouvons is the present tense of pouvoir.',['pouvez','pouvons','peuvent'],'pouvoir'],
 ['order','Arrange: peux / Je / venir / samedi','Je peux venir samedi','A conjugated pouvoir takes an infinitive after it.',['samedi','venir','Je','peux'],'word order'],
 ['fill','Tu ___ sortir ce soir ? (want)','veux','The familiar tu form of vouloir is veux.',[],'vouloir'],
 ['reading','Why can’t Hugo go to Sunday lunch?','il travaille','Hugo explains that he works on Sunday.',['il voyage','il travaille','il est malade'],'comprehension'],
 ['choice','Which invitation is polite to one unfamiliar adult?','Est-ce que vous voulez venir ?','Vous is the appropriate polite second-person form.',['Tu viens maintenant ?','Est-ce que vous voulez venir ?','Tu veux ou pas ?'],'register'],
 ['fill','On peut se ___ lundi ?','retrouver','After peut, the infinitive se retrouver expresses meeting up.',[],'infinitive']
 ],
 writing:['Write a four-line exchange: invite someone, decline a conflicting time, propose another day and accept.', ['Use vouloir or pouvoir in a question.','Give a polite ne … pas reason.','Propose one exact replacement day and time.'],'Tu veux venir samedi ? Merci, mais je ne peux pas samedi. On peut se retrouver dimanche à midi ? Oui, avec plaisir !']
},
{
 id:'a1-23',title:'Solving small everyday problems',goal:'Ask for practical help at a pharmacy, post office or service desk.',grammarIds:['questions','avoir','negation'],
 grammar:[
 ['Naming a problem and asking for help','Use j’ai un problème or je ne trouve pas … to state a problem simply. To request assistance, vous pouvez m’aider ? or est-ce que vous avez… ? is polite and clear. At a pharmacy, ask a professional for advice rather than treating a memorized phrase as a diagnosis or prescription.',[['J’ai un problème avec ce colis.','I have a problem with this parcel.'],['Est-ce que vous pouvez m’aider ?','Can you help me?']],['Vous aide moi ?','Vous pouvez m’aider ?','Use pouvez plus infinitive with an object pronoun before aider.']],
 ['Useful service phrases and limits','Je voudrais envoyer une lettre is an appropriate post-office request. At a pharmacy, je cherche une pharmacie asks for a place and j’ai mal à la tête describes a symptom, not a medical assessment. Clarify when you do not understand with vous pouvez répéter, s’il vous plaît ?', [['Je voudrais envoyer une lettre.','I would like to send a letter.'],['Vous pouvez répéter plus lentement ?','Could you repeat more slowly?']],['Je voudrais envoyez une lettre.','Je voudrais envoyer une lettre.','After voudrais, use the infinitive envoyer.']]
 ],
 vocabulary:[['la pharmacie','pharmacy','Je cherche la pharmacie.'],['la poste','post office','La poste est fermée.'],['le colis','parcel','J’ai un colis.'],['la lettre','letter','Je veux envoyer une lettre.'],['le timbre','stamp','Il me faut un timbre.'],['envoyer','to send','Je vais envoyer une lettre.'],['un problème','a problem','J’ai un problème.'],['avoir mal à','to have pain in','J’ai mal à la tête.'],['répéter','to repeat','Vous pouvez répéter ?'],['lentement','slowly','Parlez lentement, merci.'],['ouvert','open (m.)','Le magasin est ouvert.'],['fermé','closed (m.)','Le bureau est fermé.']],
 dialogue:[['Cliente','Bonjour, je voudrais envoyer cette lettre.','Hello, I would like to send this letter.'],['Employé','Bien sûr. Vous avez un timbre ?','Of course. Do you have a stamp?'],['Cliente','Non, je n’ai pas de timbre.','No, I do not have a stamp.'],['Employé','Un timbre coûte deux euros.','A stamp costs two euros.'],['Cliente','Pardon, vous pouvez répéter plus lentement ?','Sorry, can you repeat more slowly?']],
 tasks:[
 ['fill','Je voudrais ___ une lettre.','envoyer','After voudrais, use an infinitive to describe what you want to do.',[],'infinitive'],
 ['choice','Which request politely asks for repetition?','Vous pouvez répéter, s’il vous plaît ?','This requests clarification politely.',['Parlez encore !','Vous pouvez répéter, s’il vous plaît ?','Je ne vous comprends jamais.'],'register'],
 ['reading','What item is the client missing?','un timbre','The client says je n’ai pas de timbre.',['une lettre','un timbre','un colis'],'comprehension'],
 ['fill','J’ai un ___ avec ce colis.','problème','Un problème is a clear way to state that something is wrong.',[],'vocabulary'],
 ['choice','Where would you normally mail a letter?','à la poste','La poste is the post office.',['à la pharmacie','à la poste','au parc'],'places'],
 ['order','Arrange: aider / pouvez / Vous / m’','Vous pouvez m’aider','Pouvez is followed by infinitive aider with the elided object pronoun m’.',['m’aider','Vous','pouvez'],'word order'],
 ['fill','Je n’ai pas ___ timbre.','de','After the negative with avoir, un becomes de.',[],'negation'],
 ['reading','How much is one stamp?','deux euros','The employee clearly quotes a price of two euros.',['un euro','deux euros','trois euros'],'comprehension'],
 ['choice','Which describes a symptom, not a location?','J’ai mal à la tête.','Avoir mal à describes pain in a body part.',['Je cherche la poste.','J’ai mal à la tête.','Le bureau est ouvert.'],'meaning'],
 ['fill','Vous pouvez répéter plus ___ ?','lentement','Lentement is the adverb for slowly.',[],'vocabulary']
 ],
 writing:['Write a short service conversation about a missing stamp or package and ask for clarification.', ['State the problem clearly with j’ai or je n’ai pas.','Make one polite request using pouvez.','Ask for repetition if the answer is unclear.'],'Bonjour, je voudrais envoyer cette lettre. Je n’ai pas de timbre. Vous pouvez m’aider et répéter le prix, s’il vous plaît ?']
},
{
 id:'a1-24',title:'A1 capstone — a day in France',goal:'Apply essential A1 patterns across transport, shopping, food and a change of plans.',grammarIds:['questions','articles','negation','futur-proche','avoir'],
 grammar:[
 ['Connecting everyday interactions','A useful A1 exchange usually moves from greeting to purpose, practical question, response and polite closing. Combine familiar patterns rather than translating every English word: bonjour, je voudrais …, combien … ?, est-ce que … ? and merci, au revoir. Choose between tu and vous according to relationship and register.',[['Bonjour, je voudrais un billet pour Lyon.','Hello, I would like a ticket to Lyon.'],['Merci, au revoir !','Thanks, goodbye!']],['Salut, monsieur. Donne billet.','Bonjour, je voudrais un billet, s’il vous plaît.','Use a polite greeting, a conjugated request and please.']],
 ['Making coherent plans when things change','You can connect present facts and near-future intentions without needing advanced tenses: le bus est en retard; je vais prendre le tram. Use et, mais and alors to link causes and consequences. Practice correct negation, time expressions and quantities across complete mini-conversations.',[['Le bus est en retard, alors je vais marcher.','The bus is late, so I am going to walk.'],['Je ne veux pas de café, mais je voudrais de l’eau.','I do not want coffee, but I would like water.']],['Je vais prends le tram.','Je vais prendre le tram.','After the near-future aller, the action verb stays in the infinitive.']]
 ],
 vocabulary:[['alors','so/then','Il pleut, alors je reste.'],['mais','but','Je viens, mais plus tard.'],['parce que','because','Je pars parce que je travaille.'],['d’abord','first','D’abord, je prends le tram.'],['ensuite','then','Ensuite, je vais au marché.'],['enfin','finally','Enfin, je rentre.'],['un billet','a ticket','Je voudrais un billet.'],['en retard','late','Le bus est en retard.'],['une bouteille d’eau','a bottle of water','Je voudrais une bouteille d’eau.'],['le prix','price','Quel est le prix ?'],['la réservation','reservation','J’ai une réservation.'],['à bientôt','see you soon','Merci, à bientôt !']],
 dialogue:[['Nina','Bonjour, est-ce que ce tram va au centre-ville ?','Hello, does this tram go downtown?'],['Agent','Oui, mais il est en retard. Le prochain arrive à neuf heures.','Yes, but it is late. The next arrives at nine.'],['Nina','Alors, je vais acheter du pain au marché.','Then I am going to buy bread at the market.'],['Marchande','Bonjour, vous voulez du pain et une bouteille d’eau ?','Hello, would you like bread and a bottle of water?'],['Nina','Oui, merci. Combien ça coûte ?','Yes, thank you. How much does it cost?']],
 tasks:[
 ['fill','Je vais ___ le tram. (take)','prendre','After aller, the action verb remains in the infinitive.',[],'futur proche'],
 ['choice','Which is a suitable formal question?','Est-ce que ce tram va au centre-ville ?','This question uses est-ce que and normal word order.',['Tu dis centre-ville ?','Est-ce que ce tram va au centre-ville ?','Tram centre ?'],'questions'],
 ['reading','Why does Nina have time for the market?','le tram est en retard','The agent says the tram is delayed.',['elle a oublié son billet','le tram est en retard','elle cherche la poste'],'comprehension'],
 ['fill','Je voudrais une bouteille ___ eau.','d’','Before eau, the quantity construction de elides to d’.',[],'quantity'],
 ['choice','Which phrase correctly asks a price?','Combien ça coûte ?','This is a common, complete price question.',['Combien de coûte ?','Quel temps fait-il ?','Combien ça coûte ?'],'questions'],
 ['order','Arrange: acheter / vais / Je / du pain','Je vais acheter du pain','A near-future action uses vais followed by an infinitive.',['du pain','acheter','Je','vais'],'word order'],
 ['fill','Le bus est en ___.','retard','Être en retard means to be late.',[],'transport'],
 ['reading','At what time does the next tram arrive?','neuf heures','The agent states le prochain arrive à neuf heures.',['huit heures','neuf heures','dix heures'],'comprehension'],
 ['choice','Which is correct after simple negative vouloir?','Je ne veux pas de café.','De replaces the partitive after an ordinary negative.',['Je ne veux pas du café.','Je ne veux pas de café.','Je veux ne pas café.'],'negation'],
 ['fill','Bonjour, je ___ un billet. (polite request)','voudrais','Je voudrais expresses a polite purchase request.',[],'politeness']
 ],
 writing:['Write six sentences about a day in a new French town: transport, shopping, food and changing a plan.', ['Use at least one polite question and a price question.','Include a near-future statement and a negative form.','Link the activities with d’abord, ensuite, mais or alors.'],'D’abord, je prends le tram. Le tram est en retard, alors je vais marcher. Je vais au marché. Je voudrais du pain et de l’eau. Combien ça coûte ? Enfin, je vais visiter le musée.']
}
];
export const A1_UNITS_21_24=Object.freeze(authored.map((spec,index)=>authorA1Unit(spec,index+21)));
