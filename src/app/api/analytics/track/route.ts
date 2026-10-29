import { NextRequest, NextResponse } from "next/server";
import { recordPageView } from "@/lib/analytics-store";
import { parseUserAgent, getCountryFlag, getCountryName, cleanReferrer } from "@/lib/device-parser";

// Generate privacy-safe daily visitor hash
async function createVisitorHash(ip: string, userAgent: string): Promise<string> {
  const today = new Date().toISOString().slice(0, 10);
  const data = `${ip}-${userAgent}-${today}-hecto-salt`;
  const buffer = new TextEncoder().encode(data);
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("").slice(0, 16);
}

export async function POST(req: NextRequest) {
  try {
    let body: { path?: string; referrer?: string } = {};
    try {
      body = await req.json();
    } catch {
      // Empty or beacon body
    }

    const path = body.path || "/";
    // Never track admin pages
    if (path.startsWith("/admin") || path.startsWith("/api/")) {
      return NextResponse.json({ ok: true });
    }

    // Extract Cloudflare Edge Headers
    const countryCode =
      req.headers.get("cf-ipcountry") ||
      req.headers.get("x-country-code") ||
      "AZ"; // Fallback to AZ if local
    const city =
      req.headers.get("cf-ipcity") ||
      req.headers.get("x-city") ||
      "Baku";
    const userAgent = req.headers.get("user-agent") || "";
    const ip =
      req.headers.get("cf-connecting-ip") ||
      req.headers.get("x-forwarded-for")?.split(",")[0] ||
      "127.0.0.1";

    const { device, browser, os } = parseUserAgent(userAgent);
    const countryName = getCountryName(countryCode);
    const flag = getCountryFlag(countryCode);
    const referrer = cleanReferrer(body.referrer);
    const visitorHash = await createVisitorHash(ip, userAgent);

    await recordPageView({
      timestamp: Date.now(),
      path,
      country: countryCode,
      countryName,
      flag,
      city: decodeURIComponent(city),
      referrer,
      device,
      browser,
      os,
      visitorHash,
    });

    return NextResponse.json({ ok: true }, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (error) {
    console.error("[Analytics Track Error]", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
