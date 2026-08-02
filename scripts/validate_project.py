#!/usr/bin/env python3
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
required={
 'index.html':['manifest.webmanifest','game-engine.js','Aktive Runde fortsetzen','Eigene Kategorien','App installieren'],
 'app.js':['secret-circle-active-v2','serviceWorker','beforeinstallprompt','parseCustomEntries','historyEntry'],
 'game-engine.js':['createGame','restoreGame','advanceReveal','completeGame','Doppelter Spielername'],
 'tests/engine.test.js':['deterministic','persistence','validation'],
 'manifest.webmanifest':['"display": "standalone"','icon.svg','Secret Circle'],
 'sw.js':['cache.addAll','self.clients.claim','secret-circle-v2'],
 'pwa.css':['.resume','.connection.offline','.result-word'],
 'styles.css':['@media(max-width:560px)','card-button']
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
