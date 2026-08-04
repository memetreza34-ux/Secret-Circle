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
- Zwei Wahrheiten, eine Lüge benötigt persönliche Eingaben.
- Question Imposter verwendet vorbereitete ähnliche Fragen.
- Location Spy verwendet feste Ortslisten und noch keine individuellen Rollen je Ort.
- Mafia ist ein lokaler Moderator-Modus ohne Audio-Erzählung und komplexe Sonderrollen.
- einfache Hub-Spiele besitzen bewusst leichte Punkte- und Verlaufslogik.

## Aktive komplexe Sessions

- Es kann immer nur eine komplexe Session gleichzeitig aktiv gespeichert werden.
- Eine Session speichert ihre Spielergruppe als Snapshot. Änderungen an der gemeinsamen Lobby wirken erst auf eine neue Session.
- alte aktive Daten ohne Snapshot werden bestmöglich migriert; unklare Daten werden verworfen.
- wird ein verwendetes Pack gelöscht, kann die zugehörige aktive Session nicht fortgesetzt werden.
- bei einem lokalen Speicherfehler bleibt die Session aktiv, aber der Abschluss muss später erneut versucht werden.
- Sessiondaten liegen unverschlüsselt im Browser-Speicher.

## Eigene Hub-Packs

- Eigene Hub-Packs unterstützen nur kompatible Prompt-, Paranoia-, Scharade-, Heiße-Kartoffel- und Wortketten-Modi.
- strukturierte Spiele wie Mafia, Question Imposter, Entweder oder und Nicht sagen! benötigen spezielle Datenformen.
- pro Gerät sind maximal 20 Packs mit jeweils maximal 100 Karten vorgesehen.
- Eigene Hub-Packs werden nicht zwischen Geräten synchronisiert.
- Nutzer sind für Inhalt, Rechte, Eignung und Altersstufe ihrer Karten verantwortlich.
- Speichern und Löschen besitzt Rollback, kann aber bei einem vollständig ausgefallenen Browser-Speicher keine dauerhafte Änderung vornehmen.

## Gesamtsicherung

- Die Gesamtsicherung ist eine unverschlüsselte JSON-Datei.
- Wer sie erhält, kann gespeicherte Namen, Verläufe, Sessions und eigene Karten lesen.
- die maximale Größe beträgt 1,5 MB tatsächliche UTF-8-Bytes.
- einzelne Werte sind ebenfalls begrenzt.
- es werden höchstens 100 lokale Datensätze importiert.
- ein normaler Import- oder Löschfehler stellt den vorherigen Zustand wieder her.
- wenn Browser-Speicher sowohl beim eigentlichen Vorgang als auch beim Rollback vollständig ausfällt, kann keine Garantie für Wiederherstellung gegeben werden; die App zeigt dann eine kritische Meldung.
- es gibt keine automatische Cloud-Sicherung.

## Einstellungen, Verlauf und Erfolge

- fehlgeschlagene Präferenz-Speicherung lässt die aktuelle Auswahl nur bis zum Neuladen gelten.
- Statistikreparatur kann ältere zu niedrige Werte erhöhen, reduziert aber bewusst keine höheren Werte.
- unbekannte Spiele werden nicht in Reparatur und Erfolge einbezogen.
- wird der Verlauf gelöscht, können daraus abgeleitete Erfolge wieder gesperrt erscheinen.
- aktive einfache Hub-Sessions werden nicht so detailliert wiederaufgenommen wie komplexe Spiele und Word Imposter.

## Inhalte und Altersstufen

- nicht jedes Spiel besitzt gleich viele Karten.
- Altersstufen sind technische Filter und keine rechtliche Altersfreigabe.
- vor öffentlichem Release ist eine vollständige redaktionelle Prüfung erforderlich.
- es gibt noch keine separat freischaltbaren Erwachsenen-Packs.

## Installation und Offline-Betrieb

- Die App muss einmal vollständig online geladen werden, bevor Cache `secret-circle-v24` alle Kernressourcen offline bereitstellt.
- Service Worker und Installation funktionieren nur über HTTPS oder `localhost`.
- auf iPhone und iPad erfolgt die Installation über „Zum Home-Bildschirm“.
- Browser und Betriebssystem können lokalen Speicher bei Speicherdruck entfernen.
- Hintergrundbenachrichtigungen, Systemwecker und Push-Nachrichten sind nicht Bestandteil der Beta.
- der Update-Pfad auf `secret-circle-v24` ist automatisiert vorbereitet, aber noch nicht auf realen Geräten bestätigt.

## Geräte und Browser

- Playwright simuliert Chromium, Firefox, WebKit, Android und iPhone, ersetzt aber keine realen Geräteprüfungen.
- Safari, Rotation, Sperrbildschirm, Energiesparmodus und Bildschirmtastatur müssen manuell geprüft werden.
- Vibration und Wake Lock sind nur verfügbar, wenn Browser und Gerät die API unterstützen.
- Mafia und lange Gruppenrunden können auf kleinen Displays zusätzliches Scrollen erfordern.

## Datenschutz und Veröffentlichung

- Secret Circle verwendet keine Anmeldung, Analyse-, Werbe- oder Tracking-Dienste.
- statische App-Dateien werden beim ersten Laden und bei Updates vom Hosting-Anbieter abgerufen.
- GitHub Actions muss auf dem endgültigen Commit echte Schritte ausführen und grün enden.
- vollständige lokale Unit-, Validator-, E2E- und Cross-Browser-Läufe müssen dokumentiert werden.
- reale Android-, iPhone-/iPad-, PWA-Update- und Partytests fehlen noch.
- vor öffentlicher oder kommerzieller Veröffentlichung müssen Verantwortlicher, Kontakt, Hosting-Anbieter und gegebenenfalls Impressum ergänzt werden.

Die verbindlichen Freigabekriterien stehen in `RELEASE_CHECKLIST.md`.
