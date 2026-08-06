'use strict';

(() => {
  const C = window.SecretCirclePartyCatalog;
  const gameId = new URLSearchParams(location.search).get('game') || '';
  if (!C?.createdGameIds?.includes(gameId)) return;

  const game = C.getGame(gameId);
  const HUB_KEY = 'secret-circle-party-hub-v1';
  const ACTIVE_KEY = 'secret-circle-party-created-active-v1';
  const VERSION = 1;
  const MAX_HISTORY = 50;
  const $ = selector => document.querySelector(selector);
  let hub = loadHub();
  let active = loadActive();
  let timerId = null;

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function cleanPlayers(value) {
    const players = [];
    const seen = new Set();
    for (const item of Array.isArray(value) ? value : []) {
      const name = String(item ?? '').normalize('NFKC').trim().replace(/\s+/g, ' ').slice(0, 32);
      const key = name.toLocaleLowerCase('de-DE');
      if (!name || seen.has(key)) continue;
      seen.add(key);
      players.push(name);
      if (players.length >= 20) break;
    }
    return players;
  }

  function loadHub() {
    try {
      const value = JSON.parse(localStorage.getItem(HUB_KEY));
      if (!value || value.version !== 1) throw new Error('invalid');
      return {
        ...value,
        players: cleanPlayers(value.players),
        recent: Array.isArray(value.recent) ? value.recent.filter(id => C.getGame(id)).slice(0, 8) : [],
        history: Array.isArray(value.history) ? value.history.slice(0, MAX_HISTORY) : [],
        stats: value.stats && typeof value.stats === 'object' && !Array.isArray(value.stats) ? value.stats : {}
      };
    } catch {
      return { version: 1, players: ['Alex', 'Sam', 'Mika', 'Lina'], favorites: [], recent: [], presets: [], history: [], stats: {} };
    }
  }

  function validCurrent(value) {
    if (value === null) return null;
    if (game.creatorMode === 'choice') return Array.isArray(value) && value.length === 2 && value.every(item => typeof item === 'string') ? value : null;
    return typeof value === 'string' ? value : null;
  }

  function sanitizeScores(value, players) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
    const allowed = new Set([...players, 'Gruppe']);
    const scores = {};
    for (const [name, score] of Object.entries(value)) {
      if (!allowed.has(name) || !Number.isFinite(Number(score))) continue;
      scores[name] = Math.max(0, Math.min(10_000, Math.trunc(Number(score))));
    }
    return scores;
  }

  function validActive(value) {
    if (!value || value.version !== VERSION || value.gameId !== gameId) return null;
    if (!Number.isInteger(value.targetRounds) || ![3, 5, 10, 20].includes(value.targetRounds)) return null;
    if (!Number.isInteger(value.round) || value.round < 1 || value.round > value.targetRounds) return null;
    const players = cleanPlayers(value.players);
    if (!players.length || players.length !== value.players?.length) return null;
    const pack = String(value.pack ?? '');
    if (!C.getPackNames(gameId).includes(pack)) return null;
    const availableItems = C.getItems(gameId, pack);
    if (!availableItems.length) return null;
    const current = validCurrent(value.current);
    if (value.current !== null && current === null) return null;
    const used = [...new Set((Array.isArray(value.used) ? value.used : []).filter(index => Number.isInteger(index) && index >= 0 && index < availableItems.length))];
    return {
      version: VERSION,
      gameId,
      pack,
      targetRounds: value.targetRounds,
      round: value.round,
      score: Number.isInteger(value.score) ? Math.max(0, Math.min(10_000, value.score)) : 0,
      scores: sanitizeScores(value.scores, players),
      playerIndex: Number.isInteger(value.playerIndex) ? Math.max(0, value.playerIndex) % players.length : 0,
      used,
      current,
      phase: ['ready', 'private', 'active', 'result'].includes(value.phase) ? value.phase : 'ready',
      choice: Number.isInteger(value.choice) && value.choice >= 0 && value.choice <= 1 ? value.choice : null,
      players,
      startedAt: String(value.startedAt ?? new Date().toISOString()),
      completedRecorded: Boolean(value.completedRecorded)
    };
  }

  function loadActive() {
    try { return validActive(JSON.parse(localStorage.getItem(ACTIVE_KEY))); }
    catch { return null; }
  }

  function setStatus(message, error = false) {
    $('#quick-status').textContent = message || '';
    $('#quick-status').classList.toggle('error', error);
  }

  function saveActive() {
    try {
      if (active) localStorage.setItem(ACTIVE_KEY, JSON.stringify(active));
      else localStorage.removeItem(ACTIVE_KEY);
      return true;
    } catch {
      setStatus('Das eigene Spiel konnte nicht gespeichert werden.', true);
      return false;
    }
  }

  function saveHub(nextHub) {
    const previous = localStorage.getItem(HUB_KEY);
    try {
      localStorage.setItem(HUB_KEY, JSON.stringify(nextHub));
      hub = nextHub;
      return true;
    } catch {
      try { previous === null ? localStorage.removeItem(HUB_KEY) : localStorage.setItem(HUB_KEY, previous); }
      catch {}
      setStatus('Verlauf und Statistik konnten nicht sicher gespeichert werden.', true);
      return false;
    }
  }

  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function button(text, handler, className = '') {
    const node = element('button', className, text);
    node.type = 'button';
    node.addEventListener('click', handler);
    return node;
  }

  function clearNode(node) {
    while (node.firstChild) node.firstChild.remove();
  }

  function randomInt(maximum) {
    if (!Number.isInteger(maximum) || maximum <= 0) return 0;
    if (crypto?.getRandomValues) {
      const values = new Uint32Array(1);
      crypto.getRandomValues(values);
      return values[0] % maximum;
    }
    return Math.floor(Math.random() * maximum);
  }

  function currentPlayer() {
    return active.players[active.playerIndex % active.players.length] || 'Aktive Person';
  }

  function items() {
    return C.getItems(gameId, active.pack);
  }

  function pickUnused() {
    const availableItems = items();
    if (!availableItems.length) return null;
    if (active.used.length >= availableItems.length) active.used = [];
    const available = availableItems.map((_, index) => index).filter(index => !active.used.includes(index));
    const index = available[randomInt(available.length)];
    active.used.push(index);
    return clone(availableItems[index]);
  }

  function ensureCurrent() {
    if (active.current === null) {
      active.current = pickUnused();
      saveActive();
    }
    return active.current;
  }

  function addScore(points, player = currentPlayer()) {
    const safe = Number.isInteger(points) ? Math.max(0, points) : 0;
    active.score = Math.min(10_000, active.score + safe);
    if (player && safe) active.scores[player] = Math.min(10_000, Math.max(0, Number(active.scores[player]) || 0) + safe);
  }

  function stopTimer() {
    if (timerId !== null) clearInterval(timerId);
    timerId = null;
  }

  function countdown(seconds, node, onEnd) {
    stopTimer();
    const deadline = Date.now() + seconds * 1000;
    const tick = () => {
      const remaining = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
      node.textContent = `${Math.floor(remaining / 60)}:${String(remaining % 60).padStart(2, '0')}`;
      if (remaining <= 0) {
        stopTimer();
        navigator.vibrate?.([120, 80, 120]);
        onEnd();
      }
    };
    tick();
    timerId = setInterval(tick, 250);
  }

  function nextRound() {
    stopTimer();
    if (active.round >= active.targetRounds) return finishSession();
    active.round += 1;
    active.playerIndex = (active.playerIndex + 1) % active.players.length;
    active.current = null;
    active.phase = 'ready';
    active.choice = null;
    saveActive();
    renderRound();
  }

  function resetRoundUi() {
    stopTimer();
    clearNode($('#quick-content'));
    clearNode($('#quick-controls'));
    clearNode($('#quick-actions'));
    $('#quick-private-note').hidden = true;
    $('#quick-eyebrow').textContent = active.pack;
    $('#quick-round-title').textContent = game.title;
    $('#quick-player').textContent = currentPlayer();
    $('#quick-progress').textContent = `Runde ${active.round} von ${active.targetRounds}`;
    $('#quick-score').textContent = `${active.score} Punkte`;
    $('#quick-progress-bar').style.width = `${Math.round(((active.round - 1) / active.targetRounds) * 100)}%`;
  }

  function renderRound() {
    if (!active) return;
    resetRoundUi();
    if (game.templateId === 'choice') return renderChoice();
    if (game.templateId === 'guess') return renderGuess();
    if (game.templateId === 'challenge') return renderChallenge();
    if (game.templateId === 'debate') return renderDebate();
    if (game.templateId === 'story') return renderStory();
    return renderPrompt();
  }

  function renderPrompt() {
    const card = ensureCurrent();
    $('#quick-player').textContent = `${currentPlayer()} beginnt`;
    $('#quick-content').append(element('div', 'challenge-card', card || 'Keine Karte verfügbar.'));
    $('#quick-actions').append(button('Nächste Karte', nextRound));
  }

  function renderChallenge() {
    const card = ensureCurrent();
    $('#quick-player').textContent = `${currentPlayer()} erhält die Aufgabe`;
    $('#quick-content').append(element('div', 'challenge-card', card || 'Keine Aufgabe verfügbar.'));
    $('#quick-actions').append(
      button('Geschafft · 1 Punkt', () => { addScore(1); nextRound(); }),
      button('Überspringen', nextRound, 'secondary')
    );
  }

  function renderStory() {
    const card = ensureCurrent();
    $('#quick-player').textContent = 'Alle ergänzen die Geschichte';
    $('#quick-content').append(element('div', 'challenge-card', card || 'Keine Geschichte verfügbar.'), element('p', 'muted', 'Reihum ergänzt jede Person genau einen Satz.'));
    $('#quick-actions').append(button('Geschichte beendet · 1 Punkt', () => { addScore(1, 'Gruppe'); nextRound(); }), button('Nächste Story', nextRound, 'secondary'));
  }

  function renderDebate() {
    const card = ensureCurrent();
    $('#quick-player').textContent = `${currentPlayer()} vertritt die These`;
    $('#quick-content').append(element('div', 'challenge-card', card || 'Keine These verfügbar.'));
    if (active.phase === 'ready') {
      $('#quick-actions').append(button('30 Sekunden starten', () => { active.phase = 'active'; saveActive(); renderRound(); }));
      return;
    }
    if (active.phase === 'active') {
      const timer = element('div', 'quick-timer', '0:30');
      $('#quick-controls').append(timer);
      const vote = () => { stopTimer(); active.phase = 'result'; saveActive(); renderRound(); };
      $('#quick-actions').append(button('Argument beendet', vote, 'secondary'));
      countdown(30, timer, vote);
      return;
    }
    $('#quick-player').textContent = 'Die Gruppe entscheidet';
    $('#quick-actions').append(
      button('Überzeugt · 1 Punkt', () => { addScore(1); nextRound(); }),
      button('Nicht überzeugt', nextRound, 'secondary')
    );
  }

  function renderChoice() {
    const pair = ensureCurrent();
    $('#quick-player').textContent = 'Alle entscheiden';
    const grid = element('div', 'choice-grid');
    pair.forEach((option, index) => {
      const choice = button(option, () => {
        active.choice = index;
        active.phase = 'result';
        saveActive();
        renderRound();
      }, 'choice-card');
      grid.append(choice);
    });
    $('#quick-content').append(grid);
    if (active.phase === 'result' && active.choice !== null) {
      grid.querySelectorAll('button').forEach((node, index) => {
        node.disabled = true;
        node.classList.toggle('selected', index === active.choice);
      });
      $('#quick-content').append(element('p', 'choice-result', `Gewählt: ${pair[active.choice]}`));
      $('#quick-actions').append(button('Nächste Entscheidung', nextRound));
    }
  }

  function renderGuess() {
    const card = ensureCurrent();
    $('#quick-player').textContent = `${currentPlayer()} stellt den Begriff dar`;
    if (active.phase === 'ready') {
      $('#quick-content').append(element('p', '', 'Nur die aktive Person schaut auf das Gerät.'));
      $('#quick-actions').append(button('Begriff anzeigen', () => { active.phase = 'private'; saveActive(); renderRound(); }));
      return;
    }
    if (active.phase === 'private') {
      $('#quick-private-note').hidden = false;
      $('#quick-private-note').textContent = 'Nur die aktive Person darf den Begriff sehen.';
      $('#quick-content').append(element('div', 'challenge-card', card || 'Kein Begriff verfügbar.'));
      $('#quick-actions').append(button('Verbergen und 60 Sekunden starten', () => { active.phase = 'active'; saveActive(); renderRound(); }));
      return;
    }
    if (active.phase === 'active') {
      $('#quick-content').append(element('div', 'challenge-card', 'Begriff darstellen oder erklären'), element('p', 'muted', 'Der Begriff darf nicht direkt genannt oder buchstabiert werden.'));
      const timer = element('div', 'quick-timer', '1:00');
      $('#quick-controls').append(timer);
      const finish = success => {
        stopTimer();
        if (success) addScore(1);
        active.phase = 'result';
        active.choice = success ? 1 : 0;
        saveActive();
        renderRound();
      };
      $('#quick-actions').append(button('Erraten · 1 Punkt', () => finish(true)), button('Überspringen', () => finish(false), 'secondary'));
      countdown(60, timer, () => finish(false));
      return;
    }
    $('#quick-content').append(element('div', 'challenge-card', card || 'Kein Begriff verfügbar.'), element('p', active.choice === 1 ? 'success-text' : 'muted', active.choice === 1 ? 'Erraten – 1 Punkt.' : 'Übersprungen.'));
    $('#quick-actions').append(button('Nächster Begriff', nextRound));
  }

  function startSession() {
    hub = loadHub();
    if (hub.players.length < game.minPlayers || hub.players.length > game.maxPlayers) {
      setStatus(`${game.title} benötigt ${game.minPlayers}–${game.maxPlayers} Personen. Passe die Gruppe im Party Hub an.`, true);
      return;
    }
    const pack = $('#quick-pack').value || C.getPackNames(gameId)[0];
    const targetRounds = Number($('#quick-rounds').value);
    if (!C.getPackNames(gameId).includes(pack) || ![3, 5, 10, 20].includes(targetRounds)) {
      setStatus('Kategorie oder Rundenzahl ist ungültig.', true);
      return;
    }
    active = {
      version: VERSION,
      gameId,
      pack,
      targetRounds,
      round: 1,
      score: 0,
      scores: {},
      playerIndex: 0,
      used: [],
      current: null,
      phase: 'ready',
      choice: null,
      players: clone(hub.players),
      startedAt: new Date().toISOString(),
      completedRecorded: false
    };
    if (!saveActive()) return;
    $('#quick-setup').hidden = true;
    $('#quick-result').hidden = true;
    $('#quick-play').hidden = false;
    renderRound();
    $('#quick-exit').focus();
  }

  function finishSession() {
    stopTimer();
    if (!active) return;
    if (!active.completedRecorded) {
      const entry = {
        id: `created-${Date.now()}-${randomInt(1_000_000)}`,
        gameId,
        title: game.title,
        endedAt: new Date().toISOString(),
        rounds: active.targetRounds,
        score: active.score
      };
      const nextHub = clone(loadHub());
      nextHub.history = [entry, ...(Array.isArray(nextHub.history) ? nextHub.history : [])].slice(0, MAX_HISTORY);
      nextHub.recent = [gameId, ...(Array.isArray(nextHub.recent) ? nextHub.recent.filter(id => id !== gameId) : [])].slice(0, 8);
      nextHub.stats = nextHub.stats || {};
      const stats = nextHub.stats[gameId] || { plays: 0, rounds: 0, best: 0 };
      nextHub.stats[gameId] = {
        plays: Math.max(0, Number(stats.plays) || 0) + 1,
        rounds: Math.max(0, Number(stats.rounds) || 0) + active.targetRounds,
        best: Math.max(Number(stats.best) || 0, active.score)
      };
      if (!saveHub(nextHub)) return;
      active.completedRecorded = true;
      saveActive();
    }
    const final = clone(active);
    active = null;
    saveActive();
    $('#quick-play').hidden = true;
    $('#quick-result').hidden = false;
    $('#quick-final-score').textContent = String(final.score);
    const ranking = Object.entries(final.scores).sort((left, right) => right[1] - left[1]);
    $('#quick-result-text').textContent = ranking.length
      ? `Rangliste: ${ranking.map(([name, score]) => `${name} ${score}`).join(' · ')}`
      : `${final.targetRounds} eigene Runden wurden lokal gespeichert.`;
    $('#quick-progress-bar').style.width = '100%';
    $('#quick-replay').focus();
  }

  function discardActive() {
    active = null;
    saveActive();
    updateResume();
    setStatus('Gespeicherte Creator-Session wurde verworfen.');
  }

  function updateResume() {
    $('#quick-resume-box').hidden = !active;
    if (active) $('#quick-resume-text').textContent = `${game.title} · Runde ${active.round} von ${active.targetRounds}`;
  }

  function resumeSession() {
    if (!active) return;
    $('#quick-setup').hidden = true;
    $('#quick-result').hidden = true;
    $('#quick-play').hidden = false;
    renderRound();
    $('#quick-exit').focus();
  }

  function initialize() {
    document.title = `Secret Circle – ${game.title}`;
    $('#quick-icon').textContent = game.icon;
    $('#quick-group').textContent = `${game.group} · eigenes Spiel`;
    $('#quick-title').textContent = game.title;
    $('#quick-description').textContent = game.description;
    $('#quick-player-range').textContent = `${game.minPlayers}–${game.maxPlayers} Personen`;
    $('#quick-duration').textContent = `ca. ${game.duration} Minuten`;
    $('#quick-content-count').textContent = `${C.itemCount(gameId)} Karten`;
    C.getPackNames(gameId).forEach(name => $('#quick-pack').add(new Option(`${name} (${C.getItems(gameId, name).length})`, name)));
    game.instructions.forEach(rule => $('#quick-rules').append(element('li', '', rule)));
    updateResume();

    $('#quick-start').addEventListener('click', startSession);
    $('#quick-resume').addEventListener('click', resumeSession);
    $('#quick-discard').addEventListener('click', discardActive);
    $('#quick-exit').addEventListener('click', () => {
      if (!confirm('Session beenden und bisherigen Fortschritt verwerfen?')) return;
      discardActive();
      $('#quick-play').hidden = true;
      $('#quick-setup').hidden = false;
    });
    $('#quick-replay').addEventListener('click', () => {
      $('#quick-result').hidden = true;
      $('#quick-setup').hidden = false;
      startSession();
    });

    const updateConnection = () => { $('#quick-connection').textContent = navigator.onLine ? 'Online' : 'Offline-Modus'; };
    addEventListener('online', updateConnection);
    addEventListener('offline', updateConnection);
    updateConnection();
    if ('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js').catch(() => setStatus('Offline-Modus konnte nicht aktiviert werden.', true));
  }

  addEventListener('pagehide', () => { stopTimer(); if (active) saveActive(); });
  initialize();
})();
