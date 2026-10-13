import {getOriginalCatalogEntry,getOriginalUnit,type OriginalLevel} from './u23-registry.ts';

/** Source-owned supplementary grammar teaching, deliberately not an assessment corpus. */
export interface U26Misconception{
 readonly response:string;readonly why:string;
}
export interface U26IndependentPrompt{
 readonly cue:string;readonly question:string;readonly answer:string;
 readonly hint:string;readonly explanation:string;
 readonly misconceptions:readonly U26Misconception[];
}
export interface U26GrammarFocus{
 readonly id:string;readonly anchorId:string;readonly level:OriginalLevel;
 readonly keys:readonly string[];readonly title:string;
 readonly context:string;readonly explanation:string;readonly contrast:string;
 readonly examples:readonly (readonly [string,string])[];
 readonly wrong:string;readonly corrected:string;readonly repair:string;
 readonly tasks:readonly U26IndependentPrompt[];
 readonly read:string;readonly listen:string;readonly write:string;readonly writingModel:string;
}
const m=(response:string,why:string):U26Misconception=>({response,why});
const t=(cue:string,question:string,answer:string,hint:string,explanation:string,...misconceptions:U26Misconception[]):U26IndependentPrompt=>
 ({cue,question,answer,hint,explanation,misconceptions});
const f=(id:string,anchorId:string,level:OriginalLevel,keys:string[],title:string,context:string,
 explanation:string,contrast:string,examples:[string,string][],wrong:string,corrected:string,repair:string,
 tasks:U26IndependentPrompt[],read:string,listen:string,write:string,writingModel:string):U26GrammarFocus=>
 Object.freeze({id,anchorId,level,keys,title,context,explanation,contrast,examples,wrong,corrected,repair,tasks,read,listen,write,writingModel});

