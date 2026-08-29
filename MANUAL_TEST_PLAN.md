# Secret Circle Party Hub – Manueller Testplan Januar 2027

Stand: 29. August 2026  
Status: **PREPARED – reale Durchführung offen**  
Offline-Core: **`secret-circle-v64` / `secret-circle-v64-staging`**  
Produktstand: **55 Built-ins · 15 Core · 13 Extended · 27 Labs · Wave 1 10/10 source-implemented · lokaler Game Creator**

Vorhandener Code oder vorhandene Tests sind **kein manueller PASS**.

## 1. Automatisierter Preflight

Vor finaler RC-Abnahme auf demselben unveränderten Commit:

- [ ] PR-Stack-Basis mit aktuellem `main` kontrolliert reconciled
- [ ] beide späteren Main-Commits nachweislich erhalten
- [ ] Actions erreicht sichtbare Steps / Checkout
- [ ] Online-`npm ci --ignore-scripts --no-audit --no-fund` grün
- [ ] `npm run check` / `npm test` / `npm run validate` / `npm run ci` grün
- [ ] Chromium E2E inklusive Spezialgates bis **HS60** + Wave-1-Verträge grün
- [ ] Chromium / Firefox / WebKit auf demselben Commit grün

Frisch untersuchter v64-Lauf: **Run #3608**, Run ID `33253663445`, Job `99103557030`, Head `2297868e1f65b45753294151a3b1f401a55f6288`, `steps: []`, `runner_id: 0`, leerer Runner-Name. Kein Repositorycode ausgeführt. **v50–v64 sind nicht Hosted-Runner-verifiziert.**

## 2. Hub / Word Imposter / Core

- [ ] exakt 55 Built-ins / 15 Core / 13 Extended / 27 Labs sichtbar und korrekt klassifiziert
- [ ] Suche / Filter / Deep Links / Spieler / Presets / Favoriten
- [ ] Word Imposter 3/8/20 Personen, 1–6 Imposter, Fairness, Handoff, Timer, Voting, Tie-Break, Exact-once
- [ ] alle 15 Core-Spiele vollständig: Regeln, Skip, Finish/Abort, Reload/Resume, Verlauf exact-once, Tastatur/Modal
- [ ] maximal 2–3 Entscheidungen bis zur ersten echten Standard-Spielaktion, soweit die Mechanik das zulässt
- [ ] persönliche Inhalte besitzen Skip/sichere Alternative

## 3. Advanced / Quick Replacement

- [ ] AD55 Advanced-Integrität vollständig
- [ ] QR56 Same-/Cross-Game Replacement, Cancel und Write-Fail
- [ ] Wechsel zwischen bestehenden Quick-Familien und Wave-1-Labs überschreibt keine aktive Session still

## 4. QT57 / BF58 / BG59

- [ ] normaler Reload übernimmt Quick-Family-Restzeit statt voller Dauer
- [ ] stale Snapshot nach Session/Runde/Phase/Dauer wird verworfen
- [ ] Timer-Store bleibt promptfrei und im 17-Key-Backupvertrag
- [ ] BFCache Matching → kontrollierter Reload in normalen Resume-Pfad
- [ ] BFCache Stale → löschen ohne unnötigen Reload
- [ ] App-/Tabwechsel/Screen-Lock → Auto-Pause
- [ ] Rückkehr sichtbar → kein Auto-Resume; bewusster `Fortsetzen`-Klick notwendig

## 5. HS60 – Hidden Snapshot Durability

### Hidden-only

- [ ] laufenden Quick-Family-Timer starten und Restzeit notieren
- [ ] App/Tab verlassen und unmittelbar den Timer-Store prüfen
- [ ] Snapshot ist bereits nach `visibilitychange(hidden)` vorhanden
- [ ] keine Prompt-/Antwort-/Mission-/Karteninhalte im Snapshot

### Cold Resume ohne vorausgesetztes `pagehide`

- [ ] nach Hidden Browser-/PWA-Prozess beenden
- [ ] nicht voraussetzen, dass `pagehide` noch lief
- [ ] App neu öffnen und Session fortsetzen
- [ ] Timer startet mit hidden gespeicherter Restzeit
- [ ] Snapshot wird genau einmal konsumiert

### Same-Page Cleanup

- [ ] Hidden → sichtbar → bewusst fortsetzen
- [ ] Runde normal mit Erfolg/Misserfolg oder regulärem Stop beenden
- [ ] Timer-Store ist danach für diese Runde leer
- [ ] nächste Runde bekommt keine stale Restzeit

## 6. BK51 – Complete Backup

- [ ] managed Export → Restore
- [ ] Registry v2 / 17 verwaltete Keys korrekt
- [ ] Future-Namespace/-Version bleibt entsprechend Vertrag unverändert
- [ ] Future-Key im Backup abgelehnt, wenn nicht registriert
- [ ] falsche Storage-Version / Klartext / Primitive abgelehnt
- [ ] >1,5 MB UTF-8 abgelehnt
- [ ] Write-/Quota-Fehler rollt managed Zustand zurück
- [ ] ausdrücklich bestätigte Komplettlöschung entfernt die vorgesehenen lokalen Secret-Circle-Daten

## 7. Expansion Wave 1 – v61 bis v64

Alle zehn Modi sind quellsseitig implementiert und bleiben Labs:

