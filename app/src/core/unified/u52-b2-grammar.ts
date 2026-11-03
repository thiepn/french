import type {A1Grammar} from './u6-a1-model.ts';

/** Four original B2 professional language chapters for 162–163; not a CEFR grade. */
export const U52_B2_GRAMMAR:Readonly<Record<string,readonly A1Grammar[]>>=Object.freeze({
 'transfer-162':Object.freeze([
  {
   heading:'Présenter une réalisation : contexte, action personnelle et résultat collectif',
   explanation:'Dans un entretien, une réalisation est convaincante si le récit distingue le contexte, les actions du candidat et le résultat effectivement observé. Les verbes doivent refléter la responsabilité réelle : « j’ai rédigé un guide » indique une action personnelle, tandis que « nous avons traité quatre-vingts dossiers » attribue le résultat à une équipe. Le passif « quatre-vingts dossiers ont été traités par l’équipe » est utile lorsque la distinction entre contribution et total doit rester explicite. Dire « j’ai doublé la productivité » serait une comparaison causale non fondée sans mesure préalable et sans méthode commune. Les marqueurs « au total », « pendant deux semaines » et « sans qu’une amélioration causale ait été mesurée » précisent le périmètre. Une présentation structurée peut souligner des compétences transférables sans inventer des chiffres ni minimiser le travail d’autrui. La qualité linguistique tient à la précision des agents, des temps et des limites.',
   examples:[
    ['J’ai conçu le guide; pendant deux semaines, notre équipe a traité quatre-vingts dossiers.','I designed the guide; over two weeks our team processed eighty files.'],
    ['Bien que le résultat collectif soit encourageant, l’effet précis du guide n’a pas été mesuré.','Although the team outcome is encouraging, the precise impact of the guide has not been measured.']
   ],
   correction:[
    'J’ai personnellement vérifié quatre-vingts dossiers et doublé la productivité de toute l’équipe.',
    'J’ai rédigé le guide utilisé par trois personnes; ensemble, nous avons traité quatre-vingts dossiers en deux semaines, sans mesure d’un gain causal.',
    'The applicant authored the guide but two colleagues checked the files; an aggregate two-week count does not prove doubled productivity. Separate the agents and preserve the missing comparison rather than inventing an individual result.'
   ]
  },
  {
   heading:'Répondre avec réserve et poser une question précise au conditionnel',
   explanation:'Un entretien professionnel implique deux directions de parole : répondre clairement et vérifier ce que l’employeur demande. Le conditionnel de politesse (« pourriez-vous préciser », « je souhaiterais connaître ») évite un ton d’injonction tout en autorisant une question directe sur les objectifs, le délai et la responsabilité de validation. « Je pourrais proposer un exemple test » exprime une réponse envisagée, non un résultat déjà obtenu. Lorsqu’un parcours comprend une interruption privée, « j’ai interrompu mon activité pour des raisons personnelles que je préfère garder privées » reste une description véridique sans divulgation forcée; une nouvelle expérience peut être décrite séparément. La concession « bien que mon parcours ne soit pas linéaire » nécessite le subjonctif et n’équivaut pas à un aveu d’incompétence. La formulation « avant d’annoncer un délai, je demanderais qui valide » rend l’engagement conditionnel aux informations manquantes. Refusez les promesses absolues que l’entretien ne permet pas de tenir.',
   examples:[
    ['Pourriez-vous préciser qui valide le contrôle qualité durant les premières semaines ?','Could you clarify who approves quality checks in the first weeks?'],
    ['Bien que mon parcours ne soit pas linéaire, j’ai récemment respecté plusieurs échéances convenues.','Although my career path is not linear, I recently met several agreed deadlines.']
   ],
   correction:[
    'Je peux garantir zéro erreur dès le premier jour, et je ne demanderai jamais de précisions.',
    'Je demanderais d’abord les consignes, proposerais un exemple limité et vérifierais la procédure de validation avant de promettre un délai.',
    'The professional response uses conditional proposals and a clarified approval process instead of a baseless zero-error guarantee. An achievable commitment depends on knowing who decides and what needs review.'
   ]
  }
 ] as const),
 'transfer-163':Object.freeze([
  {
   heading:'Recevoir un retour précis sans confondre erreur et jugement de personne',
   explanation:'Lorsqu’un responsable signale une erreur, la réponse professionnelle peut reconnaître un acte vérifiable sans se dévaloriser : « j’ai utilisé une ancienne version sans vérifier son numéro; je vais corriger ce point ». Le passé composé nomme l’action achevée; le futur proche ou simple présente une correction envisagée. Une phrase comme « je suis incapable de travailler » généralise abusivement à partir d’une erreur ponctuelle. Pour demander une clarification, le conditionnel de politesse (« pourriez-vous préciser la version à retenir ? ») et la reformulation « si j’ai bien compris » évitent de déplacer la responsabilité sur le collègue. Le discours rapporté « Ilyès a expliqué que sa consigne ne précisait pas la version » est différent de « Ilyès a causé toutes les erreurs » : il attribue exactement ce qui a été reconnu. Une bonne passation nomme la correction, son auteur et la prochaine vérification sans flatterie ni accusation.',
   examples:[
    ['J’ai repris une ancienne feuille sans vérifier sa version; je documenterai la correction.','I reused an old sheet without checking its version; I will document the correction.'],
    ['Pourriez-vous préciser quelle version doit servir de référence avant que je poursuive ?','Could you clarify which version should serve as reference before I continue?']
   ],
   correction:[
    'Puisque deux versions ont été mélangées, je suis incapable et Ilyès est entièrement responsable.',
    'J’ai utilisé une ancienne feuille sans contrôle de version; je corrigerai ce point et demanderai confirmation de la référence commune.',
    'A specific error does not justify a global judgment of ability or sole blame assigned to a colleague. Name the checked action, propose a traceable correction and ask the appropriate decision maker to confirm the reference.'
   ]
  },
  {
   heading:'Contrôle interne, validation et publication : le statut verbal d’une tâche',
   explanation:'Les verbes « vérifier », « transmettre », « valider » et « publier » décrivent quatre étapes différentes. « Six fiches ont été vérifiées » se rapporte à un contrôle réalisé; « elles seront transmises pour contrôle interne » annonce une circulation limitée; « la responsable doit encore valider » marque une décision en attente; « les fiches sont publiées » serait faux tant que la mise en ligne n’a pas eu lieu. Les formes passives permettent de mettre l’accent sur le statut, mais ne doivent pas dissimuler qui autorise la dernière étape. Pour corriger une consigne ambiguë, utilisez « si j’ai bien compris, nous transmettons six fiches, tandis que deux restent en attente ». « En attendant que » appelle le subjonctif lorsque l’autorisation est future : « en attendant que la responsable confirme ». La politesse ne doit jamais transformer une hypothèse en fait accompli : la précision des temps et des verbes protège le destinataire contre une fausse annonce d’achèvement.',
   examples:[
    ['Six fiches vérifiées seront transmises pour contrôle interne; aucune publication n’a été autorisée.','Six checked files will be sent for internal review; no publication has been authorized.'],
    ['Nous gardons deux fiches en attente jusqu’à ce que la responsable confirme la bonne version.','We keep two files pending until the manager confirms the correct version.']
   ],
   correction:[
    'Nous avons envoyé six fiches en interne, donc les huit fiches ont été définitivement validées et publiées.',
    'Six fiches ont été transmises pour contrôle interne, deux restent à clarifier et aucune mise en ligne définitive n’a été autorisée.',
    'An internal review transfer is not final approval or public release. Distinguish six checked records from two unresolved records and use the correct decision-status verbs instead of inflating completion.'
   ]
  }
 ] as const)
});
