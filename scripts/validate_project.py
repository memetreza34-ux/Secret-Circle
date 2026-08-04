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
    'index.html', 'party.html', 'advanced.html', 'privacy.html',
    'styles.css', 'pwa.css', 'party.css', 'party-extra.css',
    'runtime-guard.js', 'setup-ux.js', 'privacy-guard.js', 'wake-lock.js',
    'game-engine.js', 'role-assignment.js', 'word-packs.js', 'data-store.js',
    'app.js', 'party-catalog.js', 'party-expansion.js', 'party-routing.js',
    'party-hub.js', 'party-hub-plus.js', 'party-data-tools.js',
    'party-advanced.js', 'party-advanced-runner.js',
    'party-advanced-preferences.js', 'sw.js', 'manifest.webmanifest',
    'icon.svg', 'icon-192.png', 'icon-512.png', 'package.json',
    'playwright.config.js', 'playwright.cross-browser.config.js',
    'tests/engine.test.js', 'tests/storage.test.js', 'tests/content.test.js',
    'tests/role-assignment.test.js', 'tests/fuzz.test.js',
    'tests/party-catalog.test.js', 'tests/party-expansion.test.js',
    'tests/e2e/game-flow.spec.js', 'tests/e2e/setup-limits.spec.js',
    'tests/e2e/timer.spec.js', 'tests/e2e/offline.spec.js',
    'tests/e2e/pwa-install.spec.js', 'tests/e2e/runtime-guard.spec.js',
    'tests/e2e/privacy-guard.spec.js', 'tests/e2e/wake-lock.spec.js',
    'tests/e2e/role-assignment.spec.js', 'tests/e2e/content.spec.js',
    'tests/e2e/history.spec.js', 'tests/e2e/storage-safety.spec.js',
    'tests/e2e/security.spec.js', 'tests/e2e/accessibility.spec.js',
    'tests/e2e/party-hub.spec.js', 'tests/e2e/party-advanced.spec.js',
    'tests/e2e/party-data.spec.js', 'tests/cross-browser/smoke.spec.js',
    'scripts/repo_hygiene.py', 'scripts/performance_budget.py',
    'scripts/release_audit.py', '.github/workflows/ci.yml',
    '.github/workflows/cross-browser.yml', 'README.md',
    'RELEASE_CHECKLIST.md', 'RELEASE_STATUS.md', 'CHANGELOG.md',
    'KNOWN_LIMITATIONS.md', 'SECURITY.md', 'MANUAL_TEST_PLAN.md',
    'CI_TROUBLESHOOTING.md', 'DEPLOYMENT.md'
}
missing = sorted(path for path in REQUIRED if not (ROOT / path).is_file())
if missing:
    raise SystemExit(f'Missing required files: {", ".join(missing)}')

OBSOLETE = {
    'match.css', 'accessibility.js', 'accessibility.css',
    'ACCESSIBILITY_VALIDATION.md', 'tests/accessibility.test.js'
}
remaining = sorted(path for path in OBSOLETE if (ROOT / path).exists())
if remaining:
    raise SystemExit(f'Obsolete files remain: {", ".join(remaining)}')


