# Secret Circle Party Hub – Manueller Testplan Januar 2027

Stand: 23. August 2026  
Status: **PREPARED – reale Durchführung offen**  
Offline-Core: **`secret-circle-v44` / `secret-circle-v44-staging`**  
Produktstand: **45 Built-ins · 15 Core · 13 Extended · 17 Labs · lokaler Game Creator**

Dieser Plan ergänzt die automatisierten Prüfungen. Ein technisch startbarer Modus gilt erst nach den jeweils zutreffenden Tests dieses Dokuments als manuell abgenommen.

Bewertung je Test: `BESTANDEN`, `FEHLER` oder `BLOCKIERT`.

Für jeden Durchlauf dokumentieren:

```text
Test-ID:
Version:
Commit:
Cachegeneration:
Datum:
Testperson/Host:
Gerät:
Betriebssystem:
Browser:
Installationsmodus:
Gruppengröße:
Online/Offline:
Ergebnis:
Notizen/Funde:
```

**Wichtig:** Vorhandener Code, vorhandene Tests oder ein vorhandener Guard sind kein manueller PASS.

## 1. Automatisierter Preflight

Vor finaler RC-Abnahme auf demselben unveränderten Commit:

- [ ] GitHub Actions erreicht sichtbare Steps
- [ ] Checkout ausgeführt
- [ ] Online-`npm ci --ignore-scripts --no-audit --no-fund` grün
- [ ] `npm run check` grün
- [ ] `npm test` grün
- [ ] `npm run validate` grün
- [ ] Chromium E2E grün
- [ ] vollständiges `npm run ci` grün
- [ ] Chromium / Firefox / WebKit Cross-Browser grün

Aktueller externer Blocker: Issue #7. Solange Actions vor Step 1 endet, bleibt die finale RC-Abnahme `BLOCKIERT`.

## 2. Grundlegender Hub-Smoke

- [ ] Party Hub öffnet ohne sichtbaren Laufzeitfehler
- [ ] 45 Built-ins im Katalog
- [ ] 15 Core / 13 Extended / 17 Labs korrekt dargestellt
- [ ] Suche funktioniert
- [ ] Filter für Art, Stimmung, Spielerzahl, Alter und Status kombinierbar
- [ ] Suchsynonyme liefern sinnvolle Treffer
- [ ] Tippfehler wie `Maifa` / `Impsoter` liefern begrenzte Vorschläge
- [ ] Filterzustand/letzte Ansicht übersteht Reload
- [ ] direkte URL-Ansicht wie `party.html?view=stats` funktioniert
- [ ] Quick-, Mega-, Viral-, Advanced-, Creator- und Imposter-Routen korrekt
- [ ] Spieler, Presets, Favoriten und Einstellungen überstehen Reload
- [ ] Datenschutzseite erreichbar
- [ ] keine kritische Konsole-/Ressourcenfehlermeldung

## 3. Word Imposter

### Setup

- [ ] 3 Personen
- [ ] 8 Personen
- [ ] 20 Personen
- [ ] doppelte Namen werden verständlich abgelehnt
- [ ] unter 3 / über 20 Personen blockiert
- [ ] 1 Imposter
- [ ] mehrere Imposter
- [ ] 6 Imposter zulässig, 7 abgelehnt
- [ ] Startbutton bei ungültigem Setup gesperrt
- [ ] Hilfetexte und Screenreader-Status verständlich

### Rollenfairness

- [ ] mindestens 20 reale Runden protokollieren
- [ ] erste Reveal-Person und Imposterpositionen notieren
- [ ] Rolle nicht systematisch an Reveal-Reihenfolge gekoppelt
- [ ] mehrere Imposter eindeutig
- [ ] keine Rolle aus UI-Muster vorhersagbar

### Geheime Karten / Diskussion / Voting

- [ ] Karte nur für aktuelle Person sichtbar
- [ ] App-/Tab-Wechsel verdeckt offene Karte
- [ ] bewusste Wiederanzeige nötig
- [ ] Handoff verrät vorherige Rolle nicht
- [ ] Diskussionstimer Start/Pause/Hintergrund korrekt
- [ ] geheime Abstimmung pro Person klar
- [ ] Selbststimme ausgeschlossen
- [ ] Teilabstimmung nach Reload korrekt fortgesetzt
- [ ] inkonsistenter Voting-Snapshot verworfen
- [ ] Stichwahl korrekt
- [ ] Imposter-Ratechance korrekt
- [ ] Punkte exakt nach `CORE_SCORING_RULES.md`
- [ ] nächste Runde erhält Matchpunkte
- [ ] Matchabschluss / Verlauf genau einmal

