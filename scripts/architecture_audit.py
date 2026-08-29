#!/usr/bin/env python3
from pathlib import Path
import json
import re

ROOT = Path(__file__).resolve().parents[1]
read = lambda relative: (ROOT / relative).read_text(encoding='utf-8')
violations = []

production_js = [
    'runtime-guard.js', 'setup-ux.js', 'privacy-guard.js', 'wake-lock.js',
    'game-engine.js', 'role-assignment.js', 'word-packs.js', 'data-store.js',
    'word-imposter-resume-guard.js', 'app.js', 'backup-schema-registry.js',
    'session-ledger.js', 'party-session-controls.js', 'party-catalog.js',
    'party-expansion.js', 'party-trending-catalog.js', 'party-mega-catalog.js',
    'party-viral-catalog.js', 'party-core-release-catalog.js', 'party-core-classic-content.js',
    'party-routing.js', 'party-wave-one-catalog.js', 'party-release-structure.js', 'party-filter-state.js',
    'party-search-assist.js', 'game-creator.js', 'creator-page.js', 'party-custom-packs.js',
    'party-hub-timers.js', 'party-hub-resume-guard.js', 'party-hub-round-state.js',
    'party-hub.js', 'party-hub-plus.js', 'party-hub-polish.js', 'party-hub-a11y.js',
    'secondary-surface-a11y.js', 'party-guide.js', 'party-night.js', 'party-data-tools.js',
    'party-advanced.js', 'advanced-resume-guard.js', 'party-advanced-runner.js',
    'advanced-privacy-guard.js', 'party-advanced-preferences.js', 'party-quick-modes.js',
    'party-mega-modes.js', 'party-viral-modes.js', 'party-created-modes.js', 'party-wave-one-modes.js',
    'quick-session-replacement-guard.js', 'quick-loader.js', 'sw.js'
]
html_pages = ['index.html', 'party.html', 'advanced.html', 'quick-play.html', 'creator.html', 'privacy.html']
required_contract_files = [
    'manifest.webmanifest', 'icon.svg', 'icon-192.png', 'icon-512.png',
    'assets/manifests/asset-provenance.json', 'tests/manifest-icons.test.js',
    'tests/accessibility-contract.test.js', 'scripts/asset_provenance_audit.py',
    'scripts/media_inventory_audit.py', 'scripts/hub_a11y_contract_audit.py',
    'scripts/secondary_surface_a11y_contract_audit.py', 'scripts/advanced_integrity_audit.py',
    'scripts/wave_one_quiz_audit.py', 'scripts/quick_session_replacement_audit.py',
    'scripts/quick_timer_resume_audit.py', 'scripts/quick_bfcache_resume_audit.py',
    'scripts/quick_background_pause_audit.py', 'scripts/quick_hidden_snapshot_audit.py',
    'scripts/backup_contract_audit.py', 'tests/e2e/quick-background-pause.spec.js',
    'tests/e2e/wave-one-quiz.spec.js'
]
for relative in production_js + html_pages + required_contract_files:
    if not (ROOT / relative).is_file(): violations.append(f'Missing architecture file: {relative}')
if violations: raise SystemExit('\n'.join(sorted(set(violations))))

architecture = read('ARCHITECTURE.md')
for marker in (
    'Stabile Identitäten', 'Versionierte Daten und Backups', 'Katalog- und Contentarchitektur',
    'Hub- und Timergrenzen', 'Lokale Transaktionen und Exact-once',
    'Datenschutz und Security durch Architektur', 'Offline- und Updatevertrag',
    'Accessibility als Definition of Done', 'Inhalts- und Rechtevertrag', 'Testpyramide',
    'Performance und Assets', 'Betrieb, Deprecation und Rollback',
    'Quick-/Mega-/Viral-/Creator-Session-Ersatz – v56', 'Quick-Family Timer Resume – v57',
    'Quick-Family BFCache Resume – v58', 'Quick-Family Background Pause – v59',
    'Quick-Family Hidden Snapshot – v60', 'Expansion Wave 1 – v61'
):
    if marker not in architecture: violations.append(f'Architecture contract marker missing: {marker}')

package = json.loads(read('package.json'))
if package.get('dependencies'): violations.append('Runtime npm dependencies are not allowed without an architecture review.')
if package.get('devDependencies', {}).get('@playwright/test') != '1.54.2': violations.append('Playwright must remain exactly pinned.')
if package.get('engines', {}).get('node') != '>=20': violations.append('Supported Node.js baseline changed.')

