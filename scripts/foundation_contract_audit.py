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
legacy_guard = require_file('session-ledger-legacy-guard.js')
created_runtime = require_file('party-created-modes.js')
quick_runtime = require_file('party-quick-modes.js')
loader = require_file('quick-loader.js')
runtime_guard = require_file('runtime-guard.js')
service_worker = require_file('sw.js')
package = json.loads(require_file('package.json'))

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
    'creator_exact_once': all(marker in created_runtime for marker in ('SecretCircleSessionLedger', "completionId('created'", 'recordCompletion(loadHub()')),
    'quick_exact_once': all(marker in quick_runtime for marker in ('SecretCircleSessionLedger', "completionId('quick'", 'recordCompletion(loadHub()')),
    'mega_viral_guarded': all(marker in legacy_guard for marker in ('secret-circle-party-mega-active-v1', 'secret-circle-party-viral-active-v1', 'recordCompletion(baseHub, completion)')),
    'loader_orders_shared_runtime': all(marker in loader for marker in ('session-ledger.js', 'session-ledger-legacy-guard.js', 'scriptPlan')),
    'visible_pwa_update': all(marker in runtime_guard for marker in ('Neue Secret-Circle-Version bereit', 'Jetzt aktualisieren', "type: 'SKIP_WAITING'")),
    'staged_pwa_update': all(marker in service_worker for marker in ('STAGING_CACHE', 'stageCore', 'promoteStagedCore', "event.data?.type === 'SKIP_WAITING'")),
    'no_install_auto_activation': not bool(re.search(r"self\.addEventListener\('install',[\s\S]*?skipWaiting", service_worker)),
    'foundation_tests_in_unit_gate': all(marker in package.get('scripts', {}).get('test', '') for marker in (
        'tests/session-ledger.test.js',
        'tests/session-ledger-legacy-guard.test.js',
        'tests/session-ledger-integration.test.js',
        'tests/backup-schema-registry.test.js',
        'tests/pwa-update.test.js',
    )),
    'foundation_modules_in_syntax_gate': all(marker in package.get('scripts', {}).get('check', '') for marker in (
        'backup-schema-registry.js',
        'session-ledger.js',
        'session-ledger-legacy-guard.js',
        'runtime-guard.js',
        'sw.js',
    )),
}

failed = [name for name, passed in checks.items() if not passed]
if failed:
    raise SystemExit(f'Release-foundation contract audit failed: {", ".join(failed)}')

print(json.dumps({
    'foundation_contract_audit': 'PASS',
    'backup_schemas': ['word-imposter', 'complete', 'creator-library'],
    'maximum_backup_bytes': 1_500_000,
    'exact_once_engines': ['created', 'quick', 'mega-compatibility', 'viral-compatibility'],
    'controlled_pwa_updates': True,
    'checks': checks,
}, ensure_ascii=False, indent=2))
