import { readFile } from "node:fs/promises";

const [html,vendor,serviceWorker]=await Promise.all([
  readFile(new URL("../index.html",import.meta.url),"utf8"),
  readFile(new URL("../vendor/thiepn-languages-read-model.js",import.meta.url),"utf8"),
  readFile(new URL("../service-worker.js",import.meta.url),"utf8")
]);

const failures=[];
const vendorScript='<script src="./vendor/thiepn-languages-read-model.js"></script>';
const vendorPos=html.indexOf(vendorScript);
const mainPos=html.indexOf("<script>\n  (() => {\n    'use strict';",vendorPos+1);
const producerStart=html.indexOf("function thiepnFrenchLanguageReadModel()");
const producerEnd=html.indexOf("function thiepnFrenchPublishLanguageReadModel()",producerStart);
const producer=producerStart>=0&&producerEnd>producerStart?html.slice(producerStart,producerEnd):"";

if(vendorPos<0)failures.push("P8 read-model artifact is not loaded");
if(mainPos<0)failures.push("main application script marker missing");
if(vendorPos>=0&&mainPos>=0&&vendorPos>mainPos)failures.push("P8 read-model artifact must load before the controller");
if(!vendor.includes("thiepn/languages@e74a10aa9d9d161c7f427ce7691be32df4bbc31c"))failures.push("P8 platform commit pin missing");
if(!vendor.includes('MODEL="p8-read-model-v1"'))failures.push("unexpected P8 read-model version");
if(!serviceWorker.includes("./vendor/thiepn-languages-read-model.js"))failures.push("P8 read-model artifact missing from offline shell");
if(!html.includes("THIEPN_FRENCH_LANGUAGE_READ_MODEL"))failures.push("French P8 producer is not exposed");
if(!html.includes("THIEPN_LANGUAGE_READ_MODEL_API?.readModelVersion==='p8-read-model-v1'"))failures.push("P8 boot contract guard missing");
if(!producer.includes("coachSnapshot()"))failures.push("French next action is not sourced from the authoritative coach");
if(!producer.includes("v5160ReconcilePromotions()"))failures.push("French proficiency projection is not sourced from P25");
for(const forbidden of ["studyEvents","memoryTraces","privateDocuments","privateVocabulary","privateSentences","accountId","userId"]){
  if(producer.includes(forbidden))failures.push("forbidden raw/private field in producer: "+forbidden);
}

console.log(JSON.stringify({
  schema:"thiepn-french-p8-read-model-smoke",
  ok:failures.length===0,
  failures,
  platformCommit:"e74a10aa9d9d161c7f427ce7691be32df4bbc31c",
  readModelVersion:"p8-read-model-v1"
},null,2));

if(failures.length)process.exitCode=1;
