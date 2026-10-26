'use strict';
(() => {
  const C = window.SecretCirclePartyCatalog, M = window.SecretCircleClassicModel;
  const L = window.SecretCircleSessionLedger, S = window.SecretCircleSessionControls;
  const gameId = new URLSearchParams(location.search).get('game') || '';
  if (!C?.classicGameIds?.includes(gameId)) return;
  if (!M || !L || !S || !window.SecretCircleClassicDrawing) throw Error('Klassiker konnten nicht geladen werden.');
  window.SecretCircleClassicModeActive = true;
  const game = C.getGame(gameId), HUB_KEY = 'secret-circle-party-hub-v1', ACTIVE_KEY = 'secret-circle-party-mega-active-v1';
  const $ = selector => document.querySelector(selector);
  const clone = value => JSON.parse(JSON.stringify(value));
  const node = (tag, className = '', text) => { const result = document.createElement(tag); result.className = className; if (text !== undefined) result.textContent = text; return result; };
  let hub = readHub(), active = readActive(), epoch = 0, drawing = null, input = null;
  const controls = S.createController({ documentRef: document, windowRef: window, catalog: C, gameId,
    onSkip: () => { if (active) change(() => gameId === 'three-rounds' ? endTeamTurn() : advance()); }, onAbort: discard, onReplay: start });
  function status(message = '', error = false) { $('#quick-status').textContent = message; $('#quick-status').classList.toggle('error', error); }
  function players(value) {
    if (!Array.isArray(value)) return [];
    const seen = new Set();
    return value.filter(v => typeof v === 'string').map(M.clean).filter(v => { const k = v.toLocaleLowerCase('de-DE'); if (!v || v.length > 32 || seen.has(k)) return false; seen.add(k); return true; }).slice(0, 20);
  }
  function readHub() {
    try {
      const value = JSON.parse(localStorage.getItem(HUB_KEY));
      if (!value || value.version !== 1) throw Error();
      return { ...value, players: players(value.players), history: Array.isArray(value.history) ? value.history : [], stats: value.stats || {} };
    } catch { return { version: 1, players: [], favorites: [], recent: [], presets: [], history: [], stats: {} }; }
  }
  function valid(value) {
    return value?.version === 1 && value.gameId === gameId && L.normalizeSessionId(value.sessionId) === value.sessionId
      && [3, 5, 10, 20].includes(value.targetRounds) && Number.isInteger(value.round) && value.round >= 1 && value.round <= value.targetRounds
      && Array.isArray(value.players) && value.players.length >= game.minPlayers && players(value.players).length === value.players.length && value.players.every((name, i) => name === players(value.players)[i])
      && C.getPackNames(gameId).includes(value.pack) && ['ready', 'card'].includes(value.phase)
      && Number.isInteger(value.playerIndex) && value.playerIndex >= 0 && value.playerIndex < value.players.length
      && Number.isInteger(value.totalScore) && value.totalScore >= 0 && value.totalScore <= 60
      && value.scores && typeof value.scores === 'object' && !Array.isArray(value.scores)
      && Object.entries(value.scores).every(([name, score]) => value.players.includes(name) && Number.isInteger(score) && score >= 0 && score <= 20)
      && Array.isArray(value.used) && value.used.length <= C.getItems(gameId, value.pack).length && value.used.every(i => Number.isInteger(i) && i >= 0 && i < C.getItems(gameId, value.pack).length)
      && (gameId !== 'three-rounds' || (value.targetRounds === 3 && value.round === value.current?.phase && value.totalScore === value.current.teamScores.reduce((a, b) => a + b, 0)))
      && M.valid(gameId, value.current, value.players, C.getItems(gameId, value.pack));
  }
  function readActive() {
    try { const value = JSON.parse(localStorage.getItem(ACTIVE_KEY)); return valid(value) ? value : null; } catch { return null; }
  }
  function save() {
    try { if (active) localStorage.setItem(ACTIVE_KEY, JSON.stringify(active)); else localStorage.removeItem(ACTIVE_KEY); return true; }
    catch { status('Spielstand konnte nicht gespeichert werden. Prüfe den freien Gerätespeicher und versuche es erneut.', true); return false; }
  }
  function randomInt(max) { const value = new Uint32Array(1); crypto.getRandomValues(value); return value[0] % max; }
  function items() { return C.getItems(gameId, active.pack); }
  function seed() {
    const available = items().map((_, i) => i).filter(i => !active.used.includes(i));
    if (!available.length) { active.used = []; return seed(); }
    const picked = window.SecretCircleCardMemory?.choose({ gameId, pack: active.pack }, items(), available, randomInt);
    const index = Number.isInteger(picked) ? picked : available[randomInt(available.length)]; active.used.push(index);
    return [items()[index]];
  }
  function initial(size) {
    let pool = gameId === 'drawing-telephone' ? seed() : items();
    if (gameId === 'three-rounds') {
      const free = pool.map((_, i) => i), selected = [];
      while (selected.length < size && free.length) {
        const picked = window.SecretCircleCardMemory?.choose({ gameId, pack: active.pack }, pool, free, randomInt);
        const index = Number.isInteger(picked) ? picked : free[randomInt(free.length)]; selected.push(pool[index]); free.splice(free.indexOf(index), 1);
      }
      pool = selected;
    }
    return M.create(gameId, pool, size, randomInt);
  }
  function rememberTimer() {
    if (active?.current?.kind === 'three-rounds' && controls.remainingMilliseconds() > 0) active.current.remainingMs = Math.max(1, Math.ceil(controls.remainingMilliseconds()));
  }
  function flushDraft() {
    if (!active || active.phase !== 'card') return;
    if (drawing) active.current.draft = drawing.value();
    if (input) {
      if (gameId === 'drawing-telephone') active.current.draftText = M.clean(input.value);
      if (gameId === 'packing-suitcase' && active.current.stage === 'recall') active.current.pending = M.clean(input.value);
    }
  }
  function button(title, action, secondary = false) {
    const token = epoch, result = node('button', secondary ? 'pill pill-quiet' : 'pill pill-primary', title); result.type = 'button';
    result.addEventListener('click', () => { if (token === epoch && active && !controls.isPaused()) change(action); }); return result;
  }
  function change(action) {
    if (!active) return;
    flushDraft(); rememberTimer(); controls.stopTimer(); const before = clone(active);
    try {
      const applied = action();
      if (!active || applied === false) return;
      if (gameId === 'three-rounds') active.totalScore = active.current.teamScores.reduce((a, b) => a + b, 0);
      if (!valid(active)) throw Error('Dieser Spielschritt ist inkonsistent. Bitte versuche es erneut.');
      if (!save()) { active = before; render(); return; }
      status(); render();
    } catch (error) { active = before; render(); status(error.message || 'Dieser Schritt konnte nicht gespeichert werden.', true); }
  }
  function score() {
    if (gameId === 'three-rounds') { active.totalScore = active.current.teamScores.reduce((a, b) => a + b, 0); active.scores = {}; }
    $('#quick-score').textContent = gameId === 'drawing-telephone' ? 'Gemeinsam spielen' : `${active.totalScore} Treffer`;
  }
  function currentPlayer() {
    const current = active.current;
    if (gameId === 'drawing-telephone') return active.players[(active.playerIndex + current.steps.length) % active.players.length];
    if (gameId === 'three-rounds') { const team = active.players.filter((_, i) => i % 2 === current.team); return team[Math.floor(current.turn / 2) % team.length]; }
    return active.players[active.playerIndex];
  }
  function render() {
    epoch++; controls.stopTimer(); drawing?.dispose(); drawing = null; input = null;
    $('#quick-content').replaceChildren(); $('#quick-controls').replaceChildren(); $('#quick-actions').replaceChildren();
    if (!active) return;
    if (active.current.kind === 'three-rounds' && active.current.stage === 'done') {
      $('#quick-content').append(node('h3', '', 'Alle drei Phasen geschafft'), node('p', 'classic-caption', `Team A ${active.current.teamScores[0]} : ${active.current.teamScores[1]} Team B`));
      $('#quick-actions').append(button('Ergebnis speichern', finish)); return;
    }
    score();
    $('#quick-progress').textContent = gameId === 'three-rounds' ? `Phase ${active.current.phase} von 3` : `Runde ${active.round} von ${active.targetRounds}`;
    $('#quick-progress-bar').style.width = `${Math.round((active.round - 1) / active.targetRounds * 100)}%`;
    $('#quick-round-title').textContent = game.title; $('#quick-eyebrow').textContent = active.pack;
    $('#quick-player').textContent = currentPlayer(); $('#quick-private-note').hidden = true;
    if (active.phase === 'ready') {
      const state = active.current;
      const handoff = gameId === 'drawing-telephone' && state.stage === 'review' ? 'Die Bildkette ist fertig. Holt die Gruppe dazu.'
        : gameId === 'packing-suitcase' && state.stage !== 'recall' ? 'Gerät an die Gruppe geben. Die aktive Person schaut noch weg.'
        : `Gerät an ${currentPlayer()} geben. Alle anderen schauen weg.`;
      $('#quick-content').append(node('p', 'classic-handoff', handoff));
      $('#quick-actions').append(button('Ich bin bereit', () => { active.phase = 'card'; }));
      return;
    }
    if (!document.hidden && document.hasFocus() && !controls.isPaused()) $('#quick-round-title').focus({ preventScroll: true });
    $('#quick-private-note').hidden = false; $('#quick-private-note').textContent = 'Vor dem Weitergeben verbergen. Bei Unterbrechung wird diese Ansicht zugedeckt.';
    if (gameId === 'drawing-telephone') renderTelephone();
    else if (gameId === 'three-rounds') renderThreeRounds();
    else renderSuitcase();
    $('#quick-actions').append(button('Verbergen', () => { active.phase = 'ready'; }, true));
    $('#quick-actions').append(button('Beenden & speichern', finish, true));
  }
  function field(label, value = '') {
    const wrapper = node('label', 'classic-field', label), text = node('textarea'); text.rows = 2; text.maxLength = 180; text.value = value;
    wrapper.append(text); $('#quick-content').append(wrapper); input = text; return text;
  }
  function showStep(step, label) {
    const host = node('section', 'classic-step'); host.append(node('h3', '', label));
    if (step.type === 'drawing' && step.strokes?.length) window.SecretCircleClassicDrawing.mount(host, step.strokes, () => {}, true, label);
    if (step.text) host.append(node('p', 'classic-caption', step.text));
    $('#quick-content').append(host);
  }
  function renderTelephone() {
    const state = active.current;
    if (state.stage === 'review') {
      $('#quick-content').append(node('h3', '', 'So hat sich eure Idee verändert'), node('p', 'challenge-card', state.seed));
      state.steps.forEach((step, index) => showStep(step, active.players[(active.playerIndex + index) % active.players.length]));
      $('#quick-actions').append(button(active.round === active.targetRounds ? 'Bildketten abschließen' : 'Nächste Bildkette', advance));
      return;
    }
    const index = state.steps.length;
    $('#quick-player').textContent = `${currentPlayer()} · Schritt ${index + 1} von ${active.players.length}`;
    if (index % 2 === 0) {
      $('#quick-content').append(node('p', 'classic-caption', index ? state.steps[index - 1].text : state.seed));
      const host = node('div', 'classic-drawing'); $('#quick-content').append(host);
      drawing = window.SecretCircleClassicDrawing.mount(host, state.draft, strokes => { if (active?.phase === 'card') { active.current.draft = strokes; save(); } });
      const description = field('Falls Zeichnen nicht geht: kurz beschreiben (optional)', state.draftText);
      $('#quick-actions').append(button('Zeichnung weitergeben', () => { M.submitDrawing(active.current, drawing.value(), description.value); afterStep(); }));
    } else {
      showStep(state.steps[index - 1], 'Nur dieses Bild beschreiben');
      const guess = field('Was ist auf dem Bild zu sehen?', state.draftText);
      $('#quick-actions').append(button('Beschreibung weitergeben', () => { M.submitGuess(active.current, guess.value); afterStep(); }));
    }
  }
  function afterStep() { if (active.current.steps.length === active.players.length) active.current.stage = 'review'; active.phase = 'ready'; }
  function renderSuitcase() {
    const state = active.current;
    if (state.stage === 'recall') {
      $('#quick-content').append(node('p', 'challenge-card', state.list.length ? `Wiederhole ${state.list.length} Dinge in der richtigen Reihenfolge.` : 'Der Koffer ist noch leer. Du beginnst.'), node('p', '', 'Sage die bisherige Liste und deine Ergänzung laut. Die Gruppe prüft danach.'));
      const entry = field('Mein neuer Gegenstand', state.pending);
      $('#quick-actions').append(button('Zur Gruppenprüfung weitergeben', () => { M.propose(active.current, entry.value); active.phase = 'ready'; }));
    } else {
      const list = node('ol', 'classic-list'); state.list.forEach(item => list.append(node('li', '', item)));
      $('#quick-content').append(node('h3', '', 'Bisherige Reihenfolge'), list, node('p', 'classic-caption', `Neue Ergänzung: ${state.pending}`));
      if (state.stage === 'check') {
        $('#quick-content').append(node('p', '', 'Wurde die bisherige Liste vollständig und in der richtigen Reihenfolge wiederholt?'));
        for (const [label, correct] of [['Richtig wiederholt', true], ['Nicht geschafft', false]]) $('#quick-actions').append(button(label, () => {
          const points = M.judge(active.current, correct); active.totalScore += points;
          if (points) active.scores = { ...active.scores, [currentPlayer()]: (Number.isInteger(active.scores[currentPlayer()]) ? active.scores[currentPlayer()] : 0) + points };
        }, !correct));
      } else {
        $('#quick-content').append(node('p', '', state.correct ? 'Geschafft! Die Ergänzung bleibt im Koffer.' : 'Diesmal kein Punkt. Die bisherige Liste bleibt unverändert.'));
        $('#quick-actions').append(button(active.round === active.targetRounds ? 'Koffer-Runde abschließen' : 'Nächste Person', advance));
      }
    }
  }
  function renderThreeRounds() {
    const state = active.current, descriptions = ['Frei erklären – ohne das Zielwort zu nennen.', 'Genau ein Hinweiswort – keine zusätzlichen Wörter.', 'Nur Pantomime – ohne Sprache oder Geräusche.'];
    $('#quick-content').append(node('p', 'classic-caption', `Team A ${state.teamScores[0]} : ${state.teamScores[1]} Team B`), node('p', '', descriptions[state.phase - 1]));
    if (state.stage === 'phaseEnd') {
      $('#quick-content').append(node('p', 'challenge-card', 'Der Stapel ist geschafft. Dieselben Begriffe kommen wieder.'));
      $('#quick-actions').append(button('Nächste Phase', () => { M.nextPhase(active.current, randomInt); active.round = active.current.phase; active.phase = 'ready'; }));
      return;
    }
    $('#quick-player').textContent = `Team ${state.team === 0 ? 'A' : 'B'} · ${currentPlayer()} erklärt`;
    $('#quick-content').append(node('div', 'challenge-card', state.deck[state.bag[0]]), node('p', '', `${state.bag.length} Begriffe verbleiben im Stapel.`));
    const timer = node('div', 'quick-timer', '1:00'); $('#quick-controls').append(timer);
    $('#quick-actions').append(button('Erraten', () => M.hit(active.current)), button('Begriff überspringen', () => M.skip(active.current), true), button('Teamzug beenden', endTeamTurn, true));
    controls.countdownMilliseconds(state.remainingMs, timer, () => { if (active && active.current.stage === 'turn') change(endTeamTurn); });
  }
  function endTeamTurn() { M.endTurn(active.current); active.phase = 'ready'; }
  function advance() {
    if (active.round >= active.targetRounds) return finish();
    if (gameId === 'packing-suitcase') { active.current.pending = ''; active.current.stage = 'recall'; active.current.correct = null; }
    active.round++; active.playerIndex = (active.playerIndex + 1) % active.players.length; active.phase = 'ready';
    if (gameId === 'drawing-telephone') active.current = initial();
  }
  function start() {
    hub = readHub(); if (hub.players.length < game.minPlayers || hub.players.length > game.maxPlayers) { status(`Dieses Spiel braucht ${game.minPlayers}–${game.maxPlayers} Personen. Lege eure Gruppe zuerst im Hub fest.`, true); return; }
    const count = Number($('#quick-rounds').value), pack = $('#quick-pack').value;
    if (![3, 5, 10, 20].includes(count) || !C.getPackNames(gameId).includes(pack)) { status('Wähle eine gültige Kategorie und Rundenzahl.', true); return; }
    const previous = active;
    active = { version: 1, gameId, sessionId: L.createSessionId(gameId), pack, targetRounds: gameId === 'three-rounds' ? 3 : count,
      round: 1, totalScore: 0, scores: {}, playerIndex: 0, players: hub.players, used: [], current: null, phase: 'ready', startedAt: new Date().toISOString(), completedRecorded: false };
    active.current = initial(count);
    if (!valid(active)) { active = previous; status('Diese Partie konnte nicht eingerichtet werden.', true); return; }
    if (!save()) { active = previous; return; }
    controls.setPaused(false); controls.setSessionActive(true); showPlay(); render();
  }
  function showPlay() { $('#quick-setup').hidden = true; $('#quick-result').hidden = true; $('#quick-play').hidden = false; }
  function finish() {
    if (!active) return; rememberTimer(); controls.stopTimer(); epoch++;
    if (!active.completedRecorded) {
      const result = L.recordCompletion(readHub(), { id: L.completionId('mega', gameId, active.sessionId), gameId, title: game.title,
        endedAt: new Date().toISOString(), rounds: active.round, score: active.totalScore, players: active.players });
      try { if (result.recorded) localStorage.setItem(HUB_KEY, JSON.stringify(result.hub)); }
      catch { render(); status('Der Verlauf konnte nicht gespeichert werden. Versuche den Abschluss erneut.', true); return false; }
      active.completedRecorded = true; if (!save()) { render(); return false; }
    }
    const final = clone(active); active = null;
    if (!save()) { active = final; render(); return false; }
    drawing?.dispose(); drawing = null; input = null;
    $('#quick-content').replaceChildren(); $('#quick-controls').replaceChildren(); $('#quick-actions').replaceChildren();
    controls.setSessionActive(false); $('#quick-play').hidden = true; $('#quick-result').hidden = false;
    $('#quick-final-score').textContent = gameId === 'drawing-telephone' ? 'Gemeinsam' : String(final.totalScore);
    $('#quick-result .quick-result-score span').textContent = gameId === 'drawing-telephone' ? 'Bildketten gespielt' : 'Treffer';
    $('#quick-result-text').textContent = gameId === 'three-rounds' ? `Team A: ${final.current.teamScores[0]} · Team B: ${final.current.teamScores[1]}`
      : gameId === 'drawing-telephone' ? 'Eure Bildketten wurden gespielt. Es gibt keine Punkte und keinen Gewinner.'
      : Object.entries(final.scores).map(([name, value]) => `${name}: ${value}`).join(' · ') || 'Diesmal blieb der Koffer noch leer.';
    $('#quick-progress-bar').style.width = '100%'; $('#quick-replay').focus();
  }
  function discard() {
    const previous = active; active = null; if (!save()) { active = previous; return false; }
    epoch++; controls.stopTimer(); drawing?.dispose(); drawing = null; input = null;
    $('#quick-content').replaceChildren(); $('#quick-controls').replaceChildren(); $('#quick-actions').replaceChildren();
    $('#quick-play').hidden = true; $('#quick-result').hidden = true; $('#quick-setup').hidden = false; controls.setSessionActive(false); updateResume(); return true;
  }
  function updateResume() { $('#quick-resume-box').hidden = !active; if (active) $('#quick-resume-text').textContent = `${game.title} · Runde ${active.round} von ${active.targetRounds}`; }
  function conceal() { if (!active || active.phase !== 'card') return; flushDraft(); rememberTimer(); controls.stopTimer(); active.phase = 'ready'; save(); render(); }
  function resume() { if (!active) return; active.phase = 'ready'; save(); controls.setSessionActive(true); showPlay(); render(); }
  $('#quick-round-title').tabIndex = -1;
  document.title = `Secret Circle – ${game.title}`;
  for (const [selector, value] of [['#quick-title', game.title], ['#quick-icon', game.icon], ['#quick-group', game.group], ['#quick-description', game.description], ['#quick-player-range', `${game.minPlayers}–${game.maxPlayers} Personen`], ['#quick-duration', `ca. ${game.duration} Minuten`], ['#quick-content-count', `${C.itemCount(gameId)} Vorlagen`]]) $(selector).textContent = value;
  for (const name of C.getPackNames(gameId)) $('#quick-pack').add(new Option(name, name));
  for (const rule of game.instructions) $('#quick-rules').append(node('li', '', rule));
  if (gameId === 'three-rounds') $('#quick-skip').textContent = 'Teamzug überspringen';
  if (gameId === 'three-rounds') document.querySelector('label[for="quick-rounds"]').firstChild.textContent = 'Begriffe pro Stapel ';
  $('#quick-start').addEventListener('click', start); $('#quick-resume').addEventListener('click', resume); $('#quick-discard').addEventListener('click', discard);
  addEventListener('blur', conceal); addEventListener('pagehide', conceal); addEventListener('pageshow', event => { if (event.persisted) conceal(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden) conceal(); });
  updateResume(); controls.updateNextGame(C, gameId);
  if ('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js').catch(() => status('Offline-Modus konnte nicht aktiviert werden.', true));
})();
