'use strict';

(function initialiseRuntimeGuard(root) {
  const VERSION = '1.0.0-beta.3';
  const UPDATE_RELOAD_KEY = 'secret-circle-update-reload';
  let fatalMessageShown = false;

  function showRuntimeError() {
    if (fatalMessageShown) return;
    fatalMessageShown = true;
    const status = document.querySelector('#status');
    if (!status) return;
    status.textContent = 'Ein unerwarteter Fehler ist aufgetreten. Lade die App neu. Dein gespeicherter Spielstand bleibt erhalten.';
    status.classList.add('error');
  }

  root.addEventListener('error', event => {
    const target = event.target;
    if (target && target !== root) {
      const criticalResource = target instanceof HTMLScriptElement
        || (target instanceof HTMLLinkElement && target.rel === 'stylesheet');
      if (criticalResource) showRuntimeError();
      return;
    }
    showRuntimeError();
  }, true);

  root.addEventListener('unhandledrejection', () => {
    showRuntimeError();
  });

  if ('serviceWorker' in navigator) {
    const controlledAtStartup = Boolean(navigator.serviceWorker.controller);
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!controlledAtStartup) return;
      try {
        if (sessionStorage.getItem(UPDATE_RELOAD_KEY) === VERSION) return;
        sessionStorage.setItem(UPDATE_RELOAD_KEY, VERSION);
      } catch {}
      root.location.reload();
    });
  }

  root.addEventListener('pageshow', () => {
    try {
      if (sessionStorage.getItem(UPDATE_RELOAD_KEY) === VERSION) {
        sessionStorage.removeItem(UPDATE_RELOAD_KEY);
      }
    } catch {}
  }, { once: true });

  root.SecretCircleRuntime = Object.freeze({ version: VERSION });
})(window);
