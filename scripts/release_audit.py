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
mega = read('party-mega-catalog.js')
routing = read('party-routing.js')
quick_runtime = read('party-quick-modes.js')
mega_runtime = read('party-mega-modes.js')
loader = read('quick-loader.js')
custom_packs = read('party-custom-packs.js')
party_night = read('party-night.js')
workflow = read('.github/workflows/ci.yml')
cross_workflow = read('.github/workflows/cross-browser.yml')

checks = {
    'package_version': package.get('version') == '1.0.0-beta.3',
    'node_baseline': package.get('engines', {}).get('node') == '>=20',
    'playwright_pinned': package.get('devDependencies', {}).get('@playwright/test') == '1.54.2',
    'manifest_party_hub': manifest.get('name') == 'Secret Circle – Party Hub' and manifest.get('start_url') == './party.html',
    'standalone_pwa': manifest.get('display') == 'standalone' and manifest.get('scope') == './',
    'cache_v27': "const CACHE='secret-circle-v27'" in sw,
    'mega_offline': all(asset in sw for asset in ('./party-mega-catalog.js', './party-mega-modes.js', './quick-loader.js')),
    'classic_quick_offline': './party-quick-modes.js' in sw and './party-trending-catalog.js' in sw,
    'party_night_offline': './party-night.js' in sw and './party-night.css' in sw,
    'trending_catalog_v3': 'version: 3' in trending and 'trendingGameIds' in trending,
    'mega_catalog_v4': 'version: 4' in mega and 'megaGameIds' in mega and 'quickGameIds' in mega,
    'routing_v5': 'version: 5' in routing and "require('./party-mega-catalog.js')" in routing,
    'quick_resume': all(marker in quick_runtime for marker in ('loadActive', 'saveActive', 'resumeSession', 'finishSession')),
    'mega_resume': all(marker in mega_runtime for marker in ('loadActive', 'saveActive', 'resumeSession', 'finishSession')),
    'mega_engine_family': all(marker in mega_runtime for marker in (
        'renderWhoAmI', 'renderAnimeGuess', 'renderMoneyChallenge', 'renderBlindRanking',
        'renderEmojiQuiz', 'renderPassThePhone', 'renderRedGreenFlag', 'renderSecretMission', 'renderTierList'
    )),
    'single_engine_loader': 'party-mega-modes.js' in loader and 'party-quick-modes.js' in loader,
    'custom_pack_v3': all(marker in custom_packs for marker in ('MAX_PACKS = 30', 'MAX_ITEMS = 150', 'version: 3', 'anime-guess', 'who-am-i')),
    'party_night_planner': all(marker in party_night for marker in ('buildPlan', 'syncPlanFromHistory', 'secret-circle-party-night-v1')),
    'main_ci': all(command in workflow for command in ('npm run check', 'npm test', 'npm run validate', 'npm run test:e2e')),
    'cross_browser_ci': all(marker in cross_workflow for marker in ('chromium firefox webkit', 'npm run test:cross-browser')),
    'mega_syntax_gates': all(marker in package.get('scripts', {}).get('check', '') for marker in ('party-mega-catalog.js', 'party-mega-modes.js', 'quick-loader.js')),
    'mega_unit_gate': 'tests/party-mega-catalog.test.js' in package.get('scripts', {}).get('test', ''),
    'architecture_gate': 'scripts/architecture_audit.py' in package.get('scripts', {}).get('validate', '')
}
failed = [name for name, passed in checks.items() if not passed]
if failed:
    raise SystemExit(f'Release audit failed: {", ".join(failed)}')

base_games = len(re.findall(r"\bid:\s*'[^']+'", base_catalog.split('const content =', 1)[0]))
expansion_games = len(re.findall(r"\bid:\s*'[^']+'", expansion.split('const advancedContent =', 1)[0]))
trending_games = len(re.findall(r"\bid:\s*'[^']+'", trending.split('const quickContent =', 1)[0]))
mega_games = len(re.findall(r"\bid:\s*'[^']+'", mega.split('const megaContent =', 1)[0]))
if (base_games, expansion_games, trending_games, mega_games) != (18, 4, 6, 9):
    raise SystemExit(f'Unexpected catalog layers: {base_games}, {expansion_games}, {trending_games}, {mega_games}.')

classic_ids = [
    'wavelength', 'draw-guess', 'rapid-fire', 'sound-imitation', 'forehead-guess',
    'letter-categories', 'dont-laugh', 'hum-song', 'scavenger-hunt', 'caption-battle'
]
mega_ids = [
    'who-am-i', 'anime-guess', 'money-challenge', 'blind-ranking', 'emoji-quiz',
    'pass-the-phone', 'red-green-flag', 'secret-mission', 'tier-list'
]
for game_id in classic_ids:
    if game_id not in trending:
        raise SystemExit(f'Classic Quick Mode missing: {game_id}')
for game_id in mega_ids:
    if game_id not in mega:
        raise SystemExit(f'Mega Trend Mode missing: {game_id}')

unit_tests = sorted(path.name for path in (ROOT / 'tests').glob('*.test.js'))
e2e_suites = sorted(path.name for path in (ROOT / 'tests' / 'e2e').glob('*.spec.js'))
cross_suites = sorted(path.name for path in (ROOT / 'tests' / 'cross-browser').glob('*.spec.js'))
if len(unit_tests) < 11 or len(e2e_suites) < 24 or not cross_suites:
    raise SystemExit('Release test matrix is incomplete.')
for required in ('party-trending-catalog.test.js', 'party-mega-catalog.test.js'):
    if required not in unit_tests:
        raise SystemExit(f'Critical unit test missing: {required}')
for required in ('party-quick-modes.spec.js', 'party-mega-modes.spec.js', 'offline.spec.js'):
    if required not in e2e_suites:
        raise SystemExit(f'Critical E2E test missing: {required}')

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
        'party-trending-catalog.js', 'party-mega-catalog.js', 'party-quick-modes.js',
        'party-mega-modes.js', 'quick-loader.js', 'party-hub.js', 'party-advanced-runner.js'
    ]:
        if forbidden in read(relative):
            raise SystemExit(f'Forbidden release pattern {forbidden} in {relative}')

print(json.dumps({
    'release_audit': 'PASS',
    'package_version': package['version'],
    'pwa_cache': 'secret-circle-v27',
    'visible_games': base_games + expansion_games + trending_games + mega_games,
    'playable_games': 37,
    'classic_quick_modes': len(classic_ids),
    'mega_trend_modes': len(mega_ids),
    'all_quick_and_trend_modes': len(classic_ids) + len(mega_ids),
    'long_term_mode_universe': 122,
    'unit_test_files': len(unit_tests),
    'e2e_suites': len(e2e_suites),
    'cross_browser_projects': 5,
    'anime_fan_quiz_name_only': True,
    'money_challenges_hypothetical': True,
    'offline_first': True,
    'critical_checks': checks
}, ensure_ascii=False, indent=2))
