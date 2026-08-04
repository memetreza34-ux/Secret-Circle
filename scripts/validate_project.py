#!/usr/bin/env python3
from pathlib import Path
from html.parser import HTMLParser
import ast
import json
import re
import struct

ROOT = Path(__file__).resolve().parents[1]

REQUIRED_FILES = {
    'index.html', 'privacy.html', 'styles.css', 'pwa.css',
    'runtime-guard.js', 'setup-ux.js', 'privacy-guard.js', 'app.js',
    'game-engine.js', 'data-store.js', 'word-packs.js', 'sw.js',
    'manifest.webmanifest', 'icon.svg', 'icon-192.png', 'icon-512.png',
    'package.json', 'playwright.config.js', 'playwright.cross-browser.config.js',
    'tests/engine.test.js', 'tests/storage.test.js', 'tests/content.test.js',
    'tests/fuzz.test.js', 'tests/e2e/game-flow.spec.js',
    'tests/e2e/setup-limits.spec.js', 'tests/e2e/timer.spec.js',
    'tests/e2e/offline.spec.js', 'tests/e2e/pwa-install.spec.js',
    'tests/e2e/runtime-guard.spec.js', 'tests/e2e/privacy-guard.spec.js',
    'tests/e2e/content.spec.js', 'tests/e2e/history.spec.js',
    'tests/e2e/storage-safety.spec.js', 'tests/e2e/security.spec.js',
    'tests/e2e/accessibility.spec.js', 'tests/cross-browser/smoke.spec.js',
    'scripts/repo_hygiene.py', 'scripts/performance_budget.py',
    'scripts/release_audit.py', '.github/workflows/ci.yml',
    '.github/workflows/cross-browser.yml', 'README.md',
    'RELEASE_CHECKLIST.md', 'RELEASE_STATUS.md', 'CHANGELOG.md',
    'KNOWN_LIMITATIONS.md', 'SECURITY.md', 'MANUAL_TEST_PLAN.md',
    'CI_TROUBLESHOOTING.md', 'DEPLOYMENT.md'
}

missing = sorted(path for path in REQUIRED_FILES if not (ROOT / path).is_file())
if missing:
    raise SystemExit(f'Missing required files: {", ".join(missing)}')

obsolete = [
    'match.css', 'accessibility.js', 'accessibility.css',
    'ACCESSIBILITY_VALIDATION.md', 'tests/accessibility.test.js'
]
remaining_obsolete = [path for path in obsolete if (ROOT / path).exists()]
if remaining_obsolete:
    raise SystemExit(f'Obsolete files remain tracked: {", ".join(remaining_obsolete)}')

read = lambda path: (ROOT / path).read_text(encoding='utf-8')
index = read('index.html')
service_worker = read('sw.js')
engine = read('game-engine.js')
store = read('data-store.js')
content = read('word-packs.js')
package = json.loads(read('package.json'))
manifest = json.loads(read('manifest.webmanifest'))


