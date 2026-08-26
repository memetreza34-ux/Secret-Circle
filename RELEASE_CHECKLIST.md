# Secret Circle – Release-Checkliste Januar 2027

Stand: 26. August 2026

Diese Checkliste gilt ausschließlich für **einen unveränderten Release-Candidate-Commit**. Vorhandener Code, Tests oder Dokumentation sind kein PASS ohne tatsächliche Ausführung/Abnahme.

Aktueller Offline-Core: **`secret-circle-v56` / `secret-circle-v56-staging`**.  
Core Source Review/Hardening: **15/15 PREPARED**.  
Accessibility: **PREPARED**.  
DWI / HR2 / BK51 / HR52 / PR53 / PT54 / AD55 / QR56: **quellsseitig PREPARED, real offen**.  
Öffentliche Freigabe: **NO_GO**.

## 1. Repository / CI / Build

Quellsseitig vorbereitet:

- [x] `package-lock.json` v3
- [x] CI/Cross-Browser verwenden `npm ci`
- [x] Release-/Foundation-/Backup-/Architecture-Audits
- [x] `scripts/advanced_integrity_audit.py` im Validate-Gate
- [x] `scripts/quick_session_replacement_audit.py` im Validate-Gate
- [x] Quick Replacement Guard Unit-/Browser-Verträge
- [x] 1000-Zeilen-Modulgrenze aktiv
- [x] Runner-Problem als Pre-Step-Problem isoliert

Für den RC offen:

- [ ] exakter Release-Commit und Tag
- [ ] Actions erreicht Step 1 / Checkout
- [ ] Online-`npm ci`
- [ ] `npm run check` / `npm test` / `npm run validate` / `npm run ci`
- [ ] Chromium / Firefox / WebKit auf demselben Commit
- [ ] Required Check + Branch Protection real aktiv

Letzter vollständig untersuchter Lauf: **#2787 auf v49**, `steps: null` / `steps: []`; kein Repositorycode wurde ausgeführt. **v50–v56 sind nicht runnerverifiziert.**

## 2. Engine / Sessions / Daten

Quellsseitig vorbereitet:

- [x] Word-Imposter Voting-/Resume-/Datengrenzen
- [x] Hub Resume Guard v2 + v50-Ladequarantäne
- [x] Complete Backup v51
- [x] v52 sichere Current-Karten + Truth/Dare-Pools
- [x] v53 Paranoia same-question/same-result + Privacy
- [x] v54 Hot-Potato-/Word-Chain-Pre-Timer-Resume
- [x] Advanced Resume-/Privacy-Guards
- [x] v55 Advanced Guard v4 / Mafia-Terminalzustände / exact-once / bestätigter Advanced-Neustart
- [x] **v56 Quick Replacement Guard v1 für Quick/Mega/Viral/Creator**
- [x] **v56 `quick-loader.js` v7 lädt Guard vor jeder Schnellspiel-Engine**
- [x] **v56 Same-/Cross-Game-Ersatz verlangt Bestätigung**
- [x] **v56 fehlgeschlagener Replacement-Write bleibt fail-closed und erhält den Alt-Snapshot**

Real zu bestätigen:

- [ ] DWI
- [ ] HR2
- [ ] BK51
- [ ] HR52
- [ ] PR53
- [ ] PT54
- [ ] AD55
- [ ] **QR56 Same Game:** Cancel erhält identische Session-ID
- [ ] **QR56 Cross Game:** anderer Family-Titel darf Alt-Snapshot nicht still überschreiben
- [ ] **QR56 Confirm:** erfolgreicher Ersatz erzeugt neue Game-/Session-ID
- [ ] **QR56 Storage Fail:** alter Snapshot bleibt nach kontrolliertem Reload erhalten
- [ ] QR56 stichprobenartig in Quick, Mega, Viral und Creator
- [ ] Abschluss/Verlauf/Statistik exact-once

## 3. Core / UX / Content

Für jedes Core-Spiel real: Start/Lobby/Regeln, Freiwilligkeit/Skip, Pause/Abbruch/Resume, Score/Winner, History/Stats, Tastatur/Fokus/Zoom/Reduced Motion sowie mindestens eine reale Gruppe ohne Entwicklerhilfe.

