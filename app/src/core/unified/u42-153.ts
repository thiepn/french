import {originalB2DebateProduction,type U21OriginalSourceStory} from './u21-content-helper.ts';

/** Original fictional consumer-repair debate with explicit limits on environmental claims. */
const story:U21OriginalSourceStory={
 id:'transfer-153',title:'Réparer ou remplacer ? Consommation durable et choix justifié',
 goal:'Weigh repair quotes, energy claims and access needs, distinguishing an estimate from a guarantee and defending a conditional recommendation.',
 grammarKeys:['compare','purpose'],
 vocabulary:[
  ['la réparabilité','repairability','La réparabilité dépend de l’accès aux pièces.'],
  ['un devis','estimate','Le devis ne garantit pas le prix final en cas de défaut caché.'],
  ['une pièce détachée','spare part','La pièce détachée sera disponible dans deux semaines.'],
  ['une garantie','warranty','La garantie couvre une catégorie de panne précise.'],
  ['une consommation électrique','electricity consumption','La consommation électrique est estimée dans des conditions standard.'],
  ['la durée de vie','service life','La durée de vie restante ne peut pas être prévue avec certitude.'],
  ['un appareil reconditionné','refurbished device','Un appareil reconditionné peut réduire le coût initial.'],
  ['un coût total','total cost','Le coût total inclut les frais de déplacement et de réparation.'],
  ['une incertitude','uncertainty','Une incertitude subsiste sur la carte électronique.'],
  ['une empreinte environnementale','environmental footprint','Une empreinte environnementale ne se résume pas à la facture énergétique.'],
  ['un usage essentiel','essential use','Un usage essentiel peut justifier une solution de remplacement rapide.'],
  ['un délai de livraison','delivery delay','Le délai de livraison pourrait empêcher une réparation immédiate.']
 ],
 dialogue:[
  ['Sofia','Le réfrigérateur de la résidence ne refroidit plus correctement; le réparateur propose un devis de 180 euros, sous réserve du diagnostic final.','The residence fridge no longer cools properly; the technician estimates €180, subject to final diagnosis.'],
  ['Amine','Le fabricant annonce qu’un modèle neuf consommerait 25 % d’électricité en moins dans un essai standard.','The manufacturer claims a new model would use 25% less electricity in a standard test.'],
  ['Sofia','Cette comparaison ne précise pas notre consommation réelle ni l’impact de la fabrication du nouvel appareil.','That comparison specifies neither our actual usage nor the impact of manufacturing a new appliance.'],
  ['Clara','Une pièce détachée sera livrée dans quinze jours, mais les habitants ont besoin d’un stockage alimentaire sûr maintenant.','A spare part will arrive in fifteen days, but residents need safe food storage now.'],
  ['Amine','Nous pourrions emprunter un appareil de remplacement provisoire plutôt que de choisir dans l’urgence.','We could borrow a temporary replacement instead of deciding in haste.'],
  ['Sofia','Cependant, si la panne concerne aussi la carte électronique, le devis pourrait augmenter.','However, if the fault also concerns the circuit board, the estimate may rise.'],
  ['Clara','Le vendeur propose un appareil reconditionné avec une garantie écrite; son historique d’utilisation reste partiel.','The seller offers a refurbished appliance with a written warranty; its history remains partial.'],
  ['Amine','Comparons le coût total, le délai, les conditions de garantie et la sécurité, sans promettre une économie certaine.','Let us compare total cost, time, warranty conditions and safety without promising a certain saving.'],
  ['Sofia','Je privilégierais la réparation si le diagnostic confirme un coût limité et si une solution temporaire protège les aliments.','I would prefer repair if diagnosis confirms a limited cost and a temporary solution protects the food.']
 ],
 readingTitle:'Un choix durable qui dépend de plusieurs conditions',
 paragraphs:[
  'Dans une résidence associative fictive, le vieux réfrigérateur collectif présente une panne. Le technicien établit un premier devis de 180 euros pour remplacer une pièce, tout en précisant qu’un problème supplémentaire pourrait être découvert. Le fabricant, de son côté, promeut un modèle neuf qui consommerait 25 % d’électricité en moins dans un test normalisé. Aucun des documents ne fournit la consommation exacte de l’appareil actuel dans les conditions de la résidence. Les habitants ne doivent donc pas convertir l’écart annoncé en économie annuelle garantie. Ils ignorent aussi combien de temps chacun des deux appareils fonctionnerait après la décision.',
  'Les enjeux ne sont pas seulement financiers. La pièce nécessaire à la réparation doit arriver dans quinze jours, et les habitants ont besoin d’un stockage alimentaire sûr dès cette semaine. Une association voisine propose le prêt d’un réfrigérateur temporaire. Un vendeur présente également un modèle reconditionné moins coûteux qu’un produit neuf, accompagné d’une garantie limitée à certains défauts. La responsable demande de comparer le contenu exact de la garantie plutôt que son intitulé. Certains habitants accordent la priorité au délai; d’autres souhaitent éviter de jeter un appareil qui pourrait encore servir plusieurs années.',
  'La réunion aboutit à une décision conditionnelle: faire confirmer la panne et le prix, vérifier le prêt temporaire, puis comparer trois options selon le coût total, la sécurité, le délai et les informations environnementales réellement disponibles. Le groupe refuse d’affirmer que la réparation sera toujours plus écologique, car l’impact du transport, de la fabrication et de l’énergie dépend des situations. Il refuse aussi de présenter le modèle neuf comme automatiquement rentable à partir d’un seul chiffre promotionnel. Un compte rendu public annoncera les critères et les inconnues, puis expliquera pourquoi les priorités retenues conduisent au choix final.'
 ],
 evidence:[
  {label:'Fictional technician conditional repair estimate',type:'data',french:'Devis préliminaire de 180 euros pour remplacer une pièce accessible. Le coût définitif dépend de l’inspection de la carte électronique. Pièce disponible sous quinze jours; l’appareil actuel ne doit pas servir à conserver des aliments sensibles avant la réparation.'},
  {label:'Fictional manufacturer and reseller comparison note',type:'poster',french:'Le nouveau modèle pourrait consommer 25 % d’électricité en moins dans un test standardisé, sans estimation vérifiée pour la résidence. Un appareil reconditionné est proposé avec une garantie portant sur certaines pannes, mais son historique d’utilisation est incomplet.'}
 ],
 reading:[
  ['What prevents treating the repair quote as a guaranteed final price?','un diagnostic supplémentaire','un paiement déjà encaissé','une garantie absolue','The technician has not ruled out a circuit-board problem, so the quoted price is explicitly conditional.'],
  ['Why does the claimed 25% electricity saving not establish annual savings?','la consommation réelle est inconnue','la facture est déjà calculée','les appareils sont identiques','The percentage comes from standardized conditions and omits the residence’s actual usage and other costs.'],
  ['Which immediate need complicates a fifteen-day repair?','un stockage alimentaire sûr','une nouvelle couleur','une livraison de meubles','Residents need safe food storage before the spare part arrives, making a temporary replacement relevant.']
 ],
 compare:[
  ['Which sources leave different uncertainties unresolved?','diagnostic et usage réel','date de la fête et météo','garantie totale et prix définitif','The repair estimate depends on diagnosis, while the promotional efficiency claim is not verified under actual local conditions.'],
  ['What is the strongest justified recommendation from both sources?','comparer des options sous conditions','acheter immédiatement un neuf','réparer sans diagnostic','A conditional comparison of safety, verified costs and time respects the limitations of both fictional documents.']
 ],
 listen:[
  ['What is the initial repair quote?','180 euros','80 euros','280 euros','Sofia says the estimate is €180, explicitly subject to further diagnosis.'],
  ['What efficiency difference does Amine report?','25 %','15 %','50 %','The manufacturer advertises twenty-five percent lower electricity use under standardized test conditions.'],
  ['How long may the part take to arrive?','quinze jours','deux jours','un mois','Clara explicitly says the spare part is due in fifteen days, creating an immediate storage problem.'],
  ['What temporary solution does Amine suggest?','un prêt d’appareil','la vente immédiate','la suppression du service','Amine suggests borrowing a temporary replacement so the group does not decide under artificial urgency.'],
  ['What remains uncertain about the refurbished appliance?','son historique d’utilisation','son existence','son prix affiché','The seller offers a written warranty but cannot provide the complete past usage record.'],
  ['Under which condition would Sofia prefer repair?','un coût confirmé et une solution provisoire','une promesse de garantie totale','un emballage moins cher','Her conditional support depends on a limited confirmed cost and safe interim food storage.']
 ],
 clozes:[
  ['Complétez la comparaison : « Le neuf est ___ coûteux à l’achat, mais son usage reste à évaluer. »','plus','Plus ... que or plus + adjective expresses comparison; price alone does not capture lifecycle costs.','comparison'],
  ['Complétez le but : « Nous demandons un diagnostic ___ éviter une dépense injustifiée. »','pour','Pour followed by the infinitive expresses the purpose of obtaining a reliable diagnosis.','purpose']
 ],
 order:['Le devis ne garantit pas le prix final.',['pas le prix final.','Le devis ne garantit'],'The two parts of the written negation frame garantit; the provisional estimate does not establish a final price.','negation and precision'],
 writing:{
  listening:['Write a 150–210-word French summary for residents, attributing claims, stating the urgent need and explaining the proposed conditional decision.','Sofia indique qu’un premier devis de 180 euros reste soumis au diagnostic final. Amine rapporte l’affirmation du fabricant selon laquelle un appareil neuf pourrait consommer 25 % d’électricité en moins lors d’un test standard. Rien ne prouve encore que cet écart correspondrait à la résidence. Clara souligne qu’une pièce détachée demande quinze jours, alors que les habitants doivent conserver les aliments en sécurité immédiatement. Un prêt temporaire pourrait résoudre cette difficulté. Le groupe prévoit donc de confirmer la panne, de vérifier les conditions des garanties et de comparer les coûts totaux avant de décider. Aucun participant ne dispose de preuves suffisantes pour promettre une solution universellement plus écologique.'],
  sources:['Compare the repair estimate with the commercial efficiency note in 170–220 words of French; separate uncertainty from known constraints.','Le devis du technicien constitue une estimation conditionnelle: le prix de 180 euros pourrait évoluer si la carte électronique présente un défaut. La note commerciale avance une réduction de consommation de 25 %, mesurée dans des conditions standard qui ne correspondent pas nécessairement à celles de la résidence. Ces deux textes apportent des informations utiles, mais ils ne permettent ni d’établir le coût final ni de calculer le bénéfice environnemental complet. Il faut aussi tenir compte du délai de quinze jours et de l’obligation de conserver les aliments en sécurité. Je recommanderais un diagnostic complémentaire et un prêt temporaire, puis une comparaison documentée entre réparation, achat reconditionné et remplacement neuf.'],
  debate:['Recommend a sustainable response to the fridge failure in 170–220 French words. Address a credible objection and name conditions that would reverse your choice.','Je choisirais d’abord de faire confirmer la réparabilité du réfrigérateur, car remplacer immédiatement un appareil peut entraîner des coûts matériels évitables. Toutefois, cette préférence n’a rien d’absolu: le devis est provisoire et la pièce mettra quinze jours à arriver. Certains habitants objectent à juste titre que la sécurité alimentaire doit primer; un appareil de prêt serait donc indispensable pendant l’attente. De même, le gain énergétique annoncé pour le modèle neuf ne permet pas encore de calculer une économie réelle. Je comparerais le coût total, les garanties et les données disponibles sur la consommation. Si le diagnostic révélait une réparation disproportionnée ou impossible, je privilégierais un remplacement adapté plutôt que d’entretenir une fausse économie.']
 },
 oral:['Give a two-minute conditional recommendation to the fictional residents; distinguish a quote, an advertisement and an immediate safety obligation.','Je recommande de demander un diagnostic définitif et d’organiser un prêt provisoire pour protéger les aliments. Le devis de 180 euros n’est pas garanti et le gain de 25 % annoncé pour un appareil neuf ne décrit pas notre consommation réelle. Si la réparation est raisonnable, nous la privilégierons; sinon, nous comparerons le neuf et le reconditionné.']
};
export const U42_153=Object.freeze([originalB2DebateProduction(story,153)]);
