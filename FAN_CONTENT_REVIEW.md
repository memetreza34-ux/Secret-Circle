# Secret Circle – Fan-, Marken- und Referenzcontent-Review

Stand: 16. August 2026  
Status: **IN PROGRESS – konkrete Anime-Fanreferenzen vor Production entscheiden**

## 1. Zweck

Dieses Dokument trennt generischen Partycontent von konkreten fremden Namen, Marken und Fanreferenzen. Es ist ein redaktionelles/releasebezogenes Inventar und keine juristische Freigabe.

Vor öffentlicher Veröffentlichung muss für konkrete Fanreferenzen bewusst entschieden werden:

1. nach Rechtsprüfung als textbasierten inoffiziellen Fancontent beibehalten,
2. durch eigenständige generische Archetypen ersetzen,
3. oder den betreffenden Modus aus dem öffentlichen Build entfernen.

„Labs“ allein beseitigt keine Rechtefrage, wenn der Modus öffentlich ausgeliefert wird.

## 2. Core – Word Imposter

Der Core soll möglichst ohne unnötige Markenreferenzen auskommen.

Am 16. August 2026 wurden drei nicht benötigte konkrete Begriffe aus `word-packs.js` generisch ersetzt:

| vorher | jetzt | Grund |
|---|---|---|
| `Bluetooth` | `Funkverbindung` | Markenname für Mechanik unnötig |
| `Oscar` | `Filmpreis` | konkreter Awardname für Mechanik unnötig |
| `Formel 1` | `Motorsport` | konkrete Bezeichnung für Mechanik unnötig |

Die 14 Word-Imposter-Kategorien bleiben mit 12 Einträgen je Kategorie unverändert tief.

Aktueller Core-Befund:

- Anime-Pack verwendet generische Begriffe wie Manga, Ninja, Mecha, Sensei und Schwertkämpfer
- Gaming-Pack verwendet generische Mechanikbegriffe
- Filme/Serien verwendet generische Filmbegriffe
- keine konkrete Franchise-Figur im Word-Imposter-Core

Status: **PREPARED – finaler Rechte-/Content-Sign-off bleibt Releasegate**.

## 3. `who-am-i`

Das Pack `Anime-Archetypen` verwendet bewusst generische Rollenbeschreibungen statt konkreter Figuren, zum Beispiel:

- Ninja-Schüler mit geheimem Spezialangriff
- Piratenkapitän mit riesigem Traum
- Dämonenjäger mit besonderer Klinge
- Magieschüler mit verbotener Kraft
- überstarker Lehrer mit Augenbinde

Andere `who-am-i`-Packs enthalten generische Berufe/Tiere sowie historische, mythologische oder allgemein bekannte Namen.

Keine bekannten Charakterbilder, Logos, Screenshots oder Zitate sind für diesen Modus vorgesehen.

## 4. `anime-guess` – konkrete Fanreferenzen

Der Labs-Modus `anime-guess` ist ausdrücklich ein **inoffizielles textbasiertes Namensquiz** und enthält derzeit 40 konkrete Figurennamen.

### Shōnen-Klassiker

1. Son Goku
2. Naruto Uzumaki
3. Monkey D. Ruffy
4. Ichigo Kurosaki
5. Edward Elric
6. Gon Freecss
7. Killua Zoldyck
8. Kenshin Himura
9. Natsu Dragneel
10. Yusuke Urameshi

### Neuere Hits

1. Tanjiro Kamado
2. Nezuko Kamado
3. Satoru Gojo
4. Yuji Itadori
5. Denji
6. Power
7. Eren Jäger
8. Mikasa Ackerman
9. Izuku Midoriya
10. Shoto Todoroki

### Kult & Fantasy

1. Sailor Moon
2. Light Yagami
3. L
4. Spike Spiegel
5. Inuyasha
6. Kagome Higurashi
7. Frieren
8. Anya Forger
9. Loid Forger
10. Totoro

### Sport & Games

1. Ash Ketchum
2. Pikachu
3. Hinata Shoyo
4. Kageyama Tobio
5. Yoichi Isagi
6. Meguru Bachira
7. Tsubasa Ozora
8. Kirito
9. Asuna
10. Subaru Natsuki

