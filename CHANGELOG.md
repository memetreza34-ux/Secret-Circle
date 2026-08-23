# Changelog

Alle nennenswerten Änderungen an Secret Circle werden hier dokumentiert.

## Unreleased – Januar-2027 Release Foundation

Stand: 23. August 2026

### Release-/A-bis-Z-Prozess

- Secret-Circle-spezifischen A-bis-Z-Masterprozess, operativen Tracker, Risk Register und Produkt-/UX-/Architektur-/Security-/Accessibility-/Beta-/Legal-/Support-/Incident-/Maintenance-/Environment-Verträge aufgebaut.
- `CORE_GAME_ACCEPTANCE.md` dokumentiert jetzt den vollständigen **15/15 Core Source Hardening PREPARED**-Pass.
- `RELEASE_CHECKLIST.md`, `RELEASE_STATUS.md`, `APP_DEVELOPMENT_STATUS.md`, `BETA_TEST_PLAN.md`, `MANUAL_TEST_PLAN.md`, Issue #8 und Draft-PR #13 auf denselben Releasezustand synchronisiert.
- `BRANCH_PROTECTION.md` + Contract-Audit definieren **`Secret Circle CI / validate`** als gewünschten normalen PR-Required-Check; tatsächliche GitHub-Einstellung bleibt offen.
- Cross-Browser bleibt separater RC-Gate.
- `scripts/release_readiness_contract_audit.py` als Querschnittsgate ergänzt und auf den aktuellen v45-PWA-Vertrag aktualisiert.
- `release-evidence.json` bleibt absichtlich `PREPARED / NO_GO`; kein unveränderter RC eingefroren.

### 15/15 Core-Hardening

- **Word Imposter:** Setup sperrt ungültige Spieler-/Imposter-Konfigurationen; Rollen bleiben von der Reveal-Reihenfolge unabhängig; Voting-/Resume-Integrität zusätzlich geschützt; geheime Karten werden bei Fokusverlust/Übergabe verdeckt.
- **Wahrheit oder Pflicht / Ich habe noch nie / Wer würde eher? / Entweder oder:** laufende Runden zeigen kurze verständliche Regeln; persönliche Social-Games machen Freiwilligkeit und Skip ohne Begründung sichtbar.
- **Paranoia:** offene Geheimfrage wird bei App-/Tab-Wechsel automatisch verdeckt und muss bewusst wieder geöffnet werden.
- **Scharade / Nicht sagen!:** offene Geheimkarten werden bei Fokusverlust verdeckt; die UI erklärt, wer den Bildschirm sehen darf.
- **Heiße Kartoffel:** Off-by-one-Zufallsbereich korrigiert; der versteckte Timer liegt jetzt exakt zwischen **10 und 25 Sekunden**.
- **Wortkette:** Live-Regel für Kategorie, letzten Buchstaben, Wiederholungsverbot und manuellen Erfolgsabschluss ergänzt.
- **Nur falsche Antworten:** manuelle Verlustregel sichtbar gemacht; die App bleibt bewusst scorelos.
- Hub-Resume lehnt inkonsistente Cross-Mode-Timerzustände ab.

### Advanced-Core-Hardening

- `advanced-privacy-guard.js` ergänzt: schützt private Two-Truths-Eingaben, Question-Imposter-Fragen, Location-Spy-Karten sowie Mafia-Rollen-/Moderator-/Nachtinformationen bei Fokusverlust.
- `advanced-resume-guard.js` ergänzt und vor dem Advanced-Runner eingebunden.
- Resume-Validierung prüft Spielerzugehörigkeit, zulässige Phasen und spielinterne Ergebnis-Konsistenz.
- Two Truths: Lügenindex, Vote und `correct` müssen zusammenpassen.
- Question Imposter: Imposterrolle und Vote müssen zur Spielergruppe passen.
- Location Spy: Spion, Ort und Resultat müssen konsistent sein.
- Mafia: Rollenanzahl nach Gruppengröße/Pack, Alive-Menge und Sieger werden validiert; manipulierte Sieger-/Rollenstände werden verworfen.
- neue Unit-/E2E-Verträge für manipulierte Advanced-Snapshots angelegt.

### Core-Content / Privacy

- alle 15 priorisierten Core-Games auf quantitative Releaseziele gebracht.
- 15/15 erster manueller Core-Quellpass dokumentiert.
- persönliche Inhalte sichtbar freiwillig/überspringbar.
- v43: Kamerarollen- und Letzte-Nachricht-Prompt physisch aus dem Runtime-Katalog entfernt.
- `scripts/privacy_content_audit.py` scannt ausgelieferte Contentquellen und blockiert konkrete Private-Device-Offenlegungsaufforderungen.

### Reference-Safe-Content

- v36: Bluetooth → Funkverbindung, Oscar → Filmpreis, Formel 1 → Motorsport.
- v37/v40: `anime-guess` als **Anime-Archetypen erraten** mit generischen Archetypen; frühere konkrete Figuren physisch entfernt.
- v38: unnötig konkrete Sport-/Eventformulierungen neutralisiert.
- v39/v41: stabile ID `wavelength`, sichtbarer Titel **Spektrum-Tipp**; Browser-Tabu generisch; `Löwenkönig` → `Löwe`; Classic Content v4.
- `scripts/reference_content_audit.py` schützt die ausgelieferten Contentquellen.

### PWA / Offline

