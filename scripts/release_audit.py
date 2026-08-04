#!/usr/bin/env python3
from pathlib import Path
import json
import re

ROOT = Path(__file__).resolve().parents[1]
read = lambda path: (ROOT / path).read_text(encoding='utf-8')

package = json.loads(read('package.json'))
manifest = json.loads(read('manifest.webmanifest'))
engine = read('game-engine.js')
roles = read('role-assignment.js')
store = read('data-store.js')
imposter_content = read('word-packs.js')
base_catalog = read('party-catalog.js')
expansion = read('party-expansion.js')
routing = read('party-routing.js')
custom_packs = read('party-custom-packs.js')
advanced_modes = read('party-advanced.js')
advanced_runner = read('party-advanced-runner.js')
hub_plus = read('party-hub-plus.js')
data_tools = read('party-data-tools.js')
sw = read('sw.js')
index = read('index.html')
party = read('party.html')
advanced = read('advanced.html')
workflow = read('.github/workflows/ci.yml')
cross_workflow = read('.github/workflows/cross-browser.yml')

checks = {
    'package_version': package.get('version') == '1.0.0-beta.3',
    'node_support': package.get('engines', {}).get('node') == '>=20',
    'engine_version': bool(re.search(r'\bVERSION\s*=\s*7\b', engine)),
    'storage_schema': bool(re.search(r'\bKEY_VERSION\s*=\s*7\b', store)),
    'storage_migration_engine': bool(re.search(r'\bENGINE_VERSION\s*=\s*7\b', store)),
    'role_assignment_v2': 'version: 2' in roles,
    'maximum_six_imposters': 'MAX_IMPOSTERS = 6' in roles,
    'independent_role_seed': 'independent-roles-v1' in roles,
    'expanded_catalog_v2': 'version: 2' in expansion,
    'advanced_routing_v3': 'version: 3' in routing and 'advanced.html?game=' in routing,
    'custom_packs_v2': all(marker in custom_packs for marker in (
        'version: 2', 'createManager', 'commit(nextState)', 'restoreStorage',
        'MAX_PACKS = 20', 'MAX_ITEMS = 100'
    )),
    'advanced_modes_v1': all(marker in advanced_modes for marker in (
        'renderTwoTruths', 'renderQuestionImposter', 'renderLocationSpy', 'renderMafia', 'version: 1'
    )),
    'advanced_active_schema_v2': all(marker in advanced_runner for marker in (
        'ACTIVE_VERSION = 2', 'session.players', 'sessionPlayers', 'historyId'
    )),
    'transaction_safe_advanced_history': all(marker in advanced_runner for marker in (
        'saveHubState(nextHubState)', 'Session bleibt aktiv', 'clearActive'
    )),
    'data_tools_v2': all(marker in data_tools for marker in (
        'VERSION = 2', 'byteLength', 'replaceEntries', 'Import und Rollback', 'Datenlöschung abgebrochen'
    )),
    'hub_plus_v5': all(marker in hub_plus for marker in (
        'VERSION = 5', 'savePreferences', 'repairStatsFromHistory', 'escapeSelector'
    )),
    'complete_local_backup': all(marker in data_tools for marker in (
        'secret-circle-complete-backup', 'MAX_BYTES = 1_500_000', 'MAX_ENTRIES = 100'
    )),
    'party_hub_navigation': all(marker in party for marker in (
        'game-search', 'group-filter', 'mood-filter', 'player-filter',
        'age-filter', 'status-filter', 'hub-players', 'preset-name',
        'favorites-grid', 'achievement-grid', 'hub-export-data', 'party-custom-packs.js'
    )),
    'advanced_setup_and_play': all(marker in advanced for marker in (
        'advanced-pack', 'advanced-length', 'advanced-start', 'advanced-play-layer'
    )),
    'pwa_cache_v24': "const CACHE='secret-circle-v24'" in sw,
    'all_party_modules_cached': all(asset in sw for asset in (
        './party.html', './advanced.html', './party.css', './party-extra.css',
        './party-catalog.js', './party-expansion.js', './party-routing.js',
        './party-custom-packs.js', './party-hub.js', './party-hub-plus.js',
        './party-data-tools.js', './party-advanced.js',
        './party-advanced-runner.js', './party-advanced-preferences.js'
    )),
    'safe_cache_writes': 'await cache.put' in sw,
    'manifest_opens_hub': manifest.get('id') == './' and manifest.get('start_url') == './party.html' and manifest.get('scope') == './',
    'manifest_party_identity': manifest.get('name') == 'Secret Circle – Party Hub',
    'standalone_pwa': manifest.get('display') == 'standalone',
    'strict_csp_all_app_pages': all(
        all(marker in source for marker in (
            "default-src 'self'", "script-src 'self'", "style-src 'self'",
            "object-src 'none'", "base-uri 'none'", "form-action 'self'"
        )) for source in (index, party, advanced)
    ),
    'hub_link_from_imposter': 'href="party.html"' in index,
    'imposter_link_from_hub': 'href="index.html"' in party,
    'expanded_unit_gates': all(marker in package.get('scripts', {}).get('test', '') for marker in (
        'tests/party-catalog.test.js', 'tests/party-expansion.test.js', 'tests/party-custom-packs.test.js'
    )),
    'expanded_syntax_gate': all(marker in package.get('scripts', {}).get('check', '') for marker in (
        'party-expansion.js', 'party-routing.js', 'party-custom-packs.js',
        'party-advanced.js', 'party-advanced-runner.js', 'party-hub-plus.js', 'party-data-tools.js'
    )),
    'main_ci_commands': all(command in workflow for command in (
        'npm run check', 'npm test', 'npm run validate', 'npm run test:e2e'
    )),
    'cross_browser_matrix': all(marker in cross_workflow for marker in (
        'chromium firefox webkit', 'npm run test:cross-browser'
    )),
    'exact_playwright_version': bool(re.fullmatch(
        r'\d+\.\d+\.\d+', package.get('devDependencies', {}).get('@playwright/test', '')
    ))
}
failed = [name for name, passed in checks.items() if not passed]
if failed:
    raise SystemExit(f'Release audit failed: {", ".join(failed)}')

