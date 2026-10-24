# Handy-Ladezeiten der Kartenpakete

Gemessen am 23. und 24. Oktober 2026. Fortsetzung von Claudes begonnenem Vergleich; keine Änderung an Spielinhalten, Spielregeln oder Performance-Budgets.

## Verglichene Stände

- `main`: `a8bd77711f2e9e93eef4ab58b9566b5a3fcd7d5d`.
- Kartenpakete v114: `82aad9a62721fdf6cf8c340445d7430603123eac` (`content/cards-knowledge`).
- Die Messung verwendet unveränderte Git-Archive dieser beiden Commits. Der Integrationsbranch enthält zusätzlich unsere vorhandenen Bildänderungen und hat Offline-Version v116; seine Funktion wird getrennt mit den Pflichtprüfungen getestet.

## Methode und Grenzen

- Pixel 7 mit Chromium und iPhone 14 mit WebKit, jeweils fünf Durchläufe pro Seite, Stand und Cachefall; Tabellen zeigen Mediane. Reihenfolge der Stände wechselt pro Durchlauf.
- Kalt: neuer Browserkontext, leerer Cache, Service Worker blockiert. Dadurch beginnt die Offline-Installation nicht zufällig während der Seitenmessung.
- Warm: vorheriger Besuch im selben Kontext, danach vollständig abgewartete Service-Worker-Aktivierung. In allen ausgewerteten Warm-Läufen beider Browser war die Seite tatsächlich vom Worker kontrolliert (Rohdaten: `warmControlledByServiceWorker: true`). Der installierte WebKit-Build unterstützt diesen Messfall; frühere Annahmen über fehlende Unterstützung wurden durch die Messung verworfen. Die vorhandenen CI-Ausnahmen für WebKit-Offline-Tests bleiben unverändert. Ein warmer Onlinebesuch ersetzt keinen Offline-Ausfalltest auf echten Geräten.
- Lokaler HTTP/1.1-Server mit gzip, Keep-alive und ETag-Revalidierung für beide Stände. Keine simulierte Netzdrosselung oder CPU-Drosselung in den unten ausgewerteten Läufen. Die optional vorbereitete Slow-4G-Konfiguration ist kein Ergebnis dieses Berichts.
- DOMContentLoaded und load stammen aus Navigation Timing. „UI sichtbar“ ist das erste Frame mit gefülltem sichtbarem `hero-title` (Hub), `featured-grid` (Party-Start) bzw. aktivem `quick-start` und geladener Engine (Quick). Es wird kein LCP-Wert behauptet.
- Netzbody ist die Summe der vom isolierten Server ausgelieferten Antwortkörper während des Besuchs, einschließlich Service-Worker-Anfragen. Kompression und 304-Antworten werden berücksichtigt. HTTP-Header, TCP/TLS-Overhead und echte Funkübertragung sind darin nicht enthalten. Die zusätzlichen browserseitigen Bytewerte in den Rohdaten erfassen Service-Worker-interne Downloads nicht vollständig.
- Chromium-Tracing erfasst tatsächliche Skriptausführung beim Laden. Separat werden die Kartendateien in einer leeren Testseite synchron ausgeführt, um ihre Kompilier-/Ausführungskosten auf beiden Engines zu messen. Dieser isolierte Wert enthält keine Katalogzusammenführung und ersetzt keine reale Seitenmessung. Fehlende Tracing-Werte in WebKit bedeuten „nicht verfügbar“, nicht null Aufwand.
- Der einmalige Offline-Kern wird separat vollständig vom Server abgerufen; dieser zusätzliche Download ist nicht in den kalten Seitenwerten enthalten.
- Emulation auf einem Mac, keine echten Telefone und keine Mobilfunkmessung. Es entsteht keine Releasefreigabe: **NO_GO**, reale Geräte- und Gruppentests bleiben offen.

## Reproduzieren

```bash
mkdir -p /private/tmp/secret-circle-perf-main-clean-20261023 /private/tmp/secret-circle-perf-v114-clean-20261023
git archive a8bd77711f2e9e93eef4ab58b9566b5a3fcd7d5d | tar -x -C /private/tmp/secret-circle-perf-main-clean-20261023
git archive 82aad9a62721fdf6cf8c340445d7430603123eac | tar -x -C /private/tmp/secret-circle-perf-v114-clean-20261023
```

In zwei eigenen Terminals:

```bash
node tests/perf/static-server.js /private/tmp/secret-circle-perf-main-clean-20261023 4191
```

```bash
node tests/perf/static-server.js /private/tmp/secret-circle-perf-v114-clean-20261023 4192
```

Danach ohne parallel laufende Browser-Prüfungen:

