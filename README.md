# Secret Circle Party Hub

Secret Circle ist eine **offline-first Partyspiel-Plattform für gemeinsame Spiele auf einem Gerät**. Der Januar-2027-Release priorisiert sichere private Übergaben, Wiederaufnahme nach Unterbrechungen, lokale Datenkontrolle, eigene Spiele und belastbare Release-Gates.

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
- installierbare Offline-PWA mit kontrollierter Aktualisierung
- kein verpflichtendes Konto
- keine Analyse-, Werbe- oder Trackingdienste

„Technisch spielbar“ bedeutet **nicht automatisch releasefertig**.

## Produktpositionierung

Secret Circle soll nicht nur über „viele Spiele + offline + ein Gerät“ konkurrieren. Der Fokus liegt auf:

- zusammenhängendem Party-Hub statt isolierten Minispielen
- 15 besonders priorisierten Core-Games
- sicheren geheimen Pass-and-Play-Zuständen
- Resume nach Reload/Unterbrechung
- lokaler Datenkontrolle ohne Konto/Cloudzwang
- eigenen Spielen über den Creator
- klarer Core/Extended/Labs-Reifegradtrennung

Persönliche Inhalte sind freiwillig. Überspringen ist jederzeit erlaubt und muss nicht begründet werden.

## Releaseziel

- funktionsfertig bis **30. November 2026**
- Code Freeze **5. Dezember 2026**
- Release Candidate bis **15. Dezember 2026**
- öffentlicher Release **4.–15. Januar 2027**

Aktueller Offline-Core: **`secret-circle-v37`**.

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

## Core-Content-Stand

Die drei Ausbauwellen haben die definierten quantitativen Ziele erreicht. `CORE_CONTENT_REVIEW.md` enthält den ersten **15/15-Core-Quellpass**.

Beispiele:

- Truth/Dare: 24 je Pack
- Never Have / Most Likely / Would Rather: 24 je Pack
- Paranoia: 20 je Pack
- Charades: 30 je Pack
- Taboo: 24 je Pack
- Hot Potato: 20 je Pack
- Two Truths / Question Imposter / Location Spy: 16 je Pack
- Word Imposter: 14 × 12 Begriffe

Reale Gruppen, finale Semantik-/Altersfreigabe und Runnernachweis bleiben offen.

## Reference-Safe-Content

### Word Imposter

Drei unnötig konkrete Begriffe wurden generisch ersetzt:

- Bluetooth → Funkverbindung
- Oscar → Filmpreis
- Formel 1 → Motorsport

### Anime-Quiz

Für die stabile ID `anime-guess` wurde **Option B** umgesetzt. Im finalen Runtime-Katalog erscheint:

**Anime-Archetypen erraten**

mit vier generischen Packs und insgesamt **40 eigenständigen Archetypen**. Die 40 zuvor inventarisierten konkreten Figuren-/Franchisereferenzen werden durch die finale Classic-Content-Schicht v2 nicht mehr ausgeliefert.

Tests/Audits schützen diesen finalen Runtime-Vertrag. Der restliche Extended-/Labs-Referenzscan bleibt offen.

## Session-, Resume- und Timergrundlage

- stabile Session- und Completion-IDs
- Exact-once-Verlauf/Statistik
- direkte Hub-Session: `secret-circle-party-hub-active-v1`
- Advanced: `secret-circle-party-active-v1`
- private Inhalte nach Reload wieder verdeckt
- **Beenden & speichern** getrennt von **Abbrechen & verwerfen**
- Skip ohne künstlichen Punkt
- gemeinsame pausierbare Sessionsteuerung
- Scharade 60 s
- Tabu 60 s
- Hot Potato 10–25 s verdeckt
- Wortkette 30 s

## Backup- und Datenvertrag

`backup-schema-registry.js` ist Registry **v2**.

- maximale Backupdatei: 1.500.000 UTF-8-Bytes
- Complete-Backup-Format/Grenzen zentral
- nur registrierte Word-Imposter- und `secret-circle-party-*`-Key-Familien importierbar
- unbekannte Secret-Circle-Namespaces werden abgelehnt
- vollständiges Löschen entfernt bewusst alle `secret-circle-*`-Reste
- Registry wird vor `party-data-tools.js` geladen

## PWA und Offline

Aktuell:

- `secret-circle-v37`
- `secret-circle-v37-staging`

Updates werden zuerst vollständig in einem Staging-Cache vorbereitet und erst nach sichtbarer Nutzerentscheidung aktiviert. Der aktive Offline-Core wird vor erfolgreicher Promotion nicht destruktiv entfernt.

`ENVIRONMENTS.md` verlangt getrennte Origins für HTTPS-Staging und Production.

## Accessibility

Vorbereitet:

- semantische Struktur / Skip-Links
- sichtbarer Fokus
- 44px kritische Touchziele
- Reduced Motion
- ARIA-Autocomplete/Listbox
- `tests/accessibility-contract.test.js`
- `tests/e2e/accessibility-core.spec.js`
- 320-CSS-px-Reflowbasis

Real offen: 200-%-Zoom, VoiceOver, TalkBack, private Reveal-Flows und reale Touchbedienung.

## Beta- und Realtestplan

`BETA_TEST_PLAN.md` definiert G1–G5, PN1–PN3, Android/iPhone/Tablet, VoiceOver/TalkBack, zwei reale PWA-Upgrades und eine HTTPS-Rollbackprobe.

Diese Tests sind **vorbereitet, noch nicht durchgeführt**.

## Third Party und Assetrechte

- keine npm-Runtime-Dependencies
- `@playwright/test` 1.54.2 upstream als **Apache-2.0** verifiziert
- vollständige transitive Inventur wartet auf `package-lock.json`
- Herkunft/Lizenz von `icon.svg`, `icon-192.png`, `icon-512.png` ist noch nicht belegt
- keine Root-`LICENSE`; Projektlizenz wird nicht geraten

## Lokal starten

```bash
python -m http.server 8080
```

Beispiele:

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

Neuester belastbar geprüfter Lauf: **Run #1905** – Job `validate`, failure, **`steps: []`**, kein Checkout und kein Repository-Code ausgeführt.

### P1

- `package-lock.json` + `npm ci`
- Branch Protection / Required Checks
- Classic-Content-v2-Performancebudget bestätigen
- restlicher Extended/Labs-Referenzscan
- Icon-/Asset-Herkunft
- konkrete HTTPS-Staging-Origin
- reale PWA-Upgrades/Rollback
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
