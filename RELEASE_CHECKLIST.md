# Secret Circle – Release-Checkliste Januar 2027

Stand: 25. August 2026

Diese Checkliste gilt ausschließlich für **einen unveränderten Release-Candidate-Commit**. Vorhandener Code, Tests oder Dokumentation sind kein PASS ohne tatsächliche Ausführung/Abnahme. Die finale Beweiskette wird zusätzlich in `release-evidence.json` geführt.

Aktueller Quellstand: **15/15 Core Source Review PREPARED + 15/15 Core Source Hardening PREPARED**.  
Aktueller Offline-Core: **`secret-circle-v50` / `secret-circle-v50-staging`**.  
Accessibility Source Hardening: **PREPARED**.  
Word-Imposter Data/Resume Hardening: **PREPARED**.  
Hub Resume Guard v2 + v50-Ladequarantäne: **PREPARED**.  
Öffentliche Freigabe: **NO_GO**.

## 1. Repository / CI / Build

Quellsseitig vorbereitet:

- [x] `package-lock.json` v3
- [x] CI und Cross-Browser verwenden `npm ci`
- [x] Lockfile-/Branch-/Foundation-/Readiness-/Release-Audits
- [x] `release-evidence.json` + Audit
- [x] transition-safe FINAL/GO-Verträge
- [x] `validate_project.py` auf aktuelle Runtime-Scriptketten und Hub-Resume-Loader synchronisiert
- [x] Runner-Problem durch action-/repo-freien Minimalprobe als Pre-Step-Problem isoliert

Für den RC offen:

- [ ] exakter Release-Commit und Tag festgelegt
- [ ] GitHub Actions erreicht Step 1
- [ ] Checkout ausgeführt
- [ ] Online-`npm ci` grün
- [ ] `npm run check` grün
- [ ] `npm test` grün
- [ ] `npm run validate` grün
- [ ] Chromium E2E grün
- [ ] `npm run ci` vollständig grün
- [ ] Chromium / Firefox / WebKit auf demselben Commit grün
- [ ] `Secret Circle CI / validate` als **Required Check aktiv und grün**
- [ ] Branch Protection / Review / Bypass / Force-Push / Löschung real bestätigt

Letzter vollständig untersuchter v49-App-Actions-Lauf: Run #2787, Run ID `32871536761`, Job `97879489858`, Head `a9ad91389ff9e966af432b0a77103ddc0960709d`, `steps: null` / `steps: []`. Kein Repositorycode wurde ausgeführt. v50 ist deshalb ebenfalls nicht runnerverifiziert.

## 2. Engine / Sessions / Daten

Quellsseitig vorbereitet:

- [x] Word-Imposter Voting-/Resume-Guard
- [x] 50 Kategorien / 200 Begriffe / 1,5-MB-UTF-8-Grenze
- [x] kein stilles Trunkieren bei Import
- [x] `tests/word-imposter-data-contract.test.js`
- [x] `party-hub-resume-guard.js` v2
- [x] `party-hub-polish.js` delegiert an denselben Guard
- [x] stale Resume UI wird beim Verwerfen entfernt
- [x] v50: sichtbare Resume-UI während Guard-Ladephase `aria-busy` + Buttons deaktiviert
- [x] Freigabe der Resume-Buttons erst nach erfolgreicher Validierung
- [x] `tests/party-hub-resume-guard.test.js` schützt v50-Ladequarantäne
- [x] Advanced Resume-/Privacy-Guards

Real auf RC zu bestätigen:

- [ ] Word-Imposter Teilvoting/Resume
- [ ] manipulierte Voting-Snapshots verworfen
- [ ] 50/51 Kategorien und 200/201 Begriffe
- [ ] 1,5-MB-UTF-8-Grenze
- [ ] abgelehnter Import verändert Bestandsdaten nicht
- [ ] gültige Hub-Resume-Session bleibt erhalten
- [ ] gekreuzte Hub-Timerzustände werden verworfen
- [ ] stale Hub-Resume-Karte verschwindet bei ungültigem Snapshot
- [ ] **vor Abschluss der Guard-Prüfung ist keine Hub-Resume-Aktion anklickbar**
- [ ] nach erfolgreicher Guard-Prüfung wird eine gültige Resume-Session wieder bedienbar
- [ ] Guard-Ladefehler bleibt fail-closed
- [ ] manipulierte Advanced-Snapshots verworfen
- [ ] private Reveals bei Reload/Fokusverlust geschützt
- [ ] Abschluss/Verlauf/Statistik exact-once

## 3. Core / UX / Content

- [x] 15/15 Core Source Review PREPARED
- [x] 15/15 Core Hardening PREPARED
- [x] Punkte-/Siegervertrag vorhanden

Für **jedes** Core-Spiel real:

- [ ] Start/Lobby/Pack/Regeln verständlich
- [ ] Freiwilligkeit/Skip korrekt
- [ ] Pause/Abbruch/Resume korrekt
- [ ] Score-/Winner-Vertrag korrekt
- [ ] Verlauf/Statistik korrekt
- [ ] Tastatur/Fokus/Zoom/Reduced Motion
- [ ] mindestens eine **reale Gruppe** ohne Entwicklerhilfe

Spezialfälle:

- [ ] Word Imposter: Mehrfach-Imposter, geheimes Voting, Stichwahl
- [ ] Paranoia: Geheimfrage geschützt
- [ ] Scharade/Tabu: Geheimkarten + Timer
- [ ] Heiße Kartoffel: real ausschließlich 10–25 s
- [ ] Mafia: Rollen/Alive/Sieger
- [ ] Wrong Answers: manuelle Verlustregel, scorelos

