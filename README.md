# Secret Circle Party Hub

Secret Circle ist eine **offline-first Partyspiel-Plattform für gemeinsame Spiele auf einem Gerät**. Der Januar-2027-Release priorisiert sichere private Übergaben, Wiederaufnahme nach Unterbrechungen, lokale Datenkontrolle, eigene Spiele und belastbare Release-Gates.

## Aktueller Funktionsumfang

- 45 eingebaute technisch spielbare Spiele
- 15 priorisierte Core-Games
- 13 Extended-Spiele
- 17 Labs-Modi
- 27 Quick-, Trend- und Viral-Modi
- 4 Advanced-Kernspiele
- Word Imposter
- Smart Party Night
- lokaler Spielerpool, Favoriten, Presets, Verlauf, Statistiken und Erfolge
- lokaler No-Code-Game-Creator mit 6 Vorlagen und bis zu 40 eigenen Spielen
- gespeicherte Filter und Synonym-/Tippfehlersuche
- gemeinsame Pause-/Skip-/Abbruch-/Replay-/Next-Game-Steuerung
- sichere Reload-Wiederaufnahme und pausierbare Timer
- installierbare Offline-PWA mit kontrollierter Aktualisierung
- kein verpflichtendes Konto, keine Analyse-, Werbe- oder Trackingdienste

„Technisch spielbar“ bedeutet **nicht automatisch releasefertig**.

## Releaseziel

- funktionsfertig bis **30. November 2026**
- Code Freeze **5. Dezember 2026**
- Release Candidate bis **15. Dezember 2026**
- öffentlicher Release **4.–15. Januar 2027**

Aktueller Offline-Core: **`secret-circle-v42`**.  
Classic Content: **v4**.

## Produktpositionierung

Der Fokus liegt nicht nur auf „viele Spiele + offline + ein Gerät“, sondern auf einem zusammenhängenden Party-Hub mit 15 priorisierten Core-Games, sicheren geheimen Pass-and-Play-Zuständen, Resume nach Reload, lokaler Datenkontrolle und eigenen Spielen über den Creator.

Persönliche Inhalte sind freiwillig. Überspringen ist jederzeit erlaubt und muss nicht begründet werden.

## Zentrale A-bis-Z-Unterlagen

### Master und Status

- `APP_ENTWICKLUNG_VON_A_BIS_Z.md`
- `APP_DEVELOPMENT_STATUS.md`
- `RELEASE_STATUS.md`
- `ROADMAP_2027.md`
- `RELEASE_SCOPE_2027.md`
- `RELEASE_CHECKLIST.md`

### Produkt, UX und Architektur

- `PRODUCT_BRIEF.md`
- `USER_SCENARIOS.md`
- `MARKET_RESEARCH.md`
- `PLATFORM_STRATEGY.md`
- `REQUIREMENTS.md`
- `UX_FLOW.md`
- `DESIGN_SYSTEM.md`
- `ARCHITECTURE.md`
- `ENVIRONMENTS.md`

### Security, Daten und PWA

- `SECURITY.md`
- `THREAT_MODEL.md`
- `RISK_REGISTER.md`
- `BACKUP_SCHEMAS.md`
- `DEPLOYMENT.md`

### Content, Rechte und Accessibility

- `CONTENT_AGE_POLICY.md`
- `CORE_CONTENT_REVIEW.md`
- `FAN_CONTENT_REVIEW.md`
- `THIRD_PARTY_NOTICES.md`
- `CORE_GAME_ACCEPTANCE.md`
- `CORE_SCORING_RULES.md`
- `ACCESSIBILITY.md`
- `BETA_TEST_PLAN.md`

### Betrieb

- `LEGAL_CHECKLIST.md`
- `SUPPORT.md`
- `INCIDENT_RESPONSE.md`
- `MAINTENANCE.md`

## Core-Content

Die drei Ausbauwellen haben die definierten quantitativen Ziele erreicht. `CORE_CONTENT_REVIEW.md` enthält den ersten **15/15-Core-Quellpass**. Reale Gruppen, finale Semantik-/Altersfreigabe und Runnernachweis bleiben offen.

