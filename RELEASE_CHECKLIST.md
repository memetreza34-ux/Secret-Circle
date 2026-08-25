# Secret Circle – Release-Checkliste Januar 2027

Stand: 25. August 2026

Diese Checkliste gilt ausschließlich für **einen unveränderten Release-Candidate-Commit**. Vorhandener Code, Tests oder Dokumentation sind kein PASS ohne tatsächliche Ausführung/Abnahme. Die finale Beweiskette wird zusätzlich in `release-evidence.json` geführt.

Aktueller Quellstand: **15/15 Core Source Review PREPARED + 15/15 Core Source Hardening PREPARED**.  
Aktueller Offline-Core: **`secret-circle-v48` / `secret-circle-v48-staging`**.  
Accessibility Source Hardening: **PREPARED**.  
Word-Imposter Data/Resume Hardening: **PREPARED**.  
Öffentliche Freigabe: **NO_GO**.

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

Aktueller CI-Blocker: Issue #7. Hosted-Runner-Jobs enden weiterhin vor Step 1 mit `steps: []`; der isolierte Bash-Runner-Probe zeigte dasselbe Muster.

## 2. Engine / Sessions / Daten

Quellseitig vorbereitet:

- [x] Word-Imposter-Resume-Guard
- [x] Word-Imposter-Voting-UI bestimmt nächsten offenen Wähler aus tatsächlichen Vote-Keys
- [x] Word-Imposter-Custom-Limits: 50 Kategorien / 200 Begriffe je Kategorie
- [x] 1,5-MB-UTF-8-Backupgrenze zwischen UI und Store synchron
- [x] keine stille Kategorie-Trunkierung bei Import
- [x] `tests/word-imposter-data-contract.test.js`
- [x] Hub-Timer-/Resume-Integritätsvertrag
- [x] `advanced-resume-guard.js`
- [x] `advanced-privacy-guard.js`
- [x] Guard-Dateien im Offline-Core

Für den RC real zu bestätigen:

- [ ] Exact-once-Verlauf/Statistik
- [ ] Word-Imposter-/Hub-/Advanced-/Quick-Resume
- [ ] manipulierte Word-Imposter-Voting-Snapshots sicher verworfen
- [ ] Word-Imposter 50 Kategorien akzeptiert / 51 abgelehnt
- [ ] Word-Imposter 200 Begriffe akzeptiert / 201 abgelehnt
- [ ] abgelehnter Word-Imposter-Import verändert bestehende Daten nicht
- [ ] 1,5-MB-UTF-8-Limit real bestätigt
- [ ] gekreuzte Hub-Timerzustände sicher verworfen
- [ ] manipulierte Advanced-Snapshots sicher verworfen
- [ ] private Reveal-Zustände nach Reload verdeckt
- [ ] private Reveal-Zustände bei App-/Tab-Wechsel verdeckt
- [ ] Beenden & speichern klar getrennt von Abbrechen & verwerfen
- [ ] Skip vergibt keinen künstlichen Punkt
- [ ] Timer über Pause, Reload, Hintergrund/Sperrbildschirm geprüft
- [ ] Registry-v2-Backup Export → Import → Löschen
- [ ] Namespace-/Quota-/Korruptions-/Rollbackfälle

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

- [ ] Word Imposter: Setup-Grenzen, Mehrfach-Imposter, geheimes Voting, Stichwahl
- [ ] Paranoia: Geheimfrage bei Fokusverlust geschützt
- [ ] Scharade/Tabu: Geheimkarten und 60-s-Timer geschützt
- [ ] Heiße Kartoffel: Zufallstimer real ausschließlich 10–25 s
- [ ] Wortkette: manueller Gültigkeitsabschluss verstanden
- [ ] Nur falsche Antworten: manuelle Verlustregel verstanden; keine Punkte
- [ ] Advanced Core: private Eingaben/Fragen/Orte/Rollen bei Fokusverlust geschützt
- [ ] Mafia: Rollenanzahl, Alive-Zustand und Siegerlogik real korrekt
- [ ] 15 Core / 13 Extended / 17 Labs korrekt dargestellt
- [ ] Suche/Filter/Synonyme/Tippfehler real geprüft
- [ ] Privacy-/Safety-Contentpass final
- [ ] Privacy-/Reference-Audits grün
- [ ] Extended/Labs-/Marketing-/Visual-Rechtepass abgeschlossen

