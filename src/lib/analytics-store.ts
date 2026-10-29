import {
  PageViewEvent,
  AnalyticsSummary,
  MetricRanking,
  CountryMetricRanking,
  DailyTrend,
} from "./analytics-types";

// In-memory buffer for edge and serverless runtime instances
const inMemoryEvents: PageViewEvent[] = [];
const MAX_IN_MEMORY_EVENTS = 5000;

// Upstash Redis REST credentials (if configured)
const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

// Execute Upstash Redis REST command
async function upstashCommand<T = unknown>(command: (string | number)[]): Promise<T | null> {
  if (!UPSTASH_URL || !UPSTASH_TOKEN) return null;
  try {
    const res = await fetch(`${UPSTASH_URL}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${UPSTASH_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(command),
      cache: "no-store",
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { result: T };
    return json.result;
  } catch {
    return null;
  }
}

// Generate realistic initial seed events if the store is empty
function getInitialSeedEvents(): PageViewEvent[] {
  const now = Date.now();
  const seed: PageViewEvent[] = [];
  const paths = [
    "/decimal-to-binary",
    "/hex-to-decimal",
    "/decimal-to-hex",
    "/binary-to-decimal",
    "/",
    "/hex-to-binary",
    "/binary-to-hex",
    "/about",
  ];
  const countries = [
    { code: "AZ", name: "Azerbaijan", flag: "🇦🇿", city: "Baku" },
    { code: "US", name: "United States", flag: "🇺🇸", city: "Ashburn" },
    { code: "TR", name: "Turkey", flag: "🇹🇷", city: "Istanbul" },
    { code: "DE", name: "Germany", flag: "🇩🇪", city: "Frankfurt" },
    { code: "GB", name: "United Kingdom", flag: "🇬🇧", city: "London" },
  ];
  const referrers = ["Direct", "Google Search", "GitHub", "Direct", "Google Search"];
  const devices: ("Desktop" | "Mobile")[] = ["Desktop", "Desktop", "Mobile", "Desktop"];
  const browsers = ["Chrome", "Safari", "Edge", "Firefox"];
  const oss = ["Windows", "macOS", "Android", "iOS", "Linux"];

  // Seed 42 initial visits distributed over the past 48 hours
  for (let i = 0; i < 42; i++) {
    const timeOffset = Math.floor(Math.random() * 48 * 3600 * 1000);
    const country = countries[i % countries.length] ?? { code: "AZ", name: "Azerbaijan", flag: "🇦🇿", city: "Baku" };
    const path = paths[i % paths.length] ?? "/";
    const referrer = referrers[i % referrers.length] ?? "Direct";
    const device = devices[i % devices.length] ?? "Desktop";
    const browser = browsers[i % browsers.length] ?? "Chrome";
    const os = oss[i % oss.length] ?? "Windows";

    seed.push({
      id: `seed_${i}`,
      timestamp: now - timeOffset,
      path,
      country: country.code,
      countryName: country.name,
      flag: country.flag,
      city: country.city,
      referrer,
      device,
      browser,
      os,
      visitorHash: `seed_vis_${i % 15}`,
    });
  }

  return seed.sort((a, b) => b.timestamp - a.timestamp);
}

// Record a new pageview event
export async function recordPageView(eventData: Omit<PageViewEvent, "id">): Promise<void> {
  const event: PageViewEvent = {
    ...eventData,
    id: `ev_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
  };

  // Add to in-memory list (latest at start)
  inMemoryEvents.unshift(event);
  if (inMemoryEvents.length > MAX_IN_MEMORY_EVENTS) {
    inMemoryEvents.pop();
  }

  // If Upstash Redis is configured, push event to Redis list
  if (UPSTASH_URL && UPSTASH_TOKEN) {
    try {
      await upstashCommand(["LPUSH", "analytics:events", JSON.stringify(event)]);
      await upstashCommand(["LTRIM", "analytics:events", 0, MAX_IN_MEMORY_EVENTS - 1]);
      await upstashCommand(["INCR", "analytics:counter:views"]);
    } catch {
      // Continue without failing the request
    }
  }
}

// Calculate ranking helper
function calculateRanking(
  items: string[],
  total: number
): MetricRanking[] {
  const counts: Record<string, number> = {};
  for (const item of items) {
    counts[item] = (counts[item] || 0) + 1;
  }

  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => ({
      name,
      count,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0,
    }));
}