/** Original, independently answerable contextual items. All responses are closed-key practice only. */
export const U26_ORIGINAL_GRAMMAR:readonly U26GrammarFocus[]=Object.freeze([
f('etre-present','a1-02','A1',['etre'],'Être: identity and location','Meeting a new classmate',
 'Être changes with the subject: je suis, tu es, il/elle est, nous sommes, vous êtes, ils/elles sont. Use a subject pronoun or an explicit noun; the verb must agree with that subject.',
 'Je suis étudiant describes identity; j’ai vingt ans uses avoir, not être, to express age.',
 [['Nous sommes dans la même classe.','We are in the same class.'],['Ma sœur est à Nantes.','My sister is in Nantes.']],
 'Nous êtes à Paris.','Nous sommes à Paris.','Êtes goes with vous; nous requires sommes.',
 [t('A new student says: « Nous ___ de Lyon. »','Complete with present être.','sommes','Check which subject speaks: nous.','Nous sommes is first-person plural.',m('êtes','Êtes belongs to vous, not nous.'),m('sont','Sont belongs to ils or elles.')),
  t('The teacher asks about your friend: « Elle ___ ici ? »','Complete with present être.','est','Use the third-person singular form.','Elle est, even when the sentence is a question.',m('es','Es goes with tu.'),m('suis','Suis goes with je.')),
  t('Addressing two colleagues: « Vous ___ prêts ? »','Complete with present être.','êtes','Plural or polite vous has one present form.','Vous êtes is the correct conjugation.',m('sommes','Sommes requires nous.'),m('est','Est is singular third person.'))],
 'Find who is at which place before choosing an être form.','Listen for the subject before the verb.','Write two identities and one location, varying the subject.','Je suis étudiant. Mon frère est musicien. Nous sommes à Strasbourg.'),
f('articles-gender','a1-03','A1',['articles','indefinite'],'Un, une, le, la: referents matter','Buying books and talking about a known object',
 'Use un or une to introduce one nonspecific countable object; use le or la for a specific or already identified one. A vowel-initial singular definite noun takes l’; the plural definite article is les.',
 'Une librairie is a bookshop; le livre refers to a known book. Gender depends on the noun, not the English translation.',
 [['Je cherche une librairie.','I am looking for a bookshop.'],['Le livre sur la table est à moi.','The book on the table belongs to me.']],
 'J’ai acheté une livre.','J’ai acheté un livre.','Livre (book) is masculine; une livre may instead refer to a pound as a unit.',
 [t('First mention: « Je cherche ___ appartement. »','Supply an indefinite article.','un','Appartement is masculine singular.','Un appartement introduces a nonspecific apartment.',m('une','Appartement is masculine, despite the final -ment.'),m('le','Le would imply a contextually identified apartment.')),
  t('A specific door: « ___ porte de la classe est fermée. »','Supply the definite article.','La','Porte is feminine singular.','La porte identifies the particular classroom door.',m('Le','Porte is feminine.'),m('Une','Une would introduce an unspecified door rather than identify the classroom door.')),
  t('Before a vowel: « ___ école est ouverte. »','Supply the definite article.','L’','École is singular and vowel-initial.','Use elided l’ before école.',m('La','La is elided before the vowel in école.'),m('Le','Le has the wrong gender and must elide.'))],
 'Identify whether each noun is first mentioned or already known.','Hear the noun, not just the short article.','Describe an unknown object and then refer to that same object again.','Je cherche un livre. Le livre que je veux est difficile à trouver.'),
f('questions-form','a1-06','A1',['questions'],'Questions: est-ce que, where and when','Finding a departure time',
 'Est-ce que introduces a yes/no question while keeping ordinary subject–verb order. Put où or quand before est-ce que when asking for place or time. Before il or elle, write est-ce qu’il / qu’elle.',
 'Est-ce que tu vas où ? is an unnatural standard information question; ask Où est-ce que tu vas ?',
 [['Est-ce que le train part à huit heures ?','Does the train leave at eight?'],['Quand est-ce que la bibliothèque ferme ?','When does the library close?']],
 'Est-ce que il arrive demain ?','Est-ce qu’il arrive demain ?','Elide que before vowel-initial il.',
 [t('A train schedule: « ___ le train part à huit heures ? »','Complete the yes/no question.','Est-ce que','Keep the subject–verb order after the question opener.','Est-ce que le train part à huit heures ?',m('Quand','Quand would ask for the time, not whether the given departure time is true.'),m('Où','Où asks for a place.')),
  t('A destination: « ___ est-ce que vous allez ? »','Choose the question word.','Où','Ask where, not when.','Où est-ce que vous allez ?',m('Quand','Quand asks for a time.'),m('Pourquoi','Pourquoi asks for a reason.')),
  t('A guest: « Est-ce ___ elle arrive ce soir ? »','Complete the elision.','qu’','Que elides before elle.','Est-ce qu’elle arrive ce soir ?',m('que','Use qu’ immediately before elle in standard writing.'),m('qui','Qui changes the syntax and is not the yes/no opener.'))],
 'Locate the interrogative word and the fact it requests.','Distinguish a rising yes/no question from où / quand.','Write one yes/no question and one question about a place.','Est-ce que le musée est ouvert ? Où est-ce que nous nous retrouvons ?'),
f('written-negation','a1-07','A1',['negation'],'Negative meaning and finite verbs','Refusing a product politely',
 'In standard written French, ne (n’ before a vowel) comes before the finite verb and pas after it. In the passé composé it normally surrounds the auxiliary: je n’ai pas acheté. Spoken French may drop ne, but do not silently transfer that omission to formal writing.',
 'Je ne veux pas de pain is a normal quantity negation; preserving negation can reverse a statement’s factual meaning.',
 [['Je ne prends pas de café.','I am not having any coffee.'],['Nous n’avons pas encore décidé.','We have not decided yet.']],
 'Je pas veux de café.','Je ne veux pas de café.','The conjugated verb veux goes between ne and pas.',
 [t('Reply to a seller: « Je ___ veux pas de sucre. »','Supply the first negative marker.','ne','The finite verb starts with a consonant.','Je ne veux pas de sucre.',m('n’','Use ne, not n’, before consonant-initial veux.'),m('pas','Pas already follows the verb.')),
  t('Before a vowel: « Nous ___ avons pas de nouvelles. »','Supply the negative marker.','n’','Ne elides before avons.','Nous n’avons pas de nouvelles.',m('ne','Write n’ directly before vowel-initial avons.'),m('jamais','Jamais means never, not the ordinary negative marker requested.')),
  t('Past action: « Elle n’a ___ envoyé le dossier. »','Supply the missing negative marker.','pas','The auxiliary a is enclosed by ne ... pas.','Elle n’a pas envoyé le dossier.',m('ne','The first negative marker n’ is already present.'),m('plus de','Plus would mean no longer and changes the stated meaning.'))],
 'Check whether the writer rejects a claim or merely qualifies it.','Listen for whether someone accepts or refuses, then verify the written sentence.','Write a polite negative response and distinguish it from a positive agreement.','Merci pour votre offre, mais je ne peux pas venir demain. Je vous répondrai lundi.'),
f('future-near','a1-12','A1',['futur-proche'],'Aller + infinitive: plan versus certainty','Inviting a friend',
 'Futur proche uses the present of aller plus an unchanged infinitive: je vais venir, nous allons partir. A plan is not a verified outcome; si c’est possible and peut-être signal genuine uncertainty.',
 'Je vais visite confuses a conjugated verb with the infinitive visiter.',
 [['Nous allons visiter le parc samedi.','We are going to visit the park on Saturday.'],['Je vais peut-être rester chez moi.','I may stay at home.']],
 'Elle va arrive demain.','Elle va arriver demain.','After conjugated aller, use the infinitive arriver.',
 [t('A planned visit: « Nous ___ visiter l’exposition. »','Complete the present of aller.','allons','Nous requires allons.','Nous allons visiter l’exposition.',m('allez','Allez goes with vous.'),m('vont','Vont goes with ils / elles.')),
  t('Invitation: « Tu vas ___ avec nous ? »','Complete with the infinitive of venir.','venir','Aller is already conjugated.','Tu vas venir avec nous ?',m('viens','Viens would be a second conjugated present verb.'),m('venu','Venu is a past participle, not the infinitive.')),
  t('One person’s intention: « Je ___ appeler demain. »','Complete with aller.','vais','Je uses vais.','Je vais appeler demain.',m('va','Va is third-person singular.'),m('irai','J’irai is futur simple and cannot be followed directly by the infinitive in this construction.'))],
 'Treat stated intentions separately from confirmed reservations.','Listen for vais / allons before an infinitive.','Write a plan and indicate one uncertainty.','Je vais réserver une table si le restaurant est ouvert.'),
f('partitives-negation','a1-13','A1',['articles','indefinite'],'Du pain, de l’eau, pas de pain','Ordering and declining food',
 'Du, de la and de l’ indicate indefinite quantities of mass nouns. After a straightforward negation of quantity, these usually become de or d’: du lait → pas de lait. Do not apply this mechanically to être or fixed contrasts where the meaning differs.',
 'Je ne prends pas du lait can contrast milk with another choice; je ne prends pas de lait normally means no milk at all.',
 [['Je voudrais de l’eau et du pain.','I would like some water and bread.'],['Je ne mange pas de viande.','I do not eat meat.']],
 'Je ne veux pas du pain.','Je ne veux pas de pain.','For an ordinary refusal of any bread, negative quantity uses de.',
 [t('At breakfast: « Je bois ___ eau. »','Supply the partitive.','de l’','Eau is vowel-initial.','Je bois de l’eau.',m('du','Eau is feminine and vowel-initial.'),m('une','Une eau is possible in certain contexts, but here an unspecified amount is intended.')),
  t('No milk: « Je ne veux pas ___ lait. »','Complete the ordinary negative quantity.','de','The partitive reduces to de under simple negation.','Je ne veux pas de lait.',m('du','Du remains positive quantity unless the meaning is contrastive.'),m('des','Des is plural and not the negative quantity here.')),
  t('Some cheese: « Elle prend ___ fromage. »','Supply the partitive.','du','Fromage is masculine mass noun.','Elle prend du fromage.',m('de la','Fromage is masculine.'),m('de l’','There is no initial vowel requiring elision.'))],
 'Notice when a quantity becomes zero after negation.','Distinguish du and de in speech; written form remains important.','Write an order including one desired item and one refusal.','Je voudrais du pain, mais je ne prends pas de fromage.'),
f('past-avoir','a2-01','A2',['passe-compose','avoir'],'Passé composé: auxiliary plus participle','Summarizing yesterday',
 'A completed action often uses present avoir followed by the past participle: j’ai parlé, nous avons choisi. For regular -er verbs the participle ends in -é. With ordinary avoir constructions, the participle does not agree with the subject.',
 'J’ai parlé reports a bounded completed event; je parlais can describe a background habit or an ongoing process.',
 [['Hier, nous avons terminé le dossier.','Yesterday we completed the file.'],['Je n’ai pas oublié le rendez-vous.','I did not forget the appointment.']],
 'Nous avons terminer le rapport.','Nous avons terminé le rapport.','A past participle, not the infinitive, follows the auxiliary.',
 [t('Yesterday: « Nous ___ préparé le dîner. »','Choose the auxiliary.','avons','Nous takes avons.','Nous avons préparé le dîner.',m('sommes','Préparer normally uses avoir in this active meaning.'),m('avez','Avez is for vous.')),
  t('Regular -er: « J’ai ___ un message. » (envoyer)','Complete with the past participle.','envoyé','Use a past participle ending in -é.','J’ai envoyé un message.',m('envoyer','An infinitive cannot replace the past participle after ai.'),m('envoyais','Imparfait cannot follow the auxiliary ai.')),
  t('Negative past: « Je n’ai ___ reçu votre mail. »','Supply the second negative marker.','pas','Negation wraps the finite auxiliary.','Je n’ai pas reçu votre mail.',m('ne','The n’ before ai already marks the first half.'),m('jamais pas','Do not combine jamais pas for ordinary no/never.'))],
 'Look for completed outcomes and their time anchor.','Hear ai / avons before the participle.','Write two completed past events and one negative.','Hier, j’ai reçu le message. Nous avons discuté. Je n’ai pas envoyé de réponse.'),
f('past-etre','a2-03','A2',['passe-compose','etre'],'Passé composé with être and agreement','Reporting arrivals and departures',
 'Some movement/change-of-state verbs take être in their intransitive use. The past participle then agrees with the subject: elle est arrivée, ils sont partis. Some verbs can take avoir with a direct object, so the auxiliary depends on construction.',
 'Elle a arrivée is incorrect for the intransitive arrival; elle est arrivée includes feminine agreement.',
 [['La directrice est partie à midi.','The director left at midday.'],['Mes sœurs sont arrivées tôt.','My sisters arrived early.']],
 'Elles sont arrivé à huit heures.','Elles sont arrivées à huit heures.','The participle agrees with the feminine plural subject when être is the auxiliary.',
 [t('A woman arrives: « Elle est ___ tard. » (arriver)','Complete the participle.','arrivée','Feminine singular adds -e.','Elle est arrivée tard.',m('arrivé','The participle must agree with elle.'),m('arrivait','Imparfait cannot follow est as the perfect participle.')),
  t('Two men leave: « Ils sont ___ hier. » (partir)','Complete the participle.','partis','Masculine plural adds -s.','Ils sont partis hier.',m('parti','Plural ils requires -s.'),m('parties','Parties is feminine plural.')),
  t('A woman returns: « Marie ___ revenue. »','Complete the auxiliary.','est','Revenir takes être when intransitive.','Marie est revenue.',m('a','Revenir with the intended intransitive sense does not take avoir.'),m('sont','Sont requires a plural subject.'))],
 'Find the subject and check participle gender/number.','Listen for être and use written agreement for confirmation.','Report an arrival and a departure involving different subjects.','Léa est arrivée lundi. Ses collègues sont partis mardi.'),
f('background-event','a2-06','A2',['passe-compose','imparfait'],'Imparfait or passé composé?','An interruption during a journey',
 'The imparfait often gives an ongoing background or repeated habit; the passé composé marks a bounded event advancing the story. Both can refer to the same day: the distinction is aspect, not how long ago an event occurred.',
 'Je lisais quand le train est arrivé combines a background in progress and a completed arrival.',
 [['Il pleuvait quand nous sommes sortis.','It was raining when we went out.'],['Tous les dimanches, elle préparait le repas.','Every Sunday she prepared the meal.']],
 'Pendant que je lisais, le téléphone sonnait soudain.','Pendant que je lisais, le téléphone a sonné soudain.','A single sudden interruption is normally framed as a completed event.',
 [t('Background: « Je ___ quand tu as appelé. » (lire, imparfait)','Complete the ongoing action.','lisais','Choose the background form of lire with je.','Je lisais quand tu as appelé.',m('ai lu','Ai lu presents a completed reading event, not the background in progress.'),m('lis','Lis is present and does not fit the past timeline.')),
  t('Single interruption: « Il pleuvait quand le train ___ . » (arriver, passé composé)','Complete with the appropriate past form.','est arrivé','The event is bounded and arriver uses être.','Le train est arrivé during the ongoing rain.',m('arrivait','Arrivait could describe approach, but the cue asks for a completed arrival.'),m('a arrivé','Intransitive arriver takes être.')),
  t('Past habit: « Avant, nous ___ au marché chaque samedi. » (aller, imparfait)','Complete the habitual past.','allions','Each Saturday marks a past habit.','Avant, nous allions au marché chaque samedi.',m('sommes allés','This marks a completed trip, not the habitual frame requested.'),m('allons','This is present, not past habit.'))],
 'Differentiate ongoing context from the new event.','Listen for quand before the interruption.','Narrate a background condition followed by one completed event.','Je regardais les horaires quand le bus est arrivé.'),
f('object-pronouns','a2-09','A2',[],'Le, la, les before a finite verb','Avoiding repetition in a story',
 'A direct object pronoun replaces a noun already identified: je vois la carte → je la vois. It generally precedes the finite verb, but comes before the auxiliary in the passé composé: je l’ai vue. Written agreement with a preceding direct object can matter with avoir.',
 'Lui and leur are indirect objects for à + person, not interchangeable with le/la/les.',
 [['Je vois mes amis. Je les salue.','I see my friends. I greet them.'],['Tu as lu la lettre ? Oui, je l’ai lue.','Did you read the letter? Yes, I read it.']],
 'Je vois elle chaque jour.','Je la vois chaque jour.','Use the unstressed direct object pronoun la before vois.',
 [t('Replace le document: « Je ___ lis. »','Choose a direct object pronoun.','le','Document is masculine singular and a direct object.','Je le lis.',m('lui','Lui refers to an indirect recipient, not a document being read.'),m('la','La is feminine singular.')),
  t('Replace les billets: « Nous ___ avons achetés. »','Choose the plural object pronoun.','les','Les is plural and precedes the auxiliary.','Nous les avons achetés.',m('leur','Leur is indirect, as in leur parler.'),m('lui','Lui is singular and indirect.')),
  t('A female friend: « Tu ___ connais ? »','Choose the direct object pronoun.','la','Connaitre someone takes a direct object.','Tu la connais ?',m('lui','Lui would be indirect; connaître is transitive direct.'),m('le','Le normally replaces a masculine singular noun.'))],
 'Find the noun whose meaning the short pronoun carries.','Pay attention to the unstressed pronoun before the verb.','Replace a repeated noun with a direct object pronoun.','J’ai reçu la lettre. Je la lis maintenant.'),
f('future-vs-conditional','a2-17','A2',[],'Future or conditional for requests','Negotiating an appointment',
 'Futur simple expresses an anticipated event or commitment. The present conditional softens a request or presents a hypothetical outcome: je voudrais, pourriez-vous. Do not confuse polite desire with a confirmed reservation.',
 'Je viendrai demain sounds like a commitment; je pourrais venir demain leaves open whether it is possible.',
 [['Pourriez-vous confirmer le rendez-vous ?','Could you confirm the appointment?'],['Je vous enverrai le document demain.','I will send you the document tomorrow.']],
 'Je voudrais réserver, donc la réservation est confirmée.','Je voudrais réserver; pouvez-vous confirmer la disponibilité ?','A request does not establish that the booking already exists.',
 [t('Polite request: « ___-vous déplacer le rendez-vous ? » (pouvoir, conditionnel)','Complete the question.','Pourriez','The conditional of pouvoir is pourriez with vous.','Pourriez-vous déplacer le rendez-vous ?',m('Pouvez','Pouvez is a direct present question, not the conditional requested.'),m('Pourrez','Pourrez is future simple, not conditional.')),
  t('Future plan: « Je vous ___ demain. » (répondre, futur simple)','Complete the commitment.','répondrai','Je + future of répondre is répondrai.','Je vous répondrai demain.',m('répondrais','Répondrais is conditional and weakens the commitment.'),m('répondait','Répondait is past imparfait third-person singular.')),
  t('Polite desire: « Je ___ une confirmation écrite. » (vouloir, conditionnel)','Complete the request.','voudrais','The fixed polite form is je voudrais.','Je voudrais une confirmation écrite.',m('veux','Je veux is a direct demand, not the requested conditional.'),m('voudrai','Voudrai is the future, not the conditional.'))],
 'Check whether a statement is a wish, condition or committed event.','Hear pourrais versus pourrai when comparing written forms.','Draft a polite appointment request without assuming confirmation.','Je voudrais déplacer notre rendez-vous. Pourriez-vous me proposer un autre créneau ?'),
f('y-and-en','a2-20','A2',[],'Y and en: location or quantity','Talking about a place and its products',
 'Y typically replaces à + place or a location; en can replace de + noun, including quantities or origin. They do not simply mean there and some in every context; identify the preposition and omitted referent.',
 'J’y vais means I go there; j’en prends deux means I take two of them.',
 [['Tu vas à la bibliothèque ? Oui, j’y vais.','Are you going to the library? Yes, I am.'],['Tu veux des pommes ? Oui, j’en veux trois.','Do you want apples? Yes, I want three.']],
 'Je vais en à la bibliothèque.','J’y vais.','The place introduced by à is typically replaced by y.',
 [t('Replace à Paris: « Nous ___ allons demain. »','Supply the pronoun.','y','Y can replace à + location.','Nous y allons demain.',m('en','En would more naturally replace de Paris (origin).'),m('le','Le is a direct object pronoun.')),
  t('Quantity: « Tu veux des fraises ? Oui, j’___ prends deux. »','Complete the quantity pronoun.','en','En marks an unspecified set with a stated number.','J’en prends deux.',m('y','Y is not used to replace the counted partitive group.'),m('les','Les would identify all known strawberries, not an unspecified two.')),
  t('Origin: « Tu reviens de Marseille ? Oui, j’___ reviens. »','Replace de Marseille.','en','En can replace de + place for origin.','J’en reviens.',m('y','Y denotes location/destination, not origin with de.'),m('le','Le is direct object.'))],
 'Restore the missing preposition before choosing y or en.','Distinguish j’y vais from j’en reviens.','Use y for a destination and en for a quantity.','Je vais au marché et j’y achète des pommes. J’en prends trois.'),
f('cause-result','b1-01','B1',[],'Parce que versus donc','Explaining a transport decision',
 'Parce que introduces a cause; donc introduces a consequence. Puisque presumes a reason already shared or accepted. Neither connector proves that the speaker’s explanation is factually true.',
 'Le train est annulé, donc je prends un bus is a result. Je prends un bus parce que le train est annulé gives a reason.',
 [['Comme le musée ferme tôt, nous partirons à midi.','As the museum closes early, we will leave at noon.'],['Le train est annulé; par conséquent, le trajet change.','The train is cancelled; consequently, the trip changes.']],
 'Le musée ferme donc que nous partons.','Nous partons parce que le musée ferme.','Donc does not introduce a subordinate cause with que.',
 [t('Cause: « Nous restons ___ la route est fermée. »','Supply the cause connector.','parce que','This clause gives the reason for staying.','Nous restons parce que la route est fermée.',m('donc','Donc introduces a result, not the cause subordinating this clause.'),m('pourtant','Pourtant indicates contradiction.')),
  t('Result: « La séance est annulée; ___, nous rentrerons. »','Complete with a result connector.','donc','A consequence follows the cancellation.','La séance est annulée; donc, nous rentrerons.',m('parce que','Parce que would introduce a reason and does not fit this punctuation.'),m('bien que','Bien que requires a concessive subordinate clause.')),
  t('Shared reason: « ___ tu as déjà le billet, entre avec nous. »','Use a connector that treats the reason as known.','Puisque','Puisque presents the fact as shared in the context.','Puisque tu as déjà le billet, entre avec nous.',m('Donc','Donc cannot introduce this cause as written.'),m('Cependant','Cependant contrasts two statements instead of giving the premise.'))],
 'Separate observed fact from proposed conclusion.','Listen for the direction of the argument.','Write a fact, its plausible consequence and one remaining uncertainty.','Le train est annulé; nous prendrons donc le tram, si la ligne fonctionne.'),
f('concession-mood','b1-02','B1',['concession'],'Bien que and même si','Disagreeing without erasing a valid concern',
 'Bien que takes the subjunctive, while même si normally takes the indicative when introducing an actual or hypothetical concession. The two forms are not interchangeable in written standard French.',
 'Bien qu’il soit tard (subjunctive) contrasts with même s’il est tard (indicative).',
 [['Bien qu’il fasse froid, nous sortirons.','Although it is cold, we will go out.'],['Même si elle est inquiète, elle accepte de discuter.','Even though she is worried, she agrees to talk.']],
 'Bien qu’il est fatigué, il vient.','Bien qu’il soit fatigué, il vient.','Bien que triggers the subjunctive soit in this clause.',
 [t('Concession: « Bien qu’elle ___ malade, elle participe. » (être)','Complete with the subjunctive.','soit','Bien que selects the subjunctive.','Bien qu’elle soit malade, elle participe.',m('est','Est is indicative; bien que requires soit.'),m('sera','Sera is future indicative.')),
  t('Another concession: « Même s’il ___, nous partirons. » (pleuvoir, présent)','Complete with the indicative.','pleut','Même si generally uses the indicative here.','Même s’il pleut, nous partirons.',m('pleuve','Pleuve is subjunctive, used after bien que in this kind of clause.'),m('pleuvait','Past imparfait does not match the present condition requested.')),
  t('Plural subjunctive: « Bien qu’ils ___ différents, ils coopèrent. » (être)','Complete correctly.','soient','Third-person plural subjunctive of être is soient.','Bien qu’ils soient différents, ils coopèrent.',m('sont','Sont is indicative, not subjunctive.'),m('seront','Seront is future indicative.'))],
 'Find the concession marker before deciding the mood.','Listen for the contrast rather than claiming a speaker agrees.','Defend one decision while fairly conceding a counterargument.','Bien que le projet soit coûteux, nous pouvons l’envisager si le financement est confirmé.'),
f('relative-dont','b1-03','B1',[],'Dont versus que and qui','Describing a reported document',
 'Dont replaces a relation introduced by de: parler de quelque chose → un sujet dont je parle. Qui normally acts as subject; que as direct object. Use the governing verb or construction to decide, not the English relative pronoun.',
 'La lettre dont j’ai besoin uses avoir besoin de; la lettre que j’ai lue uses lire with a direct object.',
 [['Voici le dossier dont nous avons besoin.','Here is the file we need.'],['La personne qui a signé travaille ici.','The person who signed works here.']],
 'Le rapport que je parle est récent.','Le rapport dont je parle est récent.','Parler de requires dont, not direct-object que.',
 [t('Need of: « Voici le document ___ j’ai besoin. »','Complete the relative.','dont','Avoir besoin de selects dont.','Le document dont j’ai besoin.',m('que','Que replaces a direct object, while besoin de governs this relation.'),m('qui','Qui would make document the subject of a verb.')),
  t('Subject: « La chercheuse ___ présente les résultats arrive. »','Complete the relative subject.','qui','The researcher is the subject of présente.','La chercheuse qui présente les résultats arrive.',m('que','Que would require another subject in the relative clause.'),m('dont','Présenter does not require de for this subject relation.')),
  t('Direct object: « Le livre ___ tu lis est intéressant. »','Complete the relative object.','que','Tu is the relative-clause subject; livre is read as direct object.','Le livre que tu lis est intéressant.',m('qui','Qui would suggest the book reads the subject.'),m('dont','Lire takes a direct object, not de.'))],
 'Reconstruct the missing preposition or syntactic role.','Catch the verb following a short relative connector.','Combine two facts with a relative clause using dont.','Voici l’article dont nous avons parlé hier.'),
f('si-conditions','b1-04','B1',['condition'],'Si clauses: real or hypothetical','Discussing a project budget',
 'A real possible future uses si + present followed by futur simple: si le comité accepte, nous commencerons. A contrary-to-current-fact hypothesis uses si + imparfait followed by conditional: si nous avions plus de temps, nous commencerions.',
 'Standard conditional si clauses do not normally use futur simple or conditional immediately after si in these patterns.',
 [['Si le conseil approuve, nous ouvrirons la salle.','If the council approves, we will open the room.'],['Si j’avais les moyens, je voyagerais davantage.','If I had the means, I would travel more.']],
 'Si nous aurons le budget, nous agirons.','Si nous avons le budget, nous agirons.','In a real future condition, use present after si.',
 [t('Real condition: « Si l’école ___, nous irons. » (accepter, présent)','Complete the si clause.','accepte','Present indicative follows si in a real future condition.','Si l’école accepte, nous irons.',m('acceptera','Do not put futur simple in this kind of si clause.'),m('accepterait','Conditional in the si clause does not match the real future pattern.')),
  t('Hypothetical: « Si nous ___ une autre salle, nous inviterions plus de monde. » (avoir, imparfait)','Complete with the correct tense.','avions','An unreal or hypothetical present uses si + imparfait.','Si nous avions une autre salle, nous inviterions plus de monde.',m('aurions','Conditional belongs in the main clause, not the si clause.'),m('avons','Avons signals the real-condition construction rather than the requested hypothetical one.')),
  t('Hypothetical result: « Si le train était direct, je le ___ . » (prendre, conditionnel)','Complete the result.','prendrais','The result uses present conditional.','Je le prendrais is conditional with je.',m('prendrai','Prendrai is futur simple and belongs with si + present.'),m('prenais','Prenais is imparfait, not the conditional result.'))],
 'Identify what is still uncertain and which branch is hypothetical.','Listen for the two-clause contrast.','Compare a realistic plan with an impossible-for-now alternative.','Si le conseil confirme, nous agirons. Si nous disposions d’un budget supérieur, nous agirions plus vite.'),
f('pluperfect-chronology','b1-08','B1',['pluperfect'],'Plus-que-parfait: earlier past event','Reconstructing a disputed timeline',
 'Plus-que-parfait uses imparfait of avoir/être and a past participle. It marks an event already completed before another past reference point: elle avait signé avant que le bureau ouvre. It does not itself guarantee that an account is reliable.',
 'Quand je suis arrivé, ils avaient déjà quitté les lieux places their departure before my arrival.',
 [['Nous avions déjà reçu la réponse quand elle a appelé.','We had already received the reply when she called.'],['Elle était partie avant midi.','She had left before noon.']],
 'Quand il est arrivé, nous avons déjà terminé.','Quand il est arrivé, nous avions déjà terminé.','An earlier completed past event takes plus-que-parfait for clear anteriority.',
 [t('Earlier past: « Il ___ déjà fermé la porte quand je suis arrivé. » (avoir, imparfait)','Complete the auxiliary.','avait','Third-person singular imparfait of avoir is avait.','Il avait déjà fermé la porte.',m('a','A creates passé composé, not plus-que-parfait.'),m('était','Fermer in this transitive construction takes avoir.')),
  t('Plural: « Nous ___ commencé avant son départ. » (avoir, imparfait)','Complete the auxiliary.','avions','Nous avions + participle forms plus-que-parfait.','Nous avions commencé.',m('avons','Avons would give passé composé, not the requested prior-past form.'),m('étions','Commencer with a direct activity normally uses avoir here.')),
  t('Earlier departure: « Elles ___ parties avant la réunion. » (être, imparfait)','Complete the auxiliary.','étaient','Elles étaient parties combines imparfait être and feminine plural participle.','Elles étaient parties avant la réunion.',m('ont','Partir uses être intransitively.'),m('sont','Sont would form passé composé, not plus-que-parfait.'))],
 'Draw the two past time points before assigning tenses.','Listen for avait/étaient plus participle.','Write one dated past event that preceded another.','Quand le responsable a appelé, nous avions déjà envoyé le rapport.'),
f('source-hedging','transfer-121','Early B2',['concession','pluperfect'],'Reported evidence: degree of certainty','Interpreting conflicting rehearsal notes',
 'Il semble que + subjunctive expresses an uncertain assessment; selon le carnet attributes a claim to its source. The conditionnel de réserve can mark unverified reports (le témoin aurait vu). None of these grammatical forms transforms a source claim into proof.',
 'Le texte indique que is an attributed report; il est certain que is a much stronger assertion requiring evidence.',
 [['Selon le cahier, elle aurait aperçu l’enveloppe.','According to the notebook, she reportedly saw the envelope.'],['Il semble que la chronologie soit incomplète.','The chronology seems incomplete.']],
 'Le cahier affirme la date, donc elle est prouvée.','Le cahier donne une date, mais celle-ci reste à vérifier.','A single attributed document is not independent verification.',
 [t('Uncertainty: « Il semble qu’il ___ une erreur. » (avoir, subjonctif)','Complete with the subjunctive.','y ait','Il semble qu’il y ait marks an unverified possibility.','Il semble qu’il y ait une erreur.',m('y a','Il semble que normally calls for the subjunctive in this uncertainty statement.'),m('y aura','Future indicative states a future outcome rather than present uncertainty.')),
  t('Report with distance: « Selon une note, la lettre ___ disparu. » (avoir, conditionnel présent)','Complete with reported conditional.','aurait','Aurait disparu conveys an unconfirmed report.','Selon une note, la lettre aurait disparu.',m('a','A disparu asserts the event without the caution requested.'),m('avait','Avait disparu shifts chronology but does not by itself mark reported uncertainty.')),
  t('Concession: « Bien que la note ___ détaillée, elle peut être inexacte. » (être, subjonctif)','Complete the concession.','soit','Bien que requires subjunctive soit.','Bien que la note soit détaillée, elle peut être inexacte.',m('est','Est is indicative after bien que.'),m('sera','Sera is future indicative.'))],
 'Distinguish observation, report and interpretation.','Notice whether a speaker attributes a claim or vouches for it.','Draft a cautious synthesis of two sources that disagree.','Selon le cahier, une lettre aurait disparu; toutefois, l’autre témoignage ne confirme pas cette conclusion.'),
f('quotation-and-report','transfer-148','Early B2',['report','concession'],'Negation and quotation fidelity','Theatre captioning correction',
 'When reporting someone’s exact words, preserve negation and speaker attribution. Au discours indirect, il affirme qu’il ne signera pas still reports refusal. A missing ne or pas in the reported clause can reverse an audience’s interpretation.',
 'A verified source quote is different from a paraphrase. If performance improvisation changed the spoken line, do not present the rehearsal script as a transcript.',
 [['Nina précise que le personnage ne signera pas.','Nina states that the character will not sign.'],['Bien que le sous-titre soit court, il doit conserver le refus.','Though short, the caption must preserve the refusal.']],
 'Il dit qu’il signera, alors qu’il a refusé.','Il dit qu’il ne signera pas, car il a refusé.','Negation in the embedded clause preserves the reported refusal.',
 [t('Reported refusal: « Elle affirme qu’elle ___ acceptera pas. »','Supply the formal negative marker.','n’','Negation elides before acceptera.','Elle affirme qu’elle n’acceptera pas.',m('ne','Before vowel-initial acceptera, ne elides.'),m('pas','Pas is already in the clause and cannot replace the initial marker.')),
  t('Indirect speech: « Le témoin dit qu’il ne ___ pas. » (signer, futur simple)','Complete the refusal.','signera','Keep a negative future clause after dit que.','Il ne signera pas.',m('signerait','Signerait shifts to a conditional not requested by the current report.'),m('signe','Signe is present, not the future tense asked for.')),
  t('Concession: « Bien que les lignes ___ brèves, elles doivent rester fidèles. » (être, subjonctif)','Complete the plural form.','soient','Bien que selects soient for les lignes.','Bien que les lignes soient brèves...',m('sont','Sont is indicative rather than subjunctive.'),m('seront','Seront is future indicative.'))],
 'Compare the caption with the actual evidence before quoting.','Listen for the negative auxiliary/verb combination.','Write a correction notice separating script text, performance and remaining uncertainty.','Le script indique un refus, mais le sous-titre a supprimé la négation. Nous vérifierons la scène enregistrée avant toute publication.'),
f('survey-conditional','transfer-149','Early B2',['condition','source'],'Survey statements and conditional decisions','Interpreting a nonrandom community vote',
 '80 % des répondants is not equivalent to 80 % des habitants. Use parmi les répondants for the measured group; the conditional and si + present make the administrative decision explicitly dependent on verification.',
 'Si le conseil valide les coûts, le jardin pourra avancer is a future possibility, not a statement that funding is already secured.',
 [['Parmi cent répondants, quatre-vingts soutiennent le projet.','Among one hundred respondents, eighty support the project.'],['Si le conseil accepte le budget, les travaux commenceront.','If the council approves the budget, work will begin.']],
 'Quatre répondants sur cinq prouvent que la ville approuve.','Quatre-vingts répondants sur cent se sont déclarés favorables; ce résultat ne décrit pas toute la ville.','The voluntary respondent group is not established as representative of the city.',
 [t('Population: « ___ les répondants, 80 % étaient favorables. »','Choose the group-limiting preposition.','Parmi','Parmi locates the statistic among respondents.','Parmi les répondants, 80 % étaient favorables.',m('Tous','Tous would imply all respondents rather than 80 %.'),m('Depuis','Depuis expresses a temporal starting point.')),
  t('Condition: « Si le conseil ___ le budget, le projet avancera. » (valider, présent)','Complete the real future condition.','valide','Use present after si.','Si le conseil valide le budget, le projet avancera.',m('validera','Do not use future in this si clause.'),m('validerait','Conditional after si is incorrect for this real future pattern.')),
  t('Hypothesis: « Sans données complémentaires, nous ___ prudents. » (rester, conditionnel présent)','Complete the cautious judgment.','resterions','Nous + conditional resterions marks a prudent hypothetical stance.','Nous resterions prudents.',m('restons','Restons is present, not the requested conditional.'),m('resterons','Re sterons is futur simple and would express a stronger future commitment.'))],
 'Locate the denominator and selection method.','Listen to whether the speaker says participants or residents.','Write a report that restricts the claim to the measured population and leaves financing conditional.','Parmi les répondants, 80 % soutiennent le jardin. Si les coûts sont approuvés, le projet pourra avancer.'),
f('forecast-concession','transfer-150','Early B2',['condition','concession'],'Forecast versus observation: qualified claims','A cloudy meteor observation night',
 'Une prévision pourrait annoncer un maximum; a local count reports observed events in a measured interval. Although bien que + subjunctive introduces a concession, it does not erase the observational limits that follow.',
 'Nous aurions vu davantage de météores si le ciel avait été dégagé is a counterfactual past hypothesis, not a measured count.',
 [['Bien que le ciel ait été couvert, l’équipe a observé quelques météores.','Although it was overcast, the team saw some meteors.'],['La prévision pourrait être plus élevée sous un ciel dégagé.','The forecast could be higher under clear skies.']],
 'Nous avons vu neuf météores, donc chacun en verra dix-huit par heure.','Nous avons vu neuf météores en trente minutes, mais les nuages limitent toute extrapolation.','Uncontrolled observing conditions cannot justify a guaranteed personal hourly rate.',
 [t('Completed concession: « Bien que le ciel ___ couvert, les bénévoles ont compté neuf météores. » (avoir, subjonctif passé)','Complete the auxiliary.','ait été','Le ciel ait été is the past subjunctive with être participle.','Bien que le ciel ait été couvert...',m('a été','A été is indicative passé composé, not subjunctive after bien que.'),m('était','Était is imparfait indicative.')),
  t('Possibility: « La prévision ___ dépendre des conditions locales. » (pouvoir, conditionnel)','Complete the cautious modal.','pourrait','Pourrait expresses possibility, not a guarantee.','La prévision pourrait dépendre des conditions locales.',m('peut','Peut is present indicative, stronger than the conditional requested.'),m('pourra','Pourra is future indicative.')),
  t('Past hypothetical: « Si le ciel avait été dégagé, nous ___ davantage. » (voir, conditionnel passé)','Complete the result.','aurions vu','Si + plus-que-parfait combines with conditional past.','Nous aurions vu davantage.',m('avions vu','Avions vu is plus-que-parfait, not the conditional result.'),m('verrons','Verrons is future simple and mismatches the past hypothesis.'))],
 'Separate measured intervals from predicted ideal maxima.','Listen for conditionnel and the difference between real count and extrapolation.','Write one measured result and one limit of a forecast, without inventing visibility.','L’équipe a observé neuf météores en trente minutes. Bien que le chiffre soit réel, les nuages empêchent de conclure pour tous les sites.')
]);

