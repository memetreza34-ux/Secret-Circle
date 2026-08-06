(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.SecretCircleBackupSchemas = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function createBackupSchemaRegistry() {
  'use strict';

  const VERSION = 1;
  const MAX_FILE_BYTES = 1_500_000;

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
      scope: 'Alle lokalen Secret-Circle-Daten',
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

  return Object.freeze({
    version: VERSION,
    maximumFileBytes: MAX_FILE_BYTES,
    schemas,
    list: Object.freeze(Object.values(schemas)),
    byteLength,
    get,
    identify,
    validateHeader,
    assertSize
  });
});
