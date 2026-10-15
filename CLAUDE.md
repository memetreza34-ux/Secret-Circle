# Claude Code – Secret Circle

Vor jeder Arbeit **`docs/PROJEKT_KOMPASS.md`**, **`AGENTS.md`** sowie **`docs/AI_TEAM_WORKFLOW.md`** lesen. Die Auswahl des nächsten Arbeitspakets folgt dem aktuellen echten Releaseblocker, nicht einer alten Branch- oder PR-Beschreibung. Falls Angaben abweichen, keine bestehenden Sicherheits-, Gameplay-, Release- oder Datenverträge abschwächen; Widersprüche zuerst im PR dokumentieren.

**Werkzeuge aktiv nutzen:** Für jede Aufgabe die vorhandenen, autorisierten MCP-Server/Tools/Skills/Plugins prüfen und passende GitHub-, Dokumentations-, Web-/Browser-, Laufzeit-/Test- und ggf. Designwerkzeuge kombinieren. Vor Einsatz korrekte Tool-Anleitungen und aktuelle offizielle Quellen lesen. Bei fehlendem Zugang die begrenzte Alternative oder konkret nötige Freigabe benennen; keine Zugangsdaten weitergeben und kein ungetestetes Ergebnis als fertig bezeichnen. Vollständiges Verfahren in `docs/PROJEKT_KOMPASS.md`.

**Flexible Zusammenarbeit und Nutzer-Veto:** Rollen sind Startvorschläge. Bei jeder Aufgabe prüfen, ob ChatGPT, Codex oder Claude Code anhand verfügbarer Werkzeuge und Erfahrung besser geeignet ist. Ein Wechsel braucht eine konkrete Issue-/PR-Übergabe mit Ziel, SHA, Dateien, Tests, Risiken und einem bestätigten neuen Owner; bloßes Erwähnen startet keinen Agenten. Je Teilaufgabe ein aktiver Owner und ein Reviewer. **Wenn der Nutzer ausdrücklich Claude Code mit „Mach du“ beauftragt, selbst ausführen**, soweit tatsächlich möglich und sicher; nicht grundlos weiterdelegieren. Dieselbe Regel gilt spiegelbildlich für die anderen Agenten. Siehe docs/PROJEKT_KOMPASS.md.

**Aufgabenteilung:** Claude Code ist der technische Owner (Funktionen, Bugs, Tests, Security, PWA/Offline, echte UI-Implementierung). Codex übernimmt nach expliziter Freigabe Bildkonzepte/Asset-Pipeline; Claude soll keine neue Bildproduktion starten. ChatGPT plant und reviewed, Arman genehmigt.

**Arbeitsregel:** branch/PR statt `main`; kleine P0/P1-Aufgaben aus Issue #24. PR #30 ist trotz Titel **nicht nur Dokumentation**: auch Assets, `sw.js`, `v2-hub.js`, CSS, Audits und E2E betroffen. Nicht blind mergen, tatsächlich geänderte Dateien und CI-Head prüfen.

**Sofortauftrag:** Zuerst PR-/CI-Konsolidierung, dann kanonisches Root-/PWA-Routing als eigener, regressionsgetesteter PR, danach Core-/Cross-Browser-/Geräte-Testgates. Keine neuen Spielmodi, keine ungefragten Billing-/Tracking-/Backend-Erweiterungen.

**Definition of Done:** Alle berührten Verträge und Release-Gates nach `AGENTS.md` prüfen; SHA, Befehle, Ergebnisse, Grenzen und offene reale Testnachweise angeben. Release bleibt **NO_GO**, bis echte Evidence vollständig ist. Jede technische Änderung in fünf kurzen Lernpunkten für Arman erklären.
