# Changelog

Alle nennenswerten Änderungen an Secret Circle werden hier dokumentiert.

## Unreleased – Januar-2027 Release Foundation

Stand: 25. August 2026

### Release-/A-bis-Z-Prozess

- Secret-Circle-spezifischen A-bis-Z-Masterprozess, operativen Tracker, Risk Register und Produkt-/UX-/Architektur-/Security-/Accessibility-/Beta-/Legal-/Support-/Incident-/Maintenance-/Environment-Verträge aufgebaut.
- `CORE_GAME_ACCEPTANCE.md` dokumentiert den vollständigen **15/15 Core Source Hardening PREPARED**-Pass.
- `RELEASE_CHECKLIST.md`, `RELEASE_STATUS.md`, `APP_DEVELOPMENT_STATUS.md`, README, Beta-/Manual-Testpläne, Issues und Draft-PR #13 auf denselben Releasezustand synchronisiert.
- `BRANCH_PROTECTION.md` + Contract-Audit definieren **`Secret Circle CI / validate`** als gewünschten normalen PR-Required-Check; tatsächliche GitHub-Einstellung bleibt offen.
- Cross-Browser bleibt separater RC-Gate.
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

- `advanced-privacy-guard.js` schützt private Two-Truths-Eingaben, Question-Imposter-Fragen, Location-Spy-Karten sowie Mafia-Rollen-/Moderator-/Nachtinformationen bei Fokusverlust.
- `advanced-resume-guard.js` vor dem Advanced-Runner eingebunden.
- Resume-Validierung prüft Spielerzugehörigkeit, zulässige Phasen und spielinterne Ergebnis-Konsistenz.
- Two Truths: Lügenindex, Vote und `correct` müssen zusammenpassen.
- Question Imposter: Imposterrolle und Vote müssen zur Spielergruppe passen.
- Location Spy: Spion, Ort und Resultat müssen konsistent sein.
- Mafia: Rollenanzahl nach Gruppengröße/Pack, Alive-Menge und Sieger werden validiert; manipulierte Sieger-/Rollenstände werden verworfen.
- Unit-/E2E-Verträge für manipulierte Advanced-Snapshots angelegt.

### Hub-Accessibility-Hardening – v46

- konkreten Fokusfehler behoben: Hub-Bereichswechsel riefen zuvor `focus()` auf nicht fokussierbaren Überschriften auf; die neue A11y-Schicht setzt den sichtbaren `h1/h2` programmatisch `tabindex="-1"` und fokussiert ihn kontrolliert.
- konkretes Modalproblem behoben: Spieldetail und aktive Hub-Runde ließen zuvor Tastaturfokus in den verdeckten Hintergrund wandern.
- `party-hub-a11y.js` Version 2 ergänzt.
- aktive Hub-Spielrunde als `role="dialog"` + `aria-modal="true"` ausgezeichnet.
- Hintergrund-Siblings werden während Spieldetail/Spielrunde über `inert` isoliert.
- dynamisch hinzugefügte Body-Siblings werden bei offenem Overlay ebenfalls isoliert.
- Tab und Shift+Tab werden innerhalb des aktiven Overlays zyklisch gehalten.
- Erstladen behält den Skip-Link als ersten sinnvollen Tastaturtarget.
- `tests/accessibility-contract.test.js` um Modal-, Inert-, Fokus- und Fokus-Trap-Verträge erweitert.
- `tests/e2e/accessibility-core.spec.js` prüft Bereichsfokus, Detailmodal-Fokus-Trap und aktive Spielrunde als modalen Tastaturkontext.
- `scripts/hub_a11y_contract_audit.py` ergänzt und in `npm run validate` eingebunden.
- `scripts/architecture_audit.py` erweitert: Word-Imposter-/Hub-/Advanced-Resume-/Privacy-Guards und `party-hub-a11y.js` werden jetzt als echte Production-/Offline-Module geprüft.
- reale VoiceOver-/TalkBack-/Zoom-/Touch-/Browser-Abnahme bleibt offen; Accessibility steht deshalb weiterhin auf **PREPARED**, nicht PASS.

