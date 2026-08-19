# Secret Circle – Third-Party-, Lizenz- und Asset-Inventar

Stand: 19. August 2026  
Status: **IN PROGRESS – npm-Snapshot vorhanden; Root-SVG-Rechte und reale Verifikation offen**

## 1. Zweck

Dieses Dokument inventarisiert externe Software, gebündelte Assets, Referenzcontent und eigene Projektbestandteile, die vor dem Januar-2027-Release auf Herkunft und Nutzungsrechte geprüft werden müssen.

Ein Eintrag ohne belegte Rechtebasis wird **nicht** automatisch als eigenes Werk behandelt.

## 2. Runtime-Abhängigkeiten

`package.json` enthält weiterhin **keine npm-Runtime-Dependencies**. Die Production-PWA lädt außerdem keine externen JavaScript-CDNs, Webfonts, Analyse-/Werbe-SDKs oder Remote-Spielassets.

## 3. Reproduzierbarer npm-Snapshot

Seit 19. August 2026 liegt `package-lock.json` im Lockfile-Format **v3** vor. Der Snapshot ist bewusst minimal und umfasst nur die Entwicklungs-Testkette:

| Paket | Version | Rolle | Lizenz | Runtime der Production-PWA? |
|---|---:|---|---|---|
| `@playwright/test` | `1.54.2` | direkte Dev-Dependency / Test Runner | Apache-2.0 | Nein |
| `playwright` | `1.54.2` | Dependency von `@playwright/test` | Apache-2.0 | Nein |
| `playwright-core` | `1.54.2` | Dependency von `playwright` | Apache-2.0 | Nein |
| `fsevents` | `2.3.2` | optionale macOS-Dependency von `playwright` | MIT | Nein |

Der offizielle Playwright-Tag `v1.54.2` bestätigt:

- `@playwright/test` 1.54.2 → `playwright` 1.54.2
- `playwright` 1.54.2 → `playwright-core` 1.54.2
- `playwright` führt `fsevents` 2.3.2 als optionale Dependency
- die drei Playwright-Pakete deklarieren Apache-2.0

Der offizielle `fsevents`-Tag `v2.3.2` deklariert MIT und `darwin` als Zielplattform.

`package-lock.json` enthält für alle vier Registry-Pakete feste `resolved`-URLs und `sha512`-Integrity-Werte.

`scripts/lockfile_contract_audit.py` prüft:

- Lockfile-Version 3
- Root-Name/Version/Engines/Dev-Dependency gegen `package.json`
- exakt die erwartete minimale Paketmenge
- exakte 1.54.2-/2.3.2-Versionen
- exakten Dependencygraph
- Registry-URL + `sha512` für jedes Paket
- keine npm-Runtime-Dependency
- `npm ci` in normalem CI und Cross-Browser
- npm-Cache über `actions/setup-node`

Der Audit ist Teil von `npm run validate`.

### Lokaler Strukturcheck

Ein lokaler `npm ci --ignore-scripts --offline --no-audit --no-fund`-Versuch akzeptierte Package-/Lock-Synchronität und brach erst beim fehlenden lokalen Tarballcache (`ENOTCACHED` für `playwright-core-1.54.2.tgz`) ab. Das ist ein Struktur-/Synchronitätssignal, **kein** Online-Installations-PASS.

Noch offen:

- `npm ci` mit erreichbarer Registry auf echtem Runner
- tatsächlicher Installations-/Integrity-Nachweis auf unverändertem Commit
- danach `npm run ci` und Cross-Browser auf demselben Commit

## 4. Maschinenlesbare Asset-Provenienz

Verbindlich: `assets/manifests/asset-provenance.json`, Schema-Version **1**.

`scripts/asset_provenance_audit.py` ist Teil von `npm run validate` und prüft unter anderem Datei-Existenz, Statuswerte, Ableitungen, SHA-256, PNG-IHDR und Manifestgrößen.

Der Validator darf `unresolved` während der Entwicklung akzeptieren, meldet dann aber `final_asset_signoff: BLOCKED`.

## 5. Aktuelle App-Assets

| Datei | Technischer Nachweis | Rechte-Status |
|---|---|---|
| `icon.svg` | Git-Historie: am 2. August 2026 in Commit `c183d439882bf3f25a5577e3867b76b4f930e84c` neu angelegt | `unresolved` |
| `icon-192.png` | echtes 192×192-PNG, aus `icon.svg`; SHA-256 dokumentiert | `unresolved`, Ableitung technisch belegt |
| `icon-512.png` | echtes 512×512-PNG, aus `icon.svg`; SHA-256 dokumentiert | `unresolved`, Ableitung technisch belegt |

