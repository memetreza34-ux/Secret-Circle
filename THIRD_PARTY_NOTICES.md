# Secret Circle – Third-Party-, Lizenz- und Asset-Inventar

Stand: 19. August 2026  
Status: **IN PROGRESS – Rasterherkunft belegt; Root-SVG-Rechte und finale Rechteprüfung offen**

## 1. Zweck

Dieses Dokument inventarisiert externe Software, gebündelte Assets, Referenzcontent und eigene Projektbestandteile, die vor dem Januar-2027-Release auf Herkunft und Nutzungsrechte geprüft werden müssen.

Ein Eintrag ohne belegte Rechtebasis wird **nicht** automatisch als eigenes Werk behandelt.

## 2. Runtime-Abhängigkeiten

`package.json` enthält derzeit **keine npm-Runtime-Dependencies**. Die Production-PWA lädt außerdem keine externen JavaScript-CDNs, Webfonts, Analyse-/Werbe-SDKs oder Remote-Spielassets.

## 3. Entwicklungsabhängigkeiten

| Paket | Version | Verwendung | Production Runtime? | Upstream-Lizenz | Status |
|---|---:|---|---|---|---|
| `@playwright/test` | `1.54.2` | E2E-/Cross-Browser-Tests | Nein | **Apache-2.0** | **UPSTREAM VERIFIED** |

Direkt im offiziellen `microsoft/playwright`-Repository am Tag `v1.54.2` geprüft:

- Paketversion exakt 1.54.2
- Autor Microsoft Corporation
- Lizenzfeld Apache-2.0
- Root-LICENSE Apache License 2.0
- NOTICE mit Microsoft-Hinweis und Hinweis auf abgeleiteten Puppeteer-Code

Noch offen: Ohne `package-lock.json` existiert kein reproduzierbarer transitive Dependency-Snapshot.

## 4. Maschinenlesbare Asset-Provenienz

Verbindlich:

`assets/manifests/asset-provenance.json`

Schema-Version: **1**.

`scripts/asset_provenance_audit.py` ist Teil von `npm run validate` und prüft seit v42:

- jeder inventarisierte Pfad existiert
- keine doppelten Pfade
- nur erlaubte Statuswerte
- alle drei aktuellen Release-Icons besitzen einen Manifest-Eintrag
- `derivedFrom` zeigt nur auf bekannte Manifest-Einträge
- vorhandene SHA-256-Werte stimmen mit den Dateien überein
- `icon-192.png` besitzt tatsächlich 192×192-IHDR
- `icon-512.png` besitzt tatsächlich 512×512-IHDR
- `manifest.webmanifest` deklariert dieselben Rastergrößen und MIME-Typen
- ein Asset darf nicht als `verified-own` oder `verified-third-party` markiert werden, wenn Creator, Quelle, Rechtebasis/Lizenz oder kommerzielle Nutzung fehlen

Der Validator darf `unresolved` während der Entwicklung akzeptieren, meldet dann aber `final_asset_signoff: BLOCKED`. Dadurch bleibt die tatsächliche offene Rechtefrage sichtbar, ohne Entwicklungsaudits durch erfundene Angaben zu umgehen.

## 5. Aktuelle App-Assets

### Gefundener technischer Fehler und Reparatur v42

Vor v42 war der PWA-Rastervertrag inkonsistent:

- `icon-192.png` fehlte auf dem Branch vollständig
- die Datei namens `icon-512.png` besaß tatsächlich nur 192×192 Pixel
- `manifest.webmanifest` behauptete trotzdem 192×192 und 512×512

v42 repariert das:

| Datei | Technischer Nachweis | Rechte-Status |
|---|---|---|
| `icon.svg` | Git-Historie: am 2. August 2026 in Commit `c183d439882bf3f25a5577e3867b76b4f930e84c` neu angelegt | `unresolved` |
| `icon-192.png` | echtes 192×192-PNG, am 19. August 2026 aus `icon.svg` mit CairoSVG 2.8.2 erzeugt; SHA-256 `fbf17eb36a6dc9af8c73df1feede3cfbbf04ff1b66048aad7d81e0dd9c77590f` | `unresolved`, Ableitung technisch belegt |
| `icon-512.png` | echtes 512×512-PNG, am 19. August 2026 aus `icon.svg` mit CairoSVG 2.8.2 erzeugt und mit Pillow 12.3.0 PNG-optimiert; SHA-256 `deea4ccb390c71b46f9a53f328682789c1bd56eef872bda692dcfae01230306c` | `unresolved`, Ableitung technisch belegt |

