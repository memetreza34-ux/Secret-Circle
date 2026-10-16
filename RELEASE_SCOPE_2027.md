# Secret Circle – Releaseumfang Januar 2027

Stand: 16. Oktober 2026 (55-Spiele-Entscheidung; historische Stufen bleiben bestehen)

**Verbindliche Entscheidung vom 16.10.2026:** Die erste gewünschte öffentliche Version soll **alle 55 vorhandenen Built-ins** enthalten, aufgeteilt in 15 Core / 13 Extended / 27 Labs. Diese Bezeichnungen sind Reifestufen und Arbeitsprioritäten, **keine Freigabeausnahmen**. Vor öffentlicher Freigabe müssen **alle 55 individuell** von Setup über echte Runde, Ergebnis und Replay sowie mit realen Gruppen nachweisbar geprüft sein. Kein Spiel streichen, automatisch als bestanden deklarieren oder aus dem Katalog ausblenden, nur weil es als Extended/Lab kategorisiert ist. Siehe [verbindliche KI-Übergabe](docs/UEBERGABE_55_SPIELE_2026-10-16.md). **Release: NO_GO**, bis alle Pflichtbelege vorliegen.

Der administrative `core`-Tier bleibt bei 15 Spielen eingefroren. **Er begrenzt nicht den nun gewünschten Veröffentlichungsumfang von 55 Spielen.** Neue, zusätzliche Modi über die bestehenden 55 hinaus sind ausdrücklich nicht Teil des V1-Abschlusses.

## Stufe A – 15 Kernspiele

Diese Spiele erhalten höchste Priorität für Regeln, Inhalte, Offlinebetrieb, Accessibility, Statistik, Wiederaufnahme und reale Gruppentests:

1. `imposter` – Word Imposter
2. `truth-dare` – Wahrheit oder Pflicht
3. `never-have` – Ich habe noch nie
4. `most-likely` – Wer würde eher?
5. `would-rather` – Entweder oder
6. `paranoia` – Paranoia
7. `charades` – Scharade
8. `taboo` – Nicht sagen! / Tabu
9. `hot-potato` – Heiße Kartoffel
10. `word-chain` – Wortkette
11. `two-truths` – Zwei Wahrheiten, eine Lüge
12. `question-imposter` – Question Imposter
13. `location-spy` – Location Spy
14. `mafia` – Mafia
15. `wrong-answers` – Nur falsche Antworten

Ein Kernspiel ist nur dann releasefertig, wenn alle zutreffenden Punkte aus `RELEASE_CHECKLIST.md` nachgewiesen sind. Die Klassifizierung als Kernspiel ist eine Priorisierung und **keine automatische Freigabe**.

### Verbindliche Kernspiel-Kriterien

Für jedes der 15 Spiele müssen mindestens dokumentiert sein:

- verständlicher Start und gültige Spielerzahl
- höchstens vier klare Regelschritte vor der ersten Runde
- sichere und verständliche Pack-/Inhaltsauswahl
- Überspringen oder sichere Ausweichmöglichkeit bei persönlichen beziehungsweise unangenehmen Inhalten
- eindeutiger Abbruch ohne Verlust fremder lokaler Daten
- korrekte Punkte-, Sieger-, Verlauf- und Statistiklogik
- Wiederaufnahme für alle Mechaniken, bei denen eine aktive Session gespeichert wird
- Timerverhalten im Vordergrund, Hintergrund, nach App-Wechsel und Reload, sofern ein Timer existiert
- Tastatur, sichtbarer Fokus, Zoom, Reduced Motion und mobile Darstellung
- mindestens ein realer Gruppentest ohne Entwicklerhilfe

Mechaniken, die über die schnelle Quick-Seite laufen, verwenden zusätzlich den gemeinsamen Vertrag aus `party-session-controls.js`: Pause/Fortsetzen, Runde überspringen, bestätigter Abbruch, Wiederholen und nächstes Spiel. Ein sichtbarer Pausenstatus muss einen laufenden Timer tatsächlich einfrieren.

