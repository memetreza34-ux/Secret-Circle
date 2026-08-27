# Secret Circle Party Hub

Secret Circle ist eine **offline-first Partyspiel-Plattform für gemeinsame Spiele auf einem Gerät**. Der Januar-2027-Release priorisiert sichere Übergaben, belastbare Wiederaufnahme, lokale Datenkontrolle, Accessibility und nachvollziehbare Release-Gates.

## Aktueller Stand

- 45 technisch spielbare Built-ins · 15 Core / 13 Extended / 17 Labs
- 27 Quick-/Trend-/Viral-Modi · 4 Advanced-Kernspiele
- Word Imposter + Smart Party Night + lokaler No-Code-Game-Creator
- Offline-PWA ohne Pflichtkonto, Tracking, Werbung oder Cloudzwang

Aktueller Offline-Core: **`secret-circle-v58` / `secret-circle-v58-staging`**  
Classic Content: **v4**  
Core Source Review/Hardening: **15/15 PREPARED**  
Accessibility: **PREPARED**  
DWI / HR2 / BK51 / HR52 / PR53 / PT54 / AD55 / QR56 / QT57 / BF58: **source PREPARED, real evidence OPEN**  
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
- **v55:** Advanced Result-/Winner-/Resume-Integrität
- **v56:** bestätigter/fail-closed Quick-Family-Session-Ersatz
- **v57:** Quick-Family-Timer behalten Restzeit über normalen Reload
- **v58:** BFCache-Rückkehr führt sicher zurück in den Timer-Resume-Pfad

## v58 – BFCache Timer Resume

Neu gehärtet:

- `party-session-controls.js` **Version 3**
- `pageshow.persisted` wird als eigener Browser-Lifecycle behandelt
- wenn ein passender Quick-Family-Timer-Snapshot zur aktuellen Session existiert, erfolgt ein kontrollierter Reload in den normalen v57-Resume-Pfad
- der passende Snapshot wird vor diesem Reload nicht gelöscht
- ein fremder oder veralteter Snapshot wird entfernt, ohne unnötigen Reload
- dadurch bleibt nach Safari-/Chrome-BFCache-Rückkehr kein zuvor gestoppter In-Memory-Timer eingefroren sichtbar

Verträge:

- `tests/party-session-controls.test.js`
- `scripts/quick_bfcache_resume_audit.py`
- `scripts/quick_timer_resume_audit.py`
- `scripts/architecture_audit.py`

Realer RC-Nachweis: **BF58**.

## v57 – Quick Timer Resume

`party-session-controls.js` führte den promptfreien Store `secret-circle-party-quick-timers-v1` ein. Quick/Trending, Mega, Viral und Creator übernehmen Restzeit nur bei exakt passender Game-ID, Session-ID, Runde, Phase und Ausgangsdauer. Complete Backup verwaltet dafür 17 exakte aktuelle Keys. Realer RC-Nachweis: **QT57**.

## v56 – Quick Session Replacement

`quick-session-replacement-guard.js` v1 + `quick-loader.js` v7 schützen Quick/Trending, Mega, Viral und Creator vor stillem Same-/Cross-Game-Überschreiben. Cancel erhält den Alt-Snapshot; Write-Fail bleibt fail-closed. Realer RC-Nachweis: **QR56**.

## CI – extern blockiert

Letzter vollständig untersuchter App-Actions-Lauf: **Run #2787 auf v49**, Run ID `32871536761`, Job `97879489858`, Head `a9ad91389ff9e966af432b0a77103ddc0960709d`, `steps: null` / `steps: []`. Kein Checkout, npm, Test oder Repositorycode wurde ausgeführt. Der Minimal-Runner-Probe zeigte dasselbe Muster.

**v50–v58 sind deshalb nicht runnerverifiziert.** Details: Issue #7 / `CI_TROUBLESHOOTING.md`.

## Zentrale offene Issues

1. **#7** – GitHub Actions / Hosted Runner endet vor Step 1
2. **#8** – reale Geräte, v58 Offline-PWA, Accessibility, DWI, HR2, BK51, HR52, PR53, PT54, AD55, QR56, QT57, BF58 und Partytests
3. **#14** – Operator, Hosting, Legal, Support und Incident Evidence

Zusätzlich bleibt die Rechtebasis des Root-`icon.svg` `unresolved`.

## Höchste Priorität

1. Hosted Runner / Online-`npm ci` / CI / Cross-Browser
2. Branch Protection
3. Provider + getrennte HTTPS-Staging-/Production-Origin
4. v58 PWA-Smoke / Upgrade / Rollback
5. DWI + HR2 + BK51 + HR52 + PR53 + PT54 + AD55 + QR56 + QT57 + **BF58** real prüfen
6. Android/iPhone/iPad/VoiceOver/TalkBack/Tastatur/Zoom
7. reale Gruppentests für alle 15 Core-Games
8. Asset-/Operator-/Legal-/Support-/Incident-Sign-off
9. unveränderlicher RC + `release-evidence.json = FINAL / GO`

**Aktuell: NO_GO. PR #13 bleibt Draft und wird nicht gemergt.**