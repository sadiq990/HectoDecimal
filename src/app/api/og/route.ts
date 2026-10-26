import type { NextRequest } from "next/server";
import { siteConfig } from "@/config/site";

export function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title") || siteConfig.name;
  const subtitle =
    searchParams.get("subtitle") || "Instant, Step-by-Step Base Converter";

  // Escape XML entities
  const escapeXml = (str: string) =>
    str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");

  const safeTitle = escapeXml(title);
  const safeSubtitle = escapeXml(subtitle);

  const svg = `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="glow" cx="50%" cy="0%" r="60%">
        <stop offset="0%" stop-color="#6366F1" stop-opacity="0.3"/>
        <stop offset="100%" stop-color="#07080A" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#6366F1"/>
        <stop offset="100%" stop-color="#22D3EE"/>
      </linearGradient>
    </defs>
    
    <!-- Background -->
    <rect width="1200" height="630" fill="#07080A"/>
    <rect width="1200" height="630" fill="url(#glow)"/>
    
    <!-- Outer Card Border -->
    <rect x="40" y="40" width="1120" height="550" rx="24" fill="none" stroke="#1F232B" stroke-width="2"/>
    
    <!-- Brand Logo -->
    <g transform="translate(80, 80)">
      <rect width="48" height="48" rx="14" fill="rgba(99, 102, 241, 0.15)" stroke="#6366F1" stroke-width="2.5"/>
      <path d="M15 15L33 33M33 15L15 33" stroke="#6366F1" stroke-width="3" stroke-linecap="round"/>
      <text x="64" y="34" font-family="system-ui, -apple-system, sans-serif" font-size="28" font-weight="700" fill="#F4F5F7">
        Hex<tspan fill="#6366F1">Dec</tspan>
      </text>
    </g>
    
    <!-- Headline -->
    <text x="80" y="270" font-family="system-ui, -apple-system, sans-serif" font-size="44" font-weight="800" fill="#FFFFFF" letter-spacing="-1">
      ${safeTitle}
    </text>
    
    <!-- Subtitle -->
    <text x="80" y="330" font-family="system-ui, -apple-system, sans-serif" font-size="22" font-weight="500" fill="#9AA1AD">
      ${safeSubtitle}
    </text>
    
    <!-- Feature Badges -->
    <g transform="translate(80, 480)">
      <line x1="0" y1="-20" x2="1040" y2="-20" stroke="#1F232B" stroke-width="1.5"/>
      
      <circle cx="8" cy="8" r="5" fill="#34D399"/>
      <text x="24" y="14" font-family="system-ui, sans-serif" font-size="16" font-weight="600" fill="#34D399">100% Client-Side</text>
      
      <circle cx="260" cy="8" r="5" fill="#22D3EE"/>
      <text x="276" y="14" font-family="system-ui, sans-serif" font-size="16" font-weight="600" fill="#22D3EE">Unlimited BigInt</text>
      
      <circle cx="500" cy="8" r="5" fill="#6366F1"/>
      <text x="516" y="14" font-family="system-ui, sans-serif" font-size="16" font-weight="600" fill="#9AA1AD">Zero Ads • Worked Math</text>
    </g>
  </svg>`;

  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=3600",
    },
  });
}
