# Umstellung auf das v2-Design

Plan vom 3. Oktober 2026. Die Umstellung ist am 5. Oktober 2026 abgeschlossen (durchgeführt von Claude Code, Quick Play und Party-Spielansicht von Codex). Wer weiterarbeitet, startet von `main` bzw. – bis Pull Request #21 gemergt ist – von `design/v2-gesamt`; es muss nur einer gleichzeitig am Design arbeiten.

## Stand (5. Oktober 2026)

| Schritt | Stand |
|---|---|
| 1. `quick-play.html` | erledigt (Codex, `v2-play.css`) |
| 2. Spielansicht von `party.html` | erledigt (Codex, `v2-party-play.css`) |
| 3. `advanced.html` | erledigt (`v2-advanced.css`) |
| 4. `index.html` und `privacy.html` | erledigt (`v2-imposter.css`) |
| 5. `creator.html` | erledigt (`v2-creator.css`) |
| 6. Planer, Daten, Kategorien, Favoriten, Statistik nach v2 | erledigt: Die Oberfläche von `party.html` trägt das v2-Design (`v2-party-hub.css`); IDs, Abläufe und Funktionen sind unverändert. Update-Hinweis in `v2-update.css`. |
| 7. Altes Design löschen | erledigt: `party.css`, `party-extra.css`, `party-night.css`, `party-guide.css`, `party-release.css`, `party-search.css` und `pwa-update.css` sind gelöscht, ihr Nachladen in `runtime-guard.js` und `party-hub-polish.js` entfernt. |

Die Tabellen unten beschreiben den Ausgangszustand vom 3. Oktober.

## Ziel

Am Ende gibt es nur noch ein Design: v2 (`v2-theme.css`, Schriften in `fonts/`). Alle Spiele, der Partyabend-Planer, Daten und Sicherung sowie eigene Kategorien laufen im v2-Design. Die alten Stildateien und die alte Hub-Oberfläche in `party.html` sind gelöscht. **Keine Funktion fällt weg.**

## Ausgangslage

`v2-hub.html` ist die Startseite und schon fertig im v2-Design. Gespielt wird auf den Engine-Seiten, die noch das alte Design tragen:

| Seite | Inhalt | Stile heute | Logik (nicht umbauen) |
|---|---|---|---|
| `party.html` | Hub-Spiele in `#play-layer`; dazu die alte Hub-Oberfläche (`#view-home`, `#view-games`, `#view-players`, `#view-favorites`, `#view-stats`, `#view-settings`, `#game-detail`) mit Partyabend-Planer, Daten und eigenen Kategorien | `party.css`, `party-extra.css`, `party-night.css`; zur Laufzeit `party-guide.css` (aus `party-hub-polish.js`), `party-release.css` und `party-search.css` (aus `runtime-guard.js`, nur wenn `#game-grid` existiert) | `party-hub*.js`, `party-session-controls.js`, `party-night.js`, `party-data-tools.js`, `party-custom-packs.js`, `session-ledger.js` |
| `quick-play.html` | Quick-, Mega-, Viral-, Wave-One- und selbst erstellte Spiele | `party.css`, `party-extra.css`, `party-quick.css` | `quick-loader.js`, `party-*-modes.js`, `quick-session-replacement-guard.js` |
| `advanced.html` | Spiele mit geheimen Rollen (Mafia usw.) | `party.css`, `party-extra.css` | `party-advanced*.js`, `advanced-resume-guard.js`, `advanced-privacy-guard.js` |
| `index.html` | Word Imposter | `styles.css`, `pwa.css` | `app.js`, `game-engine.js`, `privacy-guard.js`, `word-imposter-resume-guard.js` |
| `creator.html` | Editor für eigene Spiele | `party.css`, `party-guide.css`, `creator.css` | `creator-page.js`, `game-creator.js` |
| `privacy.html` | Datenschutz | `styles.css`, `pwa.css` | – |
| alle Seiten | Update-Hinweis | `pwa-update.css` (aus `runtime-guard.js`) | `runtime-guard.js` |

Viele Bausteine der Spielansichten werden per JavaScript erzeugt (`party-hub.js`, `party-*-modes.js`, `party-advanced-runner.js`, `app.js`). Dort Klassen ergänzen, nicht die Struktur umbauen.

## Was v2 schon mitbringt

In `v2-theme.css` (Abschnittsüberschriften im Kommentarstil `/* ── … */`):