## 4. Direkte Hub-Core-Spiele

Jedes der folgenden Spiele erhält mindestens einen vollständigen realen Durchlauf:

1. Wahrheit oder Pflicht
2. Ich habe noch nie
3. Wer würde eher?
4. Entweder oder
5. Paranoia
6. Scharade
7. Nicht sagen! / Tabu
8. Heiße Kartoffel
9. Wortkette
10. Nur falsche Antworten

Für jedes Spiel:

- [ ] Spielerzahl verständlich
- [ ] Packwahl verständlich
- [ ] Regel während des Spiels noch nachvollziehbar
- [ ] Runde weiter/überspringen funktioniert
- [ ] globaler Skip vergibt keinen Punkt
- [ ] Beenden & speichern ≠ Abbrechen & verwerfen
- [ ] Abbruch schreibt keinen fertigen Verlauf
- [ ] Reload zeigt explizite Resume-Entscheidung
- [ ] gespeicherter Spieler-Snapshot bleibt stabil
- [ ] Verlauf/Statistik nach echtem Abschluss genau einmal

### Wahrheit oder Pflicht / Ich habe noch nie / Wer würde eher? / Paranoia

- [ ] Freiwilligkeitsregel sichtbar und verstanden
- [ ] Skip ohne Begründung sozial akzeptiert
- [ ] keine Built-in-Karte fordert private Chats/Fotos/Passwörter
- [ ] persönlicher Inhalt wird nicht erzwungen

### Paranoia

- [ ] Geheimfrage nur für aktive Person
- [ ] offene Geheimfrage bei Appwechsel verdeckt
- [ ] bewusstes Wiederöffnen nötig
- [ ] Reload öffnet Geheimfrage nicht automatisch

### Scharade

- [ ] nur darstellende Person sieht Begriff
- [ ] offene Karte bei Appwechsel verdeckt
- [ ] 60-s-Timer
- [ ] Pause friert Restzeit
- [ ] Resume stellt Restzeit, Treffer und Karte wieder her
- [ ] interner Kartenskip beendet nicht die ganze Runde

### Nicht sagen! / Tabu

- [ ] nur erklärende Person sieht Ziel + verbotene Wörter
- [ ] offene Karte bei Appwechsel verdeckt
- [ ] 60-s-Timer
- [ ] Pause/Resume korrekt
- [ ] Treffer zählt einmal
- [ ] Begriff überspringen zählt keinen Treffer und beendet Runde nicht

### Heiße Kartoffel

- [ ] zufällige Dauer real innerhalb **10–25 Sekunden**
- [ ] Countdown bleibt verborgen
- [ ] Pause verrät Restzeit nicht
- [ ] Appwechsel/Resume bleibt spielbar
- [ ] Geräteweitergabe praktikabel und sicher
- [ ] wer bei STOPP hält, verliert nur manuell; kein erfundener Punkt

### Wortkette

- [ ] 30-s-Timer
- [ ] Kategorie sichtbar
- [ ] Start-/Folgebuchstabenregel verstanden
- [ ] keine Wiederholungen verstanden
- [ ] App behauptet keine automatische Sprachvalidierung
- [ ] `Runde geschafft` nur manuell nach gültiger Kette

### Nur falsche Antworten

- [ ] Frage verständlich
- [ ] reihum absichtlich falsch antworten verstanden
- [ ] richtige Antwort verliert manuell
- [ ] Gruppenregel für „zu langsam“ verstanden
- [ ] App bleibt scorelos
- [ ] `Runde beendet · nächste Karte` eindeutig

## 5. Advanced-Core-Spiele

### Zwei Wahrheiten, eine Lüge

- [ ] private Eingabe
- [ ] drei unterschiedliche Aussagen erforderlich
- [ ] Appwechsel verdeckt laufende private Eingabe
- [ ] Mischung verbirgt Lügenposition
- [ ] Abstimmung korrekt
- [ ] Resultat korrekt
- [ ] Reload/Resume sicher
- [ ] manipuliertes inkonsistentes Ergebnis verworfen

### Question Imposter