### Core-Content / Privacy / Reference

- alle 15 priorisierten Core-Games auf quantitative Releaseziele gebracht.
- 15/15 erster manueller Core-Quellpass dokumentiert.
- persönliche Inhalte sichtbar freiwillig/überspringbar.
- v43: Kamerarollen- und Letzte-Nachricht-Prompt physisch aus dem Runtime-Katalog entfernt.
- `scripts/privacy_content_audit.py` scannt ausgelieferte Contentquellen und blockiert konkrete Private-Device-Offenlegungsaufforderungen.
- v36–v41: unnötige konkrete Marken-/Fan-/Sport-/Eventreferenzen generisch bereinigt.
- `anime-guess` → **Anime-Archetypen erraten**; stabile ID `wavelength` → sichtbar **Spektrum-Tipp**.
- `scripts/reference_content_audit.py` schützt die ausgelieferten Contentquellen.

### PWA / Offline

- v42: echtes `icon-192.png` 192×192 und echtes `icon-512.png` 512×512; Hash/IHDR/Manifestgrößen werden geprüft.
- v43: Private-Device-Content physisch aus dem Runtime-Pool entfernt.
- v44: gemeinsamer Manifest-/iOS-/Icon-Head-Vertrag für Hub, Word Imposter, Creator, Advanced und Quick.
- v45: neue Cachegeneration nach dem 15/15-Core-Hardening; Word-Imposter-/Hub-/Advanced-Resume- und Advanced-Privacy-Guards explizit offline.
- **v46:** neue Cachegeneration wegen des Hub-Accessibility-Hardenings. Offline-Core jetzt `secret-circle-v46` / `secret-circle-v46-staging` und enthält `party-hub-a11y.js`.
- `sw.js`, Service-Worker-Test, Architektur, Deployment, Environment, Privacy, Accessibility, Release-/Beta-/Manual-Dokumentation, README, PR #13 und Issue #8 auf v46 synchronisiert.
- Operator- und Release-Readiness-Audit lesen die aktuelle Cachegeneration inzwischen dynamisch aus `sw.js`, statt bei jedem Cachebump einen alten Versionsstring zu verlangen.
- reale Installations-, Upgrade-, Rollback- und Gerätetests bleiben offen.

### Reproduzierbarer Build / Supply Chain

- `package-lock.json` v3 vorhanden.
- gelockt: `@playwright/test` 1.54.2, `playwright` 1.54.2, `playwright-core` 1.54.2, optional `fsevents` 2.3.2.
- Registry-URLs und `sha512`-Integrities festgehalten.
- keine npm-Runtime-Dependencies.
- normaler CI- und Cross-Browser-Workflow verwenden `npm ci --ignore-scripts --no-audit --no-fund`.
- Lockfile-, A11y-, Operator- und Release-Readiness-Audits in `npm run validate` integriert.
- echter Online-`npm ci`-PASS bleibt bis funktionierendem Runner offen.

### Operator / Hosting / Legal / Support / Incident

- `operator-release.json` als maschinenlesbare Betreiber-/Hosting-/Support-/Incident-Akte ergänzt; startet bewusst mit **`PREPARED / BLOCKED`**.
- `OPERATOR_RELEASE_SIGNOFF.md` bündelt den menschlichen Betreiber-/Legal-/Support-/Incident-Sign-off.
- `HOSTING_DECISION.md` definiert Provider-, HTTPS-Origin-, Log-/Retention-, Processor-/Drittland- und Rollbackprüfung und ist auf den v46-Smoke aktualisiert.
- `scripts/operator_release_contract_audit.py` verlangt für `READY`: reale Betreiber-/Kontaktwerte, getrennte HTTPS-Staging-/Production-Origin, dokumentierte Hosting-/Privacybedingungen, getestete Support-/Securitywege sowie SEV-1-/Rollback-Drills.
- `release-evidence.json` bindet `legalPrivacy` und `supportIncident` an `operator-release.json = FINAL / READY`.
- `LEGAL_CHECKLIST.md` auf Stand **25. August 2026** gebracht.
- `SUPPORT.md` enthält verbindlichen Probe-Supportfall und zentrale Operator-Kontaktquelle.
- `INCIDENT_RESPONSE.md` enthält verbindlichen Probe-SEV-1 einschließlich neuer Cachegeneration, HTTPS-Staging und Rollbacknachweis.
- **Issue #14** führt die reale Operator-/Hosting-/Legal-/Support-/Incident-Evidence.

