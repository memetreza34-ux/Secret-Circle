'use strict';

(function exposeAdvancedResumeGuard(root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else {
    root.SecretCircleAdvancedResumeGuard = api;
    api.install(root);
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function createAdvancedResumeGuardApi() {
  const ACTIVE_KEY = 'secret-circle-party-active-v1';
  const ACTIVE_VERSIONS = new Set([1, 2]);
  const MODES = new Set(['two-truths', 'question-imposter', 'location-spy', 'mafia']);
  const MAFIA_ROLES = new Set(['Mafia', 'Detektiv', 'Arzt', 'Beschützer', 'Dorfbewohner']);

  const text = value => typeof value === 'string' && value.trim().length > 0;
  const integer = value => Number.isInteger(value);
  const unique = values => Array.isArray(values) && new Set(values).size === values.length;

  function playerList(session, advanced) {
    if (Array.isArray(session?.players) && session.players.length) return session.players;
    if (advanced?.roles && typeof advanced.roles === 'object' && !Array.isArray(advanced.roles)) return Object.keys(advanced.roles);
    return [];
  }

  function validPlayers(players) {
    if (!unique(players) || players.length < 3 || players.length > 20) return false;
    const normalized = players.map(name => typeof name === 'string' ? name.trim().toLocaleLowerCase('de-DE') : '');
    return normalized.every(Boolean) && new Set(normalized).size === normalized.length;
  }

  function member(value, players, { nullable = false } = {}) {
    if (nullable && (value === null || value === undefined)) return true;
    return players.includes(value);
  }

  function validateTwoTruths(data, players) {
    if (!['compose', 'handoff', 'vote', 'result'].includes(data.stage)) return false;
    if (data.stage === 'compose') return true;
    if (!member(data.author, players)) return false;
    if (!Array.isArray(data.statements) || data.statements.length !== 3 || !data.statements.every(text)) return false;
    const statements = data.statements.map(value => value.trim().toLocaleLowerCase('de-DE'));
    if (new Set(statements).size !== 3) return false;
    if (!integer(data.lieIndex) || data.lieIndex < 0 || data.lieIndex > 2) return false;
    if (data.stage === 'result') {
      if (!integer(data.voteIndex) || data.voteIndex < 0 || data.voteIndex > 2) return false;
      if (typeof data.correct !== 'boolean') return false;
      if (data.correct !== (data.voteIndex === data.lieIndex)) return false;
    }
    return true;
  }

  function validateQuestionImposter(data, players) {
    if (!['reveal', 'discussion', 'vote', 'result'].includes(data.stage)) return false;
    if (!data.pair || typeof data.pair !== 'object' || Array.isArray(data.pair) || !text(data.pair.main) || !text(data.pair.imposter)) return false;
    if (!member(data.imposter, players)) return false;
    if (!integer(data.revealIndex) || data.revealIndex < 0 || data.revealIndex >= players.length) return false;
    if (typeof data.revealed !== 'boolean') return false;
    if (data.stage === 'result') {
      if (!member(data.voted, players) || typeof data.correct !== 'boolean') return false;
      if (data.correct !== (data.voted === data.imposter)) return false;
    }
    return true;
  }

  function validateLocationSpy(data, players) {
    if (!['reveal', 'discussion', 'vote', 'guess', 'result'].includes(data.stage)) return false;
    if (!text(data.location) || !member(data.spy, players)) return false;
    if (!integer(data.revealIndex) || data.revealIndex < 0 || data.revealIndex >= players.length) return false;
    if (typeof data.revealed !== 'boolean') return false;
    if (data.stage === 'result') {
      const votePath = member(data.voted, players) && typeof data.correct === 'boolean' && data.correct === (data.voted === data.spy);
      const guessPath = text(data.guess) && typeof data.spyCorrect === 'boolean' && data.spyCorrect === (data.guess === data.location);
      if (!votePath && !guessPath) return false;
    }
    return true;
  }

  function mafiaCountForPlayers(count) {
    if (count >= 16) return 4;
    if (count >= 12) return 3;
    if (count >= 8) return 2;
    return count >= 1 ? 1 : 0;
  }

  function expectedRoleCounts(playerCount, pack) {
    const counts = { Mafia: mafiaCountForPlayers(playerCount), Detektiv: 0, Arzt: 0, Beschützer: 0, Dorfbewohner: 0 };
    let used = counts.Mafia;
    if (used < playerCount) { counts.Detektiv = 1; used += 1; }
    if (pack !== 'Schnell' && playerCount >= 7 && used < playerCount) { counts.Arzt = 1; used += 1; }
    if (pack === 'Erweitert' && playerCount >= 8 && used < playerCount) { counts.Beschützer = 1; used += 1; }
    counts.Dorfbewohner = Math.max(0, playerCount - used);
    return counts;
  }

  function mafiaWinner(data) {
    const mafiaAlive = data.alive.filter(player => data.roles[player] === 'Mafia').length;
    const villageAlive = data.alive.length - mafiaAlive;
    if (mafiaAlive === 0) return 'Dorf';
    if (mafiaAlive >= villageAlive) return 'Mafia';
    return null;
  }

  function validateMafia(data, players, pack) {
    if (!['reveal', 'moderator', 'overview', 'night', 'day', 'finished'].includes(data.stage)) return false;
    if (!['Schnell', 'Klassisch', 'Erweitert'].includes(pack)) return false;
    if (!data.roles || typeof data.roles !== 'object' || Array.isArray(data.roles)) return false;
    const rolePlayers = Object.keys(data.roles);
    if (rolePlayers.length !== players.length || !players.every(player => rolePlayers.includes(player))) return false;
    if (!players.every(player => MAFIA_ROLES.has(data.roles[player]))) return false;

    const actualCounts = Object.values(data.roles).reduce((counts, role) => {
      counts[role] = (counts[role] || 0) + 1;
      return counts;
    }, {});
    const expected = expectedRoleCounts(players.length, pack);
    if (Object.entries(expected).some(([role, count]) => (actualCounts[role] || 0) !== count)) return false;

    if (!unique(data.alive) || data.alive.length < 1 || data.alive.some(player => !players.includes(player))) return false;
    if (!integer(data.day) || data.day < 1 || data.day > 100) return false;
    if (!integer(data.revealIndex) || data.revealIndex < 0 || data.revealIndex >= players.length) return false;
    if (typeof data.revealed !== 'boolean') return false;

    for (const key of ['nightTarget', 'saved', 'protected', 'lastProtected', 'inspected']) {
      if (!member(data[key], players, { nullable: true })) return false;
    }

    const computedWinner = mafiaWinner(data);
    if (data.stage === 'finished') {
      if (!computedWinner || data.winner !== computedWinner) return false;
    } else if (data.winner !== undefined && data.winner !== null) {
      return false;
    }
    return true;
  }

  function validateAdvanced(mode, data, session) {
    if (data === null || data === undefined) return true;
    if (!data || typeof data !== 'object' || Array.isArray(data)) return false;
    const players = playerList(session, data);
    if (!validPlayers(players)) return false;
    if (mode === 'two-truths') return validateTwoTruths(data, players);
    if (mode === 'question-imposter') return validateQuestionImposter(data, players);
    if (mode === 'location-spy') return validateLocationSpy(data, players);
    if (mode === 'mafia') return validateMafia(data, players, session?.pack);
    return false;
  }

  function validateSnapshot(value, expectedGameId = null) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
    if (!ACTIVE_VERSIONS.has(value.version) || !MODES.has(value.gameId) || !value.session || typeof value.session !== 'object' || Array.isArray(value.session)) return false;
    if (expectedGameId && value.gameId !== expectedGameId) return false;
    return validateAdvanced(value.gameId, value.session.advanced, value.session);
  }

  function reportDiscard(root) {
    root.setTimeout?.(() => {
      const status = root.document?.querySelector?.('#advanced-status');
      if (!status) return;
      status.textContent = 'Ein inkonsistenter gespeicherter Rundenzustand wurde sicher verworfen. Starte das Spiel neu.';
      status.classList.add('error');
    }, 0);
  }

  function install(root) {
    const storage = root?.localStorage;
    if (!storage) return false;
    const expectedGameId = new URLSearchParams(root.location?.search || '').get('game') || '';
    let raw;
    try { raw = storage.getItem(ACTIVE_KEY); } catch { return false; }
    if (!raw) return true;

    let parsed;
    try { parsed = JSON.parse(raw); } catch { return true; }
    if (parsed?.gameId !== expectedGameId) return true;
    if (validateSnapshot(parsed, expectedGameId)) return true;

    try { storage.removeItem(ACTIVE_KEY); } catch { return false; }
    reportDiscard(root);
    return false;
  }

  return Object.freeze({
    version: 3,
    activeKey: ACTIVE_KEY,
    validateSnapshot,
    validateAdvanced,
    validateTwoTruths,
    validateQuestionImposter,
    validateLocationSpy,
    validateMafia,
    expectedRoleCounts,
    mafiaWinner,
    install
  });
});
