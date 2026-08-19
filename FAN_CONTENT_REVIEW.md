# Secret Circle – Fan-, Marken- und Referenzcontent-Review

Stand: 19. August 2026  
Status: **IN PROGRESS – technischer Source-Pass stark gehärtet; manuelle visuelle/rechtliche Restabnahme offen**

## 1. Zweck

Dieses Dokument trennt generischen Partycontent von konkreten fremden Namen, Marken und Fanreferenzen. Es ist ein redaktionelles/releasebezogenes Inventar und keine juristische Freigabe.

Grundregel: Wenn eine konkrete Fremdreferenz keinen zwingenden Produktnutzen hat, wird sie vor Production generisch formuliert oder aus finalem Runtime-Pfad **und ausgelieferter Source-Datei** entfernt.

## 2. Word Imposter – v36

| vorher | jetzt | Grund |
|---|---|---|
| `Bluetooth` | `Funkverbindung` | konkreter Markenname unnötig |
| `Oscar` | `Filmpreis` | konkreter Awardname unnötig |
| `Formel 1` | `Motorsport` | konkrete Wettbewerbsbezeichnung unnötig |

Die 14 Kategorien mit je 12 Einträgen bleiben erhalten. Regressionstests schützen die Ersetzungen.

## 3. `who-am-i`

Das Pack `Anime-Archetypen` verwendet generische Rollenbeschreibungen statt konkreter Figuren. Andere Packs enthalten generische Berufe/Tiere sowie historische, mythologische oder allgemein bekannte Namen.

Historische Personen werden nicht automatisch wie aktuelle Marken-/Franchisereferenzen behandelt. Keine bekannten Charakterbilder, Logos, Screenshots oder Zitate sind für diesen Modus vorgesehen.

## 4. `anime-guess` – v37/v40/v41

Der Labs-Modus enthielt ursprünglich 40 konkrete bekannte Figuren-/Franchisereferenzen. Für den Januar-2027-Pfad wurde **Option B: komplett generisch** gewählt.

Stabile ID: `anime-guess`  
Finaler Titel: **Anime-Archetypen erraten**  
Gruppe: **Anime-Quiz**

Finale Packs:

1. Action & Abenteuer
2. Magie & Mystery
3. Fantasy & Alltag
4. Sport & Games

Jedes Pack enthält 10 eigenständige Archetypen, insgesamt 40.

Entwicklung:

- **v37:** finale Runtime-Schicht auf generische Archetypen umgestellt
- **v40:** die 40 historischen konkreten Figuren physisch aus `party-mega-catalog.js` entfernt
- **v41:** Mega-Test prüft die ausgelieferte Source selbst; `scripts/reference_content_audit.py` blockiert die bekannten Altbegriffe zentral

`party-core-classic-content.js` v4 hält denselben generischen Zustand zusätzlich als finale Invariante.

Status: **PHYSICAL SOURCE CLEANUP IMPLEMENTED / RUNNER VERIFICATION OPEN**.

Der frühere Source-Distribution-Hinweis ist damit technisch geschlossen: Der konkrete historische Anime-Basisblock liegt nicht mehr in der aktuell ausgelieferten Mega-Katalogdatei.

## 5. Viral `higher-lower` – v38

Im Sportpack wurden drei unnötig konkrete Event-/Award-nahe Formulierungen ersetzt, ohne die Zahlenlogik zu verändern:

| vorher | jetzt | Wert |
|---|---|---:|
| Ringe im olympischen Symbol | Ecken eines Fünfecks | 5 |
| Bahnen eines olympischen 400-Meter-Stadions häufig | Bahnen einer typischen 400-Meter-Leichtathletikanlage | 8 |
| Sätze zum Sieg im Herren-Grand-Slam-Tennis | Gewinnsätze in einem Best-of-five-Tennismatch | 3 |

`tests/party-viral-catalog.test.js` verlangt die neuen Einträge und blockiert die alten Formulierungen.

Status: **CLOSED IN CODE / RUNNER VERIFICATION OPEN**.

## 6. Weitere physische Source-Bereinigung – v41

### Spektrum-Modus

Stabile technische ID: `wavelength`.

Die ID bleibt aus Routing-/Persistenzgründen erhalten. Der alte sichtbare Name wird nicht mehr ausgeliefert:

- vorher: `Wellenlänge`
- jetzt upstream in `party-expansion.js`: **Spektrum-Tipp**

### Tabu Browser

- vorher upstream: `Chrome`
- jetzt upstream: `Tab`

Classic Content benötigt dafür seit v4 keinen nachträglichen `Chrome → Tab`-Fallback mehr.

### Emoji-Quiz

- vorher: `🦁👑 → Löwenkönig`
- jetzt: `🦁🌾 → Löwe`

Damit wird eine unnötig franchise-nahe Antwort durch einen rein generischen Tierhinweis ersetzt.

## 7. Zentraler Source-Gate

Neu verbindlich:

`scripts/reference_content_audit.py`

Der Audit scannt die tatsächlich ausgelieferten Contentquellen:

