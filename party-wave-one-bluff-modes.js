'use strict';

(() => {
  const C = window.SecretCirclePartyCatalog;
  const L = window.SecretCircleSessionLedger;
  const S = window.SecretCircleSessionControls;
  if (!C || !L || !S) throw new Error('Gemeinsame Runtime für Bluff Trivia fehlt.');

  const HUB_KEY = 'secret-circle-party-hub-v1';
  const ACTIVE_KEY = 'secret-circle-party-quick-active-v1';
  const VERSION = 1;
  const MAX_HISTORY = L.maximumHistory;
  const ALLOWED = new Set(C.waveOneBluffGameIds || []);
  const $ = selector => document.querySelector(selector);
  const gameId = new URLSearchParams(location.search).get('game') || '';
  const game = C.getGame(gameId);

  let hub = loadHub();
  let active = loadActive();
  let entryVisible = false;
  let voteVisible = false;

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
  const clean = (value, maximum = 100) => String(value ?? '').normalize('NFKC').trim().replace(/\s+/g, ' ').slice(0, maximum);
  const keyText = value => clean(value, 100).toLocaleLowerCase('de-DE');

  function cleanPlayers(value) {
    const result = [];
    const seen = new Set();
    for (const raw of Array.isArray(value) ? value : []) {
      const name = clean(raw, 32);
      const key = name.toLocaleLowerCase('de-DE');
      if (!name || seen.has(key)) continue;
      seen.add(key);
      result.push(name);
      if (result.length >= 10) break;
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

  function shuffledIndexes(length) {
    const result = Array.from({ length }, (_, index) => index);
    for (let index = result.length - 1; index > 0; index -= 1) {
      const swap = randomInt(index + 1);
      [result[index], result[swap]] = [result[swap], result[index]];
    }
    return result;
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

  function normalizeOrder(value, length) {
    if (!Array.isArray(value) || value.length !== length) return null;
    const order = value.map(Number);
    if (!order.every(Number.isInteger) || new Set(order).size !== length) return null;
    if (order.some(index => index < 0 || index >= length)) return null;
    return order;
  }

  function candidateList(item, fakes) {
    return [{ text: item.answer, author: null, correct: true }, ...fakes.map(fake => ({ text: fake.text, author: fake.player, correct: false }))];
  }

  function normalizeCurrent(value, players, pack, phase, used) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
    const items = C.getItems(gameId, pack);
    const cardIndex = Number(value.cardIndex);
    if (!Number.isInteger(cardIndex) || cardIndex < 0 || cardIndex >= items.length || !used.includes(cardIndex)) return null;
    const item = items[cardIndex];
    const entryIndex = Number(value.entryIndex);
    if (!Number.isInteger(entryIndex) || entryIndex < 0 || entryIndex > players.length) return null;
    if (!Array.isArray(value.fakes) || value.fakes.length !== entryIndex) return null;
    const fakes = [];
    const fakeKeys = new Set();
    const answerKey = keyText(item.answer);
    for (let index = 0; index < value.fakes.length; index += 1) {
      const raw = value.fakes[index];
      if (!raw || typeof raw !== 'object' || raw.player !== players[index]) return null;
      const text = clean(raw.text, 80);
      const key = keyText(text);
      if (!text || key === answerKey || fakeKeys.has(key)) return null;
      fakeKeys.add(key);
      fakes.push({ player: players[index], text });
    }

    const candidateCount = players.length + 1;
    const order = entryIndex === players.length ? normalizeOrder(value.order, candidateCount) : Array.isArray(value.order) && value.order.length === 0 ? [] : null;
    if (!order) return null;
    const voteIndex = Number(value.voteIndex);
    if (!Number.isInteger(voteIndex) || voteIndex < 0 || voteIndex > players.length) return null;
    if (!Array.isArray(value.votes) || value.votes.length !== voteIndex) return null;
    const candidates = candidateList(item, fakes);
    const votes = [];
    for (let index = 0; index < value.votes.length; index += 1) {
      const raw = value.votes[index];
      const voter = players[index];
      const candidateIndex = Number(raw?.candidateIndex);
      if (!raw || raw.voter !== voter || !Number.isInteger(candidateIndex) || candidateIndex < 0 || candidateIndex >= candidates.length) return null;
      if (candidates[candidateIndex].author === voter) return null;
      votes.push({ voter, candidateIndex });
    }
    const scored = Boolean(value.scored);
    if (phase === 'collect' && (entryIndex >= players.length || order.length || voteIndex !== 0 || votes.length || scored)) return null;
    if (phase === 'vote' && (entryIndex !== players.length || voteIndex >= players.length || scored)) return null;
    if (phase === 'result' && (entryIndex !== players.length || voteIndex !== players.length || !scored)) return null;
    return { cardIndex, entryIndex, fakes, order, voteIndex, votes, scored };
  }

  function normalizeUsed(value, itemCount) {
    if (!Array.isArray(value)) return null;
    const used = value.map(Number);
    if (!used.every(Number.isInteger) || used.some(index => index < 0 || index >= itemCount) || new Set(used).size !== used.length) return null;
    return used;
  }

  function validActive(value) {
    if (!value || value.version !== VERSION || value.gameId !== gameId || gameId !== 'bluff-trivia') return null;
    if (![3, 5, 10, 20].includes(value.targetRounds)) return null;
    if (!Number.isInteger(value.round) || value.round < 1 || value.round > value.targetRounds) return null;
    const players = cleanPlayers(value.players);
    if (!Array.isArray(value.players) || players.length !== value.players.length || players.length < 3 || players.length > 10) return null;
    const pack = clean(value.pack, 60);
    const items = C.getItems(gameId, pack);
    if (!C.getPackNames(gameId).includes(pack) || !items.length) return null;
    const used = normalizeUsed(value.used, items.length);
    if (!used) return null;
    const phase = String(value.phase || 'collect');
    if (!['collect', 'vote', 'result'].includes(phase)) return null;
    const current = normalizeCurrent(value.current, players, pack, phase, used);
    if (!current) return null;
    const startedAt = String(value.startedAt || new Date().toISOString());
    return {
      version: VERSION, gameId, sessionId: L.normalizeSessionId(value.sessionId) || L.legacySessionId(gameId, startedAt, value.targetRounds),
      pack, targetRounds: value.targetRounds, round: value.round,
      totalScore: Number.isInteger(value.totalScore) ? Math.max(0, value.totalScore) : 0,
      scores: value.scores && typeof value.scores === 'object' && !Array.isArray(value.scores) ? value.scores : {},
      used, current, phase, players, startedAt, completedRecorded: Boolean(value.completedRecorded)
    };
  }

  function loadActive() { try { return validActive(JSON.parse(localStorage.getItem(ACTIVE_KEY))); } catch { return null; } }
  function saveActive() {
    try { if (active) localStorage.setItem(ACTIVE_KEY, JSON.stringify(active)); else localStorage.removeItem(ACTIVE_KEY); return true; }
    catch { setStatus('Die aktive Bluff-Session konnte nicht gespeichert werden.', true); return false; }
  }
  function saveHub(nextHub) {
    const previous = localStorage.getItem(HUB_KEY);
    try { localStorage.setItem(HUB_KEY, JSON.stringify(nextHub)); hub = nextHub; return true; }
    catch {
      try { if (previous === null) localStorage.removeItem(HUB_KEY); else localStorage.setItem(HUB_KEY, previous); } catch {}
      setStatus('Der Verlauf konnte nicht sicher gespeichert werden.', true); return false;
    }
  }
  function setStatus(message, error = false) { const node = $('#quick-status'); if (node) { node.textContent = message || ''; node.classList.toggle('error', error); } }
  function clearNode(node) { while (node?.firstChild) node.firstChild.remove(); }
  function element(tag, className, text) { const node = document.createElement(tag); if (className) node.className = className; if (text !== undefined) node.textContent = text; return node; }
  function button(text, handler, className = '') { const node = element('button', className, text); node.type = 'button'; node.addEventListener('click', handler); return node; }

  function pickCardIndex(items) {
    if (!items.length) return null;
    if (active.used.length >= items.length) active.used = [];
    const available = items.map((_, index) => index).filter(index => !active.used.includes(index));
    const cardIndex = available[randomInt(available.length)]; active.used.push(cardIndex); return cardIndex;
  }
  function createRound() {
    const cardIndex = pickCardIndex(C.getItems(gameId, active.pack));
    return Number.isInteger(cardIndex) ? { cardIndex, entryIndex: 0, fakes: [], order: [], voteIndex: 0, votes: [], scored: false } : null;
  }
  function currentItem() { return C.getItems(gameId, active.pack)[active.current.cardIndex]; }
  function currentEntryPlayer() { return active.players[active.current.entryIndex] || ''; }
  function currentVoter() { return active.players[active.current.voteIndex] || ''; }

  function resetRoundUi() {
    clearNode($('#quick-content')); clearNode($('#quick-controls')); clearNode($('#quick-actions'));
    $('#quick-private-note').hidden = true; $('#quick-eyebrow').textContent = active.pack; $('#quick-round-title').textContent = game.title;
    $('#quick-progress').textContent = `Runde ${active.round} von ${active.targetRounds}`; $('#quick-score').textContent = `${active.totalScore} Punkte`;
    $('#quick-progress-bar').style.width = `${Math.round(((active.round - 1) / active.targetRounds) * 100)}%`;
  }

  function concealPrivate() {
    if (!entryVisible && !voteVisible) return false;
    entryVisible = false; voteVisible = false;
    if (active && ['collect', 'vote'].includes(active.phase)) renderRound();
    return true;
  }

  function submitFake() {
    const player = currentEntryPlayer();
    const text = clean($('#quick-bluff-input')?.value, 80);
    const item = currentItem();
    const key = keyText(text);
    if (!text) return setStatus('Gib eine kurze Fake-Antwort ein.', true);
    if (key === keyText(item.answer)) return setStatus('Das ist die richtige Antwort. Erfinde eine andere Fake-Antwort.', true);
    if (active.current.fakes.some(fake => keyText(fake.text) === key)) return setStatus('Diese Fake-Antwort gibt es schon. Erfinde eine andere.', true);
    active.current.fakes.push({ player, text }); active.current.entryIndex += 1; entryVisible = false; setStatus('');
    if (active.current.entryIndex >= active.players.length) {
      active.current.order = shuffledIndexes(active.players.length + 1); active.phase = 'vote';
    }
    if (!saveActive()) return; renderRound();
  }

  function renderCollect() {
    const player = currentEntryPlayer(); const item = currentItem();
    $('#quick-player').textContent = `Gerät an ${player} geben`; $('#quick-private-note').hidden = false;
    $('#quick-private-note').textContent = 'Nur die genannte Person darf ihre Fake-Antwort eingeben.';
    if (!entryVisible) {
      $('#quick-content').append(element('div', 'challenge-card', `Bereit, ${player}?`));
      $('#quick-actions').append(button('Fake-Antwort eingeben', () => { entryVisible = true; renderRound(); })); return;
    }
    $('#quick-content').append(element('div', 'challenge-card', item.question));
    const input = document.createElement('input'); input.id = 'quick-bluff-input'; input.maxLength = 80; input.autocomplete = 'off';
    input.setAttribute('aria-label', `Private Fake-Antwort von ${player}`); input.placeholder = 'Glaubwürdige falsche Antwort …';
    $('#quick-controls').append(input); $('#quick-actions').append(button('Speichern & verdecken', submitFake)); input.focus();
  }

  function roundScores() {
    const item = currentItem(); const candidates = candidateList(item, active.current.fakes); const scores = {};
    for (const vote of active.current.votes) {
      const candidate = candidates[vote.candidateIndex];
      if (candidate.correct) scores[vote.voter] = (scores[vote.voter] || 0) + 2;
      else if (candidate.author) scores[candidate.author] = (scores[candidate.author] || 0) + 1;
    }
    return scores;
  }

  function finishVotingScore() {
    if (active.current.scored) return;
    const awarded = roundScores();
    for (const [player, points] of Object.entries(awarded)) {
      active.scores[player] = (Number(active.scores[player]) || 0) + points; active.totalScore += points;
    }
    active.current.scored = true; active.phase = 'result';
  }

  function castVote(candidateIndex) {
    if (active.phase !== 'vote') return;
    const voter = currentVoter(); const candidates = candidateList(currentItem(), active.current.fakes);
    const candidate = candidates[candidateIndex];
    if (!voter || !candidate || candidate.author === voter) return;
    active.current.votes.push({ voter, candidateIndex }); active.current.voteIndex += 1; voteVisible = false;
    if (active.current.voteIndex >= active.players.length) finishVotingScore();
    if (!saveActive()) return; renderRound();
  }

  function renderVote() {
    const voter = currentVoter(); const item = currentItem(); const candidates = candidateList(item, active.current.fakes);
    $('#quick-player').textContent = `Gerät an ${voter} geben`; $('#quick-private-note').hidden = false;
    $('#quick-private-note').textContent = 'Nur die genannte Person darf abstimmen.';
    if (!voteVisible) {
      $('#quick-content').append(element('div', 'challenge-card', `${voter} stimmt als Nächstes ab.`));
      $('#quick-actions').append(button('Antworten anzeigen', () => { voteVisible = true; renderRound(); })); return;
    }
    $('#quick-content').append(element('div', 'challenge-card', item.question));
    for (const candidateIndex of active.current.order) {
      const candidate = candidates[candidateIndex];
      if (candidate.author === voter) continue;
      $('#quick-actions').append(button(candidate.text, () => castVote(candidateIndex), 'secondary'));
    }
  }

  function renderResult() {
    const item = currentItem(); const candidates = candidateList(item, active.current.fakes);
    $('#quick-player').textContent = 'Runde aufgelöst';
    $('#quick-content').append(element('div', 'challenge-card', item.question), element('p', 'success-text', `Richtige Antwort: ${item.answer}`), element('p', 'muted', item.explanation));
    const counts = Object.fromEntries(candidates.map((_, index) => [index, 0]));
    active.current.votes.forEach(vote => { counts[vote.candidateIndex] += 1; });
    const list = element('ul', 'category-list');
    active.current.order.forEach(index => {
      const candidate = candidates[index];
      list.append(element('li', '', candidate.correct ? `${candidate.text} — richtig · ${counts[index]} Stimmen` : `${candidate.text} — von ${candidate.author} · ${counts[index]} Stimmen`));
    });
    $('#quick-content').append(list);
    $('#quick-actions').append(button(active.round >= active.targetRounds ? 'Session abschließen' : 'Nächste Bluff-Frage', nextRound));
  }

  function renderRound() { if (!active) return; resetRoundUi(); if (active.phase === 'collect') return renderCollect(); if (active.phase === 'vote') return renderVote(); return renderResult(); }

  function startSession() {
    if (!game || !ALLOWED.has(game.id)) return; hub = loadHub();
    if (hub.players.length < 3 || hub.players.length > 10) return setStatus('Bluff Trivia benötigt 3–10 Personen. Passe die Gruppe im Party Hub an.', true);
    const pack = $('#quick-pack').value || C.getPackNames(game.id)[0]; const targetRounds = Number($('#quick-rounds').value);
    if (!C.getPackNames(game.id).includes(pack) || ![3,5,10,20].includes(targetRounds)) return setStatus('Kategorie oder Rundenzahl ist ungültig.', true);
    active = { version: VERSION, gameId, sessionId: L.createSessionId(gameId), pack, targetRounds, round: 1, totalScore: 0, scores: {}, used: [], current: null, phase: 'collect', players: clone(hub.players), startedAt: new Date().toISOString(), completedRecorded: false };
    active.current = createRound(); if (!active.current || !saveActive()) return;
    sessionControls.setSessionActive(true); $('#quick-setup').hidden = true; $('#quick-result').hidden = true; $('#quick-play').hidden = false; renderRound();
  }
  function nextRound() {
    entryVisible = false; voteVisible = false; if (!active) return; if (active.round >= active.targetRounds) return finishSession();
    active.round += 1; active.phase = 'collect'; active.current = createRound(); if (!active.current || !saveActive()) return; renderRound();
  }
  function finishSession() {
    if (!active) return;
    if (!active.completedRecorded) {
      const result = L.recordCompletion(loadHub(), { id: L.completionId('wave1-bluff', game.id, active.sessionId), gameId, title: game.title, endedAt: new Date().toISOString(), rounds: active.targetRounds, score: active.totalScore });
      if (result.recorded && !saveHub(result.hub)) return; active.completedRecorded = true; if (!saveActive()) return;
    }
    const final = clone(active); active = null; if (!saveActive()) { active = final; return; }
    sessionControls.setSessionActive(false); sessionControls.updateNextGame(C, game.id); $('#quick-play').hidden = true; $('#quick-result').hidden = false;
    $('#quick-final-score').textContent = String(final.totalScore); const ranking = Object.entries(final.scores).sort((a,b) => b[1]-a[1]);
    $('#quick-result-text').textContent = ranking.length ? `Rangliste: ${ranking.map(([name,score]) => `${name} ${score}`).join(' · ')}` : `${final.targetRounds} Runden wurden lokal gespeichert.`; $('#quick-replay').focus();
  }
  function discardActive() { entryVisible=false; voteVisible=false; if (!active) { sessionControls.setSessionActive(false); updateResume(); return true; } const previous=clone(active); active=null; if (!saveActive()) { active=previous; return false; } sessionControls.setSessionActive(false); updateResume(); return true; }
  function abortSession() { if (!active || !discardActive()) return false; $('#quick-play').hidden=true; $('#quick-result').hidden=true; $('#quick-setup').hidden=false; $('#quick-start').focus(); return true; }
  function replaySession() { $('#quick-result').hidden=true; $('#quick-setup').hidden=false; startSession(); }
  function updateResume() { const box=$('#quick-resume-box'); box.hidden=!active; if (active) $('#quick-resume-text').textContent=`${game.title} · Runde ${active.round} von ${active.targetRounds}`; }
  function resumeSession() { if (!active) return; entryVisible=false; voteVisible=false; sessionControls.setSessionActive(true); $('#quick-setup').hidden=true; $('#quick-result').hidden=true; $('#quick-play').hidden=false; renderRound(); $('#quick-pause').focus(); }

  function initialize() {
    if (!game || !ALLOWED.has(game.id) || game.status !== 'playable') { $('#quick-setup').innerHTML='<h1>Spiel nicht verfügbar</h1><p>Bluff Trivia ist noch nicht freigeschaltet.</p><a class="ghost-button" href="party.html">Zum Party Hub</a>'; return; }
    document.title=`Secret Circle – ${game.title}`; $('#quick-icon').textContent=game.icon; $('#quick-group').textContent=`${game.group} · Labs`; $('#quick-title').textContent=game.title; $('#quick-description').textContent=game.description;
    $('#quick-player-range').textContent=`${game.minPlayers}–${game.maxPlayers} Personen`; $('#quick-duration').textContent=`ca. ${game.duration} Minuten`; $('#quick-content-count').textContent=`${C.itemCount(game.id)} Karten`;
    C.getPackNames(game.id).forEach(name => $('#quick-pack').add(new Option(`${name} (${C.getItems(game.id,name).length})`,name))); game.instructions.forEach(rule => $('#quick-rules').append(element('li','',rule)));
    updateResume(); sessionControls.updateNextGame(C,game.id); $('#quick-start').addEventListener('click',startSession); $('#quick-resume').addEventListener('click',resumeSession); $('#quick-discard').addEventListener('click',discardActive);
    const updateConnection=()=>{$('#quick-connection').textContent=navigator.onLine?'Online':'Offline-Modus';}; addEventListener('online',updateConnection); addEventListener('offline',updateConnection); updateConnection();
    if ('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js').catch(()=>setStatus('Offline-Modus konnte nicht aktiviert werden.',true));
  }

  addEventListener('blur', concealPrivate);
  addEventListener('pagehide', () => { concealPrivate(); if (active) saveActive(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden) concealPrivate(); });
  initialize();
})();
