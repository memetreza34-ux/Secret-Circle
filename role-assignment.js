'use strict';

(function exposeRoleAssignment(root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else {
    root.SecretCircleRoleAssignment = api;
    if (root.SecretCircleEngine) api.install(root.SecretCircleEngine);
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function createRoleAssignmentApi() {
  const MAX_IMPOSTERS = 6;
  const INSTALL_FLAG = '__secretCircleIndependentRoles';

  function requireEngine(engine) {
    if (!engine || typeof engine.createGame !== 'function' || typeof engine.nextRound !== 'function' || typeof engine.restoreGame !== 'function' || typeof engine.createRng !== 'function' || typeof engine.shuffle !== 'function' || typeof engine.assertGame !== 'function') {
      throw Error('Secret-Circle-Engine für Rollenverteilung fehlt.');
    }
  }

  function validateCount(value, playerCount) {
    const count = Number(value);
    const maximum = Math.min(MAX_IMPOSTERS, Math.max(0, Number(playerCount) - 1));
    if (!Number.isInteger(count) || count < 1 || count > maximum) {
      throw Error(`Die Imposter-Zahl muss zwischen 1 und ${maximum} liegen.`);
    }
    return count;
  }

  function validateGameRoles(game) {
    validateCount(game?.imposters?.length, game?.players?.length);
    return game;
  }

  function assignIndependentRoles(game, engine) {
    requireEngine(engine);
    const count = validateCount(game.imposters.length, game.players.length);
    const random = engine.createRng(`${game.seed}|independent-roles-v1`);
    game.imposters = engine.shuffle(game.players, random).slice(0, count);
    engine.assertGame(game);
    return game;
  }

  function install(engine) {
    requireEngine(engine);
    if (engine[INSTALL_FLAG]) return engine;

    const originalAssertGame = engine.assertGame.bind(engine);
    const originalRestoreGame = engine.restoreGame.bind(engine);
    const originalCreateGame = engine.createGame.bind(engine);
    const originalNextRound = engine.nextRound.bind(engine);

    engine.assertGame = game => {
      originalAssertGame(game);
      validateGameRoles(game);
      return true;
    };

    engine.restoreGame = raw => validateGameRoles(originalRestoreGame(raw));

    engine.createGame = options => {
      const players = engine.normalizePlayers(options?.players);
      validateCount(options?.imposterCount ?? 1, players.length);
      return assignIndependentRoles(originalCreateGame(options), engine);
    };

    engine.nextRound = (game, options) => {
      engine.assertGame(game);
      const count = options?.imposterCount ?? game.imposters.length;
      validateCount(count, game.players.length);
      return assignIndependentRoles(originalNextRound(game, options), engine);
    };

    Object.defineProperty(engine, 'MAX_IMPOSTERS', {
      value: MAX_IMPOSTERS,
      enumerable: true,
      configurable: false,
      writable: false
    });
    Object.defineProperty(engine, INSTALL_FLAG, {
      value: true,
      enumerable: false,
      configurable: false,
      writable: false
    });
    return engine;
  }

  return Object.freeze({
    MAX_IMPOSTERS,
    assignIndependentRoles,
    install,
    validateCount,
    version: 2
  });
});
