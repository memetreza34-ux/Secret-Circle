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
    'party-catalog.js', 'party-expansion.js', 'party-trending-catalog.js',
    'party-mega-catalog.js', 'party-routing.js', 'party-custom-packs.js',
    'party-hub.js', 'party-hub-plus.js', 'party-hub-polish.js',
    'party-night.js', 'party-data-tools.js', 'party-advanced.js',
    'party-advanced-runner.js', 'party-advanced-preferences.js',
    'party-quick-modes.js', 'party-mega-modes.js', 'quick-loader.js',
    'sw.js', 'manifest.webmanifest', 'icon.svg', 'icon-192.png', 'icon-512.png',
    'package.json', 'playwright.config.js', 'playwright.cross-browser.config.js',
    'tests/party-trending-catalog.test.js', 'tests/party-mega-catalog.test.js',
    'tests/party-custom-packs.test.js', 'tests/e2e/party-quick-modes.spec.js',
    'tests/e2e/party-mega-modes.spec.js', 'tests/e2e/offline.spec.js',
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
    for directive in ["default-src 'self'", "script-src 'self'", "style-src 'self'", "object-src 'none'", "base-uri 'none'", "form-action 'self'"]:
        if directive not in audit.csp:
            raise SystemExit(f'CSP directive missing in {relative}: {directive}')
    return source

index = audit_html('index.html', [
    'runtime-guard.js', 'setup-ux.js', 'privacy-guard.js', 'wake-lock.js',
    'game-engine.js', 'role-assignment.js', 'word-packs.js', 'data-store.js', 'app.js'
])
party = audit_html('party.html', [
    'runtime-guard.js', 'party-catalog.js', 'party-expansion.js',
    'party-trending-catalog.js', 'party-mega-catalog.js', 'party-routing.js',
    'party-custom-packs.js', 'party-hub.js', 'party-hub-plus.js',
    'party-hub-polish.js', 'party-night.js', 'party-data-tools.js'
])
advanced = audit_html('advanced.html', [
    'runtime-guard.js', 'party-catalog.js', 'party-expansion.js', 'party-routing.js',
    'party-advanced.js', 'party-advanced-runner.js', 'party-advanced-preferences.js'
])
quick = audit_html('quick-play.html', [
    'runtime-guard.js', 'party-catalog.js', 'party-expansion.js',
    'party-trending-catalog.js', 'party-mega-catalog.js', 'party-routing.js',
    'party-custom-packs.js', 'quick-loader.js'
])

for marker in ['party-mega-catalog.js', 'party-hub-polish.js', 'game-detail', 'play-layer']:
    if marker not in party:
        raise SystemExit(f'Party Hub marker missing: {marker}')
for marker in ['quick-pack', 'quick-rounds', 'quick-resume-box', 'quick-result', 'quick-loader.js']:
    if marker not in quick:
        raise SystemExit(f'Quick page marker missing: {marker}')
for marker in ['advanced-pack', 'advanced-length', 'advanced-start', 'advanced-play-layer']:
    if marker not in advanced:
        raise SystemExit(f'Advanced page marker missing: {marker}')

sources = {name: read(path) for name, path in {
    'engine': 'game-engine.js', 'store': 'data-store.js', 'roles': 'role-assignment.js',
    'base': 'party-catalog.js', 'expansion': 'party-expansion.js',
    'trending': 'party-trending-catalog.js', 'mega': 'party-mega-catalog.js',
    'routing': 'party-routing.js', 'custom': 'party-custom-packs.js',
    'quick': 'party-quick-modes.js', 'mega_runtime': 'party-mega-modes.js',
    'loader': 'quick-loader.js', 'night': 'party-night.js', 'data_tools': 'party-data-tools.js'
}.items()}

if not re.search(r'\bVERSION\s*=\s*7\b', sources['engine']):
    raise SystemExit('Game engine version must be 7.')
if not re.search(r'\bKEY_VERSION\s*=\s*7\b', sources['store']) or not re.search(r'\bENGINE_VERSION\s*=\s*7\b', sources['store']):
    raise SystemExit('Storage schema must be version 7.')

