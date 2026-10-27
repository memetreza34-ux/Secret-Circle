## v123 – Word Imposter einmal einrichten und direkt starten (26. Oktober 2026)

- Word Imposter führt aus Katalog, Empfehlung und altem Detail-Link direkt in eine gemeinsame Einrichtung; die zusätzliche Spielinfo-/Spieler-Runde entfällt.
- Kompakter Kopf mit bestehendem Spielmotiv, direkt änderbare Namen, Kategorie, eingeklappte Zusatzoptionen und ständig erreichbarer Startknopf.
- Auch unvollständige gemeinsame Gruppen können direkt ergänzt werden; gelöschte Namen bleiben gelöscht. Die Startgrenzen und unabhängigen Namen laufender Partien bleiben erhalten.
- Vor dem Ersetzen einer gespeicherten Partie ist eine ausdrückliche Entscheidung nötig; Ablehnen verändert weder Spielstand noch Wortgedächtnis.
- Offline-Core v121 → v123; zwei eigene Dokumentationsscreenshots mit Provenienz, kein neues Spielmotiv.

## v121 – Gemeinsamer Inhaltsstand und Wiederholungsschutz (25. Oktober 2026)

- 26. Oktober: Wiederholbarer Browser-Updatecheck für echte v99-/v119-Installationen mit kontrolliertem Installationsabbruch, Datenerhalt und bytegenauem Zielcache. Testwerkzeuge und Nachweise betreffen keine Offline-Core-Datei; Cachegeneration bleibt v121.

- Vorbereitete Kartenpakete und 2.609 verschiedene Word-Imposter-Wörter mit den drei zusätzlichen Klassikern zusammengeführt: 58 Modi.
- Gemeinsames begrenztes Inhaltsgedächtnis über Kategorien und Spiele hinweg, weiterhin nur lokale Prüfsummen. Ungespielte zulässige Inhalte zuerst, danach älteste passende Inhalte. Erkannte ähnliche Themen werden nach Möglichkeit voneinander getrennt.
- Stille Post mit Zeichnungen und Drei-Runden-Begrifferaten verwenden dasselbe Gedächtnis. Neue Bildketten und neue Stapel wechseln; der Stapel bleibt innerhalb der drei Ratephasen identisch.
- Zeichenvorlagen auf 112 und Begriffe für die drei Ratephasen auf 240 erweitert; eigener Text beim Koffer bleibt frei wählbar.
- Kein unbegrenzter Vorrat und keine unbegrenzte Speicherzusage: 16.000 gemeinsame Inhaltsprüfsummen plus geschützter Wortbereich, ältere Komfortdaten bleiben lesbar. Offline-Cache v119 → v121.

## v101 – Drei Partyklassiker (25. Oktober 2026)

- Stille Post mit Zeichnungen: private Bild-/Textketten, begrenzte Zeichnungen und gemeinsame Auflösung.
- Drei-Runden-Begrifferaten: gleicher Stapel beim Erklären, Ein-Wort-Hinweis und Pantomime, zwei Teams und pausierbare 60-Sekunden-Züge.
- Ich packe meinen Koffer: verdecktes Wiederholen, Gruppenprüfung und wachsende Liste.
- Katalog auf 58 Spiele erweitert; bestehende Speicher-, Backup- und Ergebnisverträge bleiben erhalten. Neue Dateien im Offline-Kerncache, Generation v99 → v101.

## v119 – Größerer Word-Imposter-Wortschatz und dauerhaftes Wortgedächtnis (24. Oktober 2026)

- 1.159 geprüfte Zusatzbegriffe: 2.629 Kategorieeinträge / 2.609 verschiedene Wörter in 14 Kategorien. Kostenloser lokaler Wortbestand mit OpenThesaurus-Quellenhinweis, bearbeitbarer Auswahl und LGPL-Text.
- Eigenes Wortgedächtnis unabhängig von den 20 Ergebniseinträgen: Kategorien und Gemischt teilen Wortprüfsummen. Ungespielte Begriffe zuerst, anschließend älteste passende Wörter; nach Möglichkeit abwechselnde Hilfswortthemen.
- Keine externen Laufzeitabfragen. Gesperrter/gelöschter Speicher fällt auf die bestehende Zufallsauswahl zurück; Offline-Core aktualisiert.

## v116 – Claudes Entwicklungsstand und Bildfreigaben zusammengeführt (23. Oktober 2026)

- Technischen Stand v114 mit allen Kartenpaketen und Routing-/QA-Änderungen übernommen; vorhandene freigegebene Bildänderungen und Bildvergleich erhalten.
- Offline-Dateiliste beider Stände zusammengeführt und Prüfsumme erneuert.
- Begonnene opt-in Handy-Ladezeitmessung übernommen; keine Spielinhalte, Spielregeln oder Performance-Grenzen dafür geändert.

## v114 – Mehr Karten, Paket 6: Wissensspiele auf 30 je Kategorie mit Faktenprüfung (17. Oktober 2026)

- `party-cards-wave-3.js` (späte Stufe `wave-one`, +264): **Party Quiz**, **Fakt oder Fake**, **Prozent schätzen** und **Bluff Trivia** von 8 auf **30** je Kategorie. `party-cards-viral-4.js` (+132): **Höher oder tiefer** von 8 auf **30** in allen sechs Kategorien.
- Faktenprüfung: Prozentwerte und ableitbare Zahlen (Zeit, Maße, Geometrie) rechnet der Generator aus der Frage nach; alle übrigen Karten nutzen nur stabiles Lehrbuch- und Begriffswissen (keine Rekorde, Preise, Einwohnerzahlen). Zehn heiklere Fakten sind zusätzlich per Websuche gegengeprüft (u. a. Venus heißer als Merkur, Delfin-Halbhirnschlaf, sieben Halswirbel bei Giraffen, neun Nachbarländer Deutschlands, 52 weiße und 36 schwarze Klaviertasten, Halbmarathon 21,0975 km, SMS 160 Zeichen, Kegeln mit neun Kegeln, Schlangen ohne Lider, Seepferdchen-Männchen tragen aus). Fakt oder Fake ist je Kategorie genau zur Hälfte wahr und falsch; Antwortpositionen im Quiz sind gemischt.
- `tests/card-packs.test.js`: Formatregeln für alle fünf Wissensspiele; Zahlen zählen beim Fast-Doppler-Vergleich jetzt immer als Inhalt, „Wie viel Prozent …“ als fester Satzanfang.
- Offline-Cache v113 → v114. Realgeräte, Gruppentests und Freigabe bleiben offen: **NO_GO**.

## v113 – Mehr Karten, Paket 5b-2: Party Bracket auf 50 je Kategorie (17. Oktober 2026)

- Neue Datendatei `party-cards-wave-2.js` (späte Stufe `wave-one`): **Party Bracket** von 8 auf **50** Brackets in Snacks, Reise & Freizeit und Superkräfte (+126 Brackets mit je 8 Einträgen).
- Jedes Bracket hat einen eigenen Titel (keine Titel doppelt) und genau acht verschiedene Einträge, wie es das Turnier vom Viertelfinale bis zum Finale braucht. `tests/card-packs.test.js` prüft das jetzt als Formatregel.
- Offline-Cache v112 → v113. Realgeräte, Gruppentests und Freigabe bleiben offen: **NO_GO**.

## v112 – Mehr Karten, Paket 5b-1: Advanced- und Wave-One-Spiele auf 50 je Kategorie (17. Oktober 2026)

