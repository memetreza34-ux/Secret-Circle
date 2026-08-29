# Secret Circle – Release-Checkliste Januar 2027

Stand: 29. August 2026

Diese Checkliste gilt ausschließlich für **einen unveränderten Release-Candidate-Commit**. Vorhandener Code, Tests oder Dokumentation sind kein PASS ohne tatsächliche Ausführung/Abnahme.

Aktueller Offline-Core: **`secret-circle-v64` / `secret-circle-v64-staging`**.  
Built-ins: **55 · 15 Core / 13 Extended / 27 Labs**.  
Expansion Wave 1: **10/10 quellsseitig implementiert; real evidence OPEN**.  
Core Source Review/Hardening: **15/15 PREPARED**.  
Accessibility: **PREPARED**.  
Bestehende Spezialgates bis HS60: **quellsseitig PREPARED, real offen**.  
Öffentliche Freigabe: **NO_GO**.

## 1. Repository / CI / Build

Quellsseitig vorbereitet:

- [x] `package-lock.json` v3
- [x] CI/Cross-Browser verwenden `npm ci`
- [x] Release-/Foundation-/Backup-/Architecture-Audits
- [x] bestehende Advanced-/Quick-/Timer-/BFCache-/Background-/Hidden-Snapshot-Audits
- [x] Wave-1-Audits für Quiz, Imposter, Writing, Voting/Estimation, Bluff und Clue
- [x] Wave-1-Unit-/E2E-/Syntaxverträge im Buildpfad
- [x] 1000-Zeilen-Modulgrenze aktiv
- [x] Runner-Problem als Pre-Step-/Hosted-Runner-Problem isoliert

Für den RC offen:

- [ ] exakter Release-Commit und Tag
- [ ] Actions erreicht Step 1 / Checkout
- [ ] Online-`npm ci --ignore-scripts --no-audit --no-fund`
- [ ] `npm run check` / `npm test` / `npm run validate` / `npm run ci`
- [ ] Chromium / Firefox / WebKit auf demselben Commit
- [ ] Required Check + Branch Protection real aktiv

Frisch bestätigter v64-Blocker vom 29. August 2026:

- Run **#3608**
- Run ID `33253663445`
- Job `99103557030`
- Head `2297868e1f65b45753294151a3b1f401a55f6288`
- Ergebnis `failure`
- `steps: []`
- `runner_id: 0`
- `runner_name: ""`
- requested label `ubuntu-latest`
- **kein Repositorycode ausgeführt**

**v50–v64 besitzen keinen Hosted-Runner-PASS.** Solange der Job keinen Runner erhält, dürfen App-Code, Workflow-Gates oder Tests nicht als vermeintlicher Fix abgeschwächt werden.

## 2. Bestehende Engine-/Session-/Daten-Gates

Quellsseitig vorbereitet:

- [x] Word-Imposter Voting-/Resume-/Datengrenzen
- [x] Hub Resume Guard + Ladequarantäne
- [x] Complete Backup / Forward Compatibility
- [x] sichere Hub-Current-/Paranoia-/Pre-Timer-Zustände
- [x] Advanced Integrity
- [x] Quick Session Replacement Guard
- [x] Quick Loader **v11**
- [x] `party-release-structure.js` **v5**
- [x] Quick-Family Timer-/BFCache-/Background-/Hidden-Snapshot-Verträge über `party-session-controls.js` v5

Real zu bestätigen:

- [ ] bestehende Spezialgates DWI bis HS60
- [ ] Abschluss/Verlauf/Statistik exact-once
- [ ] Same-/Cross-Game-Session-Replacement im echten Browser/PWA

## 3. Expansion Wave 1 / v64 – 10 Labs

Quellsseitig implementiert:

- [x] `bluff-trivia`
- [x] `party-quiz`
- [x] `fact-or-fake`
- [x] `percent-guess`
- [x] `fill-blank-battle`
- [x] `who-wrote-it`
- [x] `party-bracket`
- [x] `undercover-similar-word`
- [x] `no-word-imposter`
- [x] `password-one-word`

Gemeinsame Architektur:

