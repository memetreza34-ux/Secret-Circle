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
      id: 'wavelength', title: 'Wellenlänge', icon: '📡', group: 'Teamspiel', status: 'planned', mode: 'planned',
      minPlayers: 4, maxPlayers: 20, duration: 20, moods: ['clever', 'friendly'], age: 'all',
      description: 'Ein Hinweis soll das Team auf einer Skala möglichst nah an einen geheimen Zielpunkt führen.',
      instructions: ['Teams bilden.', 'Ziel auf einer Skala geheim ansehen.', 'Einen passenden Hinweis geben.', 'Teamposition festlegen und Punkte vergeben.'],
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

  const content = Object.assign({}, base.content, advancedContent);

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
    version: 3,
    games: Object.freeze(games),
    content,
    getGame,
    getPackNames,
    getItems,
    itemCount
  });
});