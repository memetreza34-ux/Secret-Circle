# Secret Circle – Release-Checkliste Januar 2027

Stand: 27. August 2026

Diese Checkliste gilt ausschließlich für **einen unveränderten Release-Candidate-Commit**. Vorhandener Code, Tests oder Dokumentation sind kein PASS ohne tatsächliche Ausführung/Abnahme.

Aktueller Offline-Core: **`secret-circle-v57` / `secret-circle-v57-staging`**.  
Core Source Review/Hardening: **15/15 PREPARED**.  
Accessibility: **PREPARED**.  
DWI / HR2 / BK51 / HR52 / PR53 / PT54 / AD55 / QR56 / QT57: **quellsseitig PREPARED, real offen**.  
Öffentliche Freigabe: **NO_GO**.

## 1. Repository / CI / Build

Quellsseitig vorbereitet:

- [x] `package-lock.json` v3
- [x] CI/Cross-Browser verwenden `npm ci`
- [x] Release-/Foundation-/Backup-/Architecture-Audits
- [x] `scripts/advanced_integrity_audit.py`
- [x] `scripts/quick_session_replacement_audit.py`
- [x] `scripts/quick_timer_resume_audit.py`
- [x] QT57 Unit-/Browser-/Backup-Verträge im Buildpfad
- [x] 1000-Zeilen-Modulgrenze aktiv
- [x] Runner-Problem als Pre-Step-Problem isoliert

Für den RC offen:

- [ ] exakter Release-Commit und Tag
- [ ] Actions erreicht Step 1 / Checkout
- [ ] Online-`npm ci`
- [ ] `npm run check` / `npm test` / `npm run validate` / `npm run ci`
- [ ] Chromium / Firefox / WebKit auf demselben Commit
- [ ] Required Check + Branch Protection real aktiv

Letzter vollständig untersuchter Lauf: **#2787 auf v49**, `steps: null` / `steps: []`; kein Repositorycode wurde ausgeführt. **v50–v57 sind nicht runnerverifiziert.**

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
- [x] **v57 `party-session-controls.js` v2**
- [x] **v57 Quick/Mega/Viral/Creator Timer-Restzeit über Reload**
- [x] **v57 Timer-Store promptfrei und an Game/Session/Runde/Phase/Dauer gebunden**
- [x] **v57 Complete Backup verwaltet 17 exakte Keys einschließlich Timer-Store**

Real zu bestätigen:

- [ ] DWI
- [ ] HR2
- [ ] BK51
- [ ] HR52
- [ ] PR53
- [ ] PT54
- [ ] AD55
- [ ] QR56
- [ ] **QT57 Rapid Fire:** teilweise ablaufen → Reload → Resume → Restzeit statt voller Neustart
- [ ] **QT57 Stale:** fremde Session/Runde/Phase/Dauer wird ignoriert und entfernt
- [ ] **QT57 Families:** repräsentative Timer in Quick/Mega/Viral/Creator
- [ ] **QT57 Privacy:** Timer-Store enthält keine Prompt-/Secret-Daten
- [ ] **QT57 Backup:** Export/Restore mit gültigem Timer-Store
- [ ] Abschluss/Verlauf/Statistik exact-once

## 3. Core / UX / Content

Für jedes Core-Spiel real: Start/Lobby/Regeln, Freiwilligkeit/Skip, Pause/Abbruch/Resume, Score/Winner, History/Stats, Tastatur/Fokus/Zoom/Reduced Motion sowie mindestens eine reale Gruppe ohne Entwicklerhilfe.

Spezialfälle: Word Imposter Mehrfach-Imposter/Voting; Truth/Dare HR52; Paranoia PR53; Scharade/Tabu Privacy+Timer; Hot Potato 10–25 s + PT54; Wortkette PT54; Advanced AD55; Wrong Answers scorelos; Quick-Family Replacement QR56; Quick-Family Timer-Resume QT57.

## 4. PWA / Offline – v57

- [ ] finaler Cache `secret-circle-v57` oder bewusst neuerer RC
- [ ] Staging-Cache gleiche Generation
- [ ] SW/Test/Architektur/Deployment/Privacy/Environment/Hosting synchron
- [ ] Kernseiten/Query-Routen offline
- [ ] Resume-/Privacy-/A11y-/Backup-Schichten offline
- [ ] `party-session-controls.js` v2 offline
- [ ] `quick-session-replacement-guard.js` v1 offline
- [ ] `quick-loader.js` v7 offline
- [ ] DWI / HR2 / BK51 / HR52 / PR53 / PT54 / AD55 / QR56 / QT57 offline soweit anwendbar
- [ ] Update von mindestens zwei älteren Installationen auf v57/RC
- [ ] aktive Session und lokale Daten bleiben erhalten
- [ ] Rollback mit neuer Cachegeneration

## 5. HTTPS-Staging-Smoke / Production

Der Netzwerk-Smoke wird durch `scripts/staging_smoke.py` ausgeführt; PWA-Head-Metadaten werden zusätzlich durch `tests/pwa-head-metadata.test.js` geschützt.

- [ ] Provider/Produkt final
- [ ] getrennte HTTPS-Staging-/Production-Origin
- [ ] Log-/Retention-/Processor-/Drittlandprüfung
- [ ] `npm run staging:smoke -- <STAGING> --expected-cache secret-circle-v57` grün
- [ ] manueller PWA-Staging-Smoke einschließlich DWI/HR2/BK51/HR52/PR53/PT54/AD55/QR56/**QT57**
- [ ] Production nutzt denselben RC
- [ ] `npm run staging:smoke -- <PRODUCTION> --expected-cache secret-circle-v57 --production` grün

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
- [ ] DWI / HR2 / BK51 / HR52 / PR53 / PT54 / AD55 / QR56 / **QT57**
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