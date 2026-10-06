import { access, readFile, readdir, stat } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = fileURLToPath(new URL("../", import.meta.url));
const scriptsDir = path.join(root, "scripts");
const workflowsDir = path.join(root, ".github", "workflows");

const failures = [];
const checks = [];

function ok(name, detail = "") {
  checks.push({ name, ok: true, detail });
}

function fail(name, detail) {
  checks.push({ name, ok: false, detail });
  failures.push(name + ": " + detail);
}

async function exists(relativePath) {
  try {
    await access(path.join(root, relativePath));
    return true;
  } catch {
    return false;
  }
}

async function requireFile(relativePath) {
  if (!(await exists(relativePath))) {
    fail("required-file:" + relativePath, "missing");
    return null;
  }
  const info = await stat(path.join(root, relativePath));
  if (!info.isFile() || info.size === 0) {
    fail("required-file:" + relativePath, "not a non-empty file");
    return null;
  }
  ok("required-file:" + relativePath, String(info.size) + " bytes");
  return info;
}

const [html, serviceWorker, manifestText, cname] = await Promise.all([
  readFile(path.join(root, "index.html"), "utf8"),
  readFile(path.join(root, "service-worker.js"), "utf8"),
  readFile(path.join(root, "manifest.webmanifest"), "utf8"),
  readFile(path.join(root, "CNAME"), "utf8")
]);

if (html.includes("const APP_VERSION = '5.24.0';")) {
  ok("candidate-version", "5.24.0");
} else {
  fail("candidate-version", "P34 must qualify the exact P33 5.24.0 candidate");
}

if (html.includes("P33 B2 Spontaneous Spoken Production, Fluency, Discourse Control & Oral Assessment Calibration")) {
  ok("p33-candidate-present");
} else {
  fail("p33-candidate-present", "P33 release marker missing");
}

