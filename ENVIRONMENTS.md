# Secret Circle – Umgebungen und Staging-Vertrag

Stand: 26. August 2026  
Status: **PREPARED – konkrete HTTPS-Staging-URL offen**  
Offline-Core: **`secret-circle-v54` / `secret-circle-v54-staging`**

## 1. Ziel

Secret Circle besitzt kein klassisches Backend, benötigt aber getrennte Umgebungen. `localStorage`, Service Worker, Cache Storage und installierte PWAs sind originabhängig.

Verbindliche Reihenfolge:

**Local → CI/Test → HTTPS-Staging → Release Candidate → Production**

## 2. Local

Lokale Entwicklung und schnelle Tests, typischerweise über `http://127.0.0.1:4173`. Local ist kein Releasebeweis. Keine echten Productiondaten oder unnötig privaten Backups als Standardfixture.

## 3. CI/Test

Releaseanforderungen: echter Runner mit sichtbaren Steps, Checkout, Online-`npm ci`, `npm run ci`, Cross-Browser auf demselben RC. Der aktuelle externe Runnerblocker wird in `CI_TROUBLESHOOTING.md` und Issue #7 geführt. `steps: []` ist kein Code-Test.

## 4. HTTPS-Staging

Staging ist der erste echte Hosting-/Service-Worker-/Installationsraum vor Production und muss eine **getrennte Origin** besitzen.

## 5. Aktueller Cachevertrag

- aktiv: `secret-circle-v54`
- staging: `secret-circle-v54-staging`

Historie:

- v49: zentraler Hub-Resume-Guard
- v50: fail-closed Resume-UI
- v51: Complete Backup / Forward Compatibility
- v52: sichere direkte Current-Runden + getrennte Truth/Dare-Pools
- v53: gedeckte Paranoia-Referenz/Phase + stabiles Münzwurf-Ergebnis
- **v54: Hot-Potato-Aufgabe und Word-Chain-Startbuchstabe bleiben vor Timerstart über Reload stabil; Timerstart löscht Current und übergibt an `timer.prompt`/`timer.letter`**

Cachegenerationen werden nach Änderung einer Offline-Core-Datei nicht wiederverwendet. Rollback/Hotfix erhält ebenfalls eine neue Generation.

## 6. Automatisierter HTTPS-Smoke

Staging:

```bash
npm run staging:smoke -- https://STAGING-ORIGIN/ --expected-cache secret-circle-v54
```

Production:

```bash
npm run staging:smoke -- https://PRODUCTION-ORIGIN/ --expected-cache secret-circle-v54 --production
```

Der Netzwerk-Smoke beweist nicht Installation, Offline-Neustart, Updatebanner, Restore, Resume, Privacy, VoiceOver/TalkBack oder reale Gerätefunktion.

## 7. Release Candidate

Ein RC ist durch unveränderten Commit, Tag, App-Version, Cachegeneration, Staging-Origin und Freeze-Zeitpunkt definiert. Nach einem Fix entsteht ein neuer RC-Kandidat oder betroffene Gates werden erneut ausgeführt.

## 8. Production

Vor Promotion erforderlich: CI/Cross-Browser, Branch Protection, Staging-Smoke, manueller PWA-Smoke, Upgrade/Rollback, Android/iOS/Tablet, Accessibility, Gruppen/Beta, Content/Privacy/Reference, Assets/Rechte und Operator/Hosting/Legal/Support/Incident jeweils PASS.

Production darf nicht als erster echter Service-Worker-, Resume-, Privacy- oder Restore-Test dienen.

## 9. Datenisolation

Local und Staging verwenden neutrale Testnamen/-inhalte. Für v51+ Future-Daten-Erhalt prüfen; für v52 sichere Current-Karten; für v53 Paranoia same-question/same-result ohne Auto-Reveal; für **v54** sichere Pre-Timer-Werte vor und nach dem atomaren Übergang in den Timer-Snapshot.

## 10. Runtime-Konfiguration

V1 benötigt keine Runtime-Secrets und keine Backend-Environment-Datei. Falls später Secrets eingeführt werden: `.env.example` ohne Geheimnisse, getrennte Umgebungswerte, Secret Store, Rotation/Revoke und neue Security-/Privacy-Prüfung.

## 11. Manueller Staging-Smoke

Mindestens:

- Service Worker registriert / Installation / Offline-Neustart
- Hub/Word Imposter/Advanced/Quick/Creator/Privacy + Query-Routen offline
- DWI / HR2 / BK51 / HR52 / PR53
- **PT54 Hot Potato:** Pre-Start-Aufgabe nach Reload identisch; nach Timerstart Current gelöscht und `timer.prompt` identisch
- **PT54 Word Chain:** Pre-Start-Buchstabe nach Reload identisch; nach Timerstart Current gelöscht und `timer.letter` identisch
- Scharade/Tabu besitzen keinen sichtbaren Pre-Start-Current-Vertrag
- Updatebanner + aktive Session
- Accessibility-/Fokuspfade
- Privacy-/Legalnavigation

## 12. Rollbackprobe

1. Version A installieren
2. neutrale Daten + aktive Session anlegen
3. RC B veröffentlichen/aktivieren
4. Rollback-/Hotfix C mit neuer Cachegeneration veröffentlichen
5. lokale Daten erhalten
6. Offline-Neustart + HTTP-Smoke auf C
7. Ergebnis in Operator-/Release-Evidence referenzieren

## 13. Environment-Nachweis

```text
CI run URL/id:
Staging URL/commit/cache:
Staging smoke result:
RC commit/cache:
Production URL/commit/cache:
Production smoke result:
DWI evidence:
HR2 evidence:
BK51 evidence:
HR52 evidence:
PR53 evidence:
PT54 evidence:
Rollback tested from/to:
Evidence reference:
```

## 14. Release-Gate

Vor `ENVIRONMENT / STAGING PASS`:

- [ ] getrennte HTTPS-Staging-Origin final
- [ ] Production-Origin final
- [ ] Provider-/Log-/Datenschutzentscheidung dokumentiert
- [ ] Staging-Smoke grün
- [ ] manueller Browser-/PWA-Smoke abgeschlossen
- [ ] DWI / HR2 / BK51 / HR52 / PR53 / PT54 real bestätigt
- [ ] Upgrade aus mindestens zwei real installierten Altständen
- [ ] Rollbackprobe
- [ ] Datenisolation bestätigt
- [ ] derselbe freigegebene RC für Production vorgesehen
- [ ] `release-evidence.json.gates.stagingHttpSmoke = PASS` mit demselben RC-Commit

Bis zu realer Evidence bleibt Staging **OPEN / NO_GO**.