markers = {
    'trending': ['trendingGameIds', 'version: 3', 'caption-battle'],
    'mega': ['megaGameIds', 'quickGameIds', 'version: 4', 'who-am-i', 'anime-guess', 'money-challenge', 'blind-ranking', 'emoji-quiz', 'pass-the-phone', 'red-green-flag', 'secret-mission', 'tier-list'],
    'routing': ["require('./party-mega-catalog.js')", 'version: 5'],
    'custom': ['MAX_PACKS = 30', 'MAX_ITEMS = 150', 'version: 3', 'anime-guess', 'who-am-i'],
    'quick': ["secret-circle-party-quick-active-v1", 'renderWavelength', 'finishSession'],
    'mega_runtime': ["secret-circle-party-mega-active-v1", 'renderWhoAmI', 'renderAnimeGuess', 'renderMoneyChallenge', 'renderBlindRanking', 'renderEmojiQuiz', 'renderSecretMission', 'renderTierList', 'finishSession'],
    'loader': ['party-mega-modes.js', 'party-quick-modes.js'],
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
if (base_games, expansion_games, trending_games, mega_games) != (18, 4, 6, 9):
    raise SystemExit(f'Unexpected catalog layers: {base_games}, {expansion_games}, {trending_games}, {mega_games}.')

sw = read('sw.js')
cache = re.search(r"const CACHE='([^']+)'", sw)
if not cache or cache.group(1) != 'secret-circle-v27':
    raise SystemExit('Service worker cache must be secret-circle-v27.')
core_match = re.search(r'const CORE=(\[[^;]+\]);', sw)
if not core_match:
    raise SystemExit('Service worker CORE list missing.')
core = ast.literal_eval(core_match.group(1))
for required_asset in [
    './party.html', './advanced.html', './quick-play.html', './party-trending-catalog.js',
    './party-mega-catalog.js', './party-routing.js', './party-quick-modes.js',
    './party-mega-modes.js', './quick-loader.js', './party-quick.css'
]:
    if required_asset not in core:
        raise SystemExit(f'Service worker CORE asset missing: {required_asset}')
if len(core) != len(set(core)):
    raise SystemExit('Service worker CORE contains duplicates.')

manifest = json.loads(read('manifest.webmanifest'))
if manifest.get('id') != './' or manifest.get('start_url') != './party.html' or manifest.get('scope') != './':
    raise SystemExit('Manifest install scope is invalid.')
for source, size in [('icon-192.png', 192), ('icon-512.png', 512)]:
    data = (ROOT / source).read_bytes()
    if data[:8] != b'\x89PNG\r\n\x1a\n' or data[12:16] != b'IHDR' or struct.unpack('>II', data[16:24]) != (size, size):
        raise SystemExit(f'PNG file invalid: {source}')

package = json.loads(read('package.json'))
if package.get('version') != '1.0.0-beta.3' or package.get('engines', {}).get('node') != '>=20':
    raise SystemExit('Package metadata invalid.')
for marker in ['party-mega-catalog.js', 'party-mega-modes.js', 'quick-loader.js']:
    if marker not in package['scripts']['check']:
        raise SystemExit(f'Syntax gate missing: {marker}')
if 'tests/party-mega-catalog.test.js' not in package['scripts']['test']:
    raise SystemExit('Mega catalog unit gate missing.')

unit_tests = sorted(path.name for path in (ROOT / 'tests').glob('*.test.js'))
e2e_suites = sorted(path.name for path in (ROOT / 'tests' / 'e2e').glob('*.spec.js'))
cross_suites = sorted(path.name for path in (ROOT / 'tests' / 'cross-browser').glob('*.spec.js'))
if len(unit_tests) < 11 or len(e2e_suites) < 24 or not cross_suites:
    raise SystemExit('Automated test matrix is incomplete.')
for required in ['party-mega-modes.spec.js', 'party-quick-modes.spec.js', 'offline.spec.js']:
    if required not in e2e_suites:
        raise SystemExit(f'Critical E2E suite missing: {required}')

for relative in ['README.md', 'ARCHITECTURE.md', 'MODE_UNIVERSE.md', 'RELEASE_STATUS.md', 'DEPLOYMENT.md', 'SECURITY.md', 'MANUAL_TEST_PLAN.md', 'privacy.html']:
    path = ROOT / relative
    if not path.is_file() or path.stat().st_size < 300:
        raise SystemExit(f'Missing or incomplete document: {relative}')

print(json.dumps({
    'structure_validation': 'PASS',
    'required_files': len(REQUIRED),
    'engine_version': 7,
    'storage_version': 7,
    'catalog_layers': {'base': base_games, 'expansion': expansion_games, 'trending': trending_games, 'mega': mega_games},
    'visible_games': 37,
    'playable_games': 37,
    'classic_quick_modes': 10,
    'mega_trend_modes': 9,
    'pwa_cache': cache.group(1),
    'offline_core_assets': len(core),
    'unit_test_files': len(unit_tests),
    'e2e_suites': len(e2e_suites),
    'cross_browser_suites': len(cross_suites)
}, ensure_ascii=False, indent=2))
