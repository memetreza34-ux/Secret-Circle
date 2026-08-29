(function (root, factory) {
  const base = typeof module === 'object' && module.exports
    ? require('./party-wave-one-catalog.js')
    : root.SecretCirclePartyCatalog;
  const api = factory(base);
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.SecretCirclePartyCatalog = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function waveOneImposterCatalogAdapter(base) {
  'use strict';
  if (!base) throw new Error('Konsolidierter Wave-1-Katalog fehlt.');
  if (!Array.isArray(base.waveOneImposterGameIds) || !base.waveOneImposterGameIds.length) {
    throw new Error('Wave-1-Imposter-Spiele fehlen im konsolidierten Katalog.');
  }
  return base;
});
