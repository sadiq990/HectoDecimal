"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { messages } from "@/messages/en";

export interface ChartEntry {
  dec: number;
  hex: string;
  bin: string;
  ascii: string;
}

interface ChartFilterTableProps {
  entries: ChartEntry[];
}

export function ChartFilterTable({ entries }: ChartFilterTableProps) {
  const [filterQuery, setFilterQuery] = useState("");

  const filteredEntries = useMemo(() => {
    const q = filterQuery.trim().toLowerCase();
    if (!q) return entries;
    return entries.filter(
      (item) =>
        item.hex.toLowerCase().includes(q) ||
        String(item.dec).includes(q) ||
        item.bin.includes(q) ||
        item.ascii.toLowerCase().includes(q)
    );
  }, [entries, filterQuery]);

  return (
    <div className="space-y-4">
      {/* Search Filter Input */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)]">
        <div className="relative flex-1">
          <input
            type="search"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            placeholder={messages.common.filterPlaceholder}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--surface-raised)] border border-[var(--border)] text-sm font-sans text-[var(--text)] placeholder:text-[var(--text-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            aria-label="Filter hexadecimal chart entries"
          />
          <svg
            className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>

        <div className="text-xs font-mono-numbers text-[var(--text-muted)] px-1 shrink-0">
          {messages.chart.totalRows
            .replace("{count}", String(filteredEntries.length))
            .replace("{total}", String(entries.length))}
        </div>
      </div>

      {/* Semantic Table with Sticky Header */}
      <div className="overflow-x-auto rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-xs max-h-[700px] overflow-y-auto">
        <table className="w-full text-left text-sm border-collapse">
          <caption className="sr-only">
            Hexadecimal to decimal, binary, and ASCII reference conversion chart for bytes 0 to 255
          </caption>
          <thead className="sticky top-0 z-20 bg-[var(--surface-raised)] text-xs uppercase tracking-wider text-[var(--text-muted)] border-b border-[var(--border)] shadow-xs">
            <tr>
              <th scope="col" className="px-4 py-3.5 font-bold">
                {messages.chart.colHex}
              </th>
              <th scope="col" className="px-4 py-3.5 font-bold">
                {messages.chart.colDec}
              </th>
              <th scope="col" className="px-4 py-3.5 font-bold">
                {messages.chart.colBin}
              </th>
              <th scope="col" className="px-4 py-3.5 font-bold">
                {messages.chart.colAscii}
              </th>
              <th scope="col" className="px-4 py-3.5 font-bold text-right">
                Page
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)] font-mono-numbers text-xs sm:text-sm">
            {filteredEntries.length > 0 ? (
              filteredEntries.map((row) => (
                <tr
                  key={row.dec}
                  className="hover:bg-[var(--surface-raised)]/60 transition-colors"
                >
                  <td className="px-4 py-2.5 font-bold text-[var(--accent)]">{row.hex}</td>
                  <td className="px-4 py-2.5 text-[var(--text)]">{row.dec}</td>
                  <td className="px-4 py-2.5 text-[var(--text-muted)]">{row.bin}</td>
                  <td className="px-4 py-2.5 font-sans text-xs text-[var(--text)]">
                    {row.ascii}
                  </td>
                  <td className="px-4 py-2.5 text-right font-sans">
                    <Link
                      href={`/hex-to-decimal/${row.hex}`}
                      className="text-xs font-semibold text-[var(--accent)] hover:underline inline-block py-1 px-2 rounded hover:bg-[var(--accent-light)]"
                    >
                      Inspect →
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-8 text-center text-[var(--text-muted)] font-sans">
                  {messages.chart.noResults}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
