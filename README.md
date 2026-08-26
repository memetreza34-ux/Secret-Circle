# Secret Circle Party Hub

Secret Circle ist eine **offline-first Partyspiel-Plattform für gemeinsame Spiele auf einem Gerät**. Der Januar-2027-Release priorisiert sichere private Übergaben, Wiederaufnahme nach Unterbrechungen, lokale Datenkontrolle, Accessibility und belastbare Release-Gates.

## Aktueller Stand

- 45 technisch spielbare Built-ins
- 15 Core / 13 Extended / 17 Labs
- 27 Quick-/Trend-/Viral-Modi
- 4 Advanced-Kernspiele
- Word Imposter + Smart Party Night
- lokaler No-Code-Game-Creator
- Offline-PWA ohne Pflichtkonto, Tracking, Werbung oder Cloudzwang

Aktueller Offline-Core: **`secret-circle-v51` / `secret-circle-v51-staging`**  
Classic Content: **v4**  
Core Source Review: **15/15 PREPARED**  
Core Source Hardening: **15/15 PREPARED**  
Accessibility Source Hardening: **PREPARED**  
Word-Imposter Data/Resume Hardening: **PREPARED**  
Hub Resume Guard v2 + Lade-Quarantäne: **PREPARED**  
Complete Backup v51 Hardening: **PREPARED**  
Operator / Hosting / Legal: **PREPARED / BLOCKED**  
Freigabe: **NO_GO**

**Technisch spielbar oder quellsseitig gehärtet ist nicht automatisch releasefertig.**

## Releaseziel

- funktionsfertig: 30. November 2026
- Code Freeze: 5. Dezember 2026
- RC: 15. Dezember 2026
- öffentlicher Release: 4.–15. Januar 2027

## Core-Hardening

Der vollständige 15-Core-Codepfad wurde auf Setup, Geheimhaltung, Resume, Timer, Punkte und Anfänger-UX geprüft. Details: `CORE_GAME_ACCEPTANCE.md`.

Wichtige Verträge: Word-Imposter-Setup/Fairness/Voting/Resume, freiwillige Social-Games, Paranoia-/Scharade-/Tabu-Privacy, Heiße-Kartoffel-Timer 10–25 s, Wortketten-/Wrong-Answers-Regeln sowie Advanced Resume/Privacy inklusive Mafia-Integrität.

## Word Imposter – v48-Verträge

Die in v48 eingeführten Daten-/Resume-Verträge bleiben im aktuellen v51-Core enthalten:

- nächster Wähler aus den tatsächlich offenen Vote-Keys
- manipulierte nicht-sequenzielle Voting-Snapshots werden verworfen
- maximal 50 eigene Kategorien
- maximal 200 Begriffe je Kategorie
- 51/201 werden abgelehnt statt still gekürzt
- Backupgrenze 1,5 MB UTF-8
- abgelehnte Imports verändern vorhandene Daten nicht

`tests/storage.test.js` und `tests/word-imposter-data-contract.test.js` schützen diese Source-Verträge.

## Hub Resume – v49/v50

**v49** zentralisierte die direkte Hub-Resume-Integrität auf `party-hub-resume-guard.js` Version 2. `party-hub-polish.js` delegiert an denselben Guard, den die Tests prüfen.

**v50** schließt zusätzlich das Ladefenster vor der Guard-Validierung:

- eine bereits sichtbare Resume-Karte wird während der Guard-Prüfung `aria-busy`
- Resume-Buttons werden sofort deaktiviert
- erst ein erfolgreich validierter Snapshot wird wieder freigegeben
- bei Lade-/Integritätsfehler bleibt der Flow fail-closed
- ein verworfener Snapshot entfernt auch eine bereits gerenderte Resume-Karte

Zusätzlich deckt `tests/e2e/core-hub-resume.spec.js` die Browserwirkung der verzögerten bzw. fehlschlagenden Guard-Ladung ab.

## Complete Backup – v51

v51 härtet vollständige lokale Exporte/Restores, ohne das Backup-Dateiformat Version 1 unnötig zu ändern:

- `backup-schema-registry.js` Version 2 ist die zentrale Quelle
- `party-data-tools.js` Version 6 konsumiert diesen Vertrag
- Restore besitzt nur 16 explizit registrierte aktuelle Storage-Keys
- zukünftige Namespaces und Storage-Versionen werden weder importiert noch von einem heutigen Restore gelöscht
- jeder managed Wert braucht gültiges JSON, den erwarteten Root-Typ, die erwartete aktuelle Storage-Version und minimale Pflichtwrapper
- vollständige Validierung erfolgt vor der ersten Mutation
- Schreibfehler rollen nur den managed Zustand auf den vorherigen Snapshot zurück
- die bewusst bestätigte Funktion „Alle lokalen Daten löschen“ bleibt dagegen prefixweit