- **Advanced-Spiele** (+306): **Zwei Wahrheiten, eine Lüge**, **Question Imposter** und **Location Spy** von 16 auf **50** je Kategorie. Die Karten stehen in `party-expansion.js` (`cardAdditions`), weil `advanced.html` nur diese Katalogebene lädt.
- **Wave-One-Spiele** (+606) in `party-cards-wave-1.js`: **Undercover – ähnliches Wort**, **Imposter ohne Wort**, **Satzduell**, **Wer hat das geschrieben?** (8 → 50) und **Ein-Wort-Hinweis** (16 → 50).
- Neu: späte Kartenpakete. Pakete mit `stage: 'wave-one'` reicht `party-core-classic-content.js` weiter, die letzte Katalogebene `party-wave-one-clue-catalog.js` hängt sie mit derselben geprüften Funktion an. Unbekannte Spiele oder Kategorien brechen weiterhin ab.
- `tests/card-packs.test.js` prüft späte Pakete und die Advanced-Zusatzkarten mit denselben Regeln (Format, sichere Texte, keine Dubletten, keine Fast-Doppler); neue Formatregeln für Satzduell, Wer hat das geschrieben? und Undercover. `tests/party-wave-one-clue-catalog.test.js` erwartet 150 statt 48 Ein-Wort-Hinweise.
- Offline-Cache v111 → v112. Realgeräte, Gruppentests und Freigabe bleiben offen: **NO_GO**.

## v111 – Mehr Karten, Paket 5a: elf Hub-Spiele auf 50 je Kategorie (17. Oktober 2026)

- Drei neue Datendateien (+1.249 Karten), je unter 1.000 Zeilen: `party-cards-hub-1.js` (**Wahrheit oder Pflicht**: je Kategorie 50 Wahrheiten und 50 Pflichten statt 12 und 12), `party-cards-hub-2.js` (**Ich habe noch nie**, **Wer würde eher?**, **Entweder oder** von 24 auf 50, **Hot Takes** von 8 auf 50) und `party-cards-hub-3.js` (**Nur falsche Antworten**, **Paranoia**, **Scharade**, **Nicht sagen!**, **Heiße Kartoffel** auf 50).
- **Wortkette** besteht aus Startbuchstaben; 50 je Kategorie gibt das Alphabet nicht her. Jede Kategorie hat jetzt alle gut spielbaren Buchstaben (22–23 statt 10).
- Pflichten bleiben sicher: keine privaten Daten, keine Nachrichten an Dritte, keine riskanten Aufgaben, kein Körperkontakt. Ein Scharade-Begriff („Frieren“) stand auf der Referenz-Sperrliste und heißt jetzt „Bibbern“.
- Verträge: `tests/core-content-quality.test.js` und `tests/party-routing.test.js` erwarten jetzt 400 statt 96 Wahrheit-oder-Pflicht-Karten (je Kategorie 50 + 50). `tests/card-packs.test.js`: Formatregeln für Ich habe noch nie, Wer würde eher?, Paranoia, Nicht sagen! und Wortkette; feste Satzanfänge dieser Spiele und „… und gib weiter.“ zählen beim Fast-Doppler-Vergleich nicht mit.
- Offline-Cache v110 → v111. Realgeräte, Gruppentests und Freigabe bleiben offen: **NO_GO**.

## v110 – Mehr Karten, Paket 4: zehn Quick-Spiele auf 50 je Kategorie (17. Oktober 2026)

- Drei neue Datendateien (+1.476 Karten), je unter 1.000 Zeilen: `party-cards-quick-1.js` (**Spektrum-Tipp**, **Zeichnen & Raten**, **Schnellfeuer**, **Geräusche erraten**), `party-cards-quick-2.js` (**Stirn-Raten**, alle 10 Kategorien) und `party-cards-quick-3.js` (**Buchstaben-Kategorien**, **Nicht lachen!**, **Melodie summen**, **Gegenstandsjagd**, **Caption Battle**).
- Stirn-Raten teilt bewusst sechs Kategorien mit „Wer bin ich?“. Diese sechs bekommen dieselben neuen Karten wie dort (eine Ausnahme: „Zauberer“ steht bei Stirn-Raten schon in Popkultur und heißt in Märchen & Mythen „Wassermann“).
- Spektrum-Tipp bleibt referenzsicher (nur allgemeine Gegensatzpaare), Melodie summen nennt nur Musikarten, Anlässe und Filmszenen, keine Liedtitel.
- `tests/card-packs.test.js`: Formatregeln für Schnellfeuer (Anzahl und Sekunden als ganze Zahlen, mehr Sekunden als Antworten), Spektrum (zwei verschiedene Pole), Buchstaben-Kategorien (fünf verschiedene Kategorien) und Melodie summen (keine Titel in Anführungszeichen). „Nenne drei/fünf/sechs/sieben …“ zählt als fester Satzanfang.
- Offline-Cache v109 → v110. Realgeräte, Gruppentests und Freigabe bleiben offen: **NO_GO**.

## v109 – Mehr Karten, Paket 3b: vier Trend-Spiele auf 50 je Kategorie (17. Oktober 2026)

- Neue Datendatei `party-cards-mega-3.js` (+840 Karten): **Geld-Challenge**, **Pass das Handy**, **Red oder Green Flag** und **Geheime Mission** von 8 auf **50** in allen 20 Kategorien.
- Geld-Challenges bleiben rein hypothetisch und harmlos (keine Mutproben mit Risiko, keine echten Zahlungen). Red/Green Flags halten Rot und Grün etwa ausgewogen; Datenschutz-Themen sind als Warnzeichen formuliert (z. B. Standort öffentlich teilen, fremde Konten verlangen).
- Geheime Missionen sind unauffällig, freundlich und ohne Körperkontakt außer Händeschütteln oder Abklatschen.
- `tests/card-packs.test.js`: Feste Satzanfänge weiterer Spiele („Gib das Handy an die Person …“, „Bringe jemanden dazu, …“, „Sorge dafür, dass jemand …“, „Die Person …“) zählen beim Fast-Doppler-Vergleich nicht mit. Die Schwelle bleibt 3 Wörter / 80 %.
- Offline-Cache v108 → v109. Realgeräte, Gruppentests und Freigabe bleiben offen: **NO_GO**.

## v108 – Mehr Karten, Paket 3a: fünf Trend-Spiele auf 50 je Kategorie (17. Oktober 2026)

- Neue Datendateien `party-cards-mega-1.js` und `party-cards-mega-2.js` (je unter 1.000 Zeilen, zusammen +1.212 Karten): **Wer bin ich?** (8 Kategorien), **Anime-Archetypen erraten** (4), **Blind Ranking** (6) und **Tier List Battle** (6) von 10 auf **50**, **Emoji Quiz** (6) von 8 auf **50**.
- Anime-Archetypen bleiben referenzsicher: nur allgemeine Figurentypen, keine Serien, Figurennamen oder Marken. Der Vertrag in `tests/core-content-quality.test.js` verlangt jetzt genau 50 statt 10 Archetypen je Kategorie; die Sperrliste konkreter Fan-Referenzen bleibt unverändert.
- „Wer bin ich? – Geschichte“ nennt nur bekannte historische Personen (Wissenschaft, Kunst, Entdeckungen); Emoji nutzen höchstens Unicode 12 (2019) und keine Flaggen.
- `tests/card-packs.test.js` prüft zusätzlich: Emoji-Hinweise enthalten keine Buchstaben, die Lösung schon.
- Offline-Cache v107 → v108. Realgeräte, Gruppentests und Freigabe bleiben offen: **NO_GO**.

## v107 – Mehr Karten, Paket 2: fünf Viral-Spiele auf 50 je Kategorie (17. Oktober 2026)

- Zwei neue Datendateien: `party-cards-viral-2.js` (Finger runter, Hear Me Out) und `party-cards-viral-3.js` (Hot Seat, Satz beenden, Preis schätzen). Jede Kategorie hat jetzt **50** statt 8 Karten (+1.260). Preise bei „Preis schätzen“ sind Spielwerte, keine echten Marktpreise.
- Alle Texte ohne Marken, ohne echte Personen, ohne private Angaben, ohne Alkoholbezug; Fast-Doppler wurden vor dem Einbau umgeschrieben.
- Paket 1 nachgebessert: Antwortoption „Memory“ (Markenname) heißt jetzt „Paare suchen“.
- `tests/card-packs.test.js` prüft zusätzlich das Kartenformat je Spiel (z. B. „Finger runter, wenn du …“, Satzanfänge enden mit „…“, Preise sind ganze Zahlen > 0) und ignoriert feste Satzanfänge beim Fast-Doppler-Vergleich.
- Offline-Cache v106 → v107. Realgeräte, Gruppentests und Freigabe bleiben offen: **NO_GO**.

