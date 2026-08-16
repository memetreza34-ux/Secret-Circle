# Secret Circle – A-bis-Z Entwicklungsstatus

Stand: 16. August 2026

Dieses Dokument ist der operative Fortschrittstracker zu `APP_ENTWICKLUNG_VON_A_BIS_Z.md`.

## Statuswerte

- **DONE** – für aktuellen Entwicklungsstand abgeschlossen
- **IN PROGRESS** – aktiv in Bearbeitung
- **PREPARED** – Grundlage vorhanden, reale/finale Abnahme fehlt
- **OPEN** – noch nicht systematisch bearbeitet
- **BLOCKED** – externer oder technischer Blocker
- **N/A V1** – bewusst nicht Teil Januar 2027

## Gesamtstatus

**Öffentliche Releasefreigabe: NO_GO**

Die quantitativen Core-Content-Ziele sind implementiert. Offen bleiben vor allem CI/Lockfile, manuelles Content-/Alters-/Privacy-Review, Security-Hardening, Accessibility, reale Geräte/PWA-Updates, Gruppentests, Recht/Support und Operations.

## A-bis-Z-Tracker

| # | Bereich | Status | Hauptnachweis | Nächste Aktion |
|---|---|---|---|---|
| 0 | Produktziel / Releasegrenze | DONE | Product Brief, Release Scope | bei Scopeänderung aktualisieren |
| A | Querschnittsverträge | PREPARED | Master-Anleitung, Architektur, Security, Requirements | reale Gates schließen |
| 1 | Discovery / Nutzer / Markt | DONE | Product Brief, Scenarios, Market Research | bei Produktänderung aktualisieren |
| 2 | Produktstrategie / Scope | PREPARED | Scope, Roadmap, Positionierung | reale Nutzer validieren |
| 3 | Plattformstrategie | PREPARED | `PLATFORM_STRATEGY.md` | reale Zielgeräte |
| 4 | Requirements / Akzeptanz | PREPARED | `REQUIREMENTS.md`, Core Contracts | Traceability real schließen |
| 5 | UX / IA / Design | PREPARED | `UX_FLOW.md`, `DESIGN_SYSTEM.md` | Hero/Startseite + reale UX-Tests |
| 6 | Architektur / ADR | PREPARED | `ARCHITECTURE.md` | Datenmodell/ADRs bei Bedarf |
| 7 | Security / Threat Model | PREPARED | `SECURITY.md`, `THREAT_MODEL.md` | SEC-F01/SEC-F02 |
| 8 | Repo / Environments / Git | BLOCKED | Workflows | Runner, Lockfile, `npm ci`, Branch Protection |
| 9 | Feature-Entwicklungsloop | PREPARED | Tests/Contracts/PR #13 | Restarbeit so fortführen |
| 10 | Fehlerbehandlung / Resilienz | PREPARED | Backup-/Session-/PWA-Verträge | reale Quota-/Updateabnahme |
| 11 | Tests / CI | BLOCKED | Testmatrix/Workflows | funktionierenden Actions-Runner |
| 12 | Offline / PWA / Resume | PREPARED | Service Worker **v33** | echte Geräte + alte→neue Updates |
| 13 | Content / Alter / Rechte | IN PROGRESS | drei Content-Wellen + Content-Gates | manuelles Review fortsetzen |
| 14 | Beta / reale Gruppen | OPEN | Scenarios/Checklist | 3–4 / 5–8 / 9–12 |
| 15 | Datenschutz / Recht / Support | OPEN | Privacy-/Security-Grundlage | Legal/Support/Third Party |
| 16 | Release Management / RC | PREPARED | Roadmap/Checklist | nach Gates |
| 17 | Deployment | PREPARED | `DEPLOYMENT.md` | HTTPS-Staging + Update/Rollback real |
| 18 | Operations / Incident | OPEN | Security-Meldeweg | Support + Incident Response |
| 19 | Wartung / Migration | PREPARED | Architektur/Backups/Changelog | Maintenance-Dokument |
| 20 | Risk Management | IN PROGRESS | `RISK_REGISTER.md` | laufend aktualisieren |

## Content – quantitative Arbeit abgeschlossen

### Welle 1

- Taboo 8 → 16
- Hot Potato 8 → 16
- Word Chain 5 → 10
- Two Truths 8 → 16
- Question Imposter 8 → 16
- Location Spy 8 → 16

### Welle 2

- Never Have 8 → 24
- Most Likely 8 → 24
- Would Rather 8 → 24
- Paranoia 8 → 20
- Wrong Answers 8 → 24

### Welle 3

- Truth/Dare 16 → 24 je Pack
- Charades 12 → 30 je Pack
- Taboo 16 → 24 je Pack
- Hot Potato 16 → 20 je Pack

Kein Core-Pack besitzt nach unserem Vertrag noch einen bekannten quantitativen Shortfall.

## Manuelles Content-/Privacy-Review – begonnen

Erster konkreter Fund wurde geschlossen:

- entfernt aus dem finalen Runtime-Content: Aufforderung, die letzte private Handy-Nachricht vorzulesen
- entfernt aus dem finalen Runtime-Content: Frage nach dem seltsamsten Inhalt der Kamerarolle
- ersetzt durch harmlose, selbstbestimmte Alternativen
- `tests/core-content-quality.test.js` blockiert die beiden alten Texte als Regression

Damit ist der konkrete Privacy-Fund geschlossen, aber **das gesamte manuelle Review ist noch nicht fertig**.

## PWA / Audit-Synchronität

Aktuell: **`secret-circle-v33`**.

- beide Core-Contentmodule im Offline-Core
- Service-Worker-Test erwartet v33
- Architektur und Deployment auf v33 synchronisiert
- `scripts/release_audit.py` leitet Cachegeneration jetzt dynamisch aus `sw.js` ab statt v30/v32 einzubrennen
- `scripts/architecture_audit.py` und `scripts/validate_project.py` verwenden ebenfalls den tatsächlichen Cachevertrag

## Nächste Arbeitsreihenfolge

1. manuelles Core-Content-/Alters-/Safety-Review vollständig durchführen
2. `CORE_CONTENT_REVIEW.md` als nachvollziehbare 15-Spiel-Matrix erstellen
3. weitere konkrete Content-Funde beheben und regressionssichern
4. Hero-/Startseitenpositionierung auf echten USP umstellen
5. SEC-F01/SEC-F02 härten
6. Lockfile + `npm ci`
7. Branch Protection
8. Accessibility
9. reale Geräte/PWA-Updates
10. reale Gruppen
11. Recht/Support/Lizenz
12. Operations/Maintenance
13. RC/Production

## Was weiterhin NICHT als bestanden gilt

Wegen des externen Runnerproblems nicht behaupten:

- `npm run ci` grün
- Cross-Browser grün
- Content-Test tatsächlich grün
- v33-Update auf realen installierten PWAs bestätigt
- Accessibility/Touchziele auf Zielgeräten bestätigt

## Arbeitsregel

Wir arbeiten die A-bis-Z-Anleitung weiter nach unten. Neue P0/P1-Funde dürfen die Reihenfolge vorziehen. Jede Erkenntnis darf Produkt-, Architektur-, Test-, Risiko- und Releaseverträge ändern.
