#!/usr/bin/env python3
from pathlib import Path
import json
import re

ROOT = Path(__file__).resolve().parents[1]
read = lambda relative: (ROOT / relative).read_text(encoding='utf-8')

required = [
    'package.json', 'manifest.webmanifest', 'sw.js', 'runtime-guard.js',
    'party.html', 'quick-play.html', 'privacy.html', 'party-routing.js', 'party-release-structure.js',
    'party-core-release-catalog.js', 'party-core-classic-content.js',
    'session-ledger.js', 'party-session-controls.js', 'party-hub-timers.js', 'party-hub.js',
    'backup-schema-registry.js', 'party-data-tools.js',
    'CONTENT_AGE_POLICY.md', 'CORE_CONTENT_REVIEW.md', 'ACCESSIBILITY.md', 'BETA_TEST_PLAN.md',
    'LEGAL_CHECKLIST.md', 'THIRD_PARTY_NOTICES.md', 'SUPPORT.md', 'INCIDENT_RESPONSE.md', 'MAINTENANCE.md',
    'ENVIRONMENTS.md', 'ARCHITECTURE.md', 'DEPLOYMENT.md', 'RELEASE_CHECKLIST.md', 'RELEASE_SCOPE_2027.md', 'ROADMAP_2027.md',
    'tests/service-worker.test.js', 'tests/core-content-quality.test.js', 'tests/accessibility-contract.test.js',
    'tests/backup-schema-registry.test.js', 'tests/e2e/accessibility-core.spec.js',
    '.github/workflows/ci.yml', '.github/workflows/cross-browser.yml',
]
for relative in required:
    if not (ROOT / relative).is_file():
        raise SystemExit(f'Release audit missing file: {relative}')

package = json.loads(read('package.json'))
manifest = json.loads(read('manifest.webmanifest'))
sw = read('sw.js')
runtime = read('runtime-guard.js')
party = read('party.html')
quick = read('quick-play.html')
privacy = read('privacy.html')
routing = read('party-routing.js')
release_structure = read('party-release-structure.js')
release_content = read('party-core-release-catalog.js')
classic_content = read('party-core-classic-content.js')
registry = read('backup-schema-registry.js')
data_tools = read('party-data-tools.js')
architecture = read('ARCHITECTURE.md')
deployment = read('DEPLOYMENT.md')
environments = read('ENVIRONMENTS.md')
service_worker_test = read('tests/service-worker.test.js')
content_test = read('tests/core-content-quality.test.js')
content_policy = read('CONTENT_AGE_POLICY.md')
content_review = read('CORE_CONTENT_REVIEW.md')
accessibility = read('ACCESSIBILITY.md')
beta_plan = read('BETA_TEST_PLAN.md')
legal = read('LEGAL_CHECKLIST.md')
third_party = read('THIRD_PARTY_NOTICES.md')
support = read('SUPPORT.md')
incident = read('INCIDENT_RESPONSE.md')
maintenance = read('MAINTENANCE.md')
workflow = read('.github/workflows/ci.yml')
cross_workflow = read('.github/workflows/cross-browser.yml')

cache_match = re.search(r"const CACHE='(secret-circle-v(\d+))'", sw)
staging_match = re.search(r"const STAGING_CACHE='(secret-circle-v(\d+)-staging)'", sw)
if not cache_match or not staging_match:
    raise SystemExit('PWA cache contract could not be parsed.')
cache_name = cache_match.group(1)
cache_generation = int(cache_match.group(2))
staging_name = staging_match.group(1)
staging_generation = int(staging_match.group(2))

catalog_chain = (
    'party-catalog.js', 'party-expansion.js', 'party-trending-catalog.js',
    'party-mega-catalog.js', 'party-viral-catalog.js',
    'party-core-release-catalog.js', 'party-core-classic-content.js', 'party-routing.js'
)

def ordered(source: str, names: tuple[str, ...]) -> bool:
    try:
        positions = [source.index(name) for name in names]
    except ValueError:
        return False
    return positions == sorted(positions)

