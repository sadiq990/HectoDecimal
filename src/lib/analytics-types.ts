export interface PageViewEvent {
  id: string;
  timestamp: number;
  path: string;
  country: string;
  countryName: string;
  flag: string;
  city: string;
  referrer: string;
  device: "Desktop" | "Mobile" | "Tablet" | "Bot";
  browser: string;
  os: string;
  visitorHash: string;
}

export interface MetricRanking {
  name: string;
  count: number;
  percentage: number;
  extra?: string;
}

export interface CountryMetricRanking extends MetricRanking {
  code: string;
  flag: string;
}

export interface DailyTrend {
  date: string; // e.g. "Oct 28"
  views: number;
  visitors: number;
}

export interface AnalyticsSummary {
  totalViews: number;
  uniqueVisitors: number;
  viewsToday: number;
  visitorsToday: number;
  activeNow: number; // last 15 minutes
  topPages: MetricRanking[];
  topCountries: CountryMetricRanking[];
  topReferrers: MetricRanking[];
  devices: MetricRanking[];
  browsers: MetricRanking[];
  os: MetricRanking[];
  dailyTrends: DailyTrend[];
  recentVisits: PageViewEvent[];
  storageType: "upstash-redis" | "cloudflare-kv" | "in-memory";
}
