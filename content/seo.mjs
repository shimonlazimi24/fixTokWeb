import { SITE_ORIGIN, APP_ORIGIN, SUPPORT_EMAIL } from "./links.mjs";

export const SEO = {
  siteName: "FixTok",
  canonical: `${SITE_ORIGIN}/`,
  contactCanonical: `${SITE_ORIGIN}/contact.html`,
  title:
    "FixTok — שיפוץ בראש שקט, מסרטון להצעות מסודרות",
  description:
    "צלמו סרטון קצר, קבלו מפרט מקצועי עם מפקח בנייה, והשוו הצעות מחיר מקבלנים מאומתים — בלי לרדוף אחרי קבלנים.",
  keywords: [
    "שיפוץ",
    "הצעות מחיר",
    "קבלנים",
    "סרטון שיפוץ",
    "תיק עבודה",
    "ישראל",
    "משפצים",
  ].join(", "),
  themeColor: "#F97316",
  ogImage: `${SITE_ORIGIN}/marketing/og-default.svg`,
  twitterCard: "summary_large_image",
  locale: "he_IL",
};

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "FixTok",
    url: SITE_ORIGIN,
    logo: `${SITE_ORIGIN}/assets/images/logo-wordmark.svg`,
    email: SUPPORT_EMAIL,
    sameAs: [APP_ORIGIN],
  };
}

export function webSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SEO.siteName,
    url: SITE_ORIGIN,
    inLanguage: "he",
    description: SEO.description,
  };
}

export function serviceJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "FixTok — פלטפורמת שיפוצים",
    provider: { "@type": "Organization", name: "FixTok" },
    areaServed: { "@type": "Country", name: "Israel" },
    description:
      "פלטפורמה ישראלית שמפיקה מפרט מקצועי מסרטון קצר ומחברת בין משפצים לקבלנים מאומתים — עם פיקוח הנדסי מובנה.",
    url: APP_ORIGIN,
  };
}

/** @param {{ q: string; a: string }[]} faq */
export function faqPageJsonLd(faq) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };
}
