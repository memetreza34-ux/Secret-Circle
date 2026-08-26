# Bekannte Einschränkungen

Stand: 26. August 2026 – `1.0.0-beta.3`, 45 eingebaute Spiele, lokaler Creator und Offline-Core **`secret-circle-v51` / `secret-circle-v51-staging`**.

## Gemeinsames Gerät

Secret Circle ist derzeit lokales Pass-and-Play. Es gibt keine Raumcodes, Konten, privaten Rollen auf persönlichen Handys oder geräteübergreifende Synchronisierung. Geheime Karten müssen physisch abgeschirmt werden. Die App reduziert unbeabsichtigtes Mitlesen, kann absichtliches Schulterblicken oder DevTools-Zugriff des Gerätebesitzers nicht verhindern.

## Automatisierter Teststatus

Unit-, E2E-, Offline-, Sicherheits-, Accessibility- und Cross-Browser-Prüfungen sind umfangreich vorbereitet. Ein vollständiger aktueller Gesamtlauf ist **nicht grün dokumentiert**. GitHub Actions beendet die untersuchten Jobs vor Checkout bzw. sichtbaren Repository-Schritten (`steps: []`).

Historisch letzter vollständig untersuchter App-Lauf: Run #2787 auf v49. **v50 und v51 besitzen keinen Runner-PASS.**

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

Direkte Hub-Sessions besitzen einen versionierten lokalen Active-State. Scharade, Tabu, Heiße Kartoffel und Wortkette sichern die relevante Restzeit; nach einem vollständigen Reload werden laufende Timer bewusst **pausiert** wiederhergestellt und laufen erst nach „Fortsetzen“ weiter. Heiße Kartoffel zeigt ihre zufällige Restzeit weiterhin nicht an.

Private direkte Hub-Inhalte werden nach Reload nicht automatisch geöffnet. Paranoia kehrt beispielsweise zum verdeckten Schritt zurück.

Der zentrale Hub Resume Guard v2 prüft gespeicherte Timer-/Sessionzustände. Seit v50 bleibt eine bereits sichtbare Resume-Fläche während der Guard-Lade-/Validierungsphase fail-closed gesperrt. Reale Browser-/Geräte-Evidence dafür bleibt offen.

Für andere Enginefamilien gelten deren jeweilige Resume-Verträge. Der reale Sperrbildschirm-/OS-Hintergrundpfad ist noch nicht auf allen Zielgeräten dokumentiert und bleibt deshalb ein Geräte-Release-Gate.

## Smart Party Night

Der Planer arbeitet lokal und heuristisch mit Spielerzahl, Dauer, Stimmung, Altersstufe, Favoriten und Verlauf. Empfehlungen sind keine Garantie für den Geschmack der Gruppe. Zeitangaben sind Näherungen.

## Anime- und Fan-Inhalte

Konkrete unnötige Fan-/Markenreferenzen wurden quellsseitig stark reduziert. Das ersetzt keine finale manuelle/rechtliche Abnahme von sichtbaren Inhalten, Assets und Marketing. Fremde Logos, Bilder, Videos, Audios und längere Zitate sind für den V1-Core nicht vorgesehen.

## Geld und Preise

Geld-Challenges sind hypothetisch. „Preis schätzen“ verwendet feste Spielwerte und keine aktuellen Händler- oder Marktdaten. Die Werte eignen sich nicht für Kaufentscheidungen.

## Persönliche Fragen

Finger runter, Hot Seat, Wer kennt mich am besten?, Pass das Handy und ähnliche Modi können persönliche Situationen berühren. Überspringen ist vorgesehen. Komfort und Gruppendruck müssen real getestet werden.

## Bilder, Icons und Animationen

Das technische Icon- und Akzentsystem ist vorbereitet. Die endgültigen eigenständigen Illustrationen, SVG-Icons, Kartenhintergründe und Motion-Übergänge sind noch nicht vollständig produziert bzw. final abgenommen. Die Rechtebasis des Root-`icon.svg` bleibt `unresolved`; dadurch bleibt das Asset-/Third-Party-Releasegate offen.

## Offline und PWA

Die App muss einmal vollständig online geladen werden. Service Worker und Installation benötigen HTTPS oder `localhost`. Der kontrollierte Update-Pfad mit Staging-Cache ist source-seitig vorbereitet, aber noch nicht auf realen Android-/iOS-Geräten und nicht als Alt→v51/RC→Rollback-Evidence dokumentiert.

Browser oder Betriebssystem können lokalen Speicher bei Speicherdruck entfernen. Wichtige eigene Spiele und Packs sollten exportiert werden.

## Backup / Restore – v51

Gesamtsicherungen und Creator-Exporte sind **unverschlüsselte JSON-Dateien**. Wer die Datei erhält, kann darin gespeicherte Namen, eigene Inhalte, Einstellungen und Sessions lesen. Es gibt keine automatische Cloud-Sicherung.

Der heutige Complete-Restore besitzt nur 16 explizit registrierte aktuelle Storage-Keys. Unbekannte Namespaces und zukünftige Storage-Versionen werden nicht importiert und bei einem Restore nicht gelöscht. Managed Werte werden vor Mutation auf JSON, Root-Typ, aktuelle Storage-Version und minimale Pflichtstruktur geprüft. Schreibfehler sollen den vorherigen managed Zustand wiederherstellen.

Einschränkungen:

- dies ist **keine Verschlüsselung** und kein Schutz vor dem Gerätebesitzer
- zukünftige Daten werden absichtlich nicht automatisch von einer älteren Runtime verstanden oder migriert
- die Source-/E2E-Verträge sind vorhanden, aber BK51 wurde noch nicht auf echten Browsern/PWA/Quota-Pfaden als Release-Evidence ausgeführt
- ein Browser kann localStorage unabhängig von der App löschen
- ausdrücklich bestätigtes „Alle lokalen Daten löschen“ entfernt bewusst auch unbekannte/future `secret-circle-*`-Daten

## Accessibility

Hub sowie Advanced/Quick/Creator besitzen quellsseitige Fokus-/Modal-/Tastatur-Schutzschichten. **Noch kein Accessibility PASS:** VoiceOver, TalkBack, 200-%-Zoom, große Systemschrift, Touch und reale Zielgeräte müssen noch abgenommen werden.

## Hosting / Betrieb / Rechtliche Veröffentlichung

Vor öffentlicher oder kommerzieller Veröffentlichung fehlen noch reale bzw. finale Nachweise für:

- Hostingprovider
- getrennte HTTPS-Staging-/Production-Origin
- konkrete Betreiber-/Kontaktangaben
- Hosting-/Log-/Privacy-Abnahme
- Support-/Securitykontakt
- Incident-/Rollback-Drill
- finale Asset-/Rechtefreigabe
- finale Inhalts-/Alters-/Fan-Content-Abnahme

Die verbindlichen Freigabekriterien stehen in `RELEASE_CHECKLIST.md`, `RELEASE_STATUS.md` und `release-evidence.json`.

**Aktuell: öffentliche Freigabe NO_GO.**