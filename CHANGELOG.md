# Changelog

Alle nennenswerten Änderungen an Secret Circle werden hier dokumentiert.

## Unreleased – Januar-2027 Release Foundation

Stand: 25. August 2026

### Release-/A-bis-Z-Prozess

- A-bis-Z-Masterprozess, Status-/Risk-/Release-/Operator-/Hosting-/Accessibility-/Beta-/Legal-/Support-/Incident-Verträge aufgebaut.
- 15/15 Core Source Review und 15/15 Core Source Hardening stehen auf **PREPARED**.
- Accessibility Source Hardening steht auf **PREPARED**.
- Word-Imposter Data/Resume Hardening steht auf **PREPARED**.
- Hub Resume Integrity v2 steht auf **PREPARED**.
- `release-evidence.json` bleibt bewusst `PREPARED / NO_GO`; kein unveränderter RC ist eingefroren.
- PR #13 bleibt Draft und ungemergt.
- Branch-Protection-, Foundation-, Readiness- und Release-Audits sind **transition-safe** und blockieren einen später korrekt belegten `FINAL / GO`-Zustand nicht durch historische OPEN-/NO_GO-Hardcodes.
- `validate_project.py` kennt die aktuellen Word-Imposter-/Advanced-/Quick-/Creator-Scriptketten und schützt den Hub-Resume-v2-Loadervertrag.

### Core-Hardening

- Word Imposter: Setup, Rollenfairness, Voting-/Resume-Integrität und Geheimkarten-Schutz.
- Social Hub: Freiwilligkeit/Skip und verständliche Live-Regeln.
- Paranoia/Scharade/Tabu: private Inhalte bei Fokusverlust geschützt.
- Heiße Kartoffel: versteckter Timer exakt 10–25 Sekunden.
- Wortkette / Nur falsche Antworten: manueller Regel-/Ergebnisvertrag geklärt.
- Advanced: Privacy-/Resume-Guards für Two Truths, Question Imposter, Location Spy und Mafia.

### Hub-Accessibility-Hardening – v46

- `party-hub-a11y.js` Version 2 ergänzt.
- Bereichswechsel fokussieren eine programmatisch fokussierbare Hauptüberschrift.
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

- `app.js` leitet die nächste abstimmende Person nicht mehr aus `Object.keys(votes).length` ab, sondern sucht den nächsten Spieler ohne gespeicherte Stimme.
- `word-imposter-resume-guard.js` verwirft nicht-sequenzielle manipulierte Voting-Snapshots.
- `data-store.js` definiert maximal **50 eigene Kategorien**, maximal **200 Begriffe je eigener Kategorie** und maximal **1,5 MB UTF-8** pro Word-Imposter-Backup.
- frühere stille Kategorie-Trunkierung entfernt: 51 Kategorien werden fail-closed abgelehnt.
- 201 Begriffe werden vor Normalisierung abgelehnt.
- Backup-`data` muss ein echtes Objekt und darf kein Array sein.
- abgelehnte Imports verändern bestehende lokale Daten nicht.
- `app.js` liest die Limits aus dem Store statt eigene unabhängige Werte zu verwenden.
- `index.html` erklärt 50 Kategorien und 2–200 Begriffe sichtbar.
- `tests/storage.test.js` deckt 50/51, 200/201, UTF-8-Byte-Limit, korrupte lokale Übergrößen und Import-Rollback ab.
- `tests/word-imposter-data-contract.test.js` schützt Voting-, UI-, Store- und Backup-Grenzen.

### Hub Resume Integrity – v49

- `party-hub-resume-guard.js` Version 2 wurde zur zentralen getesteten Runtime-Quelle für direkte Hub-Resume-Integrität.
- `party-hub-polish.js` delegiert an denselben Guard statt Timer-/Resume-Validierung zu duplizieren.
- gekreuzte oder logisch widersprüchliche Timer-Snapshots werden verworfen.
- beim Verwerfen wird auch eine bereits sichtbare `#hub-resume-session`-Karte entfernt.
- gültige gespeicherte Sessions bleiben unangetastet.
- `tests/party-hub-resume-guard.test.js` prüft Modul, Runtime-Einbindung, Offline-Core, gültigen Resume und stale-Resume-UI-Race.

### Fail-closed Hub Resume Loading – v50

