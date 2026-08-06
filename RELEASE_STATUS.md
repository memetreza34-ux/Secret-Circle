# Secret Circle Party Hub – Release-Status

6. August 2026 · `1.0.0-beta.3` · Draft-PR #11

## Umfang

- 45 eingebaute technisch spielbare Spiele
- 27 Quick-, Trend- und Viral-Modi
- 4 Advanced-Spiele
- Smart Party Night
- lokaler No-Code-Game-Creator mit 6 Vorlagen
- bis zu 40 selbst erstellte Spiele
- eigene wiederaufnehmbare Creator-Spielengine
- Offline-Core `secret-circle-v30`

## Neu abgeschlossen

- vereinfachter Drei-Schritte-Einstieg im Party Hub
- kurze Hilfen für Start, Katalog, Spieler, Favoriten, Verlauf, Daten und Creator
- verständlichere Spielkarten und Aktionsbeschriftungen
- „Kurz erklärt“-Block in Spieldetails
- erster-Besuch-Onboarding
- eigener Creator-Bereich mit Live-Vorschau
- Fragen-, Auswahl-, Erraten-, Challenge-, Story- und Debattenvorlagen
- mehrere Kategorien je eigenem Spiel
- Bearbeiten, Kopieren, Löschen, Exportieren und Importieren
- eigene Spiele erscheinen im normalen Hub-Katalog
- eigene Spiele laufen über eine dedizierte 3-/5-/10-/20-Runden-Engine
- Wiederaufnahme, Spieler-Snapshot, Punkte, Verlauf und Statistik für Creator-Spiele
- geschützte Begriffsansicht für eigene Erratenspiele
- Icon- und Akzentsystem als Vorbereitung für Bilder und Animationen
- vollständiger Asset- und Motion-Produktionsplan
- Creator, Hilfesystem und Creator-Spielengine vollständig in Offline-Core v30 aufgenommen

## Fortschritt

| Bereich | Stand |
|---|---:|
| Word Imposter | 98 % |
| Party-Hub-Grundstruktur | 98 % |
| Bedienbarkeit und Erklärungen | 94 % |
| 45 eingebaute Spiele | 86 % |
| No-Code-Game-Creator | 89 % |
| Creator-Spielengine | 87 % |
| eigene Packs und Spiele | 96 % |
| Quick-/Trend-/Viral-Engines | 89 % |
| Advanced-Spiele | 88 % |
| Speicherung und Backup | 98 % |
| PWA und Offline | 97 % |
| Accessibility und Mobile | 93 % |
| visuelles Asset-System geplant | 88 % |
| Bilder und Animationen produziert | 5 % |
| automatisierte Testvorbereitung | 99 % |
| reale Testbereitschaft | 90 % |
| öffentlicher Release | 79 % |
| vollständige 122-Modi-Vision funktional | 47 % |

Die Prozentwerte bewerten Implementierung und Vorbereitung. Sie ersetzen keinen bestandenen Testlauf.

## Blocker

1. endgültiger `npm run ci`-Lauf nicht grün dokumentiert
2. Cross-Browser-Lauf nicht grün dokumentiert
3. GitHub Actions scheitert weiterhin vor sichtbaren Workflow-Schritten
4. Creator-Flows und eigene Spiele auf echten Android-/iOS-Geräten ungeprüft
5. PWA-Update auf `secret-circle-v30` nicht praktisch dokumentiert
6. reale Gruppenprüfung aller 45 eingebauten Spiele fehlt
7. selbst erstellte Spiele benötigen reale Usability-Tests
8. Icons, Illustrationen und Animationen sind noch nicht produziert
9. Inhalts-, Alters-, Fan-Content- und Rechtsprüfung fehlt

## Entscheidung

- vollständiger automatisierter Testlauf: `GO`
- kontrollierter Entwickler-Browsertest: `GO_WITH_CONDITIONS`
- realer Geräte-/Party-Betatest: `NO_GO` bis grüne automatisierte Läufe
- Merge von PR #11: `NO_GO` bis grüne Kernprüfungen
- öffentlicher Produktionsrelease: `NO_GO`
