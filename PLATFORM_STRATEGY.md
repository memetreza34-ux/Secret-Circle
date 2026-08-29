# Secret Circle – Plattformstrategie

Stand: 16. August 2026

## 1. Ziel

Diese Datei legt verbindlich fest, auf welchen Plattformen Secret Circle im Januar 2027 veröffentlicht und getestet wird. Sie verhindert, dass Web/PWA, native Store-App und spätere Onlinefunktionen vermischt werden.

## 2. Primäre Releaseplattform

Secret Circle wird für Januar 2027 als **responsive, installierbare, offline-first Progressive Web App** veröffentlicht.

Technische Konsequenzen:

- Produktion über HTTPS
- statische Dateien
- Web App Manifest
- Service Worker
- kontrollierter Offline-Core
- lokale persistierte Daten
- kein verpflichtender Server
- kein verpflichtendes Benutzerkonto
- kein zwingender Netzwerkzugriff während eines laufenden Spieleabends

## 3. Zielgeräte

### Releasekritisch

- aktuelles Android-Smartphone mit Chrome
- aktuelles iPhone mit Safari
- iPad oder vergleichbares Tablet
- kleine Smartphonebreite
- Hochformat
- Querformat bei relevanten Kernflows

### Zusätzlich

- Chromium-basierter Desktop-Browser
- Firefox Desktop
- WebKit-basierte Testabdeckung

Desktop ist hilfreich für Entwicklung und zusätzliche Nutzung, darf aber mobile Probleme nicht verdecken.

## 4. Browserstrategie

Automatisiert vor Release:

- Chromium
- Firefox
- WebKit

Real vor Release:

- Android + Chrome
- iPhone + Safari
- Tablet/iPad

Eine emulierte Browserengine ersetzt keinen echten iOS-/Android-PWA-Test.

## 5. PWA-Vertrag

Secret Circle gilt nur als PWA-releasefähig, wenn folgende Wege real geprüft sind:

1. normaler Browserstart online
2. PWA installieren
3. installierte PWA online starten
4. Offline-Neustart nach vorherigem Laden/Installieren
5. aktive Session unterbrechen
6. Appwechsel
7. Sperrbildschirm
8. Reload
9. Browser-/PWA-Neustart
10. Update auf neue Version
11. Update während aktiver Session
12. fehlgeschlagene Cache-Promotion
13. Rollbackdeployment

## 6. Offline-Definition

„Offline-first“ bedeutet für Secret Circle nicht, dass eine nie zuvor geladene Webseite ohne irgendeine Vorinstallation aus dem Nichts verfügbar sein muss.

Gemeint ist:

- Kernressourcen werden bei erfolgreicher Nutzung/Installation lokal bereitgestellt
- danach können Kernflows ohne aktive Internetverbindung gestartet werden
- laufende lokale Spiele hängen nicht von einem externen Runtime-Dienst ab
- lokale Daten bleiben offline nutzbar
- Query-Routen und Enginefamilien müssen aus dem Offline-Core funktionieren

## 7. Netzwerkstrategie

Für Januar 2027 gilt:

- keine verpflichtenden externen APIs
- keine Analytics
- keine Werbung
- keine Cloud-Datenbank
- keine Remote-Authentifizierung
- keine externen Schriftarten/CDNs zur Laufzeit

Jeder neue Netzwerkzugriff benötigt vor Aufnahme:

- Produktbegründung
- Datenschutzprüfung
- Securityprüfung
- Offline-Fallback
- Fehler-/Timeout-Vertrag
- Dokumentation

## 8. Native Android-/iOS-App

Eine native Veröffentlichung über Google Play oder Apple App Store ist **nicht Bestandteil des Januar-2027-Release-Gates**.

Falls später eine native Hülle geplant wird, muss sie als eigene Plattformphase behandelt werden. Dann zusätzlich nötig:

