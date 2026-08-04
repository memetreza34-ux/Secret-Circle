#!/usr/bin/env python3
from pathlib import Path
from html.parser import HTMLParser
import ast
import json
import re
import struct

ROOT = Path(__file__).resolve().parents[1]
read = lambda path: (ROOT / path).read_text(encoding='utf-8')

REQUIRED = {
    'index.html', 'privacy.html', 'styles.css', 'pwa.css',
    'runtime-guard.js', 'setup-ux.js', 'privacy-guard.js', 'wake-lock.js',
    'game-engine.js', 'role-assignment.js', 'word-packs.js', 'data-store.js',
    'app.js', 'sw.js', 'manifest.webmanifest', 'icon.svg', 'icon-192.png',
    'icon-512.png', 'package.json', 'playwright.config.js',
    'playwright.cross-browser.config.js', 'tests/engine.test.js',
    'tests/storage.test.js', 'tests/content.test.js',
    'tests/role-assignment.test.js', 'tests/fuzz.test.js',
    'tests/e2e/game-flow.spec.js', 'tests/e2e/setup-limits.spec.js',
    'tests/e2e/timer.spec.js', 'tests/e2e/offline.spec.js',
    'tests/e2e/pwa-install.spec.js', 'tests/e2e/runtime-guard.spec.js',
    'tests/e2e/privacy-guard.spec.js', 'tests/e2e/wake-lock.spec.js',
    'tests/e2e/role-assignment.spec.js', 'tests/e2e/content.spec.js',
    'tests/e2e/history.spec.js', 'tests/e2e/storage-safety.spec.js',
    'tests/e2e/security.spec.js', 'tests/e2e/accessibility.spec.js',
    'tests/cross-browser/smoke.spec.js', 'scripts/repo_hygiene.py',
    'scripts/performance_budget.py', 'scripts/release_audit.py',
    '.github/workflows/ci.yml', '.github/workflows/cross-browser.yml',
    'README.md', 'RELEASE_CHECKLIST.md', 'RELEASE_STATUS.md',
    'CHANGELOG.md', 'KNOWN_LIMITATIONS.md', 'SECURITY.md',
    'MANUAL_TEST_PLAN.md', 'CI_TROUBLESHOOTING.md', 'DEPLOYMENT.md'
}
missing = sorted(path for path in REQUIRED if not (ROOT / path).is_file())
if missing:
    raise SystemExit(f'Missing required files: {", ".join(missing)}')

OBSOLETE = {
    'match.css', 'accessibility.js', 'accessibility.css',
    'ACCESSIBILITY_VALIDATION.md', 'tests/accessibility.test.js'
}
remaining = sorted(path for path in OBSOLETE if (ROOT / path).exists())
if remaining:
    raise SystemExit(f'Obsolete files remain: {", ".join(remaining)}')


