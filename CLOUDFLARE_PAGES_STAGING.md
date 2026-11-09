# Secret Circle – Cloudflare Pages Staging Runbook

Stand: 9. November 2026
Status: **PREPARED – kein Cloudflare-Projekt/keine Origin real angelegt**  
Preferred technical candidate: **Cloudflare Pages**

Dieses Runbook beschreibt den empfohlenen technischen Aufbau. Es markiert **keinen** Hosting-/Privacy-/Release-PASS und darf keine echten Account-/Domain-/DPA-Werte erfinden.

## 1. Warum zwei Pages-Projekte

Empfohlen ist eine klare Trennung:

```text
Secret Circle Staging
  └─ eigenes Cloudflare Pages Project
     └─ eigene *.pages.dev / spätere Staging-Origin

Secret Circle Production
  └─ separates Cloudflare Pages Project
     └─ eigene Production-Origin / spätere Custom Domain
```

Vorteile:

- echte Origin-Trennung für Service Worker, Cache Storage und localStorage
- Staging kann ohne Production-Promotion getestet werden
- Production muss nicht die erste echte HTTPS-Umgebung sein
- Rollback-/Header-/PWA-Evidence bleibt pro Umgebung nachvollziehbar
- eine Staging-Fehlkonfiguration überschreibt nicht automatisch Production

## 2. Staging-Projekt – erst nach realer Cloudflare-Verbindung

Empfohlene Einstellungen:

```text
Project name: secret-circle-staging (oder eindeutiger real verfügbarer Name)
Git provider: GitHub
Repository: memetreza34-ux/Secret-Circle
Framework preset: None / static
Build command: npm run release:package
Build output directory: dist/site
Functions: keine für V1
Web Analytics: nicht automatisch aktivieren
Production branch des Staging-Projekts: bewusst gewählter Staging-/Release-Candidate-Branch
Preview deployments: nur soweit für Review benötigt
```

Nur `dist/site` veröffentlichen, niemals den Repository-Ordner. Der Paketierer liest die freigegebenen App-Dateien aus einem festen Git-Commit, prüft Offline-Core und Dateiprüfsummen und legt zusätzlich `release/secret-circle.zip` an. Interne Betreiber-/Releasevorlagen, Tests, Git-Dateien und Werkzeuge gehören nicht zum Paket. Lokale, noch nicht committete App-Änderungen stoppen den Export. Das Paketmanifest `release-build.json` nennt Commit, Cache und Prüfsummen; es enthält keine Betreiberangaben.