## 4. PWA / Offline – v48

- [ ] finaler Cache `secret-circle-v48` oder bewusst neuer RC-Cache
- [ ] Staging-Cache gleiche Generation
- [ ] SW/Test/Architektur/Deployment/Privacy/Environment synchron
- [ ] `tests/pwa-head-metadata.test.js` grün
- [ ] fünf interaktive Einstiegseiten erfüllen denselben Installationsvertrag
- [ ] Word-Imposter-/Hub-/Advanced-Resume-/Advanced-Privacy-Guards offline
- [ ] `party-hub-a11y.js` offline
- [ ] `secondary-surface-a11y.js` offline
- [ ] v48-Word-Imposter-UI/Store-Dateien offline aktuell
- [ ] Manifest, SVG, 192er PNG, 512er PNG offline
- [ ] PNG-Dimensionen / Manifestgrößen / SHA-256 stimmen
- [ ] Online → installierte PWA → Offline-Neustart
- [ ] Hub, Word Imposter, Advanced, Quick, Creator und Privacy offline
- [ ] Query-Routen offline
- [ ] staged update / bewusste Aktivierung
- [ ] aktive Session bleibt durch Update geschützt
- [ ] Update von mindestens zwei älteren installierten Versionen auf v48/RC
- [ ] lokale Daten/Sessions überstehen Update
- [ ] fehlgeschlagene Promotion zerstört bisherigen Offline-Core nicht
- [ ] Rollback mit neuer Cachegeneration

## 5. HTTPS-Staging / Production

- [x] `HOSTING_DECISION.md` als Entscheidungskontrakt vorhanden
- [ ] Hostingprovider/Produkt final ausgewählt
- [ ] Log-/Retention-/Processor-/Drittlandprüfung dokumentiert
- [ ] getrennte HTTPS-Staging-Origin festgelegt
- [ ] Production-Origin festgelegt
- [ ] `npm run staging:smoke -- <STAGING> --expected-cache secret-circle-v48` grün
- [ ] Smoke bestätigt Routen, Redirects, Manifest, PNGs, Cache, Privacy-/Reference-Source und PWA-Head
- [ ] manueller Browser-/PWA-Staging-Smoke grün
- [ ] Word-Imposter-v48-Datenvertrag auf Staging bestätigt
- [ ] Production nutzt denselben freigegebenen RC
- [ ] `npm run staging:smoke -- <PRODUCTION> --expected-cache secret-circle-v48 --production` grün
- [ ] manueller Production-Smoke grün

## 6. Accessibility / Geräte

Quellseitig vorbereitet:

- [x] `party-hub-a11y.js`
- [x] `secondary-surface-a11y.js`
- [x] Hub- und Advanced-Spieloverlays als `aria-modal` Dialoge
- [x] modale Hintergrundisolation mit `inert`
- [x] Tab-/Shift+Tab-Fokus-Traps für Hub/Advanced/Creator-Hilfe
- [x] Hub-Bereichswechsel fokussieren die sichtbare Hauptüberschrift
- [x] Quick-Phasen besitzen Fokus-Recovery nach DOM-Austausch
- [x] Creator-Schrittüberschriften sind programmatisch fokussierbar
- [x] Creator-Template-Radiogroup unterstützt Pfeile/Home/End
- [x] `scripts/hub_a11y_contract_audit.py` in `npm run validate`
- [x] `scripts/secondary_surface_a11y_contract_audit.py` in `npm run validate`
- [x] statische und E2E-Verträge für die Fokuspfade angelegt

Real offen:

- [ ] Android + Chrome
- [ ] iPhone + Safari
- [ ] Tablet/iPad
- [ ] Hoch-/Querformat und 320 CSS px
- [ ] 200-%-Zoom
- [ ] vollständige Tastatur / sichtbarer Fokus
- [ ] Hub-Bereichswechsel-Fokus in realen Browsern sinnvoll
- [ ] Hub-Detail-/Spielmodal verliert Fokus nicht in den Hintergrund
- [ ] Advanced-Spieloverlay verliert Fokus nicht in Setup/Hintergrund
- [ ] Quick-Phasenwechsel landen auf sinnvoller nächster Aktion
- [ ] Creator-Schrittwechsel verständlich
- [ ] Creator-Template-Pfeiltasten/Home/End real
- [ ] Creator-Hilfe Fokus-Trap + Rückkehrfokus real
- [ ] VoiceOver
- [ ] TalkBack
- [ ] private Reveals mit Screenreader
- [ ] geschützte Inhalte nach Reopen mit sinnvollem Fokus
- [ ] Safe Areas / Bildschirmtastatur
- [ ] große Systemschrift
- [ ] Reduced Motion
- [ ] wichtige Touchziele ausreichend groß
- [ ] Installationsicon/App-Titel korrekt

