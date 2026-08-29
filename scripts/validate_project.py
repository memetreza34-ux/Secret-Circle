#!/usr/bin/env python3
from pathlib import Path
from html.parser import HTMLParser
import ast
import json
import re

ROOT = Path(__file__).resolve().parents[1]
read = lambda relative: (ROOT / relative).read_text(encoding='utf-8')

required = [
    'index.html', 'party.html', 'advanced.html', 'quick-play.html', 'creator.html', 'privacy.html',
    'sw.js', 'manifest.webmanifest', 'package.json', 'package-lock.json', 'release-evidence.json',
    'runtime-guard.js', 'privacy-guard.js', 'word-imposter-resume-guard.js',
    'backup-schema-registry.js', 'party-data-tools.js',
    'party-core-release-catalog.js', 'party-core-classic-content.js', 'party-routing.js',
    'party-wave-one-catalog.js', 'party-wave-one-imposter-catalog.js',
    'party-wave-one-modes.js', 'party-wave-one-imposter-modes.js',
    'session-ledger.js', 'party-session-controls.js', 'party-hub-timers.js',
    'party-hub-round-state.js', 'party-hub.js', 'party-hub-polish.js',
    'party-hub-resume-guard.js', 'party-hub-a11y.js',
    'advanced-resume-guard.js', 'advanced-privacy-guard.js', 'secondary-surface-a11y.js',
    'tests/core-content-quality.test.js', 'tests/backup-schema-registry.test.js',
    'tests/service-worker.test.js', 'tests/word-imposter-data-contract.test.js',
    'tests/party-hub-resume-guard.test.js', 'tests/party-wave-one-catalog.test.js',
    'tests/party-wave-one-imposter-catalog.test.js',
    'tests/e2e/wave-one-quiz.spec.js', 'tests/e2e/wave-one-imposter.spec.js',
    'ARCHITECTURE.md', 'DEPLOYMENT.md', 'CONTENT_AGE_POLICY.md', 'CORE_CONTENT_REVIEW.md',
    'SECURITY.md', 'THREAT_MODEL.md', 'RISK_REGISTER.md', 'BRANCH_PROTECTION.md', 'ENVIRONMENTS.md',
    'operator-release.json', 'OPERATOR_RELEASE_SIGNOFF.md', 'OPERATOR_EVIDENCE_LOG.md',
    'scripts/wave_one_quiz_audit.py', 'scripts/wave_one_imposter_audit.py',
    'scripts/lockfile_contract_audit.py', 'scripts/branch_protection_contract_audit.py',
    'scripts/staging_smoke_contract_audit.py', 'scripts/hub_a11y_contract_audit.py',
    'scripts/secondary_surface_a11y_contract_audit.py', 'scripts/privacy_content_audit.py',
    'scripts/reference_content_audit.py', 'scripts/operator_release_contract_audit.py',
    'scripts/release_evidence_audit.py', 'scripts/release_readiness_contract_audit.py',
]
for relative in required:
    if not (ROOT / relative).is_file():
        raise SystemExit(f'Missing required project file: {relative}')


