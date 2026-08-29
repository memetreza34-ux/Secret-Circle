#!/usr/bin/env python3
from pathlib import Path
import json

ROOT = Path(__file__).resolve().parents[1]

required = [
    'scripts/staging_smoke.py',
    '_headers',
    'HOSTING_DECISION.md',
    'ENVIRONMENTS.md',
    'DEPLOYMENT.md',
    'RELEASE_CHECKLIST.md',
    'tests/pwa-head-metadata.test.js',
    'package.json',
]
for relative in required:
    if not (ROOT / relative).is_file():
        raise SystemExit(f'Staging smoke contract missing file: {relative}')

smoke = (ROOT / 'scripts/staging_smoke.py').read_text(encoding='utf-8')
headers_source = (ROOT / '_headers').read_text(encoding='utf-8')
hosting = (ROOT / 'HOSTING_DECISION.md').read_text(encoding='utf-8')
environments = (ROOT / 'ENVIRONMENTS.md').read_text(encoding='utf-8')
deployment = (ROOT / 'DEPLOYMENT.md').read_text(encoding='utf-8')
checklist = (ROOT / 'RELEASE_CHECKLIST.md').read_text(encoding='utf-8')
pwa_head_test = (ROOT / 'tests/pwa-head-metadata.test.js').read_text(encoding='utf-8')
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
    'INTERACTIVE_HTML_PATHS',
    'PWA_HEAD_MARKERS',
    'assert_pwa_head_metadata',
    'apple-mobile-web-app-title',
    'apple-touch-icon',
    'manifest-src',
    'party-catalog.js',
    'party-expansion.js',
    'party-mega-catalog.js',
    'party-viral-catalog.js',
    'REQUIRED_CSP_DIRECTIVES',
    'assert_security_headers',
    "frame-ancestors 'none'",
    'X-Content-Type-Options',
    'Referrer-Policy',
    'X-Frame-Options',
    'Strict-Transport-Security',
    'assert_service_worker_cache_headers',
    'security_response_headers_required',
    'service_worker_cache_policy_checked',
    'Browser-only Service-Worker install/offline/update and real-device gates remain separate.',
)

header_policy_markers = (
    '/*',
    "Content-Security-Policy: default-src 'self'",
    "script-src 'self'",
    "style-src 'self'",
    "img-src 'self' data:",
    "connect-src 'self'",
    "worker-src 'self'",
    "manifest-src 'self'",
    "object-src 'none'",
    "base-uri 'none'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    'X-Content-Type-Options: nosniff',
    'Referrer-Policy: no-referrer',
    'X-Frame-Options: DENY',
    'Strict-Transport-Security: max-age=31536000',
    '/sw.js',
    'Cache-Control: no-cache',
)

hosting_security_markers = (
    "frame-ancestors 'none'",
    'X-Content-Type-Options: nosniff',
    'Referrer-Policy: no-referrer',
    'X-Frame-Options: DENY',
    'Strict-Transport-Security',
    '31536000',
    'sw.js',
    'immutable',
    '3600',
)

checks = {
    'smoke_script_contract': all(marker in smoke for marker in markers),
    'portable_header_policy_present': all(marker in headers_source for marker in header_policy_markers),
    'portable_header_policy_no_unsafe_inline': "'unsafe-inline'" not in headers_source,
    'portable_header_policy_no_unsafe_eval': "'unsafe-eval'" not in headers_source,
    'portable_header_policy_sw_revalidates': '/sw.js' in headers_source and 'Cache-Control: no-cache' in headers_source and 'immutable' not in headers_source,
    'https_required': "parsed.scheme.lower() != 'https'" in smoke,
    'same_origin_redirect_guard': 'Cross-Origin-Redirect blockiert' in smoke,
    'bounded_downloads': 'read_limited' in smoke and 'limit + 1' in smoke,
    'manifest_and_icon_dimensions': all(marker in smoke for marker in ('192x192', '512x512', 'PNG-Signatur/IHDR')),
    'deployed_pwa_head_contract': all(marker in smoke for marker in (
        'party.html', 'creator.html', 'advanced.html?game=question-imposter',
        'quick-play.html?game=guess-the-price', 'index.html', 'pwa_head_metadata_contract'
    )),
    'response_csp_contract': all(marker in smoke for marker in (
        "default-src 'self'", "script-src 'self'", "object-src 'none'",
        "base-uri 'none'", "frame-ancestors 'none'"
    )),
    'clickjacking_defense_in_depth': "frame-ancestors 'none'" in smoke and "x_frame != 'DENY'" in smoke,
    'nosniff_required': 'X-Content-Type-Options' in smoke and 'nosniff' in smoke,
    'referrer_policy_required': 'Referrer-Policy' in smoke and 'no-referrer' in smoke,
    'production_hsts_required': 'Strict-Transport-Security' in smoke and '31_536_000' in smoke,
    'service_worker_cache_safety': all(marker in smoke for marker in (
        'assert_service_worker_cache_headers', "'immutable' in cache_control", 'max-age=(\\d+)', '> 3600'
    )),
    'hosting_documents_security_headers': all(marker in hosting for marker in hosting_security_markers),
    'local_pwa_head_test_matches_scope': all(marker in pwa_head_test for marker in (
        'party.html', 'creator.html', 'advanced.html', 'quick-play.html', 'index.html'
    )),
    'privacy_source_gate': all(marker in smoke for marker in ('Was ist das Seltsamste in deiner Kamerarolle?', 'Lies die letzte Nachricht auf deinem Handy')),
    'reference_source_gate': all(marker in smoke for marker in ('Anime-Archetypen erraten', 'Spektrum-Tipp', 'Löwenkönig')),
    'package_command': scripts.get('staging:smoke') == 'python scripts/staging_smoke.py',
    'environment_documents_smoke': 'scripts/staging_smoke.py' in environments and 'HTTPS-Staging' in environments and 'tests/pwa-head-metadata.test.js' in environments,
    'deployment_documents_smoke': 'scripts/staging_smoke.py' in deployment and 'Production-Smoke-Test' in deployment and 'tests/pwa-head-metadata.test.js' in deployment,
    'release_checklist_requires_smoke': 'scripts/staging_smoke.py' in checklist and 'HTTPS-Staging-Smoke' in checklist,
}

failed = [name for name, passed in checks.items() if not passed]
if failed:
    raise SystemExit('Staging smoke contract failed: ' + ', '.join(failed))

print(json.dumps({
    'staging_smoke_contract_audit': 'PASS',
    'network_smoke_execution': 'NOT_RUN_BY_THIS_AUDIT',
    'pwa_head_metadata': 'DEPLOYED_SOURCE_CONTRACT_REQUIRED',
    'static_host_header_source': 'PRESENT_AND_PINNED',
    'security_response_headers': 'DEPLOYED_HEADER_CONTRACT_REQUIRED',
    'production_hsts': 'REQUIRED_IN_PRODUCTION_MODE',
    'service_worker_cache_policy': 'DEPLOYED_HEADER_CONTRACT_REQUIRED',
    'checks': checks,
}, ensure_ascii=False, indent=2))
