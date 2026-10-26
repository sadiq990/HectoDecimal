/**
 * Privacy-friendly, zero-telemetry analytics hook.
 * Remains completely inert unless NEXT_PUBLIC_ANALYTICS_ID is explicitly configured.
 */
export function useAnalytics() {
  const analyticsId = process.env.NEXT_PUBLIC_ANALYTICS_ID;

  const trackEvent = (event: string, properties?: Record<string, unknown>) => {
    if (!analyticsId || typeof window === "undefined") {
      return;
    }
    // Gated custom analytics provider hook
    if (process.env.NODE_ENV === "development") {
      console.log(`[Analytics] ${event}`, properties);
    }
  };

  return {
    isEnabled: Boolean(analyticsId),
    trackEvent,
  };
}
