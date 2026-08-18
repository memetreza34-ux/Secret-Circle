# Secret Circle – Third-Party-, Lizenz- und Asset-Inventar

Stand: 18. August 2026  
Status: **IN PROGRESS – Assetherkunft und finale Rechteprüfung offen**

## 1. Zweck

Dieses Dokument inventarisiert externe Software, gebündelte Assets, Referenzcontent und eigene Projektbestandteile, die vor dem Januar-2027-Release auf Herkunft und Nutzungsrechte geprüft werden müssen.

Ein Eintrag ohne belegte Herkunft wird **nicht** automatisch als eigenes Werk behandelt.

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

`scripts/asset_provenance_audit.py` ist Teil von `npm run validate` und prüft:

- jeder inventarisierte Pfad existiert
- keine doppelten Pfade
- nur erlaubte Statuswerte
- alle drei aktuellen Release-Icons besitzen einen Manifest-Eintrag
- `derivedFrom` zeigt nur auf bekannte Manifest-Einträge
- ein Asset darf nicht als `verified-own` oder `verified-third-party` markiert werden, wenn Creator, Quelle, Rechtebasis/Lizenz oder kommerzielle Nutzung fehlen

Der Validator darf `unresolved` während der Entwicklung akzeptieren, meldet dann aber `final_asset_signoff: BLOCKED`. Dadurch bleibt die tatsächliche offene Rechtefrage sichtbar, ohne Entwicklungsaudits durch erfundene Angaben zu umgehen.

## 5. Aktuelle App-Assets

| Datei | Manifeststatus | Release-Status |
|---|---|---|
| `icon.svg` | `unresolved` | **BLOCKED FOR FINAL SIGN-OFF** |
| `icon-192.png` | `unresolved`, `derivedFrom: icon.svg` | **BLOCKED FOR FINAL SIGN-OFF** |
| `icon-512.png` | `unresolved`, `derivedFrom: icon.svg` | **BLOCKED FOR FINAL SIGN-OFF** |

Vor RC müssen echte Angaben ergänzt werden:

- Urheber/Ersteller
- Quelle/Originaldatei
- Erstellungsdatum oder Projektkontext, soweit verfügbar
- Lizenz/Rechtebasis beziehungsweise belegte Eigenproduktion
- KI-/Template-/Stock-Werkzeug, falls beteiligt
- kommerzielle Nutzbarkeit
- Attribution, falls erforderlich

Aus SVG-Code oder visueller Ähnlichkeit allein lässt sich die Rechtekette nicht beweisen.

## 6. Emoji und Systemglyphen

Im UI stehen Unicode-Emoji-Zeichen. Secret Circle bündelt dafür keine eigene Emoji-Fontdatei; Darstellung erfolgt durch Browser/Betriebssystem. Ein späterer Export von Emoji-Glyphen als eigene Bildassets würde eine neue Rechteprüfung auslösen.

## 7. Built-in- und Referenzcontent

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

## 8. Zukünftige Designassets

`ASSET_PLAN.md` beschreibt Navigationsicons, Mechanikicons, Illustrationen, Hintergründe und Motionassets.

Ab jetzt gilt: Ein neues gebündeltes Release-Asset wird **im selben Arbeitsblock** in `assets/manifests/asset-provenance.json` inventarisiert. Kein „später nachtragen“ als Standardprozess.

## 9. Projektlizenz / Quellcodefreigabe

Es existiert weiterhin keine Root-Datei `LICENSE`.

Das bedeutet nicht automatisch, dass eine Open-Source-Lizenz benötigt wird. Vor öffentlicher Quellcodeverteilung muss bewusst entschieden werden, ob der Code proprietär/nicht zur Weiterverwendung lizenziert bleibt oder unter eine konkrete Open-Source-Lizenz gestellt wird.

Der frühere konkrete Anime-Basisblock wurde aus `party-mega-catalog.js` entfernt. Eine spätere öffentliche Quellcodeverteilung benötigt trotzdem eine bewusste Projektlizenzentscheidung und einen finalen Source-/Asset-/Dependency-Review.

## 10. Hosting- und Plattformkomponenten

Nach Auswahl der Production-Plattform prüfen:

- Hosting-AGB
- Datenschutz-/Logverarbeitung
- Build-/Deploy-Actions
- erforderliche License-/NOTICE-/Attribution-Pflichten

## 11. Release-Gates

Vor `THIRD-PARTY / ASSET PASS`:

- [ ] `package-lock.json` vorhanden und vollständiger Dependencybestand verifiziert
- [x] direkte Dev-Dependency `@playwright/test` 1.54.2 / Apache-2.0 verifiziert
- [ ] transitive Dependencies aus finalem Lockfile inventarisiert
- [x] maschinenlesbares Asset-Provenienzmanifest vorhanden
- [x] Asset-Provenienzvalidator in `npm run validate`
- [x] physischer Reference-Source-Audit in `npm run validate`
- [x] konkreter historischer Anime-Basisblock aus ausgelieferter Mega-Quelle entfernt
- [ ] Reference-Source-Audit auf funktionierendem Runner tatsächlich grün
- [ ] `icon.svg` von `unresolved` auf belegten Status gesetzt
- [ ] `icon-192.png` Herkunft/Ableitung belegt
- [ ] `icon-512.png` Herkunft/Ableitung belegt
- [ ] alle späteren Releaseassets inventarisiert und belegt
- [ ] restlicher manueller Fan-/Marken-/Franchise-/Marketing-/Visualpass abgeschlossen
- [ ] keine fremden Logos/Screenshots/Audios/Videos ohne Freigabe
- [ ] erforderliche Attributionen/Notices final
- [ ] Projekt-/Quellcodelizenz bewusst entschieden, falls Quellcode öffentlich verteilt wird

Bis dahin bleibt R-029 **OFFEN** und der öffentliche Release **NO_GO**.
