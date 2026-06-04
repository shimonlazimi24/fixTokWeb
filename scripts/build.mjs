#!/usr/bin/env node
import { writeFileSync, mkdirSync, cpSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { copy } from "../content/copy.he.mjs";
import { APP_LINKS, SITE_ORIGIN, SUPPORT_EMAIL, SUPPORT_WHATSAPP_HREF } from "../content/links.mjs";
import {
  SEO,
  organizationJsonLd,
  webSiteJsonLd,
  serviceJsonLd,
  faqPageJsonLd,
} from "../content/seo.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function jsonLdScript(obj) {
  return `<script type="application/ld+json">${JSON.stringify(obj)}</script>`;
}

function headBlock({ title, description, canonical }) {
  const ld = [
    organizationJsonLd(),
    webSiteJsonLd(),
    serviceJsonLd(),
    faqPageJsonLd(copy.faq),
  ]
    .map(jsonLdScript)
    .join("\n    ");

  return `<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}" />
  <meta name="keywords" content="${esc(SEO.keywords)}" />
  <link rel="canonical" href="${esc(canonical)}" />
  <meta name="theme-color" content="${SEO.themeColor}" />
  <meta property="og:type" content="website" />
  <meta property="og:locale" content="${SEO.locale}" />
  <meta property="og:site_name" content="${esc(SEO.siteName)}" />
  <meta property="og:title" content="${esc(title)}" />
  <meta property="og:description" content="${esc(description)}" />
  <meta property="og:url" content="${esc(canonical)}" />
  <meta property="og:image" content="${esc(SEO.ogImage)}" />
  <meta name="twitter:card" content="${SEO.twitterCard}" />
  <meta name="twitter:title" content="${esc(title)}" />
  <meta name="twitter:description" content="${esc(description)}" />
  <meta name="twitter:image" content="${esc(SEO.ogImage)}" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Heebo:wght@400;600;800;900&display=swap" rel="stylesheet" />
  <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined" rel="stylesheet" />
  <link rel="stylesheet" href="/styles/landing.css" />
  <link rel="icon" href="/assets/images/logo-mark.svg" type="image/svg+xml" sizes="any" />
    ${ld}
</head>`;
}

function icon(name) {
  return `<span class="material-icons-outlined" aria-hidden="true">${name}</span>`;
}

function navHtml() {
  const items = copy.nav
    .map((n) => `<a href="/#${n.id}">${esc(n.label)}</a>`)
    .join("\n          ");
  return `<header class="site-header" id="top">
    <div class="container header-inner">
      <a class="brand" href="/" aria-label="FixTok דף הבית">
        <span class="brand-wordmark" dir="ltr" lang="en">Fix<span class="brand-tok">Tok</span></span>
      </a>
      <nav class="site-nav" aria-label="ניווט ראשי">
        ${items}
        <a class="nav-contact" href="/contact.html">צור קשר</a>
      </nav>
      <a class="btn btn-primary btn-header" href="${APP_LINKS.clientStart}">${esc(copy.headerCta)}</a>
    </div>
    <nav class="site-nav-mobile container" aria-label="ניווט מהיר">
      ${items}
      <a href="/contact.html">צור קשר</a>
    </nav>
  </header>`;
}

function footerHtml() {
  return `<footer class="site-footer">
    <div class="container footer-grid">
      <div>
        <p class="footer-brand"><span class="brand-wordmark brand-wordmark--footer" dir="ltr" lang="en">Fix<span class="brand-tok">Tok</span></span></p>
        <p class="footer-tagline">${esc(copy.footer.tagline)}</p>
      </div>
      <nav aria-label="קישורים משפטיים">
        <a href="${APP_LINKS.terms}">תנאי שימוש</a>
        <a href="${APP_LINKS.termsContractor}">תנאי קבלנים</a>
        <a href="${APP_LINKS.privacy}">מדיניות פרטיות</a>
        <a href="/contact.html">צור קשר</a>
      </nav>
      <div class="footer-cta">
        <a class="btn btn-primary" href="${APP_LINKS.clientStart}">${esc(copy.cta.client)}</a>
        <a class="btn btn-ghost" href="${APP_LINKS.contractorLanding}">${esc(copy.cta.contractor)}</a>
      </div>
    </div>
    <p class="footer-copy container">© ${new Date().getFullYear()} FixTok. ${esc(copy.footer.rights)}.</p>
  </footer>`;
}