## 7. Beta / Gruppen

- [ ] 3–4 Personen, mindestens 60 Minuten
- [ ] 5–8 Personen, mindestens 90 Minuten
- [ ] 9–12 Personen, mindestens 90 Minuten
- [ ] mindestens ein realer Testnachweis pro Core-Spiel
- [ ] großer Word-Imposter-Test mit mehreren Impostern
- [ ] Word-Imposter-Fairness über mindestens 20 reale Runden protokolliert
- [ ] Word-Imposter Custom-/Backup-Grenzen mit neutralen Daten praktisch getestet
- [ ] Mafia mit mehreren Gruppengrößen/Rollen
- [ ] Smart Party Night mindestens 3 vollständige Abende
- [ ] Creator mit unerfahrener Person
- [ ] keine offenen Critical/High Bugs

Operative Detailmatrix: Issue #8, `BETA_TEST_PLAN.md`, `MANUAL_TEST_PLAN.md`.

## 8. Assets / Third Party / Legal / Betrieb

Quellseitig vorbereitet:

- [x] `ASSET_RIGHTS_SIGNOFF.md`
- [x] `operator-release.json` als maschinenlesbare Betreiber-/Hosting-/Support-/Incident-Akte
- [x] `OPERATOR_RELEASE_SIGNOFF.md`
- [x] `HOSTING_DECISION.md`
- [x] `scripts/operator_release_contract_audit.py` in `npm run validate`

Für Production real zu schließen:

- [ ] Asset-/Media-Provenienz-Audits grün
- [ ] `ASSET_RIGHTS_SIGNOFF.md` vollständig
- [ ] Root-`icon.svg` Rechtebasis final belegt oder Asset ersetzt
- [ ] kein Releaseasset `unresolved`
- [ ] Dependency-/Vulnerability-Review des finalen Lockfiles
- [ ] Projekt-/Quellcodelizenz bewusst entschieden
- [ ] `LEGAL_CHECKLIST.md` final
- [ ] `operator-release.json` wahrheitsgemäß `FINAL / READY`
- [ ] Betreiberidentität / Rechtsform / ladungsfähige Anschrift / öffentliche Kontaktmöglichkeit final, soweit erforderlich
- [ ] öffentliche Legal-/Anbieterkennzeichnungsseite final, soweit erforderlich
- [ ] Privacy auf reales Hosting angepasst
- [ ] Verbraucherstreitbeilegungsposition anhand des realen Modells final geprüft
- [ ] keine veraltete EU-OS-Plattform verlinkt
- [ ] `SUPPORT.md` echter Kontakt
- [ ] Supportpostfach praktisch getestet
- [ ] Security-/Privacy-Meldeweg praktisch getestet
- [ ] `INCIDENT_RESPONSE.md` echte Verantwortliche
- [ ] Probe-Supportfall durchgeführt
- [ ] Probe-SEV-1 durchgeführt
- [ ] Wartungs-/Hotfixroutine und HTTPS-Rollbackprobe bestätigt

## 9. Release Evidence / Freigabe

- [ ] `release-evidence.json` auf `evidenceStatus = FINAL`
- [ ] 40-stelliger RC-Commit, Tag, App-Version, Cache, Staging-/Production-URL und Freeze-Zeitpunkt
- [ ] alle 15 Evidence-Gates `PASS`
- [ ] `legalPrivacy` und `supportIncident` nur PASS, wenn `operator-release.json = FINAL / READY`
- [ ] jeder PASS-Beleg referenziert exakt denselben RC-Commit
- [ ] `knownBlockers` leer
- [ ] `scripts/operator_release_contract_audit.py` grün
- [ ] `scripts/hub_a11y_contract_audit.py` grün
- [ ] `scripts/secondary_surface_a11y_contract_audit.py` grün
- [ ] `tests/word-imposter-data-contract.test.js` auf dem RC grün
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