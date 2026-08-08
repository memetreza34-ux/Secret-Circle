#!/usr/bin/env python3
from pathlib import Path
import json

ROOT = Path(__file__).resolve().parents[1]


def read(relative: str) -> str:
    path = ROOT / relative
    if not path.is_file():
        raise SystemExit(f'Hub control audit missing file: {relative}')
    return path.read_text(encoding='utf-8')


hub = read('party-hub.js')
html = read('party.html')
css = read('party.css')
package = json.loads(read('package.json'))
static_test = read('tests/hub-control-contract.test.js')
controls_e2e = read('tests/e2e/core-hub-controls.spec.js')
taboo_e2e = read('tests/e2e/taboo-timer.spec.js')

checks = {
    'control_surface': all(marker in html for marker in (
        'id="finish-hub-game"', 'id="skip-hub-round"',
        'id="pause-hub-game"', 'id="abort-hub-game"',
        'role="group" aria-label="Spielsteuerung"',
        '<h1 id="play-title" tabindex="-1"></h1>',
    )) and 'id="exit-game"' not in html,
    'distinct_finish_abort': all(marker in hub for marker in (
        'function finishSession()', 'function abortSession()',
        'Bisheriger Fortschritt wird verworfen und nicht als abgeschlossen gezählt.',
        "$('#finish-hub-game').addEventListener('click', finishSession)",
        "$('#abort-hub-game').addEventListener('click', abortSession)",
    )),
    'abort_never_records': 'function abortSession()' in hub
        and "setStatus('Session abgebrochen. Fortschritt wurde nicht gespeichert.')" in hub
        and "else if (event.key === 'Escape' && !$('#play-layer').hidden) abortSession();" in hub,
    'global_skip_no_point': all(marker in hub for marker in (
        'function skipHubRound()', 'session.rounds += 1;', 'advancePlayer();',
        'Runde übersprungen. Dafür wurde kein Punkt vergeben.',
        "$('#skip-hub-round').addEventListener('click', skipHubRound)",
    )),
    'timed_round_finish_count': all(marker in hub for marker in (
        'const activeTimedRound = Boolean(session.timer',
        'const completedRounds = session.rounds + (activeTimedRound ? 1 : 0);',
        'rounds: completedRounds',
    )),
    'focus_management': all(marker in hub for marker in (
        'function focusPlayPrimary()', "primary || $('#play-title')", 'requestAnimationFrame',
    )),
    'taboo_shared_timer': all(marker in hub for marker in (
        "TIMER_KINDS = new Set(['charades', 'taboo', 'hot-potato', 'word-chain'])",
        'function renderTabooStart()', 'function startTaboo(remainingMs = 60_000',
        'finishTabooTimer', 'hubTimer.countdown(remainingMs / 1000, timer, finishTabooTimer)',
        "timerState.kind === 'taboo') startTaboo", 'word: cleanText(value.word, 120)',
        'banned: Array.isArray(value.banned)',
    )),
    'responsive_touch_controls': all(marker in css for marker in (
        '.hub-session-controls', '.hub-abort-button', 'min-height:44px',
        '.hub-session-controls{grid-template-columns:1fr}',
    )),
    'static_contract': all(marker in static_test for marker in (
        'distinctFinishAndAbort', 'roundSkipWithoutPoint', 'focusManagement', 'timedTaboo',
    )),
    'browser_contracts': all(marker in controls_e2e for marker in (
        'global skip advances a round without awarding a point',
        'abort discards active progress', 'Escape uses the same confirmed discard path',
    )) and all(marker in taboo_e2e for marker in (
        'Taboo uses a pausable 60-second scoring round',
        'Taboo reload restores the same private card and remaining time paused',
    )),
    'unit_gate': 'tests/hub-control-contract.test.js' in package.get('scripts', {}).get('test', ''),
    'syntax_gate': 'tests/hub-control-contract.test.js' in package.get('scripts', {}).get('check', ''),
}

# Stronger semantic check: the abort function body itself may never call recordCompletion.
abort_start = hub.find('function abortSession()')
abort_end = hub.find('\n  function pickUnused', abort_start)
if abort_start < 0 or abort_end < 0 or 'recordCompletion' in hub[abort_start:abort_end]:
    checks['abort_never_records'] = False

failed = [name for name, passed in checks.items() if not passed]
if failed:
    raise SystemExit(f'Hub control audit failed: {", ".join(failed)}')

print(json.dumps({
    'hub_control_audit': 'PASS',
    'distinct_finish_and_abort': True,
    'global_skip_without_point': True,
    'focus_management': True,
    'timed_taboo_seconds': 60,
    'resumable_hub_timers': ['charades', 'taboo', 'hot-potato', 'word-chain'],
    'mobile_touch_targets': True,
    'checks': checks,
}, ensure_ascii=False, indent=2))
