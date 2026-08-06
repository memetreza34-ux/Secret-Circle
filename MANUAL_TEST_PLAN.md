# Secret Circle Party Hub – Manueller Testplan

Dieser Plan ergänzt die automatisierten Prüfungen. Für jeden Durchlauf dokumentieren: Version, Commit, Datum, Testperson, Gerät, Betriebssystem, Browser, Installationsmodus, Gruppengröße und Online-/Offline-Zustand.

Bewertung je Test: `BESTANDEN`, `FEHLER` oder `BLOCKIERT`.

Zielstand: 28 spielbare Spiele, Smart Party Night und Offline-Core `secret-circle-v26`.

## 1. Grundlegender Smoke-Test

- Party Hub öffnet ohne Konsolenfehler.
- Startseite zeigt 28 spielbare und 0 geplante Spiele.
- Suche und alle sechs Filter funktionieren.
- Quick-, Advanced- und Imposter-Schaltflächen öffnen den korrekten Bereich.
- Spieler, Presets, Favoriten und Einstellungen überstehen ein Neuladen.
- Datenschutzseite ist erreichbar.

## 2. Word Imposter

- 3, 8 und 20 Personen testen.
- 1, mehrere und maximal 6 Imposter testen.
- Rollen sind nicht an die Aufdeckreihenfolge gekoppelt.
- Kartensichtschutz bei App-Wechsel prüfen.
- Timer im Vordergrund, Hintergrund und nach Neuladen prüfen.
- Abstimmung, Stichwahl, Ratechance, Punkte und nächste Runde prüfen.
- aktiven Spielstand fortsetzen.

## 3. Standard-Hub-Spiele

Mindestens eine vollständige Session pro Spiel:

- Wahrheit oder Pflicht
- Ich habe noch nie
- Wer würde eher?
- Entweder oder
- Hot Takes
- Nur falsche Antworten
- Paranoia
- Scharade
- Nicht sagen! / Tabu
- Heiße Kartoffel
- Wortkette
- Flaschendrehen
- Würfel & Münze

Prüfen: Packauswahl, Kartenwechsel, aktive Person, Punkte oder Ergebnis, sicherer Ausstieg, Verlauf und Statistik.

## 4. Advanced-Spiele

### Zwei Wahrheiten, eine Lüge

- private Eingabe
- zufällige Mischung
- Abstimmung und Auflösung
- Fortsetzung nach Neuladen

### Question Imposter

- geheime ähnliche Fragen
- genau ein Imposter
- Diskussion und Wahl
- Spieler-Snapshot nach Lobbyänderung

### Location Spy

- Ort und Spion geheim verteilen
- Verdächtigenwahl
- Ortsraten und Auflösung

### Mafia

- mindestens 6 Personen
- private Rollen
- geschützte Moderatoransicht
- Nachtaktionen, Tageswahl und Siegbedingung

## 5. Zehn Quick Modes

Jeden Modus mit 3 und 5 Runden testen; mindestens Wellenlänge und Schnellfeuer zusätzlich mit 10 und 20 Runden.

### Wellenlänge

- geheimes Ziel sichtbar nur für Hinweisgeber
- Ziel wird vor Gruppenwahl verborgen
- Regler von 0 bis 100
- 0–4 Punkte abhängig vom Abstand
- nächste Runde und Wiederaufnahme

### Zeichnen & Raten

- private Karte
- Treffer und Überspringen
- keine unmittelbare Wiederholung

### Schnellfeuer

- 5-, 10-, 12- und 15-Sekunden-Karten
- Erfolg vor Timerende
- automatisches Zeitende
- Punkte und nächste Person

### Geräusche erraten

- Zielkarte nur für aktive Person
- Treffer und Überspringen

### Stirn-Raten

- ratende Person sieht das Ziel nicht
- Gerät zeigt zur Gruppe
- Spielerwechsel

### Buchstaben-Kategorien

- zufälliger erlaubter Buchstabe
- fünf Kategorien
- 60-Sekunden-Timer
- Punkteingabe begrenzt auf Kategorienanzahl

### Nicht lachen!

- sichere Aufgaben
- 30-Sekunden-Timer
- Erfolg und Misserfolg

### Melodie summen

- keine bereitgestellten geschützten Aufnahmen oder Liedtexte
- private Aufgabe
- Treffer und Überspringen

### Gegenstandsjagd

- sicheren Spielbereich festlegen
- 60-Sekunden-Timer
- keine gefährlichen, zerbrechlichen oder privaten Gegenstände verlangen

### Caption Battle

- Situation anzeigen
- Gewinner nur aus aktueller Spielergruppe wählen
- Rangliste korrekt

## 6. Smart Party Night

- 15, 30, 45, 60 und 90 Minuten testen.
- alle Stimmungen testen.
- Alters- und Gruppengrößenfilter prüfen.
- Favoritenbonus und zuletzt gespielt prüfen.
- Hub-, Quick-, Advanced- und Word-Imposter-Abschluss synchronisieren.
- erledigte und übersprungene Schritte prüfen.
- Plan nach App-Neustart fortsetzen.

## 7. Eigene Hub-Kategorien

- gültiges Pack erstellen.
- weniger als 3 Karten ablehnen.
- doppelte Karten entfernen.
- doppelten Packnamen ablehnen.
- Sonderzeichen und HTML-artige Texte sicher anzeigen.
- Pack verwenden, löschen, exportieren und importieren.
- maximal 20 Packs und 100 Karten prüfen.

## 8. Backup und Datenschutz

- vollständigen Export erzeugen.
- Hub-, Party-Night-, Quick-, Advanced-, Pack- und Imposter-Schlüssel kontrollieren.
- gültigen Import durchführen.
- ungültiges JSON und Datei über 1,5 MB ablehnen.
- simulierten Schreibfehler und Rollback prüfen.
- vollständige Löschung aller `secret-circle-*`-Schlüssel prüfen.

## 9. PWA und Offline

- Online-Erststart vollständig laden.
- Installation auf Android und iOS.
- Flugmodus aktivieren.
- Party Hub, Quick Mode, Advanced-Spiel, Word Imposter und Datenschutz öffnen.
- aktive Quick-, Advanced- und Imposter-Session offline fortsetzen.
- Update von älterem Cache auf `secret-circle-v26` prüfen.
- nur v26 darf danach bestehen bleiben.

## 10. Accessibility und Mobile

- Tastaturbedienung ohne Maus.
- sichtbare Fokusmarkierungen.
- Screenreader-Grundprüfung.
- 200-%-Zoom.
- Hoch- und Querformat.
- iPhone-Safe-Areas.
- mindestens 44 × 44 Pixel große Touchziele.
- kein horizontaler Überlauf.
- Reduced Motion und große Systemschrift.

## 11. Reale Partytests

### Kleine Gruppe

- 3–4 Personen
- mindestens 60 Minuten
- Word Imposter, Standardspiel, Quick Mode und Advanced-Spiel

### Große Gruppe

- mindestens 8 Personen
- mindestens 90 Minuten
- Mafia, Schnellfeuer, Wellenlänge, Scharade und Party Night

Dokumentieren: unklare Regeln, Wartezeiten, Kartenqualität, ungeeignete Inhalte, technische Unterbrechungen, gewünschte Wiederholungen und bevorzugte Spiele.

## Freigabekriterium

Der reale Betatest beginnt erst nach grünem `npm run ci` und grünem Cross-Browser-Lauf. Ein öffentlicher Release benötigt zusätzlich erfolgreiche Android-/iOS-, Offline-Update-, Inhalts-, Gruppen- und rechtliche Prüfungen.
