# Secret Circle – Beta-, Geräte- und Gruppentestplan

Stand: 27. August 2026  
Status: **PREPARED – reale Durchführung offen**  
Offline-Core: **`secret-circle-v57` / `secret-circle-v57-staging`**

## 1. Eintrittskriterium

Finale RC-Beta erst auf demselben unveränderten Commit mit sichtbaren GitHub-Actions-Steps, Online-`npm ci`, `npm run ci` und Chromium/Firefox/WebKit.

Letzter vollständig untersuchter App-Actions-Lauf: **#2787 auf v49**, Run ID `32871536761`, Job `97879489858`, Head `a9ad91389ff9e966af432b0a77103ddc0960709d`, `steps: null` / `steps: []`. Kein Repositorycode wurde ausgeführt. **v50–v57 sind nicht runnerverifiziert.**

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
| **QT57** | Quick-Family Timer-Restzeit über Reload |
| PN1–PN3 | Smart Party Night |

## 3. Bestehende Spezialgates

DWI, HR2, BK51, HR52, PR53, PT54, AD55 und QR56 bleiben verbindlich. Vorhandene Source-Tests sind kein realer PASS.

## 4. QT57 – Quick Timer Resume

### Restzeit

- [ ] Rapid Fire mit sichtbarem Timer starten.
- [ ] Timer mindestens 1 Sekunde laufen lassen und Restzeit notieren.
- [ ] Seite reloaden.
- [ ] gespeicherte Session bewusst fortsetzen.
- [ ] Timer startet mit der zuvor verbleibenden Zeit, **nicht** mit voller Ausgangsdauer.
- [ ] passender Snapshot wird danach aus `secret-circle-party-quick-timers-v1` entfernt.

### Stale / Manipulation

- [ ] Timer-Snapshot mit anderer Session-ID wird ignoriert und gelöscht.
- [ ] andere Runde wird ignoriert.
- [ ] andere Phase wird ignoriert.
- [ ] andere Ausgangsdauer wird ignoriert.
- [ ] ungültige Restzeit > Ausgangsdauer wird durch Registry/Runtime abgelehnt.

### Privacy / Backup

- [ ] Timer-Store enthält nur Familie, Game-ID, Session-ID, Runde, Phase, `durationMs`, `remainingMs`.
- [ ] keine Prompt-/Antwort-/Mission-/Identitäts-/Kartenfelder im Store.
- [ ] Complete Backup exportiert/restauriert den gültigen Timer-Store als einen der 17 aktuellen managed Keys.
- [ ] Future-/Unknown-Keys bleiben weiterhin unangetastet.

### Familien / Offline

- [ ] mindestens ein zeitgesteuerter Quick-/Trending-Modus.
- [ ] mindestens ein Mega-Modus mit Timer.
- [ ] mindestens ein Viral-Modus mit Timer, sofern vorhanden.
- [ ] mindestens ein Creator-Spiel mit Timer, sofern vorhanden.
- [ ] denselben QT57-Ablauf in installierter v57-PWA offline wiederholen.

Source-Verträge: `party-session-controls.js` v2, `tests/party-session-controls.test.js`, `tests/e2e/quick-timer-resume.spec.js`, `tests/backup-schema-registry.test.js`, `scripts/quick_timer_resume_audit.py` und `scripts/backup_contract_audit.py`.

## 5. QR56 – Quick Session Replacement

- [ ] Same Game: Start verlangt Verwerfbestätigung; Cancel erhält Session-ID.
- [ ] Cross Game derselben Familie: Start verlangt ebenfalls Bestätigung.
- [ ] Confirm ersetzt erst durch erfolgreichen Engine-Write.
- [ ] Replacement-Write-Fail erhält den alten Snapshot fail-closed.
- [ ] Quick/Mega/Viral/Creator repräsentativ prüfen.

## 6. Reale Gruppen / Geräte

- [ ] G1 3–4 Personen ≥60 min
- [ ] G2 5–8 Personen ≥90 min
- [ ] G3 9–12 Personen ≥90 min
- [ ] G4 Mafia mehrere Gruppengrößen
- [ ] G5 Creator mit unerfahrener Person
- [ ] Android / iPhone / Tablet
- [ ] VoiceOver / TalkBack / 200-%-Zoom / Tastatur / Touch
- [ ] mindestens ein realer Nachweis pro Core-Spiel
- [ ] PN1–PN3

## 7. PWA Update / Rollback

- [ ] mindestens zwei ältere installierte Versionen auf v57/RC aktualisieren
- [ ] aktive Sessions und lokale Daten erhalten
- [ ] DWI / HR2 / BK51 / HR52 / PR53 / PT54 / AD55 / QR56 / QT57 offline prüfen
- [ ] Rollback/Hotfix mit neuer Cachegeneration

## 8. Beta-Freigabe

Vor `REAL USER / DEVICE PASS` müssen G1–G5, DWI, HR2, BK51, HR52, PR53, PT54, AD55, QR56, **QT57**, PN1–PN3, reale Geräte/Accessibility, zwei PWA-Upgrades und Rollback abgeschlossen sein. Keine offenen Critical/High Bugs.

Bis dahin bleibt die reale Durchführung offen und der öffentliche Release **NO_GO**.