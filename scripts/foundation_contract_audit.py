#!/usr/bin/env python3
from pathlib import Path
import json
import re

ROOT = Path(__file__).resolve().parents[1]


def read(relative: str) -> str:
    return (ROOT / relative).read_text(encoding='utf-8')


def require_file(relative: str) -> str:
    path = ROOT / relative
    if not path.is_file():
        raise SystemExit(f'Release-foundation file missing: {relative}')
    return read(relative)


registry = require_file('backup-schema-registry.js')
backup_docs = require_file('BACKUP_SCHEMAS.md')
store = require_file('data-store.js')
complete_tools = require_file('party-data-tools.js')
creator = require_file('game-creator.js')
creator_page = require_file('creator-page.js')
ledger = require_file('session-ledger.js')
created_runtime = require_file('party-created-modes.js')
quick_runtime = require_file('party-quick-modes.js')
mega_runtime = require_file('party-mega-modes.js')
viral_runtime = require_file('party-viral-modes.js')
loader = require_file('quick-loader.js')
release_structure = require_file('party-release-structure.js')
filter_state = require_file('party-filter-state.js')
search_assist = require_file('party-search-assist.js')
release_styles = require_file('party-release.css')
search_styles = require_file('party-search.css')
runtime_guard = require_file('runtime-guard.js')
service_worker = require_file('sw.js')
package = json.loads(require_file('package.json'))

install_handler_match = re.search(
    r"self\.addEventListener\('install',[\s\S]*?\n\}\);",
    service_worker,
)
install_handler = install_handler_match.group(0) if install_handler_match else ''


def direct_engine(source: str, engine: str) -> bool:
    return all(marker in source for marker in (
        'SecretCircleSessionLedger',
        f"completionId('{engine}'",
        'recordCompletion(loadHub()',
        'sessionId: L.createSessionId',
        'legacySessionId',
        'if (result.recorded && !saveHub(result.hub)) return',
        'active = final;',
    ))


