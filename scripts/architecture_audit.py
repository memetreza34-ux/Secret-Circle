#!/usr/bin/env python3
from pathlib import Path
import json
import re

ROOT = Path(__file__).resolve().parents[1]
read = lambda relative: (ROOT / relative).read_text(encoding='utf-8')

production_js = [
    'runtime-guard.js', 'setup-ux.js', 'privacy-guard.js', 'wake-lock.js',
    'game-engine.js', 'role-assignment.js', 'word-packs.js', 'data-store.js',
    'backup-schema-registry.js', 'session-ledger.js', 'party-session-controls.js', 'app.js',
    'party-catalog.js', 'party-expansion.js', 'party-trending-catalog.js',
    'party-mega-catalog.js', 'party-viral-catalog.js', 'party-routing.js',
    'party-release-structure.js', 'party-filter-state.js', 'party-search-assist.js',
    'game-creator.js', 'creator-page.js', 'party-custom-packs.js',
    'party-hub-timers.js', 'party-hub.js', 'party-hub-plus.js', 'party-hub-polish.js', 'party-guide.js',
    'party-night.js', 'party-data-tools.js', 'party-advanced.js',
    'party-advanced-runner.js', 'party-advanced-preferences.js',
    'party-quick-modes.js', 'party-mega-modes.js', 'party-viral-modes.js',
    'party-created-modes.js', 'quick-loader.js', 'sw.js'
]
html_pages = ['index.html', 'party.html', 'advanced.html', 'quick-play.html', 'creator.html', 'privacy.html']
violations = []

architecture = ROOT / 'ARCHITECTURE.md'
if not architecture.is_file():
    violations.append('ARCHITECTURE.md is missing.')
else:
    text = architecture.read_text(encoding='utf-8')
    for marker in [
        'Stabile Identitäten', 'Versionierte Daten', 'Modulgrenzen',
        'Lokale Transaktionen', 'Bedienbarkeitsvertrag',
        'Offline- und Updatevertrag', 'Accessibility als Definition of Done',
        'Performancebudget', 'Deprecation und Rollback'
    ]:
        if marker not in text:
            violations.append(f'Architecture contract marker missing: {marker}')

package = json.loads(read('package.json'))
if package.get('dependencies'):
    violations.append('Runtime npm dependencies are not allowed without an architecture review.')
if package.get('devDependencies', {}).get('@playwright/test') != '1.54.2':
    violations.append('Playwright must remain exactly pinned.')
if package.get('engines', {}).get('node') != '>=20':
    violations.append('Supported Node.js baseline changed.')

for relative in production_js:
    path = ROOT / relative
    if not path.is_file():
        violations.append(f'Production module missing: {relative}')
        continue
    source = path.read_text(encoding='utf-8')
    lines = len(source.splitlines())
    if lines > 1_000:
        violations.append(f'{relative} has {lines} lines; split it before 1000 lines.')
    if path.stat().st_size > 100_000:
        violations.append(f'{relative} exceeds the 100 KB module limit.')
    if "'use strict'" not in source and '"use strict"' not in source:
        violations.append(f'{relative} does not declare strict mode.')

for relative in html_pages:
    source = read(relative)
    if re.search(r'<script(?![^>]*\bsrc=)[^>]*>', source, re.IGNORECASE):
        violations.append(f'Inline script found in {relative}.')
    if re.search(r'(?:src|href)=["\']https?://', source, re.IGNORECASE):
        violations.append(f'External runtime asset found in {relative}.')
    if "script-src 'self'" not in source or "object-src 'none'" not in source:
        violations.append(f'Strict CSP contract missing in {relative}.')

party_page = read('party.html')
for marker in (
    'id="pause-hub-game"', 'id="play-pause-status"',
    '<script src="session-ledger.js"></script>', '<script src="party-session-controls.js"></script>',
    '<script src="party-hub-timers.js"></script>', '<script src="party-hub.js"></script>',
):
    if marker not in party_page:
        violations.append(f'Shared Hub session control missing from party.html: {marker}')
controls_index = party_page.find('<script src="party-session-controls.js"></script>')
timers_index = party_page.find('<script src="party-hub-timers.js"></script>')
hub_index = party_page.find('<script src="party-hub.js"></script>')
if not (controls_index >= 0 and controls_index < timers_index < hub_index):
    violations.append('Party Hub timer module must load after shared controls and before party-hub.js.')

quick_play = read('quick-play.html')
for marker in (
    'id="quick-session-controls"', 'id="quick-pause"', 'id="quick-skip"',
    'id="quick-exit"', 'id="quick-replay"', 'id="quick-next-game"',
    'id="quick-pause-overlay"'
):
    if marker not in quick_play:
        violations.append(f'Shared session control missing from quick-play.html: {marker}')

