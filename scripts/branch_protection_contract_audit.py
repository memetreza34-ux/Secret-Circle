#!/usr/bin/env python3
from pathlib import Path
import json

ROOT = Path(__file__).resolve().parents[1]
read = lambda relative: (ROOT / relative).read_text(encoding='utf-8')

required = [
    'BRANCH_PROTECTION.md',
    '.github/workflows/ci.yml',
    '.github/workflows/cross-browser.yml',
    'CI_TROUBLESHOOTING.md',
    'RELEASE_CHECKLIST.md',
    'package.json',
]

missing = [relative for relative in required if not (ROOT / relative).is_file()]
if missing:
    raise SystemExit(f'Branch protection contract audit missing files: {", ".join(missing)}')

contract = read('BRANCH_PROTECTION.md')
ci = read('.github/workflows/ci.yml')
cross = read('.github/workflows/cross-browser.yml')
troubleshooting = read('CI_TROUBLESHOOTING.md')
checklist = read('RELEASE_CHECKLIST.md')
package = json.loads(read('package.json'))

checks = {
    'contract_is_prepared_not_claimed_active': 'PREPARED – GitHub-Einstellung selbst noch nicht belastbar bestätigt' in contract,
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
    'lockfile_transition_explicit': 'Workflow auf `npm ci` umstellen' in contract and 'package-lock.json' in contract,
    'branch_protection_release_gate_explicit': 'BRANCH PROTECTION PASS' in contract and 'RELEASE NO_GO' in contract,
    'package_validate_can_host_audit': isinstance(package.get('scripts', {}).get('validate'), str),
}

failed = [name for name, passed in checks.items() if not passed]
if failed:
    raise SystemExit(f'Branch protection contract audit failed: {", ".join(failed)}')

print(json.dumps({
    'branch_protection_contract_audit': 'PASS',
    'required_pr_check': 'Secret Circle CI / validate',
    'cross_browser_required_for_rc': True,
    'cross_browser_permanent_pr_required_check': False,
    'github_setting_verified': False,
    'release_status': 'NO_GO until actual repository protection is verified',
    'checks': checks,
}, ensure_ascii=False, indent=2))
