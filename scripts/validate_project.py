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
    'game-engine.js', 'role-assignment.js', 'word-packs.js', 'data-store.js', 'app.js',
    'party-catalog.js', 'party-expansion.js', 'party-routing.js',
    'party-custom-packs.js', 'party-hub.js', 'party-hub-plus.js',
    'party-data-tools.js', 'party-advanced.js', 'party-advanced-runner.js',
    'party-advanced-preferences.js', 'sw.js', 'manifest.webmanifest',
    'icon.svg', 'icon-192.png', 'icon-512.png', 'package.json',
    'playwright.config.js', 'playwright.cross-browser.config.js',
    'tests/engine.test.js', 'tests/storage.test.js', 'tests/content.test.js',
    'tests/role-assignment.test.js', 'tests/fuzz.test.js',
    'tests/party-catalog.test.js', 'tests/party-expansion.test.js',
    'tests/party-custom-packs.test.js', 'tests/e2e/party-hub.spec.js',
    'tests/e2e/party-advanced.spec.js', 'tests/e2e/party-custom-packs.spec.js',
    'tests/e2e/party-data.spec.js', 'tests/e2e/party-stats.spec.js',
    'tests/e2e/offline.spec.js', 'tests/e2e/pwa-install.spec.js',
    'tests/e2e/runtime-guard.spec.js', 'tests/cross-browser/smoke.spec.js',
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
    'runtime-guard.js', 'party-catalog.js', 'party-expansion.js', 'party-routing.js',
    'party-custom-packs.js', 'party-hub.js', 'party-hub-plus.js', 'party-data-tools.js'
])
advanced = audit_html('advanced.html', [
    'runtime-guard.js', 'party-catalog.js', 'party-expansion.js', 'party-routing.js',
    'party-advanced.js', 'party-advanced-runner.js', 'party-advanced-preferences.js'
])

for marker in ['href="party.html"', 'role-assignment.js', 'data-store.js']:
    if marker not in index:
        raise SystemExit(f'Word Imposter marker missing: {marker}')
for marker in [
    'Der ganze Spieleabend in einer App', 'game-search', 'group-filter',
    'mood-filter', 'player-filter', 'age-filter', 'status-filter',
    'Host-Presets', 'achievement-grid', 'hub-export-data',
    'party-custom-packs.js', 'game-detail', 'play-layer'
]:
    if marker not in party:
        raise SystemExit(f'Party Hub marker missing: {marker}')
for marker in ['advanced-pack', 'advanced-length', 'advanced-start', 'advanced-play-layer']:
    if marker not in advanced:
        raise SystemExit(f'Advanced screen marker missing: {marker}')

sources = {
    'engine': read('game-engine.js'),
    'store': read('data-store.js'),
    'roles': read('role-assignment.js'),
    'base_catalog': read('party-catalog.js'),
    'expansion': read('party-expansion.js'),
    'routing': read('party-routing.js'),
    'custom_packs': read('party-custom-packs.js'),
    'advanced_modes': read('party-advanced.js'),
    'advanced_runner': read('party-advanced-runner.js'),
    'hub_plus': read('party-hub-plus.js'),
    'data_tools': read('party-data-tools.js')
}

if not re.search(r'\bVERSION\s*=\s*7\b', sources['engine']):
    raise SystemExit('Game engine version must be 7.')
if not re.search(r'\bKEY_VERSION\s*=\s*7\b', sources['store']) or not re.search(r'\bENGINE_VERSION\s*=\s*7\b', sources['store']):
    raise SystemExit('Storage schema must be version 7.')

module_markers = {
    'roles': ['MAX_IMPOSTERS = 6', 'independent-roles-v1', 'assignIndependentRoles', 'engine.restoreGame', 'engine.createGame', 'version: 2'],
    'expansion': ["'two-truths': 'two-truths'", "'question-imposter': 'question-imposter'", "'location-spy': 'location-spy'", "mafia: 'mafia'", "id: 'wavelength'", 'version: 2'],
    'routing': ['advancedMode', 'advanced.html?game=', 'version: 3'],
    'custom_packs': ['secret-circle-party-custom-packs-v1', 'MAX_PACKS = 20', 'MAX_ITEMS = 100', 'createManager', 'commit(nextState)', 'restoreStorage', 'version: 2'],
    'advanced_modes': ['renderTwoTruths', 'renderQuestionImposter', 'renderLocationSpy', 'renderMafia', 'assignMafiaRoles', 'mafiaWinner', 'version: 1'],
    'advanced_runner': ['ACTIVE_VERSION = 2', 'session.players', 'sessionPlayers', 'historyId', 'saveHubState(nextHubState)', 'Session bleibt aktiv', 'MAX_SESSION_ROUNDS = 20'],
    'hub_plus': ['VERSION = 5', 'savePreferences', 'repairStatsFromHistory', 'escapeSelector', 'Statistik konnte nicht repariert'],
    'data_tools': ['VERSION = 2', 'MAX_BYTES = 1_500_000', 'byteLength', 'replaceEntries', 'Import und Rollback', 'Datenlöschung abgebrochen']
}
for source_name, markers in module_markers.items():
    for marker in markers:
        if marker not in sources[source_name]:
            raise SystemExit(f'Module marker missing in {source_name}: {marker}')

base_games = len(re.findall(r"\bid:\s*'[^']+'", sources['base_catalog'].split('const content =', 1)[0]))
added_games = len(re.findall(r"\bid:\s*'[^']+'", sources['expansion'].split('const advancedContent =', 1)[0]))
if (base_games, added_games) != (18, 4):
    raise SystemExit(f'Unexpected catalog structure: {base_games} base and {added_games} added games.')

