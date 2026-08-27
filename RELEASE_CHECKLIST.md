# Secret Circle – Release-Checkliste Januar 2027

Stand: 27. August 2026

Diese Checkliste gilt ausschließlich für **einen unveränderten Release-Candidate-Commit**. Vorhandener Code, Tests oder Dokumentation sind kein PASS ohne tatsächliche Ausführung/Abnahme.

Aktueller Offline-Core: **`secret-circle-v58` / `secret-circle-v58-staging`**.  
Core Source Review/Hardening: **15/15 PREPARED**.  
Accessibility: **PREPARED**.  
DWI / HR2 / BK51 / HR52 / PR53 / PT54 / AD55 / QR56 / QT57 / BF58: **quellsseitig PREPARED, real offen**.  
Öffentliche Freigabe: **NO_GO**.

## 1. Repository / CI / Build

Quellsseitig vorbereitet:

- [x] `package-lock.json` v3
- [x] CI/Cross-Browser verwenden `npm ci`
- [x] Release-/Foundation-/Backup-/Architecture-Audits
- [x] `scripts/advanced_integrity_audit.py`
- [x] `scripts/quick_session_replacement_audit.py`
- [x] `scripts/quick_timer_resume_audit.py`
- [x] `scripts/quick_bfcache_resume_audit.py`
- [x] QT57/BF58 Unit-/Browser-/Backup-/Architecture-Verträge im Buildpfad
- [x] 1000-Zeilen-Modulgrenze aktiv
- [x] Runner-Problem als Pre-Step-Problem isoliert

Für den RC offen:

- [ ] exakter Release-Commit und Tag
- [ ] Actions erreicht Step 1 / Checkout
- [ ] Online-`npm ci`
- [ ] `npm run check` / `npm test` / `npm run validate` / `npm run ci`
- [ ] Chromium / Firefox / WebKit auf demselben Commit
- [ ] Required Check + Branch Protection real aktiv

Letzter vollständig untersuchter Lauf: **#2787 auf v49**, `steps: null` / `steps: []`; kein Repositorycode wurde ausgeführt. **v50–v58 sind nicht runnerverifiziert.**

## 2. Engine / Sessions / Daten

Quellsseitig vorbereitet:

- [x] Word-Imposter Voting-/Resume-/Datengrenzen
- [x] Hub Resume Guard v2 + v50-Ladequarantäne
- [x] Complete Backup v51
- [x] v52 sichere Current-Karten + Truth/Dare-Pools
- [x] v53 Paranoia same-question/same-result + Privacy
- [x] v54 Hot-Potato-/Word-Chain-Pre-Timer-Resume
- [x] v55 Advanced Integrity
- [x] v56 Quick Replacement Guard / Same-/Cross-Game-Ersatz
- [x] v57 Quick-Family Timer-Restzeit über Reload + promptfreier 17-Key-Timer-Store
- [x] **v58 `party-session-controls.js` v3**
- [x] **v58 `pageshow.persisted` behandelt BFCache-Rückkehr explizit**
- [x] **v58 passender Snapshot → kontrollierter Reload; stale Snapshot → löschen ohne Reload**

Real zu bestätigen:

- [ ] DWI
- [ ] HR2
- [ ] BK51
- [ ] HR52
- [ ] PR53
- [ ] PT54
- [ ] AD55
- [ ] QR56
- [ ] QT57 Reload-Restzeit / Stale / Families / Privacy / Backup
- [ ] **BF58 Matching:** laufender Timer → Seite in BFCache → zurück → kontrollierter Resume-Pfad, kein eingefrorener Timer
- [ ] **BF58 Stale:** fremder/veralteter Snapshot wird entfernt, ohne unnötigen Reload
- [ ] **BF58 Mobile:** Safari/iOS und Chrome/Android mindestens je ein realer Lifecycle-Test
- [ ] Abschluss/Verlauf/Statistik exact-once

## 3. Core / UX / Content

Für jedes Core-Spiel real: Start/Lobby/Regeln, Freiwilligkeit/Skip, Pause/Abbruch/Resume, Score/Winner, History/Stats, Tastatur/Fokus/Zoom/Reduced Motion sowie mindestens eine reale Gruppe ohne Entwicklerhilfe.

Spezialfälle: Word Imposter Mehrfach-Imposter/Voting; Truth/Dare HR52; Paranoia PR53; Scharade/Tabu Privacy+Timer; Hot Potato 10–25 s + PT54; Wortkette PT54; Advanced AD55; Wrong Answers scorelos; Quick-Family Replacement QR56; Quick-Family Timer-Resume QT57; mobile BFCache-Rückkehr BF58.

## 4. PWA / Offline – v58

- [ ] finaler Cache `secret-circle-v58` oder bewusst neuerer RC
- [ ] Staging-Cache gleiche Generation
- [ ] SW/Test/Architektur/Deployment/Privacy/Environment/Hosting synchron
- [ ] Kernseiten/Query-Routen offline
- [ ] Resume-/Privacy-/A11y-/Backup-Schichten offline
- [ ] `party-session-controls.js` v3 offline
- [ ] `quick-session-replacement-guard.js` v1 offline
- [ ] `quick-loader.js` v7 offline
- [ ] DWI / HR2 / BK51 / HR52 / PR53 / PT54 / AD55 / QR56 / QT57 / BF58 offline soweit anwendbar
- [ ] Update von mindestens zwei älteren Installationen auf v58/RC
- [ ] aktive Session und lokale Daten bleiben erhalten
- [ ] Rollback mit neuer Cachegeneration

## 5. HTTPS-Staging-Smoke / Production

Der Netzwerk-Smoke wird durch `scripts/staging_smoke.py` ausgeführt; PWA-Head-Metadaten werden zusätzlich durch `tests/pwa-head-metadata.test.js` geschützt.

- [ ] Provider/Produkt final
- [ ] getrennte HTTPS-Staging-/Production-Origin
- [ ] Log-/Retention-/Processor-/Drittlandprüfung
- [ ] `npm run staging:smoke -- <STAGING> --expected-cache secret-circle-v58` grün
- [ ] manueller PWA-Staging-Smoke einschließlich DWI/HR2/BK51/HR52/PR53/PT54/AD55/QR56/QT57/**BF58**
- [ ] Production nutzt denselben RC
- [ ] `npm run staging:smoke -- <PRODUCTION> --expected-cache secret-circle-v58 --production` grün

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
- [ ] DWI / HR2 / BK51 / HR52 / PR53 / PT54 / AD55 / QR56 / QT57 / **BF58**
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