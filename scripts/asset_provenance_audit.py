#!/usr/bin/env python3
from pathlib import Path
import json

ROOT = Path(__file__).resolve().parents[1]
MANIFEST = ROOT / 'assets' / 'manifests' / 'asset-provenance.json'

if not MANIFEST.is_file():
    raise SystemExit('Asset provenance manifest is missing.')

payload = json.loads(MANIFEST.read_text(encoding='utf-8'))
if payload.get('schemaVersion') != 1:
    raise SystemExit('Unsupported asset provenance schema version.')

assets = payload.get('assets')
if not isinstance(assets, list) or not assets:
    raise SystemExit('Asset provenance manifest must contain assets.')

allowed_statuses = {'unresolved', 'verified-own', 'verified-third-party'}
required_release_assets = {'icon.svg', 'icon-192.png', 'icon-512.png'}
seen = set()
unresolved = []

for index, asset in enumerate(assets, start=1):
    if not isinstance(asset, dict):
        raise SystemExit(f'Asset provenance entry #{index} must be an object.')
    path = asset.get('path')
    if not isinstance(path, str) or not path or path.startswith('/') or '..' in Path(path).parts:
        raise SystemExit(f'Invalid asset path at entry #{index}.')
    if path in seen:
        raise SystemExit(f'Duplicate asset provenance path: {path}')
    seen.add(path)
    if not (ROOT / path).is_file():
        raise SystemExit(f'Inventoried asset does not exist: {path}')

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

print(json.dumps({
    'asset_provenance_audit': 'PASS',
    'schema_version': payload['schemaVersion'],
    'inventoried_assets': len(assets),
    'required_release_assets': sorted(required_release_assets),
    'unresolved_assets': unresolved,
    'final_asset_signoff': 'BLOCKED' if unresolved else 'READY_FOR_RIGHTS_REVIEW'
}, ensure_ascii=False, indent=2))
