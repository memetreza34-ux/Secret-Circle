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
      id: 'wavelength', title: 'Spektrum-Tipp', icon: '📡', group: 'Einschätzen', status: 'planned', mode: 'planned',
      minPlayers: 4, maxPlayers: 20, duration: 20, moods: ['clever', 'friendly'], age: 'all',
      description: 'Ein geheimer Zielwert liegt zwischen zwei Polen. Eine Person gibt einen kurzen Hinweis, die Gruppe setzt ihre Position auf dem Spektrum.',
      instructions: ['Spektrum und geheimen Zielwert ansehen.', 'Einen kurzen passenden Hinweis geben.', 'Ziel verbergen und die Gruppe eine Position festlegen lassen.', 'Abstand aufdecken und Punkte vergeben.'],
      packs: ['Alltag', 'Popkultur', 'Gefühle']
    }),
    Object.freeze({
      id: 'draw-guess', title: 'Zeichnen & Raten', icon: '✏️', group: 'Kreativ', status: 'planned', mode: 'planned',
      minPlayers: 3, maxPlayers: 20, duration: 20, moods: ['funny', 'competitive'], age: 'all',
      description: 'Begriffe werden auf Papier oder einem späteren Zeichenfeld dargestellt und von der Gruppe erraten.',
      instructions: ['Begriff geheim öffnen.', 'Ohne Buchstaben zeichnen.', 'Zeitlimit beachten.', 'Treffer zählen und weitergeben.'],
      packs: ['Alltag', 'Tiere', 'Filme', 'Schwer']
    }),
    Object.freeze({
      id: 'rapid-fire', title: 'Schnellfeuer', icon: '⏱️', group: 'Schnell', status: 'planned', mode: 'planned',
      minPlayers: 2, maxPlayers: 20, duration: 10, moods: ['chaotic', 'competitive'], age: 'all',
      description: 'Eine Person muss in wenigen Sekunden mehrere Antworten zu einer Kategorie nennen.',
      instructions: ['Kategorie öffnen.', 'Timer starten.', 'Geforderte Anzahl nennen.', 'Bei Erfolg Punkt vergeben.'],
      packs: ['3 in 5 Sekunden', '5 in 10 Sekunden', 'Extrem']
    }),
    Object.freeze({
      id: 'sound-imitation', title: 'Geräusche erraten', icon: '🔊', group: 'Darstellen', status: 'planned', mode: 'planned',
      minPlayers: 3, maxPlayers: 20, duration: 15, moods: ['funny', 'chaotic'], age: 'all',
      description: 'Nur mit Geräuschen wird ein Tier, Gegenstand, Ort oder eine Situation dargestellt.',
      instructions: ['Karte geheim ansehen.', 'Nur Geräusche machen.', 'Keine Wörter oder Gesten.', 'Treffer zählen.'],
      packs: ['Tiere', 'Haushalt', 'Fahrzeuge', 'Situationen']
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

  const content = mergeContentLayers(base.content, advancedContent, releaseAdditions);

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