# Secret Circle – Beta-, Geräte- und Gruppentestplan

Stand: 23. August 2026  
Status: **PREPARED – reale Durchführung offen**  
Offline-Core: **`secret-circle-v44` / `secret-circle-v44-staging`**  
Core Source Hardening: **15/15 PREPARED**

## 1. Ziel

Dieser Plan übersetzt die offenen Realtests aus `RELEASE_CHECKLIST.md` und Issue #8 in konkrete Sessions. Ziel ist nicht nur „App öffnen“, sondern zu beobachten, ob echte Nutzer Secret Circle ohne Entwicklerhilfe verstehen, sicher bedienen und nach Unterbrechungen wieder aufnehmen können.

Automatisierte Tests bleiben Voraussetzung, ersetzen diese Beta nicht. Kein vorhandener Test oder Guard darf als bestanden markiert werden, bevor er tatsächlich auf dem getesteten RC ausgeführt wurde.

## 2. Eintrittskriterium

Die eigentliche RC-Beta beginnt erst, wenn auf demselben Commit dokumentiert grün sind:

- GitHub Actions mit sichtbaren Steps
- Online-`npm ci`
- `npm run ci`
- Chromium E2E
- Cross-Browser mit Chromium, Firefox und WebKit

Aktueller Blocker: Issue #7. App-CI Run #2401 und ein reiner Bash-Runner-Probe endeten bereits vor Step 1 mit `steps: []`.

Vorher dürfen informelle UX-Proben stattfinden, aber sie zählen nicht als finale RC-Evidence.

## 3. Testprinzipien

- Entwickler erklärt nicht vorab jeden Button.
- Beobachter greift nur bei Sicherheits-/Datenrisiko ein.
- Probleme werden notiert, nicht während der Session schöngeredet.
- persönliche Spielinhalte bleiben freiwillig.
- keine realen Passwörter, privaten Chats oder unnötigen personenbezogenen Daten sammeln.
- Screenshots/Video nur mit Einwilligung der Beteiligten.
- Testbackup möglichst mit neutralen Testnamen/-inhalten.
- jedes Problem erhält Severity und reproduzierbare Notiz.
- geheime Inhalte werden absichtlich auch bei App-/Tab-Wechsel getestet.
- manipulierte Resume-Zustände werden nur mit neutralen Testdaten geprüft.

## 4. Mindest-Testmatrix

| Session | Gruppe | Schwerpunkt | Mindestumfang |
|---|---:|---|---|
| G1 | 3–4 | kleine Party / Direkt-Hub | Word Imposter + mehrere Social-/Timer-Core-Games |
| G2 | 5–8 | mittlere Gruppe | Advanced + Smart Party Night |
| G3 | 9–12 | große Übergaben | Word Imposter, Paranoia, Scharade/Tabu |
| G4 | 6 / 8 / 12 / 16+ soweit praktisch | Mafia | Rollen-Skalierung, Klassisch + Erweitert |
| G5 | 1 unerfahrene Host-Person + Gruppe | Creator | eigenes Spiel ohne Entwicklerhilfe erstellen und spielen |
| PN1–PN3 | variabel | Smart Party Night | drei vollständige geplante Abende |

Ein einzelner Abend darf mehrere Sessions abdecken, wenn Beobachtung und Evidence getrennt dokumentiert werden.

## 5. Geräte-Mindestmatrix

### D1 – Android

- aktuelles reales Android-Smartphone
- Chrome
- Browser-Tab und installierte PWA
- Hochformat + mindestens ein Querformat-Core-Flow
- offline nach vorheriger Installation
- Hintergrund/Appwechsel
- Sperrbildschirm bei aktivem Timer
- TalkBack-Smoke

### D2 – iPhone

- reales iPhone
- Safari
- Add-to-Home-Screen-PWA
- Safe Areas
- Bildschirmtastatur
- Hintergrund/Appwechsel
- Sperrbildschirm bei Timer
- VoiceOver-Smoke

### D3 – Tablet/iPad

- reale Tabletklasse
- Katalog, private Übergabe, Timer, Advanced und Creator
- Quer-/Hochformat

### D4 – Desktop

- Tastatur ohne Maus für Hauptnavigation/Katalog/Core-Spiel
- 200-%-Zoom
- Chromium plus mindestens ein weiterer Browser im manuellen Smoke

## 6. Preflight vor jeder Beta

Dokumentieren:

```text
Test-ID:
Datum:
App-Version:
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

Nicht mit einer unbekannten oder während des Tests wechselnden Version arbeiten. Derselbe Bericht muss eindeutig einem Commit und einer Cachegeneration zugeordnet sein.

## 7. G1 – Kleine Gruppe 3–4 Personen

### Aufgaben

1. App ohne Erklärung öffnen.
2. Spieler anlegen.
3. über Katalog ein Core-Spiel finden.
4. Word Imposter komplett spielen.
5. Wahrheit oder Pflicht starten und mindestens eine Karte bewusst überspringen.
6. Beenden & speichern verwenden.
7. Scharade starten, pausieren, fortsetzen und App wechseln.
8. Seite während einer laufenden Session neu laden.
9. gespeicherte Session bewusst fortsetzen.
10. Nur falsche Antworten spielen und manuelle Verlustregel erklären lassen.
11. Verlauf prüfen.

### Beobachten

- Setup ohne Entwicklerhilfe verstanden?
- Unterschied Speichern vs. Verwerfen verstanden?
- Freiwilligkeitsregel wahrgenommen?
- Skip ohne soziale Rechtfertigung akzeptiert?
- private Karte bei Fokusverlust wirklich verdeckt?
- Fokus nach Reopen/Reload sinnvoll?
- doppelte Statistik?
- Timerrestzeit plausibel?

## 8. G2 – Mittlere Gruppe 5–8 Personen

### Spiele

- Zwei Wahrheiten, eine Lüge
- Question Imposter
- Location Spy
- optional Never Have / Would Rather

### Unterbrechungs-/Privacy-Test

Bei jedem privaten Mechanismus mindestens einmal:

1. geheimen Inhalt öffnen oder private Eingabe beginnen,
2. App/Tab in Hintergrund schicken,
3. zurückkehren,
4. prüfen, dass Inhalt verdeckt ist,
5. bewusst wieder öffnen,
6. zusätzlich Reload testen, wo Resume unterstützt wird.

### Beobachten

- Übergabe klar?
- sieht nächste Person versehentlich vorherigen geheimen Inhalt?
- Abstimmung/Auflösung verständlich?
- Regeln vor Start ausreichend?
- Spieltempo für 5–8 akzeptabel?
- manipulierte Test-Snapshots werden sicher verworfen?

## 9. G3 – Große Gruppe 9–12 Personen

### Word Imposter

- mehrere Imposter
- komplette Reveal-Kette
- Diskussion
- geheime Abstimmung
- mögliche Stichwahl
- Imposter-Ratechance
- individueller Punktestand

Zusätzlich mindestens 20 reale Runden über mehrere Tests protokollieren:

- erste Reveal-Person
- Imposterposition(en)
- keine systematische Kopplung zwischen Reveal-Reihenfolge und Rolle

### Paranoia

- mehrere Runden
- Freiwilligkeit/Skip beobachten
- offene Geheimfrage bei Appwechsel verdecken
- soziale Wirkung beobachten

### Timer-Spiel

Mindestens Scharade oder Tabu mit echter Geräteweitergabe sowie Heiße Kartoffel.

### Messen/beobachten

- Wartegefühl
- Verwirrung bei Reihenfolge
- falsche Geräteweitergabe
- Text/Buttons aus Gruppendistanz lesbar
- Übergaben praktisch
- keine unbeabsichtigte Geheimnisoffenlegung

## 10. G4 – Mafia

Gruppengrößen soweit praktisch: 6, 8, 12 und 16+.

### Varianten

- Schnell
- Klassisch
- Erweitert

### Prüfen

- Mafiaanzahl skaliert korrekt
- private Rollen
- geschützte Moderatoransicht
- Moderatorübersicht nach Appwechsel verdeckt
- Nachtformular bei Appwechsel verdeckt
- Arztaktion
- Detektivaktion und private Moderatorinformation
- Beschützeraktion
- Beschützer kann dieselbe Person nicht zwei Nächte in Folge schützen
- Eliminationszustand korrekt
- Dorf gewinnt nur bei 0 lebenden Mafia
- Mafia gewinnt nur bei Mafia >= restlicher Dorfseite
- manipulierte Rollen-/Alive-/Winner-Snapshots werden verworfen

### Produktfragen

- braucht Moderator zusätzliche Hilfe?
- dauert Nachtphase zu lange?
- sind Rollenbegriffe verständlich?
- wirkt `teen` angemessen?

## 11. G5 – Creator mit unerfahrener Person

Die Testperson bekommt vorher keine Erklärung des Wizards.

Aufgabe:

> Erstelle ein eigenes Partyspiel mit mindestens zwei Packs und spiele danach eine kurze Runde damit.

Prüfen:

- Vorlage selbst gefunden
- Pack hinzufügen verständlich
- Kartenformat verständlich
- Vorschau hilfreich
- Speichern erfolgreich
- eigenes Spiel im Hub gefunden
- Start erfolgreich
- Editieren/Kopieren/Löschen verstanden
- Export/Import mit neutralem Testspiel

Abbruchkriterium: Wenn ohne Entwicklerhilfe kein valides erstes Spiel erstellt werden kann, ist Creator für den RC noch nicht ausreichend selbsterklärend.

## 12. Smart Party Night – PN1 bis PN3

Drei vollständige Abende:

### PN1

- kleine/mittlere Gruppe
- ca. 30 Minuten
- lustig/friendly

### PN2

- mittlere Gruppe
- ca. 45–60 Minuten
- gemischt/competitive

### PN3

- große Gruppe
- ca. 60–90 Minuten
- gemischte Core-Auswahl

Prüfen:

- Gruppengröße passt
- keine unpassenden Wiederholungen
- Wechsel verständlich
- Dauer grob plausibel
- History-Synchronisierung
- Abbruch/Wechsel möglich

## 13. PWA-v44-Update-Test

Mindestens zwei echte ältere installierte Zustände gegen den finalen RC prüfen.

Pro Ausgangsversion:

1. Testspieler/Presets anlegen.
2. Creator-Spiel anlegen.
3. aktive Hub- oder Advanced-Session erzeugen.
4. alte installierte PWA starten.
5. neuen RC bereitstellen.
6. sichtbaren Updatehinweis prüfen.
7. Update zunächst verschieben.
8. laufende Session fortsetzen.
9. anschließend bewusst aktualisieren.
10. Offline-Neustart.
11. lokale Daten, Guards und Sessionzustände prüfen.
12. Cachebestand kontrollieren.

Keine alte Cachegeneration künstlich als getestet markieren, wenn sie nicht wirklich installiert war.

## 14. Rollback-Test

Auf HTTPS-Staging:

- RC bereitstellen
- definierten fehlerhaften Stand simulieren oder isolierten Rollbackpfad verwenden
- korrigierten Stand mit **neuer** Cachegeneration deployen
- lokales Datenmodell erhalten
- Offline-Core danach vollständig
- keine Force-Push-Annahme
- alter funktionierender Core darf nicht durch fehlgeschlagene Promotion zerstört werden

## 15. Accessibility-Realtest

### Tastatur

- Start → Spiele
- Suche
- Spieldetail öffnen/schließen
- mindestens ein Core-Spiel
- Advanced-Privatereveal
- Creator-Wizard
- Pause/Fortsetzen

### 200-%-Zoom / große Schrift

- kein Verlust primärer Aktionen
- Dialog scrollbar
- Sessioncontrols erreichbar
- kein zwingender horizontaler Scroll für Kernaufgabe
- 320-CSS-px-Reflow

### VoiceOver/TalkBack

Mindestens:

- Seitentitel/Überschrift
- Navigation
- Suche + Vorschläge
- Spieldialog
- private Reveal-Karte
- Privacy-Cover
- Pause/Fortsetzen
- Ergebnis

Private Inhalte dürfen nicht vor bewusster Reveal-Aktion angesagt werden.

## 16. Content-Beobachtung

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

## 17. Bug-Severity

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

## 18. Testbericht pro Session

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
Privacy-/Secret-Funde:
Was war unklar?
Was funktionierte besonders reibungslos?
Nächste Maßnahmen:
Retest nötig: ja/nein
```

Keine Namen der Teilnehmer sind für den Releasebericht erforderlich; Test-IDs reichen.

## 19. Beta-Freigaberegel

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
- [ ] mindestens ein realer Testnachweis pro Core-Spiel
- [ ] keine offenen Critical/High Bugs
- [ ] Core-Content-Funde triagiert
- [ ] Retests aller gefixten Critical/High-Funde abgeschlossen

Bis dahin bleibt Beta/Realgeräte **OPEN bzw. IN PROGRESS** und der öffentliche Release **NO_GO**.
