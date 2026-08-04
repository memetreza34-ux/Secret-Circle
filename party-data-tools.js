'use strict';

(() => {
  const PREFIX = 'secret-circle-';
  const FORMAT = 'secret-circle-complete-backup';
  const VERSION = 2;
  const MAX_BYTES = 1_500_000;
  const MAX_ENTRIES = 100;
  const MAX_VALUE_BYTES = 1_000_000;

  function byteLength(value) {
    const text = String(value ?? '');
    if (typeof TextEncoder === 'function') return new TextEncoder().encode(text).byteLength;
    return new Blob([text]).size;
  }

  function setStatus(message, error = false) {
    const node = document.querySelector('#hub-status');
    if (!node) return;
    node.textContent = message || '';
    node.classList.toggle('error', error);
  }

  function storageKeys() {
    const keys = [];
    for (let index = 0; index < localStorage.length; index += 1) {
      const key = localStorage.key(index);
      if (key?.startsWith(PREFIX)) keys.push(key);
    }
    return keys;
  }

  function collectEntries() {
    const entries = Object.create(null);
    for (const key of storageKeys()) {
      const value = localStorage.getItem(key);
      if (value === null) continue;
      entries[key] = value;
    }
    return entries;
  }

  function clearEntries() {
    for (const key of storageKeys()) localStorage.removeItem(key);
  }

  function writeEntries(entries) {
    for (const [key, value] of entries) localStorage.setItem(key, value);
  }

  function replaceEntries(entries) {
    const target = Array.isArray(entries) ? entries : Object.entries(entries || {});
    const snapshot = collectEntries();
    try {
      clearEntries();
      writeEntries(target);
      return { ok: true, replaced: target.length };
    } catch (error) {
      try {
        clearEntries();
        writeEntries(Object.entries(snapshot));
      } catch (rollbackError) {
        throw new Error(`Import und Rollback sind fehlgeschlagen. Bitte Browserdaten nicht weiter verändern: ${rollbackError?.message || 'unbekannter Rollback-Fehler'}`);
      }
      throw new Error(`Import abgebrochen und alte Daten wiederhergestellt: ${error?.message || 'lokaler Speicherfehler'}`);
    }
  }

  function validateBackup(payload, rawBytes) {
    if (!Number.isFinite(rawBytes) || rawBytes < 0 || rawBytes > MAX_BYTES) throw new Error('Die Sicherungsdatei ist größer als 1,5 MB.');
    if (!payload || typeof payload !== 'object' || Array.isArray(payload) || payload.format !== FORMAT || payload.version !== 1) {
      throw new Error('Das ist keine unterstützte Secret-Circle-Gesamtsicherung.');
    }
    if (!payload.entries || typeof payload.entries !== 'object' || Array.isArray(payload.entries)) {
      throw new Error('Die Sicherung enthält keine gültigen Datensätze.');
    }
    const entries = Object.entries(payload.entries);
    if (entries.length > MAX_ENTRIES) throw new Error('Die Sicherung enthält zu viele Datensätze.');
    const seen = new Set();
    for (const [key, value] of entries) {
      if (!key.startsWith(PREFIX) || key.length > 120 || seen.has(key)) throw new Error(`Ungültiger Speicherschlüssel: ${key}`);
      if (typeof value !== 'string' || byteLength(value) > MAX_VALUE_BYTES) throw new Error(`Ungültiger Wert für ${key}`);
      seen.add(key);
      const trimmed = value.trim();
      if (trimmed.startsWith('{') || trimmed.startsWith('[')) JSON.parse(value);
    }
    return entries;
  }

  function exportData() {
    const payload = {
      format: FORMAT,
      version: 1,
      exportedAt: new Date().toISOString(),
      entries: collectEntries()
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
    setStatus(`${Object.keys(payload.entries).length} lokale Datensätze exportiert.`);
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
    setStatus(`${entries.length} Datensätze importiert. App wird neu geladen.`);
    window.setTimeout(() => window.location.reload(), 350);
  }

  function deleteAll() {
    if (!window.confirm('Alle Secret-Circle-Daten löschen? Dazu gehören Imposter-Spiele, Hub-Spieler, Eigene Hub-Packs, Favoriten, Presets, Verlauf, Statistiken und aktive Sessions.')) return;
    const count = storageKeys().length;
    try {
      replaceEntries([]);
    } catch (error) {
      setStatus(`Datenlöschung abgebrochen. Der vorherige Zustand wurde soweit möglich wiederhergestellt: ${error.message}`, true);
      return;
    }
    setStatus(`${count} lokale Datensätze vollständig gelöscht.`);
    window.setTimeout(() => window.location.reload(), 350);
  }

  const exportButton = document.querySelector('#hub-export-data');
  const importButton = document.querySelector('#hub-import-trigger');
  const importInput = document.querySelector('#hub-import-data');
  const deleteButton = document.querySelector('#hub-delete-data');

  exportButton?.addEventListener('click', () => {
    try {
      exportData();
    } catch (error) {
      setStatus(error.message || 'Sicherung konnte nicht exportiert werden.', true);
    }
  });
  importButton?.addEventListener('click', () => importInput?.click());
  importInput?.addEventListener('change', async () => {
    const file = importInput.files?.[0];
    importInput.value = '';
    if (!file) return;
    try {
      await importData(file);
    } catch (error) {
      setStatus(error.message || 'Sicherung konnte nicht importiert werden.', true);
    }
  });
  deleteButton?.addEventListener('click', deleteAll);

  window.SecretCirclePartyDataTools = Object.freeze({
    version: VERSION,
    format: FORMAT,
    maximumBytes: MAX_BYTES,
    byteLength,
    collectEntries,
    validateBackup,
    replaceEntries,
    importData
  });
})();
