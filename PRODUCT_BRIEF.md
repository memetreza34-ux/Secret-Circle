# Secret Circle – Product Brief

Stand: 16. August 2026

## 1. Produkt in einem Satz

Secret Circle ist ein **offline-first Party-Hub für Gruppen auf einem gemeinsamen Gerät**, der hochwertige Kernspiele, sichere geheime Übergaben und Wiederaufnahme, einen lokalen Game Creator und kontrollierbare lokale Daten in einer konsistenten PWA verbindet.

## 2. Problem

Bei gemeinsamen Spieleabenden entstehen wiederkehrende Reibungen:

- verschiedene Spiele benötigen unterschiedliche Apps oder Webseiten
- Regeln und Übergaben sind nicht immer sofort verständlich
- geheime Rollen oder private Fragen können bei Reload/Übergabe versehentlich sichtbar werden
- Spielstände, Timer und laufende Runden können bei Unterbrechungen verloren gehen
- große Kataloge wirken schnell unübersichtlich
- experimentelle oder schwächere Modi werden oft genauso präsentiert wie ausgereifte Kernspiele
- bei mehreren Spielen hintereinander müssen Gruppen häufig Spieler, Einstellungen oder Abläufe neu organisieren

Die aktuelle Marktanalyse zeigt zugleich: **Offlinebetrieb, kein Account und ein gemeinsames Gerät sind 2026 bereits bei mehreren Wettbewerbern vorhanden.** Diese Eigenschaften bleiben wichtige Produktgrundlagen, sind aber allein kein Alleinstellungsmerkmal.

Secret Circle soll deshalb nicht nur eine Sammlung von Spielen sein, sondern einen ganzen lokalen Spieleabend konsistent führen.

## 3. Primärer Nutzer

Eine reale Gruppe befindet sich gemeinsam an einem Ort und teilt mindestens ein Smartphone oder Tablet.

Typische Gruppen:

- Freundesgruppen
- Familien und gemischte Gruppen bei passenden Altersfiltern
- kleine Gruppen von 3–4 Personen
- mittlere Gruppen von 5–8 Personen
- größere Gruppen von 9–12 Personen

Die App muss auch von Personen verstanden werden, die sie noch nie benutzt haben.

## 4. Kernnutzen

Secret Circle soll ermöglichen:

1. App öffnen.
2. Gruppe/Spieler festlegen.
3. passendes Spiel auswählen.
4. Regeln und Optionen schnell verstehen.
5. gemeinsam spielen.
6. private Informationen sicher weitergeben.
7. nach Unterbrechung sicher fortsetzen.
8. anschließend wiederholen, ein anderes Spiel starten oder Verlauf ansehen.
9. bei Bedarf eigene Spiele erstellen und im selben Hub spielen.

Der Nutzer soll dafür weder ein Konto noch eine Internetverbindung während des eigentlichen Spieleabends benötigen, sofern die PWA zuvor korrekt geladen/installiert wurde.

## 5. Produktversprechen für Januar 2027

Der öffentliche Release verspricht nicht, dass jeder vorhandene Modus gleich ausgereift ist.

Stattdessen gilt:

- **15 Kernspiele** erhalten vollständige Releasepriorität.
- **13 Erweiterungen** bleiben spielbar, aber nachgeordnet.
- **17 Labs-Modi** sind sichtbar als experimentell gekennzeichnet.
- gemeinsame Plattformfunktionen wie Offlinebetrieb, Datenintegrität, Sessionabschluss, PWA-Update und Datenschutz müssen auch bei Erweiterungen/Labs stabil bleiben.

Die Qualitätsgrenze ist `RELEASE_CHECKLIST.md`.

## 6. Hauptfunktionen

### Releasekritisch

- Party Hub
- gemeinsamer lokaler Spielerpool
- 15 Kernspiele
- sichere geheime Rollen/Fragen
- Pack-/Spielauswahl
- Pause/Skip/Abbruch/Abschluss, wo passend
- genaue Session-/Verlaufs-/Statistiklogik
- Wiederaufnahme nach Reload, wo vorgesehen
- Offline-PWA
- kontrollierte PWA-Updates
- lokale Datensicherung/-löschung
- Accessibility der Kernflows

### Produktweit wichtig

- Favoriten
- Presets
- Verlauf
- Statistiken
- Suche und Filter
- Smart Party Night
- Game Creator
- eigene lokale Spiele

## 7. Nicht-Ziele für Januar 2027

Bewusst **nicht Releasevoraussetzung**:

- Online-Multiplayer
- Mehrgeräte-Synchronisation
- Benutzerkonten
- Cloudspeicherung
- Chat/Freundeslisten
- Backend
- Werbung
- Tracking/Analytics
- Abonnements
- In-App-Käufe
- native Veröffentlichung im Apple App Store
- native Veröffentlichung im Google Play Store
- KI-generierte Live-Inhalte
- Kamera-/Mikrofonmechaniken

Neue Funktionen aus dieser Liste benötigen vor Implementierung eine neue Produkt-, Architektur-, Datenschutz-, Security- und Releaseentscheidung.

## 8. Produktprinzipien

In dieser Reihenfolge priorisieren:

