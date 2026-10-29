import { NextRequest, NextResponse } from "next/server";
import { getAdminSession, isUsingDefaultPassword } from "@/lib/auth";
import { getAnalyticsSummary } from "@/lib/analytics-store";
import { getSecurityStats } from "@/lib/auth-rate-limit";

export async function GET(req: NextRequest) {
  const isAuth = await getAdminSession();
  if (!isAuth) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized access. Session invalid or expired." },
      {
        status: 401,
        headers: {
          "X-Robots-Tag": "noindex, nofollow, noarchive",
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  }

  try {
    const summary = await getAnalyticsSummary();
    const security = getSecurityStats();
    const gaId = process.env.NEXT_PUBLIC_GA_ID || process.env.NEXT_PUBLIC_ANALYTICS_ID || "";
    const isDefaultPass = isUsingDefaultPassword();
    const currentHost = req.headers.get("host") || "hectodecimal.workers.dev";

    return NextResponse.json(
      {
        ok: true,
        summary,
        security,
        config: {
          gaConfigured: Boolean(gaId),
          gaId: gaId ? `${gaId.slice(0, 3)}****${gaId.slice(-4)}` : null,
          fullGaId: gaId,
          isUsingDefaultPassword: isDefaultPass,
          host: currentHost,
          storageType: summary.storageType,
        },
      },
      {
        headers: {
          "X-Robots-Tag": "noindex, nofollow, noarchive",
          "Cache-Control": "no-store, max-age=0, must-revalidate",
        },
      }
    );
  } catch (error) {
    console.error("[Admin Stats Error]", error);
    return NextResponse.json(
      { ok: false, error: "Failed to compile analytics statistics." },
      { status: 500 }
    );
  }
}
