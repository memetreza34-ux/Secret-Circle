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
    'index.html', 'party.html', 'advanced.html', 'quick-play.html', 'creator.html', 'privacy.html',
    'styles.css', 'pwa.css', 'party.css', 'party-extra.css', 'party-night.css', 'party-quick.css', 'party-guide.css', 'creator.css',
    'runtime-guard.js', 'setup-ux.js', 'privacy-guard.js', 'wake-lock.js',
    'game-engine.js', 'role-assignment.js', 'word-packs.js', 'data-store.js', 'app.js',
    'party-catalog.js', 'party-expansion.js', 'party-trending-catalog.js', 'party-mega-catalog.js', 'party-viral-catalog.js',
    'party-routing.js', 'game-creator.js', 'creator-page.js', 'party-custom-packs.js',
    'party-hub.js', 'party-hub-plus.js', 'party-hub-polish.js', 'party-guide.js',
    'party-night.js', 'party-data-tools.js', 'party-advanced.js', 'party-advanced-runner.js',
    'party-advanced-preferences.js', 'party-quick-modes.js', 'party-mega-modes.js', 'party-viral-modes.js', 'quick-loader.js',
    'sw.js', 'manifest.webmanifest', 'icon.svg', 'icon-192.png', 'icon-512.png',
    'package.json', 'playwright.config.js', 'playwright.cross-browser.config.js',
    'tests/party-trending-catalog.test.js', 'tests/party-mega-catalog.test.js', 'tests/party-viral-catalog.test.js',
    'tests/game-creator.test.js', 'tests/party-custom-packs.test.js',
    'tests/e2e/party-quick-modes.spec.js', 'tests/e2e/party-mega-modes.spec.js', 'tests/e2e/party-viral-modes.spec.js',
    'tests/e2e/party-viral-resilience.spec.js', 'tests/e2e/game-creator.spec.js', 'tests/e2e/offline.spec.js',
    'scripts/repo_hygiene.py', 'scripts/architecture_audit.py', 'scripts/performance_budget.py', 'scripts/release_audit.py',
    '.github/workflows/ci.yml', '.github/workflows/cross-browser.yml',
    'README.md', 'ARCHITECTURE.md', 'MODE_UNIVERSE.md', 'TREND_FORMATS.md', 'RELEASE_CHECKLIST.md',
    'RELEASE_STATUS.md', 'CHANGELOG.md', 'KNOWN_LIMITATIONS.md', 'SECURITY.md',
    'MANUAL_TEST_PLAN.md', 'CI_TROUBLESHOOTING.md', 'DEPLOYMENT.md'
}
missing = sorted(path for path in REQUIRED if not (ROOT / path).is_file())
if missing:
    raise SystemExit(f'Missing required files: {", ".join(missing)}')

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
    duplicates = sorted({value for value in audit.ids if audit.ids.count(value) > 1})
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
    for directive in ["default-src 'self'", "script-src 'self'", "style-src 'self'", "object-src 'none'", "base-uri 'none'", "form-action 'self'"]:
        if directive not in audit.csp:
            raise SystemExit(f'CSP directive missing in {relative}: {directive}')
    return source

index = audit_html('index.html', [
    'runtime-guard.js', 'setup-ux.js', 'privacy-guard.js', 'wake-lock.js',
    'game-engine.js', 'role-assignment.js', 'word-packs.js', 'data-store.js', 'app.js'
])
party = audit_html('party.html', [
    'runtime-guard.js', 'party-catalog.js', 'party-expansion.js', 'party-trending-catalog.js',
    'party-mega-catalog.js', 'party-viral-catalog.js', 'party-routing.js', 'party-custom-packs.js',
    'party-hub.js', 'party-hub-plus.js', 'party-hub-polish.js', 'party-night.js', 'party-data-tools.js'
])
advanced = audit_html('advanced.html', [
    'runtime-guard.js', 'party-catalog.js', 'party-expansion.js', 'party-routing.js',
    'party-advanced.js', 'party-advanced-runner.js', 'party-advanced-preferences.js'
])
quick = audit_html('quick-play.html', [
    'runtime-guard.js', 'party-catalog.js', 'party-expansion.js', 'party-trending-catalog.js',
    'party-mega-catalog.js', 'party-viral-catalog.js', 'party-routing.js', 'party-custom-packs.js', 'quick-loader.js'
])
creator = audit_html('creator.html', ['runtime-guard.js', 'game-creator.js', 'creator-page.js'])
audit_html('privacy.html', [])

