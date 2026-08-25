#!/usr/bin/env python3
from pathlib import Path
import json
import re

ROOT = Path(__file__).resolve().parents[1]
read = lambda relative: (ROOT / relative).read_text(encoding='utf-8')

required = [
    'package.json', 'manifest.webmanifest', 'sw.js', 'runtime-guard.js',
    'icon.svg', 'icon-192.png', 'icon-512.png',
    'party.html', 'quick-play.html', 'privacy.html', 'party-routing.js', 'party-release-structure.js',
    'party-expansion.js', 'party-mega-catalog.js', 'party-viral-catalog.js',
    'party-core-release-catalog.js', 'party-core-classic-content.js',
    'session-ledger.js', 'party-session-controls.js', 'party-hub-timers.js', 'party-hub.js',
    'backup-schema-registry.js', 'party-data-tools.js',
    'CONTENT_AGE_POLICY.md', 'CORE_CONTENT_REVIEW.md', 'FAN_CONTENT_REVIEW.md', 'ACCESSIBILITY.md', 'BETA_TEST_PLAN.md',
    'LEGAL_CHECKLIST.md', 'THIRD_PARTY_NOTICES.md', 'SUPPORT.md', 'INCIDENT_RESPONSE.md', 'MAINTENANCE.md',
    'ENVIRONMENTS.md', 'ARCHITECTURE.md', 'DEPLOYMENT.md', 'RELEASE_CHECKLIST.md', 'RELEASE_SCOPE_2027.md', 'ROADMAP_2027.md',
    'BRANCH_PROTECTION.md', 'release-evidence.json', 'operator-release.json',
    'OPERATOR_RELEASE_SIGNOFF.md', 'OPERATOR_EVIDENCE_LOG.md', 'HOSTING_DECISION.md',
    'assets/manifests/asset-provenance.json', 'scripts/asset_provenance_audit.py',
    'scripts/media_inventory_audit.py', 'scripts/public_release_placeholder_audit.py', 'scripts/reference_content_audit.py',
    'scripts/operator_release_contract_audit.py', 'scripts/release_evidence_audit.py', 'scripts/release_readiness_contract_audit.py',
    'tests/manifest-icons.test.js', 'tests/service-worker.test.js', 'tests/core-content-quality.test.js',
    'tests/party-mega-catalog.test.js', 'tests/party-viral-catalog.test.js',
    'tests/accessibility-contract.test.js', 'tests/backup-schema-registry.test.js', 'tests/e2e/accessibility-core.spec.js',
    'tests/word-imposter-data-contract.test.js',
    '.github/workflows/ci.yml', '.github/workflows/cross-browser.yml',
]
for relative in required:
    if not (ROOT / relative).is_file():
        raise SystemExit(f'Release audit missing file: {relative}')

