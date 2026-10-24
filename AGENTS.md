# Hinweise für Coding-Agenten (Codex, Claude Code)

**Verbindlicher Projektkompass für alle Agenten:** Vor jeder Aufgabe `docs/PROJEKT_KOMPASS.md` lesen. ChatGPT übernimmt die unabhängige Produkt-/Qualitätsberatung und priorisiert nach echten Releaseblockern; Claude Code die technische Umsetzung, Codex den freigegebenen Design-/Asset-Pass. Alle arbeiten nach derselben belegbaren Definition of Done, unabhängig davon, wer die Aufgabe ausführt. Im Konflikt gelten die strengeren vorhandenen Sicherheits-, Daten-, Spiel- und Releaseverträge.

**Best-fit-Aufgabenverteilung:** Vor jeder Aufgabe prüfen, welcher der verfügbaren Agenten (ChatGPT, Claude Code, Codex) sie mit aktuellen Tools am besten erledigt. Rollen sind Empfehlungen, keine starren Silos. Bei besserer Eignung des anderen eine vollständige, belegbare Übergabe im GitHub-Issue/PR vorbereiten und erst nach tatsächlicher Übernahme den Owner wechseln. Je Teilaufgabe genau ein aktiver Owner und ein Reviewer, keine konkurrierenden Dateiedits. **Wenn der Nutzer ausdrücklich „Mach du“ sagt, die Aufgabe selbst ausführen**, soweit technisch möglich und zulässig, statt sie erneut abzuschieben. Ein GitHub-Handoff startet externe Agenten nicht automatisch. Details in docs/PROJEKT_KOMPASS.md.

**Umsetzungsvorrang:** Genug Grundsatzplanung; ab jetzt pro Arbeitsabschnitt möglichst ein konkreter getesteter Fix, nutzbarer technischer PR oder echter Release-Testnachweis. Keine neuen Roadmaps, neuen Spielmodi oder Prozessdokumente ohne belegten Bedarf. Das P0-Backlog der Reihe nach bearbeiten, kein `fertig` ohne verifizierbares Resultat. Nach abgeschlossenem PR direkt nächsten Release-Engpass wählen. Siehe `docs/PROJEKT_KOMPASS.md` Abschnitt „Umsetzen statt endlos planen“.

**MCP-/Tool-first-Arbeitsregel:** Vor jeder Aufgabe alle im jeweiligen Kontext **tatsächlich verfügbaren und autorisierten** MCP-Server, Skills, Plugins, Browser-/Webquellen und Testwerkzeuge auf Eignung prüfen; relevante Werkzeuge gezielt kombinieren. Anleitung/Schema und aktuelle offizielle Dokumentation vor Nutzung lesen, Wissenslücken durch seriöse Recherche schließen, Resultate praktisch testen. Keine pauschale Datenfreigabe, keine erfundenen Toolzugriffe oder ungefragte externe Aktionen. Details: `docs/PROJEKT_KOMPASS.md` Abschnitt „Verbindliche MCP-/Tool-first-Regel“.

Secret Circle ist eine offline-first PWA mit Partyspielen für eine Gruppe und ein Gerät. Vanilla JavaScript, HTML und CSS, kein Build-Schritt, keine Runtime-Abhängigkeiten. Oberfläche und Texte sind deutsch; Commit-Nachrichten ebenfalls.

## Stand der Oberfläche

- **Startseite:** `/` und `index.html` (identisch zu `v2-hub.html` als Legacy-Alias) mit `v2-hub.js` und `v2-theme.css` – das Design aus Claude Design. Sie zeigt Katalog, Spieldetail, Spielerliste und Profil und spielt selbst nichts.
- **Spielabläufe (Engines, im v2-Design):** `party.html` (Hub-Spiele, gestartet über `party.html?play=<id>&pack=<name>&from=v2`), `quick-play.html`, `advanced.html`, `word-imposter.html` (Word Imposter), `creator.html`, `privacy.html`.
- **Daten:** Spielerliste und Verlauf liegen in `secret-circle-party-hub-v1`. v2 führt keinen eigenen Speicher. Alle Speicher-Keys und Backups regelt `backup-schema-registry.js`.
- Details: `ARCHITECTURE.md` Abschnitt 4a.

## Stand und nächste Schritte

