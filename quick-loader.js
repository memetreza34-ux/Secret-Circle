'use strict';

(() => {
  const catalog = window.SecretCirclePartyCatalog;
  const gameId = new URLSearchParams(location.search).get('game') || '';
  let source = 'party-quick-modes.js';
  if (catalog?.viralGameIds?.includes(gameId)) source = 'party-viral-modes.js';
  else if (catalog?.megaGameIds?.includes(gameId)) source = 'party-mega-modes.js';

  const script = document.createElement('script');
  script.src = source;
  script.addEventListener('error', () => {
    const status = document.querySelector('#quick-status');
    if (status) {
      status.textContent = 'Die Spiel-Engine konnte nicht geladen werden. Bitte Seite neu laden.';
      status.classList.add('error');
    }
  });
  document.body.append(script);
})();
