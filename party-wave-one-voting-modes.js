'use strict';

(() => {
  const C = window.SecretCirclePartyCatalog;
  const L = window.SecretCircleSessionLedger;
  const S = window.SecretCircleSessionControls;
  if (!C || !L || !S) throw new Error('Gemeinsame Runtime für Wave-1-Schätz-/Voting-Spiele fehlt.');

  const HUB_KEY = 'secret-circle-party-hub-v1';
  const ACTIVE_KEY = 'secret-circle-party-quick-active-v1';
  const VERSION = 1;
  const MAX_HISTORY = L.maximumHistory;
  const ALLOWED = new Set(C.waveOneVotingGameIds || []);
  const $ = selector => document.querySelector(selector);
  const gameId = new URLSearchParams(location.search).get('game') || '';
  const game = C.getGame(gameId);

  let hub = loadHub();
  let active = loadActive();

  const sessionControls = S.createController({
    documentRef: document,
    windowRef: window,
    catalog: C,
    gameId,
    onSkip: () => { if (active) nextRound(); },
    onAbort: abortSession,
    onReplay: replaySession
  });

  const clone = value => JSON.parse(JSON.stringify(value));
  const clean = (value, maximum = 160) => String(value ?? '').normalize('NFKC').trim().replace(/\s+/g, ' ').slice(0, maximum);

  function cleanPlayers(value) {
    const result = [];
    const seen = new Set();
    for (const raw of Array.isArray(value) ? value : []) {
      const name = clean(raw, 32);
      const key = name.toLocaleLowerCase('de-DE');
      if (!name || seen.has(key)) continue;
      seen.add(key);
      result.push(name);
      if (result.length >= 20) break;
    }
    return result;
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

  function pointsForEstimate(guess, answer) {
    const difference = Math.abs(guess - answer);
    if (difference <= 5) return 3;
    if (difference <= 10) return 2;
    if (difference <= 20) return 1;
    return 0;
  }

  function deriveBracket(entries, picks) {
    if (!Array.isArray(entries) || entries.length !== 8 || !entries.every(item => typeof item === 'string' && item.trim())) return null;
    if (!Array.isArray(picks) || picks.length > 7 || !picks.every(pick => pick === 0 || pick === 1)) return null;
    let current = [...entries];
    let decisionIndex = 0;
    while (current.length > 1) {
      const next = [];
      for (let index = 0; index < current.length; index += 2) {
        const pair = [current[index], current[index + 1]];
        if (decisionIndex >= picks.length) {
          return { complete: false, pair, decisionIndex, stageSize: current.length };
        }
        next.push(pair[picks[decisionIndex]]);
        decisionIndex += 1;
      }
      current = next;
    }
    if (decisionIndex !== picks.length) return null;
    return { complete: true, winner: current[0], decisionIndex, stageSize: 1 };
  }

  function normalizeUsed(value, itemCount) {
    if (!Array.isArray(value)) return null;
    const used = value.map(Number);
    if (!used.every(Number.isInteger) || used.some(index => index < 0 || index >= itemCount)) return null;
    if (new Set(used).size !== used.length) return null;
    return used;
  }

  function normalizeCurrent(value, pack, phase, used) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
    const items = C.getItems(gameId, pack);
    const cardIndex = Number(value.cardIndex);
    if (!Number.isInteger(cardIndex) || cardIndex < 0 || cardIndex >= items.length || !used.includes(cardIndex)) return null;

    if (gameId === 'percent-guess') {
      const item = items[cardIndex];
      if (!item || typeof item.question !== 'string' || !Number.isInteger(item.answer) || item.answer < 0 || item.answer > 100) return null;
      const guess = value.guess === null ? null : Number(value.guess);
      if (guess !== null && (!Number.isInteger(guess) || guess < 0 || guess > 100)) return null;
      const expectedPoints = guess === null ? 0 : pointsForEstimate(guess, item.answer);
      const points = Number(value.points);
      const scored = Boolean(value.scored);
      if (phase === 'ready' && (guess !== null || points !== 0 || scored)) return null;
      if (phase === 'result' && (guess === null || points !== expectedPoints || !scored)) return null;
      return { cardIndex, guess, points, scored };
    }

    if (gameId === 'party-bracket') {
      const item = items[cardIndex];
      if (!item || !Array.isArray(item.entries) || item.entries.length !== 8) return null;
      const picks = Array.isArray(value.picks) ? value.picks.map(Number) : null;
      const state = deriveBracket(item.entries, picks);
      if (!state) return null;
      const scored = Boolean(value.scored);
      if (phase === 'vote' && (state.complete || scored)) return null;
      if (phase === 'result' && (!state.complete || !scored)) return null;
      return { cardIndex, picks, scored };
    }
    return null;
  }

  function validActive(value) {
    if (!value || value.version !== VERSION || value.gameId !== gameId) return null;
    if (![3, 5, 10, 20].includes(value.targetRounds)) return null;
    if (!Number.isInteger(value.round) || value.round < 1 || value.round > value.targetRounds) return null;
    const players = cleanPlayers(value.players);
    if (!Array.isArray(value.players) || players.length !== value.players.length || players.length < game.minPlayers || players.length > game.maxPlayers) return null;
    const pack = clean(value.pack, 60);
    const items = C.getItems(gameId, pack);
    if (!C.getPackNames(gameId).includes(pack) || !items.length) return null;
    const used = normalizeUsed(value.used, items.length);
    if (!used) return null;
    const allowedPhases = gameId === 'percent-guess' ? ['ready', 'result'] : ['vote', 'result'];
    const phase = String(value.phase || allowedPhases[0]);
    if (!allowedPhases.includes(phase)) return null;
    const current = normalizeCurrent(value.current, pack, phase, used);
    if (!current) return null;
    const playerIndex = Number(value.playerIndex);
    if (!Number.isInteger(playerIndex) || playerIndex < 0 || playerIndex >= players.length) return null;
    const startedAt = String(value.startedAt || new Date().toISOString());
    return {
      version: VERSION,
      gameId,
      sessionId: L.normalizeSessionId(value.sessionId) || L.legacySessionId(gameId, startedAt, value.targetRounds),
      pack,
      targetRounds: value.targetRounds,
      round: value.round,
      totalScore: Number.isInteger(value.totalScore) ? Math.max(0, value.totalScore) : 0,
      scores: value.scores && typeof value.scores === 'object' && !Array.isArray(value.scores) ? value.scores : {},
      playerIndex,
      used,
      current,
      phase,
      players,
      startedAt,
      completedRecorded: Boolean(value.completedRecorded)
    };
  }

  function loadActive() {
    try { return validActive(JSON.parse(localStorage.getItem(ACTIVE_KEY))); }
    catch { return null; }
  }

  function saveActive() {
    try {
      if (active) localStorage.setItem(ACTIVE_KEY, JSON.stringify(active));
      else localStorage.removeItem(ACTIVE_KEY);
      return true;
    } catch {
      setStatus('Die aktive Schätz-/Voting-Session konnte nicht gespeichert werden.', true);
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
      try {
        if (previous === null) localStorage.removeItem(HUB_KEY);
        else localStorage.setItem(HUB_KEY, previous);
      } catch {}
      setStatus('Der Verlauf konnte nicht sicher gespeichert werden.', true);
      return false;
    }
  }

  function setStatus(message, error = false) {
    const node = $('#quick-status');
    if (!node) return;
    node.textContent = message || '';
    node.classList.toggle('error', error);
  }
  function clearNode(node) { while (node?.firstChild) node.firstChild.remove(); }
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
  function randomInt(maximum) {
    if (!Number.isInteger(maximum) || maximum <= 0) return 0;
    if (crypto?.getRandomValues) {
      const values = new Uint32Array(1);
      crypto.getRandomValues(values);
      return values[0] % maximum;
    }
    return Math.floor(Math.random() * maximum);
  }

  function pickCardIndex(items) {
    if (!items.length) return null;
    if (active.used.length >= items.length) active.used = [];
    const available = items.map((_, index) => index).filter(index => !active.used.includes(index));
    const cardIndex = available[randomInt(available.length)];
    active.used.push(cardIndex);
    return cardIndex;
  }

  function createRound() {
    const items = C.getItems(gameId, active.pack);
    const cardIndex = pickCardIndex(items);
    if (!Number.isInteger(cardIndex)) return null;
    if (gameId === 'percent-guess') return { cardIndex, guess: null, points: 0, scored: false };
    return { cardIndex, picks: [], scored: false };
  }

  function currentPlayer() { return active.players[active.playerIndex % active.players.length] || 'Aktive Person'; }
  function currentItem() { return C.getItems(gameId, active.pack)[active.current.cardIndex] || null; }

  function resetRoundUi() {
    clearNode($('#quick-content')); clearNode($('#quick-controls')); clearNode($('#quick-actions'));
    $('#quick-private-note').hidden = true;
    $('#quick-eyebrow').textContent = active.pack;
    $('#quick-round-title').textContent = game.title;
    $('#quick-progress').textContent = `Runde ${active.round} von ${active.targetRounds}`;
    $('#quick-score').textContent = `${active.totalScore} Punkte`;
    $('#quick-progress-bar').style.width = `${Math.round(((active.round - 1) / active.targetRounds) * 100)}%`;
  }

  function submitEstimate() {
    if (!active || gameId !== 'percent-guess' || active.phase !== 'ready' || active.current.scored) return;
    const raw = Number($('#quick-estimate-input')?.value);
    if (!Number.isInteger(raw) || raw < 0 || raw > 100) {
      setStatus('Gib eine ganze Zahl zwischen 0 und 100 ein.', true);
      return;
    }
    const item = currentItem();
    const points = pointsForEstimate(raw, item.answer);
    active.current.guess = raw;
    active.current.points = points;
    active.current.scored = true;
    active.totalScore += points;
    if (points) active.scores[currentPlayer()] = (Number(active.scores[currentPlayer()]) || 0) + points;
    active.phase = 'result';
    if (!saveActive()) return;
    setStatus('');
    renderRound();
  }

  function renderEstimate() {
    const item = currentItem();
    $('#quick-player').textContent = `${currentPlayer()} schätzt`;
    $('#quick-content').append(element('div', 'challenge-card', item.question));
    if (active.phase === 'ready') {
      const input = document.createElement('input');
      input.id = 'quick-estimate-input'; input.type = 'number'; input.min = '0'; input.max = '100'; input.step = '1';
      input.inputMode = 'numeric'; input.setAttribute('aria-label', 'Schätzung in Prozent'); input.placeholder = '0–100';
      $('#quick-controls').append(input);
      $('#quick-actions').append(button('Schätzung prüfen', submitEstimate));
      return;
    }
    const difference = Math.abs(active.current.guess - item.answer);
    $('#quick-content').append(
      element('p', active.current.points ? 'success-text' : 'muted', `Deine Schätzung: ${active.current.guess} % · Zielwert: ${item.answer} %`),
      element('p', '', `Abweichung: ${difference} Prozentpunkte · +${active.current.points} Punkte`),
      element('p', 'muted', item.explanation)
    );
    $('#quick-actions').append(button(active.round >= active.targetRounds ? 'Session abschließen' : 'Nächste Schätzung', nextRound));
  }

  function chooseBracket(pick) {
    if (!active || gameId !== 'party-bracket' || active.phase !== 'vote' || (pick !== 0 && pick !== 1)) return;
    const item = currentItem();
    const before = deriveBracket(item.entries, active.current.picks);
    if (!before || before.complete) return;
    active.current.picks.push(pick);
    const after = deriveBracket(item.entries, active.current.picks);
    if (!after) return;
    if (after.complete) {
      active.current.scored = true;
      active.totalScore += 1;
      active.scores.Gruppe = (Number(active.scores.Gruppe) || 0) + 1;
      active.phase = 'result';
    }
    if (!saveActive()) return;
    renderRound();
  }

  function renderBracket() {
    const item = currentItem();
    const state = deriveBracket(item.entries, active.current.picks);
    $('#quick-player').textContent = 'Die Gruppe entscheidet';
    $('#quick-content').append(element('div', 'challenge-card', item.title));
    if (active.phase === 'vote') {
      $('#quick-content').append(element('p', 'muted', `Duell ${state.decisionIndex + 1} von 7 · ${state.stageSize === 8 ? 'Viertelfinale' : state.stageSize === 4 ? 'Halbfinale' : 'Finale'}`));
      $('#quick-actions').append(
        button(state.pair[0], () => chooseBracket(0)),
        button(state.pair[1], () => chooseBracket(1), 'secondary')
      );
      return;
    }
    $('#quick-content').append(element('p', 'success-text', `Bracket-Sieger: ${state.winner}`));
    $('#quick-actions').append(button(active.round >= active.targetRounds ? 'Session abschließen' : 'Nächstes Bracket', nextRound));
  }

  function renderRound() {
    if (!active) return;
    resetRoundUi();
    if (gameId === 'percent-guess') return renderEstimate();
    if (gameId === 'party-bracket') return renderBracket();
  }

  function startSession() {
    if (!game || !ALLOWED.has(game.id)) return;
    hub = loadHub();
    if (hub.players.length < game.minPlayers || hub.players.length > game.maxPlayers) {
      setStatus(`${game.title} benötigt ${game.minPlayers}–${game.maxPlayers} Personen. Passe die Gruppe im Party Hub an.`, true);
      return;
    }
    const pack = $('#quick-pack').value || C.getPackNames(game.id)[0];
    const targetRounds = Number($('#quick-rounds').value);
    if (!C.getPackNames(game.id).includes(pack) || ![3, 5, 10, 20].includes(targetRounds)) {
      setStatus('Kategorie oder Rundenzahl ist ungültig.', true); return;
    }
    active = {
      version: VERSION, gameId: game.id, sessionId: L.createSessionId(game.id), pack, targetRounds,
      round: 1, totalScore: 0, scores: {}, playerIndex: 0, used: [], current: null,
      phase: gameId === 'percent-guess' ? 'ready' : 'vote', players: clone(hub.players),
      startedAt: new Date().toISOString(), completedRecorded: false
    };
    active.current = createRound();
    if (!active.current || !saveActive()) return;
    sessionControls.setSessionActive(true);
    $('#quick-setup').hidden = true; $('#quick-result').hidden = true; $('#quick-play').hidden = false;
    renderRound();
  }

  function nextRound() {
    if (!active) return;
    if (active.round >= active.targetRounds) return finishSession();
    active.round += 1;
    active.playerIndex = (active.playerIndex + 1) % active.players.length;
    active.phase = gameId === 'percent-guess' ? 'ready' : 'vote';
    active.current = createRound();
    if (!active.current || !saveActive()) return;
    renderRound();
  }

  function finishSession() {
    if (!active) return;
    if (!active.completedRecorded) {
      const result = L.recordCompletion(loadHub(), {
        id: L.completionId('wave1-voting', game.id, active.sessionId), gameId: game.id, title: game.title,
        endedAt: new Date().toISOString(), rounds: active.targetRounds, score: active.totalScore
      });
      if (result.recorded && !saveHub(result.hub)) return;
      active.completedRecorded = true;
      if (!saveActive()) return;
    }
    const final = clone(active); active = null;
    if (!saveActive()) { active = final; return; }
    sessionControls.setSessionActive(false); sessionControls.updateNextGame(C, game.id);
    $('#quick-play').hidden = true; $('#quick-result').hidden = false;
    $('#quick-final-score').textContent = String(final.totalScore);
    const ranking = Object.entries(final.scores).sort((a, b) => b[1] - a[1]);
    $('#quick-result-text').textContent = ranking.length ? `Rangliste: ${ranking.map(([name, score]) => `${name} ${score}`).join(' · ')}` : `${final.targetRounds} Runden wurden lokal gespeichert.`;
    $('#quick-progress-bar').style.width = '100%'; $('#quick-replay').focus();
  }

  function discardActive() {
    if (!active) { sessionControls.setSessionActive(false); updateResume(); return true; }
    const previous = clone(active); active = null;
    if (!saveActive()) { active = previous; return false; }
    sessionControls.setSessionActive(false); updateResume(); setStatus('Gespeicherte Schätz-/Voting-Session wurde verworfen.'); return true;
  }

  function abortSession() {
    if (!active || !discardActive()) return false;
    $('#quick-play').hidden = true; $('#quick-result').hidden = true; $('#quick-setup').hidden = false; $('#quick-start').focus(); return true;
  }
  function replaySession() { $('#quick-result').hidden = true; $('#quick-setup').hidden = false; startSession(); }
  function updateResume() {
    const box = $('#quick-resume-box'); box.hidden = !active;
    if (active) $('#quick-resume-text').textContent = `${game.title} · Runde ${active.round} von ${active.targetRounds}`;
  }
  function resumeSession() {
    if (!active) return;
    sessionControls.setSessionActive(true); $('#quick-setup').hidden = true; $('#quick-result').hidden = true; $('#quick-play').hidden = false;
    renderRound(); $('#quick-pause').focus();
  }

  function initialize() {
    if (!game || !ALLOWED.has(game.id) || game.status !== 'playable') {
      $('#quick-setup').innerHTML = '<h1>Spiel nicht verfügbar</h1><p>Dieser Schätz-/Voting-Modus ist noch nicht freigeschaltet.</p><a class="ghost-button" href="party.html">Zum Party Hub</a>'; return;
    }
    document.title = `Secret Circle – ${game.title}`;
    $('#quick-icon').textContent = game.icon; $('#quick-group').textContent = `${game.group} · Labs`; $('#quick-title').textContent = game.title;
    $('#quick-description').textContent = game.description; $('#quick-player-range').textContent = `${game.minPlayers}–${game.maxPlayers} Personen`;
    $('#quick-duration').textContent = `ca. ${game.duration} Minuten`; $('#quick-content-count').textContent = `${C.itemCount(game.id)} Karten`;
    C.getPackNames(game.id).forEach(name => $('#quick-pack').add(new Option(`${name} (${C.getItems(game.id, name).length})`, name)));
    game.instructions.forEach(rule => $('#quick-rules').append(element('li', '', rule)));
    updateResume(); sessionControls.updateNextGame(C, game.id);
    $('#quick-start').addEventListener('click', startSession); $('#quick-resume').addEventListener('click', resumeSession); $('#quick-discard').addEventListener('click', discardActive);
    const updateConnection = () => { $('#quick-connection').textContent = navigator.onLine ? 'Online' : 'Offline-Modus'; };
    addEventListener('online', updateConnection); addEventListener('offline', updateConnection); updateConnection();
    if ('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js').catch(() => setStatus('Offline-Modus konnte nicht aktiviert werden.', true));
  }

  initialize();
})();
