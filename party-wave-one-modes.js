'use strict';

(() => {
  const C = window.SecretCirclePartyCatalog;
  const L = window.SecretCircleSessionLedger;
  const S = window.SecretCircleSessionControls;
  if (!C) throw new Error('Party-Katalog für Expansion Wave 1 fehlt.');
  if (!L) throw new Error('Gemeinsames Session-Register für Expansion Wave 1 fehlt.');
  if (!S) throw new Error('Gemeinsame Spielsteuerung für Expansion Wave 1 fehlt.');

  const HUB_KEY = 'secret-circle-party-hub-v1';
  const ACTIVE_KEY = 'secret-circle-party-quick-active-v1';
  const VERSION = 1;
  const MAX_HISTORY = L.maximumHistory;
  const ALLOWED = new Set(C.waveOneGameIds || []);
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

  function clone(value) { return JSON.parse(JSON.stringify(value)); }

  function cleanPlayers(value) {
    const result = [];
    const seen = new Set();
    for (const raw of Array.isArray(value) ? value : []) {
      const name = String(raw ?? '').normalize('NFKC').trim().replace(/\s+/g, ' ').slice(0, 32);
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

  function validCurrent(value) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
    if (gameId === 'party-quiz') {
      if (typeof value.question !== 'string' || !Array.isArray(value.options) || value.options.length !== 4) return null;
      if (!value.options.every(option => typeof option === 'string' && option.trim())) return null;
      if (!Number.isInteger(value.answer) || value.answer < 0 || value.answer > 3) return null;
      const selected = value.selected === null ? null : Number(value.selected);
      if (selected !== null && (!Number.isInteger(selected) || selected < 0 || selected > 3)) return null;
      return { question: value.question.slice(0, 240), options: value.options.map(option => option.slice(0, 120)), answer: value.answer, explanation: String(value.explanation ?? '').slice(0, 300), selected };
    }
    if (gameId === 'fact-or-fake') {
      if (typeof value.statement !== 'string' || typeof value.fact !== 'boolean') return null;
      const selected = value.selected === null ? null : value.selected;
      if (selected !== null && typeof selected !== 'boolean') return null;
      return { statement: value.statement.slice(0, 260), fact: value.fact, explanation: String(value.explanation ?? '').slice(0, 300), selected };
    }
    return null;
  }

  function validActive(value) {
    if (!value || value.version !== VERSION || value.gameId !== gameId) return null;
    if (![3, 5, 10, 20].includes(value.targetRounds)) return null;
    if (!Number.isInteger(value.round) || value.round < 1 || value.round > value.targetRounds) return null;
    const players = cleanPlayers(value.players);
    if (!players.length || players.length !== value.players.length) return null;
    const phase = String(value.phase ?? 'ready');
    if (!['ready', 'result'].includes(phase)) return null;
    const current = value.current === null ? null : validCurrent(value.current);
    if (value.current && !current) return null;
    if (phase === 'result' && (!current || current.selected === null)) return null;
    const startedAt = String(value.startedAt ?? new Date().toISOString());
    return {
      version: VERSION,
      gameId,
      sessionId: L.normalizeSessionId(value.sessionId) || L.legacySessionId(gameId, startedAt, value.targetRounds),
      pack: String(value.pack ?? ''),
      targetRounds: value.targetRounds,
      round: value.round,
      totalScore: Number.isInteger(value.totalScore) ? Math.max(0, value.totalScore) : 0,
      scores: value.scores && typeof value.scores === 'object' && !Array.isArray(value.scores) ? value.scores : {},
      playerIndex: Number.isInteger(value.playerIndex) ? Math.max(0, value.playerIndex) : 0,
      used: Array.isArray(value.used) ? value.used.filter(Number.isInteger) : [],
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
      setStatus('Die aktive Session konnte nicht gespeichert werden.', true);
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

  function pickUnused(items) {
    if (!items.length) return null;
    if (active.used.length >= items.length) active.used = [];
    const available = items.map((_, index) => index).filter(index => !active.used.includes(index));
    const index = available[randomInt(available.length)];
    active.used.push(index);
    saveActive();
    return clone(items[index]);
  }

  function currentPlayer() { return active.players[active.playerIndex % active.players.length] || 'Aktive Person'; }
  function addScore(points) {
    const safe = Number.isInteger(points) ? Math.max(0, points) : 0;
    active.totalScore += safe;
    if (safe) active.scores[currentPlayer()] = Math.max(0, Number(active.scores[currentPlayer()]) || 0) + safe;
  }

  function nextRound() {
    if (active.round >= active.targetRounds) return finishSession();
    active.round += 1;
    active.playerIndex = (active.playerIndex + 1) % active.players.length;
    active.current = null;
    active.phase = 'ready';
    if (!saveActive()) return;
    renderRound();
  }

  function ensureCurrent() {
    if (!active.current) {
      active.current = pickUnused(C.getItems(gameId, active.pack));
      if (!active.current) return null;
      active.current.selected = null;
      saveActive();
    }
    return active.current;
  }

  function resetRoundUi() {
    clearNode($('#quick-content'));
    clearNode($('#quick-controls'));
    clearNode($('#quick-actions'));
    $('#quick-private-note').hidden = true;
    $('#quick-eyebrow').textContent = active.pack;
    $('#quick-round-title').textContent = game.title;
    $('#quick-player').textContent = `${currentPlayer()} antwortet`;
    $('#quick-progress').textContent = `Runde ${active.round} von ${active.targetRounds}`;
    $('#quick-score').textContent = `${active.totalScore} Punkte`;
    $('#quick-progress-bar').style.width = `${Math.round(((active.round - 1) / active.targetRounds) * 100)}%`;
  }

  function chooseQuiz(index) {
    if (!active || active.phase !== 'ready' || !active.current || active.current.selected !== null) return;
    active.current.selected = index;
    if (index === active.current.answer) addScore(1);
    active.phase = 'result';
    if (!saveActive()) return;
    renderRound();
  }

  function chooseFact(value) {
    if (!active || active.phase !== 'ready' || !active.current || active.current.selected !== null) return;
    active.current.selected = Boolean(value);
    if (active.current.selected === active.current.fact) addScore(1);
    active.phase = 'result';
    if (!saveActive()) return;
    renderRound();
  }

  function renderPartyQuiz(current) {
    $('#quick-content').append(element('div', 'challenge-card', current.question));
    if (active.phase === 'ready') {
      current.options.forEach((option, index) => $('#quick-actions').append(button(option, () => chooseQuiz(index), index === 0 ? '' : 'secondary')));
      return;
    }
    const correct = current.selected === current.answer;
    $('#quick-content').append(
      element('p', correct ? 'success-text' : 'error', correct ? 'Richtig – 1 Punkt.' : `Nicht ganz. Richtig ist: ${current.options[current.answer]}`),
      element('p', 'muted', current.explanation)
    );
    $('#quick-actions').append(button('Nächste Frage', nextRound));
  }

  function renderFactOrFake(current) {
    $('#quick-content').append(element('div', 'challenge-card', current.statement));
    if (active.phase === 'ready') {
      $('#quick-actions').append(button('Fakt', () => chooseFact(true)), button('Fake', () => chooseFact(false), 'secondary'));
      return;
    }
    const correct = current.selected === current.fact;
    $('#quick-content').append(
      element('p', correct ? 'success-text' : 'error', correct ? 'Richtig – 1 Punkt.' : `Nicht ganz. Die Aussage ist ${current.fact ? 'Fakt' : 'Fake'}.`),
      element('p', 'muted', current.explanation)
    );
    $('#quick-actions').append(button('Nächste Aussage', nextRound));
  }

  function renderRound() {
    if (!active) return;
    resetRoundUi();
    const current = ensureCurrent();
    if (!current) {
      setStatus('Für diese Kategorie sind keine gültigen Karten verfügbar.', true);
      return;
    }
    if (gameId === 'party-quiz') return renderPartyQuiz(current);
    if (gameId === 'fact-or-fake') return renderFactOrFake(current);
    setStatus('Dieser Wave-1-Modus ist noch nicht implementiert.', true);
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
      setStatus('Kategorie oder Rundenzahl ist ungültig.', true);
      return;
    }
    active = {
      version: VERSION,
      gameId: game.id,
      sessionId: L.createSessionId(game.id),
      pack,
      targetRounds,
      round: 1,
      totalScore: 0,
      scores: {},
      playerIndex: 0,
      used: [],
      current: null,
      phase: 'ready',
      players: clone(hub.players),
      startedAt: new Date().toISOString(),
      completedRecorded: false
    };
    if (!saveActive()) return;
    sessionControls.setSessionActive(true);
    $('#quick-setup').hidden = true;
    $('#quick-result').hidden = true;
    $('#quick-play').hidden = false;
    renderRound();
    $('#quick-pause').focus();
  }

  function finishSession() {
    if (!active) return;
    if (!active.completedRecorded) {
      const result = L.recordCompletion(loadHub(), {
        id: L.completionId('wave1', game.id, active.sessionId),
        gameId: game.id,
        title: game.title,
        endedAt: new Date().toISOString(),
        rounds: active.targetRounds,
        score: active.totalScore
      });
      if (result.recorded && !saveHub(result.hub)) return;
      active.completedRecorded = true;
      if (!saveActive()) return;
    }
    const final = clone(active);
    active = null;
    if (!saveActive()) { active = final; return; }
    sessionControls.setSessionActive(false);
    sessionControls.updateNextGame(C, game.id);
    $('#quick-play').hidden = true;
    $('#quick-result').hidden = false;
    $('#quick-final-score').textContent = String(final.totalScore);
    const ranking = Object.entries(final.scores).sort((a, b) => b[1] - a[1]);
    $('#quick-result-text').textContent = ranking.length
      ? `Rangliste: ${ranking.map(([name, score]) => `${name} ${score}`).join(' · ')}`
      : `${final.targetRounds} Runden wurden lokal im Verlauf gespeichert.`;
    $('#quick-progress-bar').style.width = '100%';
    $('#quick-replay').focus();
  }

  function discardActive() {
    if (!active) { sessionControls.setSessionActive(false); updateResume(); return true; }
    const previous = clone(active);
    active = null;
    if (!saveActive()) { active = previous; return false; }
    sessionControls.setSessionActive(false);
    updateResume();
    setStatus('Gespeicherte Wave-1-Session wurde verworfen.');
    return true;
  }

  function abortSession() {
    if (!active || !discardActive()) return false;
    $('#quick-play').hidden = true;
    $('#quick-result').hidden = true;
    $('#quick-setup').hidden = false;
    $('#quick-start').focus();
    return true;
  }

  function replaySession() {
    $('#quick-result').hidden = true;
    $('#quick-setup').hidden = false;
    startSession();
  }

  function updateResume() {
    const box = $('#quick-resume-box');
    box.hidden = !active;
    if (active) $('#quick-resume-text').textContent = `${game.title} · Runde ${active.round} von ${active.targetRounds}`;
  }

  function resumeSession() {
    if (!active) return;
    sessionControls.setSessionActive(true);
    $('#quick-setup').hidden = true;
    $('#quick-result').hidden = true;
    $('#quick-play').hidden = false;
    renderRound();
    $('#quick-pause').focus();
  }

  function initialize() {
    if (!game || !ALLOWED.has(game.id) || game.status !== 'playable') {
      $('#quick-setup').innerHTML = '<h1>Spiel nicht verfügbar</h1><p>Dieser Wave-1-Modus ist noch nicht freigeschaltet.</p><a class="ghost-button" href="party.html">Zum Party Hub</a>';
      return;
    }
    document.title = `Secret Circle – ${game.title}`;
    $('#quick-icon').textContent = game.icon;
    $('#quick-group').textContent = `${game.group} · Labs`;
    $('#quick-title').textContent = game.title;
    $('#quick-description').textContent = game.description;
    $('#quick-player-range').textContent = `${game.minPlayers}–${game.maxPlayers} Personen`;
    $('#quick-duration').textContent = `ca. ${game.duration} Minuten`;
    $('#quick-content-count').textContent = `${C.itemCount(game.id)} Karten`;
    const packSelect = $('#quick-pack');
    C.getPackNames(game.id).forEach(name => packSelect.add(new Option(`${name} (${C.getItems(game.id, name).length})`, name)));
    game.instructions.forEach(rule => $('#quick-rules').append(element('li', '', rule)));
    updateResume();
    sessionControls.updateNextGame(C, game.id);
    $('#quick-start').addEventListener('click', startSession);
    $('#quick-resume').addEventListener('click', resumeSession);
    $('#quick-discard').addEventListener('click', discardActive);
    const updateConnection = () => { $('#quick-connection').textContent = navigator.onLine ? 'Online' : 'Offline-Modus'; };
    addEventListener('online', updateConnection);
    addEventListener('offline', updateConnection);
    updateConnection();
    if ('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js').catch(() => setStatus('Offline-Modus konnte nicht aktiviert werden.', true));
  }

  addEventListener('pagehide', () => { if (active) saveActive(); });
  initialize();
})();
