#!/usr/bin/env python3
from pathlib import Path
import json
import re

ROOT = Path(__file__).resolve().parents[1]
read = lambda relative: (ROOT / relative).read_text(encoding='utf-8')

required = [
    'package.json', 'package-lock.json', 'sw.js', 'runtime-guard.js',
    'backup-schema-registry.js', 'party-data-tools.js', 'BACKUP_SCHEMAS.md',
    'session-ledger.js', 'party-session-controls.js', 'party-hub-timers.js', 'party-hub.js',
    'party.html', 'quick-play.html', 'party-release-structure.js', 'party-filter-state.js', 'party-search-assist.js',
    'BRANCH_PROTECTION.md', 'ENVIRONMENTS.md',
    'scripts/lockfile_contract_audit.py', 'scripts/branch_protection_contract_audit.py',
    'scripts/staging_smoke.py', 'scripts/staging_smoke_contract_audit.py',
    'scripts/privacy_content_audit.py', 'scripts/reference_content_audit.py',
]
missing = [relative for relative in required if not (ROOT / relative).is_file()]
if missing:
    raise SystemExit('Foundation contract missing files: ' + ', '.join(missing))

package = json.loads(read('package.json'))
lock = json.loads(read('package-lock.json'))
registry = read('backup-schema-registry.js')
data_tools = read('party-data-tools.js')
backup_docs = read('BACKUP_SCHEMAS.md')
ledger = read('session-ledger.js')
controls = read('party-session-controls.js')
hub_timers = read('party-hub-timers.js')
hub = read('party-hub.js')
party = read('party.html')
quick = read('quick-play.html')
release_structure = read('party-release-structure.js')
filter_state = read('party-filter-state.js')
search_assist = read('party-search-assist.js')
runtime_guard = read('runtime-guard.js')
sw = read('sw.js')
branch_contract = read('BRANCH_PROTECTION.md')
environments = read('ENVIRONMENTS.md')
validate_gate = package.get('scripts', {}).get('validate', '')
unit_gate = package.get('scripts', {}).get('test', '')
syntax_gate = package.get('scripts', {}).get('check', '')

cache_match = re.search(r"const CACHE='(secret-circle-v(\d+))'", sw)
staging_match = re.search(r"const STAGING_CACHE='(secret-circle-v(\d+)-staging)'", sw)
if not cache_match or not staging_match:
    raise SystemExit('Foundation contract cannot parse PWA cache generation.')
cache_name = cache_match.group(1)
cache_generation = cache_match.group(2)

