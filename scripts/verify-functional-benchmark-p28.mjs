import { readFile } from "node:fs/promises";

const [html,serviceWorker]=await Promise.all([
  readFile(new URL("../index.html",import.meta.url),"utf8"),
  readFile(new URL("../service-worker.js",import.meta.url),"utf8")
]);

const failures=[];
const required=[
  "const V5190_VERSION='5.19.0';",
  "P28 Real-World Transfer & Functional Fluency Benchmarking",
  "const V5190_STORAGE_KEY='french-functional-benchmarks-v1';",
  "A1:Object.freeze({",
  "missions:Object.freeze(['daily-errands'])",
  "missions:Object.freeze(['arrival-day','social-day'])",
  "missions:Object.freeze(['customer-problems','independent-living'])",
  "run.t<active.startedAt",
  "run.independentRate>=spec.minIndependentRate",
  "run.manualAccepts===0",
  "run.supportMax<=spec.maxSupport",
  "run.averageEvidence>=spec.minEvidence",
  "run.averageIntentConfidence>=spec.minIntent",
  "if(V5190_SPECS.B2)errors.push",
  "v5190Benchmark:v5190NormalizeState",
  "functional-benchmark",
  "p28-functional-benchmark-v1"
];

for(const token of required){
  if(!html.includes(token))failures.push("missing P28 invariant: "+token);
}
if(!html.includes("document.documentElement.dataset.functionalFluency='fixed-task-fresh-evidence-v1'"))failures.push("functional-fluency release marker missing");
if(!html.includes("practice runs outside a benchmark never count"))failures.push("practice/benchmark separation copy missing");
const cacheMatch=serviceWorker.match(/french-shell-v(\d+)/);
if(!cacheMatch||Number(cacheMatch[1])<42)failures.push("offline shell cache predates P28");
if(/B2:Object\.freeze\(\{/.test(html))failures.push("B2 benchmark was enabled despite incomplete audited coverage");

console.log(JSON.stringify({
  schema:"thiepn-french-p28-functional-benchmark-smoke",
  ok:failures.length===0,
  failures,
  version:"5.19.0",
  policy:"p28-functional-benchmark-v1"
},null,2));

if(failures.length)process.exitCode=1;
