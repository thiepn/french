import { readFile } from "node:fs/promises";

const [html,serviceWorker]=await Promise.all([
  readFile(new URL("../index.html",import.meta.url),"utf8"),
  readFile(new URL("../service-worker.js",import.meta.url),"utf8")
]);

const failures=[];
const required=[
  "P30 B2 Communicative Corpus Expansion, Advanced Functional Coverage & Benchmark Unlock",
  "const V5210_VERSION='5.21.0';",
  "const V5210_ADVANCED_FUNCTIONS=Object.freeze(['evaluate','qualify','hypothesize','persuade','mediate','synthesize']);",
  "const V5210_B2_MIN=Object.freeze({readings:6,listening:6,scenarios:5,missions:2,functionContexts:2});",
  "id:'read-b2-teletravail'",
  "id:'read-b2-logement'",
  "id:'read-b2-algorithmes'",
  "id:'read-b2-prevention'",
  "id:'read-b2-transports'",
  "id:'read-b2-association'",
  "id:'work-policy-debate'",
  "id:'civic-transport-debate'",
  "id:'project-crisis'",
  "id:'media-claim'",
  "id:'team-conflict'",
  "id:'advanced-workplace'",
  "id:'public-reasoning'",
  "evaluate:{label:'Evaluate evidence / options'",
  "qualify:{label:'Qualify a claim'",
  "hypothesize:{label:'Explore consequences'",
  "persuade:{label:'Build a persuasive case'",
  "mediate:{label:'Mediate viewpoints'",
  "synthesize:{label:'Synthesize & conclude'",
  "const V580_LEVEL_WORDS=Object.freeze({A1:3,A2:5,B1:7,B2:10});",
  "({A1:1,A2:2,B1:3,B2:4})",
  "started>=1400?'B2'",
  "missions:Object.freeze(['advanced-workplace','public-reasoning'])",
  "minIndependentRate:88,minEvidence:.68,minIntent:.68,maxSupport:1",
  "B2 benchmark is locked because the audited B2 communicative corpus is incomplete.",
  "const V5200_LEVELS=Object.freeze(['A1','A2','B1','B2']);",
  "b2Content=v5160LevelContent('B2');if(!b2Content.promotionCoverage)errors.push('B2 communicative corpus incomplete after P30');",
  "p30-b2-corpus-v1",
  "dataset.b2Benchmark='audited-advanced-functional-v1'"
];
for(const token of required)if(!html.includes(token))failures.push("missing P30 invariant: "+token);

const b2ReadingCount=(html.match(/id:'read-b2-[^']+'/g)||[]).length;
const b2ScenarioIds=['work-policy-debate','civic-transport-debate','project-crisis','media-claim','team-conflict'];
const b2MissionIds=['advanced-workplace','public-reasoning'];
if(b2ReadingCount<6)failures.push("fewer than six B2 readings found");
for(const id of b2ScenarioIds)if(!html.includes("id:'"+id+"'"))failures.push("missing B2 scenario "+id);
for(const id of b2MissionIds)if(!html.includes("id:'"+id+"'"))failures.push("missing B2 mission "+id);

const advanced=['evaluate','qualify','hypothesize','persuade','mediate','synthesize'];
for(const fn of advanced){
  const scenarioPattern=new RegExp("level:'B2'[\\s\\S]{0,500}?functions:\\[[^\\]]*'"+fn+"'","g");
  const alternatePattern=new RegExp("functions:\\[[^\\]]*'"+fn+"'[^\\]]*\\][\\s\\S]{0,350}?level:'B2'","g");
  const direct=(html.match(scenarioPattern)||[]).length+(html.match(alternatePattern)||[]).length;
  if(direct<2 && !html.includes("(advanced[fn]||0)>=V5210_B2_MIN.functionContexts")) failures.push(fn+" lacks multi-context structural enforcement");
}

const cacheMatch=serviceWorker.match(/french-shell-v(\d+)/);
if(!cacheMatch||Number(cacheMatch[1])<44)failures.push("offline shell cache predates P30");

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
  schema:"thiepn-french-p30-b2-corpus-smoke",
  ok:failures.length===0,
  failures,
  version:"5.21.0",
  expected:{readings:6,listening:6,scenarios:5,missions:2,advancedFunctions:6}
},null,2));

if(failures.length)process.exitCode=1;
