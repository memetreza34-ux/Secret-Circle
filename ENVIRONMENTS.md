# Secret Circle – Umgebungen und Staging-Vertrag

Stand: 26. August 2026  
Status: **PREPARED – konkrete HTTPS-Staging-URL offen**  
Offline-Core: **`secret-circle-v53` / `secret-circle-v53-staging`**

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

Staging ist der erste echte Hosting-/Service-Worker-/Installationsraum vor Production und muss eine **getrennte Origin** besitzen. `localStorage`, Service Worker, Cache Storage und installierte PWA-Zustände bleiben dadurch von Production getrennt.

## 5. Aktueller Cachevertrag

Quellstand:

- aktiv: `secret-circle-v53`
- staging: `secret-circle-v53-staging`

Historie:

- v49: zentraler getesteter Hub-Resume-Guard
- v50: fail-closed Resume-UI während der Guard-Ladephase
- v51: Complete-Backup-Restore mit exakter aktueller Key-Eigentümerschaft und Forward-Compatibility
- v52: sichere laufende Direkt-Hub-Karten bleiben über Reload erhalten; Wahrheit/Pflicht nutzen getrennte Wiederholungspools
- **v53: Paranoia kann Frage/Phase und bereits gefälltes Münzwurf-Ergebnis als validierte Referenz fortsetzen, bleibt nach Reload und Fokusverlust aber gedeckt**

Cachegenerationen werden nicht wiederverwendet, wenn sich eine offline benötigte Datei ändert. Rollback/Hotfix erhält ebenfalls eine neue Generation.

## 6. Automatisierter HTTPS-Smoke

Staging:

```bash
npm run staging:smoke -- https://STAGING-ORIGIN/ --expected-cache secret-circle-v53
```

Production:

```bash
npm run staging:smoke -- https://PRODUCTION-ORIGIN/ --expected-cache secret-circle-v53 --production
```

`scripts/staging_smoke.py` prüft unter anderem HTTPS, Same-Origin-Redirects, Größenlimits, Kernseiten/Query-Routen, Manifest-/Standalone-Vertrag, PNG-IHDR, aktuelle Cachegeneration, PWA-Head-Metadaten, Backup-Registry-Ladereihenfolge, Privacy-/Reference-Safe-Source und Production-Placeholder-Grenzen.

Der Netzwerk-Smoke beweist **nicht** Installation, Offline-Neustart, Updatebanner, Datenmigration, Restore-Transaktion, Direct-Hub-Rundenkontinuität, Paranoia-Concealment, VoiceOver/TalkBack oder reale Gerätefunktion.

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

Production darf nicht als erster echter Service-Worker-, Resume-, Privacy- oder Restore-Test dienen.

## 9. Datenisolation

Local und Staging verwenden neutrale Testnamen und Testinhalte. Keine echten privaten Nachrichten, Fotos oder unnötig personenbezogenen Backups als Standardtestdaten.

Bei bewusstem Cross-Environment-Import Quelle, Commit und Zweck dokumentieren. Für v51+ muss bestätigt werden, dass Future-Daten einen Restore überleben. Für v52 müssen sichere laufende Hub-Karten nach Reload dieselbe Karte zeigen. Für v53 muss Paranoia dieselbe geheime Frage beziehungsweise dasselbe bereits entschiedene Münzwurf-Ergebnis nur nach bewusster Reveal-Aktion wieder anzeigen.

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
- `party-hub-round-state.js` offline verfügbar
- v52 Wahrheit/Pflicht sichere Karte identisch + Truth/Dare-Pools unabhängig
- v52 Prompt/Choice sichere Current-Karte identisch
- **v53 Paranoia-Frage nach Reload zunächst gedeckt, nach explizitem Reveal exakt dieselbe Frage**
- **v53 bereits entschiedener Münzwurf nach Reload zunächst gedeckt, nach explizitem Anzeigen exakt dasselbe Ergebnis**
- **v53 aufgelöster Paranoia-Zustand wird bei Blur/Appwechsel erneut verdeckt**
- Hub Resume Guard v2 einschließlich v50-Ladequarantäne
- Complete Backup v51 Future-Key/Future-Version/Vorvalidierung/Rollback
- vollständige Datenlöschung entfernt weiterhin alle Secret-Circle-Namespaces
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
Direct-Hub safe round resume evidence:
Paranoia concealed resume/privacy evidence:
Complete-backup restore evidence:
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
- [ ] v50-Hub-Resume-Ladequarantäne real bestätigt
- [ ] v51-Complete-Backup-Transaktions-/Forward-Compatibility real bestätigt
- [ ] v52-Direct-Hub-Rundenkontinuität und Truth/Dare-Pooltrennung real bestätigt
- [ ] v53-Paranoia-Referenz/Outcome/Blur-Privacy real bestätigt
- [ ] Upgrade aus mindestens zwei real installierten Altständen
- [ ] Rollbackprobe
- [ ] Datenisolation bestätigt
- [ ] derselbe freigegebene RC für Production vorgesehen
- [ ] `release-evidence.json.gates.stagingHttpSmoke = PASS` mit demselben RC-Commit

Bis zu realer Evidence bleibt Staging **OPEN / NO_GO**.