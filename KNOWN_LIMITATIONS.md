# Bekannte Einschränkungen

Diese Punkte sind bewusst dokumentierte Grenzen des aktuellen Party-Hub-Beta-Stands.

## Produktmodell

- Secret Circle ist ein lokaler Pass-and-Play-Party-Hub auf einem gemeinsam genutzten Gerät.
- Es gibt noch keinen Online-Mehrspielermodus, keine Raumcodes, keine Konten und keine Synchronisierung zwischen Geräten.
- Spielende müssen das Gerät bei geheimen Rollen, Fragen und Karten physisch abschirmen und weitergeben.
- Hub-Spieler und Word-Imposter-Spielerlisten sind getrennte Einrichtungsbereiche.
- Einstellungen, Sessions, Verlauf, Presets und eigene Kategorien werden ausschließlich im Browser-Speicher des jeweiligen Geräts gespeichert.
- Gelöschte Browserdaten können nur über eine vorher exportierte Gesamtsicherung wiederhergestellt werden.

## Spiele

- 18 Spiele sind technisch spielbar, aber noch nicht alle mit echten Gruppen und Geräten geprüft.
- Wellenlänge, Zeichnen & Raten, Schnellfeuer und Geräusche erraten sind sichtbar geplant und absichtlich nicht startbar.
- Zwei Wahrheiten, eine Lüge benötigt persönliche Eingaben der aktiven Person; die App erzeugt keine automatischen persönlichen Behauptungen.
- Question Imposter verwendet vorbereitete ähnliche Fragen. Inhaltstiefe und Schwierigkeitsbalance werden noch erweitert.
- Location Spy besitzt derzeit feste Ortslisten und keine individuellen Rollen pro Ort.
- Mafia ist ein lokaler Moderator-Modus. Eine neutrale Erzählerperson sieht alle Rollen und trägt Nachtaktionen manuell ein.
- Mafia besitzt aktuell keine Audio-Erzählung, keine automatische geheime Einzelabfrage und keine komplexen Sonderrollenlogiken.
- Bei einfachen Hub-Spielen ist die Punktewertung bewusst leichtgewichtig und nicht für kompetitive Turniere ausgelegt.
- Word Imposter beendet bei mehreren Impostern die Runde bereits nach Entdeckung einer Person; anschließend werden alle Imposter aufgedeckt.

## Inhalte und Altersstufen

- Der Hub enthält eine große erste Inhaltsbasis, aber noch nicht in jedem Spiel gleich viele Karten.
- Altersstufen sind technische Filter für die Beta und noch keine rechtliche Altersfreigabe.
- Ein öffentlicher Release benötigt eine vollständige redaktionelle Prüfung auf Dopplungen, missverständliche Formulierungen und ungeeignete Inhalte.
- Es gibt noch keine separat freischaltbaren Erwachsenen-Packs.
- Eigene Hub-Packs können noch nicht direkt in der Oberfläche erstellt werden; eigene Kategorien sind derzeit nur im Word-Imposter-Modul verfügbar.

## Session und Statistik

- Es gibt keine Cloud-Rangliste, globale Bestenliste oder geräteübergreifende Statistik.
- Erfolge werden aus lokalem Verlauf, Favoriten und Presets berechnet.
- Wird der lokale Verlauf gelöscht, können daraus abgeleitete Erfolge wieder als gesperrt erscheinen.
- Es kann immer nur eine komplexe Hub-Session gleichzeitig aktiv gespeichert werden.
- Aktive einfache Hub-Sessions werden nicht so detailliert wiederaufgenommen wie die vier komplexen Spiele und Word Imposter.

## Installation und Offline-Betrieb

- Die App muss einmal vollständig online geladen werden, bevor der Cache `secret-circle-v21` alle Kernressourcen offline bereitstellt.
- Die Installationsoberfläche unterscheidet sich je nach Browser. Auf iPhone und iPad erfolgt die Installation über „Zum Home-Bildschirm“.
- Browser und Betriebssystem können lokalen Speicher bei Speicherdruck entfernen.
- Hintergrundbenachrichtigungen, Systemwecker und Push-Nachrichten sind nicht Bestandteil der Beta.
- Service Worker und PWA-Installation funktionieren nur über HTTPS oder `localhost`.
- Der Update-Pfad von älteren installierten Cache-Versionen ist automatisiert vorbereitet, aber noch nicht auf realen Geräten bestätigt.

## Geräte und Browser

- Playwright simuliert Chromium, Firefox, WebKit, Android und iPhone, ersetzt aber keine realen Geräteprüfungen.
- Safari, Bildschirmrotation, Sperrbildschirm, Energiesparmodus und Bildschirmtastatur müssen vor Release manuell geprüft werden.
- Vibration ist nur verfügbar, wenn Gerät und Browser die API unterstützen.
- Wake Lock wird nicht von allen Browsern unterstützt; Word Imposter bleibt ohne diese API nutzbar.
- Mafia und lange Gruppenrunden können auf kleinen Displays zusätzliches Scrollen erfordern.

## Sicherung und Datenschutz

- Die Gesamtsicherung ist eine unverschlüsselte JSON-Datei. Wer die Datei erhält, kann darin gespeicherte Namen und Spielinformationen lesen.
- Der Import akzeptiert ausschließlich das aktuelle Gesamtsicherungsformat; ältere reine Word-Imposter-Sicherungen werden weiterhin im Word-Imposter-Bereich verarbeitet.
- Es gibt keine automatische Cloud-Sicherung.
- Secret Circle verwendet keine Anmeldung, Analyse-, Werbe- oder Tracking-Dienste.

## Veröffentlichung

- GitHub Actions muss auf dem endgültigen Release-Commit echte Schritte ausführen und grün enden.
- Ein vollständiger lokaler Unit-, Validator-, E2E- und Cross-Browser-Lauf muss dokumentiert werden.
- Reale Android-, iPhone-/iPad- und Partytests fehlen noch.
- Vor öffentlicher oder kommerzieller Veröffentlichung müssen Verantwortlicher, Kontakt, Hosting-Anbieter und gegebenenfalls Impressum ergänzt werden.

Die verbindlichen Freigabekriterien stehen in `RELEASE_CHECKLIST.md`.
