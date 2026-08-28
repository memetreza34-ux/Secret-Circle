# Secret Circle – Beta-, Geräte- und Gruppentestplan

Stand: 28. August 2026  
Status: **PREPARED – reale Durchführung offen**  
Offline-Core: **`secret-circle-v60` / `secret-circle-v60-staging`**

## 1. Eintrittskriterium

Finale RC-Beta erst auf demselben unveränderten Commit mit sichtbaren GitHub-Actions-Steps, Online-`npm ci`, `npm run ci` und Chromium/Firefox/WebKit.

Letzter vollständig untersuchter App-Actions-Lauf: **#2787 auf v49**, Run ID `32871536761`, Job `97879489858`, Head `a9ad91389ff9e966af432b0a77103ddc0960709d`, `steps: null` / `steps: []`. Kein Repositorycode wurde ausgeführt. **v50–v60 sind nicht runnerverifiziert.**

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
| BG59 | App-Wechsel/Screen-Lock pausiert Timer fair und ohne Auto-Resume |
| **HS60** | Hidden persistiert Timer sofort; Cold Resume auch ohne zuverlässiges `pagehide` |
| PN1–PN3 | Smart Party Night |

## 3. QT57 / BF58 / BG59

- [ ] normaler Reload übernimmt Restzeit statt voller Dauer
- [ ] stale Timer-Snapshots werden verworfen
- [ ] Timer-Store bleibt promptfrei und im 17-Key-Backupvertrag
- [ ] BFCache Matching führt kontrolliert in den QT57-Resume-Pfad
- [ ] BFCache Stale löscht Snapshot ohne unnötigen Reload
- [ ] App-/Tabwechsel/Screen-Lock pausiert automatisch; visible allein startet nicht weiter

## 4. HS60 – Hidden Snapshot Durability

### Hidden-only Persistenz

- [ ] Quick-Family-Timer starten und Restzeit notieren.
- [ ] App/Tab verlassen, sodass `document.hidden` eintritt.
- [ ] noch **vor** einem angenommenen `pagehide` prüfen: `secret-circle-party-quick-timers-v1` enthält einen passenden Snapshot mit derselben Restzeit.
- [ ] Snapshot enthält weiterhin nur technische Metadaten.

### Prozess-Kill / Cold Resume

- [ ] Timer hidden pausieren.
- [ ] Browser-/PWA-Prozess beenden oder Betriebssystem die Seite verwerfen lassen.
- [ ] Test darf nicht voraussetzen, dass `pagehide` noch ausgeführt wurde.
- [ ] App/Seite neu öffnen und gespeicherte Session fortsetzen.
- [ ] Timer übernimmt die hidden gespeicherte Restzeit statt der vollen Dauer.
- [ ] Snapshot wird genau einmal konsumiert.

### Normaler Cleanup

- [ ] Hidden → zurück sichtbar → bewusst `Fortsetzen`.
- [ ] Runde normal abschließen oder Timer bewusst stoppen.
- [ ] Timer-Store enthält danach keinen stale Visibility-Snapshot derselben Runde.
- [ ] anschließende neue Runde startet nicht mit alter Restzeit.

### Geräte / PWA

- [ ] iPhone Safari
- [ ] iPad Safari
- [ ] Android Chrome
- [ ] installierte v60-PWA
- [ ] mindestens ein Mega-/Viral-/Creator-Timer repräsentativ, soweit vorhanden

Source-Verträge: `party-session-controls.js` v5, `tests/party-session-controls.test.js`, `tests/e2e/quick-background-pause.spec.js`, `scripts/quick_hidden_snapshot_audit.py`, QT57/BF58/BG59-Audits und `scripts/architecture_audit.py`.

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

- [ ] mindestens zwei ältere installierte Versionen auf v60/RC aktualisieren
- [ ] aktive Sessions und lokale Daten erhalten
- [ ] Spezialgates bis HS60 offline soweit anwendbar prüfen
- [ ] Rollback/Hotfix mit neuer Cachegeneration

## 8. Beta-Freigabe

Vor `REAL USER / DEVICE PASS` müssen G1–G5, alle Spezialgates bis **HS60**, PN1–PN3, reale Geräte/Accessibility, zwei PWA-Upgrades und Rollback abgeschlossen sein. Keine offenen Critical/High Bugs.

Bis dahin bleibt die reale Durchführung offen und der öffentliche Release **NO_GO**.