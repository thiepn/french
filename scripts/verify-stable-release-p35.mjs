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

requireToken(serviceWorker, "const CACHE_NAME = 'french-shell-v48';", 'unchanged P33 offline shell v48');
for (const file of [
  "'./index.html'",
  "'./manifest.webmanifest'",
  "'./vendor/thiepn-languages-consumer-contract.js'",
  "'./vendor/thiepn-languages-read-model.js'"
]) requireToken(serviceWorker, file);

for (const project of [
  "'chromium-desktop'",
  "'firefox-desktop'",
  "'webkit-desktop'",
  "'android-chrome'",
  "'ios-webkit'"
]) requireToken(config, project, 'browser project ' + project);

for (const token of [
  "p35-stable-release",
  "Vocabulary could not be loaded",
  "document.documentElement.scrollWidth - window.innerWidth",
  "navigator.serviceWorker.ready",
  "setOffline(true)",
  "french-progress.json",
  "Could not import this backup",
  "french3000-settings-v2",
  "delete window.SpeechRecognition",
  "#thiepn-account-chip"
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
