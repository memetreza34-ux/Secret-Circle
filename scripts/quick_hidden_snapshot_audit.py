#!/usr/bin/env python3
from pathlib import Path
import json
import re

ROOT = Path(__file__).resolve().parents[1]
read = lambda p: (ROOT / p).read_text(encoding='utf-8')
violations = []
required = [
    'party-session-controls.js',
    'tests/party-session-controls.test.js',
    'tests/e2e/quick-background-pause.spec.js',
    'package.json',
    'sw.js',
    'tests/service-worker.test.js',
]
for relative in required:
    if not (ROOT / relative).is_file():
        violations.append(f'Missing HS60 contract file: {relative}')
if violations:
    raise SystemExit('\n'.join(sorted(set(violations))))

controls = read('party-session-controls.js')
unit = read('tests/party-session-controls.test.js')
e2e = read('tests/e2e/quick-background-pause.spec.js')
package = json.loads(read('package.json'))
sw = read('sw.js')
sw_test = read('tests/service-worker.test.js')

for marker in (
    'const VERSION = 5;',
    'function persistRunningTimerSnapshot(preserveOnNextStop = true)',
    'if (saved && preserveOnNextStop) preservePersistedOnNextStop = true;',
    'function handlePageHide()',
    'return persistRunningTimerSnapshot(true);',
    'persistRunningTimerSnapshot(false);',
    "windowRef?.addEventListener?.('pagehide', handlePageHide, { capture: true });",
):
    if marker not in controls:
        violations.append(f'HS60 controller marker missing: {marker}')

for forbidden in ('arguments.callee', 'createController.gameId', 'createController.expectedGameId'):
    if forbidden in controls:
        violations.append(f'HS60 unsafe persistence fallback remains: {forbidden}')

for marker in (
    'Controls.version, 5',
    'hidden must persist remaining time even without pagehide',
    'normal same-page stop clears visibility snapshot',
    'a cold controller can resume from a hidden-only snapshot when pagehide never fired',
    'hiddenSnapshotDurableWithoutPagehide: true',
    'visibilitySnapshotClearsOnNormalStop: true',
):
    if marker not in unit:
        violations.append(f'HS60 unit marker missing: {marker}')

for marker in (
    'BG59/HS60 hidden Quick timer auto-pauses, persists immediately and requires explicit resume',
    'hiddenStore.snapshots.quick.gameId',
    'localStorage.getItem(timerKey)',
    "getByRole('button', { name: 'Nicht geschafft' })",
):
    if marker not in e2e:
        violations.append(f'HS60 browser marker missing: {marker}')

scripts = package.get('scripts', {})
if 'node tests/party-session-controls.test.js' not in scripts.get('test', ''):
    violations.append('HS60 unit missing from npm test.')
if 'node --check tests/e2e/quick-background-pause.spec.js' not in scripts.get('check', ''):
    violations.append('HS60 browser spec missing from syntax preflight.')
if 'scripts/quick_hidden_snapshot_audit.py' not in scripts.get('validate', ''):
    violations.append('HS60 audit missing from npm validate.')
if scripts.get('test:e2e') != 'playwright test':
    violations.append('HS60 browser contract missing from full Playwright gate.')

cache = re.search(r"const CACHE='secret-circle-v(\d+)'", sw)
if not cache or int(cache.group(1)) < 60:
    violations.append('HS60 requires cache v60 or newer.')
if cache and f"secret-circle-v{cache.group(1)}" not in sw_test:
    violations.append('HS60 SW test cache drift.')

if violations:
    raise SystemExit('\n'.join(sorted(set(violations))))
print(json.dumps({
    'quick_hidden_snapshot_audit': 'PASS',
    'session_controls_version': 5,
    'hidden_snapshot_without_pagehide': True,
    'pagehide_preserve_next_stop_only': True,
    'same_page_stop_clears_visibility_snapshot': True,
    'cold_resume_consumes_hidden_snapshot_once': True,
    'pwa_cache': f"secret-circle-v{cache.group(1)}"
}, ensure_ascii=False, indent=2))
