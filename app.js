'use strict';

const E = window.SecretCircleEngine;
const CONTENT = window.SecretCircleContent;
const STORE = window.SecretCircleStore;
if (!CONTENT?.words || !CONTENT?.labels) throw Error('Secret-Circle-Inhalte konnten nicht geladen werden.');
if (!STORE?.keys || !STORE?.loadAll) throw Error('Secret-Circle-Datenspeicher konnte nicht geladen werden.');

const WORDS = CONTENT.words;
const LABELS = CONTENT.labels;
const KEYS = STORE.keys;
const persisted = STORE.loadAll(E);
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

let game = null;
let timer = null;
let cardVisible = false;
let installPrompt = null;
let custom = persisted.custom;
let history = persisted.history;
let voteIndex = 0;

function esc(value) {
  return String(value ?? '').replace(/[&<>"']/g, character => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[character]);
}

function makeId() {
  return globalThis.crypto?.randomUUID?.() || `sc-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function screen(id) {
  $$('[data-screen]').forEach(node => { node.hidden = node.id !== id; });
  const target = $(`#${id}`);
  requestAnimationFrame(() => target?.focus?.());
}

function setStatus(message = '', error = false) {
  const node = $('#status');
  node.textContent = message;
  node.classList.toggle('error', error);
}

function read(key, fallback) {
  return STORE.getByKey(key, fallback, E);
}

function write(key, value) {
  const result = STORE.setByKey(key, value);
  if (!result.ok) setStatus('Lokale Daten konnten nicht gespeichert werden. Prüfe den verfügbaren Gerätespeicher.', true);
  return result.ok;
}

function remove(key) {
  STORE.removeByKey(key);
}

function categoryEntries(id) {
  if (id === 'all') return Object.values(WORDS).flat().concat(custom.flatMap(item => item.entries));
  if (id.startsWith('custom:')) {
    const item = custom.find(entry => entry.id === id.slice(7));
    if (!item) throw Error('Eigene Kategorie wurde nicht gefunden.');
    return item.entries;
  }
  if (!WORDS[id]) throw Error('Kategorie wurde nicht gefunden.');
  return WORDS[id];
}

function categoryName(id) {
  if (id === 'all') return 'Gemischt';
  if (id.startsWith('custom:')) return custom.find(item => item.id === id.slice(7))?.name || 'Eigene Kategorie';
  return LABELS[id] || id;
}

function renderCategories() {
  const select = $('#category');
  const current = select.value;
  select.innerHTML = '<option value="all">Gemischt</option>'
    + Object.keys(WORDS).map(id => `<option value="${esc(id)}">${esc(LABELS[id])}</option>`).join('')
    + (custom.length
      ? `<optgroup label="Eigene Kategorien">${custom.map(item => `<option value="custom:${esc(item.id)}">${esc(item.name)}</option>`).join('')}</optgroup>`
      : '');
  if ([...select.options].some(option => option.value === current)) select.value = current;
  renderCustomList();
}

function renderCustomList() {
  $('#custom-list').innerHTML = custom.map(item => `
    <div class="custom-row">
      <div><strong>${esc(item.name)}</strong><span>${item.entries.length} Begriffe</span></div>
      <button type="button" class="secondary compact" data-delete-category="${esc(item.id)}">Löschen</button>
    </div>`).join('') || '<p class="muted">Noch keine eigenen Kategorien.</p>';
}

function setupValues() {
  return {
    players: $('#players').value,
    category: $('#category').value,
    imposterCount: Number($('#imposters').value),
    useHint: $('#hint').checked,
    roundSeconds: Number($('#duration').value) * 60,
    matchRounds: Number($('#match-rounds').value)
  };
}

function saveSettings() {
  write(KEYS.settings, {
    players: $('#players').value,
    category: $('#category').value,
    imposterCount: $('#imposters').value,
    useHint: $('#hint').checked,
    duration: $('#duration').value,
    matchRounds: $('#match-rounds').value
  });
}

function restoreSettings() {
  const settings = read(KEYS.settings, null);
  if (!settings) return;
  $('#players').value = settings.players || $('#players').value;
  $('#imposters').value = settings.imposterCount || '1';
  $('#hint').checked = settings.useHint !== false;
  $('#duration').value = settings.duration || '3';
  $('#match-rounds').value = settings.matchRounds || '5';
  renderCategories();
  if ([...$('#category').options].some(option => option.value === settings.category)) $('#category').value = settings.category;
}

function saveGame() {
  if (game) write(KEYS.active, game);
  else remove(KEYS.active);
  updateResume();
}

function updateResume() {
  const active = read(KEYS.active, null);
  const box = $('#resume-box');
  box.hidden = !active;
  if (active) $('#resume-text').textContent = `Runde ${active.currentRound}/${active.matchRounds} · ${active.players.length} Personen · ${active.category}`;
}

function createRoundOptions(values) {
  return {
    ...values,
    entries: categoryEntries(values.category),
    category: categoryName(values.category),
    seed: makeId()
  };
}

function startGame() {
  setStatus();
  try {
    const values = setupValues();
    game = E.createGame(createRoundOptions(values));
    cardVisible = false;
    voteIndex = 0;
    saveSettings();
    saveGame();
    showGame();
  } catch (error) {
    setStatus(error.message, true);
  }
}

function showGame() {
  if (!game) {
    screen('setup-screen');
    return;
  }
  clearTimer();
  if (game.phase === 'reveal') renderReveal();
  else if (game.phase === 'discussion') renderDiscussion();
  else if (game.phase === 'voting' || game.phase === 'tie_break') renderVoting();
  else if (game.phase === 'guess') renderGuess();
  else renderResult();
}

function renderReveal() {
  screen('reveal-screen');
  cardVisible = false;
  const player = game.revealOrder[game.revealIndex];
  $('#reveal-progress').textContent = `Runde ${game.currentRound}/${game.matchRounds} · Karte ${game.revealIndex + 1} von ${game.revealOrder.length}`;
  $('#player-name').textContent = player;
  $('#secret').hidden = true;
  $('#show-card').hidden = false;
  $('#next-player').hidden = true;
  $('#handoff-note').textContent = 'Nur diese Person darf jetzt auf den Bildschirm schauen.';
}

function revealCard() {
  const player = game.revealOrder[game.revealIndex];
  const role = E.roleFor(game, player);
  cardVisible = true;
  $('#role').textContent = role.label;
  $('#word').textContent = role.value;
  $('#hint-text').textContent = role.instruction;
  $('#secret').hidden = false;
  $('#show-card').hidden = true;
  $('#next-player').hidden = false;
  $('#handoff-note').textContent = 'Merken, Karte schließen und Gerät weitergeben.';
  $('#next-player').focus();
}

function nextPlayer() {
  if (!cardVisible) return;
  game = E.advanceReveal(game);
  cardVisible = false;
  saveGame();
  showGame();
}

function renderDiscussion() {
  screen('round-screen');
  $('#round-number').textContent = `${game.currentRound}/${game.matchRounds}`;
  $('#round-category').textContent = game.category;
  $('#round-players').textContent = `${game.players.length} Personen · ${game.imposters.length} Imposter`;
  updateTime();
}

function updateTime() {
  const value = Math.max(0, game?.remainingSeconds || 0);
  const minutes = String(Math.floor(value / 60)).padStart(2, '0');
  const seconds = String(value % 60).padStart(2, '0');
  $('#time').textContent = `${minutes}:${seconds}`;
}

function toggleTimer() {
  if (timer) {
    clearTimer();
    $('#timer-toggle').textContent = 'Timer fortsetzen';
    return;
  }
  if (!game || game.remainingSeconds <= 0) return;
  $('#timer-toggle').textContent = 'Timer pausieren';
  timer = setInterval(() => {
    game = E.setRemaining(game, Math.max(0, game.remainingSeconds - 1));
    updateTime();
    saveGame();
    if (game.remainingSeconds === 0) {
      clearTimer();
      $('#timer-toggle').textContent = 'Zeit abgelaufen';
      setStatus('Die Diskussionszeit ist abgelaufen.');
      navigator.vibrate?.([180, 100, 180]);
    }
  }, 1000);
}

function clearTimer() {
  if (timer) clearInterval(timer);
  timer = null;
}

function beginVoting() {
  clearTimer();
  game = E.startVoting(game);
  voteIndex = 0;
  saveGame();
  renderVoting();
}

function renderVoting() {
  if (game.phase === 'tie_break') {
    game = E.startVoting(game);
    voteIndex = 0;
    saveGame();
  }
  screen('vote-screen');
  const voter = game.players[voteIndex];
  const tie = game.voteLeaders.length > 0;
  $('#vote-progress').textContent = `${tie ? 'Stichwahl · ' : ''}Stimme ${voteIndex + 1} von ${game.players.length}`;
  $('#voter-name').textContent = `${voter}, wen verdächtigst du?`;
  const candidates = (tie ? game.voteLeaders : game.players).filter(name => name !== voter);
  $('#vote-options').innerHTML = candidates
    .map(name => `<button type="button" class="vote-option" data-vote-target="${esc(name)}">${esc(name)}</button>`)
    .join('');
  $('#vote-options button')?.focus();
}

function castVote(target) {
  try {
    const voter = game.players[voteIndex];
    game = E.castVote(game, voter, target);
    voteIndex += 1;
    if (voteIndex < game.players.length) {
      saveGame();
      renderVoting();
      return;
    }
    game = E.resolveVote(game);
    saveGame();
    showGame();
  } catch (error) {
    setStatus(error.message, true);
  }
}

function renderGuess() {
  screen('guess-screen');
  $('#eliminated-player').textContent = game.eliminatedPlayer;
  $('#imposter-guess').value = '';
  $('#imposter-guess').focus();
}

function submitGuess() {
  try {
    game = E.submitImposterGuess(game, $('#imposter-guess').value);
    completeRound();
  } catch (error) {
    setStatus(error.message, true);
    $('#imposter-guess').focus();
  }
}

function completeRound() {
  history = [E.historyEntry(game), ...history.filter(item => item.id !== game.id)].slice(0, 20);
  write(KEYS.history, history);
  saveGame();
  renderResult();
}

function renderResult() {
  screen('result-screen');
  $('#result-heading').textContent = game.winner === 'innocents' ? 'Die Gruppe gewinnt' : 'Die Imposter gewinnen';
  $('#result-word').textContent = game.word;
  $('#result-imposters').innerHTML = game.imposters.map(name => `<li>${esc(name)}</li>`).join('');
  $('#result-meta').textContent = `${game.category} · Runde ${game.currentRound}/${game.matchRounds} · Ausgeschieden: ${game.eliminatedPlayer || 'niemand'}`;
  $('#leaderboard').innerHTML = E.leaderboard(game)
    .map((entry, index) => `<div class="leader-row"><span>${index + 1}. ${esc(entry.name)}</span><strong>${entry.score}</strong></div>`)
    .join('');
  $('#next-round').hidden = E.isMatchComplete(game);
  $('#next-round').textContent = `Runde ${game.currentRound + 1} starten`;
  renderHistory();
}

function startNextRound() {
  try {
    const values = setupValues();
    game = E.nextRound(game, createRoundOptions(values));
    voteIndex = 0;
    saveGame();
    showGame();
  } catch (error) {
    setStatus(error.message, true);
  }
}

function renderHistory() {
  const node = $('#history-list');
  if (!node) return;
  node.innerHTML = history.map(item => `
    <article class="history-item">
      <div><strong>${esc(item.word)}</strong><span>${esc(item.category)} · Runde ${item.round || 1}</span></div>
      <span>${item.winner === 'innocents' ? 'Gruppe' : 'Imposter'}</span>
    </article>`).join('') || '<p class="muted">Noch keine abgeschlossenen Runden.</p>';
}

function resumeGame() {
  const active = read(KEYS.active, null);
  if (!active) {
    updateResume();
    setStatus('Der gespeicherte Spielstand ist nicht mehr verfügbar.', true);
    return;
  }
  game = active;
  voteIndex = Object.keys(game.votes || {}).length;
  showGame();
}

function newGame() {
  clearTimer();
  if (game && game.phase !== 'completed' && !confirm('Aktuelle Runde verwerfen und neu beginnen?')) return;
  game = null;
  remove(KEYS.active);
  screen('setup-screen');
  updateResume();
  renderHistory();
}

function addCustomCategory(event) {
  event.preventDefault();
  try {
    const name = $('#custom-name').value.trim();
    const entries = E.parseCustomEntries($('#custom-words').value);
    if (name.length < 2) throw Error('Bitte einen Kategorienamen eingeben.');
    custom = [...custom, { id: makeId(), name: name.slice(0, 50), entries }];
    if (!write(KEYS.custom, custom)) return;
    event.currentTarget.reset();
    renderCategories();
    setStatus(`Kategorie „${name}“ gespeichert.`);
  } catch (error) {
    setStatus(error.message, true);
  }
}

function deleteCategory(id) {
  const item = custom.find(entry => entry.id === id);
  if (!item || !confirm(`Kategorie „${item.name}“ löschen?`)) return;
  custom = custom.filter(entry => entry.id !== id);
  write(KEYS.custom, custom);
  renderCategories();
}

function clearAllData() {
  if (!confirm('Wirklich alle lokalen Secret-Circle-Daten löschen? Aktive Runde, Verlauf, Einstellungen und eigene Kategorien werden dauerhaft entfernt.')) return;
  clearTimer();
  STORE.clearAll();
  game = null;
  custom = [];
  history = [];
  voteIndex = 0;
  cardVisible = false;
  $('#players').value = 'Alex\nSam\nMika\nLina';
  $('#imposters').value = '1';
  $('#duration').value = '3';
  $('#match-rounds').value = '5';
  $('#hint').checked = true;
  renderCategories();
  renderHistory();
  updateResume();
  screen('setup-screen');
  setStatus('Alle lokalen Secret-Circle-Daten wurden gelöscht.');
}

function exportData() {
  try {
    const backup = STORE.exportBackup(E);
    const blob = new Blob([backup], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `secret-circle-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.append(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    setStatus('Lokale Daten wurden als Sicherungsdatei exportiert.');
  } catch (error) {
    setStatus(error.message || 'Die Sicherung konnte nicht erstellt werden.', true);
  }
}

function chooseImportFile() {
  $('#import-data').click();
}

async function importData(event) {
  const file = event.target.files?.[0];
  event.target.value = '';
  if (!file) return;
  if (file.size > 2_000_000) {
    setStatus('Die Sicherungsdatei ist zu groß.', true);
    return;
  }
  if (!confirm('Die Sicherung ersetzt die aktuell gespeicherten lokalen Daten. Fortfahren?')) return;
  try {
    const result = STORE.importBackup(await file.text(), E);
    if (!result.ok) throw Error(result.error);
    clearTimer();
    game = null;
    custom = result.data.custom;
    history = result.data.history;
    renderCategories();
    renderHistory();
    restoreSettings();
    updateResume();
    screen('setup-screen');
    setStatus('Sicherung erfolgreich importiert.');
  } catch (error) {
    setStatus(error.message || 'Die Sicherung konnte nicht importiert werden.', true);
  }
}

function updateConnection() {
  const online = navigator.onLine;
  $('#connection').textContent = online ? 'Online · offline bereit' : 'Offline-Modus';
  $('#connection').classList.toggle('offline', !online);
}

async function installApp() {
  if (!installPrompt) return;
  installPrompt.prompt();
  await installPrompt.userChoice;
  installPrompt = null;
  $('#install-app').hidden = true;
}

function registerPwa() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(() => setStatus('Offline-Modus konnte nicht aktiviert werden.', true));
  }
  window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault();
    installPrompt = event;
    $('#install-app').hidden = false;
  });
  window.addEventListener('appinstalled', () => {
    $('#install-app').hidden = true;
    setStatus('Secret Circle wurde installiert.');
  });
  window.addEventListener('online', updateConnection);
  window.addEventListener('offline', updateConnection);
  updateConnection();
}

$('#start').addEventListener('click', startGame);
$('#resume').addEventListener('click', resumeGame);
$('#discard-resume').addEventListener('click', () => { remove(KEYS.active); updateResume(); });
$('#show-card').addEventListener('click', revealCard);
$('#next-player').addEventListener('click', nextPlayer);
$('#timer-toggle').addEventListener('click', toggleTimer);
$('#start-vote').addEventListener('click', beginVoting);
$('#vote-options').addEventListener('click', event => {
  const target = event.target.dataset.voteTarget;
  if (target) castVote(target);
});
$('#submit-guess').addEventListener('click', submitGuess);
$('#imposter-guess').addEventListener('keydown', event => { if (event.key === 'Enter') submitGuess(); });
$('#next-round').addEventListener('click', startNextRound);
$$('[data-new-game]').forEach(button => button.addEventListener('click', newGame));
$('#custom-form').addEventListener('submit', addCustomCategory);
$('#custom-list').addEventListener('click', event => {
  const id = event.target.dataset.deleteCategory;
  if (id) deleteCategory(id);
});
$('#toggle-custom').addEventListener('click', () => {
  const panel = $('#custom-panel');
  const open = panel.hidden;
  panel.hidden = !open;
  $('#toggle-custom').setAttribute('aria-expanded', String(open));
  if (open) $('#custom-name').focus();
});
$('#install-app').addEventListener('click', installApp);
$('#clear-history').addEventListener('click', () => {
  if (confirm('Rundenverlauf löschen?')) {
    history = [];
    write(KEYS.history, history);
    renderHistory();
  }
});
$('#clear-all-data').addEventListener('click', clearAllData);
$('#export-data').addEventListener('click', exportData);
$('#import-data-trigger').addEventListener('click', chooseImportFile);
$('#import-data').addEventListener('change', importData);

renderCategories();
restoreSettings();
updateResume();
renderHistory();
registerPwa();
screen('setup-screen');

if (!persisted.available) setStatus('Lokaler Speicher ist nicht verfügbar. Das Spiel kann laufen, aber Daten werden nicht dauerhaft gespeichert.', true);
else if (persisted.warnings.length) setStatus('Lokale Daten wurden geprüft und auf das aktuelle Format aktualisiert.');
