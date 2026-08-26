# Secret Circle Party Hub

Secret Circle ist eine **offline-first Partyspiel-Plattform für gemeinsame Spiele auf einem Gerät**. Der Januar-2027-Release priorisiert sichere private Übergaben, belastbare Wiederaufnahme nach Unterbrechungen, lokale Datenkontrolle, Accessibility und nachvollziehbare Release-Gates.

## Aktueller Stand

- 45 technisch spielbare Built-ins
- 15 Core / 13 Extended / 17 Labs
- 27 Quick-/Trend-/Viral-Modi
- 4 Advanced-Kernspiele
- Word Imposter + Smart Party Night
- lokaler No-Code-Game-Creator
- Offline-PWA ohne Pflichtkonto, Tracking, Werbung oder Cloudzwang

Aktueller Offline-Core: **`secret-circle-v53` / `secret-circle-v53-staging`**  
Classic Content: **v4**  
Core Source Review: **15/15 PREPARED**  
Core Source Hardening: **15/15 PREPARED**  
Accessibility Source Hardening: **PREPARED**  
Word-Imposter Data/Resume Hardening: **PREPARED**  
Hub Resume Guard v2 + Lade-Quarantäne: **PREPARED**  
Complete Backup v51 Hardening: **PREPARED**  
Hub Round Resume v52: **PREPARED**  
Paranoia Resume/Privacy v53: **PREPARED**  
Operator / Hosting / Legal: **PREPARED / BLOCKED**  
Freigabe: **NO_GO**

**Technisch spielbar oder quellsseitig gehärtet ist nicht automatisch releasefertig.**

## Releaseziel

- funktionsfertig: 30. November 2026
- Code Freeze: 5. Dezember 2026
- RC: 15. Dezember 2026
- öffentlicher Release: 4.–15. Januar 2027

## Core-Hardening

Der vollständige 15-Core-Codepfad wird auf Setup, Geheimhaltung, Resume, Timer, Punkte und Anfänger-UX geprüft. Details: `CORE_GAME_ACCEPTANCE.md`.

## Word Imposter – v48

- nächster Wähler aus den tatsächlich offenen Vote-Keys
- manipulierte nicht-sequenzielle Voting-Snapshots werden verworfen
- maximal 50 eigene Kategorien / 200 Begriffe je Kategorie
- 51/201 werden abgelehnt statt still gekürzt
- Backupgrenze 1,5 MB UTF-8
- abgelehnte Imports verändern vorhandene Daten nicht

## Hub Resume – v49/v50

**v49:** zentraler `party-hub-resume-guard.js` Version 2.  
**v50:** sichtbare Resume-Karte bleibt während Guard-Prüfung fail-closed (`aria-busy`, deaktivierte Aktionen), bis der Snapshot validiert ist.

## Complete Backup – v51

- `backup-schema-registry.js` Version 2 ist die zentrale Quelle
- `party-data-tools.js` Version 6 konsumiert den Vertrag
- Restore besitzt nur registrierte aktuelle Storage-Keys
- Future-Namespaces/-Storage-Versionen bleiben bei älterem Restore unangetastet
- managed Werte werden vollständig vor Mutation geprüft
- Rollback verändert nur managed Daten
- „Alle lokalen Daten löschen“ bleibt bewusst prefixweit

## Hub Round Resume – v52

- `party-hub-round-state.js` eingeführt
- sichere Truth-Dare-/Prompt-/Choice-Karten bleiben über Reload/Resume identisch
- Wahrheit und Pflicht besitzen getrennte Usage-Pools
- ungültige `current`-Referenzen werden verworfen
- `next`/Skip löschen den alten Current-Zustand

## Paranoia Resume/Privacy – v53

v53 schließt zwei weitere Kontinuitäts-/Privacy-Lücken im Paranoia-Core:

- eine bereits geöffnete geheime Frage wird als **validierte Kartenreferenz**, nicht als frei kopierter Geheimtext, fortgesetzt
- nach Reload bleibt der Bildschirm gedeckt; erst „Geheime Frage anzeigen“ zeigt **dieselbe** Frage wieder
- nach dem Münzwurf werden Phase und boolesches Ergebnis gespeichert; Resume würfelt nicht erneut
- ein bereits aufgelöster Zustand bleibt nach Reload gedeckt und wird erst über „Rundenergebnis anzeigen“ wieder sichtbar
- `party-hub-polish.js` Version 17 verdeckt Paranoia jetzt auch **nach dem Münzwurf** bei Blur/Appwechsel
- manipulierte/out-of-range Referenzen sowie `resolved` ohne boolesches Ergebnis werden verworfen
- `party-hub.js` wurde nach dem Ausbau wieder deutlich unter die verbindliche 1000-Zeilen-Grenze gebracht

Source-/Browserverträge:

- `tests/hub-resume-contract.test.js`
- `tests/e2e/core-hub-resume.spec.js`
- `tests/e2e/core-hub-controls.spec.js`
- `scripts/architecture_audit.py`

Der reale Release-Nachweis heißt **PR53**.

## Accessibility – v46/v47

- `party-hub-a11y.js`: Hub-Bereichsfokus, modale Kontexte, `inert`, Fokus-Trap, Rückkehrfokus
- `secondary-surface-a11y.js`: Advanced, Quick und Creator
- Creator-Radiogroup mit Pfeiltasten/Home/End

Beide Schichten bleiben Bestandteil von v53. VoiceOver, TalkBack, 200-%-Zoom, Touch und reale Geräte-/Browserabnahme bleiben offen.

## Build / Supply Chain

- `package-lock.json` v3
- Playwright 1.54.2 exakt
- keine npm-Runtime-Dependencies
- CI/Cross-Browser verwenden `npm ci`
- `party-hub-round-state.js`, Hub-Resume-E2E und Hub-Control-E2E sind im Syntax-Preflight
- `architecture_audit.py` prüft v53-Modul-/Privacy-/Offline-/1000-Zeilen-Verträge

## CI – extern blockiert

Letzter vollständig untersuchter App-Actions-Lauf: **Run #2787 auf v49**.

- Run ID `32871536761`
- Job `validate`, Job ID `97879489858`
- Head `a9ad91389ff9e966af432b0a77103ddc0960709d`
- `failure`
- `steps: null` / `steps: []`
- kein Checkout, npm, Test oder Repositorycode ausgeführt

Der Minimal-Runner-Probe ohne Repository-Code zeigte dasselbe Muster. **v50, v51, v52 und v53 sind daher noch nicht runnerverifiziert.** Details: Issue #7 / `CI_TROUBLESHOOTING.md`.

## Assets / Rechte

Die technische Icon-Provenienz ist dokumentiert. Die Rechtebasis des Root-`icon.svg` bleibt `unresolved`; damit bleibt `ASSETS / THIRD PARTY` blockiert.

## Zentrale offene Issues

1. **#7** – GitHub Actions / Hosted Runner endet vor Step 1
2. **#8** – reale Geräte, v53 Offline-PWA, Accessibility, DWI, HR2, BK51, HR52, PR53 und Partytests
3. **#14** – Operator, Hosting, Legal, Support und Incident Evidence

## Höchste Priorität

1. Hosted Runner / Online-`npm ci` / CI / Cross-Browser
2. Branch Protection
3. Provider + getrennte HTTPS-Staging-/Production-Origin
4. v53 PWA-Smoke / Upgrade / Rollback
5. DWI + HR2 + BK51 + HR52 + **PR53** real prüfen
6. Android/iPhone/iPad/VoiceOver/TalkBack/Tastatur/Zoom
7. reale Gruppentests für alle 15 Core-Games
8. Icon-/Third-Party- und Operator-/Legal-/Support-/Incident-Sign-off
9. unveränderlicher RC + `release-evidence.json = FINAL / GO`

**Aktuell: NO_GO. PR #13 bleibt Draft und wird nicht gemergt.**