#!/usr/bin/env python3
from pathlib import Path
import json

ROOT = Path(__file__).resolve().parents[1]

required = [
    'scripts/staging_smoke.py',
    'ENVIRONMENTS.md',
    'DEPLOYMENT.md',
    'RELEASE_CHECKLIST.md',
    'package.json',
]
for relative in required:
    if not (ROOT / relative).is_file():
        raise SystemExit(f'Staging smoke contract missing file: {relative}')

smoke = (ROOT / 'scripts/staging_smoke.py').read_text(encoding='utf-8')
environments = (ROOT / 'ENVIRONMENTS.md').read_text(encoding='utf-8')
deployment = (ROOT / 'DEPLOYMENT.md').read_text(encoding='utf-8')
checklist = (ROOT / 'RELEASE_CHECKLIST.md').read_text(encoding='utf-8')
package = json.loads((ROOT / 'package.json').read_text(encoding='utf-8'))
scripts = package.get('scripts', {})

markers = (
    'https',
    'ensure_same_origin',
    'MAX_TEXT_BYTES',
    'MAX_BINARY_BYTES',
    'manifest.webmanifest',
    'icon-192.png',
    'icon-512.png',
    'png_dimensions',
    '--expected-cache',
    '--production',
    'BLOCKED_PRIVACY_PROMPTS',
    'BLOCKED_REFERENCE_MARKERS',
    'party-catalog.js',
    'party-expansion.js',
    'party-mega-catalog.js',
    'party-viral-catalog.js',
    'Browser-only Service-Worker install/offline/update and real-device gates remain separate.',
)

checks = {
    'smoke_script_contract': all(marker in smoke for marker in markers),
    'https_required': "parsed.scheme.lower() != 'https'" in smoke,
    'same_origin_redirect_guard': 'Cross-Origin-Redirect blockiert' in smoke,
    'bounded_downloads': 'read_limited' in smoke and 'limit + 1' in smoke,
    'manifest_and_icon_dimensions': all(marker in smoke for marker in ('192x192', '512x512', 'PNG-Signatur/IHDR')),
    'privacy_source_gate': all(marker in smoke for marker in ('Was ist das Seltsamste in deiner Kamerarolle?', 'Lies die letzte Nachricht auf deinem Handy')),
    'reference_source_gate': all(marker in smoke for marker in ('Anime-Archetypen erraten', 'Spektrum-Tipp', 'Löwenkönig')),
    'package_command': scripts.get('staging:smoke') == 'python scripts/staging_smoke.py',
    'environment_documents_smoke': 'scripts/staging_smoke.py' in environments and 'HTTPS-Staging' in environments,
    'deployment_documents_smoke': 'scripts/staging_smoke.py' in deployment and 'Production-Smoke-Test' in deployment,
    'release_checklist_requires_smoke': 'scripts/staging_smoke.py' in checklist and 'HTTPS-Staging-Smoke' in checklist,
}

failed = [name for name, passed in checks.items() if not passed]
if failed:
    raise SystemExit('Staging smoke contract failed: ' + ', '.join(failed))

print(json.dumps({
    'staging_smoke_contract_audit': 'PASS',
    'network_smoke_execution': 'NOT_RUN_BY_THIS_AUDIT',
    'checks': checks,
}, ensure_ascii=False, indent=2))
