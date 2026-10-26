"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";
import { messages } from "@/messages/en";

const PRIMARY_LINKS = [
  { href: "/hex-to-decimal", label: messages.nav.hexToDec },
  { href: "/decimal-to-hex", label: messages.nav.decToHex },
  { href: "/binary-to-decimal", label: messages.nav.binToDec },
  { href: "/decimal-to-binary", label: messages.nav.decToBin },
];

const ALL_LINKS = [
  ...PRIMARY_LINKS,
  { href: "/hex-to-binary", label: messages.nav.hexToBin },
  { href: "/binary-to-hex", label: messages.nav.binToHex },
  { href: "/hex-to-decimal-chart", label: messages.nav.chart },
  { href: "/how-to-convert-hex-to-decimal", label: messages.nav.guide },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[var(--border)] bg-[var(--surface-glass)] backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand Wordmark Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 font-bold text-xl tracking-tight text-[var(--text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded-lg p-1"
          aria-label={`${messages.common.siteName} Home`}
        >
          {/* Logo Icon SVG */}
          <svg
            className="w-7 h-7 text-[var(--accent)] shrink-0"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <rect
              x="2"
              y="2"
              width="28"
              height="28"
              rx="8"
              stroke="currentColor"
              strokeWidth="2.5"
              fill="var(--accent-light)"
            />
            <path
              d="M10 10L22 22M22 10L10 22"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
          <span className="font-semibold tracking-tight">
            Hex<span className="text-[var(--accent)]">Dec</span>
          </span>
        </Link>

        {/* Center Desktop Navigation (4 tool links + chart/guide) */}
        <nav
          aria-label={messages.common.navigation}
          className="hidden md:flex items-center gap-1 lg:gap-2"
        >
          {PRIMARY_LINKS.map((link) => {
            const isActive =
              pathname === link.href || (pathname === "/" && link.href === "/hex-to-decimal");
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? "text-[var(--accent)] bg-[var(--accent-light)] font-semibold"
                    : "text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-raised)]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          <Link
            href="/hex-to-decimal-chart"
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              pathname === "/hex-to-decimal-chart"
                ? "text-[var(--accent)] bg-[var(--accent-light)] font-semibold"
                : "text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-raised)]"
            }`}
          >
            {messages.nav.chart}
          </Link>

          <Link
            href="/how-to-convert-hex-to-decimal"
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              pathname === "/how-to-convert-hex-to-decimal"
                ? "text-[var(--accent)] bg-[var(--accent-light)] font-semibold"
                : "text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-raised)]"
            }`}
          >
            {messages.nav.guide}
          </Link>
        </nav>

        {/* Right Action Bar */}
        <div className="flex items-center gap-2">
          <ThemeToggle />

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? messages.common.closeMenu : messages.common.menu}
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-xl transition-colors text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-raised)] border border-[var(--border)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          >
            {mobileMenuOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="4" x2="20" y1="12" y2="12" />
                <line x1="4" x2="20" y1="6" y2="6" />
                <line x1="4" x2="20" y1="18" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div
          className="md:hidden fixed inset-x-0 top-16 bottom-0 z-50 bg-[var(--surface)] border-t border-[var(--border)] p-6 overflow-y-auto flex flex-col justify-between"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation"
        >
          <div className="flex flex-col gap-2">
            <span className="text-xs uppercase tracking-wider text-[var(--text-muted)] font-semibold px-3 py-1">
              Converters
            </span>
            {ALL_LINKS.map((link) => {
              const isActive =
                pathname === link.href || (pathname === "/" && link.href === "/hex-to-decimal");
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`min-h-[44px] flex items-center px-4 py-2.5 rounded-xl text-base font-medium transition-colors ${
                    isActive
                      ? "bg-[var(--accent-light)] text-[var(--accent)] font-semibold"
                      : "text-[var(--text)] hover:bg-[var(--surface-raised)]"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="pt-6 border-t border-[var(--border)] flex items-center justify-between text-xs text-[var(--text-muted)]">
            <span>{messages.common.privacyNote}</span>
          </div>
        </div>
      )}
    </header>
  );
}