sw = read('sw.js')
cache = re.search(r"const CACHE='([^']+)'", sw)
if not cache or cache.group(1) != 'secret-circle-v24':
    raise SystemExit('Service worker cache must be secret-circle-v24.')
core_match = re.search(r'const CORE=(\[[^;]+\]);', sw)
if not core_match:
    raise SystemExit('Service worker CORE list missing.')
core = ast.literal_eval(core_match.group(1))
expected_core = [
    './', './index.html', './party.html', './advanced.html', './privacy.html',
    './styles.css', './pwa.css', './party.css', './party-extra.css',
    './runtime-guard.js', './setup-ux.js', './privacy-guard.js', './wake-lock.js',
    './app.js', './game-engine.js', './role-assignment.js', './word-packs.js',
    './data-store.js', './party-catalog.js', './party-expansion.js',
    './party-routing.js', './party-custom-packs.js', './party-hub.js',
    './party-hub-plus.js', './party-data-tools.js', './party-advanced.js',
    './party-advanced-runner.js', './party-advanced-preferences.js',
    './manifest.webmanifest', './icon.svg', './icon-192.png', './icon-512.png'
]
if core != expected_core:
    raise SystemExit('Service worker CORE is not synchronized with cache v24.')
for marker in ['cache.addAll', 'await cache.put', 'self.clients.claim', 'handleNavigation', 'handleAsset']:
    if marker not in sw:
        raise SystemExit(f'Service worker marker missing: {marker}')

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
for marker in ['party-expansion.js', 'party-routing.js', 'party-custom-packs.js', 'party-advanced.js', 'party-advanced-runner.js', 'party-hub-plus.js', 'party-data-tools.js']:
    if marker not in package['scripts']['check']:
        raise SystemExit(f'Syntax gate missing: {marker}')
for marker in ['tests/party-catalog.test.js', 'tests/party-expansion.test.js', 'tests/party-custom-packs.test.js']:
    if marker not in package['scripts']['test']:
        raise SystemExit(f'Unit gate missing: {marker}')

required_test_markers = {
    'tests/party-expansion.test.js': ['playableGames', 'advancedPlayableGames', 'totalItems'],
    'tests/party-custom-packs.test.js': ['transactionRollback', 'failedRemovalPreservesPack', 'unicodeDuplicatesRemoved'],
    'tests/e2e/party-hub.spec.js': ['playable catalog and roadmap', 'age preference', 'advanced games are playable'],
    'tests/e2e/party-advanced.spec.js': ['survive a reload', 'original player snapshot', 'failed history write'],
    'tests/e2e/party-custom-packs.spec.js': ['custom pack editor validates', 'duplicate pack names', 'custom packs can be deleted'],
    'tests/e2e/party-data.spec.js': ['multibyte backup over the byte limit', 'failed import write rolls back', 'failed deletion rolls back'],
    'tests/e2e/party-stats.spec.js': ['statistics storage failure', 'preference storage failure', 'non-finite history values'],
    'tests/e2e/offline.spec.js': ['secret-circle-v24', 'custom packs', 'advanced Question Imposter'],
    'tests/e2e/runtime-guard.spec.js': ['secret-circle-v24'],
    'tests/e2e/pwa-install.spec.js': ['./party.html', 'Party Hub'],
    'tests/cross-browser/smoke.spec.js': ['Party Hub catalog', 'Question Imposter']
}
for relative, markers in required_test_markers.items():
    source = read(relative).lower()
    for marker in markers:
        if marker.lower() not in source:
            raise SystemExit(f'Missing test marker {marker} in {relative}')

required_doc_markers = {
    'README.md': ['secret-circle-v24', 'Eigene Hub-Kategorien', 'Byte-Grenze'],
    'RELEASE_STATUS.md': ['secret-circle-v24', 'transaktionssichere Datensicherung', 'Gesamte gewünschte Party-Hub-Vision'],
    'CHANGELOG.md': ['secret-circle-v24', 'Mehrbyte', 'Präferenz'],
    'DEPLOYMENT.md': ['secret-circle-v24', 'Rollback', 'Spielergruppe'],
    'RELEASE_CHECKLIST.md': ['secret-circle-v24', 'Byte-Grenze', 'Spieler-Snapshot'],
    'MANUAL_TEST_PLAN.md': ['secret-circle-v24', 'Mehrbyte', 'Spielergruppe'],
    'KNOWN_LIMITATIONS.md': ['secret-circle-v24', 'Eigene Hub-Packs', 'Online-Mehrspielermodus'],
    'CI_TROUBLESHOOTING.md': ['secret-circle-v24', 'eigene Hub-Packs', 'GitHub Actions']
}
for relative, markers in required_doc_markers.items():
    source = read(relative).lower()
    for marker in markers:
        if marker.lower() not in source:
            raise SystemExit(f'Missing documentation marker {marker} in {relative}')

print(json.dumps({
    'structure_validation': 'PASS',
    'required_files': len(REQUIRED),
    'html_pages_audited': 3,
    'engine_version': 7,
    'storage_version': 7,
    'role_assignment_version': 2,
    'party_games_total': base_games + added_games,
    'party_games_playable': 18,
    'party_games_planned': 4,
    'advanced_playable_games': 4,
    'advanced_active_schema': 2,
    'hub_plus_version': 5,
    'data_tools_version': 2,
    'custom_pack_builder': True,
    'transactional_custom_packs': True,
    'player_snapshot_sessions': True,
    'transaction_safe_history': True,
    'byte_safe_backup': True,
    'transactional_import_delete': True,
    'pwa_cache': cache.group(1),
    'offline_core_assets': len(core),
    'manifest_start_url': manifest.get('start_url')
}, ensure_ascii=False, indent=2))
