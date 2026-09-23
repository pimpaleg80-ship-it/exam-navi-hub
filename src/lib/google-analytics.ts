const GOOGLE_ANALYTICS_ID =
  (import.meta.env["VITE_GOOGLE_ANALYTICS_ID"] as string | undefined)?.trim() || "";

export const GOOGLE_ANALYTICS_ENABLED = /^G-[A-Z0-9]+$/i.test(GOOGLE_ANALYTICS_ID);
export { GOOGLE_ANALYTICS_ID };
