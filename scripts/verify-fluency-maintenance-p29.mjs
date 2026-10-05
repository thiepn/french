import { readFile } from "node:fs/promises";

const [html,serviceWorker]=await Promise.all([
  readFile(new URL("../index.html",import.meta.url),"utf8"),
  readFile(new URL("../service-worker.js",import.meta.url),"utf8")
]);

const failures=[];
const required=[
  "const APP_VERSION = '5.20.0';",
  "P29 Functional Fluency Consolidation, Maintenance & Long-Term Transfer",
  "const V5200_CONSOLIDATION_DAYS=7;",
  "const V5200_MAINTENANCE_DAYS=30;",
  "const V5200_LONG_TERM_DAYS=60;",
  "const V5200_STALE_GRACE_DAYS=30;",
  "const V5200_LEVELS=Object.freeze(['A1','A2','B1']);",
  "row.level===level&&row.passed===true",
  "pass.completedAt-previous.completedAt>=days(V5200_CONSOLIDATION_DAYS)",
  "contexts.length>=2",
  "spaced.length>=3",
  "latestAttempt&&!latestAttempt.passed&&latestAttempt.completedAt>latestPass.completedAt",
  "key='evidence-stale'",
  "oldEvidenceMeansAbilityLost:false",
  "practiceCountsAsMaintenance:false",
  "contextSignature:String(row.contextSignature||'')",
  "run.scenarioResults||[]",
  "preset:'maintenance'",
  "name==='maintenance'",
  "coach.preset==='maintenance'",
  "kind='maintain'",
  "fluencyMaintenance.maintenanceNeeded",
  "p29-functional-maintenance-v1",
  "dataset.longTermTransfer='delayed-spaced-variant-evidence-v1'"
];

for(const token of required){
  if(!html.includes(token))failures.push("missing P29 invariant: "+token);
}

if(/V5200_LEVELS[^\n]*B2/.test(html))failures.push("P29 maintenance scope unexpectedly contains B2");
if(!html.includes("stale means evidence is stale, not that ability is assumed lost") &&
   !html.includes("evidence is stale, not that ability is assumed lost")) {
  failures.push("stale-evidence non-decay semantics copy missing");
}
if(!serviceWorker.includes("french-shell-v43"))failures.push("offline shell cache was not advanced to v43");

const mainMarker="<script>\n  (() => {\n    'use strict';";
const start=html.indexOf(mainMarker);
const end=start>=0?html.indexOf("</script>",start):-1;
if(start<0||end<0){
  failures.push("main application script could not be isolated for syntax verification");
}else{
  const source=html.slice(start+"<script>".length,end);
  try{new Function(source);}
  catch(error){failures.push("main application JavaScript parse failure: "+String(error?.message||error));}
}

console.log(JSON.stringify({
  schema:"thiepn-french-p29-fluency-maintenance-smoke",
  ok:failures.length===0,
  failures,
  version:"5.20.0",
  policy:"p29-functional-maintenance-v1",
  thresholds:{consolidationDays:7,maintenanceDays:30,longTermDays:60}
},null,2));

if(failures.length)process.exitCode=1;
