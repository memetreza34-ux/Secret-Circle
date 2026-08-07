# Releaseumfang Januar 2027

Dieses Dokument trennt den sichtbaren Funktionsumfang von der tatsächlichen Releasepriorität. „Technisch spielbar“ ist kein Freigabesiegel. Die abschließende Abnahme erfolgt über `RELEASE_CHECKLIST.md`.

## Stufe A – 15 Kernspiele

Diese Spiele erhalten vor Januar 2027 die strengste Abnahme für Regeln, Inhalt, Bedienung, Offlinebetrieb, Wiederaufnahme, Statistik, Barrierefreiheit und reale Gruppentests:

1. Word Imposter
2. Wahrheit oder Pflicht
3. Ich habe noch nie
4. Wer würde eher?
5. Entweder oder
6. Paranoia
7. Scharade
8. Nicht sagen!
9. Heiße Kartoffel
10. Wortkette
11. Zwei Wahrheiten, eine Lüge
12. Question Imposter
13. Location Spy
14. Mafia
15. Nur falsche Antworten

Kernspiel bedeutet Priorität, nicht bereits bestandene Releaseabnahme.

## Stufe B – 13 Erweiterungen

Diese Spiele und Werkzeuge bleiben sichtbar und spielbar, werden aber erst nach den Kernspielen priorisiert:

- Hot Takes
- Flaschendrehen
- Würfel & Münze
- Wellenlänge
- Zeichnen & Raten
- Schnellfeuer
- Geräusche erraten
- Handy an die Stirn
- Buchstaben-Kategorien
- Nicht lachen
- Lied summen
- Schnitzeljagd
- Caption Battle

Selbst erstellte Creator-Spiele werden ebenfalls als Erweiterungen eingeordnet.

## Stufe C – 17 Labs-Modi

Diese Modi sind experimentell und nicht automatisch Teil des Kernrelease:

- Wer bin ich?
- Anime-Figuren erraten
- hypothetische Geld-Challenge
- Blind Ranking
- Emoji Quiz
- Pass das Handy
- Red Flag oder Green Flag
- Geheime Mission
- Tier List Battle
- Finger runter
- Preis schätzen
- Höher oder tiefer
- Wer kennt mich am besten?
- Hear Me Out
- Hot Seat
- Story Chain
- Satz beenden

Labs bleiben funktional erreichbar, werden aber klar gekennzeichnet. Ein Labs-Modus darf später in Erweiterungen oder Kernspiele aufsteigen, sobald Inhalt, Regeln, Geräteverhalten, Accessibility und reale Gruppentests bestanden sind.

## Gemeinsame Plattformfunktionen

Für Januar 2027 gehören folgende Funktionen zur Releasegrundlage:

- lokale Spielergruppe und Presets
- Favoriten, Verlauf und Statistiken
- Smart Party Night
- No-Code-Game-Creator
- versionierte Backups und atomische Wiederherstellung
- gespeicherte Katalogfilter und letzte Ansicht
- Synonym- und Tippfehlersuche
- kontrollierte PWA-Aktualisierung
- Offlinebetrieb aller Kernseiten und Spielengines
- gemeinsames Session-Ledger für Creator, Quick, Mega und Viral

## Technische Freigaberegeln

Ein Spiel gilt erst als releasefähig, wenn:

- Start, Pause beziehungsweise Unterbrechung, Überspringen, Abbruch und Abschluss verständlich funktionieren,
- ein Reload keinen doppelten Verlaufseintrag oder zusätzliche Statistik erzeugt,
- ältere aktive Sessions sicher migriert werden,
- Offlinebetrieb und PWA-Update getestet wurden,
- Regeln in höchstens vier klaren Schritten erklärt werden,
- Touch, Tastatur, Fokus, Zoom und Reduced Motion geprüft sind,
- Inhalte redaktionell, nach Altersstufe und rechtlich geprüft sind,
- echte Gruppen das Spiel ohne Entwicklerhilfe erfolgreich abgeschlossen haben.

## Releaseverbote

Nicht veröffentlichen, wenn:

- GitHub Actions keine sichtbaren Repository-Schritte ausführt,
- Kern-CI oder Cross-Browser-Tests rot sind,
- eine Engine Sessionabschlüsse doppelt zählen kann,
- ein globales Browser- oder Storage-Monkey-Patch Fachlogik korrigieren muss,
- Offline-Start oder kontrolliertes Update auf einem Zielgerät scheitert,
- Kernspiele nicht mit realen Gruppen getestet wurden,
- kritische oder hohe Fehler offen sind,
- Datenschutz-, Betreiber- oder Lizenzangaben fehlen.