for relative in production_js:
    path = ROOT / relative
    source = read(relative)
    lines = len(source.splitlines())
    if lines > 1_000: violations.append(f'{relative} has {lines} lines; split it before 1000 lines.')
    if path.stat().st_size > 100_000: violations.append(f'{relative} exceeds the 100 KB module limit.')
    if "'use strict'" not in source and '"use strict"' not in source: violations.append(f'{relative} does not declare strict mode.')

for relative in html_pages:
    source = read(relative)
    if re.search(r'<script(?![^>]*\bsrc=)[^>]*>', source, re.IGNORECASE): violations.append(f'Inline script found in {relative}.')
    if re.search(r'(?:src|href)=["\']https?://', source, re.IGNORECASE): violations.append(f'External runtime asset found in {relative}.')
    if "script-src 'self'" not in source or "object-src 'none'" not in source: violations.append(f'Strict CSP contract missing in {relative}.')

party_page = read('party.html'); quick_play = read('quick-play.html'); advanced_page = read('advanced.html'); creator_page = read('creator.html')
catalog_chain = ['party-catalog.js','party-expansion.js','party-trending-catalog.js','party-mega-catalog.js','party-viral-catalog.js','party-core-release-catalog.js','party-core-classic-content.js','party-routing.js','party-wave-one-catalog.js']

def check_order(source, names, context):
    positions=[]
    for name in names:
        position=source.find(name)
        if position < 0:
            violations.append(f'{context} missing ordered module: {name}'); return
        positions.append(position)
    if positions != sorted(positions): violations.append(f'{context} module order is invalid: {" -> ".join(names)}')

check_order(party_page, catalog_chain, 'party.html')
check_order(quick_play, catalog_chain, 'quick-play.html')
check_order(party_page, ['party-session-controls.js','party-hub-timers.js','party-hub-round-state.js','party-hub.js'], 'party.html direct Hub runtime chain')
check_order(party_page, ['backup-schema-registry.js','party-data-tools.js'], 'party.html backup chain')
check_order(advanced_page, ['advanced-resume-guard.js','party-advanced-runner.js','advanced-privacy-guard.js'], 'advanced.html integrity/privacy chain')
check_order(advanced_page, ['secondary-surface-a11y.js','party-advanced-runner.js'], 'advanced.html accessibility chain')
check_order(quick_play, ['secondary-surface-a11y.js','quick-loader.js'], 'quick-play.html accessibility chain')
check_order(creator_page, ['secondary-surface-a11y.js','creator-page.js'], 'creator.html accessibility chain')

