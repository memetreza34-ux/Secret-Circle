'use strict';

(() => {
  const C = window.SecretCirclePartyCatalog;
  const detail = document.querySelector('#game-detail');
  const title = document.querySelector('#detail-title');
  const start = document.querySelector('#start-selected-game');
  if (!C || !detail || !title || !start) return;

  function currentGame() {
    return C.games.find(game => game.title === title.textContent) || null;
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
  addEventListener('pagehide', () => observer.disconnect(), { once: true });
  updateStartLabel();
  loadGuidance();

  window.SecretCirclePartyHubPolish = Object.freeze({ version: 5, updateStartLabel, loadGuidance });
})();
