#!/usr/bin/env python3
from pathlib import Path
import json
import re

ROOT = Path(__file__).resolve().parents[1]
read = lambda relative: (ROOT / relative).read_text(encoding='utf-8')

production_js = [
    'runtime-guard.js', 'setup-ux.js', 'privacy-guard.js', 'wake-lock.js',
    'game-engine.js', 'role-assignment.js', 'word-packs.js', 'data-store.js',
    'backup-schema-registry.js', 'session-ledger.js', 'party-session-controls.js', 'app.js',
    'party-catalog.js', 'party-expansion.js', 'party-trending-catalog.js',
    'party-mega-catalog.js', 'party-viral-catalog.js', 'party-core-release-catalog.js',
    'party-core-classic-content.js', 'party-routing.js',
    'party-release-structure.js', 'party-filter-state.js', 'party-search-assist.js',
    'game-creator.js', 'creator-page.js', 'party-custom-packs.js',
    'party-hub-timers.js', 'party-hub.js', 'party-hub-plus.js', 'party-hub-polish.js', 'party-guide.js',
    'party-night.js', 'party-data-tools.js', 'party-advanced.js',
    'party-advanced-runner.js', 'party-advanced-preferences.js',
    'party-quick-modes.js', 'party-mega-modes.js', 'party-viral-modes.js',
    'party-created-modes.js', 'quick-loader.js', 'sw.js'
]
html_pages = ['index.html', 'party.html', 'advanced.html', 'quick-play.html', 'creator.html', 'privacy.html']
violations = []


def require_file(relative: str) -> Path:
    path = ROOT / relative
    if not path.is_file():
        violations.append(f'Missing architecture file: {relative}')
    return path


for relative in production_js + html_pages:
    require_file(relative)
if violations:
    raise SystemExit('\n'.join(sorted(set(violations))))

architecture = read('ARCHITECTURE.md')
for marker in (
    'Stabile Identitäten', 'Versionierte Daten', 'Katalog- und Contentarchitektur',
    'Hub- und Timergrenzen', 'Lokale Transaktionen und Exact-once',
    'Datenschutz und Security durch Architektur', 'Offline- und Updatevertrag',
    'Accessibility als Definition of Done', 'Inhaltsvertrag', 'Testpyramide',
    'Performance und Assets', 'Deprecation, Rollback und Erweiterung'
):
    if marker not in architecture:
        violations.append(f'Architecture contract marker missing: {marker}')

package = json.loads(read('package.json'))
if package.get('dependencies'):
    violations.append('Runtime npm dependencies are not allowed without an architecture review.')
if package.get('devDependencies', {}).get('@playwright/test') != '1.54.2':
    violations.append('Playwright must remain exactly pinned.')
if package.get('engines', {}).get('node') != '>=20':
    violations.append('Supported Node.js baseline changed.')

for relative in production_js:
    path = ROOT / relative
    source = read(relative)
    lines = len(source.splitlines())
    if lines > 1_000:
        violations.append(f'{relative} has {lines} lines; split it before 1000 lines.')
    if path.stat().st_size > 100_000:
        violations.append(f'{relative} exceeds the 100 KB module limit.')
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

party_page = read('party.html')
quick_play = read('quick-play.html')

catalog_chain = [
    'party-catalog.js', 'party-expansion.js', 'party-trending-catalog.js',
    'party-mega-catalog.js', 'party-viral-catalog.js',
    'party-core-release-catalog.js', 'party-core-classic-content.js', 'party-routing.js'
]


def check_order(source: str, names: list[str], context: str) -> None:
    positions = []
    for name in names:
        pos = source.find(name)
        if pos < 0:
            violations.append(f'{context} missing ordered module: {name}')
            return
        positions.append(pos)
    if positions != sorted(positions):
        violations.append(f'{context} module order is invalid: {" -> ".join(names)}')


check_order(party_page, catalog_chain, 'party.html')
check_order(quick_play, catalog_chain, 'quick-play.html')
check_order(party_page, ['party-session-controls.js', 'party-hub-timers.js', 'party-hub.js'], 'party.html timer chain')

for marker in (
    'id="pause-hub-game"', 'id="skip-hub-round"', 'id="finish-hub-game"',
    'id="abort-hub-game"', 'id="play-pause-status"'
):
    if marker not in party_page:
        violations.append(f'Hub session control missing from party.html: {marker}')

