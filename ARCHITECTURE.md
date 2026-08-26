# Secret Circle – Architekturvertrag für langfristige Wartbarkeit

Stand: 26. August 2026

Dieses Dokument definiert die technischen Grenzen für den Januar-2027-Release. Secret Circle bleibt eine statische **offline-first PWA** für gemeinsame Spiele auf einem Gerät.

## 1. Produktgrenzen

V1 besitzt kein verpflichtendes Konto, kein Backend, keine eigene Server-API, keine Werbung, kein Tracking und keine externen Runtime-CDNs. Online-Multiplayer, Cloud-Sync, Live-KI-Inhalte, Kamera/Mikrofon oder Mehrgerätefunktionen benötigen vor Einführung einen neuen Produkt-, Privacy-, Security- und Architekturentscheid.

## 2. Stabile Identitäten

Persistierte Spiel-IDs, Pack-IDs, Creator-IDs, Session-IDs, Completion-IDs, Storage-Keys, Backupformate, Manifest-ID und PWA-Scope sind Verträge. Anzeigenamen dürfen geändert werden; persistierte IDs nur mit Migration.

Jede wiederaufnehmbare Session besitzt eine stabile Session-ID. Ein Abschluss darf Verlauf und Statistik genau einmal verändern.

## 3. Versionierte Daten und Backups

`backup-schema-registry.js` ist die zentrale Quelle für Complete-Backup-Format, Größenlimits und explizit verwaltete aktuelle Storage-Keys und steht auf Registry-Version 2. `party-data-tools.js` Version 6 konsumiert diesen Vertrag.

Beschädigte oder unbekannte Daten werden nicht blind übernommen. Änderungen an Persistenz benötigen Validierung, Migration, Korruptions-, Quota-, Import- und Rollbacktests. Word Imposter begrenzt eigene Kategorien auf 50 und Begriffe je Kategorie auf 200; ungültige Imports dürfen vorhandene Daten nicht teilweise verändern.

Seit v51 gilt für Complete Backups:

- nur explizit registrierte aktuelle Keys werden bei Restore ersetzt;
- unbekannte oder zukünftige `secret-circle-*`-Namespaces/Storage-Versionen bleiben unverändert;
- verwaltete Werte benötigen valides JSON, erwarteten Root-Typ, aktuelle Storage-Version und minimale Pflichtwrapper;
- Validierung erfolgt vollständig vor der ersten Mutation;
- bei Schreibfehlern werden nur verwaltete Keys auf den vorherigen Snapshot zurückgerollt;
- „Alle lokalen Daten löschen“ bleibt getrennt und entfernt bewusst sämtliche `secret-circle-*`-Namespaces.

## 4. Katalog- und Contentarchitektur

Der Party-Katalog wird in dieser Reihenfolge aufgebaut:

`party-catalog.js → party-expansion.js → party-trending-catalog.js → party-mega-catalog.js → party-viral-catalog.js → party-core-release-catalog.js → party-core-classic-content.js → party-routing.js`

Verantwortung:

- `party-catalog.js`: Basiskatalog und soziale Kerninhalte
- `party-expansion.js`: Erweiterungen und Advanced-Definitionen
- `party-trending-catalog.js`: klassische Quick Modes
- `party-mega-catalog.js`: Trend-/Ranking-/Social-Formate
- `party-viral-catalog.js`: Viral-/Quiz-/Storyformate
- `party-core-release-catalog.js`: Core-Releaseinhalte
- `party-core-classic-content.js`: finale redaktionelle Core-Schicht, aktuell **v4**
- `party-routing.js`: finale Routingfassade und Creator-Integration

Privacy-/Reference-Safe-Entscheidungen werden nicht nur in einer späteren Ersatzschicht gehalten. `scripts/privacy_content_audit.py` und `scripts/reference_content_audit.py` schützen diese Grenze.

## 5. Hub- und Timergrenzen

