#!/usr/bin/env python3
from pathlib import Path
import json
import re

ROOT = Path(__file__).resolve().parents[1]
read = lambda relative: (ROOT / relative).read_text(encoding='utf-8')

TOTAL_BUILT_INS = 55
EXPECTED_TIERS = {'core': 15, 'extended': 13, 'labs': 27}
WAVE_ONE_IDS = {
    'bluff-trivia', 'party-quiz', 'fact-or-fake', 'percent-guess',
    'fill-blank-battle', 'who-wrote-it', 'party-bracket',
    'undercover-similar-word', 'no-word-imposter', 'password-one-word',
}
BASE_CATALOG_CHAIN = (
    'party-catalog.js', 'party-expansion.js', 'party-trending-catalog.js',
    'party-mega-catalog.js', 'party-viral-catalog.js',
    'party-core-release-catalog.js', 'party-core-classic-content.js', 'party-routing.js',
)
WAVE_ONE_CATALOG_CHAIN = (
    'party-wave-one-catalog.js', 'party-wave-one-imposter-catalog.js',
    'party-wave-one-writing-catalog.js', 'party-wave-one-voting-catalog.js',
    'party-wave-one-bluff-catalog.js', 'party-wave-one-clue-catalog.js',
)
FULL_CATALOG_CHAIN = BASE_CATALOG_CHAIN + WAVE_ONE_CATALOG_CHAIN

required = [
    'package.json', 'package-lock.json', 'release-meta.json', 'release-evidence.json',
    'operator-release.json', 'manifest.webmanifest', 'sw.js', 'runtime-guard.js', '_headers',
    'icon.svg', 'icon-192.png', 'icon-512.png',
    'party.html', 'quick-play.html', 'privacy.html', 'party-release-structure.js',
    *FULL_CATALOG_CHAIN,
    'backup-schema-registry.js', 'party-data-tools.js',
    'CONTENT_AGE_POLICY.md', 'CORE_CONTENT_REVIEW.md', 'EXTENDED_LABS_CONTENT_REVIEW.md',
    'FAN_CONTENT_REVIEW.md', 'ACCESSIBILITY.md', 'BETA_TEST_PLAN.md',
    'LEGAL_CHECKLIST.md', 'THIRD_PARTY_NOTICES.md', 'SUPPORT.md', 'INCIDENT_RESPONSE.md',
    'ENVIRONMENTS.md', 'DEPLOYMENT.md', 'HOSTING_DECISION.md', 'RELEASE_CHECKLIST.md',
    'BRANCH_PROTECTION.md', 'ASSET_RIGHTS_SIGNOFF.md',
    'assets/manifests/asset-provenance.json',
    'scripts/privacy_content_audit.py', 'scripts/reference_content_audit.py',
    'scripts/extended_labs_content_audit.py', 'scripts/asset_provenance_audit.py',
    'scripts/media_inventory_audit.py', 'scripts/staging_smoke.py',
    'scripts/staging_smoke_contract_audit.py', 'scripts/operator_release_contract_audit.py',
    'scripts/release_evidence_audit.py', 'scripts/release_readiness_contract_audit.py',
    'tests/extended-labs-content-quality.test.js', 'tests/manifest-icons.test.js',
    'tests/service-worker.test.js', 'tests/pwa-head-metadata.test.js',
    '.github/workflows/ci.yml', '.github/workflows/cross-browser.yml',
]
missing = [relative for relative in required if not (ROOT / relative).is_file()]
if missing:
    raise SystemExit('Release audit missing files: ' + ', '.join(missing))

package = json.loads(read('package.json'))
lock = json.loads(read('package-lock.json'))
meta = json.loads(read('release-meta.json'))
evidence = json.loads(read('release-evidence.json'))
operator = json.loads(read('operator-release.json'))
manifest = json.loads(read('manifest.webmanifest'))
assets = json.loads(read('assets/manifests/asset-provenance.json'))
sw = read('sw.js')
runtime = read('runtime-guard.js')
party = read('party.html')
quick = read('quick-play.html')
release_structure = read('party-release-structure.js')
registry = read('backup-schema-registry.js')
data_tools = read('party-data-tools.js')
headers = read('_headers')
branch_contract = read('BRANCH_PROTECTION.md')
hosting = read('HOSTING_DECISION.md')
third_party = read('THIRD_PARTY_NOTICES.md')
asset_signoff = read('ASSET_RIGHTS_SIGNOFF.md')
extended_review = read('EXTENDED_LABS_CONTENT_REVIEW.md')
fan_review = read('FAN_CONTENT_REVIEW.md')
privacy_audit = read('scripts/privacy_content_audit.py')
reference_audit = read('scripts/reference_content_audit.py')
extended_audit = read('scripts/extended_labs_content_audit.py')
extended_test = read('tests/extended-labs-content-quality.test.js')
workflow = read('.github/workflows/ci.yml')
cross_workflow = read('.github/workflows/cross-browser.yml')

