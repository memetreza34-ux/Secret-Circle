(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.SecretCircleEngine = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const VERSION = 4;
  const MIN_PLAYERS = 3;
  const MAX_PLAYERS = 20;
  const MIN_SECONDS = 60;
  const MAX_SECONDS = 600;
  const MAX_ROUNDS = 20;
  const PHASES = ['reveal', 'discussion', 'voting', 'completed'];

  const text = (value, maximum = 80) =>
    String(value ?? '')
      .trim()
      .replace(/\s+/g, ' ')
      .slice(0, maximum);

  function createSeed() {
    if (typeof crypto === 'object' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }
    if (typeof crypto === 'object' && typeof crypto.getRandomValues === 'function') {
      const buffer = new Uint32Array(4);
      crypto.getRandomValues(buffer);
      return [...buffer].map((value) => value.toString(36)).join('-');
    }
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
  }

  function normalizePlayers(input) {
    const values = Array.isArray(input) ? input : String(input ?? '').split(/\n|,/);
    const players = [];
    const seen = new Set();

    for (const raw of values) {
      const name = text(raw, 32);
      if (!name) continue;
      const key = name.toLocaleLowerCase('de-DE');
      if (seen.has(key)) throw Error(`Doppelter Spielername: ${name}`);
      seen.add(key);
      players.push(name);
    }

    if (players.length < MIN_PLAYERS) throw Error(`Mindestens ${MIN_PLAYERS} Personen erforderlich.`);
    if (players.length > MAX_PLAYERS) throw Error(`Höchstens ${MAX_PLAYERS} Personen möglich.`);
    return players;
  }

  function normalizeEntries(entries) {
    if (!Array.isArray(entries)) throw Error('Ungültige Begriffsliste.');
    const result = [];
    const seen = new Set();

    for (const entry of entries) {
      const word = text(Array.isArray(entry) ? entry[0] : entry?.word, 60);
      const hint = text(Array.isArray(entry) ? entry[1] : entry?.hint, 60) || 'Kein Hilfswort';
      if (!word) continue;
      const key = word.toLocaleLowerCase('de-DE');
      if (seen.has(key)) continue;
      seen.add(key);
      result.push({ word, hint });
    }

    if (result.length < 2) throw Error('Eine Kategorie benötigt mindestens zwei unterschiedliche Begriffe.');
    return result;
  }

  function normalizeScores(players, scores = {}) {
    const result = {};
    for (const player of players) {
      const value = Number(scores?.[player] ?? 0);
      if (!Number.isInteger(value) || value < 0 || value > 9999) throw Error('Ungültiger Punktestand.');
      result[player] = value;
    }
    return result;
  }

  function normalizeUsedWords(input) {
    if (!Array.isArray(input)) return [];
    const seen = new Set();
    for (const value of input) {
      const word = text(value, 60);
      if (word) seen.add(word);
    }
    return [...seen].slice(-200);
  }

  function hashSeed(seed) {
    let hash = 2166136261;
    for (const char of String(seed ?? '')) {
      hash ^= char.charCodeAt(0);
      hash = Math.imul(hash, 16777619);
    }
    return hash >>> 0;
  }

  function createRng(seed) {
    let state = hashSeed(seed) || 0x6d2b79f5;
    return () => {
      state += 0x6d2b79f5;
      let t = state;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function shuffle(values, random) {
    const copy = [...values];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function pickEntry(entries, usedWords, random) {
    const used = new Set(usedWords);
    const fresh = entries.filter((entry) => !used.has(entry.word));
    const pool = fresh.length ? fresh : entries;
    return pool[Math.floor(random() * pool.length)];
  }

  function createGame(options) {
    const players = normalizePlayers(options?.players);
    const entries = normalizeEntries(options?.entries);
    const imposterCount = Number(options?.imposterCount ?? 1);
    const roundSeconds = Number(options?.roundSeconds ?? 180);
    const roundNumber = Number(options?.roundNumber ?? 1);
    const maxRounds = Number(options?.maxRounds ?? 3);

    if (!Number.isInteger(imposterCount) || imposterCount < 1 || imposterCount >= players.length) {
      throw Error('Die Imposter-Zahl muss mindestens 1 und kleiner als die Spielerzahl sein.');
    }
    if (!Number.isInteger(roundSeconds) || roundSeconds < MIN_SECONDS || roundSeconds > MAX_SECONDS) {
      throw Error('Die Rundenzeit muss zwischen 1 und 10 Minuten liegen.');
    }
    if (!Number.isInteger(roundNumber) || roundNumber < 1 || roundNumber > MAX_ROUNDS) {
      throw Error('Ungültige Rundennummer.');
    }
    if (!Number.isInteger(maxRounds) || maxRounds < 1 || maxRounds > MAX_ROUNDS || roundNumber > maxRounds) {
      throw Error('Ungültige Rundenzahl.');
    }

    const seed = text(options?.seed, 100) || createSeed();
    const usedWords = normalizeUsedWords(options?.usedWords);

    // Jede Ziehung bekommt einen eigenen Zufallsstrom, damit sich aus einer
    // sichtbaren Reihenfolge nie eine andere ableiten lässt.
    const revealOrder = shuffle(players, createRng(`${seed}#reveal`));
    const imposters = shuffle(players, createRng(`${seed}#imposters`)).slice(0, imposterCount);
    const voteOrder = shuffle(players, createRng(`${seed}#votes`));
    const selected = pickEntry(entries, usedWords, createRng(`${seed}#word`));

    const createdAt = new Date().toISOString();
    const matchId = text(options?.matchId, 80) || `match-${hashSeed(`${seed}-${players.join('|')}`).toString(36)}`;

    return {
      version: VERSION,
      id: `sc-${hashSeed(`${seed}-${roundNumber}-${createdAt}`).toString(36)}`,
      matchId,
      seed,
      categoryId: text(options?.categoryId, 80) || 'all',
      category: text(options?.category, 60) || 'Gemischt',
      players,
      revealOrder,
      voteOrder,
      imposters,
      word: selected.word,
      hint: selected.hint,
      usedWords: [...usedWords, selected.word].slice(-200),
      useHint: options?.useHint !== false,
      roundSeconds,
      remainingSeconds: roundSeconds,
      revealIndex: 0,
      phase: 'reveal',
      roundNumber,
      maxRounds,
      scores: normalizeScores(players, options?.scores),
      votes: {},
      voteResult: null,
      createdAt,
      completedAt: null
    };
  }

  function assertOrder(order, players, label) {
    if (
      !Array.isArray(order) ||
      order.length !== players.length ||
      new Set(order).size !== players.length ||
      order.some((name) => !players.includes(name))
    ) {
      throw Error(label);
    }
  }

  function assertGame(game) {
    if (!game || typeof game !== 'object' || game.version !== VERSION) {
      throw Error('Ungültiger oder veralteter Spielstand.');
    }

    const players = normalizePlayers(game.players);
    assertOrder(game.revealOrder, players, 'Ungültige Kartenreihenfolge.');
    assertOrder(game.voteOrder, players, 'Ungültige Abstimmungsreihenfolge.');

    if (
      !Array.isArray(game.imposters) ||
      game.imposters.length < 1 ||
      game.imposters.length >= players.length ||
      new Set(game.imposters).size !== game.imposters.length ||
      game.imposters.some((name) => !players.includes(name))
    ) {
      throw Error('Ungültige Imposter-Verteilung.');
    }
    if (!PHASES.includes(game.phase)) throw Error('Ungültige Spielphase.');
    if (!Number.isInteger(game.revealIndex) || game.revealIndex < 0 || game.revealIndex > players.length) {
      throw Error('Ungültiger Kartenfortschritt.');
    }
    if (
      !Number.isInteger(game.remainingSeconds) ||
      game.remainingSeconds < 0 ||
      game.remainingSeconds > game.roundSeconds
    ) {
      throw Error('Ungültige Restzeit.');
    }
    if (
      !Number.isInteger(game.roundNumber) ||
      !Number.isInteger(game.maxRounds) ||
      game.roundNumber < 1 ||
      game.maxRounds < 1 ||
      game.roundNumber > game.maxRounds ||
      game.maxRounds > MAX_ROUNDS
    ) {
      throw Error('Ungültiger Rundenstand.');
    }

    normalizeScores(players, game.scores);

    if (!game.votes || typeof game.votes !== 'object' || Array.isArray(game.votes)) {
      throw Error('Ungültige Abstimmung.');
    }
    for (const [voter, target] of Object.entries(game.votes)) {
      if (!players.includes(voter) || !players.includes(target) || voter === target) throw Error('Ungültige Stimme.');
    }
    if (game.voteResult !== null && typeof game.voteResult !== 'object') {
      throw Error('Ungültiges Abstimmungsergebnis.');
    }
    return true;
  }

  const clone = (value) => JSON.parse(JSON.stringify(value));

  function restoreGame(raw) {
    const parsed = typeof raw === 'string' ? JSON.parse(raw) : clone(raw);
    assertGame(parsed);
    return parsed;
  }

  function roleFor(game, player) {
    assertGame(game);
    if (!game.players.includes(player)) throw Error('Spieler gehört nicht zu dieser Runde.');
    const isImposter = game.imposters.includes(player);

    return {
      player,
      isImposter,
      label: isImposter ? 'Du bist Imposter' : 'Dein geheimer Begriff',
      value: isImposter ? (game.useHint ? game.hint : 'Kein Begriff') : game.word,
      instruction: isImposter
        ? 'Höre gut zu, improvisiere und bleibe unauffällig.'
        : 'Beschreibe den Begriff, ohne ihn direkt zu nennen.'
    };
  }

  function advanceReveal(game) {
    const next = restoreGame(game);
    if (next.phase !== 'reveal') return next;
    next.revealIndex++;
    if (next.revealIndex >= next.revealOrder.length) {
      next.revealIndex = next.revealOrder.length;
      next.phase = 'discussion';
    }
    return next;
  }

  function setRemaining(game, seconds) {
    const next = restoreGame(game);
    const value = Number(seconds);
    if (!Number.isInteger(value) || value < 0 || value > next.roundSeconds) throw Error('Ungültige Restzeit.');
    next.remainingSeconds = value;
    return next;
  }

  function beginVoting(game) {
    const next = restoreGame(game);
    if (next.phase !== 'discussion') throw Error('Abstimmung ist nur nach der Diskussion möglich.');
    next.phase = 'voting';
    next.votes = {};
    return next;
  }

  function castVote(game, voter, target) {
    const next = restoreGame(game);
    if (next.phase !== 'voting') throw Error('Die Abstimmung ist nicht aktiv.');
    if (!next.players.includes(voter) || !next.players.includes(target)) throw Error('Unbekannte Person.');
    if (voter === target) throw Error('Man kann nicht für sich selbst stimmen.');
    next.votes[voter] = target;
    return next;
  }

  function voteTally(game) {
    assertGame(game);
    const counts = Object.fromEntries(game.players.map((player) => [player, 0]));
    for (const target of Object.values(game.votes)) counts[target]++;
    return counts;
  }

  function finalizeVote(game) {
    const next = restoreGame(game);
    if (next.phase !== 'voting') throw Error('Die Abstimmung ist nicht aktiv.');
    if (Object.keys(next.votes).length !== next.players.length) throw Error('Alle Personen müssen abstimmen.');

    const tally = voteTally(next);
    const maximum = Math.max(...Object.values(tally));
    const leaders = next.players.filter((player) => tally[player] === maximum);
    const accused = leaders.length === 1 ? leaders[0] : null;
    const caught = Boolean(accused && next.imposters.includes(accused));
    const delta = Object.fromEntries(next.players.map((player) => [player, 0]));

    if (caught) {
      // Alle außer dem überführten Imposter punkten.
      for (const player of next.players) delta[player] = player === accused ? 0 : 1;
    } else {
      for (const player of next.imposters) delta[player] = 2;
    }

    for (const player of next.players) next.scores[player] += delta[player];

    next.voteResult = { tally, leaders, accused, caught, delta };
    next.phase = 'completed';
    next.completedAt = new Date().toISOString();
    return next;
  }

  function leaderboard(game) {
    assertGame(game);
    return game.players
      .map((player) => ({ player, score: game.scores[player] }))
      .sort((a, b) => b.score - a.score || a.player.localeCompare(b.player, 'de'));
  }

  function nextRoundOptions(game, entries, seed) {
    assertGame(game);
    if (game.phase !== 'completed') throw Error('Die Runde ist noch nicht abgeschlossen.');
    if (game.roundNumber >= game.maxRounds) throw Error('Das Match ist abgeschlossen.');

    return {
      players: game.players,
      entries,
      categoryId: game.categoryId,
      category: game.category,
      imposterCount: game.imposters.length,
      useHint: game.useHint,
      roundSeconds: game.roundSeconds,
      roundNumber: game.roundNumber + 1,
      maxRounds: game.maxRounds,
      scores: game.scores,
      usedWords: game.usedWords,
      matchId: game.matchId,
      seed: seed || createSeed()
    };
  }

  function matchComplete(game) {
    assertGame(game);
    return game.phase === 'completed' && game.roundNumber >= game.maxRounds;
  }

  function historyEntry(game) {
    assertGame(game);
    if (game.phase !== 'completed') throw Error('Nur abgeschlossene Runden können gespeichert werden.');

    return {
      id: game.id,
      matchId: game.matchId,
      roundNumber: game.roundNumber,
      maxRounds: game.maxRounds,
      completedAt: game.completedAt,
      category: game.category,
      playerCount: game.players.length,
      imposterCount: game.imposters.length,
      word: game.word,
      imposters: [...game.imposters],
      accused: game.voteResult?.accused || null,
      caught: Boolean(game.voteResult?.caught),
      scores: { ...game.scores }
    };
  }

  function parseCustomEntries(input) {
    const lines = String(input ?? '')
      .split(/\n/)
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [word, ...hint] = line.split('|');
        return { word, hint: hint.join('|') || 'Kein Hilfswort' };
      });
    return normalizeEntries(lines);
  }

  return {
    VERSION,
    MIN_PLAYERS,
    MAX_PLAYERS,
    createSeed,
    normalizePlayers,
    normalizeEntries,
    normalizeScores,
    parseCustomEntries,
    createRng,
    shuffle,
    createGame,
    roleFor,
    assertGame,
    restoreGame,
    advanceReveal,
    setRemaining,
    beginVoting,
    castVote,
    voteTally,
    finalizeVote,
    leaderboard,
    nextRoundOptions,
    matchComplete,
    historyEntry
  };
});
