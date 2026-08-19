#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import re
import struct
import sys
from dataclasses import dataclass
from urllib.error import HTTPError, URLError
from urllib.parse import urljoin, urlparse
from urllib.request import Request, urlopen

MAX_TEXT_BYTES = 2_000_000
MAX_BINARY_BYTES = 3_000_000
USER_AGENT = 'Secret-Circle-Staging-Smoke/1.0'

CORE_TEXT_PATHS = (
    'party.html',
    'creator.html',
    'advanced.html?game=question-imposter',
    'quick-play.html?game=guess-the-price',
    'index.html',
    'privacy.html',
    'manifest.webmanifest',
    'sw.js',
    'backup-schema-registry.js',
    'party-catalog.js',
    'party-expansion.js',
    'party-mega-catalog.js',
    'party-viral-catalog.js',
    'party-core-release-catalog.js',
    'party-core-classic-content.js',
    'party-routing.js',
)

INTERACTIVE_HTML_PATHS = (
    'party.html',
    'creator.html',
    'advanced.html?game=question-imposter',
    'quick-play.html?game=guess-the-price',
    'index.html',
)

ICON_PATHS = ('icon.svg', 'icon-192.png', 'icon-512.png')

BLOCKED_PRIVACY_PROMPTS = (
    'Was ist das Seltsamste in deiner Kamerarolle?',
    'Lies die letzte Nachricht auf deinem Handy',
)

BLOCKED_REFERENCE_MARKERS = (
    'Son Goku', 'Naruto Uzumaki', 'Monkey D. Ruffy', 'Satoru Gojo',
    'Pikachu', 'Subaru Natsuki', 'Löwenkönig',
)

PWA_HEAD_MARKERS = (
    'viewport-fit=cover',
    'name="theme-color"',
    'name="referrer" content="no-referrer"',
    'name="mobile-web-app-capable" content="yes"',
    'name="apple-mobile-web-app-capable" content="yes"',
    'name="apple-mobile-web-app-status-bar-style" content="black-translucent"',
    'name="apple-mobile-web-app-title" content="Secret Circle"',
    "manifest-src 'self'",
    '<link rel="manifest" href="manifest.webmanifest">',
    '<link rel="icon" href="icon.svg" type="image/svg+xml">',
    '<link rel="icon" href="icon-192.png" type="image/png" sizes="192x192">',
    '<link rel="apple-touch-icon" href="icon-192.png">',
)


@dataclass
class FetchResult:
    requested_url: str
    final_url: str
    status: int
    content_type: str
    body: bytes


def normalized_origin(url: str) -> tuple[str, str, int]:
    parsed = urlparse(url)
    scheme = parsed.scheme.lower()
    host = (parsed.hostname or '').lower()
    if not host:
        raise ValueError(f'URL ohne Host: {url}')
    port = parsed.port or (443 if scheme == 'https' else 80)
    return scheme, host, port


def ensure_same_origin(base_url: str, final_url: str) -> None:
    if normalized_origin(base_url) != normalized_origin(final_url):
        raise RuntimeError(f'Cross-Origin-Redirect blockiert: {final_url}')


def read_limited(response, limit: int) -> bytes:
    declared = response.headers.get('Content-Length')
    if declared:
        try:
            if int(declared) > limit:
                raise RuntimeError(f'Ressource zu groß laut Content-Length: {declared} > {limit}')
        except ValueError:
            pass
    body = response.read(limit + 1)
    if len(body) > limit:
        raise RuntimeError(f'Ressource überschreitet Größenlimit von {limit} Bytes')
    return body