Die CI erstellt und verifiziert dasselbe Paket als herunterladbares Artefakt. Ein PR-Artefakt bleibt ein Prüfstand; die spätere Veröffentlichung verwendet den geprüften, unveränderten RC auf dem geschützten Branch. Ein Paketexport veröffentlicht selbst nichts. Die [Build-Konfiguration](https://developers.cloudflare.com/pages/configuration/build-configuration/) verwendet ein eigenes Ausgabeverzeichnis; `_headers` liegt darin wie von [Cloudflare dokumentiert](https://developers.cloudflare.com/pages/configuration/headers/).

### Aktueller Branchhinweis

PR #69 enthält Bilder/UX, PR #70 die darauf geprüften Spielabläufe und Schutzkorrekturen. Beide benötigen noch Review und Integration nach `main`. Für einen Stagingtest kann ein bewusst gewählter Prüfstand verwendet werden; das erteilt keine Production-Freigabe.

Vor dem finalen RC wird ein klarer unveränderlicher RC-/Releasebranch benötigt. Der reale Branchname wird erst bei Freeze festgelegt.

## 3. Source-Header

Repositorydatei:

`/_headers`

Aktueller Vertrag:

```text
/*
  Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'self'; worker-src 'self'; manifest-src 'self'; object-src 'none'; base-uri 'none'; form-action 'self'; frame-ancestors 'none'
  X-Content-Type-Options: nosniff
  Referrer-Policy: no-referrer
  X-Frame-Options: DENY
  Strict-Transport-Security: max-age=31536000

/sw.js
  Cache-Control: no-cache
```

Cloudflare Pages dokumentiert `_headers` für statische Assets. V1 verwendet keine Pages Functions; dadurch muss die Functions-Ausnahme für `_headers` im aktuellen V1-Pfad nicht umgangen werden.

**Trotzdem:** Nur der echte Response-Smoke beweist, was wirklich ausgeliefert wird.

## 4. Erster realer Staging-Smoke

Sobald eine echte Staging-Origin existiert:

```bash
npm run staging:smoke -- https://REAL-STAGING-ORIGIN/ --expected-cache secret-circle-v111
```

Für die spätere verbindliche Paketprüfung zusätzlich `--expected-commit <40-stelliger-RC-SHA>` verwenden. Damit werden das Paketmanifest und alle öffentlich ausgelieferten Dateibytes geprüft; ein gleicher Cachename allein genügt nicht. Alternativ den vorbereiteten GitHub-Workflow **Secret Circle Deployment Smoke** mit HTTPS-Origin und Commit starten. Er prüft nur und veröffentlicht nichts. Origin und reale Hostingfreigaben werden erst mit den tatsächlichen Angaben ergänzt.

Erforderlich:

- HTTPS
- Same-Origin-Redirect-Vertrag
- zum gewählten Commit gehöriger Offline-Cache
- PWA-/Manifest-/Icon-Vertrag
- Response-CSP inklusive `frame-ancestors 'none'`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: no-referrer`
- `X-Frame-Options: DENY`
- sichere `sw.js`-Cache-Policy

Danach Browser/PWA manuell:

- installierbar
- Online → Offline → Reload
- Offline-Neustart
- App-Wechsel / Screen-Lock
- Prozess-Kill / Cold Resume
- Updatebanner
- Upgrade aus älteren Installationen
- bestehende Spezialgates bis HS60
- alle 55 Spiele einschließlich Wave-One-Labs

## 5. Staging-Evidence

Erst nach realer Durchführung ausfüllen:

```text
Cloudflare account/project:
Provider product/tariff:
Staging project:
Staging origin:
Commit:
App version:
Cache:
_headers deployed: yes/no
Network smoke:
PWA install:
Offline restart:
Update path:
Device/browser:
Evidence URL/reference:
Reviewer:
Date:
```

Danach `OPERATOR_EVIDENCE_LOG.md` aktualisieren.

## 6. Datenschutz-/Providerprüfung

Vor finaler Providerwahl real prüfen:

- aktuelle Self-Serve-Vertragsbedingungen
- Cloudflare Customer DPA für den realen Account
- welche Request-/Endnutzer-/Logdaten Pages verarbeitet
- Rolle von Cloudflare
- Log-/Retention-Position
- Subprozessoren
- internationale Transfers / Transfermechanismen
- optionale Analytics deaktiviert oder bewusst dokumentiert
- keine EU-only-Datenhaltung behaupten, solange sie real nicht besteht

Cloudflare stellt weitergehende Data-Localization-Funktionen bereit; nach aktueller Dokumentation sind relevante Funktionen wie Customer Metadata Boundary Enterprise-orientiert. Das ist **kein** V1-Free-Plan-Versprechen.

## 7. Production-Projekt – erst beim unveränderlichen RC

Production nicht jetzt als releasefertig anlegen.

Empfohlene spätere Struktur:

```text
Project: secret-circle (real verfügbaren Namen wählen)
Repository: memetreza34-ux/Secret-Circle
Production branch: finaler RC-/Releasebranch
Automatic production deployment: bis bewusster Promotion kontrollieren/deaktivieren
Functions: keine für V1
Custom domain: erst real festlegen
```

Cloudflare Pages erlaubt laut aktueller Dokumentation die Steuerung automatischer Production-Deployments und Preview-Branches. Diese Funktion nutzen, damit ein Push nicht unbeabsichtigt einen ungeprüften RC öffentlich promotet.

## 8. Production-Promotion

Nur wenn Staging auf **demselben unveränderten RC** bestanden ist:

```bash
npm run staging:smoke -- https://REAL-PRODUCTION-ORIGIN/ --expected-cache secret-circle-v111 --production
```

Zusätzlich Production:

- HSTS `max-age >= 31536000`
- echte Custom-Domain-/TLS-Prüfung, falls Custom Domain genutzt wird
- Privacy-/Legal-Seiten mit realen Betreiber-/Hostingangaben
- Support-/Securitykontakt real
- Production-PWA-Smoke
- Rollback-Drill

## 9. Rollback

Wenn nach Promotion ein Hotfix nötig wird:

1. betroffenen Commit/Deployment dokumentieren,
2. Promotion stoppen,
3. Revert/Hotfix erstellen,
4. bei Offline-Core-Änderung **neue Cachegeneration** verwenden,
5. erneut Staging deployen,
6. Network-Smoke + PWA-/Datenkompatibilität erneut prüfen,
7. erst danach Production aktualisieren.

Nicht einfach einen alten Cache-Namen mit anderem Inhalt wiederverwenden.

## 10. Was dieses Runbook nicht erledigt

Noch **nicht** erledigt:

- Cloudflare-Konto verbunden
- Provider final ausgewählt
- DPA geprüft
- reale Staging-Origin
- reale Production-Origin
- Custom Domain
- reale Response-Header-Evidence
- reale PWA-Evidence
- reale Privacy-/Legal-Abnahme

Deshalb bleiben `stagingHttpSmoke`, `productionSmoke` und `legalPrivacy` in `release-evidence.json` **BLOCKED**.

## 11. Offizielle Quellen

Cloudflare Pages Git Integration:  
https://developers.cloudflare.com/pages/configuration/git-integration/

Cloudflare Pages Branch Build Controls:  
https://developers.cloudflare.com/pages/configuration/branch-build-controls/

Cloudflare Pages Headers:  
https://developers.cloudflare.com/pages/configuration/headers/

Cloudflare Pages Static HTML:  
https://developers.cloudflare.com/pages/framework-guides/deploy-anything/

Cloudflare Customer DPA:  
https://www.cloudflare.com/cloudflare-customer-dpa/

Cloudflare Data Localization:  
https://developers.cloudflare.com/data-localization/

## 12. Gate

`CLOUDFLARE STAGING PREPARED` bedeutet nur: Repository und Runbook sind bereit.

`HOSTING PASS` darf erst nach realem Provider-/DPA-/Origin-/Header-/PWA-/Rollback-Nachweis auf einem unveränderten RC gesetzt werden.
