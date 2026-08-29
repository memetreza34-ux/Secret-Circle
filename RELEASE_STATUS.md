# Release-Status – Secret Circle

Stand: 29. August 2026  
Zielrelease: 4.–15. Januar 2027  
Arbeitsbranch: `agent/release-foundation-2027`  
Release-PR: Draft #13  
Main-Reconciliation: Draft #15

## Gesamtstatus

**Phase:** Release-Härtung / Verifikation  
**Öffentliche Freigabe:** **NO_GO**  
**Package:** `1.0.0-beta.3`  
**Offline-Core:** `secret-circle-v64` / `secret-circle-v64-staging`  
**Built-ins:** 55 · 15 Core / 13 Extended / 27 Labs  
**Wave 1:** 10/10 source-implemented; reale Evidence offen  
**Core Source Review/Hardening:** 15/15 PREPARED  
**CI / Cross-Browser:** BLOCKED  
**Branch Protection:** BLOCKED  
**Hosting / Operator / Legal / Support:** PREPARED / BLOCKED  
**Asset-Icon-Provenienz:** SOURCE RESOLVED  
**Gesamt-Asset-/Third-Party-Gate:** weiterhin BLOCKED

## v64 – Scope Freeze

Die zehn Wave-1-Labs sind quellsseitig implementiert:

1. `bluff-trivia`
2. `party-quiz`
3. `fact-or-fake`
4. `percent-guess`
5. `fill-blank-battle`
6. `who-wrote-it`
7. `party-bracket`
8. `undercover-similar-word`
9. `no-word-imposter`
10. `password-one-word`

Der Januar-Core bleibt bei **15 Spielen**. Keine neuen Core-Modi und keine große Architekturmigration vor den offenen Release-Gates.

## CI – P0 BLOCKED

GitHub Actions reproduziert weiterhin denselben Fehler vor Repository-Ausführung:

- Job endet mit `steps: []`
- `runner_id: 0`
- leerer Runner-Name
- angefordert: `ubuntu-latest`
- kein Checkout
- kein `npm ci`
- kein Node-/Python-Test
- kein Playwright
- kein Repositorycode

Das ist kein App-Code-Fehlernachweis. Issue #7 bleibt der externe P0-Blocker.

Sobald Actions wieder einen Hosted Runner erhält, ist die Reihenfolge:

1. Online-`npm ci --ignore-scripts --no-audit --no-fund`
2. `npm run ci`
3. Chromium / Firefox / WebKit auf exakt demselben Commit
4. erst danach reale Code-/Testfehler beheben

## PR #15 – Main/Reconciliation

Draft-PR #15 bleibt auf einen kontrollierten 9-Pfade-Scope beschränkt und integriert die `main`-seitigen Archiv-/Safety-Dateien in die v64-Releasebasis.

Nach neuen Release-Hardening-Commits muss PR #15 erneut gegen den aktuellen Releasebranch synchronisiert und per GitHub-Compare auf folgende Eigenschaften geprüft werden:

- `behind_by = 0`
- weiterhin exakt 9 Reconciliation-Pfade
- keine Spielengine
- kein Katalog
- keine Release-Tier-Logik
- kein Service-Worker-Runtime-Code

PR #15 bleibt Draft und wird ohne funktionierende CI nicht gemergt.

## Branch Protection – BLOCKED

Für `main` wurde zuletzt real bestätigt:

- `protected: false`
- Protection nicht aktiv
- Required-Check-Enforcement `off`
- keine Required-Check-Kontexte

Branch Protection soll erst mit einem tatsächlich funktionierenden `Secret Circle CI / validate` Required Check aktiviert und als PASS gewertet werden.

## Hosting – PREPARED / real BLOCKED

Technischer Preferred Candidate: **Cloudflare Pages**, noch nicht final ausgewählt.

Vorbereitet:

- `HOSTING_PROVIDER_RESEARCH.md`
- `CLOUDFLARE_PAGES_STAGING.md`
- `HOSTING_DECISION.md`
- `ENVIRONMENTS.md`
- `DEPLOYMENT.md`
- `/_headers`
- `scripts/staging_smoke.py`
- `scripts/staging_smoke_contract_audit.py`

Der vorbereitete HTTP-Header-Vertrag verlangt unter anderem:

- Response-CSP
- `frame-ancestors 'none'`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: no-referrer`
- `X-Frame-Options: DENY`
- Production-HSTS
- `sw.js` ohne `immutable`, mit revalidierender/kurzer Cache-Policy

Real fehlen weiterhin Provideraccount/-projekt, DPA-/Transferprüfung, getrennte HTTPS-Staging-/Production-Origins und echte Netzwerk-/PWA-/Rollback-Smokes.

## Operator / Legal / Support – BLOCKED

`operator-release.json` bleibt korrekt `PREPARED / BLOCKED` und ist an v64 / `1.0.0-beta.3` / die v64-Cachegeneration gebunden.

Real fehlen noch:

- finale Betreiberidentität / Rechtsform / ladungsfähige Anschrift
- öffentlicher Betreiber-/Supportkontakt
- Security-/Privacy-Meldeweg
- final ausgewähltes Hostingprodukt und reale Origins
- finale Hosting-/Log-/Privacy-/DPA-/Transferprüfung
- reale Legal-/Anbieterkennzeichnungsseite
- Incident-Verantwortliche
- Probe-Supportfall
- Probe-SEV-1
- HTTPS-Rollback-Drill

Daher bleiben `stagingHttpSmoke`, `legalPrivacy`, `supportIncident` und `productionSmoke` BLOCKED.

## Assets – Icon-Rechteblocker geschlossen

Das frühere ungeklärte App-Icon wurde vollständig ersetzt.

Aktuelles Release-Iconset:

- `icon.svg` → `verified-own`
- `icon-192.png` → `verified-own`
- `icon-512.png` → `verified-own`

Nachweise:

- `ASSET_RIGHTS_SIGNOFF.md`
- `assets/manifests/ORIGINAL_ICON_SOURCE.md`
- `assets/manifests/ICON_RASTER_HASHES.md`
- `assets/manifests/asset-provenance.json`

Der Media-Vertrag bleibt bewusst bei exakt drei Release-Medien. Das neue SVG wurde ohne externe Bild-/Logo-/Stock-/Fontvorlage als geometrische Komposition erstellt; die PNGs sind deterministische Ableitungen.

**Der alte `icon.svg`-Rechteblocker ist damit quellsseitig geschlossen.**

`assetsThirdParty` bleibt trotzdem BLOCKED, bis auf einem unveränderten RC real vorliegen:

- funktionierender Online-`npm ci`-/Integrity-Nachweis
- `scripts/asset_provenance_audit.py` grün
- `scripts/media_inventory_audit.py` grün
- kompletter `npm run validate` grün
- finaler manueller Visual-/Marken-/Third-Party-Plausibilitätsreview

## Reale Geräte / Accessibility / Gruppen – OPEN

Weiter offen:

- Android Browser/PWA
- iPhone Safari / Add to Home Screen
- iPad/Tablet
- App-Wechsel / Screen-Lock / Prozess-Kill / Cold Resume
- 320 CSS px / 200-%-Zoom / Rotation / große Systemschrift
- vollständige Tastatur
- VoiceOver
- TalkBack
- alle bestehenden Spezialgates bis HS60
- mindestens ein realer Gruppennachweis für jedes der 15 Core-Spiele
- Wave-1-Labs separat in echten Browser-/PWA-/Gruppentests

## Nächste Reihenfolge

1. GitHub Actions / Hosted Runner / Billing-/Policy-Blocker lösen
2. PR #15 erneut mit aktuellem Releasebranch synchronisieren und 9-Pfade-Scope bestätigen
3. CI + Cross-Browser auf demselben Commit real ausführen
4. Branch Protection + Required Check aktivieren
5. Cloudflare-Pages-Staging real verbinden und HTTPS-Origin erzeugen
6. echten Staging-Smoke + PWA Upgrade/Rollback ausführen
7. Betreiber-/Support-/Security-/Legal-Angaben finalisieren
8. Android / iPhone / Tablet + Accessibility
9. reale Gruppen für alle 15 Core-Games
10. Asset-/Third-Party-Finalreview auf dem RC
11. Incident-/Rollback-Drill
12. unveränderlichen RC einfrieren
13. `release-evidence.json = FINAL / GO` erst nach vollständiger Evidence

## Releaseentscheidung

- öffentlicher Release: **NO_GO**
- PR #13 mergen: **Nein**
- PR #15 mergen: **Noch nicht**
- neue Core-Features: **Nein**
- alter Icon-Rechteblocker: **geschlossen**
- Gesamt-Asset-/Third-Party-Gate: **noch BLOCKED**
