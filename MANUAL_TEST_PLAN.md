# Secret Circle Party Hub – Manueller Testplan Januar 2027

Stand: 28. August 2026  
Status: **PREPARED – reale Durchführung offen**  
Offline-Core: **`secret-circle-v60` / `secret-circle-v60-staging`**  
Produktstand: **45 Built-ins · 15 Core · 13 Extended · 17 Labs · lokaler Game Creator**

Vorhandener Code oder vorhandene Tests sind **kein manueller PASS**.

## 1. Automatisierter Preflight

Vor finaler RC-Abnahme auf demselben Commit:

- [ ] Actions erreicht sichtbare Steps / Checkout
- [ ] Online-`npm ci` grün
- [ ] `npm run check` / `npm test` / `npm run validate` / `npm run ci` grün
- [ ] Chromium E2E inklusive Spezialgates bis **HS60** grün
- [ ] Chromium / Firefox / WebKit grün

Letzter vollständig untersuchter Lauf: **#2787 auf v49**, `steps: null` / `steps: []`, kein Repositorycode ausgeführt. **v50–v60 sind nicht runnerverifiziert.**

## 2. Hub / Word Imposter / Core

- [ ] 45 Built-ins / 15 Core / 13 Extended / 17 Labs
- [ ] Suche/Filter/Deep Links / Spieler/Presets/Favoriten
- [ ] Word Imposter 3/8/20 Personen, 1–6 Imposter, Fairness, Handoff, Timer, Voting, Tie-Break, Exact-once
- [ ] direkte Core-Spiele vollständig: Regeln, Skip, Finish/Abort, Reload/Resume, Verlauf exact-once, Tastatur/Modal

## 3. Advanced / Quick Replacement

- [ ] AD55 Advanced-Integrität vollständig
- [ ] QR56 Same-/Cross-Game Replacement, Cancel und Write-Fail

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

### Cold Resume ohne vorausgesetztes pagehide

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

- [ ] managed Export→Restore
- [ ] Future-Namespace/-Version bleibt unverändert
- [ ] Future-Key im Backup abgelehnt
- [ ] falsche Storage-Version / Klartext / Primitive abgelehnt
- [ ] >1,5 MB UTF-8 abgelehnt
- [ ] Write-/Quota-Fehler rollt managed Zustand zurück
- [ ] explizite Komplettlöschung entfernt alle `secret-circle-*`-Keys

## 7. Quick / Creator allgemein

- [ ] Quick-Mechanikfamilien komplett smoken
- [ ] gemeinsame Pause/Skip/Abort/Replay-Steuerung
- [ ] Session-Abschluss/History/Stats exact-once
- [ ] Creator CRUD/Export/Import/unerfahrene Person

## 8. PWA / Offline – v60

- [ ] Android-Installation / iOS Add to Home Screen
- [ ] Offline-Neustart / Kernseiten / Query-Routen
- [ ] Resume-/Privacy-/A11y-/Backup-Schichten offline
- [ ] SessionControls v5 + QT57 + BF58 + BG59 + HS60 offline
- [ ] Quick Replacement Guard v1 + Quick Loader v7 offline
- [ ] Update von mindestens zwei älteren Installationen auf v60/RC
- [ ] aktive Session und lokale Daten erhalten
- [ ] Rollback mit neuer Cachegeneration

## 9. Accessibility / reale Gruppen

- [ ] Tastatur ohne Maus / sichtbarer Fokus / Skip-Link
- [ ] VoiceOver / TalkBack
- [ ] 200-%-Zoom / 320 CSS px / große Schrift / Safe Areas / Touch / Reduced Motion
- [ ] G1 3–4, G2 5–8, G3 9–12, G4 Mafia, G5 Creator
- [ ] PN1–PN3 Smart Party Night
- [ ] mindestens ein realer Nachweis pro Core-Spiel

## 10. Release-Freigabe

- [ ] CI/Cross-Browser auf unverändertem RC
- [ ] Branch Protection
- [ ] HTTPS-Staging/Production
- [ ] Android/iPhone/iPad + Accessibility
- [ ] alle Spezialgates bis **HS60**
- [ ] keine offenen Critical/High-Funde
- [ ] Content/Rechte/Legal/Support/Hosting/Incident-Sign-off
- [ ] zwei PWA-Upgrades + Rollback
- [ ] `release-evidence.json = FINAL / GO`

Bis dahin bleibt der öffentliche Release **NO_GO** und PR #13 **Draft / ungemergt**.