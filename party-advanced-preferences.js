'use strict';

(() => {
  const select = document.querySelector('#advanced-length');
  if (!select) return;
  try {
    const value = JSON.parse(localStorage.getItem('secret-circle-party-preferences-v1'));
    const length = Number(value?.sessionLength);
    if ([3, 5, 10, 20].includes(length)) select.value = String(length);
  } catch {}
})();
