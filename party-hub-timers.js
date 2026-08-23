'use strict';

(() => {
  const TIMER_KINDS = new Set(['charades', 'taboo', 'hot-potato', 'word-chain']);
  const HOT_POTATO_MIN_MS = 10_000;
  const HOT_POTATO_MAX_MS = 25_000;
  const HOT_POTATO_RANGE_MS = HOT_POTATO_MAX_MS - HOT_POTATO_MIN_MS + 1;

  function normalizeTimerState(value, helpers) {
    const { safeInteger, cleanText } = helpers || {};
    if (typeof safeInteger !== 'function' || typeof cleanText !== 'function') {
      throw new TypeError('Hub-Timer-Normalisierung benötigt safeInteger und cleanText.');
    }
    if (!value || typeof value !== 'object' || Array.isArray(value) || !TIMER_KINDS.has(value.kind)) return null;
    const phase = value.phase === 'ended' ? 'ended' : 'running';
    return {
      kind: value.kind,
      phase,
      remainingMs: phase === 'running' ? Math.max(250, Math.min(3_600_000, Number(value.remainingMs) || 0)) : 0,
      roundScore: safeInteger(value.roundScore, 10_000),
      item: cleanText(value.item, 240),
      prompt: cleanText(value.prompt, 400),
      letter: cleanText(value.letter, 12),
      word: cleanText(value.word, 120),
      banned: Array.isArray(value.banned) ? value.banned.slice(0, 12).map(item => cleanText(item, 80)).filter(Boolean) : []
    };
  }

  function createTimerGames(deps) {
    const {
      controls: S,
      hubTimer,
      $,
      makeElement,
      clearNode,
      cleanText,
      safeInteger,
      contentItems,
      pickUnused,
      persistActiveSession,
      currentPlayer,
      actionButton,
      nextSimpleRound,
      syncHubPauseUi,
      focusPlayPrimary,
      setHubPaused,
      setStatus,
      preparePlayCard,
      randomInt,
      randomItem,
      getSession,
      renderPlayRound
    } = deps || {};

    for (const [name, value] of Object.entries({
      S, hubTimer, $, makeElement, clearNode, cleanText, safeInteger,
      contentItems, pickUnused, persistActiveSession, currentPlayer,
      actionButton, nextSimpleRound, syncHubPauseUi, focusPlayPrimary,
      setHubPaused, setStatus, preparePlayCard, randomInt, randomItem,
      getSession, renderPlayRound
    })) {
      if (!value) throw new Error(`Hub-Timer-Abhängigkeit fehlt: ${name}`);
    }

    function session() {
      return getSession();
    }

    function renderCharadesStart() {
      const current = session();
      $('#play-player').textContent = `${currentPlayer()} stellt dar`;
      $('#play-content').textContent = '60 Sekunden. Begriffe dürfen nicht gesprochen oder buchstabiert werden.';
      $('#play-options').append(actionButton('Runde starten', () => startCharades(60_000, 0, '')));
      persistActiveSession();
    }

    function finishCharadesTimer() {
      const current = session();
      const roundScore = current.timer?.roundScore || 0;
      current.running = false;
      current.timer = { ...(current.timer || {}), kind: 'charades', phase: 'ended', remainingMs: 0, roundScore };
      persistActiveSession();
      $('#play-content').textContent = `Zeit vorbei · ${roundScore} Treffer`;
      clearNode($('#play-options'));
      clearNode($('#play-actions'));
      $('#play-actions').append(actionButton('Nächste Person', nextSimpleRound));
      syncHubPauseUi();
      focusPlayPrimary();
    }

    function startCharades(remainingMs = 60_000, restoredScore = 0, restoredItem = '') {
      const current = session();
      current.running = true;
      current.used = Array.isArray(current.used) ? current.used : [];
      const content = $('#play-content');
      const options = $('#play-options');
      const timer = makeElement('div', 'timer-display', S.formatMilliseconds(remainingMs));
      current.timer = {
        kind: 'charades', phase: 'running', remainingMs,
        roundScore: safeInteger(restoredScore, 10_000), item: cleanText(restoredItem, 240), prompt: '', letter: ''
      };
      const showCard = () => {
        const item = pickUnused(contentItems('charades', current.pack));
        current.timer.item = cleanText(item, 240);
        content.textContent = item || 'Keine Karte verfügbar.';
        persistActiveSession();
      };
      const showStoredOrNew = () => {
        if (current.timer.item) content.textContent = current.timer.item;
        else showCard();
      };
      $('#play-player').textContent = `${currentPlayer()} · ${current.timer.roundScore} Treffer`;
      clearNode(options);
      options.append(
        actionButton('Treffer', () => {
          current.timer.roundScore += 1;
          current.score += 1;
          $('#play-player').textContent = `${currentPlayer()} · ${current.timer.roundScore} Treffer`;
          showCard();
        }),
        actionButton('Überspringen', showCard, 'secondary')
      );
      clearNode($('#play-actions'));
      $('#play-actions').append(timer);
      showStoredOrNew();
      hubTimer.countdown(remainingMs / 1000, timer, finishCharadesTimer);
      persistActiveSession();
    }

    function renderTabooStart() {
      $('#play-player').textContent = `${currentPlayer()} erklärt`;
      $('#play-content').textContent = '60 Sekunden. Erkläre möglichst viele Begriffe, ohne eines der verbotenen Wörter zu sagen.';
      $('#play-options').append(actionButton('60-Sekunden-Runde starten', () => startTaboo(60_000, 0, '', [])));
      persistActiveSession();
    }

    function renderTabooCard(word, bannedItems) {
      clearNode($('#play-content'));
      $('#play-content').append(makeElement('strong', 'taboo-word', word || 'Keine Karte'));
      const banned = makeElement('div', 'banned-list');
      (bannedItems || []).forEach(item => banned.append(makeElement('span', '', item)));
      $('#play-content').append(banned);
    }

    function finishTabooTimer() {
      const current = session();
      const roundScore = current.timer?.roundScore || 0;
      current.running = false;
      current.timer = { ...(current.timer || {}), kind: 'taboo', phase: 'ended', remainingMs: 0, roundScore };
      persistActiveSession();
      $('#play-content').textContent = `Zeit vorbei · ${roundScore} Treffer`;
      clearNode($('#play-options'));
      clearNode($('#play-actions'));
      $('#play-actions').append(actionButton('Nächste Person', nextSimpleRound));
      syncHubPauseUi();
      focusPlayPrimary();
    }

    function startTaboo(remainingMs = 60_000, restoredScore = 0, restoredWord = '', restoredBanned = []) {
      const current = session();
      current.running = true;
      current.used = Array.isArray(current.used) ? current.used : [];
      current.timer = {
        kind: 'taboo', phase: 'running', remainingMs,
        roundScore: safeInteger(restoredScore, 10_000), item: '', prompt: '', letter: '',
        word: cleanText(restoredWord, 120),
        banned: Array.isArray(restoredBanned) ? restoredBanned.slice(0, 12).map(item => cleanText(item, 80)).filter(Boolean) : []
      };
      const timer = makeElement('div', 'timer-display', S.formatMilliseconds(remainingMs));
      const showCard = () => {
        const card = pickUnused(contentItems('taboo', current.pack));
        current.timer.word = cleanText(card?.word, 120);
        current.timer.banned = Array.isArray(card?.banned) ? card.banned.slice(0, 12).map(item => cleanText(item, 80)).filter(Boolean) : [];
        renderTabooCard(current.timer.word, current.timer.banned);
        persistActiveSession();
      };
      $('#play-player').textContent = `${currentPlayer()} · ${current.timer.roundScore} Treffer`;
      clearNode($('#play-options'));
      $('#play-options').append(
        actionButton('Treffer', () => {
          current.timer.roundScore += 1;
          current.score += 1;
          $('#play-player').textContent = `${currentPlayer()} · ${current.timer.roundScore} Treffer`;
          showCard();
        }),
        actionButton('Begriff überspringen', showCard, 'secondary')
      );
      clearNode($('#play-actions'));
      $('#play-actions').append(timer);
      if (current.timer.word) renderTabooCard(current.timer.word, current.timer.banned);
      else showCard();
      hubTimer.countdown(remainingMs / 1000, timer, finishTabooTimer);
      persistActiveSession();
      focusPlayPrimary();
    }

    function renderHotPotatoStart() {
      const current = session();
      const prompt = pickUnused(contentItems('hot-potato', current.pack));
      $('#play-content').textContent = prompt || 'Keine Aufgabe verfügbar.';
      $('#play-player').textContent = `${currentPlayer()} beginnt mit dem Gerät`;
      $('#play-options').append(actionButton('Zufallstimer starten', () => startHotPotato(prompt, HOT_POTATO_MIN_MS + randomInt(HOT_POTATO_RANGE_MS))));
      persistActiveSession();
    }

    function finishHotPotatoTimer() {
      const current = session();
      current.running = false;
      current.timer = { ...(current.timer || {}), kind: 'hot-potato', phase: 'ended', remainingMs: 0 };
      persistActiveSession();
      const indicator = $('#play-actions .timer-display');
      if (indicator) indicator.textContent = 'STOPP';
      $('#play-content').textContent = 'Wer das Gerät jetzt hält, verliert diese Runde.';
      $('#play-actions').append(actionButton('Neue Runde', nextSimpleRound));
      syncHubPauseUi();
      focusPlayPrimary();
    }

    function startHotPotato(prompt, remainingMs) {
      const current = session();
      current.running = true;
      current.timer = {
        kind: 'hot-potato', phase: 'running', remainingMs,
        roundScore: 0, item: '', prompt: cleanText(prompt, 400), letter: ''
      };
      $('#play-content').textContent = current.timer.prompt || 'Keine Aufgabe verfügbar.';
      clearNode($('#play-options'));
      clearNode($('#play-actions'));
      const indicator = makeElement('div', 'timer-display', '●');
      const hiddenClock = makeElement('span', '', '');
      hiddenClock.hidden = true;
      $('#play-actions').append(indicator, hiddenClock);
      hubTimer.countdown(remainingMs / 1000, hiddenClock, finishHotPotatoTimer);
      persistActiveSession();
    }

    function renderWordChainStart() {
      const current = session();
      const letter = randomItem(contentItems('word-chain', current.pack)) || 'A';
      $('#play-content').textContent = `Kategorie: ${current.pack} · Startbuchstabe: ${letter}`;
      $('#play-player').textContent = `${currentPlayer()} beginnt`;
      $('#play-options').append(actionButton('30-Sekunden-Runde starten', () => startWordChain(letter, 30_000)));
      persistActiveSession();
    }

    function finishWordChainTimer() {
      const current = session();
      current.running = false;
      current.timer = { ...(current.timer || {}), kind: 'word-chain', phase: 'ended', remainingMs: 0 };
      persistActiveSession();
      $('#play-content').textContent = 'Zeit vorbei.';
      clearNode($('#play-actions'));
      $('#play-actions').append(actionButton('Neue Runde', nextSimpleRound));
      syncHubPauseUi();
      focusPlayPrimary();
    }

    function startWordChain(letter, remainingMs) {
      const current = session();
      current.running = true;
      current.timer = {
        kind: 'word-chain', phase: 'running', remainingMs,
        roundScore: 0, item: '', prompt: '', letter: cleanText(letter, 12) || 'A'
      };
      const timer = makeElement('div', 'timer-display', S.formatMilliseconds(remainingMs));
      clearNode($('#play-options'));
      clearNode($('#play-actions'));
      $('#play-content').textContent = `${current.pack} · Start mit ${current.timer.letter}`;
      $('#play-actions').append(timer, actionButton('Runde geschafft', () => { current.score += 1; nextSimpleRound(); }, 'secondary'));
      hubTimer.countdown(remainingMs / 1000, timer, finishWordChainTimer);
      persistActiveSession();
    }

    function renderStoredTimerSession() {
      const current = session();
      if (!current?.timer) return renderPlayRound();
      const timerState = JSON.parse(JSON.stringify(current.timer));
      preparePlayCard();
      current.timer = timerState;
      if (timerState.phase === 'ended') {
        if (timerState.kind === 'charades') return finishCharadesTimer();
        if (timerState.kind === 'taboo') return finishTabooTimer();
        if (timerState.kind === 'hot-potato') return finishHotPotatoTimer();
        if (timerState.kind === 'word-chain') return finishWordChainTimer();
      }
      if (timerState.kind === 'charades') startCharades(timerState.remainingMs, timerState.roundScore, timerState.item);
      else if (timerState.kind === 'taboo') startTaboo(timerState.remainingMs, timerState.roundScore, timerState.word, timerState.banned);
      else if (timerState.kind === 'hot-potato') startHotPotato(timerState.prompt, timerState.remainingMs);
      else if (timerState.kind === 'word-chain') startWordChain(timerState.letter, timerState.remainingMs);
      setHubPaused(true);
      setStatus('Laufende Timer-Runde wiederhergestellt und sicher pausiert.');
    }

    return Object.freeze({
      renderCharadesStart,
      renderTabooStart,
      renderHotPotatoStart,
      renderWordChainStart,
      renderStoredTimerSession
    });
  }

  window.SecretCirclePartyHubTimers = Object.freeze({
    timerKinds: TIMER_KINDS,
    hotPotatoMinimumMs: HOT_POTATO_MIN_MS,
    hotPotatoMaximumMs: HOT_POTATO_MAX_MS,
    normalizeTimerState,
    createTimerGames
  });
})();
