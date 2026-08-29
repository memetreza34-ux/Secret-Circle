'use strict';

(() => {
  const VERSION = 1;
  const FOCUSABLE_SELECTOR = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled]):not([type="hidden"])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])'
  ].join(',');

  let focusScheduled = false;

  function isVisible(node) {
    if (!node || node.hidden) return false;
    if (node.closest('[hidden]')) return false;
    if (node.closest('[inert]')) return false;
    return true;
  }

  function focusables(container) {
    if (!container) return [];
    return [...container.querySelectorAll(FOCUSABLE_SELECTOR)].filter(isVisible);
  }

  function ensureHeadingFocusable(container) {
    const heading = container?.querySelector('h1, h2, h3');
    if (!heading) return null;
    if (!heading.hasAttribute('tabindex')) heading.setAttribute('tabindex', '-1');
    return heading;
  }

  function focusSurface(container, { preferHeading = false } = {}) {
    if (!container || !isVisible(container)) return false;
    const active = document.activeElement;
    if (active && active !== document.body && container.contains(active) && isVisible(active)) return true;
    const heading = ensureHeadingFocusable(container);
    const target = preferHeading ? heading : (focusables(container)[0] || heading);
    target?.focus?.({ preventScroll: true });
    return Boolean(target && document.activeElement === target);
  }

  function scheduleSurfaceFocus(container, options = {}) {
    if (focusScheduled || !container || !isVisible(container)) return;
    focusScheduled = true;
    window.requestAnimationFrame(() => {
      focusScheduled = false;
      focusSurface(container, options);
    });
  }

  function activeModal() {
    const advanced = document.querySelector('#advanced-play-layer');
    if (advanced && !advanced.hidden) return advanced;
    const creatorHelp = document.querySelector('#creator-help');
    if (creatorHelp && !creatorHelp.hidden) return creatorHelp;
    return null;
  }

  function syncBackgroundInert() {
    const modal = activeModal();
    for (const node of [...document.body.children]) {
      if (node.tagName === 'SCRIPT' || node === modal) continue;
      if (modal) {
        if (!node.inert) {
          node.inert = true;
          node.dataset.secondaryA11yInert = 'true';
        }
      } else if (node.dataset.secondaryA11yInert === 'true') {
        node.inert = false;
        delete node.dataset.secondaryA11yInert;
      }
    }

    for (const candidate of [document.querySelector('#advanced-play-layer'), document.querySelector('#creator-help')]) {
      if (!candidate) continue;
      if (modal && candidate !== modal) candidate.inert = true;
      else if (candidate.dataset.secondaryA11yInert !== 'true') candidate.inert = false;
    }

    if (modal) scheduleSurfaceFocus(modal, { preferHeading: true });
  }

  function trapTab(event) {
    if (event.key !== 'Tab') return false;
    const modal = activeModal();
    if (!modal) return false;
    const items = focusables(modal);
    if (!items.length) {
      event.preventDefault();
      ensureHeadingFocusable(modal)?.focus?.({ preventScroll: true });
      return true;
    }

    const first = items[0];
    const last = items[items.length - 1];
    const active = document.activeElement;
    if (event.shiftKey && (active === first || !modal.contains(active))) {
      event.preventDefault();
      last.focus();
      return true;
    }
    if (!event.shiftKey && (active === last || !modal.contains(active))) {
      event.preventDefault();
      first.focus();
      return true;
    }
    return false;
  }

  function visibleQuickSurface() {
    return ['#quick-play', '#quick-result', '#quick-setup']
      .map(selector => document.querySelector(selector))
      .find(node => node && !node.hidden) || null;
  }

  function recoverDynamicFocus() {
    const modal = activeModal();
    if (modal) {
      scheduleSurfaceFocus(modal);
      return;
    }
    const quick = visibleQuickSurface();
    if (quick) scheduleSurfaceFocus(quick);
  }

  function prepareCreatorWizard() {
    document.querySelectorAll('.wizard-step h3').forEach(heading => {
      if (!heading.hasAttribute('tabindex')) heading.setAttribute('tabindex', '-1');
    });
  }

  function syncTemplateRoving() {
    const grid = document.querySelector('#template-grid');
    if (!grid) return;
    const cards = [...grid.querySelectorAll('[role="radio"]')];
    if (!cards.length) return;
    const selected = cards.find(card => card.getAttribute('aria-checked') === 'true') || cards[0];
    cards.forEach(card => { card.tabIndex = card === selected ? 0 : -1; });
  }

  function handleTemplateKeys(event) {
    const grid = document.querySelector('#template-grid');
    if (!grid || !grid.contains(event.target)) return false;
    const cards = [...grid.querySelectorAll('[role="radio"]')];
    if (!cards.length) return false;
    const current = Math.max(0, cards.indexOf(event.target.closest('[role="radio"]')));
    let next = null;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = cards[(current + 1) % cards.length];
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = cards[(current - 1 + cards.length) % cards.length];
    else if (event.key === 'Home') next = cards[0];
    else if (event.key === 'End') next = cards[cards.length - 1];
    if (!next) return false;
    event.preventDefault();
    next.click();
    syncTemplateRoving();
    next.focus();
    return true;
  }

  const modalObserver = new MutationObserver(() => syncBackgroundInert());
  for (const selector of ['#advanced-play-layer', '#creator-help']) {
    const node = document.querySelector(selector);
    if (node) modalObserver.observe(node, { attributes: true, attributeFilter: ['hidden'] });
  }

  const dynamicObserver = new MutationObserver(() => recoverDynamicFocus());
  for (const selector of ['#play-content', '#play-options', '#play-actions', '#quick-content', '#quick-controls', '#quick-actions']) {
    const node = document.querySelector(selector);
    if (node) dynamicObserver.observe(node, { childList: true, subtree: true });
  }
  for (const selector of ['#quick-setup', '#quick-play', '#quick-result']) {
    const node = document.querySelector(selector);
    if (node) dynamicObserver.observe(node, { attributes: true, attributeFilter: ['hidden'] });
  }

  const templateGrid = document.querySelector('#template-grid');
  const templateObserver = templateGrid ? new MutationObserver(() => syncTemplateRoving()) : null;
  templateObserver?.observe(templateGrid, { childList: true, subtree: true, attributes: true, attributeFilter: ['aria-checked'] });

  document.addEventListener('keydown', event => {
    if (trapTab(event)) return;
    handleTemplateKeys(event);
  }, true);

  const bodyObserver = new MutationObserver(() => {
    if (activeModal()) syncBackgroundInert();
  });
  bodyObserver.observe(document.body, { childList: true });

  prepareCreatorWizard();
  syncTemplateRoving();
  syncBackgroundInert();

  window.addEventListener('pagehide', () => {
    modalObserver.disconnect();
    dynamicObserver.disconnect();
    templateObserver?.disconnect();
    bodyObserver.disconnect();
  }, { once: true });

  window.SecretCircleSecondarySurfaceA11y = Object.freeze({
    version: VERSION,
    activeModal,
    focusables,
    focusSurface,
    syncBackgroundInert,
    trapTab,
    prepareCreatorWizard,
    syncTemplateRoving,
    handleTemplateKeys
  });
})();
