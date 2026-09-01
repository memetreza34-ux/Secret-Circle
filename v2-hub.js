'use strict';

const CATALOG = window.SecretCirclePartyCatalog;
const GAMES = (CATALOG && CATALOG.games) || [];

// Die 28 Feingruppen des Katalogs bündeln sich auf sechs Kategorien. Jede bringt
// ihre eigene Farbe mit — die faerbt bei Splash die ganze Modusseite ein.
const BUCKETS = [
  { id: 'taeuschung', label: 'Täuschung', icon: '🕵️', tint: '#ff4560', ground: '#43101d', groups: ['Täuschung'] },
  {
    id: 'reden',
    label: 'Reden & Wählen',
    icon: '🗳️',
    tint: '#4dd9a0',
    ground: '#06402f',
    groups: ['Abstimmen', 'Klassiker', 'Diskussion', 'Social', 'Debatte', 'Schnellfragen', 'Freundschaft', 'Entscheidung']
  },
  {
    id: 'raten',
    label: 'Raten & Zeigen',
    icon: '🎭',
    tint: '#ffb020',
    ground: '#462c05',
    groups: ['Darstellen', 'Erklären', 'Raten', 'Anime-Quiz', 'Audio', 'Bewegung', 'Raten & Hinweise']
  },
  {
    id: 'kreativ',
    label: 'Kreativ',
    icon: '✏️',
    tint: '#a78bfa',
    ground: '#2d1e52',
    groups: ['Kreativ', 'Schreiben & Kreativ']
  },
  {
    id: 'wissen',
    label: 'Wissen & Schätzen',
    icon: '🎯',
    tint: '#38bdf8',
    ground: '#093548',
    groups: ['Quiz & Wissen', 'Quiz', 'Schätzen', 'Schätzen & Voting', 'Einschätzen', 'Ranking', 'Bluff & Wissen']
  },
  {
    id: 'schnell',
    label: 'Schnell',
    icon: '⚡',
    tint: '#f472b6',
    ground: '#451234',
    groups: ['Schnell', 'Challenge', 'Werkzeuge']
  }
];

const MOODS = {
  clever: 'clever',
  competitive: 'wettkampf',
  funny: 'lustig',
  deep: 'tiefgründig',
  wild: 'wild',
  friendly: 'freundlich',
  chaotic: 'chaotisch',
  creative: 'kreativ'
};

const TABS = [
  { id: 'home', label: 'Start', icon: '⌂' },
  { id: 'games', label: 'Spiele', icon: '🎮' },
  { id: 'profile', label: 'Profil', icon: '🙂' }
];

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = (v) =>
  String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

const bucketOf = (game) => BUCKETS.find((b) => b.groups.includes(game.group)) || BUCKETS[0];
const range = (game) => `${game.minPlayers}–${game.maxPlayers}`;

const state = {
  screen: 'home',
  tab: 'home',
  filter: 'alle',
  query: '',
  game: GAMES.find((g) => g.id === 'imposter') || GAMES[0],
  players: ['Alex', 'Sam', 'Mika', 'Lina'],
  pack: null,
  odds: 1,
  minutes: 3,
  rounds: 3,
  hint: true
};

/* ── Navigation ─────────────────────────────────────────── */

function show(name) {
  state.screen = name;
  if (TABS.some((t) => t.id === name)) state.tab = name;
  $$('[data-screen]').forEach((node) => (node.hidden = node.dataset.screen !== name));
  renderTabs();
  $(`[data-screen="${name}"] .body`)?.scrollTo(0, 0);
}

function renderTabs() {
  const markup = TABS.map(
    (t) =>
      `<button class="tab" type="button" role="tab" data-tab="${t.id}" aria-selected="${state.tab === t.id}">
        <span class="tab-ico" aria-hidden="true">${t.icon}</span>${t.label}</button>`
  ).join('');
  $$('.tabbar').forEach((bar) => (bar.innerHTML = markup));
}

function applyTint(game) {
  const b = bucketOf(game);
  $$('[data-tint]').forEach((node) => {
    node.style.setProperty('--tint', b.tint);
    node.style.setProperty('--tint-ground', b.ground);
  });
}

/* ── Karten ─────────────────────────────────────────────── */