if (/const CACHE_NAME = ['"]french-shell-v49['"]/.test(serviceWorker)) {
  ok("offline-shell", "v49");
} else {
  fail("offline-shell", "expected stable P35 shell french-shell-v49");
}

for (const token of [
  "self.addEventListener('install'",
  "self.addEventListener('activate'",
  "self.addEventListener('fetch'",
  "self.skipWaiting()",
  "self.clients.claim()"
]) {
  if (serviceWorker.includes(token)) ok("service-worker:" + token);
  else fail("service-worker:" + token, "missing");
}

let manifest;
try {
  manifest = JSON.parse(manifestText);
  ok("manifest-json");
} catch (error) {
  fail("manifest-json", String(error?.message || error));
}

if (manifest) {
  const requiredManifest = {
    id: "/",
    name: "French",
    short_name: "French",
    start_url: "/",
    scope: "/",
    display: "standalone"
  };
  for (const [key, value] of Object.entries(requiredManifest)) {
    if (manifest[key] === value) ok("manifest:" + key, String(value));
    else fail("manifest:" + key, "expected " + JSON.stringify(value) + ", got " + JSON.stringify(manifest[key]));
  }
  const iconSources = new Set((manifest.icons || []).map(icon => icon?.src));
  for (const src of ["/icon-192.png", "/icon-512.png", "/maskable-icon.svg"]) {
    if (iconSources.has(src)) ok("manifest-icon:" + src);
    else fail("manifest-icon:" + src, "missing");
  }
}

if (cname.trim() === "french.thiepn.dev") {
  ok("production-domain", "french.thiepn.dev");
} else {
  fail("production-domain", "CNAME is " + JSON.stringify(cname.trim()));
}

for (const relativePath of [
  "index.html",
  "manifest.webmanifest",
  "icon.svg",
  "icon-192.png",
  "icon-512.png",
  "maskable-icon.svg",
  "vendor/thiepn-languages-consumer-contract.js",
  "vendor/thiepn-languages-read-model.js",
  "vendor/thiepn-languages-dashboard.js"
]) {
  await requireFile(relativePath);
}

const appShellBlock = serviceWorker.match(/const APP_SHELL\s*=\s*\[([\s\S]*?)\];/);
if (!appShellBlock) {
  fail("service-worker-app-shell", "APP_SHELL could not be isolated");
} else {
  const shellEntries = [...appShellBlock[1].matchAll(/['"]([^'"]+)['"]/g)].map(match => match[1]);
  if (shellEntries.length < 8) {
    fail("service-worker-app-shell", "expected at least 8 shell entries, got " + shellEntries.length);
  } else {
    ok("service-worker-app-shell", shellEntries.length + " entries");
  }
  for (const entry of shellEntries) {
    if (entry === "./") continue;
    const relativePath = entry.replace(/^\.\//, "").replace(/^\//, "");
    if (await exists(relativePath)) ok("app-shell-file:" + relativePath);
    else fail("app-shell-file:" + relativePath, "missing");
  }
}

const workflowFiles = (await readdir(workflowsDir)).filter(name => /\.ya?ml$/i.test(name)).sort();
if (workflowFiles.length < 7) {
  fail("workflow-inventory", "expected at least 7 workflows, got " + workflowFiles.length);
} else {
  ok("workflow-inventory", workflowFiles.length + " workflows");
}

const bypassPatterns = [
  { label: "continue-on-error", regex: /continue-on-error\s*:\s*true/i },
  { label: "shell-success-mask", regex: /\|\|\s*true\b/ },
  { label: "literal-disabled-if", regex: /^\s*if\s*:\s*(?:false|\$\{\{\s*false\s*\}\})\s*$/im }
];

for (const name of workflowFiles) {
  const source = await readFile(path.join(workflowsDir, name), "utf8");
  for (const pattern of bypassPatterns) {
    if (pattern.regex.test(source)) {
      fail("workflow-bypass:" + name, pattern.label);
    }
  }
}
if (!failures.some(item => item.startsWith("workflow-bypass:"))) {
  ok("workflow-bypass-scan", "no known fail-open bypass markers");
}

const verifierFiles = (await readdir(scriptsDir))
  .filter(name => /^verify-.*\.mjs$/i.test(name) && name !== "verify-production-p34.mjs")
  .sort();

const expectedVerifiers = [
  "verify-language-platform-p7.mjs",
  "verify-language-read-model-p8.mjs",
  "verify-functional-benchmark-p28.mjs",
  "verify-fluency-maintenance-p29.mjs",
  "verify-b2-corpus-p30.mjs",
  "verify-open-production-p31.mjs",
  "verify-integrated-capstone-p32.mjs",
  "verify-spontaneous-oral-p33.mjs"
];

for (const name of expectedVerifiers) {
  if (verifierFiles.includes(name)) ok("verifier-present:" + name);
  else fail("verifier-present:" + name, "missing");
}

const verifierRuns = [];
for (const name of verifierFiles) {
  const run = spawnSync(process.execPath, [path.join(scriptsDir, name)], {
    cwd: root,
    encoding: "utf8",
    timeout: 120000
  });
  const entry = {
    name,
    status: run.status,
    signal: run.signal || null,
    stdout: (run.stdout || "").trim().slice(-4000),
    stderr: (run.stderr || "").trim().slice(-4000)
  };
  verifierRuns.push(entry);
  if (run.status === 0) ok("regression:" + name);
  else fail(
    "regression:" + name,
    "exit=" + String(run.status) +
      (entry.signal ? " signal=" + entry.signal : "") +
      (entry.stderr ? " stderr=" + entry.stderr : "") +
      (entry.stdout ? " stdout=" + entry.stdout : "")
  );
}

ok("p34-fail-closed", "qualification exits non-zero when any required check fails");

const report = {
  schema: "thiepn-french-p34-production-qualification-v1",
  candidate: {
    appVersion: "5.24.0",
    offlineShell: "v49",
    domain: "french.thiepn.dev"
  },
  ok: failures.length === 0,
  totals: {
    checks: checks.length,
    passed: checks.filter(check => check.ok).length,
    failed: checks.filter(check => !check.ok).length,
    regressionVerifiers: verifierRuns.length
  },
  failures,
  verifierRuns: verifierRuns.map(run => ({
    name: run.name,
    status: run.status,
    signal: run.signal
  }))
};

console.log(JSON.stringify(report, null, 2));
if (failures.length) process.exitCode = 1;
