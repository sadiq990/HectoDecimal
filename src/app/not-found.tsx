import Link from "next/link";
import { Converter } from "@/components/Converter";
import { RelatedConverters } from "@/components/RelatedConverters";

export default function NotFound() {
  return (
    <article className="w-full space-y-10">
      <section className="text-center space-y-3 max-w-2xl mx-auto pt-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--danger-bg)] border border-[var(--danger)]/30 text-xs font-semibold text-[var(--danger)] mb-2">
          <span>Error 404</span>
          <span>•</span>
          <span>Page Not Found</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[var(--text)]">
          Page Not <span className="text-gradient">Found</span>
        </h1>

        <p className="text-sm sm:text-base text-[var(--text-muted)] leading-relaxed">
          The requested URL does not exist or may have moved. You can still use our live number base converter below or return to the{" "}
          <Link href="/" className="text-[var(--accent)] underline font-medium">
            home page
          </Link>
          .
        </p>
      </section>

      {/* Live Converter is still accessible */}
      <section aria-label="Interactive Number Base Converter">
        <Converter
          initialFromBase={16}
          initialToBase={10}
          initialValue="404"
          showTabs={true}
        />
      </section>

      <RelatedConverters currentPath="/404" />
    </article>
  );
}