for marker in (
    'id="quick-session-controls"', 'id="quick-pause"', 'id="quick-skip"',
    'id="quick-exit"', 'id="quick-replay"', 'id="quick-next-game"', 'id="quick-pause-overlay"'
):
    if marker not in quick_play:
        violations.append(f'Shared session control missing from quick-play.html: {marker}')

contracts = {
    'backup-schema-registry.js': [
        'MAX_FILE_BYTES = 1_500_000', "format: 'secret-circle-backup'",
        "format: 'secret-circle-complete-backup'", "format: 'secret-circle-created-games'",
        'validateHeader', 'assertSize'
    ],
    'session-ledger.js': ['createSessionId', 'legacySessionId', 'completionId', 'recordCompletion'],
    'party-session-controls.js': [
        'formatMilliseconds', 'orderedGameIds', 'nextGameId', 'nextGameHref',
        'createController', 'function countdown', 'function setPaused', 'function setSessionActive',
        'remainingMilliseconds'
    ],
    'party-core-release-catalog.js': [
        'coreReleaseContentVersion', 'coreReleaseContentGames', 'function mergeContent',
        "'never-have': {", "'most-likely': {", "'would-rather': {", 'paranoia: {', "'wrong-answers': {"
    ],
    'party-core-classic-content.js': [
        'coreClassicContentVersion', 'coreClassicContentGames', 'function mergeNested', 'function mergeContent',
        "'truth-dare': {", 'charades: {', 'taboo: {', "'hot-potato': {"
    ],
    'party-routing.js': [
        "require('./party-core-classic-content.js')", "CREATED_KEY = 'secret-circle-party-created-games-v1'",
        'safeCreatedGames', 'createCatalog', 'version: 8'
    ],
    'party-release-structure.js': [
        'CORE_IDS', 'LAB_IDS', "label: 'Kernspiel'", "label: 'Erweiterung'", "label: 'Labs'",
        'tierFor', 'ageAllows', 'selectedTier', 'selectedAge', 'tierMatches', 'ageMatches'
    ],
    'party-filter-state.js': [
        "STORAGE_KEY = 'secret-circle-party-catalog-filters-v1'", 'FIXED_VALUES',
        'game-search', 'group-filter', 'mood-filter', 'player-filter', 'age-filter',
        'status-filter', 'release-tier-filter', 'Filter zurücksetzen'
    ],
    'party-search-assist.js': [
        'MANUAL_ALIASES', 'normalizeText', 'levenshtein', 'suggestions',
        'aria-autocomplete', 'listbox', 'ArrowDown', 'Escape'
    ],
    'party-hub.js': [
        'SecretCircleSessionLedger', 'SecretCircleSessionControls', 'SecretCirclePartyHubTimers',
        'S.createController', 'T.createTimerGames', "completionId('hub'", 'recordCompletion(state,',
        "ACTIVE_KEY = 'secret-circle-party-hub-active-v1'", 'normalizeActiveSession',
        'Session fortsetzen', 'Gespeicherten Stand verwerfen', 'skipHubRound', 'abortSession'
    ],
    'party-hub-timers.js': [
        'SecretCirclePartyHubTimers', 'normalizeTimerState', 'createTimerGames',
        "TIMER_KINDS = new Set(['charades', 'taboo', 'hot-potato', 'word-chain'])",
        'renderStoredTimerSession'
    ],
    'runtime-guard.js': [
        'Neue Secret-Circle-Version bereit', 'Jetzt aktualisieren', 'hasActiveSession',
        "waitingWorker.postMessage({ type: 'SKIP_WAITING' })",
        'secret-circle-party-hub-active-v1', 'secret-circle-party-active-v1'
    ],
    'game-creator.js': [
        "STORAGE_KEY = 'secret-circle-party-created-games-v1'", 'MAX_GAMES = 40',
        'MAX_CARDS = 200', 'normalizeGame', 'createStore', 'toCatalogGame'
    ],
    'quick-loader.js': [
        'session-ledger.js', 'party-session-controls.js', 'scriptPlan',
        'SecretCircleSessionLedger', 'SecretCircleSessionControls'
    ],
    'party-data-tools.js': ['byteLength', 'replaceEntries', 'secret-circle-complete-backup'],
}
for relative, markers in contracts.items():
    source = read(relative)
    for marker in markers:
        if marker not in source:
            violations.append(f'Architecture contract missing in {relative}: {marker}')