unit_gate = package.get('scripts', {}).get('test', '')
syntax_gate = package.get('scripts', {}).get('check', '')
validate_gate = package.get('scripts', {}).get('validate', '')


def ordered(source: str, names: tuple[str, ...]) -> bool:
    try:
        positions = [source.index(name) for name in names]
    except ValueError:
        return False
    return positions == sorted(positions)


cache_match = re.search(r"const CACHE='(secret-circle-v(\d+))'", sw)
staging_match = re.search(r"const STAGING_CACHE='(secret-circle-v(\d+)-staging)'", sw)
if not cache_match or not staging_match:
    raise SystemExit('Release audit cannot parse PWA cache generation.')
cache_name = cache_match.group(1)
staging_name = staging_match.group(1)
cache_generation = int(cache_match.group(2))
staging_generation = int(staging_match.group(2))

core_ids_match = re.search(r'const CORE_IDS = Object\.freeze\(\[(.*?)\]\);', release_structure, re.S)
lab_ids_match = re.search(r'const LAB_IDS = Object\.freeze\(\[(.*?)\]\);', release_structure, re.S)
core_ids = set(re.findall(r"'([^']+)'", core_ids_match.group(1))) if core_ids_match else set()
lab_ids = set(re.findall(r"'([^']+)'", lab_ids_match.group(1))) if lab_ids_match else set()
actual_tiers = {
    'core': len(core_ids),
    'extended': TOTAL_BUILT_INS - len(core_ids) - len(lab_ids),
    'labs': len(lab_ids),
}

asset_entries = assets.get('assets') if isinstance(assets.get('assets'), list) else []
asset_by_path = {
    entry.get('path'): entry for entry in asset_entries
    if isinstance(entry, dict) and isinstance(entry.get('path'), str)
}
required_assets = {'icon.svg', 'icon-192.png', 'icon-512.png'}
unresolved_assets = sorted(
    path for path, entry in asset_by_path.items() if entry.get('status') == 'unresolved'
)
verified_release_icons = all(
    asset_by_path.get(path, {}).get('status') == 'verified-own'
    and asset_by_path.get(path, {}).get('commercialUse') is True
    for path in required_assets
)

manifest_icons = manifest.get('icons') if isinstance(manifest.get('icons'), list) else []
manifest_by_src = {
    item.get('src'): item for item in manifest_icons
    if isinstance(item, dict) and isinstance(item.get('src'), str)
}

gates = evidence.get('gates') if isinstance(evidence.get('gates'), dict) else {}
allowed_gate_statuses = {'OPEN', 'BLOCKED', 'PASS', 'FAIL'}
release_status = evidence.get('evidenceStatus')
release_decision = evidence.get('releaseDecision')
operator_status = operator.get('evidenceStatus')
operator_gate = operator.get('operatorGate')
assets_gate = (gates.get('assetsThirdParty') or {}).get('status')
branch_gate = (gates.get('branchProtection') or {}).get('status')
branch_doc_match = re.search(r'Evidence-Status:\s*\*\*(OPEN|PASS)\*\*', branch_contract)
branch_doc_status = branch_doc_match.group(1) if branch_doc_match else None
expected_branch_doc_status = 'PASS' if branch_gate == 'PASS' else 'OPEN'

release_state_valid = (
    release_status in {'PREPARED', 'FINAL'}
    and release_decision in {'NO_GO', 'GO'}
    and not (release_status == 'PREPARED' and release_decision != 'NO_GO')
    and not (release_decision == 'GO' and release_status != 'FINAL')
)
operator_state_valid = (
    operator_status in {'PREPARED', 'FINAL'}
    and operator_gate in {'BLOCKED', 'READY'}
    and not (operator_status == 'PREPARED' and operator_gate != 'BLOCKED')
    and not (operator_gate == 'READY' and operator_status != 'FINAL')
)

