#!/usr/bin/env python3
from pathlib import Path
import json
import struct

ROOT = Path(__file__).resolve().parents[1]

required_files = [
    'index.html', 'privacy.html', 'styles.css', 'pwa.css',
    'runtime-guard.js', 'app.js', 'game-engine.js', 'data-store.js',
    'word-packs.js', 'sw.js', 'manifest.webmanifest', 'icon.svg',
    'icon-192.png', 'icon-512.png', 'package.json',
    'playwright.config.js', 'playwright.cross-browser.config.js',
    'tests/engine.test.js', 'tests/storage.test.js',
    'tests/e2e/game-flow.spec.js', 'tests/e2e/setup-limits.spec.js',
    'tests/e2e/timer.spec.js', 'tests/e2e/offline.spec.js',
    'tests/e2e/pwa-install.spec.js', 'tests/e2e/runtime-guard.spec.js',
    'tests/e2e/content.spec.js', 'tests/e2e/history.spec.js',
    'tests/e2e/storage-safety.spec.js', 'tests/e2e/security.spec.js',
    'tests/e2e/accessibility.spec.js', 'tests/cross-browser/smoke.spec.js',
    'scripts/repo_hygiene.py', 'scripts/performance_budget.py',
    'scripts/release_audit.py', '.github/workflows/ci.yml',
    '.github/workflows/cross-browser.yml', 'README.md',
    'RELEASE_CHECKLIST.md', 'CHANGELOG.md', 'KNOWN_LIMITATIONS.md',
    'MANUAL_TEST_PLAN.md', 'CI_TROUBLESHOOTING.md', 'DEPLOYMENT.md'
]
missing = [relative for relative in required_files if not (ROOT / relative).is_file()]
if missing:
    raise SystemExit(f'Missing required files: {", ".join(missing)}')

