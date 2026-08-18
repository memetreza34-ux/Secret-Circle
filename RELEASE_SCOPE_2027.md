# Secret Circle – Releaseumfang Januar 2027

Stand: 7. August 2026

Der öffentliche Januar-Release wird nach Qualität statt nach maximaler Spielanzahl freigegeben. Die 45 eingebauten Spiele bleiben sichtbar, werden aber in drei Reifestufen getrennt.

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

Die aktuelle eingebaute Erweiterungsmenge wird automatisch aus dem 45-Spiele-Katalog minus Kernspiele minus Labs berechnet und muss exakt 13 ergeben.

Erweiterungen dürfen den Januar-Release nicht blockieren, solange sie klar gekennzeichnet sind, keine kritischen oder hohen Fehler in gemeinsamen Plattformfunktionen verursachen und keine sicherheits-, datenschutz- oder rechtskritischen Probleme enthalten.

## Stufe C – 17 Labs

Labs sind experimentelle Modi. Sie bleiben bewusst vom Kernrelease getrennt:

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

Labs dürfen nicht als vollständig releaseabgenommen dargestellt werden. Gemeinsame Plattformfunktionen, die Labs benutzen, müssen trotzdem dieselben Stabilitätsverträge erfüllen. Dazu gehören insbesondere Session-Ledger, gemeinsame Sessionsteuerung, Offline-Core, Datenschutz und PWA-Updatefluss.

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

## Release-Grenzen

Der Januar-Release bleibt `NO_GO`, wenn mindestens einer dieser Punkte zutrifft:

- ein Kernspiel hat einen kritischen oder hohen reproduzierbaren Fehler
- Word-Imposter-Rollen sind aus der Aufdeckreihenfolge ableitbar
- GitHub Actions führt keine sichtbaren Schritte aus
- `npm run ci` oder Cross-Browser-Gates sind nicht grün dokumentiert
- Offline-Start oder PWA-Update scheitert auf einem Zielgerät
- Import oder Löschung kann Daten ohne funktionierenden Rollback zerstören
- notwendige Datenschutz-, Betreiber-, Lizenz- oder Supportangaben fehlen
- Kernspiele wurden nicht mit realen Gruppen getestet

Langfristige zusätzliche Modi aus `MODE_UNIVERSE.md` bleiben nach Januar 2027 möglich, werden aber nur mit eigener Mechanik, hochwertigen Inhalten, Tests und klarer Nutzerwirkung ergänzt.