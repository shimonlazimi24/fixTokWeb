(function () {
  "use strict";

  var STORAGE_KEY = "fixtok_mkt_v1";
  var UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];
  var CLICK_IDS = ["gclid", "gbraid", "wbraid", "fbclid"];

  function cfg() {
    return window.FIXTOK_TRACKING || {};
  }

  function nowIso() {
    return new Date().toISOString();
  }

  function readStore() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function writeStore(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      /* private mode / quota */
    }
  }

  function parseFromSearch(search) {
    var params = new URLSearchParams(search || "");
    var utm = {};
    var clickIds = {};
    var dlm = [];
    var ref = null;
    var hasAny = false;

    UTM_KEYS.forEach(function (key) {
      var val = params.get(key);
      if (val) {
        utm[key.replace("utm_", "")] = val;
        hasAny = true;
      }
    });

    CLICK_IDS.forEach(function (key) {
      var val = params.get(key);
      if (val) {
        clickIds[key] = val;
        hasAny = true;
      }
    });

    if (params.get("ref")) {
      ref = params.get("ref");
      hasAny = true;
    }

    params.forEach(function (_val, key) {
      if (key === "dlm-wa" || key.indexOf("dlm-") === 0) {
        dlm.push(key === "dlm-wa" ? "wa" : key.slice(4));
        hasAny = true;
      }
    });

    if (!hasAny) return null;

    return {
      capturedAt: nowIso(),
      landingPage: location.pathname + location.search,
      utm: utm,
      clickIds: clickIds,
      dlm: dlm,
      ref: ref,
    };
  }

  function mergeAttribution(existing, incoming) {
    if (!existing) return incoming;
    return {
      capturedAt: existing.capturedAt,
      landingPage: existing.landingPage,
      utm: Object.assign({}, existing.utm, incoming.utm),
      clickIds: Object.assign({}, existing.clickIds, incoming.clickIds),
      dlm: existing.dlm.concat(incoming.dlm.filter(function (c) {
        return existing.dlm.indexOf(c) === -1;
      })),
      ref: incoming.ref || existing.ref,
    };
  }

  function captureAttribution() {
    var incoming = parseFromSearch(location.search);
    if (!incoming) return readStore();

    var existing = readStore();
    var merged = existing ? mergeAttribution(existing, incoming) : incoming;
    writeStore(merged);
    return merged;
  }

  function isExpired(store) {
    if (!store || !store.capturedAt) return true;
    var days = cfg().attributionDays || 90;
    var ageMs = Date.now() - new Date(store.capturedAt).getTime();
    return ageMs > days * 24 * 60 * 60 * 1000;
  }

  function getAttribution() {
    var store = readStore();
    if (store && isExpired(store)) {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (e) {
        /* ignore */
      }
      return null;
    }
    return store;
  }

  function dlmToUtmMedium(dlm) {
    if (!dlm || !dlm.length) return null;
    var map = { wa: "whatsapp", fb: "facebook", ig: "instagram", li: "linkedin", em: "email" };
    return map[dlm[0]] || "dlm-" + dlm[0];
  }

  function buildQueryFromAttribution(att) {
    if (!att) return "";
    var q = new URLSearchParams();

    Object.keys(att.utm || {}).forEach(function (key) {
      if (att.utm[key]) q.set("utm_" + key, att.utm[key]);
    });

    Object.keys(att.clickIds || {}).forEach(function (key) {
      if (att.clickIds[key]) q.set(key, att.clickIds[key]);
    });

    if (att.ref) q.set("ref", att.ref);

    if (att.dlm && att.dlm.length) {
      att.dlm.forEach(function (channel) {
        q.set("dlm-" + channel, "1");
      });
      if (!q.get("utm_medium")) {
        var medium = dlmToUtmMedium(att.dlm);
        if (medium) q.set("utm_medium", medium);
      }
      if (!q.get("utm_source")) q.set("utm_source", "fix-tok-landing");
    }

    var s = q.toString();
    return s ? "?" + s : "";
  }

  function decorateUrl(url) {
    try {
      var u = new URL(url, location.origin);
      if (u.hostname !== "app.fix-tok.com") return url;
      var extra = buildQueryFromAttribution(getAttribution());
      if (!extra) return url;
      var add = new URLSearchParams(extra.slice(1));
      add.forEach(function (val, key) {
        if (!u.searchParams.has(key)) u.searchParams.set(key, val);
      });
      return u.toString();
    } catch (e) {
      return url;
    }
  }

  function flatAttributionParams(att) {
    if (!att) return {};
    var out = {
      landing_page: att.landingPage || "",
      dlm_channels: (att.dlm || []).join(","),
    };
    Object.keys(att.utm || {}).forEach(function (k) {
      out["utm_" + k] = att.utm[k];
    });
    Object.keys(att.clickIds || {}).forEach(function (k) {
      out[k] = att.clickIds[k];
    });
    if (att.ref) out.ref = att.ref;
    return out;
  }

  var gaReady = false;

  function loadGa4(id) {
    if (!id || gaReady || window.__FIXTOK_GA4_LOADED) {
      gaReady = true;
      return;
    }
    gaReady = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () {
      window.dataLayer.push(arguments);
    };
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(id);
    document.head.appendChild(s);
    gtag("js", new Date());
    gtag("config", id, { send_page_view: true });
  }

  function trackEvent(name, params) {
    var id = (cfg().ga4Id || "").trim();
    if (!id || typeof window.gtag !== "function") return;
    gtag("event", name, params || {});
  }

  function initLinks() {
    document.querySelectorAll('a[href*="app.fix-tok.com"]').forEach(function (a) {
      var href = a.getAttribute("href");
      if (!href) return;
      a.setAttribute("href", decorateUrl(href));
      a.addEventListener("click", function () {
        var label = (a.textContent || "").trim().slice(0, 80);
        trackEvent("click_app_cta", Object.assign({ link_url: a.href, link_text: label }, flatAttributionParams(getAttribution())));
      });
    });

    document.querySelectorAll('a[href*="wa.me"]').forEach(function (a) {
      a.addEventListener("click", function () {
        trackEvent("click_whatsapp", Object.assign({ link_url: a.href }, flatAttributionParams(getAttribution())));
      });
    });

    document.querySelectorAll('a[href^="mailto:"]').forEach(function (a) {
      a.addEventListener("click", function () {
        trackEvent("click_email", Object.assign({ link_url: a.href }, flatAttributionParams(getAttribution())));
      });
    });
  }

  var captured = captureAttribution();
  var freshLanding = parseFromSearch(location.search);
  var gaId = (cfg().ga4Id || "").trim();

  if (gaId) {
    loadGa4(gaId);
    if (freshLanding) {
      trackEvent("campaign_landing", flatAttributionParams(freshLanding));
    }
  }

  if (location.search.indexOf("debug_mkt=1") !== -1) {
    console.info("[fixtok marketing]", { captured: captured, stored: getAttribution() });
  }

  window.FixTokMarketing = {
    getAttribution: getAttribution,
    decorateUrl: decorateUrl,
    buildQueryFromAttribution: buildQueryFromAttribution,
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initLinks);
  } else {
    initLinks();
  }
})();
