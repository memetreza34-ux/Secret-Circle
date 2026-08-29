(function (root, factory) {
  const base = typeof module === 'object' && module.exports
    ? require('./party-wave-one-catalog.js')
    : root.SecretCirclePartyCatalog;
  const api = factory(base);
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.SecretCirclePartyCatalog = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function createWaveOneImposterCatalog(base) {
  'use strict';
  if (!base) throw new Error('Wave-1-Basiskatalog für Imposter-Varianten fehlt.');

  const quickHref = id => `quick-play.html?game=${encodeURIComponent(id)}`;
  const gamesAdded = [
    Object.freeze({
      id: 'undercover-similar-word', title: 'Undercover – ähnliches Wort', icon: '🕶️', group: 'Täuschung', status: 'playable', mode: 'link',
      href: quickHref('undercover-similar-word'), minPlayers: 3, maxPlayers: 20, duration: 12,
      moods: ['clever', 'competitive', 'funny'], age: 'all', featured: false,
      description: 'Fast alle bekommen denselben Begriff. Eine Person erhält ein ähnliches Wort und muss unauffällig bleiben.',
      instructions: ['Pack und Rundenzahl wählen.', 'Karten nacheinander privat ansehen und sofort wieder verdecken.', 'Reihum kurze Hinweise geben.', 'Geheim abstimmen und die Wörter auflösen.'],
      packs: ['Alltag', 'Essen', 'Gaming']
    }),
    Object.freeze({
      id: 'no-word-imposter', title: 'Imposter ohne Wort', icon: '🫥', group: 'Täuschung', status: 'playable', mode: 'link',
      href: quickHref('no-word-imposter'), minPlayers: 3, maxPlayers: 20, duration: 12,
      moods: ['clever', 'competitive', 'funny'], age: 'all', featured: false,
      description: 'Alle außer dem Imposter kennen den Begriff. Wird der Imposter gewählt, bekommt er einen letzten Versuch, das Wort zu erraten.',
      instructions: ['Pack und Rundenzahl wählen.', 'Karten nacheinander privat ansehen und sofort wieder verdecken.', 'Hinweise geben und geheim abstimmen.', 'Enttarnter Imposter darf das Wort einmal erraten.'],
      packs: ['Alltag', 'Essen', 'Orte']
    })
  ].map(Object.freeze);

  const contentAdded = Object.freeze({
    'undercover-similar-word': Object.freeze({
      Alltag: Object.freeze([
        Object.freeze({ civilian: 'Bus', undercover: 'Zug' }),
        Object.freeze({ civilian: 'Sofa', undercover: 'Sessel' }),
        Object.freeze({ civilian: 'Handy', undercover: 'Tablet' }),
        Object.freeze({ civilian: 'Regen', undercover: 'Schnee' }),
        Object.freeze({ civilian: 'Schule', undercover: 'Arbeit' }),
        Object.freeze({ civilian: 'Kaffee', undercover: 'Tee' }),
        Object.freeze({ civilian: 'Fahrrad', undercover: 'Roller' }),
        Object.freeze({ civilian: 'Rucksack', undercover: 'Koffer' })
      ]),
      Essen: Object.freeze([
        Object.freeze({ civilian: 'Pizza', undercover: 'Flammkuchen' }),
        Object.freeze({ civilian: 'Apfel', undercover: 'Birne' }),
        Object.freeze({ civilian: 'Reis', undercover: 'Nudeln' }),
        Object.freeze({ civilian: 'Burger', undercover: 'Sandwich' }),
        Object.freeze({ civilian: 'Kuchen', undercover: 'Muffin' }),
        Object.freeze({ civilian: 'Pommes', undercover: 'Kartoffelecken' }),
        Object.freeze({ civilian: 'Saft', undercover: 'Smoothie' }),
        Object.freeze({ civilian: 'Suppe', undercover: 'Eintopf' })
      ]),
      Gaming: Object.freeze([
        Object.freeze({ civilian: 'Controller', undercover: 'Tastatur' }),
        Object.freeze({ civilian: 'Level', undercover: 'Mission' }),
        Object.freeze({ civilian: 'Boss', undercover: 'Rivale' }),
        Object.freeze({ civilian: 'Inventar', undercover: 'Rucksack' }),
        Object.freeze({ civilian: 'Strategie', undercover: 'Taktik' }),
        Object.freeze({ civilian: 'Team', undercover: 'Squad' }),
        Object.freeze({ civilian: 'Checkpoint', undercover: 'Speicherpunkt' }),
        Object.freeze({ civilian: 'Rennspiel', undercover: 'Sportsimulation' })
      ])
    }),
    'no-word-imposter': Object.freeze({
      Alltag: Object.freeze(['Schlüssel', 'Regenschirm', 'Fahrrad', 'Kopfhörer', 'Aufzug', 'Kalender', 'Kissen', 'Rucksack']),
      Essen: Object.freeze(['Pizza', 'Banane', 'Pasta', 'Schokolade', 'Salat', 'Toast', 'Pommes', 'Eis']),
      Orte: Object.freeze(['Bahnhof', 'Bibliothek', 'Supermarkt', 'Schule', 'Park', 'Museum', 'Flughafen', 'Schwimmbad'])
    })
  });

  const games = Object.freeze([...base.games, ...gamesAdded]);
  const content = Object.freeze({ ...base.content, ...contentAdded });
  const waveOneImposterGameIds = Object.freeze(gamesAdded.map(game => game.id));
  const waveOneQuizGameIds = Object.freeze([...(base.waveOneGameIds || [])]);
  const waveOneGameIds = Object.freeze([...waveOneQuizGameIds, ...waveOneImposterGameIds]);
  const quickGameIds = Object.freeze([...(base.quickGameIds || []), ...waveOneImposterGameIds]);

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
    version: 3,
    games,
    content,
    getGame,
    getPackNames,
    getItems,
    itemCount,
    waveOneQuizGameIds,
    waveOneImposterGameIds,
    waveOneGameIds,
    quickGameIds
  });
});
