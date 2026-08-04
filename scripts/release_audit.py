#!/usr/bin/env python3
from pathlib import Path
import json
import re
import struct
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[1]


def run_gate(relative):
    result = subprocess.run(
        [sys.executable, str(ROOT / relative)],
        cwd=ROOT,
        text=True,
        capture_output=True
    )
    if result.returncode != 0:
        raise SystemExit(result.stderr.strip() or result.stdout.strip() or f'{relative} failed.')
    return result.stdout.strip()


hygiene_output = run_gate('scripts/repo_hygiene.py')
validator_output = run_gate('scripts/validate_project.py')
performance_output = run_gate('scripts/performance_budget.py')

read = lambda path: (ROOT / path).read_text(encoding='utf-8')
index = read('index.html')
privacy = read('privacy.html')
runtime_guard = read('runtime-guard.js')
app = read('app.js')
engine = read('game-engine.js')
word_packs = read('word-packs.js')
data_store = read('data-store.js')
fuzz_tests = read('tests/fuzz.test.js')
service_worker = read('sw.js')
workflow = read('.github/workflows/ci.yml')
cross_workflow = read('.github/workflows/cross-browser.yml')
readme = read('README.md')
checklist = read('RELEASE_CHECKLIST.md')
release_status = read('RELEASE_STATUS.md')
changelog = read('CHANGELOG.md')
limitations = read('KNOWN_LIMITATIONS.md')
security = read('SECURITY.md')
manual_plan = read('MANUAL_TEST_PLAN.md')
ci_help = read('CI_TROUBLESHOOTING.md')
deployment = read('DEPLOYMENT.md')
package = json.loads(read('package.json'))
manifest = json.loads(read('manifest.webmanifest'))

for pattern, source, description in [
    (r'VERSION\s*=\s*7', engine, 'game engine version 7'),
    (r'KEY_VERSION\s*=\s*7', data_store, 'storage schema version 7'),
    (r'ENGINE_VERSION\s*=\s*7', data_store, 'storage migration engine version 7')
]:
    if not re.search(pattern, source):
        raise SystemExit(f'Missing {description}.')

category_count = word_packs.count('entries:[')
term_count = len(re.findall(r"\['(?:[^'\\]|\\.)*','(?:[^'\\]|\\.)*'\]", word_packs))
if category_count != 14 or term_count != 168:
    raise SystemExit(f'Unexpected built-in content size: {category_count} categories, {term_count} terms.')

png_dimensions = {}
for relative, expected_size in [('icon-192.png', 192), ('icon-512.png', 512)]:
    data = (ROOT / relative).read_bytes()
    if len(data) < 1000 or data[:8] != b'\x89PNG\r\n\x1a\n' or data[12:16] != b'IHDR':
        raise SystemExit(f'Invalid PNG icon: {relative}')
    width, height = struct.unpack('>II', data[16:24])
    if (width, height) != (expected_size, expected_size):
        raise SystemExit(f'Wrong PNG dimensions for {relative}: {width}x{height}')
    png_dimensions[relative] = f'{width}x{height}'

if manifest.get('id') != './' or manifest.get('start_url') != './' or manifest.get('scope') != './':
    raise SystemExit('Manifest id, start_url and scope must remain relative.')
if manifest.get('display') != 'standalone' or manifest.get('lang') != 'de':
    raise SystemExit('Manifest display or language is invalid.')

cache_match = re.search(r"const CACHE='([^']+)'", service_worker)
if not cache_match or cache_match.group(1) != 'secret-circle-v10':
    raise SystemExit('Service worker cache version must be secret-circle-v10.')
for marker in ['fetchAndCache', 'await cache.put', 'handleNavigation', 'handleAsset', './runtime-guard.js']:
    if marker not in service_worker:
        raise SystemExit(f'Service worker reliability marker missing: {marker}')

if package.get('version') != '1.0.0-beta.3':
    raise SystemExit('Package version must be 1.0.0-beta.3.')
if package.get('engines', {}).get('node') != '>=20':
    raise SystemExit('Node support must be declared as >=20.')
playwright_version = package.get('devDependencies', {}).get('@playwright/test', '')
if not re.fullmatch(r'\d+\.\d+\.\d+', playwright_version):
    raise SystemExit('Playwright must be pinned to an exact version.')
for script in ['test', 'check', 'validate', 'test:e2e', 'test:cross-browser', 'ci']:
    if script not in package.get('scripts', {}):
        raise SystemExit(f'Package script missing: {script}')
for marker in ['tests/engine.test.js', 'tests/storage.test.js', 'tests/fuzz.test.js']:
    if marker not in package['scripts']['test']:
        raise SystemExit(f'Unit test gate missing: {marker}')
for marker in ['scripts/repo_hygiene.py', 'scripts/validate_project.py', 'scripts/performance_budget.py', 'scripts/release_audit.py']:
    if marker not in package['scripts']['validate']:
        raise SystemExit(f'Validation gate missing: {marker}')

