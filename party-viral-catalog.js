(function (root, factory) {
  const base = typeof module === 'object' && module.exports
    ? require('./party-mega-catalog.js')
    : root.SecretCirclePartyCatalog;
  const api = factory(base);
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.SecretCirclePartyCatalog = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function (base) {
  'use strict';
  if (!base) throw new Error('Mega-Katalog für die Viral-Erweiterung fehlt.');

  const quickHref = id => `quick-play.html?game=${encodeURIComponent(id)}`;
  const newGames = [
    {
      id: 'put-a-finger-down', title: 'Finger runter', icon: '☝️', group: 'Social', status: 'playable', mode: 'link',
      href: quickHref('put-a-finger-down'), minPlayers: 2, maxPlayers: 20, duration: 12,
      moods: ['funny', 'friendly'], age: 'teen', featured: true,
      description: 'Eine sichere „Put a Finger Down“-Runde mit Alltag, Internet, Gaming, Essen, Reisen und Freundschaft.',
      instructions: ['Alle starten mit fünf Fingern.', 'Aussage laut vorlesen.', 'Wer sich wiedererkennt, nimmt einen Finger herunter.', 'Nach fünf Aussagen verbleibende Finger vergleichen.'],
      packs: ['Alltag', 'Internet', 'Gaming', 'Essen', 'Reisen', 'Freundschaft']
    },
    {
      id: 'guess-the-price', title: 'Preis schätzen', icon: '🏷️', group: 'Schätzen', status: 'playable', mode: 'link',
      href: quickHref('guess-the-price'), minPlayers: 2, maxPlayers: 20, duration: 15,
      moods: ['competitive', 'clever'], age: 'all',
      description: 'Schätzt den festgelegten Spielpreis. Die Werte sind reine Spielwerte und keine aktuellen Händlerpreise.',
      instructions: ['Gegenstand und Kategorie ansehen.', 'Preis in Euro schätzen.', 'Spielwert aufdecken.', 'Je näher die Schätzung, desto mehr Punkte.'],
      packs: ['Supermarkt', 'Technik', 'Reise', 'Party', 'Luxus', 'Absurd']
    },
    {
      id: 'higher-lower', title: 'Höher oder tiefer', icon: '↕️', group: 'Schätzen', status: 'playable', mode: 'link',
      href: quickHref('higher-lower'), minPlayers: 2, maxPlayers: 20, duration: 12,
      moods: ['competitive', 'clever'], age: 'all', featured: true,
      description: 'Entscheidet, ob die nächste stabile Zahl höher oder tiefer ist als die sichtbare Zahl.',
      instructions: ['Erste Karte mit Zahl ansehen.', 'Nächsten Begriff lesen.', 'Höher oder tiefer wählen.', 'Zahl aufdecken und Punkt vergeben.'],
      packs: ['Alltag', 'Zeit', 'Sport', 'Natur', 'Technik', 'Wissen']
    },
    {
      id: 'know-me-best', title: 'Wer kennt mich am besten?', icon: '🧠', group: 'Freundschaft', status: 'playable', mode: 'link',
      href: quickHref('know-me-best'), minPlayers: 3, maxPlayers: 20, duration: 20,
      moods: ['deep', 'friendly'], age: 'all',
      description: 'Die aktive Person wählt heimlich eine von drei Antworten. Die Gruppe versucht, diese Antwort vorherzusagen.',
      instructions: ['Aktive Person liest Frage und Optionen privat.', 'Antwort heimlich festlegen.', 'Gerät weitergeben und Gruppe abstimmen lassen.', 'Übereinstimmung aufdecken.'],
      packs: ['Alltag', 'Essen', 'Reisen', 'Freizeit', 'Zukunft', 'Freundschaft']
    },
    {
      id: 'hear-me-out', title: 'Hear Me Out', icon: '🎤', group: 'Debatte', status: 'playable', mode: 'link',
      href: quickHref('hear-me-out'), minPlayers: 2, maxPlayers: 20, duration: 15,
      moods: ['funny', 'deep'], age: 'teen',
      description: 'Verteidige eine überraschende, harmlose These in 30 Sekunden. Danach entscheidet die Gruppe, ob sie überzeugt ist.',
      instructions: ['These oder ungewöhnliche Idee ziehen.', '30 Sekunden überzeugend argumentieren.', 'Keine Person angreifen oder unter Druck setzen.', 'Gruppe stimmt über die Überzeugungskraft ab.'],
      packs: ['Essen', 'Alltag', 'Technik', 'Reisen', 'Fantasie', 'Unpopuläre Meinung']
    },
    {
      id: 'hot-seat', title: 'Hot Seat', icon: '🔥', group: 'Schnellfragen', status: 'playable', mode: 'link',
      href: quickHref('hot-seat'), minPlayers: 2, maxPlayers: 20, duration: 15,
      moods: ['funny', 'deep'], age: 'teen',
      description: 'Eine Person beantwortet in kurzer Zeit fünf sichere Schnellfragen. Überspringen ist jederzeit erlaubt.',
      instructions: ['Aktive Person festlegen.', 'Fünf Fragen aufdecken.', '45 Sekunden starten.', 'Alle beantwortet oder übersprungen markieren.'],
      packs: ['Locker', 'Entscheidungen', 'Erinnerungen', 'Zukunft', 'Chaos', 'Kreativ']
    },
    {
      id: 'story-chain', title: 'Story Chain', icon: '📖', group: 'Kreativ', status: 'playable', mode: 'link',
      href: quickHref('story-chain'), minPlayers: 3, maxPlayers: 20, duration: 15,
      moods: ['funny', 'chaotic'], age: 'all',
      description: 'Eine Geschichte beginnt mit einem Satz. Jede Person ergänzt genau einen Satz, bis der Timer endet.',
      instructions: ['Geschichtenanfang vorlesen.', 'Reihum jeweils einen Satz ergänzen.', 'Keine Korrekturen oder langen Monologe.', 'Nach 90 Sekunden gemeinsames Ende finden.'],
      packs: ['Alltag', 'Mystery', 'Fantasy', 'Science-Fiction', 'Reise', 'Chaos']
    },
    {
      id: 'finish-the-sentence', title: 'Satz beenden', icon: '✍️', group: 'Kreativ', status: 'playable', mode: 'link',
      href: quickHref('finish-the-sentence'), minPlayers: 2, maxPlayers: 20, duration: 12,
      moods: ['funny', 'friendly'], age: 'all',
      description: 'Die aktive Person beendet einen offenen Satz spontan. Die Gruppe vergibt den Punkt für eine ehrliche oder kreative Antwort.',
      instructions: ['Satzanfang anzeigen.', 'Aktive Person beendet ihn sofort.', 'Gruppe entscheidet über den Punkt.', 'Nächste Person und nächster Satz.'],
      packs: ['Alltag', 'Freundschaft', 'Reisen', 'Gaming', 'Fantasie', 'Zukunft']
    }
  ].map(Object.freeze);

  const viralContent = {
    'put-a-finger-down': {
      Alltag: ['Finger runter, wenn du schon einmal in einen Raum gegangen bist und vergessen hast, warum.', 'Finger runter, wenn du dein Handy gesucht hast, während du es in der Hand hattest.', 'Finger runter, wenn du einen Wecker weggedrückt und sofort weitergeschlafen hast.', 'Finger runter, wenn du einen Einkauf ohne Einkaufszettel bereut hast.', 'Finger runter, wenn du eine Nachricht geschrieben und doch nicht abgeschickt hast.', 'Finger runter, wenn du beim Aufräumen etwas verloren hast.', 'Finger runter, wenn du zu früh am falschen Treffpunkt warst.', 'Finger runter, wenn du denselben Kühlschrank zweimal hintereinander geöffnet hast.'],
      Internet: ['Finger runter, wenn du mehr als zehn Browser-Tabs offen hattest.', 'Finger runter, wenn du ein Video gespeichert und nie wieder angesehen hast.', 'Finger runter, wenn du einen Nutzernamen sofort bereut hast.', 'Finger runter, wenn Autokorrektur deine Nachricht verschlechtert hat.', 'Finger runter, wenn du eine App geöffnet und den Grund vergessen hast.', 'Finger runter, wenn du WLAN aus- und wieder eingeschaltet hast.', 'Finger runter, wenn du einen Gruppenchat stummgeschaltet hast.', 'Finger runter, wenn du einen Screenshot gemacht hast, den du nie brauchtest.'],
      Gaming: ['Finger runter, wenn du ein Tutorial übersprungen und später gesucht hast.', 'Finger runter, wenn du wegen eines Spiels länger wach warst als geplant.', 'Finger runter, wenn du einen Charakter nur wegen des Designs gewählt hast.', 'Finger runter, wenn du einen Speicherstand aus Versehen überschrieben hast.', 'Finger runter, wenn du bei einer Niederlage dem Controller die Schuld gegeben hast.', 'Finger runter, wenn du ein Spiel gekauft und kaum gestartet hast.', 'Finger runter, wenn du eine Nebenmission wichtiger fandest als die Hauptstory.', 'Finger runter, wenn du ein seltenes Item nie benutzt hast.'],
      Essen: ['Finger runter, wenn du direkt aus der Packung gegessen hast.', 'Finger runter, wenn du Essen bestellt hast, obwohl Zutaten zu Hause waren.', 'Finger runter, wenn du etwas probiert hast, nur weil es ungewöhnlich aussah.', 'Finger runter, wenn du beim Kochen improvisiert hast.', 'Finger runter, wenn du den letzten Snack heimlich reserviert hast.', 'Finger runter, wenn du ein Rezept nicht vollständig gelesen hast.', 'Finger runter, wenn du Frühstück zum Abendessen gegessen hast.', 'Finger runter, wenn du scharfes Essen unterschätzt hast.'],
      Reisen: ['Finger runter, wenn du zu viel eingepackt hast.', 'Finger runter, wenn du am falschen Bahnsteig gewartet hast.', 'Finger runter, wenn du im Urlaub etwas Wichtiges vergessen hast.', 'Finger runter, wenn du einen Ort nur wegen eines Fotos besucht hast.', 'Finger runter, wenn du eine Route trotz Navigation verpasst hast.', 'Finger runter, wenn du zu früh am Flughafen oder Bahnhof warst.', 'Finger runter, wenn du ein Souvenir nie benutzt hast.', 'Finger runter, wenn du eine spontane Reise besser fandest als eine geplante.'],
      Freundschaft: ['Finger runter, wenn du mit einer Person gleichzeitig denselben Satz gesagt hast.', 'Finger runter, wenn du einen Insider erklären musstest und er danach nicht mehr lustig war.', 'Finger runter, wenn du eine Verabredung fast vergessen hast.', 'Finger runter, wenn du ein Geschenk viel zu früh gekauft hast.', 'Finger runter, wenn du einem Freund ohne Nachfrage Essen mitgebracht hast.', 'Finger runter, wenn du eine Sprachnachricht mehrmals neu aufgenommen hast.', 'Finger runter, wenn du einen peinlichen Moment für einen Freund gerettet hast.', 'Finger runter, wenn du mit jemandem über eine Kleinigkeit sehr lange gelacht hast.']
    },
    'guess-the-price': {
      Supermarkt: [['Großer Obstkorb', 18], ['Picknick für vier Personen', 32], ['Backzutaten für einen Kuchen', 14], ['Wocheneinkauf für eine Person im Spiel', 48], ['Snackbox für einen Filmabend', 22], ['Frühstückspaket für vier Personen', 28], ['Gewürz-Starterset', 19], ['Getränkekiste im Spiel', 16]],
      Technik: [['Kabellose Kopfhörer im Spiel', 79], ['Kompakte Tastatur im Spiel', 64], ['Portable Powerbank im Spiel', 35], ['Webcam im Spiel', 58], ['Kleine Sofortbildkamera im Spiel', 95], ['Einfacher E-Reader im Spiel', 109], ['Gaming-Maus im Spiel', 52], ['Mini-Projektor im Spiel', 149]],
      Reise: [['Zug-Wochenendtrip im Spiel', 120], ['Zwei Nächte Camping im Spiel', 85], ['Städtetrip-Budget pro Person', 260], ['Tagesausflug mit Eintritt und Essen', 74], ['Reiserucksack im Spiel', 89], ['Koffer im Spiel', 115], ['Jugendherberge für zwei Nächte', 96], ['Fahrrad-Mietwochenende', 68]],
      Party: [['Snackbuffet für zehn Personen', 65], ['Karaoke-Zubehör im Spiel', 45], ['Dekoration für einen Spieleabend', 27], ['Große alkoholfreie Getränkerunde', 42], ['Fotoecken-Set im Spiel', 38], ['Pizzaabend für acht Personen im Spiel', 88], ['Mini-Preisbox für Gewinner', 30], ['Lichterkette und Tischdeko', 24]],
      Luxus: [['Designer-Sessel im Spiel', 1800], ['Privates Kinozimmer für einen Abend', 950], ['Luxus-Wochenende im Spiel', 2400], ['Sammleruhr im Spiel', 5200], ['Premium-Espressomaschine im Spiel', 1900], ['First-Class-Weltreise im Spiel', 18000], ['High-End-Gaming-Setup im Spiel', 6500], ['Kunstwerk einer fiktiven Galerie', 12000]],
      Absurd: [['Goldener Toaster im Spiel', 8400], ['Roboter, der nur Socken sortiert', 3200], ['Persönliche Wolkenmaschine', 760], ['Lebensgroße Drachenstatue', 14500], ['Automatischer Pfannkuchen-Wender', 480], ['Leuchtender Thron fürs Wohnzimmer', 2700], ['Mini-U-Boot für die Badewanne', 990], ['Zeitreise-Wecker ohne Zeitreise', 1250]]
    },
    'higher-lower': {
      Alltag: [['Tage einer Woche', 7], ['Monate eines Jahres', 12], ['Minuten einer Stunde', 60], ['Stunden eines Tages', 24], ['Karten in einem Standardspiel', 52], ['Buchstaben im deutschen Alphabet', 26], ['Ziffern von 0 bis 9', 10], ['Seiten eines Würfels', 6]],
      Zeit: [['Sekunden einer Minute', 60], ['Minuten eines Tages', 1440], ['Tage eines normalen Jahres', 365], ['Monate in fünf Jahren', 60], ['Stunden in zwei Tagen', 48], ['Sekunden in fünf Minuten', 300], ['Wochen in 28 Tagen', 4], ['Viertelstunden in zwei Stunden', 8]],
      Sport: [['Spieler eines Fußballteams auf dem Feld', 11], ['Ringe im olympischen Symbol', 5], ['Punkte für einen Touchdown', 6], ['Löcher einer normalen Golfrunde', 18], ['Meter eines Marathonlaufs gerundet', 42195], ['Bahnen eines olympischen 400-Meter-Stadions häufig', 8], ['Sätze zum Sieg im Herren-Grand-Slam-Tennis', 3], ['Spieler eines Basketballteams auf dem Feld', 5]],
      Natur: [['Planeten im Sonnensystem', 8], ['Beine einer Spinne', 8], ['Herzen eines Oktopus', 3], ['Flügel einer Biene', 4], ['Kontinente im verbreiteten Modell', 7], ['Farben eines klassischen Regenbogens', 7], ['Arme eines Seesterns häufig', 5], ['Jahreszeiten', 4]],
      Technik: [['Bits in einem Byte', 8], ['Tasten eines Standardklaviers', 88], ['Zustände eines klassischen Bits', 2], ['Zeichen einer Hexadezimalziffer', 16], ['Pixel in Full-HD-Breite', 1920], ['Pixel in Full-HD-Höhe', 1080], ['Sekunden in einer 2-Minuten-Aufnahme', 120], ['Kilobyte nach binärer Zählweise in Byte', 1024]],
      Wissen: [['Bundesländer Deutschlands', 16], ['Zähne eines erwachsenen Menschen typischerweise', 32], ['Saiten einer Standardgitarre', 6], ['Felder eines Schachbretts', 64], ['Figuren zu Beginn einer Schachpartie insgesamt', 32], ['Tage im Februar eines Schaltjahres', 29], ['Grad eines rechten Winkels', 90], ['Elemente des Periodensystems aktuell', 118]]
    },
    'know-me-best': {
      Alltag: [['Was würde ich an einem freien Morgen zuerst machen?', 'Weiter schlafen', 'Frühstücken', 'Rausgehen'], ['Was vergesse ich am ehesten?', 'Schlüssel', 'Termin', 'Einkauf'], ['Welche Tageszeit passt am besten zu mir?', 'Morgen', 'Nachmittag', 'Nacht'], ['Was würde ich spontan umorganisieren?', 'Zimmer', 'Handy', 'Wochenplan'], ['Was wähle ich bei schlechtem Wetter?', 'Film', 'Kochen', 'Spaziergang'], ['Was motiviert mich stärker?', 'Liste', 'Musik', 'Andere Person']],
      Essen: [['Welches Frühstück würde ich wählen?', 'Süß', 'Herzhaft', 'Nur Getränk'], ['Was teile ich am ungernsten?', 'Pommes', 'Dessert', 'Getränk'], ['Welche Richtung gewinnt?', 'Scharf', 'Süß', 'Salzig'], ['Was bestelle ich eher?', 'Bekanntes', 'Empfehlung', 'Etwas Neues'], ['Welche Mahlzeit könnte ich täglich essen?', 'Frühstück', 'Mittag', 'Abendessen'], ['Was wäre mein Notfall-Snack?', 'Obst', 'Schokolade', 'Chips']],
      Reisen: [['Welche Reise passt zu mir?', 'Stadt', 'Meer', 'Berge'], ['Wie plane ich?', 'Alles vorher', 'Nur Unterkunft', 'Spontan'], ['Was ist mir am wichtigsten?', 'Essen', 'Sehenswürdigkeiten', 'Ruhe'], ['Welches Verkehrsmittel wähle ich?', 'Bahn', 'Auto', 'Flugzeug'], ['Was kaufe ich als Souvenir?', 'Nützliches', 'Essen', 'Nichts'], ['Welche Unterkunft?', 'Hotel', 'Ferienwohnung', 'Camping']],
      Freizeit: [['Was wähle ich am Wochenende?', 'Gaming', 'Sport', 'Freunde'], ['Welches Event?', 'Kino', 'Konzert', 'Festival'], ['Was lerne ich eher neu?', 'Sprache', 'Instrument', 'Sportart'], ['Welche Aktivität entspannt mich?', 'Lesen', 'Kochen', 'Spazieren'], ['Was sammle ich eher?', 'Fotos', 'Erlebnisse', 'Gegenstände'], ['Welche Challenge reizt mich?', 'Kreativ', 'Sportlich', 'Wissen']],
      Zukunft: [['Wo würde ich später lieber wohnen?', 'Großstadt', 'Kleinstadt', 'Land'], ['Was wäre mir im Beruf wichtiger?', 'Geld', 'Freiheit', 'Sinn'], ['Welche Fähigkeit hätte ich gern?', 'Sprachen', 'Technik', 'Kreativität'], ['Was würde ich zuerst verbessern?', 'Gesundheit', 'Finanzen', 'Zeit'], ['Welche Zukunft klingt besser?', 'Planbar', 'Abenteuerlich', 'Flexibel'], ['Was würde ich gründen?', 'App', 'Geschäft', 'Verein']],
      Freundschaft: [['Was schätze ich am meisten?', 'Ehrlichkeit', 'Humor', 'Zuverlässigkeit'], ['Wie zeige ich Unterstützung?', 'Zuhören', 'Helfen', 'Ablenken'], ['Was plane ich lieber?', 'Essen', 'Ausflug', 'Spieleabend'], ['Was kann ich besser?', 'Trösten', 'Motivieren', 'Organisieren'], ['Was würde ich für Freunde tun?', 'Früh aufstehen', 'Weit fahren', 'Plan ändern'], ['Welche Gruppengröße mag ich?', 'Zu zweit', 'Kleine Gruppe', 'Große Runde']]
    },
    'hear-me-out': {
      Essen: ['Frühstück ist zu jeder Tageszeit die beste Mahlzeit.', 'Pommes passen besser zu Eis als erwartet.', 'Suppen sind unterschätztes Partyessen.', 'Ein Sandwich wird besser, wenn es ungewöhnlich knusprig ist.', 'Süß und salzig gehören fast immer zusammen.', 'Das beste Getränk ist manchmal einfach kaltes Wasser.', 'Reste schmecken am nächsten Tag oft besser.', 'Ein Snackteller kann ein vollständiges Abendessen sein.'],
      Alltag: ['Ein leerer Kalender ist luxuriöser als ein voller.', 'Frühes Ankommen ist entspannter als perfektes Timing.', 'Aufräumen mit Timer macht überraschend Spaß.', 'Notizen auf Papier sind manchmal schneller als jede App.', 'Ein Spaziergang löst mehr Probleme als ein langer Gruppenchat.', 'Das beste Wochenende braucht keinen großen Plan.', 'Man sollte Dinge öfter reparieren statt sofort ersetzen.', 'Ein kurzer Mittagsschlaf ist eine Superkraft.'],
      Technik: ['Ein altes Gerät mit gutem Akku ist besser als ein neues mit vielen Funktionen.', 'Weniger Benachrichtigungen machen ein Smartphone nützlicher.', 'Sprachmemos sind manchmal besser als lange Texte.', 'Ein einfacher Kalender ist wichtiger als zehn Produktivitäts-Apps.', 'Offline-Funktionen sind wichtiger als ein schickes Konto.', 'Ein Kabel ist manchmal zuverlässiger als drahtlos.', 'Ein gutes Suchfeld ist wertvoller als komplizierte Menüs.', 'Technik sollte sich häufiger selbst erklären.'],
      Reisen: ['Eine langsame Bahnreise kann Teil des Urlaubs sein.', 'Ein Tag ohne Sehenswürdigkeiten ist oft der beste Reisetag.', 'Weniger Gepäck führt zu besseren Reisen.', 'Kleine Orte sind spannender als berühmte Hotspots.', 'Regen kann einen Städtetrip verbessern.', 'Ein Supermarktbesuch sagt viel über ein Reiseziel.', 'Frühstück außerhalb des Hotels ist besser.', 'Spontane Umwege werden später die besten Geschichten.'],
      Fantasie: ['Drachen wären bessere Postboten als Haustiere.', 'Teleportation bräuchte dringend eine Warteschlange.', 'Roboter sollten zuerst lernen, Socken zu sortieren.', 'Eine Zeitmaschine wäre hauptsächlich für verpasste Busse nützlich.', 'Zauberschulen bräuchten einen technischen Support.', 'Unsichtbarkeit wäre im Alltag überraschend unpraktisch.', 'Aliens würden zuerst unsere Snackregale untersuchen.', 'Superhelden brauchen vor allem gute Kalender.'],
      'Unpopuläre Meinung': ['Der Mittelplatz kann bei guter Gruppe der beste Platz sein.', 'Manche Serien sind nach einer Staffel perfekt beendet.', 'Ein ruhiger Spieleabend schlägt eine laute Großveranstaltung.', 'Standardgeschmack ist nicht automatisch langweilig.', 'Nicht jede Nachricht braucht sofort eine Antwort.', 'Gewinnen ist weniger wichtig als ein gutes Finale.', 'Ein kleines Menü ist besser als hundert Optionen.', 'Wiederholungen können beruhigender sein als immer Neues.']
    },
    'hot-seat': {
      Locker: ['Lieblingssnack?', 'Frühaufsteher oder Nachteule?', 'Meer oder Berge?', 'Letzte App geöffnet?', 'Süß oder salzig?', 'Kino oder Zuhause?', 'Sommer oder Winter?', 'Planen oder spontan?'],
      Entscheidungen: ['Eine Superkraft?', 'Eine Sache sofort lernen?', 'Ein Jahr ohne Social Media oder Streaming?', 'Nur Bahn oder nur Auto?', 'Immer zehn Minuten zu früh oder zu spät?', 'Nie wieder Süßes oder Salziges?', 'Eine Stadt für einen Monat?', 'Ein Hobby sofort meistern?'],
      Erinnerungen: ['Bestes Schulfach?', 'Erste große Reise?', 'Lustigster kleiner Fehler?', 'Ein Geruch aus der Kindheit?', 'Erstes Lieblingsspiel?', 'Ein vergessener Trend?', 'Ein besonders guter Geburtstag?', 'Ein Lied, das Erinnerungen auslöst?'],
      Zukunft: ['Traumberuf?', 'Ort in zehn Jahren?', 'Eine neue Gewohnheit?', 'Nächstes großes Ziel?', 'Eine Erfindung, die fehlt?', 'Ein Land besuchen?', 'Eine Fähigkeit entwickeln?', 'Ein Projekt starten?'],
      Chaos: ['Seltsamste Essenskombination?', 'Unnötigste App?', 'Schlechteste Ausrede?', 'Absurdeste Superkraft?', 'Komischster Teamname?', 'Unpraktischstes Haustier?', 'Unnötigstes Luxusprodukt?', 'Welcher Gegenstand wäre ein schlechter Chef?'],
      Kreativ: ['Titel deiner Biografie?', 'Name einer Band?', 'Erfinde einen Feiertag.', 'Name für einen Roboter?', 'Neue Eissorte?', 'Name einer Fantasiestadt?', 'Erfinde eine App.', 'Motto für diese Gruppe?']
    },
    'story-chain': {
      Alltag: ['Als der Aufzug im falschen Stockwerk anhielt, stand dort nur ein gedeckter Tisch.', 'Im Kühlschrank lag plötzlich ein Brief mit der Aufschrift „Nicht vor Freitag öffnen“.', 'Der Busfahrer verkündete, dass heute alle Haltestellen neue Namen haben.', 'Beim Aufräumen fand die Gruppe eine Fernbedienung ohne passendes Gerät.', 'Das Paket vor der Tür war an niemanden im Haus adressiert.', 'Der Wecker klingelte, obwohl er seit Jahren kaputt war.'],
      Mystery: ['Jede Uhr im Gebäude zeigte eine andere Zeit, nur eine lief rückwärts.', 'Auf dem Foto erschien eine Tür, die im Raum nicht existierte.', 'Jeden Abend lag ein neuer Schlüssel auf derselben Parkbank.', 'Die Bibliothek hatte plötzlich ein Regal ohne Nummer.', 'Im leeren Bahnhof wurde ein Name ausgerufen, den niemand kannte.', 'Die Karte zeigte einen Ort, der erst morgen entstehen sollte.'],
      Fantasy: ['Der kleinste Drache des Königreichs bekam die wichtigste Mission.', 'Eine Hexe verlor ihren Zauberstab in einem gewöhnlichen Supermarkt.', 'Der König erklärte einen sprechenden Toaster zum neuen Berater.', 'Im Wald wuchsen über Nacht Türen statt Bäume.', 'Ein Ritter entdeckte, dass sein Schwert nur Komplimente machte.', 'Die Wolkenstadt sank jeden Dienstag ein Stück tiefer.'],
      'Science-Fiction': ['Der Haushaltsroboter beantragte plötzlich Urlaub.', 'Die Marskolonie erhielt eine Lieferung mit frischem Schnee.', 'Ein Raumschiff antwortete auf ein Signal aus der eigenen Zukunft.', 'Die Übersetzungs-KI begann nur noch in Rätseln zu sprechen.', 'Auf dem Mond wurde eine verlassene Bushaltestelle gefunden.', 'Der Teleporter vertauschte ausschließlich linke Schuhe.'],
      Reise: ['Der letzte Zug fuhr zu einem Ort, der auf keiner Karte stand.', 'Im Hotel bekam jede Person einen anderen Schlüssel für dasselbe Zimmer.', 'Der Reiseführer kannte jede Straße, aber keinen Ausgang.', 'Am Strand wurde eine Flaschenpost aus der Zukunft gefunden.', 'Das Navi bestand darauf, durch ein geschlossenes Museum zu fahren.', 'Der Koffer enthielt nach der Ankunft völlig andere Kleidung.'],
      Chaos: ['Die Party begann normal, bis der Kühlschrank die Playlist übernahm.', 'Jemand bestellte eine Pizza und bekam stattdessen zwölf Luftballons.', 'Der Gruppenchat wählte ohne Erklärung einen neuen Bürgermeister.', 'Alle Schuhe verschwanden gleichzeitig und tauchten sortiert wieder auf.', 'Das Licht ging aus und jemand applaudierte viel zu früh.', 'Der Spieleabend wurde plötzlich live von einer Taube kommentiert.']
    },
    'finish-the-sentence': {
      Alltag: ['Mein Tag wäre sofort besser, wenn …', 'Ich verliere regelmäßig Zeit, weil …', 'Das Unnötigste in meiner Tasche ist …', 'Ich merke, dass Wochenende ist, wenn …', 'Eine Sache, die ich immer aufschiebe, ist …', 'Mein geheimes Organisationstalent ist …', 'Der beste kleine Luxus ist …', 'Ich brauche dringend eine Erfindung, die …'],
      Freundschaft: ['Eine gute Freundschaft erkennt man daran, dass …', 'Unsere Gruppe wäre eine Serie mit dem Titel …', 'Ich kann mich auf euch verlassen, wenn …', 'Der beste spontane Plan wäre …', 'Ein Insider, den niemand versteht, ist …', 'Unsere stärkste Teamfähigkeit ist …', 'Bei einem Quiz wäre ich zuständig für …', 'Die Gruppe sollte einmal gemeinsam …'],
      Reisen: ['Mein perfekter Reisetag beginnt mit …', 'Im Koffer darf niemals fehlen …', 'Ein Ort, den ich spontan besuchen würde, ist …', 'Die beste Reisegeschichte beginnt mit …', 'Bei Verspätung mache ich zuerst …', 'Mein ungewöhnlichstes Souvenir wäre …', 'Eine Reise ohne Plan braucht trotzdem …', 'Der beste Umweg führt zu …'],
      Gaming: ['Mein Spielstil lässt sich beschreiben als …', 'Ein Tutorial sollte immer …', 'Das seltenste Item bewahre ich auf, weil …', 'Mein perfektes Team braucht …', 'Ein Bosskampf wird unfair, wenn …', 'Das beste Nebenquest-Thema wäre …', 'Mein Gaming-Raum braucht unbedingt …', 'Ein Spiel über meinen Alltag hieße …'],
      Fantasie: ['Mein Drache hätte die besondere Fähigkeit …', 'Eine Zauberschule braucht dringend …', 'Meine Superkraft wäre nutzlos, weil …', 'Ein Roboter in meiner Wohnung müsste …', 'Die Zeitmaschine dürfte nur reisen zu …', 'Mein Königreich wäre bekannt für …', 'Ein Alien würde zuerst fragen …', 'Der Eingang zur geheimen Welt liegt …'],
      Zukunft: ['In zehn Jahren möchte ich sagen können …', 'Die beste zukünftige Erfindung wäre …', 'Mein nächstes großes Projekt beginnt mit …', 'Eine Fähigkeit, die ich lernen werde, ist …', 'Die Stadt der Zukunft braucht weniger …', 'Arbeit wäre besser, wenn …', 'Mein zukünftiges Ich würde mir raten …', 'Ein Ziel für dieses Jahr ist …']
    }
  };

  const games = Object.freeze([...base.games, ...newGames]);
  const content = Object.assign({}, base.content, viralContent);
  const viralGameIds = Object.freeze(newGames.map(game => game.id));
  const allFastGameIds = Object.freeze([...(base.quickGameIds || []), ...viralGameIds]);

  function getGame(id) {
    return games.find(game => game.id === id) || null;
  }

  function getPackNames(id) {
    return content[id] ? Object.keys(content[id]) : [];
  }

  function getItems(id, pack) {
    const gameContent = content[id];
    if (!gameContent) return [];
    if (pack && gameContent[pack]) return gameContent[pack];
    return Object.values(gameContent).flatMap(value => Array.isArray(value) ? value : []);
  }

  function itemCount(id) {
    return getItems(id).length;
  }

  return Object.freeze({
    ...base,
    version: 5,
    games,
    content,
    getGame,
    getPackNames,
    getItems,
    itemCount,
    viralGameIds,
    allFastGameIds
  });
});