for marker in ['party-viral-catalog.js', 'party-hub-polish.js', 'game-detail', 'play-layer']:
    if marker not in party:
        raise SystemExit(f'Party Hub marker missing: {marker}')
for marker in ['quick-pack', 'quick-rounds', 'quick-resume-box', 'quick-result', 'quick-loader.js']:
    if marker not in quick:
        raise SystemExit(f'Quick page marker missing: {marker}')
for marker in ['advanced-pack', 'advanced-length', 'advanced-start', 'advanced-play-layer']:
    if marker not in advanced:
        raise SystemExit(f'Advanced page marker missing: {marker}')
for marker in ['template-grid', 'pack-editor', 'creator-preview-card', 'created-games-list', 'creator-safe-confirm']:
    if marker not in creator:
        raise SystemExit(f'Creator marker missing: {marker}')
for marker in ['href="party.html"', 'role-assignment.js', 'data-store.js']:
    if marker not in index:
        raise SystemExit(f'Word Imposter marker missing: {marker}')

sources = {name: read(path) for name, path in {
    'engine': 'game-engine.js', 'store': 'data-store.js', 'base': 'party-catalog.js',
    'expansion': 'party-expansion.js', 'trending': 'party-trending-catalog.js',
    'mega': 'party-mega-catalog.js', 'viral': 'party-viral-catalog.js',
    'routing': 'party-routing.js', 'creator': 'game-creator.js', 'creator_page': 'creator-page.js',
    'custom': 'party-custom-packs.js', 'guide': 'party-guide.js',
    'quick': 'party-quick-modes.js', 'mega_runtime': 'party-mega-modes.js',
    'viral_runtime': 'party-viral-modes.js', 'loader': 'quick-loader.js',
    'night': 'party-night.js', 'data_tools': 'party-data-tools.js'
}.items()}

if not re.search(r'\bVERSION\s*=\s*7\b', sources['engine']):
    raise SystemExit('Game engine version must be 7.')
if not re.search(r'\bKEY_VERSION\s*=\s*7\b', sources['store']) or not re.search(r'\bENGINE_VERSION\s*=\s*7\b', sources['store']):
    raise SystemExit('Storage schema must be version 7.')

markers = {
    'trending': ['trendingGameIds', 'version: 3', 'caption-battle'],
    'mega': ['megaGameIds', 'quickGameIds', 'version: 4', 'anime-guess', 'money-challenge'],
    'viral': ['viralGameIds', 'allFastGameIds', 'version: 5', 'put-a-finger-down', 'guess-the-price', 'higher-lower'],
    'routing': ["CREATED_KEY = 'secret-circle-party-created-games-v1'", 'createCatalog', 'version: 7'],
    'creator': ["STORAGE_KEY = 'secret-circle-party-created-games-v1'", 'MAX_GAMES = 40', 'MAX_CARDS = 200', 'createStore', 'normalizeGame'],
    'creator_page': ['renderTemplates', 'addPack', 'renderLibrary', 'importLibrary'],
    'custom': ['MAX_PACKS = 30', 'MAX_ITEMS = 150', 'version: 4'],
    'guide': ['addCreatorEntryPoints', 'addHowItWorks', 'showHelp', 'openRequestedGame'],
    'quick': ['secret-circle-party-quick-active-v1', 'renderWavelength', 'finishSession'],
    'mega_runtime': ['secret-circle-party-mega-active-v1', 'renderWhoAmI', 'renderAnimeGuess', 'finishSession'],
    'viral_runtime': ['secret-circle-party-viral-active-v1', 'renderFingerDown', 'renderGuessPrice', 'finishSession'],
    'loader': ['party-viral-modes.js', 'party-mega-modes.js', 'party-quick-modes.js'],
    'night': ['buildPlan', 'syncPlanFromHistory', 'secret-circle-party-night-v1'],
    'data_tools': ['byteLength', 'replaceEntries', 'secret-circle-complete-backup']
}
for source_name, expected in markers.items():
    for marker in expected:
        if marker not in sources[source_name]:
            raise SystemExit(f'Module marker missing in {source_name}: {marker}')

base_games = len(re.findall(r"\bid:\s*'[^']+'", sources['base'].split('const content =', 1)[0]))
expansion_games = len(re.findall(r"\bid:\s*'[^']+'", sources['expansion'].split('const advancedContent =', 1)[0]))
trending_games = len(re.findall(r"\bid:\s*'[^']+'", sources['trending'].split('const quickContent =', 1)[0]))
mega_games = len(re.findall(r"\bid:\s*'[^']+'", sources['mega'].split('const megaContent =', 1)[0]))
viral_games = len(re.findall(r"\bid:\s*'[^']+'", sources['viral'].split('const viralContent =', 1)[0]))
if (base_games, expansion_games, trending_games, mega_games, viral_games) != (18, 4, 6, 9, 8):
    raise SystemExit(f'Unexpected catalog layers: {base_games}, {expansion_games}, {trending_games}, {mega_games}, {viral_games}.')