- [ ] jede Person sieht nur eigene Frage
- [ ] andere Frage nur bei Imposter
- [ ] Appwechsel verdeckt offene Frage
- [ ] Reload öffnet Frage nicht automatisch
- [ ] Diskussion verständlich
- [ ] Wahl korrekt
- [ ] manipulierte Rolle/Vote verworfen

### Location Spy

- [ ] Ort geheim verteilt
- [ ] genau ein Spion gemäß aktuellem Spielvertrag
- [ ] Appwechsel verdeckt offene Ortskarte
- [ ] Gruppenwahlpfad korrekt
- [ ] Spion-Ortsguess korrekt
- [ ] Sieger getrennt vom Session-Zähler angezeigt
- [ ] manipulierte Spy-/Result-Snapshots verworfen

### Mafia

Mindestens Gruppengrößen 6, 8, 12 und 16+ soweit praktisch.

- [ ] Mafiaanzahl skaliert korrekt
- [ ] Pack `Schnell` korrekt
- [ ] Pack `Klassisch` korrekt
- [ ] Pack `Erweitert` korrekt
- [ ] Rollen privat
- [ ] Moderatorübersicht nur nach bewusster Bestätigung
- [ ] Appwechsel verdeckt Moderatorübersicht
- [ ] Nachtformular privat
- [ ] Arztaktion korrekt
- [ ] Detektiv-Ergebnis nur Moderator
- [ ] Beschützeraktion korrekt
- [ ] Beschützer nicht dieselbe Person zwei Nächte nacheinander
- [ ] Tageswahl korrekt
- [ ] Dorf gewinnt nur bei 0 lebenden Mafia
- [ ] Mafia gewinnt nur bei Mafia >= übriger Dorfseite
- [ ] manipulierte Rollenanzahl verworfen
- [ ] manipulierte Alive-Menge verworfen
- [ ] manipuliertes Winner-Feld verworfen

## 6. Einheitliche Sessionsteuerung schneller Engines

Mindestens einmal in klassischer Quick-, Mega-, Viral- und Creator-Engine:

- [ ] Pause/Fortsetzen
- [ ] Pausenstatus ohne Farbe verständlich
- [ ] Rundenaktionen während Pause nicht bedienbar
- [ ] Timer mindestens 5 s eingefroren
- [ ] Restzeit nach Fortsetzen korrekt
- [ ] Runde überspringen stoppt Timer und wechselt genau eine Runde
- [ ] Skip auf letzter Runde beendet sauber
- [ ] Session beenden verlangt Bestätigung
- [ ] Abbruch erzeugt keinen fertigen Verlauf
- [ ] Reload nach Abschluss bucht nicht doppelt
- [ ] Replay erhält neue Session-ID
- [ ] Nächstes Spiel korrekt
- [ ] online und offline

## 7. Quick Modes

Mindestens vollständige Sessions für die klassischen Quick-Mechaniken.

### Spektrum-Tipp

- [ ] geheimes Ziel nur Hinweisgeber
- [ ] Ziel vor Gruppenwahl verborgen
- [ ] Regler 0–100
- [ ] Punkte abhängig vom Abstand
- [ ] Pause/Skip/Resume

### Zeichnen & Raten

- [ ] private Karte
- [ ] Treffer/Skip
- [ ] keine unmittelbare Wiederholung im Pool

### Schnellfeuer

- [ ] Timer
- [ ] Erfolg vor Ende
- [ ] automatisches Zeitende
- [ ] Pause friert Zeit

### Geräusche erraten / Stirn-Raten / Melodie summen

- [ ] Zielinformation privat
- [ ] richtige Gerätehaltung
- [ ] Treffer/Skip
- [ ] keine geschützten Audio-/Liedtextinhalte ausgeliefert

### Buchstaben-Kategorien

- [ ] erlaubter Buchstabe
- [ ] Kategorien sichtbar
- [ ] 60-s-Timer
- [ ] Auswertung stoppt Timer
- [ ] Punkteingabe begrenzt

### Nicht lachen! / Gegenstandsjagd

- [ ] sichere Aufgaben/Gegenstände
- [ ] Timer korrekt
- [ ] keine gefährlichen/privaten/zerbrechlichen Aufforderungen

### Caption Battle

- [ ] Situation klar
- [ ] Gewinner nur aus aktueller Spielergruppe
- [ ] Ergebnis/Statistik korrekt

## 8. Extended / Mega / Viral / Labs

Je Mechanikfamilie mindestens ein kompletter Smoke-Test.

