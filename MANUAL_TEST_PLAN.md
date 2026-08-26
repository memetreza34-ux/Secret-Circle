# Secret Circle Party Hub – Manueller Testplan Januar 2027

Stand: 26. August 2026  
Status: **PREPARED – reale Durchführung offen**  
Offline-Core: **`secret-circle-v55` / `secret-circle-v55-staging`**  
Produktstand: **45 Built-ins · 15 Core · 13 Extended · 17 Labs · lokaler Game Creator**

Vorhandener Code oder vorhandene Tests sind **kein manueller PASS**.

## 1. Automatisierter Preflight

Vor finaler RC-Abnahme auf demselben Commit:

- [ ] Actions erreicht sichtbare Steps / Checkout
- [ ] Online-`npm ci` grün
- [ ] `npm run check` / `npm test` / `npm run validate` / `npm run ci` grün
- [ ] Chromium E2E inklusive DWI/HR2/BK51/HR52/PR53/PT54/**AD55** grün
- [ ] Chromium / Firefox / WebKit grün

Letzter vollständig untersuchter Lauf: **#2787 auf v49**, `steps: null` / `steps: []`, kein Repositorycode ausgeführt. **v50–v55 sind nicht runnerverifiziert.**

## 2. Hub / Word Imposter

- [ ] 45 Built-ins / 15 Core / 13 Extended / 17 Labs
- [ ] Suche/Filter/Deep Links / Spieler/Presets/Favoriten
- [ ] Word Imposter 3/8/20 Personen, 1–6 Imposter, Fairness, Handoff, Timer, Voting, Tie-Break, Exact-once
- [ ] DWI: 50/51 Kategorien, 200/201 Begriffe, 1,5 MB UTF-8, Import-Rollback, Teilvoting-Resume

## 3. Direkte Hub-Core-Spiele

Je vollständige Runde: Wahrheit oder Pflicht, Ich habe noch nie, Wer würde eher?, Entweder oder, Paranoia, Scharade, Tabu, Heiße Kartoffel, Wortkette, Nur falsche Antworten.

Gemeinsam: Regeln, Skip ohne Punkt, Finish vs. Abort, Reload/Resume, Verlauf exact-once, Tastatur-/Modalverhalten.

## 4. Hub-Spezialgates

- **HR2:** gültige normale/Timer-Session fortsetzbar; widersprüchliche Timer verworfen; Loader fail-closed.
- **HR52:** Wahrheit/Pflicht/Prompt/Choice nach Reload identisch; getrennte Truth/Dare-Pools.
- **PR53:** Paranoia gleiche Frage/gleiches Ergebnis nur nach bewusster Wiederöffnung; Blur-Concealment.
- **PT54:** Hot-Potato-Aufgabe und Wortketten-Buchstabe vor Timerstart identisch; danach `current=null` und derselbe Wert im Timer-Snapshot; Scharade/Tabu ohne sichtbaren Pre-Start-Current.

## 5. AD55 – Advanced Integrity

### Allgemein

- [ ] Two Truths / Question Imposter / Location Spy / Mafia normal vollständig spielbar.
- [ ] aktive Session reloaden → explizite Resume-Aktion.
- [ ] Safe Exit erhält Session, ohne Play/Stats zu verbuchen.
- [ ] fertige Sessions werden pro Session-ID exact-once verbucht.

### Location Spy

- [ ] gültiger Gruppenwahl-Result-State fortsetzbar.
- [ ] gültiger Spion-Ortsguess-Result-State fortsetzbar.
- [ ] manipuliertes Resultat mit Vote **und** Guess gleichzeitig wird verworfen.

### Mafia

- [ ] 8 Spieler/Klassisch: 2 Mafia + Detektiv + Arzt + 4 Dorfbewohner.
- [ ] Pack-/Spielerzahl-Rollenverteilung korrekt.
- [ ] nicht-fertiger Stage mit bereits eindeutigem Alive-Sieger wird verworfen.
- [ ] `stage=finished` Winner muss zur Alive-Verteilung passen.
- [ ] fertige Runde direkt „Session beenden“ → History/Stats genau einmal.
- [ ] Retry derselben Session-ID → keine Doppelbuchung.
- [ ] Moderatorübersicht nach Reload wieder hinter Bestätigung.

### Neue Session bei vorhandenem Resume-State

- [ ] „Neue Session beginnen“ fragt vor dem Verwerfen nach.
- [ ] Dialog abbrechen → alte Session-ID/State unverändert.
- [ ] bestätigen → neue Session-ID.
- [ ] simuliertes Entfernen des Active-Keys schlägt fehl → keine neue Session; alter Stand bleibt; Statusfehler sichtbar.

### Privacy

- [ ] Q-Imposter-Frage / Location-Karte / Mafia-Rolle bei Blur verdeckt.
- [ ] Two-Truths-private Eingabe bleibt beim kurzfristigen Blur erhalten, aber verdeckt.
- [ ] Mafia Moderatorübersicht, Nachtaktionen und Detektiv-Info bei Fokusverlust verdeckt.

## 6. BK51 – Complete Backup

- [ ] managed Export→Restore
- [ ] Future-Namespace/-Version bleibt unverändert
- [ ] Future-Key im Backup abgelehnt
- [ ] falsche Storage-Version / Klartext / Primitive abgelehnt
- [ ] >1,5 MB UTF-8 abgelehnt
- [ ] Write-/Quota-Fehler rollt managed Zustand zurück
- [ ] explizite Komplettlöschung entfernt alle `secret-circle-*`-Keys

## 7. Quick / Creator

- [ ] Quick-Mechanikfamilien komplett smoken; Fokus nach Re-Render sinnvoll
- [ ] Creator Radiogroup, Wizard-/Hilfefokus, CRUD, Export/Import
- [ ] unerfahrene Person kann ohne Entwicklerhilfe ein valides eigenes Spiel erstellen

## 8. PWA / Offline – v55

- [ ] Android-Installation / iOS Add to Home Screen
- [ ] Offline-Neustart / Kernseiten / Query-Routen
- [ ] Resume-/Privacy-/A11y-/Backup-Schichten offline
- [ ] Advanced Guard v4 + Runner-Neustartschutz offline
- [ ] DWI / HR2 / BK51 / HR52 / PR53 / PT54 / AD55 offline soweit anwendbar
- [ ] Update von mindestens zwei älteren Installationen auf v55/RC
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
- [ ] DWI / HR2 / BK51 / HR52 / PR53 / PT54 / **AD55**
- [ ] keine offenen Critical/High-Funde
- [ ] Content/Rechte/Legal/Support/Hosting/Incident-Sign-off
- [ ] zwei PWA-Upgrades + Rollback
- [ ] `release-evidence.json = FINAL / GO`

Bis dahin bleibt der öffentliche Release **NO_GO** und PR #13 **Draft / ungemergt**.