Automatische Grenzen: `tests/backup-schema-registry.test.js`, `tests/e2e/party-data.spec.js`, `tests/e2e/backup-forward-compat.spec.js` und `scripts/backup_contract_audit.py`.

## Accessibility – v46/v47

- `party-hub-a11y.js`: Hub-Bereichsfokus, modale Kontexte, `inert`, Fokus-Trap, Rückkehrfokus
- `secondary-surface-a11y.js`: Advanced, Quick und Creator
- Creator-Radiogroup mit Pfeiltasten/Home/End

Beide Schichten bleiben Bestandteil von v51. **Noch kein Accessibility PASS:** VoiceOver, TalkBack, 200-%-Zoom, Touch und reale Geräte-/Browserabnahme bleiben offen.

## Release-/Operator-Verträge

Zentrale Dateien:

- `APP_ENTWICKLUNG_VON_A_BIS_Z.md`
- `APP_DEVELOPMENT_STATUS.md`
- `RELEASE_STATUS.md`
- `RELEASE_CHECKLIST.md`
- `RELEASE_EVIDENCE.md` / `release-evidence.json`
- `operator-release.json`
- `OPERATOR_RELEASE_SIGNOFF.md`
- `OPERATOR_EVIDENCE_LOG.md`
- `HOSTING_DECISION.md`
- `CI_TROUBLESHOOTING.md`
- `BETA_TEST_PLAN.md`
- `MANUAL_TEST_PLAN.md`

Die zentralen Release-Audits sind **transition-safe**: Sie akzeptieren heute PREPARED/NO_GO und blockieren später keinen korrekt belegten FINAL/GO-Zustand durch historische OPEN-/NO_GO-Hardcodes.

## Build / Supply Chain

- `package-lock.json` v3
- Playwright 1.54.2 exakt
- keine npm-Runtime-Dependencies
- CI/Cross-Browser verwenden `npm ci`
- `npm run validate` enthält den eigenen Complete-Backup-Contract-Audit
- `validate_project.py` prüft aktuelle Runtime-Scriptketten und den Hub-Resume-Loadervertrag

## CI – extern blockiert

Letzter vollständig untersuchter App-Actions-Lauf: **Run #2787 auf v49**.

- Run ID `32871536761`
- Job `validate`, Job ID `97879489858`
- Head `a9ad91389ff9e966af432b0a77103ddc0960709d`
- `failure`
- `steps: null` / separate Abfrage `steps: []`
- kein Checkout, npm, Test oder Repositorycode ausgeführt

Der frühere Minimal-Runner-Probe ohne Checkout/Setup/npm/Playwright zeigte dasselbe Muster. Run #2787 bestätigt den Pre-Step-Blocker historisch auf v49; **v50 und v51 sind deshalb ebenfalls noch nicht runnerverifiziert**. Details: Issue #7 / `CI_TROUBLESHOOTING.md`.

## Assets / Rechte

Die technische Icon-Provenienz ist dokumentiert. Die Rechtebasis des Root-`icon.svg` bleibt `unresolved`; damit bleibt `ASSETS / THIRD PARTY` blockiert.

## Zentrale offene Issues

1. **#7** – GitHub Actions / Hosted Runner endet vor Step 1
2. **#8** – reale Geräte, v51 Offline-PWA, Accessibility, Word-Imposter-Datengrenzen, Hub-Resume-v2/v50-Ladequarantäne, Complete-Backup-v51 und Partytests
3. **#14** – Operator, Hosting, Legal, Support und Incident Evidence

## Höchste Priorität

1. Hosted Runner bis zum ersten echten Step reparieren
2. Online-`npm ci` + CI/Cross-Browser
3. Branch Protection real bestätigen
4. Provider + getrennte HTTPS-Staging-/Production-Origin
5. v51 PWA-/Staging-Smoke, Upgrade und Rollback
6. Word-Imposter-Datengrenzen + Hub Resume Guard v2/v50-Ladequarantäne + Complete-Backup-v51 real prüfen
7. Android/iPhone/iPad/VoiceOver/TalkBack/Tastatur/Zoom
8. reale Gruppentests für alle 15 Core-Games
9. Icon-/Third-Party- und Operator-/Legal-/Support-/Incident-Sign-off
10. unveränderlicher RC + `release-evidence.json = FINAL / GO`

**Aktuell: NO_GO. PR #13 bleibt Draft und wird nicht gemergt.**