package = json.loads(read('package.json'))
manifest = json.loads(read('manifest.webmanifest'))
asset_manifest = json.loads(read('assets/manifests/asset-provenance.json'))
release_evidence = json.loads(read('release-evidence.json'))
operator_evidence = json.loads(read('operator-release.json'))
sw = read('sw.js')
runtime = read('runtime-guard.js')
party = read('party.html')
quick = read('quick-play.html')
privacy = read('privacy.html')
routing = read('party-routing.js')
release_structure = read('party-release-structure.js')
expansion_content = read('party-expansion.js')
mega_content = read('party-mega-catalog.js')
viral_content = read('party-viral-catalog.js')
release_content = read('party-core-release-catalog.js')
classic_content = read('party-core-classic-content.js')
registry = read('backup-schema-registry.js')
data_tools = read('party-data-tools.js')
architecture = read('ARCHITECTURE.md')
deployment = read('DEPLOYMENT.md')
environments = read('ENVIRONMENTS.md')
branch_contract = read('BRANCH_PROTECTION.md')
manifest_icon_test = read('tests/manifest-icons.test.js')
service_worker_test = read('tests/service-worker.test.js')
content_test = read('tests/core-content-quality.test.js')
mega_test = read('tests/party-mega-catalog.test.js')
viral_test = read('tests/party-viral-catalog.test.js')
word_data_test = read('tests/word-imposter-data-contract.test.js')
content_policy = read('CONTENT_AGE_POLICY.md')
content_review = read('CORE_CONTENT_REVIEW.md')
fan_review = read('FAN_CONTENT_REVIEW.md')
accessibility = read('ACCESSIBILITY.md')
beta_plan = read('BETA_TEST_PLAN.md')
legal = read('LEGAL_CHECKLIST.md')
third_party = read('THIRD_PARTY_NOTICES.md')
support = read('SUPPORT.md')
incident = read('INCIDENT_RESPONSE.md')
maintenance = read('MAINTENANCE.md')
operator_signoff = read('OPERATOR_RELEASE_SIGNOFF.md')
operator_log = read('OPERATOR_EVIDENCE_LOG.md')
hosting_decision = read('HOSTING_DECISION.md')
asset_audit = read('scripts/asset_provenance_audit.py')
media_audit = read('scripts/media_inventory_audit.py')
placeholder_audit = read('scripts/public_release_placeholder_audit.py')
reference_audit = read('scripts/reference_content_audit.py')
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
asset_entries = asset_manifest.get('assets') if isinstance(asset_manifest.get('assets'), list) else []
asset_paths = {entry.get('path') for entry in asset_entries if isinstance(entry, dict)}
asset_statuses = {entry.get('path'): entry.get('status') for entry in asset_entries if isinstance(entry, dict)}
asset_by_path = {entry.get('path'): entry for entry in asset_entries if isinstance(entry, dict) and isinstance(entry.get('path'), str)}
required_assets = {'icon.svg', 'icon-192.png', 'icon-512.png'}
manifest_icons = manifest.get('icons') if isinstance(manifest.get('icons'), list) else []
manifest_icons_by_src = {
    entry.get('src'): entry for entry in manifest_icons
    if isinstance(entry, dict) and isinstance(entry.get('src'), str)
}
removed_anime_markers = (
    'Son Goku', 'Naruto Uzumaki', 'Monkey D. Ruffy', 'Satoru Gojo', 'Pikachu', 'Subaru Natsuki'
)

release_status = release_evidence.get('evidenceStatus')
release_decision = release_evidence.get('releaseDecision')
release_candidate = release_evidence.get('candidate') if isinstance(release_evidence.get('candidate'), dict) else {}
release_gates = release_evidence.get('gates') if isinstance(release_evidence.get('gates'), dict) else {}
operator_status = operator_evidence.get('evidenceStatus')
operator_gate = operator_evidence.get('operatorGate')
allowed_gate_statuses = {'OPEN', 'BLOCKED', 'PASS', 'FAIL'}

release_state_valid = (
    release_status in {'PREPARED', 'FINAL'}
    and release_decision in {'NO_GO', 'GO'}
    and not (release_status == 'PREPARED' and release_decision != 'NO_GO')
    and not (release_status == 'PREPARED' and release_candidate.get('commit') is not None)
    and not (release_decision == 'GO' and release_status != 'FINAL')
)
operator_state_valid = (
    operator_status in {'PREPARED', 'FINAL'}
    and operator_gate in {'BLOCKED', 'READY'}
    and not (operator_status == 'PREPARED' and operator_gate != 'BLOCKED')
    and not (operator_gate == 'READY' and operator_status != 'FINAL')
)

