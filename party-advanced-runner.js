'use strict';

(() => {
  const C = window.SecretCirclePartyCatalog;
  const A = window.SecretCircleAdvancedModes;
  if (!C || !A) throw new Error('Erweiterte Spielmodule konnten nicht geladen werden.');

  const HUB_KEY = 'secret-circle-party-hub-v1';
  const ACTIVE_KEY = 'secret-circle-party-active-v1';
  const MAX_HISTORY = 50;
  const MAX_SESSION_ROUNDS = 20;
  const $ = selector => document.querySelector(selector);
  const gameId = new URLSearchParams(window.location.search).get('game') || '';
  const game = C.getGame(gameId);
  let hubState = loadHubState();
  let session = null;

  const nodes = {
    eyebrow: $('#play-eyebrow'),
    title: $('#play-title'),
    player: $('#play-player'),
    content: $('#play-content'),
    options: $('#play-options'),
    actions: $('#play-actions'),
    progress: $('#play-progress'),
    score: $('#play-score')
  };

  function normalizePlayers(input) {
    const source = Array.isArray(input) ? input : [];
    const players = [];
    const seen = new Set();
    for (const raw of source) {
      const name = String(raw ?? '').trim().replace(/\s+/g, ' ').slice(0, 32);
      const key = name.toLocaleLowerCase('de-DE');
      if (!name || seen.has(key)) continue;
      seen.add(key);
      players.push(name);
      if (players.length >= 20) break;
    }
    return players;
  }

  function loadHubState() {
    try {
      const parsed = JSON.parse(localStorage.getItem(HUB_KEY));
      if (!parsed || parsed.version !== 1) throw new Error('invalid');
      return {
        version: 1,
        players: normalizePlayers(parsed.players),
        favorites: Array.isArray(parsed.favorites) ? parsed.favorites : [],
        recent: Array.isArray(parsed.recent) ? parsed.recent : [],
        presets: Array.isArray(parsed.presets) ? parsed.presets : [],
        history: Array.isArray(parsed.history) ? parsed.history.slice(0, MAX_HISTORY) : [],
        stats: parsed.stats && typeof parsed.stats === 'object' && !Array.isArray(parsed.stats) ? parsed.stats : {}
      };
    } catch {
      return { version: 1, players: ['Alex', 'Sam', 'Mika', 'Lina'], favorites: [], recent: [], presets: [], history: [], stats: {} };
    }
  }

  function saveHubState() {
    localStorage.setItem(HUB_KEY, JSON.stringify(hubState));
  }

  function setStatus(message, error = false) {
    const status = $('#advanced-status');
    status.textContent = message || '';
    status.classList.toggle('error', error);
  }

  function randomInt(maximum) {
    if (!Number.isInteger(maximum) || maximum <= 0) return 0;
    if (window.crypto?.getRandomValues) {
      const values = new Uint32Array(1);
      window.crypto.getRandomValues(values);
      return values[0] % maximum;
    }
    return Math.floor(Math.random() * maximum);
  }

  function randomItem(items) {
    return items.length ? items[randomInt(items.length)] : null;
  }

  function clearNode(node) {
    while (node.firstChild) node.firstChild.remove();
  }

  function makeElement(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  }

  function actionButton(text, handler, className = '') {
    const button = makeElement('button', className, text);
    button.type = 'button';
    button.addEventListener('click', handler);
    return button;
  }

  function pickUnused(items) {
    if (!Array.isArray(items) || !items.length) return null;
    if (session.used.length >= items.length) session.used = [];
    const available = items.map((_, index) => index).filter(index => !session.used.includes(index));
    const selected = available[randomInt(available.length)];
    session.used.push(selected);
    persistActive();
    return items[selected];
  }

  function persistActive() {
    try {
      if (!session) localStorage.removeItem(ACTIVE_KEY);
      else localStorage.setItem(ACTIVE_KEY, JSON.stringify({ version: 1, gameId, session }));
    } catch {
      setStatus('Die aktive Session konnte nicht lokal gesichert werden.', true);
    }
  }

  function loadActive() {
    try {
      const value = JSON.parse(localStorage.getItem(ACTIVE_KEY));
      if (!value || value.version !== 1 || value.gameId !== gameId || !value.session) return null;
      const candidate = value.session;
      if (!Number.isInteger(candidate.rounds) || candidate.rounds < 0 || !Number.isInteger(candidate.score) || candidate.score < 0) return null;
      if (!Number.isInteger(candidate.playerIndex) || candidate.playerIndex < 0) return null;
      if (!Number.isInteger(candidate.targetRounds) || candidate.targetRounds < 1 || candidate.targetRounds > MAX_SESSION_ROUNDS) return null;
      if (candidate.rounds > candidate.targetRounds) return null;
      if (!C.getPackNames(gameId).includes(candidate.pack)) return null;
      if (candidate.advanced !== null && (typeof candidate.advanced !== 'object' || Array.isArray(candidate.advanced))) return null;
      candidate.used = Array.isArray(candidate.used) ? candidate.used.filter(index => Number.isInteger(index) && index >= 0).slice(0, 500) : [];
      candidate.playerIndex %= Math.max(1, hubState.players.length);
      return candidate;
    } catch {
      return null;
    }
  }

  function resetPlayCard() {
    clearNode(nodes.content);
    clearNode(nodes.options);
    clearNode(nodes.actions);
    nodes.eyebrow.textContent = session.pack || game.group;
    nodes.title.textContent = game.title;
    nodes.player.textContent = '';
    nodes.content.className = 'play-content';
    nodes.progress.textContent = `Runde ${Math.min(session.rounds + 1, session.targetRounds)} von ${session.targetRounds}`;
    nodes.score.textContent = session.score ? `${session.score} Punkte` : '0 Punkte';
  }

  function completeRound() {
    session.rounds += 1;
    session.playerIndex = (session.playerIndex + 1) % Math.max(1, hubState.players.length);
    session.advanced = null;
    persistActive();
    if (session.rounds >= session.targetRounds) renderSessionSummary();
    else render();
  }

  function renderSessionSummary() {
    resetPlayCard();
    nodes.eyebrow.textContent = 'Session abgeschlossen';
    nodes.title.textContent = game.title;
    nodes.player.textContent = `${session.rounds} Runden gespielt`;
    const summary = makeElement('div', 'session-summary');
    summary.append(makeElement('strong', '', String(session.score)), makeElement('span', '', 'Punkte'));
    nodes.content.append(summary);
    if (session.targetRounds < MAX_SESSION_ROUNDS) {
      nodes.actions.append(actionButton('Weitere 5 Runden', () => {
        session.targetRounds = Math.min(MAX_SESSION_ROUNDS, session.targetRounds + 5);
        persistActive();
        render();
      }));
    }
    nodes.actions.append(actionButton('Session speichern und beenden', finishSession, 'secondary'));
  }

  function render() {
    if (!session) return;
    if (session.rounds >= session.targetRounds) {
      renderSessionSummary();
      return;
    }
    resetPlayCard();
    persistActive();
    const modeGame = { ...game, mode: game.advancedMode };
    A.render({
      game: modeGame,
      catalog: C,
      session,
      state: hubState,
      nodes,
      clearNode,
      makeElement,
      actionButton,
      randomInt,
      randomItem,
      pickUnused,
      completeRound,
      render,
      finishSession,
      setStatus
    });
  }

  function finishSession() {
    if (!session) return;
    const pendingMafiaRound = session.advanced?.stage === 'finished' ? 1 : 0;
    const rounds = session.rounds + pendingMafiaRound;
    if (rounds > 0) {
      const endedAt = new Date().toISOString();
      hubState.history.unshift({
        id: `${Date.now()}-${randomInt(1_000_000)}`,
        gameId: game.id,
        title: game.title,
        endedAt,
        rounds,
        score: session.score
      });
      hubState.history = hubState.history.slice(0, MAX_HISTORY);
      hubState.recent = [game.id, ...hubState.recent.filter(id => id !== game.id)].slice(0, 8);
      const stats = hubState.stats[game.id] || { plays: 0, rounds: 0, best: 0 };
      stats.plays += 1;
      stats.rounds += rounds;
      stats.best = Math.max(stats.best || 0, session.score);
      hubState.stats[game.id] = stats;
      try {
        saveHubState();
      } catch {
        setStatus('Die Session konnte nicht im Hub-Verlauf gespeichert werden.', true);
      }
    }
    session = null;
    persistActive();
    window.location.href = 'party.html?view=stats';
  }

  function startNewSession() {
    if (!game || !game.advancedMode || !A.canHandle(game.advancedMode)) return;
    if (hubState.players.length < game.minPlayers || hubState.players.length > game.maxPlayers) {
      setStatus(`${game.title} benötigt ${game.minPlayers}–${game.maxPlayers} Personen.`, true);
      return;
    }
    const targetRounds = Number($('#advanced-length').value);
    if (![3, 5, 10, 20].includes(targetRounds)) {
      setStatus('Ungültige Rundenlänge.', true);
      return;
    }
    session = {
      gameId: game.id,
      pack: $('#advanced-pack').value,
      targetRounds,
      rounds: 0,
      score: 0,
      playerIndex: 0,
      used: [],
      advanced: null,
      startedAt: new Date().toISOString()
    };
    $('#advanced-setup').hidden = true;
    $('#advanced-play-layer').hidden = false;
    persistActive();
    render();
  }

  function resumeSession(active) {
    session = active;
    $('#advanced-setup').hidden = true;
    $('#advanced-play-layer').hidden = false;
    if (session.rounds >= session.targetRounds) renderSessionSummary();
    else render();
  }

  function renderSetup() {
    if (!game || !game.advancedMode || !A.canHandle(game.advancedMode)) {
      $('#advanced-title').textContent = 'Spiel nicht verfügbar';
      $('#advanced-description').textContent = 'Dieser Link enthält kein unterstütztes erweitertes Spiel.';
      $('#advanced-start').disabled = true;
      return;
    }
    document.title = `Secret Circle – ${game.title}`;
    $('#advanced-group').textContent = game.group;
    $('#advanced-title').textContent = `${game.icon} ${game.title}`;
    $('#advanced-description').textContent = game.description;
    const meta = $('#advanced-meta');
    [`${game.minPlayers}–${game.maxPlayers} Personen`, `ca. ${game.duration} Minuten`, `${C.itemCount(game.id)} Inhalte`].forEach(text => meta.append(makeElement('span', 'badge', text)));
    game.instructions.forEach(rule => $('#advanced-rules').append(makeElement('li', '', rule)));
    C.getPackNames(game.id).forEach(pack => $('#advanced-pack').add(new Option(`${pack} (${C.getItems(game.id, pack).length})`, pack)));
    hubState.players.forEach(player => $('#advanced-players').append(makeElement('span', '', player)));
    const valid = hubState.players.length >= game.minPlayers && hubState.players.length <= game.maxPlayers;
    $('#advanced-player-help').textContent = valid
      ? `${hubState.players.length} Personen sind bereit.`
      : `${hubState.players.length} Personen gespeichert. Benötigt werden ${game.minPlayers}–${game.maxPlayers}.`;
    $('#advanced-start').disabled = !valid;

    const active = loadActive();
    if (active && valid) {
      const labelRound = Math.min(active.rounds + 1, active.targetRounds);
      $('#advanced-start').textContent = active.rounds >= active.targetRounds
        ? 'Abgeschlossene Session ansehen'
        : `Session fortsetzen · Runde ${labelRound}`;
      $('#advanced-start').addEventListener('click', () => resumeSession(active), { once: true });
      const fresh = actionButton('Neue Session beginnen', () => {
        localStorage.removeItem(ACTIVE_KEY);
        startNewSession();
      }, 'secondary');
      $('#advanced-start').after(fresh);
    } else {
      $('#advanced-start').addEventListener('click', startNewSession);
    }
  }

  $('#advanced-exit').addEventListener('click', () => {
    if (!session) return;
    if (session.rounds === 0 && !window.confirm('Session wirklich verlassen? Der aktuelle Fortschritt bleibt zum Fortsetzen gespeichert.')) return;
    window.location.href = 'party.html';
  });
  window.addEventListener('pagehide', persistActive);
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && session) window.location.href = 'party.html';
  });

  renderSetup();
})();