contracts = {
    'backup-schema-registry.js': ['const VERSION = 2;','MAX_FILE_BYTES = 1_500_000',"format: 'secret-circle-complete-backup'",'isAllowedCompleteStorageKey',"'secret-circle-party-quick-timers-v1'",'validQuickTimerSnapshot'],
    'session-ledger.js': ['createSessionId','legacySessionId','completionId','recordCompletion'],
    'party-session-controls.js': [
        'const VERSION = 5;','createController','remainingMilliseconds','function setPaused',
        "TIMER_STORE_KEY = 'secret-circle-party-quick-timers-v1'",'familyForGame','consumePersistedRemaining',
        'function persistRunningTimerSnapshot(preserveOnNextStop = true)','timerContextMatches',
        'function handlePageHide()','return persistRunningTimerSnapshot(true);',
        'function handlePageShow(event)','if (!event?.persisted || !timerFamily) return false;','reloadFn();',
        'function handleVisibilityChange()','if (!documentRef?.hidden) return false;','setPaused(true);',
        'persistRunningTimerSnapshot(false);',
        "documentRef?.addEventListener?.('visibilitychange', handleVisibilityChange);",
        "windowRef?.addEventListener?.('pagehide', handlePageHide, { capture: true });"
    ],
    'word-imposter-resume-guard.js': ['validateSnapshot'],
    'party-hub-resume-guard.js': ['SecretCirclePartyHubResumeGuard'],
    'party-hub-round-state.js': ['SecretCirclePartyHubRoundState','SAFE_CURRENT_MODES','CONCEALED_CURRENT_MODES','truthDarePools','normalizeCurrent','normalizeResume','ensureCurrent','markParanoiaQuestion','resolveParanoia','clearCurrent'],
    'advanced-resume-guard.js': ['version: 4','validateSnapshot','expectedRoleCounts','const hasVoteFields =','if (hasVoteFields === hasGuessFields) return false;','if (computedWinner) return false;'],
    'party-advanced-runner.js': ["const pendingMafiaRound = session.advanced?.stage === 'finished' ? 1 : 0;","window.confirm('Gespeicherte Session verwerfen und eine neue beginnen?')",'if (!clearActive()) return;'],
    'advanced-privacy-guard.js': ['SecretCircleAdvancedPrivacyGuard','sensitiveContext','conceal'],
    'quick-session-replacement-guard.js': ['SecretCircleQuickSessionReplacementGuard','FAMILY_KEYS','plausibleSnapshot','authorizeStart','blockPagehideRetry = true','root.location?.reload?.()'],
    'quick-loader.js': ["REPLACEMENT_GUARD_SOURCE = 'quick-session-replacement-guard.js'","WAVE_ONE_SOURCE = 'party-wave-one-modes.js'",'catalog.waveOneGameIds?.includes(gameId)','replacementGuardReady = false','plan.push(REPLACEMENT_GUARD_SOURCE)','version: 8'],
    'party-wave-one-catalog.js': ["id: 'party-quiz'","id: 'fact-or-fake'",'waveOneGameIds','quickGameIds','version: 2'],
    'party-wave-one-modes.js': ["ACTIVE_KEY = 'secret-circle-party-quick-active-v1'","L.completionId('wave1', game.id, active.sessionId)","gameId === 'party-quiz'","gameId === 'fact-or-fake'"],
    'party-hub-a11y.js': ['SecretCirclePartyHubA11y','syncBackgroundInert','trapOverlayFocus','focusVisibleViewHeading'],
    'secondary-surface-a11y.js': ['SecretCircleSecondarySurfaceA11y','syncBackgroundInert','trapTab','ensureHeadingFocusable','syncTemplateRoving','handleTemplateKeys'],
    'party-expansion.js': ["id: 'wavelength', title: 'Spektrum-Tipp'", "banned: ['Webseite', 'Internet', 'Tab']"],
    'party-mega-catalog.js': ["id: 'anime-guess', title: 'Anime-Archetypen erraten'", "['🦁🌾', 'Löwe']"],
    'party-core-release-catalog.js': ['coreReleaseContentVersion','coreReleaseContentGames','function mergeContent'],
    'party-core-classic-content.js': ['const VERSION = 4;','coreClassicContentVersion','coreClassicContentGames','referenceSafeGameOverrides','referenceSafeContent','Anime-Archetypen erraten',"title: 'Spektrum-Tipp'",'referenceSafeRemovedConcreteNames: 40'],
    'party-routing.js': ["require('./party-core-classic-content.js')",'createCatalog','version: 8'],
    'party-hub.js': ['SecretCircleSessionLedger','SecretCircleSessionControls','SecretCirclePartyHubTimers','SecretCirclePartyHubRoundState',"ACTIVE_KEY = 'secret-circle-party-hub-active-v1'",'R.normalizeResume','R.ensureCurrent','R.markParanoiaQuestion','R.resolveParanoia','R.clearCurrent','Rundenergebnis anzeigen','Session fortsetzen','skipHubRound','abortSession'],
    'party-hub-timers.js': ['SecretCirclePartyHubTimers','normalizeTimerState','createTimerGames'],
    'party-hub-polish.js': ['party-hub-a11y.js','loadHubA11y','guardStoredResumeIntegrity','version: 17','privatePromptContext',"game.id === 'paranoia'","!playOptions?.querySelector('button')"],
    'runtime-guard.js': ['Neue Secret-Circle-Version bereit','Jetzt aktualisieren','hasActiveSession'],
    'game-creator.js': ["STORAGE_KEY = 'secret-circle-party-created-games-v1'",'MAX_GAMES = 40'],
    'party-data-tools.js': ['SecretCircleBackupSchemas','replaceEntries','registry.isAllowedCompleteStorageKey'],
    'tests/manifest-icons.test.js': ['pngDimensions','192x192','512x512','offlineIconContract'],
    'tests/accessibility-contract.test.js': ['hubModalBackgroundIsolation','hubModalFocusTrapContract','secondarySurfaceFocusRecovery','creatorTemplateRadiogroupKeyboardContract'],
    'scripts/media_inventory_audit.py': ['MEDIA_SUFFIXES','EXPECTED_CURRENT_MEDIA','all_media_in_provenance_manifest'],
    'scripts/hub_a11y_contract_audit.py': ['hub_a11y_contract_audit','modalFocusTrapContract'],
    'scripts/secondary_surface_a11y_contract_audit.py': ['secondary_surface_a11y_contract_audit','creator_radiogroup_arrow_navigation'],
    'scripts/advanced_integrity_audit.py': ['advanced_integrity_audit','resume_guard_version','confirmed_new_session_replacement'],
    'scripts/wave_one_quiz_audit.py': ['wave_one_quiz_audit','implemented_labs','shared_runner'],
    'scripts/quick_session_replacement_audit.py': ['quick_session_replacement_audit','families_guarded','failed_write_preserves_previous_snapshot'],
    'scripts/quick_timer_resume_audit.py': ['quick_timer_resume_audit','prompt_free_timer_snapshot','stale_timer_snapshots_rejected'],
    'scripts/quick_bfcache_resume_audit.py': ['quick_bfcache_resume_audit','matching_bfcache_snapshot_reload','browser_lifecycle_contract'],
    'scripts/quick_background_pause_audit.py': ['quick_background_pause_audit','hidden_auto_pause','visible_requires_explicit_resume','browser_visibility_contract'],
    'scripts/quick_hidden_snapshot_audit.py': ['quick_hidden_snapshot_audit','hidden_snapshot_without_pagehide','same_page_stop_clears_visibility_snapshot'],
    'scripts/backup_contract_audit.py': ['backup_contract_audit','unknown_future_namespaces_preserved_on_restore','quick_timer_store_managed']
}
for relative, markers in contracts.items():
    source=read(relative)
    for marker in markers:
        if marker not in source: violations.append(f'Architecture contract missing in {relative}: {marker}')