unresolved_assets = sorted(path for path, status in asset_statuses.items() if status == 'unresolved')
assets_gate_status = (release_gates.get('assetsThirdParty') or {}).get('status')
asset_gate_coherent = assets_gate_status in allowed_gate_statuses and not (assets_gate_status == 'PASS' and unresolved_assets)
operator_gate_coherent = all(
    (release_gates.get(name) or {}).get('status') != 'PASS' or operator_gate == 'READY'
    for name in ('legalPrivacy', 'supportIncident')
)
branch_doc_match = re.search(r'Evidence-Status:\s*\*\*(OPEN|PASS)\*\*', branch_contract)
branch_doc_status = branch_doc_match.group(1) if branch_doc_match else None
branch_gate_status = (release_gates.get('branchProtection') or {}).get('status')
branch_expected_doc_status = 'PASS' if branch_gate_status == 'PASS' else 'OPEN'

checks = {
    'package_version': package.get('version') == '1.0.0-beta.3',
    'node_baseline': package.get('engines', {}).get('node') == '>=20',
    'playwright_pinned': package.get('devDependencies', {}).get('@playwright/test') == '1.54.2',
    'manifest_party_hub': manifest.get('name') == 'Secret Circle – Party Hub' and manifest.get('start_url') == './party.html',
    'standalone_pwa': manifest.get('display') == 'standalone' and manifest.get('scope') == './',
    'manifest_icon_contract_v42': (
        manifest_icons_by_src.get('icon-192.png', {}).get('sizes') == '192x192'
        and manifest_icons_by_src.get('icon-192.png', {}).get('type') == 'image/png'
        and manifest_icons_by_src.get('icon-512.png', {}).get('sizes') == '512x512'
        and manifest_icons_by_src.get('icon-512.png', {}).get('type') == 'image/png'
        and manifest_icons_by_src.get('icon.svg', {}).get('sizes') == 'any'
        and manifest_icons_by_src.get('icon.svg', {}).get('type') == 'image/svg+xml'
    ),
    'manifest_icon_test_contract': all(marker in manifest_icon_test for marker in (
        'pngDimensions', "'icon-192.png'", "'icon-512.png'", "'icon.svg'",
        '192x192', '512x512', 'offlineIconContract: true'
    )),
    'manifest_icon_test_in_unit_gate': 'tests/manifest-icons.test.js' in unit_gate,
    'manifest_icon_test_in_syntax_gate': 'node --check tests/manifest-icons.test.js' in syntax_gate,
    'cache_generations_match': cache_generation == staging_generation,
    'cache_test_synced': cache_name in service_worker_test and staging_name in service_worker_test,
    'cache_docs_synced': all(cache_name in source for source in (architecture, deployment, privacy, environments)),
    'controlled_update': "event.data?.type === 'SKIP_WAITING'" in sw and 'await caches.delete(CACHE)' not in sw,
    'visible_update_prompt': all(marker in runtime for marker in ('Neue Secret-Circle-Version bereit', 'Jetzt aktualisieren', 'Später', 'hasActiveSession')),
    'pwa_icons_offline': all(f"'./{asset}'" in sw for asset in ('icon.svg', 'icon-192.png', 'icon-512.png')),
    'pwa_icons_in_service_worker_test': all(marker in service_worker_test for marker in ('icon\\.svg', 'icon-192\\.png', 'icon-512\\.png', 'rasterPwaIconsOffline: true')),
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
    'classic_content_v4_reference_safe': all(marker in classic_content for marker in (
        'const VERSION = 4;', 'coreClassicContentVersion', 'referenceSafeGameOverrides',
        'Anime-Archetypen erraten', "title: 'Spektrum-Tipp'", 'referenceSafeRemovedConcreteNames: 40'
    )) and "Chrome: 'Tab'" not in classic_content,
    'classic_v4_regression_test': all(marker in content_test for marker in (
        'coreClassicContentVersion, 4', 'editorialReplacementCount, 2',
        'chromeReferenceRemoved: true', 'wavelengthBrandingRemoved: true', "new Set(['anime-guess', 'wavelength'])"
    )),
    'spectrum_and_browser_clean_upstream': all(marker in expansion_content for marker in (
        "id: 'wavelength', title: 'Spektrum-Tipp'", "banned: ['Webseite', 'Internet', 'Tab']"
    )) and 'Wellenlänge' not in expansion_content and 'Chrome' not in expansion_content,
    'anime_clean_in_shipped_mega_source': all(marker in mega_content for marker in (
        "id: 'anime-guess', title: 'Anime-Archetypen erraten'", 'Ehrgeiziger Kampfkunst-Schüler', 'Fluchjägerin'
    )) and all(marker not in mega_content for marker in removed_anime_markers),
    'mega_source_reference_regression': all(marker in mega_test for marker in (
        'animeSourceReferenceSafe: true', 'concreteAnimeReferencesRemovedFromShippedSource',
        'franchiseLikeLionReferenceRemoved: true'
    )),
    'franchise_like_lion_removed': 'Löwenkönig' not in mega_content and "['🦁🌾', 'Löwe']" in mega_content,
    'viral_reference_cleanup': all(marker in viral_content for marker in (
        'Ecken eines Fünfecks', 'Bahnen einer typischen 400-Meter-Leichtathletikanlage',
        'Gewinnsätze in einem Best-of-five-Tennismatch'
    )) and all(marker not in viral_content for marker in (
        'Ringe im olympischen Symbol', 'Bahnen eines olympischen 400-Meter-Stadions häufig',
        'Sätze zum Sieg im Herren-Grand-Slam-Tennis'
    )),
    'viral_reference_regression_test': 'unnecessarySportReferenceTermsRemoved: true' in viral_test,
    'content_modules_offline': all(f"'./{asset}'" in sw for asset in (
        'party-expansion.js', 'party-mega-catalog.js', 'party-viral-catalog.js',
        'party-core-release-catalog.js', 'party-core-classic-content.js'
    )),
    'quantitative_content_targets': 'quantitativeTargetsMet: true' in content_test and 'assert.deepEqual(editorialShortfalls, []' in content_test,
    'privacy_content_regressions': 'privateDevicePromptsRemoved: true' in content_test,
    'core_reference_cleanup_regression': 'unnecessaryCoreReferenceTermsRemoved: true' in content_test,
    'anime_reference_cleanup_regression': 'concreteAnimeFanNamesRemoved: true' in content_test,
    'word_imposter_data_contract': all(marker in word_data_test for marker in (
        'MAX_CUSTOM_CATEGORIES = 50', 'MAX_CUSTOM_ENTRIES = 200', 'nextPendingVoterIndex',
        'silentCategoryTruncationRejected', 'backupUiUsesStoreByteLimit'
    )),
    'reference_content_audit_contract': all(marker in reference_audit for marker in (
        'SHIPPED_CONTENT_SOURCES', 'BLOCKED_LITERALS', 'REVIEW_REQUIRED_LITERALS',
        'stable_internal_id_wavelength_allowed', 'physical_source_cleanup_required'
    )),
    'reference_content_audit_in_validate': 'scripts/reference_content_audit.py' in validate_gate,
    'media_inventory_audit_contract': all(marker in media_audit for marker in (
        'MEDIA_SUFFIXES', 'IGNORED_DIRS', 'EXPECTED_CURRENT_MEDIA',
        'all_media_in_provenance_manifest', 'current_release_media_contract'
    )),
    'media_inventory_audit_in_validate': 'scripts/media_inventory_audit.py' in validate_gate,
    'media_inventory_documented': all(marker in third_party for marker in (
        'Gebündeltes Media-Inventar', 'icon.svg', 'icon-192.png', 'icon-512.png', 'media_inventory_audit.py'
    )),
    'content_policy_complete_quantities': 'alle 15 Kernspiele ihre definierten quantitativen Releaseziele erreicht' in content_policy,
    'content_review_core_contract': all(marker in content_review for marker in ('Word Imposter', 'Mafia', 'Nur falsche Antworten')),
    'fan_reference_review_contract': all(marker in fan_review for marker in ('Anime-Archetypen erraten', 'Viral `higher-lower`')),
    'fan_media_review_contract': all(marker in fan_review for marker in ('Gebündelter Visual-/Media-Pass', 'media_inventory_audit.py', 'manifest-icons.test.js')),
    'accessibility_contract_in_unit_gate': 'tests/accessibility-contract.test.js' in unit_gate,
    'accessibility_contract_in_syntax_gate': 'tests/accessibility-contract.test.js' in syntax_gate,
    'accessibility_e2e_in_syntax_gate': 'tests/e2e/accessibility-core.spec.js' in syntax_gate,
    'accessibility_real_test_contract': all(marker in accessibility for marker in ('200 %', 'VoiceOver', 'TalkBack')),
    'beta_plan_has_required_groups': all(marker in beta_plan for marker in ('G1', 'G2', 'G3', 'G4', 'G5', 'PN1', 'PN2', 'PN3')),
    'beta_plan_has_device_and_update_gates': all(marker in beta_plan for marker in ('Android', 'iPhone', 'VoiceOver', 'TalkBack', 'PWA-Update-Test', 'Rollback-Test')),
    'environment_chain_documented': 'Local → CI/Test → HTTPS-Staging → Release Candidate → Production' in environments,
    'staging_origin_isolated': 'getrennte Origin' in environments and 'localStorage' in environments and 'Service-Worker' in environments,
    'hosting_decision_contract': all(marker in hosting_decision for marker in (cache_name, 'Staging-Origin', 'Production-Origin', 'Accesslogs', 'Rollback')),
    'legal_release_contract': all(marker in legal for marker in ('operator-release.json', 'DDG', 'TDDDG', 'VSBG', '20. Juli 2025')),
    'asset_provenance_schema': asset_manifest.get('schemaVersion') == 1 and required_assets.issubset(asset_paths),
    'asset_provenance_statuses_valid': all(status in {'unresolved', 'verified-own', 'verified-third-party'} for status in asset_statuses.values()),
    'asset_provenance_v42_metadata': (
        asset_by_path.get('icon-192.png', {}).get('dimensions') == '192x192'
        and len(str(asset_by_path.get('icon-192.png', {}).get('sha256', ''))) == 64
        and asset_by_path.get('icon-192.png', {}).get('derivedFrom') == 'icon.svg'
        and asset_by_path.get('icon-512.png', {}).get('dimensions') == '512x512'
        and len(str(asset_by_path.get('icon-512.png', {}).get('sha256', ''))) == 64
        and asset_by_path.get('icon-512.png', {}).get('derivedFrom') == 'icon.svg'
    ),
    'asset_release_gate_coherent': asset_gate_coherent,
    'asset_provenance_audit_in_validate': 'scripts/asset_provenance_audit.py' in validate_gate,
    'asset_provenance_audit_v42_contract': all(marker in asset_audit for marker in (
        'hashlib', 'struct', 'sha256_file', 'png_dimensions', 'expected_png_dimensions',
        'PWA manifest icon metadata mismatch', 'hash_drift_detection', 'pwa_manifest_icon_contract'
    )),
    'public_placeholder_audit_in_validate': 'scripts/public_release_placeholder_audit.py' in validate_gate,
    'public_placeholder_audit_contract': all(marker in placeholder_audit for marker in ('PUBLIC_FILES', 'example-domain', 'REPLACE_ME', 'public_release_placeholder_audit')),
    'third_party_inventory_explicit': all(marker in third_party for marker in ('@playwright/test', 'Apache-2.0', 'asset-provenance.json', 'asset_provenance_audit.py')),
    'third_party_does_not_guess_asset_origin': 'nicht automatisch als eigenes Werk' in third_party and 'unresolved' in third_party,
    'support_release_contract': all(marker in support for marker in ('SUPPORT PASS', 'Security/Privacy', 'echter Supportkontakt')),
    'incident_runbook_present': all(marker in incident for marker in ('SEV-0', 'SEV-1', 'INCIDENT RESPONSE PASS', 'Rollback')),
    'maintenance_contract_present': 'backup-schema-registry.js' in maintenance and 'PWA-/Service-Worker-Wartung' in maintenance,
    'release_evidence_state_valid': release_state_valid,
    'release_gate_statuses_valid': all(
        isinstance(gate, dict) and gate.get('status') in allowed_gate_statuses
        for gate in release_gates.values()
    ),
    'operator_state_valid': operator_state_valid,
    'operator_release_gate_coherent': operator_gate_coherent,
    'operator_signoff_contract': all(marker in operator_signoff for marker in ('operator-release.json', 'OPERATOR_EVIDENCE_LOG.md', 'FINAL / READY')),
    'operator_evidence_log_contract': all(marker in operator_log for marker in ('Supportkontakt-Test', 'Probe-SEV-1', 'HTTPS-Staging-Rollback-Drill')),
    'branch_release_gate_coherent': branch_gate_status in allowed_gate_statuses and branch_doc_status == branch_expected_doc_status,
    'main_ci_commands': all(command in workflow for command in ('npm run check', 'npm test', 'npm run validate', 'npm run test:e2e')),
    'cross_browser_commands': all(marker in cross_workflow for marker in ('chromium firefox webkit', 'npm run test:cross-browser')),
    'audits_in_validate_gate': all(marker in validate_gate for marker in (
        'scripts/architecture_audit.py', 'scripts/core_content_audit.py', 'scripts/reference_content_audit.py',
        'scripts/asset_provenance_audit.py', 'scripts/media_inventory_audit.py',
        'scripts/public_release_placeholder_audit.py', 'scripts/operator_release_contract_audit.py',
        'scripts/release_evidence_audit.py', 'scripts/release_readiness_contract_audit.py',
        'scripts/performance_budget.py', 'scripts/release_audit.py'
    )),
    'no_obsolete_legacy_guard': not (ROOT / 'session-ledger-legacy-guard.js').exists() and 'session-ledger-legacy-guard' not in sw,
}

