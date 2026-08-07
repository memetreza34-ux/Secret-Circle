'use strict';

(() => {
  const C = window.SecretCirclePartyCatalog;
  const A = window.SecretCircleAdvancedModes;
  if (!C || !A) throw new Error('Erweiterte Spielmodule konnten nicht geladen werden.');

  const HUB_KEY = 'secret-circle-party-hub-v1';
  const ACTIVE_KEY = 'secret-circle-party-active-v1';
  const ACTIVE_VERSION = 2;
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

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function cleanText(value, maximum) {
    return String(value ?? '').normalize('NFKC').trim().replace(/\s+/g, ' ').slice(0, maximum);
  }

  function safeInteger(value, fallback = 0) {
    const number = Number(value);
    return Number.isInteger(number) && number >= 0 ? number : fallback;
  }

  function normalizePlayers(input) {
    const source = Array.isArray(input) ? input : [];
    const players = [];
    const seen = new Set();
    for (const raw of source) {
      const name = cleanText(raw, 32);
      const key = name.toLocaleLowerCase('de-DE');
      if (!name || seen.has(key)) continue;
      seen.add(key);
      players.push(name);
      if (players.length >= 20) break;
    }
    return players;
  }

  function normalizeStats(value) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
    const stats = {};
    for (const [id, raw] of Object.entries(value)) {
      if (!C.getGame(id) || !raw || typeof raw !== 'object' || Array.isArray(raw)) continue;
      stats[id] = {
        plays: safeInteger(raw.plays),
        rounds: safeInteger(raw.rounds),
        best: safeInteger(raw.best)
      };
    }
    return stats;
  }

  function loadHubState() {
    try {
      const parsed = JSON.parse(localStorage.getItem(HUB_KEY));
      if (!parsed || parsed.version !== 1 || Array.isArray(parsed)) throw new Error('invalid');
      return {
        version: 1,
        players: normalizePlayers(parsed.players),
        favorites: Array.isArray(parsed.favorites) ? [...new Set(parsed.favorites.filter(id => C.getGame(id)))].slice(0, 40) : [],
        recent: Array.isArray(parsed.recent) ? parsed.recent.filter(id => C.getGame(id)).slice(0, 8) : [],
        presets: Array.isArray(parsed.presets) ? parsed.presets.slice(0, 20) : [],
        history: Array.isArray(parsed.history) ? parsed.history.slice(0, MAX_HISTORY) : [],
        stats: normalizeStats(parsed.stats)
      };
    } catch {
      return { version: 1, players: ['Alex', 'Sam', 'Mika', 'Lina'], favorites: [], recent: [], presets: [], history: [], stats: {} };
    }
  }

  function saveHubState(nextState = hubState) {
    try {
      localStorage.setItem(HUB_KEY, JSON.stringify(nextState));
      return { ok: true };
    } catch (error) {
      return { ok: false, error: error?.message || 'Lokale Hub-Daten konnten nicht gespeichert werden.' };
    }
  }

  function setStatus(message, error = false) {
    const status = $('#advanced-status');
    if (!status) return;
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

  function makeSessionId() {
    if (window.crypto?.randomUUID) return window.crypto.randomUUID();
    return `${Date.now()}-${randomInt(1_000_000_000)}`;
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

  function sessionPlayers(candidate = session) {
    const saved = normalizePlayers(candidate?.players);
    return saved.length ? saved : normalizePlayers(hubState.players);
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
      if (!session) {
        localStorage.removeItem(ACTIVE_KEY);
      } else {
        session.id = cleanText(session.id, 100) || makeSessionId();
        session.players = sessionPlayers();
        localStorage.setItem(ACTIVE_KEY, JSON.stringify({ version: ACTIVE_VERSION, gameId, session }));
      }
      return true;
    } catch (error) {
      setStatus(`Die aktive Session konnte nicht lokal gesichert werden: ${error?.message || 'Speicherfehler'}`, true);
      return false;
    }
  }

  function clearActive() {
    try {
      localStorage.removeItem(ACTIVE_KEY);
      return true;
    } catch (error) {
      setStatus(`Der aktive Session-Marker konnte nicht entfernt werden: ${error?.message || 'Speicherfehler'}`, true);
      return false;
    }
  }

  function rejectActive(message) {
    try { localStorage.removeItem(ACTIVE_KEY); } catch {}
    setStatus(message, true);
    return null;
  }

  function protectSensitiveResume(candidate) {
    const advanced = candidate?.advanced;
    if (!advanced || typeof advanced !== 'object' || Array.isArray(advanced)) return candidate;
    if (advanced.stage === 'reveal' && advanced.revealed === true) advanced.revealed = false;
    if (candidate.gameId === 'mafia' && advanced.stage === 'overview') advanced.stage = 'moderator';
    return candidate;
  }

  function loadActive() {
    try {
      const value = JSON.parse(localStorage.getItem(ACTIVE_KEY));
      if (!value || ![1, ACTIVE_VERSION].includes(value.version) || value.gameId !== gameId || !value.session) return null;
      const candidate = value.session;
      if (!candidate || typeof candidate !== 'object' || Array.isArray(candidate)) return rejectActive('Ein beschädigter aktiver Spielstand wurde verworfen.');
      if (!Number.isInteger(candidate.rounds) || candidate.rounds < 0 || !Number.isInteger(candidate.score) || candidate.score < 0) return rejectActive('Ein beschädigter aktiver Spielstand wurde verworfen.');
      if (!Number.isInteger(candidate.playerIndex) || candidate.playerIndex < 0) return rejectActive('Ein beschädigter aktiver Spielstand wurde verworfen.');
      if (!Number.isInteger(candidate.targetRounds) || candidate.targetRounds < 1 || candidate.targetRounds > MAX_SESSION_ROUNDS) return rejectActive('Ein aktiver Spielstand mit ungültiger Rundenzahl wurde verworfen.');
      if (candidate.rounds > candidate.targetRounds) return rejectActive('Ein widersprüchlicher aktiver Spielstand wurde verworfen.');
      if (!C.getPackNames(gameId).includes(candidate.pack)) return rejectActive('Das Pack der gespeicherten Session ist nicht mehr verfügbar.');
      if (candidate.advanced !== null && (typeof candidate.advanced !== 'object' || Array.isArray(candidate.advanced))) return rejectActive('Ein beschädigter Rundenzustand wurde verworfen.');

      let players = normalizePlayers(candidate.players);
      if (!players.length && candidate.advanced?.roles && typeof candidate.advanced.roles === 'object' && !Array.isArray(candidate.advanced.roles)) {
        players = normalizePlayers(Object.keys(candidate.advanced.roles));
      }
      if (!players.length) players = normalizePlayers(hubState.players);
      if (players.length < game.minPlayers || players.length > game.maxPlayers) return rejectActive('Die gespeicherte Session besitzt keine gültige Spielergruppe mehr.');

      candidate.id = cleanText(candidate.id, 100) || makeSessionId();
      candidate.gameId = gameId;
      candidate.players = players;
      candidate.used = Array.isArray(candidate.used)
        ? [...new Set(candidate.used.filter(index => Number.isInteger(index) && index >= 0))].slice(0, 500)
        : [];
      candidate.playerIndex %= players.length;
      candidate.startedAt = cleanText(candidate.startedAt, 40) || new Date().toISOString();
      protectSensitiveResume(candidate);
      return candidate;
    } catch {
      return rejectActive('Ein beschädigter aktiver Spielstand wurde verworfen.');
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
    session.playerIndex = (session.playerIndex + 1) % sessionPlayers().length;
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
    const playState = { ...hubState, players: sessionPlayers() };
    A.render({
      game: modeGame,
      catalog: C,
      session,
      state: playState,
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
    if (!session) return false;
    const pendingMafiaRound = session.advanced?.stage === 'finished' ? 1 : 0;
    const rounds = session.rounds + pendingMafiaRound;
    if (rounds <= 0) {
      setStatus('Eine leere Session kann nicht in den Verlauf übernommen werden.', true);
      return false;
    }

    const historyId = `advanced-${cleanText(session.id, 100) || makeSessionId()}`;
    const nextHubState = clone(hubState);
    if (!Array.isArray(nextHubState.history)) nextHubState.history = [];
    if (!nextHubState.stats || typeof nextHubState.stats !== 'object' || Array.isArray(nextHubState.stats)) nextHubState.stats = {};
    const alreadySaved = nextHubState.history.some(item => item?.id === historyId);

    if (!alreadySaved) {
      nextHubState.history.unshift({
        id: historyId,
        gameId: game.id,
        title: game.title,
        endedAt: new Date().toISOString(),
        rounds,
        score: session.score
      });
      nextHubState.history = nextHubState.history.slice(0, MAX_HISTORY);
      nextHubState.recent = [game.id, ...(Array.isArray(nextHubState.recent) ? nextHubState.recent : []).filter(id => id !== game.id)].slice(0, 8);
      const current = nextHubState.stats[game.id] || {};
      nextHubState.stats[game.id] = {
        plays: safeInteger(current.plays) + 1,
        rounds: safeInteger(current.rounds) + rounds,
        best: Math.max(safeInteger(current.best), session.score)
      };

      const saved = saveHubState(nextHubState);
      if (!saved.ok) {
        setStatus(`Die Session bleibt aktiv, weil der Hub-Verlauf nicht gespeichert werden konnte: ${saved.error}`, true);
        return false;
      }
      hubState = nextHubState;
    }

    if (!clearActive()) {
      setStatus('Die Session wurde im Verlauf gespeichert, konnte aber noch nicht sicher geschlossen werden. Bitte erneut versuchen.', true);
      return false;
    }
    session = null;
    window.location.href = 'party.html?view=stats';
    return true;
  }

  function startNewSession() {
    if (!game || !game.advancedMode || !A.canHandle(game.advancedMode)) return;
    const players = normalizePlayers(hubState.players);
    if (players.length < game.minPlayers || players.length > game.maxPlayers) {
      setStatus(`${game.title} benötigt ${game.minPlayers}–${game.maxPlayers} Personen.`, true);
      return;
    }
    const targetRounds = Number($('#advanced-length').value);
    if (![3, 5, 10, 20].includes(targetRounds)) {
      setStatus('Ungültige Rundenlänge.', true);
      return;
    }
    const pack = $('#advanced-pack').value;
    if (!C.getPackNames(gameId).includes(pack)) {
      setStatus('Das ausgewählte Pack ist nicht verfügbar.', true);
      return;
    }
    session = {
      id: makeSessionId(),
      gameId: game.id,
      players,
      pack,
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
    persistActive();
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

    const currentValid = hubState.players.length >= game.minPlayers && hubState.players.length <= game.maxPlayers;
    const active = loadActive();
    const start = $('#advanced-start');
    if (active) {
      const labelRound = Math.min(active.rounds + 1, active.targetRounds);
      start.disabled = false;
      start.textContent = active.rounds >= active.targetRounds
        ? 'Abgeschlossene Session ansehen'
        : `Session fortsetzen · Runde ${labelRound}`;
      $('#advanced-player-help').textContent = `Gespeicherte Session mit ${active.players.length} Personen. Die aktuelle Lobby hat ${hubState.players.length} Personen.`;
      start.addEventListener('click', () => resumeSession(active), { once: true });
      const fresh = actionButton('Neue Session beginnen', () => {
        clearActive();
        startNewSession();
      }, 'secondary');
      fresh.disabled = !currentValid;
      if (!currentValid) fresh.title = `${game.minPlayers}–${game.maxPlayers} aktuelle Lobby-Personen erforderlich.`;
      start.after(fresh);
    } else {
      $('#advanced-player-help').textContent = currentValid
        ? `${hubState.players.length} Personen sind bereit.`
        : `${hubState.players.length} Personen gespeichert. Benötigt werden ${game.minPlayers}–${game.maxPlayers}.`;
      start.disabled = !currentValid;
      start.addEventListener('click', startNewSession);
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
