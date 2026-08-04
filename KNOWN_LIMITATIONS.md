# Bekannte Einschränkungen

Diese Punkte sind keine versteckten Fehler, sondern bewusst dokumentierte Grenzen des aktuellen Beta-Stands.

## Produkt

- Secret Circle ist ein lokales Pass-and-Play-Spiel auf einem gemeinsam genutzten Gerät.
- Es gibt derzeit keinen Online-Mehrspielermodus, keine Räume und keine Konten.
- Einstellungen, Spielstände, Verlauf und eigene Kategorien werden nur im Browser-Speicher des jeweiligen Geräts gespeichert.
- Gelöschte Browserdaten können nur aus einer zuvor exportierten Sicherungsdatei wiederhergestellt werden.
- Ein Match endet, sobald die Abstimmung eine unschuldige Person oder einen Imposter bestimmt beziehungsweise die begrenzte Stichwahl erneut unentschieden bleibt.
- Bei mehreren Impostern beendet bereits die Entdeckung eines Imposters die Runde; die übrigen Imposter werden anschließend ebenfalls aufgedeckt.

## Installation und Offline-Betrieb

- Die App muss einmal vollständig online geladen werden, bevor alle Dateien offline verfügbar sind.
- Die Installationsoberfläche unterscheidet sich je nach Browser. Auf iPhone und iPad erfolgt die Installation über das Teilen-Menü und „Zum Home-Bildschirm“.
- Browser und Betriebssystem können lokalen Speicher bei starkem Speicherdruck entfernen. Für wichtige eigene Kategorien oder laufende Matches sollte eine Sicherung exportiert werden.
- Benachrichtigungen im Hintergrund und ein Systemwecker sind nicht Bestandteil dieser Beta.

## Geräte und Browser

- Automatisierte Browserprüfungen simulieren Desktop-Chromium und ein mobiles Android-Gerät, ersetzen aber keine realen Android-, iPhone- und iPad-Tests.
- Safari, Firefox, Bildschirmrotation, gesperrter Bildschirm und Energiesparmodus müssen vor der öffentlichen Freigabe manuell geprüft werden.
- Vibration beim Timerende ist nur verfügbar, wenn Browser und Gerät die Vibrations-API unterstützen.

## Veröffentlichung

- Vor einer öffentlichen oder kommerziellen Veröffentlichung müssen Verantwortlicher, Kontaktmöglichkeit, Hosting-Anbieter und gegebenenfalls ein Impressum ergänzt werden.
- GitHub Actions muss auf dem endgültigen Release-Commit erfolgreich laufen.
- Ein realer Party-Betatest mit mehreren Gruppen ist vor der Produktionsfreigabe erforderlich.

Die verbindlichen Freigabekriterien stehen in `RELEASE_CHECKLIST.md`.
