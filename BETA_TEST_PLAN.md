# Secret Circle – Beta-, Geräte- und Gruppentestplan

Stand: 25. August 2026  
Status: **PREPARED – reale Durchführung offen**  
Offline-Core: **`secret-circle-v46` / `secret-circle-v46-staging`**  
Core Source Hardening: **15/15 PREPARED**  
Accessibility Source Hardening: **PREPARED**

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

Aktueller Blocker: Issue #7. Auch Run #2575 und ein reiner Bash-Runner-Probe endeten vor Step 1 mit `steps: []`.

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
- Fokus-/Tastaturprobleme werden als funktionale Accessibility-Funde dokumentiert, nicht nur als Kosmetik.

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
- Detail- und Spieloverlay vollständig per Tab/Shift+Tab prüfen

## 6. Preflight vor jeder Beta

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

Beobachten:

- Setup ohne Entwicklerhilfe verstanden?
- Unterschied Speichern vs. Verwerfen verstanden?
- Freiwilligkeitsregel wahrgenommen?
- private Karte bei Fokusverlust wirklich verdeckt?
- Fokus nach Reopen/Reload sinnvoll?
- doppelte Statistik?
- Timerrestzeit plausibel?

## 8. G2 – Mittlere Gruppe 5–8 Personen

Spiele:

- Zwei Wahrheiten, eine Lüge
- Question Imposter
- Location Spy
- optional Never Have / Would Rather

Bei jedem privaten Mechanismus mindestens einmal:

1. geheimen Inhalt öffnen oder private Eingabe beginnen,
2. App/Tab in Hintergrund schicken,
3. zurückkehren,
4. prüfen, dass Inhalt verdeckt ist,
5. bewusst wieder öffnen,
6. zusätzlich Reload testen, wo Resume unterstützt wird.

Zusätzlich manipulierte neutrale Test-Snapshots prüfen: inkonsistente Advanced-Zustände müssen verworfen werden.

## 9. G3 – Große Gruppe 9–12 Personen

### Word Imposter

- mehrere Imposter
- komplette Reveal-Kette
- Diskussion
- geheime Abstimmung
- mögliche Stichwahl
- Imposter-Ratechance
- individueller Punktestand

Mindestens 20 reale Runden über mehrere Tests protokollieren:

- erste Reveal-Person
- Imposterposition(en)
- keine systematische Kopplung zwischen Reveal-Reihenfolge und Rolle

### Paranoia

- mehrere Runden
- Freiwilligkeit/Skip beobachten
- offene Geheimfrage bei Appwechsel verdecken
- soziale Wirkung beobachten

### Timer-Spiele

Mindestens Scharade oder Tabu sowie Heiße Kartoffel mit echter Geräteweitergabe.

## 10. G4 – Mafia

Gruppengrößen soweit praktisch: 6, 8, 12 und 16+.

Prüfen:

- Mafiaanzahl skaliert korrekt
- Schnell/Klassisch/Erweitert korrekt
- Rollen privat
- Moderatoransicht geschützt
- Appwechsel verdeckt Moderator-/Nachtinformationen
- Arzt/Detektiv/Beschützer korrekt
- Beschützer nicht dieselbe Person zwei Nächte nacheinander
- Eliminationszustand korrekt
- Dorf gewinnt nur bei 0 lebenden Mafia
- Mafia gewinnt nur bei Mafia >= restlicher Dorfseite
- manipulierte Rollen-/Alive-/Winner-Snapshots werden verworfen

## 11. G5 – Creator mit unerfahrener Person

Aufgabe:

> Erstelle ein eigenes Partyspiel mit mindestens zwei Packs und spiele danach eine kurze Runde damit.

Prüfen:

- Vorlage selbst gefunden
- Pack/Kartenformat verstanden
- Vorschau hilfreich
- Speichern erfolgreich
- eigenes Spiel im Hub gefunden
- Editieren/Kopieren/Löschen verstanden
- Export/Import mit neutralem Testspiel

Wenn ohne Entwicklerhilfe kein valides erstes Spiel erstellt werden kann, ist Creator noch nicht RC-bereit.

