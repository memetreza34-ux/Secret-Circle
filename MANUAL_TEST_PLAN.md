# Secret Circle Party Hub – Manueller Testplan Januar 2027

Dieser Plan ergänzt die automatisierten Prüfungen. Für jeden Durchlauf dokumentieren: Version, Commit, Datum, Testperson, Gerät, Betriebssystem, Browser, Installationsmodus, Gruppengröße und Online-/Offline-Zustand.

Bewertung je Test: `BESTANDEN`, `FEHLER` oder `BLOCKIERT`.

Aktueller Foundation-Stand: 45 eingebaute Spiele, 15 priorisierte Kernspiele, 13 Erweiterungen, 17 Labs-Modi, lokaler Game-Creator und Offline-Core `secret-circle-v30`.

Ein technisch startbarer Modus gilt erst nach den jeweils zutreffenden Tests dieses Dokuments als manuell abgenommen.

## 1. Grundlegender Smoke-Test

- Party Hub öffnet ohne sichtbaren Laufzeitfehler.
- 45 eingebaute Spiele sind im Katalog vorhanden.
- Reifestufen zeigen 15 Kernspiele, 13 Erweiterungen und 17 Labs.
- Suche, Gruppe, Stimmung, Spielerzahl, Alter, Status und Reifestufe funktionieren gemeinsam.
- gespeicherte Filter und letzte Ansicht überstehen ein Neuladen.
- direkte URL-Ansicht wie `party.html?view=stats` hat Vorrang vor dem gespeicherten Zustand.
- Filterreset stellt sichere Standards wieder her.
- Synonyme wie `Werwolf`, `Montagsmaler` und `Stadt Land Fluss` liefern sinnvolle Treffer.
- Tippfehler wie `Maifa` und `Impsoter` liefern begrenzte Vorschläge.
- Quick-, Mega-, Viral-, Creator-, Advanced- und Imposter-Routen öffnen den korrekten Bereich.
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
- Sessionabschluss erhöht Verlauf und Statistik genau einmal.
- beschädigte oder unzulässige Sessiondaten werden sicher behandelt.

## 3. Einheitliche Sessionsteuerung der schnellen Engines

Die folgenden Punkte mindestens einmal in **klassischer Quick-, Mega-, Viral- und Creator-Engine** prüfen:

- dieselbe Steuerleiste zeigt Pause, Runde überspringen und Session beenden.
- Pause ändert sich sichtbar zu Fortsetzen.
- der Pausenstatus ist auch ohne Farbe verständlich.
- Rundenaktionen sind während der Pause nicht bedienbar.
- ein laufender Timer bleibt während mindestens fünf Sekunden Pause sichtbar unverändert.
- nach Fortsetzen läuft der Timer mit der verbleibenden Zeit weiter.
- Runde überspringen stoppt einen laufenden Timer und wechselt genau eine Runde weiter.
- auf der letzten Runde beendet Überspringen die Session sauber.
- Session beenden verlangt eine Bestätigung.
- Abbruch entfernt nur die aktive Session und erzeugt keinen fertigen Verlaufseintrag.
- simulierter Speicherfehler beim Abbruch darf die letzte aktive Session nicht still verlieren.
- Wiederholen startet eine neue Session mit neuer Session-ID.
- Nächstes Spiel führt zu einem anderen spielbaren schnellen Modus oder sicher zum Katalog.
- nach Abschluss werden Verlauf, `plays`, Runden und Bestwert genau einmal aktualisiert.
- Reload nach gespeichertem Abschluss erzeugt keinen zweiten Verlaufseintrag.
- die Steuerung funktioniert online und offline.

## 4. 15 Kernspiele

Jedes Kernspiel aus `RELEASE_SCOPE_2027.md` erhält einen eigenen Testnachweis.

Aktuelle Kernspiele:

