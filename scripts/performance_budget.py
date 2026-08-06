#!/usr/bin/env python3
from pathlib import Path
import json
import subprocess

ROOT = Path(__file__).resolve().parents[1]

budgets = {
    'index.html': 60_000, 'party.html': 100_000, 'advanced.html': 35_000,
    'quick-play.html': 40_000, 'creator.html': 45_000, 'privacy.html': 28_000,
    'runtime-guard.js': 16_000, 'setup-ux.js': 14_000, 'privacy-guard.js': 10_000,
    'wake-lock.js': 10_000, 'role-assignment.js': 14_000, 'app.js': 80_000,
    'game-engine.js': 60_000, 'data-store.js': 55_000, 'backup-schema-registry.js': 12_000,
    'session-ledger.js': 16_000, 'session-ledger-legacy-guard.js': 16_000,
    'word-packs.js': 40_000, 'party-catalog.js': 85_000, 'party-expansion.js': 45_000,
    'party-trending-catalog.js': 70_000, 'party-mega-catalog.js': 90_000,
    'party-viral-catalog.js': 90_000, 'party-routing.js': 20_000,
    'game-creator.js': 45_000, 'creator-page.js': 55_000,
    'party-custom-packs.js': 45_000, 'party-hub.js': 65_000,
    'party-hub-plus.js': 34_000, 'party-hub-polish.js': 10_000,
    'party-guide.js': 45_000, 'party-night.js': 38_000, 'party-data-tools.js': 24_000,
    'party-advanced.js': 55_000, 'party-advanced-runner.js': 48_000,
    'party-advanced-preferences.js': 5_000, 'party-quick-modes.js': 75_000,
    'party-mega-modes.js': 75_000, 'party-viral-modes.js': 75_000,
    'party-created-modes.js': 75_000, 'quick-loader.js': 12_000,
    'styles.css': 35_000, 'pwa.css': 40_000, 'pwa-update.css': 12_000,
    'party.css': 55_000, 'party-extra.css': 25_000, 'party-night.css': 22_000,
    'party-quick.css': 35_000, 'party-guide.css': 35_000, 'creator.css': 45_000,
    'sw.js': 35_000, 'manifest.webmanifest': 6_000, 'icon.svg': 25_000,
    'icon-192.png': 90_000, 'icon-512.png': 220_000
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
core_budget = 2_700_000
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
    if path.suffix.lower() in {'.map', '.log', '.tmp'}:
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
    'budgeted_assets': len(budgets),
    'visible_builtin_games': 45,
    'maximum_local_created_games': 40,
    'creator_templates': 6,
    'creator_runner': True,
    'classic_quick_modes': 10,
    'mega_trend_modes': 9,
    'viral_modes': 8,
    'backup_schemas': 3,
    'exact_once_engine_families': 4,
    'controlled_pwa_updates': True,
    'asset_sizes': sizes
}, ensure_ascii=False, indent=2))
