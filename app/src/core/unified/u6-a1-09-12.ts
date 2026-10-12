import {authorA1Unit,type A1AuthoredSpec} from './u6-a1-model.ts';
const authored:A1AuthoredSpec[]=[
{
 id:'a1-09',title:'Where is it? Places and directions',goal:'Describe location and request simple directions with à, dans, sur and près de.',grammarIds:['questions','articles'],
 grammar:[
 ['Locating people and objects','Use à with cities and many places: à Paris, à l’école. Dans means inside, sur means on top of, sous means under, devant means in front of, and derrière means behind. Choose the preposition according to the physical relationship, not a word-for-word translation.',[['Le livre est sur la table.','The book is on the table.'],['La gare est devant le parc.','The station is in front of the park.']],['Le livre est sous la table. (on top)','Le livre est sur la table.','Sur means on; sous means under.']],
 ['Contracting à and de with the articles','À + le becomes au, à + les becomes aux, de + le becomes du, and de + les becomes des. They do not contract before la or l’: à la gare, à l’école. These contractions appear often in directions and everyday place expressions.',[['Je vais au marché.','I am going to the market.'],['Le café est près du musée.','The café is near the museum.']],['Je vais à le parc.','Je vais au parc.','Contract à + le to au.']]
 ],
 vocabulary:[['la gare','the station','La gare est à droite.'],['le musée','the museum','Je vais au musée.'],['la rue','the street','La rue est calme.'],['la place','the square','La place est au centre.'],['le parc','the park','Le parc est grand.'],['à droite','to the right','Tournez à droite.'],['à gauche','to the left','Tournez à gauche.'],['tout droit','straight ahead','Allez tout droit.'],['près de','near','Je suis près de la gare.'],['devant','in front of','Il est devant l’école.'],['derrière','behind','La voiture est derrière.'],['sous','under','Le chat est sous la table.']],
 dialogue:[['Touriste','Excusez-moi, où est le musée ?','Excuse me, where is the museum?'],['Habitante','Allez tout droit jusqu’à la place.','Go straight ahead to the square.'],['Touriste','Après la place, je tourne à gauche ?','After the square, do I turn left?'],['Habitante','Oui. Le musée est devant le parc, à droite.','Yes. The museum is in front of the park, on the right.'],['Touriste','Merci beaucoup, bonne journée !','Thank you very much, have a nice day!']],
 tasks:[
 ['fill','Je vais ___ musée. (à + le)','au','The preposition à contracts with le to au.',[],'contraction'],
 ['choice','Where is an object that is on top of a table?','sur la table','Sur indicates on or atop a surface.',['sous la table','sur la table','derrière la table'],'prepositions'],
 ['reading','Which direction does the tourist take after the square?','à gauche','The tourist asks about turning left; the resident says oui.',['tout droit','à droite','à gauche'],'comprehension'],
 ['fill','Le parc est près ___ musée. (de + le)','du','De + le contracts to du in this expression.',[],'contraction'],
 ['choice','Which is written correctly?','à l’école','Before école, retain à + l’ rather than using au.',['au école','à l’école','à le école'],'elision'],
 ['fill','La gare est ___ droite.','à','The direction expression is à droite.',[],'directions'],
 ['order','Arrange: près / La gare / du parc / est','La gare est près du parc','Location follows être: est près du parc.',['du parc','est','La gare','près'],'syntax'],
 ['reading','Where is the museum relative to the park?','devant le parc','The resident says le musée est devant le parc.',['derrière le parc','devant le parc','dans le parc'],'comprehension'],
 ['choice','Which instruction means go straight ahead?','Allez tout droit.','Tout droit refers to straight ahead.',['Tournez à gauche.','Allez tout droit.','Regardez derrière.'],'directions'],
 ['fill','Le chat est ___ la table. (under)','sous','Sous means underneath rather than on top.',[],'prepositions']
 ],
 writing:['Give directions from a station to a museum in three short sentences.', ['Include a starting location and a destination.','Use at least two directional words.','Check au/du/à la contractions.'],'La gare est près du parc. Allez tout droit. Le musée est à droite, devant la place.']
},
{
 id:'a1-10',title:'Time, dates and arrangements',goal:'Tell the time, name days and coordinate a simple meeting.',grammarIds:['etre','questions'],
 grammar:[
 ['Asking and stating the time','Ask Quelle heure est-il ? or Vous avez l’heure ? Answer with Il est + hour: il est neuf heures, il est midi, il est minuit. Say à neuf heures to specify when an activity happens. French normally uses heures for clock times, not ans or fois.',[['Il est huit heures et demie.','It is half past eight.'],['On se retrouve à dix heures.','We meet at ten.']],['Je viens en neuf heures.','Je viens à neuf heures.','A clock-time expression normally uses à.']],
 ['Days, frequency and plans','Days of the week are lowercase: lundi, mardi, mercredi, jeudi, vendredi, samedi, dimanche. Bare lundi may name a particular Monday in context; le lundi often means every Monday. Demain means tomorrow, aujourd’hui today, and hier yesterday.',[['Je travaille le lundi.','I work on Mondays.'],['Nous étudions mardi.','We are studying on Tuesday.']],['Le mardi, je suis libre demain.','Mardi, je suis libre.','Avoid mixing a repeated-day marker with a single specified day.']]
 ],
 vocabulary:[['lundi','Monday','Nous partons lundi.'],['mardi','Tuesday','Mardi, je travaille.'],['mercredi','Wednesday','Mercredi, je suis libre.'],['jeudi','Thursday','Je viens jeudi.'],['vendredi','Friday','Rendez-vous vendredi.'],['samedi','Saturday','Samedi, nous étudions.'],['dimanche','Sunday','Dimanche, je me repose.'],['aujourd’hui','today','Aujourd’hui, il pleut.'],['demain','tomorrow','À demain !'],['hier','yesterday','Hier, je travaillais.'],['à midi','at noon','On mange à midi.'],['et demie','half past','Il est huit heures et demie.']],
 dialogue:[['Élise','Tu es libre mercredi après-midi ?','Are you free on Wednesday afternoon?'],['Karim','Oui, mais je travaille jusqu’à quinze heures.','Yes, but I work until three o’clock.'],['Élise','On se retrouve à quinze heures et demie ?','Shall we meet at half past three?'],['Karim','D’accord, devant la bibliothèque.','Okay, in front of the library.'],['Élise','Parfait ! À mercredi.','Perfect! See you Wednesday.']],
 tasks:[
 ['fill','On se retrouve ___ neuf heures.','à','Use à to specify a meeting time.',[],'time prepositions'],
 ['choice','What does et demie add to a time?','half an hour','Et demie means half past the hour.',['fifteen minutes','half an hour','a whole hour'],'clock'],
 ['reading','At what time do Élise and Karim agree to meet?','quinze heures et demie','Élise suggests 15:30 and Karim agrees.',['quinze heures','seize heures','quinze heures et demie'],'comprehension'],
 ['fill','Il est huit heures et ___.','demie','Et demie is the common “half past” expression.',[],'clock'],
 ['choice','Which phrase usually means on Mondays in general?','le lundi','The definite article can express a recurring weekday.',['demain','le lundi','hier'],'frequency'],
 ['fill','Nous travaillons ___ lundi. (every Monday)','le','A recurring Monday is commonly expressed as le lundi.',[],'frequency'],
 ['order','Arrange: heures / Il est / neuf','Il est neuf heures','Time statements begin with il est, then the hour.',['neuf','Il est','heures'],'syntax'],
 ['reading','Where do they plan to meet?','devant la bibliothèque','Karim specifies in front of the library.',['à la gare','devant la bibliothèque','au musée'],'comprehension'],
 ['choice','What is the correct way to write Tuesday?','mardi','Days of the week are not normally capitalized.',['Mardi (always capitalized)','mardi','Mars'],'spelling'],
 ['fill','___ heure est-il ?','Quelle','Heure is feminine, hence quelle heure.',[],'agreement']
 ],
 writing:['Arrange a short meeting with a friend, naming the day, time and place.', ['Choose one clear weekday.','Use a clock time with à.','Confirm the meeting place.'],'Tu es libre jeudi ? On se retrouve à quatorze heures devant la gare. À jeudi !']
},
{
 id:'a1-11',title:'My daily routine',goal:'Describe a typical morning using reflexive verbs and sequence markers.',grammarIds:[],
 grammar:[
 ['Reflexive verbs in the present','Some routines use a reflexive pronoun: se lever (to get up), se laver (to wash oneself), s’habiller (to get dressed). Put me/te/se/nous/vous/se before the conjugated verb: je me lève, tu te lèves, elle se lève. Note the accent shift in je me lève and tu te lèves.',[['Je me lève à sept heures.','I get up at seven.'],['Nous nous préparons tôt.','We get ready early.']],['Je se lève à huit heures.','Je me lève à huit heures.','With je, the reflexive pronoun is me, not se.']],
 ['Sequencing habits','Use d’abord (first), ensuite (then), après (afterwards), enfin (finally) and tous les jours (every day) to create a coherent description. These markers organize a routine but do not change the conjugation. With a vowel-initial verb, the pronoun may elide: je m’habille.',[['D’abord, je me lave.','First, I wash.'],['Ensuite, je prends le bus.','Then I take the bus.']],['Je me habille vite.','Je m’habille vite.','The reflexive me contracts before habille.']]
 ],
 vocabulary:[['se lever','to get up','Je me lève tôt.'],['se laver','to wash oneself','Je me lave.'],['s’habiller','to get dressed','Je m’habille.'],['se préparer','to get ready','Nous nous préparons.'],['se coucher','to go to bed','Je me couche tard.'],['d’abord','first','D’abord, je me lève.'],['ensuite','then','Ensuite, je mange.'],['après','afterwards','Après, je pars.'],['enfin','finally','Enfin, je dors.'],['tôt','early','Je pars tôt.'],['tard','late','Je dors tard.'],['tous les jours','every day','Je travaille tous les jours.']],
 dialogue:[['Sofia','À quelle heure tu te lèves ?','At what time do you get up?'],['Hugo','Je me lève à sept heures.','I get up at seven.'],['Sofia','Et ensuite ?','And then?'],['Hugo','Je me lave, je m’habille et je prends le bus.','I wash, get dressed and take the bus.'],['Sofia','Moi, je me lève plus tard le samedi.','I get up later on Saturdays.']],
 tasks:[
 ['fill','Je ___ lève à sept heures.','me','Je requires the reflexive pronoun me.',[],'reflexive'],
 ['choice','Which is the correct tu form?','Tu te lèves.','Tu takes the reflexive pronoun te.',['Tu se lèves.','Tu te lèves.','Tu me lève.'],'reflexive'],
 ['reading','How does Hugo go to his destination?','le bus','Hugo says je prends le bus.',['le vélo','le bus','le train'],'comprehension'],
 ['fill','Nous ___ préparons tôt.','nous','Reflexive verbs use nous nous with subject nous.',[],'reflexive'],
 ['choice','Which word means “finally”?','enfin','Enfin introduces the final action in a sequence.',['d’abord','ensuite','enfin'],'sequencing'],
 ['fill','Je m’___ le matin. (habiller)','habille','Use the elided form m’ before habille.',[],'reflexive'],
 ['order','Arrange: lève / me / Je / tôt','Je me lève tôt','The reflexive pronoun precedes the finite verb.',['lève','tôt','Je','me'],'word order'],
 ['reading','When does Sofia get up later?','le samedi','Sofia says je me lève plus tard le samedi.',['le lundi','le samedi','le jeudi'],'comprehension'],
 ['choice','Which expression means “every day”?','tous les jours','Tous les jours marks daily frequency.',['tôt','tous les jours','hier'],'frequency'],
 ['fill','Tu ___ laves avant le petit-déjeuner.','te','Use te with tu in reflexive constructions.',[],'reflexive']
 ],
 writing:['Describe your morning in four sentences, with two reflexive verbs and two sequence markers.', ['Use me correctly with je.','Include d’abord/ensuite/enfin to order actions.','Give at least one clock time.'],'D’abord, je me lève à sept heures. Ensuite, je me lave. Je m’habille vite. Enfin, je prends le bus.']
},
{
 id:'a1-12',title:'Invitations and the near future',goal:'Make a simple plan, invite a friend and respond with a clear intention.',grammarIds:['futur-proche','questions','negation'],
 grammar:[
 ['Making a near-future statement','French futur proche uses a present form of aller followed directly by an infinitive: je vais partir, tu vas étudier, il va venir, nous allons sortir, vous allez travailler, ils vont arriver. The second verb does not become a present-tense conjugation.',[['Nous allons visiter le musée.','We are going to visit the museum.'],['Tu vas venir demain ?','Are you going to come tomorrow?']],['Je vais visite le musée.','Je vais visiter le musée.','Use the infinitive after a conjugated aller.']],
 ['Inviting, answering and changing plans','Use Tu veux venir ? for a familiar invitation or Est-ce que vous voulez venir ? politely. To decline, je ne peux pas venir is clear. Offer an alternative using on peut + infinitive or futur proche; sequence one sentence for the invitation and another for the answer.',[['Tu veux venir samedi ?','Do you want to come Saturday?'],['Je ne peux pas samedi, mais je vais venir dimanche.','I cannot Saturday, but I will come Sunday.']],['On peut rencontre lundi.','On peut se rencontrer lundi.','After modal pouvoir, use an infinitive; rencontrer is the infinitive.']]
 ],
 vocabulary:[['aller','to go','Je vais à l’école.'],['vais','go/am going (je)','Je vais sortir.'],['vas','go/are going (tu)','Tu vas venir ?'],['va','go/is going (il/elle)','Elle va étudier.'],['allons','go/are going (nous)','Nous allons partir.'],['allez','go/are going (vous)','Vous allez venir ?'],['vont','go/are going (ils/elles)','Ils vont arriver.'],['venir','to come','Tu veux venir ?'],['sortir','to go out','On va sortir ce soir.'],['inviter','to invite','Je vais inviter Nina.'],['demain soir','tomorrow evening','À demain soir !'],['peut-être','maybe','Peut-être dimanche.']],
 dialogue:[['Éva','Tu veux venir au cinéma samedi ?','Do you want to come to the cinema Saturday?'],['Noé','Merci, mais je ne peux pas samedi.','Thanks, but I cannot Saturday.'],['Éva','Est-ce que tu vas travailler ?','Are you going to work?'],['Noé','Oui, je vais travailler. On peut sortir dimanche ?','Yes, I am going to work. Can we go out Sunday?'],['Éva','Bonne idée ! Nous allons nous retrouver à dix-huit heures.','Good idea! We will meet at six in the evening.']],
 tasks:[
 ['fill','Nous ___ visiter le musée demain.','allons','Futur proche uses nous allons + infinitive.',[],'futur proche'],
 ['choice','Which phrase is correctly formed?','Elle va travailler.','The infinitive travailler follows va.',['Elle va travaille.','Elle va travailler.','Elle vais travailler.'],'infinitive'],
 ['reading','Why can’t Noé go to the cinema on Saturday?','il va travailler','Noé explains that he is going to work.',['il est malade','il va travailler','il va voyager'],'comprehension'],
 ['fill','Tu ___ venir demain ?','vas','The tu form of aller is vas.',[],'aller'],
 ['choice','Which is a polite invitation?','Est-ce que vous voulez venir ?','This addresses someone using formal/plural vous.',['Tu viens ou quoi ?','Est-ce que vous voulez venir ?','Viens maintenant !'],'register'],
 ['fill','Ils ___ arriver demain.','vont','The plural ils form of aller is vont.',[],'aller'],
 ['order','Arrange: vais / Je / partir / demain','Je vais partir demain','The conjugated aller precedes an infinitive in futur proche.',['partir','demain','Je','vais'],'syntax'],
 ['reading','When do they arrange to meet?','dimanche','Noé proposes Sunday and Éva agrees.',['vendredi','samedi','dimanche'],'comprehension'],
 ['choice','Which response politely declines?','Je ne peux pas samedi.','Ne peux pas clearly expresses inability.',['Je ne peux pas samedi.','Je veux venir samedi.','Je suis prêt samedi.'],'negation'],
 ['fill','Vous ___ travailler demain ?','allez','Use vous allez followed by an infinitive.',[],'aller']
 ],
 writing:['Invite a friend to one activity, decline another plan politely and propose a new date with futur proche.', ['Form a real invitation question.','Use aller plus infinitive at least twice.','Offer an alternative time using a day or clock expression.'],'Tu veux venir au musée samedi ? Je ne peux pas venir vendredi, mais je vais sortir samedi. Nous allons nous retrouver à quinze heures.']
}
];
export const A1_UNITS_09_12=Object.freeze(authored.map((spec,index)=>authorA1Unit(spec,index+9)));
