"use client";

import { useState, useDeferredValue, useEffect, useRef, useTransition } from "react";
import Link from "next/link";
import { convert, type SupportedBase, BASE_NAMES } from "@/lib/convert";
import { CopyButton } from "./CopyButton";
import { StepsTable } from "./StepsTable";
import { messages } from "@/messages/en";

export interface ConverterProps {
  initialFromBase?: SupportedBase;
  initialToBase?: SupportedBase;
  initialValue?: string;
  showTabs?: boolean;
}

const CONVERTER_MODES = [
  { from: 16, to: 10, label: "Hex → Dec", path: "/hex-to-decimal" },
  { from: 10, to: 16, label: "Dec → Hex", path: "/decimal-to-hex" },
  { from: 2, to: 10, label: "Bin → Dec", path: "/binary-to-decimal" },
  { from: 10, to: 2, label: "Dec → Bin", path: "/decimal-to-binary" },
  { from: 16, to: 2, label: "Hex → Bin", path: "/hex-to-binary" },
  { from: 2, to: 16, label: "Bin → Hex", path: "/binary-to-hex" },
] as const;

const EXAMPLE_CHIPS: Record<SupportedBase, string[]> = {
  16: ["FF", "7DE", "1A3F", "0xDEADBEEF"],
  10: ["255", "2014", "6719", "3735928559"],
  2: ["11111111", "11111011110", "10100101", "11001100"],
};

