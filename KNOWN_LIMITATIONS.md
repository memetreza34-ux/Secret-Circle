# Bekannte Einschränkungen

Stand: 29. August 2026 – `1.0.0-beta.3`, **55 eingebaute Spiele · 15 Core / 13 Extended / 27 Labs**, Expansion Wave 1 **10/10 quellsseitig implementiert** und Offline-Core **`secret-circle-v64` / `secret-circle-v64-staging`**.

Öffentliche Freigabe: **NO_GO**. Quellsseitige Implementierung oder vorhandene Tests sind kein Ersatz für reale Release-Evidence.

## Gemeinsames Gerät

Secret Circle ist derzeit lokales Pass-and-Play. Es gibt keine Raumcodes, Konten, privaten Rollen auf persönlichen Handys oder geräteübergreifende Synchronisierung. Geheime Karten müssen physisch abgeschirmt werden. Die App reduziert unbeabsichtigtes Mitlesen, kann absichtliches Schulterblicken oder DevTools-Zugriff des Gerätebesitzers nicht verhindern.

## Automatisierter Teststatus

Unit-, E2E-, Offline-, Sicherheits-, Accessibility- und Cross-Browser-Prüfungen sind umfangreich vorbereitet. Ein vollständiger aktueller Gesamtlauf ist **nicht grün dokumentiert**.

Frisch untersuchter v64-Actions-Lauf:

- Run #3608
- Run ID `33253663445`
- Job `99103557030`
- Head `2297868e1f65b45753294151a3b1f401a55f6288`
- `failure`
- `steps: []`
- `runner_id: 0`
- leerer Runner-Name
- kein Repositorycode ausgeführt

Damit bleibt der Fehler vor Checkout/Step 1. **v50–v64 besitzen keinen Hosted-Runner-PASS.** App-Code und Tests dürfen nicht abgeschwächt werden, um einen Job zu „reparieren“, der keinen Runner erhält.

## 55 eingebaute Spiele

Der aktuelle zusammengesetzte Katalog enthält technisch **55 Built-ins**. Die Release-Struktur teilt sie in:

- 15 Core
- 13 Extended
- 27 Labs

Die 15 Core-Spiele sind für Januar 2027 priorisiert. Auch sie sind noch nicht vollständig mit realen Gruppen auf Verständlichkeit, Balance, Wartezeit, Wiederholungswert, sozialen Druck und Alterseignung abgenommen.

Die zehn Wave-1-Modi sind source-seitig vorhanden, bleiben aber **Labs**:

- `bluff-trivia`
- `party-quiz`
- `fact-or-fake`
- `percent-guess`
- `fill-blank-battle`
- `who-wrote-it`
- `party-bracket`
- `undercover-similar-word`
- `no-word-imposter`
- `password-one-word`

Für ihre Promotion fehlen reale Browser-, PWA-, Accessibility- und Gruppentests. Sie erweitern den Januar-Core nicht automatisch.

Zeichnen-&-Raten-/Audio-/Melodieideen ohne fertige spezialisierte Engine bleiben Zukunftsarbeit; geschützte Aufnahmen, Liedtexte oder fremde Medien sind nicht Teil des V1-Core.

## Game-Creator

Der Creator unterstützt lokale No-Code-Spielerstellung für die vorgesehenen einfachen Text-/Promptmechaniken. Strukturierte Rollen-, Preis-, Zahlen-, Buzzer-, Tabu-, Spektrum- und komplexe Abstimmungsspiele benötigen weiterhin spezialisierte Editoren oder Engineverträge.

Grenzen:

- höchstens 40 selbst erstellte Spiele
- höchstens 8 Kategorien je Spiel
- höchstens 200 Karten je Kategorie
- nur lokale Speicherung und JSON-Export
- keine automatische Inhaltsmoderation
- keine Bild-, Audio- oder Videouploads
- Ersteller sind für Rechte, Eignung und Altersstufe ihrer Texte verantwortlich

## Eigene Packs

Der bestehende Pack-Editor unterstützt kompatible einfache Textmodi. Strukturierte Karten bleiben bewusst blockiert. Pro Gerät sind bis zu 30 Packs mit jeweils bis zu 150 Karten vorgesehen.

## Timer, Hintergrund und Wiederaufnahme

Direkte Hub-Sessions besitzen versionierte lokale Active-States. Relevante Hub-Timer werden nach vollständigem Reload bewusst pausiert wiederhergestellt und laufen erst nach „Fortsetzen“ weiter. Private direkte Hub-Inhalte werden nach Reload nicht automatisch geöffnet.

Für Quick-Family-Timer gelten zusätzlich die source-seitig implementierten Verträge:

- QT57 – Restzeit über normalen Reload
- BF58 – kontrollierter BFCache-Resume-Pfad
- BG59 – Hidden/Appwechsel pausiert ohne Auto-Resume
- HS60 – Hidden-Snapshot wird sofort persistiert, damit Cold Resume auch ohne zuverlässiges späteres `pagehide` möglich bleibt

Diese Verträge sind **noch nicht auf allen realen Zielgeräten als Release-Evidence bestätigt**. Screen-Lock, OS-Prozess-Kill, Safari/PWA-Lifecycle und Android-Hintergrundverhalten bleiben reale Geräte-Gates.

## Smart Party Night

Der Planer arbeitet lokal und heuristisch mit Spielerzahl, Dauer, Stimmung, Altersstufe, Favoriten und Verlauf. Empfehlungen sind keine Garantie für den Geschmack der Gruppe. Zeitangaben sind Näherungen. PN1–PN3 bleiben reale Beta-Gates.

## Referenz-, Fan- und Markencontent