function gameCard(game, rank) {
  const b = bucketOf(game);
  return `<button class="gcard" type="button" data-game="${esc(game.id)}">
    <span class="gcard-art" style="background:linear-gradient(150deg, ${b.ground} 0%, #14161d 100%)">
      ${rank ? `<span class="gcard-rank">${rank}</span>` : ''}${game.icon}
    </span>
    <span class="gcard-pad">
      <b>${esc(game.title)}</b>
      <small><span class="dot" style="background:${b.tint}"></span> ${range(game)} · ${game.duration} min</small>
    </span>
  </button>`;
}

/* ── Startbildschirm ────────────────────────────────────── */

function ring() {
  const seats = Array.from({ length: 6 }, (_, i) => {
    const a = (i / 6) * Math.PI * 2 - Math.PI / 2;
    const x = (66 + Math.cos(a) * 44).toFixed(1);
    const y = (66 + Math.sin(a) * 44).toFixed(1);
    const odd = i === 0;
    return `<circle cx="${x}" cy="${y}" r="${odd ? 10 : 8}" fill="${odd ? '#ff4560' : '#4a5062'}"/>`;
  }).join('');
  return `<svg viewBox="0 0 132 132" aria-hidden="true"><circle cx="66" cy="66" r="44" fill="none" stroke="#ffffff1f" stroke-width="2"/>${seats}</svg>`;
}

function renderHome() {
  const hero = GAMES.find((g) => g.id === 'imposter') || GAMES[0];
  $('#hero-art').innerHTML = ring();
  $('#hero-text').textContent = 'Ein Handy. Viele Köpfe. Einer kennt den Begriff nicht.';

  const featured = GAMES.filter((g) => g.featured);
  const quick = GAMES.filter((g) => g.duration <= 10);
  const big = GAMES.filter((g) => g.minPlayers >= 5);
  const deep = GAMES.filter((g) => (g.moods || []).includes('deep') || (g.moods || []).includes('clever'));

  const section = (title, icon, list, ranked) =>
    list.length
      ? `<section class="sec">
          <div class="sec-head"><h3><span aria-hidden="true">${icon}</span> ${title}</h3>
          <button class="sec-more" type="button" data-tab="games">Alle ansehen ›</button></div>
          <div class="strip">${list
            .slice(0, 10)
            .map((g, i) => gameCard(g, ranked ? i + 1 : null))
            .join('')}</div>
        </section>`
      : '';

  $('#sections').innerHTML =
    section('Top 10 aktuell', '🔥', featured, true) +
    section('In zehn Minuten durch', '⚡', quick) +
    section('Für große Runden', '👥', big) +
    section('Zum Nachdenken', '🧠', deep);
}

/* ── Alle Spiele ────────────────────────────────────────── */

function renderFilters() {
  $('#filters').innerHTML =
    `<button class="filter" type="button" data-filter="alle" aria-pressed="${state.filter === 'alle'}">Alle ${GAMES.length}</button>` +
    BUCKETS.map((b) => {
      const n = GAMES.filter((g) => bucketOf(g).id === b.id).length;
      return `<button class="filter" type="button" data-filter="${b.id}" aria-pressed="${state.filter === b.id}">
        <span class="dot" style="background:${b.tint}"></span>${b.label} ${n}</button>`;
    }).join('');
}

function renderGrid() {
  const q = state.query.trim().toLocaleLowerCase('de-DE');
  const list = GAMES.filter((g) => {
    const inBucket = state.filter === 'alle' || bucketOf(g).id === state.filter;
    const hit = !q || `${g.title} ${g.description}`.toLocaleLowerCase('de-DE').includes(q);
    return inBucket && hit;
  });

  $('#grid').innerHTML = list.length
    ? list.map((g) => gameCard(g)).join('')
    : '<p class="empty">Kein Spiel gefunden. Anderen Suchbegriff probieren.</p>';
}

/* ── Modusseite ─────────────────────────────────────────── */

function renderMode() {
  const g = state.game;
  const b = bucketOf(g);
  applyTint(g);

  $('#mode-emblem').textContent = g.icon;
  $('#mode-title').textContent = g.title;
  $('#mode-sub').textContent = g.description;
  $('#mode-meta').innerHTML = [
    `${range(g)} Personen`,
    `${g.duration} min`,
    b.label,
    ...(g.moods || []).slice(0, 1).map((m) => MOODS[m] || m)
  ]
    .map((t) => `<span class="chip">${esc(t)}</span>`)
    .join('');
  $('#mode-steps').innerHTML = (g.instructions || []).map((s) => `<li>${esc(s)}</li>`).join('');
  $('#players-count').textContent = String(state.players.length);
  $('#players-count').classList.toggle('row-warn', state.players.length < g.minPlayers);
  $('#pack-value').textContent = state.pack || packNames(g)[0] || 'Standard';
  $('#rules-value').textContent = rulesSummary(g);

  // Modi ohne Einstellungen bekommen keine Zeile, die ins Leere führt.
  const used = rulesUsed(g);
  $('[data-open="rules"]').hidden = !(used.odds || used.minutes || used.rounds);
}

