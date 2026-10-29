export interface ParsedClient {
  device: "Desktop" | "Mobile" | "Tablet" | "Bot";
  browser: string;
  os: string;
}

export function parseUserAgent(uaString?: string | null): ParsedClient {
  if (!uaString) {
    return { device: "Desktop", browser: "Unknown", os: "Unknown" };
  }

  const ua = uaString.toLowerCase();

  // Detect Bots
  if (
    ua.includes("bot") ||
    ua.includes("crawler") ||
    ua.includes("spider") ||
    ua.includes("slurp") ||
    ua.includes("googlebot") ||
    ua.includes("bingbot") ||
    ua.includes("yandex") ||
    ua.includes("duckduckbot")
  ) {
    return { device: "Bot", browser: "Bot/Crawler", os: "Bot" };
  }

  // Detect Device
  let device: "Desktop" | "Mobile" | "Tablet" | "Bot" = "Desktop";
  if (ua.includes("ipad") || ua.includes("tablet") || (ua.includes("android") && !ua.includes("mobile"))) {
    device = "Tablet";
  } else if (
    ua.includes("mobile") ||
    ua.includes("iphone") ||
    ua.includes("ipod") ||
    ua.includes("android") ||
    ua.includes("blackberry") ||
    ua.includes("webos")
  ) {
    device = "Mobile";
  }

  // Detect OS
  let os = "Other";
  if (ua.includes("iphone") || ua.includes("ipad") || ua.includes("ipod") || ua.includes("ios")) {
    os = "iOS";
  } else if (ua.includes("android")) {
    os = "Android";
  } else if (ua.includes("windows nt") || ua.includes("windows")) {
    os = "Windows";
  } else if (ua.includes("macintosh") || ua.includes("mac os x")) {
    os = "macOS";
  } else if (ua.includes("cros")) {
    os = "ChromeOS";
  } else if (ua.includes("linux")) {
    os = "Linux";
  }

  // Detect Browser
  let browser = "Other";
  if (ua.includes("edg/") || ua.includes("edge/")) {
    browser = "Edge";
  } else if (ua.includes("opr/") || ua.includes("opera")) {
    browser = "Opera";
  } else if (ua.includes("samsungbrowser")) {
    browser = "Samsung Browser";
  } else if (ua.includes("chrome") && !ua.includes("chromium") && !ua.includes("edg")) {
    browser = "Chrome";
  } else if (ua.includes("firefox") || ua.includes("fxios")) {
    browser = "Firefox";
  } else if (ua.includes("safari") && !ua.includes("chrome") && !ua.includes("android")) {
    browser = "Safari";
  }

  return { device, browser, os };
}

// Map ISO country codes to country names
const COUNTRY_NAMES: Record<string, string> = {
  AZ: "Azerbaijan",
  TR: "Turkey",
  US: "United States",
  GB: "United Kingdom",
  DE: "Germany",
  FR: "France",
  RU: "Russia",
  CA: "Canada",
  NL: "Netherlands",
  IN: "India",
  UA: "Ukraine",
  GE: "Georgia",
  IT: "Italy",
  ES: "Spain",
  BR: "Brazil",
  PL: "Poland",
  AU: "Australia",
  JP: "Japan",
  KR: "South Korea",
  CN: "China",
  ID: "Indonesia",
  PK: "Pakistan",
  NG: "Nigeria",
  EG: "Egypt",
  SA: "Saudi Arabia",
  AE: "United Arab Emirates",
  KZ: "Kazakhstan",
  UZ: "Uzbekistan",
  SE: "Sweden",
  CH: "Switzerland",
  AT: "Austria",
  BE: "Belgium",
  RO: "Romania",
};

export function getCountryFlag(countryCode?: string | null): string {
  if (!countryCode || countryCode.length !== 2 || countryCode === "XX" || countryCode === "T1") {
    return "🌐";
  }
  const code = countryCode.toUpperCase();
  // Unicode regional indicator symbol logic
  const char1 = code.charCodeAt(0);
  const char2 = code.charCodeAt(1);
  if (char1 >= 65 && char1 <= 90 && char2 >= 65 && char2 <= 90) {
    return String.fromCodePoint(127397 + char1) + String.fromCodePoint(127397 + char2);
  }
  return "🌐";
}

export function getCountryName(countryCode?: string | null): string {
  if (!countryCode || countryCode === "XX" || countryCode === "T1") {
    return "Unknown Country";
  }
  const code = countryCode.toUpperCase();
  return COUNTRY_NAMES[code] || code;
}

export function cleanReferrer(ref?: string | null): string {
  if (!ref || ref === "Direct" || ref === "") return "Direct";
  try {
    const url = new URL(ref);
    const host = url.hostname.replace(/^www\./, "");
    if (host.includes("google.")) return "Google Search";
    if (host.includes("bing.")) return "Bing Search";
    if (host.includes("duckduckgo.")) return "DuckDuckGo";
    if (host.includes("yandex.")) return "Yandex";
    if (host.includes("github.com")) return "GitHub";
    if (host.includes("reddit.com")) return "Reddit";
    if (host.includes("twitter.com") || host.includes("x.com")) return "X / Twitter";
    if (host.includes("linkedin.com")) return "LinkedIn";
    if (host.includes("facebook.com")) return "Facebook";
    if (host.includes("youtube.com")) return "YouTube";
    return host;
  } catch {
    return ref.length > 30 ? ref.slice(0, 30) + "..." : ref;
  }
}