Der Commit `c183d439...` ist dem Repo-Eigentümer zugeordnet und enthält den Untertext `design: add Secret Circle app icon`. Das belegt **Repository-Herkunft und Zeitpunkt**, aber noch nicht automatisch die urheberrechtliche Rechtebasis, mögliche Template-/KI-/Stock-Nutzung oder kommerzielle Nutzungsrechte des SVG.

Deshalb bleibt bewusst offen:

- wer das zugrunde liegende SVG tatsächlich gestaltet hat
- ob externe Vorlage, KI-, Template- oder Stock-Werkzeuge beteiligt waren
- welche Rechtebasis für kommerzielle Veröffentlichung gilt
- ob Attribution erforderlich ist

Sobald dies menschlich bestätigt ist, kann `icon.svg` auf einen belegten Status gesetzt werden; die Rasterableitungen können danach dieselbe Rechtebasis erben.

## 6. Gebündeltes Media-Inventar

Der aktuelle Working-Branch-Tree wurde zusätzlich nach gebündelten Medienformaten geprüft. Als tatsächliche Release-Mediendateien wurden nur diese drei Dateien identifiziert:

1. `icon.svg`
2. `icon-192.png`
3. `icon-512.png`

Im geprüften Branch wurden **keine weiteren tatsächlichen** JPG/JPEG/WebP/GIF/AVIF/ICO-, MP3/WAV/OGG/M4A/FLAC- oder MP4/WebM/MOV-Dateien gefunden. Textliche Erwähnungen von Dateiendungen in Code/Dokumentation zählen dabei nicht als Mediendateien.

Neu verbindlich:

`scripts/media_inventory_audit.py`

Der Audit:

- scannt tatsächliche Dateien nach Raster-, Vektor-, Audio- und Videoendungen
- ignoriert technische Laufzeitordner wie `node_modules`, `.git`, Playwright-/Coverage-Ausgaben
- verlangt, dass jede gefundene Mediendatei im Provenienzmanifest steht
- blockiert verwaiste Media-Provenienzeinträge
- hält den aktuellen Release-Medienvertrag ausdrücklich auf genau den drei Icondateien
- zwingt bei jeder später neu hinzugefügten Bild-/Audio-/Videodatei zu einer bewussten Inventar- und Rechteentscheidung

Zusätzlich prüft `tests/manifest-icons.test.js` Manifestmetadaten, Dateiexistenz, PNG-Signatur/IHDR, SVG-ViewBox und Offline-Core-Einbindung. Beide neuen Gates sind in `package.json` integriert, aber wegen des aktuellen Actions-Runnerproblems noch **nicht tatsächlich runner-verifiziert**.

## 7. Emoji und Systemglyphen

Im UI stehen Unicode-Emoji-Zeichen. Secret Circle bündelt dafür keine eigene Emoji-Fontdatei; Darstellung erfolgt durch Browser/Betriebssystem. Ein späterer Export von Emoji-Glyphen als eigene Bildassets würde eine neue Rechteprüfung auslösen.

## 8. Built-in- und Referenzcontent

### Core

`CORE_CONTENT_REVIEW.md` dokumentiert den 15/15-Core-Quellpass. Word Imposter verwendet nach v36 generische Ersatzbegriffe statt drei unnötig konkreter Referenzen.

### Anime-/Fan-Bezug

`FAN_CONTENT_REVIEW.md` dokumentiert Option B für `anime-guess`: `party-mega-catalog.js` und der finale Runtime-Katalog liefern nur **Anime-Archetypen erraten** mit 40 generischen Archetypen. Die 40 früheren konkreten Figuren wurden seit v40 auch physisch aus der ausgelieferten Mega-Katalogdatei entfernt.

Keine konkreten Charakterbilder, Logos, Screenshots, Audio-/Videodateien oder Zitate sind vorgesehen.

### Weitere Source-Bereinigung v41

- `Wellenlänge` → **Spektrum-Tipp** direkt upstream in `party-expansion.js`
- Browser-Tabu `Chrome` → `Tab` direkt upstream
- `Löwenkönig` → generischer Emoji-Quiz-Hinweis `🦁🌾 → Löwe`
- Classic Content v4 benötigt nur noch die zwei Privacy-Textkorrekturen als editoriale Ersetzungen

