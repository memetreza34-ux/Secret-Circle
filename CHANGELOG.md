# Changelog

Alle nennenswerten Änderungen an Secret Circle werden hier dokumentiert.

## Unreleased – Januar-2027 Release Foundation

Stand: 25. August 2026

### Release-/A-bis-Z-Prozess

- A-bis-Z-Masterprozess, Status-/Risk-/Release-/Operator-/Hosting-/Accessibility-/Beta-/Legal-/Support-/Incident-Verträge aufgebaut.
- 15/15 Core Source Review und 15/15 Core Source Hardening stehen auf **PREPARED**.
- Accessibility Source Hardening steht auf **PREPARED**.
- Word-Imposter Data/Resume Hardening steht auf **PREPARED**.
- `release-evidence.json` bleibt bewusst `PREPARED / NO_GO`; kein unveränderter RC ist eingefroren.
- PR #13 bleibt Draft und ungemergt.

### Core-Hardening

- Word Imposter: Setup, Rollenfairness, Voting-/Resume-Integrität und Geheimkarten-Schutz.
- Social Hub: Freiwilligkeit/Skip und verständliche Live-Regeln.
- Paranoia/Scharade/Tabu: private Inhalte bei Fokusverlust geschützt.
- Heiße Kartoffel: versteckter Timer exakt 10–25 Sekunden.
- Wortkette / Nur falsche Antworten: manueller Regel-/Ergebnisvertrag geklärt.
- Advanced: Privacy-/Resume-Guards für Two Truths, Question Imposter, Location Spy und Mafia.

### Hub-Accessibility-Hardening – v46

- `party-hub-a11y.js` Version 2 ergänzt.
- konkreten Hub-Fokusfehler behoben: Bereichswechsel fokussieren eine programmatisch fokussierbare Hauptüberschrift.
- Spieldetail und aktive Hub-Runde als modale Tastaturkontexte gehärtet.
- Hintergrund über `inert` isoliert; Tab/Shift+Tab bleibt im Overlay.
- Rückkehrfokus nach Schließen des Spieldetails.
- Unit-/Playwright-/Auditverträge ergänzt.

### Advanced-/Quick-/Creator-Accessibility-Hardening – v47

- `secondary-surface-a11y.js` Version 1 ergänzt.
- **Advanced:** Spieloverlay als modalen Fokuskontext mit Hintergrundisolation und Fokus-Trap gehärtet.
- **Quick:** Fokus-Recovery nach dynamischen DOM-Phasenwechseln.
- **Creator:** Wizard-Schrittfokus, Hilfe-Modal mit Fokus-Trap/Rückkehrfokus und Template-Radiogroup mit roving `tabindex`, Pfeiltasten sowie Home/End.
- `tests/accessibility-contract.test.js`, Playwright-E2E und `scripts/secondary_surface_a11y_contract_audit.py` erweitert.
- reale VoiceOver-/TalkBack-/Zoom-/Touch-/Browser-Abnahme bleibt offen; Accessibility bleibt **PREPARED**, nicht PASS.

### Word-Imposter Data/Resume Hardening – v48

- konkreten Defense-in-depth-Votingfehler entfernt: `app.js` leitet die nächste abstimmende Person nicht mehr aus `Object.keys(votes).length` ab, sondern sucht den nächsten Spieler ohne gespeicherte Stimme.
- der strengere `word-imposter-resume-guard.js` bleibt unverändert aktiv und verwirft nicht-sequenzielle manipulierte Voting-Snapshots.
- `data-store.js` definiert jetzt zentral:
  - maximal **50 eigene Kategorien**,
  - maximal **200 Begriffe je eigener Kategorie**,
  - maximal **1,5 MB UTF-8** pro Word-Imposter-Backup.