def fetch(base_url: str, relative: str, *, binary: bool = False) -> FetchResult:
    url = urljoin(base_url, relative)
    request = Request(url, headers={'User-Agent': USER_AGENT, 'Accept': '*/*'})
    limit = MAX_BINARY_BYTES if binary else MAX_TEXT_BYTES
    try:
        with urlopen(request, timeout=15) as response:
            final_url = response.geturl()
            ensure_same_origin(base_url, final_url)
            status = int(getattr(response, 'status', response.getcode()))
            if status != 200:
                raise RuntimeError(f'{relative}: HTTP {status}')
            return FetchResult(
                requested_url=url,
                final_url=final_url,
                status=status,
                content_type=response.headers.get_content_type(),
                body=read_limited(response, limit),
            )
    except HTTPError as exc:
        raise RuntimeError(f'{relative}: HTTP {exc.code}') from exc
    except URLError as exc:
        raise RuntimeError(f'{relative}: Netzwerk/TLS-Fehler: {exc.reason}') from exc


def decode_utf8(result: FetchResult, relative: str) -> str:
    try:
        return result.body.decode('utf-8')
    except UnicodeDecodeError as exc:
        raise RuntimeError(f'{relative}: kein gültiges UTF-8') from exc


def png_dimensions(data: bytes) -> tuple[int, int]:
    if len(data) < 24 or data[:8] != b'\x89PNG\r\n\x1a\n' or data[12:16] != b'IHDR':
        raise RuntimeError('Ungültige PNG-Signatur/IHDR')
    return struct.unpack('>II', data[16:24])


def assert_contains(source: str, markers: tuple[str, ...], label: str) -> None:
    missing = [marker for marker in markers if marker not in source]
    if missing:
        raise RuntimeError(f'{label}: erwartete Marker fehlen: {missing}')


def assert_absent(source: str, markers: tuple[str, ...], label: str) -> None:
    found = [marker for marker in markers if marker in source]
    if found:
        raise RuntimeError(f'{label}: gesperrte Marker gefunden: {found}')


