/** @typedef {{ source: string; medium: string; campaign: string }} UtmParams */

export const SITE_ORIGIN = "https://fix-tok.com";
export const APP_ORIGIN = "https://app.fix-tok.com";

export const APP_LINKS = {
  clientStart:
    `${APP_ORIGIN}/login?role=client&next=%2Fclient%2Fnew`,
  contractorLanding: `${APP_ORIGIN}/contractor`,
  contractorStart:
    `${APP_ORIGIN}/login?role=contractor&next=%2Fcontractor%2Ftenders`,
  login: `${APP_ORIGIN}/login`,
  contact: `${APP_ORIGIN}/contact`,
  terms: `${APP_ORIGIN}/terms`,
  termsContractor: `${APP_ORIGIN}/terms/contractor`,
  privacy: `${APP_ORIGIN}/privacy`,
};

export const SUPPORT_EMAIL = "info@fix-tok.com";
export const SUPPORT_WHATSAPP_HREF = "https://wa.me/972527434777";

/**
 * @param {string} url
 * @param {UtmParams} utm
 */
export function withUtm(url, { source, medium, campaign }) {
  const u = new URL(url);
  u.searchParams.set("utm_source", source);
  u.searchParams.set("utm_medium", medium);
  u.searchParams.set("utm_campaign", campaign);
  return u.toString();
}

/** תבניות קמפיין — ראו marketing/README.md */
export const UTM_TEMPLATES = {
  facebookRenovation: {
    source: "facebook",
    medium: "social",
    campaign: "renovation_q2",
  },
  whatsappShare: {
    source: "whatsapp",
    medium: "social",
    campaign: "share",
  },
  emailNewsletter: {
    source: "newsletter",
    medium: "email",
    campaign: "launch",
  },
};