core_ids_match = re.search(r'const CORE_IDS = Object\.freeze\(\[(.*?)\]\);', release_structure, re.S)
lab_ids_match = re.search(r'const LAB_IDS = Object\.freeze\(\[(.*?)\]\);', release_structure, re.S)
core_count = len(re.findall(r"'[^']+'", core_ids_match.group(1))) if core_ids_match else 0
lab_count = len(re.findall(r"'[^']+'", lab_ids_match.group(1))) if lab_ids_match else 0
extended_count = 45 - core_count - lab_count

unit_gate = package.get('scripts', {}).get('test', '')
syntax_gate = package.get('scripts', {}).get('check', '')
validate_gate = package.get('scripts', {}).get('validate', '')

checks = {
    'package_version': package.get('version') == '1.0.0-beta.3',
    'node_baseline': package.get('engines', {}).get('node') == '>=20',
    'playwright_pinned': package.get('devDependencies', {}).get('@playwright/test') == '1.54.2',
    'manifest_party_hub': manifest.get('name') == 'Secret Circle – Party Hub' and manifest.get('start_url') == './party.html',
    'standalone_pwa': manifest.get('display') == 'standalone' and manifest.get('scope') == './',
    'cache_generations_match': cache_generation == staging_generation,
    'cache_test_synced': cache_name in service_worker_test and staging_name in service_worker_test,
    'cache_architecture_synced': cache_name in architecture,
    'cache_deployment_synced': cache_name in deployment,
    'cache_privacy_synced': cache_name in privacy,
    'controlled_update': "event.data?.type === 'SKIP_WAITING'" in sw and 'await caches.delete(CACHE)' not in sw,
    'visible_update_prompt': all(marker in runtime for marker in ('Neue Secret-Circle-Version bereit', 'Jetzt aktualisieren', 'Später', 'hasActiveSession')),
    'release_tier_counts': (core_count, extended_count, lab_count) == (15, 13, 17),
    'party_catalog_order': ordered(party, catalog_chain),
    'quick_catalog_order': ordered(quick, catalog_chain),
    'hub_timer_order': ordered(party, ('party-session-controls.js', 'party-hub-timers.js', 'party-hub.js')),
    'backup_registry_before_tools': ordered(party, ('backup-schema-registry.js', 'party-data-tools.js')),
    'backup_registry_v2': 'const VERSION = 2;' in registry and 'isAllowedCompleteStorageKey' in registry,
    'backup_runtime_uses_registry': all(marker in data_tools for marker in (
        'SecretCircleBackupSchemas', "registry.validateHeader(payload, 'complete')",
        'registry.isAllowedCompleteStorageKey', 'const MAX_BYTES = schema.maximumBytes'
    )),
    'hub_positioning_and_consent': 'Euer Party-Hub · privat · lokal' in party and 'Persönliche Inhalte sind freiwillig' in party and 'Überspringen ist jederzeit erlaubt' in party,
    'routing_uses_final_content': "require('./party-core-classic-content.js')" in routing and 'version: 8' in routing,
    'release_content_contract': all(marker in release_content for marker in ('coreReleaseContentVersion', 'coreReleaseContentGames', 'function mergeContent')),
    'classic_content_contract': all(marker in classic_content for marker in ('coreClassicContentVersion', 'coreClassicContentGames', 'function mergeNested', 'editorialReplacementCount')),
    'content_modules_offline': all(f"'./{asset}'" in sw for asset in ('party-core-release-catalog.js', 'party-core-classic-content.js')),
    'quantitative_content_targets': 'quantitativeTargetsMet: true' in content_test and 'assert.deepEqual(editorialShortfalls, []' in content_test,
    'privacy_content_regressions': 'privateDevicePromptsRemoved: true' in content_test,
    'content_policy_complete_quantities': 'alle 15 Kernspiele ihre definierten quantitativen Releaseziele erreicht' in content_policy,
    'content_review_has_15_core_rows': content_review.count('| PREPARED |') >= 15 and '15/15 Core-Quellpass' in content_review,
    'accessibility_contract_in_unit_gate': 'tests/accessibility-contract.test.js' in unit_gate,
    'accessibility_contract_in_syntax_gate': 'tests/accessibility-contract.test.js' in syntax_gate,
    'accessibility_e2e_in_syntax_gate': 'tests/e2e/accessibility-core.spec.js' in syntax_gate,
    'accessibility_manual_limits_explicit': 'PREPARED – reale Abnahme offen' in accessibility and '200 %' in accessibility and 'VoiceOver' in accessibility and 'TalkBack' in accessibility,
    'beta_plan_has_required_groups': all(marker in beta_plan for marker in ('G1', 'G2', 'G3', 'G4', 'G5', 'PN1', 'PN2', 'PN3')),
    'beta_plan_has_device_and_update_gates': all(marker in beta_plan for marker in ('Android', 'iPhone', 'VoiceOver', 'TalkBack', 'PWA-Update-Test', 'Rollback-Test')),
    'beta_plan_no_go_until_real': 'reale Durchführung offen' in beta_plan and 'Release **NO_GO**' in beta_plan,
    'environment_chain_documented': 'Local → CI/Test → HTTPS-Staging → Release Candidate → Production' in environments,
    'staging_origin_isolated': 'getrennte Origin' in environments and 'localStorage' in environments and 'Service-Worker' in environments,
    'environment_stays_no_go': 'konkrete HTTPS-Staging-URL offen' in environments and 'Production **NO_GO**' in environments,
    'legal_stays_no_go': 'LEGAL NO_GO' in legal and '20. Juli 2025' in legal and 'TDDDG' in legal,
    'third_party_inventory_explicit': all(marker in third_party for marker in ('@playwright/test', 'icon.svg', 'icon-192.png', 'icon-512.png', 'BLOCKED FOR FINAL SIGN-OFF')),
    'third_party_does_not_guess_asset_origin': 'kein Herkunfts-/Lizenznachweis gefunden' in third_party and 'nicht automatisch als eigenes Werk' in third_party,
    'support_has_real_contact_gate': 'TBD vor RC' in support and 'SUPPORT PREPARED / RELEASE NO_GO' in support,
    'incident_runbook_present': 'SEV-0' in incident and 'SEV-1' in incident and 'PRODUCTION NO_GO' in incident,
    'maintenance_contract_present': 'backup-schema-registry.js' in maintenance and 'PWA-/Service-Worker-Wartung' in maintenance,
    'main_ci_commands': all(command in workflow for command in ('npm run check', 'npm test', 'npm run validate', 'npm run test:e2e')),
    'cross_browser_commands': all(marker in cross_workflow for marker in ('chromium firefox webkit', 'npm run test:cross-browser')),
    'audits_in_validate_gate': all(marker in validate_gate for marker in ('scripts/architecture_audit.py', 'scripts/core_content_audit.py', 'scripts/performance_budget.py', 'scripts/release_audit.py')),
    'no_obsolete_legacy_guard': not (ROOT / 'session-ledger-legacy-guard.js').exists() and 'session-ledger-legacy-guard' not in sw,
}

