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
    'sw.js', 'manifest.webmanifest', 'package.json', 'package-lock.json',
    'backup-schema-registry.js', 'party-data-tools.js',
    'party-core-release-catalog.js', 'party-core-classic-content.js', 'party-routing.js',
    'session-ledger.js', 'party-session-controls.js', 'party-hub-timers.js', 'party-hub.js',
    'tests/core-content-quality.test.js', 'tests/backup-schema-registry.test.js', 'tests/service-worker.test.js',
    'ARCHITECTURE.md', 'DEPLOYMENT.md', 'CONTENT_AGE_POLICY.md', 'CORE_CONTENT_REVIEW.md',
    'SECURITY.md', 'THREAT_MODEL.md', 'RISK_REGISTER.md', 'BRANCH_PROTECTION.md', 'ENVIRONMENTS.md',
    'scripts/lockfile_contract_audit.py', 'scripts/branch_protection_contract_audit.py',
    'scripts/staging_smoke_contract_audit.py', 'scripts/privacy_content_audit.py',
    'scripts/reference_content_audit.py', 'scripts/release_readiness_contract_audit.py',
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

def audit_html(relative: str, expected_scripts: list[str]) -> str:
    source = read(relative)
    audit = Audit()
    audit.feed(source)
    duplicates = sorted({value for value in audit.ids if audit.ids.count(value) > 1})
    if duplicates:
        raise SystemExit(f'Duplicate ids in {relative}: {duplicates}')
    for tag, attrs in audit.controls:
        control_id = attrs.get('id')
        labelled = control_id in audit.labels or attrs.get('aria-label') or attrs.get('aria-labelledby')
        if not labelled:
            raise SystemExit(f'Unlabelled control in {relative}: {tag}#{control_id or "unknown"}')
    for asset in audit.assets:
        if asset.startswith(('http:', 'https:')):
            raise SystemExit(f'External runtime asset in {relative}: {asset}')
        if not (ROOT / asset.lstrip('./')).is_file():
            raise SystemExit(f'Missing runtime asset in {relative}: {asset}')
    if audit.scripts != expected_scripts:
        raise SystemExit(f'Unexpected script order in {relative}: {audit.scripts}')
    for directive in ("default-src 'self'", "script-src 'self'", "style-src 'self'", "object-src 'none'", "base-uri 'none'", "form-action 'self'"):
        if directive not in audit.csp:
            raise SystemExit(f'CSP directive missing in {relative}: {directive}')
    return source

catalog_chain = [
    'party-catalog.js', 'party-expansion.js', 'party-trending-catalog.js', 'party-mega-catalog.js',
    'party-viral-catalog.js', 'party-core-release-catalog.js', 'party-core-classic-content.js', 'party-routing.js'
]

party = audit_html('party.html', [
    'runtime-guard.js', *catalog_chain, 'party-custom-packs.js', 'session-ledger.js',
    'party-session-controls.js', 'party-hub-timers.js', 'party-hub.js', 'party-hub-plus.js',
    'party-hub-polish.js', 'party-night.js', 'backup-schema-registry.js', 'party-data-tools.js'
])
quick = audit_html('quick-play.html', ['runtime-guard.js', *catalog_chain, 'party-custom-packs.js', 'quick-loader.js'])
audit_html('advanced.html', [
    'runtime-guard.js', 'party-catalog.js', 'party-expansion.js', 'party-routing.js',
    'party-advanced.js', 'party-advanced-runner.js', 'party-advanced-preferences.js'
])
audit_html('creator.html', ['runtime-guard.js', 'game-creator.js', 'creator-page.js'])
audit_html('privacy.html', [])
audit_html('index.html', [
    'runtime-guard.js', 'setup-ux.js', 'privacy-guard.js', 'wake-lock.js',
    'game-engine.js', 'role-assignment.js', 'word-packs.js', 'data-store.js', 'app.js'
])

