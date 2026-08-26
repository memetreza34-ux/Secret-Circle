# Secret Circle Party Hub

Secret Circle ist eine **offline-first Partyspiel-Plattform für gemeinsame Spiele auf einem Gerät**. Der Januar-2027-Release priorisiert sichere Übergaben, belastbare Wiederaufnahme, lokale Datenkontrolle, Accessibility und nachvollziehbare Release-Gates.

## Aktueller Stand

- 45 technisch spielbare Built-ins · 15 Core / 13 Extended / 17 Labs
- 27 Quick-/Trend-/Viral-Modi · 4 Advanced-Kernspiele
- Word Imposter + Smart Party Night + lokaler No-Code-Game-Creator
- Offline-PWA ohne Pflichtkonto, Tracking, Werbung oder Cloudzwang

Aktueller Offline-Core: **`secret-circle-v54` / `secret-circle-v54-staging`**  
Classic Content: **v4**  
Core Source Review/Hardening: **15/15 PREPARED**  
Accessibility: **PREPARED**  
Word-Imposter v48: **PREPARED**  
Hub Resume v49/v50: **PREPARED**  
Complete Backup v51: **PREPARED**  
Hub Round Resume v52: **PREPARED**  
Paranoia Resume/Privacy v53: **PREPARED**  
Pre-Timer Resume v54: **PREPARED**  
Operator / Hosting / Legal: **PREPARED / BLOCKED**  
Freigabe: **NO_GO**

**Quellsseitig gehärtet ist nicht automatisch releasefertig.**

## Releaseziel

- funktionsfertig: 30. November 2026
- Code Freeze: 5. Dezember 2026
- RC: 15. Dezember 2026
- öffentlicher Release: 4.–15. Januar 2027

## Hardening-Linie

- **v48:** Word-Imposter Voting-/Resume-/Datengrenzen, 50 Kategorien, 200 Begriffe, 1,5 MB UTF-8, fail-closed Import.
- **v49/v50:** zentraler Hub-Resume-Guard v2 und fail-closed Resume-Aktionen während Guard-Prüfung.
- **v51:** Complete Backup mit Registry, Future-Key-Erhalt, Vorvalidierung und managed-only Rollback.
- **v52:** sichere Truth-Dare-/Prompt-/Choice-Current-Karten; getrennte Wahrheit-/Pflicht-Pools.
- **v53:** Paranoia same-question/same-result Resume ohne Auto-Reveal; Concealment auch nach Auflösung.
- **v54:** Hot-Potato-Aufgabe und Wortketten-Startbuchstabe bleiben **vor Timerstart** über Reload identisch; beim Start wird `current` gelöscht und derselbe Wert in `timer.prompt` bzw. `timer.letter` übernommen. Scharade/Tabu bleiben aus diesem sichtbaren Pre-Start-Resume ausgeschlossen.

## v54 – Pre-Timer Resume

Runtime:

- `party-hub-round-state.js` **Version 3**
- `party-hub-timers.js` nutzt die zentrale Round-State-Quelle
- Hot Potato und Word Chain erhalten vor Timerstart eine validierte sichere Indexreferenz
- Reload/Resume verbraucht nicht still einen Ersatzwert
- Timerstart übergibt atomar von `current` an den Timer-Snapshot

Verträge:

- `tests/hub-resume-contract.test.js`
- `tests/hub-timer-contract.test.js`
- `tests/e2e/core-hub-prestart-resume.spec.js`
- `tests/service-worker.test.js`
- `ARCHITECTURE.md`

Realer RC-Nachweis: **PT54**.

## CI – extern blockiert

Letzter vollständig untersuchter App-Actions-Lauf: **Run #2787 auf v49**, Run ID `32871536761`, Job `97879489858`, Head `a9ad91389ff9e966af432b0a77103ddc0960709d`, `steps: null` / `steps: []`. Kein Checkout, npm, Test oder Repositorycode wurde ausgeführt. Der Minimal-Runner-Probe zeigte dasselbe Muster.

**v50–v54 sind deshalb nicht runnerverifiziert.** Details: Issue #7 / `CI_TROUBLESHOOTING.md`.

## Zentrale offene Issues

1. **#7** – GitHub Actions / Hosted Runner endet vor Step 1
2. **#8** – reale Geräte, v54 Offline-PWA, Accessibility, DWI, HR2, BK51, HR52, PR53, PT54 und Partytests
3. **#14** – Operator, Hosting, Legal, Support und Incident Evidence

Zusätzlich bleibt die Rechtebasis des Root-`icon.svg` `unresolved`.

## Höchste Priorität

1. Hosted Runner / Online-`npm ci` / CI / Cross-Browser
2. Branch Protection
3. Provider + getrennte HTTPS-Staging-/Production-Origin
4. v54 PWA-Smoke / Upgrade / Rollback
5. DWI + HR2 + BK51 + HR52 + PR53 + **PT54** real prüfen
6. Android/iPhone/iPad/VoiceOver/TalkBack/Tastatur/Zoom
7. reale Gruppentests für alle 15 Core-Games
8. Asset-/Operator-/Legal-/Support-/Incident-Sign-off
9. unveränderlicher RC + `release-evidence.json = FINAL / GO`

**Aktuell: NO_GO. PR #13 bleibt Draft und wird nicht gemergt.**