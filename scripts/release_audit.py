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
filter_state = require('party-filter-state.js')
search_assist = require('party-search-assist.js')
release_styles = require('party-release.css')
search_styles = require('party-search.css')
quick_styles = require('party-quick.css')
registry = require('backup-schema-registry.js')
ledger = require('session-ledger.js')
session_controls = require('party-session-controls.js')
party_page = require('party.html')
quick_play = require('quick-play.html')
base_catalog = require('party-catalog.js')
expansion = require('party-expansion.js')
trending = require('party-trending-catalog.js')
mega = require('party-mega-catalog.js')
viral = require('party-viral-catalog.js')
routing = require('party-routing.js')
creator = require('game-creator.js')
creator_page = require('creator-page.js')
guide = require('party-guide.js')
hub_runtime = require('party-hub.js')
hub_timers = require('party-hub-timers.js')
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

for obsolete in ('session-ledger-legacy-guard.js', 'tests/session-ledger-legacy-guard.test.js'):
    if (ROOT / obsolete).exists():
        raise SystemExit(f'Obsolete legacy guard still exists: {obsolete}')

install_handler_match = re.search(r"self\.addEventListener\('install',[\s\S]*?\n\}\);", sw)
install_handler = install_handler_match.group(0) if install_handler_match else ''
core_ids = re.search(r'const CORE_IDS = Object\.freeze\(\[(.*?)\]\);', release_structure, re.S)
lab_ids = re.search(r'const LAB_IDS = Object\.freeze\(\[(.*?)\]\);', release_structure, re.S)
core_count = len(re.findall(r"'[^']+'", core_ids.group(1))) if core_ids else 0
lab_count = len(re.findall(r"'[^']+'", lab_ids.group(1))) if lab_ids else 0
extended_count = 45 - core_count - lab_count


def direct_engine(source: str, engine: str) -> bool:
    markers = (
        'SecretCircleSessionLedger', 'SecretCircleSessionControls', 'S.createController',
        'sessionControls.countdown', 'sessionControls.stopTimer', 'onSkip:',
        'onAbort: abortSession', 'onReplay: replaySession', f"completionId('{engine}'",
        'recordCompletion(loadHub()', 'sessionId: L.createSessionId', 'legacySessionId',
        'if (result.recorded && !saveHub(result.hub)) return', 'active = final;',
    )
    return all(marker in source for marker in markers) \
        and 'let timerId = null' not in source \
        and 'const deadline = Date.now() + seconds * 1000' not in source


