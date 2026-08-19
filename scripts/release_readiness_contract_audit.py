#!/usr/bin/env python3
from pathlib import Path
import json

ROOT = Path(__file__).resolve().parents[1]
read = lambda relative: (ROOT / relative).read_text(encoding='utf-8')

required = [
    'package.json', 'package-lock.json',
    '.github/workflows/ci.yml', '.github/workflows/cross-browser.yml',
    'BRANCH_PROTECTION.md', 'ENVIRONMENTS.md', 'DEPLOYMENT.md', 'RELEASE_CHECKLIST.md',
    'CONTENT_AGE_POLICY.md', 'THIRD_PARTY_NOTICES.md',
    'scripts/lockfile_contract_audit.py',
    'scripts/branch_protection_contract_audit.py',
    'scripts/staging_smoke.py', 'scripts/staging_smoke_contract_audit.py',
    'scripts/privacy_content_audit.py', 'scripts/reference_content_audit.py',
    'scripts/asset_provenance_audit.py', 'scripts/media_inventory_audit.py',
    'scripts/public_release_placeholder_audit.py', 'scripts/release_audit.py',
]
missing = [relative for relative in required if not (ROOT / relative).is_file()]
if missing:
    raise SystemExit('Release readiness contract missing files: ' + ', '.join(missing))

package = json.loads(read('package.json'))
lock = json.loads(read('package-lock.json'))
ci = read('.github/workflows/ci.yml')
cross = read('.github/workflows/cross-browser.yml')
branch = read('BRANCH_PROTECTION.md')
environments = read('ENVIRONMENTS.md')
deployment = read('DEPLOYMENT.md')
checklist = read('RELEASE_CHECKLIST.md')
content_policy = read('CONTENT_AGE_POLICY.md')
third_party = read('THIRD_PARTY_NOTICES.md')
validate = package.get('scripts', {}).get('validate', '')

required_validate_audits = (
    'scripts/lockfile_contract_audit.py',
    'scripts/branch_protection_contract_audit.py',
    'scripts/staging_smoke_contract_audit.py',
    'scripts/privacy_content_audit.py',
    'scripts/reference_content_audit.py',
    'scripts/asset_provenance_audit.py',
    'scripts/media_inventory_audit.py',
    'scripts/public_release_placeholder_audit.py',
    'scripts/release_audit.py',
)

checks = {
    'lockfile_v3': lock.get('lockfileVersion') == 3 and lock.get('name') == package.get('name'),
    'npm_ci_main': 'npm ci --ignore-scripts --no-audit --no-fund' in ci and 'npm install ' not in ci,
    'npm_ci_cross_browser': 'npm ci --ignore-scripts --no-audit --no-fund' in cross and 'npm install ' not in cross,
    'all_cross_cutting_audits_in_validate': all(marker in validate for marker in required_validate_audits),
    'branch_protection_not_falsely_claimed': 'GitHub-Einstellung selbst noch nicht belastbar bestätigt' in branch,
    'branch_required_check_defined': 'Secret Circle CI / validate' in branch,
    'https_staging_real_execution_open': 'PREPARED – konkrete HTTPS-Staging-URL offen' in environments,
    'staging_smoke_command_documented': 'npm run staging:smoke' in environments and 'npm run staging:smoke' in deployment,
    'production_smoke_mode_documented': '--production' in environments and '--production' in deployment,
    'privacy_source_policy_documented': 'keine privaten Nachrichten, Fotos, Passwörter, Adressen oder Kontodaten als Spielmaterial verlangen' in content_policy,
    'third_party_lockfile_inventory': all(marker in third_party for marker in (
        'package-lock.json', '`playwright`', '`playwright-core`', '`fsevents`', 'scripts/lockfile_contract_audit.py'
    )),
    'release_checklist_requires_real_evidence': all(marker in checklist for marker in (
        'Required Check auf echtem Runner grün',
        'HTTPS-Staging-Smoke',
        'Production-Smoke',
        'VoiceOver',
        'reale Gruppe'
    )),
    'no_false_online_install_claim': 'echter Online-`npm ci`-PASS' in third_party and 'Noch offen' in third_party,
}

failed = [name for name, passed in checks.items() if not passed]
if failed:
    raise SystemExit('Release readiness contract failed: ' + ', '.join(failed))

print(json.dumps({
    'release_readiness_contract_audit': 'PASS',
    'static_release_contract': 'PREPARED',
    'online_npm_ci': 'OPEN',
    'github_branch_protection': 'OPEN',
    'https_staging_network_smoke': 'OPEN',
    'real_devices_accessibility_groups_legal': 'OPEN',
    'public_release': 'NO_GO',
    'checks': checks,
}, ensure_ascii=False, indent=2))
