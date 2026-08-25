(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.SecretCircleBackupSchemas = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function createBackupSchemaRegistry() {
  'use strict';

  const VERSION = 2;
  const MAX_FILE_BYTES = 1_500_000;
  const COMPLETE_STORAGE_KEYS = Object.freeze([
    'secret-circle-active-v7',
    'secret-circle-custom-v7',
    'secret-circle-history-v7',
    'secret-circle-settings-v7',
    'secret-circle-party-hub-v1',
    'secret-circle-party-hub-active-v1',
    'secret-circle-party-active-v1',
    'secret-circle-party-quick-active-v1',
    'secret-circle-party-mega-active-v1',
    'secret-circle-party-viral-active-v1',
    'secret-circle-party-created-active-v1',
    'secret-circle-party-created-games-v1',
    'secret-circle-party-custom-packs-v1',
    'secret-circle-party-night-v1',
    'secret-circle-party-preferences-v1',
    'secret-circle-party-catalog-filters-v1'
  ]);
  const COMPLETE_STORAGE_KEY_SET = new Set(COMPLETE_STORAGE_KEYS);

  const schemas = Object.freeze({
    wordImposter: Object.freeze({
      id: 'word-imposter',
      format: 'secret-circle-backup',
      version: 1,
      maximumBytes: MAX_FILE_BYTES,
      scope: 'Word Imposter: Spielstand, eigene Begriffe, Verlauf und Einstellungen',
      extension: '.json'
    }),
    complete: Object.freeze({
      id: 'complete',
      format: 'secret-circle-complete-backup',
      version: 1,
      maximumBytes: MAX_FILE_BYTES,
      maximumEntries: 100,
      maximumValueBytes: 1_000_000,
      storagePrefix: 'secret-circle-',
      allowedKeys: COMPLETE_STORAGE_KEYS,
      // Backward-compatible descriptor name for older audits/UI. Values are exact,
      // not wildcard families, so a future storage version survives an older restore.
      allowedKeyFamilies: COMPLETE_STORAGE_KEYS,
      scope: 'Alle aktuell anerkannten lokalen Secret-Circle-Daten',
      extension: '.json'
    }),
    creatorLibrary: Object.freeze({
      id: 'creator-library',
      format: 'secret-circle-created-games',
      version: 1,
      maximumBytes: MAX_FILE_BYTES,
      maximumGames: 40,
      maximumPacksPerGame: 8,
      maximumCardsPerPack: 200,
      scope: 'Selbst erstellte Spiele und ihre Inhaltspakete',
      extension: '.json'
    })
  });

  function byteLength(value) {
    const text = String(value ?? '');
    if (typeof TextEncoder === 'function') return new TextEncoder().encode(text).byteLength;
    if (typeof Buffer === 'function') return Buffer.byteLength(text, 'utf8');
    if (typeof Blob === 'function') return new Blob([text]).size;
    return encodeURIComponent(text).replace(/%[0-9A-F]{2}|./gi, 'x').length;
  }

  function isObject(value) {
    return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
  }

  function get(id) {
    return Object.values(schemas).find(schema => schema.id === id) || null;
  }

  function identify(payload) {
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) return null;
    const format = String(payload.format ?? payload.type ?? '');
    const version = Number(payload.version);
    return Object.values(schemas).find(schema => schema.format === format && schema.version === version) || null;
  }

  function validateHeader(payload, expectedId) {
    const expected = get(expectedId);
    if (!expected) throw new Error(`Unbekanntes Sicherungsschema: ${expectedId}`);
    const actual = identify(payload);
    if (!actual || actual.id !== expected.id) {
      throw new Error(`Die Datei entspricht nicht dem Schema „${expected.id}“ Version ${expected.version}.`);
    }
    return actual;
  }

  function assertSize(value, schemaId) {
    const schema = get(schemaId);
    if (!schema) throw new Error(`Unbekanntes Sicherungsschema: ${schemaId}`);
    const bytes = byteLength(value);
    if (bytes > schema.maximumBytes) throw new Error('Die Sicherungsdatei ist größer als 1,5 MB.');
    return bytes;
  }

  function isAllowedCompleteStorageKey(value) {
    const key = String(value ?? '');
    return key.length <= 120 && COMPLETE_STORAGE_KEY_SET.has(key);
  }

  function validateCompleteStorageValue(keyInput, value) {
    const key = String(keyInput ?? '');
    if (!isAllowedCompleteStorageKey(key)) return false;

    switch (key) {
      case 'secret-circle-active-v7':
        return isObject(value) && value.version === 7;
      case 'secret-circle-custom-v7':
      case 'secret-circle-history-v7':
        return Array.isArray(value);
      case 'secret-circle-settings-v7':
        return isObject(value);
      case 'secret-circle-party-hub-v1':
        return isObject(value) && value.version === 1 && Array.isArray(value.players);
      case 'secret-circle-party-hub-active-v1':
        return isObject(value) && value.version === 1 && isObject(value.session);
      case 'secret-circle-party-active-v1':
        return isObject(value) && [1, 2].includes(value.version) && typeof value.gameId === 'string' && isObject(value.session);
      case 'secret-circle-party-quick-active-v1':
      case 'secret-circle-party-mega-active-v1':
      case 'secret-circle-party-viral-active-v1':
      case 'secret-circle-party-created-active-v1':
        return isObject(value) && value.version === 1 && typeof value.gameId === 'string';
      case 'secret-circle-party-created-games-v1':
        return isObject(value) && value.version === 1 && Array.isArray(value.games);
      case 'secret-circle-party-custom-packs-v1':
        return isObject(value) && value.version === 1 && Array.isArray(value.packs);
      case 'secret-circle-party-night-v1':
        return isObject(value) && value.version === 1 && Array.isArray(value.steps);
      case 'secret-circle-party-preferences-v1':
      case 'secret-circle-party-catalog-filters-v1':
        return isObject(value) && value.version === 1;
      default:
        return false;
    }
  }

  return Object.freeze({
    version: VERSION,
    maximumFileBytes: MAX_FILE_BYTES,
    completeStorageKeys: COMPLETE_STORAGE_KEYS,
    schemas,
    list: Object.freeze(Object.values(schemas)),
    byteLength,
    get,
    identify,
    validateHeader,
    assertSize,
    isAllowedCompleteStorageKey,
    validateCompleteStorageValue
  });
});