# Changelog

Alle nennenswerten Änderungen an Secret Circle werden hier dokumentiert.

## Unreleased – Januar-2027 Release Foundation

Stand: 26. August 2026

### Release-/A-bis-Z-Prozess

- A-bis-Z-Masterprozess, Status-/Risk-/Release-/Operator-/Hosting-/Accessibility-/Beta-/Legal-/Support-/Incident-Verträge aufgebaut.
- 15/15 Core Source Review und 15/15 Core Source Hardening stehen auf **PREPARED**.
- Accessibility Source Hardening steht auf **PREPARED**.
- Word-Imposter Data/Resume Hardening steht auf **PREPARED**.
- Hub Resume Integrity v2 + v50-Ladequarantäne stehen auf **PREPARED**.
- Complete Backup v51 Hardening steht auf **PREPARED**.
- Hub Round Resume v52 steht auf **PREPARED**.
- `release-evidence.json` bleibt bewusst `PREPARED / NO_GO`; kein unveränderter RC ist eingefroren.
- PR #13 bleibt Draft und ungemergt.
- zentrale Release-Audits sind transition-safe.

### Core-Hardening

- Word Imposter: Setup, Rollenfairness, Voting-/Resume-Integrität und Geheimkarten-Schutz.
- Social Hub: Freiwilligkeit/Skip und verständliche Live-Regeln.
- Paranoia/Scharade/Tabu: private Inhalte bei Fokusverlust geschützt.
- Heiße Kartoffel: versteckter Timer exakt 10–25 Sekunden.
- Wortkette / Nur falsche Antworten: manueller Regel-/Ergebnisvertrag geklärt.
- Advanced: Privacy-/Resume-Guards für Two Truths, Question Imposter, Location Spy und Mafia.

### Hub-Accessibility-Hardening – v46

- `party-hub-a11y.js` Version 2 ergänzt.
- Bereichswechsel, Modal-Fokus, `inert`, Fokus-Trap und Rückkehrfokus gehärtet.
- Unit-/Playwright-/Auditverträge ergänzt.

### Advanced-/Quick-/Creator-Accessibility-Hardening – v47

- `secondary-surface-a11y.js` ergänzt.
- Advanced-Modal-Isolation, Quick-Fokus-Recovery und Creator-Wizard-/Radiogroup-Tastaturvertrag gehärtet.
- reale VoiceOver-/TalkBack-/Zoom-/Touch-/Browser-Abnahme bleibt offen.

### Word-Imposter Data/Resume Hardening – v48

- nächste abstimmende Person wird aus tatsächlichen offenen Vote-Keys bestimmt.
- nicht-sequenzielle manipulierte Voting-Snapshots werden verworfen.
- maximal 50 eigene Kategorien, maximal 200 Begriffe je Kategorie, 1,5 MB UTF-8 pro Word-Imposter-Backup.
- 51/201 werden fail-closed abgelehnt; kein stilles Trunkieren.
- abgelehnte Imports verändern Bestandsdaten nicht.
- Source-Verträge in `tests/storage.test.js` und `tests/word-imposter-data-contract.test.js`.

### Hub Resume Integrity – v49

- `party-hub-resume-guard.js` Version 2 wurde zentrale Runtime-/Testquelle.
- gekreuzte oder widersprüchliche Timer-Snapshots werden verworfen.
- stale Resume UI wird beim Verwerfen entfernt.

### Fail-closed Hub Resume Loading – v50

- sichtbare Resume-Karte ist während Guard-Prüfung `aria-busy`.
- Resume-/Discard-Aktionen bleiben bis erfolgreicher Validierung deaktiviert.
- Guard-Lade-/Integritätsfehler bleiben fail-closed.
- Browserfälle in `tests/e2e/core-hub-resume.spec.js` ergänzt.

### Complete Backup / Forward Compatibility – v51

- `backup-schema-registry.js` Version 2 ist verbindliche Quelle für aktuelle Complete-Backup-Storage-Keys.
- breite Party-Wildcard entfernt; zukünftige Namespaces/Storage-Versionen gehören nicht einem heutigen Restore.
- managed Keys besitzen Root-/Storage-Version-/Minimalwrapper-Verträge.
- `party-data-tools.js` auf Version 6 erhöht und an Registry gebunden.
- Complete Restore validiert vor Mutation, snapshotet/ersetzt/rollt nur managed Keys zurück.
- unbekannte/future Namespaces bleiben auch bei Rollback unverändert.
- vollständige Datenlöschung bleibt bewusst prefixweit.
- `tests/e2e/backup-forward-compat.spec.js` und `scripts/backup_contract_audit.py` ergänzt.
- BK51 als eigener realer Beta-/Manual-Testfall definiert.