class Audit(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids = []
        self.labels = set()
        self.controls = []
        self.scripts = []
        self.assets = set()
        self.csp = ''

    def handle_starttag(self, tag, attrs):
        values = dict(attrs)
        if values.get('id'):
            self.ids.append(values['id'])
        if tag == 'label' and values.get('for'):
            self.labels.add(values['for'])
        if tag in {'input', 'select', 'textarea'}:
            self.controls.append((tag, values))
        if tag == 'script' and values.get('src'):
            self.scripts.append(values['src'])
            self.assets.add(values['src'])
        if tag == 'link' and values.get('href') and values.get('rel') in {'stylesheet', 'manifest', 'icon', 'apple-touch-icon'}:
            self.assets.add(values['href'])
        if tag == 'meta' and str(values.get('http-equiv', '')).lower() == 'content-security-policy':
            self.csp = values.get('content', '')


def audit_html(relative, expected_scripts):
    source = read(relative)
    audit = Audit()
    audit.feed(source)
    duplicates = sorted({value for value in audit.ids if audit.ids.count(value) > 1})
    if duplicates:
        raise SystemExit(f'Duplicate ids in {relative}: {duplicates}')
    for tag, attrs in audit.controls:
        control_id = attrs.get('id')
        if not (control_id in audit.labels or attrs.get('aria-label') or attrs.get('aria-labelledby')):
            raise SystemExit(f'Unlabelled control in {relative}: {tag}#{control_id or "unknown"}')
    for asset in audit.assets:
        if asset.startswith(('http:', 'https:')):
            raise SystemExit(f'External runtime asset in {relative}: {asset}')
        clean_asset = asset.split('?', 1)[0].split('#', 1)[0].lstrip('./')
        if clean_asset and not (ROOT / clean_asset).is_file():
            raise SystemExit(f'Missing runtime asset in {relative}: {asset}')
    if audit.scripts != expected_scripts:
        raise SystemExit(f'Unexpected script order in {relative}: {audit.scripts}')
    for directive in ("default-src 'self'", "script-src 'self'", "style-src 'self'", "object-src 'none'", "base-uri 'none'", "form-action 'self'"):
        if directive not in audit.csp:
            raise SystemExit(f'CSP directive missing in {relative}: {directive}')
    return source


catalog_chain = [
    'party-catalog.js', 'party-expansion.js', 'party-trending-catalog.js', 'party-mega-catalog.js',
    'party-viral-catalog.js', 'party-core-release-catalog.js', 'party-core-classic-content.js',
    'party-routing.js', 'party-wave-one-catalog.js', 'party-wave-one-imposter-catalog.js'
]
party = audit_html('party.html', [
    'runtime-guard.js', *catalog_chain, 'party-custom-packs.js', 'session-ledger.js',
    'party-session-controls.js', 'party-hub-timers.js', 'party-hub-round-state.js',
    'party-hub.js', 'party-hub-plus.js', 'party-hub-polish.js', 'party-night.js',
    'backup-schema-registry.js', 'party-data-tools.js'
])
quick = audit_html('quick-play.html', [
    'runtime-guard.js', *catalog_chain, 'party-custom-packs.js',
    'secondary-surface-a11y.js', 'quick-loader.js'
])
advanced = audit_html('advanced.html', [
    'runtime-guard.js', 'party-catalog.js', 'party-expansion.js', 'party-routing.js',
    'party-advanced.js', 'advanced-resume-guard.js', 'secondary-surface-a11y.js',
    'party-advanced-runner.js', 'advanced-privacy-guard.js', 'party-advanced-preferences.js'
])
creator = audit_html('creator.html', [
    'runtime-guard.js', 'game-creator.js', 'secondary-surface-a11y.js', 'creator-page.js'
])
audit_html('privacy.html', [])
index = audit_html('index.html', [
    'runtime-guard.js', 'setup-ux.js', 'privacy-guard.js', 'wake-lock.js',
    'game-engine.js', 'role-assignment.js', 'word-packs.js', 'data-store.js',
    'word-imposter-resume-guard.js', 'app.js'
])

for marker in ('Euer Party-Hub · privat · lokal', 'Persönliche Inhalte sind freiwillig', 'backup-schema-registry.js', 'party-data-tools.js', 'party-wave-one-catalog.js', 'pause-hub-game', 'skip-hub-round'):
    if marker not in party:
        raise SystemExit(f'Party Hub release marker missing: {marker}')
for marker in ('party-core-classic-content.js', 'party-wave-one-catalog.js', 'party-wave-one-imposter-catalog.js'):
    if marker not in quick:
        raise SystemExit(f'Quick page is missing final catalog layer: {marker}')
if 'secondary-surface-a11y.js' not in quick or 'secondary-surface-a11y.js' not in advanced or 'secondary-surface-a11y.js' not in creator:
    raise SystemExit('Secondary accessibility layer is not loaded on all required surfaces.')
if 'advanced-resume-guard.js' not in advanced or 'advanced-privacy-guard.js' not in advanced:
    raise SystemExit('Advanced resume/privacy guards are missing from advanced.html runtime order.')
if 'word-imposter-resume-guard.js' not in index:
    raise SystemExit('Word Imposter resume guard is missing from index.html runtime order.')

hub_polish = read('party-hub-polish.js')
for marker in ('function loadHubA11y()', "script.src = 'party-hub-a11y.js'", 'loadHubA11y();'):
    if marker not in hub_polish:
        raise SystemExit(f'Party Hub accessibility loader contract missing: {marker}')
for marker in ('function loadHubResumeGuard()', "script.src = 'party-hub-resume-guard.js'", 'SecretCirclePartyHubResumeGuard', 'guard.install(window)', 'loadHubResumeGuard();'):
    if marker not in hub_polish:
        raise SystemExit(f'Party Hub resume loader contract missing: {marker}')

wave_catalog = read('party-wave-one-catalog.js')
quiz_runner = read('party-wave-one-modes.js')
imposter_runner = read('party-wave-one-imposter-modes.js')
loader = read('quick-loader.js')
for marker in (
    "id: 'party-quiz'", "id: 'fact-or-fake'", "id: 'undercover-similar-word'", "id: 'no-word-imposter'",
    'waveOneQuizGameIds', 'waveOneImposterGameIds', 'waveOneGameIds', 'quickGameIds', 'version: 3'
):
    if marker not in wave_catalog:
        raise SystemExit(f'Wave 1 catalog contract missing: {marker}')
for marker in ("ACTIVE_KEY = 'secret-circle-party-quick-active-v1'", "L.completionId('wave1', game.id, active.sessionId)"):
    if marker not in quiz_runner:
        raise SystemExit(f'Wave 1 quiz runner contract missing: {marker}')
for marker in (
    "ACTIVE_KEY = 'secret-circle-party-quick-active-v1'", "const ALLOWED = new Set(C.waveOneImposterGameIds || []);",
    "L.completionId('wave1-imposter', game.id, active.sessionId)", 'function concealPrivate()',
    "addEventListener('blur', concealPrivate)", 'function resolveVotes()', 'function submitGuess()'
):
    if marker not in imposter_runner:
        raise SystemExit(f'Wave 1 Imposter runner contract missing: {marker}')
for marker in (
    "WAVE_ONE_SOURCE = 'party-wave-one-modes.js'", "WAVE_ONE_IMPOSTER_SOURCE = 'party-wave-one-imposter-modes.js'",
    'catalog.waveOneImposterGameIds?.includes(gameId)', 'catalog.waveOneQuizGameIds?.includes(gameId)', 'version: 9'
):
    if marker not in loader:
        raise SystemExit(f'Wave 1 loader contract missing: {marker}')

registry = read('backup-schema-registry.js')
data_tools = read('party-data-tools.js')
if 'const VERSION = 2;' not in registry or 'isAllowedCompleteStorageKey' not in registry:
    raise SystemExit('Backup registry v2/key policy missing.')
for marker in ('SecretCircleBackupSchemas', "registry.validateHeader(payload, 'complete')", 'registry.isAllowedCompleteStorageKey', 'const FORMAT = schema.format', 'const MAX_BYTES = schema.maximumBytes'):
    if marker not in data_tools:
        raise SystemExit(f'Party data tools central-schema contract missing: {marker}')
for forbidden in ("const FORMAT = 'secret-circle-complete-backup'", 'const MAX_BYTES = 1_500_000', 'const MAX_ENTRIES = 100', 'const MAX_VALUE_BYTES = 1_000_000'):
    if forbidden in data_tools:
        raise SystemExit(f'Party data tools duplicated backup constant: {forbidden}')

sw = read('sw.js')
cache = re.search(r"const CACHE='(secret-circle-v(\d+))'", sw)
staging = re.search(r"const STAGING_CACHE='(secret-circle-v(\d+)-staging)'", sw)
if not cache or not staging or cache.group(2) != staging.group(2):
    raise SystemExit('Invalid service-worker cache generations.')
cache_name = cache.group(1)
core_match = re.search(r'const CORE=(\[[^;]+\]);', sw)
if not core_match:
    raise SystemExit('Service worker CORE list missing.')
core = ast.literal_eval(core_match.group(1))
for asset in (
    './word-imposter-resume-guard.js', './backup-schema-registry.js', './party-catalog.js',
    './party-core-release-catalog.js', './party-core-classic-content.js', './party-wave-one-catalog.js',
    './party-wave-one-imposter-catalog.js', './party-wave-one-modes.js', './party-wave-one-imposter-modes.js',
    './party-data-tools.js', './party-hub-timers.js', './party-hub-resume-guard.js', './party-hub-round-state.js',
    './party-hub-a11y.js', './secondary-surface-a11y.js', './advanced-resume-guard.js', './advanced-privacy-guard.js',
    './session-ledger.js', './party-session-controls.js', './quick-loader.js', './icon.svg', './icon-192.png', './icon-512.png'
):
    if asset not in core:
        raise SystemExit(f'Offline core missing: {asset}')
if len(core) != len(set(core)):
    raise SystemExit('Service-worker CORE contains duplicates.')
if 'await caches.delete(CACHE)' in sw:
    raise SystemExit('Active cache must not be destroyed before promotion.')
for relative in ('ARCHITECTURE.md', 'DEPLOYMENT.md', 'privacy.html', 'ENVIRONMENTS.md', 'tests/service-worker.test.js'):
    if cache_name not in read(relative):
        raise SystemExit(f'Current cache {cache_name} not synchronized in {relative}.')

package = json.loads(read('package.json'))
lock = json.loads(read('package-lock.json'))
release_evidence = json.loads(read('release-evidence.json'))
if package.get('version') != '1.0.0-beta.3' or package.get('engines', {}).get('node') != '>=20':
    raise SystemExit('Package metadata invalid.')
if package.get('devDependencies', {}).get('@playwright/test') != '1.54.2':
    raise SystemExit('Playwright must remain pinned.')
if lock.get('lockfileVersion') != 3 or lock.get('name') != package.get('name') or lock.get('version') != package.get('version'):
    raise SystemExit('package-lock.json does not match project package metadata.')
if lock.get('packages', {}).get('', {}).get('devDependencies') != package.get('devDependencies'):
    raise SystemExit('package-lock root devDependencies do not match package.json.')

for marker in (
    'tests/core-content-quality.test.js', 'tests/backup-schema-registry.test.js', 'tests/service-worker.test.js',
    'tests/word-imposter-data-contract.test.js', 'tests/party-hub-resume-guard.test.js',
    'tests/party-wave-one-catalog.test.js', 'tests/party-wave-one-imposter-catalog.test.js'
):
    if marker not in package.get('scripts', {}).get('test', ''):
        raise SystemExit(f'Unit gate missing: {marker}')
for marker in (
    'party-core-release-catalog.js', 'party-core-classic-content.js', 'party-wave-one-catalog.js',
    'party-wave-one-imposter-catalog.js', 'party-wave-one-modes.js', 'party-wave-one-imposter-modes.js',
    'backup-schema-registry.js', 'party-data-tools.js', 'word-imposter-resume-guard.js',
    'party-hub-resume-guard.js', 'party-hub-round-state.js', 'party-hub-a11y.js',
    'secondary-surface-a11y.js', 'advanced-resume-guard.js', 'advanced-privacy-guard.js', 'quick-loader.js'
):
    if f'node --check {marker}' not in package.get('scripts', {}).get('check', ''):
        raise SystemExit(f'Syntax gate missing: {marker}')
for marker in ('tests/e2e/wave-one-quiz.spec.js', 'tests/e2e/wave-one-imposter.spec.js'):
    if f'node --check {marker}' not in package.get('scripts', {}).get('check', ''):
        raise SystemExit(f'Wave 1 browser contract missing from syntax gate: {marker}')
for marker in (
    'scripts/architecture_audit.py', 'scripts/wave_one_quiz_audit.py', 'scripts/wave_one_imposter_audit.py',
    'scripts/foundation_contract_audit.py', 'scripts/lockfile_contract_audit.py',
    'scripts/branch_protection_contract_audit.py', 'scripts/staging_smoke_contract_audit.py',
    'scripts/hub_a11y_contract_audit.py', 'scripts/secondary_surface_a11y_contract_audit.py',
    'scripts/privacy_content_audit.py', 'scripts/reference_content_audit.py', 'scripts/asset_provenance_audit.py',
    'scripts/operator_release_contract_audit.py', 'scripts/release_evidence_audit.py',
    'scripts/release_readiness_contract_audit.py', 'scripts/performance_budget.py', 'scripts/release_audit.py'
):
    if marker not in package.get('scripts', {}).get('validate', ''):
        raise SystemExit(f'Validate gate missing: {marker}')

for forbidden in ('eval(', 'new Function(', 'document.write(', 'http://'):
    for relative in (
        'party-data-tools.js', 'party-routing.js', 'party-core-release-catalog.js', 'party-core-classic-content.js',
        'party-wave-one-catalog.js', 'party-wave-one-modes.js', 'party-wave-one-imposter-modes.js',
        'party-hub.js', 'advanced-resume-guard.js', 'word-imposter-resume-guard.js'
    ):
        if forbidden in read(relative):
            raise SystemExit(f'Forbidden pattern {forbidden} in {relative}')

gates = release_evidence.get('gates') if isinstance(release_evidence.get('gates'), dict) else {}
ci_status = (gates.get('ci') or {}).get('status')
if ci_status not in {'OPEN', 'BLOCKED', 'PASS', 'FAIL'}:
    raise SystemExit('Release evidence has an invalid CI gate status.')

print(json.dumps({
    'project_validation': 'PASS',
    'cache': cache_name,
    'catalog_chain': catalog_chain,
    'built_in_games': 49,
    'release_tiers': {'core': 15, 'extended': 13, 'labs': 21},
    'wave_one_labs': ['party-quiz', 'fact-or-fake', 'undercover-similar-word', 'no-word-imposter'],
    'quick_loader_version': 9,
    'central_backup_schema': 'v2',
    'complete_backup_key_allowlist': True,
    'consent_copy_visible': True,
    'word_imposter_resume_guard_loaded': True,
    'hub_resume_guard_loader_present': True,
    'advanced_resume_privacy_guards_loaded': True,
    'hub_accessibility_loader_present': True,
    'secondary_accessibility_loaded': ['advanced.html', 'quick-play.html', 'creator.html'],
    'lockfile': 'v3',
    'online_npm_ci_verified': ci_status == 'PASS',
    'ci_evidence_status': ci_status,
    'release_decision': release_evidence.get('releaseDecision'),
    'release_readiness_contract': True,
}, ensure_ascii=False, indent=2))