- [x] sechs wiederverwendbare Enginefamilien: Quiz, Imposter, Writing, Estimation/Voting, Bluff, Clue
- [x] `quick-loader.js` v11 routet die Wave-1-Familien explizit
- [x] `party-release-structure.js` v5 hält alle zehn Modi in Labs
- [x] Session-Replacement-Schutz wird wiederverwendet
- [x] exact-once Completion/History über bestehende Sessionverträge
- [x] Offline-Core enthält die Wave-1-Kataloge und Runner
- [x] automatisierte Wave-1-Source-/Architecture-/Reference-Audits vorhanden

Real offen – je relevante Enginefamilie:

- [ ] Chromium / Firefox / WebKit
- [ ] installierte PWA offline
- [ ] Start → aktive Runde → Resultat → Replay
- [ ] Reload/Resume an kritischen Phasen
- [ ] Same-/Cross-Game-Replacement
- [ ] exact-once Score/History
- [ ] Tastatur / Touch / 200-%-Zoom / Reflow
- [ ] Screenreader-/Private-Reveal-Verhalten, soweit zutreffend
- [ ] mindestens ein echter Gruppentest vor Promotion aus Labs

**Core bleibt 15.** Source-Implementierung von Wave 1 ist kein Grund für automatische Core-Promotion.

## 4. Core / UX / Content

Für jedes der **15 Core-Spiele** real prüfen und dokumentieren:

- [ ] Start/Lobby/Regeln verständlich
- [ ] gültige Spielerzahlen und Randfälle
- [ ] höchstens 2–3 Entscheidungen bis zur ersten echten Standard-Spielaktion, soweit mechanisch sinnvoll
- [ ] Freiwilligkeit / Skip / sichere Alternative bei persönlichem Content
- [ ] Pause / Abbruch / Resume
- [ ] Score / Winner / History / Stats korrekt und exact-once
- [ ] Tastatur / sichtbarer Fokus / Zoom / Reduced Motion
- [ ] mobile Hoch-/Querformat-Darstellung
- [ ] mindestens eine reale Gruppe ohne Entwicklerhilfe

Keine offenen Critical-/High-Defects in Core oder gemeinsam genutzter Plattformlogik.

## 5. PWA / Offline – v64

- [ ] finaler Cache `secret-circle-v64` oder bewusst neuerer unveränderter RC
- [ ] Staging-Cache gleiche Generation (`secret-circle-v64-staging`)
- [ ] SW/Test/Architektur/Deployment/Privacy/Environment/Hosting synchron
- [ ] Kernseiten und Query-Routen offline
- [ ] Hub / Word Imposter / Advanced / Quick / Creator / Privacy offline
- [ ] Resume-/Privacy-/A11y-/Backup-Schichten offline
- [ ] `party-session-controls.js` v5 offline
- [ ] Quick Session Replacement Guard offline
- [ ] `quick-loader.js` v11 offline
- [ ] alle benötigten Wave-1-Kataloge/Runner offline
- [ ] Update von mindestens zwei älteren Installationen auf v64/RC
- [ ] aktive Session und kompatible lokale Daten bleiben erhalten
- [ ] Rollback mit neuer Cachegeneration statt Wiederverwendung eines alten Cache-Namens
- [ ] Offline-Neustart nach vollständigem Browser-/PWA-Prozessende

## 6. Timer-/Lifecycle-Spezialgates

- [ ] QT57 – normaler Reload behält passende Restzeit
- [ ] BF58 – BFCache-Rückkehr friert Timer nicht ein und nutzt korrekten Resume-Pfad
- [ ] BG59 – Hintergrund pausiert fair; kein ungewollter Zeitverlust
- [ ] HS60 – Hidden-Snapshot wird vor möglichem Prozess-Kill persistiert
- [ ] Cold Resume funktioniert ohne zuverlässiges späteres `pagehide`
- [ ] Snapshot wird genau einmal konsumiert
- [ ] normaler Same-Page-Abschluss räumt Snapshot auf
- [ ] nächster Round kann keine stale Restzeit erben

## 7. HTTPS-Staging-Smoke / Production

