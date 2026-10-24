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
  const WORD_SCOPE = { gameId: 'word-imposter', pack: 'alle' };
  const limitFor = key => key === scopeKey(WORD_SCOPE) ? MAX_WORDS : MAX_SEEN_PER_SCOPE;

  function fingerprint(item) {
    const text = typeof item === 'string' ? item : JSON.stringify(item ?? '');
    let hash = 0x811c9dc5;
    for (const char of String(text).normalize('NFKC')) {
      hash ^= char.codePointAt(0);
      hash = Math.imul(hash, 0x01000193) >>> 0;
    }
    return hash.toString(36);
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
    const empty = { version: VERSION, scopes: {} };
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
      return { version: VERSION, scopes };
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
      storage?.setItem?.(STORAGE_KEY, JSON.stringify({ version: VERSION, scopes: Object.fromEntries(newest) }));
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
     waren; sind alle schon gesehen, zufällig unter der älter gesehenen Hälfte. */
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
    const fresh = candidates.filter(index => !rank.has(prints.get(index)));
    let chosen;
    if (fresh.length) {
      chosen = fresh[boundedRandom(randomInt, fresh.length)];
    } else {
      const oldest = [...candidates].sort((a, b) => rank.get(prints.get(a)) - rank.get(prints.get(b)));
      const pool = oldest.slice(0, Math.max(1, Math.ceil(oldest.length / 2)));
      chosen = pool[boundedRandom(randomInt, pool.length)];
    }
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
    const seen = read(resolveStorage(options.storage)).scopes[scopeKey(WORD_SCOPE)]?.seen || [];
    const known = new Set(seen);
    const fresh = available.filter(index => !known.has(fingerprint(words[index])));
    // Erst ungespielte Wörter, danach innerhalb dieser Auswahl andere Themen.
    let candidates = fresh.length ? fresh : available;
    if (!fresh.length && seen.length) {
      const rank = new Map(seen.map((print, index) => [print, index]));
      candidates = [...available].sort((a, b) => rank.get(fingerprint(words[a])) - rank.get(fingerprint(words[b]))).slice(0, 1);
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
    maximumWords: MAX_WORDS
  });
});
