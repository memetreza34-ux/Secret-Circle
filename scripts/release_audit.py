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
party_catalog = read('party-catalog.js')
party_hub = read('party-hub.js')
sw = read('sw.js')
index = read('index.html')
party = read('party.html')
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
    'create_and_next_wrapped': all(marker in roles for marker in ('engine.createGame', 'engine.nextRound')),
    'restore_and_assert_wrapped': all(marker in roles for marker in ('engine.restoreGame', 'engine.assertGame')),
    'party_catalog_18_games': party_catalog.count("status: 'playable'") == 14 and party_catalog.count("status: 'planned'") == 4,
    'party_hub_local_state': "secret-circle-party-hub-v1" in party_hub,
    'party_hub_search_filters': all(marker in party for marker in ('game-search', 'group-filter', 'mood-filter', 'player-filter', 'status-filter')),
    'party_hub_player_presets': all(marker in party for marker in ('hub-players', 'preset-name', 'preset-list')),
    'party_hub_play_layer': all(marker in party for marker in ('game-detail', 'play-layer', 'play-content', 'play-actions')),
    'planned_games_blocked': "game.status !== 'playable'" in party_hub,
    'pwa_cache_v19': "const CACHE='secret-circle-v19'" in sw,
    'party_hub_cached': all(asset in sw for asset in ('./party.html', './party.css', './party-catalog.js', './party-hub.js')),
    'all_protection_modules_cached': all(asset in sw for asset in (
        './runtime-guard.js', './setup-ux.js', './privacy-guard.js',
        './wake-lock.js', './role-assignment.js'
    )),
    'safe_cache_writes': 'await cache.put' in sw,
    'stable_manifest_scope': all(manifest.get(key) == './' for key in ('id', 'start_url', 'scope')),
    'standalone_pwa': manifest.get('display') == 'standalone',
    'german_manifest': manifest.get('lang') == 'de',
    'strict_csp_index': all(marker in index for marker in (
        "default-src 'self'", "script-src 'self'", "style-src 'self'",
        "object-src 'none'", "base-uri 'none'", "form-action 'self'"
    )),
    'strict_csp_party': all(marker in party for marker in (
        "default-src 'self'", "script-src 'self'", "style-src 'self'",
        "object-src 'none'", "base-uri 'none'", "form-action 'self'"
    )),
    'role_assignment_before_app': index.index('role-assignment.js') < index.index('app.js'),
    'hub_link_from_imposter': 'href="party.html"' in index,
    'imposter_link_from_hub': 'href="index.html"' in party,
    'party_unit_in_gate': 'tests/party-catalog.test.js' in package.get('scripts', {}).get('test', ''),
    'party_syntax_in_gate': all(marker in package.get('scripts', {}).get('check', '') for marker in ('party-catalog.js', 'party-hub.js')),
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

unit_tests = sorted(path.name for path in (ROOT / 'tests').glob('*.test.js'))
e2e_suites = sorted(path.name for path in (ROOT / 'tests' / 'e2e').glob('*.spec.js'))
cross_browser_suites = sorted(path.name for path in (ROOT / 'tests' / 'cross-browser').glob('*.spec.js'))
if len(unit_tests) < 6 or len(e2e_suites) < 15 or not cross_browser_suites:
    raise SystemExit('Automated test matrix is incomplete for the Party Hub.')
for required in ['role-assignment.test.js', 'party-catalog.test.js']:
    if required not in unit_tests:
        raise SystemExit(f'Critical unit test missing: {required}')
for required in ['role-assignment.spec.js', 'party-hub.spec.js', 'privacy-guard.spec.js', 'wake-lock.spec.js']:
    if required not in e2e_suites:
        raise SystemExit(f'Critical E2E suite missing: {required}')

required_docs = [
    'README.md', 'RELEASE_CHECKLIST.md', 'RELEASE_STATUS.md', 'CHANGELOG.md',
    'KNOWN_LIMITATIONS.md', 'SECURITY.md', 'MANUAL_TEST_PLAN.md',
    'CI_TROUBLESHOOTING.md', 'DEPLOYMENT.md', 'privacy.html'
]
for relative in required_docs:
    path = ROOT / relative
    if not path.is_file() or path.stat().st_size < 300:
        raise SystemExit(f'Missing or incomplete production document: {relative}')

for relative, markers in {
    'README.md': ['Party Hub', '14 spielbare', 'secret-circle-v19'],
    'RELEASE_STATUS.md': ['Party Hub', 'Cache-Version 19', 'Gesamte gewünschte Party-Hub-Vision'],
    'DEPLOYMENT.md': ['party.html', 'secret-circle-v19', 'Rollback'],
    'CHANGELOG.md': ['Party-Hub', 'vierzehn spielbare', 'secret-circle-v19'],
    'RELEASE_CHECKLIST.md': ['Realer Party-Betatest', 'GitHub Actions'],
    'CI_TROUBLESHOOTING.md': ['Fehler vor dem ersten Schritt', 'Abrechnung'],
    'MANUAL_TEST_PLAN.md': ['Android-Installation', 'iPhone-/iPad-Installation', 'Realer Partytest']
}.items():
    text = read(relative)
    for marker in markers:
        if marker.lower() not in text.lower():
            raise SystemExit(f'Missing documentation marker {marker} in {relative}')

print(json.dumps({
    'release_audit': 'PASS',
    'package_version': package['version'],
    'engine_version': 7,
    'storage_version': 7,
    'role_assignment_version': 2,
    'maximum_imposters': 6,
    'party_games_total': 18,
    'party_games_playable': 14,
    'party_games_planned': 4,
    'pwa_cache': 'secret-circle-v19',
    'imposter_categories': category_count,
    'imposter_terms': term_count,
    'unit_test_files': unit_tests,
    'e2e_suites': e2e_suites,
    'cross_browser_suites': cross_browser_suites,
    'cross_browser_projects': 5,
    'critical_checks': checks,
    'production_docs': required_docs
}, ensure_ascii=False, indent=2))
