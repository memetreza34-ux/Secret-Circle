# Secret Circle Party Hub – Manueller Testplan Januar 2027

Stand: 25. August 2026  
Status: **PREPARED – reale Durchführung offen**  
Offline-Core: **`secret-circle-v50` / `secret-circle-v50-staging`**  
Produktstand: **45 Built-ins · 15 Core · 13 Extended · 17 Labs · lokaler Game Creator**

Vorhandener Code oder vorhandene Tests sind **kein manueller PASS**.

## 1. Automatisierter Preflight

Vor finaler RC-Abnahme auf demselben Commit:

- [ ] Actions erreicht sichtbare Steps
- [ ] Checkout ausgeführt
- [ ] Online-`npm ci` grün
- [ ] `npm run check` grün
- [ ] `npm test` grün inklusive Word-Imposter- und Hub-Resume-Tests
- [ ] `npm run validate` grün
- [ ] Chromium E2E grün
- [ ] vollständiges `npm run ci` grün
- [ ] Chromium / Firefox / WebKit grün

Letzter vollständig untersuchter v49-App-Actions-Lauf: **#2787**, Run ID `32871536761`, Job `97879489858`, Head `a9ad91389ff9e966af432b0a77103ddc0960709d`, `steps: null` / `steps: []`. Kein Repositorycode wurde ausgeführt. v50 ist nicht runnerverifiziert.

## 2. Hub-Smoke

- [ ] 45 Built-ins
- [ ] 15 Core / 13 Extended / 17 Labs
- [ ] Suche/Filter/Deep Links
- [ ] Spieler/Presets/Favoriten nach Reload
- [ ] Quick/Advanced/Creator/Imposter-Routen
- [ ] Privacy-Seite
- [ ] Hub-Bereichsfokus / Skip-Link

## 3. Word Imposter

- [ ] 3 / 8 / 20 Personen
- [ ] doppelte Namen / ungültige Gruppen abgelehnt
- [ ] 1 / mehrere / max. 6 Imposter
- [ ] 7 Imposter abgelehnt
- [ ] mindestens 20 Fairnessrunden
- [ ] Secret Handoff / Appwechsel
- [ ] Timer
- [ ] geheimes Voting
- [ ] Teilabstimmung nach Reload beim nächsten offenen Wähler
- [ ] manipuliertes nicht-sequenzielles Voting verworfen
- [ ] Stichwahl / Guess / Punkte / Exact-once

### Datengrenzen

- [ ] 50 Kategorien akzeptiert / 51 abgelehnt
- [ ] 200 Begriffe akzeptiert / 201 abgelehnt
- [ ] Ablehnung verändert Bestandsdaten nicht
- [ ] 1,5-MB-UTF-8-Grenze
- [ ] Multibyte-Datei nach Bytes bewertet

## 4. Direkte Hub-Core-Spiele

Je Spiel vollständiger Durchlauf: Wahrheit oder Pflicht, Ich habe noch nie, Wer würde eher?, Entweder oder, Paranoia, Scharade, Tabu, Heiße Kartoffel, Wortkette, Nur falsche Antworten.

Gemeinsam:

- [ ] Regeln verständlich
- [ ] Skip ohne künstlichen Punkt
- [ ] Speichern ≠ Verwerfen
- [ ] Reload/Resume
- [ ] Verlauf exact-once
- [ ] modaler Tastaturkontext

Spezifisch:

- [ ] persönliche Games freiwillig
- [ ] Paranoia Secret Cover
- [ ] Scharade/Tabu Secret Cover + Timer
- [ ] Hot Potato 10–25 s
- [ ] Word Chain manuelle Gültigkeit
- [ ] Wrong Answers scorelos

## 5. Hub Resume Guard v2 / v50

- [ ] gültige normale Session bleibt fortsetzbar
- [ ] gültiger Scharade-Timer bleibt fortsetzbar
- [ ] Truth/Dare + Charades-Timer verworfen
- [ ] Charades + Taboo-Timer verworfen
- [ ] running + 0 ms verworfen
- [ ] stale Resume-Karte wird beim Verwerfen entfernt
- [ ] **während Guard lädt: Resume-Karte `aria-busy`**
- [ ] **Resume-Buttons während Guard lädt deaktiviert**
- [ ] kein Klick vor Validierung möglich
- [ ] gültige Session wird nach erfolgreicher Prüfung wieder bedienbar
- [ ] Ladefehler bleibt fail-closed
- [ ] gültige Session bleibt unverändert
- [ ] online und offline identisch

## 6. Advanced Core

Für Two Truths, Question Imposter, Location Spy und Mafia:

- [ ] Fachlogik
- [ ] Privacy/Secret Cover
- [ ] Resume
- [ ] Siegerzustand
- [ ] Modal/Fokus-Trap
- [ ] Hintergrund nicht fokussierbar

## 7. Quick / Extended / Labs

Je Mechanikfamilie mindestens ein kompletter Smoke:

- [ ] Spektrum-Tipp
- [ ] Zeichnen/Raten
- [ ] Schnellfeuer
- [ ] Sound/Stirn/Melodie
- [ ] Kategorien
- [ ] Blind Ranking / Emoji / Schätzen
- [ ] Higher/Lower
- [ ] Hot Seat / Story Chain
- [ ] Fokus bleibt nach dynamischem Re-Render sinnvoll

## 8. Creator

- [ ] Template-Radiogroup mit Tab + Pfeile/Home/End
- [ ] Wizard-Schrittfokus
- [ ] Hilfe-Modal + Fokus-Trap/Rückkehr
- [ ] mehrere Packs
- [ ] sichere Textbehandlung
- [ ] Speichern/Editieren/Kopieren/Löschen
- [ ] Export/Import
- [ ] unerfahrene Person kann valides Spiel erstellen

## 9. Smart Party Night

- [ ] 15 / 30 / 45 / 60 / 90 Minuten
- [ ] unterschiedliche Gruppen/Stimmungen
- [ ] History-Synchronisierung
- [ ] Neustart/Abbruch
- [ ] drei vollständige reale Abende

## 10. Backup / Datenschutz

- [ ] Word-Imposter-Backup
- [ ] Gesamtexport
- [ ] Creator-Bibliothek
- [ ] ungültiges JSON / unbekannter Namespace abgelehnt
- [ ] Größenlimit
- [ ] Schreibfehler-Rollback
- [ ] abgelehnter Import verändert Bestandsdaten nicht
- [ ] vollständige lokale Löschung

## 11. PWA / Offline – v50

- [ ] Android-Installation
- [ ] iOS Add to Home Screen
- [ ] Offline-Neustart
- [ ] alle Kernseiten offline
- [ ] Query-Routen offline
- [ ] Word-/Hub-/Advanced-Guards offline
- [ ] `party-hub-polish.js` v50-Quarantäne offline
- [ ] A11y-Schichten offline
- [ ] DWI offline
- [ ] Hub Resume v50 offline
- [ ] Update von mindestens zwei älteren Installationen
- [ ] aktive Session über Update geschützt
- [ ] lokale Daten erhalten
- [ ] Rollback mit neuer Cachegeneration

## 12. Hintergrund / Sperrbildschirm / Reload

- [ ] Appwechsel
- [ ] Sperren/Entsperren
- [ ] Reload während Session
- [ ] Timer korrekt
- [ ] keine doppelte Statistik
- [ ] private Inhalte verdeckt

## 13. Accessibility / Mobile

- [ ] Tastatur ohne Maus
- [ ] Skip-Link
- [ ] sichtbarer Fokus
- [ ] Hub-/Advanced-/Creator-Modalfokus
- [ ] Quick-Fokus-Recovery
- [ ] VoiceOver
- [ ] TalkBack
- [ ] 200-%-Zoom / 320 CSS px
- [ ] große Systemschrift / Safe Areas
- [ ] Touchziele / Reduced Motion
- [ ] Resume-Quarantäne verständlich und nicht fokussierbar solange gesperrt

## 14. Reale Partytests

- [ ] 3–4 Personen / ≥60 min
- [ ] 5–8 Personen / ≥90 min
- [ ] 9–12 Personen / ≥90 min
- [ ] Multi-Imposter
- [ ] DWI mit neutralen Daten
- [ ] HR2/v50 mit neutralem Zustand
- [ ] Mafia
- [ ] Scharade/Tabu
- [ ] Party Night
- [ ] mindestens ein Nachweis pro Core-Spiel

## 15. Content / Rechte

- [ ] Ton/Privacy/Safety/Alter
- [ ] keine problematischen Wiederholungen
- [ ] keine ungeklärten Fan-/Markenbezüge
- [ ] keine ungeklärten visuellen Rechte
- [ ] `ASSET_RIGHTS_SIGNOFF.md` vollständig

Root-`icon.svg` bleibt bis belegter Rechtebasis oder Ersatz offen.

## 16. Release-Freigabekriterium

- [ ] automatisierter Preflight grün
- [ ] Branch Protection aktiv
- [ ] HTTPS-Staging/Production grün
- [ ] Android/iPhone/iPad real
- [ ] Accessibility real
- [ ] DWI real
- [ ] Hub Resume v2/v50-Ladequarantäne real
- [ ] mindestens ein realer Nachweis pro Core-Spiel
- [ ] G1–G5 / DWI / HR2 / PN1–PN3 abgeschlossen
- [ ] zwei echte PWA-Upgrades + Rollback
- [ ] keine offenen Critical/High-Funde
- [ ] Content/Rechte/Legal/Support/Hosting-Sign-off
- [ ] Incident-/Rollback-Drill
- [ ] unveränderter RC
- [ ] `release-evidence.json = FINAL / GO`

Bis dahin bleibt der öffentliche Release **NO_GO** und PR #13 **Draft / ungemergt**.