- [ ] Extended klar von Core unterscheidbar
- [ ] Labs als experimentell erkennbar
- [ ] Labs wirken nicht wie final releaseabgenommen
- [ ] private Ziele bei Wer bin ich / Anime-Archetypen / Secret Mission geschützt
- [ ] Blind Ranking belegt Rang nicht doppelt
- [ ] Emoji Quiz Lösung erst nach Reveal
- [ ] Preis-/Geldwerte als Spielwerte/hypothetisch klar
- [ ] Höher/Tiefer-Logik korrekt
- [ ] „Wer kennt mich am besten?“ Antwort vor Gruppenwahl geschützt
- [ ] Hear Me Out / Hot Seat / Story Chain Timer pausierbar
- [ ] keine konkrete fremde Fan-Grafik/Audios/langen Zitate
- [ ] Abschluss/Statistik genau einmal

## 9. Game Creator

- [ ] alle angebotenen Vorlagen testbar
- [ ] mehrere Kategorien/Packs
- [ ] Mindestkartenzahl erzwungen
- [ ] Unicode/Sonderzeichen sicher
- [ ] HTML-artige Eingabe wird als Text behandelt
- [ ] strukturierte Karten bleiben nach Export/Import strukturiert
- [ ] Bearbeiten aktualisiert `updatedAt`
- [ ] Laden allein verändert Zeitstempel nicht
- [ ] Kopie besitzt eigene Zeitstempel/ID
- [ ] eigenes Spiel erscheint im Hub
- [ ] eigenes Spiel start/pause/skip/abort/replay
- [ ] Creator-Bibliothek Export/Import
- [ ] Speicherfehler/Rollback
- [ ] unerfahrene Person kann ohne Entwicklerhilfe ein valides Spiel bauen

## 10. Smart Party Night

- [ ] 15 Minuten
- [ ] 30 Minuten
- [ ] 45 Minuten
- [ ] 60 Minuten
- [ ] 90 Minuten
- [ ] unterschiedliche Stimmungen
- [ ] Altersfilter
- [ ] Gruppengrößenfilter
- [ ] Favoritenbonus / zuletzt gespielt
- [ ] Core-/Quick-/Advanced-/Creator-/Word-Imposter-Abschluss synchron
- [ ] erledigte und übersprungene Schritte
- [ ] Plan nach Neustart fortsetzbar
- [ ] mindestens drei vollständige reale Abende

## 11. Eigene Hub-Packs

- [ ] gültiges Pack erstellen
- [ ] Mindestkartenzahl erzwingen
- [ ] exakte Duplikate behandeln
- [ ] doppelten Packnamen ablehnen
- [ ] Sonderzeichen/HTML-artige Texte sicher darstellen
- [ ] verwenden
- [ ] löschen
- [ ] exportieren/importieren
- [ ] Kapazitätsgrenzen prüfen

## 12. Backup / Datenschutz / Datenfehler

- [ ] Word-Imposter-Backup Export → Import
- [ ] vollständiger Gesamtexport
- [ ] Creator-Bibliothek separat
- [ ] alle Secret-Circle-Namespace-Daten enthalten
- [ ] ungültiges JSON abgelehnt
- [ ] unbekannter Namespace abgelehnt
- [ ] Datei über 1.500.000 UTF-8-Bytes abgelehnt
- [ ] Mehrbyte-Unicode knapp über Grenze abgelehnt
- [ ] simulierter Schreibfehler führt zu Rollback
- [ ] vollständige lokale Löschung
- [ ] keine Datenübertragung an eigenen Server beobachtet

## 13. PWA / Offline – v44

- [ ] Online-Erststart
- [ ] Installation Android
- [ ] Add to Home Screen iOS
- [ ] Flugmodus
- [ ] Party Hub offline
- [ ] Word Imposter offline
- [ ] Advanced offline
- [ ] Quick/Mega/Viral offline
- [ ] Creator offline
- [ ] Privacy offline
- [ ] Query-Routen offline
- [ ] Resume-Guards offline verfügbar
- [ ] Pause/Skip/Abort/Replay offline
- [ ] Update von mindestens zwei echten älteren Installationen auf RC/v44
- [ ] neue Version zunächst nur staged
- [ ] aktive Session nicht ungefragt ersetzt
- [ ] `Später` behält aktuelle Version
- [ ] bewusste Aktivierung aktualisiert
- [ ] lokale Daten überstehen Update
- [ ] fehlgeschlagene Promotion lässt bisherigen Core verwendbar
- [ ] nach erfolgreicher Promotion nur vorgesehene finale Cachegeneration aktiv

