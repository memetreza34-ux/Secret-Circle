#!/usr/bin/env python3
from pathlib import Path
from html.parser import HTMLParser
import ast
import json
import re
import struct

ROOT = Path(__file__).resolve().parents[1]


def read(relative: str) -> str:
    return (ROOT / relative).read_text(encoding='utf-8')


REQUIRED = {
    'index.html', 'party.html', 'advanced.html', 'quick-play.html', 'creator.html', 'privacy.html',
    'styles.css', 'pwa.css', 'pwa-update.css', 'party.css', 'party-extra.css', 'party-night.css',
    'party-quick.css', 'party-guide.css', 'party-release.css', 'party-search.css', 'creator.css',
    'runtime-guard.js', 'setup-ux.js', 'privacy-guard.js', 'wake-lock.js',
    'game-engine.js', 'role-assignment.js', 'word-packs.js', 'data-store.js',
    'backup-schema-registry.js', 'session-ledger.js', 'party-session-controls.js', 'app.js',
    'party-catalog.js', 'party-expansion.js', 'party-trending-catalog.js',
    'party-mega-catalog.js', 'party-viral-catalog.js', 'party-routing.js',
    'party-release-structure.js', 'party-filter-state.js', 'party-search-assist.js',
    'game-creator.js', 'creator-page.js', 'party-custom-packs.js',
    'party-hub.js', 'party-hub-plus.js', 'party-hub-polish.js', 'party-guide.js',
    'party-night.js', 'party-data-tools.js', 'party-advanced.js', 'party-advanced-runner.js',
    'party-advanced-preferences.js', 'party-quick-modes.js', 'party-mega-modes.js',
    'party-viral-modes.js', 'party-created-modes.js', 'quick-loader.js',
    'sw.js', 'manifest.webmanifest', 'icon.svg', 'icon-192.png', 'icon-512.png',
    'package.json', 'playwright.config.js', 'playwright.cross-browser.config.js',
    'tests/engine.test.js', 'tests/storage.test.js', 'tests/role-assignment.test.js',
    'tests/party-release-structure.test.js', 'tests/core-game-contract.test.js',
    'tests/hub-timer-contract.test.js', 'tests/party-filter-state.test.js',
    'tests/party-search-assist.test.js', 'tests/backup-schema-registry.test.js',
    'tests/session-ledger.test.js', 'tests/party-session-controls.test.js',
    'tests/session-ledger-integration.test.js', 'tests/service-worker.test.js',
    'tests/pwa-update.test.js', 'tests/quick-loader.test.js',
    'tests/e2e/core-game-catalog.spec.js', 'tests/e2e/core-hub-statistics.spec.js',
    'tests/e2e/advanced-core-smoke.spec.js', 'tests/e2e/advanced-core-abort.spec.js',
    'tests/e2e/party-filter-state.spec.js', 'tests/e2e/party-search-assist.spec.js',
    'tests/e2e/party-session-controls.spec.js', 'tests/e2e/party-quick-modes.spec.js',
    'tests/e2e/party-mega-modes.spec.js', 'tests/e2e/party-viral-modes.spec.js',
    'tests/e2e/party-viral-resilience.spec.js', 'tests/e2e/game-creator.spec.js',
    'tests/e2e/creator-runner-resilience.spec.js', 'tests/e2e/offline.spec.js',
    'scripts/repo_hygiene.py', 'scripts/architecture_audit.py',
    'scripts/foundation_contract_audit.py', 'scripts/performance_budget.py', 'scripts/release_audit.py',
    '.github/workflows/ci.yml', '.github/workflows/cross-browser.yml',
    'README.md', 'ARCHITECTURE.md', 'BACKUP_SCHEMAS.md', 'MODE_UNIVERSE.md',
    'TREND_FORMATS.md', 'ASSET_PLAN.md', 'RELEASE_SCOPE_2027.md', 'ROADMAP_2027.md',
    'RELEASE_CHECKLIST.md', 'RELEASE_STATUS.md', 'CHANGELOG.md', 'KNOWN_LIMITATIONS.md',
    'SECURITY.md', 'MANUAL_TEST_PLAN.md', 'CI_TROUBLESHOOTING.md', 'DEPLOYMENT.md',
}

