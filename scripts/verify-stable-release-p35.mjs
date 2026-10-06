import { readFile } from 'node:fs/promises';

const [html, manifestText, releaseText, serviceWorker, config, spec, workflow] = await Promise.all([
  readFile(new URL('../index.html', import.meta.url), 'utf8'),
  readFile(new URL('../manifest.webmanifest', import.meta.url), 'utf8'),
  readFile(new URL('../release.json', import.meta.url), 'utf8'),
  readFile(new URL('../service-worker.js', import.meta.url), 'utf8'),
  readFile(new URL('../tests/playwright.p35.config.mjs', import.meta.url), 'utf8'),
  readFile(new URL('../tests/p35-release.spec.mjs', import.meta.url), 'utf8'),
  readFile(new URL('../.github/workflows/p35-stable-release.yml', import.meta.url), 'utf8')
]);

const failures = [];
const requireToken = (source, token, label = token) => {
  if (!source.includes(token)) failures.push('missing ' + label);
};

for (const token of [
  "const APP_VERSION = '5.24.0';",
  "const P35_RELEASE='P35 Stable Release, Live Browser/Device Acceptance & Defect-Only Hardening';",
  "dataset.release='p35-stable-release'",
  "dataset.releaseChannel='stable'",
  "dataset.releaseAcceptance='browser-device-defect-only'",
  "dataset.productScope='adaptive-language-learning'",
  "French — Adaptive language learning",
  "Adaptive French · vocabulary, grammar, listening, speaking & transfer",
  "Local-first French learning with adaptive vocabulary, grammar, reading, listening, speaking, real-world transfer, CEFR-aligned progression, and offline support.",
  "const V5240_VERSION='5.24.0';",
  "const p35HydrateLocalStateBase=v362HydrateLocalState;",
  "const p35ReadCatalogCacheBase=v362ReadCatalogCache;",
  "p35-startup-qa-deferred",
  "const p35LexicalAuditBase=v396BuildAudit;",
  "const p35HighFrequencyAuditBase=v401HighFrequencyAudit;",
  "const p35ContextHealthBase=v402ContextHealth;",
  "const p35ReleaseChecksBase=v410ReleaseChecks;",
  "p35ResetDeferredDiagnostics",
  "Deferred until diagnostics are opened",
  "device:v5100DeviceSnapshot()",
  "globalThis.FrenchP35ReleaseQa=function()",
  "p35DeferBootInitializer",
  "document.readyState==='loading'",
  "window.addEventListener('DOMContentLoaded',resolve,{once:true})",
  "p35-release-hardening-style",
  "z-index:2147483000!important",
  "function p35NormalizeMobileNavigation()",
  "mobile.classList.remove('v36-four','v36-five','v382-four','v382-five','v550-five','v560-six','v570-seven')",
  "grid-template-columns:repeat(8,minmax(58px,1fr))!important",
  "const p35AccountInitBase=thiepnAccountInit;",
  "p35DeferredBootReady",
  "requestIdleCallback",
  "dataset.p35BootReady='true'",
  "document.body.appendChild(mobile)",
  "b2Content=v5160LevelContent('B2')",
  "dataset.oralAssessment='confidence-calibrated-oral-v1'",
  "THIEPN Account — guest-first auth + revision-safe cloud sync.",
  "producerRevision:'french-p8-read-model-v5'"
]) requireToken(html, token);

let manifest = null;
try { manifest = JSON.parse(manifestText); }
catch (error) { failures.push('manifest JSON invalid: ' + String(error?.message || error)); }

if (manifest) {
  if (manifest.name !== 'French') failures.push('manifest name drifted');
  if (manifest.short_name !== 'French') failures.push('manifest short_name drifted');
  if (manifest.start_url !== '/' || manifest.scope !== '/') failures.push('manifest launch scope drifted');
  if (manifest.display !== 'standalone') failures.push('manifest display is not standalone');
  for (const word of ['grammar', 'listening', 'speaking', 'offline']) {
    if (!String(manifest.description || '').toLowerCase().includes(word)) failures.push('manifest description missing ' + word);
  }
}

