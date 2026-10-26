<div align="center">

# ⚡ HexDec (HectoDecimal)

**The cleanest, fastest, and most privacy-focused number base converter on the web.**

[![Next.js](https://img.shields.io/badge/Next.js-15.2.1-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Vitest](https://img.shields.io/badge/Vitest-3.0-FCC72B?style=for-the-badge&logo=vitest&logoColor=black)](https://vitest.dev/)
[![Playwright](https://img.shields.io/badge/Playwright-1.50-2EAD33?style=for-the-badge&logo=playwright&logoColor=white)](https://playwright.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)

[Features](#-key-features) • [Conversion Tools](#-conversion-tools) • [Architecture](#-architecture) • [Getting Started](#-getting-started) • [Deployment](#-deployment)

</div>

---

## 📖 Overview

Most online number base converters are stuck in the 2000s—plagued by flashing banner ads, sluggish page loads, tiny input boxes, and arbitrary 16-character or 64-bit limits.

**HexDec** was created to set a new benchmark for developer utilities:
- **Instant Live Calculation:** Pure keystroke reactivity with zero "Convert" button friction.
- **Arbitrary Precision:** Built on native JavaScript `BigInt` arithmetic, supporting calculations exceeding 10,000 digits without floating-point precision loss.
- **Transparent Positional Math:** Shows the exact step-by-step formula and positional breakdown ($d \times 16^n$) for complete mathematical clarity.
- **100% Client-Side Privacy:** Zero server dependencies. Inputs and conversions never leave the user's browser.
- **Technical SEO Supremacy:** Engineered for top Google rankings with 285 statically generated SSG pages, valid Schema.org JSON-LD, and perfect Core Web Vitals.

---

## ✨ Key Features

| Feature | Description |
| :--- | :--- |
| **Keystroke Reactive** | Computes output on every keystroke with a subtle 120ms fade transition. |
| **BigInt Precision** | No 64-bit limits. Supports cryptographic keys and massive 10,000-character integers. |
| **Worked Math Tables** | Complete breakdown of digit weights, exponents, partial products, and running sums. |
| **Format Toggles** | Decimal comma grouping (`1,234,567`), uppercase/lowercase hex (`FF` vs `ff`), binary 4-bit nibbles. |
| **Design Tokens** | Calibrated Dark and Light modes meeting WCAG 2.2 AA contrast standards. |
| **Fast Shortcuts** | Desktop keyboard hints: `/` to focus, `Esc` to clear, `Ctrl/Cmd+Shift+C` to copy. |
| **One-Click Swap** | Circular swap button flips conversion direction and preserves the active value. |
| **Offline-Ready** | 100% Static Site Generation (SSG); runs anywhere without database or server requirements. |

---

## 🧮 Conversion Tools

HexDec includes dedicated pages for all 6 core conversion pairs:

| From Base | To Base | Route | Primary Use Case |
| :---: | :---: | :--- | :--- |
| **Hex (16)** | **Decimal (10)** | [`/hex-to-decimal`](/hex-to-decimal) | Memory addresses, byte values, hex RGB colors |
| **Decimal (10)** | **Hex (16)** | [`/decimal-to-hex`](/decimal-to-hex) | Converting integers to machine code & color channels |
| **Binary (2)** | **Decimal (10)** | [`/binary-to-decimal`](/binary-to-decimal) | Evaluating bitmasks, flags, and binary registers |
| **Decimal (10)** | **Binary (2)** | [`/decimal-to-binary`](/decimal-to-binary) | Bit-level inspection with 4-bit nibble groupings |
| **Hex (16)** | **Binary (2)** | [`/hex-to-binary`](/hex-to-binary) | 1-to-4 bit expansion for network packet inspection |
| **Binary (2)** | **Hex (16)** | [`/binary-to-hex`](/binary-to-hex) | Compressing binary streams into compact hex notation |

### Additional Resources
- **Printable Byte Reference Chart (`/hex-to-decimal-chart`):** Comprehensive 0 to 255 (00 to FF) reference table mapping Hex, Decimal, 8-Bit Binary, and ASCII characters with instant client-side filtering.
- **Engineering Conversion Guide (`/how-to-convert-hex-to-decimal`):** 1,200+ word technical guide detailing positional formulas, manual division algorithms, common student mistakes, and computer science applications.
- **264 Programmatic Long-Tail Pages (`/hex-to-decimal/[value]`):** Static landing pages for values `0` through `FF` plus key limits (`100`, `FFFF`, `7FFFFFFF`, `FFFFFFFF`) with individual ASCII mappings and RGB channel context.

---

## ⌨️ Desktop Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| <kbd>/</kbd> | Focus and select input field from anywhere on the page |
| <kbd>Esc</kbd> | Clear input and reset converter |
| <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>C</kbd> / <kbd>Cmd</kbd> + <kbd>Shift</kbd> + <kbd>C</kbd> | Copy converted result to clipboard |

---

## 🏛️ Architecture & SEO

```
├── public/                 # Static assets (icon.svg, apple-touch-icon, manifest)
├── scripts/                # Utility scripts (icon generation)
├── src/
│   ├── app/
│   │   ├── (tools)         # Tool pages (/hex-to-decimal, /decimal-to-hex, etc.)
│   │   ├── hex-to-decimal/[value]/  # 264 programmatic SSG pages
│   │   ├── hex-to-decimal-chart/    # 0-255 searchable & printable chart
│   │   ├── how-to-convert-hex-to-decimal/ # Technical tutorial & guide
│   │   ├── about/, privacy/, contact/    # Institutional pages
│   │   ├── api/og/route.ts # Dynamic SVG OG image generator
│   │   ├── llms.txt/route.ts # AI crawler reference file
│   │   ├── globals.css     # Tailwind v4 theme & CSS design tokens
│   │   ├── layout.tsx      # Root layout with Inter + JetBrains Mono & theme script
│   │   ├── page.tsx        # Home page (Hex to Decimal tool above the fold)
│   │   ├── sitemap.ts      # Dynamic XML sitemap generator
│   │   ├── robots.ts       # Robots.txt configuration
│   │   └── not-found.tsx   # Custom 404 with live converter access
│   ├── components/         # Clean modular UI components (Converter, StepsTable, etc.)
│   ├── config/             # Single source of truth config (site.ts)
│   ├── lib/                # Pure converter engine, steps generator, formatters, SEO
│   └── messages/           # Externalized localization strings (en.ts)
└── tests/                  # Vitest unit tests and Playwright e2e smoke tests
```

### Technical SEO Features
- **JSON-LD Schema Markup:** `WebApplication`, `FAQPage`, `BreadcrumbList`, `Article`, `WebSite`, and `Organization`.
- **Dynamic XML Sitemap:** Generated statically with priorities and weekly/monthly change frequencies.
- **AI Search Ready:** Includes `/llms.txt` route for LLM crawlers (Perplexity, ChatGPT, Claude).
- **Hardened Security Headers:** Strict CSP, `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, and `Permissions-Policy`.

---

## 🚀 Getting Started

### Prerequisites
- **Node.js:** v18.18+ or v20+ / v22+
- **npm:** v9+ or v10+

### Installation

```bash
# 1. Clone repository
git clone https://github.com/sadiq990/HectoDecimal.git
cd HectoDecimal

# 2. Install pinned dependencies
npm install

# 3. Create local environment file
cp .env.example .env.local

# 4. Start local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 🧪 Testing Suite

```bash
# Run Vitest unit & property tests (1,000 random round-trip tests)
npm run test

# Run TypeScript strict typecheck
npm run typecheck

# Run ESLint check
npm run lint

# Run Playwright end-to-end smoke test
npm run test:e2e

# Run production build (validates all 285 static pages)
npm run build
```

---

## 🚢 Deployment

Because HexDec is 100% statically generated (SSG) with zero database or backend dependencies, it can be deployed to any static host with zero configuration.

### Deploy to Vercel (Recommended)

1. Push your repository to GitHub:
   ```bash
   git add .
   git commit -m "feat: complete production hex converter website"
   git push -u origin main
   ```
2. Import the project on [Vercel](https://vercel.com/new).
3. Set the environment variable:
   - `NEXT_PUBLIC_SITE_URL`: `https://yourdomain.com`
4. Click **Deploy**.

### Deploy to Cloudflare Pages

```bash
npm run build
# Deploy the static output directory
npx wrangler pages deploy .next
```

---

## 📄 License

Distributed under the MIT License. See [`LICENSE`](LICENSE) for more information.

---

<div align="center">
Built with precision • 100% Client-Side Arithmetic • Zero Ads
</div>
