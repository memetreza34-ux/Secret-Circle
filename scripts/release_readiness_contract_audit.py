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
    'operator-release.json', 'OPERATOR_RELEASE_SIGNOFF.md', 'HOSTING_DECISION.md',
    'LEGAL_CHECKLIST.md', 'SUPPORT.md', 'INCIDENT_RESPONSE.md',
    'scripts/lockfile_contract_audit.py',
    'scripts/branch_protection_contract_audit.py',
    'scripts/staging_smoke.py', 'scripts/staging_smoke_contract_audit.py',
    'scripts/hub_a11y_contract_audit.py',
    'scripts/privacy_content_audit.py', 'scripts/reference_content_audit.py',
    'scripts/asset_provenance_audit.py', 'scripts/media_inventory_audit.py',
    'scripts/public_release_placeholder_audit.py', 'scripts/operator_release_contract_audit.py',
    'scripts/release_evidence_audit.py', 'scripts/release_audit.py',
    'tests/pwa-head-metadata.test.js',
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
hosting_decision = read('HOSTING_DECISION.md')
legal = read('LEGAL_CHECKLIST.md')
support = read('SUPPORT.md')
incident = read('INCIDENT_RESPONSE.md')
pwa_head_test = read('tests/pwa-head-metadata.test.js')
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
    'scripts/privacy_content_audit.py',
    'scripts/reference_content_audit.py',
    'scripts/asset_provenance_audit.py',
    'scripts/media_inventory_audit.py',
    'scripts/public_release_placeholder_audit.py',
    'scripts/operator_release_contract_audit.py',
    'scripts/release_evidence_audit.py',
    'scripts/release_audit.py',
)

checks = {
    'lockfile_v3': lock.get('lockfileVersion') == 3 and lock.get('name') == package.get('name'),
    'npm_ci_main': 'npm ci --ignore-scripts --no-audit --no-fund' in ci and 'npm install ' not in ci,
    'npm_ci_cross_browser': 'npm ci --ignore-scripts --no-audit --no-fund' in cross and 'npm install ' not in cross,
    'all_cross_cutting_audits_in_validate': all(marker in validate for marker in required_validate_audits),
    'pwa_head_test_in_unit_gate': 'tests/pwa-head-metadata.test.js' in unit,
    'pwa_head_test_in_syntax_gate': 'node --check tests/pwa-head-metadata.test.js' in syntax,
    'pwa_head_test_contract': all(marker in pwa_head_test for marker in (
        'party.html', 'index.html', 'creator.html', 'advanced.html', 'quick-play.html',
        'apple-mobile-web-app-title', 'apple-mobile-web-app-status-bar-style',
        'icon-192\\.png', 'apple-touch-icon', 'manifest-src'
    )),
    'branch_protection_not_falsely_claimed': 'GitHub-Einstellung selbst noch nicht belastbar bestätigt' in branch,
    'branch_required_check_defined': 'Secret Circle CI / validate' in branch,
    'https_staging_real_execution_open': 'PREPARED – konkrete HTTPS-Staging-URL offen' in environments,
    'staging_smoke_command_documented': 'npm run staging:smoke' in environments and 'npm run staging:smoke' in deployment,
    'production_smoke_mode_documented': '--production' in environments and '--production' in deployment,
    'current_pwa_contract_documented': current_cache in environments and current_cache in deployment and 'tests/pwa-head-metadata.test.js' in environments and 'tests/pwa-head-metadata.test.js' in deployment,
    'hosting_current_cache_documented': current_cache in hosting_decision,
    'release_evidence_schema': evidence.get('schemaVersion') == 1 and evidence.get('product') == 'Secret Circle – Party Hub',
    'release_evidence_stays_no_go_before_rc': evidence.get('evidenceStatus') == 'PREPARED' and evidence.get('releaseDecision') == 'NO_GO' and evidence.get('candidate', {}).get('commit') is None,
    'release_evidence_doc_binds_one_commit': 'unveränderten Release-Candidate-Commit' in evidence_doc and '15' in evidence_doc and 'releaseDecision = GO' in evidence_doc,
    'operator_evidence_schema': operator_evidence.get('schemaVersion') == 1,
    'operator_gate_not_falsely_ready': operator_evidence.get('evidenceStatus') == 'PREPARED' and operator_evidence.get('operatorGate') == 'BLOCKED',
    'operator_signoff_contract': all(marker in operator_signoff for marker in ('operator-release.json', 'Hostingentscheidung', 'Support', 'Incident Response', 'FINAL / READY')),
    'hosting_decision_contract': all(marker in hosting_decision for marker in (current_cache, 'Staging-Origin', 'Production-Origin', 'Accesslogs', 'Rollback')),
    'legal_real_values_required': 'Kein öffentliches GO mit Platzhaltern' in legal and 'LEGAL NO_GO' in legal,
    'support_real_contact_required': 'echter Supportkontakt festgelegt' in support and 'SUPPORT PREPARED / RELEASE NO_GO' in support,
    'incident_real_owners_required': 'reale Verantwortliche eingetragen' in incident and 'PREPARED / PRODUCTION NO_GO' in incident,
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
    'no_false_online_install_claim': 'echter Online-`npm ci`-PASS' in third_party and 'Noch offen' in third_party,
}

failed = [name for name, passed in checks.items() if not passed]
if failed:
    raise SystemExit('Release readiness contract failed: ' + ', '.join(failed))

print(json.dumps({
    'release_readiness_contract_audit': 'PASS',
    'static_release_contract': 'PREPARED',
    'release_evidence': 'PREPARED_NO_GO_SINGLE_RC_CONTRACT',
    'operator_evidence': 'PREPARED_BLOCKED_UNTIL_REAL_VALUES',
    'pwa_cache': current_cache,
    'pwa_head_metadata': 'CURRENT_CACHE_CONTRACT_REQUIRED_NOT_RUNNER_VERIFIED',
    'hub_accessibility_contract': 'PREPARED_NOT_REAL_DEVICE_VERIFIED',
    'online_npm_ci': 'OPEN',
    'github_branch_protection': 'OPEN',
    'https_staging_network_smoke': 'OPEN',
    'real_devices_accessibility_groups_legal': 'OPEN',
    'public_release': 'NO_GO',
    'checks': checks,
}, ensure_ascii=False, indent=2))