/* ── Kategorie und Regeln je Modus ──────────────────────── */

function packNames(game) {
  try {
    const names = CATALOG.getPackNames ? CATALOG.getPackNames(game.id) : null;
    if (Array.isArray(names) && names.length) return names;
  } catch {
    /* Modus bringt keine Packs mit */
  }
  return Array.isArray(game.packs) && game.packs.length ? game.packs : ['Standard'];
}

// Nur die Regeln zeigen, die der Ablauf des Modus wirklich benutzt.
function rulesUsed(game) {
  const flow = flowFor(game);
  return {
    odds: flow.includes('vote'),
    minutes: flow.includes('timer'),
    rounds: flow.includes('result')
  };
}

function rulesSummary(game) {
  const used = rulesUsed(game);
  const parts = [];
  if (used.odds) parts.push(`${state.odds} ${state.odds === 1 ? 'Imposter' : 'Imposter'}`);
  if (used.minutes) parts.push(`${state.minutes} min`);
  if (used.rounds) parts.push(`${state.rounds} ${state.rounds === 1 ? 'Runde' : 'Runden'}`);
  return parts.join(' · ') || 'Ohne Zeitdruck';
}

function renderPacks() {
  const game = state.game;
  applyTint(game);
  const names = packNames(game);
  const active = state.pack || names[0];

  $('#pack-list').innerHTML = names
    .map(
      (name) =>
        `<button class="row" type="button" data-pack="${esc(name)}">
          <span class="row-ico">🎲</span><span class="row-main">${esc(name)}</span>
          <span class="row-check">${name === active ? '✓' : ''}</span></button>`
    )
    .join('');
  $('#pack-note').textContent =
    names.length > 1
      ? 'Bestimmt, welche Begriffe im Spiel auftauchen.'
      : 'Dieser Modus bringt genau ein Begriffspaket mit.';
}

function renderRules() {
  const game = state.game;
  applyTint(game);
  const used = rulesUsed(game);
  const maxOdds = Math.max(1, Math.min(6, state.players.length - 1));
  const blocks = [];

  if (used.odds) {
    blocks.push(`<fieldset class="setting"><legend>Wie viele kennen den Begriff nicht?</legend>
      <div class="stepper">
        <button class="icon-btn" type="button" data-odds="-1" aria-label="Weniger"${state.odds <= 1 ? ' disabled' : ''}>−</button>
        <output>${state.odds}</output>
        <button class="icon-btn" type="button" data-odds="1" aria-label="Mehr"${state.odds >= maxOdds ? ' disabled' : ''}>+</button>
      </div>
      <p class="setting-note">Bei ${state.players.length} Personen sind 1 bis ${maxOdds} möglich.</p></fieldset>`);
  }

  if (used.minutes) {
    blocks.push(`<fieldset class="setting"><legend>Redezeit pro Runde</legend>
      <div class="segmented">${[1, 2, 3, 5, 10]
        .map(
          (m) =>
            `<label><input type="radio" name="minutes" value="${m}"${state.minutes === m ? ' checked' : ''} /><span>${m}</span></label>`
        )
        .join('')}</div>
      <p class="setting-note">Minuten</p></fieldset>`);
  }

  if (used.rounds) {
    blocks.push(`<fieldset class="setting"><legend>Runden im Match</legend>
      <div class="segmented">${[1, 3, 5, 10]
        .map(
          (r) =>
            `<label><input type="radio" name="rounds" value="${r}"${state.rounds === r ? ' checked' : ''} /><span>${r}</span></label>`
        )
        .join('')}</div></fieldset>`);
  }

  if (used.odds) {
    blocks.push(`<label class="switch-row">
      <span class="row-main">Hilfswort<small>Wer den Begriff nicht kennt, bekommt einen vagen Themenhinweis.</small></span>
      <input type="checkbox" id="hint-toggle"${state.hint ? ' checked' : ''} />
      <span class="switch-track" aria-hidden="true"></span></label>`);
  }

  $('#rules-body').innerHTML = blocks.join('') || '<p class="lede-dim">Dieser Modus braucht keine Einstellungen.</p>';
}

