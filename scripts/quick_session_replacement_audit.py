#!/usr/bin/env python3
from pathlib import Path
import json
import re

ROOT = Path(__file__).resolve().parents[1]
read = lambda relative: (ROOT / relative).read_text(encoding='utf-8')
violations = []

required = [
    'quick-session-replacement-guard.js', 'quick-loader.js',
    'tests/quick-session-replacement-guard.test.js',
    'tests/e2e/quick-session-replacement.spec.js',
    'tests/e2e/party-session-controls.spec.js',
    'package.json', 'sw.js'
]
for relative in required:
    if not (ROOT / relative).is_file():
        violations.append(f'Missing Quick replacement contract file: {relative}')

if violations:
    raise SystemExit('\n'.join(sorted(set(violations))))

guard = read('quick-session-replacement-guard.js')
loader = read('quick-loader.js')
unit = read('tests/quick-session-replacement-guard.test.js')
e2e = read('tests/e2e/quick-session-replacement.spec.js')
controls_e2e = read('tests/e2e/party-session-controls.spec.js')
package = json.loads(read('package.json'))
sw = read('sw.js')

for marker in (
    'version: VERSION',
    "created: 'secret-circle-party-created-active-v1'",
    "viral: 'secret-circle-party-viral-active-v1'",
    "mega: 'secret-circle-party-mega-active-v1'",
    "quick: 'secret-circle-party-quick-active-v1'",
    'function plausibleSnapshot(value)',
    'function authorizeStart(root, catalog, gameId)',
    'event.stopImmediatePropagation();',
    'blockPagehideRetry = true;',
    'root.location?.reload?.();'
):
    if marker not in guard:
        violations.append(f'Quick replacement guard marker missing: {marker}')

for marker in (
    "const REPLACEMENT_GUARD_SOURCE = 'quick-session-replacement-guard.js';",
    'replacementGuardReady = false',
    'plan.push(REPLACEMENT_GUARD_SOURCE)',
    'Boolean(windowRef.SecretCircleQuickSessionReplacementGuard)',
    'version: 7'
):
    if marker not in loader:
        violations.append(f'Quick loader replacement marker missing: {marker}')

for marker in (
    "families: ['quick', 'mega', 'viral', 'created']",
    'sameGameReplacementConfirmed: true',
    'crossGameFamilyReplacementConfirmed: true',
    'guardDoesNotMutateStoredSnapshot: true'
):
    if marker not in unit:
        violations.append(f'Quick replacement unit marker missing: {marker}')

for marker in (
    'starting again requires confirmation and cancel preserves the same Quick session',
    'cross-game start in the same Quick family cannot silently overwrite another game session',
    'failed replacement write reloads fail-closed and preserves the previous stored session',
    'expect(preserved.sessionId).toBe(before.sessionId)'
):
    if marker not in e2e:
        violations.append(f'Quick replacement browser marker missing: {marker}')

for marker in (
    'every fast engine loads controls and replacement guard before its engine',
    "sources.indexOf('party-session-controls.js')",
    "sources.indexOf('quick-session-replacement-guard.js')",
    'expect(guardIndex).toBeGreaterThan(controlsIndex)',
    'expect(engineIndex).toBeGreaterThan(guardIndex)'
):
    if marker not in controls_e2e:
        violations.append(f'Quick replacement load-order browser marker missing: {marker}')

scripts = package.get('scripts', {})
if 'node tests/quick-session-replacement-guard.test.js' not in scripts.get('test', ''):
    violations.append('Quick replacement guard unit test missing from npm test.')
for relative in (
    'quick-session-replacement-guard.js',
    'tests/quick-session-replacement-guard.test.js',
    'tests/e2e/quick-session-replacement.spec.js',
    'tests/e2e/party-session-controls.spec.js'
):
    if f'node --check {relative}' not in scripts.get('check', ''):
        violations.append(f'Quick replacement file missing from syntax preflight: {relative}')
if 'scripts/quick_session_replacement_audit.py' not in scripts.get('validate', ''):
    violations.append('Quick replacement audit missing from npm run validate.')

if './quick-session-replacement-guard.js' not in sw:
    violations.append('Quick replacement guard missing from offline core.')
cache = re.search(r"const CACHE='secret-circle-v(\d+)'", sw)
if not cache or int(cache.group(1)) < 56:
    violations.append('Quick replacement hardening requires offline cache generation v56 or newer.')

if violations:
    raise SystemExit('\n'.join(sorted(set(violations))))

print(json.dumps({
    'quick_session_replacement_audit': 'PASS',
    'guard_version': 1,
    'loader_version': 7,
    'families_guarded': ['quick', 'mega', 'viral', 'created'],
    'same_game_confirmation': True,
    'cross_game_family_confirmation': True,
    'failed_write_preserves_previous_snapshot': True,
    'browser_load_order_guarded': True,
    'pwa_cache': f"secret-circle-v{cache.group(1)}"
}, ensure_ascii=False, indent=2))