- `word-packs.js`
- `party-catalog.js`
- `party-expansion.js`
- `party-trending-catalog.js`
- `party-mega-catalog.js`
- `party-viral-catalog.js`
- `party-core-release-catalog.js`
- `party-core-classic-content.js`

Er blockiert die bereits bewusst entfernten konkreten Referenzen und markiert zusätzlich eine definierte Gruppe hochprofiliger Plattform-/Franchise-Namen als erneute Review-Pflicht.

Der Audit ist Teil von `npm run validate`. Wegen des aktuellen GitHub-Actions-Runnerproblems ist er **IMPLEMENTED, aber noch nicht runner-verifiziert**.

## 8. Ergänzender Repository-Suchpass – 19. August 2026

Zusätzlich zum Working-Branch-Source-Vertrag wurde eine repositoryweite GitHub-Code-Suche für typische hochprofilige Plattform-, Game-, Film- und Konsummarken durchgeführt.

Keine Suchtreffer wurden für folgende Begriffe zurückgegeben:

- TikTok
- Instagram
- YouTube
- Netflix
- Spotify
- Disney
- Marvel
- Minecraft
- Fortnite
- PlayStation
- Nintendo
- Harry Potter
- Star Wars
- Pokémon
- Coca-Cola
- McDonald's

Dieser Befund ist **nur ein ergänzendes Signal**. GitHub-Code-Suche kann wegen Branch-/Index-/Suchgrenzen niemals allein einen Rechtepass freigeben. Maßgeblich bleiben:

1. direkte Working-Branch-Dateien
2. `scripts/reference_content_audit.py`
3. finale Runtime-/Deployment-Artefakte
4. visueller Review
5. Marketing-/Namensreview
6. finale rechtliche/geschäftliche Entscheidung

## 9. Visuelle Fancontent-Regeln

Weiterhin verbindlich:

- keine bekannten Charaktere nachzeichnen
- keine Markenlogos
- keine Szenen/Panels/Screenshots
- keine fremden Audio-/Videodateien
- visuelle Anime-Begleitung nur über eigenständige generische Archetypen
- ein generiertes Bild darf nicht gezielt wie eine konkrete bekannte Figur aussehen

## 10. Restlicher Extended-/Labs-Pass

Der direkte technische Quellpass und der ergänzende Repository-Suchpass wurden stark erweitert. Vor finalem Sign-off bleiben dennoch bewusst offen:

- vollständige manuelle Semantikprüfung aller Extended-/Labs-Modi im finalen Build
- visuelle Assets/Screenshots/Marketingmaterial
- mögliche Verwechslungswirkung von Spiel-/Kampagnennamen
- fremde Slogans/Zitate
- finale juristische/geschäftliche Bewertung des tatsächlichen Releasebuilds

Besonders wichtig: Ein generischer Begriff oder Spielmechanikname wird nicht allein deshalb als „frei“ behandelt, weil die Contentsuche keinen bekannten Franchise-Treffer findet. Vor Production wird die finale öffentliche Namensliste separat bewertet.

## 11. Release-Gates

Vor `FAN / REFERENCE CONTENT PASS`:

- [x] Word-Imposter-Core auf unnötige konkrete Referenzen geprüft
- [x] drei Core-Begriffe generisch ersetzt
- [x] konkrete frühere `anime-guess`-Figuren inventarisiert
- [x] Option B für `anime-guess` umgesetzt
- [x] 40 konkrete Figuren aus dem finalen Runtime-Katalog entfernt
- [x] 40 konkrete Figuren physisch aus `party-mega-catalog.js` entfernt
- [x] Mega-Test blockiert ihre Rückkehr in die ausgelieferte Quelle
- [x] Viral-Sportreferenzen aus v38 generisch ersetzt
- [x] `Wellenlänge` upstream durch **Spektrum-Tipp** ersetzt
- [x] `Chrome` upstream durch `Tab` ersetzt
- [x] `Löwenkönig` durch generischen Löwenhinweis ersetzt
- [x] zentraler `reference_content_audit.py` in `npm run validate`
- [x] ergänzender Repository-Suchpass über 16 hochprofilige Namen durchgeführt
- [ ] zentraler Source-Audit auf funktionierendem Runner tatsächlich grün
- [ ] Restlicher Extended-/Labs-Pass manuell/semantisch final abgenommen
- [ ] keine fremden Bilder/Logos/Screenshots/Audios/Videos im finalen Build bestätigt
- [ ] Marketingtexte auf keine offizielle Partnerschaft/Irreführung geprüft
- [ ] finale öffentliche Spielnamen separat auf Verwechslungs-/Markenrisiken geprüft
- [ ] `THIRD_PARTY_NOTICES.md` und `LEGAL_CHECKLIST.md` final synchronisiert
- [ ] Tests auf funktionierendem Runner tatsächlich ausgeführt

Bis diese Restpunkte geschlossen sind, bleibt R-011 **OFFEN** und der öffentliche Release **NO_GO**.
