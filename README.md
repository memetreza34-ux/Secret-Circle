# Secret Circle Party Hub

Secret Circle ist eine **offline-first Partyspiel-Plattform für gemeinsame Spiele auf einem Gerät**. Der Januar-2027-Release priorisiert sichere Übergaben, belastbare Wiederaufnahme, lokale Datenkontrolle, Accessibility und nachvollziehbare Release-Gates. Die langfristige Produktstrategie kombiniert **sehr einfache Bedienung mit einer sehr großen Mechanik-/Themenbibliothek**.

## Aktueller Stand

- **55 technisch spielbare Built-ins · 15 Core / 13 Extended / 27 Labs**
- bestehende Quick-/Trend-/Viral-Modi + 4 Advanced-Kernspiele
- **Expansion Wave 1: 10/10 geplante Labs quellsseitig implementiert**
- Word Imposter + Smart Party Night + lokaler No-Code-Game-Creator
- Offline-PWA ohne Pflichtkonto, Tracking, Werbung oder Cloudzwang
- kein Wave-1-Lab erweitert automatisch den Januar-Core

Aktueller Offline-Core: **`secret-circle-v64` / `secret-circle-v64-staging`**  
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
- **v61:** gemeinsame Quiz-Infrastruktur für Party Quiz + Fake oder Fakt
- **v62:** gemeinsame Imposter-Infrastruktur für Undercover Similar Word + No-Word Imposter
- **v63:** gemeinsame Writing-Infrastruktur für Fill-the-Blank Battle + Who Wrote It
- **v64:** Expansion Wave 1 mit 10/10 geplanten Labs quellsseitig komplett

## v64 – Expansion Wave 1 Complete

Die zehn geplanten Wave-1-Labs sind quellsseitig implementiert:

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

Wave 1 verwendet wiederverwendbare Enginefamilien für Quiz, Imposter, Writing, Estimation/Voting, Bluff und Clue. Die neuen Modi bleiben **Labs**, bis reale Browser-, PWA-, Accessibility- und Gruppentests bestanden sind.

Gemeinsame Verträge:

- mehrere kleine Wave-1-Katalog-Layer statt separater Voll-Engines pro sichtbarem Spiel
- `quick-loader.js` v11 routet alle sechs Wave-1-Enginefamilien explizit vor dem normalen Quick-Fallback
- `party-release-structure.js` v5 klassifiziert alle zehn Wave-1-Modi als Labs
- Unit-/E2E-Verträge für Quiz, Imposter, Writing sowie Prozent/Bracket/Bluff/Clue
- `scripts/wave_one_remaining_audit.py` erzwingt Wave 1 = 10/10 und v64
- offline in `secret-circle-v64`

Langfristige Planung: `APP_SPIELMODI_UND_THEMEN_ANLEITUNG.md` + `GAME_LIBRARY_BACKLOG.json`.

## Produktregel für die große Spielebibliothek

Nicht 100 separate Engines bauen. Ziel:

> **20–30 belastbare Mechanikfamilien × viele Themen-/Content-Packs = 100+ sichtbare Spielvarianten bei weiterhin einfacher Bedienung.**

Standardspiele sollen in maximal **2–3 Entscheidungen** bis zur ersten echten Aktion starten. Built-in-Content bleibt ohne 18+-Bereich.

## CI – extern blockiert

Aktuellster direkt untersuchter App-Actions-Lauf: **Run #3608**, Run ID `33253663445`, Job `99103557030`, Head `2297868e1f65b45753294151a3b1f401a55f6288` auf `agent/release-foundation-2027`. Ergebnis: `failure`, `steps: []`, `runner_id: 0`, `runner_name: ""`; angefordert war `ubuntu-latest`. Kein Checkout, npm, Playwright, Python-Audit oder sonstiger Repositorycode wurde ausgeführt.

Der v64-Lauf bestätigt damit das bereits bekannte Muster auf aktuellem Code: der unmittelbare Blocker liegt weiterhin **vor Repository-Ausführung**, sehr wahrscheinlich im Bereich Hosted-Runner-Zuteilung bzw. Actions-Account-/Billing-/Policy-Gate. Details und Chronologie: Issue #7 / `CI_TROUBLESHOOTING.md`.

**v50–v64 besitzen deshalb weiterhin keinen Hosted-Runner-PASS.**

## Zentrale offene Issues

1. **#7** – GitHub Actions / Hosted Runner endet vor Step 1
2. **#8** – reale Geräte, v64 Offline-PWA, Accessibility, Spezialgates, Wave-1-Labs und Partytests
3. **#14** – Operator, Hosting, Legal, Support und Incident Evidence

Zusätzlich bleibt die Rechtebasis des Root-`icon.svg` `unresolved`.

## Höchste Priorität

1. Hosted Runner / Online-`npm ci` / CI / Cross-Browser
2. Branch Protection
3. Provider + getrennte HTTPS-Staging-/Production-Origin
4. v64 PWA-Smoke / Upgrade / Rollback
5. bestehende Spezialgates bis HS60 real prüfen
6. Wave-1-Labs real auf Browser/PWA/Accessibility/Gruppe prüfen
7. Android/iPhone/iPad inklusive App-Wechsel/Screen-Lock/Prozess-Kill
8. reale Gruppentests für alle 15 Core-Games
9. Asset-/Operator-/Legal-/Support-/Incident-Sign-off
10. unveränderlicher RC + `release-evidence.json = FINAL / GO`

**Feature-Scope für den Januar-Core nicht weiter aufblasen. Jetzt liegt der Schwerpunkt auf realer Verifikation und Release-Evidence.**

**Aktuell: NO_GO. PR #13 bleibt Draft und wird nicht gemergt.**