1. Word Imposter
2. Wahrheit oder Pflicht
3. Ich habe noch nie
4. Wer würde eher?
5. Entweder oder
6. Paranoia
7. Scharade
8. Nicht sagen! / Tabu
9. Heiße Kartoffel
10. Wortkette
11. Zwei Wahrheiten, eine Lüge
12. Question Imposter
13. Location Spy
14. Mafia
15. Nur falsche Antworten

Für jedes Spiel prüfen:

- Einstieg und Spielerzahl verständlich.
- Regeln vor Start in höchstens vier klaren Schritten verständlich.
- Packauswahl und Alterskennzeichnung stimmen.
- Start, nächste Runde, sichere Unterbrechung und Abbruch funktionieren.
- Überspringen ist vorhanden, wenn Inhalte persönlich, unangenehm oder unpassend sein können.
- Punkte- beziehungsweise Siegerlogik stimmt und ist verständlich.
- Verlauf und Statistik stimmen.
- Wiederaufnahme nach unterstützter Unterbrechung funktioniert.
- Tastatur, sichtbarer Fokus, 200-%-Zoom und Reduced Motion prüfen.
- kleine Smartphonebreite und Querformat prüfen.
- mindestens eine reale Gruppe beendet das Spiel ohne Entwicklerhilfe.

## 5. Erweiterungen und Labs

- Erweiterungen bleiben klar von Kernspielen unterscheidbar.
- Labs sind sichtbar als experimentell gekennzeichnet.
- Labs dürfen nicht den Eindruck erwecken, bereits vollständig releaseabgenommen zu sein.
- mindestens ein vollständiger Smoke-Test pro Mechanikfamilie.
- private Inhalte und geheime Karten bleiben beim Gerätewechsel geschützt.
- Geld- und Preisformate bleiben klar als Spielwerte beziehungsweise hypothetisch gekennzeichnet.
- Anime-/Fan-Modi enthalten keine fremden Bilder, Audios oder langen Zitate.

## 6. Klassische Quick Modes

Jeden der zehn klassischen Modi mit 3 und 5 Runden testen; Wellenlänge und Schnellfeuer zusätzlich mit 10 und 20 Runden.

### Wellenlänge

- geheimes Ziel sichtbar nur für Hinweisgeber.
- Ziel wird vor Gruppenwahl verborgen.
- Regler von 0 bis 100.
- Punkte abhängig vom Abstand.
- gemeinsame Pause/Skip/Abbruch-Steuerung.
- nächste Runde und Wiederaufnahme.

### Zeichnen & Raten

- private Karte.
- Treffer und Überspringen.
- keine unmittelbare Wiederholung innerhalb des verfügbaren Pools.

### Schnellfeuer

- kurze und längere Timerkarten.
- Erfolg vor Timerende.
- automatisches Zeitende.
- Pause friert die Restzeit ein.
- Punkte und nächste Person.

### Geräusche erraten

- Zielkarte nur für aktive Person.
- Treffer und Überspringen.

### Stirn-Raten

- ratende Person sieht das Ziel nicht.
- Gerät zeigt zur Gruppe.
- Spielerwechsel.

### Buchstaben-Kategorien

- zufälliger erlaubter Buchstabe.
- Kategorien sichtbar.
- 60-Sekunden-Timer.
- vorzeitige Auswertung stoppt Timer.
- Punkteingabe begrenzt auf Kategorienanzahl.

### Nicht lachen!

- sichere Aufgaben.
- 30-Sekunden-Timer.
- Erfolg und Misserfolg.

### Melodie summen

- keine bereitgestellten geschützten Aufnahmen oder Liedtexte.
- private Aufgabe.
- Treffer und Überspringen.

### Gegenstandsjagd

- sicheren Spielbereich festlegen.
- 60-Sekunden-Timer.
- keine gefährlichen, zerbrechlichen oder privaten Gegenstände verlangen.

### Caption Battle

- Situation anzeigen.
- Gewinner nur aus aktueller Spielergruppe wählen.
- Rangliste korrekt.

## 7. Mega- und Viral-Modi

