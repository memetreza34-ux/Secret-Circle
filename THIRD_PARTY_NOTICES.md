# Secret Circle – Third-Party-, Lizenz- und Asset-Inventar

Stand: 16. August 2026  
Status: **IN PROGRESS – Herkunft einzelner Assets und finale Lizenzprüfung offen**

## 1. Zweck

Dieses Dokument inventarisiert externe Software, gebündelte Assets, Fan-/Markenbezüge und eigene Projektbestandteile, die vor dem Januar-2027-Release auf Herkunft und Nutzungsrechte geprüft werden müssen.

Ein Eintrag ohne belegte Herkunft wird **nicht** automatisch als eigenes Werk behandelt.

## 2. Aktuelle Runtime-Abhängigkeiten

`package.json` enthält derzeit **keine npm-Runtime-Dependencies**.

Die Production-PWA lädt außerdem keine externen:

- JavaScript-CDNs
- Webfonts
- Analyse-SDKs
- Werbe-SDKs
- Remote-Spielassets

Das reduziert die Third-Party-Fläche, ersetzt aber nicht die Prüfung gebündelter Dateien und Entwicklungswerkzeuge.

## 3. Entwicklungsabhängigkeiten

| Paket | Version | Verwendung | Production Runtime? | Lizenz-/Notice-Status |
|---|---:|---|---|---|
| `@playwright/test` | `1.54.2` | E2E-/Cross-Browser-Tests | Nein | **vor RC gegen Upstream-/Paketmetadaten verifizieren und erforderlichen Hinweis dokumentieren** |

Wenn neue Dependencies hinzukommen:

1. Zweck dokumentieren
2. Version pinnen/Lockfile aktualisieren
3. Lizenz prüfen
4. bekannte Sicherheitsrisiken prüfen
5. Production- oder Dev-only kennzeichnen
6. Notice-Pflichten ergänzen

## 4. Gebündelte App-Assets

| Datei | Zweck | Aktueller Herkunftsnachweis | Release-Status |
|---|---|---|---|
| `icon.svg` | App-/PWA-Icon, Vektorquelle | **im Repo kein Herkunfts-/Lizenznachweis gefunden** | **BLOCKED FOR FINAL SIGN-OFF** |
| `icon-192.png` | PWA-/Apple-Touch-Icon | vermutlich Rasterableitung des App-Icons, aber im Repo nicht belegt | **BLOCKED FOR FINAL SIGN-OFF** |
| `icon-512.png` | PWA-Icon | vermutlich Rasterableitung des App-Icons, aber im Repo nicht belegt | **BLOCKED FOR FINAL SIGN-OFF** |

### Vor RC für jedes Asset dokumentieren

- Urheber/Ersteller
- Erstellungsquelle oder Originaldatei
- Datum/Projektkontext, soweit verfügbar
- Lizenz beziehungsweise Bestätigung „eigenes Werk“
- ob KI-/Template-/Stock-Werkzeug beteiligt war
- falls Drittanbieter: konkrete Nutzungsbedingungen und kommerzielle Freigabe
- ob Bearbeitung/Attribution erforderlich ist

**Wichtig:** Aus dem SVG-Code allein lässt sich die Rechtekette nicht beweisen.

## 5. Emoji und Systemglyphen

Im UI stehen Unicode-Emoji-Zeichen in Text/Markup. Secret Circle bündelt dafür derzeit keine eigene Emoji-Fontdatei. Die Darstellung erfolgt durch die auf dem jeweiligen Betriebssystem/Browser vorhandene Schrift-/Emoji-Implementierung.

Vor einem späteren Export von Emoji-Glyphen als eigene Raster-/Vektorgrafiken wäre die Rechtefrage neu zu prüfen.

## 6. Built-in Content

### Core

Die 15 Kernspiele besitzen einen ersten redaktionellen Quellpass in `CORE_CONTENT_REVIEW.md`.

Regel:

- keine Karten aus konkurrierenden Partyapps kopieren
- keine längeren fremden Texte/Zitate übernehmen
- allgemein bekannte Mechaniken selbst formulieren
- Marken-/Franchisenamen nur nach gesonderter Bewertung

### Extended / Labs / Fan-Bezug

Besonders zu prüfen:

- Anime-/Fan-Quiz
- konkrete Figuren-/Serien-/Game-Namen
- Musik-/Film-/Popkulturbezug
- mögliche Marken-/Titelnutzung

Aktuelle Schutzregel aus `ASSET_PLAN.md`:

- keine bekannten Charakterbilder nachzeichnen
- keine Logos, Panels, Screenshots, Audios oder Videos übernehmen
- Fan-Quiz visuell nur mit eigenständigen generischen Motiven begleiten

Der Hinweis „inoffiziell“ allein ersetzt keine Rechteprüfung.

## 7. Geplante neue Designassets

`ASSET_PLAN.md` beschreibt zukünftige:

- Navigationsicons
- Mechanikicons
- Hero-/Kategorieillustrationen
- Kartenrückseiten
- Hintergründe
- Motionassets

Noch nicht produzierte Assets dürfen erst in den Release-Core aufgenommen werden, wenn ihre Herkunft im selben Commit oder in einem nachvollziehbaren Assetmanifest dokumentiert ist.

Empfohlene spätere Datei:

`assets/manifests/asset-provenance.json`

mit mindestens:

```text
path
creator
source
created_at
license
commercial_use
attribution
notes
```

## 8. Projektlizenz / Quellcodefreigabe

Im aktuellen Repository wurde keine Root-Datei `LICENSE` gefunden.

Das bedeutet nicht automatisch, dass eine Open-Source-Lizenz benötigt wird. Vor öffentlicher Quellcodeverteilung muss aber bewusst entschieden werden:

- bleibt der Quellcode proprietär/nicht lizenziert für Weiterverwendung?
- oder wird eine konkrete Open-Source-Lizenz gewählt?

Keine Lizenzdatei aus Gewohnheit hinzufügen, ohne die gewünschte Rechtevergabe zu verstehen.

## 9. Hosting- und Plattformkomponenten

Der Hostinganbieter kann eigene technische Komponenten und Bedingungen mitbringen. Nach Auswahl der Production-Plattform prüfen:

- Hosting-AGB
- Datenschutz-/Logverarbeitung
- erforderliche Attribution/Notices, falls überhaupt
- Build-/Deploy-Actions und deren Third-Party-Lizenzen

## 10. Release-Gates

Vor `THIRD-PARTY / ASSET PASS`:

- [ ] `package-lock.json` vorhanden und Dependencybestand verifiziert
- [ ] Lizenzstatus aller direkten Dependencies dokumentiert
- [ ] `icon.svg` Herkunft belegt
- [ ] `icon-192.png` Herkunft/Ableitung belegt
- [ ] `icon-512.png` Herkunft/Ableitung belegt
- [ ] alle später hinzugefügten Bilder/Icons/Motionassets inventarisiert
- [ ] Fan-/Marken-/Franchise-Inhalte final geprüft
- [ ] keine fremden Logos/Screenshots/Audios/Videos ohne Freigabe
- [ ] erforderliche Attributionen/Notices in finaler Form vorhanden
- [ ] bewusste Entscheidung zur Projekt-/Quellcodelizenz getroffen, falls Quellcode öffentlich verteilt wird

Bis dahin bleibt R-029 **OFFEN** und der öffentliche Release **NO_GO**.
