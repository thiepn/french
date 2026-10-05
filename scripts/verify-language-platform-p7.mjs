import { readFile } from "node:fs/promises";

const [html,vendor,serviceWorker]=await Promise.all([
  readFile(new URL("../index.html",import.meta.url),"utf8"),
  readFile(new URL("../vendor/thiepn-languages-consumer-contract.js",import.meta.url),"utf8"),
  readFile(new URL("../service-worker.js",import.meta.url),"utf8")
]);

const failures=[];
const vendorScript='<script src="./vendor/thiepn-languages-consumer-contract.js"></script>';
const vendorPos=html.indexOf(vendorScript);
const mainPos=html.indexOf("<script>\n  (() => {\n    'use strict';",vendorPos+1);

if(vendorPos<0)failures.push("vendor contract script is not loaded");
if(mainPos<0)failures.push("main application script marker missing");
if(vendorPos>=0&&mainPos>=0&&vendorPos>mainPos)failures.push("vendor contract must load before the main application");
if(!html.includes("THIEPN_LANGUAGES_SOURCE_BASELINE = '28a39ce1c59ab02301b408f016522dbddc28d0c0'"))failures.push("audited French source baseline missing");
if(!html.includes("THIEPN_LANGUAGES_COMPAT?.integrationMode==='read-only'"))failures.push("read-only integration guard missing");
if(!html.includes("THIEPN_LANGUAGES_COMPAT?.authority?.memory==='consumer'"))failures.push("consumer memory authority guard missing");
if(!html.includes("sharedStateAuthoritative===false"))failures.push("shared-authority rejection missing");
if(!vendor.includes("thiepn/languages@56bb7fda23ca179ae233cbc8d6f1c17b2f8cbc49"))failures.push("vendored platform commit pin missing");
if(!vendor.includes('const contractVersion="p7-readonly-v1"'))failures.push("unexpected platform contract version");
if(!serviceWorker.includes("./vendor/thiepn-languages-consumer-contract.js"))failures.push("platform contract missing from offline app shell");

console.log(JSON.stringify({
  schema:"thiepn-french-p7-platform-smoke",
  ok:failures.length===0,
  failures,
  platformCommit:"56bb7fda23ca179ae233cbc8d6f1c17b2f8cbc49",
  sourceBaseline:"28a39ce1c59ab02301b408f016522dbddc28d0c0"
},null,2));

if(failures.length)process.exitCode=1;
