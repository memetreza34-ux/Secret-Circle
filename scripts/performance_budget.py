#!/usr/bin/env python3
from pathlib import Path
import json

ROOT = Path(__file__).resolve().parents[1]

budgets = {
    'index.html': 40_000,
    'privacy.html': 20_000,
    'runtime-guard.js': 8_000,
    'app.js': 70_000,
    'game-engine.js': 50_000,
    'data-store.js': 45_000,
    'word-packs.js': 35_000,
    'styles.css': 25_000,
    'pwa.css': 30_000,
    'sw.js': 10_000,
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
core_budget = 500_000
if core_total > core_budget:
    violations.append(f'Offline core is {core_total} bytes; budget is {core_budget} bytes.')

for path in ROOT.rglob('*'):
    if not path.is_file() or '.git' in path.parts:
        continue
    relative = path.relative_to(ROOT).as_posix()
    if path.suffix in {'.map', '.log', '.tmp'}:
        violations.append(f'Generated or diagnostic file committed: {relative}')
    if path.stat().st_size > 2_000_000 and relative not in sizes:
        violations.append(f'Unexpected file larger than 2 MB: {relative}')

if violations:
    raise SystemExit('\n'.join(violations))

print(json.dumps({
    'performance_budget': 'PASS',
    'core_total_bytes': core_total,
    'core_budget_bytes': core_budget,
    'core_budget_used_percent': round(core_total / core_budget * 100, 2),
    'asset_sizes': sizes
}, ensure_ascii=False, indent=2))
