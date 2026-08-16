# Secret Circle – Fan-, Marken- und Referenzcontent-Review

Stand: 16. August 2026  
Status: **IN PROGRESS – Core/Anime/Viral bereinigt; restlicher Extended/Labs-Pass offen**

## 1. Zweck

Dieses Dokument trennt generischen Partycontent von konkreten fremden Namen, Marken und Fanreferenzen. Es ist ein redaktionelles/releasebezogenes Inventar und keine juristische Freigabe.

Grundregel: Wenn eine konkrete Fremdreferenz keinen zwingenden Produktnutzen hat, wird sie vor Production generisch formuliert oder aus dem finalen Runtime-Pfad entfernt.

## 2. Word Imposter – v36

| vorher | jetzt | Grund |
|---|---|---|
| `Bluetooth` | `Funkverbindung` | konkreter Markenname unnötig |
| `Oscar` | `Filmpreis` | konkreter Awardname unnötig |
| `Formel 1` | `Motorsport` | konkrete Wettbewerbsbezeichnung unnötig |

Die 14 Kategorien mit je 12 Einträgen bleiben erhalten. Der Test schützt die Ersetzungen.

## 3. `who-am-i`

Das Pack `Anime-Archetypen` verwendet generische Rollenbeschreibungen statt konkreter Figuren. Andere Packs enthalten generische Berufe/Tiere sowie historische, mythologische oder allgemein bekannte Namen.

Historische Personen werden nicht automatisch wie aktuelle Marken-/Franchisereferenzen behandelt. Keine bekannten Charakterbilder, Logos, Screenshots oder Zitate sind für diesen Modus vorgesehen.

## 4. `anime-guess` – v37

Der Labs-Modus enthielt im tieferen Basiscontent ursprünglich 40 konkrete bekannte Figuren-/Franchisereferenzen. Diese wurden vor der Releaseentscheidung inventarisiert.

Für den **finalen Runtime-Pfad** wurde Option B gewählt: komplett generisch.

Stabile ID: `anime-guess`  
Finaler Titel: **Anime-Archetypen erraten**  
Gruppe: **Anime-Quiz**

Finale Packs:

1. Action & Abenteuer
2. Magie & Mystery
3. Fantasy & Alltag
4. Sport & Games

Jedes Pack enthält 10 eigenständige Archetypen, insgesamt 40.

`party-core-classic-content.js` Version 2 überschreibt dafür Titel, Beschreibung, Regeln, Packs und Content. `tests/core-content-quality.test.js` enumeriert die 40 früheren Namen und verlangt ihre Abwesenheit im finalen Runtime-Content.

Status: **CLOSED IN CODE / RUNNER VERIFICATION OPEN**.

### Source-Distribution-Hinweis

Die tiefer liegende Datei `party-mega-catalog.js` enthält den historischen Basisblock weiterhin, obwohl er im finalen Runtime-Pfad überschrieben wird. Für die ausgelieferte App ist die finale Route reference-safe. Falls der Quellcode später öffentlich verteilt wird, muss vor dieser Quellcodeveröffentlichung zusätzlich entschieden werden, ob auch der historische Basisblock vollständig bereinigt werden soll.

## 5. Viral `higher-lower` – v38

Im Sportpack wurden drei unnötig konkrete Event-/Award-nahe Formulierungen ersetzt, ohne die Zahlenlogik zu verändern:

| vorher | jetzt | Wert |
|---|---|---:|
| Ringe im olympischen Symbol | Ecken eines Fünfecks | 5 |
| Bahnen eines olympischen 400-Meter-Stadions häufig | Bahnen einer typischen 400-Meter-Leichtathletikanlage | 8 |
| Sätze zum Sieg im Herren-Grand-Slam-Tennis | Gewinnsätze in einem Best-of-five-Tennismatch | 3 |

`tests/party-viral-catalog.test.js` verlangt die neuen Einträge und blockiert die alten Formulierungen.

Status: **CLOSED IN CODE / RUNNER VERIFICATION OPEN**.

## 6. Visuelle Fancontent-Regeln

Weiterhin verbindlich:

- keine bekannten Charaktere nachzeichnen
- keine Markenlogos
- keine Szenen/Panels/Screenshots
- keine fremden Audio-/Videodateien
- visuelle Anime-Begleitung nur über eigenständige generische Archetypen
- ein generiertes Bild darf nicht gezielt wie eine konkrete bekannte Figur aussehen

## 7. Restlicher Extended-/Labs-Pass

Noch offen ist der finale Quellpass auf vermeidbare konkrete:

- Plattformnamen
- Produkt-/Markennamen
- Wettbewerbs-/Awardnamen
- Film-/Musik-/Game-Franchisen
- geschützte Figuren
- fremde Slogans/Zitate

Aktuell direkt inspizierte Mega-/Viral-Pfade verwenden außerhalb des historisch überschriebenen Anime-Basisblocks überwiegend generische Kategorien, historische Personen und selbst formulierte Situationen. GitHub-Code-Suche allein gilt wegen Branch-/Indexgrenzen nicht als Freigabenachweis; maßgeblich bleibt die direkte Prüfung der Working-Branch-Dateien und des finalen Routingpfads.

## 8. Release-Gates

Vor `FAN / REFERENCE CONTENT PASS`:

- [x] Word-Imposter-Core auf unnötige konkrete Referenzen geprüft
- [x] drei Core-Begriffe generisch ersetzt
- [x] konkrete frühere `anime-guess`-Figuren inventarisiert
- [x] Option B für `anime-guess` umgesetzt
- [x] 40 konkrete Figuren aus dem finalen Runtime-Katalog entfernt
- [x] Viral-Sportreferenzen aus v38 generisch ersetzt
- [x] Regressionstests für diese Änderungen vorbereitet
- [ ] übrige Extended/Labs final direkt auf vermeidbare Marken-/Franchisereferenzen durchgesehen
- [ ] keine fremden Bilder/Logos/Screenshots/Audios/Videos im finalen Build bestätigt
- [ ] Marketingtexte auf keine offizielle Partnerschaft/Irreführung geprüft
- [ ] Source-Distribution-Entscheidung für historischen Anime-Basisblock getroffen, falls Repo öffentlich wird
- [ ] `THIRD_PARTY_NOTICES.md` und `LEGAL_CHECKLIST.md` final synchronisiert
- [ ] Tests auf funktionierendem Runner tatsächlich ausgeführt

Bis diese Restpunkte geschlossen sind, bleibt R-011 **OFFEN** und der öffentliche Release **NO_GO**.