- `party-hub.js`: direkte Hub-Sessions, Navigation, Persistenz und nicht zeitgesteuerte Flows
- `party-hub-round-state.js`: validierte Current-Referenzen, Truth/Dare-Pooltrennung sowie sichere und verdeckte Resume-Phasen
- `party-hub-timers.js`: Scharade, Tabu, Heiße Kartoffel und Wortkette
- `party-session-controls.js`: gemeinsame pausierbare Session-/Timersteuerung
- `party-hub-resume-guard.js`: eigenständige Validierung gespeicherter Hub-Timerzustände
- `party-hub-polish.js`: Live-Guidance, Privacy-Handoff, Resume-Guard-Ladesteuerung und ergänzende UI-Schutzlogik
- `party-hub-a11y.js`: Fokus-, Modal- und Hintergrundisolation des Hubs

Die direkte Hub-Runtime-Reihenfolge lautet:

`party-session-controls.js → party-hub-timers.js → party-hub-round-state.js → party-hub.js`

Seit v52 gilt:

- sichtbare Karten aus `truth-dare`, `prompt` und `choice` werden als geprüfte Indexreferenz in `session.current` gespeichert;
- Reload/Resume rendert dieselbe laufende Karte;
- Wahrheit und Pflicht besitzen getrennte `usedByPool.truth`-/`usedByPool.dare`-Indexräume;
- `next` und globales Skip löschen `current`;
- Current-Referenzen werden gegen Modus, Pack, Index und Content geprüft.

Seit v53 gilt für Paranoia:

- eine gestartete geheime Frage darf als validierte Kartenreferenz (`kind`, `index`, Phase) fortgesetzt werden, aber nicht automatisch sichtbar sein;
- nach Reload erscheint zunächst nur der gedeckte Einstieg;
- ein bereits entschiedener Münzwurf bleibt als boolesches Ergebnis stabil und wird nicht neu randomisiert;
- auch der aufgelöste Zustand wird bei Fokus-/Appverlust durch `party-hub-polish.js` v17 verdeckt;
- ungültige/out-of-range Referenzen sowie `resolved` ohne boolesches `reveal` werden verworfen.

Seit **v54** gilt zusätzlich für sichere Timer-Vorbereitung:

- `hot-potato` und `word-chain` dürfen **vor Timerstart** eine validierte sichere `current`-Indexreferenz besitzen;
- Reload/Resume zeigt dadurch dieselbe Hot-Potato-Aufgabe bzw. denselben Wortketten-Startbuchstaben statt still einen neuen Wert zu ziehen;
- beim tatsächlichen Timerstart wird `current` sofort gelöscht;
- Prompt bzw. Startbuchstabe werden anschließend ausschließlich im bestehenden Timer-Snapshot (`timer.prompt` / `timer.letter`) fortgeführt;
- Scharade und Tabu bleiben von diesem Pre-Start-Current-Vertrag ausgeschlossen, weil deren Karten privat sind.

Der Resume-Guard bleibt eigenständig. Seit v50 wird eine bereits sichtbare Resume-Karte während der Guard-Prüfung fail-closed gesperrt (`aria-busy`, deaktivierte Buttons) und erst nach erfolgreicher Validierung freigegeben.

## 6. Weitere Runtime-Grenzen

Word Imposter trennt Fachlogik (`game-engine.js`), Rollen (`role-assignment.js`), Daten (`data-store.js`), Resume-Integrität (`word-imposter-resume-guard.js`) und UI (`app.js`).

Advanced Core trennt Definitionen, Runner und Schutzschichten über `party-advanced.js`, `advanced-resume-guard.js`, `party-advanced-runner.js` und `advanced-privacy-guard.js`.

`secondary-surface-a11y.js` schützt Advanced, Quick und Creator. Globale Monkey-Patches von Storage-, Engine- oder Browser-Prototypen zur Korrektur von Fachlogik sind verboten.

## 7. Lokale Transaktionen und Exact-once