checks = {
    'package_version': package.get('version') == '1.0.0-beta.3',
    'node_baseline': package.get('engines', {}).get('node') == '>=20',
    'playwright_pinned': package.get('devDependencies', {}).get('@playwright/test') == '1.54.2',
    'lockfile_v3': lock.get('lockfileVersion') == 3 and lock.get('name') == package.get('name'),

    'release_meta_v64': meta.get('sourceGeneration') == 'v64',
    'release_meta_package': meta.get('packageVersion') == package.get('version'),
    'release_meta_counts': meta.get('builtIns') == {'total': 55, 'core': 15, 'extended': 13, 'labs': 27},
    'release_tier_counts': actual_tiers == EXPECTED_TIERS,
    'wave_one_all_labs': WAVE_ONE_IDS.issubset(lab_ids),
    'wave_one_meta_complete': meta.get('waveOne', {}).get('planned') == 10 and meta.get('waveOne', {}).get('sourceImplemented') == 10,

    'party_full_catalog_order': ordered(party, FULL_CATALOG_CHAIN),
    'quick_full_catalog_order': ordered(quick, FULL_CATALOG_CHAIN),
    'all_catalogs_offline': all(f"'./{asset}'" in sw for asset in FULL_CATALOG_CHAIN),
    'cache_generations_match': cache_generation == staging_generation,
    'cache_meta_synced': meta.get('offlineCache') == {'production': cache_name, 'staging': staging_name},
    'controlled_update': "event.data?.type === 'SKIP_WAITING'" in sw and 'await caches.delete(CACHE)' not in sw,
    'visible_update_prompt': all(marker in runtime for marker in ('Neue Secret-Circle-Version bereit', 'Jetzt aktualisieren', 'Später')),

    'extended_labs_test_in_unit': 'tests/extended-labs-content-quality.test.js' in unit_gate,
    'extended_labs_test_in_syntax': 'node --check tests/extended-labs-content-quality.test.js' in syntax_gate,
    'extended_labs_audit_in_validate': 'scripts/extended_labs_content_audit.py' in validate_gate,
    'extended_labs_v64_contract': all(marker in extended_test for marker in (
        "require('../party-wave-one-clue-catalog.js')", 'catalog.games.length, 55',
        "{ core: 15, extended: 13, labs: 27 }", 'nonCoreGames.length, 40',
        'catalog.waveOneGameIds.length, 10', 'contentDriven.length, 38'
    )),
    'extended_review_v64': all(marker in extended_review for marker in (
        '40 Nicht-Core-Spiele', '13 Extended', '27 Labs', 'Wave 1 = 10/10', 'MANUAL SIGN-OFF OPEN'
    )),
    'extended_audit_v64': all(marker in extended_audit for marker in (
        "{'core': 15, 'extended': 13, 'labs': 27}", "node_payload.get('totalBuiltIns') != 55",
        "node_payload.get('nonCoreGames') != 40", "node_payload.get('waveOneCovered') != 10"
    )),

    'privacy_audit_in_validate': 'scripts/privacy_content_audit.py' in validate_gate,
    'privacy_wave_one_coverage': all(source in privacy_audit for source in WAVE_ONE_CATALOG_CHAIN)
        and "'wave_one_catalogs_scanned': len(WAVE_ONE_SOURCES)" in privacy_audit,
    'reference_audit_in_validate': 'scripts/reference_content_audit.py' in validate_gate,
    'reference_wave_one_coverage': all(source in reference_audit for source in WAVE_ONE_CATALOG_CHAIN)
        and "'wave_one_catalogs_scanned':6" in reference_audit.replace(' ', ''),
    'fan_review_current': all(marker in fan_review for marker in (
        'SOURCE COVERAGE HARDENED', 'Privacy-Source-Gate', 'Wave 1', 'verified-own',
        'MANUAL FINAL SIGN-OFF OPEN'
    )),

    'manifest_party_hub': manifest.get('name') == 'Secret Circle – Party Hub' and manifest.get('start_url') == './party.html',
    'manifest_icon_contract': (
        manifest_by_src.get('icon-192.png', {}).get('sizes') == '192x192'
        and manifest_by_src.get('icon-512.png', {}).get('sizes') == '512x512'
        and manifest_by_src.get('icon.svg', {}).get('sizes') == 'any'
    ),
    'release_icons_verified_own': verified_release_icons and not unresolved_assets,
    'asset_signoff_current': all(marker in asset_signoff for marker in (
        'SOURCE SIGN-OFF COMPLETE', 'verified-own', 'finaler RC-Visual-/Trademark-Review offen'
    )),
    'third_party_current': all(marker in third_party for marker in (
        'Icon-Provenienz gelöst', 'verified-own', 'finaler manueller Visual-/Marken-/Third-Party-Plausibilitätsreview'
    )),
    'asset_gate_not_false_positive': assets_gate in allowed_gate_statuses and not (
        assets_gate == 'PASS' and (unresolved_assets or release_status != 'FINAL')
    ),

    'backup_registry_v2': 'const VERSION = 2;' in registry and 'isAllowedCompleteStorageKey' in registry,
    'backup_runtime_uses_registry': all(marker in data_tools for marker in (
        'SecretCircleBackupSchemas', "registry.validateHeader(payload, 'complete')", 'registry.isAllowedCompleteStorageKey'
    )),

    'security_headers_source': all(marker in headers for marker in (
        "frame-ancestors 'none'", 'X-Content-Type-Options: nosniff',
        'Referrer-Policy: no-referrer', 'X-Frame-Options: DENY', 'Strict-Transport-Security'
    )),
    'service_worker_header_policy': '/sw.js' in headers and 'Cache-Control: no-cache' in headers,
    'hosting_contract_current': all(marker in hosting for marker in (
        cache_name, 'Response-Security-Header', 'Service-Worker Cache-Control', 'Production-Origin', 'Staging-Origin'
    )),

    'release_state_valid': release_state_valid,
    'release_gate_statuses_valid': all(
        isinstance(gate, dict) and gate.get('status') in allowed_gate_statuses
        for gate in gates.values()
    ),
    'operator_state_valid': operator_state_valid,
    'operator_context_v64': operator.get('releaseContext') == {
        'sourceGeneration': 'v64',
        'appVersion': '1.0.0-beta.3',
        'expectedCache': 'secret-circle-v64',
        'expectedStagingCache': 'secret-circle-v64-staging',
        'releaseTarget': '2027-01',
        'releaseDecision': 'NO_GO',
    },
    'operator_pass_requires_ready': all(
        (gates.get(name) or {}).get('status') != 'PASS' or operator_gate == 'READY'
        for name in ('legalPrivacy', 'supportIncident')
    ),
    'branch_contract_matches_evidence': branch_gate in allowed_gate_statuses and branch_doc_status == expected_branch_doc_status,

    'main_ci_commands': all(command in workflow for command in ('npm run check', 'npm test', 'npm run validate', 'npm run test:e2e')),
    'cross_browser_commands': all(marker in cross_workflow for marker in ('chromium firefox webkit', 'npm run test:cross-browser')),
    'cross_cutting_audits_in_validate': all(marker in validate_gate for marker in (
        'scripts/extended_labs_content_audit.py', 'scripts/privacy_content_audit.py',
        'scripts/reference_content_audit.py', 'scripts/asset_provenance_audit.py',
        'scripts/media_inventory_audit.py', 'scripts/staging_smoke_contract_audit.py',
        'scripts/operator_release_contract_audit.py', 'scripts/release_evidence_audit.py',
        'scripts/release_readiness_contract_audit.py', 'scripts/release_audit.py'
    )),
}