- [ ] `bluff-trivia`
- [ ] `party-quiz`
- [ ] `fact-or-fake`
- [ ] `percent-guess`
- [ ] `fill-blank-battle`
- [ ] `who-wrote-it`
- [ ] `party-bracket`
- [ ] `undercover-similar-word`
- [ ] `no-word-imposter`
- [ ] `password-one-word`

### Quiz

- [ ] Start → Frage → Antwort → Erklärung/Resultat → nächste Runde
- [ ] Reload/Result-Resume vergibt Score nicht doppelt
- [ ] offline + Tastatur + Touch + 200-%-Zoom

### Imposter

- [ ] private Übergaben bleiben verdeckt
- [ ] Fokusverlust/Appwechsel zeigt Geheimnisse nicht erneut
- [ ] Vote/Guess/Resultat nach Resume konsistent

### Writing

- [ ] private Eingabephase verdeckt
- [ ] anonyme Phase leakt keine Autorennamen
- [ ] Reload/Resume erhält richtige Phase
- [ ] Completion/History exact-once

### Voting / Bluff / Clue

- [ ] Prozent-Score deterministisch
- [ ] Bracket mit identischen Picks nach Reload identisch
- [ ] Bluff-Eingaben/Votes privat; richtige Antwort erst im Resultat
- [ ] Ein-Wort-Zielwort nur nach bewusstem Reveal; kein Auto-Reveal nach Blur/Reload

Mindestens ein realer Gruppentest je relevanter Wave-1-Enginefamilie vor einer Promotion aus Labs.

## 8. Quick / Creator allgemein

- [ ] übrige Quick-Mechanikfamilien komplett smoken
- [ ] gemeinsame Pause / Skip / Abort / Replay-Steuerung
- [ ] Session-Abschluss / History / Stats exact-once
- [ ] Creator CRUD / Export / Import / unerfahrene Person

## 9. PWA / Offline – v64

- [ ] Android Chrome / Installation
- [ ] iPhone Safari / Add to Home Screen
- [ ] iPad/Tablet
- [ ] Offline-Neustart / Kernseiten / Query-Routen
- [ ] Resume-/Privacy-/A11y-/Backup-Schichten offline
- [ ] SessionControls v5 + QT57 + BF58 + BG59 + HS60 offline
- [ ] Quick Replacement Guard + Quick Loader v11 offline
- [ ] alle benötigten Wave-1-Kataloge/Runner offline
- [ ] Update von mindestens zwei älteren Installationen auf v64/RC
- [ ] aktive Session und kompatible lokale Daten erhalten
- [ ] Rollback mit neuer Cachegeneration
- [ ] Offline-Neustart nach vollständigem Prozess-Kill

## 10. Accessibility / reale Gruppen

- [ ] Tastatur ohne Maus / sichtbarer Fokus / Skip-Link
- [ ] VoiceOver
- [ ] TalkBack
- [ ] 200-%-Zoom / 320 CSS px / große Schrift / Safe Areas / Touch / Reduced Motion
- [ ] Hoch-/Querformat
- [ ] private Reveal-/Resume-Flows mit Screenreader
- [ ] G1 3–4, G2 5–8, G3 9–12, G4 Mafia, G5 Creator
- [ ] PN1–PN3 Smart Party Night
- [ ] mindestens ein realer Nachweis pro **15 Core-Spiel**
- [ ] keine offenen Critical-/High-Defects

## 11. Hosting / Assets / Betrieb / Recht

- [ ] Hostingprovider final
- [ ] getrennte HTTPS-Staging-/Production-Origin
- [ ] v64/RC Staging-Smoke grün
- [ ] Production nutzt exakt denselben freigegebenen RC
- [ ] Root-`icon.svg` Herkunft/Rechte belegt oder Asset ersetzt
- [ ] Betreiber-/Kontakt-/Privacy-/Legal-Angaben final
- [ ] Supportweg getestet
- [ ] Securitykontakt getestet
- [ ] Probe-Supportfall dokumentiert
- [ ] SEV-1-/Incident-Drill dokumentiert
- [ ] Rollback-Drill dokumentiert
- [ ] `operator-release.json = FINAL / READY`

## 12. PR-Stack / Branch Protection

- [ ] `main` → #3 → #11 → #13 Stack kontrolliert reconciled
- [ ] Main-Commits `6b6bddd...` und `d347c7...` erhalten
- [ ] finaler stabiler Zielbranch festgelegt
- [ ] PR-Pflicht aktiv
- [ ] `Secret Circle CI / validate` Required Check real aktiv und grün
- [ ] Force-Push/Löschung entsprechend Releasevertrag geschützt
- [ ] keine ungeklärte Änderung nach RC-Freeze

## 13. Release-Freigabe

- [ ] CI/Cross-Browser auf unverändertem RC
- [ ] Branch Protection + Stack-Reconciliation
- [ ] HTTPS-Staging/Production
- [ ] Android/iPhone/iPad + Accessibility
- [ ] alle Spezialgates bis **HS60**
- [ ] alle 15 Core-Spiele real getestet
- [ ] Wave-1-Evidence dokumentiert, ohne automatische Core-Promotion
- [ ] keine offenen Critical/High-Funde
- [ ] Content/Rechte/Legal/Support/Hosting/Incident-Sign-off
- [ ] zwei PWA-Upgrades + Rollback
- [ ] `release-evidence.json = FINAL / GO`

Bis dahin bleibt der öffentliche Release **NO_GO** und PR #13 **Draft / ungemergt**.