- frühere stille `slice(0, 50)`-Trunkierung entfernt: 51 Kategorien werden jetzt fail-closed abgelehnt.
- 201 Begriffe werden vor `engine.normalizeEntries()` abgelehnt.
- Backup-`data` muss ein echtes Objekt und darf kein Array sein.
- abgelehnte Imports verändern bestehende lokale Daten nicht.
- `app.js` liest die Limits aus dem Store statt eigene unabhängige Werte zu verwenden.
- `index.html` erklärt 50 Kategorien und 2–200 Begriffe sichtbar und besitzt einen begrenzten Texteingabepfad.
- `tests/storage.test.js` deckt 50/51, 200/201, UTF-8-Byte-Limit, korrupte lokale Übergrößen und Import-Rollback ab.
- `tests/word-imposter-data-contract.test.js` neu; schützt Voting-, UI-, Store- und Backup-Grenzen.
- `package.json` führt den neuen Contracttest in `npm test` und `npm run check` aus.
- `scripts/release_readiness_contract_audit.py` verlangt den neuen Test im Unit-/Syntaxgate.

### PWA / Offline – v48

- Offline-Core auf **`secret-circle-v48` / `secret-circle-v48-staging`** erhöht.
- v46-/v47-A11y-Schichten bleiben enthalten.
- aktuelle `index.html`, `app.js` und `data-store.js` mit Word-Imposter-v48-Hardening werden offline ausgeliefert.
- `tests/service-worker.test.js` auf Cachevertrag 48 aktualisiert.
- Architektur, Deployment, Environment, Privacy, Hosting, Release-Checkliste, Issue #8, README, Release-Status und A-bis-Z-Tracker auf v48 synchronisiert.
- reale Installations-, Upgrade-, Rollback-, Grenz- und Offline-Gerätetests bleiben offen.

### Build / Supply Chain

- `package-lock.json` v3.
- Playwright-Kette exakt 1.54.2.
- keine npm-Runtime-Dependencies.
- CI/Cross-Browser verwenden `npm ci`.
- Syntax-/Unit-/Validate-Gates enthalten die A11y- und Word-Imposter-Datenverträge.
- Online-`npm ci`-/Test-PASS bleibt wegen Hosted-Runner-Blocker offen.

### Operator / Hosting / Legal / Support

- `operator-release.json` bleibt `PREPARED / BLOCKED`.
- `HOSTING_DECISION.md` erwartet v48 für Staging-/Production-Smokes.
- Issue #14 führt reale Betreiber-/Hosting-/Legal-/Support-/Incident-Evidence.
- reale Betreiberwerte, Provider/Origins, Support-/Securitytests und Drills bleiben offen.

### CI / Hosted Runner – P0

- aktuellster bestätigter v48-Lauf: **Run #2715**, Run ID `32850361668`, Job `validate` / `97809595781`, Head `9f87910567a60e5ce905ced42bb62201b3e3a85d`.
- Ergebnis erneut vor Step 1: `steps: null` / separate Abfrage `steps: []`.
- kein Checkout, npm, Test oder Repository-Code wurde ausgeführt.
- der isolierte Minimal-Runner-Probe ohne Repository-Code zeigte dasselbe Muster.
- unmittelbare Fehlerfläche bleibt vor der Workflow-Step-Ausführung; Details: Issue #7 / `CI_TROUBLESHOOTING.md`.

### Third Party / Assets

- Asset-Provenienz- und Rights-Sign-off-Verträge vorhanden.
- Root-`icon.svg` und Ableitungen bleiben bis echter Rechtebestätigung `unresolved`.

### Release-Status

- zentrale offene Issues: **#7 CI**, **#8 Geräte/Beta/A11y/Word-Imposter-v48-Daten**, **#14 Operator/Hosting/Legal/Support**.
- öffentlicher Release: **NO_GO**.
- kein CI-, Geräte-, Accessibility-, Daten-Grenz-, Gruppen-, Asset-, Legal- oder Release-Evidence-PASS wird ohne echte Ausführung behauptet.