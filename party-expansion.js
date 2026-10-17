(function (root, factory) {
  const base = typeof module === 'object' && module.exports
    ? require('./party-catalog.js')
    : root.SecretCirclePartyCatalog;
  const api = factory(base);
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.SecretCirclePartyCatalog = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function (base) {
  'use strict';
  if (!base) throw new Error('Party-Basiskatalog fehlt.');

  const playableModes = {
    'two-truths': 'two-truths',
    'question-imposter': 'question-imposter',
    'location-spy': 'location-spy',
    mafia: 'mafia'
  };
  const playablePacks = Object.freeze({
    'two-truths': Object.freeze(['Locker', 'Reise', 'Schule & Arbeit']),
    'question-imposter': Object.freeze(['Alltag', 'Meinungen', 'Schätzfragen']),
    'location-spy': Object.freeze(['Reise', 'Alltag', 'Fantasieorte']),
    mafia: Object.freeze(['Schnell', 'Klassisch', 'Erweitert'])
  });

  const games = base.games.map(game => {
    const mode = playableModes[game.id];
    return mode ? Object.freeze({
      ...game,
      status: 'playable',
      mode,
      featured: game.id === 'question-imposter',
      packs: playablePacks[game.id]
    }) : game;
  });

  games.push(
    Object.freeze({
      id: 'wavelength', title: 'Spektrum-Tipp', icon: '📡', group: 'Schätzen & Tippen', status: 'planned', mode: 'planned',
      minPlayers: 4, maxPlayers: 20, duration: 20, moods: ['clever', 'friendly'], age: 'all',
      description: 'Ein geheimer Zielwert liegt zwischen zwei Polen. Eine Person gibt einen kurzen Hinweis, die Gruppe setzt ihre Position auf dem Spektrum.',
      instructions: ['Spektrum und geheimen Zielwert ansehen.', 'Einen kurzen passenden Hinweis geben.', 'Ziel verbergen und die Gruppe eine Position festlegen lassen.', 'Abstand aufdecken und Punkte vergeben.'],
      packs: ['Alltag', 'Gefühle', 'Popkultur']
    }),
    Object.freeze({
      id: 'draw-guess', title: 'Zeichnen & Raten', icon: '✏️', group: 'Kreativ & Schreiben', status: 'planned', mode: 'planned',
      minPlayers: 3, maxPlayers: 20, duration: 20, moods: ['funny', 'competitive'], age: 'all',
      description: 'Begriffe werden auf Papier oder einem späteren Zeichenfeld dargestellt und von der Gruppe erraten.',
      instructions: ['Begriff geheim öffnen.', 'Ohne Buchstaben zeichnen.', 'Zeitlimit beachten.', 'Treffer zählen und weitergeben.'],
      packs: ['Alltag', 'Tiere', 'Situationen']
    }),
    Object.freeze({
      id: 'rapid-fire', title: 'Schnellfeuer', icon: '⏱️', group: 'Schnell & Challenge', status: 'planned', mode: 'planned',
      minPlayers: 2, maxPlayers: 20, duration: 10, moods: ['chaotic', 'competitive'], age: 'all',
      description: 'Eine Person muss in wenigen Sekunden mehrere Antworten zu einer Kategorie nennen.',
      instructions: ['Kategorie öffnen.', 'Timer starten.', 'Geforderte Anzahl nennen.', 'Bei Erfolg Punkt vergeben.'],
      packs: ['3 in 5 Sekunden', '5 in 10 Sekunden', 'Extrem']
    }),
    Object.freeze({
      id: 'sound-imitation', title: 'Geräusche erraten', icon: '🔊', group: 'Darstellen & Erklären', status: 'planned', mode: 'planned',
      minPlayers: 3, maxPlayers: 20, duration: 15, moods: ['funny', 'chaotic'], age: 'all',
      description: 'Nur mit Geräuschen wird ein Tier, Gegenstand, Ort oder eine Situation dargestellt.',
      instructions: ['Karte geheim ansehen.', 'Nur Geräusche machen.', 'Keine Wörter oder Gesten.', 'Treffer zählen.'],
      packs: ['Tiere', 'Haushalt', 'Situationen']
    })
  );

  const advancedContent = {
    'two-truths': {
      Locker: [
        'Eine ungewöhnliche Essensvorliebe', 'Ein überraschendes Talent', 'Eine kleine Kindheitserinnerung',
        'Ein Missgeschick im Alltag', 'Ein Ort, an dem du schon warst', 'Etwas, das du gesammelt hast',
        'Eine Begegnung mit einem Tier', 'Eine Sache, die du einmal gewonnen hast'
      ],
      Reise: [
        'Ein Verkehrsmittel, das du genutzt hast', 'Ein Gericht aus einem anderen Land', 'Ein verlorener Gegenstand unterwegs',
        'Ein spontaner Ausflug', 'Eine ungewöhnliche Unterkunft', 'Ein Ort mit besonderem Wetter',
        'Eine Reise ohne perfekten Plan', 'Eine Sprache, die du unterwegs benutzt hast'
      ],
      'Schule & Arbeit': [
        'Ein Fach oder Projekt, das dich überrascht hat', 'Ein lustiger Fehler bei einer Aufgabe', 'Eine Präsentation vor vielen Menschen',
        'Ein ungewöhnlicher Nebenjob', 'Eine besonders frühe oder späte Schicht', 'Ein Werkzeug oder Programm, das du beherrschst',
        'Eine Aufgabe, die anders endete als geplant', 'Ein Kompliment von Lehrkraft oder Team'
      ]
    },
    'question-imposter': {
      Alltag: [
        { main: 'Welche Tageszeit magst du am liebsten?', imposter: 'Welche Jahreszeit magst du am liebsten?' },
        { main: 'Was kaufst du häufig spontan?', imposter: 'Was bestellst du häufig spontan?' },
        { main: 'Welcher Raum zu Hause ist am wichtigsten?', imposter: 'Welcher Ort in deiner Stadt ist am wichtigsten?' },
        { main: 'Was machst du direkt nach dem Aufstehen?', imposter: 'Was machst du direkt vor dem Schlafen?' },
        { main: 'Welches Getränk passt zu einem guten Morgen?', imposter: 'Welches Getränk passt zu einem guten Abend?' },
        { main: 'Welche App spart dir am meisten Zeit?', imposter: 'Welche App kostet dich am meisten Zeit?' },
        { main: 'Was sollte jeder im Kühlschrank haben?', imposter: 'Was sollte jeder im Rucksack haben?' },
        { main: 'Welcher Wochentag fühlt sich am kürzesten an?', imposter: 'Welcher Wochentag fühlt sich am längsten an?' }
      ],
      Meinungen: [
        { main: 'Welche Eigenschaft macht jemanden sympathisch?', imposter: 'Welche Eigenschaft macht jemanden erfolgreich?' },
        { main: 'Was ist wichtiger: Talent oder Übung?', imposter: 'Was ist wichtiger: Planung oder Spontanität?' },
        { main: 'Welche kleine Regel verbessert Gruppen?', imposter: 'Welche kleine Regel verbessert den Alltag?' },
        { main: 'Was wird allgemein überschätzt?', imposter: 'Was wird allgemein unterschätzt?' },
        { main: 'Welche Erfindung hat den Alltag am stärksten verändert?', imposter: 'Welche Erfindung wird den Alltag am stärksten verändern?' },
        { main: 'Was ist ein gutes Geschenk?', imposter: 'Was ist eine gute Überraschung?' },
        { main: 'Was sollte man früher lernen?', imposter: 'Was sollte man später verlernen?' },
        { main: 'Welche Gewohnheit zeigt Disziplin?', imposter: 'Welche Gewohnheit zeigt Kreativität?' }
      ],
      Schätzfragen: [
        { main: 'Wie viele Minuten nutzt du täglich dein Handy?', imposter: 'Wie viele Minuten hörst du täglich Musik?' },
        { main: 'Wie viele Länder möchtest du noch besuchen?', imposter: 'Wie viele Städte möchtest du noch besuchen?' },
        { main: 'Wie viele Stunden Schlaf brauchst du idealerweise?', imposter: 'Wie viele freie Stunden brauchst du idealerweise?' },
        { main: 'Wie viele Apps nutzt du wirklich jede Woche?', imposter: 'Wie viele Kontakte schreibst du wirklich jede Woche?' },
        { main: 'Wie viele Gerichte kannst du ohne Rezept kochen?', imposter: 'Wie viele Songs kannst du auswendig mitsingen?' },
        { main: 'Wie viele Kilometer würdest du spontan laufen?', imposter: 'Wie viele Kilometer würdest du spontan fahren?' },
        { main: 'Wie viele Tage könntest du ohne Social Media leben?', imposter: 'Wie viele Tage könntest du ohne Streaming leben?' },
        { main: 'Wie viele Personen passen in deine perfekte Reisegruppe?', imposter: 'Wie viele Personen passen in dein perfektes Projektteam?' }
      ]
    },
    'location-spy': {
      Reise: ['Flughafen', 'Bahnhof', 'Campingplatz', 'Berghütte', 'Kreuzfahrtschiff', 'Jugendherberge', 'Strand', 'Museum'],
      Alltag: ['Supermarkt', 'Fitnessstudio', 'Berufsschule', 'Werkstatt', 'Krankenhaus', 'Bibliothek', 'Restaurant', 'Waschanlage'],
      Fantasieorte: ['Raumstation', 'Drachenhöhle', 'Unterwasserstadt', 'Zauberschule', 'Zeitmaschine', 'Geheimes Labor', 'Wolkenpalast', 'Roboterfabrik']
    },
    mafia: {
      Schnell: ['Mafia', 'Detektiv', 'Dorfbewohner'],
      Klassisch: ['Mafia', 'Detektiv', 'Arzt', 'Dorfbewohner'],
      Erweitert: ['Mafia', 'Detektiv', 'Arzt', 'Beschützer', 'Dorfbewohner']
    }
  };

  // Release-content wave 1: expand the smallest structured pools without changing mechanics.
  const releaseAdditions = {
    taboo: {
      Alltag: [
        { word: 'Kalender', banned: ['Datum', 'Monat', 'Termin'] },
        { word: 'Steckdose', banned: ['Strom', 'Wand', 'Stecker'] },
        { word: 'Waschmaschine', banned: ['Wäsche', 'drehen', 'Kleidung'] },
        { word: 'Haustür', banned: ['Schlüssel', 'Eingang', 'öffnen'] },
        { word: 'Einkaufszettel', banned: ['Liste', 'Supermarkt', 'kaufen'] },
        { word: 'Kissen', banned: ['Bett', 'Kopf', 'schlafen'] },
        { word: 'Treppe', banned: ['Stufen', 'hoch', 'Stockwerk'] },
        { word: 'Mülleimer', banned: ['Abfall', 'werfen', 'Tonne'] }
      ],
      Essen: [
        { word: 'Kaffee', banned: ['trinken', 'Koffein', 'Tasse'] },
        { word: 'Salat', banned: ['Gemüse', 'grün', 'Schüssel'] },
        { word: 'Brot', banned: ['Scheibe', 'Bäcker', 'Mehl'] },
        { word: 'Käse', banned: ['Milch', 'gelb', 'Scheibe'] },
        { word: 'Apfel', banned: ['Obst', 'rot', 'Kern'] },
        { word: 'Reis', banned: ['Korn', 'kochen', 'Beilage'] },
        { word: 'Pommes', banned: ['Kartoffel', 'frittieren', 'Salz'] },
        { word: 'Kuchen', banned: ['backen', 'süß', 'Stück'] }
      ],
      Technik: [
        { word: 'Laptop', banned: ['Computer', 'Tastatur', 'Bildschirm'] },
        { word: 'Maus', banned: ['klicken', 'Computer', 'Cursor'] },
        { word: 'Bildschirm', banned: ['Monitor', 'sehen', 'Display'] },
        { word: 'WLAN', banned: ['Internet', 'Funk', 'Router'] },
        { word: 'USB-Stick', banned: ['Speicher', 'Datei', 'Anschluss'] },
        { word: 'Smartwatch', banned: ['Uhr', 'Handgelenk', 'Fitness'] },
        { word: 'Lautsprecher', banned: ['Musik', 'Ton', 'Box'] },
        { word: 'Browser', banned: ['Webseite', 'Internet', 'Tab'] }
      ]
    },
    'hot-potato': {
      Kategorien: [
        'Nenne ein Möbelstück.', 'Nenne eine Farbe.', 'Nenne ein Obst.', 'Nenne ein Verkehrsmittel.',
        'Nenne etwas, das im Bad steht.', 'Nenne ein Hobby.', 'Nenne ein Land in Europa.', 'Nenne etwas mit einem Bildschirm.'
      ],
      Schnellfeuer: [
        'Nenne etwas Rotes.', 'Nenne einen Filmberuf.', 'Nenne etwas aus Metall.', 'Nenne einen Monat.',
        'Nenne etwas, das schwimmt.', 'Nenne ein Werkzeug.', 'Nenne eine Süßigkeit.', 'Nenne etwas, das man lädt.'
      ],
      'Mini-Aufgaben': [
        'Tippe dreimal auf den Tisch und gib weiter.', 'Nenne drei Vornamen und gib weiter.', 'Mache eine Siegerpose und gib weiter.', 'Zähle von eins bis sechs und gib weiter.',
        'Nenne zwei Städte und gib weiter.', 'Mache ein leises Trommelgeräusch und gib weiter.', 'Nenne zwei Obstsorten und gib weiter.', 'Sage drei Wörter mit B und gib weiter.'
      ]
    },
    'word-chain': {
      Tiere: ['D', 'E', 'F', 'L', 'Z'],
      Essen: ['B', 'C', 'M', 'N', 'R'],
      Orte: ['A', 'D', 'K', 'L', 'P'],
      Gegenstände: ['A', 'H', 'R', 'S', 'Z']
    },
    'two-truths': {
      Locker: [
        'Ein Hobby, das kaum jemand von dir erwartet', 'Ein Essen, das du früher nicht mochtest', 'Ein Gegenstand, den du lange besitzt', 'Eine kleine Macke im Alltag',
        'Ein Spiel, bei dem du überraschend gut bist', 'Eine Sache, die du schon selbst repariert hast', 'Ein Lied, das du fast auswendig kannst', 'Ein Moment, bei dem du zu spät lachen musstest'
      ],
      Reise: [
        'Ein Ort, an dem du dich verlaufen hast', 'Ein Verkehrsmittel, das verspätet war', 'Eine Reise, die sehr früh begann', 'Etwas, das du im Urlaub spontan gekauft hast',
        'Ein Gericht, das du unterwegs zum ersten Mal probiert hast', 'Ein Reiseziel, das dich überrascht hat', 'Eine ungewöhnliche Aussicht, die du gesehen hast', 'Ein Plan, der unterwegs komplett geändert wurde'
      ],
      'Schule & Arbeit': [
        'Eine Aufgabe, die du schneller als erwartet geschafft hast', 'Ein Fach oder Thema, das du früher unterschätzt hast', 'Ein Projekt, bei dem improvisiert werden musste', 'Ein Werkzeug, das du erst spät kennengelernt hast',
        'Eine Situation, in der Teamarbeit entscheidend war', 'Eine Aufgabe, die du freiwillig übernommen hast', 'Ein kleiner Fehler mit einer nützlichen Lektion', 'Eine Fähigkeit, die dir jemand im Team beigebracht hat'
      ]
    },
    'question-imposter': {
      Alltag: [
        { main: 'Was liegt bei dir oft auf dem Tisch?', imposter: 'Was liegt bei dir oft im Rucksack?' },
        { main: 'Was machst du gern an einem freien Morgen?', imposter: 'Was machst du gern an einem freien Abend?' },
        { main: 'Welches Geräusch hörst du zu Hause häufig?', imposter: 'Welches Geräusch hörst du unterwegs häufig?' },
        { main: 'Was vergisst du zu Hause am ehesten?', imposter: 'Was vergisst du unterwegs am ehesten?' },
        { main: 'Welcher Gegenstand spart dir täglich Zeit?', imposter: 'Welcher Gegenstand kostet dich täglich Zeit?' },
        { main: 'Was steht bei dir meistens im Kühlschrank?', imposter: 'Was steht bei dir meistens im Vorratsschrank?' },
        { main: 'Was machst du zuerst, wenn du nach Hause kommst?', imposter: 'Was machst du zuletzt, bevor du das Haus verlässt?' },
        { main: 'Welche kleine Ausgabe lohnt sich für dich?', imposter: 'Welche kleine Ausgabe bereust du oft?' }
      ],
      Meinungen: [
        { main: 'Was macht einen guten freien Tag aus?', imposter: 'Was macht einen produktiven Tag aus?' },
        { main: 'Welche Eigenschaft ist in Freundschaften wichtig?', imposter: 'Welche Eigenschaft ist im Team wichtig?' },
        { main: 'Was sollte man öfter spontan machen?', imposter: 'Was sollte man öfter vorher planen?' },
        { main: 'Welche Alltagssache wird zu kompliziert gemacht?', imposter: 'Welche Alltagssache wird zu wenig ernst genommen?' },
        { main: 'Was macht eine gute Unterhaltung aus?', imposter: 'Was macht eine gute Diskussion aus?' },
        { main: 'Was sollte kostenlos sein?', imposter: 'Wofür lohnt es sich zu bezahlen?' },
        { main: 'Was hilft am besten gegen Langeweile?', imposter: 'Was hilft am besten gegen Stress?' },
        { main: 'Was ist wichtiger bei einem Hobby: Spaß oder Fortschritt?', imposter: 'Was ist wichtiger bei Arbeit: Tempo oder Genauigkeit?' }
      ],
      Schätzfragen: [
        { main: 'Wie viele Minuten brauchst du morgens bis du fertig bist?', imposter: 'Wie viele Minuten brauchst du abends bis du schlafen gehst?' },
        { main: 'Wie viele Fotos machst du ungefähr pro Woche?', imposter: 'Wie viele Screenshots machst du ungefähr pro Woche?' },
        { main: 'Wie viele Stunden bist du an einem freien Tag draußen?', imposter: 'Wie viele Stunden bist du an einem freien Tag am Bildschirm?' },
        { main: 'Wie viele verschiedene Getränke trinkst du in einer Woche?', imposter: 'Wie viele verschiedene Snacks isst du in einer Woche?' },
        { main: 'Wie viele Kilometer gehst du ungefähr an einem normalen Tag?', imposter: 'Wie viele Kilometer fährst du ungefähr an einem normalen Tag?' },
        { main: 'Wie viele Minuten würdest du für gutes Essen warten?', imposter: 'Wie viele Minuten würdest du für einen guten Platz anstehen?' },
        { main: 'Wie viele Dinge stehen ungefähr auf deinem Schreibtisch?', imposter: 'Wie viele Dinge liegen ungefähr in deiner Tasche?' },
        { main: 'Wie viele neue Orte besuchst du ungefähr in einem Jahr?', imposter: 'Wie viele neue Gerichte probierst du ungefähr in einem Jahr?' }
      ]
    },
    'location-spy': {
      Reise: ['Hotel', 'Fährterminal', 'Aussichtsplattform', 'Skihütte', 'Reisebus', 'Zeltplatz', 'Hafen', 'Touristeninformation'],
      Alltag: ['Bäckerei', 'Friseursalon', 'Apotheke', 'Schwimmbad', 'Kino', 'Postfiliale', 'Baumarkt', 'Café'],
      Fantasieorte: ['Mondbasis', 'Pirateninsel', 'Magischer Wald', 'Unterirdische Stadt', 'Riesenbibliothek', 'Fliegendes Schiff', 'Kristallhöhle', 'Zeitreisebahnhof']
    }
  };

  /* v112, Kartenpaket 5b: Advanced-Spiele auf 50 Karten je Kategorie. advanced.html
     lädt nur diese Katalogebene, darum stehen die Zusatzkarten hier und nicht in
     party-cards-*.js. tests/card-packs.test.js prüft sie mit denselben Regeln. */
  const cardAdditions = {
    'two-truths': {
      Locker: [
        'Ein Hobby, das du aufgegeben hast',
        'Ein Spitzname, den du einmal hattest',
        'Ein Brettspiel, bei dem du fast immer gewinnst',
        'Ein Haustier, das du hattest oder wolltest',
        'Ein Film, den du mehrmals gesehen hast',
        'Ein ungewöhnliches Geschenk',
        'Eine Sportart, die du ausprobiert hast',
        'Ein kleiner Rekord, den du aufgestellt hast',
        'Ein seltsamer Traum',
        'Eine Mutprobe aus deiner Kindheit',
        'Ein Instrument, das du spielen kannst',
        'Ein Kostüm, das du getragen hast',
        'Ein Moment, in dem du dich verlaufen hast',
        'Etwas, das du selbst gebaut hast',
        'Ein Lieblingsspiel aus der Kindheit',
        'Ein Essen, das du noch nie probiert hast',
        'Eine besondere Fähigkeit mit den Händen',
        'Ein Missgeschick in der Küche',
        'Ein Gegenstand, den du seit Jahren besitzt',
        'Eine Angewohnheit am Morgen',
        'Etwas, vor dem du dich als Kind gefürchtet hast',
        'Ein Wettbewerb, an dem du teilgenommen hast',
        'Ein Buch, das dich begeistert hat',
        'Ein Lieblingsplatz zum Sitzen',
        'Ein Tier, das du gern einmal sehen würdest',
        'Eine Pflanze, die du gepflegt hast',
        'Ein Lieblingsgeruch',
        'Ein lustiger Versprecher',
        'Etwas, das du heimlich gut kannst',
        'Ein Rezept, das du erfunden hast',
        'Ein Moment auf einer Bühne',
        'Ein Lieblingsort in deiner Stadt',
        'Ein Geräusch, das dich nervt',
        'Ein Tag, an dem alles schiefging'
      ],
      Reise: [
        'Eine Nacht im Zelt',
        'Ein Souvenir, das du mitgebracht hast',
        'Eine Panne unterwegs',
        'Ein Strand, an dem du warst',
        'Ein Berg, den du bestiegen hast',
        'Eine verpasste Verbindung',
        'Ein Tier, das du auf Reisen gesehen hast',
        'Ein Essen, das du nie wieder probieren willst',
        'Ein Fest, das du im Urlaub erlebt hast',
        'Eine Stadt, in der du dich verlaufen hast',
        'Eine besonders lange Fahrt',
        'Ein Ausflug mit dem Fahrrad',
        'Ein Urlaub mit schlechtem Wetter',
        'Eine Bootsfahrt',
        'Ein Freizeitpark, den du besucht hast',
        'Eine Begegnung mit freundlichen Fremden',
        'Ein Sonnenaufgang unterwegs',
        'Eine Klassenfahrt',
        'Ein Museum, das dich beeindruckt hat',
        'Eine Nacht am Flughafen',
        'Ein Missverständnis im Urlaub',
        'Eine Wanderung, die länger dauerte als geplant',
        'Eine Reise mit der Familie',
        'Ein Ort mit viel Schnee',
        'Eine Insel, die du besucht hast',
        'Ein Hotel mit einer Besonderheit',
        'Eine Zugfahrt, die du nie vergisst',
        'Eine Mutprobe im Urlaub',
        'Ein See, in dem du geschwommen bist',
        'Ein Ort, an den du zurückkehren willst',
        'Ein Tagesausflug in der Nähe',
        'Ein Urlaubsfoto, das du liebst',
        'Ein Sportkurs im Urlaub',
        'Eine Reise, die du selbst geplant hast'
      ],
      'Schule & Arbeit': [
        'Ein Lieblingsfach',
        'Eine Lehrkraft, die du bewundert hast',
        'Ein Schulausflug',
        'Eine Note, auf die du stolz warst',
        'Ein Referat über ein ungewöhnliches Thema',
        'Eine Schulaufführung',
        'Ein Praktikum',
        'Ein Ehrenamt',
        'Eine Teamaufgabe, die gut lief',
        'Ein Wettbewerb in der Schule',
        'Ein Schulweg mit einer Besonderheit',
        'Eine Pause, die du nie vergisst',
        'Ein Projekt, das du selbst geleitet hast',
        'Ein Fehler, aus dem du gelernt hast',
        'Eine Prüfung, die anders lief als gedacht',
        'Ein Kurs, den du freiwillig belegt hast',
        'Eine Schul-AG',
        'Eine Schülerzeitung oder ein Schulradio',
        'Ein Erfolg im Sportunterricht',
        'Ein besonderer erster Arbeitstag',
        'Eine Aufgabe, die dich überfordert hat',
        'Ein Lieblingsraum in der Schule oder Firma',
        'Eine Erfindung aus einem Schulprojekt',
        'Ein Tag, an dem du zu spät kamst',
        'Ein lustiger Moment im Unterricht',
        'Ein Ferienjob',
        'Ein Austausch mit einer anderen Schule',
        'Ein Zeugnis, an das du dich erinnerst',
        'Eine Wahl zur Klassensprecherin oder zum Klassensprecher',
        'Eine Mittagspause mit Überraschung',
        'Eine Fremdsprache aus der Schule',
        'Ein Wandertag',
        'Ein Bastelprojekt',
        'Ein Experiment im Unterricht'
      ]
    },
    'question-imposter': {
      Alltag: [
        { main: 'Was isst du am liebsten zum Frühstück?', imposter: 'Was isst du am liebsten zum Abendessen?' },
        { main: 'Wie lange brauchst du morgens im Bad?', imposter: 'Wie lange brauchst du für deinen Weg zur Arbeit oder Schule?' },
        { main: 'Welche Farbe hat dein Lieblingspullover?', imposter: 'Welche Farbe hat deine Lieblingstasse?' },
        { main: 'Welches Geräusch weckt dich am ehesten?', imposter: 'Welches Geräusch nervt dich am meisten?' },
        { main: 'Was machst du in der Mittagspause?', imposter: 'Was machst du am Feierabend?' },
        { main: 'Welches Obst isst du am häufigsten?', imposter: 'Welches Gemüse isst du am häufigsten?' },
        { main: 'Wo verlierst du am häufigsten Dinge?', imposter: 'Wo findest du verlorene Dinge meistens wieder?' },
        { main: 'Wie viele Kissen liegen auf deinem Bett?', imposter: 'Wie viele Jacken hängen an deiner Garderobe?' },
        { main: 'Welche Musik hörst du beim Kochen?', imposter: 'Welche Musik hörst du beim Sport?' },
        { main: 'Was trinkst du am Nachmittag?', imposter: 'Was trinkst du am Abend?' },
        { main: 'Welches Haushaltsgerät benutzt du am meisten?', imposter: 'Welches Haushaltsgerät benutzt du am wenigsten?' },
        { main: 'Was liegt immer auf deinem Nachttisch?', imposter: 'Was liegt immer auf deinem Schreibtisch?' },
        { main: 'Wann gehst du am Wochenende schlafen?', imposter: 'Wann stehst du am Wochenende auf?' },
        { main: 'Was ist dein Notfall-Snack?', imposter: 'Was ist dein Filmabend-Snack?' },
        { main: 'Welche Hausarbeit machst du am liebsten?', imposter: 'Welche Hausarbeit schiebst du am längsten auf?' },
        { main: 'Wie viele Paar Schuhe besitzt du?', imposter: 'Wie viele Taschen besitzt du?' },
        { main: 'Was machst du, wenn es den ganzen Tag regnet?', imposter: 'Was machst du, wenn es sehr heiß ist?' },
        { main: 'Welches Brot isst du am liebsten?', imposter: 'Welchen Kuchen isst du am liebsten?' },
        { main: 'Welches Verkehrsmittel nutzt du am meisten?', imposter: 'Welches Verkehrsmittel magst du am meisten?' },
        { main: 'Wohin gehst du für einen kurzen Spaziergang?', imposter: 'Wohin fährst du für einen langen Ausflug?' },
        { main: 'Was kochst du, wenn es schnell gehen muss?', imposter: 'Was kochst du, wenn Gäste kommen?' },
        { main: 'Welche Pflanze würdest du dir in die Wohnung stellen?', imposter: 'Welches Haustier würdest du dir anschaffen?' },
        { main: 'Was ist dein Lieblingsgeschäft in der Stadt?', imposter: 'Was ist dein Lieblingsort in der Stadt?' },
        { main: 'Wie viele Tassen Tee oder Kaffee trinkst du am Tag?', imposter: 'Wie viele Gläser Wasser trinkst du am Tag?' },
        { main: 'Welches Möbelstück würdest du nie hergeben?', imposter: 'Welches Kleidungsstück würdest du nie hergeben?' },
        { main: 'Welches Spiel spielst du am Wochenende?', imposter: 'Welches Spiel spielst du im Urlaub?' },
        { main: 'Welche Eissorte nimmst du im Sommer?', imposter: 'Welche Suppe isst du im Winter?' },
        { main: 'Welche Socken trägst du am liebsten?', imposter: 'Welche Schuhe trägst du am liebsten?' },
        { main: 'Was kaufst du immer auf dem Markt?', imposter: 'Was kaufst du immer im Supermarkt?' },
        { main: 'Welches Zimmer räumst du zuerst auf?', imposter: 'Welches Zimmer räumst du zuletzt auf?' },
        { main: 'Wie lange schläfst du am Sonntag?', imposter: 'Wie lange bleibst du am Samstag wach?' },
        { main: 'Welche Serie schaust du nebenbei?', imposter: 'Welchen Podcast hörst du nebenbei?' },
        { main: 'Was steht auf deinem Einkaufszettel ganz oben?', imposter: 'Was steht auf deiner To-do-Liste ganz oben?' },
        { main: 'Was machst du mit einem freien Nachmittag?', imposter: 'Was machst du mit einem freien Vormittag?' }
      ],
      Meinungen: [
        { main: 'Was ist das beste Wetter für einen Ausflug?', imposter: 'Was ist das beste Wetter zum Zuhausebleiben?' },
        { main: 'Welche Jahreszeit ist am romantischsten?', imposter: 'Welche Jahreszeit ist am gemütlichsten?' },
        { main: 'Welcher Beruf ist am spannendsten?', imposter: 'Welcher Beruf ist am wichtigsten?' },
        { main: 'Welches Tier wäre das beste Haustier?', imposter: 'Welches Tier wäre das beste Maskottchen?' },
        { main: 'Was macht einen guten Film aus?', imposter: 'Was macht ein gutes Buch aus?' },
        { main: 'Welche Superkraft wäre am nützlichsten?', imposter: 'Welche Superkraft wäre am lustigsten?' },
        { main: 'Was ist das beste Geburtstagsessen?', imposter: 'Was ist das beste Essen für eine Party?' },
        { main: 'Welche Stadt sollte man einmal besuchen?', imposter: 'In welcher Stadt würdest du gern wohnen?' },
        { main: 'Welcher Sport ist am schönsten anzusehen?', imposter: 'Welcher Sport ist am anstrengendsten?' },
        { main: 'Was ist das beste Geschenk für Kinder?', imposter: 'Was ist das beste Geschenk für Großeltern?' },
        { main: 'Welche Erfindung ist am praktischsten?', imposter: 'Welche Erfindung ist am verrücktesten?' },
        { main: 'Welches Fach fehlt in der Schule?', imposter: 'Welcher Kurs fehlt an der Uni?' },
        { main: 'Was ist das schönste Hobby?', imposter: 'Was ist das teuerste Hobby?' },
        { main: 'Welche Eigenschaft ist bei Freunden am wichtigsten?', imposter: 'Welche Eigenschaft ist im Team am wichtigsten?' },
        { main: 'Wie viel Ordnung braucht ein Zuhause?', imposter: 'Wie viel Ordnung braucht ein Arbeitsplatz?' },
        { main: 'Was ist der beste Wochentag?', imposter: 'Was ist der beste Monat?' },
        { main: 'Welche Musik passt zu einer Hochzeit?', imposter: 'Welche Musik passt zu einem Geburtstag?' },
        { main: 'Was macht einen guten Urlaub aus?', imposter: 'Was macht ein gutes Wochenende aus?' },
        { main: 'Welcher Snack ist überbewertet?', imposter: 'Welcher Snack ist unterbewertet?' },
        { main: 'Wie lange sollte ein guter Film dauern?', imposter: 'Wie lange sollte ein gutes Konzert dauern?' },
        { main: 'Welche Farbe macht gute Laune?', imposter: 'Welche Farbe wirkt beruhigend?' },
        { main: 'Was ist das beste Spiel für einen Regentag?', imposter: 'Was ist das beste Spiel für einen Sommerabend?' },
        { main: 'Wofür lohnt es sich, früh aufzustehen?', imposter: 'Wofür lohnt es sich, lange aufzubleiben?' },
        { main: 'Welches Tier ist am klügsten?', imposter: 'Welches Tier ist am lustigsten?' },
        { main: 'Was gehört zu einem perfekten Picknick?', imposter: 'Was gehört zu einem perfekten Filmabend?' },
        { main: 'Was ist wichtiger: Humor oder Ehrlichkeit?', imposter: 'Was ist wichtiger: Geduld oder Mut?' },
        { main: 'Welche Fähigkeit sollte jeder lernen?', imposter: 'Welche Fähigkeit wird unterschätzt?' },
        { main: 'Was ist das schönste Fest im Jahr?', imposter: 'Was ist der schönste Tag im Jahr?' },
        { main: 'Welches Getränk passt zu jedem Essen?', imposter: 'Welches Getränk passt zu jedem Wetter?' },
        { main: 'Was macht eine Stadt lebenswert?', imposter: 'Was macht ein Dorf lebenswert?' },
        { main: 'Welche Kleidung ist am bequemsten?', imposter: 'Welche Kleidung ist am praktischsten?' },
        { main: 'Was ist die beste Art zu reisen?', imposter: 'Was ist die beste Art zu entspannen?' },
        { main: 'Welcher Ort ist perfekt zum Lernen?', imposter: 'Welcher Ort ist perfekt zum Nachdenken?' },
        { main: 'Was sollte jeder einmal probieren?', imposter: 'Was sollte jeder einmal gesehen haben?' }
      ],
      Schätzfragen: [
        { main: 'Wie viele Stunden schläfst du pro Nacht?', imposter: 'Wie viele Stunden bist du pro Tag draußen?' },
        { main: 'Wie viele Bücher liest du im Jahr?', imposter: 'Wie viele Filme schaust du im Monat?' },
        { main: 'Wie viele Minuten brauchst du zum Duschen?', imposter: 'Wie viele Minuten brauchst du zum Frühstücken?' },
        { main: 'Wie viele Personen passen an deinen Esstisch?', imposter: 'Wie viele Personen passen auf dein Sofa?' },
        { main: 'Wie viele Kilometer bist du schon am Stück gewandert?', imposter: 'Wie viele Kilometer bist du schon am Stück Rad gefahren?' },
        { main: 'Wie viele Pflanzen stehen bei dir zu Hause?', imposter: 'Wie viele Bilder hängen bei dir zu Hause?' },
        { main: 'Wie viele Urlaubstage wünschst du dir im Jahr?', imposter: 'Wie viele Schneetage wünschst du dir im Jahr?' },
        { main: 'Wie viele Eiskugeln isst du auf einmal?', imposter: 'Wie viele Pizzastücke isst du auf einmal?' },
        { main: 'Wie viele Gedichte kannst du auswendig?', imposter: 'Wie viele Witze kannst du auswendig?' },
        { main: 'Wie viele Stunden spielst du pro Woche?', imposter: 'Wie viele Stunden liest du pro Woche?' },
        { main: 'Wie viele Sprachen möchtest du sprechen können?', imposter: 'Wie viele Instrumente möchtest du spielen können?' },
        { main: 'Wie viele Gäste lädst du zu deinem Geburtstag ein?', imposter: 'Wie viele Gäste lädst du zu einem Spieleabend ein?' },
        { main: 'Wie viele Minuten wartest du höchstens auf den Bus?', imposter: 'Wie viele Minuten wartest du höchstens im Restaurant?' },
        { main: 'Wie viele Tassen stehen in deinem Schrank?', imposter: 'Wie viele Teller stehen in deinem Schrank?' },
        { main: 'Wie viele Paar Socken besitzt du?', imposter: 'Wie viele T-Shirts besitzt du?' },
        { main: 'Wie viele Stunden würdest du für ein Konzert anstehen?', imposter: 'Wie viele Minuten würdest du für eine Achterbahn anstehen?' },
        { main: 'Wie viele Brettspiele besitzt du?', imposter: 'Wie viele Kuscheltiere besitzt du?' },
        { main: 'Wie viele Stunden dauert deine Traumreise?', imposter: 'Wie viele Stunden dauert dein perfekter Ausflug?' },
        { main: 'Wie viele Minuten brauchst du zum Einschlafen?', imposter: 'Wie viele Minuten brauchst du zum Wachwerden?' },
        { main: 'Wie viele Fotos machst du im Urlaub pro Tag?', imposter: 'Wie viele Postkarten schreibst du pro Urlaub?' },
        { main: 'Wie viel Gramm Nudeln kochst du für eine Person?', imposter: 'Wie viel Gramm Reis kochst du für eine Person?' },
        { main: 'Wie viele Stockwerke würdest du zu Fuß gehen?', imposter: 'Wie viele Minuten würdest du zu Fuß zum Bäcker gehen?' },
        { main: 'Wie viele Kissen brauchst du zum Schlafen?', imposter: 'Wie viele Decken brauchst du zum Schlafen?' },
        { main: 'Wie viele Sekunden kannst du auf einem Bein stehen?', imposter: 'Wie viele Sekunden kannst du schauen, ohne zu blinzeln?' },
        { main: 'Wie viele Gänge hat dein perfektes Menü?', imposter: 'Wie viele Snacks gehören zu deinem perfekten Filmabend?' },
        { main: 'Wie viele Stunden Sonne brauchst du am Tag?', imposter: 'Wie viele Stunden Ruhe brauchst du am Tag?' },
        { main: 'Wie viele Wecker stellst du dir?', imposter: 'Wie viele Erinnerungen stellst du dir am Handy?' },
        { main: 'Wie viele Seiten hat dein Lieblingsbuch ungefähr?', imposter: 'Wie viele Folgen hat deine Lieblingsserie ungefähr?' },
        { main: 'Wie viele Postkarten hast du schon verschickt?', imposter: 'Wie viele Briefe hast du schon geschrieben?' },
        { main: 'Wie viele Leute kennst du schon seit der Grundschule?', imposter: 'Wie viele Leute kennst du aus deinem Hobby?' },
        { main: 'Wie viele Minuten telefonierst du am Tag?', imposter: 'Wie viele Minuten schreibst du am Tag Nachrichten?' },
        { main: 'Wie viele Kilometer läufst du am Tag?', imposter: 'Wie viele Treppenstufen steigst du am Tag?' },
        { main: 'Wie viele Gewürze stehen in deiner Küche?', imposter: 'Wie viele Soßen stehen in deinem Kühlschrank?' },
        { main: 'Wie viele Länder hast du schon besucht?', imposter: 'Wie viele Bundesländer hast du schon besucht?' }
      ]
    },
    'location-spy': {
      Reise: [
        'Ferienwohnung',
        'Skigebiet',
        'Freizeitpark',
        'Zoo',
        'Aquarium',
        'Leuchtturm',
        'Fähre',
        'Nachtzug',
        'Busbahnhof',
        'Autobahnraststätte',
        'Wohnmobil',
        'Zeltlager',
        'Wasserpark',
        'Schloss',
        'Burg',
        'Altstadt',
        'Seilbahn',
        'Bergsee',
        'Insel',
        'Wüste',
        'Dschungel',
        'Safari',
        'Tropfsteinhöhle',
        'Nationalpark',
        'Bauernhof',
        'Botanischer Garten',
        'Aussichtsturm',
        'Strandcafé',
        'Hafenrundfahrt',
        'Freibad',
        'Golfplatz',
        'Eisbahn',
        'Kletterpark',
        'Souvenirladen'
      ],
      Alltag: [
        'Arztpraxis',
        'Zahnarztpraxis',
        'Post',
        'Bank',
        'Theater',
        'Spielplatz',
        'Park',
        'Kindergarten',
        'Grundschule',
        'Universität',
        'Büro',
        'Möbelhaus',
        'Tankstelle',
        'Parkhaus',
        'Bushaltestelle',
        'U-Bahn',
        'Wochenmarkt',
        'Eisdiele',
        'Rathaus',
        'Polizeiwache',
        'Feuerwache',
        'Tierarztpraxis',
        'Tierheim',
        'Fußballplatz',
        'Turnhalle',
        'Bowlingbahn',
        'Waschsalon',
        'Blumenladen',
        'Buchhandlung',
        'Elektronikmarkt',
        'Fahrschule',
        'Musikschule',
        'Kantine',
        'Imbiss'
      ],
      Fantasieorte: [
        'Piratenschiff',
        'Feenwald',
        'Zwergenmine',
        'Riesenburg',
        'Hexenhaus',
        'Geisterschloss',
        'Elfenstadt',
        'Vulkaninsel',
        'Eispalast',
        'Schatzinsel',
        'Raumschiff',
        'Marskolonie',
        'Alienplanet',
        'Dinosauriertal',
        'Spiegelwelt',
        'Süßigkeitenland',
        'Spielzeugfabrik',
        'Zauberwald',
        'Wolkenschiff',
        'Fliegende Insel',
        'Labyrinth',
        'Traumfabrik',
        'Geheimbibliothek',
        'Ritterturnier',
        'Wikingerschiff',
        'Pyramide',
        'Dschungeltempel',
        'Märchenschloss',
        'Wunschbrunnen',
        'Riesenbaumhaus',
        'Zauberzug',
        'Polarstation',
        'Superheldenzentrale',
        'Monsterschule'
      ]
    }
  };

  function mergeContentLayers(...layers) {
    const merged = {};
    for (const layer of layers) {
      for (const [gameId, gameContent] of Object.entries(layer || {})) {
        if (!gameContent || typeof gameContent !== 'object' || Array.isArray(gameContent)) {
          merged[gameId] = gameContent;
          continue;
        }
        const existingGame = merged[gameId] && typeof merged[gameId] === 'object' && !Array.isArray(merged[gameId])
          ? merged[gameId]
          : {};
        const nextGame = { ...existingGame };
        for (const [packName, packContent] of Object.entries(gameContent)) {
          const existingPack = nextGame[packName];
          if (Array.isArray(existingPack) && Array.isArray(packContent)) {
            nextGame[packName] = [...existingPack, ...packContent];
          } else if (
            existingPack && packContent
            && typeof existingPack === 'object' && !Array.isArray(existingPack)
            && typeof packContent === 'object' && !Array.isArray(packContent)
          ) {
            const nested = { ...existingPack };
            for (const [key, value] of Object.entries(packContent)) {
              nested[key] = Array.isArray(nested[key]) && Array.isArray(value)
                ? [...nested[key], ...value]
                : value;
            }
            nextGame[packName] = nested;
          } else {
            nextGame[packName] = packContent;
          }
        }
        merged[gameId] = nextGame;
      }
    }
    return merged;
  }

  const content = mergeContentLayers(base.content, advancedContent, releaseAdditions, cardAdditions);

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
    return Object.values(gameContent).flatMap(value => {
      if (Array.isArray(value)) return value;
      if (value && typeof value === 'object') return Object.values(value).flat();
      return [];
    });
  }

  function itemCount(id) {
    const gameContent = content[id];
    if (!gameContent) return 0;
    return Object.values(gameContent).reduce((total, value) => {
      if (Array.isArray(value)) return total + value.length;
      if (value && typeof value === 'object') return total + Object.values(value).reduce((sum, list) => sum + list.length, 0);
      return total;
    }, 0);
  }

  return Object.freeze({
    version: 4,
    games: Object.freeze(games),
    content,
    getGame,
    getPackNames,
    getItems,
    itemCount
  });
});