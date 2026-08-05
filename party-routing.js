(function (root, factory) {
  const base = typeof module === 'object' && module.exports
    ? require('./party-trending-catalog.js')
    : root.SecretCirclePartyCatalog;
  const api = factory(base);
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.SecretCirclePartyCatalog = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function (base) {
  'use strict';
  if (!base) throw new Error('Erweiterter Party-Katalog fehlt.');

  const advancedModes = new Set(['two-truths', 'question-imposter', 'location-spy', 'mafia']);
  const games = base.games.map(game => advancedModes.has(game.mode)
    ? Object.freeze({
        ...game,
        advancedMode: game.mode,
        mode: 'link',
        href: `advanced.html?game=${encodeURIComponent(game.id)}`
      })
    : game
  );

  function getGame(id) {
    return games.find(game => game.id === id) || null;
  }

  return Object.freeze({
    ...base,
    version: 4,
    games: Object.freeze(games),
    getGame
  });
});
