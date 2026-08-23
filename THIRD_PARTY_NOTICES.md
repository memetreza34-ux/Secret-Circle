# Secret Circle – Third-Party-, Lizenz- und Asset-Inventar

Stand: 23. August 2026  
Status: **IN PROGRESS – npm-Snapshot vorhanden; Root-SVG-Rechte und reale Verifikation offen**

## 1. Zweck

Dieses Dokument inventarisiert externe Software, gebündelte Assets, Referenzcontent und eigene Projektbestandteile, die vor dem Januar-2027-Release auf Herkunft und Nutzungsrechte geprüft werden müssen.

Ein Eintrag ohne belegte Rechtebasis wird **nicht** automatisch als eigenes Werk behandelt.

Für die aktuelle App-Icon-Rechtefrage existiert jetzt zusätzlich `ASSET_RIGHTS_SIGNOFF.md`. Dieses Dokument definiert die erforderliche menschliche Bestätigung, bevor `unresolved` auf einen verifizierten Status geändert werden darf.

## 2. Runtime-Abhängigkeiten

`package.json` enthält weiterhin **keine npm-Runtime-Dependencies**. Die Production-PWA lädt außerdem keine externen JavaScript-CDNs, Webfonts, Analyse-/Werbe-SDKs oder Remote-Spielassets.

## 3. Reproduzierbarer npm-Snapshot

`package-lock.json` liegt im Lockfile-Format **v3** vor. Der Snapshot umfasst nur die Entwicklungs-Testkette:

| Paket | Version | Rolle | Lizenz | Runtime der Production-PWA? |
|---|---:|---|---|---|
| `@playwright/test` | `1.54.2` | direkte Dev-Dependency / Test Runner | Apache-2.0 | Nein |
| `playwright` | `1.54.2` | Dependency von `@playwright/test` | Apache-2.0 | Nein |
| `playwright-core` | `1.54.2` | Dependency von `playwright` | Apache-2.0 | Nein |
| `fsevents` | `2.3.2` | optionale macOS-Dependency von `playwright` | MIT | Nein |

Der dokumentierte Dependency-Snapshot wird durch `scripts/lockfile_contract_audit.py` gegen `package.json`/`package-lock.json` geschützt. CI und Cross-Browser verwenden `npm ci`.

Noch offen:

- `npm ci` mit erreichbarer Registry auf echtem Runner
- tatsächlicher Installations-/Integrity-Nachweis auf unverändertem Commit
- danach vollständiges CI und Cross-Browser auf demselben Commit

## 4. Maschinenlesbare Asset-Provenienz

Verbindlich: `assets/manifests/asset-provenance.json`, Schema-Version **1**.

`scripts/asset_provenance_audit.py` prüft unter anderem:

- Datei-Existenz
- erlaubte Provenienzstatus
- SHA-256
- PNG-IHDR/Dimensionen
- Manifestgrößen
- `derivedFrom`-Beziehungen
- erforderliche Rechtefelder für verifizierte Assets

Erlaubte Statuswerte:

- `unresolved`
- `verified-own`
- `verified-third-party`

`unresolved` ist während der Entwicklung zulässig, blockiert aber den finalen Asset-Sign-off.

## 5. Aktuelle App-Assets

| Datei | Technischer Nachweis | Rechte-Status |
|---|---|---|
| `icon.svg` | Git-Historie: am 2. August 2026 in Commit `c183d439882bf3f25a5577e3867b76b4f930e84c` neu angelegt | `unresolved` |
| `icon-192.png` | echtes 192×192-PNG, aus `icon.svg`; Hash/Dimension dokumentiert | `unresolved`, Ableitung technisch belegt |
| `icon-512.png` | echtes 512×512-PNG, aus `icon.svg`; Hash/Dimension dokumentiert | `unresolved`, Ableitung technisch belegt |

Repository-Herkunft beweist **nicht automatisch** Urheberrecht oder kommerzielle Nutzungsrechte. Offen bleiben insbesondere Ersteller/Rechteinhaber, möglicher externer Vorlagen-/Stock-/KI-Workflow, kommerzielle Rechtebasis und eventuelle Attribution.

### Neuer Sign-off-Pfad

`ASSET_RIGHTS_SIGNOFF.md` verlangt vor `verified-own` bzw. `verified-third-party` eine konkrete Dokumentation zu:

- Ersteller/Rechteinhaber
- Erstellungsweg
- externer Vorlage ja/nein
- Quelle/Lizenz bei externer Vorlage
- KI-/Tool-Workflow, falls relevant
- kommerzieller Nutzung
- Attribution
- bestätigender Person und Datum

Ohne diese Bestätigung bleibt das Manifest unverändert `unresolved`.

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

`CORE_CONTENT_REVIEW.md` dokumentiert den 15/15-Core-Quellpass. `CORE_GAME_ACCEPTANCE.md` dokumentiert zusätzlich den 15/15-Core-Hardening-Pass. Frühere Private-Device-Prompts wurden physisch aus dem Runtime-Content entfernt; Privacy-Audits schützen die ausgelieferten Contentquellen.

### Fan-/Referenzcontent

- Word Imposter verwendet generische Ersatzbegriffe für frühere unnötige konkrete Referenzen.
- `anime-guess` liefert **Anime-Archetypen erraten** mit generischen Archetypen.
- `Wellenlänge` ist sichtbar **Spektrum-Tipp**.
- Browser-Tabu verwendet `Tab` statt konkreter Browsermarke.
- frühere konkrete Unterhaltungs-/Eventformulierungen wurden generisch ersetzt.
- `scripts/reference_content_audit.py` schützt ausgelieferte Contentquellen.

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
- [x] npm-Entwicklungsabhängigkeiten inventarisiert
- [x] reproduzierbarer Lockfile-/Dependency-Vertrag vorhanden
- [x] normaler CI- und Cross-Browser-Workflow verwenden `npm ci`
- [ ] echtes Online-`npm ci` auf unverändertem Commit grün
- [ ] Integrity-/Installationsnachweis auf funktionierendem Runner
- [x] maschinenlesbares Asset-Provenienzmanifest vorhanden
- [x] Asset-/Media-/Reference-/Privacy-Audits integriert
- [x] PNG-IHDR-/Hash-/Manifestgrößenprüfung implementiert
- [x] explizites `ASSET_RIGHTS_SIGNOFF.md` vorhanden
- [ ] relevante Audits auf funktionierendem Runner tatsächlich grün
- [ ] menschlicher Icon-Rechte-Sign-off vollständig
- [ ] `icon.svg` von `unresolved` auf belegten Rechte-Status gesetzt oder ersetzt
- [ ] PNG-Ableitungen entsprechend verifiziert/neu erzeugt
- [ ] restlicher manueller Fan-/Marken-/Franchise-/Marketing-/Visualpass abgeschlossen
- [ ] erforderliche Attributionen/Notices final
- [ ] Projekt-/Quellcodelizenz bewusst entschieden, falls Quellcode öffentlich verteilt wird

Bis dahin bleibt der öffentliche Release **NO_GO**.
