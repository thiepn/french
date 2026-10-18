import {CONVERSATION_STARTERS,getConversationScenario} from './scenarios.ts';

// Curated alternative partner phrasing. The learning goals and accepted answer
// patterns stay unchanged, so this is wording variation, not new assessment.
const ALTERNATIVES:Readonly<Record<string,readonly [string,string,string]>>={
  bakery:['Bonjour ! Qu’est-ce que je peux vous servir ?','Dites-moi ce qui vous ferait plaisir.','Vous voulez autre chose ?'],
  cafe:['Bonjour ! Qu’aimeriez-vous boire ?','Vous restez ici ou vous prenez à emporter ?','Très bien, ce sera tout ?'],
  directions:['Excusez-moi, vous cherchez quelque chose ?','Allez tout droit, puis prenez la rue à gauche.','Oui, c’est bien cela.'],
  rail:['Bonjour ! Quel billet cherchez-vous ?','Vous voulez un aller simple ou un billet aller-retour ?','Quelle date de départ préférez-vous ?'],
  repair:['Bonjour, expliquez-moi ce qui ne va pas.','Cela a commencé il y a longtemps ?','Je peux faire venir un technicien demain. Cela vous irait ?'],
  'opening-hours':['Bonjour ! Comment puis-je vous renseigner ?','Le magasin est ouvert dès neuf heures.','Oui, vous avez bien compris.'],
  hotel:['Bonsoir ! Vous aviez réservé une chambre ?','Je suis désolée, votre chambre est encore en préparation.','Elle sera prête dans une demi-heure.'],
  classmate:['Salut ! Moi, c’est Léa. Et toi ?','Ravie de te rencontrer ! Qu’est-ce que tu étudies ?','Et est-ce que tes études te plaisent ?'],
  weekend:['On organise une sortie samedi ?','Super ! Tu proposes quelle heure ?','Ça marche. Quel lieu de rendez-vous ?'],
  disagreement:['Je te propose une séance de cinéma.','Qu’est-ce qui te plaît davantage dans la marche ?','D’accord, mais que fait-on en cas de pluie ?'],
  restaurant:['Votre repas est servi, bon appétit !','Toutes mes excuses. Quel plat attendiez-vous ?','Bien sûr, je corrige votre commande.'],
  return:['Bonjour ! Vous souhaitez un renseignement ?','Qu’est-ce qui ne va pas avec cet article ?','Souhaitez-vous l’échanger ou être remboursé ?'],
  'past-problem':['Pouvez-vous me raconter le problème d’hier ?','Qu’est-ce que cela a changé pour vous ?','Quelle solution vous semblerait juste ?'],
  delay:['Votre train est retardé. Comment puis-je vous aider ?','Le retard est d’environ quarante minutes.','Un autre train part à dix-huit heures.'],
  neighbour:['Vous semblez préoccupé. Quel est le souci ?','Depuis quand est-ce arrivé ?','Je peux prévenir le concierge, si vous voulez.']
};
export type WordingVariant=0|1;
export function partnerWording(scenarioId:string,turnIndex:number,variant:WordingVariant):string{
  const scene=getConversationScenario(scenarioId);
  if(!scene||!Number.isInteger(turnIndex)||turnIndex<0||turnIndex>=scene.turns.length)
    throw new Error('INVALID_PARTNER_TURN');
  return variant===1?ALTERNATIVES[scenarioId]?.[turnIndex]??scene.turns[turnIndex].partner:
    scene.turns[turnIndex].partner;
}
export function nextWordingVariant(scenarioId:string,history:readonly {scenarioId:string}[]):WordingVariant{
  return history.filter(row=>row.scenarioId===scenarioId).length%2===0?0:1;
}
export function validateConversationVariants():string[]{
  const failures:string[]=[];
  const ids=new Set(CONVERSATION_STARTERS.map(scene=>scene.id));
  for(const scene of CONVERSATION_STARTERS){
    const alternatives=ALTERNATIVES[scene.id];
    if(!alternatives||alternatives.length!==scene.turns.length){
      failures.push('missing alternate prompts: '+scene.id);continue;
    }
    for(let i=0;i<scene.turns.length;i++){
      const text=alternatives[i]?.trim();
      if(!text||text===scene.turns[i].partner)failures.push('duplicate or blank wording '+scene.id+':'+i);
    }
  }
  for(const key of Object.keys(ALTERNATIVES))if(!ids.has(key))failures.push('orphan variant '+key);
  return failures;
}
