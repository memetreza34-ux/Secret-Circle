# Bekannte Einschränkungen

Diese Punkte sind bewusst dokumentierte Grenzen des aktuellen Party-Hub-Beta-Stands.

## Produktmodell

- Secret Circle ist ein lokaler Pass-and-Play-Party-Hub auf einem gemeinsam genutzten Gerät.
- Es gibt noch keinen Online-Mehrspielermodus, keine Raumcodes, keine Konten und keine Synchronisierung zwischen Geräten.
- Spielende müssen das Gerät bei geheimen Rollen, Fragen und Karten physisch abschirmen und weitergeben.
- Hub-Spieler und Word-Imposter-Spielerlisten sind getrennte Einrichtungsbereiche.
- Daten werden ausschließlich im Browser-Speicher des jeweiligen Geräts gespeichert.
- Gelöschte Daten können nur aus einer vorher exportierten Sicherung wiederhergestellt werden.

## Spiele

- 18 Spiele sind technisch spielbar, aber noch nicht vollständig mit echten Gruppen und Geräten geprüft.
- Wellenlänge, Zeichnen & Raten, Schnellfeuer und Geräusche erraten sind sichtbar geplant und absichtlich nicht startbar.
- Zwei Wahrheiten, eine Lüge benötigt persönliche Eingaben der aktiven Person.
- Question Imposter verwendet vorbereitete ähnliche Fragen; Inhaltstiefe und Schwierigkeit werden weiter ausgebaut.
- Location Spy verwendet feste Ortslisten und noch keine individuellen Rollen je Ort.
- Mafia ist ein lokaler Moderator-Modus ohne Audio-Erzählung und ohne komplexe Sonderrollen.
- einfache Hub-Spiele besitzen bewusst leichte Punkte- und Verlaufslogik.
- Word Imposter beendet eine Runde nach Entdeckung eines Imposters und deckt danach alle Imposter auf.

## Aktive komplexe Sessions

- Es kann immer nur eine komplexe Session gleichzeitig aktiv gespeichert werden.
- Eine Session speichert ihre Spielergruppe als Snapshot. Änderungen an der gemeinsamen Lobby wirken erst auf eine neue Session.
- Alte aktive Daten ohne Spieler-Snapshot werden bestmöglich migriert; unklare oder ungültige Daten werden verworfen.
- Wird ein verwendetes Pack gelöscht, kann die zugehörige aktive Session nicht fortgesetzt werden.
- Bei einem lokalen Speicherfehler bleibt die Session aktiv, aber der Nutzer muss den Abschluss später erneut versuchen.
- Sessiondaten liegen unverschlüsselt im lokalen Browser-Speicher.
- Ein absichtlich veränderter lokaler Datensatz kann verworfen werden; Manipulationsschutz gegen den Gerätebesitzer ist nicht das Ziel.

## Eigene Hub-Packs

- Eigene Hub-Packs unterstützen derzeit nur kompatible Prompt-, Paranoia-, Scharade-, Heiße-Kartoffel- und Wortketten-Modi.
- Strukturierte Spiele wie Mafia, Question Imposter, Entweder oder und Nicht sagen! benötigen spezielle Datenformen und sind nicht im allgemeinen Editor verfügbar.
- Pro Gerät sind maximal 20 Packs mit jeweils maximal 100 Karten vorgesehen.
- Eigene Packs werden nicht zwischen Geräten synchronisiert.
- Nutzer sind für Inhalt, Rechte, Eignung und Altersstufe ihrer selbst erstellten Karten verantwortlich.
- Die Gesamtsicherung ist unverschlüsselt und enthält eigene Packtexte im Klartext.

## Inhalte und Altersstufen

- Der Hub enthält eine große erste Inhaltsbasis, aber nicht jedes Spiel besitzt gleich viele Karten.
- Altersstufen sind technische Filter und keine rechtliche Altersfreigabe.
- Vor einem öffentlichen Release ist eine vollständige redaktionelle Prüfung auf Dopplungen, Missverständnisse und ungeeignete Inhalte erforderlich.
- Es gibt noch keine separat freischaltbaren Erwachsenen-Packs.

## Verlauf, Statistik und Erfolge

- Es gibt keine Cloud-Rangliste oder geräteübergreifende Statistik.
- Erfolge werden aus lokalem Verlauf, Favoriten und Presets berechnet.
- Wird der Verlauf gelöscht, können daraus abgeleitete Erfolge wieder als gesperrt erscheinen.
- Reparaturfunktionen können ältere zu niedrige Statistikwerte erhöhen, reduzieren aber bewusst keine bereits höheren Werte.
- Aktive einfache Hub-Sessions werden nicht so detailliert wiederaufgenommen wie komplexe Spiele und Word Imposter.

## Installation und Offline-Betrieb

- Die App muss einmal vollständig online geladen werden, bevor Cache `secret-circle-v23` alle Kernressourcen offline bereitstellt.
- Service Worker und Installation funktionieren nur über HTTPS oder `localhost`.
- Auf iPhone und iPad erfolgt die Installation über „Zum Home-Bildschirm“.
- Browser und Betriebssystem können lokalen Speicher bei Speicherdruck entfernen.
- Hintergrundbenachrichtigungen, Systemwecker und Push-Nachrichten sind nicht Bestandteil der Beta.
- Der Update-Pfad auf `secret-circle-v23` ist automatisiert vorbereitet, aber noch nicht auf realen Geräten bestätigt.

## Geräte und Browser

- Playwright simuliert Chromium, Firefox, WebKit, Android und iPhone, ersetzt aber keine realen Geräteprüfungen.
- Safari, Rotation, Sperrbildschirm, Energiesparmodus und Bildschirmtastatur müssen vor Release manuell geprüft werden.
- Vibration und Wake Lock sind nur verfügbar, wenn Browser und Gerät die jeweilige API unterstützen.
- Mafia und lange Gruppenrunden können auf kleinen Displays zusätzliches Scrollen erfordern.

## Sicherung und Datenschutz

- Die Gesamtsicherung ist eine unverschlüsselte JSON-Datei.
- Wer die Datei erhält, kann gespeicherte Namen, Verläufe, Sessions und eigene Karten lesen.
- Es gibt keine automatische Cloud-Sicherung.
- Secret Circle verwendet keine Anmeldung, Analyse-, Werbe- oder Tracking-Dienste.
- Statische App-Dateien werden beim ersten Laden und bei Updates vom Hosting-Anbieter abgerufen.

## Veröffentlichung

- GitHub Actions muss auf dem endgültigen Commit echte Schritte ausführen und grün enden.
- Der vollständige lokale Unit-, Validator-, E2E- und Cross-Browser-Lauf muss dokumentiert werden.
- Reale Android-, iPhone-/iPad-, PWA-Update- und Partytests fehlen noch.
- Vor öffentlicher oder kommerzieller Veröffentlichung müssen Verantwortlicher, Kontakt, Hosting-Anbieter und gegebenenfalls Impressum ergänzt werden.

Die verbindlichen Freigabekriterien stehen in `RELEASE_CHECKLIST.md`.
