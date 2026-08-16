# Secret Circle – Umgebungen und Staging-Vertrag

Stand: 16. August 2026  
Status: **PREPARED – konkrete HTTPS-Staging-URL offen**

## 1. Ziel

Secret Circle besitzt keinen klassischen Backend-Stack, benötigt aber trotzdem getrennte Umgebungen. Service Worker, `localStorage`, installierte PWAs und Offline-Caches sind originabhängig. Ein schlecht getrenntes Staging kann deshalb echte Productiondaten oder installierte Testzustände verfälschen.

Verbindliche Reihenfolge:

**Local → CI/Test → HTTPS-Staging → Release Candidate → Production**

## 2. Local

Zweck: Entwicklung, schnelle Syntax-/Unit-/Validatorläufe und lokaler Playwright-Webserver. Keine Releasefreigabe.

Aktueller lokaler Testserver: `http://127.0.0.1:4173`.

Regeln:

- keine Productiondaten verwenden
- keine echten privaten Backups als Standard-Testfixture
- lokale erfolgreiche Tests ersetzen CI/Realgeräte nicht

## 3. CI/Test

Releaseanforderung:

- echter GitHub-Actions-Runner
- sichtbarer Checkout und sichtbare Steps
- `package-lock.json`
- `npm ci`
- `npm run ci`
- Cross-Browser

Aktuell: **BLOCKED**, da geprüfte Actions-Läufe weiterhin vor Repository-Steps enden.

## 4. HTTPS-Staging

Staging ist der erste echte Hosting-/Service-Worker-/Installationsraum vor Production und muss eine **getrennte Origin** besitzen.

Schematisches Beispiel:

```text
https://staging.example.invalid/
https://app.example.invalid/
```

Die tatsächlichen Domains werden vor Deployment festgelegt.

Warum getrennte Origin:

- `localStorage` wird nach Origin getrennt
- Service-Worker-Registrierung/-Cache wird nach Origin getrennt
- installierte PWA-Zustände vermischen sich nicht
- Staging-Tests löschen/überschreiben nicht versehentlich Productiondaten

Nicht empfohlen: Staging und Production nur über Queryparameter derselben Origin unterscheiden.

## 5. Release Candidate

Ein RC ist kein eigener Codezweig mit zusätzlichen Fixes nach der Freigabe.

RC-Vertrag:

- exakter Commit SHA dokumentiert
- exakte App-Version dokumentiert
- exakte Cachegeneration dokumentiert
- Tests beziehen sich auf denselben Commit
- nach einem Fix entsteht ein neuer RC-Kandidat
- Production erhält denselben freigegebenen statischen Stand

## 6. Production

Vor Promotion:

- CI/Cross-Browser grün
- Staging-Smoke grün
- Geräte/A11y grün
- PWA Upgrade/Rollback geprüft
- reale Gruppen abgeschlossen
- Legal/Support/Third-Party/Fan-Content final
- keine offenen Critical/High Bugs

Production darf nicht als Ort für den ersten echten Service-Worker-Test dienen.

## 7. Datenisolation

Für Local/Staging bevorzugt neutrale Spielernamen und generische Creator-Karten; keine echten privaten Nachrichten/Fotos und keine sensiblen personenbezogenen Testbackups.

Ein Staging-Backup ist nicht automatisch ein Productionbackup. Beim bewussten Cross-Environment-Test Datei kopieren, personenbezogene Testinhalte vermeiden und Quellumgebung/Commit notieren.

## 8. PWA-/Cache-Regeln je Umgebung

Der Quellcode besitzt aktuell **`secret-circle-v38`**.

- v37 brachte den Reference-Safe-Pass für das Anime-Archetypen-Quiz.
- v38 ersetzt zusätzlich drei unnötig konkrete Sport-/Eventreferenzen im Viral-`higher-lower` durch generische Fragen mit denselben Zahlenwerten.

Regeln:

- nie Cachegeneration wiederverwenden, wenn Offline-Core-Inhalte geändert wurden
- Staging- und Production-Origin dürfen denselben Cache-Namen tragen, weil Caches originisoliert sind
- Upgradepfade immer aus wirklich installierter alter Version testen
- Rollback veröffentlicht ebenfalls eine neue Cachegeneration

## 9. Environment-Konfiguration

V1 benötigt derzeit keine Runtime-Secrets und kein Backend-Environment-File.

Falls später hinzugefügt werden: `.env.example` ohne Geheimnisse, getrennte dev/test/staging/prod-Werte, keine Production-Keys in Test, Secret Store statt Commit und Rotation/Revoke-Prozess.

## 10. Staging-Smoke-Test

Mindestens:

- alle Kernseiten HTTP 200
- Manifest + Icons
- Service Worker registriert
- Installation möglich
- Offline-Neustart
- finaler Katalog
- `anime-guess` zeigt nur generische Archetypen
- Viral-Sportpack enthält die v38-Ersatzfragen
- Hub-Datenbereich startet ohne Registryfehler
- Export/Import mit neutralen Daten
- ein direktes Hub-Core-Spiel
- ein Timer-Core-Spiel
- ein Advanced-Core-Spiel
- Word Imposter
- Creator
- Updatebanner
- aktive Session während Update
- Privacy-/Legalnavigation

## 11. Rollbackprobe

Auf Staging:

1. Version A real installieren
2. Testdaten und aktive Session anlegen
3. RC-Version B veröffentlichen
4. B bewusst aktivieren
5. Rollback-/Hotfix-Version C mit neuer Cachegeneration veröffentlichen
6. lokale Daten erhalten
7. Offline-Neustart prüfen
8. Ergebnis dokumentieren

## 12. Environment-Nachweis

Vor Production dokumentieren:

```text
Local baseline:
CI run URL/id:
Staging URL:
Staging commit:
Staging cache:
RC commit:
RC cache:
Production URL:
Production commit:
Production cache:
Rollback tested from/to:
```

## 13. Release-Gate

Vor `ENVIRONMENT / STAGING PASS`:

- [ ] konkrete getrennte HTTPS-Staging-Origin festgelegt
- [ ] Production-Origin festgelegt
- [ ] Staging öffentlich erreichbar und installierbar
- [ ] Smoke-Test abgeschlossen
- [ ] Upgrade von mindestens zwei älteren Versionen abgeschlossen
- [ ] Rollbackprobe abgeschlossen
- [ ] Datenisolation bestätigt
- [ ] derselbe freigegebene RC-Commit für Production vorgesehen

Bis dahin bleibt R-019 **OFFEN** und Production **NO_GO**.
