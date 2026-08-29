#!/usr/bin/env python3
from pathlib import Path
import json

ROOT = Path(__file__).resolve().parents[1]
PROVENANCE = ROOT / 'assets' / 'manifests' / 'asset-provenance.json'

MEDIA_SUFFIXES = {
    '.png', '.jpg', '.jpeg', '.webp', '.gif', '.avif', '.svg', '.ico',
    '.mp3', '.wav', '.ogg', '.m4a', '.flac', '.mp4', '.webm', '.mov'
}
IGNORED_DIRS = {
    '.git', 'node_modules', 'playwright-report', 'test-results', 'coverage', '.cache'
}
EXPECTED_CURRENT_MEDIA = {'icon.svg', 'icon-192.png', 'icon-512.png'}

if not PROVENANCE.is_file():
    raise SystemExit('Media inventory cannot run without asset-provenance.json.')

payload = json.loads(PROVENANCE.read_text(encoding='utf-8'))
assets = payload.get('assets') if isinstance(payload.get('assets'), list) else []
provenance_paths = {
    entry.get('path') for entry in assets
    if isinstance(entry, dict) and isinstance(entry.get('path'), str)
}

media_paths = set()
for path in ROOT.rglob('*'):
    if not path.is_file():
        continue
    relative = path.relative_to(ROOT)
    if any(part in IGNORED_DIRS for part in relative.parts):
        continue
    if path.suffix.lower() in MEDIA_SUFFIXES:
        media_paths.add(relative.as_posix())

missing_from_provenance = sorted(media_paths - provenance_paths)
stale_provenance_media = sorted(
    path for path in provenance_paths
    if Path(path).suffix.lower() in MEDIA_SUFFIXES and path not in media_paths
)

if missing_from_provenance:
    raise SystemExit('Bundled media missing from provenance manifest: ' + ', '.join(missing_from_provenance))
if stale_provenance_media:
    raise SystemExit('Media provenance points to missing files: ' + ', '.join(stale_provenance_media))
if media_paths != EXPECTED_CURRENT_MEDIA:
    raise SystemExit(
        'Bundled media inventory changed; review and update explicit release contract: '
        + ', '.join(sorted(media_paths))
    )

print(json.dumps({
    'media_inventory_audit': 'PASS',
    'media_extensions_scanned': sorted(MEDIA_SUFFIXES),
    'ignored_directories': sorted(IGNORED_DIRS),
    'bundled_media': sorted(media_paths),
    'bundled_media_count': len(media_paths),
    'all_media_in_provenance_manifest': True,
    'current_release_media_contract': sorted(EXPECTED_CURRENT_MEDIA),
    'audio_files': [],
    'video_files': [],
    'other_raster_files': [],
}, ensure_ascii=False, indent=2))