def hub_engine(runtime: str, timers: str) -> bool:
    runtime_markers = (
        'SecretCircleSessionLedger', 'SecretCircleSessionControls', 'SecretCirclePartyHubTimers',
        'S.createController', 'T.createTimerGames', 'timerGames.renderStoredTimerSession',
        "completionId('hub'", 'recordCompletion(state,', 'sessionId: L.createSessionId',
        "ACTIVE_KEY = 'secret-circle-party-hub-active-v1'", 'ACTIVE_VERSION = 1',
        'normalizeActiveSession', 'persistActiveSession', 'loadActiveSession', 'clearActiveSession',
        'players: [...state.players]', 'Session fortsetzen', 'Gespeicherten Stand verwerfen',
        'Geheime Inhalte werden nach einem Reload nicht automatisch geöffnet',
        "document.addEventListener('visibilitychange'", "window.addEventListener('pagehide'",
        'setHubPaused(true)', 'skipHubRound', 'abortSession',
    )
    timer_markers = (
        "TIMER_KINDS = new Set(['charades', 'taboo', 'hot-potato', 'word-chain'])",
        'normalizeTimerState', 'createTimerGames',
        "kind: 'charades', phase: 'running', remainingMs",
        "kind: 'taboo', phase: 'running', remainingMs",
        "kind: 'hot-potato', phase: 'running', remainingMs",
        "kind: 'word-chain', phase: 'running', remainingMs",
        'hubTimer.countdown(remainingMs / 1000, timer, finishCharadesTimer)',
        'hubTimer.countdown(remainingMs / 1000, timer, finishTabooTimer)',
        'hubTimer.countdown(remainingMs / 1000, hiddenClock, finishHotPotatoTimer)',
        'hubTimer.countdown(remainingMs / 1000, timer, finishWordChainTimer)',
        'renderStoredTimerSession',
    )
    forbidden = ('activeTimer', 'window.setInterval(', 'performance.now()')
    return all(marker in runtime for marker in runtime_markers) \
        and all(marker in timers for marker in timer_markers) \
        and all(marker not in source for source in (runtime, timers) for marker in forbidden)


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
    'update_respects_active_sessions': all(marker in runtime_guard for marker in (
        'hasActiveSession', 'ACTIVE_SESSION_KEYS', 'secret-circle-party-hub-active-v1',
        'secret-circle-party-active-v1',
    )),
    'release_tier_counts': (core_count, extended_count, lab_count) == (15, 13, 17),
    'combined_age_tier_filter': all(marker in release_structure for marker in ('ageAllows', 'selectedTier', 'selectedAge', 'tierMatches', 'ageMatches')),
    'persistent_filter_contract': all(marker in filter_state for marker in (
        "STORAGE_KEY = 'secret-circle-party-catalog-filters-v1'", 'resolveView',
        'Filter zurücksetzen', 'optionExists', 'FIXED_VALUES',
    )),
    'search_assist_contract': all(marker in search_assist for marker in (
        'MANUAL_ALIASES', 'normalizeText', 'levenshtein', 'suggestions',
        'aria-autocomplete', 'listbox', 'ArrowDown', 'Escape',
    )),
    'backup_registry': all(marker in registry for marker in (
        "format: 'secret-circle-backup'", "format: 'secret-circle-complete-backup'",
        "format: 'secret-circle-created-games'", 'const MAX_FILE_BYTES = 1_500_000;',
    )),
    'backup_contract_documented': all(marker in backup_docs for marker in ('word-imposter', 'complete', 'creator-library', 'Release-Gates')),
    'ledger_versioned': 'const VERSION = 1;' in ledger,
    'session_controls_versioned': 'const VERSION = 1;' in session_controls,
    'session_controls_contract': all(marker in session_controls for marker in (
        'formatMilliseconds', 'orderedGameIds', 'nextGameId', 'nextGameHref',
        'createController', 'function countdown', 'function setPaused',
        'function setSessionActive', 'remainingMilliseconds',
    )),
    'session_controls_surface': all(marker in quick_play for marker in (
        'id="quick-session-controls"', 'id="quick-pause"', 'id="quick-skip"',
        'id="quick-exit"', 'id="quick-replay"', 'id="quick-next-game"', 'id="quick-pause-overlay"',
    )),
    'hub_controls_surface': all(marker in party_page for marker in (
        'id="finish-hub-game"', 'id="skip-hub-round"', 'id="pause-hub-game"',
        'id="abort-hub-game"', 'id="play-pause-status"',
        '<script src="session-ledger.js"></script>', '<script src="party-session-controls.js"></script>',
        '<script src="party-hub-timers.js"></script>', '<script src="party-hub.js"></script>',
    )),
    'hub_split_load_order': party_page.index('party-session-controls.js') < party_page.index('party-hub-timers.js') < party_page.index('party-hub.js'),
    'session_controls_styles': all(marker in quick_styles for marker in (
        '.session-control-bar', '.session-pause-overlay', '.quick-play.is-paused',
        '@media(max-width:680px)', '@media(prefers-reduced-motion:reduce)',
    )),
    'hub_direct_exact_once_pausable_resumable': hub_engine(hub_runtime, hub_timers),
    'creator_direct_exact_once': direct_engine(created_runtime, 'created'),
    'quick_direct_exact_once': direct_engine(quick_runtime, 'quick'),
    'mega_direct_exact_once': direct_engine(mega_runtime, 'mega'),
    'viral_direct_exact_once': direct_engine(viral_runtime, 'viral'),
    'legacy_guard_removed': all('session-ledger-legacy-guard' not in source for source in (
        loader, sw, package.get('scripts', {}).get('test', ''), package.get('scripts', {}).get('check', ''),
    )),
    'shared_runtime_loaded_first': all(marker in loader for marker in (
        'session-ledger.js', 'party-session-controls.js', 'SecretCircleSessionLedger',
        'SecretCircleSessionControls', 'scriptPlan',
    )),
    'foundation_runtime_offline': all(asset in sw for asset in (
        './pwa-update.css', './session-ledger.js', './party-session-controls.js',
        './party-hub-timers.js', './party-search-assist.js', './party-search.css',
    )),
    'release_runtime_offline': all(asset in sw for asset in (
        './party-release-structure.js', './party-filter-state.js', './party-search-assist.js',
        './party-release.css', './party-search.css',
    )),
    'release_styles': all(marker in release_styles for marker in (
        '.release-tier-overview', '.release-tier-pill', '.filter-reset-button',
        'focus-visible', 'prefers-reduced-motion',
    )) and all(marker in search_styles for marker in ('.party-search-suggestions', 'focus-visible', 'prefers-reduced-motion')),
    'creator_offline': all(asset in sw for asset in ('./creator.html', './game-creator.js', './creator-page.js', './creator.css', './party-created-modes.js')),
    'all_fast_engines_offline': all(asset in sw for asset in (
        './party-trending-catalog.js', './party-mega-catalog.js', './party-viral-catalog.js',
        './party-quick-modes.js', './party-mega-modes.js', './party-viral-modes.js', './party-created-modes.js', './quick-loader.js',
    )),
    'catalog_versions': 'version: 3' in trending and 'version: 4' in mega and 'version: 5' in viral and 'version: 8' in routing,
    'creator_contract': all(marker in creator for marker in ("STORAGE_KEY = 'secret-circle-party-created-games-v1'", 'MAX_GAMES = 40', 'MAX_CARDS = 200', 'createStore')),
    'creator_wizard': all(marker in creator_page for marker in ('renderTemplates', 'validateCurrentStep', 'renderLibrary', 'exportLibrary', 'importLibrary')),
    'contextual_guidance': all(marker in guide for marker in ('addCreatorEntryPoints', 'addHowItWorks', 'addSectionHelp', 'enhanceGameCards')),
    'custom_pack_v4': all(marker in custom_packs for marker in ('MAX_PACKS = 30', 'MAX_ITEMS = 150', 'version: 4')),
    'party_night_planner': all(marker in party_night for marker in ('buildPlan', 'syncPlanFromHistory', 'secret-circle-party-night-v1')),
    'main_ci': all(command in workflow for command in ('npm run check', 'npm test', 'npm run validate', 'npm run test:e2e')),
    'cross_browser_ci': all(marker in cross_workflow for marker in ('chromium firefox webkit', 'npm run test:cross-browser')),
    'foundation_audit_in_gate': 'scripts/foundation_contract_audit.py' in package.get('scripts', {}).get('validate', ''),
    'hub_control_audit_in_gate': 'scripts/hub_control_audit.py' in package.get('scripts', {}).get('validate', ''),
    'foundation_tests_in_gate': all(marker in package.get('scripts', {}).get('test', '') for marker in (
        'tests/party-release-structure.test.js', 'tests/core-game-contract.test.js',
        'tests/hub-timer-contract.test.js', 'tests/hub-resume-contract.test.js',
        'tests/hub-control-contract.test.js', 'tests/mafia-rules.test.js',
        'tests/advanced-resume-contract.test.js', 'tests/party-filter-state.test.js',
        'tests/party-search-assist.test.js', 'tests/backup-schema-registry.test.js',
        'tests/session-ledger.test.js', 'tests/party-session-controls.test.js',
        'tests/session-ledger-integration.test.js', 'tests/pwa-update.test.js',
    )),
    'split_hub_syntax_gate': 'node --check party-hub-timers.js' in package.get('scripts', {}).get('check', ''),
    'release_dates_documented': all(marker in roadmap for marker in ('30. November 2026', '5. Dezember 2026', '15. Dezember 2026', '4.–15. Januar 2027')),
    'shared_controls_documented': '[x] Überspringen, Pause, Abbruch, Wiederholen und nächstes Spiel' in roadmap,
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
if len(unit_tests) < 24 or len(e2e_suites) < 40 or not cross_suites:
    raise SystemExit('Release test matrix is incomplete.')
