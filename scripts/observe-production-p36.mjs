const base = String(process.env.P36_BASE_URL || 'https://french.thiepn.dev').replace(/\/$/, '');
const failures = [];

async function get(path, type = 'text') {
  const response = await fetch(base + path, {
    cache: 'no-store',
    headers: { 'user-agent': 'thiepn-french-p36-observer/1' },
    signal: AbortSignal.timeout(20000)
  });
  if (!response.ok) throw new Error(path + ' returned HTTP ' + response.status);
  return type === 'json' ? response.json() : response.text();
}

let release;
try {
  release = await get('/release.json?probe=p36', 'json');
} catch (error) {
  failures.push('release probe failed: ' + String(error?.message || error));
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
      failures.push('production release drift: ' + key + ' expected ' + JSON.stringify(value) + ', received ' + JSON.stringify(release[key]));
    }
  }
}

try {
  const html = await get('/?probe=p36');
  for (const token of [
    'French — Adaptive language learning',
    'P35 Stable Release, Live Browser/Device Acceptance & Defect-Only Hardening'
  ]) {
    if (!html.includes(token)) failures.push('production HTML missing ' + token);
  }
} catch (error) {
  failures.push('HTML probe failed: ' + String(error?.message || error));
}

try {
  const manifest = JSON.parse(await get('/manifest.webmanifest?probe=p36'));
  if (manifest.name !== 'French') failures.push('manifest name drifted');
  if (manifest.short_name !== 'French') failures.push('manifest short_name drifted');
  if (manifest.start_url !== '/' || manifest.scope !== '/') failures.push('manifest launch scope drifted');
  if (manifest.display !== 'standalone') failures.push('manifest display drifted');
} catch (error) {
  failures.push('manifest probe failed: ' + String(error?.message || error));
}

try {
  const sw = await get('/service-worker.js?probe=p36');
  if (!sw.includes("const CACHE_NAME = 'french-shell-v49';")) failures.push('service-worker stable shell drifted');
} catch (error) {
  failures.push('service-worker probe failed: ' + String(error?.message || error));
}

console.log(JSON.stringify({
  schema: 'thiepn-french-p36-production-observation',
  ok: failures.length === 0,
  origin: base,
  expected: { appVersion: '5.24.0', phase: 'P35', channel: 'stable' },
  failures,
  observedAt: new Date().toISOString()
}, null, 2));

if (failures.length) process.exitCode = 1;
