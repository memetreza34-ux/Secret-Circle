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

  function updateStartLabel() {
    const game = currentGame();
    if (!game) return;
    if (game.status !== 'playable') {
      start.textContent = 'Noch nicht spielbar';
      return;
    }
    if (game.mode !== 'link') {
      start.textContent = 'Spiel starten';
      return;
    }
    if (C.viralGameIds?.includes(game.id)) start.textContent = 'Viral Mode öffnen';
    else if (C.megaGameIds?.includes(game.id)) start.textContent = 'Trend Mode öffnen';
    else if (game.href?.startsWith('quick-play.html')) start.textContent = 'Quick Mode öffnen';
    else if (game.href?.startsWith('advanced.html')) start.textContent = 'Erweitertes Spiel öffnen';
    else if (game.href === 'index.html') start.textContent = 'Word Imposter öffnen';
    else start.textContent = 'Spiel öffnen';
  }

  const observer = new MutationObserver(updateStartLabel);
  observer.observe(title, { childList: true, characterData: true, subtree: true });
  observer.observe(detail, { attributes: true, attributeFilter: ['hidden'] });
  addEventListener('pagehide', () => observer.disconnect(), { once: true });
  updateStartLabel();

  window.SecretCirclePartyHubPolish = Object.freeze({ version: 3, updateStartLabel });
})();
