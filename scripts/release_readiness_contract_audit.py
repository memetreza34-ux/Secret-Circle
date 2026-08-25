#!/usr/bin/env python3
from pathlib import Path
import json
import re

ROOT = Path(__file__).resolve().parents[1]
read = lambda relative: (ROOT / relative).read_text(encoding='utf-8')

required = [
    'package.json', 'package-lock.json', 'sw.js',
    '.github/workflows/ci.yml', '.github/workflows/cross-browser.yml',
    'BRANCH_PROTECTION.md', 'ENVIRONMENTS.md', 'DEPLOYMENT.md', 'RELEASE_CHECKLIST.md',
    'RELEASE_EVIDENCE.md', 'release-evidence.json',
    'CONTENT_AGE_POLICY.md', 'THIRD_PARTY_NOTICES.md',
    'operator-release.json', 'OPERATOR_RELEASE_SIGNOFF.md', 'OPERATOR_EVIDENCE_LOG.md', 'HOSTING_DECISION.md',
    'LEGAL_CHECKLIST.md', 'SUPPORT.md', 'INCIDENT_RESPONSE.md',
    'scripts/lockfile_contract_audit.py',
    'scripts/branch_protection_contract_audit.py',
    'scripts/staging_smoke.py', 'scripts/staging_smoke_contract_audit.py',
    'scripts/hub_a11y_contract_audit.py', 'scripts/secondary_surface_a11y_contract_audit.py',
    'scripts/privacy_content_audit.py', 'scripts/reference_content_audit.py',
    'scripts/asset_provenance_audit.py', 'scripts/media_inventory_audit.py',
    'scripts/public_release_placeholder_audit.py', 'scripts/operator_release_contract_audit.py',
    'scripts/release_evidence_audit.py', 'scripts/release_audit.py',
    'tests/pwa-head-metadata.test.js', 'tests/word-imposter-data-contract.test.js',
]
missing = [relative for relative in required if not (ROOT / relative).is_file()]
if missing:
    raise SystemExit('Release readiness contract missing files: ' + ', '.join(missing))

package = json.loads(read('package.json'))
lock = json.loads(read('package-lock.json'))
evidence = json.loads(read('release-evidence.json'))
operator_evidence = json.loads(read('operator-release.json'))
sw = read('sw.js')
ci = read('.github/workflows/ci.yml')
cross = read('.github/workflows/cross-browser.yml')
branch = read('BRANCH_PROTECTION.md')
environments = read('ENVIRONMENTS.md')
deployment = read('DEPLOYMENT.md')
checklist = read('RELEASE_CHECKLIST.md')
evidence_doc = read('RELEASE_EVIDENCE.md')
content_policy = read('CONTENT_AGE_POLICY.md')
third_party = read('THIRD_PARTY_NOTICES.md')
operator_signoff = read('OPERATOR_RELEASE_SIGNOFF.md')
operator_log = read('OPERATOR_EVIDENCE_LOG.md')
hosting_decision = read('HOSTING_DECISION.md')
legal = read('LEGAL_CHECKLIST.md')
support = read('SUPPORT.md')
incident = read('INCIDENT_RESPONSE.md')
pwa_head_test = read('tests/pwa-head-metadata.test.js')
word_data_test = read('tests/word-imposter-data-contract.test.js')
validate = package.get('scripts', {}).get('validate', '')
unit = package.get('scripts', {}).get('test', '')
syntax = package.get('scripts', {}).get('check', '')

cache_match = re.search(r"const CACHE='(secret-circle-v\d+)'", sw)
if not cache_match:
    raise SystemExit('Release readiness contract cannot parse current PWA cache.')
current_cache = cache_match.group(1)

required_validate_audits = (
    'scripts/lockfile_contract_audit.py',
    'scripts/branch_protection_contract_audit.py',
    'scripts/staging_smoke_contract_audit.py',
    'scripts/hub_a11y_contract_audit.py',
    'scripts/secondary_surface_a11y_contract_audit.py',
    'scripts/privacy_content_audit.py',
    'scripts/reference_content_audit.py',
    'scripts/asset_provenance_audit.py',
    'scripts/media_inventory_audit.py',
    'scripts/public_release_placeholder_audit.py',
    'scripts/operator_release_contract_audit.py',
    'scripts/release_evidence_audit.py',
    'scripts/release_audit.py',
)

