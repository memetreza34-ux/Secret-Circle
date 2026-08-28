# Secret Circle – Beta-, Geräte- und Gruppentestplan

Stand: 28. August 2026  
Status: **PREPARED – reale Durchführung offen**  
Offline-Core: **`secret-circle-v59` / `secret-circle-v59-staging`**

## 1. Eintrittskriterium

Finale RC-Beta erst auf demselben unveränderten Commit mit sichtbaren GitHub-Actions-Steps, Online-`npm ci`, `npm run ci` und Chromium/Firefox/WebKit.

Letzter vollständig untersuchter App-Actions-Lauf: **#2787 auf v49**, Run ID `32871536761`, Job `97879489858`, Head `a9ad91389ff9e966af432b0a77103ddc0960709d`, `steps: null` / `steps: []`. Kein Repositorycode wurde ausgeführt. **v50–v59 sind nicht runnerverifiziert.**

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
| BF58 | mobile BFCache-Rückkehr laufender Quick-Family-Timer |
| **BG59** | App-Wechsel/Screen-Lock pausiert Timer fair und ohne Auto-Resume |
| PN1–PN3 | Smart Party Night |

## 3. QT57 / BF58

- [ ] normaler Reload übernimmt Restzeit statt voller Dauer
- [ ] stale Timer-Snapshots werden verworfen
- [ ] Timer-Store bleibt promptfrei und im 17-Key-Backupvertrag
- [ ] BFCache Matching führt kontrolliert in den QT57-Resume-Pfad
- [ ] BFCache Stale löscht Snapshot ohne unnötigen Reload

## 4. BG59 – Background Timer Fairness

### App-/Tabwechsel

- [ ] Quick-Family-Timer starten und Restzeit notieren.
- [ ] App oder Tab wechseln, sodass `document.hidden` eintritt.
- [ ] mindestens 10 Sekunden im Hintergrund bleiben.
- [ ] zurückkehren: Timer ist **weiterhin pausiert** und Restzeit wurde nicht um die Hintergrunddauer reduziert.
- [ ] Pause-Overlay ist sichtbar und `Fortsetzen` wird angeboten.
- [ ] erst bewusster Klick auf `Fortsetzen` lässt die Zeit wieder ablaufen.

### Screen-Lock

- [ ] laufenden Timer starten.
- [ ] Gerät sperren, mindestens 10 Sekunden warten und entsperren.
- [ ] Timer darf weder heimlich abgelaufen sein noch automatisch weiterlaufen.
- [ ] bewusster Resume-Klick startet wieder exakt vom pausierten Stand.

### Idle / Regression

- [ ] Visibility-Wechsel ohne laufenden Timer verändert keine Runde.
- [ ] bereits manuell pausierter Timer bleibt pausiert.
- [ ] Skip/Abort bleiben während Pause gesperrt bzw. gemäß bestehendem Controls-Vertrag korrekt.
- [ ] QT57-Reload und BF58-BFCache funktionieren nach BG59 unverändert.

### Geräte / PWA

- [ ] iPhone Safari
- [ ] iPad Safari
- [ ] Android Chrome
- [ ] installierte v59-PWA
- [ ] mindestens ein Mega-/Viral-/Creator-Timer repräsentativ, soweit vorhanden

Source-Verträge: `party-session-controls.js` v4, `tests/party-session-controls.test.js`, `tests/e2e/quick-background-pause.spec.js`, `scripts/quick_background_pause_audit.py`, QT57/BF58-Audits und `scripts/architecture_audit.py`.

## 5. QR56 – Quick Session Replacement

- [ ] Same Game: Start verlangt Verwerfbestätigung; Cancel erhält Session-ID.
- [ ] Cross Game derselben Familie: Start verlangt ebenfalls Bestätigung.
- [ ] Confirm ersetzt erst durch erfolgreichen Engine-Write.
- [ ] Replacement-Write-Fail erhält den alten Snapshot fail-closed.

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

- [ ] mindestens zwei ältere installierte Versionen auf v59/RC aktualisieren
- [ ] aktive Sessions und lokale Daten erhalten
- [ ] DWI / HR2 / BK51 / HR52 / PR53 / PT54 / AD55 / QR56 / QT57 / BF58 / BG59 offline soweit anwendbar prüfen
- [ ] Rollback/Hotfix mit neuer Cachegeneration

## 8. Beta-Freigabe

Vor `REAL USER / DEVICE PASS` müssen G1–G5, DWI, HR2, BK51, HR52, PR53, PT54, AD55, QR56, QT57, BF58, **BG59**, PN1–PN3, reale Geräte/Accessibility, zwei PWA-Upgrades und Rollback abgeschlossen sein. Keine offenen Critical/High Bugs.

Bis dahin bleibt die reale Durchführung offen und der öffentliche Release **NO_GO**.