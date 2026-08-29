# Secret Circle – Nutzer und Nutzungsszenarien

Stand: 16. August 2026

## 1. Zweck

Dieses Dokument beschreibt reale Situationen, für die Secret Circle gebaut und getestet wird. Es verhindert, dass Funktionen nur technisch betrachtet werden.

## 2. Primäre Nutzungssituation

Mehrere Personen befinden sich gemeinsam an einem Ort. Ein Smartphone oder Tablet wird geteilt. Die Gruppe möchte ohne lange Vorbereitung ein Partyspiel starten und später leicht zu einem anderen Spiel wechseln.

Wichtige Rahmenbedingungen:

- nicht jeder kennt die App
- nicht jeder kennt die Regeln
- das Gerät wird häufig weitergereicht
- private Rollen/Fragen dürfen nur die richtige Person sehen
- die Gruppe kann laut, unruhig oder ungeduldig sein
- Internet kann fehlen
- ein Appwechsel, Anruf, Reload oder Sperrbildschirm kann eine Runde unterbrechen

## 3. Nutzerrollen

### A. Gastgeber / Gerätehalter

Typische Aufgaben:

- App öffnen
- Spieler anlegen
- Spiel auswählen
- Einstellungen erklären
- Session starten
- bei Problemen navigieren

Die App darf nicht voraussetzen, dass diese Person Entwicklerwissen besitzt.

### B. Mitspieler

Typische Aufgaben:

- eigenes geheimes Reveal lesen
- Gerät weitergeben
- Antwort/Abstimmung abgeben
- Aufgabe erfüllen
- Karte überspringen
- Ergebnis verstehen

### C. Unerfahrener Erstnutzer

Kennt weder Secret Circle noch die Spielmechanik. Muss anhand der Oberfläche und Kurzregeln verstehen, was als Nächstes zu tun ist.

### D. Gruppe mit unterschiedlichen Altersstufen

Benötigt verständliche Altersfilter und passende Standardauswahl. Inhalte dürfen nicht allein wegen ihres Spielnamens als automatisch passend gelten.

## 4. Kern-Szenarien

### S1 – Schnell ein Kernspiel starten

**Situation:** Eine Gruppe möchte sofort loslegen.

Erwarteter Ablauf:

`Party Hub → Spieler prüfen/anlegen → Kernspiel wählen → Pack/Optionen → Kurzregeln → Start`

Erfolg:

- keine unnötige Kontopflicht
- keine Sackgasse
- Spielerzahl wird validiert
- Regeln sind kurz genug
- Startaktion ist eindeutig

### S2 – Erstnutzer versteht das Spiel ohne Entwicklerhilfe

**Situation:** Niemand in der Gruppe hat Secret Circle zuvor benutzt.

Erfolg:

- Seite erklärt Zweck
- maximal wenige klare Regelschritte
- Buttons benennen konkrete Aktionen
- unklare Fachbegriffe werden vermieden/erklärt
- Gruppe beendet mindestens eine Runde ohne externe Erklärung

### S3 – Geheime Rolle sicher weitergeben

**Situation:** Mehrere Personen teilen ein Gerät, aber jede darf nur ihre eigene geheime Information sehen.

Erfolg:

- Reveal erfolgt bewusst
- vor Übergabe wird Inhalt wieder verdeckt
- Reload öffnet geheime Inhalte nicht automatisch erneut
- nächste Person kann nicht versehentlich vorherige Rolle sehen

Relevante Spiele:

- Word Imposter
- Question Imposter
- Location Spy
- Mafia
- Paranoia bei privaten Fragen

### S4 – App wird mitten in einer Runde unterbrochen

**Situation:** Nutzer wechselt App, sperrt das Gerät oder lädt Seite neu.

Erfolg:

- persistierbare Session bleibt gültig
- private Inhalte werden sicher wieder verdeckt
- Timerzustand folgt dem dokumentierten Vertrag
- Wiederaufnahme ist bewusst
- kein zusätzlicher Verlaufseintrag entsteht

### S5 – Timer wird pausiert

**Situation:** Gruppe wird unterbrochen.

Erfolg:

- sichtbare Restzeit friert ein
- Runde kann während Pause nicht versehentlich weitergespielt werden
- Fortsetzen verwendet die verbleibende Zeit
- Reload stellt unterstützte Timerrunden pausiert wieder her

Relevante direkte Hub-Spiele:

- Scharade
- Tabu
- Heiße Kartoffel
- Wortkette

### S6 – Unangenehme Karte überspringen

**Situation:** Eine Frage/Aufgabe passt für eine Person nicht.

Erfolg:

- Skip ist verständlich erreichbar, wo erforderlich
- Skip erzeugt keine unbeabsichtigten Punkte
- keine Begründung durch Nutzer nötig
- nächste Karte/Runde wird sauber geladen

### S7 – Session bewusst beenden und speichern

**Situation:** Gruppe möchte aufhören, aber Abschluss soll in Verlauf/Statistik erscheinen.

Erfolg:

