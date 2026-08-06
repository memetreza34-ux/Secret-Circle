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

  function requireEngine(engine) {
    if (!engine || typeof engine.createGame !== 'function' || typeof engine.nextRound !== 'function' || typeof engine.restoreGame !== 'function' || typeof engine.assignIndependentRoles !== 'function' || typeof engine.validateImposterCount !== 'function' || typeof engine.assertGame !== 'function') {
      throw Error('Secret-Circle-Engine mit integrierter Rollenverteilung fehlt.');
    }
    if (engine.MAX_IMPOSTERS !== MAX_IMPOSTERS) throw Error('Engine und Rollenmodul verwenden unterschiedliche Imposter-Grenzen.');
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
    if (!Array.isArray(game.imposters) || new Set(game.imposters).size !== game.imposters.length || game.imposters.some(name => !game.players.includes(name))) {
      throw Error('Ungültige Imposter-Verteilung.');
    }
    return game;
  }

  function assignIndependentRoles(game, engine) {
    requireEngine(engine);
    const next = JSON.parse(JSON.stringify(game));
    const count = validateCount(next?.imposters?.length, next?.players?.length);
    next.imposters = engine.assignIndependentRoles(next.players, count, next.seed);
    engine.assertGame(next);
    return next;
  }

  function install(engine) {
    requireEngine(engine);
    return engine;
  }

  return Object.freeze({
    MAX_IMPOSTERS,
    assignIndependentRoles,
    install,
    validateCount,
    validateGameRoles,
    version: 3
  });
});
