#!/usr/bin/env python3
from pathlib import Path
import json
import re

ROOT = Path(__file__).resolve().parents[1]
read = lambda relative: (ROOT / relative).read_text(encoding='utf-8')
violations = []

required = [
    'party-hub-round-state.js', 'party-hub-timers.js',
    'tests/hub-resume-contract.test.js', 'tests/hub-timer-contract.test.js',
    'tests/e2e/core-hub-prestart-resume.spec.js', 'sw.js', 'package.json',
    'ARCHITECTURE.md', 'DEPLOYMENT.md', 'ENVIRONMENTS.md', 'privacy.html',
    'HOSTING_DECISION.md'
]
for relative in required:
    if not (ROOT / relative).is_file():
        violations.append(f'Missing PT54 contract file: {relative}')

if violations:
    raise SystemExit('\n'.join(sorted(set(violations))))

round_state = read('party-hub-round-state.js')
timers = read('party-hub-timers.js')
e2e = read('tests/e2e/core-hub-prestart-resume.spec.js')
package = json.loads(read('package.json'))
sw = read('sw.js')

for marker in (
    'const VERSION = 3;', "'hot-potato'", "'word-chain'",
    'SAFE_CURRENT_MODES', 'ensureCurrent', 'clearCurrent'
):
    if marker not in round_state:
        violations.append(f'Round-state PT54 marker missing: {marker}')

for marker in (
    'const R = window.SecretCirclePartyHubRoundState;',
    "R.ensureCurrent(current, 'hot-potato'",
    "R.ensureCurrent(current, 'word-chain'",
    'function startHotPotato', 'function startWordChain',
    'R.clearCurrent(current)', 'prompt: cleanText(prompt, 400)',
    'letter: cleanText(letter, 12)'
):
    if marker not in timers:
        violations.append(f'Timer PT54 marker missing: {marker}')

hot_start = re.search(r'function startHotPotato[\s\S]*?function renderWordChainStart', timers)
word_start = re.search(r'function startWordChain[\s\S]*?function renderStoredTimerSession', timers)
if not hot_start or hot_start.group(0).find('R.clearCurrent(current)') > hot_start.group(0).find("current.timer = {"):
    violations.append('Hot Potato must clear pre-start current before creating the timer snapshot.')
if not word_start or word_start.group(0).find('R.clearCurrent(current)') > word_start.group(0).find("current.timer = {"):
    violations.append('Word Chain must clear pre-start current before creating the timer snapshot.')

for marker in (
    "kind: 'hot-potato'", "kind: 'word-chain'",
    'expect(running.session.current).toBeNull()',
    'expect(running.session.timer.prompt).toBe(prompt)',
    'expect(running.session.timer.letter).toBe(letter)',
    'await page.reload()', "name: 'Session fortsetzen'"
):
    if marker not in e2e:
        violations.append(f'PT54 browser contract marker missing: {marker}')

check = package.get('scripts', {}).get('check', '')
if 'node --check tests/e2e/core-hub-prestart-resume.spec.js' not in check:
    violations.append('PT54 browser spec missing from syntax preflight.')

cache = re.search(r"const CACHE='(secret-circle-v(\d+))'", sw)
staging = re.search(r"const STAGING_CACHE='(secret-circle-v(\d+)-staging)'", sw)
if not cache or not staging or cache.group(2) != staging.group(2):
    violations.append('PT54 could not resolve a matching active/staging cache generation.')
else:
    cache_name = cache.group(1)
    if int(cache.group(2)) < 54:
        violations.append('PT54 requires offline cache generation 54 or newer.')
    for relative in ('ARCHITECTURE.md', 'DEPLOYMENT.md', 'ENVIRONMENTS.md', 'privacy.html', 'HOSTING_DECISION.md'):
        source = read(relative)
        if cache_name not in source:
            violations.append(f'Current cache {cache_name} missing from {relative}.')

if 'PT54' not in read('DEPLOYMENT.md') or 'PT54' not in read('ENVIRONMENTS.md') or 'PT54' not in read('HOSTING_DECISION.md'):
    violations.append('PT54 real-evidence gate is not synchronized across deployment/environment/hosting contracts.')

# Secret/private timer cards must not be added to the safe pre-start current set.
safe_match = re.search(r"SAFE_CURRENT_MODES = new Set\(\[([^\]]+)\]\)", round_state)
if safe_match:
    safe_values = safe_match.group(1)
    for forbidden in ("'charades'", "'taboo'"):
        if forbidden in safe_values:
            violations.append(f'Private timer mode must not be safe pre-start current: {forbidden}')
else:
    violations.append('SAFE_CURRENT_MODES could not be parsed.')

if violations:
    raise SystemExit('\n'.join(sorted(set(violations))))

print(json.dumps({
    'hub_prestart_resume_audit': 'PASS',
    'round_state_version': 3,
    'safe_prestart_modes': ['hot-potato', 'word-chain'],
    'private_prestart_modes_excluded': ['charades', 'taboo'],
    'current_to_timer_snapshot_handoff': True,
    'browser_contract': 'tests/e2e/core-hub-prestart-resume.spec.js',
    'pwa_cache': cache.group(1) if cache else None,
    'real_evidence_gate': 'PT54'
}, ensure_ascii=False, indent=2))