class HtmlAudit(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids = []
        self.labels = set()
        self.controls = []
        self.assets = set()
        self.scripts = []
        self.meta = {}

    def handle_starttag(self, tag, attrs):
        values = dict(attrs)
        if values.get('id'):
            self.ids.append(values['id'])
        if tag == 'label' and values.get('for'):
            self.labels.add(values['for'])
        if tag in {'input', 'select', 'textarea'}:
            self.controls.append((tag, values))
        if tag == 'script' and values.get('src'):
            self.assets.add(values['src'])
            self.scripts.append(values['src'])
        if tag == 'link' and values.get('href') and values.get('rel') in {'stylesheet', 'manifest', 'icon', 'apple-touch-icon'}:
            self.assets.add(values['href'])
        if tag == 'meta':
            key = values.get('name') or values.get('http-equiv')
            if key:
                self.meta[key.lower()] = values.get('content', '')


index = read('index.html')
html = HtmlAudit()
html.feed(index)
duplicates = sorted({item for item in html.ids if html.ids.count(item) > 1})
if duplicates:
    raise SystemExit(f'Duplicate HTML ids: {", ".join(duplicates)}')
for tag, attrs in html.controls:
    control_id = attrs.get('id')
    if not (control_id in html.labels or attrs.get('aria-label') or attrs.get('aria-labelledby')):
        raise SystemExit(f'Unlabelled control: {tag}#{control_id or "unknown"}')
for asset in html.assets:
    if asset.startswith(('http:', 'https:', 'data:')) or not (ROOT / asset.lstrip('./')).is_file():
        raise SystemExit(f'Invalid HTML asset: {asset}')

EXPECTED_SCRIPTS = [
    'runtime-guard.js', 'setup-ux.js', 'privacy-guard.js', 'wake-lock.js',
    'game-engine.js', 'role-assignment.js', 'word-packs.js',
    'data-store.js', 'app.js'
]
if html.scripts != EXPECTED_SCRIPTS:
    raise SystemExit(f'Unexpected runtime script order: {html.scripts}')

csp = html.meta.get('content-security-policy', '')
for directive in [
    "default-src 'self'", "script-src 'self'", "style-src 'self'",
    "object-src 'none'", "base-uri 'none'", "form-action 'self'"
]:
    if directive not in csp:
        raise SystemExit(f'CSP directive missing: {directive}')

engine = read('game-engine.js')
store = read('data-store.js')
roles = read('role-assignment.js')
content = read('word-packs.js')
if not re.search(r'\bVERSION\s*=\s*7\b', engine):
    raise SystemExit('Game engine version must be 7.')
if not re.search(r'\bKEY_VERSION\s*=\s*7\b', store) or not re.search(r'\bENGINE_VERSION\s*=\s*7\b', store):
    raise SystemExit('Storage schema and migration engine must be version 7.')
for marker in [
    'MAX_IMPOSTERS = 6', 'independent-roles-v1', 'assignIndependentRoles',
    'validateGameRoles', 'engine.assertGame', 'engine.restoreGame',
    'engine.createGame', 'engine.nextRound', 'version: 2'
]:
    if marker not in roles:
        raise SystemExit(f'Role-assignment marker missing: {marker}')

category_count = content.count('entries:[')
term_count = len(re.findall(r"\['(?:[^'\\]|\\.)*','(?:[^'\\]|\\.)*'\]", content))
if (category_count, term_count) != (14, 168):
    raise SystemExit(f'Unexpected content size: {category_count} categories, {term_count} terms.')

sw = read('sw.js')
cache = re.search(r"const CACHE='([^']+)'", sw)
if not cache or cache.group(1) != 'secret-circle-v18':
    raise SystemExit('Service worker cache must be secret-circle-v18.')
core_match = re.search(r'const CORE=(\[[^;]+\]);', sw)
if not core_match:
    raise SystemExit('Service worker CORE list missing.')
core = ast.literal_eval(core_match.group(1))
EXPECTED_CORE = [
    './', './index.html', './privacy.html', './styles.css', './pwa.css',
    './runtime-guard.js', './setup-ux.js', './privacy-guard.js',
    './wake-lock.js', './app.js', './game-engine.js',
    './role-assignment.js', './word-packs.js', './data-store.js',
    './manifest.webmanifest', './icon.svg', './icon-192.png', './icon-512.png'
]
if core != EXPECTED_CORE:
    raise SystemExit('Service worker CORE list is not synchronized.')
for marker in ['cache.addAll', 'await cache.put', 'self.clients.claim', 'handleNavigation', 'handleAsset']:
    if marker not in sw:
        raise SystemExit(f'Service-worker marker missing: {marker}')

manifest = json.loads(read('manifest.webmanifest'))
if any(manifest.get(key) != './' for key in ('id', 'start_url', 'scope')):
    raise SystemExit('Manifest scope values must be relative.')
if manifest.get('display') != 'standalone' or manifest.get('lang') != 'de':
    raise SystemExit('Manifest display or language is invalid.')
for source, size in [('icon-192.png', 192), ('icon-512.png', 512)]:
    icon = next((item for item in manifest.get('icons', []) if item.get('src') == source), None)
    if not icon or icon.get('sizes') != f'{size}x{size}' or icon.get('type') != 'image/png':
        raise SystemExit(f'Manifest icon invalid: {source}')
    data = (ROOT / source).read_bytes()
    if data[:8] != b'\x89PNG\r\n\x1a\n' or data[12:16] != b'IHDR':
        raise SystemExit(f'PNG signature invalid: {source}')
    width, height = struct.unpack('>II', data[16:24])
    if (width, height) != (size, size):
        raise SystemExit(f'PNG dimensions invalid: {source}')

package = json.loads(read('package.json'))
if package.get('version') != '1.0.0-beta.3' or package.get('engines', {}).get('node') != '>=20':
    raise SystemExit('Package metadata invalid.')
scripts = package.get('scripts', {})
for name in ['test', 'check', 'validate', 'test:e2e', 'test:cross-browser', 'ci']:
    if not scripts.get(name):
        raise SystemExit(f'Package script missing: {name}')
for marker in [
    'runtime-guard.js', 'setup-ux.js', 'privacy-guard.js', 'wake-lock.js',
    'role-assignment.js', 'app.js', 'game-engine.js', 'data-store.js',
    'word-packs.js', 'sw.js'
]:
    if marker not in scripts['check']:
        raise SystemExit(f'Syntax gate missing: {marker}')
for marker in [
    'tests/engine.test.js', 'tests/storage.test.js', 'tests/content.test.js',
    'tests/role-assignment.test.js', 'tests/fuzz.test.js'
]:
    if marker not in scripts['test']:
        raise SystemExit(f'Unit gate missing: {marker}')

MARKERS = {
    'setup-ux.js': ['refreshAfterAsyncAction', 'version: 3'],
    'tests/role-assignment.test.js': ['restoredSevenImpostersRejected', 'sampledGames'],
    'tests/e2e/role-assignment.spec.js': ['restoreLimitMessage', 'independent from reveal order'],
    'tests/e2e/offline.spec.js': ['secret-circle-v18', 'role-assignment.js'],
    'tests/e2e/runtime-guard.spec.js': ['secret-circle-v18'],
    'DEPLOYMENT.md': ['secret-circle-v18', 'Aufdeckreihenfolge'],
    'RELEASE_STATUS.md': ['Cache-Version 18', 'unabhängige Rollenverteilung'],
    'README.md': ['secret-circle-v18', 'Aufdeckreihenfolge'],
    'CHANGELOG.md': ['secret-circle-v18', 'Aufdeckreihenfolge'],
    'RELEASE_CHECKLIST.md': ['Aufdeckreihenfolge'],
    'MANUAL_TEST_PLAN.md': ['Aufdeckreihenfolge']
}
for relative, markers in MARKERS.items():
    text = read(relative)
    for marker in markers:
        if marker.lower() not in text.lower():
            raise SystemExit(f'Missing marker {marker} in {relative}')

print(json.dumps({
    'structure_validation': 'PASS',
    'required_files': len(REQUIRED),
    'runtime_script_order': html.scripts,
    'engine_version': 7,
    'storage_version': 7,
    'role_assignment_version': 2,
    'maximum_imposters': 6,
    'independent_role_assignment': True,
    'pwa_cache': cache.group(1),
    'offline_core_assets': len(core),
    'built_in_categories': category_count,
    'built_in_terms': term_count
}, ensure_ascii=False, indent=2))
