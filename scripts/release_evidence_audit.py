#!/usr/bin/env python3
from pathlib import Path
import json
import re

ROOT = Path(__file__).resolve().parents[1]
manifest_path = ROOT / 'release-evidence.json'
doc_path = ROOT / 'RELEASE_EVIDENCE.md'

if not manifest_path.is_file() or not doc_path.is_file():
    raise SystemExit('Release evidence contract files missing.')

data = json.loads(manifest_path.read_text(encoding='utf-8'))
doc = doc_path.read_text(encoding='utf-8')

EXPECTED_GATES = {
    'ci', 'crossBrowser', 'branchProtection', 'stagingHttpSmoke', 'pwaUpgradeRollback',
    'android', 'ios', 'tablet', 'accessibility', 'groups', 'contentPrivacyReference',
    'assetsThirdParty', 'legalPrivacy', 'supportIncident', 'productionSmoke',
}
ALLOWED_GATE_STATUS = {'OPEN', 'BLOCKED', 'PASS', 'FAIL'}
SHA40 = re.compile(r'^[0-9a-f]{40}$')

candidate = data.get('candidate') if isinstance(data.get('candidate'), dict) else {}
gates = data.get('gates') if isinstance(data.get('gates'), dict) else {}
release_decision = data.get('releaseDecision')
evidence_status = data.get('evidenceStatus')
candidate_commit = candidate.get('commit')

checks = {
    'schema_v1': data.get('schemaVersion') == 1,
    'product_identity': data.get('product') == 'Secret Circle – Party Hub',
    'gate_set_exact': set(gates) == EXPECTED_GATES,
    'gate_status_values': all(isinstance(gate, dict) and gate.get('status') in ALLOWED_GATE_STATUS for gate in gates.values()),
    'decision_value': release_decision in {'NO_GO', 'GO'},
    'evidence_status_value': evidence_status in {'PREPARED', 'FINAL'},
    'doc_no_go_contract': all(marker in doc for marker in (
        'release-evidence.json', 'NO_GO', 'unveränderten Release-Candidate-Commit',
        '15', 'scripts/release_evidence_audit.py', 'releaseDecision = GO'
    )),
}

violations = []
for gate_name, gate in gates.items():
    status = gate.get('status')
    gate_commit = gate.get('commit')
    evidence = gate.get('evidence')
    if status == 'PASS':
        if not isinstance(candidate_commit, str) or not SHA40.fullmatch(candidate_commit):
            violations.append(f'{gate_name}: PASS without valid candidate commit')
        if gate_commit != candidate_commit:
            violations.append(f'{gate_name}: PASS commit does not match candidate commit')
        if evidence in (None, '', {}, []):
            violations.append(f'{gate_name}: PASS without evidence')
    elif gate_commit not in (None, '') and candidate_commit and gate_commit != candidate_commit:
        violations.append(f'{gate_name}: non-PASS evidence references another commit')

if release_decision == 'GO':
    required_candidate_fields = ('commit', 'tag', 'appVersion', 'cache', 'stagingUrl', 'productionUrl', 'frozenAt')
    missing_candidate = [field for field in required_candidate_fields if candidate.get(field) in (None, '')]
    if missing_candidate:
        violations.append('GO missing candidate fields: ' + ', '.join(missing_candidate))
    if not isinstance(candidate_commit, str) or not SHA40.fullmatch(candidate_commit):
        violations.append('GO candidate commit must be a 40-character lowercase SHA')
    if evidence_status != 'FINAL':
        violations.append('GO requires evidenceStatus FINAL')
    non_pass = [name for name, gate in gates.items() if gate.get('status') != 'PASS']
    if non_pass:
        violations.append('GO has non-PASS gates: ' + ', '.join(sorted(non_pass)))
    if data.get('knownBlockers'):
        violations.append('GO cannot contain knownBlockers')
else:
    if evidence_status == 'PREPARED' and candidate_commit is not None:
        violations.append('PREPARED template must not pin a candidate commit')

failed = [name for name, passed in checks.items() if not passed]
if failed or violations:
    messages = []
    if failed:
        messages.append('failed checks: ' + ', '.join(failed))
    messages.extend(violations)
    raise SystemExit('Release evidence audit failed: ' + ' | '.join(messages))

pass_count = sum(1 for gate in gates.values() if gate.get('status') == 'PASS')
print(json.dumps({
    'release_evidence_audit': 'PASS',
    'evidence_status': evidence_status,
    'release_decision': release_decision,
    'candidate_commit': candidate_commit,
    'gate_count': len(gates),
    'pass_count': pass_count,
    'go_allowed_by_current_evidence': release_decision == 'GO',
    'current_template_is_not_release_pass': release_decision == 'NO_GO',
    'checks': checks,
}, ensure_ascii=False, indent=2))