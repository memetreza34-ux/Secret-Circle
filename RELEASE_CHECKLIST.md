# Secret Circle – Release-Checkliste Januar 2027

Stand: 26. August 2026

Diese Checkliste gilt ausschließlich für **einen unveränderten Release-Candidate-Commit**. Vorhandener Code, Tests oder Dokumentation sind kein PASS ohne tatsächliche Ausführung/Abnahme.

Aktueller Offline-Core: **`secret-circle-v54` / `secret-circle-v54-staging`**.  
Core Source Review/Hardening: **15/15 PREPARED**.  
Accessibility: **PREPARED**.  
DWI / HR2 / BK51 / HR52 / PR53 / PT54: **quellsseitig PREPARED, real offen**.  
Öffentliche Freigabe: **NO_GO**.

## 1. Repository / CI / Build

Quellsseitig vorbereitet:

- [x] `package-lock.json` v3
- [x] CI und Cross-Browser verwenden `npm ci`
- [x] Release-/Foundation-/Backup-/Architecture-Audits
- [x] PT54-E2E im Syntax-Preflight
- [x] 1000-Zeilen-Modulgrenze bleibt aktiv
- [x] Runner-Problem als Pre-Step-Problem isoliert

Für den RC offen:

- [ ] exakter Release-Commit und Tag
- [ ] GitHub Actions erreicht Step 1 / Checkout
- [ ] Online-`npm ci`
- [ ] `npm run check` / `npm test` / `npm run validate` / `npm run ci`
- [ ] Chromium / Firefox / WebKit auf demselben Commit
- [ ] Required Check + Branch Protection real aktiv

Letzter vollständig untersuchter Lauf: **#2787 auf v49**, `steps: null` / `steps: []`; kein Repositorycode wurde ausgeführt. **v50–v54 sind nicht runnerverifiziert.**

## 2. Engine / Sessions / Daten

Quellsseitig vorbereitet:

- [x] Word-Imposter Voting-/Resume-/Datengrenzen
- [x] Hub Resume Guard v2 + v50-Ladequarantäne
- [x] Advanced Resume-/Privacy-Guards
- [x] Complete Backup v51
- [x] v52 sichere Current-Karten + Truth/Dare-Pools
- [x] v53 Paranoia same-question/same-result + Privacy
- [x] v54 Hot-Potato-/Word-Chain-Pre-Start-Current
- [x] v54 Current wird beim Timerstart gelöscht und derselbe Wert in Timer-Snapshot übernommen

Real zu bestätigen:

- [ ] **DWI** Word-Imposter Voting/50-51/200-201/1,5 MB
- [ ] **HR2** Resume Guard / Loader
- [ ] **BK51** Complete Backup / Forward Compatibility / Rollback
- [ ] **HR52** sichere Hub-Current-Runden / Truth-Dare-Pools
- [ ] **PR53** Paranoia same-question/same-result / Concealment
- [ ] **PT54 Hot Potato:** Pre-Start-Aufgabe nach Reload identisch; Timerstart → `current=null`, `timer.prompt` identisch
- [ ] **PT54 Wortkette:** Pre-Start-Buchstabe nach Reload identisch; Timerstart → `current=null`, `timer.letter` identisch
- [ ] Scharade/Tabu erhalten keinen sichtbaren Pre-Start-Current
- [ ] Abschluss/Verlauf/Statistik exact-once

## 3. Core / UX / Content

Für jedes Core-Spiel real:

- [ ] Start/Lobby/Pack/Regeln verständlich
- [ ] Freiwilligkeit/Skip korrekt
- [ ] Pause/Abbruch/Resume korrekt
- [ ] Score-/Winner-Vertrag korrekt
- [ ] Verlauf/Statistik korrekt
- [ ] Tastatur/Fokus/Zoom/Reduced Motion
- [ ] mindestens eine reale Gruppe ohne Entwicklerhilfe

Spezialfälle: Word Imposter Mehrfach-Imposter/Voting; Truth/Dare HR52; Paranoia PR53; Scharade/Tabu Geheimkarten+Timer; Hot Potato 10–25 s + PT54; Wortkette PT54; Mafia Rollen/Alive/Sieger; Wrong Answers scorelos.

## 4. PWA / Offline – v54

- [ ] finaler Cache `secret-circle-v54` oder bewusst neuerer RC
- [ ] Staging-Cache gleiche Generation
- [ ] SW/Test/Architektur/Deployment/Privacy/Environment/Hosting synchron
- [ ] Kernseiten/Query-Routen offline
- [ ] Resume-/Privacy-/A11y-/Backup-Schichten offline
- [ ] `party-hub-round-state.js` v3 offline
- [ ] DWI / HR2 / BK51 / HR52 / PR53 / PT54 offline soweit anwendbar
- [ ] Update von mindestens zwei älteren Installationen auf v54/RC
- [ ] aktive Session und lokale Daten bleiben erhalten
- [ ] Rollback mit neuer Cachegeneration

## 5. HTTPS-Staging / Production

- [ ] Provider/Produkt final
- [ ] getrennte HTTPS-Staging-/Production-Origin
- [ ] Log-/Retention-/Processor-/Drittlandprüfung
- [ ] `npm run staging:smoke -- <STAGING> --expected-cache secret-circle-v54` grün
- [ ] manueller PWA-Staging-Smoke einschließlich DWI/HR2/BK51/HR52/PR53/PT54
- [ ] Production nutzt denselben RC
- [ ] `npm run staging:smoke -- <PRODUCTION> --expected-cache secret-circle-v54 --production` grün

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
- [ ] DWI
- [ ] HR2
- [ ] BK51
- [ ] HR52
- [ ] PR53
- [ ] **PT54**
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