- „Beenden & speichern“ ist eindeutig
- Abschluss wird genau einmal verbucht
- aktiver Zustand wird sauber entfernt
- Replay/nächstes Spiel/Verlauf sind erreichbar

### S8 – Session abbrechen und verwerfen

**Situation:** Falsches Spiel gestartet oder Gruppe möchte ohne Wertung zurück.

Erfolg:

- bestätigter Abbruch
- kein Verlaufseintrag
- keine Statistikänderung
- keine versehentliche Löschung anderer Daten

### S9 – Offline spielen

**Situation:** PWA wurde zuvor geladen/installiert, danach fehlt Internet.

Erfolg:

- Hub startet
- Kernressourcen vorhanden
- Kernspiele starten
- lokale Daten funktionieren
- keine Kernfunktion hängt an externem Laufzeitdienst

### S10 – PWA-Update während aktiver Session

**Situation:** Eine neue Version ist verfügbar.

Erfolg:

- neue Version aktiviert sich nicht still mitten im Spiel
- Nutzer sieht Updateentscheidung
- aktive Session wird erkannt
- bestehender Offline-Core bleibt bei fehlgeschlagener Promotion nutzbar

### S11 – Eigene Spielergruppe wiederverwenden

**Situation:** Dieselben Personen spielen mehrere Spiele nacheinander.

Erfolg:

- Spieler müssen nicht für jedes Spiel neu eingegeben werden
- inkompatible Spielerzahl wird dennoch validiert
- nächste Spiele lassen sich schnell starten

### S12 – Eigenes Spiel erstellen

**Situation:** Nutzer möchte ohne Programmierung eigene Karten erstellen.

Erfolg:

- Vorlage verständlich
- Eingaben validiert
- Vorschau entspricht Spielmechanik
- Speichern/Import/Export sicher
- selbst erstelltes Spiel erscheint im Hub
- Creator-Inhalte können kein ungeprüftes HTML ausführen

### S13 – Kleine Gruppe 3–4 Personen

Erfolg:

- geeignete Spiele auffindbar
- Regeln/Übergaben nicht unnötig langsam
- keine Funktion verlangt stillschweigend größere Gruppe

### S14 – Mittlere Gruppe 5–8 Personen

Erfolg:

- Rollenverteilung und Übergaben bleiben verständlich
- Wartezeiten sind akzeptabel
- geheime Inhalte bleiben sicher

### S15 – Große Gruppe 9–12 Personen

Erfolg:

- Navigation bleibt schnell
- Spielerlisten sind bedienbar
- Rollen-/Rundenlogik skaliert korrekt
- Gerätübergaben erzeugen keine Verwirrung

### S16 – Accessibility: nur Tastatur

**Situation:** Nutzer bedient Desktop ohne Maus.

Erfolg:

- Kernflow vollständig möglich
- Fokus sichtbar und logisch
- Dialoge/Listen/Autocomplete bedienbar

### S17 – Accessibility: 200 % Zoom / kleines Display

Erfolg:

- keine wesentliche Funktion verdeckt
- Buttons bleiben erreichbar
- keine horizontale Zwangsnavigation für Kernaktionen

### S18 – Lokaler Speicher voll oder fehlerhaft

Erfolg:

- verständliche Fehlermeldung
- kritischer Vorgang zerstört alten gültigen Zustand nicht
- App bleibt soweit möglich nutzbar

### S19 – Beschädigte Importdatei

Erfolg:

- Datei wird vor dem Schreiben vollständig validiert
- bestehende Daten bleiben unverändert
- Nutzer erhält verständliche Ablehnung

### S20 – Von einem Spiel zum nächsten wechseln

**Situation:** Gruppe möchte einen ganzen Spieleabend durchführen.

Erfolg:

- Abschluss → nächstes Spiel ist kurz
- Spielerpool bleibt erhalten
- Reifestufen/Filter unterstützen schnelle Auswahl
- Smart Party Night kann als alternative Führung dienen

## 5. Abbruchgründe, die wir aktiv testen

- Regeln zu lang
- unklar, wer das Gerät gerade halten soll
- private Information versehentlich sichtbar
- falsche Spielerzahl
- Buttons mit ähnlicher Bedeutung
- keine sichtbare Möglichkeit zum Skip/Abbruch
- zu viele Schritte vor Spielbeginn
- Timer nicht nachvollziehbar
- Reload zerstört Runde
- kleine Displays verdecken Aktionen
- Content wiederholt sich zu schnell
- Filter führen zu leerem Zustand ohne Erklärung

## 6. Testableitung

Jedes Release-Kernspiel muss mindestens gegen folgende Szenarien gemappt werden:

- S1 Start
- S2 Verständnis
- S7 Abschluss
- S8 Abbruch
- S9 Offline
- S16/S17 Accessibility
- passende private/timed/content-spezifische Szenarien

Echte Gruppentests müssen mindestens kleine, mittlere und große Gruppen abdecken.

## 7. Produktregel

Eine Funktion, die nur im Entwickler-Test funktioniert, aber in diesen realen Situationen unklar, langsam oder unsicher ist, gilt nicht als releasefertig.
