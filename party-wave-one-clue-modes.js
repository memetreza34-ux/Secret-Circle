'use strict';

(() => {
  const C = window.SecretCirclePartyCatalog;
  const L = window.SecretCircleSessionLedger;
  const S = window.SecretCircleSessionControls;
  if (!C || !L || !S) throw new Error('Gemeinsame Runtime für Ein-Wort-Hinweis fehlt.');

  const HUB_KEY = 'secret-circle-party-hub-v1';
  const ACTIVE_KEY = 'secret-circle-party-quick-active-v1';
  const VERSION = 1;
  const MAX_HISTORY = L.maximumHistory;
  const ALLOWED = new Set(C.waveOneClueGameIds || []);
  const $ = selector => document.querySelector(selector);
  const gameId = new URLSearchParams(location.search).get('game') || '';
  const game = C.getGame(gameId);

  let hub = loadHub();
  let active = loadActive();
  let secretVisible = false;

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
  const clean = (value, maximum = 80) => String(value ?? '').normalize('NFKC').trim().replace(/\s+/g, ' ').slice(0, maximum);
  const keyText = value => clean(value, 80).toLocaleLowerCase('de-DE');

  function cleanPlayers(value) {
    const result = [];
    const seen = new Set();
    for (const raw of Array.isArray(value) ? value : []) {
      const name = clean(raw, 32); const key = name.toLocaleLowerCase('de-DE');
      if (!name || seen.has(key)) continue;
      seen.add(key); result.push(name);
      if (result.length >= 20) break;
    }
    return result;
  }

  function loadHub() {
    try {
      const value = JSON.parse(localStorage.getItem(HUB_KEY));
      if (!value || value.version !== 1) throw new Error('invalid');
      return { ...value, players: cleanPlayers(value.players), recent: Array.isArray(value.recent) ? value.recent.filter(id => C.getGame(id)).slice(0, 8) : [], history: Array.isArray(value.history) ? value.history.slice(0, MAX_HISTORY) : [], stats: value.stats && typeof value.stats === 'object' && !Array.isArray(value.stats) ? value.stats : {} };
    } catch {
      return { version: 1, players: ['Alex', 'Sam', 'Mika', 'Lina'], favorites: [], recent: [], presets: [], history: [], stats: {} };
    }
  }

  function validClue(value, target) {
    if (value === null) return null;
    const clue = clean(value, 30);
    if (!clue || /\s/.test(clue) || keyText(clue) === keyText(target)) return false;
    return clue;
  }

  function normalizeUsed(value, itemCount) {
    if (!Array.isArray(value)) return null;
    const used = value.map(Number);
    if (!used.every(Number.isInteger) || used.some(index => index < 0 || index >= itemCount) || new Set(used).size !== used.length) return null;
    return used;
  }

  function normalizeCurrent(value, pack, phase, used) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
    const items = C.getItems(gameId, pack);
    const cardIndex = Number(value.cardIndex);
    if (!Number.isInteger(cardIndex) || cardIndex < 0 || cardIndex >= items.length || !used.includes(cardIndex)) return null;
    const target = clean(items[cardIndex], 60);
    if (!target) return null;
    const clueResult = validClue(value.clue === undefined ? null : value.clue, target);
    if (clueResult === false) return null;
    const clue = clueResult;
    const success = value.success === null || value.success === undefined ? null : value.success;
    if (success !== null && typeof success !== 'boolean') return null;
    const scored = Boolean(value.scored);
    if (phase === 'clue' && (clue !== null || success !== null || scored)) return null;
    if (phase === 'guess' && (clue === null || success !== null || scored)) return null;
    if (phase === 'result' && (clue === null || success === null || !scored)) return null;
    return { cardIndex, clue, success, scored };
  }

  function validActive(value) {
    if (!value || value.version !== VERSION || value.gameId !== gameId || gameId !== 'password-one-word') return null;
    if (![3, 5, 10, 20].includes(value.targetRounds)) return null;
    if (!Number.isInteger(value.round) || value.round < 1 || value.round > value.targetRounds) return null;
    const players = cleanPlayers(value.players);
    if (!Array.isArray(value.players) || players.length !== value.players.length || players.length < 3 || players.length > 20) return null;
    const pack = clean(value.pack, 60); const items = C.getItems(gameId, pack);
    if (!C.getPackNames(gameId).includes(pack) || !items.length) return null;
    const used = normalizeUsed(value.used, items.length); if (!used) return null;
    const phase = String(value.phase || 'clue'); if (!['clue', 'guess', 'result'].includes(phase)) return null;
    const current = normalizeCurrent(value.current, pack, phase, used); if (!current) return null;
    const playerIndex = Number(value.playerIndex);
    if (!Number.isInteger(playerIndex) || playerIndex < 0 || playerIndex >= players.length) return null;
    const startedAt = String(value.startedAt || new Date().toISOString());
    return { version: VERSION, gameId, sessionId: L.normalizeSessionId(value.sessionId) || L.legacySessionId(gameId, startedAt, value.targetRounds), pack, targetRounds: value.targetRounds, round: value.round, totalScore: Number.isInteger(value.totalScore) ? Math.max(0, value.totalScore) : 0, scores: value.scores && typeof value.scores === 'object' && !Array.isArray(value.scores) ? value.scores : {}, playerIndex, used, current, phase, players, startedAt, completedRecorded: Boolean(value.completedRecorded) };
  }

  function loadActive() { try { return validActive(JSON.parse(localStorage.getItem(ACTIVE_KEY))); } catch { return null; } }
  function saveActive() { try { if (active) localStorage.setItem(ACTIVE_KEY, JSON.stringify(active)); else localStorage.removeItem(ACTIVE_KEY); return true; } catch { setStatus('Die aktive Hinweis-Session konnte nicht gespeichert werden.', true); return false; } }
  function saveHub(nextHub) {
    const previous = localStorage.getItem(HUB_KEY);
    try { localStorage.setItem(HUB_KEY, JSON.stringify(nextHub)); hub = nextHub; return true; }
    catch { try { if (previous === null) localStorage.removeItem(HUB_KEY); else localStorage.setItem(HUB_KEY, previous); } catch {} setStatus('Der Verlauf konnte nicht sicher gespeichert werden.', true); return false; }
  }
  function setStatus(message, error = false) { const node = $('#quick-status'); if (node) { node.textContent = message || ''; node.classList.toggle('error', error); } }
  function clearNode(node) { while (node?.firstChild) node.firstChild.remove(); }
  function element(tag, className, text) { const node = document.createElement(tag); if (className) node.className = className; if (text !== undefined) node.textContent = text; return node; }
  function button(text, handler, className = '') { const node = element('button', className, text); node.type = 'button'; node.addEventListener('click', handler); return node; }
  function randomInt(maximum) { if (!Number.isInteger(maximum) || maximum <= 0) return 0; if (crypto?.getRandomValues) { const values = new Uint32Array(1); crypto.getRandomValues(values); return values[0] % maximum; } return Math.floor(Math.random() * maximum); }

  function pickCardIndex(items) {
    if (!items.length) return null;
    if (active.used.length >= items.length) active.used = [];
    const available = items.map((_, index) => index).filter(index => !active.used.includes(index));
    const cardIndex = available[randomInt(available.length)]; active.used.push(cardIndex); return cardIndex;
  }
  function createRound() { const cardIndex = pickCardIndex(C.getItems(gameId, active.pack)); return Number.isInteger(cardIndex) ? { cardIndex, clue: null, success: null, scored: false } : null; }
  function currentPlayer() { return active.players[active.playerIndex] || 'Aktive Person'; }
  function currentTarget() { return clean(C.getItems(gameId, active.pack)[active.current.cardIndex], 60); }

  function resetRoundUi() {
    clearNode($('#quick-content')); clearNode($('#quick-controls')); clearNode($('#quick-actions')); $('#quick-private-note').hidden = true;
    $('#quick-eyebrow').textContent = active.pack; $('#quick-round-title').textContent = game.title; $('#quick-progress').textContent = `Runde ${active.round} von ${active.targetRounds}`; $('#quick-score').textContent = `${active.totalScore} Punkte`; $('#quick-progress-bar').style.width = `${Math.round(((active.round - 1) / active.targetRounds) * 100)}%`;
  }

  function concealSecret() {
    if (!secretVisible) return false;
    secretVisible = false;
    if (active?.phase === 'clue') renderRound();
    return true;
  }

  function submitClue() {
    const target = currentTarget(); const clue = clean($('#quick-clue-input')?.value, 30);
    if (!clue) return setStatus('Gib genau ein Hinweiswort ein.', true);
    if (/\s/.test(clue)) return setStatus('Der Hinweis darf nur aus einem Wort bestehen.', true);
    if (keyText(clue) === keyText(target)) return setStatus('Das Zielwort selbst darf nicht als Hinweis verwendet werden.', true);
    active.current.clue = clue; active.phase = 'guess'; secretVisible = false; setStatus('');
    if (!saveActive()) return; renderRound();
  }

  function renderClue() {
    const player = currentPlayer(); $('#quick-player').textContent = `Gerät an ${player} geben`; $('#quick-private-note').hidden = false;
    $('#quick-private-note').textContent = 'Nur die genannte Person darf das Zielwort sehen und den Hinweis eingeben.';
    if (!secretVisible) {
      $('#quick-content').append(element('div', 'challenge-card', `Bereit, ${player}?`));
      $('#quick-actions').append(button('Zielwort anzeigen', () => { secretVisible = true; renderRound(); })); return;
    }
    $('#quick-content').append(element('p', 'eyebrow', 'Dein Zielwort'), element('div', 'challenge-card', currentTarget()), element('p', 'muted', 'Gib genau ein anderes Hinweiswort ein.'));
    const input = document.createElement('input'); input.id = 'quick-clue-input'; input.maxLength = 30; input.autocomplete = 'off'; input.setAttribute('aria-label', `Ein-Wort-Hinweis von ${player}`); input.placeholder = 'Ein Hinweiswort …';
    $('#quick-controls').append(input); $('#quick-actions').append(button('Hinweis speichern & verdecken', submitClue)); input.focus();
  }

  function resolveGuess(success) {
    if (active.phase !== 'guess' || typeof success !== 'boolean') return;
    active.current.success = success; active.current.scored = true; active.phase = 'result';
    if (success) { active.totalScore += 1; active.scores[currentPlayer()] = (Number(active.scores[currentPlayer()]) || 0) + 1; }
    if (!saveActive()) return; renderRound();
  }

  function renderGuess() {
    $('#quick-player').textContent = 'Die Gruppe rät gemeinsam';
    $('#quick-content').append(element('p', 'eyebrow', 'Ein-Wort-Hinweis'), element('div', 'challenge-card', active.current.clue));
    $('#quick-actions').append(button('Erraten', () => resolveGuess(true)), button('Nicht erraten', () => resolveGuess(false), 'secondary'));
  }

  function renderResult() {
    $('#quick-player').textContent = 'Runde aufgelöst';
    $('#quick-content').append(element('p', active.current.success ? 'success-text' : 'muted', active.current.success ? 'Richtig geraten · +1 Punkt' : 'Nicht erraten'), element('div', 'challenge-card', `Zielwort: ${currentTarget()}`), element('p', '', `Hinweis: ${active.current.clue}`));
    $('#quick-actions').append(button(active.round >= active.targetRounds ? 'Session abschließen' : 'Nächstes Zielwort', nextRound));
  }

  function renderRound() { if (!active) return; resetRoundUi(); if (active.phase === 'clue') return renderClue(); if (active.phase === 'guess') return renderGuess(); return renderResult(); }

  function startSession() {
    if (!game || !ALLOWED.has(game.id)) return; hub = loadHub();
    if (hub.players.length < 3 || hub.players.length > 20) return setStatus('Ein-Wort-Hinweis benötigt 3–20 Personen. Passe die Gruppe im Party Hub an.', true);
    const pack = $('#quick-pack').value || C.getPackNames(game.id)[0]; const targetRounds = Number($('#quick-rounds').value);
    if (!C.getPackNames(game.id).includes(pack) || ![3,5,10,20].includes(targetRounds)) return setStatus('Kategorie oder Rundenzahl ist ungültig.', true);
    active = { version: VERSION, gameId, sessionId: L.createSessionId(gameId), pack, targetRounds, round: 1, totalScore: 0, scores: {}, playerIndex: 0, used: [], current: null, phase: 'clue', players: clone(hub.players), startedAt: new Date().toISOString(), completedRecorded: false };
    active.current = createRound(); if (!active.current || !saveActive()) return;
    sessionControls.setSessionActive(true); $('#quick-setup').hidden = true; $('#quick-result').hidden = true; $('#quick-play').hidden = false; renderRound();
  }
  function nextRound() {
    secretVisible = false; if (!active) return; if (active.round >= active.targetRounds) return finishSession();
    active.round += 1; active.playerIndex = (active.playerIndex + 1) % active.players.length; active.phase = 'clue'; active.current = createRound(); if (!active.current || !saveActive()) return; renderRound();
  }
  function finishSession() {
    if (!active) return;
    if (!active.completedRecorded) {
      const result = L.recordCompletion(loadHub(), { id: L.completionId('wave1-clue', game.id, active.sessionId), gameId, title: game.title, endedAt: new Date().toISOString(), rounds: active.targetRounds, score: active.totalScore });
      if (result.recorded && !saveHub(result.hub)) return; active.completedRecorded = true; if (!saveActive()) return;
    }
    const final=clone(active); active=null; if (!saveActive()) { active=final; return; }
    sessionControls.setSessionActive(false); sessionControls.updateNextGame(C,game.id); $('#quick-play').hidden=true; $('#quick-result').hidden=false; $('#quick-final-score').textContent=String(final.totalScore);
    const ranking=Object.entries(final.scores).sort((a,b)=>b[1]-a[1]); $('#quick-result-text').textContent=ranking.length?`Rangliste: ${ranking.map(([name,score])=>`${name} ${score}`).join(' · ')}`:`${final.targetRounds} Runden wurden lokal gespeichert.`; $('#quick-replay').focus();
  }
  function discardActive() { secretVisible=false; if (!active) { sessionControls.setSessionActive(false); updateResume(); return true; } const previous=clone(active); active=null; if (!saveActive()) { active=previous; return false; } sessionControls.setSessionActive(false); updateResume(); return true; }
  function abortSession() { if (!active || !discardActive()) return false; $('#quick-play').hidden=true; $('#quick-result').hidden=true; $('#quick-setup').hidden=false; $('#quick-start').focus(); return true; }
  function replaySession() { $('#quick-result').hidden=true; $('#quick-setup').hidden=false; startSession(); }
  function updateResume() { const box=$('#quick-resume-box'); box.hidden=!active; if (active) $('#quick-resume-text').textContent=`${game.title} · Runde ${active.round} von ${active.targetRounds}`; }
  function resumeSession() { if (!active) return; secretVisible=false; sessionControls.setSessionActive(true); $('#quick-setup').hidden=true; $('#quick-result').hidden=true; $('#quick-play').hidden=false; renderRound(); $('#quick-pause').focus(); }

  function initialize() {
    if (!game || !ALLOWED.has(game.id) || game.status !== 'playable') { $('#quick-setup').innerHTML='<h1>Spiel nicht verfügbar</h1><p>Ein-Wort-Hinweis ist noch nicht freigeschaltet.</p><a class="ghost-button" href="party.html">Zum Party Hub</a>'; return; }
    document.title=`Secret Circle – ${game.title}`; $('#quick-icon').textContent=game.icon; $('#quick-group').textContent=`${game.group} · Labs`; $('#quick-title').textContent=game.title; $('#quick-description').textContent=game.description;
    $('#quick-player-range').textContent=`${game.minPlayers}–${game.maxPlayers} Personen`; $('#quick-duration').textContent=`ca. ${game.duration} Minuten`; $('#quick-content-count').textContent=`${C.itemCount(game.id)} Karten`;
    C.getPackNames(game.id).forEach(name=>$('#quick-pack').add(new Option(`${name} (${C.getItems(game.id,name).length})`,name))); game.instructions.forEach(rule=>$('#quick-rules').append(element('li','',rule)));
    updateResume(); sessionControls.updateNextGame(C,game.id); $('#quick-start').addEventListener('click',startSession); $('#quick-resume').addEventListener('click',resumeSession); $('#quick-discard').addEventListener('click',discardActive);
    const updateConnection=()=>{$('#quick-connection').textContent=navigator.onLine?'Online':'Offline-Modus';}; addEventListener('online',updateConnection); addEventListener('offline',updateConnection); updateConnection();
    if ('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js').catch(()=>setStatus('Offline-Modus konnte nicht aktiviert werden.',true));
  }

  addEventListener('blur', concealSecret);
  addEventListener('pagehide', () => { concealSecret(); if (active) saveActive(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden) concealSecret(); });
  initialize();
})();