## v106 – Kartenpakete: Platz für 50 Karten je Kategorie (17. Oktober 2026)

- Neue Karten liegen in reinen Datendateien `party-cards-*.js`. `party-core-classic-content.js` bleibt die letzte Inhaltsebene und hängt die Pakete hinten an: Gespeicherte Sessions verweisen weiter auf dieselben Karten. Unbekannte Spiele oder Kategorien brechen ab, exakte Dubletten werden übersprungen.
- Datenschutz- und Referenz-Audit prüfen jede `party-cards-*.js` automatisch mit, auch künftige Dateien. Neuer Test `tests/card-packs.test.js`: jede Datei geladen, offline und auf allen Katalogseiten eingebunden, Format passt zur Kategorie, sichere Texte, keine Dubletten, keine Fast-Doppler.
- Erstes Paket `party-cards-viral-1.js`: „Wer kennt mich am besten?“ und „Story Chain“ von 20 auf **50** Karten je Kategorie (+360).
- Offline-Cache v105 → v106. Realgeräte, Gruppentests und Freigabe bleiben offen: **NO_GO**.

## v105 – Mehr Karten, Paket 1: „Wer kennt mich am besten?“ und „Story Chain“ (17. Oktober 2026)

- Beide Spiele hatten nur 6 Karten je Kategorie. Jetzt 20 in allen 12 Kategorien: 84 neue Fragen mit je drei Antwortoptionen und 84 neue Geschichtsanfänge, alle familienfreundlich, ohne Marken, ohne private Angaben.
- Inhalts-Audit (keine fast gleichen Einträge, keine Dopplungen zwischen Kategorien) und die bestehenden Inhaltstests sind grün. Stil von Arman per Gegenlesen freigegeben.
- Offline-Cache v104 → v105. Realgeräte, Gruppentests und Freigabe bleiben offen: **NO_GO**.

## v104 – Kartengedächtnis: neue Sessions beginnen nicht mit bekannten Karten (16. Oktober 2026)

- Neues gemeinsames Modul `card-memory.js`: Unter den in einer Session noch freien Karten wählen alle Engines (Quick, Trend, Viral, Wave-One, Hub, Advanced, eigene Spiele) bevorzugt solche, die in diesem Spiel und dieser Kategorie zuletzt nicht dran waren. Sind alle schon gesehen, kommt eine zufällige aus der älter gesehenen Hälfte. Word Imposter behält sein eigenes Wortgedächtnis.
- Gegenprobe im Browser: ohne Modul hatten 4 von 5 zweiten Sessions bekannte Karten, mit Modul 0 von 5.
- Speicher `secret-circle-card-memory-v1` enthält nur Prüfsummen, keine Kartentexte, Namen oder Eingaben; höchstens 150 Bereiche mit je 150 Einträgen. Kein Teil von Sicherungen (wie das Onboarding), „Alle Daten löschen“ entfernt ihn. Fehlt oder klemmt der Speicher, bleibt es bei der bisherigen Zufallswahl.
- Datenschutzseite, `BACKUP_SCHEMAS.md` und `ARCHITECTURE.md` beschreiben den Speicher; der 17-Key-Backupvertrag bleibt unverändert.
- Tests: Unit-Test für Auswahl, Rotation, Begrenzung, kaputten Speicher und „keine Texte“; Browsertest mit zwei Sessions je Engine-Familie ohne gemeinsame Karte.
- Offline-Cache v103 → v104. Realgeräte, Gruppentests und Freigabe bleiben offen: **NO_GO**.

## v103 – Word Imposter: kein Hilfswort verrät mehr den Begriff (16. Oktober 2026)

- 28 von 1.470 Hilfswörtern waren ein Teil des geheimen Begriffs oder umgekehrt (z. B. „Fußball“ → „Ball“, „Nashorn“ → „Horn“, „Föhn“ → „Föhnen“). Der Imposter sieht das Hilfswort in der Standardeinstellung und kannte damit praktisch den Begriff. Alle 28 durch passende Begriffe ohne Wortteil ersetzt (z. B. „Stadion“, „Savanne“, „Warmluft“).
- Der Inhaltstest verbietet das jetzt dauerhaft (Groß-/Kleinschreibung, Umlaute und ß werden gleich behandelt).
- Neuer Browsertest: Je ein Spiel aus Quick, Trend, Viral, Wave-One und Hub über zehn Runden; keine Karte kommt doppelt, solange die Kategorie unbenutzte Karten hat.
- Inhalts-Audit über alle 210 Kategorien ohne weitere Funde (fast gleiche Einträge, doppelte Karten zwischen Kategorien, Tabu, Undercover-Paare, Quiz, Prozent, Bracket).
- Offline-Cache v102 → v103. Realgeräte, Gruppentests und Freigabe bleiben offen: **NO_GO**.

## v102 – Hub-Spiele: Karte nach Neuladen verdeckt, Rundenzähler bei Flaschendrehen und Würfel (16. Oktober 2026)

- Fortsetzen nach Neuladen in einer laufenden Scharade- oder Tabu-Runde zeigte die geheime Karte sofort. Jetzt wird sie genauso verdeckt wie bei einem App-Wechsel („Geheime Karte wieder anzeigen“); Karte und Restzeit bleiben unverändert, der Timer bleibt pausiert.
- Flaschendrehen und Würfel & Münze zählten jede Aktion intern als Runde, die Anzeige blieb aber auf „0 Runden“ und die Zählerleiste versteckt. Die Anzeige folgt jetzt jeder Aktion.
- Neuer Browsertest spielt alle 13 Hub-Spiele über den echten Weg der Startseite drei Runden bis „Beenden & speichern“, Timer-Runden laufen mit Test-Uhr wirklich ab; danach eine zweite Session vollständig. Genau ein Verlaufseintrag pro Session.
- 55er-Matrix: Ende + Wiederholen jetzt 50/55.
- Offline-Cache v101 → v102. Realgeräte, Gruppentests und Freigabe bleiben offen: **NO_GO**.

## v101 – Trend-Spiele: Geheimnisse nach Neuladen wieder verdeckt (16. Oktober 2026)

- Fortsetzen nach Neuladen zeigte bei „Wer bin ich?“, „Anime-Archetypen erraten“ und „Geheime Mission“ eine offen gezeigte Identität bzw. Mission sofort wieder an. Jetzt wieder verdeckt; der Inhalt bleibt derselbe, Neuladen zieht nichts neu.
- Neuer Browsertest spielt alle 9 Trend-Spiele drei Runden bis zum Ergebnis, prüft genau einen Verlaufseintrag pro Session und spielt über Neustart und „Wiederholen“ zwei weitere Sessions vollständig. Der Doppeltipp-Schutz aus v100 ist auch hier abgesichert.
- 55er-Matrix: Ende + Wiederholen jetzt 19/55.
- Offline-Cache v100 → v101. Realgeräte, Gruppentests und Freigabe bleiben offen: **NO_GO**.

## v100 – Quick-Spiele: Geheimnisse bleiben bei Übergabe und Neuladen verdeckt (16. Oktober 2026)

