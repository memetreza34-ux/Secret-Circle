# Secret Circle – Beta-, Geräte- und Gruppentestplan

Stand: 26. August 2026  
Status: **PREPARED – reale Durchführung offen**  
Offline-Core: **`secret-circle-v54` / `secret-circle-v54-staging`**

## 1. Eintrittskriterium

Finale RC-Beta erst auf demselben unveränderten Commit mit sichtbaren GitHub-Actions-Steps, Online-`npm ci`, `npm run ci` und Chromium/Firefox/WebKit.

Letzter vollständig untersuchter App-Actions-Lauf: **#2787 auf v49**, Run ID `32871536761`, Job `97879489858`, Head `a9ad91389ff9e966af432b0a77103ddc0960709d`, `steps: null` / `steps: []`. Kein Repositorycode wurde ausgeführt. **v50–v54 sind nicht runnerverifiziert.**

## 2. Mindest-Testmatrix

| ID | Schwerpunkt |
|---|---|
| G1–G5 | reale Gruppen / Core / Advanced / Creator |
| DWI | Word-Imposter Datengrenzen und Voting-Resume |
| HR2 | Hub Resume Guard v2 + v50-Ladequarantäne |
| BK51 | Complete Backup / Forward Compatibility / Rollback |
| HR52 | sichere Hub-Current-Runden / Truth-Dare-Pools |
| PR53 | Paranoia Resume + Privacy |
| PT54 | Hot-Potato-/Word-Chain-Pre-Timer-Resume |
| PN1–PN3 | Smart Party Night |

## 3. DWI

- [ ] 50 Kategorien akzeptiert / 51 abgelehnt
- [ ] 200 Begriffe akzeptiert / 201 abgelehnt
- [ ] 1,5 MB UTF-8 nach Bytes
- [ ] abgelehnter Import verändert Bestandsdaten nicht
- [ ] partielles Voting setzt beim nächsten offenen Wähler fort
- [ ] manipuliertes nicht-sequenzielles Voting wird verworfen

## 4. HR2 – Hub Resume Guard v2 / v50

- [ ] gültige normale/Timer-Session bleibt fortsetzbar
- [ ] Cross-Mode-/0-ms-Running-Timer verworfen
- [ ] stale Resume-Karte entfernt
- [ ] während Guard-Prüfung `aria-busy` + Aktionen deaktiviert
- [ ] Erfolg reaktiviert Aktionen; Ladefehler bleibt fail-closed
- [ ] offline identisch

## 5. BK51 – Complete Backup

- [ ] regulärer managed Restore
- [ ] unbekannter Future-Namespace/Future-Version bleibt unverändert
- [ ] nicht unterstützter Future-Key im Backup abgelehnt
- [ ] falsche Storage-Version / Klartext / primitive JSON-Wurzel abgelehnt
- [ ] >1,5 MB UTF-8 abgelehnt
- [ ] Write-/Quota-Fehler rollt managed Snapshot zurück
- [ ] explizite Komplettlöschung entfernt alle `secret-circle-*`-Reste

## 6. HR52 – sichere direkte Hub-Runden

- [ ] Wahrheit/Pflicht nach Reload exakt dieselbe Karte
- [ ] Wahrheit/Pflicht gleiche numerische Indizes unabhängig nutzbar
- [ ] Prompt-/Choice-Current nach Reload identisch
- [ ] ungültiger Current verworfen
- [ ] next/Skip löscht Current

## 7. PR53 – Paranoia Resume / Privacy

- [ ] Frage öffnen → Reload/Resume bleibt gedeckt → explizites Reveal zeigt exakt dieselbe Frage
- [ ] Münzwurf einmal entscheiden → Reload/Resume bleibt gedeckt → Ergebnisanzeige zeigt exakt dasselbe Ergebnis
- [ ] kein erneuter Zufallswurf
- [ ] Blur/Appwechsel verdeckt Frage und auch bereits aufgelösten Zustand
- [ ] ungültige Paranoia-Referenz verworfen

## 8. PT54 – Pre-Timer Resume

### Hot Potato

1. Aufgabe vor Timerstart notieren.
2. Active-State: `timer === null`, `current.kind === 'hot-potato'`.
3. Reload → Session fortsetzen → **exakt dieselbe Aufgabe**.
4. `used` und `current` dürfen durch den Reload nicht zusätzlich verändert werden.
5. Zufallstimer starten.
6. Active-State: `current === null`, `timer.kind === 'hot-potato'`, `timer.prompt` entspricht exakt der vorherigen Aufgabe.
7. zufällige Dauer bleibt real zwischen 10 und 25 Sekunden und Countdown bleibt verborgen.

### Wortkette

1. Startbuchstaben vor Timerstart notieren.
2. Active-State: `timer === null`, `current.kind === 'word-chain'`.
3. Reload → Session fortsetzen → **exakt derselbe Startbuchstabe**.
4. 30-Sekunden-Runde starten.
5. Active-State: `current === null`, `timer.kind === 'word-chain'`, `timer.letter` entspricht dem vorherigen Buchstaben.
6. nach weiterem Reload läuft der bestehende Timer-Resume-Pfad pausiert mit demselben Buchstaben weiter.

### Privacy-Grenze

- [ ] Scharade und Tabu besitzen **keinen sichtbaren Pre-Start-Current-Vertrag**.
- [ ] PT54 wird offline in installierter v54-PWA wiederholt.

## 9. Reale Gruppen / Geräte

- [ ] G1 3–4 Personen ≥60 min
- [ ] G2 5–8 Personen ≥90 min
- [ ] G3 9–12 Personen ≥90 min
- [ ] G4 Mafia mehrere Gruppengrößen
- [ ] G5 Creator mit unerfahrener Person
- [ ] Android / iPhone / Tablet
- [ ] VoiceOver / TalkBack / 200-%-Zoom / Tastatur / Touch
- [ ] mindestens ein realer Nachweis pro Core-Spiel
- [ ] PN1–PN3

## 10. PWA Update / Rollback

- [ ] mindestens zwei ältere installierte Versionen auf v54/RC aktualisieren
- [ ] aktive Sessions und lokale Daten erhalten
- [ ] DWI / HR2 / BK51 / HR52 / PR53 / PT54 offline prüfen
- [ ] Rollback/Hotfix mit neuer Cachegeneration

## 11. Beta-Freigabe

Vor `REAL USER / DEVICE PASS` müssen G1–G5, DWI, HR2, BK51, HR52, PR53, **PT54**, PN1–PN3, reale Geräte/Accessibility, zwei PWA-Upgrades und Rollback abgeschlossen sein. Keine offenen Critical/High Bugs.

Bis dahin bleibt die reale Durchführung offen und der öffentliche Release **NO_GO**.