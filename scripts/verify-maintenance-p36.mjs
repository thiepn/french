import { readFile } from 'node:fs/promises';

const files = await Promise.all([
  readFile(new URL('../release.json', import.meta.url), 'utf8'),
  readFile(new URL('../docs/P35_STABLE_RELEASE.md', import.meta.url), 'utf8'),
  readFile(new URL('../docs/P36_POST_RELEASE_MAINTENANCE.md', import.meta.url), 'utf8'),
  readFile(new URL('../scripts/observe-production-p36.mjs', import.meta.url), 'utf8'),
  readFile(new URL('../.github/workflows/p36-post-release-observation.yml', import.meta.url), 'utf8'),
  readFile(new URL('../.github/ISSUE_TEMPLATE/french-defect.yml', import.meta.url), 'utf8'),
  readFile(new URL('../.github/ISSUE_TEMPLATE/french-friction.yml', import.meta.url), 'utf8')
]);

const [releaseText, p35, p36, observer, workflow, defectTemplate, frictionTemplate] = files;
const failures = [];
const requireToken = (source, token, label = token) => {
  if (!source.includes(token)) failures.push('missing ' + label);
};

let release;
try {
  release = JSON.parse(releaseText);
} catch (error) {
  failures.push('release.json invalid: ' + String(error?.message || error));
}

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
    if (release[key] !== value) {
      failures.push('stable release drift: ' + key + ' expected ' + JSON.stringify(value));
    }
  }
}

for (const token of [
  'P36 — Post-Release Observation, Real-Use Defect Intake & Maintenance Baseline',
  'P36 role: maintenance process, not a product-version bump',
  'There is no automatic P37.',
  'P0 — data/safety integrity',
  'P1 — core study blocked',
  'P2 — major degradation',
  'P3 — minor defect/friction',
  '136.4 seconds',
  '150-second CI ceiling'
]) requireToken(p36, token);

requireToken(p35, '**P36 — Post-Release Observation, Real-Use Defect Intake & Maintenance Baseline**');

for (const token of [
  'https://french.thiepn.dev',
  "appVersion: '5.24.0'",
  "phase: 'P35'",
  "channel: 'stable'",
  'french-shell-v49',
  'P35 Stable Release, Live Browser/Device Acceptance & Defect-Only Hardening'
]) requireToken(observer, token, 'observer token ' + token);

for (const token of [
  'P36 post-release observation',
  'node scripts/verify-maintenance-p36.mjs',
  'node scripts/observe-production-p36.mjs',
  'cron: "17 5 * * *"',
  'workflow_dispatch:'
]) requireToken(workflow, token, 'workflow token ' + token);

for (const token of [
  'name: French defect',
  'severity',
  'reproduction',
  'expected',
  'actual'
]) requireToken(defectTemplate, token, 'defect intake token ' + token);

for (const token of [
  'name: French study friction',
  'study-goal',
  'friction',
  'frequency',
  'workaround'
]) requireToken(frictionTemplate, token, 'friction intake token ' + token);

console.log(JSON.stringify({
  schema: 'thiepn-french-p36-maintenance-baseline',
  ok: failures.length === 0,
  failures,
  frozenRelease: {
    appVersion: '5.24.0',
    phase: 'P35',
    channel: 'stable'
  },
  p36AddsProductFeatures: false,
  nextAutomaticPhase: null
}, null, 2));

if (failures.length) process.exitCode = 1;
