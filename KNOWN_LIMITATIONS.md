# Bekannte Einschränkungen

Stand: `1.0.0-beta.3`, 45 eingebaute Spiele, lokaler Creator und Offline-Core `secret-circle-v30`.

## Gemeinsames Gerät

Secret Circle ist derzeit lokales Pass-and-Play. Es gibt keine Raumcodes, Konten, privaten Rollen auf persönlichen Handys oder geräteübergreifende Synchronisierung. Geheime Karten müssen physisch abgeschirmt werden.

## Automatisierter Teststatus

Unit-, E2E-, Offline-, Sicherheits-, Accessibility- und Cross-Browser-Prüfungen sind vorbereitet. Ein vollständiger aktueller Gesamtlauf ist noch nicht grün dokumentiert. GitHub Actions weist dem Workflow derzeit keinen Runner zu und beendet Jobs vor Checkout beziehungsweise sichtbaren Repository-Schritten.

## 45 eingebaute Spiele

Alle eingebauten Spiele sind technisch startbar. Sie sind aber noch nicht vollständig mit realen Gruppen auf Verständlichkeit, Balance, Wartezeit, Wiederholungswert, sozialen Druck und Alterseignung geprüft.

Zeichnen & Raten besitzt noch keine integrierte Canvas-Zeichenfläche. Geräusche- und Melodie-Modi verwenden menschliche Darstellung und liefern keine geschützten Aufnahmen oder Liedtexte.

## Game-Creator

Der Creator unterstützt sechs Vorlagen: Fragen, Auswahl, Erraten, Challenges, Story und Debatte. Strukturierte Rollen-, Preis-, Zahlen-, Buzzer-, Tabu-, Spektrum- und komplexe Abstimmungsspiele benötigen spätere spezialisierte Editoren.

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

## Timer und Neuladen

Direkte Hub-Sessions besitzen jetzt einen versionierten lokalen Active-State. Scharade, Heiße Kartoffel und Wortkette speichern ihre aktuelle Restzeit; nach einem vollständigen Reload werden diese Timer bewusst **pausiert** wiederhergestellt und laufen erst nach „Fortsetzen“ weiter. Heiße Kartoffel zeigt ihre zufällige Restzeit weiterhin nicht an.

Private direkte Hub-Inhalte werden nach Reload nicht automatisch geöffnet. Paranoia kehrt beispielsweise zum verdeckten Schritt zurück.

Für andere Enginefamilien gelten deren jeweilige bestehende Resume-Verträge. Der reale Sperrbildschirm-/OS-Hintergrundpfad ist noch nicht auf allen Zielgeräten dokumentiert und bleibt deshalb ein Geräte-Release-Gate.

## Smart Party Night

Der Planer arbeitet lokal und heuristisch mit Spielerzahl, Dauer, Stimmung, Altersstufe, Favoriten und Verlauf. Empfehlungen sind keine Garantie für den Geschmack der Gruppe. Zeitangaben sind Näherungen.

## Anime- und Fan-Inhalte

Das Anime-Quiz ist textbasiert und inoffiziell. Es enthält keine fremden Bilder, Logos, Videos, Audios oder Zitate. Allgemein bekannte Figurennamen benötigen vor öffentlicher oder kommerzieller Veröffentlichung eine gesonderte rechtliche und redaktionelle Prüfung.

## Geld und Preise

Geld-Challenges sind hypothetisch. „Preis schätzen“ verwendet feste Spielwerte und keine aktuellen Händler- oder Marktdaten. Die Werte eignen sich nicht für Kaufentscheidungen.

## Persönliche Fragen

Finger runter, Hot Seat, Wer kennt mich am besten?, Pass das Handy und ähnliche Modi können persönliche Situationen berühren. Überspringen ist vorgesehen. Komfort und Gruppendruck müssen real getestet werden.

## Bilder, Icons und Animationen

Das technische Icon- und Akzentsystem ist vorbereitet. Die endgültigen eigenständigen Illustrationen, SVG-Icons, Kartenhintergründe und Motion-Übergänge sind noch nicht produziert. `ASSET_PLAN.md` dokumentiert Reihenfolge und Budgets.

## Offline und PWA

Die App muss einmal vollständig online geladen werden. Service Worker und Installation benötigen HTTPS oder `localhost`. Der kontrollierte Update-Pfad mit Staging-Cache ist automatisiert vorbereitet, aber noch nicht auf realen Android- und iOS-Geräten dokumentiert.

Browser oder Betriebssystem können lokalen Speicher bei Speicherdruck entfernen. Wichtige eigene Spiele und Packs sollten exportiert werden.

## Backup

Gesamtsicherungen und Creator-Exporte sind unverschlüsselte JSON-Dateien. Wer die Datei erhält, kann gespeicherte Namen, eigene Inhalte, Einstellungen und Sessions lesen. Es gibt keine automatische Cloud-Sicherung.

## Rechtliche Veröffentlichung

Vor öffentlicher oder kommerzieller Veröffentlichung fehlen konkrete Betreiber-, Kontakt-, Hosting- und gegebenenfalls Impressumsangaben sowie die abschließende Inhalts-, Fan-Content- und Altersprüfung.

Die verbindlichen Freigabekriterien stehen in `RELEASE_CHECKLIST.md`.
