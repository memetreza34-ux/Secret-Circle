#!/usr/bin/env python3
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
required={
 'index.html':['manifest.webmanifest','game-engine.js','word-packs.js','data-store.js','Content-Security-Policy','Aktive Runde fortsetzen','Eigene Kategorien','App installieren','vote-screen','guess-screen','leaderboard','clear-all-data','export-data','import-data','privacy.html'],
 'privacy.html':['Deine Daten bleiben auf deinem Gerät','keine Analyse-, Werbe- oder Tracking-Dienste','Zurück zum Spiel'],
 'app.js':['SecretCircleContent','SecretCircleStore','serviceWorker','beforeinstallprompt','parseCustomEntries','historyEntry','startVoting','castVote','submitImposterGuess','nextRound','clearAllData','exportBackup','importBackup','startTimer','pauseTimer','syncTimer','recordRoundHistory','visibilitychange'],
 'data-store.js':['secret-circle-backup','KEY_VERSION = 7','ENGINE_VERSION = 7','legacyVersions','upgradeActiveSnapshot','removeLegacyKind','loadAll','exportBackup','importBackup','beschädigte lokale Daten','neue App-Version'],
 'word-packs.js':['SecretCircleContent','Anime','Gaming','Internet & Social Media','Elektroniker'],
 'game-engine.js':['VERSION = 7','createGame','restoreGame','advanceReveal','startTimer','pauseTimer','syncTimer','startVoting','castVote','resolveVote','submitImposterGuess','nextRound','leaderboard','normalizeUsedWords','usedWords','timerDeadline','Doppelter Spielername','tie_break'],
 'tests/engine.test.js':['deterministic','persistence','validation','voting','scoring','matches','nonRepeatingWords','exhaustedPoolReset','deadlineTimer'],
 'tests/storage.test.js':['storageMigration','realLegacyGameUpgrade','corruptedDataRecovery','backupExportImport','legacyBackupImport','atomicImportRollback'],
 'tests/e2e/game-flow.spec.js':['secret-circle-active-v7','exports and restores a complete local backup','recovers safely from corrupted persisted data'],
 'tests/e2e/timer.spec.js':['deadline timer counts accurately','survives a reload','legacy active game and settings migrate'],
 'tests/e2e/offline.spec.js':['offline'],
 'tests/e2e/content.spec.js':['category'],
 'tests/e2e/history.spec.js':['history'],
 'tests/e2e/storage-safety.spec.js':['storage'],
 'tests/e2e/accessibility.spec.js':['structural accessibility gates','retain focus','large touch targets','reduced motion'],
 'manifest.webmanifest':['"display": "standalone"','icon.svg','Secret Circle'],
 'sw.js':['cache.addAll','self.clients.claim','secret-circle-v8','pwa.css','privacy.html','word-packs.js','data-store.js'],
 'pwa.css':['.resume','.connection.offline','.result-word','.vote-grid','.leaderboard','.data-controls','.legal-card'],
 'styles.css':['@media(max-width:560px)','card-button','touch-action:manipulation'],
 'package.json':['tests/storage.test.js','node --check data-store.js','playwright test']
}
for relative,markers in required.items():
 path=ROOT/relative
 if not path.is_file() or path.stat().st_size<200:raise SystemExit(f'Missing or small file: {relative}')
 text=path.read_text(encoding='utf-8')
 for marker in markers:
  if marker.lower() not in text.lower():raise SystemExit(f'Missing marker {marker} in {relative}')
for forbidden in ['.env','node_modules','dist','build']:
 if (ROOT/forbidden).exists():raise SystemExit(f'Forbidden generated path committed: {forbidden}')
print('Secret Circle offline PWA structure valid.')
