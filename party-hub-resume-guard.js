'use strict';

(function exposePartyHubResumeGuard(root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else {
    root.SecretCirclePartyHubResumeGuard = api;
    api.install(root);
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function createPartyHubResumeGuardApi() {
  const ACTIVE_KEY = 'secret-circle-party-hub-active-v1';
  const ACTIVE_VERSION = 1;
  const TIMER_MODES = new Set(['charades', 'taboo', 'hot-potato', 'word-chain']);

  function timerMatchesGame(game, session) {
    if (!game || !session || typeof session !== 'object' || Array.isArray(session)) return false;
    const timer = session.timer;
    const timerMode = TIMER_MODES.has(game.mode);

    if (!timerMode) return (timer === null || timer === undefined) && session.running !== true;
    if (timer === null || timer === undefined) return session.running !== true;
    if (!timer || typeof timer !== 'object' || Array.isArray(timer)) return false;
    if (timer.kind !== game.mode) return false;
    if (!['running', 'ended'].includes(timer.phase)) return false;

    const remaining = Number(timer.remainingMs);
    if (!Number.isFinite(remaining) || remaining < 0 || remaining > 3_600_000) return false;
    if (timer.phase === 'running') {
      if (remaining <= 0 || session.running !== true) return false;
    } else if (remaining !== 0 || session.running === true) return false;

    return true;
  }

  function validateSnapshot(value, catalog) {
    if (!value || typeof value !== 'object' || Array.isArray(value) || value.version !== ACTIVE_VERSION) return false;
    const session = value.session;
    if (!session || typeof session !== 'object' || Array.isArray(session)) return false;
    const game = catalog?.getGame?.(session.gameId);
    if (!game || game.status !== 'playable' || game.mode === 'link') return false;
    return timerMatchesGame(game, session);
  }

  function removeResumeUi(root) {
    root?.document?.querySelector?.('#hub-resume-session')?.remove?.();
  }

  function showDiscardNotice(root) {
    removeResumeUi(root);
    const status = root?.document?.querySelector?.('#hub-status');
    if (!status) return;
    status.textContent = 'Ein inkonsistenter Timer-Spielstand wurde sicher verworfen. Starte das Spiel neu.';
    status.classList.add('error');
  }

  function install(root) {
    const storage = root?.localStorage;
    const catalog = root?.SecretCirclePartyCatalog;
    if (!storage || !catalog?.getGame) return false;

    let raw;
    try { raw = storage.getItem(ACTIVE_KEY); } catch { return false; }
    if (!raw) return true;

    let parsed;
    try { parsed = JSON.parse(raw); } catch { parsed = null; }
    if (validateSnapshot(parsed, catalog)) return true;

    try { storage.removeItem(ACTIVE_KEY); } catch { return false; }
    showDiscardNotice(root);
    return false;
  }

  return Object.freeze({
    activeKey: ACTIVE_KEY,
    activeVersion: ACTIVE_VERSION,
    timerModes: TIMER_MODES,
    timerMatchesGame,
    validateSnapshot,
    removeResumeUi,
    install,
    version: 2
  });
});