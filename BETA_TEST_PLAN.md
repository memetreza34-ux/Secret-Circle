# Secret Circle – Beta-, Geräte- und Gruppentestplan

Stand: 16. August 2026  
Status: **PREPARED – reale Durchführung offen**

## 1. Ziel

Dieser Plan übersetzt die offenen Realtests aus `RELEASE_CHECKLIST.md` in konkrete Sessions. Ziel ist nicht nur „App öffnen“, sondern zu beobachten, ob echte Nutzer Secret Circle ohne Entwicklerhilfe verstehen, sicher bedienen und nach Unterbrechungen wieder aufnehmen können.

Automatisierte Tests bleiben Voraussetzung, ersetzen diese Beta nicht.

## 2. Testprinzipien

- Entwickler erklärt nicht vorab jeden Button
- Beobachter greift nur bei Sicherheits-/Datenrisiko ein
- Probleme werden notiert, nicht während der Session schöngeredet
- persönliche Spielinhalte bleiben freiwillig
- keine realen Passwörter, privaten Chats oder unnötigen personenbezogenen Daten sammeln
- Screenshots/Video nur mit Einwilligung der Beteiligten
- Testbackup möglichst mit neutralen Testnamen/-inhalten
- jedes Problem erhält Severity und reproduzierbare Notiz

## 3. Mindest-Testmatrix

| Session | Gruppe | Schwerpunkt | Mindestumfang |
|---|---:|---|---|
| G1 | 3–4 | kleine Party / Direkt-Hub | mehrere Social-/Timer-Core-Games |
| G2 | 5–8 | mittlere Gruppe | Advanced + Smart Party Night |
| G3 | 9–12 | große Übergaben | Word Imposter, Paranoia, Timerfluss |
| G4 | mindestens 8 | Mafia | Klassisch + Erweitert, mehrere Mafia-Rollen wenn Gruppengröße erlaubt |
| G5 | 1 unerfahrene Host-Person + Gruppe | Creator | eigenes Spiel ohne Entwicklerhilfe erstellen und spielen |
| PN1–PN3 | variabel | Smart Party Night | drei vollständige geplante Abende |

Ein einzelner Abend darf mehrere Sessions abdecken, wenn die Beobachtung getrennt dokumentiert wird.

## 4. Geräte-Mindestmatrix

### D1 – Android

- aktuelles reales Android-Smartphone
- Chrome
- Browser-Tab
- installierte PWA
- Hochformat
- Querformat bei mindestens einem Core-Flow
- offline nach vorheriger Installation
- Hintergrund/Appwechsel
- Sperrbildschirm bei aktivem Timer

### D2 – iPhone

- reales iPhone
- Safari
- zum Home-Bildschirm hinzugefügte PWA
- Safe Areas
- Bildschirmtastatur
- Hintergrund/Appwechsel
- Sperrbildschirm bei Timer
- VoiceOver-Smoke-Test

### D3 – Tablet/iPad

- reale Tabletklasse
- mindestens Katalog, private Übergabe, Timer und Creator
- Quer-/Hochformat mindestens stichprobenartig

### D4 – Desktop

- Tastatur ohne Maus für Hauptnavigation/Katalog
- 200-%-Zoom
- Chromium plus mindestens ein weiterer Browser im manuellen Smoke

## 5. Preflight vor jeder Beta

Dokumentieren:

```text
Datum:
App-Commit:
Cachegeneration:
Browser/OS:
Gerät:
Installiert oder Browser:
Online/Offline zu Beginn:
Gruppengröße:
Beobachter:
Bekannte offene P0/P1-Funde:
```

Nicht mit einer unbekannten/wechselnden Version testen. Derselbe Testbericht muss eindeutig einem Commit und einer Cachegeneration zugeordnet sein.

## 6. G1 – Kleine Gruppe 3–4 Personen

### Ziel

Prüfen, ob der Standard-Hub ohne Erklärung funktioniert.

### Aufgaben

1. App selbst öffnen
2. Spieler anlegen
3. über Katalog ein passendes Core-Spiel finden
4. Wahrheit oder Pflicht starten
5. mindestens eine persönliche Karte bewusst überspringen
6. Beenden & speichern verwenden
7. nächstes Spiel wählen
8. Scharade starten und Timer pausieren/fortsetzen
9. Seite während einer laufenden Runde neu laden
10. gespeicherte Session bewusst fortsetzen
11. Verlauf prüfen

### Beobachten