- konkretes Rest-Race geschlossen: Eine bereits gerenderte Resume-Karte darf nicht mehr anklickbar sein, während der Resume-Guard noch geladen beziehungsweise ausgeführt wird.
- `party-hub-polish.js` markiert die Resume-Fläche während der Prüfung als beschäftigt und deaktiviert Resume-/Discard-Aktionen sofort.
- erst nach erfolgreicher Guard-Validierung werden die Aktionen wieder freigegeben.
- Guard-Lade- oder Integritätsfehler bleiben fail-closed; ein ungeschützter Resume-Pfad wird nicht angeboten.
- `tests/party-hub-resume-guard.test.js` schützt zusätzlich den Ladephasen-/Interaktionsvertrag.
- Beta-/Manual-Testpläne führen die fehlende Interaktionsmöglichkeit vor Guard-Abschluss als realen HR2-Abnahmefall.

### PWA / Offline – v50

- Offline-Core auf **`secret-circle-v50` / `secret-circle-v50-staging`** erhöht, weil `party-hub-polish.js` als Offline-Core-Runtime geändert wurde.
- v46-/v47-A11y-Schichten, v48-Word-Imposter-Datenverträge und v49-Hub-Resume-Guard bleiben enthalten.
- `tests/service-worker.test.js` schützt Cachevertrag 50.
- Architektur, Deployment, Environment, Privacy, Hosting, README, Release-Status, Release-Checkliste, Beta-/Manual-Plan und A-bis-Z-Status sind auf v50 synchronisiert.
- reale Installations-, Upgrade-, Rollback-, Resume- und Offline-Gerätetests bleiben offen.

### Build / Supply Chain

- `package-lock.json` v3.
- Playwright-Kette exakt 1.54.2.
- keine npm-Runtime-Dependencies.
- CI/Cross-Browser verwenden `npm ci`.
- Syntax-/Unit-/Validate-Gates enthalten A11y-, Word-Imposter-Daten-, Operator- und Resume-Verträge.
- Online-`npm ci`-/Test-PASS bleibt wegen Hosted-Runner-Blocker offen.

### Operator / Hosting / Legal / Support

- `operator-release.json` bleibt `PREPARED / BLOCKED`.
- `OPERATOR_EVIDENCE_LOG.md` bündelt reale Hosting-, Support-, Security-, Probe-Support-, SEV-1-, Rollback- und Legal-/Privacy-Nachweise.
- Operator-Audit erzwingt bei späterem READY reale Privacy-/Legal-Dateien, veröffentlichte Betreiber-/Kontaktwerte, getrennte HTTPS-Origins und konsistente Links von allen fünf öffentlichen Einstiegseiten.
- `HOSTING_DECISION.md` erwartet v50 für Staging-/Production-Smokes.
- Issue #14 führt reale Betreiber-/Hosting-/Legal-/Support-/Incident-Evidence.
- reale Betreiberwerte, Provider/Origins, Support-/Securitytests und Drills bleiben offen.

### CI / Hosted Runner – P0

- letzter vollständig untersuchter v49-App-Actions-Lauf: **Run #2787**, Run ID `32871536761`, Job `validate` / `97879489858`, Head `a9ad91389ff9e966af432b0a77103ddc0960709d`.
- Ergebnis vor Step 1: `steps: null` / separate Abfrage `steps: []`.
- kein Checkout, npm, Test oder Repository-Code wurde ausgeführt.
- der isolierte Minimal-Runner-Probe ohne Repository-Code zeigte dasselbe Muster.
- Run #2787 bestätigt den identischen Pre-Step-Blocker ausdrücklich auf v49; für v50 wird daraus kein Test-PASS abgeleitet.
- unmittelbare Fehlerfläche bleibt vor der Workflow-Step-Ausführung; Details: Issue #7 / `CI_TROUBLESHOOTING.md`.

### Third Party / Assets

- Asset-Provenienz- und Rights-Sign-off-Verträge vorhanden.
- Root-`icon.svg` und Ableitungen bleiben bis echter Rechtebestätigung `unresolved`.

### Release-Status

- zentrale offene Issues: **#7 CI**, **#8 Geräte/Beta/A11y/Word-Imposter-Daten/Hub-Resume-v2**, **#14 Operator/Hosting/Legal/Support**.
- öffentlicher Release: **NO_GO**.
- kein CI-, Geräte-, Accessibility-, Daten-Grenz-, Resume-, Gruppen-, Asset-, Legal- oder Release-Evidence-PASS wird ohne echte Ausführung behauptet.