for forbidden in ('session-ledger-legacy-guard.js','SecretCircleLegacySessionGuard'):
    for relative in production_js + ['package.json']:
        if forbidden in read(relative): violations.append(f'Obsolete legacy guard reference in {relative}: {forbidden}')

for relative in ('party-quick-modes.js','party-mega-modes.js','party-viral-modes.js','party-created-modes.js'):
    source=read(relative)
    if 'let timerId = null' in source or 'const deadline = Date.now() + seconds * 1000' in source: violations.append(f'Engine still contains a private non-pausable timer: {relative}')
for relative in ('party-hub.js','party-hub-timers.js'):
    source=read(relative)
    for forbidden in ('activeTimer','window.setInterval(','performance.now()'):
        if forbidden in source: violations.append(f'Hub still contains a private non-pausable timer in {relative}: {forbidden}')

syntax_gate=package.get('scripts',{}).get('check',''); unit_gate=package.get('scripts',{}).get('test',''); validate_gate=package.get('scripts',{}).get('validate','')
for module in ('party-expansion.js','party-mega-catalog.js','party-core-release-catalog.js','party-core-classic-content.js','party-wave-one-catalog.js','party-wave-one-modes.js','party-session-controls.js','party-hub-timers.js','party-hub-resume-guard.js','party-hub-round-state.js','party-hub-a11y.js','secondary-surface-a11y.js','word-imposter-resume-guard.js','advanced-resume-guard.js','party-advanced-runner.js','advanced-privacy-guard.js','quick-session-replacement-guard.js','quick-loader.js'):
    if f'node --check {module}' not in syntax_gate: violations.append(f'Production module missing from syntax gate: {module}')
for test in ('tests/party-mega-catalog.test.js','tests/party-wave-one-catalog.test.js','tests/core-content-quality.test.js','tests/hub-resume-contract.test.js','tests/hub-control-contract.test.js','tests/party-session-controls.test.js','tests/advanced-resume-guard.test.js','tests/advanced-resume-contract.test.js','tests/quick-loader.test.js','tests/quick-session-replacement-guard.test.js','tests/accessibility-contract.test.js','tests/manifest-icons.test.js'):
    if test not in unit_gate: violations.append(f'Critical architecture test missing from npm test: {test}')
for e2e in ('tests/e2e/quick-timer-resume.spec.js','tests/e2e/quick-background-pause.spec.js','tests/e2e/wave-one-quiz.spec.js'):
    if f'node --check {e2e}' not in syntax_gate: violations.append(f'Critical E2E missing from syntax gate: {e2e}')
