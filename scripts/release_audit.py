#!/usr/bin/env python3
from pathlib import Path
import json
import re

ROOT = Path(__file__).resolve().parents[1]


def read(relative: str) -> str:
    return (ROOT / relative).read_text(encoding='utf-8')


def require(relative: str) -> str:
    path = ROOT / relative
    if not path.is_file():
        raise SystemExit(f'Release audit missing file: {relative}')
    return read(relative)


package = json.loads(require('package.json'))
manifest = json.loads(require('manifest.webmanifest'))
sw = require('sw.js')
runtime_guard = require('runtime-guard.js')
release_structure = require('party-release-structure.js')
release_styles = require('party-release.css')
registry = require('backup-schema-registry.js')
ledger = require('session-ledger.js')
legacy_guard = require('session-ledger-legacy-guard.js')
base_catalog = require('party-catalog.js')
expansion = require('party-expansion.js')
trending = require('party-trending-catalog.js')
mega = require('party-mega-catalog.js')
viral = require('party-viral-catalog.js')
routing = require('party-routing.js')
creator = require('game-creator.js')
creator_page = require('creator-page.js')
guide = require('party-guide.js')
quick_runtime = require('party-quick-modes.js')
mega_runtime = require('party-mega-modes.js')
viral_runtime = require('party-viral-modes.js')
created_runtime = require('party-created-modes.js')
loader = require('quick-loader.js')
custom_packs = require('party-custom-packs.js')
party_night = require('party-night.js')
workflow = require('.github/workflows/ci.yml')
cross_workflow = require('.github/workflows/cross-browser.yml')
backup_docs = require('BACKUP_SCHEMAS.md')
roadmap = require('ROADMAP_2027.md')
release_scope = require('RELEASE_SCOPE_2027.md')

install_handler_match = re.search(
    r"self\.addEventListener\('install',[\s\S]*?\n\}\);",
    sw,
)
install_handler = install_handler_match.group(0) if install_handler_match else ''

core_ids = re.search(r'const CORE_IDS = Object\.freeze\(\[(.*?)\]\);', release_structure, re.S)
lab_ids = re.search(r'const LAB_IDS = Object\.freeze\(\[(.*?)\]\);', release_structure, re.S)
core_count = len(re.findall(r"'[^']+'", core_ids.group(1))) if core_ids else 0
lab_count = len(re.findall(r"'[^']+'", lab_ids.group(1))) if lab_ids else 0
extended_count = 45 - core_count - lab_count

