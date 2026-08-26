# Secret Circle – Release-Checkliste Januar 2027

Stand: 26. August 2026

Diese Checkliste gilt ausschließlich für **einen unveränderten Release-Candidate-Commit**. Vorhandener Code, Tests oder Dokumentation sind kein PASS ohne tatsächliche Ausführung/Abnahme. Die finale Beweiskette wird zusätzlich in `release-evidence.json` geführt.

Aktueller Quellstand: **15/15 Core Source Review PREPARED + 15/15 Core Source Hardening PREPARED**.  
Aktueller Offline-Core: **`secret-circle-v53` / `secret-circle-v53-staging`**.  
Accessibility Source Hardening: **PREPARED**.  
Word-Imposter Data/Resume Hardening: **PREPARED**.  
Hub Resume Guard v2 + v50-Ladequarantäne: **PREPARED**.  
Complete Backup v51 Hardening: **PREPARED**.  
Hub Round Resume v52: **PREPARED**.  
Paranoia Resume/Privacy v53: **PREPARED**.  
Öffentliche Freigabe: **NO_GO**.

## 1. Repository / CI / Build

Quellsseitig vorbereitet:

- [x] `package-lock.json` v3
- [x] CI und Cross-Browser verwenden `npm ci`
- [x] Release-/Foundation-/Backup-/Architecture-Audits
- [x] v53 Runtime-/Hub-Resume-/Hub-Control-Dateien im Syntax-Preflight
- [x] unveränderte 1000-Zeilen-Grenze; `party-hub.js` wieder deutlich darunter
- [x] Runner-Problem durch action-/repo-freie Minimalprobe als Pre-Step-Problem isoliert

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
- [ ] Required Check + Branch Protection real aktiv

Letzter vollständig untersuchter App-Actions-Lauf: Run #2787 auf v49, Run ID `32871536761`, Job `97879489858`, Head `a9ad91389ff9e966af432b0a77103ddc0960709d`, `steps: null` / `steps: []`. **v50–v53 sind nicht runnerverifiziert.**

## 2. Engine / Sessions / Daten

Quellsseitig vorbereitet:

- [x] Word-Imposter Voting-/Resume- und Datengrenzen
- [x] Hub Resume Guard v2 + v50-Ladequarantäne
- [x] Advanced Resume-/Privacy-Guards
- [x] Complete Backup v51 Registry-/Restore-/Rollback-Vertrag
- [x] v52 sichere Truth-Dare-/Prompt-/Choice-Current-Referenzen
- [x] v52 getrennte Wahrheit-/Pflicht-Usage-Pools
- [x] v53 Paranoia-Kartenreferenz/Phase resume-fähig, aber gedeckt
- [x] v53 bereits gefälltes Münzwurf-Ergebnis bleibt unverändert
- [x] v53 Paranoia bleibt auch nach Auflösung bei Blur/Appwechsel verdeckt
- [x] ungültige/out-of-range Paranoia-Referenzen fail-safe

Real auf RC zu bestätigen:

- [ ] DWI: Word-Imposter Voting/50-51/200-201/1,5-MB-UTF-8
- [ ] HR2: Hub Resume Guard v2 + v50-Ladequarantäne
- [ ] BK51: Complete Backup / Future-Key / Vorvalidierung / Rollback
- [ ] HR52: sichere Hub-Current-Runden + Truth/Dare-Pooltrennung
- [ ] **PR53: Paranoia-Frage nach Reload zunächst gedeckt, nach Reveal exakt dieselbe**
- [ ] **PR53: bereits gefällter Münzwurf nach Reload zunächst gedeckt, danach exakt dasselbe Ergebnis**
- [ ] **PR53: aufgelöster Paranoia-Zustand wird bei Blur/Appwechsel erneut verdeckt**
- [ ] **PR53: manipulierte/out-of-range/inkomplette Paranoia-Current-Daten werden sicher verworfen**
- [ ] Abschluss/Verlauf/Statistik exact-once

## 3. Core / UX / Content

- [x] 15/15 Core Source Review PREPARED
- [x] 15/15 Core Hardening PREPARED
- [x] Punkte-/Siegervertrag vorhanden

Für jedes Core-Spiel real:

