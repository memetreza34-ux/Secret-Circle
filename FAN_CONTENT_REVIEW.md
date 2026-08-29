# Secret Circle – Fan-, Marken- und Referenzcontent-Review

Stand: 29. August 2026  
Status: **SOURCE COVERAGE HARDENED / MANUAL FINAL SIGN-OFF OPEN**

## 1. Zweck

Dieses Dokument trennt generischen Partycontent von konkreten fremden Namen, Marken und Fanreferenzen. Es ist ein redaktioneller Releasevertrag und **keine juristische Freigabe**.

Grundregel: Wenn eine konkrete Fremdreferenz keinen zwingenden Produktnutzen hat, wird sie vor Production generisch formuliert oder aus finalem Runtime-Pfad **und ausgelieferter Source-Datei** entfernt.

## 2. Bereits bereinigte Referenzen

Quellsseitig umgesetzt und durch Tests/Audits geschützt:

- `Bluetooth` → `Funkverbindung`
- `Oscar` → `Filmpreis`
- `Formel 1` → `Motorsport`
- sichtbarer Modusname `Wellenlänge` → **Spektrum-Tipp**; stabile interne ID `wavelength` bleibt aus Persistenz-/Routinggründen
- Tabu-Begriff `Chrome` → `Tab`
- `🦁👑 → Löwenkönig` → `🦁🌾 → Löwe`
- konkrete frühere Anime-Figuren im Modus `anime-guess` wurden durch 40 generische Archetypen ersetzt und physisch aus dem ausgelieferten Mega-Katalog entfernt
- unnötig konkrete Sport-/Eventformulierungen im Higher/Lower-Content wurden generisch ersetzt

Die bewusste Source-Bereinigung soll verhindern, dass ein alter konkreter Referenzblock zwar nicht sichtbar, aber weiterhin im ausgelieferten JavaScript enthalten ist.

## 3. Anime-/Fancontent

`anime-guess` behält die technische ID, liefert aber **Anime-Archetypen erraten** mit vier generischen Packs und insgesamt 40 eigenständigen Archetypen.

Verbindlich:

- keine konkreten bekannten Figuren als Spielantworten
- keine bekannten Charakterbilder oder Panels
- keine Markenlogos
- keine fremden Screenshots
- keine Zitate/Liedtexte als Ersatzcontent
- spätere visuelle Anime-Begleitung nur als eigenständige generische Figuren ohne gezielte Ähnlichkeit zu konkreten bekannten Charakteren

## 4. Zentraler Reference-Source-Gate – v64

`scripts/reference_content_audit.py` scannt aktuell **14 ausgelieferte Contentquellen**:

- `word-packs.js`
- acht bestehende Katalog-/Classic-Layer
- alle sechs Wave-1-Katalogschichten

Wave 1 ist damit 10/10 im Reference-Source-Gate enthalten:

- Quiz/Fake-Fakt
- Imposter Similar Word/No Word
- Writing Battle/Who Wrote It
- Percent/Bracket
- Bluff Trivia
- Ein-Wort-Hinweis

Der Audit blockiert die bewusst entfernten konkreten Referenzen und eine definierte Liste hochprofiliger Plattform-/Franchise-Namen, falls sie erneut in ausgelieferten Contentquellen auftauchen.

Der Audit ist Teil von `npm run validate`. Wegen des Hosted-Runner-Problems ist er **source-seitig implementiert, aber noch nicht final runner-verifiziert**.

## 5. Privacy-Source-Gate – jetzt ebenfalls Wave-1-vollständig

`scripts/privacy_content_audit.py` scannt jetzt dieselben bestehenden Contentfamilien **plus alle sechs Wave-1-Kataloge**.

Blockiert werden konkrete Aufforderungen, private Geräte-/Kontodaten als Spielmaterial offenzulegen, z. B.:

- letzte private Nachricht vorlesen
- Kamerarolle/private Fotos zeigen
- private Chats öffnen/vorlesen
- Passwort/Adresse/Telefonnummer/Kontodaten preisgeben
- Standort teilen

Wave-1-Kataloge müssen außerdem ihre erwarteten zehn Spiel-IDs als sichere Source-Marker enthalten. Damit kann ein neues Wave-1-Lab nicht mehr außerhalb des zentralen Privacy-Source-Gates liegen.

## 6. Gebündeltes Visual-/Media-Inventar

Der aktuelle Release-Medienbestand ist bewusst auf genau drei Dateien begrenzt:

