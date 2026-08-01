#!/usr/bin/env python3
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
required={
 'index.html':['Spiel starten','Geheime Karte anzeigen','Rollen auflösen'],
 'app.js':['const WORDS','imposters','toggleTimer','escapeHtml'],
 'styles.css':['@media(max-width:560px)','card-button']
}
for rel,markers in required.items():
 p=ROOT/rel
 if not p.is_file() or p.stat().st_size<400: raise SystemExit(f'Missing or small file: {rel}')
 text=p.read_text(encoding='utf-8')
 for marker in markers:
  if marker not in text: raise SystemExit(f'Missing marker {marker} in {rel}')
print('Secret Circle standalone MVP valid.')
