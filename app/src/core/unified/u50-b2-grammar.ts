import type {A1Grammar} from './u6-a1-model.ts';

/** Original media-update grammar for linked B2 158–159. Not a human examiner or CEFR score. */
export const U50_B2_GRAMMAR:Readonly<Record<string,readonly A1Grammar[]>>=Object.freeze({
 'transfer-158':Object.freeze([
  {
   heading:'Dire ce qu’un document affirme sans conclure à ce qu’il ne mesure pas',
   explanation:'Un plan décrit un itinéraire prévu et une observation décrit un état constaté à un moment précis. Pour une opposition B2 précise, employez « selon le plan daté », « d’après le relevé effectué à huit heures » et « rien ne permet encore de confirmer que ». La formulation « serait praticable » attribue une possibilité non vérifiée; « est praticable » affirmerait un résultat. Le verbe « sembler » marque une réserve, mais ne remplace pas le nom et la date de la source. Ne confondez pas l’autorité administrative d’un plan avec une mesure indépendante de sa praticabilité. Un bon texte nomme la divergence, définit la portée des deux témoignages et indique exactement quel contrôle pourrait résoudre la question.',
   examples:[
    ['Selon le plan, la rampe est indiquée comme accessible, mais sa praticabilité réelle reste à vérifier.','The map labels the ramp as accessible, but actual passability still needs checking.'],
    ['D’après le relevé de huit heures, des barrières obstruaient le passage à ce moment précis.','According to the eight-o’clock observation, barriers obstructed the route at that specific moment.']
   ],
   correction:[
    'Le plan officiel prouve que la rampe est accessible pendant tout le week-end.',
    'Le plan officiel représente une rampe accessible; un contrôle sur place doit encore confirmer son état aux heures du service.',
    'The map is a dated source for a planned route, not a verified measurement of all real-world service times. Correct the scope and require an appropriate field check.'
   ]
  },
  {
   heading:'Si + présent, hypothèse et conséquence sans prédire le résultat',
   explanation:'Pour distinguer une hypothèse réaliste de son résultat encore inconnu, utilisez « si + présent de l’indicatif » suivi d’un futur : « si les barrières restent, nous demanderons une autre route ». La proposition en « si » ne signifie pas que les barrières resteront. Un rapport d’observation peut employer l’imparfait « étaient bloquées à huit heures » pour décrire le passé sans projeter ce fait sur samedi. Une réserve utile associe une heure, un lieu et une action possible. N’écrivez pas « si les barrières resteront » : après « si » conditionnel réel, la langue attend ici le présent. La prudence n’empêche pas une recommandation pratique : elle explique à partir de quel contrôle la recommandation changera.',
   examples:[
    ['Si la rampe reste bloquée samedi, la régie devra proposer un parcours vérifié.','If the ramp remains blocked Saturday, the operator will need to propose a verified route.'],
    ['Si le contrôle confirme un passage libre, nous actualiserons l’alerte sans effacer le constat de jeudi.','If the inspection confirms free passage, we will update the alert without erasing Thursday’s observation.']
   ],
   correction:[
    'Si les barrières resteront samedi, la rampe sera impossible.',
    'Si les barrières restent samedi, la rampe ne sera pas praticable dans ces conditions.',
    'After real conditional si use present restent, not future resteront; the recommendation concerns the specified condition and does not assert that it has already occurred.'
   ]
  }
 ] as const),
 'transfer-159':Object.freeze([
  {
   heading:'Actualiser au passé composé et à l’imparfait : fait, observation, effet encore inconnu',
   explanation:'Un correctif B2 distingue la chronologie d’un constat et l’état actuel annoncé. Pour l’événement ponctuel terminé, utilisez le passé composé : « la régie a publié un bulletin » ou « les barrières ont été retirées ». Pour décrire une situation passée et limitée, l’imparfait convient : « jeudi matin, la rampe était bloquée ». Conservez une source et une heure pour chaque information. Le plus-que-parfait peut marquer un fait antérieur à la correction : « nous avions signalé cet obstacle ». Évitez le présent intemporel « la rampe est bloquée » lorsque le contrôle de vendredi atteste un changement. Corriger une proposition devenue périmée ne revient pas à accuser un témoin de mensonge; l’exactitude nécessite d’indiquer le moment que chaque phrase décrit.',
   examples:[
    ['Jeudi, la rampe était bloquée; vendredi, un contrôle a constaté son dégagement.','Thursday the ramp was blocked; Friday a check found it clear.'],
    ['Nous avions signalé un obstacle précis, mais de nouvelles observations nous conduisent à actualiser notre avertissement.','We had reported a specific obstacle, but new observations lead us to update our warning.']
   ],
   correction:[
    'Jeudi la rampe est toujours bloquée, alors que vendredi elle a été libérée.',
    'Jeudi à huit heures, la rampe était bloquée; vendredi en fin de journée, elle a été constatée dégagée.',
    'Use past description était and specify each observation date. The undated present toujours would misrepresent an older report after later independent evidence.'
   ]
  },
  {
   heading:'Bien que + subjonctif : reconnaître un progrès sans déclarer le problème résolu',
   explanation:'Une concession expose un progrès réel tout en conservant une objection non réglée : « bien que la rampe ait été dégagée, l’accès au service ne soit pas nécessairement garanti ». Le subjonctif passé « ait été » suit « bien que » lorsque le fait concédé est accompli. Une phrase plus naturelle sépare deux degrés de preuve : « Bien que la rampe ait été dégagée vendredi, l’éclairage nocturne reste à vérifier. » Pour les conditions d’un nouveau service, distinguez ce qui est exigé (« la navette doit être réservée avant dix-huit heures ») de ce qui n’est qu’annoncé (« un autre canal est envisagé »). La rédaction responsable ne substitue pas une formule positive générale aux obstacles d’accès téléphonique ou d’horaire.',
   examples:[
    ['Bien que la rampe ait été dégagée vendredi, personne n’a encore contrôlé l’accès samedi soir.','Although the ramp was cleared Friday, no one has yet checked Saturday-night access.'],
    ['Même si une navette est annoncée, sa réservation téléphonique préalable peut exclure certains voyageurs.','Even if a shuttle is announced, its advance phone booking can exclude some travelers.']
   ],
   correction:[
    'Bien que la rampe a été dégagée, tous les trajets sont accessibles.',
    'Bien que la rampe ait été dégagée vendredi, la réservation et les contrôles de nuit restent à vérifier.',
    'Bien que calls for the subjunctive ait été, not the indicative a été; one confirmed improvement cannot establish unverified night service or inclusive booking.'
   ]
  }
 ] as const)
});
