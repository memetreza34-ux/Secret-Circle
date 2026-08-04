#!/usr/bin/env python3
from pathlib import Path
import json
import struct

ROOT = Path(__file__).resolve().parents[1]

required_text = {
    'index.html': [
        'manifest.webmanifest', 'game-engine.js', 'word-packs.js', 'data-store.js',
        'Content-Security-Policy', 'apple-mobile-web-app-capable', 'apple-touch-icon',
        'icon-192.png', 'Aktive Runde fortsetzen', 'Eigene Kategorien',
        'App installieren', 'vote-screen', 'guess-screen', 'leaderboard',
        'clear-all-data', 'export-data', 'import-data', 'privacy.html'
    ],
    'privacy.html': [
        'Deine Daten bleiben auf deinem Gerät',
        'keine Analyse-, Werbe- oder Tracking-Dienste',
        'Sicherung exportieren und importieren', 'Zurück zum Spiel'
    ],
    'app.js': [
        'SecretCircleContent', 'SecretCircleStore', 'serviceWorker',
        'beforeinstallprompt', 'parseCustomEntries', 'historyEntry',
        'startVoting', 'castVote', 'submitImposterGuess', 'nextRound',
        'clearAllData', 'exportBackup', 'importBackup', 'startTimer',
        'pauseTimer', 'syncTimer', 'recordRoundHistory', 'visibilitychange'
    ],
    'data-store.js': [
        'secret-circle-backup', 'KEY_VERSION = 7', 'ENGINE_VERSION = 7',
        'legacyVersions', 'upgradeActiveSnapshot', 'removeLegacyKind',
        'loadAll', 'exportBackup', 'importBackup',
        'beschädigte lokale Daten', 'neue App-Version'
    ],
    'word-packs.js': [
        'SecretCircleContent', 'Anime', 'Gaming',
        'Internet & Social Media', 'Elektroniker'
    ],
    'game-engine.js': [
        'VERSION = 7', 'createGame', 'restoreGame', 'advanceReveal',
        'startTimer', 'pauseTimer', 'syncTimer', 'startVoting',
        'castVote', 'resolveVote', 'submitImposterGuess', 'nextRound',
        'leaderboard', 'normalizeUsedWords', 'usedWords', 'timerDeadline',
        'Doppelter Spielername', 'tie_break'
    ],
    'tests/engine.test.js': [
        'deterministic', 'persistence', 'deadlineTimer', 'backgroundResume',
        'voting', 'finiteTieBreak', 'duplicateVoteProtection', 'scoring',
        'matches', 'noRepeatedWords', 'validation', 'history'
    ],
    'tests/storage.test.js': [
        'storageMigration', 'realLegacyGameUpgrade', 'currentKeyUpgrade',
        'corruptedDataRecovery', 'backupExportImport', 'legacyBackupImport',
        'oversizedBackupProtection', 'atomicImportRollback'
    ],
    'tests/e2e/game-flow.spec.js': [
        'secret-circle-active-v7', 'exports and restores a complete local backup',
        'recovers safely from corrupted persisted data'
    ],
    'tests/e2e/timer.spec.js': [
        'deadline timer counts accurately', 'survives a reload',
        'legacy active game and settings migrate'
    ],
    'tests/e2e/offline.spec.js': [
        'secret-circle-v9', 'icon-192.png', 'icon-512.png', 'offline'
    ],
    'tests/e2e/pwa-install.spec.js': [
        'installable mobile metadata', 'createImageBitmap',
        '192x192', '512x512', 'apple-mobile-web-app-capable'
    ],
    'tests/e2e/content.spec.js': ['category'],
    'tests/e2e/history.spec.js': ['history'],
    'tests/e2e/storage-safety.spec.js': ['storage'],
    'tests/e2e/accessibility.spec.js': [
        'structural accessibility gates', 'retain focus',
        'large touch targets', 'reduced motion'
    ],
    'manifest.webmanifest': [
        '"id": "./"', '"display": "standalone"',
        'icon-192.png', '192x192', 'icon-512.png', '512x512',
        'icon.svg', 'Secret Circle'
    ],
    'sw.js': [
        'cache.addAll', 'event.waitUntil', 'self.clients.claim',
        'secret-circle-v9', 'pwa.css', 'privacy.html', 'word-packs.js',
        'data-store.js', 'icon-192.png', 'icon-512.png'
    ],
    'pwa.css': [
        '.resume', '.connection.offline', '.result-word', '.vote-grid',
        '.leaderboard', '.data-controls', '.legal-card'
    ],
    'styles.css': [
        '@media(max-width:560px)', 'card-button', 'touch-action:manipulation'
    ],
    'package.json': [
        'tests/storage.test.js', 'node --check data-store.js', 'playwright test'
    ]
}

for relative, markers in required_text.items():
    path = ROOT / relative
    if not path.is_file() or path.stat().st_size < 200:
        raise SystemExit(f'Missing or small file: {relative}')
    text = path.read_text(encoding='utf-8')
    for marker in markers:
        if marker.lower() not in text.lower():
            raise SystemExit(f'Missing marker {marker} in {relative}')

manifest = json.loads((ROOT / 'manifest.webmanifest').read_text(encoding='utf-8'))
if manifest.get('id') != './' or manifest.get('start_url') != './' or manifest.get('scope') != './':
    raise SystemExit('Manifest id, start_url and scope must be relative and stable.')
if manifest.get('display') != 'standalone':
    raise SystemExit('Manifest display must be standalone.')
icons = manifest.get('icons') or []
icon_by_size = {icon.get('sizes'): icon for icon in icons}
for size, source in [('192x192', 'icon-192.png'), ('512x512', 'icon-512.png')]:
    icon = icon_by_size.get(size)
    if not icon or icon.get('src') != source or icon.get('type') != 'image/png':
        raise SystemExit(f'Manifest PNG icon missing or invalid: {size}')

for relative, expected_size in [('icon-192.png', 192), ('icon-512.png', 512)]:
    path = ROOT / relative
    if not path.is_file() or path.stat().st_size < 1000:
        raise SystemExit(f'Missing or suspicious PNG icon: {relative}')
    data = path.read_bytes()
    if data[:8] != b'\x89PNG\r\n\x1a\n' or data[12:16] != b'IHDR':
        raise SystemExit(f'Invalid PNG signature: {relative}')
    width, height = struct.unpack('>II', data[16:24])
    if (width, height) != (expected_size, expected_size):
        raise SystemExit(f'Unexpected PNG dimensions for {relative}: {width}x{height}')

for forbidden in ['.env', 'node_modules', 'dist', 'build']:
    if (ROOT / forbidden).exists():
        raise SystemExit(f'Forbidden generated path committed: {forbidden}')

print('Secret Circle offline PWA structure valid.')