/* ── Spieler ────────────────────────────────────────────── */

function renderPlayers() {
  applyTint(state.game);
  $('#player-badge').textContent = `${state.players.length}/${state.game.maxPlayers}`;
  $('#player-list').innerHTML = state.players
    .map(
      (name, i) =>
        `<div class="row"><span class="row-ico">${i + 1}</span><span class="row-main">${esc(name)}</span>
         <button class="icon-btn" type="button" data-remove="${i}" aria-label="${esc(name)} entfernen">✕</button></div>`
    )
    .join('');
}

/* ── Profil ─────────────────────────────────────────────── */

function renderProfile() {
  $('#profile-recent').innerHTML = GAMES.slice(0, 6)
    .map((g) => gameCard(g))
    .join('');
}

/* ── Ereignisse ─────────────────────────────────────────── */

document.addEventListener('click', (event) => {
  const tab = event.target.closest('[data-tab]');
  if (tab) {
    const id = tab.dataset.tab;
    if (id === 'games') {
      renderFilters();
      renderGrid();
    }
    if (id === 'profile') renderProfile();
    show(id);
    return;
  }

  const gameBtn = event.target.closest('[data-game]');
  if (gameBtn) {
    state.game = GAMES.find((x) => x.id === gameBtn.dataset.game) || state.game;
    renderMode();
    show('mode');
    return;
  }

  const opener = event.target.closest('[data-open]');
  if (opener) {
    const target = opener.dataset.open;
    if (target === 'players') renderPlayers();
    if (target === 'packs') renderPacks();
    if (target === 'rules') renderRules();
    show(target);
    return;
  }

  const backTo = event.target.closest('[data-back-to]');
  if (backTo) {
    renderMode();
    show(backTo.dataset.backTo);
    return;
  }

  if (event.target.closest('[data-back]')) {
    show(state.tab);
    return;
  }

  const filter = event.target.closest('[data-filter]');
  if (filter) {
    state.filter = filter.dataset.filter;
    renderFilters();
    renderGrid();
    return;
  }

  const remove = event.target.closest('[data-remove]');
  if (remove) {
    state.players.splice(Number(remove.dataset.remove), 1);
    renderPlayers();
    return;
  }

  const packRow = event.target.closest('[data-pack]');
  if (packRow) {
    state.pack = packRow.dataset.pack;
    renderPacks();
    renderMode();
    show('mode');
    return;
  }

  const oddsBtn = event.target.closest('[data-odds]');
  if (oddsBtn) {
    const max = Math.max(1, Math.min(6, state.players.length - 1));
    state.odds = Math.max(1, Math.min(max, state.odds + Number(oddsBtn.dataset.odds)));
    renderRules();
  }
});

document.addEventListener('change', (event) => {
  if (event.target.name === 'minutes') state.minutes = Number(event.target.value);
  if (event.target.name === 'rounds') state.rounds = Number(event.target.value);
  if (event.target.id === 'hint-toggle') state.hint = event.target.checked;
});

document.addEventListener('submit', (event) => {
  if (event.target.id !== 'player-form') return;
  event.preventDefault();
  const input = $('#player-input');
  const name = input.value.trim().replace(/\s+/g, ' ').slice(0, 32);
  if (!name) return;
  if (state.players.some((p) => p.toLocaleLowerCase('de-DE') === name.toLocaleLowerCase('de-DE'))) {
    input.value = '';
    return;
  }
  if (state.players.length >= state.game.maxPlayers) return;
  state.players.push(name);
  input.value = '';
  input.focus();
  renderPlayers();
});

$('#q').addEventListener('input', (event) => {
  state.query = event.target.value;
  renderGrid();
});

renderHome();
renderFilters();
renderGrid();
renderTabs();

/* ============================================================
   Spielablauf — fünf Bausteine, pro Modus anders zusammengesetzt
   ============================================================ */

