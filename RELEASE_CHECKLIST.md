# Secret Circle – Release-Checkliste Januar 2027

Stand: 29. August 2026

Diese Checkliste gilt nur für **einen unveränderten Release-Candidate-Commit**. Source-Code, Tests oder Dokumentation allein sind kein realer PASS.

Aktueller Arbeitsstand:

- Package `1.0.0-beta.3`
- Offline-Core `secret-circle-v64` / `secret-circle-v64-staging`
- 55 Built-ins · 15 Core / 13 Extended / 27 Labs
- Wave 1: 10/10 source-implemented
- öffentliche Freigabe: **NO_GO**

## 1. Repository / CI / Build

Quellsseitig vorbereitet:

- [x] `package-lock.json` v3
- [x] CI/Cross-Browser verwenden `npm ci`
- [x] Release-/Foundation-/Backup-/Architecture-Audits
- [x] Wave-1-Unit-/E2E-/Audit-Verträge
- [x] Runner-Problem als Pre-Step-/Hosted-Runner-Problem isoliert

Real offen:

- [ ] exakter RC-Commit und Tag
- [ ] Actions erreicht Step 1 / Checkout
- [ ] Online-`npm ci --ignore-scripts --no-audit --no-fund`
- [ ] `npm run ci` grün
- [ ] Chromium / Firefox / WebKit auf demselben Commit grün
- [ ] **Required Check aktiv und grün**
- [ ] Branch Protection real aktiv

Solange `steps: []` / `runner_id: 0` reproduziert wird, darf kein App-Code als vermeintlicher CI-Fix abgeschwächt werden.

## 2. PR-/Branch-Hygiene

- [ ] Draft-PR #15 gegen aktuellen Releasebranch synchronisiert
- [ ] GitHub-Compare: `behind_by = 0`
- [ ] PR #15 weiterhin exakt 9 Reconciliation-Pfade
- [ ] kein Engine-/Katalog-/Service-Worker-Runtime-Code im PR-#15-Diff
- [ ] ältere Foundation-/Draft-PRs eindeutig historisch oder weiterhin erforderlich dokumentiert
- [ ] kein Release direkt aus ungeschütztem Zwischenstand

PR #13 und PR #15 bleiben bis zu realer Evidence Draft.

## 3. Core / Session / Spezialgates

Für die bestehenden Core-/Quick-/Advanced-Pfade real bestätigen:

- [ ] DWI bis HS60
- [ ] Abschluss / History / Statistik exact-once
- [ ] Same-/Cross-Game-Session-Replacement
- [ ] Reload / Resume in kritischen Phasen
- [ ] QT57 Restzeit nach Reload
- [ ] BF58 BFCache-Rückkehr
- [ ] BG59 Background-Pause
- [ ] HS60 Hidden-Snapshot / Cold Resume
- [ ] keine stale Restzeit im Folgeround

## 4. Wave 1 – 10 Labs

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

Real je relevante Enginefamilie:

- [ ] Start → aktive Runde → Resultat → Replay
- [ ] Reload/Resume
- [ ] exact-once Score/History
- [ ] installierte PWA offline
- [ ] Tastatur / Touch / Zoom / Reflow
- [ ] private Reveal-/Input-Pfade sicher
- [ ] mindestens eine echte Gruppe vor möglicher Promotion

**Core bleibt 15.** Labs werden nicht automatisch Core.

## 5. PWA / Offline / Upgrade

- [ ] finaler RC-Cache bewusst festgelegt
- [ ] Production-/Staging-Cache gleiche Generation
- [ ] Kernseiten + Query-Routen offline
- [ ] Hub / Word Imposter / Advanced / Quick / Creator / Privacy offline
- [ ] alle benötigten Wave-1-Kataloge/Runner offline
- [ ] Update aus mindestens zwei älteren real installierten Ständen
- [ ] aktive Session und kompatible lokale Daten bleiben erhalten
- [ ] Rollback/Hotfix nutzt neue Cachegeneration
- [ ] Offline-Neustart nach vollständigem Prozessende

## 6. HTTPS-Staging / Production

Source vorbereitet:

- [x] `/_headers`
- [x] `scripts/staging_smoke.py`
- [x] Response-CSP-Vertrag
- [x] Clickjacking-Schutz
- [x] `nosniff`
- [x] Referrer-Policy
- [x] Production-HSTS-Vertrag
- [x] sichere `sw.js`-Cache-Policy
- [x] Cloudflare Pages als Preferred Candidate dokumentiert

Real offen:

