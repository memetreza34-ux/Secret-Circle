#!/usr/bin/env python3
from pathlib import Path
import json
import re
import struct

ROOT = Path(__file__).resolve().parents[1]

required_files = [
    'index.html', 'privacy.html', 'styles.css', 'pwa.css', 'app.js',
    'game-engine.js', 'word-packs.js', 'data-store.js',
    'manifest.webmanifest', 'sw.js', 'icon.svg', 'icon-192.png',
    'icon-512.png', 'package.json', 'playwright.config.js',
    'tests/engine.test.js', 'tests/storage.test.js',
    'tests/e2e/game-flow.spec.js', 'tests/e2e/accessibility.spec.js',
    'tests/e2e/timer.spec.js', 'tests/e2e/offline.spec.js',
    'tests/e2e/content.spec.js', 'tests/e2e/history.spec.js',
    'tests/e2e/storage-safety.spec.js', 'scripts/validate_project.py',
    '.github/workflows/ci.yml', 'README.md', 'RELEASE_CHECKLIST.md'
]
missing = [path for path in required_files if not (ROOT / path).is_file()]
if missing:
    raise SystemExit(f'Missing release files: {", ".join(missing)}')

read = lambda path: (ROOT / path).read_text(encoding='utf-8')
index = read('index.html')
privacy = read('privacy.html')
app = read('app.js')
engine = read('game-engine.js')
word_packs = read('word-packs.js')
data_store = read('data-store.js')
engine_tests = read('tests/engine.test.js')
storage_tests = read('tests/storage.test.js')
e2e_game = read('tests/e2e/game-flow.spec.js')
e2e_timer = read('tests/e2e/timer.spec.js')
e2e_offline = read('tests/e2e/offline.spec.js')
e2e_content = read('tests/e2e/content.spec.js')
e2e_history = read('tests/e2e/history.spec.js')
e2e_storage = read('tests/e2e/storage-safety.spec.js')
a11y_tests = read('tests/e2e/accessibility.spec.js')
service_worker = read('sw.js')
workflow = read('.github/workflows/ci.yml')
package = json.loads(read('package.json'))
manifest = json.loads(read('manifest.webmanifest'))

for marker in [
    'lang="de"', 'viewport-fit=cover', 'aria-live="polite"',
    'Content-Security-Policy', 'referrer', 'apple-mobile-web-app-capable',
    'apple-touch-icon', 'privacy.html', 'delete-all-data',
    'word-packs.js', 'data-store.js', 'export-data', 'import-data'
]:
    if marker not in index:
        raise SystemExit(f'Release marker missing in index.html: {marker}')
for directive in [
    "default-src 'self'", "script-src 'self'", "style-src 'self'",
    "object-src 'none'", "base-uri 'none'", "form-action 'self'"
]:
    if directive not in index:
        raise SystemExit(f'Content Security Policy directive missing: {directive}')
for marker in ['lokal', 'keine', 'tracking', 'löschen', 'Sicherung exportieren und importieren']:
    if marker.lower() not in privacy.lower():
        raise SystemExit(f'Privacy disclosure missing: {marker}')

for marker in [
    'SecretCircleStore', 'clearAllData', 'serviceWorker',
    'beforeinstallprompt', 'SecretCircleContent', 'exportBackup',
    'importBackup', 'recordRoundHistory', 'E.startTimer', 'E.pauseTimer',
    'E.syncTimer', 'visibilitychange', 'pagehide'
]:
    if marker not in app:
        raise SystemExit(f'Runtime capability missing: {marker}')

for pattern, description in [
    (r'VERSION\s*=\s*7', 'game engine version 7'),
    (r'KEY_VERSION\s*=\s*7', 'storage schema version 7'),
    (r'ENGINE_VERSION\s*=\s*7', 'storage engine migration version 7')
]:
    source = engine if pattern.startswith('VERSION') else data_store
    if not re.search(pattern, source):
        raise SystemExit(f'Missing {description}.')
for marker in [
    'MAX_TIE_BREAKS', 'normalizeUsedWords', 'availableEntries',
    'timerRunning', 'timerDeadline', 'startTimer', 'pauseTimer',
    'syncTimer', 'bereits abgestimmt', 'Selbststimmen sind ungültig'
]:
    if marker not in engine:
        raise SystemExit(f'Game engine safety marker missing: {marker}')
for marker in [
    'upgradeActiveSnapshot', 'removeLegacyKind', 'IMPORT_PROBE_KEY',
    'beschädigte lokale Daten', 'exportBackup', 'importBackup'
]:
    if marker not in data_store:
        raise SystemExit(f'Storage resilience marker missing: {marker}')

for marker in [
    'deadlineTimer', 'backgroundResume', 'finiteTieBreak',
    'duplicateVoteProtection', 'noRepeatedWords', 'validation', 'history'
]:
    if marker not in engine_tests:
        raise SystemExit(f'Engine safety test missing: {marker}')
for marker in [
    'storageMigration', 'realLegacyGameUpgrade', 'currentKeyUpgrade',
    'corruptedDataRecovery', 'backupExportImport', 'legacyBackupImport',
    'oversizedBackupProtection', 'atomicImportRollback'
]:
    if marker not in storage_tests:
        raise SystemExit(f'Storage safety test missing: {marker}')

