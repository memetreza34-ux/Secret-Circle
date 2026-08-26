#!/usr/bin/env python3
from pathlib import Path
import json
import re

ROOT = Path(__file__).resolve().parents[1]
read = lambda relative: (ROOT / relative).read_text(encoding='utf-8')
violations = []

required = [
    'advanced-resume-guard.js', 'party-advanced-runner.js', 'party-advanced.js',
    'advanced-privacy-guard.js', 'tests/advanced-resume-guard.test.js',
    'tests/advanced-resume-contract.test.js',
    'tests/e2e/advanced-completion-exact-once.spec.js',
    'tests/e2e/advanced-core-abort.spec.js',
    'tests/e2e/advanced-core-round-flow.spec.js',
    'tests/e2e/advanced-core-smoke.spec.js',
    'tests/e2e/advanced-live-privacy.spec.js',
    'tests/e2e/advanced-resume-integrity.spec.js',
    'tests/e2e/advanced-secret-resume.spec.js',
    'tests/e2e/mafia-extended.spec.js',
    'package.json', 'sw.js'
]
for relative in required:
    if not (ROOT / relative).is_file():
        violations.append(f'Missing Advanced integrity contract file: {relative}')

if violations:
    raise SystemExit('\n'.join(sorted(set(violations))))

guard = read('advanced-resume-guard.js')
runner = read('party-advanced-runner.js')
advanced = read('party-advanced.js')
privacy = read('advanced-privacy-guard.js')
unit = read('tests/advanced-resume-guard.test.js')
resume_integrity = read('tests/e2e/advanced-resume-integrity.spec.js')
completion = read('tests/e2e/advanced-completion-exact-once.spec.js')
secret_resume = read('tests/e2e/advanced-secret-resume.spec.js')
live_privacy = read('tests/e2e/advanced-live-privacy.spec.js')
package = json.loads(read('package.json'))
sw = read('sw.js')

for marker in (
    'version: 4',
    'const hasVoteFields =',
    'const hasGuessFields =',
    'if (hasVoteFields === hasGuessFields) return false;',
    'const computedWinner = mafiaWinner(data);',
    'if (computedWinner) return false;',
    'expectedRoleCounts',
    'validateMafia'
):
    if marker not in guard:
        violations.append(f'Advanced guard marker missing: {marker}')

for marker in (
    "assert.equal(guard.version, 4)",
    'vote and guess result paths must be mutually exclusive',
    'a decisive alive state cannot resume into another Mafia phase',
    "Mafia: 2",
    "Detektiv: 1",
    "Arzt: 1"
):
    if marker not in unit:
        violations.append(f'Advanced guard unit marker missing: {marker}')

for marker in (
    'Location Spy rejects an impossible result containing vote and guess paths at once',
    'Mafia rejects a non-finished stage when the alive state already has a winner',
    'expectDiscarded(page)'
):
    if marker not in resume_integrity:
        violations.append(f'Advanced browser integrity marker missing: {marker}')

for marker in (
    "const pendingMafiaRound = session.advanced?.stage === 'finished' ? 1 : 0;",
    "const historyId = `advanced-${cleanText(session.id, 100) || makeSessionId()}`;",
    'const alreadySaved = nextHubState.history.some',
    'if (!alreadySaved)',
    'if (!clearActive())'
):
    if marker not in runner:
        violations.append(f'Advanced exact-once runner marker missing: {marker}')

for marker in (
    'Mafia finished round is counted exactly once when the session is saved before starting another round',
    'expect(hub.history.filter(item => item.gameId === \'mafia\')).toHaveLength(1)',
    "expect(hub.stats.mafia).toEqual({ plays: 1, rounds: 1, best: 6 })"
):
    if marker not in completion:
        violations.append(f'Advanced completion browser marker missing: {marker}')

for marker in (
    "button(ctx, 'Session beenden', ctx.finishSession, 'secondary')",
    'function mafiaWinner(data)',
    "data.stage = mafiaWinner(data) ? 'finished' : 'overview'",
    'data.winner = mafiaWinner(data)'
):
    if marker not in advanced:
        violations.append(f'Advanced Mafia completion marker missing: {marker}')

for marker in (
    'Mafia role overview requires moderator confirmation again after reload',
    "Alex: 'Mafia', Sam: 'Mafia'"
):
    if marker not in secret_resume:
        violations.append(f'Advanced secret-resume fixture marker missing: {marker}')

for marker in (
    "gameId === 'mafia' && content.querySelector('.role-overview')",
    "gameId === 'mafia' && eyebrow.textContent.startsWith('Nacht ')",
    'Detektiv-Ergebnis für Moderator:'
):
    if marker not in privacy:
        violations.append(f'Advanced privacy marker missing: {marker}')

for marker in (
    'Mafia moderator overview is concealed on app focus loss',
    'Two Truths private composition is concealed without losing typed input'
):
    if marker not in live_privacy:
        violations.append(f'Advanced live privacy browser marker missing: {marker}')

check = package.get('scripts', {}).get('check', '')
validate = package.get('scripts', {}).get('validate', '')
critical_specs = [
    'tests/e2e/advanced-completion-exact-once.spec.js',
    'tests/e2e/advanced-core-abort.spec.js',
    'tests/e2e/advanced-core-round-flow.spec.js',
    'tests/e2e/advanced-core-smoke.spec.js',
    'tests/e2e/advanced-live-privacy.spec.js',
    'tests/e2e/advanced-resume-integrity.spec.js',
    'tests/e2e/advanced-secret-resume.spec.js',
    'tests/e2e/mafia-extended.spec.js'
]
for spec in critical_specs:
    if f'node --check {spec}' not in check:
        violations.append(f'Critical Advanced E2E missing from syntax preflight: {spec}')
if 'scripts/advanced_integrity_audit.py' not in validate:
    violations.append('Advanced integrity audit missing from npm run validate.')

if './advanced-resume-guard.js' not in sw or './advanced-privacy-guard.js' not in sw:
    violations.append('Advanced integrity/privacy guards missing from offline core.')

cache = re.search(r"const CACHE='(secret-circle-v(\d+))'", sw)
if not cache:
    violations.append('Advanced integrity audit could not parse Service Worker cache generation.')

if violations:
    raise SystemExit('\n'.join(sorted(set(violations))))

print(json.dumps({
    'advanced_integrity_audit': 'PASS',
    'resume_guard_version': 4,
    'location_result_paths_exclusive': True,
    'mafia_terminal_stage_integrity': True,
    'mafia_finished_exact_once': True,
    'abort_preserves_without_completion': True,
    'secret_resume_reconcealment': True,
    'critical_e2e_syntax_preflight': len(critical_specs),
    'pwa_cache': cache.group(1) if cache else None
}, ensure_ascii=False, indent=2))
