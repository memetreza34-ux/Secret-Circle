# Secret Circle – Beta-, Geräte- und Gruppentestplan

Stand: 27. August 2026  
Status: **PREPARED – reale Durchführung offen**  
Offline-Core: **`secret-circle-v58` / `secret-circle-v58-staging`**

## 1. Eintrittskriterium

Finale RC-Beta erst auf demselben unveränderten Commit mit sichtbaren GitHub-Actions-Steps, Online-`npm ci`, `npm run ci` und Chromium/Firefox/WebKit.

Letzter vollständig untersuchter App-Actions-Lauf: **#2787 auf v49**, Run ID `32871536761`, Job `97879489858`, Head `a9ad91389ff9e966af432b0a77103ddc0960709d`, `steps: null` / `steps: []`. Kein Repositorycode wurde ausgeführt. **v50–v58 sind nicht runnerverifiziert.**

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
| AD55 | Advanced Result-/Winner-/Resume-Integrität und Session-Ersatz |
| QR56 | Quick-/Mega-/Viral-/Creator-Session-Ersatz |
| QT57 | Quick-Family Timer-Restzeit über normalen Reload |
| **BF58** | mobile BFCache-Rückkehr laufender Quick-Family-Timer |
| PN1–PN3 | Smart Party Night |

## 3. Bestehende Spezialgates

DWI, HR2, BK51, HR52, PR53, PT54, AD55, QR56 und QT57 bleiben verbindlich. Vorhandene Source-Tests sind kein realer PASS.

## 4. QT57 – Quick Timer Resume

- [ ] Rapid Fire oder anderer Quick-Family-Timer mindestens 1 Sekunde laufen lassen.
- [ ] Reload → gespeicherte Session bewusst fortsetzen.
- [ ] Timer startet mit Restzeit, nicht voller Ausgangsdauer.
- [ ] Fremd-/Stale-Snapshots nach Session/Runde/Phase/Dauer werden ignoriert und gelöscht.
- [ ] Timer-Store enthält nur technische Metadaten; keine Prompt-/Antwort-/Mission-/Identitäts-/Kartenfelder.
- [ ] Complete Backup exportiert/restauriert den gültigen Timer-Store als einen von 17 aktuellen managed Keys.
- [ ] Quick/Mega/Viral/Creator repräsentativ prüfen, soweit zeitgesteuert.

## 5. BF58 – BFCache Timer Resume

### Matching Snapshot

- [ ] laufenden Timer starten und Restzeit notieren.
- [ ] zu einer anderen Seite navigieren, sodass der Browser die Spielseite in den Back-Forward-Cache legen kann.
- [ ] per Zurück-Navigation auf die Spielseite zurückkehren.
- [ ] bei `pageshow.persisted` mit passendem Timer-Snapshot erfolgt ein kontrollierter Reload in den normalen QT57-Resume-Pfad.
- [ ] danach wird dieselbe Restzeit fortgesetzt; kein eingefrorener In-Memory-Timer bleibt sichtbar.

### Stale Snapshot

- [ ] BFCache-Rückkehr mit anderer Session-ID/Runde/Phase/Dauer simulieren.
- [ ] stale Snapshot wird entfernt.
- [ ] kein unnötiger Reload erfolgt.

### Mobile / PWA

- [ ] Safari auf iPhone/iPad real prüfen.
- [ ] Chrome auf Android real prüfen.
- [ ] installierte v58-PWA prüfen, soweit der Plattform-Lifecycle BFCache zulässt.
- [ ] Offlinezustand + BFCache/History-Rückkehr gemeinsam testen.

Source-Verträge: `party-session-controls.js` v3, `tests/party-session-controls.test.js`, `scripts/quick_bfcache_resume_audit.py`, `scripts/quick_timer_resume_audit.py` und `scripts/architecture_audit.py`.

## 6. QR56 – Quick Session Replacement

- [ ] Same Game: Start verlangt Verwerfbestätigung; Cancel erhält Session-ID.
- [ ] Cross Game derselben Familie: Start verlangt ebenfalls Bestätigung.
- [ ] Confirm ersetzt erst durch erfolgreichen Engine-Write.
- [ ] Replacement-Write-Fail erhält den alten Snapshot fail-closed.
- [ ] Quick/Mega/Viral/Creator repräsentativ prüfen.

## 7. Reale Gruppen / Geräte

- [ ] G1 3–4 Personen ≥60 min
- [ ] G2 5–8 Personen ≥90 min
- [ ] G3 9–12 Personen ≥90 min
- [ ] G4 Mafia mehrere Gruppengrößen
- [ ] G5 Creator mit unerfahrener Person
- [ ] Android / iPhone / Tablet
- [ ] VoiceOver / TalkBack / 200-%-Zoom / Tastatur / Touch
- [ ] mindestens ein realer Nachweis pro Core-Spiel
- [ ] PN1–PN3

## 8. PWA Update / Rollback

- [ ] mindestens zwei ältere installierte Versionen auf v58/RC aktualisieren
- [ ] aktive Sessions und lokale Daten erhalten
- [ ] DWI / HR2 / BK51 / HR52 / PR53 / PT54 / AD55 / QR56 / QT57 / BF58 offline soweit anwendbar prüfen
- [ ] Rollback/Hotfix mit neuer Cachegeneration

## 9. Beta-Freigabe

Vor `REAL USER / DEVICE PASS` müssen G1–G5, DWI, HR2, BK51, HR52, PR53, PT54, AD55, QR56, QT57, **BF58**, PN1–PN3, reale Geräte/Accessibility, zwei PWA-Upgrades und Rollback abgeschlossen sein. Keine offenen Critical/High Bugs.

Bis dahin bleibt die reale Durchführung offen und der öffentliche Release **NO_GO**.