- Spektrum-Tipp zeigt den geheimen Zielwert erst nach „Ziel anzeigen“. Bisher stand er sofort beim Rundenstart da, sodass ihn sah, wer die vorige Runde weitergetippt hatte.
- Fortsetzen nach Neuladen deckt offene Geheimnisse wieder zu: die offene Karte bei Zeichnen & Raten, Geräusche, Melodie summen und Stirnraten sowie das offene Spektrum-Ziel. Karte und Ziel bleiben dieselben; Neuladen zieht nichts neu und ändert keine Punkte.
- Nach Session-Ende sind die Ergebnis-Aktionen 0,6 Sekunden gesperrt. Ein Doppeltipp auf die letzte Spielaktion startete auf dem Handy sonst sofort „Wiederholen“ und blendete das Ergebnis aus. Gilt für alle Engines, die die gemeinsame Spielsteuerung nutzen (Quick, Trend, eigene Spiele).
- Hat ein zweiter Tipp während dieser Sperre den Fokus auf den Seitenhintergrund geworfen (WebKit), geht er danach zurück auf die Ergebnis-Überschrift. Tastatur und Screenreader bleiben so im Ergebnis.
- Neuer Browsertest spielt alle 10 Quick-Spiele drei Runden bis zum Ergebnis, prüft genau einen Verlaufseintrag pro Session und spielt über Neustart und „Wiederholen“ zwei weitere Sessions vollständig. Dazu Regressionstests für die drei Fehler.
- Offline-Cache v99 → v100. Realgeräte, Gruppentests und Freigabe bleiben offen: **NO_GO**.

## v99 – Altersstufe wirkt auch in der kanonischen Startseite (16. Oktober 2026)

- Der V2-Hub übernimmt die gespeicherte Altersstufe aus den gemeinsamen Party-Einstellungen. Der Familienmodus filtert Empfehlungen, Hero, Katalog und Suche.
- Direkte V2-Links zu Spielen anderer Altersstufen zeigen weiterhin das Spieldetail, sperren jedoch den Start und erklären, wo die Einstellung angepasst werden kann.
- Ohne Präferenz bleibt das bisherige Verhalten unverändert. Spieler, Favoriten, Presets und Sessions werden nicht verändert.
- Browserregressionen für Startseite, Familienmodus, Suchfilter, Deep-Links, Legacy-Alias und Rückkehr zu „Alle Inhalte“ ergänzt.
- Offline-Cache v98 → v99. Realgeräte, Datenschutz-/Betreiberangaben und Freigabe bleiben offen: **NO_GO**.

## v98 – Schnellstart schützt den V1-Kernfokus (16. Oktober 2026)

- Schnellstart wählt ausschließlich passende Spiele aus den 15 eingefrorenen Kernspielen; experimentelle Labs und Erweiterungen bleiben im Katalog verfügbar, werden aber nicht zufällig empfohlen.
- Die im Hub gewählte Altersstufe (insbesondere „Nur familienfreundlich“) gilt ebenfalls für die Schnellstart-Auswahl.
- Fehlt die Release-Einstufung beim Laden, wird statt einer nicht abgesicherten Zufallsauswahl der Katalog gezeigt.
- Neue Browserregressionstests prüfen 20 Zufallsauswahlen, Spielerlimits und fehlende Einstufung.
- Offline-Cache v97 → v98. Release-Gates und echte Geräte-/Gruppentests bleiben offen: **NO_GO**.

## v97 – Echte Gruppe bei der ersten Partie (15. Oktober 2026)

- Neue Installationen zeigen keine erfundene, spielbereite Gruppe mehr: 0 echte Personen, Startseiten-Schaltfläche „Spieler einrichten“ und gesperrte Spiele bis zur Gruppeneinrichtung.
- Die gemeinsame Lobby, Smart Party Night und Word Imposter beginnen ohne Beispielnamen. Bereits gespeicherte Gruppen, Presets, Backups und laufende Sessions bleiben unverändert.
- Direkte v2-Spiel-URLs mit zu wenigen Spielern führen zur Spielereinrichtung, statt einen stillen Fehlstart auszulösen.
- Bestehende Tests erhalten ihre ausdrücklichen Testgruppen; E2E-Regressionen für Erststart, gespeicherte Altgruppe, Spielstart und Planer ergänzt.
- Offline-Cachegeneration v96 → v97 und Core-Prüfsumme synchronisiert. Abhängigkeit: PR #35 (v96) vorher integrieren.
- Externe Gruppen-/Gerätetests und finaler Release-Signoff bleiben offen; **NO_GO**.

## v96 – Beschädigte Deep-Links sicher behandeln (15. Oktober 2026)

- Der Party-Hub fängt ungültige Prozent-Kodierungen im URL-Fragment ab und zeigt die Startseite statt beim Initialisieren mit URIError auszusteigen.
- Browserregression für direkte Einstiege über `/`, `index.html`, `v2-hub.html` sowie fehlerhafte Hashwechsel ergänzt.
- Offline-Cachegeneration v95 → v96; Core-Prüfsumme nach unverändertem Sperralgorithmus aktualisiert.
- **Nachweise offen:** CI auf dem PR-Head, echte Geräte, installierte PWA-Upgrades und Gruppenabnahme; Release bleibt NO_GO.

## P0-Routing – 15. Oktober 2026 (PR #34 in main integriert; finale Geräte-/Releaseabnahme offen)

- Kanonischer Einstieg: `/` und `index.html` zeigen den Party-Hub; `v2-hub.html` bleibt Legacy-Alias.
- Word Imposter ist separat auf `word-imposter.html` erreichbar; die lokalen Speicher-Keys werden nicht verändert.
- Manifeststart `./`, alle betroffenen Katalog-/Direktlinks und Browser-Verträge aktualisiert; Offline-Core-Generation v93 → v95. Version v94 wurde nur im unveröffentlichten PR erprobt.
- Browser-/Offline-/Geräte-/Upgrade-Abnahmen: bis zu tatsächlich erfolgreichen Nachweisen OFFEN; kein Release-GO.

# Changelog

Alle nennenswerten Änderungen an Secret Circle werden hier dokumentiert.

## v96 – Freigegebenes Word-Imposter-Cartoonbild und Bildvergleich

- Word Imposter zeigt das von Arman konkret freigegebene 3D-Cartoon-Chamäleon: leere Karte, gleiche Schlüssel-Hinweise bei den anderen und korrigierte Augen mit genau einer Pupille je Auge. Die lokale WebP-Datei hat 800 × 600 Pixel und 34.030 Bytes.
- Wahrheit oder Pflicht zeigt standardmäßig Hutgeständnis und Besen-Luftgitarre; die alternative Masken-/Kissenszene lässt sich direkt unter dem Detailbild ansehen.
- Die vorher vorbereiteten gezeichneten Wahrheit-oder-Pflicht-Proben bleiben zum Vergleich erreichbar; neue Bilder der gewählten 3D-Cartoonserie entstehen ab jetzt einzeln mit Freigabe vor jedem Einbau. Herkunft, Rechtebelege, Alt-Texte, Medienvertrag und Offline-Core aktualisiert.
- Offline-Cachegeneration v96 liefert die neuen Bilder und die Bildauswahl an installierte Apps.

## v95 – Ausgewähltes Elefantenbild für Ich habe noch nie

- Von Arman ausgewähltes Motiv in Kacheln, Startseitenbanner und Spieldetail eingebunden: Elefant gibt mit erhobener Hand ein Erlebnis zu, die Mitspieler reagieren überrascht.
- Lokale WebP-Datei mit 800 × 600 Pixeln und 33.908 Bytes; Medienvertrag, Rechtebelege, Alt-Text und Offline-Core sind ergänzt.
- Neue Offline-Cachegeneration v95; Bildladen und Offline-Vollständigkeit bleiben durch Browserprüfungen abgesichert.

## v94 – Neues Bild für Wahrheit oder Pflicht

- Von Arman ausgewählte Neufassung direkt eingebunden: Magier legt verlegen seine Maske ab, Ziege erfüllt eine Balanceaufgabe mit drei Kissen.
- Das bestehende Word-Imposter-Bild ist die einzige Stilvorlage der Neufassung. Herkunft, Prompt, Rechtebeleg und deutscher Alt-Text sind aktualisiert.
- Lokale WebP-Datei mit 800 × 600 Pixeln und 33.946 Bytes; Offline-Cachegeneration v94 liefert den Bildwechsel auch an installierte Apps.

## v93 – Drei animierte Spielbilder als Vorschau in der App