// Welcher Modus welche Bausteine braucht. Statt 55 Abläufe zu bauen,
// wird pro Modus eine Reihenfolge aus denselben fünf Bildschirmen gewählt.
function flowFor(game) {
  if (game.mode === 'mafia') return ['secret', 'vote', 'result'];
  if (game.mode === 'hot-potato' || game.mode === 'word-chain') return ['timer'];
  if (game.mode === 'random-player' || game.mode === 'utility') return ['prompt'];
  if (['two-truths', 'question-imposter', 'location-spy'].includes(game.mode)) {
    return ['secret', 'timer', 'vote', 'result'];
  }

  const bucket = bucketOf(game).id;
  if (bucket === 'taeuschung') return ['secret', 'timer', 'vote', 'result'];
  if (bucket === 'raten') return ['secret', 'timer', 'result'];
  if (bucket === 'schnell') return ['timer', 'result'];
  return ['prompt'];
}

const SCREEN_OF = {
  secret: 'play-secret',
  prompt: 'play-prompt',
  timer: 'play-timer',
  vote: 'play-vote',
  result: 'play-result'
};

const play = {
  flow: [],
  step: 0,
  seat: 0,
  round: 1,
  word: '',
  hint: '',
  odd: '',
  votes: {},
  voter: 0,
  seen: false,
  remaining: 0,
  ticker: null,
  deadline: 0,
  scores: {}
};

/* ── Inhalte aus dem Katalog ────────────────────────────── */

function itemsFor(game) {
  try {
    const items = CATALOG.getItems ? CATALOG.getItems(game.id) : null;
    if (Array.isArray(items) && items.length) return items;
  } catch {
    /* Katalog liefert für diesen Modus nichts — Rückfall unten */
  }
  return null;
}

function textOf(item) {
  if (typeof item === 'string') return item;
  return item?.text || item?.prompt || item?.question || item?.word || item?.title || '';
}

function pickWord(game) {
  const items = itemsFor(game);
  if (items) {
    const item = items[Math.floor(Math.random() * items.length)];
    return { word: textOf(item), hint: item?.hint || item?.category || 'Kein Hilfswort' };
  }
  return { word: 'Tomatensuppe', hint: 'Mahlzeit' };
}

/* ── Ablaufsteuerung ────────────────────────────────────── */

function startPlay() {
  const game = state.game;
  if (state.players.length < game.minPlayers) {
    alert(`${game.title} braucht mindestens ${game.minPlayers} Personen.`);
    return;
  }

  play.flow = flowFor(game);
  play.step = 0;
  play.round = 1;
  play.scores = Object.fromEntries(state.players.map((p) => [p, 0]));
  beginRound();
}

function beginRound() {
  const game = state.game;
  const picked = pickWord(game);
  play.word = picked.word;
  play.hint = picked.hint;
  play.odd = state.players[Math.floor(Math.random() * state.players.length)];
  play.seat = 0;
  play.voter = 0;
  play.votes = {};
  play.remaining = state.minutes * 60;
  play.step = 0;
  renderStep();
}

function nextStep() {
  stopClock();
  play.step++;
  if (play.step >= play.flow.length) {
    play.round++;
    beginRound();
    return;
  }
  renderStep();
}

function renderStep() {
  const kind = play.flow[play.step];
  applyTint(state.game);
  if (kind === 'secret') renderSecret();
  if (kind === 'prompt') renderPrompt();
  if (kind === 'timer') renderTimer();
  if (kind === 'vote') renderVote();
  if (kind === 'result') renderResult();
  show(SCREEN_OF[kind]);
}

/* ── Baustein: Sitzkreis ────────────────────────────────── */

function seatRing(selector, total, done) {
  const node = $(selector);
  if (!node) return;
  const dots = Array.from({ length: total }, (_, i) => {
    const a = (i / total) * Math.PI * 2 - Math.PI / 2;
    const x = (50 + Math.cos(a) * 40).toFixed(1);
    const y = (50 + Math.sin(a) * 40).toFixed(1);
    const cls = i < done ? 'done' : i === done ? 'now' : '';
    return `<circle class="seat ${cls}" cx="${x}" cy="${y}" r="${i === done ? 6 : 4.5}"></circle>`;
  }).join('');
  node.innerHTML =
    `<svg viewBox="0 0 100 100" aria-hidden="true"><circle class="seat-track" cx="50" cy="50" r="40"></circle>${dots}</svg>` +
    `<span class="seat-count"><b>${done + 1}</b>/${total}</span>`;
}

/* ── Baustein: Geheime Karte ────────────────────────────── */

