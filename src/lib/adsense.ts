/**
 * Google AdSense configuration.
 *
 * Set VITE_ADSENSE_CLIENT (e.g. "ca-pub-1234567890123456") in Vercel → Project →
 * Settings → Environment Variables, or change the fallback below.
 */
export const ADSENSE_CLIENT: string =
  (import.meta.env["VITE_ADSENSE_CLIENT"] as string | undefined)?.trim() ||
  "ca-pub-7158813450731817";

/** Publisher ID without the "ca-" prefix, as used in ads.txt ("pub-XXXX"). */
export const ADSENSE_PUB_ID = ADSENSE_CLIENT.replace(/^ca-/, "");

export const ADSENSE_ENABLED = /^ca-pub-\d{10,20}$/.test(ADSENSE_CLIENT);

/**
 * Optional manual ad unit slot IDs (AdSense → Ads → By ad unit → Display ads).
 * If left empty, the <AdSlot /> components render nothing and Auto ads handle placement.
 */
export const AD_SLOTS = {
  homeInFeed: (import.meta.env["VITE_ADSENSE_SLOT_HOME"] as string | undefined) || "",
  examDetail: (import.meta.env["VITE_ADSENSE_SLOT_EXAM"] as string | undefined) || "",
} as const;

export const ADSENSE_SCRIPT_SRC = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`;
