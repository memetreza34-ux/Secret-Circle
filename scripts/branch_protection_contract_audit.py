#!/usr/bin/env python3
from pathlib import Path
import json
import re

ROOT = Path(__file__).resolve().parents[1]
read = lambda relative: (ROOT / relative).read_text(encoding='utf-8')

required = [
    'BRANCH_PROTECTION.md',
    '.github/workflows/ci.yml',
    '.github/workflows/cross-browser.yml',
    'CI_TROUBLESHOOTING.md',
    'RELEASE_CHECKLIST.md',
    'release-evidence.json',
    'package.json',
    'package-lock.json',
    'scripts/lockfile_contract_audit.py',
]

missing = [relative for relative in required if not (ROOT / relative).is_file()]
if missing:
    raise SystemExit(f'Branch protection contract audit missing files: {", ".join(missing)}')

contract = read('BRANCH_PROTECTION.md')
ci = read('.github/workflows/ci.yml')
cross = read('.github/workflows/cross-browser.yml')
troubleshooting = read('CI_TROUBLESHOOTING.md')
checklist = read('RELEASE_CHECKLIST.md')
evidence = json.loads(read('release-evidence.json'))
package = json.loads(read('package.json'))
lock = json.loads(read('package-lock.json'))

branch_gate = (evidence.get('gates') or {}).get('branchProtection') or {}
ci_gate = (evidence.get('gates') or {}).get('ci') or {}
branch_gate_status = branch_gate.get('status')
doc_status_match = re.search(r'Evidence-Status:\s*\*\*(OPEN|PASS)\*\*', contract)
doc_status = doc_status_match.group(1) if doc_status_match else None
allowed_gate_statuses = {'OPEN', 'BLOCKED', 'PASS', 'FAIL'}
expected_doc_status = 'PASS' if branch_gate_status == 'PASS' else 'OPEN'

checks = {
    'contract_has_explicit_evidence_status': doc_status in {'OPEN', 'PASS'},
    'contract_status_matches_release_evidence': branch_gate_status in allowed_gate_statuses and doc_status == expected_doc_status,
    'release_evidence_source_documented': 'release-evidence.json → gates.branchProtection' in contract,
    'current_pr_base_documented': '`codex/party-hub-foundation`' in contract,
    'required_context_documented': '`Secret Circle CI / validate`' in contract,
    'ci_workflow_name_stable': 'name: Secret Circle CI' in ci,
    'ci_job_validate_stable': '\n  validate:\n' in ci,
    'ci_runs_on_pr': 'pull_request:' in ci,
    'ci_checkout_present': 'actions/checkout@v4' in ci,
    'ci_has_no_continue_on_error': 'continue-on-error:' not in ci,
    'cross_workflow_name_stable': 'name: Secret Circle Cross-Browser Smoke' in cross,
    'cross_job_smoke_stable': '\n  smoke:\n' in cross,
    'cross_is_manual_only': 'workflow_dispatch:' in cross and 'pull_request:' not in cross and 'push:' not in cross,
    'cross_not_documented_as_permanent_required_check': 'darf `Secret Circle Cross-Browser Smoke / smoke` **nicht** als dauerhaft erforderlicher PR-Check' in contract,
    'cross_still_release_gate': 'exakten unveränderten RC-Commit' in contract and 'Cross-Browser' in checklist,
    'zero_step_jobs_not_accepted': 'Kein Merge bei `steps: []`.' in contract and 'steps: []' in troubleshooting,
    'lockfile_now_present': lock.get('lockfileVersion') == 3 and lock.get('name') == package.get('name'),
    'npm_ci_active_in_both_workflows': 'npm ci --ignore-scripts --no-audit --no-fund' in ci and 'npm ci --ignore-scripts --no-audit --no-fund' in cross,
    'old_install_transition_removed': 'Aktuell fehlt `package-lock.json`' not in contract and 'Workflow auf `npm ci` umstellen' not in contract,
    'online_install_verification_required': 'Online-`npm ci` auf unverändertem Commit grün' in contract,
    'lockfile_audit_in_validate': 'scripts/lockfile_contract_audit.py' in package.get('scripts', {}).get('validate', ''),
    'branch_protection_release_gate_explicit': 'BRANCH PROTECTION PASS' in contract and 'Evidence-Status' in contract,
    'pass_requires_real_release_evidence': 'release-evidence.json.gates.branchProtection = PASS' in contract,
}

failed = [name for name, passed in checks.items() if not passed]
if failed:
    raise SystemExit(f'Branch protection contract audit failed: {", ".join(failed)}')

branch_verified = branch_gate_status == 'PASS'
ci_verified = ci_gate.get('status') == 'PASS'
print(json.dumps({
    'branch_protection_contract_audit': 'PASS',
    'required_pr_check': 'Secret Circle CI / validate',
    'cross_browser_required_for_rc': True,
    'cross_browser_permanent_pr_required_check': False,
    'lockfile_present': True,
    'npm_ci_active': True,
    'online_npm_ci_verified': ci_verified,
    'github_setting_verified': branch_verified,
    'branch_evidence_status': branch_gate_status,
    'documented_evidence_status': doc_status,
    'release_status': 'BRANCH_PROTECTION_PASS' if branch_verified else 'BRANCH_PROTECTION_OPEN',
    'checks': checks,
}, ensure_ascii=False, indent=2))
