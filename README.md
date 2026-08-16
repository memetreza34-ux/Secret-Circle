# Secret Circle Party Hub

Secret Circle ist eine **offline-first Partyspiel-Plattform für gemeinsame Spiele auf einem Gerät**. Der Januar-2027-Release priorisiert nicht nur Funktionsmenge, sondern sichere private Übergaben, Wiederaufnahme nach Unterbrechungen, lokale Datenkontrolle, eigene Spiele und belastbare Release-Gates.

## Aktueller Funktionsumfang

- 45 eingebaute technisch spielbare Spiele
- 15 priorisierte Kernspiele
- 13 Extended-Spiele
- 17 Labs-Modi
- 27 Quick-, Trend- und Viral-Modi
- 4 Advanced-Kernspiele
- Word Imposter
- Smart Party Night
- gemeinsamer lokaler Spielerpool
- Favoriten, Presets, Verlauf, Statistiken und Erfolge
- lokaler No-Code-Game-Creator mit 6 Vorlagen
- bis zu 40 selbst erstellte Spiele
- gespeicherte Katalogfilter und letzte Hub-Ansicht
- Synonym-/Tippfehlersuche mit ARIA-/Tastaturunterstützung
- gemeinsame Pause-/Skip-/Abbruch-/Replay-/Next-Game-Steuerung
- pausierbare Timer und sichere Reload-Wiederaufnahme
- installierbare Offline-PWA
- sichtbare, kontrollierte PWA-Aktualisierung
- kein verpflichtendes Konto
- keine Analyse-, Werbe- oder Trackingdienste

„Technisch spielbar“ bedeutet **nicht automatisch releasefertig**.

## Produktpositionierung

Der Hub soll nicht nur mit „viele Spiele + offline + ein Gerät“ konkurrieren. Der aktuelle Produktfokus liegt auf:

- einem zusammenhängenden Party-Hub statt isolierten Minispielen
- 15 besonders priorisierten Kernspielen
- sicheren geheimen Pass-and-Play-Zuständen
- Resume nach Reload/Unterbrechung
- lokaler Datenkontrolle ohne Konto/Cloudzwang
- eigenen Spielen über den lokalen Creator
- klarer Core/Extended/Labs-Reifegradtrennung

Persönliche Inhalte sind freiwillig. In relevanten Flows wird sichtbar kommuniziert, dass Überspringen jederzeit erlaubt ist und nicht begründet werden muss.

## Releaseziel

- funktionsfertig bis spätestens **30. November 2026**
- Code Freeze am **5. Dezember 2026**
- Release Candidate bis spätestens **15. Dezember 2026**
- öffentlicher Release zwischen **4. und 15. Januar 2027**

Aktueller Offline-Core: **`secret-circle-v35`**.

## Zentrale A-bis-Z-Unterlagen

### Master und Status

- `APP_ENTWICKLUNG_VON_A_BIS_Z.md` – vollständiger wiederverwendbarer App-Lifecycle
- `APP_DEVELOPMENT_STATUS.md` – operativer Secret-Circle-A-bis-Z-Tracker
- `RELEASE_STATUS.md` – aktueller Release-/Blockerstand
- `ROADMAP_2027.md` – Zeitplan
- `RELEASE_SCOPE_2027.md` – Core/Extended/Labs-Scope
- `RELEASE_CHECKLIST.md` – finale RC-/Production-Freigabe

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

### Content und Accessibility

- `CONTENT_AGE_POLICY.md`
- `CORE_CONTENT_REVIEW.md`
- `CORE_GAME_ACCEPTANCE.md`
- `CORE_SCORING_RULES.md`
- `ACCESSIBILITY.md`
- `BETA_TEST_PLAN.md`

### Recht und Betrieb

- `LEGAL_CHECKLIST.md`
- `THIRD_PARTY_NOTICES.md`
- `SUPPORT.md`
- `INCIDENT_RESPONSE.md`
- `MAINTENANCE.md`

## Spielekatalog und Reifestufen

Der Party Hub trennt:

- **Core:** höchste Januar-2027-Priorität
- **Extended:** spielbare Zusatzfunktionen
- **Labs:** experimentelle Modi

Filter kombinieren unter anderem Reifestufe, Altersstufe, Gruppe, Stimmung und Status. Direkte URL-Ansichten haben Vorrang vor der gespeicherten letzten Ansicht.

## Core-Content-Stand

Die drei redaktionellen Ausbauwellen haben die definierten quantitativen Ziele erreicht.

Beispiele:

- Truth/Dare: 24 je Pack
- Never Have / Most Likely / Would Rather: 24 je Pack
- Paranoia: 20 je Pack
- Charades: 30 je Pack
- Taboo: 24 je Pack
- Hot Potato: 20 je Pack
- Two Truths / Question Imposter / Location Spy: 16 je Pack
- Word Imposter: 14 × 12 Begriffe

`CORE_CONTENT_REVIEW.md` enthält den ersten **15/15-Core-Quellpass**. Das ist noch kein finaler Content-Pass: reale Gruppen, Rechte-/Markenprüfung und finaler redaktioneller Sign-off bleiben offen.

## Session-, Resume- und Timergrundlage

