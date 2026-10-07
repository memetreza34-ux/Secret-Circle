# Hinweise für Coding-Agenten (Codex, Claude Code)

Secret Circle ist eine offline-first PWA mit Partyspielen für eine Gruppe und ein Gerät. Vanilla JavaScript, HTML und CSS, kein Build-Schritt, keine Runtime-Abhängigkeiten. Oberfläche und Texte sind deutsch; Commit-Nachrichten ebenfalls.

## Stand der Oberfläche

- **Startseite:** `v2-hub.html` mit `v2-hub.js` und `v2-theme.css` – das Design aus Claude Design. Sie zeigt Katalog, Spieldetail, Spielerliste und Profil und spielt selbst nichts.
- **Spielabläufe (Engines, im v2-Design):** `party.html` (Hub-Spiele, gestartet über `party.html?play=<id>&pack=<name>&from=v2`), `quick-play.html`, `advanced.html`, `index.html` (Word Imposter), `creator.html`, `privacy.html`.
- **Daten:** Spielerliste und Verlauf liegen in `secret-circle-party-hub-v1`. v2 führt keinen eigenen Speicher. Alle Speicher-Keys und Backups regelt `backup-schema-registry.js`.
- Details: `ARCHITECTURE.md` Abschnitt 4a.

## Stand und nächste Schritte

**Die Umstellung auf das v2-Design ist abgeschlossen (5.–6. Oktober 2026).** Jede Seite trägt nur noch v2-Stile; die alten Stildateien sind gelöscht. Wer ab jetzt weiterarbeitet (Codex, ChatGPT oder Claude Code), startet von `main` – sobald der Pull Request `design/v2-gesamt` (#21) dort gemergt ist; bis dahin vom Branch `design/v2-gesamt`. Plan und Stand stehen in `docs/V2_DESIGN_UMSTELLUNG.md`. Die Oberfläche von `party.html` (Partyabend, Daten und Sicherung, eigene Kategorien, Favoriten, Verlauf und Erfolge) steht in `v2-party-hub.css`, der Update-Hinweis in `v2-update.css`. Die Startseite zeigt „Zuletzt gespielt“ als Reihe; das Profil hat „Weiterspielen“ und die Liste mit Namen. Der Verlauf speichert die Namen der Runde (`players`).

Als Nächstes: Bilder einbinden (siehe unten). Bestehende Spiellogik, Schutzfunktionen (Fortsetzen, Verdecken geheimer Inhalte, exact-once-Verlauf) und Element-IDs nicht umbauen, nur weil sich das Aussehen ändert – viele Tests hängen daran. Einige Tests lesen Stildateien direkt (`v2-party-hub.css`, `v2-party-play.css`, `v2-update.css` usw.); beim Umzug von Stilen diese Prüfungen mit derselben Zusage auf die neue Datei umstellen, nie abschwächen. Keine Funktion streichen.

## Bilder und andere Medien

- **Nur lokale Dateien.** Die Content-Security-Policy erlaubt Bilder nur von der eigenen Herkunft oder als `data:`-URL. Keine externen URLs, keine CDNs.
- **Medienvertrag anpassen.** `scripts/media_inventory_audit.py` erlaubt derzeit genau drei Mediendateien (`icon.svg`, `icon-192.png`, `icon-512.png`). Neue Bilder brauchen dort einen Eintrag und in `assets/manifests/asset-provenance.json` eine Herkunft: Werkzeug bzw. Modell, Datum, Rechtegrundlage. Bei KI-generierten Bildern das Werkzeug nennen. Danach `THIRD_PARTY_NOTICES.md` und `ASSET_RIGHTS_SIGNOFF.md` ergänzen.
- **Inhalt:** keine echten Personen, Marken, Logos oder erkennbaren Figuren aus Filmen, Serien, Anime oder Spielen (`CONTENT_AGE_POLICY.md`, `FAN_CONTENT_REVIEW.md`).
- **Format und Größe:** WebP oder AVIF, sparsam dimensioniert. Alles im Offline-Cache wird bei der Installation geladen; Grenzen stehen in `scripts/performance_budget.py`.
- **Barrierefreiheit:** Informative Bilder brauchen `alt`-Text, rein dekorative `alt=""` bzw. `aria-hidden="true"`.

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
