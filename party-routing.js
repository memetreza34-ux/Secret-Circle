(function (root, factory) {
  const base = typeof module === 'object' && module.exports
    ? require('./party-viral-catalog.js')
    : root.SecretCirclePartyCatalog;
  const api = factory(root, base, typeof localStorage === 'undefined' ? null : localStorage);
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.SecretCirclePartyCatalog = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function (root, base, storage) {
  'use strict';
  if (!base) throw new Error('Erweiterter Party-Katalog fehlt.');

  const CREATED_KEY = 'secret-circle-party-created-games-v1';
  const advancedModes = new Set(['two-truths', 'question-imposter', 'location-spy', 'mafia']);
  const templateModes = Object.freeze({ prompt: 'prompt', choice: 'choice', guess: 'charades', challenge: 'prompt', story: 'prompt', debate: 'prompt' });

  function clean(value, maximum = 180) {
    return String(value ?? '').normalize('NFKC').trim().replace(/\s+/g, ' ').slice(0, maximum);
  }

  function safeCreatedGames(sourceStorage = storage) {
    if (!sourceStorage) return [];
    try {
      const state = JSON.parse(sourceStorage.getItem(CREATED_KEY));
      if (!state || state.version !== 1 || !Array.isArray(state.games)) return [];
      const result = [];
      const ids = new Set(base.games.map(game => game.id));
      for (const raw of state.games) {
        if (!raw || typeof raw !== 'object' || Array.isArray(raw)) continue;
        const id = clean(raw.id, 100);
        const title = clean(raw.title, 50);
        const description = clean(raw.description, 180);
        const templateId = templateModes[raw.templateId] ? raw.templateId : 'prompt';
        const packs = (Array.isArray(raw.packs) ? raw.packs : []).map(pack => {
          if (!pack || typeof pack !== 'object' || Array.isArray(pack)) return null;
          const name = clean(pack.name, 40);
          const items = Array.isArray(pack.items) ? pack.items.slice(0, 200).filter(item => {
            if (templateModes[templateId] === 'choice') return Array.isArray(item) && item.length === 2 && item.every(value => clean(value, 100).length >= 1);
            return typeof item === 'string' && clean(item, 180).length >= 2;
          }).map(item => Array.isArray(item) ? item.map(value => clean(value, 100)) : clean(item, 180)) : [];
          return name.length >= 2 && items.length >= 3 ? { name, items } : null;
        }).filter(Boolean).slice(0, 8);
        if (!id.startsWith('custom-game-') || ids.has(id) || title.length < 2 || description.length < 10 || !packs.length) continue;
        ids.add(id);
        result.push({
          id,
          title,
          description,
          templateId,
          mode: templateModes[templateId],
          icon: clean(raw.icon, 8) || '🎉',
          accent: clean(raw.accent, 20) || 'violet',
          group: clean(raw.group, 30) || 'Eigene Spiele',
          minPlayers: Math.max(1, Math.min(20, Number.parseInt(raw.minPlayers, 10) || 2)),
          maxPlayers: Math.max(1, Math.min(20, Number.parseInt(raw.maxPlayers, 10) || 20)),
          duration: Math.max(3, Math.min(90, Number.parseInt(raw.duration, 10) || 15)),
          age: raw.age === 'teen' ? 'teen' : 'all',
          packs
        });
        if (result.length >= 40) break;
      }
      return result;
    } catch {
      return [];
    }
  }

  function createCatalog(sourceStorage = storage) {
    const routedBase = base.games.map(game => advancedModes.has(game.mode)
      ? Object.freeze({
          ...game,
          advancedMode: game.mode,
          mode: 'link',
          href: `advanced.html?game=${encodeURIComponent(game.id)}`
        })
      : game
    );
    const created = safeCreatedGames(sourceStorage);
    const createdGames = created.map(game => Object.freeze({
      id: game.id,
      title: game.title,
      icon: game.icon,
      group: game.group,
      status: 'playable',
      mode: game.mode,
      minPlayers: game.minPlayers,
      maxPlayers: Math.max(game.minPlayers, game.maxPlayers),
      duration: game.duration,
      moods: ['friendly', game.templateId === 'debate' ? 'deep' : game.templateId === 'challenge' ? 'chaotic' : 'funny'],
      age: game.age,
      featured: false,
      description: game.description,
      instructions: [
        'Kategorie auswählen und aktive Gruppe prüfen.',
        game.templateId === 'choice' ? 'Zwei Optionen werden gleichzeitig gezeigt.' : game.templateId === 'guess' ? 'Eine Person stellt Begriffe dar, die Gruppe rät.' : 'Eine eigene Karte wird vorgelesen oder ausgespielt.',
        'Freiwilliges Überspringen ist jederzeit erlaubt.',
        'Session beenden oder direkt die nächste Karte spielen.'
      ],
      packs: game.packs.map(pack => pack.name),
      custom: true,
      accent: game.accent,
      templateId: game.templateId
    }));
    const content = { ...base.content };
    for (const game of created) {
      content[game.id] = Object.fromEntries(game.packs.map(pack => [pack.name, pack.items]));
    }
    const games = Object.freeze([...routedBase, ...createdGames]);

    function getGame(id) {
      return games.find(game => game.id === id) || null;
    }

    function getPackNames(id) {
      const value = content[id];
      return value && typeof value === 'object' && !Array.isArray(value) ? Object.keys(value) : [];
    }

    function getItems(id, pack) {
      const value = content[id];
      if (!value || typeof value !== 'object' || Array.isArray(value)) return [];
      if (pack && Array.isArray(value[pack])) return value[pack];
      return Object.values(value).flatMap(items => Array.isArray(items) ? items : []);
    }

    function itemCount(id) {
      return getItems(id).length;
    }

    return Object.freeze({
      ...base,
      version: 7,
      games,
      content,
      getGame,
      getPackNames,
      getItems,
      itemCount,
      createdGameIds: Object.freeze(createdGames.map(game => game.id)),
      createdStorageKey: CREATED_KEY,
      createCatalog
    });
  }

  return createCatalog(storage);
});
