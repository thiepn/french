import { readFile } from "node:fs/promises";

const [html,serviceWorker]=await Promise.all([
  readFile(new URL("../index.html",import.meta.url),"utf8"),
  readFile(new URL("../service-worker.js",import.meta.url),"utf8")
]);

const failures=[];
const required=[
  "const APP_VERSION = '5.22.0';",
  "P31 B2 Open-Ended Production, Argumentation Quality & Advanced Assessment Calibration",
  "const V5220_VERSION='5.22.0';",
  "const V5220_POLICY='p31-b2-open-production-v1';",
  "const V5220_EVALUATOR='b2-open-production-rubric-v1';",
  "const V5220_VALID_DAYS=35;",
  "const V5220_MIN_ASSESSMENT_SCORE=.62;",
  "const V5220_MIN_ASSESSMENT_CONFIDENCE=.68;",
  "id:'prod-work-hybrid'",
  "id:'prod-city-mobility'",
  "id:'prod-media-claim'",
  "id:'prod-project-crisis'",
  "id:'prod-team-conflict'",
  "id:'prod-priority-choice'",
  "task:'Task coverage'",
  "argument:'Argumentation'",
  "nuance:'Nuance'",
  "cohesion:'Cohesion'",
  "range:'Lexical range'",
  "complexity:'Structural complexity'",
  "words.length>=prompt.minWords",
  "sentences.length>=4",
  "task>=.60",
  "argument>=.42",
  "nuance>=.35",
  "cohesion>=.35",
  "score>=.58",
  "confidence>=.66",
  "repetitionPenalty>=.80",
  "tasks.some(function(row){return !row?.passed;})",
  "I wrote this response without a translator, AI-generated answer, model response, or notes.",
  "gate.openProductionRequired=true",
  "gate.coverage=false",
  "gate.score=Math.min(gate.score,calibration.score)",
  "B2 benchmark requires a current P31 open-production calibration first.",
  "B2 benchmark cannot pass without current P31 open-production calibration.",
  "preset:'advanced-production'",
  "name==='advanced-production'",
  "v5220CalibrationFixtures()",
  "weak calibration fixture incorrectly passes",
  "strong calibration fixture does not pass",
  "raw learner production leaked into persistent P31 state",
  "producerRevision:'french-p8-read-model-v3'",
  "id:'b2-open-production-calibration'",
  "v5220CalibrationSnapshot()",
  "dataset.advancedAssessment='confidence-calibrated-v1'"
];
for(const token of required)if(!html.includes(token))failures.push("missing P31 invariant: "+token);

const promptCount=(html.match(/id:'prod-[^']+'/g)||[]).length;
if(promptCount!==6)failures.push("expected exactly six P31 production prompts, found "+promptCount);

if(html.includes("markers.filter(function(marker){return v580Has(folded,marker);})")){
  failures.push("P31 marker detection reverted to substring-permissive v580Has");
}
if(!html.includes("(' '+folded+' ').includes(' '+needle+' ')")){
  failures.push("P31 exact phrase-boundary marker matcher missing");
}

const normalizeTaskStart=html.indexOf("function v5220NormalizeTask(row)");
const normalizeAttemptStart=html.indexOf("function v5220NormalizeAttempt(row)",normalizeTaskStart);
const normalizeStateStart=html.indexOf("function v5220NormalizeState(raw)",normalizeAttemptStart);
if(normalizeTaskStart<0||normalizeAttemptStart<0||normalizeStateStart<0){
  failures.push("P31 persistence normalizers could not be isolated");
}else{
  const persistedShape=html.slice(normalizeTaskStart,normalizeStateStart);
  if(/\btext\s*:|\bresponse\s*:|\bdraft\s*:/i.test(persistedShape))failures.push("raw response-like field present in persisted P31 shapes");
}

const cacheMatch=serviceWorker.match(/french-shell-v(\d+)/);
if(!cacheMatch||Number(cacheMatch[1])<46)failures.push("offline shell cache predates P31");

const mainMarker="<script>\n  (() => {\n    'use strict';";
const start=html.indexOf(mainMarker),end=start>=0?html.indexOf("</script>",start):-1;
if(start<0||end<0){
  failures.push("main application script could not be isolated");
}else{
  const source=html.slice(start+"<script>".length,end);
  try{new Function(source);}
  catch(error){failures.push("main application JavaScript parse failure: "+String(error?.message||error));}
}

console.log(JSON.stringify({
  schema:"thiepn-french-p31-open-production-smoke",
  ok:failures.length===0,
  failures,
  version:"5.22.0",
  policy:"p31-b2-open-production-v1",
  evaluator:"b2-open-production-rubric-v1"
},null,2));

if(failures.length)process.exitCode=1;
