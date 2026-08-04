(function (root, factory) {
  const catalog = typeof module === 'object' && module.exports
    ? require('./party-routing.js')
    : root.SecretCirclePartyCatalog;
  const api = factory(catalog, typeof localStorage === 'undefined' ? null : localStorage, typeof document === 'undefined' ? null : document);
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.SecretCirclePartyCustomPacks = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function (catalog, storage, documentRef) {
  'use strict';
  if (!catalog) throw new Error('Party-Katalog für eigene Packs fehlt.');

  const KEY = 'secret-circle-party-custom-packs-v1';
  const MAX_PACKS = 20;
  const MAX_ITEMS = 100;
  const supportedModes = new Set(['prompt', 'paranoia', 'charades', 'hot-potato', 'word-chain']);
  const supportedGames = catalog.games.filter(game => game.status === 'playable' && supportedModes.has(game.mode));

  function cleanText(value, maximum) {
    return String(value ?? '').trim().replace(/\s+/g, ' ').slice(0, maximum);
  }

  function parseItems(value) {
    const items = String(value ?? '')
      .split(/\r?\n/)
      .map(item => cleanText(item, 180))
      .filter(item => item.length >= 2);
    const unique = [];
    const seen = new Set();
    for (const item of items) {
      const key = item.toLocaleLowerCase('de-DE');
      if (seen.has(key)) continue;
      seen.add(key);
      unique.push(item);
      if (unique.length >= MAX_ITEMS) break;
    }
    return unique;
  }

  function normalizePack(value) {
    if (!value || typeof value !== 'object') return null;
    const gameId = cleanText(value.gameId, 60);
    if (!supportedGames.some(game => game.id === gameId)) return null;
    const name = cleanText(value.name, 40);
    const items = Array.isArray(value.items) ? parseItems(value.items.join('\n')) : parseItems(value.items);
    if (name.length < 2 || items.length < 3) return null;
    return {
      id: cleanText(value.id, 100) || `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      gameId,
      name,
      items,
      createdAt: cleanText(value.createdAt, 40) || new Date().toISOString()
    };
  }

  function loadState() {
    if (!storage) return { version: 1, packs: [] };
    try {
      const parsed = JSON.parse(storage.getItem(KEY));
      if (!parsed || parsed.version !== 1 || !Array.isArray(parsed.packs)) throw new Error('invalid');
      return { version: 1, packs: parsed.packs.map(normalizePack).filter(Boolean).slice(0, MAX_PACKS) };
    } catch {
      return { version: 1, packs: [] };
    }
  }

  let state = loadState();

  function storagePackName(pack) {
    return `Eigene · ${pack.name}`;
  }

  function applyPacks() {
    for (const game of supportedGames) {
      const gameContent = catalog.content[game.id];
      if (!gameContent || typeof gameContent !== 'object' || Array.isArray(gameContent)) continue;
      for (const key of Object.keys(gameContent)) {
        if (key.startsWith('Eigene · ')) delete gameContent[key];
      }
    }
    for (const pack of state.packs) {
      const gameContent = catalog.content[pack.gameId];
      if (!gameContent || typeof gameContent !== 'object' || Array.isArray(gameContent)) continue;
      gameContent[storagePackName(pack)] = [...pack.items];
    }
  }

  function saveState() {
    if (!storage) return;
    storage.setItem(KEY, JSON.stringify(state));
  }

  function addPack(value) {
    const pack = normalizePack(value);
    if (!pack) throw new Error('Packname, unterstütztes Spiel und mindestens drei unterschiedliche Karten sind erforderlich.');
    const duplicate = state.packs.some(item => item.gameId === pack.gameId && item.name.toLocaleLowerCase('de-DE') === pack.name.toLocaleLowerCase('de-DE'));
    if (duplicate) throw new Error('Für dieses Spiel existiert bereits ein eigenes Pack mit diesem Namen.');
    if (state.packs.length >= MAX_PACKS) throw new Error(`Höchstens ${MAX_PACKS} eigene Packs sind möglich.`);
    state.packs.push(pack);
    saveState();
    applyPacks();
    return pack;
  }

  function removePack(id) {
    const before = state.packs.length;
    state.packs = state.packs.filter(pack => pack.id !== id);
    if (state.packs.length === before) return false;
    saveState();
    applyPacks();
    return true;
  }

  function initializeUi() {
    if (!documentRef || !storage) return;
    const gameSelect = documentRef.querySelector('#custom-pack-game');
    const nameInput = documentRef.querySelector('#custom-pack-name');
    const itemsInput = documentRef.querySelector('#custom-pack-items');
    const saveButton = documentRef.querySelector('#save-custom-pack');
    const list = documentRef.querySelector('#custom-pack-list');
    const status = documentRef.querySelector('#hub-status');
    if (!gameSelect || !nameInput || !itemsInput || !saveButton || !list) return;

    supportedGames.forEach(game => gameSelect.add(new Option(game.title, game.id)));

    function setStatus(message, error = false) {
      if (!status) return;
      status.textContent = message;
      status.classList.toggle('error', error);
    }

    function renderList() {
      list.replaceChildren();
      if (!state.packs.length) {
        list.className = 'compact-list empty-state';
        list.textContent = 'Noch kein eigenes Hub-Pack gespeichert.';
        return;
      }
      list.className = 'compact-list';
      state.packs.forEach(pack => {
        const row = documentRef.createElement('div');
        row.className = 'compact-row';
        const text = documentRef.createElement('div');
        const title = documentRef.createElement('strong');
        title.textContent = pack.name;
        const meta = documentRef.createElement('small');
        meta.textContent = `${catalog.getGame(pack.gameId)?.title || pack.gameId} · ${pack.items.length} Karten`;
        text.append(title, meta);
        const remove = documentRef.createElement('button');
        remove.type = 'button';
        remove.className = 'secondary';
        remove.textContent = 'Löschen';
        remove.addEventListener('click', () => {
          if (!root.confirm(`Eigenes Pack „${pack.name}“ löschen?`)) return;
          removePack(pack.id);
          renderList();
          setStatus('Eigenes Hub-Pack gelöscht. Katalog wird aktualisiert.');
          root.setTimeout(() => root.location.reload(), 250);
        });
        row.append(text, remove);
        list.append(row);
      });
    }

    saveButton.addEventListener('click', () => {
      try {
        const pack = addPack({ gameId: gameSelect.value, name: nameInput.value, items: itemsInput.value });
        nameInput.value = '';
        itemsInput.value = '';
        renderList();
        setStatus(`Pack „${pack.name}“ mit ${pack.items.length} Karten gespeichert. Katalog wird aktualisiert.`);
        root.setTimeout(() => root.location.reload(), 250);
      } catch (error) {
        setStatus(error.message || 'Eigenes Pack konnte nicht gespeichert werden.', true);
      }
    });

    renderList();
  }

  applyPacks();
  initializeUi();

  return Object.freeze({
    version: 1,
    storageKey: KEY,
    maxPacks: MAX_PACKS,
    maxItems: MAX_ITEMS,
    supportedGameIds: Object.freeze(supportedGames.map(game => game.id)),
    parseItems,
    normalizePack,
    getPacks: () => state.packs.map(pack => ({ ...pack, items: [...pack.items] })),
    addPack,
    removePack,
    applyPacks
  });
});
