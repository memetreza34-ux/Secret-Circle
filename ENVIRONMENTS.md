# Secret Circle – Umgebungen und Staging-Vertrag

Stand: 25. August 2026  
Status: **PREPARED – konkrete HTTPS-Staging-URL offen**  
Offline-Core: **`secret-circle-v49` / `secret-circle-v49-staging`**

## 1. Ziel

Secret Circle besitzt kein klassisches Backend, benötigt aber getrennte Umgebungen. `localStorage`, Service Worker, Cache Storage und installierte PWAs sind originabhängig.

Verbindliche Reihenfolge:

**Local → CI/Test → HTTPS-Staging → Release Candidate → Production**

## 2. Local

Lokale Entwicklung und schnelle Tests, aktuell typischerweise über `http://127.0.0.1:4173`. Local ist kein Releasebeweis.

Regeln:

- keine echten Productiondaten als Standardfixture
- keine unnötig privaten Backups
- lokale grüne Tests ersetzen CI/Staging/Realgeräte nicht

## 3. CI/Test

Releaseanforderungen:

- echter Runner mit sichtbaren Steps
- Checkout
- Online-`npm ci`
- `npm run ci`
- Cross-Browser auf demselben RC

Der aktuelle externe Runnerblocker wird in `CI_TROUBLESHOOTING.md` und Issue #7 geführt. `steps: []` ist kein Code-Test.

## 4. HTTPS-Staging

Staging ist der erste echte Hosting-/Service-Worker-/Installationsraum vor Production und muss eine **getrennte Origin** besitzen.

Warum:

- `localStorage` ist originisoliert
- Service Worker und Cache Storage sind originisoliert
- installierte PWA-Zustände bleiben getrennt
- Testdaten können Production nicht versehentlich überschreiben

Nur Queryparameter derselben Origin sind keine ausreichende Staging-Trennung.

## 5. Aktueller Cachevertrag

Quellstand:

- aktiv: `secret-circle-v49`
- staging: `secret-circle-v49-staging`

v49 nimmt den eigenständigen `party-hub-resume-guard.js` explizit in den Offline-Core auf und synchronisiert die Projekt-/Releasevalidatoren mit der realen v48/v49-Runtime-Ladereihenfolge.

Cachegenerationen werden nicht wiederverwendet, wenn sich eine offline benötigte Datei ändert. Rollback/Hotfix erhält ebenfalls eine neue Generation.

## 6. Automatisierter HTTPS-Smoke

Staging:

```bash
npm run staging:smoke -- https://STAGING-ORIGIN/ --expected-cache secret-circle-v49
```

Production:

```bash
npm run staging:smoke -- https://PRODUCTION-ORIGIN/ --expected-cache secret-circle-v49 --production
```

`scripts/staging_smoke.py` prüft unter anderem:

- HTTPS
- Same-Origin-Redirects
- Größenlimits
- Kernseiten und Query-Routen
- Manifest-/Standalone-Vertrag
- PNG-IHDR 192×192 / 512×512
- aktuelle Cachegeneration
- PWA-Head-Metadaten
- Backup-Registry-Ladereihenfolge
- Privacy-/Reference-Safe-Source
- Production-Placeholder-Grenzen

`scripts/staging_smoke_contract_audit.py` schützt diesen Vertrag statisch.

Der Netzwerk-Smoke beweist **nicht** Installation, Offline-Neustart, Updatebanner, Datenmigration, VoiceOver/TalkBack oder reale Gerätefunktion.

## 7. Release Candidate

Ein RC ist durch einen unveränderten Commit definiert:

- 40-stelliger Commit SHA
- Tag
- App-Version
- Cachegeneration
- Staging-Origin
- Freeze-Zeitpunkt

Nach einem Fix entsteht ein neuer RC-Kandidat oder betroffene Gates müssen erneut auf dem neuen Commit ausgeführt werden.

## 8. Production

Vor Promotion erforderlich:

- CI/Cross-Browser PASS
- Branch Protection real bestätigt
- Staging HTTP-Smoke PASS
- manueller PWA-Smoke PASS
- Upgrade/Rollback PASS
- Android/iOS/Tablet PASS
- Accessibility PASS
- Gruppen/Beta PASS
- Content/Privacy/Reference PASS
- Assets/Rechte PASS
- Operator/Hosting/Legal/Support/Incident PASS

Production darf nicht als erster echter Service-Worker-Test dienen.

## 9. Datenisolation

Local und Staging verwenden neutrale Testnamen und Testinhalte. Keine echten privaten Nachrichten, Fotos oder unnötig personenbezogenen Backups als Standardtestdaten.

Bei bewusstem Cross-Environment-Import Quelle, Commit und Zweck dokumentieren.

## 10. Runtime-Konfiguration

V1 benötigt keine Runtime-Secrets und keine Backend-Environment-Datei. Falls später Secrets eingeführt werden: `.env.example` ohne Geheimnisse, getrennte Umgebungswerte, Secret Store, Rotation/Revoke und neue Security-/Privacy-Prüfung.

## 11. Manueller Staging-Smoke

Mindestens:

- Service Worker registriert
- Installation vom Hub
- mindestens eine Unterseite direkt geprüft
- Offline-Neustart
- Hub/Word Imposter/Advanced/Quick/Creator/Privacy offline
- Query-Routen offline
- Export/Import mit neutralen Daten
- Hub-Core- und Timer-Core-Smoke
- Advanced-Core-Smoke
- Word-Imposter Resume-/Datenlimits
- Creator
- Updatebanner + aktive Session
- Hub-/Advanced-/Quick-/Creator-Fokuspfade
- Privacy-/Legalnavigation

## 12. Rollbackprobe

Auf Staging:

1. Version A real installieren
2. neutrale lokale Daten und aktive Session anlegen
3. RC-Version B veröffentlichen
4. B bewusst aktivieren
5. Rollback-/Hotfix-Version C mit neuer Cachegeneration veröffentlichen
6. lokale Daten erhalten
7. Offline-Neustart auf C
8. HTTP-Smoke auf C
9. Ergebnis in `OPERATOR_EVIDENCE_LOG.md` beziehungsweise Release-Evidence referenzieren

## 13. Environment-Nachweis

```text
Local baseline:
CI run URL/id:
Staging URL:
Staging commit:
Staging cache:
Staging smoke result:
RC commit:
RC cache:
Production URL:
Production commit:
Production cache:
Production smoke result:
Rollback tested from/to:
Evidence reference:
```

## 14. Release-Gate

Vor `ENVIRONMENT / STAGING PASS`:

- [ ] getrennte HTTPS-Staging-Origin final
- [ ] Production-Origin final
- [ ] Provider-/Log-/Datenschutzentscheidung dokumentiert
- [ ] `scripts/staging_smoke.py` gegen Staging grün
- [ ] manueller Browser-/PWA-Smoke abgeschlossen
- [ ] Upgrade aus mindestens zwei real installierten Altständen
- [ ] Rollbackprobe
- [ ] Datenisolation bestätigt
- [ ] derselbe freigegebene RC für Production vorgesehen
- [ ] `release-evidence.json.gates.stagingHttpSmoke = PASS` mit demselben RC-Commit

Bis zu realer Evidence bleibt Staging **OPEN / NO_GO**.
