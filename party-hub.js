'use strict';

(() => {
  const C = window.SecretCirclePartyCatalog;
  const L = window.SecretCircleSessionLedger;
  if (!C) throw new Error('Party-Katalog konnte nicht geladen werden.');
  if (!L) throw new Error('Gemeinsames Session-Register für den Party Hub fehlt.');

  const STORAGE_KEY = 'secret-circle-party-hub-v1';
  const MAX_HISTORY = L.maximumHistory;
  const $ = selector => document.querySelector(selector);
  const $$ = selector => [...document.querySelectorAll(selector)];

  const defaults = {
    version: 1,
    players: ['Alex', 'Sam', 'Mika', 'Lina'],
    favorites: [],
    recent: [],
    presets: [],
    history: [],
    stats: {}
  };

  let state = loadState();
  let selectedGameId = null;
  let currentView = 'home';
  let session = null;
  let activeTimer = null;

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function normalizePlayers(input) {
    const values = Array.isArray(input) ? input : String(input ?? '').split(/\n|,/);
    const players = [];
    const seen = new Set();
    for (const raw of values) {
      const name = String(raw ?? '').trim().replace(/\s+/g, ' ').slice(0, 32);
      if (!name) continue;
      const key = name.toLocaleLowerCase('de-DE');
      if (seen.has(key)) continue;
      seen.add(key);
      players.push(name);
      if (players.length >= 20) break;
    }
    return players;
  }

  function normalizeState(value) {
    if (!value || typeof value !== 'object' || value.version !== 1) return clone(defaults);
    return {
      version: 1,
      players: normalizePlayers(value.players),
      favorites: Array.isArray(value.favorites) ? [...new Set(value.favorites.filter(id => C.getGame(id)))].slice(0, 40) : [],
      recent: Array.isArray(value.recent) ? value.recent.filter(id => C.getGame(id)).slice(0, 8) : [],
      presets: Array.isArray(value.presets) ? value.presets.slice(0, 20).map(item => ({
        id: String(item?.id ?? '').slice(0, 80),
        name: String(item?.name ?? '').trim().slice(0, 40),
        players: normalizePlayers(item?.players)
      })).filter(item => item.id && item.name && item.players.length) : [],
      history: Array.isArray(value.history) ? value.history.slice(0, MAX_HISTORY).filter(item => C.getGame(item?.gameId)).map(item => ({
        id: String(item.id ?? ''),
        gameId: item.gameId,
        title: String(item.title ?? C.getGame(item.gameId)?.title ?? '').slice(0, 80),
        endedAt: String(item.endedAt ?? ''),
        rounds: Number.isInteger(item.rounds) ? Math.max(0, item.rounds) : 0,
        score: Number.isInteger(item.score) ? Math.max(0, item.score) : 0
      })) : [],
      stats: value.stats && typeof value.stats === 'object' && !Array.isArray(value.stats) ? value.stats : {}
    };
  }

  function loadState() {
    try {
      return normalizeState(JSON.parse(localStorage.getItem(STORAGE_KEY)));
    } catch {
      return clone(defaults);
    }
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      return true;
    } catch {
      setStatus('Lokale Hub-Daten konnten nicht gespeichert werden.', true);
      return false;
    }
  }

  function setStatus(message, error = false) {
    const node = $('#hub-status');
    node.textContent = message || '';
    node.classList.toggle('error', error);
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
    return items[randomInt(items.length)];
  }

  function formatDate(value) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return 'Unbekannt';
    return new Intl.DateTimeFormat('de-DE', { dateStyle: 'short', timeStyle: 'short' }).format(date);
  }

  function contentItems(gameId, pack) {
    const value = C.content[gameId]?.[pack];
    return Array.isArray(value) ? value : [];
  }

  function clearNode(node) {
    while (node.firstChild) node.firstChild.remove();
  }

  function makeElement(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function gameCard(game, compact = false) {
    const article = makeElement('article', `game-card ${game.status}${compact ? ' compact-card' : ''}`);
    article.dataset.gameId = game.id;

    const top = makeElement('div', 'game-card-top');
    top.append(makeElement('span', 'game-icon', game.icon));
    const favorite = makeElement('button', `favorite-button${state.favorites.includes(game.id) ? ' active' : ''}`, state.favorites.includes(game.id) ? '★' : '☆');
    favorite.type = 'button';
    favorite.dataset.favoriteGame = game.id;
    favorite.setAttribute('aria-label', `${game.title} ${state.favorites.includes(game.id) ? 'aus Favoriten entfernen' : 'als Favorit speichern'}`);
    top.append(favorite);
    article.append(top);

    article.append(makeElement('h3', '', game.title));
    article.append(makeElement('p', '', game.description));

    const meta = makeElement('div', 'game-meta');
    meta.append(makeElement('span', '', `${game.minPlayers}–${game.maxPlayers} Personen`));
    meta.append(makeElement('span', '', `ca. ${game.duration} Min.`));
    if (C.itemCount(game.id)) meta.append(makeElement('span', '', `${C.itemCount(game.id)} Karten`));
    article.append(meta);

    const actions = makeElement('div', 'game-card-actions');
    const open = makeElement('button', 'open-game', game.status === 'playable' ? 'Öffnen' : 'Details');
    open.type = 'button';
    open.dataset.openGame = game.id;
    actions.append(open);
    article.append(actions);

    article.append(makeElement('span', `status-pill ${game.status}`, game.status === 'playable' ? 'Spielbar' : 'In Arbeit'));
    return article;
  }

  function showView(name) {
    currentView = name;
    $$('[data-view]').forEach(view => { view.hidden = view.dataset.view !== name; });
    $$('[data-view-target]').forEach(button => {
      if (button.closest('.hub-nav')) button.setAttribute('aria-current', button.dataset.viewTarget === name ? 'page' : 'false');
    });
    if (name === 'games') renderCatalog();
    if (name === 'players') renderPlayers();
    if (name === 'favorites') renderFavorites();
    if (name === 'stats') renderStats();
    const heading = $(`#view-${name} h1`) || $(`#view-${name} h2`);
    heading?.focus?.();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function renderHome() {
    const playable = C.games.filter(game => game.status === 'playable');
    $('#playable-count').textContent = String(playable.length);
    $('#planned-count').textContent = String(C.games.length - playable.length);
    $('#content-count').textContent = String(C.games.reduce((sum, game) => sum + C.itemCount(game.id), 0));

    const featured = $('#featured-grid');
    clearNode(featured);
    C.games.filter(game => game.featured).slice(0, 3).forEach(game => featured.append(gameCard(game)));

    const recent = $('#recent-list');
    clearNode(recent);
    const games = state.recent.map(id => C.getGame(id)).filter(Boolean).slice(0, 4);
    if (!games.length) {
      recent.className = 'compact-list empty-state';
      recent.textContent = 'Noch kein Spiel gestartet.';
    } else {
      recent.className = 'compact-list';
      for (const game of games) {
        const row = makeElement('div', 'compact-row');
        const text = makeElement('div');
        text.append(makeElement('strong', '', `${game.icon} ${game.title}`));
        text.append(makeElement('small', '', `${game.minPlayers}–${game.maxPlayers} Personen · ca. ${game.duration} Min.`));
        const button = makeElement('button', 'secondary', 'Öffnen');
        button.type = 'button';
        button.dataset.openGame = game.id;
        row.append(text, button);
        recent.append(row);
      }
    }
  }

  function populateGroupFilter() {
    const select = $('#group-filter');
    const current = select.value;
    const groups = [...new Set(C.games.map(game => game.group))].sort((a, b) => a.localeCompare(b, 'de-DE'));
    while (select.options.length > 1) select.remove(1);
    for (const group of groups) {
      const option = new Option(group, group);
      select.add(option);
    }
    select.value = groups.includes(current) ? current : 'all';
  }

  function filteredGames() {
    const query = $('#game-search').value.trim().toLocaleLowerCase('de-DE');
    const group = $('#group-filter').value;
    const mood = $('#mood-filter').value;
    const players = $('#player-filter').value;
    const status = $('#status-filter').value;
    return C.games.filter(game => {
      const searchable = `${game.title} ${game.description} ${game.group} ${game.packs.join(' ')} ${game.moods.join(' ')}`.toLocaleLowerCase('de-DE');
      if (query && !searchable.includes(query)) return false;
      if (group !== 'all' && game.group !== group) return false;
      if (mood !== 'all' && !game.moods.includes(mood)) return false;
      if (status !== 'all' && game.status !== status) return false;
      if (players === 'small' && game.minPlayers > 4) return false;
      if (players === 'medium' && (game.minPlayers > 8 || game.maxPlayers < 5)) return false;
      if (players === 'large' && game.maxPlayers < 9) return false;
      return true;
    });
  }

  function renderCatalog() {
    const games = filteredGames();
    $('#result-count').textContent = String(games.length);
    const grid = $('#game-grid');
    clearNode(grid);
    games.forEach(game => grid.append(gameCard(game)));
    if (!games.length) {
      grid.className = 'game-grid empty-state';
      grid.textContent = 'Keine Spiele passen zu diesen Filtern.';
    } else grid.className = 'game-grid';
  }

  function renderFavorites() {
    const grid = $('#favorites-grid');
    clearNode(grid);
    const games = state.favorites.map(id => C.getGame(id)).filter(Boolean);
    if (!games.length) {
      grid.className = 'game-grid empty-state';
      grid.textContent = 'Noch keine Favoriten gespeichert.';
      return;
    }
    grid.className = 'game-grid';
    games.forEach(game => grid.append(gameCard(game)));
  }

  function renderPlayers() {
    $('#hub-players').value = state.players.join('\n');
    updatePlayerHelp();
    const list = $('#preset-list');
    clearNode(list);
    if (!state.presets.length) {
      list.className = 'preset-list empty-state';
      list.textContent = 'Noch kein Preset gespeichert.';
      return;
    }
    list.className = 'preset-list';
    for (const preset of state.presets) {
      const item = makeElement('div', 'preset-item');
      const text = makeElement('div');
      text.append(makeElement('strong', '', preset.name));
      text.append(makeElement('small', '', preset.players.join(', ')));
      const actions = makeElement('div', 'inline-actions');
      const use = makeElement('button', 'secondary', 'Laden');
      use.type = 'button';
      use.dataset.loadPreset = preset.id;
      const remove = makeElement('button', 'secondary', 'Löschen');
      remove.type = 'button';
      remove.dataset.deletePreset = preset.id;
      actions.append(use, remove);
      item.append(text, actions);
      list.append(item);
    }
  }

  function updatePlayerHelp() {
    const players = normalizePlayers($('#hub-players').value);
    $('#hub-players-help').textContent = `${players.length} eindeutige Personen erkannt. Die meisten Spiele funktionieren mit 2–20 Personen.`;
  }

  function renderStats() {
    const totalSessions = state.history.length;
    const totalRounds = state.history.reduce((sum, item) => sum + item.rounds, 0);
    const uniqueGames = new Set(state.history.map(item => item.gameId)).size;
    const favorite = Object.entries(state.stats).sort((a, b) => (b[1]?.plays || 0) - (a[1]?.plays || 0))[0];
    const favoriteTitle = favorite ? C.getGame(favorite[0])?.title || '–' : '–';
    const cards = $('#stat-cards');
    clearNode(cards);
    [['Sessions', totalSessions], ['Runden', totalRounds], ['Spiele genutzt', uniqueGames], ['Meistgespielt', favoriteTitle]].forEach(([label, value]) => {
      const card = makeElement('div', 'stat-card');
      card.append(makeElement('strong', '', String(value)), makeElement('span', '', label));
      cards.append(card);
    });

    const history = $('#hub-history');
    clearNode(history);
    if (!state.history.length) {
      history.className = 'compact-list empty-state';
      history.textContent = 'Noch kein Hub-Spiel beendet.';
      return;
    }
    history.className = 'compact-list';
    state.history.slice(0, 20).forEach(item => {
      const row = makeElement('div', 'compact-row');
      const text = makeElement('div');
      text.append(makeElement('strong', '', item.title));
      text.append(makeElement('small', '', `${formatDate(item.endedAt)} · ${item.rounds} Runden${item.score ? ` · ${item.score} Punkte` : ''}`));
      const open = makeElement('button', 'secondary', 'Erneut');
      open.type = 'button';
      open.dataset.openGame = item.gameId;
      row.append(text, open);
      history.append(row);
    });
  }

  function toggleFavorite(gameId) {
    const index = state.favorites.indexOf(gameId);
    if (index >= 0) state.favorites.splice(index, 1);
    else state.favorites.unshift(gameId);
    saveState();
    renderHome();
    if (currentView === 'games') renderCatalog();
    if (currentView === 'favorites') renderFavorites();
    if (selectedGameId === gameId) updateDetailFavorite();
  }

  function openDetail(gameId) {
    const game = C.getGame(gameId);
    if (!game) return;
    selectedGameId = game.id;
    $('#detail-icon').textContent = game.icon;
    $('#detail-group').textContent = game.group;
    $('#detail-title').textContent = game.title;
    $('#detail-description').textContent = game.description;

    const badges = $('#detail-badges');
    clearNode(badges);
    [`${game.minPlayers}–${game.maxPlayers} Personen`, `ca. ${game.duration} Minuten`, game.age === 'all' ? 'Familienfreundlich' : 'Ab 12 empfohlen', game.status === 'playable' ? 'Jetzt spielbar' : 'In Entwicklung'].forEach(text => badges.append(makeElement('span', 'badge', text)));

    const packs = $('#detail-packs');
    clearNode(packs);
    game.packs.forEach(pack => packs.append(makeElement('span', 'pack-chip', pack)));

    const rules = $('#detail-rules');
    clearNode(rules);
    game.instructions.forEach(rule => rules.append(makeElement('li', '', rule)));

    const select = $('#pack-select');
    clearNode(select);
    const names = C.getPackNames(game.id);
    names.forEach(name => select.add(new Option(`${name} (${packCount(game.id, name)})`, name)));
    $('#pack-select-label').hidden = names.length === 0 || game.mode === 'link';

    const start = $('#start-selected-game');
    start.textContent = game.status === 'planned' ? 'Noch nicht spielbar' : game.mode === 'link' ? 'Word Imposter öffnen' : 'Spiel starten';
    start.disabled = game.status !== 'playable';
    updateDetailFavorite();
    $('#game-detail').hidden = false;
    $('#close-detail').focus();
  }

  function packCount(gameId, pack) {
    const value = C.content[gameId]?.[pack];
    if (Array.isArray(value)) return value.length;
    if (value && typeof value === 'object') return Object.values(value).reduce((sum, list) => sum + list.length, 0);
    return 0;
  }

  function updateDetailFavorite() {
    const game = C.getGame(selectedGameId);
    if (!game) return;
    const favorite = state.favorites.includes(game.id);
    $('#favorite-selected').textContent = favorite ? 'Aus Favoriten entfernen' : 'Als Favorit speichern';
  }

  function closeDetail() {
    $('#game-detail').hidden = true;
    const trigger = document.querySelector(`[data-open-game="${selectedGameId}"]`);
    trigger?.focus();
  }

  function rememberRecent(gameId) {
    state.recent = [gameId, ...state.recent.filter(id => id !== gameId)].slice(0, L.maximumRecent);
    const saved = saveState();
    if (saved) renderHome();
    return saved;
  }

  function startSelectedGame() {
    const game = C.getGame(selectedGameId);
    if (!game || game.status !== 'playable') return;
    if (game.mode === 'link') {
      rememberRecent(game.id);
      window.location.href = game.href;
      return;
    }
    if (state.players.length < game.minPlayers || state.players.length > game.maxPlayers) {
      closeDetail();
      showView('players');
      setStatus(`${game.title} benötigt ${game.minPlayers}–${game.maxPlayers} Personen. Bitte passe die aktive Gruppe an.`, true);
      return;
    }
    rememberRecent(game.id);
    clearActiveTimer();
    session = {
      gameId: game.id,
      sessionId: L.createSessionId(game.id),
      pack: $('#pack-select').value || C.getPackNames(game.id)[0] || null,
      rounds: 0,
      score: 0,
      playerIndex: 0,
      used: [],
      current: null,
      startedAt: new Date().toISOString(),
      running: false
    };
    closeDetail();
    $('#play-layer').hidden = false;
    renderPlayRound();
    $('#exit-game').focus();
  }

  function clearActiveTimer() {
    if (activeTimer !== null) window.clearInterval(activeTimer);
    activeTimer = null;
  }

  function finishSession() {
    if (!session) return;
    clearActiveTimer();
    const game = C.getGame(session.gameId);
    if (session.rounds > 0) {
      const result = L.recordCompletion(state, {
        id: L.completionId('hub', game.id, session.sessionId),
        gameId: game.id,
        title: game.title,
        endedAt: new Date().toISOString(),
        rounds: session.rounds,
        score: session.score
      });
      if (result.recorded) {
        const previous = state;
        state = result.hub;
        if (!saveState()) {
          state = previous;
          return;
        }
      }
    }
    session = null;
    $('#play-layer').hidden = true;
    renderHome();
    if (currentView === 'stats') renderStats();
    setStatus('Session lokal im Verlauf gespeichert.');
  }

  function pickUnused(items) {
    if (!items.length) return null;
    if (session.used.length >= items.length) session.used = [];
    const available = items.map((_, index) => index).filter(index => !session.used.includes(index));
    const index = available[randomInt(available.length)];
    session.used.push(index);
    return items[index];
  }

  function currentPlayer() {
    if (!state.players.length) return '';
    return state.players[session.playerIndex % state.players.length];
  }

  function advancePlayer() {
    session.playerIndex = (session.playerIndex + 1) % Math.max(1, state.players.length);
  }

  function resetPlayCard() {
    clearActiveTimer();
    $('#play-eyebrow').textContent = '';
    $('#play-title').textContent = '';
    $('#play-player').textContent = '';
    clearNode($('#play-content'));
    clearNode($('#play-options'));
    clearNode($('#play-actions'));
    $('#play-progress').textContent = `${session.rounds} Karten`;
    $('#play-score').textContent = session.score ? `${session.score} Punkte` : '';
  }

  function actionButton(text, handler, className = '') {
    const button = makeElement('button', className, text);
    button.type = 'button';
    button.addEventListener('click', handler);
    return button;
  }

  function nextSimpleRound() {
    session.rounds += 1;
    advancePlayer();
    renderPlayRound();
  }

  function renderPlayRound() {
    if (!session) return;
    resetPlayCard();
    const game = C.getGame(session.gameId);
    $('#play-title').textContent = game.title;
    $('#play-eyebrow').textContent = session.pack || game.group;

    if (game.mode === 'truth-dare') return renderTruthDare();
    if (game.mode === 'prompt') return renderPromptGame();
    if (game.mode === 'choice') return renderChoiceGame();
    if (game.mode === 'paranoia') return renderParanoia();
    if (game.mode === 'charades') return renderCharadesStart();
    if (game.mode === 'taboo') return renderTaboo();
    if (game.mode === 'hot-potato') return renderHotPotatoStart();
    if (game.mode === 'word-chain') return renderWordChainStart();
    if (game.mode === 'random-player') return renderRandomPlayer();
    if (game.mode === 'utility') return renderUtility();
  }

  function renderTruthDare() {
    $('#play-player').textContent = `${currentPlayer()} ist dran`;
    $('#play-content').textContent = 'Wähle Wahrheit oder Pflicht.';
    $('#play-options').append(
      actionButton('Wahrheit', () => revealTruthDare('truth')),
      actionButton('Pflicht', () => revealTruthDare('dare'), 'secondary')
    );
  }

  function revealTruthDare(type) {
    const items = C.content['truth-dare'][session.pack]?.[type] || [];
    const value = pickUnused(items);
    clearNode($('#play-options'));
    $('#play-eyebrow').textContent = type === 'truth' ? `${session.pack} · Wahrheit` : `${session.pack} · Pflicht`;
    $('#play-content').textContent = value || 'Keine Karte verfügbar.';
    $('#play-actions').append(actionButton('Erledigt · nächste Person', nextSimpleRound));
  }

  function renderPromptGame() {
    const items = contentItems(session.gameId, session.pack);
    const value = pickUnused(items);
    if (session.gameId === 'wrong-answers') $('#play-player').textContent = `${currentPlayer()} beginnt`;
    $('#play-content').textContent = value || 'Keine Karte verfügbar.';
    $('#play-actions').append(actionButton('Nächste Karte', nextSimpleRound));
  }

  function renderChoiceGame() {
    const pair = pickUnused(contentItems(session.gameId, session.pack));
    const grid = makeElement('div', 'choice-grid');
    grid.append(makeElement('div', 'choice-card', pair?.[0] || 'Option A'), makeElement('div', 'choice-card', pair?.[1] || 'Option B'));
    $('#play-content').append(grid);
    $('#play-actions').append(actionButton('Nächste Entscheidung', nextSimpleRound));
  }

  function renderParanoia() {
    $('#play-player').textContent = `${currentPlayer()} liest allein`;
    $('#play-content').textContent = 'Gerät so halten, dass niemand mitlesen kann.';
    $('#play-options').append(actionButton('Geheime Frage anzeigen', () => {
      const question = pickUnused(contentItems('paranoia', session.pack));
      $('#play-content').textContent = question || 'Keine Frage verfügbar.';
      clearNode($('#play-options'));
      $('#play-actions').append(actionButton('Name wurde genannt · Münze werfen', () => {
        const reveal = randomInt(2) === 1;
        $('#play-content').textContent = reveal ? `Frage wird aufgedeckt: ${question}` : 'Die Frage bleibt geheim.';
        clearNode($('#play-actions'));
        $('#play-actions').append(actionButton('Nächste Person', nextSimpleRound));
      }));
    }));
  }

  function renderCharadesStart() {
    $('#play-player').textContent = `${currentPlayer()} stellt dar`;
    $('#play-content').textContent = '60 Sekunden. Begriffe dürfen nicht gesprochen oder buchstabiert werden.';
    $('#play-options').append(actionButton('Runde starten', startCharades));
  }

  function startCharades() {
    session.running = true;
    session.used = [];
    let seconds = 60;
    let roundScore = 0;
    const content = $('#play-content');
    const options = $('#play-options');
    const showCard = () => {
      const item = pickUnused(contentItems('charades', session.pack));
      content.textContent = item || 'Keine Karte verfügbar.';
    };
    const timer = makeElement('div', 'timer-display', '01:00');
    $('#play-player').textContent = `${currentPlayer()} · ${roundScore} Treffer`;
    clearNode(options);
    options.append(
      actionButton('Treffer', () => { roundScore += 1; session.score += 1; $('#play-player').textContent = `${currentPlayer()} · ${roundScore} Treffer`; showCard(); }),
      actionButton('Überspringen', showCard, 'secondary')
    );
    $('#play-actions').append(timer);
    showCard();
    activeTimer = window.setInterval(() => {
      seconds -= 1;
      timer.textContent = `00:${String(seconds).padStart(2, '0')}`;
      if (seconds <= 0) {
        clearActiveTimer();
        navigator.vibrate?.([120, 80, 120]);
        content.textContent = `Zeit vorbei · ${roundScore} Treffer`;
        clearNode(options);
        clearNode($('#play-actions'));
        $('#play-actions').append(actionButton('Nächste Person', nextSimpleRound));
      }
    }, 1000);
  }

  function renderTaboo() {
    const card = pickUnused(contentItems('taboo', session.pack));
    $('#play-player').textContent = `${currentPlayer()} erklärt`;
    const word = makeElement('strong', 'taboo-word', card?.word || 'Keine Karte');
    const banned = makeElement('div', 'banned-list');
    (card?.banned || []).forEach(item => banned.append(makeElement('span', '', item)));
    $('#play-content').append(word, banned);
    $('#play-options').append(
      actionButton('Treffer', () => { session.score += 1; nextSimpleRound(); }),
      actionButton('Überspringen', nextSimpleRound, 'secondary')
    );
  }

  function renderHotPotatoStart() {
    const prompt = pickUnused(contentItems('hot-potato', session.pack));
    $('#play-content').textContent = prompt || 'Keine Aufgabe verfügbar.';
    $('#play-player').textContent = `${currentPlayer()} beginnt mit dem Gerät`;
    $('#play-options').append(actionButton('Zufallstimer starten', () => startHotPotato(prompt)));
  }

  function startHotPotato(prompt) {
    let milliseconds = 10000 + randomInt(16000);
    const startedAt = performance.now();
    $('#play-content').textContent = prompt;
    clearNode($('#play-options'));
    const timer = makeElement('div', 'timer-display', '●');
    $('#play-actions').append(timer);
    activeTimer = window.setInterval(() => {
      const elapsed = performance.now() - startedAt;
      timer.textContent = elapsed % 800 < 400 ? '●' : '○';
      if (elapsed >= milliseconds) {
        clearActiveTimer();
        navigator.vibrate?.([180, 80, 180, 80, 240]);
        timer.textContent = 'STOPP';
        $('#play-content').textContent = 'Wer das Gerät jetzt hält, verliert diese Runde.';
        $('#play-actions').append(actionButton('Neue Runde', nextSimpleRound));
      }
    }, 100);
  }

  function renderWordChainStart() {
    const letters = contentItems('word-chain', session.pack);
    const letter = randomItem(letters) || 'A';
    $('#play-content').textContent = `Kategorie: ${session.pack} · Startbuchstabe: ${letter}`;
    $('#play-player').textContent = `${currentPlayer()} beginnt`;
    $('#play-options').append(actionButton('30-Sekunden-Runde starten', () => startWordChain(letter)));
  }

  function startWordChain(letter) {
    let seconds = 30;
    const timer = makeElement('div', 'timer-display', '00:30');
    clearNode($('#play-options'));
    $('#play-content').textContent = `${session.pack} · Start mit ${letter}`;
    $('#play-actions').append(timer, actionButton('Runde geschafft', () => { session.score += 1; nextSimpleRound(); }, 'secondary'));
    activeTimer = window.setInterval(() => {
      seconds -= 1;
      timer.textContent = `00:${String(seconds).padStart(2, '0')}`;
      if (seconds <= 0) {
        clearActiveTimer();
        navigator.vibrate?.(250);
        $('#play-content').textContent = 'Zeit vorbei.';
        clearNode($('#play-actions'));
        $('#play-actions').append(actionButton('Neue Runde', nextSimpleRound));
      }
    }, 1000);
  }

  function renderRandomPlayer() {
    $('#play-content').textContent = 'Drücke auf Drehen, um eine Person zufällig auszuwählen.';
    $('#play-options').append(actionButton('Drehen', () => {
      const player = randomItem(state.players);
      $('#play-content').textContent = player || 'Keine Person gespeichert.';
      $('#play-content').classList.add('random-result');
      session.rounds += 1;
      navigator.vibrate?.(80);
    }), actionButton('Neu wählen', renderPlayRound, 'secondary'));
  }

  function renderUtility() {
    $('#play-content').textContent = 'Wähle ein Zufallswerkzeug.';
    $('#play-options').append(
      actionButton('Münze', () => showUtilityResult(randomInt(2) ? 'Kopf' : 'Zahl')),
      actionButton('W6', () => showUtilityResult(String(1 + randomInt(6))), 'secondary'),
      actionButton('W20', () => showUtilityResult(String(1 + randomInt(20))), 'secondary'),
      actionButton('1–100', () => showUtilityResult(String(1 + randomInt(100))), 'secondary')
    );
  }

  function showUtilityResult(value) {
    $('#play-content').textContent = value;
    $('#play-content').classList.add('random-result');
    session.rounds += 1;
    navigator.vibrate?.(60);
  }

  function quickStart() {
    const playable = C.games.filter(game => game.status === 'playable' && game.mode !== 'utility' && state.players.length >= game.minPlayers && state.players.length <= game.maxPlayers);
    const game = randomItem(playable);
    if (game) openDetail(game.id);
    else {
      showView('players');
      setStatus('Speichere zuerst eine passende Gruppe.', true);
    }
  }

  function savePlayers() {
    state.players = normalizePlayers($('#hub-players').value);
    saveState();
    updatePlayerHelp();
    setStatus(`${state.players.length} Personen gespeichert.`);
  }

  function savePreset() {
    const name = $('#preset-name').value.trim().replace(/\s+/g, ' ').slice(0, 40);
    const players = normalizePlayers($('#hub-players').value);
    if (!name) return setStatus('Bitte einen Preset-Namen eingeben.', true);
    if (!players.length) return setStatus('Das Preset benötigt mindestens eine Person.', true);
    state.presets.unshift({ id: `${Date.now()}-${randomInt(1_000_000)}`, name, players });
    state.presets = state.presets.slice(0, 20);
    state.players = players;
    $('#preset-name').value = '';
    saveState();
    renderPlayers();
    setStatus(`Preset „${name}“ gespeichert.`);
  }

  function updateConnection() {
    const online = navigator.onLine;
    $('#hub-connection').textContent = online ? 'Online · offline bereit' : 'Offline-Modus';
    $('#hub-connection').classList.toggle('offline', !online);
  }

  function bindEvents() {
    document.addEventListener('click', event => {
      const view = event.target.closest('[data-view-target]')?.dataset.viewTarget;
      if (view) showView(view);
      const gameId = event.target.closest('[data-open-game]')?.dataset.openGame;
      if (gameId) openDetail(gameId);
      const favoriteId = event.target.closest('[data-favorite-game]')?.dataset.favoriteGame;
      if (favoriteId) toggleFavorite(favoriteId);
      const quick = event.target.closest('[data-quick-filter]')?.dataset.quickFilter;
      if (quick) {
        showView('games');
        $('#mood-filter').value = quick;
        renderCatalog();
      }
      const presetId = event.target.closest('[data-load-preset]')?.dataset.loadPreset;
      if (presetId) {
        const preset = state.presets.find(item => item.id === presetId);
        if (preset) {
          state.players = [...preset.players];
          saveState();
          renderPlayers();
          setStatus(`Preset „${preset.name}“ geladen.`);
        }
      }
      const deletePresetId = event.target.closest('[data-delete-preset]')?.dataset.deletePreset;
      if (deletePresetId) {
        state.presets = state.presets.filter(item => item.id !== deletePresetId);
        saveState();
        renderPlayers();
      }
    });

    $('#browse-games').addEventListener('click', () => showView('games'));
    $('#quick-start').addEventListener('click', quickStart);
    ['game-search', 'group-filter', 'mood-filter', 'player-filter', 'status-filter'].forEach(id => {
      $(`#${id}`).addEventListener(id === 'game-search' ? 'input' : 'change', renderCatalog);
    });
    $('#hub-players').addEventListener('input', updatePlayerHelp);
    $('#save-players').addEventListener('click', savePlayers);
    $('#clear-players').addEventListener('click', () => { $('#hub-players').value = ''; updatePlayerHelp(); });
    $('#save-preset').addEventListener('click', savePreset);
    $('#close-detail').addEventListener('click', closeDetail);
    $('#game-detail').addEventListener('click', event => { if (event.target === $('#game-detail')) closeDetail(); });
    $('#favorite-selected').addEventListener('click', () => toggleFavorite(selectedGameId));
    $('#start-selected-game').addEventListener('click', startSelectedGame);
    $('#exit-game').addEventListener('click', finishSession);
    $('#clear-hub-history').addEventListener('click', () => {
      if (!window.confirm('Hub-Verlauf und Hub-Statistik löschen?')) return;
      state.history = [];
      state.stats = {};
      saveState();
      renderStats();
      setStatus('Hub-Verlauf wurde gelöscht.');
    });
    window.addEventListener('online', updateConnection);
    window.addEventListener('offline', updateConnection);
    window.addEventListener('pagehide', () => clearActiveTimer());
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && !$('#game-detail').hidden) closeDetail();
      else if (event.key === 'Escape' && !$('#play-layer').hidden) finishSession();
    });
  }

  populateGroupFilter();
  bindEvents();
  updateConnection();
  renderHome();
  renderPlayers();
  renderFavorites();
  renderStats();
  showView('home');
})();
