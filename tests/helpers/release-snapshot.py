"""Testserver-Eingabe aus echten Git-Dateien; keine Fixtures mit kopierten Bildserien."""
import base64
import json
from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).resolve().parents[2] / 'scripts'))
import package_release as package

if sys.argv[1:] == ['--current']:
    files, manifest = package.load_worktree()
else:
    files, manifest = package.load_commit(sys.argv[1] if len(sys.argv) == 2 else 'HEAD')
files[package.MANIFEST] = package.manifest_bytes(manifest)
print(json.dumps({'manifest': manifest, 'files': {name: base64.b64encode(data).decode() for name, data in files.items()}}))
