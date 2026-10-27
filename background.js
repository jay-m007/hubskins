/*
 * HubSkins background: keyboard shortcuts, daily shuffle and first-run setup.
 * Chrome runs this as a service worker; Firefox loads it after shared/themes.js.
 */
/* global importScripts */
if (typeof importScripts === 'function' && typeof self !== 'undefined' && !self.ThemeStudio) {
  importScripts('shared/themes.js');
}

(function () {
  'use strict';

  var api = typeof browser !== 'undefined' && browser.storage ? browser : chrome;
  var TS = (typeof self !== 'undefined' ? self : globalThis).ThemeStudio;
  var ALARM = 'hubskins-shuffle';

  function getSettings() {
    return api.storage.sync.get(null).then(TS.normalizeSettings);
  }

  function save(patch) {
    return api.storage.sync.set(patch);
  }

  function runShuffle() {
    return getSettings().then(function (s) {
      var patch = TS.shufflePatch(s, new Date());
      return patch ? save(patch) : null;
    });
  }

  function handleCommand(command) {
    return getSettings().then(function (s) {
      if (command === 'toggle-theme') {
        if (s.theme === 'off') return save({ theme: s.lastTheme });
        return save({ theme: 'off', lastTheme: s.theme });
      }
      if (command === 'next-theme') {
        var from = s.theme === 'off' ? s.lastTheme : s.theme;
        var id = TS.nextThemeId(from, 1);
        return save({ theme: id, lastTheme: id });
      }
      return null;
    });
  }

  function ensureAlarm() {
    return api.alarms.get(ALARM).then(function (a) {
      if (!a) api.alarms.create(ALARM, { periodInMinutes: 30, delayInMinutes: 1 });
    });
  }

  api.runtime.onInstalled.addListener(function (details) {
    // Fill in any missing settings without touching ones the user already has.
    getSettings().then(function (s) { return save(s); }).then(ensureAlarm).then(runShuffle);
    // Say hello once, on a brand-new install only (never on updates).
    if (details && details.reason === 'install') {
      api.tabs.create({ url: api.runtime.getURL('welcome/welcome.html') });
    }
  });

  api.runtime.onStartup.addListener(function () {
    ensureAlarm().then(runShuffle);
  });

  api.alarms.onAlarm.addListener(function (alarm) {
    if (alarm.name === ALARM) runShuffle();
  });

  api.commands.onCommand.addListener(function (command) { handleCommand(command); });

  // The popup stamps today's date when shuffle is switched on, so the first
  // new theme arrives tomorrow; we only need to be sure the alarm exists.
  api.storage.onChanged.addListener(function (changes, area) {
    if (area === 'sync' && changes.shuffle && changes.shuffle.newValue === true) ensureAlarm();
  });

  // For automated tests.
  var g = typeof self !== 'undefined' ? self : globalThis;
  g.__hubskinsBg = { handleCommand: handleCommand, runShuffle: runShuffle };
})();