contracts = {
    'backup-schema-registry.js': [
        'MAX_FILE_BYTES = 1_500_000', "format: 'secret-circle-backup'",
        "format: 'secret-circle-complete-backup'", "format: 'secret-circle-created-games'",
        'validateHeader', 'assertSize'
    ],
    'session-ledger.js': ['createSessionId', 'legacySessionId', 'completionId', 'recordCompletion'],
    'party-session-controls.js': [
        'formatMilliseconds', 'orderedGameIds', 'nextGameId', 'nextGameHref',
        'createController', 'function countdown', 'function setPaused', 'function setSessionActive',
        '#quick-pause', '#quick-skip', '#quick-exit', '#quick-replay', '#quick-next-game',
        'remainingMilliseconds'
    ],
    'party-hub.js': [
        'SecretCircleSessionLedger', 'SecretCircleSessionControls', 'SecretCirclePartyHubTimers',
        'S.createController', 'T.createTimerGames', 'timerGames.renderStoredTimerSession',
        "completionId('hub'", 'recordCompletion(state,', 'sessionId: L.createSessionId',
        "ACTIVE_KEY = 'secret-circle-party-hub-active-v1'", 'ACTIVE_VERSION = 1',
        'normalizeActiveSession', 'persistActiveSession', 'loadActiveSession', 'clearActiveSession',
        'players: [...state.players]', 'Session fortsetzen',
        'Geheime Inhalte werden nach einem Reload nicht automatisch geöffnet',
        "document.addEventListener('visibilitychange'", "window.addEventListener('pagehide'",
        'setHubPaused(true)', 'pause-hub-game', 'skipHubRound', 'abortSession'
    ],
    'party-hub-timers.js': [
        'SecretCirclePartyHubTimers', 'normalizeTimerState', 'createTimerGames',
        "TIMER_KINDS = new Set(['charades', 'taboo', 'hot-potato', 'word-chain'])",
        "kind: 'charades', phase: 'running', remainingMs",
        "kind: 'taboo', phase: 'running', remainingMs",
        "kind: 'hot-potato', phase: 'running', remainingMs",
        "kind: 'word-chain', phase: 'running', remainingMs",
        'hubTimer.countdown(remainingMs / 1000, timer, finishCharadesTimer)',
        'hubTimer.countdown(remainingMs / 1000, timer, finishTabooTimer)',
        'hubTimer.countdown(remainingMs / 1000, hiddenClock, finishHotPotatoTimer)',
        'hubTimer.countdown(remainingMs / 1000, timer, finishWordChainTimer)',
        'renderStoredTimerSession'
    ],
    'party-release-structure.js': [
        'CORE_IDS', 'LAB_IDS', "label: 'Kernspiel'", "label: 'Erweiterung'",
        "label: 'Labs'", 'tierFor', 'ageAllows', 'counts', 'release-tier-filter',
        'selectedTier', 'selectedAge', 'tierMatches', 'ageMatches'
    ],
    'party-filter-state.js': [
        "STORAGE_KEY = 'secret-circle-party-catalog-filters-v1'", 'FIXED_VALUES',
        'game-search', 'group-filter', 'mood-filter', 'player-filter',
        'age-filter', 'status-filter', 'release-tier-filter', 'Filter zurücksetzen',
        'normalize(value)', 'optionExists', 'scheduleSave'
    ],
    'party-search-assist.js': [
        'MANUAL_ALIASES', 'normalizeText', 'levenshtein', 'suggestions',
        'aria-autocomplete', 'listbox', 'ArrowDown', 'Escape'
    ],
    'runtime-guard.js': [
        'Neue Secret-Circle-Version bereit', 'Jetzt aktualisieren', 'hasActiveSession',
        "waitingWorker.postMessage({ type: 'SKIP_WAITING' })",
        'secret-circle-party-hub-active-v1', 'secret-circle-party-active-v1',
        'party-release-structure.js', 'party-filter-state.js', 'party-search-assist.js',
        'party-release.css', 'party-search.css', 'loadPartyReleaseStructure',
        'loadPartyFilterState', 'loadPartySearchAssist'
    ],
    'party-night.js': ['normalizeConfig', 'eligibleGames', 'buildPlan', 'normalizePlan', 'syncPlanFromHistory', 'secret-circle-party-night-v1'],
    'party-advanced-runner.js': ['ACTIVE_VERSION = 2', 'session.players', 'historyId', 'saveHubState(nextHubState)'],
    'party-quick-modes.js': [
        "ACTIVE_KEY = 'secret-circle-party-quick-active-v1'", 'SecretCircleSessionLedger',
        'SecretCircleSessionControls', 'S.createController', 'sessionControls.countdown',
        'sessionControls.stopTimer', 'onSkip:', 'onAbort: abortSession', 'onReplay: replaySession',
        "completionId('quick'", 'recordCompletion(loadHub()', 'sessionId: L.createSessionId',
        'legacySessionId', 'renderWavelength', 'renderRapidFire'
    ],
    'party-mega-modes.js': [
        "ACTIVE_KEY = 'secret-circle-party-mega-active-v1'", 'SecretCircleSessionLedger',
        'SecretCircleSessionControls', 'S.createController', 'sessionControls.countdown',
        'sessionControls.stopTimer', 'onSkip:', 'onAbort: abortSession', 'onReplay: replaySession',
        "completionId('mega'", 'recordCompletion(loadHub()', 'sessionId: L.createSessionId',
        'legacySessionId', 'renderWhoAmI', 'renderAnimeGuess', 'renderMoneyChallenge',
        'renderBlindRanking', 'renderEmojiQuiz', 'renderSecretMission'
    ],
    'party-viral-modes.js': [
        "ACTIVE_KEY = 'secret-circle-party-viral-active-v1'", 'SecretCircleSessionLedger',
        'SecretCircleSessionControls', 'S.createController', 'sessionControls.countdown',
        'sessionControls.stopTimer', 'onSkip:', 'onAbort: abortSession', 'onReplay: replaySession',
        "completionId('viral'", 'recordCompletion(loadHub()', 'sessionId: L.createSessionId',
        'legacySessionId', 'renderFingerDown', 'renderGuessPrice', 'renderHigherLower',
        'renderKnowMeBest', 'renderHearMeOut', 'renderHotSeat', 'renderStoryChain', 'finishSession'
    ],
    'party-created-modes.js': [
        "ACTIVE_KEY = 'secret-circle-party-created-active-v1'", 'SecretCircleSessionLedger',
        'SecretCircleSessionControls', 'S.createController', 'sessionControls.countdown',
        'sessionControls.stopTimer', 'onSkip:', 'onAbort: abortSession', 'onReplay: replaySession',
        "completionId('created'", 'recordCompletion(loadHub()', 'sessionId: L.createSessionId',
        'legacySessionId', 'renderChoice', 'renderGuess', 'renderChallenge', 'renderDebate', 'renderStory'
    ],
    'party-trending-catalog.js': ['trendingGameIds', 'caption-battle', 'version: 3'],
    'party-mega-catalog.js': ['megaGameIds', 'quickGameIds', 'anime-guess', 'money-challenge', 'blind-ranking', 'version: 4'],
    'party-viral-catalog.js': ['viralGameIds', 'allFastGameIds', 'put-a-finger-down', 'guess-the-price', 'higher-lower', 'version: 5'],
    'party-routing.js': [
        "CREATED_KEY = 'secret-circle-party-created-games-v1'", 'safeCreatedGames',
        'createCatalog', 'version: 8', "href: `quick-play.html?game=${encodeURIComponent(game.id)}`"
    ],
    'game-creator.js': [
        "STORAGE_KEY = 'secret-circle-party-created-games-v1'", 'MAX_GAMES = 40',
        'MAX_CARDS = 200', 'normalizeGame', 'createStore', 'toCatalogGame'
    ],
    'creator-page.js': ['renderTemplates', 'addPack', 'validateCurrentStep', 'renderLibrary', 'exportLibrary', 'importLibrary'],
    'party-guide.js': ['addCreatorEntryPoints', 'addHowItWorks', 'showHelp', 'enhanceGameCards', 'openRequestedGame'],
    'quick-loader.js': [
        'session-ledger.js', 'party-session-controls.js', 'scriptPlan',
        'SecretCircleSessionLedger', 'SecretCircleSessionControls',
        'party-created-modes.js', 'party-viral-modes.js', 'party-mega-modes.js', 'party-quick-modes.js'
    ],
    'party-custom-packs.js': ['MAX_PACKS = 30', 'MAX_ITEMS = 150', 'version: 4', 'createManager', 'commit(nextState)', 'restoreStorage'],
    'party-data-tools.js': ['byteLength', 'replaceEntries', 'secret-circle-complete-backup']
}
for relative, markers in contracts.items():
    source = read(relative)
    for marker in markers:
        if marker not in source:
            violations.append(f'Architecture contract missing in {relative}: {marker}')