class IndexAudit(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids = []
        self.labels_for = set()
        self.controls = []
        self.local_assets = set()
        self.meta = {}

    def handle_starttag(self, tag, attrs):
        values = dict(attrs)
        if values.get('id'):
            self.ids.append(values['id'])
        if tag == 'label' and values.get('for'):
            self.labels_for.add(values['for'])
        if tag in {'input', 'select', 'textarea'}:
            self.controls.append((tag, values))
        if tag == 'script' and values.get('src'):
            self.local_assets.add(values['src'])
        if tag == 'link' and values.get('href') and values.get('rel') in {'stylesheet', 'manifest', 'icon', 'apple-touch-icon'}:
            self.local_assets.add(values['href'])
        if tag == 'meta':
            key = values.get('name') or values.get('http-equiv')
            if key:
                self.meta[key.lower()] = values.get('content', '')


audit = IndexAudit()
audit.feed(index)
duplicate_ids = sorted({value for value in audit.ids if audit.ids.count(value) > 1})
if duplicate_ids:
    raise SystemExit(f'Duplicate HTML ids: {", ".join(duplicate_ids)}')

for tag, attrs in audit.controls:
    control_id = attrs.get('id')
    labelled = control_id in audit.labels_for or attrs.get('aria-label') or attrs.get('aria-labelledby')
    if not labelled:
        raise SystemExit(f'Unlabelled form control: {tag}#{control_id or "unknown"}')

for asset in audit.local_assets:
    if asset.startswith(('http:', 'https:', 'data:')):
        raise SystemExit(f'Unexpected external page asset: {asset}')
    if not (ROOT / asset.lstrip('./')).is_file():
        raise SystemExit(f'HTML references missing asset: {asset}')

required_scripts = {
    'runtime-guard.js', 'setup-ux.js', 'privacy-guard.js',
    'game-engine.js', 'word-packs.js', 'data-store.js', 'app.js'
}
if not required_scripts.issubset(audit.local_assets):
    raise SystemExit(f'HTML script set incomplete: {sorted(required_scripts - audit.local_assets)}')

csp = audit.meta.get('content-security-policy', '')
for directive in [
    "default-src 'self'", "script-src 'self'", "style-src 'self'",
    "object-src 'none'", "base-uri 'none'", "form-action 'self'"
]:
    if directive not in csp:
        raise SystemExit(f'Content Security Policy directive missing: {directive}')

for marker in [
    'players-help', 'imposters-help', 'Spielregeln und Punkte',
    'clear-all-data', 'export-data', 'import-data', 'vote-screen',
    'guess-screen', 'leaderboard', 'Version 1.0.0-beta.3'
]:
    if marker not in index:
        raise SystemExit(f'Index capability marker missing: {marker}')

if not re.search(r'\bVERSION\s*=\s*7\b', engine):
    raise SystemExit('Game engine version must be 7.')
if not re.search(r'\bKEY_VERSION\s*=\s*7\b', store) or not re.search(r'\bENGINE_VERSION\s*=\s*7\b', store):
    raise SystemExit('Storage schema and migration engine must be version 7.')

category_count = content.count('entries:[')
term_count = len(re.findall(r"\['(?:[^'\\]|\\.)*','(?:[^'\\]|\\.)*'\]", content))
if (category_count, term_count) != (14, 168):
    raise SystemExit(f'Unexpected built-in content: {category_count} categories, {term_count} terms.')

cache_match = re.search(r"const CACHE='([^']+)'", service_worker)
if not cache_match or cache_match.group(1) != 'secret-circle-v15':
    raise SystemExit('Service worker cache must be secret-circle-v15.')
core_match = re.search(r'const CORE=(\[[^;]+\]);', service_worker)
if not core_match:
    raise SystemExit('Service worker CORE list is missing or unparsable.')
try:
    core_assets = ast.literal_eval(core_match.group(1))
except (SyntaxError, ValueError) as error:
    raise SystemExit(f'Unable to parse service worker CORE list: {error}')
expected_core = [
    './', './index.html', './privacy.html', './styles.css', './pwa.css',
    './runtime-guard.js', './setup-ux.js', './privacy-guard.js',
    './app.js', './game-engine.js', './word-packs.js', './data-store.js',
    './manifest.webmanifest', './icon.svg', './icon-192.png', './icon-512.png'
]
if core_assets != expected_core:
    raise SystemExit('Service worker CORE list differs from the validated production asset order.')
for marker in ['cache.addAll', 'await cache.put', 'self.clients.claim', 'handleNavigation', 'handleAsset']:
    if marker not in service_worker:
        raise SystemExit(f'Service worker reliability marker missing: {marker}')

if manifest.get('id') != './' or manifest.get('start_url') != './' or manifest.get('scope') != './':
    raise SystemExit('Manifest id, start_url and scope must be stable relative paths.')
if manifest.get('display') != 'standalone' or manifest.get('lang') != 'de':
    raise SystemExit('Manifest display or language is invalid.')
icons = manifest.get('icons') or []
for source, size in [('icon-192.png', '192x192'), ('icon-512.png', '512x512')]:
    if not any(icon.get('src') == source and icon.get('sizes') == size and icon.get('type') == 'image/png' for icon in icons):
        raise SystemExit(f'Manifest PNG icon missing: {source}')

for relative, expected_size in [('icon-192.png', 192), ('icon-512.png', 512)]:
    data = (ROOT / relative).read_bytes()
    if len(data) < 1000 or data[:8] != b'\x89PNG\r\n\x1a\n' or data[12:16] != b'IHDR':
        raise SystemExit(f'Invalid PNG icon: {relative}')
    width, height = struct.unpack('>II', data[16:24])
    if (width, height) != (expected_size, expected_size):
        raise SystemExit(f'Unexpected PNG dimensions for {relative}: {width}x{height}')

if package.get('version') != '1.0.0-beta.3' or package.get('engines', {}).get('node') != '>=20':
    raise SystemExit('Package version or Node support declaration is invalid.')
scripts = package.get('scripts', {})
for name in ['test', 'check', 'validate', 'test:e2e', 'test:cross-browser', 'ci']:
    if not scripts.get(name):
        raise SystemExit(f'Package script missing: {name}')
for marker in [
    'runtime-guard.js', 'setup-ux.js', 'privacy-guard.js', 'app.js',
    'game-engine.js', 'data-store.js', 'word-packs.js', 'sw.js'
]:
    if marker not in scripts['check']:
        raise SystemExit(f'Syntax gate missing: {marker}')
for marker in ['tests/engine.test.js', 'tests/storage.test.js', 'tests/content.test.js', 'tests/fuzz.test.js']:
    if marker not in scripts['test']:
        raise SystemExit(f'Unit test gate missing: {marker}')

for relative, markers in {
    'setup-ux.js': ['maximumImposters', 'Höchstens 20', 'SecretCircleSetupUx'],
    'privacy-guard.js': ['concealSecret', 'automatisch verdeckt', 'SecretCirclePrivacyGuard'],
    'tests/e2e/offline.spec.js': ['secret-circle-v15', 'privacy-guard.js'],
    'tests/e2e/runtime-guard.spec.js': ['secret-circle-v15'],
    'tests/e2e/privacy-guard.spec.js': ['secret card is concealed', 'continues normally'],
    'tests/e2e/setup-limits.spec.js': ['live player count and valid imposter range'],
    'tests/fuzz.test.js': ['deterministicFuzzScenarios', 'corruptionMutationsRejected'],
    'tests/content.test.js': ['totalTerms', 'safeTextOnlyContent'],
    'DEPLOYMENT.md': ['secret-circle-v15'],
    'RELEASE_STATUS.md': ['Cache-Version 15']
}.items():
    text = read(relative)
    for marker in markers:
        if marker.lower() not in text.lower():
            raise SystemExit(f'Missing release marker {marker} in {relative}')

print(json.dumps({
    'structure_validation': 'PASS',
    'required_files': len(REQUIRED_FILES),
    'html_ids': len(audit.ids),
    'local_page_assets': sorted(audit.local_assets),
    'engine_version': 7,
    'storage_version': 7,
    'pwa_cache': cache_match.group(1),
    'offline_core_assets': len(core_assets),
    'built_in_categories': category_count,
    'built_in_terms': term_count,
    'obsolete_files_removed': obsolete
}, ensure_ascii=False, indent=2))