Spezialfälle: Word Imposter Mehrfach-Imposter/Voting; Truth/Dare HR52; Paranoia PR53; Scharade/Tabu Privacy+Timer; Hot Potato 10–25 s + PT54; Wortkette PT54; Advanced AD55; Mafia Rollen/Alive/Sieger; Wrong Answers scorelos; Quick-Family Session Replacement QR56.

## 4. PWA / Offline – v56

- [ ] finaler Cache `secret-circle-v56` oder bewusst neuerer RC
- [ ] Staging-Cache gleiche Generation
- [ ] SW/Test/Architektur/Deployment/Privacy/Environment/Hosting synchron
- [ ] Kernseiten/Query-Routen offline
- [ ] Resume-/Privacy-/A11y-/Backup-Schichten offline
- [ ] `advanced-resume-guard.js` v4 offline
- [ ] `quick-session-replacement-guard.js` v1 offline
- [ ] `quick-loader.js` v7 offline
- [ ] DWI / HR2 / BK51 / HR52 / PR53 / PT54 / AD55 / QR56 offline soweit anwendbar
- [ ] Update von mindestens zwei älteren Installationen auf v56/RC
- [ ] aktive Session und lokale Daten bleiben erhalten
- [ ] Rollback mit neuer Cachegeneration

## 5. HTTPS-Staging-Smoke / Production

Der Netzwerk-Smoke wird durch `scripts/staging_smoke.py` ausgeführt; PWA-Head-Metadaten werden zusätzlich durch `tests/pwa-head-metadata.test.js` geschützt.

- [ ] Provider/Produkt final
- [ ] getrennte HTTPS-Staging-/Production-Origin
- [ ] Log-/Retention-/Processor-/Drittlandprüfung
- [ ] `npm run staging:smoke -- <STAGING> --expected-cache secret-circle-v56` grün
- [ ] manueller PWA-Staging-Smoke einschließlich DWI/HR2/BK51/HR52/PR53/PT54/AD55/**QR56**
- [ ] Production nutzt denselben RC
- [ ] `npm run staging:smoke -- <PRODUCTION> --expected-cache secret-circle-v56 --production` grün

## 6. Accessibility / Geräte

- [ ] Android + Chrome
- [ ] iPhone + Safari
- [ ] Tablet/iPad
- [ ] 320 CSS px / 200-%-Zoom / Hoch-/Querformat
- [ ] vollständige Tastatur
- [ ] VoiceOver / TalkBack
- [ ] private Reveals / Resume mit Screenreader
- [ ] Safe Areas / große Systemschrift / Reduced Motion / Touchziele

## 7. Beta / Gruppen

- [ ] G1–G5
- [ ] DWI / HR2 / BK51 / HR52 / PR53 / PT54 / AD55 / **QR56**
- [ ] PN1–PN3
- [ ] mindestens ein realer Nachweis pro Core-Spiel
- [ ] keine offenen Critical/High Bugs

## 8. Assets / Third Party / Legal / Betrieb

- [ ] kein Releaseasset `unresolved`
- [ ] Root-`icon.svg` Rechtebasis belegt oder ersetzt
- [ ] Betreiberidentität/Kontakt/Hosting final
- [ ] Privacy-/Legal-Flächen final
- [ ] Support-/Securitywege real getestet
- [ ] Probe-Supportfall / Probe-SEV-1 / HTTPS-Rollback-Drill
- [ ] reale Evidence im Operator-Log

## 9. Release Evidence / Freigabe

- [ ] `release-evidence.json = FINAL`
- [ ] 40-stelliger RC-Commit, Tag, App-Version, Cache, URLs, Freeze-Zeitpunkt
- [ ] alle Pflichtgates `PASS` auf demselben RC
- [ ] `knownBlockers` leer
- [ ] `operator-release.json = FINAL / READY`
- [ ] alle Release-Audits grün
- [ ] `releaseDecision = GO` erst danach

**Aktuell: NO_GO. PR #13 bleibt Draft und wird nicht gemergt.**