# Secret Circle – Projektkompass und verbindlicher roter Faden

**Stand: 15. Oktober 2026. Ziel: Secret Circle mit der kürzesten sicheren Route in hoher Qualität veröffentlichen.**  
**Produkt:** deutsche Offline-first-Partyspiel-PWA für eine Gruppe und ein Gerät. **Releaseentscheidung: NO_GO.**

> **Leitsatz:** Erst die tatsächlichen Hindernisse beseitigen, dann ein hervorragend benutzbares Kernprodukt abnehmen, erst danach visuell finalisieren und nach echten Nachweisen veröffentlichen. Nicht die Zahl der Änderungen maximieren, sondern die Zahl der nachweislich gelösten Nutzer- und Releaseprobleme.

Dieses Dokument ist der **Einstieg für jeden Mitwirkenden**, unabhängig davon, ob Claude Code, Codex, ChatGPT oder ein anderer Agent arbeitet. Es ergänzt die verbindlichen Detailverträge: `AGENTS.md`, `ARCHITECTURE.md`, `SECURITY.md`, `THREAT_MODEL.md`, `RELEASE_SCOPE_2027.md`, `RELEASE_CHECKLIST.md` und `docs/AI_TEAM_WORKFLOW.md`. Im Widerspruchsfall niemals Sicherheits-, Datenschutz-, Daten-, Spiel- oder Testverträge abschwächen. `release-evidence.json` und `operator-release.json` bestimmen die belegte Releasebereitschaft; dieser Plan erklärt **die Arbeitsreihenfolge**, nicht einen erfundenen PASS.

## 1. Auftrag, Entscheidungshoheit und ehrliche Beratung

- **Produktinhaber:** entscheidet über Zweck, Qualitätsmaßstab, endgültige Bilder, Betreiberangaben, reale Geräte-/Gruppenabnahme und Veröffentlichung. Er muss keine technischen Einzelheiten kennen. Er erhält klare Empfehlungen mit Gründen und konkrete, einfache Schritte nur dann, wenn seine Mitwirkung tatsächlich erforderlich ist.
- **ChatGPT = unabhängiger Produkt- und Qualitätsberater / Projektkoordination:** prüft den realen Quellstand und Resultate, entdeckt kritische Lücken, priorisiert selbstständig fachlich sinnvoll, hinterfragt Vorschläge aller Agenten, recherchiert bei Unsicherheit und empfiehlt ausdrücklich eine bessere Alternative, wenn eine Aufgabe nicht zielführend ist. Es darf technische Arbeiten selbst durchführen, sofern Werkzeuge, Auftrag und Verträge dies erlauben; es darf aber nichts Ungetestetes als fertig oder externe Agenten als automatisch gestartet darstellen.
- **Claude Code = technischer Umsetzer:** erhält kleine, überprüfbare Arbeitspakete für Routing, Engines, Privacy, Daten, PWA, Security, Accessibility, Bugs und Tests.
- **Codex = Bildwelt, Assets, Design-Finishing:** erhält nach Technikstabilisierung getrennte freigegebene Aufträge; kein ungefragter Eingriff in Spiellogik, Persistenz oder Security.
- **Jeder andere Mitarbeiter/Agent** übernimmt dieselben Qualitätsregeln, benennt seinen konkreten Arbeitsbereich und seine Grenzen und liefert überprüfbare Ergebnisse. Rollen sind Organisationshilfen, keine Erlaubnis, Aufgaben liegenzulassen.
- **Kein blindes Ja:** Eine schlechte oder riskante Vorgehensweise wird begründet abgelehnt und durch den besten nachprüfbaren Weg ersetzt. Bei konkurrierenden Lösungen kurz Nutzen, Risiko, Wartbarkeit, Zeitaufwand und Rückrollbarkeit abwägen und die Entscheidung dokumentieren.

## 2. Optimierungsregeln: schneller werden, ohne Qualität vorzutäuschen

