# Secret Circle Party Hub – Release-Checkliste

Zielstand: `1.0.0-beta.3`, 45 eingebaute Spiele, lokaler Game-Creator und Offline-Core `secret-circle-v29`.

## Automatisierte Gates

- [ ] `npm run check`
- [ ] `npm test`
- [ ] `npm run validate`
- [ ] `npm run test:e2e`
- [ ] `npm run test:cross-browser`
- [ ] GitHub Actions mit sichtbaren grünen Schritten
- [ ] keine offenen kritischen oder hohen Fehler

## Hub und Bedienbarkeit

- [ ] 45 eindeutige eingebaute Spiele und 0 irreführend geplante Spiele
- [ ] Drei-Schritte-Einstieg verständlich
- [ ] erster-Besuch-Onboarding verständlich und schließbar
- [ ] kurze Hilfen in allen Hauptbereichen
- [ ] Spielkarten zeigen klare Aktion, Spielerzahl, Dauer und Kategorie
- [ ] Spieldetail besitzt verständliche Kurzregeln
- [ ] Tastatur, Fokus, 200-%-Zoom, Reduced Motion und 44-Pixel-Touchziele

## Game-Creator

- [ ] alle sechs Vorlagen funktionieren
- [ ] Fragen-, Auswahl-, Erraten-, Challenge-, Story- und Debattenspiel erstellen
- [ ] mehrere Kategorien je Spiel
- [ ] Icon, Akzent, Gruppe, Dauer und Altersstufe bleiben erhalten
- [ ] mindestens drei Karten werden erzwungen
- [ ] Duplikate und Unicode-Varianten werden bereinigt
- [ ] Auswahlkarten bleiben nach Speichern, Export und Import strukturiert
- [ ] Bearbeiten, Kopieren und Löschen
- [ ] eigenes Spiel erscheint im Hub und ist spielbar
- [ ] bis zu 40 Spiele, 8 Kategorien und 200 Karten geprüft
- [ ] Speicherfehler löst Rollback aus
- [ ] beschädigte Creator-Daten werden verworfen

## Spielengines

- [ ] alle 27 Quick-, Trend- und Viral-Modi vollständig
- [ ] alle 4 Advanced-Spiele vollständig
- [ ] Word Imposter vollständig
- [ ] 3-, 5-, 10- und 20-Runden-Sessions
- [ ] Wiederaufnahme und Spieler-Snapshot
- [ ] Verlauf und Statistik zählen genau einmal
- [ ] geheime Rollen, Figuren, Antworten und Missionen bleiben geschützt

## Smart Party Night

- [ ] 15, 30, 45, 60 und 90 Minuten
- [ ] Alters-, Gruppen- und Stimmungsfilter
- [ ] Fortschritt aus allen Engine-Familien
- [ ] Wiederaufnahme nach Neustart
- [ ] eigene Spiele werden sinnvoll behandelt oder bewusst ausgeschlossen

## Daten und Datenschutz

- [ ] Gesamtexport enthält eigene Spiele, Packs und alle Sessionarten
- [ ] Creator-Bibliothek separat exportierbar und importierbar
- [ ] vollständige Löschung aller `secret-circle-*`-Schlüssel
- [ ] Import-Rollback bei Speicherfehler
- [ ] keine Analyse-, Werbe- oder Tracking-Dienste
- [ ] Anime-, Geld-, Preis-, Social- und Creator-Hinweise korrekt

## PWA und Offline

- [ ] nur Cache `secret-circle-v29` aktiv
- [ ] Hub, Creator, Schnellhilfe und alle Engines offline
- [ ] Update von älterem Cache auf v29
- [ ] lokale Spieler, Packs, eigene Spiele und Sessions überstehen Update
- [ ] Android und iPhone/iPad installiert

## Reale Partytests

- [ ] Gruppe mit 3–4 Personen
- [ ] Gruppe mit mindestens 8 Personen
- [ ] alle 45 eingebauten Spiele real geprüft
- [ ] mindestens drei selbst erstellte Spiele real geprüft
- [ ] Creator ohne Hilfe von Entwicklern bedienbar
- [ ] keine kritischen oder hohen Fehler offen

## Bilder, Icons und Animationen

- [ ] eigenes Logo- und Iconsystem
- [ ] Kategorieillustrationen
- [ ] Topspiel-Keyvisuals
- [ ] Animationen beachten Reduced Motion
- [ ] Assetbudgets aus `ASSET_PLAN.md` eingehalten
- [ ] keine kopierten Designs oder fremden Medien

## Inhalte und Recht

- [ ] Karten und Altersstufen redaktionell geprüft
- [ ] Anime-Fan-Content rechtlich geprüft
- [ ] Creator-Hinweise und Nutzerverantwortung verständlich
- [ ] Betreiber-, Kontakt-, Hosting- und gegebenenfalls Impressumsangaben vorhanden

Ohne vollständig dokumentierte grüne Gates bleibt der öffentliche Release `NO_GO`.
