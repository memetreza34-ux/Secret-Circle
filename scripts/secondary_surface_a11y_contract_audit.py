#!/usr/bin/env python3
from pathlib import Path
import json
import re

ROOT = Path(__file__).resolve().parents[1]
read = lambda relative: (ROOT / relative).read_text(encoding='utf-8')

required_files = [
    'secondary-surface-a11y.js',
    'advanced.html',
    'quick-play.html',
    'creator.html',
    'package.json',
    'sw.js',
    'tests/accessibility-contract.test.js',
    'tests/e2e/accessibility-core.spec.js',
]
missing = [relative for relative in required_files if not (ROOT / relative).is_file()]
if missing:
    raise SystemExit('Secondary surface accessibility contract missing files: ' + ', '.join(missing))

source = read('secondary-surface-a11y.js')
advanced = read('advanced.html')
quick = read('quick-play.html')
creator = read('creator.html')
package = json.loads(read('package.json'))
sw = read('sw.js')
unit = read('tests/accessibility-contract.test.js')
e2e = read('tests/e2e/accessibility-core.spec.js')

violations = []

for marker in (
    "const VERSION = 1;",
    '#advanced-play-layer',
    '#creator-help',
    '#quick-play',
    'syncBackgroundInert',
    'trapTab',
    'ensureHeadingFocusable',
    '.wizard-step h3',
    '#template-grid',
    'ArrowRight',
    'ArrowLeft',
    'Home',
    'End',
):
    if marker not in source:
        violations.append(f'Secondary accessibility source marker missing: {marker}')

for page_name, page in (
    ('advanced.html', advanced),
    ('quick-play.html', quick),
    ('creator.html', creator),
):
    if 'secondary-surface-a11y.js' not in page:
        violations.append(f'{page_name} does not load secondary-surface-a11y.js')

if not re.search(r'id="advanced-play-layer"[^>]*role="dialog"[^>]*aria-modal="true"', advanced):
    violations.append('Advanced play layer must be an aria-modal dialog.')
if not re.search(r'id="creator-help"[^>]*role="dialog"[^>]*aria-modal="true"', creator):
    violations.append('Creator help must remain an aria-modal dialog.')
if 'role="radiogroup"' not in creator or 'aria-label="Spielvorlage auswählen"' not in creator:
    violations.append('Creator template selector must remain a labelled radiogroup.')

advanced_order = [advanced.find(name) for name in ('secondary-surface-a11y.js', 'party-advanced-runner.js')]
if min(advanced_order) < 0 or advanced_order != sorted(advanced_order):
    violations.append('Advanced must load secondary accessibility before the advanced runner.')
quick_order = [quick.find(name) for name in ('secondary-surface-a11y.js', 'quick-loader.js')]
if min(quick_order) < 0 or quick_order != sorted(quick_order):
    violations.append('Quick must load secondary accessibility before quick-loader.')
creator_order = [creator.find(name) for name in ('secondary-surface-a11y.js', 'creator-page.js')]
if min(creator_order) < 0 or creator_order != sorted(creator_order):
    violations.append('Creator must load secondary accessibility before creator-page.js.')

syntax = package.get('scripts', {}).get('check', '')
validate = package.get('scripts', {}).get('validate', '')
if 'node --check secondary-surface-a11y.js' not in syntax:
    violations.append('secondary-surface-a11y.js missing from npm run check.')
if 'scripts/secondary_surface_a11y_contract_audit.py' not in validate:
    violations.append('Secondary accessibility audit missing from npm run validate.')

if './secondary-surface-a11y.js' not in sw:
    violations.append('Secondary accessibility layer missing from Service Worker offline core.')

for marker in (
    'secondarySurfaceFocusRecovery',
    'creatorTemplateRadiogroupKeyboardContract',
    'advancedModalIsolationContract',
):
    if marker not in unit:
        violations.append(f'Accessibility contract test marker missing: {marker}')

for marker in (
    'advanced play isolates setup and traps focus inside the active game',
    'quick mode recovers focus when a phase replaces the clicked control',
    'creator wizard headings receive focus and template radiogroup supports arrow keys',
    'creator help modal isolates background, traps focus and returns it to the trigger',
):
    if marker not in e2e:
        violations.append(f'Accessibility E2E marker missing: {marker}')

cache = re.search(r"const CACHE='(secret-circle-v\d+)'", sw)
if not cache:
    violations.append('Could not parse active Service Worker cache generation.')

if violations:
    raise SystemExit('\n'.join(sorted(set(violations))))

print(json.dumps({
    'secondary_surface_a11y_contract_audit': 'PASS',
    'source_version': 1,
    'advanced_modal_isolation': True,
    'quick_dynamic_focus_recovery': True,
    'creator_wizard_heading_focus': True,
    'creator_help_modal_isolation': True,
    'creator_radiogroup_arrow_navigation': True,
    'offline_core': cache.group(1) if cache else None,
    'real_screen_reader_and_device_pass_still_required': True,
}, ensure_ascii=False, indent=2))