```bash
PERF_TARGETS='main=http://127.0.0.1:4191,v114=http://127.0.0.1:4192' PERF_OUT=/private/tmp/secret-circle-perf-results-20261023 PERF_RUNS=5 npm run test:perf -- --project=chromium-mobile --project=webkit-mobile
node tests/perf/summarize-mobile-load.js /private/tmp/secret-circle-perf-results-20261023
```

Die opt-in Messung liegt außerhalb von `tests/e2e` und wird von `npm run test:e2e` nicht aufgerufen. `.cache/perf-mobile` überlebt die Bereinigung der normalen Playwright-Ergebnisordner.

## Ergebnisse

[Rohdaten und Prüfsummen](performance/cardpacks-2026-10-24/manifest.json). Die Chromium-Läufe stammen vom 23. Oktober, die abschließenden WebKit-Läufe vom 24. Oktober. Profilwerte verschiedener Engines nicht als direkten Geschwindigkeitsvergleich lesen: Zeitpunkte und Rechnerlast unterscheiden sich. Der Vergleich innerhalb eines Profils wechselt die Reihenfolge der Stände.

Stände: main → v114 · Läufe je Messpunkt: 5 · Werte: Median

#### chromium-mobile (chromium 139.0.7258.5)

| Seite | Fall | DOMContentLoaded ms | load ms | UI sichtbar ms | Netzbody KiB |
|---|---|---|---|---|---|
| index.html | kalt | 132 → 190 (+58) | 132 → 190 (+58) | 127 → 184 (+57) | 234 → 375 (+142) |
| index.html | warm | 103 → 172 (+69) | 103 → 172 (+69) | 99 → 168 (+69) | 0 → 0 (+0) |
| v2-hub.html | kalt | 116 → 195 (+79) | 116 → 195 (+79) | 108 → 188 (+79) | 234 → 375 (+142) |
| v2-hub.html | warm | 101 → 164 (+63) | 101 → 164 (+63) | 97 → 159 (+63) | 0 → 0 (+0) |
| party.html | kalt | 153 → 213 (+60) | 199 → 277 (+78) | 128 → 192 (+64) | 191 → 335 (+145) |
| party.html | warm | 166 → 209 (+43) | 218 → 270 (+52) | 145 → 194 (+50) | 0 → 0 (+0) |
| quick-play.html | kalt | 95 → 192 (+97) | 105 → 204 (+99) | 111 → 209 (+97) | 141 → 285 (+145) |
| quick-play.html | warm | 107 → 193 (+86) | 120 → 205 (+85) | 124 → 213 (+89) | 0 → 0 (+0) |

#### webkit-mobile (webkit 26.0)

| Seite | Fall | DOMContentLoaded ms | load ms | UI sichtbar ms | Netzbody KiB |
|---|---|---|---|---|---|
| index.html | kalt | 52 → 69 (+17) | 54 → 72 (+18) | 75 → 92 (+17) | 234 → 376 (+142) |
| index.html | warm | 42 → 64 (+22) | 45 → 66 (+21) | 65 → 88 (+23) | 3 → 3 (+0) |
| v2-hub.html | kalt | 44 → 68 (+24) | 47 → 72 (+25) | 67 → 90 (+23) | 234 → 376 (+142) |
| v2-hub.html | warm | 41 → 63 (+22) | 43 → 65 (+22) | 63 → 86 (+23) | 3 → 3 (+0) |
| party.html | kalt | 55 → 77 (+22) | 109 → 131 (+22) | 87 → 110 (+23) | 191 → 336 (+145) |
| party.html | warm | 51 → 72 (+21) | 104 → 125 (+21) | 84 → 105 (+21) | 4 → 5 (+0) |
| quick-play.html | kalt | 26 → 50 (+24) | 39 → 77 (+38) | 53 → 80 (+27) | 141 → 286 (+145) |
| quick-play.html | warm | 16 → 45 (+29) | 48 → 71 (+23) | 49 → 72 (+23) | 2 → 2 (+0) |

#### Skriptkosten der Kartendateien

| Profil | Seite | Fall | Karten-Skripte Hauptthread ms | party-core-classic-content.js ms | alle Skripte ms |
|---|---|---|---|---|---|
| chromium-mobile | index.html | kalt | 0.0 → 1.3 (+1.3) | 1.9 → 34.4 (+32.5) | 33.6 → 70.5 (+36.9) |
| chromium-mobile | index.html | warm | 0.0 → 5.3 (+5.3) | 2.0 → 35.3 (+33.4) | 36.6 → 79.5 (+42.9) |
| chromium-mobile | v2-hub.html | kalt | 0.0 → 1.2 (+1.2) | 1.7 → 34.6 (+32.9) | 34.5 → 72.0 (+37.5) |
| chromium-mobile | v2-hub.html | warm | 0.0 → 5.3 (+5.3) | 1.8 → 32.5 (+30.6) | 37.8 → 77.5 (+39.8) |
| chromium-mobile | party.html | kalt | 0.0 → 1.1 (+1.1) | 1.6 → 31.1 (+29.5) | 39.8 → 74.7 (+34.9) |
| chromium-mobile | party.html | warm | 0.0 → 5.0 (+5.0) | 1.8 → 31.4 (+29.7) | 45.1 → 88.8 (+43.7) |
| chromium-mobile | quick-play.html | kalt | 0.0 → 1.4 (+1.4) | 1.8 → 31.5 (+29.7) | 15.0 → 53.6 (+38.6) |
| chromium-mobile | quick-play.html | warm | 0.0 → 6.3 (+6.3) | 1.8 → 34.8 (+32.9) | 23.0 → 66.4 (+43.3) |