Kritische Datenoperationen validieren zuerst, halten den alten Zustand fest, schreiben vollständig und rollen bei Fehlern zurück. Fertige Sessions werden mit stabilen Completion-IDs verbucht. Reload, Wiederholung oder UI-Doppelklick dürfen keinen zweiten Verlaufseintrag erzeugen.

Complete-Backup-Restore und vollständige Datenlöschung sind unterschiedliche Transaktionen: Restore besitzt nur registrierte Backup-Keys; vollständige Löschung besitzt den gesamten Secret-Circle-Prefix.

## 8. Datenschutz und Security durch Architektur

- keine Analytics-/Ads-Skripte
- keine externen Runtime-Fonts/CDNs
- restriktive CSP
- Nutzereingaben bevorzugt über `textContent`
- Importgrenzen nach Format, Version, Größe, exakter Key-Allowlist und Struktur
- geheime Karten/Fragen/Rollen bei Fokusverlust verdecken
- geheime Zustände nach Reload niemals automatisch sichtbar öffnen
- sichere Current-Karten dürfen unmittelbar fortgesetzt werden
- sichere Hot-Potato-/Word-Chain-Pre-Start-Werte dürfen als Indexreferenz fortgesetzt werden
- geheime Paranoia-Referenzen dürfen nur gedeckt fortgesetzt werden
- Scharade-/Tabu-Geheimkarten werden nicht als sichtbarer Pre-Start-Current gespeichert
- lokale Daten exportierbar und löschbar
- persönliche Inhalte freiwillig und überspringbar

`SECURITY.md`, `THREAT_MODEL.md` und `BACKUP_SCHEMAS.md` ergänzen diesen Vertrag.

## 9. Offline- und Updatevertrag

Aktueller Offline-Core: **`secret-circle-v54` / `secret-circle-v54-staging`**.

Relevante jüngere Generationen:

- v42: echte 192×192-/512×512-PWA-Rastericons + Hash/IHDR/Manifestvertrag
- v43: Private-Device-Content physisch bereinigt
- v44: einheitlicher PWA-Head-Vertrag
- v45: Core-Hardening-/Resume-/Privacy-Ausbau
- v46: Hub-Accessibility
- v47: Advanced-/Quick-/Creator-Accessibility
- v48: Word-Imposter Voting-Resume + Datenhärtung
- v49: zentraler Hub-Resume-Guard
- v50: fail-closed Resume-UI-Quarantäne
- v51: Complete-Backup-Transaktionsgrenze / Forward Compatibility
- v52: direkte sichere Hub-Rundenkontinuität + getrennte Truth/Dare-Pools
- v53: Paranoia-Referenz/Phase/Münzwurf-Ergebnis resume-fähig, aber gedeckt
- **v54: Hot-Potato-/Word-Chain-Pre-Start-Wert bleibt über Reload stabil und wechselt beim Start atomar in den Timer-Snapshot**

Neue Versionen werden zuerst in `STAGING_CACHE` vorbereitet. Aktivierung erfolgt erst nach bewusster Nutzerentscheidung. Der aktive Cache wird nicht vor erfolgreicher Promotion zerstört.

Bei jeder Änderung einer offline benötigten Datei:

1. CORE-Liste prüfen
2. Cachegeneration erhöhen
3. Service-Worker-Test aktualisieren
4. Architektur/Deployment/Privacy/Environment/Hosting synchronisieren
5. reale Alt→Neu- und Rollbackpfade später auf HTTPS-Staging testen

## 10. PWA-Installationsmetadaten

`party.html`, `index.html`, `creator.html`, `advanced.html` und `quick-play.html` besitzen denselben Installationsvertrag: Manifest, Theme/Viewport, Apple-/Mobile-Metadaten, SVG-/PNG-Icons, Apple-Touch-Icon und CSP mit `manifest-src 'self'`.

`tests/pwa-head-metadata.test.js` schützt die Source-Seite; reale Homescreen-/Standalone-Darstellung bleibt ein Geräte-Gate.

## 11. Accessibility als Definition of Done