checks = {
    'package_version': package.get('version') == '1.0.0-beta.3',
    'node_baseline': package.get('engines', {}).get('node') == '>=20',
    'playwright_pinned': package.get('devDependencies', {}).get('@playwright/test') == '1.54.2',
    'manifest_party_hub': manifest.get('name') == 'Secret Circle – Party Hub' and manifest.get('start_url') == './party.html',
    'standalone_pwa': manifest.get('display') == 'standalone' and manifest.get('scope') == './',
    'cache_v30': "const CACHE='secret-circle-v30'" in sw,
    'staging_cache': "const STAGING_CACHE='secret-circle-v30-staging'" in sw,
    'install_waits_for_user': bool(install_handler) and 'skipWaiting' not in install_handler,
    'message_activates_update': "event.data?.type === 'SKIP_WAITING'" in sw,
    'non_destructive_cache_promotion': 'await caches.delete(CACHE)' not in sw and 'active.delete(request)' in sw,
    'visible_update_prompt': all(marker in runtime_guard for marker in (
        'Neue Secret-Circle-Version bereit', 'Jetzt aktualisieren', 'Später', "type: 'SKIP_WAITING'",
    )),
    'update_respects_active_sessions': 'hasActiveSession' in runtime_guard and 'activeSessionKeys' in runtime_guard,
    'release_tier_counts': (core_count, extended_count, lab_count) == (15, 13, 17),
    'release_tier_labels': all(marker in release_structure for marker in (
        "label: 'Kernspiel'", "label: 'Erweiterung'", "label: 'Labs'", 'release-tier-filter',
    )),
    'release_tier_runtime': all(marker in runtime_guard for marker in (
        'party-release-structure.js', 'party-release.css', 'loadPartyReleaseStructure',
    )),
    'release_tier_offline': all(marker in sw for marker in (
        './party-release-structure.js', './party-release.css',
    )),
    'release_tier_styles': all(marker in release_styles for marker in (
        '.release-tier-overview', '.release-tier-pill', 'focus-visible', 'prefers-reduced-motion',
    )),
    'backup_registry': all(marker in registry for marker in (
        "format: 'secret-circle-backup'",
        "format: 'secret-circle-complete-backup'",
        "format: 'secret-circle-created-games'",
        'const MAX_FILE_BYTES = 1_500_000;',
    )),
    'backup_contract_documented': all(marker in backup_docs for marker in (
        'word-imposter', 'complete', 'creator-library', 'Release-Gates',
    )),
    'creator_direct_exact_once': all(marker in created_runtime for marker in (
        'SecretCircleSessionLedger', "completionId('created'", 'recordCompletion(loadHub()',
    )),
    'quick_direct_exact_once': all(marker in quick_runtime for marker in (
        'SecretCircleSessionLedger', "completionId('quick'", 'recordCompletion(loadHub()',
    )),
    'mega_viral_exact_once_guard': all(marker in legacy_guard for marker in (
        'secret-circle-party-mega-active-v1', 'secret-circle-party-viral-active-v1',
        'completionId(definition.engine', 'recordCompletion(baseHub, completion)',
    )),
    'ledger_loaded_first': all(marker in loader for marker in (
        'session-ledger.js', 'session-ledger-legacy-guard.js', 'scriptPlan',
    )),
    'creator_offline': all(asset in sw for asset in (
        './creator.html', './game-creator.js', './creator-page.js', './creator.css', './party-created-modes.js',
    )),
    'foundation_runtime_offline': all(asset in sw for asset in (
        './pwa-update.css', './session-ledger.js', './session-ledger-legacy-guard.js',
    )),
    'all_fast_engines_offline': all(asset in sw for asset in (
        './party-trending-catalog.js', './party-mega-catalog.js', './party-viral-catalog.js',
        './party-quick-modes.js', './party-mega-modes.js', './party-viral-modes.js',
        './party-created-modes.js', './quick-loader.js',
    )),
    'trending_catalog_v3': 'version: 3' in trending and 'trendingGameIds' in trending,
    'mega_catalog_v4': 'version: 4' in mega and 'megaGameIds' in mega,
    'viral_catalog_v5': 'version: 5' in viral and 'viralGameIds' in viral,
    'routing_v8': 'version: 8' in routing and "CREATED_KEY = 'secret-circle-party-created-games-v1'" in routing,
    'creator_v1': all(marker in creator for marker in (
        "STORAGE_KEY = 'secret-circle-party-created-games-v1'", 'MAX_GAMES = 40', 'MAX_CARDS = 200', 'createStore',
    )),
    'creator_wizard': all(marker in creator_page for marker in (
        'renderTemplates', 'validateCurrentStep', 'renderLibrary', 'exportLibrary', 'importLibrary',
    )),
    'contextual_guidance': all(marker in guide for marker in (
        'addCreatorEntryPoints', 'addHowItWorks', 'addSectionHelp', 'enhanceGameCards',
    )),
    'quick_resume': all(marker in quick_runtime for marker in ('loadActive', 'saveActive', 'resumeSession', 'finishSession')),
    'mega_resume': all(marker in mega_runtime for marker in ('loadActive', 'saveActive', 'resumeSession', 'finishSession')),
    'viral_resume': all(marker in viral_runtime for marker in ('loadActive', 'saveActive', 'resumeSession', 'finishSession')),
    'custom_pack_v4': all(marker in custom_packs for marker in ('MAX_PACKS = 30', 'MAX_ITEMS = 150', 'version: 4')),
    'party_night_planner': all(marker in party_night for marker in ('buildPlan', 'syncPlanFromHistory', 'secret-circle-party-night-v1')),
    'main_ci': all(command in workflow for command in ('npm run check', 'npm test', 'npm run validate', 'npm run test:e2e')),
    'cross_browser_ci': all(marker in cross_workflow for marker in ('chromium firefox webkit', 'npm run test:cross-browser')),
    'foundation_audit_in_gate': 'scripts/foundation_contract_audit.py' in package.get('scripts', {}).get('validate', ''),
    'foundation_tests_in_gate': all(marker in package.get('scripts', {}).get('test', '') for marker in (
        'tests/party-release-structure.test.js', 'tests/backup-schema-registry.test.js',
        'tests/session-ledger.test.js', 'tests/session-ledger-legacy-guard.test.js',
        'tests/pwa-update.test.js',
    )),
    'release_dates_documented': all(marker in roadmap for marker in (
        '30. November 2026', '5. Dezember 2026', '15. Dezember 2026', '4.–15. Januar 2027',
    )),
    'quality_tiers_documented': all(marker in release_scope for marker in ('Stufe A', 'Stufe B', 'Stufe C', 'Labs')),
}

failed = [name for name, passed in checks.items() if not passed]
if failed:
    raise SystemExit(f'Release audit failed: {", ".join(failed)}')

base_games = len(re.findall(r"\bid:\s*'[^']+'", base_catalog.split('const content =', 1)[0]))
expansion_games = len(re.findall(r"\bid:\s*'[^']+'", expansion.split('const advancedContent =', 1)[0]))
trending_games = len(re.findall(r"\bid:\s*'[^']+'", trending.split('const quickContent =', 1)[0]))
mega_games = len(re.findall(r"\bid:\s*'[^']+'", mega.split('const megaContent =', 1)[0]))
viral_games = len(re.findall(r"\bid:\s*'[^']+'", viral.split('const viralContent =', 1)[0]))
if (base_games, expansion_games, trending_games, mega_games, viral_games) != (18, 4, 6, 9, 8):
    raise SystemExit(f'Unexpected catalog layers: {base_games}, {expansion_games}, {trending_games}, {mega_games}, {viral_games}.')

