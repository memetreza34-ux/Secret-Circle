'use strict';

(() => {
  const C = window.SecretCirclePartyCatalog;
  const detail = document.querySelector('#game-detail');
  const title = document.querySelector('#detail-title');
  const start = document.querySelector('#start-selected-game');
  const playLayer = document.querySelector('#play-layer');
  const playTitle = document.querySelector('#play-title');
  const playContent = document.querySelector('#play-content');
  const skipRound = document.querySelector('#skip-hub-round');
  if (!C || !detail || !title || !start) return;

  const voluntaryGames = Object.freeze({
    'truth-dare': 'Alles freiwillig. Unangenehme Fragen oder Aufgaben dürfen ohne Begründung übersprungen werden.',
    'never-have': 'Persönliche Aussagen sind freiwillig. Überspringen ist jederzeit ohne Begründung erlaubt.',
    paranoia: 'Persönliche Fragen sind freiwillig. Überspringen ist jederzeit ohne Begründung erlaubt.'
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

  function updatePlaySafety() {
    document.querySelector('#hub-voluntary-play-note')?.remove();
    if (skipRound) {
      skipRound.textContent = 'Runde überspringen';
      skipRound.setAttribute('aria-label', 'Runde überspringen; dafür wird kein Punkt vergeben');
    }
    if (!playLayer || playLayer.hidden || !playContent) return;

    const game = currentPlayGame();
    const message = game && voluntaryGames[game.id];
    if (!message) return;

    const note = document.createElement('p');
    note.id = 'hub-voluntary-play-note';
    note.className = 'muted play-safety-note';
    note.setAttribute('role', 'note');
    note.textContent = message;
    playContent.insertAdjacentElement('beforebegin', note);

    if (skipRound) {
      skipRound.textContent = 'Überspringen · nächste Person';
      skipRound.setAttribute('aria-label', 'Freiwillig überspringen und ohne Punkt zur nächsten Person wechseln');
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

  const playObserver = playTitle && playLayer ? new MutationObserver(updatePlaySafety) : null;
  playObserver?.observe(playTitle, { childList: true, characterData: true, subtree: true });
  playObserver?.observe(playLayer, { attributes: true, attributeFilter: ['hidden'] });

  addEventListener('pagehide', () => {
    observer.disconnect();
    playObserver?.disconnect();
  }, { once: true });
  updateStartLabel();
  updatePlaySafety();
  loadGuidance();

  window.SecretCirclePartyHubPolish = Object.freeze({
    version: 6,
    updateStartLabel,
    updatePlaySafety,
    loadGuidance,
    voluntaryGames
  });
})();
