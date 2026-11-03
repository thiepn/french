import type {A1Grammar} from './u6-a1-model.ts';

/** New original B2 linguistic teaching for lesson 157, not a scoring rubric. */
export const U49_B2_GRAMMAR:Readonly<Record<string,readonly A1Grammar[]>>=Object.freeze({
 'transfer-157':Object.freeze([
  {
   heading:'Discours rapporté, source citée et degré de certitude',
   explanation:'Une capture tronquée, un avis signé et une intention annoncée ne possèdent pas le même statut. « Une image affirme que » rapporte le contenu de la capture sans l’authentifier. « Selon l’avis municipal, une déviation est envisagée » attribue une proposition conditionnelle; « la mairie a supprimé la ligne » transformerait abusivement ce projet en événement acquis. En français journalistique, le conditionnel de réserve (« la ligne serait supprimée ») peut signaler un fait non confirmé, mais il ne remplace ni la citation d’une source ni la vérification du document intégral. Après « la rédaction indique que », conservez le temps, le sujet et surtout la modalité de la source. Une rectification expose d’abord l’erreur exacte, puis énonce ce qui est établi et ce qui reste incertain.',
   examples:[
    ['Une capture non datée affirme que la ligne serait supprimée; aucun avis signé ne le confirme.','An undated screenshot claims that the route would be cancelled; no signed notice confirms it.'],
    ['Selon l’avis municipal, une déviation provisoire est envisagée si les travaux ont lieu.','According to the municipal notice, a temporary detour is envisaged if works proceed.']
   ],
   correction:[
    'La mairie a définitivement supprimé la T7, selon une capture sans date.',
    'Une capture non datée évoque une suppression, mais l’avis municipal prévoit seulement une déviation provisoire sous conditions.',
    'A screenshot with no date has lower evidentiary status than the attributed dated notice. Correct the asserted permanence and retain the detour condition instead of hiding the uncertainty.'
   ]
  },
  {
   heading:'Concession au subjonctif et rectification sans effacer un problème réel',
   explanation:'Une rectification responsable sépare la fausse conclusion d’une objection valide. « Bien que la rumeur soit infondée, l’accessibilité reste à vérifier » garde le subjonctif « soit » après « bien que » et reconnaît le problème qui subsiste. « Même si la déviation est limitée, elle peut gêner certains usagers » construit une concession à l’indicatif. Ni formule ne démontre que l’arrêt provisoire est accessible. Pour écrire une correction précise, reformulez la thèse erronée, concédez une conséquence possible, présentez la réserve vérifiable et annoncez la prochaine vérification. Ne transformez jamais le sentiment de 62 % des répondants en preuve que la décision est prise ni en opinion de tous les voyageurs.',
   examples:[
    ['Bien que l’annonce de suppression soit infondée, l’accès à l’arrêt provisoire doit être confirmé.','Although the cancellation announcement is unfounded, access to the temporary stop must be confirmed.'],
    ['Même si le plan est annoncé pour demain, sa publication n’est pas encore garantie.','Even if the map is announced for tomorrow, its publication is not yet guaranteed.']
   ],
   correction:[
    'Bien que la rumeur est fausse, tous les problèmes sont réglés.',
    'Bien que la rumeur soit infondée, l’accessibilité de l’arrêt de remplacement reste à confirmer.',
    'Bien que requires subjunctive soit, not indicative est. More importantly, refuting permanent closure does not verify accessibility; preserve the substantive unresolved objection in the correction.'
   ]
  }
 ] as const)
});
