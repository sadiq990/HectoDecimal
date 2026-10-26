import { siteConfig } from "@/config/site";

export function GET() {
  const content = `# ${siteConfig.name} - Number Base Converter

> ${siteConfig.description}

## Core Features
- Pure BigInt arithmetic with zero floating-point precision loss.
- 100% Client-side execution (zero data sent to server).
- Step-by-step positional notation breakdown for base conversions.
- Arbitrary length numbers (up to 10,000 characters).
- Instant live evaluation on keystroke without convert buttons.

## Primary Tools & Pages
- ${siteConfig.url}/ : Home page with live Hex to Decimal converter
- ${siteConfig.url}/hex-to-decimal : Hexadecimal to Decimal converter
- ${siteConfig.url}/decimal-to-hex : Decimal to Hexadecimal converter
- ${siteConfig.url}/binary-to-decimal : Binary to Decimal converter
- ${siteConfig.url}/decimal-to-binary : Decimal to Binary converter
- ${siteConfig.url}/hex-to-binary : Hexadecimal to Binary converter
- ${siteConfig.url}/binary-to-hex : Binary to Hexadecimal converter
- ${siteConfig.url}/hex-to-decimal-chart : Complete 0-255 (1-byte) reference chart
- ${siteConfig.url}/how-to-convert-hex-to-decimal : Comprehensive engineering guide and tutorial

## Technical Implementation
- Framework: Next.js 15 (App Router, Static Site Generation)
- Calculation Engine: Native JavaScript BigInt
- Privacy: No cookies, no storage of inputs, completely private.
`;

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=3600",
    },
  });
}
