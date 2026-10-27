/*
 * Theme Studio for GitHub: theme definitions.
 * Shared by the popup, the background worker and the build script.
 * Classic script (no modules) so it loads everywhere: popup <script>, Chrome
 * service worker importScripts(), Firefox background scripts and Node require().
 */
(function (root) {
  'use strict';

  var THEMES = [
    {
      id: 'midnight', name: 'Midnight Glass', tag: 'Deep indigo glow', mode: 'dark',
      font: null,
      c: { bg: '#0b1020', inset: '#070a16', surface: '#121831', raised: '#1a2140', border: '#2a3358',
        text: '#e8ecff', muted: '#a3acd6', accent: '#8fa8ff', accentStrong: '#6f8dff',
        success: '#5ee0a0', danger: '#ff7a8a', attention: '#f5c76a', done: '#c3a1ff', severe: '#ff9e6a', sponsors: '#ff8fcf' },
      syntax: { keyword: '#c3a1ff', string: '#8fe3c8', constant: '#8fb8ff', entity: '#f5c76a', tag: '#ff9eb5', variable: '#ffb38a', comment: '#8a94c2' },
      graph: ['#161d38', '#2b3f8f', '#4462d6', '#7c9cff', '#c9d6ff'],
      scene: 'radial-gradient(900px 500px at 85% -10%, rgba(111,141,255,0.28), transparent 70%), radial-gradient(700px 420px at 0% 110%, rgba(176,130,255,0.20), transparent 70%)'
    },
    {
      id: 'neon', name: 'Neon Tokyo', tag: 'Cyberpunk pink + cyan', mode: 'dark',
      font: { family: 'Space Grotesk', file: 'space-grotesk-latin-700-normal.woff2', weight: 700, spacing: '0.01em' },
      c: { bg: '#0a0814', inset: '#05040b', surface: '#141026', raised: '#1d1735', border: '#3b2461',
        text: '#f6edff', muted: '#bfa6dd', accent: '#3be8ff', accentStrong: '#ff2e97',
        success: '#3dffb0', danger: '#ff5c7a', attention: '#ffe14d', done: '#c58bff', severe: '#ff9248', sponsors: '#ff6ec7' },
      syntax: { keyword: '#ff5cad', string: '#3be8ff', constant: '#c58bff', entity: '#ffe14d', tag: '#3dffb0', variable: '#ff9248', comment: '#9a86bb' },
      graph: ['#1a1330', '#5b1a8f', '#b0207a', '#ff2e97', '#3be8ff'],
      scene: 'linear-gradient(115deg, rgba(255,46,151,0.20) 0%, transparent 40%), linear-gradient(295deg, rgba(59,232,255,0.16) 0%, transparent 45%), repeating-linear-gradient(0deg, rgba(255,255,255,0.025) 0 1px, transparent 1px 4px)'
    },
    {
      id: 'sakura', name: 'Sakura Night', tag: 'Petals over plum', mode: 'dark',
      font: { family: 'Nunito', file: 'nunito-latin-800-normal.woff2', weight: 800, spacing: '0' },
      c: { bg: '#1a1220', inset: '#120c17', surface: '#24192d', raised: '#2e2139', border: '#4a3358',
        text: '#fdeef4', muted: '#d9b3c7', accent: '#ffa8cb', accentStrong: '#ff8fbd',
        success: '#8fe8b4', danger: '#ff8080', attention: '#ffd48a', done: '#d2b0ff', severe: '#ffab80', sponsors: '#ff9ed8' },
      syntax: { keyword: '#ff9ec4', string: '#a8e6cf', constant: '#c9a7ff', entity: '#ffd48a', tag: '#ffb3c9', variable: '#ffc09f', comment: '#a98ba0' },
      graph: ['#2a1d33', '#6b3a5c', '#b5628d', '#ff9ec4', '#ffe0ec'],
      scene: 'radial-gradient(9px 6px at 30px 40px, rgba(255,170,205,0.45), transparent 70%) 0 0 / 260px 220px, radial-gradient(7px 5px at 170px 120px, rgba(255,214,231,0.40), transparent 70%) 0 0 / 260px 220px, radial-gradient(11px 7px at 90px 190px, rgba(255,170,205,0.35), transparent 70%) 0 0 / 260px 220px, radial-gradient(6px 4px at 220px 30px, rgba(255,214,231,0.35), transparent 70%) 0 0 / 260px 220px, radial-gradient(1000px 520px at 50% -20%, rgba(150,80,140,0.35), transparent 70%)'
    },
    {
      id: 'pixel', name: 'Pixel Quest', tag: '8-bit adventure', mode: 'dark',
      font: { family: 'Press Start 2P', file: 'press-start-2p-latin-400-normal.woff2', weight: 400, spacing: '0', scale: 0.62, lineHeight: 1.6 },
      c: { bg: '#15122b', inset: '#0d0b1c', surface: '#1e1a3d', raised: '#29234f', border: '#463c80',
        text: '#f4f0ff', muted: '#b6addf', accent: '#ffd447', accentStrong: '#ffd447',
        success: '#7dff6b', danger: '#ff6b6b', attention: '#ffd447', done: '#c49bff', severe: '#ff9f43', sponsors: '#ff7ac8' },
      syntax: { keyword: '#ff6b9d', string: '#7dff6b', constant: '#6bd6ff', entity: '#ffd447', tag: '#ff9f43', variable: '#c49bff', comment: '#8f87b8' },
      graph: ['#221d45', '#3d2f8f', '#7a3fd1', '#ff6b9d', '#ffd447'],
      radius: 0,
      scene: 'repeating-linear-gradient(90deg, rgba(255,212,71,0.035) 0 8px, transparent 8px 16px), repeating-linear-gradient(0deg, rgba(255,212,71,0.035) 0 8px, transparent 8px 16px), linear-gradient(180deg, rgba(70,60,128,0.45), transparent 420px)'
    },
    {
      id: 'paper', name: 'Vintage Paper', tag: 'Warm light sepia', mode: 'light',
      font: { family: 'Lora', file: 'lora-latin-700-normal.woff2', weight: 700, spacing: '0' },
      c: { bg: '#f3ead6', inset: '#e9dcc0', surface: '#ece0c6', raised: '#f8f1e2', border: '#cdb98f',
        text: '#2e2415', muted: '#665538', accent: '#8a3f12', accentStrong: '#8a4b1f',
        success: '#2f6b3a', danger: '#a32a1f', attention: '#7a5a00', done: '#6a3d8a', severe: '#9a4a10', sponsors: '#9c2f6a' },
      syntax: { keyword: '#9a2f1a', string: '#2f5f45', constant: '#2a4f80', entity: '#6a3d8a', tag: '#7a4a10', variable: '#8a4b1f', comment: '#6f6148' },
      graph: ['#e6d9b8', '#d5b87a', '#c08a3e', '#9a5a22', '#5c2f10'],
      scene: 'radial-gradient(900px 420px at 80% -15%, rgba(138,75,31,0.14), transparent 70%), repeating-linear-gradient(0deg, rgba(120,90,40,0.035) 0 2px, transparent 2px 5px)'
    },
    {
      id: 'crimson', name: 'Crimson Web', tag: 'Black, red + blue', mode: 'dark',
      font: { family: 'Barlow Condensed', file: 'barlow-condensed-latin-700-normal.woff2', weight: 700, spacing: '0.03em', scale: 1.12 },
      c: { bg: '#0a0a0c', inset: '#050506', surface: '#141418', raised: '#1c1c22', border: '#2e2e36',
        text: '#f3f3f5', muted: '#ababb6', accent: '#ff6168', accentStrong: '#ff3b42',
        success: '#4fd98b', danger: '#ff6168', attention: '#ffc94d', done: '#a5a8ff', severe: '#ff8f4d', sponsors: '#ff7ab8' },
      syntax: { keyword: '#ff6168', string: '#7fb2ff', constant: '#5ea0ff', entity: '#ffc94d', tag: '#ff8f8f', variable: '#ffa56b', comment: '#8c8c99' },
      graph: ['#1c1c22', '#5c1519', '#9c1c22', '#e5262d', '#ff9a9e'],
      scene: 'repeating-conic-gradient(from 0deg at 100% 0%, rgba(229,38,45,0.07) 0deg 2deg, transparent 2deg 15deg), radial-gradient(700px 420px at 100% 0%, rgba(229,38,45,0.16), transparent 70%), radial-gradient(600px 400px at 0% 100%, rgba(47,107,255,0.12), transparent 70%)'
    },
    {
      id: 'aurora', name: 'Aurora', tag: 'Northern lights', mode: 'dark',
      font: { family: 'Quicksand', file: 'quicksand-latin-700-normal.woff2', weight: 700, spacing: '0' },
      c: { bg: '#081418', inset: '#040c0f', surface: '#0f1f25', raised: '#162a31', border: '#24434c',
        text: '#e6fbf6', muted: '#9fc9c0', accent: '#5ff5c8', accentStrong: '#3fe0b0',
        success: '#5ff5c8', danger: '#ff7a90', attention: '#ffe27a', done: '#b79bff', severe: '#ffa56b', sponsors: '#ff9ad5' },
      syntax: { keyword: '#b79bff', string: '#5ff5c8', constant: '#7ad3ff', entity: '#ffe27a', tag: '#8affd9', variable: '#ffb88a', comment: '#7fa39c' },
      graph: ['#11242a', '#165a5a', '#1f9a86', '#3fe0b0', '#b5ffe9'],
      scene: 'radial-gradient(1100px 380px at 30% -12%, rgba(63,224,176,0.22), transparent 70%), radial-gradient(900px 360px at 80% -8%, rgba(150,110,255,0.20), transparent 70%), radial-gradient(800px 300px at 55% -18%, rgba(120,220,255,0.14), transparent 70%)'
    },
    {
      id: 'synthwave', name: 'Synthwave Sunset', tag: 'Retro 80s grid', mode: 'dark',
      font: { family: 'Orbitron', file: 'orbitron-latin-700-normal.woff2', weight: 700, spacing: '0.04em', scale: 0.86 },
      c: { bg: '#1a0f2e', inset: '#110920', surface: '#22153b', raised: '#2c1c4a', border: '#4b2f78',
        text: '#fff0f8', muted: '#d0aee0', accent: '#ff9a5c', accentStrong: '#ff7a3d',
        success: '#5cffc0', danger: '#ff5c8a', attention: '#ffe066', done: '#c89cff', severe: '#ff9a5c', sponsors: '#ff6ec7' },
      syntax: { keyword: '#ff6ec7', string: '#ffe066', constant: '#6be4ff', entity: '#ff9a5c', tag: '#5cffc0', variable: '#c89cff', comment: '#a38bbd' },
      graph: ['#2a1a47', '#6a2a8f', '#c23a8f', '#ff7a3d', '#ffe066'],
      scene: 'linear-gradient(180deg, rgba(255,110,199,0.18) 0%, rgba(255,122,61,0.10) 220px, transparent 420px), linear-gradient(0deg, rgba(255,110,199,0.10) 0 1px, transparent 1px) 0 100% / 100% 48px, linear-gradient(90deg, rgba(255,110,199,0.07) 0 1px, transparent 1px) 0 0 / 64px 100%'
    },
    {
      id: 'ocean', name: 'Deep Ocean', tag: 'Abyssal blue', mode: 'dark',
      font: { family: 'Outfit', file: 'outfit-latin-700-normal.woff2', weight: 700, spacing: '0' },
      c: { bg: '#061423', inset: '#030c16', surface: '#0b1d31', raised: '#11273f', border: '#1d3d5e',
        text: '#e4f3ff', muted: '#97b8d4', accent: '#4fd1ff', accentStrong: '#2bb4f0',
        success: '#4ee3b0', danger: '#ff7a85', attention: '#ffd166', done: '#a99bff', severe: '#ff9f6b', sponsors: '#ff8fc8' },
      syntax: { keyword: '#7aa8ff', string: '#4ee3b0', constant: '#4fd1ff', entity: '#ffd166', tag: '#80e8ff', variable: '#ffab85', comment: '#7795b0' },
      graph: ['#0e2238', '#0f4c75', '#1780b0', '#2bb4f0', '#a8ecff'],
      scene: 'radial-gradient(1000px 500px at 50% -25%, rgba(43,180,240,0.22), transparent 70%), radial-gradient(600px 300px at 10% 110%, rgba(78,227,176,0.10), transparent 70%)'
    },
    {
      id: 'forest', name: 'Forest Moss', tag: 'Earthy greens', mode: 'dark',
      font: { family: 'Josefin Sans', file: 'josefin-sans-latin-700-normal.woff2', weight: 700, spacing: '0.01em' },
      c: { bg: '#0f1a12', inset: '#09110b', surface: '#16241a', raised: '#1d2f22', border: '#30483a',
        text: '#ecf5e6', muted: '#adc4a6', accent: '#a6e07a', accentStrong: '#8ccf5f',
        success: '#a6e07a', danger: '#ff8a7a', attention: '#f0d070', done: '#c0a8f0', severe: '#f0a060', sponsors: '#f09ac8' },
      syntax: { keyword: '#e0a070', string: '#a6e07a', constant: '#8ac8e0', entity: '#f0d070', tag: '#c8e07a', variable: '#e0b8a0', comment: '#86a083' },
      graph: ['#1a2a1e', '#2e5a32', '#4d8a44', '#8ccf5f', '#dcf5b5'],
      scene: 'radial-gradient(900px 460px at 15% -15%, rgba(140,207,95,0.16), transparent 70%), radial-gradient(700px 400px at 100% 110%, rgba(240,208,112,0.08), transparent 70%)'
    },
    {
      id: 'mocha', name: 'Mocha Latte', tag: 'Cozy coffee brown', mode: 'dark',
      font: { family: 'DM Serif Display', file: 'dm-serif-display-latin-400-normal.woff2', weight: 400, spacing: '0.01em', scale: 1.06 },
      c: { bg: '#1c1512', inset: '#130e0c', surface: '#251c18', raised: '#30251f', border: '#4a3a30',
        text: '#f7ece3', muted: '#cdb6a3', accent: '#f0b88a', accentStrong: '#e0a070',
        success: '#a8d8a0', danger: '#f08a80', attention: '#f0cc80', done: '#d0b0e8', severe: '#f0a070', sponsors: '#f0a0c8' },
      syntax: { keyword: '#f09a80', string: '#b8d89a', constant: '#a8c8e8', entity: '#f0cc80', tag: '#e8b890', variable: '#e0b0d0', comment: '#9a8576' },
      graph: ['#2a201b', '#5a3a28', '#8a5a3a', '#c88a5a', '#f0c8a0'],
      scene: 'radial-gradient(900px 480px at 85% -20%, rgba(224,160,112,0.16), transparent 70%)'
    },
    {
      id: 'arctic', name: 'Arctic Frost', tag: 'Crisp icy light', mode: 'light',
      font: { family: 'Manrope', file: 'manrope-latin-800-normal.woff2', weight: 800, spacing: '-0.01em' },
      c: { bg: '#f4f8fc', inset: '#e8f0f8', surface: '#eaf2fa', raised: '#ffffff', border: '#c8d8e8',
        text: '#14263a', muted: '#4a627a', accent: '#0a64b8', accentStrong: '#0b6ccc',
        success: '#0f7a4a', danger: '#c2263a', attention: '#7a5500', done: '#6b3fc0', severe: '#a84a10', sponsors: '#b02a78' },
      syntax: { keyword: '#b0306a', string: '#0f6a50', constant: '#0a5aa8', entity: '#6b3fc0', tag: '#0f6a7a', variable: '#a84a10', comment: '#5c7088' },
      graph: ['#e2ecf6', '#a8d0f0', '#5aa8e8', '#1a78d0', '#0a4a8a'],
      scene: 'radial-gradient(1000px 440px at 80% -20%, rgba(11,108,204,0.10), transparent 70%), radial-gradient(700px 360px at 0% 110%, rgba(120,200,255,0.12), transparent 70%)'
    },
    {
      id: 'terminal', name: 'Terminal Green', tag: 'Phosphor CRT hacker', mode: 'dark',
      font: { family: 'VT323', file: 'vt323-latin-400-normal.woff2', weight: 400, spacing: '0.02em', scale: 1.3 },
      c: { bg: '#050a06', inset: '#020402', surface: '#0a140c', raised: '#0f1d12', border: '#1d3a22',
        text: '#c8ffd0', muted: '#7fc48a', accent: '#39ff6a', accentStrong: '#2ee05a',
        success: '#39ff6a', danger: '#ff6b5a', attention: '#e8ff5a', done: '#7affd8', severe: '#ffb05a', sponsors: '#ff8ad0' },
      syntax: { keyword: '#e8ff5a', string: '#39ff6a', constant: '#7affd8', entity: '#b8ff8a', tag: '#5affb0', variable: '#ffd05a', comment: '#5f9a68' },
      graph: ['#0a160c', '#0f4a1c', '#18802e', '#2ee05a', '#b8ffc8'],
      radius: 2,
      scene: 'repeating-linear-gradient(0deg, rgba(57,255,106,0.035) 0 1px, transparent 1px 3px), radial-gradient(1000px 600px at 50% 0%, rgba(46,224,90,0.10), transparent 70%)'
    },
    {
      id: 'royal', name: 'Royal Gold', tag: 'Black + gold luxury', mode: 'dark',
      font: { family: 'Cinzel', file: 'cinzel-latin-700-normal.woff2', weight: 700, spacing: '0.04em', scale: 0.95 },
      c: { bg: '#0c0b09', inset: '#060504', surface: '#16140f', raised: '#1f1c15', border: '#3a3222',
        text: '#f5efe0', muted: '#c4b694', accent: '#e8c25a', accentStrong: '#d4a83a',
        success: '#9ed98a', danger: '#f08a7a', attention: '#e8c25a', done: '#c8a8f0', severe: '#f0a060', sponsors: '#f0a0c0' },
      syntax: { keyword: '#e8c25a', string: '#b8d89a', constant: '#a8c0e8', entity: '#f0d890', tag: '#e8a870', variable: '#d8b0e0', comment: '#8f8670' },
      graph: ['#1a1812', '#4a3c18', '#8a6a20', '#d4a83a', '#f8e4a8'],
      scene: 'radial-gradient(900px 480px at 50% -25%, rgba(212,168,58,0.16), transparent 70%), repeating-linear-gradient(45deg, rgba(212,168,58,0.025) 0 1px, transparent 1px 22px)'
    },
    {
      id: 'lavender', name: 'Lavender Haze', tag: 'Soft dreamy light', mode: 'light',
      font: { family: 'Poppins', file: 'poppins-latin-700-normal.woff2', weight: 700, spacing: '-0.01em' },
      c: { bg: '#f7f3fd', inset: '#ede6f8', surface: '#efe8fa', raised: '#ffffff', border: '#d6c8ee',
        text: '#24183a', muted: '#5c4a7a', accent: '#6a3fc8', accentStrong: '#7446d6',
        success: '#1a7a4a', danger: '#b8264a', attention: '#7a5800', done: '#8a2fb0', severe: '#a8481a', sponsors: '#b02a80' },
      syntax: { keyword: '#a8287a', string: '#1a6a5a', constant: '#3a4ab8', entity: '#7446d6', tag: '#1a6a7a', variable: '#a8481a', comment: '#6e6488' },
      graph: ['#ebe3f7', '#cdb8f0', '#a888e8', '#7446d6', '#45208a'],
      scene: 'radial-gradient(900px 460px at 90% -20%, rgba(116,70,214,0.12), transparent 70%), radial-gradient(700px 380px at 0% 110%, rgba(255,150,210,0.12), transparent 70%)'
    },
    {
      id: 'graphite', name: 'Graphite', tag: 'Calm minimal + orange', mode: 'dark',
      font: null,
      c: { bg: '#141415', inset: '#0d0d0e', surface: '#1b1b1d', raised: '#232326', border: '#333337',
        text: '#ececee', muted: '#a6a6ad', accent: '#ff9a4d', accentStrong: '#f08a3a',
        success: '#6fd38f', danger: '#ff7a70', attention: '#f0c050', done: '#b8a0f0', severe: '#ff9a4d', sponsors: '#f090c0' },
      syntax: { keyword: '#ff9a4d', string: '#9fd49a', constant: '#8ab8f0', entity: '#f0c050', tag: '#f0a8a0', variable: '#d0a8e8', comment: '#85858d' },
      graph: ['#202023', '#4a3220', '#8a5428', '#f08a3a', '#ffd0a8'],
      scene: 'radial-gradient(900px 400px at 100% -20%, rgba(240,138,58,0.08), transparent 70%)'
    }
  ];

  var DEFAULT_SETTINGS = {
    theme: 'midnight',   // theme id, or 'off'
    lastTheme: 'midnight', // remembered so the toggle shortcut can turn it back on
    graph: true,         // theme the contribution graph
    scene: true,         // decorative background scene
    fonts: true,         // themed heading fonts
    fx: true,            // little celebrations (star burst)
    shuffle: false,      // pick a new theme every day
    shuffleDate: '',     // YYYY-MM-DD of the last shuffle
    image: false,        // use the custom background picture
    dim: 0.8             // how much the theme color covers the custom picture
  };

  var DIM_MIN = 0.7;
  var DIM_MAX = 0.95;

  function getTheme(id) {
    for (var i = 0; i < THEMES.length; i++) if (THEMES[i].id === id) return THEMES[i];
    return null;
  }

  function normalizeSettings(raw) {
    var s = {};
    var src = raw && typeof raw === 'object' ? raw : {};
    for (var k in DEFAULT_SETTINGS) s[k] = (k in src) ? src[k] : DEFAULT_SETTINGS[k];
    if (s.theme !== 'off' && !getTheme(s.theme)) s.theme = DEFAULT_SETTINGS.theme;
    if (!getTheme(s.lastTheme)) s.lastTheme = s.theme !== 'off' ? s.theme : DEFAULT_SETTINGS.theme;
    ['graph', 'scene', 'fonts', 'fx', 'shuffle', 'image'].forEach(function (k2) { s[k2] = !!s[k2]; });
    var d = Number(s.dim);
    if (!isFinite(d)) d = DEFAULT_SETTINGS.dim;
    s.dim = Math.min(DIM_MAX, Math.max(DIM_MIN, d));
    if (typeof s.shuffleDate !== 'string') s.shuffleDate = '';
    return s;
  }

  function nextThemeId(currentId, step) {
    var n = THEMES.length;
    var idx = -1;
    for (var i = 0; i < n; i++) if (THEMES[i].id === currentId) idx = i;
    if (idx === -1) return THEMES[0].id;
    return THEMES[((idx + (step || 1)) % n + n) % n].id;
  }

  function randomThemeId(exceptId, rand) {
    var r = typeof rand === 'function' ? rand : Math.random;
    var pool = THEMES.filter(function (t) { return t.id !== exceptId; });
    var pick = Math.floor(r() * pool.length);
    if (pick >= pool.length) pick = pool.length - 1;
    return pool[pick].id;
  }

  function localDateKey(date) {
    var d = date || new Date();
    var m = String(d.getMonth() + 1); if (m.length < 2) m = '0' + m;
    var day = String(d.getDate()); if (day.length < 2) day = '0' + day;
    return d.getFullYear() + '-' + m + '-' + day;
  }

  // Returns the settings patch to apply for a daily shuffle, or null if none is due.
  function shufflePatch(settings, date, rand) {
    var s = normalizeSettings(settings);
    if (!s.shuffle) return null;
    var today = localDateKey(date);
    if (s.shuffleDate === today) return null;
    var base = s.theme === 'off' ? s.lastTheme : s.theme;
    var id = randomThemeId(base, rand);
    var patch = { shuffleDate: today };
    if (s.theme !== 'off') { patch.theme = id; patch.lastTheme = id; }
    return patch;
  }

  var api = {
    THEMES: THEMES,
    DEFAULT_SETTINGS: DEFAULT_SETTINGS,
    DIM_MIN: DIM_MIN,
    DIM_MAX: DIM_MAX,
    getTheme: getTheme,
    normalizeSettings: normalizeSettings,
    nextThemeId: nextThemeId,
    randomThemeId: randomThemeId,
    localDateKey: localDateKey,
    shufflePatch: shufflePatch
  };

  root.ThemeStudio = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
