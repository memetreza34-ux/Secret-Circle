# Secret Circle Party Hub

Secret Circle ist eine **offline-first Partyspiel-Plattform für gemeinsame Spiele auf einem Gerät**. Der Januar-2027-Release priorisiert sichere Übergaben, belastbare Wiederaufnahme, lokale Datenkontrolle, Accessibility und nachvollziehbare Release-Gates.

## Aktueller Stand

- 45 technisch spielbare Built-ins · 15 Core / 13 Extended / 17 Labs
- 27 Quick-/Trend-/Viral-Modi · 4 Advanced-Kernspiele
- Word Imposter + Smart Party Night + lokaler No-Code-Game-Creator
- Offline-PWA ohne Pflichtkonto, Tracking, Werbung oder Cloudzwang

Aktueller Offline-Core: **`secret-circle-v56` / `secret-circle-v56-staging`**  
Classic Content: **v4**  
Core Source Review/Hardening: **15/15 PREPARED**  
Accessibility: **PREPARED**  
DWI / HR2 / BK51 / HR52 / PR53 / PT54 / AD55 / QR56: **source PREPARED, real evidence OPEN**  
Operator / Hosting / Legal: **PREPARED / BLOCKED**  
Freigabe: **NO_GO**

**Quellsseitig gehärtet ist nicht automatisch releasefertig.**

## Releaseziel

- funktionsfertig: 30. November 2026
- Code Freeze: 5. Dezember 2026
- RC: 15. Dezember 2026
- öffentlicher Release: 4.–15. Januar 2027

## Hardening-Linie

- **v48:** Word-Imposter Voting-/Resume-/Datengrenzen
- **v49/v50:** zentraler Hub-Resume-Guard + fail-closed Loader
- **v51:** Complete Backup / Forward Compatibility
- **v52:** sichere Hub-Current-Runden + getrennte Truth/Dare-Pools
- **v53:** Paranoia same-question/same-result ohne Auto-Reveal
- **v54:** Hot-Potato-/Word-Chain-Pre-Timer-Resume
- **v55:** Advanced Result-/Winner-/Resume-Integrität + bestätigter Ersatz einer gespeicherten Advanced-Session
- **v56:** bestätigter und fail-closed Ersatz gespeicherter Quick-/Mega-/Viral-/Creator-Sessions

## v56 – Quick Session Replacement

Neu gehärtet:

- neues `quick-session-replacement-guard.js` **Version 1**
- `quick-loader.js` **Version 7** lädt Ledger → Controls → Replacement Guard → Engine
- schützt Quick/Trending, Mega, Viral und Creator mit ihren jeweiligen Active-Storage-Keys
- „Spiel starten“ darf einen plausiblen gespeicherten Snapshot nicht mehr still überschreiben
- Same-Game-Neustart verlangt eine ausdrückliche Verwerfbestätigung
- Cross-Game-Wechsel innerhalb derselben Enginefamilie verlangt dieselbe Bestätigung, auch wenn der fremde Snapshot auf der neuen Spielseite nicht als Resume-Karte angezeigt wird
- Cancel lässt Game-ID, Session-ID und Storage unverändert
- der alte Snapshot wird vor dem Neustart **nicht** gelöscht; erst der erfolgreiche Engine-Write ersetzt ihn
- schlägt dieser Write fehl, erkennt der Guard den unveränderten Alt-Snapshot, verhindert den `pagehide`-Retry des fehlerhaften In-Memory-Zustands und lädt fail-closed neu

Verträge:

- `tests/quick-session-replacement-guard.test.js`
- `tests/e2e/quick-session-replacement.spec.js`
- `tests/e2e/party-session-controls.spec.js` prüft Controls → Guard → Engine für Quick/Mega/Viral
- `tests/quick-loader.test.js` prüft Loader v7 inklusive Creator-Familie
- `scripts/quick_session_replacement_audit.py` in `npm run validate`
- `scripts/architecture_audit.py` erzwingt Modul-, Offline- und Buildgrenzen

Realer RC-Nachweis: **QR56**.

## CI – extern blockiert

Letzter vollständig untersuchter App-Actions-Lauf: **Run #2787 auf v49**, Run ID `32871536761`, Job `97879489858`, Head `a9ad91389ff9e966af432b0a77103ddc0960709d`, `steps: null` / `steps: []`. Kein Checkout, npm, Test oder Repositorycode wurde ausgeführt. Der Minimal-Runner-Probe zeigte dasselbe Muster.

**v50–v56 sind deshalb nicht runnerverifiziert.** Details: Issue #7 / `CI_TROUBLESHOOTING.md`.

## Zentrale offene Issues

1. **#7** – GitHub Actions / Hosted Runner endet vor Step 1
2. **#8** – reale Geräte, v56 Offline-PWA, Accessibility, DWI, HR2, BK51, HR52, PR53, PT54, AD55, QR56 und Partytests
3. **#14** – Operator, Hosting, Legal, Support und Incident Evidence

Zusätzlich bleibt die Rechtebasis des Root-`icon.svg` `unresolved`.

## Höchste Priorität

1. Hosted Runner / Online-`npm ci` / CI / Cross-Browser
2. Branch Protection
3. Provider + getrennte HTTPS-Staging-/Production-Origin
4. v56 PWA-Smoke / Upgrade / Rollback
5. DWI + HR2 + BK51 + HR52 + PR53 + PT54 + AD55 + **QR56** real prüfen
6. Android/iPhone/iPad/VoiceOver/TalkBack/Tastatur/Zoom
7. reale Gruppentests für alle 15 Core-Games
8. Asset-/Operator-/Legal-/Support-/Incident-Sign-off
9. unveränderlicher RC + `release-evidence.json = FINAL / GO`

**Aktuell: NO_GO. PR #13 bleibt Draft und wird nicht gemergt.**