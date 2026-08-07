'use strict';

(() => {
  const C = window.SecretCirclePartyCatalog;
  const L = window.SecretCircleSessionLedger;
  if (!C) throw new Error('Party-Katalog für Mega Modes fehlt.');
  if (!L) throw new Error('Gemeinsames Session-Register für Mega Modes fehlt.');

  const gameId = new URLSearchParams(location.search).get('game') || '';
  const megaIds = new Set(C.megaGameIds || []);
  if (!megaIds.has(gameId)) return;
  window.SecretCircleMegaModeActive = true;

  const game = C.getGame(gameId);
  const HUB_KEY = 'secret-circle-party-hub-v1';
  const ACTIVE_KEY = 'secret-circle-party-mega-active-v1';
  const VERSION = 1;
  const MAX_HISTORY = L.maximumHistory;
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
    if (!Array.isArray(value.players) || !players.length || players.length !== value.players.length) return null;
    const pack = String(value.pack ?? '');
    if (!C.getPackNames(gameId).includes(pack)) return null;
    const startedAt = String(value.startedAt ?? new Date().toISOString());
    return {
      version: VERSION,
      gameId,
      sessionId: L.normalizeSessionId(value.sessionId) || L.legacySessionId(gameId, startedAt, value.targetRounds),
      pack,
      targetRounds: value.targetRounds,
      round: value.round,
      totalScore: Number.isInteger(value.totalScore) ? Math.max(0, value.totalScore) : 0,
      scores: value.scores && typeof value.scores === 'object' && !Array.isArray(value.scores) ? value.scores : {},
      playerIndex: Number.isInteger(value.playerIndex) ? Math.max(0, value.playerIndex) : 0,
      used: Array.isArray(value.used) ? value.used.filter(Number.isInteger) : [],
      current: value.current && typeof value.current === 'object' && !Array.isArray(value.current) ? value.current : null,
      phase: String(value.phase ?? 'ready').slice(0, 30),
      players,
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
      setStatus('Die aktive Trend-Session konnte nicht gespeichert werden.', true);
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

  function pickManyUnused(items, count) {
    if (!items.length) return [];
    const result = [];
    for (let step = 0; step < Math.min(count, items.length); step += 1) {
      if (active.used.length >= items.length) active.used = [];
      const available = items.map((_, index) => index).filter(index => !active.used.includes(index));
      const index = available[randomInt(available.length)];
      active.used.push(index);
      result.push(clone(items[index]));
    }
    saveActive();
    return result;
  }

  function currentPlayer() {
    return active.players[active.playerIndex % active.players.length] || 'Aktive Person';
  }

  function addScore(points, player = currentPlayer()) {
    const safe = Number.isInteger(points) ? Math.max(0, points) : 0;
    active.totalScore += safe;
    if (player && safe) active.scores[player] = Math.max(0, Number(active.scores[player]) || 0) + safe;
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
    if (!active) return;
    resetRoundUi();
    const renderers = {
      'who-am-i': renderWhoAmI,
      'anime-guess': renderAnimeGuess,
      'money-challenge': renderMoneyChallenge,
      'blind-ranking': renderBlindRanking,
      'emoji-quiz': renderEmojiQuiz,
      'pass-the-phone': renderPassThePhone,
      'red-green-flag': renderRedGreenFlag,
      'secret-mission': renderSecretMission,
      'tier-list': renderTierList
    };
    (renderers[gameId] || renderSimplePrompt)();
  }

  function renderWhoAmI() {
    const current = ensureCurrent(() => ({ identity: pickUnused(sessionItems()), success: null }));
    $('#quick-player').textContent = `${currentPlayer()} muss die Identität erraten`;
    if (active.phase === 'ready') {
      $('#quick-content').append(element('p', '', 'Die ratende Person schaut weg. Nur die Gruppe darf die Identität sehen.'));
      $('#quick-actions').append(button('Identität der Gruppe zeigen', () => { active.phase = 'card'; saveActive(); renderRound(); }));
      return;
    }
    if (active.phase === 'card') {
      $('#quick-private-note').hidden = false;
      $('#quick-private-note').textContent = 'Die ratende Person darf diesen Begriff nicht sehen.';
      $('#quick-content').append(element('div', 'challenge-card', String(current.identity || 'Keine Identität verfügbar.')));
      $('#quick-actions').append(button('Verbergen und 60 Sekunden starten', () => { active.phase = 'guess'; saveActive(); renderRound(); }));
      return;
    }
    if (active.phase === 'guess') {
      $('#quick-content').append(element('div', 'challenge-card', 'Stelle nur Ja-Nein-Fragen.'), element('p', 'muted', 'Die Gruppe antwortet ehrlich, ohne den Namen direkt zu verraten.'));
      const timer = element('div', 'quick-timer', '1:00');
      $('#quick-controls').append(timer);
      const finish = success => {
        stopTimer();
        current.success = success;
        if (success) addScore(1);
        active.phase = 'result';
        saveActive();
        renderRound();
      };
      $('#quick-actions').append(button('Identität erraten', () => finish(true)), button('Nicht erraten', () => finish(false), 'secondary'));
      countdown(60, timer, () => finish(false));
      return;
    }
    $('#quick-content').append(element('div', 'challenge-card', String(current.identity)), element('p', current.success ? 'success-text' : 'muted', current.success ? 'Erraten – 1 Punkt.' : 'Diesmal nicht erraten.'));
    $('#quick-actions').append(button('Nächste Identität', nextRound));
  }

  function renderAnimeGuess() {
    const current = ensureCurrent(() => ({ identity: pickUnused(sessionItems()), success: null }));
    $('#quick-player').textContent = `${currentPlayer()} rät die Figur`;
    if (active.phase === 'ready') {
      $('#quick-content').append(element('p', '', 'Die ratende Person schaut weg. Die Gruppe erklärt später ohne Namen, Zitate, Logos oder Bilder.'));
      $('#quick-actions').append(button('Figur der Gruppe zeigen', () => { active.phase = 'card'; saveActive(); renderRound(); }));
      return;
    }
    if (active.phase === 'card') {
      $('#quick-private-note').hidden = false;
      $('#quick-private-note').textContent = 'Inoffizielles Fan-Quiz. Die ratende Person darf die Figur nicht sehen.';
      $('#quick-content').append(element('div', 'challenge-card', String(current.identity || 'Keine Figur verfügbar.')));
      $('#quick-actions').append(button('Figur verbergen und 60 Sekunden starten', () => { active.phase = 'guess'; saveActive(); renderRound(); }));
      return;
    }
    if (active.phase === 'guess') {
      $('#quick-content').append(element('div', 'challenge-card', 'Erklärt die Anime-Figur.'), element('p', 'muted', 'Der Name, direkte Zitate, Logos und Bilder sind verboten.'));
      const timer = element('div', 'quick-timer', '1:00');
      $('#quick-controls').append(timer);
      const finish = success => {
        stopTimer();
        current.success = success;
        if (success) addScore(1);
        active.phase = 'result';
        saveActive();
        renderRound();
      };
      $('#quick-actions').append(button('Figur erraten', () => finish(true)), button('Nicht erraten', () => finish(false), 'secondary'));
      countdown(60, timer, () => finish(false));
      return;
    }
    $('#quick-content').append(element('div', 'challenge-card', String(current.identity)), element('p', current.success ? 'success-text' : 'muted', current.success ? 'Figur erraten – 1 Punkt.' : 'Diesmal nicht erraten.'));
    $('#quick-actions').append(button('Nächste Anime-Figur', nextRound));
  }

  function renderMoneyChallenge() {
    const current = ensureCurrent(() => {
      const item = pickUnused(sessionItems()) || ['Eine sichere Herausforderung', 'Nur hypothetisch'];
      return { prompt: Array.isArray(item) ? item[0] : item, amount: Array.isArray(item) ? item[1] : active.pack };
    });
    $('#quick-player').textContent = `${currentPlayer()} entscheidet`;
    $('#quick-content').append(element('div', 'money-amount', String(current.amount)), element('div', 'challenge-card', String(current.prompt)), element('p', 'muted', 'Nur hypothetisch: Die App fordert keine echte Zahlung.'));
    $('#quick-actions').append(
      button('Würde ich machen', () => { addScore(1); nextRound(); }),
      button('Nie im Leben', nextRound, 'secondary')
    );
  }

  function renderBlindRanking() {
    const current = ensureCurrent(() => ({ items: pickManyUnused(sessionItems(), 5), index: 0, ranking: {} }));
    $('#quick-player').textContent = `${currentPlayer()} rankt blind`;
    if (active.phase === 'result' || current.index >= current.items.length) {
      const list = element('ol', 'blind-ranking-result');
      for (let rank = 1; rank <= 5; rank += 1) list.append(element('li', '', current.ranking[String(rank)] || 'Nicht belegt'));
      $('#quick-content').append(element('p', 'muted', 'Deine endgültige Blind-Rangliste:'), list);
      $('#quick-actions').append(button('Nächstes Blind Ranking', nextRound));
      return;
    }
    const item = current.items[current.index];
    $('#quick-content').append(element('p', 'muted', `Begriff ${current.index + 1} von ${current.items.length}`), element('div', 'challenge-card', String(item)));
    const occupied = new Set(Object.keys(current.ranking));
    for (let rank = 1; rank <= 5; rank += 1) {
      if (occupied.has(String(rank))) continue;
      $('#quick-actions').append(button(`Rang ${rank}`, () => {
        current.ranking[String(rank)] = item;
        current.index += 1;
        if (current.index >= current.items.length) {
          addScore(1);
          active.phase = 'result';
        }
        saveActive();
        renderRound();
      }));
    }
  }

  function renderEmojiQuiz() {
    const current = ensureCurrent(() => {
      const item = pickUnused(sessionItems()) || ['❓', 'Unbekannt'];
      return { clue: Array.isArray(item) ? item[0] : item, answer: Array.isArray(item) ? item[1] : String(item) };
    });
    $('#quick-player').textContent = 'Alle dürfen raten';
    $('#quick-content').append(element('div', 'emoji-clue', String(current.clue)));
    if (active.phase === 'ready') {
      $('#quick-actions').append(button('Antwort aufdecken', () => { active.phase = 'answer'; saveActive(); renderRound(); }));
      return;
    }
    $('#quick-content').append(element('div', 'challenge-card', String(current.answer)));
    $('#quick-actions').append(button('Richtig', () => { addScore(1, 'Gruppe'); nextRound(); }), button('Falsch', nextRound, 'secondary'));
  }

  function renderPassThePhone() {
    const current = ensureCurrent(() => ({ prompt: pickUnused(sessionItems()) }));
    $('#quick-player').textContent = 'Laut vorlesen und direkt weitergeben';
    $('#quick-content').append(element('div', 'challenge-card', String(current.prompt || 'Kein Prompt verfügbar.')));
    $('#quick-actions').append(button('Handy weitergegeben', nextRound));
  }

  function renderRedGreenFlag() {
    const current = ensureCurrent(() => ({ prompt: pickUnused(sessionItems()), choice: null }));
    $('#quick-player').textContent = 'Die Gruppe stimmt ab';
    $('#quick-content').append(element('div', 'challenge-card', String(current.prompt || 'Keine Situation verfügbar.')));
    if (!current.choice) {
      $('#quick-actions').append(
        button('🚩 Red Flag', () => { current.choice = 'Red Flag'; saveActive(); renderRound(); }, 'flag-red'),
        button('✅ Green Flag', () => { current.choice = 'Green Flag'; saveActive(); renderRound(); }, 'flag-green')
      );
      return;
    }
    $('#quick-content').append(element('div', 'choice-result', `Entscheidung: ${current.choice}`), element('p', 'muted', 'Vergleicht kurz eure Gründe.'));
    $('#quick-actions').append(button('Nächste Situation', nextRound));
  }

  function renderSecretMission() {
    const current = ensureCurrent(() => ({ mission: pickUnused(sessionItems()), success: null }));
    $('#quick-player').textContent = `${currentPlayer()} erhält eine geheime Mission`;
    if (active.phase === 'ready') {
      $('#quick-private-note').hidden = false;
      $('#quick-private-note').textContent = 'Nur die aktive Person darf die Mission sehen.';
      $('#quick-actions').append(button('Mission anzeigen', () => { active.phase = 'card'; saveActive(); renderRound(); }));
      return;
    }
    if (active.phase === 'card') {
      $('#quick-private-note').hidden = false;
      $('#quick-content').append(element('div', 'challenge-card', String(current.mission || 'Keine Mission verfügbar.')));
      $('#quick-actions').append(button('Mission merken und verbergen', () => { active.phase = 'active'; saveActive(); renderRound(); }));
      return;
    }
    if (active.phase === 'active') {
      $('#quick-content').append(element('div', 'challenge-card', 'Mission läuft'), element('p', 'muted', 'Erfülle sie sicher und ohne andere unter Druck zu setzen.'));
      $('#quick-actions').append(
        button('Mission geschafft', () => { current.success = true; addScore(1); active.phase = 'result'; saveActive(); renderRound(); }),
        button('Nicht geschafft', () => { current.success = false; active.phase = 'result'; saveActive(); renderRound(); }, 'secondary')
      );
      return;
    }
    $('#quick-content').append(element('div', 'challenge-card', String(current.mission)), element('p', current.success ? 'success-text' : 'muted', current.success ? 'Mission erfüllt – 1 Punkt.' : 'Mission nicht erfüllt.'));
    $('#quick-actions').append(button('Nächste Mission', nextRound));
  }

  function renderTierList() {
    const current = ensureCurrent(() => ({ item: pickUnused(sessionItems()), tier: null }));
    $('#quick-player').textContent = 'Gemeinsam einordnen';
    $('#quick-content').append(element('div', 'challenge-card', String(current.item || 'Kein Begriff verfügbar.')));
    if (!current.tier) {
      for (const tier of ['S', 'A', 'B', 'C', 'D']) {
        $('#quick-actions').append(button(`${tier}-Tier`, () => {
          current.tier = tier;
          addScore(1, 'Gruppe');
          saveActive();
          renderRound();
        }, `tier tier-${tier.toLowerCase()}`));
      }
      return;
    }
    $('#quick-content').append(element('div', 'tier-result', `${current.tier}-Tier`), element('p', 'muted', 'Begründet die Entscheidung kurz.'));
    $('#quick-actions').append(button('Nächster Begriff', nextRound));
  }

  function renderSimplePrompt() {
    const current = ensureCurrent(() => ({ prompt: pickUnused(sessionItems()) }));
    $('#quick-content').append(element('div', 'challenge-card', String(current.prompt || 'Keine Karte verfügbar.')));
    $('#quick-actions').append(button('Nächste Karte', nextRound));
  }

  function startSession() {
    hub = loadHub();
    if (!game || hub.players.length < game.minPlayers || hub.players.length > game.maxPlayers) {
      setStatus(`${game?.title || 'Dieses Spiel'} benötigt ${game?.minPlayers || 2}–${game?.maxPlayers || 20} Personen. Passe die Gruppe im Party Hub an.`, true);
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
        id: L.completionId('mega', game.id, active.sessionId),
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
      : `${final.targetRounds} Trend-Runden wurden lokal gespeichert.`;
    $('#quick-progress-bar').style.width = '100%';
    $('#quick-replay').focus();
  }

  function discardActive() {
    active = null;
    saveActive();
    updateResume();
    setStatus('Gespeicherte Trend-Session wurde verworfen.');
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
