import type {A1Grammar} from './u6-a1-model.ts';

/** Original B2 pragmatic language instruction for the fictional interpersonal 160–161 sequence. */
export const U51_B2_GRAMMAR:Readonly<Record<string,readonly A1Grammar[]>>=Object.freeze({
 'transfer-160':Object.freeze([
  {
   heading:'Ressenti, fait et intention supposée : choisir une formulation non accusatrice',
   explanation:'Dans un échange sensible, un fait observé (« je suis arrivée seule »), un ressenti (« je me suis sentie abandonnée ») et une intention supposée (« tu as voulu m’abandonner ») ne sont pas équivalents. Seules les deux premières propositions sont directement accessibles à la personne qui parle. Pour exprimer une blessure sans prêter d’intention, construisez « Quand + événement, je me suis senti(e) + adjectif; j’aurais aimé que + subjonctif ». Le conditionnel passé j’aurais aimé et le subjonctif « tu me préviennes » formulent une demande déçue plutôt qu’une obligation rétrospective absolue. « Il me semble que » peut présenter une interprétation, mais ne lui donne pas le statut d’une certitude. Une réponse respectueuse reconnaît l’effet de l’absence sans forcer l’autre à livrer une explication intime. Ce choix de registre ne nie ni la douleur exprimée ni la responsabilité d’un engagement commun.',
   examples:[
    ['Quand je suis arrivée seule, je me suis sentie mise à l’écart; j’aurais aimé que tu me préviennes.','When I arrived alone, I felt excluded; I would have liked you to tell me.'],
    ['Je ne sais pas pourquoi tu n’as pas répondu; je sais seulement que j’ai dû accueillir les visiteurs seule.','I do not know why you did not reply; I only know I had to welcome visitors alone.']
   ],
   correction:[
    'Tu m’as ignorée exprès et tu me méprises, puisque je me suis sentie seule.',
    'Quand tu n’as pas répondu, je me suis sentie seule et j’aurais aimé que tu m’envoies un mot.',
    'A first-person emotion is not proof of deliberate contempt. Replacing the speculative motive with the event, impact and concrete request preserves the speaker’s concern without attributing hidden intent.'
   ]
  },
  {
   heading:'Discours rapporté, antériorité et limites personnelles sans justification forcée',
   explanation:'Le plus-que-parfait situe un événement antérieur à un autre moment du passé : « J’avais rédigé un message, mais je ne l’ai pas envoyé. » Cette opposition permet de raconter une pensée sans présenter un brouillon comme une parole effectivement adressée. Pour rendre les limites explicites, utilisez « je préfère ne pas en parler aujourd’hui » et, pour la demande de clarification, « je souhaiterais savoir si nous pourrions discuter plus tard ». « Bien que + subjonctif » exprime une concession : « Bien que Samir ait reconnu l’effet de son absence, il ne souhaite pas donner les détails. » Ne transformez ni un journal privé en message envoyé ni une concession en permission de divulguer. La parole indirecte (« il a expliqué qu’il avait besoin de recul ») doit conserver la différence entre ressenti, interprétation et engagement. Au niveau B2, la précision grammaticale sert à préserver l’autonomie de chaque interlocuteur.',
   examples:[
    ['J’avais écrit une accusation, mais je ne l’ai pas envoyée car je ne connaissais pas son intention.','I had written an accusation, but I did not send it because I did not know his intention.'],
    ['Bien qu’il reconnaisse l’effet de son silence, il préfère garder ses raisons personnelles privées.','Although he acknowledges the effect of his silence, he prefers to keep his personal reasons private.']
   ],
   correction:[
    'Samir a lu le message accusateur que Camille avait seulement rédigé dans son brouillon.',
    'Camille avait rédigé un message accusateur, mais elle ne l’avait pas envoyé à Samir.',
    'The plus-que-parfait marks prior drafting, not transmission. Do not add the unsupported action of reading a message that remained unsent and private.'
   ]
  }
 ] as const),
 'transfer-161':Object.freeze([
  {
   heading:'Si + plus-que-parfait et conditionnel passé : regretter sans réécrire le passé',
   explanation:'L’hypothèse irréelle dans le passé se construit avec « si + plus-que-parfait » puis « conditionnel passé » : « Si j’avais demandé une confirmation, j’aurais peut-être mieux préparé l’accueil. » L’effet n’a pas eu lieu et le mot « peut-être » empêche de le présenter comme certain. Après « si » dans cette construction, n’utilisez ni le conditionnel (« si j’aurais demandé ») ni le passé composé (« si j’ai demandé »), qui changeraient la valeur de l’hypothèse. Pour un regret personnel non accusateur, préférez « j’aurais pu envoyer un message » à « tu aurais dû tout me raconter ». Le conditionnel passé évoque une possibilité ou une conduite souhaitée; il ne démontre pas une intention délibérée. L’oral B2 doit faire entendre la différence entre responsabilité pour un acte précis et interprétation morale de la personne.',
   examples:[
    ['Si Samir avait prévenu Camille, elle aurait peut-être trouvé quelqu’un d’autre pour l’accueil.','If Samir had warned Camille, she might have found somebody else to welcome guests.'],
    ['J’aurais pu demander une confirmation, mais je n’étais pas obligée de deviner son absence.','I could have asked for confirmation, but I was not required to guess his absence.']
   ],
   correction:[
    'Si j’aurais su ton absence, je m’organisais parfaitement et tout était réglé.',
    'Si j’avais su que tu ne viendrais pas, j’aurais peut-être pu organiser l’accueil autrement.',
    'The unreal past requires si + plus-que-parfait avais su and conditionnel passé aurais pu; peut-être keeps the imagined outcome hypothetical instead of certifying a perfect past.'
   ]
  },
  {
   heading:'Promesse, possibilité et consentement : ne pas généraliser un accord limité',
   explanation:'Une proposition prudente au conditionnel (« je pourrais relire les légendes ») exprime une possibilité; elle n’équivaut pas à une promesse de présence. Une fois acceptée, une tâche précise peut être formulée au présent (« nous convenons d’une relecture avant jeudi »), mais seulement pour ce qui a été explicitement accepté. Les verbes « accepter de », « pouvoir » et « préférer ne pas » distinguent volonté, capacité et limite personnelle. Un accord de travail ne devient pas automatiquement un pardon, un retour de confiance, ni une permission de publier des conversations privées. Utilisez « même si » suivi de l’indicatif pour concéder une coopération réelle : « Même s’ils peuvent travailler ensemble, ils ne se sont pas promis de redevenir proches. » Terminez le récit avec une suite facultative plutôt qu’une conclusion inventée. La précision pragmatique compte autant que les formes verbales.',
   examples:[
    ['Samir pourrait relire les légendes avant jeudi, mais il ne promet pas de participer au vernissage.','Samir could proofread the captions by Thursday but does not promise to attend the opening.'],
    ['Même s’ils ont accepté une tâche commune, ils n’ont pas déclaré leur amitié entièrement réparée.','Even if they have accepted a shared task, they have not declared their friendship completely repaired.']
   ],
   correction:[
    'Puisque Samir accepte de relire un texte, il a pardonné tout le passé et accepte de parler de sa vie privée.',
    'Samir accepte une relecture avant jeudi, sans promettre de tout pardonner ni de divulguer les raisons privées de son absence.',
    'The accepted scope is a bounded proofreading task; neither emotional forgiveness nor permission to disclose private reasons follows from that agreement.'
   ]
  }
 ] as const)
});
