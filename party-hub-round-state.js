(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.SecretCirclePartyHubRoundState = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function createPartyHubRoundState() {
  'use strict';

  const VERSION = 3;
  const SAFE_CURRENT_MODES = new Set(['truth-dare', 'prompt', 'choice', 'hot-potato', 'word-chain']);
  const CONCEALED_CURRENT_MODES = new Set(['paranoia']);
  const RESTORABLE_CURRENT_MODES = new Set([...SAFE_CURRENT_MODES, ...CONCEALED_CURRENT_MODES]);
  /* „Gemischt“ nimmt die Karten aller Kategorien eines Spiels zusammen – in fester
     Reihenfolge, damit gespeicherte Positionen nach dem Neuladen gültig bleiben. */
  const MIXED_PACK = 'Gemischt';

  function packContent(catalog, gameId, pack) {
    const gameContent = catalog?.content?.[gameId];
    if (!gameContent || typeof gameContent !== 'object') return undefined;
    if (pack !== MIXED_PACK || Object.prototype.hasOwnProperty.call(gameContent, MIXED_PACK)) return gameContent[pack];
    const packs = Object.values(gameContent);
    if (packs.length && packs.every(Array.isArray)) return packs.flat();
    if (packs.length && packs.every(value => value && typeof value === 'object' && !Array.isArray(value))) {
      const merged = {};
      packs.forEach(value => Object.keys(value).forEach(key => {
        if (Array.isArray(value[key])) merged[key] = (merged[key] || []).concat(value[key]);
      }));
      return merged;
    }
    return undefined;
  }

  function packChoices(catalog, gameId) {
    const names = typeof catalog?.getPackNames === 'function' ? catalog.getPackNames(gameId) : [];
    return names.length > 1 && !names.includes(MIXED_PACK) ? [MIXED_PACK, ...names] : names;
  }

  function indexList(value, maximum = 500, maxExclusive = Number.POSITIVE_INFINITY) {
    if (!Array.isArray(value)) return [];
    return [...new Set(value.filter(index => Number.isInteger(index) && index >= 0 && index < maxExclusive))].slice(0, maximum);
  }

  function truthDarePools(value, content, maximum = 500) {
    const source = value && typeof value === 'object' && !Array.isArray(value) ? value : {};
    const truth = Array.isArray(content?.truth) ? content.truth : [];
    const dare = Array.isArray(content?.dare) ? content.dare : [];
    return {
      truth: indexList(source.truth, maximum, truth.length),
      dare: indexList(source.dare, maximum, dare.length)
    };
  }

  function currentItems(game, pack, current, catalog) {
    if (!game || !current || typeof current !== 'object' || Array.isArray(current) || !RESTORABLE_CURRENT_MODES.has(game.mode)) return null;
    const index = current.index;
    if (!Number.isInteger(index) || index < 0) return null;
    if (game.mode === 'truth-dare') {
      const pool = current.pool;
      if (!['truth', 'dare'].includes(pool)) return null;
      const items = packContent(catalog, 'truth-dare', pack)?.[pool];
      return Array.isArray(items) ? { kind: 'truth-dare', pool, index, items } : null;
    }
    const items = packContent(catalog, game.id, pack);
    if (!Array.isArray(items)) return null;
    return { kind: game.mode, index, items };
  }

  function normalizeCurrent(game, pack, value, catalog) {
    const resolved = currentItems(game, pack, value, catalog);
    if (!resolved || value.kind !== resolved.kind || resolved.index >= resolved.items.length) return null;
    if (resolved.kind === 'choice') {
      const pair = resolved.items[resolved.index];
      if (!Array.isArray(pair) || pair.length < 2) return null;
    }
    if (resolved.kind === 'paranoia') {
      const phase = value.phase === 'resolved' ? 'resolved' : 'question';
      if (phase === 'resolved' && typeof value.reveal !== 'boolean') return null;
      return phase === 'resolved'
        ? { kind: 'paranoia', index: resolved.index, phase, reveal: value.reveal }
        : { kind: 'paranoia', index: resolved.index, phase };
    }
    return resolved.pool
      ? { kind: resolved.kind, pool: resolved.pool, index: resolved.index }
      : { kind: resolved.kind, index: resolved.index };
  }

  function normalizeResume(game, pack, source, catalog, maximum = 500) {
    const truthDareContent = packContent(catalog, 'truth-dare', pack);
    const genericContent = packContent(catalog, game?.id, pack);
    return {
      used: indexList(source?.used, maximum, Array.isArray(genericContent) ? genericContent.length : Number.POSITIVE_INFINITY),
      usedByPool: truthDarePools(source?.usedByPool, truthDareContent, maximum),
      current: normalizeCurrent(game, pack, source?.current, catalog)
    };
  }

  function select(items, used, randomInt) {
    if (!Array.isArray(items) || !items.length || !Array.isArray(used)) return null;
    if (used.length >= items.length) used.splice(0, used.length);
    const available = items.map((_, index) => index).filter(index => !used.includes(index));
    if (!available.length) return null;
    const offset = typeof randomInt === 'function' ? randomInt(available.length) : 0;
    const index = available[Math.max(0, Math.min(available.length - 1, Number(offset) || 0))];
    used.push(index);
    return { index, value: items[index] };
  }

  function ensureCurrent(session, kind, items, randomInt, pool = null) {
    if (!session || !Array.isArray(items)) return null;
    const existing = session.current;
    if (existing?.kind === kind && existing.pool === (pool || undefined) && Number.isInteger(existing.index) && existing.index >= 0 && existing.index < items.length) {
      return { index: existing.index, value: items[existing.index] };
    }
    const used = pool
      ? ((session.usedByPool ||= { truth: [], dare: [] })[pool] ||= [])
      : (session.used ||= []);
    const selected = select(items, used, randomInt);
    session.current = selected
      ? (pool ? { kind, pool, index: selected.index } : { kind, index: selected.index })
      : null;
    return selected;
  }

  function markParanoiaQuestion(session) {
    if (session?.current?.kind !== 'paranoia') return false;
    session.current.phase = 'question';
    delete session.current.reveal;
    return true;
  }

  function resolveParanoia(session, reveal) {
    if (session?.current?.kind !== 'paranoia' || typeof reveal !== 'boolean') return false;
    session.current.phase = 'resolved';
    session.current.reveal = reveal;
    return true;
  }

  function clearCurrent(session) {
    if (session) session.current = null;
  }

  return Object.freeze({
    version: VERSION,
    safeCurrentModes: SAFE_CURRENT_MODES,
    concealedCurrentModes: CONCEALED_CURRENT_MODES,
    restorableCurrentModes: RESTORABLE_CURRENT_MODES,
    mixedPack: MIXED_PACK,
    packContent,
    packChoices,
    indexList,
    truthDarePools,
    normalizeCurrent,
    normalizeResume,
    select,
    ensureCurrent,
    markParanoiaQuestion,
    resolveParanoia,
    clearCurrent
  });
});