Jeweils mindestens einen vollständigen Durchlauf mit 3 und 5 Runden durchführen.

Besonders prüfen:

- Wer bin ich? und Anime-Raten: private Zielinformation geschützt.
- Blind Ranking: kein bereits belegter Rang erneut auswählbar.
- Emoji Quiz: Lösung erst nach Aufdecken sichtbar.
- Secret Mission: Mission nur für aktive Person sichtbar.
- Preis schätzen: feste Spielwerte statt aktueller Händlerpreis.
- Höher/Tiefer: Vergleichslogik stimmt.
- Wer kennt mich am besten?: geheime Antwort vor Gruppenwahl geschützt.
- Hear Me Out, Hot Seat und Story Chain: Timer pausierbar und sauber beendbar.
- Punkte und Statistik erhöhen sich pro echter Session genau einmal.

## 8. Advanced-Spiele

### Zwei Wahrheiten, eine Lüge

- private Eingabe.
- zufällige Mischung.
- Abstimmung und Auflösung.
- Fortsetzung nach Neuladen.

### Question Imposter

- geheime ähnliche Fragen.
- korrekte Imposteranzahl gemäß Spielregel.
- Diskussion und Wahl.
- Spieler-Snapshot nach Lobbyänderung.

### Location Spy

- Ort und Spion geheim verteilen.
- Verdächtigenwahl.
- Ortsraten und Auflösung.

### Mafia

- mindestens 6 Personen.
- private Rollen.
- geschützte Moderatoransicht.
- Nachtaktionen, Tageswahl und Siegbedingung.

## 9. Game Creator

- alle sechs Vorlagen erstellen und speichern.
- mehrere Kategorien pro Spiel.
- mindestens drei Karten werden erzwungen.
- Unicode und Sonderzeichen bleiben sicher.
- strukturierte Auswahlkarten bleiben nach Export/Import strukturiert.
- Bearbeiten aktualisiert `updatedAt`, Laden allein nicht.
- Kopie erhält eigene Zeitstempel.
- eigenes Spiel erscheint im Hub als Erweiterung.
- Creator-Spiel über Quick-Seite starten, pausieren, skippen, abbrechen und wiederholen.
- Export und Import der Creator-Bibliothek testen.
- Speicherfehler und Rollback testen.

## 10. Smart Party Night

- 15, 30, 45, 60 und 90 Minuten testen.
- alle Stimmungen testen.
- Alters- und Gruppengrößenfilter prüfen.
- Favoritenbonus und zuletzt gespielt prüfen.
- Hub-, Quick-, Advanced-, Creator- und Word-Imposter-Abschluss synchronisieren.
- erledigte und übersprungene Schritte prüfen.
- Plan nach App-Neustart fortsetzen.

## 11. Eigene Hub-Packs

- gültiges Pack erstellen.
- weniger als erforderliche Mindestkarten ablehnen.
- doppelte Karten entfernen.
- doppelten Packnamen ablehnen.
- Sonderzeichen und HTML-artige Texte sicher anzeigen.
- Pack verwenden, löschen, exportieren und importieren.
- aktuelle Kapazitätsgrenzen aus dem Runtime-Vertrag prüfen.

## 12. Backup und Datenschutz

- Word-Imposter-Backup erzeugen und wieder importieren.
- vollständigen Gesamtexport erzeugen.
- Creator-Bibliothek separat exportieren und importieren.
- Hub-, Party-Night-, Quick-, Mega-, Viral-, Creator-, Advanced-, Pack- und Imposter-Schlüssel kontrollieren.
- ungültiges JSON ablehnen.
- Datei über 1.500.000 UTF-8-Bytes ablehnen.
- mehrbyteige Unicode-Datei knapp oberhalb der Bytegrenze ablehnen.
- simulierten Schreibfehler und Rollback prüfen.
- vollständige Löschung aller `secret-circle-*`-Schlüssel prüfen.

## 13. PWA und Offline