release_status = evidence.get('evidenceStatus')
release_decision = evidence.get('releaseDecision')
candidate = evidence.get('candidate') if isinstance(evidence.get('candidate'), dict) else {}
gates = evidence.get('gates') if isinstance(evidence.get('gates'), dict) else {}
operator_status = operator_evidence.get('evidenceStatus')
operator_gate = operator_evidence.get('operatorGate')
branch_gate_status = (gates.get('branchProtection') or {}).get('status')
branch_doc_match = re.search(r'Evidence-Status:\s*\*\*(OPEN|PASS)\*\*', branch)
branch_doc_status = branch_doc_match.group(1) if branch_doc_match else None
expected_branch_doc_status = 'PASS' if branch_gate_status == 'PASS' else 'OPEN'

release_state_valid = (
    release_status in {'PREPARED', 'FINAL'}
    and release_decision in {'NO_GO', 'GO'}
    and not (release_status == 'PREPARED' and release_decision != 'NO_GO')
    and not (release_status == 'PREPARED' and candidate.get('commit') is not None)
    and not (release_decision == 'GO' and release_status != 'FINAL')
)
operator_state_valid = (
    operator_status in {'PREPARED', 'FINAL'}
    and operator_gate in {'BLOCKED', 'READY'}
    and not (operator_status == 'PREPARED' and operator_gate != 'BLOCKED')
    and not (operator_gate == 'READY' and operator_status != 'FINAL')
)
operator_release_crosscheck = all(
    (gates.get(name) or {}).get('status') != 'PASS' or operator_gate == 'READY'
    for name in ('legalPrivacy', 'supportIncident')
)