failed = [name for name, passed in checks.items() if not passed]
if failed:
    raise SystemExit(f'Release audit failed: {", ".join(failed)}')


def gate_status(name):
    return (release_gates.get(name) or {}).get('status', 'MISSING')

print(json.dumps({
    'release_audit': 'PASS',
    'package_version': package['version'],
    'pwa_cache': cache_name,
    'pwa_cache_generation': cache_generation,
    'release_tiers': {'core': core_count, 'extended': extended_count, 'labs': lab_count},
    'catalog_chain': catalog_chain,
    'backup_registry': 'v2',
    'core_classic_content_version': 4,
    'reference_cleanup': 'SOURCE_CONTRACT_PRESENT',
    'reference_content_audit': 'REQUIRED_BY_VALIDATE',
    'pwa_icon_contract': 'RASTER_HASH_IHDR_MANIFEST_OFFLINE_CONTRACT_PRESENT',
    'manifest_icon_test': 'REQUIRED_BY_UNIT_GATE',
    'media_inventory_audit': 'REQUIRED_BY_VALIDATE',
    'asset_provenance': {
        'inventoried': len(asset_entries),
        'unresolved': unresolved_assets,
        'release_gate': assets_gate_status,
    },
    'public_placeholder_leak_gate': 'REQUIRED_BY_VALIDATE',
    'accessibility_gate': gate_status('accessibility'),
    'groups_gate': gate_status('groups'),
    'staging_gate': gate_status('stagingHttpSmoke'),
    'branch_protection_gate': gate_status('branchProtection'),
    'legal_privacy_gate': gate_status('legalPrivacy'),
    'support_incident_gate': gate_status('supportIncident'),
    'operator_gate': operator_gate,
    'release_evidence_status': release_status,
    'release_decision': release_decision,
    'public_release': release_decision,
    'checks': checks,
}, ensure_ascii=False, indent=2))