- **Tokens** in `:root`: `--bg`, `--fg`, `--fg-dim`, `--surface`, `--surface-2`, `--line`, `--signal`, `--tint`, `--ok`, `--r-card`, `--r-big`, `--pad`, `--touch`, `--touch-play`, `--safe-top`, `--safe-bot`, Schriften `--display` und `--body`.
- **Gerüst**, **Pillen** (`.pill`, `.pill-primary`, `.pill-quiet`, `.pill-danger`, `.pill-tint`), **Reihen** (`.rows`, `.row`, `.row-ico`, `.row-main`, `.row-val`, `.row-chev`), `.chip`, `.sheet`.
- **Spielbildschirme**: `.play`, `.play-body`, `.play-center`, `.play-name`, `.play-note`, `.play-turn`, `.flipcard`, `.vote-grid`, `.vote-btn`, `.result-kick`, `.result-word`. Das sind die Stile der früheren v2-Spielbildschirme aus Claude Design und die Vorlage für alle Engines.
- **Nachfrage beim Abbrechen**, **Kategorieauswahl**, **Stimmstand**, **Bewegung** (inkl. `prefers-reduced-motion`).
- Fokus: `:focus-visible { outline: 3px solid var(--fg) }`.

`v2-theme.css` hat schon rund 1460 Zeilen. Neue Stile für die Spielansichten deshalb in eine neue Datei **`v2-play.css`** legen (bei Bedarf weitere, z. B. `v2-data.css`). Jede neue Stildatei braucht: Eintrag in der `CORE`-Liste von `sw.js`, ein Budget in `scripts/performance_budget.py`, danach `python3 scripts/offline_core_lock.py --bump` und einen `CHANGELOG.md`-Eintrag.

## Reihenfolge – je Schritt ein eigener Pull Request

Jeder Schritt: eigener Branch von `main` (z. B. `design/v2-quick-play`), PR gegen `main`, alle vier Prüfungen grün, Screenshots Handy (375×812) und Desktop in der PR-Beschreibung. Erst den nächsten Schritt beginnen, wenn der vorige gemergt ist.

1. **`quick-play.html`** – betrifft die meisten Spiele. Setup, Spielansicht, Pause-Overlay, Sitzungssteuerung, Ergebnis. `v2-play.css` hier anlegen.
2. **`party.html`, nur die Spielansicht** (`#play-layer`, `#play-content`, `#play-options`, `#play-actions`): Timer, Pause und Abbrechen, Kategorieauswahl, Ergebnis. Die alte Hub-Oberfläche bleibt in diesem Schritt unverändert.
3. **`advanced.html`** – geheime Rollen. Verdecken und Übergabe-Bildschirme müssen eindeutig bleiben.
4. **`index.html` (Word Imposter) und `privacy.html`** – beide hängen an `styles.css` und `pwa.css`.
5. **`creator.html`**.
6. **Funktionen aus der alten Hub-Oberfläche nach v2 holen**: Partyabend-Planer (`party-night.js`), Daten und Sicherung (Export, Import, alles löschen; `party-data-tools.js`), eigene Kategorien (`party-custom-packs.js`), Favoriten, Statistik und Erfolge. Ort: das Profil in `v2-hub.html` bzw. eigene v2-Ansichten. Die Profil-Reihen „Partyabend planen“ und „Daten und eigene Inhalte“ zeigen danach auf die neuen Ansichten statt auf `party.html`. Update-Hinweis (`pwa-update.css`) ebenfalls ins v2-Design bringen.
7. **Altes Design löschen** (siehe unten).

## Regeln für jeden Bildschirm

- **Nur das Aussehen ändern.** Element-IDs, `data-`-Attribute, ARIA-Rollen, Texte, nach denen Tests suchen, und die Reihenfolge der Spielschritte bleiben.
- **Schutzfunktionen bleiben wirksam und sichtbar:** Verdecken geheimer Inhalte (`privacy-guard.js`, `advanced-privacy-guard.js`), Fortsetzen nach Neuladen (`*-resume-guard.js`), Pause im Hintergrund, Verlauf genau einmal schreiben (`session-ledger.js`).
- **Bedienbarkeit:** Touch-Ziele mindestens 44 px (`--touch`), sichtbarer Fokus, `prefers-reduced-motion` beachten, Kontrast mindestens WCAG AA.
- **Handy zuerst:** bei 375×812 kein waagrechtes Scrollen, nichts überlappt (`tests/e2e/layout-overlap.spec.js`).
- **Sicherheit:** keine Inline-Skripte, keine `style`-Attribute, Nutzerdaten nur per `textContent`.
- **Rückwege** führen zu `v2-hub.html`. `quick-play.html`, `advanced.html`, `index.html` und `creator.html` tun das schon; `party.html` verweist noch auf `party.html` und `index.html`.
- **Nur lokale Schriften und Bilder** (CSP). Die Schriften liegen in `fonts/` und werden über `v2-theme.css` geladen.

## Tests, die an den alten Stildateien hängen