## Stufe B – 13 Erweiterungen

Diese 13 Built-ins bleiben spielbar, sichtbar und sind vollständig abzunehmen; die Tier-Reihenfolge darf die 55-Spiel-Fertigstellung nicht verkürzen. Eigene Creator-Spiele werden ebenfalls als Erweiterungen eingeordnet, zählen jedoch nicht als zusätzliche Built-ins in die 55.

Die aktuelle eingebaute Erweiterungsmenge wird aus dem Release-Katalog minus Core minus Labs abgeleitet und muss seit v64 unverändert (aktuell v99) **exakt 13** ergeben.

**Aktueller 55/55-Gate:** Jede der 13 Erweiterungen benötigt vor öffentlicher V1-Freigabe einen funktionalen Test vom Setup bis zum Abschluss und Replay, die relevanten Privacy-/PWA-Prüfungen und einen echten Gruppentest. Fehlende Pflichtbelege oder P0/P1-Fehler blockieren ein öffentliches GO.

## Stufe C – 27 Labs

Labs sind eine bisherige experimentelle Reifestufe. **Alle 27 vorhandenen Labs gehören trotzdem ausdrücklich zum jetzt gewünschten 55-Spiele-Veröffentlichungsumfang.** Vor öffentlichem GO gelten dieselben Qualitäts-, Spielablauf-, Geräte- und Gruppenanforderungen wie für die übrigen Spiele.

Bestehende Labs:

- `who-am-i`
- `anime-guess`
- `money-challenge`
- `blind-ranking`
- `emoji-quiz`
- `pass-the-phone`
- `red-green-flag`
- `secret-mission`
- `tier-list`
- `put-a-finger-down`
- `guess-the-price`
- `higher-lower`
- `know-me-best`
- `hear-me-out`
- `hot-seat`
- `story-chain`
- `finish-the-sentence`

Expansion Wave 1 – quellsseitig 10/10 implementiert:

- `bluff-trivia`
- `party-quiz`
- `fact-or-fake`
- `percent-guess`
- `fill-blank-battle`
- `who-wrote-it`
- `party-bracket`
- `undercover-similar-word`
- `no-word-imposter`
- `password-one-word`

Damit ergeben sich seit v64 unverändert (aktuell v99): **27 Labs**.

Wave 1 verwendet gemeinsame Enginefamilien für Quiz, Imposter, Writing, Estimation/Voting, Bluff und Clue. `quick-loader.js` v11 routet diese Familien; `party-release-structure.js` v5 hält alle zehn Wave-1-Modi ausdrücklich in Labs.

Labs dürfen ohne Belege nicht als releaseabgenommen dargestellt werden. **Eine automatisierte Startprobe allein reicht nicht:** für jedes Lab sind zusätzlich Ende, Replay, risikoabhängige Privacy-/Resume-/Timer-Checks und tatsächliche Gruppenabnahme zu dokumentieren. Gemeinsame Plattformfunktionen müssen dieselben Stabilitätsverträge erfüllen. Dazu gehören insbesondere Session-Ledger, gemeinsame Sessionsteuerung, Offline-Core, Datenschutz und PWA-Updatefluss.

**Source-Implementierung ist kein Release-PASS.** Für Wave 1 bleiben reale Browser-, PWA-, Accessibility- und Gruppentests offen. Eine Änderung der internen Tier-Zuordnung ist für den vereinbarten 55er-V1-Umfang nicht erforderlich. Entscheidend ist die echte, für jedes Lab separat belegte Releasefähigkeit; die administrative Core-Gruppe bleibt 15.

## Referenz-/Content-Sicherheit

