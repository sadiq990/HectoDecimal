"use client";

import { useState } from "react";
import type { StepsResult } from "@/lib/steps";
import { messages } from "@/messages/en";

interface StepsTableProps {
  steps: StepsResult | null;
  baseName?: string;
}

export function StepsTable({ steps, baseName = "hexadecimal" }: StepsTableProps) {
  const [mobileExpanded, setMobileExpanded] = useState(true);

  if (!steps || steps.rows.length === 0) {
    return null;
  }

  const baseNumber = steps.fromBase;

  return (
    <section
      aria-labelledby="steps-heading"
      className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6 shadow-sm transition-colors"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[var(--border)]">
        <div>
          <h2 id="steps-heading" className="text-lg font-bold tracking-tight text-[var(--text)]">
            {messages.steps.title}
          </h2>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            {messages.steps.subtitle} (Base {baseNumber} → Base 10)
          </p>
        </div>

        {/* Mobile toggle button */}
        <button
          type="button"
          onClick={() => setMobileExpanded(!mobileExpanded)}
          className="sm:hidden self-start text-xs font-semibold px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface-raised)] text-[var(--text)]"
          aria-expanded={mobileExpanded}
        >
          {mobileExpanded ? messages.steps.toggleHide : messages.steps.toggleShow}
        </button>
      </div>

      <div className={`${mobileExpanded ? "block" : "hidden sm:block"} mt-4 space-y-4`}>
        {/* Positional Table */}
        <div className="overflow-x-auto rounded-xl border border-[var(--border)]">
          <table className="w-full text-left text-sm">
            <caption className="sr-only">
              Step by step positional breakdown from {baseName} to decimal
            </caption>
            <thead className="bg-[var(--surface-raised)] text-xs uppercase tracking-wider text-[var(--text-muted)] border-b border-[var(--border)]">
              <tr>
                <th scope="col" className="px-4 py-3 font-semibold">
                  {messages.steps.digitCol}
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  {messages.steps.posCol}
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  {messages.steps.powerCol.replace("{base}", String(baseNumber))}
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  {messages.steps.decimalValueCol}
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  {messages.steps.productCol}
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  {messages.steps.subtotalCol}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)] font-mono-numbers text-xs sm:text-sm">
              {steps.rows.map((row, idx) => {
                if (row.isEllipsis) {
                  return (
                    <tr
                      key="ellipsis"
                      className="bg-[var(--surface-raised)]/50 text-[var(--text-muted)] italic text-center"
                    >
                      <td colSpan={6} className="py-2.5 px-4 font-sans text-xs">
                        {messages.steps.ellipsisRow.replace(
                          "{count}",
                          String(row.omittedCount ?? 0)
                        )}
                      </td>
                    </tr>
                  );
                }

                return (
                  <tr
                    key={`${row.position}-${idx}`}
                    className="hover:bg-[var(--surface-raised)]/40 transition-colors"
                  >
                    <td className="px-4 py-2.5 font-bold text-[var(--accent)]">{row.digit}</td>
                    <td className="px-4 py-2.5 text-[var(--text-muted)]">{row.position}</td>
                    <td className="px-4 py-2.5 text-[var(--text-muted)]">
                      <span className="font-semibold text-[var(--text)]">
                        {row.powerFormatted}
                      </span>{" "}
                      ({row.power})
                    </td>
                    <td className="px-4 py-2.5 text-[var(--text-muted)]">{row.value}</td>
                    <td className="px-4 py-2.5 text-[var(--text)]">
                      {row.value} × {row.power} ={" "}
                      <span className="font-semibold text-[var(--text)]">{row.product}</span>
                    </td>
                    <td className="px-4 py-2.5 font-semibold text-[var(--text)]">
                      {row.runningSum}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Formula breakdown card */}
        <div className="p-4 rounded-xl bg-[var(--surface-raised)] border border-[var(--border)] space-y-2">
          <div className="text-xs uppercase tracking-wider text-[var(--text-muted)] font-semibold">
            {messages.steps.formulaSummary}
          </div>
          <div className="font-mono-numbers text-sm sm:text-base text-[var(--text)] break-all font-medium">
            {steps.formula}
          </div>
          <div className="pt-2 border-t border-[var(--border)] flex items-center justify-between text-sm">
            <span className="font-medium text-[var(--text-muted)]">
              {messages.steps.resultBadge}
            </span>
            <span className="font-mono-numbers font-bold text-base sm:text-lg text-[var(--accent)]">
              {steps.finalSum}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