Konkrete unnötige Fan-/Markenreferenzen wurden quellsseitig stark reduziert und Wave-1-Kataloge werden in den Reference-Audits mitgescannt. Das ersetzt keine finale manuelle/rechtliche Abnahme von sichtbaren Inhalten, Assets und Marketing.

Fremde Logos, Bilder, Videos, Audios und längere geschützte Texte sind für den V1-Core nicht vorgesehen.

## Geld und Preise

Geld-Challenges sind hypothetisch. Preis-/Schätzmechaniken verwenden feste Spielwerte oder interne Zielwerte und keine aktuellen Händler- oder Marktdaten. Sie eignen sich nicht für Kauf- oder Finanzentscheidungen.

## Persönliche Fragen

Finger runter, Hot Seat, Wer kennt mich am besten?, Pass das Handy und ähnliche Modi können persönliche Situationen berühren. Überspringen bzw. sichere Alternativen sind vorgesehen. Komfort, Gruppendruck und Alterseignung müssen real getestet werden.

## Bilder, Icons und Animationen

Das technische Icon- und Akzentsystem ist vorbereitet. Die endgültigen eigenständigen Illustrationen, SVG-Icons, Kartenhintergründe und Motion-Übergänge sind noch nicht vollständig produziert bzw. final abgenommen.

Die Rechtebasis des Root-`icon.svg` bleibt **`unresolved`**. Dadurch bleibt `assetsThirdParty` blockiert, bis Herkunft/Rechte belegt oder das Asset vollständig durch ein nachweislich eigenes Asset ersetzt wurde.

## Offline und PWA – v64

Die App muss einmal vollständig online geladen werden. Service Worker und Installation benötigen HTTPS oder `localhost`.

Der aktuelle Service Worker verwendet:

- Production: `secret-circle-v64`
- Staging: `secret-circle-v64-staging`

Er enthält die sechs Wave-1-Katalog-/Runnerfamilien sowie die bestehenden Resume-, Backup-, Privacy- und Sessionmodule im Offline-Core.

Der kontrollierte Updatepfad ist source-seitig vorbereitet, aber noch nicht als reale **Altversion → v64/RC → Rollback**-Evidence auf Android, iPhone und iPad dokumentiert. Rollback/Hotfix muss eine neue Cachegeneration verwenden und darf nicht einfach einen alten Cache-Namen wiederverwenden.

Browser oder Betriebssystem können lokalen Speicher bei Speicherdruck entfernen. Wichtige eigene Spiele und Packs sollten exportiert werden.

## Backup / Restore

Gesamtsicherungen und Creator-Exporte sind **unverschlüsselte JSON-Dateien**. Wer die Datei erhält, kann darin gespeicherte Namen, eigene Inhalte, Einstellungen und Sessions lesen. Es gibt keine automatische Cloud-Sicherung.

Der aktuelle Complete-Backup-Vertrag verwendet Registry-Version 2 und **17 verwaltete Storage-Keys**, einschließlich des promptfreien Quick-Timer-Stores. Unbekannte zukünftige Namespaces werden absichtlich nicht blind als aktuelle Daten interpretiert. Managed Werte werden vor Mutation validiert; Schreibfehler sollen den vorherigen verwalteten Zustand wiederherstellen.

Einschränkungen:

- keine Verschlüsselung
- kein Schutz vor dem Gerätebesitzer
- zukünftige Daten werden nicht automatisch von einer älteren Runtime verstanden
- reale Quota-/Restore-/Forward-Compatibility-/Rollback-Evidence bleibt offen
- ein Browser kann `localStorage` unabhängig von der App löschen
- ausdrücklich bestätigtes „Alle lokalen Daten löschen“ entfernt bewusst die vorgesehenen lokalen Secret-Circle-Daten

## Accessibility

Hub sowie Advanced/Quick/Creator besitzen quellsseitige Fokus-, Modal-, Tastatur- und Reflow-Schutzschichten. **Noch kein realer Accessibility-PASS:**

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

müssen auf realen Zielgeräten abgenommen werden.

## PR-/Branch-Stack

Der aktuelle Entwicklungsstand ist gestapelt:

`main` → PR #3 → PR #11 → PR #13.

PR #11 liegt vollständig auf #3 und PR #13 vollständig auf #11. Die erste Stack-Basis ist gegenüber aktuellem `main` jedoch **diverged** und enthält zwei spätere Main-Commits nicht in ihrer Abstammung:

- `6b6bddd0ae619d160b4468b61ae49cb30e2ea834`
- `d347c7138bae18325c288632222917ad618e6547`

Vor einer Release-Mergefolge muss diese Basis kontrolliert reconciled werden. Die beiden Main-Änderungen dürfen nicht versehentlich verloren gehen. Nach einer echten Merge-/Rebase-Integration ist wegen des neuen Kandidaten erneut Release-Evidence nötig.

## Hosting / Betrieb / Rechtliche Veröffentlichung

Vor öffentlicher oder kommerzieller Veröffentlichung fehlen reale bzw. finale Nachweise für:

- Hostingprovider
- getrennte HTTPS-Staging-/Production-Origin
- konkrete Betreiber-/Kontaktangaben
- Hosting-/Log-/Privacy-Abnahme
- Support-/Securitykontakt
- Incident-/Rollback-Drill
- finale Asset-/Rechtefreigabe
- finale Inhalts-/Alters-/Referenz-Abnahme
- reale Branch-Protection-/Required-Check-Abnahme

Die verbindlichen Freigabekriterien stehen in `release-meta.json`, `RELEASE_CHECKLIST.md`, `RELEASE_STATUS.md` und `release-evidence.json`.

**Aktuell: öffentliche Freigabe NO_GO.**