- [ ] Hostingprovider und Produkt final
- [ ] getrennte HTTPS-Staging-/Production-Origin
- [ ] Log-/Retention-/Processor-/Drittlandprüfung
- [ ] `npm run staging:smoke -- <STAGING> --expected-cache secret-circle-v64` grün
- [ ] manueller PWA-Staging-Smoke einschließlich Spezialgates + Wave-1-Labs
- [ ] Production nutzt exakt denselben RC
- [ ] `npm run staging:smoke -- <PRODUCTION> --expected-cache secret-circle-v64 --production` grün
- [ ] Rollback-Drill auf HTTPS-Origin dokumentiert

## 8. Accessibility / reale Geräte

- [ ] Android + Chrome Browser/PWA
- [ ] iPhone + Safari / Add to Home Screen
- [ ] iPad/Tablet
- [ ] App-Wechsel
- [ ] Screen-Lock
- [ ] Prozess-Kill / Cold Resume
- [ ] 320 CSS px
- [ ] 200-%-Zoom
- [ ] Hoch-/Querformat
- [ ] vollständige Tastatur
- [ ] VoiceOver
- [ ] TalkBack
- [ ] private Reveals / Resume mit Screenreader
- [ ] Wave-1-Eingaben und Resultate zugänglich
- [ ] Safe Areas / große Systemschrift / Reduced Motion / Touchziele

## 9. Beta / Gruppen

- [ ] G1–G5
- [ ] bestehende Spezialgates
- [ ] PN1–PN3
- [ ] mindestens ein realer Nachweis pro **15 Core-Spiel**
- [ ] Advanced-Gruppentests einschließlich Mafia
- [ ] Creator mit unerfahrenem Host
- [ ] Wave-1-Labs separat dokumentieren; keine stillschweigende Core-Promotion
- [ ] keine offenen Critical/High Bugs

Jeder Nachweis dokumentiert mindestens Version/Commit, Cachegeneration, Gerät, Browser/PWA, Gruppengröße, Testfall und Ergebnis.

## 10. Assets / Third Party / Legal / Betrieb

- [ ] kein Releaseasset `unresolved`
- [ ] Root-`icon.svg` Rechtebasis belegt **oder vollständig ersetzt**
- [ ] Betreiberidentität / ladungsfähige Angaben / öffentlicher Kontakt final
- [ ] Hostingprovider / Region / Datenverarbeitung final bewertet
- [ ] Privacy-/Legal-Flächen final
- [ ] Supportweg real getestet
- [ ] Security-Kontakt real getestet
- [ ] Probe-Supportfall dokumentiert
- [ ] Probe-SEV-1 dokumentiert
- [ ] HTTPS-Rollback-Drill dokumentiert
- [ ] reale Evidence im Operator-Log

## 11. Repository-/Branch-Releasehygiene

- [ ] finaler RC stammt aus klar dokumentierter Branch-/PR-Kette
- [ ] Branch Protection / Required Checks real verifiziert
- [ ] keine ungeklärte Änderung nach Freeze
- [ ] ältere Draft-/Foundation-Branches sind eindeutig als historisch/superseded oder weiterhin notwendig dokumentiert
- [ ] kein Release direkt aus einem ungeschützten, nicht evidenzgeprüften Zwischenstand

PR #13 bleibt bis zum realen PASS aller Pflichtgates **Draft**.

## 12. Release Evidence / Freigabe

- [ ] `release-evidence.json = FINAL`
- [ ] 40-stelliger RC-Commit
- [ ] Release-Tag
- [ ] App-Version
- [ ] Production-/Staging-Cache
- [ ] Staging-/Production-URLs
- [ ] Freeze-Zeitpunkt
- [ ] alle Pflichtgates `PASS` auf demselben RC
- [ ] `knownBlockers` leer
- [ ] `operator-release.json = FINAL / READY`
- [ ] Asset-/Legal-/Support-/Incident-Sign-off vollständig
- [ ] alle Release-Audits grün
- [ ] `releaseDecision = GO` erst danach

**Aktuell: NO_GO. PR #13 bleibt Draft und wird nicht gemergt.**
