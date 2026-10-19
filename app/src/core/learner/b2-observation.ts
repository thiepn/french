/**
 * U64: practice-only observations for P31 argumentation and P32 source transfer.
 * These are mechanical writing signals, never scores, evaluator confidence,
 * CEFR promotion, benchmark passes, or evidence of semantic correctness.
 */
export interface B2Prompt{
 id:string;
 title:string;
 task:string;
 questions:readonly string[];
}
export const B2_ARGUMENT_PAIRS:readonly (readonly B2Prompt[])[]=[
 [
  {id:'u64-work-policy',title:'Organisation du travail',task:'Votre organisation envisage de limiter le télétravail. Rédigez une recommandation nuancée pour les collègues et la direction.',questions:['Définissez votre position et le contexte.','Examinez un avantage et un risque.','Répondez à une objection.','Proposez une condition de mise en œuvre.']},
  {id:'u64-urban-mobility',title:'Mobilité et équité',task:'Une ville veut réduire la circulation automobile au centre. Expliquez dans quelles conditions cette décision serait juste et efficace.',questions:['Présentez les acteurs concernés.','Mettez en balance deux conséquences.','Examinez une objection crédible.','Concluez par une proposition réaliste.']}
 ],
 [
  {id:'u64-media-evidence',title:'Information contestée',task:'Une publication populaire présente une corrélation comme preuve d’une cause. Expliquez comment vous examineriez l’argument.',questions:['Identifiez la thèse et les informations manquantes.','Distinguez observation et interprétation.','Présentez une explication alternative.','Formulez une conclusion prudente.']},
  {id:'u64-project-crisis',title:'Décision sous contrainte',task:'Votre équipe doit livrer un projet incomplet. Défendez une décision responsable malgré des contraintes de temps et de qualité.',questions:['Exposez les contraintes.','Comparez deux options.','Anticipez un risque et une objection.','Recommandez une décision conditionnelle.']}
 ],
 [
  {id:'u64-mediation',title:'Conflit dans une équipe',task:'Deux membres d’une équipe ont des priorités incompatibles. Rédigez une proposition de médiation qui reconnaisse les deux points de vue.',questions:['Reformulez les positions sans caricature.','Identifiez un intérêt partagé.','Proposez un compromis et sa limite.','Expliquez comment vérifier le résultat.']},
  {id:'u64-priorities',title:'Choix collectifs difficiles',task:'Une association doit choisir entre deux projets utiles mais incompatibles avec son budget. Construisez une recommandation argumentée.',questions:['Définissez des critères de choix.','Évaluez les bénéfices et les coûts.','Reconnaissez une incertitude.','Concluez avec une condition de révision.']}
 ]
] as const;
export interface B2Observation {
 words:number;
 sentences:number;
 distinctWords:number;
 markerFamilies:string[];
 possibleRepeatedPhrases:number;
 guidance:string[];
}
const TOKENS=/[\p{L}]+(?:[’'-][\p{L}]+)*/gu;
const MARKERS:ReadonlyArray<readonly [string,RegExp]>=[
 ['contrast',/\b(?:cependant|pourtant|toutefois|néanmoins|en revanche|alors que|mais)\b/iu],
 ['concession',/\b(?:bien que|même si|certes|malgré|quoique)\b/iu],
 ['condition',/\b(?:à condition que|dans le cas où|si|à moins que|pourvu que)\b/iu],
 ['example',/\b(?:par exemple|notamment|ainsi|illustrer|illustration)\b/iu],
 ['consequence',/\b(?:par conséquent|donc|en conséquence|de ce fait|cela entraînerait|cela implique)\b/iu],
 ['qualification',/\b(?:peut-être|il semble|il est possible|selon|en partie|sous réserve)\b/iu],
 ['conclusion',/\b(?:en conclusion|pour conclure|finalement|en somme|je recommande|nous proposons)\b/iu]
];
function tokens(value:string):string[]{return (value.match(TOKENS)??[]).map(x=>x.toLocaleLowerCase('fr'));}
export function observeB2Draft(raw:string):B2Observation{
 const text=raw.slice(0,12000).normalize('NFC');
 const words=tokens(text),sentences=(text.match(/[.!?]+(?=\s|$)/g)??[]).length;
 const markerFamilies=MARKERS.filter(([,expression])=>expression.test(text)).map(([name])=>name);
 const fivegrams=new Map<string,number>();
 for(let i=0;i+5<=words.length;i++){
  const key=words.slice(i,i+5).join(' ');
  fivegrams.set(key,(fivegrams.get(key)??0)+1);
 }
 const possibleRepeatedPhrases=[...fivegrams.values()].filter(n=>n>1).length;
 const guidance:string[]=[];
 if(words.length<110)guidance.push('P31 practice target: develop at least 110 words before self-review.');
 if(sentences<4)guidance.push('Develop at least four punctuated sentences; sentence segmentation is only approximate.');
 if(!markerFamilies.includes('contrast')&&!markerFamilies.includes('concession'))
  guidance.push('Consider an explicit counter-position or concession.');
 if(!markerFamilies.includes('condition')&&!markerFamilies.includes('qualification'))
  guidance.push('Qualify your conclusion with a condition or uncertainty.');
 if(!markerFamilies.includes('example'))guidance.push('Consider an example grounded in the question.');
 if(!markerFamilies.includes('conclusion'))guidance.push('Make your final recommendation explicit.');
 if(possibleRepeatedPhrases>3)guidance.push('Several five-word sequences repeat; reread for unnecessary repetition.');
 if(!guidance.length)guidance.push('Visible structural cues are present. Check meaning, grammar, factual accuracy and relevance yourself; none is automatically validated.');
 return {words:words.length,sentences,distinctWords:new Set(words.filter(w=>w.length>=4)).size,markerFamilies,possibleRepeatedPhrases,guidance};
}
/** Diagnostic for five-word verbatim copying; NOT a plagiarism or semantic check. */
export function sourceFivegramOverlap(answer:string,source:string):number{
 const sourceWords=tokens(source),response=tokens(answer);
 if(response.length<5||sourceWords.length<5)return 0;
 const grams=new Set<string>();
 for(let i=0;i+5<=sourceWords.length;i++)grams.add(sourceWords.slice(i,i+5).join(' '));
 let copies=0;
 for(let i=0;i+5<=response.length;i++)if(grams.has(response.slice(i,i+5).join(' ')))copies++;
 return copies/Math.max(1,response.length-4);
}
