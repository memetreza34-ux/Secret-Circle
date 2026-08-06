(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else {
    root.SecretCirclePartyFilterState = api;
    let storage = null;
    try { storage = root.localStorage; } catch {}
    api.install(root, root.document, storage);
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function createPartyFilterState() {
  'use strict';

  const VERSION = 1;
  const STORAGE_KEY = 'secret-circle-party-catalog-filters-v1';
  const VIEW_VALUES = new Set(['home', 'games', 'players', 'favorites', 'stats', 'data']);
  const FIXED_VALUES = Object.freeze({
    mood: Object.freeze(['all', 'funny', 'friendly', 'deep', 'chaotic', 'creative', 'competitive', 'active']),
    players: Object.freeze(['all', 'small', 'medium', 'large']),
    age: Object.freeze(['all', 'family', 'teen']),
    status: Object.freeze(['all', 'playable', 'planned']),
    tier: Object.freeze(['all', 'core', 'extended', 'labs'])
  });
  const defaults = Object.freeze({
    version: VERSION,
    query: '',
    group: 'all',
    mood: 'all',
    players: 'all',
    age: 'all',
    status: 'all',
    tier: 'all',
    view: 'home'
  });

  function cleanText(value, maximum = 120) {
    return String(value ?? '').normalize('NFKC').trim().replace(/\s+/g, ' ').slice(0, maximum);
  }

  function fixed(value, allowed) {
    return allowed.includes(value) ? value : 'all';
  }

  function normalize(value) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return { ...defaults };
    return {
      version: VERSION,
      query: cleanText(value.query, 120),
      group: cleanText(value.group, 80) || 'all',
      mood: fixed(value.mood, FIXED_VALUES.mood),
      players: fixed(value.players, FIXED_VALUES.players),
      age: fixed(value.age, FIXED_VALUES.age),
      status: fixed(value.status, FIXED_VALUES.status),
      tier: fixed(value.tier, FIXED_VALUES.tier),
      view: VIEW_VALUES.has(value.view) ? value.view : 'home'
    };
  }

  function read(storage) {
    try { return normalize(JSON.parse(storage?.getItem?.(STORAGE_KEY))); }
    catch { return { ...defaults }; }
  }

  function write(storage, value) {
    const normalized = normalize(value);
    if (!storage || typeof storage.setItem !== 'function') {
      return { ok: false, value: normalized, error: 'lokaler Speicher ist nicht verfügbar' };
    }
    try {
      storage.setItem(STORAGE_KEY, JSON.stringify(normalized));
      return { ok: true, value: normalized };
    } catch (error) {
      return { ok: false, value: normalized, error: error?.message || 'lokaler Speicherfehler' };
    }
  }

  function optionExists(control, value) {
    return Boolean(control && [...control.options].some(option => option.value === value));
  }

  function snapshot(documentRef, view = 'home') {
    return normalize({
      query: documentRef.querySelector('#game-search')?.value,
      group: documentRef.querySelector('#group-filter')?.value,
      mood: documentRef.querySelector('#mood-filter')?.value,
      players: documentRef.querySelector('#player-filter')?.value,
      age: documentRef.querySelector('#age-filter')?.value,
      status: documentRef.querySelector('#status-filter')?.value,
      tier: documentRef.querySelector('#release-tier-filter')?.value,
      view
    });
  }

  function setSelect(documentRef, selector, value, fallback = 'all') {
    const control = documentRef.querySelector(selector);
    if (!control) return false;
    control.value = optionExists(control, value) ? value : fallback;
    return true;
  }

  function apply(documentRef, value, EventConstructor) {
    const state = normalize(value);
    const search = documentRef.querySelector('#game-search');
    if (search) search.value = state.query;
    setSelect(documentRef, '#group-filter', state.group);
    setSelect(documentRef, '#mood-filter', state.mood);
    setSelect(documentRef, '#player-filter', state.players);
    setSelect(documentRef, '#age-filter', state.age);
    setSelect(documentRef, '#status-filter', state.status);
    setSelect(documentRef, '#release-tier-filter', state.tier);

    const EventType = EventConstructor || globalThis.Event;
    if (EventType) {
      search?.dispatchEvent(new EventType('input', { bubbles: true }));
      documentRef.querySelector('#age-filter')?.dispatchEvent(new EventType('change', { bubbles: true }));
      documentRef.querySelector('#release-tier-filter')?.dispatchEvent(new EventType('change', { bubbles: true }));
    }
    return state;
  }

  function install(root, documentRef, storage) {
    const search = documentRef?.querySelector?.('#game-search');
    const filterBar = documentRef?.querySelector?.('#view-games .filter-bar');
    if (!search || !filterBar) return false;
    if (filterBar.dataset.filterState === String(VERSION)) return true;
    filterBar.dataset.filterState = String(VERSION);

    let currentView = 'home';
    let saveTimer = null;
    let storageWarningShown = false;

    function showStorageWarning(error) {
      if (storageWarningShown) return;
      storageWarningShown = true;
      const status = documentRef.querySelector('#hub-status');
      if (!status) return;
      status.textContent = `Katalogfilter gelten nur bis zum Neuladen: ${error || 'lokaler Speicher ist nicht verfügbar'}`;
      status.classList.add('error');
    }

    function saveNow() {
      saveTimer = null;
      const result = write(storage, snapshot(documentRef, currentView));
      if (!result.ok) showStorageWarning(result.error);
      return result;
    }

    function scheduleSave() {
      if (saveTimer !== null) root.clearTimeout(saveTimer);
      saveTimer = root.setTimeout(saveNow, 120);
    }

    const reset = documentRef.createElement('button');
    reset.type = 'button';
    reset.id = 'reset-catalog-filters';
    reset.className = 'secondary filter-reset-button';
    reset.textContent = 'Filter zurücksetzen';
    filterBar.append(reset);

    documentRef.addEventListener('input', event => {
      if (event.target?.id === 'game-search') scheduleSave();
    });
    documentRef.addEventListener('change', event => {
      if (['group-filter', 'mood-filter', 'player-filter', 'age-filter', 'status-filter', 'release-tier-filter'].includes(event.target?.id)) scheduleSave();
    });
    documentRef.addEventListener('click', event => {
      const view = event.target.closest?.('[data-view-target]')?.dataset.viewTarget;
      if (VIEW_VALUES.has(view)) {
        currentView = view;
        scheduleSave();
      }
      if (event.target.closest?.('[data-quick-filter]')) root.setTimeout(scheduleSave, 0);
    });

    reset.addEventListener('click', () => {
      const next = { ...defaults, view: currentView };
      apply(documentRef, next, root.Event);
      const result = write(storage, next);
      if (!result.ok) showStorageWarning(result.error);
      reset.focus();
    });

    const stored = read(storage);
    currentView = stored.view;
    apply(documentRef, stored, root.Event);

    const requestedView = new root.URLSearchParams(root.location.search).get('view');
    if (!requestedView && stored.view !== 'home') {
      documentRef.querySelector(`[data-view-target="${stored.view}"]`)?.click();
    }
    return true;
  }

  return Object.freeze({
    version: VERSION,
    storageKey: STORAGE_KEY,
    defaults,
    fixedValues: FIXED_VALUES,
    normalize,
    read,
    write,
    snapshot,
    optionExists,
    apply,
    install
  });
});