for audit in ('scripts/wave_one_quiz_audit.py','scripts/advanced_integrity_audit.py','scripts/quick_session_replacement_audit.py','scripts/quick_timer_resume_audit.py','scripts/quick_bfcache_resume_audit.py','scripts/quick_background_pause_audit.py','scripts/quick_hidden_snapshot_audit.py','scripts/backup_contract_audit.py','scripts/core_content_audit.py','scripts/reference_content_audit.py','scripts/asset_provenance_audit.py','scripts/media_inventory_audit.py','scripts/public_release_placeholder_audit.py','scripts/hub_a11y_contract_audit.py','scripts/secondary_surface_a11y_contract_audit.py','scripts/operator_release_contract_audit.py','scripts/release_audit.py','scripts/performance_budget.py'):
    if audit not in validate_gate: violations.append(f'Critical audit missing from npm validate: {audit}')

sw=read('sw.js'); cache=re.search(r"const CACHE='(secret-circle-v(\d+))'",sw); staging=re.search(r"const STAGING_CACHE='(secret-circle-v(\d+)-staging)'",sw)
if not cache or not staging: violations.append('Service-worker cache contract could not be parsed.')
else:
    cache_name=cache.group(1); cache_generation=cache.group(2)
    if staging.group(2)!=cache_generation: violations.append('Service-worker active/staging cache generations differ.')
    for relative in ('ARCHITECTURE.md','DEPLOYMENT.md','privacy.html','ENVIRONMENTS.md','tests/service-worker.test.js'):
        if cache_name not in read(relative): violations.append(f'Current cache {cache_name} not synchronized in {relative}.')

for asset in ('./backup-schema-registry.js','./word-imposter-resume-guard.js','./party-expansion.js','./party-mega-catalog.js','./party-core-release-catalog.js','./party-core-classic-content.js','./party-wave-one-catalog.js','./party-wave-one-modes.js','./party-hub-timers.js','./party-hub-resume-guard.js','./party-hub-round-state.js','./party-hub-a11y.js','./secondary-surface-a11y.js','./advanced-resume-guard.js','./party-advanced-runner.js','./advanced-privacy-guard.js','./quick-session-replacement-guard.js','./quick-loader.js','./session-ledger.js','./party-session-controls.js','./icon.svg','./icon-192.png','./icon-512.png'):
    if asset not in sw: violations.append(f'Offline core missing architecture-critical asset: {asset}')

if 'await caches.delete(CACHE)' in sw: violations.append('Service-worker must not destroy the active cache before promotion.')
install_handler=re.search(r"self\.addEventListener\('install',[\s\S]*?\n\}\);",sw)
if not install_handler or 'skipWaiting' in install_handler.group(0): violations.append('Service-worker install must wait for explicit update activation.')
if "event.data?.type === 'SKIP_WAITING'" not in sw: violations.append('Service-worker controlled activation message is missing.')
if violations: raise SystemExit('\n'.join(sorted(set(violations))))

print(json.dumps({
    'architecture_audit':'PASS','production_modules':len(production_js),'html_pages':len(html_pages),
    'runtime_dependencies':0,'module_line_limit':1000,'module_size_limit_bytes':100000,
    'pwa_cache':cache.group(1) if cache else None,'catalog_chain':catalog_chain,'core_classic_content_version':4,
    'resume_privacy_guards_audited':True,'advanced_resume_guard_version':4,'advanced_integrity_audit_required':True,
    'quick_replacement_guard_version':2,'quick_loader_version':8,'quick_session_replacement_audit_required':True,
    'session_controls_version':5,'quick_timer_resume_audit_required':True,'quick_timer_prompt_free_store':True,
    'quick_timer_stale_snapshot_rejection':True,'quick_bfcache_resume_audit_required':True,
    'matching_bfcache_snapshot_reload':True,'stale_bfcache_snapshot_no_reload':True,
    'quick_background_pause_audit_required':True,'hidden_timer_auto_pause':True,
    'visible_timer_requires_explicit_resume':True,'quick_hidden_snapshot_audit_required':True,
    'hidden_snapshot_without_pagehide':True,'same_page_stop_clears_visibility_snapshot':True,
    'wave_one_quiz_audit_required':True,'wave_one_playable_labs':['party-quiz','fact-or-fake'],
    'wave_one_shared_runner':True,'wave_one_reference_safe_text_content':True,
    'hub_safe_round_state_audited':True,'hub_accessibility_layer_audited':True,
    'secondary_surface_accessibility_layer_audited':True,'reference_content_audit_required':True,
    'manifest_icon_test_required':True,'media_inventory_audit_required':True,'backup_registry_version':2,
    'shared_session_controls':True,'split_hub_timer_module':True,'exact_once_contract':True,'controlled_pwa_update':True
},ensure_ascii=False,indent=2))
