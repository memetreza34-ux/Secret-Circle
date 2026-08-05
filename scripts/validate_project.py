#!/usr/bin/env python3
from pathlib import Path
from html.parser import HTMLParser
import ast
import json
import re
import struct

ROOT = Path(__file__).resolve().parents[1]
read = lambda path: (ROOT / path).read_text(encoding='utf-8')

REQUIRED = {
    'index.html', 'party.html', 'advanced.html', 'quick-play.html', 'privacy.html',
    'styles.css', 'pwa.css', 'party.css', 'party-extra.css', 'party-night.css', 'party-quick.css',
    'runtime-guard.js', 'setup-ux.js', 'privacy-guard.js', 'wake-lock.js',
    'game-engine.js', 'role-assignment.js', 'word-packs.js', 'data-store.js', 'app.js',
    'party-catalog.js', 'party-expansion.js', 'party-trending-catalog.js', 'party-routing.js',
    'party-custom-packs.js', 'party-hub.js', 'party-hub-plus.js', 'party-hub-polish.js',
    'party-night.js', 'party-data-tools.js', 'party-advanced.js',
    'party-advanced-runner.js', 'party-advanced-preferences.js', 'party-quick-modes.js',
    'sw.js', 'manifest.webmanifest', 'icon.svg', 'icon-192.png', 'icon-512.png',
    'package.json', 'playwright.config.js', 'playwright.cross-browser.config.js',
    'tests/engine.test.js', 'tests/storage.test.js', 'tests/content.test.js',
    'tests/role-assignment.test.js', 'tests/fuzz.test.js',
    'tests/party-catalog.test.js', 'tests/party-expansion.test.js',
    'tests/party-trending-catalog.test.js', 'tests/party-custom-packs.test.js',
    'tests/party-night.test.js', 'tests/e2e/party-hub.spec.js',
    'tests/e2e/party-night.spec.js', 'tests/e2e/party-advanced.spec.js',
    'tests/e2e/party-quick-modes.spec.js', 'tests/e2e/party-custom-packs.spec.js',
    'tests/e2e/party-data.spec.js', 'tests/e2e/party-stats.spec.js',
    'tests/e2e/offline.spec.js', 'tests/e2e/pwa-install.spec.js',
    'tests/e2e/runtime-guard.spec.js', 'tests/cross-browser/smoke.spec.js',
    'scripts/repo_hygiene.py', 'scripts/architecture_audit.py',
    'scripts/performance_budget.py', 'scripts/release_audit.py',
    '.github/workflows/ci.yml', '.github/workflows/cross-browser.yml',
    'README.md', 'ARCHITECTURE.md', 'MODE_UNIVERSE.md', 'RELEASE_CHECKLIST.md',
    'RELEASE_STATUS.md', 'CHANGELOG.md', 'KNOWN_LIMITATIONS.md', 'SECURITY.md',
    'MANUAL_TEST_PLAN.md', 'CI_TROUBLESHOOTING.md', 'DEPLOYMENT.md'
}
missing = sorted(path for path in REQUIRED if not (ROOT / path).is_file())
if missing:
    raise SystemExit(f'Missing required files: {", ".join(missing)}')

for obsolete in ['match.css', 'accessibility.js', 'accessibility.css', 'ACCESSIBILITY_VALIDATION.md', 'tests/accessibility.test.js']:
    if (ROOT / obsolete).exists():
        raise SystemExit(f'Obsolete file remains: {obsolete}')


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
        if tag == 'link' and values.get('href') and values.get('rel') in {'stylesheet', 'manifest', 'icon', 'apple-touch-icon'}:
            self.assets.add(values['href'])
        if tag == 'meta' and str(values.get('http-equiv', '')).lower() == 'content-security-policy':
            self.csp = values.get('content', '')


