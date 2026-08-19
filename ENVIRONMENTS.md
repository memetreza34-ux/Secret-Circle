# Secret Circle – Umgebungen und Staging-Vertrag

Stand: 19. August 2026  
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

Aktuell: **BLOCKED**. `CI_TROUBLESHOOTING.md` führt den jeweils neuesten belastbaren Actions-Befund; wiederholt enden Jobs vor Repository-Steps mit `steps: []`.

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

## 5. Automatisierter HTTPS-Smoke

`scripts/staging_smoke.py` prüft eine **wirklich ausgelieferte HTTPS-Origin** mit Python-Standardbibliothek. Es werden keine neuen Runtime- oder npm-Abhängigkeiten benötigt.

Staging:

```bash
npm run staging:smoke -- https://STAGING-ORIGIN/ --expected-cache secret-circle-v43
```

Production nach Freigabe:

```bash
npm run staging:smoke -- https://PRODUCTION-ORIGIN/ --expected-cache secret-circle-v43 --production
```

Der Smoke prüft unter anderem:

- HTTPS zwingend
- Redirects bleiben auf derselben Origin
- begrenzte Downloadgrößen
- Kernseiten und Query-Routen HTTP 200
- Manifest und `standalone`-Vertrag
- echte PNG-IHDR-Dimensionen 192×192 / 512×512
- Service-Worker-Cachegeneration und Staging-Cache-Synchronität
- Registry-vor-Datentools-Ladereihenfolge
- v43-Privacy-Source-Vertrag
- Reference-Safe-Vertrag für Anime-Archetypen, Spektrum-Tipp, Tab und Löwe
- v38-Viral-Ersatzformulierungen
- im `--production`-Modus zusätzliche Placeholder-Prüfungen öffentlicher Dateien

`scripts/staging_smoke_contract_audit.py` schützt Aufbau, Dokumentation und npm-Script statisch und läuft in `npm run validate`.

**Wichtig:** Dieser HTTP-Smoke beweist nicht Service-Worker-Installation, Offline-Neustart, Updatebanner, lokale Datenmigration, VoiceOver/TalkBack oder reale Gerätefunktion. Diese Nachweise bleiben Browser-/PWA-/Realgerät-Gates.

## 6. Release Candidate

Ein RC ist kein eigener Codezweig mit zusätzlichen Fixes nach der Freigabe.

RC-Vertrag:

- exakter Commit SHA dokumentiert
- exakte App-Version dokumentiert
- exakte Cachegeneration dokumentiert
- Tests beziehen sich auf denselben Commit
- HTTPS-Smoke bezieht sich auf das Deployment desselben Commits
- nach einem Fix entsteht ein neuer RC-Kandidat
- Production erhält denselben freigegebenen statischen Stand

## 7. Production

Vor Promotion:

- CI/Cross-Browser grün
- Branch Protection nach `BRANCH_PROTECTION.md` bestätigt
- automatisierter HTTPS-Staging-Smoke grün
- manueller Staging-/PWA-Smoke grün
- Geräte/A11y grün
- PWA Upgrade/Rollback geprüft
- reale Gruppen abgeschlossen
- Legal/Support/Third-Party/Fan-Content final
- keine offenen Critical/High Bugs

Production darf nicht als Ort für den ersten echten Service-Worker-Test dienen.

## 8. Datenisolation

Für Local/Staging bevorzugt neutrale Spielernamen und generische Creator-Karten; keine echten privaten Nachrichten/Fotos und keine sensiblen personenbezogenen Testbackups.

Ein Staging-Backup ist nicht automatisch ein Productionbackup. Beim bewussten Cross-Environment-Test Datei kopieren, personenbezogene Testinhalte vermeiden und Quellumgebung/Commit notieren.

## 9. PWA-/Cache-Regeln je Umgebung

Der Quellcode besitzt aktuell **`secret-circle-v43`**.

- v37 brachte den Reference-Safe-Pass für das Anime-Archetypen-Quiz im finalen Runtime-Katalog.
- v38 ersetzte drei unnötig konkrete Sport-/Eventreferenzen im Viral-`higher-lower`.
- v39 entfernte `Chrome` aus dem finalen Tabu-Content und zeigt `wavelength` als **Spektrum-Tipp**.
- v40 entfernte die 40 historischen konkreten Anime-Figurennamen zusätzlich physisch aus `party-mega-catalog.js`.
- v41 verankert `Spektrum-Tipp` und `Tab` upstream, setzt Classic Content auf v4, ersetzt `Löwenkönig` durch einen generischen Löwenhinweis und nimmt den zentralen Reference-Source-Audit in `npm run validate` auf.
- v42 repariert den PWA-Rastervertrag: echtes 192×192- und 512×512-PNG, SHA-256-/IHDR-/Manifestprüfung im Asset-Audit.
- v43 entfernt die zwei früheren Private-Device-Truth/Dare-Prompts physisch aus `party-catalog.js` und nimmt einen globalen Privacy-Content-Audit in `npm run validate` auf.

Regeln:

- nie Cachegeneration wiederverwenden, wenn Offline-Core-Inhalte geändert wurden
- Staging- und Production-Origin dürfen denselben Cache-Namen tragen, weil Caches originisoliert sind
- Upgradepfade immer aus wirklich installierter alter Version testen
- Rollback veröffentlicht ebenfalls eine neue Cachegeneration

## 10. Environment-Konfiguration

V1 benötigt derzeit keine Runtime-Secrets und kein Backend-Environment-File.

Falls später hinzugefügt werden: `.env.example` ohne Geheimnisse, getrennte dev/test/staging/prod-Werte, keine Production-Keys in Test, Secret Store statt Commit und Rotation/Revoke-Prozess.

## 11. Manueller Staging-Smoke

Zusätzlich zum automatisierten HTTP-Smoke mindestens:

- Service Worker registriert
- Installation möglich und Icon sichtbar korrekt
- Offline-Neustart
- finaler Katalog im Browser
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

## 12. Rollbackprobe

Auf Staging:

1. Version A real installieren
2. Testdaten und aktive Session anlegen
3. RC-Version B veröffentlichen
4. B bewusst aktivieren
5. Rollback-/Hotfix-Version C mit neuer Cachegeneration veröffentlichen
6. lokale Daten erhalten
7. Offline-Neustart prüfen
8. automatisierten HTTP-Smoke auf C ausführen
9. Ergebnis dokumentieren

## 13. Environment-Nachweis

Vor Production dokumentieren:

```text
Local baseline:
CI run URL/id:
Staging URL:
Staging commit:
Staging cache:
Staging smoke command/result:
RC commit:
RC cache:
Production URL:
Production commit:
Production cache:
Production smoke command/result:
Rollback tested from/to:
```

## 14. Release-Gate

Vor `ENVIRONMENT / STAGING PASS`:

- [ ] konkrete getrennte HTTPS-Staging-Origin festgelegt
- [ ] Production-Origin festgelegt
- [ ] Staging öffentlich erreichbar und installierbar
- [ ] `scripts/staging_smoke.py` gegen Staging grün
- [ ] manueller Browser-/PWA-Smoke abgeschlossen
- [ ] Upgrade von mindestens zwei älteren Versionen abgeschlossen
- [ ] Rollbackprobe abgeschlossen
- [ ] Datenisolation bestätigt
- [ ] derselbe freigegebene RC-Commit für Production vorgesehen

Bis dahin bleibt R-019 **OFFEN** und Production **NO_GO**.
