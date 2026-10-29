import { describe, it, expect } from "vitest";
import { parseUserAgent, getCountryFlag, getCountryName, cleanReferrer } from "./device-parser";

describe("device-parser", () => {
  it("correctly identifies desktop browsers", () => {
    const chromeMac =
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
    const res = parseUserAgent(chromeMac);
    expect(res.device).toBe("Desktop");
    expect(res.os).toBe("macOS");
    expect(res.browser).toBe("Chrome");
  });

  it("correctly identifies mobile devices", () => {
    const iphone =
      "Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1";
    const res = parseUserAgent(iphone);
    expect(res.device).toBe("Mobile");
    expect(res.os).toBe("iOS");
    expect(res.browser).toBe("Safari");
  });

  it("correctly flags bots and search engines", () => {
    const googleBot = "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)";
    const res = parseUserAgent(googleBot);
    expect(res.device).toBe("Bot");
  });

  it("converts country codes to flags and names", () => {
    expect(getCountryFlag("AZ")).toBe("🇦🇿");
    expect(getCountryName("AZ")).toBe("Azerbaijan");

    expect(getCountryFlag("US")).toBe("🇺🇸");
    expect(getCountryName("US")).toBe("United States");

    expect(getCountryFlag("TR")).toBe("🇹🇷");
    expect(getCountryName("TR")).toBe("Turkey");
  });

  it("cleans and categorizes referrers", () => {
    expect(cleanReferrer("https://www.google.com/search?q=hex+to+decimal")).toBe("Google Search");
    expect(cleanReferrer("https://github.com/sadiq990/HectoDecimal")).toBe("GitHub");
    expect(cleanReferrer("Direct")).toBe("Direct");
  });
});
