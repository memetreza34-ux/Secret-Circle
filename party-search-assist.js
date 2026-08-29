(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else {
    root.SecretCirclePartySearchAssist = api;
    api.install(root, root.document);
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function createPartySearchAssist() {
  'use strict';

  const VERSION = 1;
  const MAX_SUGGESTIONS = 6;
  const MANUAL_ALIASES = Object.freeze({
    imposter: ['impostor', 'undercover', 'geheimrolle', 'wer ist der imposter'],
    'truth-dare': ['wahrheit pflicht', 'truth or dare', 'pflichtaufgabe'],
    'never-have': ['ich hab noch nie', 'never have i ever'],
    'most-likely': ['wer wuerde eher', 'wer würde eher'],
    'would-rather': ['entweder oder', 'would you rather'],
    paranoia: ['geheime frage', 'paranoia fragen'],
    charades: ['scharade', 'pantomime', 'begriffe darstellen'],
    taboo: ['tabu', 'nicht sagen', 'verbotene woerter'],
    'hot-potato': ['heisse kartoffel', 'heiße kartoffel', 'zeitbombe'],
    'word-chain': ['wortkette', 'woerterkette'],
    'two-truths': ['zwei wahrheiten eine luege', '2 wahrheiten 1 luege'],
    'question-imposter': ['fragen imposter', 'frage undercover'],
    'location-spy': ['location spy', 'ortsspion', 'spion am ort'],
    mafia: ['werwolf', 'dorf gegen mafia', 'mafia spiel'],
    'wrong-answers': ['falsche antworten', 'nur falsch antworten'],
    'draw-guess': ['montagsmaler', 'zeichnen und raten'],
    'forehead-guess': ['stirnraten', 'handy an die stirn'],
    'who-am-i': ['wer bin ich', 'personen raten'],
    'sound-imitation': ['geraeusche nachmachen', 'sound raten'],
    'hum-song': ['lied summen', 'melodie raten'],
    'guess-the-price': ['preis raten', 'preis schaetzen'],
    'higher-lower': ['hoeher tiefer', 'groesser kleiner'],
    'put-a-finger-down': ['finger runter', 'zeigefinger spiel'],
    'know-me-best': ['wer kennt mich', 'freunde quiz'],
    'story-chain': ['geschichtenkette', 'story weiterzaehlen'],
    'finish-the-sentence': ['satz beenden', 'satz vervollstaendigen'],
    'anime-guess': ['anime raten', 'anime figur'],
    'emoji-quiz': ['emoji raetsel', 'emoji quiz'],
    wavelength: ['wellenlaenge', 'skala raten'],
    'rapid-fire': ['schnellrunde', 'rapid fire'],
    'letter-categories': ['stadt land fluss', 'kategorien mit buchstaben'],
    'scavenger-hunt': ['schnitzeljagd', 'gegenstand suchen'],
    'caption-battle': ['meme text', 'caption wettbewerb']
  });

  function normalizeText(value) {
    return String(value ?? '')
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/ß/g, 'ss')
      .toLocaleLowerCase('de-DE')
      .replace(/[^a-z0-9]+/g, ' ')
      .trim()
      .replace(/\s+/g, ' ')
      .slice(0, 160);
  }

  function unique(values) {
    const result = [];
    const seen = new Set();
    for (const value of values) {
      const normalized = normalizeText(value);
      if (!normalized || seen.has(normalized)) continue;
      seen.add(normalized);
      result.push(normalized);
    }
    return result;
  }

  function aliasesFor(game) {
    if (!game || typeof game !== 'object') return [];
    return unique([
      game.title,
      game.id,
      game.group,
      game.description,
      ...(Array.isArray(game.packs) ? game.packs : []),
      ...(MANUAL_ALIASES[game.id] || [])
    ]);
  }

  function levenshtein(left, right, limit = 3) {
    const a = normalizeText(left);
    const b = normalizeText(right);
    if (a === b) return 0;
    if (!a) return b.length;
    if (!b) return a.length;
    if (Math.abs(a.length - b.length) > limit) return limit + 1;

    let previous = Array.from({ length: b.length + 1 }, (_, index) => index);
    for (let row = 1; row <= a.length; row += 1) {
      const current = [row];
      let rowMinimum = current[0];
      for (let column = 1; column <= b.length; column += 1) {
        const cost = a[row - 1] === b[column - 1] ? 0 : 1;
        const value = Math.min(
          current[column - 1] + 1,
          previous[column] + 1,
          previous[column - 1] + cost
        );
        current[column] = value;
        rowMinimum = Math.min(rowMinimum, value);
      }
      if (rowMinimum > limit) return limit + 1;
      previous = current;
    }
    return previous[b.length];
  }

  function scoreAlias(query, alias) {
    if (!query || !alias) return 0;
    if (alias === query) return 120;
    if (alias.startsWith(query)) return 100 - Math.min(30, alias.length - query.length);
    if (alias.includes(query)) return 82 - Math.min(25, alias.indexOf(query));

    const queryTokens = query.split(' ');
    const aliasTokens = alias.split(' ');
    const matchedTokens = queryTokens.filter(token => aliasTokens.some(candidate => candidate === token || candidate.startsWith(token))).length;
    if (matchedTokens === queryTokens.length && matchedTokens > 0) return 72 + matchedTokens;

    if (query.length >= 4) {
      const distance = levenshtein(query, alias, 3);
      if (distance <= 3) return 65 - distance * 8;
      const wordDistance = Math.min(...aliasTokens.map(token => levenshtein(query, token, 2)));
      if (wordDistance <= 2) return 50 - wordDistance * 8;
    }
    return 0;
  }

  function suggestions(games, query, limit = MAX_SUGGESTIONS) {
    const normalizedQuery = normalizeText(query);
    if (normalizedQuery.length < 2) return [];
    return (Array.isArray(games) ? games : [])
      .map(game => ({
        game,
        score: Math.max(0, ...aliasesFor(game).map(alias => scoreAlias(normalizedQuery, alias)))
      }))
      .filter(item => item.score > 0)
      .sort((left, right) => right.score - left.score || left.game.title.localeCompare(right.game.title, 'de-DE'))
      .slice(0, Math.max(1, Math.min(10, Number(limit) || MAX_SUGGESTIONS)));
  }

  function install(root, documentRef) {
    const catalog = root?.SecretCirclePartyCatalog;
    const input = documentRef?.querySelector?.('#game-search');
    if (!catalog || !input || input.dataset.searchAssist === String(VERSION)) return Boolean(catalog && input);
    input.dataset.searchAssist = String(VERSION);
    input.setAttribute('autocomplete', 'off');
    input.setAttribute('aria-autocomplete', 'list');
    input.setAttribute('aria-controls', 'game-search-suggestions');
    input.setAttribute('aria-expanded', 'false');

    const panel = documentRef.createElement('div');
    panel.id = 'game-search-suggestions';
    panel.className = 'game-search-suggestions';
    panel.setAttribute('role', 'listbox');
    panel.setAttribute('aria-label', 'Spielvorschläge');
    panel.hidden = true;
    input.closest('label')?.insertAdjacentElement('afterend', panel);

    let activeIndex = -1;
    let current = [];

    function close() {
      panel.hidden = true;
      panel.replaceChildren();
      activeIndex = -1;
      current = [];
      input.setAttribute('aria-expanded', 'false');
      input.removeAttribute('aria-activedescendant');
    }

    function choose(index) {
      const item = current[index];
      if (!item) return;
      input.value = item.game.title;
      input.dispatchEvent(new root.Event('input', { bubbles: true }));
      close();
      input.focus();
    }

    function setActive(index) {
      if (!current.length) return;
      activeIndex = (index + current.length) % current.length;
      panel.querySelectorAll('[role="option"]').forEach((node, nodeIndex) => {
        const active = nodeIndex === activeIndex;
        node.setAttribute('aria-selected', String(active));
        node.classList.toggle('active', active);
        if (active) input.setAttribute('aria-activedescendant', node.id);
      });
    }

    function render() {
      current = suggestions(catalog.games, input.value);
      panel.replaceChildren();
      activeIndex = -1;
      if (!current.length) {
        close();
        return;
      }

      current.forEach((item, index) => {
        const button = documentRef.createElement('button');
        button.type = 'button';
        button.id = `game-search-option-${index}`;
        button.className = 'game-search-suggestion';
        button.setAttribute('role', 'option');
        button.setAttribute('aria-selected', 'false');
        button.dataset.gameId = item.game.id;

        const icon = documentRef.createElement('span');
        icon.className = 'game-search-suggestion-icon';
        icon.setAttribute('aria-hidden', 'true');
        icon.textContent = item.game.icon || '🎮';
        const copy = documentRef.createElement('span');
        const title = documentRef.createElement('strong');
        title.textContent = item.game.title;
        const meta = documentRef.createElement('small');
        meta.textContent = `${item.game.group} · ${item.game.minPlayers}–${item.game.maxPlayers} Personen`;
        copy.append(title, meta);
        button.append(icon, copy);
        button.addEventListener('mousedown', event => event.preventDefault());
        button.addEventListener('click', () => choose(index));
        panel.append(button);
      });
      panel.hidden = false;
      input.setAttribute('aria-expanded', 'true');
    }

    input.addEventListener('input', render);
    input.addEventListener('focus', () => { if (input.value.trim()) render(); });
    input.addEventListener('keydown', event => {
      if (panel.hidden && !['ArrowDown', 'ArrowUp'].includes(event.key)) return;
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        if (panel.hidden) render();
        setActive(activeIndex + 1);
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        if (panel.hidden) render();
        setActive(activeIndex - 1);
      } else if (event.key === 'Enter' && activeIndex >= 0) {
        event.preventDefault();
        choose(activeIndex);
      } else if (event.key === 'Escape') {
        close();
      }
    });
    input.addEventListener('blur', () => root.setTimeout(close, 120));
    documentRef.addEventListener('click', event => {
      if (event.target !== input && !panel.contains(event.target)) close();
    });
    return true;
  }

  return Object.freeze({
    version: VERSION,
    maximumSuggestions: MAX_SUGGESTIONS,
    manualAliases: MANUAL_ALIASES,
    normalizeText,
    aliasesFor,
    levenshtein,
    scoreAlias,
    suggestions,
    install
  });
});