## Reference-Safe-Content

### v36 – Word Imposter

- Bluetooth → Funkverbindung
- Oscar → Filmpreis
- Formel 1 → Motorsport

### v37/v40 – Anime-Quiz

Für die stabile ID `anime-guess` wurde **Option B** umgesetzt. `party-mega-catalog.js` und der finale Runtime-Katalog liefern **Anime-Archetypen erraten** mit vier generischen Packs und 40 eigenständigen Archetypen. Die früheren 40 konkreten Anime-/Mangafiguren sind seit v40 auch physisch aus der ausgelieferten Mega-Quelle entfernt.

### v38 – Viral Sport

Drei unnötig konkrete olympisch/Grand-Slam-bezogene Formulierungen wurden durch neutrale Fragen ersetzt, ohne die Zahlenwerte 5 / 8 / 3 zu verändern.

### v41 – physischer Source-Vertrag

- stabile technische ID `wavelength`, sichtbarer Titel upstream **Spektrum-Tipp**
- Browser-Tabu enthält upstream `Tab` statt `Chrome`
- Emoji-Quiz enthält `🦁🌾 → Löwe` statt `Löwenkönig`
- `party-core-classic-content.js` auf **v4** vereinfacht
- `scripts/reference_content_audit.py` scannt acht ausgelieferte Contentquellen
- der Source-Audit ist Teil von `npm run validate`
- Core-, Architektur- und Release-Audits verlangen denselben Source-Level-Vertrag

Diese neuen Tests/Audits sind **implementiert, aber wegen des aktuellen Actions-Runnerproblems noch nicht belastbar als grün ausgeführt dokumentiert**.

## PWA-Asset-Hardening – v42

Bei der Asset-Prüfung wurde ein echter PWA-Fehler gefunden:

- `icon-192.png` fehlte vollständig
- die bisherige Datei `icon-512.png` war laut PNG-IHDR tatsächlich nur 192×192 Pixel
- das Webmanifest deklarierte trotzdem 192×192 und 512×512

v42 repariert den Vertrag:

- `icon-192.png` ist jetzt ein echtes 192×192-PNG
- `icon-512.png` ist jetzt ein echtes 512×512-PNG
- beide Raster sind deterministisch aus `icon.svg` erzeugt
- `asset-provenance.json` dokumentiert Ableitung, Werkzeug und SHA-256
- `scripts/asset_provenance_audit.py` prüft Datei-Existenz, SHA-256, PNG-Signatur/IHDR und Webmanifest-Größen
- Service Worker und Offline-Test verlangen alle drei Icondateien

Die Git-Historie belegt, dass das aktuelle `icon.svg` am **2. August 2026** in Commit `c183d439882bf3f25a5577e3867b76b4f930e84c` neu ins Repository kam. Das beweist **nicht automatisch** Urheberrecht oder kommerzielle Nutzungsrechte. Die finale Rechtebasis des SVG bleibt deshalb bewusst `unresolved`.

## Session-, Resume- und Timergrundlage

- stabile Session- und Completion-IDs
- Exact-once-Verlauf/Statistik
- direkte Hub-Session `secret-circle-party-hub-active-v1`
- Advanced `secret-circle-party-active-v1`
- private Inhalte nach Reload wieder verdeckt
- **Beenden & speichern** getrennt von **Abbrechen & verwerfen**
- Skip ohne künstlichen Punkt
- gemeinsame pausierbare Sessionsteuerung
- Scharade 60 s, Tabu 60 s, Hot Potato 10–25 s verdeckt, Wortkette 30 s

## Backup- und Datenvertrag

`backup-schema-registry.js` ist Registry **v2**.

- maximale Backupdatei 1.500.000 UTF-8-Bytes
- Complete-Backup-Format/Grenzen zentral
- nur registrierte Word-Imposter- und `secret-circle-party-*`-Key-Familien importierbar
- unbekannte Secret-Circle-Namespaces werden abgelehnt
- vollständiges Löschen entfernt bewusst alle `secret-circle-*`-Reste
- Registry wird vor `party-data-tools.js` geladen

