#!/usr/bin/env python3
"""Stellt die echten Offline-Dateien zweier Altstände und des aktuellen HEAD bereit."""
import io
import json
import os
from pathlib import Path
import re
import subprocess
import tarfile

ROOT = Path(__file__).resolve().parents[2]
OUTPUT = ROOT / '.cache' / 'pwa-upgrade'
GIT = os.environ.get('SC_UPGRADE_GIT', 'git')
SOURCES = ['a8bd77711f2e9e93eef4ab58b9566b5a3fcd7d5d',
           '4b7ba1b47bcccb9cd33723911029651fe7bba499']


def git(*args):
    return subprocess.check_output([GIT, *args], cwd=ROOT)


def prepare():
    target = git('rev-parse', 'HEAD').decode().strip()
    records = []
    for sha in [*SOURCES, target]:
        sw = git('show', sha + ':sw.js').decode()
        cache = re.search(r"const CACHE='([^']+)'", sw).group(1)
        core = re.findall(r"'\./([^']*)'", re.search(r'const CORE=\[(.*?)\];', sw, re.S).group(1))
        files = sorted(set(p for p in core if p) | {'sw.js', 'index.html'})
        folder = OUTPUT / sha
        folder.mkdir(parents=True, exist_ok=True)
        archive = git('archive', sha, '--', *files)
        with tarfile.open(fileobj=io.BytesIO(archive)) as source:
            for member in source:
                if not member.isfile():
                    continue
                destination = folder / member.name
                if not destination.resolve().is_relative_to(folder.resolve()):
                    raise ValueError('Unzulässiger Archivpfad: ' + member.name)
                destination.parent.mkdir(parents=True, exist_ok=True)
                destination.write_bytes(source.extractfile(member).read())
        records.append({'sha': sha, 'cache': cache, 'root': str(folder), 'core': core,
                        'role': 'target' if sha == target else 'baseline'})
        print(cache, sha, len(core), 'Offline-Ressourcen')
    (OUTPUT / 'releases.json').write_text(json.dumps(records, indent=2), encoding='utf-8')


if __name__ == '__main__':
    try:
        prepare()
    except subprocess.CalledProcessError as error:
        raise SystemExit('Git-Export fehlgeschlagen. Vollständige Quellhistorie der beiden Altstände ist erforderlich.') from error
