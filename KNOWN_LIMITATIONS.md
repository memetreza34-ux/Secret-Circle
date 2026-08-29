# Bekannte Einschränkungen

Stand: 29. August 2026 – `1.0.0-beta.3`, **55 Built-ins · 15 Core / 13 Extended / 27 Labs**, Wave 1 **10/10 quellsseitig implementiert**, Offline-Core **`secret-circle-v64` / `secret-circle-v64-staging`**.

Öffentliche Freigabe: **NO_GO**. Quellsseitige Implementierung oder vorhandene Tests ersetzen keine reale Release-Evidence.

## Gemeinsames Gerät

Secret Circle ist derzeit lokales Pass-and-Play. Es gibt keine Raumcodes, Pflichtkonten, privaten Rollen auf persönlichen Handys oder geräteübergreifende Synchronisierung. Geheime Karten müssen physisch abgeschirmt werden. Die App reduziert unbeabsichtigtes Mitlesen, kann absichtliches Schulterblicken oder DevTools-Zugriff des Gerätebesitzers aber nicht verhindern.

## Automatisierter Teststatus

Unit-, E2E-, Offline-, Security-, Accessibility- und Cross-Browser-Prüfungen sind umfangreich vorbereitet. Ein vollständiger aktueller Hosted-Runner-Gesamtlauf ist **nicht grün dokumentiert**.

GitHub Actions reproduziert weiterhin:

- `steps: []`
- `runner_id: 0`
- leerer Runner-Name
- angefordert `ubuntu-latest`
- kein Checkout / npm / Playwright / Python-Audit / Repositorycode

Damit liegt der aktuelle Blocker vor Step 1. App-Code und Testgates werden nicht abgeschwächt, um einen Job zu „reparieren“, der keinen Runner erhält.

## 55 eingebaute Spiele

Der zusammengesetzte Katalog enthält technisch 55 Built-ins:

- 15 Core
- 13 Extended
- 27 Labs

Die 15 Core-Spiele sind für Januar 2027 priorisiert, aber noch nicht vollständig mit realen Gruppen auf Verständlichkeit, Balance, Wartezeit, Wiederholungswert, sozialen Druck und Alterseignung abgenommen.

Die zehn Wave-1-Modi bleiben Labs, bis reale Browser-, PWA-, Accessibility- und Gruppenevidence vorliegt.

## Game-Creator

Der Creator unterstützt lokale No-Code-Spielerstellung für einfache Text-/Promptmechaniken. Komplexere strukturierte Rollen-, Preis-, Zahlen-, Buzzer-, Tabu-, Spektrum- und Abstimmungsspiele benötigen spezialisierte Engine-/Editorverträge.

Grenzen:

- höchstens 40 selbst erstellte Spiele
- höchstens 8 Kategorien je Spiel
- höchstens 200 Karten je Kategorie
- nur lokale Speicherung und JSON-Export
- keine automatische Inhaltsmoderation
- keine Bild-, Audio- oder Videouploads
- Ersteller sind für Rechte, Eignung und Altersstufe ihrer Texte verantwortlich

## Timer, Hintergrund und Wiederaufnahme

Direkte Hub-Sessions besitzen versionierte lokale Active-States. Relevante Timer werden nach Reload kontrolliert wiederhergestellt; private Inhalte werden nicht automatisch aufgedeckt.

Quick-Family-Verträge:

- QT57 – Restzeit über normalen Reload
- BF58 – kontrollierter BFCache-Resume-Pfad
- BG59 – Hidden/Appwechsel pausiert ohne Auto-Resume
- HS60 – Hidden-Snapshot wird sofort persistiert für Cold Resume

Diese Verträge sind noch nicht auf allen realen Zielgeräten Release-Evidence. Screen-Lock, OS-Prozess-Kill, Safari/PWA-Lifecycle und Android-Hintergrundverhalten bleiben reale Geräte-Gates.

## Referenz-, Fan- und Markencontent

Unnötige konkrete Fan-/Markenreferenzen wurden quellsseitig stark reduziert; ausgelieferte Contentquellen werden automatisiert gescannt. Das ersetzt keine finale manuelle/rechtliche Abnahme sichtbarer Inhalte, Assets und Marketingtexte.

Fremde Logos, Bilder, Videos, Audios und längere geschützte Texte sind für den V1-Core nicht vorgesehen.

## Persönliche Fragen

Einige Social-Modi können persönliche Situationen berühren. Überspringen und sichere Alternativen sind vorgesehen. Komfort, Gruppendruck und Alterseignung müssen real getestet werden.

## Bilder, Icons und Animationen

Der **frühere Root-Icon-Rechteblocker ist geschlossen**. Das alte ungeklärte Iconset wurde vollständig ersetzt:

