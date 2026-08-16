# Secret Circle – Wartung, Migration und Lebenszyklus

Stand: 16. August 2026  
Status: **PREPARED**

## 1. Ziel

Secret Circle soll nach dem Januar-2027-Release wartbar bleiben, ohne lokale Nutzerdaten, Offlinefähigkeit oder Kernspielverträge durch unkontrollierte Änderungen zu beschädigen.

Wartung umfasst nicht nur Bugfixes, sondern auch:

- Browser-/PWA-Änderungen
- Dependencies
- Daten-/Backupmigrationen
- Contentpflege
- Accessibility
- Security
- rechtliche Änderungen
- Support-/Incident-Lernen

## 2. Releasearten

### Patch

Beispiele:

- Bugfix
- Copy-/Accessibilitykorrektur
- einzelne Contentkorrektur
- kompatible Securityhärtung

Patch darf keine stillen inkompatiblen Datenänderungen enthalten.

### Minor

Beispiele:

- neue optionale Spielmechanik
- neue Creator-Vorlage
- größerer UX-Bereich
- kompatible Datenfelder

Benötigt Architektur-/Risiko-/Scopeprüfung.

### Major / migrationskritisch

Beispiele:

- inkompatibles Speicherschema
- Accounts/Cloudsync
- Backend/API
- Monetarisierung
- Mehrgeräte-Synchronisierung
- neue Berechtigungen
- Analytics/Ads

Diese Änderungen benötigen neue Produkt-, Privacy-, Security-, Legal- und Migrationsbewertung.

## 3. Stabile Verträge

Nicht ohne dokumentierte Migration ändern:

- Spiel-IDs
- Pack-IDs, wenn persistiert/referenziert
- Storage-Key-Familien
- Backupformat/-version
- Session-ID-/Completion-ID-Logik
- PWA-Scope/Manifest-ID
- aktive Session-Schemata
- Creator-Spiel-IDs

Anzeigenamen und redaktionelle Texte dürfen sich ändern, solange persistierte Identitäten stabil bleiben.

## 4. Datenmigrationen

Jede migrationsrelevante Änderung benötigt:

1. alte reale Snapshotstruktur
2. explizite Quellversion
3. reine Migrationsfunktion, soweit möglich
4. sichere Defaults für neue Felder
5. Validierung nach Migration
6. beschädigte Datenprobe
7. unbekannte neuere Version ablehnen/nicht überschreiben
8. Rollback-/Recoverystrategie
9. Test und Dokumentation

Keine Migration direkt auf Productiondaten entwerfen, ohne alte Snapshots getestet zu haben.

## 5. Backupwartung

`backup-schema-registry.js` ist Vertragsmittelpunkt.

Bei Änderungen:

- Registry-Version nur für Registry-/Policyänderung erhöhen
- Datei-Formatversion nur bei externer Schemaänderung erhöhen
- `BACKUP_SCHEMAS.md` synchronisieren
- Runtime darf keine abweichenden Grenzwerte duplizieren
- Allowlist neuer Storage-Key-Familien bewusst erweitern
- unbekannte Namespaces nicht „zur Sicherheit“ pauschal erlauben

## 6. PWA-/Service-Worker-Wartung

Bei jeder Änderung an offline benötigten Dateien:

1. CORE-Liste prüfen
2. Cachegeneration erhöhen
3. Staginggeneration synchron erhöhen
4. Service-Worker-Vertrag/Test aktualisieren
5. Architektur/Deployment/Status synchronisieren
6. Alt→Neu-Update später auf realen Geräten prüfen

Nie eine bereits ausgelieferte Cachegeneration für andere Inhalte wiederverwenden.

## 7. Dependency-Wartung

Vor Release wird zunächst ein reproduzierbares `package-lock.json` benötigt.

Danach regelmäßig:

- bekannte Schwachstellen prüfen
- Major-Updates nicht blind automatisch mergen
- Lizenzänderungen prüfen
- unmaintained/abandoned Packages bewerten
- Dependencies minimieren
- Playwright-/Node-Baseline bewusst ändern und Tests anpassen

Production-Runtime bleibt nach Möglichkeit ohne unnötige npm-Laufzeitdependencies.

## 8. Browser-/Plattformwartung

Mindestens vor jedem größeren Release erneut prüfen:

- aktuelles iOS/Safari-PWA-Verhalten
- aktuelles Android/Chrome-Verhalten
- Firefox/WebKit/Chromium
- Service Worker
- Background/Lockscreen bei Timern
- Storage-/Quota-Verhalten
- Standalone Safe Areas
- Reduced Motion
- Screenreader

