(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else {
    root.SecretCirclePartyReleaseStructure = api;
    api.install(root, root.document);
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function createPartyReleaseStructure() {
  'use strict';

  const VERSION = 1;
  const CORE_IDS = Object.freeze([
    'imposter', 'truth-dare', 'never-have', 'most-likely', 'would-rather',
    'paranoia', 'charades', 'taboo', 'hot-potato', 'word-chain',
    'two-truths', 'question-imposter', 'location-spy', 'mafia', 'wrong-answers'
  ]);
  const LAB_IDS = Object.freeze([
    'who-am-i', 'anime-guess', 'money-challenge', 'blind-ranking', 'emoji-quiz',
    'pass-the-phone', 'red-green-flag', 'secret-mission', 'tier-list',
    'put-a-finger-down', 'guess-the-price', 'higher-lower', 'know-me-best',
    'hear-me-out', 'hot-seat', 'story-chain', 'finish-the-sentence'
  ]);
  const CORE = new Set(CORE_IDS);
  const LABS = new Set(LAB_IDS);
  const TIERS = Object.freeze({
    core: Object.freeze({ id: 'core', label: 'Kernspiel', plural: 'Kernspiele', description: 'Für Januar 2027 vollständig priorisiert und nach den strengsten Release-Gates geprüft.' }),
    extended: Object.freeze({ id: 'extended', label: 'Erweiterung', plural: 'Erweiterungen', description: 'Spielbar und nützlich, aber nach den Kernspielen priorisiert.' }),
    labs: Object.freeze({ id: 'labs', label: 'Labs', plural: 'Labs', description: 'Experimentelle Modi in Prüfung. Nicht automatisch Teil des Kernrelease.' })
  });

  function tierFor(game) {
    if (!game || typeof game !== 'object') return 'labs';
    if (game.custom) return 'extended';
    if (CORE.has(game.id)) return 'core';
    if (LABS.has(game.id) || game.status !== 'playable') return 'labs';
    return 'extended';
  }

  function counts(games) {
    const result = { core: 0, extended: 0, labs: 0 };
    for (const game of Array.isArray(games) ? games : []) result[tierFor(game)] += 1;
    return result;
  }

  function element(documentRef, tag, className, text) {
    const node = documentRef.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function install(root, documentRef) {
    const catalog = root?.SecretCirclePartyCatalog;
    const gamesView = documentRef?.querySelector?.('#view-games');
    const grid = documentRef?.querySelector?.('#game-grid');
    if (!catalog || !gamesView || !grid) return false;
    if (gamesView.dataset.releaseStructure === String(VERSION)) return true;
    gamesView.dataset.releaseStructure = String(VERSION);

    const filterBar = gamesView.querySelector('.filter-bar');
    const heading = gamesView.querySelector('.page-heading');
    const resultCount = documentRef.querySelector('#result-count');
    const summary = counts(catalog.games);

    const filterLabel = element(documentRef, 'label', 'release-tier-filter-label');
    filterLabel.htmlFor = 'release-tier-filter';
    filterLabel.append(documentRef.createTextNode('Reifestufe'));
    const filter = documentRef.createElement('select');
    filter.id = 'release-tier-filter';
    filter.add(new Option('Alle Stufen', 'all'));
    filter.add(new Option(`Kernspiele (${summary.core})`, 'core'));
    filter.add(new Option(`Erweiterungen (${summary.extended})`, 'extended'));
    filter.add(new Option(`Labs (${summary.labs})`, 'labs'));
    filterLabel.append(filter);
    const statusLabel = documentRef.querySelector('label[for="status-filter"]');
    if (filterBar) filterBar.insertBefore(filterLabel, statusLabel || null);

    const overview = element(documentRef, 'section', 'release-tier-overview');
    overview.setAttribute('aria-label', 'Release-Stufen');
    for (const tier of ['core', 'extended', 'labs']) {
      const info = TIERS[tier];
      const button = element(documentRef, 'button', `release-tier-card tier-${tier}`);
      button.type = 'button';
      button.dataset.releaseTierTarget = tier;
      button.append(
        element(documentRef, 'strong', '', `${summary[tier]} ${info.plural}`),
        element(documentRef, 'span', '', info.description)
      );
      overview.append(button);
    }
    if (heading) heading.insertAdjacentElement('afterend', overview);

    const title = documentRef.querySelector('#games-title');
    const description = title?.parentElement?.querySelector('p');
    if (title) title.textContent = 'Kernspiele, Erweiterungen & Labs';
    if (description) description.textContent = 'Wähle nach Qualität, Spielart, Stimmung, Gruppe und Altersstufe. Labs bleiben klar von den priorisierten Kernspielen getrennt.';

    let scheduled = false;
    let applying = false;

    function decorateCard(card) {
      const game = catalog.getGame?.(card.dataset.gameId);
      if (!game) return null;
      const tier = tierFor(game);
      card.dataset.releaseTier = tier;
      let pill = card.querySelector('.release-tier-pill');
      if (!pill) {
        pill = element(documentRef, 'span', `release-tier-pill tier-${tier}`, TIERS[tier].label);
        const statusPill = card.querySelector('.status-pill');
        if (statusPill) statusPill.insertAdjacentElement('beforebegin', pill);
        else card.append(pill);
      } else {
        pill.className = `release-tier-pill tier-${tier}`;
        pill.textContent = TIERS[tier].label;
      }
      return tier;
    }

    function apply() {
      scheduled = false;
      if (applying) return;
      applying = true;
      const selected = filter.value;
      let visible = 0;

      for (const card of documentRef.querySelectorAll('.game-card[data-game-id]')) {
        const tier = decorateCard(card);
        if (card.closest('#game-grid')) {
          const show = selected === 'all' || selected === tier;
          card.hidden = !show;
          if (show) visible += 1;
        }
      }

      grid.querySelector('.release-tier-empty')?.remove();
      if (!visible && grid.querySelector('.game-card')) {
        const empty = element(documentRef, 'p', 'release-tier-empty empty-state', 'Keine Spiele passen zu dieser Reifestufe und den übrigen Filtern.');
        grid.append(empty);
      }
      if (resultCount) resultCount.textContent = String(visible);
      applying = false;
    }

    function schedule() {
      if (scheduled || applying) return;
      scheduled = true;
      (root.queueMicrotask || (callback => Promise.resolve().then(callback)))(apply);
    }

    filter.addEventListener('change', apply);
    overview.addEventListener('click', event => {
      const button = event.target.closest('[data-release-tier-target]');
      if (!button) return;
      filter.value = button.dataset.releaseTierTarget;
      documentRef.querySelector('[data-view-target="games"]')?.click();
      schedule();
      filter.focus();
    });

    const observer = new MutationObserver(schedule);
    for (const target of [
      grid,
      documentRef.querySelector('#featured-grid'),
      documentRef.querySelector('#favorites-grid')
    ].filter(Boolean)) {
      observer.observe(target, { childList: true, subtree: true });
    }

    schedule();
    return true;
  }

  return Object.freeze({
    version: VERSION,
    tiers: TIERS,
    coreIds: CORE_IDS,
    labIds: LAB_IDS,
    tierFor,
    counts,
    install
  });
});
