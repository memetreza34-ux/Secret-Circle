'use strict';

const E = window.SecretCircleEngine;
const C = window.SecretCircleContent;

if (!C) throw Error('Secret-Circle-Wortpakete konnten nicht geladen werden.');
C.validatePacks();

const KEYS = {
  active: 'secret-circle-active-v4',
  custom: 'secret-circle-custom-v2',
  history: 'secret-circle-history-v4',
  settings: 'secret-circle-settings-v5'
};

const WORDS = C.PACKS;
const LABELS = C.LABELS;
const ICONS = C.ICONS;
const MAX_IMPOSTERS = 6;

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

let game = null;
let ticker = null;
let deadline = 0;
let cardVisible = false;
let installPrompt = null;
let voteLocked = false;
let players = [];
let categoryId = 'all';
let custom = read(KEYS.custom, []);
let history = read(KEYS.history, []);

/* ── Speicher ───────────────────────────────────────────── */

function read(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return value ?? fallback;
  } catch {
    return fallback;
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    setStatus('Speicher voll — der Spielstand konnte nicht gesichert werden.', true);
  }
}

function remove(key) {
  localStorage.removeItem(key);
}

function esc(value) {
  return String(value ?? '').replace(
    /[&<>'"]/g,
    (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[char]
  );
}

/* ── Screens & Status ───────────────────────────────────── */

function screen(id) {
  $$('[data-screen]').forEach((node) => (node.hidden = node.id !== id));
}

function setStatus(message = '', error = false) {
  const node = $('#status');
  node.textContent = message;
  node.classList.toggle('error', error);
}

function goHome() {
  updateResume();
  renderHomeHistory();
  screen('home-screen');
}

function goSetup() {
  renderSetupRows();
  screen('setup-screen');
}

/* ── Einstellwerte ──────────────────────────────────────── */

function segment(name, value) {
  const inputs = $$(`input[name="${name}"]`);
  if (value === undefined) return Number(inputs.find((input) => input.checked)?.value || inputs[0].value);
  const match = inputs.find((input) => input.value === String(value));
  if (match) match.checked = true;
  return Number(match?.value || inputs[0].value);
}

function imposterLimit() {
  return Math.max(1, Math.min(MAX_IMPOSTERS, players.length - 1));
}

function setImposters(count) {
  const value = Math.max(1, Math.min(imposterLimit(), Number(count) || 1));
  $('#imposters').value = String(value);
  $('#imposters-value').textContent = String(value);
  $('#imposters-down').disabled = value <= 1;
  $('#imposters-up').disabled = value >= imposterLimit();
  return value;
}

function renderSetupRows() {
  $('#players-value').textContent = String(players.length);
  $('#category-value').textContent = categoryName(categoryId);
  $('#rules-value').textContent = `${$('#imposters').value} · ${segment('duration')} min · ${segment('rounds')}`;
}

/* ── Spielerliste ───────────────────────────────────────── */

function renderPlayers() {
  $('#player-list').innerHTML =
    players
      .map(
        (name, index) =>
          `<div class="row"><span class="row-icon" aria-hidden="true">${index + 1}</span>` +
          `<span class="row-label">${esc(name)}</span>` +
          `<button class="icon-button" type="button" data-remove-player="${index}" aria-label="${esc(name)} entfernen">✕</button></div>`
      )
      .join('') || '<p class="muted">Noch niemand eingetragen.</p>';

  $('#player-count').textContent = `${players.length}/${E.MAX_PLAYERS}`;
  setImposters($('#imposters').value);
  saveSettings();
}

function addPlayer(name) {
  const value = String(name || '')
    .trim()
    .replace(/\s+/g, ' ')
    .slice(0, 32);
  if (!value) return;
  if (players.length >= E.MAX_PLAYERS) {
    setStatus(`Mehr als ${E.MAX_PLAYERS} Personen gehen nicht.`, true);
    return;
  }
  if (players.some((player) => player.toLocaleLowerCase('de-DE') === value.toLocaleLowerCase('de-DE'))) {
    setStatus(`${value} steht schon in der Liste.`, true);
    return;
  }
  players.push(value);
  setStatus();
  renderPlayers();
}

function removePlayer(index) {
  players.splice(index, 1);
  renderPlayers();
}

/* ── Kategorien ─────────────────────────────────────────── */

function categoryEntries(id) {
  if (id === 'all') return C.allEntries().concat(custom.flatMap((item) => item.entries));
  if (id.startsWith('custom:')) {
    const item = custom.find((entry) => entry.id === id.slice(7));
    if (!item) throw Error('Diese eigene Kategorie gibt es nicht mehr.');
    return item.entries;
  }
  if (!WORDS[id]) throw Error('Kategorie wurde nicht gefunden.');
  return WORDS[id];
}

function categoryName(id) {
  if (id === 'all') return 'Gemischt';
  if (id.startsWith('custom:')) return custom.find((item) => item.id === id.slice(7))?.name || 'Eigene Kategorie';
  return LABELS[id] || id;
}

function categoryIcon(id) {
  if (id === 'all') return '🎲';
  if (id.startsWith('custom:')) return '✎';
  return ICONS[id] || '🎯';
}

function categoryCount(id) {
  try {
    return categoryEntries(id).length;
  } catch {
    return 0;
  }
}

function renderCategoryList() {
  const row = (id) =>
    `<button type="button" class="row${id === categoryId ? ' selected' : ''}" data-category="${esc(id)}">` +
    `<span class="row-icon" aria-hidden="true">${categoryIcon(id)}</span>` +
    `<span class="row-label">${esc(categoryName(id))}<small>${categoryCount(id)} Begriffe</small></span>` +
    `<span class="row-check">${id === categoryId ? '✓' : ''}</span></button>`;

  $('#category-list').innerHTML =
    row('all') + Object.keys(WORDS).map(row).join('') + custom.map((item) => row(`custom:${item.id}`)).join('');
}

function renderCustomList() {
  $('#custom-list').innerHTML =
    custom
      .map(
        (item) =>
          `<div class="row"><span class="row-icon" aria-hidden="true">✎</span>` +
          `<span class="row-label">${esc(item.name)}<small>${item.entries.length} Begriffe</small></span>` +
          `<button class="icon-button" type="button" data-delete-category="${esc(item.id)}" aria-label="${esc(item.name)} löschen">✕</button></div>`
      )
      .join('') || '<p class="muted">Noch keine eigene Kategorie.</p>';
}

function chooseCategory(id) {
  categoryId = id;
  saveSettings();
  renderCategoryList();
  goSetup();
}

/* ── Einstellungen sichern ──────────────────────────────── */

function setupValues() {
  return {
    players,
    categoryId,
    category: categoryName(categoryId),
    imposterCount: Number($('#imposters').value),
    useHint: $('#hint').checked,
    roundSeconds: segment('duration') * 60,
    maxRounds: segment('rounds')
  };
}

function saveSettings() {
  write(KEYS.settings, {
    players,
    categoryId,
    imposterCount: $('#imposters').value,
    useHint: $('#hint').checked,
    duration: segment('duration'),
    maxRounds: segment('rounds')
  });
}

function restoreSettings() {
  const settings = read(KEYS.settings, null);
  players =
    Array.isArray(settings?.players) && settings.players.length ? settings.players : ['Alex', 'Sam', 'Mika', 'Lina'];

  if (settings) {
    $('#hint').checked = settings.useHint !== false;
    segment('duration', settings.duration || 3);
    segment('rounds', settings.maxRounds || 3);
    categoryId = settings.categoryId || 'all';
  }

  renderCategoryList();
  renderCustomList();
  renderPlayers();
  setImposters(settings?.imposterCount || 1);
}

/* ── Spielstand ─────────────────────────────────────────── */

function saveGame() {
  if (game) write(KEYS.active, game);
  else remove(KEYS.active);
  updateResume();
}

function updateResume() {
  let active = null;
  try {
    active = E.restoreGame(read(KEYS.active, null));
  } catch {
    remove(KEYS.active);
  }

  const box = $('#home-resume');
  box.hidden = !active;
  if (!active) return;

  const phase = {
    reveal: 'Karten werden verteilt',
    discussion: 'Diskussion',
    voting: 'Abstimmung',
    completed: 'Rundenergebnis'
  }[active.phase];

  $('#resume-text').textContent =
    `Runde ${active.roundNumber}/${active.maxRounds} · ${active.players.length} Personen · ${phase}`;
}

/* ── Spielerkreis ───────────────────────────────────────── */

function renderRing(selector, total, doneCount, label) {
  const node = $(selector);
  if (!node) return;

  const radius = 40;
  const dots = Array.from({ length: total }, (_, index) => {
    const angle = (index / total) * Math.PI * 2 - Math.PI / 2;
    const x = 50 + Math.cos(angle) * radius;
    const y = 50 + Math.sin(angle) * radius;
    const size = total > 12 ? 3.5 : 4.5;
    const state = index < doneCount ? 'done' : index === doneCount ? 'active' : '';
    const scale = index === doneCount ? size + 2 : size;
    return `<circle class="ring-dot ${state}" cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="${scale}"></circle>`;
  }).join('');

  node.innerHTML =
    `<svg viewBox="0 0 100 100" aria-hidden="true">` +
    `<circle class="ring-track" cx="50" cy="50" r="${radius}"></circle>${dots}</svg>` +
    `<span class="ring-count"><b>${doneCount + 1}</b>/${total}</span>`;
  node.setAttribute('role', 'img');
  node.setAttribute('aria-label', label);
}

/* ── Spielablauf ────────────────────────────────────────── */

function startGame() {
  setStatus();
  try {
    const values = setupValues();
    const entries = categoryEntries(values.categoryId);
    game = E.createGame({ ...values, entries, seed: E.createSeed() });
    cardVisible = false;
    voteLocked = false;
    saveSettings();
    saveGame();
    showGame();
  } catch (error) {
    setStatus(error.message, true);
  }
}

function showGame() {
  if (!game) {
    goHome();
    return;
  }
  clearTimer();
  if (game.phase === 'reveal') renderReveal();
  else if (game.phase === 'discussion') renderDiscussion();
  else if (game.phase === 'voting') renderVoting();
  else renderResult();
}

function renderReveal() {
  screen('reveal-screen');
  closeCard(true);

  const player = game.revealOrder[game.revealIndex];
  $('#reveal-progress').textContent =
    `Runde ${game.roundNumber}/${game.maxRounds} · Karte ${game.revealIndex + 1}/${game.revealOrder.length}`;
  $('#player-name').textContent = player;
  $('#player-name').style.setProperty('--len', Math.max(4, player.length));
  $('#handoff-note').textContent = 'Nur diese Person darf jetzt schauen.';
  $('#next-player').disabled = true;

  renderRing(
    '#reveal-ring',
    game.revealOrder.length,
    game.revealIndex,
    `Karte ${game.revealIndex + 1} von ${game.revealOrder.length}`
  );
}

function toggleCard() {
  if (cardVisible) {
    closeCard();
    return;
  }

  const player = game.revealOrder[game.revealIndex];
  const role = E.roleFor(game, player);
  const card = $('#show-card');

  $('#role').textContent = role.label;
  $('#word').textContent = role.value;
  $('#word').style.setProperty('--len', Math.max(4, role.value.length));
  $('#hint-text').textContent = role.instruction;
  $('#secret').removeAttribute('aria-hidden');
  card.classList.toggle('imposter', role.isImposter);
  card.setAttribute('aria-expanded', 'true');

  cardVisible = true;
  $('#next-player').disabled = false;
  $('#handoff-note').textContent = 'Gemerkt? Karte zuklappen und weitergeben.';
}

function closeCard(immediate = false) {
  const card = $('#show-card');
  card.setAttribute('aria-expanded', 'false');
  $('#secret').setAttribute('aria-hidden', 'true');

  const clear = () => {
    if (card.getAttribute('aria-expanded') === 'true') return;
    $('#role').textContent = '';
    $('#word').textContent = '';
    $('#hint-text').textContent = '';
    card.classList.remove('imposter');
  };

  if (immediate) clear();
  else setTimeout(clear, 500);

  if (!immediate) $('#handoff-note').textContent = 'Karte ist zu. Jetzt weitergeben.';
  cardVisible = immediate ? false : cardVisible;
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
  $('#round-label').textContent = `Runde ${game.roundNumber}/${game.maxRounds}`;
  $('#round-category').textContent = game.category;
  $('#round-players').textContent = `${game.players.length} Personen · ${game.imposters.length} Imposter`;
  $('#timer-toggle').textContent = 'Zeit starten';
  updateTime();
  renderScoreboard('#live-scoreboard');
}

function updateTime() {
  const value = Math.max(0, game?.remainingSeconds || 0);
  const minutes = String(Math.floor(value / 60)).padStart(2, '0');
  const seconds = String(value % 60).padStart(2, '0');
  $('#time').textContent = `${minutes}:${seconds}`;

  const ratio = game?.roundSeconds ? value / game.roundSeconds : 0;
  $('#clock-progress').style.strokeDashoffset = String(578 * (1 - ratio));
  $('.clock').classList.toggle('low', value > 0 && value <= 30);
}

function toggleTimer() {
  if (ticker) {
    clearTimer();
    $('#timer-toggle').textContent = 'Weiter';
    return;
  }
  if (!game || game.remainingSeconds <= 0) return;

  deadline = Date.now() + game.remainingSeconds * 1000;
  $('#timer-toggle').textContent = 'Pause';

  ticker = setInterval(() => {
    const left = Math.max(0, Math.round((deadline - Date.now()) / 1000));
    if (left === game.remainingSeconds) return;

    game = E.setRemaining(game, left);
    updateTime();
    saveGame();

    if (left === 0) {
      clearTimer();
      $('#timer-toggle').textContent = 'Zeit ist um';
      navigator.vibrate?.([180, 100, 180]);
    }
  }, 250);
}

function clearTimer() {
  if (ticker) clearInterval(ticker);
  ticker = null;
}

function startVoting() {
  clearTimer();
  try {
    game = E.beginVoting(game);
    voteLocked = false;
    saveGame();
    renderVoting();
  } catch (error) {
    setStatus(error.message, true);
  }
}

function renderVoting() {
  screen('voting-screen');
  const count = Object.keys(game.votes).length;

  if (count >= game.players.length) {
    finalizeVoting();
    return;
  }

  voteLocked = false;
  const voter = game.voteOrder[count];

  $('#vote-progress').textContent = `Stimme ${count + 1}/${game.players.length}`;
  $('#voter-name').textContent = voter;
  $('#voter-name').style.setProperty('--len', Math.max(4, voter.length));
  $('#vote-note').textContent = 'Wer kennt den Begriff nicht?';
  $('#vote-targets').hidden = false;
  $('#vote-sealed').hidden = true;
  $('#next-voter').disabled = true;
  $('#vote-targets').innerHTML = game.players
    .filter((player) => player !== voter)
    .map((player) => `<button type="button" class="vote-target" data-target="${esc(player)}">${esc(player)}</button>`)
    .join('');

  renderRing('#vote-ring', game.players.length, count, `Stimme ${count + 1} von ${game.players.length}`);
}

function castCurrentVote(target) {
  if (voteLocked) return;
  const voter = game.voteOrder[Object.keys(game.votes).length];

  try {
    game = E.castVote(game, voter, target);
    voteLocked = true;
    saveGame();

    const done = Object.keys(game.votes).length === game.players.length;
    $('#vote-targets').hidden = true;
    $('#vote-sealed').hidden = false;
    $('#vote-note').textContent = 'Niemand sieht deine Wahl. Gerät weitergeben.';
    $('#next-voter').disabled = false;
    $('#next-voter').textContent = done ? 'Auflösen' : 'Weitergeben';
  } catch (error) {
    setStatus(error.message, true);
  }
}

function nextVoter() {
  if (!voteLocked) return;
  if (Object.keys(game.votes).length === game.players.length) finalizeVoting();
  else renderVoting();
}

function finalizeVoting() {
  try {
    game = E.finalizeVote(game);
    history = [E.historyEntry(game), ...history.filter((item) => item.id !== game.id)].slice(0, 20);
    write(KEYS.history, history);
    saveGame();
    renderResult();
  } catch (error) {
    setStatus(error.message, true);
  }
}

function renderScoreboard(selector) {
  const node = $(selector);
  if (!node || !game) return;

  const board = E.leaderboard(game);
  const top = board[0]?.score ?? 0;

  node.innerHTML = board
    .map(
      (entry, index) =>
        `<div class="score-row${entry.score === top && top > 0 ? ' lead' : ''}">` +
        `<span><span class="score-rank">${index + 1}</span>${esc(entry.player)}</span>` +
        `<strong>${entry.score}</strong></div>`
    )
    .join('');
}

function renderResult() {
  screen('result-screen');
  const result = game.voteResult;

  $('#result-round').textContent = `Runde ${game.roundNumber}/${game.maxRounds}`;
  $('#result-word').textContent = game.word;
  $('#result-word').style.setProperty('--len', Math.max(4, game.word.length));
  $('#result-meta').textContent = `${game.imposters.length} von ${game.players.length}`;
  $('#result-imposters').innerHTML = game.imposters.map((name) => `<li>${esc(name)}</li>`).join('');

  const verdict = $('#vote-result');
  verdict.textContent = !result?.accused
    ? 'Stimmengleichstand — niemand wurde eindeutig beschuldigt.'
    : result.caught
      ? `${result.accused} wurde gewählt und war Imposter.`
      : `${result.accused} wurde gewählt, war aber unschuldig.`;
  verdict.classList.toggle('miss', !result?.caught);

  renderScoreboard('#result-scoreboard');

  const finished = E.matchComplete(game);
  $('#next-round').hidden = finished;
  $('#match-finished').hidden = !finished;

  if (finished) {
    const board = E.leaderboard(game);
    const top = board[0].score;
    const winners = board.filter((entry) => entry.score === top).map((entry) => entry.player);
    $('#match-finished').textContent =
      `${winners.join(', ')} ${winners.length === 1 ? 'gewinnt' : 'gewinnen'} mit ${top} Punkten.`;
  }

  renderHistoryList();
}

function startNextRound() {
  try {
    const entries = categoryEntries(game.categoryId);
    game = E.createGame(E.nextRoundOptions(game, entries, E.createSeed()));
    cardVisible = false;
    voteLocked = false;
    saveGame();
    showGame();
  } catch (error) {
    setStatus(error.message, true);
  }
}

/* ── Verlauf ────────────────────────────────────────────── */

function outcomeLabel(item) {
  if (item.caught) return { text: 'Erwischt', hit: true };
  if (item.accused) return { text: 'Daneben', hit: false };
  return { text: 'Unentschieden', hit: false };
}

function renderHomeHistory() {
  const node = $('#home-history');
  if (!node) return;

  node.innerHTML =
    history
      .slice(0, 8)
      .map((item) => {
        const outcome = outcomeLabel(item);
        return (
          `<article class="history-card"><strong>${esc(item.word)}</strong>` +
          `<span>${esc(item.category)} · ${item.playerCount} Personen</span>` +
          `<span class="outcome${outcome.hit ? ' hit' : ''}">${outcome.text}</span></article>`
        );
      })
      .join('') || '<p class="strip-empty">Noch keine Runde gespielt. Leg los.</p>';
}

function renderHistoryList() {
  const node = $('#history-list');
  if (!node) return;

  node.innerHTML =
    history
      .map((item) => {
        const outcome = outcomeLabel(item);
        return (
          `<div class="row"><span class="row-icon" aria-hidden="true">${item.caught ? '✓' : '·'}</span>` +
          `<span class="row-label">${esc(item.word)}<small>Runde ${item.roundNumber || 1}/${item.maxRounds || 1} · ${esc(item.category)} · ${item.playerCount} Personen</small></span>` +
          `<span class="row-value">${outcome.text}</span></div>`
        );
      })
      .join('') || '<p class="muted">Noch keine abgeschlossene Runde.</p>';
}

function resumeGame() {
  try {
    game = E.restoreGame(read(KEYS.active, null));
    setStatus();
    showGame();
  } catch (error) {
    remove(KEYS.active);
    updateResume();
    setStatus(error.message, true);
  }
}

function newGame() {
  clearTimer();
  if (game && game.phase !== 'completed' && !confirm('Laufendes Match verwerfen?')) return;
  game = null;
  remove(KEYS.active);
  goHome();
}

/* ── Eigene Kategorien ──────────────────────────────────── */

function addCustomCategory(event) {
  event.preventDefault();
  try {
    const name = $('#custom-name').value.trim();
    const entries = E.parseCustomEntries($('#custom-words').value);
    if (name.length < 2) throw Error('Die Kategorie braucht einen Namen.');

    custom = [...custom, { id: E.createSeed(), name: name.slice(0, 50), entries }];
    write(KEYS.custom, custom);
    event.currentTarget.reset();
    renderCustomList();
    renderCategoryList();
    setStatus(`Kategorie „${name}“ gespeichert.`);
  } catch (error) {
    setStatus(error.message, true);
  }
}

function deleteCategory(id) {
  const item = custom.find((entry) => entry.id === id);
  if (!item || !confirm(`Kategorie „${item.name}“ löschen?`)) return;
  custom = custom.filter((entry) => entry.id !== id);
  if (categoryId === `custom:${id}`) categoryId = 'all';
  write(KEYS.custom, custom);
  renderCustomList();
  renderCategoryList();
}

/* ── PWA ────────────────────────────────────────────────── */

function updateConnection() {
  const node = $('#connection');
  node.textContent = navigator.onLine ? 'Offline bereit' : 'Ohne Netz';
  node.classList.toggle('offline', !navigator.onLine);
}

async function installApp() {
  if (!installPrompt) return;
  installPrompt.prompt();
  await installPrompt.userChoice;
  installPrompt = null;
}

function registerPwa() {
  if ('serviceWorker' in navigator && window.isSecureContext) {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  }

  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    installPrompt = event;
  });
  window.addEventListener('appinstalled', () => setStatus('Secret Circle ist installiert.'));
  window.addEventListener('online', updateConnection);
  window.addEventListener('offline', updateConnection);
  updateConnection();
}