function renderSecret() {
  const person = state.players[play.seat];
  const total = state.players.length;

  $('#secret-progress').textContent = `Runde ${play.round} · Karte ${play.seat + 1}/${total}`;
  $('#secret-name').textContent = person;
  $('#secret-name').style.setProperty('--len', Math.max(4, person.length));
  $('#secret-note').textContent = 'Nur diese Person darf jetzt schauen.';
  $('#secret-next').disabled = true;
  seatRing('#secret-ring', total, play.seat);
  closeFlip(true);
}

function openFlip() {
  const person = state.players[play.seat];
  const isOdd = person === play.odd;
  const card = $('#flipcard');
  const value = isOdd ? play.hint : play.word;

  $('#secret-role').textContent = isOdd ? 'Du kennst den Begriff nicht' : 'Dein geheimer Begriff';
  $('#secret-word').textContent = value;
  $('#secret-word').style.setProperty('--len', Math.max(4, value.length));
  $('#secret-tip').textContent = isOdd
    ? 'Höre gut zu, improvisiere und bleibe unauffällig.'
    : 'Beschreibe ihn, ohne ihn direkt zu nennen.';

  card.classList.toggle('is-odd', isOdd);
  card.setAttribute('aria-expanded', 'true');
  play.seen = true;
  $('#secret-next').disabled = false;
  $('#secret-note').textContent = 'Gemerkt? Karte zuklappen und weitergeben.';
}

function closeFlip(immediate) {
  const card = $('#flipcard');
  card.setAttribute('aria-expanded', 'false');
  const clear = () => {
    if (card.getAttribute('aria-expanded') === 'true') return;
    $('#secret-role').textContent = '';
    $('#secret-word').textContent = '';
    $('#secret-tip').textContent = '';
    card.classList.remove('is-odd');
  };
  if (immediate) {
    clear();
    play.seen = false;
  } else {
    setTimeout(clear, 500);
    $('#secret-note').textContent = 'Karte ist zu. Jetzt weitergeben.';
  }
}

/* ── Baustein: Offene Karte ─────────────────────────────── */

function renderPrompt() {
  const game = state.game;
  const person = state.players[play.seat % state.players.length];
  const picked = pickWord(game);

  $('#prompt-progress').textContent = `${game.title} · Frage ${play.seat + 1}`;
  $('#prompt-turn').textContent = `${person} ist dran`;
  $('#prompt-text').textContent = picked.word;
}

/* ── Baustein: Timer ────────────────────────────────────── */

function renderTimer() {
  const game = state.game;
  $('#timer-label').textContent = `Runde ${play.round}`;
  $('#clock-meta').textContent = game.title;
  $('#timer-toggle').textContent = 'Zeit starten';
  $('#timer-steps').innerHTML = (game.instructions || []).slice(0, 3).map((s) => `<li>${esc(s)}</li>`).join('');
  $('#timer-next').textContent = play.flow[play.step + 1] ? 'Weiter' : 'Runde beenden';
  paintClock();
}

function paintClock() {
  const total = state.minutes * 60;
  const left = Math.max(0, play.remaining);
  $('#clock-time').textContent =
    `${String(Math.floor(left / 60)).padStart(2, '0')}:${String(left % 60).padStart(2, '0')}`;
  $('#clock-fill').style.strokeDashoffset = String(578 * (1 - left / total));
  $('.clock').classList.toggle('low', left > 0 && left <= 30);
}

function toggleClock() {
  if (play.ticker) {
    stopClock();
    $('#timer-toggle').textContent = 'Weiter';
    return;
  }
  if (play.remaining <= 0) return;
  play.deadline = Date.now() + play.remaining * 1000;
  $('#timer-toggle').textContent = 'Pause';
  play.ticker = setInterval(() => {
    const left = Math.max(0, Math.round((play.deadline - Date.now()) / 1000));
    if (left === play.remaining) return;
    play.remaining = left;
    paintClock();
    if (left === 0) {
      stopClock();
      $('#timer-toggle').textContent = 'Zeit ist um';
      navigator.vibrate?.([180, 100, 180]);
    }
  }, 250);
}

function stopClock() {
  if (play.ticker) clearInterval(play.ticker);
  play.ticker = null;
}

/* ── Baustein: Abstimmung ───────────────────────────────── */