- Word Imposter, Wahrheit oder Pflicht und Mafia zeigen eigene Szenen aus derselben animierten Bildwelt in Kacheln, Startseitenbanner und Spieldetail.
- Die erste Mafia-Szene mit heimlicher Absprache auf dem Stadtplatz ist die gewählte Stilvorlage; Kleidung, Mimik und Handlung der anderen Motive richten sich nach ihrem Spiel.
- Lokale WebP-Dateien mit 800 × 600 Pixeln und maximal 35 KB, deutsche Alt-Texte und neue Offline-Cachegeneration v93.
- Direkter Einbau als App-Vorschau auf Armans Anweisung vom 14. Oktober 2026; der frühere Auftrag „nur erzeugen und zeigen“ ist dafür ersetzt.

## v92 – Spiel zuerst, Steuerung darunter; eine Spielerliste für alle

- Hub-Spiele: Die Spielkarte steht oben, die Steuerung darunter. Reihenfolge: „Runde überspringen“ und „Pause“, danach „Beenden & speichern“ und „Abbrechen & verwerfen“. „Abbrechen“ steht damit nicht mehr neben „Pause“.
- Die Zeile mit Runden und Punkten erscheint erst, wenn es etwas zu zählen gibt (kein „0 Runden“ mehr zu Beginn).
- Tab-Reihenfolge folgt der neuen Anordnung; der Fokus bleibt im Spieldialog und springt am Ende an den Anfang zurück.
- Eine Spielerliste für alle Spiele: Word Imposter übernimmt beim Öffnen die Gruppe, gültige Änderungen dort landen wieder in der Gruppe (andere Hub-Daten bleiben unverändert). Ungültige Gruppen (unter 3 Personen, doppelte oder zu lange Namen) werden nicht übernommen. Laufende Spiele behalten ihre Namen.
- Startseite: Auch bei Word Imposter zeigt das Spieldetail die Spielerzahl und sperrt den Start bei zu wenigen Personen.
- Profil: „Partyabend planen“ und „Eigenes Spiel erstellen“ sind vorerst ausgeblendet. Die Seiten selbst und bereits erstellte eigene Spiele bleiben erhalten.
- „Daten und eigene Inhalte“ ist aus den Einstellungen verschwunden. Sichern und Löschen aller Daten erreicht man jetzt unter Profil → Datenschutz → „Daten sichern oder löschen“. Die Seite zeigt nur die Datenansicht ohne die alte Hub-Navigation und hat oben „← Profil“.
- Word Imposter: 1470 statt 168 Begriffe – jede der 14 Kategorien hat jetzt 105 Begriffe mit eigenem Hilfswort. Alle neuen Begriffe sind allgemeine Wörter ohne Marken, Franchise-Namen oder echte Personen.
- Word Imposter: Eine neue Partie meidet die zuletzt gespielten Begriffe aus dem Verlauf (bis zu 20), bis die Kategorie durch ist. Kein neuer Speicher-Key.
- Word Imposter: „Kategorie“ öffnet eine eigene Seite mit allen Kategorien als große Zeilen (mit „Über 100 Begriffe“ je Kategorie bzw. „Über 1400 Begriffe“ bei Gemischt) statt einer Aufklappliste. Auswahl, „← Zurück“ oder Escape schließen sie; der Fokus kehrt zur Zeile zurück.
- Word Imposter: Das Zahlenfeld der Rundenzeit ist 44 px breit (vorher 30 px), passend zu den Mindestmaßen für Tippflächen.
- Die drei bisherigen Spielbilder (Word Imposter, Wahrheit oder Pflicht, Ich habe noch nie) sind entfernt; alle Spiele zeigen ihr Emblem, bis neue Bilder nach `docs/BILDWELT_V2.md` entstehen. Der Offline-Kern wird dadurch rund 190 KB kleiner.
- Neue Offline-Cachegeneration v92.

## v91 – Word Imposter: schneller Einstieg und geheime Abstimmung

- Erweiterte Einstellungen standardmäßig eingeklappt; klarer Spielstart mit Kategorie und Standardwerten.
- Geheime Abstimmungen inklusive Stichwahl und Wiederaufnahme mit Übergabeansicht.
- Imposter spricht das Wort laut; die Gruppe bestätigt richtig/falsch. Alte gespeicherte Spiele bleiben kompatibel.
- Bestehende Spieler des Party-Hubs können beim Einrichten importiert werden.
- Engine-, Browser- und Accessibility-Tests aus PR #22 übernommen.
- Neue Offline-Cachegeneration v91; Prüfsumme wird aus demselben Integrationsstand in CI ermittelt.

## v90 – Zuverlässige Dialog-Navigation unter Safari und WebKit

- Hub-Spiel- und Spieldetaildialoge: Tab und Shift+Tab navigieren explizit zwischen den aktuell sichtbaren, aktivierten Bedienelementen, unabhängig von browserabhängiger Standard-Tab-Reihenfolge.
- Accessibility-Contract und Playwright-Regressionstest für Vorwärts- und Rückwärtsnavigation aktualisiert.
- Offline-Cachegeneration v90 und SHA-256-Core-Prüfsumme synchronisiert; vollständige CI-/Browserabnahme erfolgt separat.

## v89 – „Zuletzt gespielt“ auch auf der Startseite

- Startseite: Eine Reihe „Zuletzt gespielt“ steht über den anderen Reihen und sieht aus wie sie. Sie zeigt die zuletzt beendeten Spiele, jedes einmal, schon ab einem Spiel. „Alle ansehen“ führt zur Liste mit Namen und Datum im Profil.
- Ohne Verlauf erscheint die Reihe nicht.

## v88 – Weiterspielen nur im Profil, „Zuletzt gespielt“ mit Namen

- Startseite: Die Karten „Weiterspielen“ oben sind weg. Gespeicherte, nicht beendete Spiele stehen nur noch im Profil.
- Profil: „Zuletzt gespielt“ ist eine schlichte Liste der beendeten Spiele, neueste zuerst, mit den Namen der Runde und dem Datum. Ein Tipp öffnet das Spiel.
- Der Verlauf speichert jetzt, wer mitgespielt hat: `session-ledger.js` legt die Namen (`players`) an jeden Abschluss, Advanced-Spiele und Word Imposter ebenso. Ältere Einträge ohne Namen zeigen nur das Datum.

## v87 – Altes Design gelöscht, alles im v2-Design

- Die Oberfläche von `party.html` (Start, Katalog, Spieler, Favoriten, Verlauf und Erfolge, Daten und Sicherung, eigene Kategorien, Partyabend-Planer, Spieldetail, Anleitung) trägt jetzt das v2-Design: neutrale dunkle Flächen, weiße Pillen-Knöpfe, Archivo-Black-Überschriften. Alle Funktionen, IDs und Abläufe bleiben unverändert.
- Neue Stildateien: `v2-party-hub.css` für diese Oberfläche, `v2-update.css` für den Hinweis „Neue Secret-Circle-Version bereit“.
- Gelöscht: `party.css`, `party-extra.css`, `party-night.css`, `party-guide.css`, `party-release.css`, `party-search.css`, `pwa-update.css`. `runtime-guard.js` und `party-hub-polish.js` laden sie nicht mehr nach.
- Manifest und `party.html` verwenden die v2-Grundfarbe `#0A0B0F` als Theme- und Hintergrundfarbe.
- Die Fußzeile von `party.html` führt zur Startseite zurück und nennt keine „lokale Offline-PWA“ mehr.
- Prüfungen, die die alten Stildateien lasen, prüfen dieselben Zusagen jetzt in `v2-party-hub.css` und `v2-update.css`.

## v84 – Überflüssige Hinweise entfernt

- Word Imposter: Die Fußzeile („Version … · Lokale Offline-PWA · Datenschutz“) und die Zeile „Secret Circle · Offline-Partyspiel“ über dem Titel sind weg.
- Die Versionsnummer steht jetzt klein unten im Profil der Startseite; der Datenschutz bleibt dort unter Profil → Datenschutz erreichbar.
- Creator: Der Entwicklerhinweis „Für spätere Bilder und Animationen vorbereitet“ und der Zusatz „Secret Circle Creator · lokale Daten“ in der Fußzeile sind entfernt.

