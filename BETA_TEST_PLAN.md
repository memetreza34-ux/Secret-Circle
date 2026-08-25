# Secret Circle – Beta-, Geräte- und Gruppentestplan

Stand: 25. August 2026  
Status: **PREPARED – reale Durchführung offen**  
Offline-Core: **`secret-circle-v49` / `secret-circle-v49-staging`**  
Core Source Hardening: **15/15 PREPARED**  
Accessibility Source Hardening: **PREPARED**  
Word-Imposter Data/Resume Hardening: **PREPARED**  
Hub Resume Integrity v2: **PREPARED**

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

Aktueller Blocker: Issue #7. Letzter vollständig untersuchter v49-App-Actions-Lauf **#2787** (Run ID `32871536761`, Job `97879489858`, Head `a9ad91389ff9e966af432b0a77103ddc0960709d`) endete vor Step 1 mit `steps: null` / `steps: []`; kein Repositorycode wurde ausgeführt. Der reine Bash-Runner-Probe zeigte dasselbe Muster.

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
- manipulierte Resume-/Importzustände werden nur mit neutralen Testdaten geprüft.
- Fokus-/Tastaturprobleme werden als funktionale Accessibility-Funde dokumentiert, nicht nur als Kosmetik.

## 4. Mindest-Testmatrix

| Session | Gruppe | Schwerpunkt | Mindestumfang |
|---|---:|---|---|
| G1 | 3–4 | kleine Party / Direkt-Hub | Word Imposter + mehrere Social-/Timer-Core-Games |
| G2 | 5–8 | mittlere Gruppe | Advanced + Smart Party Night |
| G3 | 9–12 | große Übergaben | Word Imposter, Paranoia, Scharade/Tabu |
| G4 | 6 / 8 / 12 / 16+ soweit praktisch | Mafia | Rollen-Skalierung, Klassisch + Erweitert |
| G5 | 1 unerfahrene Host-Person + Gruppe | Creator | eigenes Spiel ohne Entwicklerhilfe erstellen und spielen |
| DWI | neutraler Testdatensatz | Word-Imposter Datenvertrag | 50/51 Kategorien, 200/201 Begriffe, Backupgrenze |
| HR2 | neutraler Testdatensatz | Hub Resume Guard v2 | gültiger Resume + gekreuzter Timer + stale Resume UI |
| PN1–PN3 | variabel | Smart Party Night | drei vollständige geplante Abende |

## 5. Geräte-Mindestmatrix

### D1 – Android

- aktuelles reales Android-Smartphone + Chrome
- Browser-Tab und installierte PWA
- Hoch-/Querformat
- Offline-Neustart
- Hintergrund/Appwechsel und Sperrbildschirm bei Timer
- TalkBack-Smoke

### D2 – iPhone

- reales iPhone + Safari
- Add-to-Home-Screen-PWA
- Safe Areas / Bildschirmtastatur
- Hintergrund/Appwechsel und Sperrbildschirm
- VoiceOver-Smoke

### D3 – Tablet/iPad

- reale Tabletklasse
- Katalog, private Übergabe, Timer, Advanced, Quick und Creator
- Quer-/Hochformat

### D4 – Desktop

- Hauptnavigation/Katalog/Core/Advanced/Quick/Creator ohne Maus
- 200-%-Zoom
- Chromium plus mindestens ein weiterer Browser
- alle modalen Overlays mit Tab/Shift+Tab prüfen

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

Nicht mit einer unbekannten oder während des Tests wechselnden Version arbeiten.

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

Beobachten: Setupverständnis, Speichern vs. Verwerfen, Freiwilligkeit, private Karten, Fokus nach Reopen/Reload, doppelte Statistik, Timerrestzeit.

## 8. G2 – Mittlere Gruppe 5–8 Personen

Spiele:

- Zwei Wahrheiten, eine Lüge
- Question Imposter
- Location Spy
- optional Never Have / Would Rather

Bei jedem privaten Mechanismus mindestens einmal App-/Tab-Wechsel, bewusstes Wiederöffnen und – wo unterstützt – Reload testen. Manipulierte neutrale Advanced-Snapshots müssen verworfen werden.

Zusätzlich historischer **v47-A11y-Vertrag auf dem aktuellen v49-RC**:

- Advanced-Spiel starten: Setup-Hintergrund darf per Tastatur nicht erreichbar sein.
- Tab/Shift+Tab bleibt im aktiven Advanced-Spiel.
- Nach Phasenwechsel bleibt ein sinnvoller Fokuspunkt vorhanden.

## 9. G3 – Große Gruppe 9–12 Personen

### Word Imposter

- mehrere Imposter
- komplette Reveal-Kette
- Diskussion
- geheime Abstimmung
- mögliche Stichwahl
- Imposter-Ratechance
- individueller Punktestand
- mindestens 20 reale Runden für Reveal-/Rollenfairness protokollieren
- partielle **sequenzielle** Abstimmung speichern/reloaden und mit dem nächsten offenen Wähler fortsetzen
- manipulierten nicht-sequenziellen Voting-Snapshot sicher verwerfen