def audit_html(relative, expected_scripts):
    source = read(relative)
    audit = HtmlAudit()
    audit.feed(source)
    duplicates = sorted({item for item in audit.ids if audit.ids.count(item) > 1})
    if duplicates:
        raise SystemExit(f'Duplicate ids in {relative}: {", ".join(duplicates)}')
    for tag, attrs in audit.controls:
        control_id = attrs.get('id')
        if not (control_id in audit.labels or attrs.get('aria-label') or attrs.get('aria-labelledby')):
            raise SystemExit(f'Unlabelled control in {relative}: {tag}#{control_id or "unknown"}')
    for asset in audit.assets:
        if asset.startswith(('http:', 'https:', 'data:')) or not (ROOT / asset.lstrip('./')).is_file():
            raise SystemExit(f'Invalid runtime asset in {relative}: {asset}')
    if audit.scripts != expected_scripts:
        raise SystemExit(f'Unexpected script order in {relative}: {audit.scripts}')
    for directive in [
        "default-src 'self'", "script-src 'self'", "style-src 'self'",
        "object-src 'none'", "base-uri 'none'", "form-action 'self'"
    ]:
        if directive not in audit.csp:
            raise SystemExit(f'CSP directive missing in {relative}: {directive}')
    return source


index = audit_html('index.html', [
    'runtime-guard.js', 'setup-ux.js', 'privacy-guard.js', 'wake-lock.js',
    'game-engine.js', 'role-assignment.js', 'word-packs.js', 'data-store.js', 'app.js'
])
party = audit_html('party.html', [
    'runtime-guard.js', 'party-catalog.js', 'party-expansion.js',
    'party-trending-catalog.js', 'party-routing.js', 'party-custom-packs.js',
    'party-hub.js', 'party-hub-plus.js', 'party-hub-polish.js',
    'party-night.js', 'party-data-tools.js'
])
advanced = audit_html('advanced.html', [
    'runtime-guard.js', 'party-catalog.js', 'party-expansion.js', 'party-routing.js',
    'party-advanced.js', 'party-advanced-runner.js', 'party-advanced-preferences.js'
])
quick = audit_html('quick-play.html', [
    'runtime-guard.js', 'party-catalog.js', 'party-expansion.js',
    'party-trending-catalog.js', 'party-routing.js', 'party-custom-packs.js',
    'party-quick-modes.js'
])

for marker in ['href="party.html"', 'role-assignment.js', 'data-store.js']:
    if marker not in index:
        raise SystemExit(f'Word Imposter marker missing: {marker}')
for marker in [
    'Der ganze Spieleabend in einer App', 'game-search', 'group-filter',
    'mood-filter', 'player-filter', 'age-filter', 'status-filter',
    'Host-Presets', 'achievement-grid', 'party-trending-catalog.js',
    'party-hub-polish.js', 'party-night.js', 'game-detail', 'play-layer'
]:
    if marker not in party:
        raise SystemExit(f'Party Hub marker missing: {marker}')
for marker in ['advanced-pack', 'advanced-length', 'advanced-start', 'advanced-play-layer']:
    if marker not in advanced:
        raise SystemExit(f'Advanced screen marker missing: {marker}')
for marker in [
    'quick-pack', 'quick-rounds', 'quick-resume-box', 'quick-progress-bar',
    'quick-result', 'party-trending-catalog.js', 'party-quick-modes.js'
]:
    if marker not in quick:
        raise SystemExit(f'Quick Mode page marker missing: {marker}')

sources = {
    name: read(path) for name, path in {
        'engine': 'game-engine.js', 'store': 'data-store.js', 'roles': 'role-assignment.js',
        'base_catalog': 'party-catalog.js', 'expansion': 'party-expansion.js',
        'trending': 'party-trending-catalog.js', 'routing': 'party-routing.js',
        'custom_packs': 'party-custom-packs.js', 'party_night': 'party-night.js',
        'advanced_modes': 'party-advanced.js', 'advanced_runner': 'party-advanced-runner.js',
        'quick_modes': 'party-quick-modes.js', 'hub_plus': 'party-hub-plus.js',
        'hub_polish': 'party-hub-polish.js', 'data_tools': 'party-data-tools.js'
    }.items()
}

if not re.search(r'\bVERSION\s*=\s*7\b', sources['engine']):
    raise SystemExit('Game engine version must be 7.')
if not re.search(r'\bKEY_VERSION\s*=\s*7\b', sources['store']) or not re.search(r'\bENGINE_VERSION\s*=\s*7\b', sources['store']):
    raise SystemExit('Storage schema must be version 7.')

