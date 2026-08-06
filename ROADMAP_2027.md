# Secret Circle – Releasefahrplan bis Januar 2027

Stand: 6. August 2026

## Verbindliches Ziel

- **Funktionsfertig:** spätestens 30. November 2026
- **Code Freeze:** 5. Dezember 2026
- **Release Candidate:** spätestens 15. Dezember 2026
- **Öffentlicher Release:** 4.–15. Januar 2027

Neue Funktionen nach dem Code Freeze dürfen den Release nicht gefährden. Ab Dezember werden nur noch Fehler, Inhalte, Barrierefreiheit, Performance, Gerätekompatibilität und rechtlich notwendige Angaben bearbeitet.

## Produktprinzipien

Secret Circle wird nicht durch möglichst viele sichtbare Modi perfekt, sondern durch:

1. einfache Bedienung ohne Erklärung durch den Entwickler,
2. zuverlässige Offline-Nutzung,
3. faire und sichere geheime Rollen,
4. hochwertige, abwechslungsreiche Inhalte,
5. klare Trennung zwischen fertigen Spielen und experimentellen Modi,
6. schnelle Wiederaufnahme nach Unterbrechungen,
7. vollständige Kontrolle über lokale Daten,
8. gute Nutzbarkeit auf kleinen Smartphones und großen Gruppen,
9. echte Tests mit Menschen statt nur technisch startbaren Seiten,
10. einen reproduzierbaren und dokumentierten Releaseprozess.

## August 2026 – technische Grundlage

### Repository und Release

- [x] separaten Release-Foundation-Branch erstellen
- [x] Offline-Navigation mit Query-Parametern reparieren
- [x] Service-Worker-Regressionstest ergänzen
- [ ] GitHub-Actions-Runner wieder funktionsfähig machen
- [ ] geschützte stabile Releasebasis festlegen
- [ ] Branch Protection und verpflichtende Checks aktivieren
- [ ] veralteten `main`-Stand nicht mehr als Produktstand behandeln
- [ ] PR #11 in überprüfbare Themenbereiche zerlegen oder kontrolliert konsolidieren
- [ ] Release- und Hotfix-Branchstrategie dokumentieren

### Kerntechnik

- [x] unabhängige Rollenverteilung direkt in die Word-Imposter-Engine integrieren
- [x] Runtime-Patching der Engine entfernen
- [ ] alle Speicherformate und Migrationen inventarisieren
- [ ] ein zentrales Backup-Schemaregister einführen
- [ ] UTF-8-Bytegrenzen für alle Importwege vereinheitlichen
- [x] Creator-Zeitstempel korrigieren
- [ ] wiederholte Sessionabschlüsse in allen Engines verhindern
- [ ] PWA-Updatefluss mit sichtbarer neuer-Version-Meldung ergänzen

## September 2026 – Bedienung und Kernspiele

### Party Hub

- [ ] Navigation und Informationsarchitektur mit echten Nutzern testen
- [ ] Startseite auf drei klare Hauptaktionen reduzieren
- [ ] Filterzustand und zuletzt verwendete Ansicht speichern
- [ ] Spielkarten visuell vereinheitlichen
- [ ] fertige, Beta- und experimentelle Spiele eindeutig kennzeichnen
- [ ] Suchbegriffe, Synonyme und Tippfehler besser unterstützen
- [ ] gemeinsame Spielerlobby in alle kompatiblen Spiele integrieren
- [ ] verständliche leere Zustände und Fehlermeldungen prüfen

### Kernspiele

- [ ] Release-Kernspiele aus `RELEASE_SCOPE_2027.md` vollständig prüfen
- [ ] Regeln jeder Runde vor dem Start in höchstens vier Schritten erklären
- [ ] Überspringen, Pause, Abbruch, Wiederholen und nächstes Spiel vereinheitlichen
- [ ] Wartezeiten und Übergaben bei großen Gruppen reduzieren
- [ ] Punkte und Siegerlogik pro Spiel dokumentieren
- [ ] Timer über Hintergrund, Sperrbildschirm und Neuladen korrekt fortsetzen

## Oktober 2026 – Inhalte, Creator und Design

### Inhalte

- [ ] jedes Release-Spiel redaktionell prüfen
- [ ] doppelte, schwache und missverständliche Karten entfernen
- [ ] Altersstufen und sensible Inhalte konsistent kennzeichnen
- [ ] familienfreundliche Standardauswahl definieren
- [ ] mindestens drei hochwertige Packs pro Kernspiel bereitstellen
- [ ] Überspringen bei persönlichen oder unangenehmen Fragen immer ermöglichen
- [ ] Fan-, Marken- und urheberrechtlich sensible Inhalte separieren

### Game Creator

