'use strict';

(() => {
  const C = window.SecretCirclePartyCatalog;
  if (!C) return;
  const HUB_KEY = 'secret-circle-party-hub-v1';
  const PREF_KEY = 'secret-circle-party-preferences-v1';
  const $ = selector => document.querySelector(selector);
  let installPrompt = null;

  function readJson(key, fallback) {
    try {
      const value = JSON.parse(localStorage.getItem(key));
      return value && typeof value === 'object' ? value : fallback;
    } catch {
      return fallback;
    }
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
    localStorage.setItem(PREF_KEY, JSON.stringify({ ...preferences(), ...next, version: 1 }));
  }

  function gameAllowed(game, level) {
    if (level === 'all') return true;
    if (level === 'family') return game.age === 'all';
    return game.age === 'all' || game.age === 'teen';
  }

  function applyAgeFilter() {
    const select = $('#age-filter');
    const grid = $('#game-grid');
    if (!select || !grid) return;
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

  function setAgeLevel(level) {
    const normalized = ['family', 'teen', 'all'].includes(level) ? level : 'all';
    const catalogSelect = $('#age-filter');
    const settingsSelect = $('#settings-age-level');
    if (catalogSelect) catalogSelect.value = normalized;
    if (settingsSelect) settingsSelect.value = normalized;
    savePreferences({ ageLevel: normalized });
    applyAgeFilter();
  }

  function renderAchievements() {
    const grid = $('#achievement-grid');
    if (!grid) return;
    const state = readJson(HUB_KEY, { history: [], stats: {}, favorites: [], presets: [] });
    const history = Array.isArray(state.history) ? state.history : [];
    const totalRounds = history.reduce((sum, item) => sum + (Number(item.rounds) || 0), 0);
    const uniqueGames = new Set(history.map(item => item.gameId)).size;
    const bestScore = Math.max(0, ...history.map(item => Number(item.score) || 0));
    const advanced = new Set(['two-truths', 'question-imposter', 'location-spy', 'mafia']);
    const achievements = [
      ['🎉', 'Erster Spieleabend', 'Eine Session abschließen', history.length >= 1],
      ['🔟', 'Zehn Runden', 'Insgesamt zehn Runden spielen', totalRounds >= 10],
      ['🧭', 'Entdecker', 'Fünf verschiedene Spiele ausprobieren', uniqueGames >= 5],
      ['🏆', 'Punktejäger', 'Mindestens zehn Punkte in einer Session', bestScore >= 10],
      ['⭐', 'Kurator', 'Fünf Favoriten speichern', (state.favorites?.length || 0) >= 5],
      ['👥', 'Gastgeber', 'Drei Gruppen-Presets speichern', (state.presets?.length || 0) >= 3],
      ['🕵️', 'Täuschungsprofi', 'Ein erweitertes Täuschungsspiel beenden', history.some(item => advanced.has(item.gameId))],
      ['🏃', 'Marathon', 'Eine Session mit mindestens zehn Runden', history.some(item => (item.rounds || 0) >= 10)]
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

  function openRequestedView() {
    const view = new URLSearchParams(window.location.search).get('view');
    if (!view) return;
    const button = document.querySelector(`[data-view-target="${CSS.escape(view)}"]`);
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
      installPrompt.prompt();
      await installPrompt.userChoice;
      installPrompt = null;
      button.hidden = true;
    });
    window.addEventListener('appinstalled', () => {
      installPrompt = null;
      button.hidden = true;
    });
  }

  const pref = preferences();
  const ageSelect = $('#age-filter');
  const settingsAge = $('#settings-age-level');
  if (ageSelect) ageSelect.addEventListener('change', () => setAgeLevel(ageSelect.value));
  if (settingsAge) settingsAge.addEventListener('change', () => setAgeLevel(settingsAge.value));
  setAgeLevel(pref.ageLevel);

  const defaultLength = $('#default-session-length');
  if (defaultLength) {
    defaultLength.value = String(pref.sessionLength);
    defaultLength.addEventListener('change', () => savePreferences({ sessionLength: Number(defaultLength.value) }));
  }

  const gameGrid = $('#game-grid');
  if (gameGrid) new MutationObserver(applyAgeFilter).observe(gameGrid, { childList: true });
  document.addEventListener('click', event => {
    if (event.target.closest('[data-view-target="stats"]')) window.setTimeout(renderAchievements, 0);
    if (event.target.closest('[data-view-target="games"]')) window.setTimeout(applyAgeFilter, 0);
  });

  installSupport();
  renderAchievements();
  openRequestedView();
  window.setTimeout(applyAgeFilter, 0);

  window.SecretCirclePartyHubPlus = Object.freeze({
    version: 2,
    gameAllowed,
    renderAchievements,
    preferences,
    setAgeLevel
  });
})();