missing = sorted(relative for relative in REQUIRED if not (ROOT / relative).is_file())
if missing:
    raise SystemExit(f'Missing required files: {", ".join(missing)}')

for obsolete in ('session-ledger-legacy-guard.js', 'tests/session-ledger-legacy-guard.test.js'):
    if (ROOT / obsolete).exists():
        raise SystemExit(f'Obsolete legacy guard file still exists: {obsolete}')


class HtmlAudit(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids = []
        self.labels = set()
        self.controls = []
        self.assets = set()
        self.scripts = []
        self.csp = ''

    def handle_starttag(self, tag, attrs):
        values = dict(attrs)
        if values.get('id'):
            self.ids.append(values['id'])
        if tag == 'label' and values.get('for'):
            self.labels.add(values['for'])
        if tag in {'input', 'select', 'textarea'}:
            self.controls.append((tag, values))
        if tag == 'script' and values.get('src'):
            self.assets.add(values['src'])
            self.scripts.append(values['src'])
        if tag == 'link' and values.get('href') and values.get('rel') in {
            'stylesheet', 'manifest', 'icon', 'apple-touch-icon'
        }:
            self.assets.add(values['href'])
        if tag == 'meta' and str(values.get('http-equiv', '')).lower() == 'content-security-policy':
            self.csp = values.get('content', '')


def audit_html(relative: str, expected_scripts: list[str]) -> str:
    source = read(relative)
    audit = HtmlAudit()
    audit.feed(source)

    duplicates = sorted({value for value in audit.ids if audit.ids.count(value) > 1})
    if duplicates:
        raise SystemExit(f'Duplicate ids in {relative}: {", ".join(duplicates)}')

    for tag, attrs in audit.controls:
        control_id = attrs.get('id')
        labelled = control_id in audit.labels or attrs.get('aria-label') or attrs.get('aria-labelledby')
        if not labelled:
            raise SystemExit(f'Unlabelled control in {relative}: {tag}#{control_id or "unknown"}')

    for asset in audit.assets:
        if asset.startswith(('http:', 'https:', 'data:')):
            raise SystemExit(f'External runtime asset in {relative}: {asset}')
        if not (ROOT / asset.lstrip('./')).is_file():
            raise SystemExit(f'Invalid runtime asset in {relative}: {asset}')

    if audit.scripts != expected_scripts:
        raise SystemExit(f'Unexpected script order in {relative}: {audit.scripts}')

    for directive in (
        "default-src 'self'", "script-src 'self'", "style-src 'self'",
        "object-src 'none'", "base-uri 'none'", "form-action 'self'",
    ):
        if directive not in audit.csp:
            raise SystemExit(f'CSP directive missing in {relative}: {directive}')
    return source


index = audit_html('index.html', [
    'runtime-guard.js', 'setup-ux.js', 'privacy-guard.js', 'wake-lock.js',
    'game-engine.js', 'role-assignment.js', 'word-packs.js', 'data-store.js', 'app.js',
])
party = audit_html('party.html', [
    'runtime-guard.js', 'party-catalog.js', 'party-expansion.js', 'party-trending-catalog.js',
    'party-mega-catalog.js', 'party-viral-catalog.js', 'party-routing.js', 'party-custom-packs.js',
    'session-ledger.js', 'party-session-controls.js', 'party-hub.js', 'party-hub-plus.js',
    'party-hub-polish.js', 'party-night.js', 'party-data-tools.js',
])
advanced = audit_html('advanced.html', [
    'runtime-guard.js', 'party-catalog.js', 'party-expansion.js', 'party-routing.js',
    'party-advanced.js', 'party-advanced-runner.js', 'party-advanced-preferences.js',
])
quick = audit_html('quick-play.html', [
    'runtime-guard.js', 'party-catalog.js', 'party-expansion.js', 'party-trending-catalog.js',
    'party-mega-catalog.js', 'party-viral-catalog.js', 'party-routing.js',
    'party-custom-packs.js', 'quick-loader.js',
])
creator_page = audit_html('creator.html', ['runtime-guard.js', 'game-creator.js', 'creator-page.js'])
audit_html('privacy.html', [])

for marker in (
    'game-detail', 'play-layer', 'party-viral-catalog.js', 'party-hub-polish.js',
    'pause-hub-game', 'play-pause-status', 'session-ledger.js', 'party-session-controls.js',
):
    if marker not in party:
        raise SystemExit(f'Party Hub marker missing: {marker}')
for marker in (
    'quick-pack', 'quick-rounds', 'quick-resume-box', 'quick-result', 'quick-loader.js',
    'quick-session-controls', 'quick-pause', 'quick-skip', 'quick-exit',
    'quick-replay', 'quick-next-game', 'quick-pause-overlay',
):
    if marker not in quick:
        raise SystemExit(f'Quick page marker missing: {marker}')
for marker in ('advanced-pack', 'advanced-length', 'advanced-start', 'advanced-play-layer'):
    if marker not in advanced:
        raise SystemExit(f'Advanced page marker missing: {marker}')
for marker in ('template-grid', 'pack-editor', 'creator-preview-card', 'created-games-list', 'creator-safe-confirm'):
    if marker not in creator_page:
        raise SystemExit(f'Creator marker missing: {marker}')
for marker in ('href="party.html"', 'role-assignment.js', 'data-store.js'):
    if marker not in index:
        raise SystemExit(f'Word Imposter marker missing: {marker}')

sources = {
    name: read(relative)
    for name, relative in {
        'engine': 'game-engine.js', 'store': 'data-store.js', 'registry': 'backup-schema-registry.js',
        'base': 'party-catalog.js', 'expansion': 'party-expansion.js',
        'trending': 'party-trending-catalog.js', 'mega': 'party-mega-catalog.js',
        'viral': 'party-viral-catalog.js', 'routing': 'party-routing.js',
        'creator': 'game-creator.js', 'custom': 'party-custom-packs.js',
        'release': 'party-release-structure.js', 'filters': 'party-filter-state.js',
        'search': 'party-search-assist.js', 'controls': 'party-session-controls.js',
        'hub': 'party-hub.js', 'quick_runtime': 'party-quick-modes.js',
        'mega_runtime': 'party-mega-modes.js', 'viral_runtime': 'party-viral-modes.js',
        'created_runtime': 'party-created-modes.js', 'ledger': 'session-ledger.js',
        'loader': 'quick-loader.js', 'runtime_guard': 'runtime-guard.js',
        'night': 'party-night.js', 'data_tools': 'party-data-tools.js',
    }.items()
}

if not re.search(r'\bVERSION\s*=\s*7\b', sources['engine']):
    raise SystemExit('Game engine version must be 7.')
if not re.search(r'\bKEY_VERSION\s*=\s*7\b', sources['store']) or not re.search(r'\bENGINE_VERSION\s*=\s*7\b', sources['store']):
    raise SystemExit('Storage schema must be version 7.')
if 'const MAX_FILE_BYTES = 1_500_000;' not in sources['registry']:
    raise SystemExit('Backup registry limit must be 1.5 MB.')

module_markers = {
    'release': ('CORE_IDS', 'LAB_IDS', 'release-tier-filter', 'ageAllows'),
    'filters': ('secret-circle-party-catalog-filters-v1', 'Filter zurücksetzen', 'resolveView'),
    'search': ('MANUAL_ALIASES', 'levenshtein', 'suggestions', 'aria-autocomplete'),
    'controls': (
        'formatMilliseconds', 'orderedGameIds', 'nextGameId', 'nextGameHref',
        'createController', 'function countdown', 'function setPaused',
        'function setSessionActive', 'remainingMilliseconds',
    ),
    'hub': (
        'SecretCircleSessionLedger', 'SecretCircleSessionControls', 'S.createController',
        "completionId('hub'", 'recordCompletion(state,', 'sessionId: L.createSessionId',
        'hubTimer.countdown(60, timer', 'hubTimer.countdown(milliseconds / 1000, hiddenClock',
        'hubTimer.countdown(30, timer', "document.addEventListener('visibilitychange'",
        'setHubPaused(true)', 'pause-hub-game',
    ),
    'trending': ('trendingGameIds', 'version: 3', 'caption-battle'),
    'mega': ('megaGameIds', 'quickGameIds', 'version: 4', 'anime-guess', 'money-challenge'),
    'viral': ('viralGameIds', 'allFastGameIds', 'version: 5', 'put-a-finger-down', 'guess-the-price'),
    'routing': ("CREATED_KEY = 'secret-circle-party-created-games-v1'", 'createCatalog', 'version: 8'),
    'creator': ("STORAGE_KEY = 'secret-circle-party-created-games-v1'", 'MAX_GAMES = 40', 'MAX_CARDS = 200'),
    'custom': ('MAX_PACKS = 30', 'MAX_ITEMS = 150', 'version: 4'),
    'ledger': ('recordCompletion', 'legacySessionId', 'createSessionId'),
    'loader': (
        'session-ledger.js', 'party-session-controls.js', 'SecretCircleSessionLedger',
        'SecretCircleSessionControls', 'party-created-modes.js', 'party-viral-modes.js',
    ),
    'runtime_guard': ('Neue Secret-Circle-Version bereit', 'party-search-assist.js', 'loadPartySearchAssist'),
    'night': ('buildPlan', 'syncPlanFromHistory', 'secret-circle-party-night-v1'),
    'data_tools': ('byteLength', 'replaceEntries', 'secret-circle-complete-backup'),
}
for source_name, expected in module_markers.items():
    for marker in expected:
        if marker not in sources[source_name]:
            raise SystemExit(f'Module marker missing in {source_name}: {marker}')

for name, source, engine in (
    ('created', sources['created_runtime'], 'created'),
    ('quick', sources['quick_runtime'], 'quick'),
    ('mega', sources['mega_runtime'], 'mega'),
    ('viral', sources['viral_runtime'], 'viral'),
):
    for marker in (
        'SecretCircleSessionLedger', 'SecretCircleSessionControls', 'S.createController',
        'sessionControls.countdown', 'sessionControls.stopTimer', 'onSkip:',
        'onAbort: abortSession', 'onReplay: replaySession', f"completionId('{engine}'",
        'recordCompletion(loadHub()', 'sessionId: L.createSessionId', 'legacySessionId',
    ):
        if marker not in source:
            raise SystemExit(f'Shared engine contract marker missing in {name}: {marker}')
    if 'let timerId = null' in source or 'const deadline = Date.now() + seconds * 1000' in source:
        raise SystemExit(f'Private non-pausable timer remains in {name}.')

for forbidden in ('activeTimer', 'window.setInterval(', 'performance.now()'):
    if forbidden in sources['hub']:
        raise SystemExit(f'Private Hub timer implementation remains: {forbidden}')

for relative in ('quick-loader.js', 'sw.js', 'package.json'):
    source = read(relative)
    if 'session-ledger-legacy-guard' in source or 'SecretCircleLegacySessionGuard' in source:
        raise SystemExit(f'Obsolete legacy guard reference in {relative}.')

base_games = len(re.findall(r"\bid:\s*'[^']+'", sources['base'].split('const content =', 1)[0]))
expansion_games = len(re.findall(r"\bid:\s*'[^']+'", sources['expansion'].split('const advancedContent =', 1)[0]))
trending_games = len(re.findall(r"\bid:\s*'[^']+'", sources['trending'].split('const quickContent =', 1)[0]))
mega_games = len(re.findall(r"\bid:\s*'[^']+'", sources['mega'].split('const megaContent =', 1)[0]))
viral_games = len(re.findall(r"\bid:\s*'[^']+'", sources['viral'].split('const viralContent =', 1)[0]))
if (base_games, expansion_games, trending_games, mega_games, viral_games) != (18, 4, 6, 9, 8):
    raise SystemExit(f'Unexpected catalog layers: {base_games}, {expansion_games}, {trending_games}, {mega_games}, {viral_games}.')

sw = read('sw.js')
cache = re.search(r"const CACHE='([^']+)'", sw)
if not cache or cache.group(1) != 'secret-circle-v30':
    raise SystemExit('Service worker cache must remain secret-circle-v30 during the foundation migration.')
if "const STAGING_CACHE='secret-circle-v30-staging'" not in sw:
    raise SystemExit('Service worker staging cache is missing.')
core_match = re.search(r'const CORE=(\[[^;]+\]);', sw)
if not core_match:
    raise SystemExit('Service worker CORE list missing.')
core = ast.literal_eval(core_match.group(1))
for required_asset in (
    './party.html', './advanced.html', './quick-play.html', './creator.html',
    './pwa-update.css', './party-release.css', './party-search.css',
    './party-release-structure.js', './party-filter-state.js', './party-search-assist.js',
    './session-ledger.js', './party-session-controls.js', './party-viral-catalog.js',
    './party-routing.js', './game-creator.js', './party-guide.js',
    './party-created-modes.js', './quick-loader.js',
):
    if required_asset not in core:
        raise SystemExit(f'Service worker CORE asset missing: {required_asset}')
if len(core) != len(set(core)):
    raise SystemExit('Service worker CORE contains duplicates.')
if './session-ledger-legacy-guard.js' in core:
    raise SystemExit('Obsolete legacy guard must not be cached.')
install_handler = re.search(r"self\.addEventListener\('install',[\s\S]*?\n\}\);", sw)
if not install_handler or 'skipWaiting' in install_handler.group(0):
    raise SystemExit('Service worker install must stage updates without automatic activation.')

manifest = json.loads(read('manifest.webmanifest'))
if manifest.get('id') != './' or manifest.get('start_url') != './party.html' or manifest.get('scope') != './':
    raise SystemExit('Manifest install scope is invalid.')
if manifest.get('name') != 'Secret Circle – Party Hub' or manifest.get('display') != 'standalone' or manifest.get('lang') != 'de':
    raise SystemExit('Manifest metadata is invalid.')
for source, size in (('icon-192.png', 192), ('icon-512.png', 512)):
    data = (ROOT / source).read_bytes()
    if data[:8] != b'\x89PNG\r\n\x1a\n' or data[12:16] != b'IHDR' or struct.unpack('>II', data[16:24]) != (size, size):
        raise SystemExit(f'PNG file invalid: {source}')

package = json.loads(read('package.json'))
if package.get('version') != '1.0.0-beta.3' or package.get('engines', {}).get('node') != '>=20':
    raise SystemExit('Package metadata invalid.')
for marker in (
    'backup-schema-registry.js', 'session-ledger.js', 'party-session-controls.js',
    'party-search-assist.js', 'runtime-guard.js', 'party-hub.js', 'sw.js',
    'tests/core-game-contract.test.js', 'tests/hub-timer-contract.test.js',
):
    if marker not in package.get('scripts', {}).get('check', ''):
        raise SystemExit(f'Syntax gate missing: {marker}')
for marker in (
    'tests/core-game-contract.test.js', 'tests/hub-timer-contract.test.js',
    'tests/party-search-assist.test.js', 'tests/backup-schema-registry.test.js',
    'tests/session-ledger.test.js', 'tests/party-session-controls.test.js',
    'tests/session-ledger-integration.test.js', 'tests/pwa-update.test.js',
):
    if marker not in package.get('scripts', {}).get('test', ''):
        raise SystemExit(f'Unit gate missing: {marker}')
if 'scripts/foundation_contract_audit.py' not in package.get('scripts', {}).get('validate', ''):
    raise SystemExit('Foundation contract audit missing from validation gate.')

unit_tests = sorted(path.name for path in (ROOT / 'tests').glob('*.test.js'))
e2e_suites = sorted(path.name for path in (ROOT / 'tests' / 'e2e').glob('*.spec.js'))
cross_suites = sorted(path.name for path in (ROOT / 'tests' / 'cross-browser').glob('*.spec.js'))
if len(unit_tests) < 21 or len(e2e_suites) < 33 or not cross_suites:
    raise SystemExit('Automated test matrix is incomplete.')
for required in (
    'core-game-contract.test.js', 'hub-timer-contract.test.js',
    'party-search-assist.test.js', 'backup-schema-registry.test.js', 'session-ledger.test.js',
    'party-session-controls.test.js', 'session-ledger-integration.test.js',
    'service-worker.test.js', 'pwa-update.test.js',
):
    if required not in unit_tests:
        raise SystemExit(f'Critical unit test missing: {required}')
for required in (
    'core-game-catalog.spec.js', 'core-hub-statistics.spec.js',
    'advanced-core-smoke.spec.js', 'advanced-core-abort.spec.js',
    'party-filter-state.spec.js', 'party-search-assist.spec.js', 'party-session-controls.spec.js',
    'game-creator.spec.js', 'creator-runner-resilience.spec.js', 'party-viral-resilience.spec.js',
    'party-viral-modes.spec.js', 'offline.spec.js',
):
    if required not in e2e_suites:
        raise SystemExit(f'Critical E2E suite missing: {required}')

for relative in (
    'README.md', 'ARCHITECTURE.md', 'BACKUP_SCHEMAS.md', 'RELEASE_SCOPE_2027.md',
    'ROADMAP_2027.md', 'RELEASE_CHECKLIST.md', 'RELEASE_STATUS.md', 'CHANGELOG.md',
    'KNOWN_LIMITATIONS.md', 'SECURITY.md', 'MANUAL_TEST_PLAN.md',
    'CI_TROUBLESHOOTING.md', 'DEPLOYMENT.md', 'privacy.html',
):
    if (ROOT / relative).stat().st_size < 300:
        raise SystemExit(f'Missing or incomplete release document: {relative}')

for forbidden in ('eval(', 'new Function(', 'document.write(', 'http://'):
    for relative in (
        'runtime-guard.js', 'backup-schema-registry.js', 'session-ledger.js',
        'party-session-controls.js', 'quick-loader.js', 'party-created-modes.js',
        'party-quick-modes.js', 'party-mega-modes.js', 'party-viral-modes.js',
        'party-search-assist.js', 'party-hub.js', 'game-creator.js', 'creator-page.js',
    ):
        if forbidden in read(relative):
            raise SystemExit(f'Forbidden pattern {forbidden} in {relative}')

print(json.dumps({
    'project_validation': 'PASS',
    'cache': cache.group(1),
    'staged_updates': True,
    'visible_builtin_games': base_games + expansion_games + trending_games + mega_games + viral_games,
    'backup_schemas': 3,
    'exact_once_session_engines': 5,
    'legacy_guard_removed': True,
    'search_assistance': True,
    'shared_session_controls': True,
    'pausable_fast_engine_timers': True,
    'pausable_core_hub_timers': True,
    'unit_test_files': len(unit_tests),
    'e2e_suites': len(e2e_suites),
    'cross_browser_projects': len(cross_suites),
}, ensure_ascii=False, indent=2))
