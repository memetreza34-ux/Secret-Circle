#!/usr/bin/env python3
from pathlib import Path
import hashlib
import json
import struct

ROOT = Path(__file__).resolve().parents[1]
MANIFEST = ROOT / 'assets' / 'manifests' / 'asset-provenance.json'
WEB_MANIFEST = ROOT / 'manifest.webmanifest'

if not MANIFEST.is_file():
    raise SystemExit('Asset provenance manifest is missing.')
if not WEB_MANIFEST.is_file():
    raise SystemExit('PWA manifest is missing.')

payload = json.loads(MANIFEST.read_text(encoding='utf-8'))
web_manifest = json.loads(WEB_MANIFEST.read_text(encoding='utf-8'))
if payload.get('schemaVersion') != 1:
    raise SystemExit('Unsupported asset provenance schema version.')

assets = payload.get('assets')
if not isinstance(assets, list) or not assets:
    raise SystemExit('Asset provenance manifest must contain assets.')

allowed_statuses = {'unresolved', 'verified-own', 'verified-third-party'}
required_release_assets = {'icon.svg', 'icon-192.png', 'icon-512.png'}
expected_png_dimensions = {
    'icon-192.png': (192, 192),
    'icon-512.png': (512, 512),
}
seen = set()
unresolved = []
entries_by_path = {}


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open('rb') as handle:
        for chunk in iter(lambda: handle.read(65536), b''):
            digest.update(chunk)
    return digest.hexdigest()


def png_dimensions(path: Path) -> tuple[int, int]:
    with path.open('rb') as handle:
        header = handle.read(24)
    if len(header) < 24 or header[:8] != b'\x89PNG\r\n\x1a\n' or header[12:16] != b'IHDR':
        raise SystemExit(f'Invalid PNG/IHDR header: {path.name}')
    return struct.unpack('>II', header[16:24])


for index, asset in enumerate(assets, start=1):
    if not isinstance(asset, dict):
        raise SystemExit(f'Asset provenance entry #{index} must be an object.')
    path = asset.get('path')
    if not isinstance(path, str) or not path or path.startswith('/') or '..' in Path(path).parts:
        raise SystemExit(f'Invalid asset path at entry #{index}.')
    if path in seen:
        raise SystemExit(f'Duplicate asset provenance path: {path}')
    seen.add(path)
    entries_by_path[path] = asset
    asset_path = ROOT / path
    if not asset_path.is_file():
        raise SystemExit(f'Inventoried asset does not exist: {path}')

    recorded_hash = asset.get('sha256')
    if recorded_hash is not None:
        if not isinstance(recorded_hash, str) or len(recorded_hash) != 64:
            raise SystemExit(f'Invalid SHA-256 field for {path}.')
        actual_hash = sha256_file(asset_path)
        if actual_hash != recorded_hash.lower():
            raise SystemExit(f'Asset SHA-256 drift: {path}')

    if path in expected_png_dimensions:
        actual_dimensions = png_dimensions(asset_path)
        expected_dimensions = expected_png_dimensions[path]
        if actual_dimensions != expected_dimensions:
            raise SystemExit(
                f'PWA icon dimension mismatch for {path}: '
                f'{actual_dimensions[0]}x{actual_dimensions[1]} != '
                f'{expected_dimensions[0]}x{expected_dimensions[1]}'
            )
        if asset.get('dimensions') != f'{expected_dimensions[0]}x{expected_dimensions[1]}':
            raise SystemExit(f'Provenance dimensions drift for {path}.')

    status = asset.get('status')
    if status not in allowed_statuses:
        raise SystemExit(f'Invalid provenance status for {path}: {status}')

    if status == 'unresolved':
        unresolved.append(path)
        continue

    creator = asset.get('creator')
    source = asset.get('source')
    license_name = asset.get('license')
    commercial_use = asset.get('commercialUse')
    if not isinstance(creator, str) or not creator.strip():
        raise SystemExit(f'Verified asset missing creator: {path}')
    if not isinstance(source, str) or not source.strip():
        raise SystemExit(f'Verified asset missing source: {path}')
    if not isinstance(license_name, str) or not license_name.strip():
        raise SystemExit(f'Verified asset missing license/rights basis: {path}')
    if commercial_use is not True:
        raise SystemExit(f'Verified asset must explicitly confirm commercial use: {path}')

    if status == 'verified-third-party' and 'attribution' not in asset:
        raise SystemExit(f'Third-party asset missing attribution field: {path}')

for required in sorted(required_release_assets - seen):
    raise SystemExit(f'Release asset missing from provenance manifest: {required}')

for asset in assets:
    parent = asset.get('derivedFrom')
    if parent is not None and parent not in seen:
        raise SystemExit(f'Asset {asset["path"]} references unknown derivedFrom path: {parent}')

manifest_icons = web_manifest.get('icons')
if not isinstance(manifest_icons, list):
    raise SystemExit('PWA manifest icons must be a list.')
manifest_by_src = {entry.get('src'): entry for entry in manifest_icons if isinstance(entry, dict)}
for path, dimensions in expected_png_dimensions.items():
    entry = manifest_by_src.get(path)
    if not entry:
        raise SystemExit(f'PWA manifest missing raster icon: {path}')
    expected_size = f'{dimensions[0]}x{dimensions[1]}'
    if entry.get('sizes') != expected_size or entry.get('type') != 'image/png':
        raise SystemExit(f'PWA manifest icon metadata mismatch: {path}')

svg_entry = manifest_by_src.get('icon.svg')
if not svg_entry or svg_entry.get('sizes') != 'any' or svg_entry.get('type') != 'image/svg+xml':
    raise SystemExit('PWA manifest SVG icon contract is invalid.')

print(json.dumps({
    'asset_provenance_audit': 'PASS',
    'schema_version': payload['schemaVersion'],
    'inventoried_assets': len(assets),
    'required_release_assets': sorted(required_release_assets),
    'pwa_png_dimensions': {
        path: f'{dimensions[0]}x{dimensions[1]}'
        for path, dimensions in expected_png_dimensions.items()
    },
    'pwa_manifest_icon_contract': 'VALIDATED',
    'hash_drift_detection': True,
    'unresolved_assets': unresolved,
    'final_asset_signoff': 'BLOCKED' if unresolved else 'READY_FOR_RIGHTS_REVIEW'
}, ensure_ascii=False, indent=2))