- [ ] Hostingprovider/Produkt final
- [ ] DPA-/Processor-/Transferposition final geprüft
- [ ] getrennte HTTPS-Staging-/Production-Origin
- [ ] `npm run staging:smoke -- <STAGING> --expected-cache secret-circle-v64` grün
- [ ] manueller PWA-Staging-Smoke
- [ ] **Production-Smoke** auf exakt demselben freigegebenen RC grün
- [ ] HTTPS-Rollback-Drill dokumentiert

## 7. Accessibility / reale Geräte

- [ ] Android Chrome Browser/PWA
- [ ] iPhone Safari / Add to Home Screen
- [ ] iPad/Tablet
- [ ] App-Wechsel / Screen-Lock / Prozess-Kill / Cold Resume
- [ ] 320 CSS px
- [ ] 200-%-Zoom
- [ ] Hoch-/Querformat
- [ ] vollständige Tastatur
- [ ] **VoiceOver**
- [ ] TalkBack
- [ ] große Systemschrift / Reduced Motion / Touchziele

## 8. Reale Gruppen / Beta

Für jedes der 15 Core-Spiele:

- [ ] Start/Lobby/Regeln ohne Entwicklerhilfe verständlich
- [ ] Randfälle / Spielerzahlen
- [ ] Skip/Freiwilligkeit bei persönlichem Content
- [ ] Pause / Abbruch / Resume
- [ ] Score / Winner / History korrekt
- [ ] mindestens **eine reale Gruppe** dokumentiert

Zusätzlich:

- [ ] Advanced/Mafia
- [ ] Creator mit unerfahrenem Host
- [ ] Wave-1-Labs separat dokumentiert
- [ ] keine offenen Critical-/High-Defects

## 9. Assets / Third Party

Quellsseitig jetzt erledigt:

- [x] maschinenlesbares Asset-Provenienzmanifest
- [x] altes ungeklärtes `icon.svg` vollständig ersetzt
- [x] aktuelles `icon.svg = verified-own`
- [x] `icon-192.png = verified-own`
- [x] `icon-512.png = verified-own`
- [x] neue SHA-256-Werte dokumentiert
- [x] Media-Vertrag bleibt exakt drei Release-Medien
- [x] `ASSET_RIGHTS_SIGNOFF.md` auf Ersatzicon synchronisiert
- [x] `THIRD_PARTY_NOTICES.md` auf Ersatzicon synchronisiert

Real/final offen:

- [ ] echter Online-`npm ci`-/Integrity-Nachweis
- [ ] `scripts/asset_provenance_audit.py` tatsächlich grün
- [ ] `scripts/media_inventory_audit.py` tatsächlich grün
- [ ] kompletter `npm run validate` auf demselben Kandidaten grün
- [ ] finaler manueller Visual-/Marken-/Third-Party-Plausibilitätsreview
- [ ] Projekt-/Quellcodelizenz bewusst entschieden, falls öffentliche Quellcodeverteilung geplant ist

Der frühere Icon-Rechteblocker ist geschlossen; `assetsThirdParty` bleibt bis zu diesen realen Finalnachweisen BLOCKED.

## 10. Operator / Legal / Support / Incident

- [ ] Betreiberidentität / Rechtsform / ladungsfähige Anschrift final
- [ ] öffentlicher Betreiber-/Supportkontakt final
- [ ] Security-/Privacy-Meldeweg final
- [ ] Privacy-/Legal-Flächen mit realen Angaben
- [ ] DDG/GDPR/TDDDG/VSBG-Position final geprüft
- [ ] Supportkontakt real getestet
- [ ] Securityroute real getestet
- [ ] Probe-Supportfall abgeschlossen
- [ ] Incident Lead / Engineering / Support / Legal-Privacy Owner final
- [ ] Probe-SEV-1 abgeschlossen
- [ ] Rollback-Drill abgeschlossen
- [ ] `operator-release.json = FINAL / READY`

## 11. Release Evidence / GO

- [ ] `release-evidence.json = FINAL`
- [ ] 40-stelliger RC-Commit
- [ ] Release-Tag
- [ ] App-Version
- [ ] Production-/Staging-Cache
- [ ] Staging-/Production-URLs
- [ ] Freeze-Zeitpunkt
- [ ] alle Pflichtgates auf demselben RC PASS
- [ ] `knownBlockers` leer
- [ ] finaler Operator-/Asset-/Legal-/Support-/Incident-Sign-off
- [ ] `releaseDecision = GO`

**Aktuell: NO_GO.**
