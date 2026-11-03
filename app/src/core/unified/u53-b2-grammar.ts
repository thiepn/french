import type {A1Grammar} from './u6-a1-model.ts';

/** New original narrative and humour teaching, without modifying preceding 257 qualified source units. */
export const U53_B2_GRAMMAR:Readonly<Record<string,readonly A1Grammar[]>>=Object.freeze({
 'transfer-164':Object.freeze([
  {
   heading:'Imparfait, passé composé et plus-que-parfait : organiser un récit vivant',
   explanation:'Un récit oral ne doit pas aligner tous les verbes au même temps. L’imparfait installe un cadre qui dure : « la place sentait la terre chaude », « les bénévoles installaient les chaises ». Le passé composé fait avancer la suite des événements : « une goutte est tombée », « le micro a grésillé », « Lila a ouvert les portes ». Le plus-que-parfait remonte à une action antérieure à ce moment du récit : « Thomas avait déjà préparé un programme de secours ». Les repères « alors que », « au moment où » et « soudain » signalent des relations temporelles plutôt qu’une simple liste. Une tension narrative apparaît lorsqu’un événement ponctuel interrompt une activité inachevée : « Nous installions encore les chaises quand la pluie a commencé ». Dans un récit bien construit, les informations anciennes ne sont révélées que lorsqu’elles aident l’auditeur à comprendre le nouvel imprévu. Les temps ne constituent pas un test de vitesse de lecture : ils organisent ce que l’auditeur imagine et ce qui change.',
   examples:[
    ['La place était silencieuse quand une goutte a frappé le micro; Thomas avait rangé son plan de secours dans son sac.','The square was quiet when a drop struck the microphone; Thomas had put his backup plan in his bag.'],
    ['Pendant que Lila vérifiait le passage, les bénévoles ont déplacé les premières chaises.','While Lila was checking the arcade, volunteers moved the first chairs.']
   ],
   correction:[
    'Nous avions installé les chaises quand la pluie avait commencé et la place a senti la terre chaude.',
    'Nous installions les chaises, la place sentait la terre chaude, puis la pluie a commencé.',
    'In this scene the chair arrangement and sensory background were continuing, so use imparfait; the rain beginning is the bounded narrative turn in passé composé. Plus-que-parfait is appropriate only for an earlier completed preparation.'
   ]
  },
  {
   heading:'Suspense, rythme et chute : jouer sur les connecteurs sans inventer une preuve',
   explanation:'Pour raconter un contretemps, commencez par un détail sensoriel et ne donnez pas immédiatement la solution. « D’abord », « tandis que », « soudain », « ensuite » et « enfin » sont utiles, mais leur accumulation mécanique affaiblit le récit. L’oral peut ralentir sur une phrase descriptive, accélérer avec deux actions brèves, puis marquer une pause avant la chute. L’expression « j’ai cru que » rapporte une interprétation personnelle et n’établit pas une réalité commune. Dans notre histoire, Inès croyait la soirée perdue; le lecteur découvre ensuite que Lila avait repéré un passage couvert. La question de l’enfant sur la pluie devient drôle parce qu’elle renverse un contretemps que tout le récit avait présenté comme indésirable. Une chute n’est pas obligée de résumer une morale ni de prétendre que toutes les difficultés ont disparu. Une voix narrative précise peut laisser un fait modeste et inattendu produire l’effet. Quand vous transformez un brouillon, séparez les événements de l’histoire des procédés créatifs que vous choisissez pour la raconter.',
   examples:[
    ['Je croyais que tout était perdu; puis Lila a montré le passage couvert derrière le marché.','I thought everything was lost; then Lila pointed out the covered arcade behind the market.'],
    ['Après une seconde de silence, l’enfant a demandé si nous pouvions commander la pluie.','After a second of silence, the child asked whether we could order rain.']
   ],
   correction:[
    'Toutes les personnes étaient heureuses dès le début, la pluie était prévue, et la soirée a été parfaite.',
    'Nous ne savions pas encore si le passage conviendrait; après la vérification de Lila, la lecture a repris et un enfant a fait rire le groupe.',
    'The original narration includes uncertainty before moving chairs, and the downpour was an unexpected event. Retaining hesitation makes the sequence plausible and the child’s punchline earned without inventing universal happiness.'
   ]
  }
 ] as const),
 'transfer-165':Object.freeze([
  {
   heading:'Antiphrase et sous-entendu : le contexte inverse le sens littéral',
   explanation:'Une antiphrase formule apparemment l’inverse du sens voulu. « Il ne manquait que le pain » serait une information banale si la table était vide; devant plusieurs paniers de baguettes, elle signale au contraire un excès de pain. Le lecteur a besoin de connaître le décor pour comprendre l’ironie. L’expression restrictive « ne… que » signifie « seulement »; l’antiphrase n’en modifie pas la grammaire, mais rend la proposition volontairement contraire à la situation. « Quel succès ! » peut être sincère ou ironique selon le contexte; on ne peut pas classer la phrase sans observer la scène, la relation entre interlocuteurs et leur réaction. Dans un récit écrit, où la voix n’est pas réellement audible, ajoutez un geste (« Bastien retenait son rire »), une description (« la table était couverte de pains ») ou une reformulation. Ne confondez jamais une hypothèse sur l’intonation avec une preuve de voix entendue. L’enjeu de niveau B2 est de justifier une interprétation et de faire entendre le sous-entendu par les détails narratifs.',
   examples:[
    ['Devant sept paniers, Aya a déclaré : « Quelle chance, il ne manquait que le pain ! »','In front of seven baskets, Aya said: “How lucky, the only thing missing was bread!”'],
    ['Aya plaisantait sur son invitation imprécise; elle ne disait pas que Farah avait mal agi.','Aya was joking about her imprecise invitation; she was not saying Farah had acted badly.']
   ],
   correction:[
    'Il ne manquait que le pain signifie que personne n’avait apporté de pain, même quand la table en débordait.',
    '« Il ne manquait que le pain » est une antiphrase : le contexte montre précisément que le pain est présent en abondance.',
    'The literal interpretation contradicts the source’s bread-filled table. Preserve the grammatically restrictive form while explaining that the visual scene licenses an ironic reversal, not a factual shortage.'
   ]
  },
  {
   heading:'Autodérision et réparation : plaisanter sans rabaisser son interlocuteur',
   explanation:'La plaisanterie peut viser une maladresse partagée plutôt qu’une personne. « J’avais oublié de préciser les plats » met le locuteur au centre de son erreur; « tu n’as rien compris » transforme le même incident en reproche. Au niveau B2, l’expression « je me moquais de mon message, pas de toi » clarifie explicitement la cible de l’humour. Les formulations de concession (« même si cette phrase semblait sérieuse », « bien que Farah ait d’abord hésité ») reconnaissent une interprétation plausible avant d’expliquer l’ironie. Le conditionnel de politesse (« je pourrais reformuler ») offre une réparation sans ordonner à l’autre de rire. L’autodérision ne signifie pas que toute blague sur soi sera automatiquement comprise; si le contexte manque, expliquez le sous-entendu ou changez de registre. Dans une anecdote, une répétition progressive prépare la surprise, une pause évite de précipiter la chute et un dernier retour au message initial crée une conclusion naturelle. La précision du registre permet de protéger la relation sans éliminer le plaisir d’un récit humoristique.',
   examples:[
    ['Si cette phrase t’a semblé étrange, je plaisantais sur mon invitation trop vague, pas sur ton panier.','If that phrase sounded odd, I was joking about my own vague invitation, not your basket.'],
    ['Bien que Farah ait d’abord compris l’expression au pied de la lettre, elle a ensuite saisi la plaisanterie.','Although Farah first took the expression literally, she later understood the joke.']
   ],
   correction:[
    'Tu es ridicule de ne pas comprendre mon ironie, et tu dois rire puisque nous plaisantons.',
    'Je vois que ma remarque pouvait prêter à confusion : je me moquais de ma propre invitation, pas de toi.',
    'A listener’s literal reading can be understandable when prosody and context are unclear. Repair by naming the actual target of the joke and avoid pressuring anyone to laugh or treating a confused guest as a victim.'
   ]
  }
 ] as const)
});
