# Secret Circle – Fan-, Marken- und Referenzcontent-Review

Stand: 16. August 2026  
Status: **IN PROGRESS – Option B für Anime-Quiz umgesetzt; restlicher Extended/Labs-Pass offen**

## 1. Zweck

Dieses Dokument trennt generischen Partycontent von konkreten fremden Namen, Marken und Fanreferenzen. Es ist ein redaktionelles/releasebezogenes Inventar und keine juristische Freigabe.

Grundregel: Wenn eine konkrete Fremdreferenz keinen zwingenden Produktnutzen hat, wird sie vor Production generisch formuliert oder aus dem finalen Runtime-Pfad entfernt.

## 2. Core – Word Imposter

Am 16. August 2026 wurden drei nicht benötigte konkrete Begriffe in `word-packs.js` generisch ersetzt:

| vorher | jetzt | Grund |
|---|---|---|
| `Bluetooth` | `Funkverbindung` | konkreter Markenname für Mechanik unnötig |
| `Oscar` | `Filmpreis` | konkreter Awardname für Mechanik unnötig |
| `Formel 1` | `Motorsport` | konkrete Wettbewerbsbezeichnung für Mechanik unnötig |

Die 14 Word-Imposter-Kategorien bleiben mit 12 Einträgen je Kategorie unverändert tief. `tests/core-content-quality.test.js` schützt die drei Ersetzungen.

## 3. `who-am-i`

Das Pack `Anime-Archetypen` verwendet generische Rollenbeschreibungen statt konkreter Figuren. Andere Packs enthalten generische Berufe/Tiere sowie historische, mythologische oder allgemein bekannte Namen.

Keine bekannten Charakterbilder, Logos, Screenshots oder Zitate sind für diesen Modus vorgesehen.

## 4. Früherer `anime-guess`-Befund

Der Labs-Modus enthielt ursprünglich 40 konkrete bekannte Figuren-/Franchisereferenzen in vier Packs.

Beispiele aus dem früheren Basisinhalt waren unter anderem Son Goku, Naruto Uzumaki, Pikachu und Totoro. Diese Liste wurde inventarisiert, bevor eine Releaseentscheidung getroffen wurde.

## 5. Entscheidung: Option B umgesetzt

Für den finalen Runtime-Pfad wurde **Option B – komplett generisch machen** gewählt.

Die stabile technische Spiel-ID bleibt:

`anime-guess`

Der sichtbare Modus heißt jetzt:

**Anime-Archetypen erraten**

Gruppe:

**Anime-Quiz**

Vier finale Packs:

1. Action & Abenteuer
2. Magie & Mystery
3. Fantasy & Alltag
4. Sport & Games

Jedes Pack enthält 10 eigenständige Archetypen, insgesamt 40.

Beispiele:

- Ehrgeiziger Kampfkunst-Schüler
- Optimistische Abenteuerkapitänin
- Fluchjägerin
- Zeitreisende Detektivin
- Prinzessin auf geheimer Reise
- Roboterpilot wider Willen
- Volleyball-Springer
- Rennfahrerin mit Nerven aus Stahl

## 6. Technische Umsetzung

`party-core-classic-content.js` ist als finale Built-in-Redaktionsschicht auf Version 2 angehoben.

Sie:

- behält die stabile ID `anime-guess`
- überschreibt Titel, Gruppe, Beschreibung, Regeln und Packnamen
- ersetzt den finalen `anime-guess`-Content vollständig durch 40 generische Archetypen
- liefert `referenceSafeGameIds`
- dokumentiert `referenceSafeRemovedConcreteNames: 40`

Damit können gespeicherte/routbare IDs stabil bleiben, während der sichtbare öffentliche Runtime-Content reference-safe wird.

## 7. Regression

`tests/core-content-quality.test.js` prüft:

- sichtbarer Titel `Anime-Archetypen erraten`
- vier erwartete Packnamen
- 10 Archetypen pro Pack
- insgesamt 40 Einträge
- keine der 40 früher inventarisierten konkreten Figuren im finalen Runtime-Content

`scripts/core_content_audit.py` prüft zusätzlich die Reference-Safe-Metadaten und den Testvertrag.

Status dieser Teilentscheidung: **CLOSED IN CODE / RUNNER VERIFICATION OPEN**.

## 8. Visuelle Fancontent-Regeln

Weiterhin verbindlich:

- keine bekannten Charaktere nachzeichnen
- keine Markenlogos
- keine Szenen/Panels/Screenshots
- keine fremden Audio-/Videodateien
- visuelle Anime-Begleitung nur über eigenständige generische Archetypen
- ein generiertes Bild darf nicht gezielt wie eine konkrete bekannte Figur aussehen

## 9. Restlicher Extended-/Labs-Pass

Noch offen ist der vollständige finale Quellpass auf vermeidbare konkrete:

- Plattformnamen
- Produkt-/Markennamen
- Wettbewerbs-/Awardnamen
- Film-/Musik-/Game-Franchisen
- geschützte Figuren
- fremde Slogans/Zitate

Bisher inspizierte Trending-/Viral-Pfade verwenden überwiegend generische Kategorien und selbst formulierte Situationen.

## 10. Release-Gates

Vor `FAN / REFERENCE CONTENT PASS`:

- [x] Word-Imposter-Core auf unnötige konkrete Referenzen geprüft
- [x] drei Core-Begriffe generisch ersetzt
- [x] konkrete frühere `anime-guess`-Figuren inventarisiert
- [x] **Option B** für `anime-guess` entschieden
- [x] 40 konkrete Figuren aus dem finalen Runtime-Katalog entfernt
- [x] Reference-Safe-Regressionstest vorbereitet
- [ ] übrige Extended/Labs final auf vermeidbare Marken-/Franchisereferenzen durchgesehen
- [ ] keine fremden Bilder/Logos/Screenshots/Audios/Videos im finalen Build bestätigt
- [ ] Marketingtexte auf keine offizielle Partnerschaft/Irreführung geprüft
- [ ] `THIRD_PARTY_NOTICES.md` und `LEGAL_CHECKLIST.md` final synchronisiert
- [ ] Tests auf funktionierendem Runner tatsächlich ausgeführt

Bis diese Restpunkte geschlossen sind, bleibt R-011 **OFFEN** und der öffentliche Release **NO_GO**.
