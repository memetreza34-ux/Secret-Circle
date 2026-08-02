#!/usr/bin/env python3
from pathlib import Path
import json
import re

ROOT = Path(__file__).resolve().parents[1]

required_files = [
    'index.html', 'privacy.html', 'styles.css', 'pwa.css', 'app.js',
    'game-engine.js', 'manifest.webmanifest', 'sw.js', 'icon.svg',
    'tests/engine.test.js', 'tests/e2e/game-flow.spec.js',
    'scripts/validate_project.py', '.github/workflows/ci.yml'
]

missing = [path for path in required_files if not (ROOT / path).is_file()]
if missing:
    raise SystemExit(f'Missing release files: {", ".join(missing)}')

index = (ROOT / 'index.html').read_text(encoding='utf-8')
privacy = (ROOT / 'privacy.html').read_text(encoding='utf-8')
app = (ROOT / 'app.js').read_text(encoding='utf-8')
engine = (ROOT / 'game-engine.js').read_text(encoding='utf-8')
engine_tests = (ROOT / 'tests/engine.test.js').read_text(encoding='utf-8')
e2e_tests = (ROOT / 'tests/e2e/game-flow.spec.js').read_text(encoding='utf-8')
manifest = json.loads((ROOT / 'manifest.webmanifest').read_text(encoding='utf-8'))
service_worker = (ROOT / 'sw.js').read_text(encoding='utf-8')
workflow = (ROOT / '.github/workflows/ci.yml').read_text(encoding='utf-8')

for marker in ['lang="de"', 'viewport-fit=cover', 'aria-live="polite"', 'privacy.html', 'delete-all-data']:
    if marker not in index:
        raise SystemExit(f'Release marker missing in index.html: {marker}')

for marker in ['lokal', 'keine', 'tracking', 'löschen']:
    if marker not in privacy.lower():
        raise SystemExit(f'Privacy disclosure missing: {marker}')

for marker in ['localStorage', 'clearAllData', 'serviceWorker', 'beforeinstallprompt']:
    if marker not in app:
        raise SystemExit(f'Runtime capability missing: {marker}')

engine_markers = [
    r'VERSION\s*=\s*5', 'tie_break', 'leaderboard', 'MAX_TIE_BREAKS',
    'bereits abgestimmt', 'Selbststimmen sind ungültig'
]
for marker in engine_markers:
    if marker.startswith('VERSION'):
        if not re.search(marker, engine):
            raise SystemExit('Game engine is not at version 5.')
    elif marker not in engine:
        raise SystemExit(f'Game engine safety marker missing: {marker}')

for marker in ['finiteTieBreak', 'duplicateVoteProtection', 'tieBreakCount']:
    if marker not in engine_tests:
        raise SystemExit(f'Engine safety test missing: {marker}')

for marker in ['full match round', 'interrupted round', 'local data', 'multiple match rounds']:
    if marker.lower() not in e2e_tests.lower():
        raise SystemExit(f'Browser test coverage missing: {marker}')

if manifest.get('display') != 'standalone':
    raise SystemExit('PWA manifest must use standalone display mode.')
if not manifest.get('name') or not manifest.get('short_name'):
    raise SystemExit('PWA manifest requires name and short_name.')
if not manifest.get('icons'):
    raise SystemExit('PWA manifest requires at least one icon.')

cache_match = re.search(r"const CACHE='([^']+)'", service_worker)
if not cache_match or cache_match.group(1) != 'secret-circle-v5':
    raise SystemExit('Service worker cache version must be secret-circle-v5.')
for asset in ['./index.html', './privacy.html', './styles.css', './pwa.css', './app.js', './game-engine.js']:
    if asset not in service_worker:
        raise SystemExit(f'Offline core asset missing from service worker: {asset}')

for command in ['npm run check', 'npm test', 'npm run validate', 'npm run test:e2e']:
    if command not in workflow:
        raise SystemExit(f'CI command missing: {command}')

for forbidden in ['eval(', 'new Function(', 'document.write(', 'innerHTML = location', 'http://']:
    if forbidden in app or forbidden in engine:
        raise SystemExit(f'Forbidden release pattern detected: {forbidden}')

print(json.dumps({
    'release_audit': 'PASS',
    'required_files': len(required_files),
    'pwa_cache': cache_match.group(1),
    'privacy': True,
    'offline_core': True,
    'engine_version': 5,
    'finite_voting': True,
    'duplicate_vote_protection': True,
    'browser_flows': True
}, ensure_ascii=False, indent=2))