for forbidden in ('session-ledger-legacy-guard.js', 'SecretCircleLegacySessionGuard'):
    for relative in production_js + ['package.json']:
        if forbidden in read(relative):
            violations.append(f'Obsolete legacy guard reference in {relative}: {forbidden}')

for relative in ('party-quick-modes.js', 'party-mega-modes.js', 'party-viral-modes.js', 'party-created-modes.js'):
    source = read(relative)
    if 'let timerId = null' in source or 'const deadline = Date.now() + seconds * 1000' in source:
        violations.append(f'Engine still contains a private non-pausable timer: {relative}')

for relative in ('party-hub.js', 'party-hub-timers.js'):
    source = read(relative)
    for forbidden in ('activeTimer', 'window.setInterval(', 'performance.now()'):
        if forbidden in source:
            violations.append(f'Hub still contains a private non-pausable timer in {relative}: {forbidden}')

syntax_gate = package.get('scripts', {}).get('check', '')
unit_gate = package.get('scripts', {}).get('test', '')
validate_gate = package.get('scripts', {}).get('validate', '')
for module in ('party-core-release-catalog.js', 'party-core-classic-content.js', 'party-hub-timers.js'):
    if f'node --check {module}' not in syntax_gate:
        violations.append(f'Production module missing from syntax gate: {module}')
for test in ('tests/core-content-quality.test.js', 'tests/hub-resume-contract.test.js', 'tests/hub-control-contract.test.js'):
    if test not in unit_gate:
        violations.append(f'Critical architecture test missing from npm test: {test}')
for audit in ('scripts/core_content_audit.py', 'scripts/release_audit.py', 'scripts/performance_budget.py'):
    if audit not in validate_gate:
        violations.append(f'Critical audit missing from npm validate: {audit}')

sw = read('sw.js')
cache = re.search(r"const CACHE='(secret-circle-v(\d+))'", sw)
staging = re.search(r"const STAGING_CACHE='(secret-circle-v(\d+)-staging)'", sw)
if not cache or not staging:
    violations.append('Service-worker cache contract could not be parsed.')
else:
    cache_name = cache.group(1)
    cache_generation = cache.group(2)
    if staging.group(2) != cache_generation:
        violations.append('Service-worker active/staging cache generations differ.')
    for relative in ('ARCHITECTURE.md', 'DEPLOYMENT.md', 'tests/service-worker.test.js'):
        if cache_name not in read(relative):
            violations.append(f'Current cache {cache_name} not synchronized in {relative}.')

for asset in (
    './party-core-release-catalog.js', './party-core-classic-content.js', './party-hub-timers.js',
    './session-ledger.js', './party-session-controls.js', './party-search-assist.js'
):
    if asset not in sw:
        violations.append(f'Offline core missing architecture-critical asset: {asset}')

if 'await caches.delete(CACHE)' in sw:
    violations.append('Service-worker must not destroy the active cache before promotion.')
install_handler = re.search(r"self\.addEventListener\('install',[\s\S]*?\n\}\);", sw)
if not install_handler or 'skipWaiting' in install_handler.group(0):
    violations.append('Service-worker install must wait for explicit update activation.')
if "event.data?.type === 'SKIP_WAITING'" not in sw:
    violations.append('Service-worker controlled activation message is missing.')

if violations:
    raise SystemExit('\n'.join(sorted(set(violations))))

print(json.dumps({
    'architecture_audit': 'PASS',
    'production_modules': len(production_js),
    'html_pages': len(html_pages),
    'runtime_dependencies': 0,
    'module_line_limit': 1000,
    'module_size_limit_bytes': 100000,
    'pwa_cache': cache.group(1) if cache else None,
    'catalog_chain': catalog_chain,
    'core_content_modules': ['party-core-release-catalog.js', 'party-core-classic-content.js'],
    'shared_session_controls': True,
    'split_hub_timer_module': True,
    'exact_once_contract': True,
    'controlled_pwa_update': True,
}, ensure_ascii=False, indent=2))
