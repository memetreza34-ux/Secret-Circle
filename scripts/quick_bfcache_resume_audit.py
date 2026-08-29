#!/usr/bin/env python3
from pathlib import Path
import json
import re

ROOT = Path(__file__).resolve().parents[1]
read = lambda p: (ROOT / p).read_text(encoding='utf-8')
violations = []
required = ['party-session-controls.js','tests/party-session-controls.test.js','tests/e2e/quick-timer-resume.spec.js','package.json','sw.js','tests/service-worker.test.js']
for relative in required:
    if not (ROOT / relative).is_file(): violations.append(f'Missing BF58 contract file: {relative}')
if violations: raise SystemExit('\n'.join(violations))

controls = read('party-session-controls.js'); unit = read('tests/party-session-controls.test.js')
e2e = read('tests/e2e/quick-timer-resume.spec.js'); package = json.loads(read('package.json'))
sw = read('sw.js'); sw_test = read('tests/service-worker.test.js')

for marker in (
    'const VERSION = 5;', 'function handlePageShow(event)',
    'if (!event?.persisted || !timerFamily) return false;',
    'timerContextMatches(snapshot, context, snapshot.durationMs)',
    'setFamilyTimerSnapshot(storage, timerFamily, null);', 'reloadFn();',
    "windowRef?.addEventListener?.('pageshow', handlePageShow);"
):
    if marker not in controls: violations.append(f'BF58 controller marker missing: {marker}')
for marker in (
    'bfcacheTimerReloadGuard: true','staleBfcacheSnapshotNoReload: true',
    'BFCache reload must leave the matching snapshot for the normal resume path',
    'stale BFCache snapshot is discarded without reload','Controls.version, 5'
):
    if marker not in unit: violations.append(f'BF58 unit marker missing: {marker}')
for marker in (
    'BF58 matching pageshow persisted reloads into the normal timer resume path',
    'BF58 stale pageshow persisted clears timer snapshot without reloading',
    "new PageTransitionEvent('pagehide', { persisted: true })",
    "new PageTransitionEvent('pageshow', { persisted: true })",
    "sessionStorage.getItem('bf58-load-count')",
    'expect(afterResume).toBeLessThan(fullSeconds)'
):
    if marker not in e2e: violations.append(f'BF58 browser marker missing: {marker}')

scripts = package.get('scripts', {})
if 'node tests/party-session-controls.test.js' not in scripts.get('test',''): violations.append('BF58 unit missing from npm test.')
if 'node --check tests/e2e/quick-timer-resume.spec.js' not in scripts.get('check',''): violations.append('BF58 browser spec missing from syntax preflight.')
if 'scripts/quick_bfcache_resume_audit.py' not in scripts.get('validate',''): violations.append('BF58 audit missing from npm validate.')
if scripts.get('test:e2e') != 'playwright test': violations.append('BF58 browser contract missing from full Playwright gate.')
cache = re.search(r"const CACHE='secret-circle-v(\d+)'", sw)
if not cache or int(cache.group(1)) < 58: violations.append('BF58 requires cache v58 or newer.')
if cache and f"secret-circle-v{cache.group(1)}" not in sw_test: violations.append('BF58 SW test cache drift.')

if violations: raise SystemExit('\n'.join(sorted(set(violations))))
print(json.dumps({
  'quick_bfcache_resume_audit':'PASS','session_controls_version':5,
  'matching_bfcache_snapshot_reload':True,'stale_bfcache_snapshot_no_reload':True,
  'snapshot_preserved_for_normal_resume':True,'browser_lifecycle_contract':True,
  'pwa_cache':f"secret-circle-v{cache.group(1)}"
}, ensure_ascii=False, indent=2))
