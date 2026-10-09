/** P37I-D2 — explainable, non-certifying CEFR *practice evidence* gates.
 * The policy below is an internal diagnostic heuristic, NOT official CEFR
 * criteria, the original P25 promotion contract, or a validated exam rubric.
 * Never write to FSRS, the learner profile, or legacy promotion records.
 */
import type {CanonicalReviewEventV1,CanonicalSrsRecordV1} from './model';
import type {ConversationState} from '../conversation/engine';
import type {ReadingItem,VocabularySearchRow} from '../content/loader';
import {CONVERSATION_STARTERS} from '../conversation/scenarios.ts';
import {MISSION_CHAINS} from '../conversation/missions.ts';

const DAY=86_400_000;
export const D2_WINDOW_DAYS=90;
export const CEFR_DIAGNOSTIC_LEVELS=['A1','A2','B1','B2'] as const;
export type CefrDiagnosticLevel=typeof CEFR_DIAGNOSTIC_LEVELS[number];
export type GateStatus='met'|'missing'|'unavailable';
export interface CefrPracticeRule{
  level:CefrDiagnosticLevel;lexicalPairCount:number;
  listeningCount:number;writingCount:number;conversationTurns:number;
  activeDays:number;contexts:number;readingTexts:number;
}
// Explicit, provisional *practice* coverage thresholds, not CEFR standard scores.
export const D2_RULES:readonly CefrPracticeRule[]=[
  {level:'A1',lexicalPairCount:12,listeningCount:3,writingCount:3,conversationTurns:5,activeDays:2,contexts:2,readingTexts:2},
  {level:'A2',lexicalPairCount:20,listeningCount:4,writingCount:4,conversationTurns:8,activeDays:3,contexts:2,readingTexts:2},
  {level:'B1',lexicalPairCount:30,listeningCount:6,writingCount:6,conversationTurns:12,activeDays:3,contexts:3,readingTexts:3},
  {level:'B2',lexicalPairCount:40,listeningCount:8,writingCount:8,conversationTurns:15,activeDays:4,contexts:3,readingTexts:3}
];
export interface CefrGateCheck{
  id:'curriculum'|'lexical'|'reading'|'listening'|'writing'|'conversation'|'speaking'|'assessment';
  title:string;status:GateStatus;observed:string;required:string;detail:string;
  route:'words'|'review'|'read'|'listen'|'write'|'conversation'|'speak'|'progress';
}
export interface CefrLevelGate{
  level:CefrDiagnosticLevel;
  state:'content-unavailable'|'evidence-incomplete'|'practice-checks-met-assessment-pending';
  promotion:'blocked';
  checks:CefrGateCheck[];metPracticeChecks:number;totalPracticeChecks:number;
  missingReasons:string[];
}
export interface CefrGateReport{
  schema:'thiepn-french-p37i-d2-gates';
  windowDays:number;levels:CefrLevelGate[];
  target:CefrDiagnosticLevel;
  officialCertification:false;automaticPromotion:false;
  policyNote:string;
}
export interface CefrGateInput{
  targetLevel?:string;now?:number;
  vocabulary:readonly VocabularySearchRow[];
  srs:readonly CanonicalSrsRecordV1[];
  reviews:readonly CanonicalReviewEventV1[];
  readings:readonly Pick<ReadingItem,'id'|'level'>[];
  readingHistory:Readonly<Record<string,{completedAt:number;questionAttempts?:number;questionCorrect?:number}>>;
  conversations:Pick<ConversationState,'functionEvents'|'missionHistory'>;
}
function finiteTime(time:number,now:number):boolean{
  return Number.isFinite(time)&&time>0&&time<=now+DAY&&time>=now-D2_WINDOW_DAYS*DAY;
}
function days(rows:readonly number[]):number{
  return new Set(rows.map(at=>new Date(at).toISOString().slice(0,10))).size;
}
function practiceLevel(row:{level?:string}):CefrDiagnosticLevel|null{
  return CEFR_DIAGNOSTIC_LEVELS.includes(row.level as CefrDiagnosticLevel)
    ?row.level as CefrDiagnosticLevel:null;
}
function recognizedLevel(raw:string|undefined):CefrDiagnosticLevel{
  return CEFR_DIAGNOSTIC_LEVELS.includes(raw as CefrDiagnosticLevel)?raw as CefrDiagnosticLevel:'A1';
}
function check(id:CefrGateCheck['id'],title:string,met:boolean,observed:string,required:string,
  detail:string,route:CefrGateCheck['route'],unavailable=false):CefrGateCheck{
  return{id,title,status:unavailable?'unavailable':met?'met':'missing',
    observed,required,detail,route};
}
function balancedVocabulary(rows:readonly VocabularySearchRow[],srs:readonly CanonicalSrsRecordV1[],
  level:CefrDiagnosticLevel,now:number):number{
  const wordIds=new Set(rows.filter(word=>word.level===level).map(word=>word.id));
  const skills=new Map<string,Set<string>>();
  for(const row of srs){
    if(!wordIds.has(row.noteId)||!row.noteId||!['recognition','production'].includes(row.skill))continue;
    if(row.status!=='learned'||row.suspended||row.manualKnown||row.seen<2||
       !['good','easy'].includes(row.lastRating)||!finiteTime(row.lastReviewedAt,now)||
       row.dueAt<=now||row.dueAt<=0)continue;
    // Pair actual note AND sense; a similar lemma or different sense
    // is never substituted for proof of lexical command.
    const key=row.noteId+':'+row.sense;
    const have=skills.get(key)??new Set<string>();
    have.add(row.skill);skills.set(key,have);
  }
  return new Set([...skills.entries()].filter(([,have])=>
    have.has('recognition')&&have.has('production')).map(([key])=>key.split(':').slice(0,-1).join(':'))).size;
}
function independentlyWritten(row:CanonicalReviewEventV1):boolean{
  return row.practiceOnly===true&&row.practice.startsWith('written-')&&row.correct===true&&
    row.typed===true&&row.typedQuality==='exact'&&row.supportLevel===0&&
    !row.manualJudgment?.startsWith('self-')&&row.manualJudgment!=='manual'&&
    !row.transcriptUsed&&!row.translationUsed&&Boolean(row.sentenceExerciseId);
}
function independentlyHeard(row:CanonicalReviewEventV1):boolean{
  return row.practiceOnly===true&&row.practice.startsWith('contextual-listening')&&
    row.correct===true&&row.firstListen===true&&row.supportLevel===0&&
    row.playCount===1&&(row.playbackRate??0)>=1&&
    !row.transcriptUsed&&!row.translationUsed;
}
export function evaluateCefrEvidence(input:CefrGateInput):CefrGateReport{
  const now=input.now??Date.now(),levels:CefrLevelGate[]=[];
  const timed=input.reviews.filter(e=>finiteTime(e.t,now));
  const vocabulary=input.vocabulary;
  for(const rule of D2_RULES){
    const level=rule.level;
    const contentTexts=input.readings.filter(r=>r.level===level);
    const scenes=CONVERSATION_STARTERS.filter(s=>s.level===level);
    const missions=MISSION_CHAINS.filter(m=>m.level===level&&
      m.scenarioIds.every(id=>scenes.some(s=>s.id===id)));
    // P27's coverage minima: 3 reading, 3 listening items, 3
    // scenarios, 1 functional mission. Listening item provenance
    // is not independently auditable here, so that part stays open.
    const curriculumReady=contentTexts.length>=3&&scenes.length>=3&&missions.length>=1;
    const checks:CefrGateCheck[]=[];
    checks.push(check('curriculum','Native curriculum coverage',curriculumReady,
      contentTexts.length+' readings · '+scenes.length+' scenarios · '+missions.length+' missions',
      '≥3 readings, ≥3 scenarios, ≥1 mission; listening catalog audit pending',
      'P27 content minimums are provisional. Independent listening-source audit is not implemented.',
      'progress',!curriculumReady));
    const balanced=balancedVocabulary(vocabulary,input.srs,level,now);
    checks.push(check('lexical','Balanced vocabulary recall',balanced>=rule.lexicalPairCount,
      balanced+' unique word senses', '≥'+rule.lexicalPairCount+' recent recognition+production pairs',
      'Only recent independently scheduled, non-due learned reviews of the same canonical note and sense count.',
      'review'));
    const readingIds=new Set(contentTexts.map(row=>row.id));
    const completed=Object.entries(input.readingHistory).filter(([id,h])=>
      readingIds.has(id)&&finiteTime(h.completedAt,now)&&
      Number(h.questionAttempts)>=1&&Number(h.questionCorrect)>=1).length;
    checks.push(check('reading','Reading comprehension participation',completed>=rule.readingTexts,
      completed+' distinct texts','≥'+rule.readingTexts+' recent texts with a correct comprehension check',
      'Completion and a correct check show participation; they do not validate CEFR comprehension.',
      'read'));
    const listening=timed.filter(e=>practiceLevel(e)===level&&independentlyHeard(e));
    const listenDays=days(listening.map(e=>e.t));
    checks.push(check('listening','First-listen dictation practice',
      listening.length>=rule.listeningCount&&listenDays>=rule.activeDays,
      listening.length+' exact · '+listenDays+' days',
      '≥'+rule.listeningCount+' exact first-listen responses on ≥'+rule.activeDays+' days',
      'Replays, slow playback, transcripts, translations and supported answers never count.',
      'listen'));
    const writing=timed.filter(e=>practiceLevel(e)===level&&independentlyWritten(e));
    const writingDays=days(writing.map(e=>e.t)),writingContexts=new Set(writing.map(e=>e.sentenceExerciseId)).size;
    checks.push(check('writing','Independent written production',
      writing.length>=rule.writingCount&&writingDays>=rule.activeDays&&writingContexts>=2,
      writing.length+' exact · '+writingDays+' days · '+writingContexts+' prompts',
      '≥'+rule.writingCount+' independent exact models on ≥'+rule.activeDays+' days and ≥2 prompts',
      'Only explicitly level-labelled written attempts count; alternate valid wording requires review.',
      'write'));
    const turns=input.conversations.functionEvents.filter(e=>
      e.level===level&&finiteTime(e.at,now)&&e.independent===true&&e.accepted===true&&
      !e.manual&&e.support===0&&e.credit>=.99);
    const turnDays=days(turns.map(e=>e.at)),contexts=new Set(turns.map(e=>e.scenarioId)).size;
    const levelPasses=input.conversations.missionHistory.filter(m=>
      missions.some(def=>def.id===m.missionId)&&m.independencePass&&m.fullyUnsupported&&
      finiteTime(m.completedAt,now)).length;
    checks.push(check('conversation','Communicative-function breadth',
      turns.length>=rule.conversationTurns&&turnDays>=rule.activeDays&&
      contexts>=rule.contexts&&levelPasses>=1,
      turns.length+' independent turns · '+contexts+' scenes · '+turnDays+' days · '+levelPasses+' mission passes',
      '≥'+rule.conversationTurns+' turns, ≥'+rule.contexts+' scenes, ≥'+rule.activeDays+' days, ≥1 unsupported mission',
      'Prompt-slot matches and native missions remain internal practice, not external oral assessment.',
      'conversation',!missions.length));
    const spoken=timed.filter(e=>practiceLevel(e)===level&&e.practiceOnly&&e.practice.startsWith('spoken-'));
    checks.push(check('speaking','Independently verified speaking',false,
      spoken.length+' recorded practice attempts · 0 externally verified',
      'A qualified independent speaking assessment',
      'Existing speaking results are manual/self-assessed or ASR-assisted; no accredited scoring is available.',
      'speak',true));
    checks.push(check('assessment','Validated level assessment',false,'Not performed',
      'An externally calibrated assessment and explicit learner-approved promotion',
      'Practice metrics cannot award a CEFR level. The native D2 app has no validated promotion examiner.',
      'progress',true));
    const practice=checks.filter(row=>!['speaking','assessment'].includes(row.id));
    const metPracticeChecks=practice.filter(row=>row.status==='met').length;
    const state:CefrLevelGate['state']=!curriculumReady?'content-unavailable':
      metPracticeChecks===practice.length?'practice-checks-met-assessment-pending':'evidence-incomplete';
    levels.push({level,state,promotion:'blocked',checks,metPracticeChecks,
      totalPracticeChecks:practice.length,
      missingReasons:checks.filter(row=>row.status!=='met').map(row=>row.title+': '+row.detail)});
  }
  return{schema:'thiepn-french-p37i-d2-gates',windowDays:D2_WINDOW_DAYS,levels,
    target:recognizedLevel(input.targetLevel),officialCertification:false,automaticPromotion:false,
    policyNote:'D2 thresholds measure coverage of limited in-app practice, not CEFR proficiency. B2 lacks native conversation/mission curriculum. Promotion is always blocked without external assessment and user consent.'};
}
