# Changelog

Alle nennenswerten Änderungen an Secret Circle werden hier dokumentiert.

## Unreleased – Januar-2027 Release Foundation

Stand: 25. August 2026

### Release-/A-bis-Z-Prozess

- A-bis-Z-Masterprozess, Status-/Risk-/Release-/Operator-/Hosting-/Accessibility-/Beta-/Legal-/Support-/Incident-Verträge aufgebaut.
- 15/15 Core Source Review und 15/15 Core Source Hardening stehen auf **PREPARED**.
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
- **Advanced:** `advanced-play-layer` als `role="dialog"` + `aria-modal="true"`; Setup-/Seitenhintergrund wird `inert`; Tab/Shift+Tab bleibt im aktiven Spiel; dynamischer Fokus wird nach Phasenwechseln wiederhergestellt.
- **Quick:** Fokus-Recovery nach dynamischen DOM-Phasenwechseln; besonders Spektrum-Tipp kann nach dem Geräte-Handoff den neuen Range-Regler sinnvoll fokussieren.
- **Creator:** Wizard-Schrittüberschriften werden tatsächlich programmatisch fokussierbar; Hilfe-Dialog isoliert den Hintergrund, trappt Fokus und stellt Rückkehrfokus her.
- **Creator Template-Radiogroup:** roving `tabindex`, ArrowRight/ArrowDown/ArrowLeft/ArrowUp sowie Home/End.
- `tests/accessibility-contract.test.js` um Secondary-Surface-Verträge erweitert.
- `tests/e2e/accessibility-core.spec.js` enthält neue Browserpfade für Advanced, Quick und Creator.
- `scripts/secondary_surface_a11y_contract_audit.py` neu und in `npm run validate` eingebunden.
- `scripts/architecture_audit.py` behandelt `secondary-surface-a11y.js` als Production-/Offline-Modul und prüft die Ladereihenfolge auf Advanced/Quick/Creator.
- reale VoiceOver-/TalkBack-/Zoom-/Touch-/Browser-Abnahme bleibt offen; Accessibility bleibt **PREPARED**, nicht PASS.

### PWA / Offline – v47

- Offline-Core auf **`secret-circle-v47` / `secret-circle-v47-staging`** erhöht.
- `secondary-surface-a11y.js` in den Service-Worker-Core aufgenommen.
- `tests/service-worker.test.js` auf Cachevertrag 47 erweitert.
- Architektur, Deployment, Environment, Privacy, Hosting, Accessibility, Release-Checkliste, Beta-/Manual-Testplan, Issue #8, README und Statusdokumente auf v47 synchronisiert.
- Operator- und Readiness-Audits leiten die aktive Cachegeneration aus `sw.js` ab, um erneute Version-Drift zu vermeiden.
- reale Installations-, Upgrade-, Rollback- und Offline-Gerätetests bleiben offen.

### Build / Supply Chain

- `package-lock.json` v3.
- Playwright-Kette exakt 1.54.2.
- keine npm-Runtime-Dependencies.
- CI/Cross-Browser verwenden `npm ci`.
- Syntaxgate enthält beide A11y-Runtime-Schichten.
- Validate-Gate enthält Hub-A11y- und Secondary-Surface-A11y-Audits.
- Online-`npm ci`-/Test-PASS bleibt wegen Hosted-Runner-Blocker offen.

### Operator / Hosting / Legal / Support

- `operator-release.json` bleibt `PREPARED / BLOCKED`.
- `HOSTING_DECISION.md` erwartet v47 für Staging-/Production-Smokes.
- Issue #14 führt reale Betreiber-/Hosting-/Legal-/Support-/Incident-Evidence.
- reale Betreiberwerte, Provider/Origins, Support-/Securitytests und Drills bleiben offen.

### CI / Hosted Runner – P0

- Run #2637 zeigte erneut das bekannte Pre-Step-Muster `steps: []`.
- kein Checkout, npm oder Repository-Code wurde ausgeführt.
- der isolierte Minimal-Runner-Probe ohne Repository-Code zeigte dasselbe Muster.
- unmittelbare Fehlerfläche bleibt vor der Workflow-Step-Ausführung; Details: Issue #7 / `CI_TROUBLESHOOTING.md`.

### Third Party / Assets

- Asset-Provenienz- und Rights-Sign-off-Verträge vorhanden.
- Root-`icon.svg` und Ableitungen bleiben bis echter Rechtebestätigung `unresolved`.

### Release-Status

- zentrale offene Issues: **#7 CI**, **#8 Geräte/Beta/A11y**, **#14 Operator/Hosting/Legal/Support**.
- öffentlicher Release: **NO_GO**.
- kein CI-, Geräte-, Accessibility-, Gruppen-, Asset-, Legal- oder Release-Evidence-PASS wird ohne echte Ausführung behauptet.
