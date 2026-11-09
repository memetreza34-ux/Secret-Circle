# Release-Status – Secret Circle

Stand: 9. November 2026

**Öffentliche Freigabe: NO_GO.** Die App umfasst alle 55 vorhandenen Spiele (15 Core / 13 Extended / 27 Labs). Die Stufen verkleinern den V1-Abnahmeumfang nicht.

## Tatsächlich geprüfter Integrationsstand

- Package `1.0.0-beta.3`, Offline-Core `secret-circle-v111` / `secret-circle-v111-staging`.
- [PR #69](https://github.com/memetreza34-ux/Secret-Circle/pull/69): 55 lokale Spielbilder, vollständige Bildflächen, Einstieg und Ergebnisdarstellung; finale Bildabnahme offen.
- [PR #70](https://github.com/memetreza34-ux/Secret-Circle/pull/70), Commit `f9a8fcc54fda5640ad3edac4f1118cb34ec3f9e5`: alle 55 Spielabläufe bis Abschluss und erneute vollständige Partie, wieder verdeckte Geheimnisse, Doppeltippschutz und 28 korrigierte Hilfswörter.
- Pflichtchecks auf diesem Commit: `validate`, `e2e-webkit`, `smoke` bestanden. Chromium 921, WebKit 842 und Smoke 40 Fälle bestanden; keine Fehler oder Wiederholungen. 175 vorgesehene Auslassungen bleiben sichtbar.
- Lokale Chromium-Probe mit echten v109-/v111-Dateien: kontrolliertes Update erhält Partie und Spielerliste; Geheimnis beim Fortsetzen verdeckt, anschließend auch offline unverändert aufdeckbar.
- Beide PRs sind noch Draft und nicht nach `main` integriert. Automatisierte Browserprofile sind keine reale Handy-/Gruppenabnahme.

## Aktuell vorbereitete technische Veröffentlichungsstrecke

- Export eines festen Git-Commits nach `dist/site` und `release/secret-circle.zip`; nur freigegebene App-Dateien, keine internen Dokumente oder Betreiber-/Releasevorlagen.
- `release-build.json` bindet das Paket an Commit, Offline-Core und jede Dateiprüfsumme. Lokale Änderungen oder fremde Dateien werden nicht stillschweigend veröffentlicht.
- CI prüft das Paket und legt ein Artefakt ab. Der spätere manuelle HTTPS-Workflow prüft Origin, Sicherheitsheader, Commit und ausgelieferte Bytes und führt kein Deployment aus.
- Dauerhafte Browserprüfungen von zwei älteren Git-Ständen, Offline-Fortsetzen sowie fehlgeschlagene Installation mit erneutem Versuch.

Diese neuen Vorbereitungen benötigen ihre eigene vollständige CI auf ihrem unveränderten Commit. Der PASS von PR #70 wird nicht auf spätere Änderungen übertragen.

## Vor öffentlicher Veröffentlichung noch erforderlich

- Unabhängiges Review, Integration der geprüften PRs und Festlegung eines unveränderten RC mit Commit/Tag.
- Tatsächlicher Hostinganbieter, getrennte HTTPS-Staging-/Production-Origin, Netzwerk-Smoke und Rollback-Drill.
- Echte Android-, iPhone-/Home-Screen-PWA- und Tablet-Prüfungen einschließlich Cold Resume, VoiceOver/TalkBack und real installierten Updates.
- Echte Gruppe für alle 55 Spiele, finale Bild-/Rechteabnahme sowie später die echten Betreiber-, Kontakt-, Impressums- und Datenschutzangaben.

`release-evidence.json` und `operator-release.json` bleiben die maschinenlesbaren Freigabequellen. Ihre realen offenen Felder werden nicht durch erfundene Angaben oder simulierte PASS-Markierungen ersetzt. Ältere v64-/PR-#13-/PR-#15-Abläufe sind historisch; maßgeblich sind die hier verlinkten aktuellen Nachweise und der Projektkompass.
