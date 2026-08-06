(function (root, factory) {
  const api = factory(root);
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.SecretCircleGameCreator = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function (root) {
  'use strict';

  const STORAGE_KEY = 'secret-circle-party-created-games-v1';
  const VERSION = 1;
  const MAX_GAMES = 40;
  const MAX_CARDS = 200;
  const MAX_PACKS = 8;
  const ALLOWED_AGES = new Set(['all', 'teen']);
  const ALLOWED_ICONS = ['🎉', '🎭', '🧠', '⚡', '🔥', '🎨', '📖', '💬', '🏆', '🕵️', '🎮', '✨', '🎯', '🃏', '🌟', '🛠️'];
  const ALLOWED_ACCENTS = new Set(['violet', 'cyan', 'pink', 'orange', 'green', 'blue', 'yellow', 'red']);

  const TEMPLATES = Object.freeze({
    prompt: Object.freeze({
      id: 'prompt',
      title: 'Fragen & Aussagen',
      icon: '💬',
      mode: 'prompt',
      description: 'Eine Karte wird vorgelesen, beantwortet oder gemeinsam diskutiert.',
      example: 'Was würdest du sofort lernen?\nWelcher kleine Luxus ist unterschätzt?\nWas macht einen guten Spieleabend aus?',
      instruction: 'Eine Frage oder Aussage pro Zeile.'
    }),
    choice: Object.freeze({
      id: 'choice',
      title: 'Entweder oder',
      icon: '↔️',
      mode: 'choice',
      description: 'Zwei Optionen erscheinen gleichzeitig und die Gruppe entscheidet.',
      example: 'Meer | Berge\nPlanen | Spontan\nSuperkraft fliegen | Superkraft teleportieren',
      instruction: 'Pro Zeile zwei Optionen mit einem | trennen.'
    }),
    guess: Object.freeze({
      id: 'guess',
      title: 'Erraten & Darstellen',
      icon: '🎭',
      mode: 'charades',
      description: 'Begriffe werden dargestellt oder erklärt und von der Gruppe erraten.',
      example: 'Pinguin\nRaumstation\nKaffeetasse\nDetektiv',
      instruction: 'Ein Begriff pro Zeile.'
    }),
    challenge: Object.freeze({
      id: 'challenge',
      title: 'Challenges',
      icon: '⚡',
      mode: 'prompt',
      description: 'Kurze sichere Aufgaben für eine aktive Person oder die ganze Gruppe.',
      example: 'Erfinde in zehn Sekunden einen Bandnamen.\nStelle einen Roboter ohne Worte dar.\nNenne drei Dinge, die in einen Rucksack gehören.',
      instruction: 'Eine sichere Aufgabe pro Zeile.'
    }),
    story: Object.freeze({
      id: 'story',
      title: 'Story & Kreativität',
      icon: '📖',
      mode: 'prompt',
      description: 'Offene Anfänge für Geschichten, Improvisation oder Satzketten.',
      example: 'Als die Tür aufging, war der Raum plötzlich leer.\nDer Roboter beantragte zum ersten Mal Urlaub.\nIm Zug lag ein Brief aus der Zukunft.',
      instruction: 'Ein Geschichtenanfang pro Zeile.'
    }),
    debate: Object.freeze({
      id: 'debate',
      title: 'Meinung & Debatte',
      icon: '🎤',
      mode: 'prompt',
      description: 'Thesen werden begründet, diskutiert oder von der Gruppe bewertet.',
      example: 'Frühstück ist zu jeder Tageszeit die beste Mahlzeit.\nEin leerer Kalender ist echter Luxus.\nOffline-Funktionen sind wichtiger als ein Konto.',
      instruction: 'Eine harmlose These pro Zeile.'
    })
  });

  function cleanText(value, maximum = 180) {
    return String(value ?? '').normalize('NFKC').trim().replace(/\s+/g, ' ').slice(0, maximum);
  }

  function keyText(value) {
    return cleanText(value, 240).toLocaleLowerCase('de-DE');
  }

  function createId() {
    if (root.crypto?.randomUUID) return `custom-game-${root.crypto.randomUUID()}`;
    return `custom-game-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
  }

  function normalizeIcon(value) {
    const icon = cleanText(value, 8);
    return ALLOWED_ICONS.includes(icon) ? icon : '🎉';
  }

  function parseCards(value, templateId) {
    const template = TEMPLATES[templateId] || TEMPLATES.prompt;
    const lines = Array.isArray(value) ? value : String(value ?? '').split(/\r?\n/);
    const result = [];
    const seen = new Set();

    for (const raw of lines) {
      if (template.mode === 'choice') {
        const parts = String(raw ?? '').split('|').map(part => cleanText(part, 100)).filter(Boolean);
        if (parts.length !== 2) continue;
        const key = `${keyText(parts[0])}\u0000${keyText(parts[1])}`;
        if (seen.has(key)) continue;
        seen.add(key);
        result.push(parts);
      } else {
        const card = cleanText(raw, 180);
        if (card.length < 2) continue;
        const key = keyText(card);
        if (seen.has(key)) continue;
        seen.add(key);
        result.push(card);
      }
      if (result.length >= MAX_CARDS) break;
    }
    return result;
  }

  function normalizePack(value, templateId) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
    const name = cleanText(value.name, 40);
    const items = parseCards(value.items, templateId);
    if (name.length < 2 || items.length < 3) return null;
    return { name, items };
  }

  function normalizeGame(value) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
    const templateId = TEMPLATES[value.templateId] ? value.templateId : 'prompt';
    const title = cleanText(value.title, 50);
    const description = cleanText(value.description, 180);
    const group = cleanText(value.group, 30) || 'Eigene Spiele';
    const minPlayers = Math.max(1, Math.min(20, Number.parseInt(value.minPlayers, 10) || 2));
    const maxPlayers = Math.max(minPlayers, Math.min(20, Number.parseInt(value.maxPlayers, 10) || 20));
    const duration = Math.max(3, Math.min(90, Number.parseInt(value.duration, 10) || 15));
    const packs = (Array.isArray(value.packs) ? value.packs : [])
      .map(pack => normalizePack(pack, templateId))
      .filter(Boolean)
      .slice(0, MAX_PACKS);

    if (title.length < 2 || description.length < 10 || !packs.length) return null;
    return {
      id: cleanText(value.id, 100).startsWith('custom-game-') ? cleanText(value.id, 100) : createId(),
      title,
      description,
      templateId,
      icon: normalizeIcon(value.icon),
      accent: ALLOWED_ACCENTS.has(value.accent) ? value.accent : 'violet',
      group,
      minPlayers,
      maxPlayers,
      duration,
      age: ALLOWED_AGES.has(value.age) ? value.age : 'all',
      packs,
      createdAt: cleanText(value.createdAt, 40) || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  function normalizeState(value) {
    if (!value || value.version !== VERSION || !Array.isArray(value.games)) return { version: VERSION, games: [] };
    const games = [];
    const ids = new Set();
    const titles = new Set();
    for (const raw of value.games) {
      const game = normalizeGame(raw);
      if (!game || ids.has(game.id) || titles.has(keyText(game.title))) continue;
      ids.add(game.id);
      titles.add(keyText(game.title));
      games.push(game);
      if (games.length >= MAX_GAMES) break;
    }
    return { version: VERSION, games };
  }

  function createStore(storage) {
    let state = load();

    function load() {
      if (!storage) return { version: VERSION, games: [] };
      try {
        return normalizeState(JSON.parse(storage.getItem(STORAGE_KEY)));
      } catch {
        return { version: VERSION, games: [] };
      }
    }

    function snapshot() {
      return { version: VERSION, games: state.games.map(game => JSON.parse(JSON.stringify(game))) };
    }

    function commit(nextState) {
      const normalized = normalizeState(nextState);
      const previousRaw = storage?.getItem(STORAGE_KEY) ?? null;
      const previousState = state;
      try {
        storage?.setItem(STORAGE_KEY, JSON.stringify(normalized));
        state = normalized;
      } catch (error) {
        state = previousState;
        try {
          if (storage) {
            if (previousRaw === null) storage.removeItem(STORAGE_KEY);
            else storage.setItem(STORAGE_KEY, previousRaw);
          }
        } catch {}
        throw new Error(`Eigenes Spiel konnte nicht gespeichert werden: ${error?.message || 'lokaler Speicherfehler'}`);
      }
      return snapshot();
    }

    function list() {
      return snapshot().games;
    }

    function get(id) {
      return list().find(game => game.id === id) || null;
    }

    function save(value) {
      const game = normalizeGame(value);
      if (!game) throw new Error('Name, kurze Erklärung und mindestens drei gültige Karten sind erforderlich.');
      const existingIndex = state.games.findIndex(item => item.id === game.id);
      const titleDuplicate = state.games.some(item => item.id !== game.id && keyText(item.title) === keyText(game.title));
      if (titleDuplicate) throw new Error('Ein eigenes Spiel mit diesem Namen existiert bereits.');
      if (existingIndex < 0 && state.games.length >= MAX_GAMES) throw new Error(`Höchstens ${MAX_GAMES} eigene Spiele sind möglich.`);
      const games = [...state.games];
      if (existingIndex >= 0) games[existingIndex] = { ...game, createdAt: state.games[existingIndex].createdAt };
      else games.unshift(game);
      commit({ version: VERSION, games });
      return get(game.id);
    }

    function remove(id) {
      const next = state.games.filter(game => game.id !== id);
      if (next.length === state.games.length) return false;
      commit({ version: VERSION, games: next });
      return true;
    }

    function duplicate(id) {
      const source = get(id);
      if (!source) throw new Error('Spiel wurde nicht gefunden.');
      return save({
        ...source,
        id: createId(),
        title: `${source.title} Kopie`.slice(0, 50),
        createdAt: new Date().toISOString()
      });
    }

    function exportData() {
      return JSON.stringify({
        type: 'secret-circle-created-games',
        version: VERSION,
        exportedAt: new Date().toISOString(),
        games: list()
      }, null, 2);
    }

    function importData(value) {
      const parsed = typeof value === 'string' ? JSON.parse(value) : value;
      if (!parsed || parsed.type !== 'secret-circle-created-games' || parsed.version !== VERSION || !Array.isArray(parsed.games)) {
        throw new Error('Diese Datei ist keine gültige Secret-Circle-Spielebibliothek.');
      }
      const incoming = normalizeState({ version: VERSION, games: parsed.games }).games;
      if (!incoming.length) throw new Error('Die Datei enthält keine gültigen Spiele.');
      const merged = [...state.games];
      for (const game of incoming) {
        const sameId = merged.findIndex(item => item.id === game.id);
        const sameTitle = merged.findIndex(item => keyText(item.title) === keyText(game.title));
        const index = sameId >= 0 ? sameId : sameTitle;
        if (index >= 0) merged[index] = game;
        else if (merged.length < MAX_GAMES) merged.push(game);
      }
      commit({ version: VERSION, games: merged });
      return list();
    }

    return Object.freeze({ list, get, save, remove, duplicate, exportData, importData, reload: () => { state = load(); return list(); } });
  }

  function toCatalogGame(game) {
    const template = TEMPLATES[game.templateId] || TEMPLATES.prompt;
    return Object.freeze({
      id: game.id,
      title: game.title,
      icon: game.icon,
      group: game.group || 'Eigene Spiele',
      status: 'playable',
      mode: template.mode,
      minPlayers: game.minPlayers,
      maxPlayers: game.maxPlayers,
      duration: game.duration,
      moods: ['friendly', game.templateId === 'debate' ? 'deep' : game.templateId === 'challenge' ? 'chaotic' : 'funny'],
      age: game.age,
      featured: false,
      description: game.description,
      instructions: [
        'Pack auswählen und aktive Gruppe prüfen.',
        template.description,
        'Karten nacheinander spielen und freiwilliges Überspringen erlauben.',
        'Session jederzeit sicher beenden oder das Spiel erneut öffnen.'
      ],
      packs: game.packs.map(pack => pack.name),
      custom: true,
      accent: game.accent,
      templateId: game.templateId
    });
  }

  function toCatalogContent(game) {
    const content = {};
    for (const pack of game.packs) content[pack.name] = JSON.parse(JSON.stringify(pack.items));
    return content;
  }

  return Object.freeze({
    version: VERSION,
    storageKey: STORAGE_KEY,
    maxGames: MAX_GAMES,
    maxCards: MAX_CARDS,
    maxPacks: MAX_PACKS,
    templates: TEMPLATES,
    icons: Object.freeze(ALLOWED_ICONS),
    accents: Object.freeze([...ALLOWED_ACCENTS]),
    cleanText,
    parseCards,
    normalizeGame,
    normalizeState,
    createStore,
    toCatalogGame,
    toCatalogContent
  });
});