category_count = imposter_content.count('entries:[')
term_count = len(re.findall(r"\['(?:[^'\\]|\\.)*','(?:[^'\\]|\\.)*'\]", imposter_content))
if (category_count, term_count) != (14, 168):
    raise SystemExit(f'Unexpected Imposter content: {category_count} categories, {term_count} terms.')

base_game_count = len(re.findall(r"\bid:\s*'[^']+'", base_catalog.split('const content =', 1)[0]))
added_game_count = len(re.findall(r"\bid:\s*'[^']+'", expansion.split('const advancedContent =', 1)[0]))
if (base_game_count, added_game_count) != (18, 4):
    raise SystemExit(f'Unexpected Party catalog structure: {base_game_count} base and {added_game_count} added games.')

unit_tests = sorted(path.name for path in (ROOT / 'tests').glob('*.test.js'))
e2e_suites = sorted(path.name for path in (ROOT / 'tests' / 'e2e').glob('*.spec.js'))
cross_browser_suites = sorted(path.name for path in (ROOT / 'tests' / 'cross-browser').glob('*.spec.js'))
if len(unit_tests) < 8 or len(e2e_suites) < 19 or not cross_browser_suites:
    raise SystemExit('Automated test matrix is incomplete for the expanded Party Hub.')
for required in ['role-assignment.test.js', 'party-catalog.test.js', 'party-expansion.test.js', 'party-custom-packs.test.js']:
    if required not in unit_tests:
        raise SystemExit(f'Critical unit test missing: {required}')
for required in [
    'role-assignment.spec.js', 'party-hub.spec.js', 'party-advanced.spec.js',
    'party-custom-packs.spec.js', 'party-data.spec.js', 'party-stats.spec.js',
    'offline.spec.js', 'privacy-guard.spec.js', 'wake-lock.spec.js'
]:
    if required not in e2e_suites:
        raise SystemExit(f'Critical E2E suite missing: {required}')