**Entscheidungsreihenfolge:** (1) Sicherheit, Geheimhaltung, Datenintegrität und tatsächliche rechtliche Pflichten, (2) korrekte vollständige Kernspielabläufe und Nutzerverständlichkeit, (3) releasekritische technische Nachweise, (4) Liefergeschwindigkeit mit kleinem Änderungsrisiko, (5) visuelle Qualität, (6) zusätzliche Funktionen.

- **Blocker vor Extras:** P0/P1 und vorgelagerte Abhängigkeiten vor neuen Spielmodi, Abos, Konten, Backend, ungefragten Architekturmigrationen oder Dekoration.
- **Kleinster wirksamer Schritt:** Ein einzelner Ursachenfix mit Regressionstest ist besser als ein großer Rewrite. Nur zusammenhängende Änderungen in einen PR. Alte Branches und PRs niemals blind mergen oder kopieren.
- **Kein künstlicher Zeitdruck als Qualitätsersatz:** Termine sind Ziele, keine Begründung, Tests, Rechte oder Privacy zu überspringen. Wenn nötig lieber den Scope transparent reduzieren oder Release verschieben, statt ein unsicheres Produkt freizugeben.
- **Erst Nutzerwert:** Ein Neuling soll ohne Erklärung eine geeignete Partie starten, sicher weiterspielen, abbrechen und zum nächsten Spiel gelangen können. Guter Code allein erfüllt dieses Ziel nicht.
- **Keine Scheinfortschritte:** `implementiert`, `CI bestanden`, `real getestet`, `abgenommen` und `Release-GO` bleiben strikt verschiedene Zustände. Keine unbelegten Fertigstellungsprozente oder grünen Häkchen.
- **Quellen statt Raten:** Bei unbekannten technischen, gesetzlichen oder produktspezifischen Fragen aktuelle Primärquellen (offizielle API-/Browser-/Plattformdokumentation, GitHub-Code und Logs) prüfen. Geeignete Tutorials/YouTube-Demos für Bedienungs- und Designmuster ergänzend ansehen; deren Aussagen nicht ungeprüft als verbindlich übernehmen. Relevante Erkenntnis, Quelle, Aktualitätsdatum und Entscheidung im PR/Issue festhalten.
- **Keine Hintergrundversprechen:** Ein Bericht oder GitHub-Dokument startet keine Agenten automatisch. Jede Arbeit erfolgt in einer tatsächlich beauftragten Sitzung und wird nur nach erfolgtem GitHub-/Testnachweis als ausgeführt beschrieben.

## 3. Fester Releaseumfang und Produktqualität

- **V1-Kern: 15 Core-Spiele** aus `RELEASE_SCOPE_2027.md`. Es gibt zusätzlich **13 Extended und 27 Labs**, aber keine automatische Hochstufung und keine neuen Spiele bis zur Freigabe.
- **Plattform:** installierbare, deutschsprachige, responsive Offline-PWA; ein gemeinsames Gerät; kein Pflichtlogin, Cloudzwang, Tracking, Werbung oder Runtime-CDN. Native Stores und Monetarisierung sind gesonderte spätere Entscheidungen.
- **Vollständiger Kernflow:** App öffnen → Spieler festlegen → Spiel auswählen → Regeln in höchstens vier klaren Schritten → sichere Übergabe/geheime Infos → vollständige Runden → Ergebnis/History korrekt → sicher abbrechen/fortsetzen → nächstes Spiel.
- **Nicht verhandelbar:** geheime Karten/Rollen nie nach Reload, Fokusverlust oder Geräteübergabe ungewollt offen; Timer fair und rekonstruierbar; Punkte/Verlauf exakt einmal; Backups/Restore dürfen keine gültigen alten Daten verlieren; Offline/Update/Altsessions werden erhalten oder kontrolliert abgefangen.
- **Designmaßstab:** gut lesbar, große Touchflächen, eine klare Hauptaktion, konsistente Spielewelt, mobil/Zoom/Screenreader nutzbar, reduzierte Bewegung, eigene rechtlich überprüfte lokale Bilder. Nicht jedes Spiel benötigt vor dem Release ein teures Bild, wenn ein gutes Emblem dem Nutzer besser dient.