### Paranoia / Timer-Spiele

- Freiwilligkeit/Skip
- Geheimfrage bei Appwechsel verdecken
- Scharade/Tabu sowie Heiße Kartoffel mit echter Geräteweitergabe

## 10. DWI – Word-Imposter-Datengrenzen

Der Vertrag wurde in v48 eingeführt und wird auf dem aktuellen v49-RC real bestätigt.

Mit neutralen Testdaten auf demselben RC:

1. 50 eigene Kategorien importieren/speichern → akzeptiert.
2. 51 Kategorien importieren → vollständig abgelehnt, nicht auf 50 gekürzt.
3. Vorher gespeicherte Kategorien nach Ablehnung erneut prüfen → unverändert.
4. Kategorie mit 200 eindeutigen Begriffen → akzeptiert.
5. Kategorie mit 201 Begriffen → abgelehnt.
6. sichtbare UI-Hinweise „bis zu 50“ und „2–200“ prüfen.
7. valide Sicherung unterhalb der Größenobergrenze importieren.
8. Sicherung über **1,5 MB UTF-8** ablehnen.
9. Multibyte-Testdatei verwenden, bei der Zeichenanzahl kleiner, Bytegröße aber größer als das Limit ist.
10. übergroßen/manipulierten lokalen Custom-State simulieren → fail-safe verwerfen und verständliche Warnung zeigen.

Ein abgelehnter Import darf **keine vorherigen lokalen Daten verändern**.

## 11. HR2 – Hub Resume Guard v2

Mit neutralen lokalen Testzuständen auf demselben v49-RC:

1. gültige normale Hub-Session speichern → Resume bleibt verfügbar.
2. gültigen laufenden Scharade-Timer speichern → Resume bleibt verfügbar.
3. Wahrheit-oder-Pflicht-Snapshot mit eingeschleustem Scharade-Timer erzeugen → Snapshot wird verworfen.
4. Scharade-Snapshot mit Tabu-Timer erzeugen → Snapshot wird verworfen.
5. laufenden Timer mit `remainingMs = 0` erzeugen → Snapshot wird verworfen.
6. bereits gerenderte „Session fortsetzen“-Karte vorhanden lassen und anschließend einen ungültigen Snapshot erkennen lassen → Resume-Karte verschwindet ebenfalls.
7. Statusmeldung zum sicheren Verwerfen sichtbar und verständlich prüfen.
8. gültige Session nach Guard-Ausführung erneut prüfen → keine Mutation, kein unbeabsichtigtes Entfernen.
9. dasselbe offline in der installierten PWA wiederholen.

Der Browser muss hierbei dieselbe Logik nutzen wie `tests/party-hub-resume-guard.test.js`; keine zweite abweichende Timer-Validierung darf aktiv sein.

## 12. G4 – Mafia

Gruppengrößen soweit praktisch: 6, 8, 12 und 16+.

Prüfen: Rollenanzahl, Packs, private Rollen, Moderatoransicht, Nachtinformationen, Arzt/Detektiv/Beschützer, Eliminationszustand, Dorf-/Mafia-Sieg und manipulierte Resume-Zustände.

## 13. G5 – Creator mit unerfahrener Person

Aufgabe:

> Erstelle ein eigenes Partyspiel mit mindestens zwei Packs und spiele danach eine kurze Runde damit.

Prüfen:

- Vorlage selbst gefunden
- Template-Radiogroup nur mit Tab + Pfeiltasten/Home/End bedienbar
- Schrittwechsel fokussiert die neue Überschrift sinnvoll
- Hilfe öffnen: Hintergrund nicht per Tastatur erreichbar
- Hilfe: Tab/Shift+Tab bleibt im Dialog
- Hilfe schließen: Fokus kehrt zum Hilfe-Auslöser zurück
- Pack/Kartenformat verstanden
- Vorschau hilfreich
- Speichern erfolgreich
- eigenes Spiel im Hub gefunden
- Editieren/Kopieren/Löschen verstanden
- Export/Import mit neutralem Testspiel

Wenn ohne Entwicklerhilfe kein valides erstes Spiel erstellt werden kann, ist Creator noch nicht RC-bereit.

## 14. Smart Party Night – PN1 bis PN3

- PN1: kleine/mittlere Gruppe, ca. 30 Minuten, lustig/friendly
- PN2: mittlere Gruppe, ca. 45–60 Minuten, gemischt/competitive
- PN3: große Gruppe, ca. 60–90 Minuten, gemischte Core-Auswahl

Prüfen: Gruppengröße, Wiederholungen, Wechsel, Dauer, History-Synchronisierung und Abbruch/Wechsel.

## 15. PWA-v49-Update-Test

Mindestens zwei echte ältere installierte Zustände gegen den finalen RC prüfen.