checks = {
    'lockfile_v3': lock.get('lockfileVersion') == 3 and lock.get('name') == package.get('name'),
    'npm_ci_main': 'npm ci --ignore-scripts --no-audit --no-fund' in ci and 'npm install ' not in ci,
    'npm_ci_cross_browser': 'npm ci --ignore-scripts --no-audit --no-fund' in cross and 'npm install ' not in cross,
    'all_cross_cutting_audits_in_validate': all(marker in validate for marker in required_validate_audits),
    'pwa_head_test_in_unit_gate': 'tests/pwa-head-metadata.test.js' in unit,
    'pwa_head_test_in_syntax_gate': 'node --check tests/pwa-head-metadata.test.js' in syntax,
    'word_data_test_in_unit_gate': 'tests/word-imposter-data-contract.test.js' in unit,
    'word_data_test_in_syntax_gate': 'node --check tests/word-imposter-data-contract.test.js' in syntax,
    'word_data_contract': all(marker in word_data_test for marker in (
        'MAX_CUSTOM_CATEGORIES = 50', 'MAX_CUSTOM_ENTRIES = 200',
        'nextPendingVoterIndex', 'silentCategoryTruncationRejected', 'backupUiUsesStoreByteLimit'
    )),
    'pwa_head_test_contract': all(marker in pwa_head_test for marker in (
        'party.html', 'index.html', 'creator.html', 'advanced.html', 'quick-play.html',
        'apple-mobile-web-app-title', 'apple-mobile-web-app-status-bar-style',
        'icon-192\\.png', 'apple-touch-icon', 'manifest-src'
    )),
    'branch_contract_is_stateful': all(marker in branch for marker in (
        'Evidence-Status:', 'release-evidence.json → gates.branchProtection', 'Secret Circle CI / validate'
    )),
    'branch_contract_matches_release_evidence': branch_doc_status in {'OPEN', 'PASS'} and branch_doc_status == expected_branch_doc_status,
    'branch_required_check_defined': 'Secret Circle CI / validate' in branch,
    'environment_contract_is_stateful': all(marker in environments for marker in (
        'Local → CI/Test → HTTPS-Staging → Release Candidate → Production',
        'getrennte Origin', 'scripts/staging_smoke.py'
    )),
    'staging_smoke_command_documented': 'npm run staging:smoke' in environments and 'npm run staging:smoke' in deployment,
    'production_smoke_mode_documented': '--production' in environments and '--production' in deployment,
    'current_pwa_contract_documented': current_cache in environments and current_cache in deployment and 'tests/pwa-head-metadata.test.js' in environments and 'tests/pwa-head-metadata.test.js' in deployment,
    'hosting_current_cache_documented': current_cache in hosting_decision,
    'release_evidence_schema': evidence.get('schemaVersion') == 1 and evidence.get('product') == 'Secret Circle – Party Hub',
    'release_evidence_state_valid': release_state_valid,
    'release_evidence_doc_binds_one_commit': 'unveränderten Release-Candidate-Commit' in evidence_doc and '15' in evidence_doc and 'releaseDecision = GO' in evidence_doc,
    'operator_evidence_schema': operator_evidence.get('schemaVersion') == 1,
    'operator_state_valid': operator_state_valid,
    'operator_release_gate_crosscheck': operator_release_crosscheck,
    'operator_signoff_contract': all(marker in operator_signoff for marker in ('operator-release.json', 'OPERATOR_EVIDENCE_LOG.md', 'Hostingentscheidung', 'Support', 'Incident Response', 'FINAL / READY')),
    'operator_real_world_log_contract': all(marker in operator_log for marker in (
        'Supportkontakt-Test', 'Security-/Privacy-Meldeweg-Test', 'Probe-Supportfall',
        'Probe-SEV-1', 'HTTPS-Staging-Rollback-Drill', 'Finale Legal-/Privacy-Plausibilisierung',
        'Operator Gate: BLOCKED / READY'
    )),
    'hosting_decision_contract': all(marker in hosting_decision for marker in (current_cache, 'Staging-Origin', 'Production-Origin', 'Accesslogs', 'Rollback')),
    'legal_release_contract': all(marker in legal for marker in (
        'operator-release.json', 'DDG', 'TDDDG', 'VSBG', 'scripts/operator_release_contract_audit.py'
    )),
    'support_release_contract': all(marker in support for marker in ('SUPPORT PASS', 'echter Supportkontakt festgelegt', 'Security/Privacy')),
    'incident_release_contract': all(marker in incident for marker in ('INCIDENT RESPONSE PASS', 'SEV-1', 'Rollback')),
    'privacy_source_policy_documented': 'keine privaten Nachrichten, Fotos, Passwörter, Adressen oder Kontodaten als Spielmaterial verlangen' in content_policy,
    'third_party_lockfile_inventory': all(marker in third_party for marker in (
        'package-lock.json', '`playwright`', '`playwright-core`', '`fsevents`', 'scripts/lockfile_contract_audit.py'
    )),
    'release_checklist_requires_real_evidence': all(marker in checklist for marker in (
        'Required Check aktiv und grün',
        'npm run staging:smoke -- <STAGING>',
        'Production-Smoke',
        'VoiceOver',
        'reale Gruppe',
        'release-evidence.json'
    )),
    'third_party_requires_online_install_evidence': 'echter Online-`npm ci`-PASS' in third_party and 'unverändertem Commit' in third_party,
}

failed = [name for name, passed in checks.items() if not passed]
if failed:
    raise SystemExit('Release readiness contract failed: ' + ', '.join(failed))


def gate_status(name):
    return (gates.get(name) or {}).get('status', 'MISSING')

print(json.dumps({
    'release_readiness_contract_audit': 'PASS',
    'static_release_contract': release_status,
    'release_evidence': f'{release_status}_{release_decision}',
    'operator_evidence': f'{operator_status}_{operator_gate}',
    'operator_real_world_evidence_log': 'REQUIRED_FOR_READY',
    'pwa_cache': current_cache,
    'pwa_head_metadata': 'SOURCE_CONTRACT_PRESENT',
    'hub_accessibility_contract': 'SOURCE_CONTRACT_PRESENT',
    'word_imposter_data_contract': 'SOURCE_CONTRACT_PRESENT',
    'online_npm_ci': gate_status('ci'),
    'github_branch_protection': gate_status('branchProtection'),
    'https_staging_network_smoke': gate_status('stagingHttpSmoke'),
    'android': gate_status('android'),
    'ios': gate_status('ios'),
    'tablet': gate_status('tablet'),
    'accessibility': gate_status('accessibility'),
    'groups': gate_status('groups'),
    'legal_privacy': gate_status('legalPrivacy'),
    'support_incident': gate_status('supportIncident'),
    'public_release': release_decision,
    'checks': checks,
}, ensure_ascii=False, indent=2))
