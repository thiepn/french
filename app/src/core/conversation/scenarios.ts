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
  ]}
];
export function getConversationScenario(id:string):ConversationScenario|undefined{
  return CONVERSATION_STARTERS.find(scenario=>scenario.id===id);
}