function indexBody() {
  const howSteps = copy.how.steps
    .map(
      (s, i) => `
        <article class="step-card">
          <span class="step-num" aria-hidden="true">${i + 1}</span>
          <h3>${esc(s.title)}</h3>
          <p>${esc(s.body)}</p>
        </article>`,
    )
    .join("");

  const faqItems = copy.faq
    .map(
      (f) => `
        <details class="faq-item">
          <summary><h3>${esc(f.q)}</h3></summary>
          <p>${esc(f.a)}</p>
        </details>`,
    )
    .join("");

  const problemBullets = copy.problem.bullets.map((b) => `<li>${esc(b)}</li>`).join("");
  const powerBullets = copy.power.bullets.map((b) => `<li>${icon("check_circle")}<span>${esc(b)}</span></li>`).join("");
  const withoutLi = copy.compare.without.map((b) => `<li>${esc(b)}</li>`).join("");
  const withLi = copy.compare.with.map((b) => `<li>${esc(b)}</li>`).join("");
  const contractorLong = copy.contractor.long.map((p) => `<li>${esc(p)}</li>`).join("");
  const originParas = copy.origin.body.map((p) => `<p>${esc(p)}</p>`).join("");

  return `${navHtml()}
<main>
  <section class="hero" aria-labelledby="hero-title">
    <div class="container hero-grid">
      <div class="hero-copy">
        <p class="eyebrow">${esc(copy.hero.eyebrow)}</p>
        <h1 id="hero-title">
          <span>${esc(copy.hero.titleLine1)}</span>
          <span class="hero-gradient">${esc(copy.hero.titleLine2)}</span>
        </h1>
        <p class="hero-lead">${esc(copy.hero.lead)}</p>
        <div class="hero-actions">
          <a class="btn btn-primary btn-lg" href="${APP_LINKS.clientStart}">${esc(copy.hero.primaryCta)}</a>
          <a class="btn btn-ghost btn-lg" href="#how">${esc(copy.hero.secondaryCta)}</a>
        </div>
        <p class="hero-note">${esc(copy.hero.note)}</p>
      </div>
      <figure class="hero-visual">
        <img
          src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=900&q=80&auto=format&fit=crop"
          alt="חדר מגורים מודרני אחרי שיפוץ — אווירה חמה ונקייה"
          width="900"
          height="675"
          loading="eager"
          fetchpriority="high"
        />
      </figure>
    </div>
  </section>

  <section class="audience" aria-label="למי האתר מיועד">
    <div class="container audience-grid">
      <article class="audience-card">
        <h2>${esc(copy.audience.homeowner.title)}</h2>
        <p>${esc(copy.audience.homeowner.body)}</p>
        <a class="btn btn-primary" href="${APP_LINKS.clientStart}">${esc(copy.audience.homeowner.cta)}</a>
      </article>
      <article class="audience-card audience-card--contractor">
        <h2>${esc(copy.audience.contractor.title)}</h2>
        <p>${esc(copy.audience.contractor.body)}</p>
        <a class="btn btn-light" href="${APP_LINKS.contractorLanding}">${esc(copy.audience.contractor.cta)}</a>
      </article>
    </div>
  </section>

  <section class="section" id="problem">
    <div class="container narrow">
      <h2>${esc(copy.problem.title)}</h2>
      <p class="section-lead">${esc(copy.problem.lead)}</p>
      <ul class="bullet-list">${problemBullets}</ul>
    </div>
  </section>

  <section class="section section-soft" id="how">
    <div class="container">
      <h2>${esc(copy.how.title)}</h2>
      <p class="section-lead">${esc(copy.how.lead)}</p>
      <div class="steps-grid">${howSteps}</div>
    </div>
  </section>

  <section class="section" id="power">
    <div class="container split">
      <div>
        <h2>${esc(copy.power.title)}</h2>
        <p class="section-lead">${esc(copy.power.lead)}</p>
        <ul class="icon-list">${powerBullets}</ul>
      </div>
      <div class="compare-panel">
        <h3 class="sr-only">${esc(copy.compare.title)}</h3>
        <div class="compare-col compare-col--before">
          <p class="compare-label">בלי FixTok</p>
          <ul>${withoutLi}</ul>
        </div>
        <div class="compare-col compare-col--after">
          <p class="compare-label">עם FixTok</p>
          <ul>${withLi}</ul>
        </div>
      </div>
    </div>
  </section>

  <section class="section section-soft" id="about">
    <div class="container narrow">
      <h2>${esc(copy.origin.title)}</h2>
      ${originParas}
    </div>
  </section>

  <section class="video-section" aria-labelledby="video-title">
    <div class="container">
      <h2 id="video-title">${esc(copy.video.title)}</h2>
      <p class="section-lead">${esc(copy.video.lead)}</p>
      <div class="video-wrap">
        <video
          class="hero-video"
          poster="https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=1200&q=80&auto=format&fit=crop"
          muted
          loop
          playsinline
          preload="none"
          aria-label="${esc(copy.video.posterAlt)}"
        >
          <source src="/video/hero.webm" type="video/webm" />
          <source src="/video/hero.mp4" type="video/mp4" />
        </video>
        <p class="video-fallback">${esc(copy.video.placeholder)}</p>
      </div>
    </div>
  </section>

  <section class="contractor-block" id="contractor">
    <div class="container contractor-inner">
      <div>
        <h2>${esc(copy.contractor.title)}</h2>
        <p class="section-lead">${esc(copy.contractor.short)}</p>
        <ul class="bullet-list">${contractorLong}</ul>
        <a class="btn btn-light btn-lg" href="${APP_LINKS.contractorLanding}">${esc(copy.contractor.cta)}</a>
      </div>
    </div>
  </section>

  <section class="section" id="faq">
    <div class="container narrow">
      <h2>שאלות נפוצות</h2>
      <div class="faq-list">${faqItems}</div>
      <p class="trust-disclaimer">${esc(copy.trust.disclaimer)}</p>
    </div>
  </section>

  <section class="cta-band" aria-labelledby="cta-title">
    <div class="container cta-band-inner">
      <h2 id="cta-title">${esc(copy.cta.title)}</h2>
      <p>${esc(copy.cta.lead)}</p>
      <div class="hero-actions">
        <a class="btn btn-primary btn-lg" href="${APP_LINKS.clientStart}">${esc(copy.cta.client)}</a>
        <a class="btn btn-ghost btn-lg" href="${APP_LINKS.contractorLanding}">${esc(copy.cta.contractor)}</a>
      </div>
    </div>
  </section>
</main>
${footerHtml()}`;
}

