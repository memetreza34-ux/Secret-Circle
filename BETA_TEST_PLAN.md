# Secret Circle – Beta-, Geräte- und Gruppentestplan

Stand: 26. August 2026  
Status: **PREPARED – reale Durchführung offen**  
Offline-Core: **`secret-circle-v56` / `secret-circle-v56-staging`**

## 1. Eintrittskriterium

Finale RC-Beta erst auf demselben unveränderten Commit mit sichtbaren GitHub-Actions-Steps, Online-`npm ci`, `npm run ci` und Chromium/Firefox/WebKit.

Letzter vollständig untersuchter App-Actions-Lauf: **#2787 auf v49**, Run ID `32871536761`, Job `97879489858`, Head `a9ad91389ff9e966af432b0a77103ddc0960709d`, `steps: null` / `steps: []`. Kein Repositorycode wurde ausgeführt. **v50–v56 sind nicht runnerverifiziert.**

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
| **QR56** | Quick-/Mega-/Viral-/Creator-Session-Ersatz |
| PN1–PN3 | Smart Party Night |

## 3. Bestehende Spezialgates

DWI, HR2, BK51, HR52, PR53, PT54 und AD55 bleiben unverändert verbindlich. Vorhandene Source-Tests sind kein realer PASS.

## 4. QR56 – Quick Session Replacement

### Same Game

- [ ] Quick-Family-Session starten und Session-ID notieren.
- [ ] Seite reloaden.
- [ ] normalen Button „Spiel starten“ drücken.
- [ ] Verwerfbestätigung erscheint.
- [ ] Cancel → alte Game-ID, Session-ID und Rundendaten unverändert.
- [ ] Confirm → neue Session-ID erst nach erfolgreichem lokalen Write.

### Cross Game derselben Familie

- [ ] laufende Quick/Trending-Session anlegen.
- [ ] anderes Quick/Trending-Spiel öffnen.
- [ ] obwohl keine fremde Resume-Karte angezeigt wird, verlangt „Spiel starten“ die Verwerfbestätigung.
- [ ] Cancel → alter Game-ID-/Session-ID-Snapshot bleibt erhalten.
- [ ] Confirm → neuer Snapshot gehört zum neuen Spiel.
- [ ] denselben Ablauf stichprobenartig für Mega, Viral und Creator wiederholen.

### Storage-Fail

- [ ] Replacement-`localStorage.setItem` gezielt fehlschlagen lassen.
- [ ] Fehlerstatus erscheint.
- [ ] kontrollierter Reload erfolgt.
- [ ] alter Snapshot bleibt gespeichert.
- [ ] kein späterer `pagehide`-Retry überschreibt den Altstand.

### Loader / Offline

- [ ] `quick-loader.js` v7 lädt Ledger → Controls → Replacement Guard → Engine.
- [ ] QR56 in installierter v56-PWA offline wiederholen.

Source-Verträge: `quick-session-replacement-guard.js` v1, `quick-loader.js` v7, `tests/quick-session-replacement-guard.test.js`, `tests/e2e/quick-session-replacement.spec.js`, `tests/e2e/party-session-controls.spec.js` und `scripts/quick_session_replacement_audit.py`.

## 5. Reale Gruppen / Geräte

- [ ] G1 3–4 Personen ≥60 min
- [ ] G2 5–8 Personen ≥90 min
- [ ] G3 9–12 Personen ≥90 min
- [ ] G4 Mafia mehrere Gruppengrößen
- [ ] G5 Creator mit unerfahrener Person
- [ ] Android / iPhone / Tablet
- [ ] VoiceOver / TalkBack / 200-%-Zoom / Tastatur / Touch
- [ ] mindestens ein realer Nachweis pro Core-Spiel
- [ ] PN1–PN3

## 6. PWA Update / Rollback

- [ ] mindestens zwei ältere installierte Versionen auf v56/RC aktualisieren
- [ ] aktive Sessions und lokale Daten erhalten
- [ ] DWI / HR2 / BK51 / HR52 / PR53 / PT54 / AD55 / QR56 offline prüfen
- [ ] Rollback/Hotfix mit neuer Cachegeneration

## 7. Beta-Freigabe

Vor `REAL USER / DEVICE PASS` müssen G1–G5, DWI, HR2, BK51, HR52, PR53, PT54, AD55, **QR56**, PN1–PN3, reale Geräte/Accessibility, zwei PWA-Upgrades und Rollback abgeschlossen sein. Keine offenen Critical/High Bugs.

Bis dahin bleibt die reale Durchführung offen und der öffentliche Release **NO_GO**.