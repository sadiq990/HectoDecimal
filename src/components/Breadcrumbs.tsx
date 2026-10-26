import Link from "next/link";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-1.5 text-xs text-[var(--text-muted)]">
        <li>
          <Link
            href="/"
            className="hover:text-[var(--text)] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--accent)] rounded px-1"
          >
            Home
          </Link>
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-1.5">
              <span className="opacity-40" aria-hidden="true">
                /
              </span>
              {isLast || !item.href ? (
                <span
                  className="font-medium text-[var(--text)] truncate max-w-[200px] sm:max-w-none"
                  aria-current="page"
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="hover:text-[var(--text)] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--accent)] rounded px-1"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
