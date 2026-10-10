#!/usr/bin/env python3
"""Offline-Core-Sperre: Jede Änderung an einer Offline-Core-Datei braucht eine neue Cachegeneration.

Der Service Worker liefert Skripte und Styles aus dem Cache. Bleibt der Cachename gleich,
erkennt der Browser keine neue Version, und installierte Apps behalten die alten Dateien,
während das HTML frisch vom Server kommt. Diese Prüfung hält deshalb eine Prüfsumme über
alle Dateien aus CORE in release-meta.json fest und schlägt fehl, sobald sie nicht mehr passt.

  python3 scripts/offline_core_lock.py          prüfen (Teil von npm run validate)
  python3 scripts/offline_core_lock.py --bump   Cachegeneration erhöhen und Prüfsumme neu festhalten
"""
from datetime import date
from pathlib import Path
import hashlib
import json
import re
import sys

ROOT = Path(__file__).resolve().parents[1]
CACHE_PATTERN = re.compile(r"const CACHE='secret-circle-v(\d+)'")
STAGING_PATTERN = re.compile(r"const STAGING_CACHE='secret-circle-v(\d+)-staging'")
CACHE_NAME = re.compile(r'secret-circle-v\d+(?:-staging)?')
# Historische Einträge bleiben stehen; alle anderen Dokumente nennen den aktuellen Stand.
HISTORY_DOCS = {'CHANGELOG.md'}


def read(relative):
    return (ROOT / relative).read_text(encoding='utf-8')


def core_paths(sw):
    match = re.search(r'const CORE=\[(.*?)\];', sw, re.S)
    if not match:
        raise SystemExit('sw.js: CORE-Liste nicht gefunden.')
    paths = re.findall(r"'\./([^']*)'", match.group(1))
    return [path for path in paths if path]


def core_hash(sw):
    digest = hashlib.sha256()
    for relative in core_paths(sw):
        path = ROOT / relative
        if not path.is_file():
            raise SystemExit(f'Offline-Core-Datei fehlt: {relative}')
        content = path.read_bytes()
        # Der Cachename selbst steht in Seiten wie privacy.html. Er gehört zur Generation,
        # nicht zum Inhalt; sonst würde jede Erhöhung die Prüfsumme sofort wieder verändern.
        if relative.endswith(('.html', '.js', '.css', '.webmanifest', '.svg')):
            text = content.decode('utf-8').replace('\r\n', '\n')
            content = CACHE_NAME.sub('secret-circle-vX', text).encode('utf-8')
        digest.update(relative.encode('utf-8') + b'\0' + hashlib.sha256(content).digest())
    return digest.hexdigest()


def generation(sw):
    cache = CACHE_PATTERN.search(sw)
    staging = STAGING_PATTERN.search(sw)
    if not cache or not staging or cache.group(1) != staging.group(1):
        raise SystemExit('sw.js: CACHE und STAGING_CACHE fehlen oder passen nicht zusammen.')
    return int(cache.group(1))


def write_json(relative, value):
    (ROOT / relative).write_text(json.dumps(value, indent=2, ensure_ascii=False) + '\n', encoding='utf-8')


def bump():
    sw = read('sw.js')
    old = generation(sw)
    new = old + 1
    old_names = (f'secret-circle-v{old}-staging', f'secret-circle-v{old}')
    new_names = (f'secret-circle-v{new}-staging', f'secret-circle-v{new}')

    sw = sw.replace(f"const CACHE='secret-circle-v{old}'", f"const CACHE='secret-circle-v{new}'")
    sw = sw.replace(f"const STAGING_CACHE='secret-circle-v{old}-staging'", f"const STAGING_CACHE='secret-circle-v{new}-staging'")
    (ROOT / 'sw.js').write_text(sw, encoding='utf-8')

    meta = json.loads(read('release-meta.json'))
    meta['updatedAt'] = date.today().isoformat()
    meta['sourceGeneration'] = f'v{new}'
    meta['offlineCache']['production'] = new_names[1]
    meta['offlineCache']['staging'] = new_names[0]
    meta['offlineCache']['coreHash'] = core_hash(sw)
    write_json('release-meta.json', meta)

    operator = json.loads(read('operator-release.json'))
    context = operator['releaseContext']
    context['sourceGeneration'] = f'v{new}'
    context['expectedCache'] = new_names[1]
    context['expectedStagingCache'] = new_names[0]
    write_json('operator-release.json', operator)

    touched = []
    for path in sorted([*ROOT.glob('*.md'), ROOT / 'privacy.html']):
        if path.name in HISTORY_DOCS:
            continue
        text = path.read_text(encoding='utf-8')
        updated = text
        for old_name, new_name in zip(old_names, new_names):
            updated = re.sub(re.escape(old_name) + r'(?![\w-])', new_name, updated)
        if updated != text:
            path.write_text(updated, encoding='utf-8')
            touched.append(path.name)

    print(json.dumps({
        'offline_core_bump': f'v{old} -> v{new}',
        'updated_files': ['sw.js', 'release-meta.json', 'operator-release.json', *touched],
        'next_step': 'CHANGELOG.md um einen Eintrag für die neue Generation ergänzen.'
    }, indent=2, ensure_ascii=False))


def check():
    sw = read('sw.js')
    current = generation(sw)
    meta = json.loads(read('release-meta.json'))
    recorded = meta.get('offlineCache', {}).get('coreHash')
    problems = []
    if meta.get('offlineCache', {}).get('production') != f'secret-circle-v{current}':
        problems.append('release-meta.json nennt eine andere Cachegeneration als sw.js.')
    actual_core_hash = core_hash(sw)
    if recorded != actual_core_hash:
        problems.append(
            'Offline-Core-Dateien haben sich geändert, die Cachegeneration aber nicht. '
            'Installierte Apps würden die Änderung nie bekommen. '
            'Ausführen: python3 scripts/offline_core_lock.py --bump'
        )
    if problems:
        raise SystemExit('\n'.join(problems))
    print(json.dumps({
        'offline_core_lock': 'PASS',
        'cache_generation': f'v{current}',
        'core_files': len(core_paths(sw)),
    }, indent=2))


if __name__ == '__main__':
    if sys.argv[1:] == ['--bump']:
        bump()
    elif not sys.argv[1:]:
        check()
    else:
        raise SystemExit('Aufruf: python3 scripts/offline_core_lock.py [--bump]')