Der aktuelle Stand (v99) enthält automatisierte Referenz-/Source-Audits über ausgelieferte Contentquellen einschließlich der Wave-1-Kataloge. Diese Audits reduzieren offensichtliche Marken-/Franchise-/Referenzrisiken, ersetzen aber **keine manuelle Visual-, Marketing-, Asset- oder Rechtsabnahme**.

Root-`icon.svg` bleibt bis belegter Herkunft oder Ersatz ein Release-Blocker.

## Creator-Spiele

Selbst erstellte Spiele sind keine eigenen Kernspiele. Sie werden im Hub als Erweiterungen angezeigt und müssen mindestens folgende Plattformverträge erfüllen:

- lokale Validierung und begrenzte Kapazitäten
- stabile Zeitstempel
- Export/Import
- Gesamtsicherung
- genau-einmal-Sessionabschluss
- gemeinsame Sessionsteuerung beim Abspielen über `quick-play.html`
- Offlinebetrieb
- sichere Textdarstellung ohne ungeprüftes HTML

## Aktueller technischer Release-Stand

- Source-Generation: **v100** (`release-meta.json`, Stand 16.10.2026)
- Offline-Cache: **`secret-circle-v100`**
- Staging-Cache: **`secret-circle-v100-staging`**
- Built-ins: **55**
- Core: **15**
- Extended: **13**
- Labs: **27**
- Wave 1: **10/10 source-implemented, real evidence OPEN**
- öffentliche Freigabe: **NO_GO**

Der frühere Actions-Blocker (`steps: []`, `runner_id: 0`) wurde behoben. Aktueller belegter 55/55-Start-Sweep: [PR #40](https://github.com/memetreza34-ux/Secret-Circle/pull/40), [CI #38886549437](https://github.com/memetreza34-ux/Secret-Circle/actions/runs/38886549437) und [Cross-Browser #38886549438](https://github.com/memetreza34-ux/Secret-Circle/actions/runs/38886549438) auf PR-Head `907ce6a5def625af8a79ced13be1812e0eff5c4e`, in `main` gemergt als `e1befbe1f22bed9d45a143320c2615f0bd699a7d`. Postmerge-CI und weitere Releasegates erneut live prüfen; niemals aus älteren grünen Läufen ableiten. CI-Gates dürfen nicht abgeschwächt werden.

## Release-Grenzen

Der Januar-Release bleibt `NO_GO`, wenn mindestens einer dieser Punkte zutrifft:

- eines der 55 Built-in-Spiele hat einen kritischen oder hohen reproduzierbaren Fehler
- Word-Imposter-Rollen sind aus der Aufdeckreihenfolge ableitbar
- GitHub Actions führt keine belastbaren Repository-Schritte aus
- `npm run ci`, Cross-Browser oder Reference-Source-Audit sind nicht tatsächlich grün dokumentiert
- `package-lock.json`/`npm ci` oder Required Checks fehlen
- Branch Protection ist nicht real aktiviert/verifiziert
- Offline-Start oder PWA-Update scheitert auf einem Zielgerät
- Import oder Löschung kann Daten ohne funktionierenden Rollback zerstören
- notwendige Datenschutz-, Betreiber-, Asset-, Lizenz- oder Supportangaben fehlen
- manuelle Content-/Rechte-/Visual-Abnahme ist nicht abgeschlossen
- eines der 55 Spiele wurde nicht vollständig funktional und mit einer realen Gruppe abgenommen
- ein Release-Candidate wurde nach der Evidence erneut verändert

## Langfristige Produktgrenze

Die **122-Modi-Vision** aus `MODE_UNIVERSE.md` bleibt ein langfristiger Produkt-Horizont und ist **keine Voraussetzung für Januar 2027**.

Vor einer weiteren großen Expansion haben reale Release-Gates Vorrang. Ziel bleibt eine kleine Zahl belastbarer Mechanikfamilien, aus denen viele hochwertige, originale Themen-/Content-Varianten entstehen – nicht 122 voneinander unabhängige Engines.
