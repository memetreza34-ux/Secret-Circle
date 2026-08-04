#!/usr/bin/env python3
from pathlib import Path
import json
import re

ROOT = Path(__file__).resolve().parents[1]
read = lambda path: (ROOT / path).read_text(encoding='utf-8')

package = json.loads(read('package.json'))
manifest = json.loads(read('manifest.webmanifest'))
engine = read('game-engine.js')
role_assignment = read('role-assignment.js')
store = read('data-store.js')
content = read('word-packs.js')
service_worker = read('sw.js')
index = read('index.html')
workflow = read('.github/workflows/ci.yml')
cross_workflow = read('.github/workflows/cross-browser.yml')

checks = {
    'package_version': package.get('version') == '1.0.0-beta.3',
    'node_support': package.get('engines', {}).get('node') == '>=20',
    'engine_version': bool(re.search(r'\bVERSION\s*=\s*7\b', engine)),
    'storage_schema': bool(re.search(r'\bKEY_VERSION\s*=\s*7\b', store)),
    'storage_migration_engine': bool(re.search(r'\bENGINE_VERSION\s*=\s*7\b', store)),
    'maximum_six_imposters': 'MAX_IMPOSTERS = 6' in role_assignment,
    'independent_role_seed': 'independent-roles-v1' in role_assignment,
    'role_wrappers_installed': all(marker in role_assignment for marker in ('engine.createGame', 'engine.nextRound')),
    'pwa_cache_v17': "const CACHE='secret-circle-v17'" in service_worker,
    'setup_ux_cached': './setup-ux.js' in service_worker,
    'privacy_guard_cached': './privacy-guard.js' in service_worker,
    'wake_lock_cached': './wake-lock.js' in service_worker,
    'role_assignment_cached': './role-assignment.js' in service_worker,
    'runtime_guard_cached': './runtime-guard.js' in service_worker,
    'safe_cache_writes': 'await cache.put' in service_worker,
    'stable_manifest_scope': all(manifest.get(key) == './' for key in ('id', 'start_url', 'scope')),
    'standalone_pwa': manifest.get('display') == 'standalone',
    'german_manifest': manifest.get('lang') == 'de',
    'strict_csp': all(marker in index for marker in (
        "default-src 'self'", "script-src 'self'", "style-src 'self'",
        "object-src 'none'", "base-uri 'none'", "form-action 'self'"
    )),
    'live_setup_guidance_loaded': '<script src="setup-ux.js"></script>' in index,
    'privacy_guard_loaded': '<script src="privacy-guard.js"></script>' in index,
    'wake_lock_loaded': '<script src="wake-lock.js"></script>' in index,
    'role_assignment_loaded': '<script src="role-assignment.js"></script>' in index,
    'role_assignment_before_app': index.index('role-assignment.js') < index.index('app.js'),
    'main_ci_commands': all(command in workflow for command in (
        'npm run check', 'npm test', 'npm run validate', 'npm run test:e2e'
    )),
    'cross_browser_matrix': all(marker in cross_workflow for marker in (
        'chromium firefox webkit', 'npm run test:cross-browser'
    )),
    'exact_playwright_version': bool(re.fullmatch(
        r'\d+\.\d+\.\d+', package.get('devDependencies', {}).get('@playwright/test', '')
    ))
}
failed = [name for name, passed in checks.items() if not passed]
if failed:
    raise SystemExit(f'Release audit failed: {", ".join(failed)}')

category_count = content.count('entries:[')
term_count = len(re.findall(r"\['(?:[^'\\]|\\.)*','(?:[^'\\]|\\.)*'\]", content))
if (category_count, term_count) != (14, 168):
    raise SystemExit(f'Unexpected built-in content: {category_count} categories, {term_count} terms.')

unit_tests = sorted(path.name for path in (ROOT / 'tests').glob('*.test.js'))
e2e_suites = sorted(path.name for path in (ROOT / 'tests' / 'e2e').glob('*.spec.js'))
cross_browser_suites = sorted(path.name for path in (ROOT / 'tests' / 'cross-browser').glob('*.spec.js'))
if len(unit_tests) < 5 or len(e2e_suites) < 14 or not cross_browser_suites:
    raise SystemExit('Automated test matrix is incomplete.')
for required in ['role-assignment.test.js']:
    if required not in unit_tests:
        raise SystemExit(f'Critical unit test missing: {required}')
for required in ['role-assignment.spec.js', 'privacy-guard.spec.js', 'wake-lock.spec.js']:
    if required not in e2e_suites:
        raise SystemExit(f'Critical E2E suite missing: {required}')

required_docs = [
    'README.md', 'RELEASE_CHECKLIST.md', 'RELEASE_STATUS.md', 'CHANGELOG.md',
    'KNOWN_LIMITATIONS.md', 'SECURITY.md', 'MANUAL_TEST_PLAN.md',
    'CI_TROUBLESHOOTING.md', 'DEPLOYMENT.md', 'privacy.html'
]
for relative in required_docs:
    path = ROOT / relative
    if not path.is_file() or path.stat().st_size < 300:
        raise SystemExit(f'Missing or incomplete production document: {relative}')

for relative, markers in {
    'README.md': ['secret-circle-v17', 'Rollenverteilung', 'Aufdeckreihenfolge'],
    'RELEASE_STATUS.md': ['Cache-Version 17', 'unabhängige Rollenverteilung', 'Aktuelle Blocker'],
    'DEPLOYMENT.md': ['secret-circle-v17', 'Rollenverteilung', 'Rollback'],
    'RELEASE_CHECKLIST.md': ['Aufdeckreihenfolge', 'Realer Party-Betatest', 'GitHub Actions'],
    'CHANGELOG.md': ['Rollenverteilung', 'Aufdeckreihenfolge', 'secret-circle-v17'],
    'SECURITY.md': ['Sicherheitsproblem melden', 'Sicherheitsmodell der App'],
    'CI_TROUBLESHOOTING.md': ['Fehler vor dem ersten Schritt', 'Abrechnung'],
    'MANUAL_TEST_PLAN.md': ['Aufdeckreihenfolge', 'Android-Installation', 'iPhone-/iPad-Installation', 'Realer Partytest']
}.items():
    text = read(relative)
    for marker in markers:
        if marker.lower() not in text.lower():
            raise SystemExit(f'Missing documentation marker {marker} in {relative}')

print(json.dumps({
    'release_audit': 'PASS',
    'package_version': package['version'],
    'engine_version': 7,
    'storage_version': 7,
    'maximum_imposters': 6,
    'independent_role_assignment': True,
    'pwa_cache': 'secret-circle-v17',
    'built_in_categories': category_count,
    'built_in_terms': term_count,
    'unit_test_files': unit_tests,
    'e2e_suites': e2e_suites,
    'cross_browser_suites': cross_browser_suites,
    'cross_browser_projects': 5,
    'secret_card_privacy_guard': True,
    'discussion_wake_lock': True,
    'critical_checks': checks,
    'production_docs': required_docs
}, ensure_ascii=False, indent=2))
