"use client";

import { useState } from "react";
import { messages } from "@/messages/en";

interface CopyButtonProps {
  value: string;
  className?: string;
  label?: string;
}

export function CopyButton({ value, className = "", label }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!value) return;

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(value);
      } else {
        // Fallback for non-secure contexts or older browsers
        const textArea = document.createElement("textarea");
        textArea.value = value;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        textArea.remove();
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback failure handled silently
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      disabled={!value}
      aria-label={copied ? messages.common.copied : (label ?? messages.common.copyResult)}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] disabled:opacity-40 disabled:cursor-not-allowed ${
        copied
          ? "bg-[var(--success)] text-white shadow-sm"
          : "bg-[var(--surface-raised)] hover:bg-[var(--border)] text-[var(--text)] border border-[var(--border)]"
      } ${className}`}
    >
      {copied ? (
        <>
          <svg
            className="w-3.5 h-3.5 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2.5"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <span>{messages.common.copied}</span>
        </>
      ) : (
        <>
          <svg
            className="w-3.5 h-3.5 shrink-0 text-[var(--text-muted)]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
          <span>{label ?? messages.common.copyToClipboard}</span>
        </>
      )}
    </button>
  );
}
