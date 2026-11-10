"""Nur fehlende, fest gepinnte Git-Quellen für die PWA-Upgradeprüfungen holen."""
import json
from pathlib import Path
import re
import subprocess

ROOT = Path(__file__).resolve().parents[1]
baselines = json.loads((ROOT / 'tests/fixtures/pwa-baselines.json').read_text(encoding='utf-8'))
for baseline in baselines:
    ref = baseline['ref']
    if not isinstance(ref, str) or not re.fullmatch(r'[0-9a-f]{40}', ref):
        raise SystemExit('Upgrade-Baselines benötigen vollständige, feste Commit-SHAs.')
    present = subprocess.run(['git', 'cat-file', '-e', ref + '^{commit}'], cwd=ROOT, capture_output=True)
    if present.returncode:
        subprocess.run(['git', 'fetch', '--no-tags', '--depth=1', 'origin', ref], cwd=ROOT, check=True)
    print(baseline['label'], ref, 'verfügbar')
