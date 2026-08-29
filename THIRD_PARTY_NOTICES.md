# Secret Circle – Third-Party-, Lizenz- und Asset-Inventar

Stand: 29. August 2026  
Status: **IN PROGRESS – Icon-Provenienz gelöst; reale Install-/Audit-/Finalreview-Evidence offen**

## 1. Zweck

Dieses Dokument inventarisiert externe Software, gebündelte Assets, Referenzcontent und die verbleibenden Rechte-/Releaseprüfungen. Ein technischer Source-Vertrag ist kein Ersatz für die reale Ausführung auf dem finalen Release Candidate.

## 2. Runtime-Abhängigkeiten

`package.json` enthält **keine npm-Runtime-Dependencies**. Die Production-PWA lädt keine externen JavaScript-CDNs, Webfonts, Analyse-/Werbe-SDKs oder Remote-Spielassets.

## 3. Reproduzierbarer npm-Snapshot

`package-lock.json` liegt im Lockfile-Format v3 vor. Die Entwicklungs-Testkette umfasst:

| Paket | Version | Rolle | Lizenz | Production-Runtime? |
|---|---:|---|---|---|
| `@playwright/test` | `1.54.2` | direkter Test Runner | Apache-2.0 | Nein |
| `playwright` | `1.54.2` | Testdependency | Apache-2.0 | Nein |
| `playwright-core` | `1.54.2` | Browserautomation | Apache-2.0 | Nein |
| `fsevents` | `2.3.2` | optionale macOS-Dependency | MIT | Nein |

`scripts/lockfile_contract_audit.py` schützt diesen Snapshot gegen Drift. CI und Cross-Browser verwenden `npm ci`.

Noch offen bleibt ein **echter Online-`npm ci`-PASS** auf einem **unverändertem Commit** mit anschließendem CI-/Cross-Browser-/Integrity-Nachweis. Der aktuelle GitHub-Hosted-Runner-Blocker verhindert diese reale Evidence weiterhin vor Step 1.

## 4. Maschinenlesbare Asset-Provenienz

Verbindlich ist `assets/manifests/asset-provenance.json`, Schema-Version 1.

`scripts/asset_provenance_audit.py` prüft:

- Datei-Existenz
- erlaubte Provenienzstatus
- SHA-256
- PNG-IHDR/Dimensionen
- PWA-Manifestgrößen
- `derivedFrom`-Beziehungen
- Creator/Source/Rechtebasis bei verifizierten Assets
- `commercialUse = true`

Erlaubte Statuswerte bleiben `unresolved`, `verified-own` und `verified-third-party`.

## 5. Aktuelles App-Iconset – Rechtebasis gelöst

Das frühere ungeklärte App-Icon wurde vollständig durch ein neues Original ersetzt.

| Datei | Status | Nachweis |
|---|---|---|
| `icon.svg` | `verified-own` | Originale geometrische SVG-Konstruktion vom 29.08.2026; keine externe Bild-/Logo-/Stock-/Fontvorlage |
| `icon-192.png` | `verified-own` | 192×192-Ableitung aus dem aktuellen `icon.svg` |
| `icon-512.png` | `verified-own` | 512×512-Ableitung aus dem aktuellen `icon.svg` |

Dokumente:

- `ASSET_RIGHTS_SIGNOFF.md`
- `assets/manifests/ORIGINAL_ICON_SOURCE.md`
- `assets/manifests/ICON_RASTER_HASHES.md`
- `assets/manifests/asset-provenance.json`

Aktuelle Hashes:

- `icon.svg`: `ccc23350cb82cd76ff804f36fadafa51b8b4690ce9c1f8fc2c6793c66888f83c`
- `icon-192.png`: `75c0de14d6a6683f589a8bc2ca99c89e00dea69ee8c04fb51693dcb9fc6a5e5e`
- `icon-512.png`: `1be8d9c863a2e05b96fcd64c4254126e7fcec3a9fcab25c6756d156b40e0b1ce`

Die Provenienz bestätigt den Erstellungsweg und die dokumentierte kommerzielle Nutzungsbasis. Sie ist **keine Markenregistrierung oder Garantie weltweiter Einzigartigkeit**.

## 6. Media-Inventar

`scripts/media_inventory_audit.py` erwartet weiterhin exakt drei gebündelte Release-Mediendateien:

1. `icon.svg`
2. `icon-192.png`
3. `icon-512.png`

Eine während des Ersatzes kurz vorhandene zusätzliche SVG-Quellkopie wurde wieder entfernt, damit der bestehende Releasevertrag nicht still erweitert wird.

## 7. Emoji und Systemglyphen

Unicode-Emoji werden nur als Zeichen verwendet. Secret Circle bündelt keine Emoji-Fontdatei und keine exportierten Emoji-Bildassets.

## 8. Built-in- und Referenzcontent

Core-, Extended-/Labs-, Privacy- und Reference-Audits bleiben Bestandteil des Releasepfads. Generische Ersatzbegriffe werden weiter bevorzugt, wo konkrete Marken-/Franchise-Referenzen für die Spielmechanik nicht erforderlich sind.

Ein finaler manueller Fan-/Marken-/Franchise-/Marketing-/Visualreview bleibt vor GO erforderlich.

## 9. Hosting / ausgelieferte Dateien

`scripts/staging_smoke.py` prüft später die tatsächlich ausgelieferten HTTPS-Ressourcen, Manifest-/PNG-Verträge, Cachegeneration, Privacy-/Reference-Source-Verträge und Security-Header. Das ergänzt lokale Audits, ersetzt aber keine reale PWA-/Geräteprüfung.

## 10. Projektlizenz / Quellcodefreigabe

Es existiert weiterhin keine Root-Datei `LICENSE`. Vor einer bewussten öffentlichen Quellcodeverteilung muss entschieden werden, ob der Code proprietär bleibt oder unter eine konkrete Open-Source-Lizenz gestellt wird.

## 11. Release-Gates

Vor `THIRD-PARTY / ASSET PASS`:

- [x] `package-lock.json` vorhanden
- [x] npm-Entwicklungsabhängigkeiten inventarisiert
- [x] `scripts/lockfile_contract_audit.py` vorhanden
- [x] CI-/Cross-Browser-Workflows verwenden `npm ci`
- [x] maschinenlesbares Asset-Provenienzmanifest vorhanden
- [x] altes ungeklärtes Iconset vollständig ersetzt
- [x] `icon.svg` auf `verified-own`
- [x] beide PNG-Ableitungen auf `verified-own`
- [x] neue SHA-256-/Dimensionsdaten dokumentiert
- [x] Media-Vertrag bleibt exakt drei Release-Medien
- [ ] echter Online-`npm ci` auf unverändertem Commit grün
- [ ] Integrity-/Installationsnachweis auf funktionierendem Runner
- [ ] `scripts/asset_provenance_audit.py` tatsächlich grün
- [ ] `scripts/media_inventory_audit.py` tatsächlich grün
- [ ] kompletter `npm run validate` auf demselben Kandidaten grün
- [ ] finaler manueller Fan-/Marken-/Franchise-/Marketing-/Visualreview
- [ ] erforderliche Attributionen/Notices final geprüft
- [ ] Projekt-/Quellcodelizenz bewusst entschieden, falls Quellcode öffentlich verteilt wird

Der frühere **Icon-Rechteblocker ist geschlossen**, das übergeordnete Asset-/Third-Party-Gate bleibt bis zu den realen Ausführungs- und Finalreview-Nachweisen **BLOCKED**. Der öffentliche Release bleibt **NO_GO**.