for marker in (
    'Euer Party-Hub · privat · lokal', 'Persönliche Inhalte sind freiwillig',
    'backup-schema-registry.js', 'party-data-tools.js', 'pause-hub-game', 'skip-hub-round'
):
    if marker not in party:
        raise SystemExit(f'Party Hub release marker missing: {marker}')

if 'party-core-classic-content.js' not in quick:
    raise SystemExit('Quick page is missing final Core content layer.')

registry = read('backup-schema-registry.js')
data_tools = read('party-data-tools.js')
if 'const VERSION = 2;' not in registry or 'isAllowedCompleteStorageKey' not in registry:
    raise SystemExit('Backup registry v2/key policy missing.')
for marker in (
    'SecretCircleBackupSchemas', "registry.validateHeader(payload, 'complete')",
    'registry.isAllowedCompleteStorageKey', 'const FORMAT = schema.format',
    'const MAX_BYTES = schema.maximumBytes'
):
    if marker not in data_tools:
        raise SystemExit(f'Party data tools central-schema contract missing: {marker}')
for forbidden in (
    "const FORMAT = 'secret-circle-complete-backup'",
    'const MAX_BYTES = 1_500_000', 'const MAX_ENTRIES = 100', 'const MAX_VALUE_BYTES = 1_000_000'
):
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
    './backup-schema-registry.js', './party-catalog.js', './party-core-release-catalog.js', './party-core-classic-content.js',
    './party-data-tools.js', './party-hub-timers.js', './session-ledger.js', './party-session-controls.js',
    './icon.svg', './icon-192.png', './icon-512.png'
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
if package.get('version') != '1.0.0-beta.3' or package.get('engines', {}).get('node') != '>=20':
    raise SystemExit('Package metadata invalid.')
if package.get('devDependencies', {}).get('@playwright/test') != '1.54.2':
    raise SystemExit('Playwright must remain pinned.')
if lock.get('lockfileVersion') != 3 or lock.get('name') != package.get('name') or lock.get('version') != package.get('version'):
    raise SystemExit('package-lock.json does not match project package metadata.')
if lock.get('packages', {}).get('', {}).get('devDependencies') != package.get('devDependencies'):
    raise SystemExit('package-lock root devDependencies do not match package.json.')

for marker in ('tests/core-content-quality.test.js', 'tests/backup-schema-registry.test.js', 'tests/service-worker.test.js'):
    if marker not in package.get('scripts', {}).get('test', ''):
        raise SystemExit(f'Unit gate missing: {marker}')
for marker in ('party-core-release-catalog.js', 'party-core-classic-content.js', 'backup-schema-registry.js', 'party-data-tools.js'):
    if f'node --check {marker}' not in package.get('scripts', {}).get('check', ''):
        raise SystemExit(f'Syntax gate missing: {marker}')
for marker in (
    'scripts/architecture_audit.py', 'scripts/foundation_contract_audit.py', 'scripts/lockfile_contract_audit.py',
    'scripts/branch_protection_contract_audit.py', 'scripts/staging_smoke_contract_audit.py',
    'scripts/privacy_content_audit.py', 'scripts/reference_content_audit.py',
    'scripts/asset_provenance_audit.py', 'scripts/release_readiness_contract_audit.py',
    'scripts/performance_budget.py', 'scripts/release_audit.py'
):
    if marker not in package.get('scripts', {}).get('validate', ''):
        raise SystemExit(f'Validate gate missing: {marker}')

for forbidden in ('eval(', 'new Function(', 'document.write(', 'http://'):
    for relative in ('party-data-tools.js', 'party-routing.js', 'party-core-release-catalog.js', 'party-core-classic-content.js', 'party-hub.js'):
        if forbidden in read(relative):
            raise SystemExit(f'Forbidden pattern {forbidden} in {relative}')

print(json.dumps({
    'project_validation': 'PASS',
    'cache': cache_name,
    'catalog_chain': catalog_chain,
    'central_backup_schema': 'v2',
    'complete_backup_key_allowlist': True,
    'consent_copy_visible': True,
    'lockfile': 'v3',
    'online_npm_ci_verified': False,
    'release_readiness_contract': True,
}, ensure_ascii=False, indent=2))
