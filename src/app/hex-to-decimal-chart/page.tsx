import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ChartFilterTable, type ChartEntry } from "@/components/ChartFilterTable";
import { Faq } from "@/components/Faq";
import { RelatedConverters } from "@/components/RelatedConverters";
import { JsonLd } from "@/components/JsonLd";
import { messages } from "@/messages/en";
import {
  constructMetadata,
  getWebApplicationSchema,
  getBreadcrumbSchema,
  getFaqSchema,
} from "@/lib/seo";

export const metadata: Metadata = constructMetadata({
  title: "Hex to Decimal Chart (0–255) – Printable Reference Table | HexDec",
  description:
    "Complete 1-byte lookup table mapping hex, decimal, binary, and ASCII from 0 to 255 (00 to FF). Searchable, printable, with sticky headers and fast filter.",
  canonicalPath: "/hex-to-decimal-chart",
  keywords: [
    "hex to decimal chart",
    "hex chart",
    "hexadecimal to decimal chart",
    "hex to decimal table",
    "ascii hex chart 0 to 255",
    "byte conversion chart",
  ],
});

// Precompute 0 to 255 entries server-side
function generateChartEntries(): ChartEntry[] {
  const entries: ChartEntry[] = [];
  const CONTROL_NAMES: Record<number, string> = {
    0: "NUL (Null)",
    1: "SOH (Start of Heading)",
    2: "STX (Start of Text)",
    3: "ETX (End of Text)",
    4: "EOT (End of Transmission)",
    5: "ENQ (Enquiry)",
    6: "ACK (Acknowledge)",
    7: "BEL (Bell)",
    8: "BS (Backspace)",
    9: "TAB (Horizontal Tab)",
    10: "LF (Line Feed)",
    11: "VT (Vertical Tab)",
    12: "FF (Form Feed)",
    13: "CR (Carriage Return)",
    14: "SO (Shift Out)",
    15: "SI (Shift In)",
    16: "DLE (Data Link Escape)",
    17: "DC1 (Device Control 1)",
    18: "DC2 (Device Control 2)",
    19: "DC3 (Device Control 3)",
    20: "DC4 (Device Control 4)",
    21: "NAK (Negative Acknowledge)",
    22: "SYN (Synchronous Idle)",
    23: "ETB (End of Transmission Block)",
    24: "CAN (Cancel)",
    25: "EM (End of Medium)",
    26: "SUB (Substitute)",
    27: "ESC (Escape)",
    28: "FS (File Separator)",
    29: "GS (Group Separator)",
    30: "RS (Record Separator)",
    31: "US (Unit Separator)",
    32: "[Space]",
    127: "DEL (Delete)",
  };

  for (let i = 0; i <= 255; i++) {
    const hex = i.toString(16).toUpperCase().padStart(2, "0");
    const bin = i.toString(2).padStart(8, "0");
    const binFormatted = `${bin.slice(0, 4)} ${bin.slice(4)}`;

    let ascii = CONTROL_NAMES[i] ?? "";
    if (!ascii) {
      if (i >= 33 && i <= 126) {
        ascii = `'${String.fromCharCode(i)}'`;
      } else {
        ascii = `Extended ASCII (${i})`;
      }
    }

    entries.push({
      dec: i,
      hex,
      bin: binFormatted,
      ascii,
    });
  }

  return entries;
}

export default function HexChartPage() {
  const chartEntries = generateChartEntries();

  const breadcrumbItems = [
    { label: messages.nav.chart, href: "/hex-to-decimal-chart" },
  ];

  const chartFaqs = [
    {
      question: "What values does this hexadecimal chart cover?",
      answer:
        "This table covers all 256 possible values of an 8-bit byte, spanning decimal 0 to 255 (hex 00 to FF, binary 0000 0000 to 1111 1111), along with their standard ASCII character interpretations.",
    },
    {
      question: "How do I print this hex chart?",
      answer:
        "Press Cmd+P (Mac) or Ctrl+P (Windows) in your browser. The page CSS automatically optimizes the layout for standard letter and A4 printer paper.",
    },
    {
      question: "Why does the chart stop at 255 (FF)?",
      answer:
        "In computer architecture, 8 bits make up 1 standard byte, which yields 2⁸ = 256 discrete values. For higher values (like 16-bit words or 32-bit integers), use our live converter widget.",
    },
    {
      question: "What are the non-printable ASCII control characters (0–31)?",
      answer:
        "Values 0 to 31 were originally established in teletype protocols to coordinate data flow (such as NUL for null, LF for line feed, CR for carriage return, and TAB for tabulation).",
    },
    {
      question: "Can I search for a specific character or binary nibble?",
      answer:
        "Yes. Use the live filter box at the top of the chart to search instantaneously by hex code, decimal number, binary pattern, or ASCII character name.",
    },
  ];

  const jsonLdData = [
    getWebApplicationSchema(
      "Hex to Decimal Chart (0-255)",
      "Searchable and printable hexadecimal to decimal conversion chart",
      "/hex-to-decimal-chart"
    ),
    getBreadcrumbSchema(breadcrumbItems),
    getFaqSchema(chartFaqs),
  ];

  return (
    <>
      <JsonLd data={jsonLdData} />

      <article className="w-full space-y-10">
        <Breadcrumbs items={breadcrumbItems} />

        <section className="text-center space-y-3 sm:space-y-4 max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[var(--text)]">
            Hex to Decimal <span className="text-gradient">Chart</span> (0–255)
          </h1>
          <p className="text-base sm:text-lg text-[var(--text-muted)] max-w-2xl mx-auto leading-relaxed">
            {messages.chart.description} Filter by any column or inspect individual values with detailed step-by-step mathematical breakdowns.
          </p>
        </section>

        {/* Searchable and Filterable Semantic Table */}
        <section aria-label="Hex to Decimal Reference Table">
          <ChartFilterTable entries={chartEntries} />
        </section>

        <Faq items={chartFaqs} />

        <RelatedConverters currentPath="/hex-to-decimal-chart" />
      </article>
    </>
  );
}
