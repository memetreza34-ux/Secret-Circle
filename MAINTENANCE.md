# Secret Circle – Wartung, Migration und Lebenszyklus

Stand: 26. August 2026  
Status: **PREPARED**  
Aktueller Offline-Core: **`secret-circle-v51` / `secret-circle-v51-staging`**

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
- exakte persistierte Storage-Keys und deren Versionen
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

## 5. Backupwartung – v51+

`backup-schema-registry.js` ist Vertragsmittelpunkt. Registry-Version 2 besitzt für Complete Restore aktuell **16 explizite heutige Storage-Keys**. `party-data-tools.js` Version 6 konsumiert diesen Vertrag.

Bei Änderungen:

- Registry-Version nur für Registry-/Policyänderung erhöhen
- Datei-Formatversion nur bei externer Backup-Schemaänderung erhöhen
- `BACKUP_SCHEMAS.md` synchronisieren
- Runtime darf keine abweichenden Complete-Format-/Limitwerte duplizieren
- neuen Storage-Key **nicht automatisch** über eine Wildcard in den alten Restore aufnehmen
- für jeden neuen managed Key Root-Typ, aktuelle Storage-Version und minimale Pflichtstruktur definieren
- Eigentümer/runtime source für jeden managed Key nachweisbar halten
- unbekannte oder zukünftige Namespaces/Storage-Versionen nicht „zur Sicherheit“ pauschal verwalten
- Forward-Compatibility entscheiden: ältere Runtime darf neuere lokale Daten nicht still löschen
- `tests/backup-schema-registry.test.js`, `tests/e2e/party-data.spec.js`, `tests/e2e/backup-forward-compat.spec.js` und `scripts/backup_contract_audit.py` anpassen
- bei Offline-Core-Änderung Cachegeneration erhöhen

Eine neue Storage-Version wie `secret-circle-party-hub-v2` gehört **nicht** automatisch dem heutigen v1-Restore. Erst nach expliziter Migration-/Backupentscheidung darf sie in eine neue Registry-Allowlist aufgenommen werden.

## 6. PWA-/Service-Worker-Wartung

Bei jeder Änderung an offline benötigten Dateien:

1. CORE-Liste prüfen
2. Cachegeneration erhöhen
3. Staginggeneration synchron erhöhen
4. Service-Worker-Vertrag/Test aktualisieren
5. Architektur/Deployment/Status synchronisieren
6. Alt→Neu-Update später auf realen Geräten prüfen

Nie eine bereits ausgelieferte Cachegeneration für andere Inhalte wiederverwenden.

Rollback/Hotfix erhält ebenfalls eine neue Generation.

## 7. Dependency-Wartung

Der reproduzierbare Repositoryvertrag ist vorhanden:

- `package-lock.json` v3
- CI/Cross-Browser verwenden `npm ci`
- Playwright exakt 1.54.2
- keine npm-Runtime-Dependencies

Regelmäßig:

- bekannte Schwachstellen prüfen
- Major-Updates nicht blind automatisch mergen
- Lizenzänderungen prüfen
- unmaintained/abandoned Packages bewerten
- Dependencies minimieren
- Playwright-/Node-Baseline bewusst ändern und Tests anpassen

**Noch offen:** echter Online-`npm ci`-/Runner-PASS auf dem unveränderten RC.

## 8. Browser-/Plattformwartung

Mindestens vor jedem größeren Release erneut prüfen:

- aktuelles iOS/Safari-PWA-Verhalten
- aktuelles Android/Chrome-Verhalten
- Firefox/WebKit/Chromium
- Service Worker
- Background/Lockscreen bei Timern
- Storage-/Quota-Verhalten
- Complete-Backup-Restore/BK51
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
- neuer persistierter Storage-Key oder neue Storage-Version?
- neue Third Party?
- neue geheime Inhalte?
- neue Importfläche?

Bei Ja:

- Threat Model
- Risk Register
- Privacy
- Backup/Registry
- Legal
- Tests

aktualisieren.

Ein neuer persistierter Key benötigt außerdem explizite Entscheidung, ob und ab welcher App-/Backupversion er Teil eines Complete Backups ist.

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
- Backup/Migration/BK51
- Rollbackprobe

## 14. Deprecation

Eine alte Funktion/Storagestruktur wird nicht einfach entfernt.

Ablauf:

1. Nutzung/Abhängigkeiten identifizieren
2. Migrations-/Fallbackpfad bereitstellen
3. mindestens eine kompatible Übergangsphase, wenn Daten betroffen sind
4. Future-/unbekannte Daten nicht durch ältere Restore-Logik besitzen oder löschen
5. alte Struktur erst entfernen, wenn Tests/Snapshots zeigen, dass Daten nicht verloren gehen
6. Changelog/Architecture/Backup-Registry aktualisieren

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
- [x] Changelogprozess festgelegt
- [x] Backup-/Migrationsvertrag dokumentiert
- [x] PWA-Cacheprozess dokumentiert
- [x] Dependencystrategie nach Lockfile vorhanden
- [ ] BK51/Forward-Compatibility auf echtem RC ausgeführt
- [ ] Incident-/Hotfixpfad real belegt
- [ ] Browser-/Plattformprüfung vor RC terminiert/ausgeführt

Aktuell: **PREPARED – Source-/Wartungsverträge vorhanden; operative Runner-/Browser-/Geräte-/BK51-/Incident-Evidence bleibt offen**.