## 4. Abhängigkeitsbasierte Arbeitsreihenfolge (Single Source of Priorities)

| Priorität | Arbeitspaket / Quelle | Konkretes Fertig-Kriterium | Warum jetzt? |
| --- | --- | --- | --- |
| **P0 – A** | Bestehende offenen PRs/Branches konsolidieren; [PR #32](https://github.com/memetreza34-ux/Secret-Circle/pull/32) | Alle offenen Diffs gegen neuesten `main` geprüft; überholte PRs nach nachvollziehbarer Prüfung archiviert/geschlossen, keine unkontrollierten Merges | Schützt bereits funktionierenden Stand vor Regressionen |
| **P0 – B** | Root- und PWA-Routing; [Issue #33](https://github.com/memetreza34-ux/Secret-Circle/issues/33) | `/` und `/index.html` = Hub, eigene Word-Imposter-URL, Direktlinks/Zurück/Resume/Offline/Alt-PWA erhalten, aktuelle Chromium- und WebKit-CI grün | Eindeutiger Einstieg ist Basis aller Nutzerreisen |
| **P0 – C** | 15 Core-Spiele + gemeinsame Engines; [Issue #24](https://github.com/memetreza34-ux/Secret-Circle/issues/24) | Einrichtung → volle Runde → Resultat/Replay sowie Schutz, Speicher, Timer, Abbruch und Edge Cases mit Regressionstests pro relevantem Pfad; keine reproduzierbaren offenen P0/P1 | Nutzer sollen wirklich spielen können, nicht nur ein Menü öffnen |
| **P1 – D** | Reale Zielgeräte, PWA-Upgrade/Rollback, Accessibility und Gruppen; [Issue #8](https://github.com/memetreza34-ux/Secret-Circle/issues/8) | Android Chrome/PWA, iPhone Safari/Home-Screen, Tablet; Offline/Update/Screen-Lock/Cold Resume; Touch/Zoom/VoiceOver/TalkBack; echter Test je Core-Spiel nachvollziehbar protokolliert | Simulatoren ersetzen keine realen Nutzungstests |
| **P1 – E** | Hosting, rechtliche Pflichtangaben, Support, Betrieb, Branchschutz; [Issue #14](https://github.com/memetreza34-ux/Secret-Circle/issues/14) | getrennte HTTPS-Umgebungen, Netzwerk-Smokes, real geprüfte Datenschutz-/Rechte-/Kontaktangaben, Supporttest, Incident-/Rollback-Drill, Required Checks | Ohne echten Betreiber und Infrastruktur kein seriöser Launch |
| **P1/P2 – F** | Finales Codex-Design und freigegebene Bildwelt | Design-/Bildfreigabe, Rechte-/Provenienz-/Performance-/Offline-Audits, mobiles Review und Regression auf dem finalen Stand | Erst stabile Funktion, dann finaler visueller Schliff |
| **P0 – G** | Release Candidate / `release-evidence.json` | Exakt ein unveränderter SHA/Tag, alle Pflichtgates am selben Kandidaten PASS, `knownBlockers` leer, verantwortete `GO`-Entscheidung | Veröffentlichung erst nach echten Nachweisen |

**Parallel, aber ohne Codekonflikte:** E (Betreiber, Hostingentscheidung, Recht und Support) sofort vorbereiten; reale Testpersonen und Geräte für D organisieren. P0-B/P0-C dürfen nicht durch das Warten auf Angaben in E blockiert werden. **Technischer Design-Handoff** erst nach stabilen Kernverträgen; finaler RC erst nach F und erneutem Test. Das Ziel laut Repository: funktionsfertig 30.11.2026, Code-Freeze 05.12., RC 15.12., öffentlicher Launch 04.–15.01.2027 – nur falls Gates rechtzeitig bestehen.

## 5. Ablauf für JEDE neue Aufgabe (auch wenn ein anderer Agent übernimmt)

1. **Ist-Zustand live:** neuester `main`-SHA, offene PRs/CI, dieser Kompass, `AGENTS.md`, betroffene Dateien und bestehende Issues lesen. Historische Release- oder Versionsangaben gegen den aktuellen Code halten.
2. **Problem beweisen:** aus Nutzersicht beschreiben, Fehler reproduzieren oder fehlenden Nachweis konkret benennen. Bei Unsicherheit gezielt recherchieren, nicht mutmaßen.
3. **Beste kleine Lösung wählen:** mindestens die naheliegende Alternative und deren Risiken abwägen. Sicherheits- und Datenverträge ausdrücklich prüfen; Testfall und Rückrollweg vorab festlegen.
4. **Isoliert umsetzen:** neuer Branch vom geprüften `main`, enger PR, keine ungefragten Merges/Deployments, keine parallele Bearbeitung derselben Dateien.
5. **Nachweis führen:** `npm run check`, `npm test`, `npm run validate`, betroffene Playwright-/Chromium-/WebKit-Suites, ggf. Firefox; Service-Worker-Änderungen nur mit Offline-Core-Lock/Cache-Bump/CHANGELOG und echten Upgradeprüfungen. Prüflauf nur zum **exakten aktuellen PR-SHA** als PASS werten. Fehlende Hardware-/Hosting-/Gruppentests als OPEN, nie simulieren.
6. **Unabhängiges Review:** fachlich/technisch/UX/Security prüfen; Fehlerursache lösen statt Tests abzuschwächen. In kurzer deutscher Sprache dokumentieren: Problem, Lösung, betroffene Dateien, durchgeführte Tests mit SHA, Risiken, nächster Schritt.
7. **Abschluss und nächster Engpass:** Fortschritt im passenden Issue dokumentieren, bei tatsächlich erreichten Gates Status aktualisieren und das **nächste releasekritische Arbeitspaket** empfehlen. Nie einfach „weiter“ ohne konkrete Abnahme und Priorität.

**Stop-Regel:** Bei möglichem Geheimnis-Leak, Datenverlust, gebrochenem Alt-PWA-Upgrade, sicherheitskritischer Regression oder roten Pflicht-Checks kein Merge, kein Release-GO. Ursache isolieren und gezielt reparieren.

## 6. Was der Produktinhaber nach jedem Arbeitsabschnitt erhält

Ein kurzer Bericht mit **(1) erledigt und überprüfbarem PR-/Commit-Link, (2) noch offen oder blockiert, (3) tatsächlichem Testergebnis, (4) nächstem wichtigsten Schritt und seiner Begründung, (5) höchstens den wirklich notwendigen Nutzerentscheidungen**. Fachbegriffe einfach erklären. Fehlende Informationen nicht durch Behauptungen ersetzen.

**Wichtige aktuelle Tatsachen:** `main` hatte am 14.10.2026 auf `a0f929c` grüne Chromium-/WebKit-Jobs ([CI](https://github.com/memetreza34-ux/Secret-Circle/actions/runs/38540030575)); der alte Routing-PR [#27](https://github.com/memetreza34-ux/Secret-Circle/pull/27) hatte rote Browser-Jobs und darf nicht blind übernommen werden. Neue Commits erfordern **neue** Nachweise. Der bisherige Release ist **NO_GO**.

**Dauerhaftes Ziel:** Ein hochwertiges, verständliches, sicheres und zuverlässiges Secret Circle – **so früh wie realistisch möglich, nicht so früh wie man es ohne Belege behaupten könnte**.
