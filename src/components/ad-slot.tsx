import { useEffect, useRef } from "react";
import { useLocation } from "@tanstack/react-router";
import { ADSENSE_CLIENT, ADSENSE_ENABLED } from "@/lib/adsense";
import { cn } from "@/lib/utils";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

type AdSlotProps = {
  /** Ad unit slot ID from AdSense. If empty, nothing renders. */
  slot: string;
  format?: "auto" | "fluid" | "rectangle" | "horizontal" | "vertical";
  layoutKey?: string;
  className?: string;
};

/**
 * Responsive AdSense display unit that re-initialises on client-side navigation.
 */
export function AdSlot({ slot, format = "auto", layoutKey, className }: AdSlotProps) {
  const insRef = useRef<HTMLModElement>(null);
  const { pathname } = useLocation();

  useEffect(() => {
    if (!ADSENSE_ENABLED || !slot) return;
    const el = insRef.current;
    if (!el || el.getAttribute("data-adsbygoogle-status")) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.warn("AdSense push failed", err);
    }
  }, [slot, pathname]);

  if (!ADSENSE_ENABLED || !slot) return null;

  return (
    <div
      className={cn("my-6 w-full overflow-hidden text-center", className)}
      aria-label="Advertisement"
    >
      <span className="mb-1 block text-[10px] uppercase tracking-widest text-muted-foreground">
        Advertisement
      </span>
      <ins
        key={pathname}
        ref={insRef}
        className="adsbygoogle block"
        style={{ display: "block" }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
        {...(layoutKey ? { "data-ad-layout-key": layoutKey } : {})}
      />
    </div>
  );
}
