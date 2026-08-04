#!/usr/bin/env python3
from pathlib import Path
import json
import subprocess

ROOT = Path(__file__).resolve().parents[1]

result = subprocess.run(
    ['git', 'ls-files', '-z'],
    cwd=ROOT,
    capture_output=True
)
if result.returncode != 0:
    raise SystemExit('Unable to inspect tracked repository files with git ls-files.')

tracked = [entry.decode('utf-8') for entry in result.stdout.split(b'\0') if entry]
violations = []
for relative in tracked:
    path = Path(relative)
    lowered = relative.lower()
    parts = {part.lower() for part in path.parts}

    if parts.intersection({'node_modules', 'dist', 'build', 'playwright-report', 'test-results', '.cache'}):
        violations.append(f'Generated directory is tracked: {relative}')
    if path.name == '.env' or (path.name.startswith('.env.') and path.name not in {'.env.example', '.env.sample'}):
        violations.append(f'Environment file is tracked: {relative}')
    if path.suffix.lower() in {'.log', '.tmp', '.map', '.pem', '.p12', '.pfx'}:
        violations.append(f'Diagnostic, generated or sensitive file is tracked: {relative}')

    absolute = ROOT / path
    if absolute.is_file() and absolute.stat().st_size > 2_000_000:
        violations.append(f'Tracked file exceeds 2 MB: {relative}')

if violations:
    raise SystemExit('\n'.join(sorted(set(violations))))

print(json.dumps({
    'repository_hygiene': 'PASS',
    'tracked_files': len(tracked),
    'generated_directories_tracked': False,
    'environment_files_tracked': False,
    'oversized_tracked_files': False
}, ensure_ascii=False, indent=2))
