export interface ConversationTurn{
  partner:string;goal:string;functionId:string;slots:string[][];hint:string;model:string;
}
export interface ConversationScenario{
  id:string;title:string;level:'A1'|'A2'|'B1';setting:string;partner:string;turns:ConversationTurn[];
}
// Curated vNext starter scenes, not the full preserved P35 P17 scenario bank.
export const CONVERSATION_STARTERS:readonly ConversationScenario[]=[
  {id:'bakery',title:'At the bakery',level:'A1',setting:'Buy breakfast at a bakery.',partner:'La boulangère',turns:[
    {partner:'Bonjour ! Vous désirez ?',goal:'Greet the seller.',functionId:'greeting',slots:[['bonjour','bonsoir','salut']],hint:'Start with a polite greeting.',model:'Bonjour madame.'},
    {partner:'Je vous écoute.',goal:'Ask for a croissant.',functionId:'request',slots:[['je voudrais','je veux','j aimerais','est ce que je peux avoir','un croissant','des croissants'],['croissant']],hint:'Say you would like a croissant.',model:'Je voudrais un croissant, s’il vous plaît.'},
    {partner:'Très bien, autre chose ?',goal:'Ask how much it costs.',functionId:'price',slots:[['combien','quel est le prix','ca coute','c est combien','cela coute']],hint:'Ask for the price.',model:'Combien ça coûte ?'}
  ]},
  {id:'cafe',title:'Order in a café',level:'A1',setting:'Order a drink and pay.',partner:'Le serveur',turns:[
    {partner:'Bonjour, qu’est-ce que je vous sers ?',goal:'Order a coffee or tea.',functionId:'request',slots:[['cafe','the'],['voudrais','veux','aimerais','prends','un cafe','un the']],hint:'Name your drink and make a request.',model:'Je voudrais un café, s’il vous plaît.'},
    {partner:'Pour ici ou à emporter ?',goal:'Say that you will drink it here.',functionId:'choice',slots:[['sur place','ici','pour ici']],hint:'Say you will stay here.',model:'Sur place, merci.'},
    {partner:'Voilà. C’est tout ?',goal:'Ask for the bill.',functionId:'payment',slots:[['addition','payer','combien','prix']],hint:'Request the bill or ask to pay.',model:'L’addition, s’il vous plaît.'}
  ]},
  {id:'directions',title:'Find the station',level:'A2',setting:'Ask a passer-by for directions.',partner:'Un passant',turns:[
    {partner:'Bonjour, je peux vous aider ?',goal:'Ask where the train station is.',functionId:'information',slots:[['gare','station'],['ou','comment aller','pour aller','chemin','direction']],hint:'Mention the station and ask where or how to get there.',model:'Excusez-moi, où est la gare ?'},
    {partner:'Continuez tout droit puis tournez à gauche.',goal:'Confirm that you turn left.',functionId:'clarification',slots:[['gauche'],['tourne','tourner','c est','donc','a']],hint:'Check the direction « à gauche ».',model:'Je tourne à gauche, c’est bien ça ?'},
    {partner:'Oui, exactement !',goal:'Thank the person.',functionId:'thanks',slots:[['merci','remercie']],hint:'Thank the person politely.',model:'Merci beaucoup pour votre aide !'}
  ]},
  {id:'rail',title:'Buy a train ticket',level:'A2',setting:'Buy a one-way ticket to Lyon.',partner:'L’agent de gare',turns:[
    {partner:'Bonjour, je vous écoute.',goal:'Ask for a ticket to Lyon.',functionId:'request',slots:[['lyon'],['billet','ticket','aller']],hint:'Ask for a ticket and name the destination.',model:'Je voudrais un billet pour Lyon.'},
    {partner:'Un aller simple ou un aller-retour ?',goal:'Choose a one-way ticket.',functionId:'choice',slots:[['aller simple','simple','sans retour']],hint:'Say « one-way » in French.',model:'Un aller simple, s’il vous plaît.'},
    {partner:'Vous souhaitez partir quand ?',goal:'Say you want to leave tomorrow.',functionId:'planning',slots:[['demain']],hint:'Specify tomorrow.',model:'Je voudrais partir demain matin.'}
  ]},
  {id:'repair',title:'Arrange an apartment repair',level:'B1',setting:'Explain a problem to your landlord and arrange a visit.',partner:'Le propriétaire',turns:[
    {partner:'Bonjour, quel est le problème ?',goal:'Explain that the heating does not work.',functionId:'explanation',slots:[['chauffage','radiateur'],['ne marche pas','ne fonctionne pas','en panne','casse','plus de chaleur']],hint:'Describe the faulty heating.',model:'Le chauffage ne fonctionne pas depuis hier.'},
    {partner:'Depuis quand avez-vous ce problème ?',goal:'Explain that the problem started yesterday.',functionId:'narration',slots:[['hier','depuis hier']],hint:'Give the start time.',model:'Le problème a commencé hier soir.'},
    {partner:'Je peux envoyer quelqu’un demain. Ça vous convient ?',goal:'Agree to a visit tomorrow.',functionId:'arrangement',slots:[['demain','ca me va','d accord','convient','parfait','oui']],hint:'Confirm the proposed visit.',model:'Oui, demain me convient très bien.'}
  ]},
  {id:'opening-hours',title:'Ask opening hours',level:'A1',setting:'Check when a local shop opens.',partner:'La vendeuse',turns:[
    {partner:'Bonjour, vous avez une question ?',goal:'Ask what time the shop opens.',functionId:'information',slots:[['ouvre','ouverture','ouvert'],['heure','quand','a quelle heure']],hint:'Ask what time it opens.',model:'À quelle heure le magasin ouvre ?'},
    {partner:'Nous ouvrons à neuf heures.',goal:'Confirm the opening time is nine.',functionId:'confirmation',slots:[['neuf','9']],hint:'Repeat the time.',model:'Donc, à neuf heures, c’est bien ça ?'},
    {partner:'Oui, exactement.',goal:'Thank the seller.',functionId:'thanks',slots:[['merci']],hint:'Say thank you.',model:'Merci beaucoup pour votre aide.'}
  ]},
  {id:'hotel',title:'Resolve a hotel problem',level:'A2',setting:'Your reserved room is not ready.',partner:'La réceptionniste',turns:[
    {partner:'Bonsoir, vous avez une réservation ?',goal:'Say you have a reservation.',functionId:'information',slots:[['reservation','reserve']],hint:'Tell the receptionist about your booking.',model:'Oui, j’ai une réservation pour ce soir.'},
    {partner:'Votre chambre n’est pas encore prête.',goal:'Ask when it will be ready.',functionId:'clarification',slots:[['quand','a quelle heure','combien de temps'],['chambre','prete']],hint:'Ask about when the room will be ready.',model:'Quand est-ce que la chambre sera prête ?'},
    {partner:'Dans trente minutes.',goal:'Ask where you can leave your luggage.',functionId:'problem-solving',slots:[['bagage','valise'],['ou','deposer','laisser','garder']],hint:'Ask where to leave your luggage.',model:'Où puis-je laisser mes bagages ?'}
  ]},
  {id:'classmate',title:'Meet a classmate',level:'A2',setting:'Introduce yourself before class.',partner:'Une camarade',turns:[
    {partner:'Salut ! Comment tu t’appelles ?',goal:'Introduce yourself.',functionId:'introduction',slots:[['je m appelle','moi c est','je suis']],hint:'Introduce yourself in French.',model:'Salut, je m’appelle Alex.'},
    {partner:'Enchantée ! Tu étudies quoi ?',goal:'Say what subject you study.',functionId:'information',slots:[['j etudie','je fais','etudiant','etudiante'],['math','mathematiques','mathematique','informatique','economie','francais','histoire','biologie']],hint:'Mention your subject.',model:'J’étudie les mathématiques.'},
    {partner:'Ça te plaît ?',goal:'Give an opinion and a reason.',functionId:'opinion',slots:[['oui','j aime','interessant','passionnant','non'],['parce que','car','mais']],hint:'Express an opinion and explain why.',model:'Oui, parce que c’est intéressant.'}
  ]},
  {id:'weekend',title:'Plan the weekend',level:'A2',setting:'Arrange an activity with a friend.',partner:'Un ami',turns:[
    {partner:'Tu veux faire quelque chose samedi ?',goal:'Suggest visiting a museum.',functionId:'suggestion',slots:[['musee'],['on pourrait','allons','aller','visiter','je propose']],hint:'Suggest a museum visit.',model:'On pourrait visiter un musée.'},
    {partner:'Bonne idée ! À quelle heure ?',goal:'Suggest an afternoon time.',functionId:'planning',slots:[['heure','heures','apres midi','quinze','quatorze','trois']],hint:'Propose a time.',model:'À quinze heures, ça te va ?'},
    {partner:'D’accord, on se retrouve où ?',goal:'Arrange to meet at the station.',functionId:'arrangement',slots:[['gare'],['retrouve','devant','a','pres']],hint:'Suggest meeting at the station.',model:'On se retrouve devant la gare.'}
  ]},
  {id:'disagreement',title:'Disagree politely',level:'B1',setting:'Choose between a hike and the cinema.',partner:'Une amie',turns:[
    {partner:'On pourrait aller au cinéma.',goal:'Politely suggest hiking instead.',functionId:'disagreement',slots:[['mais','plutot','prefere','cependant'],['randonnee','marcher','promenade']],hint:'Disagree politely and suggest a walk.',model:'Je préfère une randonnée, mais le cinéma est aussi sympa.'},
    {partner:'Pourquoi préfères-tu marcher ?',goal:'Give a reason.',functionId:'justification',slots:[['parce que','car','puisque']],hint:'Explain your preference.',model:'Parce que j’aime être dehors.'},
    {partner:'Et s’il pleut ?',goal:'Propose a compromise.',functionId:'negotiation',slots:[['si','sinon','alors'],['cinema','pluie','pleut','interieur']],hint:'Agree to a backup plan for rain.',model:'S’il pleut, alors on ira au cinéma.'}
  ]},
  {id:'restaurant',title:'Correct a restaurant order',level:'A2',setting:'The waiter brought the wrong food.',partner:'Le serveur',turns:[
    {partner:'Voilà votre plat. Bon appétit !',goal:'Politely explain this is not your order.',functionId:'correction',slots:[['pas','erreur','mauvais'],['commande','plat','demande']],hint:'Tell the waiter the order is incorrect.',model:'Excusez-moi, ce n’est pas ma commande.'},
    {partner:'Je suis désolé. Vous aviez commandé quoi ?',goal:'Say that you ordered fish.',functionId:'explanation',slots:[['poisson'],['commande','voulais','demande','pris']],hint:'Name the dish you ordered.',model:'J’avais commandé du poisson.'},
    {partner:'Je vais le remplacer.',goal:'Thank the waiter.',functionId:'thanks',slots:[['merci']],hint:'Thank the waiter.',model:'Merci beaucoup pour votre aide.'}
  ]},
  {id:'return',title:'Return a purchase',level:'A2',setting:'Return a shirt to a shop.',partner:'Le vendeur',turns:[
    {partner:'Bonjour, je peux vous aider ?',goal:'Say you want to return a shirt.',functionId:'request',slots:[['chemise'],['retourner','rendre','rembourser','echanger']],hint:'Explain what you want to return.',model:'Je voudrais retourner cette chemise.'},
    {partner:'Pourquoi souhaitez-vous la retourner ?',goal:'Explain the shirt is too small.',functionId:'explanation',slots:[['petit','petite','taille']],hint:'Explain the sizing problem.',model:'Elle est trop petite pour moi.'},
    {partner:'Vous préférez un échange ou un remboursement ?',goal:'Ask for a refund.',functionId:'choice',slots:[['remboursement','rembourser','argent']],hint:'Request your money back.',model:'Je préfère un remboursement.'}
  ]},
  {id:'past-problem',title:'Explain a past problem',level:'B1',setting:'Describe a problem with a service.',partner:'Le responsable',turns:[
    {partner:'Que s’est-il passé hier ?',goal:'Say that your order arrived late.',functionId:'narration',slots:[['hier'],['commande','livraison'],['retard','tard']],hint:'Explain what happened yesterday.',model:'Hier, ma commande est arrivée en retard.'},
    {partner:'Quelle conséquence cela a-t-il eue ?',goal:'Explain that you missed an appointment.',functionId:'consequence',slots:[['rendez vous','reunion'],['rate','manque','perdu','en retard']],hint:'Describe a concrete consequence.',model:'J’ai raté un rendez-vous important.'},
    {partner:'Comment pouvons-nous arranger cela ?',goal:'Ask for a practical solution.',functionId:'negotiation',slots:[['remboursement','reduction','solution','proposer','compensation']],hint:'Propose a fair resolution.',model:'Pourriez-vous proposer un remboursement ?'}
  ]},
  {id:'delay',title:'Handle a travel delay',level:'B1',setting:'Your train has been delayed.',partner:'L’agent de gare',turns:[
    {partner:'Votre train a du retard. Que voulez-vous savoir ?',goal:'Ask how long the delay will last.',functionId:'clarification',slots:[['combien de temps','duree','quand','minutes','heures'],['retard','train']],hint:'Ask about the train delay.',model:'Combien de temps durera le retard du train ?'},
    {partner:'Environ quarante minutes.',goal:'Ask about another connection.',functionId:'problem-solving',slots:[['autre','alternative','prochain'],['train','correspondance','solution']],hint:'Ask about an alternative train.',model:'Y a-t-il un autre train disponible ?'},
    {partner:'Il y a un départ à dix-huit heures.',goal:'Confirm you will take that train.',functionId:'decision',slots:[['prends','prendre','vais','choisis'],['train','celui','depart']],hint:'Accept the other train.',model:'Je vais prendre ce train, merci.'}
  ]},
  {id:'neighbour',title:'Explain a housing problem',level:'B1',setting:'Tell your neighbour about a water leak.',partner:'Le voisin',turns:[
    {partner:'Vous avez l’air inquiet. Que se passe-t-il ?',goal:'Explain that water is leaking.',functionId:'explanation',slots:[['eau','fuite'],['coule','fuite','probleme','infiltration']],hint:'Describe the water leak.',model:'Il y a une fuite d’eau dans mon appartement.'},
    {partner:'Depuis quand ?',goal:'Explain it started this morning.',functionId:'narration',slots:[['matin','aujourd hui']],hint:'Mention this morning.',model:'Depuis ce matin, malheureusement.'},
    {partner:'Je peux appeler le gardien.',goal:'Thank them and accept their help.',functionId:'arrangement',slots:[['merci'],['aide','oui','bonne idee','accord']],hint:'Accept the offer politely.',model:'Oui, merci pour votre aide.'}
  ]}
];
export function getConversationScenario(id:string):ConversationScenario|undefined{
  return CONVERSATION_STARTERS.find(scenario=>scenario.id===id);
}
