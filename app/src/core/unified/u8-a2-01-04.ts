import {authorA2Unit} from './u8-a2-model.ts';
import type {A1AuthoredSpec} from './u6-a1-model.ts';
const authored:A1AuthoredSpec[]=[
{
 id:'a2-01',title:'Yesterday: passé composé with avoir',goal:'Report completed everyday actions with present avoir and regular past participles.',grammarIds:['passe-compose','avoir'],
 grammar:[
 ['The two-part past tense','Most completed actions at this level use passé composé: present avoir plus a past participle. For regular -er verbs, remove -er and add -é: parler → parlé, manger → mangé. For regular -ir verbs such as finir, the participle ends in -i; for vendre it ends in -u. The auxiliary changes with the subject, not with the action.',[['J’ai étudié hier.','I studied yesterday.'],['Nous avons fini le travail.','We finished the work.']],['Je suis regardé un film.','J’ai regardé un film.','Regarder takes the auxiliary avoir here, not être.']],
 ['Temporal anchors and negative past','Use hier, samedi dernier and ce matin to place a completed event. In standard negation, ne ... pas wraps the conjugated auxiliary: je n’ai pas travaillé, not the participle. With avoir, past participles normally do not agree with the subject; object-before agreement is a later exception.',[['Elle a joué samedi.','She played on Saturday.'],['Nous n’avons pas visité le musée.','We did not visit the museum.']],['Nous avons pas visité.','Nous n’avons pas visité.','Put ne before avons and pas after the auxiliary.']]
 ],
 vocabulary:[['hier','yesterday','Hier, j’ai travaillé.'],['avant-hier','day before yesterday','Avant-hier, j’ai lu.'],['dernier','last (masculine)','Samedi dernier, il a plu.'],['terminé','finished','Nous avons terminé le repas.'],['regardé','watched','Elle a regardé un film.'],['écouté','listened','Tu as écouté la radio.'],['visité','visited','J’ai visité le musée.'],['acheté','bought','Il a acheté du pain.'],['fini','finished','Nous avons fini tôt.'],['vendu','sold','Elle a vendu son vélo.'],['un souvenir','a memory','J’ai un bon souvenir.'],['un événement','an event','Cet événement a commencé hier.']],
 dialogue:[['Jade','Qu’est-ce que tu as fait hier soir ?','What did you do last night?'],['Émile','J’ai préparé le dîner et j’ai regardé un film.','I cooked dinner and watched a film.'],['Jade','Tu as aimé le film ?','Did you like the film?'],['Émile','Oui, mais je n’ai pas fini le film : j’ai dormi !','Yes, but I did not finish the film: I fell asleep!'],['Jade','Moi, j’ai étudié jusqu’à dix heures.','I studied until ten.']],
 tasks:[
 ['fill','Hier, j’___ préparé le dîner.','ai','Use the present auxiliary ai before a completed action.',[],'avoir auxiliary'],
 ['choice','Choose the past participle of parler.','parlé','Regular -er participles end in -é.',['parlais','parlé','parler'],'participle'],
 ['reading','Why did Émile not finish the film?','il a dormi','He explains that he fell asleep before the film ended.',['il a travaillé','il a dormi','il a étudié'],'comprehension'],
 ['fill','Nous avons ___ le repas. (finir)','fini','For a regular -ir verb such as finir, the participle is fini.',[],'participle'],
 ['choice','Choose the correct negative past.','Je n’ai pas regardé.','Ne and pas surround the finite auxiliary ai.',['Je ne pas ai regardé.','Je n’ai pas regardé.','Je ai ne regardé pas.'],'negation'],
 ['order','Arrange: le dîner / préparé / J’ai','J’ai préparé le dîner','The auxiliary precedes the participle before the object.',['préparé','le dîner','J’ai'],'word order'],
 ['fill','Elle a ___ son vélo. (vendre)','vendu','Vendre has the regular -re participle vendu.',[],'participle'],
 ['reading','Until when did Jade study?','dix heures','Jade says she studied until ten o’clock.',['huit heures','neuf heures','dix heures'],'comprehension'],
 ['choice','Which auxiliary belongs with nous + regarder?','avons','Nous avons regardé uses present avoir.',['sommes','avons','êtes'],'auxiliary'],
 ['fill','Je n’___ pas travaillé hier.','ai','The elided negative precedes ai in je n’ai pas travaillé.',[],'negation']
 ],
 writing:['Write a six-sentence account of yesterday evening with at least three completed actions and one negative.', ['Use avoir and an appropriate participle for each verb.','Include one time marker and sequence the events.','Place ne ... pas around the auxiliary, not the participle.'],'Hier, j’ai préparé le dîner. Ensuite, j’ai téléphoné à mon ami. Nous avons parlé longtemps. Je n’ai pas regardé la télévision. J’ai terminé mes devoirs. Enfin, j’ai dormi.']
},
{
 id:'a2-02',title:'Irregular past participles and real experiences',goal:'Recognize frequent irregular participles and recount what you did or learned.',grammarIds:['passe-compose','avoir'],
 grammar:[
 ['High-frequency irregular participles','Not every verb makes a participle with -é, -i or -u. Learn irregular forms as units: faire → fait, avoir → eu, être → été, voir → vu, lire → lu, écrire → écrit, prendre → pris and boire → bu. With these verbs in a simple affirmative passé composé, the auxiliary is avoir.',[['J’ai lu ce livre.','I read this book.'],['Nous avons pris le train.','We took the train.']],['J’ai fais du sport.','J’ai fait du sport.','Faire has the past participle fait, never fais in this tense.']],
 ['Questions about past experiences','Ask Qu’est-ce que tu as fait ? or Est-ce que tu as vu ... ? using the auxiliary before the participle. Short affirmative and negative answers often repeat the auxiliary: oui, j’ai vu ... ; non, je n’ai pas vu ... . Use ensuite, après and finalement to describe a sequence of experiences.',[['Est-ce que vous avez vu le marché ?','Did you see the market?'],['Je n’ai pas écrit de message.','I did not write a message.']],['Tu as écrivé une lettre ?','Tu as écrit une lettre ?','The irregular participle of écrire is écrit.']]
 ],
 vocabulary:[['fait','done/made','Nous avons fait du sport.'],['eu','had','J’ai eu une idée.'],['été','been','Elle a été malade.'],['vu','seen','Nous avons vu la mer.'],['lu','read','J’ai lu une histoire.'],['écrit','written','Il a écrit un courriel.'],['pris','taken','Ils ont pris le train.'],['bu','drunk','J’ai bu du thé.'],['appris','learned','Nous avons appris trois mots.'],['compris','understood','Tu as compris la question.'],['une expérience','an experience','C’était une expérience utile.'],['finalement','finally','Finalement, nous avons trouvé le café.']],
 dialogue:[['Salomé','Tu as fait quoi pendant le week-end ?','What did you do over the weekend?'],['Paul','J’ai pris le train et j’ai vu la mer.','I took the train and saw the sea.'],['Salomé','Tu as lu ton livre dans le train ?','Did you read your book on the train?'],['Paul','Oui, j’ai lu trois chapitres et j’ai écrit à ma sœur.','Yes, I read three chapters and wrote to my sister.'],['Salomé','Super ! Moi, j’ai appris une nouvelle recette.','Great! I learned a new recipe.']],
 tasks:[
 ['fill','J’ai ___ du sport. (faire)','fait','The irregular participle of faire is fait.',[],'irregular participle'],
 ['choice','Choose the participle of prendre.','pris','Prendre becomes pris with the auxiliary avoir.',['prendu','prenant','pris'],'irregular participle'],
 ['reading','What did Paul see during his journey?','la mer','Paul says he saw the sea after taking the train.',['la montagne','la mer','le musée'],'comprehension'],
 ['fill','Nous avons ___ ce livre. (lire)','lu','Lire has the past participle lu.',[],'irregular participle'],
 ['choice','Which sentence has a correct past form?','Elle a écrit une lettre.','Écrire has participle écrit, not écrivé.',['Elle a écrivé une lettre.','Elle a écrit une lettre.','Elle est écrit une lettre.'],'auxiliary and participle'],
 ['order','Arrange: le train / Nous avons / pris','Nous avons pris le train','The participle pris follows avons before its object.',['pris','le train','Nous avons'],'word order'],
 ['fill','Il a ___ de l’eau. (boire)','bu','Boire becomes bu in passé composé.',[],'irregular participle'],
 ['reading','How many chapters did Paul read?','trois','Paul mentions three chapters in the train.',['deux','trois','quatre'],'comprehension'],
 ['choice','Which participle means learned?','appris','Apprendre forms the participle appris.',['apprenu','appris','apprend'],'irregular participle'],
 ['fill','Tu as ___ la question ? (comprendre)','compris','Comprendre forms its past participle with -pris.',[],'irregular participle']
 ],
 writing:['Describe a trip or weekend with at least four different irregular participles and one question.', ['Use fait, vu, pris, lu, écrit or another verified irregular form.','Retain auxiliary avoir for these verbs in the examples taught.','Ask one friend about an experience with est-ce que.'],'Samedi, j’ai pris le train. J’ai vu la mer et j’ai fait une promenade. J’ai lu un chapitre. Ensuite, j’ai écrit à mon frère. Est-ce que tu as vu la mer aussi ?']
},
{
 id:'a2-03',title:'Going somewhere: passé composé with être',goal:'Tell a journey in the past and agree the participle with the subject.',grammarIds:['passe-compose','etre'],
 grammar:[
 ['Selected movement and change-of-state verbs','Several intransitive verbs form passé composé with present être, including aller → allé, venir → venu, arriver → arrivé, partir → parti, entrer → entré, sortir → sorti, tomber → tombé and rester → resté. Many other movement verbs still use avoir, so meaning alone cannot determine the auxiliary.',[['Elle est arrivée à Lyon.','She arrived in Lyon.'],['Nous sommes partis tôt.','We left early.']],['Elle a arrivée à Lyon.','Elle est arrivée à Lyon.','Intransitive arriver selects être as auxiliary.']],
 ['Subject agreement after être','With être, the past participle generally agrees with its subject: il est parti, elle est partie, ils sont partis, elles sont parties. Add -e for feminine, -s for plural and -es for feminine plural where the form permits it. The auxiliary itself still matches the subject: nous sommes, vous êtes.',[['Mes amies sont venues hier.','My female friends came yesterday.'],['Je suis restée à la maison.','I stayed at home (female speaker).']],['Elles sont parti.','Elles sont parties.','The feminine plural subject requires -es on parties.']]
 ],
 vocabulary:[['arrivé','arrived (m.)','Il est arrivé hier.'],['arrivée','arrived (f.)','Elle est arrivée tôt.'],['parti','left (m.)','Il est parti.'],['partie','left (f.)','Elle est partie.'],['allé','gone (m.)','Je suis allé au parc.'],['venue','come (f.)','Elle est venue samedi.'],['entré','entered (m.)','Il est entré dans la gare.'],['sorti','gone out (m.)','Nous sommes sortis.'],['resté','stayed (m.)','Il est resté ici.'],['tombée','fallen (f.)','Elle est tombée.'],['le départ','departure','Notre départ est à midi.'],['l’arrivée','arrival','L’arrivée a été tardive.']],
 dialogue:[['Zoé','À quelle heure vous êtes arrivés à Nantes ?','At what time did you arrive in Nantes?'],['Karim','Nous sommes arrivés vers midi.','We arrived around noon.'],['Zoé','Et ta sœur, elle est venue avec vous ?','And your sister, did she come with you?'],['Karim','Non, elle est restée à Paris, puis elle est partie lundi.','No, she stayed in Paris, then she left Monday.'],['Zoé','Moi, je suis rentrée tard hier soir.','I got home late last night (female speaker).']],
 tasks:[
 ['fill','Elle ___ arrivée à midi.','est','Arriver as an intransitive verb takes être in passé composé.',[],'être auxiliary'],
 ['choice','Choose the correct feminine singular past.','Elle est partie.','Partie agrees with the feminine subject elle.',['Elle a parti.','Elle est parti.','Elle est partie.'],'agreement'],
 ['reading','Where did Karim’s sister stay initially?','à Paris','Karim says she stayed in Paris before leaving.',['à Nantes','à Paris','à Lille'],'comprehension'],
 ['fill','Ils sont ___ tôt. (partir)','partis','With plural masculine ils, add -s to parti.',[],'agreement'],
 ['choice','Which sentence is correctly plural feminine?','Elles sont arrivées.','Arrivées adds -es after être with elles.',['Elles ont arrivée.','Elles sont arrivés.','Elles sont arrivées.'],'agreement'],
 ['order','Arrange: à Lyon / est / Elle / arrivée','Elle est arrivée à Lyon','The auxiliary est precedes the feminine participle arrivée.',['arrivée','Elle','à Lyon','est'],'word order'],
 ['fill','Nous ___ entrés dans la gare.','sommes','Nous sommes is the required present être auxiliary.',[],'être auxiliary'],
 ['reading','When did Karim’s sister leave?','lundi','Karim says elle est partie lundi.',['dimanche','lundi','mardi'],'comprehension'],
 ['choice','Which common verb here takes être in the past?','venir','Intransitive venir selects être rather than avoir.',['regarder','manger','venir'],'auxiliary'],
 ['fill','Mes amies sont ___ hier. (venir)','venues','The female plural subject amies requires venues.',[],'agreement']
 ],
 writing:['Tell a past journey using at least four verbs with être and correct agreement for two different subjects.', ['Use appropriate present forms of être as auxiliary.','Include both a feminine and plural subject.','Describe an arrival and a departure in chronological order.'],'Samedi, nous sommes partis tôt. Ma sœur est venue avec nous. Nous sommes arrivés à Nantes à midi. Mes amies sont arrivées plus tard. Enfin, elles sont reparties lundi.']
},
{
 id:'a2-04',title:'Reflexive verbs in the past',goal:'Explain yesterday’s routine using être and reflexive pronouns with careful agreement.',grammarIds:['passe-compose','etre'],
 grammar:[
 ['Building the pronominal past','Reflexive verbs use a reflexive pronoun before the auxiliary être in passé composé: je me suis levé, tu t’es habillé, nous nous sommes couchés. The sequence is subject + reflexive pronoun + être + past participle, not je suis me levé. With standard negation, ne comes before the reflexive pronoun and pas after être.',[['Elle s’est réveillée à sept heures.','She woke up at seven.'],['Nous nous sommes couchés tard.','We went to bed late.']],['Elle a se levé.','Elle s’est levée.','The reflexive pronoun precedes être and levée agrees here with elle.']],
 ['Agreement and an important exception','Many common reflexive routine verbs agree with the subject: elles se sont habillées. But when the reflexive pronoun is an indirect object, there is no automatic subject agreement: elles se sont parlé. With a following direct object, agreement may also change, as in elle s’est lavé les mains. Treat the basic routine examples separately from these exceptions.',[['Elles se sont préparées rapidement.','They got ready quickly (female group).'],['Elles se sont parlé hier.','They spoke to each other yesterday.']],['Elles se sont parlées.','Elles se sont parlé.','Se is indirect with parler à, so parlé does not agree with elles.']]
 ],
 vocabulary:[['se réveiller','to wake up','Je me suis réveillé tôt.'],['se lever','to get up','Elle s’est levée.'],['se laver','to wash','Il s’est lavé.'],['s’habiller','to get dressed','Nous nous sommes habillés.'],['se préparer','to get ready','Je me suis préparée.'],['se coucher','to go to bed','Ils se sont couchés tard.'],['se dépêcher','to hurry','Elle s’est dépêchée.'],['se promener','to walk/stroll','Nous nous sommes promenés.'],['se retrouver','to meet up','Ils se sont retrouvés.'],['se parler','to talk to each other','Elles se sont parlé.'],['le réveil','alarm clock','Le réveil a sonné.'],['le matin','morning','Le matin, je me prépare.']],
 dialogue:[['Amine','Comment s’est passée ta matinée ?','How did your morning go?'],['Nora','Je me suis réveillée tard et je me suis dépêchée.','I woke up late and hurried.'],['Amine','Tu t’es habillée rapidement ?','Did you get dressed quickly?'],['Nora','Oui, puis je me suis lavé les mains et je suis sortie.','Yes, then I washed my hands and went out.'],['Amine','Moi, je me suis couché très tard hier soir.','I went to bed very late yesterday.']],
 tasks:[
 ['fill','Elle s’___ levée à sept heures.','est','The auxiliary for reflexive verbs is être.',[],'reflexive auxiliary'],
 ['choice','Choose the correct feminine routine sentence.','Elle s’est réveillée.','Réveillée agrees with the female subject in this reflexive use.',['Elle a se réveillé.','Elle s’est réveillée.','Elle est se réveillée.'],'reflexive agreement'],
 ['reading','Why did Nora hurry?','elle s’est réveillée tard','She says she woke up late and hurried afterward.',['elle a perdu le train','elle s’est réveillée tard','elle était malade'],'comprehension'],
 ['fill','Nous nous sommes ___ tard. (coucher; mixed group)','couchés','A mixed or masculine plural group takes couchés.',[],'agreement'],
 ['choice','Which construction has NO subject agreement here?','Elles se sont parlé.','Se is an indirect object with parler à in this sentence.',['Elles se sont parlées.','Elles se sont parlé.','Elles sont parlé.'],'indirect reflexive'],
 ['order','Arrange: préparée / Je me suis / rapidement','Je me suis préparée rapidement','The subject and reflexive pronoun precede être and the participle.',['rapidement','préparée','Je me suis'],'word order'],
 ['fill','Je ne me ___ pas levé tôt.','suis','Negation surrounds me suis: ne me suis pas levé.',[],'negative reflexive'],
 ['reading','What does Nora wash before leaving?','les mains','Nora says je me suis lavé les mains.',['le visage','les mains','les cheveux'],'comprehension'],
 ['choice','Choose the correct pronoun with tu.','tu t’es','Tu t’es combines the elided reflexive te with être.',['tu me suis','tu t’as','tu t’es'],'reflexive pronoun'],
 ['fill','Elles se sont ___ rapidement. (préparer)','préparées','Reflexive préparées agrees with a feminine plural subject here.',[],'agreement']
 ],
 writing:['Describe yesterday morning with five reflexive actions, one negative and at least one feminine agreement.', ['Place the reflexive pronoun correctly before être.','Use ne … pas around the auxiliary for the negative.','Distinguish a routine agreement from an exceptional direct-object example.'],'Hier, je me suis réveillée à sept heures. Je me suis levée, puis je me suis préparée. Je ne me suis pas dépêchée. Ensuite, je me suis lavé les mains et je suis sortie.']
}
];
export const A2_UNITS_01_04=Object.freeze(authored.map((spec,i)=>authorA2Unit(spec,i+1)));
