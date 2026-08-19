# Secret Circle – Release-Checkliste Januar 2027

Stand: 19. August 2026

Diese Checkliste gilt ausschließlich für **einen unveränderten Release-Candidate-Commit**. Vorhandener Code, Tests oder Dokumentation sind kein PASS ohne tatsächliche Ausführung/Abnahme. Die finale Beweiskette wird zusätzlich in `release-evidence.json` geführt.

## 1. Repository / CI / Build

Bereits vorbereitet:

- [x] `package-lock.json` v3 vorhanden
- [x] CI und Cross-Browser verwenden `npm ci`
- [x] `scripts/lockfile_contract_audit.py`
- [x] `BRANCH_PROTECTION.md` + Contract-Audit
- [x] `RELEASE_EVIDENCE.md` + `release-evidence.json` + Audit

Für den RC offen:

- [ ] exakter Release-Commit und Tag festgelegt
- [ ] Actions zeigt echten Checkout und echte Steps
- [ ] Online-`npm ci` auf genau diesem Commit grün
- [ ] `npm run ci` vollständig grün
- [ ] Chromium / Firefox / WebKit auf demselben Commit grün
- [ ] `Secret Circle CI / validate` als Required Check aktiv und grün
- [ ] Branch Protection / Review / Bypass / Force-Push / Löschung final bestätigt

## 2. Engine / Sessions / Daten

- [ ] Exact-once-Verlauf/Statistik real bestätigt
- [ ] Hub-/Advanced-/Quick-Resume real geprüft
- [ ] private Reveal-Zustände bleiben nach Reload verdeckt
- [ ] Beenden & speichern klar getrennt von Abbrechen & verwerfen
- [ ] Skip vergibt keinen künstlichen Punkt
- [ ] Timer über Pause, Reload, Hintergrund/Sperrbildschirm geprüft
- [ ] Registry-v2-Backup: Export → Import → Löschen real geprüft
- [ ] unbekannte Namespace-, Quota-, Korruptions- und Rollbackfälle real geprüft

## 3. Core / UX / Content

Für alle 15 Core-Games:

- [ ] Start / Lobby / Pack / Regeln verständlich
- [ ] Freiwilligkeit / Skip bei persönlichen Inhalten
- [ ] Pause / Abbruch / Resume
- [ ] Score-/Winner-Vertrag korrekt
- [ ] Verlauf/Statistik korrekt
- [ ] Tastatur/Fokus/Zoom/Reduced Motion
- [ ] reale Gruppe ohne Entwicklerhilfe

Zusätzlich:

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
- [ ] Manifest, SVG, 192er PNG, 512er PNG offline verfügbar
- [ ] PNG-Dimensionen / Manifestgrößen / SHA-256 stimmen
- [ ] Online → installierte PWA → Offline-Neustart
- [ ] Query-Routen offline
- [ ] staged update / bewusste Aktivierung
- [ ] aktive Session bleibt durch Update geschützt
- [ ] Update von mindestens zwei älteren installierten Versionen
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
- [ ] Safe Areas / Bildschirmtastatur
- [ ] Reduced Motion
- [ ] Installationsicon und App-Titel vom Hub korrekt
- [ ] mindestens eine Unterseite direkt auf Installations-/Homescreen-Metadaten geprüft

## 7. Beta / Gruppen

- [ ] 3–4 Personen
- [ ] 5–8 Personen
- [ ] 9–12 Personen
- [ ] großer Word-Imposter-Test
- [ ] Mafia 8+ mit mehreren Rollen
- [ ] Smart Party Night mindestens 3 vollständige Abende
- [ ] Creator mit unerfahrener Person
- [ ] keine offenen Critical/High Bugs

## 8. Assets / Third Party / Legal / Betrieb

- [ ] Asset-/Media-Provenienz-Audits grün
- [ ] Root-`icon.svg` Urheber/Rechtebasis/Attribution final belegt
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