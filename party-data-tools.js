'use strict';

(() => {
  const PREFIX = 'secret-circle-';
  const FORMAT = 'secret-circle-complete-backup';
  const MAX_BYTES = 1_500_000;
  const exportButton = document.querySelector('#hub-export-data');
  const importButton = document.querySelector('#hub-import-trigger');
  const importInput = document.querySelector('#hub-import-data');
  const deleteButton = document.querySelector('#hub-delete-data');
  if (!exportButton || !importButton || !importInput || !deleteButton) return;

  function setStatus(message, error = false) {
    const node = document.querySelector('#hub-status');
    node.textContent = message;
    node.classList.toggle('error', error);
  }

  function collectEntries() {
    const entries = {};
    for (let index = 0; index < localStorage.length; index += 1) {
      const key = localStorage.key(index);
      if (!key?.startsWith(PREFIX)) continue;
      entries[key] = localStorage.getItem(key);
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
    const blob = new Blob([text], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `secret-circle-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.append(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    setStatus(`${Object.keys(payload.entries).length} lokale Datensätze exportiert.`);
  }

  function validateBackup(payload, rawLength) {
    if (rawLength > MAX_BYTES) throw new Error('Die Sicherungsdatei ist größer als 1,5 MB.');
    if (!payload || payload.format !== FORMAT || payload.version !== 1) throw new Error('Das ist keine unterstützte Secret-Circle-Gesamtsicherung.');
    if (!payload.entries || typeof payload.entries !== 'object' || Array.isArray(payload.entries)) throw new Error('Die Sicherung enthält keine gültigen Datensätze.');
    const entries = Object.entries(payload.entries);
    if (entries.length > 100) throw new Error('Die Sicherung enthält zu viele Datensätze.');
    for (const [key, value] of entries) {
      if (!key.startsWith(PREFIX) || key.length > 120) throw new Error(`Ungültiger Speicherschlüssel: ${key}`);
      if (typeof value !== 'string' || value.length > 1_000_000) throw new Error(`Ungültiger Wert für ${key}`);
      if (value.trim().startsWith('{') || value.trim().startsWith('[')) JSON.parse(value);
    }
    return entries;
  }

  async function importData(file) {
    const text = await file.text();
    let payload;
    try {
      payload = JSON.parse(text);
    } catch {
      throw new Error('Die Datei enthält kein gültiges JSON.');
    }
    const entries = validateBackup(payload, text.length);
    const snapshot = collectEntries();
    try {
      for (const [key] of Object.entries(snapshot)) localStorage.removeItem(key);
      for (const [key, value] of entries) localStorage.setItem(key, value);
    } catch (error) {
      for (let index = localStorage.length - 1; index >= 0; index -= 1) {
        const key = localStorage.key(index);
        if (key?.startsWith(PREFIX)) localStorage.removeItem(key);
      }
      for (const [key, value] of Object.entries(snapshot)) localStorage.setItem(key, value);
      throw new Error(`Import abgebrochen und alte Daten wiederhergestellt: ${error.message}`);
    }
    setStatus(`${entries.length} Datensätze importiert. App wird neu geladen.`);
    window.setTimeout(() => window.location.reload(), 350);
  }

  function deleteAll() {
    if (!window.confirm('Alle Secret-Circle-Daten löschen? Dazu gehören Imposter-Spiele, Hub-Spieler, Favoriten, Presets, Verlauf, Statistiken und aktive Sessions.')) return;
    const keys = [];
    for (let index = 0; index < localStorage.length; index += 1) {
      const key = localStorage.key(index);
      if (key?.startsWith(PREFIX)) keys.push(key);
    }
    keys.forEach(key => localStorage.removeItem(key));
    setStatus(`${keys.length} lokale Datensätze vollständig gelöscht.`);
    window.setTimeout(() => window.location.reload(), 350);
  }

  exportButton.addEventListener('click', exportData);
  importButton.addEventListener('click', () => importInput.click());
  importInput.addEventListener('change', async () => {
    const file = importInput.files?.[0];
    importInput.value = '';
    if (!file) return;
    try {
      await importData(file);
    } catch (error) {
      setStatus(error.message || 'Sicherung konnte nicht importiert werden.', true);
    }
  });
  deleteButton.addEventListener('click', deleteAll);

  window.SecretCirclePartyDataTools = Object.freeze({
    version: 1,
    format: FORMAT,
    collectEntries,
    validateBackup
  });
})();
