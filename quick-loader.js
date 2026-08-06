'use strict';

(() => {
  const catalog = window.SecretCirclePartyCatalog;
  const gameId = new URLSearchParams(location.search).get('game') || '';
  const isMegaMode = Boolean(catalog?.megaGameIds?.includes(gameId));
  const script = document.createElement('script');
  script.src = isMegaMode ? 'party-mega-modes.js' : 'party-quick-modes.js';
  script.addEventListener('error', () => {
    const status = document.querySelector('#quick-status');
    if (status) {
      status.textContent = 'Die Spiel-Engine konnte nicht geladen werden. Bitte Seite neu laden.';
      status.classList.add('error');
    }
  });
  document.body.append(script);
})();
