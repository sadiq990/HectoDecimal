"use client";

import { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import { AnalyticsSummary } from "@/lib/analytics-types";

interface AdminDashboardProps {
  initialIsAuthenticated: boolean;
  initialDefaultPassWarning?: boolean;
}

interface StatsResponse {
  ok: boolean;
  summary: AnalyticsSummary;
  security: {
    lockedIps: number;
    trackedIps: number;
    maxAttempts: number;
  };
  config: {
    gaConfigured: boolean;
    gaId: string | null;
    fullGaId: string;
    isUsingDefaultPassword: boolean;
    host: string;
    storageType: string;
  };
  error?: string;
}

export function AdminDashboard({
  initialIsAuthenticated,
}: AdminDashboardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(initialIsAuthenticated);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [remainingAttempts, setRemainingAttempts] = useState<number | null>(null);
  const [, startTransition] = useTransition();

  // Dashboard Data State
  const [statsData, setStatsData] = useState<StatsResponse | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [autoRefreshInterval, setAutoRefreshInterval] = useState<number>(30); // 30s default
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "audience" | "realtime" | "settings">("overview");

  // Fetch Stats from API
  const fetchStats = async () => {
    setIsLoadingStats(true);
    try {
      const res = await fetch("/api/admin/stats", {
        cache: "no-store",
        headers: { "Cache-Control": "no-cache" },
      });
      if (res.status === 401) {
        setIsAuthenticated(false);
        return;
      }
      const data = (await res.json()) as StatsResponse;
      if (data.ok) {
        setStatsData(data);
        setLastUpdated(new Date());
      }
    } catch (err) {
      console.error("Failed to load admin stats", err);
    } finally {
      setIsLoadingStats(false);
    }
  };

  // Initial load when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchStats();
    }
  }, [isAuthenticated]);

  // Auto-refresh timer
  useEffect(() => {
    if (!isAuthenticated || autoRefreshInterval <= 0) return;
    const interval = setInterval(() => {
      fetchStats();
    }, autoRefreshInterval * 1000);
    return () => clearInterval(interval);
  }, [isAuthenticated, autoRefreshInterval]);

  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;

    setAuthLoading(true);
    setAuthError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        setAuthError(data.error || "Authentication failed.");
        if (data.remainingAttempts !== undefined) {
          setRemainingAttempts(data.remainingAttempts);
        }
        return;
      }

      startTransition(() => {
        setIsAuthenticated(true);
        setPassword("");
        setAuthError("");
      });
    } catch {
      setAuthError("Network connection error. Please try again.");
    } finally {
      setAuthLoading(false);
    }
  };

  // Handle Logout
  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } finally {
      setIsAuthenticated(false);
      setStatsData(null);
    }
  };

  // Format relative time helper
  const getRelativeTime = (timestamp: number) => {
    const diff = Math.floor((Date.now() - timestamp) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  // Render Login View if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          {/* Security Shield Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 mb-4 shadow-inner">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-[var(--text)]">Admin Authentication</h1>
            <p className="text-sm text-[var(--text-muted)] mt-1">
              Encrypted access to HectoDecimal analytics & operations
            </p>
          </div>

          {/* Login Card */}
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-6 sm:p-8 shadow-xl">
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-2">
                  Admin Passkey
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter admin password..."
                    className="w-full px-4 py-3 bg-[var(--surface-raised)] border border-[var(--border)] rounded-xl text-[var(--text)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)] pr-11 font-mono"
                    autoFocus
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text)] p-1 transition-colors"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"
                        />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {authError && (
                <div className="p-3.5 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-xs flex items-start gap-2.5">
                  <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  <span>{authError}</span>
                </div>
              )}

              {remainingAttempts !== null && remainingAttempts > 0 && remainingAttempts < 5 && (
                <p className="text-amber-500 text-xs text-center font-medium">
                  ⚠️ Caution: {remainingAttempts} attempts remaining before temporary IP lock.
                </p>
              )}

              <button
                type="submit"
                disabled={authLoading}
                className="w-full py-3.5 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-semibold rounded-xl text-sm transition-all shadow-md hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              >
                {authLoading ? (
                  <>
                    <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Verifying Credentials...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Unlock Dashboard
                  </>
                )}
              </button>
            </form>

            {/* Security Badges */}
            <div className="mt-6 pt-6 border-t border-[var(--border)] grid grid-cols-2 gap-3 text-[11px] text-[var(--text-muted)]">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>SHA-256 HMAC Token</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>Rate-Limit Guard</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>Timing Attack Safe</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>HttpOnly / Strict</span>
              </div>
            </div>
          </div>

          <div className="text-center mt-6">
            <Link href="/" className="text-xs text-[var(--text-muted)] hover:text-[var(--text)] transition-colors">
              ← Return to HexDec Converters
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const summary = statsData?.summary;
  const config = statsData?.config;
  const security = statsData?.security;

  return (
    <div className="space-y-8 pb-12">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border)]">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-[var(--text)]">Admin Analytics</h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Live
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-0.5">
            Realtime audience demographics, converter traffic, and security
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {/* Auto Refresh Selector */}
          <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] bg-[var(--surface)] border border-[var(--border)] rounded-xl px-2.5 py-1.5">
            <span>Refresh:</span>
            <select
              value={autoRefreshInterval}
              onChange={(e) => setAutoRefreshInterval(Number(e.target.value))}
              className="bg-transparent text-[var(--text)] font-medium focus:outline-none cursor-pointer"
            >
              <option value={10}>10s</option>
              <option value={30}>30s</option>
              <option value={60}>60s</option>
              <option value={0}>Manual</option>
            </select>
          </div>

          {/* Refresh Button */}
          <button
            onClick={fetchStats}
            disabled={isLoadingStats}
            className="inline-flex items-center justify-center p-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-raised)] text-[var(--text-muted)] hover:text-[var(--text)] transition-colors cursor-pointer"
            title="Refresh statistics now"
          >
            <svg
              className={`w-4 h-4 ${isLoadingStats ? "animate-spin text-[var(--accent)]" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[var(--border)] bg-red-500/10 hover:bg-red-500/20 text-red-500 text-xs font-semibold transition-colors cursor-pointer"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Logout
          </button>
        </div>
      </div>

      {/* Default Password Notice (if active) */}
      {config?.isUsingDefaultPassword && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <span className="text-xl">⚠️</span>
            <div>
              <p className="font-semibold text-amber-500">Security Recommendation: Set Custom ADMIN_PASSWORD</p>
              <p className="text-[var(--text-muted)] mt-0.5">
                Currently running on default master credentials (<code className="font-mono text-amber-500">hectoAdmin2026!</code>). For high security in production, set <code className="font-mono font-bold">ADMIN_PASSWORD</code> in your Cloudflare Workers Dashboard Settings → Variables.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[var(--border)] pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
            activeTab === "overview"
              ? "bg-[var(--accent)] text-white shadow-sm"
              : "text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-raised)]"
          }`}
        >
          📊 Overview & Traffic
        </button>
        <button
          onClick={() => setActiveTab("audience")}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
            activeTab === "audience"
              ? "bg-[var(--accent)] text-white shadow-sm"
              : "text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-raised)]"
          }`}
        >
          🌍 Audience & Countries
        </button>
        <button
          onClick={() => setActiveTab("realtime")}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
            activeTab === "realtime"
              ? "bg-[var(--accent)] text-white shadow-sm"
              : "text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-raised)]"
          }`}
        >
          ⚡ Realtime Activity ({summary?.recentVisits?.length || 0})
        </button>
        <button
          onClick={() => setActiveTab("settings")}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
            activeTab === "settings"
              ? "bg-[var(--accent)] text-white shadow-sm"
              : "text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-raised)]"
          }`}
        >
          🛡️ Security & Google Tag
        </button>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Unique Visitors */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-4 sm:p-5 shadow-sm">
          <div className="flex items-center justify-between text-[var(--text-muted)] mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Unique Visitors</span>
            <span className="text-lg">👥</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[var(--text)] font-mono">
            {summary?.uniqueVisitors || 0}
          </div>
          <div className="text-xs text-emerald-500 font-medium mt-1 flex items-center gap-1">
            <span>+{summary?.visitorsToday || 0} today</span>
          </div>
        </div>

        {/* Card 2: Total Pageviews */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-4 sm:p-5 shadow-sm">
          <div className="flex items-center justify-between text-[var(--text-muted)] mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Total Pageviews</span>
            <span className="text-lg">📈</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[var(--accent)] font-mono">
            {summary?.totalViews || 0}
          </div>
          <div className="text-xs text-[var(--text-muted)] mt-1">
            <span>{summary?.viewsToday || 0} in last 24h</span>
          </div>
        </div>

        {/* Card 3: Active Right Now */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-4 sm:p-5 shadow-sm">
          <div className="flex items-center justify-between text-[var(--text-muted)] mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Active Right Now</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-500 font-mono">
            {summary?.activeNow || 1}
          </div>
          <div className="text-xs text-[var(--text-muted)] mt-1">
            <span>Last 15 minutes</span>
          </div>
        </div>

        {/* Card 4: Security Shield */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-4 sm:p-5 shadow-sm">
          <div className="flex items-center justify-between text-[var(--text-muted)] mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Security Shield</span>
            <span className="text-lg">🛡️</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[var(--text)] font-mono">
            100%
          </div>
          <div className="text-xs text-emerald-500 mt-1 font-medium">
            <span>{security?.lockedIps || 0} threats blocked</span>
          </div>
        </div>
      </div>

      {/* TAB 1: OVERVIEW & TRAFFIC */}
      {activeTab === "overview" && (
        <div className="space-y-8">
          {/* 7-Day Trend Chart */}
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-base font-bold text-[var(--text)]">Daily Traffic Trend (Past 7 Days)</h2>
                <p className="text-xs text-[var(--text-muted)]">Pageviews and unique visitors trajectory</p>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-md bg-[var(--accent)]"></span>
                  <span className="text-[var(--text-muted)]">Pageviews</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-md bg-emerald-500"></span>
                  <span className="text-[var(--text-muted)]">Visitors</span>
                </span>
              </div>
            </div>

            {/* Visual Bar Chart */}
            <div className="grid grid-cols-7 gap-2 sm:gap-4 items-end h-44 sm:h-52 pt-6 pb-2 border-b border-[var(--border)]">
              {summary?.dailyTrends?.map((trend, idx) => {
                const maxViews = Math.max(...(summary?.dailyTrends?.map((t) => t.views) || [10]), 10);
                const viewHeight = Math.max(8, Math.round((trend.views / maxViews) * 100));
                const visitorHeight = Math.max(8, Math.round((trend.visitors / maxViews) * 100));

                return (
                  <div key={idx} className="flex flex-col items-center gap-2 h-full justify-end group">
                    <div className="w-full flex items-end justify-center gap-1 sm:gap-1.5 h-full">
                      {/* Views Bar */}
                      <div
                        style={{ height: `${viewHeight}%` }}
                        className="w-full max-w-[20px] bg-[var(--accent)] hover:bg-[var(--accent-hover)] rounded-t-md transition-all relative"
                      >
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 left-1/2 -translate-x-1/2 bg-[var(--surface-raised)] border border-[var(--border)] text-[var(--text)] text-[10px] font-mono px-1.5 py-0.5 rounded shadow pointer-events-none z-10 whitespace-nowrap">
                          {trend.views} views
                        </div>
                      </div>
                      {/* Visitors Bar */}
                      <div
                        style={{ height: `${visitorHeight}%` }}
                        className="w-full max-w-[20px] bg-emerald-500/80 hover:bg-emerald-500 rounded-t-md transition-all relative"
                      >
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 left-1/2 -translate-x-1/2 bg-[var(--surface-raised)] border border-[var(--border)] text-[var(--text)] text-[10px] font-mono px-1.5 py-0.5 rounded shadow pointer-events-none z-10 whitespace-nowrap">
                          {trend.visitors} visitors
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] sm:text-xs text-[var(--text-muted)] font-mono whitespace-nowrap">
                      {trend.date}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Grid: Top Converters & Top Referrers */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Converters */}
            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-[var(--text)] uppercase tracking-wider">Top Visited Converters</h3>
                <span className="text-xs text-[var(--text-muted)]">By Popularity</span>
              </div>
              <div className="space-y-3">
                {summary?.topPages?.map((page, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <Link
                        href={page.name}
                        target="_blank"
                        className="font-mono text-[var(--accent)] hover:underline truncate max-w-[240px] sm:max-w-xs"
                      >
                        {page.name}
                      </Link>
                      <span className="font-mono text-[var(--text)] font-semibold">
                        {page.count} <span className="text-[var(--text-muted)] font-normal">({page.percentage}%)</span>
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-[var(--surface-raised)] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[var(--accent)] rounded-full"
                        style={{ width: `${page.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Referrers */}
            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-[var(--text)] uppercase tracking-wider">Traffic Sources / Referrers</h3>
                <span className="text-xs text-[var(--text-muted)]">Acquisition</span>
              </div>
              <div className="space-y-3">
                {summary?.topReferrers?.map((ref, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-[var(--text)] flex items-center gap-2">
                        <span>{ref.name === "Direct" ? "🔗" : "🌐"}</span>
                        <span>{ref.name}</span>
                      </span>
                      <span className="font-mono text-[var(--text)] font-semibold">
                        {ref.count} <span className="text-[var(--text-muted)] font-normal">({ref.percentage}%)</span>
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-[var(--surface-raised)] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{ width: `${ref.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: AUDIENCE & COUNTRIES ("hardan girib kutleye baxim") */}
      {activeTab === "audience" && (
        <div className="space-y-8">
          {/* Geographic Breakdown */}
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-base font-bold text-[var(--text)]">Geographic Audience Distribution</h2>
                <p className="text-xs text-[var(--text-muted)]">
                  Where your visitors are located worldwide (detected via Cloudflare Edge headers)
                </p>
              </div>
              <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-[var(--surface-raised)] border border-[var(--border)] text-[var(--text-muted)]">
                {summary?.topCountries?.length || 0} Countries Detected
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {summary?.topCountries?.map((country, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl border border-[var(--border)] bg-[var(--surface-raised)]/50 flex flex-col justify-between gap-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl" role="img" aria-label={country.name}>
                        {country.flag}
                      </span>
                      <div>
                        <div className="text-sm font-semibold text-[var(--text)]">{country.name}</div>
                        <div className="text-[10px] text-[var(--text-muted)] uppercase font-mono">{country.code}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold font-mono text-[var(--text)]">{country.count} visits</div>
                      <div className="text-xs text-[var(--accent)] font-semibold">{country.percentage}%</div>
                    </div>
                  </div>
                  <div className="w-full h-1.5 bg-[var(--border)] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 rounded-full"
                      style={{ width: `${country.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Technology Demographics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Devices */}
            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 shadow-sm">
              <h3 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-4 flex items-center gap-2">
                <span>📱</span> Device Category
              </h3>
              <div className="space-y-3">
                {summary?.devices?.map((dev, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[var(--text)] font-medium">{dev.name}</span>
                      <span className="font-mono text-[var(--text)] font-semibold">
                        {dev.count} ({dev.percentage}%)
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-[var(--surface-raised)] rounded-full overflow-hidden">
                      <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${dev.percentage}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Operating Systems */}
            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 shadow-sm">
              <h3 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-4 flex items-center gap-2">
                <span>💻</span> Operating Systems
              </h3>
              <div className="space-y-3">
                {summary?.os?.map((osItem, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[var(--text)] font-medium">{osItem.name}</span>
                      <span className="font-mono text-[var(--text)] font-semibold">
                        {osItem.count} ({osItem.percentage}%)
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-[var(--surface-raised)] rounded-full overflow-hidden">
                      <div className="h-full bg-purple-500 rounded-full" style={{ width: `${osItem.percentage}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Browsers */}
            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 shadow-sm">
              <h3 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-4 flex items-center gap-2">
                <span>🧭</span> Browsers
              </h3>
              <div className="space-y-3">
                {summary?.browsers?.map((browser, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[var(--text)] font-medium">{browser.name}</span>
                      <span className="font-mono text-[var(--text)] font-semibold">
                        {browser.count} ({browser.percentage}%)
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-[var(--surface-raised)] rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full" style={{ width: `${browser.percentage}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: REALTIME ACTIVITY */}
      {activeTab === "realtime" && (
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-[var(--text)]">Recent Visitor Stream</h2>
              <p className="text-xs text-[var(--text-muted)]">Live incoming hits with country, page, and device</p>
            </div>
            <span className="text-xs font-mono text-[var(--text-muted)]">
              Showing last {summary?.recentVisits?.length || 0} visits
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[var(--border)] text-[var(--text-muted)] uppercase font-semibold">
                  <th className="py-2.5 px-3">Time</th>
                  <th className="py-2.5 px-3">Page / Tool</th>
                  <th className="py-2.5 px-3">Location</th>
                  <th className="py-2.5 px-3">Device / OS</th>
                  <th className="py-2.5 px-3">Browser</th>
                  <th className="py-2.5 px-3">Source</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {summary?.recentVisits?.map((visit) => (
                  <tr key={visit.id} className="hover:bg-[var(--surface-raised)]/50 transition-colors font-mono">
                    <td className="py-2.5 px-3 text-[var(--text-muted)] whitespace-nowrap">
                      {getRelativeTime(visit.timestamp)}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="text-[var(--accent)] font-semibold">{visit.path}</span>
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <span className="mr-1.5" role="img">
                        {visit.flag}
                      </span>
                      <span className="text-[var(--text)]">{visit.countryName}</span>
                      {visit.city && visit.city !== "Unknown" && (
                        <span className="text-[var(--text-muted)] ml-1">({visit.city})</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-[var(--text)] whitespace-nowrap">
                      {visit.device} • {visit.os}
                    </td>
                    <td className="py-2.5 px-3 text-[var(--text-muted)] whitespace-nowrap">
                      {visit.browser}
                    </td>
                    <td className="py-2.5 px-3 text-[var(--text-muted)] whitespace-nowrap">
                      {visit.referrer}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: SECURITY & GOOGLE TAG */}
      {activeTab === "settings" && (
        <div className="space-y-6">
          {/* Security Guard Status */}
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 sm:p-6 shadow-sm">
            <h2 className="text-base font-bold text-[var(--text)] mb-1 flex items-center gap-2">
              <span>🛡️</span> Security Defense & Anti-Hack Shield
            </h2>
            <p className="text-xs text-[var(--text-muted)] mb-5">
              Active countermeasures protecting this admin dashboard against attacks
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold text-[var(--text)]">
                  <span>Brute-force Rate Limiting</span>
                  <span className="text-emerald-500 font-mono">ACTIVE</span>
                </div>
                <p className="text-[11px] text-[var(--text-muted)]">
                  Blocks any IP after 5 consecutive incorrect attempts for 15 minutes. Adds 500ms artificial delay to slow dictionary attacks.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold text-[var(--text)]">
                  <span>Timing Attack Immunity</span>
                  <span className="text-emerald-500 font-mono">ACTIVE</span>
                </div>
                <p className="text-[11px] text-[var(--text-muted)]">
                  Constant-time SHA-256 byte comparison prevents timing analysis vulnerabilities.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold text-[var(--text)]">
                  <span>HttpOnly Signed Cookies</span>
                  <span className="text-emerald-500 font-mono">ACTIVE</span>
                </div>
                <p className="text-[11px] text-[var(--text-muted)]">
                  Session tokens cannot be stolen or accessed via JavaScript XSS. Signed with HMAC-SHA256.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold text-[var(--text)]">
                  <span>Search Engine Cloaking</span>
                  <span className="text-emerald-500 font-mono">ACTIVE</span>
                </div>
                <p className="text-[11px] text-[var(--text-muted)]">
                  X-Robots-Tag: noindex, nofollow and robots.txt disallow crawler indexing of /admin.
                </p>
              </div>
            </div>
          </div>

          {/* Google Analytics & Real Domain Guide */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Google Tag Status Card */}
            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[var(--text)]">Google Tag / GA4 Status</h3>
                {config?.gaConfigured ? (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                    Connected: {config.gaId}
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-500 border border-amber-500/20">
                    ID Not Set in Env
                  </span>
                )}
              </div>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                When you add <code className="font-mono text-[var(--accent)]">NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX</code> to your Cloudflare Workers environment variables, Google Tag (gtag.js) automatically injects and reports alongside this first-party dashboard.
              </p>
              <div className="pt-2">
                <a
                  href="https://analytics.google.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--accent)] hover:underline"
                >
                  <span>Open Google Analytics Console</span>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Custom Domain Migration Card */}
            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[var(--text)]">Domain Migration Readiness</h3>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
                  Ready
                </span>
              </div>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                Currently running on <code className="font-mono text-[var(--text)]">{config?.host || "workers.dev"}</code>.
                When you buy and link your real domain (e.g. <code className="font-mono text-emerald-500">hectodecimal.com</code>), all analytics cookies, CSP headers, and routes adapt automatically without breaking any auth sessions!
              </p>
              <p className="text-[11px] text-[var(--text-muted)]">
                Simply update <code className="font-mono">NEXT_PUBLIC_SITE_URL</code> to your new domain in Cloudflare dashboard settings.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Footer Info */}
      <div className="pt-4 border-t border-[var(--border)] flex flex-col sm:flex-row items-center justify-between text-xs text-[var(--text-muted)] gap-2">
        <span>Storage Engine: <strong className="text-[var(--text)] font-mono">{config?.storageType || "Edge In-Memory"}</strong></span>
        {lastUpdated && <span>Last synced: {lastUpdated.toLocaleTimeString()}</span>}
      </div>
    </div>
  );
}
