# Secret Circle – PR-/CI-Konsolidierungsprüfung (15.10.2026)

**Status:** Nur lesende Bestandsanalyse plus dieses Dokument. **Keine Merges, keine Branch-Löschungen, keine App-Codeänderungen, kein Release-GO.**

## 0. Nachweis-Basis und Grenzen

- Repository: https://github.com/memetreza34-ux/Secret-Circle
- Hauptbranch `main`: `a0f929cb6615a24471457a43abcbf4dca809d3c3` (Commit vom 14.10.2026). Dieser SHA wurde vor dem Anlegen dieses Audit-Branches live erneut gelesen.
- GitHub-Vergleichsbasis je PR: `main...<PR-Head>` über GitHub Compare API. `ahead_by=0` bedeutet **keine gegenüber main neuen Commits**, nicht automatisch, dass der PR geschlossen oder alle historischen Ziele formal erledigt wurden.
- Positiver Hauptbranch-CI-Nachweis: [Run 38540030575](https://github.com/memetreza34-ux/Secret-Circle/actions/runs/38540030575) vom 14.10.2026, `validate` und `e2e-webkit` beide erfolgreich; tatsächlich ausgeführte Schritte `npm ci`, `npm run check`, `npm test`, `npm run validate`, Playwright-Chromium- und Playwright-WebKit-Tests.
- **Keine** Tests lokal in dieser Audit-Sitzung ausgeführt. GitHub-Runner-Belege sind keine echten Android-/iPhone-/iPad-PWA- oder Gruppentests.
- `main`-Branch-Antwort meldet `protected: false`; Ruleset-Liste war leer. Direkter Protection-Detailabruf wurde vom Connector mit HTTP 403 abgelehnt. Daher Branchschutz **nicht als aktiviert** betrachten, aber Detailkonfiguration ist nicht vollständig einsehbar.
- CI wird für den **jeweiligen konkreten PR-Head-SHA** bewertet. Grün auf `main` ist kein pauschales Grün für abweichende Heads; grüne PR-Checks ergeben noch keinen unveränderten Release-Kandidaten.

## 1. Offene Pull Requests: technische Wahrheit

| PR | Branchbasis → Head | GitHub-Vergleich gegen main | Letzte bekannte CI-/Reviewlage | Sicherer Umgang |
| --- | --- | --- | --- | --- |
| [#11](https://github.com/memetreza34-ux/Secret-Circle/pull/11) | `codex/improve-gameplay-v3` → `codex/party-hub-foundation` | **behind**, 0 ahead / 1445 behind | historischer gestapelter Draft | **Nicht mergen.** Zweck/Referenzen archivieren und Schließen nach Abschlussprüfung vorschlagen. |
| [#13](https://github.com/memetreza34-ux/Secret-Circle/pull/13) | `codex/party-hub-foundation` → `agent/release-foundation-2027` | **diverged**, 7 ahead / 114 behind; gegen `main` sieben Dateipfade mit Delta | alter großer Release-Draft; nicht releasebereit | **Nicht mergen.** Sieben Delta-Pfade einzeln auf gültige fehlende Sicherheits-/Content-Verträge prüfen; nur bewiesene und notwendige Teile als neue kleine PRs übernehmen. |
| [#15](https://github.com/memetreza34-ux/Secret-Circle/pull/15) | `agent/release-foundation-2027` → `integration/v64-main-sync` | **behind**, 0 ahead / 101 behind | historischer 9-Dateien-Reconciliation-Draft | Nicht mergen; nach dokumentierter Historien-/Referenzprüfung als obsolet schließen erwägen. |
| [#17](https://github.com/memetreza34-ux/Secret-Circle/pull/17) | `fix/audit-befunde` → `design/v2-app` | **behind**, 0 ahead / 38 behind | ursprünglicher v2-Design-PR | **Kein neuer Delta-Code** zu `main`; auf historischen Zweck prüfen, anschließend schließen erwägen. |
| [#27](https://github.com/memetreza34-ux/Secret-Circle/pull/27) | `design/v2-gesamt` → `feature/canonical-party-hub-entry` | **diverged**, 11 ahead / 11 behind, 61 abweichende Pfade | **CI fehlgeschlagen** [Run 38147892411](https://github.com/memetreza34-ux/Secret-Circle/actions/runs/38147892411): beide Browserjobs rot | **P0, nicht mergen.** Fachliche Absicht auf aktuellem `main` in neuem Branch mit eigenen kompatiblen Tests umsetzen. |
| [#28](https://github.com/memetreza34-ux/Secret-Circle/pull/28) | `design/v2-gesamt` → `ux/spielansicht-und-spielerliste` | **behind**, 0 ahead / 2 behind | Head `7446763` hatte erfolgreiches CI; später durch nachfolgenden `main` überholt | **Kein neuer Delta-Code** zu `main`; historischen PR ohne Merge nach Prüfung schließen erwägen. |
| [#30](https://github.com/memetreza34-ux/Secret-Circle/pull/30) | `main` → `docs/bildwelt-alle-prompts` | **ahead**, 2 ahead / 0 behind, **38** Pfade | [Run 38618826945](https://github.com/memetreza34-ux/Secret-Circle/actions/runs/38618826945) **grün** für `5383e24bd92773b343121ee64cc6b19ca06513ae` | Erst PR-Beschreibung und tatsächlichen Umfang abgleichen, Bildfreigaben prüfen, dann reviewen/entscheiden. |
| [#31](https://github.com/memetreza34-ux/Secret-Circle/pull/31) | `main` → `ops/solo-founder-ai-workflow-2026-10-14` | **ahead**, 2 ahead / 0 behind, nur **2 neue Markdown-Dateien** | [Run 38619720303](https://github.com/memetreza34-ux/Secret-Circle/actions/runs/38619720303) **grün** für `590f5bc5205497524c1cb07198461e8f30e8eefc` | Fachliche Prüfung, dann unabhängig integrierbar; Draft nicht ohne Freigabe mergen. |

### #13 – die sieben gegenüber main anders lautenden Dateien

`EXTENDED_LABS_CONTENT_REVIEW.md`, `FAN_CONTENT_REVIEW.md`, `package.json`, `scripts/extended_labs_content_audit.py`, `scripts/privacy_content_audit.py`, `scripts/release_audit.py`, `tests/extended-labs-content-quality.test.js`.

Diese Pfade **nicht** als fehlende Funktionen deklarieren, solange die einzelnen Diffs und aktuellen Tests nicht überprüft wurden. Historische Release-Branches enthalten alte Vertrags-/Cachestände.

### #27 – konkrete Ursache des roten Integrationsgates

Die Route-Migration im Branch macht `index.html` zum Hub, ergänzt `word-imposter.html` und setzt das Manifest-`start_url` auf `./`. Dazu ändert sie `sw.js`, Katalog-/Navigationseinträge und zahlreiche Tests. Das ist ein relevantes fachliches Konzept, **aber kein kleinskaliger sicherer Cherry-Pick**.

Im Run `38147892411` vom 11.10.2026 sind die Jobs `validate` (Chromium) **und** `e2e-webkit` (WebKit) gescheitert. Jeweils sechs Tests wurden als fehlgeschlagen zusammengefasst. Die Logs zeigen u. a.:

- Timeout bei `#quick-start` in einem Alles-Spiele-Smoke-Test.
- Erwartung `/index.html` beim Word-Imposter-Flow passt nicht zum neuen Routing.
- Timeout bei `#start-selected-game` nach Back/Forward-Navigation.
- Auf WebKit-Mobile zusätzlich einen Timeout bei `#player-add`.

**Ursache pro Einzelfall noch nicht abschließend analysiert.** Alte Testannahmen und tatsächliche Interaktionsprobleme müssen getrennt beurteilt werden. Einen Test nicht einfach löschen oder abschwächen, weil eine neue URL beabsichtigt ist.

### Aktueller `main`-Befund zum Routing – unabhängig von der Dokumentation

- `index.html` enthält tatsächlich die Word-Imposter-Spieloberfläche.
- `v2-hub.html` enthält den Party-Hub.
- `manifest.webmanifest`: `"start_url": "./v2-hub.html"`.

Damit ist der kanonische Einstieg uneinheitlich: Browser-Root (bei statischer Auslieferung `index.html`) und PWA-Manifest nennen verschiedene Einstiege. Das ist eine **tatsächlich belegte** P0-Inkonsistenz; nicht nur eine veraltete Statusbehauptung.

### #30 – kein reiner Dokumentations-PR

Die vorhandene Beschreibung behauptet „Nur Dokumente, kein Code“. Der **tatsächliche PR-Diff** umfasst aber `v2-hub.js`, `v2-theme.css`, `sw.js`, vier WebP-Bildpfade, `assets/manifests/asset-provenance.json`, Medien-/Performance-Audits und Playwright-E2E-Testdateien zusätzlich zu vielen Dokumenten.

Weitere Risiken bei der finalen Abnahme:
- Service-Worker-Cachegeneration im PR von `v93` auf `v96`: Offline-Core-Lock, Updatepfad und tatsächliche Asset-Hash-/Performance-Verträge für exakt diesen Head prüfen.
- `docs/BILDWELT_FREIGABEN.md` führt nur die neue Word-Imposter-Serie explizit als freigegeben auf und bezeichnet Wahrheit oder Pflicht weiterhin als ausstehend; `docs/CODEX_AUFTRAG_BILDER.md` erwähnt zugleich eine ausgewählte und eingebaute Wahrheit-oder-Pflicht-Neufassung. **Das ist ein Dokumentationswiderspruch**, kein Beweis für fehlende Nutzerfreigabe. Visuelle Freigabe und tatsächlich geladene Assets vor Merge abgleichen.
- Grün auf dem PR-Head ist ein echter automatisierter CI-Nachweis, aber **noch keine** finale visuelle Abnahme oder Nachweis auf dem späteren eingefrorenen Release-Kandidaten.
- **Empfehlung:** Scope/PR-Beschreibung korrigieren; nur ausdrücklich abgenommene Bilder integrieren; bei Änderungen des PR-Heads erneut CI prüfen. Nichts an laufenden Bildaufträgen parallel überschreiben.

### #31 – klare technische Abgrenzung

Enthält ausschließlich `CLAUDE.md` und `docs/AI_TEAM_WORKFLOW.md`. Nach dokumentierter Abnahme ist der PR unabhängig von #30 integrierbar. Er startet keine Claude-/Codex-Prozesse selbst und verändert weder Spielcode noch Release-Gates.

## 2. Empfehlung für die konkrete Reihenfolge

**Schritt A: Review- und Dokumentationsklarheit – jetzt**

1. Diesen Bericht prüfen und den Unterschied „kein neuer Delta-Code“ vs. „historischer PR wirklich abgeschlossen“ respektieren.
2. Für #30 die tatsächliche Liste von 38 Dateien samt geänderter SW-/Bild-/Test-Dateien in PR-Beschreibung/Abnahme festhalten; ausstehende Bildfreigaben mit Arman klären, bevor neue Bilder freigegeben werden. **Kein automatischer Merge**.
3. #31 unabhängig reviewen und nur nach Freigabe integrieren.
4. #11, #15, #17 und #28 erst nach kurzem Abgleich von Zweck, nachfolgenden Merges und offenen Referenzen als „überholt“ schließen; **nicht durch Merge schließen**. #13 separat auf die sieben tatsächlich anders lautenden Dateien reduzieren.

**Schritt B: erstes technisches Claude-Code-Ticket – P0-Routing**

`main` neu lesen und separaten Branch erstellen. Die beabsichtigte Route-Migration aus #27 nur als fachliche Referenz verwenden; technische Änderungen zielgerichtet neu implementieren und alle aktuellen Tests anpassen, ohne bestehende Sicherheits-/Spielverträge abzuschwächen:

- Root `/` und `/index.html` öffnen denselben Party-Hub; PWA-Manifest-Start ist konsistent.
- Word Imposter hat eine stabile eigene URL; direkte Links und bestehende Weiterleitungen funktionieren.
- Game-Katalog, Spielerübergabe, Speicherung, aktive Sessions, Backups, Resume und Zurück-Navigation unverändert korrekt.
- Service-Worker-Offline-Core enthält alle nötigen HTML-/CSS-/JS-/Bilddateien, korrektes Cache-Bump/Lock, `CHANGELOG.md`.
- Online-/Offline-Starts, installierte PWA und Upgrade/Rollback inkl. *Altversion* testen.
- Unit-/Vertragstests und Browser-E2E für Chromium und WebKit auf dem **neuen** PR-Head grün. Zusätzlich Firefox via separatem Workflow; reale Android-/iOS-Geräte weiterhin separat offen.
- Ein fehlender Test-Selbstnachweis wird als OPEN dokumentiert, niemals behauptet.

**Schritt C: nach Routing-Fix**

1. Alle 15 Core-Spiele – vollständige Runden und gemeinsame Engines inkl. Privacy/Timer/Scoring/History/Cold Resume automatisiert und real abnehmen.
2. Echte Android-, iPhone-/Safari-PWA- und Tablet-Sessions; 4–8-Personen-Gruppen; 320px/Zoom/Tastatur/Screenreader.
3. Staging auf echtem HTTPS, Installation/Offline-Update/Cache-Rollback, Support-/Legal-/Betreiberbelege, Branch Protection/Required Checks.
4. Finaler freigegebener Bildwelt-/UI-Pass über getrennte Codex-Asset-PRs, auf unverändertem RC sämtliche betroffenen Gates erneut prüfen.
5. `release-evidence.json` bleibt `NO_GO` bis belastbare Nachweise am exakt selben Release-Commit vorliegen.

## 3. Abnahme des Audits

- [x] Alle acht offenen PRs identifiziert und gegen aktuellen Hauptbranch verglichen.
- [x] CI-Status der maßgeblichen Heads #27, #30, #31 und des Hauptbranches überprüft.
- [x] Root-/Manifest-Inkonsistenz direkt im `main`-Code nachvollzogen.
- [x] Betroffene technische Dateien und Risiken von #27/#30 anhand tatsächlicher Diffs geprüft.
- [x] Branch-Protection-Metadaten und vorhandene Cross-Browser-Workflow-Datei geprüft.
- [ ] Alle historischen PR-Zwecke/Reviews vollständig manuell signiert und PRs geschlossen.
- [ ] #30 Bildabnahmen final durch Produktinhaber bestätigt.
- [ ] P0-Routing in einem neuen technischen Branch repariert und neue CI grün.
- [ ] Ein unveränderter Release-Kandidat samt echten Geräten/Gruppen/Hosting/Legal als GO freigegeben.

**Nächster Owner:** Claude Code (neuer P0-Routing-PR nach Review), ChatGPT (technisches Review/Abnahmekriterien), Codex (nur freigegebene Bildwelt), Produktinhaber (Freigaben, Geräte, Launch). 

**Kein Merge und keine Veröffentlichung aufgrund dieses Berichts.**
