# Secret Circle Party Hub

Secret Circle ist eine **offline-first Partyspiel-Plattform für gemeinsame Spiele auf einem Gerät**. Der Januar-2027-Release priorisiert sichere Übergaben, belastbare Wiederaufnahme, lokale Datenkontrolle, Accessibility und nachvollziehbare Release-Gates.

## Aktueller Stand

- 45 technisch spielbare Built-ins · 15 Core / 13 Extended / 17 Labs
- 27 Quick-/Trend-/Viral-Modi · 4 Advanced-Kernspiele
- Word Imposter + Smart Party Night + lokaler No-Code-Game-Creator
- Offline-PWA ohne Pflichtkonto, Tracking, Werbung oder Cloudzwang

Aktueller Offline-Core: **`secret-circle-v60` / `secret-circle-v60-staging`**  
Classic Content: **v4**  
Core Source Review/Hardening: **15/15 PREPARED**  
Accessibility: **PREPARED**  
DWI / HR2 / BK51 / HR52 / PR53 / PT54 / AD55 / QR56 / QT57 / BF58 / BG59 / HS60: **source PREPARED, real evidence OPEN**  
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
- **v59:** Hidden pausiert laufende Quick-Family-Timer; kein Auto-Resume
- **v60:** Hidden persistiert die Restzeit sofort für Cold Resume auch ohne zuverlässiges `pagehide`

## v60 – Hidden Snapshot Durability

`party-session-controls.js` steht auf **Version 5**.

- `visibilitychange(hidden)` pausiert wie in BG59 und schreibt zusätzlich sofort den promptfreien Timer-Snapshot.
- Der Hidden-Pfad setzt **nicht** den Preserve-on-next-stop-Schalter; ein normaler Same-Page-Stop löscht den Zwischenstand wieder.
- Nur `pagehide` setzt Preserve-on-next-stop, weil dort der Engine-Stop direkt folgen kann.
- Wird die Seite vom mobilen OS nach `hidden` beendet, ohne dass `pagehide` zuverlässig läuft, kann ein Cold Resume dieselbe Restzeit über QT57 einmalig wieder aufnehmen.
- Backup-Dateiformat und 17-Key-Allowlist bleiben unverändert.

Verträge:

- `tests/party-session-controls.test.js`
- `tests/e2e/quick-background-pause.spec.js`
- `scripts/quick_hidden_snapshot_audit.py`
- QT57/BF58/BG59-Audits auf SessionControls v5
- `scripts/architecture_audit.py`

Realer RC-Nachweis: **HS60**.

## v59 / v58 / v57 / v56

- **BG59:** App-/Tabwechsel/Screen-Lock pausiert fair; sichtbare Rückkehr benötigt explizites Resume.
- **BF58:** BFCache Matching → kontrollierter Reload in QT57; stale → löschen ohne Reload.
- **QT57:** Restzeit über normalen Reload, promptfreier Timer-Store, 17-Key-Backupvertrag.
- **QR56:** bestätigter/fail-closed Same-/Cross-Game-Session-Ersatz.

## CI – extern blockiert

Letzter vollständig untersuchter App-Actions-Lauf: **Run #2787 auf v49**, Run ID `32871536761`, Job `97879489858`, Head `a9ad91389ff9e966af432b0a77103ddc0960709d`, `steps: null` / `steps: []`. Kein Checkout, npm, Test oder Repositorycode wurde ausgeführt. Der Minimal-Runner-Probe zeigte dasselbe Muster.

**v50–v60 sind deshalb nicht runnerverifiziert.** Details: Issue #7 / `CI_TROUBLESHOOTING.md`.

## Zentrale offene Issues

1. **#7** – GitHub Actions / Hosted Runner endet vor Step 1
2. **#8** – reale Geräte, v60 Offline-PWA, Accessibility, Spezialgates bis HS60 und Partytests
3. **#14** – Operator, Hosting, Legal, Support und Incident Evidence

Zusätzlich bleibt die Rechtebasis des Root-`icon.svg` `unresolved`.

## Höchste Priorität

1. Hosted Runner / Online-`npm ci` / CI / Cross-Browser
2. Branch Protection
3. Provider + getrennte HTTPS-Staging-/Production-Origin
4. v60 PWA-Smoke / Upgrade / Rollback
5. Spezialgates bis **HS60** real prüfen
6. Android/iPhone/iPad inklusive App-Wechsel/Screen-Lock/Prozess-Kill
7. VoiceOver/TalkBack/Tastatur/Zoom
8. reale Gruppentests für alle 15 Core-Games
9. Asset-/Operator-/Legal-/Support-/Incident-Sign-off
10. unveränderlicher RC + `release-evidence.json = FINAL / GO`

**Aktuell: NO_GO. PR #13 bleibt Draft und wird nicht gemergt.**