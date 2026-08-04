'use strict';

(function initialiseWakeLock(root) {
  let lock = null;
  let requesting = false;

  function discussionIsActive() {
    const discussion = document.querySelector('#round-screen');
    return Boolean(discussion && !discussion.hidden);
  }

  async function release() {
    const current = lock;
    lock = null;
    if (!current) return false;
    try {
      await current.release();
      return true;
    } catch {
      return false;
    }
  }

  async function request() {
    if (requesting || lock || document.hidden || !discussionIsActive() || !navigator.wakeLock?.request) return false;
    requesting = true;
    try {
      const acquired = await navigator.wakeLock.request('screen');
      if (!discussionIsActive() || document.hidden) {
        await acquired.release().catch(() => {});
        return false;
      }
      lock = acquired;
      acquired.addEventListener?.('release', () => {
        if (lock === acquired) lock = null;
      }, { once: true });
      return true;
    } catch {
      return false;
    } finally {
      requesting = false;
    }
  }

  function synchronize() {
    if (discussionIsActive() && !document.hidden) void request();
    else void release();
  }

  const discussion = document.querySelector('#round-screen');
  if (discussion) {
    new MutationObserver(synchronize).observe(discussion, {
      attributes: true,
      attributeFilter: ['hidden']
    });
  }

  document.addEventListener('visibilitychange', synchronize);
  root.addEventListener('pagehide', () => void release());

  root.SecretCircleWakeLock = Object.freeze({
    request,
    release,
    synchronize,
    version: 1
  });
})(window);
