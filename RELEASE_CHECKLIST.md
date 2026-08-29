# Secret Circle – Release-Checkliste Januar 2027

Stand: 29. August 2026

Diese Checkliste gilt ausschließlich für **einen unveränderten Release-Candidate-Commit**. Vorhandener Code, Tests oder Dokumentation sind kein PASS ohne tatsächliche Ausführung/Abnahme.

Aktueller Offline-Core: **`secret-circle-v61` / `secret-circle-v61-staging`**.  
Built-ins: **47 · 15 Core / 13 Extended / 19 Labs**.  
Core Source Review/Hardening: **15/15 PREPARED**.  
Accessibility: **PREPARED**.  
Bestehende Spezialgates bis HS60: **quellsseitig PREPARED, real offen**.  
Wave-1-Labs Party Quiz / Fake oder Fakt: **quellsseitig PREPARED, real offen**.  
Öffentliche Freigabe: **NO_GO**.

## 1. Repository / CI / Build

Quellsseitig vorbereitet:

- [x] `package-lock.json` v3
- [x] CI/Cross-Browser verwenden `npm ci`
- [x] Release-/Foundation-/Backup-/Architecture-Audits
- [x] bestehende Advanced-/Quick-/Timer-/BFCache-/Background-/Hidden-Snapshot-Audits
- [x] **`scripts/wave_one_quiz_audit.py` im Validate-Gate**
- [x] Wave-1-Unit-/E2E-/Syntaxverträge im Buildpfad
- [x] 1000-Zeilen-Modulgrenze aktiv
- [x] Runner-Problem als Pre-Step-Problem isoliert

Für den RC offen:

- [ ] exakter Release-Commit und Tag
- [ ] Actions erreicht Step 1 / Checkout
- [ ] Online-`npm ci`
- [ ] `npm run check` / `npm test` / `npm run validate` / `npm run ci`
- [ ] Chromium / Firefox / WebKit auf demselben Commit
- [ ] Required Check + Branch Protection real aktiv

Letzter vollständig untersuchter Lauf: **#2787 auf v49**, `steps: null` / `steps: []`; kein Repositorycode wurde ausgeführt. **v50–v61 sind nicht runnerverifiziert.**

## 2. Bestehende Engine-/Session-/Daten-Gates

Quellsseitig vorbereitet:

- [x] Word-Imposter Voting-/Resume-/Datengrenzen
- [x] Hub Resume Guard + Ladequarantäne
- [x] Complete Backup / Forward Compatibility
- [x] sichere Hub-Current-/Paranoia-/Pre-Timer-Zustände
- [x] Advanced Integrity
- [x] Quick Replacement Guard **v2**
- [x] Quick Loader **v8**
- [x] Quick-Family Timer-/BFCache-/Background-/Hidden-Snapshot-Verträge über `party-session-controls.js` v5

Real zu bestätigen:

- [ ] bestehende Spezialgates DWI bis HS60
- [ ] Abschluss/Verlauf/Statistik exact-once

## 3. Wave 1 / v61 – neue Labs

Quellsseitig vorbereitet:

- [x] `party-wave-one-catalog.js` v2
- [x] `party-wave-one-modes.js` als gemeinsamer Runner
- [x] **Party Quiz**: 3 Packs / 24 Karten / Multiple Choice / Erklärung
- [x] **Fake oder Fakt**: 3 Packs / 24 Karten / Fakt-Fake / Erklärung
- [x] beide bleiben in `party-release-structure.js` ausdrücklich Labs
- [x] Wave-1-IDs nutzen denselben Quick-Family-Session-Replacement-Schutz
- [x] Party-Quiz-Ergebnisresume darf Score nicht erneut vergeben
- [x] `tests/party-wave-one-catalog.test.js`
- [x] `tests/e2e/wave-one-quiz.spec.js`
- [x] `scripts/wave_one_quiz_audit.py`
- [x] Katalog + Runner im v61 Offline-Core

Real offen:

- [ ] Party Quiz Chromium/Firefox/WebKit
- [ ] Fake oder Fakt Chromium/Firefox/WebKit
- [ ] beide in installierter PWA offline
- [ ] Reload/Resume und Cross-Game-Replacement real
- [ ] Tastatur/Touch/200-%-Zoom/Screenreader
- [ ] reale Gruppe ohne Entwicklerhilfe
- [ ] erst danach ggf. höhere Reifestufe; **Core bleibt 15**