- Online-Erststart vollständig laden.
- Installation auf Android und iOS.
- Flugmodus aktivieren.
- Party Hub, Creator, Quick-, Mega-, Viral-, Advanced-Spiel, Word Imposter und Datenschutz öffnen.
- Release-Tiers, Filter, Suchvorschläge und `party-session-controls.js` offline prüfen.
- aktive schnelle Session offline fortsetzen.
- Pause, Skip, Abbruch, Replay und nächstes Spiel offline prüfen.
- Query-Routen wie `quick-play.html?game=...` offline öffnen.
- Update von mindestens zwei älteren installierten Versionen auf den aktuellen Release Candidate prüfen.
- neue Version wird zunächst nur vorbereitet.
- laufende Session wird nicht ohne Zustimmung neu geladen.
- „Später“ behält die aktuelle Version während der Session.
- „Jetzt aktualisieren“ aktiviert die vorbereitete Version kontrolliert.
- lokale Spieler, Packs, Creator-Spiele und Sessions überstehen das Update.
- bei fehlgeschlagener Promotion bleibt der bisherige Offline-Core verwendbar.
- nur die vorgesehene finale Cacheversion bleibt nach erfolgreicher Promotion bestehen.

## 14. Hintergrund, Sperrbildschirm und Reload

Für jeden zeitgesteuerten Kernmechanismus separat dokumentieren:

- Timer im Vordergrund starten.
- App/Tab kurz in den Hintergrund schicken und zurückkehren.
- Gerät sperren und nach kurzer Zeit entsperren.
- Seite während einer aktiven Session neu laden.
- bewusst pausierte Zeit darf nicht als Spielzeit abgezogen werden.
- nicht pausierte Hintergrundzeit muss gemäß definierter Spielregel korrekt behandelt werden.
- keine doppelte Timer-Endaktion nach Rückkehr oder Reload.
- keine doppelte Statistikbuchung.

Dieser Block bleibt offen, bis das Verhalten auf echten Android- und iOS-Geräten bestätigt ist.

## 15. Accessibility und Mobile

- Tastaturbedienung ohne Maus.
- sichtbare Fokusmarkierungen.
- Screenreader-Grundprüfung.
- 200-%-Zoom.
- Hoch- und Querformat.
- iPhone-Safe-Areas.
- mindestens 44 × 44 Pixel große Touchziele.
- kein horizontaler Überlauf.
- Reduced Motion und große Systemschrift.
- Suchvorschläge als Listbox verständlich.
- Pausenknopf meldet Zustand über `aria-pressed`.
- pausierte Rundenaktionen sind nicht fokussierbar beziehungsweise bedienbar.
- Statusmeldungen erklären Fehler und Pausen ohne reine Farbcodierung.

## 16. Reale Partytests

### Kleine Gruppe

- 3–4 Personen.
- mindestens 60 Minuten.
- Word Imposter, mindestens zwei Kernspiele, ein schneller Modus und ein Advanced-Spiel.

### Mittlere Gruppe

- 5–8 Personen.
- mindestens 90 Minuten.
- mehrere Kernspiele, Smart Party Night und mindestens ein Creator-Spiel.

### Große Gruppe

- 9–12 Personen.
- mindestens 90 Minuten.
- Mafia, Word Imposter mit mehreren Impostern, Scharade und Party Night.

Dokumentieren: unklare Regeln, Wartezeiten, Kartenqualität, ungeeignete Inhalte, technische Unterbrechungen, gewünschte Wiederholungen, bevorzugte Spiele sowie Fehlbedienungen der Pause-/Skip-/Abbruchsteuerung.

## Freigabekriterium

Der reale Betatest für den Release Candidate beginnt erst nach dokumentiert grünem `npm run ci` und grünem Cross-Browser-Lauf. Ein öffentlicher Release benötigt zusätzlich erfolgreiche Android-/iOS-, Offline-Update-, Inhalts-, Gruppen-, Accessibility- und rechtliche Prüfungen gemäß `RELEASE_CHECKLIST.md`.