Repository-Herkunft beweist **nicht automatisch** Urheberrecht oder kommerzielle Nutzungsrechte. Offen bleiben Urheber/Ersteller, mögliche KI-/Template-/Stock-Nutzung, kommerzielle Rechtebasis und erforderliche Attribution.

## 6. Gebündeltes Media-Inventar

Aktuell als Release-Mediendateien inventarisiert:

1. `icon.svg`
2. `icon-192.png`
3. `icon-512.png`

`scripts/media_inventory_audit.py` verlangt, dass neue Bild-/Audio-/Videodateien im Provenienzmanifest auftauchen und blockiert verwaiste Einträge.

## 7. Emoji und Systemglyphen

Im UI stehen Unicode-Emoji-Zeichen. Secret Circle bündelt keine eigene Emoji-Fontdatei. Ein späterer Export von Emoji-Glyphen als eigene Bildassets würde eine neue Rechteprüfung auslösen.

## 8. Built-in- und Referenzcontent

### Core

`CORE_CONTENT_REVIEW.md` dokumentiert den 15/15-Core-Quellpass. v43 entfernt die zwei bekannten Private-Device-Prompts physisch aus `party-catalog.js`; `scripts/privacy_content_audit.py` schützt acht ausgelieferte Contentquellen.

### Fan-/Referenzcontent

- Word Imposter nutzt generische Ersatzbegriffe für die v36-Funde.
- `anime-guess` liefert **Anime-Archetypen erraten** mit 40 generischen Archetypen; frühere konkrete Figuren sind physisch aus `party-mega-catalog.js` entfernt.
- `Wellenlänge` → **Spektrum-Tipp** upstream.
- Browser-Tabu `Chrome` → `Tab` upstream.
- `Löwenkönig` → `Löwe`.
- v38-Sport-/Eventformulierungen wurden generisch ersetzt.
- `scripts/reference_content_audit.py` scannt acht ausgelieferte Contentquellen.

Der restliche manuelle Extended-/Labs-/Marketing-/Visualpass bleibt offen.

## 9. HTTPS-Staging / ausgelieferte Dateien

`scripts/staging_smoke.py` prüft später die tatsächlich ausgelieferten HTTPS-Ressourcen, Manifest-/PNG-Verträge, Cachegeneration sowie Privacy-/Reference-Source-Verträge. Das ergänzt lokale Audits, ersetzt aber keine reale PWA-/Geräteprüfung.

## 10. Projektlizenz / Quellcodefreigabe

Es existiert weiterhin keine Root-Datei `LICENSE`.

Vor öffentlicher Quellcodeverteilung muss bewusst entschieden werden, ob der Code proprietär/nicht zur Weiterverwendung lizenziert bleibt oder unter eine konkrete Open-Source-Lizenz gestellt wird.

## 11. Hosting- und Plattformkomponenten

Nach Auswahl der Production-Plattform prüfen:

- Hosting-AGB
- Datenschutz-/Logverarbeitung
- Build-/Deploy-Actions
- erforderliche License-/NOTICE-/Attribution-Pflichten

## 12. Release-Gates

Vor `THIRD-PARTY / ASSET PASS`:

- [x] `package-lock.json` vorhanden
- [x] direkte Dev-Dependency `@playwright/test` 1.54.2 / Apache-2.0 verifiziert
- [x] transitive npm-Paketmenge aus Lockfile inventarisiert
- [x] Playwright-Dependencygraph gegen offiziellen v1.54.2-Tag geprüft
- [x] `fsevents` 2.3.2 / MIT / darwin gegen offiziellen Tag geprüft
- [x] `scripts/lockfile_contract_audit.py` in `npm run validate`
- [x] normaler CI- und Cross-Browser-Workflow verwenden `npm ci`
- [ ] echtes Online-`npm ci` auf unverändertem Commit grün
- [ ] Integrity-/Installationsnachweis auf funktionierendem Runner
- [x] maschinenlesbares Asset-Provenienzmanifest vorhanden
- [x] Asset-/Media-/Reference-/Privacy-Audits integriert
- [x] PNG-IHDR-/Hash-/Manifestgrößenprüfung implementiert
- [ ] relevante Audits auf funktionierendem Runner tatsächlich grün
- [ ] `icon.svg` von `unresolved` auf belegten Rechte-Status gesetzt
- [ ] restlicher manueller Fan-/Marken-/Franchise-/Marketing-/Visualpass abgeschlossen
- [ ] erforderliche Attributionen/Notices final
- [ ] Projekt-/Quellcodelizenz bewusst entschieden, falls Quellcode öffentlich verteilt wird

Bis dahin bleibt der öffentliche Release **NO_GO**.
