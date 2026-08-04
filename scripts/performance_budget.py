#!/usr/bin/env python3
from pathlib import Path
import json
import subprocess

ROOT = Path(__file__).resolve().parents[1]

budgets = {
    'index.html': 52_000,
    'privacy.html': 20_000,
    'runtime-guard.js': 8_000,
    'setup-ux.js': 10_000,
    'privacy-guard.js': 8_000,
    'app.js': 75_000,
    'game-engine.js': 55_000,
    'data-store.js': 50_000,
    'word-packs.js': 35_000,
    'styles.css': 30_000,
    'pwa.css': 35_000,
    'sw.js': 12_000,
    'manifest.webmanifest': 5_000,
    'icon.svg': 20_000,
    'icon-192.png': 80_000,
    'icon-512.png': 200_000
}

sizes = {}
violations = []
for relative, maximum in budgets.items():
    path = ROOT / relative
    if not path.is_file():
        violations.append(f'Missing budgeted asset: {relative}')
        continue
    size = path.stat().st_size
    sizes[relative] = size
    if size > maximum:
        violations.append(f'{relative} is {size} bytes; budget is {maximum} bytes.')

core_total = sum(sizes.values())
core_budget = 570_000
if core_total > core_budget:
    violations.append(f'Offline core is {core_total} bytes; budget is {core_budget} bytes.')

tracked_result = subprocess.run(['git', 'ls-files', '-z'], cwd=ROOT, capture_output=True)
if tracked_result.returncode != 0:
    violations.append('Unable to inspect tracked repository files with git ls-files.')
    tracked = []
else:
    tracked = [entry.decode('utf-8') for entry in tracked_result.stdout.split(b'\0') if entry]

for relative in tracked:
    path = ROOT / relative
    if not path.is_file():
        continue
    suffix = path.suffix.lower()
    if suffix in {'.map', '.log', '.tmp'}:
        violations.append(f'Generated or diagnostic file committed: {relative}')
    if path.stat().st_size > 2_000_000 and relative not in sizes:
        violations.append(f'Unexpected tracked file larger than 2 MB: {relative}')

if violations:
    raise SystemExit('\n'.join(sorted(set(violations))))

print(json.dumps({
    'performance_budget': 'PASS',
    'core_total_bytes': core_total,
    'core_budget_bytes': core_budget,
    'core_budget_used_percent': round(core_total / core_budget * 100, 2),
    'tracked_files_checked': len(tracked),
    'asset_sizes': sizes
}, ensure_ascii=False, indent=2))
