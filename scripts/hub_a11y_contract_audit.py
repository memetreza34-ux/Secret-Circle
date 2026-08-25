#!/usr/bin/env python3
from pathlib import Path
import json

ROOT = Path(__file__).resolve().parents[1]
read = lambda relative: (ROOT / relative).read_text(encoding='utf-8')

required = [
    'party.html',
    'party-hub-polish.js',
    'party-hub-a11y.js',
    'sw.js',
    'package.json',
    'tests/accessibility-contract.test.js',
    'tests/e2e/accessibility-core.spec.js',
]
missing = [relative for relative in required if not (ROOT / relative).is_file()]
if missing:
    raise SystemExit('Hub accessibility contract missing files: ' + ', '.join(missing))

party = read('party.html')
polish = read('party-hub-polish.js')
a11y = read('party-hub-a11y.js')
sw = read('sw.js')
package = json.loads(read('package.json'))
unit = read('tests/accessibility-contract.test.js')
e2e = read('tests/e2e/accessibility-core.spec.js')
syntax_gate = package.get('scripts', {}).get('check', '')
validate_gate = package.get('scripts', {}).get('validate', '')

checks = {
    'active_game_modal_semantics': all(marker in party for marker in (
        'id="play-layer"', 'aria-labelledby="play-title"', 'aria-modal="true"', 'role="dialog"'
    )),
    'detail_modal_semantics': 'id="game-detail"' in party and 'aria-labelledby="detail-title"' in party,
    'a11y_layer_loaded': 'party-hub-a11y.js' in polish and 'loadHubA11y' in polish,
    'a11y_layer_strict': "'use strict'" in a11y,
    'background_inert_contract': 'node.inert = Boolean(overlay)' in a11y and 'syncBackgroundInert' in a11y,
    'view_heading_focus_contract': "heading.setAttribute('tabindex', '-1')" in a11y and 'focusVisibleViewHeading' in a11y,
    'tab_focus_trap_contract': all(marker in a11y for marker in (
        "event.key !== 'Tab'", 'trapOverlayFocus', 'first.focus()', 'last.focus()'
    )),
    'offline_a11y_layer': "'./party-hub-a11y.js'" in sw,
    'syntax_gate': 'node --check party-hub-a11y.js' in syntax_gate,
    'self_audit_in_validate': 'scripts/hub_a11y_contract_audit.py' in validate_gate,
    'unit_contract': all(marker in unit for marker in (
        'modalBackgroundIsolation: true', 'modalFocusTrapContract: true', 'activeGameDialogSemantics: true'
    )),
    'browser_heading_focus': 'hub view changes move programmatic focus to the visible heading' in e2e,
    'browser_detail_focus': 'hub detail modal isolates background and traps keyboard focus' in e2e,
    'browser_game_focus': 'active hub game is modal and keeps focus out of the hidden hub' in e2e,
    'module_size_under_20kb': (ROOT / 'party-hub-a11y.js').stat().st_size < 20_000,
}

failed = [name for name, passed in checks.items() if not passed]
if failed:
    raise SystemExit('Hub accessibility contract failed: ' + ', '.join(failed))

print(json.dumps({
    'hub_a11y_contract_audit': 'PASS',
    'static_contract_only': True,
    'real_screen_reader_and_zoom_pass_still_required': True,
    'checks': checks
}, ensure_ascii=False, indent=2))