## 14. Hintergrund / Sperrbildschirm / Reload

Für jeden zeitgesteuerten Kernmechanismus:

- [ ] Timer starten
- [ ] App/Tab Hintergrund → zurück
- [ ] Gerät sperren → entsperren
- [ ] Reload während Session
- [ ] bewusst pausierte Zeit nicht abgezogen
- [ ] definierte Hintergrundregel eingehalten
- [ ] keine doppelte Endaktion
- [ ] keine doppelte Statistik
- [ ] private Inhalte bei Fokusverlust verdeckt

Muss real auf Android und iOS bestätigt werden.

## 15. Accessibility / Mobile

- [ ] Tastatur ohne Maus
- [ ] Skip-Link sinnvoll
- [ ] sichtbarer Fokus
- [ ] Screenreader-Grundprüfung
- [ ] VoiceOver
- [ ] TalkBack
- [ ] private Inhalte werden vor Reveal nicht angesagt
- [ ] Privacy-Cover verständlich angekündigt
- [ ] 200-%-Zoom
- [ ] 320 CSS px
- [ ] große Systemschrift
- [ ] Hoch-/Querformat
- [ ] iPhone-Safe-Areas
- [ ] Bildschirmtastatur
- [ ] Touchziele mindestens 44×44 px, wo gefordert
- [ ] kein kritischer horizontaler Überlauf
- [ ] Reduced Motion
- [ ] Pause über `aria-pressed`
- [ ] pausierte/inert Aktionen nicht fokussierbar/bedienbar
- [ ] Statusmeldungen nicht nur über Farbe

## 16. Reale Partytests

### Kleine Gruppe

- [ ] 3–4 Personen
- [ ] mindestens 60 Minuten
- [ ] Word Imposter
- [ ] mindestens zwei weitere Core-Games
- [ ] ein Advanced-Spiel

### Mittlere Gruppe

- [ ] 5–8 Personen
- [ ] mindestens 90 Minuten
- [ ] mehrere Core-Games
- [ ] Smart Party Night
- [ ] Creator-Spiel

### Große Gruppe

- [ ] 9–12 Personen
- [ ] mindestens 90 Minuten
- [ ] Word Imposter mit mehreren Impostern
- [ ] Mafia
- [ ] Scharade/Tabu
- [ ] Party Night

Dokumentieren:

- unklare Regeln
- Wartezeiten
- Kartenqualität
- ungeeignete Inhalte
- technische Unterbrechungen
- versehentliche Geheimnisoffenlegung
- bevorzugte Spiele
- Spiele, die Nutzer vermeiden
- Fehlbedienung von Pause/Skip/Abbruch

## 17. Content-/Rechtebeobachtung

Pro gespieltem Core-/Release-Spiel:

- [ ] Ton passend
- [ ] Privacy passend
- [ ] Safety passend
- [ ] Altersstufe plausibel
- [ ] keine semantisch störenden Wiederholungen
- [ ] Schwierigkeit passend
- [ ] keine unklare konkrete Marken-/Fanreferenz
- [ ] keine ungeklärten visuellen Rechte

Root-`icon.svg` bleibt bis dokumentierter Rechtebasis oder Ersatz offen.

## 18. Release-Freigabekriterium

Ein öffentlicher `GO` ist erst zulässig, wenn:

- [ ] automatisierter Preflight auf finalem RC grün
- [ ] Branch Protection tatsächlich aktiv und Required Check grün
- [ ] HTTPS-Staging und Production-Smoke grün
- [ ] Android real bestanden
- [ ] iPhone/iPad real bestanden
- [ ] Accessibility real bestanden
- [ ] mindestens ein realer Testnachweis pro Core-Spiel
- [ ] G1–G5 und PN1–PN3 nach `BETA_TEST_PLAN.md` abgeschlossen
- [ ] zwei echte PWA-Upgrades und Rollback bestanden
- [ ] keine offenen Critical/High-Funde
- [ ] Content-/Rechte-/Legal-/Support-/Hosting-Sign-off abgeschlossen
- [ ] Incident-/Rollback-Drill abgeschlossen
- [ ] unveränderter RC festgelegt
- [ ] `release-evidence.json = FINAL / GO`

Bis dahin bleibt der öffentliche Release **NO_GO** und PR #13 **Draft / ungemergt**.
