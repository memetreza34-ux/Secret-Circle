# Secret Circle – Verbindliche Übergabe ChatGPT → Claude Code / Codex

**Stand: 16. Oktober 2026.** Ausgangspunkt: `main`-Commit **`e1befbe1f22bed9d45a143320c2615f0bd699a7d`** nach gemergten PRs #34, #35, #37, #38, #39 und #40. **Vor jeder Änderung den dann aktuellen `main`-SHA erneut abfragen.**

## 1. Nicht verhandelbare Produktentscheidung

**Version 1 soll ALLE 55 bereits implementierten Spiele enthalten:** 15 Core, 13 Extended, 27 Labs. Kein Spiel streichen, verstecken, nicht testen oder als erledigt markieren, nur weil es `extended` oder `labs` heißt. Die Tier-Etiketten bleiben derzeit historische Katalogkategorien. Dass der **Schnellstart** standardmäßig nur Kernspiele empfiehlt, ändert nichts daran, dass über den vollständigen Katalog alle 55 verfügbar und vor Freigabe abgenommen werden sollen.

**Keine neuen Spielideen, keine großflächige Architekturänderung, kein unnötiges Redesign.** Priorität: vorhandene 55 Spiele, sichere Daten, reibungsloses Party-Erlebnis, nachvollziehbare Testbelege. **Release ist NO_GO**, bis alle für den gewählten Release erforderlichen Gates tatsächlich erfüllt sind.

## 2. Was bereits nachgewiesen ist (nicht doppelt entwickeln)

