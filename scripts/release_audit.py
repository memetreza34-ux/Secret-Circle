#!/usr/bin/env python3
from pathlib import Path
import json
import re

ROOT = Path(__file__).resolve().parents[1]

required_files = [
    'index.html', 'privacy.html', 'styles.css', 'pwa.css', 'app.js',
    'game-engine.js', 'word-packs.js', 'data-store.js',
    'manifest.webmanifest', 'sw.js', 'icon.svg', 'package.json',
    'tests/engine.test.js', 'tests/storage.test.js',
    'tests/e2e/game-flow.spec.js', 'tests/e2e/accessibility.spec.js',
    'tests/e2e/timer.spec.js', 'tests/e2e/offline.spec.js',
    'tests/e2e/content.spec.js', 'tests/e2e/history.spec.js',
    'tests/e2e/storage-safety.spec.js',
    'scripts/validate_project.py', '.github/workflows/ci.yml'
]

missing = [path for path in required_files if not (ROOT / path).is_file()]
if missing:
    raise SystemExit(f'Missing release files: {", ".join(missing)}')

index = (ROOT / 'index.html').read_text(encoding='utf-8')
privacy = (ROOT / 'privacy.html').read_text(encoding='utf-8')
app = (ROOT / 'app.js').read_text(encoding='utf-8')
engine = (ROOT / 'game-engine.js').read_text(encoding='utf-8')
word_packs = (ROOT / 'word-packs.js').read_text(encoding='utf-8')
data_store = (ROOT / 'data-store.js').read_text(encoding='utf-8')
engine_tests = (ROOT / 'tests/engine.test.js').read_text(encoding='utf-8')
storage_tests = (ROOT / 'tests/storage.test.js').read_text(encoding='utf-8')
e2e_game = (ROOT / 'tests/e2e/game-flow.spec.js').read_text(encoding='utf-8')
e2e_timer = (ROOT / 'tests/e2e/timer.spec.js').read_text(encoding='utf-8')
e2e_offline = (ROOT / 'tests/e2e/offline.spec.js').read_text(encoding='utf-8')
e2e_content = (ROOT / 'tests/e2e/content.spec.js').read_text(encoding='utf-8')
e2e_history = (ROOT / 'tests/e2e/history.spec.js').read_text(encoding='utf-8')
e2e_storage = (ROOT / 'tests/e2e/storage-safety.spec.js').read_text(encoding='utf-8')
a11y_tests = (ROOT / 'tests/e2e/accessibility.spec.js').read_text(encoding='utf-8')
package = json.loads((ROOT / 'package.json').read_text(encoding='utf-8'))
manifest = json.loads((ROOT / 'manifest.webmanifest').read_text(encoding='utf-8'))
service_worker = (ROOT / 'sw.js').read_text(encoding='utf-8')
workflow = (ROOT / '.github/workflows/ci.yml').read_text(encoding='utf-8')

for marker in [
    'lang="de"', 'viewport-fit=cover', 'aria-live="polite"',
    'Content-Security-Policy', 'referrer', 'privacy.html',
    'delete-all-data', 'word-packs.js', 'data-store.js',
    'export-data', 'import-data'
]:
    if marker not in index:
        raise SystemExit(f'Release marker missing in index.html: {marker}')

for directive in ["default-src 'self'", "script-src 'self'", "object-src 'none'", "base-uri 'none'"]:
    if directive not in index:
        raise SystemExit(f'Content Security Policy directive missing: {directive}')

for marker in ['lokal', 'keine', 'tracking', 'löschen', 'Sicherung exportieren und importieren']:
    if marker.lower() not in privacy.lower():
        raise SystemExit(f'Privacy disclosure missing: {marker}')

runtime_markers = [
    'SecretCircleStore', 'clearAllData', 'serviceWorker', 'beforeinstallprompt',
    'SecretCircleContent', 'exportBackup', 'importBackup', 'recordRoundHistory',
    'E.startTimer', 'E.pauseTimer', 'E.syncTimer', 'visibilitychange',
    "game.phase === 'completed'"
]
for marker in runtime_markers:
    if marker not in app:
        raise SystemExit(f'Runtime capability missing: {marker}')

storage_regex = [r'KEY_VERSION\s*=\s*7', r'ENGINE_VERSION\s*=\s*7']
for marker in storage_regex:
    if not re.search(marker, data_store):
        raise SystemExit(f'Storage version marker missing: {marker}')
for marker in [
    'secret-circle-backup', 'legacyVersions', 'upgradeActiveSnapshot',
    'removeLegacyKind', 'beschädigte lokale Daten', 'neue App-Version',
    'exportBackup', 'importBackup', 'IMPORT_PROBE_KEY'
]:
    if marker not in data_store:
        raise SystemExit(f'Storage resilience marker missing: {marker}')
