#!/usr/bin/env python3
from pathlib import Path
import json
import re

ROOT = Path(__file__).resolve().parents[1]
read = lambda relative: (ROOT / relative).read_text(encoding='utf-8')

required = [
    'backup-schema-registry.js',
    'party-data-tools.js',
    'BACKUP_SCHEMAS.md',
    'privacy.html',
    'sw.js',
    'package.json',
    'tests/backup-schema-registry.test.js',
    'tests/e2e/party-data.spec.js',
    'tests/service-worker.test.js',
]
missing = [relative for relative in required if not (ROOT / relative).is_file()]
if missing:
    raise SystemExit('Backup contract missing files: ' + ', '.join(missing))

registry = read('backup-schema-registry.js')
tools = read('party-data-tools.js')
docs = read('BACKUP_SCHEMAS.md')
privacy = read('privacy.html')
worker = read('sw.js')
unit_test = read('tests/backup-schema-registry.test.js')
e2e_test = read('tests/e2e/party-data.spec.js')
service_worker_test = read('tests/service-worker.test.js')
package = json.loads(read('package.json'))

cache_match = re.search(r"const CACHE='(secret-circle-v\d+)'", worker)
if not cache_match:
    raise SystemExit('Backup contract cannot parse current service-worker cache.')
current_cache = cache_match.group(1)

checks = {
    'registry_v2': 'const VERSION = 2;' in registry,
    'central_complete_schema': all(marker in registry for marker in (
        "format: 'secret-circle-complete-backup'",
        'maximumEntries: 100',
        'maximumValueBytes: 1_000_000',
        'isAllowedCompleteStorageKey',
    )),
    'runtime_v5': 'const VERSION = 5;' in tools,
    'runtime_consumes_registry': all(marker in tools for marker in (
        "registry?.get?.('complete')",
        'const MAX_BYTES = schema.maximumBytes',
        'const MAX_ENTRIES = schema.maximumEntries',
        'const MAX_VALUE_BYTES = schema.maximumValueBytes',
        "registry.validateHeader(payload, 'complete')",
        'registry.isAllowedCompleteStorageKey',
    )),
    'managed_restore_boundary': all(marker in tools for marker in (
        'function snapshotManagedEntries()',
        'function clearManagedEntries()',
        'const snapshot = snapshotManagedEntries();',
        'clearManagedEntries();',
        'writeEntries(target);',
    )),
    'structured_json_before_mutation': all(marker in tools for marker in (
        'function parseStoredJson(key, value)',
        'parsed = JSON.parse(value);',
        "throw new Error(`Ungültiges JSON für ${key}`)",
        "throw new Error(`Ungültige Datenstruktur für ${key}`)",
        'parseStoredJson(key, value);',
    )),
    'full_delete_still_separate': all(marker in tools for marker in (
        'function clearAllSecretCircleEntries()',
        'function deleteAll()',
        'clearAllSecretCircleEntries();',
    )),
    'future_namespace_user_copy': 'werden bei einem Import nicht verändert' in tools,
    'registry_unit_contract': all(marker in unit_test for marker in (
        'Registry.version, 2',
        'completeBackupUsesCentralRegistry',
        'completeBackupNoDuplicatedRegistryConstants',
    )),
    'browser_future_key_contract': all(marker in e2e_test for marker in (
        'preserves unknown future Secret Circle namespaces',
        'secret-circle-future-feature-v99',
    )),
    'browser_structured_json_contract': all(marker in e2e_test for marker in (
        'plain text in an allowed storage key is rejected before mutation',
        'primitive JSON in an allowed storage key is rejected before mutation',
    )),
    'browser_rollback_contract': 'failed import write rolls back every previous managed local entry' in e2e_test,
    'browser_full_delete_contract': 'unknown Secret Circle namespaces' in e2e_test,
    'offline_tools_present': './party-data-tools.js' in worker,
    'service_worker_contract': current_cache in service_worker_test and 'completeBackupHardeningOffline' in service_worker_test,
    'docs_current_cache': current_cache in docs and current_cache in privacy,
    'docs_v51_semantics': all(marker in docs for marker in (
        'Restore-Vertrag seit Offline-Core v51',
        'bei einem Restore nicht gelöscht',
        'strukturierte JSON-Wurzel',
        'nur verwaltete Keys auf Snapshot zurückrollen',
    )),
    'unit_gate': 'tests/backup-schema-registry.test.js' in package.get('scripts', {}).get('test', ''),
    'syntax_gate_runtime': 'node --check party-data-tools.js' in package.get('scripts', {}).get('check', ''),
    'e2e_gate': package.get('scripts', {}).get('test:e2e') == 'playwright test',
}

for forbidden in (
    "const FORMAT = 'secret-circle-complete-backup'",
    'const MAX_BYTES = 1_500_000',
    'const MAX_ENTRIES = 100',
    'const MAX_VALUE_BYTES = 1_000_000',
):
    if forbidden in tools:
        checks[f'no_duplicate_{forbidden}'] = False

failed = [name for name, passed in checks.items() if not passed]
if failed:
    raise SystemExit('Backup contract audit failed: ' + ', '.join(failed))

print(json.dumps({
    'backup_contract_audit': 'PASS',
    'registry_version': 2,
    'complete_runtime_version': 5,
    'pwa_cache': current_cache,
    'managed_restore_only': True,
    'unknown_future_namespaces_preserved_on_restore': True,
    'structured_json_required_before_mutation': True,
    'write_failure_rollback_contract': True,
    'full_delete_remains_prefix_wide': True,
    'checks': checks,
}, ensure_ascii=False, indent=2))
