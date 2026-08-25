#!/usr/bin/env python3
from pathlib import Path
from urllib.parse import urlparse
import json
import re

ROOT = Path(__file__).resolve().parents[1]
REQUIRED_FILES = [
    'operator-release.json',
    'OPERATOR_RELEASE_SIGNOFF.md',
    'HOSTING_DECISION.md',
    'LEGAL_CHECKLIST.md',
    'SUPPORT.md',
    'INCIDENT_RESPONSE.md',
    'ENVIRONMENTS.md',
    'DEPLOYMENT.md',
    'privacy.html',
    'release-evidence.json',
]

for relative in REQUIRED_FILES:
    if not (ROOT / relative).is_file():
        raise SystemExit(f'Operator release contract missing file: {relative}')

payload = json.loads((ROOT / 'operator-release.json').read_text(encoding='utf-8'))
evidence = json.loads((ROOT / 'release-evidence.json').read_text(encoding='utf-8'))
signoff = (ROOT / 'OPERATOR_RELEASE_SIGNOFF.md').read_text(encoding='utf-8')
hosting_doc = (ROOT / 'HOSTING_DECISION.md').read_text(encoding='utf-8')
legal_doc = (ROOT / 'LEGAL_CHECKLIST.md').read_text(encoding='utf-8')
support_doc = (ROOT / 'SUPPORT.md').read_text(encoding='utf-8')
incident_doc = (ROOT / 'INCIDENT_RESPONSE.md').read_text(encoding='utf-8')

if payload.get('schemaVersion') != 1:
    raise SystemExit('Unsupported operator-release schema version.')

status = payload.get('evidenceStatus')
gate = payload.get('operatorGate')
if status not in {'PREPARED', 'FINAL'}:
    raise SystemExit(f'Invalid operator evidence status: {status}')
if gate not in {'BLOCKED', 'READY'}:
    raise SystemExit(f'Invalid operator gate: {gate}')
if status == 'PREPARED' and gate != 'BLOCKED':
    raise SystemExit('PREPARED operator evidence cannot be READY.')
if gate == 'READY' and status != 'FINAL':
    raise SystemExit('READY operator gate requires FINAL evidence status.')

for marker, source, label in (
    ('operator-release.json', signoff, 'operator sign-off'),
    ('Hostingentscheidung', signoff, 'operator sign-off'),
    ('Support', signoff, 'operator sign-off'),
    ('Incident Response', signoff, 'operator sign-off'),
    ('secret-circle-v45', hosting_doc, 'hosting decision'),
    ('Legal- und Veröffentlichungscheckliste', legal_doc, 'legal checklist'),
    ('SUPPORT PASS', support_doc, 'support contract'),
    ('INCIDENT RESPONSE PASS', incident_doc, 'incident contract'),
):
    if marker not in source:
        raise SystemExit(f'Missing {label} marker: {marker}')

operator = payload.get('operator') or {}
hosting = payload.get('hosting') or {}
public_legal = payload.get('publicLegal') or {}
support = payload.get('support') or {}
incident = payload.get('incident') or {}
legal = payload.get('legalReview') or {}

if public_legal.get('noObsoleteEuOdrLink') is not True:
    raise SystemExit('Operator contract must explicitly prohibit the obsolete EU ODR link.')
if legal.get('monetizationPosition') not in {'N/A_V1', 'REVIEWED_FREE', 'REVIEWED_PAID'}:
    raise SystemExit('Invalid monetization position in operator-release.json.')


def present(value):
    return isinstance(value, str) and bool(value.strip())


def valid_email(value):
    return present(value) and bool(re.fullmatch(r'[^@\s]+@[^@\s]+\.[^@\s]+', value.strip()))


def https_origin(value):
    if not present(value):
        return False
    parsed = urlparse(value.strip())
    return parsed.scheme.lower() == 'https' and bool(parsed.netloc) and parsed.path in {'', '/'} and not parsed.query and not parsed.fragment