function renderVote() {
  const total = state.players.length;
  if (play.voter >= total) {
    nextStep();
    return;
  }

  const person = state.players[play.voter];
  $('#vote-progress').textContent = `Stimme ${play.voter + 1}/${total}`;
  $('#vote-name').textContent = person;
  $('#vote-name').style.setProperty('--len', Math.max(4, person.length));
  $('#vote-note').textContent = 'Wer kennt den Begriff nicht?';
  $('#vote-targets').hidden = false;
  $('#vote-sealed').hidden = true;
  $('#vote-next').disabled = true;
  $('#vote-targets').innerHTML = state.players
    .filter((p) => p !== person)
    .map((p) => `<button class="vote-target" type="button" data-vote="${esc(p)}">${esc(p)}</button>`)
    .join('');
  seatRing('#vote-ring', total, play.voter);
}

function castVote(target) {
  play.votes[state.players[play.voter]] = target;
  $('#vote-targets').hidden = true;
  $('#vote-sealed').hidden = false;
  $('#vote-note').textContent = 'Niemand sieht deine Wahl. Gerät weitergeben.';
  $('#vote-next').disabled = false;
  $('#vote-next').textContent = play.voter + 1 >= state.players.length ? 'Auflösen' : 'Weitergeben';
}

/* ── Baustein: Ergebnis ─────────────────────────────────── */

function renderResult() {
  const tally = {};
  Object.values(play.votes).forEach((name) => (tally[name] = (tally[name] || 0) + 1));
  const top = Math.max(0, ...Object.values(tally));
  const leaders = Object.keys(tally).filter((n) => tally[n] === top);
  const accused = leaders.length === 1 ? leaders[0] : null;
  const caught = accused === play.odd;
  const voted = Object.keys(play.votes).length > 0;

  if (voted) {
    state.players.forEach((p) => {
      if (caught && p !== play.odd) play.scores[p] += 1;
      if (!caught && p === play.odd) play.scores[p] += 2;
    });
  }

  $('#result-round').textContent = `Runde ${play.round}`;
  $('#result-kick').textContent = 'Der Begriff war';
  $('#result-word').innerHTML = `<span>${esc(play.word)}</span>`;
  $('#result-word').style.setProperty('--len', Math.max(4, play.word.length));

  const verdict = $('#result-verdict');
  verdict.textContent = !voted
    ? `${play.odd} kannte den Begriff nicht.`
    : !accused
      ? 'Stimmengleichstand — niemand wurde eindeutig beschuldigt.'
      : caught
        ? `${accused} wurde gewählt und kannte den Begriff nicht.`
        : `${accused} wurde gewählt, kannte den Begriff aber.`;
  verdict.classList.toggle('miss', voted && !caught);

  const board = [...state.players].sort((a, b) => play.scores[b] - play.scores[a]);
  $('#result-board').innerHTML = board
    .map(
      (p, i) =>
        `<div class="row"><span class="row-ico">${i + 1}</span>
         <span class="row-main">${esc(p)}${p === play.odd ? '<small>kannte den Begriff nicht</small>' : ''}</span>
         <span class="score-val">${play.scores[p]}</span></div>`
    )
    .join('');
  $('#result-next').textContent = 'Nächste Runde';
}

/* ── Ereignisse für den Ablauf ──────────────────────────── */

document.addEventListener('click', (event) => {
  if (event.target.closest('[data-quit]')) {
    stopClock();
    show('mode');
    return;
  }

  if (event.target.closest('#flipcard')) {
    const open = $('#flipcard').getAttribute('aria-expanded') === 'true';
    if (open) closeFlip(false);
    else openFlip();
    return;
  }

  if (event.target.closest('#secret-next')) {
    if (!play.seen) return;
    play.seat++;
    if (play.seat >= state.players.length) {
      play.seat = 0;
      nextStep();
    } else {
      renderSecret();
    }
    return;
  }

  if (event.target.closest('#prompt-next')) {
    play.seat++;
    renderPrompt();
    return;
  }

  if (event.target.closest('#timer-toggle')) {
    toggleClock();
    return;
  }

  if (event.target.closest('#timer-next')) {
    nextStep();
    return;
  }

  const voteTarget = event.target.closest('[data-vote]');
  if (voteTarget) {
    castVote(voteTarget.dataset.vote);
    return;
  }

  if (event.target.closest('#vote-next')) {
    play.voter++;
    renderVote();
    return;
  }

  if (event.target.closest('#result-next')) {
    play.round++;
    beginRound();
    return;
  }

  if (event.target.closest('.dock .pill-primary') && state.screen === 'mode') {
    startPlay();
  }
});
