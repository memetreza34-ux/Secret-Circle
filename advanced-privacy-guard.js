'use strict';

(function initialiseAdvancedPrivacyGuard(root) {
  const layer = document.querySelector('#advanced-play-layer');
  const card = layer?.querySelector('.play-card');
  const eyebrow = document.querySelector('#play-eyebrow');
  const player = document.querySelector('#play-player');
  const content = document.querySelector('#play-content');
  const options = document.querySelector('#play-options');
  const actions = document.querySelector('#play-actions');
  if (!layer || !card || !eyebrow || !player || !content || !options || !actions) return;

  const gameId = new URLSearchParams(root.location.search).get('game') || '';
  const protectedNodes = [player, content, options, actions];

  function buttonTextExists(text) {
    return [...options.querySelectorAll('button'), ...actions.querySelectorAll('button')]
      .some(button => button.textContent.includes(text));
  }

  function sensitiveContext() {
    if (layer.hidden || content.hidden) return null;

    if (gameId === 'two-truths' && eyebrow.textContent.includes('private Eingabe') && content.querySelector('form')) {
      return { label: 'Private Eingabe', message: 'Die private Eingabe wurde automatisch verdeckt.' };
    }
    if (gameId === 'question-imposter' && buttonTextExists('Frage verdecken und weitergeben')) {
      return { label: 'Geheime Frage', message: 'Die geheime Frage wurde automatisch verdeckt.' };
    }
    if (gameId === 'location-spy' && buttonTextExists('Karte schließen und weitergeben')) {
      return { label: 'Geheime Karte', message: 'Die geheime Ortskarte wurde automatisch verdeckt.' };
    }
    if (gameId === 'mafia' && buttonTextExists('Rolle schließen und weitergeben')) {
      return { label: 'Geheime Rolle', message: 'Die geheime Rolle wurde automatisch verdeckt.' };
    }
    if (gameId === 'mafia' && content.querySelector('.role-overview')) {
      return { label: 'Moderatorübersicht', message: 'Die Moderatorübersicht mit allen Rollen wurde automatisch verdeckt.' };
    }
    if (gameId === 'mafia' && eyebrow.textContent.startsWith('Nacht ') && content.querySelector('form')) {
      return { label: 'Geheime Nachtphase', message: 'Die geheimen Nachtaktionen wurden automatisch verdeckt.' };
    }
    if (gameId === 'mafia' && content.textContent.includes('Detektiv-Ergebnis für Moderator:')) {
      return { label: 'Moderatorinformation', message: 'Die private Moderatorinformation wurde automatisch verdeckt.' };
    }
    return null;
  }

  function removeCover({ reveal = false } = {}) {
    const cover = document.querySelector('#advanced-private-cover');
    if (!cover) return false;
    cover.remove();
    if (reveal && !layer.hidden) {
      protectedNodes.forEach(node => { node.hidden = false; });
      root.requestAnimationFrame(() => card.querySelector('#play-content input, #play-content select, #play-options button, #play-actions button')?.focus?.());
    }
    return true;
  }

  function conceal() {
    if (document.querySelector('#advanced-private-cover')) return true;
    const context = sensitiveContext();
    if (!context) return false;

    protectedNodes.forEach(node => { node.hidden = true; });
    const cover = document.createElement('section');
    cover.id = 'advanced-private-cover';
    cover.className = 'play-content private-prompt-cover';
    cover.setAttribute('role', 'region');
    cover.setAttribute('aria-label', `${context.label} verdeckt`);

    const message = document.createElement('p');
    message.textContent = context.message;
    const reveal = document.createElement('button');
    reveal.type = 'button';
    reveal.textContent = 'Geschützten Inhalt wieder anzeigen';
    reveal.addEventListener('click', () => removeCover({ reveal: true }));
    cover.append(message, reveal);
    card.append(cover);
    root.requestAnimationFrame(() => reveal.focus());
    return true;
  }

  function syncLayer() {
    if (layer.hidden) removeCover({ reveal: false });
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) conceal();
  });
  root.addEventListener('blur', conceal);
  root.addEventListener('pagehide', conceal);
  document.addEventListener('freeze', conceal);

  const observer = new MutationObserver(syncLayer);
  observer.observe(layer, { attributes: true, attributeFilter: ['hidden'] });
  root.addEventListener('pagehide', () => observer.disconnect(), { once: true });

  root.SecretCircleAdvancedPrivacyGuard = Object.freeze({
    version: 1,
    gameId,
    sensitiveContext,
    conceal,
    removeCover
  });
})(window);
