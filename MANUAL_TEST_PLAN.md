# Secret Circle Party Hub – Manueller Testplan Januar 2027

Stand: 27. August 2026  
Status: **PREPARED – reale Durchführung offen**  
Offline-Core: **`secret-circle-v57` / `secret-circle-v57-staging`**  
Produktstand: **45 Built-ins · 15 Core · 13 Extended · 17 Labs · lokaler Game Creator**

Vorhandener Code oder vorhandene Tests sind **kein manueller PASS**.

## 1. Automatisierter Preflight

Vor finaler RC-Abnahme auf demselben Commit:

- [ ] Actions erreicht sichtbare Steps / Checkout
- [ ] Online-`npm ci` grün
- [ ] `npm run check` / `npm test` / `npm run validate` / `npm run ci` grün
- [ ] Chromium E2E inklusive DWI/HR2/BK51/HR52/PR53/PT54/AD55/QR56/**QT57** grün
- [ ] Chromium / Firefox / WebKit grün

Letzter vollständig untersuchter Lauf: **#2787 auf v49**, `steps: null` / `steps: []`, kein Repositorycode ausgeführt. **v50–v57 sind nicht runnerverifiziert.**

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

## 5. QT57 – Quick Timer Resume

### Restzeit

- [ ] Rapid Fire starten und sichtbaren Timer mindestens 1 Sekunde laufen lassen
- [ ] Restzeit notieren
- [ ] Seite reloaden
- [ ] gespeicherte Session bewusst fortsetzen
- [ ] Timer zeigt Restzeit statt voller Ausgangsdauer
- [ ] Timer läuft danach normal weiter und endet genau einmal

### Stale-Snapshot

- [ ] andere Session-ID → Snapshot ignoriert/gelöscht
- [ ] andere Runde → ignoriert/gelöscht
- [ ] andere Phase → ignoriert/gelöscht
- [ ] andere Ausgangsdauer → ignoriert/gelöscht
- [ ] Restzeit > Ausgangsdauer → abgelehnt

### Privacy / Backup

- [ ] `secret-circle-party-quick-timers-v1` enthält nur technische Metadaten
- [ ] keine Prompts/Antworten/Missionen/Identitäten/Karten im Timer-Store
- [ ] Complete Backup enthält den Store als einen von 17 managed Keys
- [ ] Export→Restore mit gültigem Timer-Store
- [ ] ungültiger Timer-Store wird vor Mutation abgelehnt

### Familien

- [ ] Quick/Trending repräsentativ
- [ ] Mega mit Timer repräsentativ
- [ ] Viral mit Timer, sofern vorhanden
- [ ] Creator mit Timer, sofern vorhanden

## 6. BK51 – Complete Backup

- [ ] managed Export→Restore
- [ ] Future-Namespace/-Version bleibt unverändert
- [ ] Future-Key im Backup abgelehnt
- [ ] falsche Storage-Version / Klartext / Primitive abgelehnt
- [ ] >1,5 MB UTF-8 abgelehnt
- [ ] Write-/Quota-Fehler rollt managed Zustand zurück
- [ ] explizite Komplettlöschung entfernt alle `secret-circle-*`-Keys

## 7. Quick / Creator allgemein

- [ ] Quick-Mechanikfamilien komplett smoken; Fokus nach Re-Render sinnvoll
- [ ] gemeinsame Pause/Skip/Abort/Replay-Steuerung
- [ ] Session-Abschluss/History/Stats exact-once
- [ ] Creator Radiogroup, Wizard-/Hilfefokus, CRUD, Export/Import
- [ ] unerfahrene Person kann ohne Entwicklerhilfe ein valides eigenes Spiel erstellen

## 8. PWA / Offline – v57

- [ ] Android-Installation / iOS Add to Home Screen
- [ ] Offline-Neustart / Kernseiten / Query-Routen
- [ ] Resume-/Privacy-/A11y-/Backup-Schichten offline
- [ ] SessionControls v2 + QT57 offline
- [ ] Quick Replacement Guard v1 + Quick Loader v7 offline
- [ ] DWI / HR2 / BK51 / HR52 / PR53 / PT54 / AD55 / QR56 / QT57 offline soweit anwendbar
- [ ] Update von mindestens zwei älteren Installationen auf v57/RC
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
- [ ] DWI / HR2 / BK51 / HR52 / PR53 / PT54 / AD55 / QR56 / **QT57**
- [ ] keine offenen Critical/High-Funde
- [ ] Content/Rechte/Legal/Support/Hosting/Incident-Sign-off
- [ ] zwei PWA-Upgrades + Rollback
- [ ] `release-evidence.json = FINAL / GO`

Bis dahin bleibt der öffentliche Release **NO_GO** und PR #13 **Draft / ungemergt**.