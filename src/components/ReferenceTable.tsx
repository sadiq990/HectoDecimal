import { messages } from "@/messages/en";

export interface ReferenceRow {
  col1: string;
  col2: string;
  col3?: string;
  note?: string;
}

interface ReferenceTableProps {
  title?: string;
  caption: string;
  headers: [string, string, string?];
  rows: ReferenceRow[];
}

export function ReferenceTable({
  title = messages.common.referenceTableHeading,
  caption,
  headers,
  rows,
}: ReferenceTableProps) {
  return (
    <section aria-labelledby="ref-table-heading" className="mt-16 w-full">
      <div className="mb-6">
        <h2
          id="ref-table-heading"
          className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text)]"
        >
          {title}
        </h2>
        <p className="text-sm text-[var(--text-muted)] mt-1">
          Common benchmark values and fast conversion mappings.
        </p>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
        <table className="w-full text-left text-sm">
          <caption className="sr-only">{caption}</caption>
          <thead className="bg-[var(--surface-raised)] text-xs uppercase tracking-wider text-[var(--text-muted)] border-b border-[var(--border)]">
            <tr>
              <th scope="col" className="px-4 py-3 font-semibold">
                {headers[0]}
              </th>
              <th scope="col" className="px-4 py-3 font-semibold">
                {headers[1]}
              </th>
              {headers[2] && (
                <th scope="col" className="px-4 py-3 font-semibold">
                  {headers[2]}
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)] font-mono-numbers text-xs sm:text-sm">
            {rows.map((row, idx) => (
              <tr key={idx} className="hover:bg-[var(--surface-raised)]/50 transition-colors">
                <td className="px-4 py-3 font-semibold text-[var(--accent)]">{row.col1}</td>
                <td className="px-4 py-3 text-[var(--text)]">{row.col2}</td>
                {headers[2] && (
                  <td className="px-4 py-3 text-[var(--text-muted)]">{row.col3 ?? row.note}</td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