- [ ] Wizard auf Mobilgeräten vollständig testen
- [ ] automatische Entwurfswiederherstellung ergänzen
- [ ] strukturierte Fehlermeldungen direkt am betroffenen Feld anzeigen
- [ ] Importkonflikte transparent auflösen
- [ ] Vorschau und tatsächlichen Spielablauf angleichen
- [ ] Creator-Spiele in Backup, Verlauf und Statistik vollständig testen
- [ ] sichere Vorlagen und Beispielinhalte verbessern

### Design

- [ ] eigenes Iconsystem statt überwiegend Emojis erstellen
- [ ] einheitliche Illustrationen für Kernspiele produzieren
- [ ] reduzierte, schnelle Übergangsanimationen ergänzen
- [ ] Dark Mode, Kontrast und Reduced Motion prüfen
- [ ] Touchziele, Safe Areas und Bildschirmtastatur auf iOS prüfen

## November 2026 – Qualität und reale Tests

### Automatisierte Qualität

- [ ] vollständiges `npm run ci` grün dokumentieren
- [ ] Chromium, Firefox und WebKit grün dokumentieren
- [ ] beschädigte Daten, Quota, Rollback und Importgrenzen testen
- [ ] alle Query-Routen offline testen
- [ ] Service-Worker-Update von mindestens zwei älteren Cacheversionen testen
- [ ] Accessibility-E2E mit Axe oder gleichwertiger Prüfung ergänzen
- [ ] Performancebudget für Erststart und Offline-Core einhalten

### Reale Geräte

- [ ] aktuelles Android mit Chrome
- [ ] aktuelles iPhone mit Safari
- [ ] iPad oder vergleichbares Tablet
- [ ] installierte PWA und normaler Browser-Tab
- [ ] Offline-Neustart
- [ ] Rotation und kleine Displays
- [ ] App-Wechsel und Sperrbildschirm
- [ ] Bildschirmleser und Tastaturnutzung

### Gruppentests

- [ ] 3–4 Personen
- [ ] 5–8 Personen
- [ ] 9–12 Personen
- [ ] mindestens ein großer Test mit mehreren Impostern
- [ ] mindestens drei vollständige Smart-Party-Night-Abende
- [ ] Creator-Spiel mit unerfahrenen Nutzern erstellen und spielen lassen
- [ ] Feedback nach Schweregrad und Wiederholbarkeit dokumentieren

## Dezember 2026 – Release Candidate

### Code Freeze ab 5. Dezember

Erlaubt sind nur:

- kritische und hohe Fehlerkorrekturen,
- Inhaltskorrekturen,
- Accessibility-Korrekturen,
- Performance- und PWA-Korrekturen,
- Rechts-, Datenschutz- und Storeangaben,
- Releaseautomatisierung.

### Release Candidate bis 15. Dezember

- [ ] finale Versionsnummer und Cacheversion
- [ ] finale Icons und Screenshots
- [ ] Datenschutzerklärung
- [ ] Impressum beziehungsweise notwendige Betreiberangaben
- [ ] Support- und Sicherheitskontakt
- [ ] Lizenz und Drittanbieterhinweise
- [ ] vollständiger Changelog
- [ ] Deployment- und Rollbacktest
- [ ] signierte Release-Checkliste mit Commit und Testgeräten
- [ ] keine offenen kritischen oder hohen Fehler

## Januar 2027 – Veröffentlichung

### Releasefenster 4.–15. Januar

- [ ] Produktionsdeployment auf HTTPS
- [ ] Installation und Offlinebetrieb nach Deployment erneut testen
- [ ] Release-Tag und unveränderlichen Commit erstellen
- [ ] öffentliche Release Notes veröffentlichen
- [ ] Supportkanal überwachen
- [ ] Hotfixprozess bereithalten

## Releaseverbote

Secret Circle wird nicht öffentlich veröffentlicht, wenn mindestens einer dieser Punkte zutrifft:

- Imposterrollen können aus der Kartenreihenfolge abgeleitet werden.
- GitHub Actions führt keine sichtbaren Schritte aus.
- Kern-CI oder Cross-Browser-Tests sind rot.
- Offline-Start oder PWA-Update scheitert auf einem Zielgerät.
- kritische oder hohe Fehler sind offen.
- notwendige Betreiber-, Datenschutz- oder Lizenzangaben fehlen.
- Kernspiele wurden nicht mit realen Gruppen getestet.
- Import oder Löschung kann lokale Daten ohne funktionierenden Rollback zerstören.

## Nach dem Release

Die vollständige 122-Modi-Vision bleibt bestehen, wird aber nach Qualität priorisiert. Neue Modi werden nach Januar 2027 nur ergänzt, wenn sie eine neue Mechanikfamilie, hochwertige Inhalte, reale Tests und einen klaren Nutzen besitzen.