- stabile Session- und Completion-IDs
- Exact-once-Verlauf/Statistik
- direkte Hub-Session über `secret-circle-party-hub-active-v1`
- Advanced über `secret-circle-party-active-v1`
- private Inhalte werden nach Reload nicht automatisch geöffnet
- bewusstes **Beenden & speichern** getrennt von **Abbrechen & verwerfen**
- Skip vergibt keinen künstlichen Punkt
- `party-session-controls.js` liefert gemeinsame pausierbare Timer
- `party-hub-timers.js` besitzt die direkten Hub-Timermechaniken
- Scharade: 60 s
- Tabu: 60 s
- Hot Potato: zufällige 10–25 s, Restzeit bleibt verborgen
- Wortkette: 30 s

## Backup- und Datenvertrag

`backup-schema-registry.js` ist Registry **v2** und zentraler Vertragsmittelpunkt.

- drei registrierte Backupformate
- maximale Datei: 1.500.000 UTF-8-Bytes
- Complete-Backup-Runtime liest Format/Grenzen aus der Registry
- Complete-Import akzeptiert nur bekannte versionierte Word-Imposter- und `secret-circle-party-*`-Key-Familien
- unbekannte Secret-Circle-Namespaces werden abgelehnt
- vollständiges Löschen bleibt bewusst breiter und entfernt alle `secret-circle-*`-Reste
- `party.html` lädt die Registry vor `party-data-tools.js`

## PWA und Offline

Aktuell:

- `secret-circle-v35`
- `secret-circle-v35-staging`

Updates werden zuerst in einem Staging-Cache vorbereitet. Aktivierung erfolgt bewusst über den sichtbaren Updatehinweis. Der aktive Offline-Core wird vor erfolgreicher Promotion nicht destruktiv gelöscht.

`ENVIRONMENTS.md` verlangt für spätere reale Deployments getrennte Origins für HTTPS-Staging und Production, damit Service Worker und lokale Daten nicht kollidieren.

## Accessibility

Vorbereitet:

- semantische Struktur/Skip-Links
- sichtbarer Fokus
- 44px kritische Touchziele
- Reduced Motion
- ARIA-Autocomplete/Listbox
- `tests/accessibility-contract.test.js`
- `tests/e2e/accessibility-core.spec.js`
- 320-CSS-px-Reflow-Testbasis

Noch real erforderlich:

- 200-%-Zoom
- VoiceOver
- TalkBack
- private Reveal-Flows mit Screenreader
- reale Smartphone-/Tablet-Touchbedienung

## Beta- und Realtestplan

`BETA_TEST_PLAN.md` definiert:

- G1: 3–4 Personen
- G2: 5–8 Personen
- G3: 9–12 Personen
- G4: Mafia ab 8 Personen
- G5: Creator mit unerfahrener Person
- PN1–PN3: drei Smart-Party-Night-Abende
- Android / iPhone / Tablet
- VoiceOver / TalkBack / 200-%-Zoom
- zwei reale PWA-Upgrades
- HTTPS-Rollbackprobe

Diese Tests sind **vorbereitet, noch nicht durchgeführt**.

## Third Party und Assetrechte

`package.json` besitzt derzeit keine npm-Runtime-Dependencies. Dev-Dependency ist `@playwright/test` 1.54.2.

`THIRD_PARTY_NOTICES.md` hält bewusst offene Punkte fest:

- Herkunft/Lizenz von `icon.svg`
- Herkunft/Ableitung von `icon-192.png`
- Herkunft/Ableitung von `icon-512.png`
- finale Fan-/Marken-/Franchise-Prüfung
- bewusste Projektlizenzentscheidung, falls Quellcode öffentlich verteilt wird

Im Root wurde aktuell keine `LICENSE`-Datei gefunden. Es wird keine Lizenz oder Assetherkunft geraten.

## Lokal starten

Die App über HTTP statt direkt über `file://` öffnen:

```bash
python -m http.server 8080
```

Beispiele:

- Party Hub: `http://localhost:8080/party.html`
- Word Imposter: `http://localhost:8080/index.html`
- Creator: `http://localhost:8080/creator.html`
- Advanced: `http://localhost:8080/advanced.html?game=question-imposter`
- Quick/Trend/Viral: `http://localhost:8080/quick-play.html?game=guess-the-price`

## Qualitätsbefehle – aktueller Übergangszustand

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

**Final vor Release muss auf `package-lock.json` + `npm ci` umgestellt werden.**

## Aktuelle Blocker

### P0 – GitHub Actions

Neuester geprüfter Lauf: **Run #1905**.

- Job `validate`
- failure
- `steps: []`
- kein Checkout
- kein Repository-Code ausgeführt

Daher sind neue Tests/Audits **nicht als grün bestätigt**.

### P1

- echtes `package-lock.json` + `npm ci`
- Branch Protection / Required Checks
- Icon-/Asset-Herkunft und Third-Party-Rechte
- konkrete HTTPS-Staging-Origin
- reale PWA-Upgrades/Rollback
- Android/iPhone/Tablet
- VoiceOver/TalkBack/200 %
- reale Gruppentests
- echte Betreiber-/Support-/Hostingangaben
- finale Rechte-/Contentfreigabe

## Freigabestatus

- öffentlicher Release: **NO_GO**
- PR #13: **Draft, nicht mergen**
- kontrollierte Entwicklungsbeta: möglich
- Releaseziel Januar 2027: weiterhin erreichbar, wenn die externen und realen Gates rechtzeitig geschlossen werden
