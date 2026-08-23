# Secret Circle – Release-Checkliste Januar 2027

Stand: 23. August 2026

Diese Checkliste gilt ausschließlich für **einen unveränderten Release-Candidate-Commit**. Vorhandener Code, Tests oder Dokumentation sind kein PASS ohne tatsächliche Ausführung/Abnahme. Die finale Beweiskette wird zusätzlich in `release-evidence.json` geführt.

Aktueller Quellstand: **15/15 Core Source Review PREPARED + 15/15 Core Source Hardening PREPARED**. Öffentliche Freigabe bleibt **NO_GO**.

## 1. Repository / CI / Build

Bereits vorbereitet:

- [x] `package-lock.json` v3 vorhanden
- [x] CI und Cross-Browser verwenden `npm ci`
- [x] `scripts/lockfile_contract_audit.py`
- [x] `BRANCH_PROTECTION.md` + Contract-Audit
- [x] `RELEASE_EVIDENCE.md` + `release-evidence.json` + Audit
- [x] Runner-Problem mit minimalem action-/repo-freiem Probe isoliert

Für den RC offen:

- [ ] exakter Release-Commit und Tag festgelegt
- [ ] GitHub Actions erreicht einen sichtbaren ersten Step
- [ ] `Check out repository` wird ausgeführt
- [ ] Online-`npm ci` auf genau diesem Commit grün
- [ ] `npm run check` grün
- [ ] `npm test` grün
- [ ] `npm run validate` grün
- [ ] Chromium E2E grün
- [ ] `npm run ci` vollständig grün
- [ ] Chromium / Firefox / WebKit auf demselben Commit grün
- [ ] `Secret Circle CI / validate` als Required Check aktiv und grün
- [ ] Branch Protection / Review / Bypass / Force-Push / Löschung final bestätigt

Aktueller CI-Blocker: Issue #7. App-CI Run #2401 und ein reiner Bash-Runner-Probe endeten jeweils vor Step 1 mit `steps: []`.

## 2. Engine / Sessions / Daten

Quellseitig vorbereitet:

- [x] Word-Imposter-Resume-Guard vorhanden
- [x] Hub-Timer-/Resume-Integritätsvertrag vorhanden
- [x] `advanced-resume-guard.js` vorhanden
- [x] `advanced-privacy-guard.js` vorhanden
- [x] neue Guards Bestandteil des Offline-Core

Für den RC real zu bestätigen:

- [ ] Exact-once-Verlauf/Statistik real bestätigt
- [ ] Word-Imposter-/Hub-/Advanced-/Quick-Resume real geprüft
- [ ] manipulierte Word-Imposter-Voting-Snapshots werden sicher verworfen
- [ ] gekreuzte Hub-Timerzustände werden sicher verworfen
- [ ] manipulierte Advanced-Snapshots werden sicher verworfen
- [ ] private Reveal-Zustände bleiben nach Reload verdeckt
- [ ] private Reveal-Zustände werden auch bei App-/Tab-Wechsel verdeckt
- [ ] Beenden & speichern klar getrennt von Abbrechen & verwerfen
- [ ] Skip vergibt keinen künstlichen Punkt
- [ ] Timer über Pause, Reload, Hintergrund/Sperrbildschirm geprüft
- [ ] Registry-v2-Backup: Export → Import → Löschen real geprüft
- [ ] unbekannte Namespace-, Quota-, Korruptions- und Rollbackfälle real geprüft

## 3. Core / UX / Content

Quellstatus:

- [x] 15/15 erster Core-Content-Quellpass PREPARED
- [x] 15/15 Core-Hardening-Pass PREPARED
- [x] Punkte-/Siegervertrag in `CORE_SCORING_RULES.md`
- [x] technische Matrix in `CORE_GAME_ACCEPTANCE.md`

Für alle 15 Core-Games real:

- [ ] Start / Lobby / Pack / Regeln verständlich
- [ ] Freiwilligkeit / Skip bei persönlichen Inhalten
- [ ] Pause / Abbruch / Resume
- [ ] Score-/Winner-Vertrag korrekt
- [ ] Verlauf/Statistik korrekt
- [ ] Tastatur/Fokus/Zoom/Reduced Motion
- [ ] reale Gruppe ohne Entwicklerhilfe

Zusätzlich:

- [ ] Word Imposter: Setup-Grenzen, Mehrfach-Imposter, geheimes Voting und Stichwahl real
- [ ] Paranoia: Geheimfrage bei Fokusverlust real geschützt
- [ ] Scharade/Tabu: Geheimkarten und 60-s-Timer real geschützt
- [ ] Heiße Kartoffel: Zufallstimer real ausschließlich 10–25 s
- [ ] Wortkette: manueller Gültigkeitsabschluss wird verstanden
- [ ] Nur falsche Antworten: manuelle Verlustregel wird verstanden; keine Punkte
- [ ] Advanced Core: private Eingaben/Fragen/Orte/Rollen bei Fokusverlust geschützt
- [ ] Mafia: Rollenanzahl, Alive-Zustand und Siegerlogik real korrekt
- [ ] 15 Core / 13 Extended / 17 Labs korrekt dargestellt
- [ ] Suche/Filter/Synonyme/Tippfehler real geprüft
- [ ] manueller Privacy-/Safety-Contentpass final
- [ ] `scripts/privacy_content_audit.py` grün
- [ ] `scripts/reference_content_audit.py` grün
- [ ] finaler Extended/Labs-/Marketing-/Visual-Rechtepass abgeschlossen

