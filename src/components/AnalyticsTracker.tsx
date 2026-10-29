"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastTracked = useRef<string>("");

  useEffect(() => {
    if (!pathname) return;

    // Do not track admin routes or API routes to keep statistics clean
    if (pathname.startsWith("/admin") || pathname.startsWith("/api/")) {
      return;
    }

    const currentQuery = searchParams?.toString();
    const fullPath = currentQuery ? `${pathname}?${currentQuery}` : pathname;

    // Prevent duplicate triggers for the same path
    if (lastTracked.current === fullPath) {
      return;
    }
    lastTracked.current = fullPath;

    const payload = {
      path: pathname,
      referrer: typeof document !== "undefined" ? document.referrer || "Direct" : "Direct",
    };

    try {
      const data = JSON.stringify(payload);
      if (typeof navigator !== "undefined" && navigator.sendBeacon) {
        const blob = new Blob([data], { type: "application/json" });
        navigator.sendBeacon("/api/analytics/track", blob);
      } else {
        fetch("/api/analytics/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: data,
          keepalive: true,
        }).catch(() => {});
      }
    } catch {
      // Ignore background analytics errors silently
    }
  }, [pathname, searchParams]);

  return null;
}