## 4. PWA / Offline – v50

- [ ] finaler Cache `secret-circle-v50` oder bewusst neuerer RC-Cache
- [ ] Staging-Cache gleiche Generation
- [ ] SW/Test/Architektur/Deployment/Privacy/Environment/Hosting synchron
- [ ] Installationsmetadaten grün
- [ ] Word-Imposter-/Hub-/Advanced-Guards offline
- [ ] `party-hub-polish.js` mit v50-Ladequarantäne offline
- [ ] Hub-/Secondary-A11y offline
- [ ] Online → installierte PWA → Offline-Neustart
- [ ] Hub/Word Imposter/Advanced/Quick/Creator/Privacy offline
- [ ] Query-Routen offline
- [ ] aktive Session über Update geschützt
- [ ] Update von mindestens zwei älteren Installationen auf v50/RC
- [ ] lokale Daten/Sessions bleiben erhalten
- [ ] Rollback mit neuer Cachegeneration

## 5. HTTPS-Staging / Production

- [x] `HOSTING_DECISION.md` vorhanden
- [ ] Provider/Produkt final
- [ ] Log-/Retention-/Processor-/Drittlandprüfung
- [ ] getrennte HTTPS-Staging-Origin
- [ ] Production-Origin
- [ ] `npm run staging:smoke -- <STAGING> --expected-cache secret-circle-v50` grün
- [ ] manueller PWA-Staging-Smoke
- [ ] Word-Imposter-Datenvertrag real
- [ ] Hub-Resume-v2/v50-Ladequarantäne real
- [ ] Production nutzt denselben RC
- [ ] **Production-Smoke**: `npm run staging:smoke -- <PRODUCTION> --expected-cache secret-circle-v50 --production` grün

## 6. Accessibility / Geräte

- [x] Hub-A11y-Schicht
- [x] Secondary-Surface-A11y-Schicht
- [x] statische/E2E/Auditverträge vorbereitet

Real offen:

- [ ] Android + Chrome
- [ ] iPhone + Safari
- [ ] Tablet/iPad
- [ ] Hoch-/Querformat / 320 CSS px
- [ ] 200-%-Zoom
- [ ] vollständige Tastatur
- [ ] Hub-/Advanced-/Creator-Modalfokus
- [ ] Quick-Fokus-Recovery
- [ ] Creator-Radiogroup
- [ ] **VoiceOver**
- [ ] TalkBack
- [ ] private Reveals mit Screenreader
- [ ] Safe Areas / große Systemschrift / Reduced Motion / Touchziele

## 7. Beta / Gruppen

- [ ] G1 kleine Gruppe
- [ ] G2 mittlere Gruppe
- [ ] G3 große Gruppe
- [ ] G4 Mafia
- [ ] G5 Creator mit unerfahrener Person
- [ ] DWI Word-Imposter-Datengrenzen
- [ ] HR2 Hub Resume v2 + v50-Ladequarantäne
- [ ] PN1–PN3 Smart Party Night
- [ ] mindestens ein realer Testnachweis pro Core-Spiel
- [ ] keine offenen Critical/High Bugs

Details: Issue #8, `BETA_TEST_PLAN.md`, `MANUAL_TEST_PLAN.md`.

## 8. Assets / Third Party / Legal / Betrieb

Quellsseitig vorbereitet:

- [x] Asset-Provenienz-/Rights-Verträge
- [x] `operator-release.json`
- [x] `OPERATOR_RELEASE_SIGNOFF.md`
- [x] `OPERATOR_EVIDENCE_LOG.md`
- [x] Operator-/Hosting-/Legal-/Support-/Incident-Verträge

Real offen:

- [ ] kein Releaseasset `unresolved`
- [ ] Root-`icon.svg` Rechtebasis belegt oder ersetzt
- [ ] finale Lockfile-/Dependencyprüfung
- [ ] Betreiberidentität/Kontakt final
- [ ] Privacy auf reales Hosting angepasst
- [ ] Legal-/Anbieterkennzeichnung final, soweit erforderlich
- [ ] Support-/Securitywege real getestet
- [ ] Probe-Supportfall
- [ ] Probe-SEV-1
- [ ] HTTPS-Rollback-Drill
- [ ] reale Evidence im Operator-Log

## 9. Release Evidence / Freigabe

- [ ] `release-evidence.json` auf `FINAL`
- [ ] 40-stelliger RC-Commit, Tag, App-Version, Cache, Staging-/Production-URL, Freeze-Zeitpunkt
- [ ] alle 15 Gates `PASS`
- [ ] jeder PASS-Beleg referenziert exakt denselben RC
- [ ] `knownBlockers` leer
- [ ] `operator-release.json = FINAL / READY`
- [ ] alle Release-Audits grün
- [ ] `releaseDecision = GO` erst danach

Freigabefelder:

- Release-Commit: ____________________
- Release-Tag: ____________________
- Cache: ____________________
- Staging URL: ____________________
- Production URL: ____________________
- getestete Geräte: ____________________
- technische Freigabe: ____________________
- Produkt-/Inhaltsfreigabe: ____________________
- Accessibility-Freigabe: ____________________
- Legal-/Betriebsfreigabe: ____________________

**Aktuell: NO_GO. PR #13 bleibt Draft und wird nicht gemergt.**