Diese Prüfungen lesen alte CSS-Dateien direkt und suchen darin feste Zeichenketten. Wenn die Stile umziehen, die Prüfung **auf die neue Datei umstellen – mit derselben Zusage**. Nie abschwächen oder ersatzlos löschen.

| Prüfung | liest | prüft |
|---|---|---|
| `tests/accessibility-contract.test.js` | `party.css`, `party-extra.css`, `creator.css` | Fokusrahmen, 44/46 px Mindesthöhe, `prefers-reduced-motion`, `.hub-session-controls .ghost-button`, `.favorite-button`, `.close-button` |
| `tests/hub-control-contract.test.js`, `scripts/hub_control_audit.py` | `party.css` | `.hub-session-controls`, `.hub-abort-button`, 44 px, zwei Spalten unter 720 px |
| `tests/party-release-structure.test.js` | `party-release.css`, `party-search.css` | Stile für Katalogstufen und Suche |
| `tests/pwa-update.test.js` | `pwa-update.css` | Update-Hinweis |
| `tests/e2e/offline.spec.js`, `tests/e2e/runtime-guard.spec.js` | Dateilisten | Offline-Cache enthält alle Dateien |
| `scripts/performance_budget.py` | Budget je Stildatei | Größe |
| `sw.js` | `CORE`-Liste | Offline-Cache |

## Altes Design löschen (Schritt 7)

Erst wenn Schritte 1–6 gemergt sind und `grep` keine Verweise mehr findet:

- Stildateien: `styles.css`, `pwa.css`, `party.css`, `party-extra.css`, `party-night.css`, `party-quick.css`, `party-guide.css`, `party-release.css`, `party-search.css`, `creator.css` und – falls ersetzt – `pwa-update.css`.
- Laden zur Laufzeit entfernen bzw. umstellen: `runtime-guard.js` (`PARTY_RELEASE_STYLE`, `PARTY_SEARCH_STYLE`, `UPDATE_STYLE`) und `party-hub-polish.js` (`party-guide.css`).
- Die alte Hub-Oberfläche in `party.html` (`#view-*`, `#game-detail`) und JavaScript, das nur sie bedient – aber nur, wenn v2 jede dieser Funktionen abdeckt und der Spielablauf nicht davon abhängt.
- Tests der alten Oberfläche (z. B. `tests/e2e/party-hub.spec.js`, `party-filter-state.spec.js`, `party-search-assist.spec.js`) auf v2 umziehen statt löschen. Die Testabdeckung darf nicht schrumpfen.
- Danach: `sw.js` `CORE`, `scripts/performance_budget.py`, `python3 scripts/offline_core_lock.py --bump`, `CHANGELOG.md`, `DESIGN_SYSTEM.md` und `ARCHITECTURE.md` Abschnitt 4a aktualisieren.

## Fertig, wenn

- Jede Seite lädt nur noch v2-Stile (`v2-theme.css` plus `v2-play.css` bzw. weitere v2-Dateien).
- `npm run ci` ist grün; der Cross-Browser-Smoke (`npm run test:cross-browser`) läuft.
- Keine Funktion fehlt gegenüber vorher: Spielerliste, Favoriten, Statistik und Erfolge, Verlauf, Fortsetzen, Partyabend, eigene Kategorien, Sicherung exportieren und einspielen, alles löschen, Creator.
- Jede PR-Beschreibung zeigt Screenshots (Handy und Desktop) der umgestellten Bildschirme.

## Lokal ansehen

```bash
python3 -m http.server 4174 --bind 127.0.0.1
```

Dann `http://127.0.0.1:4174/v2-hub.html` öffnen. Playwright startet für die Tests einen eigenen Server auf Port 4173.

## Danach: Bilder

Erst nach Schritt 7. Regeln stehen in `AGENTS.md` unter „Bilder und andere Medien“.

## Auftrag zum Einfügen in Codex

> Lies `AGENTS.md` und `docs/V2_DESIGN_UMSTELLUNG.md`. Du übernimmst die Umstellung von Secret Circle auf das v2-Design allein. Arbeite die Schritte in `docs/V2_DESIGN_UMSTELLUNG.md` der Reihe nach ab, beginne mit Schritt 1 (`quick-play.html`). Für jeden Schritt: eigener Branch von `main`, nur das Aussehen ändern (IDs, Spiellogik und Schutzfunktionen bleiben), Tests, die alte Stildateien lesen, mit derselben Zusage auf die neue Datei umstellen, dann `npm run check`, `npm test`, `npm run validate` und `npm run test:e2e` ausführen, und einen Pull Request gegen `main` mit Screenshots (Handy 375×812 und Desktop) öffnen. Commit-Nachrichten und PR-Texte auf Deutsch. Keine Funktion streichen. Wenn eine Prüfung wiederholt fehlschlägt, nicht abschwächen, sondern die Ursache beheben oder im PR beschreiben.
