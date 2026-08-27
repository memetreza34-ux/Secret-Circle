#!/usr/bin/env python3
from pathlib import Path
import json
import re

ROOT = Path(__file__).resolve().parents[1]
read = lambda relative: (ROOT / relative).read_text(encoding='utf-8')
violations = []

required = [
    'party-session-controls.js',
    'backup-schema-registry.js',
    'tests/party-session-controls.test.js',
    'tests/backup-schema-registry.test.js',
    'tests/e2e/quick-timer-resume.spec.js',
    'package.json',
    'sw.js',
    'tests/service-worker.test.js',
]
for relative in required:
    if not (ROOT / relative).is_file():
        violations.append(f'Missing QT57 contract file: {relative}')
if violations:
    raise SystemExit('\n'.join(sorted(set(violations))))

controls = read('party-session-controls.js')
registry = read('backup-schema-registry.js')
unit = read('tests/party-session-controls.test.js')
registry_unit = read('tests/backup-schema-registry.test.js')
e2e = read('tests/e2e/quick-timer-resume.spec.js')
package = json.loads(read('package.json'))
sw = read('sw.js')
sw_test = read('tests/service-worker.test.js')

for marker in (
    'const VERSION = 4;',
    "const TIMER_STORE_KEY = 'secret-circle-party-quick-timers-v1';",
    "Object.freeze(['quick', 'mega', 'viral', 'created'])",
    'function normalizeTimerSnapshot(value)',
    'function familyForGame(catalog, gameId)',
    'function activeContext(storage, family, expectedGameId)',
    'function timerContextMatches(snapshot, context, durationMs)',
    'function consumePersistedRemaining(durationMs)',
    'function persistRunningTimerSnapshot()',
    "windowRef?.addEventListener?.('pagehide', persistRunningTimerSnapshot, { capture: true });",
    'preservePersistedOnNextStop = true;',
    'remainingMs: Math.max(1, Math.min(timerDurationMs, Math.ceil(remainingMs)))',
):
    if marker not in controls:
        violations.append(f'QT57 controller marker missing: {marker}')

persist_block = re.search(r'function persistRunningTimerSnapshot\(\) \{([\s\S]*?)\n    \}', controls)
if not persist_block:
    violations.append('QT57 persistRunningTimerSnapshot function could not be parsed.')
else:
    for forbidden in ('prompt', 'answer', 'mission', 'identity', 'clue', 'card'):
        if forbidden in persist_block.group(1).lower():
            violations.append(f'QT57 timer snapshot must remain prompt-free: {forbidden}')

for marker in (
    "'secret-circle-party-quick-timers-v1'",
    "case 'secret-circle-party-quick-timers-v1':",
    "new Set(['quick', 'mega', 'viral', 'created'])",
    'validQuickTimerSnapshot(snapshot)',
):
    if marker not in registry:
        violations.append(f'QT57 backup registry marker missing: {marker}')

for marker in (
    'Controls.version, 4',
    "Controls.timerStoreKey, 'secret-circle-party-quick-timers-v1'",
    'quickFamilyTimerResume: true',
    'timerSnapshotPromptFree: true',
    'staleTimerSnapshotRejected: true',
    "engine pagehide stop must preserve the captured snapshot",
):
    if marker not in unit:
        violations.append(f'QT57 unit marker missing: {marker}')

for marker in (
    'running Quick timer resumes with remaining time instead of restarting full duration',
    'timer snapshot from another session is discarded and cannot shorten a new timer',
    "expect(stored.snapshots.quick.gameId).toBe('rapid-fire')",
    'expect(afterResume).toBeLessThan(fullSeconds)',
    "expect(await page.evaluate(timerKey => localStorage.getItem(timerKey), TIMER_KEY)).toBeNull()",
):
    if marker not in e2e:
        violations.append(f'QT57 browser marker missing: {marker}')

for marker in (
    'quickTimerStoreValidated: true',
    "'secret-circle-party-quick-timers-v1'",
):
    if marker not in registry_unit:
        violations.append(f'QT57 registry-unit marker missing: {marker}')

scripts = package.get('scripts', {})
if 'node tests/party-session-controls.test.js' not in scripts.get('test', ''):
    violations.append('QT57 shared controls unit test missing from npm test.')
for relative in ('party-session-controls.js', 'tests/party-session-controls.test.js', 'tests/e2e/quick-timer-resume.spec.js'):
    if f'node --check {relative}' not in scripts.get('check', ''):
        violations.append(f'QT57 syntax preflight missing: {relative}')
if 'scripts/quick_timer_resume_audit.py' not in scripts.get('validate', ''):
    violations.append('QT57 audit missing from npm run validate.')

if './party-session-controls.js' not in sw:
    violations.append('QT57 shared session controls missing from offline core.')
cache = re.search(r"const CACHE='secret-circle-v(\d+)'", sw)
if not cache or int(cache.group(1)) < 57:
    violations.append('QT57 requires offline cache generation v57 or newer.')
if cache and cache.group(0).split("'")[1] not in sw_test:
    violations.append('QT57 current cache is not synchronized in service-worker test.')

if violations:
    raise SystemExit('\n'.join(sorted(set(violations))))

print(json.dumps({
    'quick_timer_resume_audit': 'PASS',
    'session_controls_version': 4,
    'timer_store_version': 1,
    'families': ['quick', 'mega', 'viral', 'created'],
    'prompt_free_timer_snapshot': True,
    'same_game_session_round_phase_required': True,
    'stale_timer_snapshots_rejected': True,
    'backup_managed_timer_store': True,
    'pwa_cache': f"secret-circle-v{cache.group(1)}",
}, ensure_ascii=False, indent=2))
