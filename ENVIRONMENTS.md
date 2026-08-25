# Secret Circle – Umgebungen und Staging-Vertrag

Stand: 25. August 2026  
Status: **PREPARED – konkrete HTTPS-Staging-URL offen**  
Offline-Core: **`secret-circle-v47` / `secret-circle-v47-staging`**

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
- Online-`npm ci`
- `npm run ci`
- Cross-Browser

Aktuell: **BLOCKED**. Auch Run #2637 endete vor Step 1 mit `steps: []`; ein reiner Bash-Runner-Probe zeigte dasselbe Muster. Details: Issue #7 / `CI_TROUBLESHOOTING.md`.

## 4. HTTPS-Staging

Staging ist der erste echte Hosting-/Service-Worker-/Installationsraum vor Production und muss eine **getrennte Origin** besitzen.

Schematisch:

```text
https://staging.example.invalid/
https://app.example.invalid/
```

Die tatsächlichen Domains werden vor Deployment festgelegt und nach `HOSTING_DECISION.md` dokumentiert.

Warum getrennte Origin:

- `localStorage` originisoliert
- Service Worker/Cache originisoliert
- installierte PWA-Zustände vermischen sich nicht
- Staging-Tests verändern keine Productiondaten

Staging und Production nicht nur über Queryparameter derselben Origin unterscheiden.

## 5. Automatisierter HTTPS-Smoke

Staging:

```bash
npm run staging:smoke -- https://STAGING-ORIGIN/ --expected-cache secret-circle-v47
```

Production:

```bash
npm run staging:smoke -- https://PRODUCTION-ORIGIN/ --expected-cache secret-circle-v47 --production
```

Der Smoke prüft unter anderem HTTPS, Same-Origin-Redirects, Größenlimits, Kernseiten/Query-Routen, Manifest, PNG-IHDR, Service-Worker-/Staging-Cachegeneration, Registry-Ladereihenfolge, Privacy-/Reference-Source-Verträge, PWA-Head-Metadaten und Production-Placeholder.

`scripts/staging_smoke_contract_audit.py` schützt diesen Vertrag statisch.

Der HTTP-Smoke beweist **nicht** Service-Worker-Installation, Offline-Neustart, Updatebanner, lokale Datenmigration, VoiceOver/TalkBack oder reale Gerätefunktion.

## 6. Release Candidate

RC-Vertrag:

- exakter 40-stelliger Commit SHA
- exakte App-Version
- exakte Cachegeneration
- alle automatisierten Tests auf demselben Commit
- HTTPS-Staging desselben Commits
- nach jedem Fix neuer RC-Kandidat
- Production erhält denselben freigegebenen statischen Stand

Ein RC ist kein Zweig, auf dem nach der Freigabe still weitergepatcht wird.

## 7. Production

Vor Promotion:

- CI/Cross-Browser grün
- Branch Protection tatsächlich bestätigt
- HTTPS-Staging-Smoke grün
- manueller Staging-/PWA-Smoke grün
- Geräte/A11y grün
- PWA Upgrade/Rollback geprüft
- reale Gruppen abgeschlossen
- Operator/Hosting/Legal/Support/Third-Party final
- keine offenen Critical/High Bugs

Production darf nicht der erste echte Service-Worker-Test sein.

## 8. Datenisolation

Für Local/Staging neutrale Spielernamen und generische Creator-Karten verwenden. Keine echten privaten Nachrichten/Fotos und keine sensiblen personenbezogenen Testbackups.

Cross-Environment-Backups nur bewusst kopieren und Quellumgebung/Commit dokumentieren.

## 9. PWA-/Cache-Regeln je Umgebung

Aktueller Quellcode: **`secret-circle-v47`**.

Relevante Historie:

- v37: Reference-Safe-Anime-Archetypen
- v38: generische Sport-/Eventformulierungen
- v39: Browsermarke entfernt, Spektrum-Tipp
- v40: konkrete Anime-Namen physisch entfernt
- v41: Reference-Safe-Invarianten upstream + Classic Content v4
- v42: echter 192×192-/512×512-Rastervertrag
- v43: Private-Device-Truth/Dare-Prompts physisch entfernt + Privacy-Audit
- v44: einheitlicher Manifest-/iOS-/Icon-Head-Vertrag auf fünf Einstiegseiten
- v45: Core-Hardening mit Resume-/Privacy-Guards im Offline-Core
- v46: Hub-Accessibility-Hardening
- **v47: Accessibility-Hardening für Advanced, Quick und Creator mit `secondary-surface-a11y.js` offline**

Regeln:

- Cachegeneration nie wiederverwenden, wenn Offline-Core-Inhalte geändert wurden
- Staging/Production dürfen denselben Cache-Namen tragen, weil Origins getrennt sind
- Upgradepfade aus wirklich installierter alter Version testen
- Rollback erhält ebenfalls neue Cachegeneration

## 10. Offline-v47-Vertrag

v47 muss unter anderem offline verfügbar machen:

- `word-imposter-resume-guard.js`
- `party-hub-resume-guard.js`
- `party-hub-a11y.js`
- `secondary-surface-a11y.js`
- `advanced-resume-guard.js`
- `advanced-privacy-guard.js`
- Katalog-/Core-Contentmodule
- Session-/Timercontroller
- Backup-Registry
- Manifest und Icons

Reale Offline-Funktion ist erst nach PWA-/Gerätetest bestätigt.

## 11. Environment-Konfiguration

V1 benötigt keine Runtime-Secrets und kein Backend-Environment-File.

Falls später hinzugefügt:

- `.env.example` ohne Geheimnisse
- getrennte dev/test/staging/prod-Werte
- keine Production-Keys in Test
- Secret Store statt Commit
- Rotation/Revoke-Prozess

## 12. Manueller Staging-Smoke

Zusätzlich zum HTTP-Smoke mindestens:

- Service Worker registriert
- Installation vom Hub
- Titel/Icon korrekt
- mindestens eine Unterseite direkt
- Offline-Neustart
- finaler Katalog
- Hub-Datenbereich/Backup-Registry
- Export/Import neutraler Daten
- Word Imposter
- ein direktes Hub-Core-Spiel
- ein Timer-Core-Spiel
- ein Advanced-Core-Spiel
- ein Quick Mode
- Creator
- Privacy-/Resume-/A11y-Guards offline
- Hub-Bereichswechsel mit Tastatur/Fokus
- Hub-Detail-/Spieloverlay ohne Fokusleck
- Advanced-Overlay ohne Fokusleck
- Quick-Phasen-Fokus-Recovery
- Creator-Wizard-Fokus, Hilfe-Modal und Template-Pfeiltasten
- Updatebanner
- aktive Session während Update
- Privacy-/Legalnavigation

## 13. Rollbackprobe

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

## 14. Environment-Nachweis

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

## 15. Release-Gate

Vor `ENVIRONMENT / STAGING PASS`:

- [ ] getrennte HTTPS-Staging-Origin festgelegt
- [ ] Production-Origin festgelegt
- [ ] Staging erreichbar/installierbar
- [ ] `scripts/staging_smoke.py` gegen Staging grün
- [ ] `tests/pwa-head-metadata.test.js` auf demselben RC grün
- [ ] manueller Browser-/PWA-Smoke abgeschlossen
- [ ] Upgrade von mindestens zwei älteren Versionen abgeschlossen
- [ ] Rollbackprobe abgeschlossen
- [ ] Datenisolation bestätigt
- [ ] derselbe freigegebene RC für Production vorgesehen

Bis dahin bleibt R-019 **OFFEN** und Production **NO_GO**.
