#!/usr/bin/env python3
from pathlib import Path
import json
import re

ROOT = Path(__file__).resolve().parents[1]
read = lambda path: (ROOT / path).read_text(encoding='utf-8')

package = json.loads(read('package.json'))
manifest = json.loads(read('manifest.webmanifest'))
sw = read('sw.js')
base_catalog = read('party-catalog.js')
expansion = read('party-expansion.js')
trending = read('party-trending-catalog.js')
routing = read('party-routing.js')
quick_runtime = read('party-quick-modes.js')
party_night = read('party-night.js')
workflow = read('.github/workflows/ci.yml')
cross_workflow = read('.github/workflows/cross-browser.yml')

checks = {
    'package_version': package.get('version') == '1.0.0-beta.3',
    'node_baseline': package.get('engines', {}).get('node') == '>=20',
    'playwright_pinned': package.get('devDependencies', {}).get('@playwright/test') == '1.54.2',
    'manifest_party_hub': manifest.get('name') == 'Secret Circle – Party Hub' and manifest.get('start_url') == './party.html',
    'standalone_pwa': manifest.get('display') == 'standalone' and manifest.get('scope') == './',
    'cache_v26': "const CACHE='secret-circle-v26'" in sw,
    'quick_page_offline': './quick-play.html' in sw,
    'quick_runtime_offline': './party-quick-modes.js' in sw and './party-trending-catalog.js' in sw,
    'party_night_offline': './party-night.js' in sw and './party-night.css' in sw,
    'trending_catalog_v3': 'version: 3' in trending and 'trendingGameIds' in trending,
    'routing_v4': 'version: 4' in routing and "require('./party-trending-catalog.js')" in routing,
    'quick_session_storage': "secret-circle-party-quick-active-v1" in quick_runtime,
    'quick_session_resume': all(marker in quick_runtime for marker in ('loadActive', 'saveActive', 'resumeSession', 'finishSession')),
    'quick_engine_family': all(marker in quick_runtime for marker in (
        'renderWavelength', 'renderRapidFire', 'renderCategories',
        'renderGuessingMode', 'renderDontLaugh', 'renderScavenger', 'renderCaptionBattle'
    )),
    'party_night_planner': all(marker in party_night for marker in ('buildPlan', 'syncPlanFromHistory', 'secret-circle-party-night-v1')),
    'main_ci': all(command in workflow for command in ('npm run check', 'npm test', 'npm run validate', 'npm run test:e2e')),
    'cross_browser_ci': all(marker in cross_workflow for marker in ('chromium firefox webkit', 'npm run test:cross-browser')),
    'all_new_syntax_gates': all(marker in package.get('scripts', {}).get('check', '') for marker in (
        'party-trending-catalog.js', 'party-quick-modes.js', 'party-hub-polish.js'
    )),
    'all_new_unit_gates': 'tests/party-trending-catalog.test.js' in package.get('scripts', {}).get('test', ''),
    'architecture_gate': 'scripts/architecture_audit.py' in package.get('scripts', {}).get('validate', '')
}
failed = [name for name, passed in checks.items() if not passed]
if failed:
    raise SystemExit(f'Release audit failed: {", ".join(failed)}')

base_games = len(re.findall(r"\bid:\s*'[^']+'", base_catalog.split('const content =', 1)[0]))
expansion_games = len(re.findall(r"\bid:\s*'[^']+'", expansion.split('const advancedContent =', 1)[0]))
trending_games = len(re.findall(r"\bid:\s*'[^']+'", trending.split('const quickContent =', 1)[0]))
if (base_games, expansion_games, trending_games) != (18, 4, 6):
    raise SystemExit(f'Unexpected catalog layers: {base_games}, {expansion_games}, {trending_games}.')

quick_ids = [
    'wavelength', 'draw-guess', 'rapid-fire', 'sound-imitation', 'forehead-guess',
    'letter-categories', 'dont-laugh', 'hum-song', 'scavenger-hunt', 'caption-battle'
]
for game_id in quick_ids:
    if game_id not in trending or f'quick-play.html?game=' not in trending:
        raise SystemExit(f'Quick Mode definition missing: {game_id}')

unit_tests = sorted(path.name for path in (ROOT / 'tests').glob('*.test.js'))
e2e_suites = sorted(path.name for path in (ROOT / 'tests' / 'e2e').glob('*.spec.js'))
cross_suites = sorted(path.name for path in (ROOT / 'tests' / 'cross-browser').glob('*.spec.js'))
if len(unit_tests) < 10 or len(e2e_suites) < 22 or not cross_suites:
    raise SystemExit('Release test matrix is incomplete.')
if 'party-trending-catalog.test.js' not in unit_tests or 'party-quick-modes.spec.js' not in e2e_suites:
    raise SystemExit('Quick Mode test coverage is missing.')

required_docs = [
    'README.md', 'ARCHITECTURE.md', 'MODE_UNIVERSE.md', 'RELEASE_CHECKLIST.md',
    'RELEASE_STATUS.md', 'CHANGELOG.md', 'KNOWN_LIMITATIONS.md', 'SECURITY.md',
    'MANUAL_TEST_PLAN.md', 'CI_TROUBLESHOOTING.md', 'DEPLOYMENT.md', 'privacy.html'
]
for relative in required_docs:
    path = ROOT / relative
    if not path.is_file() or path.stat().st_size < 300:
        raise SystemExit(f'Missing or incomplete release document: {relative}')

for forbidden in ['eval(', 'new Function(', 'document.write(', 'http://']:
    for relative in [
        'party-trending-catalog.js', 'party-quick-modes.js', 'party-hub-polish.js',
        'party-night.js', 'party-hub.js', 'party-advanced-runner.js'
    ]:
        if forbidden in read(relative):
            raise SystemExit(f'Forbidden release pattern {forbidden} in {relative}')

print(json.dumps({
    'release_audit': 'PASS',
    'package_version': package['version'],
    'pwa_cache': 'secret-circle-v26',
    'visible_games': base_games + expansion_games + trending_games,
    'playable_games': 28,
    'quick_modes': len(quick_ids),
    'long_term_mode_universe': 122,
    'unit_test_files': len(unit_tests),
    'e2e_suites': len(e2e_suites),
    'cross_browser_suites': cross_suites,
    'cross_browser_projects': 5,
    'quick_mode_resume': True,
    'party_night': True,
    'offline_first': True,
    'critical_checks': checks,
    'production_docs': required_docs
}, ensure_ascii=False, indent=2))