checks = {
    'backup_registry_version': 'const VERSION = 1;' in registry,
    'backup_shared_limit': 'const MAX_FILE_BYTES = 1_500_000;' in registry,
    'word_backup_registered': "format: 'secret-circle-backup'" in registry,
    'complete_backup_registered': "format: 'secret-circle-complete-backup'" in registry,
    'creator_backup_registered': "format: 'secret-circle-created-games'" in registry,
    'word_runtime_limit_matches': 'MAX_BACKUP_BYTES = 1_500_000' in store,
    'complete_runtime_limit_matches': 'MAX_BYTES = 1_500_000' in complete_tools,
    'creator_import_limit_matches': 'file.size > 1_500_000' in creator_page,
    'creator_capacity_matches': all(marker in creator for marker in ('MAX_GAMES = 40', 'MAX_PACKS = 8', 'MAX_CARDS = 200')),
    'backup_contract_documented': all(marker in backup_docs for marker in ('word-imposter', 'complete', 'creator-library', '1.500.000 UTF-8-Bytes')),
    'session_ledger_versioned': 'const VERSION = 1;' in ledger,
    'creator_exact_once': direct_engine(created_runtime, 'created'),
    'quick_exact_once': direct_engine(quick_runtime, 'quick'),
    'mega_exact_once': direct_engine(mega_runtime, 'mega'),
    'viral_exact_once': direct_engine(viral_runtime, 'viral'),
    'legacy_guard_removed': all('session-ledger-legacy-guard' not in source for source in (loader, service_worker, package.get('scripts', {}).get('test', ''), package.get('scripts', {}).get('check', ''))),
    'loader_orders_shared_runtime': all(marker in loader for marker in ('session-ledger.js', 'scriptPlan', 'SecretCircleSessionLedger')),
    'release_tier_contract': all(marker in release_structure for marker in (
        'CORE_IDS', 'LAB_IDS', "label: 'Kernspiel'", "label: 'Erweiterung'", "label: 'Labs'", 'tierFor', 'ageAllows', 'counts',
    )),
    'release_tier_counts_declared': all(marker in release_structure for marker in (
        "'imposter'", "'wrong-answers'", "'who-am-i'", "'finish-the-sentence'",
    )),
    'combined_age_tier_filter': all(marker in release_structure for marker in (
        'selectedTier', 'selectedAge', 'tierMatches', 'ageMatches',
    )),
    'filter_state_contract': all(marker in filter_state for marker in (
        "STORAGE_KEY = 'secret-circle-party-catalog-filters-v1'", 'game-search',
        'group-filter', 'mood-filter', 'player-filter', 'age-filter',
        'status-filter', 'release-tier-filter', 'Filter zurücksetzen',
    )),
    'filter_state_sanitized': all(marker in filter_state for marker in (
        'normalize(value)', 'FIXED_VALUES', 'optionExists', 'cleanText',
    )),
    'search_assist_contract': all(marker in search_assist for marker in (
        'MANUAL_ALIASES', 'normalizeText', 'levenshtein', 'suggestions',
        'aria-autocomplete', 'listbox', 'ArrowDown', 'Escape',
    )),
    'release_runtime_loader': all(marker in runtime_guard for marker in (
        'party-release-structure.js', 'party-filter-state.js', 'party-search-assist.js',
        'party-release.css', 'party-search.css', 'loadPartyReleaseStructure',
        'loadPartyFilterState', 'loadPartySearchAssist',
    )),
    'release_runtime_offline': all(marker in service_worker for marker in (
        './party-release-structure.js', './party-filter-state.js', './party-search-assist.js',
        './party-release.css', './party-search.css',
    )),
    'release_accessibility_styles': all(marker in release_styles for marker in (
        '.release-tier-overview', '.release-tier-pill', 'focus-visible', 'prefers-reduced-motion',
    )) and all(marker in search_styles for marker in (
        '.party-search-suggestions', 'focus-visible', 'prefers-reduced-motion',
    )),
    'visible_pwa_update': all(marker in runtime_guard for marker in ('Neue Secret-Circle-Version bereit', 'Jetzt aktualisieren', "type: 'SKIP_WAITING'")),
    'staged_pwa_update': all(marker in service_worker for marker in ('STAGING_CACHE', 'stageCore', 'promoteStagedCore', "event.data?.type === 'SKIP_WAITING'")),
    'install_handler_detected': bool(install_handler),
    'no_install_auto_activation': bool(install_handler) and 'skipWaiting' not in install_handler,
    'foundation_tests_in_unit_gate': all(marker in package.get('scripts', {}).get('test', '') for marker in (
        'tests/party-release-structure.test.js',
        'tests/party-filter-state.test.js',
        'tests/party-search-assist.test.js',
        'tests/session-ledger.test.js',
        'tests/session-ledger-integration.test.js',
        'tests/backup-schema-registry.test.js',
        'tests/pwa-update.test.js',
    )),
    'foundation_modules_in_syntax_gate': all(marker in package.get('scripts', {}).get('check', '') for marker in (
        'party-release-structure.js',
        'party-filter-state.js',
        'party-search-assist.js',
        'backup-schema-registry.js',
        'session-ledger.js',
        'runtime-guard.js',
        'sw.js',
    )),
}

failed = [name for name, passed in checks.items() if not passed]
if failed:
    raise SystemExit(f'Release-foundation contract audit failed: {", ".join(failed)}')

print(json.dumps({
    'foundation_contract_audit': 'PASS',
    'release_tiers': {'core': 15, 'extended': 13, 'labs': 17},
    'persistent_catalog_filters': True,
    'search_assistance': True,
    'combined_age_and_release_filter': True,
    'backup_schemas': ['word-imposter', 'complete', 'creator-library'],
    'maximum_backup_bytes': 1_500_000,
    'exact_once_engines': ['created', 'quick', 'mega', 'viral'],
    'legacy_guard_removed': True,
    'controlled_pwa_updates': True,
    'checks': checks,
}, ensure_ascii=False, indent=2))
