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
  const skipRound = document.querySelector('#skip-hub-round');
  if (!C || !detail || !title || !start) return;

  const voluntaryGames = Object.freeze({
    'truth-dare': 'Alles freiwillig. Unangenehme Fragen oder Aufgaben dürfen ohne Begründung übersprungen werden.',
    'never-have': 'Persönliche Aussagen sind freiwillig. Überspringen ist jederzeit ohne Begründung erlaubt.',
    'most-likely': 'Abstimmungen bleiben spielerisch. Niemand muss sich rechtfertigen; unangenehme Karten dürfen übersprungen werden.',
    paranoia: 'Persönliche Fragen sind freiwillig. Überspringen ist jederzeit ohne Begründung erlaubt.'
  });

  const roundGuidance = Object.freeze({
    'never-have': 'Alle reagieren gleichzeitig. Wer die Aussage schon erlebt hat, zeigt es; Erzählen danach ist freiwillig.',
    'most-likely': 'Bis drei zählen, dann zeigen alle gleichzeitig auf eine Person. Eine Begründung danach ist optional.',
    'would-rather': 'Beide Optionen vorlesen und gleichzeitig A oder B wählen. Begründungen danach sind optional.'
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

    const message = voluntaryGames[game.id];
    if (!message) return;

    playContent.insertAdjacentElement('beforebegin', makePlayNote('hub-voluntary-play-note', 'muted play-safety-note', message));

    if (skipRound) {
      skipRound.textContent = 'Überspringen · nächste Person';
      skipRound.setAttribute('aria-label', 'Freiwillig überspringen und ohne Punkt zur nächsten Person wechseln');
    }
  }

  function paranoiaSecretIsOpen() {
    if (currentPlayGame()?.id !== 'paranoia' || !playActions || !playContent || playContent.hidden) return false;
    return [...playActions.querySelectorAll('button')]
      .some(button => button.textContent.includes('Name wurde genannt'));
  }

  function removePrivateCover({ reveal = false } = {}) {
    const cover = document.querySelector('#hub-private-prompt-cover');
    if (!cover) return false;
    cover.remove();
    if (reveal) {
      if (playContent) playContent.hidden = false;
      if (playActions) playActions.hidden = false;
      window.requestAnimationFrame?.(() => playActions?.querySelector('button')?.focus?.());
    }
    return true;
  }

  function concealPrivatePrompt() {
    if (!paranoiaSecretIsOpen()) return false;
    if (document.querySelector('#hub-private-prompt-cover')) return true;

    playContent.hidden = true;
    if (playActions) playActions.hidden = true;
    const cover = document.createElement('div');
    cover.id = 'hub-private-prompt-cover';
    cover.className = 'play-content private-prompt-cover';
    cover.setAttribute('role', 'region');
    cover.setAttribute('aria-label', 'Geheime Frage verdeckt');

    const message = document.createElement('p');
    message.textContent = 'Die geheime Frage wurde automatisch verdeckt.';
    const reveal = document.createElement('button');
    reveal.type = 'button';
    reveal.textContent = 'Geheime Frage wieder anzeigen';
    reveal.addEventListener('click', () => removePrivateCover({ reveal: true }));
    cover.append(message, reveal);
    playContent.insertAdjacentElement('afterend', cover);
    window.requestAnimationFrame?.(() => reveal.focus());
    return true;
  }

  function syncPrivateCover() {
    const cover = document.querySelector('#hub-private-prompt-cover');
    if (!cover) return;
    if (currentPlayGame()?.id !== 'paranoia' || playLayer?.hidden) {
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

  const observer = new MutationObserver(updateStartLabel);
  observer.observe(title, { childList: true, characterData: true, subtree: true });
  observer.observe(detail, { attributes: true, attributeFilter: ['hidden'] });

  const playObserver = playTitle && playLayer ? new MutationObserver(() => {
    updatePlaySafety();
    syncPrivateCover();
  }) : null;
  playObserver?.observe(playTitle, { childList: true, characterData: true, subtree: true });
  playObserver?.observe(playLayer, { attributes: true, attributeFilter: ['hidden'] });

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
  updateStartLabel();
  updatePlaySafety();
  loadGuidance();

  window.SecretCirclePartyHubPolish = Object.freeze({
    version: 8,
    updateStartLabel,
    updatePlaySafety,
    concealPrivatePrompt,
    removePrivateCover,
    paranoiaSecretIsOpen,
    loadGuidance,
    voluntaryGames,
    roundGuidance
  });
})();
