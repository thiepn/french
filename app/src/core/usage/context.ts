/** P37I-C5: newly authored contextual prompts, not part of the P35 source corpus.
 * These are independent communicative situations. Deterministic matching can
 * certify only an exact model sentence, never full semantic correctness.
 * Keep learner text out of persistence and exports.
 */
export interface ContextScene{
  id:string;recordId:string;variant:0|1;
  situation:string;english:string;expected:string;
  hint:string;
}
export const CONTEXT_SCENES:readonly ContextScene[]=[
  {id:'c5-001a',recordId:'p10-001',variant:0,situation:'Language class',
    english:'I am learning to read in French.',expected:"J'apprends à lire en français.",
    hint:'Use apprendre à + infinitive with je.'},
  {id:'c5-001b',recordId:'p10-001',variant:1,situation:'Home',
    english:'She is learning to cook.',expected:'Elle apprend à cuisiner.',
    hint:'Use apprendre à + infinitive with elle.'},
  {id:'c5-004a',recordId:'p10-004',variant:0,situation:'Family',
    english:'I help my sister to study.',expected:"J'aide ma sœur à étudier.",
    hint:'Use aider + person + à + infinitive.'},
  {id:'c5-004b',recordId:'p10-004',variant:1,situation:'Neighborhood',
    english:'We help our neighbor carry the bags.',expected:'Nous aidons notre voisin à porter les sacs.',
    hint:'Use aider + person + à + infinitive.'},
  {id:'c5-013a',recordId:'p10-013',variant:0,situation:'Planning',
    english:'I decided to study tonight.',expected:"J'ai décidé d'étudier ce soir.",
    hint:'Use décider de + infinitive in the passé composé.'},
  {id:'c5-013b',recordId:'p10-013',variant:1,situation:'Travel',
    english:'We decided to leave early.',expected:'Nous avons décidé de partir tôt.',
    hint:'Use décider de + infinitive in the passé composé.'},
  {id:'c5-023a',recordId:'p10-023',variant:0,situation:'Family',
    english:'I ask my brother to wait.',expected:"Je demande à mon frère d'attendre.",
    hint:'Use demander à + person + de + infinitive.'},
  {id:'c5-023b',recordId:'p10-023',variant:1,situation:'Work',
    english:'She asks her colleague to call tomorrow.',expected:"Elle demande à son collègue d'appeler demain.",
    hint:'Use demander à + person + de + infinitive.'},
  {id:'c5-036a',recordId:'p10-036',variant:0,situation:'Weather',
    english:'We must take the weather into account.',expected:'Nous devons tenir compte de la météo.',
    hint:'Use tenir compte de + noun.'},
  {id:'c5-036b',recordId:'p10-036',variant:1,situation:'Classroom',
    english:'The teacher takes our questions into account.',expected:'Le professeur tient compte de nos questions.',
    hint:'Conjugate tenir in the present, then use compte de.'},
  {id:'c5-048a',recordId:'p10-048',variant:0,situation:'Studying',
    english:'I have trouble understanding this word.',expected:"J'ai du mal à comprendre ce mot.",
    hint:'Use avoir du mal à + infinitive.'},
  {id:'c5-048b',recordId:'p10-048',variant:1,situation:'Travel',
    english:'They have trouble finding the station.',expected:'Ils ont du mal à trouver la gare.',
    hint:'Use avoir du mal à + infinitive.'},
  {id:'c5-050a',recordId:'p10-050',variant:0,situation:'University',
    english:'I take notes during class.',expected:'Je prends des notes pendant le cours.',
    hint:'Conjugate prendre; use des notes.'},
  {id:'c5-050b',recordId:'p10-050',variant:1,situation:'Work',
    english:'We take notes during the meeting.',expected:'Nous prenons des notes pendant la réunion.',
    hint:'Conjugate prendre with nous.'},
  {id:'c5-065a',recordId:'p10-065',variant:0,situation:'Healthcare',
    english:'I made an appointment with the doctor.',expected:"J'ai pris rendez-vous avec le médecin.",
    hint:'Use prendre rendez-vous avec in the passé composé.'},
  {id:'c5-065b',recordId:'p10-065',variant:1,situation:'Dental clinic',
    english:'She is making an appointment with the dentist.',expected:'Elle prend rendez-vous avec le dentiste.',
    hint:'Use prendre rendez-vous avec in the present.'}
  {id:'c6-002a',recordId:'p10-002',variant:0,situation:'At home',
    english:'I manage to open the window.',expected:"J'arrive à ouvrir la fenêtre.",
    hint:'Use arriver à + infinitive with je.'},
  {id:'c6-002b',recordId:'p10-002',variant:1,situation:'In class',
    english:'She manages to understand the explanation.',expected:'Elle arrive à comprendre l’explication.',
    hint:'Use arriver à + infinitive with elle.'},
  {id:'c6-014a',recordId:'p10-014',variant:0,situation:'Mathematics',
    english:'I am trying to solve the problem.',expected:"J'essaie de résoudre le problème.",
    hint:'Use essayer de + infinitive with je.'},
  {id:'c6-014b',recordId:'p10-014',variant:1,situation:'Community',
    english:'We are trying to help our neighbors.',expected:"Nous essayons d'aider nos voisins.",
    hint:'Use essayer de + infinitive with nous.'},
  {id:'c6-018a',recordId:'p10-018',variant:0,situation:'Family',
    english:'I promise to come back tomorrow.',expected:'Je promets de revenir demain.',
    hint:'Use promettre de + infinitive with je.'},
  {id:'c6-018b',recordId:'p10-018',variant:1,situation:'Work',
    english:'They promise to finish on time.',expected:'Ils promettent de finir à temps.',
    hint:'Use promettre de + infinitive with ils.'},
  {id:'c6-051a',recordId:'p10-051',variant:0,situation:'At the office',
    english:'I take note of your address.',expected:'Je prends note de votre adresse.',
    hint:'Use prendre note de + noun.'},
  {id:'c6-051b',recordId:'p10-051',variant:1,situation:'Planning meeting',
    english:'We take note of this suggestion.',expected:'Nous prenons note de cette suggestion.',
    hint:'Use prendre note de + noun.'},
];
const sceneMap=new Map(CONTEXT_SCENES.map(scene=>[scene.recordId+':'+scene.variant,scene]));
export function contextScene(recordId:string,variant:0|1):ContextScene|undefined{
  return sceneMap.get(recordId+':'+variant);
}
export function hasContextScenes(recordId:string):boolean{
  return Boolean(contextScene(recordId,0)&&contextScene(recordId,1));
}
function canonical(text:string):string{
  return text.toLocaleLowerCase('fr').normalize('NFC').replace(/’/g,"'")
    .replace(/\s+([,.;!?])/g,'$1').replace(/\s+/g,' ').trim();
}
function withoutAccents(text:string):string{
  return canonical(text).normalize('NFD').replace(/[\u0300-\u036f]/g,'');
}
export type ContextAssessment='exact'|'orthography'|'needs-human-review'|'blank';
export function assessContextAnswer(text:string,scene:ContextScene):ContextAssessment{
  if(!text.trim())return 'blank';
  if(canonical(text)===canonical(scene.expected))return 'exact';
  if(withoutAccents(text)===withoutAccents(scene.expected))return 'orthography';
  return 'needs-human-review';
}
