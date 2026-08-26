# Changelog

Alle nennenswerten Änderungen an Secret Circle werden hier dokumentiert.

## Unreleased – Januar-2027 Release Foundation

Stand: 26. August 2026

### Release-Status

- 15/15 Core Source Review: **PREPARED**
- 15/15 Core Source Hardening: **PREPARED**
- Accessibility Source Hardening: **PREPARED**
- Word-Imposter Data/Resume: **PREPARED**
- Hub Resume Guard v2 + v50-Ladequarantäne: **PREPARED**
- Complete Backup v51: **PREPARED**
- Hub Round Resume v52: **PREPARED**
- Paranoia Resume/Privacy v53: **PREPARED**
- `release-evidence.json`: **PREPARED / NO_GO**
- PR #13: **Draft / ungemergt**

### v46 – Hub Accessibility

`party-hub-a11y.js`: Bereichsfokus, modale Hintergrundisolation, Fokus-Trap und Rückkehrfokus; Unit-/E2E-/Auditverträge ergänzt.

### v47 – Advanced/Quick/Creator Accessibility

`secondary-surface-a11y.js`: Advanced-Modal-Isolation, Quick-Fokus-Recovery, Creator-Wizard-Fokus und Radiogroup-Tastaturvertrag.

### v48 – Word-Imposter Data/Resume

- nächster Wähler aus tatsächlichen offenen Vote-Keys
- manipulierte nicht-sequenzielle Voting-Snapshots verworfen
- maximal 50 Kategorien / 200 Begriffe je Kategorie
- 1,5 MB UTF-8 pro Word-Imposter-Backup
- 51/201 fail-closed; kein stilles Trunkieren
- abgelehnte Imports verändern Bestandsdaten nicht

### v49 – Hub Resume Integrity

`party-hub-resume-guard.js` v2 wurde zentrale Runtime-/Testquelle. Cross-Mode-/Timer-Inkonsistenzen werden verworfen; stale Resume UI wird entfernt.

### v50 – Fail-closed Hub Resume Loading

Sichtbare Resume-Aktionen bleiben während Guard-Prüfung gesperrt (`aria-busy`, deaktivierte Buttons). Guard-Lade-/Integritätsfehler bleiben fail-closed. Browserfälle für verzögerte/fehlgeschlagene Guard-Ladung ergänzt.

### v51 – Complete Backup / Forward Compatibility

- `backup-schema-registry.js` v2 als zentrale aktuelle Key-/Schemaquelle
- breite Party-Wildcard entfernt
- Future-Namespaces/-Storage-Versionen bleiben außerhalb heutigen Restore-Eigentums
- `party-data-tools.js` v6
- vollständige Vorvalidierung vor Mutation
- managed-only Snapshot/Restore/Rollback
- explizite Komplettlöschung bleibt prefixweit
- BK51 als eigener Realtest definiert

### v52 – Hub Round Resume / Truth-Dare Usage

- neues `party-hub-round-state.js`
- sichere Truth-Dare-/Prompt-/Choice-Current-Referenzen
- geöffnete sichere Karte bleibt nach Reload/Resume identisch
- Wahrheit/Pflicht besitzen getrennte Usage-Pools
- manipulierte/out-of-range Current-Referenzen werden verworfen
- `next` und Skip löschen alten Current-Zustand
- HR52 als eigener Realtest definiert

### v53 – Paranoia Resume / Privacy

- `party-hub-round-state.js` auf **Version 2** erweitert.
- Paranoia speichert eine validierte Kartenreferenz statt freien Geheimtext im Current-Zustand.
- erlaubte Phasen: private Frage offen bzw. bereits aufgelöster Münzwurfzustand; ungültige Referenzen/Phasen werden verworfen.
- Reload/Resume öffnet die Geheimfrage **nicht automatisch**.
- nach bewusster Reveal-Aktion wird **dieselbe zuvor verwendete Frage** wieder angezeigt.
- ein bereits gefällter Münzwurf bleibt über Reload/Resume identisch; es erfolgt kein zweiter Zufallswurf.
- `party-hub-polish.js` auf **Version 17**: Fokus-/Appverlust verdeckt Paranoia auch nach dem Münzwurf/Auflösungszustand.
- `tests/hub-resume-contract.test.js` schützt Paranoia-Referenz, Phase, Ergebnis und Bounds.
- `tests/e2e/core-hub-resume.spec.js` schützt same-question/no-auto-reveal/same-result Resume.
- `tests/e2e/core-hub-controls.spec.js` schützt Blur-Concealment nach der Auflösung.
- `party-hub.js` wurde ohne Lockerung der Architekturgrenze wieder deutlich unter 1000 Zeilen gehalten.
- `scripts/architecture_audit.py` prüft den präzisierten Secret-Resume-Vertrag.
- **PR53** als eigener Realtest in Beta/Manual/Issue #8 definiert.

### PWA / Offline – v53

- Offline-Core: **`secret-circle-v53` / `secret-circle-v53-staging`**.
- `party-hub-round-state.js` v2 und `party-hub-polish.js` v17 sind offline enthalten.
- v46–v52-Verträge bleiben Bestandteil des Offline-Core.
- Service-Worker-Test, Architektur, Deployment, Environment, Privacy und Hosting sind auf v53 synchronisiert.
- reale Installation, Upgrade, Rollback, DWI, HR2, BK51, HR52 und PR53 bleiben offen.

### Build / Supply Chain

- `package-lock.json` v3
- Playwright exakt 1.54.2
- keine npm-Runtime-Dependencies
- CI/Cross-Browser verwenden `npm ci`
- Syntax-/Unit-/Validate-/E2E-Gates enthalten die aktuellen Hub-Round-/Paranoia-Verträge
- Online-`npm ci`-/Test-PASS bleibt wegen Hosted-Runner-Blocker offen

### CI / Hosted Runner – P0

Letzter vollständig untersuchter App-Actions-Lauf: **Run #2787 auf v49**, Run ID `32871536761`, Job `97879489858`, Head `a9ad91389ff9e966af432b0a77103ddc0960709d`, `steps: null` / `steps: []`. Kein Checkout, npm, Test oder Repositorycode wurde ausgeführt. Der Minimal-Runner-Probe zeigte dasselbe Muster ohne Repository-Code.

**Für v50–v53 wird daraus kein Test-PASS abgeleitet.**

### Operator / Assets

- `operator-release.json` bleibt `PREPARED / BLOCKED`.
- reale Hosting-/Legal-/Support-/Incident-Evidence bleibt offen.
- Root-`icon.svg` und Ableitungen bleiben bis echter Rechtebestätigung `unresolved`.

### Releaseentscheidung

Zentrale offene Issues: **#7 CI**, **#8 Geräte/Beta/A11y/DWI/HR2/BK51/HR52/PR53**, **#14 Operator/Hosting/Legal/Support**.

Öffentlicher Release: **NO_GO**.