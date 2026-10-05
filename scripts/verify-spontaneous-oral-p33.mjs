import { readFile } from "node:fs/promises";

const [html,serviceWorker]=await Promise.all([
  readFile(new URL("../index.html",import.meta.url),"utf8"),
  readFile(new URL("../service-worker.js",import.meta.url),"utf8")
]);

const failures=[];
const required=[
  "const APP_VERSION = '5.24.0';",
  "P33 B2 Spontaneous Spoken Production, Fluency, Discourse Control & Oral Assessment Calibration",
  "const V5240_VERSION='5.24.0';",
  "const V5240_POLICY='p33-b2-spontaneous-oral-v1';",
  "const V5240_EVALUATOR='b2-spontaneous-oral-rubric-v1';",
  "const V5240_VALID_DAYS=35;",
  "const V5240_MIN_ASR_CONFIDENCE=.25;",
  "const V5240_MIN_RESPONSE_MS=40000;",
  "const V5240_MAX_RESPONSE_MS=105000;",
  "const V5240_PREP_SECONDS=20;",
  "id:'oral-work-policy'",
  "id:'oral-media-claim'",
  "id:'oral-city-policy'",
  "id:'oral-project-crisis'",
  "id:'oral-team-conflict'",
  "id:'oral-priority-choice'",
  "mode:'immediate'",
  "mode:'brief-prep'",
  "recognition.lang='fr-FR'",
  "recognition.continuous=true",
  "recognition.interimResults=true",
  "asrConfidence<V5240_MIN_ASR_CONFIDENCE",
  "abstained:abstained",
  "Self-correction is recorded but not penalized by itself.",
  "it does not justify an accent-quality or full pronunciation score.",
  "gate.spontaneousOralRequired=true",
  "gate.score=Math.min(gate.score,oral.score)",
  "B2 benchmark requires current P33 spontaneous oral calibration first.",
  "B2 benchmark cannot pass without current P33 spontaneous oral calibration.",
  "preset:'oral-calibration'",
  "name==='oral-calibration'",
  "producerRevision:'french-p8-read-model-v5'",
  "id:'b2-spontaneous-oral-calibration'",
  "v5240Snapshot()",
  "dataset.oralAssessment='confidence-calibrated-oral-v1'"
];
for(const token of required)if(!html.includes(token))failures.push("missing P33 invariant: "+token);

const promptIds=(html.match(/id:'oral-[^']+'/g)||[]);
if(promptIds.length!==6)failures.push("expected exactly six P33 oral prompts, found "+promptIds.length);

const setStart=html.indexOf("const V5240_SETS=");
const setEnd=html.indexOf("state.v5240Ui=",setStart);
if(setStart<0||setEnd<0){
  failures.push("P33 assessment sets could not be isolated");
}else{
  const block=html.slice(setStart,setEnd);
  if((block.match(/oral-(?:work-policy|city-policy|team-conflict)/g)||[]).length!==3)failures.push("P33 sets do not contain three zero-prep tasks");
  if((block.match(/oral-(?:media-claim|project-crisis|priority-choice)/g)||[]).length!==3)failures.push("P33 sets do not contain three brief-prep tasks");
}

const normalizeStart=html.indexOf("function v5240NormalizeTask(row)");
const normalizeEnd=html.indexOf("function v5240NormalizeState(raw)",normalizeStart);
if(normalizeStart<0||normalizeEnd<0){
  failures.push("P33 persistence normalizers could not be isolated");
}else{
  const shape=html.slice(normalizeStart,normalizeEnd);
  for(const forbidden of ["transcript:","audio:","blob:","recording:","response:","segments:"]){
    if(shape.toLowerCase().includes(forbidden))failures.push("raw oral field present in persisted P33 shape: "+forbidden);
  }
}

if(!html.includes("if(!practice&&!v5220CalibrationSnapshot().currentPass)"))failures.push("P33 calibrated assessment is not gated by P31");
if(!html.includes("if(!practice&&!v5230Snapshot().currentPass)"))failures.push("P33 calibrated assessment is not gated by P32");
if(!html.includes("v5220CloseDialog();v5190StartBenchmark('B2')"))failures.push("P31 benchmark continuation does not re-enter current prerequisite chain");
if(!html.includes("v5230CloseDialog();v5190StartBenchmark('B2')"))failures.push("P32 benchmark continuation does not re-enter current prerequisite chain");

const producerRevision=html.match(/producerRevision:'french-p8-read-model-v(\d+)'/);
if(!producerRevision||Number(producerRevision[1])<5)failures.push("French P8 producer revision predates P33");

const cacheMatch=serviceWorker.match(/french-shell-v(\d+)/);
if(!cacheMatch||Number(cacheMatch[1])<48)failures.push("offline shell cache predates P33");

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
  schema:"thiepn-french-p33-spontaneous-oral-smoke",
  ok:failures.length===0,
  failures,
  version:"5.24.0",
  policy:"p33-b2-spontaneous-oral-v1",
  evaluator:"b2-spontaneous-oral-rubric-v1"
},null,2));

if(failures.length)process.exitCode=1;
