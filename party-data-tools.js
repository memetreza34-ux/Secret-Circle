'use strict';

(() => {
  const registry = window.SecretCircleBackupSchemas;
  const schema = registry?.get?.('complete');
  if (!registry || !schema || typeof registry.isAllowedCompleteStorageKey !== 'function') {
    throw new Error('Zentrales Secret-Circle-Backup-Schema fehlt.');
  }

  const PREFIX = schema.storagePrefix;
  const FORMAT = schema.format;
  const FORMAT_VERSION = schema.version;
  const MAX_BYTES = schema.maximumBytes;
  const MAX_ENTRIES = schema.maximumEntries;
  const MAX_VALUE_BYTES = schema.maximumValueBytes;
  const VERSION = 5;

  function byteLength(value) {
    return registry.byteLength(value);
  }

  function setStatus(message, error = false) {
    const node = document.querySelector('#hub-status');
    if (!node) return;
    node.textContent = message || '';
    node.classList.toggle('error', error);
  }

  function allSecretCircleKeys() {
    const keys = [];
    for (let index = 0; index < localStorage.length; index += 1) {
      const key = localStorage.key(index);
      if (key?.startsWith(PREFIX)) keys.push(key);
    }
    return keys;
  }

  function backupKeys() {
    return allSecretCircleKeys().filter(key => registry.isAllowedCompleteStorageKey(key));
  }

  function collectEntries() {
    const entries = Object.create(null);
    for (const key of backupKeys()) {
      const value = localStorage.getItem(key);
      if (value !== null) entries[key] = value;
    }
    return entries;
  }

  function snapshotManagedEntries() {
    return collectEntries();
  }

  function snapshotAllEntries() {
    const entries = Object.create(null);
    for (const key of allSecretCircleKeys()) {
      const value = localStorage.getItem(key);
      if (value !== null) entries[key] = value;
    }
    return entries;
  }

  function clearManagedEntries() {
    for (const key of backupKeys()) localStorage.removeItem(key);
  }

  function clearAllSecretCircleEntries() {
    for (const key of allSecretCircleKeys()) localStorage.removeItem(key);
  }

  function writeEntries(entries) {
    for (const [key, value] of entries) localStorage.setItem(key, value);
  }

  function replaceEntries(entries) {
    const target = Array.isArray(entries) ? entries : Object.entries(entries || {});
    const snapshot = snapshotManagedEntries();
    try {
      // A restore owns only namespaces registered by BackupSchemaRegistry. Unknown/future
      // Secret Circle keys must survive an older backup import instead of being erased.
      clearManagedEntries();
      writeEntries(target);
      return { ok: true, replaced: target.length };
    } catch (error) {
      try {
        clearManagedEntries();
        writeEntries(Object.entries(snapshot));
      } catch (rollbackError) {
        throw new Error(`Import und Rollback sind fehlgeschlagen. Bitte Browserdaten nicht weiter verändern: ${rollbackError?.message || 'unbekannter Rollback-Fehler'}`);
      }
      throw new Error(`Import abgebrochen und alte Daten wiederhergestellt: ${error?.message || 'lokaler Speicherfehler'}`);
    }
  }

  function parseStoredJson(key, value) {
    let parsed;
    try {
      parsed = JSON.parse(value);
    } catch {
      throw new Error(`Ungültiges JSON für ${key}`);
    }
    if (parsed === null || (typeof parsed !== 'object')) {
      throw new Error(`Ungültige Datenstruktur für ${key}`);
    }
    return parsed;
  }

  function validateBackup(payload, rawBytes) {
    if (!Number.isFinite(rawBytes) || rawBytes < 0 || rawBytes > MAX_BYTES) {
      throw new Error('Die Sicherungsdatei ist größer als 1,5 MB.');
    }
    registry.validateHeader(payload, 'complete');
    if (!payload.entries || typeof payload.entries !== 'object' || Array.isArray(payload.entries)) {
      throw new Error('Die Sicherung enthält keine gültigen Datensätze.');
    }
    const entries = Object.entries(payload.entries);
    if (entries.length > MAX_ENTRIES) throw new Error('Die Sicherung enthält zu viele Datensätze.');
    const seen = new Set();
    for (const [key, value] of entries) {
      if (!registry.isAllowedCompleteStorageKey(key) || seen.has(key)) {
        throw new Error(`Nicht unterstützter Speicherschlüssel: ${key}`);
      }
      if (typeof value !== 'string' || byteLength(value) > MAX_VALUE_BYTES) {
        throw new Error(`Ungültiger Wert für ${key}`);
      }
      seen.add(key);
      // Every currently managed Secret Circle storage family is JSON-backed. Accepting
      // arbitrary plain text would let a formally allowed key overwrite valid data with
      // a state that the owning runtime can only discard on its next load.
      parseStoredJson(key, value);
    }
    return entries;
  }

  function exportData() {
    const entries = collectEntries();
    const unsupported = allSecretCircleKeys().filter(key => !registry.isAllowedCompleteStorageKey(key));
    const payload = {
      format: FORMAT,
      version: FORMAT_VERSION,
      exportedAt: new Date().toISOString(),
      entries
    };
    const text = JSON.stringify(payload, null, 2);
    if (byteLength(text) > MAX_BYTES) throw new Error('Die lokalen Daten sind zu groß für eine einzelne Sicherungsdatei.');
    const blob = new Blob([text], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `secret-circle-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.append(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1_000);
    const suffix = unsupported.length
      ? ` ${unsupported.length} unbekannte alte oder neuere Namespace-Datensätze wurden aus Sicherheitsgründen nicht exportiert und werden bei einem Import nicht verändert.`
      : '';
    setStatus(`${Object.keys(entries).length} anerkannte lokale Datensätze exportiert.${suffix}`);
  }

  async function importData(file) {
    if (!file || typeof file.text !== 'function') throw new Error('Keine lesbare Sicherungsdatei ausgewählt.');
    if (Number.isFinite(file.size) && file.size > MAX_BYTES) throw new Error('Die Sicherungsdatei ist größer als 1,5 MB.');
    const text = await file.text();
    const bytes = byteLength(text);
    if (bytes > MAX_BYTES) throw new Error('Die Sicherungsdatei ist größer als 1,5 MB.');
    let payload;
    try {
      payload = JSON.parse(text);
    } catch {
      throw new Error('Die Datei enthält kein gültiges JSON.');
    }
    const entries = validateBackup(payload, bytes);
    replaceEntries(entries);
    setStatus(`${entries.length} anerkannte Datensätze importiert. Eigene Spiele und der Hub werden neu geladen.`);
    window.setTimeout(() => window.location.reload(), 350);
  }

  function deleteAll() {
    if (!window.confirm('Alle Secret-Circle-Daten löschen? Dazu gehören Word Imposter, Hub-Spieler, Favoriten, Presets, Verlauf, Statistiken, aktive Sessions, eigene Packs und selbst erstellte Spiele.')) return;
    const count = allSecretCircleKeys().length;
    const snapshot = snapshotAllEntries();
    try {
      clearAllSecretCircleEntries();
    } catch (error) {
      try { writeEntries(Object.entries(snapshot)); } catch {}
      setStatus(`Datenlöschung abgebrochen. Der vorherige Zustand wurde soweit möglich wiederhergestellt: ${error.message}`, true);
      return;
    }
    setStatus(`${count} lokale Secret-Circle-Datensätze vollständig gelöscht.`);
    window.setTimeout(() => window.location.reload(), 350);
  }

  const exportButton = document.querySelector('#hub-export-data');
  const importButton = document.querySelector('#hub-import-trigger');
  const importInput = document.querySelector('#hub-import-data');
  const deleteButton = document.querySelector('#hub-delete-data');

  exportButton?.addEventListener('click', () => {
    try { exportData(); }
    catch (error) { setStatus(error.message || 'Sicherung konnte nicht exportiert werden.', true); }
  });
  importButton?.addEventListener('click', () => importInput?.click());
  importInput?.addEventListener('change', async () => {
    const file = importInput.files?.[0];
    importInput.value = '';
    if (!file) return;
    try { await importData(file); }
    catch (error) { setStatus(error.message || 'Sicherung konnte nicht importiert werden.', true); }
  });
  deleteButton?.addEventListener('click', deleteAll);

  window.SecretCirclePartyDataTools = Object.freeze({
    version: VERSION,
    format: FORMAT,
    formatVersion: FORMAT_VERSION,
    maximumBytes: MAX_BYTES,
    byteLength,
    allSecretCircleKeys,
    backupKeys,
    collectEntries,
    validateBackup,
    replaceEntries,
    importData
  });
})();
