import {authorA1Unit,type A1AuthoredSpec} from './u6-a1-model.ts';
// U7: wholly original teaching; no reproductions of Carnet or French 2.2.
const authored:A1AuthoredSpec[]=[
{
 id:'a1-13',title:'Food and the partitive',goal:'Discuss food and drinks using du, de la, de l’ and des.',grammarIds:['articles','indefinite'],
 grammar:[
 ['Partitive articles with food','Use du for an unspecified amount of a masculine substance (du pain), de la with a feminine substance (de la soupe), and de l’ before a vowel or mute h (de l’eau). Des serves as the plural indefinite form with count nouns, not as a singular mass-food article. Learn each food noun with its gender.',[['Je prends du pain.','I am having some bread.'],['Elle boit de l’eau.','She drinks some water.']],['Je bois du eau.','Je bois de l’eau.','Before the vowel in eau, use de l’ rather than du.']],
 ['Negation and quantity contrast','With ordinary negation, du, de la, de l’ and des usually become de or d’: je ne bois pas de lait, je n’ai pas d’eau. But a specific stated amount such as un litre de takes de even in affirmative sentences. With aimer used for general likes, keep definite articles: j’aime le fromage.',[['Je ne mange pas de viande.','I do not eat meat.'],['Nous aimons le fromage.','We like cheese.']],['Je ne veux pas du café. (neutral request for no coffee)','Je ne veux pas de café.','In a neutral negative request for an unspecified amount, the partitive becomes de. A stressed contrast with a particular coffee can retain du café; do not mark every du as wrong.']]
 ],
 vocabulary:[['du pain','some bread','Je mange du pain.'],['de la soupe','some soup','Nous préparons de la soupe.'],['de l’eau','some water','Je bois de l’eau.'],['du fromage','some cheese','Il achète du fromage.'],['du lait','some milk','Tu prends du lait ?'],['du riz','some rice','Elle veut du riz.'],['de la salade','some salad','Je préfère de la salade.'],['des œufs','some eggs','Il faut des œufs.'],['du beurre','some butter','Je mets du beurre.'],['de la confiture','some jam','Nous avons de la confiture.'],['avoir faim','to be hungry','J’ai faim maintenant.'],['avoir soif','to be thirsty','Tu as soif ?']],
 dialogue:[['Camille','Tu as faim ? Nous avons du pain et du fromage.','Are you hungry? We have bread and cheese.'],['Nadir','Oui, merci. Il y a de la soupe ?','Yes, thanks. Is there any soup?'],['Camille','Non, mais il y a de la salade et des œufs.','No, but there is salad and eggs.'],['Nadir','Très bien. Je vais prendre de la salade.','Very good. I will have some salad.'],['Camille','Et pour boire, tu veux de l’eau ?','And to drink, do you want water?']],
 tasks:[
 ['choice','Choose the correct article before pain.','du','Pain is masculine and an unspecified amount takes du.',['de la','du','de l’'],'partitive'],
 ['fill','Je voudrais ___ soupe.','de la','Soupe is feminine and uses the partitive de la.',[''],'partitive'],
 ['reading','What food does Nadir choose?','de la salade','He says je vais prendre de la salade.',['du fromage','de la salade','de la soupe'],'comprehension'],
 ['fill','Elle boit ___ eau.','de l’','Eau begins with a vowel; use de l’.',[],'elision'],
 ['choice','Which is the usual negative form?','Je ne bois pas de lait.','Partitive du becomes de after ordinary negation.',['Je ne bois pas du lait.','Je ne bois pas de lait.','Je ne bois pas le lait.'],'negation'],
 ['order','Arrange: prends / Je / du fromage','Je prends du fromage','Place the subject first, then the verb and the partitive noun phrase.',['du fromage','Je','prends'],'syntax'],
 ['fill','Nous n’avons pas ___ pain.','de','The partitive becomes de after ordinary negation.',[],'negation'],
 ['reading','Does Camille have soup?','non','She says non, mais il y a de la salade.',['oui','non','peut-être'],'comprehension'],
 ['choice','Choose the general preference expression.','J’aime le fromage.','With aimer, the definite article often expresses general preference.',['J’aime du fromage.','J’aime le fromage.','J’aime de fromage.'],'articles'],
 ['fill','Je prends ___ œufs.','des','Plural indefinite eggs take des in the affirmative.',[],'plural']
 ],
 writing:['Write a short lunch conversation asking about two foods and one drink.', ['Use two different partitive forms.','Include a polite question or request.','Use de after one negative food statement.'],'Je voudrais du pain et de la salade, s’il vous plaît. Vous avez de l’eau ? Je ne veux pas de lait.']
},
{
 id:'a1-14',title:'Shopping and asking prices',goal:'Ask how much things cost, compare prices and pay politely.',grammarIds:['questions','articles'],
 grammar:[
 ['Asking the price and answering','Combien ça coûte ? asks what something costs; C’est combien ? is common in shops. Give a price with ça coûte or c’est followed by the amount: ça coûte huit euros. With an item as subject, you can use Il coûte or Elle coûte depending on its gender.',[['Combien coûte ce sac ?','How much does this bag cost?'],['Il coûte douze euros.','It costs twelve euros.']],['Combien est ça coûte ?','Combien ça coûte ?','Do not combine two different question constructions.']],
 ['Demonstratives and polite buying','Use ce before masculine consonant nouns, cet before masculine vowel nouns, cette before feminine nouns and ces for plural nouns. To express a polite purchase, je voudrais …, s’il vous plaît works better than a bare imperative. Learn euro amounts and whether the item is singular or plural.',[['Je voudrais cette chemise.','I would like this shirt.'],['Cet appareil coûte vingt euros.','This device costs twenty euros.']],['Ce orange est bon marché.','Cette orange est bon marché.','Orange is feminine, so use cette.']]
 ],
 vocabulary:[['combien','how much','Combien ça coûte ?'],['le prix','the price','Quel est le prix ?'],['l’euro','euro','Cela coûte cinq euros.'],['cher','expensive (m.)','Ce manteau est cher.'],['chère','expensive (f.)','Cette robe est chère.'],['bon marché','inexpensive','Ce sac est bon marché.'],['la caisse','checkout','Je vais à la caisse.'],['le ticket','receipt','Voici votre ticket.'],['la taille','size','Vous avez ma taille ?'],['ce','this (masculine)','Ce sac est joli.'],['cette','this (feminine)','Cette veste est bleue.'],['payer','to pay','Je vais payer par carte.']],
 dialogue:[['Vendeuse','Bonjour, je peux vous aider ?','Hello, may I help you?'],['Client','Oui, combien coûte cette veste bleue ?','Yes, how much is this blue jacket?'],['Vendeuse','Elle coûte trente euros.','It costs thirty euros.'],['Client','Et ce sac noir, c’est combien ?','And this black bag, how much is it?'],['Vendeuse','Douze euros. Vous payez par carte ?','Twelve euros. Are you paying by card?']],
 tasks:[
 ['choice','Choose the question that asks a price.','Combien ça coûte ?','Combien ça coûte ? is a complete price question.',['Où est la gare ?','Combien ça coûte ?','Quelle heure est-il ?'],'questions'],
 ['fill','Cette veste ___ trente euros.','coûte','The singular subject cette veste takes coûte.',[],'conjugation'],
 ['reading','How much is the black bag?','douze euros','The salesperson quotes twelve euros for the bag.',['douze euros','trente euros','dix euros'],'comprehension'],
 ['fill','Je voudrais ___ veste.','cette','The feminine singular veste takes cette.',[],'demonstratives'],
 ['choice','Choose the masculine form before a consonant.','ce','Ce is used before most masculine consonant-initial singular nouns.',['ces','cette','ce'],'demonstratives'],
 ['order','Arrange: voudrais / Je / ce sac','Je voudrais ce sac','A polite request uses je voudrais followed by a noun phrase.',['ce sac','voudrais','Je'],'word order'],
 ['fill','Il ___ dix euros.','coûte','The singular item il costs, so use coûte.',[],'prices'],
 ['reading','What color is the jacket?','bleue','The customer asks about cette veste bleue.',['rouge','bleue','noire'],'comprehension'],
 ['choice','Which phrase asks for a size?','Vous avez ma taille ?','Taille can refer to clothing size.',['Vous avez ma taille ?','Où est la caisse ?','Quel est le jour ?'],'vocabulary'],
 ['fill','Vous payez par ___ ?','carte','Par carte refers to paying with a card.',[],'shopping']
 ],
 writing:['Write a short shop exchange asking two prices and politely purchasing one item.', ['Use cette or ce correctly.','Include combien or c’est combien.','Finish with je voudrais and a payment request.'],'Bonjour, combien coûte cette veste ? Et ce sac, c’est combien ? Je voudrais ce sac, s’il vous plaît.']
},
{
 id:'a1-15',title:'Quantities at the market',goal:'Buy exact quantities, distinguish de after a measurement and make a list.',grammarIds:['indefinite','questions'],
 grammar:[
 ['Numbers and containers','After a quantity expression such as un kilo, deux kilos, une bouteille, un litre or beaucoup, normally introduce the measured food with de/d’: un kilo de pommes, une bouteille d’eau, beaucoup de riz. The measurement already tells the amount, so you do not follow it with du or des in this construction.',[['Deux kilos de pommes, s’il vous plaît.','Two kilograms of apples, please.'],['Une bouteille d’eau.','One bottle of water.']],['Un kilo des pommes.','Un kilo de pommes.','After a basic measurement use de, not des.']],
 ['Asking how much and how many','Combien de + noun asks about quantity: combien de tomates ? Combien ça coûte ? asks the price. Note that combien de is followed directly by the noun, unlike an exact number (trois tomates). In shops say je voudrais or il me faut for a polite practical request.',[['Combien de pommes voulez-vous ?','How many apples would you like?'],['Il me faut trois tomates.','I need three tomatoes.']],['Combien des pommes ?','Combien de pommes ?','Use combien de + noun in a basic quantity question.']]
 ],
 vocabulary:[['un kilo de','a kilogram of','Un kilo de pommes.'],['un litre de','a litre of','Un litre de lait.'],['une bouteille de','a bottle of','Une bouteille d’eau.'],['un paquet de','a packet of','Un paquet de riz.'],['beaucoup de','a lot of','Beaucoup de personnes.'],['un peu de','a little','Un peu de sucre.'],['la pomme','apple','Je prends trois pommes.'],['la tomate','tomato','Deux tomates rouges.'],['la carotte','carrot','Une carotte fraîche.'],['frais','fresh (m.)','Le pain est frais.'],['il me faut','I need','Il me faut deux citrons.'],['peser','to weigh','Vous pouvez peser les pommes ?']],
 dialogue:[['Marchande','Bonjour ! Qu’est-ce qu’il vous faut ?','Hello! What do you need?'],['Client','Un kilo de pommes et trois tomates, s’il vous plaît.','A kilogram of apples and three tomatoes, please.'],['Marchande','Autre chose ?','Anything else?'],['Client','Oui, une bouteille d’eau et un paquet de riz.','Yes, a bottle of water and a packet of rice.'],['Marchande','Très bien. Ça fait neuf euros.','Very well. That comes to nine euros.']],
 tasks:[
 ['fill','Un kilo ___ tomates.','de','A measurement is followed by de.',[],'quantity'],
 ['choice','Which expression is correct?','une bouteille d’eau','Before eau, de elides to d’.',['une bouteille de l’eau','une bouteille d’eau','une bouteille du eau'],'elision'],
 ['reading','How many tomatoes does the client request?','trois','The client requests trois tomates.',['deux','trois','quatre'],'comprehension'],
 ['fill','Combien ___ pommes voulez-vous ?','de','Combien de introduces the counted noun.',[],'quantity'],
 ['choice','Which is a question about price?','Combien ça coûte ?','The price question is different from combien de + noun.',['Combien de pommes ?','Combien ça coûte ?','Quelle quantité ?'],'questions'],
 ['order','Arrange: voudrais / Je / deux kilos de pommes','Je voudrais deux kilos de pommes','The measurement keeps de before the noun.',['deux kilos de pommes','Je','voudrais'],'word order'],
 ['fill','J’achète un litre ___ lait.','de','An exact litre measurement requires de, not du.',[],'quantity'],
 ['reading','What is the total price quoted?','neuf euros','The seller says ça fait neuf euros.',['dix euros','cinq euros','neuf euros'],'comprehension'],
 ['choice','Which introduces an unspecified large quantity?','beaucoup de','Beaucoup de precedes the noun directly.',['beaucoup des','beaucoup de','beaucoup du'],'quantity'],
 ['fill','Il me ___ deux citrons.','faut','Il me faut is a fixed everyday expression of need.',[],'idiom']
 ],
 writing:['Prepare a market request with three different quantity expressions and ask the total price.', ['Use kilo/litre/bouteille plus de or d’.','Include a numerical count.','End with a polite question about price.'],'Bonjour, je voudrais un kilo de pommes, une bouteille d’eau et trois tomates. Combien ça coûte, s’il vous plaît ?']
},
{
 id:'a1-16',title:'Ordering at a restaurant',goal:'Read a menu, order a meal politely and ask for the bill.',grammarIds:['indefinite','questions'],
 grammar:[
 ['Making a restaurant request','Je voudrais + noun is a polite, reliable restaurant request. You can ask Qu’est-ce que vous avez comme plat ? and respond je prends … . The expression comme boisson introduces the type of drink; pour moi introduces a choice for your own order.',[['Je voudrais une soupe, s’il vous plaît.','I would like a soup, please.'],['Pour moi, du poisson.','Fish for me.']],['Moi vouloir une soupe.','Je voudrais une soupe.','A polite request needs a conjugated verb in a natural sentence.']],
 ['Asking for a bill and paying','To finish a meal, say L’addition, s’il vous plaît or Est-ce que je peux avoir l’addition ? Use une table pour deux to request seating for two. Un plat du jour is a daily special; a menu can mean a fixed set meal or a printed menu depending on the context.',[['Une table pour deux, s’il vous plaît.','A table for two, please.'],['Est-ce que je peux avoir l’addition ?','May I have the bill?']],['Le addition, s’il vous plaît.','L’addition, s’il vous plaît.','The definite article elides before addition.']]
 ],
 vocabulary:[['le menu','menu','Je regarde le menu.'],['le plat','dish','Quel plat choisissez-vous ?'],['le plat du jour','daily special','Le plat du jour est une soupe.'],['l’entrée','starter','Je prends une entrée.'],['le dessert','dessert','Un dessert au chocolat.'],['l’addition','bill','L’addition, s’il vous plaît.'],['le serveur','waiter','Le serveur arrive.'],['la serveuse','waitress','La serveuse apporte l’eau.'],['réserver','to reserve','Je vais réserver une table.'],['une table pour deux','table for two','Une table pour deux, merci.'],['comme boisson','as a drink','Comme boisson, de l’eau.'],['choisir','to choose','Je vais choisir ce plat.']],
 dialogue:[['Serveuse','Bonsoir, vous avez réservé ?','Good evening, have you reserved?'],['Cliente','Non, mais nous voudrions une table pour deux.','No, but we would like a table for two.'],['Serveuse','Bien sûr. Le plat du jour est une soupe de légumes.','Of course. The daily special is vegetable soup.'],['Cliente','Je voudrais le plat du jour et de l’eau, s’il vous plaît.','I would like the daily special and water, please.'],['Serveuse','Très bien, je reviens avec votre commande.','Very good, I will return with your order.']],
 tasks:[
 ['choice','Which phrase asks politely for a bill?','L’addition, s’il vous plaît.','The elided definite article belongs to addition.',['Le addition !','L’addition, s’il vous plaît.','La soupe, s’il vous plaît.'],'restaurant'],
 ['fill','Je ___ une soupe. (polite request)','voudrais','Je voudrais is a polite conditional request.',[],'politeness'],
 ['reading','What is the daily special?','une soupe de légumes','The server names vegetable soup as today’s dish.',['du poisson','une salade','une soupe de légumes'],'comprehension'],
 ['fill','Une table ___ deux, s’il vous plaît.','pour','Pour indicates the number of people at the table.',[],'restaurant'],
 ['choice','Which expression introduces a drink choice?','Comme boisson, de l’eau.','Comme boisson signals what you want to drink.',['Comme dessert, une soupe.','Comme boisson, de l’eau.','Comme entrée, du pain.'],'vocabulary'],
 ['order','Arrange: voudrais / Je / le plat du jour','Je voudrais le plat du jour','Use a conjugated polite request followed by the menu item.',['le plat du jour','Je','voudrais'],'word order'],
 ['fill','Est-ce que je peux avoir l’___ ?','addition','L’addition is the bill at the end of a meal.',[],'restaurant'],
 ['reading','How many diners are requesting a table?','deux','The customer says une table pour deux.',['un','deux','trois'],'comprehension'],
 ['choice','Which phrase names a daily special?','le plat du jour','Plat du jour is the daily special.',['le dessert','le plat du jour','la carte de paiement'],'vocabulary'],
 ['fill','Vous avez ___ ? (reserved)','réservé','The customer is asked whether they have reserved.',[],'comprehension']
 ],
 writing:['Compose a short restaurant scene: ask for a table, choose a food and drink, then request the bill.', ['Open with a polite request for a table.','Use a correct food or partitive expression.','Ask for l’addition politely.'],'Bonsoir, une table pour deux, s’il vous plaît. Je voudrais le plat du jour et de l’eau. L’addition, s’il vous plaît.']
}
];
export const A1_UNITS_13_16=Object.freeze(authored.map((spec,index)=>authorA1Unit(spec,index+13)));