def assert_pwa_head_metadata(source: str, label: str) -> None:
    assert_contains(source, PWA_HEAD_MARKERS, label)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description='Secret Circle HTTPS staging/production smoke test')
    parser.add_argument('base_url', help='Basis-URL, z. B. https://staging.example.com/')
    parser.add_argument('--expected-cache', help='Erwarteter Service-Worker-Cache, z. B. secret-circle-v44')
    parser.add_argument('--production', action='store_true', help='Strengere Production-Prüfungen aktivieren')
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    base_url = args.base_url if args.base_url.endswith('/') else args.base_url + '/'
    parsed = urlparse(base_url)
    if parsed.scheme.lower() != 'https':
        raise SystemExit('Staging/Production-Smoke verlangt HTTPS.')
    if not parsed.hostname:
        raise SystemExit('Ungültige Basis-URL.')

    results: dict[str, FetchResult] = {}
    for relative in CORE_TEXT_PATHS:
        results[relative] = fetch(base_url, relative)
    for relative in ICON_PATHS:
        results[relative] = fetch(base_url, relative, binary=relative.endswith('.png'))

    texts = {relative: decode_utf8(result, relative) for relative, result in results.items() if not relative.endswith('.png')}

    manifest = json.loads(texts['manifest.webmanifest'])
    if manifest.get('name') != 'Secret Circle – Party Hub':
        raise RuntimeError('manifest.webmanifest: unerwarteter App-Name')
    if manifest.get('start_url') != './party.html' or manifest.get('display') != 'standalone':
        raise RuntimeError('manifest.webmanifest: start_url/display-Vertrag verletzt')

    icon_map = {entry.get('src'): entry for entry in manifest.get('icons', []) if isinstance(entry, dict)}
    if icon_map.get('icon-192.png', {}).get('sizes') != '192x192':
        raise RuntimeError('manifest.webmanifest: icon-192.png Größenvertrag verletzt')
    if icon_map.get('icon-512.png', {}).get('sizes') != '512x512':
        raise RuntimeError('manifest.webmanifest: icon-512.png Größenvertrag verletzt')

    if png_dimensions(results['icon-192.png'].body) != (192, 192):
        raise RuntimeError('icon-192.png: reale PNG-Dimension ist nicht 192x192')
    if png_dimensions(results['icon-512.png'].body) != (512, 512):
        raise RuntimeError('icon-512.png: reale PNG-Dimension ist nicht 512x512')

    for relative in INTERACTIVE_HTML_PATHS:
        assert_pwa_head_metadata(texts[relative], relative)

    sw = texts['sw.js']
    cache_match = re.search(r"const CACHE='(secret-circle-v\d+)'", sw)
    staging_match = re.search(r"const STAGING_CACHE='(secret-circle-v\d+-staging)'", sw)
    if not cache_match or not staging_match:
        raise RuntimeError('sw.js: Cachevertrag nicht lesbar')
    cache_name = cache_match.group(1)
    expected_staging = f'{cache_name}-staging'
    if staging_match.group(1) != expected_staging:
        raise RuntimeError('sw.js: aktiver und Staging-Cache sind nicht synchron')
    if args.expected_cache and cache_name != args.expected_cache:
        raise RuntimeError(f'sw.js: Cache {cache_name} != erwartet {args.expected_cache}')

    party_html = texts['party.html']
    assert_contains(party_html, (
        'Content-Security-Policy',
        'Persönliche Inhalte sind freiwillig',
        'Überspringen ist jederzeit erlaubt',
        'backup-schema-registry.js',
        'party-data-tools.js',
    ), 'party.html')
    if party_html.index('backup-schema-registry.js') > party_html.index('party-data-tools.js'):
        raise RuntimeError('party.html: Backup-Registry wird nach den Datentools geladen')

    party_catalog = texts['party-catalog.js']
    assert_absent(party_catalog, BLOCKED_PRIVACY_PROMPTS, 'party-catalog.js')
    assert_contains(party_catalog, (
        'Welches Foto-Motiv findest du besonders lustig?',
        'Lies einen selbst erfundenen Satz wie einen dramatischen Theatermonolog vor.',
    ), 'party-catalog.js')

    mega = texts['party-mega-catalog.js']
    assert_absent(mega, BLOCKED_REFERENCE_MARKERS, 'party-mega-catalog.js')
    assert_contains(mega, ('Anime-Archetypen erraten', "['🦁🌾', 'Löwe']"), 'party-mega-catalog.js')

    expansion = texts['party-expansion.js']
    assert_absent(expansion, ('Wellenlänge', 'Chrome'), 'party-expansion.js')
    assert_contains(expansion, ("id: 'wavelength', title: 'Spektrum-Tipp'", "banned: ['Webseite', 'Internet', 'Tab']"), 'party-expansion.js')

    viral = texts['party-viral-catalog.js']
    assert_contains(viral, (
        'Ecken eines Fünfecks',
        'Bahnen einer typischen 400-Meter-Leichtathletikanlage',
        'Gewinnsätze in einem Best-of-five-Tennismatch',
    ), 'party-viral-catalog.js')

    if args.production:
        public_text = '\n'.join(texts[path] for path in ('party.html', 'creator.html', 'privacy.html', 'manifest.webmanifest'))
        placeholders = ('REPLACE_ME', 'example.invalid', 'example.com', 'TBD vor RC')
        assert_absent(public_text, placeholders, 'Production public files')

    report = {
        'staging_smoke': 'PASS',
        'base_url': base_url,
        'mode': 'production' if args.production else 'staging',
        'pwa_cache': cache_name,
        'resources_checked': len(results),
        'same_origin_redirects_enforced': True,
        'https_required': True,
        'manifest_and_png_dimensions': True,
        'pwa_head_metadata_contract': True,
        'pwa_head_pages_checked': list(INTERACTIVE_HTML_PATHS),
        'privacy_source_contract': True,
        'reference_source_contract': True,
        'note': 'Browser-only Service-Worker install/offline/update and real-device gates remain separate.',
    }
    print(json.dumps(report, ensure_ascii=False, indent=2))
    return 0


if __name__ == '__main__':
    try:
        raise SystemExit(main())
    except (RuntimeError, ValueError, json.JSONDecodeError) as exc:
        print(f'STAGING_SMOKE_FAIL: {exc}', file=sys.stderr)
        raise SystemExit(1)