1. `icon.svg`
2. `icon-192.png`
3. `icon-512.png`

Der frühere ungeklärte Icon-Rechtepfad wurde am 29. August 2026 vollständig ersetzt. Alle drei aktuellen Dateien stehen in `assets/manifests/asset-provenance.json` auf **`verified-own`** und besitzen neue dokumentierte SHA-256-Werte.

Damit gilt für den aktuellen App-Build:

- keine gebündelten Anime-/Franchise-Charakterbilder
- keine fremden Screenshots/Panels
- keine fremden Markenlogos als Release-Medien
- keine gebündelten Audio-/Videodateien
- aktuelles App-Iconset source-seitig mit eigener Provenienz dokumentiert

Technische Absicherung:

- `scripts/media_inventory_audit.py` verlangt exakt die drei inventarisierten Medien
- `scripts/asset_provenance_audit.py` prüft Hashes, Dimensionen, Rechtefelder und Ableitungen
- `tests/manifest-icons.test.js` prüft Manifest-/Iconvertrag

**Grenze:** Store-Screenshots, Social-Media-Material, Marketingvideos und später hinzukommende Illustrationen sind nicht automatisch mitfreigegeben und benötigen eigene Provenienz-/Visualprüfung.

## 7. Restlicher manueller Semantik-/Namensreview

Vor finalem `FAN / REFERENCE CONTENT PASS` bleiben bewusst manuell offen:

- alle 13 Extended und 27 Labs im finalen Katalog semantisch lesen
- öffentliche Spielnamen auf mögliche Verwechslungs-/Markenwirkung prüfen
- Marketingtexte dürfen keine offizielle Partnerschaft suggerieren
- keine fremden Slogans/Zitate
- neue Store-/Marketingassets separat prüfen
- finale Alters-/Safety-Plausibilisierung
- finale geschäftliche/rechtliche Entscheidung für den tatsächlichen RC

Ein generischer Begriff oder Mechanikname wird nicht allein deshalb als rechtlich „frei“ bezeichnet, weil kein automatischer Treffer existiert.

## 8. Wave-1-Manuellfokus

Besonders prüfen:

- `party-quiz` / `fact-or-fake`: Faktenstabilität; keine unnötigen Marken-/aktuellen Behauptungen
- `undercover-similar-word` / `no-word-imposter`: Wortpaare generisch und fair
- `fill-blank-battle` / `who-wrote-it`: keine erzwungene intime/beleidigende Richtung
- `percent-guess`: Zielwerte verständlich und nicht irreführend aktuell
- `party-bracket`: keine entwürdigenden Personenkategorien
- `bluff-trivia`: Trivia generisch; private Fake-Eingaben nicht mit realen privaten Daten verwechseln
- `password-one-word`: Zielwörter generisch; kein Franchise-Quiz durch Contentwahl

## 9. Release-Gate

Vor `FAN / REFERENCE CONTENT PASS`:

- [x] zentrale historische konkrete Referenzen generisch ersetzt
- [x] konkrete Anime-Figuren physisch aus aktueller ausgelieferter Source entfernt
- [x] `reference_content_audit.py` scannt bestehende + alle sechs Wave-1-Katalogschichten
- [x] `privacy_content_audit.py` scannt jetzt ebenfalls alle sechs Wave-1-Kataloge
- [x] aktueller Media-Bestand auf exakt drei App-Icondateien begrenzt
- [x] aktuelles Iconset `verified-own`
- [x] Asset-/Media-/Manifest-Gates vorhanden
- [ ] Reference-/Privacy-/Asset-/Media-Gates auf funktionierendem Runner tatsächlich grün
- [ ] alle 13 Extended manuell semantisch final abgenommen
- [ ] alle 27 Labs einschließlich Wave 1 manuell semantisch final abgenommen
- [ ] öffentliche Spielnamen auf Verwechslungs-/Markenrisiken final geprüft
- [ ] Marketingtexte auf keine Partnerschafts-/Official-Irreführung geprüft
- [ ] Store-/Marketingbilder, Screenshots und Videos separat geprüft
- [ ] `THIRD_PARTY_NOTICES.md` und `LEGAL_CHECKLIST.md` auf finalem RC synchronisiert
- [ ] finale rechtliche/geschäftliche Plausibilisierung abgeschlossen

Bis diese Restpunkte geschlossen sind, bleibt R-011 **OPEN / IN PROGRESS** und der öffentliche Release **NO_GO**.