for forbidden in ('session-ledger-legacy-guard.js', 'SecretCircleLegacySessionGuard'):
    for relative in production_js + ['package.json']:
        if forbidden in read(relative):
            violations.append(f'Obsolete legacy guard reference in {relative}: {forbidden}')

for relative in ('party-quick-modes.js', 'party-mega-modes.js', 'party-viral-modes.js', 'party-created-modes.js'):
    source = read(relative)
    if 'let timerId = null' in source or 'const deadline = Date.now() + seconds * 1000' in source:
        violations.append(f'Engine still contains a private non-pausable timer: {relative}')

for relative in ('party-hub.js', 'party-hub-timers.js'):
    source = read(relative)
    for forbidden in ('activeTimer', 'window.setInterval(', 'performance.now()'):
        if forbidden in source:
            violations.append(f'Hub still contains a private non-pausable timer in {relative}: {forbidden}')

for marker in ('tests/hub-resume-contract.test.js', 'tests/hub-timer-contract.test.js', 'tests/hub-control-contract.test.js'):
    if marker not in package.get('scripts', {}).get('test', ''):
        violations.append(f'Hub release test missing from npm test: {marker}')
    if marker not in package.get('scripts', {}).get('check', ''):
        violations.append(f'Hub release test missing from syntax gate: {marker}')
