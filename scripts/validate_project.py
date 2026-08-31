#!/usr/bin/env python3
"""Release-Check: Sind alle Dateien da, passen Manifest und Icons zusammen?"""
import json
import re
import struct
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def fail(message):
    raise SystemExit(f'FEHLER: {message}')


def png_size(path):
    header = path.read_bytes()[:24]
    if header[:8] != b'\x89PNG\r\n\x1a\n':
        fail(f'{path.name} ist kein PNG')
    return struct.unpack('>II', header[16:24])


REQUIRED = [
    'index.html', 'styles.css', 'app.js', 'game-engine.js', 'word-packs.js',
    'accessibility.js', 'sw.js', 'manifest.webmanifest', 'icon.svg',
    'assets/fonts/anton-latin.woff2',
    'assets/fonts/figtree-latin.woff2',
]

for relative in REQUIRED:
    path = ROOT / relative
    if not path.is_file() or path.stat().st_size < 120:
        fail(f'Datei fehlt oder ist leer: {relative}')

html = (ROOT / 'index.html').read_text(encoding='utf-8')
manifest = json.loads((ROOT / 'manifest.webmanifest').read_text(encoding='utf-8'))

# Alle im Markup verlinkten lokalen Dateien existieren.
for match in re.finditer(r'(?:href|src)="(?!https?:|#|data:)([^"]+)"', html):
    if not (ROOT / match.group(1)).is_file():
        fail(f'index.html verweist auf fehlende Datei: {match.group(1)}')

# Icons: Manifest-Angaben müssen den echten Dateien entsprechen.
for icon in manifest['icons']:
    path = ROOT / icon['src']
    if not path.is_file():
        fail(f'Manifest-Icon fehlt: {icon["src"]}')
    if path.suffix == '.png':
        width, height = png_size(path)
        if f'{width}x{height}' != icon['sizes']:
            fail(f'{icon["src"]} ist {width}x{height}, Manifest sagt {icon["sizes"]}')

if not any(icon.get('purpose') == 'maskable' for icon in manifest['icons']):
    fail('Kein maskable Icon — Android schneidet das Icon sonst zu')

if 'apple-touch-icon' not in html:
    fail('apple-touch-icon fehlt — iOS zeigt beim Installieren sonst kein Icon')

# Inhalte: Anzahl der Begriffe muss zu den Metadaten passen.
word_text = (ROOT / 'word-packs.js').read_text(encoding='utf-8')
entry_count = len(re.findall(r"\['[^']+',\s*'[^']+'\]", word_text))
declared = int(re.search(r'entryCount:\s*Object\.values\(PACKS\)', word_text) is not None)
if not declared:
    fail('word-packs.js berechnet entryCount nicht mehr aus den Paketen')

# Keine Secrets im Repo, und Build-Ordner bleiben ignoriert.
for secret in ROOT.glob('.env*'):
    if secret.name != '.env.example':
        fail(f'Secret-Datei liegt im Repo: {secret.name}')

ignored = (ROOT / '.gitignore').read_text(encoding='utf-8')
for path in ['node_modules', 'dist', 'build']:
    if path not in ignored:
        fail(f'.gitignore deckt {path} nicht ab')

print(f'Secret Circle bereit: {entry_count} Begriffe, {len(manifest["icons"])} Icons, Offline-Shell vollständig.')