### Hub Round Resume / Truth-Dare Usage – v52

- neuen kleinen Runtime-Vertrag `party-hub-round-state.js` ergänzt.
- direkter Hub nutzt `session.current` jetzt tatsächlich für **sichere, nicht-geheime** laufende Karten.
- bereits angezeigte Wahrheit-/Pflicht-Karte bleibt nach Reload/Resume dieselbe Karte, statt verloren zu gehen und eine neue Karte zu ziehen.
- Wahrheit und Pflicht besitzen getrennte Usage-Pools; gleiche numerische Indizes blockieren sich nicht mehr gegenseitig.
- normale Prompt-/Choice-Runden können denselben sicheren Current-Zustand wiederherstellen.
- gespeicherte Current-Referenzen werden gegen Spielmodus, Typ und Kartenbereich validiert.
- manipulierte/out-of-range Current-Referenzen werden verworfen.
- Paranoia und andere geheime Inhalte sind ausdrücklich nicht Teil des v52-Current-Auto-Resume.
- `nextSimpleRound()` und globales Skip löschen Current vor der nächsten Runde.
- `tests/hub-resume-contract.test.js` um funktionale Round-State-Verträge erweitert.
- `tests/e2e/core-hub-resume.spec.js` um Truth/Dare-/Prompt-/Privacy-Reloadfälle erweitert.
- `scripts/architecture_audit.py` prüft das neue Modul, Scriptreihenfolge, Offline-Core und Secret-Current-Grenze.
- HR52 als eigener realer Beta-/Manual-Testfall definiert.

### PWA / Offline – v52

- Offline-Core auf **`secret-circle-v52` / `secret-circle-v52-staging`** erhöht, weil `party-hub-round-state.js` neue Offline-Runtime ist.
- `party-hub-round-state.js` in die CORE-Liste aufgenommen.
- `tests/service-worker.test.js` schützt Cachevertrag 52 und Offline-Einbindung des neuen Moduls.
- v46/v47 A11y, v48 Word-Imposter, v49/v50 Hub Guard und v51 Complete Backup bleiben enthalten.
- Architektur, Deployment, Environment, Privacy, Hosting, README, Release-Status, Release-Checkliste, Beta-/Manual-Plan und A-bis-Z-Status werden auf v52 synchronisiert.
- reale Installations-, Upgrade-, Rollback-, Resume-, Backup- und Offline-Gerätetests bleiben offen.

### Build / Supply Chain

- `package-lock.json` v3.
- Playwright-Kette exakt 1.54.2.
- keine npm-Runtime-Dependencies.
- CI/Cross-Browser verwenden `npm ci`.
- Syntax-/Unit-/Validate-/E2E-Gates enthalten v52-Round-State-Verträge.
- Online-`npm ci`-/Test-PASS bleibt wegen Hosted-Runner-Blocker offen.

### Operator / Hosting / Legal / Support

- `operator-release.json` bleibt `PREPARED / BLOCKED`.
- `OPERATOR_EVIDENCE_LOG.md` bündelt reale Hosting-, Support-, Security-, SEV-1-, Rollback- und Legal-/Privacy-Nachweise.
- `HOSTING_DECISION.md` erwartet v52 für Staging-/Production-Smokes und HR52 zusätzlich zu BK51.
- reale Betreiberwerte, Provider/Origins, Support-/Securitytests und Drills bleiben offen.

### CI / Hosted Runner – P0

- letzter vollständig untersuchter App-Actions-Lauf: **Run #2787 auf v49**, Run ID `32871536761`, Job `validate` / `97879489858`, Head `a9ad91389ff9e966af432b0a77103ddc0960709d`.
- Ergebnis vor Step 1: `steps: null` / separate Abfrage `steps: []`.
- kein Checkout, npm, Test oder Repository-Code wurde ausgeführt.
- der isolierte Minimal-Runner-Probe ohne Repository-Code zeigte dasselbe Muster.
- **für v50, v51 oder v52 wird daraus kein Test-PASS abgeleitet.**

### Third Party / Assets

- Asset-Provenienz- und Rights-Sign-off-Verträge vorhanden.
- Root-`icon.svg` und Ableitungen bleiben bis echter Rechtebestätigung `unresolved`.

### Release-Status

- zentrale offene Issues: **#7 CI**, **#8 Geräte/Beta/A11y/Daten/Hub-Resume/BK51/HR52**, **#14 Operator/Hosting/Legal/Support**.
- öffentlicher Release: **NO_GO**.
- kein CI-, Geräte-, Accessibility-, Resume-, Backup-, Gruppen-, Asset-, Legal- oder Release-Evidence-PASS wird ohne echte Ausführung behauptet.