1. Testspieler/Presets anlegen.
2. Word-Imposter-Custom-Kategorie und Creator-Spiel anlegen.
3. aktive Hub- oder Advanced-Session erzeugen.
4. alte installierte PWA starten.
5. v49/RC bereitstellen.
6. Updatehinweis prüfen und zunächst verschieben.
7. laufende Session fortsetzen.
8. bewusst aktualisieren.
9. Offline-Neustart.
10. lokale Daten, Resume-/Privacy-/A11y-Guards und Sessions prüfen.
11. `party-hub-a11y.js` und `secondary-surface-a11y.js` offline praktisch prüfen.
12. Word-Imposter-Datenlimits/Voting-Resume und Hub-Resume-v2 offline prüfen.
13. Cachebestand kontrollieren.

Keine alte Cachegeneration künstlich als getestet markieren.

## 16. Rollback-Test

Auf HTTPS-Staging:

- RC bereitstellen
- definierten fehlerhaften Stand simulieren oder isolierten Rollbackpfad verwenden
- korrigierten Stand mit **neuer** Cachegeneration deployen
- lokales Datenmodell erhalten
- Offline-Core vollständig
- keine Force-Push-Annahme
- alter funktionierender Core darf nicht durch fehlgeschlagene Promotion zerstört werden

## 17. Accessibility-Realtest

### Hub

- Erstladen: Skip-Link erster sinnvoller Tastaturtarget
- Bereichswechsel fokussieren neue Hauptüberschrift
- Spieldetail und aktive Runde halten Fokus im Modal
- Schließen stellt Rückkehrfokus her

### Advanced

- Start öffnet modalen Spielkontext
- Setup/Skip-Link während Spiel nicht bedienbar
- Tab/Shift+Tab bleibt im Overlay
- private Reveal-/Privacy-Cover mit Screenreader

### Quick

- Start/Resume
- nach einer Aktion, die das DOM ersetzt, Fokus auf neuer sinnvoller Aktion/Control
- Spektrum-Tipp: nach „Ziel verbergen“ Range-Regler direkt sinnvoll erreichbar
- Pause/Skip/Result per Tastatur

### Creator

- Wizard-Schrittwechsel fokussiert neue `h3`
- Template-Radiogroup: genau ein Tab-Stopp; Pfeile/Home/End
- Hilfe modal, Hintergrund `inert`, Fokus-Trap, Rückkehrfokus
- komplettes erstes Spiel ohne Maus

### Geräte/A11y allgemein

- 200-%-Zoom / große Schrift / 320 CSS px
- VoiceOver und TalkBack
- Reduced Motion
- Touchziele
- keine wichtige Information nur über Farbe

Private Inhalte dürfen nicht vor bewusster Reveal-Aktion angesagt werden.

## 18. Content-Beobachtung

Pro Core-Game notieren: unklare/ähnliche/zu lange Karte, unangenehmer Eindruck, Altersstufe, packfremder Inhalt, Schwierigkeit, Wiederholungsgefühl.

## 19. Bug-Severity

### Critical

- Datenverlust ohne Recovery
- private Informationen unerwartet offengelegt
- weitreichender Securityfehler
- App für Hauptzielgruppe nicht nutzbar

### High

- Core-Spiel nicht abschließbar
- falscher Sieger/Score mit Produktwirkung
- Resume/Timer systematisch kaputt
- Import überschreibt Daten trotz Ablehnung
- wichtiger Accessibilityflow blockiert
- Tastaturfokus kann ein modales Spiel-/Hilfefenster nicht sinnvoll bedienen

### Medium / Low

Workaround-fähige UX-/Content-/Layoutfehler bzw. kosmetische Funde.

## 20. Testbericht pro Session

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
Data-/Import-Funde:
Was war unklar?
Nächste Maßnahmen:
Retest nötig: ja/nein
```

Keine Namen der Teilnehmer sind für den Releasebericht erforderlich; Test-IDs reichen.

## 21. Beta-Freigaberegel

Vor `REAL USER / DEVICE PASS`:

- [ ] G1–G5 abgeschlossen
- [ ] DWI-Datengrenzen auf dem v49-RC abgeschlossen
- [ ] HR2 Hub-Resume-v2 abgeschlossen
- [ ] PN1–PN3 abgeschlossen
- [ ] reales Android / iPhone / Tablet abgeschlossen
- [ ] VoiceOver / TalkBack / 200-%-Zoom abgeschlossen
- [ ] Hub-/Advanced-/Creator-Modalfokus real bestanden
- [ ] Quick-Phasen-Fokus-Recovery real bestanden
- [ ] Creator-Radiogroup und Wizard-Fokus real bestanden
- [ ] zwei echte PWA-Upgrades auf v49/RC abgeschlossen
- [ ] HTTPS-Rollbackprobe abgeschlossen
- [ ] mindestens ein realer Testnachweis pro Core-Spiel
- [ ] keine offenen Critical/High Bugs
- [ ] Retests aller gefixten Critical/High-Funde abgeschlossen

Bis dahin bleibt Beta/Realgeräte **OPEN bzw. IN PROGRESS** und der öffentliche Release **NO_GO**.