- [ ] Start/Lobby/Pack/Regeln verständlich
- [ ] Freiwilligkeit/Skip korrekt
- [ ] Pause/Abbruch/Resume korrekt
- [ ] Score-/Winner-Vertrag korrekt
- [ ] Verlauf/Statistik korrekt
- [ ] Tastatur/Fokus/Zoom/Reduced Motion
- [ ] mindestens eine reale Gruppe ohne Entwicklerhilfe

Spezialfälle:

- [ ] Word Imposter: Mehrfach-Imposter, geheimes Voting, Stichwahl
- [ ] Wahrheit oder Pflicht: HR52
- [ ] Paranoia: **PR53**
- [ ] Scharade/Tabu: Geheimkarten + Timer
- [ ] Heiße Kartoffel: real ausschließlich 10–25 s
- [ ] Mafia: Rollen/Alive/Sieger
- [ ] Wrong Answers: manuelle Verlustregel, scorelos

## 4. PWA / Offline – v53

- [ ] finaler Cache `secret-circle-v53` oder bewusst neuerer RC-Cache
- [ ] Staging-Cache gleiche Generation
- [ ] SW/Test/Architektur/Deployment/Privacy/Environment/Hosting synchron
- [ ] Installationsmetadaten grün
- [ ] Word-Imposter-/Hub-/Advanced-Guards offline
- [ ] `party-hub-round-state.js` Version 2 offline
- [ ] `party-hub-polish.js` Version 17 offline
- [ ] Backup-/A11y-Schichten offline
- [ ] Online → installierte PWA → Offline-Neustart
- [ ] alle Kernseiten/Query-Routen offline
- [ ] DWI / HR2 / BK51 / HR52 / PR53 offline soweit anwendbar
- [ ] aktive Session über Update geschützt
- [ ] Update von mindestens zwei älteren Installationen auf v53/RC
- [ ] lokale Daten/Sessions bleiben erhalten
- [ ] Rollback mit neuer Cachegeneration

## 5. HTTPS-Staging / Production

- [x] `HOSTING_DECISION.md` vorhanden
- [ ] Provider/Produkt final
- [ ] Log-/Retention-/Processor-/Drittlandprüfung
- [ ] getrennte HTTPS-Staging-Origin
- [ ] Production-Origin
- [ ] `npm run staging:smoke -- <STAGING> --expected-cache secret-circle-v53` grün
- [ ] manueller PWA-Staging-Smoke
- [ ] DWI / HR2 / BK51 / HR52 / **PR53** real
- [ ] Production nutzt denselben RC
- [ ] `npm run staging:smoke -- <PRODUCTION> --expected-cache secret-circle-v53 --production` grün

## 6. Accessibility / Geräte

Real offen:

- [ ] Android + Chrome
- [ ] iPhone + Safari
- [ ] Tablet/iPad
- [ ] 320 CSS px / 200-%-Zoom / Hoch-/Querformat
- [ ] vollständige Tastatur
- [ ] Hub-/Advanced-/Creator-Modalfokus
- [ ] VoiceOver / TalkBack
- [ ] private Reveals inklusive PR53 mit Screenreader
- [ ] Safe Areas / große Systemschrift / Reduced Motion / Touchziele

## 7. Beta / Gruppen

- [ ] G1 kleine Gruppe
- [ ] G2 mittlere Gruppe
- [ ] G3 große Gruppe
- [ ] G4 Mafia
- [ ] G5 Creator mit unerfahrener Person
- [ ] DWI
- [ ] HR2
- [ ] BK51
- [ ] HR52
- [ ] **PR53**
- [ ] PN1–PN3 Smart Party Night
- [ ] mindestens ein realer Testnachweis pro Core-Spiel
- [ ] keine offenen Critical/High Bugs

Details: Issue #8, `BETA_TEST_PLAN.md`, `MANUAL_TEST_PLAN.md`.

## 8. Assets / Third Party / Legal / Betrieb

- [ ] kein Releaseasset `unresolved`
- [ ] Root-`icon.svg` Rechtebasis belegt oder ersetzt
- [ ] finale Lockfile-/Dependencyprüfung
- [ ] Betreiberidentität/Kontakt final
- [ ] Privacy auf reales Hosting angepasst
- [ ] Support-/Securitywege real getestet
- [ ] Probe-Supportfall / Probe-SEV-1 / HTTPS-Rollback-Drill
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