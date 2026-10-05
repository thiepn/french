import { readFile } from "node:fs/promises";

const [html,serviceWorker]=await Promise.all([
  readFile(new URL("../index.html",import.meta.url),"utf8"),
  readFile(new URL("../service-worker.js",import.meta.url),"utf8")
]);

const failures=[];
const required=[
  "const APP_VERSION = '5.23.0';",
  "P32 B2 Integrated-Skills Capstone, Source-Based Synthesis & Cross-Modal Transfer",
  "const V5230_VERSION='5.23.0';",
  "const V5230_POLICY='p32-b2-integrated-capstone-v1';",
  "const V5230_EVALUATOR='b2-integrated-source-rubric-v1';",
  "const V5230_VALID_DAYS=35;",
  "const V5230_MIN_SCORE=.64;",
  "const V5230_MIN_CONFIDENCE=.70;",
  "const V5230_MIN_SOURCE_COVERAGE=.75;",
  "const V5230_MIN_TRANSFORMATION=.52;",
  "const V5230_MAX_COPY_RATIO=.18;",
  "const V5230_MAX_LISTEN_PLAYS=2;",
  "id:'cap-read-hybrid'",
  "id:'cap-listen-media'",
  "id:'cap-read-mobility'",
  "id:'cap-listen-prevention'",
  "id:'cap-read-housing'",
  "id:'cap-listen-priorities'",
  "v5230Ngrams(source,5)",
  "v5230Ngrams(response,5)",
  "ground.coverage>=V5230_MIN_SOURCE_COVERAGE",
  "transformation>=V5230_MIN_TRANSFORMATION",
  "copyRatio<=V5230_MAX_COPY_RATIO",
  "playCount>=1&&playCount<=V5230_MAX_LISTEN_PLAYS",
  "Transcript hidden during calibrated work",
  "I wrote this response without a translator, AI-generated answer, model response, or external notes",
  "gate.integratedCapstoneRequired=true",
  "gate.score=Math.min(gate.score,capstone.score)",
  "B2 benchmark requires current P32 integrated source-transfer evidence first.",
  "B2 benchmark cannot pass without current P32 integrated source-transfer evidence.",
  "preset:'integrated-capstone'",
  "name==='integrated-capstone'",
  "v5230CalibrationFixtures()",
  "weak P32 calibration fixture incorrectly passes",
  "strong P32 calibration fixture does not pass",
  "producerRevision:'french-p8-read-model-v4'",
  "id:'b2-integrated-capstone'",
  "v5230Snapshot()",
  "dataset.integratedAssessment='source-grounded-cross-modal-v1'"
];
for(const token of required)if(!html.includes(token))failures.push("missing P32 invariant: "+token);

const taskIds=(html.match(/id:'cap-(?:read|listen)-[^']+'/g)||[]);
if(taskIds.length!==6)failures.push("expected exactly six P32 integrated tasks, found "+taskIds.length);

const pairBlock=html.slice(html.indexOf("const V5230_SETS="),html.indexOf("state.v5230Ui=",html.indexOf("const V5230_SETS=")));
if((pairBlock.match(/cap-read-/g)||[]).length!==3||(pairBlock.match(/cap-listen-/g)||[]).length!==3){
  failures.push("P32 rotating sets do not contain three reading/listening pairs");
}

for(const sourceId of [
  "read-b2-teletravail","read-b2-algorithmes","read-b2-transports",
  "read-b2-prevention","read-b2-logement","read-b2-association"
]){
  if(!html.includes("sourceId:'"+sourceId+"'"))failures.push("missing P32 B2 source reference "+sourceId);
}

const normalizeStart=html.indexOf("function v5230NormalizeResult(row)");
const normalizeEnd=html.indexOf("function v5230NormalizeState(raw)",normalizeStart);
if(normalizeStart<0||normalizeEnd<0){
  failures.push("P32 persistence normalizers could not be isolated");
}else{
  const shape=html.slice(normalizeStart,normalizeEnd);
  if(/\btext\s*:|\bresponse\s*:|\bdraft\s*:|\bsourceText\s*:/i.test(shape))failures.push("raw learner/source text field present in persisted P32 shapes");
}

if(!html.includes("if(!practice&&!v5220CalibrationSnapshot().currentPass)"))failures.push("P32 calibrated attempts are not gated by current P31 evidence");

const cacheMatch=serviceWorker.match(/french-shell-v(\d+)/);
if(!cacheMatch||Number(cacheMatch[1])<47)failures.push("offline shell cache predates P32");

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
  schema:"thiepn-french-p32-integrated-capstone-smoke",
  ok:failures.length===0,
  failures,
  version:"5.23.0",
  policy:"p32-b2-integrated-capstone-v1",
  evaluator:"b2-integrated-source-rubric-v1"
},null,2));

if(failures.length)process.exitCode=1;