module_markers = {
    'roles': ['MAX_IMPOSTERS = 6', 'independent-roles-v1', 'assignIndependentRoles', 'version: 2'],
    'expansion': ["'two-truths': 'two-truths'", "'question-imposter': 'question-imposter'", "id: 'wavelength'", 'version: 2'],
    'trending': ['quick-play.html?game=', 'trendingGameIds', 'forehead-guess', 'letter-categories', 'caption-battle', 'version: 3'],
    'routing': ["require('./party-trending-catalog.js')", 'advanced.html?game=', 'version: 4'],
    'custom_packs': ['secret-circle-party-custom-packs-v1', 'MAX_PACKS = 20', 'MAX_ITEMS = 100', 'version: 2'],
    'party_night': ['VERSION = 1', 'secret-circle-party-night-v1', 'buildPlan', 'syncPlanFromHistory'],
    'advanced_modes': ['renderTwoTruths', 'renderQuestionImposter', 'renderLocationSpy', 'renderMafia', 'version: 1'],
    'advanced_runner': ['ACTIVE_VERSION = 2', 'session.players', 'historyId', 'MAX_SESSION_ROUNDS = 20'],
    'quick_modes': [
        "ACTIVE_KEY = 'secret-circle-party-quick-active-v1'", 'validActive', 'saveActive',
        'renderWavelength', 'renderRapidFire', 'renderCategories', 'renderCaptionBattle', 'finishSession'
    ],
    'hub_plus': ['savePreferences', 'repairStatsFromHistory', 'renderStatsSummary'],
    'hub_polish': ['Quick Mode öffnen', 'Erweitertes Spiel öffnen', 'SecretCirclePartyHubPolish'],
    'data_tools': ['MAX_BYTES = 1_500_000', 'byteLength', 'replaceEntries', 'secret-circle-complete-backup']
}
for source_name, markers in module_markers.items():
    for marker in markers:
        if marker not in sources[source_name]:
            raise SystemExit(f'Module marker missing in {source_name}: {marker}')

base_games = len(re.findall(r"\bid:\s*'[^']+'", sources['base_catalog'].split('const content =', 1)[0]))
expanded_games = len(re.findall(r"\bid:\s*'[^']+'", sources['expansion'].split('const advancedContent =', 1)[0]))
trending_games = len(re.findall(r"\bid:\s*'[^']+'", sources['trending'].split('const quickContent =', 1)[0]))
if (base_games, expanded_games, trending_games) != (18, 4, 6):
    raise SystemExit(f'Unexpected catalog layers: {base_games} base, {expanded_games} expansion, {trending_games} trending.')

sw = read('sw.js')
cache = re.search(r"const CACHE='([^']+)'", sw)
if not cache or cache.group(1) != 'secret-circle-v26':
    raise SystemExit('Service worker cache must be secret-circle-v26.')
core_match = re.search(r'const CORE=(\[[^;]+\]);', sw)
if not core_match:
    raise SystemExit('Service worker CORE list missing.')
core = ast.literal_eval(core_match.group(1))
expected_core = [
    './', './index.html', './party.html', './advanced.html', './quick-play.html', './privacy.html',
    './styles.css', './pwa.css', './party.css', './party-extra.css', './party-night.css', './party-quick.css',
    './runtime-guard.js', './setup-ux.js', './privacy-guard.js', './wake-lock.js',
    './app.js', './game-engine.js', './role-assignment.js', './word-packs.js', './data-store.js',
    './party-catalog.js', './party-expansion.js', './party-trending-catalog.js', './party-routing.js',
    './party-custom-packs.js', './party-hub.js', './party-hub-plus.js', './party-hub-polish.js',
    './party-night.js', './party-data-tools.js', './party-advanced.js',
    './party-advanced-runner.js', './party-advanced-preferences.js', './party-quick-modes.js',
    './manifest.webmanifest', './icon.svg', './icon-192.png', './icon-512.png'
]
if core != expected_core:
    raise SystemExit('Service worker CORE is not synchronized with cache v26.')

