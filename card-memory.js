(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.SecretCircleCardMemory = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function createCardMemory() {
  'use strict';

  /* Merkt sich über Sessions hinweg, welche Karten zuletzt gezogen wurden, damit
     ein neues Spiel nicht sofort mit bekannten Karten beginnt. Innerhalb einer
     Session verhindern die Engines Wiederholungen weiterhin selbst; dieses Modul
     wählt nur unter den noch freien Karten bevorzugt solche, die länger nicht dran
     waren. Gespeichert werden ausschließlich kurze Prüfsummen, keine Kartentexte.
     Komfortdaten wie das Onboarding: kein Teil von Sicherungen, „Alle Daten
     löschen“ entfernt den Schlüssel mit. Ohne Speicher wird einfach zufällig
     gewählt. */
  const VERSION = 1;
  const STORAGE_KEY = 'secret-circle-card-memory-v1';
  const MAX_SCOPES = 150;
  const MAX_SEEN_PER_SCOPE = 150;
  const MAX_WORDS = 16000;
  const MAX_SHARED = 16000;
  const WORD_SCOPE = { gameId: 'word-imposter', pack: 'alle' };
  const limitFor = key => key === scopeKey(WORD_SCOPE) ? MAX_WORDS : MAX_SEEN_PER_SCOPE;

  function fingerprint(item, seed = 0x811c9dc5) {
    const text = typeof item === 'string' ? item : JSON.stringify(item ?? '');
    let hash = seed;
    for (const char of String(text).normalize('NFKC')) {
      hash ^= char.codePointAt(0);
      hash = Math.imul(hash, 0x01000193) >>> 0;
    }
    return hash.toString(36);
  }

  const normalize = value => String(value).normalize('NFKC').trim().replace(/\s+/g, ' ').toLocaleLowerCase('de-DE');
  function canonical(item) {
    if (typeof item === 'string') return normalize(item);
    if (Array.isArray(item)) return item.map(canonical);
    if (!item || typeof item !== 'object') return item;
    for (const key of ['question', 'prompt', 'word', 'text', 'identity']) if (typeof item[key] === 'string') return normalize(item[key]);
    return Object.fromEntries(Object.keys(item).sort().map(key => [key, canonical(item[key])]));
  }
  function sharedPrint(item) { const value = canonical(item); return fingerprint(value) + '-' + fingerprint(value, 5381); }
  const topics = [
    /pizza|pasta|nudel|spaghetti|lasagne|ravioli|tortellini/, /apfel|birne|banane|obst|beere|melone|ananas|mango/,
    /kaffee|tee\b|saft|wasserflasche|getränk|limonade|kakao/, /brot|brötchen|toast|brezel|bäck|croissant/,
    /kuchen|torte|schokolade|süß|bonbon|keks|eiscreme/, /hund|katze|hamster|meerschwein|haustier/,
    /löwe|tiger|leopard|gepard|jaguar|raubkatze/, /adler|papagei|vogel|eule|möwe|spatz|ente|gans|pinguin/,
    /hai|wal\b|delfin|fisch|qualle|krake|rochen/, /fahrrad|auto\b|bus\b|zug\b|bahn|verkehr|motorrad/,
    /urlaub|reise|koffer|hotel|strand|camping/, /handy|smartphone|computer|laptop|internet|online|app\b/,
    /kochen|küche|pfanne|topf|backofen/, /arzt|ärzt|medizin|krank|apotheke|pflege/,
    /schule|lehrer|lehrerin|unterricht|prüfung|hausaufgabe/, /fußball|basketball|tennis|sport|training/,
    /musik|gitarre|klavier|singen|konzert|trommel/, /buch|lesen|bibliothek|roman|geschichte/,
    /schlaf|bett|kissen|wecker|träumen/, /garten|pflanze|blume|gießkanne|baum\b/,
    /werkzeug|hammer|schraube|säge|bohrer/, /weltraum|astronaut|rakete|planet|mond\b/,
    /kleidung|hose|hemd|schuh|jacke|pullover/, /putzen|staubsauger|wäsche|aufräumen/,
    /freund|familie|geburtstag|feier|party/, /film|kino|schauspiel|theater/
  ];
  function topic(item) { const text = JSON.stringify(canonical(item)); const index = topics.findIndex(rule => rule.test(text)); return index < 0 ? '' : fingerprint('thema-' + index); }
  function sharedState(value) {
    const clean = (list, limit) => Array.isArray(list) ? list.filter(v => typeof v === 'string' && /^[a-z0-9-]{1,16}$/.test(v)).slice(-limit) : [];
    return { seen: clean(value?.seen, MAX_SHARED), topics: clean(value?.topics, 4) };
  }

  function scopeKey(scope) {
    const gameId = String(scope?.gameId ?? '').slice(0, 100);
    if (!gameId) return '';
    return [gameId, String(scope?.pack ?? '').slice(0, 100), String(scope?.pool ?? '').slice(0, 20)].join('|');
  }

  function resolveStorage(storage) {
    if (storage !== undefined) return storage;
    try { return globalThis.localStorage ?? null; } catch { return null; }
  }

  function read(storage) {
    const empty = { version: VERSION, scopes: {}, shared: sharedState(null) };
    try {
      const value = JSON.parse(storage?.getItem?.(STORAGE_KEY) ?? 'null');
      if (!value || value.version !== VERSION || !value.scopes || typeof value.scopes !== 'object' || Array.isArray(value.scopes)) return empty;
      const scopes = {};
      for (const [key, entry] of Object.entries(value.scopes)) {
        if (key.length > 230 || !entry || !Array.isArray(entry.seen)) continue;
        scopes[key] = {
          at: Number.isFinite(entry.at) ? entry.at : 0,
          seen: entry.seen.filter(print => typeof print === 'string' && print.length <= 16).slice(-limitFor(key))
        };
      }
      return { version: VERSION, scopes, shared: sharedState(value.shared) };
    } catch {
      return empty;
    }
  }

  function write(storage, store) {
    try {
      const wordKey = scopeKey(WORD_SCOPE);
      const wordEntry = store.scopes[wordKey];
      const recent = Object.entries(store.scopes).filter(([key]) => key !== wordKey).sort((a, b) => b[1].at - a[1].at);
      const newest = wordEntry
        ? [[wordKey, wordEntry], ...recent.slice(0, MAX_SCOPES - 1)]
        : recent.slice(0, MAX_SCOPES);
      storage?.setItem?.(STORAGE_KEY, JSON.stringify({ version: VERSION, scopes: Object.fromEntries(newest), shared: sharedState(store.shared) }));
      return true;
    } catch {
      return false;
    }
  }

  function boundedRandom(randomInt, maximum) {
    const value = typeof randomInt === 'function' ? Number(randomInt(maximum)) : 0;
    return Number.isInteger(value) && value >= 0 && value < maximum ? value : 0;
  }

  /* Wählt einen Index aus `available` (Indizes in `items`) und merkt ihn sich.
     Zuerst Karten, die in diesem Spiel und dieser Kategorie zuletzt nicht dran
     waren; sind alle schon gesehen, die am längsten nicht verwendete passende Karte. */
  function choose(scope, items, available, randomInt, options = {}) {
    if (!Array.isArray(items) || !Array.isArray(available)) return undefined;
    const candidates = available.filter(index => Number.isInteger(index) && index >= 0 && index < items.length);
    if (!candidates.length) return undefined;
    const key = scopeKey(scope);
    const storage = resolveStorage(options.storage);
    if (!key || !storage) return candidates[boundedRandom(randomInt, candidates.length)];

    const store = read(storage);
    const entry = store.scopes[key] || { at: 0, seen: [] };
    const rank = new Map(entry.seen.map((print, position) => [print, position]));
    const prints = new Map(candidates.map(index => [index, fingerprint(items[index])]));
    const common = new Map(candidates.map(index => [index, sharedPrint(items[index])]));
    const sharedRank = new Map(store.shared.seen.map((print, position) => [print, position]));
    const fresh = candidates.filter(index => !rank.has(prints.get(index)) && !sharedRank.has(common.get(index)));
    let chosen;
    if (fresh.length) {
      const varied = fresh.filter(index => !store.shared.topics.includes(topic(items[index])));
      const pool = varied.length ? varied : fresh;
      chosen = pool[boundedRandom(randomInt, pool.length)];
    } else {
      const age = index => sharedRank.has(common.get(index)) ? sharedRank.get(common.get(index)) : (rank.get(prints.get(index)) ?? -1) - entry.seen.length - 1;
      chosen = [...candidates].sort((a, b) => age(a) - age(b))[0];
    }
    const commonPrint = common.get(chosen), theme = topic(items[chosen]);
    store.shared.seen = [...store.shared.seen.filter(value => value !== commonPrint), commonPrint].slice(-MAX_SHARED);
    if (theme) store.shared.topics = [...store.shared.topics, theme].slice(-4);
    const print = prints.get(chosen);
    entry.seen = [...entry.seen.filter(value => value !== print), print].slice(-limitFor(key));
    entry.at = typeof options.now === 'function' ? options.now() : Date.now();
    store.scopes[key] = entry;
    write(storage, store);
    return chosen;
  }

  function chooseWord(entries, available, randomInt, options = {}) {
    if (!Array.isArray(entries) || !Array.isArray(available)) return undefined;
    available = available.filter(index => Number.isInteger(index) && index >= 0 && index < entries.length);
    if (!available.length) return undefined;
    const words = entries.map(entry => String(Array.isArray(entry) ? entry[0] : entry.word).trim().normalize('NFKC').toLocaleLowerCase('de-DE'));
    const hints = entries.map(entry => String(Array.isArray(entry) ? entry[1] : entry.hint).trim().toLocaleLowerCase('de-DE'));
    const store = read(resolveStorage(options.storage));
    const seen = store.scopes[scopeKey(WORD_SCOPE)]?.seen || [];
    const shared = new Map(store.shared.seen.map((print, index) => [print, index]));
    const known = new Set(seen);
    const fresh = available.filter(index => !known.has(fingerprint(words[index])) && !shared.has(sharedPrint(words[index])));
    // Erst ungespielte Wörter, danach innerhalb dieser Auswahl andere Themen.
    let candidates = fresh.length ? fresh : available;
    if (!fresh.length && (seen.length || shared.size)) {
      const rank = new Map(seen.map((print, index) => [print, index]));
      const age = index => shared.has(sharedPrint(words[index])) ? shared.get(sharedPrint(words[index])) : (rank.get(fingerprint(words[index])) ?? -1) - seen.length - 1;
      candidates = [...available].sort((a, b) => age(a) - age(b)).slice(0, 1);
    }
    if (fresh.length) {
      const recent = new Set(seen.slice(-3));
      const recentHints = new Set(words.flatMap((word, index) => recent.has(fingerprint(word)) ? [hints[index]] : []));
      const varied = fresh.filter(index => !recentHints.has(hints[index]));
      if (varied.length) candidates = varied;
    }
    return choose(WORD_SCOPE, words, candidates, randomInt, options);
  }

  return Object.freeze({
    version: VERSION,
    storageKey: STORAGE_KEY,
    maximumScopes: MAX_SCOPES,
    maximumSeenPerScope: MAX_SEEN_PER_SCOPE,
    fingerprint,
    scopeKey,
    read,
    choose,
    chooseWord,
    maximumWords: MAX_WORDS,
    maximumShared: MAX_SHARED,
    sharedFingerprint: sharedPrint
  });
});
