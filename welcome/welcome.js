/* HubSkins welcome page: shown once, on first install. */
(function () {
  'use strict';

  var api = typeof browser !== 'undefined' && browser.storage ? browser : chrome;
  var TS = window.ThemeStudio;
  var DERIVED = window.ThemeStudioDerived || {};
  var CONFIG = window.HubSkinsConfig || {};
  var $ = function (id) { return document.getElementById(id); };
  var settings = TS.normalizeSettings({});

  var isFirefox = api.runtime.getURL('').indexOf('moz-extension:') === 0;
  var isEdge = /\bEdg\//.test(navigator.userAgent);

  function paint() {
    var off = settings.theme === 'off';
    var t = TS.getTheme(off ? settings.lastTheme : settings.theme);
    var d = DERIVED[t.id] || {};
    var root = document.documentElement.style;
    root.setProperty('--acc', d.popupAccent || t.c.accent);
    root.setProperty('--acc-ink', d.popupAccentInk || '#0b1020');
    Array.prototype.forEach.call($('swatches').children, function (b) {
      b.setAttribute('aria-pressed', String(!off && b.dataset.id === settings.theme));
    });
    $('pickedName').textContent = off ? '' : t.name + ': ' + t.tag;
  }

  function buildSwatches() {
    var box = $('swatches');
    TS.THEMES.forEach(function (t) {
      var d = DERIVED[t.id] || {};
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'sw';
      b.dataset.id = t.id;
      b.setAttribute('aria-label', t.name + ', ' + t.tag);
      b.setAttribute('aria-pressed', 'false');
      b.title = t.name;
      b.style.setProperty('--s-bg', t.c.bg);
      b.style.setProperty('--s-acc', d.popupAccent || t.c.accent);
      b.style.setProperty('--s-text', d.text || t.c.text);
      b.addEventListener('click', function () {
        settings.theme = t.id;
        settings.lastTheme = t.id;
        paint();
        api.storage.sync.set({ theme: t.id, lastTheme: t.id });
      });
      box.appendChild(b);
    });
  }

  function setupLinks() {
    var rate = isFirefox ? CONFIG.RATE_FIREFOX_URL : isEdge ? CONFIG.RATE_EDGE_URL : CONFIG.RATE_CHROME_URL;
    if (rate) { $('rateLink').href = rate; $('rateLink').hidden = false; }
    if (CONFIG.SUPPORT_URL) { $('supportLink').href = CONFIG.SUPPORT_URL; $('supportLink').hidden = false; }
    $('loveCard').hidden = !(rate || CONFIG.SUPPORT_URL);
  }

  function setupKeys() {
    try {
      var p = api.commands.getAll();
      if (!p || !p.then) return;
      p.then(function (cmds) {
        var map = {};
        cmds.forEach(function (c) { map[c.name] = c.shortcut; });
        var box = $('keys');
        box.textContent = '';
        var add = function (shortcut, what) {
          if (!shortcut) return;
          if (box.childNodes.length) box.appendChild(document.createTextNode(' and '));
          var k = document.createElement('kbd');
          k.textContent = shortcut;
          box.appendChild(k);
          box.appendChild(document.createTextNode(' ' + what));
        };
        add(map['toggle-theme'], 'turns themes on or off');
        add(map['next-theme'], 'switches to the next theme');
        $('keysTip').hidden = !box.childNodes.length;
      }).catch(function () {});
    } catch (e) { /* shortcuts are optional */ }
  }

  buildSwatches();
  setupLinks();
  setupKeys();

  api.storage.sync.get(null).then(function (s) {
    settings = TS.normalizeSettings(s);
    paint();
  }).catch(function () { paint(); });

  api.storage.onChanged.addListener(function (changes, area) {
    if (area !== 'sync') return;
    var patch = {};
    Object.keys(changes).forEach(function (k) { patch[k] = changes[k].newValue; });
    settings = TS.normalizeSettings(Object.assign({}, settings, patch));
    paint();
  });
})();
