#!/usr/bin/env python3
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
required={
 'index.html':['manifest.webmanifest','game-engine.js','word-packs.js','data-store.js','Content-Security-Policy','Aktive Runde fortsetzen','Eigene Kategorien','App installieren','vote-screen','guess-screen','leaderboard','clear-all-data','export-data','import-data','privacy.html'],
 'privacy.html':['Deine Daten bleiben auf deinem Gerät','keine Analyse-, Werbe- oder Tracking-Dienste','Zurück zum Spiel'],
 'app.js':['SecretCircleContent','SecretCircleStore','serviceWorker','beforeinstallprompt','parseCustomEntries','historyEntry','startVoting','castVote','submitImposterGuess','nextRound','clearAllData','exportBackup','importBackup'],
 'data-store.js':['secret-circle-backup','KEY_VERSION = 7','legacyVersions','loadAll','exportBackup','importBackup','beschädigte lokale Daten','migriert'],
 'word-packs.js':['SecretCircleContent','Anime','Gaming','Internet & Social Media','Elektroniker'],
 'game-engine.js':['VERSION = 6','createGame','restoreGame','advanceReveal','startVoting','castVote','resolveVote','submitImposterGuess','nextRound','leaderboard','normalizeUsedWords','usedWords','Doppelter Spielername','tie_break'],
 'tests/engine.test.js':['deterministic','persistence','validation','voting','scoring','matches','nonRepeatingWords','exhaustedPoolReset'],
 'tests/storage.test.js':['storageMigration','corruptedDataRecovery','backupExportImport','atomicImportRollback'],
 'tests/e2e/game-flow.spec.js':['secret-circle-active-v7','exports and restores a complete local backup','recovers safely from corrupted persisted data'],
 'manifest.webmanifest':['"display": "standalone"','icon.svg','Secret Circle'],
 'sw.js':['cache.addAll','self.clients.claim','secret-circle-v8','pwa.css','privacy.html','word-packs.js','data-store.js'],
 'pwa.css':['.resume','.connection.offline','.result-word','.vote-grid','.leaderboard','.data-controls','.legal-card'],
 'styles.css':['@media(max-width:560px)','card-button'],
 'package.json':['tests/storage.test.js','node --check data-store.js']
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
