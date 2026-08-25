'use strict';

(() => {
  const C = window.SecretCirclePartyCatalog;
  const detail = document.querySelector('#game-detail');
  const title = document.querySelector('#detail-title');
  const start = document.querySelector('#start-selected-game');
  const playLayer = document.querySelector('#play-layer');
  const playTitle = document.querySelector('#play-title');
  const playContent = document.querySelector('#play-content');
  const playActions = document.querySelector('#play-actions');
  const playOptions = document.querySelector('#play-options');
  const skipRound = document.querySelector('#skip-hub-round');
  if (!C || !detail || !title || !start) return;

  const PRIVATE_CARD_GAMES = new Set(['charades', 'taboo']);

  const voluntaryGames = Object.freeze({
    'truth-dare': 'Alles freiwillig. Unangenehme Fragen oder Aufgaben dürfen ohne Begründung übersprungen werden.',
    'never-have': 'Persönliche Aussagen sind freiwillig. Überspringen ist jederzeit ohne Begründung erlaubt.',
    'most-likely': 'Abstimmungen bleiben spielerisch. Niemand muss sich rechtfertigen; unangenehme Karten dürfen übersprungen werden.',
    paranoia: 'Persönliche Fragen sind freiwillig. Überspringen ist jederzeit ohne Begründung erlaubt.'
  });

  const roundGuidance = Object.freeze({
    'never-have': 'Alle reagieren gleichzeitig. Wer die Aussage schon erlebt hat, zeigt es; Erzählen danach ist freiwillig.',
    'most-likely': 'Bis drei zählen, dann zeigen alle gleichzeitig auf eine Person. Eine Begründung danach ist optional.',
    'would-rather': 'Beide Optionen vorlesen und gleichzeitig A oder B wählen. Begründungen danach sind optional.',
    charades: 'Nur die darstellende Person schaut auf den aktuellen Begriff. Gerät so halten, dass die Ratenden die Karte nicht sehen.',
    taboo: 'Nur die erklärende Person schaut auf Zielwort und verbotene Wörter. Gerät von den Ratenden weg halten.',
    'hot-potato': 'Passende Antwort nennen und das Gerät direkt weitergeben. Wer es bei STOPP hält, verliert die Runde.',
    'word-chain': 'Jedes neue Wort beginnt mit dem letzten Buchstaben des vorherigen und passt zur Kategorie. Keine Wiederholungen; „Runde geschafft“ nur bei gültiger Kette.',
    'wrong-answers': 'Reihum sofort absichtlich falsch antworten. Wer richtig antwortet oder nach eurer Gruppenregel zu lange braucht, verliert diese Runde; die App vergibt dafür keine Punkte.'
  });

  function currentGame() {
    return C.games.find(game => game.title === title.textContent) || null;
  }

  function currentPlayGame() {
    if (!playTitle?.textContent) return null;
    return C.games.find(game => game.title === playTitle.textContent) || null;
  }

  function desiredLabel(game) {
    if (game.status !== 'playable') return 'Noch nicht spielbar';
    if (game.custom) return 'Eigenes Spiel starten';
    if (game.mode !== 'link') return 'Jetzt spielen';
    if (C.viralGameIds?.includes(game.id)) return 'Viral Mode öffnen';
    if (C.megaGameIds?.includes(game.id)) return 'Trend Mode öffnen';
    if (game.href?.startsWith('quick-play.html')) return 'Quick Mode öffnen';
    if (game.href?.startsWith('advanced.html')) return 'Erweitertes Spiel öffnen';
    if (game.href === 'index.html') return 'Word Imposter öffnen';
    return 'Spiel öffnen';
  }

  function updateStartLabel() {
    const game = currentGame();
    if (!game) return;
    const label = desiredLabel(game);
    start.textContent = label;
    window.setTimeout(() => {
      if (!detail.hidden && currentGame()?.id === game.id) start.textContent = label;
    }, 0);
  }

  function makePlayNote(id, className, message) {
    const note = document.createElement('p');
    note.id = id;
    note.className = className;
    note.setAttribute('role', 'note');
    note.textContent = message;
    return note;
  }

  function updatePlayActionLabels(game) {
    if (!playActions || !game) return;
    for (const button of playActions.querySelectorAll('button')) {
      if (game.id === 'wrong-answers' && button.textContent === 'Nächste Karte') {
        button.textContent = 'Runde beendet · nächste Karte';
        button.setAttribute('aria-label', 'Manuell beendete Runde abschließen und nächste Karte öffnen');
      }
    }
  }

  function updatePlaySafety() {
    document.querySelector('#hub-round-guide')?.remove();
    document.querySelector('#hub-voluntary-play-note')?.remove();
    if (skipRound) {
      skipRound.textContent = 'Runde überspringen';
      skipRound.setAttribute('aria-label', 'Runde überspringen; dafür wird kein Punkt vergeben');
    }
    if (!playLayer || playLayer.hidden || !playContent) return;

    const game = currentPlayGame();
    if (!game) return;

    const guide = roundGuidance[game.id];
    if (guide) playContent.insertAdjacentElement('beforebegin', makePlayNote('hub-round-guide', 'muted play-round-guide', guide));
    updatePlayActionLabels(game);

    const message = voluntaryGames[game.id];
    if (!message) return;

    playContent.insertAdjacentElement('beforebegin', makePlayNote('hub-voluntary-play-note', 'muted play-safety-note', message));

    if (skipRound) {
      skipRound.textContent = 'Überspringen · nächste Person';
      skipRound.setAttribute('aria-label', 'Freiwillig überspringen und ohne Punkt zur nächsten Person wechseln');
    }
  }

  function timerStateMatchesGame(game, session) {
    return window.SecretCirclePartyHubResumeGuard?.timerMatchesGame?.(game, session) === true;
  }

  function setResumeUiPending(pending) {
    const resume = document.querySelector('#hub-resume-session');
    if (!resume) return false;
    if (pending) resume.setAttribute('aria-busy', 'true');
    else resume.removeAttribute('aria-busy');

    for (const control of resume.querySelectorAll('button')) {
      if (pending) {
        if (!control.disabled) control.dataset.resumeGuardDisabled = 'true';
        control.disabled = true;
        control.setAttribute('aria-disabled', 'true');
      } else if (control.dataset.resumeGuardDisabled === 'true') {
        control.disabled = false;
        control.removeAttribute('aria-disabled');
        delete control.dataset.resumeGuardDisabled;
      }
    }
    return true;
  }

  function guardStoredResumeIntegrity() {
    const guard = window.SecretCirclePartyHubResumeGuard;
    if (!guard?.install) {
      document.querySelector('#hub-resume-session')?.remove();
      const status = document.querySelector('#hub-status');
      if (status) {
        status.textContent = 'Der Resume-Schutz konnte nicht geladen werden. Eine gespeicherte Runde wird vorsichtshalber nicht angeboten.';
        status.classList.add('error');
      }
      return false;
    }

    const result = guard.install(window);
    if (!result) document.querySelector('#hub-resume-session')?.remove();
    else setResumeUiPending(false);
    return result;
  }

  function loadHubResumeGuard() {
    setResumeUiPending(true);

    if (window.SecretCirclePartyHubResumeGuard) {
      guardStoredResumeIntegrity();
      return Promise.resolve(true);
    }

    const existing = document.querySelector('script[src="party-hub-resume-guard.js"]');
    if (existing) {
      return new Promise(resolve => {
        existing.addEventListener('load', () => resolve(guardStoredResumeIntegrity()), { once: true });
        existing.addEventListener('error', () => resolve(guardStoredResumeIntegrity()), { once: true });
      });
    }

    return new Promise(resolve => {
      const script = document.createElement('script');
      script.src = 'party-hub-resume-guard.js';
      script.addEventListener('load', () => resolve(guardStoredResumeIntegrity()), { once: true });
      script.addEventListener('error', () => resolve(guardStoredResumeIntegrity()), { once: true });
      document.body.append(script);
    });
  }

  function privatePromptContext() {
    const game = currentPlayGame();
    if (!game || !playContent || playContent.hidden) return null;

    if (game.id === 'paranoia' && playActions && [...playActions.querySelectorAll('button')].some(button => button.textContent.includes('Name wurde genannt'))) {
      return { gameId: game.id, label: 'Geheime Frage', revealLabel: 'Geheime Frage wieder anzeigen' };
    }

    if (PRIVATE_CARD_GAMES.has(game.id) && playOptions && [...playOptions.querySelectorAll('button')].some(button => button.textContent === 'Treffer')) {
      return { gameId: game.id, label: 'Geheime Karte', revealLabel: 'Geheime Karte wieder anzeigen' };
    }

    return null;
  }

  function paranoiaSecretIsOpen() {
    return privatePromptContext()?.gameId === 'paranoia';
  }

  function removePrivateCover({ reveal = false } = {}) {
    const cover = document.querySelector('#hub-private-prompt-cover');
    if (!cover) return false;
    cover.remove();
    if (reveal) {
      if (playContent) playContent.hidden = false;
      if (playActions) playActions.hidden = false;
      if (playOptions) playOptions.hidden = false;
      window.requestAnimationFrame?.(() => playOptions?.querySelector('button')?.focus?.() || playActions?.querySelector('button')?.focus?.());
    }
    return true;
  }

  function concealPrivatePrompt() {
    if (document.querySelector('#hub-private-prompt-cover')) return true;
    const context = privatePromptContext();
    if (!context) return false;

    playContent.hidden = true;
    if (playActions) playActions.hidden = true;
    if (playOptions) playOptions.hidden = true;
    const cover = document.createElement('div');
    cover.id = 'hub-private-prompt-cover';
    cover.className = 'play-content private-prompt-cover';
    cover.setAttribute('role', 'region');
    cover.setAttribute('aria-label', `${context.label} verdeckt`);

    const message = document.createElement('p');
    message.textContent = `${context.label} wurde automatisch verdeckt.`;
    const reveal = document.createElement('button');
    reveal.type = 'button';
    reveal.textContent = context.revealLabel;
    reveal.addEventListener('click', () => removePrivateCover({ reveal: true }));
    cover.append(message, reveal);
    playContent.insertAdjacentElement('afterend', cover);
    window.requestAnimationFrame?.(() => reveal.focus());
    return true;
  }

  function syncPrivateCover() {
    const cover = document.querySelector('#hub-private-prompt-cover');
    if (!cover) return;
    const gameId = currentPlayGame()?.id;
    if (!['paranoia', 'charades', 'taboo'].includes(gameId) || playLayer?.hidden) {
      removePrivateCover({ reveal: true });
    }
  }

  function loadGuidance() {
    if (!document.querySelector('link[href="party-guide.css"]')) {
      const style = document.createElement('link');
      style.rel = 'stylesheet';
      style.href = 'party-guide.css';
      document.head.append(style);
    }
    if (!document.querySelector('script[src="party-guide.js"]')) {
      const script = document.createElement('script');
      script.src = 'party-guide.js';
      script.addEventListener('error', () => {
        const status = document.querySelector('#hub-status');
        if (status) {
          status.textContent = 'Die Schnellhilfe konnte nicht geladen werden. Die Spiele bleiben nutzbar.';
          status.classList.add('error');
        }
      });
      document.body.append(script);
    }
  }

  function loadHubA11y() {
    if (window.SecretCirclePartyHubA11y || document.querySelector('script[src="party-hub-a11y.js"]')) return;
    const script = document.createElement('script');
    script.src = 'party-hub-a11y.js';
    script.addEventListener('error', () => {
      const status = document.querySelector('#hub-status');
      if (status) {
        status.textContent = 'Die zusätzliche Fokussteuerung konnte nicht geladen werden. Das Spiel bleibt nutzbar.';
        status.classList.add('error');
      }
    });
    document.body.append(script);
  }

  const observer = new MutationObserver(updateStartLabel);
  observer.observe(title, { childList: true, characterData: true, subtree: true });
  observer.observe(detail, { attributes: true, attributeFilter: ['hidden'] });

  const playObserver = playTitle && playLayer ? new MutationObserver(() => {
    updatePlaySafety();
    syncPrivateCover();
  }) : null;
  playObserver?.observe(playTitle, { childList: true, characterData: true, subtree: true });
  playObserver?.observe(playLayer, { attributes: true, attributeFilter: ['hidden'] });
  if (playActions) playObserver?.observe(playActions, { childList: true, subtree: true });

  const concealWhenHidden = () => {
    if (document.hidden) concealPrivatePrompt();
  };
  document.addEventListener('visibilitychange', concealWhenHidden);
  window.addEventListener('blur', concealPrivatePrompt);
  window.addEventListener('pagehide', concealPrivatePrompt);
  document.addEventListener('freeze', concealPrivatePrompt);

  addEventListener('pagehide', () => {
    observer.disconnect();
    playObserver?.disconnect();
  }, { once: true });

  loadHubResumeGuard();
  updateStartLabel();
  updatePlaySafety();
  loadGuidance();
  loadHubA11y();

  window.SecretCirclePartyHubPolish = Object.freeze({
    version: 16,
    updateStartLabel,
    updatePlaySafety,
    updatePlayActionLabels,
    timerStateMatchesGame,
    setResumeUiPending,
    guardStoredResumeIntegrity,
    loadHubResumeGuard,
    privatePromptContext,
    concealPrivatePrompt,
    removePrivateCover,
    paranoiaSecretIsOpen,
    loadGuidance,
    loadHubA11y,
    voluntaryGames,
    roundGuidance
  });
})();