| Nachweis | Beleg / ehrliche Reichweite |
| --- | --- |
| Kanonischer Start `/`, unabhängiger Word-Imposter-Pfad, sichere Direktlinks | PRs [#34](https://github.com/memetreza34-ux/Secret-Circle/pull/34) und [#35](https://github.com/memetreza34-ux/Secret-Circle/pull/35), gemergt |
| Echte Gruppe beim ersten Start statt Demo-Namen | PR [#37](https://github.com/memetreza34-ux/Secret-Circle/pull/37), gemergt |
| V1-Schnellstart nur Kernspiele, Altersfilter eingehalten | PR [#38](https://github.com/memetreza34-ux/Secret-Circle/pull/38), gemergt |
| Altersfilter im V2-Root, Katalog, Empfehlungen und Direktlinks | PR [#39](https://github.com/memetreza34-ux/Secret-Circle/pull/39), gemergt; Commit `bf5de72b9d6677a38120b57d911b2ebbead56746` |
| **55 von 55 Spiele bis zur ersten aktiven Szene automatisch gestartet** | PR [#40](https://github.com/memetreza34-ux/Secret-Circle/pull/40), gemergt; Merge `e1befbe1f22bed9d45a143320c2615f0bd699a7d`. E2E-Datei `tests/e2e/all-55-game-launch.spec.js`; [CI #38886549437](https://github.com/memetreza34-ux/Secret-Circle/actions/runs/38886549437) Chromium-Validierung und WebKit bestanden; [Cross-Browser #38886549438](https://github.com/memetreza34-ux/Secret-Circle/actions/runs/38886549438) bestanden; finaler PR-Head `907ce6a5def625af8a79ced13be1812e0eff5c4e`. **Das ist kein Beweis für abgeschlossene Runden oder 55 echte Geräteprüfungen.** |
| PWA-Generation | `v99`, `secret-circle-v99` / `secret-circle-v99-staging`; Core-Prüfsumme in `release-meta.json`. Keine neue Version für reine Markdown-Änderungen nötig. |
| Nach-Merge-CI für #40 | [Run #38898973994](https://github.com/memetreza34-ux/Secret-Circle/actions/runs/38898973994) inzwischen **erfolgreich** (`validate` und `e2e-webkit` auf `e1befbe`, 16.10.2026). Für neue Commits immer neu prüfen. |

**Nicht abgeschlossen:** 55 spieltypische Ergebnisse/Replay, Privacy-Risiko in allen geheimen Runden, reale Gruppenabnahme und echte Geräte, PWA-Offline-Upgrade von alten Installationen, Hosting/HTTPS/Betreiber- und Rechtefreigabe, Schutz von `main` war bei Übergabe `protected:false`; **seit 16.10.2026 aktiv** (Pflicht-Checks `validate`, `e2e-webkit`, `smoke`, siehe `BRANCH_PROTECTION.md`). **Keine erfundenen PASS-Häkchen.**

## 3. Aufteilung – eine Datei/ein Verantwortlicher zur Zeit

### Claude Code = Technik und echte 55-Spiel-Abnahme

**Startauftrag:** [Issue #41](https://github.com/memetreza34-ux/Secret-Circle/issues/41). Beginne mit neuestem `main`, `AGENTS.md`, `docs/PROJEKT_KOMPASS.md`, `SECURITY.md`, `THREAT_MODEL.md`, `BACKUP_SCHEMAS.md`, `RELEASE_CHECKLIST.md`. Prüfe zuerst den Erfolg der neuesten `main`-CI.

- Erzeuge eine **vollständige Matrix aller 55 realen Spiel-IDs** mit Eigentümer-Engine, Ergebnis-/Replay-Test und Status `NOT_RUN/PASS/FAIL/BLOCKED_REAL_DEVICE`, Nachweis-Link, Code-SHA. Nicht am Titel allein klassifizieren.
- **Jedes Spiel vom Setup bis zum Rundenende und Replay/Weiter spielen** und passende Tests hinzufügen. Zusätzlich Kantenfälle: absichtlicher Skip, Abbruch, ungültige Gruppengröße, Doppelklick/exact-once History/Punkte, Browser-Neuladen, Session-Wiederherstellung, secret reveal, Timer/Background, Paketwechsel und Offline – risikobasiert.
- Sichtbare Fehler **erst reproduzieren, dann root-cause-fixen und Regressionstest schreiben**. Keine Tests mit `skip` grün färben. Keine ungetestete Änderung in `main`.
- In **kleinen getrennten PRs pro Engine-Familie** arbeiten: Party-Hub/Word Imposter/Advanced/Quick-Viral-Mega/Wave-One etc. Andere laufende PRs auf Dateiüberschneidung prüfen.
- Nach jeder Produktionsdatei im Offline-Core: Service-Worker Cachegeneration, `release-meta.json`, `operator-release.json`, Changelog, `scripts/offline_core_lock.py` wie durch die Repository-Audits verlangt aktualisieren.
- Nach jedem PR: `npm run check`, `npm test`, `npm run validate`, `npm run test:e2e`, Chromium Desktop/Mobile, WebKit Desktop/Mobile, Firefox-/Cross-Browser-Smoke, tatsächliche Fehler und genaue Commit-SHA berichten.
- **Keine Bilder-/Design-Generierung** in Claudes Engine-PRs. CSS-/Markup nur wenn für spieltechnische Korrektheit unumgänglich; Codex anschließend visuell abstimmen lassen.

**Lieferobjekt:** 55/55 tatsächliche Spielabläufe mit Ergebnis und Replay nachgewiesen, reproduzierbare Bugs behoben, grüne PR-Checks und präzise noch offene Realgeräte-Fälle. Nicht automatisch öffentlich deployen.

### Codex = Design, UX, Assets aller 55 Spiele

**Startauftrag:** [Issue #42](https://github.com/memetreza34-ux/Secret-Circle/issues/42). Auf **neuestem `main`** beginnen, nicht auf altem `design/v2-gesamt` oder dem nicht mergebaren [Draft-PR #30](https://github.com/memetreza34-ux/Secret-Circle/pull/30) aufsetzen. Aus #30 gegebenenfalls **nur bewiesenermaßen fehlende** visuelle/Asset-Verbesserungen selektiv in neue kleine PRs übernehmen. PR #13 ebenfalls nicht blind mergen.

- Überprüfe für **alle 55 Spiele** Kartendarstellung und tatsächliche spieltypische UI: 320/375px Handy, 200% Zoom, Tablet, Querformat, größere Schrift, dunkle Ansicht, kontraststarke Beschriftung, Fokus/Tastatur, reduzierte Bewegung und Fortschritt/Abschluss.
- Priorität: verständliche Regeln, verständliche Buttons, gut lesbare Ergebnisse, einheitlicher Aufbau, **private Übergabe ohne ungewollte Geheimnis-Enthüllung**, passende lokale Motive. Kein beliebiger Austausch der vorhandenen Bildwelt.
- Nutze `docs/BILDWELT_V2.md`, `docs/BILDWELT_FREIGABEN.md`, `assets/manifests/asset-provenance.json`; Assets/Rechte, Copyright, Alt-Texte, Offlinegröße/Performance und Provenienz prüfen. Bildauswahl vom Produktinhaber freigeben lassen.
- **Keinerlei Änderungen an Engine-, Session-, Score-, Storage-, Timer-, Routing- oder Security-Verträgen.** Technische Fehler als Kommentar in #41 melden. Arbeite in eigenen Design-Branches und kleinen PRs, nicht gleichzeitig mit Claude an denselben Dateien.
- Visuelle Vorher-/Nachher-Belege, Tests und verbliebene Einschränkungen je PR verlinken.

**Lieferobjekt:** konsistent bedienbare Bildwelt und responsives UX für **55/55 Spiele**, keine unbemerkte Funktionsregression, konkrete visuelle Freigabe durch den Nutzer.

### Produktinhaber = echte Abnahme und Betriebsentscheidung

[Issue #43](https://github.com/memetreza34-ux/Secret-Circle/issues/43), zusätzlich [#8](https://github.com/memetreza34-ux/Secret-Circle/issues/8) und [#14](https://github.com/memetreza34-ux/Secret-Circle/issues/14): 55 reale Partyrunden in einer Gruppe protokollieren, iPhone Safari/Home-Screen-PWA + Android Chrome/installierte PWA, altes Cache-Update/Offline/Resume, Bewertung der Bildwelt, Hosting/HTTPS, Kontakt-, Betreiber-, Datenschutz-, Rechte- und Supportfreigaben. Geheime persönliche Daten niemals in öffentlichen Issues veröffentlichen. Branch Protection ist seit 16.10.2026 aktiv.

### ChatGPT = Code-Review-/Release-Gate (Arbeit aus diesem Chat beendet)

Der technische 55er-Einstiegs-Sweep #40 ist gemergt. Als künftiger Reviewer nur bei neuen, **tatsächlich vorliegenden** PRs erneut tätig werden. Ein GitHub-Issue startet Claude oder Codex **nicht** automatisch und darf nicht als schon geleistete Arbeit dargestellt werden.

## 4. Reihenfolge für die nächsten Tage

1. **Claude zuerst:** mit #41 echte vollständige 55er-Spielrunden testen und die wichtigsten Bugs in kleinen PRs beheben. Falls Codex parallel startet: zunächst nur Designsichtung/Konzept, **keine überlappenden UI/Engine-Dateien ändern**.
2. **Codex danach/parallel in eigenen Assets:** mit #42 Bildwelt und UX aller 55 auf stabilem neuestem `main` fertigstellen; keine Wiederholung des Engine-Audits.
3. **Nutzer:** mit #43 echte Partyrunden und Smartphones testen, Bilder auswählen, Betreiber-/Hostingdaten privat prüfen.
4. **Schlussabnahme:** alle PRs integrieren, finalen `main`-SHA fixieren, 55/55 vollständige Funktions- und visuelle Matrix, CI, echte iOS/Android-Offlinetests, Hosting-Rechte und Rollback prüfen, `release-evidence.json`/`operator-release.json` mit **tatsächlichen** Nachweisen befüllen. Erst dann öffentliches `GO`.

## 5. Sofort verwendbare Starttexte

**An Claude Code:**

> Arbeite im Repository `memetreza34-ux/Secret-Circle`. Lies zuerst `docs/UEBERGABE_55_SPIELE_2026-10-16.md`, `AGENTS.md` und GitHub-Issue #41. Alle 55 Spiele gehören zu Version 1. Übernimm ab dem neuesten `main` die vollständigen Spielablauf- und Ergebnistests und behebe echte Fehler in kleinen PRs, mit Regressionstests und grüner CI. Berühre nicht Codex' Bildwelt-Dateien, veröffentliche nichts ungeprüft. Starte mit der tatsächlichen 55er Testmatrix und der risikoreichsten Engine-Familie.

**An Codex:**

> Arbeite im Repository `memetreza34-ux/Secret-Circle`. Lies zuerst `docs/UEBERGABE_55_SPIELE_2026-10-16.md`, `AGENTS.md` und GitHub-Issue #42. Alle 55 Spiele bleiben. Übernimm Design, lokale Bilder, Lesbarkeit, responsives UI und visuelle Spielabläufe auf dem neuesten `main`, mit kleinen getrennten PRs und visuellen Belegen. Ändere nicht Spiellogik, Sessions, Scores, Timer oder Routing; stimme Schnittstellen mit Claudes technischen PRs ab. Den alten nicht-mergebaren PR #30 nicht blind übernehmen.

## 6. Quellen der Wahrheit

**Immer neu prüfen statt Zahlen aus diesem Dokument blind als aktuell anzunehmen:** Live-`main`, CI-Actions, `AGENTS.md`, `docs/PROJEKT_KOMPASS.md`, `RELEASE_CHECKLIST.md`, `release-evidence.json`, `operator-release.json`, [technischer Release-Backlog #24](https://github.com/memetreza34-ux/Secret-Circle/issues/24) sowie #41/#42/#43. **Release bis belegter Abschluss: NO_GO.**