for required_test in (
    'party-release-structure.test.js', 'core-game-contract.test.js', 'hub-timer-contract.test.js',
    'hub-resume-contract.test.js', 'hub-control-contract.test.js', 'mafia-rules.test.js',
    'advanced-resume-contract.test.js', 'party-filter-state.test.js', 'party-search-assist.test.js',
    'backup-schema-registry.test.js', 'session-ledger.test.js', 'party-session-controls.test.js',
    'session-ledger-integration.test.js', 'service-worker.test.js', 'pwa-update.test.js',
):
    if required_test not in unit_tests:
        raise SystemExit(f'Critical unit test missing: {required_test}')
for required_test in (
    'core-game-catalog.spec.js', 'core-hub-statistics.spec.js', 'core-hub-timers.spec.js',
    'core-hub-resume.spec.js', 'core-hub-controls.spec.js', 'taboo-timer.spec.js',
    'advanced-core-smoke.spec.js', 'advanced-core-abort.spec.js',
    'advanced-secret-resume.spec.js', 'advanced-core-round-flow.spec.js',
    'advanced-completion-exact-once.spec.js', 'mafia-extended.spec.js',
    'party-filter-state.spec.js', 'party-search-assist.spec.js', 'party-session-controls.spec.js',
    'game-creator.spec.js', 'creator-runner-resilience.spec.js', 'party-viral-resilience.spec.js',
    'party-viral-modes.spec.js', 'offline.spec.js',
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
        'backup-schema-registry.js', 'session-ledger.js', 'party-session-controls.js',
        'party-release-structure.js', 'party-filter-state.js', 'party-search-assist.js',
        'runtime-guard.js', 'party-routing.js', 'game-creator.js', 'creator-page.js',
        'party-quick-modes.js', 'party-mega-modes.js', 'party-viral-modes.js',
        'party-created-modes.js', 'quick-loader.js', 'party-hub-timers.js', 'party-hub.js',
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
    'exact_once_engine_families': 5,
    'legacy_guard_removed': True,
    'search_assistance': True,
    'shared_session_controls': True,
    'split_direct_hub_timer_module': True,
    'pausable_fast_engine_timers': True,
    'pausable_core_hub_timers': True,
    'direct_hub_reload_resume': True,
    'classic_quick_modes': len(classic_ids),
    'mega_modes': len(mega_ids),
    'viral_modes': len(viral_ids),
    'unit_test_files': len(unit_tests),
    'e2e_suites': len(e2e_suites),
    'cross_browser_projects': len(cross_suites),
    'public_release': 'NO_GO until CI, device, party, content and legal gates pass',
    'critical_checks': checks,
}, ensure_ascii=False, indent=2))
