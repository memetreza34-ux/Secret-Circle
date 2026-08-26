# Secret Circle Party Hub – Manueller Testplan Januar 2027

Stand: 26. August 2026  
Status: **PREPARED – reale Durchführung offen**  
Offline-Core: **`secret-circle-v53` / `secret-circle-v53-staging`**  
Produktstand: **45 Built-ins · 15 Core · 13 Extended · 17 Labs · lokaler Game Creator**

Vorhandener Code oder vorhandene Tests sind **kein manueller PASS**.

## 1. Automatisierter Preflight

Vor finaler RC-Abnahme auf demselben Commit:

- [ ] Actions erreicht sichtbare Steps
- [ ] Checkout ausgeführt
- [ ] Online-`npm ci` grün
- [ ] `npm run check` grün
- [ ] `npm test` grün
- [ ] `npm run validate` grün
- [ ] Chromium E2E grün inklusive HR52/BK51/PR53
- [ ] vollständiges `npm run ci` grün
- [ ] Chromium / Firefox / WebKit grün

Letzter vollständig untersuchter App-Actions-Lauf: **#2787 auf v49**, Run ID `32871536761`, Job `97879489858`, Head `a9ad91389ff9e966af432b0a77103ddc0960709d`, `steps: null` / `steps: []`. Kein Repositorycode wurde ausgeführt. **v50–v53 sind nicht runnerverifiziert.**

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
- [ ] 1 / mehrere / max. 6 Imposter; 7 abgelehnt
- [ ] mindestens 20 Fairnessrunden
- [ ] Secret Handoff / Appwechsel
- [ ] Timer / geheimes Voting / Teilvoting-Resume
- [ ] manipuliertes nicht-sequenzielles Voting verworfen
- [ ] Stichwahl / Guess / Punkte / Exact-once
- [ ] 50/51 Kategorien
- [ ] 200/201 Begriffe
- [ ] 1,5-MB-UTF-8-Grenze inkl. Multibyte
- [ ] Ablehnung verändert Bestandsdaten nicht

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

- [ ] Wahrheit/Pflicht: geöffnete Karte über Reload identisch
- [ ] Wahrheit/Pflicht: unabhängige Usage-Pools
- [ ] Prompt/Choice: sichere Current-Karte identisch
- [ ] Paranoia: PR53 vollständig
- [ ] Scharade/Tabu: Secret Cover + Timer
- [ ] Hot Potato: 10–25 s
- [ ] Word Chain: manuelle Gültigkeit
- [ ] Wrong Answers: scorelos

## 5. HR2 – Hub Resume Guard v2 / v50

- [ ] gültige normale und Timer-Session fortsetzbar
- [ ] Cross-Mode-/0-ms-Running-Timer verworfen
- [ ] stale Resume-Karte entfernt
- [ ] während Guard lädt: `aria-busy`, Buttons deaktiviert
- [ ] kein Klick vor Validierung
- [ ] gültige Session danach wieder bedienbar
- [ ] Ladefehler fail-closed
- [ ] online und offline identisch

## 6. HR52 – sichere Hub-Current-Runden

- [ ] Wahrheit → Reload → identische Karte
- [ ] Pflicht → Reload → identische Karte
- [ ] Wahrheit/Pflicht gleicher numerischer Index unabhängig nutzbar
- [ ] Prompt-/Choice-Current identisch
- [ ] ungültiger Current verworfen
- [ ] `next`/Skip löschen Current
- [ ] Secret-Modi nicht automatisch offen
- [ ] offline identisch

## 7. PR53 – Paranoia Resume / Privacy

- [ ] geheime Frage öffnen und Text notieren
- [ ] Reload → Resume bleibt zunächst verdeckt
- [ ] bewusste Reveal-Aktion zeigt exakt dieselbe Frage
- [ ] Münzwurf einmal ausführen und Ergebnis notieren
- [ ] Reload → Ergebnis bleibt zunächst verdeckt
- [ ] bewusste Ergebnisanzeige zeigt exakt dasselbe Ergebnis
- [ ] kein neuer Zufallswurf nach Resume
- [ ] Blur/Appwechsel bei offener Frage verdeckt automatisch
- [ ] Blur/Appwechsel nach Münzwurf/Auflösung verdeckt ebenfalls automatisch
- [ ] ungültige/out-of-range Paranoia-Referenz verworfen
- [ ] nächste Person / globales Skip entfernt privaten Rundenstatus
- [ ] installierte v53-PWA offline identisch

## 8. Advanced Core

Für Two Truths, Question Imposter, Location Spy und Mafia:

- [ ] Fachlogik
- [ ] Privacy/Secret Cover
- [ ] Resume
- [ ] Siegerzustand
- [ ] Modal/Fokus-Trap
- [ ] Hintergrund nicht fokussierbar