function contactBody() {
  return `${navHtml()}
<main>
  <section class="section page-hero">
    <div class="container narrow">
      <h1>${esc(copy.contact.title)}</h1>
      <p class="section-lead">${esc(copy.contact.lead)}</p>
      <ul class="contact-list">
        <li>
          <strong>${esc(copy.contact.emailLabel)}</strong>
          <a href="mailto:${SUPPORT_EMAIL}">${SUPPORT_EMAIL}</a>
        </li>
        <li>
          <strong>${esc(copy.contact.whatsappLabel)}</strong>
          <a href="${SUPPORT_WHATSAPP_HREF}" rel="noopener noreferrer">שלחו הודעה בוואטסאפ</a>
        </li>
        <li>
          <strong>אפליקציה</strong>
          <a href="${APP_LINKS.contact}">עמוד צור קשר באפליקציה</a>
        </li>
      </ul>
      <p class="hero-note">אתר שיווקי: <a href="${SITE_ORIGIN}">${SITE_ORIGIN}</a> · אפליקציה: <a href="${APP_LINKS.login}">app.fix-tok.com</a></p>
    </div>
  </section>
</main>
${footerHtml()}`;
}

function writePage(filename, body, meta) {
  const html = `${headBlock(meta)}
<body>
${body}
</body>
</html>
`;
  writeFileSync(join(ROOT, filename), html, "utf8");
}

mkdirSync(join(ROOT, "marketing"), { recursive: true });
writePage("index.html", indexBody(), {
  title: copy.meta.title,
  description: copy.meta.description,
  canonical: SEO.canonical,
});
writePage("contact.html", contactBody(), {
  title: `צור קשר | ${SEO.siteName}`,
  description: copy.contact.lead,
  canonical: SEO.contactCanonical,
});

const staticCopies = [
  ["public/robots.txt", "robots.txt"],
  ["public/sitemap.xml", "sitemap.xml"],
  ["public/llms.txt", "llms.txt"],
  ["public/llms-full.txt", "llms-full.txt"],
  ["public/assets/images/logo-mark.svg", "assets/images/logo-mark.svg"],
  ["public/assets/images/logo-wordmark.svg", "assets/images/logo-wordmark.svg"],
  ["marketing/og-default.svg", "marketing/og-default.svg"],
];

for (const [src, dest] of staticCopies) {
  const from = join(ROOT, src);
  const to = join(ROOT, dest);
  if (!existsSync(from) || from === to) continue;
  mkdirSync(dirname(to), { recursive: true });
  cpSync(from, to, { force: true });
}

console.log("Built index.html, contact.html, and root static files");
