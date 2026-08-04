# Secret Circle – Release-Status

Stand: 4. August 2026  
Version: `1.0.0-beta.3`  
Pull Request: `#3`  
Zielbranch: `main`

## Gesamtbewertung

| Bereich | Stand | Bewertung |
|---|---:|---|
| Kernspiel und Regeln | 98 % | Funktionsumfang vollständig für die lokale Partyspiel-Beta |
| Speicherung und Migration | 98 % | versioniert, streng validiert, migrierbar, sicherbar und vollständig löschbar |
| PWA und Offline-Struktur | 98 % | Cache-Version 15, vollständiger Offline-Core, Installationsicons, Manifest und Updateschutz |
| Accessibility und mobile Bedienung | 97 % | Live-Einrichtung, Safe Areas, automatische Kartenverdeckung und Accessibility-Gates; reale Screenreader- und Gerätetests fehlen |
| Automatisierte Testabdeckung | 98 % | Engine, Speicherung, Inhalte, Fuzz-Szenarien, E2E, Privatsphäre, Sicherheit und Cross-Browser-Smoke |
| Dokumentation und Release-Prozess | 98 % | Checkliste, Status, Testplan, Changelog, Sicherheit, Deployment und Rollback vorhanden |
| Reale Geräte- und Gruppentests | 35 % | noch nicht dokumentiert auf echten Geräten und mit echten Gruppen durchgeführt |
| Öffentliche rechtliche Freigabe | 45 % | Datenschutzgrundlage vorhanden; Verantwortliche-, Kontakt-, Hosting- und gegebenenfalls Impressumsangaben fehlen |

## Gewichteter Fortschritt

- **Technische Produktbeta:** etwa **98 %**
- **Bereit für einen kontrollierten lokalen Browser-Test:** etwa **97 %**
- **Bereit für reale Android-/iOS- und Party-Betatests:** etwa **94 %**
- **Bereit für einen öffentlichen Produktionsrelease:** etwa **89 %**

Die Prozentwerte sind eine technische Projektbewertung. Sie sind kein Beweis für Fehlerfreiheit und ersetzen keine erfolgreich ausgeführten Prüfungen.

## Abgeschlossene Release-Blöcke

- vollständiger Karten-, Diskussions-, Abstimmungs- und Ergebnisablauf
- mehrere Imposter, Punkte, Rangliste und Mehr-Runden-Matches
- begrenzte Stichwahl, Selbstwahl- und Doppelstimmenschutz
- 14 Kategorien und 168 redaktionell strukturierte Begriffe
- automatisierte Integritätsprüfung aller integrierten Begriffe und Hilfswörter
- keine Begriffswiederholung bis zum erschöpften Pool
- realzeitbasierter Timer mit Pause, Hintergrund- und Neulade-Wiederherstellung
- Wiederaufnahme aktiver Spiele
- Verlauf jeder abgeschlossenen Runde
- Speicherungsversion 7 und Migration älterer Daten und Spielstände
- beschädigte Daten werden kontrolliert verworfen
- vollständiger Backup-Export und -Import mit Größenlimit und Rollback
- vollständige lokale Datenlöschung
- Live-Anzeige erkannter Personen und des gültigen Imposter-Bereichs
- automatische Korrektur einer zu hohen Imposter-Zahl bei kleinerer Gruppe
- iPhone-Safe-Areas, dynamische Viewport-Höhe und zoomsichere Formulare
- automatische Verdeckung einer sichtbaren geheimen Karte bei Fokusverlust oder App-Wechsel
- blockierte Kartenweitergabe, solange eine automatisch verdeckte Karte nicht erneut geöffnet wurde
- Wiederherstellung des sicheren Fokus nach Rückkehr zur App
- Offline-PWA mit Cache-Version 15
- 192- und 512-Pixel-PNG-Icons sowie mobile Installationsmetadaten
- Laufzeit-Fehlerschutz, sichtbare Ressourcenausfälle und sicherer PWA-Update-Neustart
- Content Security Policy, Datenschutzseite und Eingabe-Escaping
- Grenzwerttests mit 3 bis 20 Personen und mehreren Impostern
- deterministische Fuzz-Szenarien mit Engine-Invarianten
- Desktop-/Mobile-E2E-, Privatsphäre-, Sicherheits-, Accessibility- und Cross-Browser-Suiten
- Chromium-, Firefox-, WebKit-, Android- und iPhone-Smoke-Konfiguration
- Repository-Hygiene und Offline-Core-Performancebudget
- strukturierter HTML-, Manifest-, Service-Worker- und Asset-Validator
- veraltete, nicht mehr geladene Accessibility- und Match-Dateien entfernt
- Release-Checkliste, manueller Testplan, Changelog, Einschränkungen, Sicherheitsrichtlinie, Deployment und Rollback

## Aktuelle Blocker

### 1. GitHub Actions startet keinen ersten Schritt

Der Workflow endet weiterhin vor `actions/checkout`. Es existieren keine Schrittdaten und keine normalen Job-Logs. Deshalb gibt es noch keinen grünen CI-Nachweis für den endgültigen Commit. Details: `CI_TROUBLESHOOTING.md`.

### 2. Vollständiger lokaler Testlauf muss protokolliert werden

Erforderlich:

```bash
npm install --ignore-scripts --no-audit --no-fund --package-lock=false
npx playwright install --with-deps chromium
npm run ci
```

Zusätzlich:

```bash
npx playwright install --with-deps chromium firefox webkit
npm run test:cross-browser
```

### 3. Reale Geräte fehlen

Mindestens prüfen:

- aktuelles Android-Gerät mit Chrome,
- aktuelles iPhone oder iPad mit Safari,
- Installation, Offline-Start und App-Update,
- Timer bei Hintergrund, Sperrbildschirm und Energiesparmodus,
- automatische Kartenverdeckung und blockierte Weitergabe bei App-Wechsel,
- Bildschirmrotation und sichere Bildschirmränder.

### 4. Reale Partytests fehlen

Mindestens zwei dokumentierte Gruppen:

- 3–4 Personen,
- 8 oder mehr Personen,
- mindestens ein Match mit mehreren Impostern.

### 5. Öffentliche Anbieterinformationen fehlen

Vor einer öffentlichen oder kommerziellen Veröffentlichung müssen die für das konkrete Hosting und Angebot erforderlichen Verantwortlichen-, Kontakt-, Hosting- und gegebenenfalls Impressumsangaben ergänzt werden.

## Freigabestatus

- **Weiterentwicklung auf dem PR-Branch:** `GO`
- **Code-Review:** `GO`
- **Kontrollierter lokaler Browser-Betatest:** `GO_WITH_CONDITIONS`
- **Realer Geräte- und Party-Betatest:** `GO_WITH_CONDITIONS`
- **Merge in `main`:** `NO_GO`, bis mindestens ein vollständiger lokaler CI-Lauf erfolgreich protokolliert und die Branch-Differenz final geprüft ist
- **Öffentlicher Produktionsrelease:** `NO_GO`

## Nächste Freigabeschwelle

Die App kann als **Release Candidate** bezeichnet werden, sobald:

1. `npm run ci` lokal vollständig erfolgreich ist,
2. der Cross-Browser-Smoke-Test erfolgreich ist,
3. GitHub Actions wieder echte Schritte ausführt und grün endet,
4. Android- und iOS-Smoke-Tests bestanden sind,
5. mindestens ein kleiner und ein großer Partytest bestanden sind,
6. keine kritischen oder hohen Fehler offen sind.
