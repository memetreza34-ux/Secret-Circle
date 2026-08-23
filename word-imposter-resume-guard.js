'use strict';

(function exposeResumeGuard(root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else {
    root.SecretCircleWordImposterResumeGuard = api;
    api.install(root);
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function createResumeGuardApi() {
  function hasOwn(object, key) {
    return Object.prototype.hasOwnProperty.call(object, key);
  }

  function hasSequentialVotes(game) {
    if (!game || game.phase !== 'voting') return true;
    if (!Array.isArray(game.players) || !game.votes || typeof game.votes !== 'object' || Array.isArray(game.votes)) return false;

    const voters = Object.keys(game.votes);
    if (voters.length > game.players.length) return false;
    return game.players.slice(0, voters.length).every(player => hasOwn(game.votes, player));
  }

  function install(root) {
    const document = root?.document;
    const store = root?.SecretCircleStore;
    const engine = root?.SecretCircleEngine;
    if (!document || !store?.keys?.active || typeof store.getByKey !== 'function' || typeof store.removeByKey !== 'function' || !engine) return false;

    const status = document.querySelector('#status');
    const resumeBox = document.querySelector('#resume-box');
    const resumeButton = document.querySelector('#resume');

    function rejectUnsafeResume() {
      store.removeByKey(store.keys.active);
      if (resumeBox) resumeBox.hidden = true;
      if (status) {
        status.textContent = 'Der gespeicherte Abstimmungsstand war inkonsistent und wurde sicher verworfen. Starte die Runde neu.';
        status.classList.add('error');
      }
    }

    function inspect() {
      let active = null;
      try { active = store.getByKey(store.keys.active, null, engine); } catch { return true; }
      if (!active || hasSequentialVotes(active)) return true;
      rejectUnsafeResume();
      return false;
    }

    inspect();
    resumeButton?.addEventListener('click', event => {
      if (inspect()) return;
      event.preventDefault();
      event.stopImmediatePropagation();
    }, true);

    return true;
  }

  return Object.freeze({ hasSequentialVotes, install, version: 1 });
});