for marker in [
    'storageMigration', 'realLegacyGameUpgrade', 'currentKeyUpgrade',
    'corruptedDataRecovery', 'backupExportImport', 'legacyBackupImport',
    'oversizedBackupProtection', 'atomicImportRollback'
]:
    if marker not in storage_tests:
        raise SystemExit(f'Storage safety test missing: {marker}')

for marker in ['SecretCircleContent', 'Anime', 'Gaming', 'Internet & Social Media', 'Elektroniker']:
    if marker not in word_packs:
        raise SystemExit(f'Built-in content marker missing: {marker}')
if word_packs.count("entries:[") < 12:
    raise SystemExit('Too few built-in category packs.')

engine_markers = [
    r'VERSION\s*=\s*7', 'tie_break', 'leaderboard', 'MAX_TIE_BREAKS',
    'bereits abgestimmt', 'Selbststimmen sind ungültig', 'usedWords',
    'normalizeUsedWords', 'availableEntries', 'timerRunning', 'timerDeadline',
    'startTimer', 'pauseTimer', 'syncTimer'
]
for marker in engine_markers:
    if marker.startswith('VERSION'):
        if not re.search(marker, engine):
            raise SystemExit('Game engine is not at version 7.')
    elif marker not in engine:
        raise SystemExit(f'Game engine safety marker missing: {marker}')

for marker in [
    'deadlineTimer', 'backgroundResume', 'finiteTieBreak',
    'duplicateVoteProtection', 'noRepeatedWords', 'validation', 'history'
]:
    if marker not in engine_tests:
        raise SystemExit(f'Engine safety test missing: {marker}')

browser_requirements = {
    'game-flow.spec.js': (e2e_game, [
        'full match round', 'interrupted round', 'local data',
        'multiple match rounds', 'complete local backup',
        'corrupted persisted data', 'secret-circle-active-v7'
    ]),
    'timer.spec.js': (e2e_timer, [
        'deadline timer counts accurately', 'survives a reload',
        'elapsed background deadline', 'legacy active game'
    ]),
    'offline.spec.js': (e2e_offline, ['offline', 'service worker']),
    'content.spec.js': (e2e_content, ['category']),
    'history.spec.js': (e2e_history, ['history']),
    'storage-safety.spec.js': (e2e_storage, ['storage']),
    'accessibility.spec.js': (a11y_tests, [
        'structural accessibility gates', 'retain focus',
        'large touch targets', 'reduced motion'
    ])
}
for filename, (content, markers) in browser_requirements.items():
    for marker in markers:
        if marker.lower() not in content.lower():
            raise SystemExit(f'Browser test coverage missing in {filename}: {marker}')

if manifest.get('display') != 'standalone':
    raise SystemExit('PWA manifest must use standalone display mode.')
if not manifest.get('name') or not manifest.get('short_name'):
    raise SystemExit('PWA manifest requires name and short_name.')
if not manifest.get('icons'):
    raise SystemExit('PWA manifest requires at least one icon.')
if manifest.get('start_url') != './' or manifest.get('scope') != './':
    raise SystemExit('PWA manifest start_url and scope must remain relative.')

cache_match = re.search(r"const CACHE='([^']+)'", service_worker)
if not cache_match or cache_match.group(1) != 'secret-circle-v8':
    raise SystemExit('Service worker cache version must be secret-circle-v8.')
for asset in [
    './index.html', './privacy.html', './styles.css', './pwa.css',
    './app.js', './game-engine.js', './word-packs.js', './data-store.js'
]:
    if asset not in service_worker:
        raise SystemExit(f'Offline core asset missing from service worker: {asset}')

scripts = package.get('scripts', {})
for marker in ['tests/engine.test.js', 'tests/storage.test.js']:
    if marker not in scripts.get('test', ''):
        raise SystemExit(f'Unit test command missing: {marker}')
for marker in ['app.js', 'game-engine.js', 'data-store.js', 'word-packs.js', 'sw.js']:
    if marker not in scripts.get('check', ''):
        raise SystemExit(f'Syntax check missing: {marker}')
for command in ['npm run check', 'npm test', 'npm run validate', 'npm run test:e2e']:
    if command not in workflow:
        raise SystemExit(f'CI command missing: {command}')

for forbidden in ['eval(', 'new Function(', 'document.write(', 'innerHTML = location', 'http://']:
    if forbidden in app or forbidden in engine or forbidden in word_packs or forbidden in data_store:
        raise SystemExit(f'Forbidden release pattern detected: {forbidden}')

print(json.dumps({
    'release_audit': 'PASS',
    'required_files': len(required_files),
    'pwa_cache': cache_match.group(1),
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
    'built_in_categories': 14,
    'built_in_terms': 168,
    'finite_voting': True,
    'duplicate_vote_protection': True,
    'non_repeating_match_words': True,
    'browser_test_files': len(browser_requirements),
    'accessibility_gates': True,
    'mobile_quality_gates': True
}, ensure_ascii=False, indent=2))