1. Verständlichkeit
2. Stabilität
3. Privatsphäre/geheime Inhalte
4. Datenintegrität
5. Gruppentauglichkeit
6. Offlinefähigkeit
7. Accessibility
8. Inhaltsqualität
9. Geschwindigkeit
10. Funktionsmenge

Mehr Spiele sind kein Erfolg, wenn Kernspiele unklar oder instabil sind.

## 9. Marktvalidierte Differenzierung

`MARKET_RESEARCH.md` zeigt direkte Überschneidungen mit aktuellen All-in-one-Party-Apps. Deshalb gilt:

### Baseline, nicht USP

Diese Punkte müssen Secret Circle gut erfüllen, dürfen aber nicht als alleiniger Wettbewerbsvorteil behandelt werden:

- offline
- kein verpflichtendes Konto
- ein gemeinsames Gerät
- mehrere Partyspiele in einer App

### Die eigentliche Differenzierung soll entstehen aus

#### 1. Einem echten Party-Hub

- Spielerpool über Spiele hinweg
- Favoriten, Presets und Filter
- Smart Party Night
- Verlauf/Statistik
- Replay und nächstes Spiel
- Core/Extended/Labs als transparente Reifestufen

#### 2. Sicherer Privatsphäre bei gemeinsamem Gerät

- bewusste Reveal-Schritte
- geheime Rollen/Fragen nach Reload wieder verdeckt
- sichere Geräteübergabe
- Rollenverteilung nicht aus Aufdeckreihenfolge ableitbar
- klare Abbruch-/Resume-Verträge

#### 3. Zuverlässiger Sessiontechnik

- stabile Session-IDs
- Exact-once-Abschluss
- pausierbare Timer
- Wiederaufnahme laufender Spiele
- kontrollierte PWA-Updates während aktiver Sessions

#### 4. Lokalem Game Creator

- eigene Spiele ohne Programmierung
- mehrere Mechanikvorlagen
- lokale Bibliothek
- Import/Export/Backup
- direkt im selben Hub spielbar

#### 5. Lokaler Datenkontrolle

- kein Cloudzwang
- versionierte lokale Daten
- Sicherung
- Wiederherstellung
- Löschung
- nachvollziehbare Offlinearchitektur

### Positionierungssatz

> **Secret Circle ist der lokale Party-Hub für einen ganzen Spieleabend: hochwertige Kernspiele, sichere geheime Übergaben, zuverlässige Wiederaufnahme, eigene Spiele und volle lokale Datenkontrolle – ohne Konto und ohne Cloudzwang.**

Diese Differenzierung muss mit realen Nutzern validiert werden. Ein technisches Feature ist erst dann ein Produktvorteil, wenn Nutzer es verstehen oder davon messbar profitieren.

## 10. Erfolgskriterien für Version 1

### Produkt

- neue Nutzer können den Kernflow ohne Entwicklerhilfe abschließen
- 15 Kernspiele bestehen ihre individuellen Abnahmekriterien
- kleine, mittlere und große Testgruppen können Sessions durchführen
- Nutzer verstehen Core/Extended/Labs
- Wechsel zwischen mehreren Spielen eines Abends ist schneller und konsistenter als einzelne Neu-Setups

### Qualität

- keine offenen kritischen oder hohen bekannten Releasefehler
- reproduzierbare CI vollständig grün
- Cross-Browser vollständig grün
- reale Zielgeräte geprüft
- Offline-/Update-/Resume-Verträge bestätigt

### UX/Accessibility

- Kernflows funktionieren auf kleinen Smartphones und Tablets
- Tastaturbedienung, Fokus, Zoom und Reduced Motion geprüft
- Screenreader-Smoke-Test durchgeführt

### Daten

- kein doppelter Sessionabschluss
- Datenmigrationen und Backups geprüft
- Import/Löschung besitzen sichere Fehlerpfade

### Inhalt/Recht

- Kerninhalte redaktionell geprüft
- Altersstufen konsistent
- sensible Inhalte überspringbar, wo nötig
- Rechte/Betreiber/Datenschutz/Support final

## 11. Monetarisierung

Für den Januar-2027-Release wird keine Monetarisierung eingebaut.

Eine spätere Monetarisierung wird nicht beiläufig ergänzt. Werbung, Premium, Abo oder Käufe benötigen ein eigenes Geschäftsmodell und erneute Prüfung von UX, Datenschutz, Recht, Storestrategie und Architektur.

## 12. Primäre Produktgefahren

Siehe `RISK_REGISTER.md`. Besonders releasekritisch sind aktuell:

- fehlender belastbarer CI-Runnernachweis
- reale Geräte-/Sperrbildschirmtests
- redaktionelle Inhalts-/Altersprüfung
- finale Accessibility
- reale Gruppentests
- finale Rechts-/Supportangaben
- reproduzierbare Dependency-Installation
- direkte Konkurrenz mit ähnlichem Offline/No-account/One-device-Angebot
- zu dünne Inhalte trotz großer Gesamtspielzahl
- PWA-Installationshürde gegenüber nativen Store-Apps

## 13. Releaseentscheidung

Eine Funktion ist nicht releasefähig, weil sie technisch startet. Secret Circle ist erst releasefähig, wenn **derselbe unveränderte Release-Commit** Produkt-, Technik-, Daten-, Security-, Accessibility-, Inhalts-, Geräte-, Rechts- und Gruppentest-Gates erfüllt.