failed = [name for name, passed in checks.items() if not passed]
if failed:
    raise SystemExit('Release audit failed: ' + ', '.join(failed))


def gate_status(name):
    return (gates.get(name) or {}).get('status', 'MISSING')

print(json.dumps({
    'release_audit': 'PASS',
    'source_generation': meta.get('sourceGeneration'),
    'package_version': package.get('version'),
    'total_built_ins': TOTAL_BUILT_INS,
    'release_tiers': actual_tiers,
    'non_core_games': TOTAL_BUILT_INS - actual_tiers['core'],
    'wave_one_labs': sorted(WAVE_ONE_IDS),
    'wave_one_catalogs': len(WAVE_ONE_CATALOG_CHAIN),
    'catalog_chain': FULL_CATALOG_CHAIN,
    'pwa_cache': cache_name,
    'pwa_cache_generation': cache_generation,
    'asset_provenance': {
        'inventoried': len(asset_entries),
        'unresolved': unresolved_assets,
        'icons_verified_own': verified_release_icons,
        'release_gate': assets_gate,
    },
    'ci_gate': gate_status('ci'),
    'cross_browser_gate': gate_status('crossBrowser'),
    'branch_protection_gate': gate_status('branchProtection'),
    'staging_gate': gate_status('stagingHttpSmoke'),
    'legal_privacy_gate': gate_status('legalPrivacy'),
    'support_incident_gate': gate_status('supportIncident'),
    'operator_gate': operator_gate,
    'release_evidence_status': release_status,
    'release_decision': release_decision,
    'public_release': release_decision,
    'checks': checks,
}, ensure_ascii=False, indent=2))