failed = [name for name, passed in checks.items() if not passed]
if failed:
    raise SystemExit(f'Release audit failed: {", ".join(failed)}')

print(json.dumps({
    'release_audit': 'PASS',
    'package_version': package['version'],
    'pwa_cache': cache_name,
    'pwa_cache_generation': cache_generation,
    'release_tiers': {'core': core_count, 'extended': extended_count, 'labs': lab_count},
    'catalog_chain': catalog_chain,
    'backup_registry': 'v2',
    'core_content_modules': 2,
    'quantitative_core_content_targets': 'IMPLEMENTED_NOT_RUNNER_VERIFIED',
    'manual_core_source_review': '15_OF_15_PREPARED_REAL_GROUPS_OPEN',
    'accessibility': 'PREPARED_NOT_REAL_DEVICE_VERIFIED',
    'beta_plan': 'PREPARED_NOT_EXECUTED',
    'environments': 'PREPARED_STAGING_URL_OPEN',
    'third_party_inventory': 'IN_PROGRESS_PROVENANCE_OPEN',
    'legal_support_operations': 'PREPARED_NOT_FINAL',
    'public_release': 'NO_GO until CI, device, accessibility, party, content, rights, legal and operations gates pass',
    'checks': checks,
}, ensure_ascii=False, indent=2))
