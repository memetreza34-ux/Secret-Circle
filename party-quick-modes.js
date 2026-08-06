'use strict';

(() => {
  const C = window.SecretCirclePartyCatalog;
  const L = window.SecretCircleSessionLedger;
  if (!C) throw new Error('Party-Katalog für Quick Modes fehlt.');
  if (!L) throw new Error('Gemeinsames Session-Register für Quick Modes fehlt.');

  const HUB_KEY = 'secret-circle-party-hub-v1';
  const ACTIVE_KEY = 'secret-circle-party-quick-active-v1';
  const VERSION = 1;
  const MAX_HISTORY = L.maximumHistory;
  const ALLOWED = new Set(C.trendingGameIds || []);
  const $ = selector => document.querySelector(selector);

  const gameId = new URLSearchParams(location.search).get('game') || '';
  const game = C.getGame(gameId);
  let hub = loadHub();
  let active = loadActive();
  let timerId = null;

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function cleanPlayers(value) {
    const raw = Array.isArray(value) ? value : [];
    const result = [];
    const seen = new Set();
    for (const item of raw) {
      const name = String(item ?? '').normalize('NFKC').trim().replace(/\s+/g, ' ').slice(0, 32);
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

  function validActive(value) {
    if (!value || value.version !== VERSION || value.gameId !== gameId) return null;
    if (!Number.isInteger(value.targetRounds) || ![3, 5, 10, 20].includes(value.targetRounds)) return null;
    if (!Number.isInteger(value.round) || value.round < 1 || value.round > value.targetRounds) return null;
    if (!Array.isArray(value.players) || cleanPlayers(value.players).length !== value.players.length) return null;
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
      current: value.current && typeof value.current === 'object' ? value.current : null,
      phase: String(value.phase ?? 'ready'),
      players: cleanPlayers(value.players),
      startedAt,
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

  function pickUnused(items) {
    if (!items.length) return null;
    if (active.used.length >= items.length) active.used = [];
    const available = items.map((_, index) => index).filter(index => !active.used.includes(index));
    const index = available[randomInt(available.length)];
    active.used.push(index);
    saveActive();
    return clone(items[index]);
  }

  function currentPlayer() {
    return active.players[active.playerIndex % active.players.length] || 'Aktive Person';
  }

  function addScore(points, player = currentPlayer()) {
    const safe = Number.isInteger(points) ? Math.max(0, points) : 0;
    active.totalScore += safe;
    if (player && safe) active.scores[player] = Math.max(0, Number(active.scores[player]) || 0) + safe;
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

  function sessionItems() {
    return C.getItems(gameId, active.pack);
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

  function ensureCurrent(factory) {
    if (!active.current) {
      active.current = factory();
      saveActive();
    }
    return active.current;
  }

  function renderRound() {
    if (!active) return;
    resetRoundUi();
    if (gameId === 'wavelength') return renderWavelength();
    if (gameId === 'rapid-fire') return renderRapidFire();
    if (gameId === 'letter-categories') return renderCategories();
    if (gameId === 'dont-laugh') return renderDontLaugh();
    if (gameId === 'scavenger-hunt') return renderScavenger();
    if (gameId === 'caption-battle') return renderCaptionBattle();
    return renderGuessingMode();
  }

  function renderWavelength() {
    const current = ensureCurrent(() => ({ spectrum: pickUnused(sessionItems()), target: 5 + randomInt(91), guess: 50 }));
    const [left, right] = current.spectrum || ['Links', 'Rechts'];
    $('#quick-player').textContent = `${currentPlayer()} gibt den Hinweis`;
    if (active.phase === 'ready') {
      $('#quick-private-note').hidden = false;
      const scale = element('div', 'spectrum-card');
      scale.append(element('span', '', left), element('strong', '', `Ziel: ${current.target}`), element('span', '', right));
      $('#quick-content').append(scale, element('p', 'muted', 'Gib einen kurzen Hinweis, der dein Team möglichst nah an den geheimen Zielwert führt.'));
      $('#quick-actions').append(button('Ziel verbergen und Gerät weitergeben', () => {
        active.phase = 'guess';
        saveActive();
        renderRound();
      }));
      return;
    }
    if (active.phase === 'guess') {
      const labels = element('div', 'spectrum-labels');
      labels.append(element('span', '', left), element('span', '', right));
      const input = document.createElement('input');
      input.type = 'range'; input.min = '0'; input.max = '100'; input.value = String(current.guess || 50);
      input.setAttribute('aria-label', `Teamposition zwischen ${left} und ${right}`);
      const value = element('strong', 'range-value', input.value);
      input.addEventListener('input', () => { value.textContent = input.value; });
      $('#quick-content').append(labels, input, value);
      $('#quick-actions').append(button('Position festlegen', () => {
        current.guess = Number(input.value);
        const distance = Math.abs(current.target - current.guess);
        current.points = distance <= 5 ? 4 : distance <= 12 ? 3 : distance <= 20 ? 2 : distance <= 30 ? 1 : 0;
        addScore(current.points, 'Team');
        active.phase = 'result';
        saveActive();
        renderRound();
      }));
      return;
    }
    const distance = Math.abs(current.target - current.guess);
    $('#quick-content').append(
      element('div', 'reveal-number', String(current.target)),
      element('p', '', `Eure Position: ${current.guess} · Abstand: ${distance} · ${current.points} Punkte`)
    );
    $('#quick-actions').append(button('Nächstes Spektrum', nextRound));
  }

  function renderRapidFire() {
    const current = ensureCurrent(() => {
      const item = pickUnused(sessionItems()) || ['Nenne drei Dinge', 3, 5];
      return { prompt: item[0], required: Number(item[1]) || 3, seconds: Number(item[2]) || 5 };
    });
    $('#quick-player').textContent = `${currentPlayer()} antwortet`;
    $('#quick-content').append(element('div', 'challenge-card', current.prompt));
    if (active.phase === 'ready') {
      $('#quick-actions').append(button(`${current.seconds} Sekunden starten`, () => {
        active.phase = 'running'; saveActive(); renderRound();
      }));
      return;
    }
    if (active.phase === 'running') {
      const timer = element('div', 'quick-timer', '0:00');
      $('#quick-controls').append(timer);
      const finish = success => {
        stopTimer();
        if (success) addScore(1);
        active.phase = success ? 'success' : 'failed';
        saveActive(); renderRound();
      };
      $('#quick-actions').append(button(`${current.required} geschafft`, () => finish(true)), button('Nicht geschafft', () => finish(false), 'secondary'));
      countdown(current.seconds, timer, () => finish(false));
      return;
    }
    $('#quick-content').append(element('p', active.phase === 'success' ? 'success-text' : 'error', active.phase === 'success' ? 'Geschafft – 1 Punkt.' : 'Zeit vorbei – kein Punkt.'));
    $('#quick-actions').append(button('Nächste Challenge', nextRound));
  }

  function renderCategories() {
    const letters = 'ABCDEFGHJKLMNPRSTUVWZ'.split('');
    const current = ensureCurrent(() => ({ categories: pickUnused(sessionItems()), letter: letters[randomInt(letters.length)] }));
    $('#quick-player').textContent = 'Alle spielen gleichzeitig';
    $('#quick-content').append(element('div', 'letter-card', current.letter));
    const list = element('ul', 'category-list');
    (current.categories || []).forEach(value => list.append(element('li', '', value)));
    $('#quick-content').append(list);
    if (active.phase === 'ready') {
      $('#quick-actions').append(button('60 Sekunden starten', () => { active.phase = 'running'; saveActive(); renderRound(); }));
      return;
    }
    if (active.phase === 'running') {
      const timer = element('div', 'quick-timer', '1:00');
      $('#quick-controls').append(timer);
      countdown(60, timer, () => { active.phase = 'score'; saveActive(); renderRound(); });
      $('#quick-actions').append(button('Vorzeitig auswerten', () => { active.phase = 'score'; saveActive(); renderRound(); }, 'secondary'));
      return;
    }
    const max = (current.categories || []).length;
    const label = element('label', 'score-input-label', 'Gültige einzigartige Antworten');
    const input = document.createElement('input');
    input.type = 'number'; input.min = '0'; input.max = String(max); input.value = '0'; input.inputMode = 'numeric';
    label.append(input);
    $('#quick-controls').append(label);
    $('#quick-actions').append(button('Punkte übernehmen', () => {
      addScore(Math.min(max, Math.max(0, Number(input.value) || 0)), 'Gruppe');
      nextRound();
    }));
  }

  function renderGuessingMode() {
    const current = ensureCurrent(() => ({ prompt: pickUnused(sessionItems()) }));
    const privateModes = new Set(['draw-guess', 'sound-imitation', 'hum-song']);
    const isForehead = gameId === 'forehead-guess';
    $('#quick-player').textContent = isForehead ? `${currentPlayer()} rät` : `${currentPlayer()} ist dran`;
    if (active.phase === 'ready') {
      $('#quick-private-note').hidden = !privateModes.has(gameId);
      $('#quick-content').textContent = isForehead
        ? 'Die ratende Person darf nicht auf den Bildschirm sehen. Gerät zur Gruppe drehen.'
        : 'Karte erst öffnen, wenn nur die aktive Person mitlesen kann.';
      $('#quick-actions').append(button('Karte anzeigen', () => { active.phase = 'card'; saveActive(); renderRound(); }));
      return;
    }
    $('#quick-content').append(element('div', 'challenge-card', String(current.prompt || 'Keine Karte verfügbar.')));
    const successText = gameId === 'draw-guess' ? 'Erraten' : gameId === 'sound-imitation' ? 'Geräusch erraten' : gameId === 'hum-song' ? 'Melodie erraten' : 'Begriff erraten';
    $('#quick-actions').append(
      button(successText, () => { addScore(1); nextRound(); }),
      button('Überspringen', nextRound, 'secondary')
    );
  }

  function renderDontLaugh() {
    const current = ensureCurrent(() => ({ prompt: pickUnused(sessionItems()) }));
    $('#quick-player').textContent = `${currentPlayer()} versucht die Gruppe zum Lachen zu bringen`;
    $('#quick-content').append(element('div', 'challenge-card', String(current.prompt || 'Keine Aufgabe verfügbar.')));
    if (active.phase === 'ready') {
      $('#quick-actions').append(button('30 Sekunden starten', () => { active.phase = 'running'; saveActive(); renderRound(); }));
      return;
    }
    if (active.phase === 'running') {
      const timer = element('div', 'quick-timer', '0:30');
      $('#quick-controls').append(timer);
      const finish = laughed => {
        stopTimer();
        if (laughed) addScore(1);
        active.phase = laughed ? 'success' : 'failed'; saveActive(); renderRound();
      };
      $('#quick-actions').append(button('Jemand hat gelacht', () => finish(true)), button('Alle blieben ernst', () => finish(false), 'secondary'));
      countdown(30, timer, () => finish(false));
      return;
    }
    $('#quick-content').append(element('p', active.phase === 'success' ? 'success-text' : 'muted', active.phase === 'success' ? 'Mission erfüllt – 1 Punkt.' : 'Die Gruppe blieb ernst.'));
    $('#quick-actions').append(button('Nächste Person', nextRound));
  }

  function renderScavenger() {
    const current = ensureCurrent(() => ({ prompt: pickUnused(sessionItems()) }));
    $('#quick-player').textContent = 'Alle suchen gleichzeitig';
    $('#quick-content').append(element('div', 'challenge-card', String(current.prompt || 'Keine Aufgabe verfügbar.')));
    if (active.phase === 'ready') {
      $('#quick-actions').append(button('60 Sekunden starten', () => { active.phase = 'running'; saveActive(); renderRound(); }));
      return;
    }
    if (active.phase === 'running') {
      const timer = element('div', 'quick-timer', '1:00');
      $('#quick-controls').append(timer);
      const finish = found => {
        stopTimer();
        if (found) addScore(1, 'Gruppe');
        active.phase = found ? 'success' : 'failed'; saveActive(); renderRound();
      };
      $('#quick-actions').append(button('Gegenstand gefunden', () => finish(true)), button('Nicht gefunden', () => finish(false), 'secondary'));
      countdown(60, timer, () => finish(false));
      return;
    }
    $('#quick-content').append(element('p', active.phase === 'success' ? 'success-text' : 'muted', active.phase === 'success' ? 'Gefunden – 1 Punkt.' : 'Kein passender Gegenstand gefunden.'));
    $('#quick-actions').append(button('Nächste Suche', nextRound));
  }

  function renderCaptionBattle() {
    const current = ensureCurrent(() => ({ prompt: pickUnused(sessionItems()) }));
    $('#quick-player').textContent = 'Alle erfinden eine Caption';
    $('#quick-content').append(element('div', 'challenge-card', String(current.prompt || 'Keine Situation verfügbar.')));
    if (active.phase === 'ready') {
      $('#quick-actions').append(button('Captions sind bereit', () => { active.phase = 'vote'; saveActive(); renderRound(); }));
      return;
    }
    const selectLabel = element('label', '', 'Gewinner dieser Runde');
    const select = document.createElement('select');
    active.players.forEach(name => select.add(new Option(name, name)));
    selectLabel.append(select);
    $('#quick-controls').append(selectLabel);
    $('#quick-actions').append(button('Gewinner bestätigen', () => { addScore(1, select.value); nextRound(); }));
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
      const result = L.recordCompletion(loadHub(), {
        id: L.completionId('quick', game.id, active.sessionId),
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
    if (!saveActive()) {
      active = final;
      return;
    }
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
    active = null;
    saveActive();
    updateResume();
    setStatus('Gespeicherte Quick-Session wurde verworfen.');
  }

  function updateResume() {
    const box = $('#quick-resume-box');
    box.hidden = !active;
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
    if (!game || !ALLOWED.has(game.id) || game.status !== 'playable') {
      $('#quick-setup').innerHTML = '<h1>Spiel nicht verfügbar</h1><p>Dieser Quick Mode ist noch nicht freigeschaltet.</p><a class="ghost-button" href="party.html">Zum Party Hub</a>';
      return;
    }
    document.title = `Secret Circle – ${game.title}`;
    $('#quick-icon').textContent = game.icon;
    $('#quick-group').textContent = game.group;
    $('#quick-title').textContent = game.title;
    $('#quick-description').textContent = game.description;
    $('#quick-player-range').textContent = `${game.minPlayers}–${game.maxPlayers} Personen`;
    $('#quick-duration').textContent = `ca. ${game.duration} Minuten`;
    $('#quick-content-count').textContent = `${C.itemCount(game.id)} Karten`;
    const packSelect = $('#quick-pack');
    C.getPackNames(game.id).forEach(name => packSelect.add(new Option(`${name} (${C.getItems(game.id, name).length})`, name)));
    const rules = $('#quick-rules');
    game.instructions.forEach(rule => rules.append(element('li', '', rule)));
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
