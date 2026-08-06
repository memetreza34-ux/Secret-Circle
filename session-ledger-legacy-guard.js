(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else {
    root.SecretCircleLegacySessionGuard = api;
    api.install(root);
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function createLegacySessionGuard() {
  'use strict';

  const VERSION = 1;
  const HUB_KEY = 'secret-circle-party-hub-v1';
  const INSTALL_FLAG = '__secretCircleLegacySessionGuardV1';
  const ENGINES = Object.freeze([
    Object.freeze({ engine: 'mega', activeKey: 'secret-circle-party-mega-active-v1', legacyPrefix: 'mega-' }),
    Object.freeze({ engine: 'viral', activeKey: 'secret-circle-party-viral-active-v1', legacyPrefix: 'viral-' })
  ]);

  function parseObject(raw) {
    if (typeof raw !== 'string' || !raw.trim()) return null;
    try {
      const value = JSON.parse(raw);
      return value && typeof value === 'object' && !Array.isArray(value) ? value : null;
    } catch {
      return null;
    }
  }

  function finiteInteger(value, minimum = 0, maximum = 1_000_000) {
    const number = Math.trunc(Number(value));
    return Number.isFinite(number) ? Math.max(minimum, Math.min(maximum, number)) : minimum;
  }

  function contextFor(storage) {
    for (const definition of ENGINES) {
      const active = parseObject(storage?.getItem?.(definition.activeKey));
      if (!active || !active.gameId || !active.startedAt) continue;
      const rounds = finiteInteger(active.targetRounds, 1, 10_000);
      const score = finiteInteger(active.totalScore, 0, 1_000_000);
      if (!rounds) continue;
      return { definition, active, rounds, score };
    }
    return null;
  }

  function completionFromLegacyWrite(nextHub, context, ledger) {
    const newest = Array.isArray(nextHub?.history) ? nextHub.history[0] : null;
    const { definition, active, rounds, score } = context;
    if (!newest || newest.gameId !== active.gameId) return null;
    if (!String(newest.id || '').startsWith(definition.legacyPrefix)) return null;
    if (finiteInteger(newest.rounds, 0, 10_000) !== rounds) return null;
    if (finiteInteger(newest.score, 0, 1_000_000) !== score) return null;

    const sessionId = ledger.normalizeSessionId(active.sessionId)
      || ledger.legacySessionId(active.gameId, active.startedAt, rounds);
    const endedAt = !Number.isNaN(Date.parse(newest.endedAt))
      ? new Date(newest.endedAt).toISOString()
      : new Date().toISOString();

    return {
      id: ledger.completionId(definition.engine, active.gameId, sessionId),
      gameId: active.gameId,
      title: String(newest.title || active.gameId),
      endedAt,
      rounds,
      score
    };
  }

  function normalizeHubWrite(storage, rawNext, ledger) {
    if (!ledger || typeof ledger.recordCompletion !== 'function') return String(rawNext);
    const nextHub = parseObject(String(rawNext));
    const currentHub = parseObject(storage?.getItem?.(HUB_KEY));
    const context = contextFor(storage);
    if (!nextHub || !currentHub || !context) return String(rawNext);

    const completion = completionFromLegacyWrite(nextHub, context, ledger);
    if (!completion) return String(rawNext);
    return JSON.stringify(ledger.recordCompletion(currentHub, completion).hub);
  }

  function install(root) {
    const ledger = root?.SecretCircleSessionLedger;
    const prototype = root?.Storage?.prototype;
    if (!ledger || !prototype || typeof prototype.setItem !== 'function') return false;
    if (prototype[INSTALL_FLAG]) return true;

    const originalSetItem = prototype.setItem;
    const guardedSetItem = function guardedSetItem(key, value) {
      let nextValue = value;
      if (String(key) === HUB_KEY) {
        try { nextValue = normalizeHubWrite(this, value, ledger); } catch {}
      }
      return originalSetItem.call(this, key, nextValue);
    };

    Object.defineProperty(prototype, 'setItem', {
      value: guardedSetItem,
      configurable: true,
      writable: true
    });
    Object.defineProperty(prototype, INSTALL_FLAG, {
      value: true,
      configurable: false,
      enumerable: false,
      writable: false
    });
    return true;
  }

  return Object.freeze({
    version: VERSION,
    hubKey: HUB_KEY,
    engines: ENGINES,
    parseObject,
    contextFor,
    completionFromLegacyWrite,
    normalizeHubWrite,
    install
  });
});