## PWA und Offline

Aktuell:

- `secret-circle-v42`
- `secret-circle-v42-staging`

Updates werden zuerst vollständig in einem Staging-Cache vorbereitet und erst nach sichtbarer Nutzerentscheidung aktiviert. Der aktive Offline-Core wird vor erfolgreicher Promotion nicht destruktiv entfernt.

`ENVIRONMENTS.md` verlangt getrennte Origins für HTTPS-Staging und Production.

## Accessibility und Beta

Vorbereitet sind `ACCESSIBILITY.md`, `tests/accessibility-contract.test.js`, `tests/e2e/accessibility-core.spec.js` sowie `BETA_TEST_PLAN.md` mit G1–G5, PN1–PN3, Android/iPhone/Tablet, VoiceOver/TalkBack, echten PWA-Upgrades und einer HTTPS-Rollbackprobe.

Real offen: 200-%-Zoom, VoiceOver, TalkBack, private Reveal-Flows, Touchbedienung, Geräte- und Gruppentests.

## Third Party und Assetrechte

- keine npm-Runtime-Dependencies
- `@playwright/test` 1.54.2 upstream als **Apache-2.0** verifiziert
- transitive Inventur wartet auf `package-lock.json`
- `assets/manifests/asset-provenance.json` inventarisiert Releaseassets
- `icon-192.png` und `icon-512.png`: technische Ableitung und Dimensionen seit v42 belegt
- `icon.svg`: Repository-Herkunft dokumentiert, finale Rechtebasis noch **`unresolved`**
- `scripts/asset_provenance_audit.py`, `scripts/reference_content_audit.py` und `scripts/public_release_placeholder_audit.py` sind in `npm run validate`
- keine Root-`LICENSE`; Projektlizenz wird nicht geraten

## Lokal starten

```bash
python -m http.server 8080
```

- Party Hub: `http://localhost:8080/party.html`
- Word Imposter: `http://localhost:8080/index.html`
- Creator: `http://localhost:8080/creator.html`
- Advanced: `http://localhost:8080/advanced.html?game=question-imposter`
- Quick/Trend/Viral: `http://localhost:8080/quick-play.html?game=guess-the-price`

## Qualitätsbefehle – Übergangszustand

Solange kein echtes Lockfile vorliegt:

```bash
npm install --ignore-scripts --no-audit --no-fund --package-lock=false
npx playwright install --with-deps chromium
npm run ci
```

Cross-Browser:

```bash
npx playwright install --with-deps chromium firefox webkit
npm run test:cross-browser
```

Final vor Release muss ein echtes `package-lock.json` vorhanden sein und CI auf `npm ci` laufen.

## Aktuelle Blocker

### P0 – GitHub Actions

Der zuletzt belastbar untersuchte Lauf **#2126** endete erneut vor einem Repository-Step: `validate` = failure, `steps: []`, kein Checkout und kein verwertbarer Job-Log. Deshalb existiert kein verlässlicher grüner `npm run ci`-/Playwright-/Cross-Browser-Nachweis für den aktuellen v42-Stand.

### P1

- echtes `package-lock.json` + `npm ci`
- Branch Protection / Required Checks
- Reference-Source- und Asset-Provenienz-Audit tatsächlich grün ausführen
- finale Rechtebasis für `icon.svg`
- manueller Extended/Labs-/Marketing-/Visual-Rechtepass
- konkrete HTTPS-Staging-Origin
- reale PWA-Upgrades/Rollback und Installationsicon-Prüfung
- Android/iPhone/Tablet
- VoiceOver/TalkBack/200 %
- reale Gruppentests
- Betreiber-/Support-/Hostingangaben
- finaler Rechte-/Content-Sign-off

## Freigabestatus

- öffentlicher Release: **NO_GO**
- PR #13: **Draft, nicht mergen**
- kontrollierte Entwicklungsbeta: möglich
- Releaseziel Januar 2027: weiter erreichbar, wenn externe und reale Gates rechtzeitig geschlossen werden
