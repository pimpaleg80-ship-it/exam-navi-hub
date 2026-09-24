import { useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";

import { GOOGLE_ANALYTICS_ENABLED, GOOGLE_ANALYTICS_ID } from "../lib/google-analytics";

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

export function GoogleAnalytics() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  useEffect(() => {
    if (!GOOGLE_ANALYTICS_ENABLED) return;

    window.dataLayer = window.dataLayer || [];
    window.gtag =
      window.gtag ||
      function gtag(...args: unknown[]) {
        window.dataLayer.push(args);
      };

    if (!document.querySelector(`script[src*="${GOOGLE_ANALYTICS_ID}"]`)) {
      const script = document.createElement("script");
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALYTICS_ID}`;
      document.head.appendChild(script);
    }

    window.gtag("js", new Date());
    window.gtag("config", GOOGLE_ANALYTICS_ID, { send_page_view: false });
  }, []);

  useEffect(() => {
    if (GOOGLE_ANALYTICS_ENABLED && window.gtag) {
      window.gtag("event", "page_view", {
        page_path: pathname,
        page_location: window.location.href,
        page_title: document.title,
      });
    }
  }, [pathname]);

  return null;
}
