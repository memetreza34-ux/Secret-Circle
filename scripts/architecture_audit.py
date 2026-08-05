#!/usr/bin/env python3
from pathlib import Path
import json
import re

ROOT = Path(__file__).resolve().parents[1]
read = lambda relative: (ROOT / relative).read_text(encoding='utf-8')

production_js = [
    'runtime-guard.js', 'setup-ux.js', 'privacy-guard.js', 'wake-lock.js',
    'game-engine.js', 'role-assignment.js', 'word-packs.js', 'data-store.js', 'app.js',
    'party-catalog.js', 'party-expansion.js', 'party-routing.js',
    'party-custom-packs.js', 'party-hub.js', 'party-hub-plus.js',
    'party-night.js', 'party-data-tools.js', 'party-advanced.js',
    'party-advanced-runner.js', 'party-advanced-preferences.js', 'sw.js'
]
html_pages = ['index.html', 'party.html', 'advanced.html', 'privacy.html']
violations = []

architecture = ROOT / 'ARCHITECTURE.md'
if not architecture.is_file():
    violations.append('ARCHITECTURE.md is missing.')
else:
    text = architecture.read_text(encoding='utf-8')
    for marker in [
        'Stabile Identitäten', 'Versionierte Daten', 'Modulgrenzen',
        'Lokale Transaktionen', 'Offline- und Updatevertrag',
        'Accessibility als Definition of Done', 'Performancebudget',
        'Deprecation und Rollback'
    ]:
        if marker not in text:
            violations.append(f'Architecture contract marker missing: {marker}')

package = json.loads(read('package.json'))
if package.get('dependencies'):
    violations.append('Runtime npm dependencies are not allowed in the offline core without an architecture review.')
if package.get('devDependencies', {}).get('@playwright/test') != '1.54.2':
    violations.append('Playwright must remain exactly pinned for reproducible browser tests.')
if package.get('engines', {}).get('node') != '>=20':
    violations.append('Supported Node.js baseline changed without an architecture update.')

for relative in production_js:
    path = ROOT / relative
    if not path.is_file():
        violations.append(f'Production module missing: {relative}')
        continue
    source = path.read_text(encoding='utf-8')
    line_count = len(source.splitlines())
    if line_count > 1_000:
        violations.append(f'{relative} has {line_count} lines; split it before it exceeds 1000 lines.')
    if path.stat().st_size > 100_000:
        violations.append(f'{relative} exceeds the 100 KB production-module architecture limit.')
    if "'use strict'" not in source and '"use strict"' not in source:
        violations.append(f'{relative} does not declare strict mode.')

for relative in html_pages:
    source = read(relative)
    if re.search(r'<script(?![^>]*\bsrc=)[^>]*>', source, re.IGNORECASE):
        violations.append(f'Inline script found in {relative}.')
    if re.search(r'(?:src|href)=["\']https?://', source, re.IGNORECASE):
        violations.append(f'External runtime asset found in {relative}.')
    if "script-src 'self'" not in source or "object-src 'none'" not in source:
        violations.append(f'Strict CSP contract missing in {relative}.')

party_night = read('party-night.js')
for marker in [
    'normalizeConfig', 'eligibleGames', 'buildPlan', 'normalizePlan',
    'syncPlanFromHistory', 'createStore', 'secret-circle-party-night-v1'
]:
    if marker not in party_night:
        violations.append(f'Party Night pure-logic boundary missing: {marker}')

advanced_runner = read('party-advanced-runner.js')
for marker in ['ACTIVE_VERSION = 2', 'session.players', 'historyId', 'saveHubState(nextHubState)']:
    if marker not in advanced_runner:
        violations.append(f'Advanced-session contract missing: {marker}')

custom_packs = read('party-custom-packs.js')
for marker in ['createManager', 'commit(nextState)', 'restoreStorage']:
    if marker not in custom_packs:
        violations.append(f'Custom-pack transaction contract missing: {marker}')

data_tools = read('party-data-tools.js')
for marker in ['byteLength', 'replaceEntries', 'secret-circle-complete-backup']:
    if marker not in data_tools:
        violations.append(f'Backup transaction contract missing: {marker}')

sw = read('sw.js')
cache = re.search(r"const CACHE='secret-circle-v(\d+)'", sw)
if not cache:
    violations.append('Versioned service-worker cache contract is missing.')
for asset in ['./party-night.js', './party-night.css', './party-data-tools.js', './party-advanced-runner.js']:
    if asset not in sw:
        violations.append(f'Offline architecture asset missing from CORE: {asset}')

for relative in ['README.md', 'RELEASE_STATUS.md', 'DEPLOYMENT.md', 'SECURITY.md', 'MANUAL_TEST_PLAN.md']:
    if not (ROOT / relative).is_file() or (ROOT / relative).stat().st_size < 500:
        violations.append(f'Long-term operational document missing or incomplete: {relative}')

if violations:
    raise SystemExit('\n'.join(sorted(set(violations))))

print(json.dumps({
    'architecture_audit': 'PASS',
    'architecture_contract': 'ARCHITECTURE.md',
    'production_modules_checked': len(production_js),
    'html_pages_checked': len(html_pages),
    'maximum_module_lines': 1000,
    'maximum_module_bytes': 100000,
    'runtime_dependencies': 0,
    'offline_cache_version': int(cache.group(1)),
    'versioned_storage': True,
    'transaction_contracts': True,
    'party_night_pure_logic': True,
    'external_runtime_assets': 0
}, ensure_ascii=False, indent=2))
