import { readFile } from "node:fs/promises";

const [html,vendor,serviceWorker]=await Promise.all([
  readFile(new URL("../index.html",import.meta.url),"utf8"),
  readFile(new URL("../vendor/thiepn-languages-dashboard.js",import.meta.url),"utf8"),
  readFile(new URL("../service-worker.js",import.meta.url),"utf8")
]);

const failures=[];
const vendorScript='<script src="./vendor/thiepn-languages-dashboard.js"></script>';
const readModelScript='<script src="./vendor/thiepn-languages-read-model.js"></script>';
const readModelPos=html.indexOf(readModelScript);
const dashboardPos=html.indexOf(vendorScript);
const publisherStart=html.indexOf("async function thiepnFrenchPublishLanguageDashboard()");
const publisherEnd=html.indexOf("function thiepnFrenchScheduleLanguageDashboardPublish()",publisherStart);
const publisher=publisherStart>=0&&publisherEnd>publisherStart?html.slice(publisherStart,publisherEnd):"";
const tokenStart=html.indexOf("async function thiepnFrenchCoreAccessToken()");
const tokenEnd=html.indexOf("async function thiepnFrenchPublishLanguageDashboard()",tokenStart);
const tokenProvider=tokenStart>=0&&tokenEnd>tokenStart?html.slice(tokenStart,tokenEnd):"";

if(readModelPos<0)failures.push("P8 read-model artifact missing");
if(dashboardPos<0)failures.push("P9 dashboard artifact missing");
if(readModelPos>=0&&dashboardPos>=0&&dashboardPos<readModelPos)failures.push("P9 dashboard artifact must load after P8 read-model artifact");
if(!vendor.includes('CONTRACT="p9-dashboard-v1"'))failures.push("unexpected P9 dashboard contract");
if(!serviceWorker.includes("./vendor/thiepn-languages-dashboard.js"))failures.push("P9 dashboard artifact missing from offline shell");
if(!html.includes("THIEPN_CORE_GATEWAY_URL = 'https://api.thiepn.dev'"))failures.push("Core gateway origin missing");
if(!tokenProvider.includes("meta?.enabled"))failures.push("P9 publish is not gated by explicit French sync enablement");
if(!tokenProvider.includes("account.client.auth.getSession()"))failures.push("P9 bearer token is not sourced from canonical Account session");
if(!publisher.includes("thiepnFrenchLanguageReadModel()"))failures.push("P9 does not publish the authoritative P8 projection");
if(!publisher.includes("createCoreLanguageDashboardClient"))failures.push("shared P9 transport is not used");
if(!html.includes("account.status==='synced'"))failures.push("P9 publish is not gated by successful French reconciliation");
if(!html.includes("publishDashboard:thiepnFrenchPublishLanguageDashboard"))failures.push("P9 producer hook is not exposed");
const producerRevision=html.match(/producerRevision:\'french-p8-read-model-v(\d+)\'/);
if(!producerRevision||Number(producerRevision[1])<5)failures.push("P9 branch regressed the current French producer");
for(const forbidden of ["depthStateSnapshot()","state.reviewLog","state.userCards","state.cardEdits"]){
  if(publisher.includes(forbidden))failures.push("P9 publisher bypasses the P8 privacy projection: "+forbidden);
}

console.log(JSON.stringify({
  schema:"thiepn-french-p9-dashboard-smoke",
  ok:failures.length===0,
  failures,
  dashboardContract:"p9-dashboard-v1",
  producerRevision:(html.match(/producerRevision:\'(french-p8-read-model-v\d+)\'/)||[])[1]||"unknown",
  guestFirst:true
},null,2));

if(failures.length)process.exitCode=1;