manifest = json.loads(read('manifest.webmanifest'))
if manifest.get('id') != './' or manifest.get('start_url') != './party.html' or manifest.get('scope') != './':
    raise SystemExit('Manifest must install the Party Hub with a relative scope.')
if manifest.get('name') != 'Secret Circle – Party Hub' or manifest.get('display') != 'standalone' or manifest.get('lang') != 'de':
    raise SystemExit('Manifest metadata is invalid.')
for source, size in [('icon-192.png', 192), ('icon-512.png', 512)]:
    icon = next((item for item in manifest.get('icons', []) if item.get('src') == source), None)
    if not icon or icon.get('sizes') != f'{size}x{size}' or icon.get('type') != 'image/png':
        raise SystemExit(f'Manifest icon invalid: {source}')
    data = (ROOT / source).read_bytes()
    if data[:8] != b'\x89PNG\r\n\x1a\n' or data[12:16] != b'IHDR' or struct.unpack('>II', data[16:24]) != (size, size):
        raise SystemExit(f'PNG file invalid: {source}')

package = json.loads(read('package.json'))
if package.get('version') != '1.0.0-beta.3' or package.get('engines', {}).get('node') != '>=20':
    raise SystemExit('Package metadata invalid.')
for name in ['test', 'check', 'validate', 'test:e2e', 'test:cross-browser', 'ci']:
    if not package.get('scripts', {}).get(name):
        raise SystemExit(f'Package script missing: {name}')
for marker in [
    'party-trending-catalog.js', 'party-quick-modes.js', 'party-hub-polish.js',
    'party-expansion.js', 'party-routing.js', 'party-night.js', 'party-advanced-runner.js'
]:
    if marker not in package['scripts']['check']:
        raise SystemExit(f'Syntax gate missing: {marker}')
for marker in [
    'tests/party-trending-catalog.test.js', 'tests/party-catalog.test.js',
    'tests/party-expansion.test.js', 'tests/party-custom-packs.test.js', 'tests/party-night.test.js'
]:
    if marker not in package['scripts']['test']:
        raise SystemExit(f'Unit gate missing: {marker}')

unit_tests = sorted(path.name for path in (ROOT / 'tests').glob('*.test.js'))
e2e_suites = sorted(path.name for path in (ROOT / 'tests' / 'e2e').glob('*.spec.js'))
cross_suites = sorted(path.name for path in (ROOT / 'tests' / 'cross-browser').glob('*.spec.js'))
if len(unit_tests) < 10 or len(e2e_suites) < 22 or not cross_suites:
    raise SystemExit('Expanded automated test matrix is incomplete.')
for required in ['party-trending-catalog.test.js']:
    if required not in unit_tests:
        raise SystemExit(f'Critical unit test missing: {required}')
for required in ['party-quick-modes.spec.js', 'offline.spec.js', 'party-advanced.spec.js']:
    if required not in e2e_suites:
        raise SystemExit(f'Critical E2E suite missing: {required}')

for relative in [
    'README.md', 'ARCHITECTURE.md', 'MODE_UNIVERSE.md', 'RELEASE_CHECKLIST.md',
    'RELEASE_STATUS.md', 'CHANGELOG.md', 'KNOWN_LIMITATIONS.md', 'SECURITY.md',
    'MANUAL_TEST_PLAN.md', 'CI_TROUBLESHOOTING.md', 'DEPLOYMENT.md', 'privacy.html'
]:
    path = ROOT / relative
    if not path.is_file() or path.stat().st_size < 300:
        raise SystemExit(f'Missing or incomplete production document: {relative}')

print(json.dumps({
    'structure_validation': 'PASS',
    'required_files': len(REQUIRED),
    'html_pages_audited': 4,
    'engine_version': 7,
    'storage_version': 7,
    'catalog_layers': {'base': base_games, 'expansion': expanded_games, 'trending': trending_games},
    'visible_games': 28,
    'playable_games': 28,
    'quick_modes': 10,
    'pwa_cache': cache.group(1),
    'offline_core_assets': len(core),
    'unit_test_files': len(unit_tests),
    'e2e_suites': len(e2e_suites),
    'cross_browser_suites': len(cross_suites)
}, ensure_ascii=False, indent=2))