## v83 – Verbindungsanzeige nur noch offline

- Die Anzeige „Online · offline bereit“ oben rechts ist weg. Word Imposter, Party Hub und Quick Play zeigen nur noch „Offline-Modus“, wenn das Gerät kein Netz hat; online bleibt die Stelle leer.

## v82 – Hilfswort an oder aus, dazu drei Stufen

- Word Imposter: Ein Schalter „Hilfswort für Imposter“ stellt das Hilfswort an oder aus. Ist es an, gibt es drei Stufen: Einfach (Hilfswort), Mittel (nur die Kategorie) und Schwer (nur die Anzahl der Buchstaben des Begriffs). Aus heißt: Der Imposter sieht nichts.
- Die Spiellogik kennt dafür `hintLevel: 'off'`; ältere Spielstände mit `useHint: false` werden als „aus“ gelesen. Die gewählte Stufe bleibt gespeichert, auch während das Hilfswort aus ist.
- Größenbudget für `v2-imposter.css` von 20 auf 24 KB angehoben, weil die Datei jetzt die ganze Einrichtung (Spielerliste, Regler, Schalter, Stufen) trägt.

## v81 – Startseite: schwarze Spielseiten, ganze Bilder, änderbare Namen, „Gemischt“

- Spielseiten, Spieler- und Kategorieseite sowie die Spielansichten sind einheitlich schwarz mit weißer Schrift und weißen Hauptknöpfen statt in der Farbe der Spielart; die Farbe bleibt als Punkt bei den Spielkacheln und als kleiner Akzent im Spiel.
- Spielbilder werden oben statt mittig zugeschnitten, damit Köpfe nicht abgeschnitten sind.
- In der gemeinsamen Spielerliste lassen sich Namen direkt antippen und ändern; doppelte Namen werden abgelehnt.
- Hub-Spiele mit mehreren Kategorien bieten zuerst „Gemischt“ an: Es nimmt die Karten aller Kategorien in fester Reihenfolge zusammen (`party-hub-round-state.js`), auch beim Fortsetzen nach dem Neuladen. Die Kategorie-Logik der Startseite liegt jetzt in `v2-hub-packs.js`.

## v80 – Hilfswort in drei Stufen

- Word Imposter: Statt des Schalters „Hilfswort“ gibt es die Stufen Einfach (Imposter sieht das Hilfswort), Mittel (nur die Kategorie des Begriffs) und Schwer (nichts). Eine Zeile darunter sagt, was die Stufe bedeutet.
- Die Spiellogik speichert die Stufe (`hintLevel`) und die Kategorie des Begriffs (`hintGroup`); ältere Spielstände und Einstellungen mit `useHint` laden weiter und werden als Einfach bzw. Schwer gelesen.

## v78 – Spielerliste zum Bearbeiten, freie Rundenzeit und Rundenzahl

- Word Imposter zeigt die Spieler als Liste: Jeder Name steht in einem eigenen Feld und lässt sich direkt ändern; × entfernt, „Spieler hinzufügen“ öffnet ein neues Feld. Leere Felder verschwinden wieder, doppelte Namen werden rot markiert.
- Rundenzeit (1–10 Minuten) und Runden (1–20) lassen sich in Einerschritten mit − und + oder per Eingabe einstellen statt nur in festen Stufen. Gespeicherte Einstellungen übernehmen jeden Wert in diesem Bereich.
- Der Fokusrahmen um den Spielbereich nach dem Laden entfällt; per Tastatur erreichbare Bedienelemente behalten ihren Fokusrahmen.

## v77 – Word Imposter ohne eigene Kategorien

- Word Imposter bietet nur noch die eingebauten Kategorien zur Auswahl; das Anlegen und Löschen eigener Kategorien ist aus der Einrichtung entfernt.
- Gespeicherte eigene Kategorien älterer Versionen bleiben im Speicher und in der Sicherung erhalten, werden aber nicht mehr angeboten; eine darauf zeigende Einstellung fällt auf „Gemischt“ zurück.

## v76 – Einfachere Einrichtung bei Word Imposter

- Spieler werden als Namen hinzugefügt und mit × entfernt statt in ein Textfeld getippt; doppelte Namen fängt das Feld direkt ab.
- Imposter, Rundenzeit und Runden stellt man mit − und + in je einer Zeile ein; das Hilfswort ist ein Schalter.
- „Letzte Runden“ und „Lokale Daten“ (Sicherung, Import, alles löschen) sind von der Einrichtung entfernt. Sicherung und Löschen bleiben im Profil unter „Daten und eigene Inhalte“ und umfassen weiter die Word-Imposter-Daten; der Verlauf wird weiter genau einmal gespeichert.
- Die Kurzanleitung über dem Formular entfällt; die Regeln stehen weiter unter „Spielregeln und Punkte“. Datenschutz ist über die Fußzeile erreichbar.

## v75 – Ungenutzte alte Stildateien entfernt

- `styles.css`, `pwa.css`, `creator.css` und `party-quick.css` werden von keiner Seite mehr geladen und sind gelöscht; Offline-Core, Größenbudget und Offline-Tests nennen sie nicht mehr.
- Die Zusage „reduzierte Bewegung und Touch-Mindesthöhe“ aus `creator.css` prüft `tests/accessibility-contract.test.js` jetzt für `v2-creator.css`, `v2-imposter.css` und `v2-advanced.css`.

## v74 – Creator im v2-Design

- `creator.html` nutzt `v2-theme.css` und die neue `v2-creator.css` statt `party.css`, `party-guide.css` und `creator.css`.
- Vorlagen, Felder, Icon- und Akzentwahl, Karteneditor, Prüfung, Vorschau, „Meine Spiele“ und Hilfeblatt folgen dem v2-Design; Akzentfarben erscheinen als Punkt statt als Fläche.
- Bei 320 px Breite läuft nichts mehr seitlich über. Logik, IDs und Fokusführung bleiben unverändert.

## v73 – Advanced-Spiele im v2-Design

- `advanced.html` (Mafia, Zwei Wahrheiten, Ortsspion, Fragen-Imposter) nutzt `v2-theme.css` und die neue `v2-advanced.css` statt `party.css` und `party-extra.css`.
- Einrichtung wie Quick Play; die Spielansicht trägt den roten Grundton von „Täuschung & Bluff“ wie die Party-Spielansicht. Lange Formulare lassen die Spielkarte nicht mehr schrumpfen.
- Spiellogik, IDs, Verdecken und Fortsetzen bleiben unverändert.

## v72 – Word Imposter im v2-Design

- `index.html` (Word Imposter) und `privacy.html` nutzen `v2-theme.css` und die neue `v2-imposter.css` statt `styles.css` und `pwa.css`.
- Einrichtung zeigt das Chamäleon-Spielbild; Karte, Timer, Abstimmung und Auflösung folgen den v2-Spielbildschirmen. Lange Begriffe werden getrennt statt mitten im Wort umgebrochen.
- Beim Start springt die Seite nicht mehr unter Titel und Bild (Fokus ohne Scrollen auf der Einrichtung). Spiellogik, IDs, Verdecken und Fortsetzen bleiben unverändert.

## v71 – Codex-Stände zusammengeführt

- Quick Play (v2), Party-Spielansicht (v2) und die ersten drei Spielbilder liegen jetzt in einem gemeinsamen Stand.
- Offline-Core enthält `v2-play.css`, `v2-party-play.css` und die drei WebP-Spielbilder; Medienvertrag nennt sechs Laufzeitmedien und acht PR-Screenshots.

## v70 – Spielbild für „Ich habe noch nie“

- Eigenständigen Elefantencharakter als lokales WebP in die v2-Spielansicht aufgenommen.
- Herkunft, Medienvertrag und Offline-Core um das Bild erweitert; Handy- und Desktop-Screenshots für PR #19 ergänzt.

## Unreleased – Januar-2027 Release Foundation

Stand: 3. Oktober 2026

### Aktueller Status

