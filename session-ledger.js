(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.SecretCircleSessionLedger = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function createSessionLedger() {
  'use strict';

  const VERSION = 1;
  const MAX_HISTORY = 50;
  const MAX_RECENT = 8;

  const clone = value => JSON.parse(JSON.stringify(value));
  const clean = (value, maximum = 120) => String(value ?? '')
    .normalize('NFKC')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9._-]/g, '')
    .slice(0, maximum);

  function hash(value, seed = 2166136261) {
    let result = seed >>> 0;
    for (const character of String(value ?? '')) {
      result ^= character.charCodeAt(0);
      result = Math.imul(result, 16777619);
    }
    return result >>> 0;
  }

  function normalizeSessionId(value) {
    const id = clean(value, 100);
    return id.length >= 8 ? id : '';
  }

  function legacySessionId(gameId, startedAt, rounds) {
    const source = `${gameId}|${startedAt}|${rounds}`;
    return `legacy-${hash(source).toString(36)}-${hash(source, 5381).toString(36)}`;
  }

  function createSessionId(gameId, now = Date.now(), random = Math.random()) {
    const timestamp = Number.isFinite(Number(now)) ? Math.max(0, Math.trunc(Number(now))) : Date.now();
    const randomValue = Number.isFinite(Number(random)) ? Math.max(0, Math.min(0.999999999999, Number(random))) : Math.random();
    const entropy = Math.floor(randomValue * 0xFFFFFFFF).toString(36);
    const gamePart = hash(gameId).toString(36);
    return `session-${timestamp.toString(36)}-${entropy}-${gamePart}`;
  }

  function completionId(engine, gameId, sessionId) {
    const safeEngine = clean(engine, 24);
    const safeGame = clean(gameId, 100);
    const safeSession = normalizeSessionId(sessionId);
    if (!safeEngine || !safeGame || !safeSession) throw new Error('Ungültige Session-Kennung.');
    const source = `${safeEngine}|${safeGame}|${safeSession}`;
    return `completion-${safeEngine}-${hash(source).toString(36)}-${hash(source, 5381).toString(36)}`;
  }

  function normalizeHub(value) {
    const hub = value && typeof value === 'object' && !Array.isArray(value) ? clone(value) : {};
    hub.version = Number.isInteger(hub.version) ? hub.version : 1;
    hub.history = Array.isArray(hub.history) ? hub.history.slice(0, MAX_HISTORY) : [];
    hub.recent = Array.isArray(hub.recent) ? hub.recent.slice(0, MAX_RECENT) : [];
    hub.stats = hub.stats && typeof hub.stats === 'object' && !Array.isArray(hub.stats) ? hub.stats : {};
    return hub;
  }

  function recordCompletion(hubValue, completion) {
    const hub = normalizeHub(hubValue);
    const id = clean(completion?.id, 160);
    const gameId = clean(completion?.gameId, 100);
    const title = String(completion?.title ?? '').normalize('NFKC').trim().replace(/\s+/g, ' ').slice(0, 80);
    const endedAt = String(completion?.endedAt ?? new Date().toISOString());
    const rounds = Math.max(0, Math.min(10_000, Math.trunc(Number(completion?.rounds) || 0)));
    const score = Math.max(0, Math.min(1_000_000, Math.trunc(Number(completion?.score) || 0)));

    if (!id || !gameId || !title || Number.isNaN(Date.parse(endedAt))) {
      throw new Error('Ungültiger Session-Abschluss.');
    }

    const existing = hub.history.find(entry => entry?.id === id);
    if (existing) return Object.freeze({ hub, entry: clone(existing), recorded: false });

    const entry = { id, gameId, title, endedAt: new Date(endedAt).toISOString(), rounds, score };
    hub.history = [entry, ...hub.history.filter(item => item?.id !== id)].slice(0, MAX_HISTORY);
    hub.recent = [gameId, ...hub.recent.filter(item => item !== gameId)].slice(0, MAX_RECENT);

    const previous = hub.stats[gameId] && typeof hub.stats[gameId] === 'object' ? hub.stats[gameId] : {};
    hub.stats[gameId] = {
      plays: Math.max(0, Number(previous.plays) || 0) + 1,
      rounds: Math.max(0, Number(previous.rounds) || 0) + rounds,
      best: Math.max(0, Number(previous.best) || 0, score)
    };

    return Object.freeze({ hub, entry: clone(entry), recorded: true });
  }

  return Object.freeze({
    version: VERSION,
    maximumHistory: MAX_HISTORY,
    maximumRecent: MAX_RECENT,
    normalizeSessionId,
    legacySessionId,
    createSessionId,
    completionId,
    normalizeHub,
    recordCompletion
  });
});
