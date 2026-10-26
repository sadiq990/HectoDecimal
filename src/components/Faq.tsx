import { messages } from "@/messages/en";

export interface FaqItem {
  question: string;
  answer: string;
}

interface FaqProps {
  items: FaqItem[];
  title?: string;
}

export function Faq({ items, title = messages.common.faqHeading }: FaqProps) {
  if (!items || items.length === 0) return null;

  return (
    <section aria-labelledby="faq-section-heading" className="mt-16 w-full">
      <div className="text-center sm:text-left mb-8">
        <h2
          id="faq-section-heading"
          className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text)]"
        >
          {title}
        </h2>
        <p className="text-sm text-[var(--text-muted)] mt-1 max-w-2xl">
          Everything you need to know about precision number base conversion and mathematical rules.
        </p>
      </div>

      <div className="space-y-4">
        {items.map((faq, index) => (
          <details
            key={index}
            className="group rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 transition-all open:shadow-xs open:border-[var(--accent)]/40"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between font-semibold text-[var(--text)] text-base select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded-lg p-1">
              <span>{faq.question}</span>
              <span className="ml-4 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--surface-raised)] text-[var(--text-muted)] transition-transform group-open:rotate-180 group-open:text-[var(--accent)]">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </summary>
            <div className="mt-3 pt-3 border-t border-[var(--border-subtle)] text-sm sm:text-base leading-relaxed text-[var(--text-muted)]">
              {faq.answer}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
