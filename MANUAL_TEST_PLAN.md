# Secret Circle Party Hub – Manueller Testplan Januar 2027

Stand: 26. August 2026  
Status: **PREPARED – reale Durchführung offen**  
Offline-Core: **`secret-circle-v54` / `secret-circle-v54-staging`**  
Produktstand: **45 Built-ins · 15 Core · 13 Extended · 17 Labs · lokaler Game Creator**

Vorhandener Code oder vorhandene Tests sind **kein manueller PASS**.

## 1. Automatisierter Preflight

Vor finaler RC-Abnahme auf demselben Commit:

- [ ] Actions erreicht sichtbare Steps / Checkout
- [ ] Online-`npm ci` grün
- [ ] `npm run check` / `npm test` / `npm run validate` / `npm run ci` grün
- [ ] Chromium E2E inklusive DWI/HR2/BK51/HR52/PR53/PT54 grün
- [ ] Chromium / Firefox / WebKit grün

Letzter vollständig untersuchter Lauf: **#2787 auf v49**, `steps: null` / `steps: []`, kein Repositorycode ausgeführt. **v50–v54 sind nicht runnerverifiziert.**

## 2. Hub / Word Imposter

- [ ] 45 Built-ins / 15 Core / 13 Extended / 17 Labs
- [ ] Suche/Filter/Deep Links / Spieler/Presets/Favoriten
- [ ] Word Imposter 3/8/20 Personen, 1–6 Imposter, Fairness, Handoff, Timer, Voting, Tie-Break, Exact-once
- [ ] DWI: 50/51 Kategorien, 200/201 Begriffe, 1,5 MB UTF-8, Import-Rollback, Teilvoting-Resume

## 3. Direkte Hub-Core-Spiele

Je vollständige Runde: Wahrheit oder Pflicht, Ich habe noch nie, Wer würde eher?, Entweder oder, Paranoia, Scharade, Tabu, Heiße Kartoffel, Wortkette, Nur falsche Antworten.

Gemeinsam: Regeln, Skip ohne Punkt, Finish vs. Abort, Reload/Resume, Verlauf exact-once, Tastatur-/Modalverhalten.

## 4. HR2 / HR52 / PR53

### HR2

- [ ] gültige normale/Timer-Session fortsetzbar
- [ ] Cross-Mode-/0-ms-Timer verworfen
- [ ] Resume-Aktionen während Guard-Prüfung gesperrt; Ladefehler fail-closed

### HR52

- [ ] Wahrheit/Pflicht nach Reload exakt dieselbe Karte
- [ ] getrennte Truth/Dare-Pools
- [ ] Prompt-/Choice-Current identisch
- [ ] ungültiger Current verworfen; next/Skip löscht Current

### PR53

- [ ] Paranoia-Frage nach Reload gedeckt, explizites Reveal zeigt dieselbe Frage
- [ ] bereits gefällter Münzwurf nach Reload gedeckt, Ergebnis identisch
- [ ] kein erneuter Zufallswurf
- [ ] Blur/Appwechsel verdeckt vor und nach Auflösung

## 5. PT54 – Pre-Timer Resume

### Hot Potato

- [ ] Pre-Start-Aufgabe notieren
- [ ] Active-State vor Start: `timer=null`, `current.kind=hot-potato`
- [ ] Reload/Resume → exakt dieselbe Aufgabe
- [ ] kein zusätzlicher Kartenverbrauch durch Reload
- [ ] Timer starten → `current=null`, `timer.kind=hot-potato`, `timer.prompt` exakt gleich
- [ ] Dauer real 10–25 s; Countdown bleibt verborgen

### Wortkette

- [ ] Pre-Start-Buchstabe notieren
- [ ] Active-State vor Start: `timer=null`, `current.kind=word-chain`
- [ ] Reload/Resume → exakt derselbe Buchstabe
- [ ] Timer starten → `current=null`, `timer.kind=word-chain`, `timer.letter` exakt gleich
- [ ] laufender Timer nach weiterem Reload pausiert mit demselben Buchstaben fortsetzbar

### Privacy-Grenze

- [ ] Scharade/Tabu erhalten keinen sichtbaren Pre-Start-Current
- [ ] PT54 offline in installierter v54-PWA identisch

## 6. Advanced / Quick / Creator

- [ ] Two Truths / Question Imposter / Location Spy / Mafia Fachlogik, Privacy, Resume, Sieger
- [ ] Quick-Mechanikfamilien komplett smoken; Fokus nach Re-Render sinnvoll
- [ ] Creator Radiogroup, Wizard-/Hilfefokus, CRUD, Export/Import; unerfahrene Person ohne Entwicklerhilfe

## 7. BK51 – Complete Backup

- [ ] managed Export→Restore
- [ ] Future-Namespace/-Version bleibt unverändert
- [ ] Future-Key im Backup abgelehnt
- [ ] falsche Storage-Version / Klartext / Primitive abgelehnt
- [ ] >1,5 MB UTF-8 abgelehnt
- [ ] Write-/Quota-Fehler rollt managed Zustand zurück
- [ ] explizite Komplettlöschung entfernt alle `secret-circle-*`-Keys

## 8. PWA / Offline – v54

- [ ] Android-Installation / iOS Add to Home Screen
- [ ] Offline-Neustart / Kernseiten / Query-Routen
- [ ] Resume-/Privacy-/A11y-/Backup-Schichten offline
- [ ] `party-hub-round-state.js` v3 + Timervertrag offline
- [ ] DWI / HR2 / BK51 / HR52 / PR53 / PT54 offline
- [ ] Update von mindestens zwei älteren Installationen auf v54/RC
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
- [ ] DWI / HR2 / BK51 / HR52 / PR53 / **PT54**
- [ ] keine offenen Critical/High-Funde
- [ ] Content/Rechte/Legal/Support/Hosting/Incident-Sign-off
- [ ] zwei PWA-Upgrades + Rollback
- [ ] `release-evidence.json = FINAL / GO`

Bis dahin bleibt der öffentliche Release **NO_GO** und PR #13 **Draft / ungemergt**.