### HTTPS-Staging / Production-Smoke

- `scripts/staging_smoke.py` prüft HTTPS-Ressourcen, Same-Origin-Redirects, Größenlimits, Kernrouten, Manifest, PNG-Dimensionen, SW-Cache, Registry-Ladereihenfolge sowie Privacy-/Reference-Safe-Source-Verträge.
- aktueller erwarteter Cache: **`secret-circle-v46`**.
- `--production` verschärft öffentliche Placeholder-Prüfungen.
- reale Provider-/Staging-/Production-Origin und Netzwerk-Smokes bleiben offen.

### Backup / Security

- Backup Registry v2 ist zentrale Quelle für Complete-Backup-Format, Größenlimits und erlaubte Storage-Key-Familien.
- `party-data-tools.js` konsumiert Registry-Werte statt Policy-Limits zu duplizieren.
- unbekannte `secret-circle-*`-Namespaces werden beim Complete-Import abgelehnt; vollständiges Löschen bleibt bewusst breit.
- zusätzliche Resume-Guards behandeln beschädigte/manipulierte Zwischenstände fail-safe statt sie halb fortzusetzen.

### Accessibility / Beta

- Issue #8 sowie `BETA_TEST_PLAN.md` und `MANUAL_TEST_PLAN.md` sind auf v46 aktualisiert.
- reale Matrix umfasst Android/iPhone/iPad, VoiceOver/TalkBack, 200-%-Zoom, 320-CSS-px-Reflow, Tastatur, Modal-Fokus, PWA-Upgrade/Rollback und reale Gruppen.
- reale Durchführung bleibt offen.

### Third Party / Assets

- gelockte Playwright-Paketkette vollständig inventarisiert.
- Asset-Provenienz-, Media-Inventar-, Reference-, Privacy- und Placeholder-Audits vorhanden.
- `ASSET_RIGHTS_SIGNOFF.md`: `icon.svg` darf erst nach echter menschlicher Herkunfts-/Rechtebestätigung auf einen verifizierten Status wechseln.
- `icon.svg`, `icon-192.png` und `icon-512.png` bleiben bis dahin korrekt `unresolved`.

### CI / Hosted Runner – P0

- aktuellster ausdrücklich untersuchter v46-Lauf: **Run #2627**, Run ID `32809352564`, Job `validate` / `97685596269`, Head `30ef13f84d34f7fa95c46d441463bb58f0cb09c1`.
- Ergebnis: `failure`; Jobliste `steps: null`, separate Step-Abfrage `steps: []`.
- kein Checkout, kein Node/Python, kein npm, keine Tests und kein Repository-Code ausgeführt.
- früherer temporärer Runner-Probe ohne Checkout, Setup-Actions, npm, Playwright oder Repository-Code – nur lokales Bash `echo`/`uname` – endete ebenfalls vor Step 1 mit `steps: []`.
- dasselbe Muster wurde über zahlreiche Heads bis v46 beobachtet; die unmittelbare Fehlerfläche liegt weiterhin vor der Repository-Ausführung.
- verbleibender Prüfbereich: Hosted-Runner-Zuteilung, Actions-/Account-/Billing-/Budget-/Policyzustand oder GitHub-seitige Runner-Störung.
- `CI_TROUBLESHOOTING.md` und Issue #7 sind auf Run #2627 synchronisiert.

### Release-Status

- zentrale offene Issues: **#7 CI**, **#8 Geräte/Beta/A11y**, **#14 Operator/Hosting/Legal/Support**.
- Draft-PR #13 bleibt ungemergt.
- öffentlicher Release bleibt **NO_GO**.
- kein CI-, Geräte-, Accessibility-, Gruppen-, Asset-, Legal- oder Release-Evidence-PASS wird ohne echten Nachweis behauptet.