| Profil | Kartendateien isoliert parsen + ausführen ms (ohne Code-Cache) |
|---|---|
| chromium-mobile | main: – (0 Dateien) · v114: 8.5 (16 Dateien) |
| webkit-mobile | main: – (0 Dateien) · v114: 4.0 (16 Dateien) |

| Offline-Kern (einmalig, gzip) | Dateien | KiB | davon Kartendateien KiB |
|---|---|---|---|
| main | 91 | 536 | 0 |
| v114 | 108 | 683 | 131 |


## Bewertung

**OK für die vorhandenen Größenbudgets; keine öffentliche Releasefreigabe.** Es gibt im Projekt keinen verbindlichen Grenzwert für die hier gemessene emulierte Handy-Ladezeit. Deshalb wird daraus kein pauschales Laufzeit-PASS für reale Geräte abgeleitet.

- Tatsächlich vorhanden sind **16** zusätzliche Kartendateien (nicht die im alten Auftrag genannten 17): zusammen **449.989 Byte** unkomprimiert. Größte Datei: `party-cards-mega-3.js` mit **59.312 Byte** bei unverändert **90.000 Byte** Limit.
- Budgetierte Asset-Summe von v114: **1.802.764 Byte**; integrierter Stand v116 mit den bestehenden Bildänderungen: **1.872.013 Byte**, also **58,50 %** des unveränderten Gesamtbudgets von **3.200.000 Byte**. `npm run validate` bestätigt die Einhaltung.
- Einmaliger gzip-Offline-Download: **548.632 → 699.038 Byte**; davon **133.950 Byte** für Kartendateien. Die in den Seitentabellen zusätzlich übertragenen Daten sind nicht mit diesem separaten Installationsdownload zu addieren, ohne den Cachefall zu beachten.
- Chromium-Tracing zeigt den größeren CPU-Zuwachs bei der Katalogzusammenführung in `party-core-classic-content.js`; die Ausführung der reinen Datenregistrierungen ist wesentlich kleiner. Warmes Caching spart Netzverkehr, beseitigt diese Ausführungsarbeit aber nicht.
- Die Messung zeigt keine Annäherung an die vorhandenen Größenlimits. Deshalb wird jetzt kein Laden der Kartendateien umgebaut. Eine spätere Optimierung braucht einen eigenen belegten Engpass auf echten Geräten; Spiellogik und Schutzfunktionen werden nicht auf Verdacht geändert.

## Verifikation der Integration

- `npm run check`: bestanden.
- `npm test`: bestanden, einschließlich Kartengedächtnis und aller 16 Kartenpakete (+7.525 Karten laut Vertragstest).
- `npm run validate`: bestanden.
- `CI=1 npm run test:e2e`: **1.679 bestanden, 175 übersprungen, Exit 0** in 18,1 Minuten. Die vorhandenen profilabhängigen Ausnahmen wurden nicht verändert.
- Der vollständige Browserlauf verwendete eine lokale Kopie, deren **257 App-, Asset-, Konfigurations- und Testdateien** bytegleich mit dem zusammengeführten Stand abgeglichen wurden: [Quellprüfsummen](performance/cardpacks-2026-10-24/integration-source-sha256.json). Es wurden keine Tests abgeschwächt.
- Die Messwerkzeuge sind opt-in und verändern weder den Offline-Kern noch die Pflicht-Testauswahl. Ein falscher anfänglicher Sichtbarkeits-Messpunkt (`game-grid` ist beim Start verborgen), kollidierende gzip-Cache-Schlüssel und unvollständige Service-Worker-Netzwerkzählung wurden korrigiert.
- Temporär blockierende lokale Dateizugriffe wurden durch lokale Prüfkopien und die identische Wiederherstellung gesicherter Git-Objekte umgangen bzw. behoben. Unvollständige Messläufe sind keine Grundlage der Tabellen. Reale Gruppen-/Gerätenutzung und Betreiberfreigaben bleiben offen: **NO_GO**.
