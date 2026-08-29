# Secret Circle – Hosting-Provider-Research

Stand: 29. August 2026  
Status: **RESEARCHED / PREFERRED CANDIDATE – noch nicht SELECTED**

Dieses Dokument bewertet den Hostingfit für die statische v64-PWA. Es ersetzt weder die reale Konto-/Vertragsprüfung noch die Datenschutz-/DPA-/Drittlandprüfung. `operator-release.json.hosting.provider` bleibt deshalb bis zu echter Auswahl `null`.

## 1. Anforderungen aus dem Releasevertrag

Secret Circle benötigt für V1:

- statisches HTTPS-Hosting ohne notwendiges Backend
- private GitHub-Repository-Anbindung
- getrennte Preview-/Staging- und Production-Deployments
- kontrollierbare Response-Header
- Response-CSP mit `frame-ancestors 'none'`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: no-referrer`
- `X-Frame-Options: DENY`
- Production-HSTS
- kontrollierbares `Cache-Control` für `sw.js`
- Custom Domain / TLS
- nachvollziehbare Provider-/DPA-/Log-/Transferprüfung
- einfacher Rollback-/Deploymentpfad

Source-Konfiguration: `_headers`.  
Netzwerkprüfung: `scripts/staging_smoke.py`.

## 2. Preferred technical candidate: Cloudflare Pages

### Technischer Fit

Aktuelle offizielle Cloudflare-Pages-Dokumentation bestätigt:

- GitHub-/GitLab-Git-Integration
- Production-Branch und Preview-Deployments
- Branch-Build-Control für Preview-/Production-Branches
- eigene statische Response-Header über `_headers`
- Preview-URLs für Branches/PRs
- statische Asset-Requests auf Free und Paid ohne Request-/Bandwidth-Berechnung im Pages-Static-Asset-Modell
- Free-Plan-Limit von 500 Builds/Monat laut Pages-Limits
- Custom Domains / HTTPS im Pages-Produkt

Für diese App ist besonders passend, dass **keine Pages Functions benötigt werden**. Dadurch bleibt der Runtimepfad rein statisch und der vorhandene Offline-/Privacy-Vertrag klein.

### Empfohlene Pages-Struktur

```text
Repository: memetreza34-ux/Secret-Circle
Build mode: static
Build command: exit 0 (oder äquivalenter No-Build-Pfad nach realer Pages-Konfiguration)
Build output: Repository-Root mit index.html / party.html / sw.js
Production branch: erst nach finaler Branchstrategie festlegen
Preview branches: Release-/Staging-Branch gezielt freigeben
Source headers: /_headers
Functions: keine für V1
Web Analytics: nicht automatisch aktivieren
```

**Wichtig:** Der heutige Releasebranch/PR-Stack ist noch nicht final reconciled/CI-verifiziert. Daher jetzt keine automatische Production-Branch-Veröffentlichung auf `main` konfigurieren.

## 3. Alternative: Netlify

Netlify erfüllt technisch ebenfalls viele Anforderungen:

- `_headers` oder `netlify.toml` für Custom Response Headers
- Deploy Previews für Pull Requests
- Branch Deploys
- Custom Domains + SSL

Nach aktueller offizieller Preisstruktur hat der Free-Plan jedoch ein monatliches **300-Credit-Hard-Limit**. Bei Erreichen des Limits können Free-Projekte bis zum nächsten Abrechnungszyklus pausieren. Für eine einfache statische App ist das nicht automatisch problematisch, aber Cloudflare Pages hat für diesen konkreten statischen V1-Use-Case den günstigeren technischen Fit.

Netlify bleibt **Fallback**, nicht ausgeschieden.

## 4. Warum GitHub Pages aktuell nicht bevorzugt wird

Der Secret-Circle-Releasevertrag verlangt kontrollierbare HTTP-Response-Security-Header und eine konkrete `sw.js`-Cache-Policy. Solange diese Anforderungen nicht zuverlässig auf der echten GitHub-Pages-Origin konfigurierbar und nachweisbar sind, ist GitHub Pages für den finalen Hosting-PASS nicht die bevorzugte Option.

## 5. Datenschutz-/DPA-Hinweis zu Cloudflare

Cloudflare stellt ein Customer Data Processing Addendum bereit. Die aktuelle DPA-Fassung ist laut offizieller Seite Version 6.4 mit Wirkung zum 3. April 2026 und bezieht auch Self-Serve Agreements ein.

Das bedeutet **nicht**, dass der Datenschutzcheck automatisch bestanden ist. Vor finaler Auswahl müssen real geprüft und dokumentiert werden:

- welche Endnutzer-/Request-/Logdaten für Pages tatsächlich verarbeitet werden
- Rolle von Cloudflare für diese Daten
- Aufbewahrung/Löschung
- Unterauftragnehmer
- internationale Übermittlungen / Transfermechanismen
- reale Account-/Tarifbedingungen
- ob zusätzliche Analytics/Logs aktiviert werden

Cloudflares Data Localization Suite / Customer Metadata Boundary bietet weitergehende regionale Kontrolle, ist nach aktueller Dokumentation jedoch Enterprise-orientiert bzw. Enterprise-only. Für V1 darf daher **keine EU-only-Datenhaltung behauptet werden**, solange sie nicht real vertraglich/technisch besteht.

## 6. Aktuelle Entscheidung

```text
preferredTechnicalCandidate: Cloudflare Pages
providerSelected: false
productionConfigured: false
stagingConfigured: false
customDomainConfigured: false
dpaReviewedForRealAccount: false
thirdCountryTransferReviewed: false
networkSmokeExecuted: false
```

Deshalb bleiben in `release-evidence.json`:

- `stagingHttpSmoke = BLOCKED`
- `productionSmoke = BLOCKED`
- `legalPrivacy = BLOCKED`

## 7. Voraussetzungen für echte Auswahl

Vor `providerSelected: true`:

- [ ] Cloudflare-Konto/Pages real verfügbar
- [ ] reales Self-Serve-/Tarifmodell geprüft
- [ ] DPA für den realen Account geprüft
- [ ] Privacy-/Transferposition dokumentiert
- [ ] GitHub-Repo verbunden
- [ ] Preview-/Staging-Branch festgelegt
- [ ] Production-Branch bewusst festgelegt
- [ ] getrennte HTTPS-Staging-/Production-Origin verfügbar
- [ ] `_headers` wird auf echter Origin wirksam ausgeliefert
- [ ] `scripts/staging_smoke.py` grün
- [ ] `sw.js` Cache-Control grün
- [ ] keine unerwünschte Analytics-/Tracking-Funktion aktiviert

## 8. Offizielle Quellen – Stand der Recherche

Cloudflare Pages Headers:  
https://developers.cloudflare.com/pages/configuration/headers/

Cloudflare Pages Branch Build Controls:  
https://developers.cloudflare.com/pages/configuration/branch-build-controls/

Cloudflare Pages Git Integration:  
https://developers.cloudflare.com/pages/configuration/git-integration/

Cloudflare Pages Limits:  
https://developers.cloudflare.com/pages/platform/limits/

Cloudflare Pages Static Asset / Functions Pricing:  
https://developers.cloudflare.com/pages/functions/pricing/

Cloudflare Customer DPA:  
https://www.cloudflare.com/cloudflare-customer-dpa/

Cloudflare Customer Metadata Boundary:  
https://developers.cloudflare.com/data-localization/metadata-boundary/

Netlify Custom Headers:  
https://docs.netlify.com/manage/routing/headers/

Netlify Deploy Previews:  
https://docs.netlify.com/deploy/deploy-types/deploy-previews/

Netlify Pricing:  
https://www.netlify.com/pricing/

## 9. Release-Regel

**RESEARCHED / PREFERRED CANDIDATE ist kein HOSTING PASS.**

Erst der reale Provideraccount, reale Origins, reale Privacy-/DPA-Prüfung und grüne Netzwerk-/PWA-/Rollback-Evidence dürfen `operator-release.json` und `release-evidence.json` auf einen finalen Hostingstatus bringen.
