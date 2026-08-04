(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else {
    let storage = null;
    try { storage = root.localStorage; } catch {}
    root.SecretCircleStore = api.createStore(storage);
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const BACKUP_FORMAT = 'secret-circle-backup';
  const BACKUP_VERSION = 1;
  const KEY_VERSION = 7;
  const ENGINE_VERSION = 7;
  const MAX_BACKUP_BYTES = 2_000_000;
  const IMPORT_PROBE_KEY = '__secret_circle_import_probe__';
  const keys = {
    active: `secret-circle-active-v${KEY_VERSION}`,
    custom: `secret-circle-custom-v${KEY_VERSION}`,
    history: `secret-circle-history-v${KEY_VERSION}`,
    settings: `secret-circle-settings-v${KEY_VERSION}`
  };
  const legacyVersions = [6, 5, 4, 3, 2];

  function createStore(storage) {
    const warnings = [];
    let capability;

    function available() {
      if (capability !== undefined) return capability;
      if (!storage) {
        capability = false;
        return false;
      }
      try {
        const probe = '__secret_circle_probe__';
        storage.setItem(probe, '1');
        storage.removeItem(probe);
        capability = true;
      } catch {
        capability = false;
      }
      return capability;
    }

    function rawGet(key) {
      if (!storage) return null;
      try { return storage.getItem(key); } catch { return null; }
    }

    function rawSet(key, value) {
      if (!storage) return { ok: false, error: 'Lokaler Speicher ist nicht verfügbar.' };
      try {
        storage.setItem(key, value);
        capability = true;
        return { ok: true };
      } catch (error) {
        return { ok: false, error: error?.message || 'Lokale Daten konnten nicht gespeichert werden.' };
      }
    }

    function rawRemove(key) {
      if (!storage) return;
      try { storage.removeItem(key); } catch {}
    }

    function parse(raw) {
      if (raw === null || raw === undefined || raw === '') return null;
      try { return JSON.parse(raw); } catch { return null; }
    }

    function clone(value) {
      return JSON.parse(JSON.stringify(value));
    }

    function text(value, maximum) {
      return String(value ?? '').trim().replace(/\s+/g, ' ').slice(0, maximum);
    }

    function normalizeSettings(value) {
      if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
      const durations = new Set(['1', '2', '3', '5', '10']);
      const rounds = new Set(['1', '3', '5', '10']);
      const imposterCount = String(value.imposterCount ?? '1');
      if (!/^([1-9]|1\d)$/.test(imposterCount)) return null;
      return {
        players: String(value.players ?? '').slice(0, 1200),
        category: text(value.category || 'all', 100) || 'all',
        imposterCount,
        useHint: value.useHint !== false,
        duration: durations.has(String(value.duration)) ? String(value.duration) : '3',
        matchRounds: rounds.has(String(value.matchRounds)) ? String(value.matchRounds) : '5'
      };
    }

    function normalizeCustom(value, engine) {
      if (!Array.isArray(value)) return null;
      const result = [];
      const seen = new Set();
      for (const item of value.slice(0, 50)) {
        if (!item || typeof item !== 'object') return null;
        const id = text(item.id, 100);
        const name = text(item.name, 50);
        if (!id || !name || seen.has(id)) return null;
        let entries;
        try { entries = engine.normalizeEntries(item.entries); } catch { return null; }
        seen.add(id);
        result.push({ id, name, entries });
      }
      return result;
    }

    function normalizeHistory(value) {
      if (!Array.isArray(value)) return null;
      const result = [];
      for (const item of value.slice(0, 20)) {
        if (!item || typeof item !== 'object') return null;
        const id = text(item.id, 100);
        const category = text(item.category, 60);
        const word = text(item.word, 60);
        const winner = item.winner;
        const imposters = Array.isArray(item.imposters) ? item.imposters.map(name => text(name, 32)).filter(Boolean) : [];
        const playerCount = Number(item.playerCount);
        const imposterCount = Number.isInteger(item.imposterCount) ? item.imposterCount : imposters.length;
        const round = Number.isInteger(item.round) ? item.round : 1;
        if (!id || !category || !word || !['innocents', 'imposters'].includes(winner)) return null;
        if (!Number.isInteger(playerCount) || playerCount < 3 || playerCount > 20) return null;
        if (!Number.isInteger(imposterCount) || imposterCount < 1 || imposterCount >= playerCount) return null;
        if (!Number.isInteger(round) || round < 1 || round > 20) return null;
        result.push({
          id,
          completedAt: text(item.completedAt, 40),
          category,
          playerCount,
          imposterCount,
          word,
          imposters,
          winner,
          round
        });
      }
      return result;
    }

    function upgradeActiveSnapshot(value) {
      if (!value || typeof value !== 'object' || Array.isArray(value)) return value;
      const upgraded = clone(value);
      if (upgraded.version === ENGINE_VERSION) return upgraded;
      if (!legacyVersions.includes(Number(upgraded.version))) return upgraded;
      if (!Array.isArray(upgraded.players) || !upgraded.players.length) return upgraded;

      upgraded.version = ENGINE_VERSION;
      upgraded.useHint = upgraded.useHint !== false;
      upgraded.usedWords = Array.isArray(upgraded.usedWords) && upgraded.usedWords.length
        ? [...new Set(upgraded.usedWords.map(word => text(word, 60)).filter(Boolean))]
        : [text(upgraded.word, 60)].filter(Boolean);
      if (upgraded.word && !upgraded.usedWords.some(word => word.toLocaleLowerCase('de-DE') === text(upgraded.word, 60).toLocaleLowerCase('de-DE'))) {
        upgraded.usedWords.push(text(upgraded.word, 60));
      }

      upgraded.matchRounds = Number.isInteger(upgraded.matchRounds) && upgraded.matchRounds >= 1 && upgraded.matchRounds <= 20 ? upgraded.matchRounds : 1;
      upgraded.currentRound = Number.isInteger(upgraded.currentRound) && upgraded.currentRound >= 1 && upgraded.currentRound <= upgraded.matchRounds ? upgraded.currentRound : 1;
      const previousScores = upgraded.scores && typeof upgraded.scores === 'object' && !Array.isArray(upgraded.scores) ? upgraded.scores : {};
      upgraded.scores = Object.fromEntries(upgraded.players.map(name => [name, Number.isInteger(previousScores[name]) && previousScores[name] >= 0 ? previousScores[name] : 0]));

      upgraded.votes = upgraded.votes && typeof upgraded.votes === 'object' && !Array.isArray(upgraded.votes) ? upgraded.votes : {};
      upgraded.voteLeaders = Array.isArray(upgraded.voteLeaders) ? upgraded.voteLeaders : [];
      upgraded.tieBreakCount = Number.isInteger(upgraded.tieBreakCount) ? Math.max(0, Math.min(1, upgraded.tieBreakCount)) : 0;
      upgraded.eliminatedPlayer = upgraded.eliminatedPlayer ?? null;
      upgraded.imposterGuess = upgraded.imposterGuess ?? null;
      upgraded.winner = upgraded.winner ?? null;
      upgraded.completedAt = upgraded.completedAt ?? null;
      upgraded.timerRunning = false;
      upgraded.timerDeadline = null;

      if (upgraded.phase === 'round') upgraded.phase = 'discussion';
      if (!['reveal', 'discussion', 'voting', 'tie_break', 'guess', 'completed'].includes(upgraded.phase)) upgraded.phase = 'reveal';
      if (upgraded.phase === 'reveal') {
        if (!Number.isInteger(upgraded.revealIndex) || upgraded.revealIndex < 0) upgraded.revealIndex = 0;
        if (upgraded.revealIndex >= upgraded.players.length) {
          upgraded.revealIndex = upgraded.players.length;
          upgraded.phase = 'discussion';
        }
      } else {
        upgraded.revealIndex = upgraded.players.length;
      }
      if (upgraded.phase === 'completed') {
        if (!upgraded.completedAt && upgraded.winner) upgraded.completedAt = upgraded.createdAt;
      } else {
        upgraded.completedAt = null;
        upgraded.winner = null;
      }
      return upgraded;
    }

    function normalize(kind, value, engine) {
      if (kind === 'active') {
        if (value === null) return null;
        try { return engine.restoreGame(upgradeActiveSnapshot(value)); } catch { return null; }
      }
      if (kind === 'custom') return normalizeCustom(value, engine);
      if (kind === 'history') return normalizeHistory(value);
      if (kind === 'settings') return normalizeSettings(value);
      return null;
    }

    function legacyKey(kind, version) {
      return `secret-circle-${kind}-v${version}`;
    }

    function removeLegacyKind(kind) {
      for (const version of legacyVersions) rawRemove(legacyKey(kind, version));
    }

    function readKind(kind, fallback, engine) {
      const currentRaw = rawGet(keys[kind]);
      if (currentRaw !== null) {
        const parsed = parse(currentRaw);
        const normalized = normalize(kind, parsed, engine);
        if (normalized !== null) {
          if (kind === 'active' && parsed?.version !== ENGINE_VERSION) {
            const result = rawSet(keys[kind], JSON.stringify(normalized));
            if (result.ok) warnings.push(`${kind}: Spielstand wurde auf die neue App-Version aktualisiert.`);
          }
          return normalized;
        }
        rawRemove(keys[kind]);
        warnings.push(`${kind}: beschädigte lokale Daten wurden entfernt.`);
      }

      for (const version of legacyVersions) {
        const oldKey = legacyKey(kind, version);
        const oldRaw = rawGet(oldKey);
        if (oldRaw === null) continue;
        const normalized = normalize(kind, parse(oldRaw), engine);
        if (normalized === null) continue;
        const result = rawSet(keys[kind], JSON.stringify(normalized));
        if (result.ok) {
          removeLegacyKind(kind);
          warnings.push(`${kind}: lokale Daten wurden auf die neue App-Version aktualisiert.`);
        }
        return normalized;
      }
      return fallback;
    }

    function loadAll(engine) {
      warnings.length = 0;
      return {
        active: readKind('active', null, engine),
        custom: readKind('custom', [], engine),
        history: readKind('history', [], engine),
        settings: readKind('settings', null, engine),
        warnings: [...warnings],
        available: available()
      };
    }

    function kindForKey(key) {
      return Object.keys(keys).find(kind => keys[kind] === key) || null;
    }

    function getByKey(key, fallback, engine) {
      const kind = kindForKey(key);
      return kind ? readKind(kind, fallback, engine) : fallback;
    }

    function setByKey(key, value) {
      if (!kindForKey(key)) return { ok: false, error: 'Unbekannter Speicherschlüssel.' };
      return rawSet(key, JSON.stringify(value));
    }

    function removeByKey(key) {
      rawRemove(key);
    }

    function clearAll() {
      for (const key of Object.values(keys)) rawRemove(key);
      for (const version of legacyVersions) {
        for (const kind of Object.keys(keys)) rawRemove(legacyKey(kind, version));
      }
      rawRemove(IMPORT_PROBE_KEY);
    }

    function exportBackup(engine) {
      const data = loadAll(engine);
      return JSON.stringify({
        format: BACKUP_FORMAT,
        version: BACKUP_VERSION,
        exportedAt: new Date().toISOString(),
        data: {
          active: data.active,
          custom: data.custom,
          history: data.history,
          settings: data.settings
        }
      }, null, 2);
    }

    function importBackup(input, engine) {
      if (typeof input === 'string' && input.length > MAX_BACKUP_BYTES) {
        return { ok: false, error: 'Die Sicherungsdatei ist zu groß.' };
      }
      let snapshot;
      try { snapshot = typeof input === 'string' ? JSON.parse(input) : input; } catch {
        return { ok: false, error: 'Die Sicherungsdatei enthält kein gültiges JSON.' };
      }
      if (!snapshot || snapshot.format !== BACKUP_FORMAT || snapshot.version !== BACKUP_VERSION || !snapshot.data || typeof snapshot.data !== 'object') {
        return { ok: false, error: 'Die Datei ist keine unterstützte Secret-Circle-Sicherung.' };
      }

      const normalized = {
        active: snapshot.data.active === null ? null : normalize('active', snapshot.data.active, engine),
        custom: normalize('custom', snapshot.data.custom ?? [], engine),
        history: normalize('history', snapshot.data.history ?? [], engine),
        settings: snapshot.data.settings === null ? null : normalize('settings', snapshot.data.settings)
      };
      if (snapshot.data.active !== null && normalized.active === null) return { ok: false, error: 'Der enthaltene Spielstand ist ungültig oder veraltet.' };
      if (normalized.custom === null || normalized.history === null || (snapshot.data.settings !== null && normalized.settings === null)) {
        return { ok: false, error: 'Die Sicherungsdatei enthält ungültige lokale Daten.' };
      }

      const serialized = Object.fromEntries(Object.entries(normalized).map(([kind, value]) => [kind, value === null ? null : JSON.stringify(value)]));
      const preflight = rawSet(IMPORT_PROBE_KEY, JSON.stringify(serialized));
      rawRemove(IMPORT_PROBE_KEY);
      if (!preflight.ok) return { ok: false, error: preflight.error };

      const previous = Object.fromEntries(Object.entries(keys).map(([kind, key]) => [kind, rawGet(key)]));
      try {
        for (const [kind, key] of Object.entries(keys)) {
          const raw = serialized[kind];
          if (raw === null) rawRemove(key);
          else {
            const result = rawSet(key, raw);
            if (!result.ok) throw Error(result.error);
          }
        }
        removeLegacyKind('active');
        removeLegacyKind('custom');
        removeLegacyKind('history');
        removeLegacyKind('settings');
        return { ok: true, data: normalized };
      } catch (error) {
        for (const [kind, key] of Object.entries(keys)) {
          const raw = previous[kind];
          if (raw === null) rawRemove(key);
          else rawSet(key, raw);
        }
        return { ok: false, error: error?.message || 'Die Sicherung konnte nicht importiert werden.' };
      }
    }

    return {
      keys,
      keyVersion: KEY_VERSION,
      engineVersion: ENGINE_VERSION,
      backupFormat: BACKUP_FORMAT,
      backupVersion: BACKUP_VERSION,
      available,
      loadAll,
      getByKey,
      setByKey,
      removeByKey,
      clearAll,
      exportBackup,
      importBackup
    };
  }

  return { createStore, keys, KEY_VERSION, ENGINE_VERSION, BACKUP_FORMAT, BACKUP_VERSION };
});
