'use strict';

(() => {
  const main = document.querySelector('#hub-main');
  const detail = document.querySelector('#game-detail');
  const play = document.querySelector('#play-layer');
  if (!main || !detail || !play) return;

  const overlayIds = new Set(['game-detail', 'play-layer']);
  let focusScheduled = false;

  function activeOverlay() {
    if (!detail.hidden) return detail;
    if (!play.hidden) return play;
    return null;
  }

  function syncBackgroundInert() {
    const overlay = activeOverlay();
    for (const node of [...document.body.children]) {
      if (node.tagName === 'SCRIPT' || overlayIds.has(node.id)) continue;
      node.inert = Boolean(overlay);
    }
    detail.inert = Boolean(overlay && overlay !== detail);
    play.inert = Boolean(overlay && overlay !== play);
  }

  function focusVisibleViewHeading() {
    const view = main.querySelector('.hub-view:not([hidden])');
    const heading = view?.querySelector('h1, h2');
    if (!heading) return false;
    if (!heading.hasAttribute('tabindex')) heading.setAttribute('tabindex', '-1');
    heading.focus({ preventScroll: true });
    return document.activeElement === heading;
  }

  function scheduleVisibleViewFocus() {
    if (focusScheduled || activeOverlay()) return;
    focusScheduled = true;
    window.requestAnimationFrame(() => {
      focusScheduled = false;
      focusVisibleViewHeading();
    });
  }

  const viewObserver = new MutationObserver(records => {
    if (records.some(record => record.type === 'attributes' && record.attributeName === 'hidden')) {
      scheduleVisibleViewFocus();
    }
  });
  main.querySelectorAll('.hub-view').forEach(view => {
    viewObserver.observe(view, { attributes: true, attributeFilter: ['hidden'] });
  });

  const overlayObserver = new MutationObserver(() => {
    syncBackgroundInert();
  });
  overlayObserver.observe(detail, { attributes: true, attributeFilter: ['hidden'] });
  overlayObserver.observe(play, { attributes: true, attributeFilter: ['hidden'] });

  const bodyObserver = new MutationObserver(records => {
    if (records.some(record => record.type === 'childList') && activeOverlay()) syncBackgroundInert();
  });
  bodyObserver.observe(document.body, { childList: true });

  syncBackgroundInert();

  window.addEventListener('pagehide', () => {
    viewObserver.disconnect();
    overlayObserver.disconnect();
    bodyObserver.disconnect();
  }, { once: true });

  window.SecretCirclePartyHubA11y = Object.freeze({
    version: 1,
    activeOverlay,
    syncBackgroundInert,
    focusVisibleViewHeading
  });
})();