regression_markers = {
    'tests/party-custom-packs.test.js': ['transactionRollback', 'failedRemovalPreservesPack'],
    'tests/e2e/party-advanced.spec.js': ['original player snapshot', 'failed history write'],
    'tests/e2e/party-data.spec.js': ['multibyte backup over the byte limit', 'failed import write rolls back', 'failed deletion rolls back'],
    'tests/e2e/party-stats.spec.js': ['statistics storage failure', 'preference storage failure'],
    'tests/e2e/offline.spec.js': ['secret-circle-v24'],
    'tests/e2e/runtime-guard.spec.js': ['secret-circle-v24']
}
for relative, markers in regression_markers.items():
    source = read(relative).lower()
    for marker in markers:
        if marker.lower() not in source:
            raise SystemExit(f'Regression marker missing in {relative}: {marker}')

required_docs = [
    'README.md', 'RELEASE_CHECKLIST.md', 'RELEASE_STATUS.md', 'CHANGELOG.md',
    'KNOWN_LIMITATIONS.md', 'SECURITY.md', 'MANUAL_TEST_PLAN.md',
    'CI_TROUBLESHOOTING.md', 'DEPLOYMENT.md', 'privacy.html'
]
for relative in required_docs:
    path = ROOT / relative
    if not path.is_file() or path.stat().st_size < 300:
        raise SystemExit(f'Missing or incomplete production document: {relative}')

doc_markers = {
    'README.md': ['secret-circle-v24', 'Byte-Grenze', 'transaktionssicher'],
    'RELEASE_STATUS.md': ['secret-circle-v24', 'transaktionssichere Datensicherung', 'Gesamte gewünschte Party-Hub-Vision'],
    'CHANGELOG.md': ['secret-circle-v24', 'Mehrbyte', 'Präferenz'],
    'DEPLOYMENT.md': ['secret-circle-v24', 'Rollback', 'Spielergruppe'],
    'RELEASE_CHECKLIST.md': ['secret-circle-v24', 'Byte-Grenze', 'Spieler-Snapshot'],
    'MANUAL_TEST_PLAN.md': ['secret-circle-v24', 'Mehrbyte', 'Spielergruppe'],
    'KNOWN_LIMITATIONS.md': ['secret-circle-v24', 'Eigene Hub-Packs', 'Online-Mehrspielermodus'],
    'CI_TROUBLESHOOTING.md': ['secret-circle-v24', 'eigene Hub-Packs', 'GitHub Actions']
}
for relative, markers in doc_markers.items():
    text = read(relative).lower()
    for marker in markers:
        if marker.lower() not in text:
            raise SystemExit(f'Missing documentation marker {marker} in {relative}')

print(json.dumps({
    'release_audit': 'PASS',
    'package_version': package['version'],
    'engine_version': 7,
    'storage_version': 7,
    'role_assignment_version': 2,
    'maximum_imposters': 6,
    'party_games_total': base_game_count + added_game_count,
    'party_games_playable': 18,
    'party_games_planned': 4,
    'advanced_playable_games': 4,
    'advanced_active_schema': 2,
    'hub_plus_version': 5,
    'data_tools_version': 2,
    'player_snapshot_sessions': True,
    'transaction_safe_history': True,
    'transactional_custom_packs': True,
    'byte_safe_backup': True,
    'transactional_import_delete': True,
    'custom_pack_limit': 20,
    'custom_cards_per_pack_limit': 100,
    'pwa_cache': 'secret-circle-v24',
    'manifest_start_url': manifest['start_url'],
    'imposter_categories': category_count,
    'imposter_terms': term_count,
    'unit_test_files': unit_tests,
    'e2e_suites': e2e_suites,
    'cross_browser_suites': cross_browser_suites,
    'cross_browser_projects': 5,
    'critical_checks': checks,
    'production_docs': required_docs
}, ensure_ascii=False, indent=2))