const byAnchor=new Map<string,readonly U26GrammarFocus[]>();
for(const focus of U26_ORIGINAL_GRAMMAR){
 if(!getOriginalCatalogEntry(focus.anchorId))throw Error('U26 missing original source anchor: '+focus.anchorId);
 byAnchor.set(focus.anchorId,Object.freeze([...(byAnchor.get(focus.anchorId)??[]),focus]));
}
export function originalU26GrammarForUnit(unitId:string):readonly U26GrammarFocus[]{
 const unit=getOriginalUnit(unitId),entry=getOriginalCatalogEntry(unitId);
 if(!unit||!entry)return [];
 const exact=byAnchor.get(unitId)??[];
 if(exact.length)return exact;
 const ids=new Set(unit.grammarIds);
 return U26_ORIGINAL_GRAMMAR.filter(focus=>focus.level===entry.level&&
  focus.keys.length>0&&focus.keys.some(key=>ids.has(key))).slice(0,2);
}
/** Scope browsing by authored level, without inventing an explicit lesson relationship. */
export function originalU26GrammarForLevel(level:OriginalLevel):readonly U26GrammarFocus[]{
 return U26_ORIGINAL_GRAMMAR.filter(focus=>focus.level===level);
}
export function originalU26GrammarById(id:string):U26GrammarFocus|null {
 return U26_ORIGINAL_GRAMMAR.find(focus=>focus.id===id)??null;
}
