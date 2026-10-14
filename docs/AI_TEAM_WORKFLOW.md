# Secret Circle – KI-Team-Workflow für den Solo-Gründer

Stand: 14. Oktober 2026 · **Arbeitsvereinbarung, keine Release-Freigabe** · Öffentlicher Release: **NO_GO**.

Dieses Dokument ergänzt `AGENTS.md`, Issue [#24](https://github.com/memetreza34-ux/Secret-Circle/issues/24) und die bisherigen Release-Gates. Es ändert weder den Umfang der Januar-2027-PWA noch laufende Arbeiten. Bei Konflikten zu Produkt-/Sicherheitsverträgen gelten die strengeren vorhandenen Regeln; Widersprüche sind vor einer Änderung sichtbar zu klären.

## 1. Klare Zuständigkeiten

| Rolle | Verantwortlich für | Ohne ausdrücklichen neuen Auftrag nicht |
| --- | --- | --- |
| **Arman (Produktinhaber)** | Produktziele, finale Design-/Bildauswahl, Testpersonen, Accounts/Hosting/Betreiberangaben, Zahlungsentscheidungen, Release-GO | blind Tests oder Rechtefreigaben bestätigen |
| **ChatGPT (Projektleitung/Reviewer)** | Repository-Audits, Priorisierung, Requirements, risikoarme GitHub-Issues und PRs, technische Reviews, Wettbewerbs-/Geschäftsprüfung, Statusberichte | tatsächliche Testläufe, Deployment oder Modellaufrufe als durchgeführt behaupten, wenn Beweise fehlen |
| **Claude Code (technischer Owner)** | Spiellogik, Routing, PWA/Offline, Speicherung, Sicherheit, Accessibility, Fehlerbehebung, Refactoring bei Bedarf, automatisierte Tests, Release-Technik und technische UI-Implementierung | neue Spiele / Scope ohne Freigabe hinzufügen; Bildproduktion übernehmen |
| **Codex (Bildwelt-/Asset-Aufträge)** | Bildideen, konsistente Motiv-Prompts, Bildvarianten, Sichtprüfung, Aufbereitung lokaler Assets und bildbezogene Integration nur im ausdrücklich freigegebenen Umfang | Engines, Scoring, Sessions, Timer, Storage, Routing oder Security verändern |

**Werkzeuggrenze:** Codex ist nicht automatisch ein eigenständiger Bildgenerator. Für das tatsächliche Erzeugen von Bildern nur ein verfügbares, geeignetes Bildwerkzeug einsetzen; Codex darf die Bildproduktion steuern, Prompts/Dateien prüfen und die genehmigten Assets einbinden. Die Bildabnahme bleibt bei Arman. Kein Tool darf ohne überprüfbares Ergebnis als erfolgreich ausgegeben werden.

**Modellwahl:** Nach Möglichkeit das leistungsfähigste zum jeweiligen Auftrag passende Modell verwenden, das im Nutzerkonto verfügbar ist. Keine bestimmte Modellversionsnummer festschreiben; bei Kosten, Limitierungen und Datenschutz bewusst abwägen.

**Grenzen der Zusammenarbeit:** GitHub-Dokumente sind eine Übergabe zwischen getrennten Arbeits-Sessions. ChatGPT kann Claude Code oder Codex nicht allein dadurch im Hintergrund starten. Jede Rolle arbeitet auf einem eigenen Branch und gibt überprüfbare Ergebnisse zurück.

## 2. Arbeitsprinzip und Branch-Regeln

1. **Eine priorisierte Aufgabe pro Arbeitszweig.** Nie direkt auf `main` arbeiten; für jedes Arbeitspaket einen separaten Branch und Pull Request.
2. **Erst Ist-Zustand lesen:** aktueller `main`-SHA, `AGENTS.md`, #24, offene PRs, relevante Design-/Test-/Release-Dokumente. Nicht von alten Dokumentständen auf den tatsächlichen Code schließen.
3. **Plan vor Code:** Nutzerpfad, Ausgangssituation, Akzeptanzkriterien, Grenzfälle, betroffene Dateien, Regressionen und Rückrollweg definieren.
4. **Kleine Änderungen:** möglichst keine fachfremden Dateien und keine unkontrollierten Merges mehrerer historischer Branches. Bestehende Storage-Keys, Element-IDs, Geheimhaltung, Timer, exact-once-History und Backups schützen.
5. **Prüfbelege pro PR:** Befehl, Umgebung, SHA, Ergebnis und Limitierungen angeben. `npm run check`, `npm test`, `npm run validate` und bei funktionalen Änderungen `npm run test:e2e`; für Release zusätzlich Firefox/Cross-Browser, echte Geräte und Offline-Update.
6. **Keine Erfolgssimulation:** grüne CI auf einem anderen Commit, Quellcode, Screenshots oder ein Entwurf sind kein Nachweis des finalen Verhaltens. Ein Release bleibt NO_GO bis sämtliche Pflicht-Gates mit Beleg erfüllt sind.
7. **Review und Freigabe:** ChatGPT/Arman prüfen Scope und Evidence; Claude behebt technische Review-Funde; Codex wird für freigegebene Bilder separat beauftragt.

## 3. Tatsächlicher Startstand / keine blinden Merges

- `main` bei Aufnahme: `a0f929cb6615a24471457a43abcbf4dca809d3c3` (14.10.2026). Für neue Arbeiten erneut live prüfen.
- Dokumentierter Produktumfang: **55 Built-ins, davon 15 Core, 13 Extended, 27 Labs**. Nicht alle 55 als voll manuell abgenommen bezeichnen.
- Root `/` bzw. `index.html` vs. Manifest-Start `v2-hub.html` ist als Routing-Risiko bekannt; eigene Migrations- und Regressionstests nötig.
- Offener **PR #30** heißt „Docs: Bildwelt ...“, umfasst im GitHub-Diff jedoch auch `v2-hub.js`, `v2-theme.css`, `sw.js`, Medien-Assets, Audits und E2E-Tests. Deshalb ausdrücklich **kein Docs-only-Review**. Bei Aufnahme laufen neuere CI-Jobs auf dem PR-Head; deren Ergebnis muss erneut geprüft werden.
- Andere offene historische/gestapelte PRs (u. a. #27, #28, #17, #15, #13, #11) nicht ungeprüft gegen `main` mergen. Basen, Änderungen, Konflikte und CI vor Entscheidungen vergleichen.
- Die bestehenden Issues [#24](https://github.com/memetreza34-ux/Secret-Circle/issues/24), [#8](https://github.com/memetreza34-ux/Secret-Circle/issues/8) und [#14](https://github.com/memetreza34-ux/Secret-Circle/issues/14) bleiben technische, reale Test- und Betreiber-Gates.

## 4. Nächster Auftrag für Claude Code – technische Reihenfolge

**P0-A: PR- und CI-Konsolidierung**
- Neueste offene PRs gegen aktuellen `main` prüfen; bei #30 tatsächliche Änderungen nach Bildern, Code, Cache, Tests und Release-Evidence aufteilen und die Beschreibung korrigieren.
- Bei #30 und allen späteren Merges den **tatsächlich geprüften** SHA plus grüne CI festhalten; fehlende oder laufende Jobs nicht als PASS werten.
- Alte Branch- und Issue-Texte mit gelöster oder überholter Lage nur auf Basis aktueller SHA-/Test-Belege bereinigen. Niemals einen fremden Branch blind mergen.

**P0-B: Kanonischer PWA-Einstieg**
- Separaten technischen PR mit konkretem URL-/Routing-Vertrag für Party Hub und Word Imposter entwickeln.
- Direktlinks, installierte PWA, Offline, Browser-Zurück, bestehende Session, Resume, Backups und Service Worker regressionssicher halten.
- Nach jeder Änderung an Offline-Core `scripts/offline_core_lock.py --bump`, `CHANGELOG.md` und Cache-Audits berücksichtigen.

**P0-C: Release-Testmatrix vorbereiten**
- Automatisierte Core-Tests und separate Chromium/WebKit/Firefox-Abdeckung auf dem gewünschten RC-SHA nachweisen.
- Einen klaren manuellen Testbogen pro 15-Core-Spiel für tatsächliche 4–8-Personen-Tests bereitstellen: Spielerwechsel, Geheimhaltung, Timer, Reload, Resume, Ergebnisse, freiwilliger Skip und Abschluss.
- Reale Android/iPhone/iPad-PWA-Tests bleiben OPEN, bis Arman oder echte Testpersonen Ergebnisse liefern.

**P0-D: Betriebsfreigabe vorbereiten**
- Staging-/Hosting- und HTTPS-/PWA-/Rollback-Checkliste konsolidieren; technische Testvorbereitungen machen.
- Betreiberangaben, Privacy/Legal, Support und Assetrechte ohne reale Nachweise nicht als abgeschlossen markieren.

**Abnahme dieses Technik-Auftrags:** PR-Review-Bericht und kleine, einzeln prüfbare Claude-Arbeitspakete mit Risiken, exakten Tests und belegtem Ergebnis; keine neuen Features und kein willkürlicher Redesign- oder Billing-Umbau.

## 5. Codex-Pipeline – Bilder, nicht Produktlogik

1. Nach den Vorgaben in `docs/BILDWELT_V2.md` und `docs/CODEX_AUFTRAG_BILDER.md` arbeiten; bei #30 erst den endgültig geprüften/übernommenen Stand verwenden.
2. Je priorisiertem Core-Spiel geeignete Bildvarianten erstellen lassen, Stil-/Anatomie-/Rechtefehler kontrollieren und **Arman zur Auswahl** präsentieren; nicht automatisch 55 Motive für den Release freigeben.
3. Nur freigegebene Motive als eigene lokale, optimierte Assets einbinden (Richtwert 800×600 WebP, ungefähr höchstens 35 KB, sofern aktuelle Budgets dies vorgeben).
4. Provenienz/Werkzeug, Bildlizenzannahmen, `assets/manifests/asset-provenance.json`, `scripts/media_inventory_audit.py`, Performancebudget, `sw.js` und Offline-Lock konsistent halten.
5. Sichtprüfung auf Handy, Alt-Texte, reduzierte Bewegung und alle betroffenen Prüfungen; **keine** Änderungen an Engines, DOM-Verträgen, Persistenz oder Geheimhaltung.
6. Separate Asset-PRs mit Bildliste, Vorher/Nachher, Abnahme und Prüfergebnissen; kein Mergen ohne technische und visuelle Freigabe.

## 6. Monetarisierung ohne Release-Sabotage

Das bestehende Januar-2027-Ziel ist eine **deutsche, kostenlose, offline-first PWA** ohne Login-/Cloud-/Store-Pflicht. Nicht stillschweigend ein Abo, Tracking, Paywall oder Online-Backend in V1 einbauen. Zunächst Nutzer-/Gruppentests, Nutzen, Wiederholungsrate und Zahlungsbereitschaft erheben. Für V1.1/Phase 2 separat entscheiden: kostenlose Core-Spiele, Premium-Packs oder Einmalkauf; vorher Zahlungsanbieter, Offline-Rechteprüfung, Support, Datenschutz und Gebühren sauber konzipieren.

**Erfolgskriterien für die erste Veröffentlichung:** reale Gruppen verstehen/spielen den Core zuverlässig; kontrolliertes Hosting/PWA-Upgrade funktioniert; technische + rechtliche + Asset-Gates belegt; Supportweg vorhanden; ehrliche Produktkommunikation. Erste Einnahmen sind ein Folgeexperiment, nicht der Beweis für technische Release-Reife.

## 7. Lernregel für Arman

Bei jedem abgeschlossenen technischen PR erklärt Claude in fünf kurzen Punkten:
- Was war das Nutzerproblem?
- Welche Dateien/Komponenten wurden geändert?
- Warum funktioniert der gewählte Lösungsweg?
- Wie wurde das Ergebnis nachgewiesen?
- Welche Grenzen/Risiken bleiben?

ChatGPT übersetzt kritische Konzepte (Routing, PWA, Local Storage, Secrets, CI, CI-SHA, DSGVO, Geschäftsmodell) bei Bedarf in verständliche Sprache und prüft die Claude-Ergebnisse.

## 8. Übergabeformat für jeden PR

**Ziel:** …  
**Owner:** Claude (Technik) / Codex (Bilder)  
**Ausgangs-SHA und Zielbranch:** …  
**Betroffene Dateien:** …  
**Akzeptanzkriterien:** …  
**Tests inkl. tatsächlichem Ergebnis:** …  
**Manuelle Prüfungen, offen:** …  
**Risiken und Rollback:** …  
**Freigabe:** Review offen / technisch geprüft / visuell genehmigt / Release-GO (nur falls real belegt).

Keine dokumentierte Vorlage ersetzt das echte Freigabe- und Release-Verfahren.