classic_ids = ['wavelength', 'draw-guess', 'rapid-fire', 'sound-imitation', 'forehead-guess', 'letter-categories', 'dont-laugh', 'hum-song', 'scavenger-hunt', 'caption-battle']
mega_ids = ['who-am-i', 'anime-guess', 'money-challenge', 'blind-ranking', 'emoji-quiz', 'pass-the-phone', 'red-green-flag', 'secret-mission', 'tier-list']
viral_ids = ['put-a-finger-down', 'guess-the-price', 'higher-lower', 'know-me-best', 'hear-me-out', 'hot-seat', 'story-chain', 'finish-the-sentence']
for game_id in classic_ids:
    if game_id not in trending:
        raise SystemExit(f'Classic Quick Mode missing: {game_id}')
for game_id in mega_ids:
    if game_id not in mega:
        raise SystemExit(f'Mega Mode missing: {game_id}')
for game_id in viral_ids:
    if game_id not in viral:
        raise SystemExit(f'Viral Mode missing: {game_id}')

unit_tests = sorted(path.name for path in (ROOT / 'tests').glob('*.test.js'))
e2e_suites = sorted(path.name for path in (ROOT / 'tests' / 'e2e').glob('*.spec.js'))
cross_suites = sorted(path.name for path in (ROOT / 'tests' / 'cross-browser').glob('*.spec.js'))
if len(unit_tests) < 18 or len(e2e_suites) < 28 or not cross_suites:
    raise SystemExit('Release test matrix is incomplete.')
for required_test in (
    'party-release-structure.test.js', 'backup-schema-registry.test.js',
    'session-ledger.test.js', 'session-ledger-legacy-guard.test.js',
    'session-ledger-integration.test.js', 'service-worker.test.js', 'pwa-update.test.js',
):
    if required_test not in unit_tests:
        raise SystemExit(f'Critical unit test missing: {required_test}')
for required_test in (
    'game-creator.spec.js', 'creator-runner-resilience.spec.js',
    'party-viral-resilience.spec.js', 'party-viral-modes.spec.js', 'offline.spec.js',
):
    if required_test not in e2e_suites:
        raise SystemExit(f'Critical E2E test missing: {required_test}')

required_docs = (
    'README.md', 'ARCHITECTURE.md', 'BACKUP_SCHEMAS.md', 'MODE_UNIVERSE.md',
    'TREND_FORMATS.md', 'ASSET_PLAN.md', 'RELEASE_SCOPE_2027.md', 'ROADMAP_2027.md',
    'RELEASE_CHECKLIST.md', 'RELEASE_STATUS.md', 'CHANGELOG.md', 'KNOWN_LIMITATIONS.md',
    'SECURITY.md', 'MANUAL_TEST_PLAN.md', 'CI_TROUBLESHOOTING.md', 'DEPLOYMENT.md', 'privacy.html',
)
for relative in required_docs:
    if (ROOT / relative).stat().st_size < 300:
        raise SystemExit(f'Missing or incomplete release document: {relative}')

for forbidden in ('eval(', 'new Function(', 'document.write(', 'http://'):
    for relative in (
        'backup-schema-registry.js', 'session-ledger.js', 'session-ledger-legacy-guard.js',
        'party-release-structure.js', 'runtime-guard.js', 'party-routing.js',
        'game-creator.js', 'creator-page.js', 'party-quick-modes.js',
        'party-mega-modes.js', 'party-viral-modes.js', 'party-created-modes.js',
        'quick-loader.js', 'party-hub.js',
    ):
        if forbidden in read(relative):
            raise SystemExit(f'Forbidden release pattern {forbidden} in {relative}')

print(json.dumps({
    'release_audit': 'PASS',
    'package_version': package['version'],
    'pwa_cache': 'secret-circle-v30',
    'staged_pwa_updates': True,
    'non_destructive_cache_promotion': True,
    'visible_builtin_games': base_games + expansion_games + trending_games + mega_games + viral_games,
    'release_tiers': {'core': core_count, 'extended': extended_count, 'labs': lab_count},
    'playable_builtin_games': 45,
    'maximum_local_created_games': 40,
    'backup_schemas': 3,
    'exact_once_engine_families': 4,
    'classic_quick_modes': len(classic_ids),
    'mega_modes': len(mega_ids),
    'viral_modes': len(viral_ids),
    'unit_test_files': len(unit_tests),
    'e2e_suites': len(e2e_suites),
    'cross_browser_projects': len(cross_suites),
    'public_release': 'NO_GO until CI, device, party, content and legal gates pass',
    'critical_checks': checks,
}, ensure_ascii=False, indent=2))
