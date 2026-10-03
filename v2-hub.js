/* Secret Circle — Oberfläche im Claude-Design (v2)
   Vanilla JS, kein Build. Alle Spieldaten kommen aus window.SecretCirclePartyCatalog.
   Gespielt wird in den geprüften Engines (party.html, quick-play.html,
   advanced.html, index.html); diese Seite wählt nur aus und übergibt.
   Spielerliste und Verlauf sind dieselben wie im Rest der App. */

(function () {
  'use strict';

  var CAT = window.SecretCirclePartyCatalog || { games: [], content: {} };

  /* ── Die sechs Kategorien ─────────────────────────────────────────── */

  /* Bündelt die neun Gruppen des Katalogs zu sechs Farbwelten. */
  var BUCKETS = [
    { id: 'taeuschung', label: 'Täuschung', tint: '#FF4560', ground: '#43101d', groups: ['Täuschung & Bluff'] },
    { id: 'reden', label: 'Reden & Wählen', tint: '#4DD9A0', ground: '#06402f', groups: ['Social & Klassiker', 'Abstimmen & Ranking'] },
    { id: 'raten', label: 'Raten & Zeigen', tint: '#FFB020', ground: '#462c05', groups: ['Darstellen & Erklären'] },
    { id: 'kreativ', label: 'Kreativ', tint: '#A78BFA', ground: '#2d1e52', groups: ['Kreativ & Schreiben'] },
    { id: 'wissen', label: 'Wissen & Schätzen', tint: '#38BDF8', ground: '#093548', groups: ['Wissen & Quiz', 'Schätzen & Tippen'] },
    { id: 'schnell', label: 'Schnell', tint: '#F472B6', ground: '#451234', groups: ['Schnell & Challenge', 'Werkzeuge'] }
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
    return '<svg viewBox="' + (box || '1 1 98 98') + '" width="100%" height="100%" aria-hidden="true" focusable="false" class="svg-block">' + inner + '</svg>';
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

  /* Eigene Spiele aus dem Creator tragen frei gewählte Gruppen. */
  function bucketFor(group) {
    for (var i = 0; i < BUCKETS.length; i++) if (BUCKETS[i].groups.indexOf(group) >= 0) return BUCKETS[i];
    return BUCKETS[3];
  }

  var GAMES = (CAT.games || []).filter(function (g) { return g.status === 'playable'; }).map(function (g) {
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
      linked: g.mode === 'link',
      href: g.href || '',
      bucket: bucketFor(g.group)
    };
  });

  function gameById(id) {
    for (var i = 0; i < GAMES.length; i++) if (GAMES[i].id === id) return GAMES[i];
    return null;
  }

  /* Word Imposter führt eine eigene Spielerliste; alle anderen Spiele nutzen
     die gemeinsame Gruppe des Hubs. */
  function usesHubPlayers(g) { return g.href !== 'index.html'; }

  /* ── Kategorien der Hub-Spiele ────────────────────────────────────── */

  /* Hub-Spiele laufen in party.html mit genau einer Kategorie. Verlinkte
     Spiele wählen ihre Kategorie auf ihrer eigenen Seite. */
  function packCount(g, name) {
    var v = CAT.content && CAT.content[g.id] ? CAT.content[g.id][name] : null;
    if (Array.isArray(v)) return v.length;
    if (v && typeof v === 'object') {
      return Object.keys(v).reduce(function (n, k) { return n + (Array.isArray(v[k]) ? v[k].length : 0); }, 0);
    }
    return 0;
  }

  function packsOf(g) {
    if (!g || g.linked || !CAT.getPackNames) return [];
    return (CAT.getPackNames(g.id) || [])
      .map(function (name) { return { name: name, count: packCount(g, name) }; })
      .filter(function (p) { return p.count > 0; });
  }

  var packChoice = {};
  function chosenPack(g) {
    var all = packsOf(g);
    var want = packChoice[g.id];
    for (var i = 0; i < all.length; i++) if (all[i].name === want) return all[i];
    return all[0] || null;
  }

  /* ── Gemeinsame Daten ─────────────────────────────────────────────── */

  var HUB_KEY = 'secret-circle-party-hub-v1';
  var IMPOSTER_HISTORY_KEY = 'secret-circle-history-v7';
  /* Dieselbe Beispielgruppe wie im Hub und in allen Spiel-Engines. */
  var DEFAULT_PLAYERS = ['Alex', 'Sam', 'Mika', 'Lina'];
  var MAX_PLAYERS = 20;

  function readJson(key) {
    try { return JSON.parse(localStorage.getItem(key)); } catch (e) { return null; }
  }

  function readHub() {
    var hub = readJson(HUB_KEY);
    return hub && typeof hub === 'object' && !Array.isArray(hub) && hub.version === 1 ? hub : null;
  }

  /* Dieselben Regeln wie party-hub.js: eindeutig, höchstens 32 Zeichen, höchstens 20 Personen. */
  function cleanPlayers(list) {
    var out = [];
    var seen = {};
    (Array.isArray(list) ? list : []).forEach(function (raw) {
      var name = String(raw == null ? '' : raw).normalize('NFKC').trim().replace(/\s+/g, ' ').slice(0, 32);
      var key = name.toLocaleLowerCase('de-DE');
      if (!name || seen[key] || out.length >= MAX_PLAYERS) return;
      seen[key] = true;
      out.push(name);
    });
    return out;
  }

  function players() {
    var hub = readHub();
    return hub ? cleanPlayers(hub.players) : DEFAULT_PLAYERS.slice();
  }

  function savePlayers(list) {
    var hub = readHub() || { version: 1, players: [], favorites: [], recent: [], presets: [], history: [], stats: {} };
    hub.players = cleanPlayers(list);
    try {
      localStorage.setItem(HUB_KEY, JSON.stringify(hub));
      return true;
    } catch (e) {
      setStatus('Die Spielerliste konnte nicht gespeichert werden. Prüfe den freien Speicher.');
      return false;
    }
  }

  function setStatus(message) {
    var node = $('#app-status');
    if (node) node.textContent = message || '';
  }

  /* ── Zustand der Oberfläche ───────────────────────────────────────── */

  var currentId = null;
  function game() { return gameById(currentId); }

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
    var g = game();
    if (!el || !el.hasAttribute('data-tint') || !g) return;
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
    b.dataset.gameId = g.id;
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
    if (!gameById(id)) return;
    currentId = id;
    show('mode');
  }

  /* ── Echte Spielstände ────────────────────────────────────────────── */

  /* Abgeschlossene Sessions aller Spiele landen im Hub-Verlauf, Word Imposter
     führt einen eigenen. Neueste zuerst. */
  function hubHistory() {
    var hub = readHub();
    return hub && Array.isArray(hub.history)
      ? hub.history.filter(function (h) { return h && gameById(h.gameId); })
      : [];
  }
  function imposterHistory() {
    var list = readJson(IMPOSTER_HISTORY_KEY);
    return Array.isArray(list) ? list : [];
  }

  /* Häufigkeit je Spiel aus dem echten Verlauf. */
  function playCounts() {
    var counts = {};
    hubHistory().forEach(function (h) { counts[h.gameId] = (counts[h.gameId] || 0) + 1; });
    if (gameById('imposter') && imposterHistory().length) counts.imposter = (counts.imposter || 0) + imposterHistory().length;
    return counts;
  }

  /* Gespeicherte, noch nicht beendete Runden. Fortgesetzt wird auf der Seite
     des jeweiligen Spiels, die den Stand vorher selbst prüft. */
  var ACTIVE_SOURCES = [
    { key: 'secret-circle-party-hub-active-v1', id: function (v) { return v && v.session && v.session.gameId; }, href: function () { return 'party.html?from=v2'; } },
    { key: 'secret-circle-party-active-v1', id: function (v) { return v && v.gameId; }, href: function (id) { return 'advanced.html?game=' + encodeURIComponent(id); } },
    { key: 'secret-circle-party-quick-active-v1', id: function (v) { return v && v.gameId; }, href: function (id) { return 'quick-play.html?game=' + encodeURIComponent(id); } },
    { key: 'secret-circle-party-mega-active-v1', id: function (v) { return v && v.gameId; }, href: function (id) { return 'quick-play.html?game=' + encodeURIComponent(id); } },
    { key: 'secret-circle-party-viral-active-v1', id: function (v) { return v && v.gameId; }, href: function (id) { return 'quick-play.html?game=' + encodeURIComponent(id); } },
    { key: 'secret-circle-party-created-active-v1', id: function (v) { return v && v.gameId; }, href: function (id) { return 'quick-play.html?game=' + encodeURIComponent(id); } },
    { key: 'secret-circle-active-v7', id: function (v) { return v ? 'imposter' : null; }, href: function () { return 'index.html'; } }
  ];

  function activeSessions() {
    var out = [];
    ACTIVE_SOURCES.forEach(function (src) {
      var g = gameById(src.id(readJson(src.key)));
      if (g && !out.some(function (o) { return o.game.id === g.id; })) out.push({ game: g, href: src.href(g.id) });
    });
    return out;
  }

  /* ── START ────────────────────────────────────────────────────────── */

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

  /* „Meistgespielt“ nur mit echtem Verlauf; sonst die Empfehlungen des Katalogs. */
  function mostPlayed() {
    var counts = playCounts();
    return GAMES.filter(function (g) { return counts[g.id]; })
      .sort(function (a, b) { return counts[b.id] - counts[a.id] || deCompare(a.title, b.title); });
  }
  function featured() { return GAMES.filter(function (g) { return g.feat; }); }

  var SECTIONS = [
    { title: 'Eure meistgespielten', icon: 'flame', rank: true, pick: function () { return mostPlayed().slice(0, 10); } },
    { title: 'Empfohlen', icon: 'seal', pick: function () { return mostPlayed().length >= 3 ? [] : featured(); } },
    { title: 'In zehn Minuten durch', icon: 'spark', pick: function (l) { return mix(l.filter(function (g) { return g.dur <= 10; })); } },
    { title: 'Für größere Runden', icon: 'users', pick: function (l) { return mix(l.filter(function (g) { return g.min >= 4; })); } },
    { title: 'Zum Nachdenken', icon: 'brain', pick: function (l) { return mix(l.filter(function (g) { return g.moods.indexOf('clever') >= 0 || g.moods.indexOf('deep') >= 0; })); } }
  ];

  function heroGames() {
    var played = mostPlayed();
    return { list: (played.length >= 3 ? played : featured()).slice(0, 3), real: played.length >= 3 };
  }

  function renderHome() {
    var heroes = heroGames();
    if (!heroes.list.length) heroes.list = GAMES.slice(0, 3);
    if (heroIdx >= heroes.list.length) heroIdx = 0;
    var hero = heroes.list[heroIdx];

    $('#hero-badge').textContent = heroes.real ? 'Meistgespielt' : 'Empfehlung';
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
    heroes.list.forEach(function (g, i) {
      var b = make('button', 'dot-btn');
      b.type = 'button';
      b.setAttribute('aria-label', 'Vorschlag ' + (i + 1) + ' von ' + heroes.list.length + ': ' + g.title);
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

  function renderResume() {
    var slot = $('#resume-slot');
    clear(slot);
    activeSessions().forEach(function (entry) {
      var row = make('div', 'resume');
      var main = make('a', 'resume-main');
      main.href = entry.href;
      main.appendChild(document.createTextNode('Weiterspielen'));
      main.appendChild(make('small', null, entry.game.title + ' · gespeicherter Spielstand'));
      var go = make('a', 'resume-go', 'Weiter');
      go.href = entry.href;
      go.setAttribute('aria-label', entry.game.title + ' fortsetzen');
      row.appendChild(main);
      row.appendChild(go);
      slot.appendChild(row);
    });
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

  var MOOD_LABEL = {
    clever: 'Clever', competitive: 'Wettkampf', funny: 'Lustig', deep: 'Tiefgang',
    wild: 'Wild', friendly: 'Freundlich', chaotic: 'Chaos', creative: 'Kreativ'
  };

  /* Wo das Spiel läuft. Alle Abläufe dahinter sind die geprüften Engines. */
  function startTarget(g) {
    if (g.linked) return g.href;
    var pack = chosenPack(g);
    return 'party.html?play=' + encodeURIComponent(g.id) +
      (pack ? '&pack=' + encodeURIComponent(pack.name) : '') + '&from=v2';
  }

  function renderSteps(host, g) {
    clear(host);
    g.steps.forEach(function (t, i) {
      var li = make('li');
      li.appendChild(make('i', null, String(i + 1)));
      li.appendChild(document.createTextNode(t));
      host.appendChild(li);
    });
  }

  function renderMode() {
    var g = game();
    if (!g) { show('games', { reset: true }); return; }
    $('#mode-emblem').innerHTML = markSVG(g);
    fit($('#mode-title'), g.title, '2.2rem');
    $('#mode-sub').textContent = g.desc;

    var meta = $('#mode-meta');
    clear(meta);
    [g.min + '–' + g.max + ' Personen', g.dur + ' min', g.bucket.label]
      .concat(g.moods.slice(0, 1).map(function (m) { return MOOD_LABEL[m] || m; }))
      .forEach(function (t) { meta.appendChild(make('span', null, t)); });

    var shared = usesHubPlayers(g);
    var count = players().length;
    var short = shared && count < g.min;
    var over = shared && count > g.max;
    $('#players-row').hidden = !shared;
    var pc = $('#players-count');
    pc.textContent = count + '/' + g.max;
    pc.className = 'row-val' + (short || over ? ' warn' : '');

    var packs = packsOf(g);
    $('#pack-row').hidden = packs.length < 2;
    var pack = chosenPack(g);
    $('#pack-value').textContent = pack ? pack.name : '';

    renderSteps($('#mode-steps'), g);

    var btn = $('#start-btn');
    var note = $('#start-note');
    btn.disabled = short || over;
    note.className = 'dock-note' + (short || over ? ' warn' : '');
    if (short) note.textContent = g.min + ' Personen nötig — ' + (g.min - count) + ' fehlen noch';
    else if (over) note.textContent = 'Höchstens ' + g.max + ' Personen — ' + (count - g.max) + ' zu viel';
    else if (!shared) note.textContent = 'Word Imposter richtet die Runde auf der nächsten Seite ein';
    else note.textContent = count + ' Personen' + (pack && packs.length > 1 ? ' · ' + pack.name : '');
  }

  function startGame() {
    var g = game();
    if (!g || $('#start-btn').disabled) return;
    window.location.href = startTarget(g);
  }

  function renderHowto() {
    var g = game();
    if (!g) { back(); return; }
    fit($('#howto-title'), g.title, '2rem');
    $('#howto-sub').textContent = g.desc;
    renderSteps($('#howto-steps'), g);
  }

  /* ── SPIELER ──────────────────────────────────────────────────────── */

  function setPlayerHint(msg, warn) {
    var h = $('#player-hint');
    h.textContent = msg || '';
    h.className = 'hint-line' + (warn ? ' warn' : '');
  }

  function playerLimits() {
    var g = game();
    return g && usesHubPlayers(g) ? { min: g.min, max: g.max, title: g.title, tint: g.bucket.tint } : { min: 2, max: MAX_PLAYERS, title: '', tint: BUCKETS[1].tint };
  }

  function renderPlayers() {
    var limits = playerLimits();
    var list = players();
    $('#player-badge').textContent = list.length + '/' + limits.max;
    var host = $('#player-list');
    clear(host);
    if (!list.length) host.appendChild(make('p', 'empty', 'Noch niemand am Start. Namen unten eintragen.'));
    list.forEach(function (nm, i) {
      var row = make('div', 'prow');
      row.appendChild(make('span', 'prow-n', String(i + 1)));
      row.appendChild(make('span', 'prow-name', nm));
      var x = make('button', 'prow-x');
      x.type = 'button';
      x.setAttribute('aria-label', nm + ' entfernen');
      x.innerHTML = icon('close');
      x.addEventListener('click', function () {
        var next = players();
        next.splice(i, 1);
        if (!savePlayers(next)) return;
        renderPlayers();
        setPlayerHint(nm + ' entfernt.', false);
        announce(nm + ' entfernt. ' + next.length + ' Personen.');
      });
      row.appendChild(x);
      host.appendChild(row);
    });

    var full = list.length >= limits.max;
    $('#player-add').disabled = full;
    $('#player-input').disabled = full;
    if (full) setPlayerHint('Mehr als ' + limits.max + ' Personen gehen nicht.', true);
    else if (list.length < limits.min) setPlayerHint(limits.min + ' Personen nötig' + (limits.title ? ' für ' + limits.title : '') + '.', list.length > 0);
    else setPlayerHint('Das Gerät wandert in dieser Reihenfolge. Die Liste gilt für alle Spiele.', false);

    /* Der Platz unter der Liste zeigt die Reihenfolge, in der das Gerät wandert. */
    var prev = $('#seat-preview');
    clear(prev);
    if (list.length >= 2) {
      var box = make('div', 'seat-preview');
      var ring = make('div', 'ring');
      ring.innerHTML = seatRingSVG(list.length, 0, limits.tint);
      box.appendChild(ring);
      box.appendChild(make('p', null, list.join(' → ') + ' → ' + list[0]));
      prev.appendChild(box);
    }
  }

  function addPlayer() {
    var limits = playerLimits();
    var input = $('#player-input');
    var raw = String(input.value || '').normalize('NFKC').replace(/\s+/g, ' ').trim().slice(0, 32);
    if (!raw) { input.focus(); return; }
    var list = players();
    if (list.length >= limits.max) {
      setPlayerHint('Mehr als ' + limits.max + ' Personen gehen nicht.', true);
      return;
    }
    var dupe = list.filter(function (n) { return n.toLocaleLowerCase('de-DE') === raw.toLocaleLowerCase('de-DE'); })[0];
    if (dupe) {
      input.value = '';
      input.focus();
      setPlayerHint(dupe + ' steht schon in der Liste.', true);
      announce(dupe + ' steht schon in der Liste.');
      return;
    }
    list.push(raw);
    if (!savePlayers(list)) return;
    input.value = '';
    renderPlayers();
    input.focus();
    setPlayerHint(raw + ' dabei. Nächsten Namen tippen.', false);
    announce(raw + ' hinzugefügt. ' + list.length + ' Personen.');
  }

  /* ── KATEGORIE ────────────────────────────────────────────────────── */

  function renderPacks() {
    var g = game();
    if (!g) { back(); return; }
    var host = $('#pack-list');
    clear(host);
    var current = chosenPack(g);
    packsOf(g).forEach(function (p) {
      var on = current && current.name === p.name;
      var b = make('button', 'row pack-row');
      b.type = 'button';
      b.setAttribute('aria-pressed', String(!!on));
      var tick = make('span', 'tick');
      tick.innerHTML = icon('check', 2.6);
      b.appendChild(tick);
      b.appendChild(make('span', 'row-main', p.name));
      b.appendChild(make('span', 'pack-count', String(p.count)));
      b.addEventListener('click', function () {
        packChoice[g.id] = p.name;
        announce(p.name + ' gewählt, ' + p.count + ' Karten.');
        back();
      });
      host.appendChild(b);
    });
  }

  /* ── PROFIL ───────────────────────────────────────────────────────── */

  function renderProfile() {
    $('#profile-avatar').innerHTML = avatarSVG(1);
    var group = players();
    $('#profile-since').textContent = group.length + (group.length === 1 ? ' Person' : ' Personen') + ' in der Gruppe';

    var hub = hubHistory();
    var imposter = imposterHistory();
    var rounds = hub.reduce(function (n, h) { return n + (Number(h.rounds) || 0); }, 0) + imposter.length;
    var counts = playCounts();
    var stats = $('#profile-stats');
    clear(stats);
    [[hub.length + imposter.length, 'Sessions'], [rounds, 'Runden gespielt'], [Object.keys(counts).length, 'Spiele probiert']].forEach(function (p) {
      var d = make('div', 'stat');
      d.appendChild(make('b', null, String(p[0])));
      d.appendChild(make('span', null, p[1]));
      stats.appendChild(d);
    });

    var recent = $('#profile-recent');
    clear(recent);
    var seen = {};
    var list = hub.map(function (h) { return h.gameId; })
      .concat(imposter.length ? ['imposter'] : [])
      .filter(function (id) {
        if (seen[id] || !gameById(id)) return false;
        seen[id] = true;
        return true;
      }).slice(0, 8);
    list.forEach(function (id) { recent.appendChild(gameCard(gameById(id))); });
    recent.hidden = !list.length;
    $('#recent-empty').hidden = list.length > 0;

    $('#settings-players').textContent = String(group.length);
  }

  /* ── Zeichnen je Bildschirm ───────────────────────────────────────── */

  var RENDER = {
    home: renderHome,
    games: renderGames,
    mode: renderMode,
    howto: renderHowto,
    players: renderPlayers,
    packs: renderPacks,
    profile: renderProfile
  };
  function render(name) {
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

    $('#howto-btn').addEventListener('click', function () { show('howto'); });
    $('#start-btn').addEventListener('click', startGame);

    /* Hero: drei echte Empfehlungen — per Punkt oder Wisch. */
    var heroEl = $('.hero');
    var hx = null;
    heroEl.addEventListener('touchstart', function (e) { hx = e.touches[0].clientX; }, { passive: true });
    heroEl.addEventListener('touchend', function (e) {
      if (hx == null) return;
      var dx = e.changedTouches[0].clientX - hx;
      var count = heroGames().list.length;
      hx = null;
      if (Math.abs(dx) < 45 || count < 2) return;
      heroIdx = (heroIdx + (dx < 0 ? 1 : count - 1)) % count;
      renderHome();
    }, { passive: true });

    $('#q').addEventListener('input', function (e) { query = e.target.value; renderGames(); });
    $('#player-form').addEventListener('submit', function (e) { e.preventDefault(); addPlayer(); });

    /* Rückkehr aus einem Spiel oder einem anderen Tab: Spielstände und
       Verlauf können sich dort geändert haben. */
    window.addEventListener('pageshow', function () { if (CURRENT) render(CURRENT); });
    window.addEventListener('storage', function () { if (CURRENT) render(CURRENT); });
  }

  /* Einsprung per Adresse, z. B. aus einem Spiel zurück: #spiele, #profil,
     #spieler oder #spiel=<id>. */
  function initialScreen() {
    var target = decodeURIComponent((window.location.hash || '').slice(1));
    if (target === 'spiele') return show('games', { reset: true });
    if (target === 'profil') return show('profile', { reset: true });
    if (target === 'spieler') return show('players', { reset: true });
    if (target.indexOf('spiel=') === 0 && gameById(target.slice(6))) {
      currentId = target.slice(6);
      show('games', { reset: true });
      return show('mode');
    }
    show('home', { reset: true });
  }

  wire();
  initialScreen();
  window.addEventListener('hashchange', initialScreen);
})();
