# Secret Circle Party Hub – Manueller Testplan Januar 2027

Stand: 28. August 2026  
Status: **PREPARED – reale Durchführung offen**  
Offline-Core: **`secret-circle-v59` / `secret-circle-v59-staging`**  
Produktstand: **45 Built-ins · 15 Core · 13 Extended · 17 Labs · lokaler Game Creator**

Vorhandener Code oder vorhandene Tests sind **kein manueller PASS**.

## 1. Automatisierter Preflight

Vor finaler RC-Abnahme auf demselben Commit:

- [ ] Actions erreicht sichtbare Steps / Checkout
- [ ] Online-`npm ci` grün
- [ ] `npm run check` / `npm test` / `npm run validate` / `npm run ci` grün
- [ ] Chromium E2E inklusive DWI/HR2/BK51/HR52/PR53/PT54/AD55/QR56/QT57/BF58/**BG59** grün
- [ ] Chromium / Firefox / WebKit grün

Letzter vollständig untersuchter Lauf: **#2787 auf v49**, `steps: null` / `steps: []`, kein Repositorycode ausgeführt. **v50–v59 sind nicht runnerverifiziert.**

## 2. Hub / Word Imposter / Core

- [ ] 45 Built-ins / 15 Core / 13 Extended / 17 Labs
- [ ] Suche/Filter/Deep Links / Spieler/Presets/Favoriten
- [ ] Word Imposter 3/8/20 Personen, 1–6 Imposter, Fairness, Handoff, Timer, Voting, Tie-Break, Exact-once
- [ ] direkte Core-Spiele vollständig: Regeln, Skip, Finish/Abort, Reload/Resume, Verlauf exact-once, Tastatur/Modal
- [ ] DWI / HR2 / HR52 / PR53 / PT54 nach den jeweiligen Spezialverträgen

## 3. AD55 – Advanced Integrity

- [ ] Two Truths / Question Imposter / Location Spy / Mafia vollständig spielbar
- [ ] Location Spy akzeptiert real nur Vote oder Guess als Result-Pfad
- [ ] Mafia Rollen/Alive/Winner konsistent
- [ ] Mafia `stage=finished` direct-save exact-once
- [ ] vorhandene Advanced-Session nur nach Bestätigung ersetzen
- [ ] Cancel erhält Altstand; Remove-Fehler startet keine neue Session
- [ ] Advanced Secret Resume/Blur-Concealment

## 4. QR56 – Quick Session Replacement

- [ ] Same Game: Start verlangt Verwerfbestätigung; Cancel erhält Session-ID/Runde
- [ ] Cross Game derselben Familie: Start verlangt ebenfalls Bestätigung
- [ ] Confirm ersetzt erst durch erfolgreichen Engine-Write
- [ ] Replacement-Write-Fail erhält den Alt-Snapshot fail-closed
- [ ] Quick, Mega, Viral und Creator repräsentativ prüfen

## 5. QT57 / BF58

- [ ] normaler Reload übernimmt Quick-Family-Restzeit statt voller Dauer
- [ ] stale Session/Runde/Phase/Dauer wird verworfen
- [ ] Timer-Store bleibt promptfrei und im 17-Key-Backupvertrag
- [ ] BFCache Matching → kontrollierter Reload in normalen Resume-Pfad
- [ ] BFCache Stale → löschen ohne unnötigen Reload
- [ ] iPhone/iPad Safari und Android Chrome real prüfen

## 6. BG59 – Background Timer Fairness

### App-/Tabwechsel

- [ ] Rapid Fire oder anderen Quick-Family-Timer starten.
- [ ] sichtbare Restzeit notieren.
- [ ] andere App oder Browser-Tab öffnen und mindestens 10 Sekunden warten.
- [ ] zurückkehren: Pause-Overlay sichtbar, `Fortsetzen` angeboten.
- [ ] Restzeit entspricht dem Stand beim Verlassen und wurde nicht um die Hintergrunddauer reduziert.
- [ ] 2–3 Sekunden sichtbar warten **ohne** Fortsetzen: Restzeit bleibt unverändert.
- [ ] `Fortsetzen` klicken: Timer läuft wieder normal weiter.

### Screen-Lock

- [ ] laufenden Timer starten und Gerät sperren.
- [ ] mindestens 10 Sekunden gesperrt lassen.
- [ ] entsperren: Timer bleibt pausiert und ist nicht abgelaufen.
- [ ] kein automatischer Resume beim Entsperren.
- [ ] bewusster `Fortsetzen`-Klick startet wieder vom pausierten Stand.

### Regression

- [ ] manuell pausierter Timer bleibt nach App-Wechsel pausiert.
- [ ] Visibility-Wechsel ohne laufenden Timer verändert keine Runde.
- [ ] QT57 und BF58 bleiben unverändert funktionsfähig.
- [ ] Sessionabschluss/History/Stats bleiben exact-once.

## 7. BK51 – Complete Backup

- [ ] managed Export→Restore
- [ ] Future-Namespace/-Version bleibt unverändert
- [ ] Future-Key im Backup abgelehnt
- [ ] falsche Storage-Version / Klartext / Primitive abgelehnt
- [ ] >1,5 MB UTF-8 abgelehnt
- [ ] Write-/Quota-Fehler rollt managed Zustand zurück
- [ ] explizite Komplettlöschung entfernt alle `secret-circle-*`-Keys

## 8. Quick / Creator allgemein

- [ ] Quick-Mechanikfamilien komplett smoken; Fokus nach Re-Render sinnvoll
- [ ] gemeinsame Pause/Skip/Abort/Replay-Steuerung
- [ ] Session-Abschluss/History/Stats exact-once
- [ ] Creator Radiogroup, Wizard-/Hilfefokus, CRUD, Export/Import
- [ ] unerfahrene Person kann ohne Entwicklerhilfe ein valides eigenes Spiel erstellen

## 9. PWA / Offline – v59

- [ ] Android-Installation / iOS Add to Home Screen
- [ ] Offline-Neustart / Kernseiten / Query-Routen
- [ ] Resume-/Privacy-/A11y-/Backup-Schichten offline
- [ ] SessionControls v4 + QT57 + BF58 + BG59 offline
- [ ] Quick Replacement Guard v1 + Quick Loader v7 offline
- [ ] Update von mindestens zwei älteren Installationen auf v59/RC
- [ ] aktive Session und lokale Daten erhalten
- [ ] Rollback mit neuer Cachegeneration

## 10. Accessibility / reale Gruppen

- [ ] Tastatur ohne Maus / sichtbarer Fokus / Skip-Link
- [ ] VoiceOver / TalkBack
- [ ] 200-%-Zoom / 320 CSS px / große Schrift / Safe Areas / Touch / Reduced Motion
- [ ] G1 3–4, G2 5–8, G3 9–12, G4 Mafia, G5 Creator
- [ ] PN1–PN3 Smart Party Night
- [ ] mindestens ein realer Nachweis pro Core-Spiel

## 11. Release-Freigabe

- [ ] CI/Cross-Browser auf unverändertem RC
- [ ] Branch Protection
- [ ] HTTPS-Staging/Production
- [ ] Android/iPhone/iPad + Accessibility
- [ ] DWI / HR2 / BK51 / HR52 / PR53 / PT54 / AD55 / QR56 / QT57 / BF58 / **BG59**
- [ ] keine offenen Critical/High-Funde
- [ ] Content/Rechte/Legal/Support/Hosting/Incident-Sign-off
- [ ] zwei PWA-Upgrades + Rollback
- [ ] `release-evidence.json = FINAL / GO`

Bis dahin bleibt der öffentliche Release **NO_GO** und PR #13 **Draft / ungemergt**.