export function Converter({
  initialFromBase = 16,
  initialToBase = 10,
  initialValue = "",
  showTabs = true,
}: ConverterProps) {
  const [fromBase, setFromBase] = useState<SupportedBase>(initialFromBase);
  const [toBase, setToBase] = useState<SupportedBase>(initialToBase);
  const [inputValue, setInputValue] = useState(initialValue);

  // Formatting preferences
  const [groupDigits, setGroupDigits] = useState(false);
  const [uppercase, setUppercase] = useState(true);
  const [groupNibbles, setGroupNibbles] = useState(true);

  const inputRef = useRef<HTMLInputElement>(null);
  const [, startTransition] = useTransition();

  // Use deferred value for heavy calculation to keep input 120fps responsive
  const deferredInput = useDeferredValue(inputValue);

  // Perform live conversion
  const conversionResult = convert(deferredInput, fromBase, toBase, {
    groupDigits,
    uppercase,
    groupNibbles,
  });

  // Focus on desktop only on mount
  useEffect(() => {
    if (window.matchMedia("(min-width: 768px)").matches) {
      inputRef.current?.focus();
    }
  }, []);

  // Global keyboard shortcuts:
  // "/" focuses input, "Escape" clears, "Cmd/Ctrl+Shift+C" copies result
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      const isInputFocused =
        activeEl?.tagName === "INPUT" ||
        activeEl?.tagName === "TEXTAREA" ||
        activeEl?.getAttribute("contenteditable") === "true";

      // "/" to focus input
      if (e.key === "/" && !isInputFocused) {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
        return;
      }

      // "Escape" to clear
      if (e.key === "Escape" && isInputFocused) {
        e.preventDefault();
        setInputValue("");
        return;
      }

      // "Cmd/Ctrl + Shift + C" to copy result
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && (e.key === "C" || e.key === "c")) {
        e.preventDefault();
        if (conversionResult.ok && conversionResult.output) {
          navigator.clipboard.writeText(conversionResult.output);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [conversionResult]);

  // Swap direction and flip values
  const handleSwap = () => {
    const nextFrom = toBase;
    const nextTo = fromBase;
    const nextInput = conversionResult.ok ? conversionResult.rawOutput : "";

    startTransition(() => {
      setFromBase(nextFrom);
      setToBase(nextTo);
      setInputValue(nextInput);
    });

    inputRef.current?.focus();
  };

  // Handle paste button
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setInputValue(text);
        inputRef.current?.focus();
      }
    } catch {
      // Permission denied or not supported, ignore silently
    }
  };

  const handleClear = () => {
    setInputValue("");
    inputRef.current?.focus();
  };

  const fromName = BASE_NAMES[fromBase];
  const toName = BASE_NAMES[toBase];
  const chips = EXAMPLE_CHIPS[fromBase] ?? [];

  const hasError = !conversionResult.ok && conversionResult.code !== "EMPTY";

  return (
    <div className="w-full">
      {/* Direction Tabs / Mode Selector */}
      {showTabs && (
        <div className="mb-6 flex items-center justify-start sm:justify-center overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-[var(--surface-raised)] border border-[var(--border)] shadow-xs">
            {CONVERTER_MODES.map((mode) => {
              const isSelected = fromBase === mode.from && toBase === mode.to;
              return (
                <Link
                  key={`${mode.from}-${mode.to}`}
                  href={mode.path}
                  onClick={() => {
                    setFromBase(mode.from);
                    setToBase(mode.to);
                  }}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap min-h-[36px] flex items-center ${
                    isSelected
                      ? "bg-[var(--surface)] text-[var(--text)] shadow-xs border border-[var(--border)] font-bold"
                      : "text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface)]/50"
                  }`}
                >
                  {mode.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Converter Glass Card */}
      <div
        className={`relative rounded-3xl border bg-[var(--surface)] p-6 sm:p-8 transition-all shadow-[var(--shadow-soft)] ${
          hasError
            ? "border-[var(--danger)] ring-2 ring-[var(--danger)]/20"
            : "border-[var(--border)]"
        }`}
      >
        {/* Two Columns: Input (Left) & Result (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative items-stretch">
          {/* Left Field: Input */}
          <div className="flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <label
                htmlFor="converter-input"
                className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-2"
              >
                <span>{fromName.toUpperCase()}</span>
                <span className="text-[10px] font-medium text-[var(--text-muted)] opacity-70">
                  (Base {fromBase})
                </span>
              </label>

              {/* Paste & Clear Action Buttons */}
              <div className="flex items-center gap-1.5">
                {inputValue && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="text-xs text-[var(--text-muted)] hover:text-[var(--text)] px-2 py-1 rounded-md transition-colors"
                    title={messages.common.clear}
                    aria-label={messages.common.clear}
                  >
                    {messages.common.clear}
                  </button>
                )}
                <button
                  type="button"
                  onClick={handlePaste}
                  className="text-xs text-[var(--text-muted)] hover:text-[var(--text)] px-2 py-1 rounded-md transition-colors"
                  title={messages.common.paste}
                  aria-label={messages.common.paste}
                >
                  {messages.common.paste}
                </button>
              </div>
            </div>

            {/* Input Box */}
            <div className="relative">
              <input
                ref={inputRef}
                id="converter-input"
                type="text"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={messages.converter.inputPlaceholder.replace("{base}", fromName)}
                className="w-full rounded-2xl bg-[var(--surface-raised)] border border-[var(--border)] px-4 py-4 sm:py-5 text-2xl sm:text-3xl font-mono-numbers text-[var(--text)] placeholder:text-[var(--text-muted)]/40 focus-visible:outline-none focus-visible:border-[var(--accent)] focus-visible:ring-2 focus-visible:ring-[var(--ring)] transition-all min-h-[76px]"
              />
            </div>

            {/* Example Chips */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] text-[var(--text-muted)] font-medium mr-1">
                {messages.converter.examplesLabel}
              </span>
              {chips.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => {
                    setInputValue(chip);
                    inputRef.current?.focus();
                  }}
                  className="text-[11px] font-mono-numbers px-2 py-0.5 rounded-md bg-[var(--surface-raised)] hover:bg-[var(--border)] text-[var(--text)] border border-[var(--border)] transition-colors"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>

          {/* Center Swap Button (Absolute on desktop, Centered on mobile) */}
          <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            <button
              type="button"
              onClick={handleSwap}
              aria-label={messages.common.swap}
              title={messages.common.swap}
              className="w-11 h-11 rounded-full bg-[var(--surface)] border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M8 3 4 7l4 4" />
                <path d="M4 7h16" />
                <path d="m16 21 4-4-4-4" />
                <path d="M20 17H4" />
              </svg>
            </button>
          </div>

          {/* Mobile Swap Divider Button */}
          <div className="flex lg:hidden justify-center my-1">
            <button
              type="button"
              onClick={handleSwap}
              aria-label={messages.common.swap}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--surface-raised)] border border-[var(--border)] text-xs font-semibold text-[var(--text)] active:scale-95 transition-all"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M8 3 4 7l4 4" />
                <path d="M4 7h16" />
                <path d="m16 21 4-4-4-4" />
                <path d="M20 17H4" />
              </svg>
              <span>{messages.common.swap}</span>
            </button>
          </div>

          {/* Right Field: Result Output */}
          <div className="flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <label
                htmlFor="converter-output"
                className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-2"
              >
                <span>{toName.toUpperCase()}</span>
                <span className="text-[10px] font-medium text-[var(--text-muted)] opacity-70">
                  (Base {toBase})
                </span>
              </label>

              {/* Copy Button */}
              {conversionResult.ok && conversionResult.output && (
                <CopyButton value={conversionResult.output} />
              )}
            </div>

            {/* Output Display Box */}
            <div
              id="converter-output"
              role="region"
              aria-live="polite"
              aria-label={messages.converter.outputLabel}
              className="w-full rounded-2xl bg-[var(--surface-raised)] border border-[var(--border)] px-4 py-4 sm:py-5 min-h-[76px] flex items-center overflow-x-auto"
            >
              <span
                className={`text-2xl sm:text-3xl font-mono-numbers font-bold tracking-tight result-fade ${
                  conversionResult.ok && conversionResult.output
                    ? "text-[var(--accent)]"
                    : "text-[var(--text-muted)]/40 font-normal"
                }`}
              >
                {conversionResult.ok
                  ? conversionResult.output ||
                    messages.converter.outputPlaceholder
                  : messages.converter.outputPlaceholder}
              </span>
            </div>

            {/* Quick base badges */}
            <div className="flex items-center gap-2 pt-1 text-xs text-[var(--text-muted)]">
              <span>Target: Base {toBase}</span>
              {conversionResult.ok && conversionResult.output && (
                <span className="text-[11px] font-mono-numbers bg-[var(--surface-raised)] px-2 py-0.5 rounded border border-[var(--border)]">
                  {conversionResult.output.length} {conversionResult.output.length === 1 ? "char" : "chars"}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Inline Error State */}
        {hasError && (
          <div
            id="converter-error"
            role="alert"
            className="mt-4 p-3 rounded-xl bg-[var(--danger-bg)] border border-[var(--danger)] text-sm text-[var(--danger)] flex items-center gap-2.5"
          >
            <svg
              className="w-4 h-4 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2.5"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span className="font-medium">{conversionResult.error}</span>
          </div>
        )}

        {/* Format Options Bar */}
        <div className="mt-6 pt-4 border-t border-[var(--border)] flex flex-wrap items-center justify-between gap-3 text-xs text-[var(--text-muted)]">
          <span className="font-semibold">{messages.converter.optionsHeading}:</span>
          <div className="flex flex-wrap items-center gap-4">
            {toBase === 10 && (
              <label className="inline-flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={groupDigits}
                  onChange={(e) => setGroupDigits(e.target.checked)}
                  className="rounded border-[var(--border)] text-[var(--accent)] focus:ring-[var(--accent)]"
                />
                <span>{messages.converter.toggleSeparators}</span>
              </label>
            )}

            {toBase === 16 && (
              <label className="inline-flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={uppercase}
                  onChange={(e) => setUppercase(e.target.checked)}
                  className="rounded border-[var(--border)] text-[var(--accent)] focus:ring-[var(--accent)]"
                />
                <span>{messages.converter.toggleUppercase}</span>
              </label>
            )}

            {toBase === 2 && (
              <label className="inline-flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={groupNibbles}
                  onChange={(e) => setGroupNibbles(e.target.checked)}
                  className="rounded border-[var(--border)] text-[var(--accent)] focus:ring-[var(--accent)]"
                />
                <span>{messages.converter.toggleNibbles}</span>
              </label>
            )}
          </div>
        </div>
      </div>

      {/* Keyboard Shortcuts Hint Bar (Desktop only) */}
      <div className="hidden md:flex items-center justify-center gap-6 mt-3 text-xs text-[var(--text-muted)]">
        <span className="flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 rounded bg-[var(--surface-raised)] border border-[var(--border)] font-mono text-[10px]">
            /
          </kbd>
          <span>focus input</span>
        </span>
        <span className="flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 rounded bg-[var(--surface-raised)] border border-[var(--border)] font-mono text-[10px]">
            Esc
          </kbd>
          <span>clear</span>
        </span>
        <span className="flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 rounded bg-[var(--surface-raised)] border border-[var(--border)] font-mono text-[10px]">
            Ctrl/Cmd+Shift+C
          </kbd>
          <span>copy result</span>
        </span>
      </div>

      {/* Live Worked Steps Panel (for hex->dec and bin->dec) */}
      {conversionResult.ok && conversionResult.steps && (
        <StepsTable steps={conversionResult.steps} baseName={fromName} />
      )}
    </div>
  );
}
