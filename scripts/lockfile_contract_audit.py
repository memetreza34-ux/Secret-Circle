#!/usr/bin/env python3
from pathlib import Path
import json

ROOT = Path(__file__).resolve().parents[1]
package = json.loads((ROOT / 'package.json').read_text(encoding='utf-8'))
lock = json.loads((ROOT / 'package-lock.json').read_text(encoding='utf-8'))
ci = (ROOT / '.github/workflows/ci.yml').read_text(encoding='utf-8')
cross = (ROOT / '.github/workflows/cross-browser.yml').read_text(encoding='utf-8')

packages = lock.get('packages', {})
root = packages.get('', {})
expected_nodes = {
    '',
    'node_modules/@playwright/test',
    'node_modules/playwright',
    'node_modules/playwright-core',
    'node_modules/fsevents',
}

checks = {
    'lockfile_version_3': lock.get('lockfileVersion') == 3 and lock.get('requires') is True,
    'root_name_version_match': lock.get('name') == package.get('name') and lock.get('version') == package.get('version'),
    'root_dev_dependencies_match': root.get('devDependencies') == package.get('devDependencies'),
    'root_engines_match': root.get('engines') == package.get('engines'),
    'minimal_dependency_surface': set(packages) == expected_nodes,
    'playwright_test_exact': packages.get('node_modules/@playwright/test', {}).get('version') == '1.54.2',
    'playwright_exact': packages.get('node_modules/playwright', {}).get('version') == '1.54.2',
    'playwright_core_exact': packages.get('node_modules/playwright-core', {}).get('version') == '1.54.2',
    'fsevents_exact_optional': (
        packages.get('node_modules/fsevents', {}).get('version') == '2.3.2'
        and packages.get('node_modules/fsevents', {}).get('optional') is True
        and packages.get('node_modules/fsevents', {}).get('os') == ['darwin']
    ),
    'dependency_graph_exact': (
        packages.get('node_modules/@playwright/test', {}).get('dependencies') == {'playwright': '1.54.2'}
        and packages.get('node_modules/playwright', {}).get('dependencies') == {'playwright-core': '1.54.2'}
        and packages.get('node_modules/playwright', {}).get('optionalDependencies') == {'fsevents': '2.3.2'}
    ),
    'all_registry_packages_locked_with_sha512': all(
        isinstance(entry.get('resolved'), str)
        and entry['resolved'].startswith('https://registry.npmjs.org/')
        and isinstance(entry.get('integrity'), str)
        and entry['integrity'].startswith('sha512-')
        for key, entry in packages.items() if key
    ),
    'no_runtime_dependencies_added': not package.get('dependencies') and not root.get('dependencies'),
    'main_ci_uses_npm_ci': 'npm ci --ignore-scripts --no-audit --no-fund' in ci and 'npm install ' not in ci,
    'cross_browser_uses_npm_ci': 'npm ci --ignore-scripts --no-audit --no-fund' in cross and 'npm install ' not in cross,
    'setup_node_cache_enabled': "cache: 'npm'" in ci and "cache: 'npm'" in cross,
}

failed = [name for name, passed in checks.items() if not passed]
if failed:
    raise SystemExit('Lockfile contract failed: ' + ', '.join(failed))

print(json.dumps({
    'lockfile_contract_audit': 'PASS',
    'lockfile_version': lock['lockfileVersion'],
    'locked_packages': sorted(packages),
    'root_dev_dependencies': root.get('devDependencies', {}),
    'online_npm_ci': 'NOT_VERIFIED_BY_THIS_STATIC_AUDIT',
    'checks': checks,
}, ensure_ascii=False, indent=2))