- Source-Generation: **v82**
- Built-ins: **55 · 15 Core / 13 Extended / 27 Labs**
- Expansion Wave 1: **10/10 quellsseitig implementiert; real evidence OPEN**
- Core Source Review/Hardening: **15/15 PREPARED**
- Accessibility: **PREPARED**
- Spezialgates DWI bis HS60: **quellsseitig PREPARED, real offen**
- Offline-Core: **`secret-circle-v70` / `secret-circle-v70-staging`**
- `release-evidence.json`: **PREPARED / NO_GO**
- PR #13: **Draft / ungemergt**
- PR-Stack: **muss vor Release mit zwei späteren `main`-Commits reconciled werden**

### v68 – Party-Spielansicht im v2-Design

- `party.html` zeigt die laufenden Hub-Spiele mit v2-Farben, Schriften, Karten und Steuerung; die bisherige Hub-Oberfläche bleibt erhalten.
- `v2-party-play.css` ist lokal und offline verfügbar; Medien- und Sicherheitslogik der Spiele bleibt unverändert.
- Handy- und Desktop-Screenshots der Spielansicht als PR-Dokumentation inventarisiert.

### v67 – Quick Play im v2-Design

- Setup, Spielansicht, Pause, Sitzungssteuerung und Ergebnis nutzen `v2-theme.css` und `v2-play.css`.
- Die bestehende Spiellogik, Element-IDs, Fortsetzung und Offline-Funktionen bleiben erhalten.
- `v2-play.css` ist Teil des Offline-Core; die Cachegeneration wurde nach dem Style-Wechsel erhöht.

### v46–v47 – Accessibility

Hub-A11y sowie Advanced/Quick/Creator-Fokus-/Modal-/Radiogroup-Hardening eingeführt. Reale Screenreader-/Geräteabnahme bleibt offen.

### v48 – Word-Imposter Data/Resume

Voting-Resume, Daten-/Importgrenzen und kein stilles Trunkieren gehärtet.

### v49–v50 – Hub Resume Guard

Zentraler Hub-Resume-Guard v2; Cross-Mode-/Timer-Inkonsistenzen fail-closed; Resume-Aktionen während Guard-Ladung deaktiviert.

### v51 – Complete Backup

Registry-basierte Key-Eigentümerschaft, Future-Key/-Version-Erhalt, Vorvalidierung und managed-only Restore/Rollback.

### v52–v54 – Hub Round / Privacy / Pre-Timer Resume

Sichere Current-Runden bleiben über Reload stabil; Paranoia behält verdeckt Frage/Resultat; Hot-Potato-/Word-Chain-Pre-Timer-Werte bleiben bis zum Timer-Handoff stabil.

### v55 – Advanced Integrity

Advanced Resume Guard v4, Location-/Mafia-Integrität, exact-once-Abschluss und bestätigter Advanced-Session-Ersatz.

### v56 – Quick Session Replacement

Quick Replacement Guard v1 schützt Same-/Cross-Game-Ersatz in Quick/Trending, Mega, Viral und Creator; Cancel erhält Altstand, Write-Fail bleibt fail-closed.

### v57 – Quick Timer Resume

Promptfreier Store `secret-circle-party-quick-timers-v1` für Restzeit-Metadaten; Resume nur bei exakt passender Game-ID, Session-ID, Runde, Phase und Ausgangsdauer; Complete Backup verwaltet 17 exakte aktuelle Storage-Keys.

### v58 – BFCache Timer Resume

`pageshow.persisted` mit passendem Snapshot führt kontrolliert in den normalen QT57-Resume-Pfad; stale Snapshot wird gelöscht, ohne unnötigen Reload.

### v59 – Background Timer Fairness

`document.hidden` pausiert laufende Quick-/Trending-/Mega-/Viral-/Creator-Timer; Hintergrundzeit wird nicht abgezogen; sichtbare Rückkehr verlangt explizites `Fortsetzen`.

### v60 – Hidden Snapshot Durability

- `party-session-controls.js` auf **Version 5** erhöht.
- `visibilitychange(hidden)` persistiert die technische Restzeit sofort in den bestehenden promptfreien Timer-Store.
- Hidden-Persistenz setzt **nicht** `preservePersistedOnNextStop`; ein normaler Same-Page-Stop räumt den Snapshot wieder auf.
- nur der `pagehide`-Pfad setzt Preserve-on-next-stop, damit der unmittelbar folgende Engine-Stop den Snapshot nicht löscht.
- Cold Resume nach mobilem OS-/Browserprozess-Kill ist quellsseitig auch dann vorgesehen, wenn `pagehide` nicht mehr zuverlässig ausgeführt wird.
- der Hidden-Snapshot wird beim Cold Resume genau einmal über QT57 konsumiert.
- HS60 als eigener realer Mobile-/PWA-Abnahmetest definiert.

### v61 – Wave 1 Quiz

- gemeinsame Quiz-Infrastruktur eingeführt
- `party-quiz` und `fact-or-fake` als Labs integriert
- Result-Resume und exact-once Score/History quellsseitig abgesichert

### v62 – Wave 1 Imposter

- gemeinsame Imposter-Infrastruktur ergänzt
- `undercover-similar-word` und `no-word-imposter` als Labs integriert
- private Handoff-/Vote-/Guess-Grenzen und Resume-Verträge ergänzt

### v63 – Wave 1 Writing

- gemeinsame Writing-Infrastruktur ergänzt
- `fill-blank-battle` und `who-wrote-it` als Labs integriert
- private Eingaben, anonyme Phasen und exact-once Completion quellsseitig gehärtet

### v64 – Expansion Wave 1 Complete

Expansion Wave 1 ist quellsseitig mit **10/10 geplanten Labs** komplett:

1. `bluff-trivia`
2. `party-quiz`
3. `fact-or-fake`
4. `percent-guess`
5. `fill-blank-battle`
6. `who-wrote-it`
7. `party-bracket`
8. `undercover-similar-word`
9. `no-word-imposter`
10. `password-one-word`

Gemeinsame Architektur:

- sechs wiederverwendbare Enginefamilien: Quiz, Imposter, Writing, Estimation/Voting, Bluff und Clue
- `quick-loader.js` **v11** routet alle Wave-1-Familien explizit
- `party-release-structure.js` **v5** hält alle zehn Wave-1-Modi in Labs
- aktueller zusammengesetzter Katalog: **55 Built-ins / 15 Core / 13 Extended / 27 Labs**
- Wave-1-Unit-/E2E-/Audit-Verträge sind vorbereitet
- reale Browser-/PWA-/Accessibility-/Gruppenevidence bleibt offen

### v69 – Bildüberlagerungen korrigiert

Empfehlungsbadge und Rangzahl bleiben vor Spielbildern sichtbar.

### v68 – Bildbanner auf dem Handy korrigiert

Das neue Startbanner begrenzt die Bildhöhe; Titel, Beschreibung und Startknopf bleiben bei 375 × 812 sichtbar. Ein Browser-Test prüft Laden und Bild-Titel-Abstand in Chromium und WebKit.

### v67 – Erste Spielbilder im v2-Hub

Word Imposter zeigt das vom Nutzer ausgewählte Chamäleon; Wahrheit oder Pflicht zeigt die Eule beim Antworten und den Waschbären bei einer Aufgabe. Beide Motive sind lokale WebP-Dateien, in Spielkacheln, Startbanner und Spieldetails eingebunden und im Offline-Core enthalten. Vier WebP-Screenshots dokumentieren beide Ansichten auf Handy und Desktop für den PR. Medieninventar, Provenienz, Rechtehinweise und Größenbudgets wurden entsprechend erweitert.

### v66 – Oberfläche im Claude-Design

Das Design aus Claude Design (`v2-hub.html`, `v2-hub.js`, `v2-theme.css`, Schriften in `fonts/`) ist zurück und jetzt die Startseite der App. Es war am 24. September als ungenutzter Prototyp entfernt worden.

