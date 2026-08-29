# Secret Circle Party Hub

Secret Circle ist eine **offline-first Partyspiel-Plattform für gemeinsame Spiele auf einem Gerät**. Der Januar-2027-Release priorisiert sichere Übergaben, belastbare Wiederaufnahme, lokale Datenkontrolle, Accessibility und nachvollziehbare Release-Gates. Die langfristige Produktstrategie kombiniert **sehr einfache Bedienung mit einer sehr großen Mechanik-/Themenbibliothek**.

## Aktueller Stand

- **47 technisch spielbare Built-ins · 15 Core / 13 Extended / 19 Labs**
- bestehende Quick-/Trend-/Viral-Modi + 4 Advanced-Kernspiele
- neu in Labs: **Party Quiz** und **Fake oder Fakt** über einen gemeinsamen Wave-1-Runner
- Word Imposter + Smart Party Night + lokaler No-Code-Game-Creator
- Offline-PWA ohne Pflichtkonto, Tracking, Werbung oder Cloudzwang
- kein Wave-1-Lab erweitert automatisch den Januar-Core

Aktueller Offline-Core: **`secret-circle-v61` / `secret-circle-v61-staging`**  
Classic Content: **v4**  
Core Source Review/Hardening: **15/15 PREPARED**  
Accessibility: **PREPARED**  
Bestehende Spezialgates bis HS60: **source PREPARED, real evidence OPEN**  
Wave-1-Labs: **source PREPARED, real Browser/PWA/Group evidence OPEN**  
Operator / Hosting / Legal: **PREPARED / BLOCKED**  
Freigabe: **NO_GO**

**Quellsseitig gehärtet ist nicht automatisch releasefertig.**

## Releaseziel

- funktionsfertig: 30. November 2026
- Code Freeze: 5. Dezember 2026
- RC: 15. Dezember 2026
- öffentlicher Release: 4.–15. Januar 2027

## Hardening-/Expansion-Linie

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
- **v60:** Hidden persistiert Restzeit sofort für Cold Resume
- **v61:** erste Expansion-Wave-1-Labs auf gemeinsamer Quiz-Infrastruktur

## v61 – Expansion Wave 1

Erste implementierte Labs:

### Party Quiz

- Packs: Allgemeinwissen, Film & Serie, Technik
- 24 Built-in-Karten
- vier Antwortmöglichkeiten + kurze Erklärung
- lokaler Score
- Result-Resume ohne erneute Punktevergabe

### Fake oder Fakt

- Packs: Natur, Film & Serie, Technik
- 24 Built-in-Karten
- Fakt/Fake + kurze Erklärung
- lokaler Score
- derselbe gemeinsame Wave-1-Runner

Gemeinsame Verträge:

- `party-wave-one-catalog.js` v2
- `party-wave-one-modes.js`
- `quick-loader.js` v8 routet Wave-1 vor dem normalen Quick-Fallback
- beide IDs bleiben in **Labs**
- bestehender Quick-Family-Session-Replacement-Schutz wird wiederverwendet
- `tests/party-wave-one-catalog.test.js`
- `tests/e2e/wave-one-quiz.spec.js`
- `scripts/wave_one_quiz_audit.py`
- offline in `secret-circle-v61`

Langfristige Planung: `APP_SPIELMODI_UND_THEMEN_ANLEITUNG.md` + `GAME_LIBRARY_BACKLOG.json`.

## Produktregel für die große Spielebibliothek

Nicht 100 separate Engines bauen. Ziel:

> **20–30 belastbare Mechanikfamilien × viele Themen-/Content-Packs = 100+ sichtbare Spielvarianten bei weiterhin einfacher Bedienung.**

Standardspiele sollen in maximal **2–3 Entscheidungen** bis zur ersten echten Aktion starten. Built-in-Content bleibt ohne 18+-Bereich.

## CI – extern blockiert

Letzter vollständig untersuchter App-Actions-Lauf: **Run #2787 auf v49**, Run ID `32871536761`, Job `97879489858`, Head `a9ad91389ff9e966af432b0a77103ddc0960709d`, `steps: null` / `steps: []`. Kein Checkout, npm, Test oder Repositorycode wurde ausgeführt. Der Minimal-Runner-Probe zeigte dasselbe Muster.

**v50–v61 sind deshalb nicht runnerverifiziert.** Details: Issue #7 / `CI_TROUBLESHOOTING.md`.

## Zentrale offene Issues

1. **#7** – GitHub Actions / Hosted Runner endet vor Step 1
2. **#8** – reale Geräte, v61 Offline-PWA, Accessibility, Spezialgates, Wave-1-Labs und Partytests
3. **#14** – Operator, Hosting, Legal, Support und Incident Evidence

Zusätzlich bleibt die Rechtebasis des Root-`icon.svg` `unresolved`.

## Höchste Priorität

1. Hosted Runner / Online-`npm ci` / CI / Cross-Browser
2. Branch Protection
3. Provider + getrennte HTTPS-Staging-/Production-Origin
4. v61 PWA-Smoke / Upgrade / Rollback
5. bestehende Spezialgates real prüfen
6. Party Quiz + Fake oder Fakt real auf Browser/PWA/Accessibility/Gruppe prüfen
7. Android/iPhone/iPad inklusive App-Wechsel/Screen-Lock/Prozess-Kill
8. reale Gruppentests für alle 15 Core-Games
9. Asset-/Operator-/Legal-/Support-/Incident-Sign-off
10. unveränderlicher RC + `release-evidence.json = FINAL / GO`

**Aktuell: NO_GO. PR #13 bleibt Draft und wird nicht gemergt.**
