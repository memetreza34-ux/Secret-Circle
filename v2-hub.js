/* Secret Circle — v2 Hub
   Vanilla JS, kein Build. Alle Spieldaten kommen aus window.SecretCirclePartyCatalog
   und window.SecretCircleContent. Nichts hier ist erfunden. */

(function () {
  'use strict';

  var CAT = window.SecretCirclePartyCatalog || { games: [], content: {} };
  var WORDS = window.SecretCircleContent || { categories: {} };
  var STORE = 'sc.v2.state';

  /* ── Die sechs Kategorien ─────────────────────────────────────────── */

  var BUCKETS = [
    { id: 'taeuschung', label: 'Täuschung', tint: '#FF4560', ground: '#43101d', groups: ['Täuschung'] },
    { id: 'reden', label: 'Reden & Wählen', tint: '#4DD9A0', ground: '#06402f', groups: ['Abstimmen', 'Klassiker', 'Diskussion', 'Social', 'Debatte', 'Schnellfragen', 'Freundschaft', 'Entscheidung'] },
    { id: 'raten', label: 'Raten & Zeigen', tint: '#FFB020', ground: '#462c05', groups: ['Darstellen', 'Erklären', 'Raten', 'Anime-Quiz', 'Audio', 'Bewegung', 'Raten & Hinweise'] },
    { id: 'kreativ', label: 'Kreativ', tint: '#A78BFA', ground: '#2d1e52', groups: ['Kreativ', 'Schreiben & Kreativ'] },
    { id: 'wissen', label: 'Wissen & Schätzen', tint: '#38BDF8', ground: '#093548', groups: ['Quiz & Wissen', 'Quiz', 'Schätzen', 'Schätzen & Voting', 'Einschätzen', 'Ranking', 'Bluff & Wissen'] },
    { id: 'schnell', label: 'Schnell', tint: '#F472B6', ground: '#451234', groups: ['Schnell', 'Challenge', 'Werkzeuge'] }
  ];

  /* ── Kurzhelfer ───────────────────────────────────────────────────── */

  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function screenEl(n) { return $('[data-screen="' + n + '"]'); }
  function clear(n) { while (n && n.firstChild) n.removeChild(n.firstChild); }
  function make(tag, cls, txt) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (txt != null) e.textContent = txt;
    return e;
  }
  function hash(s) {
    var h = 0;
    for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) & 0x7fffffff;
    return h;
  }
  function shuffle(a) {
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function pickOne(a) { return a[Math.floor(Math.random() * a.length)]; }
  function deCompare(a, b) { return String(a).localeCompare(String(b), 'de'); }
  function fold(s) { return String(s || '').toLocaleLowerCase('de'); }

  /* Schriftgröße an die Zeichenzahl binden. Der cq-Container ist das Elternelement. */
  function fit(node, text, cap) {
    if (!node) return;
    node.textContent = text == null ? '' : String(text);
    node.style.setProperty('--n', Math.max(4, String(text || '').length));
    if (cap) node.style.setProperty('--cap', cap);
  }

  /* ── Bildsprache: Punkt, Kreis, Linie ─────────────────────────────── */

  function tag(name, attrs) {
    var s = '<' + name;
    for (var k in attrs) if (attrs[k] != null) s += ' ' + k + '="' + attrs[k] + '"';
    return s + '></' + name + '>';
  }
  function wrapSVG(inner, box) {
    return '<svg viewBox="' + (box || '1 1 98 98') + '" width="100%" height="100%" aria-hidden="true" focusable="false" style="display:block">' + inner + '</svg>';
  }

  function markSVG(game) {
    var h = hash(game.id);
    var tint = game.bucket.tint;
    var line = '#5B6376', soft = '#3B4254', bright = '#DCE1EB';
    var fam = game.bucket.id;
    var n = 5 + (h % 4);
    var rot = (h % 12) * 30;
    var out = [];
    function ring(r, stroke, w) { out.push(tag('circle', { cx: 50, cy: 50, r: r, fill: 'none', stroke: stroke, 'stroke-width': w || 1.8 })); }
    function dotAt(a, r, rad, fill, stroke) {
      var t = (a * Math.PI) / 180;
      out.push(tag('circle', {
        cx: (50 + Math.cos(t) * r).toFixed(2), cy: (50 + Math.sin(t) * r).toFixed(2), r: rad,
        fill: fill || soft, stroke: stroke || 'none', 'stroke-width': stroke ? 2 : 0
      }));
    }

    if (fam === 'taeuschung') {
      ring(30, soft, 1.8);
      var odd = h % n;
      for (var i = 0; i < n; i++) {
        var a = rot + (i / n) * 360;
        if (i === odd) dotAt(a, 41, 6, 'none', tint);
        else dotAt(a, 30, 5.5, i % 2 ? line : bright);
      }
    } else if (fam === 'reden') {
      ring(30, soft, 1.8);
      var target = h % n;
      var pt = function (i) {
        var t = ((rot + (i / n) * 360) * Math.PI) / 180;
        return [50 + Math.cos(t) * 30, 50 + Math.sin(t) * 30];
      };
      var tp = pt(target);
      for (var j = 0; j < n; j++) {
        if (j === target) continue;
        var p = pt(j);
        out.push(tag('line', { x1: p[0].toFixed(2), y1: p[1].toFixed(2), x2: tp[0].toFixed(2), y2: tp[1].toFixed(2), stroke: soft, 'stroke-width': 1.5 }));
      }
      for (var k = 0; k < n; k++) dotAt(rot + (k / n) * 360, 30, k === target ? 7.5 : 5, k === target ? tint : line);
    } else if (fam === 'raten') {
      [200, 140, 90].forEach(function (sp, i) {
        var r = 16 + i * 13;
        var a0 = ((rot + i * 55) * Math.PI) / 180;
        var a1 = ((rot + i * 55 + sp) * Math.PI) / 180;
        var large = sp > 180 ? 1 : 0;
        out.push('<path d="M ' + (50 + Math.cos(a0) * r).toFixed(2) + ' ' + (50 + Math.sin(a0) * r).toFixed(2) +
          ' A ' + r + ' ' + r + ' 0 ' + large + ' 1 ' + (50 + Math.cos(a1) * r).toFixed(2) + ' ' + (50 + Math.sin(a1) * r).toFixed(2) +
          '" fill="none" stroke="' + (i === 1 ? bright : soft) + '" stroke-width="2.4" stroke-linecap="round"></path>');
      });
      dotAt(rot + 300, 43, 6, tint);
      dotAt(rot + 120, 29, 4.5, line);
    } else if (fam === 'kreativ') {
      var pts = [];
      for (var m = 0; m < n; m++) {
        var ang = ((rot + (m / n) * 300 + ((h >> m) % 30)) * Math.PI) / 180;
        var rr = 18 + ((h >> (m + 2)) % 24);
        pts.push([50 + Math.cos(ang) * rr, 50 + Math.sin(ang) * rr]);
      }
      out.push('<polyline points="' + pts.map(function (p) { return p[0].toFixed(1) + ',' + p[1].toFixed(1); }).join(' ') +
        '" fill="none" stroke="' + soft + '" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"></polyline>');
      pts.forEach(function (p, i) {
        out.push(tag('circle', {
          cx: p[0].toFixed(2), cy: p[1].toFixed(2), r: i === pts.length - 1 ? 6.5 : 4.5,
          fill: i === pts.length - 1 ? tint : i === 0 ? bright : line
        }));
      });
    } else if (fam === 'wissen') {
      ring(34, soft, 1.8);
      ring(20, soft, 1.8);
      out.push(tag('circle', { cx: 50, cy: 50, r: 6.5, fill: line }));
      var ticks = 6 + (h % 5);
      for (var q = 0; q < ticks; q++) {
        var ta = ((rot + (q / ticks) * 360) * Math.PI) / 180;
        out.push(tag('line', {
          x1: (50 + Math.cos(ta) * 38).toFixed(2), y1: (50 + Math.sin(ta) * 38).toFixed(2),
          x2: (50 + Math.cos(ta) * 45).toFixed(2), y2: (50 + Math.sin(ta) * 45).toFixed(2),
          stroke: q === 0 ? bright : soft, 'stroke-width': 2.4, 'stroke-linecap': 'round'
        }));
      }
      dotAt(rot + (h % 360), 34, 6.5, tint);
    } else {
      var spokes = 6 + (h % 4);
      for (var s = 0; s < spokes; s++) {
        var sa = ((rot + (s / spokes) * 360) * Math.PI) / 180;
        var len = 18 + ((h >> s) % 18);
        out.push(tag('line', {
          x1: (50 + Math.cos(sa) * 10).toFixed(2), y1: (50 + Math.sin(sa) * 10).toFixed(2),
          x2: (50 + Math.cos(sa) * len).toFixed(2), y2: (50 + Math.sin(sa) * len).toFixed(2),
          stroke: s === 0 ? bright : soft, 'stroke-width': 2.4, 'stroke-linecap': 'round'
        }));
        if (s === 0) out.push(tag('circle', { cx: (50 + Math.cos(sa) * (len + 8)).toFixed(2), cy: (50 + Math.sin(sa) * (len + 8)).toFixed(2), r: 5.5, fill: tint }));
      }
      out.push(tag('circle', { cx: 50, cy: 50, r: 5.5, fill: line }));
    }
    return wrapSVG(out.join(''));
  }

  var AVATARS = ['taeuschung', 'reden', 'raten', 'kreativ', 'wissen', 'schnell', 'reden', 'wissen'];
  function avatarSVG(i) {
    var b = BUCKETS[i % BUCKETS.length];
    return markSVG({ id: 'avatar-' + i, bucket: b });
  }

  /* ── Symbole ──────────────────────────────────────────────────────── */

  var G = {
    back: '<polyline points="14,5 8,12 14,19"/>',
    chev: '<polyline points="10,6 15,12 10,18" stroke="#7B8296"/>',
    close: '<line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/>',
    search: '<circle cx="11" cy="11" r="6"/><line x1="15.5" y1="15.5" x2="20" y2="20"/>',
    user: '<circle cx="12" cy="9" r="3.6"/><path d="M5.5 20a6.5 6.5 0 0 1 13 0"/>',
    home: '<circle cx="12" cy="12" r="7.5"/><circle cx="12" cy="12" r="2.4" fill="currentColor" stroke="none"/>',
    grid: '<circle cx="8" cy="8" r="2.6"/><circle cx="16" cy="8" r="2.6"/><circle cx="8" cy="16" r="2.6"/><circle cx="16" cy="16" r="2.6"/>',
    play: '<polygon points="9,6 19,12 9,18" fill="currentColor" stroke="none"/>',
    users: '<circle cx="9" cy="9" r="3.2"/><path d="M3.5 19a5.5 5.5 0 0 1 11 0"/><circle cx="17" cy="10" r="2.4"/><path d="M14 19a4 4 0 0 1 6.5-3"/>',
    dice: '<rect x="4.5" y="4.5" width="15" height="15" rx="4"/><circle cx="9" cy="9" r="1.4" fill="currentColor" stroke="none"/><circle cx="15" cy="15" r="1.4" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none"/>',
    gear: '<circle cx="12" cy="12" r="4"/><line x1="12" y1="3" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="21"/><line x1="3" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="21" y2="12"/>',
    tv: '<rect x="3.5" y="6" width="17" height="12" rx="3"/><polygon points="11,10 15,12 11,14" fill="currentColor" stroke="none"/>',
    check: '<polyline points="5,13 10,18 19,7"/>',
    plus: '<line x1="12" y1="5" x2="12" y2="19" stroke-width="2.2"/><line x1="5" y1="12" x2="19" y2="12" stroke-width="2.2"/>',
    minus: '<line x1="5" y1="12" x2="19" y2="12" stroke-width="2.2"/>',
    pencil: '<path d="M5 19l2-5 9-9 3 3-9 9z"/>',
    folder: '<path d="M4 8.5A2.5 2.5 0 0 1 6.5 6H10l2 2.5h5.5A2.5 2.5 0 0 1 20 11v5.5A2.5 2.5 0 0 1 17.5 19h-11A2.5 2.5 0 0 1 4 16.5z"/>',
    shield: '<path d="M12 4l7 2.5V12c0 4-3 6.6-7 8-4-1.4-7-4-7-8V6.5z"/>',
    down: '<line x1="12" y1="4" x2="12" y2="15"/><polyline points="8,11.5 12,15.5 16,11.5"/><line x1="5" y1="19.5" x2="19" y2="19.5"/>',
    trash: '<path d="M6 8h12l-1 11H7z"/><line x1="4.5" y1="8" x2="19.5" y2="8"/><line x1="10" y1="5" x2="14" y2="5"/>',
    help: '<circle cx="12" cy="12" r="8"/><path d="M9.7 9.5a2.4 2.4 0 1 1 3.3 2.2c-.7.3-1 .9-1 1.6"/><circle cx="12" cy="16.6" r="1" fill="currentColor" stroke="none"/>',
    seal: '<polyline points="5,13 10,18 19,7"/>',
    flame: '<path d="M12 3c4 4 6 6 6 9.5A6 6 0 0 1 6 12.5C6 9 8 7 12 3z"/>',
    spark: '<circle cx="12" cy="12" r="3.4" fill="currentColor" stroke="none"/><line x1="12" y1="2.5" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="21.5"/><line x1="2.5" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="21.5" y2="12"/>',
    brain: '<circle cx="12" cy="12" r="7.5" stroke="#7B8296"/><circle cx="12" cy="12" r="3.6"/>'
  };
  function icon(name, w) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="' + (w || 1.8) +
      '" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + (G[name] || '') + '</svg>';
  }

  function seatRingSVG(total, active, tint) {
    var out = [tag('circle', { cx: 50, cy: 50, r: 40, fill: 'none', stroke: '#ffffff1f', 'stroke-width': 2 })];
    var n = Math.max(1, total);
    for (var i = 0; i < n; i++) {
      var a = ((i / n) * 360 - 90) * Math.PI / 180;
      var done = i < active;
      out.push(tag('circle', {
        cx: (50 + Math.cos(a) * 40).toFixed(2), cy: (50 + Math.sin(a) * 40).toFixed(2),
        r: i === active ? 8 : 5.5,
        fill: i === active ? tint : done ? '#EEF1F7' : '#3B4254'
      }));
    }
    return wrapSVG(out.join(''));
  }

  /* ── Spiele aus dem Katalog ───────────────────────────────────────── */

  function bucketFor(group) {
    for (var i = 0; i < BUCKETS.length; i++) if (BUCKETS[i].groups.indexOf(group) >= 0) return BUCKETS[i];
    return BUCKETS[0];
  }

  var GAMES = (CAT.games || []).map(function (g) {
    return {
      id: g.id,
      title: g.title,
      group: g.group,
      min: g.minPlayers || 2,
      max: g.maxPlayers || 20,
      dur: g.duration || 10,
      feat: !!g.featured,
      desc: g.description || '',
      steps: g.instructions || [],
      moods: g.moods || [],
      bucket: bucketFor(g.group)
    };
  });

  function gameById(id) {
    for (var i = 0; i < GAMES.length; i++) if (GAMES[i].id === id) return GAMES[i];
    return GAMES[0];
  }

  /* ── Pakete und Inhalte ───────────────────────────────────────────── */

  /* Verschachtelte Pakete ({truth, dare}) erkennen. Die zuletzt geladene
     Katalogfassung flacht sie in getItems auf ein leeres Array ab, deshalb
     wird der Rohinhalt gegengelesen. */
  function tdShape(g) {
    var c = CAT.content ? CAT.content[g.id] : null;
    if (!c || Array.isArray(c)) return false;
    var first = c[Object.keys(c)[0]];
    return !!(first && !Array.isArray(first) && (first.truth || first.dare));
  }

  /* Ein einzelnes Paket, immer als flaches Array. */
  function rawPack(g, key) {
    if (g.id === 'imposter') {
      if (key && key.indexOf('own:') === 0) {
        var own = (S.ownPacks || []).filter(function (p) { return p.id === key.slice(4); })[0];
        return own ? own.terms.map(function (t) { return [t.word, t.hint || own.name]; }) : [];
      }
      var cat = (WORDS.categories || {})[key];
      return cat ? cat.entries.slice() : [];
    }
    var c = CAT.content ? CAT.content[g.id] : null;
    var v = c && !Array.isArray(c) ? c[key] : null;
    if (Array.isArray(v)) return v.slice();
    if (v && typeof v === 'object') {
      return Object.keys(v).reduce(function (acc, k) {
        return Array.isArray(v[k]) ? acc.concat(v[k]) : acc;
      }, []);
    }
    var got = CAT.getItems ? (CAT.getItems(g.id, key) || []) : [];
    return Array.isArray(got) ? got.slice() : [];
  }

  /* Alle Kategorien eines Modus, jeweils mit Kartenzahl. Leere fliegen raus. */
  function packsOf(g) {
    if (!g) return [];
    var list;
    if (g.id === 'imposter') {
      list = Object.keys(WORDS.categories || {}).map(function (k) {
        return { key: k, name: WORDS.categories[k].label, own: false };
      });
      (S.ownPacks || []).forEach(function (p) {
        if (p.terms && p.terms.length) list.push({ key: 'own:' + p.id, name: p.name, own: true });
      });
    } else {
      list = (CAT.getPackNames ? (CAT.getPackNames(g.id) || []) : [])
        .map(function (k) { return { key: k, name: k, own: false }; });
    }
    list.forEach(function (p) { p.count = rawPack(g, p.key).length; });
    return list.filter(function (p) { return p.count > 0; });
  }

  function selectedPacks(g) {
    var all = packsOf(g);
    var want = (S.packSel && S.packSel[g.id]) || null;
    if (!want || !want.length) return all;
    var keep = all.filter(function (p) { return want.indexOf(p.key) >= 0; });
    return keep.length ? keep : all;
  }

  function packSummary(g) {
    var all = packsOf(g);
    var sel = selectedPacks(g);
    if (!all.length) return '—';
    if (sel.length === 1) return sel[0].name;
    if (sel.length === all.length) return 'Alle ' + all.length;
    return sel.length + ' von ' + all.length;
  }
  function termCount(g) {
    return selectedPacks(g).reduce(function (n, p) { return n + p.count; }, 0);
  }

  /* Kartenstapel aus allen gewählten Kategorien, gemischt und ohne Wiederholung,
     bis er einmal durch ist. */
  function pool(g) {
    return selectedPacks(g).reduce(function (acc, p) { return acc.concat(rawPack(g, p.key)); }, []);
  }
  function tdPool(g, which) {
    var c = CAT.content ? CAT.content[g.id] : null;
    if (!c) return [];
    return selectedPacks(g).reduce(function (acc, p) {
      var v = c[p.key];
      return v && Array.isArray(v[which]) ? acc.concat(v[which]) : acc;
    }, []);
  }
  function deal(m, g, kind) {
    if (!m.decks) m.decks = {};
    var d = m.decks[kind];
    if (!d || !d.list || !d.list.length) {
      d = m.decks[kind] = { list: shuffle((kind === 'main' ? pool(g) : tdPool(g, kind)).slice()), at: 0 };
    }
    if (!d.list.length) return null;
    if (d.at >= d.list.length) { d.list = shuffle(d.list); d.at = 0; }
    return d.list[d.at++];
  }

  /* Der Katalog liefert sieben Kartenformen. Alles wird auf Text normalisiert,
     damit kein Bildschirm ein rohes Objekt zeigt.
     alt = zweite Fassung für die abweichende Person (Question Imposter,
     Undercover). Dort bekommen alle eine Karte, niemand kennt die Rollen. */
  function cardOf(item, fallbackHint) {
    var c = { word: '', hint: fallbackHint || '', alt: '', list: [] };
    if (item == null) return c;
    if (typeof item === 'string' || typeof item === 'number') { c.word = String(item); return c; }
    if (Array.isArray(item)) {
      c.word = String(item[0]);
      var rest = item.slice(1).filter(function (x) { return typeof x === 'string'; });
      if (item.length === 2 && rest.length === 1) c.hint = rest[0];
      else c.list = rest;
      return c;
    }
    if (item.word) {
      c.word = String(item.word);
      if (Array.isArray(item.banned)) c.hint = 'Tabu: ' + item.banned.join(' · ');
      else if (item.hint) c.hint = String(item.hint);
      return c;
    }
    if (item.main) { c.word = String(item.main); c.alt = String(item.imposter || ''); return c; }
    if (item.civilian) { c.word = String(item.civilian); c.alt = String(item.undercover || ''); return c; }
    if (item.title && Array.isArray(item.entries)) { c.word = String(item.title); c.list = item.entries.slice(); return c; }
    if (item.statement) { c.word = String(item.statement); return c; }
    if (item.question) {
      c.word = String(item.question);
      if (Array.isArray(item.options)) c.list = item.options.slice();
      return c;
    }
    return c;
  }

  function drawCard(g, m) {
    var item = deal(m, g, 'main');
    if (item == null) return { word: g.title, hint: g.bucket.label, alt: '', list: [] };
    return cardOf(item, '');
  }

  /* ── Ablauf je Modus ──────────────────────────────────────────────── */

  function flowFor(g) {
    if (g.id === 'mafia') return ['secret', 'vote', 'result'];
    if (g.id === 'hot-potato' || g.id === 'word-chain') return ['timer', 'result'];
    if (g.id === 'spin-bottle' || g.id === 'dice-coin') return ['tool'];
    if (['two-truths', 'question-imposter', 'location-spy'].indexOf(g.id) >= 0) return ['secret', 'timer', 'vote', 'result'];
    var b = g.bucket.id;
    if (b === 'taeuschung') return ['secret', 'timer', 'vote', 'result'];
    if (b === 'raten') return ['secret', 'timer', 'result'];
    if (b === 'schnell') return ['timer', 'result'];
    return ['prompt'];
  }
  function rulesUsed(g) {
    var f = flowFor(g);
    return { odds: f.indexOf('vote') >= 0, minutes: f.indexOf('timer') >= 0, rounds: f.indexOf('result') >= 0 };
  }
  function hasRules(g) {
    var r = rulesUsed(g);
    return r.odds || r.minutes || r.rounds;
  }

  /* ── Zustand ──────────────────────────────────────────────────────── */

  var DEFAULTS = {
    players: [],
    profileName: 'Du',
    avatar: 0,
    ownPacks: [],
    history: [],
    gameId: 'imposter',
    packs: {},
    packSel: {},
    odds: 1,
    minutes: 3,
    rounds: 3,
    hint: true,
    firstSeen: null,
    match: null
  };

  var S = load();
  function load() {
    var base = {};
    for (var k in DEFAULTS) base[k] = Array.isArray(DEFAULTS[k]) ? DEFAULTS[k].slice() : DEFAULTS[k] && typeof DEFAULTS[k] === 'object' ? {} : DEFAULTS[k];
    try {
      var raw = localStorage.getItem(STORE);
      if (raw) {
        var got = JSON.parse(raw);
        for (var j in got) if (got[j] !== undefined) base[j] = got[j];
      }
    } catch (e) { /* Erster Start oder gesperrter Speicher. */ }
    if (!base.firstSeen) base.firstSeen = Date.now();
    /* Frühere Fassung kannte nur eine Kategorie je Modus. */
    if (!base.packSel) base.packSel = {};
    Object.keys(base.packs || {}).forEach(function (id) {
      if (!base.packSel[id] && base.packs[id]) base.packSel[id] = [base.packs[id]];
    });
    return base;
  }
  function save() {
    try { localStorage.setItem(STORE, JSON.stringify(S)); } catch (e) { /* Speicher voll oder gesperrt. */ }
  }

  function names() { return S.players.slice(); }
  function game() { return gameById(S.gameId); }

  /* ── Router ───────────────────────────────────────────────────────── */

  var NAV = [];
  var CURRENT = 'home';
  var TABS = [
    { id: 'home', label: 'Start', icon: 'home' },
    { id: 'games', label: 'Spiele', icon: 'grid' },
    { id: 'profile', label: 'Profil', icon: 'user' }
  ];

  function announce(msg) {
    var l = $('#live');
    if (l) l.textContent = msg;
  }

  function applyTint(name) {
    var el = screenEl(name);
    if (!el || !el.hasAttribute('data-tint')) return;
    var g = game();
    el.style.setProperty('--tint', g.bucket.tint);
    el.style.setProperty('--ground', g.bucket.ground);
    el.style.background = g.bucket.ground;
  }

  function show(name, opts) {
    opts = opts || {};
    if (!opts.back && !opts.replace && CURRENT !== name) NAV.push(CURRENT);
    if (opts.reset) NAV = [];
    CURRENT = name;
    $$('.screen').forEach(function (s) { s.hidden = s.dataset.screen !== name; });
    applyTint(name);
    render(name);
    var head = $('[data-head]', screenEl(name));
    if (head) { try { head.focus({ preventScroll: true }); } catch (e) { head.focus(); } }
    var body = $('.body', screenEl(name));
    if (body) body.scrollTop = 0;
    announce(head ? head.textContent : name);
    if (TABS.some(function (t) { return t.id === name; })) renderTabs();
  }
  function back() {
    var p = NAV.pop() || 'home';
    CURRENT = null;
    show(p, { back: true });
  }

  /* ── Symbole und Tabs einsetzen ───────────────────────────────────── */

  function paintIcons(root) {
    $$('[data-icon]', root || document).forEach(function (n) {
      if (n.dataset.iconDone) return;
      n.innerHTML = icon(n.dataset.icon);
      n.dataset.iconDone = '1';
    });
    $$('[data-icon-before]', root || document).forEach(function (n) {
      if (n.dataset.iconDone) return;
      n.insertAdjacentHTML('afterbegin', icon(n.dataset.iconBefore));
      n.dataset.iconDone = '1';
    });
  }

  function renderTabs() {
    $$('.tabbar').forEach(function (nav) {
      clear(nav);
      TABS.forEach(function (t) {
        var b = make('button', 'tab');
        b.type = 'button';
        b.setAttribute('role', 'tab');
        b.setAttribute('aria-selected', String(CURRENT === t.id));
        b.innerHTML = icon(t.icon) + '<span>' + t.label + '</span>';
        b.addEventListener('click', function () { show(t.id, { reset: true }); });
        nav.appendChild(b);
      });
    });
  }

  /* ── Kachel ───────────────────────────────────────────────────────── */

  function gameCard(g, rank) {
    var b = make('button', 'gcard');
    b.type = 'button';
    var art = make('span', 'gcard-art');
    if (rank) art.appendChild(make('span', 'gcard-rank', String(rank)));
    var mk = make('span', 'mark');
    mk.innerHTML = markSVG(g);
    art.appendChild(mk);
    var pad = make('span', 'gcard-pad');
    pad.appendChild(make('b', null, g.title));
    var meta = make('small');
    var dot = make('i', 'dot');
    dot.style.background = g.bucket.tint;
    meta.appendChild(dot);
    meta.appendChild(document.createTextNode(g.min + '–' + g.max + ' · ' + g.dur + ' min'));
    pad.appendChild(meta);
    b.appendChild(art);
    b.appendChild(pad);
    b.addEventListener('click', function () { openGame(g.id); });
    return b;
  }

  function openGame(id) {
    S.gameId = id;
    save();
    show('mode');
  }

  /* ── START ────────────────────────────────────────────────────────── */

  var HERO_IDS = [];
  var heroIdx = 0;

  /* Reihum durch die sechs Kategorien, damit die Farben als System lesbar
     werden statt in Blöcken der Katalogreihenfolge zu erscheinen. */
  function mix(list) {
    var by = {};
    BUCKETS.forEach(function (b) { by[b.id] = []; });
    list.forEach(function (g) { (by[g.bucket.id] || (by[g.bucket.id] = [])).push(g); });
    var out = [], i = 0;
    while (out.length < list.length) {
      var added = false;
      BUCKETS.forEach(function (b) {
        var arr = by[b.id];
        if (arr && arr[i]) { out.push(arr[i]); added = true; }
      });
      if (!added) break;
      i += 1;
    }
    return out;
  }

  var SECTIONS = [
    { title: 'Top 10 aktuell', icon: 'flame', rank: true, pick: function (l) { return l.filter(function (g) { return g.feat; }).slice(0, 10); } },
    { title: 'In zehn Minuten durch', icon: 'spark', pick: function (l) { return mix(l.filter(function (g) { return g.dur <= 10; })); } },
    { title: 'Für größere Runden', icon: 'users', pick: function (l) { return mix(l.filter(function (g) { return g.min >= 4; })); } },
    { title: 'Zum Nachdenken', icon: 'brain', pick: function (l) { return mix(l.filter(function (g) { return g.moods.indexOf('clever') >= 0 || g.moods.indexOf('deep') >= 0; })); } }
  ];

  function renderHome() {
    if (!HERO_IDS.length) {
      HERO_IDS = GAMES.filter(function (g) { return g.feat; }).slice(0, 3).map(function (g) { return g.id; });
      if (!HERO_IDS.length) HERO_IDS = GAMES.slice(0, 3).map(function (g) { return g.id; });
    }
    var hero = gameById(HERO_IDS[heroIdx] || HERO_IDS[0]);

    $('#hero-art').innerHTML = markSVG(hero);
    var h2 = $('#hero-title');
    clear(h2);
    if (hero.bucket.id === 'taeuschung') {
      var parts = hero.title.split(' ');
      var last = parts.pop();
      if (parts.length) h2.appendChild(document.createTextNode(parts.join(' ') + ' '));
      h2.appendChild(make('em', null, last));
    } else {
      h2.textContent = hero.title;
    }
    $('#hero-text').textContent = hero.desc;
    $('#hero-play').onclick = function () { openGame(hero.id); };

    /* Trefferfläche 44px, tastaturbedienbar — nicht der 6px-Punkt selbst. */
    var dots = $('.dots', screenEl('home'));
    clear(dots);
    HERO_IDS.forEach(function (id, i) {
      var b = make('button', 'dot-btn');
      b.type = 'button';
      b.setAttribute('aria-label', 'Vorschlag ' + (i + 1) + ' von ' + HERO_IDS.length + ': ' + gameById(id).title);
      b.setAttribute('aria-current', String(i === heroIdx));
      b.appendChild(make('i', i === heroIdx ? 'on' : null));
      b.addEventListener('click', function () { heroIdx = i; renderHome(); });
      dots.appendChild(b);
    });

    renderResume();

    var host = $('#sections');
    clear(host);
    SECTIONS.forEach(function (def) {
      var list = def.pick(GAMES);
      /* Ein Streifen mit ein oder zwei Karten sieht kaputt aus. */
      if (list.length < 3) return;
      var sec = make('section', 'sec');
      var head = make('div', 'sec-head');
      var h3 = make('h3');
      var ico = make('span', 'sec-ico');
      ico.style.width = '20px';
      ico.style.height = '20px';
      ico.style.color = '#838A9C';
      ico.innerHTML = icon(def.icon);
      h3.appendChild(ico);
      h3.appendChild(document.createTextNode(def.title));
      var more = make('button', 'sec-more', 'Alle ansehen ›');
      more.type = 'button';
      more.addEventListener('click', function () { show('games', { reset: true }); });
      head.appendChild(h3);
      head.appendChild(more);
      var strip = make('div', 'strip scroll');
      list.forEach(function (g, i) { strip.appendChild(gameCard(g, def.rank ? i + 1 : 0)); });
      sec.appendChild(head);
      sec.appendChild(strip);
      host.appendChild(sec);
    });
  }

  var PHASE_LABEL = { secret: 'Karten', timer: 'Redezeit', vote: 'Abstimmung', result: 'Auflösung', prompt: 'Karten', tool: 'Werkzeug' };

  function renderResume() {
    var slot = $('#resume-slot');
    clear(slot);
    if (!S.match) return;
    var g = gameById(S.match.gameId);
    var row = make('div', 'resume');
    var main = make('button', 'resume-main');
    main.type = 'button';
    main.appendChild(document.createTextNode('Match fortsetzen'));
    main.appendChild(make('small', null, g.title + ' · Runde ' + S.match.round + '/' + S.match.rounds + ' · ' + (PHASE_LABEL[S.match.flow[S.match.step]] || '')));
    main.addEventListener('click', resumeMatch);
    var go = make('button', 'resume-go', 'Weiter');
    go.type = 'button';
    go.addEventListener('click', resumeMatch);
    var drop = make('button', 'resume-drop', 'Verwerfen');
    drop.type = 'button';
    drop.addEventListener('click', function () {
      S.match = null;
      save();
      renderHome();
      announce('Match verworfen.');
    });
    row.appendChild(main);
    row.appendChild(go);
    row.appendChild(drop);
    slot.appendChild(row);
  }

  function resumeMatch() {
    if (!S.match) return;
    S.gameId = S.match.gameId;
    save();
    show('play-' + S.match.flow[S.match.step], { reset: true });
  }

  /* ── ALLE SPIELE ──────────────────────────────────────────────────── */

  var filterId = 'alle';
  var query = '';

  function visibleGames() {
    var q = fold(query).trim();
    var list = GAMES.filter(function (g) {
      if (filterId !== 'alle' && g.bucket.id !== filterId) return false;
      if (!q) return true;
      return fold(g.title).indexOf(q) >= 0 || fold(g.desc).indexOf(q) >= 0;
    }).sort(function (a, b) { return deCompare(a.title, b.title); });
    return filterId === 'alle' && !q ? mix(list) : list;
  }

  function renderGames() {
    var chips = $('#filters');
    clear(chips);
    var defs = [{ id: 'alle', label: 'Alle ' + GAMES.length, tint: null }].concat(BUCKETS.map(function (b) {
      return { id: b.id, label: b.label + ' ' + GAMES.filter(function (g) { return g.bucket.id === b.id; }).length, tint: b.tint };
    }));
    defs.forEach(function (d) {
      var c = make('button', 'chip');
      c.type = 'button';
      c.setAttribute('aria-pressed', String(filterId === d.id));
      if (d.tint) {
        var dot = make('i', 'dot');
        dot.style.background = d.tint;
        c.appendChild(dot);
      }
      c.appendChild(document.createTextNode(d.label));
      c.addEventListener('click', function () { filterId = d.id; renderGames(); });
      chips.appendChild(c);
    });

    var list = visibleGames();
    var grid = $('#grid');
    clear(grid);
    list.forEach(function (g) { grid.appendChild(gameCard(g)); });
    $('#grid-empty').hidden = list.length > 0;
    $('#grid-count').textContent = list.length === GAMES.length ? String(GAMES.length) : list.length + '/' + GAMES.length;
  }

  /* ── MODUS ────────────────────────────────────────────────────────── */

  function rulesSummary(g) {
    var r = rulesUsed(g);
    var out = [];
    if (r.odds) out.push(S.odds + ' Imposter');
    if (r.minutes) out.push(S.minutes + ' min');
    if (r.rounds) out.push(S.rounds + (S.rounds === 1 ? ' Runde' : ' Runden'));
    return out.join(' · ');
  }

  var MOOD_LABEL = {
    clever: 'Clever', competitive: 'Wettkampf', funny: 'Lustig', deep: 'Tiefgang',
    wild: 'Wild', friendly: 'Freundlich', chaotic: 'Chaos', creative: 'Kreativ'
  };

  function renderMode() {
    var g = game();
    $('#mode-emblem').innerHTML = markSVG(g);
    fit($('#mode-title'), g.title, '2.2rem');
    $('#mode-sub').textContent = g.desc;

    var meta = $('#mode-meta');
    clear(meta);
    [g.min + '–' + g.max + ' Personen', g.dur + ' min', g.bucket.label]
      .concat(g.moods.slice(0, 1).map(function (m) { return MOOD_LABEL[m] || m; }))
      .forEach(function (t) { meta.appendChild(make('span', null, t)); });

    var count = S.players.length;
    var short = count < g.min;
    var pc = $('#players-count');
    pc.textContent = count + '/' + g.max;
    pc.className = 'row-val' + (short ? ' warn' : '');

    var packRow = $('[data-open="packs"]');
    packRow.disabled = !packsOf(g).length;
    $('#pack-value').textContent = packSummary(g);

    var rr = $('#rules-row');
    rr.disabled = !hasRules(g);
    $('#rules-value').textContent = hasRules(g) ? rulesSummary(g) : 'Dieser Modus braucht keine Einstellungen';

    var steps = $('#mode-steps');
    clear(steps);
    g.steps.forEach(function (t, i) {
      var li = make('li');
      li.appendChild(make('i', null, String(i + 1)));
      li.appendChild(document.createTextNode(t));
      steps.appendChild(li);
    });

    var btn = $('#start-btn');
    var note = $('#start-note');
    btn.disabled = short;
    if (short) {
      note.textContent = g.min + ' Personen nötig — ' + (g.min - count) + ' fehlen noch';
      note.className = 'dock-note warn';
      btn.textContent = 'Spiel starten';
    } else {
      note.textContent = rulesUsed(g).rounds ? S.rounds + (S.rounds === 1 ? ' Runde' : ' Runden') + ' · ' + count + ' Personen' : count + ' Personen';
      note.className = 'dock-note';
      btn.textContent = 'Spiel starten';
    }
  }

  function renderHowto() {
    var g = game();
    fit($('#howto-title'), g.title, '2rem');
    $('#howto-sub').textContent = g.desc;
    var host = $('#howto-steps');
    clear(host);
    g.steps.forEach(function (t, i) {
      var li = make('li');
      li.appendChild(make('i', null, String(i + 1)));
      li.appendChild(document.createTextNode(t));
      host.appendChild(li);
    });
  }

  /* ── SPIELER ──────────────────────────────────────────────────────── */

  function setPlayerHint(msg, warn) {
    var h = $('#player-hint');
    h.textContent = msg || '';
    h.className = 'hint-line' + (warn ? ' warn' : '');
  }

  function renderPlayers() {
    var g = game();
    $('#player-badge').textContent = S.players.length + '/' + g.max;
    var list = $('#player-list');
    clear(list);
    if (!S.players.length) {
      var p = make('p', 'empty', 'Noch niemand am Start. Namen unten eintragen.');
      list.appendChild(p);
    }
    S.players.forEach(function (nm, i) {
      var row = make('div', 'prow');
      row.appendChild(make('span', 'prow-n', String(i + 1)));
      row.appendChild(make('span', 'prow-name', nm));
      var x = make('button', 'prow-x');
      x.type = 'button';
      x.setAttribute('aria-label', nm + ' entfernen');
      x.innerHTML = icon('close');
      x.addEventListener('click', function () {
        S.players.splice(i, 1);
        clampOdds();
        save();
        renderPlayers();
        setPlayerHint(nm + ' entfernt.', false);
        announce(nm + ' entfernt. ' + S.players.length + ' Personen.');
      });
      row.appendChild(x);
      list.appendChild(row);
    });

    var full = S.players.length >= g.max;
    $('#player-add').disabled = full;
    $('#player-input').disabled = full;
    if (full) setPlayerHint('Mehr als ' + g.max + ' Personen gehen nicht.', true);
    else if (S.players.length < g.min) setPlayerHint(g.min + ' Personen nötig für ' + g.title + '.', S.players.length > 0);
    else setPlayerHint('Das Gerät wandert in dieser Reihenfolge.', false);

    /* Der Platz unter der Liste zeigt die Reihenfolge, in der das Gerät wandert. */
    var prev = $('#seat-preview');
    clear(prev);
    if (S.players.length >= 2) {
      var box = make('div', 'seat-preview');
      var ring = make('div', 'ring');
      ring.innerHTML = seatRingSVG(S.players.length, 0, g.bucket.tint);
      box.appendChild(ring);
      box.appendChild(make('p', null, S.players.join(' → ') + ' → ' + S.players[0]));
      prev.appendChild(box);
    }
  }

  function addPlayer() {
    var g = game();
    var input = $('#player-input');
    var raw = String(input.value || '').replace(/\s+/g, ' ').trim().slice(0, 32);
    if (!raw) { input.focus(); return; }
    if (S.players.length >= g.max) {
      setPlayerHint('Mehr als ' + g.max + ' Personen gehen nicht.', true);
      return;
    }
    var dupe = S.players.filter(function (n) { return fold(n) === fold(raw); })[0];
    if (dupe) {
      input.value = '';
      input.focus();
      setPlayerHint(dupe + ' steht schon in der Liste.', true);
      announce(dupe + ' steht schon in der Liste.');
      return;
    }
    S.players.push(raw);
    clampOdds();
    save();
    input.value = '';
    renderPlayers();
    input.focus();
    setPlayerHint(raw + ' dabei. Nächsten Namen tippen.', false);
    announce(raw + ' hinzugefügt. ' + S.players.length + ' Personen.');
  }

  function maxOdds() { return Math.max(1, Math.min(6, S.players.length - 1)); }
  function clampOdds() { S.odds = Math.max(1, Math.min(S.odds, maxOdds())); }

  /* ── KATEGORIE ────────────────────────────────────────────────────── */

  function setSel(g, keys) {
    S.packSel[g.id] = keys;
    /* Auswahl ändert den Stapel — laufendes Match neu mischen. */
    if (S.match && S.match.gameId === g.id) S.match.decks = {};
    save();
    renderPacks();
    announce(keys.length + ' Kategorien, ' + termCount(g) + ' Karten.');
  }

  function togglePack(g, key) {
    var all = packsOf(g).map(function (p) { return p.key; });
    var sel = selectedPacks(g).map(function (p) { return p.key; });
    var i = sel.indexOf(key);
    if (i >= 0) {
      if (sel.length === 1) { announce('Mindestens eine Kategorie muss aktiv bleiben.'); return; }
      sel.splice(i, 1);
    } else {
      sel.push(key);
    }
    setSel(g, all.filter(function (k) { return sel.indexOf(k) >= 0; }));
  }

  function renderPacks() {
    var g = game();
    var all = packsOf(g);
    var selKeys = selectedPacks(g).map(function (p) { return p.key; });
    var sum = $('#pack-sum');
    var host = $('#pack-list');
    var note = $('#pack-note');
    var unit = g.id === 'imposter' ? 'Begriffe' : 'Karten';
    clear(sum);
    clear(host);

    if (!all.length) {
      sum.hidden = true;
      host.hidden = true;
      note.textContent = 'Dieser Modus bringt keine Kategorien mit. Er läuft ohne Kartenauswahl.';
      $('#pack-done').textContent = 'Zurück';
      return;
    }
    sum.hidden = false;
    host.hidden = false;
    $('#pack-done').textContent = 'Fertig';

    var box = make('div', 'pack-sum');
    var main = make('div', 'pack-sum-main');
    main.appendChild(make('b', null, selKeys.length + ' von ' + all.length +
      (all.length === 1 ? ' Kategorie' : ' Kategorien')));
    main.appendChild(make('small', null, termCount(g) + ' ' + unit + ' im Stapel'));
    box.appendChild(main);
    if (all.length > 1) {
      var act = make('div', 'pack-sum-act');
      var bAll = make('button', 'mini', 'Alle');
      bAll.type = 'button';
      bAll.disabled = selKeys.length === all.length;
      bAll.addEventListener('click', function () {
        setSel(g, all.map(function (p) { return p.key; }));
      });
      act.appendChild(bAll);
      box.appendChild(act);
    }
    sum.appendChild(box);

    all.forEach(function (p) {
      var on = selKeys.indexOf(p.key) >= 0;
      var b = make('button', 'row pack-row');
      b.type = 'button';
      b.setAttribute('aria-pressed', String(on));
      var tick = make('span', 'tick');
      tick.innerHTML = icon('check', 2.6);
      b.appendChild(tick);
      var label = make('span', 'row-main', p.name);
      if (p.own) label.appendChild(make('small', null, 'Eigene Kategorie'));
      b.appendChild(label);
      b.appendChild(make('span', 'pack-count', String(p.count)));
      b.addEventListener('click', function () { togglePack(g, p.key); });
      host.appendChild(b);
    });

    note.textContent = all.length === 1
      ? 'Dieser Modus hat nur eine Kategorie. Sie ist gewählt.'
      : 'Mindestens eine Kategorie bleibt aktiv. Gezogen wird gemischt aus allen aktiven.';
  }

  /* ── REGELN ───────────────────────────────────────────────────────── */

  function segmentRow(values, current, onPick, fmt) {
    var wrap = make('div', 'segments');
    values.forEach(function (v) {
      var b = make('button', 'segment', fmt ? fmt(v) : String(v));
      b.type = 'button';
      b.setAttribute('aria-pressed', String(v === current));
      b.addEventListener('click', function () { onPick(v); });
      wrap.appendChild(b);
    });
    return wrap;
  }

  function renderRules() {
    var g = game();
    var used = rulesUsed(g);
    var host = $('#rules-body');
    clear(host);

    if (used.odds) {
      clampOdds();
      var fs = make('fieldset', 'card-set');
      fs.appendChild(make('legend', null, 'Wie viele kennen den Begriff nicht?'));
      var st = make('div', 'stepper');
      var dn = make('button', 'step-btn');
      dn.type = 'button';
      dn.setAttribute('aria-label', 'Weniger');
      dn.innerHTML = icon('minus');
      dn.disabled = S.odds <= 1;
      dn.addEventListener('click', function () { S.odds = Math.max(1, S.odds - 1); save(); renderRules(); });
      var out = make('output', null, String(S.odds));
      var up = make('button', 'step-btn');
      up.type = 'button';
      up.setAttribute('aria-label', 'Mehr');
      up.innerHTML = icon('plus');
      up.disabled = S.odds >= maxOdds();
      up.addEventListener('click', function () { S.odds = Math.min(maxOdds(), S.odds + 1); save(); renderRules(); });
      st.appendChild(dn); st.appendChild(out); st.appendChild(up);
      fs.appendChild(st);
      fs.appendChild(make('p', null, S.players.length
        ? 'Bei ' + S.players.length + ' Personen sind 1 bis ' + maxOdds() + ' möglich.'
        : 'Trag zuerst die Personen ein.'));
      host.appendChild(fs);
    }

    if (used.minutes) {
      var fm = make('fieldset', 'card-set');
      fm.appendChild(make('legend', null, 'Redezeit pro Runde'));
      fm.appendChild(segmentRow([1, 2, 3, 5, 10], S.minutes, function (v) { S.minutes = v; save(); renderRules(); }));
      fm.appendChild(make('p', null, 'Minuten'));
      host.appendChild(fm);
    }

    if (used.rounds) {
      var fr = make('fieldset', 'card-set');
      fr.appendChild(make('legend', null, 'Runden im Match'));
      fr.appendChild(segmentRow([1, 3, 5, 10], S.rounds, function (v) { S.rounds = v; save(); renderRules(); }));
      fr.appendChild(make('p', null, 'Nach der letzten Runde steht der Sieger fest.'));
      host.appendChild(fr);
    }

    if (g.id === 'imposter') {
      var sw = make('button', 'switch-row');
      sw.type = 'button';
      sw.setAttribute('role', 'switch');
      sw.setAttribute('aria-checked', String(!!S.hint));
      var main = make('span', 'row-main', 'Hilfswort');
      main.appendChild(make('small', null, 'Wer den Begriff nicht kennt, bekommt einen vagen Themenhinweis.'));
      var track = make('span', 'switch-track');
      track.appendChild(make('i'));
      sw.appendChild(main);
      sw.appendChild(track);
      sw.addEventListener('click', function () { S.hint = !S.hint; save(); renderRules(); });
      host.appendChild(sw);
    }

    if (!host.childNodes.length) {
      host.appendChild(make('p', 'lede-dim', 'Dieser Modus braucht keine Einstellungen.'));
    }
  }

  /* ── Match ────────────────────────────────────────────────────────── */

  function startMatch(keepScores) {
    var g = game();
    if (S.players.length < g.min) return;
    var m = {
      gameId: g.id,
      flow: flowFor(g),
      step: 0,
      round: 1,
      rounds: rulesUsed(g).rounds ? S.rounds : 1,
      players: names(),
      seat: 0,
      voter: 0,
      votes: {},
      imposters: [],
      word: '',
      hint: '',
      seen: false,
      flipped: false,
      scores: {},
      gains: {},
      log: [],
      scored: 0,
      endAt: null,
      decks: {},
      remaining: S.minutes * 60,
      running: false,
      tdChoice: null,
      promptTurn: 0,
      toolMode: null,
      toolOut: ''
    };
    m.players.forEach(function (p) { m.scores[p] = keepScores && S.match && S.match.scores[p] ? S.match.scores[p] : 0; });
    S.match = m;
    beginRound(1);
  }

  function beginRound(n) {
    var m = S.match;
    if (!m) return;
    var g = gameById(m.gameId);
    var card = drawCard(g, m);
    var k = Math.min(S.odds, Math.max(1, m.players.length - 1));
    m.round = n;
    m.step = 0;
    m.seat = 0;
    m.voter = 0;
    m.votes = {};
    m.seen = false;
    m.flipped = false;
    m.gains = {};
    m.word = card.word;
    m.hint = card.hint;
    m.alt = card.alt || '';
    m.list = card.list || [];
    m.promptText = '';
    m.promptList = [];
    m.imposters = shuffle(m.players.slice()).slice(0, k);
    m.remaining = S.minutes * 60;
    m.endAt = null;
    m.running = false;
    m.tdChoice = null;
    save();
    show('play-' + m.flow[0], { reset: true });
  }

  function nextStep() {
    var m = S.match;
    if (!m) return;
    if (m.step + 1 < m.flow.length) {
      m.step += 1;
      m.seat = 0;
      m.voter = 0;
      m.seen = false;
      m.flipped = false;
      save();
      show('play-' + m.flow[m.step], { reset: true });
    } else {
      finishRound();
    }
  }

  function finishRound() {
    var m = S.match;
    if (m.round < m.rounds) beginRound(m.round + 1);
    else endMatch();
  }

  function endMatch() {
    var m = S.match;
    var board = boardOf(m);
    var top = board.length ? board[0].score : 0;
    var winners = board.filter(function (b) { return b.score === top; }).map(function (b) { return b.name; });
    S.history.unshift({
      gameId: m.gameId,
      at: Date.now(),
      rounds: m.rounds,
      winner: winners.join(', '),
      players: m.players.length
    });
    S.history = S.history.slice(0, 30);
    m.winners = winners;
    m.done = true;
    save();
    show('play-winner', { reset: true });
  }

  function boardOf(m) {
    return m.players.map(function (p) { return { name: p, score: m.scores[p] || 0, gain: m.gains[p] || 0 }; })
      .sort(function (a, b) { return b.score - a.score || deCompare(a.name, b.name); });
  }

  function quitMatch() {
    if (!S.match || S.match.done) {
      S.match = null;
      save();
      show('mode', { reset: true });
      return;
    }
    openSheet('Match abbrechen?', 'Runde ' + S.match.round + ' von ' + S.match.rounds + ' läuft. Punkte gehen verloren.', 'Ja, abbrechen', function () {
      S.match = null;
      save();
      stopClock();
      show('mode', { reset: true });
    });
  }

  function openSheet(title, text, yes, onYes) {
    $('#sheet-title').textContent = title;
    $('#sheet-text').textContent = text;
    var y = $('#sheet-yes');
    y.textContent = yes;
    y.onclick = function () { closeSheet(); onYes(); };
    $('#sheet').hidden = false;
    y.focus();
  }
  function closeSheet() { $('#sheet').hidden = true; }

  /* ── SPIEL: geheime Karte ─────────────────────────────────────────── */

  var wipeTimer = null;

  function renderSecret() {
    var m = S.match;
    if (!m) { show('home', { reset: true }); return; }
    var g = gameById(m.gameId);
    var person = m.players[m.seat] || m.players[0];
    var isOdd = m.imposters.indexOf(person) >= 0;

    $('#secret-progress').textContent = 'Runde ' + m.round + '/' + m.rounds + ' · Karte ' + (m.seat + 1) + '/' + m.players.length;
    $('#secret-ring').innerHTML = seatRingSVG(m.players.length, m.seat, g.bucket.tint);
    fit($('#secret-name'), person, '3.4rem');
    $('#secret-note').textContent = m.flipped ? 'Gemerkt? Karte zuklappen und weitergeben.' : 'Nur diese Person darf jetzt schauen.';
    $('#flip-emblem').innerHTML = markSVG(g);

    /* Zwei Kartenfassungen: dann darf nichts die Rolle verraten — kein Rot. */
    var twoSided = !!m.alt;
    var card = $('#flipcard');
    card.setAttribute('aria-expanded', String(!!m.flipped));
    var front = $('#flipface');
    front.dataset.odd = isOdd && !twoSided ? '1' : '0';

    if (wipeTimer) { clearTimeout(wipeTimer); wipeTimer = null; }
    if (m.flipped && twoSided) {
      $('#secret-role').textContent = 'Deine Karte';
      fit($('#secret-word'), isOdd ? m.alt : m.word, '2.9rem');
      $('#secret-tip').textContent = 'Nicht laut vorlesen. Nicht alle haben dasselbe.';
    } else if (m.flipped) {
      $('#secret-role').textContent = isOdd ? 'Du kennst den Begriff nicht' : 'Dein geheimer Begriff';
      fit($('#secret-word'), isOdd ? (S.hint && m.hint ? m.hint : 'Kein Hilfswort') : m.word, '2.9rem');
      $('#secret-tip').textContent = isOdd
        ? 'Höre gut zu, improvisiere und bleibe unauffällig.'
        : 'Beschreibe ihn, ohne ihn direkt zu nennen.';
    } else {
      /* Inhalt erst nach der Klappbewegung entfernen, sonst liest der Screenreader mit. */
      wipeTimer = setTimeout(function () {
        $('#secret-role').textContent = '';
        fit($('#secret-word'), '', '2.9rem');
        $('#secret-tip').textContent = '';
      }, 500);
    }

    var next = $('#secret-next');
    next.disabled = !m.seen;
    next.textContent = m.seat + 1 >= m.players.length ? 'Alle haben geschaut' : 'Karte zu, weitergeben';
  }

  /* ── SPIEL: offene Karte ──────────────────────────────────────────── */

  function renderPrompt() {
    var m = S.match;
    if (!m) { show('home', { reset: true }); return; }
    var g = gameById(m.gameId);
    var person = m.players[m.promptTurn % m.players.length] || m.players[0];

    $('#prompt-progress').textContent = g.title + ' · ' + packSummary(g);
    $('#prompt-turn').textContent = person + ' ist dran';

    var choiceHost = $('#prompt-choice');
    var cardHost = $('#prompt-text');
    var next = $('#prompt-next');
    clear(choiceHost);
    clear(cardHost);

    /* Wahrheit oder Pflicht: echte Auswahl, danach eine Karte aus dem
       jeweiligen Stapel der gewählten Kategorien. */
    if (tdShape(g)) {
      if (!m.tdChoice) {
        choiceHost.hidden = false;
        cardHost.hidden = true;
        [['truth', 'Wahrheit'], ['dare', 'Pflicht']].forEach(function (pair) {
          var size = tdPool(g, pair[0]).length;
          var b = make('button', 'choice');
          b.type = 'button';
          b.appendChild(document.createTextNode(pair[1]));
          b.appendChild(make('small', null, size + ' Karten'));
          b.disabled = !size;
          b.addEventListener('click', function () {
            var it = deal(m, g, pair[0]);
            m.tdChoice = pair[1];
            m.promptText = it == null ? 'Keine Karte in dieser Auswahl.' : cardOf(it, '').word;
            m.promptList = [];
            save();
            renderPrompt();
          });
          choiceHost.appendChild(b);
        });
        next.disabled = true;
        next.textContent = 'Weitergeben';
        return;
      }
      choiceHost.hidden = true;
      cardHost.hidden = false;
      cardHost.appendChild(make('span', 'kick', m.tdChoice));
      cardHost.appendChild(document.createTextNode(m.promptText || ''));
      next.disabled = false;
      next.textContent = 'Weitergeben';
      return;
    }

    choiceHost.hidden = true;
    cardHost.hidden = false;
    if (!m.promptText) {
      var item = deal(m, g, 'main');
      var c = cardOf(item, '');
      m.promptText = item == null ? 'Diese Auswahl bringt keine Karten mit.' : c.word;
      m.promptList = c.list || [];
    }
    cardHost.appendChild(document.createTextNode(m.promptText || ''));
    if (m.promptList && m.promptList.length) {
      var opts = make('span', 'prompt-list');
      m.promptList.forEach(function (o) { opts.appendChild(make('span', null, o)); });
      cardHost.appendChild(opts);
    }
    next.disabled = false;
    next.textContent = 'Nächste Frage';
  }

  function promptNext() {
    var m = S.match;
    m.promptTurn += 1;
    m.tdChoice = null;
    m.promptText = '';
    m.promptList = [];
    save();
    renderPrompt();
  }

  /* ── SPIEL: Werkzeug ──────────────────────────────────────────────── */

  var TOOLS = {
    'spin-bottle': [{ id: 'person', label: 'Person' }],
    'dice-coin': [
      { id: 'coin', label: 'Münze' },
      { id: 'd6', label: 'W6' },
      { id: 'd20', label: 'W20' },
      { id: 'rnd', label: 'Zahl 1–100' }
    ]
  };

  function renderTool() {
    var m = S.match;
    if (!m) { show('home', { reset: true }); return; }
    var g = gameById(m.gameId);
    var opts = TOOLS[g.id] || TOOLS['dice-coin'];
    if (!m.toolMode) m.toolMode = opts[0].id;

    $('#tool-label').textContent = g.title;
    var host = $('#tool-picker');
    clear(host);
    host.hidden = opts.length < 2;
    opts.forEach(function (o) {
      var c = make('button', 'chip', o.label);
      c.type = 'button';
      c.setAttribute('aria-pressed', String(m.toolMode === o.id));
      c.addEventListener('click', function () { m.toolMode = o.id; m.toolOut = ''; save(); renderTool(); });
      host.appendChild(c);
    });

    fit($('#tool-out'), m.toolOut || '—', '4rem');
    $('#tool-go').textContent = g.id === 'spin-bottle' ? 'Drehen' : 'Auslösen';
  }

  function toolRun() {
    var m = S.match;
    var mode = m.toolMode;
    if (mode === 'person') m.toolOut = m.players.length ? pickOne(m.players) : '—';
    else if (mode === 'coin') m.toolOut = Math.random() < 0.5 ? 'Kopf' : 'Zahl';
    else if (mode === 'd6') m.toolOut = String(1 + Math.floor(Math.random() * 6));
    else if (mode === 'd20') m.toolOut = String(1 + Math.floor(Math.random() * 20));
    else m.toolOut = String(1 + Math.floor(Math.random() * 100));
    save();
    renderTool();
    announce(m.toolOut);
  }

  /* ── SPIEL: Timer ─────────────────────────────────────────────────── */

  var clockTick = null;

  function stopClock() {
    if (clockTick) { clearInterval(clockTick); clockTick = null; }
  }
  function remainingSec() {
    var m = S.match;
    if (!m) return 0;
    if (m.running && m.endAt) return Math.max(0, Math.round((m.endAt - Date.now()) / 1000));
    return Math.max(0, m.remaining);
  }
  function paintClock() {
    var m = S.match;
    if (!m) return;
    var sec = remainingSec();
    var total = Math.max(1, S.minutes * 60);
    var frac = Math.max(0, Math.min(1, sec / total));
    var low = sec <= 30;
    var C = 2 * Math.PI * 92;
    var fill = $('#clock-fill');
    fill.style.strokeDasharray = C.toFixed(1);
    fill.style.strokeDashoffset = (C * (1 - frac)).toFixed(1);
    $('#clock').classList.toggle('low', low);
    var mm = Math.floor(sec / 60), ss = sec % 60;
    $('#clock-time').textContent = (mm < 10 ? '0' : '') + mm + ':' + (ss < 10 ? '0' : '') + ss;
    if (sec === 0 && m.running) {
      m.running = false;
      m.remaining = 0;
      stopClock();
      save();
      if (navigator.vibrate) { try { navigator.vibrate([120, 80, 120]); } catch (e) { /* nicht unterstützt */ } }
      announce('Zeit ist um.');
      $('#timer-toggle').textContent = 'Zeit ist um';
      $('#timer-toggle').disabled = true;
    }
  }

  function renderTimer() {
    var m = S.match;
    if (!m) { show('home', { reset: true }); return; }
    var g = gameById(m.gameId);
    $('#timer-label').textContent = 'Runde ' + m.round + '/' + m.rounds + ' · Redezeit';
    $('#clock-meta').textContent = g.title;

    var steps = $('#timer-steps');
    clear(steps);
    g.steps.slice(0, 3).forEach(function (t, i) {
      var li = make('li');
      li.appendChild(make('i', null, String(i + 1)));
      li.appendChild(document.createTextNode(t));
      steps.appendChild(li);
    });

    var tog = $('#timer-toggle');
    var sec = remainingSec();
    tog.disabled = sec === 0;
    tog.textContent = sec === 0 ? 'Zeit ist um' : m.running ? 'Pause' : m.remaining < S.minutes * 60 ? 'Weiter' : 'Zeit starten';
    $('#timer-next').textContent = m.flow[m.step + 1] ? 'Weiter zur Abstimmung' : 'Runde auswerten';
    if (m.flow[m.step + 1] === 'result') $('#timer-next').textContent = 'Runde auswerten';

    paintClock();
    stopClock();
    if (m.running) clockTick = setInterval(paintClock, 250);
  }

  function toggleClock() {
    var m = S.match;
    if (m.running) {
      m.remaining = remainingSec();
      m.running = false;
      m.endAt = null;
    } else {
      m.running = true;
      m.endAt = Date.now() + Math.max(1, m.remaining) * 1000;
    }
    save();
    renderTimer();
  }

  /* ── SPIEL: Abstimmung ────────────────────────────────────────────── */

  function renderVote() {
    var m = S.match;
    if (!m) { show('home', { reset: true }); return; }
    var g = gameById(m.gameId);
    var person = m.players[m.voter] || m.players[0];
    var sealed = Object.prototype.hasOwnProperty.call(m.votes, person);

    $('#vote-progress').textContent = 'Stimme ' + Math.min(m.voter + 1, m.players.length) + '/' + m.players.length;
    $('#vote-ring').innerHTML = seatRingSVG(m.players.length, m.voter, g.bucket.tint);
    fit($('#vote-name'), person, '3.4rem');
    $('#vote-note').textContent = sealed ? 'Niemand sieht deine Wahl. Gerät weitergeben.' : 'Wer kennt den Begriff nicht?';

    var host = $('#vote-targets');
    clear(host);
    host.hidden = sealed;
    $('#vote-sealed').hidden = !sealed;

    m.players.forEach(function (t) {
      if (t === person) return; /* Niemand stimmt für sich selbst. */
      var b = make('button', 'vote-btn');
      b.type = 'button';
      var wrap = make('span', 'fit');
      var txt = make('span', 'fit-text');
      fit(txt, t, '1.35rem');
      wrap.appendChild(txt);
      b.appendChild(wrap);
      b.addEventListener('click', function () {
        m.votes[person] = t;
        save();
        renderVote();
        announce('Stimme versiegelt.');
      });
      host.appendChild(b);
    });

    var next = $('#vote-next');
    next.disabled = !sealed;
    next.textContent = m.voter + 1 >= m.players.length ? 'Auflösen' : 'Weitergeben';

    /* Stimmstand: wer schon versiegelt hat — ohne zu zeigen, für wen. */
    var tally = $('#vote-tally');
    clear(tally);
    var done = Object.keys(m.votes).length;
    tally.appendChild(make('p', 'tally-label', done + ' von ' + m.players.length + ' Stimmen versiegelt'));
    m.players.forEach(function (p, i) {
      var has = Object.prototype.hasOwnProperty.call(m.votes, p);
      var chip = make('span', has ? 'done' : i === m.voter ? 'now' : null);
      chip.appendChild(make('i'));
      chip.appendChild(document.createTextNode(p));
      tally.appendChild(chip);
    });
  }

  /* ── SPIEL: Ergebnis ──────────────────────────────────────────────── */

  function scoreRound() {
    var m = S.match;
    if (m.scored === m.round) return;
    var tally = {};
    m.players.forEach(function (p) {
      var v = m.votes[p];
      if (v) tally[v] = (tally[v] || 0) + 1;
    });
    var best = 0, top = [];
    Object.keys(tally).forEach(function (k) {
      if (tally[k] > best) { best = tally[k]; top = [k]; }
      else if (tally[k] === best) top.push(k);
    });
    var tie = top.length !== 1;
    var accused = tie ? null : top[0];
    var caught = !!accused && m.imposters.indexOf(accused) >= 0;

    m.gains = {};
    if (caught) {
      m.players.forEach(function (p) {
        if (m.imposters.indexOf(p) < 0) m.gains[p] = 1;
      });
    } else {
      m.imposters.forEach(function (p) { m.gains[p] = 2; });
    }
    Object.keys(m.gains).forEach(function (p) { m.scores[p] = (m.scores[p] || 0) + m.gains[p]; });

    m.accused = accused;
    m.tie = tie;
    m.caught = caught;
    m.log.push({
      n: m.round,
      text: caught
        ? 'Runde ' + m.round + ': ' + accused + ' wurde enttarnt.'
        : tie
          ? 'Runde ' + m.round + ': Gleichstand, niemand beschuldigt. ' + m.imposters.join(', ') + ' bleibt unentdeckt.'
          : 'Runde ' + m.round + ': ' + accused + ' war unschuldig. ' + m.imposters.join(', ') + ' bleibt unentdeckt.'
    });
    m.scored = m.round;
    save();
  }

  function renderResult() {
    var m = S.match;
    if (!m) { show('home', { reset: true }); return; }
    var g = gameById(m.gameId);
    if (m.flow.indexOf('vote') >= 0) scoreRound();

    $('#result-round').textContent = 'Runde ' + m.round + '/' + m.rounds;
    $('#result-chip').textContent = g.bucket.label;
    fit($('#result-word'), m.word, '3rem');

    var v = $('#result-verdict');
    clear(v);
    var impText = m.imposters.length === 1
      ? m.imposters[0] + ' kannte den Begriff nicht.'
      : m.imposters.join(' und ') + ' kannten den Begriff nicht.';
    var kickText = 'Aufgelöst';
    var bodyText = impText;
    var miss = false;
    if (m.flow.indexOf('vote') >= 0) {
      if (m.caught) {
        kickText = 'Enttarnt';
        bodyText = m.accused + ' wurde gewählt — richtig. ' + impText;
      } else if (m.tie) {
        kickText = 'Gleichstand';
        bodyText = 'Niemand wurde beschuldigt. ' + impText;
        miss = true;
      } else {
        kickText = 'Daneben';
        bodyText = m.accused + ' wurde gewählt — unschuldig. ' + impText;
        miss = true;
      }
    }
    v.className = 'verdict' + (miss ? ' miss' : '');
    var kick = make('span', 'kick');
    kick.appendChild(make('i'));
    kick.appendChild(document.createTextNode(kickText));
    v.appendChild(kick);
    v.appendChild(document.createTextNode(bodyText));

    var deltas = Object.keys(m.gains).length;
    $('#round-delta').textContent = !deltas ? 'Keine Punkte'
      : deltas === 1 ? '1 Person punktet' : deltas + ' Personen punkten';

    var board = boardOf(m);
    var host = $('#result-board');
    clear(host);
    board.forEach(function (b, i) {
      var row = make('div', 'brow' + (i === 0 && b.score > 0 ? ' lead' : ''));
      row.appendChild(make('span', 'brow-n', String(i + 1)));
      var nm = make('span', 'brow-name', b.name);
      if (m.imposters.indexOf(b.name) >= 0) {
        var s = make('small', 'imp', 'kannte den Begriff nicht');
        nm.appendChild(s);
      }
      row.appendChild(nm);
      if (b.gain) row.appendChild(make('span', 'brow-gain', '+' + b.gain));
      row.appendChild(make('span', 'brow-score', String(b.score)));
      host.appendChild(row);
    });

    $('#result-next').textContent = m.round < m.rounds ? 'Nächste Runde' : 'Match auswerten';

    /* Der Platz unter dem Punktestand trägt den Verlauf der früheren Runden. */
    var log = $('#result-log');
    clear(log);
    var past = m.log.filter(function (e) { return e.n < m.round; }).reverse();
    past.forEach(function (e) {
      var d = make('div');
      d.appendChild(make('i', null, String(e.n)));
      d.appendChild(make('span', null, e.text));
      log.appendChild(d);
    });
    log.hidden = !past.length;
    $('#result-log-head').hidden = !past.length;
  }

  /* ── SPIEL: Match-Ende ────────────────────────────────────────────── */

  function renderWinner() {
    var m = S.match;
    if (!m) { show('home', { reset: true }); return; }
    var g = gameById(m.gameId);
    var board = boardOf(m);
    var winners = m.winners || [];

    $('#winner-head').textContent = g.title;
    $('#winner-mark').innerHTML = markSVG(g);
    $('#winner-kick').textContent = winners.length > 1 ? 'Gleichstand an der Spitze' : 'Gewinnt das Match';
    fit($('#winner-name'), winners.join(' & ') || '—', '3.6rem');
    $('#winner-sub').textContent = (board[0] ? board[0].score : 0) + ' Punkte aus ' + m.rounds +
      (m.rounds === 1 ? ' Runde' : ' Runden') + ' · ' + g.title;

    var host = $('#winner-board');
    clear(host);
    board.forEach(function (b, i) {
      var row = make('div', 'brow' + (winners.indexOf(b.name) >= 0 ? ' lead' : ''));
      row.appendChild(make('span', 'brow-n', String(i + 1)));
      row.appendChild(make('span', 'brow-name', b.name));
      row.appendChild(make('span', 'brow-score', String(b.score)));
      host.appendChild(row);
    });

    var log = $('#winner-log');
    clear(log);
    m.log.forEach(function (e) {
      var d = make('div');
      d.appendChild(make('i', null, String(e.n)));
      d.appendChild(make('span', null, e.text));
      log.appendChild(d);
    });
  }

  /* ── PROFIL ───────────────────────────────────────────────────────── */

  function renderProfile() {
    $('#profile-avatar').innerHTML = avatarSVG(S.avatar);
    $('#profile-name').textContent = S.profileName;
    var days = Math.floor((Date.now() - (S.firstSeen || Date.now())) / 86400000);
    $('#profile-since').textContent = days < 1 ? 'Seit heute dabei' : days < 30 ? 'Seit ' + days + ' Tagen dabei' : 'Seit ' + Math.floor(days / 30) + ' Monaten dabei';

    var rounds = S.history.reduce(function (n, h) { return n + (h.rounds || 0); }, 0);
    var wins = S.history.filter(function (h) { return fold(h.winner).indexOf(fold(S.profileName)) >= 0; }).length;
    var tried = Object.keys(S.history.reduce(function (o, h) { o[h.gameId] = 1; return o; }, {})).length;

    var stats = $('#profile-stats');
    clear(stats);
    [[rounds, 'Runden gespielt'], [wins, 'Siege'], [tried, 'Spiele probiert']].forEach(function (p) {
      var d = make('div', 'stat');
      d.appendChild(make('b', null, String(p[0])));
      d.appendChild(make('span', null, p[1]));
      stats.appendChild(d);
    });

    var recent = $('#profile-recent');
    clear(recent);
    var seen = {};
    var list = S.history.filter(function (h) {
      if (seen[h.gameId]) return false;
      seen[h.gameId] = 1;
      return true;
    }).slice(0, 8);
    list.forEach(function (h) { recent.appendChild(gameCard(gameById(h.gameId))); });
    recent.hidden = !list.length;
    $('#recent-empty').hidden = list.length > 0;

    $('#settings-name').textContent = S.profileName;
    var packCount = S.ownPacks.length;
    $('#settings-packs').textContent = packCount ? packCount + (packCount === 1 ? ' Paket' : ' Pakete') : 'Keine';
  }

  function renderProfileName() {
    $('#name-avatar').innerHTML = avatarSVG(S.avatar);
    var input = $('#name-input');
    input.value = S.profileName;
    var grid = $('#avatar-grid');
    clear(grid);
    AVATARS.forEach(function (_, i) {
      var b = make('button', 'avatar-opt');
      b.type = 'button';
      b.setAttribute('aria-pressed', String(S.avatar === i));
      b.setAttribute('aria-label', 'Zeichen ' + (i + 1));
      var mk = make('span', 'mark');
      mk.innerHTML = avatarSVG(i);
      b.appendChild(mk);
      b.addEventListener('click', function () {
        S.avatar = i;
        save();
        renderProfileName();
      });
      grid.appendChild(b);
    });
  }

  var openPackId = null;

  function renderOwnPacks() {
    var host = $('#ownpack-list');
    clear(host);
    S.ownPacks.forEach(function (p) {
      var row = make('div', 'prow');
      var ico = make('span', 'row-ico');
      ico.innerHTML = icon('folder');
      row.appendChild(ico);
      var main = make('button', 'row-main');
      main.type = 'button';
      main.style.textAlign = 'left';
      main.style.minHeight = '44px';
      main.appendChild(document.createTextNode(p.name));
      main.appendChild(make('small', null, p.terms.length + (p.terms.length === 1 ? ' Begriff' : ' Begriffe')));
      main.addEventListener('click', function () {
        openPackId = p.id;
        show('profile-pack');
      });
      row.appendChild(main);
      var x = make('button', 'prow-x');
      x.type = 'button';
      x.setAttribute('aria-label', p.name + ' löschen');
      x.innerHTML = icon('trash');
      x.addEventListener('click', function () {
        S.ownPacks = S.ownPacks.filter(function (q) { return q.id !== p.id; });
        if (S.packs.imposter === 'own:' + p.id) delete S.packs.imposter;
        save();
        renderOwnPacks();
        announce(p.name + ' gelöscht.');
      });
      row.appendChild(x);
      host.appendChild(row);
    });
    host.hidden = !S.ownPacks.length;
    $('#ownpack-empty').hidden = S.ownPacks.length > 0;
  }

  function currentOwnPack() {
    return S.ownPacks.filter(function (p) { return p.id === openPackId; })[0];
  }

  function renderOwnPack() {
    var p = currentOwnPack();
    if (!p) { back(); return; }
    $('#ownpack-title').textContent = p.name;
    var host = $('#term-list');
    clear(host);
    p.terms.forEach(function (t, i) {
      var row = make('div', 'prow');
      row.appendChild(make('span', 'prow-n', String(i + 1)));
      var main = make('span', 'row-main', t.word);
      main.appendChild(make('small', null, t.hint || 'ohne Hilfswort'));
      row.appendChild(main);
      var x = make('button', 'prow-x');
      x.type = 'button';
      x.setAttribute('aria-label', t.word + ' entfernen');
      x.innerHTML = icon('close');
      x.addEventListener('click', function () {
        p.terms.splice(i, 1);
        save();
        renderOwnPack();
      });
      row.appendChild(x);
      host.appendChild(row);
    });
    host.hidden = !p.terms.length;
    $('#term-empty').hidden = p.terms.length > 0;
  }

  function renderData() {
    var host = $('#data-rows');
    clear(host);
    var terms = S.ownPacks.reduce(function (n, p) { return n + p.terms.length; }, 0);
    [
      ['users', 'Personen in der Liste', S.players.length + ''],
      ['folder', 'Eigene Kategorien', S.ownPacks.length + ' · ' + terms + ' Begriffe'],
      ['dice', 'Gespielte Abende', S.history.length + '']
    ].forEach(function (d) {
      var row = make('div', 'row');
      var ico = make('span', 'row-ico');
      ico.innerHTML = icon(d[0]);
      row.appendChild(ico);
      row.appendChild(make('span', 'row-main', d[1]));
      row.appendChild(make('span', 'row-val', d[2]));
      host.appendChild(row);
    });
    var w = $('#wipe-btn');
    w.textContent = 'Alle Daten löschen';
    w.dataset.armed = '';
  }

  function exportData() {
    var payload = {
      app: 'Secret Circle',
      exportedAt: new Date().toISOString(),
      profile: { name: S.profileName, avatar: S.avatar, since: S.firstSeen },
      players: S.players,
      ownPacks: S.ownPacks,
      history: S.history,
      settings: { odds: S.odds, minutes: S.minutes, rounds: S.rounds, hint: S.hint, packs: S.packs }
    };
    var blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'secret-circle-sicherung.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
    var b = $('#export-btn');
    var old = b.textContent;
    b.textContent = 'Datei erstellt';
    setTimeout(function () { b.textContent = old; }, 2000);
    announce('Sicherung erstellt.');
  }

  /* ── Zeichnen je Bildschirm ───────────────────────────────────────── */

  var RENDER = {
    home: renderHome,
    games: renderGames,
    mode: renderMode,
    howto: renderHowto,
    players: renderPlayers,
    packs: renderPacks,
    rules: renderRules,
    'play-secret': renderSecret,
    'play-prompt': renderPrompt,
    'play-tool': renderTool,
    'play-timer': renderTimer,
    'play-vote': renderVote,
    'play-result': renderResult,
    'play-winner': renderWinner,
    profile: renderProfile,
    'profile-name': renderProfileName,
    'profile-packs': renderOwnPacks,
    'profile-pack': renderOwnPack,
    'profile-data': renderData
  };
  function render(name) {
    if (name !== 'play-timer') stopClock();
    var fn = RENDER[name];
    if (fn) fn();
  }

  /* ── Verdrahtung ──────────────────────────────────────────────────── */

  function wire() {
    paintIcons();
    renderTabs();

    $$('[data-tab]').forEach(function (b) {
      b.addEventListener('click', function () { show(b.dataset.tab, { reset: true }); });
    });
    $$('[data-back]').forEach(function (b) { b.addEventListener('click', back); });
    $$('[data-open]').forEach(function (b) {
      b.addEventListener('click', function () { show(b.dataset.open); });
    });
    $$('[data-quit]').forEach(function (b) { b.addEventListener('click', quitMatch); });

    $('#howto-btn').addEventListener('click', function () { show('howto'); });
    $('#start-btn').addEventListener('click', function () { startMatch(false); });
    $('#pack-done').addEventListener('click', back);

    /* Hero: drei echte Empfehlungen — per Punkt oder Wisch. */
    var heroEl = $('.hero');
    var hx = null;
    heroEl.addEventListener('touchstart', function (e) { hx = e.touches[0].clientX; }, { passive: true });
    heroEl.addEventListener('touchend', function (e) {
      if (hx == null) return;
      var dx = e.changedTouches[0].clientX - hx;
      hx = null;
      if (Math.abs(dx) < 45 || HERO_IDS.length < 2) return;
      heroIdx = (heroIdx + (dx < 0 ? 1 : HERO_IDS.length - 1)) % HERO_IDS.length;
      renderHome();
    }, { passive: true });

    $('#q').addEventListener('input', function (e) { query = e.target.value; renderGames(); });

    $('#player-form').addEventListener('submit', function (e) { e.preventDefault(); addPlayer(); });

    $('#flipcard').addEventListener('click', function () {
      var m = S.match;
      if (!m) return;
      m.flipped = !m.flipped;
      if (m.flipped) m.seen = true;
      /* Letzte Person klappt zu: ohne zweiten Tipp weiter. */
      else if (m.seen && m.seat + 1 >= m.players.length) { save(); nextStep(); return; }
      save();
      renderSecret();
    });
    $('#secret-next').addEventListener('click', function () {
      var m = S.match;
      m.flipped = false;
      if (m.seat + 1 >= m.players.length) { nextStep(); return; }
      m.seat += 1;
      m.seen = false;
      save();
      renderSecret();
    });

    $('#prompt-next').addEventListener('click', promptNext);
    $('#tool-go').addEventListener('click', toolRun);

    $('#timer-toggle').addEventListener('click', toggleClock);
    $('#timer-next').addEventListener('click', function () {
      S.match.running = false;
      S.match.endAt = null;
      stopClock();
      nextStep();
    });

    $('#vote-next').addEventListener('click', function () {
      var m = S.match;
      if (m.voter + 1 >= m.players.length) { nextStep(); return; }
      m.voter += 1;
      save();
      renderVote();
    });

    $('#result-next').addEventListener('click', function () {
      var m = S.match;
      if (m.round < m.rounds) beginRound(m.round + 1);
      else endMatch();
    });

    $('#rematch-same').addEventListener('click', function () { startMatch(false); });
    $('#rematch-new').addEventListener('click', function () {
      S.match = null;
      save();
      show('mode', { reset: true });
    });

    $('#sheet-no').addEventListener('click', closeSheet);
    $('#sheet').addEventListener('click', function (e) { if (e.target === $('#sheet')) closeSheet(); });

    $('#name-input').addEventListener('input', function (e) {
      S.profileName = String(e.target.value || '').slice(0, 24) || 'Du';
      save();
    });

    $('#ownpack-form').addEventListener('submit', function (e) {
      e.preventDefault();
      var input = $('#ownpack-input');
      var nm = String(input.value || '').replace(/\s+/g, ' ').trim().slice(0, 28);
      if (!nm) { input.focus(); return; }
      if (S.ownPacks.some(function (p) { return fold(p.name) === fold(nm); })) {
        announce(nm + ' gibt es schon.');
        input.value = '';
        return;
      }
      S.ownPacks.push({ id: String(Date.now()), name: nm, terms: [] });
      save();
      input.value = '';
      renderOwnPacks();
      input.focus();
    });

    $('#term-form').addEventListener('submit', function (e) {
      e.preventDefault();
      var p = currentOwnPack();
      if (!p) return;
      var w = $('#term-word');
      var h = $('#term-hint');
      var word = String(w.value || '').replace(/\s+/g, ' ').trim().slice(0, 32);
      if (!word) { w.focus(); return; }
      p.terms.push({ word: word, hint: String(h.value || '').trim().slice(0, 24) });
      save();
      w.value = '';
      h.value = '';
      renderOwnPack();
      w.focus();
    });

    $('#export-btn').addEventListener('click', exportData);
    $('#wipe-btn').addEventListener('click', function () {
      var b = $('#wipe-btn');
      if (b.dataset.armed !== '1') {
        b.dataset.armed = '1';
        b.textContent = 'Wirklich? Nochmal tippen';
        setTimeout(function () {
          if (b.dataset.armed === '1') { b.dataset.armed = ''; b.textContent = 'Alle Daten löschen'; }
        }, 4000);
        return;
      }
      try { localStorage.removeItem(STORE); } catch (e) { /* gesperrt */ }
      S = load();
      S.firstSeen = Date.now();
      save();
      announce('Alle Daten gelöscht.');
      show('profile', { reset: true });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !$('#sheet').hidden) closeSheet();
    });

    /* Uhr nach Rückkehr aus dem Hintergrund nachziehen. */
    document.addEventListener('visibilitychange', function () {
      if (!document.hidden && CURRENT === 'play-timer') renderTimer();
    });
  }

  wire();
  show('home', { reset: true });
})();