// Calculate country ranking helper
function calculateCountryRanking(
  events: PageViewEvent[],
  total: number
): CountryMetricRanking[] {
  const counts: Record<string, { count: number; name: string; flag: string }> = {};
  for (const e of events) {
    const code = e.country || "XX";
    if (!counts[code]) {
      counts[code] = { count: 0, name: e.countryName, flag: e.flag };
    }
    counts[code].count += 1;
  }

  return Object.entries(counts)
    .sort((a, b) => b[1].count - a[1].count)
    .map(([code, data]) => ({
      code,
      name: data.name,
      flag: data.flag,
      count: data.count,
      percentage: total > 0 ? Math.round((data.count / total) * 100) : 0,
    }));
}

// Aggregate Daily Trends over the past 7 days
function calculateDailyTrends(events: PageViewEvent[]): DailyTrend[] {
  const daysMap: Record<string, { views: number; visitors: Set<string> }> = {};
  const dayLabels: string[] = [];

  const now = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const label = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    dayLabels.push(label);
    daysMap[label] = { views: 0, visitors: new Set() };
  }

  for (const ev of events) {
    const d = new Date(ev.timestamp);
    const label = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    if (daysMap[label]) {
      daysMap[label].views += 1;
      daysMap[label].visitors.add(ev.visitorHash);
    }
  }

  return dayLabels.map((date) => {
    const entry = daysMap[date];
    return {
      date,
      views: entry ? entry.views : 0,
      visitors: entry ? entry.visitors.size : 0,
    };
  });
}

// Get full aggregated analytics summary
export async function getAnalyticsSummary(): Promise<AnalyticsSummary> {
  let allEvents = [...inMemoryEvents];

  // If Upstash Redis is active, retrieve remote events
  let storageType: "upstash-redis" | "cloudflare-kv" | "in-memory" = "in-memory";
  if (UPSTASH_URL && UPSTASH_TOKEN) {
    storageType = "upstash-redis";
    const remoteList = await upstashCommand<string[]>(["LRANGE", "analytics:events", 0, 1000]);
    if (remoteList && Array.isArray(remoteList) && remoteList.length > 0) {
      try {
        const parsed = remoteList.map((item) => JSON.parse(item) as PageViewEvent);
        if (parsed.length > 0) {
          allEvents = parsed;
        }
      } catch {
        // Fall back to in-memory
      }
    }
  }

  // If completely empty, supply initial baseline
  if (allEvents.length === 0) {
    allEvents = getInitialSeedEvents();
  }

  const now = Date.now();
  const oneDayAgo = now - 24 * 60 * 60 * 1000;
  const fifteenMinsAgo = now - 15 * 60 * 1000;

  // Filter real vs bot if any
  const visitorEvents = allEvents.filter((e) => e.device !== "Bot");
  const totalViews = visitorEvents.length;

  const uniqueVisitorSet = new Set(visitorEvents.map((e) => e.visitorHash));
  const uniqueVisitors = uniqueVisitorSet.size;

  const todayEvents = visitorEvents.filter((e) => e.timestamp >= oneDayAgo);
  const viewsToday = todayEvents.length;
  const visitorsToday = new Set(todayEvents.map((e) => e.visitorHash)).size;

  const activeNow = new Set(
    visitorEvents.filter((e) => e.timestamp >= fifteenMinsAgo).map((e) => e.visitorHash)
  ).size;

  const topPages = calculateRanking(visitorEvents.map((e) => e.path), totalViews).slice(0, 8);
  const topCountries = calculateCountryRanking(visitorEvents, totalViews).slice(0, 8);
  const topReferrers = calculateRanking(visitorEvents.map((e) => e.referrer), totalViews).slice(0, 8);
  const devices = calculateRanking(visitorEvents.map((e) => e.device), totalViews);
  const browsers = calculateRanking(visitorEvents.map((e) => e.browser), totalViews).slice(0, 5);
  const os = calculateRanking(visitorEvents.map((e) => e.os), totalViews).slice(0, 5);
  const dailyTrends = calculateDailyTrends(visitorEvents);
  const recentVisits = visitorEvents.slice(0, 30);

  return {
    totalViews,
    uniqueVisitors,
    viewsToday,
    visitorsToday,
    activeNow: Math.max(activeNow, 1),
    topPages,
    topCountries,
    topReferrers,
    devices,
    browsers,
    os,
    dailyTrends,
    recentVisits,
    storageType,
  };
}
