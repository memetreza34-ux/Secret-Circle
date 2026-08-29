(function (root, factory) {
  const base = typeof module === 'object' && module.exports
    ? require('./party-wave-one-writing-catalog.js')
    : root.SecretCirclePartyCatalog;
  const api = factory(base);
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.SecretCirclePartyCatalog = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function createWaveOneVotingCatalog(base) {
  'use strict';
  if (!base) throw new Error('Wave-1-Katalog für Schätz-/Voting-Spiele fehlt.');

  const quickHref = id => `quick-play.html?game=${encodeURIComponent(id)}`;
  const gamesAdded = [
    Object.freeze({
      id: 'percent-guess', title: 'Prozent schätzen', icon: '📊', group: 'Schätzen & Voting', status: 'playable', mode: 'link',
      href: quickHref('percent-guess'), minPlayers: 2, maxPlayers: 20, duration: 12,
      moods: ['clever', 'competitive', 'friendly'], age: 'all', featured: false,
      description: 'Eine Person schätzt einen Prozentwert. Je näher die Schätzung am Zielwert liegt, desto mehr Punkte gibt es.',
      instructions: ['Pack und Rundenzahl wählen.', 'Aktive Person liest die Schätzfrage.', 'Wert zwischen 0 und 100 Prozent eingeben.', 'Zielwert aufdecken, Punkte vergeben und weitergeben.'],
      packs: ['Alltag', 'Zeit & Zahlen', 'Technik']
    }),
    Object.freeze({
      id: 'party-bracket', title: 'Party Bracket', icon: '🏆', group: 'Schätzen & Voting', status: 'playable', mode: 'link',
      href: quickHref('party-bracket'), minPlayers: 2, maxPlayers: 20, duration: 15,
      moods: ['funny', 'competitive', 'friendly'], age: 'all', featured: false,
      description: 'Acht Optionen treten im K.-o.-System gegeneinander an. Die Gruppe stimmt Paar für Paar bis zum Sieger ab.',
      instructions: ['Themenpack und Rundenzahl wählen.', 'Je zwei Optionen vergleichen.', 'Die Gruppe wählt einen Sieger pro Duell.', 'Nach sieben Entscheidungen steht der Bracket-Sieger fest.'],
      packs: ['Snacks', 'Reise & Freizeit', 'Superkräfte']
    })
  ].map(Object.freeze);

  const estimate = (question, answer, explanation) => Object.freeze({ question, answer, explanation });
  const bracket = (title, entries) => Object.freeze({ title, entries: Object.freeze(entries) });
  const contentAdded = Object.freeze({
    'percent-guess': Object.freeze({
      Alltag: Object.freeze([
        estimate('Wie viel Prozent von 20 sind 5?', 25, '5 von 20 entspricht einem Viertel, also 25 Prozent.'),
        estimate('Wie viel Prozent von 10 sind 7?', 70, '7 von 10 entspricht 70 Prozent.'),
        estimate('Wie viel Prozent von 5 sind 4?', 80, '4 von 5 entspricht 80 Prozent.'),
        estimate('Wie viel Prozent von 8 sind 2?', 25, '2 von 8 entspricht einem Viertel, also 25 Prozent.'),
        estimate('Wie viel Prozent von 50 sind 10?', 20, '10 von 50 entspricht einem Fünftel, also 20 Prozent.'),
        estimate('Wie viel Prozent von 25 sind 20?', 80, '20 geteilt durch 25 ergibt 80 Prozent.'),
        estimate('Wie viel Prozent von 40 sind 30?', 75, '30 von 40 entspricht drei Vierteln, also 75 Prozent.'),
        estimate('Wie viel Prozent von 12 sind 6?', 50, '6 von 12 ist genau die Hälfte.')
      ]),
      'Zeit & Zahlen': Object.freeze([
        estimate('Wie viel Prozent einer Stunde sind 15 Minuten?', 25, '15 Minuten sind ein Viertel von 60 Minuten.'),
        estimate('Wie viel Prozent einer Stunde sind 45 Minuten?', 75, '45 Minuten sind drei Viertel einer Stunde.'),
        estimate('Wie viel Prozent eines Tages sind 6 Stunden?', 25, '6 von 24 Stunden entsprechen 25 Prozent.'),
        estimate('Wie viel Prozent eines Tages sind 12 Stunden?', 50, '12 von 24 Stunden sind die Hälfte.'),
        estimate('Wie viel Prozent einer Woche sind 7 Tage?', 100, 'Sieben Tage sind die gesamte Woche.'),
        estimate('Wie viel Prozent von 200 sind 50?', 25, '50 von 200 ist ein Viertel.'),
        estimate('Wie viel Prozent von 80 sind 40?', 50, '40 von 80 ist die Hälfte.'),
        estimate('Wie viel Prozent von 100 sind 90?', 90, 'Bei einer Basis von 100 entspricht die Zahl direkt dem Prozentwert.')
      ]),
      Technik: Object.freeze([
        estimate('Ein Akku hat 80 von 100 Einheiten Ladung. Wie viel Prozent sind das?', 80, '80 von 100 entspricht 80 Prozent.'),
        estimate('Von 16 Speicherblöcken sind 8 belegt. Wie viel Prozent sind belegt?', 50, '8 von 16 ist die Hälfte.'),
        estimate('Von 20 Aufgaben sind 18 erledigt. Wie viel Prozent sind erledigt?', 90, '18 geteilt durch 20 ergibt 90 Prozent.'),
        estimate('Von 40 Dateien sind 10 markiert. Wie viel Prozent sind markiert?', 25, '10 von 40 entspricht einem Viertel.'),
        estimate('Von 25 Geräten sind 5 offline. Wie viel Prozent sind offline?', 20, '5 von 25 entspricht einem Fünftel.'),
        estimate('Von 50 Tests sind 45 erfolgreich. Wie viel Prozent sind erfolgreich?', 90, '45 von 50 ergibt 90 Prozent.'),
        estimate('Von 10 Sensoren melden 3 einen Zustand. Wie viel Prozent sind das?', 30, '3 von 10 entspricht 30 Prozent.'),
        estimate('Von 8 Ports werden 6 genutzt. Wie viel Prozent sind belegt?', 75, '6 von 8 entspricht drei Vierteln.')
      ])
    }),
    'party-bracket': Object.freeze({
      Snacks: Object.freeze([
        bracket('Snack-Finale', ['Pizza', 'Popcorn', 'Chips', 'Eis', 'Waffeln', 'Nüsse', 'Obst', 'Nachos']),
        bracket('Filmabend-Snacks', ['Popcorn', 'Schokolade', 'Gummibärchen', 'Chips', 'Trauben', 'Kekse', 'Nüsse', 'Brezeln']),
        bracket('Süß oder salzig', ['Brownie', 'Muffin', 'Donut', 'Waffel', 'Pommes', 'Nachos', 'Cracker', 'Popcorn']),
        bracket('Schneller Snack', ['Banane', 'Apfel', 'Toast', 'Joghurt', 'Nüsse', 'Müsliriegel', 'Karotten', 'Käsebrot']),
        bracket('Party-Tisch', ['Mini-Pizza', 'Wraps', 'Obstspieße', 'Gemüsesticks', 'Nachos', 'Popcorn', 'Kekse', 'Kartoffelecken']),
        bracket('Dessert-Duell', ['Eis', 'Kuchen', 'Pudding', 'Waffel', 'Muffin', 'Obstsalat', 'Crêpe', 'Joghurt']),
        bracket('Knusper-Cup', ['Chips', 'Cracker', 'Brezeln', 'Popcorn', 'Nüsse', 'Reiswaffeln', 'Toast', 'Nachos']),
        bracket('Picknick-Finale', ['Sandwich', 'Obst', 'Wrap', 'Salat', 'Muffin', 'Nüsse', 'Kekse', 'Gemüsesticks'])
      ]),
      'Reise & Freizeit': Object.freeze([
        bracket('Freier Tag', ['Strand', 'Berge', 'See', 'Stadt', 'Wald', 'Museum', 'Freizeitpark', 'Schwimmbad']),
        bracket('Wochenend-Cup', ['Camping', 'Hotel', 'Ferienwohnung', 'Tagesausflug', 'Roadtrip', 'Zugreise', 'Fahrradtour', 'Wandern']),
        bracket('Sommer-Finale', ['See', 'Strand', 'Park', 'Freibad', 'Picknick', 'Radtour', 'Bootsfahrt', 'Eisdiele']),
        bracket('Schlechtwetter-Cup', ['Kino', 'Museum', 'Bowling', 'Brettspiele', 'Kochen', 'Gaming', 'Lesen', 'Schwimmbad']),
        bracket('Aktiv-Duell', ['Wandern', 'Radfahren', 'Schwimmen', 'Klettern', 'Tischtennis', 'Basketball', 'Joggen', 'Skaten']),
        bracket('Entspannungs-Finale', ['Lesen', 'Spazieren', 'Musik', 'Film', 'Kochen', 'Zeichnen', 'Puzzle', 'Picknick']),
        bracket('Stadt-Tag', ['Café', 'Park', 'Museum', 'Aussichtspunkt', 'Markt', 'Kino', 'Bibliothek', 'Bowling']),
        bracket('Gruppen-Ausflug', ['Escape-Rätsel', 'Bowling', 'Picknick', 'Wandern', 'Kino', 'Minigolf', 'Museum', 'Fahrradtour'])
      ]),
      Superkräfte: Object.freeze([
        bracket('Superkraft-Finale', ['Fliegen', 'Unsichtbarkeit', 'Teleportation', 'Supertempo', 'Gedankenlesen', 'Zeit anhalten', 'Unterwasser atmen', 'Tierstimmen verstehen']),
        bracket('Alltagskräfte', ['Nie verschlafen', 'Immer WLAN', 'Sofort aufräumen', 'Perfektes Gedächtnis', 'Immer pünktlich', 'Schnell lernen', 'Nie frieren', 'Immer Parkplatz finden']),
        bracket('Abenteuerkräfte', ['Fliegen', 'Teleportation', 'Nachtsicht', 'Superkraft', 'Unterwasser atmen', 'Wände erklimmen', 'Supersprung', 'Gefahren spüren']),
        bracket('Kopfkräfte', ['Gedankenlesen', 'Perfektes Gedächtnis', 'Sprachen verstehen', 'Schnell rechnen', 'Traumkontrolle', 'Extreme Konzentration', 'Musiktalent', 'Schnell lernen']),
        bracket('Elementkräfte', ['Wasser lenken', 'Wind lenken', 'Pflanzen wachsen lassen', 'Licht erzeugen', 'Eis formen', 'Erde bewegen', 'Wolken lenken', 'Wärme erzeugen']),
        bracket('Reisekräfte', ['Teleportation', 'Fliegen', 'Supertempo', 'Unterwasser atmen', 'Orientierungssinn', 'Nie müde werden', 'Jede Sprache verstehen', 'Wetter spüren']),
        bracket('Teamkräfte', ['Heilen', 'Schutzschild', 'Gefahren spüren', 'Mut geben', 'Orientierung', 'Schnell planen', 'Tierstimmen verstehen', 'Perfektes Gedächtnis']),
        bracket('Spaßkräfte', ['Zeitlupe', 'Perfekte Stimme', 'Jeden Witz merken', 'Sofort kochen', 'Tiere verstehen', 'Superzeichnen', 'Jedes Instrument spielen', 'Nie im Stau stehen'])
      ])
    })
  });

  const games = Object.freeze([...base.games, ...gamesAdded]);
  const content = Object.freeze({ ...base.content, ...contentAdded });
  const waveOneVotingGameIds = Object.freeze(gamesAdded.map(game => game.id));
  const waveOneGameIds = Object.freeze([...(base.waveOneGameIds || []), ...waveOneVotingGameIds]);
  const quickGameIds = Object.freeze([...(base.quickGameIds || []), ...waveOneVotingGameIds]);

  function getGame(id) { return games.find(game => game.id === id) || null; }
  function getPackNames(id) { return content[id] && typeof content[id] === 'object' ? Object.keys(content[id]) : []; }
  function getItems(id, pack) {
    const value = content[id];
    if (!value || typeof value !== 'object') return [];
    if (pack && Array.isArray(value[pack])) return value[pack];
    return Object.values(value).flatMap(items => Array.isArray(items) ? items : []);
  }
  function itemCount(id) { return getItems(id).length; }

  return Object.freeze({
    ...base,
    version: 5,
    games,
    content,
    getGame,
    getPackNames,
    getItems,
    itemCount,
    waveOneVotingGameIds,
    waveOneGameIds,
    quickGameIds
  });
});