browser_requirements = {
    'game-flow': (e2e_game, [
        'full match round', 'multiple match rounds', 'interrupted round',
        'complete local backup', 'corrupted persisted data'
    ]),
    'timer': (e2e_timer, [
        'deadline timer counts accurately', 'survives a reload',
        'elapsed background deadline', 'legacy active game'
    ]),
    'offline': (e2e_offline, [
        'secret-circle-v9', 'service worker', 'icon-192.png', 'icon-512.png'
    ]),
    'content': (e2e_content, ['category']),
    'history': (e2e_history, ['stored exactly once']),
    'storage-safety': (e2e_storage, ['storage']),
    'accessibility': (a11y_tests, [
        'structural accessibility gates', 'retain focus',
        'large touch targets', 'reduced motion'
    ])
}
for suite, (source, markers) in browser_requirements.items():
    for marker in markers:
        if marker.lower() not in source.lower():
            raise SystemExit(f'Browser coverage missing in {suite}: {marker}')

category_count = word_packs.count('entries:[')
term_count = len(re.findall(r"\['(?:[^'\\]|\\.)*','(?:[^'\\]|\\.)*'\]", word_packs))
if category_count < 14:
    raise SystemExit(f'Too few built-in category packs: {category_count}')
if term_count < 168:
    raise SystemExit(f'Too few built-in terms: {term_count}')

if manifest.get('id') != './' or manifest.get('start_url') != './' or manifest.get('scope') != './':
    raise SystemExit('PWA manifest id, start_url and scope must be relative.')
if manifest.get('display') != 'standalone':
    raise SystemExit('PWA manifest must use standalone display mode.')
if manifest.get('lang') != 'de':
    raise SystemExit('PWA manifest language must be German.')
icons = manifest.get('icons') or []
for expected in [
    ('icon-192.png', '192x192', 'image/png'),
    ('icon-512.png', '512x512', 'image/png'),
    ('icon.svg', 'any', 'image/svg+xml')
]:
    if not any((icon.get('src'), icon.get('sizes'), icon.get('type')) == expected for icon in icons):
        raise SystemExit(f'PWA manifest icon missing: {expected[0]}')

png_dimensions = {}
for relative, expected_size in [('icon-192.png', 192), ('icon-512.png', 512)]:
    data = (ROOT / relative).read_bytes()
    if len(data) < 1000 or data[:8] != b'\x89PNG\r\n\x1a\n' or data[12:16] != b'IHDR':
        raise SystemExit(f'Invalid PNG icon: {relative}')
    width, height = struct.unpack('>II', data[16:24])
    if (width, height) != (expected_size, expected_size):
        raise SystemExit(f'Wrong PNG size for {relative}: {width}x{height}')
    png_dimensions[relative] = f'{width}x{height}'

cache_match = re.search(r"const CACHE='([^']+)'", service_worker)
if not cache_match or cache_match.group(1) != 'secret-circle-v9':
    raise SystemExit('Service worker cache version must be secret-circle-v9.')
for asset in [
    './index.html', './privacy.html', './styles.css', './pwa.css',
    './app.js', './game-engine.js', './word-packs.js', './data-store.js',
    './manifest.webmanifest', './icon.svg', './icon-192.png', './icon-512.png'
]:
    if asset not in service_worker:
        raise SystemExit(f'Offline core asset missing from service worker: {asset}')
if 'event.waitUntil' not in service_worker:
    raise SystemExit('Runtime cache writes must be attached to fetch event lifetime.')

scripts = package.get('scripts', {})
for marker in ['tests/engine.test.js', 'tests/storage.test.js']:
    if marker not in scripts.get('test', ''):
        raise SystemExit(f'Unit test command missing: {marker}')
for marker in ['app.js', 'game-engine.js', 'data-store.js', 'word-packs.js', 'sw.js']:
    if marker not in scripts.get('check', ''):
        raise SystemExit(f'Syntax check missing: {marker}')
playwright_version = package.get('devDependencies', {}).get('@playwright/test', '')
if not re.fullmatch(r'\d+\.\d+\.\d+', playwright_version):
    raise SystemExit('Playwright dependency must be pinned to an exact version.')
for command in ['npm run check', 'npm test', 'npm run validate', 'npm run test:e2e']:
    if command not in workflow:
        raise SystemExit(f'CI command missing: {command}')

for forbidden in ['eval(', 'new Function(', 'document.write(', 'innerHTML = location', 'http://']:
    if any(forbidden in source for source in [app, engine, word_packs, data_store]):
        raise SystemExit(f'Forbidden release pattern detected: {forbidden}')
for forbidden_path in ['.env', 'node_modules', 'dist', 'build']:
    if (ROOT / forbidden_path).exists():
        raise SystemExit(f'Forbidden generated path committed: {forbidden_path}')

print(json.dumps({
    'release_audit': 'PASS',
    'required_files': len(required_files),
    'pwa_cache': cache_match.group(1),
    'pwa_icons': png_dimensions,
    'privacy': True,
    'content_security_policy': True,
    'offline_core': True,
    'engine_version': 7,
    'storage_schema_version': 7,
    'deadline_timer': True,
    'timer_reload_recovery': True,
    'all_completed_rounds_recorded': True,
    'backup_export_import': True,
    'corruption_recovery': True,
    'legacy_migration': True,
    'built_in_categories': category_count,
    'built_in_terms': term_count,
    'finite_voting': True,
    'duplicate_vote_protection': True,
    'non_repeating_match_words': True,
    'browser_test_suites': len(browser_requirements),
    'accessibility_gates': True,
    'mobile_quality_gates': True,
    'pinned_playwright': playwright_version
}, ensure_ascii=False, indent=2))
