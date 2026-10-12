import {authorA1Unit,type A1AuthoredSpec} from './u6-a1-model.ts';
const authored:A1AuthoredSpec[]=[
{
 id:'a1-05',title:'What do you do? Regular -er verbs',goal:'Talk about study, work and everyday actions in the present tense.',grammarIds:[],
 grammar:[
 ['Forming the regular -er present','Most verbs ending in -er, such as parler and travailler, follow a pattern: remove -er and add -e, -es, -e, -ons, -ez, -ent for je, tu, il/elle/on, nous, vous, ils/elles. The final -ent is generally silent; the written endings still matter.',[['Je travaille à Paris.','I work in Paris.'],['Vous parlez français.','You speak French.']],['Nous parle français.','Nous parlons français.','Nous takes -ons with regular -er verbs.']],
 ['Using verbs in real sentences','In an ordinary affirmative sentence, place the subject before the conjugated verb, then add an object, place or time expression. With je before a vowel-initial verb, use j’: j’habite. Questions and negation will build on this basic pattern.',[['J’habite à Nantes.','I live in Nantes.'],['Elle étudie le français le soir.','She studies French in the evening.']],['Je habite ici.','J’habite ici.','Je elides before a vowel-initial verb.']]
 ],
 vocabulary:[['parler','to speak','Je parle français.'],['travailler','to work','Nous travaillons demain.'],['étudier','to study','Elle étudie à Paris.'],['habiter','to live/reside','J’habite en France.'],['aimer','to like','Tu aimes le café ?'],['écouter','to listen','J’écoute la radio.'],['regarder','to watch','Il regarde un film.'],['chercher','to look for','Je cherche un livre.'],['parle','speak (je/il)','Je parle anglais.'],['parlons','speak (nous)','Nous parlons ensemble.'],['travaillez','work (vous)','Vous travaillez ici ?'],['ensemble','together','Nous étudions ensemble.']],
 dialogue:[['Emma','Tu étudies le français ?','Do you study French?'],['Mehdi','Oui, j’étudie le matin et je travaille le soir.','Yes, I study in the morning and work in the evening.'],['Emma','Tu habites près de l’université ?','Do you live near the university?'],['Mehdi','Oui, j’habite ici. Et toi, tu travailles ?','Yes, I live here. And you, do you work?'],['Emma','Non, je cherche un travail.','No, I am looking for a job.']],
 tasks:[
 ['fill','Je ___ français. (parler)','parle','Drop -er and add -e for je in the present.',[],'-er endings'],
 ['choice','Choose the form for nous + travailler.','travaillons','The regular -er ending for nous is -ons.',['travaillez','travaillons','travaillent'],'-er endings'],
 ['reading','When does Mehdi study?','le matin','Mehdi says j’étudie le matin.',['le soir','le matin','la nuit'],'comprehension'],
 ['fill','Vous ___ ici ? (habiter)','habitez','The regular -er ending for vous is -ez.',[],'-er endings'],
 ['choice','Which statement is written correctly?','J’habite à Lille.','Je elides before the vowel of habite.',['Je habite à Lille.','J’habite à Lille.','J’habitons à Lille.'],'elision'],
 ['fill','Ils ___ un film. (regarder)','regardent','The ils ending is -ent, normally silent in speech.',[],'-er endings'],
 ['order','Arrange: le soir / travaille / Je','Je travaille le soir','An affirmative sentence uses subject then finite verb.',['le soir','Je','travaille'],'syntax'],
 ['reading','What is Emma looking for?','un travail','Emma says je cherche un travail.',['un livre','un vélo','un travail'],'comprehension'],
 ['choice','Choose the form for tu + aimer.','aimes','The -er ending for tu is -es.',['aime','aimes','aimons'],'-er endings'],
 ['fill','Nous ___ le français ensemble. (étudier)','étudions','Remove -er and add -ons to étudier, producing étudions.',[],'-er endings']
 ],
 writing:['Write about what you study, where you live and what a friend does.', ['Use at least three regular -er verbs.','Conjugate correctly for je and il/elle.','Add one time or place expression.'],'J’étudie le français. J’habite à Tours. Mon ami travaille le soir.']
},
{
 id:'a1-06',title:'Asking good questions',goal:'Ask yes/no and information questions in a polite everyday conversation.',grammarIds:['questions'],
 grammar:[
 ['Three practical ways to ask','For yes/no questions you can use rising intonation (Tu travailles ?), est-ce que + statement order (Est-ce que tu travailles ?) or more formal inversion (Travaillez-vous ?). At A1, est-ce que is especially reliable. The form becomes est-ce qu’ before a vowel.',[['Est-ce que vous êtes libre ?','Are you available?'],['Tu parles français ?','Do you speak French?']],['Est-ce que parles tu français ?','Est-ce que tu parles français ?','After est-ce que, use normal subject–verb order.']],
 ['Information questions','Use où (where), quand (when), comment (how), pourquoi (why), qui (who) and combien (how much/many). You can place the question word first with est-ce que or use common spoken forms such as Tu habites où ? Keep the question mark.',[['Où est-ce que tu habites ?','Where do you live?'],['Combien ça coûte ?','How much does that cost?']],['Ou est la gare ?','Où est la gare ?','Où needs an accent to mean where.']]
 ],
 vocabulary:[['où','where','Où est le musée ?'],['quand','when','Quand tu arrives ?'],['comment','how','Comment tu vas ?'],['pourquoi','why','Pourquoi tu pars ?'],['qui','who','Qui est là ?'],['combien','how much/many','Combien de livres ?'],['quel','which/what (m.)','Quel jour ?'],['quelle','which/what (f.)','Quelle heure ?'],['est-ce que','question marker','Est-ce que tu viens ?'],['qu’est-ce que','what (question)','Qu’est-ce que tu fais ?'],['répondre','to answer','Tu réponds à la question.'],['question','question','J’ai une question.']],
 dialogue:[['Zoé','Excusez-moi, où est la bibliothèque ?','Excuse me, where is the library?'],['Agent','Elle est près de la gare.','It is near the station.'],['Zoé','Est-ce que la bibliothèque est ouverte ?','Is the library open?'],['Agent','Oui, elle est ouverte jusqu’à dix-huit heures.','Yes, it is open until six in the evening.'],['Zoé','Merci ! Et combien coûte la carte ?','Thanks! And how much does the card cost?']],
 tasks:[
 ['fill','Est-ce ___ tu étudies ici ?','que','Use est-ce que before subject and verb.',[],'questions'],
 ['choice','Which word asks about location?','où','Où is used to ask where something is.',['quand','où','pourquoi'],'question words'],
 ['reading','Where is the library?','près de la gare','The agent says it is near the station.',['près de la gare','dans le parc','près du café'],'comprehension'],
 ['fill','___ tu t’appelles ? (How)','Comment','Comment introduces a question about how or manner.',[],'question words'],
 ['choice','Which is the correctly ordered question?','Est-ce que vous êtes libre ?','Normal word order follows est-ce que.',['Est-ce que êtes vous libre ?','Est-ce que vous êtes libre ?','Est-ce que libre êtes vous ?'],'word order'],
 ['fill','___ coûte ce livre ? (How much)','Combien','Combien expresses quantity or price.',[],'question words'],
 ['order','Arrange: tu / où / habites / ?','Tu habites où ?','Spoken French often puts où at the end of the question.',['où','Tu','?','habites'],'syntax'],
 ['reading','What is Zoé asking about at the end?','la carte','Zoé asks about the price of the card.',['le musée','la carte','le train'],'comprehension'],
 ['choice','Choose the feminine form of “which” before heure.','quelle','Heure is feminine, so use quelle.',['quel','quelle','quels'],'agreement'],
 ['fill','Est-ce ___ il arrive à huit heures ?','qu’','Use qu’ before the vowel in il after est-ce.',[],'elision']
 ],
 writing:['Write three questions for a librarian: one about location, one about opening hours and one about price.', ['Use where/when/how much appropriately.','Include an est-ce que question.','Check question marks and normal word order.'],'Où est la bibliothèque ? Est-ce qu’elle est ouverte demain ? Combien coûte la carte ?']
},
{
 id:'a1-07',title:'Saying no and explaining preferences',goal:'Use ne … pas correctly and express simple positive and negative preferences.',grammarIds:['negation'],
 grammar:[
 ['Placing the negative','In standard written French, ne stands directly before the conjugated verb and pas immediately after it: je ne parle pas. Before a vowel sound, ne becomes n’: je n’aime pas. Even if familiar speech sometimes drops ne, learn both written parts first.',[['Je ne travaille pas le dimanche.','I do not work on Sundays.'],['Elle n’aime pas le thé.','She does not like tea.']],['Je pas parle français.','Je ne parle pas français.','Ne and pas surround the finite verb.']],
 ['Negation with nouns and preferences','After a basic negative with avoir, un/une/des often becomes de or d’: je n’ai pas de voiture. But with aimer, definite articles commonly stay: je n’aime pas les olives. Do not automatically remove le/la/les after every negative sentence.',[['Je n’ai pas de sœur.','I do not have a sister.'],['Nous n’aimons pas les films longs.','We do not like long films.']],['Je n’ai pas un stylo.','Je n’ai pas de stylo.','In a plain negative possession statement, un typically becomes de.']]
 ],
 vocabulary:[['ne … pas','not','Je ne fume pas.'],['n’… pas','not (before vowel)','Je n’aime pas.'],['jamais','never','Je ne travaille jamais ici.'],['oui','yes','Oui, merci.'],['non','no','Non, désolé.'],['mais','but','Oui, mais demain.'],['aimer','to like','Elle aime la musique.'],['détester','to hate/dislike strongly','Je déteste le bruit.'],['préférer','to prefer','Je préfère le café.'],['viande','meat','Je mange de la viande.'],['olives','olives','Je n’aime pas les olives.'],['voiture','car','Nous n’avons pas de voiture.']],
 dialogue:[['Adam','Tu aimes le café ?','Do you like coffee?'],['Lina','Non, je n’aime pas le café. Je préfère le thé.','No, I do not like coffee. I prefer tea.'],['Adam','Tu as du sucre ?','Do you have sugar?'],['Lina','Non, je n’ai pas de sucre, mais j’ai du miel.','No, I do not have sugar, but I have honey.'],['Adam','D’accord, je prends un thé aussi.','Okay, I will have tea too.']],
 tasks:[
 ['fill','Je ne parle ___ anglais.','pas','Pas follows the conjugated verb in a simple negative.',[],'negation'],
 ['choice','Which is correctly negative?','Je n’aime pas les olives.','The vowel in aime requires n’ rather than ne.',['Je ne aime pas les olives.','Je pas aime les olives.','Je n’aime pas les olives.'],'elision'],
 ['reading','What does Lina prefer?','le thé','Lina says je préfère le thé.',['le café','le thé','le lait'],'comprehension'],
 ['fill','Je n’ai pas ___ voiture.','de','Under ordinary negative possession, une becomes de.',[],'negation'],
 ['choice','After je n’aime pas, which article suits olives?','les','Aimer keeps the definite article with general preferences.',['des','de','les'],'articles'],
 ['fill','Elle ___ travaille pas ici.','ne','Ne precedes the consonant-initial verb travaille.',[],'negation'],
 ['order','Arrange: pas / Je / ne / travaille','Je ne travaille pas','Ne precedes travaille and pas follows it.',['pas','Je','travaille','ne'],'word order'],
 ['reading','What does Lina have instead of sugar?','du miel','Lina says mais j’ai du miel.',['du lait','du miel','du sucre'],'comprehension'],
 ['choice','Which expresses a positive preference?','Je préfère le thé.','Préférer expresses what someone likes better.',['Je ne travaille pas.','Je préfère le thé.','Je n’ai pas de voiture.'],'meaning'],
 ['fill','Nous n’___ pas le café. (aimer)','aimons','With nous, aimer becomes aimons, inside n’ … pas.',[],'conjugation']
 ],
 writing:['Write a short food conversation: what you like, what you dislike and something you do not have.', ['Use one affirmative preference.','Use ne/n’ … pas twice correctly.','After negative avoir, check whether de is needed.'],'J’aime le thé, mais je n’aime pas le café. Je n’ai pas de sucre.']
},
{
 id:'a1-08',title:'Describe people and everyday objects',goal:'Use basic adjective agreement and position in descriptions.',grammarIds:['articles','etre'],
 grammar:[
 ['Gender and number agreement','Many adjectives add -e for the feminine, -s for the plural and -es for feminine plural. For example petit, petite, petits, petites. Some already end in -e and do not add another e. Irregular forms such as beau/belle must be learned as pairs.',[['Un livre vert.','A green book.'],['Des maisons vertes.','Green houses.']],['Une maison vert.','Une maison verte.','Verte agrees with feminine maison.']],
 ['Position and complete descriptions','Many descriptive adjectives appear after the noun: une voiture rouge. Some common adjectives such as petit, grand, beau and joli often come before it: un petit café. When describing something with être, the adjective still agrees with the subject.',[['C’est une petite chambre.','It is a small bedroom.'],['Les fenêtres sont ouvertes.','The windows are open.']],['Les portes sont ouvert.','Les portes sont ouvertes.','Feminine plural portes needs ouvertes.']]
 ],
 vocabulary:[['petit','small (m.)','Un petit chat.'],['petite','small (f.)','Une petite maison.'],['grand','big/tall (m.)','Un grand parc.'],['grande','big/tall (f.)','Une grande rue.'],['rouge','red','Une voiture rouge.'],['vert','green (m.)','Un sac vert.'],['verte','green (f.)','Une table verte.'],['bleu','blue (m.)','Un cahier bleu.'],['belle','beautiful (f.)','Une belle ville.'],['jeune','young','Une jeune personne.'],['vieux','old (m.)','Un vieux livre.'],['nouveau','new (m.)','Un nouveau cours.']],
 dialogue:[['Maya','Tu aimes cette petite maison ?','Do you like this small house?'],['Louis','Oui, les fenêtres sont grandes et la porte est bleue.','Yes, the windows are big and the door is blue.'],['Maya','Et le salon ?','And the living room?'],['Louis','Il est lumineux, avec une grande table verte.','It is bright, with a big green table.'],['Maya','C’est une belle maison !','It is a beautiful house!']],
 tasks:[
 ['fill','Une maison ___ (vert)','verte','Add -e to vert with a feminine singular noun.',[],'agreement'],
 ['choice','Which phrase is feminine plural?','des petites maisons','Petites agrees with plural feminine maisons.',['des petits maisons','des petites maisons','une petites maison'],'agreement'],
 ['reading','What color is the door?','bleue','Louis says la porte est bleue.',['verte','rouge','bleue'],'comprehension'],
 ['fill','Les fenêtres sont ___ (grand).','grandes','Feminine plural adds -es to grand.',[],'agreement'],
 ['choice','Which adjective order is usual?','une petite chambre','Petit often precedes the noun.',['une chambre petite','une petite chambre','une petit chambre'],'word order'],
 ['fill','Un cahier ___ (bleu)','bleu','The masculine singular form is bleu.',[],'agreement'],
 ['order','Arrange: sont / ouvertes / portes / Les','Les portes sont ouvertes','The adjective ouvertes agrees with the feminine plural subject.',['ouvertes','Les','sont','portes'],'syntax'],
 ['reading','What is the table like?','grande et verte','Louis describes une grande table verte.',['petite et rouge','grande et verte','bleue et petite'],'comprehension'],
 ['choice','Which phrase is correct?','une belle ville','Belle is the feminine form of beau.',['une beau ville','une belle ville','un belle ville'],'agreement'],
 ['fill','Elles sont ___ (petit).','petites','Elles is feminine plural, so use petites.',[],'agreement']
 ],
 writing:['Describe one room and two people or objects using four adjectives.', ['Include at least one feminine and one plural agreement.','Place common adjectives before or after nouns appropriately.','Use être for one complete description.'],'La chambre est grande. Les fenêtres sont ouvertes. Il y a une petite table verte.']
}
];
export const A1_UNITS_05_08=Object.freeze(authored.map((spec,index)=>authorA1Unit(spec,index+5)));