def require_ready_contract():
    required_operator = ('legalName', 'legalForm', 'serviceAddress')
    missing_operator = [key for key in required_operator if not present(operator.get(key))]
    if missing_operator:
        raise SystemExit('READY operator evidence missing operator fields: ' + ', '.join(missing_operator))
    if not valid_email(operator.get('publicEmail')):
        raise SystemExit('READY operator evidence requires a valid public operator email.')

    required_hosting = ('provider', 'product', 'region')
    missing_hosting = [key for key in required_hosting if not present(hosting.get(key))]
    if missing_hosting:
        raise SystemExit('READY operator evidence missing hosting fields: ' + ', '.join(missing_hosting))
    staging = hosting.get('stagingOrigin')
    production = hosting.get('productionOrigin')
    if not https_origin(staging) or not https_origin(production):
        raise SystemExit('READY hosting requires valid HTTPS staging and production origins.')
    if staging.rstrip('/') == production.rstrip('/'):
        raise SystemExit('Staging and production origins must be different.')
    for key in (
        'accessLogsDocumented', 'retentionDocumented', 'processorRoleReviewed',
        'thirdCountryTransferReviewed', 'httpsConfirmed', 'abuseOrSecurityContactReviewed'
    ):
        if hosting.get(key) is not True:
            raise SystemExit(f'READY hosting evidence requires {key}=true.')

    if not present(public_legal.get('privacyPage')) or not present(public_legal.get('legalNoticePage')):
        raise SystemExit('READY public legal evidence requires privacy and legal notice pages.')
    for key in (
        'privacyHostingTextFinal', 'operatorDetailsPublished', 'supportLinkPublished',
        'vsbgPositionPublishedIfRequired', 'noObsoleteEuOdrLink'
    ):
        if public_legal.get(key) is not True:
            raise SystemExit(f'READY public legal evidence requires {key}=true.')

    if not valid_email(support.get('publicSupportEmail')):
        raise SystemExit('READY support evidence requires a valid public support email.')
    if not present(support.get('securityReportingRoute')):
        raise SystemExit('READY support evidence requires a security reporting route.')
    for key in ('supportContactTested', 'securityRouteTested', 'sampleSupportCaseCompleted'):
        if support.get(key) is not True:
            raise SystemExit(f'READY support evidence requires {key}=true.')

    for key in ('incidentLead', 'engineeringOwner', 'supportOwner', 'legalPrivacyOwner'):
        if not present(incident.get(key)):
            raise SystemExit(f'READY incident evidence missing owner: {key}')
    for key in ('sev1DrillCompleted', 'rollbackDrillCompleted', 'userCommunicationRouteConfirmed'):
        if incident.get(key) is not True:
            raise SystemExit(f'READY incident evidence requires {key}=true.')

    for key in (
        'ddgReviewed', 'gdprPrivacyReviewed', 'tdddgStorageReviewed', 'vsbgReviewed',
        'contentRightsReviewed', 'agePositionReviewed', 'finalPlausibilityReviewCompleted'
    ):
        if legal.get(key) is not True:
            raise SystemExit(f'READY legal evidence requires {key}=true.')
    if not present(legal.get('reviewedAt')):
        raise SystemExit('READY legal evidence requires reviewedAt.')


if gate == 'READY':
    require_ready_contract()

release_gates = evidence.get('gates') or {}
for gate_name in ('legalPrivacy', 'supportIncident'):
    if (release_gates.get(gate_name) or {}).get('status') == 'PASS' and gate != 'READY':
        raise SystemExit(f'release-evidence gate {gate_name}=PASS requires operatorGate=READY.')

print(json.dumps({
    'operator_release_contract_audit': 'PASS',
    'schema_version': payload['schemaVersion'],
    'evidence_status': status,
    'operator_gate': gate,
    'ready_contract_enforced': True,
    'https_origin_separation_required': True,
    'tested_support_and_security_required': True,
    'incident_and_rollback_drills_required': True,
    'release_evidence_cross_check': ['legalPrivacy', 'supportIncident'],
    'public_release': 'STILL_REQUIRES_RELEASE_EVIDENCE_GO'
}, ensure_ascii=False, indent=2))