## 4. Core / UX / Content

Für jedes Core-Spiel real: Start/Lobby/Regeln, Freiwilligkeit/Skip, Pause/Abbruch/Resume, Score/Winner, History/Stats, Tastatur/Fokus/Zoom/Reduced Motion sowie mindestens eine reale Gruppe ohne Entwicklerhilfe.

Für die große Bibliothek gilt zusätzlich: Standardspiele sollen in höchstens **2–3 Entscheidungen** zur ersten echten Spielaktion führen. Neue Themen sollen möglichst gemeinsame Engines wiederverwenden.

## 5. PWA / Offline – v61

- [ ] finaler Cache `secret-circle-v61` oder bewusst neuerer RC
- [ ] Staging-Cache gleiche Generation
- [ ] SW/Test/Architektur/Deployment/Privacy/Environment/Hosting synchron
- [ ] Kernseiten/Query-Routen offline
- [ ] Resume-/Privacy-/A11y-/Backup-Schichten offline
- [ ] `party-session-controls.js` v5 offline
- [ ] `quick-session-replacement-guard.js` v2 offline
- [ ] `quick-loader.js` v8 offline
- [ ] `party-wave-one-catalog.js` + `party-wave-one-modes.js` offline
- [ ] Update von mindestens zwei älteren Installationen auf v61/RC
- [ ] aktive Session und lokale Daten bleiben erhalten
- [ ] Rollback mit neuer Cachegeneration

## 6. HTTPS-Staging-Smoke / Production

- [ ] Provider/Produkt final
- [ ] getrennte HTTPS-Staging-/Production-Origin
- [ ] Log-/Retention-/Processor-/Drittlandprüfung
- [ ] `npm run staging:smoke -- <STAGING> --expected-cache secret-circle-v61` grün
- [ ] manueller PWA-Staging-Smoke einschließlich bestehender Spezialgates + Wave-1-Labs
- [ ] Production nutzt denselben RC
- [ ] `npm run staging:smoke -- <PRODUCTION> --expected-cache secret-circle-v61 --production` grün

## 7. Accessibility / Geräte

- [ ] Android + Chrome
- [ ] iPhone + Safari
- [ ] Tablet/iPad
- [ ] App-Wechsel / Screen-Lock / Prozess-Kill / Cold Resume
- [ ] 320 CSS px / 200-%-Zoom / Hoch-/Querformat
- [ ] vollständige Tastatur
- [ ] VoiceOver / TalkBack
- [ ] private Reveals / Resume mit Screenreader
- [ ] Wave-1-Quizantworten und Resultate zugänglich
- [ ] Safe Areas / große Systemschrift / Reduced Motion / Touchziele

## 8. Beta / Gruppen

- [ ] G1–G5
- [ ] bestehende Spezialgates
- [ ] PN1–PN3
- [ ] mindestens ein realer Nachweis pro Core-Spiel
- [ ] Party Quiz + Fake oder Fakt separat testen, falls im RC enthalten
- [ ] keine offenen Critical/High Bugs

## 9. Assets / Third Party / Legal / Betrieb

- [ ] kein Releaseasset `unresolved`
- [ ] Root-`icon.svg` Rechtebasis belegt oder ersetzt
- [ ] Betreiberidentität/Kontakt/Hosting final
- [ ] Privacy-/Legal-Flächen final
- [ ] Support-/Securitywege real getestet
- [ ] Probe-Supportfall / Probe-SEV-1 / HTTPS-Rollback-Drill
- [ ] reale Evidence im Operator-Log

## 10. Release Evidence / Freigabe

- [ ] `release-evidence.json = FINAL`
- [ ] 40-stelliger RC-Commit, Tag, App-Version, Cache, URLs, Freeze-Zeitpunkt
- [ ] alle Pflichtgates `PASS` auf demselben RC
- [ ] `knownBlockers` leer
- [ ] `operator-release.json = FINAL / READY`
- [ ] alle Release-Audits grün
- [ ] `releaseDecision = GO` erst danach

**Aktuell: NO_GO. PR #13 bleibt Draft und wird nicht gemergt.**
