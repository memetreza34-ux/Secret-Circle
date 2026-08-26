# Secret Circle Party Hub – Manueller Testplan Januar 2027

Stand: 26. August 2026  
Status: **PREPARED – reale Durchführung offen**  
Offline-Core: **`secret-circle-v56` / `secret-circle-v56-staging`**  
Produktstand: **45 Built-ins · 15 Core · 13 Extended · 17 Labs · lokaler Game Creator**

Vorhandener Code oder vorhandene Tests sind **kein manueller PASS**.

## 1. Automatisierter Preflight

Vor finaler RC-Abnahme auf demselben Commit:

- [ ] Actions erreicht sichtbare Steps / Checkout
- [ ] Online-`npm ci` grün
- [ ] `npm run check` / `npm test` / `npm run validate` / `npm run ci` grün
- [ ] Chromium E2E inklusive DWI/HR2/BK51/HR52/PR53/PT54/AD55/**QR56** grün
- [ ] Chromium / Firefox / WebKit grün

Letzter vollständig untersuchter Lauf: **#2787 auf v49**, `steps: null` / `steps: []`, kein Repositorycode ausgeführt. **v50–v56 sind nicht runnerverifiziert.**

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

### Same Game

- [ ] Rapid Fire oder anderes Quick-Spiel starten; Session-ID notieren
- [ ] Reload → Resume-Box sichtbar
- [ ] „Spiel starten“ statt „Fortsetzen“ drücken
- [ ] Verwerfbestätigung erscheint
- [ ] Cancel → alte Session-ID/Runde bleiben unverändert
- [ ] Confirm → neue Session-ID und neue Runde starten

### Cross Game

- [ ] aktive Quick-Family-Session anlegen
- [ ] anderes Quick/Trending-Spiel derselben Familie öffnen
- [ ] normaler Start verlangt Bestätigung, obwohl der fremde Stand nicht als Resume-Karte dargestellt wird
- [ ] Cancel → alte Game-ID und Session-ID bleiben gespeichert
- [ ] Confirm → neuer Snapshot gehört zum neuen Spiel
- [ ] Mega, Viral und Creator jeweils mindestens einmal wiederholen

### Storage-Fail / Load Order

- [ ] Replacement-Write künstlich fehlschlagen lassen
- [ ] Guard lädt kontrolliert neu; Alt-Snapshot bleibt erhalten
- [ ] kein `pagehide`-Retry überschreibt den Altstand
- [ ] Script-Reihenfolge real: `party-session-controls.js` → `quick-session-replacement-guard.js` → jeweilige Engine

## 5. BK51 – Complete Backup

- [ ] managed Export→Restore
- [ ] Future-Namespace/-Version bleibt unverändert
- [ ] Future-Key im Backup abgelehnt
- [ ] falsche Storage-Version / Klartext / Primitive abgelehnt
- [ ] >1,5 MB UTF-8 abgelehnt
- [ ] Write-/Quota-Fehler rollt managed Zustand zurück
- [ ] explizite Komplettlöschung entfernt alle `secret-circle-*`-Keys

## 6. Quick / Creator allgemein

- [ ] Quick-Mechanikfamilien komplett smoken; Fokus nach Re-Render sinnvoll
- [ ] gemeinsame Pause/Skip/Abort/Replay-Steuerung
- [ ] Session-Abschluss/History/Stats exact-once
- [ ] Creator Radiogroup, Wizard-/Hilfefokus, CRUD, Export/Import
- [ ] unerfahrene Person kann ohne Entwicklerhilfe ein valides eigenes Spiel erstellen

## 7. PWA / Offline – v56

- [ ] Android-Installation / iOS Add to Home Screen
- [ ] Offline-Neustart / Kernseiten / Query-Routen
- [ ] Resume-/Privacy-/A11y-/Backup-Schichten offline
- [ ] Advanced Guard v4 offline
- [ ] Quick Replacement Guard v1 + Quick Loader v7 offline
- [ ] DWI / HR2 / BK51 / HR52 / PR53 / PT54 / AD55 / QR56 offline soweit anwendbar
- [ ] Update von mindestens zwei älteren Installationen auf v56/RC
- [ ] aktive Session und lokale Daten erhalten
- [ ] Rollback mit neuer Cachegeneration

## 8. Accessibility / reale Gruppen

- [ ] Tastatur ohne Maus / sichtbarer Fokus / Skip-Link
- [ ] VoiceOver / TalkBack
- [ ] 200-%-Zoom / 320 CSS px / große Schrift / Safe Areas / Touch / Reduced Motion
- [ ] G1 3–4, G2 5–8, G3 9–12, G4 Mafia, G5 Creator
- [ ] PN1–PN3 Smart Party Night
- [ ] mindestens ein realer Nachweis pro Core-Spiel

## 9. Release-Freigabe

- [ ] CI/Cross-Browser auf unverändertem RC
- [ ] Branch Protection
- [ ] HTTPS-Staging/Production
- [ ] Android/iPhone/iPad + Accessibility
- [ ] DWI / HR2 / BK51 / HR52 / PR53 / PT54 / AD55 / **QR56**
- [ ] keine offenen Critical/High-Funde
- [ ] Content/Rechte/Legal/Support/Hosting/Incident-Sign-off
- [ ] zwei PWA-Upgrades + Rollback
- [ ] `release-evidence.json = FINAL / GO`

Bis dahin bleibt der öffentliche Release **NO_GO** und PR #13 **Draft / ungemergt**.