- Package-/Bundle-ID
- Signing
- Entwicklerkonten
- native Berechtigungen
- Deep Links
- Store-Metadaten
- Store-Datenschutzangaben
- Testtracks/TestFlight
- Reviewprozess
- kontrollierter Rollout
- Store-spezifischer Update-/Rollbackprozess

Die PWA darf nicht ungeprüft nur „eingepackt“ und als native App betrachtet werden.

## 9. Backend/Online-Multiplayer

Nicht Teil von Version 1.

Falls später eingeführt, entstehen neue Anforderungen an:

- Authentifizierung
- Autorisierung
- API
- Datenbank
- Datenschutz
- Moderation
- Abuse-Schutz
- Rate Limits
- Synchronisation
- Konfliktauflösung
- Backups
- Betrieb/Monitoring
- Kosten

Diese Änderung würde eine neue Architekturentscheidung und wahrscheinlich eine eigene Major-Version rechtfertigen.

## 10. Mindestfähigkeiten des Zielgeräts

Kernprodukt sollte mit standardmäßigen modernen Browserfunktionen funktionieren. Komfortfunktionen dürfen progressive Enhancement nutzen.

Wichtig:

- Local Storage bzw. unterstützte lokale Persistenz
- Service Worker für PWA/Offline
- moderne DOM-/JavaScript-Unterstützung
- Touchbedienung
- Audio nur, falls lokal und optional verwendet
- Wake Lock nur als Komfort, niemals als einzige Funktionsgrundlage

Wenn eine optionale Browser-API nicht verfügbar ist, muss die Kernmechanik weiterhin verständlich bleiben oder die Einschränkung klar erklärt werden.

## 11. Safe Areas und mobile UI

Auf iPhone/iPad besonders prüfen:

- Notch/Dynamic-Island-/Safe-Area-Abstände
- Home Indicator
- Bildschirmtastatur
- Modals/Bottom Controls
- 44×44-Pixel-Touchziele
- Scrollbarkeit bei Zoom
- keine wichtigen Controls hinter Browser-/PWA-Chrome

## 12. Deploymentstufen

### Local

Lokale Entwicklung über HTTP, z. B. `python -m http.server 8080`.

### CI/Test

Automatisierte Syntax-, Unit-, Contract-, Audit- und Browserprüfungen.

### Preview/Staging

Releaseähnliches HTTPS-Deployment vor Produktion. Hier müssen Service Worker, Manifest, Caching und Updatepfade unter echten Origin-Bedingungen geprüft werden.

### Production

Nur freigegebener Release-Commit/Tag. Keine direkten experimentellen Änderungen.

## 13. Veröffentlichungsweg Januar 2027

Aktuell bevorzugter Weg:

1. Release-Commit freigeben
2. unveränderlichen Tag setzen
3. statische PWA über HTTPS deployen
4. Produktions-Smoke-Test
5. Installation auf Android/iPhone prüfen
6. Offline-Neustart prüfen
7. Update-/Rollbackfähigkeit bestätigen
8. Release Notes veröffentlichen

Der konkrete Hostinganbieter kann separat entschieden werden, darf aber die technischen Releaseverträge nicht verändern.

## 14. Plattform-Definition of Done

- [ ] HTTPS-Staging vorhanden
- [ ] Chromium/Firefox/WebKit automatisiert grün
- [ ] Android/Chrome real getestet
- [ ] iPhone/Safari real getestet
- [ ] Tablet/iPad real getestet
- [ ] Hoch-/Querformat relevant geprüft
- [ ] kleine Displays geprüft
- [ ] 200 % Zoom geprüft
- [ ] Bildschirmtastatur/Safe Areas geprüft
- [ ] PWA-Installation geprüft
- [ ] Offline-Neustart geprüft
- [ ] Appwechsel/Sperrbildschirm geprüft
- [ ] Update alte→neue Version geprüft
- [ ] Update während aktiver Session geprüft
- [ ] Rollbackdeployment geprüft

Solange diese Liste nicht belegt ist, bleibt die Plattformfreigabe **NO_GO**.