- verstehen Nutzer Unterschied Speichern vs. Verwerfen?
- wird Freiwilligkeitsregel wahrgenommen?
- wird Skip ohne soziale Rechtfertigung akzeptiert?
- landet Fokus/visuelle Aufmerksamkeit nach Reload sinnvoll?
- doppelte Statistik?
- Timerrestzeit plausibel?

## 7. G2 – Mittlere Gruppe 5–8 Personen

### Ziel

Private Übergaben und Advanced-Flows prüfen.

### Spiele

- Two Truths
- Question Imposter
- Location Spy
- optional Never Have / Would Rather

### Unterbrechungstest

Bei mindestens einem privaten Reveal:

1. Karte bewusst öffnen
2. App/Tab in Hintergrund
3. zurückkehren oder reloaden
4. prüfen, dass privater Inhalt nicht automatisch sichtbar ist
5. Session fortsetzen

### Beobachten

- Übergabe klar?
- schaut nächste Person versehentlich vorherigen geheimen Inhalt?
- verstehen Nutzer Abstimmung/Auflösung?
- sind Regeln vor Start ausreichend?
- ist Spieltempo für 5–8 akzeptabel?

## 8. G3 – Große Gruppe 9–12 Personen

### Word Imposter

- große reale Runde
- mehrere Imposter, soweit die Enginekonfiguration sinnvoll erlaubt
- komplette Reveal-Kette
- Diskussion
- Abstimmung
- Auflösung
- individueller Punktestand

### Paranoia

- mindestens mehrere Runden
- freiwilliges Überspringen beobachten
- prüfen, ob soziale Dynamik unangenehm oder bloßstellend wird

### Timer-Spiel

Mindestens Hot Potato oder Taboo mit echter Geräteweitergabe.

### Messen/beobachten

- Übergabezeit pro Person subjektiv/optional mit Zeitstempel
- Wartegefühl
- Verwirrung bei Reihenfolge
- Gerät wird versehentlich falsch weitergereicht?
- Text/Buttons aus normaler Gruppendistanz lesbar?

## 9. G4 – Mafia ab 8 Personen

### Varianten

Mindestens:

- Klassisch
- Erweitert

### Prüfen

- Rollenanzahl und Mafia-Skalierung
- Nachtphase verständlich
- Arztaktion
- Detektivaktion
- Beschützeraktion
- Beschützer kann dieselbe Person nicht zwei Nächte in Folge schützen
- Eliminationszustand korrekt
- Siegbedingung Dorf/Mafia korrekt
- Moderator kann geheime Informationen kontrollieren
- Reload blendet Moderator-/Rolleninformationen wieder aus

### Produktfragen

- braucht Moderator zusätzliche Hilfe?
- dauert Nachtphase zu lange?
- sind Rollenbegriffe verständlich?
- wirkt `teen` angemessen?

## 10. G5 – Creator mit unerfahrener Person

Die Testperson soll vorher keine Erklärung des Wizards bekommen.

### Aufgabe

> Erstelle ein eigenes Partyspiel mit mindestens zwei Packs und spiele danach eine kurze Runde damit.

### Prüfen

- Vorlage selbst gefunden
- Pack hinzufügen verständlich
- Kartenformat verständlich
- Vorschau hilfreich
- Speichern erfolgreich
- eigenes Spiel im Hub gefunden
- Start erfolgreich
- Editieren/Kopieren/Löschen verstanden
- Export/Import mit neutralem Testspiel

### Abbruchkriterium

Wenn die Person ohne Entwicklerhilfe nicht erkennen kann, wie ein valides erstes Spiel erstellt wird, ist Creator für RC noch nicht ausreichend selbsterklärend.

## 11. Smart Party Night – PN1 bis PN3

Drei vollständige Abende mit unterschiedlichen Bedingungen:

### PN1

- kleine/mittlere Gruppe
- ca. 30 Minuten
- eher lustig/friendly

### PN2

- mittlere Gruppe
- ca. 45–60 Minuten
- gemischt/competitive

### PN3

- große Gruppe
- ca. 60–90 Minuten
- gemischte Core-Auswahl

Prüfen:

- Plan passt zur Gruppengröße
- keine unpassenden Wiederholungen
- Wechsel zwischen Spielen verständlich
- tatsächliche Dauer grob plausibel
- History-Synchronisierung
- Abbruch/Wechsel eines geplanten Spiels möglich

## 12. PWA-Update-Test

Mindestens zwei ältere installierte Zustände gegen den finalen RC prüfen.

Pro Ausgangsversion:

1. Testspieler/Presets anlegen
2. Creator-Spiel anlegen
3. aktive Hub- oder Advanced-Session erzeugen
4. alte App schließen/öffnen
5. neue Version verfügbar machen
6. sichtbaren Updatehinweis prüfen
7. Update zunächst verschieben
8. laufende Session fortsetzen
9. anschließend bewusst aktualisieren
10. Offline-Neustart
11. lokale Daten und Sessionzustände prüfen

Keine alte Cachegeneration künstlich als „getestet“ markieren, wenn sie nicht wirklich installiert war.

## 13. Rollback-Test

Auf HTTPS-Staging:

- RC bereitstellen
- definierten Testfehler/fehlerhaften Stand simulieren oder isolierten Rollbackpfad verwenden
- korrigierten Stand mit **neuer** Cachegeneration deployen
- lokales Datenmodell erhalten
- Offline-Core nach Update vollständig
- keine Force-Push-Annahme

## 14. Accessibility-Realtest

### Tastatur

- Start → Spiele
- Suche
- Spieldetail öffnen/schließen
- mindestens ein Core-Spiel
- Creator-Wizard

### 200-%-Zoom

- kein Verlust primärer Aktionen
- Dialog scrollbar
- Sessioncontrols erreichbar
- kein zwingender horizontaler Scroll für Kernaufgabe

### VoiceOver/TalkBack

Mindestens prüfen:

- Seitentitel/Überschrift
- Navigation
- Suche + Vorschläge
- Spieldialog
- private Reveal-Karte
- Pause/Fortsetzen
- Ergebnis

Private Inhalte dürfen nicht vor bewusster Reveal-Aktion angesagt werden.

## 15. Content-Beobachtung

Pro gespieltem Core-Game notieren:

- unklare Karte
- semantisch fast identische Karte
- zu lange Karte
- unangenehmer/übergriffiger Eindruck
- falsches `all`/`teen`-Gefühl
- packfremder Inhalt
- zu schwere/zu leichte Karte
- Wiederholungsgefühl

Fundformat:

```text
Spiel:
Pack:
Karte:
Problem:
Kategorie: Ton / Privacy / Safety / Alter / Duplikat / Schwierigkeit / Rechte
Severity:
Vorschlag:
```

## 16. Bug-Severity

### Critical

- Datenverlust ohne Recovery
- private Informationen unerwartet offengelegt
- weitreichender Securityfehler
- App für Hauptzielgruppe nicht nutzbar

### High

- Core-Spiel nicht abschließbar
- falscher Sieger/Score mit Produktwirkung
- Resume/Timer systematisch kaputt
- wichtiger Accessibilityflow blockiert

### Medium

- Workaround vorhanden
- deutliche UX-/Contentstörung
- einzelner Browser-/Layoutfehler ohne Kernblockade

### Low

- kosmetisch
- kleine Copy
- nicht kritische Inkonsistenz

## 17. Testbericht pro Session

```text
Test-ID:
Datum:
Commit:
Cache:
Gerät/OS/Browser:
Teilnehmerzahl:
Spiele/Flows:
Dauer:
Ohne Entwicklerhilfe abgeschlossen: ja/nein
Critical:
High:
Medium:
Low:
Contentfunde:
Accessibilityfunde:
PWA/Resume-Funde:
Was war unklar?
Was funktionierte besonders reibungslos?
Nächste Maßnahmen:
Retest nötig: ja/nein
```

Keine Namen der Teilnehmer sind für den Releasebericht erforderlich; Test-IDs reichen.

## 18. Beta-Freigaberegel

Vor `REAL USER / DEVICE PASS`:

- [ ] G1 abgeschlossen
- [ ] G2 abgeschlossen
- [ ] G3 abgeschlossen
- [ ] G4 Mafia abgeschlossen
- [ ] G5 Creator abgeschlossen
- [ ] PN1–PN3 abgeschlossen
- [ ] reales Android abgeschlossen
- [ ] reales iPhone abgeschlossen
- [ ] Tablet abgeschlossen
- [ ] VoiceOver abgeschlossen
- [ ] TalkBack abgeschlossen
- [ ] 200-%-Zoom abgeschlossen
- [ ] zwei echte PWA-Upgrades abgeschlossen
- [ ] HTTPS-Rollbackprobe abgeschlossen
- [ ] keine offenen Critical/High Bugs
- [ ] Core-Content-Funde triagiert
- [ ] Retests aller gefixten Critical/High-Funde abgeschlossen

Bis dahin bleibt Beta/Realgeräte **OPEN bzw. IN PROGRESS** und der öffentliche Release **NO_GO**.
