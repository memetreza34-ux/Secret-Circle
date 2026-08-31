# Secret Circle

Secret Circle ist ein lokales Imposter-Partyspiel für drei bis zwanzig Personen. Eine oder mehrere Personen kennen den geheimen Begriff nicht und müssen anhand der Hinweise unauffällig bleiben.

## Start

```bash
npm start
```

Danach `http://localhost:8080` öffnen. Nach dem ersten vollständigen Laden läuft die App offline und lässt sich auf unterstützten Geräten installieren.

Zum Testen auf dem Handy im selben WLAN reicht die Netzwerk-IP (`http://192.168.x.x:8080`). Das Spiel läuft dort, Service Worker und Installation brauchen aber HTTPS oder localhost.

## Aufbau

Die App startet mit einem Startbildschirm, nicht mit einem Formular. Einstellungen liegen hinter
Listenzeilen, die auf eigene Screens führen — dasselbe Muster, das Party-Apps im Store benutzen.

| Screen | Inhalt |
| --- | --- |
| Home | Wortmarke, Banner mit dem Spiel, ein Knopf. Fortsetzen-Zeile, wenn ein Match läuft. Streifen der letzten Runden |
| Spiel einrichten | drei Zeilen: Spieler · Kategorie · Regeln, jeweils mit aktuellem Wert |
| Spieler | Namensliste, unten das Eingabefeld |
| Kategorie | Liste mit Symbol, Begriffszahl und Haken bei der gewählten |
| Regeln | Imposter, Redezeit, Rundenzahl, Hilfswort |
| Karten | geheime Klappkarte, Spielerkreis als Fortschritt |
| Runde | Timer-Ring, Regeln, Punktestand |
| Abstimmung | ein Name pro Tipp, danach versiegelte Stimme |
| Ergebnis | Begriff, Imposter, Punkte, Matchgewinner |
| Eigene Kategorien · Verlauf | vom Home aus erreichbar |

Gestaltung: schwarzer Grund, weiße Flächen für alles Wichtige, ein einziger Signalton (`#ff3b5c`) für
den Imposter. Die Zivilisten-Karte ist weiß, die Imposter-Karte rot — der Unterschied ist aus dem
Augenwinkel erkennbar.

## Funktionen

- drei bis zwanzig eindeutige Spielernamen als einzeln entfernbare Chips
- Kategorieauswahl als Kacheln mit Begriffszahl
- ein bis mehrere Imposter
- acht integrierte Wortpakete und gemischter Modus
- 80 intern ausgewählte familienfreundliche Begriffe
- sichtbare Wortpaket-Version `2026.08-rc1`
- eigene Kategorien im Format `Begriff | Hilfswort`
- ein, drei, fünf oder zehn Runden pro Match
- geheime Kartenübergabe mit aufklappbarer Karte
- Rollen, Kartenreihenfolge, Abstimmungsreihenfolge und Begriffswahl aus getrennten Zufallsströmen
- keine Begriffswiederholung innerhalb eines Matches
- konfigurierbarer Diskussionstimer
- geheime Einzelabstimmung am selben Gerät
- Schutz vor Selbststimmen
- automatische Auswertung von Mehrheit und Stimmengleichstand
- Punktesystem für Zivilpersonen und Imposter
- Rangliste nach jeder Runde
- Matchgewinner nach der letzten Runde
- Wiederaufnahme in jeder Phase, auch nach dem Rundenergebnis
- lokaler Verlauf der letzten zwanzig Runden
- installierbare PWA mit Offline-Cache
- keine Anmeldung und keine Serverübertragung

## Accessibility

Die Bedienoberfläche ergänzt:

- Sprunglink direkt zum Spiel
- sichtbare starke Tastaturfokusse
- Fokuswechsel auf die Überschrift der neu geöffneten Spielphase
- automatische Fokussierung der Weitergabe-Buttons
- Live-Ansage beim Bildschirmwechsel
- semantische Gruppe für Abstimmungsziele
- Timer-Rolle und Live-Bereiche für geheime Karte und Ergebnis
- `aria-expanded` für die aufklappbaren Bereiche
- Schließen der aufklappbaren Bereiche mit Escape
- Fokusübergabe auch dann, wenn der Tab im Hintergrund liegt
- Unterstützung für reduzierte Bewegung
- zusätzliche Darstellung für erzwungene Systemfarben

Alle eigentlichen Aktionen bleiben native Buttons und Formularelemente und sind damit grundsätzlich per Tastatur bedienbar.

## Wortpakete

`word-packs.js` trennt die redaktionellen Inhalte von Spiel- und UI-Logik.

Aktueller Stand:

- Version: `2026.08-rc1`
- acht Kategorien
- zehn Begriffe pro Kategorie
- 80 Begriffe insgesamt
- Review-Status: `internal_family_friendly`
- externe redaktionelle Prüfung: `false`
- unverbindliche Altersorientierung: `6+`

Die Kennzeichnung ist keine externe Altersfreigabe oder pädagogische Zertifizierung. Eigene Kategorien werden nicht redaktionell geprüft.

## Punktelogik

- Wird ein Imposter eindeutig gewählt, erhalten alle Zivilpersonen einen Punkt.
- Weitere nicht gewählte Imposter erhalten ebenfalls einen Punkt.
- Wird kein Imposter eindeutig gewählt, erhalten alle Imposter zwei Punkte.
- Bei Gleichstand wird niemand eindeutig beschuldigt.

## Getestete Spielengine

`game-engine.js` übernimmt:

- validierte Spieler-, Runden- und Imposter-Konfiguration
- deterministische, aber untereinander unabhängige Ziehung von Rollen, Kartenreihenfolge, Abstimmungsreihenfolge und Begriff
- Ausschluss bereits gespielter Begriffe im laufenden Match
- Match-ID, Rundennummer und fortlaufende Punktestände
- Diskussion, Abstimmung und Auswertung
- Mehrheits- und Gleichstandsberechnung
- Rangliste und nächste Runde
- sichere Wiederherstellung gespeicherter Spielstände in jeder Phase
- Manipulationsprüfung von Stimmen und Punkten
- Startwert ohne `crypto.randomUUID`, damit die App auch ohne Secure Context startet

## Historisches Archiv

Das frühere Projekt-Hub-Repository enthält weiterhin `secret-circle.zip` als potenziell einzigartige Backfill-Quelle.

Bekannter Quellstand:

- Repository: `memetreza34-ux/autonomous-project-hub`
- Pfad: `secret-circle.zip`
- Git-Blob-SHA-1: `0bda8a341c6167d83f3a10c2f62fb4efacbd42d7`
- Löschstatus: `DO_NOT_DELETE`

Das echte ZIP konnte in der aktuellen Ausführungsumgebung noch nicht als lokale Binärdatei bereitgestellt werden. Seine Dateianzahl und Inhalte sind deshalb weiterhin unbekannt und werden nicht geschätzt.

### Sicheres Inventarwerkzeug

`tools/inventory_legacy_archive.py` liest und hasht ein lokal bereitgestelltes ZIP ohne Extraktion oder Ausführung.

```bash
python tools/inventory_legacy_archive.py /sicherer/pfad/secret-circle.zip \
  --expected-git-blob 0bda8a341c6167d83f3a10c2f62fb4efacbd42d7 \
  --json docs/generated/legacy-inventory.json \
  --markdown docs/generated/legacy-inventory.md
```

Das Werkzeug prüft vor der Dekompression:

- Anzahl der Einträge
- maximale Datei- und Gesamtgröße
- Kompressionsrate
- Pfad-Traversal und absolute Pfade
- Windows-Laufwerkspfade
- Symlinks
- Verschlüsselung
- doppelte Pfade und Case-Kollisionen
- erwarteten Git-Blob

Danach werden Einträge kontrolliert gestreamt, per SHA-256 inventarisiert und auf Größen-/CRC-/ZIP-Fehler geprüft. Nichts wird extrahiert.

Dokumentation:

- `docs/LEGACY_ARCHIVE_INVENTORY.md`
- `docs/legacy-archive-source.json`
- `docs/ARCHIVE_TOOL_VALIDATION.md`

Die synthetische Sicherheitssuite ist bestanden. Die tatsächliche Archivinventur bleibt `BLOCKED`, bis exakt die Binärdatei mit dem erwarteten Git-Blob lokal verfügbar ist.

## Technische Prüfung

```bash
npm test
```

Einzeln:

```bash
node tests/engine.test.js        # Fairness, Mehr-Runden-Logik, Punkte, Persistenz
node tests/content.test.js       # Wortpakete und Metadaten
node tests/dom-contract.test.js  # Markup, Skript-Selektoren, Offline-Assets
python3 scripts/validate_project.py
```

Formatierung und Icons:

```bash
npm run format:check
npm run icons
```

`scripts/build-icons.mjs` erzeugt die PNG-Icons aus derselben Geometrie wie `icon.svg`, ohne externe Abhängigkeiten. Die CI prüft, dass die eingecheckten Icons reproduzierbar sind.

## Dateien

| Datei | Zweck |
| --- | --- |
| `index.html` | Markup aller fünf Spielphasen |
| `styles.css` | vollständige Gestaltung |
| `game-engine.js` | Regeln, Zufall, Validierung, Punkte |
| `word-packs.js` | redaktionelle Inhalte |
| `app.js` | Oberfläche, Speicher, Ablauf |
| `accessibility.js` | Fokusführung und Ansagen |
| `sw.js` | Offline-Cache |
| `scripts/dev-server.py` | Entwicklungsserver, der nichts cacht |
| `scripts/build-icons.mjs` | erzeugt die PNG-Icons aus `icon.svg` |

## Status

- Mehr-Runden-, Abstimmungs- und Punkteengine: `GO`
- kuratierte interne Wortpakete: `GO_WITH_CONDITIONS`
- tastatur- und screenreaderfreundliches lokales Test-Staging: `GO_WITH_CONDITIONS`
- installierbare lokale Offline-PWA: `GO_WITH_CONDITIONS`
- sicheres Legacy-Archiv-Inventarwerkzeug: `GO`
- tatsächliche Inventur von `secret-circle.zip`: `BLOCKED`
- Löschung des Hub-Archivs: `NO_GO`
- öffentliche Store- oder Produktveröffentlichung: `NO_GO`

Gate: `LEGACY_ARCHIVE_TOOLING_GO / ACTUAL_ARCHIVE_INVENTORY_BLOCKED / HUB_ARCHIVE_DO_NOT_DELETE / LOCAL_ACCESSIBLE_PARTY_PWA_GO / PUBLIC_RELEASE_NO_GO`.

Vor einer öffentlichen Veröffentlichung fehlen reale Tests auf mehreren iOS-/Android-Geräten, Browser- und PWA-Installationsprüfungen, Tests mit Screenreadern und Tastaturnutzenden, vollständige WCAG-Prüfung, externe redaktionelle und Altersprüfung, Datenschutzbewertung sowie ein dokumentierter Releaseprozess.

Das öffentliche Zielrepository enthält keine Secrets, Konten, `.env`-Dateien oder das historische ZIP-Archiv.
