'use strict';

(() => {
  const C = window.SecretCirclePartyCatalog;
  const gameId = new URLSearchParams(location.search).get('game') || '';
  const viralIds = new Set(C?.viralGameIds || []);
  if (!C || !viralIds.has(gameId)) return;

  const game = C.getGame(gameId);
  const HUB_KEY = 'secret-circle-party-hub-v1';
  const ACTIVE_KEY = 'secret-circle-party-viral-active-v1';
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
    const raw = Array.isArray(value) ? value : [];
    const players = [];
    const seen = new Set();
    for (const item of raw) {
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

  function validActive(value) {
    if (!value || value.version !== VERSION || value.gameId !== gameId) return null;
    if (!Number.isInteger(value.targetRounds) || ![3, 5, 10, 20].includes(value.targetRounds)) return null;
    if (!Number.isInteger(value.round) || value.round < 1 || value.round > value.targetRounds) return null;
    const players = cleanPlayers(value.players);
    const pack = String(value.pack ?? '');
    if (!Array.isArray(value.players) || players.length !== value.players.length || !players.length) return null;
    if (!C.getPackNames(gameId).includes(pack)) return null;
    return {
      version: VERSION,
      gameId,
      pack,
      targetRounds: value.targetRounds,
      round: value.round,
      totalScore: Number.isInteger(value.totalScore) ? Math.max(0, value.totalScore) : 0,
      scores: value.scores && typeof value.scores === 'object' && !Array.isArray(value.scores) ? value.scores : {},
      playerIndex: Number.isInteger(value.playerIndex) ? Math.max(0, value.playerIndex) : 0,
      used: Array.isArray(value.used) ? value.used.filter(Number.isInteger) : [],
      current: value.current && typeof value.current === 'object' && !Array.isArray(value.current) ? value.current : null,
      phase: String(value.phase ?? 'ready').slice(0, 40),
      players,
      startedAt: String(value.startedAt ?? new Date().toISOString()),
      completedRecorded: Boolean(value.completedRecorded)
    };
  }

  function loadActive() {
    try {
      return validActive(JSON.parse(localStorage.getItem(ACTIVE_KEY)));
    } catch {
      return null;
    }
  }

  function saveActive() {
    try {
      if (active) localStorage.setItem(ACTIVE_KEY, JSON.stringify(active));
      else localStorage.removeItem(ACTIVE_KEY);
      return true;
    } catch {
      setStatus('Die aktive Viral-Session konnte nicht gespeichert werden.', true);
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
      setStatus('Verlauf und Statistik konnten nicht sicher gespeichert werden.', true);
      return false;
    }
  }

  function setStatus(message, error = false) {
    $('#quick-status').textContent = message || '';
    $('#quick-status').classList.toggle('error', error);
  }

  function clearNode(node) {
    while (node.firstChild) node.firstChild.remove();
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

  function addScore(points, player = currentPlayer()) {
    const safe = Number.isInteger(points) ? Math.max(0, points) : 0;
    active.totalScore += safe;
    if (player && safe) active.scores[player] = Math.max(0, Number(active.scores[player]) || 0) + safe;
  }

  function sessionItems() {
    return C.getItems(gameId, active.pack);
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

  function pickDistinct(items, count) {
    const available = items.map((item, index) => ({ item, index }));
    const result = [];
    while (available.length && result.length < count) {
      const position = randomInt(available.length);
      const [chosen] = available.splice(position, 1);
      result.push(clone(chosen.item));
    }
    return result;
  }

  function stopTimer() {
    if (timerId !== null) clearInterval(timerId);
    timerId = null;
  }

  function countdown(seconds, display, onEnd) {
    stopTimer();
    const deadline = Date.now() + seconds * 1000;
    const tick = () => {
      const remaining = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
      display.textContent = `${Math.floor(remaining / 60)}:${String(remaining % 60).padStart(2, '0')}`;
      if (remaining <= 0) {
        stopTimer();
        navigator.vibrate?.([120, 80, 120]);
        onEnd();
      }
    };
    tick();
    timerId = setInterval(tick, 250);
  }

  function ensureCurrent(factory) {
    if (!active.current) {
      active.current = factory();
      saveActive();
    }
    return active.current;
  }

  function nextRound() {
    stopTimer();
    if (active.round >= active.targetRounds) return finishSession();
    active.round += 1;
    active.playerIndex = (active.playerIndex + 1) % active.players.length;
    active.current = null;
    active.phase = 'ready';
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
    $('#quick-score').textContent = `${active.totalScore} Punkte`;
    $('#quick-progress-bar').style.width = `${Math.round(((active.round - 1) / active.targetRounds) * 100)}%`;
  }

  function renderRound() {
    resetRoundUi();
    const renderers = {
      'put-a-finger-down': renderFingerDown,
      'guess-the-price': renderGuessPrice,
      'higher-lower': renderHigherLower,
      'know-me-best': renderKnowMeBest,
      'hear-me-out': renderHearMeOut,
      'hot-seat': renderHotSeat,
      'story-chain': renderStoryChain,
      'finish-the-sentence': renderFinishSentence
    };
    (renderers[gameId] || renderSimplePrompt)();
  }

  function renderFingerDown() {
    const current = ensureCurrent(() => ({ prompt: pickUnused(sessionItems()), answer: null }));
    $('#quick-player').textContent = `${currentPlayer()} antwortet ehrlich`;
    $('#quick-content').append(element('div', 'challenge-card', String(current.prompt || 'Keine Aussage verfügbar.')));
    if (!current.answer) {
      $('#quick-actions').append(
        button('☝️ Bleibt oben', () => { current.answer = 'oben'; addScore(1); saveActive(); renderRound(); }),
        button('👇 Finger runter', () => { current.answer = 'runter'; saveActive(); renderRound(); }, 'secondary')
      );
      return;
    }
    $('#quick-content').append(element('div', 'choice-result', current.answer === 'oben' ? 'Finger bleibt oben' : 'Finger runter'));
    $('#quick-actions').append(button('Nächste Aussage', nextRound));
  }

  function renderGuessPrice() {
    const current = ensureCurrent(() => {
      const item = pickUnused(sessionItems()) || ['Unbekannter Gegenstand', 50];
      return { label: String(item[0]), price: Number(item[1]) || 0, guess: null, points: 0 };
    });
    $('#quick-player').textContent = `${currentPlayer()} schätzt`;
    $('#quick-content').append(element('div', 'challenge-card', current.label), element('p', 'muted', 'Reiner Spielwert – kein aktueller Händlerpreis.'));
    if (active.phase === 'ready') {
      const label = element('label', 'price-input-label', 'Deine Schätzung in Euro');
      const input = document.createElement('input');
      input.type = 'number'; input.min = '0'; input.max = '100000'; input.step = '1'; input.inputMode = 'numeric'; input.value = '0';
      label.append(input);
      $('#quick-controls').append(label);
      $('#quick-actions').append(button('Schätzung festlegen', () => {
        current.guess = Math.max(0, Math.min(100000, Math.round(Number(input.value) || 0)));
        const denominator = Math.max(1, current.price);
        const relative = Math.abs(current.guess - current.price) / denominator;
        current.points = relative <= 0.1 ? 3 : relative <= 0.25 ? 2 : relative <= 0.5 ? 1 : 0;
        addScore(current.points);
        active.phase = 'result';
        saveActive();
        renderRound();
      }));
      return;
    }
    $('#quick-content').append(
      element('div', 'money-amount', `${current.price} €`),
      element('p', '', `Deine Schätzung: ${current.guess} € · ${current.points} Punkte`)
    );
    $('#quick-actions').append(button('Nächster Spielpreis', nextRound));
  }

  function renderHigherLower() {
    const current = ensureCurrent(() => {
      const [first, second] = pickDistinct(sessionItems(), 2);
      return {
        first: first || ['Erste Zahl', 10],
        second: second || ['Zweite Zahl', 20],
        choice: null,
        correct: null
      };
    });
    const [firstLabel, firstValue] = current.first;
    const [secondLabel, secondValue] = current.second;
    $('#quick-player').textContent = 'Die Gruppe entscheidet';
    $('#quick-content').append(
      element('p', 'muted', String(firstLabel)),
      element('div', 'reveal-number', String(firstValue)),
      element('div', 'challenge-card', String(secondLabel))
    );
    if (!current.choice) {
      $('#quick-actions').append(
        button('⬆️ Höher', () => resolveHigherLower('higher')),
        button('⬇️ Tiefer oder gleich', () => resolveHigherLower('lower'), 'secondary')
      );
      return;
    }
    $('#quick-content').append(
      element('div', 'money-amount', String(secondValue)),
      element('p', current.correct ? 'success-text' : 'error', current.correct ? 'Richtig – 1 Punkt.' : 'Nicht richtig.')
    );
    $('#quick-actions').append(button('Nächstes Zahlen-Duell', nextRound));

    function resolveHigherLower(choice) {
      current.choice = choice;
      current.correct = choice === 'higher' ? Number(secondValue) > Number(firstValue) : Number(secondValue) <= Number(firstValue);
      if (current.correct) addScore(1, 'Gruppe');
      saveActive();
      renderRound();
    }
  }

  function renderKnowMeBest() {
    const current = ensureCurrent(() => {
      const item = pickUnused(sessionItems()) || ['Was passt zu mir?', 'A', 'B', 'C'];
      return { question: item[0], options: item.slice(1, 4), secret: null, groupGuess: null };
    });
    $('#quick-player').textContent = `${currentPlayer()} wählt zuerst geheim`;
    $('#quick-content').append(element('div', 'challenge-card', String(current.question)));
    if (active.phase === 'ready') {
      $('#quick-private-note').hidden = false;
      $('#quick-private-note').textContent = 'Nur die aktive Person darf ihre Antwort festlegen.';
      current.options.forEach((option, index) => $('#quick-actions').append(button(`${String.fromCharCode(65 + index)} · ${option}`, () => {
        current.secret = index;
        active.phase = 'group';
        saveActive();
        renderRound();
      })));
      return;
    }
    if (active.phase === 'group') {
      $('#quick-player').textContent = 'Die Gruppe rät die geheime Antwort';
      current.options.forEach((option, index) => $('#quick-actions').append(button(`${String.fromCharCode(65 + index)} · ${option}`, () => {
        current.groupGuess = index;
        if (current.groupGuess === current.secret) addScore(1, 'Gruppe');
        active.phase = 'result';
        saveActive();
        renderRound();
      })));
      return;
    }
    const correct = current.groupGuess === current.secret;
    $('#quick-content').append(
      element('div', 'choice-result', `Antwort: ${current.options[current.secret]}`),
      element('p', correct ? 'success-text' : 'muted', correct ? 'Richtig vorhergesagt – 1 Punkt.' : `Die Gruppe wählte: ${current.options[current.groupGuess]}`)
    );
    $('#quick-actions').append(button('Nächste Person', nextRound));
  }

  function renderHearMeOut() {
    const current = ensureCurrent(() => ({ prompt: pickUnused(sessionItems()), result: null }));
    $('#quick-player').textContent = `${currentPlayer()} verteidigt die These`;
    $('#quick-content').append(element('div', 'challenge-card', String(current.prompt || 'Keine These verfügbar.')));
    if (active.phase === 'ready') {
      $('#quick-actions').append(button('30 Sekunden starten', () => { active.phase = 'talk'; saveActive(); renderRound(); }));
      return;
    }
    if (active.phase === 'talk') {
      const timer = element('div', 'quick-timer', '0:30');
      $('#quick-controls').append(timer);
      countdown(30, timer, () => { active.phase = 'vote'; saveActive(); renderRound(); });
      $('#quick-actions').append(button('Argument beendet', () => { stopTimer(); active.phase = 'vote'; saveActive(); renderRound(); }, 'secondary'));
      return;
    }
    if (active.phase === 'vote') {
      $('#quick-player').textContent = 'Die Gruppe stimmt ab';
      $('#quick-actions').append(
        button('Überzeugt', () => { current.result = true; addScore(1); active.phase = 'result'; saveActive(); renderRound(); }),
        button('Nicht überzeugt', () => { current.result = false; active.phase = 'result'; saveActive(); renderRound(); }, 'secondary')
      );
      return;
    }
    $('#quick-content').append(element('p', current.result ? 'success-text' : 'muted', current.result ? 'Die Gruppe wurde überzeugt – 1 Punkt.' : 'Die These blieb umstritten.'));
    $('#quick-actions').append(button('Nächste These', nextRound));
  }

  function renderHotSeat() {
    const current = ensureCurrent(() => ({ questions: pickDistinct(sessionItems(), 5), success: null }));
    $('#quick-player').textContent = `${currentPlayer()} sitzt im Hot Seat`;
    const list = element('ol', 'hot-seat-list');
    current.questions.forEach(question => list.append(element('li', '', String(question))));
    $('#quick-content').append(list);
    if (active.phase === 'ready') {
      $('#quick-actions').append(button('45 Sekunden starten', () => { active.phase = 'running'; saveActive(); renderRound(); }));
      return;
    }
    if (active.phase === 'running') {
      const timer = element('div', 'quick-timer', '0:45');
      $('#quick-controls').append(timer);
      const finish = success => {
        stopTimer();
        current.success = success;
        if (success) addScore(1);
        active.phase = 'result';
        saveActive();
        renderRound();
      };
      $('#quick-actions').append(button('Alle beantwortet', () => finish(true)), button('Zeit vorbei', () => finish(false), 'secondary'));
      countdown(45, timer, () => finish(false));
      return;
    }
    $('#quick-content').append(element('p', current.success ? 'success-text' : 'muted', current.success ? 'Hot Seat geschafft – 1 Punkt.' : 'Nicht alle Fragen geschafft.'));
    $('#quick-actions').append(button('Nächste Person', nextRound));
  }

  function renderStoryChain() {
    const current = ensureCurrent(() => ({ opening: pickUnused(sessionItems()), completed: null }));
    $('#quick-player').textContent = 'Alle ergänzen reihum einen Satz';
    $('#quick-content').append(element('div', 'challenge-card', String(current.opening || 'Es war einmal …')));
    if (active.phase === 'ready') {
      $('#quick-actions').append(button('90 Sekunden starten', () => { active.phase = 'running'; saveActive(); renderRound(); }));
      return;
    }
    if (active.phase === 'running') {
      const timer = element('div', 'quick-timer', '1:30');
      $('#quick-controls').append(timer);
      const finish = completed => {
        stopTimer();
        current.completed = completed;
        if (completed) addScore(1, 'Gruppe');
        active.phase = 'result';
        saveActive();
        renderRound();
      };
      $('#quick-actions').append(button('Geschichte beendet', () => finish(true)), button('Timer beenden', () => finish(false), 'secondary'));
      countdown(90, timer, () => finish(false));
      return;
    }
    $('#quick-content').append(element('p', current.completed ? 'success-text' : 'muted', current.completed ? 'Gemeinsames Ende gefunden – 1 Punkt.' : 'Die Geschichte bleibt offen.'));
    $('#quick-actions').append(button('Neue Geschichte', nextRound));
  }

  function renderFinishSentence() {
    const current = ensureCurrent(() => ({ prompt: pickUnused(sessionItems()), accepted: null }));
    $('#quick-player').textContent = `${currentPlayer()} beendet den Satz`;
    $('#quick-content').append(element('div', 'challenge-card', String(current.prompt || 'Ich würde …')));
    if (current.accepted === null) {
      $('#quick-actions').append(
        button('Kreativer Treffer', () => { current.accepted = true; addScore(1); saveActive(); renderRound(); }),
        button('Weiter', () => { current.accepted = false; saveActive(); renderRound(); }, 'secondary')
      );
      return;
    }
    $('#quick-content').append(element('p', current.accepted ? 'success-text' : 'muted', current.accepted ? 'Die Gruppe vergibt 1 Punkt.' : 'Kein Punkt in dieser Runde.'));
    $('#quick-actions').append(button('Nächster Satz', nextRound));
  }

  function renderSimplePrompt() {
    const current = ensureCurrent(() => ({ prompt: pickUnused(sessionItems()) }));
    $('#quick-content').append(element('div', 'challenge-card', String(current.prompt || 'Keine Karte verfügbar.')));
    $('#quick-actions').append(button('Nächste Karte', nextRound));
  }

  function startSession() {
    hub = loadHub();
    if (hub.players.length < game.minPlayers || hub.players.length > game.maxPlayers) {
      setStatus(`${game.title} benötigt ${game.minPlayers}–${game.maxPlayers} Personen. Passe die Gruppe im Party Hub an.`, true);
      return;
    }
    active = {
      version: VERSION,
      gameId,
      pack: $('#quick-pack').value || C.getPackNames(gameId)[0],
      targetRounds: Number($('#quick-rounds').value),
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
        id: `viral-${Date.now()}-${randomInt(1_000_000)}`,
        gameId,
        title: game.title,
        endedAt: new Date().toISOString(),
        rounds: active.targetRounds,
        score: active.totalScore
      };
      const nextHub = clone(loadHub());
      nextHub.history = [entry, ...(Array.isArray(nextHub.history) ? nextHub.history : [])].slice(0, MAX_HISTORY);
      nextHub.recent = [gameId, ...(Array.isArray(nextHub.recent) ? nextHub.recent.filter(id => id !== gameId) : [])].slice(0, 8);
      nextHub.stats = nextHub.stats || {};
      const stats = nextHub.stats[gameId] || { plays: 0, rounds: 0, best: 0 };
      nextHub.stats[gameId] = {
        plays: Math.max(1, Number(stats.plays) || 0),
        rounds: Math.max(0, Number(stats.rounds) || 0) + active.targetRounds,
        best: Math.max(Number(stats.best) || 0, active.totalScore)
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
    $('#quick-final-score').textContent = String(final.totalScore);
    const ranking = Object.entries(final.scores).sort((left, right) => right[1] - left[1]);
    $('#quick-result-text').textContent = ranking.length
      ? `Rangliste: ${ranking.map(([name, score]) => `${name} ${score}`).join(' · ')}`
      : `${final.targetRounds} Viral-Runden wurden lokal gespeichert.`;
    $('#quick-progress-bar').style.width = '100%';
    $('#quick-replay').focus();
  }

  function discardActive() {
    active = null;
    saveActive();
    updateResume();
    setStatus('Gespeicherte Viral-Session wurde verworfen.');
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
    $('#quick-group').textContent = game.group;
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