### Zentraler Referenz-Audit

`scripts/reference_content_audit.py` ist Teil von `npm run validate` und scannt acht tatsächlich ausgelieferte Contentquellen. Er blockiert die bereits bewusst entfernten konkreten Referenzen und erzwingt bei ausgewählten hochprofiligen Plattform-/Franchise-Namen eine neue Review-Entscheidung.

Dieser Audit ist wegen des aktuellen Actions-Runnerproblems **noch nicht tatsächlich runner-verifiziert**.

### Viral

v38 ersetzt drei unnötig konkrete Sport-/Eventformulierungen durch generische Fragen mit identischen Zahlenwerten.

Der restliche manuelle Extended-/Labs-/Marketing-/Visualpass bleibt offen.

## 9. Zukünftige Designassets

`ASSET_PLAN.md` beschreibt Navigationsicons, Mechanikicons, Illustrationen, Hintergründe und Motionassets.

Ab jetzt gilt: Ein neues gebündeltes Release-Asset wird **im selben Arbeitsblock** in `assets/manifests/asset-provenance.json` inventarisiert. Kein „später nachtragen“ als Standardprozess. Der Media-Inventar-Audit erzwingt dies zusätzlich für typische Bild-/Audio-/Videoformate.

## 10. Projektlizenz / Quellcodefreigabe

Es existiert weiterhin keine Root-Datei `LICENSE`.

Das bedeutet nicht automatisch, dass eine Open-Source-Lizenz benötigt wird. Vor öffentlicher Quellcodeverteilung muss bewusst entschieden werden, ob der Code proprietär/nicht zur Weiterverwendung lizenziert bleibt oder unter eine konkrete Open-Source-Lizenz gestellt wird.

Der frühere konkrete Anime-Basisblock wurde aus `party-mega-catalog.js` entfernt. Eine spätere öffentliche Quellcodeverteilung benötigt trotzdem eine bewusste Projektlizenzentscheidung und einen finalen Source-/Asset-/Dependency-Review.

## 11. Hosting- und Plattformkomponenten

Nach Auswahl der Production-Plattform prüfen:

- Hosting-AGB
- Datenschutz-/Logverarbeitung
- Build-/Deploy-Actions
- erforderliche License-/NOTICE-/Attribution-Pflichten

## 12. Release-Gates

Vor `THIRD-PARTY / ASSET PASS`:

- [ ] `package-lock.json` vorhanden und vollständiger Dependencybestand verifiziert
- [x] direkte Dev-Dependency `@playwright/test` 1.54.2 / Apache-2.0 verifiziert
- [ ] transitive Dependencies aus finalem Lockfile inventarisiert
- [x] maschinenlesbares Asset-Provenienzmanifest vorhanden
- [x] Asset-Provenienzvalidator in `npm run validate`
- [x] Media-Inventar-Audit in `npm run validate`
- [x] dedizierter Manifest-/Icon-Unit-Test in `npm test` und Syntax-Gate
- [x] aktueller Branch-Medienbestand auf drei Icondateien eingegrenzt
- [x] PNG-IHDR-/Hash-/Manifestgrößenprüfung implementiert
- [x] `icon-192.png` physisch vorhanden und 192×192
- [x] `icon-512.png` physisch vorhanden und 512×512
- [x] Rasterableitungen aus `icon.svg` technisch dokumentiert
- [x] physischer Reference-Source-Audit in `npm run validate`
- [x] konkreter historischer Anime-Basisblock aus ausgelieferter Mega-Quelle entfernt
- [ ] Media-Inventar-/Asset-Provenienz-/Manifest-Icon-Gates auf funktionierendem Runner tatsächlich grün
- [ ] Reference-Source-Audit auf funktionierendem Runner tatsächlich grün
- [ ] `icon.svg` von `unresolved` auf belegten Rechte-Status gesetzt
- [ ] alle späteren Releaseassets inventarisiert und belegt
- [ ] restlicher manueller Fan-/Marken-/Franchise-/Marketing-/Visualpass abgeschlossen
- [ ] keine fremden Logos/Screenshots/Audios/Videos ohne Freigabe
- [ ] erforderliche Attributionen/Notices final
- [ ] Projekt-/Quellcodelizenz bewusst entschieden, falls Quellcode öffentlich verteilt wird

Bis dahin bleibt R-029 **OFFEN** und der öffentliche Release **NO_GO**.
