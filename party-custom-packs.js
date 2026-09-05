(function (root, factory) {
  const catalog = typeof module === 'object' && module.exports
    ? require('./party-routing.js')
    : root.SecretCirclePartyCatalog;
  const api = factory(root, catalog, typeof localStorage === 'undefined' ? null : localStorage, typeof document === 'undefined' ? null : document);
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.SecretCirclePartyCustomPacks = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function createManager(root, catalog, storage, documentRef) {
  'use strict';
  if (!catalog) throw new Error('Party-Katalog für eigene Packs fehlt.');

  const KEY = 'secret-circle-party-custom-packs-v1';
  const MAX_PACKS = 30;
  const MAX_ITEMS = 150;
  const supportedModes = new Set(['prompt', 'paranoia', 'charades', 'hot-potato', 'word-chain']);
  const supportedFastGames = new Set([
    'who-am-i', 'anime-guess', 'pass-the-phone', 'red-green-flag', 'secret-mission', 'tier-list',
    'put-a-finger-down', 'hear-me-out', 'hot-seat', 'story-chain', 'finish-the-sentence'
  ]);
  const supportedGames = catalog.games.filter(game => game.status === 'playable' && (supportedModes.has(game.mode) || supportedFastGames.has(game.id)));

  function cleanText(value, maximum) {
    return String(value ?? '').normalize('NFKC').trim().replace(/\s+/g, ' ').slice(0, maximum);
  }

  function keyText(value) {
    return cleanText(value, 200).toLocaleLowerCase('de-DE');
  }

  function createId() {
    if (root.crypto?.randomUUID) return root.crypto.randomUUID();
    return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
  }

  function parseItems(value) {
    const items = String(value ?? '')
      .split(/\r?\n/)
      .map(item => cleanText(item, 180))
      .filter(item => item.length >= 2);
    const unique = [];
    const seen = new Set();
    for (const item of items) {
      const key = keyText(item);
      if (seen.has(key)) continue;
      seen.add(key);
      unique.push(item);
      if (unique.length >= MAX_ITEMS) break;
    }
    return unique;
  }

  function normalizePack(value) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
    const gameId = cleanText(value.gameId, 60);
    if (!supportedGames.some(game => game.id === gameId)) return null;
    const name = cleanText(value.name, 40);
    const items = Array.isArray(value.items) ? parseItems(value.items.join('\n')) : parseItems(value.items);
    if (name.length < 2 || items.length < 3) return null;
    return {
      id: cleanText(value.id, 100) || createId(),
      gameId,
      name,
      items,
      createdAt: cleanText(value.createdAt, 40) || new Date().toISOString()
    };
  }

  function normalizeState(value) {
    if (!value || value.version !== 1 || !Array.isArray(value.packs)) return { version: 1, packs: [] };
    const packs = [];
    const ids = new Set();
    const names = new Set();
    for (const raw of value.packs) {
      const pack = normalizePack(raw);
      if (!pack) continue;
      const nameKey = `${pack.gameId}\u0000${keyText(pack.name)}`;
      if (ids.has(pack.id) || names.has(nameKey)) continue;
      ids.add(pack.id);
      names.add(nameKey);
      packs.push(pack);
      if (packs.length >= MAX_PACKS) break;
    }
    return { version: 1, packs };
  }

  function loadState() {
    if (!storage) return { version: 1, packs: [] };
    try {
      return normalizeState(JSON.parse(storage.getItem(KEY)));
    } catch {
      return { version: 1, packs: [] };
    }
  }

  let state = loadState();

  function storagePackName(pack) {
    return `Eigene · ${pack.name}`;
  }

  function applyPacks() {
    /* catalog.content[gameId] kommt eingefroren aus dem Katalog — direktes
       Schreiben schlägt fehl. Stattdessen je Spiel ein neues, beschreibbares
       Objekt aufbauen und die ganze Property ersetzen (der äußere content-
       Container selbst ist nicht eingefroren). */
    const byGame = new Map();
    for (const pack of state.packs) {
      if (!byGame.has(pack.gameId)) byGame.set(pack.gameId, []);
      byGame.get(pack.gameId).push(pack);
    }
    for (const game of supportedGames) {
      const gameContent = catalog.content[game.id];
      if (!gameContent || typeof gameContent !== 'object' || Array.isArray(gameContent)) continue;
      const rebuilt = {};
      for (const key of Object.keys(gameContent)) {
        if (!key.startsWith('Eigene · ')) rebuilt[key] = gameContent[key];
      }
      for (const pack of byGame.get(game.id) || []) rebuilt[storagePackName(pack)] = [...pack.items];
      catalog.content[game.id] = rebuilt;
    }
  }

  function restoreStorage(raw) {
    if (!storage) return;
    if (raw === null || raw === undefined) storage.removeItem(KEY);
    else storage.setItem(KEY, raw);
  }

  function commit(nextState) {
    const normalized = normalizeState(nextState);
    const previousState = state;
    let previousRaw = null;
    try {
      if (storage) {
        previousRaw = storage.getItem(KEY);
        storage.setItem(KEY, JSON.stringify(normalized));
      }
      state = normalized;
      applyPacks();
      return true;
    } catch (error) {
      state = previousState;
      try {
        restoreStorage(previousRaw);
        applyPacks();
      } catch {}
      throw new Error(`Eigene Hub-Packs konnten nicht gespeichert werden: ${error?.message || 'lokaler Speicherfehler'}`);
    }
  }

  function addPack(value) {
    const pack = normalizePack(value);
    if (!pack) throw new Error('Packname, unterstütztes Spiel und mindestens drei unterschiedliche Karten sind erforderlich.');
    const duplicate = state.packs.some(item => item.gameId === pack.gameId && keyText(item.name) === keyText(pack.name));
    if (duplicate) throw new Error('Für dieses Spiel existiert bereits ein eigenes Pack mit diesem Namen.');
    if (state.packs.length >= MAX_PACKS) throw new Error(`Höchstens ${MAX_PACKS} eigene Packs sind möglich.`);
    commit({ version: 1, packs: [...state.packs, pack] });
    return { ...pack, items: [...pack.items] };
  }

  function removePack(id) {
    const cleanId = cleanText(id, 100);
    const nextPacks = state.packs.filter(pack => pack.id !== cleanId);
    if (nextPacks.length === state.packs.length) return false;
    commit({ version: 1, packs: nextPacks });
    return true;
  }

  function createUi() {
    if (!documentRef) return null;
    const stack = documentRef.querySelector('#view-settings .settings-stack');
    if (!stack) return null;
    const section = documentRef.createElement('section');
    section.className = 'data-panel';
    section.setAttribute('aria-labelledby', 'custom-pack-title');
    section.innerHTML = `
      <h2 id="custom-pack-title">Eigene Hub-Kategorien</h2>
      <p class="muted">Erstelle eigene Textpacks für viele klassische, Anime-, Social-, Missions-, Story- und Viral-Modi. Strukturierte Preis-, Zahlen- und Antwortkarten benötigen eigene Editoren.</p>
      <div class="settings-grid">
        <label for="custom-pack-game">Spiel<select id="custom-pack-game"></select></label>
        <label for="custom-pack-name">Packname<input id="custom-pack-name" maxlength="40" placeholder="z. B. Unsere Viral-Runde"></label>
      </div>
      <label for="custom-pack-items">Eine Karte pro Zeile<textarea id="custom-pack-items" rows="7" maxlength="27000" placeholder="Erste eigene Karte&#10;Zweite eigene Karte&#10;Dritte eigene Karte"></textarea></label>
      <button id="save-custom-pack" type="button">Eigenes Pack speichern</button>
      <div id="custom-pack-list" class="compact-list empty-state">Noch kein eigenes Hub-Pack gespeichert.</div>`;
    const backup = documentRef.querySelector('#backup-title')?.closest('.data-panel');
    if (backup) stack.insertBefore(section, backup);
    else stack.append(section);
    return section;
  }

  function initializeUi() {
    if (!documentRef || !storage) return;
    if (!documentRef.querySelector('#custom-pack-game')) createUi();
    const gameSelect = documentRef.querySelector('#custom-pack-game');
    const nameInput = documentRef.querySelector('#custom-pack-name');
    const itemsInput = documentRef.querySelector('#custom-pack-items');
    const saveButton = documentRef.querySelector('#save-custom-pack');
    const list = documentRef.querySelector('#custom-pack-list');
    const status = documentRef.querySelector('#hub-status');
    if (!gameSelect || !nameInput || !itemsInput || !saveButton || !list) return;

    gameSelect.replaceChildren();
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
          try {
            removePack(pack.id);
            renderList();
            setStatus('Eigenes Hub-Pack gelöscht. Katalog wird aktualisiert.');
            root.setTimeout(() => root.location.reload(), 250);
          } catch (error) {
            setStatus(error.message || 'Eigenes Hub-Pack konnte nicht gelöscht werden.', true);
          }
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
    version: 4,
    storageKey: KEY,
    maxPacks: MAX_PACKS,
    maxItems: MAX_ITEMS,
    supportedGameIds: Object.freeze(supportedGames.map(game => game.id)),
    parseItems,
    normalizePack,
    getPacks: () => state.packs.map(pack => ({ ...pack, items: [...pack.items] })),
    addPack,
    removePack,
    applyPacks,
    createManager: (nextStorage, nextDocument = null) => createManager(root, catalog, nextStorage, nextDocument)
  });
});