## 12. Smart Party Night – PN1 bis PN3

- PN1: kleine/mittlere Gruppe, ca. 30 Minuten, lustig/friendly
- PN2: mittlere Gruppe, ca. 45–60 Minuten, gemischt/competitive
- PN3: große Gruppe, ca. 60–90 Minuten, gemischte Core-Auswahl

Prüfen:

- Gruppengröße passt
- keine unpassenden Wiederholungen
- Wechsel verständlich
- Dauer grob plausibel
- History-Synchronisierung
- Abbruch/Wechsel möglich

## 13. PWA-v46-Update-Test

Mindestens zwei echte ältere installierte Zustände gegen den finalen RC prüfen.

1. Testspieler/Presets anlegen.
2. Creator-Spiel anlegen.
3. aktive Hub- oder Advanced-Session erzeugen.
4. alte installierte PWA starten.
5. v46/RC bereitstellen.
6. Updatehinweis prüfen.
7. Update zunächst verschieben.
8. laufende Session fortsetzen.
9. bewusst aktualisieren.
10. Offline-Neustart.
11. lokale Daten, Resume-/Privacy-/A11y-Guards und Sessions prüfen.
12. `party-hub-a11y.js` im Offlinebetrieb praktisch prüfen.
13. Cachebestand kontrollieren.

Keine alte Cachegeneration künstlich als getestet markieren.

## 14. Rollback-Test

Auf HTTPS-Staging:

- RC bereitstellen
- definierten fehlerhaften Stand simulieren oder isolierten Rollbackpfad verwenden
- korrigierten Stand mit **neuer** Cachegeneration deployen
- lokales Datenmodell erhalten
- Offline-Core vollständig
- keine Force-Push-Annahme
- alter funktionierender Core darf nicht durch fehlgeschlagene Promotion zerstört werden

## 15. Accessibility-Realtest

### Tastatur / Fokus

- Erstladen: Skip-Link bleibt erster sinnvoller Tastaturtarget
- Start → Spiele: sichtbare Hauptüberschrift erhält sinnvollen Fokus
- Spiele → Spieler/Favoriten/Verlauf/Daten: neuer Bereich wird verständlich angekündigt/fokussiert
- Suche vollständig per Tastatur
- Spieldetail öffnen: Fokus im Dialog
- Spieldetail: Tab und Shift+Tab verlassen das Modal nicht in Richtung Hintergrund
- Spieldetail schließen: Fokus kehrt zum auslösenden Spiel zurück
- aktive Hub-Spielrunde: Hintergrund bleibt nicht bedienbar
- aktive Hub-Spielrunde: Tab/Shift+Tab bleiben im Spieloverlay
- mindestens ein Core-Spiel vollständig per Tastatur
- Advanced-Privatereveal
- Creator
- Pause/Fortsetzen

### 200-%-Zoom / große Schrift

- kein Verlust primärer Aktionen
- Dialog scrollbar
- Sessioncontrols erreichbar
- kein zwingender horizontaler Scroll
- 320-CSS-px-Reflow

### VoiceOver/TalkBack

- Seitentitel/Überschrift
- Navigation
- Bereichswechsel
- Suche + Vorschläge
- Spieldialog als modal verständlich
- aktive Spielrunde als modal verständlich
- Hintergrund während Modal nicht störend erreichbar
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
- Tastaturfokus kann ein modales Core-Overlay nicht sinnvoll bedienen

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
- [ ] Tastatur-/Modalfokus-v46-Abnahme abgeschlossen
- [ ] zwei echte PWA-Upgrades auf v46/RC abgeschlossen
- [ ] HTTPS-Rollbackprobe abgeschlossen
- [ ] mindestens ein realer Testnachweis pro Core-Spiel
- [ ] keine offenen Critical/High Bugs
- [ ] Core-Content-Funde triagiert
- [ ] Retests aller gefixten Critical/High-Funde abgeschlossen

Bis dahin bleibt Beta/Realgeräte **OPEN bzw. IN PROGRESS** und der öffentliche Release **NO_GO**.
