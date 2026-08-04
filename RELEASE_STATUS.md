# Secret Circle – Release-Status

Stand: 4. August 2026  
Version: `1.0.0-beta.3`  
Pull Request: `#3`  
Zielbranch: `main`

## Gesamtbewertung

| Bereich | Stand | Bewertung |
|---|---:|---|
| Kernspiel und Regeln | 99 % | vollständiger lokaler Partyspiel-Ablauf; unabhängige Rollenverteilung ergänzt |
| Speicherung und Migration | 98 % | versioniert, validiert, migrierbar, sicherbar und vollständig löschbar |
| PWA und Offline-Struktur | 98 % | Cache-Version 17 mit vollständigem Offline-Core und Installationsmetadaten |
| Accessibility und mobile Bedienung | 97 % | Live-Setup, Safe Areas, Karten-Sichtschutz, Wake Lock und Accessibility-Gates |
| Automatisierte Testabdeckung | 98 % | fünf Unit-Suiten, vierzehn E2E-Suiten, Fuzz- und Cross-Browser-Struktur |
| Dokumentation und Release-Prozess | 98 % | Checkliste, Testplan, Sicherheit, Deployment und Rollback vorhanden |
| Reale Geräte- und Gruppentests | 35 % | noch nicht dokumentiert durchgeführt |
| Öffentliche rechtliche Freigabe | 45 % | Anbieter-, Kontakt-, Hosting- und gegebenenfalls Impressumsangaben fehlen |

## Gewichteter Fortschritt

- **Technische Produktbeta:** etwa **98 %**
- **Bereit für den vollständigen lokalen Testlauf:** etwa **98 %**
- **Bereit für reale Android-/iOS- und Party-Betatests:** etwa **95 %**
- **Bereit für einen öffentlichen Produktionsrelease:** etwa **90 %**

Die Prozentwerte sind eine technische Projektbewertung und kein Nachweis für Fehlerfreiheit.

## Kritische abgeschlossene Verbesserungen

- vollständiger Karten-, Diskussions-, Abstimmungs-, Rate- und Ergebnisablauf
- Punkte, Rangliste, Stichwahl und Mehr-Runden-Matches
- maximal sechs Imposter
- **unabhängige Rollenverteilung:** Imposter sind nicht mehr automatisch die ersten Personen der Aufdeckreihenfolge
- deterministische Wiederholbarkeit ohne sichtbares Rollen-Muster
- 14 Kategorien und 168 geprüfte Begriff-Hinweis-Paare
- Timer mit Hintergrund- und Neulade-Wiederherstellung
- Live-Gruppengröße und dynamische Imposter-Grenzen
- automatische Kartenverdeckung und blockierte Weitergabe nach App-Wechsel
- optionaler Wake Lock mit sicherem Fallback
- Speicherungsversion 7, Migration, beschädigte-Daten-Wiederherstellung und Backup-Rollback
- vollständige lokale Datenlöschung
- Offline-PWA mit Cache-Version 17
- CSP, Eingabe-Escaping, Datenschutzseite und Laufzeit-Fehlerschutz
- fünf Unit-Testdateien einschließlich Rollenverteilungs- und Fuzz-Tests
- vierzehn E2E-Suiten einschließlich Rollenverteilung, Privatsphäre und Wake Lock
- Chromium-, Firefox-, WebKit-, Android- und iPhone-Smoke-Konfiguration
- struktureller HTML-, Asset-, Manifest- und Service-Worker-Validator

## Aktuelle Blocker

### 1. GitHub Actions startet keinen ersten Schritt

Der Workflow endet weiterhin vor `actions/checkout` und liefert weder Schritte noch normale Logs. Ein erneuter Workflow-Versuch zeigte dasselbe Verhalten. Das externe Problem wird in Issue #7 verfolgt.

### 2. Vollständiger lokaler Testlauf ist noch nicht protokolliert

```bash
npm install --ignore-scripts --no-audit --no-fund --package-lock=false
npx playwright install --with-deps chromium
npm run ci

npx playwright install --with-deps chromium firefox webkit
npm run test:cross-browser
```

### 3. Reale Geräte- und Partytests fehlen

Issue #8 verfolgt:

- Android- und iPhone-/iPad-Installation
- Offline-Start und Update auf `secret-circle-v17`
- Timer, Karten-Sichtschutz und Wake Lock
- wiederholte Prüfung, dass die Aufdeckreihenfolge keinen Imposter verrät
- Partytest mit 3–4 Personen
- Partytest mit mindestens 8 Personen und mehreren Impostern

### 4. Öffentliche Anbieterinformationen fehlen

Vor einer öffentlichen oder kommerziellen Veröffentlichung müssen die erforderlichen Verantwortlichen-, Kontakt-, Hosting- und gegebenenfalls Impressumsangaben ergänzt werden.

## Freigabestatus

- **Code für vollständigen lokalen Testlauf:** `GO`
- **Kontrollierter Browser-Betatest:** `GO_WITH_CONDITIONS`
- **Realer Geräte- und Party-Betatest:** `GO_WITH_CONDITIONS`
- **Merge in `main`:** `NO_GO`, bis ein vollständiger Testlauf erfolgreich protokolliert ist
- **Öffentlicher Produktionsrelease:** `NO_GO`

## Release-Candidate-Schwelle

Die App wird erst als Release Candidate bezeichnet, wenn:

1. `npm run ci` erfolgreich ist,
2. `npm run test:cross-browser` erfolgreich ist,
3. GitHub Actions sichtbare Schritte ausführt und grün endet,
4. unabhängige Rollenverteilung, Installation, Offline-Modus, Sichtschutz und Wake Lock auf realen Geräten geprüft sind,
5. ein kleiner und ein großer Partytest bestanden sind,
6. keine kritischen oder hohen Fehler offen sind.