## 5. Aktuelle Schutzgrenzen des Fanmodus

Bereits umgesetzt:

- keine Charakterbilder
- keine fremden Logos
- keine Panels/Screenshots
- keine Anime-/Game-Audios
- keine langen oder charakteristischen Zitate
- keine Behauptung offizieller Partnerschaft
- Beschreibung nennt den Modus inoffiziell
- Modus ist Labs und nicht Teil der 15 Core-Games

Diese Maßnahmen reduzieren die Fremdmaterialmenge, stellen aber **keine rechtliche Freigabe** der konkreten Namen dar.

## 6. Entscheidung vor öffentlichem RC

Für `anime-guess` muss vor dem öffentlichen Release genau eine Option dokumentiert werden.

### Option A – textbasiertes Fanquiz behalten

Nur nach finaler Prüfung des konkreten deutschen/EU-Veröffentlichungs- und Vermarktungsmodells.

Dann zusätzlich:

- Formulierungen/Branding auf keine offizielle Verbindung prüfen
- keine Logos/Bilder/Audios ergänzen
- Marketing nicht mit fremden Marken als Hauptverkaufsargument aufbauen
- finalen Rechte-Sign-off dokumentieren

### Option B – komplett generisch machen

Die 40 Figurennamen durch eigenständige Anime-/Manga-Archetypen ersetzen und Titel/Beschreibung entsprechend anpassen.

Vorteil:

- deutlich geringere konkrete Fan-/Markenabhängigkeit

Nachteil:

- weniger klassischer Fanquiz-Charakter

### Option C – aus öffentlichem Build entfernen

Der Modus kann im Entwicklungsbranch verbleiben, aber vor Production aus dem ausgelieferten Katalog/Offline-Core entfernt werden.

Das würde Katalog-, Tier-, Test- und Dokumentationsverträge verändern und muss kontrolliert umgesetzt werden.

## 7. Trending-/Viral-Befund

Der erste Quellpass der aktuellen Trending-/Viral-Kataloge zeigt überwiegend generische Kategorien und selbst formulierte Situationen.

Beispiele:

- Stirn-Raten: generische Alltag/Tiere/Berufe/Popkultur-Archetypen
- Melodie summen: Genres/Anlässe/Szenentypen statt konkrete Songtitel
- Preis schätzen: fiktive Spielwerte und generische Produkte
- Higher/Lower: allgemeine Wissens-/Sport-/Naturzahlen

Weiterhin gilt: einzelne Begriffe wie Sportverbands-/Wettbewerbsbezeichnungen oder Plattform-/Produktnamen werden beim finalen Gesamtquellpass gesondert markiert, wenn sie für die Mechanik nicht nötig sind.

## 8. Visuelle Fancontent-Regeln

Aus `ASSET_PLAN.md` verbindlich:

- keine bekannten Charaktere nachzeichnen
- keine Markenlogos
- keine Szenen/Panels/Screenshots
- keine fremden Audio-/Videodateien
- visuelle Anime-Begleitung nur über eigenständige generische Archetypen

Ein später generiertes KI-Bild darf nicht gezielt wie eine konkrete geschützte Figur aussehen, nur weil kein Originalbild kopiert wurde.

## 9. Release-Gates

Vor `FAN / REFERENCE CONTENT PASS`:

- [x] Word-Imposter-Core auf unnötige konkrete Referenzen geprüft und drei Begriffe generisch ersetzt
- [x] konkrete `anime-guess`-Figuren inventarisiert
- [ ] Option A, B oder C für `anime-guess` entschieden
- [ ] finale Rechteprüfung für öffentlich verbleibende konkrete Fanreferenzen
- [ ] übrige Extended/Labs auf vermeidbare Marken-/Franchisereferenzen final durchgesehen
- [ ] keine fremden Bilder/Logos/Screenshots/Audios/Videos
- [ ] Marketingtexte auf keine offizielle Partnerschaft/Irreführung geprüft
- [ ] `THIRD_PARTY_NOTICES.md` und `LEGAL_CHECKLIST.md` final synchronisiert

Bis dahin bleibt R-011 **OFFEN** und der öffentliche Release **NO_GO**.
