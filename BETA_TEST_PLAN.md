# Secret Circle – Beta-, Geräte- und Gruppentestplan

Stand: 29. August 2026  
Status: **PREPARED – reale Durchführung offen**  
Offline-Core: **`secret-circle-v64` / `secret-circle-v64-staging`**  
Built-ins: **55 · 15 Core / 13 Extended / 27 Labs**  
Wave 1: **10/10 source-implemented, real evidence OPEN**

## 1. Eintrittskriterium

Finale RC-Beta erst auf demselben unveränderten Commit mit sichtbaren GitHub-Actions-Steps, Online-`npm ci`, `npm run ci` und Chromium/Firefox/WebKit.

Aktueller Actions-Befund auf v64: **Run #3608**, Run ID `33253663445`, Job `99103557030`, Head `2297868e1f65b45753294151a3b1f401a55f6288`, `failure`, `steps: []`, `runner_id: 0`, leerer Runner-Name. Kein Repositorycode wurde ausgeführt. **v50–v64 sind nicht Hosted-Runner-verifiziert.**

Die reale RC-Beta beginnt deshalb erst, wenn ein Hosted Runner mindestens Checkout/Step 1 erreicht und die automatisierten Baselines auf dem Kandidaten tatsächlich laufen.

## 2. Mindest-Testmatrix

| ID | Schwerpunkt |
|---|---|
| G1–G5 | reale Gruppen / 15 Core / Advanced / Creator |
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
| HS60 | Hidden persistiert Timer sofort; Cold Resume auch ohne zuverlässiges `pagehide` |
| W1-Q | Wave-1 Quiz-Familie |
| W1-I | Wave-1 Imposter-Familie |
| W1-W | Wave-1 Writing-Familie |
| W1-R | Wave-1 Estimation/Voting/Bluff/Clue-Familien |
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

- [ ] Quick-Family-Timer starten und Restzeit notieren
- [ ] App/Tab verlassen, sodass `document.hidden` eintritt
- [ ] noch **vor** einem angenommenen `pagehide` prüfen: `secret-circle-party-quick-timers-v1` enthält einen passenden Snapshot mit derselben Restzeit
- [ ] Snapshot enthält weiterhin nur technische Metadaten

### Prozess-Kill / Cold Resume

- [ ] Timer hidden pausieren
- [ ] Browser-/PWA-Prozess beenden oder Betriebssystem die Seite verwerfen lassen
- [ ] Test darf nicht voraussetzen, dass `pagehide` noch ausgeführt wurde
- [ ] App/Seite neu öffnen und gespeicherte Session fortsetzen
- [ ] Timer übernimmt die hidden gespeicherte Restzeit statt der vollen Dauer
- [ ] Snapshot wird genau einmal konsumiert

### Normaler Cleanup

- [ ] Hidden → zurück sichtbar → bewusst `Fortsetzen`
- [ ] Runde normal abschließen oder Timer bewusst stoppen
- [ ] Timer-Store enthält danach keinen stale Visibility-Snapshot derselben Runde
- [ ] anschließende neue Runde startet nicht mit alter Restzeit

### Geräte / PWA

- [ ] iPhone Safari / installierte PWA
- [ ] iPad Safari / installierte PWA
- [ ] Android Chrome / installierte PWA
- [ ] mindestens ein Mega-/Viral-/Creator-Timer repräsentativ, soweit vorhanden

Source-Verträge: `party-session-controls.js` v5, `tests/party-session-controls.test.js`, `tests/e2e/quick-background-pause.spec.js`, `scripts/quick_hidden_snapshot_audit.py`, QT57/BF58/BG59-Audits und `scripts/architecture_audit.py`.

## 5. QR56 – Quick Session Replacement

- [ ] Same Game: Start verlangt Verwerfbestätigung; Cancel erhält Session-ID
- [ ] Cross Game derselben Familie: Start verlangt ebenfalls Bestätigung
- [ ] Confirm ersetzt erst durch erfolgreichen Engine-Write
- [ ] Replacement-Write-Fail erhält den alten Snapshot fail-closed
- [ ] Wechsel zwischen Wave-1- und bestehenden Quick-Family-Modi erzeugt keine stille Sessionüberschreibung

## 6. Expansion Wave 1 – reale Testspur

Alle zehn Modi bleiben **Labs**, bis reale Evidence vorliegt:

- [ ] `bluff-trivia`
- [ ] `party-quiz`
- [ ] `fact-or-fake`
- [ ] `percent-guess`
- [ ] `fill-blank-battle`
- [ ] `who-wrote-it`
- [ ] `party-bracket`
- [ ] `undercover-similar-word`
- [ ] `no-word-imposter`
- [ ] `password-one-word`

### W1-Q – Quiz

- [ ] Party Quiz / Fake oder Fakt Start → Frage → Antwort → Ergebnis → nächste Runde
- [ ] Score nach Reload/Result-Resume nicht doppelt
- [ ] Antwort-/Erklärungstexte mobil und bei 200-%-Zoom lesbar
- [ ] offline installiert spielbar

### W1-I – Imposter

- [ ] private Handoffs bleiben verdeckt
- [ ] Blur/Hidden zeigt keine geheimen Inhalte erneut
- [ ] Votes/Resultate nach Resume konsistent
- [ ] Cross-Game-Replacement fail-closed

### W1-W – Writing

- [ ] Eingaben bleiben während privater Phasen verborgen
- [ ] anonyme Phasen leaken keine Autorennamen
- [ ] Reload/Resume erhält den korrekten Phasenstatus
- [ ] Completion/History genau einmal

### W1-R – Remaining families

- [ ] Prozent schätzen: Score deterministisch aus Zielwert
- [ ] Party Bracket: identische sieben Picks ergeben nach Reload denselben Sieger
- [ ] Bluff Trivia: Fake-Eingaben/Votes privat, richtige Antwort erst im Ergebnis, Score exact-once
- [ ] Ein-Wort-Hinweis: Zielwort nur nach bewusstem Reveal; Blur/Reload kein Auto-Reveal

Für jede Familie mindestens einen realen Gruppentest dokumentieren, bevor ein Modus aus Labs hochgestuft wird.

## 7. Reale Gruppen / Geräte

- [ ] G1 3–4 Personen ≥60 min
- [ ] G2 5–8 Personen ≥90 min
- [ ] G3 9–12 Personen ≥90 min
- [ ] G4 Mafia mehrere Gruppengrößen
- [ ] G5 Creator mit unerfahrener Person
- [ ] Android / iPhone / iPad/Tablet
- [ ] VoiceOver / TalkBack / 200-%-Zoom / Tastatur / Touch
- [ ] mindestens ein realer Nachweis pro **15 Core-Spiel**
- [ ] PN1–PN3
- [ ] keine Entwicklerhilfe nötig, um Standard-Core-Flows zu verstehen

Pro Test protokollieren: Commit, Version, Cache, Gerät, OS, Browser/PWA, Gruppengröße, Spiel/Flow, Ergebnis, Defects und Severity.

## 8. PWA Update / Rollback – v64

- [ ] mindestens zwei ältere installierte Versionen auf v64/RC aktualisieren
- [ ] aktive Sessions und kompatible lokale Daten erhalten
- [ ] Hub / Word Imposter / Advanced / Quick / Creator / Privacy offline
- [ ] Spezialgates bis HS60 offline soweit anwendbar prüfen
- [ ] Wave-1-Kataloge/Runner offline verfügbar
- [ ] Rollback/Hotfix mit **neuer** Cachegeneration
- [ ] Offline-Neustart nach Prozess-Kill

## 9. Accessibility

- [ ] vollständige Tastaturnavigation
- [ ] sichtbarer Fokus
- [ ] 320 CSS px Reflow
- [ ] 200-%-Zoom
- [ ] große Systemschrift
- [ ] Reduced Motion
- [ ] Touchziele
- [ ] Hoch-/Querformat
- [ ] Safe Areas
- [ ] VoiceOver
- [ ] TalkBack
- [ ] private Reveal-/Resume-Flows mit Screenreader

## 10. Beta-Freigabe

Vor `REAL USER / DEVICE PASS` müssen mindestens:

- G1–G5
- alle Spezialgates bis HS60
- PN1–PN3
- mindestens ein realer Test pro 15 Core-Spiel
- reale Android/iPhone/iPad-Evidence
- Accessibility-Evidence
- zwei PWA-Upgrades
- ein Rollback
- keine offenen Critical/High Bugs

dokumentiert sein.

Wave-1-Evidence wird separat dokumentiert und ist Voraussetzung für eine spätere Promotion einzelner Labs, **nicht für eine Erweiterung des Januar-Core**.

Bis dahin bleibt die reale Durchführung offen und der öffentliche Release **NO_GO**.