class HtmlAudit(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids = []
        self.labels = set()
        self.controls = []
        self.assets = set()
        self.scripts = []
        self.meta = {}

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
        if tag == 'meta':
            key = values.get('name') or values.get('http-equiv')
            if key:
                self.meta[key.lower()] = values.get('content', '')


def audit_html(relative, expected_scripts):
    source = read(relative)
    audit = HtmlAudit()
    audit.feed(source)
    duplicates = sorted({item for item in audit.ids if audit.ids.count(item) > 1})
    if duplicates:
        raise SystemExit(f'Duplicate HTML ids in {relative}: {", ".join(duplicates)}')
    for tag, attrs in audit.controls:
        control_id = attrs.get('id')
        if not (control_id in audit.labels or attrs.get('aria-label') or attrs.get('aria-labelledby')):
            raise SystemExit(f'Unlabelled control in {relative}: {tag}#{control_id or "unknown"}')
    for asset in audit.assets:
        if asset.startswith(('http:', 'https:', 'data:')):
            raise SystemExit(f'External runtime asset in {relative}: {asset}')
        if not (ROOT / asset.lstrip('./')).is_file():
            raise SystemExit(f'Invalid HTML asset in {relative}: {asset}')
    if audit.scripts != expected_scripts:
        raise SystemExit(f'Unexpected script order in {relative}: {audit.scripts}')
    csp = audit.meta.get('content-security-policy', '')
    for directive in [
        "default-src 'self'", "script-src 'self'", "style-src 'self'",
        "object-src 'none'", "base-uri 'none'", "form-action 'self'"
    ]:
        if directive not in csp:
            raise SystemExit(f'CSP directive missing in {relative}: {directive}')
    return source, audit


index, index_audit = audit_html('index.html', [
    'runtime-guard.js', 'setup-ux.js', 'privacy-guard.js', 'wake-lock.js',
    'game-engine.js', 'role-assignment.js', 'word-packs.js',
    'data-store.js', 'app.js'
])
party, party_audit = audit_html('party.html', [
    'runtime-guard.js', 'party-catalog.js', 'party-expansion.js',
    'party-routing.js', 'party-hub.js', 'party-hub-plus.js',
    'party-data-tools.js'
])
advanced, advanced_audit = audit_html('advanced.html', [
    'runtime-guard.js', 'party-catalog.js', 'party-expansion.js',
    'party-routing.js', 'party-advanced.js', 'party-advanced-runner.js',
    'party-advanced-preferences.js'
])

if 'href="party.html"' not in index:
    raise SystemExit('Word Imposter does not link to the Party Hub.')
for marker in [
    'Der ganze Spieleabend in einer App', 'game-search', 'group-filter',
    'mood-filter', 'player-filter', 'age-filter', 'status-filter',
    'Host-Presets', 'achievement-grid', 'hub-export-data',
    'game-detail', 'play-layer'
]:
    if marker not in party:
        raise SystemExit(f'Party Hub marker missing: {marker}')
for marker in [
    'advanced-pack', 'advanced-length', 'advanced-start',
    'advanced-play-layer', 'party-advanced-runner.js'
]:
    if marker not in advanced:
        raise SystemExit(f'Advanced game screen marker missing: {marker}')

engine = read('game-engine.js')
store = read('data-store.js')
roles = read('role-assignment.js')
base_catalog = read('party-catalog.js')
expansion = read('party-expansion.js')
routing = read('party-routing.js')
advanced_modes = read('party-advanced.js')
advanced_runner = read('party-advanced-runner.js')
data_tools = read('party-data-tools.js')
hub_plus = read('party-hub-plus.js')

if not re.search(r'\bVERSION\s*=\s*7\b', engine):
    raise SystemExit('Game engine version must be 7.')
if not re.search(r'\bKEY_VERSION\s*=\s*7\b', store) or not re.search(r'\bENGINE_VERSION\s*=\s*7\b', store):
    raise SystemExit('Storage schema and migration engine must be version 7.')
for marker in [
    'MAX_IMPOSTERS = 6', 'independent-roles-v1',
    'assignIndependentRoles', 'validateGameRoles',
    'engine.assertGame', 'engine.restoreGame', 'engine.createGame',
    'engine.nextRound', 'version: 4'
]:
    if marker not in roles:
        raise SystemExit(f'Role-assignment marker missing: {marker}')
for marker in [
    "'two-truths': 'two-truths'", "'question-imposter': 'question-imposter'",
    "'location-spy': 'location-spy'", "mafia: 'mafia'",
    "id: 'wavelength'", "id: 'draw-guess'", "id: 'rapid-fire'",
    "id: 'sound-imitation'", 'version: 2'
]:
    if marker not in expansion:
        raise SystemExit(f'Party expansion marker missing: {marker}')
for marker in ['advancedMode', 'advanced.html?game=', 'version: 3']:
    if marker not in routing:
        raise SystemExit(f'Party routing marker missing: {marker}')
for marker in [
    'renderTwoTruths', 'renderQuestionImposter', 'renderLocationSpy',
    'renderMafia', 'assignMafiaRoles', 'mafiaWinner', 'version: 1'
]:
    if marker not in advanced_modes:
        raise SystemExit(f'Advanced mode marker missing: {marker}')
for marker in [
    'secret-circle-party-active-v1', 'MAX_SESSION_ROUNDS = 20',
    'renderSessionSummary', 'loadActive', 'persistActive',
    'party.html?view=stats'
]:
    if marker not in advanced_runner:
        raise SystemExit(f'Advanced runner marker missing: {marker}')
for marker in [
    'secret-circle-complete-backup', 'MAX_BYTES = 1_500_000',
    'validateBackup', 'collectEntries', 'Import abgebrochen'
]:
    if marker not in data_tools:
        raise SystemExit(f'Party data-tool marker missing: {marker}')
for marker in [
    'achievement-grid', 'gameAllowed', 'beforeinstallprompt',
    'settings-age-level', 'version: 4'
]:
    if marker not in hub_plus:
        raise SystemExit(f'Party Hub-plus marker missing: {marker}')

base_games = len(re.findall(r"\bid:\s*'[^']+'", base_catalog.split('const content =', 1)[0]))
added_games = len(re.findall(r"\bid:\s*'[^']+'", expansion.split('const advancedContent =', 1)[0]))
if (base_games, added_games) != (18, 4):
    raise SystemExit(f'Unexpected catalog structure: {base_games} base games and {added_games} additions.')

sw = read('sw.js')
cache = re.search(r"const CACHE='([^']+)'", sw)
if not cache or cache.group(1) != 'secret-circle-v21':
    raise SystemExit('Service worker cache must be secret-circle-v21.')
core_match = re.search(r'const CORE=(\[[^;]+\]);', sw)
if not core_match:
    raise SystemExit('Service worker CORE list missing.')
core = ast.literal_eval(core_match.group(1))
EXPECTED_CORE = [
    './', './index.html', './party.html', './advanced.html', './privacy.html',
    './styles.css', './pwa.css', './party.css', './party-extra.css',
    './runtime-guard.js', './setup-ux.js', './privacy-guard.js',
    './wake-lock.js', './app.js', './game-engine.js', './role-assignment.js',
    './word-packs.js', './data-store.js', './party-catalog.js',
    './party-expansion.js', './party-routing.js', './party-hub.js',
    './party-hub-plus.js', './party-data-tools.js', './party-advanced.js',
    './party-advanced-runner.js', './party-advanced-preferences.js',
    './manifest.webmanifest', './icon.svg', './icon-192.png', './icon-512.png'
]
if core != EXPECTED_CORE:
    raise SystemExit('Service worker CORE list is not synchronized with the v21 product.')
for marker in ['cache.addAll', 'await cache.put', 'self.clients.claim', 'handleNavigation', 'handleAsset']:
    if marker not in sw:
        raise SystemExit(f'Service-worker marker missing: {marker}')

manifest = json.loads(read('manifest.webmanifest'))
if manifest.get('id') != './' or manifest.get('start_url') != './party.html' or manifest.get('scope') != './':
    raise SystemExit('Manifest must install the Party Hub with a relative scope.')
if manifest.get('name') != 'Secret Circle – Party Hub' or manifest.get('display') != 'standalone' or manifest.get('lang') != 'de':
    raise SystemExit('Manifest product metadata is invalid.')
for source, size in [('icon-192.png', 192), ('icon-512.png', 512)]:
    icon = next((item for item in manifest.get('icons', []) if item.get('src') == source), None)
    if not icon or icon.get('sizes') != f'{size}x{size}' or icon.get('type') != 'image/png':
        raise SystemExit(f'Manifest icon invalid: {source}')
    data = (ROOT / source).read_bytes()
    if data[:8] != b'\x89PNG\r\n\x1a\n' or data[12:16] != b'IHDR':
        raise SystemExit(f'PNG signature invalid: {source}')
    width, height = struct.unpack('>II', data[16:24])
    if (width, height) != (size, size):
        raise SystemExit(f'PNG dimensions invalid: {source}')

package = json.loads(read('package.json'))
if package.get('version') != '1.0.0-beta.3' or package.get('engines', {}).get('node') != '>=20':
    raise SystemExit('Package metadata invalid.')
scripts = package.get('scripts', {})
for name in ['test', 'check', 'validate', 'test:e2e', 'test:cross-browser', 'ci']:
    if not scripts.get(name):
        raise SystemExit(f'Package script missing: {name}')
for marker in [
    'party-expansion.js', 'party-routing.js', 'party-advanced.js',
    'party-advanced-runner.js', 'party-advanced-preferences.js',
    'party-hub-plus.js', 'party-data-tools.js'
]:
    if marker not in scripts['check']:
        raise SystemExit(f'Syntax gate missing: {marker}')
for marker in ['tests/party-catalog.test.js', 'tests/party-expansion.test.js']:
    if marker not in scripts['test']:
        raise SystemExit(f'Unit gate missing: {marker}')

for relative, markers in {
    'tests/party-expansion.test.js': ['playableGames', 'advancedPlayableGames', 'totalItems'],
    'tests/e2e/party-hub.spec.js': ['playable catalog and roadmap', 'age preference', 'advanced games are playable'],
    'tests/e2e/party-advanced.spec.js': ['two truths and a lie', 'question imposter', 'location spy', 'mafia', 'survive a reload'],
    'tests/e2e/party-data.spec.js': ['complete backup exports', 'complete backup import', 'invalid import', 'complete deletion'],
    'tests/e2e/offline.spec.js': ['secret-circle-v21', 'advanced Question Imposter'],
    'tests/e2e/runtime-guard.spec.js': ['secret-circle-v21'],
    'tests/e2e/pwa-install.spec.js': ['./party.html', 'Party Hub'],
    'tests/cross-browser/smoke.spec.js': ['Party Hub catalog', 'Question Imposter']
}.items():
    text = read(relative)
    for marker in markers:
        if marker.lower() not in text.lower():
            raise SystemExit(f'Missing test marker {marker} in {relative}')

for relative in [
    'README.md', 'RELEASE_CHECKLIST.md', 'RELEASE_STATUS.md', 'CHANGELOG.md',
    'KNOWN_LIMITATIONS.md', 'SECURITY.md', 'MANUAL_TEST_PLAN.md',
    'CI_TROUBLESHOOTING.md', 'DEPLOYMENT.md'
]:
    if (ROOT / relative).stat().st_size < 300:
        raise SystemExit(f'Incomplete production document: {relative}')

print(json.dumps({
    'structure_validation': 'PASS',
    'required_files': len(REQUIRED),
    'html_pages_audited': ['index.html', 'party.html', 'advanced.html'],
    'engine_version': 7,
    'storage_version': 7,
    'base_catalog_games': base_games,
    'expanded_catalog_games': base_games + added_games,
    'playable_games': 18,
    'planned_games': 4,
    'advanced_playable_games': 4,
    'pwa_cache': cache.group(1),
    'offline_core_assets': len(core),
    'manifest_start_url': manifest.get('start_url')
}, ensure_ascii=False, indent=2))