/* ── Ereignisse ─────────────────────────────────────────── */

$('#go-setup').addEventListener('click', goSetup);
$('#go-packs').addEventListener('click', () => screen('packs-screen'));
$('#go-history').addEventListener('click', () => {
  renderHistoryList();
  screen('history-screen');
});
$('#row-players').addEventListener('click', () => {
  renderPlayers();
  screen('players-screen');
});
$('#row-category').addEventListener('click', () => {
  renderCategoryList();
  screen('category-screen');
});
$('#row-rules').addEventListener('click', () => screen('rules-screen'));
$('#add-pack').addEventListener('click', () => screen('packs-screen'));

$$('[data-back]').forEach((button) =>
  button.addEventListener('click', () => {
    const target = button.dataset.back;
    if (target === 'home-screen') goHome();
    else if (target === 'setup-screen') goSetup();
    else screen(target);
  })
);

$('#category-list').addEventListener('click', (event) => {
  const row = event.target.closest('[data-category]');
  if (row) chooseCategory(row.dataset.category);
});

$('#player-form').addEventListener('submit', (event) => {
  event.preventDefault();
  addPlayer($('#player-input').value);
  $('#player-input').value = '';
  $('#player-input').focus();
});

$('#player-list').addEventListener('click', (event) => {
  const index = event.target.closest('[data-remove-player]')?.dataset.removePlayer;
  if (index !== undefined) removePlayer(Number(index));
});