read = lambda path: (ROOT / path).read_text(encoding='utf-8')
markers = {
    'index.html': [
        'Content-Security-Policy', 'runtime-guard.js', 'apple-touch-icon',
        'Spielregeln und Punkte', 'Version 1.0.0-beta.3', 'clear-all-data',
        'export-data', 'import-data', 'vote-screen', 'guess-screen', 'leaderboard'
    ],
    'privacy.html': [
        'Deine Daten bleiben auf deinem Gerät',
        'Sicherung exportieren und importieren',
        'keine Analyse-, Werbe- oder Tracking-Dienste'
    ],
    'runtime-guard.js': [
        '1.0.0-beta.3', 'unhandledrejection', 'controllerchange',
        'controlledAtStartup', 'SecretCircleRuntime'
    ],
    'app.js': [
        'SecretCircleStore', 'recordRoundHistory', 'E.startTimer',
        'E.pauseTimer', 'E.syncTimer', 'visibilitychange', 'pagehide',
        'exportBackup', 'importBackup', 'clearAllData'
    ],
    'game-engine.js': [
        'VERSION = 7', 'timerRunning', 'timerDeadline', 'startTimer',
        'pauseTimer', 'syncTimer', 'startVoting', 'castVote',
        'resolveVote', 'submitImposterGuess', 'nextRound', 'leaderboard',
        'normalizeUsedWords', 'tie_break'
    ],
    'data-store.js': [
        'KEY_VERSION = 7', 'ENGINE_VERSION = 7', 'upgradeActiveSnapshot',
        'removeLegacyKind', 'IMPORT_PROBE_KEY', 'exportBackup', 'importBackup'
    ],
    'word-packs.js': [
        'SecretCircleContent', 'Anime', 'Gaming',
        'Internet & Social Media', 'Elektroniker'
    ],
    'sw.js': [
        'secret-circle-v10', 'runtime-guard.js', 'fetchAndCache',
        'await cache.put', 'handleNavigation', 'handleAsset',
        'icon-192.png', 'icon-512.png'
    ],
    'manifest.webmanifest': [
        '"id": "./"', '"display": "standalone"',
        'icon-192.png', '192x192', 'icon-512.png', '512x512'
    ],
    'package.json': [
        '"version": "1.0.0-beta.3"', '"node": ">=20"',
        'node --check runtime-guard.js', 'scripts/repo_hygiene.py',
        'scripts/performance_budget.py', 'test:cross-browser'
    ],
    'tests/engine.test.js': [
        'deadlineTimer', 'backgroundResume', 'finiteTieBreak',
        'duplicateVoteProtection', 'noRepeatedWords'
    ],
    'tests/storage.test.js': [
        'realLegacyGameUpgrade', 'currentKeyUpgrade', 'corruptedDataRecovery',
        'legacyBackupImport', 'oversizedBackupProtection', 'atomicImportRollback'
    ],
    'tests/e2e/security.spec.js': [
        'rendered only as text', 'malicious-looking player names',
        'unsafe-inline', 'unsafe-eval'
    ],
    'tests/e2e/runtime-guard.spec.js': [
        'runtime version matches', 'unexpected runtime errors',
        'secret-circle-v10'
    ],
    'tests/e2e/setup-limits.spec.js': [
        'three players and two imposters', 'twenty players and six imposters',
        'more than twenty players', 'below the player count'
    ],
    'tests/e2e/pwa-install.spec.js': [
        'installable mobile metadata', 'createImageBitmap',
        '192x192', '512x512'
    ],
    'tests/e2e/offline.spec.js': [
        'secret-circle-v10', 'runtime-guard.js', 'icon-192.png', 'icon-512.png'
    ],
    'tests/e2e/accessibility.spec.js': [
        'rules and scoring guide is keyboard accessible',
        'large touch targets', 'reduced motion'
    ],
    'tests/cross-browser/smoke.spec.js': [
        'loads setup, content and privacy', 'starts a three-player game',
        'persists and restores an interrupted game'
    ],
    'playwright.cross-browser.config.js': [
        'Desktop Chrome', 'Desktop Firefox', 'Desktop Safari',
        'Pixel 7', 'iPhone 13'
    ],
    '.github/workflows/ci.yml': [
        'npm run check', 'npm test', 'npm run validate', 'npm run test:e2e'
    ],
    '.github/workflows/cross-browser.yml': [
        'workflow_dispatch', 'chromium firefox webkit', 'test:cross-browser'
    ],
    'scripts/repo_hygiene.py': ['git', 'ls-files', 'node_modules', 'environment_files_tracked'],
    'scripts/performance_budget.py': ['core_budget', '500_000', 'performance_budget'],
    'CHANGELOG.md': ['1.0.0-beta.3', 'deadline-basierter Timer', 'Sicherheit und Datenschutz'],
    'KNOWN_LIMITATIONS.md': ['lokales Pass-and-Play-Spiel', 'iPhone', 'GitHub Actions'],
    'MANUAL_TEST_PLAN.md': ['Grundlegender Smoke-Test', 'PWA und Offline', 'Realer Partytest'],
    'CI_TROUBLESHOOTING.md': ['Fehler vor dem ersten Schritt', 'Actions-Berechtigungen', 'Abrechnung und Nutzungslimits'],
    'DEPLOYMENT.md': ['GitHub Pages', 'HTTPS', 'Rollback', 'secret-circle-v10']
}

for relative, expected in markers.items():
    text = read(relative)
    if len(text) < 100:
        raise SystemExit(f'Unexpectedly small text file: {relative}')
    for marker in expected:
        if marker.lower() not in text.lower():
            raise SystemExit(f'Missing marker {marker} in {relative}')

manifest = json.loads(read('manifest.webmanifest'))
if manifest.get('id') != './' or manifest.get('start_url') != './' or manifest.get('scope') != './':
    raise SystemExit('Manifest id, start_url and scope must be relative and stable.')
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

print('Secret Circle offline PWA structure valid.')