- `icon.svg` = `verified-own`
- `icon-192.png` = `verified-own`
- `icon-512.png` = `verified-own`

Der Erstellungsweg und die SHA-256-Werte sind in `ASSET_RIGHTS_SIGNOFF.md` und `assets/manifests/asset-provenance.json` dokumentiert.

Weiter offen bleiben:

- tatsächliche Asset-/Media-Audits auf funktionierendem Runner/Checkout
- Online-Dependency-/Integrity-Evidence
- finaler manueller Visual-/Marken-/Third-Party-Plausibilitätsreview auf dem unveränderten RC
- zusätzliche zukünftige Illustrationen/Icons/Motion müssen jeweils neu inventarisiert und geprüft werden

`assetsThirdParty` bleibt deshalb insgesamt BLOCKED, obwohl die konkrete alte Icon-Rechtefrage quellsseitig gelöst ist.

## Offline und PWA – v64

Die App muss einmal vollständig online geladen werden. Service Worker und Installation benötigen HTTPS oder `localhost`.

Aktueller Service Worker:

- Production: `secret-circle-v64`
- Staging: `secret-circle-v64-staging`

Der kontrollierte Updatepfad ist vorbereitet, aber noch nicht als reale **Altversion → v64/RC → Rollback**-Evidence auf Android, iPhone und iPad dokumentiert. Ein Rollback/Hotfix muss eine neue Cachegeneration verwenden.

Browser oder Betriebssystem können lokalen Speicher bei Speicherdruck entfernen. Wichtige eigene Spiele und Packs sollten exportiert werden.

## Backup / Restore

Gesamtsicherungen und Creator-Exporte sind unverschlüsselte JSON-Dateien. Wer die Datei erhält, kann darin enthaltene Namen, eigene Inhalte, Einstellungen und Sessions lesen. Es gibt keine automatische Cloud-Sicherung.

Der aktuelle Complete-Backup-Vertrag verwendet Registry-Version 2 und **17 verwaltete Storage-Keys**. Unbekannte zukünftige Namespaces werden nicht blind als aktuelle Daten interpretiert; managed Werte werden vor Mutation validiert und Schreibfehler sollen den vorherigen verwalteten Zustand wiederherstellen.

Einschränkungen:

- keine Verschlüsselung
- kein Schutz vor dem Gerätebesitzer
- zukünftige Daten werden nicht automatisch von einer älteren Runtime verstanden
- reale Quota-/Restore-/Forward-Compatibility-/Rollback-Evidence bleibt offen
- Browser können `localStorage` unabhängig von der App löschen

## Accessibility

Hub sowie Advanced/Quick/Creator besitzen quellsseitige Fokus-, Modal-, Tastatur- und Reflow-Schutzschichten. Noch kein realer Accessibility-PASS für:

- VoiceOver
- TalkBack
- 200-%-Zoom
- 320 CSS px
- große Systemschrift
- Touch
- Hoch-/Querformat
- Safe Areas
- Reduced Motion
- private Reveal-/Resume-Flows mit Screenreader

## PR-/Branch-Stack

Der historische Stack lautet:

`main` → PR #3 → PR #11 → PR #13.

Die späteren Main-Änderungen werden über den isolierten Draft-PR #15 (`integration/v64-main-sync`) kontrolliert reconciled. PR #15 soll gegenüber dem aktiven Releasebranch nur neun definierte Archiv-/Safety-Pfade unterscheiden.

Nach jedem neuen Release-Hardening-Batch muss vor Review/Merge ein aktueller GitHub-Compare bestätigen:

- `behind_by = 0`
- weiterhin exakt 9 Reconciliation-Pfade
- keine Spielengine/Katalog/Service-Worker-Runtime im Diff

Ohne funktionierende CI bleibt PR #15 Draft.

## Hosting / Betrieb / rechtliche Veröffentlichung

Source-seitig vorbereitet sind Cloudflare-Pages-Research, `_headers`, HTTPS-Smoke und Operatorverträge. Real fehlen weiterhin:

- final ausgewählter Hostingprovider/Produkt
- getrennte HTTPS-Staging-/Production-Origin
- reale DPA-/Processor-/Transferprüfung
- konkrete Betreiber-/Kontaktangaben
- Support-/Securitykontakt
- Incident-/Rollback-Drill
- finale Inhalts-/Alters-/Referenz-Abnahme
- reale Branch-Protection-/Required-Check-Abnahme
- Gesamt-Asset-/Third-Party-Finalreview

Die verbindlichen Freigabekriterien stehen in `release-meta.json`, `RELEASE_CHECKLIST.md`, `RELEASE_STATUS.md` und `release-evidence.json`.

**Aktuell: öffentliche Freigabe NO_GO.**
