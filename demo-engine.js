/* Traychemy landing page: the rules of the little demo board, with no DOM in it.
   It mirrors the real game's tray rules (scripts/gameplay/recipe_resolver.gd + game_session.gd):
   recipes fire highest priority first, the first matching pair wins ties, an output goes to the
   end of the tray, and a full tray that cannot react is a loss. */
(function (root) {
  'use strict';

  var CAPACITY = 5;
  var BOARD_H = 66; // board height as a share of its width, so y can use the same units as x

  var NAMES = {
    dog: 'Chó', bone: 'Xương', cat: 'Mèo', fish: 'Cá', mouse: 'Chuột', cheese: 'Phô Mai',
    water: 'Nước', plant: 'Mầm Cây', flower: 'Hoa', bee: 'Ong', honey: 'Mật Ong', bear: 'Gấu'
  };

  // [a, b, output or null, priority]  (priority order is the real game's: chains resolve inner-first)
  var RECIPES = [
    ['honey', 'bear', null, 40],
    ['flower', 'bee', 'honey', 30],
    ['water', 'plant', 'flower', 20],
    ['dog', 'bone', null, 10],
    ['cat', 'fish', null, 10],
    ['mouse', 'cheese', null, 10]
  ];

  // x, y are the tile centre in board-width units (the board is 100 wide). by lists what covers it.
  var LAYOUT = [
    { id: 'dog',    x: 22.25, y: 11,   by: [] },
    { id: 'cat',    x: 40.75, y: 11,   by: [] },
    { id: 'bee',    x: 59.25, y: 11,   by: [] },
    { id: 'mouse',  x: 77.75, y: 11,   by: [] },
    { id: 'bone',   x: 31.5,  y: 19.5, by: ['dog', 'cat'] },
    { id: 'fish',   x: 50,    y: 19.5, by: ['cat', 'bee'] },
    { id: 'cheese', x: 68.5,  y: 19.5, by: ['bee', 'mouse'] },
    { id: 'water',  x: 24,    y: 50,   by: [] },
    { id: 'plant',  x: 52,    y: 44,   by: [] },
    { id: 'bear',   x: 77,    y: 53,   by: [] }
  ];

  function matches(r, a, b) { return (r[0] === a && r[1] === b) || (r[0] === b && r[1] === a); }

  function better(c, best) {
    if (!best) return true;
    if (c.r[3] !== best.r[3]) return c.r[3] > best.r[3];
    if (c.key !== best.key) return c.key < best.key;
    if (c.i !== best.i) return c.i < best.i;
    return c.j < best.j;
  }

  // Resolves a tray fully. Returns { tray, steps } where every step is one reaction.
  function resolve(tray) {
    var cur = tray.slice();
    var steps = [];
    for (var depth = 0; depth < 20; depth++) {
      var best = null;
      for (var i = 0; i < cur.length; i++) {
        for (var j = i + 1; j < cur.length; j++) {
          for (var k = 0; k < RECIPES.length; k++) {
            var r = RECIPES[k];
            if (!matches(r, cur[i], cur[j])) continue;
            var cand = { r: r, i: i, j: j, key: r[0] + '_' + r[1] };
            if (better(cand, best)) best = cand;
          }
        }
      }
      if (!best) break;
      var consumed = [cur[best.i], cur[best.j]];
      var next = cur.filter(function (_, idx) { return idx !== best.i && idx !== best.j; });
      var out = best.r[2];
      if (out) next.push(out);
      steps.push({ type: out ? 'transform' : 'clear', slots: [best.i, best.j], consumed: consumed, out: out, trayAfter: next.slice() });
      cur = next;
    }
    return { tray: cur, steps: steps };
  }

  function createGame(capacity) {
    var g = { capacity: capacity || CAPACITY, removed: {}, tray: [], over: null };
    var by = {};
    LAYOUT.forEach(function (t) { by[t.id] = t.by; });

    g.reset = function () { g.removed = {}; g.tray = []; g.over = null; };
    g.remaining = function () { return LAYOUT.filter(function (t) { return !g.removed[t.id]; }).length; };
    g.isAccessible = function (uid) {
      if (g.removed[uid] || !by.hasOwnProperty(uid)) return false;
      return by[uid].every(function (b) { return g.removed[b]; });
    };
    g.accessible = function () {
      return LAYOUT.filter(function (t) { return g.isAccessible(t.id); }).map(function (t) { return t.id; });
    };

    // A tile that still leaves the board winnable (so the demo can offer a hint), or null.
    g.hint = function () {
      var cap = g.capacity;
      var memo = {};
      function ok(removed, tray) {
        var rem = LAYOUT.filter(function (t) { return !removed[t.id]; });
        if (rem.length === 0) return tray.length === 0;
        var k = Object.keys(removed).sort().join(',') + '|' + tray.join(',');
        if (memo.hasOwnProperty(k)) return memo[k];
        var found = false;
        for (var i = 0; i < rem.length && !found; i++) {
          var t = rem[i];
          if (!t.by.every(function (b) { return removed[b]; })) continue;
          var nr = {}; Object.keys(removed).forEach(function (x) { nr[x] = true; }); nr[t.id] = true;
          var nt = resolve(tray.concat([t.id])).tray;
          if (rem.length > 1 && nt.length >= cap) continue;
          if (ok(nr, nt)) found = true;
        }
        memo[k] = found;
        return found;
      }
      if (g.over || g.tray.length >= cap) return null;
      var left = LAYOUT.filter(function (t) { return !g.removed[t.id]; });
      for (var i = 0; i < left.length; i++) {
        var t = left[i];
        if (!g.isAccessible(t.id)) continue;
        var nr = {}; Object.keys(g.removed).forEach(function (x) { nr[x] = true; }); nr[t.id] = true;
        var nt = resolve(g.tray.concat([t.id])).tray;
        if (left.length > 1 && nt.length >= cap) continue;
        if (ok(nr, nt)) return t.id;
      }
      return null;
    };

    // Plays one tap. Returns { ok, reason, events }.
    g.tap = function (uid) {
      if (g.over) return { ok: false, reason: 'over', events: [] };
      if (!g.isAccessible(uid)) return { ok: false, reason: 'covered', events: [] };
      if (g.tray.length >= g.capacity) return { ok: false, reason: 'full', events: [] };
      g.removed[uid] = true;
      g.tray.push(uid);
      var events = [{ type: 'pick', uid: uid, slot: g.tray.length - 1, tray: g.tray.slice() }];
      var res = resolve(g.tray);
      res.steps.forEach(function (s) { events.push(s); });
      g.tray = res.tray;
      if (g.remaining() === 0) g.over = g.tray.length === 0 ? 'win' : 'lose';
      else if (g.tray.length >= g.capacity) g.over = 'lose';
      if (g.over) events.push({ type: g.over });
      return { ok: true, events: events };
    };
    return g;
  }

  var api = { CAPACITY: CAPACITY, BOARD_H: BOARD_H, NAMES: NAMES, RECIPES: RECIPES, LAYOUT: LAYOUT, resolve: resolve, createGame: createGame };
  root.TraychemyDemo = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
