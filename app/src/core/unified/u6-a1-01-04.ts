import {authorA1Unit,type A1AuthoredSpec} from './u6-a1-model.ts';
const authored:A1AuthoredSpec[]=[
{
 id:'a1-01',title:'First French words and sounds',goal:'Greet someone, say your name and distinguish common written vowel sounds.',grammarIds:['etre'],
 grammar:[
 ['Greetings and register','Bonjour works in formal and informal daytime settings; salut is familiar and appropriate among friends. Use bonsoir in the evening. Say au revoir when leaving. In French many final consonants are silent, and the written forms should be learned alongside their sounds.',[['Bonjour, madame.','Hello, ma’am.'],['Salut, Camille !','Hi, Camille!']],['Salut, monsieur.','Bonjour, monsieur.','Salut is too familiar for this first formal greeting.']],
 ['Introducing yourself','Je m’appelle means “my name is”; moi, c’est introduces someone informally. The apostrophe in m’appelle replaces a vowel before appelle. Je suis means “I am” and introduces identity or a role, not a person’s name with s’appeler.',[['Je m’appelle Inès.','My name is Inès.'],['Je suis étudiant.','I am a student.']],['Je appelle Inès.','Je m’appelle Inès.','Use the reflexive pronoun m’ with appeler.']]
 ],
 vocabulary:[['bonjour','hello; good morning','Bonjour, Léa.'],['bonsoir','good evening','Bonsoir, monsieur.'],['salut','hi (informal)','Salut, Sami !'],['au revoir','goodbye','Au revoir, à demain.'],['merci','thank you','Merci beaucoup.'],['s’il vous plaît','please (formal/plural)','Un café, s’il vous plaît.'],['je','I','Je suis ici.'],['tu','you (familiar)','Tu es là ?'],['vous','you (formal/plural)','Vous êtes ici ?'],['je m’appelle','my name is','Je m’appelle Nora.'],['enchanté(e)','pleased to meet you','Enchantée, Léa.'],['comment','how','Comment tu t’appelles ?']],
 dialogue:[['Inès','Bonjour ! Je m’appelle Inès.','Hello! My name is Inès.'],['Malik','Salut, Inès. Moi, c’est Malik.','Hi, Inès. I’m Malik.'],['Inès','Enchantée, Malik. Comment tu vas ?','Nice to meet you, Malik. How are you?'],['Malik','Très bien, merci. Et toi ?','Very well, thanks. And you?'],['Inès','Bien aussi. À bientôt !','Well too. See you soon!']],
 tasks:[
 ['choice','Which greeting is suited to an unfamiliar teacher?','Bonjour, madame.','Bonjour is an appropriate formal daytime greeting.',['Salut, madame.','Bonjour, madame.','À bientôt, madame.'],'register'],
 ['fill','Complete: Je m’___ Inès.','appelle','The expression je m’appelle introduces a name.',[''],'reflexive'],
 ['reading','What is Malik’s name?','Malik','Malik introduces himself with moi, c’est Malik.',['Inès','Malik','Camille'],'comprehension'],
 ['choice','Choose the informal way to say hi to a friend.','Salut !','Salut is a familiar greeting among friends.',['Bonsoir, monsieur.','Salut !','Au revoir.'],'register'],
 ['fill','Complete: ___ beaucoup. (Thank you very much.)','Merci','Merci beaucoup expresses warm thanks.',[],'vocabulary'],
 ['order','Arrange the words: appelle / Je / m’','Je m’appelle','The reflexive pronoun is placed before appelle.',['m’appelle','Je'],'word order'],
 ['reading','Which phrase shows Inès is leaving?','À bientôt !','À bientôt signals that the speakers will see each other again.',['Très bien.','Et toi ?','À bientôt !'],'comprehension'],
 ['choice','Which pronoun can address one unfamiliar adult politely?','vous','Vous is the standard polite second-person form.',['tu','je','vous'],'register'],
 ['fill','Complete: ___, Malik ! (Nice to meet you; male speaker.)','Enchanté','Enchanté is the usual masculine written form.',[],'agreement'],
 ['order','Arrange: suis / étudiant / Je','Je suis étudiant','Je precedes the conjugated verb suis.',['étudiant','Je','suis'],'syntax']
 ],
 writing:['Write a polite two-line greeting with your name and one goodbye.', ['Use a suitable opening greeting.','Introduce yourself with je m’appelle.','Close with au revoir or à bientôt.'],'Bonjour, je m’appelle Amira. Enchantée ! Au revoir.']
},
{
 id:'a1-02',title:'Who are you? Using être',goal:'Describe identity and location using the six present-tense forms of être.',grammarIds:['etre'],
 grammar:[
 ['Être with each subject','Être is irregular: je suis, tu es, il/elle/on est, nous sommes, vous êtes, ils/elles sont. Do not apply the endings of regular -er verbs. Je becomes j’ before a vowel only where elision is required; je suis never contracts.',[['Nous sommes à Lyon.','We are in Lyon.'],['Elles sont étudiantes.','They are students.']],['Vous sommes français.','Vous êtes français.','The polite/plural vous form of être is êtes, not sommes.']],
 ['People, identity and place','Use être with nationality, occupation and location: elle est française; nous sommes ici. French often omits the article before an occupation after être: je suis médecin. Nationality adjectives normally agree with the person described.',[['Je suis professeur.','I am a teacher.'],['Il est à Paris.','He is in Paris.']],['Elle est français.','Elle est française.','An adjective describing a woman normally takes its feminine form.']]
 ],
 vocabulary:[['être','to be','Nous sommes prêts.'],['suis','am','Je suis là.'],['es','are (tu)','Tu es libre ?'],['est','is','Il est ici.'],['sommes','are (nous)','Nous sommes amis.'],['êtes','are (vous)','Vous êtes en classe.'],['sont','are (ils/elles)','Ils sont contents.'],['étudiant','male student','Il est étudiant.'],['étudiante','female student','Elle est étudiante.'],['professeur','teacher','Mon père est professeur.'],['français','French (masculine)','Il est français.'],['française','French (feminine)','Elle est française.']],
 dialogue:[['Nora','Tu es étudiante ?','Are you a student?'],['Aya','Oui, je suis étudiante à Paris.','Yes, I am a student in Paris.'],['Nora','Et tes amis, ils sont aussi étudiants ?','And your friends, are they students too?'],['Aya','Oui, nous sommes tous étudiants.','Yes, we are all students.'],['Nora','Super ! Je suis professeur ici.','Great! I am a teacher here.']],
 tasks:[
 ['fill','Je ___ étudiante.','suis','Je is followed by suis, never est.',[],'etre'],
 ['choice','Choose the correct form: Vous ___ à Paris.','êtes','Vous requires the form êtes.',['sommes','êtes','es'],'etre'],
 ['reading','Where is Aya a student?','Paris','Aya says she studies in Paris.',['Lyon','Paris','Marseille'],'comprehension'],
 ['fill','Nous ___ tous étudiants.','sommes','Nous sommes is the correct first-person plural.',[],'etre'],
 ['choice','Which sentence correctly describes one woman?','Elle est française.','The adjective française agrees with elle.',['Elle sont français.','Elle est française.','Elle êtes française.'],'agreement'],
 ['fill','Ils ___ contents.','sont','Ils is followed by sont in the present.',[],'etre'],
 ['order','Arrange: sommes / ici / Nous','Nous sommes ici','Start with nous, then conjugate être as sommes.',['ici','Nous','sommes'],'word order'],
 ['reading','What is Nora’s profession?','professeur','Nora says je suis professeur.',['étudiante','médecin','professeur'],'comprehension'],
 ['choice','Which phrase normally needs no article before an occupation?','Je suis médecin.','An occupational noun after être normally appears without un/une.',['Je suis un médecin.','Je suis médecin.','Je suis le médecin.'],'noun phrase'],
 ['fill','Tu ___ libre demain ?','es','Use tu es for the familiar second person.',[],'etre']
 ],
 writing:['Introduce two people and say where they are. Use at least two forms of être.', ['Use je suis or il/elle est correctly.','Add a place with à.','Check nationality or profession agreement.'],'Je suis étudiante à Paris. Mon ami est professeur à Lyon.']
},
{
 id:'a1-03',title:'Objects, gender and articles',goal:'Choose un/une/des and le/la/l’/les with familiar nouns.',grammarIds:['articles','indefinite'],
 grammar:[
 ['Indefinite articles for new things','Use un with a masculine singular count noun, une with a feminine singular count noun and des with plural count nouns. Gender is part of the noun and often cannot be guessed from the last letter. Learn vocabulary with the article: un livre, une table.',[['C’est un livre.','It is a book.'],['Voici des stylos.','Here are some pens.']],['un table','une table','Table is feminine, so choose une.']],
 ['Definite articles for specific things','Use le (masculine singular), la (feminine singular), l’ before a vowel or mute h, and les for plural nouns. Definite articles refer to something known in context or a general category. The article l’ does not tell you the underlying noun gender.',[['Le livre est sur la table.','The book is on the table.'],['L’école est ouverte.','The school is open.']],['la école','l’école','La elides to l’ before the vowel in école.']]
 ],
 vocabulary:[['un livre','a book','Je lis un livre.'],['une table','a table','Une table est ici.'],['un stylo','a pen','J’ai un stylo.'],['une école','a school','L’école est ici.'],['un sac','a bag','Le sac est noir.'],['une fenêtre','a window','La fenêtre est grande.'],['une porte','a door','La porte est ouverte.'],['un cahier','a notebook','Le cahier est bleu.'],['des livres','some books','Des livres sont sur la table.'],['le','the (masculine)','Le sac est petit.'],['la','the (feminine)','La porte est fermée.'],['les','the (plural)','Les stylos sont rouges.']],
 dialogue:[['Lucie','C’est quoi, dans ton sac ?','What is in your bag?'],['Sami','Un livre, un cahier et deux stylos.','A book, a notebook and two pens.'],['Lucie','Le livre est pour l’école ?','Is the book for school?'],['Sami','Oui, et le cahier est pour mon cours.','Yes, and the notebook is for my class.'],['Lucie','Regarde : les stylos sont sur la table.','Look: the pens are on the table.']],
 tasks:[
 ['fill','___ table est grande. (the)','La','Table is feminine singular: la table.',[],'articles'],
 ['choice','Choose the correct indefinite article for livre.','un','Livre is masculine singular.',['une','un','des'],'indefinite'],
 ['reading','How many pens are in Sami’s bag?','deux','Sami says deux stylos: two pens.',['un','deux','trois'],'comprehension'],
 ['fill','Voici ___ livres. (some)','des','Des is the indefinite plural article.',[],'indefinite'],
 ['choice','Choose the correctly written phrase.','l’école','Before a vowel, the singular definite article elides.',['la école','le école','l’école'],'elision'],
 ['fill','___ stylos sont sur la table. (the)','Les','Stylos is plural, requiring les.',[],'articles'],
 ['order','Arrange: est / table / La / grande','La table est grande','French typically uses subject + verb + adjective here.',['grande','est','La','table'],'syntax'],
 ['reading','Where are the pens at the end?','sur la table','Lucie says les stylos sont sur la table.',['dans le sac','sur la table','dans la rue'],'comprehension'],
 ['choice','Which is a feminine noun phrase?','une fenêtre','Fenêtre is feminine; use une.',['un cahier','une fenêtre','un sac'],'gender'],
 ['fill','J’ai ___ stylo bleu.','un','Stylo is masculine singular and is introduced with un.',[],'indefinite']
 ],
 writing:['Describe four objects on a desk using both definite and indefinite articles.', ['Use un/une to introduce at least two objects.','Use le/la/les to refer to familiar objects.','Check each noun’s gender and plural.'],'Il y a un livre et une table. Le livre est bleu. Les stylos sont sur la table.']
},
{
 id:'a1-04',title:'Having things and giving your age',goal:'Conjugate avoir and express possessions, age and common sensations.',grammarIds:['avoir'],
 grammar:[
 ['The forms of avoir','Avoir is irregular: j’ai, tu as, il/elle/on a, nous avons, vous avez, ils/elles ont. The pronoun je elides before ai and becomes j’. Avoir helps express possession and later acts as an auxiliary in the passé composé.',[['J’ai un vélo.','I have a bicycle.'],['Nous avons trois livres.','We have three books.']],['Je ai un frère.','J’ai un frère.','Je contracts before ai to become j’.']],
 ['Age and common expressions','French uses avoir, not être, for age: j’ai vingt ans. It also uses avoir with states such as faim (hunger), soif (thirst), froid (cold) and chaud (heat). These are fixed language patterns; translating English word by word leads to errors.',[['Tu as quel âge ?','How old are you?'],['Nous avons faim.','We are hungry.']],['Je suis dix-huit ans.','J’ai dix-huit ans.','French expresses age with avoir, not être.']]
 ],
 vocabulary:[['avoir','to have','J’ai une idée.'],['j’ai','I have','J’ai un frère.'],['tu as','you have','Tu as un sac.'],['il a','he has','Il a vingt ans.'],['nous avons','we have','Nous avons du temps.'],['vous avez','you have','Vous avez un stylo ?'],['ils ont','they have','Ils ont faim.'],['un frère','a brother','J’ai un frère.'],['une sœur','a sister','J’ai une sœur.'],['ans','years (age)','Elle a seize ans.'],['faim','hunger','J’ai faim.'],['soif','thirst','Tu as soif ?']],
 dialogue:[['Aya','Tu as des frères ou des sœurs ?','Do you have brothers or sisters?'],['Léo','Oui, j’ai une sœur et un frère.','Yes, I have a sister and a brother.'],['Aya','Ils ont quel âge ?','How old are they?'],['Léo','Ma sœur a quinze ans. Mon frère a dix ans.','My sister is fifteen. My brother is ten.'],['Aya','Moi, j’ai faim. On mange ?','I am hungry. Shall we eat?']],
 tasks:[
 ['fill','J’___ une sœur.','ai','Je + ai contracts to j’ai.',[],'avoir'],
 ['choice','Which means “we have”?','nous avons','Avoir with nous becomes avons.',['nous sommes','nous avez','nous avons'],'avoir'],
 ['reading','How old is Léo’s sister?','quinze ans','Ma sœur a quinze ans gives her age.',['dix ans','quinze ans','vingt ans'],'comprehension'],
 ['fill','Ils ___ faim.','ont','Ils ont faim means they are hungry.',[],'avoir'],
 ['choice','Choose the correct way to state your age.','J’ai vingt ans.','Age uses avoir in French.',['Je suis vingt ans.','J’ai vingt ans.','J’est vingt ans.'],'idiom'],
 ['fill','Vous ___ un stylo ?','avez','Vous avez is the formal/plural present form.',[],'avoir'],
 ['order','Arrange: avons / Nous / faim','Nous avons faim','Nous is followed by avons, then the expression faim.',['faim','Nous','avons'],'syntax'],
 ['reading','How many siblings does Léo have?','deux','Léo has one sister and one brother.',['un','deux','trois'],'comprehension'],
 ['choice','Which French expression means “I am thirsty”?','J’ai soif.','The phrase avoir soif is idiomatic.',['Je suis soif.','J’ai soif.','J’ai froid.'],'idiom'],
 ['fill','Tu ___ quel âge ?','as','Tu as quel âge? asks someone’s age.',[],'avoir']
 ],
 writing:['Introduce your family and give two ages or sensations using avoir.', ['Use j’ai and at least one other form of avoir.','Express an age using ans or a sensation with faim/soif.','Keep the pronouns and verbs consistent.'],'J’ai une sœur. Elle a quinze ans. Nous avons faim après les cours.']
}
];
export const A1_UNITS_01_04=Object.freeze(authored.map((spec,index)=>authorA1Unit(spec,index+1)));
