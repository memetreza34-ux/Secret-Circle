# Secret Circle – replacement icon raster hashes

Prepared from the replacement `icon.svg` on 2026-08-29.

Expected release raster outputs after palette optimization:

- `icon-192.png` — 192×192 — SHA-256 `75c0de14d6a6683f589a8bc2ca99c89e00dea69ee8c04fb51693dcb9fc6a5e5e`
- `icon-512.png` — 512×512 — SHA-256 `1be8d9c863a2e05b96fcd64c4254126e7fcec3a9fcab25c6756d156b40e0b1ce`

Generation path: replacement SVG → CairoSVG 2.8.2 raster export → Pillow palette optimization. These hashes become authoritative only after the corresponding binary files are committed and verified by `scripts/asset_provenance_audit.py`.
