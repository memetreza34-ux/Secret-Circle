# Secret Circle – Releaseumfang Januar 2027

Stand: 29. August 2026

Der öffentliche Januar-Release wird nach Qualität statt nach maximaler Spielanzahl freigegeben. Aktuell sind **55 technisch spielbare Built-ins** vorhanden. Sie bleiben in drei Reifestufen getrennt: **15 Core / 13 Extended / 27 Labs**.

Der Januar-Core bleibt bewusst bei 15 Spielen eingefroren. Neue Labs oder langfristige Modusideen erweitern den Release-Core nicht automatisch.

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

Diese Spiele bleiben spielbar und sichtbar, werden aber nach den Kernspielen priorisiert. Eigene Creator-Spiele werden ebenfalls als Erweiterungen eingeordnet.

Die aktuelle eingebaute Erweiterungsmenge wird aus dem Release-Katalog minus Core minus Labs abgeleitet und muss für v64 **exakt 13** ergeben.

Erweiterungen dürfen den Januar-Release nicht blockieren, solange sie klar gekennzeichnet sind, keine kritischen oder hohen Fehler in gemeinsamen Plattformfunktionen verursachen und keine sicherheits-, datenschutz- oder rechtskritischen Probleme enthalten.

## Stufe C – 27 Labs

Labs sind experimentelle Modi. Sie bleiben bewusst vom Kernrelease getrennt.

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

Damit ergibt sich für v64: **27 Labs**.

Wave 1 verwendet gemeinsame Enginefamilien für Quiz, Imposter, Writing, Estimation/Voting, Bluff und Clue. `quick-loader.js` v11 routet diese Familien; `party-release-structure.js` v5 hält alle zehn Wave-1-Modi ausdrücklich in Labs.

Labs dürfen nicht als vollständig releaseabgenommen dargestellt werden. Gemeinsame Plattformfunktionen, die Labs benutzen, müssen trotzdem dieselben Stabilitätsverträge erfüllen. Dazu gehören insbesondere Session-Ledger, gemeinsame Sessionsteuerung, Offline-Core, Datenschutz und PWA-Updatefluss.

**Source-Implementierung ist kein Release-PASS.** Für Wave 1 bleiben reale Browser-, PWA-, Accessibility- und Gruppentests offen. Ein Lab darf erst nach eigener Evidence in eine höhere Reifestufe verschoben werden; der Januar-Core bleibt unabhängig davon bei 15.

## Referenz-/Content-Sicherheit

Der aktuelle v64-Stand enthält automatisierte Referenz-/Source-Audits über ausgelieferte Contentquellen einschließlich der Wave-1-Kataloge. Diese Audits reduzieren offensichtliche Marken-/Franchise-/Referenzrisiken, ersetzen aber **keine manuelle Visual-, Marketing-, Asset- oder Rechtsabnahme**.

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

- Source-Generation: **v64**
- Offline-Cache: **`secret-circle-v64`**
- Staging-Cache: **`secret-circle-v64-staging`**
- Built-ins: **55**
- Core: **15**
- Extended: **13**
- Labs: **27**
- Wave 1: **10/10 source-implemented, real evidence OPEN**
- öffentliche Freigabe: **NO_GO**

GitHub Actions bleibt extern blockiert. Der frische v64-Lauf **#3608** erhielt keinen Hosted Runner: `steps: []`, `runner_id: 0`, leerer Runner-Name; Repositorycode wurde nicht ausgeführt. Dieser Blocker darf nicht durch Abschwächen von Tests oder App-Code umgangen werden.

## Release-Grenzen

Der Januar-Release bleibt `NO_GO`, wenn mindestens einer dieser Punkte zutrifft:

- ein Kernspiel hat einen kritischen oder hohen reproduzierbaren Fehler
- Word-Imposter-Rollen sind aus der Aufdeckreihenfolge ableitbar
- GitHub Actions führt keine belastbaren Repository-Schritte aus
- `npm run ci`, Cross-Browser oder Reference-Source-Audit sind nicht tatsächlich grün dokumentiert
- `package-lock.json`/`npm ci` oder Required Checks fehlen
- Branch Protection ist nicht real aktiviert/verifiziert
- Offline-Start oder PWA-Update scheitert auf einem Zielgerät
- Import oder Löschung kann Daten ohne funktionierenden Rollback zerstören
- notwendige Datenschutz-, Betreiber-, Asset-, Lizenz- oder Supportangaben fehlen
- manuelle Content-/Rechte-/Visual-Abnahme ist nicht abgeschlossen
- Kernspiele wurden nicht mit realen Gruppen getestet
- ein Release-Candidate wurde nach der Evidence erneut verändert

## Langfristige Produktgrenze

Die **122-Modi-Vision** aus `MODE_UNIVERSE.md` bleibt ein langfristiger Produkt-Horizont und ist **keine Voraussetzung für Januar 2027**.

Vor einer weiteren großen Expansion haben reale Release-Gates Vorrang. Ziel bleibt eine kleine Zahl belastbarer Mechanikfamilien, aus denen viele hochwertige, originale Themen-/Content-Varianten entstehen – nicht 122 voneinander unabhängige Engines.