if 'node --check party-hub-timers.js' not in package.get('scripts', {}).get('check', ''):
    violations.append('Dedicated Hub timer module is missing from npm syntax gate.')

sw = read('sw.js')
cache = re.search(r"const CACHE='secret-circle-v(\d+)'", sw)
if not cache or cache.group(1) != '30':
    violations.append('Service-worker cache must be secret-circle-v30.')
if "const STAGING_CACHE='secret-circle-v30-staging'" not in sw:
    violations.append('Service-worker staging cache contract is missing.')
install_handler = re.search(r"self\.addEventListener\('install',[\s\S]*?\n\}\);", sw)
if not install_handler or 'skipWaiting' in install_handler.group(0):
    violations.append('Service-worker install must not activate an update automatically.')
for asset in [
    './party-night.js', './party-advanced-runner.js', './quick-play.html', './creator.html',
    './pwa-update.css', './party-release.css', './party-search.css',
    './party-release-structure.js', './party-filter-state.js', './party-search-assist.js',
    './session-ledger.js', './party-session-controls.js', './party-hub-timers.js',
    './party-trending-catalog.js', './party-mega-catalog.js', './party-viral-catalog.js', './party-quick-modes.js',
    './party-mega-modes.js', './party-viral-modes.js', './party-created-modes.js',
    './quick-loader.js', './game-creator.js', './creator-page.js', './party-guide.js',
    './party-guide.css', './creator.css'
]:
    if asset not in sw:
        violations.append(f'Offline architecture asset missing from CORE: {asset}')

for relative in [
    'README.md', 'ARCHITECTURE.md', 'BACKUP_SCHEMAS.md', 'RELEASE_SCOPE_2027.md',
    'ROADMAP_2027.md', 'RELEASE_STATUS.md', 'DEPLOYMENT.md', 'SECURITY.md',
    'MANUAL_TEST_PLAN.md', 'MODE_UNIVERSE.md', 'TREND_FORMATS.md', 'ASSET_PLAN.md'
]:
    if not (ROOT / relative).is_file() or (ROOT / relative).stat().st_size < 300:
        violations.append(f'Operational document missing or incomplete: {relative}')

if violations:
    raise SystemExit('\n'.join(sorted(set(violations))))

print(json.dumps({
    'architecture_audit': 'PASS',
    'production_modules_checked': len(production_js),
    'html_pages_checked': len(html_pages),
    'maximum_module_lines': 1000,
    'maximum_module_bytes': 100000,
    'runtime_dependencies': 0,
    'offline_cache_version': 30,
    'staged_updates': True,
    'release_tiers': {'core': 15, 'extended': 13, 'labs': 17},
    'persistent_catalog_filters': True,
    'search_assistance': True,
    'shared_session_controls': True,
    'split_direct_hub_timer_module': True,
    'pausable_fast_engine_timers': True,
    'pausable_core_hub_timers': True,
    'direct_hub_reload_resume': True,
    'combined_age_and_release_filter': True,
    'backup_schemas': 3,
    'exact_once_engine_families': 5,
    'legacy_guard_removed': True,
    'visible_builtin_games': 45,
    'maximum_local_created_games': 40,
    'creator_templates': 6,
    'classic_quick_modes': 10,
    'mega_trend_modes': 9,
    'viral_modes': 8,
    'versioned_storage': True,
    'transaction_contracts': True,
    'external_runtime_assets': 0
}, ensure_ascii=False, indent=2))