**Stand 16. Oktober 2026:** Version 1 umfasst **alle 55 Spiele** (15 Core / 13 Extended / 27 Labs); die Stufen sind Reifegrade, keine Freigabeausnahmen. Verbindliche Übergabe: `docs/UEBERGABE_55_SPIELE_2026-10-16.md`. Aufträge: [#41](https://github.com/memetreza34-ux/Secret-Circle/issues/41) Claude Code (Spielabläufe bis Ergebnis/Replay), [#42](https://github.com/memetreza34-ux/Secret-Circle/issues/42) Codex (Design/Bilder), [#43](https://github.com/memetreza34-ux/Secret-Circle/issues/43) Arman (Gruppen-/Gerätetests, Betrieb/Recht). `main` ist geschützt: Änderungen nur per PR mit grünen Pflicht-Checks `validate`, `e2e-webkit` und `smoke`, Branch auf aktuellem Stand, kein Force-Push, gilt auch für Admins.

**Die Umstellung auf das v2-Design ist abgeschlossen (5.–6. Oktober 2026).** Jede Seite trägt nur noch v2-Stile; die alten Stildateien sind gelöscht. Wer ab jetzt weiterarbeitet (Codex, ChatGPT, Claude Code oder andere), prüft den neuesten `main`-SHA und startet von dort in einem eigenen Branch/PR. Alte Design- und Release-PRs werden gegen aktuelles `main` geprüft und nie blind übernommen (siehe `docs/PROJEKT_KOMPASS.md`, Issue #24 und #33). Plan und Stand stehen in `docs/V2_DESIGN_UMSTELLUNG.md`. Die Oberfläche von `party.html` (Partyabend, Daten und Sicherung, eigene Kategorien, Favoriten, Verlauf und Erfolge) steht in `v2-party-hub.css`, der Update-Hinweis in `v2-update.css`. Die Startseite zeigt „Zuletzt gespielt“ als Reihe; das Profil hat „Weiterspielen“ und die Liste mit Namen. Der Verlauf speichert die Namen der Runde (`players`).

**Aktuelle Bildvorschau:** Arman hat am 14. Oktober 2026 den direkten Einbau einiger Motive zur Beurteilung in der App beauftragt; das ersetzt dafür den früheren Auftrag „nur erzeugen und zeigen“ in `docs/CODEX_AUFTRAG_BILDER.md`. Word Imposter, Wahrheit oder Pflicht, Mafia und Ich habe noch nie sind als lokale Spielbilder eingebunden. Arman hat am 14. Oktober 2026 einen Neustart der Bildwelt beauftragt und anschließend die drei gezeichneten Richtungsproben zum Einbau ausgewählt: neues Word-Imposter-Bild sowie zwei Wahrheit-oder-Pflicht-Szenen. Standard ist die Besen-/Hutszene; die Masken-/Kissenszene ist im Detail auswählbar. Arman hat danach die runde 3D-Cartoonwelt gewählt und die Version mit korrigierten Augen konkret freigegeben. Das aktuelle Word-Imposter-Bild zeigt diesen Cartoonstil. Alle 55 Modi werden ab jetzt einzeln erzeugt und erst nach konkreter Freigabe eingebaut; Stand in `docs/BILDWELT_FREIGABEN.md`; andere Spiele behalten ihr Emblem. Herkunft und vollständige Prompts stehen in `assets/manifests/asset-provenance.json`. Eine endgültige Abnahme der gesamten Bildwelt steht weiter aus. Weitere Bilder und der finale visuelle Feinschliff folgen nach der technischen Core-/Release-Härtung (siehe Issue #24). Bestehende Spiellogik, Schutzfunktionen (Fortsetzen, Verdecken geheimer Inhalte, exact-once-Verlauf) und Element-IDs nicht umbauen, nur weil sich das Aussehen ändert – viele Tests hängen daran. Einige Tests lesen Stildateien direkt (`v2-party-hub.css`, `v2-party-play.css`, `v2-update.css` usw.); beim Umzug von Stilen diese Prüfungen mit derselben Zusage auf die neue Datei umstellen, nie abschwächen. Keine Funktion streichen.

## Bilder und andere Medien

- **Bildwelt und Prompts:** Das eingebaute Word-Imposter-Bild (`assets/images/imposter.webp`) ist nach Armans jüngster Auswahl die alleinige Stilvorlage für neue Bilder. `docs/BILDWELT_V2.md` beschreibt diesen Stil, Grenzen, Format (800 × 600 WebP, höchstens etwa 35 KB) und enthält für alle 55 Spiele einen Motiv-Prompt. Der Auftrag an Codex für alle Bilder steht in `docs/CODEX_AUFTRAG_BILDER.md`.
- **Nur lokale Dateien.** Die Content-Security-Policy erlaubt Bilder nur von der eigenen Herkunft oder als `data:`-URL. Keine externen URLs, keine CDNs.
- **Medienvertrag anpassen.** `scripts/media_inventory_audit.py` definiert in `EXPECTED_CURRENT_MEDIA` die vollständige erlaubte Menge: App-Icons, eingebundene lokale WebP-Spielbilder und zugehörige Dokumentationsscreenshots. Bei neuen Bildern den Medienvertrag und `assets/manifests/asset-provenance.json` (Werkzeug/Modell, Datum, Rechtegrundlage) gemeinsam aktualisieren. Auch `scripts/performance_budget.py`, die Offline-`CORE`-Liste in `sw.js`, `THIRD_PARTY_NOTICES.md` und `ASSET_RIGHTS_SIGNOFF.md` prüfen und passend ergänzen. Bei KI-generierten Bildern das Werkzeug nennen.
- **Inhalt:** keine echten Personen, Marken, Logos oder erkennbaren Figuren aus Filmen, Serien, Anime oder Spielen (`CONTENT_AGE_POLICY.md`, `FAN_CONTENT_REVIEW.md`).
- **Format und Größe:** WebP oder AVIF, sparsam dimensioniert. Alles im Offline-Cache wird bei der Installation geladen; Grenzen stehen in `scripts/performance_budget.py`.
- **Barrierefreiheit:** Informative Bilder brauchen `alt`-Text, rein dekorative `alt=""` bzw. `aria-hidden="true"`.

## Technische Übergabe vor finalem Design und Release

- Die verbindliche technische Abschlussliste liegt in [Issue #24](https://github.com/memetreza34-ux/Secret-Circle/issues/24), die 55-Spiele-Abnahme in [Issue #41](https://github.com/memetreza34-ux/Secret-Circle/issues/41); vorhandene Release-Gates in `RELEASE_CHECKLIST.md`, `release-evidence.json` und `operator-release.json` bleiben maßgeblich.
- Erst technische P0/P1-Defekte, Branch-Konflikte, Routing-/Offline-/Storage-Gates und Tests abschließen. Danach mit Codex ausschließlich Bildwelt, Animation, Typografie und visuelles Finishing durchführen; IDs, Storage-Keys, Geheimhaltung, Timer, Scoring, Session-Abschluss und Core-Routing dürfen dadurch nicht unbemerkt geändert werden.
- Das P0-Routing ist seit PR #34/#35 in `main`: `/` und `index.html` sind der kanonische Party-Hub, `word-imposter.html` ist der eigene Spieleinstieg; `v2-hub.html` bleibt ein identischer Legacy-Alias. **Noch keine Releasefreigabe:** Browser-CI, Offline-Update und reale Geräte-/Sessionprüfungen müssen unabhängig nachgewiesen werden.
- Nach jeder finalen Design-/Asset-Änderung müssen betroffene CI-/Offline-/Accessibility-/Medien- und Rechte-Gates erneut auf dem unveränderten Release-Kandidaten laufen. Es gibt bis dahin **keine** öffentliche GO-Freigabe.

## Regeln, die Prüfungen erzwingen

- **Offline-Cache:** Jede Datei in der `CORE`-Liste von `sw.js` ist durch eine Prüfsumme gesperrt. Nach Änderungen an solchen Dateien (und nach dem Hinzufügen neuer Dateien zu `CORE`) `python3 scripts/offline_core_lock.py --bump` ausführen und einen Eintrag in `CHANGELOG.md` ergänzen. Sonst schlägt `npm run validate` fehl – und installierte Apps bekämen die Änderung nie.
- **Neue Dateien, die offline gebraucht werden** (Bilder, Skripte, Stile), gehören in die `CORE`-Liste von `sw.js`.
- **Sicherheit:** keine Inline-Skripte, keine `style`-Attribute in HTML (die CSP blockiert sie; Stile per Klasse oder per `element.style` aus JavaScript). Nutzer- oder Speicherdaten nie per `innerHTML` einsetzen, sondern per `textContent`.
- **Größe:** JavaScript-Dateien der App bleiben unter 1000 Zeilen und 100 KB (`scripts/architecture_audit.py`). Jede Stildatei hat ein Größenbudget in `scripts/performance_budget.py`; neue Stildateien brauchen dort einen Eintrag.

## Prüfen

```bash
npm run check        # Syntax
npm test             # Unit- und Vertragstests
npm run validate     # 36 Audits inkl. Offline-Sperre
npm run test:e2e     # Playwright: Chromium und WebKit, Desktop und Handy
```

Lokal ansehen: `python3 -m http.server 4174 --bind 127.0.0.1`, dann `http://127.0.0.1:4174/v2-hub.html`.

`npm run ci` führt alles nacheinander aus. Einzelne Browser-Tests können unter Last zeitlich wackeln (die CI wiederholt einmal); ein Fehler, der sich wiederholt, ist echt.

## Arbeitsweise

- Nicht direkt auf `main` arbeiten; Branch und Pull Request.
- Vor dem Commit alle vier Prüfungen laufen lassen.
- Statusdokumente (`README.md`, `RELEASE_STATUS.md` usw.) nur mit belegten Fakten ändern; nichts als bestanden markieren, was nicht wirklich gelaufen ist.