R-022 im `RISK_REGISTER.md` bleibt deshalb ein laufendes Plattformrisiko bis RC.

## 9. Contentwartung

Neue Built-in-Inhalte müssen:

- `CONTENT_AGE_POLICY.md` erfüllen
- keine kopierten Konkurrenzkarten sein
- Privacy/Safety prüfen
- Altersstufe erhalten
- Duplikat-/Strukturtests bestehen
- bei Core-Games die Mindesttiefe nicht verringern

Bei gemeldeten problematischen Karten:

- Karte identifizieren
- Severity festlegen
- ersetzen/entfernen
- wenn sinnvoll Regressiontest ergänzen
- Reviewmatrix aktualisieren

## 10. Accessibility-Wartung

Jede neue UI muss weiterhin:

- Tastatur
- Fokus
- Labels
- Status
- 44px kritische Touchziele
- Reduced Motion
- Reflow/Zoom
- Screenreaderplausibilität

berücksichtigen.

Ein visueller Redesign darf bestehende Accessibility-Verträge nicht als „späteren Cleanup“ zurückstellen.

## 11. Security-/Privacy-Wartung

Bei jeder neuen Funktion fragen:

- neue Daten?
- neue Netzwerkverbindung?
- neue Berechtigung?
- neue Storage-Familie?
- neue Third Party?
- neue geheime Inhalte?
- neue Importfläche?

Bei Ja:

- Threat Model
- Risk Register
- Privacy
- Backup
- Legal
- Tests

aktualisieren.

## 12. Dokumentationspflege

Folgende Dokumente gelten als releasekritische Verträge:

- `APP_ENTWICKLUNG_VON_A_BIS_Z.md`
- `APP_DEVELOPMENT_STATUS.md`
- `ARCHITECTURE.md`
- `REQUIREMENTS.md`
- `SECURITY.md`
- `THREAT_MODEL.md`
- `RISK_REGISTER.md`
- `BACKUP_SCHEMAS.md`
- `CONTENT_AGE_POLICY.md`
- `CORE_CONTENT_REVIEW.md`
- `ACCESSIBILITY.md`
- `LEGAL_CHECKLIST.md`
- `SUPPORT.md`
- `INCIDENT_RESPONSE.md`
- `DEPLOYMENT.md`
- `RELEASE_CHECKLIST.md`

Bei einer Änderung darf Code nicht absichtlich einem alten Dokument widersprechen und umgekehrt.

## 13. Wartungsrhythmus nach Release

### Bei jedem Patch

- betroffenen Vertrag/Test prüfen
- Changelog
- PWA-Version nur wenn Offline-Core geändert wurde
- Smoke-Test

### Monatlich oder gebündelt

- offene Bugs/Supportsignale
- Dependency-/Browserlage
- Contentmeldungen
- Risk Register

### Vor jedem größeren Release

- vollständige RC-Gates
- Rechts-/Privacy-Updatecheck
- Geräte/A11y
- Backup/Migration
- Rollbackprobe

## 14. Deprecation

Eine alte Funktion/Storagestruktur wird nicht einfach entfernt.

Ablauf:

1. Nutzung/Abhängigkeiten identifizieren
2. Migrations-/Fallbackpfad bereitstellen
3. mindestens eine kompatible Übergangsphase, wenn Daten betroffen sind
4. alte Struktur erst entfernen, wenn Tests/Snapshots zeigen, dass Daten nicht verloren gehen
5. Changelog/Architecture aktualisieren

## 15. End-of-Life / Aufgabe des Projekts

Falls Secret Circle irgendwann nicht weiterbetrieben wird:

- keine irreführenden Updateversprechen
- statische App nicht mit veralteten unsicheren Dependencies unbeaufsichtigt lassen
- Nutzer über Ende von Support/Hosting informieren, soweit ein öffentlicher Dienst besteht
- lokale Exportmöglichkeit möglichst vor Abschaltung erhalten
- Hosting/Domain/Legal-Seiten kontrolliert beenden

## 16. Release-Gates

`MAINTENANCE PASS` vor Production bedeutet:

- [ ] Verantwortliche für Updates bekannt
- [ ] Changelogprozess festgelegt
- [ ] Backup-/Migrationsvertrag dokumentiert
- [ ] PWA-Cacheprozess dokumentiert
- [ ] Incident-/Hotfixpfad dokumentiert
- [ ] Dependencystrategie nach Lockfile vorhanden
- [ ] Browser-/Plattformprüfung vor RC terminiert

Aktuell: **PREPARED – operative Umsetzung nach CI/Lockfile und vor RC weiter schließen**.
