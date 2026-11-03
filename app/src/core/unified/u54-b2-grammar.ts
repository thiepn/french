import type {A1Grammar} from './u6-a1-model.ts';

/** Original authored early-B2 procedural mediation grammar; no change to historical teaching. */
export const U54_B2_GRAMMAR:Readonly<Record<string,readonly A1Grammar[]>>=Object.freeze({
 'transfer-166':Object.freeze([
  {
   heading:'Annoncer le but, puis séquencer une consigne sans noyer le débutant',
   explanation:'Quand on explique un jeu inconnu, les règles grammaticalement correctes ne suffisent pas : le destinataire doit comprendre dans quel ordre il peut agir. Commencez par un but au présent (« Le but est de relier les quatre îles »), puis donnez le premier geste à l’impératif (« Disposez les cartes en carré »). « Avant de » suivi de l’infinitif exprime une vérification préalable : « Avant de poser une baguette, vérifiez si les îles sont voisines ». « Ensuite » introduit une action; « après avoir posé » précise qu’une étape est achevée. Les restrictions doivent être explicites : « Ne reliez pas les coins opposés » et « Chaque nouveau lien doit ajouter une île ». Une exception doit rester située : le premier lien est libre parmi les quatre côtés, mais les suivants doivent partir du réseau déjà créé. Pour contrôler la compréhension, évitez de vous contenter d’un simple « oui ». Demandez une action argumentée : « Montrez-moi le prochain côté et dites pourquoi il est autorisé ». Cela invite le participant à utiliser la règle plutôt qu’à répéter une phrase par politesse.',
   examples:[
    ['Avant de poser une baguette, vérifiez que les deux îles sont voisines sur un côté du carré.','Before placing a stick, check that both islands are adjacent on a side of the square.'],
    ['Après avoir relié A et B, ajoutez une île nouvelle plutôt que de répéter le même lien.','After connecting A and B, add a new island rather than repeating the same link.']
   ],
   correction:[
    'Pose la première, puis la deuxième, puis la troisième baguette; tu verras bien si les règles étaient correctes.',
    'D’abord, oriente les quatre cartes; puis relie deux voisines. Après ce premier geste, chaque nouvelle baguette doit ajouter une île au réseau.',
    'A list of three identical commands omits the goal and the distinct later-turn condition. Explicit sequencing, adjacency and adding one new island make the learner’s next move checkable and avoid treating a mere sequence of hand motions as understanding.'
   ]
  },
  {
   heading:'Si… alors… et pourriez-vous… : vérifier une règle sans donner la réponse',
   explanation:'Une explication de niveau B2 doit pouvoir s’adapter quand le novice propose une action erronée. La condition « Si A et B sont déjà reliées, vous pouvez ajouter B–C » relie un état observé à une décision autorisée. Ne confondez pas un lien possible avec une obligation : « Vous pouvez relier B et C » laisse le choix, tandis que « vous devez relier B et C » serait faux puisque A–D est aussi possible. Le conditionnel de politesse « Pourriez-vous me montrer un autre côté ? » permet de vérifier la compréhension sans imposer immédiatement une solution. Dans « Pourquoi cette diagonale est-elle interdite ? », le pourquoi conduit à la règle spatiale; « Que faudrait-il changer ? » invite à chercher un contre-exemple. Les connecteurs « en revanche », « puisque » et « autrement dit » aident à distinguer une restriction permanente des exceptions du premier tour. Une réparation respectueuse peut commencer par « Je comprends votre idée », puis nommer exactement le problème sans juger la personne. Terminez par une nouvelle situation pour vérifier que la règle peut être transférée au-delà de la démonstration initiale.',
   examples:[
    ['Si A et B sont reliées, vous pourriez ajouter A–D ou B–C : quelle option choisiriez-vous et pourquoi ?','If A and B are connected, you could add A–D or B–C: which would you choose, and why?'],
    ['Pourriez-vous expliquer pourquoi une seconde baguette entre A et B n’ajouterait aucune île ?','Could you explain why a second stick between A and B would not add any island?']
   ],
   correction:[
    'Tu dois poser B–C après A–B, et je vais le faire à ta place pour vérifier que tu as compris.',
    'Après A–B, tu peux ajouter B–C ou A–D. Pourrais-tu choisir un côté et expliquer comment il introduit une île nouvelle ?',
    'The invented game allows multiple legal continuations. The correction distinguishes possibility from obligation and uses a justified teach-back question instead of silently selecting the novice’s move and treating imitation as independent comprehension.'
   ]
  }
 ] as const),
 'transfer-167':Object.freeze([
  {
   heading:'Repères spatiaux, impératif et vérification : ma droite ou la vôtre ?',
   explanation:'Pour guider quelqu’un en face de soi, « à droite » est ambigu si l’on ne précise pas le point de vue. Commencez par une consigne d’orientation observable : « Placez la feuille en losange, avec un sommet près de vous et un autre loin de vous ». L’impératif peut alors décrire un geste ciblé : « Rapprochez les deux coins latéraux », « Vérifiez leur chevauchement », « Repliez le bas ». « Avant de marquer le pli » situe un contrôle avant une action difficile à corriger; « après avoir vérifié » marque une étape terminée. Les pronoms doivent renvoyer à un élément clairement nommé : « Le dernier pli est mal placé ? Défaites-le » reste plus précis que « Faites-le autrement ». À l’oral, le formateur peut demander « Quel coin voyez-vous près de vous ? » plutôt que supposer que l’apprenant partage automatiquement ses repères. Le critère essentiel est une consigne autonome et vérifiable, non une performance physique prétendument observée à distance.',
   examples:[
    ['Orientez le carré en losange, puis rapprochez les deux sommets latéraux vers le centre.','Orient the square as a diamond, then bring the two side corners toward the centre.'],
    ['Avant de marquer le pli, vérifiez que les pointes se chevauchent légèrement.','Before creasing, check that the points overlap slightly.']
   ],
   correction:[
    'Prends le coin à droite, de mon point de vue, et plie-le; si tu ne comprends pas, copie simplement mes gestes.',
    'Depuis votre point de vue, placez un sommet en haut, puis rapprochez le coin de votre droite vers le centre; vérifiez avant de marquer le pli.',
    'When participants face one another, their left and right differ. Defining the learner’s perspective and a visible checkpoint resolves the ambiguity, while asking for an explanation supports independent action rather than blind imitation.'
   ]
  },
  {
   heading:'Si le pli résiste… pour que la languette puisse… : condition et finalité',
   explanation:'Une instruction adaptative ne se réduit pas à un ordre. « Si le pli est de travers, défaites-le doucement » est une condition suivie d’un impératif : elle explique quoi faire quand le résultat observé ne correspond pas à l’objectif. Dans « Laissez le sommet supérieur libre pour qu’il puisse former une languette », la locution « pour que » exprime un but et appelle le subjonctif « puisse ». Ne la confondez pas avec « parce que », qui donnerait une cause au lieu d’un objectif. « À condition que les côtés se rejoignent » indique une condition nécessaire, mais ne garantit pas une fermeture permanente : sans adhésif, la languette peut se rouvrir. Une consigne responsable reconnaît cette limite au lieu de promettre une enveloppe prête à être expédiée. Une bonne réparation comporte trois parties : le signe observé (« le coin dépasse »), une action réversible (« défaites le dernier pli ») et une nouvelle vérification (« les deux pointes se rejoignent-elles ? »). Enfin, l’apprenant reformule le procédé avec ses propres mots pour montrer comment il peut résoudre seul le prochain problème.',
   examples:[
    ['Si les deux côtés ne se rejoignent pas, défaites le dernier pli et recommencez sans forcer.','If both sides do not meet, undo the last fold and try again without forcing it.'],
    ['Laissez le haut libre pour que la languette puisse se rabattre après avoir glissé le mot.','Leave the top free so the flap can fold down after the note has been inserted.']
   ],
   correction:[
    'Puisque la feuille résiste, appuyez plus fort pour que la fermeture soit forcément définitive.',
    'Si un côté résiste, défaites le dernier pli et vérifiez l’alignement. Laissez le haut libre pour que la languette puisse se rabattre.',
    'Force does not correct spatial misalignment, and a fold without adhesive is not a permanent seal. A conditional reversible correction plus a purpose clause explains what to check and why, without claiming physical success.'
   ]
  }
 ] as const)
});