- v42: echtes `icon-192.png` 192×192 und echtes `icon-512.png` 512×512; Hash/IHDR/Manifestgrößen werden geprüft.
- v43: Private-Device-Content physisch aus dem Runtime-Pool entfernt.
- v44: gemeinsamer Manifest-/iOS-/Icon-Head-Vertrag für Hub, Word Imposter, Creator, Advanced und Quick.
- **v45:** neue Cachegeneration nach dem 15/15-Core-Hardening. Offline-Core jetzt `secret-circle-v45` / `secret-circle-v45-staging`.
- v45 enthält die neuen Word-Imposter-/Hub-/Advanced-Resume- und Advanced-Privacy-Guards explizit offline.
- `sw.js`, Service-Worker-Test, `ARCHITECTURE.md`, `DEPLOYMENT.md`, `ENVIRONMENTS.md`, `privacy.html` und Release-Dokumentation auf v45 synchronisiert.
- `scripts/release_readiness_contract_audit.py` enthielt noch einen hart codierten v44-Vertrag und wurde auf v45 korrigiert.
- reale Installations-, Upgrade-, Rollback- und Gerätetests bleiben offen.

### Reproduzierbarer Build / Supply Chain

- `package-lock.json` v3 vorhanden.
- gelockt: `@playwright/test` 1.54.2, `playwright` 1.54.2, `playwright-core` 1.54.2, optional `fsevents` 2.3.2.
- Registry-URLs und `sha512`-Integrities festgehalten.
- keine npm-Runtime-Dependencies.
- normaler CI- und Cross-Browser-Workflow verwenden `npm ci --ignore-scripts --no-audit --no-fund`.
- `scripts/lockfile_contract_audit.py` in `npm run validate` integriert.
- echter Online-`npm ci`-PASS bleibt bis funktionierendem Runner offen.

### HTTPS-Staging / Production-Smoke

- `scripts/staging_smoke.py` prüft HTTPS-Ressourcen, Same-Origin-Redirects, Größenlimits, Kernrouten, Manifest, PNG-Dimensionen, SW-Cache, Registry-Ladereihenfolge sowie Privacy-/Reference-Safe-Source-Verträge.
- aktueller erwarteter Cache: **`secret-circle-v45`**.
- `--production` verschärft öffentliche Placeholder-Prüfungen.
- reale Staging-/Production-Origin und Netzwerk-Smokes bleiben offen.

### Backup / Security

- Backup Registry v2 ist zentrale Quelle für Complete-Backup-Format, Größenlimits und erlaubte Storage-Key-Familien.
- `party-data-tools.js` konsumiert Registry-Werte statt Policy-Limits zu duplizieren.
- unbekannte `secret-circle-*`-Namespaces werden beim Complete-Import abgelehnt; vollständiges Löschen bleibt bewusst breit.
- zusätzliche Resume-Guards behandeln beschädigte/manipulierte Zwischenstände fail-safe statt sie halb fortzusetzen.

### Accessibility / Beta

- statischer Accessibility-Contract und Playwright-E2E-Basis vorhanden.
- Issue #8 sowie `BETA_TEST_PLAN.md`/`MANUAL_TEST_PLAN.md` decken v45, 15 Core-Games, reale Android-/iPhone-/Tablet-, VoiceOver-/TalkBack-/200-%-Zoom-, PWA-Upgrade-/Rollback- und Gruppentests ab.
- reale Durchführung bleibt offen.

### Third Party / Assets / Legal

- gelockte Playwright-Paketkette vollständig inventarisiert.
- Asset-Provenienz-, Media-Inventar-, Reference-, Privacy- und Placeholder-Audits vorhanden.
- `ASSET_RIGHTS_SIGNOFF.md` ergänzt: `icon.svg` darf erst nach echter menschlicher Herkunfts-/Rechtebestätigung auf einen verifizierten Status wechseln.
- `icon.svg`, `icon-192.png` und `icon-512.png` bleiben bis dahin korrekt `unresolved`.
- Betreiber-/Support-/Hostingangaben und manueller Visual-/Legal-Pass bleiben offen.

### CI / Hosted Runner – P0

- aktuellster vollständig untersuchter App-CI-Lauf: **Run #2401**, Run ID `32650097844`, Job `97220210755`.
- Ergebnis: `failure` mit **`steps: []`**; kein Checkout, kein Node/Python, kein npm, keine Tests und kein Repository-Code ausgeführt.
- zusätzlicher temporärer Runner-Probe ohne Checkout, Setup-Actions, npm, Playwright oder Repository-Code – nur lokales Bash `echo`/`uname` – endete ebenfalls vor Step 1 mit `steps: []`.
- damit sind Secret-Circle-Code, npm, Playwright und Checkout-Actions als unmittelbare Ursache des aktuellen Fehlermusters ausgeschlossen.
- verbleibender Prüfbereich: Hosted-Runner-Zuteilung, Actions-/Account-/Billing-/Budget-/Policyzustand oder GitHub-seitige Runner-Störung.
- Issue #7 und `CI_TROUBLESHOOTING.md` auf diesen Nachweis aktualisiert.

### Release-Status

- Draft-PR #13 bleibt ungemergt.
- öffentlicher Release bleibt **NO_GO**.
- kein CI-, Geräte-, Accessibility-, Gruppen-, Asset-, Legal- oder Release-Evidence-PASS wird ohne echten Nachweis behauptet.
- nächste Gates: funktionierender Actions-Runner → Online-`npm ci`/CI → Cross-Browser → Branch Protection → HTTPS-Staging/v45-PWA → reale Geräte/A11y/Gruppen → Asset-/Legal-/Support-/Incident-Sign-off → unveränderter RC.