let release = null;
try { release = JSON.parse(releaseText); }
catch (error) { failures.push('release.json invalid: ' + String(error?.message || error)); }

if (release) {
  const expected = {
    app: 'French',
    appVersion: '5.24.0',
    phase: 'P35',
    channel: 'stable',
    learnerLogic: 'frozen-from-p33',
    qualification: 'p34-plus-p35-browser-acceptance'
  };
  for (const [key, value] of Object.entries(expected)) {
    if (release[key] !== value) failures.push('release.json ' + key + ' expected ' + JSON.stringify(value));
  }
}

requireToken(serviceWorker, "const CACHE_NAME = 'french-shell-v49';", 'stable P35 offline shell v49');
for (const file of [
  "'./index.html'",
  "'./manifest.webmanifest'",
  "'./release.json'",
  "'./vendor/thiepn-languages-consumer-contract.js'",
  "'./vendor/thiepn-languages-read-model.js'",
  "'./vendor/thiepn-languages-dashboard.js'"
]) requireToken(serviceWorker, file);

for (const project of [
  "'chromium-desktop'",
  "'firefox-desktop'",
  "'webkit-desktop'",
  "'android-chrome'",
  "'ios-webkit'"
]) requireToken(config, project, 'browser project ' + project);

for (const token of [
  "retries: 1",
  "trace: 'on-first-retry'",
  "timeout: live ? 120000 : 90000"
]) requireToken(config, token, 'browser harness token ' + token);

for (const token of [
  "p35-stable-release",
  "Vocabulary could not be loaded",
  "document.documentElement.scrollWidth - window.innerWidth",
  "navigator.serviceWorker.ready",
  "navigator.serviceWorker?.controller",
  "request.get('/manifest.webmanifest')",
  "Static HTTP metadata is engine-independent",
  "start.evaluate(button => button.click())",
  "setOffline(true)",
  "Search vocabulary",
  "button[data-view=\"\${view}\"][aria-current=\"page\"]:visible",
  "What you know, what is fragile, what to do next",
  "french-complete-backup-v5.24.0.json",
  "#v371-export-backup",
  "#v371-import-backup",
  "Could not import this backup",
  "french3000-settings-v2",
  "delete window.SpeechRecognition",
  "#thiepn-account-chip",
  "French P25 CEFR progression audit failed"
]) requireToken(spec, token, 'browser acceptance token ' + token);

for (const token of [
  'P35 stable release acceptance',
  '@playwright/test@1.63.0',
  'playwright install --with-deps chromium firefox webkit',
  'python3 -m http.server 4173',
  'node scripts/verify-production-p34.mjs',
  'P35_BASE_URL: https://french.thiepn.dev',
  'P35 Stable Release, Live Browser/Device Acceptance & Defect-Only Hardening'
]) requireToken(workflow, token, 'workflow token ' + token);

const mainMarker = "<script>\n  (() => {\n    'use strict';";
const start = html.indexOf(mainMarker);
const end = start >= 0 ? html.indexOf('</script>', start) : -1;
if (start < 0 || end < 0) {
  failures.push('main application script could not be isolated');
} else {
  const source = html.slice(start + '<script>'.length, end);
  try { new Function(source); }
  catch (error) { failures.push('main application JavaScript parse failure: ' + String(error?.message || error)); }
}

console.log(JSON.stringify({
  schema: 'thiepn-french-p35-stable-release-smoke',
  ok: failures.length === 0,
  failures,
  appVersion: '5.24.0',
  phase: 'P35',
  releaseChannel: 'stable',
  browserMatrix: ['chromium-desktop','firefox-desktop','webkit-desktop','android-chrome','ios-webkit'],
  physicalDeviceClaim: false
}, null, 2));

if (failures.length) process.exitCode = 1;
