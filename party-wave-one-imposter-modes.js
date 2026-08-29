'use strict';

(() => {
  const C = window.SecretCirclePartyCatalog;
  const L = window.SecretCircleSessionLedger;
  const S = window.SecretCircleSessionControls;
  if (!C || !L || !S) throw new Error('Gemeinsame Runtime für Imposter-Labs fehlt.');

  const HUB_KEY = 'secret-circle-party-hub-v1';
  const ACTIVE_KEY = 'secret-circle-party-quick-active-v1';
  const VERSION = 1;
  const MAX_HISTORY = L.maximumHistory;
  const ALLOWED = new Set(C.waveOneImposterGameIds || []);
  const $ = selector => document.querySelector(selector);
  const gameId = new URLSearchParams(location.search).get('game') || '';
  const game = C.getGame(gameId);

  let hub = loadHub();
  let active = loadActive();
  let secretVisible = false;
  let voteVisible = false;

  const sessionControls = S.createController({
    documentRef: document,
    windowRef: window,
    catalog: C,
    gameId,
    onSkip: () => { if (active && ['handoff', 'discussion'].includes(active.phase)) nextRound(); },
    onAbort: abortSession,
    onReplay: replaySession
  });

  const clone = value => JSON.parse(JSON.stringify(value));
  const clean = (value, max = 80) => String(value ?? '').normalize('NFKC').trim().replace(/\s+/g, ' ').slice(0, max);
  const keyText = value => clean(value, 80).toLocaleLowerCase('de-DE');

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

  function normalizeVotes(value, players) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
    const votes = {};
    for (const [voter, target] of Object.entries(value)) {
      if (!players.includes(voter) || !players.includes(target) || voter === target || voter in votes) return null;
      votes[voter] = target;
    }
    return votes;
  }

  function normalizeCurrent(value, players) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
    const undercoverPlayer = clean(value.undercoverPlayer, 32);
    if (!players.includes(undercoverPlayer)) return null;
    const revealIndex = Number(value.revealIndex);
    const voteIndex = Number(value.voteIndex);
    if (!Number.isInteger(revealIndex) || revealIndex < 0 || revealIndex > players.length) return null;
    if (!Number.isInteger(voteIndex) || voteIndex < 0 || voteIndex > players.length) return null;
    const votes = normalizeVotes(value.votes, players);
    if (!votes || Object.keys(votes).length !== voteIndex) return null;
    const eliminated = value.eliminated === null ? null : clean(value.eliminated, 32);
    if (eliminated !== null && !players.includes(eliminated)) return null;
    const winner = value.winner === null ? null : String(value.winner);
    if (winner !== null && !['group', 'undercover'].includes(winner)) return null;
    const scored = Boolean(value.scored);

    if (gameId === 'undercover-similar-word') {
      const civilian = clean(value.civilian, 60);
      const undercover = clean(value.undercover, 60);
      if (!civilian || !undercover || keyText(civilian) === keyText(undercover)) return null;
      return { civilian, undercover, undercoverPlayer, revealIndex, voteIndex, votes, eliminated, winner, scored, tie: Boolean(value.tie) };
    }
    if (gameId === 'no-word-imposter') {
      const word = clean(value.word, 60);
      const guess = value.guess === null ? null : clean(value.guess, 60);
      if (!word) return null;
      return { word, undercoverPlayer, revealIndex, voteIndex, votes, eliminated, winner, scored, tie: Boolean(value.tie), guess };
    }
    return null;
  }

  function validActive(value) {
    if (!value || value.version !== VERSION || value.gameId !== gameId) return null;
    if (![3, 5, 10, 20].includes(value.targetRounds)) return null;
    if (!Number.isInteger(value.round) || value.round < 1 || value.round > value.targetRounds) return null;
    const players = cleanPlayers(value.players);
    if (players.length < 3 || !Array.isArray(value.players) || players.length !== value.players.length) return null;
    const phase = String(value.phase || 'handoff');
    if (!['handoff', 'discussion', 'voting', 'guess', 'result'].includes(phase)) return null;
    const current = normalizeCurrent(value.current, players);
    if (!current) return null;
    if (phase === 'handoff' && current.revealIndex >= players.length) return null;
    if (phase !== 'handoff' && current.revealIndex !== players.length) return null;
    if (phase === 'voting' && current.voteIndex >= players.length) return null;
    if (['guess', 'result'].includes(phase) && current.voteIndex !== players.length) return null;
    if (phase === 'guess' && (gameId !== 'no-word-imposter' || current.eliminated !== current.undercoverPlayer || current.winner !== null)) return null;
    if (phase === 'result' && !current.winner) return null;
    if (phase !== 'result' && current.scored) return null;
    return {
      version: VERSION,
      gameId,
      sessionId: L.normalizeSessionId(value.sessionId) || L.legacySessionId(gameId, value.startedAt, value.targetRounds),
      pack: clean(value.pack, 60),
      targetRounds: value.targetRounds,
      round: value.round,
      totalScore: Number.isInteger(value.totalScore) ? Math.max(0, value.totalScore) : 0,
      scores: value.scores && typeof value.scores === 'object' && !Array.isArray(value.scores) ? value.scores : {},
      used: Array.isArray(value.used) ? value.used.filter(Number.isInteger) : [],
      current,
      phase,
      players,
      startedAt: String(value.startedAt || new Date().toISOString()),
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
      setStatus('Die aktive Imposter-Session konnte nicht gespeichert werden.', true);
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
    return clone(items[index]);
  }

  function createRound() {
    const item = pickUnused(C.getItems(gameId, active.pack));
    if (item === null || item === undefined) return null;
    const undercoverPlayer = active.players[randomInt(active.players.length)];
    const common = { undercoverPlayer, revealIndex: 0, voteIndex: 0, votes: {}, eliminated: null, winner: null, scored: false, tie: false };
    if (gameId === 'undercover-similar-word') return { ...common, civilian: clean(item.civilian, 60), undercover: clean(item.undercover, 60) };
    return { ...common, word: clean(item, 60), guess: null };
  }

  function currentPlayer() { return active.players[active.current.revealIndex] || ''; }
  function currentVoter() { return active.players[active.current.voteIndex] || ''; }

  function resetRoundUi() {
    clearNode($('#quick-content')); clearNode($('#quick-controls')); clearNode($('#quick-actions'));
    $('#quick-private-note').hidden = true;
    $('#quick-eyebrow').textContent = active.pack;
    $('#quick-round-title').textContent = game.title;
    $('#quick-progress').textContent = `Runde ${active.round} von ${active.targetRounds}`;
    $('#quick-score').textContent = `${active.totalScore} Punkte`;
    $('#quick-progress-bar').style.width = `${Math.round(((active.round - 1) / active.targetRounds) * 100)}%`;
  }

  function concealPrivate() {
    if (!secretVisible && !voteVisible) return false;
    secretVisible = false;
    voteVisible = false;
    if (active && ['handoff', 'voting'].includes(active.phase)) renderRound();
    return true;
  }

  function finishRevealCard() {
    secretVisible = false;
    active.current.revealIndex += 1;
    if (active.current.revealIndex >= active.players.length) active.phase = 'discussion';
    if (!saveActive()) return;
    renderRound();
  }

  function renderHandoff() {
    const player = currentPlayer();
    $('#quick-player').textContent = player ? `Gerät an ${player} geben` : '';
    $('#quick-private-note').hidden = false;
    $('#quick-private-note').textContent = 'Nur die genannte Person darf die nächste Karte sehen.';
    if (!secretVisible) {
      $('#quick-content').append(element('div', 'challenge-card', `Bereit, ${player}?`));
      $('#quick-actions').append(button('Geheime Karte anzeigen', () => { secretVisible = true; renderRound(); }));
      return;
    }
    const isUndercover = player === active.current.undercoverPlayer;
    let value;
    let label;
    if (gameId === 'undercover-similar-word') {
      value = isUndercover ? active.current.undercover : active.current.civilian;
      label = isUndercover ? 'Dein ähnliches Wort' : 'Euer gemeinsames Wort';
    } else {
      value = isUndercover ? 'Kein Wort' : active.current.word;
      label = isUndercover ? 'Du bist der Imposter' : 'Euer gemeinsames Wort';
    }
    $('#quick-content').append(element('p', 'eyebrow', label), element('div', 'challenge-card', value));
    if (isUndercover) $('#quick-content').append(element('p', 'muted', gameId === 'undercover-similar-word' ? 'Du hast ein ähnliches Wort. Bleib bei den Hinweisen unauffällig.' : 'Höre genau auf die Hinweise. Wenn du enttarnt wirst, bekommst du einen letzten Guess.'));
    $('#quick-actions').append(button('Verstanden & verdecken', finishRevealCard));
  }

  function startVoting() {
    active.phase = 'voting';
    active.current.voteIndex = 0;
    active.current.votes = {};
    voteVisible = false;
    if (!saveActive()) return;
    renderRound();
  }

  function renderDiscussion() {
    $('#quick-player').textContent = 'Alle spielen';
    $('#quick-content').append(
      element('div', 'challenge-card', 'Gebt reihum kurze Hinweise.'),
      element('p', 'muted', gameId === 'undercover-similar-word'
        ? 'Die Wörter sind ähnlich. Seid konkret genug, um Unterschiede zu erkennen, aber verratet euer Wort nicht direkt.'
        : 'Der Imposter kennt kein Wort und versucht aus euren Hinweisen mitzuhalten.')
    );
    $('#quick-actions').append(button('Geheime Abstimmung starten', startVoting));
  }

  function castVote(target) {
    const voter = currentVoter();
    if (!voter || target === voter || !active.players.includes(target)) return;
    active.current.votes[voter] = target;
    active.current.voteIndex += 1;
    voteVisible = false;
    if (active.current.voteIndex >= active.players.length) return resolveVotes();
    if (!saveActive()) return;
    renderRound();
  }

  function renderVoting() {
    const voter = currentVoter();
    $('#quick-player').textContent = `Gerät an ${voter} geben`;
    $('#quick-private-note').hidden = false;
    $('#quick-private-note').textContent = 'Nur die genannte Person stimmt ab.';
    if (!voteVisible) {
      $('#quick-content').append(element('div', 'challenge-card', `${voter} stimmt als Nächstes ab.`));
      $('#quick-actions').append(button('Abstimmung öffnen', () => { voteVisible = true; renderRound(); }));
      return;
    }
    $('#quick-content').append(element('div', 'challenge-card', 'Wer ist der Imposter?'));
    for (const target of active.players.filter(name => name !== voter)) $('#quick-actions').append(button(target, () => castVote(target), 'secondary'));
  }

  function awardWinner() {
    if (active.current.scored || !active.current.winner) return;
    if (active.current.winner === 'undercover') {
      active.scores[active.current.undercoverPlayer] = (Number(active.scores[active.current.undercoverPlayer]) || 0) + 2;
      active.totalScore += 2;
    } else {
      for (const player of active.players.filter(name => name !== active.current.undercoverPlayer)) {
        active.scores[player] = (Number(active.scores[player]) || 0) + 1;
        active.totalScore += 1;
      }
    }
    active.current.scored = true;
  }

  function resolveVotes() {
    const counts = Object.fromEntries(active.players.map(name => [name, 0]));
    Object.values(active.current.votes).forEach(target => { counts[target] += 1; });
    const maximum = Math.max(...Object.values(counts));
    const leaders = active.players.filter(name => counts[name] === maximum);
    active.current.tie = leaders.length !== 1;
    active.current.eliminated = leaders.length === 1 ? leaders[0] : null;
    if (active.current.tie) {
      active.current.winner = 'undercover';
      active.phase = 'result';
      awardWinner();
    } else if (active.current.eliminated !== active.current.undercoverPlayer) {
      active.current.winner = 'undercover';
      active.phase = 'result';
      awardWinner();
    } else if (gameId === 'no-word-imposter') {
      active.phase = 'guess';
    } else {
      active.current.winner = 'group';
      active.phase = 'result';
      awardWinner();
    }
    if (!saveActive()) return;
    renderRound();
  }

  function submitGuess() {
    const input = $('#quick-guess-input');
    const guess = clean(input?.value, 60);
    if (!guess) { setStatus('Gib einen Begriff ein oder nutze „Keine Ahnung“.', true); return; }
    active.current.guess = guess;
    active.current.winner = keyText(guess) === keyText(active.current.word) ? 'undercover' : 'group';
    active.phase = 'result';
    awardWinner();
    if (!saveActive()) return;
    setStatus('');
    renderRound();
  }

  function giveUpGuess() {
    active.current.guess = '';
    active.current.winner = 'group';
    active.phase = 'result';
    awardWinner();
    if (!saveActive()) return;
    renderRound();
  }

  function renderGuess() {
    $('#quick-player').textContent = `${active.current.undercoverPlayer} hat einen letzten Versuch`;
    $('#quick-content').append(element('div', 'challenge-card', 'Welches Wort hatte die Gruppe?'));
    const input = element('input');
    input.id = 'quick-guess-input';
    input.maxLength = 60;
    input.autocomplete = 'off';
    input.setAttribute('aria-label', 'Letzter Wort-Guess des Imposters');
    $('#quick-controls').append(input);
    $('#quick-actions').append(button('Guess prüfen', submitGuess), button('Keine Ahnung', giveUpGuess, 'secondary'));
    input.focus();
  }

  function nextRound() {
    if (active.round >= active.targetRounds) return finishSession();
    active.round += 1;
    active.phase = 'handoff';
    active.current = createRound();
    secretVisible = false;
    voteVisible = false;
    if (!active.current || !saveActive()) return;
    renderRound();
  }

  function renderResult() {
    const undercoverWon = active.current.winner === 'undercover';
    $('#quick-player').textContent = undercoverWon ? `${active.current.undercoverPlayer} gewinnt die Runde` : 'Die Gruppe gewinnt die Runde';
    if (active.current.tie) $('#quick-content').append(element('p', 'muted', 'Die Abstimmung war unentschieden – niemand wurde eindeutig enttarnt.'));
    else $('#quick-content').append(element('p', 'muted', `Gewählt: ${active.current.eliminated}.`));
    $('#quick-content').append(element('div', 'challenge-card', `Imposter: ${active.current.undercoverPlayer}`));
    if (gameId === 'undercover-similar-word') {
      $('#quick-content').append(element('p', '', `Gruppe: ${active.current.civilian}`), element('p', '', `Undercover: ${active.current.undercover}`));
    } else {
      $('#quick-content').append(element('p', '', `Gesuchtes Wort: ${active.current.word}`));
      if (active.current.guess !== null) $('#quick-content').append(element('p', '', `Letzter Guess: ${active.current.guess || 'Keine Ahnung'}`));
    }
    $('#quick-actions').append(button(active.round >= active.targetRounds ? 'Session abschließen' : 'Nächste Runde', nextRound));
  }

  function renderRound() {
    if (!active) return;
    resetRoundUi();
    if (active.phase === 'handoff') return renderHandoff();
    if (active.phase === 'discussion') return renderDiscussion();
    if (active.phase === 'voting') return renderVoting();
    if (active.phase === 'guess') return renderGuess();
    if (active.phase === 'result') return renderResult();
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
    if (!C.getPackNames(game.id).includes(pack) || ![3, 5, 10, 20].includes(targetRounds)) return setStatus('Kategorie oder Rundenzahl ist ungültig.', true);
    active = {
      version: VERSION, gameId: game.id, sessionId: L.createSessionId(game.id), pack, targetRounds,
      round: 1, totalScore: 0, scores: Object.fromEntries(hub.players.map(name => [name, 0])), used: [],
      current: null, phase: 'handoff', players: clone(hub.players), startedAt: new Date().toISOString(), completedRecorded: false
    };
    active.current = createRound();
    if (!active.current || !saveActive()) return;
    secretVisible = false; voteVisible = false;
    sessionControls.setSessionActive(true);
    $('#quick-setup').hidden = true; $('#quick-result').hidden = true; $('#quick-play').hidden = false;
    renderRound(); $('#quick-pause').focus();
  }

  function finishSession() {
    if (!active) return;
    if (!active.completedRecorded) {
      const result = L.recordCompletion(loadHub(), {
        id: L.completionId('wave1-imposter', game.id, active.sessionId), gameId: game.id, title: game.title,
        endedAt: new Date().toISOString(), rounds: active.targetRounds, score: active.totalScore
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
    $('#quick-play').hidden = true; $('#quick-result').hidden = false;
    $('#quick-final-score').textContent = String(final.totalScore);
    const ranking = Object.entries(final.scores).sort((a, b) => b[1] - a[1]);
    $('#quick-result-text').textContent = `Rangliste: ${ranking.map(([name, score]) => `${name} ${score}`).join(' · ')}`;
    $('#quick-progress-bar').style.width = '100%'; $('#quick-replay').focus();
  }

  function discardActive() {
    if (!active) { sessionControls.setSessionActive(false); updateResume(); return true; }
    const previous = clone(active); active = null;
    if (!saveActive()) { active = previous; return false; }
    secretVisible = false; voteVisible = false;
    sessionControls.setSessionActive(false); updateResume(); setStatus('Gespeicherte Imposter-Session wurde verworfen.');
    return true;
  }
  function abortSession() {
    if (!active || !discardActive()) return false;
    $('#quick-play').hidden = true; $('#quick-result').hidden = true; $('#quick-setup').hidden = false; $('#quick-start').focus();
    return true;
  }
  function replaySession() { $('#quick-result').hidden = true; $('#quick-setup').hidden = false; startSession(); }
  function updateResume() {
    const box = $('#quick-resume-box'); box.hidden = !active;
    if (active) $('#quick-resume-text').textContent = `${game.title} · Runde ${active.round} von ${active.targetRounds}`;
  }
  function resumeSession() {
    if (!active) return;
    secretVisible = false; voteVisible = false;
    sessionControls.setSessionActive(true);
    $('#quick-setup').hidden = true; $('#quick-result').hidden = true; $('#quick-play').hidden = false;
    renderRound(); $('#quick-pause').focus();
  }

  function initialize() {
    if (!game || !ALLOWED.has(game.id) || game.status !== 'playable') {
      $('#quick-setup').innerHTML = '<h1>Spiel nicht verfügbar</h1><p>Diese Imposter-Variante ist noch nicht freigeschaltet.</p><a class="ghost-button" href="party.html">Zum Party Hub</a>';
      return;
    }
    document.title = `Secret Circle – ${game.title}`;
    $('#quick-icon').textContent = game.icon; $('#quick-group').textContent = `${game.group} · Labs`;
    $('#quick-title').textContent = game.title; $('#quick-description').textContent = game.description;
    $('#quick-player-range').textContent = `${game.minPlayers}–${game.maxPlayers} Personen`;
    $('#quick-duration').textContent = `ca. ${game.duration} Minuten`; $('#quick-content-count').textContent = `${C.itemCount(game.id)} Karten`;
    C.getPackNames(game.id).forEach(name => $('#quick-pack').add(new Option(`${name} (${C.getItems(game.id, name).length})`, name)));
    game.instructions.forEach(rule => $('#quick-rules').append(element('li', '', rule)));
    updateResume(); sessionControls.updateNextGame(C, game.id);
    $('#quick-start').addEventListener('click', startSession); $('#quick-resume').addEventListener('click', resumeSession); $('#quick-discard').addEventListener('click', discardActive);
    const updateConnection = () => { $('#quick-connection').textContent = navigator.onLine ? 'Online' : 'Offline-Modus'; };
    addEventListener('online', updateConnection); addEventListener('offline', updateConnection); updateConnection();
    if ('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js').catch(() => setStatus('Offline-Modus konnte nicht aktiviert werden.', true));
  }

  addEventListener('blur', concealPrivate);
  addEventListener('pagehide', () => { concealPrivate(); if (active) saveActive(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden) concealPrivate(); });
  initialize();
})();
