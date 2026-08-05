(function (root, factory) {
  const catalog = typeof module === 'object' && module.exports
    ? require('./party-routing.js')
    : root.SecretCirclePartyCatalog;
  const api = factory(catalog);
  if (typeof module === 'object' && module.exports) module.exports = api;
  else {
    root.SecretCirclePartyNight = api;
    let storage = null;
    try { storage = root.localStorage; } catch {}
    api.mount({ rootRef: root, documentRef: root.document, storage });
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function (catalog) {
  'use strict';
  if (!catalog) throw new Error('Party-Katalog für den Partyabend-Planer fehlt.');

  const VERSION = 1;
  const KEY = 'secret-circle-party-night-v1';
  const HUB_KEY = 'secret-circle-party-hub-v1';
  const PREF_KEY = 'secret-circle-party-preferences-v1';
  const DURATIONS = Object.freeze([15, 30, 45, 60, 90]);
  const MOODS = Object.freeze(['all', 'funny', 'competitive', 'deep', 'chaotic', 'clever', 'friendly']);
  const AGE_LEVELS = Object.freeze(['all', 'family', 'teen']);
  const EXCLUDED_MODES = new Set(['utility', 'random-player']);

  function cleanText(value, maximum = 100) {
    return String(value ?? '').normalize('NFKC').trim().replace(/\s+/g, ' ').slice(0, maximum);
  }

  function safeInteger(value, fallback = 0) {
    const number = Number(value);
    return Number.isInteger(number) && number >= 0 ? number : fallback;
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function normalizeConfig(value = {}) {
    const players = Math.min(20, Math.max(1, safeInteger(value.players, 4)));
    const duration = DURATIONS.includes(Number(value.duration)) ? Number(value.duration) : 45;
    const mood = MOODS.includes(value.mood) ? value.mood : 'all';
    const ageLevel = AGE_LEVELS.includes(value.ageLevel) ? value.ageLevel : 'all';
    return { players, duration, mood, ageLevel };
  }

  function ageAllowed(game, ageLevel) {
    if (ageLevel === 'all') return true;
    if (ageLevel === 'family') return game.age === 'all';
    return game.age === 'all' || game.age === 'teen';
  }

  function eligibleGames(configInput) {
    const config = normalizeConfig(configInput);
    return catalog.games.filter(game => (
      game.status === 'playable'
      && config.players >= game.minPlayers
      && config.players <= game.maxPlayers
      && ageAllowed(game, config.ageLevel)
      && !EXCLUDED_MODES.has(game.mode)
      && (catalog.itemCount(game.id) > 0 || game.mode === 'link' || Boolean(game.advancedMode))
    ));
  }

  function moodLabel(mood) {
    return ({
      all: 'gemischt',
      funny: 'lustig',
      competitive: 'wettkampforientiert',
      deep: 'persönlicher',
      chaotic: 'chaotisch',
      clever: 'clever',
      friendly: 'locker'
    })[mood] || 'gemischt';
  }

  function scoreCandidate(game, config, context, selected, slot, totalSlots, randomInt) {
    const selectedGroups = new Set(selected.map(item => item.group));
    const favorites = new Set(context.favorites || []);
    const recent = new Set((context.recent || []).slice(0, 5));
    const targetPerSlot = config.duration / Math.max(1, totalSlots);
    let score = 100 - Math.abs(game.duration - targetPerSlot) * 2;
    if (config.mood !== 'all' && game.moods.includes(config.mood)) score += 45;
    if (favorites.has(game.id)) score += 16;
    if (!recent.has(game.id)) score += 10;
    if (game.featured) score += 6;
    if (game.advancedMode) score += 5;
    if (!selectedGroups.has(game.group)) score += 18;
    else score -= 16;
    if (slot === 0 && game.duration <= 15 && game.moods.some(mood => ['funny', 'friendly', 'chaotic'].includes(mood))) score += 18;
    if (slot === totalSlots - 1 && game.moods.some(mood => ['competitive', 'chaotic'].includes(mood))) score += 14;
    score += Number(randomInt(7)) || 0;
    return score;
  }

  function reasonFor(game, config, context, slot, totalSlots, previousGroups) {
    if ((context.favorites || []).includes(game.id)) return 'Favorit eurer Gruppe';
    if (slot === 0 && game.duration <= 15) return 'schneller Einstieg';
    if (slot === totalSlots - 1 && game.moods.some(mood => ['competitive', 'chaotic'].includes(mood))) return 'starker Abschluss';
    if (config.mood !== 'all' && game.moods.includes(config.mood)) return `passt zu ${moodLabel(config.mood)}`;
    if (!previousGroups.has(game.group)) return 'bringt Abwechslung';
    return `${game.duration} Minuten gut einplanbar`;
  }

  function defaultRandomInt(maximum) {
    if (!Number.isInteger(maximum) || maximum <= 0) return 0;
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      const values = new Uint32Array(1);
      crypto.getRandomValues(values);
      return values[0] % maximum;
    }
    return Math.floor(Math.random() * maximum);
  }

  function buildPlan(configInput, context = {}, randomInt = defaultRandomInt) {
    const config = normalizeConfig(configInput);
    const candidates = eligibleGames(config);
    if (!candidates.length) return null;
    const desiredSlots = Math.min(6, Math.max(2, Math.round(config.duration / 15)));
    const totalSlots = Math.min(desiredSlots, candidates.length);
    const selected = [];
    const reasons = [];
    const remaining = [...candidates];

    for (let slot = 0; slot < totalSlots; slot += 1) {
      const previousGroups = new Set(selected.map(game => game.group));
      remaining.sort((left, right) => {
        const difference = scoreCandidate(right, config, context, selected, slot, totalSlots, randomInt)
          - scoreCandidate(left, config, context, selected, slot, totalSlots, randomInt);
        return difference || left.title.localeCompare(right.title, 'de-DE');
      });
      const chosen = remaining.shift();
      selected.push(chosen);
      reasons.push(reasonFor(chosen, config, context, slot, totalSlots, previousGroups));
    }

    const estimatedMinutes = selected.reduce((sum, game) => sum + game.duration, 0);
    return {
      version: VERSION,
      id: `night-${Date.now()}-${defaultRandomInt(1_000_000)}`,
      createdAt: new Date().toISOString(),
      config,
      estimatedMinutes,
      currentIndex: 0,
      steps: selected.map((game, index) => ({
        gameId: game.id,
        status: 'pending',
        reason: cleanText(reasons[index], 120)
      }))
    };
  }

  function deriveCurrentIndex(steps) {
    const index = steps.findIndex(step => step.status === 'pending');
    return index < 0 ? steps.length : index;
  }

  function normalizePlan(value) {
    if (!value || typeof value !== 'object' || Array.isArray(value) || value.version !== VERSION) return null;
    const config = normalizeConfig(value.config);
    const seen = new Set();
    const steps = [];
    for (const raw of Array.isArray(value.steps) ? value.steps : []) {
      const gameId = cleanText(raw?.gameId, 60);
      const game = catalog.getGame(gameId);
      if (!game || game.status !== 'playable' || seen.has(gameId)) continue;
      seen.add(gameId);
      steps.push({
        gameId,
        status: ['pending', 'done', 'skipped'].includes(raw.status) ? raw.status : 'pending',
        reason: cleanText(raw.reason, 120)
      });
      if (steps.length >= 6) break;
    }
    if (!steps.length) return null;
    return {
      version: VERSION,
      id: cleanText(value.id, 120) || `night-${Date.now()}`,
      createdAt: cleanText(value.createdAt, 40) || new Date().toISOString(),
      config,
      estimatedMinutes: safeInteger(value.estimatedMinutes, steps.reduce((sum, step) => sum + (catalog.getGame(step.gameId)?.duration || 0), 0)),
      currentIndex: deriveCurrentIndex(steps),
      steps
    };
  }

  function updateStep(planInput, gameId, status) {
    const plan = normalizePlan(planInput);
    if (!plan || !['done', 'skipped', 'pending'].includes(status)) return plan;
    const step = plan.steps.find(item => item.gameId === gameId);
    if (!step) return plan;
    step.status = status;
    plan.currentIndex = deriveCurrentIndex(plan.steps);
    return plan;
  }

  function createStore(storage) {
    function load() {
      if (!storage) return null;
      try { return normalizePlan(JSON.parse(storage.getItem(KEY))); } catch { return null; }
    }

    function save(planInput) {
      const plan = normalizePlan(planInput);
      if (!storage || !plan) return { ok: false, error: 'Der Partyabend konnte nicht gespeichert werden.' };
      try {
        storage.setItem(KEY, JSON.stringify(plan));
        return { ok: true, plan };
      } catch (error) {
        return { ok: false, error: error?.message || 'Der Partyabend konnte nicht gespeichert werden.' };
      }
    }

    function clear() {
      if (!storage) return { ok: false, error: 'Lokaler Speicher ist nicht verfügbar.' };
      try {
        storage.removeItem(KEY);
        return { ok: true };
      } catch (error) {
        return { ok: false, error: error?.message || 'Der Partyabend konnte nicht gelöscht werden.' };
      }
    }

    return Object.freeze({ load, save, clear });
  }

  function readJson(storage, key, fallback) {
    if (!storage) return fallback;
    try {
      const parsed = JSON.parse(storage.getItem(key));
      return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : fallback;
    } catch {
      return fallback;
    }
  }

  function mount({ rootRef, documentRef, storage }) {
    if (!rootRef || !documentRef || !storage || documentRef.querySelector('#party-night-planner')) return null;
    const hero = documentRef.querySelector('.hero-card');
    if (!hero) return null;
    const store = createStore(storage);
    let activePlan = store.load();

    const hubState = () => readJson(storage, HUB_KEY, { players: [], favorites: [], recent: [] });
    const preferences = () => readJson(storage, PREF_KEY, { ageLevel: 'all' });
    const playerCount = () => Array.isArray(hubState().players) ? hubState().players.length : 0;

    const section = documentRef.createElement('section');
    section.id = 'party-night-planner';
    section.className = 'party-night-panel section-block';
    section.setAttribute('aria-labelledby', 'party-night-title');
    section.innerHTML = `
      <div class="party-night-heading">
        <div>
          <p class="eyebrow">Smart Mix · ohne Anmeldung</p>
          <h2 id="party-night-title">Euren ganzen Partyabend planen</h2>
          <p>Secret Circle kombiniert passende Spiele zu einem abwechslungsreichen Ablauf. Gruppengröße, Stimmung, Altersstufe, Favoriten und zuletzt gespielte Titel werden berücksichtigt.</p>
        </div>
        <div class="party-night-player-count"><strong id="party-night-player-count">0</strong><span>Personen</span></div>
      </div>
      <div class="party-night-controls">
        <label for="party-night-duration">Zeitbudget<select id="party-night-duration"><option value="15">15 Minuten</option><option value="30">30 Minuten</option><option value="45" selected>45 Minuten</option><option value="60">60 Minuten</option><option value="90">90 Minuten</option></select></label>
        <label for="party-night-mood">Stimmung<select id="party-night-mood"><option value="all">Bunter Mix</option><option value="funny">Lustig</option><option value="competitive">Wettkampf</option><option value="deep">Tiefer</option><option value="chaotic">Chaos</option><option value="clever">Clever</option><option value="friendly">Locker</option></select></label>
        <label for="party-night-age">Altersstufe<select id="party-night-age"><option value="all">Alle Inhalte</option><option value="family">Familienfreundlich</option><option value="teen">Bis ab 12</option></select></label>
        <div class="party-night-actions"><button id="build-party-night" type="button">Plan erstellen</button><button id="surprise-party-night" class="secondary" type="button">Überrasch mich</button></div>
      </div>
      <p id="party-night-status" class="party-night-status" role="status" aria-live="polite"></p>
      <div id="party-night-result"></div>`;
    hero.insertAdjacentElement('afterend', section);

    const heroActions = hero.querySelector('.hero-actions');
    if (heroActions && !heroActions.querySelector('#open-party-night')) {
      const button = documentRef.createElement('button');
      button.id = 'open-party-night';
      button.className = 'secondary';
      button.type = 'button';
      button.textContent = activePlan ? 'Partyabend fortsetzen' : 'Partyabend planen';
      button.addEventListener('click', () => section.scrollIntoView({ behavior: 'smooth', block: 'start' }));
      heroActions.append(button);
    }

    const duration = section.querySelector('#party-night-duration');
    const mood = section.querySelector('#party-night-mood');
    const age = section.querySelector('#party-night-age');
    const result = section.querySelector('#party-night-result');
    const statusNode = section.querySelector('#party-night-status');
    age.value = AGE_LEVELS.includes(preferences().ageLevel) ? preferences().ageLevel : 'all';

    function setStatus(message, error = false) {
      statusNode.textContent = message || '';
      statusNode.classList.toggle('error', error);
    }

    function saveAndRender(nextPlan, message) {
      const saved = store.save(nextPlan);
      if (!saved.ok) {
        setStatus(saved.error, true);
        return false;
      }
      activePlan = saved.plan;
      const heroButton = documentRef.querySelector('#open-party-night');
      if (heroButton) heroButton.textContent = 'Partyabend fortsetzen';
      setStatus(message || 'Partyabend lokal gespeichert.');
      render();
      return true;
    }

    function configFromUi() {
      return normalizeConfig({
        players: playerCount(),
        duration: Number(duration.value),
        mood: mood.value,
        ageLevel: age.value
      });
    }

    function createPlan() {
      const count = playerCount();
      if (count < 2) {
        setStatus('Speichere zuerst mindestens zwei Personen im Bereich „Spieler“.', true);
        return;
      }
      const plan = buildPlan(configFromUi(), {
        favorites: hubState().favorites || [],
        recent: hubState().recent || []
      });
      if (!plan) {
        setStatus('Für diese Kombination wurden keine passenden Spiele gefunden.', true);
        return;
      }
      saveAndRender(plan, `${plan.steps.length} Spiele für euren Abend zusammengestellt.`);
    }

    function surprise() {
      duration.value = String(DURATIONS[1 + defaultRandomInt(DURATIONS.length - 1)]);
      mood.value = MOODS[1 + defaultRandomInt(MOODS.length - 1)];
      createPlan();
    }

    function renderEmpty() {
      result.innerHTML = `
        <div class="party-night-empty">
          <span aria-hidden="true">✦</span>
          <div><strong>Noch kein Ablauf geplant</strong><p>Wähle Zeit und Stimmung. Der Plan bleibt offline auf diesem Gerät gespeichert.</p></div>
        </div>`;
    }

    function render() {
      section.querySelector('#party-night-player-count').textContent = String(playerCount());
      result.replaceChildren();
      if (!activePlan) {
        renderEmpty();
        return;
      }
      const completed = activePlan.steps.filter(step => step.status === 'done').length;
      const handled = activePlan.steps.filter(step => step.status !== 'pending').length;
      const complete = activePlan.currentIndex >= activePlan.steps.length;
      const summary = documentRef.createElement('div');
      summary.className = 'party-night-summary';
      summary.innerHTML = `
        <div><p class="eyebrow">${complete ? 'Abend abgeschlossen' : `Station ${Math.min(activePlan.currentIndex + 1, activePlan.steps.length)} von ${activePlan.steps.length}`}</p><h3>${moodLabel(activePlan.config.mood)} · ${activePlan.config.players} Personen</h3><p>Etwa ${activePlan.estimatedMinutes} Minuten · ${completed} erledigt · ${handled - completed} übersprungen</p></div>
        <div class="party-night-progress" aria-label="${handled} von ${activePlan.steps.length} Stationen bearbeitet"><span style="width:${Math.round((handled / activePlan.steps.length) * 100)}%"></span></div>`;
      result.append(summary);

      const list = documentRef.createElement('ol');
      list.className = 'party-night-list';
      activePlan.steps.forEach((step, index) => {
        const game = catalog.getGame(step.gameId);
        if (!game) return;
        const item = documentRef.createElement('li');
        item.className = `party-night-step ${step.status}${index === activePlan.currentIndex ? ' current' : ''}`;
        const number = documentRef.createElement('span');
        number.className = 'party-night-number';
        number.textContent = step.status === 'done' ? '✓' : step.status === 'skipped' ? '–' : String(index + 1);
        const text = documentRef.createElement('div');
        text.className = 'party-night-game';
        const title = documentRef.createElement('strong');
        title.textContent = `${game.icon} ${game.title}`;
        const meta = documentRef.createElement('span');
        meta.textContent = `${game.group} · ca. ${game.duration} Min. · ${step.reason}`;
        text.append(title, meta);
        const actions = documentRef.createElement('div');
        actions.className = 'party-night-step-actions';
        const open = documentRef.createElement('button');
        open.type = 'button';
        open.className = 'secondary';
        open.textContent = 'Öffnen';
        open.dataset.openGame = game.id;
        open.addEventListener('click', () => {
          activePlan.lastOpenedGameId = game.id;
          store.save(activePlan);
        });
        const done = documentRef.createElement('button');
        done.type = 'button';
        done.textContent = step.status === 'done' ? 'Erledigt' : 'Als erledigt';
        done.disabled = step.status === 'done';
        done.addEventListener('click', () => saveAndRender(updateStep(activePlan, game.id, 'done'), `${game.title} als erledigt markiert.`));
        const skip = documentRef.createElement('button');
        skip.type = 'button';
        skip.className = 'text-link';
        skip.textContent = step.status === 'skipped' ? 'Übersprungen' : 'Überspringen';
        skip.disabled = step.status === 'skipped';
        skip.addEventListener('click', () => saveAndRender(updateStep(activePlan, game.id, 'skipped'), `${game.title} übersprungen.`));
        actions.append(open, done, skip);
        item.append(number, text, actions);
        list.append(item);
      });
      result.append(list);

      const footer = documentRef.createElement('div');
      footer.className = 'party-night-footer';
      const rebuild = documentRef.createElement('button');
      rebuild.type = 'button';
      rebuild.className = 'secondary';
      rebuild.textContent = 'Neu zusammenstellen';
      rebuild.addEventListener('click', createPlan);
      const clear = documentRef.createElement('button');
      clear.type = 'button';
      clear.className = 'text-link';
      clear.textContent = 'Plan löschen';
      clear.addEventListener('click', () => {
        const cleared = store.clear();
        if (!cleared.ok) return setStatus(cleared.error, true);
        activePlan = null;
        const heroButton = documentRef.querySelector('#open-party-night');
        if (heroButton) heroButton.textContent = 'Partyabend planen';
        setStatus('Partyabend-Plan gelöscht.');
        render();
      });
      footer.append(rebuild, clear);
      result.append(footer);
    }

    section.querySelector('#build-party-night').addEventListener('click', createPlan);
    section.querySelector('#surprise-party-night').addEventListener('click', surprise);
    rootRef.addEventListener('pageshow', render);
    rootRef.addEventListener('storage', event => {
      if ([KEY, HUB_KEY, PREF_KEY].includes(event.key)) {
        activePlan = store.load();
        render();
      }
    });
    render();
    return Object.freeze({ render, createPlan, store });
  }

  return Object.freeze({
    version: VERSION,
    storageKey: KEY,
    durations: DURATIONS,
    moods: MOODS,
    normalizeConfig,
    eligibleGames,
    buildPlan,
    normalizePlan,
    updateStep,
    createStore,
    mount
  });
});