sw = read('sw.js')
cache = re.search(r"const CACHE='([^']+)'", sw)
if not cache or cache.group(1) != 'secret-circle-v29':
    raise SystemExit('Service worker cache must be secret-circle-v29.')
core_match = re.search(r'const CORE=(\[[^;]+\]);', sw)
if not core_match:
    raise SystemExit('Service worker CORE list missing.')
core = ast.literal_eval(core_match.group(1))
for required_asset in [
    './party.html', './advanced.html', './quick-play.html', './creator.html',
    './party-viral-catalog.js', './party-routing.js', './game-creator.js', './creator-page.js',
    './party-guide.js', './party-guide.css', './creator.css', './party-viral-modes.js', './quick-loader.js'
]:
    if required_asset not in core:
        raise SystemExit(f'Service worker CORE asset missing: {required_asset}')
if len(core) != len(set(core)):
    raise SystemExit('Service worker CORE contains duplicates.')

manifest = json.loads(read('manifest.webmanifest'))
if manifest.get('id') != './' or manifest.get('start_url') != './party.html' or manifest.get('scope') != './':
    raise SystemExit('Manifest install scope is invalid.')
if manifest.get('name') != 'Secret Circle – Party Hub' or manifest.get('display') != 'standalone' or manifest.get('lang') != 'de':
    raise SystemExit('Manifest metadata is invalid.')
for source, size in [('icon-192.png', 192), ('icon-512.png', 512)]:
    data = (ROOT / source).read_bytes()
    if data[:8] != b'\x89PNG\r\n\x1a\n' or data[12:16] != b'IHDR' or struct.unpack('>II', data[16:24]) != (size, size):
        raise SystemExit(f'PNG file invalid: {source}')

package = json.loads(read('package.json'))
if package.get('version') != '1.0.0-beta.3' or package.get('engines', {}).get('node') != '>=20':
    raise SystemExit('Package metadata invalid.')
for marker in ['game-creator.js', 'creator-page.js', 'party-guide.js', 'party-viral-modes.js']:
    if marker not in package['scripts']['check']:
        raise SystemExit(f'Syntax gate missing: {marker}')
for marker in ['tests/game-creator.test.js', 'tests/party-viral-catalog.test.js']:
    if marker not in package['scripts']['test']:
        raise SystemExit(f'Unit gate missing: {marker}')

unit_tests = sorted(path.name for path in (ROOT / 'tests').glob('*.test.js'))
e2e_suites = sorted(path.name for path in (ROOT / 'tests' / 'e2e').glob('*.spec.js'))
cross_suites = sorted(path.name for path in (ROOT / 'tests' / 'cross-browser').glob('*.spec.js'))
if len(unit_tests) < 13 or len(e2e_suites) < 27 or not cross_suites:
    raise SystemExit('Automated test matrix is incomplete.')
for required in ['game-creator.spec.js', 'party-viral-resilience.spec.js', 'party-viral-modes.spec.js', 'offline.spec.js']:
    if required not in e2e_suites:
        raise SystemExit(f'Critical E2E suite missing: {required}')

for relative in ['README.md', 'ARCHITECTURE.md', 'MODE_UNIVERSE.md', 'TREND_FORMATS.md', 'RELEASE_STATUS.md', 'DEPLOYMENT.md', 'SECURITY.md', 'MANUAL_TEST_PLAN.md', 'privacy.html']:
    path = ROOT / relative
    if not path.is_file() or path.stat().st_size < 300:
        raise SystemExit(f'Missing or incomplete document: {relative}')

print(json.dumps({
    'structure_validation': 'PASS',
    'required_files': len(REQUIRED),
    'engine_version': 7,
    'storage_version': 7,
    'catalog_layers': {'base': base_games, 'expansion': expansion_games, 'trending': trending_games, 'mega': mega_games, 'viral': viral_games},
    'visible_builtin_games': 45,
    'maximum_local_created_games': 40,
    'creator_templates': 6,
    'pwa_cache': cache.group(1),
    'offline_core_assets': len(core),
    'unit_test_files': len(unit_tests),
    'e2e_suites': len(e2e_suites),
    'cross_browser_suites': len(cross_suites)
}, ensure_ascii=False, indent=2))