## 9. Quick / Extended / Labs

Je Mechanikfamilie mindestens ein kompletter Smoke: Spektrum-Tipp, Zeichnen/Raten, Schnellfeuer, Sound/Stirn/Melodie, Kategorien, Blind Ranking/Emoji/Schätzen, Higher/Lower, Hot Seat/Story Chain. Dynamische Re-Renders müssen sinnvollen Fokus behalten.

## 10. Creator

- [ ] Template-Radiogroup Tab + Pfeile/Home/End
- [ ] Wizard-Schrittfokus
- [ ] Hilfe-Modal + Fokus-Trap/Rückkehr
- [ ] mehrere Packs / sichere Textbehandlung
- [ ] Speichern/Editieren/Kopieren/Löschen
- [ ] Export/Import
- [ ] unerfahrene Person erstellt valides Spiel ohne Entwicklerhilfe

## 11. Smart Party Night

- [ ] 15 / 30 / 45 / 60 / 90 Minuten
- [ ] unterschiedliche Gruppen/Stimmungen
- [ ] History-Synchronisierung
- [ ] Neustart/Abbruch
- [ ] drei vollständige reale Abende

## 12. BK51 – Complete Backup

- [ ] Gesamtexport enthält registrierte lokale Appdaten
- [ ] regulärer Restore ersetzt managed Bestandsdaten sauber
- [ ] unbekannter Namespace bleibt unverändert
- [ ] Future-Version wie `secret-circle-party-hub-v2` bleibt unverändert
- [ ] nicht unterstützter Future-Key im Backup wird abgelehnt
- [ ] falsche Storage-Version / Klartext / primitive JSON-Wurzel vor Mutation abgelehnt
- [ ] >1,5 MB UTF-8 abgelehnt
- [ ] Write-/Quota-Störung löst managed Rollback aus
- [ ] unknown/future Daten bleiben während Rollback unverändert
- [ ] explizite Komplettlöschung entfernt alle `secret-circle-*`-Keys

## 13. PWA / Offline – v53

- [ ] Android-Installation
- [ ] iOS Add to Home Screen
- [ ] Offline-Neustart
- [ ] alle Kernseiten + Query-Routen offline
- [ ] Word-/Hub-/Advanced-Guards offline
- [ ] `party-hub-round-state.js` v2 offline
- [ ] `party-hub-polish.js` v17 offline
- [ ] Backup-Registry + `party-data-tools.js` v6 offline
- [ ] A11y-Schichten offline
- [ ] DWI / HR2 / BK51 / HR52 / PR53 offline
- [ ] Update von mindestens zwei älteren Installationen auf v53/RC
- [ ] aktive Session über Update geschützt
- [ ] lokale managed/future Testdaten erhalten
- [ ] Rollback mit neuer Cachegeneration

## 14. Hintergrund / Accessibility / Mobile

- [ ] Appwechsel / Sperren / Entsperren / Reload
- [ ] Timer korrekt und keine doppelte Statistik
- [ ] private Inhalte verdeckt
- [ ] sichere Current-Karten korrekt fortgesetzt
- [ ] Tastatur ohne Maus / sichtbarer Fokus / Skip-Link
- [ ] Hub-/Advanced-/Creator-Modalfokus
- [ ] VoiceOver / TalkBack
- [ ] 200-%-Zoom / 320 CSS px
- [ ] große Systemschrift / Safe Areas
- [ ] Touchziele / Reduced Motion

## 15. Reale Partytests

- [ ] 3–4 Personen / ≥60 min
- [ ] 5–8 Personen / ≥90 min
- [ ] 9–12 Personen / ≥90 min
- [ ] Multi-Imposter
- [ ] DWI
- [ ] HR2
- [ ] BK51
- [ ] HR52
- [ ] PR53
- [ ] Mafia
- [ ] Scharade/Tabu
- [ ] Party Night
- [ ] mindestens ein Nachweis pro Core-Spiel

## 16. Release-Freigabekriterium

- [ ] automatisierter Preflight grün
- [ ] Branch Protection aktiv
- [ ] HTTPS-Staging/Production grün
- [ ] Android/iPhone/iPad real
- [ ] Accessibility real
- [ ] DWI / HR2 / BK51 / HR52 / PR53 real
- [ ] mindestens ein realer Nachweis pro Core-Spiel
- [ ] G1–G5 und PN1–PN3 abgeschlossen
- [ ] zwei echte PWA-Upgrades auf v53 + Rollback
- [ ] keine offenen Critical/High-Funde
- [ ] Content/Rechte/Legal/Support/Hosting-Sign-off
- [ ] Incident-/Rollback-Drill
- [ ] unveränderter RC
- [ ] `release-evidence.json = FINAL / GO`

Bis dahin bleibt der öffentliche Release **NO_GO** und PR #13 **Draft / ungemergt**.