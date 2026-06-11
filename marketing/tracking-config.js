/** GA4 Measurement ID. Web stream: fix-tok web */
window.FIXTOK_TRACKING = {
  ga4Id: "G-S3FV6SKVV6",
  attributionDays: 90,
};

(function () {
  var id = (window.FIXTOK_TRACKING.ga4Id || "").trim();
  if (!id) return;

  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag ||
    function gtag() {
      window.dataLayer.push(arguments);
    };

  var s = document.createElement("script");
  s.async = true;
  s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(id);
  document.head.appendChild(s);

  gtag("js", new Date());
  var config = { send_page_view: true };
  if (location.search.indexOf("debug_mkt=1") !== -1) {
    config.debug_mode = true;
  }
  gtag("config", id, config);
  window.__FIXTOK_GA4_LOADED = true;
})();