checks = {
    # Backup/data foundation: registry v2 is the only Complete-backup policy source.
    'backup_registry_v2': all(marker in registry for marker in (
        'const VERSION = 2;', 'const MAX_FILE_BYTES = 1_500_000;',
        'WORD_STORAGE_KEY', 'PARTY_STORAGE_KEY', 'isAllowedCompleteStorageKey',
        "format: 'secret-circle-complete-backup'", 'maximumEntries: 100', 'maximumValueBytes: 1_000_000'
    )),
    'backup_runtime_consumes_registry': all(marker in data_tools for marker in (
        'window.SecretCircleBackupSchemas', "registry?.get?.('complete')",
        'const FORMAT = schema.format', 'const MAX_BYTES = schema.maximumBytes',
        'const MAX_ENTRIES = schema.maximumEntries', 'const MAX_VALUE_BYTES = schema.maximumValueBytes',
        "registry.validateHeader(payload, 'complete')", 'registry.isAllowedCompleteStorageKey'
    )),
    'backup_runtime_no_policy_duplication': all(marker not in data_tools for marker in (
        "const FORMAT = 'secret-circle-complete-backup'",
        'const MAX_BYTES = 1_500_000', 'const MAX_ENTRIES = 100', 'const MAX_VALUE_BYTES = 1_000_000'
    )),
    'backup_docs_registry_v2': 'Registry v2' in backup_docs and '1.500.000' in backup_docs,
    'backup_registry_before_tools': party.index('backup-schema-registry.js') < party.index('party-data-tools.js'),

    # Session/resume/timer foundation.
    'session_ledger_versioned': 'const VERSION = 1;' in ledger and 'createSessionId' in ledger and 'recordCompletion' in ledger,
    'shared_session_controls': all(marker in controls for marker in (
        'createController', 'function countdown', 'function setPaused', 'remainingMilliseconds'
    )),
    'hub_timer_split': all(marker in hub_timers for marker in (
        "TIMER_KINDS = new Set(['charades', 'taboo', 'hot-potato', 'word-chain'])",
        'createTimerGames', 'renderStoredTimerSession'
    )) and 'SecretCirclePartyHubTimers' in hub,
    'hub_resume_and_privacy': all(marker in hub for marker in (
        "secret-circle-party-hub-active-v1", 'Session fortsetzen', 'persistActiveSession', 'loadActiveSession'
    )),
    'pwa_guard_knows_active_sessions': all(marker in runtime_guard for marker in (
        'secret-circle-party-hub-active-v1', 'secret-circle-party-active-v1', 'hasActiveSession'
    )),

    # Catalog/release UX foundation.
    'release_tiers': all(marker in release_structure for marker in (
        'CORE_IDS', 'LAB_IDS', "label: 'Kernspiel'", "label: 'Erweiterung'", "label: 'Labs'"
    )),
    'persistent_filters': all(marker in filter_state for marker in (
        'secret-circle-party-catalog-filters-v1', 'age-filter', 'status-filter', 'release-tier-filter'
    )),
    'search_assistance': all(marker in search_assist for marker in (
        'MANUAL_ALIASES', 'levenshtein', 'aria-autocomplete', 'ArrowDown', 'Escape'
    )),
    'consent_copy_visible': 'Persönliche Inhalte sind freiwillig' in party and 'Überspringen ist jederzeit erlaubt' in party,
    'final_content_layer_on_quick': 'party-core-classic-content.js' in quick,

    # PWA/update foundation.
    'cache_generation_match': cache_generation == staging_match.group(2),
    'controlled_staged_update': all(marker in sw for marker in (
        'STAGING_CACHE', 'stageCore', 'promoteStagedCore', "event.data?.type === 'SKIP_WAITING'"
    )) and 'await caches.delete(CACHE)' not in sw,
    'visible_update_prompt': all(marker in runtime_guard for marker in (
        'Neue Secret-Circle-Version bereit', 'Jetzt aktualisieren', 'Später'
    )),

    # Reproducible build foundation.
    'lockfile_v3_present': lock.get('lockfileVersion') == 3 and lock.get('name') == package.get('name'),
    'playwright_pinned': package.get('devDependencies', {}).get('@playwright/test') == '1.54.2',
    'lockfile_audit_in_validate': 'scripts/lockfile_contract_audit.py' in validate_gate,

    # New cross-cutting release gates.
    'branch_contract_prepared': 'Secret Circle CI / validate' in branch_contract and 'OPEN / RELEASE NO_GO' in branch_contract,
    'branch_audit_in_validate': 'scripts/branch_protection_contract_audit.py' in validate_gate,
    'staging_smoke_documented': 'scripts/staging_smoke.py' in environments and 'npm run staging:smoke' in environments,
    'staging_contract_in_validate': 'scripts/staging_smoke_contract_audit.py' in validate_gate,
    'privacy_audit_in_validate': 'scripts/privacy_content_audit.py' in validate_gate,
    'reference_audit_in_validate': 'scripts/reference_content_audit.py' in validate_gate,

    # Existing quality gates remain wired.
    'foundation_unit_tests_present': all(marker in unit_gate for marker in (
        'tests/session-ledger.test.js', 'tests/party-session-controls.test.js',
        'tests/backup-schema-registry.test.js', 'tests/service-worker.test.js'
    )),
    'foundation_syntax_checks_present': all(marker in syntax_gate for marker in (
        'backup-schema-registry.js', 'party-data-tools.js', 'session-ledger.js',
        'party-session-controls.js', 'party-hub-timers.js', 'party-hub.js', 'sw.js'
    )),
}

failed = [name for name, passed in checks.items() if not passed]
if failed:
    raise SystemExit('Foundation contract audit failed: ' + ', '.join(failed))

print(json.dumps({
    'foundation_contract_audit': 'PASS',
    'foundation_generation': 2,
    'backup_registry': 'v2',
    'pwa_cache': cache_name,
    'lockfile': 'v3',
    'npm_ci_online_verified': False,
    'branch_protection_verified': False,
    'https_staging_verified': False,
    'real_device_verified': False,
    'checks': checks,
}, ensure_ascii=False, indent=2))
