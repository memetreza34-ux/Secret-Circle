'use strict';

/* Kategorien der Hub-Spiele für die v2-Startseite. Hub-Spiele laufen in party.html
   mit einer Kategorie oder mit „Gemischt“ (alle Kategorien zusammen); verlinkte
   Spiele wählen ihre Kategorie auf ihrer eigenen Seite. Der Name „Gemischt“ muss
   zu party-hub-round-state.js passen, das die Karten dafür zusammenführt. */
(function (root) {
  var CAT = root.SecretCirclePartyCatalog || { games: [], content: {} };
  var MIXED = 'Gemischt';
  var choice = {};

  function count(g, name) {
    var v = CAT.content && CAT.content[g.id] ? CAT.content[g.id][name] : null;
    if (Array.isArray(v)) return v.length;
    if (v && typeof v === 'object') {
      return Object.keys(v).reduce(function (n, k) { return n + (Array.isArray(v[k]) ? v[k].length : 0); }, 0);
    }
    return 0;
  }

  function list(g) {
    if (!g || g.linked || !CAT.getPackNames) return [];
    var packs = (CAT.getPackNames(g.id) || [])
      .map(function (name) { return { name: name, count: count(g, name) }; })
      .filter(function (p) { return p.count > 0; });
    if (packs.length < 2 || packs.some(function (p) { return p.name === MIXED; })) return packs;
    var total = packs.reduce(function (n, p) { return n + p.count; }, 0);
    return [{ name: MIXED, count: total, mixed: true }].concat(packs);
  }

  function chosen(g) {
    var all = list(g);
    for (var i = 0; i < all.length; i++) if (all[i].name === choice[g.id]) return all[i];
    return all[0] || null;
  }

  function choose(g, name) { choice[g.id] = name; }

  root.SecretCircleV2Packs = Object.freeze({ mixed: MIXED, list: list, chosen: chosen, choose: choose, version: 1 });
})(window);
