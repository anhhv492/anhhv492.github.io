/* Traychemy landing page: the language dropdown.
   index.html ships in Vietnamese, which is also the default. This file holds the English text for
   every [data-i18n] element, plus both languages for the strings the demo builds while you play.
   When you change a Vietnamese sentence in index.html, update its English twin here. */
(function (root) {
  'use strict';

  var STORE = 'traychemy.lang';

  var NAMES = {
    vi: {
      dog: 'Chó', bone: 'Xương', cat: 'Mèo', fish: 'Cá', mouse: 'Chuột', cheese: 'Phô Mai', water: 'Nước',
      plant: 'Mầm Cây', flower: 'Hoa', bee: 'Ong', honey: 'Mật Ong', bear: 'Gấu', box: 'Hộp'
    },
    en: {
      dog: 'Dog', bone: 'Bone', cat: 'Cat', fish: 'Fish', mouse: 'Mouse', cheese: 'Cheese', water: 'Water',
      plant: 'Sprout', flower: 'Flower', bee: 'Bee', honey: 'Honey', bear: 'Bear', box: 'Box'
    }
  };

  // Strings built at run time by app.js.
  var DEMO = {
    vi: {
      tray: function (names) { return 'Khay: ' + (names.length ? names.join(', ') : 'trống'); },
      left: function (n) { return 'Còn ' + n + ' món'; },
      start: function () { return 'Chạm vào món đang có vòng sáng. Món nào tối đi là đang bị đè.'; },
      covered: function () { return 'Có món khác đang đè lên. Nhặt món phía trên trước.'; },
      picked: function (a) { return 'Nhặt ' + a + '.'; },
      merged: function (a, b, c) { return a + ' + ' + b + ' → ' + c + '!'; },
      cleared: function (a, b) { return a + ' + ' + b + ': ghép đôi, biến mất!'; },
      combo: function (n) { return 'Chuỗi ×' + n + '!'; },
      winStatus: function () { return 'Bàn sạch trơn, khay trống. Xong!'; },
      loseStatus: function () { return 'Khay đã đầy và không còn phản ứng nào.'; },
      winTitle: function () { return 'Dọn sạch bàn!'; },
      winText: function () { return 'Màn thử xong rồi. Bản đầy đủ có hơn 30 màn, một con boss và chế độ Vô Tận.'; },
      loseTitle: function () { return 'Khay kẹt rồi!'; },
      loseText: function () { return 'Khay đầy mà không ghép được món nào. Thử lại và nghĩ thứ tự nhặt nhé.'; },
      tryPick: function (a) { return 'Thử nhặt ' + a + '.'; },
      deadEnd: function () { return 'Ván này đã bí đường — bấm “Chơi lại” để thử cách khác.'; }
    },
    en: {
      tray: function (names) { return 'Tray: ' + (names.length ? names.join(', ') : 'empty'); },
      left: function (n) { return n === 1 ? '1 item left' : n + ' items left'; },
      start: function () { return 'Tap the item with the glowing ring. Darker items are covered.'; },
      covered: function () { return 'Another item is on top of it. Pick that one first.'; },
      picked: function (a) { return 'Picked ' + a + '.'; },
      merged: function (a, b, c) { return a + ' + ' + b + ' → ' + c + '!'; },
      cleared: function (a, b) { return a + ' + ' + b + ': a pair, gone!'; },
      combo: function (n) { return 'Chain ×' + n + '!'; },
      winStatus: function () { return 'Board clear, tray empty. Done!'; },
      loseStatus: function () { return 'The tray is full and nothing can combine.'; },
      winTitle: function () { return 'Board cleared!'; },
      winText: function () { return 'That was the demo. The full game has 30+ levels, a boss and Endless mode.'; },
      loseTitle: function () { return 'Tray jammed!'; },
      loseText: function () { return 'The tray filled up with nothing to combine. Try again and plan your picking order.'; },
      tryPick: function (a) { return 'Try picking ' + a + '.'; },
      deadEnd: function () { return 'This round can no longer be won. Press “Play again” and try another way.'; }
    }
  };

  // English for the page itself, keyed by data-i18n / data-i18n-aria.
  var PAGE_EN = {
    'meta.title': 'Traychemy: a tray puzzle game, pick items and pair them up',
    'meta.desc': 'Traychemy is a tray puzzle game: pick items and match the right pairs to clear the board before the tray fills up. 30+ levels, a boss and Endless mode. Try it on this page.',
    'skip': 'Skip to main content',
    'aria.brand': 'Traychemy, back to top',
    'aria.nav': 'Main sections',
    'nav.how': 'How to play',
    'nav.features': 'Features',
    'nav.worlds': 'Worlds',
    'nav.endless': 'Endless',
    'lang.label': 'Language:',
    'soon.short': 'Coming soon',
    'hero.eyebrow': 'Tray puzzle game',
    'hero.title': 'Pick. Pair up.<em>Clear the board.</em>',
    'hero.lead': 'Every item you pick drops into the tray. A matching pair combines and disappears; if the tray fills up with nothing to combine, you lose. Try a round right here, nothing to install.',
    'hero.try': 'Try it now',
    'hero.how': 'How it works',
    'aria.facts': 'Highlights',
    'fact.levels': '30+ levels',
    'fact.boss': 'Giant boss',
    'fact.endless': 'Endless mode',
    'fact.worlds': '5 worlds',
    'fact.lang': 'Game in Vietnamese',
    'hero.soon': 'In development, coming soon to Android &amp; iOS',
    'demo.chip': 'Demo level · 5-slot tray',
    'aria.board': 'Game board',
    'demo.again': 'Play again',
    'demo.hint': 'Hint',
    'demo.recipes': 'Recipes in this demo',
    'item.flower': 'Flower',
    'item.honey': 'Honey',
    'gone': 'gone',
    'how.eyebrow': 'How to play',
    'how.title': 'Three steps and you have it',
    'how.lead': 'The rules are short. The hard part is the order you pick in.',
    'step1.title': 'Tap an uncovered item',
    'step1.text': 'Covered items look darker. Take away what is on top before you can pick the one below.',
    'step2.title': 'Right pairs combine',
    'step2.text': 'Dog meets Bone, Cat meets Fish: both leave the tray. Some pairs even make a new item.',
    'step3.title': 'Don’t jam the tray',
    'step3.text': 'A full tray with no pair to combine means you lose. Think before you tap.',
    'chain.title': 'One tap can set off a whole chain',
    'aria.chain': 'Chain: Water, Sprout, Flower, Bee, Honey, Bear',
    'chain.text': 'Water and Sprout make a Flower, a Flower and a Bee make Honey, and Honey wakes the Bear. Line it up well and the whole chain runs in one go.',
    'feat.eyebrow': 'What’s inside',
    'feat.title': 'Easy to start, hard to put down',
    'feat.levels.title': '30+ levels and a boss',
    'feat.levels.text': 'From the first practice levels to the Giant Picnic Basket: 120 items in 3 phases.',
    'feat.endless.title': 'Endless mode',
    'feat.endless.text': 'Wave after wave: pick one of four difficulties and see how far you get.',
    'feat.choice.title': 'Choose your pairs',
    'feat.choice.text': 'Sometimes an item fits both ways, like a Cat with both Fish and Milk. You decide which pair it makes.',
    'feat.box.title': 'Mystery boxes',
    'feat.box.text': 'You only find out what’s inside when you tap. It might be what you need, it might not.',
    'feat.guide.title': 'Guided start',
    'feat.guide.text': 'The first level walks you through step by step, from your first tap to the recipe button.',
    'feat.help.title': 'Help when you’re stuck',
    'feat.help.text': 'Need a hint, an undo or one more tray slot? Watch a short video to get it. Entirely up to you.',
    'feat.own.title': 'Made from scratch',
    'feat.own.text': 'All art and sound in the game are original, with no borrowed assets.',
    'feat.open.title': 'Open and play',
    'feat.open.text': 'No sign-in, no account. The game itself is currently in Vietnamese.',
    'worlds.eyebrow': 'Five worlds',
    'worlds.title': 'Each place has its own recipes',
    'worlds.lead': 'As you travel through the worlds you meet new items and new reactions.',
    'w.backyard.name': 'Backyard',
    'w.backyard.tag': 'Where it all begins',
    'w.backyard.items': '<b>Items:</b> Dog, Bone, Cat, Fish, Mouse, Cheese, Water, Sprout, Bee, Bear…',
    'w.backyard.chain': '<b>Chain:</b> Water + Sprout → Flower → + Bee → Honey → + Bear',
    'w.kitchen.name': 'Kitchen',
    'w.kitchen.tag': 'Flour, fire and a cat eyeing the milk',
    'w.kitchen.items': '<b>Items:</b> Flour, Egg, Fire, Butter, Milk…',
    'w.kitchen.chain': '<b>Chain:</b> Flour + Egg → Dough → + Fire → Bread → + Butter',
    'w.pond.name': 'Pond',
    'w.pond.tag': 'Frogs, ducks and lotus',
    'w.pond.items': '<b>Items:</b> Frog, Fly, Duck, Mud, Lotus Seed…',
    'w.pond.chain': '<b>Chain:</b> Mud + Lotus Seed → Lotus → + Bee',
    'w.toy.name': 'Toy Room',
    'w.toy.tag': 'Stack towers, paint pictures, tie ribbons',
    'w.toy.items': '<b>Items:</b> Teddy Bear, Ribbon, Wooden Blocks, Paint, Canvas, Picture Frame…',
    'w.toy.chain': '<b>Chain:</b> Paint + Canvas → Painting → + Picture Frame. Two Wooden Blocks make a Tower.',
    'w.forest.name': 'Magic Forest',
    'w.forest.tag': 'From stardust to a flying broom',
    'w.forest.items': '<b>Items:</b> Mushroom, Firefly, Stardust, Feather, Broom, Witch Hat…',
    'w.forest.chain': '<b>Chain:</b> Stardust + Feather → Wings → + Broom → Flying Broom → + Witch Hat',
    'end.eyebrow': 'Endless mode',
    'end.title': 'Pick a difficulty, play until you lose',
    'end.lead': 'Each wave is a new board. Higher tiers are tougher, and Nightmare leaves you only 5 tray slots.',
    'tier.easy.name': 'Easy',
    'tier.easy.text': 'Only familiar pairs, but the other half is often one layer down.',
    'tier.normal.name': 'Medium',
    'tier.normal.text': 'Adds the flower, honey and bear chain, and a busier board.',
    'tier.hard.name': 'Hard',
    'tier.hard.text': 'All six recipes, a wide board, and almost every group is split across layers.',
    'tier.night.name': 'Nightmare',
    'tier.night.text': 'Only 5 tray slots, deep stacks and mystery boxes.',
    'dl.title': 'Traychemy is still being polished',
    'dl.text': 'The game is in development for Android &amp; iOS. When there is a download, the button will appear right here.',
    'dl.none': 'No download yet',
    'dl.back': 'Back to the demo',
    'foot.brand': '<strong>Traychemy</strong> · pick, pair up, clear the board.',
    'foot.note': '© 2026 Traychemy. The pictures on this page are illustrations redrawn from the game’s artwork, not screenshots.'
  };

  var listeners = [];
  var lang = load();

  function load() {
    try { return root.localStorage.getItem(STORE) === 'en' ? 'en' : 'vi'; } catch (e) { return 'vi'; }
  }

  function save(value) {
    try { root.localStorage.setItem(STORE, value); } catch (e) { /* private window: the choice just is not kept */ }
  }

  // Swaps one element between the Vietnamese it shipped with and its English text.
  function translate(el, keyAttr, memo, read, write) {
    if (el[memo] === undefined) el[memo] = read(el);
    var en = PAGE_EN[el.getAttribute(keyAttr)];
    write(el, lang === 'en' && en !== undefined ? en : el[memo]);
  }

  var viTitle, viDesc;

  function applyPage() {
    var doc = root.document;
    doc.documentElement.lang = lang;
    var desc = doc.querySelector('meta[name="description"]');
    if (viTitle === undefined) { viTitle = doc.title; viDesc = desc ? desc.content : ''; }
    doc.title = lang === 'en' ? PAGE_EN['meta.title'] : viTitle;
    if (desc) desc.content = lang === 'en' ? PAGE_EN['meta.desc'] : viDesc;

    doc.querySelectorAll('[data-i18n]').forEach(function (el) {
      translate(el, 'data-i18n', '__vi',
        function (n) { return n.innerHTML; },
        function (n, v) { n.innerHTML = v; });
    });
    doc.querySelectorAll('[data-i18n-aria]').forEach(function (el) {
      translate(el, 'data-i18n-aria', '__viAria',
        function (n) { return n.getAttribute('aria-label'); },
        function (n, v) { n.setAttribute('aria-label', v); });
    });
    doc.querySelectorAll('.tile--static[role="img"]').forEach(function (el) {
      var m = /(?:^|\s)t-([a-z]+)/.exec(el.className);
      if (m && NAMES[lang][m[1]]) el.setAttribute('aria-label', NAMES[lang][m[1]]);
    });
  }

  function set(value) {
    lang = value === 'en' ? 'en' : 'vi';
    save(lang);
    applyPage();
    listeners.forEach(function (fn) { fn(lang); });
  }

  var api = {
    NAMES: NAMES, DEMO: DEMO, PAGE_EN: PAGE_EN,
    lang: function () { return lang; },
    name: function (id) { return NAMES[lang][id]; },
    t: function (key) { return DEMO[lang][key].apply(null, Array.prototype.slice.call(arguments, 1)); },
    onChange: function (fn) { listeners.push(fn); },
    set: set
  };
  root.TraychemyI18n = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;

  if (root.document) {
    applyPage();
    var box = root.document.getElementById('lang-box');
    var select = root.document.getElementById('lang');
    if (box && select) {
      select.value = lang;
      box.hidden = false;
      select.addEventListener('change', function () { set(select.value); });
    }
  }
})(typeof window !== 'undefined' ? window : globalThis);
