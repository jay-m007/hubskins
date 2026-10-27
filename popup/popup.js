/* HubSkins popup */
(function () {
  'use strict';

  var api = typeof browser !== 'undefined' && browser.storage ? browser : chrome;
  var TS = window.ThemeStudio;
  var DERIVED = window.ThemeStudioDerived || {};
  var CONFIG = window.HubSkinsConfig || {};
  var isFirefox = api.runtime.getURL('').indexOf('moz-extension:') === 0;
  var inTab = /[?&]tab=1\b/.test(location.search);

  var $ = function (id) { return document.getElementById(id); };
  var settings = TS.normalizeSettings({});
  var hasImage = false;

  var OPTIONS = [
    { key: 'graph', label: 'Theme the contribution graph', hint: 'Recolor your green squares' },
    { key: 'scene', label: 'Background scene', hint: 'Subtle artwork behind the page' },
    { key: 'fonts', label: 'Theme fonts', hint: 'Styled headings and titles' },
    { key: 'fx', label: 'Celebrations', hint: 'A little burst when you star a repo' },
    { key: 'shuffle', label: 'New theme every day', hint: 'Starts tomorrow' }
  ];

  if (inTab) document.body.classList.add('in-tab');
  $('brandName').textContent = CONFIG.NAME || 'HubSkins';
  $('brandSub').textContent = CONFIG.TAGLINE || 'Themes for GitHub';

  if (CONFIG.SUPPORT_URL) { $('supportLink').href = CONFIG.SUPPORT_URL; $('supportLink').hidden = false; }
  if (CONFIG.BUG_URL) { $('bugLink').href = CONFIG.BUG_URL; $('bugLink').hidden = false; }

  function save(patch) {
    Object.keys(patch).forEach(function (k) { settings[k] = patch[k]; });
    render();
    return api.storage.sync.set(patch).catch(function (err) {
      showNote('Could not save: ' + (err && err.message ? err.message : err), true);
    });
  }

  // Small DOM helper (no innerHTML, so nothing can ever be injected).
  function el(tag, cls, children) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    (children || []).forEach(function (c) { n.appendChild(c); });
    return n;
  }

  function tickIcon() {
    var NS = 'http://www.w3.org/2000/svg';
    var svgEl = document.createElementNS(NS, 'svg');
    [['viewBox', '0 0 24 24'], ['width', '16'], ['height', '16'], ['fill', 'none'], ['stroke', 'currentColor'],
      ['stroke-width', '3'], ['stroke-linecap', 'round'], ['stroke-linejoin', 'round'], ['aria-hidden', 'true']]
      .forEach(function (a) { svgEl.setAttribute(a[0], a[1]); });
    var path = document.createElementNS(NS, 'path');
    path.setAttribute('d', 'M5 12.5l4.5 4.5L19 7.5');
    svgEl.appendChild(path);
    return svgEl;
  }

  /* ---------- Theme grid ---------- */

  function buildGrid() {
    var grid = $('grid');
    grid.textContent = '';
    TS.THEMES.forEach(function (t) {
      var d = DERIVED[t.id] || {};
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'tcard';
      btn.dataset.id = t.id;
      btn.setAttribute('aria-pressed', 'false');
      btn.setAttribute('aria-label', t.name + ' theme, ' + t.tag + (t.mode === 'light' ? ', light' : ''));
      var st = btn.style;
      st.setProperty('--t-bg', t.c.bg);
      st.setProperty('--t-inset', t.c.inset);
      st.setProperty('--t-border', t.c.border);
      st.setProperty('--t-text', d.text || t.c.text);
      st.setProperty('--t-muted', d.muted || t.c.muted);
      st.setProperty('--t-link', d.accent || t.c.accent);
      st.setProperty('--t-fill', d.fill || t.c.accentStrong);
      st.setProperty('--t-acc', d.popupAccent || t.c.accent);

      var mini = document.createElement('div');
      mini.className = 'mini' + (t.radius === 0 ? ' square' : '');
      mini.setAttribute('aria-hidden', 'true');
      var graph = el('div', 'mini-graph');
      [0, 2, 1, 3, 4, 1, 0, 2, 3, 2, 4, 1, 1, 3, 0, 4].forEach(function (lvl) {
        var cell = el('span');
        cell.style.background = t.graph[lvl];
        graph.appendChild(cell);
      });
      mini.appendChild(el('div', 'mini-bar', [el('i'), el('b')]));
      mini.appendChild(el('div', 'mini-body', [
        el('div', 'mini-lines', [el('span'), el('span'), el('span'), el('span', 'mini-btn')]),
        graph
      ]));

      var name = document.createElement('div');
      name.className = 'tname';
      var txt = document.createElement('div');
      txt.className = 'tname-text';
      var strong = document.createElement('strong');
      strong.textContent = t.name;
      var small = document.createElement('small');
      small.textContent = t.tag;
      txt.appendChild(strong);
      txt.appendChild(small);
      var tick = document.createElement('span');
      tick.className = 'tick';
      tick.appendChild(tickIcon());
      name.appendChild(txt);
      name.appendChild(tick);

      btn.appendChild(mini);
      btn.appendChild(name);
      btn.addEventListener('click', function () {
        save({ theme: t.id, lastTheme: t.id });
      });
      grid.appendChild(btn);
    });
  }

  /* ---------- Options ---------- */

  function buildOptions() {
    var box = $('options');
    box.textContent = '';
    OPTIONS.forEach(function (o) {
      var row = document.createElement('div');
      row.className = 'row';
      var id = 'opt-' + o.key;
      var labelWrap = document.createElement('div');
      var label = document.createElement('label');
      label.className = 'opt-label';
      label.htmlFor = id;
      label.textContent = o.label;
      var hint = document.createElement('span');
      hint.className = 'opt-hint';
      hint.id = id + '-hint';
      hint.textContent = o.hint;
      labelWrap.appendChild(label);
      labelWrap.appendChild(hint);
      var sw = document.createElement('button');
      sw.type = 'button';
      sw.className = 'switch';
      sw.id = id;
      sw.setAttribute('role', 'switch');
      sw.setAttribute('aria-describedby', hint.id);
      sw.appendChild(el('span', 'knob'));
      sw.addEventListener('click', function () {
        var on = !settings[o.key];
        var patch = {};
        patch[o.key] = on;
        // Shuffle starts tomorrow: stamp today so nothing changes right now.
        if (o.key === 'shuffle' && on) patch.shuffleDate = TS.localDateKey(new Date());
        save(patch);
      });
      row.appendChild(labelWrap);
      row.appendChild(sw);
      box.appendChild(row);
    });
  }

  /* ---------- Picture ---------- */

  function showNote(msg, isError) {
    var n = $('pictureNote');
    n.textContent = msg || '';
    n.classList.toggle('error', !!isError);
  }

  function dimToVisibility(dim) {
    return Math.round(((TS.DIM_MAX - dim) / (TS.DIM_MAX - TS.DIM_MIN)) * 100);
  }

  function visibilityToDim(v) {
    var dim = TS.DIM_MAX - (Number(v) / 100) * (TS.DIM_MAX - TS.DIM_MIN);
    return Math.round(dim * 1000) / 1000;
  }

  function pickFile() {
    if (isFirefox && !inTab) {
      // Firefox closes the popup when a file dialog opens, so pick in a tab.
      api.tabs.create({ url: api.runtime.getURL('popup/popup.html?tab=1&pick=1') });
      window.close();
      return;
    }
    $('file').value = '';
    $('file').click();
  }

  function loadImageElement(file) {
    return new Promise(function (resolve, reject) {
      var url = URL.createObjectURL(file);
      var img = new Image();
      img.onload = function () { resolve({ img: img, url: url }); };
      img.onerror = function () { URL.revokeObjectURL(url); reject(new Error('That file could not be opened as a picture.')); };
      img.src = url;
    });
  }

  // Shrink to at most 1920px on the long side and store as JPEG.
  function processFile(file) {
    if (!file) return Promise.resolve();
    if (!/^image\//.test(file.type)) { showNote('Please choose a PNG, JPG, WebP or GIF picture.', true); return Promise.resolve(); }
    if (file.size > 25 * 1024 * 1024) { showNote('That picture is over 25 MB. Please choose a smaller one.', true); return Promise.resolve(); }
    showNote('Preparing your picture...');
    return loadImageElement(file).then(function (res) {
      var img = res.img;
      var max = 1920;
      var scale = Math.min(1, max / Math.max(img.naturalWidth, img.naturalHeight));
      var w = Math.max(1, Math.round(img.naturalWidth * scale));
      var h = Math.max(1, Math.round(img.naturalHeight * scale));
      var canvas = document.createElement('canvas');
      canvas.width = w; canvas.height = h;
      var ctx = canvas.getContext('2d');
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, w, h);
      ctx.drawImage(img, 0, 0, w, h);
      URL.revokeObjectURL(res.url);
      var quality = 0.85;
      var data = canvas.toDataURL('image/jpeg', quality);
      while (data.length > 3 * 1024 * 1024 && quality > 0.4) {
        quality -= 0.15;
        data = canvas.toDataURL('image/jpeg', quality);
      }
      return api.storage.local.set({ userImage: data }).then(function () {
        hasImage = true;
        $('thumb').style.backgroundImage = 'url("' + data + '")';
        showNote('');
        return save({ image: true });
      });
    }).catch(function (err) {
      showNote(err && err.message ? err.message : 'Something went wrong with that picture.', true);
    });
  }

  function removePicture() {
    return api.storage.local.remove('userImage').then(function () {
      hasImage = false;
      $('thumb').style.backgroundImage = '';
      showNote('');
      return save({ image: false });
    });
  }

  /* ---------- Shortcuts ---------- */

  function openShortcutSettings() {
    if (api.commands && typeof api.commands.openShortcutSettings === 'function') {
      api.commands.openShortcutSettings();
    } else if (!isFirefox) {
      api.tabs.create({ url: 'chrome://extensions/shortcuts' });
    }
  }

  function renderKeys() {
    var box = $('keys');
    var mac = /Mac/i.test(navigator.platform || navigator.userAgent);
    var pretty = function (s) {
      if (!s) return '';
      return s.split('+').map(function (k) {
        if (mac && k === 'Alt') return '⌥';
        if (mac && k === 'Shift') return '⇧';
        if (mac && (k === 'Command' || k === 'MacCtrl')) return '⌘';
        return k;
      }).join(mac ? '' : '+');
    };
    var fill = function (cmds) {
      var map = {};
      (cmds || []).forEach(function (c) { map[c.name] = c.shortcut; });
      box.textContent = '';
      var add = function (shortcut, what) {
        if (box.childNodes.length) box.appendChild(document.createTextNode('  ·  '));
        var k = document.createElement('kbd');
        k.textContent = pretty(shortcut);
        box.appendChild(k);
        box.appendChild(document.createTextNode(' ' + what));
      };
      if (map['toggle-theme']) add(map['toggle-theme'], 'on/off');
      if (map['next-theme']) add(map['next-theme'], 'next');
      if (!box.childNodes.length) {
        // The browser skipped our suggested keys (already taken): let people pick their own.
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'linkish';
        b.textContent = 'Set keyboard shortcuts';
        b.addEventListener('click', openShortcutSettings);
        box.appendChild(b);
      }
    };
    try {
      var p = api.commands.getAll();
      if (p && p.then) p.then(fill).catch(function () { fill([]); });
    } catch (e) { fill([]); }
  }

  /* ---------- Render ---------- */

  function render() {
    var off = settings.theme === 'off';
    var active = TS.getTheme(off ? settings.lastTheme : settings.theme);
    var d = DERIVED[active.id] || {};
    var rootStyle = document.documentElement.style;
    rootStyle.setProperty('--acc', d.popupAccent || active.c.accent);
    rootStyle.setProperty('--acc-ink', d.popupAccentInk || '#0b1020');

    $('power').setAttribute('aria-checked', String(!off));
    $('power').setAttribute('aria-label', off ? 'Themes off. Turn on' : 'Themes on. Turn off');
    $('powerLabel').textContent = off ? 'Off' : 'On';
    $('currentName').textContent = off ? 'GitHub default look' : active.name;

    var grid = $('grid');
    grid.classList.toggle('is-off', off);
    Array.prototype.forEach.call(grid.children, function (btn) {
      btn.setAttribute('aria-pressed', String(!off && btn.dataset.id === settings.theme));
    });

    OPTIONS.forEach(function (o) {
      var sw = $('opt-' + o.key);
      sw.setAttribute('aria-checked', String(!!settings[o.key]));
      sw.disabled = off;
    });

    $('pictureEmpty').hidden = hasImage;
    $('pictureSet').hidden = !hasImage;
    $('useImage').setAttribute('aria-checked', String(!!settings.image));
    $('useImage').disabled = off;
    $('visibility').value = String(dimToVisibility(settings.dim));
    $('visibility').disabled = off || !settings.image;
    $('addPicture').disabled = off;
    $('changePicture').disabled = off;
    $('visibility').setAttribute('aria-valuetext', $('visibility').value + ' percent');
  }

  /* ---------- Wire up ---------- */

  $('power').addEventListener('click', function () {
    if (settings.theme === 'off') save({ theme: settings.lastTheme });
    else save({ theme: 'off', lastTheme: settings.theme });
  });
  $('addPicture').addEventListener('click', pickFile);
  $('changePicture').addEventListener('click', pickFile);
  $('removePicture').addEventListener('click', removePicture);
  $('file').addEventListener('change', function (e) { processFile(e.target.files && e.target.files[0]); });
  $('useImage').addEventListener('click', function () { save({ image: !settings.image }); });

  var dimTimer = null;
  $('visibility').addEventListener('input', function (e) {
    var dim = visibilityToDim(e.target.value);
    settings.dim = dim;
    e.target.setAttribute('aria-valuetext', e.target.value + ' percent');
    clearTimeout(dimTimer);
    // storage.sync has write quotas, so wait until the slider settles.
    dimTimer = setTimeout(function () { save({ dim: dim }); }, 250);
  });

  api.storage.onChanged.addListener(function (changes, area) {
    if (area !== 'sync') return;
    var patch = {};
    Object.keys(changes).forEach(function (k) { patch[k] = changes[k].newValue; });
    settings = TS.normalizeSettings(Object.assign({}, settings, patch));
    render();
  });

  buildGrid();
  buildOptions();
  renderKeys();

  Promise.all([api.storage.sync.get(null), api.storage.local.get('userImage')]).then(function (res) {
    settings = TS.normalizeSettings(res[0]);
    var img = res[1] && res[1].userImage;
    hasImage = !!img;
    if (img) $('thumb').style.backgroundImage = 'url("' + img + '")';
    render();
    var selected = document.querySelector('.tcard[aria-pressed="true"]');
    if (selected && selected.scrollIntoView) selected.scrollIntoView({ block: 'nearest' });
    if (inTab && /[?&]pick=1\b/.test(location.search)) showNote('Click "Add picture" to choose your file.');
  }).catch(function (err) {
    render();
    showNote('Could not load your settings: ' + (err && err.message ? err.message : err), true);
  });

  window.__hubskinsPopup = { processFile: processFile, settings: function () { return settings; } };
})();