$('#imposters-down').addEventListener('click', () => setImposters(Number($('#imposters').value) - 1));
$('#imposters-up').addEventListener('click', () => setImposters(Number($('#imposters').value) + 1));
$$('input[name="duration"], input[name="rounds"]').forEach((input) => input.addEventListener('change', saveSettings));
$('#hint').addEventListener('change', saveSettings);

$('#start').addEventListener('click', startGame);
$('#resume').addEventListener('click', resumeGame);
$('#discard-resume').addEventListener('click', () => {
  remove(KEYS.active);
  updateResume();
});

$('#show-card').addEventListener('click', toggleCard);
$('#next-player').addEventListener('click', nextPlayer);
$('#timer-toggle').addEventListener('click', toggleTimer);
$('#start-voting').addEventListener('click', startVoting);
$('#vote-targets').addEventListener('click', (event) => {
  const target = event.target.dataset.target;
  if (target) castCurrentVote(target);
});
$('#next-voter').addEventListener('click', nextVoter);
$('#next-round').addEventListener('click', startNextRound);
$$('[data-new-game]').forEach((button) => button.addEventListener('click', newGame));

$('#custom-form').addEventListener('submit', addCustomCategory);
$('#custom-list').addEventListener('click', (event) => {
  const id = event.target.closest('[data-delete-category]')?.dataset.deleteCategory;
  if (id) deleteCategory(id);
});
$('#clear-history').addEventListener('click', () => {
  if (!confirm('Rundenverlauf löschen?')) return;
  history = [];
  write(KEYS.history, history);
  renderHistoryList();
  renderHomeHistory();
});

document.addEventListener('visibilitychange', () => {
  if (document.hidden || !ticker) return;
  const left = Math.max(0, Math.round((deadline - Date.now()) / 1000));
  game = E.setRemaining(game, left);
  updateTime();
});

restoreSettings();
registerPwa();
goHome();