Kernoberflächen benötigen semantische Struktur, beschriftete Controls, sichtbaren Fokus, Tastaturbedienung, modale Fokusgrenzen, ausreichend große Touchziele, Reduced Motion, 200-%-Zoom/Reflow und verständliche Statusmeldungen. Farbe allein darf keinen kritischen Status erklären.

Quellseitige Schutzschichten sind `party-hub-a11y.js` und `secondary-surface-a11y.js`. VoiceOver, TalkBack, reale Touchbedienung, große Systemschrift und Geräte-/Browserprüfung bleiben Release-Evidence.

## 12. Inhalts- und Rechtevertrag

- keine kopierten proprietären Karten konkurrierender Apps
- keine fremden Logos/Bilder/Audios/längeren Zitate ohne geklärte Rechte
- unnötige konkrete Marken-/Franchise-/Eventbezüge vermeiden
- Nutzerinhalte klar von Built-ins trennen
- Asset-Provenienz maschinenlesbar halten
- ein `unresolved` Releaseasset blockiert `assetsThirdParty = PASS`

`CONTENT_AGE_POLICY.md`, `CORE_CONTENT_REVIEW.md`, `FAN_CONTENT_REVIEW.md`, `THIRD_PARTY_NOTICES.md` und `ASSET_RIGHTS_SIGNOFF.md` bilden die Detailverträge.

## 13. Testpyramide

Bei normalen Änderungen: Syntaxchecks, Unit-/Contracttests, Architektur-/Foundation-/Backup-/Content-/Privacy-/Reference-/Asset-/Accessibility-/Operator-/Release-Audits.

Hub-Resume wird funktional durch `tests/hub-resume-contract.test.js` und `tests/hub-timer-contract.test.js` geschützt. Browser-Verträge liegen in `tests/e2e/core-hub-resume.spec.js`, `tests/e2e/core-hub-controls.spec.js` und **`tests/e2e/core-hub-prestart-resume.spec.js`**.

Beim Release Candidate zusätzlich: echter Online-`npm ci`, vollständiges CI, Chromium/Firefox/WebKit, HTTPS-Staging, PWA Upgrade/Rollback, Android/iPhone/Tablet, VoiceOver/TalkBack/Zoom/Tastatur sowie reale Gruppen.

Audits müssen zustandsfähig sein: PREPARED/NO_GO heute und später korrekt belegtes FINAL/GO.

## 14. Performance und Assets

Produktionsmodule bleiben grundsätzlich unter 1000 Zeilen und 100 KB; engere Budgets aus `scripts/performance_budget.py` haben Vorrang. `party-hub.js` bleibt unter dieser Grenze; neue Runden-/Timerzustände gehören in die bereits getrennten Round-State-/Timer-Module.

PWA-Assets: `icon.svg`, `icon-192.png`, `icon-512.png`, `assets/manifests/asset-provenance.json`. Technische Provenienz ist dokumentiert; die Rechtebasis wird separat menschlich freigegeben.

## 15. Betrieb, Deprecation und Rollback

`SUPPORT.md`, `INCIDENT_RESPONSE.md`, `MAINTENANCE.md`, `HOSTING_DECISION.md`, `OPERATOR_RELEASE_SIGNOFF.md` und `OPERATOR_EVIDENCE_LOG.md` definieren den Betriebsvertrag.

Keine Force-Push-Annahme für stabile Release-Basen. Rollback erhält bei Offline-Core-Änderungen eine neue Cachegeneration. Persistierte Daten müssen rückwärtsverträglich bleiben oder explizit migriert werden.

## 16. Releaseentscheidung

Eine Funktion ist erst releasefähig, wenn Code, Datenverhalten, Privacy/Security, Offline, Accessibility, Tests und Dokumentation zusammenpassen **und die erforderlichen realen Gates tatsächlich ausgeführt wurden**.

`release-evidence.json` ist die maschinenlesbare finale Quelle. `GO` ist nur zulässig, wenn alle Pflichtgates mit Evidence auf demselben unveränderten RC-Commit `PASS` sind.