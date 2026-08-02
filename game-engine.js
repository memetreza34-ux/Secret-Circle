(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.SecretCircleEngine = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const VERSION = 6;
  const MIN_PLAYERS = 3;
  const MAX_PLAYERS = 20;
  const MIN_SECONDS = 60;
  const MAX_SECONDS = 600;
  const MAX_TIE_BREAKS = 1;

  const text = (value, maximum = 80) => String(value ?? '').trim().replace(/\s+/g, ' ').slice(0, maximum);
  const clone = value => JSON.parse(JSON.stringify(value));
  const wordKey = value => text(value, 60).toLocaleLowerCase('de-DE');

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
      const key = wordKey(word);
      if (seen.has(key)) continue;
      seen.add(key);
      result.push({ word, hint });
    }
    if (result.length < 2) throw Error('Eine Kategorie benötigt mindestens zwei unterschiedliche Begriffe.');
    return result;
  }

  function normalizeUsedWords(input) {
    if (input === undefined || input === null) return [];
    if (!Array.isArray(input)) throw Error('Ungültiger Begriffsverlauf.');
    const result = [];
    const seen = new Set();
    for (const raw of input) {
      const word = text(raw, 60);
      if (!word) throw Error('Ungültiger Begriffsverlauf.');
      const key = wordKey(word);
      if (seen.has(key)) throw Error('Doppelter Begriff im Begriffsverlauf.');
      seen.add(key);
      result.push(word);
    }
    return result;
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
      let value = state;
      value = Math.imul(value ^ (value >>> 15), value | 1);
      value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
      return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
    };
  }

  function shuffle(values, random) {
    const copy = [...values];
    for (let index = copy.length - 1; index > 0; index -= 1) {
      const target = Math.floor(random() * (index + 1));
      [copy[index], copy[target]] = [copy[target], copy[index]];
    }
    return copy;
  }

  function createGame(options) {
    const players = normalizePlayers(options?.players);
    const entries = normalizeEntries(options?.entries);
    const usedWords = normalizeUsedWords(options?.usedWords);
    const imposterCount = Number(options?.imposterCount ?? 1);
    const roundSeconds = Number(options?.roundSeconds ?? 180);
    const matchRounds = Number(options?.matchRounds ?? 5);
    if (!Number.isInteger(imposterCount) || imposterCount < 1 || imposterCount >= players.length) throw Error('Die Imposter-Zahl muss mindestens 1 und kleiner als die Spielerzahl sein.');
    if (!Number.isInteger(roundSeconds) || roundSeconds < MIN_SECONDS || roundSeconds > MAX_SECONDS) throw Error('Die Rundenzeit muss zwischen 1 und 10 Minuten liegen.');
    if (!Number.isInteger(matchRounds) || matchRounds < 1 || matchRounds > 20) throw Error('Ein Match muss zwischen 1 und 20 Runden haben.');

    const seed = text(options?.seed, 100) || `${Date.now()}-${Math.random()}`;
    const random = createRng(seed);
    const revealOrder = shuffle(players, random);
    const imposters = revealOrder.slice(0, imposterCount);
    const usedKeys = new Set(usedWords.map(wordKey));
    const unusedEntries = entries.filter(entry => !usedKeys.has(wordKey(entry.word)));
    const pool = unusedEntries.length ? unusedEntries : entries;
    const selected = pool[Math.floor(random() * pool.length)];
    const nextUsedWords = unusedEntries.length ? [...usedWords, selected.word] : [selected.word];
    const createdAt = new Date().toISOString();
    const scores = Object.fromEntries(players.map(name => [name, 0]));

    return {
      version: VERSION,
      id: `sc-${hashSeed(`${seed}-${createdAt}`).toString(36)}`,
      seed,
      category: text(options?.category, 60) || 'Gemischt',
      players,
      revealOrder,
      imposters,
      word: selected.word,
      hint: selected.hint,
      usedWords: nextUsedWords,
      useHint: options?.useHint !== false,
      roundSeconds,
      remainingSeconds: roundSeconds,
      revealIndex: 0,
      phase: 'reveal',
      createdAt,
      completedAt: null,
      matchRounds,
      currentRound: 1,
      scores,
      votes: {},
      voteLeaders: [],
      tieBreakCount: 0,
      eliminatedPlayer: null,
      imposterGuess: null,
      winner: null
    };
  }

  function assertGame(game) {
    if (!game || typeof game !== 'object' || game.version !== VERSION) throw Error('Ungültiger oder veralteter Spielstand.');
    const players = normalizePlayers(game.players);
    const usedWords = normalizeUsedWords(game.usedWords);
    if (!usedWords.some(word => wordKey(word) === wordKey(game.word))) throw Error('Aktueller Begriff fehlt im Begriffsverlauf.');
    if (!Array.isArray(game.revealOrder) || game.revealOrder.length !== players.length || new Set(game.revealOrder).size !== players.length || game.revealOrder.some(name => !players.includes(name))) throw Error('Ungültige Kartenreihenfolge.');
    if (!Array.isArray(game.imposters) || game.imposters.length < 1 || game.imposters.length >= players.length || new Set(game.imposters).size !== game.imposters.length || game.imposters.some(name => !players.includes(name))) throw Error('Ungültige Imposter-Verteilung.');
    if (!['reveal', 'discussion', 'voting', 'tie_break', 'guess', 'completed'].includes(game.phase)) throw Error('Ungültige Spielphase.');
    if (!Number.isInteger(game.revealIndex) || game.revealIndex < 0 || game.revealIndex > players.length) throw Error('Ungültiger Kartenfortschritt.');
    if (!Number.isInteger(game.roundSeconds) || game.roundSeconds < MIN_SECONDS || game.roundSeconds > MAX_SECONDS) throw Error('Ungültige Rundenzeit.');
    if (!Number.isInteger(game.remainingSeconds) || game.remainingSeconds < 0 || game.remainingSeconds > game.roundSeconds) throw Error('Ungültige Restzeit.');
    if (!Number.isInteger(game.matchRounds) || game.matchRounds < 1 || game.matchRounds > 20) throw Error('Ungültige Matchlänge.');
    if (!Number.isInteger(game.currentRound) || game.currentRound < 1 || game.currentRound > game.matchRounds) throw Error('Ungültige Rundennummer.');
    if (!game.scores || typeof game.scores !== 'object' || Object.keys(game.scores).length !== players.length || players.some(name => !Number.isInteger(game.scores[name]) || game.scores[name] < 0)) throw Error('Ungültiger Punktestand.');
    if (!game.word || !game.hint || !game.category || !game.createdAt) throw Error('Unvollständiger Spielstand.');
    if (typeof game.useHint !== 'boolean') throw Error('Ungültige Hilfswort-Einstellung.');
    if (!game.votes || typeof game.votes !== 'object' || Object.keys(game.votes).some(voter => !players.includes(voter)) || Object.values(game.votes).some(target => !players.includes(target))) throw Error('Ungültige Abstimmung.');
    if (Object.entries(game.votes).some(([voter, target]) => voter === target)) throw Error('Selbststimmen sind ungültig.');
    if (!Array.isArray(game.voteLeaders) || new Set(game.voteLeaders).size !== game.voteLeaders.length || game.voteLeaders.some(name => !players.includes(name))) throw Error('Ungültige Stichwahl.');
    if (!Number.isInteger(game.tieBreakCount) || game.tieBreakCount < 0 || game.tieBreakCount > MAX_TIE_BREAKS) throw Error('Ungültige Stichwahlanzahl.');
    if (game.eliminatedPlayer !== null && !players.includes(game.eliminatedPlayer)) throw Error('Ungültige ausgeschiedene Person.');
    if (game.winner !== null && !['innocents', 'imposters'].includes(game.winner)) throw Error('Ungültiger Rundensieger.');
    if (game.phase === 'completed' && (!game.completedAt || !game.winner)) throw Error('Unvollständiges Rundenergebnis.');
    if (game.phase !== 'completed' && game.completedAt !== null) throw Error('Ungültiger Abschlusszeitpunkt.');
    return true;
  }

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
      instruction: isImposter ? 'Höre gut zu, improvisiere und bleibe unauffällig.' : 'Beschreibe den Begriff, ohne ihn direkt zu nennen.'
    };
  }

  function advanceReveal(game) {
    const next = restoreGame(game);
    if (next.phase !== 'reveal') return next;
    next.revealIndex += 1;
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

  function startVoting(game) {
    const next = restoreGame(game);
    if (next.phase !== 'discussion' && next.phase !== 'tie_break') throw Error('Abstimmung kann jetzt nicht gestartet werden.');
    next.phase = 'voting';
    next.votes = {};
    return next;
  }

  function castVote(game, voter, target) {
    const next = restoreGame(game);
    if (next.phase !== 'voting') throw Error('Es läuft keine Abstimmung.');
    if (!next.players.includes(voter) || !next.players.includes(target) || voter === target) throw Error('Ungültige Stimme.');
    if (Object.prototype.hasOwnProperty.call(next.votes, voter)) throw Error('Diese Person hat bereits abgestimmt.');
    if (next.voteLeaders.length && !next.voteLeaders.includes(target)) throw Error('In der Stichwahl darf nur für die führenden Personen gestimmt werden.');
    next.votes[voter] = target;
    return next;
  }

  function finalizeRound(game, imposterGuessed) {
    const innocents = game.players.filter(name => !game.imposters.includes(name));
    if (game.imposters.includes(game.eliminatedPlayer)) {
      if (imposterGuessed) {
        for (const name of game.imposters) game.scores[name] += 2;
        game.winner = 'imposters';
      } else {
        for (const name of innocents) game.scores[name] += 1;
        game.winner = 'innocents';
      }
    } else {
      for (const name of game.imposters) game.scores[name] += 2;
      game.winner = 'imposters';
    }
    game.phase = 'completed';
    game.completedAt = new Date().toISOString();
  }

  function resolveVote(game) {
    const next = restoreGame(game);
    if (next.phase !== 'voting') throw Error('Es läuft keine Abstimmung.');
    if (Object.keys(next.votes).length !== next.players.length) throw Error('Noch nicht alle Personen haben abgestimmt.');
    const counts = {};
    for (const target of Object.values(next.votes)) counts[target] = (counts[target] || 0) + 1;
    const max = Math.max(...Object.values(counts));
    const leaders = Object.keys(counts).filter(name => counts[name] === max).sort((a, b) => a.localeCompare(b, 'de-DE'));

    if (leaders.length > 1) {
      if (next.tieBreakCount >= MAX_TIE_BREAKS) {
        next.voteLeaders = leaders;
        next.eliminatedPlayer = null;
        finalizeRound(next, false);
        return next;
      }
      next.tieBreakCount += 1;
      next.phase = 'tie_break';
      next.voteLeaders = leaders;
      next.votes = {};
      return next;
    }

    next.voteLeaders = [];
    next.eliminatedPlayer = leaders[0];
    next.phase = next.imposters.includes(next.eliminatedPlayer) ? 'guess' : 'completed';
    if (next.phase === 'completed') finalizeRound(next, false);
    return next;
  }

  function submitImposterGuess(game, guess) {
    const next = restoreGame(game);
    if (next.phase !== 'guess') throw Error('Der Imposter darf jetzt nicht raten.');
    next.imposterGuess = text(guess, 60);
    if (!next.imposterGuess) throw Error('Bitte einen Begriff eingeben.');
    const correct = wordKey(next.imposterGuess) === wordKey(next.word);
    finalizeRound(next, correct);
    return next;
  }

  function nextRound(game, options) {
    const previous = restoreGame(game);
    if (previous.phase !== 'completed') throw Error('Die Runde ist noch nicht beendet.');
    if (previous.currentRound >= previous.matchRounds) throw Error('Das Match ist bereits beendet.');
    const next = createGame({ ...options, players: previous.players, matchRounds: previous.matchRounds, usedWords: previous.usedWords });
    next.currentRound = previous.currentRound + 1;
    next.scores = clone(previous.scores);
    return next;
  }

  function isMatchComplete(game) {
    assertGame(game);
    return game.phase === 'completed' && game.currentRound >= game.matchRounds;
  }

  function leaderboard(game) {
    assertGame(game);
    return Object.entries(game.scores)
      .map(([name, score]) => ({ name, score }))
      .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name, 'de-DE'));
  }

  function historyEntry(game) {
    assertGame(game);
    if (game.phase !== 'completed') throw Error('Nur abgeschlossene Runden können gespeichert werden.');
    return {
      id: game.id,
      completedAt: game.completedAt,
      category: game.category,
      playerCount: game.players.length,
      imposterCount: game.imposters.length,
      word: game.word,
      imposters: [...game.imposters],
      winner: game.winner,
      round: game.currentRound
    };
  }

  function parseCustomEntries(input) {
    return normalizeEntries(String(input ?? '')
      .split(/\n/)
      .map(line => line.trim())
      .filter(Boolean)
      .map(line => {
        const [word, ...hint] = line.split('|');
        return { word, hint: hint.join('|') || 'Kein Hilfswort' };
      }));
  }

  return {
    VERSION,
    MIN_PLAYERS,
    MAX_PLAYERS,
    MAX_TIE_BREAKS,
    normalizePlayers,
    normalizeEntries,
    normalizeUsedWords,
    parseCustomEntries,
    createRng,
    shuffle,
    createGame,
    roleFor,
    assertGame,
    restoreGame,
    advanceReveal,
    setRemaining,
    startVoting,
    castVote,
    resolveVote,
    submitImposterGuess,
    nextRound,
    isMatchComplete,
    leaderboard,
    historyEntry
  };
});