## 4. PWA / Offline – v44

- [ ] finaler Cache `secret-circle-v44` oder bewusst neuer RC-Cache
- [ ] SW/Test/Architektur/Deployment/Privacy/Environment synchron
- [ ] `tests/pwa-head-metadata.test.js` grün
- [ ] Hub, Word Imposter, Creator, Advanced und Quick besitzen denselben Manifest-/iOS-/Icon-Head-Vertrag
- [ ] Word-Imposter-/Advanced-Resume-/Advanced-Privacy-Guards offline verfügbar
- [ ] Manifest, SVG, 192er PNG, 512er PNG offline verfügbar
- [ ] PNG-Dimensionen / Manifestgrößen / SHA-256 stimmen
- [ ] Online → installierte PWA → Offline-Neustart
- [ ] Hub, Word Imposter, Advanced, Quick, Creator und Privacy offline
- [ ] Query-Routen offline
- [ ] staged update / bewusste Aktivierung
- [ ] aktive Session bleibt durch Update geschützt
- [ ] Update von mindestens zwei älteren installierten Versionen auf v44/RC
- [ ] lokale Daten/Sessions überstehen Update
- [ ] fehlgeschlagene Promotion zerstört den bisherigen Offline-Core nicht
- [ ] Rollback mit neuer Cachegeneration

## 5. HTTPS-Staging / Production

- [ ] getrennte HTTPS-Staging-Origin festgelegt
- [ ] Production-Origin festgelegt
- [ ] `npm run staging:smoke -- <STAGING> --expected-cache <RC-CACHE>` grün
- [ ] Smoke bestätigt Routen, Same-Origin-Redirects, Manifest, PNG-Dimensionen, Cache, Privacy-/Reference-Source und PWA-Head-Metadaten
- [ ] manueller Browser-/PWA-Staging-Smoke grün
- [ ] Production nutzt denselben freigegebenen RC-Stand
- [ ] `npm run staging:smoke -- <PRODUCTION> --expected-cache <RC-CACHE> --production` grün
- [ ] manueller Production-Smoke grün

## 6. Accessibility / Geräte

- [ ] Android + Chrome
- [ ] iPhone + Safari
- [ ] Tablet/iPad
- [ ] Hoch-/Querformat und 320 CSS px
- [ ] 200-%-Zoom
- [ ] vollständige Tastatur / sichtbarer Fokus
- [ ] VoiceOver
- [ ] TalkBack
- [ ] private Reveals mit Screenreader
- [ ] geschützte Inhalte nach Reopen mit sinnvollem Fokus
- [ ] Safe Areas / Bildschirmtastatur
- [ ] große Systemschrift
- [ ] Reduced Motion
- [ ] Touchziele mindestens 44×44 px, wo gefordert
- [ ] Installationsicon und App-Titel vom Hub korrekt
- [ ] mindestens eine Unterseite direkt auf Installations-/Homescreen-Metadaten geprüft

## 7. Beta / Gruppen

- [ ] 3–4 Personen, mindestens 60 Minuten
- [ ] 5–8 Personen, mindestens 90 Minuten
- [ ] 9–12 Personen, mindestens 90 Minuten
- [ ] mindestens ein realer Testnachweis pro Core-Spiel
- [ ] großer Word-Imposter-Test mit mehreren Impostern
- [ ] Word-Imposter-Fairness über mindestens 20 reale Runden protokolliert
- [ ] Mafia mit mehreren Gruppengrößen/Rollen
- [ ] Smart Party Night mindestens 3 vollständige Abende
- [ ] Creator mit unerfahrener Person
- [ ] keine offenen Critical/High Bugs

Operative Detailmatrix: Issue #8 und `MANUAL_TEST_PLAN.md`.

## 8. Assets / Third Party / Legal / Betrieb

- [ ] Asset-/Media-Provenienz-Audits grün
- [ ] Root-`icon.svg` Urheber/Rechtebasis/Attribution final belegt oder Asset ersetzt
- [ ] kein Releaseasset `unresolved`
- [ ] Dependency-/Vulnerability-Review des finalen Lockfiles
- [ ] Projekt-/Quellcodelizenz bewusst entschieden
- [ ] `LEGAL_CHECKLIST.md` final
- [ ] Privacy auf reales Hosting angepasst
- [ ] Betreiber-/Impressums-/Supportangaben final
- [ ] `SUPPORT.md` echter Kontakt
- [ ] `INCIDENT_RESPONSE.md` echte Verantwortliche
- [ ] Probe-SEV-1 durchgeführt
- [ ] Wartungs-/Hotfixroutine und Rollbackprobe bestätigt

## 9. Release Evidence / Freigabe

- [ ] `release-evidence.json` auf `evidenceStatus = FINAL`
- [ ] vollständiger 40-stelliger RC-Commit, Tag, App-Version, Cache, Staging-/Production-URL und Freeze-Zeitpunkt
- [ ] alle 15 Evidence-Gates `PASS`
- [ ] jeder PASS-Beleg referenziert exakt denselben RC-Commit
- [ ] `knownBlockers` leer
- [ ] `scripts/release_evidence_audit.py` grün
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
