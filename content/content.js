/*
 * HubSkins content script. Runs at document_start on github.com.
 *
 * All the theme CSS is already on the page (styles/hubskins.css, injected by
 * the browser before anything paints). This script only flips attributes on
 * <html>, which is cheap and instant:
 *   data-ts-theme  theme id (absent = GitHub's own look)
 *   data-ts-mode   dark | light
 *   data-ts-graph / data-ts-scene / data-ts-fonts / data-ts-image  "on" when enabled
 *
 * To avoid a flash of GitHub's default colors, the last applied state is
 * mirrored in github.com's localStorage and applied synchronously first.
 */
(function () {
  'use strict';

  if (window.__hubskinsLoaded) return;
  window.__hubskinsLoaded = true;

  var api = typeof browser !== 'undefined' && browser.storage ? browser : chrome;
  var root = document.documentElement;
  var CACHE_KEY = 'hubskins:state';
  var ATTRS = ['data-ts-theme', 'data-ts-mode', 'data-ts-graph', 'data-ts-scene', 'data-ts-fonts', 'data-ts-image'];

  var current = null;      // state object we last applied
  var imageUrl = null;     // data: URL of the custom picture, if any
  var fontsInjected = false;

  function readCache() {
    try {
      var raw = window.localStorage.getItem(CACHE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }

  function writeCache(state) {
    try {
      if (state) window.localStorage.setItem(CACHE_KEY, JSON.stringify(state));
      else window.localStorage.removeItem(CACHE_KEY);
    } catch (e) { /* storage blocked: we just lose the no-flash shortcut */ }
  }

  // Settings -> the small state object the CSS cares about.
  function toState(settings, hasImage) {
    var TS = window.ThemeStudio;
    var s = TS ? TS.normalizeSettings(settings) : settings;
    if (!s || s.theme === 'off') return null;
    var theme = TS ? TS.getTheme(s.theme) : null;
    if (!theme) return null;
    return {
      theme: theme.id,
      mode: theme.mode,
      graph: !!s.graph,
      scene: !!s.scene,
      fonts: !!s.fonts,
      image: !!(s.image && hasImage),
      dim: s.dim
    };
  }

  function setAttr(name, on, value) {
    if (on) {
      if (root.getAttribute(name) !== value) root.setAttribute(name, value);
    } else if (root.hasAttribute(name)) {
      root.removeAttribute(name);
    }
  }

  function apply(state) {
    current = state;
    if (!state) {
      ATTRS.forEach(function (a) { setAttr(a, false); });
      root.style.removeProperty('--ts-user-image');
      root.style.removeProperty('--ts-dim');
      return;
    }
    // Mode before theme so the base palette never lags a frame behind.
    setAttr('data-ts-mode', true, state.mode);
    setAttr('data-ts-theme', true, state.theme);
    setAttr('data-ts-graph', state.graph, 'on');
    setAttr('data-ts-scene', state.scene, 'on');
    setAttr('data-ts-fonts', state.fonts, 'on');
    var showImage = state.image && !!imageUrl;
    if (showImage) {
      root.style.setProperty('--ts-user-image', 'url("' + imageUrl + '")');
      root.style.setProperty('--ts-dim', String(state.dim));
    } else {
      root.style.removeProperty('--ts-user-image');
      root.style.removeProperty('--ts-dim');
    }
    setAttr('data-ts-image', showImage, 'on');
    if (state.fonts) injectFonts();
  }

  // @font-face needs the extension's own URL, which differs per browser and
  // install, so it is written here rather than in the static stylesheet.
  function injectFonts() {
    if (fontsInjected || !window.ThemeStudio) return;
    var head = document.head || root;
    if (!head) return;
    fontsInjected = true;
    var css = '';
    window.ThemeStudio.THEMES.forEach(function (t) {
      if (!t.font) return;
      css += '@font-face{font-family:"HubSkins ' + t.font.family + '";src:url("' +
        api.runtime.getURL('fonts/' + t.font.file) + '") format("woff2");font-weight:' +
        t.font.weight + ';font-style:normal;font-display:swap;}';
    });
    var el = document.createElement('style');
    el.id = 'hubskins-fonts';
    el.textContent = css;
    head.appendChild(el);
  }

  // GitHub swaps pages with Turbo and can rewrite <html> attributes. Put ours back.
  var observer = new MutationObserver(function () {
    if (!current) return;
    if (root.getAttribute('data-ts-theme') !== current.theme ||
        root.getAttribute('data-ts-mode') !== current.mode) {
      apply(current);
    }
  });
  observer.observe(root, { attributes: true, attributeFilter: ['data-ts-theme', 'data-ts-mode'] });

  document.addEventListener('turbo:load', function () { if (current) apply(current); });
  document.addEventListener('DOMContentLoaded', function () {
    if (current && current.fonts && !fontsInjected) injectFonts();
  });

  // 1) Instant: last known state.
  var cached = readCache();
  if (cached && cached.theme) {
    cached.image = false; // the picture itself is not cached; it arrives in a moment
    apply(cached);
  }

  // 2) Authoritative: real settings from extension storage.
  function load() {
    return api.storage.sync.get(null).then(function (settings) {
      var s = window.ThemeStudio.normalizeSettings(settings);
      var wantsImage = s.image && s.theme !== 'off';
      var imgPromise = wantsImage
        ? api.storage.local.get('userImage').then(function (r) { return r && r.userImage ? r.userImage : null; })
        : Promise.resolve(null);
      return imgPromise.then(function (img) {
        imageUrl = img;
        var state = toState(s, !!img);
        apply(state);
        var cacheable = state ? Object.assign({}, state, { image: false }) : null;
        writeCache(cacheable);
      });
    }).catch(function (err) {
      // Extension was reloaded or storage failed: fall back to GitHub's look.
      if (String(err).indexOf('Extension context invalidated') === -1) {
        console.warn('[HubSkins] could not load settings', err);
      }
    });
  }

  load();

  api.storage.onChanged.addListener(function (changes, area) {
    if (area === 'sync' || (area === 'local' && changes.userImage)) load();
  });

  /* ---------- Little celebration when you star a repository ---------- */

  function isStarButton(btn) {
    if (!btn) return false;
    var form = btn.closest('form');
    if (form) {
      var action = form.getAttribute('action') || '';
      if (/\/star$/.test(action)) return true;
      if (/\/unstar$/.test(action)) return false;
    }
    var label = (btn.getAttribute('aria-label') || btn.textContent || '').trim();
    return /^star\b/i.test(label) && !/^starred\b/i.test(label);
  }

  function burst(x, y) {
    if (!document.body || !document.body.animate) return;
    var cs = getComputedStyle(root);
    var colors = ['--fgColor-accent', '--button-star-iconColor', '--fgColor-done', '--fgColor-success', '--fgColor-sponsors']
      .map(function (v) { return cs.getPropertyValue(v).trim(); })
      .filter(Boolean);
    if (!colors.length) colors = ['#ffd447'];
    var layer = document.createElement('div');
    layer.setAttribute('aria-hidden', 'true');
    layer.style.cssText = 'position:fixed;left:0;top:0;width:0;height:0;pointer-events:none;z-index:2147483647';
    document.body.appendChild(layer);
    var n = 16;
    for (var i = 0; i < n; i++) {
      var p = document.createElement('span');
      var size = 5 + Math.random() * 5;
      var radius = window.ThemeStudio && current && (current.theme === 'pixel' || current.theme === 'terminal') ? '0' : '50%';
      p.style.cssText = 'position:fixed;left:' + (x - size / 2) + 'px;top:' + (y - size / 2) + 'px;width:' + size +
        'px;height:' + size + 'px;border-radius:' + radius + ';background:' + colors[i % colors.length];
      layer.appendChild(p);
      var angle = (Math.PI * 2 * i) / n + Math.random() * 0.4;
      var dist = 36 + Math.random() * 42;
      p.animate([
        { transform: 'translate(0,0) scale(1)', opacity: 1 },
        { transform: 'translate(' + Math.cos(angle) * dist + 'px,' + (Math.sin(angle) * dist - 10) + 'px) scale(0.3)', opacity: 0 }
      ], { duration: 650 + Math.random() * 250, easing: 'cubic-bezier(.2,.7,.3,1)', fill: 'forwards' });
    }
    setTimeout(function () { layer.remove(); }, 1100);
  }

  document.addEventListener('click', function (e) {
    if (!current) return;
    var btn = e.target && e.target.closest ? e.target.closest('button') : null;
    if (!isStarButton(btn)) return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    api.storage.sync.get('fx').then(function (r) {
      if (r && r.fx === false) return;
      var rect = btn.getBoundingClientRect();
      burst(rect.left + Math.min(18, rect.width / 2), rect.top + rect.height / 2);
    }).catch(function () {});
  }, true);

  // Exposed for automated tests only (isolated world, not visible to GitHub).
  window.__hubskins = { apply: apply, load: load, isStarButton: isStarButton, state: function () { return current; } };
})();