- „Spiel starten“ übergibt an die geprüften Engines statt an die vereinfachte eigene Spielmechanik des Prototyps (die entfällt). Hub-Spiele starten über `party.html?play=…&from=v2` und kehren danach zu v2 zurück.
- Spielerliste, Verlauf und gespeicherte Spielstände sind dieselben wie im Rest der App; der Prototyp hatte einen eigenen Speicher.
- Die sechs Farbwelten bündeln die neun aktuellen Katalog-Gruppen. Mit der alten Zuordnung wären fast alle Spiele unter „Täuschung“ gelandet.
- „Top 10 aktuell“ und „Meistgespielt“ ohne Datengrundlage ersetzt: „Meistgespielt“ nur mit echtem Verlauf, sonst „Empfehlung“.
- Die Startseite bietet echte gespeicherte Spielstände zum Fortsetzen an.
- Content-Security-Policy, Manifest, `runtime-guard.js` und vollständige Katalogkette ergänzt; Inline-Styles durch Klassen ersetzt.
- Zurück-Links der Spielseiten, Creator und Datenschutzseite führen zu v2.
- Schriften: Die zwölf Dateien aus dem Design-Export waren teilweise defekt (unter anderem Archivo Black); der Browser zeigte dort eine Ersatzschrift. Ersetzt durch vier Originaldateien von Google Fonts, Figtree als variable Schrift (52 statt 136 KB).

### v65 – Offline-Core-Sperre und Hub-Korrekturen

Seit dem 10. September hatten 16 Commits Offline-Core-Dateien geändert, ohne die Cachegeneration zu erhöhen. Installierte Apps bekamen deshalb frisches HTML zu alten Skripten und Styles. v65 liefert alle diese Korrekturen aus.

- `scripts/offline_core_lock.py` hält eine Prüfsumme über alle CORE-Dateien in `release-meta.json` fest. `npm run validate` schlägt fehl, sobald sich eine Datei ändert, ohne dass die Generation steigt.
- `python3 scripts/offline_core_lock.py --bump` erhöht die Generation und zieht `sw.js`, `release-meta.json`, `operator-release.json`, `privacy.html` und die Statusdokumente nach.
- Hub: Ein neues Spiel ersetzt einen gespeicherten Spielstand nur noch nach Rückfrage; die alte Fortsetzen-Karte verschwindet danach.
- Hub: Die Beschriftung des Startknopfs entsteht nur noch in `party-hub.js`. `party-hub-polish.js` (v18) und `party-hub-plus.js` (v6) überschreiben sie nicht mehr.
- Hub: Spiele werden über ihre ID erkannt statt über den Titel. Ein eigenes Spiel mit dem Namen eines eingebauten wird nicht mehr verwechselt.
- Hub: Beobachter und Fokusfalle bleiben nach `pagehide` verbunden. Nach der Rückkehr aus dem Back-Forward-Cache stimmen Knopftexte, Spielhinweise und Tastaturfokus weiterhin.
- Service Worker: Das Staging lädt den Offline-Core mit `cache: 'reload'`. Vorher konnte ein Update noch frische HTTP-Cache-Einträge der alten Version übernehmen und sie bis zur nächsten Generation offline ausliefern.
- Party Night aktualisiert sich nach „Spiel beenden“ wieder; der Klick-Hook zeigte auf den entfernten Knopf `#exit-game`.
- Hub: Die Fortsetzen-Karte bleibt gesperrt, bis der Resume-Schutz den gespeicherten Stand geprüft hat. Vorher ließ sich ein inkonsistenter Timer-Stand fortsetzen, solange die Skripte noch luden.
- Hub: Die Einführungskarte schließt auch, wenn der Speicher voll oder gesperrt ist.
- Party Night plant ohne gespeicherte Gruppe mit derselben Beispielgruppe wie Hub und Spiel-Engines. Vorher zeigte der Planer bei neuen Nutzern „0 Personen“ und verweigerte den Plan.
- `tests/cross-browser/smoke.spec.js` lief nie und prüfte noch den Stand mit 45 Spielen; er ist auf 55 Spiele und die aktuellen Texte nachgezogen.
- Katalog: Die beworbenen Kategorien von `wavelength`, `draw-guess`, `sound-imitation` und `forehead-guess` entsprechen jetzt dem Inhalt. Die Suche fand vorher „Filme“ oder „Fahrzeuge“, die es nicht gibt, aber nicht die sechs zusätzlichen Stirn-Raten-Kategorien.
- Offline-Core: zwölf Schriftdateien (136 KB) entfernt, die seit dem Entfernen des v2-Prototyps kein Stylesheet mehr nutzte.
- `tests/extended-labs-content-quality.test.js` prüft alle 55 Spiele und läuft jetzt in `npm test`; `scripts/extended_labs_content_audit.py` läuft in `npm run validate`.
- Statusdokumente und `release-evidence.json` beschreiben den CI-Stand wieder richtig: Der Runner-Ausfall ist seit dem 5. September 2026 behoben, der Cross-Browser-Workflow wurde noch nie gestartet.

### Release-Metadaten / Drift-Schutz

- neue zentrale `release-meta.json` für Source-Generation, Package-Version, Cachegeneration, Built-in-Zahlen, Wave-1-Status, Releasezustand, CI-Befund und PR-Stack
- `tests/party-release-structure.test.js` bindet `release-meta.json` an den real zusammengesetzten Runtime-Katalog
- `tests/service-worker.test.js` bindet Production-/Staging-Cache an `release-meta.json`
- dadurch sollen zukünftige Abweichungen wie v61-Doku bei v64-Runtime als Testfehler sichtbar werden

### PWA / Offline – v64

- Offline-Core auf **`secret-circle-v70` / `secret-circle-v70-staging`** erhöht.
- SessionControls v5, QT57, BF58, BG59, HS60, Quick Replacement Guard und Quick Loader v11 werden offline ausgeliefert.
- alle sechs Wave-1-Katalog-/Runnerfamilien sind im Service-Worker-Core enthalten.
- alle früheren Advanced-/A11y-/Resume-/Privacy-/Backup-Verträge bleiben enthalten.

### Build / CI

- `package-lock.json` v3; Playwright exakt 1.54.2; keine npm-Runtime-Dependencies.
- CI/Cross-Browser verwenden `npm ci`.
- Syntax-, Unit-, Contract-, Audit- und Playwright-Gates sind vorbereitet.
- frischer v64-Actions-Nachweis: **Run #3608**, Run ID `33253663445`, Job `99103557030`, Head `2297868e1f65b45753294151a3b1f401a55f6288`, `steps: []`, `runner_id: 0`, leerer Runner-Name.
- kein Repositorycode wurde in diesem Job ausgeführt.
- **v50–v64 haben keinen Hosted-Runner-PASS.**

### PR-/Branch-Stack

Aktuelle Kette:

`main` → PR #3 → PR #11 → PR #13.

PR #11 liegt vollständig auf #3 und PR #13 vollständig auf #11. Die erste Stack-Basis ist gegenüber aktuellem `main` jedoch diverged und enthält zwei spätere Main-Commits nicht in ihrer Abstammung:

- `6b6bddd0ae619d160b4468b61ae49cb30e2ea834`
- `d347c7138bae18325c288632222917ad618e6547`

Vor einer Release-Mergefolge muss diese Basis kontrolliert reconciled werden; danach sind wegen des neuen Kandidaten neue Release-Tests/Evidence erforderlich.

### Operator / Assets

- `operator-release.json` bleibt `PREPARED / BLOCKED`.
- reale Hosting-/Legal-/Support-/Incident-Evidence bleibt offen.
- Root-`icon.svg` bleibt bis echter Rechtebestätigung oder Ersatz `unresolved`.

### Releaseentscheidung

Zentrale offene Issues: **#7 CI**, **#8 Geräte/Beta/A11y + Spezialgates + Wave 1**, **#14 Operator/Hosting/Legal/Support**.

Zusätzlicher struktureller Blocker: **PR-Stack mit aktuellem `main` reconciliieren**.

Öffentlicher Release: **NO_GO**.