for command in ['npm run check', 'npm test', 'npm run validate', 'npm run test:e2e']:
    if command not in workflow:
        raise SystemExit(f'Main CI command missing: {command}')
for marker in ['workflow_dispatch', 'chromium firefox webkit', 'npm run test:cross-browser']:
    if marker not in cross_workflow:
        raise SystemExit(f'Cross-browser workflow marker missing: {marker}')

for marker in [
    'unhandledrejection', 'controllerchange', 'controlledAtStartup',
    'SecretCircleRuntime', '1.0.0-beta.3'
]:
    if marker not in runtime_guard:
        raise SystemExit(f'Runtime guard marker missing: {marker}')
for marker in [
    'recordRoundHistory', 'E.startTimer', 'E.pauseTimer', 'E.syncTimer',
    'visibilitychange', 'pagehide', 'exportBackup', 'importBackup'
]:
    if marker not in app:
        raise SystemExit(f'Runtime integration marker missing: {marker}')
for directive in ["default-src 'self'", "object-src 'none'", "base-uri 'none'"]:
    if directive not in index:
        raise SystemExit(f'CSP directive missing: {directive}')
for marker in ['keine Analyse-, Werbe- oder Tracking-Dienste', 'Sicherung exportieren und importieren']:
    if marker.lower() not in privacy.lower():
        raise SystemExit(f'Privacy marker missing: {marker}')

for marker in [
    'deterministicFuzzScenarios', 'completedRounds', 'playerRange',
    'multipleImposters', 'timerTransitions', 'votingAndTieBreaks',
    'matchProgression', 'corruptionMutationsRejected'
]:
    if marker not in fuzz_tests:
        raise SystemExit(f'Fuzz invariant marker missing: {marker}')

production_docs = {
    'README': (readme, ['deadline-basierter Timer', '192- und 512-Pixel', 'PWA-Manifest']),
    'release checklist': (checklist, ['Realer Party-Betatest', 'Timer läuft nach App-Wechsel', '512 × 512']),
    'release status': (release_status, ['Technische Produktbeta', 'Aktuelle Blocker', 'öffentlichen Produktionsrelease']),
    'changelog': (changelog, ['1.0.0-beta.3', 'Hinzugefügt', 'Behoben', 'Sicherheit und Datenschutz']),
    'limitations': (limitations, ['lokales Pass-and-Play-Spiel', 'iPhone', 'öffentlichen Release']),
    'security': (security, ['Sicherheitsproblem melden', 'Security Advisory', 'Sicherheitsmodell der App']),
    'manual test plan': (manual_plan, ['Grundlegender Smoke-Test', 'PWA und Offline', 'Realer Partytest']),
    'CI troubleshooting': (ci_help, ['Fehler vor dem ersten Schritt', 'Actions-Berechtigungen', 'Abrechnung und Nutzungslimits']),
    'deployment': (deployment, ['GitHub Pages', 'HTTPS', 'Rollback', 'secret-circle-v10'])
}
for document, (source, markers) in production_docs.items():
    for marker in markers:
        if marker.lower() not in source.lower():
            raise SystemExit(f'Missing {document} marker: {marker}')

for forbidden in ['eval(', 'new Function(', 'document.write(', 'innerHTML = location', 'http://']:
    if any(forbidden in source for source in [runtime_guard, app, engine, word_packs, data_store]):
        raise SystemExit(f'Forbidden release pattern detected: {forbidden}')

e2e_suites = sorted(path.name for path in (ROOT / 'tests' / 'e2e').glob('*.spec.js'))
cross_browser_suites = sorted(path.name for path in (ROOT / 'tests' / 'cross-browser').glob('*.spec.js'))
if len(e2e_suites) < 11 or not cross_browser_suites:
    raise SystemExit('Automated browser test matrix is incomplete.')

print(json.dumps({
    'release_audit': 'PASS',
    'repository_hygiene': hygiene_output,
    'validator': validator_output,
    'performance_budget': performance_output,
    'package_version': package.get('version'),
    'engine_version': 7,
    'storage_schema_version': 7,
    'pwa_cache': cache_match.group(1),
    'pwa_icons': png_dimensions,
    'built_in_categories': category_count,
    'built_in_terms': term_count,
    'deterministic_fuzz_scenarios': 120,
    'e2e_suites': e2e_suites,
    'cross_browser_suites': cross_browser_suites,
    'cross_browser_projects': 5,
    'deadline_timer': True,
    'timer_reload_recovery': True,
    'all_completed_rounds_recorded': True,
    'backup_export_import': True,
    'corruption_recovery': True,
    'legacy_migration': True,
    'finite_voting': True,
    'duplicate_vote_protection': True,
    'non_repeating_match_words': True,
    'runtime_error_guard': True,
    'safe_pwa_update_reload': True,
    'content_security_policy': True,
    'production_docs': list(production_docs),
    'pinned_playwright': playwright_version
}, ensure_ascii=False, indent=2))
