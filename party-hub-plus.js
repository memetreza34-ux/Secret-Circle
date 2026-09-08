'use strict';

(() => {
  const C = window.SecretCirclePartyCatalog;
  if (!C) return;
  const HUB_KEY = 'secret-circle-party-hub-v1';
  const PREF_KEY = 'secret-circle-party-preferences-v1';
  const VERSION = 5;
  const $ = selector => document.querySelector(selector);
  let installPrompt = null;

  function setStatus(message, error = false) {
    const node = $('#hub-status');
    if (!node) return;
    node.textContent = message || '';
    node.classList.toggle('error', error);
  }

  function readJson(key, fallback) {
    try {
      const value = JSON.parse(localStorage.getItem(key));
      return value && typeof value === 'object' && !Array.isArray(value) ? value : fallback;
    } catch {
      return fallback;
    }
  }

  function safeInteger(value) {
    const number = Number(value);
    return Number.isInteger(number) && number >= 0 ? number : 0;
  }

  function preferences() {
    const value = readJson(PREF_KEY, {});
    return {
      version: 1,
      ageLevel: ['family', 'teen', 'all'].includes(value.ageLevel) ? value.ageLevel : 'all',
      sessionLength: [3, 5, 10, 20].includes(value.sessionLength) ? value.sessionLength : 5
    };
  }

  function savePreferences(next) {
    const value = { ...preferences(), ...next, version: 1 };
    if (!['family', 'teen', 'all'].includes(value.ageLevel)) value.ageLevel = 'all';
    if (![3, 5, 10, 20].includes(value.sessionLength)) value.sessionLength = 5;
    try {
      localStorage.setItem(PREF_KEY, JSON.stringify(value));
      return true;
    } catch (error) {
      setStatus(`Einstellung gilt nur bis zum Neuladen, weil sie nicht gespeichert werden konnte: ${error?.message || 'lokaler Speicherfehler'}`, true);
      return false;
    }
  }

  function gameAllowed(game, level) {
    if (level === 'all') return true;
    if (level === 'family') return game.age === 'all';
    return game.age === 'all' || game.age === 'teen';
  }

  function releaseStructureOwnsGrid() {
    return Boolean($('#release-tier-filter'));
  }

  function applyAgeFilter() {
    const select = $('#age-filter');
    const grid = $('#game-grid');
    if (!select || !grid) return;
    /* Ist die Reifegrad-Schicht installiert, filtert sie Alter und Stufe
       gemeinsam und besitzt Kartensichtbarkeit, Ergebniszähler und Leermeldung.
       Ein zweiter Filter schriebe dieselben Knoten gegenläufig; da beide Module
       das Grid per MutationObserver überwachen, lösen sie sich sonst endlos
       gegenseitig aus und blockieren den Main-Thread. */
    if (releaseStructureOwnsGrid()) return;
    const level = select.value;
    let visible = 0;
    grid.querySelectorAll('[data-game-id]').forEach(card => {
      const game = C.getGame(card.dataset.gameId);
      const allowed = game ? gameAllowed(game, level) : true;
      card.hidden = !allowed;
      if (allowed) visible += 1;
    });
    const result = $('#result-count');
    if (result) result.textContent = String(visible);
    const empty = grid.querySelector('.age-empty-state');
    if (!visible && !empty) {
      const message = document.createElement('p');
      message.className = 'empty-state age-empty-state';
      message.textContent = 'Für diese Altersstufe sind mit den aktuellen Filtern keine Spiele sichtbar.';
      grid.append(message);
    } else if (visible && empty) empty.remove();
  }

  let syncingAgeLevel = false;
  function setAgeLevel(level, persist = true) {
    if (syncingAgeLevel) return;
    const normalized = ['family', 'teen', 'all'].includes(level) ? level : 'all';
    const catalogSelect = $('#age-filter');
    const settingsSelect = $('#settings-age-level');
    if (catalogSelect) catalogSelect.value = normalized;
    if (settingsSelect) settingsSelect.value = normalized;
    if (persist) savePreferences({ ageLevel: normalized });
    /* Der Wert wird hier programmatisch gesetzt, das löst kein change-Event aus.
       Besitzt die Reifegrad-Schicht das Grid, muss sie darüber informiert
       werden, sonst bliebe die Auswahl ohne sichtbare Wirkung. Das Flag
       verhindert, dass der eigene change-Listener setAgeLevel erneut aufruft. */
    if (releaseStructureOwnsGrid()) {
      syncingAgeLevel = true;
      try { catalogSelect?.dispatchEvent(new Event('change', { bubbles: true })); }
      finally { syncingAgeLevel = false; }
    } else applyAgeFilter();
  }

  function repairStatsFromHistory() {
    const state = readJson(HUB_KEY, null);
    if (!state || state.version !== 1 || !Array.isArray(state.history)) return false;
    if (!state.stats || typeof state.stats !== 'object' || Array.isArray(state.stats)) state.stats = {};
    const observed = Object.create(null);
    for (const item of state.history) {
      if (!item || typeof item.gameId !== 'string' || !C.getGame(item.gameId)) continue;
      const entry = observed[item.gameId] || { plays: 0, rounds: 0, best: 0 };
      entry.plays += 1;
      entry.rounds += safeInteger(item.rounds);
      entry.best = Math.max(entry.best, safeInteger(item.score));
      observed[item.gameId] = entry;
    }
    let changed = false;
    for (const [gameId, entry] of Object.entries(observed)) {
      const raw = state.stats[gameId];
      const current = raw && typeof raw === 'object' && !Array.isArray(raw) ? raw : {};
      const repaired = {
        plays: Math.max(safeInteger(current.plays), entry.plays),
        rounds: Math.max(safeInteger(current.rounds), entry.rounds),
        best: Math.max(safeInteger(current.best), entry.best)
      };
      if (repaired.plays !== current.plays || repaired.rounds !== current.rounds || repaired.best !== current.best) {
        state.stats[gameId] = repaired;
        changed = true;
      }
    }
    if (!changed) return false;
    try {
      localStorage.setItem(HUB_KEY, JSON.stringify(state));
      return true;
    } catch (error) {
      setStatus(`Statistik konnte nicht repariert und gespeichert werden: ${error?.message || 'lokaler Speicherfehler'}`, true);
      return false;
    }
  }

  function renderAchievements() {
    repairStatsFromHistory();
    const grid = $('#achievement-grid');
    if (!grid) return;
    const state = readJson(HUB_KEY, { history: [], stats: {}, favorites: [], presets: [] });
    const history = Array.isArray(state.history) ? state.history.filter(item => item && C.getGame(item.gameId)) : [];
    const totalRounds = history.reduce((sum, item) => sum + safeInteger(item.rounds), 0);
    const uniqueGames = new Set(history.map(item => item.gameId)).size;
    const bestScore = Math.max(0, ...history.map(item => safeInteger(item.score)));
    const advanced = new Set(['two-truths', 'question-imposter', 'location-spy', 'mafia']);
    const achievements = [
      ['🎉', 'Erster Spieleabend', 'Eine Session abschließen', history.length >= 1],
      ['🔟', 'Zehn Runden', 'Insgesamt zehn Runden spielen', totalRounds >= 10],
      ['🧭', 'Entdecker', 'Fünf verschiedene Spiele ausprobieren', uniqueGames >= 5],
      ['🏆', 'Punktejäger', 'Mindestens zehn Punkte in einer Session', bestScore >= 10],
      ['⭐', 'Kurator', 'Fünf Favoriten speichern', (Array.isArray(state.favorites) ? state.favorites.length : 0) >= 5],
      ['👥', 'Gastgeber', 'Drei Gruppen-Presets speichern', (Array.isArray(state.presets) ? state.presets.length : 0) >= 3],
      ['🕵️', 'Täuschungsprofi', 'Ein erweitertes Täuschungsspiel beenden', history.some(item => advanced.has(item.gameId))],
      ['🏃', 'Marathon', 'Eine Session mit mindestens zehn Runden', history.some(item => safeInteger(item.rounds) >= 10)]
    ];
    grid.replaceChildren();
    achievements.forEach(([icon, title, description, unlocked]) => {
      const card = document.createElement('article');
      card.className = `achievement-card${unlocked ? '' : ' locked'}`;
      const heading = document.createElement('strong');
      heading.textContent = `${icon} ${title}`;
      const text = document.createElement('span');
      text.textContent = unlocked ? 'Freigeschaltet' : description;
      card.append(heading, text);
      grid.append(card);
    });
    const count = $('#achievement-count');
    if (count) count.textContent = String(achievements.filter(item => item[3]).length);
  }

  function fixDetailAction(gameId) {
    const game = C.getGame(gameId);
    const button = $('#start-selected-game');
    if (!game || !button) return;
    if (game.advancedMode) button.textContent = `${game.title} öffnen`;
    else if (game.id === 'imposter') button.textContent = 'Word Imposter öffnen';
  }

  function escapeSelector(value) {
    if (window.CSS?.escape) return window.CSS.escape(value);
    return String(value).replace(/[^a-zA-Z0-9_-]/g, character => `\\${character.codePointAt(0).toString(16)} `);
  }

  function openRequestedView() {
    const view = new URLSearchParams(window.location.search).get('view');
    if (!view) return;
    const button = document.querySelector(`[data-view-target="${escapeSelector(view)}"]`);
    button?.click();
  }

  function installSupport() {
    const button = $('#hub-install-app');
    if (!button) return;
    window.addEventListener('beforeinstallprompt', event => {
      event.preventDefault();
      installPrompt = event;
      button.hidden = false;
    });
    button.addEventListener('click', async () => {
      if (!installPrompt) return;
      try {
        installPrompt.prompt();
        await installPrompt.userChoice;
      } finally {
        installPrompt = null;
        button.hidden = true;
      }
    });
    window.addEventListener('appinstalled', () => {
      installPrompt = null;
      button.hidden = true;
    });
  }

  const pref = preferences();
  const ageSelect = $('#age-filter');
  const settingsAge = $('#settings-age-level');
  /* Nur echte Auswahl speichern. party-filter-state.js stellt beim Laden seine
     eigenen Katalogfilter wieder her und feuert dabei ein change-Ereignis auf
     demselben Feld; dieses ist als Wiederherstellung markiert und darf die
     zuvor gespeicherte Altersauswahl nicht überschreiben. */
  const userChosen = event => event?.secretCircleRestored !== true;
  if (ageSelect) ageSelect.addEventListener('change', event => setAgeLevel(ageSelect.value, userChosen(event)));
  if (settingsAge) settingsAge.addEventListener('change', event => setAgeLevel(settingsAge.value, userChosen(event)));
  setAgeLevel(pref.ageLevel, false);

  const defaultLength = $('#default-session-length');
  if (defaultLength) {
    defaultLength.value = String(pref.sessionLength);
    defaultLength.addEventListener('change', () => savePreferences({ sessionLength: Number(defaultLength.value) }));
  }

  const gameGrid = $('#game-grid');
  if (gameGrid) new MutationObserver(applyAgeFilter).observe(gameGrid, { childList: true });
  document.addEventListener('click', event => {
    if (event.target.closest('[data-view-target="stats"]')) window.setTimeout(() => {
      repairStatsFromHistory();
      renderAchievements();
    }, 0);
    if (event.target.closest('[data-view-target="games"]')) window.setTimeout(applyAgeFilter, 0);
    if (event.target.closest('#exit-game')) window.setTimeout(repairStatsFromHistory, 0);
    const open = event.target.closest('[data-open-game]');
    if (open) window.setTimeout(() => fixDetailAction(open.dataset.openGame), 0);
  });

  installSupport();
  repairStatsFromHistory();
  renderAchievements();
  openRequestedView();
  window.setTimeout(applyAgeFilter, 0);

  window.SecretCirclePartyHubPlus = Object.freeze({
    version: VERSION,
    gameAllowed,
    renderAchievements,
    preferences,
    savePreferences,
    setAgeLevel,
    fixDetailAction,
    repairStatsFromHistory,
    escapeSelector
  });
})();
