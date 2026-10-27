/*
 * Things you will want to change before publishing.
 * Leave a link empty ('') and its button is hidden.
 */
(function (root) {
  'use strict';
  var CONFIG = {
    NAME: 'HubSkins',
    TAGLINE: 'Themes for GitHub',
    // e.g. your Razorpay payment page or https://github.com/sponsors/<you>
    SUPPORT_URL: 'https://ko-fi.com/jaymaurya',
    // e.g. https://github.com/<you>/hubskins/issues/new or mailto:you@example.com
    BUG_URL: 'https://github.com/jay-m007/hubskins/issues/new',
    // Store review pages. Fill these in once each listing is live; the
    // welcome page shows a "rate us" button for the browser the person uses.
    RATE_CHROME_URL: '',   // https://chromewebstore.google.com/detail/<id>/reviews
    RATE_EDGE_URL: '',     // https://microsoftedge.microsoft.com/addons/detail/<id>
    RATE_FIREFOX_URL: '',  // https://addons.mozilla.org/firefox/addon/<slug>/reviews/
    // Store listing pages, used by the landing page (site/index.html).
    STORE_CHROME_URL: '',  // https://chromewebstore.google.com/detail/<id>
    STORE_EDGE_URL: '',    // https://microsoftedge.microsoft.com/addons/detail/<id>
    STORE_FIREFOX_URL: '', // https://addons.mozilla.org/firefox/addon/<slug>/
    // Shown in the privacy policy on the landing page. Leave empty to hide.
    CONTACT_EMAIL: 'rayques67@gmail.com'
  };
  root.HubSkinsConfig = CONFIG;
  if (typeof module !== 'undefined' && module.exports) module.exports = CONFIG;
})(typeof globalThis !== 'undefined' ? globalThis : this);
